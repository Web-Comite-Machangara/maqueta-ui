# T3 — Noticias (page index 2)

Build from scratch: standard shell (shell-template.js, NO dropdown; active link "Noticias" 15/600 **primary**) + header + sections + footer.

## Page header
Breadcrumb "Inicio / Noticias" 13 muted + H1 36/700 Space Grotesk "Noticias" + sub 15.5 muted "Información actualizada sobre las actividades y novedades del Comité."

## Sections (content column, gap 56)
1. **Destacada** — frame layout none h 300 r14 clipContent: image fill (query "river conservation field work", prompt "Technicians and community members working along a mountain river in the Andes, Ecuador, daytime.") + scrim rgba(14,61,49,0.42) + content frame (padding 28, vertical, justifyContent end, gap 10): chip r999 bg rgba(255,255,255,0.18) padding [4,12] text 11/700 white "COMUNICADO" + title 26/700 Space Grotesk white "Comité presenta balance de la gestión 2026 en la subcuenca" + row gap 8 (calendar 13 rgba(255,255,255,0.8) + "5 nov 2026" 12.5 rgba(255,255,255,0.8)).
2. **Noticias del Comité** — H2 "Noticias del Comité" + grid 2×2 (gap 20; cards fill_container vertical, card+stroke r14, clipContent): image h 160 fill (queries: "tree planting volunteers", "water quality lab", "rangers paramo patrol", "community workshop") + body (padding 16, gap 8): chip text 11/600 water ("GESTIÓN"/"MONITOREO"/"CONSERVACIÓN"/"COMUNIDAD") + title 15.5/600 lh1.35 + row (calendar 13 muted + date 12.5 muted):
   - "Minga de reforestación reunió a 40 voluntarios en Sayausí" · GESTIÓN · 3 nov 2026
   - "Nuevos equipos fortalecen el monitoreo de calidad del agua" · MONITOREO · 30 oct 2026
   - "Guardaparques amplían rutas de patrullaje en el páramo" · CONSERVACIÓN · 27 oct 2026
   - "Taller comunitario sobre uso eficiente del agua" · COMUNIDAD · 24 oct 2026
3. **En los medios** — H2 "En los medios" + sub 14 muted "Noticias publicadas por medios de comunicación." Row gap 20, 2 cards (fill_container, horizontal, gap 16, padding 20, card+stroke r14, alignItems center): circle 44 bg water-100 + icon 18 water ("newspaper" / "globe") + col: name 15/700 ("El Mercurio" / "El Universo") + text 13.5 muted ("Prensa regional — Cuenca" / "Prensa nacional — Guayaquil") + spacer + arrow-up-right 16 subtle. Below each: link text 14/600 water "Ver publicaciones del Comité en el medio". Caption 12 subtle "Los enlaces se activarán en el sitio funcional."
4. **Redes sociales** — H2 "Redes sociales" + row gap 24 alignItems start: left col fill_container vertical gap 16: FB embed card (header circle 32 water-100 + facebook 14 water + "Comité Machángara" 13/600 + "Facebook · hace 3 h" 11 subtle; body 13.5 lh1.5 "El calendario de actividades de noviembre ya está disponible en la sección Agenda del sitio."; divider; footer thumbs-up "156" + message-circle "23") + X embed card (circle 32 ink + twitter 14 white + "Comité Machángara" + "X · hace 1 d"; body "Compartimos el informe de caudales del mes. Disponible en el repositorio documental."; footer heart "88" + message-circle "9"). Right col 340: card (padding 20, gap 12): label "SÍGUENOS" 11/700 ls1.4 subtle + 2 rows (gap 10): icon 16 primary facebook/twitter + text 13.5/600 "Comité Machángara" / "@comite_machangara" + 2 rows youtube/instagram: "Comité Machángara" / "@comite_machangara".

## Sidebar
Template default (acceso rápido + síguenos). No extra widget.

## Footer
Template footer.
