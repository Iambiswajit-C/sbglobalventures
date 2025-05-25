document.addEventListener("DOMContentLoaded", function () {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      const headerContainer = document.getElementById('header');
      if (headerContainer) {
        headerContainer.innerHTML = data;
        headerContainer.style.visibility = 'visible';

        // Highlight nav AFTER DOM injection
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = headerContainer.querySelectorAll(".nav-menu a");

        navLinks.forEach(link => {
          const href = link.getAttribute("href");
          if (href === currentPage) {
            link.classList.add("active");
          }
        });

        // Toggle menu (mobile)
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
