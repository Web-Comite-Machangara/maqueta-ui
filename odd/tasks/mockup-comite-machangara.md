# Maqueta UI/UX — Comité de Conservación de la Cuenca del Río Machángara

Objetivo: crear una maqueta de diseño (solo UI/UX, sin funcionalidad) del sitio web del Comité en OpenPencil, con 7 páginas según el mapa de sitio del usuario.
Branch/delivery: N/A (proyecto de diseño, sin repo git). Ejecución: un subagente `gentle-ai-worker` por página, secuencial, vía CLI `op` en modo archivo (`--file`) sobre `maqueta/machangara-ui.op` (fuente de verdad; el MCP/daemon ya NO se usa). Verificación: estructural con `op get`/`op layout` (el renderer no pinta fills; el render correcto lo hace la app desktop). Cierre: `op vars`/`op page list` + guardado `.op` + export PNG desde la app desktop (manual).

## Sistema de diseño (obligatorio en todas las páginas)

Paleta: ink `#1C2B24`, muted `#5F6F66`, subtle `rgba(138,151,143,0.95)`, primary `#145A44`, dark `#0E3D31`, green-100 `#E4F0E8`, water `#2E7DA6`, water-100 `#E8F2F7`, bg `#FBFAF6`, card `#FFFFFF`, border `#E3E9E2`, sand `#F6F2E8`.

Tipografía: headings Space Grotesk 700 (28–36px, letterSpacing −0.5/−1); body Inter 15px lineHeight 1.5–1.65; labels 11px/700 letterSpacing 1.4.

Shell común por página (estructura exacta):
1. **Topbar** h36 dark `#0E3D31`, padding `[0,80]`, horizontal, space_between: izq. `map-pin` 13 + "Cuenca del río Machángara · Cuenca — Ecuador" (12px, `rgba(255,255,255,0.85)`) y `phone` 13 + "(07) 4 100 000"; der. iconos 14px `rgba(255,255,255,0.85)`: facebook, twitter, youtube, instagram.
2. **Navbar** h78 card, padding `[0,80]`, space_between, stroke border: logo (mark 42×42 r12 dark + `droplet` 20 blanco + "Comité Machángara" 18/700 Space Grotesk + "Conservación de la cuenca del río" 11.5 muted) · links 15/600: "Conócenos" (con `chevron-down` 14 muted), "Noticias", "Contacto" · search icon-button 38×38 r9 bg `#F1F5F0` (`search` 16 muted).
3. **Body** horizontal, padding `[48,80,88,80]`, gap 32, alignItems start: sidebar 240 + contenido `fill_container` (≈768px), gap 56 entre secciones.
4. **Sidebar** 240 (cards blancas r14, stroke border, padding 20): "ACCESO RÁPIDO" (rows 38px: icon 15 muted + label 13.5/600 + `chevron-right` 13) con Documentos/Galería/Agenda; widget extra según página; "SÍGUENOS" (4 círculos 34 bg green-100, icon 15 primary).
5. **Footer** dark `#0E3D31`: 4 columnas (marca+descripción+redes / Navegación: Inicio, Conócenos, Noticias, Contacto / Acceso rápido: Documentos, Galería, Agenda / Contacto: dirección, teléfono, correo), divider, barra inferior "© 2026 Comité de Conservación de la Cuenca del Río Machángara." + "Aviso legal · Política de privacidad".

Reglas técnicas (aprendidas y verificadas):
- `batch_design.script` (QuickJS): construir con `I(parent, node)`; `I(null, ...)` inserta en la raíz de la página; sin `return` top-level; helpers/funciones permitidos. Alternativa para secciones: `insert_node({parent, data})` con árbol PenNode anidado (`children`).
- **Auto-contraste del motor**: el fill SÓLIDO de un texto se ajusta contra el ancestro con fill sólido (blanco sobre fondo claro se oscurece a `#17191D`). Para texto sobre imágenes/scrims usar `rgba(255,255,255,0.95)` (los colores translúcidos no se ajustan). Corregir excepciones con `update_node` (no re-ejecuta el ajuste).
- Iconos: `icon_font` con `iconFontName` lucide kebab-case. Nunca `path` para iconos.
- `layout:"none"` solo para overlays (hero, dropdown, mapa): orden de inserción = children[0] arriba; texto/controles PRIMERO, scrim DESPUÉS, imagen/foto AL FINAL.
- Imágenes: nodo `image` con `imageSearchQuery` + `imagePrompt` obligatorios (luego se resuelven con `enrich_images`).
- Nunca `fill_container` dentro de padre `fit_content`. Cards en fila horizontal: width y height `fill_container`.
- Estructura por página: root frame 1200×h0 vertical, bg `#FBFAF6`.
- Índices de página: 0 Inicio, 1 Conócenos, 2 Noticias, 3 Documentos, 4 Galería, 5 Agenda, 6 Contacto. `set_active_page({index})` antes de editar.
- Verificar con `get_screenshot({nodeId:"root"})` (devuelve PNG base64) y leer la imagen antes de reportar.

