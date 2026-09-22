/* The Woodwright House: shop page */
(function () {
  "use strict";
  var WH = window.WH;
  var $ = WH.$, el = WH.el, fmt = WH.fmt;
  var viewer = null;

  function group(container, name, items, sel, kind, onPick) {
    container.textContent = "";
    items.forEach(function (it, i) {
      var lab = el("label", "opt " + kind);
      if (kind === "sw") lab.title = it.label;
      var inp = document.createElement("input");
      inp.type = "radio";
      inp.name = name;
      inp.value = String(i);
      inp.checked = i === sel;
      if (kind === "sw") inp.setAttribute("aria-label", it.label);
      var face = el("span", "face");
      if (kind === "sw") {
        face.style.background = it.color;
      } else if (kind === "fin") {
        var dot = el("span", "dot");
        dot.style.background = it.color;
        face.appendChild(dot);
        face.appendChild(el("span", "", it.label));
      } else if (kind === "card") {
        face.appendChild(el("span", "cname", it.label));
        face.appendChild(el("span", "cdesc", it.sub));
      } else {
        face.appendChild(el("span", "", it.label));
        if (it.sub) face.appendChild(el("span", "psub", it.sub));
      }
      lab.appendChild(inp);
      lab.appendChild(face);
      inp.addEventListener("change", function () { onPick(i); });
      container.appendChild(lab);
    });
  }

  function renderTabs() {
    var nav = $("#shopTabs");
    nav.textContent = "";
    WH.ORDER.forEach(function (k) {
      var b = el("button", "tab", WH.CATS[k].label);
      b.type = "button";
      b.setAttribute("aria-pressed", String(k === WH.state.cat));
      b.addEventListener("click", function () { selectCat(k); });
      nav.appendChild(b);
    });
  }
  function renderProductOptions() {
    var s = WH.state, c = WH.CATS[s.cat];
    group($("#g-style"), "style",
      c.styles.map(function (n, i) { return { label: n, sub: c.desc[i] }; }),
      s.style, "card", function (i) { s.style = i; onProductChange(); });
    $("#sizeLegend").textContent = c.sizeLegend;
    group($("#g-size"), "size",
      c.sizes.map(function (z) { return { label: z.label, sub: z.sub }; }),
      s.size, "pill", function (i) { s.size = i; onProductChange(); });
  }
  function renderMaterialOptions() {
    var s = WH.state;
    group($("#g-fabric"), "fabric", WH.FABRICS, s.fabric, "sw", function (i) { s.fabric = i; onMaterialChange(); });
    group($("#g-finish"), "finish", WH.FINISHES, s.finish, "fin", function (i) { s.finish = i; onMaterialChange(); });
  }

  function updateText() {
    var s = WH.state, c = WH.CATS[s.cat];
    var t = WH.styleName() + " " + c.one;
    $("#title").textContent = t;
    $("#sub").textContent = "Made to order. " + c.blurb;
    $("#price").textContent = fmt(WH.priceNow());
    $("#fabricName").textContent = WH.FABRICS[s.fabric].label;
    $("#finishName").textContent = WH.FINISHES[s.finish].label;
    $("#c").setAttribute("aria-label", "3D view of a " + WH.itemName() + ". Use the arrow keys to turn it, plus and minus to zoom.");
    $("#codeLine").textContent = "Design code: " + WH.designCode();
    var hl = $("#helpList");
    hl.textContent = "";
    WH.HELP[s.cat].forEach(function (tip) { hl.appendChild(el("li", "", tip)); });
    WH.setDesignUrl();
  }
  function applyMaterials() {
    var s = WH.state;
    var fab = WH.FABRICS[s.fabric].color, fin = WH.FINISHES[s.finish].color;
    if (viewer && viewer.ok) viewer.setColors(fab, fin);
    $("#fbFabric").style.background = fab;
    $("#fbFinish").style.background = fin;
  }
  function buildModel() {
    var s = WH.state;
    if (viewer && viewer.ok) viewer.setModel(s.cat, s.style, WH.CATS[s.cat].sizes[s.size]);
  }
  function onProductChange() { updateText(); buildModel(); }
  function onMaterialChange() { applyMaterials(); updateText(); }
  function selectCat(k) {
    WH.state.cat = k;
    WH.state.style = 0;
    WH.state.size = WH.CATS[k].def;
    refreshAll();
  }
  /* Photographs of finished pieces in whichever category is on show. */
  function renderShopShots() {
    var strip = $("#shopShots");
    if (!strip) return;
    var cat = WH.CATS[WH.state.cat];
    strip.setAttribute("data-shots", WH.state.cat);
    strip.setAttribute("data-shots-max", "8");
    WH.renderShots(strip.parentNode);
    var has = strip.children.length > 0;
    strip.parentNode.hidden = !has;
    if (has) $("#madeSub").textContent = cat.label +
      " our workshops have already built. Yours is made the same way, in the size and fabric you pick above.";
  }
  function refreshAll() {
    renderTabs();
    renderProductOptions();
    renderMaterialOptions();
    applyMaterials();
    updateText();
    buildModel();
    renderShopShots();
  }

  WH.pages.shop = {
    init: function () {
      var st = $("#shareStatus");
      viewer = WH.createViewer({
        stage: $("#stage"),
        canvas: $("#c"),
        toolsEl: $("#tools"),
        hintEl: $("#hint"),
        onFail: function () {
          $("#fallback").hidden = false;
          $("#c").hidden = true;
          $("#tools").hidden = true;
          $("#hint").hidden = true;
        }
      });
      $("#add").addEventListener("click", function () {
        WH.addToQuote({ name: WH.itemName(), price: WH.priceNow(), code: WH.designCode() });
        var b = $("#add");
        b.textContent = "Added";
        setTimeout(function () { b.textContent = "Add to quote"; }, 1400);
      });
      $("#share").addEventListener("click", function () {
        var url = WH.shareUrl();
        var text = "Have a look at this from The Woodwright House: " + WH.itemName() + ". Design code: " + WH.designCode() + (url ? "\n" + url : "");
        if (navigator.share) {
          navigator.share({ title: "The Woodwright House", text: text }).catch(function () {
            WH.copyText(text, st, "Link and design code copied.");
          });
        } else {
          WH.copyText(text, st, "Link and design code copied.");
        }
      });
      $("#codeGo").addEventListener("click", function () {
        var ok = WH.applyCode($("#codeIn").value);
        st.textContent = ok ? "Design loaded." : "That code doesn't look right. It should look like bed-1-2-3-1.";
        if (ok) refreshAll();
      });
    },
    show: function (params) {
      var applied = false;
      if (params.d) applied = WH.applyCode(params.d);
      if (!applied && params.cat && WH.CATS[params.cat] && params.cat !== WH.state.cat) {
        WH.state.cat = params.cat;
        WH.state.style = 0;
        WH.state.size = WH.CATS[params.cat].def;
      }
      refreshAll();
    }
  };
})();
