const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const defaults = {
  tabName: "APPLEBOTTOM UBG",
  siteName: "APPLEBOTTOM",
  homeTitle: "APPLEBOTTOM",
  homeSub: "Your calm little corner of the internet.",
  gamesTitle: "All games",
  recentTitle: "Recently added",
  accent: "#ff334f",
  cardSize: "medium",
  dark: true,
  bg: ""
};

let cfg = { ...defaults };
try {
  cfg = { ...defaults, ...JSON.parse(localStorage.getItem("applebottom_cfg") || "{}") };
} catch (_) {}

let games = [];
let editMode = false;
let currentGame = null;
let localGameUrl = null;
let gameCatalogLoaded = false;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function saveSettings() {
  localStorage.setItem("applebottom_cfg", JSON.stringify(cfg));
}

function saveLocalGames() {
  // Local additions are browser-only. Published games belong in games.json.
  localStorage.setItem("applebottom_local_games", JSON.stringify(games.filter(g => g.localOnly)));
}

function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
}

function applySettings() {
  document.documentElement.style.setProperty("--accent", cfg.accent || defaults.accent);
  document.title = cfg.tabName || defaults.tabName;
  document.body.classList.toggle("light", !cfg.dark);
  document.body.classList.remove("card-small", "card-large");
  if (cfg.cardSize === "small") document.body.classList.add("card-small");
  if (cfg.cardSize === "large") document.body.classList.add("card-large");

  if (cfg.bg) {
    document.body.classList.add("has-bg");
    document.documentElement.style.setProperty("--site-bg", `url(${cfg.bg})`);
  } else {
    document.body.classList.remove("has-bg");
  }

  $("#brandName").textContent = cfg.siteName;
  $("#heroName").textContent = cfg.homeTitle;
  $("#heroSub").textContent = cfg.homeSub;
  $("#gamesTitle").textContent = cfg.gamesTitle;
  $("#recentTitle").textContent = cfg.recentTitle;
  $("#countPill").textContent = games.length;
  $("#gameCountSide").textContent = games.length;

  $("#setTabName").value = cfg.tabName;
  $("#setSiteName").value = cfg.siteName;
  $("#setHomeTitle").value = cfg.homeTitle;
  $("#setHomeSub").value = cfg.homeSub;
  $("#setGamesTitle").value = cfg.gamesTitle;
  $("#setRecentTitle").value = cfg.recentTitle;
  $("#setAccent").value = cfg.accent;
  $("#setCardSize").value = cfg.cardSize;
  $("#darkToggle").classList.toggle("on", cfg.dark);
}

