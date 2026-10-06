/* ===== Config: put your real social links here ===== */
const SOCIALS = {
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
};
document.querySelectorAll("[data-social]").forEach((a) => {
  a.href = SOCIALS[a.dataset.social] || "#";
});

/* ===== Theme toggle ===== */
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {}
document.getElementById("themeToggle").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

/* ===== Mobile menu ===== */
const navLinks = document.getElementById("navLinks");
document.getElementById("menuBtn").addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => navLinks.classList.remove("open")));

/* ===== Navbar scroll state + active link ===== */
const nav = document.getElementById("nav");
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...navLinks.querySelectorAll("a:not(.btn)")];
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 20);
  const y = window.scrollY + 140;
  let current = sections[0].id;
  sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
  links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== Typing effect ===== */
const roles = ["Full Stack Developer", "Frontend Enthusiast", "Java & DSA Learner", "Problem Solver"];
const typed = document.getElementById("typed");
let r = 0, c = 0, deleting = false;
(function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!deleting && c < word.length) c++;
  else if (!deleting) { deleting = true; return setTimeout(type, 1400); }
  else if (c > 0) c--;
  else { deleting = false; r = (r + 1) % roles.length; }
  setTimeout(type, deleting ? 45 : 85);
})();

/* ===== Scroll reveal, counters, skill bars ===== */
function countUp(el) {
  const target = +el.dataset.count;
  const dur = 1400, start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("show");
    e.target.querySelectorAll("[data-count]").forEach(countUp);
    e.target.querySelectorAll("[data-w]").forEach((b) => (b.style.width = b.dataset.w + "%"));
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 80 + "ms";
  io.observe(el);
});

/* ===== Cursor glow ===== */
const glow = document.getElementById("glow");
window.addEventListener("pointermove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

/* ===== 3D tilt on project cards ===== */
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const b = card.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener("pointerleave", () => (card.style.transform = ""));
});

/* ===== Contact form (opens the visitor's email app) ===== */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const msg = document.getElementById("message").value.trim();
  const subject = encodeURIComponent("Portfolio enquiry from " + name);
  const body = encodeURIComponent(msg + "\n\n— " + name + " (" + email + ")");
  window.location.href = `mailto:Kaifazmikaif2@gmail.com?subject=${subject}&body=${body}`;
});

/* ===== Footer year ===== */
document.getElementById("year").textContent = new Date().getFullYear();

/* ===== Particle background ===== */
(function particles() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let w, h, pts;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const n = Math.min(70, Math.floor((w * h) / 22000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    const light = root.getAttribute("data-theme") === "light";
    const col = light ? "90,80,200" : "140,130,255";
    pts.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},0.7)`;
      ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${col},${0.16 * (1 - d / 130)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    });
    if (!reduce) requestAnimationFrame(draw);
  }
  window.addEventListener("resize", resize);
  resize(); draw();
})();