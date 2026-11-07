/* Interactions every page shares. Loaded before the page's own script. */
(function(){
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Profile photo stack */
  // setNavPhoto (in the layout's <head>) remembers the pick for other pages and updates the favicon
  var photoCount = document.querySelectorAll("#profileStack .profile-image").length;
  document.getElementById("profileStack").addEventListener("click", function(){
    setNavPhoto((+document.documentElement.getAttribute("data-photo") + 1) % photoCount);
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
