/* The Woodwright House: home page hero */
(function () {
  "use strict";
  var WH = window.WH;
  var $ = WH.$, el = WH.el;
  var viewer = null;
  var fabricIdx = 2;
  var timer = null;
  var finishHex = WH.FINISHES[1].color;

  function paint() {
    if (viewer && viewer.ok) viewer.setColors(WH.FABRICS[fabricIdx].color, finishHex);
    $("#hfbFabric").style.background = WH.FABRICS[fabricIdx].color;
    var btns = document.querySelectorAll("#heroSw button");
    Array.prototype.forEach.call(btns, function (b, i) { b.setAttribute("aria-pressed", String(i === fabricIdx)); });
  }
  function stopCycle() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  WH.pages.index = {
    init: function () {
      var box = $("#heroSw");
      box.appendChild(el("span", "", "Try a fabric"));
      WH.FABRICS.forEach(function (f, i) {
        var b = el("button");
        b.type = "button";
        b.style.background = f.color;
        b.setAttribute("aria-label", f.label);
        b.title = f.label;
        b.addEventListener("click", function () {
          stopCycle();
          fabricIdx = i;
          paint();
        });
        box.appendChild(b);
      });
      viewer = WH.createViewer({
        stage: $("#heroStage"),
        canvas: $("#heroCanvas"),
        onFail: function () {
          $("#heroFallback").hidden = false;
          $("#heroCanvas").hidden = true;
        }
      });
      if (viewer.ok) viewer.setModel("bed", 1, WH.CATS.bed.sizes[2]);
      paint();
    },
    show: function () {
      stopCycle();
      if (!WH.reduce) {
        timer = setInterval(function () {
          fabricIdx = (fabricIdx + 1) % WH.FABRICS.length;
          paint();
        }, 3200);
      }
    },
    hide: stopCycle
  };
})();
