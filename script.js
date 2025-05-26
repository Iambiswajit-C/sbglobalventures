// Load Header
fetch('/header.html')
  .then(response => response.text())
  .then(data => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    const topBar = tempDiv.querySelector('.top-bar');
    const header = tempDiv.querySelector('header');

    if (topBar) document.body.insertAdjacentElement('afterbegin', topBar);
    if (header) document.body.insertAdjacentElement('afterbegin', header);

    // Toggle Mobile Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    let menuVisible = false;

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        menuVisible = !menuVisible;
      });

      // Close menu when clicking outside
      document.addEventListener('click', (event) => {
        if (menuVisible && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
          navMenu.classList.remove('show');
          menuVisible = false;
        }
      });
    }

    // Scroll Behavior
    const originalTopBar = document.querySelector('.top-bar');
    const originalHeader = document.querySelector('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        originalHeader.classList.add('sticky');
        originalTopBar && originalTopBar.classList.add('hidden');
      } else {
        originalHeader.classList.remove('sticky');
        originalTopBar && originalTopBar.classList.remove('hidden');
      }
    });
  });

// Load Footer
fetch('/footer.html')
  .then(response => response.text())
  .then(data => {
    const footer = document.querySelector('footer.footer');
    if (footer) {
      footer.outerHTML = data;
    }
  });
