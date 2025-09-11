document.addEventListener("DOMContentLoaded", function () {
 // ================= HEADER LOAD =================
 fetch('/header.html')
 .then(response => response.text())
 .then(data => {
 const headerContainer = document.getElementById('header');
 if (headerContainer) {
 headerContainer.innerHTML = data;
 headerContainer.style.visibility = 'visible';

 const header = document.querySelector('header.header');
 const topBar = document.querySelector('.top-bar');
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

 // === SCROLL BEHAVIOR ===
 function handleScroll() {
 if (window.scrollY > 50) {
 header.classList.add('scrolled');
 topBar && topBar.classList.add('hidden');
 } else {
 header.classList.remove('scrolled');
 topBar && topBar.classList.remove('hidden');
 }
 }
 window.addEventListener('scroll', handleScroll);
 handleScroll();

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
 }
 });

 // Sticky header toggle
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
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

 dotsWrap.innerHTML = "";
 for (let i = 0; i < realCount; i++) {
 const span = document.createElement("span");
 if (i === 0) span.classList.add("active");
 dotsWrap.appendChild(span);
 }
 const dots = Array.from(dotsWrap.children);

 // State
 let visible = window.innerWidth <= 480 ? 1 : 3;
 let cloneCount = visible; // clones on each side = visible count
 let index; // current index in the full (cloned) list
 let slides; // all slides including clones
 let slideW = 0; // width incl. margins
 let timer = null;

 // Helpers
function computeSlideW() {
// Instead of dynamic width, use a fixed percentage of viewport width
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
 dots[realIdx()].classList.add("active");
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

slideW = computeSlideW(); // <-- new calculation
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
 
// Mobile-first dropdown behavior for "Products"
(function () {
  // Click handler (delegated) so it works even if header is loaded dynamically
  document.addEventListener("click", function (e) {
    const toggle = e.target.closest(".mobile-dropdown-toggle");
    if (!toggle) return;

    // Only intercept on mobile/tablet (adjust 1024px if your breakpoint differs)
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
    // If open, allow navigation to /products/
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
 //lightbox
 (function () {
 function ready(fn){ 
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

// ================= FAQ ACCORDION =================
(function() {
    const faqs = document.querySelectorAll(".faq-item");

    faqs.forEach(item => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close all FAQs
        faqs.forEach(f => {
          f.classList.remove("active");
          const ans = f.querySelector(".faq-answer");
          ans.style.maxHeight = null;
        });

        // If not active, expand clicked one
        if (!isActive) {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
})();

(function () {
  const toc = document.querySelector('.blog-toc');
  if (!toc) return;

  const tocLinks = Array.from(toc.querySelectorAll('a[href^="#"]'));
  if (!tocLinks.length) return;

  // Map link -> section element (skip missing sections)
  const sections = tocLinks.map(link => {
    const id = link.getAttribute('href').slice(1);
    return document.getElementById(id) || null;
  });

  const pairs = tocLinks
    .map((link, i) => ({ link, section: sections[i] }))
    .filter(p => p.section);

  if (!pairs.length) return;

  // Smooth scroll on click (prevents hash in URL)
  pairs.forEach(({ link, section }) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const header = document.querySelector('.header');
      const headerOffset = (header && header.offsetHeight) ? header.offsetHeight : 80;
      const top = section.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---- Highlight helper ----
  function highlightLink(activeId, skipScroll = false) {
    pairs.forEach(({ link, section }) => {
      const isActive = (section.id === activeId);
      link.classList.toggle('active', isActive);

      if (
        isActive &&
        toc.scrollHeight > toc.clientHeight &&
        !skipScroll
      ) {
        // ✅ Don’t auto-scroll TOC if we’re at bottom OR at last section
        const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 150;
        const isLast = activeId === pairs[pairs.length - 1].section.id;
        if (!nearBottom && !isLast) {
          link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    });
  }

  // ---- Active highlight logic ----
  if ('IntersectionObserver' in window) {
    const header = document.querySelector('.header');
    const headerOffset = (header && header.offsetHeight) ? header.offsetHeight + 8 : 88;

    const observerOptions = {
      root: null,
      rootMargin: `-${headerOffset}px 0px -40% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const visibility = new Map();
    let firstHighlightDone = false;

    function applyHighlight() {
      let bestId = null;
      let bestRatio = 0;
      for (const [id, ratio] of visibility.entries()) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }
      if (!bestId && pairs.length) {
        bestId = pairs[0].section.id;
      }

      highlightLink(bestId, !firstHighlightDone);
      firstHighlightDone = true;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        visibility.set(entry.target.id, entry.intersectionRatio);
      });
      applyHighlight();
    }, observerOptions);

    pairs.forEach(({ section }) => {
      visibility.set(section.id, 0);
      observer.observe(section);
    });

    // ✅ First highlight (no scroll) on load
    window.addEventListener('load', () => {
      setTimeout(() => applyHighlight(), 100);
    });

  } else {
    // ---- Fallback: scroll listener ----
    const header = document.querySelector('.header');
    const headerOffset = (header && header.offsetHeight) ? header.offsetHeight + 8 : 88;
    let firstHighlightDone = false;

    function onScrollFallback() {
      const scrollPos = window.scrollY + headerOffset;
      let current = pairs[0];
      pairs.forEach(pair => {
        if (pair.section.offsetTop <= scrollPos) current = pair;
      });
      highlightLink(current.section.id, !firstHighlightDone);
      firstHighlightDone = true;
    }

    window.addEventListener('scroll', onScrollFallback);
    window.addEventListener('load', () => {
      onScrollFallback(); // first highlight without scrolling TOC
    });
  }
})();

  // ---- Blog page reading time ----
  const content = document.querySelector(".blog-content");
  if (content) {
    const text = content.innerText;
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / 200); // avg 200 wpm
    document.getElementById("reading-time").textContent =
      `⏱ ${readingTime} min read`;
  }
});
