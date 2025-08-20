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
e.preventDefault();
e.stopPropagation();
navMenu.classList.toggle("show");
menuToggle.classList.toggle("active"); // optional: animate hamburger
});

// Close menu when a link is clicked (important for mobile UX)
navMenu.querySelectorAll("a").forEach(link => {
link.addEventListener("click", () => {
navMenu.classList.remove("show");
menuToggle.classList.remove("active");
});
});

// Close menu if clicking outside both menu and toggle
document.addEventListener("click", function (e) {
if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
navMenu.classList.remove("show");
menuToggle.classList.remove("active");
}
});
}

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

 document.querySelectorAll(".mobile-dropdown-toggle").forEach(toggle => {
toggle.addEventListener("click", e => {
e.preventDefault();
const parent = toggle.parentElement;
parent.classList.toggle("open");
});
});

});
