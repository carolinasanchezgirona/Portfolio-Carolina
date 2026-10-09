"use client";

import { useEffect, useId, useMemo, useState } from "react";
import "./mood-tracker.css";

type MoodEntry = { date: string; rating: number; energy: number; energy_scale?: 5 };
const STORAGE_KEY = "wellness_mood_checkins_v1";
const MOODS = [
  { rating: 1, name: "Muy mal", note: "Ahora mismo me encuentro muy mal", color: "#c8dcf4" },
  { rating: 2, name: "Mal", note: "Ahora mismo no me encuentro bien", color: "#e5cae8" },
  { rating: 3, name: "Regular", note: "Ni bien ni mal", color: "#f5dfb7" },
  { rating: 4, name: "Bien", note: "Ahora mismo me encuentro bien", color: "#caebde" },
  { rating: 5, name: "Muy bien", note: "Ahora mismo me encuentro muy bien", color: "#b5e3db" },
];
const ENERGY = ["Muy baja", "Baja", "Media", "Alta", "Muy alta"];

/**
 * Five readable expressions instead of five almost identical colour dots.
 * The numeric 1–5 scale and existing patient entries remain unchanged.
 * Facial features, not colour alone, communicate the selected state.
 */
function MoodScaleFace({ rating }: { rating: number }) {
  return (
    <svg className="mood-scale-face" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`mood-face-gradient-${rating}`} cx="30%" cy="24%" r="83%">
          <stop offset="0%" stopColor="#fff7e5" />
          <stop offset="59%" stopColor="#ffdbab" />
          <stop offset="100%" stopColor="#e9b87c" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="31" r="27" fill={`url(#mood-face-gradient-${rating})`} stroke="#d5a56d" strokeWidth="1" />
      <ellipse cx="25" cy="15" rx="16" ry="7" fill="#fff" opacity=".27" transform="rotate(-16 25 15)" />
      <ellipse cx="18" cy="39" rx="8" ry="6" fill="#ed9a92" opacity=".27" />
      <ellipse cx="46" cy="39" rx="8" ry="6" fill="#ed9a92" opacity=".27" />
      {rating === 5 ? (
        <>
          <path d="M16 27 Q23 19 29 27 M35 27 Q42 19 49 27" fill="none" stroke="#58434e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M17 37 Q32 58 47 37" fill="#ac5a6d" stroke="#804955" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M23 43 Q32 49 41 43" fill="none" stroke="#fff6e5" strokeWidth="2.1" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="23" cy="29" rx={rating === 1 ? 3.9 : 3.5} ry={rating <= 2 ? 5.2 : 4.3} fill="#55434c" />
          <ellipse cx="41" cy="29" rx={rating === 1 ? 3.9 : 3.5} ry={rating <= 2 ? 5.2 : 4.3} fill="#55434c" />
          <circle cx="21.8" cy="27.6" r="1.3" fill="#fff" />
          <circle cx="39.8" cy="27.6" r="1.3" fill="#fff" />
        </>
      )}
      {rating === 1 && <>
        <path d="M15 19 Q20 13 27 18 M37 18 Q44 13 49 19" stroke="#75535d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M22 49 Q32 35 42 49" stroke="#8d5365" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M46 34 Q53 41 47 46 Q42 42 46 34" fill="#a3d5e6" stroke="#6ba9c4" strokeWidth="1" />
      </>}
      {rating === 2 && <>
        <path d="M15 21 L27 19 M37 19 L49 21" stroke="#75535d" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M23 45 Q32 38 41 45" stroke="#8d5365" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </>}
      {rating === 3 && <>
        <path d="M17 21 L27 21 M37 21 L47 21" stroke="#75535d" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        <path d="M23 44 L41 44" stroke="#8d5365" strokeWidth="3.3" fill="none" strokeLinecap="round" />
      </>}
      {rating === 4 && <>
        <path d="M17 20 Q23 17 28 21 M36 21 Q42 17 47 20" stroke="#75535d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M21 40 Q32 51 43 40" stroke="#8d5365" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      </>}
    </svg>
  );
}

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
const AVATAR_CHANGE_EVENT = "wellness-companion-avatar-changed";
const SESSION_READY_EVENT = "patient-portal-session-ready";
const DEFAULT_AVATAR = AVATARS[0];

