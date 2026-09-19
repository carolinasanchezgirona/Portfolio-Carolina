import { permanentRedirect } from "next/navigation";

export default function AttentionAdultsRedirect() {
  permanentRedirect("/evaluacion-neuropsicologica/");
}
