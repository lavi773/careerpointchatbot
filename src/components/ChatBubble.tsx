import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import botAvatar from "@/assets/bot-avatar.png";

interface ChatBubbleProps {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  showFeedback?: boolean;
}

const ChatBubble = ({ text, sender, timestamp, showFeedback = true }: ChatBubbleProps) => {
  const isBot = sender === "bot";
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const time = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex gap-2 animate-slide-up ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
      )}
      <div className={`max-w-[80%] sm:max-w-[75%] ${isBot ? "" : "order-1"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? "bg-card border border-border rounded-bl-md shadow-sm"
              : "gradient-chat-user text-primary-foreground rounded-br-md shadow-md"
          }`}
        >
          {isBot ? (
            <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:m-0 [&_strong]:text-foreground [&_li]:text-foreground">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          ) : (
            <span className="whitespace-pre-wrap break-words">{text}</span>
          )}
        </div>
        <div className={`flex items-center gap-2 mt-1 ${isBot ? "" : "justify-end"}`}>
          <span className="text-[10px] text-muted-foreground">{time}</span>
          {isBot && showFeedback && (
            <div className="flex items-center gap-1">
              {feedback === null ? (
                <>
                  <button
                    onClick={() => setFeedback("up")}
                    aria-label="Helpful"
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-secondary transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setFeedback("down")}
                    aria-label="Not helpful"
                    className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Check className="w-3 h-3" />
                  {feedback === "up" ? "Thanks for your feedback!" : "We'll improve, thanks!"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
