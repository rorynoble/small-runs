const LS_ORDER_V2 = "SMALL_RUNS_ORDER_STATE_V2";
const LS_ORDER_V1 = "SMALL_RUNS_ORDER_STATE_V1";

const PRODUCTS = [
  { id: "tshirt", name: "T Shirt", price: 20, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "hoodie", name: "Hoodie", price: 50, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "sweatshirt", name: "Sweatshirt", price: 50, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "jacket", name: "Jacket", price: 70, sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
  { id: "trucker_cap", name: "Trucker Cap", price: 15, sizes: ["OS"] },
  { id: "bucket_hat", name: "Bucket Hat", price: 20, sizes: ["OS"] },
];

const OUTLINES = {
  tshirt: `
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M130 40 L170 20 H250 L290 40 L340 70 L310 115 L280 95 V270 H140 V95 L110 115 L80 70 L130 40 Z" stroke="rgba(13,13,13,0.35)" stroke-width="3"/>
      <path d="M170 20 C175 52,245 52,250 20" stroke="rgba(13,13,13,0.35)" stroke-width="3"/>
    </svg>
  `,
  hoodie: `
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Silhouette -->
      <path d="M140 62 L170 32 H250 L280 62 L335 92 L314 148 L288 134 V270 H132 V134 L106 148 L85 92 L140 62 Z" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linejoin="round"/>

      <!-- Hood -->
      <path d="M170 32 C152 98 268 98 250 32" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>
      <path d="M178 45 C168 92 252 92 242 45" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>

      <!-- Drawstrings -->
      <path d="M198 110 L205 148" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>
      <path d="M222 110 L215 148" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>

      <!-- Kangaroo pocket -->
      <path d="M168 176 H252 C263 176 270 183 270 194 V236 H150 V194 C150 183 157 176 168 176 Z" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M150 206 H270" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>

      <!-- Ribbing -->
      <path d="M132 258 H288" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  sweatshirt: `
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Silhouette -->
      <path d="M140 62 L170 32 H250 L280 62 L335 92 L314 148 L288 134 V270 H132 V134 L106 148 L85 92 L140 62 Z" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linejoin="round"/>

      <!-- Crew neck -->
      <path d="M175 32 C182 58 238 58 245 32" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>
      <path d="M175 38 C184 60 236 60 245 38" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>

      <!-- Shoulder seams -->
      <path d="M170 44 L140 62" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>
      <path d="M250 44 L280 62" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>

      <!-- Ribbing -->
      <path d="M132 258 H288" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  jacket: `
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Silhouette (anorak-style) -->
      <path d="M145 62 L170 32 H250 L275 62 L333 94 L312 148 L286 134 V270 H134 V134 L108 148 L87 94 L145 62 Z" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linejoin="round"/>

      <!-- Hood -->
      <path d="M170 32 C152 96 268 96 250 32" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>
      <path d="M178 45 C168 90 252 90 242 45" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>

      <!-- Zipper -->
      <path d="M210 92 L210 270" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>

      <!-- Panel seam + pocket -->
      <path d="M138 150 H282" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>
      <path d="M160 170 H260 C268 170 272 174 272 182 V210 H148 V182 C148 174 152 170 160 170 Z" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M158 188 H262" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>

      <!-- Ribbing -->
      <path d="M134 258 H286" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
  trucker_cap: `
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Crown (front-on) -->
      <path d="M120 200 C120 120 165 80 210 80 C255 80 300 120 300 200" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>
      <path d="M120 200 C145 225 175 235 210 235 C245 235 275 225 300 200" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>

      <!-- Front panel seams -->
      <path d="M210 92 L210 225" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>
      <path d="M155 200 C160 150 180 115 210 92" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>
      <path d="M265 200 C260 150 240 115 210 92" stroke="rgba(13,13,13,0.20)" stroke-width="3" stroke-linecap="round"/>

      <!-- Brim -->
      <path d="M135 215 C170 255 250 255 285 215" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>
      <path d="M110 225 C155 285 265 285 310 225" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>

      <!-- Top button -->
      <circle cx="210" cy="74" r="6" stroke="rgba(13,13,13,0.25)" stroke-width="3" />
    </svg>
  `,
  bucket_hat: `
    <svg viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Crown -->
      <path d="M165 78 H255 L270 145 H150 L165 78 Z" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linejoin="round"/>
      <path d="M150 145 H270" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>

      <!-- Brim -->
      <path d="M120 165 C155 250 265 250 300 165" stroke="rgba(13,13,13,0.35)" stroke-width="3" stroke-linecap="round"/>
      <path d="M132 172 C162 230 258 230 288 172" stroke="rgba(13,13,13,0.25)" stroke-width="3" stroke-linecap="round"/>

      <!-- Stitch hints -->
      <path d="M150 182 C170 206 250 206 270 182" stroke="rgba(13,13,13,0.18)" stroke-width="3" stroke-linecap="round"/>
      <path d="M145 197 C168 220 252 220 275 197" stroke="rgba(13,13,13,0.18)" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,
};

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
  btnAddItem: document.getElementById("btnAddItem"),
  runEmpty: document.getElementById("runEmpty"),
  runItems: document.getElementById("runItems"),
  mockupWrap: document.getElementById("mockupWrap"),
  mockupOutline: document.getElementById("mockupOutline"),
  mockupImgWrap: document.getElementById("mockupImgWrap"),
  mockupImg: document.getElementById("mockupImg"),
  mockupScale: document.getElementById("mockupScale"),
};

