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

  icon.textContent = navLinks.classList.contains("open") ? "close" : "menu";
});

/* =========================
   SCROLL ACTIVE LINK
========================= */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((li) => li.classList.remove("active"));

        const activeLink = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`,
        );

        if (activeLink) {
          activeLink.parentElement.classList.add("active");
        }
      }
    });
  },
  { threshold: 0.6 },
);

sections.forEach((section) => observer.observe(section));

/* =========================
   CERRAR MENÚ AL HACER CLICK
========================= */

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    icon.textContent = "menu";
  });
});

// ================= FADE IN CLIENT LOGOS =================

document.addEventListener("DOMContentLoaded", () => {
  const logos = document.querySelectorAll(".clients-logos img");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // pequeño delay entre logos para efecto premium
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 200);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    },
  );

  logos.forEach((logo) => {
    observer.observe(logo);
  });
});
// ================= PRODUCTS REVEAL =================

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
    {
      threshold: 0.2,
    },
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
});

lucide.createIcons();

// ================= NETWORK BACKGROUND =================

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

// ================= METRICS COUNTER =================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
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
      }
    });
  },
  { threshold: 0.6 },
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

// ================= TIMELINE REVEAL =================

const timelineItems = document.querySelectorAll(".timeline-item");

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("show");
        }, index * 150);

        timelineObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

timelineItems.forEach((item) => {
  timelineObserver.observe(item);
});

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

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

