const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links li");
const navLinks = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");
const icon = document.querySelector(".hamburger .material-symbols-outlined");

/* =========================
   HAMBURGER TOGGLE
========================= */

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  icon.textContent = navLinks.classList.contains("open")
    ? "close"
    : "menu";
});

/* =========================
   SCROLL ACTIVE LINK
========================= */

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(li => li.classList.remove("active"));

        const activeLink = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );

        if (activeLink) {
          activeLink.parentElement.classList.add("active");
        }
      }
    });
  },
  { threshold: 0.6 }
);

sections.forEach(section => observer.observe(section));

/* =========================
   CERRAR MENÚ AL HACER CLICK
========================= */

navItems.forEach(item => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    icon.textContent = "menu";
  });
});
