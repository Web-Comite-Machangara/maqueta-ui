# T6 — Agenda (page index 5)

Build from scratch: standard shell (shell-template.js, NO dropdown; sidebar active row "Agenda") + header + convocatorias + calendario + eventos + footer.

## Page header
Breadcrumb "Inicio / Agenda" 13 muted + H1 36/700 "Agenda" + sub 15.5 muted "Actividades, eventos y convocatorias del Comité. No se requiere inscripción previa."

## Sections (content column, gap 48)
1. **Convocatorias** — row gap 20, 2 banner cards (fill_container, h 130, r14, padding 24, vertical, justifyContent space_between, alignItems start, clipContent false):
   - Banner A: linear gradient fill (angle 135, #145A44 → #2E7DA6). Texts: chip r999 rgba(255,255,255,0.18) padding [4,12] text 11/700 white "CONVOCATORIA" + title 19/700 white "Minga de reforestación — margen del río Machángara" + row (calendar 13 rgba(255,255,255,0.8) + "Vie 14 nov · 08:30 · Sayausí" 12.5 rgba(255,255,255,0.8)) + arrow-up-right 16 white top-right corner (place via layout none or space_between row).
   - Banner B: same shape, fill sand + stroke border, ink texts: "CONVOCATORIA" chip bg green-100 text primary + "Monitoreo participativo de calidad del agua" + "Mar 18 nov · 09:00 · Estación Chulco".
2. **Calendario** — card (card+stroke r14, padding 24, vertical, gap 16): header row space_between: col: H2 28/700 "Noviembre 2026" + sub 13.5 muted "Calendario de actividades" · right: 2 icon-buttons 36 r9 bg #F1F5F0 (chevron-left / chevron-right 15 muted). Weekday row: 7 columns (Lun Mar Mié Jue Vie Sáb Dom) 11.5/700 subtle centered, each fill_container. 6 grid rows × 7 cells (fill_container h 52, r8, vertical center, gap 2, alignItems center): day number 13/600 ink (muted subtle for outside-month days) + dot ellipse 5 primary when event. Data (week starts Monday):
   - Row 1: 26(oct,muted) 27 28 29 30 31 1
   - Row 2: 2 3 4 5 6 7 8
   - Row 3: 9(TODAY: bg water-100, number 13/700 water) 10 11 12 13 14(event dot) 15
   - Row 4: 16 17 18(dot) 19 20 21 22
   - Row 5: 23 24 25(dot) 26 27 28 29
   - Row 6: 30 1(dic,muted) 2 3 4 5 6
   Legend row: dot 5 primary + text 12.5 muted "Actividad programada". Caption 12 subtle "Vista referencial de noviembre 2026; el calendario se actualizará con la agenda oficial."
3. **Próximas actividades** — H2 "Próximas actividades" + 3 event rows (card+stroke r14, horizontal, padding 20, gap 18, alignItems center):
   - date chip: 52×56 r10 bg water-100 vertical center: "14" 20/700 water + "NOV" 10/700 water
   - col fill_container gap 4: title 15.5/700 + row gap 14: (clock 13 muted + "08:30" 12.5 muted) · (map-pin 13 muted + "Parroquia Sayausí" 12.5 muted)
   - tag r999 padding [4,12] text 11.5/700: "Convocatoria" (bg sand, ink) / "Monitoreo" (bg water-100, water) / "Reunión" (bg green-100, primary)
   Events: "Jornada de reforestación — margen del río Machángara" · Vie 14 nov · 08:30 · Parroquia Sayausí · Convocatoria · "Monitoreo participativo de calidad del agua" · Mar 18 nov · 09:00 · Estación Chulco · Monitoreo · "Reunión ordinaria del Comité" · Mar 25 nov · 10:00 · Sala de sesiones, ETAPA EP · Reunión.

## Sidebar
Acceso rápido with Agenda active + síguenos.

## Footer
Template footer.
