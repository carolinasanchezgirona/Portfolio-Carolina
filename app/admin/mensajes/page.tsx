import type { Metadata } from "next";
import PatientMessages from "../../../components/patient-messages";
import AdminWorkspaceNav from "../workspace-nav";
export const metadata: Metadata = { title: "Mensajes de pacientes | Dememoria", robots: { index: false, follow: false, nocache: true } };
export default function MessagesPage() {
  return <main className="admin-messages-page"><AdminWorkspaceNav active="mensajes" /><PatientMessages admin /></main>;
}
