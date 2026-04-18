import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Globe, Loader2, RefreshCw, Trash2, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

interface PageRow {
  id: string;
  url: string;
  title: string | null;
  summary: string | null;
  scraped_at: string;
}

const SiteContentPage = () => {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("site_content")
      .select("id, url, title, summary, scraped_at")
      .order("scraped_at", { ascending: false })
      .limit(100);
    setRows((data as PageRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const triggerScrape = async (urls?: string[]) => {
    setScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke("scrape-cpur", {
        body: urls?.length ? { urls } : { rootUrl: "https://cpur.in", limit: 15 },
      });
      if (error) throw error;
      toast.success(`Scraped ${data?.saved ?? 0} of ${data?.scanned ?? 0} pages`);
      await load();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Scrape failed");
    } finally {
      setScraping(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this page from the bot's knowledge?")) return;
    const { error } = await supabase.from("site_content").delete().eq("id", id);
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
            ADMIN — KNOWLEDGE BASE
          </p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" /> cpur.in Content
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pages scraped from the university website. The bot uses these to answer student questions
            with grounded, up-to-date info.
          </p>
        </header>

        <div className="bg-card border border-border rounded-2xl p-4 mb-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => triggerScrape()}
              disabled={scraping}
              className="gap-2"
            >
              {scraping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {scraping ? "Scraping cpur.in…" : "Scrape cpur.in now"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Input
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Or scrape a specific URL (https://…)"
              className="flex-1 min-w-[200px]"
            />
            <Button
              variant="outline"
              disabled={scraping || !customUrl.trim()}
              onClick={() => {
                triggerScrape([customUrl.trim()]);
                setCustomUrl("");
              }}
            >
              Add URL
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-2xl">
            <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No pages indexed yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Click "Scrape cpur.in now" to get started.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.id}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading font-semibold text-sm truncate">
                      {row.title ?? "Untitled"}
                    </h3>
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 break-all"
                    >
                      {row.url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                    {row.summary && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {row.summary}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Scraped {new Date(row.scraped_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(row.id)}
                    className="text-destructive hover:text-destructive flex-shrink-0"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SiteContentPage;
