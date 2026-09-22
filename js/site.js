/* The Woodwright House: site-wide behaviour */
(function () {
  "use strict";
  var WH = window.WH;
  var $ = WH.$, $$ = WH.$$, el = WH.el, fmt = WH.fmt, CONFIG = WH.CONFIG;

  var QUOTE_KEY = "woodwright-quote-v1";
  var AREA_KEY = "woodwright-area-v1";
  var REF_KEY = "woodwright-ref-v1";
  var quote = [];
  var areaIdx = 0;

  function setLink(a, href, on) {
    a.setAttribute("aria-disabled", String(!on));
    a.href = on ? href : "#";
  }
  function orPlaceholder(v, ph) { return v ? v : ph; }
  function openDialog(d) { if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }

  /* ---------------- config text on pages ---------------- */
  WH.fillConfig = function () {
    var C = CONFIG, c = C.CONTACT;
    var map = {
      email: orPlaceholder(c.email, "[YOUR EMAIL]"),
      phone: orPlaceholder(c.phone, "[YOUR PHONE]"),
      area: orPlaceholder(c.area, "[YOUR AREA]"),
      hours: orPlaceholder(c.hours, "[YOUR HOURS]"),
      lead: orPlaceholder(C.LEAD_WEEKS, "[X]"),
      warranty: orPlaceholder(C.WARRANTY, "[YOUR TERM]"),
      depositPct: String(Math.round(C.DEPOSIT_RATE * 100)),
      areas: C.DELIVERY.map(function (d) { return d.area; }).join(", ")
    };
    $$("[data-cfg]").forEach(function (n) {
      var k = n.getAttribute("data-cfg");
      if (map[k] != null) n.textContent = map[k];
      var link = n.getAttribute("data-cfg-href");
      if (link && k === "email" && c.email) n.href = "mailto:" + c.email;
      if (link && k === "phone" && c.phone) n.href = "tel:" + c.phone.replace(/[^\d+]/g, "");
    });
    $$("[data-from]").forEach(function (n) {
      var c2 = WH.CATS[n.getAttribute("data-from")];
      if (!c2) return;
      var min = Infinity;
      c2.base.forEach(function (b) {
        c2.sizes.forEach(function (s) { min = Math.min(min, Math.round((b * s.m) / 50) * 50); });
      });
      n.textContent = "From " + fmt(min);
    });
    $$("[data-fabric]").forEach(function (n) {
      var f = WH.FABRICS[Number(n.getAttribute("data-fabric"))];
      if (f) n.style.background = f.color;
    });
    $$("[data-finish]").forEach(function (n) {
      var f = WH.FINISHES[Number(n.getAttribute("data-finish"))];
      if (f) n.style.background = f.color;
    });
  };

  /* ---------------- navigation ---------------- */
  function initNav() {
    var btn = $("#navToggle"), nav = $("#nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.getAttribute("data-nav-open") !== "true";
      nav.setAttribute("data-nav-open", String(open));
      btn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.setAttribute("data-nav-open", "false");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------- delivery ---------------- */
  function areaNow() { return CONFIG.DELIVERY[areaIdx]; }
  function estimateText() {
    var d = areaNow();
    return d.fee == null
      ? "Delivery to " + d.area + " is quoted on request."
      : "Delivery to " + d.area + ": estimated " + fmt(d.fee) + ", once per order.";
  }
  function updateEstimate() {
    $$(".area-est").forEach(function (n) { n.textContent = estimateText(); });
    $$(".area-select").forEach(function (s) { s.value = String(areaIdx); });
  }
  function initDelivery() {
    try {
      var saved = parseInt(window.localStorage.getItem(AREA_KEY), 10);
      if (saved >= 0 && saved < CONFIG.DELIVERY.length) areaIdx = saved;
    } catch (e) {}
    $$(".area-select").forEach(function (s) {
      CONFIG.DELIVERY.forEach(function (d, i) {
        var o = el("option", "", d.area);
        o.value = String(i);
        s.appendChild(o);
      });
      s.addEventListener("change", function () {
        areaIdx = parseInt(s.value, 10) || 0;
        try { window.localStorage.setItem(AREA_KEY, String(areaIdx)); } catch (e) {}
        updateEstimate();
        renderQuote();
      });
    });
    updateEstimate();
  }

  /* ---------------- quote ---------------- */
  function getRef() {
    try {
      var saved = window.localStorage.getItem(REF_KEY);
      if (saved) return saved;
    } catch (e) {}
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var ref = "WH-";
    for (var i = 0; i < 5; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
    try { window.localStorage.setItem(REF_KEY, ref); } catch (e) {}
    return ref;
  }
  function loadQuote() {
    try {
      var s = window.localStorage.getItem(QUOTE_KEY);
      if (s) {
        var a = JSON.parse(s);
        if (Array.isArray(a)) return a.filter(function (q) { return q && typeof q.name === "string" && typeof q.price === "number"; });
      }
    } catch (e) {}
    return [];
  }
  function saveQuote() {
    try { window.localStorage.setItem(QUOTE_KEY, JSON.stringify(quote)); } catch (e) {}
  }
  function itemsTotal() { return quote.reduce(function (s, q) { return s + q.price; }, 0); }
  function deliveryNow() {
    var d = areaNow();
    return quote.length && d.fee != null ? d.fee : 0;
  }
  function totalNow() { return itemsTotal() + deliveryNow(); }
  function depositNow() { return Math.round((totalNow() * CONFIG.DEPOSIT_RATE) / 10) * 10; }
  function summary() {
    var t = "Hi The Woodwright House, I would like a quote for:\n";
    quote.forEach(function (q, i) {
      t += (i + 1) + ". " + q.name + " (" + fmt(q.price) + ")" + (q.code ? " [design code " + q.code + "]" : "") + "\n";
    });
    var d = areaNow();
    t += "Delivery area: " + d.area + (d.fee != null ? " (estimated " + fmt(d.fee) + ")" : " (please quote)") + "\n";
    t += "Estimated total: " + fmt(totalNow());
    return t;
  }
  function renderQuote() {
    $$(".quote-count").forEach(function (n) { n.textContent = String(quote.length); });
    var ul = $("#items");
    if (!ul) return;
    ul.textContent = "";
    if (!quote.length) ul.appendChild(el("li", "empty", "Nothing here yet. Choose a piece in the shop and tap Add to quote."));
    quote.forEach(function (q, i) {
      var li = el("li");
      li.appendChild(el("span", "nm", q.name));
      li.appendChild(el("span", "pr", fmt(q.price)));
      var rm = el("button", "rm", "Remove");
      rm.type = "button";
      rm.setAttribute("aria-label", "Remove " + q.name);
      rm.addEventListener("click", function () {
        quote.splice(i, 1);
        saveQuote();
        renderQuote();
      });
      li.appendChild(rm);
      ul.appendChild(li);
    });
    var d = areaNow();
    $("#subtotal").textContent = fmt(itemsTotal());
    $("#areaLine").textContent = "Delivery, " + d.area;
    $("#delivery").textContent = d.fee == null ? "Quoted on request" : fmt(deliveryNow());
    $("#total").textContent = fmt(totalNow());

    var has = quote.length > 0;
    var b = CONFIG.BANK, ref = getRef();
    $("#dep").hidden = !has;
    $("#depAmt").textContent = fmt(depositNow()) + " (" + Math.round(CONFIG.DEPOSIT_RATE * 100) + "%)";
    $("#bBank").textContent = orPlaceholder(b.bank, "[YOUR BANK]");
    $("#bName").textContent = orPlaceholder(b.name, "[ACCOUNT NAME]");
    $("#bNum").textContent = orPlaceholder(b.number, "[ACCOUNT NUMBER]");
    $("#bBranch").textContent = orPlaceholder(b.branch, "[BRANCH CODE]");
    $("#bRef").textContent = ref;
    setLink($("#wa"), WH.waLink(summary()), has);
    setLink($("#paid"), WH.waLink("Hi The Woodwright House, I've paid my deposit of " + fmt(depositNow()) + ". Reference: " + ref + ". Proof of payment attached."), has);
    $("#copy").disabled = !has;
  }
  WH.addToQuote = function (item) {
    quote.push({ id: Date.now() + Math.floor(Math.random() * 1000), name: item.name, price: item.price, code: item.code });
    saveQuote();
    renderQuote();
  };
  function initQuote() {
    quote = loadQuote();
    renderQuote();
    var dlg = $("#dlg");
    if (!dlg) return;
    $("#closeQuote").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    $("#copy").addEventListener("click", function () { WH.copyText(summary(), $("#status"), "Summary copied."); });
  }
  function openQuote() {
    $("#status").textContent = "";
    renderQuote();
    openDialog($("#dlg"));
  }

  /* ---------------- swatch request ---------------- */
  function updateSwatchLink() {
    var picked = [];
    $$("#swChecks input").forEach(function (cb) { if (cb.checked) picked.push(WH.FABRICS[Number(cb.value)].label); });
    var name = $("#swName").value.trim();
    var addr = $("#swAddr").value.trim();
    var phone = $("#swPhone").value.trim();
    var ok = picked.length > 0 && name !== "" && addr !== "";
    var msg = "Hi The Woodwright House, please send me fabric swatches.\nFabrics: " + picked.join(", ") +
      "\nName: " + name + "\nDelivery address: " + addr + (phone ? "\nPhone: " + phone : "");
    setLink($("#swSend"), WH.waLink(msg), ok);
    $("#swStatus").textContent = ok ? "" : "Tick at least one fabric and add your name and address.";
  }
  function initSwatches() {
    var box = $("#swChecks");
    if (!box) return;
    WH.FABRICS.forEach(function (f, i) {
      var lab = el("label", "chk");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.value = String(i);
      var sw = el("span", "dot");
      sw.style.background = f.color;
      lab.appendChild(cb);
      lab.appendChild(sw);
      lab.appendChild(el("span", "", f.label));
      cb.addEventListener("change", updateSwatchLink);
      box.appendChild(lab);
    });
    ["#swName", "#swAddr", "#swPhone"].forEach(function (s) { $(s).addEventListener("input", updateSwatchLink); });
    var sd = $("#sdlg");
    $("#closeSw").addEventListener("click", function () { sd.close(); });
    sd.addEventListener("click", function (e) { if (e.target === sd) sd.close(); });
  }
  function openSwatches() {
    $$("#swChecks input").forEach(function (cb) { cb.checked = Number(cb.value) === WH.state.fabric; });
    updateSwatchLink();
    openDialog($("#sdlg"));
  }

  /* ---------------- gallery ---------------- */
  function tile(g, eager) {
    var fig = el("figure", "shot");
    var img = document.createElement("img");
    img.src = "images/products/" + g.file;
    img.alt = g.alt;
    img.loading = eager ? "eager" : "lazy";
    img.decoding = "async";
    if (g.crop) img.style.objectPosition = g.crop;
    fig.appendChild(img);
    fig.appendChild(el("figcaption", "", g.name));
    return fig;
  }
  /* Fills any [data-shots] element with photos. The attribute holds the
     filter: a gallery category, or "all". [data-shots-max] caps how many. */
  WH.renderShots = function (root) {
    $$("[data-shots]", root).forEach(function (n) {
      var max = Number(n.getAttribute("data-shots-max")) || 0;
      var list = WH.galleryFor(n.getAttribute("data-shots"), max);
      n.textContent = "";
      list.forEach(function (g, i) { n.appendChild(tile(g, i < 2)); });
    });
  };
  function initGallery() {
    var grid = $("#shots");
    if (!grid) return;
    var chips = $("#shotFilters");
    var current = "all";
    function draw() {
      grid.textContent = "";
      var list = WH.galleryFor(current);
      list.forEach(function (g, i) { grid.appendChild(tile(g, i < 4)); });
      $("#shotCount").textContent = list.length === 1 ? "1 piece" : list.length + " pieces";
    }
    WH.GALLERY_CATS.forEach(function (c) {
      if (c.key !== "all" && !WH.galleryFor(c.key).length) return;
      var b = el("button", "chip", c.label);
      b.type = "button";
      b.setAttribute("aria-pressed", String(c.key === current));
      b.addEventListener("click", function () {
        current = c.key;
        $$("#shotFilters .chip").forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        draw();
      });
      chips.appendChild(b);
    });
    draw();
  }
  WH.pages.gallery = { init: initGallery };

  /* ---------------- data-open triggers ---------------- */
  function initTriggers() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-open]");
      if (!t) return;
      var w = t.getAttribute("data-open");
      if (w !== "quote" && w !== "swatches") return;
      e.preventDefault();
      if (w === "quote") openQuote();
      else openSwatches();
    });
  }

  /* ---------------- contact page ---------------- */
  WH.pages.contact = {
    init: function () {
      var ids = ["#cName", "#cPhone", "#cEmail", "#cType", "#cMsg"];
      function update() {
        var name = $("#cName").value.trim(), phone = $("#cPhone").value.trim(), email = $("#cEmail").value.trim();
        var type = $("#cType").value, msg = $("#cMsg").value.trim();
        var ok = name !== "" && msg !== "" && (phone !== "" || email !== "");
        var text = "Hi The Woodwright House, my name is " + name + ".\nI'm interested in: " + type + "\n" + msg +
          (phone ? "\nPhone: " + phone : "") + (email ? "\nEmail: " + email : "");
        setLink($("#cWa"), WH.waLink(text), ok);
        var mail = $("#cMail");
        var to = CONFIG.CONTACT.email;
        setLink(mail, "mailto:" + to + "?subject=" + encodeURIComponent("Enquiry: " + type) + "&body=" + encodeURIComponent(text), ok && !!to);
        $("#cStatus").textContent = ok ? "" : "Add your name, a phone number or email, and a short message.";
      }
      ids.forEach(function (s) { $(s).addEventListener("input", update); $(s).addEventListener("change", update); });
      update();
    }
  };

  /* ---------------- start ---------------- */
  function boot() {
    WH.fillConfig();
    WH.renderShots();
    initNav();
    initDelivery();
    initQuote();
    initSwatches();
    initTriggers();
    if (WH.SPA && WH.route) WH.route();
    else if (!WH.SPA) WH.showPage(document.body.getAttribute("data-page"));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
