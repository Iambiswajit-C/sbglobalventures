document.addEventListener("DOMContentLoaded", function () {
  // Load header.html dynamically
  fetch('/header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (headerContainer) {
        headerContainer.innerHTML = data;
        headerContainer.style.visibility = 'visible';

        const header = document.querySelector('header.header');

        // Scroll effect
        function handleScroll() {
          if (window.scrollY > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // initial check

        // Active menu item
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

        // Reliable toggle menu
        const menuToggle = headerContainer.querySelector(".menu-toggle");
        const navMenu = headerContainer.querySelector(".nav-menu");

        if (menuToggle && navMenu) {
          menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
          });

          document.addEventListener("click", (event) => {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
              navMenu.classList.remove("show");
            }
          });
        }
      }
    });
});
