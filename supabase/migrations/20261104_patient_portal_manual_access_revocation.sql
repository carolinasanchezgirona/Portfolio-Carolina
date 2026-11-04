ALTER TABLE public.clinical_patients
  ADD COLUMN IF NOT EXISTS portal_access_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS portal_access_changed_at timestamptz,
  ADD COLUMN IF NOT EXISTS portal_access_disabled_at timestamptz;

COMMENT ON COLUMN public.clinical_patients.portal_access_enabled IS
  'Control explícito del acceso a Entre Sesiones, independiente del estado clínico.';

CREATE TABLE IF NOT EXISTS public.patient_portal_access_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.clinical_patients(id) ON DELETE CASCADE,
  enabled boolean NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  changed_by text NOT NULL DEFAULT 'clinical_admin'
);
CREATE INDEX IF NOT EXISTS patient_portal_access_events_patient_idx
  ON public.patient_portal_access_events (patient_id, changed_at DESC);
ALTER TABLE public.patient_portal_access_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.patient_portal_access_events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.patient_portal_access_events TO service_role;

CREATE OR REPLACE FUNCTION public.admin_set_patient_portal_access(p_patient_id uuid, p_enabled boolean)
RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path = ''
AS $function$
DECLARE
  v_status text;
  v_old boolean;
  v_changed_at timestamptz;
BEGIN
  IF p_patient_id IS NULL OR p_enabled IS NULL THEN
    RAISE EXCEPTION 'Invalid portal access request';
  END IF;
  SELECT status, portal_access_enabled, portal_access_changed_at
    INTO v_status, v_old, v_changed_at
    FROM public.clinical_patients WHERE id = p_patient_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Patient not found'; END IF;
  IF v_status = 'archived' AND p_enabled THEN
    RAISE EXCEPTION 'Archived patients must be restored first';
  END IF;
  IF v_old IS DISTINCT FROM p_enabled THEN
    v_changed_at := clock_timestamp();
    UPDATE public.clinical_patients
      SET portal_access_enabled = p_enabled,
          portal_access_changed_at = v_changed_at,
          portal_access_disabled_at = CASE WHEN p_enabled THEN NULL ELSE v_changed_at END
      WHERE id = p_patient_id;
    INSERT INTO public.patient_portal_access_events(patient_id, enabled, changed_at)
      VALUES(p_patient_id, p_enabled, v_changed_at);
  END IF;
  IF NOT p_enabled THEN
    UPDATE public.patient_portal_sessions
      SET revoked_at = clock_timestamp()
      WHERE patient_id = p_patient_id AND revoked_at IS NULL;
    DELETE FROM public.patient_portal_login_codes WHERE patient_id = p_patient_id;
  END IF;
  RETURN jsonb_build_object('patient_id', p_patient_id, 'enabled', p_enabled, 'changed_at', v_changed_at);
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_set_patient_portal_access(uuid, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_patient_portal_access(uuid, boolean) TO service_role;
