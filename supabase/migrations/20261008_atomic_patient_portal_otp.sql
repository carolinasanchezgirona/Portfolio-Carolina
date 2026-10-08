-- Patient portal OTP operations must be atomic under concurrent requests.
-- These privileged functions are callable ONLY by service_role; never expose as public RPC.
CREATE OR REPLACE FUNCTION public.issue_patient_portal_login_code(
  p_patient_id uuid, p_email_normalized text, p_code_hash text, p_expires_at timestamptz
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_id uuid;
  v_count integer;
  v_latest timestamptz;
BEGIN
  IF p_patient_id IS NULL OR p_email_normalized IS NULL
     OR p_code_hash IS NULL OR length(p_code_hash) <> 64
     OR p_expires_at IS NULL OR p_expires_at > now() + interval '11 minutes'
     OR p_expires_at <= now() THEN
    RETURN NULL;
  END IF;

  -- Serialize issuance for the same patient to enforce the cooldown atomically.
  PERFORM 1 FROM public.clinical_patients
    WHERE id = p_patient_id AND status <> 'archived' FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT count(*), max(created_at) INTO v_count, v_latest
    FROM public.patient_portal_login_codes
    WHERE patient_id = p_patient_id
      AND email_normalized = p_email_normalized
      AND created_at >= now() - interval '1 hour';

  IF v_count >= 5 OR v_latest >= now() - interval '60 seconds' THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.patient_portal_login_codes
    (patient_id, email_normalized, code_hash, expires_at)
  VALUES (p_patient_id, p_email_normalized, p_code_hash, p_expires_at)
  RETURNING id INTO v_id;
  RETURN v_id;
END
$$;

CREATE OR REPLACE FUNCTION public.consume_patient_portal_login_code(
  p_email_normalized text, p_candidate_hash text
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_code public.patient_portal_login_codes%rowtype;
BEGIN
  IF p_email_normalized IS NULL OR p_candidate_hash IS NULL
    OR length(p_candidate_hash) <> 64 THEN
    RETURN NULL;
  END IF;

  -- Lock the newest issued code, including consumed codes. Older codes
  -- never become valid again after a newer one has been used.
  SELECT * INTO v_code FROM public.patient_portal_login_codes
    WHERE email_normalized = p_email_normalized
      AND created_at >= now() - interval '10 minutes'
    ORDER BY created_at DESC, id DESC
    LIMIT 1 FOR UPDATE;

  IF NOT FOUND OR v_code.consumed_at IS NOT NULL
     OR v_code.expires_at <= clock_timestamp() OR v_code.attempts >= 5 THEN
    RETURN NULL;
  END IF;

  IF v_code.code_hash <> p_candidate_hash THEN
    UPDATE public.patient_portal_login_codes
      SET attempts = least(v_code.attempts + 1, 10)
      WHERE id = v_code.id;
    RETURN NULL;
  END IF;

  UPDATE public.patient_portal_login_codes
    SET consumed_at = clock_timestamp() WHERE id = v_code.id;
  RETURN v_code.patient_id;
END
$$;

REVOKE ALL ON FUNCTION public.issue_patient_portal_login_code(uuid, text, text, timestamptz)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.consume_patient_portal_login_code(text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.issue_patient_portal_login_code(uuid, text, text, timestamptz)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.consume_patient_portal_login_code(text, text)
  TO service_role;