function productById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatCurrency(n) {
  const v = Math.max(0, Math.round(Number(n) || 0));
  return `$${v.toLocaleString()}`;
}

function blankDraft() {
  return {
    productId: "",
    colour: "",
    sizes: {},
    logoName: "",
    logoDataUrl: "",
    mockup: { x: 0, y: 0, scale: 1 },
    editIndex: null,
  };
}

function blankState() {
  return {
    items: [],
    draft: blankDraft(),
    notes: "",
  };
}

function normalizeItem(raw) {
  if (!raw || typeof raw !== "object") return null;
  const p = productById(raw.productId);
  if (!p) return null;
  const sizes = {};
  for (const s of p.sizes) sizes[s] = Math.max(0, Math.floor(Number(raw.sizes?.[s] || 0)));
  const mock = raw.mockup && typeof raw.mockup === "object" ? raw.mockup : {};
  return {
    productId: p.id,
    colour: typeof raw.colour === "string" ? raw.colour : "",
    sizes,
    logoName: typeof raw.logoName === "string" ? raw.logoName : "",
    logoDataUrl: typeof raw.logoDataUrl === "string" ? raw.logoDataUrl : "",
    mockup: {
      x: Number(mock.x) || 0,
      y: Number(mock.y) || 0,
      scale: Math.min(2, Math.max(0.25, Number(mock.scale) || 1)),
    },
  };
}

function migrateFromV1(parsed) {
  const out = blankState();
  out.notes = typeof parsed?.notes === "string" ? parsed.notes : "";
  const selected = parsed?.selected && typeof parsed.selected === "object" ? parsed.selected : {};
  const logoName = typeof parsed?.logoName === "string" ? parsed.logoName : "";

  for (const productId of Object.keys(selected)) {
    const p = productById(productId);
    if (!p) continue;
    const entry = selected[productId] && typeof selected[productId] === "object" ? selected[productId] : {};
    const sizes = {};
    for (const s of p.sizes) sizes[s] = Math.max(0, Math.floor(Number(entry?.sizes?.[s] || 0)));
    out.items.push({
      productId,
      colour: typeof entry.colour === "string" ? entry.colour : "",
      sizes,
      logoName,
      logoDataUrl: "",
      mockup: { x: 0, y: 0, scale: 1 },
    });
  }

  return out;
}

function loadState() {
  try {
    const raw = localStorage.getItem(LS_ORDER_V2);
    if (raw) {
      const parsed = JSON.parse(raw);
      const st = blankState();
      st.notes = typeof parsed?.notes === "string" ? parsed.notes : "";
      st.items = Array.isArray(parsed?.items) ? parsed.items.map(normalizeItem).filter(Boolean) : [];
      const draft = parsed?.draft && typeof parsed.draft === "object" ? parsed.draft : {};
      const draftNormalized = blankDraft();
      if (typeof draft.productId === "string" && productById(draft.productId)) {
        draftNormalized.productId = draft.productId;
        const p = productById(draftNormalized.productId);
        for (const s of p.sizes) draftNormalized.sizes[s] = Math.max(0, Math.floor(Number(draft?.sizes?.[s] || 0)));
      }
      draftNormalized.colour = typeof draft.colour === "string" ? draft.colour : "";
      draftNormalized.logoName = typeof draft.logoName === "string" ? draft.logoName : "";
      draftNormalized.logoDataUrl = typeof draft.logoDataUrl === "string" ? draft.logoDataUrl : "";
      draftNormalized.mockup = {
        x: Number(draft?.mockup?.x) || 0,
        y: Number(draft?.mockup?.y) || 0,
        scale: Math.min(2, Math.max(0.25, Number(draft?.mockup?.scale) || 1)),
      };
      draftNormalized.editIndex = typeof draft.editIndex === "number" ? draft.editIndex : null;
      st.draft = draftNormalized;
      return st;
    }

    const rawV1 = localStorage.getItem(LS_ORDER_V1);
    if (rawV1) {
      const parsed = JSON.parse(rawV1);
      const migrated = migrateFromV1(parsed);
      localStorage.setItem(LS_ORDER_V2, JSON.stringify(migrated));
      return migrated;
    }

    return blankState();
  } catch {
    return blankState();
  }
}

