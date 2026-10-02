(function(){
  /* ---------------- Helpers ---------------- */
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mainMQ = window.matchMedia("(min-width: 992px)");
  function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
  function lerpKF(p, k0, v0, k1, v1){ var t = clamp((p*100 - k0)/(k1 - k0), 0, 1); return v0 + (v1 - v0)*t; }
  // Progress (0–1) of an element scrolling through the viewport, with optional start/end offsets in %
  function inViewProgress(el, o){
    var r = el.getBoundingClientRect(), d = window.innerHeight, s = document.documentElement.scrollHeight;
    var so = (o.addStart ? o.start : 0)/100, eo = (o.addEnd ? o.end : 0)/100;
    so = o.startsEntering ? so : 1 - so; eo = o.startsExiting ? eo : 1 - eo;
    var l = r.top + Math.min(r.height*so, d);
    var f = Math.min(d + (r.top + r.height*eo - l), s);
    return f > 0 ? Math.min(Math.max(0, d - l), f)/f : 0;
  }
  // Smoothed values: each frame moves h = 1 - smoothing of the way to the target
  function Param(start, smoothing){ return {cur:start, tgt:start, h:Math.max(1 - smoothing, .01)}; }
  var P = {
    glowX: Param(.5,.75), hx: Param(.5,.75), hy: Param(.5,.75),
    g1: Param(0,.75), g2: Param(0,.75), work: Param(0,.5), attr: Param(0,.5)
  };

  var navGlow = document.getElementById("navGlow");
  var navbarContainer = document.getElementById("navbarContainer");
  var hoverImgs = Array.prototype.slice.call(document.querySelectorAll(".underline-hover-image"));
  var glance1 = document.getElementById("glance1"), glance2 = document.getElementById("glance2");
  var work = document.getElementById("work"), carousel = document.getElementById("carousel"), list = document.getElementById("projectsList");
  var strips = Array.prototype.slice.call(document.querySelectorAll(".project-attributes-list"));
  var logos = document.getElementById("logos");

  /* ---------------- Render loop ---------------- */
  var raf = 0;
  function kick(){ if(!raf) raf = requestAnimationFrame(frame); }
  function step(p){ var h = reduceMQ.matches ? 1 : p.h; p.cur += (p.tgt - p.cur)*h; if(Math.abs(p.tgt - p.cur) < 1e-4) p.cur = p.tgt; return p.cur !== p.tgt; }
  function readScroll(){
    P.g1.tgt = inViewProgress(glance1, {startsEntering:true, startsExiting:false});
    P.g2.tgt = inViewProgress(glance2, {startsEntering:true, startsExiting:false});
    if(mainMQ.matches){
      // 0 when the section reaches the top of the screen, 1 when its sticky stretch ends.
      // The stretch is 80vh per card (.work-container, --cards), so each card gets the same scroll.
      var r = work.getBoundingClientRect();
      P.work.tgt = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
    }
    else { P.attr.tgt = inViewProgress(work, {startsEntering:true, startsExiting:false}); }
  }
  // Distances below are measured from the content, so adding or removing projects, glance
  // images or tags keeps everything in view. The constants reproduce the original motion.
  var endX = 0, glanceRange1 = [0, 0], glanceRange2 = [0, 0];
  var STRIP_SHIFT = 710, STRIP_SHIFT_MOBILE = 800;  // how far the tag strips slide each way
  function overflow(el){ return Math.max(0, el.scrollWidth - el.clientWidth); }
  // Tag strips are centred and wider than their card. Give short ones (short tag names) extra
  // repeats so they never run out while sliding.
  function fillStrip(s, shift){
    var unit = Array.prototype.slice.call(s.children, 0, 4), guard = 0;  // tag, *, tag, *
    function spare(){ var f = s.firstElementChild, l = s.lastElementChild; return (l.offsetLeft + l.offsetWidth - f.offsetLeft - s.clientWidth)/2; }
    while(s.clientWidth && unit.length && spare() < shift && guard++ < 50){
      unit.forEach(function(el){ s.appendChild(el.cloneNode(true)); });
    }
  }
  function measure(){
    endX = -(list.scrollWidth - carousel.clientWidth);
    // Row 1 slides right and row 2 left, each across its own overflow (30px insets at the ends)
    glanceRange1 = [30 - overflow(glance1), 30];
    glanceRange2 = [30, -overflow(glance2) - 32];
    strips.forEach(function(s){ fillStrip(s, mainMQ.matches ? STRIP_SHIFT : STRIP_SHIFT_MOBILE); });
    fillLogos();
  }
  function frame(){
    raf = 0;
    var moving = false;
    for(var k in P){ if(step(P[k])) moving = true; }
    var vw = window.innerWidth, vh = window.innerHeight;
    navGlow.style.transform = "translate3d(" + ((-50 + 100*P.glowX.cur)*vw/100) + "px,0,0)";
    var tx = (-50 + 100*P.hx.cur)*vw/100, ty = (-50 + 100*P.hy.cur)*vh/100;
    for(var i=0;i<hoverImgs.length;i++) hoverImgs[i].style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
    glance1.style.transform = "translate3d(" + lerpKF(P.g1.cur, 5, glanceRange1[0], 95, glanceRange1[1]) + "px,0,0)";
    glance2.style.transform = "translate3d(" + lerpKF(P.g2.cur, 5, glanceRange2[0], 95, glanceRange2[1]) + "px,0,0)";
    if(mainMQ.matches){
      list.style.transform = "translate3d(" + (endX*P.work.cur) + "px,0,0)";
      var ax = STRIP_SHIFT*(1 - 2*P.work.cur);
      for(var j=0;j<strips.length;j++) strips[j].style.transform = "translate3d(" + ax + "px,0,0)";
    } else {
      var bx = -STRIP_SHIFT_MOBILE*P.attr.cur;
      for(var m=0;m<strips.length;m++) strips[m].style.transform = "translate3d(" + bx + "px,0,0)";
    }
    if(moving) kick();
  }

  /* ---------------- Mouse: navbar glow + hover images ---------------- */
  window.addEventListener("mousemove", function(e){
    P.glowX.tgt = e.clientX / window.innerWidth;
    P.hx.tgt = e.clientX / window.innerWidth;
    P.hy.tgt = e.clientY / window.innerHeight;
    // the glow shows while the pointer is anywhere in the navbar strip (as on the original)
    var r = navbarContainer.getBoundingClientRect();
    var nr = document.querySelector(".navbar").getBoundingClientRect();
    navGlow.classList.toggle("on", e.clientY >= nr.top && e.clientY <= nr.bottom && e.clientX >= r.left && e.clientX <= r.right);
    kick();
  }, {passive:true});
  document.addEventListener("mouseleave", function(){ navGlow.classList.remove("on"); });

  var byName = {};
  hoverImgs.forEach(function(el){ byName[el.getAttribute("data-img")] = el; });
  function fade(el, to, ms){ el.style.transition = "opacity " + ms + "ms linear"; el.style.opacity = to; }
  // Fetch every hover image as soon as the page could show them (wide screen + a pointer that hovers), not on
  // first hover, so a slow connection has the whole visit to finish. Phones never match, so never download them.
  var hoverMQ = window.matchMedia("(min-width: 992px) and (hover: hover)");
  function loadHoverImgs(){
    if(!hoverMQ.matches) return;
    Array.prototype.forEach.call(document.querySelectorAll(".underline-hover-image [data-srcset], .underline-hover-image [data-src]"), function(el){
      if(el.hasAttribute("data-srcset")){ el.srcset = el.getAttribute("data-srcset"); el.removeAttribute("data-srcset"); }
      if(el.hasAttribute("data-src")){ el.src = el.getAttribute("data-src"); el.removeAttribute("data-src"); }
    });
    hoverMQ.removeEventListener ? hoverMQ.removeEventListener("change", loadHoverImgs) : hoverMQ.removeListener(loadHoverImgs);
  }
  hoverMQ.addEventListener ? hoverMQ.addEventListener("change", loadHoverImgs) : hoverMQ.addListener(loadHoverImgs);
  loadHoverImgs();
  // Show an image only once it has loaded, so a half-downloaded one never paints in; if it finishes while the
  // word is still hovered, it fades in then.
  function whenLoaded(el, fn){
    var img = el.querySelector("img");
    if(!img || (img.complete && img.naturalWidth)) return fn();
    img.addEventListener("load", function(){ fn(); }, {once:true});
  }

  var pronounceTimer = 0;
  Array.prototype.forEach.call(document.querySelectorAll("[data-hover]"), function(word){
    var img = byName[word.getAttribute("data-hover")], hovered = false;
    word.addEventListener("mouseenter", function(){
      hovered = true;
      whenLoaded(img, function(){ if(hovered) fade(img, 1, 100); });
      if(word.getAttribute("data-hover") !== "inspired"){ clearTimeout(pronounceTimer); fade(byName.pronounce, 0, 100); }
    });
    word.addEventListener("mouseleave", function(){ hovered = false; fade(img, 0, 50); });
  });

  /* ---------------- Pronunciation easter egg ---------------- */
  document.getElementById("pronounce").addEventListener("click", function(e){
    if(e.clientX || e.clientY){ P.hx.tgt = P.hx.cur = e.clientX / window.innerWidth; P.hy.tgt = P.hy.cur = e.clientY / window.innerHeight; kick(); }
    var el = byName.pronounce;
    clearTimeout(pronounceTimer);
    fade(el, 1, 100);
    pronounceTimer = setTimeout(function(){ fade(el, 0, 100); }, 2100);
  });

  /* ---------------- Profile photo stack ---------------- */
  var stack = Array.prototype.slice.call(document.querySelectorAll("#profileStack .profile-image"))
    .sort(function(a,b){ return a.getAttribute("data-order") - b.getAttribute("data-order"); });
  document.getElementById("profileStack").addEventListener("click", function(){
    var visible = stack.filter(function(el){ return !el.hidden; });
    if(visible.length <= 1){ stack.forEach(function(el){ el.hidden = false; }); }
    else { visible[0].hidden = true; }
  });

  /* ---------------- Home link ---------------- */
  document.getElementById("homeLink").addEventListener("click", function(e){
    e.preventDefault();
    window.scrollTo({top:0, behavior: reduceMQ.matches ? "auto" : "smooth"});
  });

  /* ---------------- Footer link underline ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll(".footer-action"), function(a){
    var u = a.querySelector(".footer-action-underline"), anim = null;
    function play(frames, opts){ if(anim) anim.cancel(); anim = u.animate(frames, opts); }
    function enter(){ play([{transform:"translateX(-100%)"},{transform:"translateX(0)"}], {duration:reduceMQ.matches?0:300, easing:"ease-out", fill:"forwards"}); }
    function leave(){ play([{transform:getComputedStyle(u).transform === "none" ? "translateX(0)" : getComputedStyle(u).transform},{transform:"translateX(100%)"}], {duration:reduceMQ.matches?0:500, easing:"linear", fill:"forwards"});
      anim.onfinish = function(){ if(anim){ anim.cancel(); anim = null; } }; }
    a.addEventListener("mouseenter", enter); a.addEventListener("focus", enter);
    a.addEventListener("mouseleave", leave); a.addEventListener("blur", leave);
  });

  /* ---------------- Logos marquee: runs while in view ---------------- */
  // The build sets the loop length from the logos' widths (constant speed). Here we only make
  // sure there are enough copies of the row to fill the strip, however few logos there are.
  function fillLogos(){
    var row = logos.firstElementChild, w = row ? row.offsetWidth : 0, added = false;
    while(w && logos.children.length * w < logos.clientWidth + w){
      var copy = row.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      Array.prototype.forEach.call(copy.querySelectorAll("img"), function(img){ img.alt = ""; });
      logos.appendChild(copy);
      added = true;
    }
    // restart every row together so the copies stay in step
    if(added) Array.prototype.forEach.call(logos.children, function(r){ r.style.animation = "none"; void r.offsetWidth; r.style.animation = ""; });
  }
  if("IntersectionObserver" in window){
    new IntersectionObserver(function(entries){ entries.forEach(function(en){ logos.classList.toggle("playing", en.isIntersecting); }); }).observe(logos);
  } else { logos.classList.add("playing"); }

  /* ---------------- Wire up ---------------- */
  function onScroll(){ readScroll(); kick(); }
  window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", function(){ measure(); onScroll(); });
  function onMQ(){
    if(!mainMQ.matches) list.style.transform = "";
    measure(); readScroll(); for(var k in P){ if(k !== "glowX" && k !== "hx" && k !== "hy") P[k].cur = P[k].tgt; } kick();
  }
  if(mainMQ.addEventListener) mainMQ.addEventListener("change", onMQ); else mainMQ.addListener(onMQ);
  onMQ();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ measure(); onScroll(); });
})();
