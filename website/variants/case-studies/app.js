const cases = [
  {
    id: "one-acre-fund",
    client: "ONE ACRE FUND",
    service: "MARKET ASSESSMENT",
    title: "Selecting the most promising B2B offering",
    cardTitle: "B2B offering selection",
    summary: "A product-selection deliverable that connected the client question to a five-part assessment, ranking matrix and next action plan.",
    features: ["Problem statement", "Five criteria groups", "Product matrix", "Action plan"],
    slides: [
      { label: "Problem statement", image: "img/oaf--05.png" },
      { label: "Criteria for product assessment", image: "img/oaf--07.png" },
      { label: "Current product x criteria matrix", image: "img/oaf--21.png" },
      { label: "Bigger-picture action plan", image: "img/oaf--31.png" }
    ]
  },
  {
    id: "barefoot-college-international",
    client: "BAREFOOT COLLEGE INTERNATIONAL",
    service: "OPERATING STRATEGY",
    title: "Building livelihoods, brightening the future for women",
    cardTitle: "Livelihood and implementation strategy",
    summary: "A strategic report connecting livelihood choices, local applicability, implementation phases and mission alignment.",
    features: ["Executive summary", "Livelihood pillars", "Implementation plan", "Mission alignment"],
    slides: [
      { label: "Executive summary", image: "img/bci--02.png" },
      { label: "Applicability and livelihood pillars", image: "img/bci--14.png" },
      { label: "Implementation plan", image: "img/bci--20.png" },
      { label: "Conclusion and mission alignment", image: "img/bci--29.png" }
    ]
  },
  {
    id: "stahili",
    client: "STAHILI",
    service: "FINANCIAL SUSTAINABILITY",
    title: "Financial sustainability and stakeholder management",
    cardTitle: "Funding and stakeholder strategy",
    summary: "A final deliverable that evaluates funding routes, maps stakeholder priorities and turns the strategy into implementation steps.",
    features: ["Funding evaluation", "Stakeholder matrix", "Implementation plan"],
    slides: [
      { label: "Funding strategy evaluation", image: "img/stahili--07.png" },
      { label: "Stakeholder analysis matrix", image: "img/stahili--18.png" },
      { label: "Implementation plan of recommendations", image: "img/stahili--22.png" }
    ]
  },
  {
    id: "saaras-foundation",
    client: "SAARAS FOUNDATION",
    service: "MARKETING AND ENGAGEMENT",
    title: "Branding and content strategy recommendations",
    cardTitle: "Brand and content strategy",
    summary: "A communications strategy built from market research, channel analysis and a practical content framework.",
    features: ["Brand methodology", "Channel findings", "Content framework", "Conclusion"],
    slides: [
      { label: "Branding strategy methodology", image: "img/saaras--05.png" },
      { label: "Branding conclusion and channel findings", image: "img/saaras--11.png" },
      { label: "70-20-10 content rule", image: "img/saaras--29.png" },
      { label: "Conclusion", image: "img/saaras--44.png" }
    ]
  },
  {
    id: "goodhout",
    client: "GOODHOUT",
    service: "DIGITAL PRESENCE",
    title: "Final recommendations for social media and web presence",
    cardTitle: "Social media and web recommendations",
    summary: "A digital-presence review that moves from a social deployment plan into website priorities and a final recommendation.",
    features: ["Social timeline", "Website review", "Final recommendation"],
    slides: [
      { label: "Social media deployment timeline", image: "img/goodhout--09.png" },
      { label: "Website presence", image: "img/goodhout--19.png" },
      { label: "Final recommendation", image: "img/goodhout--35.png" }
    ]
  }
];

const grid = document.querySelector("#case-grid");
const viewer = document.querySelector("#viewer");
const client = document.querySelector("#viewer-client");
const title = document.querySelector("#viewer-title");
const summary = document.querySelector("#viewer-summary");
const list = document.querySelector("#slide-list");
const image = document.querySelector("#stage-image");
const label = document.querySelector("#stage-label");
const count = document.querySelector("#stage-count");
let activeCase = null;
let activeSlide = 0;

function renderCards() {
  grid.innerHTML = cases.map((item) => `
    <article class="case-card" id="${item.id}">
      <p class="case-service">${item.service}</p>
      <h3>${item.client}</h3>
      <p class="case-title">${item.title}</p>
      <ul class="case-features">${item.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
      <button class="open-case" type="button" data-case="${item.id}" aria-label="Open selected slides for ${item.client}">View selected slides</button>
    </article>
  `).join("");
}

function renderViewer() {
  const item = activeCase;
  const slide = item.slides[activeSlide];
  client.textContent = item.client;
  title.textContent = item.title;
  summary.textContent = item.summary;
  image.src = slide.image;
  image.alt = `${item.client}: ${slide.label}`;
  label.textContent = slide.label;
  count.textContent = `${activeSlide + 1} / ${item.slides.length}`;
  list.innerHTML = item.slides.map((entry, index) => `
    <li><button class="slide-button" type="button" data-slide="${index}" aria-current="${index === activeSlide}">
      <span class="slide-number">${String(index + 1).padStart(2, "0")}</span><span>${entry.label}</span>
    </button></li>
  `).join("");
}

function openCase(id) {
  activeCase = cases.find((item) => item.id === id);
  activeSlide = 0;
  renderViewer();
  viewer.showModal();
}

function moveSlide(direction) {
  activeSlide = (activeSlide + direction + activeCase.slides.length) % activeCase.slides.length;
  renderViewer();
}

renderCards();

const requestedCase = new URLSearchParams(window.location.search).get("case");
if (requestedCase && cases.some((item) => item.id === requestedCase)) openCase(requestedCase);

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-case]");
  if (button) openCase(button.dataset.case);
});

list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slide]");
  if (button) { activeSlide = Number(button.dataset.slide); renderViewer(); }
});

viewer.addEventListener("click", (event) => {
  if (event.target === viewer || event.target.closest("[data-close]")) viewer.close();
  if (event.target.closest("[data-previous]")) moveSlide(-1);
  if (event.target.closest("[data-next]")) moveSlide(1);
});

document.addEventListener("keydown", (event) => {
  if (!viewer.open) return;
  if (event.key === "ArrowLeft") moveSlide(-1);
  if (event.key === "ArrowRight") moveSlide(1);
});
