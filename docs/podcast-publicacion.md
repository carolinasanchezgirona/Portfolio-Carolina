# Psicología Incómoda · Gestión editorial

La navegación principal no cambia: se incluye Podcast en el desplegable Recursos en desktop/móvil. Cada episodio tiene su propia ruta SEO.

## Publicar el reproductor del episodio 1

Modificar app/podcast/episodes.ts para el episodio correspondiente:

- Si está en Spotify, pegar la URL pública completa de episodio en spotifyUrl, p. ej. https://open.spotify.com/episode/ID_REAL. El sistema valida el dominio y solo carga el iframe cuando el usuario pulsa reproducir.
- Alternativamente, publicar el audio MP3 en public/podcast/audio/ y poner la ruta interna (p. ej. /podcast/audio/episodio-01.mp3) en audioSrc. Requiere subir el archivo al repositorio/hosting antes de activar el enlace.
- No apuntar a enlaces de ChatGPT, carpetas privadas ni URL no verificadas.

Actualizar date, duration, description, sections y related según nuevos episodios. El sitemap incorpora las rutas estáticas desde episodes.

La ficha editorial del episodio no es una transcripción literal; solo publicar una transcripción si se ha revisado contra la grabación. La portada de la web es una composición propia basada en el retrato público de Carolina; reemplazarla por el arte oficial aprobado cuando esté subido a public/.

## Comprobaciones
- Verificar reproductor con el URL real, cookies de terceros, sonido en móvil y accesibilidad teclado.
- Verificar compilación, enlaces y pruebas antes de publicación.
- Confirmar indexabilidad de /podcast/ y del episodio en Search Console.
- Mantener CTA de cita discreto; podcast como recurso divulgativo, no diagnóstico ni orientación individual.
