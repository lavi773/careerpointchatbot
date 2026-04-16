import ReactMarkdown from "react-markdown";
import botAvatar from "@/assets/bot-avatar.png";

interface ChatBubbleProps {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBubble = ({ text, sender, timestamp }: ChatBubbleProps) => {
  const isBot = sender === "bot";
  const time = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex gap-2 animate-slide-up ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <img src={botAvatar} alt="Bot" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
      )}
      <div className={`max-w-[75%] ${isBot ? "" : "order-1"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? "bg-card border border-border rounded-bl-md shadow-sm"
              : "gradient-chat-user text-primary-foreground rounded-br-md shadow-md"
          }`}
        >
          {isBot ? (
            <div className="prose prose-sm max-w-none [&_p]:m-0 [&_strong]:text-foreground [&_li]:text-foreground">
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          ) : (
            <span>{text}</span>
          )}
        </div>
        <span className={`text-[10px] text-muted-foreground mt-1 block ${isBot ? "" : "text-right"}`}>
          {time}
        </span>
      </div>
    </div>
  );
};

export default ChatBubble;
