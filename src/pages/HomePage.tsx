import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CreditCard, Building, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingChatButton from "@/components/FloatingChatButton";
import botAvatar from "@/assets/bot-avatar.png";
import heroCampus from "@/assets/hero-campus.jpg";

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
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${heroCampus})` }}
      />
      <div className="absolute inset-0 gradient-hero opacity-90" />
      <div className="relative container mx-auto px-4 py-24 md:py-32 text-center">
        <img src={botAvatar} alt="UniBot" className="w-28 h-28 mx-auto mb-6 animate-float" width={512} height={512} />
        <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-primary-foreground mb-4">
          Meet <span className="underline decoration-wavy decoration-secondary/60">UniBot</span> 🎓
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          Your smart, friendly university assistant. Get instant answers about exams, fees, hostel, admissions & campus life!
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
    <section className="container mx-auto px-4 py-20">
      <h2 className="font-heading text-3xl font-bold text-center mb-12">
        How can <span className="text-gradient">UniBot</span> help you?
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="group bg-card rounded-2xl p-6 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
    <section className="gradient-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
          Ready to get answers? 🚀
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
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
