# Fábrica editorial de Instagram

Implementación integrada en `/admin/articulos/` de Carolina Sánchez. En la misma ventana aparecen las pestañas **Artículos del blog** y **Fábrica Instagram**, con la misma sesión de administración. El editor de artículos original se conserva.

## Qué hace

- Crea una publicación desde un tema libre o desde el artículo que esté abierto en el editor, incluido un borrador aún no publicado.
- Permite elegir la familia **Educativa**, **Pregunta a Carolina** (marcada explícitamente como pregunta ilustrativa) o **Perspectiva profesional**, así como publicación individual o carrusel de 3 a 7 diapositivas.
- Genera título, subtítulo, texto por diapositiva, narrativa, fotografías individuales apropiadas al tema, pie, CTA, etiquetas y propuestas de texto alternativo.
- Permite editar absolutamente todo, subir imágenes propias o regenerar una fotografía concreta.
- Compone cada diapositiva con `Fraunces` y `DM Sans`, azul `#173A5E`, un único acento turquesa `#08A6A0` o coral `#F2766B`, y fondos blanco / azul claro `#EAF6FB`. El amarillo `#F6C553` queda reservado para detalles ocasionales; no se mezcla con otros acentos principales.
- Exporta PNG de **1080 × 1350 px** uno por diapositiva, agrupados en un ZIP que también contiene pie, CTA, enlace al artículo publicado, textos ALT y referencias revisadas.
- Permite crear un borrador del blog desde el contenido de Instagram (estructura editable, no se publica automáticamente).
- Guarda borradores y estado de revisión en Supabase, vinculados a artículos existentes.

La compaginación se genera en el navegador; las fotos nunca llevan tipografía creada por IA. En la cuadrícula se preservan los títulos y el desarrollo principal dentro del recorte central cuadrado.

## Activación técnica

1. Aplicar una sola vez la migración `supabase/migrations/20260925_instagram_editorial_factory.sql` en el proyecto Supabase que ya utiliza el editor de artículos.
2. Configurar `OPENAI_API_KEY` como secreto de **Cloudflare Worker portfolio-carolina**, nunca en variables públicas, código ni navegador. Esta credencial de API se factura de forma independiente al plan de ChatGPT.
3. Opcionalmente definir `OPENAI_TEXT_MODEL` y `OPENAI_IMAGE_MODEL` como variables del Worker. Los valores de partida en el código son `gpt-4.1-mini` y `gpt-image-1`.
4. Publicar el sitio mediante el flujo existente de Cloudflare. Se mantienen intactos los endpoints de Stripe y las rutas de artículos.

Sin la clave, el editor manual y las previsualizaciones funcionan, pero los botones de generación con IA muestran una advertencia y no generan contenido ni fotografías.

## Seguridad y revisión editorial

Solo el usuario administrador ya autorizado en el editor puede invocar los endpoints privados de generación. El servidor comprueba su token con Supabase. Los borradores tienen RLS y las fotografías se guardan en un bucket exclusivo. Este bucket es público en lectura porque las fotos son material destinado a publicación: **nunca introducir historias clínicas, información identificable de pacientes ni fotografías sin derechos/consentimiento**.

Las afirmaciones generadas por IA son **borradores**, no evidencia contrastada. No se generan referencias bibliográficas ficticias. El editor dispone de campo para fuentes verificadas y exige marcar revisión clínica/bibliográfica y revisión ortográfica/visual antes de exportar. El cierre de cada post conserva la decisión de publicación manual de Carolina.

## Flujo de trabajo

**Artículo → Instagram**: abrir un artículo, pulsar «Crear Instagram», elegir la familia editorial, revisar el tema y pulsar «Crear publicación completa». Si el artículo ya es público, se conserva un enlace a su versión publicada; los borradores no generan enlaces públicos falsos.

**Instagram → artículo**: redactar o generar el carrusel, revisar el contenido y pulsar «Convertir este contenido en borrador del blog». Se abre el editor existente con un esquema editable y pendiente de ampliar.

**Publicación**: revisar foto a foto, ajustar textos, verificar bibliografía, marcar las dos revisiones y descargar el ZIP. Programar o publicar Instagram se sigue realizando fuera de esta aplicación.

## Limitaciones previstas de esta primera versión

No publica ni programa automáticamente en Meta; no investiga automáticamente literatura científica en tiempo real; no genera lotes de un mes ni ofrece analíticas de Instagram. Las imágenes generadas consumen créditos de API. La vista previa utiliza fuentes web; las fuentes deben terminar de cargarse para habilitar la exportación.
