import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LS_URL = "SMALL_RUNS_SUPABASE_URL";
const LS_ANON = "SMALL_RUNS_SUPABASE_ANON_KEY";
const LS_LOCAL_INVENTORY = "SMALL_RUNS_LOCAL_INVENTORY_ITEMS";

const el = {
  modeBadge: document.getElementById("modeBadge"),

  btnOpenSettings: document.getElementById("btnOpenSettings"),
  settingsDialog: document.getElementById("settingsDialog"),
  btnCloseSettings: document.getElementById("btnCloseSettings"),
  btnClearSettings: document.getElementById("btnClearSettings"),
  settingsForm: document.getElementById("settingsForm"),
  supabaseUrl: document.getElementById("supabaseUrl"),
  supabaseAnonKey: document.getElementById("supabaseAnonKey"),

  btnOpenSignIn: document.getElementById("btnOpenSignIn"),
  signInDialog: document.getElementById("signInDialog"),
  btnCloseSignIn: document.getElementById("btnCloseSignIn"),
  signInForm: document.getElementById("signInForm"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  btnSignOut: document.getElementById("btnSignOut"),

  error: document.getElementById("error"),
  btnRefresh: document.getElementById("btnRefresh"),
  btnAddItem: document.getElementById("btnAddItem"),
  inventoryRows: document.getElementById("inventoryRows"),
  kpiInventoryCount: document.getElementById("kpiInventoryCount"),
  kpiLowStock: document.getElementById("kpiLowStock"),

  itemDialog: document.getElementById("itemDialog"),
  btnCloseItem: document.getElementById("btnCloseItem"),
  itemForm: document.getElementById("itemForm"),
  itemDialogTitle: document.getElementById("itemDialogTitle"),
  itemId: document.getElementById("itemId"),
  itemSku: document.getElementById("itemSku"),
  itemName: document.getElementById("itemName"),
  itemOnHand: document.getElementById("itemOnHand"),
  itemLowStock: document.getElementById("itemLowStock"),
};

function setError(message) {
  if (!message) {
    el.error.hidden = true;
    el.error.textContent = "";
    return;
  }
  el.error.textContent = message;
  el.error.hidden = false;
}

function getConfig() {
  const url = (localStorage.getItem(LS_URL) || "").trim();
  const anon = (localStorage.getItem(LS_ANON) || "").trim();
  return { url, anon };
}

function setConfig(url, anon) {
  localStorage.setItem(LS_URL, String(url || "").trim());
  localStorage.setItem(LS_ANON, String(anon || "").trim());
}

function clearConfig() {
  localStorage.removeItem(LS_URL);
  localStorage.removeItem(LS_ANON);
}

function readLocalInventory() {
  try {
    const raw = localStorage.getItem(LS_LOCAL_INVENTORY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeLocalInventory(items) {
  localStorage.setItem(LS_LOCAL_INVENTORY, JSON.stringify(items));
}

let supabase = null;

function resetSupabaseClient() {
  supabase = null;
}

async function ensureClient() {
  const { url, anon } = getConfig();
  if (!url || !anon) return null;
  if (!supabase) supabase = createClient(url, anon);
  return supabase;
}

async function getSupabaseSession() {
  const client = await ensureClient();
  if (!client) return { client: null, session: null };
  const { data: { session } } = await client.auth.getSession();
  return { client, session: session ?? null };
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function renderRow(item) {
  const tr = document.createElement("tr");
  const low = Number(item.on_hand) <= Number(item.low_stock_threshold);
  tr.innerHTML = `
    <td><code>${escapeHtml(item.sku)}</code></td>
    <td>${escapeHtml(item.name)}</td>
    <td class="right">${Number(item.on_hand)}</td>
    <td class="right">${Number(item.low_stock_threshold)}${low ? " <span class=\"pill-low\">low</span>" : ""}</td>
    <td class="right">${escapeHtml(formatDate(item.updated_at))}</td>
    <td class="right"><button class="btn btn-ghost" data-action="edit" data-id="${item.id}">Edit</button></td>
  `;
  return tr;
}

async function setModeBadge() {
  const { url, anon } = getConfig();
  const hasSupabase = Boolean(url && anon);
  const { session } = await getSupabaseSession();
  if (!hasSupabase) {
    el.modeBadge.textContent = "Local mode";
    return;
  }
  if (session) {
    el.modeBadge.textContent = "Supabase mode";
    return;
  }
  el.modeBadge.textContent = "Local mode (Supabase connected)";
}

async function refreshAuthButtons() {
  const { url, anon } = getConfig();
  const hasSupabase = Boolean(url && anon);
  const { session } = await getSupabaseSession();

  if (!hasSupabase) {
    el.btnOpenSignIn.hidden = true;
    el.btnSignOut.hidden = true;
    return;
  }

  el.btnOpenSignIn.hidden = Boolean(session);
  el.btnSignOut.hidden = !session;
}

async function loadInventory() {
  setError("");
  const { client, session } = await getSupabaseSession();

  // If Supabase isn’t configured OR we’re not signed in, fall back to local.
  if (!client || !session) {
    const data = readLocalInventory()
      .slice()
      .sort((a, b) => {
        const at = new Date(a.updated_at || 0).getTime() || 0;
        const bt = new Date(b.updated_at || 0).getTime() || 0;
        return bt - at;
      });
    el.inventoryRows.innerHTML = "";
    for (const item of data) el.inventoryRows.appendChild(renderRow(item));
    el.kpiInventoryCount.textContent = String(data.length);
    const lowCount = data.filter((i) => Number(i.on_hand) <= Number(i.low_stock_threshold)).length;
    el.kpiLowStock.textContent = String(lowCount);
    return;
  }

  const { data, error } = await client
    .from("inventory_items")
    .select("id, sku, name, on_hand, low_stock_threshold, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    setError(`Inventory load failed: ${error.message}`);
    return;
  }

  el.inventoryRows.innerHTML = "";
  for (const item of data) el.inventoryRows.appendChild(renderRow(item));

  el.kpiInventoryCount.textContent = String(data.length);
  const lowCount = data.filter((i) => Number(i.on_hand) <= Number(i.low_stock_threshold)).length;
  el.kpiLowStock.textContent = String(lowCount);
}

function openItemDialog(mode, item = null) {
  el.itemDialogTitle.textContent = mode === "edit" ? "Edit item" : "Add item";
  el.itemId.value = item?.id ?? "";
  el.itemSku.value = item?.sku ?? "";
  el.itemName.value = item?.name ?? "";
  el.itemOnHand.value = item?.on_hand ?? 0;
  el.itemLowStock.value = item?.low_stock_threshold ?? 0;
  el.itemDialog.showModal();
}

async function upsertItem() {
  setError("");
  const { client, session } = await getSupabaseSession();

  // Local mode
  if (!client || !session) {
    const now = new Date().toISOString();
    const items = readLocalInventory();
    const id = el.itemId.value || crypto.randomUUID();
    const next = {
      id,
      sku: el.itemSku.value.trim(),
      name: el.itemName.value.trim(),
      on_hand: Number(el.itemOnHand.value),
      low_stock_threshold: Number(el.itemLowStock.value),
      updated_at: now,
    };
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) items[idx] = { ...items[idx], ...next };
    else items.push(next);
    writeLocalInventory(items);
    await loadInventory();
    return;
  }

  const payload = {
    sku: el.itemSku.value.trim(),
    name: el.itemName.value.trim(),
    on_hand: Number(el.itemOnHand.value),
    low_stock_threshold: Number(el.itemLowStock.value),
  };
  const id = el.itemId.value || null;

  const query = id
    ? client.from("inventory_items").update(payload).eq("id", id)
    : client.from("inventory_items").insert(payload);

  const { error } = await query;
  if (error) {
    setError(`Save failed: ${error.message}`);
    return;
  }
  await loadInventory();
}

async function refreshTopUI() {
  await setModeBadge();
  await refreshAuthButtons();
}

// Settings
el.btnOpenSettings.addEventListener("click", () => {
  const { url, anon } = getConfig();
  el.supabaseUrl.value = url;
  el.supabaseAnonKey.value = anon;
  el.settingsDialog.showModal();
});

el.btnCloseSettings.addEventListener("click", () => {
  el.settingsDialog.close();
});

el.btnClearSettings.addEventListener("click", async () => {
  clearConfig();
  resetSupabaseClient();
  el.settingsDialog.close();
  await refreshTopUI();
  await loadInventory();
});

el.settingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setConfig(el.supabaseUrl.value, el.supabaseAnonKey.value);
  resetSupabaseClient();
  el.settingsDialog.close();
  await refreshTopUI();
  await loadInventory();
});

// Auth
el.btnOpenSignIn.addEventListener("click", () => {
  el.signInDialog.showModal();
});

el.btnCloseSignIn.addEventListener("click", () => {
  el.signInDialog.close();
});

el.signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");
  const client = await ensureClient();
  if (!client) {
    setError("Connect Supabase in Settings first.");
    return;
  }

  const { error } = await client.auth.signInWithPassword({
    email: el.email.value.trim(),
    password: el.password.value,
  });
  if (error) {
    setError(`Sign-in failed: ${error.message}`);
    return;
  }

  el.signInDialog.close();
  await refreshTopUI();
  await loadInventory();
});

