import { useState } from "react";
import { USERS } from "../data/mockData.js";

const ROLE_META = {
  patient: { icon: "🧑‍🦱", label: "Patient", color: "#00d4aa" },
  doctor: { icon: "👨‍⚕️", label: "Doctor", color: "#a29bfe" },
  nurse: { icon: "👩‍⚕️", label: "Nurse", color: "#ffb347" },
  pharmacy: { icon: "💊", label: "Pharmacy", color: "#ffb347" },
  lab: { icon: "🧪", label: "Laboratory", color: "#a29bfe" },
  admin: { icon: "💳", label: "Admin", color: "#2ed573" },
};

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const change = e => {
    setError("");
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.username,   // 👈 mapping username → email
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const ROLE_MAP = {
        admin: "admin",
        doctor: "doctor",
        nurse: "nurse",
        pharmacy: "pharmacy",
        lab: "lab",
        patient: "patient",
      
      };

      onLogin({
        ...data,
        role: ROLE_MAP[data.role]
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, fontSize: 13,
    background: "rgba(4,13,30,0.7)", border: "1px solid rgba(0,212,170,0.15)",
    color: "#e8f4f0", outline: "none", fontFamily: "'DM Sans',sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#040d1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      {/* bg */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,170,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,170,0.025) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,212,170,0.07) 0%,transparent 70%)", top: -150, right: -80, pointerEvents: "none" }} />
      <div style={{ position: "fixed", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,80,200,0.06) 0%,transparent 70%)", bottom: 60, left: -80, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480, padding: "0 20px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#00d4aa,#00e5ff)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
              <polyline points="2,10 5,10 7,4 9,16 11,8 13,12 15,10 18,10" stroke="#040d1e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: "#e8f4f0", letterSpacing: "-0.5px" }}>
            Pulse<span style={{ color: "#00d4aa" }}>Net</span>
          </div>
          <div style={{ fontSize: 11, color: "#4a6a62", letterSpacing: "2px", textTransform: "uppercase", marginTop: 4 }}>
            Hospital Monitoring System
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(7,20,40,0.92)", border: "1px solid rgba(0,212,170,0.15)", borderRadius: 20, padding: "28px 28px 24px", backdropFilter: "blur(20px)" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, color: "#e8f4f0", textAlign: "center", marginBottom: 4 }}>Sign In</div>
          <div style={{ fontSize: 12, color: "#4a6a62", textAlign: "center", marginBottom: 22 }}>Choose your role and sign in</div>

          <form onSubmit={submit}>
            {/* Username */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: "#4a6a62", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Username</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#4a6a62" strokeWidth="1.5"><circle cx="8" cy="6" r="2.5" /><path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" /></svg>
                </div>
                <input name="username" value={form.username} onChange={change} placeholder="e.g. nurse.kavita" autoComplete="username" required style={inp}
                  onFocus={e => e.target.style.borderColor = "rgba(0,212,170,0.45)"}
                  onBlur={e => e.target.style.borderColor = "rgba(0,212,170,0.15)"}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, color: "#4a6a62", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 5 }}>Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#4a6a62" strokeWidth="1.5"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 016 0v2" /></svg>
                </div>
                <input name="password" value={form.password} onChange={change} type={showPass ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" required
                  style={{ ...inp, paddingRight: 40 }}
                  onFocus={e => e.target.style.borderColor = "rgba(0,212,170,0.45)"}
                  onBlur={e => e.target.style.borderColor = "rgba(0,212,170,0.15)"}
                />
                <div onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#4a6a62" }}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" />
                    <circle cx="8" cy="8" r="1.5" />
                    {showPass && <line x1="3" y1="3" x2="13" y2="13" />}
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, marginBottom: 14, background: "rgba(255,71,87,0.08)", border: "1px solid rgba(255,71,87,0.22)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4757", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#ff4757" }}>{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700, background: loading ? "rgba(0,212,170,0.35)" : "linear-gradient(135deg,#00d4aa,#00b894)", color: "#040d1e", border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Syne',sans-serif" }}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 10, color: "#4a6a62", textAlign: "center", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>
              Demo Accounts · click to fill
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {USERS.map(u => {
                const m = ROLE_META[u.role];
                if (!m) return null;
                return (
                  <div key={u.username}
                    onClick={() => { setForm({ username: u.username, password: u.password }); setError(""); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 10, background: "rgba(0,212,170,0.03)", border: `1px solid ${m.color}20`, cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = `${m.color}0d`}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(0,212,170,0.03)"}
                  >
                    <span style={{ fontSize: 16 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: m.color }}>{m.label}</div>
                      <div style={{ fontSize: 10, color: "#4a6a62" }}>{u.username}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: "#4a6a62" }}>
          PulseNet Hospital Monitoring System · v1.0
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
      `}</style>
    </div>
  );
}