## Specs

S1 **Inicio** — Hero (foto represa + logotipo + nombre del Comité), presentación, logros e indicadores con iconografía uniforme, bloque "Conservación de la cuenca", mapa interactivo (recorrido del río, grupos de apoyo, represas), "Noticias y redes sociales" (publicaciones de Facebook y X + noticias de medios), testimonios.

S2 **Conócenos** — Historia, Misión y visión, Qué hacemos, Acciones (4 líneas: Guardaparques, Monitoreo ambiental, Proyectos productivos para la comunidad, Brigadas contra incendios [denominación pendiente de confirmación]; descripción breve + cifras generales + enlace al repositorio documental), Logros e indicadores, Territorio y conservación (amplía el mapa de Inicio), Directorio, Miembros (11 instituciones + 1 organización con logotipos), Marco regulatorio (estatuto, plan operativo, plan de manejo del refugio de vida silvestre, ordenanzas), Videos institucionales. Navegación: menú desplegable al pasar el cursor sobre "Conócenos" con las subsecciones (mostrar el dropdown abierto en esta página).

S3 **Noticias** — noticias propias del Comité, enlaces a medios (El Mercurio, El Universo), publicaciones de redes sociales.

S4 **Documentos** — repositorio digital: documentos institucionales, informes y estudios técnicos, proyectos y documentos de gestión, acciones realizadas, cartografía; formatos PDF, Word y Excel; búsqueda y filtros por categoría.

S5 **Galería** — álbumes temáticos: Producción agropecuaria, Brigadas forestales, Fauna, Comité, Hidrometeorología, Paisajes; enlaces a videos/documentales de YouTube (p. ej. ETAPA).

S6 **Agenda** — vista de calendario, convocatorias con banners, eventos con nombre, fecha, hora y lugar. SIN sistema de inscripción.

S7 **Contacto** — formulario de contacto, información institucional y medios de comunicación disponibles.

S8 **Navegación global** — menú superior (Conócenos ▾, Noticias, Contacto), barra lateral de acceso rápido (Documentos, Galería, Agenda), logotipo como acceso a Inicio.

S9 **Diseño** — apariencia sencilla y ordenada, textos breves, espacio entre contenidos, fotografías/mapas/íconos de apoyo, sin decoración excesiva (sin patrón de ondas), espacio reservado para el logotipo oficial. Contenido con datos reales pendientes: marcar cifras con nota "Cifras de referencia de la maqueta; se actualizarán con datos oficiales del Comité." y logos con "Logotipos oficiales pendientes de entrega."

## Tasks

- T0 setup — paleta/7 páginas creadas, shell base — **hecho** (variables `set_variables`, páginas "Inicio/Conócenos/Noticias/Documentos/Galería/Agenda/Contacto").
- T1 Inicio (S1, S8, S9) — delegated (worker), **hecho**. Mapa interactivo + Noticias y redes + Testimonios + footer (worker) y Presentación + Logros + Conservación (orquestador vía MCP HTTP). Orden final: Hero, Presentación, Logros, Conservación, Mapa, Noticias y redes, Testimonios. get_design_quality: geometry 0, layout 0. Altura 3653px.
- T2 Conócenos (S2) — delegated (worker), **hecho** (en archivo `.op`: root n367 + Topbar/Navbar/Body/Footer/Dropdown; 11 secciones verificadas vía `op get`).
- T3 Noticias (S3) — delegated (worker), **hecho** (root YBRT5xtKjyR3Bp0npG-e6, 236 nodos, 5 secciones: Encabezado/Destacada/Noticias del Comité/En los medios/Redes sociales).
- T4 Documentos (S4) — delegated (worker), **hecho** (root MoTv6fKw56VdQaWJw7Q4M, 226 nodos: Encabezado + Repositorio con toolbar/chips/8 filas/nota).
- T5 Galería (S5) — delegated (worker), CLI file mode.
- T6 Agenda (S6) — delegated (worker), CLI file mode.
- T7 Contacto (S7) — delegated (worker), CLI file mode.
- T8 Cierre (S9) — inline (orquestador): screenshots finales, `finalize_design`, `enrich_images`, guardar `.op` y exportar PNGs a la carpeta del proyecto.

