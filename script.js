document.addEventListener("DOMContentLoaded", () => {
  fetch('/header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (!headerContainer) return;

      headerContainer.innerHTML = data;
      headerContainer.style.visibility = 'visible';

      const header = document.querySelector('header.header');
      const topBar = document.querySelector('.top-bar');
      const menuToggle = headerContainer.querySelector('.menu-toggle');
      const navMenu = headerContainer.querySelector('.nav-menu');

      // Handle sticky header and top bar visibility
      let lastScrollTop = 0;
      const handleScroll = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (header) {
          header.classList.toggle('sticky', currentScroll > 50);
        }

        if (topBar) {
          if (currentScroll > lastScrollTop) {
            topBar.classList.add('hide');
          } else {
            topBar.classList.remove('hide');
          }
        }

        lastScrollTop = Math.max(currentScroll, 0);
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // initial call

      // Highlight active nav link
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
      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
          navMenu.classList.toggle('show');
          menuVisible = !menuVisible;
        });

        document.addEventListener('click', (e) => {
          if (menuVisible && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            menuVisible = false;
          }
        });
      }
    })
    .catch(error => {
      console.error('Failed to load header:', error);
    });
});
