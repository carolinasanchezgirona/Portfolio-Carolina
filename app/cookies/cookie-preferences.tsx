"use client";
export default function CookiePreferences() {
  return <button type="button" className="editorial-btn editorial-btn-primary" onClick={() => window.dispatchEvent(new Event("carolina:cookie-preferences"))}>Cambiar mis preferencias de cookies</button>;
}
