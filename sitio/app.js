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
    if (page === "agenda") {
      if (!agendaInitialized) {
        agendaInitialized = true;
        initAgenda();
      } else {
        window.requestAnimationFrame(updateAgendaCarouselControls);
      }
    }
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

  /* ---------- agenda: carrusel, calendario y modal ---------- */
  var agendaInitialized = false;
  var agendaEvents = [];
  var agendaEventsByDate = {};
  var agendaViewYear = 2026;
  var agendaViewMonth = 10;
  var agendaSelectedDate = null;
  var agendaLastFocus = null;
  var agendaPageStep = 0;
  var agendaResizeObserver = null;

  function toISODate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function parseAgendaDate(value) {
    var parts = value.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatLongDate(value) {
    return parseAgendaDate(value).toLocaleDateString("es-EC", {
      day: "numeric", month: "long", year: "numeric"
    });
  }

  function formatShortDate(value) {
    return parseAgendaDate(value).toLocaleDateString("es-EC", {
      day: "numeric", month: "short", year: "numeric"
    });
  }

  function eventDateTime(event) {
    var parts = event.date.split("-");
    var time = (event.time || "00:00").split(":");
    return new Date(
      Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]),
      Number(time[0] || 0), Number(time[1] || 0)
    );
  }

  function sortAgendaEvents(a, b) {
    return eventDateTime(a) - eventDateTime(b);
  }

  function loadAgendaData() {
    var source = window.SITE_AGENDA_EVENTS || [];
    agendaEvents = source.filter(function (event) {
      return event && event.title && event.date && event.category;
    }).sort(sortAgendaEvents);
    agendaEventsByDate = {};
    agendaEvents.forEach(function (event) {
      if (!agendaEventsByDate[event.date]) agendaEventsByDate[event.date] = [];
      agendaEventsByDate[event.date].push(event);
    });
  }

  function upcomingAgendaEvents() {
    var now = new Date();
    return agendaEvents.filter(function (event) {
      return eventDateTime(event) >= now;
    });
  }

  function agendaEventsForDate(date) {
    return (agendaEventsByDate[date] || []).slice().sort(sortAgendaEvents);
  }

  function eventCategoryClass(event) {
    return event.category === "Convocatoria" ? "event-tag-sand" : "event-tag-blue";
  }

  function eventCardElement(event) {
    var card = document.createElement("article");
    card.className = "event-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", "Ver detalle de " + event.title);
    card.innerHTML =
      '<span class="event-tag ' + eventCategoryClass(event) + '">' + event.category + "</span>" +
      '<h3 class="event-title">' + event.title + "</h3>" +
      '<p class="event-meta">' +
        '<span><i data-lucide="calendar"></i> ' + formatShortDate(event.date) + "</span>" +
        '<span><i data-lucide="clock"></i> ' + event.time + "</span>" +
        '<span><i data-lucide="map-pin"></i> ' + event.place + "</span>" +
      "</p>" +
      '<span class="event-open-icon" aria-hidden="true"><i data-lucide="arrow-up-right"></i></span>';
    card.addEventListener("click", function () {
      openAgendaModal(event, card);
    });
    card.addEventListener("keydown", function (keyEvent) {
      if (keyEvent.key === "Enter" || keyEvent.key === " ") {
        keyEvent.preventDefault();
        openAgendaModal(event, card);
      }
    });
    return card;
  }

  function openAgendaModal(event, trigger) {
    var modal = $("#agenda-modal");
    var body = $("#agenda-modal-body");
    if (!modal || !body) return;
    agendaLastFocus = trigger || document.activeElement;
    body.innerHTML =
      '<span class="event-tag ' + eventCategoryClass(event) + '">' + event.category + "</span>" +
      '<h3 class="agenda-modal-title" id="agenda-modal-title">' + event.title + "</h3>" +
      '<div class="agenda-modal-meta">' +
        '<p><i data-lucide="calendar"></i> ' + formatLongDate(event.date) + "</p>" +
        '<p><i data-lucide="clock"></i> ' + event.time + "</p>" +
        '<p><i data-lucide="map-pin"></i> ' + event.place + "</p>" +
      "</div>" +
      '<p class="agenda-modal-desc">' + event.description + "</p>";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    icons();
    var closeBtn = $("[data-close-agenda-modal].icon-btn", modal);
    if (closeBtn) closeBtn.focus();
  }

  function closeAgendaModal() {
    var modal = $("#agenda-modal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (agendaLastFocus && typeof agendaLastFocus.focus === "function") {
      agendaLastFocus.focus();
    }
  }

  function renderAgendaCalendar() {
    var grid = $("#cal-grid");
    if (!grid) return;
    var title = $("#cal-title");
    var monthDate = new Date(agendaViewYear, agendaViewMonth, 1);
    var monthLabel = capitalize(monthDate.toLocaleDateString("es-EC", {
      month: "long", year: "numeric"
    }));
    if (title) title.textContent = monthLabel;
    grid.setAttribute("aria-label", "Calendario de " + monthLabel);

    var todayISO = toISODate(new Date());
    var firstDay = monthDate.getDay();
    var offset = (firstDay + 6) % 7;
    var start = new Date(agendaViewYear, agendaViewMonth, 1 - offset);
    var html = "";

    for (var i = 0; i < 42; i += 1) {
      var date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      var iso = toISODate(date);
      var inMonth = date.getMonth() === agendaViewMonth && date.getFullYear() === agendaViewYear;
      var dayEvents = inMonth ? agendaEventsForDate(iso) : [];
      var hasEvent = dayEvents.length > 0;
      var selected = iso === agendaSelectedDate;
      var today = iso === todayISO && inMonth;
      var classes = ["cal-cell"];
      if (!inMonth) classes.push("is-out");
      if (today) classes.push("is-today");
      if (selected) classes.push("is-selected");
      if (hasEvent) classes.push("has-event");
      var label = capitalize(date.toLocaleDateString("es-EC", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      }));
      if (hasEvent) label += ", con evento";
      if (selected) label += ", seleccionado";

      html += '<button type="button" class="' + classes.join(" ") + '" data-date="' + iso + '" role="gridcell" aria-label="' + label + '" aria-selected="' + (selected ? "true" : "false") + '"' + (inMonth ? "" : " disabled") + ">" +
        "<span>" + date.getDate() + "</span>" +
        (hasEvent ? '<span class="cal-dot" aria-hidden="true"></span>' : "") +
        "</button>";
    }

    grid.innerHTML = html;
    $$(".cal-cell[data-date]", grid).forEach(function (cell) {
      if (cell.disabled) return;
      cell.addEventListener("click", function () {
        agendaSelectedDate = cell.getAttribute("data-date");
        renderAgendaCalendar();
        renderAgendaSelection(agendaSelectedDate);
      });
    });
  }

  function renderAgendaCarousel(events, mode) {
    var carousel = $("#agenda-carousel");
    var track = $("#agenda-track");
    var dots = $("#agenda-dots");
    var status = $("#agenda-status");
    var reset = $("#agenda-reset");
    var controls = $(".agenda-controls");
    if (!carousel || !track) return;
    track.innerHTML = "";
    var list = events.slice().sort(sortAgendaEvents);

    if (!list.length) {
      carousel.hidden = true;
      if (dots) { dots.hidden = true; dots.innerHTML = ""; }
      if (controls) controls.hidden = true;
      if (status) {
        status.hidden = false;
        status.textContent = mode === "date"
          ? "No hay eventos programados para este día"
          : "No hay próximos eventos programados.";
      }
    } else {
      carousel.hidden = false;
      if (dots) dots.hidden = false;
      if (controls) controls.hidden = false;
      if (status) status.hidden = true;
      list.forEach(function (event) {
        track.appendChild(eventCardElement(event));
      });
    }

    if (reset) reset.hidden = !agendaSelectedDate;
    icons();
    carousel.scrollLeft = 0;
    window.requestAnimationFrame(updateAgendaCarouselControls);
  }

  function renderAgendaSelection(date) {
    var title = $("#agenda-events-title");
    if (title) title.textContent = "Eventos del " + formatLongDate(date);
    renderAgendaCarousel(agendaEventsForDate(date), "date");
  }

  function showAgendaUpcoming() {
    agendaSelectedDate = null;
    var title = $("#agenda-events-title");
    if (title) title.textContent = "Próximos eventos";
    renderAgendaCalendar();
    renderAgendaCarousel(upcomingAgendaEvents(), "upcoming");
  }

  function updateAgendaCarouselActive() {
    var carousel = $("#agenda-carousel");
    var dots = $("#agenda-dots");
    if (!carousel || !dots) return;
    var pages = dots.children.length;
    if (!pages) return;
    var maxScroll = carousel.scrollWidth - carousel.clientWidth;
    var atEnd = maxScroll > 0 && carousel.scrollLeft >= maxScroll - 2;
    var index = Math.round(carousel.scrollLeft / (agendaPageStep || 1));
    if (atEnd) index = pages - 1;
    index = Math.max(0, Math.min(pages - 1, index));
    $$(".agenda-dot", dots).forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    var prev = $("#agenda-prev");
    var next = $("#agenda-next");
    if (prev) prev.disabled = carousel.scrollLeft <= 4;
    if (next) next.disabled = atEnd;
  }

  function updateAgendaCarouselControls() {
    var carousel = $("#agenda-carousel");
    var track = $("#agenda-track");
    var dots = $("#agenda-dots");
    var prev = $("#agenda-prev");
    var next = $("#agenda-next");
    if (!carousel || !track || !dots) return;
    var cards = $$(".event-card", track);
    if (!cards.length || !carousel.clientWidth) {
      if (prev) prev.disabled = true;
      if (next) next.disabled = true;
      dots.innerHTML = "";
      return;
    }
    var gap = parseFloat(window.getComputedStyle(track).gap) || 16;
    var cardWidth = cards[0].getBoundingClientRect().width;
    if (!cardWidth) return;
    var perView = 2;
    if (window.matchMedia("(max-width: 640px)").matches) perView = 1;
    var pages = Math.max(1, Math.ceil(cards.length / perView));
    agendaPageStep = perView === 1
      ? cardWidth + gap
      : carousel.clientWidth + gap;

    dots.innerHTML = "";
    for (var i = 0; i < pages; i += 1) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "agenda-dot";
      dot.setAttribute("aria-label", "Ir a la posición " + (i + 1));
      dot.addEventListener("click", (function (page) {
        return function () {
          var max = carousel.scrollWidth - carousel.clientWidth;
          carousel.scrollTo({
            left: Math.min(page * agendaPageStep, max),
            behavior: "smooth"
          });
        };
      })(i));
      dots.appendChild(dot);
    }
    updateAgendaCarouselActive();
  }

  function initAgenda() {
    loadAgendaData();

    var calPrev = $("#cal-prev");
    var calNext = $("#cal-next");
    var carousel = $("#agenda-carousel");
    var prev = $("#agenda-prev");
    var next = $("#agenda-next");
    var reset = $("#agenda-reset");

    if (calPrev) {
      calPrev.addEventListener("click", function () {
        agendaViewMonth -= 1;
        if (agendaViewMonth < 0) { agendaViewMonth = 11; agendaViewYear -= 1; }
        showAgendaUpcoming();
      });
    }
    if (calNext) {
      calNext.addEventListener("click", function () {
        agendaViewMonth += 1;
        if (agendaViewMonth > 11) { agendaViewMonth = 0; agendaViewYear += 1; }
        showAgendaUpcoming();
      });
    }
    if (carousel) {
      carousel.addEventListener("scroll", function () {
        window.requestAnimationFrame(updateAgendaCarouselActive);
      });
    }
    if (prev && carousel) {
      prev.addEventListener("click", function () {
        carousel.scrollBy({ left: -agendaPageStep, behavior: "smooth" });
      });
    }
    if (next && carousel) {
      next.addEventListener("click", function () {
        carousel.scrollBy({ left: agendaPageStep, behavior: "smooth" });
      });
    }
    if (reset) reset.addEventListener("click", showAgendaUpcoming);

    $$("[data-close-agenda-modal]").forEach(function (el) {
      el.addEventListener("click", closeAgendaModal);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAgendaModal();
    });
    window.addEventListener("resize", function () {
      if (currentPage === "agenda") {
        window.requestAnimationFrame(updateAgendaCarouselControls);
      }
    });
    if (window.ResizeObserver && carousel && !agendaResizeObserver) {
      agendaResizeObserver = new ResizeObserver(function () {
        window.requestAnimationFrame(updateAgendaCarouselControls);
      });
      agendaResizeObserver.observe(carousel);
    }

    renderAgendaCalendar();
    renderAgendaCarousel(upcomingAgendaEvents(), "upcoming");
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
  var modalItems = [];
  var lightbox = $("#lightbox");
  var lightboxImg = $("#lightbox-img");
  var lightboxCaption = $("#lightbox-caption");
  var lightboxIndex = 0;
  var lightboxFocus = null;

  function openModal(album) {
    if (!modal) return;
    lastFocus = document.activeElement;
    if (modalTitle) modalTitle.textContent = album;
    if (modalGrid) {
      var items = GALLERY[album] || [];
      modalItems = items;
      var tiles = "";
      items.forEach(function (item, index) {
        tiles +=
          '<button class="gallery-tile" type="button" data-index="' + index +
          '" aria-label="Ampliar foto: ' + escapeAttr(item.alt) + '">' +
          '<img src="' + item.src +
          '" alt="' + escapeAttr(item.alt) +
          '" width="' + item.w + '" height="' + item.h +
          '" loading="lazy" decoding="async"></button>';
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

  function renderLightbox() {
    var item = modalItems[lightboxIndex];
    if (!item) return;
    if (lightboxImg) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
    if (lightboxCaption) {
      lightboxCaption.textContent = item.alt + " · " + (lightboxIndex + 1) + " / " + modalItems.length;
    }
    var navs = $$("[data-lightbox-prev], [data-lightbox-next]", lightbox || document);
    navs.forEach(function (btn) { btn.hidden = modalItems.length < 2; });
  }

  function openLightbox(index) {
    if (!lightbox || !modalItems.length) return;
    lightboxFocus = document.activeElement;
    lightboxIndex = index;
    renderLightbox();
    lightbox.hidden = false;
    var closeBtn = $("[data-close-lightbox].lightbox-close", lightbox);
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    if (lightboxImg) lightboxImg.removeAttribute("src");
    if (lightboxFocus && typeof lightboxFocus.focus === "function") lightboxFocus.focus();
  }

  function stepLightbox(delta) {
    if (!lightbox || lightbox.hidden) return;
    var total = modalItems.length;
    if (total < 2) return;
    lightboxIndex = (lightboxIndex + delta + total) % total;
    renderLightbox();
  }

  if (modalGrid) {
    modalGrid.addEventListener("click", function (event) {
      var tile = event.target.closest(".gallery-tile");
      if (!tile || !modalGrid.contains(tile)) return;
      openLightbox(parseInt(tile.getAttribute("data-index"), 10) || 0);
    });
  }
  $$("[data-lightbox-prev]").forEach(function (btn) {
    btn.addEventListener("click", function () { stepLightbox(-1); });
  });
  $$("[data-lightbox-next]").forEach(function (btn) {
    btn.addEventListener("click", function () { stepLightbox(1); });
  });
  $$("[data-close-lightbox]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  $$(".album-card").forEach(function (card) {
    card.addEventListener("click", function () {
      openModal(card.getAttribute("data-album") || "Álbum");
    });
  });
  $$("[data-close-modal]").forEach(function (btn) { btn.addEventListener("click", closeModal); });
  document.addEventListener("keydown", function (event) {
    if (lightbox && !lightbox.hidden) {
      if (event.key === "Escape") { closeLightbox(); return; }
      if (event.key === "ArrowLeft") { stepLightbox(-1); return; }
      if (event.key === "ArrowRight") { stepLightbox(1); return; }
    }
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
