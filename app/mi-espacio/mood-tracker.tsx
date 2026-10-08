"use client";

import { useEffect, useMemo, useState } from "react";
import "./mood-tracker.css";

type MoodEntry = { date: string; rating: number; energy: number };
const STORAGE_KEY = "wellness_mood_checkins_v1";
const MOODS = [
  { rating: 1, name: "Muy difícil", note: "Hoy pesa un poquito más", color: "#c8dcf4" },
  { rating: 2, name: "Difícil", note: "Hay días que cuestan", color: "#e5cae8" },
  { rating: 3, name: "Intermedio", note: "Un día con matices", color: "#f5dfb7" },
  { rating: 4, name: "Agradable", note: "Hay espacio para respirar", color: "#caebde" },
  { rating: 5, name: "Muy agradable", note: "Hoy te sientes bien", color: "#b5e3db" },
];
const ENERGY = ["Baja", "Media", "Alta"];

function keyForDate(day: Date) {
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
}
function dayOffset(offset: number) {
  const day = new Date();
  day.setHours(12, 0, 0, 0);
  day.setDate(day.getDate() + offset);
  return day;
}
function MoodFriend({ mood }: { mood: number }) {
  const low = mood <= 2;
  const smile = mood >= 4;
  const delighted = mood === 5;
  return (
    <svg className="mood-friend-svg" viewBox="0 0 270 260" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="friend-body" cx="34%" cy="20%" r="85%">
          <stop offset="0%" stopColor="#fffdfa" />
          <stop offset="47%" stopColor="#f5dfd3" />
          <stop offset="100%" stopColor="#d69cb1" />
        </radialGradient>
        <radialGradient id="friend-ear" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fbe0e4" />
          <stop offset="100%" stopColor="#cb859a" />
        </radialGradient>
        <radialGradient id="friend-blush">
          <stop offset="0%" stopColor="#ec9e9f" stopOpacity=".65"/>
          <stop offset="100%" stopColor="#ec9e9f" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="friend-highlight" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".85"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <ellipse cx="135" cy="241" rx="82" ry="11" fill="#183d58" opacity=".10"/>
      <path d="M72 75 C41 39 42 22 54 16 C75 9 101 50 104 75Z" fill="url(#friend-body)" stroke="#d7b0b9" strokeWidth="2"/>
      <path d="M198 75 C229 39 228 22 216 16 C195 9 169 50 166 75Z" fill="url(#friend-body)" stroke="#d7b0b9" strokeWidth="2"/>
      <path d="M80 66 C58 41 57 30 64 28 C78 25 93 54 92 69Z" fill="url(#friend-ear)"/>
      <path d="M190 66 C212 41 213 30 206 28 C192 25 177 54 178 69Z" fill="url(#friend-ear)"/>
      <path d="M47 143 C43 78 82 51 135 51 C188 51 228 78 223 143 C220 205 188 237 135 237 C82 237 50 205 47 143Z" fill="url(#friend-body)" stroke="#d8b4b9" strokeWidth="1.6"/>
      <ellipse cx="96" cy="94" rx="38" ry="16" fill="url(#friend-highlight)" opacity=".75" transform="rotate(-22 96 94)"/>
      <ellipse cx="79" cy="169" rx="29" ry="25" fill="url(#friend-blush)"/>
      <ellipse cx="191" cy="169" rx="29" ry="25" fill="url(#friend-blush)"/>
      <path d="M130 53 C112 39 128 27 144 41 C155 30 168 43 154 56" fill="#e9c1be" stroke="#d6a6b1" strokeWidth="1.3"/>
      {delighted ? (
        <>
          <path d="M88 141 Q103 126 118 141" fill="none" stroke="#503e53" strokeWidth="5.2" strokeLinecap="round"/>
          <path d="M152 141 Q167 126 182 141" fill="none" stroke="#503e53" strokeWidth="5.2" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <ellipse cx="104" cy="145" rx="10" ry={low ? 13 : 15} fill="#49384d"/>
          <ellipse cx="167" cy="145" rx="10" ry={low ? 13 : 15} fill="#49384d"/>
          <ellipse cx="100" cy="140" rx="4" ry="5" fill="#fff" opacity=".95"/>
          <ellipse cx="163" cy="140" rx="4" ry="5" fill="#fff" opacity=".95"/>
        </>
      )}
      {low ? (
        <>
          <path d="M91 119 Q103 115 114 120" fill="none" stroke="#8d687a" strokeWidth="3.4" strokeLinecap="round"/>
          <path d="M155 120 Q167 115 179 119" fill="none" stroke="#8d687a" strokeWidth="3.4" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <path d="M92 122 Q105 115 116 124" fill="none" stroke="#8d687a" strokeWidth="3.2" strokeLinecap="round"/>
          <path d="M154 124 Q166 115 179 122" fill="none" stroke="#8d687a" strokeWidth="3.2" strokeLinecap="round"/>
        </>
      )}
      <path d="M130 159 Q135 164 140 159" fill="none" stroke="#a07981" strokeWidth="2.3" strokeLinecap="round"/>
      {mood === 1 && <path d="M118 194 Q135 177 152 194" fill="none" stroke="#824f69" strokeWidth="4" strokeLinecap="round"/>}
      {mood === 2 && <path d="M119 189 Q135 181 151 189" fill="none" stroke="#824f69" strokeWidth="4" strokeLinecap="round"/>}
      {mood === 3 && <path d="M120 187 Q135 188 150 187" fill="none" stroke="#824f69" strokeWidth="4" strokeLinecap="round"/>}
      {smile && <path d={delighted ? "M105 176 Q135 218 165 176" : "M114 179 Q135 202 156 179"} fill={delighted ? "#a45b78" : "none"} stroke="#824f69" strokeWidth="4.5" strokeLinecap="round"/>}
      {delighted && <path d="M118 196 Q135 202 151 196" fill="none" stroke="#f6c7c9" strokeWidth="3"/>}
      {mood === 1 && <path d="M184 156 Q196 171 188 182 Q179 175 184 156" fill="#b4dce8" stroke="#84bdcc" strokeWidth="1.1"/>}
      <path d="M85 215 Q72 229 68 218 M185 215 Q198 229 202 218" stroke="#d6a6b1" strokeWidth="8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export default function MoodTracker() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [energy, setEnergy] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const today = keyForDate(new Date());

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const valid = Array.isArray(raw) ? raw.filter((entry): entry is MoodEntry =>
        typeof entry?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
        Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5 &&
        Number.isInteger(entry.energy) && entry.energy >= 0 && entry.energy <= 2
      ).slice(-90) : [];
      setEntries(valid);
      const current = valid.find(entry => entry.date === keyForDate(new Date()));
      if (current) { setSelected(current.rating); setEnergy(current.energy); }
    } catch { setEntries([]); }
    setLoaded(true);
  }, []);

  const displayed = MOODS[(selected || 3) - 1];
  const pastDays = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const date = dayOffset(i - 6);
    const key = keyForDate(date);
    return { key, label: new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(date), entry: entries.find(e => e.date === key) };
  }), [entries]);

  function save() {
    if (selected === null || !loaded) return;
    const newEntries = [...entries.filter(entry => entry.date !== today), { date: today, rating: selected, energy }]
      .sort((a, b) => a.date.localeCompare(b.date)).slice(-90);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
      setEntries(newEntries);
      setMessage("Registro guardado en este dispositivo. Puedes actualizarlo hoy si cambia cómo te sientes.");
    } catch {
      setMessage("Este navegador no permite guardar el registro. No se ha conservado.");
    }
  }
  function clear() {
    if (!window.confirm("¿Borrar todos tus registros de ánimo guardados en este dispositivo?")) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* almacenamiento bloqueado */ }
    setEntries([]);
    setSelected(null);
    setEnergy(1);
    setMessage("Has borrado el historial de este dispositivo.");
  }

  return (
    <section className="mood-tracker" aria-labelledby="mood-tracker-title">
      <div className="mood-tracker-heading">
        <div>
          <p className="space-eyebrow">Tu momento</p>
          <h3 id="mood-tracker-title">¿Cómo te sientes hoy?</h3>
          <p>No hay una respuesta correcta. Puedes sentir varias cosas a la vez; elige la opción que mejor resuma este momento.</p>
        </div>
        <span className="mood-tracker-private">Personal · Solo en este dispositivo</span>
      </div>
      <div className="mood-tracker-body">
        <div className="mood-friend-panel" style={{ background: `radial-gradient(circle at 50% 30%, #ffffff 0%, ${displayed.color} 100%)` }}>
          <div className="mood-friend-halo" aria-hidden="true"/>
          <MoodFriend mood={selected || 3} />
          <div className="mood-friend-caption" aria-live="polite">
            <strong>{selected ? displayed.name : "Aquí estoy contigo"}</strong>
            <span>{selected ? displayed.note : "Cada emoción tiene su lugar."}</span>
          </div>
        </div>
        <div className="mood-tracker-inputs">
          <p className="mood-tracker-question">Elige cómo te encuentras</p>
          <div className="mood-options" role="group" aria-label="Estado de ánimo">
            {MOODS.map(mood => (
              <button key={mood.rating} type="button" className={selected === mood.rating ? "mood-option is-selected" : "mood-option"}
                aria-pressed={selected === mood.rating} onClick={() => { setSelected(mood.rating); setMessage(""); }}>
                <span className="mood-option-dot" style={{ backgroundColor: mood.color }} aria-hidden="true" />
                <span>{mood.name}</span>
              </button>
            ))}
          </div>
          <div className="mood-energy">
            <p className="mood-tracker-question">¿Y tu nivel de energía?</p>
            <div role="group" aria-label="Nivel de energía" className="mood-energy-options">
              {ENERGY.map((item, index) => (
                <button key={item} type="button" aria-pressed={energy === index} className={energy === index ? "is-selected" : ""} onClick={() => setEnergy(index)}>{item}</button>
              ))}
            </div>
          </div>
          <button className="mood-save" type="button" disabled={!loaded || selected === null} onClick={save}>
            Guardar mi momento <span aria-hidden="true">→</span>
          </button>
          <span className="mood-status" role="status" aria-live="polite">{message}</span>
        </div>
      </div>
      <div className="mood-history">
        <div className="mood-history-heading">
          <div><strong>Tu semana, a tu manera</strong><p>Un recuerdo de tus registros, no una nota sobre tu progreso.</p></div>
          {entries.length > 0 && <button type="button" onClick={clear}>Borrar historial</button>}
        </div>
        <div className="mood-history-days" role="img" aria-label={pastDays.map(day => `${day.label}: ${day.entry ? MOODS[day.entry.rating - 1].name : "sin registro"}`).join("; ")}>
          {pastDays.map(day => (
            <div className="mood-history-day" key={day.key}>
              <span className={day.entry ? "mood-history-mark has-entry" : "mood-history-mark"} style={{ backgroundColor: day.entry ? MOODS[day.entry.rating - 1].color : undefined }}>
                {day.entry ? ["◡", "·", "–", "⌣", "☺"][day.entry.rating - 1] : "·"}
              </span>
              <small>{day.label}</small>
            </div>
          ))}
        </div>
        <p className="mood-privacy-note">Este registro es opcional, permanece en el navegador y no se envía a Carolina ni se incorpora a tu historia clínica. Si borras los datos del navegador, también desaparecerá. No escribas aquí información clínica sensible.</p>
      </div>
    </section>
  );
}
