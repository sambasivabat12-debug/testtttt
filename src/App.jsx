import React, { useState, useRef, useEffect } from "react";
import "./index.css";

const C = {
  bg: "#F0F4F8", card: "#FFFFFF", navy: "#1A3C5E", teal: "#2A9D8F",
  accent: "#E9C46A", soft: "#E8F4F3", danger: "#E76F51", muted: "#8A9BB0",
  text: "#1A2E3B", purple: "#6B5CE7", green: "#27AE60",
};

const CLINIC = { name: "Sri Sai Speciality Dental Care", sub: "(T V Rao)", phone: "8688033072", address: "H.No: 8-5-255/10/1, T.K.R. College Road, Hyderabad", tagline: "Beauty is power and smile its sword" };
const WA = (msg) => `https://wa.me/918688033072?text=${encodeURIComponent(msg)}`;

const DOCTORS = [
  { id: 1, name: "Dr. T. Venkat Rao", initials: "VR", role: "Senior Dental Surgeon", qual: "BDS, M.R.S.H, FAGE", exp: "35 Years", color: C.navy, specialties: ["Implantology","Root Canal","Oral Surgery","IDA Member"], slots: ["10:00","10:30","11:00","11:30","17:30","18:00","18:30","19:00","19:30"] },
  { id: 2, name: "Dr. T. Sai Vakula",  initials: "SV", role: "Maxillofacial Surgeon & Implantologist", qual: "BDS, MDS (OMFS)", exp: "11 Years", color: C.teal,  specialties: ["OMFS","Jaw Surgery","Implants","Complex Surgery"], slots: ["10:00","11:00","12:00","17:30","18:30","19:00","20:00","20:30"] },
];

const TREATMENTS = ["Consultation","Dental Implant","Root Canal","Zirconium Crown","Wisdom Tooth Extraction","Jaw Surgery","Smile Makeover","Scaling & Cleaning","Dentures","Orthodontics","Teeth Whitening","Other"];

const GALLERY_CASES = [
  { id:1, title:"Dental Implants",       tag:"Implantology",   doc:"Dr. T. Sai Vakula",  before:"Missing tooth, bone loss",   after:"Titanium implant + crown",     color:C.teal,   icon:"🦷" },
  { id:2, title:"Zirconium Crowns",      tag:"Cosmetic",       doc:"Dr. T. Sai Vakula",  before:"Decayed anterior teeth",     after:"Premium zirconium crowns",     color:C.purple, icon:"✨" },
  { id:3, title:"Full Mouth Rehab",      tag:"Full Rehab",     doc:"Dr. T. Sai Vakula",  before:"Edentulous lower arch",      after:"Full arch implant prosthesis", color:C.navy,   icon:"😁" },
  { id:4, title:"Smile Transformation",  tag:"Smile Makeover", doc:"Dr. T. Venkat Rao",  before:"Discoloured, uneven teeth",  after:"Bright transformed smile",     color:"#E9AA20",icon:"🌟" },
  { id:5, title:"Accident Crown Repair", tag:"Crown Restore",  doc:"Dr. T. Sai Vakula",  before:"Fractured trauma teeth",     after:"Crowns restored, smiling",     color:C.danger, icon:"🛡️" },
  { id:6, title:"Beautiful Smiles",      tag:"Prosthodontics", doc:"Dr. T. Venkat Rao",  before:"Toothless — no confidence",  after:"Full dentures, radiant smile", color:C.green,  icon:"💎" },
];

const INIT_RX = [
  { id:1, patient:"Ravi Kumar",   date:"2026-05-16", doctor:"Dr. T. Venkat Rao", diagnosis:"Post-implant care",  meds:[{name:"Amoxicillin 500mg",dose:"1 tab",freq:"3x daily",days:5},{name:"Ibuprofen 400mg",dose:"1 tab",freq:"As needed",days:3},{name:"Chlorhexidine Mouthwash",dose:"10ml rinse",freq:"Twice daily",days:7}], instructions:"Avoid hard foods 1 week. No smoking.", file:null },
  { id:2, patient:"Priya Sharma", date:"2026-05-16", doctor:"Dr. T. Venkat Rao", diagnosis:"Root Canal post-op", meds:[{name:"Amoxicillin 500mg",dose:"1 tab",freq:"3x daily",days:5},{name:"Metronidazole 400mg",dose:"1 tab",freq:"3x daily",days:5}], instructions:"Avoid chewing on treated tooth.", file:null },
];

const INIT_APPOINTMENTS = [
  { id:1, patient:"Ravi Kumar",  time:"09:00", type:"Dental Implant", doctor:"Dr. T. Venkat Rao", date:"2026-05-16", status:"in-progress", room:"Room 1" },
  { id:2, patient:"Priya Sharma",time:"10:30", type:"Root Canal",     doctor:"Dr. T. Venkat Rao", date:"2026-05-16", status:"upcoming",    room:"Room 1" },
  { id:3, patient:"Suresh Reddy",time:"11:30", type:"Jaw Surgery",    doctor:"Dr. T. Sai Vakula", date:"2026-05-16", status:"upcoming",    room:"Room 2" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Card = ({ children, style={}, onClick }) => (
  <div onClick={onClick} style={{ background:C.card, borderRadius:16, padding:20, boxShadow:"0 2px 16px rgba(26,60,94,0.07)", ...style }}>{children}</div>
);
const Btn = ({ children, color=C.teal, light, small, full, onClick, style={} }) => (
  <button onClick={onClick} style={{ background:light?color+"18":color, color:light?color:"#fff", border:"none", borderRadius:10, padding:small?"6px 12px":"10px 18px", fontWeight:700, fontSize:small?12:13, cursor:"pointer", width:full?"100%":"auto", ...style }}>{children}</button>
);
const Badge = ({ status }) => {
  const m = { confirmed:{bg:"#E8F5E9",c:"#2E7D32",l:"Confirmed"}, "checked-in":{bg:"#E3F2FD",c:"#1565C0",l:"Checked In"}, pending:{bg:"#FFF8E1",c:"#F57F17",l:"Pending"}, "in-progress":{bg:"#FCE4EC",c:"#AD1457",l:"In Progress"}, upcoming:{bg:"#F3E5F5",c:"#6A1B9A",l:"Upcoming"}, paid:{bg:"#E8F5E9",c:"#2E7D32",l:"Paid"}, unpaid:{bg:"#FEECEC",c:"#C0392B",l:"Unpaid"}, partial:{bg:"#FFF3E0",c:"#E65100",l:"Partial"} };
  const s = m[status]||{bg:"#eee",c:"#555",l:status};
  return <span style={{background:s.bg,color:s.c,borderRadius:20,padding:"3px 11px",fontSize:11,fontWeight:700}}>{s.l}</span>;
};
const ClinicLogo = ({ size=42 }) => (
  <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="21" cy="21" rx="19" ry="7" fill="none" stroke="#5BB8D4" strokeWidth="1.5" opacity="0.7" transform="rotate(-30 21 21)"/>
    <ellipse cx="21" cy="21" rx="19" ry="7" fill="none" stroke="#E8A0A0" strokeWidth="1" opacity="0.5" transform="rotate(30 21 21)"/>
    <circle cx="5"  cy="18" r="2.2" fill="#4A9CC7"/>
    <circle cx="37" cy="14" r="2.2" fill="#4A9CC7"/>
    <circle cx="33" cy="36" r="2.2" fill="#4A9CC7"/>
    <path d="M17 10 C15 10 13 12 13 15 C13 17 14 19 14 21 C14 25 15 30 17 30 C18 30 18.5 28 19 26 C19.5 24 20 23 21 23 C22 23 22.5 24 23 26 C23.5 28 24 30 25 30 C27 30 28 25 28 21 C28 19 29 17 29 15 C29 12 27 10 25 10 C23.5 10 22.5 11 21 11 C19.5 11 18.5 10 17 10 Z" fill="white" opacity="0.95"/>
  </svg>
);
const WAIcon = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// ─── PRINT HELPER ─────────────────────────────────────────────────────────────
const printContent = (html, title="Sri Sai Dental Care") => {
  const full = `<!DOCTYPE html><html><head><title>${title}</title><style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Georgia,serif;padding:28px;color:#1A2E3B;max-width:720px;margin:0 auto;font-size:13px;}
    h1{color:#1A3C5E;font-size:20px;margin:0 0 3px;}
    h2{color:#2A9D8F;font-size:14px;margin:0 0 14px;font-weight:600;}
    .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #2A9D8F;padding-bottom:12px;margin-bottom:18px;}
    .clinic{font-size:11px;color:#8A9BB0;text-align:right;line-height:1.6;}
    table{width:100%;border-collapse:collapse;margin:10px 0 16px;}
    th{background:#1A3C5E;color:#fff;padding:8px 10px;text-align:left;font-size:11px;font-weight:600;}
    td{padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;vertical-align:top;}
    tr:nth-child(even) td{background:#f9f9f9;}
    .badge{background:#E8F4F3;color:#2A9D8F;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;display:inline-block;}
    .footer{margin-top:20px;padding-top:10px;border-top:1px solid #eee;font-size:10px;color:#8A9BB0;text-align:center;}
    .print-btn{margin-top:18px;display:block;background:#1A3C5E;color:#fff;border:none;padding:10px 28px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:700;}
    @media print{.print-btn{display:none!important;} body{padding:16px;}}
    p{margin:6px 0;line-height:1.6;}
    strong{color:#1A3C5E;}
  </style></head><body>
    ${html}
    <div class="footer">${CLINIC.name} · ${CLINIC.address} · 📞 ${CLINIC.phone}</div>
    <button class="print-btn" onclick="window.print()">🖨 Print this document</button>
    <script>setTimeout(function(){ window.print(); }, 600);</script>
  </body></html>`;
  try {
    const blob = new Blob([full], { type:"text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch(e) {
    const w = window.open("about:blank", "_blank");
    if (w) { w.document.write(full); w.document.close(); }
    else { alert("Please allow popups for this site to enable printing."); }
  }
};

// ─── PATIENT AUTH CONTEXT ─────────────────────────────────────────────────────
const MOCK_USERS = [
  { id:1, name:"Ravi Kumar",   phone:"9848011001", pin:"1234", history:[{date:"2026-04-10",treatment:"Dental Implant (Phase 1)",doctor:"Dr. T. Venkat Rao",amount:25500},{date:"2026-03-01",treatment:"Consultation",doctor:"Dr. T. Venkat Rao",amount:300}], nextAppt:"2026-05-20 09:00", upcomingTreatment:"Dental Implant (Phase 2)" },
  { id:2, name:"Priya Sharma", phone:"9848022002", pin:"5678", history:[{date:"2026-04-10",treatment:"Root Canal — Molar",doctor:"Dr. T. Venkat Rao",amount:8000}], nextAppt:"2026-05-16 10:30", upcomingTreatment:"Crown Fitting" },
];

// ─── PATIENT LOGIN ────────────────────────────────────────────────────────────
function PatientLoginView({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  // const [otpSent, setOtpSent] = useState(false);

  const login = () => {
    const user = MOCK_USERS.find(u => u.phone === phone.replace(/\D/g,"") && u.pin === pin);
    if (user) { onLogin(user); }
    else { setError("Incorrect phone or PIN. Try 9848011001 / 1234"); }
  };

  const register = () => {
    if (!name || !phone || !pin) { setError("Please fill all fields"); return; }
    const newUser = { id: Date.now(), name, phone: phone.replace(/\D/g,""), pin, history:[], nextAppt:null, upcomingTreatment:null };
    window.open(WA(`🆕 NEW PATIENT REGISTRATION\nName: ${name}\nPhone: ${phone}\nPlease add to system.\n— Sri Sai App`), "_blank");
    onLogin(newUser);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ textAlign:"center", padding:"20px 0 10px" }}>
        <ClinicLogo size={64} />
        <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:"12px 0 4px" }}>Patient Portal</h2>
        <p style={{ color:C.muted, fontSize:13, margin:0 }}>Login to view appointments & history</p>
      </div>

      <div style={{ display:"flex", borderRadius:12, overflow:"hidden", border:`2px solid ${C.soft}` }}>
        {["login","register"].map(t => (
          <button key={t} onClick={() => { setTab(t); setError(""); }} style={{ flex:1, padding:"10px", border:"none", background:tab===t?C.teal:"white", color:tab===t?"#fff":C.muted, fontWeight:700, fontSize:13, cursor:"pointer", textTransform:"capitalize" }}>{t === "login" ? "🔑 Login" : "📝 Register"}</button>
        ))}
      </div>

      <Card style={{ padding:20 }}>
        {tab === "login" ? (
          <>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:C.muted, fontWeight:600, display:"block", marginBottom:6 }}>Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98480 XXXXX" type="tel"
                style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.soft}`, borderRadius:12, fontSize:14, boxSizing:"border-box", outline:"none" }} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:12, color:C.muted, fontWeight:600, display:"block", marginBottom:6 }}>PIN</label>
              <input value={pin} onChange={e => setPin(e.target.value)} placeholder="4-digit PIN" type="password" maxLength={4}
                style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.soft}`, borderRadius:12, fontSize:14, boxSizing:"border-box", outline:"none" }} />
            </div>
            {error && <div style={{ background:"#FEECEC", color:C.danger, borderRadius:10, padding:"8px 12px", fontSize:12, marginBottom:12 }}>{error}</div>}
            <Btn full onClick={login}>Login →</Btn>
            <div style={{ textAlign:"center", marginTop:10, fontSize:12, color:C.muted }}>Demo: Phone 9848011001 · PIN 1234</div>
          </>
        ) : (
          <>
            {[["Full Name","name","text",name,setName],["Phone Number","phone","tel",phone,setPhone],["Create 4-digit PIN","pin","password",pin,setPin]].map(([ph,field,type,val,set]) => (
              <div key={field} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, color:C.muted, fontWeight:600, display:"block", marginBottom:6 }}>{ph}</label>
                <input value={val} onChange={e => set(e.target.value)} placeholder={ph} type={type} maxLength={field==="pin"?4:undefined}
                  style={{ width:"100%", padding:"11px 14px", border:`1.5px solid ${C.soft}`, borderRadius:12, fontSize:14, boxSizing:"border-box", outline:"none" }} />
              </div>
            ))}
            {error && <div style={{ background:"#FEECEC", color:C.danger, borderRadius:10, padding:"8px 12px", fontSize:12, marginBottom:12 }}>{error}</div>}
            <Btn full onClick={register}>Register & Continue →</Btn>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── PATIENT DASHBOARD ────────────────────────────────────────────────────────