function normalizeGame(game, index = 0) {
  if (!game || typeof game !== "object") return null;

  const file = String(game.file || game.path || "").trim();
  const image = String(game.image || "").trim();
  const name = String(game.name || `Game ${index + 1}`).trim();

  if (!file && !game.localOnly) return null;

  return {
    id: String(game.id || `${name}-${index}`).toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${index}`,
    name,
    desc: String(game.desc || game.description || "Play now"),
    icon: String(game.icon || "🎮"),
    image,
    file,
    added: Number(game.added) || Date.now() - index,
    localOnly: !!game.localOnly
  };
}

function loadLocalGames() {
  try {
    const saved = JSON.parse(localStorage.getItem("applebottom_local_games") || "[]");
    return Array.isArray(saved) ? saved.map(normalizeGame).filter(Boolean) : [];
  } catch (_) {
    return [];
  }
}

async function loadGames() {
  let published = [];

  try {
    const response = await fetch("games.json", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      published = Array.isArray(data) ? data : (Array.isArray(data.games) ? data.games : []);
    }
  } catch (_) {
    // Opening the site directly as a file can block fetch(). GitHub Pages will work normally.
  }

  const local = loadLocalGames();
  const normalized = [...published, ...local]
    .map(normalizeGame)
    .filter(Boolean);

  const seen = new Set();
  games = normalized.filter((g) => {
    const key = `${g.name.toLowerCase()}|${g.file}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  gameCatalogLoaded = true;
  applySettings();
  render();
}

function createCard(game) {
  const el = document.createElement("article");
  el.className = "game-card";
  el.dataset.gameId = game.id;

  const thumbnail = game.image
    ? `<img src="${escapeHtml(game.image)}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='${escapeHtml(game.icon || "🎮")}'">`
    : escapeHtml(game.icon || "🎮");

  el.innerHTML = `
    <button class="card-edit" title="Edit game" type="button">✎</button>
    <div class="thumb">${thumbnail}</div>
    <div class="game-info">
      <div class="game-name">${escapeHtml(game.name)}</div>
      <div class="game-desc">${escapeHtml(game.desc || "Play now")}</div>
    </div>
  `;

  el.addEventListener("click", (event) => {
    if (event.target.closest(".card-edit")) return;
    openGame(game);
  });

  el.querySelector(".card-edit").addEventListener("click", (event) => {
    event.stopPropagation();
    if (!editMode) return;
    openEditor(game);
  });

  return el;
}

function render(list = games) {
  const sorted = [...games].sort((a, b) => b.added - a.added);
  const recent = sorted.slice(0, 6);

  $("#recentGrid").replaceChildren(...recent.map(createCard));
  $("#gamesGrid").replaceChildren(...list.map(createCard));

  const empty = $("#gamesEmpty");
  if (empty) empty.classList.toggle("hidden", list.length !== 0);

  $("#countPill").textContent = games.length;
  $("#gameCountSide").textContent = games.length;
}

function renderSearch(query) {
  const term = query.trim().toLowerCase();
  const result = term
    ? games.filter(g => g.name.toLowerCase().includes(term) || g.desc.toLowerCase().includes(term))
    : games;

  $("#searchMeta").textContent = `${result.length} game${result.length === 1 ? "" : "s"} found`;
  $("#searchGrid").replaceChildren(...result.map(createCard));
}

function showView(name) {
  $$(".view").forEach(v => v.classList.add("hidden"));
  const view = $(`#${name}View`);
  if (view) view.classList.remove("hidden");

  $$(".nav").forEach(btn => btn.classList.toggle("active", btn.dataset.nav === name));
  $("#pageTitle").textContent = name === "home" ? "Home" : name[0].toUpperCase() + name.slice(1);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (name === "search") {
    setTimeout(() => $("#searchPageInput")?.focus(), 50);
  }
}

function openGame(game) {
  if (!game.file) {
    toast("This game has no HTML file path");
    return;
  }

  currentGame = game;
  $("#playerTitle").textContent = game.name;
  $("#gameFrame").src = game.file;
  $("#gameModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGame() {
  $("#gameModal").classList.add("hidden");
  $("#gameFrame").src = "about:blank";
  document.body.style.overflow = "";
  currentGame = null;
}

function openEditor(game = null) {
  currentGame = game;
  $("#editorTitle").textContent = game ? "Edit game" : "Add game";
  $("#gameNameInput").value = game?.name || "";
  $("#gameIconInput").value = game?.icon || "🎮";
  $("#gamePathInput").value = game?.file || "";
  $("#gameImageInput").value = game?.image || "";
  $("#gameDescInput").value = game?.desc || "Play now";
  $("#deleteGameBtn").style.display = game ? "block" : "none";
  $("#gameEditor").classList.remove("hidden");
}

function closeEditor() {
  $("#gameEditor").classList.add("hidden");
  currentGame = null;
}

function saveEditor() {
  const name = $("#gameNameInput").value.trim();
  const file = $("#gamePathInput").value.trim();
  const image = $("#gameImageInput").value.trim();
  const desc = $("#gameDescInput").value.trim() || "Play now";
  const icon = $("#gameIconInput").value.trim() || "🎮";

  if (!name) return toast("Enter a game name");
  if (!file) return toast("Enter the HTML file path");

  // The editor creates a browser-local entry. For a public GitHub Pages game,
  // put the same information into games.json so everyone can see it.
  const existingLocal = games.find(g => g.id === currentGame?.id);

  if (currentGame && existingLocal) {
    Object.assign(existingLocal, { name, file, image, desc, icon, localOnly: true });
    toast("Local game updated");
  } else if (currentGame) {
    toast("Published games are edited in games.json");
    closeEditor();
    return;
  } else {
    games.unshift({
      id: `local-${Date.now()}`,
      name,
      file,
      image,
      desc,
      icon,
      added: Date.now(),
      localOnly: true
    });
    toast("Added on this browser");
  }

  saveLocalGames();
  applySettings();
  render();
  closeEditor();
}

function deleteCurrentGame() {
  if (!currentGame) return;
  if (!currentGame.localOnly) {
    toast("Delete it from games.json");
    return;
  }

  games = games.filter(g => g.id !== currentGame.id);
  saveLocalGames();
  applySettings();
  render();
  closeEditor();
  toast("Local game deleted");
}

function bindNavigation() {
  $$(".nav").forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.nav)));
  $(".brand").addEventListener("click", () => showView("home"));
  $("#topSearch").onclick = () => showView("search");
  $("#topSettings").onclick = () => showView("settings");
  $("#browseBtn").onclick = () => showView("games");
  $("#recentAll").onclick = () => showView("games");
  $("#addGameBtn").onclick = () => openEditor();
  $("#addGameSettings").onclick = () => openEditor();
  $("#topRandom").onclick = () => {
    if (games.length) openGame(games[Math.floor(Math.random() * games.length)]);
    else toast("No games yet");
  };
  $("#topTheme").onclick = () => {
    cfg.dark = !cfg.dark;
    saveSettings();
    applySettings();
  };
}