type AvatarProfile = { avatar: AvatarId | null; scope: string | null };

async function readAvatar(): Promise<AvatarProfile> {
  const response = await fetch("/api/patient-portal/preferences", { credentials: "include", cache: "no-store" });
  if (!response.ok) throw new Error("Necesitas identificarte para consultar tu personaje.");
  const data = await response.json() as { avatar_id?: string | null; storage_scope?: string };
  const selected = AVATARS.find(option => option.id === data.avatar_id)?.id ?? null;
  const scope = typeof data.storage_scope === "string" && /^[a-f0-9]{24}$/.test(data.storage_scope) ? data.storage_scope : null;
  return { avatar: selected, scope };
}

async function saveAvatar(id: AvatarId): Promise<boolean> {
  try {
    const response = await fetch("/api/patient-portal/preferences", {
      method: "PUT", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatar_id: id }),
    });
    if (!response.ok) return false;
    window.dispatchEvent(new CustomEvent(AVATAR_CHANGE_EVENT, { detail: id }));
    return true;
  } catch { return false; }
}

function useAvatar() {
  const [profile, setProfile] = useState<AvatarProfile>({ avatar: null, scope: null });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let mounted = true;
    let revision = 0;
    const refresh = async () => {
      const currentRevision = ++revision;
      setReady(false);
      try {
        const loaded = await readAvatar();
        if (mounted && currentRevision === revision) setProfile(loaded);
      } catch {
        if (mounted && currentRevision === revision) setProfile({ avatar: null, scope: null });
      } finally {
        if (mounted && currentRevision === revision) setReady(true);
      }
    };
    void refresh();
    window.addEventListener(AVATAR_CHANGE_EVENT, refresh);
    window.addEventListener(SESSION_READY_EVENT, refresh);
    return () => {
      mounted = false;
      window.removeEventListener(AVATAR_CHANGE_EVENT, refresh);
      window.removeEventListener(SESSION_READY_EVENT, refresh);
    };
  }, []);
  return { ...profile, ready };
}

/** Each mood selects a complete 3D expression, never a facial overlay. */
function MoodFriend({ mood, avatarId, portraitOnly = false }: { mood: number; avatarId: AvatarId; portraitOnly?: boolean }) {
  const index = Math.max(0, AVATARS.findIndex(option => option.id === avatarId));
  const avatar = AVATARS[index] ?? DEFAULT_AVATAR;
  const expression = portraitOnly ? 4 : Math.max(1, Math.min(5, mood));
  return <span role="img" aria-label={`${avatar.label}: ${MOODS[expression - 1].name}`}
    className="mood-friend-image mood-friend-expressive"
    style={{ backgroundImage: 'url("/mi-espacio-art/avatares-expresiones-v2.webp")', backgroundSize: "500% 800%", backgroundPosition: `${(expression - 1) * 25}% ${index * 100 / 7}%` }} />;
}

