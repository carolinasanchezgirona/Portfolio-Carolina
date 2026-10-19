import type { Metadata } from "next";
import PatientMessages from "../../../components/patient-messages";
import AdminWorkspaceNav from "../workspace-nav";
export const metadata: Metadata = { title: "Mensajes de pacientes | Dememoria", robots: { index: false, follow: false, nocache: true } };
export default function MessagesPage() {
  return <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}><AdminWorkspaceNav active="otra" /><PatientMessages admin /></main>;
}
