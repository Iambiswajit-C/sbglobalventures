document.addEventListener("DOMContentLoaded", function () {
  // ================= HEADER LOAD =================
  fetch('/header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (!headerContainer) return;

      headerContainer.innerHTML = data;
      headerContainer.style.visibility = 'visible';

      const menuToggle = headerContainer.querySelector(".menu-toggle");
      const navMenu = headerContainer.querySelector(".nav-menu");

      // === CONTACT FORM SUBMISSION ===
      const contactForm = document.getElementById("contactForm");
      const formMessage = document.getElementById("formMessage");

      if (contactForm && formMessage) {
        contactForm.addEventListener("submit", function (e) {
          e.preventDefault();
          const formData = new FormData(contactForm);
          fetch("https://formsubmit.co/ajax/info@sbglobalventures.com", {
            method: "POST",
            body: formData,
          })
            .then(response => {
              if (response.ok) {
                contactForm.style.display = "none";
                formMessage.textContent =
                  "Thanks for contacting us! We will be in touch with you shortly.";
                formMessage.style.color = "green";
                formMessage.style.display = "block";
              } else {
                throw new Error("Formsubmit request failed");
              }
            })
            .catch(error => {
              formMessage.textContent =
                "Oops! Something went wrong. Please try again later.";
              formMessage.style.color = "red";
              formMessage.style.display = "block";
              console.error("Formsubmit error:", error);
            });
        });
      }

      // === ACTIVE MENU ===
      const currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
      const navLinks = headerContainer.querySelectorAll('.nav-menu a');
      navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '').toLowerCase();
        const isIndexMatch =
          (linkPath.endsWith('/index.html') || linkPath === '/index') &&
          (currentPath === '' || currentPath === '/' || currentPath === '/index' || currentPath === '/index.html');
        if (linkPath === currentPath || isIndexMatch) {
          link.classList.add('active');
        }
      });

      // === MENU TOGGLE ===
      if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          navMenu.classList.toggle("show");
        });

        document.addEventListener("click", function (e) {
          const isClickInsideMenu = navMenu.contains(e.target);
          const isClickOnToggle = menuToggle.contains(e.target);
          if (!isClickInsideMenu && !isClickOnToggle) {
            navMenu.classList.remove("show");
          }
        });
      }

      // Recompute layout after header HTML is injected
      handleScroll();
    });

  // ================= SCROLL BEHAVIOR & STICKY HEADER =================
