/* Comité Machángara — maqueta funcional estática */
(function () {
  "use strict";

  var PAGES = ["inicio", "conocenos", "noticias", "documentos", "galeria", "agenda", "contacto"];
  var TITLES = {
    inicio: "Inicio",
    conocenos: "Conócenos",
    noticias: "Noticias",
    documentos: "Documentos",
    galeria: "Galería",
    agenda: "Agenda",
    contacto: "Contacto"
  };
  var BASE_TITLE = "Comité Machángara — Conservación de la cuenca del río";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function icons() { if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons(); }

  /* ---------- toast ---------- */
  var toastEl = $("#toast");
  var toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3600);
  }

  /* ---------- router ---------- */
  var currentPage = null;

  function parseHash() {
    var raw = (window.location.hash || "").replace(/^#/, "");
    var parts = raw.split("/");
    var page = parts[0] || "inicio";
    if (PAGES.indexOf(page) === -1) page = "inicio";
    return { page: page, section: parts[1] || null };
  }

  function setActiveNav(page) {
    $$(".nav-link[href]").forEach(function (link) {
      var target = (link.getAttribute("href") || "").replace("#", "");
      var active = target === page;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    var dropdownBtn = $(".dropdown-toggle");
    if (dropdownBtn) {
      var isConocenos = page === "conocenos";
      dropdownBtn.classList.toggle("is-active", isConocenos);
      if (isConocenos) dropdownBtn.setAttribute("aria-current", "page");
      else dropdownBtn.removeAttribute("aria-current");
    }
  }

  function setSidebar(page) {
    $$(".quick-link").forEach(function (link) {
      var active = link.getAttribute("data-quick") === page;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    $$("[data-only-page]").forEach(function (node) {
      node.hidden = node.getAttribute("data-only-page") !== page;
    });
  }

  function navigate(page, section) {
    if (PAGES.indexOf(page) === -1) page = "inicio";
    var hash = "#" + page;
    if (window.location.hash !== hash) {
      window.history.pushState(null, "", hash);
    }
    renderPage(page, section);
  }

  function renderPage(page, section) {
    $$(".page").forEach(function (node) {
      node.hidden = node.id !== page;
    });
    currentPage = page;
    setActiveNav(page);
    setSidebar(page);
    document.title = page === "inicio" ? BASE_TITLE : TITLES[page] + " — Comité Machángara";

    var nav = $("#nav-principal");
    if (nav) nav.classList.remove("open");
    var menuBtn = $(".menu-toggle");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");

    if (section) {
      var target = document.getElementById(section);
      if (target) {
        window.requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    icons();
  }

  function onRoute() {
    var route = parseHash();
    renderPage(route.page, route.section);
  }

  window.addEventListener("hashchange", onRoute);
  window.addEventListener("popstate", onRoute);

  /* ---------- dropdown (Conócenos) ---------- */
  var dropdownBtn = $(".dropdown-toggle");
  var dropdownItem = dropdownBtn ? dropdownBtn.closest(".nav-item") : null;
  var hoverTimer = null;

  function openDropdown(open) {
    if (!dropdownItem || !dropdownBtn) return;
    dropdownItem.classList.toggle("open", open);
    dropdownBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (dropdownBtn && dropdownItem) {
    dropdownBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      openDropdown(!dropdownItem.classList.contains("open"));
    });
    dropdownItem.addEventListener("mouseenter", function () {
      if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) {
        clearTimeout(hoverTimer);
        openDropdown(true);
      }
    });
    dropdownItem.addEventListener("mouseleave", function () {
      if (window.matchMedia("(hover: hover) and (min-width: 901px)").matches) {
        hoverTimer = setTimeout(function () { openDropdown(false); }, 160);
      }
    });
    document.addEventListener("click", function (event) {
      if (!dropdownItem.contains(event.target)) openDropdown(false);
    });
  }

  /* ---------- mobile menu ---------- */
  var menuBtn = $(".menu-toggle");
  var nav = $("#nav-principal");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = !nav.classList.contains("open");
      nav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- section links + nav ---------- */
  $$("[data-section]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var section = link.getAttribute("data-section");
      if (!section) return;
      var page = (link.getAttribute("href") || "#conocenos").replace("#", "") || "conocenos";
      event.preventDefault();
      openDropdown(false);
      if (currentPage === page) {
        var target = document.getElementById(section);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#" + page + "/" + section);
      } else {
        navigate(page, section);
      }
    });
  });

  $$(".nav-link[href], .brand[href], .footer-col a[href]").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var page = href.replace("#", "");
      if (PAGES.indexOf(page) === -1) return;
      event.preventDefault();
      if (currentPage === page) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", "#" + page);
      } else {
        navigate(page);
      }
    });
  });

  /* ---------- search shortcut ---------- */
  $$("[data-go]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var page = btn.getAttribute("data-go");
      navigate(page);
      var search = $("#doc-search");
      if (search) setTimeout(function () { search.focus(); }, 60);
    });
  });

  /* ---------- documents: search + filters ---------- */
  var docSearch = $("#doc-search");
  var docRows = $$("#doc-list .doc-row");
  var docEmpty = $("#doc-empty");
  var filterChips = $$(".chip-filter");
  var activeFilter = "todos";

  function applyDocFilters() {
    if (!docRows.length) return;
    var term = (docSearch ? docSearch.value : "").trim().toLowerCase();
    var visible = 0;
    docRows.forEach(function (row) {
      var name = (row.getAttribute("data-name") || "").toLowerCase();
      var category = row.getAttribute("data-category") || "";
      var matchTerm = !term || name.indexOf(term) !== -1 || category.toLowerCase().indexOf(term) !== -1;
      var matchCategory = activeFilter === "todos" || category === activeFilter;
      var show = matchTerm && matchCategory;
      row.hidden = !show;
      if (show) visible += 1;
    });
    if (docEmpty) docEmpty.hidden = visible !== 0;
  }

  if (docSearch) docSearch.addEventListener("input", applyDocFilters);
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeFilter = chip.getAttribute("data-filter") || "todos";
      filterChips.forEach(function (other) {
        var active = other === chip;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", active ? "true" : "false");
      });
      applyDocFilters();
    });
  });

  /* ---------- calendar ---------- */
  var calGrid = $("#cal-grid");
  if (calGrid) {
    var weeks = [
      [26, 27, 28, 29, 30, 31, 1],
      [2, 3, 4, 5, 6, 7, 8],
      [9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22],
      [23, 24, 25, 26, 27, 28, 29],
      [30, 1, 2, 3, 4, 5, 6]
    ];
    var TODAY = 9;
    var EVENTS = [13, 14, 18, 25];
    var outOfMonth = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6]];
    var isOut = function (w, d) { return outOfMonth.some(function (p) { return p[0] === w && p[1] === d; }); };
    var html = "";
    weeks.forEach(function (week, wi) {
      week.forEach(function (day, di) {
        var classes = ["cal-cell"];
        if (isOut(wi, di)) classes.push("is-out");
        if (day === TODAY && !isOut(wi, di)) classes.push("is-today");
        var hasEvent = EVENTS.indexOf(day) !== -1 && !isOut(wi, di);
        html += '<div class="' + classes.join(" ") + '" role="gridcell" aria-label="' + day + ' de noviembre de 2026' + (day === TODAY ? ', hoy' : "") + '">';
        html += "<span>" + day + "</span>";
        if (hasEvent) html += '<span class="cal-dot" aria-hidden="true"></span>';
        html += "</div>";
      });
    });
    calGrid.innerHTML = html;
  }

  /* ---------- gallery album modal ---------- */
  var GALLERY = {
    "Brigadas Forestales": [
      { src: "img/galeria/Brigadas%20Forestales/Brigada%202.jpeg", alt: "Brigadas Forestales — Brigada 2", w: 1200, h: 900 },
      { src: "img/galeria/Brigadas%20Forestales/Brigada1.jpeg", alt: "Brigadas Forestales — Brigada1", w: 960, h: 1280 },
    ],
    "Comite": [
      { src: "img/galeria/Comite/comite%201.jpeg", alt: "Comite — comite 1", w: 1200, h: 554 },
      { src: "img/galeria/Comite/comite%202.jpeg", alt: "Comite — comite 2", w: 960, h: 1280 },
      { src: "img/galeria/Comite/comite%203.jpeg", alt: "Comite — comite 3", w: 1200, h: 900 },
      { src: "img/galeria/Comite/comite%204.jpeg", alt: "Comite — comite 4", w: 1200, h: 713 },
      { src: "img/galeria/Comite/comite%205.jpeg", alt: "Comite — comite 5", w: 1200, h: 554 },
      { src: "img/galeria/Comite/comite%206.jpeg", alt: "Comite — comite 6", w: 1200, h: 551 },
      { src: "img/galeria/Comite/comite%207.jpeg", alt: "Comite — comite 7", w: 1200, h: 554 },
      { src: "img/galeria/Comite/comite%208.jpeg", alt: "Comite — comite 8", w: 1200, h: 554 },
      { src: "img/galeria/Comite/comite%209.jpeg", alt: "Comite — comite 9", w: 1200, h: 554 },
      { src: "img/galeria/Comite/comite%2010.jpeg", alt: "Comite — comite 10", w: 1200, h: 900 },
      { src: "img/galeria/Comite/comite%2011.jpeg", alt: "Comite — comite 11", w: 960, h: 1280 },
    ],
    "Fauna": [
      { src: "img/galeria/Fauna/fauna%201.jpg", alt: "Fauna — fauna 1", w: 1200, h: 900 },
      { src: "img/galeria/Fauna/fauna%202.jpg", alt: "Fauna — fauna 2", w: 1200, h: 900 },
    ],
    "Hidrometeorología": [
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%201.jpg", alt: "Hidrometeorología — hidro 1", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%202.jpeg", alt: "Hidrometeorología — hidro 2", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%203.jpg", alt: "Hidrometeorología — hidro 3", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%204.jpeg", alt: "Hidrometeorología — hidro 4", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%205.jpeg", alt: "Hidrometeorología — hidro 5", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%206.jpeg", alt: "Hidrometeorología — hidro 6", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%207.jpeg", alt: "Hidrometeorología — hidro 7", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%208.jpeg", alt: "Hidrometeorología — hidro 8", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%209.jpeg", alt: "Hidrometeorología — hidro 9", w: 1200, h: 900 },
      { src: "img/galeria/Hidrometeorologi%CC%81a/hidro%2010.jpeg", alt: "Hidrometeorología — hidro 10", w: 1176, h: 1280 },
    ],
    "Paisajes": [
      { src: "img/galeria/Paisajes/paisajes%201.jpg", alt: "Paisajes — paisajes 1", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%202.jpeg", alt: "Paisajes — paisajes 2", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%203.jpeg", alt: "Paisajes — paisajes 3", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%204.jpeg", alt: "Paisajes — paisajes 4", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%205.jpeg", alt: "Paisajes — paisajes 5", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%206.jpeg", alt: "Paisajes — paisajes 6", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%207.jpeg", alt: "Paisajes — paisajes 7", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%208.jpeg", alt: "Paisajes — paisajes 8", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%209.jpeg", alt: "Paisajes — paisajes 9", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%2010.jpeg", alt: "Paisajes — paisajes 10", w: 1200, h: 554 },
      { src: "img/galeria/Paisajes/paisajes%2011.jpeg", alt: "Paisajes — paisajes 11", w: 960, h: 1280 },
      { src: "img/galeria/Paisajes/paisajes%2012.jpeg", alt: "Paisajes — paisajes 12", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%2013.jpeg", alt: "Paisajes — paisajes 13", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%2014.jpeg", alt: "Paisajes — paisajes 14", w: 960, h: 1280 },
      { src: "img/galeria/Paisajes/paisajes%2015.jpeg", alt: "Paisajes — paisajes 15", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%2016.jpeg", alt: "Paisajes — paisajes 16", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%2017.jpeg", alt: "Paisajes — paisajes 17", w: 1200, h: 900 },
      { src: "img/galeria/Paisajes/paisajes%2018.jpeg", alt: "Paisajes — paisajes 18", w: 1200, h: 900 },
    ],
    "Produccion Agropecuaria": [
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria1.jpeg", alt: "Produccion Agropecuaria — produccion agropecuaria1", w: 960, h: 1280 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria2.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria2", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria3.jpeg", alt: "Produccion Agropecuaria — produccion agropecuaria3", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria4.jpeg", alt: "Produccion Agropecuaria — produccion agropecuaria4", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria5.jpeg", alt: "Produccion Agropecuaria — produccion agropecuaria5", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria6.jpeg", alt: "Produccion Agropecuaria — produccion agropecuaria6", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria7.jpeg", alt: "Produccion Agropecuaria — produccion agropecuaria7", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria8.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria8", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria9.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria9", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria10.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria10", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria11.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria11", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria12.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria12", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria13.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria13", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria14.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria14", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria15.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria15", w: 1200, h: 1600 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria16.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria16", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria17.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria17", w: 1200, h: 900 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria18.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria18", w: 1200, h: 1600 },
      { src: "img/galeria/Produccion%20Agropecuaria/produccion%20agropecuaria19.jpg", alt: "Produccion Agropecuaria — produccion agropecuaria19", w: 1200, h: 1600 },
    ],
  };
  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var modal = $("#album-modal");
  var modalTitle = $("#modal-title");
  var modalGrid = $("#modal-grid");
  var lastFocus = null;

  function openModal(album) {
    if (!modal) return;
    lastFocus = document.activeElement;
    if (modalTitle) modalTitle.textContent = album;
    if (modalGrid) {
      var items = GALLERY[album] || [];
      var tiles = "";
      items.forEach(function (item) {
        tiles +=
          '<figure class="gallery-tile"><img src="' + item.src +
          '" alt="' + escapeAttr(item.alt) +
          '" width="' + item.w + '" height="' + item.h +
          '" loading="lazy" decoding="async"></figure>';
      });
      modalGrid.innerHTML = tiles;
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var closeBtn = $("[data-close-modal].icon-btn", modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  $$(".album-card").forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card.getAttribute("data-album") || "Álbum");
    });
  });
  $$("[data-close-modal]").forEach(function (btn) { btn.addEventListener("click", closeModal); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
      openDropdown(false);
    }
  });

  /* ---------- contact form (demo) ---------- */
  var form = $("#contact-form");
  var formStatus = $("#form-status");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!formStatus) return;
      formStatus.hidden = false;
      formStatus.classList.remove("error");
      if (!form.checkValidity()) {
        formStatus.classList.add("error");
        formStatus.textContent = "Revisa los campos obligatorios: nombre, correo, asunto y mensaje.";
        var invalid = form.querySelector(":invalid");
        if (invalid) invalid.focus();
        return;
      }
      formStatus.textContent = "¡Gracias! Este es un formulario de demostración: en el sitio funcional el mensaje se enviará al correo institucional.";
      form.reset();
    });
  }

  /* ---------- demo links ---------- */
  $$("[data-demo]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      showToast("Enlace de demostración: se activará con el contenido oficial del Comité.");
    });
  });

  /* ---------- init ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onRoute);
  } else {
    onRoute();
  }
  icons();
})();
