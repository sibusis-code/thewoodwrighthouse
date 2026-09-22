/* The Woodwright House: 3D viewer (three.js r128) */
(function () {
  "use strict";
  var WH = window.WH;
  var clamp = WH.clamp;

  /* Rounded box: a soft-edged block, the building piece for all upholstery */
  function rbox(w, h, d, r, mat) {
    r = Math.max(0.004, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002));
    var iw = w - 2 * r, ih = h - 2 * r, id = Math.max(0.002, d - 2 * r);
    var rr = Math.max(0.001, Math.min(r, iw / 2 - 0.001, ih / 2 - 0.001));
    var x = -iw / 2, y = -ih / 2;
    var s = new THREE.Shape();
    s.moveTo(x + rr, y);
    s.lineTo(x + iw - rr, y);
    s.quadraticCurveTo(x + iw, y, x + iw, y + rr);
    s.lineTo(x + iw, y + ih - rr);
    s.quadraticCurveTo(x + iw, y + ih, x + iw - rr, y + ih);
    s.lineTo(x + rr, y + ih);
    s.quadraticCurveTo(x, y + ih, x, y + ih - rr);
    s.lineTo(x, y + rr);
    s.quadraticCurveTo(x, y, x + rr, y);
    var g = new THREE.ExtrudeGeometry(s, { depth: id, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 3, curveSegments: 6 });
    g.translate(0, 0, -id / 2);
    var m = new THREE.Mesh(g, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  }
  function leg(h, r, mat) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.6, h, 16), mat);
    m.castShadow = true;
    m.receiveShadow = true;
    m.position.y = h / 2;
    return m;
  }
  function put(g, mesh, x, y, z) {
    mesh.position.set(x, y, z);
    g.add(mesh);
    return mesh;
  }
  function ribs(g, w, H, y0, depth, z, mat) {
    var n = Math.max(4, Math.round(w / 0.17));
    var cw = w / n;
    for (var i = 0; i < n; i++) put(g, rbox(cw - 0.006, H, depth, 0.035, mat), -w / 2 + cw * (i + 0.5), y0 + H / 2, z);
  }

  var BUILD = {
    headboard: function (style, sz, M) {
      var g = new THREE.Group();
      var w = sz.w + 0.08, H = 1.0, y0 = 0.28;
      if (style === 0) put(g, rbox(w, H, 0.09, 0.035, M.fabric), 0, y0 + H / 2, 0);
      else ribs(g, w, H, y0, 0.1, 0, M.fabric);
      [-1, 1].forEach(function (s) {
        put(g, rbox(0.05, y0 + 0.25, 0.06, 0.012, M.finish), s * (w / 2 - 0.09), (y0 + 0.25) / 2, -0.005);
      });
      return g;
    },
    bed: function (style, sz, M) {
      var g = new THREE.Group();
      var w = sz.w, L = 2.0, bw = w + 0.1;
      var legH = 0.12, baseH = 0.28, mattH = 0.22;
      put(g, rbox(bw, baseH, L + 0.06, 0.04, M.fabric), 0, legH + baseH / 2, 0);
      put(g, rbox(w - 0.02, mattH, L - 0.08, 0.06, M.linen), 0, legH + baseH + mattH / 2 - 0.01, 0);
      var hbH = 0.95, hbY0 = 0.16, hz = -(L / 2 + 0.06);
      if (style === 0) put(g, rbox(bw, hbH, 0.1, 0.04, M.fabric), 0, hbY0 + hbH / 2, hz);
      else ribs(g, bw, hbH, hbY0, 0.1, hz, M.fabric);
      var top = legH + baseH + mattH - 0.01;
      var px = sz.pil === 1 ? [0] : [-Math.min(w / 4, 0.42), Math.min(w / 4, 0.42)];
      px.forEach(function (x) {
        var p = put(g, rbox(0.55, 0.14, 0.34, 0.06, M.linen), x, top + 0.07, -L / 2 + 0.3);
        p.rotation.x = -0.25;
      });
      [-1, 1].forEach(function (sx) {
        [-1, 1].forEach(function (sz2) {
          put(g, leg(legH, 0.03, M.finish), sx * (bw / 2 - 0.07), 0, sz2 * (L / 2 - 0.05));
        });
      });
      return g;
    },
    couch: function (style, sz, M) {
      var g = new THREE.Group();
      var lounge = style === 1;
      var seats = sz.seats;
      var armW = lounge ? 0.22 : 0.17;
      var innerW = seats * 0.66;
      var W = innerW + 2 * armW;
      var D = lounge ? 1.02 : 0.95;
      var legH = 0.11, baseH = 0.22, baseTop = legH + baseH;
      put(g, rbox(W, baseH, D, 0.03, M.fabric), 0, legH + baseH / 2, 0);
      var armH = lounge ? 0.42 : 0.56;
      [-1, 1].forEach(function (s) {
        put(g, rbox(armW, armH, D, 0.05, M.fabric), s * (W / 2 - armW / 2), legH + armH / 2 + 0.02, 0);
      });
      var backH = lounge ? 0.4 : 0.58;
      put(g, rbox(innerW + 0.02, backH, 0.2, 0.06, M.fabric), 0, baseTop + backH / 2, -D / 2 + 0.1);
      var cw = innerW / seats;
      for (var i = 0; i < seats; i++) {
        var cx = -innerW / 2 + cw * (i + 0.5);
        put(g, rbox(cw - 0.015, 0.16, D - 0.22, 0.05, M.fabric), cx, baseTop + 0.08, 0.1);
        var bk = put(g, rbox(cw - 0.03, lounge ? 0.3 : 0.42, 0.15, 0.06, M.fabric), cx, baseTop + 0.16 + (lounge ? 0.15 : 0.21), -D / 2 + 0.3);
        bk.rotation.x = -0.15;
      }
      [-1, 1].forEach(function (sx) {
        [-1, 1].forEach(function (sz2) {
          put(g, leg(legH, 0.03, M.finish), sx * (W / 2 - 0.09), 0, sz2 * (D / 2 - 0.09));
        });
      });
      return g;
    },
    chair: function (style, sz, M) {
      var g = new THREE.Group();
      if (style === 0) {
        [-1, 1].forEach(function (sx) {
          [-1, 1].forEach(function (sz2) { put(g, leg(0.44, 0.02, M.finish), sx * 0.185, 0, sz2 * 0.185); });
          put(g, rbox(0.035, 0.42, 0.035, 0.008, M.finish), sx * 0.185, 0.65, -0.19);
        });
        put(g, rbox(0.44, 0.05, 0.44, 0.015, M.finish), 0, 0.465, 0);
        put(g, rbox(0.43, 0.07, 0.43, 0.03, M.fabric), 0, 0.525, 0.005);
        var bk = put(g, rbox(0.42, 0.28, 0.05, 0.025, M.fabric), 0, 0.72, -0.165);
        bk.rotation.x = -0.08;
      } else {
        [-1, 1].forEach(function (sx) {
          [-1, 1].forEach(function (sz2) { put(g, leg(0.12, 0.028, M.finish), sx * 0.3, 0, sz2 * 0.28); });
        });
        put(g, rbox(0.72, 0.22, 0.7, 0.04, M.fabric), 0, 0.23, 0);
        put(g, rbox(0.6, 0.14, 0.56, 0.06, M.fabric), 0, 0.41, 0.05);
        var b2 = put(g, rbox(0.72, 0.5, 0.16, 0.07, M.fabric), 0, 0.6, -0.27);
        b2.rotation.x = -0.12;
        [-1, 1].forEach(function (sx) { put(g, rbox(0.11, 0.28, 0.66, 0.05, M.fabric), sx * 0.305, 0.5, 0); });
      }
      return g;
    }
  };

  function makeWeave() {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var x = c.getContext("2d");
    var img = x.createImageData(64, 64);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = 110 + Math.floor(Math.random() * 90);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    var t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(70, 70);
    return t;
  }

  /* o: { stage, canvas, toolsEl?, hintEl?, onFail?, auto? } */
  WH.createViewer = function (o) {
    var api = { ok: false };
    function fail() { if (o.onFail) o.onFail(); return api; }
    if (typeof window.THREE === "undefined") return fail();
    var canvas = o.canvas, stage = o.stage;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (err) { return fail(); }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
    var bsize = new THREE.Vector3(), bcenter = new THREE.Vector3(), target = new THREE.Vector3(0, 0.6, 0);
    var az = 0.7, tAz = 0.7, pol = 1.22, tPol = 1.22;
    var dist = 6, tDist = 6, baseDist = 6, zoom = 1;
    var auto = o.auto !== false && !WH.reduce;
    var grow = 1, onScreen = true, firstBuild = true, group = null;

    scene.add(new THREE.HemisphereLight(0xfff3e4, 0x8a7563, 0.72));
    var key = new THREE.DirectionalLight(0xffffff, 0.75);
    key.position.set(2.5, 4, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.0006;
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xffe8d0, 0.25);
    fill.position.set(-3, 2, -2);
    scene.add(fill);

    var floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    var rugMat = new THREE.MeshStandardMaterial({ color: 0xd6c5af, roughness: 1, metalness: 0 });
    var rug = new THREE.Mesh(new THREE.CircleGeometry(1, 72), rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.y = 0.002;
    rug.receiveShadow = true;
    scene.add(rug);

    var weave = makeWeave();
    var M = {
      fabric: new THREE.MeshStandardMaterial({ color: 0xb98e72, roughness: 0.95, metalness: 0, bumpMap: weave, bumpScale: 0.6 }),
      finish: new THREE.MeshStandardMaterial({ color: 0x5b3f2f, roughness: 0.55, metalness: 0.02 }),
      linen: new THREE.MeshStandardMaterial({ color: 0xefe9de, roughness: 1, metalness: 0, bumpMap: weave, bumpScale: 0.4 })
    };

    function readRug() {
      var v = getComputedStyle(document.documentElement).getPropertyValue("--rug").trim();
      rugMat.color.set(v || "#D6C5AF");
    }
    readRug();
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", readRug);
    }
    new MutationObserver(readRug).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    function fitDistance() {
      var r = bsize.length() / 2;
      var vf = camera.fov * Math.PI / 180;
      var hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
      var ang = Math.min(vf, hf);
      baseDist = (r / Math.sin(ang / 2)) * 0.82;
      tDist = baseDist * zoom;
    }
    function resize() {
      var r = stage.getBoundingClientRect();
      var w = Math.max(200, r.width), h = Math.max(200, r.height);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fitDistance();
    }
    function stopAuto() {
      auto = false;
      if (o.hintEl) o.hintEl.classList.add("gone");
    }
    function setZoom(z) {
      zoom = clamp(z, 0.55, 1.5);
      tDist = baseDist * zoom;
    }
    function setView(a, p) {
      var d = Math.atan2(Math.sin(a - tAz), Math.cos(a - tAz));
      tAz += d;
      tPol = p;
      stopAuto();
    }

    api.setColors = function (fabricHex, finishHex) {
      M.fabric.color.set(fabricHex);
      M.finish.color.set(finishHex);
    };
    api.setModel = function (cat, style, size) {
      if (group) {
        scene.remove(group);
        group.traverse(function (obj) { if (obj.geometry) obj.geometry.dispose(); });
      }
      group = BUILD[cat](style, size, M);
      scene.add(group);
      var box = new THREE.Box3().setFromObject(group);
      box.getSize(bsize);
      box.getCenter(bcenter);
      target.set(0, bcenter.y * 0.95, 0);
      rug.scale.setScalar(Math.max(bsize.x, bsize.z) * 0.72 + 0.3);
      fitDistance();
      if (firstBuild) { dist = tDist; firstBuild = false; }
      grow = WH.reduce ? 1 : 0.92;
      group.scale.setScalar(grow);
    };
    api.turn = function (a) { tAz += a; };
    api.stopAuto = stopAuto;

    /* controls */
    var ptrs = new Map();
    var lastPinch = 0;
    function pinch() {
      var pts = Array.from(ptrs.values());
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }
    canvas.addEventListener("pointerdown", function (e) {
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stopAuto();
      if (ptrs.size === 2) lastPinch = pinch();
    });
    canvas.addEventListener("pointermove", function (e) {
      var p = ptrs.get(e.pointerId);
      if (!p) return;
      var dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (ptrs.size === 1) {
        tAz -= dx * 0.008;
        tPol = clamp(tPol - dy * 0.006, 0.45, 1.5);
      } else if (ptrs.size === 2) {
        var d = pinch();
        if (lastPinch && d) setZoom(zoom * lastPinch / d);
        lastPinch = d;
      }
    });
    function end(e) { ptrs.delete(e.pointerId); lastPinch = 0; }
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("wheel", function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      setZoom(zoom * (1 + e.deltaY * 0.01));
    }, { passive: false });
    canvas.addEventListener("keydown", function (e) {
      var k = e.key, used = true;
      if (k === "ArrowLeft") tAz -= 0.15;
      else if (k === "ArrowRight") tAz += 0.15;
      else if (k === "ArrowUp") tPol = clamp(tPol - 0.1, 0.45, 1.5);
      else if (k === "ArrowDown") tPol = clamp(tPol + 0.1, 0.45, 1.5);
      else if (k === "+" || k === "=") setZoom(zoom * 0.9);
      else if (k === "-") setZoom(zoom * 1.1);
      else used = false;
      if (used) { e.preventDefault(); stopAuto(); }
    });
    if (o.toolsEl) {
      o.toolsEl.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        var v = b.getAttribute("data-view"), z = b.getAttribute("data-zoom");
        if (v === "front") setView(0, 1.36);
        else if (v === "side") setView(Math.PI / 2, 1.42);
        else if (v === "angle") setView(0.7, 1.22);
        if (z === "in") setZoom(zoom * 0.85);
        if (z === "out") setZoom(zoom / 0.85);
        stopAuto();
      });
    }

    if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
    window.addEventListener("resize", resize);
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; }).observe(stage);
    }
    resize();

    function frame() {
      requestAnimationFrame(frame);
      if (!onScreen || document.hidden || !group) return;
      if (auto) tAz += 0.004;
      az += (tAz - az) * 0.14;
      pol += (tPol - pol) * 0.14;
      dist += (tDist - dist) * 0.14;
      if (grow < 1) {
        grow = Math.min(1, grow + 0.014);
        group.scale.setScalar(grow);
      }
      var sp = Math.sin(pol);
      camera.position.set(
        target.x + dist * sp * Math.sin(az),
        target.y + dist * Math.cos(pol),
        target.z + dist * sp * Math.cos(az)
      );
      camera.lookAt(target);
      renderer.render(scene, camera);
    }
    frame();

    api.ok = true;
    return api;
  };
})();
