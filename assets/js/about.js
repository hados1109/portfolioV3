(function(){
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Navbar glow follows the cursor */
  var navGlow = document.getElementById("navGlow"), navbar = document.querySelector(".navbar");
  var glow = {cur:.5, tgt:.5}, raf = 0;
  function frame(){ raf = 0; var h = reduceMQ.matches ? 1 : .5; glow.cur += (glow.tgt - glow.cur)*h; if (Math.abs(glow.tgt-glow.cur) < 1e-4) glow.cur = glow.tgt;
    navGlow.style.transform = "translate3d(" + ((-50 + 100*glow.cur)*window.innerWidth/100) + "px,0,0)";
    if (glow.cur !== glow.tgt) raf = requestAnimationFrame(frame); }
  window.addEventListener("mousemove", function(e){
    glow.tgt = e.clientX / window.innerWidth;
    var nr = navbar.getBoundingClientRect();
    navGlow.classList.toggle("on", e.clientY >= nr.top && e.clientY <= nr.bottom);
    if (!raf) raf = requestAnimationFrame(frame);
  }, {passive:true});
  document.addEventListener("mouseleave", function(){ navGlow.classList.remove("on"); });
  frame();

  /* Profile photo stack */
  var stack = Array.prototype.slice.call(document.querySelectorAll("#profileStack .profile-image"))
    .sort(function(a,b){ return a.getAttribute("data-order") - b.getAttribute("data-order"); });
  document.getElementById("profileStack").addEventListener("click", function(){
    var visible = stack.filter(function(el){ return !el.hidden; });
    if (visible.length <= 1) { stack.forEach(function(el){ el.hidden = false; }); } else { visible[0].hidden = true; }
  });

  /* Current-page link scrolls to top (project pages have none) */
  var homeLink = document.getElementById("homeLink");
  if (homeLink) homeLink.addEventListener("click", function(e){
    e.preventDefault(); window.scrollTo({top:0, behavior: reduceMQ.matches ? "auto" : "smooth"});
  });

  /* Footer link underline */
  Array.prototype.forEach.call(document.querySelectorAll(".footer-action"), function(a){
    var u = a.querySelector(".footer-action-underline"), anim = null;
    function play(frames, opts){ if (anim) anim.cancel(); anim = u.animate(frames, opts); }
    function enter(){ play([{transform:"translateX(-100%)"},{transform:"translateX(0)"}], {duration:reduceMQ.matches?0:300, easing:"ease-out", fill:"forwards"}); }
    function leave(){ var cur = getComputedStyle(u).transform; play([{transform: cur === "none" ? "translateX(0)" : cur},{transform:"translateX(100%)"}], {duration:reduceMQ.matches?0:500, easing:"linear", fill:"forwards"});
      anim.onfinish = function(){ if (anim) { anim.cancel(); anim = null; } }; }
    a.addEventListener("mouseenter", enter); a.addEventListener("focus", enter);
    a.addEventListener("mouseleave", leave); a.addEventListener("blur", leave);
  });
})();
