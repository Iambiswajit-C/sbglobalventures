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
  const certTrack = document.querySelector(".cert-track");
  const certSlides = document.querySelectorAll(".cert-slide");
  const certPrev = document.querySelector(".cert-arrow.prev");
  const certNext = document.querySelector(".cert-arrow.next");
  const certDotsContainer = document.querySelector(".cert-dots");

  let certCurrent = 0;
  let certInterval;

  if (certTrack && certSlides.length > 0) {
    // Create dots dynamically
    certSlides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      certDotsContainer.appendChild(dot);
    });
    const certDots = certDotsContainer.querySelectorAll("span");

    function showCertSlide(index) {
      certSlides.forEach((slide, i) => {
        slide.classList.remove("active");
        certDots[i].classList.remove("active");
      });

      certSlides[index].classList.add("active");
      certDots[index].classList.add("active");

      const slideWidth = certSlides[0].offsetWidth + 30; 
      let visibleCount = window.innerWidth <= 480 ? 1 : 3;
      const offset = -index * slideWidth + (visibleCount === 1 
        ? (certTrack.offsetWidth / 2 - slideWidth / 2)
        : (certTrack.offsetWidth / 2 - slideWidth * 1.5));

      certTrack.style.transform = `translateX(${offset}px)`;
    }

    function nextCert() {
      certCurrent = (certCurrent + 1) % certSlides.length;
      showCertSlide(certCurrent);
    }

    function prevCert() {
      certCurrent = (certCurrent - 1 + certSlides.length) % certSlides.length;
      showCertSlide(certCurrent);
    }

    function resetCertInterval() {
      clearInterval(certInterval);
      certInterval = setInterval(nextCert, 5000);
    }

    certNext && certNext.addEventListener("click", () => { nextCert(); resetCertInterval(); });
    certPrev && certPrev.addEventListener("click", () => { prevCert(); resetCertInterval(); });
    certDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        certCurrent = i;
        showCertSlide(certCurrent);
        resetCertInterval();
      });
    });

    function startCertAutoSlide() {
      certInterval = setInterval(nextCert, 5000);
    }

    showCertSlide(certCurrent);
    startCertAutoSlide();
  }
});
