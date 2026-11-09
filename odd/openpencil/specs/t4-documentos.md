# T4 — Documentos (page index 3)

Build from scratch: standard shell (shell-template.js, NO dropdown; sidebar active row "Documentos" highlighted: bg green-100 + icon/text primary via `act` param) + header + repo + footer.

## Page header
Breadcrumb "Inicio / Documentos" 13 muted + H1 36/700 "Documentos" + sub 15.5 muted "Repositorio digital para consultar y descargar información sobre la gestión y conservación de la subcuenca."

## Repositorio (content column, gap 56)
1. **Toolbar** — search bar (frame fill_container h 48 r 10, bg #F1F5F0, stroke border, horizontal, padding [0,16], gap 10, alignItems center): search icon 15 muted + text 14.5 subtle "Buscar documentos…". Below: filter chips row (horizontal gap 10, wrap in 2 rows of 3 if needed): chips r999 padding [6,16] text 13/600 — "Todos" (bg primary, text white, ACTIVE) + "Institucionales", "Informes técnicos", "Gestión", "Acciones", "Cartografía" (bg #F1F5F0, text ink).
2. **Document list** — card (card+stroke r14, vertical, gap 0): 8 rows; each row horizontal (padding 18, gap 14, alignItems center, stroke border between rows except last). Row contents:
   - circle 40 green-100 + icon 18 primary: file-text (institucionales), bar-chart-3 (informes técnicos), folder (gestión), clipboard-list (acciones), map (cartografía)
   - col fill_container (gap 2): name 14.5/600 + meta 12.5 muted (category · size)
   - category tag r999 bg #F1F5F0 padding [3,10] text 11/600 ink
   - format badge r999 padding [3,10] text 11/700: "PDF" (bg water-100, text water), "DOCX" (bg green-100, text primary), "XLSX" (bg #F6F2E8, text ink)
   - download icon-button 36×36 r9 bg #F1F5F0 + download 15 primary
   Rows:
   1. "Estatuto del Comité de Conservación" · Institucional · PDF
   2. "Plan operativo vigente 2026" · Institucional · PDF
   3. "Informe de calidad del agua — noviembre 2026" · Informes técnicos · PDF
   4. "Estudio hidrológico de la subcuenca" · Informes técnicos · PDF
   5. "Proyecto de restauración de riberas — Sayausí" · Gestión · DOCX
   6. "Registro de acciones de guardaparques 2026" · Acciones · XLSX
   7. "Mapa de monitoreos — cuenca media" · Cartografía · PDF
   8. "Catastro de grupos de apoyo" · Gestión · XLSX
3. **Note card** — bg sand r14 padding 20: text 14 muted "Formatos disponibles: PDF, Word y Excel. Los documentos completos se vinculan desde el repositorio institucional." + link "Ver cartografía completa" 14/600 water + arrow-right.

## Sidebar
Acceso rápido with Documentos active + síguenos widget.

## Footer
Template footer.
