import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trash2, Clock, MessageSquare, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getHistory, clearHistory } from "@/lib/nlpEngine";

interface HistoryItem {
  question: string;
  answer: string;
  timestamp: string;
}

const groupByDay = (items: HistoryItem[]) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const groups: Record<string, HistoryItem[]> = {};
  for (const item of items) {
    const day = new Date(item.timestamp).toDateString();
    let key = day;
    if (day === today) key = "Today";
    else if (day === yesterday) key = "Yesterday";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
};

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    if (confirm("Clear all chat history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const filtered = history.filter(
    (h) => h.question.toLowerCase().includes(search.toLowerCase()) || h.answer.toLowerCase().includes(search.toLowerCase())
  );
  const grouped = groupByDay(filtered.slice(0, 50));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Chat History
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {history.length} {history.length === 1 ? "conversation" : "conversations"} saved
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>

        {history.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your conversations..."
              className="w-full bg-card border border-border rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-base sm:text-lg font-medium">No chat history yet 💬</p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
              Start a conversation with CPU Bot to see your history here.
            </p>
            <Link
              to="/chat"
              className="inline-block px-6 py-2.5 rounded-full gradient-primary text-primary-foreground font-medium text-sm shadow-md hover:shadow-lg transition-all"
            >
              Start Chatting →
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 text-sm">
            No conversations match "<span className="font-medium">{search}</span>"
          </p>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([day, items]) => (
              <section key={day}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                  {day}
                </h2>
                <div className="space-y-3">
                  {items.map((item, i) => (
                    <div
                      key={`${day}-${i}`}
                      className="bg-card rounded-2xl border border-border p-4 sm:p-5 animate-slide-up hover:shadow-md transition-shadow"
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="font-medium text-sm flex-1">🙋 {item.question}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        🤖 {item.answer.replace(/[*#]/g, "").slice(0, 200)}
                        {item.answer.length > 200 ? "..." : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
