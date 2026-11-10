-- Principio de mínimo privilegio: el backend clínico solo puede leer,
-- insertar y actualizar solicitudes. Ni borrado ni TRUNCATE por service_role.
-- Las aceptaciones archivadas siguen protegidas por trigger.
revoke delete, truncate, references, trigger
 on table public.clinical_simple_consents from service_role;
