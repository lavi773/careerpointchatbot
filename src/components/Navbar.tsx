import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LogIn, User as UserIcon } from "lucide-react";
import cpuLogo from "@/assets/cpu-logo.png";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Chatbot" },
    { to: "/history", label: "History" },
    { to: "/contact", label: "Contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out 👋" });
    navigate("/");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50 bg-card/80">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2 min-w-0" onClick={() => setOpen(false)}>
          <img src={cpuLogo} alt="Career Point University" className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-card object-contain" />
          <span className="font-heading font-bold text-sm sm:text-base text-gradient truncate">
            Career Point University
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <span className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground max-w-[160px] truncate">
                <UserIcon className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium gradient-primary text-primary-foreground shadow-sm hover:shadow-md transition-all"
            >
              <LogIn className="w-3.5 h-3.5" /> Sign in
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-xl animate-fade-in">
          <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? "gradient-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border my-1" />
            {user ? (
              <>
                <p className="px-4 py-1.5 text-[11px] text-muted-foreground truncate">{user.email}</p>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium gradient-primary text-primary-foreground"
              >
                <LogIn className="w-4 h-4" /> Sign in / Sign up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
