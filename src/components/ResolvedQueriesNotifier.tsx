import { useEffect, useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface ResolvedQuery {
  id: string;
  question: string;
  answer: string;
  resolved_at: string | null;
}

/**
 * Floating banner shown when the current user has resolved queries
 * they haven't yet acknowledged (notified=false).
 */
const ResolvedQueriesNotifier = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ResolvedQuery[]>([]);
  const [open, setOpen] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("unresolved_queries")
      .select("id, question, answer, resolved_at")
      .eq("user_id", user.id)
      .eq("status", "resolved")
      .eq("notified", false)
      .order("resolved_at", { ascending: false });
    setItems((data as ResolvedQuery[]) ?? []);
  };

  useEffect(() => {
    load();
    if (!user) return;
    // Realtime: fire when an admin resolves a query for this user
    const channel = supabase
      .channel(`resolved-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "unresolved_queries",
          filter: `user_id=eq.${user.id}`,
        },
        () => load()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const acknowledge = async (id: string) => {
    await supabase.from("unresolved_queries").update({ notified: true }).eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (!user || items.length === 0 || !open) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40 w-[min(380px,calc(100vw-2rem))] max-h-[60vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <span className="font-heading font-semibold text-sm">
            {items.length} answer{items.length > 1 ? "s" : ""} ready
          </span>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="p-1 rounded-md hover:bg-muted text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <ul className="divide-y divide-border">
        {items.map((q) => (
          <li key={q.id} className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground">You asked:</p>
            <p className="text-sm font-medium line-clamp-2">{q.question}</p>
            <div className="bg-muted/60 rounded-lg p-2.5">
              <p className="text-xs text-muted-foreground mb-1">Admin's answer:</p>
              <p className="text-sm whitespace-pre-wrap">{q.answer}</p>
            </div>
            <Button
              onClick={() => acknowledge(q.id)}
              size="sm"
              variant="outline"
              className="w-full gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Got it
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResolvedQueriesNotifier;
