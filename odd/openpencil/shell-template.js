// Shell template for batch_design.script (OpenPencil MCP, QuickJS).
// PROVEN WORKING on page "Inicio". Workers: adapt sidebar widgets per page,
// then insert content sections with insert_node({parent: contentColumnId, data}).
// RULES: no top-level `return`; I(null,...) inserts at page root; bindings feed I(parent,...).
// Colors are literals; use rgba() for light-on-dark text (engine auto-contrast mangles solid whites).

const INK="#1C2B24", MUT="#5F6F66", SUB="#8A978F", PRI="#145A44", PDARK="#0E3D31",
      G100="#E4F0E8", WATER="#2E7DA6", W100="#E8F2F7", SAND="#F6F2E8", BG="#FBFAF6",
      BORDER="#E3E9E2", CARD="#FFFFFF";

function T(p, s, o){ return I(p, Object.assign({type:"text", content:s, fontSize:15, lineHeight:1.5, fontFamily:"Inter", fill:[{type:"solid",color:INK}]}, o||{})); }
function IC(p, name, size, color){ return I(p, {type:"icon_font", iconFontName:name, width:size, height:size, fill:[{type:"solid",color:color||INK}]}); }

// ---- PAGE ROOT (name it per page) ----
const page = I(null, { type:"frame", name:"PAGE_NAME", width:1200, height:0, layout:"vertical", fill:[{type:"solid",color:BG}] });

// ---- TOPBAR ----
const tb = I(page, { type:"frame", name:"Topbar", width:"fill_container", height:36, layout:"horizontal", padding:[0,80], justifyContent:"space_between", alignItems:"center", fill:[{type:"solid",color:PDARK}] });
const tbL = I(tb, { type:"frame", layout:"horizontal", gap:18, width:"fit_content", height:"fit_content", alignItems:"center" });
const loc = I(tbL, { type:"frame", layout:"horizontal", gap:6, width:"fit_content", height:"fit_content", alignItems:"center" });
IC(loc, "map-pin", 13, "rgba(255,255,255,0.85)");
T(loc, "Cuenca del río Machángara · Cuenca — Ecuador", {fontSize:12, fill:[{type:"solid",color:"rgba(255,255,255,0.85)"}]});
const ph = I(tbL, { type:"frame", layout:"horizontal", gap:6, width:"fit_content", height:"fit_content", alignItems:"center" });
IC(ph, "phone", 13, "rgba(255,255,255,0.85)");
T(ph, "(07) 4 100 000", {fontSize:12, fill:[{type:"solid",color:"rgba(255,255,255,0.85)"}]});
const tbR = I(tb, { type:"frame", layout:"horizontal", gap:14, width:"fit_content", height:"fit_content", alignItems:"center" });
var soc = ["facebook","twitter","youtube","instagram"];
for (var i=0;i<soc.length;i++){ IC(tbR, soc[i], 14, "rgba(255,255,255,0.85)"); }

// ---- NAVBAR ----
const nav = I(page, { type:"frame", name:"Navbar", width:"fill_container", height:78, layout:"horizontal", padding:[0,80], justifyContent:"space_between", alignItems:"center", fill:[{type:"solid",color:CARD}], stroke:{thickness:1, fill:[{type:"solid",color:BORDER}]} });
const logo = I(nav, { type:"frame", layout:"horizontal", gap:12, width:"fit_content", height:"fit_content", alignItems:"center" });
const mark = I(logo, { type:"frame", width:42, height:42, cornerRadius:12, layout:"horizontal", alignItems:"center", justifyContent:"center", fill:[{type:"solid",color:PDARK}] });
IC(mark, "droplet", 20, "#FFFFFF");
const word = I(logo, { type:"frame", layout:"vertical", gap:1, width:"fit_content", height:"fit_content" });
T(word, "Comité Machángara", {fontSize:18, fontWeight:700, fontFamily:"Space Grotesk", lineHeight:1.15});
T(word, "Conservación de la cuenca del río", {fontSize:11.5, fill:[{type:"solid",color:MUT}]});
const links = I(nav, { type:"frame", layout:"horizontal", gap:30, width:"fit_content", height:"fit_content", alignItems:"center" });
// ACTIVE_LINK: replace one of these labels/colors per page
const c1 = I(links, { type:"frame", layout:"horizontal", gap:5, width:"fit_content", height:"fit_content", alignItems:"center" });
T(c1, "Conócenos", {fontSize:15, fontWeight:600, fill:[{type:"solid",color:INK}]});
IC(c1, "chevron-down", 14, MUT);
T(links, "Noticias", {fontSize:15, fontWeight:600, fill:[{type:"solid",color:INK}]});
T(links, "Contacto", {fontSize:15, fontWeight:600, fill:[{type:"solid",color:INK}]});
const sb = I(nav, { type:"frame", width:38, height:38, cornerRadius:9, layout:"horizontal", alignItems:"center", justifyContent:"center", fill:[{type:"solid",color:"#F1F5F0"}] });
IC(sb, "search", 16, MUT);

