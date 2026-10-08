-- Registro de aceptación contractual para contenidos descargables.
-- Despliegue PREVIO al código nuevo. No altera pedidos ya existentes.
-- Solo service_role puede registrar/leer aceptaciones.
CREATE TABLE IF NOT EXISTS public.digital_resource_checkout_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id uuid NOT NULL REFERENCES public.digital_resources(id) ON DELETE RESTRICT,
  stripe_session_id text NOT NULL UNIQUE
    CHECK (stripe_session_id ~ '^cs_(test|live)_[A-Za-z0-9_]+$'),
  terms_version text NOT NULL CHECK (char_length(terms_version) BETWEEN 5 AND 50),
  terms_snapshot text NOT NULL CHECK (char_length(terms_snapshot) BETWEEN 300 AND 12000),
  terms_sha256 text NOT NULL CHECK (terms_sha256 ~ '^[a-f0-9]{64}$'),
  amount_cents integer NOT NULL CHECK (amount_cents >= 50),
  currency text NOT NULL DEFAULT 'eur' CHECK (currency = 'eur'),
  terms_accepted_at timestamptz NOT NULL,
  immediate_supply_requested_at timestamptz NOT NULL,
  withdrawal_loss_acknowledged_at timestamptz NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  confirmation_email_sent_at timestamptz,
  confirmation_message_id text,
  CONSTRAINT email_timestamp_consistency CHECK (
    (confirmation_email_sent_at IS NULL AND confirmation_message_id IS NULL) OR
    (confirmation_email_sent_at IS NOT NULL AND confirmation_message_id IS NOT NULL)
  )
);

ALTER TABLE public.digital_resource_checkout_acceptances ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.digital_resource_checkout_acceptances
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.digital_resource_checkout_acceptances TO service_role;
CREATE INDEX IF NOT EXISTS digital_resource_checkout_acceptances_resource_idx
  ON public.digital_resource_checkout_acceptances(resource_id);
-- Los extremos del consentimiento, el precio y el texto contractual son inmutables;
-- el servidor solo puede completar posteriormente la constancia de confirmación.
CREATE OR REPLACE FUNCTION public.prevent_checkout_acceptance_rewrite()
RETURNS trigger
LANGUAGE plpgsql SET search_path = ''
AS $
BEGIN
  IF ROW(NEW.resource_id, NEW.stripe_session_id, NEW.terms_version, NEW.terms_snapshot,
         NEW.terms_sha256, NEW.amount_cents, NEW.currency,
         NEW.terms_accepted_at, NEW.immediate_supply_requested_at,
         NEW.withdrawal_loss_acknowledged_at, NEW.recorded_at)
     IS DISTINCT FROM
     ROW(OLD.resource_id, OLD.stripe_session_id, OLD.terms_version, OLD.terms_snapshot,
         OLD.terms_sha256, OLD.amount_cents, OLD.currency,
         OLD.terms_accepted_at, OLD.immediate_supply_requested_at,
         OLD.withdrawal_loss_acknowledged_at, OLD.recorded_at)
  THEN
    RAISE EXCEPTION 'Contract acceptance fields are immutable';
  END IF;
  IF OLD.confirmation_email_sent_at IS NOT NULL AND
     (NEW.confirmation_email_sent_at IS DISTINCT FROM OLD.confirmation_email_sent_at OR
      NEW.confirmation_message_id IS DISTINCT FROM OLD.confirmation_message_id)
  THEN
    RAISE EXCEPTION 'Contract confirmation cannot be overwritten';
  END IF;
  RETURN NEW;
END
$;
REVOKE ALL ON FUNCTION public.prevent_checkout_acceptance_rewrite() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS prevent_checkout_acceptance_rewrite ON public.digital_resource_checkout_acceptances;
CREATE TRIGGER prevent_checkout_acceptance_rewrite
  BEFORE UPDATE ON public.digital_resource_checkout_acceptances
  FOR EACH ROW EXECUTE FUNCTION public.prevent_checkout_acceptance_rewrite();

-- El servidor NO inserta datos sanitarios ni direcciones IP en este registro.
-- Conservar conforme al plazo legal justificable de prueba contractual,
-- no indefinidamente; documentar en el RAT y política de privacidad.