el.btnSignOut.addEventListener("click", async () => {
  setError("");
  const client = await ensureClient();
  if (!client) return;
  await client.auth.signOut();
  await refreshTopUI();
  await loadInventory();
});

// Inventory actions
el.btnRefresh.addEventListener("click", () => loadInventory());
el.btnAddItem.addEventListener("click", () => openItemDialog("add"));

el.inventoryRows.addEventListener("click", async (e) => {
  const btn = e.target?.closest?.("button[data-action='edit']");
  if (!btn) return;
  const id = btn.getAttribute("data-id");

  const { client, session } = await getSupabaseSession();
  if (!client || !session) {
    const item = readLocalInventory().find((i) => i.id === id);
    if (!item) {
      setError("Item not found (local mode). Hit Refresh.");
      return;
    }
    openItemDialog("edit", item);
    return;
  }

  const { data, error } = await client
    .from("inventory_items")
    .select("id, sku, name, on_hand, low_stock_threshold")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    setError(`Load failed: ${error.message}`);
    return;
  }
  openItemDialog("edit", data);
});

el.btnCloseItem.addEventListener("click", () => {
  el.itemDialog.close();
});

el.itemForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await upsertItem();
  if (!el.error.hidden) return;
  el.itemDialog.close();
});

// Boot
await refreshTopUI();
await loadInventory();

