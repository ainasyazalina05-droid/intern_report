/* ─── Nav toggle ─────────────────────────────────────────── */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

/* ─── Scroll Tracker & Back to Top ────────────────────────── */
const scrollProgress = document.createElement("div");
scrollProgress.id = "scrollProgress";
document.body.appendChild(scrollProgress);

const backToTop = document.createElement("button");
backToTop.className = "back-to-top";
backToTop.innerHTML = "↑";
backToTop.setAttribute("aria-label", "Back to top");
document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  scrollProgress.style.width = scrolled + "%";

  if (winScroll > 400) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─── Scroll reveal ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        // Don't unobserve if we want it to re-reveal? 
        // No, keep it clean: revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal, .stagger-reveal").forEach((el) => revealObserver.observe(el));

/* ─── Smooth <details> animation ────────────────────────── */
function animateDetails(details, open) {
  const body = details.querySelector(".dropdown-body");
  if (!body) return;

  if (open) {
    // Opening: set display, measure, then animate
    body.style.overflow = "hidden";
    body.style.maxHeight = "0px";
    body.style.opacity = "0";
    body.style.transition = "max-height 360ms cubic-bezier(0.4,0,0.2,1), opacity 280ms ease";

    // Allow layout to settle before animating
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        body.style.maxHeight = body.scrollHeight + "px";
        body.style.opacity = "1";
      });
    });

    body.addEventListener(
      "transitionend",
      () => { body.style.maxHeight = "none"; body.style.overflow = ""; },
      { once: true }
    );
  } else {
    // Closing: lock current height then animate to 0
    body.style.overflow = "hidden";
    body.style.maxHeight = body.scrollHeight + "px";
    body.style.opacity = "1";
    body.style.transition = "max-height 300ms cubic-bezier(0.4,0,0.2,1), opacity 220ms ease";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        body.style.maxHeight = "0px";
        body.style.opacity = "0";
      });
    });
  }
}

document.querySelectorAll(".dropdown-card").forEach((details) => {
  // If already open on page load, make sure body is visible
  const body = details.querySelector(".dropdown-body");
  if (body && details.open) {
    body.style.maxHeight = "none";
    body.style.opacity = "1";
  }

  details.addEventListener("click", (e) => {
    // Only intercept clicks on the summary
    if (!e.target.closest("summary")) return;

    e.preventDefault();

    if (details.open) {
      animateDetails(details, false);
      details.addEventListener(
        "transitionend",
        () => { details.removeAttribute("open"); },
        { once: true }
      );
      // Fallback if no transition fires
      setTimeout(() => details.removeAttribute("open"), 380);
    } else {
      details.setAttribute("open", "");
      animateDetails(details, true);
    }
  });
});

/* ─── Projects phone frame ───────────────────────────────── */
const projects = [
  {
    kicker: "Project 1",
    title: "Cloverly Home Experience",
    summary: "Built and refined core home screen components to improve clarity, consistency, and first-use experience for users.",
    stack: "Flutter · Dart · REST API",
    outcome: "Improved visual consistency and reduced repeated layout issues across updates.",
    image: "images/project1.svg",
    alt: "Cloverly home screen preview"
  },
  {
    kicker: "Project 2",
    title: "Floristo Content Module",
    summary: "Implemented and polished content-driven screens with stronger structure and readable presentation for dynamic data.",
    stack: "Flutter · Dart · Component-based UI",
    outcome: "Increased maintainability through reusable sections and cleaner content rendering.",
    image: "images/project2.svg",
    alt: "Floristo content module preview"
  },
  {
    kicker: "Project 3",
    title: "Membership & Menu Flow",
    summary: "Handled UI and behavior updates for membership and menu-related flows, including bug fixes and interaction improvements.",
    stack: "Flutter · Dart · Git · Debugging workflow",
    outcome: "Delivered more stable user flows with clearer interaction feedback and fewer UI regressions.",
    image: "images/project3.svg",
    alt: "Membership and menu flow preview"
  }
];

const phoneScreen = document.getElementById("phoneScreen");
const projectDescription = document.getElementById("projectDescription");
const projectDots = document.getElementById("projectDots");
const prevProject = document.getElementById("prevProject");
const nextProject = document.getElementById("nextProject");

let phoneImages = [];
let dots = [];
let activeIndex = 0;
let autoTimer;
let touchStartX = 0;

function renderProject(index) {
  if (!projectDescription) return;
  const p = projects[index];

  phoneImages.forEach((img, i) => img.classList.toggle("active", i === index));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === index));

  projectDescription.innerHTML = `
    <p class="project-kicker">${p.kicker}</p>
    <h2>${p.title}</h2>
    <p>${p.summary}</p>
    <p><strong>Tools:</strong> ${p.stack}</p>
    <p><strong>Result:</strong> ${p.outcome}</p>
  `;
}

function changeProject(step) {
  activeIndex = (activeIndex + step + projects.length) % projects.length;
  renderProject(activeIndex);
  restartAuto();
}

function restartAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => {
    activeIndex = (activeIndex + 1) % projects.length;
    renderProject(activeIndex);
  }, 5000);
}

function setupProjects() {
  if (!phoneScreen || !projectDescription || !projectDots) return;

  phoneScreen.innerHTML = projects
    .map((item, idx) => `<img src="${item.image}" alt="${item.alt}"${idx === 0 ? ' class="active"' : ""}>`)
    .join("");

  projectDots.innerHTML = projects
    .map((_, idx) => `<button class="dot-btn${idx === 0 ? " active" : ""}" data-index="${idx}" aria-label="Project ${idx + 1}"></button>`)
    .join("");

  phoneImages = [...phoneScreen.querySelectorAll("img")];
  dots = [...projectDots.querySelectorAll(".dot-btn")];

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      activeIndex = Number(dot.dataset.index);
      renderProject(activeIndex);
      restartAuto();
    });
  });

  prevProject?.addEventListener("click", () => changeProject(-1));
  nextProject?.addEventListener("click", () => changeProject(1));

  phoneScreen.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; });
  phoneScreen.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) < 40) return;
    changeProject(delta < 0 ? 1 : -1);
  });

  renderProject(0);
  restartAuto();
}

setupProjects();
