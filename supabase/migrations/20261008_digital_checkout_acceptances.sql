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
-- El servidor NO inserta datos sanitarios ni direcciones IP en este registro.
-- Conservar conforme al plazo legal justificable de prueba contractual,
-- no indefinidamente; documentar en el RAT y política de privacidad.