function PatientDashboard({ patient, onLogout, setMainView }) {
  const [tab, setTab] = useState("home");

  const printHistory = () => {
    const rows = patient.history.map(h => `<tr><td>${h.date}</td><td>${h.treatment}</td><td>${h.doctor}</td><td>₹${h.amount.toLocaleString("en-IN")}</td></tr>`).join("");
    printContent(`
      <div class="header"><div><h1>${CLINIC.name}</h1><h2>Treatment History</h2></div><div class="clinic">Patient: ${patient.name}<br/>Phone: ${patient.phone}</div></div>
      <table><thead><tr><th>Date</th><th>Treatment</th><th>Doctor</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
    `, "Treatment History");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Welcome, {patient.name.split(" ")[0]} 👋</h2>
          <p style={{ color:C.muted, fontSize:13, margin:"3px 0 0" }}>Your dental care portal</p>
        </div>
        <button onClick={onLogout} style={{ background:C.soft, border:"none", borderRadius:20, padding:"6px 14px", color:C.muted, fontWeight:700, fontSize:12, cursor:"pointer" }}>Logout</button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
        {[["home","🏠 Home"],["book","📅 Book"],["history","📋 History"],["myrx","💊 Prescriptions"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:20, border:`2px solid ${tab===t?C.teal:C.soft}`, background:tab===t?C.teal:"white", color:tab===t?"#fff":C.muted, fontWeight:700, fontSize:12, cursor:"pointer" }}>{l}</button>
        ))}
      </div>

      {tab === "home" && (
        <>
          {patient.nextAppt && (
            <Card style={{ background:C.navy, padding:20 }}>
              <div style={{ color:"#5BB8D4", fontSize:12, fontWeight:700, marginBottom:6 }}>NEXT APPOINTMENT</div>
              <div style={{ color:"#fff", fontSize:18, fontWeight:800 }}>{patient.nextAppt}</div>
              <div style={{ color:"#aac", fontSize:13, marginTop:4 }}>{patient.upcomingTreatment}</div>
              <div style={{ display:"flex", gap:8, marginTop:14 }}>
                <a href={WA(`Hi, I have an appointment on ${patient.nextAppt}. I'd like to confirm.`)} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:6, background:"#25D366", borderRadius:10, padding:"8px 14px", textDecoration:"none" }}>
                  <WAIcon size={14}/><span style={{ color:"#fff", fontWeight:700, fontSize:12 }}>Confirm via WhatsApp</span>
                </a>
                <button onClick={() => setTab("book")} style={{ background:"#fff2", color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", fontWeight:700, fontSize:12, cursor:"pointer" }}>Reschedule</button>
              </div>
            </Card>
          )}
          <div style={{ display:"flex", gap:12 }}>
            {[["📋","Visits",patient.history.length,C.teal],["💰","Total Spent","₹"+patient.history.reduce((s,h)=>s+h.amount,0).toLocaleString("en-IN"),C.navy]].map(([ic,l,v,col]) => (
              <div key={l} style={{ flex:1, background:col+"12", borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
                <div style={{ fontSize:22 }}>{ic}</div>
                <div style={{ fontSize:20, fontWeight:800, color:col, marginTop:4 }}>{v}</div>
                <div style={{ fontSize:11, color:C.muted }}>{l}</div>
              </div>
            ))}
          </div>
          <Btn full color={"#25D366"} onClick={() => window.open(WA(`Hi Sri Sai Speciality Dental Care! I'd like to book an appointment.`), "_blank")}>
            💬 Chat with Clinic on WhatsApp
          </Btn>
        </>
      )}

      {tab === "book" && <PatientBookingView patient={patient} />}

      {tab === "history" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontWeight:800, fontSize:15, color:C.navy }}>Treatment History</div>
            <Btn small onClick={printHistory}>🖨 Print</Btn>
          </div>
          {patient.history.length === 0 && <div style={{ textAlign:"center", color:C.muted, padding:40 }}>No treatment history yet</div>}
          {patient.history.map((h, i) => (
            <Card key={i} style={{ padding:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{h.treatment}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{h.doctor} · {h.date}</div>
                </div>
                <div style={{ fontWeight:800, fontSize:16, color:C.teal }}>₹{h.amount.toLocaleString("en-IN")}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "myrx" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontWeight:800, fontSize:15, color:C.navy }}>My Prescriptions</div>
          {INIT_RX.filter(r => r.patient === patient.name).map(rx => (
            <PatientRxCard key={rx.id} rx={rx} />
          ))}
          {INIT_RX.filter(r => r.patient === patient.name).length === 0 && (
            <div style={{ textAlign:"center", color:C.muted, padding:40 }}>No prescriptions yet</div>
          )}
        </div>
      )}
    </div>
  );
}

