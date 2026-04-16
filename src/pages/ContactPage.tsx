import { MapPin, Phone, Mail, Globe, Instagram, Facebook, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import cpuLogo from "@/assets/cpu-logo.png";

interface Person {
  name: string;
  designation: string;
  phone?: string;
  email?: string;
}

interface Department {
  name: string;
  icon?: string;
  people: Person[];
}

const departments: Department[] = [
  {
    name: "Registrar Office",
    icon: "🏛️",
    people: [
      { name: "Dr. Ravi Shankhar", designation: "Registrar", phone: "9057532048", email: "registrar@cpur.edu.in" },
      { name: "Mohit Mathur", designation: "Assistant Registrar", phone: "9079134709", email: "ar.admin@cpur.edu.in" },
      { name: "Man Singh Negi", designation: "Assistant Registrar", phone: "9462186813", email: "ar.admission@cpur.edu.in" },
      { name: "Himakshi Sharma", designation: "Assistant Registrar (Research)", phone: "9602474795", email: "himakshi.sharma@cpur.edu.in" },
      { name: "Naveen Sharma", designation: "Reception (University Campus)", phone: "9057532026", email: "reception@cpur.edu.in" },
    ],
  },
  {
    name: "Admission Office",
    icon: "📝",
    people: [
      { name: "Rajeev Singh", designation: "Sr. Manager Admission", phone: "9862388265 / 8094156999", email: "rajeev.singh@cpuniverse.in" },
      { name: "Manish Pandit", designation: "Manager Admission", phone: "9057532042", email: "manish.pandit@cpuniverse.in" },
      { name: "Girijashankar Sharma", designation: "Counselor", phone: "8094157999", email: "girijashankar.sharma@cpur.edu.in" },
      { name: "Sanjay Nagar", designation: "Visitor-Counsellor", phone: "9079134729", email: "cpu9@cpuniverse.in" },
    ],
  },
  {
    name: "Account Office",
    icon: "💰",
    people: [
      { name: "Jitendra Soni", designation: "Account Executive", phone: "9057531983", email: "accounts@cpur.edu.in" },
      { name: "Khusbhu Rai", designation: "Account Executive", phone: "9057531983", email: "accounts@cpur.edu.in" },
      { name: "Gunjan Wadhwa", designation: "Account Executive", phone: "9057531982", email: "cpuraccounts@cpur.edu.in" },
    ],
  },
  {
    name: "Examination Department",
    icon: "📄",
    people: [
      { name: "Raaj Kumar Sharma", designation: "Controller of Examination", phone: "7599565364", email: "coe@cpur.edu.in" },
      { name: "Mukut Bihari", designation: "Section Officer Exam", phone: "9829434653", email: "exam@cpur.edu.in" },
    ],
  },
  {
    name: "Transport Services",
    icon: "🚌",
    people: [
      { name: "Vijay", designation: "Bus Supervisor", phone: "8005590396 / 9799310585" },
      { name: "Nasheen", designation: "Bus Supervisor", phone: "9828437118 / 9214814786" },
      { name: "Abdul", designation: "Magic Supervisor", phone: "7427886295" },
    ],
  },
  {
    name: "Hostel",
    icon: "🏠",
    people: [
      { name: "Naveen Chaudhary", designation: "Warden (Male)", phone: "9588870175" },
      { name: "Hemlata Saxena", designation: "Warden (Female)", phone: "9588870175" },
    ],
  },
  {
    name: "Student Welfare Cell",
    icon: "🤝",
    people: [
      { name: "Dr. Rakhee Chaudhary", designation: "Dean Student Welfare", phone: "9414209998", email: "dsw.office@cpur.edu.in" },
      { name: "Mohit Mathur", designation: "Assistant Registrar", phone: "9079134709", email: "studenthelpdesk@cpur.edu.in" },
    ],
  },
  {
    name: "Anti Ragging Committee",
    icon: "🛡️",
    people: [
      { name: "Dr. Rakhee Chaudhary", designation: "Dean Student Welfare", phone: "9414209998", email: "dsw.office@cpur.edu.in" },
      { name: "Mohit Mathur", designation: "Assistant Registrar", phone: "9079134709", email: "studenthelpdesk@cpur.edu.in" },
    ],
  },
  {
    name: "Internal Complaint Committee",
    icon: "⚖️",
    people: [
      { name: "Dr. Hemlata Saxena", designation: "Professor", phone: "9460567567", email: "hemlata.saxena@cpur.edu.in" },
    ],
  },
  {
    name: "Discipline Committee",
    icon: "📚",
    people: [
      { name: "Dr. Ashish Jorasia", designation: "Proctor", phone: "9887536281", email: "ashish.jorasia@cpur.edu.in" },
    ],
  },
  {
    name: "Other Services",
    icon: "🛠️",
    people: [
      { name: "Venus Garments", designation: "Uniform Shoppee", phone: "7442477006" },
      { name: "Nikhil", designation: "Propelled Education Loan", phone: "9252423532" },
    ],
  },
];

const ContactPage = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Navbar />

    {/* Header */}
    <section className="relative gradient-primary py-12 sm:py-16 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <img src={cpuLogo} alt="CPU" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-card p-1 shadow-xl" />
        <h1 className="font-heading text-2xl sm:text-4xl font-bold text-primary-foreground mb-2">
          Important Contact Numbers 📞
        </h1>
        <p className="text-sm sm:text-base text-primary-foreground/85 max-w-xl mx-auto">
          Reach the right department at Career Point University, instantly.
        </p>
      </div>
    </section>

    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl flex-1">
      {/* Quick info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <a href="https://cpur.in" target="_blank" rel="noreferrer" className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:shadow-md hover:border-primary/40 transition-all">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Website</p>
            <p className="text-sm font-medium truncate">cpur.in</p>
          </div>
        </a>
        <a href="tel:+919057532048" className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:shadow-md hover:border-primary/40 transition-all">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Reception</p>
            <p className="text-sm font-medium truncate">+91-90575-32026</p>
          </div>
        </a>
        <a href="mailto:registrar@cpur.edu.in" className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:shadow-md hover:border-primary/40 transition-all">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium truncate">registrar@cpur.edu.in</p>
          </div>
        </a>
      </div>

      {/* Social */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-heading font-semibold text-sm sm:text-base">🌟 Connect on Social Media</p>
        <div className="flex gap-2">
          <a href="https://www.instagram.com/cp.university" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-2.5 rounded-full bg-muted hover:gradient-primary hover:text-primary-foreground transition-all hover:scale-110">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="https://www.facebook.com/@cpurajasthan/" target="_blank" rel="noreferrer" aria-label="Facebook" className="p-2.5 rounded-full bg-muted hover:gradient-primary hover:text-primary-foreground transition-all hover:scale-110">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="https://share.google/XbfMvdalU2s1ykPqn" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-full bg-muted hover:gradient-primary hover:text-primary-foreground transition-all hover:scale-110">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Departments */}
      <div className="space-y-6">
        {departments.map((dept) => (
          <section key={dept.name} className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border">
              <h2 className="font-heading font-semibold text-base sm:text-lg flex items-center gap-2">
                <span className="text-xl">{dept.icon}</span>
                {dept.name}
              </h2>
            </div>
            <div className="divide-y divide-border">
              {dept.people.map((p, i) => (
                <div key={i} className="p-4 sm:px-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.designation}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1 text-xs">
                      {p.phone && (
                        <a href={`tel:${p.phone.split(" ")[0].replace(/\D/g, "")}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                          <Phone className="w-3 h-3" />
                          <span className="font-mono">{p.phone}</span>
                        </a>
                      )}
                      {p.email && (
                        <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors break-all">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span>{p.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Address */}
      <div className="mt-8 bg-card rounded-2xl border border-border p-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-heading font-semibold text-sm">Career Point University</h3>
          <p className="text-sm text-muted-foreground">Alaniya, Kota, Rajasthan – 325003, India</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

export default ContactPage;