## Log

L1 (2026-11-09) Pedido original del usuario (enviado dos veces, texto idéntico): "este es un nuevo proyecto de diseño de interfaces. No es un sitio web funcional sino solo el diseño de ui y ux, necesito que utilices el mcp de openpencil para crear una maqueta con las siguientes características: Diseño de página web del Comité de Conservación de la Cuenca del Río Machángara — Propuesta de Mapa del Sitio Web — Jerarquía de la información: 1. Inicio (imagen principal con fotografía de una represa + nombre del Comité y logotipo; presentación breve; logros e indicadores destacados con iconografía uniforme; conservación de la cuenca; mapa interactivo con ubicación/delimitación/recorrido del río/grupos de apoyo/represas; noticias y redes sociales con publicaciones de Facebook y X + noticias de medios; testimonios). 2. Conócenos (historia; misión y visión; qué hacemos; acciones por líneas estratégicas: Guardaparques, Monitoreo ambiental, Proyectos productivos para la comunidad, Brigadas contra incendios [denominación y clasificación pendientes]; logros e indicadores; territorio y conservación que amplía el mapa; directorio; miembros: 11 instituciones y una organización con logotipos; marco regulatorio: estatuto, plan operativo vigente, plan de manejo del refugio de vida silvestre, ordenanzas; videos institucionales). 3. Noticias (propias, enlaces a medios como El Mercurio y El Universo, redes sociales). 4. Documentos (institucionales, informes y estudios técnicos, proyectos y gestión, acciones realizadas, cartografía; PDF, Word y Excel). 5. Galería (álbumes: producción agropecuaria, brigadas forestales, fauna, comité, hidrometeorología, paisajes; videos/documentales de YouTube p. ej. ETAPA). 6. Agenda (vista de calendario, convocatorias con banners, eventos con nombre/fecha/hora/lugar; sin sistema de inscripción). 7. Contacto (formulario, información institucional, medios de comunicación). Estructura de navegación: menú superior (Conócenos, Noticias, Contacto), barra lateral (Documentos, Galería, Agenda), logotipo como acceso a Inicio, dropdown en Conócenos. Consideraciones de diseño: apariencia sencilla y ordenada, textos breves, espacios, fotografías/mapas/íconos, evitar decoración excesiva (patrón de ondas anterior), espacio para el nuevo logotipo y recursos gráficos oficiales. Requiere colaboración del Comité para materiales (descripciones, logotipos de instituciones, indicadores, cartografía, documentos, fotos, testimonios, enlaces de video)."

