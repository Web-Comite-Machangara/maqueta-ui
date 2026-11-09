# T2 — Conócenos (page index 1)

Build the full page from scratch: shell (with OPEN DROPDOWN navbar variant) + page header + 10 sections + footer.

## Navbar variant (dropdown demo)
Instead of the auto-layout navbar in shell-template.js, build the navbar as a frame `layout:"none"`, width fill_container, height 78, fill card, stroke border. Children (explicit x/y):
- Logo lockup at x80 y18: mark 42×42 r12 dark + droplet 20 white + wordmark ("Comité Machángara" 18/700 Space Grotesk + "Conservación de la cuenca del río" 11.5 muted).
- Links row (horizontal frame, gap 30, width fit_content) at x460 y26, alignItems center:
  - "Conócenos" 15/600 **primary** (ACTIVE) + chevron-down 14 primary
  - "Noticias" 15/600 ink
  - "Contacto" 15/600 ink
- Search icon-button 38×38 r9 bg #F1F5F0 at x1082 y20.
- Dropdown panel (inserted LAST so it renders on top): frame layout "none" at x450 y76, width 262, height fit_content, fill card, cornerRadius 12, stroke border, effects shadow (offsetY 4, blur 12, rgba(0,0,0,0.08)), padding [8,0]. Inside: a vertical frame with 10 rows (height 36, horizontal, padding [0,14], alignItems center): text 13.5/600 ink. Items in order: Historia · Misión y visión · Qué hacemos · Acciones · Logros e indicadores · Territorio y conservación · Directorio · Miembros · Marco regulatorio · Videos institucionales.

## Page header (first content section)
Breadcrumb text 13 muted "Inicio / Conócenos" + H1 36/700 Space Grotesk "Conócenos" + paragraph 15.5 muted width fill_container: "Historia, organización, objetivos y actividades del Comité de Conservación de la Cuenca del Río Machángara."

