document.addEventListener("DOMContentLoaded", function () {
  // Load header.html dynamically
  fetch('/header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (headerContainer) {
        headerContainer.innerHTML = data;
        headerContainer.style.visibility = 'visible';

        // Highlight active menu item
        const currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase(); // normalize
        const navLinks = headerContainer.querySelectorAll('.nav-menu a');

        navLinks.forEach(link => {
          const linkPath = new URL(link.href).pathname.replace(/\/$/, '').toLowerCase();
          // Match index.html to root path or current directory
          const isIndexMatch = (linkPath.endsWith('/index.html') || linkPath === '/index') &&
                               (currentPath === '' || currentPath === '/' || currentPath === '/index' || currentPath === '/index.html');

          if (linkPath === currentPath || isIndexMatch) {
            link.classList.add('active');
          }
        });

        // Setup mobile toggle menu
        const menuToggle = headerContainer.querySelector(".menu-toggle");
        const navMenu = headerContainer.querySelector(".nav-menu");

        if (menuToggle && navMenu) {
          menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
          });
        }
      }
    });
});
