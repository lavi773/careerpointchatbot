import { useEffect, useState } from "react";
import { Brain, Loader2, Pencil, Plus, Trash2, X, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MemoryRow {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

const humanize = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const normalizeKey = (raw: string) =>
  raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

const MemoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<MemoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [adding, setAdding] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("user_memory")
      .select("id, key, value, updated_at")
      .eq("user_id", user.id)
      .order("key", { ascending: true });
    if (error) toast({ title: "Failed to load memory", description: error.message, variant: "destructive" });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const startEdit = (row: MemoryRow) => {
    setEditingId(row.id);
    setEditValue(row.value);
  };

  const saveEdit = async (row: MemoryRow) => {
    const value = editValue.trim();
    if (!value) {
      toast({ title: "Value can't be empty", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("user_memory").update({ value }).eq("id", row.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setEditingId(null);
    toast({ title: "Memory updated ✨" });
    load();
  };

  const remove = async (row: MemoryRow) => {
    if (!confirm(`Forget "${humanize(row.key)}"?`)) return;
    const { error } = await supabase.from("user_memory").delete().eq("id", row.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Memory removed 🧹" });
    load();
  };

  const addNew = async () => {
    if (!user) return;
    const key = normalizeKey(newKey);
    const value = newValue.trim();
    if (!key || !value) {
      toast({ title: "Both fields are required", variant: "destructive" });
      return;
    }
    if (key.length > 50 || value.length > 200) {
      toast({ title: "Too long", description: "Key max 50, value max 200 chars", variant: "destructive" });
      return;
    }
    const { error } = await supabase
      .from("user_memory")
      .upsert({ user_id: user.id, key, value }, { onConflict: "user_id,key" });
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setNewKey("");
    setNewValue("");
    setAdding(false);
    toast({ title: "Memory saved 🧠" });
    load();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                My Memory
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {rows.length} {rows.length === 1 ? "fact" : "facts"} CPU Bot remembers about you
              </p>
            </div>
            <button
              onClick={() => setAdding((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm rounded-lg gradient-primary text-primary-foreground shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add fact</span>
            </button>
          </div>

          {adding && (
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-5 animate-fade-in">
              <h3 className="font-heading font-semibold text-sm mb-3">Teach CPU Bot something new</h3>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto] gap-2">
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="key (e.g. viva date)"
                  maxLength={50}
                  className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="value (e.g. 30 April 10 AM)"
                  maxLength={200}
                  onKeyDown={(e) => e.key === "Enter" && addNew()}
                  className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={addNew}
                  className="px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:shadow-md transition-all"
                >
                  Save
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Tip: you can also teach the bot directly in chat — say <em>"our viva is on 30 April"</em>.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : rows.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-card border border-border rounded-2xl">
              <Brain className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
              <p className="text-base sm:text-lg font-medium">No memories yet 🧠</p>
              <p className="text-sm text-muted-foreground mt-1">
                Add a fact above, or teach CPU Bot in chat.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map((row, i) => (
                <div
                  key={row.id}
                  className="bg-card rounded-xl border border-border p-3 sm:p-4 animate-slide-up hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {humanize(row.key)}
                      </p>
                      {editingId === row.id ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit(row)}
                          autoFocus
                          maxLength={200}
                          className="mt-1 w-full bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                        />
                      ) : (
                        <p className="text-sm font-medium mt-0.5 break-words">{row.value}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {editingId === row.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(row)}
                            className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                            aria-label="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                            aria-label="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(row)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => remove(row)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MemoryPage;
