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

        // Scroll behavior with direction logic
        let lastScrollTop = 0;
        function handleScroll() {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

          // Sticky header toggle
          if (currentScroll > 50) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }

          // Top bar hide/show on scroll direction
          if (topBar) {
            if (currentScroll > lastScrollTop) {
              topBar.classList.add("hidden"); // scrolling down
            } else {
              topBar.classList.remove("hidden"); // scrolling up
            }
          }

          lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        // Active menu highlight based on path
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

        // Mobile menu toggle
        let menuVisible = false;
        menuToggle.addEventListener("click", () => {
          navMenu.classList.toggle("show");
          menuVisible = !menuVisible;
        });

        // Close menu when clicking outside
        document.addEventListener("click", (event) => {
          if (menuVisible && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            navMenu.classList.remove("show");
            menuVisible = false;
          }
        });
      }
    });
});
