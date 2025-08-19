document.addEventListener("DOMContentLoaded", function () {
  // Load header
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

        // Contact Form Submission with Formsubmit
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

        // Scroll behavior
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

        // Active menu
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

        // MENU TOGGLE LOGIC
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

  // --- HERO SLIDER LOGIC ---
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
      slideInterval = setInterval(nextSlide, 3000);
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

  // --- CERTIFICATIONS CAROUSEL ---
const viewport = document.querySelector(".cert-viewport");
const track = document.querySelector(".cert-track");
const prevBtn = document.querySelector(".cert-arrow.prev");
const nextBtn = document.querySelector(".cert-arrow.next");
const dotsWrap = document.querySelector(".cert-dots");

if (viewport && track) {
let originalSlides = Array.from(track.querySelectorAll(".cert-slide"));

// --- Build clones for seamless loop (no visible reverse) ---
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
firstClone.classList.add("clone");
lastClone.classList.add("clone");
track.insertBefore(lastClone, originalSlides[0]);
track.appendChild(firstClone);

// After cloning, work with the new children list
let allSlides = Array.from(track.children);

// --- State ---
let index = 1; // start at first real slide (after left clone)
let slidesPerView = 3; // will be recalculated on resize
let slideSize = 0; // width + horizontal margins
let autoTimer = null;

// --- Helpers ---
function computeSlideSize() {
// Use a real (non-clone) slide to get consistent size
const probe = originalSlides[0];
const cs = getComputedStyle(probe);
const ml = parseFloat(cs.marginLeft) || 0;
const mr = parseFloat(cs.marginRight) || 0;
slideSize = probe.offsetWidth + ml + mr;

slidesPerView = window.innerWidth <= 480 ? 1 : 3;

// Force the viewport to show exactly slidesPerView items
viewport.style.width = (slidesPerView * slideSize) + "px";
}

function setTransition(on) {
track.style.transition = on ? "transform 0.6s ease" : "none";
}

function currentIsClone() {
return allSlides[index].classList.contains("clone");
}

function goToIndex(withAnim = true) {
setTransition(withAnim);
// center the current slide based on the *viewport* width
const offset = viewport.offsetWidth / 2 - (index + 0.5) * slideSize;
track.style.transform = `translateX(${offset}px)`;
updateActiveClasses();
updateDots();
}

function updateActiveClasses() {
allSlides.forEach(s => s.classList.remove("active"));
if (!allSlides[index].classList.contains("clone")) {
allSlides[index].classList.add("active");
}
}

function next() { index++; goToIndex(true); }
function prev() { index--; goToIndex(true); }

function startAuto() {
stopAuto();
autoTimer = setInterval(next, 5000);
}
function stopAuto() {
if (autoTimer) clearInterval(autoTimer);
autoTimer = null;
}

// --- Dots (based on original slides only) ---
function buildDots() {
if (!dotsWrap) return;
dotsWrap.innerHTML = "";
for (let i = 0; i < originalSlides.length; i++) {
const dot = document.createElement("span");
dotsWrap.appendChild(dot);
dot.addEventListener("click", () => {
index = i + 1; // +1 because of left clone
goToIndex(true);
startAuto();
});
}
}
function updateDots() {
if (!dotsWrap) return;
const dots = Array.from(dotsWrap.querySelectorAll("span"));
dots.forEach(d => d.classList.remove("active"));
const realIndex = (index - 1 + originalSlides.length) % originalSlides.length;
if (dots[realIndex]) dots[realIndex].classList.add("active");
}

// --- Wrap handling: jump over clones without animation ---
track.addEventListener("transitionend", () => {
if (currentIsClone()) {
setTransition(false);
if (index === allSlides.length - 1) {
// we were on the right clone -> jump to first real
index = 1;
} else if (index === 0) {
// we were on the left clone -> jump to last real
index = allSlides.length - 2;
}
goToIndex(false); // instant jump; next tick will keep moving left
}
});

// --- Controls ---
nextBtn && nextBtn.addEventListener("click", () => { next(); startAuto(); });
prevBtn && prevBtn.addEventListener("click", () => { prev(); startAuto(); });

// Recalculate sizes on resize (debounced)
let rAF;
window.addEventListener("resize", () => {
cancelAnimationFrame(rAF);
rAF = requestAnimationFrame(() => {
computeSlideSize();
goToIndex(false);
});
});

// --- Init after everything is laid out ---
function init() {
computeSlideSize();
buildDots();
goToIndex(false); // center first real slide
startAuto();
}
// Use load to ensure images (if any) and widths are stable
if (document.readyState === "complete") {
init();
} else {
window.addEventListener("load", init);
}
}
