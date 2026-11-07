(function(){
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Navbar glow follows the cursor (the rest of the page's interactions are in site.js) */
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
})();
