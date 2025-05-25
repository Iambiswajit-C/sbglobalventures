document.addEventListener("DOMContentLoaded", function () {
  // Load header.html dynamically
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (headerContainer) {
        headerContainer.innerHTML = data;
headerContainer.innerHTML = data;
headerContainer.style.visibility = 'visible';
        // Wait for the injected header to be part of the DOM, then bind toggle event
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