function MoodEvolution({ entries }: { entries: MoodEntry[] }) {
  const [period, setPeriod] = useState(7);
  const [showMood, setShowMood] = useState(true);
  const [showEnergy, setShowEnergy] = useState(true);
  const [picked, setPicked] = useState<string | null>(null);
  const gradient = useId().replace(/:/g, "");
  const days = Array.from({ length: period }, (_, i) => {
    const date = dayOffset(i - period + 1);
    const key = keyForDate(date);
    return { key, date, entry: entries.find(entry => entry.date === key) };
  });
  const recorded = days.flatMap(day => day.entry ? [day.entry] : []);
  const active = recorded.find(entry => entry.date === picked) ?? recorded.at(-1);
  const width = period === 7 ? 720 : period === 30 ? 960 : 1440;
  const x = (i: number) => 112 + i * (width - 224) / (period - 1);
  const y = (value: number) => 226 - (value - 1) * 44;
  const dateLabel = (key: string) => new Intl.DateTimeFormat("es-ES", { day:"numeric", month:"short" }).format(new Date(key + "T12:00:00"));
  function segments(energy: boolean) {
    const result: string[][] = []; let current: string[] = [];
    days.forEach((day, i) => {
      if(day.entry) current.push(`${x(i)},${y(energy ? day.entry.energy + 1 : day.entry.rating)}`);
      else if(current.length) { result.push(current); current = []; }
    });
    if(current.length) result.push(current);
    return result;
  }
  return <section className="mood-evolution" aria-labelledby="mood-evolution-title">
    <div className="mood-evolution-heading"><div><p className="space-eyebrow">Mis momentos</p><h4 id="mood-evolution-title">Así me he ido sintiendo</h4><p>Observa tus cambios de ánimo y energía, a tu ritmo.</p></div>
      <div className="mood-periods" role="group" aria-label="Periodo del gráfico">{[7,30,90].map(value => <button type="button" key={value} aria-pressed={period === value} onClick={() => { setPeriod(value); setPicked(null); }}>{value} días</button>)}</div></div>
    <div className="mood-chart-legend"><label><input type="checkbox" checked={showMood} onChange={e => setShowMood(e.target.checked)} /><span className="mood-legend-dot" />Ánimo · línea continua</label><label><input type="checkbox" checked={showEnergy} onChange={e => setShowEnergy(e.target.checked)} /><span className="mood-legend-dot energy" />Energía · línea discontinua</label><span>{recorded.length} de {period} días registrados</span></div>
    {recorded.length ? <>
      <p className="mood-chart-hint">Toca un punto para consultar ese día. Desliza el gráfico para recorrer el periodo.</p>
      <div className="mood-evolution-scroll" tabIndex={0} role="region" aria-label="Gráfico desplazable de ánimo y energía">
        <svg width={width} height="290" viewBox={`0 0 ${width} 290`} role="group" aria-label="Evolución de los registros personales">
          <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#08a6a0" stopOpacity=".23"/><stop offset="100%" stopColor="#08a6a0" stopOpacity=".02"/></linearGradient></defs>
          {[1,2,3,4,5].map(value => <g key={value}><line x1="106" y1={y(value)} x2={width-106} y2={y(value)} stroke="#d8e7ee" strokeDasharray="4 5" />{showMood && <text x="94" y={y(value)+5} textAnchor="end" fill="#173a5e" fontSize="14">{MOODS[value-1].name}</text>}{showEnergy && <text x={width-94} y={y(value)+5} fill="#9f4b42" fontSize="14">{ENERGY[value-1]}</text>}</g>)}
          {showMood && segments(false).filter(points => points.length > 1).map((points,i) => <g key={i}><polygon points={`${points[0].split(',')[0]},242 ${points.join(' ')} ${points.at(-1)!.split(',')[0]},242`} fill={`url(#${gradient})`}/><polyline points={points.join(' ')} fill="none" stroke="#078e88" strokeWidth="3.5" strokeLinejoin="round"/></g>)}
          {showEnergy && segments(true).filter(points => points.length > 1).map((points,i) => <polyline key={i} points={points.join(' ')} fill="none" stroke="#cf6b5c" strokeWidth="3" strokeDasharray="7 6" strokeLinejoin="round"/>)}
          {days.map((day,i) => <g key={day.key}>
            {day.entry && <g role="button" tabIndex={0} aria-label={`${dateLabel(day.key)}: ánimo ${MOODS[day.entry.rating-1].name}, energía ${ENERGY[day.entry.energy]}`} onClick={() => setPicked(day.key)} onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPicked(day.key); } }} className="mood-chart-point">
              <rect x={x(i)-10} y="32" width="20" height="215" fill="transparent"/>
              {active?.date === day.key && <line x1={x(i)} y1="32" x2={x(i)} y2="242" stroke="#173a5e" opacity=".22"/>}
              {showMood && <circle cx={x(i)} cy={y(day.entry.rating)} r={period===90?4:6} fill="#fff" stroke="#078e88" strokeWidth="3"/>}
              {showEnergy && <rect x={x(i)-4} y={y(day.entry.energy+1)-4} width="8" height="8" rx="1" fill="#cf6b5c" stroke="#fff"/>}
            </g>}
            {(period === 7 || i % (period === 30 ? 5 : 15) === 0 || i === period-1) && <text x={x(i)} y="271" textAnchor="middle" fill="#526d80" fontSize="14">{dateLabel(day.key)}</text>}
          </g>)}
        </svg>
      </div>
      {active && <div className="mood-chart-detail" aria-live="polite"><strong>{dateLabel(active.date)}</strong><span>Ánimo: <b>{MOODS[active.rating-1].name}</b></span><span>Energía: <b>{ENERGY[active.energy]}</b></span></div>}
      <details className="mood-chart-table"><summary>Consultar todos los registros del periodo</summary><ul>{recorded.map(entry => <li key={entry.date}><button type="button" onClick={() => setPicked(entry.date)}>{dateLabel(entry.date)} · {MOODS[entry.rating-1].name} · Energía {ENERGY[entry.energy].toLowerCase()}</button></li>)}</ul></details>
    </> : <div className="mood-week-empty">Aún no hay registros en este periodo. Tu primer momento aparecerá aquí como un punto; la evolución se construirá con tus próximos registros.</div>}
    <p className="mood-chart-caption">Los días sin registro quedan vacíos, sin unir ni estimar valores. Estas escalas reflejan tus respuestas; no son una medida diagnóstica ni una puntuación de mejora.</p>
  </section>;
}