function bindSearch() {
  $("#heroSearch").addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    showView("search");
    $("#searchPageInput").value = event.target.value;
    renderSearch(event.target.value);
  });

  $("#gamesSearch").addEventListener("input", (event) => {
    const q = event.target.value.trim().toLowerCase();
    const result = q
      ? games.filter(g => g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q))
      : games;
    render(result);
  });

  $("#searchPageInput").addEventListener("input", (event) => renderSearch(event.target.value));
}

function bindPlayer() {
  $("#playerBack").onclick = closeGame;
  $("#playerReload").onclick = () => {
    const frame = $("#gameFrame");
    frame.src = frame.src;
  };
  $("#playerFullscreen").onclick = () => {
    $("#gameFrame").requestFullscreen?.();
  };
  $("#playerDownload").onclick = () => {
    if (!currentGame?.file) return;
    const a = document.createElement("a");
    a.href = currentGame.file;
    a.download = `${currentGame.name.replace(/[^a-z0-9]+/gi, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  $("#editorClose").onclick = closeEditor;
  $("#editorCancel").onclick = closeEditor;
  $("#saveGameBtn").onclick = saveEditor;
  $("#deleteGameBtn").onclick = deleteCurrentGame;
}

function bindSettings() {
  const bindInput = (id, key) => {
    $(id).addEventListener("input", (event) => {
      cfg[key] = event.target.value;
      saveSettings();
      applySettings();
    });
  };

  bindInput("#setTabName", "tabName");
  bindInput("#setSiteName", "siteName");
  bindInput("#setHomeTitle", "homeTitle");
  bindInput("#setHomeSub", "homeSub");
  bindInput("#setGamesTitle", "gamesTitle");
  bindInput("#setRecentTitle", "recentTitle");
  bindInput("#setAccent", "accent");

  $("#setCardSize").addEventListener("change", (event) => {
    cfg.cardSize = event.target.value;
    saveSettings();
    applySettings();
  });

  $("#darkToggle").onclick = () => {
    cfg.dark = !cfg.dark;
    saveSettings();
    applySettings();
  };

  $("#bgUpload").onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      cfg.bg = reader.result;
      saveSettings();
      applySettings();
      toast("Background saved in this browser");
    };
    reader.readAsDataURL(file);
  };

  $("#clearBg").onclick = () => {
    cfg.bg = "";
    saveSettings();
    applySettings();
    toast("Background cleared");
  };

  $("#editModeBtn").onclick = () => {
    editMode = !editMode;
    document.body.classList.toggle("edit-mode", editMode);
    toast(editMode ? "Edit mode on" : "Edit mode off");
  };

  $("#exportBtn").onclick = () => {
    const data = JSON.stringify({ config: cfg, games }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applebottom-settings.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  $("#resetBtn").onclick = () => {
    if (!confirm("Reset APPLEBOTTOM settings and local games?")) return;
    localStorage.removeItem("applebottom_cfg");
    localStorage.removeItem("applebottom_local_games");
    location.reload();
  };

  $("#localGame").onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (localGameUrl) URL.revokeObjectURL(localGameUrl);
    localGameUrl = URL.createObjectURL(file);

    games.unshift({
      id: `local-file-${Date.now()}`,
      name: file.name.replace(/\.html?$/i, ""),
      icon: "📄",
      image: "",
      file: localGameUrl,
      desc: "Local game",
      added: Date.now(),
      localOnly: true,
      sessionOnly: true
    });

    // Blob URLs cannot be restored after refresh, so do not save this entry.
    applySettings();
    render();
    toast("Local HTML opened for this session");
  };

  $("#gameFileInput").onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (localGameUrl) URL.revokeObjectURL(localGameUrl);
    localGameUrl = URL.createObjectURL(file);
    $("#gamePathInput").value = localGameUrl;
  };
}

function bindKeyboard() {
  let typed = "";

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!$("#gameModal").classList.contains("hidden")) closeGame();
      if (!$("#gameEditor").classList.contains("hidden")) closeEditor();
    }

    if (event.key === "Escape" && document.activeElement?.id === "gamesSearch") {
      document.activeElement.value = "";
      render();
      document.activeElement.blur();
    }

    if (document.activeElement?.tagName !== "INPUT" && event.key.length === 1) {
      typed = (typed + event.key.toLowerCase()).slice(-7);
      if (typed === "adminme") {
        editMode = !editMode;
        document.body.classList.toggle("edit-mode", editMode);
        toast(editMode ? "Edit mode unlocked" : "Edit mode locked");
        typed = "";
      }
    }
  });
}

function clock() {
  const d = new Date();
  $("#dateTime").textContent = d.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }) + " — " + d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
  setTimeout(clock, 1000);
}

async function init() {
  bindNavigation();
  bindSearch();
  bindPlayer();
  bindSettings();
  bindKeyboard();
  applySettings();
  render();
  clock();
  await loadGames();
}

init();
