document.addEventListener("DOMContentLoaded", function () {
  // Load header.html dynamically
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (headerContainer) {
        headerContainer.innerHTML = data;
        headerContainer.style.visibility = 'visible';

        // Wait for the injected header to be part of the DOM
        const menuToggle = headerContainer.querySelector(".menu-toggle");
        const navMenu = headerContainer.querySelector(".nav-menu");

        // If mobile toggle exists, add click event
        if (menuToggle && navMenu) {
          menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
          });
        }
      }
    });
});
