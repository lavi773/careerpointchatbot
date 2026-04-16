import { Link, useLocation } from "react-router-dom";
import botAvatar from "@/assets/bot-avatar.png";

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "Chatbot" },
    { to: "/history", label: "History" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50 bg-card/80">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={botAvatar} alt="UniBot" className="w-9 h-9" />
          <span className="font-heading font-bold text-xl text-gradient">UniBot</span>
        </Link>
        <div className="flex items-center gap-1">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
