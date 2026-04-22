const LS_ORDER = "SMALL_RUNS_ORDER_STATE_V1";

const PRODUCTS = [
  { id: "tshirt", name: "T Shirt", price: 20, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "hoodie", name: "Hoodie", price: 50, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "sweatshirt", name: "Sweatshirt", price: 50, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "jacket", name: "Jacket", price: 70, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "trucker_cap", name: "Trucker Cap", price: 15, sizes: ["OS"] },
  { id: "bucket_hat", name: "Bucket Hat", price: 20, sizes: ["OS"] },
];

const el = {
  productGrid: document.getElementById("productGrid"),
  lineItems: document.getElementById("lineItems"),
  sizesEmpty: document.getElementById("sizesEmpty"),
  btnReset: document.getElementById("btnReset"),
  btnCopy: document.getElementById("btnCopy"),
  copyToast: document.getElementById("copyToast"),
  notes: document.getElementById("notes"),
  logoInput: document.getElementById("logoInput"),
  logoName: document.getElementById("logoName"),
  kpiProducts: document.getElementById("kpiProducts"),
  kpiUnits: document.getElementById("kpiUnits"),
  kpiLogo: document.getElementById("kpiLogo"),
  kpiQuote: document.getElementById("kpiQuote"),
  orderBadge: document.getElementById("orderBadge"),
};

function blankState() {
  return {
    selected: {}, // { [productId]: { colour?: string, sizes: { [size]: number } } }
    notes: "",
    logoName: "",
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_ORDER);
    if (!raw) return blankState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return blankState();
    return {
      selected: parsed.selected && typeof parsed.selected === "object" ? parsed.selected : {},
      notes: typeof parsed.notes === "string" ? parsed.notes : "",
      logoName: typeof parsed.logoName === "string" ? parsed.logoName : "",
    };
  } catch {
    return blankState();
  }
}

function saveState() {
  localStorage.setItem(LS_ORDER, JSON.stringify(state));
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function productById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function selectedIds() {
  return Object.keys(state.selected);
}

function getUnitsForProduct(productId) {
  const entry = state.selected[productId];
  if (!entry) return 0;
  return Object.values(entry.sizes || {}).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

function getTotalUnits() {
  return selectedIds().reduce((sum, id) => sum + getUnitsForProduct(id), 0);
}

function ensureEntry(productId) {
  const p = productById(productId);
  if (!p) return;
  if (!state.selected[productId]) {
    state.selected[productId] = { colour: "", sizes: {} };
  }
  if (typeof state.selected[productId].colour !== "string") state.selected[productId].colour = "";
  for (const size of p.sizes) {
    if (state.selected[productId].sizes[size] == null) state.selected[productId].sizes[size] = 0;
  }
}

function formatCurrency(n) {
  const v = Math.max(0, Math.round(Number(n) || 0));
  return `$${v.toLocaleString()}`;
}

function getQuoteTotal() {
  return selectedIds().reduce((sum, id) => {
    const p = productById(id);
    if (!p) return sum;
    return sum + getUnitsForProduct(id) * (Number(p.price) || 0);
  }, 0);
}

function toggleProduct(productId) {
  if (state.selected[productId]) {
    delete state.selected[productId];
  } else {
    ensureEntry(productId);
  }
  saveState();
  render();
}

function setSizeQty(productId, size, qty) {
  ensureEntry(productId);
  state.selected[productId].sizes[size] = Math.max(0, Math.floor(Number(qty) || 0));
  saveState();
  renderKpis();
  renderLineItems();
}

function renderProductGrid() {
  el.productGrid.innerHTML = "";
  for (const p of PRODUCTS) {
    const div = document.createElement("div");
    div.className = `tile${state.selected[p.id] ? " selected" : ""}`;
    div.setAttribute("role", "button");
    div.setAttribute("tabindex", "0");
    div.dataset.id = p.id;
    div.innerHTML = `
      <div class="tile-title">${escapeHtml(p.name)}</div>
      <div class="tile-sub">${p.sizes.includes("OS") ? "One size" : "Sizes XS–2XL"} • ${formatCurrency(p.price)}</div>
    `;
    div.addEventListener("click", () => toggleProduct(p.id));
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleProduct(p.id);
      }
    });
    el.productGrid.appendChild(div);
  }
}

