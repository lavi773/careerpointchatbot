import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";
import { processQuery, saveToHistory, type ChatMessage } from "@/lib/nlpEngine";
import { quickActions } from "@/data/faqData";

const ChatInterface = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "👋 Hello! I'm **UniBot**, your university assistant! 🎓\n\nAsk me anything about exams, fees, hostel, admissions, or campus life. I'm here to help! 😊",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(
    (text?: string) => {
      const query = (text || input).trim();
      if (!query) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: query,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        const response = processQuery(query);
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        saveToHistory(query, response);
      }, 800 + Math.random() * 700);
    },
    [input]
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

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
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
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} text={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
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

      {/* Input */}
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
            placeholder="Type your question here..."
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
