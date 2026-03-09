/* =========================================================
   DOM SELECTORS (ELEMENTOS PRINCIPALES)
   - sections: todas las secciones <section> para detectar cuál está visible
   - navItems: <li> del navbar (para marcar "active")
   - navLinks: <ul class="nav-links"> (para abrir/cerrar menú mobile)
   - hamburger + icon: botón de menú en mobile + ícono material
========================================================= */
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links li");
const navLinks = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");
const icon = document.querySelector(".hamburger .material-symbols-outlined");

/* =========================================================
   HAMBURGER TOGGLE (ABRIR / CERRAR MENÚ MOBILE)
   - Alterna la clase .open en el contenedor del menú
   - Cambia el ícono entre "menu" y "close"
========================================================= */
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  icon.textContent = navLinks.classList.contains("open") ? "close" : "menu";
});

/* =========================================================
   SCROLL ACTIVE LINK (RESALTAR LINK ACTIVO SEGÚN SECCIÓN)
   - Usa IntersectionObserver para detectar qué <section> está en vista
   - IMPORTANTE:
     * Si la sección NO tiene id => no toca el estado del nav
     * Si NO existe un <a href="#id"> => tampoco toca el estado del nav
   - Así evitamos que se borre el "active" al entrar en secciones
     que no tienen link en el navbar.
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
    // "ventana" central: cuando una sección pasa por el centro del viewport, se activa
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));

/* =========================================================
   CERRAR MENÚ AL HACER CLICK (UX MOBILE)
   - Al tocar cualquier item del nav:
     * cierra el menú
     * devuelve el ícono a "menu"
========================================================= */
navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    icon.textContent = "menu";
  });
});

/* =========================================================
   FADE IN CLIENT LOGOS (REVEAL CON DELAY)
   - Anima cada logo (img) dentro de .clients-logos
   - Usa IntersectionObserver:
     * Cuando un logo entra en vista => agrega clase .show con delay
     * Luego deja de observarlo para ahorrar recursos
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll(".clients-logos img");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Delay escalonado para efecto "premium"
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 200);

          // Ya se animó => no hace falta seguir observándolo
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  logos.forEach((logo) => observer.observe(logo));
});

/* =========================================================
   PRODUCTS REVEAL (TARJETAS DE PRODUCTO)
   - Similar a logos: cuando entra la tarjeta => clase .show
   - Delay escalonado por índice
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".product-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 200);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  cards.forEach((card) => observer.observe(card));
});

/* =========================================================
   LUCIDE ICONS
   - Reemplaza placeholders por íconos SVG de lucide
========================================================= */
lucide.createIcons();

/* =========================================================
   NETWORK BACKGROUND (CANVAS PARTICLES)
   - Dibuja partículas y líneas entre ellas en un <canvas>
   - Partículas rebotan en los bordes
   - Conecta partículas cercanas con líneas suaves
========================================================= */
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

// Contenedor de partículas y configuración
let particles = [];
const particleCount = 60;

/* Ajusta el tamaño del canvas al tamaño visible del elemento */
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* Clase Particle: cada punto móvil del fondo */
class Particle {
  constructor() {
    // Posición inicial aleatoria
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    // Velocidad suave aleatoria (movimiento lento)
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  // Actualiza la posición y rebota en los bordes
  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  // Dibuja el punto (partícula)
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#f97316";
    ctx.fill();
  }
}

/* Conecta partículas que estén cerca (distancia al cuadrado) */
function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;

      // Usamos distancia^2 para evitar sqrt (más eficiente)
      let distance = dx * dx + dy * dy;

      // Umbral de conexión (ajusta densidad de líneas)
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

/* Loop de animación del canvas */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  connectParticles();
  requestAnimationFrame(animate);
}

// Creamos las partículas iniciales y arrancamos la animación
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}
animate();

/* =========================================================
   METRICS COUNTER (CONTADOR ANIMADO)
   - Elementos con clase .counter y atributo data-target="123"
   - Cuando entra en vista:
     * incrementa suavemente hasta target
     * luego deja de observarlo
========================================================= */
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = +counter.getAttribute("data-target"); // convierte a número
      let count = 0;

      // Función interna para actualizar el contador en animación
      const updateCounter = () => {
        // Ajusta "80" para controlar la duración del conteo
        const increment = target / 80;

        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCounter);
        } else {
          // Garantiza que termine exacto en el target
          counter.innerText = target;
        }
      };

      updateCounter();
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.6 },
);

counters.forEach((counter) => counterObserver.observe(counter));

