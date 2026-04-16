import { useState, useEffect } from "react";
import { Trash2, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getHistory, clearHistory } from "@/lib/nlpEngine";

const HistoryPage = () => {
  const [history, setHistory] = useState<{ question: string; answer: string; timestamp: string }[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-2xl font-bold">
            <Clock className="w-6 h-6 inline mr-2 text-primary" />
            Chat History
          </h1>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No chat history yet 💬</p>
            <p className="text-sm mt-1">Start a conversation with UniBot to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 20).map((item, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm mb-2">🙋 {item.question}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">🤖 {item.answer.replace(/[*#]/g, "").slice(0, 150)}...</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
