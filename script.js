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

        // MENU TOGGLE LOGIC (Improved)
        if (menuToggle && navMenu) {
          menuToggle.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent event from bubbling up to document
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
  let isPaused = false; // Pause flag

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
      slideInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
      isPaused = true;
    }

    // Button events
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        if (!isPaused) {
          clearInterval(slideInterval);
          startAutoSlide();
        }
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        if (!isPaused) {
          clearInterval(slideInterval);
          startAutoSlide();
        }
      });
    }

    // Dot click events
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

    // Pause auto-slide when clicking on slide
    slides.forEach(slide => {
      slide.addEventListener("click", () => {
        stopAutoSlide();
      });
    });

    // Initialize
    showSlide(current);
    startAutoSlide();
  }
});
