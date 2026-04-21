import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LS_URL = "SMALL_RUNS_SUPABASE_URL";
const LS_ANON = "SMALL_RUNS_SUPABASE_ANON_KEY";

const el = {
  btnOpenSettings: document.getElementById("btnOpenSettings"),
  btnCloseSettings: document.getElementById("btnCloseSettings"),
  btnClearSettings: document.getElementById("btnClearSettings"),
  btnSignOut: document.getElementById("btnSignOut"),
  settings: document.getElementById("settings"),
  settingsForm: document.getElementById("settingsForm"),
  supabaseUrl: document.getElementById("supabaseUrl"),
  supabaseAnonKey: document.getElementById("supabaseAnonKey"),
  auth: document.getElementById("auth"),
  signInForm: document.getElementById("signInForm"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  app: document.getElementById("app"),
  error: document.getElementById("error"),
  btnRefresh: document.getElementById("btnRefresh"),
  btnAddItem: document.getElementById("btnAddItem"),
  inventoryRows: document.getElementById("inventoryRows"),
  kpiInventoryCount: document.getElementById("kpiInventoryCount"),
  kpiLowStock: document.getElementById("kpiLowStock"),
  itemDialog: document.getElementById("itemDialog"),
  itemForm: document.getElementById("itemForm"),
  itemDialogTitle: document.getElementById("itemDialogTitle"),
  itemId: document.getElementById("itemId"),
  itemSku: document.getElementById("itemSku"),
  itemName: document.getElementById("itemName"),
  itemOnHand: document.getElementById("itemOnHand"),
  itemLowStock: document.getElementById("itemLowStock"),
};

function show(node, yes = true) {
  node.hidden = !yes;
}

function setError(message) {
  if (!message) {
    show(el.error, false);
    el.error.textContent = "";
    return;
  }
  el.error.textContent = message;
  show(el.error, true);
}

function getConfig() {
  const url = localStorage.getItem(LS_URL) || "";
  const anon = localStorage.getItem(LS_ANON) || "";
  return { url, anon };
}

function setConfig(url, anon) {
  localStorage.setItem(LS_URL, url.trim());
  localStorage.setItem(LS_ANON, anon.trim());
}

function clearConfig() {
  localStorage.removeItem(LS_URL);
  localStorage.removeItem(LS_ANON);
}

let supabase = null;

async function ensureClient() {
  const { url, anon } = getConfig();
  if (!url || !anon) return null;
  if (!supabase) supabase = createClient(url, anon);
  return supabase;
}

async function refreshUI() {
  setError("");
  const client = await ensureClient();
  if (!client) {
    show(el.settings, true);
    show(el.auth, false);
    show(el.app, false);
    show(el.btnSignOut, false);
    return;
  }

  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    show(el.settings, false);
    show(el.auth, true);
    show(el.app, false);
    show(el.btnSignOut, false);
    return;
  }

  show(el.settings, false);
  show(el.auth, false);
  show(el.app, true);
  show(el.btnSignOut, true);
  await loadInventory();
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

function renderRow(item) {
  const tr = document.createElement("tr");
  const low = Number(item.on_hand) <= Number(item.low_stock_threshold);
  tr.innerHTML = `
    <td><code>${escapeHtml(item.sku)}</code></td>
    <td>${escapeHtml(item.name)}</td>
    <td class="right">${Number(item.on_hand)}</td>
    <td class="right">${Number(item.low_stock_threshold)}${low ? " <span style=\"color:#ffb3b3\">(low)</span>" : ""}</td>
    <td class="right">${escapeHtml(formatDate(item.updated_at))}</td>
    <td class="right"><button class="ghost" data-action="edit" data-id="${item.id}">Edit</button></td>
  `;
  return tr;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadInventory() {
  setError("");
  const client = await ensureClient();
  if (!client) return;

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
  const client = await ensureClient();
  if (!client) return;

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

// Settings UI
el.btnOpenSettings.addEventListener("click", () => {
  const { url, anon } = getConfig();
  el.supabaseUrl.value = url;
  el.supabaseAnonKey.value = anon;
  show(el.settings, true);
});

el.btnCloseSettings.addEventListener("click", () => {
  show(el.settings, false);
});

el.btnClearSettings.addEventListener("click", () => {
  clearConfig();
  supabase = null;
  show(el.settings, false);
  refreshUI();
});

el.settingsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setConfig(el.supabaseUrl.value, el.supabaseAnonKey.value);
  supabase = null;
  show(el.settings, false);
  await refreshUI();
});

// Auth
el.signInForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  setError("");
  const client = await ensureClient();
  if (!client) return;

  const { error } = await client.auth.signInWithPassword({
    email: el.email.value.trim(),
    password: el.password.value,
  });
  if (error) {
    setError(`Sign-in failed: ${error.message}`);
    return;
  }
  await refreshUI();
});

el.btnSignOut.addEventListener("click", async () => {
  const client = await ensureClient();
  if (!client) return;
  await client.auth.signOut();
  await refreshUI();
});

// App actions
el.btnRefresh.addEventListener("click", () => loadInventory());
el.btnAddItem.addEventListener("click", () => openItemDialog("add"));

el.inventoryRows.addEventListener("click", async (e) => {
  const btn = e.target?.closest?.("button[data-action='edit']");
  if (!btn) return;

  const id = btn.getAttribute("data-id");
  const client = await ensureClient();
  if (!client) return;

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

el.itemForm.addEventListener("submit", async (e) => {
  // method=dialog will close automatically, but we want to block close on error.
  e.preventDefault();
  await upsertItem();
  if (!el.error.hidden) return;
  el.itemDialog.close();
});

// Boot
await refreshUI();

