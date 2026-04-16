import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

const contactInfo = [
  { icon: MapPin, label: "Address", value: "University Campus, Knowledge Park, New Delhi - 110001" },
  { icon: Phone, label: "Phone", value: "+91-1234-567890" },
  { icon: Mail, label: "Email", value: "info@university.edu" },
  { icon: Clock, label: "Office Hours", value: "Mon-Fri: 9:30 AM - 5:00 PM" },
];

const departments = [
  { name: "Admissions Office", email: "admissions@university.edu", phone: "+91-1234-567891" },
  { name: "Examination Cell", email: "exams@university.edu", phone: "+91-1234-567892" },
  { name: "Student Welfare", email: "welfare@university.edu", phone: "+91-1234-567893" },
  { name: "IT Helpdesk", email: "helpdesk@university.edu", phone: "+91-1234-567899" },
  { name: "Hostel Office", email: "hostel@university.edu", phone: "+91-1234-567894" },
];

const ContactPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="font-heading text-3xl font-bold text-center mb-2">Contact Us 📞</h1>
      <p className="text-center text-muted-foreground mb-10">Get in touch with the university</p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {contactInfo.map((c) => (
          <div key={c.label} className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <c.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{c.label}</h3>
              <p className="text-sm text-muted-foreground">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-heading text-xl font-bold mb-6">Department Contacts</h2>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left px-5 py-3 font-semibold">Department</th>
              <th className="text-left px-5 py-3 font-semibold">Email</th>
              <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Phone</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.name} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="px-5 py-3 font-medium">{d.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{d.email}</td>
                <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">{d.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ContactPage;
