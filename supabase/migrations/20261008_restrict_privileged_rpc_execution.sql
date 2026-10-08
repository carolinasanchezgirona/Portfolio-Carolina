-- Applied to project grgyvdxkjdstdyumdfyg on 2026-10-08.
-- Principle of least privilege for privileged RPCs. Intentionally preserve
-- public booking RPCs, article read RPCs and published question read RPCs.
--
-- PUBLIC is a PostgreSQL pseudo-role. Explicit anon grants must also be revoked.
-- Service role access remains for scheduled publishing and server-side automation.

BEGIN;

-- Scheduled publishing is a privileged background task, not a public endpoint.
REVOKE EXECUTE ON FUNCTION public.publish_due_articles()
  FROM PUBLIC, anon, authenticated;

-- Clinical maintenance RPCs remain available only to the authenticated
-- professional. Their existing is_clinical_owner() checks remain in place.
REVOKE EXECUTE ON FUNCTION public.merge_clinical_patients(uuid, uuid)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.merge_clinical_patients(uuid, uuid)
  TO authenticated;

REVOKE EXECUTE ON FUNCTION public.delete_empty_clinical_patient(uuid)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_empty_clinical_patient(uuid)
  TO authenticated;

-- Administrative schedule inspection must not be callable anonymously;
-- the public schedule uses get_public_appointment_starts() instead.
REVOKE EXECUTE ON FUNCTION public.get_professional_appointment_starts(integer)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_professional_appointment_starts(integer)
  TO authenticated;

-- Trigger-only clinical audit function: never callable as a direct RPC.
REVOKE EXECUTE ON FUNCTION public.log_clinical_change()
  FROM PUBLIC, anon, authenticated;

COMMIT;