window.addEventListener('DOMContentLoaded', () => {
  const topBar = document.querySelector('.top-bar');
  const header = document.querySelector('header.header');
  const spacer = document.getElementById('header-spacer');

  function handleScroll() {
    if (window.scrollY > topBar.offsetHeight) {
      header.classList.add('sticky');
      topBar.classList.add('hidden');
      spacer.style.height = header.offsetHeight + 'px';
    } else {
      header.classList.remove('sticky');
      topBar.classList.remove('hidden');
      spacer.style.height = '0';
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // check on load
});

  // ================= HERO SLIDER =================
  const slides = document.querySelectorAll(".hero-slide");
  const prevBtn = document.querySelector(".hero-arrow.prev");
  const nextBtn = document.querySelector(".hero-arrow.next");
  const dotsContainer = document.querySelector(".hero-dots");
  let current = 0;
  let slideInterval;
  let isPaused = false;

  if (slides.length > 0 && dotsContainer) {
    // Create dots dynamically
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll("span");

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
        if (dots[i]) dots[i].classList.toggle("active", i === index);
      });
    }

    function nextSlide() {
      current = (current + 1) % slides.length;
      showSlide(current);
    }

    function prevSlide() {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
      isPaused = true;
    }

    nextBtn && nextBtn.addEventListener("click", () => {
      nextSlide();
      if (!isPaused) {
        clearInterval(slideInterval);
        startAutoSlide();
      }
    });

    prevBtn && prevBtn.addEventListener("click", () => {
      prevSlide();
      if (!isPaused) {
        clearInterval(slideInterval);
        startAutoSlide();
      }
    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        current = i;
        showSlide(current);
        if (!isPaused) {
          clearInterval(slideInterval);
          startAutoSlide();
        }
      });
    });

    slides.forEach(slide => {
      slide.addEventListener("click", () => {
        stopAutoSlide();
      });
    });

    showSlide(current);
    startAutoSlide();
  }

  // ================= CERTIFICATIONS CAROUSEL =================
  (function () {
    const viewport = document.querySelector(".cert-viewport");
    const track = document.querySelector(".cert-track");
    const prevBtn = document.querySelector(".cert-arrow.prev");
    const nextBtn = document.querySelector(".cert-arrow.next");
    const dotsWrap = document.querySelector(".cert-dots");
    if (!viewport || !track) return;

    // Real slides & dots
    let realSlides = Array.from(track.querySelectorAll(".cert-slide:not(.is-clone)"));
    const realCount = realSlides.length;

    dotsWrap && (dotsWrap.innerHTML = "");
    for (let i = 0; i < realCount; i++) {
      const span = document.createElement("span");
      if (i === 0) span.classList.add("active");
      dotsWrap && dotsWrap.appendChild(span);
    }
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

    // State
    let visible = window.innerWidth <= 480 ? 1 : 3;
    let cloneCount = visible; // clones on each side = visible count
    let index; // current index in the full (cloned) list
    let slides; // all slides including clones
    let slideW = 0; // width incl. margins
    let timer = null;

    // Helpers
    function computeSlideW() {
      const viewportWidth = viewport.getBoundingClientRect().width;
      return viewportWidth / visible; // ensures equal distribution
    }

    function setViewportWidth() {
      visible = window.innerWidth <= 480 ? 1 : 3;
      slideW = computeSlideW();
      viewport.style.maxWidth = (slideW * visible) + "px";
      viewport.style.margin = "0 auto";
    }

    function realIdx() {
      // map current 'index' (including clones) to 0..realCount-1
      return ((index - cloneCount) % realCount + realCount) % realCount;
    }

    function updateActive() {
      slides.forEach(s => s.classList.remove("active"));
      slides[index].classList.add("active");
      dots.forEach(d => d.classList.remove("active"));
      if (dots[realIdx()]) dots[realIdx()].classList.add("active");
    }

    function goTo(i, animate = true) {
      index = i;
      const vw = viewport.getBoundingClientRect().width;
      const tx = vw / 2 - slideW / 2 - index * slideW; // center current card
      if (!animate) track.style.transition = "none";
      track.style.transform = `translateX(${tx}px)`;
      if (!animate) {
        // force reflow, then restore transition
        void track.offsetHeight;
        track.style.transition = "";
      }
      updateActive();
    }

    function next() { goTo(index + 1, true); }
    function prev() { goTo(index - 1, true); }

    function start() { stop(); timer = setInterval(next, 3500); }
    function stop() { if (timer) clearInterval(timer), (timer = null); }

    function buildClones() {
      // remove existing clones
      track.querySelectorAll(".cert-slide.is-clone").forEach(n => n.remove());

      // rebuild from current real slides
      realSlides = Array.from(track.querySelectorAll(".cert-slide:not(.is-clone)"));

      // left clones
      for (let i = realCount - cloneCount; i < realCount; i++) {
        const c = realSlides[i].cloneNode(true);
        c.classList.add("is-clone");
        track.insertBefore(c, track.firstChild);
      }
      // right clones
      for (let i = 0; i < cloneCount; i++) {
        const c = realSlides[i].cloneNode(true);
        c.classList.add("is-clone");
        track.appendChild(c);
      }

      slides = Array.from(track.querySelectorAll(".cert-slide"));
    }

    // Keep the illusion of infinity: snap when we pass the edges.
    track.addEventListener("transitionend", () => {
      if (index >= realCount + cloneCount) {
        goTo(index - realCount, false); // jumped past the right edge -> snap back
      } else if (index < cloneCount) {
        goTo(index + realCount, false); // jumped past the left edge -> snap forward
      }
    });

    // Controls
    nextBtn && nextBtn.addEventListener("click", () => { next(); start(); });
    prevBtn && prevBtn.addEventListener("click", () => { prev(); start(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { goTo(i + cloneCount, true); start(); }));

    // Resize: keep current real slide centered, rebuild clones if visible count changed
    window.addEventListener("resize", () => {
      const oldVisible = visible;
      const keepReal = realIdx();

      visible = window.innerWidth <= 480 ? 1 : 3;
      cloneCount = visible;

      if (oldVisible !== visible) {
        buildClones();
        index = cloneCount + keepReal;
      } else {
        slides = Array.from(track.querySelectorAll(".cert-slide"));
      }

      slideW = computeSlideW();
      viewport.style.maxWidth = (slideW * visible) + "px";
      goTo(index, false);
    });

    // Init after images load to get correct sizes
    function init() {
      cloneCount = visible;
      buildClones();
      index = cloneCount; // start on the first real slide
      slideW = computeSlideW();
      setViewportWidth();
      goTo(index, false);
      start();
    }

    const imgs = track.querySelectorAll("img");
    let loaded = 0;
    if (imgs.length) {
      imgs.forEach(img => {
        if (img.complete) {
          if (++loaded === imgs.length) init();
        } else {
          img.addEventListener("load", () => { if (++loaded === imgs.length) init(); });
          img.addEventListener("error", () => { if (++loaded === imgs.length) init(); });
        }
      });
    } else {
      init();
    }
  })();

  // ================= Mobile-first dropdown behavior for "Products" =================
  (function () {
    // Click handler (delegated) so it works even if header is loaded dynamically
    document.addEventListener("click", function (e) {
      const toggle = e.target.closest(".mobile-dropdown-toggle");
      if (!toggle) return;

      // Only intercept on mobile/tablet
      const isMobile = window.matchMedia("(max-width: 1024px)").matches;
      if (!isMobile) return; // desktop: let normal link behavior happen

      const dropdown = toggle.closest(".dropdown");
      if (!dropdown) return;

      // If not open, open and block navigation
      if (!dropdown.classList.contains("open")) {
        e.preventDefault();
        dropdown.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
      }
      // If open, allow navigation
      else {
        toggle.setAttribute("aria-expanded", "false");
        // no preventDefault -> browser follows the link
      }
    });

    // Close if user taps/clicks outside
    document.addEventListener("click", function (e) {
      const anyOpen = document.querySelector(".dropdown.open");
      if (!anyOpen) return;
      if (!e.target.closest(".dropdown")) {
        anyOpen.classList.remove("open");
        const t = anyOpen.querySelector(".mobile-dropdown-toggle");
        t && t.setAttribute("aria-expanded", "false");
      }
    });

    // Close on ESC
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      const anyOpen = document.querySelector(".dropdown.open");
      if (!anyOpen) return;
      anyOpen.classList.remove("open");
      const t = anyOpen.querySelector(".mobile-dropdown-toggle");
      t && t.setAttribute("aria-expanded", "false");
    });
  })();

  // ================= LIGHTBOX =================
  (function () {
    function ready(fn) {
      if (document.readyState !== 'loading') fn();
      else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
      const lightbox = document.getElementById('lightbox');
      if (!lightbox) return; // safety

      const imgEl = lightbox.querySelector('img');
      const closeBtn = lightbox.querySelector('.lightbox-close');

      // Open on click of any product-gallery image
      document.addEventListener('click', function (e) {
        const img = e.target.closest('.product-gallery img');
        if (!img) return;

        const full = img.getAttribute('data-full') || img.src;
        imgEl.src = full;
        imgEl.alt = img.alt || '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        // focus the close button for accessibility
        if (closeBtn) closeBtn.focus();
      });

      // Close handlers
      function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        imgEl.src = '';
        imgEl.alt = '';
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
      }

      // Click backdrop to close (but not when clicking the image)
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
      });

      // Keyboard support
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    });
  })();
});