// ---- BODY ROW ----
const body = I(page, { type:"frame", name:"Body", width:"fill_container", height:"fit_content", layout:"horizontal", padding:[48,80,88,80], gap:32, alignItems:"start" });

// ---- SIDEBAR ----
const side = I(body, { type:"frame", name:"Barra lateral", width:240, height:"fit_content", layout:"vertical", gap:18 });
const qa = I(side, { type:"frame", layout:"vertical", gap:2, padding:20, cornerRadius:14, fill:[{type:"solid",color:CARD}], stroke:{thickness:1, fill:[{type:"solid",color:BORDER}]} });
T(qa, "ACCESO RÁPIDO", {fontSize:11, fontWeight:700, letterSpacing:1.4, fill:[{type:"solid",color:"rgba(138,151,143,0.95)"}]});
function qaRow(name, icon, act){
  const r = I(qa, { type:"frame", width:"fill_container", height:38, layout:"horizontal", gap:12, alignItems:"center", cornerRadius:8, padding:[0,8], fill: act ? [{type:"solid",color:G100}] : [] });
  IC(r, icon, 15, act ? PRI : MUT);
  T(r, name, {fontSize:13.5, fontWeight:600, fill:[{type:"solid",color: act ? PRI : INK}], lineHeight:1.2});
  IC(r, "chevron-right", 13, SUB);
  return r;
}
qaRow("Documentos", "folder");
qaRow("Galería", "image");
qaRow("Agenda", "calendar");
// SIDEBAR_EXTRA: insert per-page widget(s) into `side` here (e.g. próximas actividades, redes)
const rr = I(side, { type:"frame", layout:"vertical", gap:12, padding:20, cornerRadius:14, fill:[{type:"solid",color:CARD}], stroke:{thickness:1, fill:[{type:"solid",color:BORDER}]} });
T(rr, "SÍGUENOS", {fontSize:11, fontWeight:700, letterSpacing:1.4, fill:[{type:"solid",color:"rgba(138,151,143,0.95)"}]});
const rrRow = I(rr, { type:"frame", layout:"horizontal", gap:10, width:"fit_content", height:"fit_content" });
for (var j=0;j<soc.length;j++){ const c = I(rrRow, {type:"frame", width:34, height:34, cornerRadius:17, layout:"horizontal", alignItems:"center", justifyContent:"center", fill:[{type:"solid",color:G100}]}); IC(c, soc[j], 15, PRI); }

// ---- CONTENT COLUMN (track this nodeId from results: it is the 2nd child of body) ----
const main = I(body, { type:"frame", name:"Contenido", width:"fill_container", height:"fit_content", layout:"vertical", gap:56 });

