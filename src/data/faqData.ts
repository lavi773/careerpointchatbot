export interface FAQ {
  id: number;
  intent: string;
  keywords: string[];
  patterns: string[];
  response: string;
}

export const faqData: FAQ[] = [
  // Academic & Timetable
  {
    id: 1,
    intent: "exam_schedule",
    keywords: ["exam", "semester", "start", "date", "when", "examination"],
    patterns: ["when will the semester exams start", "exam dates", "when are exams", "exam schedule"],
    response: "📅 The end-semester examinations are scheduled to begin from **December 10, 2025**. The detailed datesheet will be uploaded on the university portal 2 weeks prior. Keep checking the Examination section on the website! 📝"
  },
  {
    id: 2,
    intent: "timetable",
    keywords: ["timetable", "download", "class", "schedule", "routine"],
    patterns: ["where can i download the timetable", "class schedule", "how to get timetable", "routine"],
    response: "📋 You can download the latest timetable from **University Portal → Academics → Timetable**. It's also displayed on the departmental notice board. If you face any issues, contact your Class Representative or the department office! 😊"
  },
  {
    id: 3,
    intent: "passing_criteria",
    keywords: ["passing", "criteria", "marks", "minimum", "pass"],
    patterns: ["what are the passing criteria", "minimum marks to pass", "passing marks", "how much to pass"],
    response: "✅ The passing criteria is as follows:\n- **Internal Assessment**: Minimum 40% in each subject\n- **External Exam**: Minimum 40% in each paper\n- **Aggregate**: Minimum 45% overall\n- **Practicals**: Minimum 50% where applicable\n\nMake sure to meet all criteria to clear the semester! 💪"
  },
  {
    id: 4,
    intent: "attendance",
    keywords: ["attendance", "days", "required", "minimum", "percentage"],
    patterns: ["how many attendance days are required", "minimum attendance", "attendance requirement", "attendance percentage"],
    response: "📊 A minimum of **75% attendance** is mandatory to be eligible for the end-semester examination. Students falling short may be detained. If you have genuine medical reasons, submit a medical certificate to the Dean's office within 7 days. Stay regular! 🎯"
  },
  {
    id: 5,
    intent: "revaluation",
    keywords: ["rechecking", "revaluation", "recheck", "re-evaluation", "challenge"],
    patterns: ["how to apply for rechecking", "revaluation process", "how to apply for revaluation", "challenge evaluation"],
    response: "📝 To apply for revaluation:\n1. Visit **University Portal → Examinations → Revaluation**\n2. Select the subject(s) you wish to get rechecked\n3. Pay the revaluation fee of ₹500 per subject\n4. Submit within **15 days** of result declaration\n\nResults are usually updated within 30 days. Good luck! 🍀"
  },
  // Fees & Payment
  {
    id: 6,
    intent: "fee_deadline",
    keywords: ["fee", "last", "date", "deadline", "submission", "due"],
    patterns: ["what is the last date for fee submission", "fee deadline", "when to pay fees", "fee due date"],
    response: "💰 The last date for fee submission for the current semester is **October 31, 2025**. After this date, a late fee of ₹100/day will be applicable (up to 15 days). Post that, special permission from the Dean is required. Pay on time to avoid penalties! ⏰"
  },
  {
    id: 7,
    intent: "online_payment",
    keywords: ["pay", "online", "fees", "payment", "method", "how"],
    patterns: ["how to pay fees online", "online fee payment", "payment method", "fee payment process"],
    response: "💳 To pay fees online:\n1. Login to **University Portal → Fee Section**\n2. Click on **'Pay Now'**\n3. Choose: UPI / Net Banking / Credit-Debit Card\n4. Complete the payment & download receipt\n\nYou can also pay at the university cash counter (Mon-Fri, 10 AM - 3 PM). Keep your receipt safe! 🧾"
  },
  {
    id: 8,
    intent: "late_fee",
    keywords: ["late", "fee", "fine", "penalty"],
    patterns: ["what is the late fee fine", "late fee penalty", "fine for late payment", "late fee charges"],
    response: "⚠️ Late fee structure:\n- **1-7 days late**: ₹100/day\n- **8-15 days late**: ₹200/day\n- **Beyond 15 days**: Requires Dean's approval + ₹5,000 penalty\n\nWe strongly recommend paying on time to avoid unnecessary charges! 💡"
  },
  {
    id: 9,
    intent: "scholarship",
    keywords: ["scholarship", "financial", "aid", "merit", "bca"],
    patterns: ["is scholarship available for bca students", "scholarship details", "how to get scholarship", "financial aid"],
    response: "🎓 Yes! Scholarships available for students:\n- **Merit Scholarship**: Top 5% students (up to 50% fee waiver)\n- **Government Scholarship**: SC/ST/OBC categories via NSP portal\n- **Sports Scholarship**: State/National level athletes\n- **Need-Based Aid**: Apply via Dean Student Welfare office\n\nApply through the **Scholarship Portal** before **August 31** each year. Don't miss out! 🌟"
  },
  // Admission
  {
    id: 10,
    intent: "admission_documents",
    keywords: ["documents", "required", "admission", "papers", "needed"],
    patterns: ["what documents are required for admission", "admission documents", "documents needed", "papers for admission"],
    response: "📄 Documents required for admission:\n1. 10th & 12th Marksheets (Original + 2 copies)\n2. Transfer Certificate (TC)\n3. Migration Certificate (if applicable)\n4. Character Certificate\n5. Aadhar Card\n6. 4 Passport-size photographs\n7. Category Certificate (if applicable)\n8. Gap Certificate (if any gap year)\n\nAll documents must be verified at the Admission Office. 📋"
  },
  {
    id: 11,
    intent: "migration_certificate",
    keywords: ["migration", "certificate", "apply", "transfer"],
    patterns: ["how can i apply for migration certificate", "migration certificate process", "get migration certificate"],
    response: "📜 To apply for a Migration Certificate:\n1. Fill the application form available at the **Registrar's Office** or download from the portal\n2. Attach: ID card copy, fee receipt, No-Dues Certificate\n3. Pay ₹300 processing fee\n4. Submit to the Academic Section\n\nProcessing time: **7-10 working days**. You'll be notified via SMS/email! 📲"
  },
  {
    id: 12,
    intent: "entrance_exam",
    keywords: ["entrance", "exam", "test", "admission", "selection"],
    patterns: ["is there any entrance exam", "entrance test details", "admission test", "selection process"],
    response: "📝 Entrance exam details:\n- **UG Programs (BCA, BBA, B.Sc)**: Merit-based (no entrance exam)\n- **PG Programs (MCA, MBA)**: University Entrance Test (UET) in June\n- **Ph.D Programs**: Written Test + Interview\n\nFor UET: Register online at **admissions.university.edu** by May 15. Admit cards released 10 days before exam. 📚"
  },
  // Hostel
  {
    id: 13,
    intent: "hostel_charges",
    keywords: ["hostel", "charges", "fees", "cost", "rent", "room"],
    patterns: ["what are hostel charges", "hostel fees", "hostel cost", "room charges"],
    response: "🏠 Hostel charges per semester:\n- **Double Sharing**: ₹25,000/semester\n- **Triple Sharing**: ₹18,000/semester\n- **Mess Charges**: ₹15,000/semester (mandatory)\n- **Security Deposit**: ₹5,000 (refundable)\n\nTotal approx: ₹38,000 - ₹45,000/semester. Apply via **Hostel Allotment Portal** during admission! 🔑"
  },
  {
    id: 14,
    intent: "hostel_wifi",
    keywords: ["wifi", "internet", "hostel", "connection", "wi-fi"],
    patterns: ["is wifi available in hostel", "hostel internet", "hostel wifi", "internet in hostel"],
    response: "📶 Yes! Wi-Fi is available in all hostel blocks:\n- **Speed**: 50 Mbps shared connection\n- **Access**: 24/7 with login credentials\n- **Login**: Use your university ID at **wifi.university.edu**\n- **Note**: Streaming may be limited during peak hours (8-11 PM)\n\nFor connectivity issues, contact IT Helpdesk: **helpdesk@university.edu** 💻"
  },
  {
    id: 15,
    intent: "hostel_curfew",
    keywords: ["curfew", "time", "hostel", "timing", "gate"],
    patterns: ["what is the hostel curfew time", "hostel timing", "hostel gate closing time", "curfew"],
    response: "🕐 Hostel timings:\n- **Gate Closing**: 9:00 PM (weekdays), 10:00 PM (weekends)\n- **Late Entry**: Written permission from Warden required\n- **Overnight Leave**: Prior approval + parent's written consent\n- **Mess Timings**: Breakfast 7-9 AM | Lunch 12-2 PM | Dinner 7-9 PM\n\nPlease follow hostel rules to avoid disciplinary action! 🏫"
  },
  // Campus
  {
    id: 16,
    intent: "library",
    keywords: ["library", "located", "where", "location", "books"],
    patterns: ["where is the library located", "library location", "how to find library", "library timings"],
    response: "📚 The Central Library is located in **Block C, Ground Floor**.\n- **Timings**: Mon-Sat: 8:00 AM - 8:00 PM | Sunday: 10:00 AM - 5:00 PM\n- **Book Issue**: Max 4 books for 14 days\n- **Digital Library**: Available 24/7 at **library.university.edu**\n- **E-Journals**: Access via campus Wi-Fi\n\nCarry your ID card for entry! 📖"
  },
  {
    id: 17,
    intent: "office_hours",
    keywords: ["office", "working", "hours", "timing", "open"],
    patterns: ["what are office working hours", "office timings", "when is office open", "administrative office hours"],
    response: "🏢 Office working hours:\n- **Administrative Office**: Mon-Fri, 9:30 AM - 5:00 PM\n- **Saturday**: 9:30 AM - 1:00 PM\n- **Sunday & Holidays**: Closed\n- **Lunch Break**: 1:00 PM - 1:30 PM\n\nFor urgent matters, email **admin@university.edu** or call **+91-1234-567890** 📞"
  },
  {
    id: 18,
    intent: "id_card",
    keywords: ["id", "card", "identity", "get", "lost", "new"],
    patterns: ["how to get my id card", "id card process", "lost id card", "new id card"],
    response: "🪪 For ID Card:\n- **New Students**: ID cards are issued during orientation week\n- **Lost ID Card**: Apply at Student Section with ₹200 replacement fee + FIR copy\n- **Processing Time**: 5-7 working days\n- **Required**: 1 passport photo + fee receipt\n\nAlways carry your ID card on campus — it's mandatory! 🎒"
  },
  {
    id: 19,
    intent: "contact_hod",
    keywords: ["contact", "hod", "head", "department", "sir", "maam", "madam"],
    patterns: ["how to contact hod", "hod contact", "contact head of department", "hod email"],
    response: "👨‍🏫 To contact the Head of Department:\n- **Visit**: Department Office during office hours\n- **Email**: hod.[department]@university.edu\n- **Phone**: Available on the university website under **Faculty Directory**\n- **Appointment**: Book via department coordinator\n\nFor CS/IT: **Dr. Sharma** — hod.cs@university.edu\nFor Management: **Dr. Verma** — hod.mgmt@university.edu 📧"
  },
  // Emergency & Support
  {
    id: 20,
    intent: "technical_issues",
    keywords: ["technical", "issues", "problem", "help", "support", "it"],
    patterns: ["whom do i contact for technical issues", "technical support", "it helpdesk", "technical help"],
    response: "🔧 For technical issues:\n- **IT Helpdesk**: helpdesk@university.edu\n- **Phone**: +91-1234-567899\n- **Location**: IT Building, Room 102\n- **Hours**: Mon-Sat, 9:00 AM - 6:00 PM\n- **Portal Issues**: Raise ticket at **support.university.edu**\n\nMost issues are resolved within 24-48 hours! 🛠️"
  },
  {
    id: 21,
    intent: "website_issues",
    keywords: ["website", "not", "working", "down", "error", "portal"],
    patterns: ["what to do if website is not working", "website down", "portal not working", "website error"],
    response: "🌐 If the website/portal is not working:\n1. **Clear browser cache** and try again\n2. Try a **different browser** (Chrome recommended)\n3. Check **status.university.edu** for maintenance notices\n4. If still not working, email **webmaster@university.edu**\n5. Or call IT: **+91-1234-567899**\n\nScheduled maintenance usually happens on Sundays, 2-6 AM. 🔄"
  },
  // Greetings & General
  {
    id: 22,
    intent: "greeting",
    keywords: ["hi", "hello", "hey", "good", "morning", "afternoon", "evening"],
    patterns: ["hi", "hello", "hey", "good morning", "good afternoon", "hey there"],
    response: "👋 Hello there! Welcome to **UniBot** — your friendly university assistant! 🎓\n\nI can help you with:\n• 📅 Academic queries & timetables\n• 💰 Fee & payment information\n• 🏠 Hostel details\n• 📋 Admission process\n• 🏫 Campus information\n\nJust type your question or use the quick action buttons below! 😊"
  },
  {
    id: 23,
    intent: "thanks",
    keywords: ["thanks", "thank", "you", "thankyou", "appreciate"],
    patterns: ["thanks", "thank you", "thankyou", "thanks a lot", "appreciate it"],
    response: "😊 You're welcome! Happy to help! If you have any more questions, feel free to ask anytime. Have a great day! 🌟"
  },
  {
    id: 24,
    intent: "bye",
    keywords: ["bye", "goodbye", "see", "later", "take", "care"],
    patterns: ["bye", "goodbye", "see you later", "take care", "bye bye"],
    response: "👋 Goodbye! Have a wonderful day ahead! Remember, I'm always here whenever you need help. See you soon! 🌈✨"
  },
  // Placement & Career
  {
    id: 25,
    intent: "placement",
    keywords: ["placement", "job", "company", "recruit", "offer", "package", "career"],
    patterns: ["placement details", "which companies visit", "average package", "highest package", "placement record"],
    response: "💼 Career Point University placement highlights:\n- **Top Recruiters**: TCS, Infosys, Wipro, Cognizant, Accenture, HCL, Capgemini\n- **Average Package**: ₹4.5 LPA\n- **Highest Package**: ₹18 LPA (2024 batch)\n- **Placement Rate**: 85%+ for eligible students\n\nVisit the **Training & Placement Cell** in Block A or email **placement@cpu.edu.in** to register! 🚀"
  },
  {
    id: 26,
    intent: "internship",
    keywords: ["internship", "intern", "summer", "training", "industry"],
    patterns: ["how to get internship", "internship opportunities", "summer training", "industry training"],
    response: "🎯 Internship opportunities at CPU:\n- **Duration**: 6 weeks (summer) or 6 months (final year)\n- **Stipend**: ₹5,000 - ₹25,000/month (varies by company)\n- **Register**: Through T&P Cell or apply via Internshala/LinkedIn\n- **Mandatory**: 1 internship before final year\n\nContact your Faculty Mentor for guidance! 💡"
  },
  // Courses
  {
    id: 27,
    intent: "courses_offered",
    keywords: ["courses", "programs", "offer", "available", "stream", "branch"],
    patterns: ["what courses are offered", "list of courses", "available programs", "which streams"],
    response: "📚 Courses offered at Career Point University:\n\n**UG Programs**: B.Tech (CSE, ME, EE, CE), BCA, BBA, B.Sc, B.Com, B.Pharm, B.Ed\n**PG Programs**: M.Tech, MCA, MBA, M.Sc, M.Com\n**Doctoral**: Ph.D in all major disciplines\n**Diploma**: Polytechnic in Engineering\n\nVisit **cpu.edu.in/programs** for full details! 🎓"
  },
  {
    id: 28,
    intent: "course_duration",
    keywords: ["duration", "years", "long", "course", "complete", "btech", "mba", "bca"],
    patterns: ["how long is the course", "course duration", "btech duration", "how many years"],
    response: "⏳ Course durations:\n- **B.Tech / B.Pharm**: 4 years (8 semesters)\n- **BCA / BBA / B.Sc / B.Com**: 3 years (6 semesters)\n- **MBA / MCA**: 2 years (4 semesters)\n- **M.Tech / M.Sc**: 2 years (4 semesters)\n- **Diploma**: 3 years\n- **Ph.D**: 3-5 years\n\nAll programs follow CBCS (Choice Based Credit System) 📖"
  },
  // Sports & Clubs
  {
    id: 29,
    intent: "sports",
    keywords: ["sports", "play", "ground", "gym", "fitness", "game", "facilities"],
    patterns: ["sports facilities", "is there a gym", "playground", "sports available"],
    response: "⚽ Sports facilities at CPU:\n- **Outdoor**: Cricket, Football, Basketball, Volleyball, Athletics track\n- **Indoor**: Badminton, Table Tennis, Chess, Carrom\n- **Gym**: Modern fitness center (free for students)\n- **Annual Sports Meet**: Held every February\n\nJoin the **Sports Club** at the Sports Office in Block D! 🏆"
  },
  {
    id: 30,
    intent: "clubs",
    keywords: ["club", "society", "join", "extracurricular", "activities"],
    patterns: ["which clubs are there", "how to join clubs", "student societies", "extracurricular activities"],
    response: "🎭 Student clubs at CPU:\n- **Tech**: Coding Club, Robotics Club, AI/ML Society\n- **Cultural**: Music, Dance, Drama, Photography\n- **Literary**: Debate, Quiz, Editorial Board\n- **Social**: NSS, NCC, Eco Club\n- **Entrepreneurship**: E-Cell\n\nClub registrations open in **August**. Watch the notice board! 🌟"
  },
  // Transport
  {
    id: 31,
    intent: "transport",
    keywords: ["bus", "transport", "shuttle", "route", "pickup", "vehicle"],
    patterns: ["is bus available", "transport facility", "bus routes", "college bus"],
    response: "🚌 University Transport:\n- **Coverage**: 25+ routes across the city & nearby towns\n- **Annual Fee**: ₹12,000 - ₹18,000 (depends on distance)\n- **Timing**: Pickup 7:30 AM | Drop 5:00 PM\n- **Apply**: Transport Office (Block B) with route preference\n\nDownload the **CPU Transport App** for live bus tracking! 📍"
  },
  // Canteen & Food
  {
    id: 32,
    intent: "canteen",
    keywords: ["canteen", "food", "mess", "eat", "cafe", "cafeteria"],
    patterns: ["where is the canteen", "food options", "canteen timing", "what food is available"],
    response: "🍽️ Food on campus:\n- **Main Canteen**: Block A — North/South Indian, Chinese, Snacks (8 AM - 8 PM)\n- **Cafe**: Block C — Coffee, sandwiches, fast food\n- **Mess**: Hostel — 3 meals/day (veg & non-veg)\n- **Average Meal Cost**: ₹50 - ₹120\n\nMonthly mess pass available for hostel students! 🥗"
  },
  // Medical
  {
    id: 33,
    intent: "medical",
    keywords: ["medical", "doctor", "hospital", "sick", "ill", "emergency", "ambulance"],
    patterns: ["medical facility", "is there a doctor", "what to do if i'm sick", "medical emergency"],
    response: "🏥 Medical facilities:\n- **Health Center**: Block A, Ground Floor (Mon-Sat, 9 AM - 6 PM)\n- **Doctor**: Available on-call 24/7 for hostel students\n- **Ambulance**: Free service to nearby hospital\n- **Tie-up Hospital**: Apollo Clinic (5 km away) — cashless treatment with student ID\n\n**Emergency**: Call **+91-1234-567800** anytime! 🚨"
  },
  // Lost ID / Documents
  {
    id: 34,
    intent: "lost_id",
    keywords: ["lost", "id", "card", "missing", "stolen", "duplicate"],
    patterns: ["lost my id card", "how to get duplicate id", "id card stolen"],
    response: "😟 Lost your ID card? Don't worry!\n1. File an **FIR** at the local police station\n2. Bring FIR copy + ₹200 fee + 1 passport photo to **Student Section**\n3. Fill the duplicate ID card application\n4. Collect new card in **5-7 working days**\n\nMeanwhile, carry the FIR copy as proof on campus! 🪪"
  },
  // Bonafide / Certificates
  {
    id: 35,
    intent: "bonafide",
    keywords: ["bonafide", "certificate", "character", "course", "completion"],
    patterns: ["how to get bonafide certificate", "character certificate", "course completion certificate"],
    response: "📃 To get certificates:\n1. Apply at the **Academic Section** (Block B)\n2. Fill request form (₹50 per certificate)\n3. Attach: ID card copy + valid reason\n4. Collect in **3-5 working days**\n\nAvailable certificates: Bonafide, Character, Course Completion, Provisional, Transcript 📋"
  },
  // Holidays / Calendar
  {
    id: 36,
    intent: "holidays",
    keywords: ["holiday", "vacation", "break", "calendar", "leave", "off"],
    patterns: ["when is the holiday", "academic calendar", "winter break", "summer vacation"],
    response: "🎉 Academic calendar highlights:\n- **Winter Break**: Dec 20 - Jan 5\n- **Summer Vacation**: May 20 - July 10\n- **Diwali Break**: 5 days (October/November)\n- **Holi Break**: 2 days (March)\n- **National Holidays**: All gazetted holidays observed\n\nFull calendar at **cpu.edu.in/calendar** 📅"
  },
  // Wifi on campus
  {
    id: 37,
    intent: "campus_wifi",
    keywords: ["wifi", "internet", "campus", "wi-fi", "connect"],
    patterns: ["how to connect to campus wifi", "wifi password", "campus internet"],
    response: "📶 Campus Wi-Fi access:\n1. Connect to **CPU-Campus** SSID\n2. Open browser → redirected to login page\n3. Login with **University ID** & **Date of Birth** (default password)\n4. Change password on first login\n\nIssues? Email **wifi@cpu.edu.in** or visit IT Helpdesk! 💻"
  },
  // Result
  {
    id: 38,
    intent: "result",
    keywords: ["result", "marks", "grade", "score", "declare", "check"],
    patterns: ["when will result be declared", "how to check result", "where to see marks", "result date"],
    response: "📊 Results information:\n- **Declaration**: Within 30-45 days of last exam\n- **Check at**: **portal.cpu.edu.in → Examination → Results**\n- **Login with**: Roll Number + Date of Birth\n- **SMS Alert**: Auto-sent to registered mobile\n\nFor mark sheet collection, visit Examination Cell after 15 days! 📜"
  },
  // Anti-ragging
  {
    id: 39,
    intent: "ragging",
    keywords: ["ragging", "bully", "harass", "complain", "report"],
    patterns: ["how to report ragging", "anti-ragging helpline", "ragging complaint"],
    response: "🛡️ CPU has a **strict zero-tolerance** policy on ragging.\n\n**Report Ragging**:\n- 📞 Anti-Ragging Helpline: **1800-180-5522** (24/7)\n- 📧 Email: **antiragging@cpu.edu.in**\n- 🏢 Visit: Anti-Ragging Cell (Block A, Room 105)\n- 🔒 All complaints are 100% confidential\n\nYour safety is our priority! 💙"
  },
  // About University
  {
    id: 40,
    intent: "about",
    keywords: ["about", "university", "cpu", "career", "point", "history", "established"],
    patterns: ["about career point university", "tell me about cpu", "university history", "when was it established"],
    response: "🏛️ **Career Point University (CPU)**\n- **Established**: 2012\n- **Location**: Knowledge Park, New Delhi\n- **Recognition**: UGC approved, NAAC accredited\n- **Campus**: 50+ acres lush green campus\n- **Students**: 10,000+ across all programs\n- **Faculty**: 500+ qualified professors\n\nA premier institution shaping tomorrow's leaders! 🌟"
  },
];

export const fallbackResponses = [
  "🤔 I'm not sure I understand that. Could you rephrase your question? You can ask me about exams, fees, hostel, admissions, or campus info!",
  "😅 Hmm, I couldn't find an answer for that. Try asking about academics, fees, hostel, or campus facilities!",
  "🔍 I didn't quite catch that. Here are some things I can help with: timetable, fees, scholarships, hostel, library, and more!",
  "💭 That's a tricky one! Try asking something like 'When do exams start?' or 'How to pay fees online?'",
];

export const quickActions = [
  { label: "📅 Exam Schedule", query: "When will the semester exams start?" },
  { label: "💰 Fee Deadline", query: "What is the last date for fee submission?" },
  { label: "📋 Timetable", query: "Where can I download the timetable?" },
  { label: "🏠 Hostel Info", query: "What are hostel charges?" },
  { label: "📚 Library", query: "Where is the library located?" },
  { label: "🎓 Scholarship", query: "Is scholarship available?" },
];
