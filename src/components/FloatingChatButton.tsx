import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const FloatingChatButton = () => (
  <Link
    to="/chat"
    className="fixed bottom-6 right-6 z-50 p-4 rounded-full gradient-primary text-primary-foreground shadow-xl hover:shadow-2xl transition-all animate-float animate-pulse-glow"
  >
    <MessageCircle className="w-6 h-6" />
  </Link>
);

export default FloatingChatButton;
