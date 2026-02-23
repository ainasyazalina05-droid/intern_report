const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const headlineDynamic = document.getElementById("headlineDynamic");

const headlineWords = ["bold", "neon", "dynamic", "creative"];
let headlineIndex = 0;

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const currentId = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentId}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  { rootMargin: "-35% 0px -50% 0px", threshold: 0.05 }
);

sections.forEach((section) => sectionObserver.observe(section));

if (headlineDynamic) {
  setInterval(() => {
    headlineIndex = (headlineIndex + 1) % headlineWords.length;
    headlineDynamic.style.opacity = "0";
    setTimeout(() => {
      headlineDynamic.textContent = headlineWords[headlineIndex];
      headlineDynamic.style.opacity = "1";
    }, 180);
  }, 1800);
}
