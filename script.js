const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const filterButtons = document.querySelectorAll(".filter-button");
const portfolioItems = document.querySelectorAll(".portfolio-item");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selectedFilter = button.dataset.filter;

    portfolioItems.forEach((item) => {
      const shouldShow =
        selectedFilter === "all" ||
        item.dataset.category === selectedFilter;

      item.classList.toggle("hidden", !shouldShow);
    });
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
