import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import UnresolvedQueryForm from "./UnresolvedQueryForm";
import { processQuery, matchSharedFaq, type ChatMessage } from "@/lib/nlpEngine";
import { quickActions } from "@/data/faqData";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchMemory,
  setMemory,
  answerFromMemory,
  extractTeaching,
  type MemoryMap,
} from "@/lib/memoryEngine";

interface SharedFaq {
  question: string;
  answer: string;
  keywords: string[];
}

const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: `👋 Hi${
        user?.email ? ` **${user.email.split("@")[0]}**` : ""
      }! I'm **CPU Bot** 🎓\n\nAsk me about exams, fees, hostel, placements, courses, or campus life. I also remember things you teach me — try saying *"our viva is on 30 April"*. 😊`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [memory, setMemoryState] = useState<MemoryMap>({});
  const [sharedFaqs, setSharedFaqs] = useState<SharedFaq[]>([]);
  const [pendingFallback, setPendingFallback] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Load memory, shared FAQs + recent chat history
  useEffect(() => {
    if (!user) return;
    fetchMemory(user.id).then(setMemoryState);

    supabase
      .from("shared_faqs")
      .select("question, answer, keywords")
      .then(({ data }) => setSharedFaqs((data as SharedFaq[]) ?? []));

    supabase
      .from("chat_messages")
      .select("id, question, answer, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const restored: ChatMessage[] = [];
        for (const row of data) {
          restored.push({
            id: `u-${row.id}`,
            text: row.question,
            sender: "user",
            timestamp: new Date(row.created_at),
          });
          restored.push({
            id: `b-${row.id}`,
            text: row.answer,
            sender: "bot",
            timestamp: new Date(row.created_at),
          });
        }
        setMessages((prev) => [prev[0], ...restored]);
      });
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, pendingFallback]);

  const handleSend = useCallback(
    (text?: string) => {
      const query = (text || input).trim();
      if (!query || !user) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: query,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      setPendingFallback(null);

      setTimeout(async () => {
        const teaching = extractTeaching(query);
        let response: string;
        let isFallback = false;

        if (teaching) {
          await setMemory(user.id, teaching.key, teaching.value);
          setMemoryState((m) => ({ ...m, [teaching.key]: teaching.value }));
          response = `✅ Got it! I'll remember that **${teaching.key.replace(/_/g, " ")}** is **${teaching.value}**.`;
        } else {
          // 1) personal memory
          const memAns = answerFromMemory(query, memory);
          if (memAns) {
            response = memAns;
          } else {
            // 2) admin-curated shared FAQs (resolved queries land here)
            const sharedMatch = matchSharedFaq(query, sharedFaqs);
            if (sharedMatch) {
              response = sharedMatch.answer;
            } else {
              // 3) static FAQ NLP
              const result = processQuery(query);
              response = result.text;
              isFallback = !result.matched;
            }
          }
        }

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);

        if (isFallback) setPendingFallback(query);

        await supabase
          .from("chat_messages")
          .insert({ user_id: user.id, question: query, answer: response });
      }, 600 + Math.random() * 500);
    },
    [input, user, memory, sharedFaqs]
  );

  const toggleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser. Try Chrome!");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {pendingFallback && (
          <UnresolvedQueryForm
            initialQuestion={pendingFallback}
            onSubmitted={() => setPendingFallback(null)}
            onCancel={() => setPendingFallback(null)}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.query)}
                className="px-3 py-1.5 text-xs rounded-full border border-border bg-card hover:bg-muted transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleVoice}
            className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
              isListening
                ? "bg-destructive text-destructive-foreground animate-mic-pulse"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask, or teach me (e.g. 'our viva is on 30 April')..."
            className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 rounded-full gradient-primary text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-40"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