L2 (2026-11-09) Interrupción del usuario: "te detuve porque te trabaste, necesito que separes las tareas en fragmentos con oepenspec y ejecutes por partes con subagentes". Verificación: OpenSpec NO está instalado (`openspec not found`); CLI de OpenPencil sí (`/opt/homebrew/bin/op`, daemon `running:false`); subagentes disponibles: gentle-ai-worker (escritura). Decisión: usar este documento ODD como spec equivalente en fragmentos (S#/T#) y delegar una página por subagente secuencial. Bug que trabó el trabajo: el parser de Code Mode (`execute`) rechaza ciertos programas JS; los subagentes invocan las tools MCP de OpenPencil directamente, evitando ese parser.

L3 (2026-11-09) Aprendizaje del motor OpenPencil: (1) auto-contraste sobre fills sólidos de texto contra ancestro sólido — usar rgba() sobre imágenes/scrims; (2) `update_node` conserva valores exactos (no re-ejecuta el ajuste); (3) `batch_design.script` acepta helpers y `I(parent,node)`; (4) orden de inserción en `layout:"none"` define stacking (texto → scrim → foto).

L4 (2026-11-09) El usuario instaló el CLI: `brew install zseven-w/openpencil/op` → `/opt/homebrew/bin/op` v0.7.6. Verificación: el CLI NO se conecta al daemon MCP (error "No running OpenPencil instance found"); el daemon MCP corre en 127.0.0.1:3100 (proceso `openpenci`). El CLI en modo `--file` trabaja sobre archivos `.op` sin render. Decisión: el documento MCP sigue siendo la fuente de verdad; el CLI queda disponible solo para operaciones de archivo. Subagente T1 lanzado en background (worker accede a las tools MCP vía su runtime `execute`). Los specs detalladas por página quedan en `odd/openpencil/specs/`.

L5 (2026-11-09) Renderer roto del daemon MCP: get_screenshot/export_frames NO pintan los fills (solo strokes/bordes; alpha=0 en todo el PNG). Las screenshots NO sirven para QA visual en este despliegue. Estrategia de QA: get_design_quality + snapshot_layout + read_nodes (modelo del documento). Canal alternativo verificado: el daemon habla MCP JSON-RPC sobre HTTP en 127.0.0.1:3100/mcp con session fija `mcp-session-id: openpencil` → script `odd/openpencil/verify-render.py` permite screenshots/sampling vía HTTP (también con alpha rota; el modo `fix` corrige alpha en PNGs). Las secciones faltantes de Inicio se insertaron por este canal (insert_node + move_node). El render correcto lo hace la app desktop de OpenPencil, no el daemon MCP.

L6 (2026-11-09) El usuario interrumpió el lanzamiento de T2 y pidió guardar el estado en Engram. Estado guardado (observation #687, topic `odd/mockup-comite-machangara/tasks`). T2 quedó A MEDIO: página 1 "Conócenos" con root n367 e hijos Topbar n368, Navbar n381, Body n418, Footer n446 (height 1 = incompleto) y Dropdown n396 MAL UBICADO (sibling de n367 en (450,190); debería estar dentro del navbar en y76). Plan de reanudación recomendado: eliminar n367 y reconstruir la página 1 desde `odd/openpencil/specs/t2-conocenos.md`. Pendientes: T2–T7 (una página por worker secuencial) y T8 (finalize_design, enrich_images, save .op, exports). QA solo por diagnósticos del motor (renderer del MCP no pinta fills).

L7 (2026-11-09) Cambio de herramienta pedido por el usuario: "vamos a continuar donde nos quedamos pero en lugar de usar el mcp de openpencial vamos a usar el CLI op con el archivo @maqueta/machangara-ui.op". Verificado sobre `maqueta/machangara-ui.op` (612 KB, exportado 11:32): T2 quedó COMPLETO en el archivo (root n367 con Topbar/Navbar/Body/Footer/Dropdown dentro del root; 11 secciones en Contenido n445; footer completo; dropdown n396 en (450,190) como overlay). Las páginas 2-6 siguen vacías. Toolchain CLI v0.7.6 en modo archivo (sin daemon, `op status` running:false) verificado: `op page list --file` ✓; `op get --id X --page P --file` ✓ (sin `--page` solo lee la página 1); `op insert --file --page P '<json>'` inserta en la raíz de la página (NO usar `--parent <pageId>`: se pierde el nodo); `op insert --parent <id>` para hijos ✓; `op update` merge parcial ✓; `op layout` snapshot estructural ✓; la re-serialización compacta del CLI no pierde nodos (823→825 con 2 inserts de prueba). Regla: siempre pasar `--file` y `--page` en cada comando. Patrón por página: raíz frame 1200×0 vertical bg #FBFAF6 + shell (Topbar/Navbar/Body/Sidebar/Footer) + secciones, todo con `icon_font` (sin post-process). QA estructural con `op get`. El plugin `openpencil-skill` quedó instalado en la config global de opencode (requiere restart).

L8 (2026-11-09) T3 hecho por worker (CLI). Gotcha crítico descubierto: `op insert`/`op update` RECHAZAN el tipo `icon_font` (tipos válidos: frame, group, rectangle, ellipse, line, polygon, path, text, image, ref); en cambio el DSL de `op design` (`nombre=I(padre,{json})`, una op por línea, sin `children` anidados, sin `return` top-level) SÍ acepta `icon_font` y agrega `iconFontFamily:"lucide"` automáticamente. El DSL devuelve el mapa binding→nodeId. Los ids nuevos son nanoid de 21 chars. La re-serialización del CLI agrega `iconFontFamily:"lucide"` a los iconos preexistentes (normalización aditiva, sin pérdida: n15/n16 verificados por diff). `op get --page` sin `--depth` reemplaza children por "..." (usar siempre --depth). Archivo: 612 KB → ~212 KB por re-serialización compacta (sin pérdida de nodos).
