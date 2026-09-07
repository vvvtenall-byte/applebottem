const games = [
  ["Firefox", "🦊"], ["Krita", "🎨"], ["Impossible Quiz 2", "❓"],
  ["Scary Teacher 3D", "🏫"], ["Celeste 64", "🏔️"], ["Balatro Modded", "🃏"],
  ["2048", "🔢"], ["Angry Birds", "🐦"], ["Cookie Clicker", "🍪"],
  ["Crossy Road", "🐔"], ["Geometry Dash", "◆"], ["Granny", "🏠"],
  ["Monkey Mart", "🛒"], ["Paper io", "⭕"], ["Polytrack", "🏎️"],
  ["Rooftop Snipers", "🎯"], ["Stickman Hook", "🪝"], ["Tiny Fishing", "🎣"],
  ["A Dance Of Fire And Ice", "🎵"], ["Fruit Ninja", "🍉"], ["Bad Ice Cream", "🍦"],
  ["Bad Parenting", "🎮"], ["Bloxorz", "🧩"], ["Crazy Cattle 3D", "🐑"],
  ["Dadish", "🌱"], ["Happy Wheels", "🚲"], ["Jetpack Joyride", "🚀"],
  ["Level Devil", "😈"], ["OvO", "⚪"], ["Papa's Pizzeria", "🍕"],
  ["Pizza Tower", "🍕"], ["Run 3", "🏃"], ["Slope", "🔵"],
  ["Super Mario 64", "⭐"], ["Temple Run 2", "🏃"], ["Wordle", "🔤"],
  ["Untitled Goose Game", "🪿"], ["Sandboxels", "🧪"], ["Soundboard", "🔊"],
  ["Google Feud", "🔎"]
];

const recent = games.slice(0, 6);

function makeCard([name, icon]) {
  const card = document.createElement("article");
  card.className = "game-card";
  card.innerHTML = `
    <div class="placeholder">${icon}</div>
    <div class="name">${name}</div>
  `;
  card.addEventListener("click", () => {
    alert(`${name}\n\nThis is a placeholder game card. Add your own game page/link here.`);
  });
  return card;
}

function renderGrid(el, list) {
  el.innerHTML = "";
  list.forEach(g => el.appendChild(makeCard(g)));
}

function renderRecent() {
  const el = document.getElementById("recentGrid");
  el.innerHTML = "";
  recent.forEach(g => {
    const card = makeCard(g);
    card.className = "recent-card";
    el.appendChild(card);
  });
}

function updateDate() {
  const now = new Date();
  document.getElementById("dateText").textContent =
    now.toLocaleDateString(undefined, {weekday:"long", month:"long", day:"numeric", year:"numeric"}) +
    " — " + now.toLocaleTimeString(undefined, {hour:"2-digit", minute:"2-digit"});
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page + "Page").classList.remove("hidden");
  document.querySelectorAll(".nav-item[data-page]").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  document.getElementById("pageTitle").innerHTML =
    (page === "home" ? "Home" : page === "games" ? "Games" : "Search") +
    ' <span class="count">252</span>';
  window.scrollTo({top:0, behavior:"smooth"});
}

document.querySelectorAll(".nav-item[data-page]").forEach(btn =>
  btn.addEventListener("click", () => showPage(btn.dataset.page))
);

document.getElementById("browseBtn").onclick = () => showPage("games");

function search(value) {
  const q = value.trim().toLowerCase();
  const results = games.filter(g => g[0].toLowerCase().includes(q));
  const el = document.getElementById("searchResults");
  el.innerHTML = "";
  results.forEach(([name, icon]) => {
    const row = document.createElement("div");
    row.className = "result";
    row.innerHTML = `<div class="result-thumb">${icon}</div><strong>${name}</strong>`;
    el.appendChild(row);
  });
}

document.getElementById("homeSearchInput").addEventListener("input", e => {
  if (e.target.value.trim()) {
    showPage("search");
    document.getElementById("searchInput").value = e.target.value;
    search(e.target.value);
    document.getElementById("searchInput").focus();
  }
});

document.getElementById("searchInput").addEventListener("input", e => search(e.target.value));

document.getElementById("settingsBtn").onclick = () =>
  document.getElementById("settingsModal").classList.remove("hidden");
document.getElementById("closeSettings").onclick = () =>
  document.getElementById("settingsModal").classList.add("hidden");

document.querySelectorAll(".colors button").forEach(btn => {
  btn.onclick = () => document.documentElement.style.setProperty("--accent", btn.dataset.color);
});

document.querySelectorAll(".size-buttons button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".size-buttons button").forEach(x => x.classList.remove("selected"));
    btn.classList.add("selected");
    const grid = document.querySelectorAll(".game-grid");
    grid.forEach(g => {
      g.style.gridTemplateColumns =
        btn.dataset.size === "small" ? "repeat(9, minmax(90px,1fr))" :
        btn.dataset.size === "medium" ? "repeat(7, minmax(110px,1fr))" :
        "repeat(6, minmax(130px,1fr))";
    });
  };
});

const style = document.createElement("style");
style.textContent = `.placeholder{width:100%;height:100%;display:grid;place-items:center;font-size:54px;background:linear-gradient(135deg,#f4f4f4,#cfd2da);}`;
document.head.appendChild(style);

renderRecent();
renderGrid(document.getElementById("homeGrid"), games);
renderGrid(document.getElementById("gamesGrid"), [...games].sort((a,b)=>a[0].localeCompare(b[0])));
search("");
updateDate();
setInterval(updateDate, 1000);
