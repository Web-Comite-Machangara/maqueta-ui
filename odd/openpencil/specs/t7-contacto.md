# T7 — Contacto (page index 6)

Build from scratch: standard shell (shell-template.js, NO dropdown; active link "Contacto" 15/600 **primary**, others ink) + header + form + info cards + footer.

## Page header
Breadcrumb "Inicio / Contacto" 13 muted + H1 36/700 "Contacto" + sub 15.5 muted "Escríbenos o visita nuestras oficinas; con gusto atenderemos tu consulta."

## Sections (content column, gap 48)
1. **Formulario** — card (card+stroke r16, padding 32, vertical, gap 20):
   - label text 13/600 "Formulario de contacto"
   - 2-column row (gap 16): field group (vertical gap 8, fill_container): label 13/500 ink "Nombre completo" + text_input (width fill_container, h 48, r 10, bg #F1F5F0, stroke border, placeholder "Tu nombre"); field group: label "Correo electrónico" + text_input placeholder "tu@correo.com"
   - field group full width: label "Asunto" + select (width fill_container, h 48, r 10, bg #F1F5F0, stroke border, placeholder "Selecciona un asunto", options: [{value:"consulta",label:"Consulta general"},{value:"documentacion",label:"Documentación"},{value:"medios",label:"Medios de comunicación"},{value:"voluntariado",label:"Voluntariado"}])
   - field group: label "Mensaje" + text_area (width fill_container, h 130, r 10, bg #F1F5F0, stroke border, placeholder "Escribe tu mensaje…")
   - primary button (fill primary, text white, h 48, r 10, padding [0,26]): send icon 15 white + "Enviar mensaje" 15/600 white
   - caption 12 subtle "Formulario de la maqueta; en el sitio funcional se enviará al correo institucional."
2. **Información institucional** — row gap 24, 2 cards (fill_container, card+stroke r14, padding 24, vertical, gap 14):
   - Card A: label "INFORMACIÓN INSTITUCIONAL" 11/700 ls1.4 subtle + 3 rows (gap 12, alignItems center): circle 36 green-100 + icon 15 primary (map-pin/phone/mail) + col: label 12.5 muted + text 14/600: "Dirección" → "Av. Ordóñez Lasso s/n, Cuenca — Ecuador" · "Teléfono" → "(07) 4 100 000" · "Correo" → "contacto@comitemachangara.ec"
   - Card B: label "MEDIOS DE COMUNICACIÓN" + 4 rows (icon 16 primary + text 14/600): facebook "Comité Machángara" · twitter "@comite_machangara" · youtube "Comité Machángara" · instagram "@comite_machangara"
   - Note card (below, full width): bg sand r14 padding 20: row gap 10: clock icon 16 primary + text 14 muted "Horario de atención: lunes a viernes, de 08:00 a 17:00. Respondemos en un plazo de 5 días laborables."

## Sidebar
Template default (acceso rápido + síguenos).

## Footer
Template footer.
