document.addEventListener("DOMContentLoaded", function () {
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
        contactForm.reset();
        formMessage.textContent = "Thanks for contacting us! We will be in touch with you shortly.";
        formMessage.style.color = "green";
      } else {
        throw new Error("Formsubmit request failed");
      }
    })
    .catch(error => {
      formMessage.textContent = "Oops! Something went wrong. Please try again later.";
      formMessage.style.color = "red";
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
          const isIndexMatch = (linkPath.endsWith('/index.html') || linkPath === '/index') &&
            (currentPath === '' || currentPath === '/' || currentPath === '/index' || currentPath === '/index.html');
          if (linkPath === currentPath || isIndexMatch) {
            link.classList.add('active');
          }
        });

        // Toggle menu fix
        let menuVisible = false;
        menuToggle.addEventListener("click", () => {
          navMenu.classList.toggle("show");
          menuVisible = !menuVisible;
        });

        document.addEventListener("click", (event) => {
          if (menuVisible && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            navMenu.classList.remove("show");
            menuVisible = false;
          }
        });
      }
    });
});
