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

  // ================= SCROLL BEHAVIOR & STICKY HEADER =================
  function handleScroll() {
    const header = document.querySelector('header.header');
    const topBar = document.querySelector('.top-bar');
    const hero = document.querySelector('.hero');

    if (!header || !hero) return;

    const topBarHeight = topBar ? topBar.offsetHeight : 0;
    const headerHeight = header.offsetHeight;

    // If scrolled past top bar, make header sticky & hide top bar
    if (window.scrollY > topBarHeight) {
      header.classList.add('sticky');
      topBar && topBar.classList.add('hidden');
    } else {
      header.classList.remove('sticky');
      topBar && topBar.classList.remove('hidden');
    }

    // Hero padding = header + top bar (only if top bar visible)
    const topBarVisible = topBar && !topBar.classList.contains('hidden');
    hero.style.paddingTop = (headerHeight + (topBarVisible ? topBarHeight : 0)) + 'px';
  }

  window.addEventListener('scroll', handleScroll);
  window.addEventListener('load', handleScroll);
  window.addEventListener('resize', handleScroll);

  // ================= HERO SLIDER =================
  const slides = document.querySelectorAll('.hero-slide');
  const slider = document.querySelector('.hero-slider');
  if (slides.length > 0 && slider) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      const offset = -index * 100;
      slider.style.transform = `translateX(${offset}%)`;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    setInterval(nextSlide, 5000);
    showSlide(currentSlide);
  }

  // ================= CERTIFICATIONS CAROUSEL =================
  const certificationTrack = document.querySelector('.certification-track');
  if (certificationTrack) {
    let scrollAmount = 0;
    const scrollStep = 1;
    const resetThreshold = certificationTrack.scrollWidth / 2;

    function scrollCarousel() {
      scrollAmount += scrollStep;
      if (scrollAmount >= resetThreshold) {
        scrollAmount = 0;
        certificationTrack.style.transform = `translateX(0)`;
      } else {
        certificationTrack.style.transform = `translateX(-${scrollAmount}px)`;
      }
    }

    setInterval(scrollCarousel, 20);
  }

  // ================= MOBILE DROPDOWN =================
  const mobileDropdownLinks = document.querySelectorAll(".nav-menu li.has-dropdown > a");
  mobileDropdownLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const parentLi = this.parentElement;
        parentLi.classList.toggle("active");
      }
    });
  });

  // ================= LIGHTBOX =================
  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  document.body.appendChild(lightbox);

  const images = document.querySelectorAll(".certifications img");
  images.forEach(image => {
    image.addEventListener("click", e => {
      lightbox.classList.add("active");
      const img = document.createElement("img");
      img.src = image.src;
      while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild);
      }
      lightbox.appendChild(img);
    });
  });

  lightbox.addEventListener("click", e => {
    if (e.target !== e.currentTarget) return;
    lightbox.classList.remove("active");
  });
});