/* =========================================================
   TIMELINE REVEAL (ANIMACIÓN DEL TIMELINE)
   - .timeline-item inicia oculto en CSS (opacity 0, translateY)
   - Cuando entra en vista:
     * agrega .show para activar la transición
     * aplica delay escalonado por orden
     * deja de observar ese item
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (!timelineItems.length) return;

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Delay según el índice real del elemento en NodeList
        const i = [...timelineItems].indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add("show");
        }, i * 150);

        timelineObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));
});

/* =========================================================
   FAQ ACCORDION
   - Cada .faq-item contiene un botón .faq-question
   - Al click:
     * alterna clase .active para expandir/colapsar
========================================================= */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

/* =========================================================
   REVEAL ON SCROLL (GENÉRICO)
   - Elementos con clase .reveal se activan cuando entran
   - Agrega clase .active cuando el elemento está cerca de entrar
   - Nota: Esto usa scroll event (más simple). Si quieres optimizar
     se puede migrar a IntersectionObserver también.
========================================================= */
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;

    // Si el elemento está dentro del rango visible (+ margen)
    if (elementTop < windowHeight - 80) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

(function () {
      const root = document.documentElement;
      const langBtns = document.querySelectorAll(".lang-btn");

      function setLang(lang) {
        root.setAttribute("data-lang", lang);
        document.querySelectorAll("[data-en]").forEach(el => {
          // For inputs use placeholder
          if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
            el.placeholder = el.getAttribute(`data-${lang}`) || el.placeholder;
          } else if (el.tagName === "TEXTAREA" && el.hasAttribute("placeholder")) {
            el.placeholder = el.getAttribute(`data-${lang}`) || el.placeholder;
          } else if (el.tagName === "H1") {
            // Allow HTML inside h1 (span)
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

      // Default language
      setLang("en");
    })();

    // =======================================
// ✅ YATYTECH - Entrance Animations (Reveal)
// - Excluye: clients logos, icon animations, product-card, timeline-item
// =======================================
(function () {
  const SELECTORS = [
    // Services
    "#services .services-header",
    "#services .service-card",

    // Products (solo header / labels, NO cards porque ya tienes show)
    "#products .products-header",

    // About
    "#about .about-header",
    "#about .about-content",
    "#about .about-metrics",
    "#about .about-timeline", // la caja general, NO timeline-item (ya tiene show)

    // FAQ
    "#faq .faq-header",
    "#faq .faq-item",

    // Contact
    "#contact .contact-glass",

    // Footer
    "footer .footer-brand",
    "footer .footer-col",
    "footer .footer-bottom"
  ];

  const targets = Array.from(document.querySelectorAll(SELECTORS.join(",")));

  // ✅ Filtros: no tocar animaciones existentes ni clients logos
  const filtered = targets.filter(el => {
    if (el.closest(".clients")) return false; // no animar toda la sección clients
    if (el.matches(".clients-logos img")) return false; // explícito
    if (el.classList.contains("product-card")) return false; // ya tiene show
    if (el.classList.contains("timeline-item")) return false; // ya tiene show
    return true;
  });

  // Asignar clases + stagger
  filtered.forEach((el, i) => {
    // FAQ items y columnas footer con efecto soft
    const soft =
      el.matches("#faq .faq-item") ||
      el.matches("footer .footer-col") ||
      el.matches("footer .footer-brand");

    el.classList.add(soft ? "yt-reveal-soft" : "yt-reveal");

    // stagger ligero (se ve pro)
    el.style.transitionDelay = `${Math.min(i * 55, 320)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("yt-inview");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  filtered.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════
   CUSTOM SELECT — JS
═══════════════════════════════════════ */

document.querySelectorAll('.custom-select').forEach(select => {
  const trigger  = select.querySelector('.custom-select__trigger');
  const text     = select.querySelector('.custom-select__text');
  const options  = select.querySelectorAll('.custom-select__option');
  const hidden   = select.closest('.custom-select-group').querySelector('.custom-select-value');

  /* Toggle open */
  trigger.addEventListener('click', () => {
    const isOpen = select.classList.contains('open');
    closeAll();
    if (!isOpen) select.classList.add('open');
  });

  /* Select option */
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

  /* Keyboard nav */
  select.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select.classList.toggle('open');
    }
    if (e.key === 'Escape') closeAll();
  });
});

/* Close all on outside click */
function closeAll() {
  document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
}

document.addEventListener('click', e => {
  if (!e.target.closest('.custom-select')) closeAll();
});

