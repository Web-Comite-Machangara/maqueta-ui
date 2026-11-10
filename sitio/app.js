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

  /* ---------- videos institucionales ---------- */
  function getYouTubeId(url) {
    try {
      var parsed = new URL(url, window.location.href);
      var host = parsed.hostname.replace(/^www\./, "");
      if (host === "youtu.be") return parsed.pathname.split("/")[1] || null;
      if (host === "youtube.com" || host === "m.youtube.com") {
        if (parsed.searchParams.get("v")) return parsed.searchParams.get("v");
        var match = parsed.pathname.match(/\/(?:embed|shorts)\/([^/?#]+)/);
        if (match) return match[1];
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  function loadVideoMetadata(url, card) {
    if (!window.fetch) return;
    var titleEl = card.querySelector(".video-title");
    var metaEl = card.querySelector(".video-meta");
    // Endpoint oEmbed compatible con CORS; devuelve los metadatos de YouTube.
    var endpoint = "https://noembed.com/embed?url=" + encodeURIComponent(url);
    fetch(endpoint)
      .then(function (response) {
        if (!response.ok) throw new Error("metadata");
        return response.json();
      })
      .then(function (data) {
        if (data && data.title) titleEl.textContent = data.title;
        if (data && data.author_name) metaEl.textContent = data.author_name;
      })
      .catch(function () {
        // Se mantienen los textos discretos de respaldo.
      });
  }

  function renderVideos() {
    var grid = $("#video-grid");
    if (!grid) return;
    var urls = (window.SITE_VIDEOS || []).filter(function (url) {
      return typeof url === "string" && url.trim();
    });
    grid.innerHTML = "";
    urls.forEach(function (url) {
      var id = getYouTubeId(url);
      if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      var card = document.createElement("a");
      card.className = "video-card";
      card.href = url;
      card.target = "_blank";
      card.rel = "noopener";
      card.innerHTML =
        '<div class="video-thumb media">' +
          '<img class="video-thumb-img" src="https://i.ytimg.com/vi/' + id + '/hqdefault.jpg" alt="" loading="lazy" />' +
          '<span class="play-btn"><i data-lucide="play"></i></span>' +
        '</div>' +
        '<div class="video-body">' +
          '<h3 class="video-title">Video institucional</h3>' +
          '<p class="video-meta">YouTube</p>' +
        '</div>';
      grid.appendChild(card);
      loadVideoMetadata(url, card);
    });
    icons();
  }

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
    var section = parts[1] || null;
    if (page === "conocenos" && !section) section = "historia";
    return { page: page, section: section };
  }

  function setActiveNav(page) {
    $$(".nav-link[href]").forEach(function (link) {
      var target = (link.getAttribute("href") || "").replace("#", "").split("/")[0];
      var active = target === page;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    var dropdownBtn = $(".dropdown-toggle");
    if (dropdownBtn) {
      dropdownBtn.classList.toggle("is-active", page === "conocenos");
      dropdownBtn.removeAttribute("aria-current");
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
    if (page === "conocenos" && !section) section = "historia";
    var hash = "#" + page;
    if (page === "conocenos" && section) hash += "/" + section;
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
      var page = href.replace("#", "").split("/")[0];
      if (PAGES.indexOf(page) === -1) return;
      event.preventDefault();
      openDropdown(false);
      if (currentPage === page) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        history.replaceState(null, "", href);
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

  /* ---------- document accordion (Marco regulatorio) ---------- */
  $$(".doc-toggle").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
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
  var modal = $("#album-modal");
  var modalTitle = $("#modal-title");
  var modalGrid = $("#modal-grid");
  var lastFocus = null;

  function openModal(album) {
    if (!modal) return;
    lastFocus = document.activeElement;
    if (modalTitle) modalTitle.textContent = album;
    if (modalGrid) {
      var tiles = "";
      for (var i = 1; i <= 9; i += 1) {
        tiles += '<span class="media" style="min-height:110px" aria-hidden="true"><span>Fotografía ' + i + "</span></span>";
      }
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
  function init() {
    renderVideos();
    onRoute();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  icons();
})();
