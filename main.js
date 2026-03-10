/* =========================================================
   DOM SELECTORS
========================================================= */
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links li");
const navLinks = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");
const icon = document.querySelector(".hamburger .material-symbols-outlined");

/* =========================================================
   HAMBURGER TOGGLE
========================================================= */
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  icon.textContent = navLinks.classList.contains("open") ? "close" : "menu";
});

/* =========================================================
   SCROLL ACTIVE LINK
========================================================= */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      if (!id) return;

      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!activeLink) return;

      navItems.forEach((li) => li.classList.remove("active"));
      activeLink.parentElement.classList.add("active");
    });
  },
  {
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));

/* =========================================================
   CERRAR MENÚ AL HACER CLICK (UX MOBILE)
========================================================= */
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    icon.textContent = "menu";
  });
});

/* =========================================================
   FADE IN CLIENT LOGOS
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll(".clients-logos img");

  const logosObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 200);
          logosObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  logos.forEach((logo) => logosObserver.observe(logo));
});

/* =========================================================
   PRODUCTS REVEAL
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");

  const cardsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 200);
          cardsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => cardsObserver.observe(card));
});

/* =========================================================
   LUCIDE ICONS
========================================================= */
lucide.createIcons();

/* =========================================================
   NETWORK BACKGROUND (CANVAS PARTICLES)
========================================================= */
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
const particleCount = 60;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#f97316";
    ctx.fill();
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = dx * dx + dy * dy;

      if (distance < 12000) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(249,115,22,0.15)";
        ctx.lineWidth = 1;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}
animate();

/* =========================================================
   METRICS COUNTER
========================================================= */
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = +counter.getAttribute("data-target");
      let count = 0;

      const updateCounter = () => {
        const increment = target / 80;
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };

      updateCounter();
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* =========================================================
   TIMELINE REVEAL
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (!timelineItems.length) return;

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = [...timelineItems].indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add("show");
        }, i * 150);
        timelineObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 }
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));
});

/* =========================================================
   FAQ ACCORDION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach((item) => {
    // Inyecta la barra lateral si no existe
    if (!item.querySelector(".faq-item-bar")) {
      const bar = document.createElement("div");
      bar.className = "faq-item-bar";
      item.prepend(bar);
    }

    const button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      // Cierra todos
      document.querySelectorAll(".faq-item.active").forEach((i) =>
        i.classList.remove("active")
      );
      // Abre el clickeado si estaba cerrado
      if (!isActive) item.classList.add("active");
    });
  });
});

/* =========================================================
   REVEAL ON SCROLL (GENÉRICO .reveal)
========================================================= */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

/* =========================================================
   LANGUAGE SWITCHER
========================================================= */
(function () {
  const root = document.documentElement;
  const langBtns = document.querySelectorAll(".lang-btn");

  function setLang(lang) {
    root.setAttribute("data-lang", lang);
    document.querySelectorAll("[data-en]").forEach(el => {
      if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
        el.placeholder = el.getAttribute(`data-${lang}`) || el.placeholder;
      } else if (el.tagName === "TEXTAREA" && el.hasAttribute("placeholder")) {
        el.placeholder = el.getAttribute(`data-${lang}`) || el.placeholder;
      } else if (el.tagName === "H1") {
        el.innerHTML = el.getAttribute(`data-${lang}`) || el.innerHTML;
      } else {
        el.textContent = el.getAttribute(`data-${lang}`) || el.textContent;
      }
    });
  }

  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      langBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      setLang(btn.dataset.lang);
    });
  });

  setLang("en");
})();

/* =========================================================
   ENTRANCE ANIMATIONS (YT-REVEAL)
========================================================= */
(function () {
  const SELECTORS = [
    "#services .services-header",
    "#services .service-card",
    "#products .products-header",
    "#about .about-header",
    "#about .about-content",
    "#about .about-metrics",
    "#about .about-timeline",
    "#faq .faq-top",
    "#faq .faq-layout",
    "#contact .contact-glass",
    "footer .footer-brand",
    "footer .footer-col",
    "footer .footer-bottom"
  ];

  const targets = Array.from(document.querySelectorAll(SELECTORS.join(",")));

  const filtered = targets.filter(el => {
    if (el.closest(".clients")) return false;
    if (el.matches(".clients-logos img")) return false;
    if (el.classList.contains("product-card")) return false;
    if (el.classList.contains("timeline-item")) return false;
    return true;
  });

  filtered.forEach((el, i) => {
    const soft =
      el.matches("footer .footer-col") ||
      el.matches("footer .footer-brand");

    el.classList.add(soft ? "yt-reveal-soft" : "yt-reveal");
    el.style.transitionDelay = `${Math.min(i * 55, 320)}ms`;
  });

  const ytObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("yt-inview");
        ytObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  filtered.forEach(el => ytObserver.observe(el));
})();

/* =========================================================
   CUSTOM SELECT
========================================================= */
document.querySelectorAll('.custom-select').forEach(select => {
  const trigger = select.querySelector('.custom-select__trigger');
  const text    = select.querySelector('.custom-select__text');
  const options = select.querySelectorAll('.custom-select__option');
  const hidden  = select.closest('.custom-select-group').querySelector('.custom-select-value');

  trigger.addEventListener('click', () => {
    const isOpen = select.classList.contains('open');
    closeAll();
    if (!isOpen) select.classList.add('open');
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      text.textContent = opt.textContent;
      text.classList.add('selected');
      hidden.value = opt.dataset.value;
      select.classList.remove('open');
    });
  });

  select.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select.classList.toggle('open');
    }
    if (e.key === 'Escape') closeAll();
  });
});

function closeAll() {
  document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
}

document.addEventListener('click', e => {
  if (!e.target.closest('.custom-select')) closeAll();
});

/* =========================================================
   INTL TEL INPUT
========================================================= */
const phoneInputEl = document.querySelector("#phone-input");
if (phoneInputEl) {
  window.iti = intlTelInput(phoneInputEl, {
    initialCountry: "auto",
    geoIpLookup: cb =>
      fetch("https://ipapi.co/json")
        .then(r => r.json())
        .then(d => cb(d.country_code))
        .catch(() => cb("us")),
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
    preferredCountries: ["us", "co", "mx", "es"],
    separateDialCode: true,
  });
}