## Sections (content column, gap 56)
1. **Historia** — H2 "Historia". Row (gap 28, alignItems start): left col fill_container: 2 paragraphs 15/1.6 ("El Comité nace de la articulación entre instituciones públicas y privadas, la academia y las comunidades de la subcuenca, con el propósito de coordinar acciones para su conservación y manejo sostenible." y "Desde entonces, impulsa una gestión participativa del territorio que abastece de agua a Cuenca, integrando el trabajo de guardaparques, técnicos y organizaciones locales.") + image 340×280 r14 (query "andean dam landscape", prompt "Historic concrete dam and reservoir surrounded by green Andean mountains near Cuenca, Ecuador, soft morning light.").
2. **Misión y visión** — H2. Row gap 20, 2 cards (fill_container, padding 24, gap 12, card+stroke, r14): icon circle 44 green-100 + target 19 primary + "Misión" 18/700 + text 14.5 muted lh1.55 "Coordinar la conservación y el manejo sostenible de la cuenca del río Machángara, garantizando la calidad y disponibilidad del agua para las presentes y futuras generaciones." ; icon eye + "Visión" + "Una cuenca protegida, con ecosistemas sanos y comunidades comprometidas con la gestión responsable del agua y el territorio."
3. **Qué hacemos** — H2 "Qué hacemos" + paragraph 15 muted "Funciones generales del Comité:" + 3 bullet rows (circle 32 green-100 + icon 14 primary + text 14.5/600): leaf "Coordinar acciones de conservación y restauración del territorio" · activity "Impulsar el monitoreo ambiental participativo" · users "Articular a las instituciones y comunidades de la subcuenca".
4. **Acciones** — H2 "Acciones" + sub 14 muted "Actividades organizadas según las líneas estratégicas del Comité. La información detallada está disponible en el repositorio documental." Grid 2×2 (2 rows of 2, gap 20; cards fill_container, padding 24, gap 14, card+stroke r14): header row (icon circle 44 green-100 + icon 19 primary + col: title 17/700 + note chip where indicated), desc 14.5 muted lh1.55, mini-stats row (2 chips: bg #F1F5F0 r8 padding [8,14]: number 18/700 primary + label 11.5 muted), link text 14/600 water "Ver en el repositorio documental" + arrow-right 14 water.
   - shield · "Guardaparques" · "Patrullaje y protección de páramos, fuentes de agua y áreas de conservación." · "38 guardaparques activos" · "12 rutas de patrullaje"
   - activity · "Monitoreo ambiental" · "Medición periódica de calidad y cantidad del agua en la subcuenca." · "14 estaciones" · "3 campañas al año"
   - sprout · "Proyectos productivos para la comunidad" · "Iniciativas agropecuarias sostenibles que reducen la presión sobre el agua y el suelo." · "9 comunidades" · "6 proyectos activos"
   - flame · "Brigadas contra incendios" · "Prevención y respuesta ante incendios forestales en la subcuenca." · "4 brigadas" · "120 voluntarios" · chip note: r999 bg sand padding [4,10] text 10.5/600 ink "Denominación por confirmar"
5. **Logros e indicadores** — H2 + row gap 20 of 4 stat cards (same pattern as Inicio): users "11 + 1" "Instituciones y organizaciones" · mountain "≈ 325" "km² de subcuenca conservada" · shield "4" "Líneas estratégicas" · award "12" "Años de gestión" + caption 12 subtle "Cifras de referencia de la maqueta; se actualizarán con datos oficiales del Comité."
6. **Territorio y conservación** — H2 "Territorio y conservación" + sub 14 muted "Ampliación del mapa interactivo de Inicio: puntos señalados, actividades y su aporte a la conservación." Map card (same map style as T1: bg #EDF2EE, r12, h 380, river + 2 tributaries + contours + 5 numbered markers: ellipse 26 fill primary stroke white 2 + number text 13/700 white centered at same position; markers at (300,30) "1", (360,150) "2", (395,290) "3", (150,120) "4", (540,210) "5"). Below: list of 5 point rows (gap 10, padding 16, bg #F1F5F0 r12): chip circle 24 primary with number white 12/700 + col: title 14.5/600 + desc 13.5 muted:
   1. "Represas Chanlud, Rircay y Labrado" — "Infraestructura de captación y generación; zona de trabajo de ETAPA EP."
   2. "Cauce medio del río" — "Monitoreo continuo de caudales y calidad del agua."
   3. "Zona de páramo alto" — "Protección de fuentes de agua y vegetación nativa."
   4. "Grupo de apoyo Sayausí" — "Mingas de reforestación y educación ambiental."
   5. "Grupo de apoyo Sinincay" — "Vigilancia comunitaria y control de incendios."
7. **Directorio** — H2 "Directorio" + sub 14 muted "Estructura y representantes del Comité." Row gap 20, 4 cards (fill_container, padding 20, gap 10, card+stroke r14, alignItems center via vertical): avatar circle 48 green-100 + initials 15/700 primary, name 15/600 "Nombre y apellido", role 13 muted "Presidente" / "Secretaría técnica" / "Vocal institucional" / "Coordinación de campo", org 12.5 subtle "Institución miembro" ×4. Caption 12 subtle "Nombres de referencia; se completarán con el directorio oficial."
8. **Miembros** — H2 "Miembros" + sub 14 muted "Las 11 instituciones y una organización que conforman el Comité." Grid 3×4 (3 rows of 4, gap 16; tiles fill_container, padding 20, vertical center, gap 8, card+stroke r12): icon circle 40 green-100 + icon 16 primary + name 12.5/600 ink centered. Tiles: droplet "ETAPA EP" · zap "ELECAUSTRO" · landmark "Universidad de Cuenca" · graduation-cap "Universidad del Azuay" · building-2 "Prefectura del Azuay" · landmark "Municipio de Cuenca" · leaf "EMAC EP" · shield "MAATE" · waves "Junta de regantes" · building "GAD parroquial" · flower-2 "Herbario Azuay" · users "Organización comunitaria". Caption 12 subtle "Logotipos y descripciones oficiales pendientes de entrega."
9. **Marco regulatorio** — H2 + 4 doc rows (gap 0, card+stroke r14, vertical): each row horizontal (padding 18, gap 14, alignItems center, stroke border on all but last): file-text icon 18 primary in circle 40 green-100 + col: name 14.5/600 + meta 12.5 muted + badge r999 bg water-100 padding [3,10] text 11/600 water "PDF" + arrow-up-right 15 subtle at right (space_between). Docs: "Estatuto del Comité de Conservación" — "Documento institucional · PDF" · "Plan operativo vigente" — "Planificación 2026 · PDF" · "Plan de manejo del Refugio de Vida Silvestre Machángara" — "Gestión del área protegida · PDF" · "Ordenanzas municipales relacionadas" — "Normativa local · PDF". Below: link "Ver todos los documentos en el repositorio" 14/600 water + arrow-right.
10. **Videos institucionales** — H2 + row gap 20, 3 cards (fill_container, r14, clipContent): frame layout none h 190: image fill 100% (queries "river conservation documentary", "paramo wildlife footage", "community water project") + scrim rect rgba(14,61,49,0.35) + play button center (circle 52 white + play 20 primary) + duration chip bottom-right (r999 rgba(0,0,0,0.55), padding [4,10], text 11.5 white "4:32"/"8:05"/"6:18") + below (vertical gap 4 padding 14): title 14.5/600 ("Así protegemos la cuenca", "Vida en el páramo", "Agua para Cuenca") + meta 12.5 muted ("ETAPA EP · YouTube" / "Universidad de Cuenca · YouTube" / "Comité Machángara · YouTube").

## Footer
Same as shell-template.js footer (insert at page root).

## Notes
- Sidebar: template default (acceso rápido + síguenos), no extra widget.
- Active link: Conócenos primary.
- Dropdown overlaps the breadcrumb/header area — expected (hover-state demo).
- All copy above is exact; do not reword.
