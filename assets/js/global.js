function will() {
  // Slogan
  new TypeIt(".slogan", {
    strings: "Web Developer",
    speed: 60,
    waitUntilVisible: true,
  }).go();

  // Scroll Links
  const scrollLinks = document.querySelectorAll("a.scrollLink");

  if (scrollLinks) {
    for (var i = 0; i < scrollLinks.length; i++) {
      let self = scrollLinks[i];
      let elementLink = self.getAttribute("href");

      self.addEventListener("click", function (event) {
        event.preventDefault();

        gsap.to(window, 1, { scrollTo: { y: elementLink, offsetY: 0 } });
      });
    }
  }

  // CTA Scroll
  const ctaScroll = document.querySelectorAll("a.ctaScroll");

  if (ctaScroll) {
    for (var i = 0; i < ctaScroll.length; i++) {
      let self = ctaScroll[i];
      let elementLink = self.getAttribute("href");

      self.addEventListener("click", function (event) {
        event.preventDefault();

        gsap.to(window, 2, { scrollTo: { y: elementLink, offsetY: 0 } });
      });
    }
  }

  // Scroll Check
  let hash = window.location.hash;

  if (hash) {
    gsap.to(window, 1, { scrollTo: { y: hash, offsetY: 0 } });
  }

  // Single Element Fade-In
  const scrollTypeB = document.querySelectorAll(".scrollTypeB");

  if (scrollTypeB.length > 0) {
    for (var i = 0; i < scrollTypeB.length; i++) {
      const el = scrollTypeB[i];

      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top",
        },
        stagger: 0.2,
        autoAlpha: 0,
        duration: 2,
      });
    }
  }

  // Multi Element Fade In and TranslateY
  const scrollTypeA = document.querySelectorAll(".scrollTypeA");

  if (scrollTypeA.length > 0) {
    for (var i = 0; i < scrollTypeA.length; i++) {
      const el = scrollTypeA[i];

      gsap.from(el.querySelectorAll(".tween"), {
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top",
        },
        stagger: 0.2,
        y: 200,
        autoAlpha: 0,
        duration: 1,
      });
    }
  }
}

will();
