import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { CheckCircle2, Trash2, Inbox, Clock, XCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

interface QueryRow {
  id: string;
  user_id: string;
  user_email: string | null;
  question: string;
  context: string | null;
  status: "pending" | "resolved" | "dismissed";
  answer: string | null;
  created_at: string;
  resolved_at: string | null;
}

const tabs = [
  { key: "pending", label: "Pending", icon: Clock },
  { key: "resolved", label: "Resolved", icon: CheckCircle2 },
  { key: "dismissed", label: "Dismissed", icon: XCircle },
] as const;

const AdminQueriesPage = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [tab, setTab] = useState<"pending" | "resolved" | "dismissed">("pending");
  const [rows, setRows] = useState<QueryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("unresolved_queries")
      .select("*")
      .eq("status", tab)
      .order("created_at", { ascending: false });
    if (error) toast.error("Couldn't load queries");
    setRows((data as QueryRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, isAdmin]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const resolve = async (row: QueryRow) => {
    const answer = drafts[row.id]?.trim();
    if (!answer || answer.length < 3) {
      toast.error("Please write an answer first");
      return;
    }
    setSavingId(row.id);
    const { error } = await supabase
      .from("unresolved_queries")
      .update({ status: "resolved", answer, resolved_by: user.id, notified: false })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast.error("Failed to resolve");
      console.error(error);
      return;
    }
    toast.success("Resolved & added to FAQ ✨");
    setDrafts((d) => {
      const { [row.id]: _, ...rest } = d;
      return rest;
    });
    load();
  };

  const dismiss = async (id: string) => {
    const { error } = await supabase
      .from("unresolved_queries")
      .update({ status: "dismissed" })
      .eq("id", id);
    if (error) return toast.error("Failed to dismiss");
    toast("Dismissed");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this query permanently?")) return;
    const { error } = await supabase.from("unresolved_queries").delete().eq("id", id);
    if (error) return toast.error("Failed to delete");
    toast("Deleted");
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-6">
          <p className="inline-block px-3 py-1 mb-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            ADMIN DASHBOARD
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Inbox className="w-6 h-6 text-primary" /> Query Resolve Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer student questions the bot couldn't handle. Resolved answers automatically train
            the bot.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Inbox className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No {tab} queries.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {rows.map((row) => (
              <li
                key={row.id}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {row.user_email ?? "anonymous"} •{" "}
                      {new Date(row.created_at).toLocaleString()}
                    </p>
                    <p className="font-medium mt-1 break-words">{row.question}</p>
                    {row.context && (
                      <p className="text-sm text-muted-foreground mt-1 italic break-words">
                        {row.context}
                      </p>
                    )}
                  </div>
                </div>

                {tab === "pending" && (
                  <>
                    <Textarea
                      value={drafts[row.id] ?? ""}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [row.id]: e.target.value }))
                      }
                      placeholder="Type the answer the student should see…"
                      rows={3}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => resolve(row)}
                        disabled={savingId === row.id}
                        className="gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {savingId === row.id ? "Saving…" : "Resolve & notify"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => dismiss(row.id)}
                        className="gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Dismiss
                      </Button>
                    </div>
                  </>
                )}

                {tab !== "pending" && row.answer && (
                  <div className="bg-muted/60 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Answer:</p>
                    <p className="text-sm whitespace-pre-wrap">{row.answer}</p>
                  </div>
                )}

                {tab !== "pending" && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(row.id)}
                      className="gap-1.5 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminQueriesPage;
