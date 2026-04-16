import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CreditCard, Building, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingChatButton from "@/components/FloatingChatButton";
import botAvatar from "@/assets/bot-avatar.png";
import cpuLogo from "@/assets/cpu-logo.png";
import heroCampus from "@/assets/cpu-campus.webp";

const features = [
  { icon: BookOpen, title: "Academic Help", desc: "Exams, timetable, attendance & more", color: "from-primary to-accent" },
  { icon: CreditCard, title: "Fee & Payments", desc: "Deadlines, online payments, scholarships", color: "from-secondary to-primary" },
  { icon: Building, title: "Campus Info", desc: "Library, hostel, office hours", color: "from-accent to-secondary" },
  { icon: HelpCircle, title: "24/7 Support", desc: "Always available to help you", color: "from-primary to-secondary" },
];

const HomePage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative overflow-hidden">
      {/* Campus background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroCampus})` }}
      />
      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-accent/75 to-secondary/85" />
      <div className="absolute inset-0 bg-foreground/30" />

      <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src={cpuLogo} alt="CPU Logo" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card p-1 shadow-xl animate-float" />
          <img src={botAvatar} alt="CPU Bot" className="w-20 h-20 sm:w-24 sm:h-24 animate-float" style={{ animationDelay: "0.5s" }} width={512} height={512} />
        </div>
        <p className="inline-block px-4 py-1 mb-4 rounded-full bg-card/20 backdrop-blur text-primary-foreground text-xs sm:text-sm font-medium border border-card/30">
          ✨ Official AI Assistant
        </p>
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-extrabold text-primary-foreground mb-4 leading-tight px-2 drop-shadow-lg">
          Career Point University <span className="block sm:inline">Chatbot 🎓</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-primary-foreground/95 max-w-2xl mx-auto mb-8 px-4 drop-shadow">
          Get instant, accurate answers about exams, fees, hostel, admissions, placements & campus life — 24/7.
        </p>
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-card text-foreground font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          Start Chatting <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>

    {/* Features */}
    <section className="container mx-auto px-4 py-12 sm:py-20">
      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
        How can <span className="text-gradient">CPU Bot</span> help you?
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="group bg-card rounded-2xl p-5 sm:p-6 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
              <f.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="gradient-primary py-12 sm:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
          Ready to get answers? 🚀
        </h2>
        <p className="text-sm sm:text-base text-primary-foreground/85 mb-8 max-w-lg mx-auto px-2">
          No waiting in lines. No missed office hours. Just instant, accurate answers — anytime.
        </p>
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-card text-foreground font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          Chat Now <MessageCircleIcon />
        </Link>
      </div>
    </section>

    <FloatingChatButton />
  </div>
);

const MessageCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

export default HomePage;