function PatientRxCard({ rx }) {
  const printRx = () => {
    const rows = rx.meds.map(m => `<tr><td>${m.name}</td><td>${m.dose}</td><td>${m.freq}</td><td>${m.days} days</td></tr>`).join("");
    printContent(`
      <div class="header"><div><h1>${CLINIC.name}</h1><h2>Prescription</h2></div><div class="clinic">Date: ${rx.date}<br/>Doctor: ${rx.doctor}</div></div>
      <p><strong>Patient:</strong> ${rx.patient} &nbsp; <strong>Diagnosis:</strong> ${rx.diagnosis}</p>
      <table><thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th></tr></thead><tbody>${rows}</tbody></table>
      ${rx.instructions ? `<p><strong>Instructions:</strong> ${rx.instructions}</p>` : ""}
    `, "Prescription");
  };
  return (
    <Card style={{ padding:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:14, color:C.navy }}>{rx.diagnosis}</div>
          <div style={{ fontSize:12, color:C.muted }}>{rx.doctor} · {rx.date}</div>
        </div>
        <span style={{ background:C.purple+"15", color:C.purple, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{rx.meds.length} meds</span>
      </div>
      {rx.meds.map((m,i) => (
        <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 2fr 1fr", gap:6, padding:"7px 10px", background:C.soft, borderRadius:8, marginBottom:5, fontSize:11 }}>
          <span style={{ fontWeight:700, color:C.text }}>{m.name}</span>
          <span style={{ color:C.muted }}>{m.dose}</span>
          <span style={{ color:C.teal }}>{m.freq}</span>
          <span style={{ color:C.navy, fontWeight:700 }}>{m.days}d</span>
        </div>
      ))}
      {rx.instructions && <div style={{ marginTop:8, background:"#FFF8E1", borderRadius:8, padding:"7px 12px", fontSize:12, color:"#7A6020" }}>📋 {rx.instructions}</div>}
      <div style={{ display:"flex", gap:8, marginTop:12 }}>
        <Btn small onClick={printRx}>🖨 Print Rx</Btn>
        <Btn small color="#25D366" onClick={() => window.open(WA(`Please send my prescription for ${rx.diagnosis} dated ${rx.date}. Patient: ${rx.patient}`), "_blank")}><WAIcon size={12}/> Request Copy</Btn>
      </div>
    </Card>
  );
}

// ─── PATIENT BOOKING ──────────────────────────────────────────────────────────
function PatientBookingView({ patient }) {
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState({ doctor:null, treatment:"", date:"", slot:"", notes:"" });
  const [done, setDone] = useState(false);

  const confirm = () => {
    if (!sel.doctor || !sel.treatment || !sel.date || !sel.slot) return;
    const msg = `🦷 APPOINTMENT BOOKING\nPatient: ${patient?.name || "Guest"}\nPhone: ${patient?.phone || "N/A"}\nDoctor: ${sel.doctor.name}\nTreatment: ${sel.treatment}\nDate: ${sel.date}\nTime: ${sel.slot}\nNotes: ${sel.notes || "None"}\n\nSri Sai Speciality Dental Care App`;
    window.open(WA(msg), "_blank");
    if (patient?.phone) {
      const pm = `✅ Appointment Booked!\nDear ${patient.name},\nYour appointment is confirmed!\nDoctor: ${sel.doctor.name}\nTreatment: ${sel.treatment}\nDate: ${sel.date} at ${sel.slot}\nClinic: ${CLINIC.name}\n📞 ${CLINIC.phone}`;
      setTimeout(() => window.open(`https://wa.me/91${patient.phone.replace(/\D/g,"").slice(-10)}?text=${encodeURIComponent(pm)}`, "_blank"), 800);
    }
    setDone(true);
  };

  if (done) return (
    <div style={{ textAlign:"center", padding:"30px 20px" }}>
      <div style={{ fontSize:60, marginBottom:12 }}>🎉</div>
      <h2 style={{ color:C.navy, margin:"0 0 8px" }}>Appointment Booked!</h2>
      <Card style={{ padding:16, marginBottom:16 }}>
        {[["Doctor",sel.doctor?.name],["Treatment",sel.treatment],["Date",sel.date],["Time",sel.slot]].map(([k,v]) => v && (
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px dashed ${C.soft}` }}>
            <span style={{ fontSize:12, color:C.muted }}>{k}</span>
            <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>{v}</span>
          </div>
        ))}
      </Card>
      <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>WhatsApp sent to clinic & your number!</p>
      <Btn onClick={() => { setDone(false); setStep(1); setSel({ doctor:null, treatment:"", date:"", slot:"", notes:"" }); }}>Book Another</Btn>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontWeight:800, fontSize:16, color:C.navy }}>Book Appointment</div>

      {/* Step dots */}
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        {["Doctor","Treatment","Date & Time","Confirm"].map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:i+1<=step?C.teal:"#ddd", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12 }}>{i+1}</div>
            {i<3 && <div style={{ height:2, width:18, background:i+1<step?C.teal:"#ddd", borderRadius:2 }} />}
          </div>
        ))}
        <span style={{ fontSize:11, color:C.muted, marginLeft:6 }}>Step {step}/4</span>
      </div>

      <Card style={{ padding:18 }}>
        {step === 1 && (
          <>
            <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>Choose Your Doctor</div>
            {DOCTORS.map(d => (
              <div key={d.id} onClick={() => setSel(s => ({ ...s, doctor:d }))}
                style={{ display:"flex", gap:12, alignItems:"center", padding:"14px", borderRadius:14, border:`2px solid ${sel.doctor?.id===d.id?d.color:C.soft}`, background:sel.doctor?.id===d.id?d.color+"08":"white", cursor:"pointer", marginBottom:10 }}>
                <div style={{ width:48, height:48, borderRadius:"50%", background:d.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:16 }}>{d.initials}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:800, fontSize:14, color:C.navy }}>{d.name}</div>
                  <div style={{ fontSize:12, color:d.color, fontWeight:600 }}>{d.role}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{d.exp} · {d.qual}</div>
                </div>
                {sel.doctor?.id===d.id && <span style={{ fontSize:20 }}>✅</span>}
              </div>
            ))}
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>Select Treatment</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {TREATMENTS.map(t => (
                <button key={t} onClick={() => setSel(s => ({ ...s, treatment:t }))}
                  style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${sel.treatment===t?C.teal:C.soft}`, background:sel.treatment===t?C.teal:"white", color:sel.treatment===t?"#fff":C.text, fontWeight:600, fontSize:12, cursor:"pointer" }}>{t}</button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>Pick Date & Time</div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, color:C.muted, fontWeight:600, display:"block", marginBottom:6 }}>Date</label>
              <input type="date" value={sel.date} onChange={e => setSel(s => ({ ...s, date:e.target.value }))}
                style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${C.soft}`, borderRadius:12, fontSize:14, boxSizing:"border-box", outline:"none" }} />
            </div>
            <div style={{ fontWeight:600, fontSize:12, color:C.muted, marginBottom:8 }}>Available Slots — {sel.doctor?.name}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {(sel.doctor?.slots || []).map(slot => (
                <button key={slot} onClick={() => setSel(s => ({ ...s, slot }))}
                  style={{ padding:"8px 14px", borderRadius:10, border:`1.5px solid ${sel.slot===slot?C.teal:C.soft}`, background:sel.slot===slot?C.teal:"white", color:sel.slot===slot?"#fff":C.text, fontWeight:700, fontSize:13, cursor:"pointer" }}>{slot}</button>
              ))}
            </div>
            <div style={{ marginTop:14 }}>
              <label style={{ fontSize:12, color:C.muted, fontWeight:600, display:"block", marginBottom:6 }}>Notes (optional)</label>
              <textarea value={sel.notes} onChange={e => setSel(s => ({ ...s, notes:e.target.value }))} placeholder="Any concerns or symptoms..." rows={2}
                style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.soft}`, borderRadius:10, fontSize:13, resize:"none", boxSizing:"border-box", outline:"none" }} />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div style={{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:14 }}>Confirm Details</div>
            {[["Doctor",sel.doctor?.name],["Speciality",sel.doctor?.role],["Treatment",sel.treatment],["Date",sel.date],["Time",sel.slot],["Notes",sel.notes||"None"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"9px 12px", background:C.soft, borderRadius:10, marginBottom:6 }}>
                <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:700, color:C.navy, textAlign:"right", maxWidth:"60%" }}>{v}</span>
              </div>
            ))}
            <div style={{ background:"#E8F5E9", borderRadius:10, padding:"10px 14px", marginTop:8, fontSize:12, color:"#2E7D32" }}>
              💬 WhatsApp confirmation will be sent to clinic & your number automatically.
            </div>
          </>
        )}

        <div style={{ display:"flex", gap:10, marginTop:18 }}>
          {step > 1 && <Btn light color={C.muted} style={{ flex:1 }} onClick={() => setStep(s => s-1)}>← Back</Btn>}
          {step < 4
            ? <Btn style={{ flex:2 }} onClick={() => setStep(s => s+1)}>Next →</Btn>
            : <Btn color={C.green} style={{ flex:2 }} onClick={confirm}>✅ Confirm & Send WhatsApp</Btn>
          }
        </div>
      </Card>
    </div>
  );
}

