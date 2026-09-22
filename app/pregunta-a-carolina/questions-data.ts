import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "../lib/supabase-public";

export type QuestionCategory =
  | "psicologia"
  | "ansiedad-animo"
  | "relaciones-duelo"
  | "neuropsicologia"
  | "memoria-deterioro"
  | "familiares-cuidadores"
  | "otra";

export type PublicExpertQuestion = {
  id: string;
  question: string;
  answer: string;
  category: QuestionCategory;
  anchor_slug: string;
  related_page: string | null;
  published_at: string;
  updated_at: string;
};

export async function getPublishedExpertQuestions(): Promise<PublicExpertQuestion[]> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_published_expert_questions`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}
