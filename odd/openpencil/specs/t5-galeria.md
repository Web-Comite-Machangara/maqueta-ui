# T5 — Galería (page index 4)

Build from scratch: standard shell (shell-template.js, NO dropdown; sidebar active row "Galería") + header + albums + videos + footer.

## Page header
Breadcrumb "Inicio / Galería" 13 muted + H1 36/700 "Galería" + sub 15.5 muted "Imágenes organizadas en álbumes temáticos y material audiovisual de los miembros del Comité."

## Álbumes (content column, gap 56)
1. H2 "Álbumes temáticos" + grid 2×3 (2 rows of 3, gap 20). Album card: frame vertical r14 clipContent card+stroke: image h 170 fill (query + prompt per album) + body (padding 14, gap 6): title 15/700 + row space_between: count 12.5 muted "24 fotografías" + chevron-right 14 subtle.
   - "Producción agropecuaria" · query "andean agriculture fields", prompt "Smallholder crop fields and greenhouses in a rural Andean valley near Cuenca, Ecuador."
   - "Brigadas forestales" · query "forest fire brigade", prompt "Forest brigade volunteers in protective gear walking a trail through Andean forest, Ecuador."
   - "Fauna" · query "andean wildlife", prompt "Wildlife of the Andean paramo, e.g. a spectacled bear or condor in its natural habitat."
   - "Comité" · query "community meeting", prompt "Community meeting in a rural parish hall in the Andes, people listening to a speaker."
   - "Hidrometeorología" · query "weather station mountains", prompt "Weather monitoring station on a grassy mountainside in the Andes with sensors and datalogger."
   - "Paisajes" · query "andean river landscape", prompt "Scenic landscape of a mountain river valley with green slopes and blue sky in the Andes."
2. **Videos y documentales** — H2 "Videos y documentales" + sub 14 muted "Material audiovisual alojado en YouTube por los miembros del Comité." Row gap 20, 3 cards (fill_container, vertical, r14, clipContent, card+stroke): frame layout none h 180: image fill (queries "river documentary film", "paramo documentary", "water management documentary") + scrim rgba(14,61,49,0.35) + play circle 52 white + play 20 primary centered + duration chip bottom-right r999 rgba(0,0,0,0.55) padding [4,10] text 11.5 white ("5:47"/"9:12"/"7:30") + body (padding 14, gap 6): title 14.5/600 + meta 12.5 muted with channel chip:
   - "La cuenca del Machángara" · "ETAPA EP · YouTube"
   - "Guardianes del páramo" · "Universidad de Cuenca · YouTube"
   - "El agua que bebemos" · "Comité Machángara · YouTube"

## Sidebar
Acceso rápido with Galería active + síguenos.

## Footer
Template footer.
