(function(){
  /* ---------------- Content ---------------- */
  var PROJECTS = [
    {href:"work/browse-experience/", img:"assets/img/projects/browse-experience.avif", w:"786", h:"1162", tags:["Product Design","Content Discovery"],
     title:"Driving Engagement and Trust with Standards and Curriculum Aligned Resources",
     desc:"Quizizz is mainly used for a review use case, which is a once-a-month use case. Although Quizizz hosts a vast public library with resources on every granularity, there is some gap when communicating this to the teachers. We paired up these resources with the widely used standards and curricula that teachers rely on and aced the high frequency use case."},
    {href:"work/quizizz-demo-experience/", img:"assets/img/projects/quizizz-demo-experience.avif", w:"1218", h:"1800", tags:["Visual Design","User Onboarding"],
     title:"Boosting activation by communicating the Quizizz USP during signup",
     desc:"Quizizz has an activation rate of ~20% for US users. In an attempt to boost this number, the team hypothesized that users do not understand Quizizz's USP in their first interaction, and hence drop off. This project is an attempt to communicate what Quizizz offers to their users in an interactive manner."},
    {href:"work/quizizz-org-picker/", img:"assets/img/projects/quizizz-org-picker.avif", w:"786", h:"1162", tags:["Feature Revamp","Product QA"],
     title:"Redesigning the Quizizz org picker for accuracy and consistency",
     desc:"Inaccuracy of org data is a problem that is very prominent in Quizizz. This affects content recommendation accuracy, reduced admin trust, and hassles in lead generation. This project rethinks the org picker for teachers to make it easier for users to find their org, improve accuracy, and reduce dropoffs."},
    {href:"work/msdc-2022/", img:"assets/img/projects/msdc-2022.avif", w:"609", h:"900", tags:["Problem Identification","Product Design"],
     title:"Reigniting the Emotional Quotient in Virtual Communication within the Workplace",
     desc:"Employees are not able to communicate properly in a virtual setting because of a lack of emotional factors such as tone, gestures, and expressions. Here, I attempt to solve this problem as a part of Microsoft Design Challenge 2022 by incorporating these factors into their communication via various methods."},
    {href:"work/e-summit-2021/", img:"assets/img/projects/e-summit-2021.avif", w:"609", h:"900", tags:["Brand Identity","Web Design"],
     title:"Defining the Brand Identity for IIT Roorkee's E-Summit 2021",
     desc:"Built the brand identity, created deliverables, and designed the website for the flagship event of E-Cell IIT Roorkee. E-Summit is held annually to bring together the entrepreneurial, venture, and academic communities to a common ground and provides an avenue to exhibit entrepreneurial talent and creativity through discussions, seminars, competitions, and more."},
    {href:"work/e-id-portal/", img:"assets/img/projects/e-id-portal.avif", w:"609", h:"900", tags:["SaaS Design","In-house Tool"],
     title:"Designing the e-ID Card Management and Distribution Portal for IIT Roorkee",
     desc:"Distributing and managing the physical ID cards of more than 8000 students was a hassle for the Dean of Students' Welfare. Hence we developed this in-house tool digitalize ID cards, distribute them, and manage and resolve queries if any."}
  ];
  var LINKS = [
    [{t:"Behance", s:"For best visuals", href:"https://www.behance.net/vinyaspandey"},
     {t:"Medium", s:"For detailed studies", href:"https://medium.com/@vinyaspandey"}],
    [{t:"Dribbble", s:"For on-the-go shots", href:"https://dribbble.com/bittu911"},
     {t:"LinkedIn", s:"For professional stories", href:"https://www.linkedin.com/in/vinyaspandey1109/"}],
    [{t:"vinyaspandey1109@gmail.com", s:"For old school mailing", href:"mailto:vinyaspandey1109@gmail.com?subject=%F0%9F%91%8B%F0%9F%8F%BB%20Hey%20there!%20Let's%20get%20on%20a%20call%3F", mail:true}]
  ];

  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); }
  function attrStrip(tags){
    var out=""; for(var i=0;i<8;i++){ out+='<p>'+esc(tags[0])+'</p><p>*</p><p>'+esc(tags[1])+'</p><p>*</p>'; }
    return out;
  }
  document.getElementById("projectsList").innerHTML = PROJECTS.map(function(p){
    return '<div class="project-container" role="listitem"><a class="project-link-container" href="'+p.href+'">'+
      '<div class="project-attributes-container top" aria-hidden="true"><div class="project-attributes-list">'+attrStrip(p.tags)+'</div></div>'+
      '<div class="project-content-and-image"><div class="project-title-and-subtitle"><h2>'+esc(p.title)+'</h2><p class="project-description">'+esc(p.desc)+'</p>'+
      '<span class="sr-only">'+esc(p.tags.join(", "))+'</span></div>'+
      '<div class="image-container project"><img class="image-slot" src="'+p.img+'" alt="" width="'+p.w+'" height="'+p.h+'"></div></div>'+
      '<div class="project-attributes-container bottom" aria-hidden="true"><div class="project-attributes-list">'+attrStrip(p.tags)+'</div></div>'+
    '</a></div>';
  }).join("");

  var bracket = function(bottom){ var b = bottom ? " bottom" : "";
    return '<div class="footer-action-bracket'+b+'" aria-hidden="true"><span class="bracket-edge'+b+'"></span><span class="footer-edge-base'+b+'"></span><span class="bracket-edge right'+b+'"></span></div>'; };
  var rowsHost = document.getElementById("footerRows");
  rowsHost.outerHTML = LINKS.map(function(row){
    return '<div class="footer-actions-row'+(row[0].mail?' mailing':'')+'">'+row.map(function(l){
      return '<a class="footer-action" href="'+l.href+'"'+(l.mail?'':' target="_blank" rel="noopener"')+'>'+bracket(false)+
        '<div class="footer-action-title-container"><h1 class="footer-action-title">'+esc(l.t)+'</h1><div class="footer-action-underline-container"><div class="footer-action-underline"></div></div></div>'+
        bracket(true)+'<p class="footer-action-subtitle">'+esc(l.s)+'</p></a>';
    }).join("")+'</div>';
  }).join("");

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

  /* ---------------- Render loop ---------------- */
  var raf = 0;
  function kick(){ if(!raf) raf = requestAnimationFrame(frame); }
  function step(p){ var h = reduceMQ.matches ? 1 : p.h; p.cur += (p.tgt - p.cur)*h; if(Math.abs(p.tgt - p.cur) < 1e-4) p.cur = p.tgt; return p.cur !== p.tgt; }
  function readScroll(){
    P.g1.tgt = inViewProgress(glance1, {startsEntering:true, startsExiting:false});
    P.g2.tgt = inViewProgress(glance2, {startsEntering:true, startsExiting:false});
    if(mainMQ.matches){ P.work.tgt = inViewProgress(work, {startsEntering:true, addStart:true, start:50, startsExiting:true, addEnd:true, end:80}); }
    else { P.attr.tgt = inViewProgress(work, {startsEntering:true, startsExiting:false}); }
  }
  var endX = -5386;
  function measure(){ endX = -(list.scrollWidth - carousel.clientWidth); }
  function frame(){
    raf = 0;
    var moving = false;
    for(var k in P){ if(step(P[k])) moving = true; }
    var vw = window.innerWidth, vh = window.innerHeight;
    navGlow.style.transform = "translate3d(" + ((-50 + 100*P.glowX.cur)*vw/100) + "px,0,0)";
    var tx = (-50 + 100*P.hx.cur)*vw/100, ty = (-50 + 100*P.hy.cur)*vh/100;
    for(var i=0;i<hoverImgs.length;i++) hoverImgs[i].style.transform = "translate3d(" + tx + "px," + ty + "px,0)";
    glance1.style.transform = "translate3d(" + lerpKF(P.g1.cur, 5, -572, 95, 30) + "px,0,0)";
    glance2.style.transform = "translate3d(" + lerpKF(P.g2.cur, 5, 30, 95, -620) + "px,0,0)";
    if(mainMQ.matches){
      list.style.transform = "translate3d(" + (endX*P.work.cur) + "px,0,0)";
      var ax = 710 - 1420*P.work.cur;
      for(var j=0;j<strips.length;j++) strips[j].style.transform = "translate3d(" + ax + "px,0,0)";
    } else {
      var bx = -800*P.attr.cur;
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
  var pronounceTimer = 0;
  Array.prototype.forEach.call(document.querySelectorAll("[data-hover]"), function(word){
    var img = byName[word.getAttribute("data-hover")];
    word.addEventListener("mouseenter", function(){
      fade(img, 1, 100);
      if(word.getAttribute("data-hover") !== "inspired"){ clearTimeout(pronounceTimer); fade(byName.pronounce, 0, 100); }
    });
    word.addEventListener("mouseleave", function(){ fade(img, 0, 50); });
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
  var logos = document.getElementById("logos");
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
