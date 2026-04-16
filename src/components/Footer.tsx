import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Globe, Mail, Phone } from "lucide-react";
import cpuLogo from "@/assets/cpu-logo.png";

const Footer = () => (
  <footer className="bg-card border-t border-border mt-12">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img src={cpuLogo} alt="CPU" className="w-10 h-10 rounded-full bg-card object-contain" />
            <span className="font-heading font-bold text-base text-gradient">Career Point University</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Get in.. Go Far. Your AI-powered student assistant for instant answers about academics, fees, hostel, placements & more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-semibold text-sm mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">Chatbot</Link></li>
            <li><Link to="/history" className="text-muted-foreground hover:text-primary transition-colors">Chat History</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-heading font-semibold text-sm mb-3">Get in Touch</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Globe className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <a href="https://cpur.in" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors break-all">cpur.in</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <a href="mailto:registrar@cpur.edu.in" className="text-muted-foreground hover:text-primary transition-colors break-all">registrar@cpur.edu.in</a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
              <a href="tel:+919057532048" className="text-muted-foreground hover:text-primary transition-colors">+91-90575-32048</a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-heading font-semibold text-sm mb-3">Follow Us</h3>
          <div className="flex gap-2">
            <a
              href="https://www.instagram.com/cp.university"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="p-2.5 rounded-full bg-muted hover:gradient-primary hover:text-primary-foreground text-muted-foreground transition-all hover:scale-110"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/@cpurajasthan/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="p-2.5 rounded-full bg-muted hover:gradient-primary hover:text-primary-foreground text-muted-foreground transition-all hover:scale-110"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://share.google/XbfMvdalU2s1ykPqn"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="p-2.5 rounded-full bg-muted hover:gradient-primary hover:text-primary-foreground text-muted-foreground transition-all hover:scale-110"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Career Point University. All rights reserved.</p>
        <p>Made with 💙 for CPU students</p>
      </div>
    </div>
  </footer>
);

export default Footer;
