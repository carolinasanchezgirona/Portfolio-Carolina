# Ampliación de la Fábrica Instagram en Admin

Ruta existente: `/admin/articulos/` → pestaña **Fábrica Instagram**. No se crea una aplicación separada ni se modifica el editor del blog.

## Incluido en esta rama
- Selector de formato: automático, post, carrusel, story (guion visual) y reel (guion + storyboard).
- Objetivos: automático, alcance, interacción, guardados, visitas web, leads, consultas y promoción de recursos.
- Enfoques: educativo, identificación, autoridad, preguntas, objeciones, microherramienta, perspectiva profesional y humor.
- Humor: automático, ninguno, toque, protagonista, ironía inteligente, cotidiano/absurdo.
- Intensidad comercial suave, equilibrada o directa. Los nuevos ajustes se guardan en `instagram_posts.content.strategy`, sin cambiar la estructura de la tabla.
- Campo para hook y guion; «Sorpréndeme» propone temas que evita repetir de la biblioteca reciente.
- El servidor valida los parámetros y los utiliza en la instrucción del generador con cautelas de rigor clínico y humor respetuoso.

## Alcance real de formatos
La exportación PNG existente sigue siendo 1080 × 1350 para **post/carrusel**. Story/Reel generan borradores de secuencia/guion y storyboard editable; se bloquea expresamente su exportación gráfica para impedir archivos 4:5 etiquetados como 9:16. La generación y montaje de vídeo, composición vertical 9:16, programación automática en Instagram, análisis de conversiones y creación por lotes quedan fuera de esta rama.

## Activación
Los endpoints del Worker siguen requiriendo `OPENAI_API_KEY` configurada en secreto de Cloudflare y sesión de administradora. La migración inicial de la Fábrica Instagram sigue siendo necesaria si aún no se aplicó. Revisar visualmente la integración y la generación en el entorno de pruebas antes de desplegar en producción.
