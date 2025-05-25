document.addEventListener("DOMContentLoaded", function () {
  // Load header.html dynamically
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (headerContainer) {
        headerContainer.innerHTML = data;
        headerContainer.style.visibility = 'visible';

        // Highlight the active nav link
        highlightActiveNavLink(); // ✅ <-- ADD THIS

        // Wait for the injected header to be part of the DOM
        const menuToggle = headerContainer.querySelector(".menu-toggle");
        const navMenu = headerContainer.querySelector(".nav-menu");

        if (menuToggle && navMenu) {
          menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
          });
        }
      }
    });

  function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop(); // e.g., "contact.html"
    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPage || (href === "index.html" && currentPage === "")) {
        link.classList.add("active");
      }
    });
  }
});
