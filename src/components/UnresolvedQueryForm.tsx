import { useState } from "react";
import { HelpCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  question: z
    .string()
    .trim()
    .min(5, "Please type at least 5 characters")
    .max(500, "Keep it under 500 characters"),
  context: z.string().trim().max(1000, "Context must be under 1000 characters").optional(),
});

interface Props {
  initialQuestion: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

const UnresolvedQueryForm = ({ initialQuestion, onSubmitted, onCancel }: Props) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState(initialQuestion);
  const [context, setContext] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;
    const parsed = schema.safeParse({ question, context });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("unresolved_queries").insert({
      user_id: user.id,
      user_email: user.email ?? null,
      question: parsed.data.question,
      context: parsed.data.context || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't submit your query. Please try again.");
      console.error(error);
      return;
    }
    toast.success("Query submitted! You'll be notified once it's resolved. ✅");
    onSubmitted?.();
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3 animate-fade-in">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold text-sm">Send to admin?</h4>
          <p className="text-xs text-muted-foreground">
            I couldn't find an answer. Submit your query and an admin will reply.
          </p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            aria-label="Dismiss"
            className="p-1 rounded-md hover:bg-muted text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <Textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Your question…"
        rows={2}
        maxLength={500}
        className="text-sm"
      />
      <Textarea
        value={context}
        onChange={(e) => setContext(e.target.value)}
        placeholder="Add any extra details (optional)"
        rows={2}
        maxLength={1000}
        className="text-sm"
      />

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        size="sm"
        className="w-full gap-2"
      >
        <Send className="w-4 h-4" />
        {submitting ? "Submitting…" : "Submit query"}
      </Button>
    </div>
  );
};

export default UnresolvedQueryForm;
