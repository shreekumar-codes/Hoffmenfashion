/* ==========================================================================
   HOFFMEN — interaction layer
   - fixed header: transparent -> solid Rich Black on scroll (no shadows)
   - product grid render + chip filters
   - editorial slider driven by thin progress lines (per DESIGN.md)
   - newsletter "correspondence" form
   - mobile menu
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------- header scroll --------------------------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ------------------------------ products ----------------------------- */
  const PRODUCTS = [
    { name: "Double-Breasted Flannel Suit",  cat: "Tailoring",   filter: "tailoring",   price: "$2 400", tone: "ph-a", img: "photo-1539533018447-63fcce2678e3" },
    { name: "Single-Breasted Wool Blazer",   cat: "Tailoring",   filter: "tailoring",   price: "$1 850", tone: "ph-b", img: "photo-1617127365659-c47fa864d8bc" },
    { name: "Pleated High-Rise Trouser",     cat: "Tailoring",   filter: "tailoring",   price: "$780",   tone: "ph-c", img: "photo-1493397212122-2b85dda8106b" },
    { name: "Belted Charcoal Overcoat",      cat: "Outerwear",   filter: "outerwear",   price: "$2 950", tone: "ph-d", img: "photo-1552902865-b72c031ac5ea" },
    { name: "Oversized Wool Wrap Coat",      cat: "Outerwear",   filter: "outerwear",   price: "$3 100", tone: "ph-e", img: "photo-1551028719-00167b16eac5" },
    { name: "Quilted Cotton Field Jacket",   cat: "Outerwear",   filter: "outerwear",   price: "$1 420", tone: "ph-f", img: "photo-1576995853123-5a10305d93c0" },
    { name: "Cashmere Knit Polo",            cat: "Knitwear",    filter: "knitwear",    price: "$640",   tone: "ph-b", img: "photo-1489987707025-afc232f7ea0f" },
    { name: "Merino Roll-Neck Sweater",      cat: "Knitwear",    filter: "knitwear",    price: "$480",   tone: "ph-c", img: "photo-1591047139829-d91aecb6caea" },
    { name: "Silk-Cashmere Cardigan",        cat: "Knitwear",    filter: "knitwear",    price: "$890",   tone: "ph-d", img: "photo-1434389677669-e08b4cac3105" },
    { name: "Grain Leather Oxford",          cat: "Footwear",    filter: "footwear",    price: "$1 050", tone: "ph-a", img: "photo-1560393464-5c69a73c5770" },
    { name: "Suede Chelsea Boot",            cat: "Footwear",    filter: "footwear",    price: "$920",   tone: "ph-f", img: "photo-1543163521-1bf539c55dd2" },
    { name: "Italian Wool Scarf",            cat: "Accessories", filter: "accessories", price: "$260",   tone: "ph-e", img: "photo-1544441893-675973e31985" },
  ];

  const grid = document.getElementById("productGrid");
  const U = (id, w) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

  function render(filter) {
    const rows = PRODUCTS.filter((p) => filter === "all" || p.filter === filter);
    grid.innerHTML = rows.map((p) => `
      <article class="product-card">
        <div class="product-visual ph ${p.tone}">
          <img src="${U(p.img, 800)}" alt="${p.name}" loading="lazy" />
          <span class="ph-tag label-caps">${p.cat}</span>
        </div>
        <div class="product-info">
          <div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-cat label-caps">${p.cat}</p>
          </div>
          <div class="product-actions">
            <p class="product-price">${p.price}</p>
            <button class="add-to-bag" type="button" data-product="${p.name}">Add</button>
          </div>
        </div>
      </article>`).join("");
  }

  const bag = [];
  const panels = document.querySelectorAll(".utility-panel");
  const panelButtons = document.querySelectorAll("[data-panel]");
  const bagCount = document.getElementById("bagCount");
  const bagItems = document.getElementById("bagItems");
  const bagMessage = document.getElementById("bagMessage");
  const checkout = document.querySelector("[data-checkout]");
  const accountAction = document.querySelector("[data-account-action]");
  const accountNote = document.getElementById("accountNote");
  const checkoutNote = document.getElementById("checkoutNote");

  function closePanels() {
    panels.forEach((panel) => { panel.hidden = true; });
    panelButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
  }

  function updateBag() {
    bagCount.textContent = `(${bag.length})`;
    bagItems.innerHTML = bag.map((name) => `<div class="bag-item"><span>${name}</span><span>Added</span></div>`).join("");
    bagMessage.hidden = bag.length > 0;
    checkout.hidden = bag.length === 0;
  }

  panelButtons.forEach((button) => button.addEventListener("click", () => {
    closePanels();
    const panel = document.getElementById(button.dataset.panel);
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    if (button.dataset.panel === "searchPanel") document.getElementById("searchInput").focus();
  }));
  panels.forEach((panel) => panel.addEventListener("click", (e) => {
    if (e.target === panel || e.target.closest(".panel-close")) closePanels();
  }));

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    const result = PRODUCTS.find((product) => product.name.toLowerCase().includes(query.toLowerCase()));
    const note = document.getElementById("searchNote");
    note.textContent = query && result ? `Showing results for "${query}".` : "No exact match found. Explore the full collection below.";
    note.hidden = false;
    if (result) { closePanels(); document.querySelector(`[data-filter="${result.filter}"]`).click(); document.getElementById("shop").scrollIntoView(); }
  });

  document.addEventListener("click", (e) => {
    const addButton = e.target.closest(".add-to-bag");
    if (!addButton) return;
    bag.push(addButton.dataset.product);
    updateBag();
    document.querySelector("[data-panel=bagPanel]").click();
  });
  accountAction.addEventListener("click", () => {
    accountNote.hidden = false;
    accountAction.textContent = "Noted";
  });
  checkout.addEventListener("click", () => {
    checkoutNote.hidden = false;
    checkout.hidden = true;
  });

  /* ------------------------------- filters ------------------------------ */
  const filterRow = document.getElementById("filterRow");
  filterRow.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filterRow.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    render(chip.dataset.filter);
  });

  render("all");

  /* ---------------------------- editorial slider ------------------------ */
  const SLIDES = [
    { tag: "01 / 06", title: "The Ivory Statement", body: "A double-faced cashmere overcoat in bone, worn over a silk knit. Restraint as a form of luxury.", tone: "ph-a", img: "photo-1509631179647-0177331693ae" },
    { tag: "02 / 06", title: "The Night Tailoring", body: "Midnight wool tuxedo with a soft-shouldered construction, finished with a hand-rolled lapel.", tone: "ph-b", img: "photo-1516826957135-700dedea698c" },
    { tag: "03 / 06", title: "The Urban Knitwear", body: "Heavy-gauge merino in oxblood, layered against a charcoal field jacket for contrast.", tone: "ph-d", img: "photo-1548883354-7622d03aca27" },
    { tag: "04 / 06", title: "The Grey Ensemble", body: "Double-breasted wool flannel suit, cotton poplin shirt, and a charcoal overcoat. Tailored for movement, designed for stillness.", tone: "ph-f", img: "photo-1520975954732-35dd22299614" },
    { tag: "05 / 06", title: "The Camel Coat", body: "A single-breasted camel overcoat with raglan sleeves, cut long and architectural.", tone: "ph-e", img: "photo-1552902865-b72c031ac5ea" },
    { tag: "06 / 06", title: "The Final Look", body: "The collection closes in quiet black — a silhouette stripped to its essential line.", tone: "ph-c", img: "photo-1524504388940-b1c1722653e1" },
  ];

  const titleEl = document.getElementById("slideTitle");
  const bodyEl = document.getElementById("slideBody");
  const visualEl = document.getElementById("slideVisual");
  const noEl = document.getElementById("slideNo");
  const overlineEl = document.querySelector(".editorial-copy .overline");
  const progress = document.getElementById("sliderProgress");
  let current = 3; // 04 / 06 initial
  let timer = null;

  function buildProgress() {
    progress.innerHTML = "";
    SLIDES.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", s.tag);
      btn.dataset.index = String(i);
      btn.addEventListener("click", () => { current = i; showSlide(); restart(); });
      progress.appendChild(btn);
    });
  }

  function showSlide() {
    const s = SLIDES[current];
    titleEl.textContent = s.title;
    bodyEl.textContent = s.body;
    noEl.textContent = s.tag;
    overlineEl.textContent = "Lookbook · " + s.tag;
    visualEl.className = "editorial-visual ph " + s.tone;
    const img = document.getElementById("slideImg");
    if (img) img.src = U(s.img, 1200);
    [...progress.children].forEach((b, i) => b.classList.toggle("is-active", i === current));
  }

  function advance() { current = (current + 1) % SLIDES.length; showSlide(); }
  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(advance, 4200);
  }

  buildProgress();
  showSlide();
  restart();

  /* ----------------------------- newsletter ----------------------------- */
  const form = document.getElementById("newsletterForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) { note.textContent = "Please enter a valid email address."; note.hidden = false; return; }
    note.textContent = "Welcome to the correspondence list.";
    note.hidden = false;
    form.reset();
  });

  /* ----------------------------- mobile menu ---------------------------- */
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
