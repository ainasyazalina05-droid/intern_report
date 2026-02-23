const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const revealItems = document.querySelectorAll(".reveal");

const projects = [
  {
    kicker: "Project 1",
    title: "Add your first project title",
    summary: "Add your first project description placeholder here.",
    stack: "Add tools used placeholder here.",
    outcome: "Add outcomes placeholder here.",
    image: "images/project1.svg",
    alt: "Project 1 placeholder screen"
  },
  {
    kicker: "Project 2",
    title: "Add your second project title",
    summary: "Add your second project description placeholder here.",
    stack: "Add tools used placeholder here.",
    outcome: "Add outcomes placeholder here.",
    image: "images/project2.svg",
    alt: "Project 2 placeholder screen"
  },
  {
    kicker: "Project 3",
    title: "Add your third project title",
    summary: "Add your third project description placeholder here.",
    stack: "Add tools used placeholder here.",
    outcome: "Add outcomes placeholder here.",
    image: "images/project3.svg",
    alt: "Project 3 placeholder screen"
  }
];

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

document.querySelectorAll(".nav-menu a").forEach((link) => {
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
  if (!projectDescription) {
    return;
  }

  const project = projects[index];

  phoneImages.forEach((img, idx) => {
    img.classList.toggle("active", idx === index);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });

  projectDescription.innerHTML = `
    <p class="project-kicker">${project.kicker}</p>
    <h2>${project.title}</h2>
    <p>${project.summary}</p>
    <p><strong>Tools:</strong> ${project.stack}</p>
    <p><strong>Result:</strong> ${project.outcome}</p>
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
  if (!phoneScreen || !projectDescription || !projectDots) {
    return;
  }

  phoneScreen.innerHTML = projects
    .map((item, idx) => `<img src="${item.image}" alt="${item.alt}" ${idx === 0 ? 'class="active"' : ""}>`)
    .join("");

  projectDots.innerHTML = projects
    .map((_, idx) => `<button class="dot-btn ${idx === 0 ? "active" : ""}" data-index="${idx}" aria-label="Project ${idx + 1}"></button>`)
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

  phoneScreen.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  phoneScreen.addEventListener("touchend", (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) < 40) {
      return;
    }
    if (deltaX < 0) {
      changeProject(1);
    } else {
      changeProject(-1);
    }
  });

  renderProject(activeIndex);
  restartAuto();
}

setupProjects();