// ---- FOOTER ----
const ftr = I(page, { type:"frame", name:"Footer", width:"fill_container", height:"fit_content", layout:"vertical", fill:[{type:"solid",color:PDARK}] });
const fTop = I(ftr, { type:"frame", width:"fill_container", height:"fit_content", layout:"horizontal", padding:[56,80], gap:56, alignItems:"start" });
const fCol1 = I(fTop, { type:"frame", width:300, height:"fit_content", layout:"vertical", gap:14 });
const fLogo = I(fCol1, { type:"frame", layout:"horizontal", gap:12, width:"fit_content", height:"fit_content", alignItems:"center" });
const fMark = I(fLogo, { type:"frame", width:38, height:38, cornerRadius:11, layout:"horizontal", alignItems:"center", justifyContent:"center", fill:[{type:"solid",color:"rgba(255,255,255,0.12)"}] });
IC(fMark, "droplet", 18, "#FFFFFF");
T(fLogo, "Comité Machángara", {fontSize:17, fontWeight:700, fontFamily:"Space Grotesk", fill:[{type:"solid",color:"#FFFFFF"}]});
T(fCol1, "Instituciones, academia y comunidades unidas por la conservación de la subcuenca que abastece de agua a Cuenca.", {fontSize:13.5, lineHeight:1.6, width:280, textGrowth:"fixed-width", fill:[{type:"solid",color:"rgba(255,255,255,0.72)"}]});
const fSoc = I(fCol1, { type:"frame", layout:"horizontal", gap:10, width:"fit_content", height:"fit_content" });
for (var k=0;k<soc.length;k++){ const c = I(fSoc, {type:"frame", width:34, height:34, cornerRadius:17, layout:"horizontal", alignItems:"center", justifyContent:"center", fill:[{type:"solid",color:"rgba(255,255,255,0.12)"}]}); IC(c, soc[k], 15, "#FFFFFF"); }
function fCol(title, items){
  const col = I(fTop, { type:"frame", width:"fit_content", height:"fit_content", layout:"vertical", gap:12 });
  T(col, title, {fontSize:13, fontWeight:700, letterSpacing:1, fill:[{type:"solid",color:"#FFFFFF"}]});
  for (var m=0;m<items.length;m++){ T(col, items[m], {fontSize:13.5, fill:[{type:"solid",color:"rgba(255,255,255,0.72)"}]}); }
  return col;
}
fCol("Navegación", ["Inicio","Conócenos","Noticias","Contacto"]);
fCol("Acceso rápido", ["Documentos","Galería","Agenda"]);
const fCol4 = I(fTop, { type:"frame", width:240, height:"fit_content", layout:"vertical", gap:12 });
T(fCol4, "Contacto", {fontSize:13, fontWeight:700, letterSpacing:1, fill:[{type:"solid",color:"#FFFFFF"}]});
const fAddr = I(fCol4, { type:"frame", layout:"horizontal", gap:8, width:"fit_content", height:"fit_content", alignItems:"center" });
IC(fAddr, "map-pin", 14, "rgba(255,255,255,0.6)");
T(fAddr, "Av. Ordóñez Lasso s/n, Cuenca — Ecuador", {fontSize:13.5, fill:[{type:"solid",color:"rgba(255,255,255,0.72)"}]});
const fPh = I(fCol4, { type:"frame", layout:"horizontal", gap:8, width:"fit_content", height:"fit_content", alignItems:"center" });
IC(fPh, "phone", 14, "rgba(255,255,255,0.6)");
T(fPh, "(07) 4 100 000", {fontSize:13.5, fill:[{type:"solid",color:"rgba(255,255,255,0.72)"}]});
const fMail = I(fCol4, { type:"frame", layout:"horizontal", gap:8, width:"fit_content", height:"fit_content", alignItems:"center" });
IC(fMail, "mail", 14, "rgba(255,255,255,0.6)");
T(fMail, "contacto@comitemachangara.ec", {fontSize:13.5, fill:[{type:"solid",color:"rgba(255,255,255,0.72)"}]});
const fDiv = I(ftr, { type:"rectangle", width:"fill_container", height:1, fill:[{type:"solid",color:"rgba(255,255,255,0.12)"}] });
const fBot = I(ftr, { type:"frame", width:"fill_container", height:"fit_content", layout:"horizontal", padding:[18,80], justifyContent:"space_between", alignItems:"center" });
T(fBot, "© 2026 Comité de Conservación de la Cuenca del Río Machángara.", {fontSize:12.5, fill:[{type:"solid",color:"rgba(255,255,255,0.6)"}]});
const fLegal = I(fBot, { type:"frame", layout:"horizontal", gap:20, width:"fit_content", height:"fit_content" });
T(fLegal, "Aviso legal", {fontSize:12.5, fill:[{type:"solid",color:"rgba(255,255,255,0.6)"}]});
T(fLegal, "Política de privacidad", {fontSize:12.5, fill:[{type:"solid",color:"rgba(255,255,255,0.6)"}]});
