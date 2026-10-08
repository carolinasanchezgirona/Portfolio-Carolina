-- Applied and verified on 2026-10-08 in project grgyvdxkjdstdyumdfyg.
-- Least privilege, separate from RLS: TRUNCATE and certain schema privileges
-- are not governed by row-level access policies.
-- Preserve authenticated DML protected by owner-only RLS; preserve service_role.
DO $$
DECLARE clinical_table record;
BEGIN
  FOR clinical_table IN
    SELECT c.relname AS name
    FROM pg_catalog.pg_class AS c
    JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p')
      AND c.relname LIKE 'clinical\_%' ESCAPE '\'
  LOOP
    EXECUTE format(
      'REVOKE ALL PRIVILEGES ON TABLE public.%I FROM PUBLIC, anon',
      clinical_table.name
    );
    EXECUTE format(
      'REVOKE TRUNCATE, TRIGGER, REFERENCES ON TABLE public.%I FROM authenticated',
      clinical_table.name
    );
  END LOOP;
END $$;