// ─── GALLERY VIEW ─────────────────────────────────────────────────────────────
function GalleryView() {
  const [cases, setCases] = useState(GALLERY_CASES);
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const [confirmDelG, setConfirmDelG] = useState(null);
  const tags = ["All", ...new Set(GALLERY_CASES.map(c => c.tag))];
  const filtered = filter === "All" ? cases : cases.filter(c => c.tag === filter);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Treatment Gallery</h2>
        <p style={{ color:C.muted, fontSize:13, margin:"4px 0 0" }}>Real before & after smile transformations</p>
      </div>
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4 }}>
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:`2px solid ${C.teal}`, background:filter===t?C.teal:"white", color:filter===t?"#fff":C.teal, fontWeight:700, fontSize:12, cursor:"pointer" }}>{t}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(c => (
          <Card key={c.id} style={{ padding:0, overflow:"hidden", cursor:"pointer", border:sel===c.id?`2px solid ${c.color}`:"2px solid transparent" }} onClick={() => setSel(sel===c.id?null:c.id)}>
            <div style={{ padding:"16px 16px 12px", background:c.color+"10" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:c.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:15, color:C.navy }}>{c.title}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{c.doc}</div>
                  </div>
                </div>
                <span style={{ background:c.color, color:"#fff", borderRadius:20, padding:"3px 10px", fontSize:10, fontWeight:700 }}>{c.tag}</span>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
              <div style={{ padding:"12px 14px", background:"#FFF0F0", borderRight:`1px solid #FFD5D5` }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.danger, marginBottom:4, letterSpacing:1 }}>BEFORE</div>
                <div style={{ fontSize:13, color:C.text }}>{c.before}</div>
              </div>
              <div style={{ padding:"12px 14px", background:"#F0FFF4" }}>
                <div style={{ fontSize:10, fontWeight:800, color:C.green, marginBottom:4, letterSpacing:1 }}>AFTER</div>
                <div style={{ fontSize:13, color:C.text }}>{c.after}</div>
              </div>
            </div>
            {sel === c.id && (
              <div style={{ padding:"14px 16px", borderTop:`1px solid ${C.soft}`, display:"flex", gap:8 }}>
                <Btn small color={c.color} onClick={() => window.open(WA(`Hi, I saw the ${c.title} case on your app. I'd like to book a similar treatment.`), "_blank")}>
                  💬 Book Similar Treatment
                </Btn>
                <button onClick={() => setConfirmDelG(c.id)} style={{ background:C.danger+"18", color:C.danger, border:"none", borderRadius:8, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑 Remove</button>
              </div>
            )}
            {confirmDelG === c.id && (
              <div style={{ padding:"10px 16px", background:"#FEECEC", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:C.danger, fontWeight:600 }}>Remove this case?</span>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn small color={C.danger} onClick={() => { setCases(cc => cc.filter(x=>x.id!==c.id)); setConfirmDelG(null); setSel(null); }}>Remove</Btn>
                  <Btn small light color={C.muted} onClick={() => setConfirmDelG(null)}>Cancel</Btn>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PAYMENTS VIEW ────────────────────────────────────────────────────────────
function PaymentsView() {
  const [invoices, setInvoices] = useState([
    { id:"INV-002", patient:"Priya Sharma", date:"2026-04-10", items:[{desc:"Root Canal",amount:8000}], status:"paid" },
    { id:"INV-003", patient:"Suresh Reddy", date:"2026-05-18", items:[{desc:"Jaw Surgery",amount:35000},{desc:"Consultation",amount:500}], status:"partial" },
    { id:"INV-004", patient:"Anitha Devi",  date:"2026-05-22", items:[{desc:"Wisdom Tooth Extraction",amount:3500}], status:"unpaid" },
  ]);
  const [paying, setPaying] = useState(null);
  const [payMethod, setPayMethod] = useState(null);
  const [paid, setPaid] = useState(null);
  const [confirmDelI, setConfirmDelI] = useState(null);

  const total = inv => inv.items.reduce((s,i) => s+i.amount, 0);
  const revenue = invoices.filter(i => i.status==="paid").reduce((s,i) => s+total(i), 0);
  const outstanding = invoices.filter(i => i.status!=="paid").reduce((s,i) => s+total(i), 0);

  const PAY_METHODS = [
    { id:"upi",      label:"UPI",        icon:"📲", color:"#5C35CC", desc:"Any UPI App" },
    { id:"phonepe",  label:"PhonePe",    icon:"💜", color:"#6739B7", desc:"PhonePe UPI" },
    { id:"gpay",     label:"Google Pay", icon:"🟦", color:"#4285F4", desc:"Google Pay" },
    { id:"razorpay", label:"Razorpay",   icon:"💳", color:"#3395FF", desc:"Card / Net Banking" },
  ];

  const doPayment = (inv) => {
    const amt = total(inv);
    if (payMethod === "upi") window.open(`upi://pay?pa=srisaidental@upi&pn=SriSaiDentalCare&am=${amt}&cu=INR&tn=Invoice+${inv.id}`, "_blank");
    else if (payMethod === "phonepe") window.open(`phonepe://pay?pa=srisaidental@ybl&pn=SriSaiDentalCare&am=${amt}&cu=INR`, "_blank");
    else if (payMethod === "gpay") window.open(`tez://upi/pay?pa=srisaidental@okicici&pn=SriSaiDentalCare&am=${amt}&cu=INR`, "_blank");
    else window.open(`https://rzp.io/l/srisaidentalcare?amount=${amt*100}`, "_blank");
    setTimeout(() => {
      setInvoices(list => list.map(i => i.id===inv.id?{...i,status:"paid"}:i));
      setPaid(inv.id); setPaying(null); setPayMethod(null);
      setTimeout(() => setPaid(null), 3000);
    }, 1000);
  };

  const printInvoice = (inv) => {
    const rows = inv.items.map(it => `<tr><td>${it.desc}</td><td>₹${it.amount.toLocaleString("en-IN")}</td></tr>`).join("");
    printContent(`
      <div class="header"><div><h1>${CLINIC.name}</h1><h2>Invoice ${inv.id}</h2></div><div class="clinic">Patient: ${inv.patient}<br/>Date: ${inv.date}</div></div>
      <table><thead><tr><th>Treatment</th><th>Amount</th></tr></thead><tbody>${rows}
      <tr style="font-weight:700;background:#f5f5f5"><td>Total</td><td>₹${total(inv).toLocaleString("en-IN")}</td></tr></tbody></table>
      <p>Status: <span class="badge">${inv.status.toUpperCase()}</span></p>
    `, `Invoice ${inv.id}`);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Payments & Invoices</h2>

      <div style={{ display:"flex", gap:12 }}>
        {[["💰","Collected",`₹${revenue.toLocaleString("en-IN")}`,C.green],["⏳","Outstanding",`₹${outstanding.toLocaleString("en-IN")}`,C.danger]].map(([ic,l,v,col]) => (
          <div key={l} style={{ flex:1, background:col+"12", borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
            <div style={{ fontSize:22 }}>{ic}</div>
            <div style={{ fontSize:18, fontWeight:800, color:col }}>{v}</div>
            <div style={{ fontSize:11, color:C.muted }}>{l}</div>
          </div>
        ))}
      </div>

      {paid && <div style={{ background:"#E8F5E9", borderRadius:12, padding:"12px 16px", color:"#2E7D32", fontWeight:700, fontSize:13 }}>✅ Payment initiated for {paid}!</div>}

      {invoices.map(inv => (
        <Card key={inv.id} style={{ padding:0, overflow:"hidden" }}>
          <div style={{ padding:"14px 16px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ fontWeight:800, fontSize:14, color:C.text }}>{inv.patient}</span>
                  <Badge status={inv.status} />
                </div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{inv.id} · {inv.date}</div>
              </div>
              <div style={{ fontWeight:800, fontSize:18, color:inv.status==="paid"?C.green:C.danger }}>₹{total(inv).toLocaleString("en-IN")}</div>
            </div>
            <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
              <Btn small onClick={() => printInvoice(inv)}>🖨 Print</Btn>
              {inv.status !== "paid" && <Btn small color={C.green} onClick={() => setPaying(inv)}>💳 Pay Now</Btn>}
              <Btn small light color={C.navy} onClick={() => window.open(WA(`Invoice ${inv.id} for ${inv.patient} — ₹${total(inv).toLocaleString("en-IN")} — Status: ${inv.status}`), "_blank")}>💬 WhatsApp</Btn>
              <button onClick={() => setConfirmDelI(inv.id)} style={{ background:C.danger+"18", color:C.danger, border:"none", borderRadius:8, padding:"5px 9px", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑 Remove</button>
            </div>
            {confirmDelI === inv.id && (
              <div style={{ marginTop:8, background:"#FEECEC", borderRadius:10, padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:C.danger, fontWeight:600 }}>Remove invoice {inv.id}?</span>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn small color={C.danger} onClick={() => { setInvoices(ii => ii.filter(x=>x.id!==inv.id)); setConfirmDelI(null); }}>Remove</Btn>
                  <Btn small light color={C.muted} onClick={() => setConfirmDelI(null)}>Cancel</Btn>
                </div>
              </div>
            )}
          </div>

          {/* Payment modal */}
          {paying?.id === inv.id && (
            <div style={{ padding:"14px 16px", borderTop:`2px solid ${C.teal}`, background:C.soft }}>
              <div style={{ fontWeight:700, fontSize:13, color:C.navy, marginBottom:12 }}>Choose Payment Method</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                {PAY_METHODS.map(pm => (
                  <button key={pm.id} onClick={() => setPayMethod(pm.id)}
                    style={{ padding:"12px", border:`2px solid ${payMethod===pm.id?pm.color:C.soft}`, borderRadius:12, background:payMethod===pm.id?pm.color+"12":"white", cursor:"pointer", textAlign:"center" }}>
                    <div style={{ fontSize:24 }}>{pm.icon}</div>
                    <div style={{ fontWeight:800, fontSize:13, color:pm.color }}>{pm.label}</div>
                    <div style={{ fontSize:10, color:C.muted }}>{pm.desc}</div>
                  </button>
                ))}
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <Btn style={{ flex:2 }} color={payMethod?C.green:C.muted} onClick={() => payMethod && doPayment(inv)}>
                  {payMethod ? `Pay ₹${total(inv).toLocaleString("en-IN")} via ${PAY_METHODS.find(p=>p.id===payMethod)?.label}` : "Select a method"}
                </Btn>
                <Btn style={{ flex:1 }} light color={C.muted} onClick={() => { setPaying(null); setPayMethod(null); }}>Cancel</Btn>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── DIGITAL PRESCRIPTIONS (STAFF) ───────────────────────────────────────────
function PrescriptionsView() {
  const [rxList, setRxList] = useState(INIT_RX);
  const [newRx, setNewRx] = useState(false);
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ patient:"", doctor:DOCTORS[0].name, diagnosis:"", instructions:"", meds:[{name:"",dose:"",freq:"",days:""}] });
  const fileRef = useRef(null);
  const [pdfFile, setPdfFile] = useState(null);

  const addMed = () => setForm(f => ({ ...f, meds:[...f.meds,{name:"",dose:"",freq:"",days:""}] }));
  const updMed = (i,k,v) => setForm(f => { const m=[...f.meds]; m[i]={...m[i],[k]:v}; return {...f,meds:m}; });

  const submit = () => {
    if (!form.patient || !form.diagnosis) return;
    setRxList(r => [{ id:Date.now(), ...form, date:"2026-05-16", file:pdfFile?.name||null }, ...r]);
    setNewRx(false); setPdfFile(null);
    setForm({ patient:"", doctor:DOCTORS[0].name, diagnosis:"", instructions:"", meds:[{name:"",dose:"",freq:"",days:""}] });
  };

  const printRx = (rx) => {
    const rows = rx.meds.map(m => `<tr><td>${m.name}</td><td>${m.dose}</td><td>${m.freq}</td><td>${m.days} days</td></tr>`).join("");
    printContent(`
      <div class="header"><div><h1>${CLINIC.name}</h1><h2>Prescription</h2></div><div class="clinic">Date: ${rx.date}<br/>Doctor: ${rx.doctor}</div></div>
      <p><strong>Patient:</strong> ${rx.patient} &nbsp;&nbsp; <strong>Diagnosis:</strong> ${rx.diagnosis}</p>
      <table><thead><tr><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th></tr></thead><tbody>${rows}</tbody></table>
      ${rx.instructions?`<p><strong>Instructions:</strong> ${rx.instructions}</p>`:""}
    `, "Prescription");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Digital Prescriptions</h2>
        <Btn small color={C.purple} onClick={() => setNewRx(!newRx)}>+ New Rx</Btn>
      </div>

      {newRx && (
        <Card style={{ padding:16, border:`2px solid ${C.purple}` }}>
          <div style={{ fontWeight:800, fontSize:14, color:C.purple, marginBottom:14 }}>New Prescription</div>
          {[["Patient Name","patient"],["Diagnosis","diagnosis"],["Instructions","instructions"]].map(([ph,field]) => (
            <div key={field} style={{ marginBottom:10 }}>
              <label style={{ fontSize:11, color:C.muted, fontWeight:600, display:"block", marginBottom:4 }}>{ph}</label>
              <input value={form[field]} onChange={e => setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}
                style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.soft}`, borderRadius:10, fontSize:13, boxSizing:"border-box", outline:"none" }} />
            </div>
          ))}
          <div style={{ marginBottom:10 }}>
            <label style={{ fontSize:11, color:C.muted, fontWeight:600, display:"block", marginBottom:4 }}>Doctor</label>
            <select value={form.doctor} onChange={e => setForm(f=>({...f,doctor:e.target.value}))}
              style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.soft}`, borderRadius:10, fontSize:13, outline:"none" }}>
              {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div style={{ fontWeight:700, fontSize:13, color:C.navy, marginBottom:8 }}>Medicines</div>
          {form.meds.map((m,i) => (
            <div key={i} style={{ background:C.soft, borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {[["Medicine Name","name"],["Dose","dose"],["Frequency","freq"],["Days","days"]].map(([ph,k]) => (
                  <input key={k} value={m[k]} onChange={e => updMed(i,k,e.target.value)} placeholder={ph}
                    style={{ padding:"7px 10px", border:`1px solid ${C.soft}`, borderRadius:8, fontSize:12, outline:"none" }} />
                ))}
              </div>
            </div>
          ))}
          <Btn small light color={C.purple} onClick={addMed} style={{ marginBottom:12 }}>+ Add Medicine</Btn>

          {/* PDF Upload */}
          <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display:"none" }} onChange={e => setPdfFile(e.target.files[0])} />
          <button onClick={() => fileRef.current.click()} style={{ width:"100%", padding:"10px", border:`2px dashed ${C.purple}`, borderRadius:10, background:"white", color:C.purple, fontWeight:700, fontSize:12, cursor:"pointer", marginBottom:12 }}>
            📎 {pdfFile ? `Attached: ${pdfFile.name}` : "Attach Prescription PDF (optional)"}
          </button>

          <div style={{ display:"flex", gap:8 }}>
            <Btn style={{ flex:1 }} color={C.purple} onClick={submit}>Save Prescription</Btn>
            <Btn style={{ flex:1 }} light color={C.muted} onClick={() => setNewRx(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {rxList.map(rx => (
        <Card key={rx.id} style={{ padding:0, overflow:"hidden", cursor:"pointer", border:sel===rx.id?`2px solid ${C.purple}`:"2px solid transparent" }} onClick={() => setSel(sel===rx.id?null:rx.id)}>
          <div style={{ padding:"14px 16px", background:C.purple+"08" }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontWeight:800, fontSize:14, color:C.text }}>{rx.patient}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{rx.diagnosis} · {rx.date}</div>
                <div style={{ fontSize:11, color:C.purple, marginTop:2 }}>👨‍⚕️ {rx.doctor}</div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                <span style={{ background:C.purple+"15", color:C.purple, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{rx.meds.length} meds</span>
                {rx.file && <div style={{ fontSize:10, color:C.green }}>📎 PDF attached</div>}
                <button onClick={e => { e.stopPropagation(); setRxList(r => r.filter(x => x.id!==rx.id)); if(sel===rx.id) setSel(null); }}
                  style={{ background:C.danger+"18", color:C.danger, border:"none", borderRadius:8, padding:"3px 8px", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑 Remove</button>
              </div>
            </div>
          </div>
          {sel === rx.id && (
            <div style={{ padding:"14px 16px" }}>
              {rx.meds.map((m,i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 2fr 1fr", gap:6, padding:"7px 10px", background:C.soft, borderRadius:8, marginBottom:5, fontSize:11 }}>
                  <span style={{ fontWeight:700, color:C.text }}>{m.name}</span>
                  <span style={{ color:C.muted }}>{m.dose}</span>
                  <span style={{ color:C.teal }}>{m.freq}</span>
                  <span style={{ color:C.navy, fontWeight:700 }}>{m.days}d</span>
                </div>
              ))}
              {rx.instructions && <div style={{ marginTop:8, background:"#FFF8E1", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#7A6020" }}>📋 {rx.instructions}</div>}
              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                <Btn small onClick={() => printRx(rx)}>🖨 Print Rx</Btn>
                <Btn small color="#25D366" onClick={() => window.open(WA(`💊 PRESCRIPTION\nPatient: ${rx.patient}\nDiagnosis: ${rx.diagnosis}\n${rx.meds.map(m=>`• ${m.name} ${m.dose} ${m.freq} ${m.days}d`).join("\n")}\nDr: ${rx.doctor}\n${CLINIC.name}`), "_blank")}>
                  <WAIcon size={12}/> Send
                </Btn>
                {rx.file && <Btn small light color={C.purple}>📥 Download PDF</Btn>}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ─── TOOTH CHART ─────────────────────────────────────────────────────────────
const TOOTH_UPPER = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
const TOOTH_LOWER = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
const CONDS = [
  { key:"healthy",   label:"Healthy",    color:"#C8E6C9", border:"#43A047" },
  { key:"decay",     label:"Decay",      color:"#FFCDD2", border:"#E53935" },
  { key:"filled",    label:"Filled",     color:"#BBDEFB", border:"#1E88E5" },
  { key:"crown",     label:"Crown",      color:"#FFF9C4", border:"#F9A825" },
  { key:"missing",   label:"Missing",    color:"#ECEFF1", border:"#B0BEC5" },
  { key:"rootcanal", label:"Root Canal", color:"#F3E5F5", border:"#8E24AA" },
  { key:"implant",   label:"Implant",    color:"#E8F5E9", border:"#2E7D32" },
];

function ToothChartView() {
  const initTeeth = () => {
    const t = {};
    [...TOOTH_UPPER,...TOOTH_LOWER].forEach(n => { t[n]="healthy"; });
    t[16]="crown"; t[36]="decay"; t[11]="filled"; t[47]="rootcanal"; t[18]="missing";
    return t;
  };
  const [teeth, setTeeth] = useState(initTeeth);
  const [activeCond, setActiveCond] = useState("decay");
  const [selTooth, setSelTooth] = useState(null);
  const [notes, setNotes] = useState({ 36:"Early-stage decay detected.", 47:"Root canal completed 2026-03-22." });
  const [patient, setPatient] = useState("Marcus Reed");

  const tap = (num) => { setTeeth(t => ({ ...t, [num]: activeCond })); setSelTooth(num); };
  const reset = (num) => { setTeeth(t => ({ ...t, [num]:"healthy" })); if (selTooth===num) setSelTooth(null); };
  const getC = (num) => CONDS.find(c => c.key===teeth[num]) || CONDS[0];

  const printChart = () => {
    const upper = TOOTH_UPPER.map(n => `<td style="text-align:center;padding:4px;border:1px solid #eee;background:${getC(n).color};font-size:11px;">${n}<br/>${teeth[n]}</td>`).join("");
    const lower = TOOTH_LOWER.map(n => `<td style="text-align:center;padding:4px;border:1px solid #eee;background:${getC(n).color};font-size:11px;">${n}<br/>${teeth[n]}</td>`).join("");
    printContent(`
      <div class="header"><div><h1>${CLINIC.name}</h1><h2>Dental Chart</h2></div><div class="clinic">Patient: ${patient}<br/>Date: 2026-05-16</div></div>
      <p><strong>Upper Jaw</strong></p><table><tr>${upper}</tr></table>
      <p><strong>Lower Jaw</strong></p><table><tr>${lower}</tr></table>
      <p><strong>Notes:</strong> ${Object.entries(notes).map(([k,v])=>`Tooth #${k}: ${v}`).join(" | ")}</p>
    `, "Dental Chart");
  };

  const ToothBox = ({ num, upper }) => {
    const cond = getC(num);
    return (
      <div style={{ position:"relative", width:30, height:36 }}>
        <div onClick={() => tap(num)} style={{ width:30, height:36, borderRadius:upper?"4px 4px 10px 10px":"10px 10px 4px 4px", background:cond.color, border:`2px solid ${selTooth===num?C.navy:cond.border}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:selTooth===num?`0 0 0 3px ${C.navy}44`:"none", transition:"all 0.15s" }}>
          <span style={{ fontSize:8, opacity:0.7, color:cond.border }}>{num}</span>
          {teeth[num]==="missing" && <span style={{ fontSize:9 }}>✕</span>}
          {teeth[num]==="crown" && <span style={{ fontSize:9 }}>♛</span>}
          {teeth[num]==="implant" && <span style={{ fontSize:9 }}>⬟</span>}
        </div>
        <button onClick={e => { e.stopPropagation(); reset(num); }} style={{ position:"absolute", top:-6, right:-6, width:14, height:14, borderRadius:"50%", background:C.danger, color:"#fff", border:"none", fontSize:9, cursor:"pointer", display:selTooth===num?"flex":"none", alignItems:"center", justifyContent:"center", fontWeight:800 }}>×</button>
      </div>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Tooth Chart</h2>
        <Btn small onClick={printChart}>🖨 Print</Btn>
      </div>

      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>Patient:</span>
        <input value={patient} onChange={e => setPatient(e.target.value)} style={{ flex:1, padding:"6px 10px", border:`1.5px solid ${C.soft}`, borderRadius:8, fontSize:13, outline:"none" }} />
      </div>

      {/* Condition picker */}
      <Card style={{ padding:12 }}>
        <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:8 }}>TAP TOOTH THEN SELECT CONDITION</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {CONDS.map(c => (
            <button key={c.key} onClick={() => setActiveCond(c.key)} style={{ padding:"5px 11px", borderRadius:20, border:`2px solid ${c.border}`, background:activeCond===c.key?c.color:"white", fontWeight:700, fontSize:11, cursor:"pointer", color:c.border }}>
              {activeCond===c.key?"✓ ":""}{c.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Chart */}
      <Card style={{ padding:14 }}>
        <div style={{ fontSize:11, color:C.muted, fontWeight:700, textAlign:"center", marginBottom:8 }}>UPPER JAW</div>
        <div style={{ display:"flex", justifyContent:"center", gap:3, flexWrap:"wrap", marginBottom:4 }}>
          {TOOTH_UPPER.map(n => <ToothBox key={n} num={n} upper={true} />)}
        </div>
        <div style={{ textAlign:"center", fontSize:11, color:C.muted, borderTop:`2px dashed ${C.soft}`, borderBottom:`2px dashed ${C.soft}`, padding:"5px 0", margin:"6px 0" }}>── midline ──</div>
        <div style={{ display:"flex", justifyContent:"center", gap:3, flexWrap:"wrap", marginTop:4 }}>
          {TOOTH_LOWER.map(n => <ToothBox key={n} num={n} upper={false} />)}
        </div>
        <div style={{ fontSize:11, color:C.muted, fontWeight:700, textAlign:"center", marginTop:8 }}>LOWER JAW</div>
      </Card>

      {/* Legend */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {CONDS.map(c => <div key={c.key} style={{ display:"flex", alignItems:"center", gap:4, fontSize:11, color:C.text }}><div style={{ width:12, height:12, borderRadius:3, background:c.color, border:`1.5px solid ${c.border}` }}/>{c.label}</div>)}
      </div>

      {/* Selected tooth notes */}
      {selTooth && (
        <Card style={{ padding:14 }}>
          <div style={{ fontWeight:800, fontSize:14, color:C.navy, marginBottom:8 }}>
            Tooth #{selTooth} — {CONDS.find(c=>c.key===teeth[selTooth])?.label}
            <button onClick={() => { reset(selTooth); }} style={{ marginLeft:10, background:C.danger+"18", color:C.danger, border:"none", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑 Reset to Healthy</button>
          </div>
          <textarea value={notes[selTooth]||""} onChange={e => setNotes(n=>({...n,[selTooth]:e.target.value}))} placeholder="Add clinical note for this tooth..." rows={2}
            style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.soft}`, borderRadius:10, fontSize:13, resize:"none", boxSizing:"border-box", outline:"none" }} />
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <Btn small color={C.teal}>Save Note</Btn>
            <Btn small light color={C.muted} onClick={() => setNotes(n=>({...n,[selTooth]:""}))}>Clear Note</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ setView }) {
  const [appts, setAppts] = useState(INIT_APPOINTMENTS);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ patient:"", time:"", type:"", doctor:DOCTORS[0].name, room:"Room 1", status:"upcoming" });
  const [confirmDel, setConfirmDel] = useState(null);

  const startEdit = (a) => { setEditId(a.id); setEditForm({ ...a }); };
  const saveEdit = () => { setAppts(list => list.map(a => a.id===editId ? { ...editForm } : a)); setEditId(null); };
  const deleteAppt = (id) => { setAppts(list => list.filter(a => a.id!==id)); setConfirmDel(null); };
  const addAppt = () => {
    if (!addForm.patient||!addForm.time||!addForm.type) return;
    setAppts(list => [...list, { id:Date.now(), ...addForm }]);
    setShowAdd(false);
    setAddForm({ patient:"", time:"", type:"", doctor:DOCTORS[0].name, room:"Room 1", status:"upcoming" });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Sri Sai Speciality Dental Care 🦷</h2>
        <p style={{ color:C.teal, margin:"2px 0 0", fontSize:12, fontStyle:"italic" }}>"Beauty is power and smile its sword"</p>
        <p style={{ color:C.muted, margin:"2px 0 0", fontSize:12 }}>Friday, May 16, 2026 · {appts.length} appointments today</p>
      </div>

      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        {[["📅","Today's Appts",appts.length,C.teal],["💰","Revenue","₹8,000",C.green],["⏳","Pending Bills","₹39,000",C.danger],["⭐","Rating","4.9",C.accent]].map(([ic,l,v,col]) => (
          <div key={l} style={{ flex:1, minWidth:110, background:C.card, borderRadius:14, padding:12, boxShadow:"0 2px 10px rgba(26,60,94,0.07)", display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:38, height:38, borderRadius:10, background:col+"18", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{ic}</div>
            <div><div style={{ fontSize:17, fontWeight:800, color:col }}>{v}</div><div style={{ fontSize:10, color:C.muted }}>{l}</div></div>
          </div>
        ))}
      </div>

      {/* Today's Schedule — editable */}
      <Card style={{ padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontWeight:800, fontSize:14, color:C.navy }}>Today's Schedule</div>
          <Btn small onClick={() => setShowAdd(!showAdd)}>+ Add</Btn>
        </div>

        {/* Add form */}
        {showAdd && (
          <div style={{ background:C.soft, borderRadius:12, padding:14, marginBottom:12 }}>
            <div style={{ fontWeight:700, fontSize:13, color:C.navy, marginBottom:10 }}>New Appointment</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              {[["Patient Name","patient","text"],["Time (e.g. 14:00)","time","text"],["Treatment","type","text"],["Room","room","text"]].map(([ph,field,type]) => (
                <input key={field} value={addForm[field]} onChange={e => setAddForm(f=>({...f,[field]:e.target.value}))} placeholder={ph} type={type}
                  style={{ padding:"7px 10px", border:`1.5px solid ${C.soft}`, borderRadius:8, fontSize:12, outline:"none", background:"white" }} />
              ))}
            </div>
            <select value={addForm.doctor} onChange={e => setAddForm(f=>({...f,doctor:e.target.value}))}
              style={{ width:"100%", padding:"7px 10px", border:`1.5px solid ${C.soft}`, borderRadius:8, fontSize:12, outline:"none", marginBottom:8 }}>
              {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
            </select>
            <div style={{ display:"flex", gap:8 }}>
              <Btn small style={{ flex:1 }} onClick={addAppt}>Add Appointment</Btn>
              <Btn small light color={C.muted} style={{ flex:1 }} onClick={() => setShowAdd(false)}>Cancel</Btn>
            </div>
          </div>
        )}

        {appts.length === 0 && <div style={{ textAlign:"center", color:C.muted, padding:"20px 0", fontSize:13 }}>No appointments today. Tap + Add to create one.</div>}

        {appts.map(a => (
          <div key={a.id}>
            {editId === a.id ? (
              /* Edit form inline */
              <div style={{ background:C.accent+"18", borderRadius:12, padding:12, marginBottom:8 }}>
                <div style={{ fontWeight:700, fontSize:12, color:C.navy, marginBottom:8 }}>Edit Appointment</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:6 }}>
                  {[["Patient","patient"],["Time","time"],["Treatment","type"],["Room","room"]].map(([ph,field]) => (
                    <input key={field} value={editForm[field]||""} onChange={e => setEditForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}
                      style={{ padding:"6px 9px", border:`1.5px solid ${C.soft}`, borderRadius:8, fontSize:12, outline:"none" }} />
                  ))}
                </div>
                <select value={editForm.doctor} onChange={e => setEditForm(f=>({...f,doctor:e.target.value}))}
                  style={{ width:"100%", padding:"6px 9px", border:`1.5px solid ${C.soft}`, borderRadius:8, fontSize:12, outline:"none", marginBottom:6 }}>
                  {DOCTORS.map(d => <option key={d.id}>{d.name}</option>)}
                </select>
                <select value={editForm.status} onChange={e => setEditForm(f=>({...f,status:e.target.value}))}
                  style={{ width:"100%", padding:"6px 9px", border:`1.5px solid ${C.soft}`, borderRadius:8, fontSize:12, outline:"none", marginBottom:8 }}>
                  {["upcoming","in-progress","confirmed","checked-in","pending"].map(s => <option key={s}>{s}</option>)}
                </select>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn small color={C.green} style={{ flex:1 }} onClick={saveEdit}>✓ Save</Btn>
                  <Btn small light color={C.muted} style={{ flex:1 }} onClick={() => setEditId(null)}>Cancel</Btn>
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:10, background:C.soft, marginBottom:8 }}>
                <span style={{ minWidth:46, fontWeight:800, color:C.teal, fontSize:13 }}>{a.time}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{a.patient}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{a.type} · {a.doctor}</div>
                </div>
                <Badge status={a.status} />
                {/* Edit & Delete */}
                <div style={{ display:"flex", gap:4 }}>
                  <button onClick={() => startEdit(a)} style={{ background:C.navy+"15", color:C.navy, border:"none", borderRadius:8, padding:"4px 8px", fontSize:11, fontWeight:700, cursor:"pointer" }}>✏️</button>
                  <button onClick={() => setConfirmDel(a.id)} style={{ background:C.danger+"18", color:C.danger, border:"none", borderRadius:8, padding:"4px 8px", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑</button>
                </div>
              </div>
            )}
            {/* Delete confirm */}
            {confirmDel === a.id && (
              <div style={{ background:"#FEECEC", borderRadius:10, padding:"10px 14px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:C.danger, fontWeight:600 }}>Remove {a.patient}'s appointment?</span>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn small color={C.danger} onClick={() => deleteAppt(a.id)}>Remove</Btn>
                  <Btn small light color={C.muted} onClick={() => setConfirmDel(null)}>Cancel</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {[["📅 Book Appt","booking",C.teal],["💰 Payments","payments",C.green],["🦷 Tooth Chart","chart",C.navy],["🤖 AI Help","ai",C.purple]].map(([l,v,col]) => (
          <button key={v} onClick={() => setView(v)} style={{ padding:"14px", background:col+"12", border:`1.5px solid ${col}22`, borderRadius:14, cursor:"pointer", textAlign:"center", fontWeight:700, fontSize:13, color:col }}>{l}</button>
        ))}
      </div>

      <Btn full color="#25D366" onClick={() => window.open(WA("Hi Sri Sai Speciality Dental Care! I'd like to get information about dental treatments."), "_blank")}>
        <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><WAIcon size={16}/> Chat with Clinic on WhatsApp</span>
      </Btn>
    </div>
  );
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────
function AIView() {
  const [msgs, setMsgs] = useState([{ role:"assistant", content:"Namaste! I'm the AI assistant for Sri Sai Speciality Dental Care. I can help with appointments, treatments, doctor info, or dental health questions. How can I help?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const QUICK = ["Who's available today?","Tell me about dental implants","What does a root canal cost?","Book an appointment for me"];

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMsgs(m => [...m, { role:"user", content:msg }]);
    setLoading(true);
    try {
      const history = [...msgs, { role:"user", content:msg }];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`You are the AI assistant for Sri Sai Speciality Dental Care, Hyderabad. Doctors: Dr. T. Venkat Rao (Senior Dental Surgeon, 35 years, BDS MRSH FAGE — implants, root canals, oral surgery) and Dr. T. Sai Vakula (Maxillofacial Surgeon & Implantologist, 11 years, BDS MDS OMFS — jaw surgery, implants, wisdom teeth). Address: H.No 8-5-255/10/1, TKR College Road. Phone: 8688033072. Timings: 10AM-1:30PM, 5:30PM-9:30PM. Services: implants, root canals, zirconium crowns, jaw surgery, smile makeover, dentures, whitening, scaling. Prices in ₹. Be concise, helpful, and friendly.`,
          messages: history.map(m => ({ role:m.role, content:m.content }))
        })
      });
      const data = await res.json();
      setMsgs(m => [...m, { role:"assistant", content:data.content?.[0]?.text || "Sorry, please try again." }]);
    } catch { setMsgs(m => [...m, { role:"assistant", content:"Connection error. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12, height:"calc(100vh - 180px)", maxHeight:580 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>AI Assistant</h2>
        <div style={{ background:C.green+"22", color:C.green, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>● Online</div>
      </div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {QUICK.map(q => <button key={q} onClick={() => send(q)} style={{ fontSize:11, padding:"5px 11px", border:`1.5px solid ${C.teal}`, borderRadius:20, background:C.soft, color:C.teal, cursor:"pointer", fontWeight:600 }}>{q}</button>)}
      </div>
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10 }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant" && <div style={{ width:30, height:30, borderRadius:"50%", background:C.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, marginRight:8, flexShrink:0, alignSelf:"flex-end" }}>🦷</div>}
            <div style={{ maxWidth:"75%", padding:"10px 14px", borderRadius:m.role==="user"?"16px 4px 16px 16px":"4px 16px 16px 16px", background:m.role==="user"?C.navy:C.soft, color:m.role==="user"?"#fff":C.text, fontSize:13, lineHeight:1.6 }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display:"flex", alignItems:"center", gap:8 }}><div style={{ width:30, height:30, borderRadius:"50%", background:C.teal, display:"flex", alignItems:"center", justifyContent:"center" }}>🦷</div><div style={{ background:C.soft, borderRadius:"4px 16px 16px 16px", padding:"10px 16px" }}><span style={{ fontSize:18, color:C.teal }}>•••</span></div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder="Ask anything about the clinic..."
          style={{ flex:1, padding:"11px 14px", border:`2px solid ${C.soft}`, borderRadius:12, fontSize:13, outline:"none" }} />
        <button onClick={() => send()} disabled={loading||!input.trim()}
          style={{ padding:"11px 16px", background:loading||!input.trim()?C.muted:C.teal, color:"#fff", border:"none", borderRadius:12, fontWeight:800, fontSize:16, cursor:loading||!input.trim()?"default":"pointer" }}>↑</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function DentalApp() {
  const [splash, setSplash] = useState(true);
  const [splashStep, setSplashStep] = useState(0);
  const [view, setView] = useState("dashboard");
  const [showMore, setShowMore] = useState(false);
  const [patientUser, setPatientUser] = useState(null);
  const [showPatientPortal, setShowPatientPortal] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashStep(1), 400);
    const t2 = setTimeout(() => setSplashStep(2), 1200);
    const t3 = setTimeout(() => setSplashStep(3), 2000);
    const t4 = setTimeout(() => setSplash(false), 3200);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  if (splash) return (
    <div style={{ minHeight:"100vh", background:C.navy, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Georgia, serif" }}>
      <div style={{ opacity:splashStep>=1?1:0, transform:splashStep>=1?"scale(1)":"scale(0.5)", transition:"all 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <ClinicLogo size={100} />
      </div>
      <div style={{ opacity:splashStep>=2?1:0, transform:splashStep>=2?"translateY(0)":"translateY(20px)", transition:"all 0.5s ease", textAlign:"center", marginTop:24 }}>
        <div style={{ color:"#fff", fontWeight:800, fontSize:24 }}>Sri Sai Speciality</div>
        <div style={{ color:"#5BB8D4", fontWeight:700, fontSize:17, marginTop:4 }}>Dental Care (T V Rao)</div>
        <div style={{ color:"#8A9BB0", fontSize:12, marginTop:6 }}>Hyderabad</div>
      </div>
      <div style={{ opacity:splashStep>=3?1:0, transition:"opacity 0.5s ease", textAlign:"center", marginTop:28 }}>
        <div style={{ color:"#5BB8D4", fontSize:13, fontStyle:"italic", marginBottom:20 }}>"Beauty is power and smile its sword"</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          {[0,1,2].map(i => <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:"#5BB8D4", opacity:0.4+i*0.3 }} />)}
        </div>
      </div>
      <div style={{ position:"absolute", bottom:40, opacity:splashStep>=3?1:0, transition:"opacity 0.5s ease", textAlign:"center" }}>
        <div style={{ color:"#8A9BB0", fontSize:11 }}>Dr. T. Venkat Rao · Dr. T. Sai Vakula</div>
        <div style={{ color:"#5BB8D4", fontSize:11, marginTop:4 }}>📞 {CLINIC.phone}</div>
      </div>
    </div>
  );

  // Patient Portal
  if (showPatientPortal) {
    if (!patientUser) return (
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"Georgia, serif" }}>
        <div style={{ background:C.navy, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}><ClinicLogo size={32}/><span style={{ color:"#fff", fontWeight:800, fontSize:13 }}>Patient Portal</span></div>
          <button onClick={() => setShowPatientPortal(false)} style={{ color:"#5BB8D4", background:"none", border:"none", fontWeight:700, fontSize:13, cursor:"pointer" }}>← Back</button>
        </div>
        <div style={{ padding:"20px 16px 80px", maxWidth:500, margin:"0 auto" }}>
          <PatientLoginView onLogin={u => setPatientUser(u)} />
        </div>
      </div>
    );
    return (
      <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"Georgia, serif" }}>
        <div style={{ background:C.navy, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}><ClinicLogo size={32}/><span style={{ color:"#fff", fontWeight:800, fontSize:13 }}>Patient Portal</span></div>
          <button onClick={() => setShowPatientPortal(false)} style={{ color:"#5BB8D4", background:"none", border:"none", fontWeight:700, fontSize:13, cursor:"pointer" }}>← Clinic</button>
        </div>
        <div style={{ padding:"20px 16px 80px", maxWidth:500, margin:"0 auto" }}>
          <PatientDashboard patient={patientUser} onLogout={() => setPatientUser(null)} setMainView={setView} />
        </div>
      </div>
    );
  }

  const mainNav = [
    { id:"dashboard", label:"Home",    icon:"🏠" },
    { id:"booking",   label:"Book",    icon:"📅" },
    { id:"chart",     label:"Chart",   icon:"🦷" },
    { id:"payments",  label:"Pay",     icon:"💳" },
    { id:"ai",        label:"AI",      icon:"🤖" },
  ];
  const moreNav = [
    { id:"gallery",  label:"Gallery",  icon:"🖼" },
    { id:"rx",       label:"Rx",       icon:"💊" },
    { id:"reports",  label:"Reports",  icon:"📷" },
    { id:"about",    label:"About",    icon:"🏥" },
    { id:"doctors",  label:"Doctors",  icon:"👨‍⚕️" },
  ];

  const AboutView = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>About Us</h2>
      <Card style={{ padding:16 }}>
        {[["📍","Address",CLINIC.address],["📞","Phone",CLINIC.phone],["🕐","Morning","10:00 AM – 1:30 PM"],["🕔","Evening","5:30 PM – 9:30 PM"]].map(([ic,l,v]) => (
          <div key={l} style={{ display:"flex", gap:12, marginBottom:12 }}>
            <span style={{ fontSize:18, minWidth:24 }}>{ic}</span>
            <div><div style={{ fontSize:11, color:C.muted, fontWeight:700 }}>{l}</div><div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{v}</div></div>
          </div>
        ))}
      </Card>
    </div>
  );

  const DoctorsView = () => (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Our Doctors</h2>
      {DOCTORS.map(d => (
        <Card key={d.id} style={{ padding:18 }}>
          <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:d.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>{d.initials}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:C.navy }}>{d.name}</div>
              <div style={{ fontSize:13, color:d.color, fontWeight:600 }}>{d.role}</div>
              <div style={{ fontSize:11, color:C.muted }}>{d.qual} · {d.exp}</div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                {d.specialties.map(s => <span key={s} style={{ border:`1px solid ${d.color}`, color:d.color, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>{s}</span>)}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ReportsView = () => {
    const [reports, setReports] = useState([
      { id:1, name:"OPG_RaviKumar.jpg",   patient:"Ravi Kumar",   type:"X-Ray",    date:"2026-05-16", size:"1.2 MB", icon:"🦷" },
      { id:2, name:"CBCT_Suresh.pdf",     patient:"Suresh Reddy", type:"CBCT Scan", date:"2026-05-10", size:"4.8 MB", icon:"📡" },
    ]);
    const [confirmDelR, setConfirmDelR] = useState(null);
    const fileRef2 = useRef(null);
    const handleUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setReports(r => [{ id:Date.now(), name:file.name, patient:"New Upload", type:"Other", date:"2026-05-16", size:(file.size/1024/1024).toFixed(1)+" MB", icon:"📄" }, ...r]);
    };
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.navy, margin:0 }}>Dental Reports</h2>
        <button onClick={() => fileRef2.current?.click()} style={{ width:"100%", padding:"20px", border:`2px dashed ${C.teal}`, borderRadius:14, background:C.soft, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:32 }}>📷</span>
          <span style={{ fontSize:14, color:C.teal, fontWeight:800 }}>Upload Report</span>
          <span style={{ fontSize:11, color:C.muted }}>Photo, X-ray or PDF</span>
        </button>
        <input ref={fileRef2} type="file" accept="image/*,.pdf" style={{ display:"none" }} onChange={handleUpload} />
        {reports.map(r => (
          <div key={r.id}>
            <Card style={{ padding:14 }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ fontSize:28 }}>{r.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{r.name}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{r.patient} · {r.date} · {r.size}</div>
                </div>
                <Btn small>View</Btn>
                <button onClick={() => setConfirmDelR(r.id)} style={{ background:C.danger+"18", color:C.danger, border:"none", borderRadius:8, padding:"5px 8px", fontSize:11, fontWeight:700, cursor:"pointer" }}>🗑</button>
              </div>
            </Card>
            {confirmDelR === r.id && (
              <div style={{ background:"#FEECEC", borderRadius:10, padding:"10px 14px", marginTop:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:C.danger, fontWeight:600 }}>Remove this report?</span>
                <div style={{ display:"flex", gap:6 }}>
                  <Btn small color={C.danger} onClick={() => { setReports(rr => rr.filter(x=>x.id!==r.id)); setConfirmDelR(null); }}>Remove</Btn>
                  <Btn small light color={C.muted} onClick={() => setConfirmDelR(null)}>Cancel</Btn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const views = {
    dashboard: <DashboardView setView={setView} />,
    booking:   <PatientBookingView patient={null} />,
    chart:     <ToothChartView />,
    gallery:   <GalleryView />,
    payments:  <PaymentsView />,
    ai:        <AIView />,
    rx:        <PrescriptionsView />,
    reports:   <ReportsView />,
    about:     <AboutView />,
    doctors:   <DoctorsView />,
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"Georgia, serif", display:"flex", flexDirection:"column" }}>
      <header style={{ background:C.navy, padding:"0 14px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, boxShadow:"0 2px 12px rgba(0,0,0,0.15)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <ClinicLogo size={40} />
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:12, letterSpacing:0.3 }}>Sri Sai Speciality Dental</div>
            <div style={{ color:"#5BB8D4", fontSize:9, fontWeight:700 }}>T V Rao · Hyderabad</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <button onClick={() => setShowPatientPortal(true)}
            style={{ background:C.teal, color:"#fff", border:"none", borderRadius:20, padding:"6px 12px", fontWeight:700, fontSize:11, cursor:"pointer" }}>
            👤 {patientUser ? patientUser.name.split(" ")[0] : "Login"}
          </button>
          <a href={WA("Hi! I'd like to book an appointment at Sri Sai Speciality Dental Care.")} target="_blank" rel="noopener noreferrer"
            style={{ display:"flex", alignItems:"center", gap:4, background:"#25D366", borderRadius:20, padding:"6px 10px", textDecoration:"none" }}>
            <WAIcon size={13}/><span style={{ color:"#fff", fontWeight:700, fontSize:11 }}>Chat</span>
          </a>
        </div>
      </header>

      <main style={{ flex:1, padding:"20px 16px 100px", maxWidth:640, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>
        {views[view] || <DashboardView setView={setView} />}
      </main>

      {/* Floating WhatsApp */}
      <a href={WA("Hi! I'd like to book an appointment at Sri Sai Speciality Dental Care.")} target="_blank" rel="noopener noreferrer"
        style={{ position:"fixed", bottom:90, right:16, width:52, height:52, borderRadius:"50%", background:"#25D366", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(37,211,102,0.5)", zIndex:200, textDecoration:"none" }}>
        <WAIcon size={26} />
      </a>

      <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:C.card, borderTop:"1px solid #E8EEF4", boxShadow:"0 -4px 20px rgba(26,60,94,0.08)", zIndex:100 }}>
        {showMore && (
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.soft}`, display:"flex", flexWrap:"wrap", gap:8 }}>
            {moreNav.map(item => (
              <button key={item.id} onClick={() => { setView(item.id); setShowMore(false); }}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", background:view===item.id?C.teal:C.soft, border:"none", borderRadius:20, cursor:"pointer" }}>
                <span style={{ fontSize:16 }}>{item.icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color:view===item.id?"#fff":C.navy }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-around", padding:"8px 0 12px" }}>
          {mainNav.map(item => (
            <button key={item.id} onClick={() => { setView(item.id); setShowMore(false); }}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 8px" }}>
              <span style={{ fontSize:20, filter:view===item.id?"none":"grayscale(60%)", opacity:view===item.id?1:0.5 }}>{item.icon}</span>
              <span style={{ fontSize:10, fontWeight:700, color:view===item.id?C.teal:C.muted }}>{item.label}</span>
            </button>
          ))}
          <button onClick={() => setShowMore(s => !s)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", cursor:"pointer", padding:"4px 8px" }}>
            <span style={{ fontSize:20, opacity:showMore?1:0.5 }}>⋯</span>
            <span style={{ fontSize:10, fontWeight:700, color:showMore?C.teal:C.muted }}>More</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
