import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Mail, Lock, Loader2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import cpuLogo from "@/assets/cpu-logo.png";
import campus from "@/assets/cpu-campus.webp";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast({ title: "Welcome to CPU! 🎓", description: "Account created. Logging you in..." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast({ title: "Welcome back! 👋" });
      }
    } catch (err: any) {
      toast({
        title: mode === "signup" ? "Sign up failed" : "Login failed",
        description: err.message || "Try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/`,
    });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: result.error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left visual */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img src={campus} alt="Career Point University campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-primary opacity-80" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <img src={cpuLogo} alt="CPU" className="w-16 h-16 rounded-full bg-white/95 p-1 mb-6" />
          <h1 className="font-heading font-bold text-4xl mb-3">Career Point University</h1>
          <p className="text-lg opacity-95 mb-6">Get in.. Go Far.</p>
          <p className="text-sm opacity-90 leading-relaxed max-w-md">
            Your AI-powered campus assistant. Sign in to chat, get personalized academic info, and remember what matters to you.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
            <img src={cpuLogo} alt="CPU" className="w-10 h-10 rounded-full bg-card object-contain" />
            <span className="font-heading font-bold text-base text-gradient">Career Point University</span>
          </div>

          <div className="bg-card border border-border rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-bold text-2xl">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {mode === "login" ? "Sign in to continue chatting with CPU Bot." : "Join thousands of CPU students."}
            </p>

            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-2.5 text-sm font-medium hover:bg-muted transition-colors mb-4 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or with email</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@cpur.in"
                  required
                  maxLength={255}
                  className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                  required
                  minLength={6}
                  maxLength={72}
                  className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5">
              {mode === "login" ? "New to CPU? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary font-medium hover:underline"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/" className="hover:text-primary">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