function AvatarChoices({ selected, onSelect }: { selected: AvatarId | null; onSelect: (id: AvatarId) => void }) {
  return (
    <div className="mood-avatar-grid" role="group" aria-label="Elige tu personaje">
      {AVATARS.map(avatar => (
        <button key={avatar.id} type="button" className={selected === avatar.id ? "mood-avatar-choice is-selected" : "mood-avatar-choice"}
          onClick={() => onSelect(avatar.id)} aria-pressed={selected === avatar.id}>
          <span className="mood-avatar-portrait"><MoodFriend mood={4} avatarId={avatar.id} portraitOnly /></span>
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
        void saveAvatar(value).then(saved => {
          if (saved) { setEditing(false); setFeedback("Personaje actualizado en tu cuenta."); }
          else setFeedback("No se ha podido guardar el personaje. Comprueba tu sesión.");
        });
      }}/><button type="button" className="mood-avatar-cancel" onClick={() => setEditing(false)}>Cancelar</button></>}
      <p className="mood-privacy-note">La preferencia se guarda en tu cuenta. No contiene información clínica.</p>
      <span role="status" className="mood-status">{feedback}</span>
    </section>
  );
}

export default function MoodTracker() {
  const { avatar, scope, ready: avatarReady } = useAvatar();
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [energy, setEnergy] = useState(2);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const today = keyForDate(new Date());

  const scopedMoodKey = scope ? STORAGE_KEY + ":" + scope : null;
  useEffect(() => {
    setLoaded(false);
    setEntries([]);
    setSelected(null);
    setEnergy(2);
    if (!scopedMoodKey) return;
    try {
      const raw = JSON.parse(localStorage.getItem(scopedMoodKey) || "[]");
      // Previously stored energy 0,1,2 maps to 0,2,4 on the new scale.
      const valid: MoodEntry[] = Array.isArray(raw) ? raw.filter((entry): entry is MoodEntry =>
        typeof entry?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
        Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5 &&
        Number.isInteger(entry.energy) && entry.energy >= 0 &&
        (entry.energy_scale === 5 ? entry.energy <= 4 : entry.energy <= 2)
      ).slice(-90).map(entry => ({
        ...entry,
        energy: entry.energy_scale === 5 ? entry.energy : entry.energy * 2,
        energy_scale: 5 as const,
      })) : [];
      setEntries(valid);
      const current = valid.find(entry => entry.date === keyForDate(new Date()));
      if (current) { setSelected(current.rating); setEnergy(current.energy); }
    } catch { setEntries([]); }
    setLoaded(true);
  }, [scopedMoodKey]);

  const displayed = MOODS[(selected || 3) - 1];
  const weekCount = useMemo(() => entries.filter(entry => pastWeekKeys().has(entry.date)).length, [entries]);

  function pastWeekKeys() {
    return new Set(Array.from({ length: 7 }, (_, offset) => keyForDate(dayOffset(-offset))));
  }

  const recent = useMemo(() => [...entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5), [entries]);

  function save() {
    if (selected === null || !loaded || !scopedMoodKey) return;
    const newEntries = [...entries.filter(entry => entry.date !== today), { date: today, rating: selected, energy, energy_scale: 5 as const }]
      .sort((a, b) => a.date.localeCompare(b.date)).slice(-90);
    try {
      localStorage.setItem(scopedMoodKey, JSON.stringify(newEntries));
      setEntries(newEntries);
      setMessage("Registro guardado en este dispositivo. Puedes actualizarlo hoy si cambia cómo te sientes.");
    } catch {
      setMessage("Este navegador no permite guardar el registro. No se ha conservado.");
    }
  }
  function clear() {
    if (!window.confirm("¿Borrar todos tus registros de ánimo guardados en este dispositivo?")) return;
    if (scopedMoodKey) try { localStorage.removeItem(scopedMoodKey); } catch { /* almacenamiento bloqueado */ }
    setEntries([]);
    setSelected(null);
    setEnergy(2);
    setMessage("Has borrado el historial de este dispositivo.");
  }

  if (!avatarReady || !scope) return null;
  if (!avatar) return (
    <section className="mood-tracker mood-avatar-onboarding" aria-labelledby="mood-avatar-onboarding-title">
      <p className="space-eyebrow">Bienvenido a tu espacio</p>
      <h3 id="mood-avatar-onboarding-title">Elige a tu compañero</h3>
      <p>Lo elegirás una sola vez. Se guardará en tu cuenta y te acompañará en tus registros. Podrás cambiarlo desde «Configuración → Mi personaje».</p>
      <AvatarChoices selected={avatar} onSelect={value => { void saveAvatar(value).then(saved => { if (!saved) setMessage("No se ha podido guardar el personaje. Inténtalo de nuevo."); }); }}/>
      <span role="status" className="mood-status">{message}</span>
      <p className="mood-privacy-note">Puedes elegir cualquier personaje. No influye en tus ejercicios ni en cómo se interpretan tus registros.</p>
    </section>
  );

  return (
    <section className="mood-tracker" aria-labelledby="mood-tracker-title">
      <div className="mood-tracker-heading">
        <div>
          <p className="space-eyebrow">Tu momento</p>
          <h3 id="mood-tracker-title">¿Cómo te sientes hoy?</h3>
          <p>No hay respuestas correctas ni incorrectas. Elige la cara que más se parece a cómo te encuentras ahora mismo.</p>
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
          <p className="mood-tracker-question">¿Cómo te encuentras emocionalmente?</p>
          <div className="mood-options" role="group" aria-label="Selecciona cómo te encuentras emocionalmente">
            {MOODS.map(mood => (
              <button key={mood.rating} type="button"
                className={selected === mood.rating ? "mood-option is-selected" : "mood-option"}
                aria-label={`Me siento ${mood.name.toLowerCase()}`}
                aria-pressed={selected === mood.rating}
                onClick={() => { setSelected(mood.rating); setMessage(""); }}>
                <MoodScaleFace rating={mood.rating} />
                <span>{mood.name}</span>
                {selected === mood.rating && <span className="mood-option-check" aria-hidden="true">✓</span>}
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
        <MoodEvolution entries={entries} />
        <section className="mood-recent" aria-label="Mis últimos registros">
          <div className="mood-recent-heading"><h4>Mis últimos registros</h4><span>{weekCount === 1 ? "1 registro esta semana" : `${weekCount} registros esta semana`}</span></div>
          {recent.length ? (
            <ul className="mood-recent-list">
              {recent.map(entry => (
                <li key={entry.date}>
                  <span className="mood-recent-indicator" style={{ backgroundColor: MOODS[entry.rating - 1].color }} aria-hidden="true" />
                  <time className="mood-recent-day" dateTime={entry.date}>{new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short" }).format(new Date(entry.date + "T12:00:00"))}</time>
                  <span className="mood-recent-text"><strong>{MOODS[entry.rating - 1].name}</strong><small>Energía {ENERGY[entry.energy].toLowerCase()}</small></span>
                </li>
              ))}
            </ul>
          ) : <p className="mood-recent-empty">Todavía no tienes registros. Aparecerán aquí cuando quieras comenzar.</p>}
        </section>
        <p className="mood-privacy-note">Este registro es opcional, permanece en el navegador y no se envía a Carolina ni se incorpora a tu historia clínica. Si borras los datos del navegador, también desaparecerá. No escribas aquí información clínica sensible.</p>
      </div>
    </section>
  );
}
