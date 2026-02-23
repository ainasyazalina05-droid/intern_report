const data = window.portfolioData || {};
const projects = data.projects || [];

const phoneScreen = document.getElementById("phoneScreen");
const projectDots = document.getElementById("projectDots");
const projectDescription = document.getElementById("projectDescription");
const prevProjectButton = document.getElementById("prevProject");
const nextProjectButton = document.getElementById("nextProject");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

let phoneImages = [];
let dotButtons = [];
let activeIndex = 0;
let autoAdvanceTimer;
let touchStartX = 0;

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.textContent = value;
  }
}

function setHTML(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.innerHTML = value;
  }
}

function renderList(id, items) {
  const list = document.getElementById(id);
  if (!list || !Array.isArray(items) || !items.length) {
    return;
  }
  list.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderReferences() {
  const container = document.getElementById("referencesList");
  if (!container || !Array.isArray(data.references) || !data.references.length) {
    return;
  }

  const titleExists = container.querySelector("h2");
  const referenceMarkup = data.references.map((ref) => `<p>${ref}</p>`).join("");

  if (titleExists) {
    container.innerHTML = `<h2>References</h2>${referenceMarkup}`;
  } else {
    container.innerHTML = referenceMarkup;
  }
}

function applySharedContent() {
  setText("heroEyebrow", data.hero?.eyebrow);
  setText("heroName", data.hero?.name);
  setText("heroTagline", data.hero?.tagline);

  setHTML("aboutBackground", data.about?.background);
  setText("aboutMission", data.about?.mission);
  setText("aboutVisionRole", data.about?.visionRole);

  renderList("tasksList", data.technicalSummary?.tasks);
  renderList("achievementsList", data.technicalSummary?.achievements);

  setText("conclusionText", data.conclusion);
  setText("supervisorComment", data.comments?.supervisor);
  setText("futureComment", data.comments?.future);
  setText("footerText", data.footer);

  renderReferences();
}

function buildProjectSlides() {
  if (!phoneScreen || !projects.length) {
    return;
  }

  phoneScreen.innerHTML = projects
    .map(
      (project, index) =>
        `<img src="${project.image}" alt="${project.alt || project.title}" ${
          index === 0 ? 'class="active"' : ""
        }>`
    )
    .join("");

  phoneImages = [...phoneScreen.querySelectorAll("img")];
}

function buildProjectDots() {
  if (!projectDots || !projects.length) {
    return;
  }

  projectDots.innerHTML = projects
    .map(
      (_, index) =>
        `<button class="dot-btn ${index === 0 ? "active" : ""}" data-index="${index}" aria-label="Go to project ${
          index + 1
        }"></button>`
    )
    .join("");

  dotButtons = [...projectDots.querySelectorAll(".dot-btn")];
  dotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeIndex = Number(button.dataset.index);
      renderProject(activeIndex);
      restartAutoAdvance();
    });
  });
}

function renderProject(index) {
  if (!projectDescription || !projects.length) {
    return;
  }

  const project = projects[index];

  phoneImages.forEach((image, imageIndex) => {
    image.classList.toggle("active", imageIndex === index);
  });

  dotButtons.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });

  projectDescription.innerHTML = `
    <p class="project-kicker">${project.kicker}</p>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <p><strong>Tech stack:</strong> ${project.stack}</p>
    <p><strong>Outcome:</strong> ${project.outcome}</p>
  `;
}

function changeProject(step) {
  if (!projects.length) {
    return;
  }
  activeIndex = (activeIndex + step + projects.length) % projects.length;
  renderProject(activeIndex);
  restartAutoAdvance();
}

function restartAutoAdvance() {
  clearInterval(autoAdvanceTimer);
  if (projects.length < 2 || !projectDescription) {
    return;
  }
  autoAdvanceTimer = setInterval(() => {
    activeIndex = (activeIndex + 1) % projects.length;
    renderProject(activeIndex);
  }, 5000);
}

function setupProjectEvents() {
  if (!projectDescription) {
    return;
  }

  prevProjectButton?.addEventListener("click", () => changeProject(-1));
  nextProjectButton?.addEventListener("click", () => changeProject(1));

  phoneScreen?.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  phoneScreen?.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX < 0) {
      changeProject(1);
    } else {
      changeProject(-1);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      changeProject(1);
    }
    if (event.key === "ArrowLeft") {
      changeProject(-1);
    }
  });
}

function setupNavigation() {
  if (!navToggle || !navMenu) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupRevealAnimation() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) {
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((item) => revealObserver.observe(item));
}

applySharedContent();
buildProjectSlides();
buildProjectDots();
renderProject(activeIndex);
restartAutoAdvance();
setupProjectEvents();
setupNavigation();
setupRevealAnimation();
