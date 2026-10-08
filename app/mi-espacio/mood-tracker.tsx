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

type AvatarId = "boy" | "girl" | "teen-boy" | "teen-girl" | "adult-man" | "adult-woman" | "senior-man" | "senior-woman";
type AvatarOption = { id: AvatarId; label: string; stage: string; hair: string; skin: string };
const AVATARS: AvatarOption[] = [
  { id: "boy", label: "Niño", stage: "Infancia", hair: "#613b31", skin: "#f3c49f" },
  { id: "girl", label: "Niña", stage: "Infancia", hair: "#9b5741", skin: "#dca987" },
  { id: "teen-boy", label: "Chico", stage: "Adolescencia", hair: "#332d36", skin: "#dca47e" },
  { id: "teen-girl", label: "Chica", stage: "Adolescencia", hair: "#5a3631", skin: "#a66c50" },
  { id: "adult-man", label: "Hombre", stage: "Edad adulta", hair: "#624332", skin: "#dba882" },
  { id: "adult-woman", label: "Mujer", stage: "Edad adulta", hair: "#70443a", skin: "#e9bb9c" },
  { id: "senior-man", label: "Hombre mayor", stage: "Edad avanzada", hair: "#d2d8e0", skin: "#e1b28e" },
  { id: "senior-woman", label: "Mujer mayor", stage: "Edad avanzada", hair: "#d4cfd4", skin: "#bd8d70" },
];
const AVATAR_KEY = "wellness_companion_avatar_v1";
const AVATAR_CHANGE_EVENT = "wellness-companion-avatar-changed";
const DEFAULT_AVATAR = AVATARS[0];

function readAvatar(): AvatarId | null {
  try {
    const value = localStorage.getItem(AVATAR_KEY);
    return AVATARS.find(avatar => avatar.id === value)?.id ?? null;
  } catch { return null; }
}

function saveAvatar(id: AvatarId): boolean {
  try {
    localStorage.setItem(AVATAR_KEY, id);
    window.dispatchEvent(new CustomEvent(AVATAR_CHANGE_EVENT, { detail: id }));
    return true;
  } catch { return false; }
}

function useAvatar() {
  const [avatar, setAvatar] = useState<AvatarId | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setAvatar(readAvatar());
    setReady(true);
    const handler = () => setAvatar(readAvatar());
    window.addEventListener(AVATAR_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AVATAR_CHANGE_EVENT, handler);
  }, []);
  return { avatar, ready };
}