function safeDraftForSave(draft) {
  const out = {
    productId: draft.productId,
    colour: draft.colour,
    sizes: draft.sizes,
    logoName: draft.logoName,
    mockup: draft.mockup,
    editIndex: draft.editIndex,
  };

  // LocalStorage can choke on huge images. Keep a small preview only.
  if (typeof draft.logoDataUrl === "string" && draft.logoDataUrl.length > 0 && draft.logoDataUrl.length < 250_000) {
    out.logoDataUrl = draft.logoDataUrl;
  } else {
    out.logoDataUrl = "";
  }

  return out;
}

function saveState() {
  localStorage.setItem(
    LS_ORDER_V2,
    JSON.stringify({
      items: state.items,
      notes: state.notes,
      draft: safeDraftForSave(state.draft),
    }),
  );
}

function draftUnits() {
  const p = productById(state.draft.productId);
  if (!p) return 0;
  return p.sizes.reduce((sum, s) => sum + (Number(state.draft.sizes?.[s] || 0) || 0), 0);
}

function itemUnits(item) {
  const p = productById(item.productId);
  if (!p) return 0;
  return p.sizes.reduce((sum, s) => sum + (Number(item.sizes?.[s] || 0) || 0), 0);
}

function getTotalUnits() {
  return state.items.reduce((sum, it) => sum + itemUnits(it), 0);
}

function getQuoteTotal() {
  return state.items.reduce((sum, it) => {
    const p = productById(it.productId);
    if (!p) return sum;
    return sum + itemUnits(it) * (Number(p.price) || 0);
  }, 0);
}

function countArtwork() {
  return state.items.reduce((sum, it) => sum + (it.logoName ? 1 : 0), 0);
}

function setDraftProduct(productId) {
  const p = productById(productId);
  if (!p) return;

  const hasWork =
    state.draft.productId &&
    (draftUnits() > 0 ||
      (state.draft.colour || "").trim() ||
      (state.draft.logoName || "").trim() ||
      (state.draft.logoDataUrl || "").trim());

  if (hasWork && state.draft.productId !== productId) {
    const ok = window.confirm("Switch product and discard the current in-progress item?");
    if (!ok) return;
  }

  const next = blankDraft();
  next.productId = p.id;
  for (const s of p.sizes) next.sizes[s] = 0;
  state.draft = next;

  // Reset file input
  if (el.logoInput) el.logoInput.value = "";

  saveState();
  render();

  // Nudge user forward
  document.getElementById("sizes")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setDraftSize(size, qty) {
  const p = productById(state.draft.productId);
  if (!p) return;
  if (!p.sizes.includes(size)) return;
  state.draft.sizes[size] = Math.max(0, Math.floor(Number(qty) || 0));
  saveState();
  renderLineItems();
  renderKpis();
}

function renderProductGrid() {
  el.productGrid.innerHTML = "";

  for (const p of PRODUCTS) {
    const div = document.createElement("div");
    div.className = `tile${state.draft.productId === p.id ? " selected" : ""}`;
    div.setAttribute("role", "button");
    div.setAttribute("tabindex", "0");
    div.dataset.id = p.id;
    div.innerHTML = `
      <div class="tile-title">${escapeHtml(p.name)}</div>
      <div class="tile-sub">${p.sizes.includes("OS") ? "One size" : "Sizes XS–2XL"} • ${formatCurrency(p.price)}</div>
    `;
    div.addEventListener("click", () => setDraftProduct(p.id));
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setDraftProduct(p.id);
      }
    });
    el.productGrid.appendChild(div);
  }
}