function renderLineItems() {
  const ids = selectedIds();
  el.sizesEmpty.hidden = ids.length !== 0;
  el.lineItems.innerHTML = "";

  for (const id of ids) {
    const p = productById(id);
    if (!p) continue;
    ensureEntry(id);

    const total = getUnitsForProduct(id);
    const lineCost = total * (Number(p.price) || 0);
    const line = document.createElement("div");
    line.className = "line";
    line.innerHTML = `
      <div class="line-head">
        <div class="line-name">${escapeHtml(p.name)} • ${total} units</div>
        <div class="line-total">${formatCurrency(lineCost)}</div>
      </div>
      <div class="line-meta">
        <div class="meta">
          <div class="meta-label">Colour</div>
          <input type="text" placeholder="e.g. Black / White" value="${escapeHtml(state.selected[id].colour || "")}" data-colour="1" />
        </div>
        <div class="meta">
          <div class="meta-label">Unit price</div>
          <div class="meta-value">${formatCurrency(p.price)}</div>
        </div>
      </div>
      <div class="sizes-grid" data-product="${id}"></div>
    `;

    const colourInput = line.querySelector("input[data-colour]");
    colourInput.addEventListener("input", () => {
      state.selected[id].colour = colourInput.value;
      saveState();
    });

    const grid = line.querySelector(".sizes-grid");
    for (const size of p.sizes) {
      const wrap = document.createElement("div");
      wrap.className = "size";
      const value = Number(state.selected[id].sizes[size] || 0);
      wrap.innerHTML = `
        <label>${escapeHtml(size)}</label>
        <input inputmode="numeric" pattern="[0-9]*" type="number" min="0" step="1" value="${value}" data-size="${escapeHtml(size)}" />
      `;
      const input = wrap.querySelector("input");
      input.addEventListener("input", () => setSizeQty(id, size, input.value));
      grid.appendChild(wrap);
    }

    el.lineItems.appendChild(line);
  }
}

function renderKpis() {
  const ids = selectedIds();
  el.kpiProducts.textContent = String(ids.length);
  el.kpiUnits.textContent = String(getTotalUnits());
  el.kpiLogo.textContent = state.logoName ? "Yes" : "—";
  el.kpiQuote.textContent = formatCurrency(getQuoteTotal());
  el.logoName.textContent = state.logoName || "No file selected";

  if (ids.length === 0) el.orderBadge.textContent = "Draft order";
  else el.orderBadge.textContent = "Draft order";
}

function buildSummaryText() {
  const ids = selectedIds();
  const lines = [];
  lines.push("SMALL RUNS ORDER");
  lines.push("");
  for (const id of ids) {
    const p = productById(id);
    if (!p) continue;
    const sizes = state.selected[id]?.sizes || {};
    const colour = (state.selected[id]?.colour || "").trim();
    const parts = p.sizes
      .map((s) => ({ s, n: Number(sizes[s] || 0) }))
      .filter((x) => x.n > 0)
      .map((x) => `${x.s}:${x.n}`);
    lines.push(`${p.name} @ ${formatCurrency(p.price)}${colour ? ` (Colour: ${colour})` : ""}: ${parts.length ? parts.join(" ") : "(no qty yet)"}`);
  }
  lines.push("");
  lines.push(`Total units: ${getTotalUnits()}`);
  lines.push(`Quote total: ${formatCurrency(getQuoteTotal())}`);
  lines.push(`Logo: ${state.logoName || "(not selected)"}`);
  if (state.notes.trim()) {
    lines.push("");
    lines.push("Notes:");
    lines.push(state.notes.trim());
  }
  return lines.join("\n");
}

async function copySummary() {
  const text = buildSummaryText();
  try {
    await navigator.clipboard.writeText(text);
    el.copyToast.hidden = false;
    setTimeout(() => (el.copyToast.hidden = true), 1000);
  } catch {
    // Fallback: prompt
    window.prompt("Copy this:", text);
  }
}

function resetAll() {
  state = blankState();
  localStorage.removeItem(LS_ORDER);
  render();
}

function render() {
  renderProductGrid();
  renderLineItems();
  renderKpis();
}

let state = loadState();

// Bindings
el.btnReset.addEventListener("click", resetAll);
el.btnCopy.addEventListener("click", copySummary);

el.notes.value = state.notes;
el.notes.addEventListener("input", () => {
  state.notes = el.notes.value;
  saveState();
});

el.logoInput.addEventListener("change", () => {
  const file = el.logoInput.files?.[0];
  state.logoName = file ? file.name : "";
  saveState();
  renderKpis();
});

// Boot
render();
