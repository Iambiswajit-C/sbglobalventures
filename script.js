document.addEventListener("DOMContentLoaded", function () {
  /* ============================
     Sticky Header + Top Bar
  ============================ */
  const header = document.querySelector("header");
  const topBar = document.querySelector(".top-bar");
  const logo = document.querySelector(".logo img");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("sticky");
      if (topBar) topBar.style.display = "none";
      if (logo) logo.classList.add("small-logo");
    } else {
      header.classList.remove("sticky");
      if (topBar) topBar.style.display = "flex";
      if (logo) logo.classList.remove("small-logo");
    }
  });

  /* ============================
     Mobile Menu Toggle
  ============================ */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  /* ============================
     Hero Slider with Arrows & Dots
  ============================ */
  const slides = document.querySelectorAll(".hero-slide");
  const prevBtn = document.querySelector(".hero-arrow.prev");
  const nextBtn = document.querySelector(".hero-arrow.next");
  const dotsContainer = document.querySelector(".hero-dots");
  let current = 0;
  let slideInterval;
  let autoSlidePaused = false;

  if (slides.length > 0) {
    // Create dots dynamically
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll("span");

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        dots[i].classList.remove("active");
        if (i === index) {
          slide.classList.add("active");
          dots[i].classList.add("active");
        }
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
      if (!autoSlidePaused) {
        slideInterval = setInterval(nextSlide, 3000);
      }
    }

    function resetAutoSlide() {
      clearInterval(slideInterval);
      startAutoSlide();
    }

    // Button events (make sure buttons exist)
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetAutoSlide();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    // Dot click events
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        current = i;
        showSlide(current);
        resetAutoSlide();
      });
    });

    // Clicking on any slide pauses auto rotation
    slides.forEach((slide) => {
      slide.addEventListener("click", () => {
        clearInterval(slideInterval);
        autoSlidePaused = true;
      });
    });

    // Initialize
    showSlide(current);
    startAutoSlide();
  }
});