function renderLineItems() {
  const p = productById(state.draft.productId);
  el.lineItems.innerHTML = "";
  el.sizesEmpty.hidden = Boolean(p);

  if (!p) return;

  const total = draftUnits();
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
        <input id="draftColour" type="text" placeholder="e.g. Black / White" value="${escapeHtml(state.draft.colour || "")}" />
      </div>
      <div class="meta">
        <div class="meta-label">Unit price</div>
        <div class="meta-value">${formatCurrency(p.price)}</div>
      </div>
    </div>
    <div class="sizes-grid" data-product="${escapeHtml(p.id)}"></div>
  `;

  const colourInput = line.querySelector("#draftColour");
  colourInput.addEventListener("input", () => {
    state.draft.colour = colourInput.value;
    saveState();
  });

  const grid = line.querySelector(".sizes-grid");
  for (const size of p.sizes) {
    const wrap = document.createElement("div");
    wrap.className = "size";
    const value = Number(state.draft.sizes?.[size] || 0);
    wrap.innerHTML = `
      <label>${escapeHtml(size)}</label>
      <input inputmode="numeric" pattern="[0-9]*" type="number" min="0" step="1" value="${value}" data-size="${escapeHtml(size)}" />
    `;
    const input = wrap.querySelector("input");
    input.addEventListener("input", () => setDraftSize(size, input.value));
    grid.appendChild(wrap);
  }

  el.lineItems.appendChild(line);
}

function renderKpis() {
  el.kpiProducts.textContent = String(state.items.length);
  el.kpiUnits.textContent = String(getTotalUnits());
  el.kpiLogo.textContent = String(countArtwork());
  el.kpiQuote.textContent = formatCurrency(getQuoteTotal());

  el.logoName.textContent = state.draft.logoName || "No file selected";

  if (state.items.length === 0) el.orderBadge.textContent = "Draft run";
  else el.orderBadge.textContent = "Draft run";
}

function renderRunItems() {
  el.runItems.innerHTML = "";
  el.runEmpty.hidden = state.items.length !== 0;

  state.items.forEach((it, idx) => {
    const p = productById(it.productId);
    if (!p) return;

    const units = itemUnits(it);
    const lineTotal = units * (Number(p.price) || 0);

    const node = document.createElement("div");
    node.className = "run-item";
    node.innerHTML = `
      <div class="run-item-head">
        <div class="run-item-title">${escapeHtml(p.name)} • ${units} units • ${formatCurrency(lineTotal)}</div>
        <div class="run-item-actions">
          <button class="btn btn-ghost" type="button" data-edit="${idx}">Edit</button>
          <button class="btn" type="button" data-remove="${idx}">Remove</button>
        </div>
      </div>
      <div class="run-item-body">
        <div class="muted">Colour: ${escapeHtml((it.colour || "").trim() || "—")}</div>
        <div class="muted">Artwork: ${escapeHtml(it.logoName || "—")}</div>
      </div>
    `;

    node.querySelector("button[data-edit]")?.addEventListener("click", () => {
      const item = state.items[idx];
      const normalized = normalizeItem(item);
      if (!normalized) return;
      state.draft = {
        ...blankDraft(),
        ...normalized,
        editIndex: idx,
      };
      if (el.logoInput) el.logoInput.value = "";
      saveState();
      render();
      document.getElementById("sizes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    node.querySelector("button[data-remove]")?.addEventListener("click", () => {
      const ok = window.confirm("Remove this product from the run?");
      if (!ok) return;
      state.items.splice(idx, 1);
      saveState();
      render();
    });

    el.runItems.appendChild(node);
  });
}

function buildSummaryText() {
  const lines = [];
  lines.push("SMALL RUNS ORDER");
  lines.push("");

  if (state.items.length === 0) {
    lines.push("(No products added yet)");
  } else {
    state.items.forEach((it) => {
      const p = productById(it.productId);
      if (!p) return;
      const units = itemUnits(it);
      const sizes = it.sizes || {};
      const colour = (it.colour || "").trim();
      const parts = p.sizes
        .map((s) => ({ s, n: Number(sizes[s] || 0) }))
        .filter((x) => x.n > 0)
        .map((x) => `${x.s}:${x.n}`);

      const art = it.logoName ? ` (Artwork: ${it.logoName})` : "";
      lines.push(
        `${p.name} @ ${formatCurrency(p.price)}${colour ? ` (Colour: ${colour})` : ""}${art}: ${parts.length ? parts.join(" ") : "(no qty yet)"}`,
      );
      lines.push(`  Units: ${units}  Line total: ${formatCurrency(units * (Number(p.price) || 0))}`);
    });
  }

  lines.push("");
  lines.push(`Total units: ${getTotalUnits()}`);
  lines.push(`Quote total: ${formatCurrency(getQuoteTotal())}`);

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
    window.prompt("Copy this:", text);
  }
}

function resetAll() {
  const ok = window.confirm("Reset the whole run?");
  if (!ok) return;
  state = blankState();
  localStorage.removeItem(LS_ORDER_V2);
  localStorage.removeItem(LS_ORDER_V1);
  if (el.logoInput) el.logoInput.value = "";
  render();
}

function showMockupIfPossible() {
  const p = productById(state.draft.productId);
  const hasPreview = Boolean(state.draft.logoDataUrl) && /^data:image\//.test(state.draft.logoDataUrl);

  if (!p || !hasPreview) {
    el.mockupWrap.hidden = true;
    return;
  }

  el.mockupWrap.hidden = false;
  el.mockupOutline.innerHTML = OUTLINES[p.id] || "";

  // Initialize image
  el.mockupImg.src = state.draft.logoDataUrl;

  // Reasonable base size
  const base = p.id.includes("cap") || p.id.includes("hat") ? 140 : 180;
  el.mockupImg.style.width = `${base}px`;

  // Scale control
  el.mockupScale.value = String(state.draft.mockup.scale || 1);

  // Position + scale
  const x = Number(state.draft.mockup.x) || 0;
  const y = Number(state.draft.mockup.y) || 0;
  const scale = Math.min(2, Math.max(0.25, Number(state.draft.mockup.scale) || 1));

  el.mockupImgWrap.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
  el.mockupImg.style.transform = `scale(${scale})`;
}

let drag = null;
function bindMockup() {
  el.mockupScale.addEventListener("input", () => {
    state.draft.mockup.scale = Math.min(2, Math.max(0.25, Number(el.mockupScale.value) || 1));
    saveState();
    showMockupIfPossible();
  });

  const onDown = (e) => {
    if (el.mockupWrap.hidden) return;
    drag = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: Number(state.draft.mockup.x) || 0,
      origY: Number(state.draft.mockup.y) || 0,
    };
    el.mockupImgWrap.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onMove = (e) => {
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    // Simple clamp to keep things roughly in frame
    const box = el.mockupImgWrap.parentElement?.getBoundingClientRect();
    const maxX = box ? box.width * 0.45 : 9999;
    const maxY = box ? box.height * 0.45 : 9999;

    state.draft.mockup.x = Math.max(-maxX, Math.min(maxX, drag.origX + dx));
    state.draft.mockup.y = Math.max(-maxY, Math.min(maxY, drag.origY + dy));

    showMockupIfPossible();
  };

  const onUp = (e) => {
    if (!drag || drag.pointerId !== e.pointerId) return;
    drag = null;
    saveState();
  };

  el.mockupImgWrap.addEventListener("pointerdown", onDown);
  el.mockupImgWrap.addEventListener("pointermove", onMove);
  el.mockupImgWrap.addEventListener("pointerup", onUp);
  el.mockupImgWrap.addEventListener("pointercancel", onUp);
}

function commitDraft() {
  const p = productById(state.draft.productId);
  if (!p) {
    window.alert("Select a product first.");
    return;
  }

  const units = draftUnits();
  if (units <= 0) {
    window.alert("Add at least 1 unit before adding to the run.");
    return;
  }

  if (!state.draft.logoName) {
    const ok = window.confirm("No artwork uploaded yet. Add this product to the run anyway?");
    if (!ok) return;
  }

  const item = normalizeItem({
    productId: state.draft.productId,
    colour: state.draft.colour,
    sizes: state.draft.sizes,
    logoName: state.draft.logoName,
    logoDataUrl: state.draft.logoDataUrl,
    mockup: state.draft.mockup,
  });
  if (!item) return;

  if (typeof state.draft.editIndex === "number" && state.draft.editIndex >= 0) {
    state.items[state.draft.editIndex] = item;
  } else {
    state.items.push(item);
  }

  state.draft = blankDraft();
  if (el.logoInput) el.logoInput.value = "";

  saveState();
  render();

  document.getElementById("run")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function render() {
  renderProductGrid();
  renderLineItems();
  renderRunItems();
  renderKpis();
  showMockupIfPossible();
}

let state = loadState();

// Bindings
el.btnReset.addEventListener("click", resetAll);
el.btnCopy.addEventListener("click", copySummary);
el.btnAddItem.addEventListener("click", commitDraft);

el.notes.value = state.notes;
el.notes.addEventListener("input", () => {
  state.notes = el.notes.value;
  saveState();
});

el.logoInput.addEventListener("change", () => {
  const file = el.logoInput.files?.[0];
  state.draft.logoName = file ? file.name : "";
  state.draft.logoDataUrl = "";

  if (file && file.type && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      state.draft.logoDataUrl = typeof reader.result === "string" ? reader.result : "";
      state.draft.mockup = { x: 0, y: 0, scale: 1 };
      saveState();
      renderKpis();
      showMockupIfPossible();
    };
    reader.readAsDataURL(file);
  } else {
    saveState();
    renderKpis();
    showMockupIfPossible();
  }
});

bindMockup();

// Boot
render();
