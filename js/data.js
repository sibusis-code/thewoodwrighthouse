/* The Woodwright House: shared data, settings and helpers */
(function () {
  "use strict";
  var WH = (window.WH = window.WH || {});
  WH.pages = {};

  /* ------------------------------------------------------------------
     YOUR DETAILS. Fill these in and the whole site updates.
     Prices and delivery fees below are SAMPLES. Replace them with
     your real workshop prices and rates.
     ------------------------------------------------------------------ */
  WH.CONFIG = {
    WHATSAPP: "",       // Your number with country code, digits only, e.g. 27XXXXXXXXX. Empty: the customer picks the contact.
    LEAD_WEEKS: "",     // e.g. "6 to 8". Empty shows [X].
    WARRANTY: "",       // e.g. "12 months". Empty shows [YOUR TERM].
    DEPOSIT_RATE: 0.5,  // 0.5 = 50%
    CONTACT: { email: "sales@thewoodwrighthouse.co.za", phone: "", area: "", hours: "" },
    BANK: { bank: "", name: "", number: "", branch: "" },
    DELIVERY: [
      { area: "Midrand", fee: 450 },
      { area: "Centurion", fee: 450 },
      { area: "Sandton", fee: 550 },
      { area: "Randburg", fee: 550 },
      { area: "Elsewhere in Gauteng", fee: 900 },
      { area: "Outside Gauteng", fee: null } // null = quoted on request
    ]
  };

  WH.CATS = {
    headboard: {
      label: "Headboards", one: "headboard", def: 1,
      blurb: "Upholstered on timber legs, sized to your bed.",
      styles: ["Panel", "Channel"],
      desc: ["Smooth, clean lines", "Vertical ribs"],
      base: [2200, 2700], sizeLegend: "Bed size",
      sizes: [
        { label: "Single", sub: "91 cm", w: 0.91, m: 0.75 },
        { label: "Double", sub: "137 cm", w: 1.37, m: 1 },
        { label: "Queen", sub: "152 cm", w: 1.52, m: 1.15 },
        { label: "King", sub: "183 cm", w: 1.83, m: 1.35 }
      ]
    },
    bed: {
      label: "Beds", one: "bed", def: 1,
      blurb: "A complete upholstered bed with headboard.",
      styles: ["Panel", "Channel"],
      desc: ["Smooth headboard", "Ribbed headboard"],
      base: [6500, 7400], sizeLegend: "Bed size",
      sizes: [
        { label: "Single", sub: "91 cm", w: 0.91, m: 0.75, pil: 1 },
        { label: "Double", sub: "137 cm", w: 1.37, m: 1, pil: 2 },
        { label: "Queen", sub: "152 cm", w: 1.52, m: 1.15, pil: 2 },
        { label: "King", sub: "183 cm", w: 1.83, m: 1.35, pil: 2 }
      ]
    },
    couch: {
      label: "Couches", one: "couch", def: 1,
      blurb: "Made in your size and fabric.",
      styles: ["Block", "Lounge"],
      desc: ["Square arms, high back", "Low back, wide arms"],
      base: [9500, 11500], sizeLegend: "Seats",
      sizes: [
        { label: "2-seater", sub: "", seats: 2, m: 1 },
        { label: "3-seater", sub: "", seats: 3, m: 1.3 }
      ]
    },
    chair: {
      label: "Chairs", one: "chair", def: 0,
      blurb: "Sold singly or in sets.",
      styles: ["Dining", "Accent"],
      desc: ["Upholstered dining chair", "Armchair with arms"],
      base: [1350, 3800], sizeLegend: "Quantity",
      sizes: [
        { label: "1 chair", sub: "", q: 1, m: 1 },
        { label: "Set of 2", sub: "", q: 2, m: 2 },
        { label: "Set of 4", sub: "", q: 4, m: 4 },
        { label: "Set of 6", sub: "", q: 6, m: 6 }
      ]
    }
  };
  WH.ORDER = ["headboard", "bed", "couch", "chair"];
  WH.FABRICS = [
    { label: "Oat", color: "#DCCFB9" },
    { label: "Mushroom", color: "#A8968A" },
    { label: "Clay", color: "#B98E72" },
    { label: "Cocoa", color: "#6F5140" },
    { label: "Stone", color: "#C8BFB2" },
    { label: "Charcoal", color: "#3B3532" }
  ];
  WH.FINISHES = [
    { label: "Natural oak", color: "#C9A77C" },
    { label: "Walnut", color: "#5B3F2F" },
    { label: "Ebony", color: "#2B2320" }
  ];

  /* ------------------------------------------------------------------
     THE GALLERY. Photographs of finished pieces, shown on gallery.html,
     on the home page and beside the 3D shop.
       file  the image in images/products/
       cats  which filters it appears under. A piece can sit under more
             than one, so a bed with a fine headboard shows under both.
       crop  optional CSS object-position, to steer the crop of a photo
             whose subject sits off-centre.
     To add a piece: drop the photo in images/products/ and add a line.
     ------------------------------------------------------------------ */
  WH.GALLERY = [
    /* Beds and headboards */
    { file: "bed-channel-oat.jpg", cats: ["bed", "headboard"], name: "Channel bed, oat",
      alt: "A cream upholstered bed frame with a deep vertically ribbed headboard and matching foot end." },
    { file: "bed-platform-tan.jpg", cats: ["bed", "headboard"], name: "Platform bed, tan",
      alt: "A tan upholstered platform bed with a softly rounded headboard, in a light bedroom." },
    { file: "bed-boucle-bubble-cream.jpg", cats: ["bed"], name: "Bubble bed, cream bouclé",
      alt: "A cream bouclé bed with a rounded headboard and a bubbled, cushioned surround." },
    { file: "bed-storage-lift-stone.jpg", cats: ["bed"], name: "Storage bed, stone",
      alt: "A stone upholstered bed with the base lifted on gas struts to show the storage underneath." },

    /* Couches */
    { file: "couch-curved-boucle-caramel.jpg", cats: ["couch"], name: "Curved couch, caramel bouclé",
      alt: "A caramel bouclé couch with rounded arms and a curved back, on short timber feet." },
    { file: "couch-channel-plinth-oat.jpg", cats: ["couch"], name: "Channel couch, oat on walnut",
      alt: "A long oat channel-tufted couch on a walnut plinth, against a white brick wall." },
    { file: "couch-serpentine-ivory.jpg", cats: ["couch"], name: "Serpentine couch, ivory",
      alt: "An ivory curved serpentine couch with a deep rolled back." },
    { file: "couch-kidney-curved-stone.jpg", cats: ["couch"], name: "Kidney couch, stone",
      alt: "A stone curved kidney-shaped couch with scatter cushions in a living room." },
    { file: "couch-chaise-sectional-cream.jpg", cats: ["couch"], name: "Chaise sectional, cream",
      alt: "A cream sectional couch with a rounded chaise end, on slim oak legs." },
    { file: "couch-sectional-channel-navy.jpg", cats: ["couch"], name: "Corner sectional, navy",
      alt: "A large navy channel-tufted corner sectional on a black metal base." },
    { file: "couch-channel-blue-grey.jpg", cats: ["couch"], name: "Channel couch, blue grey",
      alt: "A blue-grey channel-tufted couch with rounded arms on a dark plinth." },
    { file: "couch-modular-channel-cream.jpg", cats: ["couch"], name: "Modular couch, cream",
      alt: "A low cream channel-tufted modular couch with a separate open end section." },
    { file: "couch-classic-oat.jpg", cats: ["couch", "chair"], name: "Classic couch and tub chair, oat",
      alt: "An oat three-seater couch beside a cream bouclé tub chair on oak legs." },
    { file: "couch-lounge-suite-sand.jpg", cats: ["couch", "chair"], name: "Lounge suite, sand",
      alt: "A sand lounge suite: a three-seater couch with two matching armchairs on timber legs." },

    /* Chairs */
    { file: "chair-boucle-armchair-green-cream.jpg", cats: ["chair"], name: "Bouclé armchair, green and cream",
      alt: "A rounded armchair in olive green and cream bouclé on splayed oak legs." },
    { file: "chair-armchair-ottoman-olive-pair.jpg", cats: ["chair"], name: "Armchair and ottoman, olive",
      alt: "A pair of olive green armchairs with matching ottomans on dark timber legs." },
    { file: "chair-fluted-tub-olive-pair.jpg", cats: ["chair"], name: "Fluted tub chair, olive",
      alt: "Two olive green tub chairs with deep fluted outer backs and loose cushions." },
    { file: "chair-curved-tub-two-tone.jpg", cats: ["chair"], name: "Curved tub chair, two tone",
      alt: "A curved tub chair in sand with a contrasting cocoa trim sweeping over the back." },
    { file: "chair-swivel-tub-brass-base.jpg", cats: ["chair"], name: "Swivel tub chair, brass base",
      alt: "A taupe swivel tub chair with a tan outer back on a brushed brass base." },
    { file: "chair-boucle-swivel-cuddle-grey.jpg", cats: ["chair"], name: "Cuddle swivel chair, grey",
      alt: "A wide round grey bouclé swivel chair with a loose back cushion." },
    { file: "chair-sherpa-round-brass-legs.jpg", cats: ["chair"], name: "Round sherpa chair, ivory",
      alt: "A round ivory sherpa chair with a tubular back roll on slim brass legs." },
    /* These two are screenshots with an app icon in one corner. The crop
       pushes that corner out of frame; replace them with clean photos
       when you have them. See README.txt, IMAGES. */
    { file: "chair-petal-tub-emerald.jpg", cats: ["chair"], name: "Petal tub chair, emerald",
      alt: "An emerald green tub chair with a petalled, segmented back and a round seat.",
      crop: "center 78%" },
    { file: "chair-boucle-vanity-swivel-ivory.jpg", cats: ["chair"], name: "Vanity swivel chair, ivory",
      alt: "A small ivory bouclé vanity chair with a curved wrap-around back.",
      crop: "center 22%" },

    /* Other pieces */
    { file: "ottoman-boucle-round-oak-legs.jpg", cats: ["other"], name: "Round ottoman, ivory bouclé",
      alt: "Three round ivory bouclé ottomans of stepped heights on tapered oak legs." },
    { file: "mirror-wavy-boucle-ivory.png", cats: ["other"], name: "Wavy floor mirror, ivory",
      alt: "A tall wavy-edged floor mirror in an ivory upholstered frame, leaning against a wall." }
  ];
  WH.GALLERY_CATS = [
    { key: "all", label: "Everything" },
    { key: "headboard", label: "Headboards" },
    { key: "bed", label: "Beds" },
    { key: "couch", label: "Couches" },
    { key: "chair", label: "Chairs" },
    { key: "other", label: "Other pieces" }
  ];
  WH.galleryFor = function (cat, limit) {
    var out = WH.GALLERY.filter(function (g) {
      return !cat || cat === "all" || g.cats.indexOf(cat) !== -1;
    });
    return limit ? out.slice(0, limit) : out;
  };

  WH.HELP = {
    headboard: [
      "Measure the width of your mattress and pick the matching size.",
      "Single 91 cm, Double 137 cm, Queen 152 cm, King 183 cm.",
      "Not sure? Most couples choose a Queen or a King."
    ],
    bed: [
      "Measure the width of your mattress and pick the matching size.",
      "Single 91 cm, Double 137 cm, Queen 152 cm, King 183 cm.",
      "Leave about 60 cm of walkway on the sides you get in and out of bed."
    ],
    couch: [
      "A 2-seater suits two people, or a smaller room.",
      "A 3-seater gives three people room to sit properly.",
      "Measure your space and your doorways first. Widths are approximate until the workshop confirms them."
    ],
    chair: [
      "Allow about 60 cm of table edge for each chair.",
      "Sets of 4 and 6 suit most dining tables. Order a spare if you often host."
    ]
  };

  /* ---------------- helpers ---------------- */
  WH.$ = function (s, root) { return (root || document).querySelector(s); };
  WH.$$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  WH.el = function (tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  WH.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  WH.fmt = function (n) { return "R" + Math.round(n || 0).toLocaleString("en-ZA"); };
  WH.reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  WH.waLink = function (text) {
    var n = String(WH.CONFIG.WHATSAPP || "").replace(/\D/g, "");
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(text);
  };
  WH.copyText = function (text, statusEl, okMsg) {
    function fail() { statusEl.textContent = "Couldn't copy. Please select the text and copy it yourself."; }
    try {
      navigator.clipboard.writeText(text).then(function () { statusEl.textContent = okMsg; }, fail);
    } catch (e) { fail(); }
  };
  WH.params = function () {
    var q = window.location.search || "";
    var h = window.location.hash || "";
    if (!q && h.indexOf("?") > -1) q = "?" + h.split("?")[1];
    var out = {};
    q.replace(/^\?/, "").split("&").forEach(function (kv) {
      if (!kv) return;
      var p = kv.split("=");
      try { out[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ""); } catch (e) {}
    });
    return out;
  };

  /* ---------------- the current design ---------------- */
  WH.state = { cat: "headboard", style: 0, size: 1, fabric: 0, finish: 1 };
  WH.priceNow = function () {
    var c = WH.CATS[WH.state.cat];
    return Math.round((c.base[WH.state.style] * c.sizes[WH.state.size].m) / 50) * 50;
  };
  WH.styleName = function () { return WH.CATS[WH.state.cat].styles[WH.state.style]; };
  WH.itemName = function () {
    var s = WH.state, c = WH.CATS[s.cat], sz = c.sizes[s.size], st = WH.styleName(), core;
    if (s.cat === "chair") core = sz.q === 1 ? st + " chair" : st + " chairs, set of " + sz.q;
    else if (s.cat === "couch") core = sz.label + " " + st + " couch";
    else core = sz.label + " " + st + " " + c.one;
    return core + ", " + WH.FABRICS[s.fabric].label + " fabric, " + WH.FINISHES[s.finish].label + " legs";
  };
  WH.designCode = function () {
    var s = WH.state;
    return [s.cat, s.style, s.size, s.fabric, s.finish].join("-");
  };
  WH.applyCode = function (code) {
    var p = String(code || "").trim().toLowerCase().split("-");
    if (p.length !== 5 || !WH.CATS[p[0]]) return false;
    var c = WH.CATS[p[0]];
    var n = p.slice(1).map(Number);
    for (var i = 0; i < n.length; i++) { if (!Number.isInteger(n[i]) || n[i] < 0) return false; }
    if (n[0] >= c.styles.length || n[1] >= c.sizes.length || n[2] >= WH.FABRICS.length || n[3] >= WH.FINISHES.length) return false;
    WH.state.cat = p[0];
    WH.state.style = n[0];
    WH.state.size = n[1];
    WH.state.fabric = n[2];
    WH.state.finish = n[3];
    return true;
  };
  WH.shareUrl = function () {
    var code = WH.designCode();
    try {
      var base = window.location.href.split("#")[0].split("?")[0];
      return WH.SPA ? base + "#/shop?d=" + code : base.replace(/[^/]*$/, "") + "shop.html?d=" + code;
    } catch (e) { return ""; }
  };
  WH.setDesignUrl = function () {
    try {
      var code = WH.designCode();
      if (WH.SPA) window.history.replaceState(null, "", "#/shop?d=" + code);
      else window.history.replaceState(null, "", "?d=" + code);
    } catch (e) {}
  };

  /* ---------------- page lifecycle ---------------- */
  WH.showPage = function (slug) {
    var p = WH.pages[slug];
    if (!p) return;
    if (!p.inited) { p.inited = true; if (p.init) p.init(); }
    if (p.show) p.show(WH.params());
  };
})();
