import type { Metadata } from "next";
import PatientMessages from "../../../../components/patient-messages";
import "../app.css";
export const metadata: Metadata = {
 title: "Mensajes a Carolina · Entre Sesiones",
 robots: { index: false, follow: false, nocache: true },
 manifest: "/entre-sesiones-app.webmanifest",
};
export default function MessagesPage() {
 return <main className="esapp"><div className="esapp-container"><nav className="esapp-quicknav" aria-label="Entre Sesiones"><a href="/entre-sesiones/app/">Volver a mi espacio</a></nav><PatientMessages /><p><a href="/mi-espacio/">Iniciar sesión</a></p></div></main>;
}