function MoodFriend({ mood, avatarId }: { mood: number; avatarId: AvatarId }) {
  const character = AVATARS.find(avatar => avatar.id === avatarId) ?? DEFAULT_AVATAR;
  const isOlder = avatarId.startsWith("senior");
  const isChild = avatarId === "boy" || avatarId === "girl";
  const hasLongHair = ["girl", "teen-girl", "adult-woman", "senior-woman"].includes(avatarId);
  const beard = ["adult-man", "senior-man"].includes(avatarId);
  const low = mood <= 2;
  const delighted = mood === 5;
  const smiling = mood >= 4;
  const hairColor = character.hair;
  const skinColor = character.skin;
  return (
    <svg className="mood-friend-svg" viewBox="0 0 260 270" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mood-shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#83bec1" /><stop offset="1" stopColor="#367a88" /></linearGradient>
        <radialGradient id="mood-cheeks"><stop offset="0" stopColor="#e58c95" stopOpacity=".42"/><stop offset="1" stopColor="#e58c95" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx="130" cy="255" rx="72" ry="8" fill="#163d5d" opacity=".11" />
      {hasLongHair && <path d="M62 104 Q58 25 130 24 Q205 25 201 109 L206 219 Q185 238 169 220 L88 220 Q64 239 54 220Z" fill={hairColor} />}
      <path d="M48 245 Q50 202 91 191 L169 191 Q210 201 214 245Z" fill="url(#mood-shirt)" stroke="#397f8b" strokeWidth="2"/>
      <rect x="109" y="187" width="42" height="29" rx="14" fill={skinColor}/>
      <ellipse cx="61" cy="145" rx="14" ry="22" fill={skinColor}/>
      <ellipse cx="199" cy="145" rx="14" ry="22" fill={skinColor}/>
      <path d="M65 106 Q67 45 130 43 Q195 45 196 108 L192 165 Q185 212 130 216 Q75 210 68 167Z" fill={skinColor} stroke="#b77a68" strokeWidth="1.2"/>
      <ellipse cx="92" cy="163" rx="26" ry="20" fill="url(#mood-cheeks)"/>
      <ellipse cx="167" cy="163" rx="26" ry="20" fill="url(#mood-cheeks)"/>
      {hasLongHair ? (
        <path d="M65 108 Q48 70 69 46 Q94 13 143 24 Q194 25 200 94 Q188 83 172 72 Q145 88 108 77 Q94 103 65 108Z" fill={hairColor} stroke="#ffffff" strokeOpacity=".12" strokeWidth="2"/>
      ) : (
        <path d={isOlder ? "M65 105 Q57 48 94 39 Q130 21 168 41 Q199 56 195 102 Q168 70 138 78 Q100 72 65 105Z" : isChild ? "M65 107 Q48 50 92 38 Q144 14 185 55 Q194 71 194 107 Q171 92 164 72 Q126 92 101 77 Q78 95 65 107Z" : "M65 108 Q51 50 89 37 Q125 13 168 37 Q199 54 195 108 Q171 88 161 70 Q127 83 105 76 Q85 95 65 108Z"} fill={hairColor}/>
      )}
      {isOlder && (
        <>
          <path d="M80 120 Q87 117 93 120 M167 120 Q173 117 181 120" fill="none" stroke="#956f61" strokeWidth="1.4" opacity=".6" />
          <path d="M73 162 Q79 166 85 164 M174 164 Q180 166 187 162" fill="none" stroke="#a8786b" strokeWidth="1.5" opacity=".45"/>
          <g stroke="#456b77" strokeWidth="3" fill="none"><circle cx="103" cy="143" r="23"/><circle cx="158" cy="143" r="23"/><path d="M126 140 Q130 137 135 140 M80 139 L65 136 M181 139 L196 136"/></g>
        </>
      )}
      {delighted ? (
        <>
          <path d="M89 145 Q101 128 114 144 M146 144 Q158 128 171 145" stroke="#3e3541" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </>
      ) : (
        <>
          <ellipse cx="102" cy="146" rx={isChild ? "10" : "9"} ry="13" fill="#3d3540"/>
          <ellipse cx="158" cy="146" rx={isChild ? "10" : "9"} ry="13" fill="#3d3540"/>
          <circle cx="99" cy="142" r="3.6" fill="#fff"/>
          <circle cx="155" cy="142" r="3.6" fill="#fff"/>
        </>
      )}
      <path d={low ? "M89 125 Q102 121 115 126 M145 126 Q158 121 171 125" : "M90 127 Q102 121 114 127 M146 127 Q158 121 170 127"} stroke={hairColor} strokeWidth="3.7" fill="none" strokeLinecap="round"/>
      <path d="M125 167 Q130 172 135 167" stroke="#995f58" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {beard && <path d="M98 180 Q103 212 130 211 Q157 212 162 180 Q156 201 130 202 Q103 201 98 180Z" fill={hairColor} opacity={isOlder ? ".77" : ".88"}/>}
      {mood === 1 && <path d="M113 192 Q130 176 147 192" fill="none" stroke="#8b4e61" strokeWidth="4" strokeLinecap="round" />}
      {mood === 2 && <path d="M116 187 Q130 182 144 187" fill="none" stroke="#8b4e61" strokeWidth="4" strokeLinecap="round" />}
      {mood === 3 && <path d="M117 186 L143 186" fill="none" stroke="#8b4e61" strokeWidth="4" strokeLinecap="round" />}
      {smiling && <path d={delighted ? "M105 180 Q130 214 155 180" : "M110 181 Q130 201 150 181"} stroke="#8b4e61" fill={delighted ? "#b76579" : "none"} strokeWidth="4" strokeLinecap="round"/>}
      {mood === 1 && <path d="M184 163 Q196 181 185 187 Q178 178 184 163" fill="#9ed2df" stroke="#73afc5" strokeWidth="1.3"/>}
      {hasLongHair && <path d="M68 107 Q56 146 68 200 M193 107 Q206 147 193 200" fill="none" stroke={hairColor} strokeWidth="15" strokeLinecap="round"/>}
      <path d="M93 226 Q88 237 78 238 M167 226 Q172 237 182 238" stroke={skinColor} strokeWidth="11" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function AvatarChoices({ selected, onSelect }: { selected: AvatarId | null; onSelect: (id: AvatarId) => void }) {
  return (
    <div className="mood-avatar-grid" role="group" aria-label="Elige tu personaje">
      {AVATARS.map(avatar => (
        <button key={avatar.id} type="button" className={selected === avatar.id ? "mood-avatar-choice is-selected" : "mood-avatar-choice"}
          onClick={() => onSelect(avatar.id)} aria-pressed={selected === avatar.id}>
          <span className="mood-avatar-portrait"><MoodFriend mood={4} avatarId={avatar.id} /></span>
          <strong>{avatar.label}</strong><small>{avatar.stage}</small>
        </button>
      ))}
    </div>
  );
}

export function MoodAvatarSettings() {
  const { avatar, ready } = useAvatar();
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState("");
  if (!ready) return null;
  const current = AVATARS.find(option => option.id === avatar);
  return (
    <section className="mood-settings" aria-labelledby="mood-settings-title">
      <div className="mood-settings-heading"><div><p className="space-eyebrow">Personalización</p><h3 id="mood-settings-title">Mi personaje</h3>
        <p>{current ? `Tu compañero actual: ${current.label}. Puedes cambiarlo cuando quieras.` : "Todavía no has elegido un personaje."}</p></div>
        {!editing && <button type="button" className="space-secondary" onClick={() => setEditing(true)}>{current ? "Cambiar personaje" : "Elegir personaje"}</button>}
      </div>
      {editing && <><AvatarChoices selected={avatar} onSelect={value => {
        if (saveAvatar(value)) { setEditing(false); setFeedback("Personaje actualizado en este dispositivo."); }
        else setFeedback("No se ha podido guardar en este navegador.");
      }}/><button type="button" className="mood-avatar-cancel" onClick={() => setEditing(false)}>Cancelar</button></>}
      <p className="mood-privacy-note">La preferencia se guarda en este dispositivo. No contiene información clínica.</p>
      <span role="status" className="mood-status">{feedback}</span>
    </section>
  );
}

export default function MoodTracker() {
  const { avatar, ready: avatarReady } = useAvatar();
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

  if (!avatarReady) return null;
  if (!avatar) return (
    <section className="mood-tracker mood-avatar-onboarding" aria-labelledby="mood-avatar-onboarding-title">
      <p className="space-eyebrow">Bienvenido a tu espacio</p>
      <h3 id="mood-avatar-onboarding-title">Elige a tu compañero</h3>
      <p>Lo elegirás una sola vez en este dispositivo. Después te acompañará en tus registros de ánimo. Si quieres cambiarlo, estará en «Cuenta y privacidad → Mi personaje».</p>
      <AvatarChoices selected={avatar} onSelect={saveAvatar}/>
      <p className="mood-privacy-note">Puedes elegir cualquier personaje. No influye en tus ejercicios ni en cómo se interpretan tus registros.</p>
    </section>
  );

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
          <MoodFriend mood={selected || 3} avatarId={avatar} />
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
        <div className="mood-week-chart">
          {pastDays.some(day => day.entry) ? (
            <svg viewBox="0 0 740 212" role="img" aria-label={pastDays.map(day => `${day.label}: ${day.entry ? MOODS[day.entry.rating - 1].name : "sin registro"}`).join("; ")} preserveAspectRatio="xMidYMid meet">
              {[1,2,3,4,5].map(rating => {
                const y = 167 - (rating - 1) * 33;
                return <line key={rating} x1="45" y1={y} x2="695" y2={y} stroke="#dce9ee" strokeDasharray={rating === 3 ? "0" : "4 6"} strokeWidth="1" />;
              })}
              {pastDays.slice(1).map((day, i) => {
                const previous = pastDays[i];
                if (!previous.entry || !day.entry) return null;
                return <line key={day.key} x1={52 + i * 105} y1={167 - (previous.entry.rating - 1) * 33} x2={52 + (i + 1) * 105} y2={167 - (day.entry.rating - 1) * 33} stroke="#0ba49c" strokeWidth="3.5" strokeLinecap="round" />;
              })}
              {pastDays.map((day, i) => (
                <g key={day.key}>
                  {day.entry
                    ? <circle cx={52 + i * 105} cy={167 - (day.entry.rating - 1) * 33} r="8.5" fill={MOODS[day.entry.rating - 1].color} stroke="#187d83" strokeWidth="2" />
                    : <circle cx={52 + i * 105} cy="167" r="5" fill="#e4edf0" />}
                  <text x={52 + i * 105} y="203" textAnchor="middle" fill="#597384" fontSize="18">{day.label}</text>
                </g>
              ))}
            </svg>
          ) : <div className="mood-week-empty">Tu gráfica aparecerá aquí cuando guardes el primer registro. No necesitas registrar todos los días.</div>}
          <p className="mood-chart-caption">Solo aparecen los datos que tú has registrado. Los días sin respuesta quedan sin conectar.</p>
        </div>
        <p className="mood-privacy-note">Este registro es opcional, permanece en el navegador y no se envía a Carolina ni se incorpora a tu historia clínica. Si borras los datos del navegador, también desaparecerá. No escribas aquí información clínica sensible.</p>
      </div>
    </section>
  );
}
