const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* =========================================================
   APPLEBOTTOM
   GAME LIST IS CURRENTLY EMPTY
   ========================================================= */

let games = [];

/* =========================================================
   SETTINGS
   ========================================================= */

const defaultSettings = {
    tabName: "APPLEBOTTOM UBG",
    siteName: "APPLEBOTTOM",
    homeTitle: "APPLEBOTTOM",
    homeSubtitle: "Your calm little corner of the internet.",
    gamesTitle: "All games",
    recentTitle: "Recently added",
    accent: "#ff334f",
    cardSize: "medium",
    darkMode: true,
    background: ""
};

let settings = {};

try {
    settings = JSON.parse(
        localStorage.getItem("applebottom_settings") || "{}"
    );
} catch (error) {
    settings = {};
}

settings = {
    ...defaultSettings,
    ...settings
};

/* =========================================================
   COMPLETELY CLEAR ALL OLD GAMES
   ========================================================= */

/*
    This deletes Granny, Fleeing the Complex,
    FNaF, and every other game that was previously
    saved in localStorage.
*/

localStorage.removeItem("applebottom_games");

/*
    Also clear any older game-storage names
    that may have been used by previous versions.
*/

localStorage.removeItem("games");
localStorage.removeItem("ubg_games");
localStorage.removeItem("honeycomb_games");

/* =========================================================
   STATE
   ========================================================= */

let currentGame = null;
let editMode = false;

/* =========================================================
   SAVE DATA
   ========================================================= */

function saveData() {

    localStorage.setItem(
        "applebottom_settings",
        JSON.stringify(settings)
    );

    /*
        Always save the current game list.
        Right now this is intentionally empty.
    */

    localStorage.setItem(
        "applebottom_games",
        JSON.stringify([])
    );
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) => {

            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];
        }
    );
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast = $("#toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(
        window.appleToastTimer
    );

    window.appleToastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 1800);
}

/* =========================================================
   APPLY SETTINGS
   ========================================================= */

function applySettings() {

    document.documentElement.style.setProperty(
        "--accent",
        settings.accent
    );

    document.title =
        settings.tabName ||
        "APPLEBOTTOM UBG";

    document.body.classList.toggle(
        "light",
        !settings.darkMode
    );

    document.body.classList.remove(
        "card-small",
        "card-large"
    );

    if (settings.cardSize === "small") {

        document.body.classList.add(
            "card-small"
        );
    }

    if (settings.cardSize === "large") {

        document.body.classList.add(
            "card-large"
        );
    }

    /* Background */

    if (settings.background) {

        document.documentElement.style.setProperty(
            "--site-background",
            `url("${settings.background}")`
        );

        document.body.classList.add(
            "has-background"
        );

    } else {

        document.body.classList.remove(
            "has-background"
        );

        document.documentElement.style.removeProperty(
            "--site-background"
        );
    }

    /* Branding */

    if ($("#brandName")) {

        $("#brandName").textContent =
            settings.siteName;
    }

    if ($("#heroName")) {

        $("#heroName").textContent =
            settings.homeTitle;
    }

    if ($("#heroSub")) {

        $("#heroSub").textContent =
            settings.homeSubtitle;
    }

    if ($("#gamesTitle")) {

        $("#gamesTitle").textContent =
            settings.gamesTitle;
    }

    if ($("#recentTitle")) {

        $("#recentTitle").textContent =
            settings.recentTitle;
    }

    /* Game count */

    if ($("#countPill")) {

        $("#countPill").textContent =
            games.length;
    }

    if ($("#gameCountSide")) {

        $("#gameCountSide").textContent =
            games.length;
    }

    /* Settings inputs */

    const settingInputs = {

        "#setTabName":
            settings.tabName,

        "#setSiteName":
            settings.siteName,

        "#setHomeTitle":
            settings.homeTitle,

        "#setHomeSub":
            settings.homeSubtitle,

        "#setGamesTitle":
            settings.gamesTitle,

        "#setRecentTitle":
            settings.recentTitle,

        "#setAccent":
            settings.accent,

        "#setCardSize":
            settings.cardSize
    };

    Object.entries(settingInputs).forEach(
        ([selector, value]) => {

            const input = $(selector);

            if (input) {
                input.value = value;
            }
        }
    );

    if ($("#darkToggle")) {

        $("#darkToggle").classList.toggle(
            "on",
            settings.darkMode
        );
    }
}

/* =========================================================
   CREATE GAME CARD
   ========================================================= */

function createGameCard(game) {

    const card =
        document.createElement("article");

    card.className =
        "game-card";

    card.dataset.gameId =
        game.id;

    const image =
        game.image
            ? `
                <img
                    src="${game.image}"
                    alt="${escapeHTML(game.name)}"
                    loading="lazy"
                >
            `
            : "";

    card.innerHTML = `

        <button
            class="card-edit"
            type="button"
            title="Edit game"
        >
            ✎
        </button>

        <div class="thumb">

            ${image}

            <span class="thumb-fallback">
                ${escapeHTML(
                    game.icon || "🎮"
                )}
            </span>

        </div>

        <div class="game-info">

            <div class="game-name">
                ${escapeHTML(game.name)}
            </div>

            <div class="game-desc">
                ${escapeHTML(
                    game.description ||
                    "Play now"
                )}
            </div>

        </div>
    `;

    card.addEventListener(
        "click",
        (event) => {

            if (
                event.target.closest(
                    ".card-edit"
                )
            ) {
                return;
            }

            openGame(game);
        }
    );

    const editButton =
        card.querySelector(
            ".card-edit"
        );

    if (editButton) {

        editButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                openGameEditor(game);
            }
        );
    }

    return card;
}

/* =========================================================
   RECENTLY ADDED
   ========================================================= */

function renderRecentlyAdded() {

    const container =
        $("#recentGrid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    /*
        There are currently no games,
        so nothing gets added here.
    */

    if (games.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No games have been added yet.
            </div>
        `;
    }
}

/* =========================================================
   ALL GAMES
   ========================================================= */

function renderGames(list = games) {

    const container =
        $("#gamesGrid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    list.forEach((game) => {

        container.appendChild(
            createGameCard(game)
        );
    });

    const empty =
        $("#gamesEmpty");

    if (empty) {

        empty.classList.toggle(
            "hidden",
            list.length !== 0
        );
    }
}

/* =========================================================
   RENDER EVERYTHING
   ========================================================= */

function renderAll() {

    renderRecentlyAdded();

    renderGames(games);

    updateGameCount();
}

/* =========================================================
   GAME COUNT
   ========================================================= */

function updateGameCount() {

    if ($("#countPill")) {

        $("#countPill").textContent =
            games.length;
    }

    if ($("#gameCountSide")) {

        $("#gameCountSide").textContent =
            games.length;
    }
}

/* =========================================================
   SEARCH
   ========================================================= */

function searchGames(query) {

    const search =
        query
            .trim()
            .toLowerCase();

    if (!search) {
        return games;
    }

    return games.filter((game) => {

        const name =
            String(
                game.name || ""
            ).toLowerCase();

        const description =
            String(
                game.description || ""
            ).toLowerCase();

        return (
            name.includes(search) ||
            description.includes(search)
        );
    });
}

/* =========================================================
   SEARCH PAGE
   ========================================================= */

function renderSearch(query) {

    const results =
        searchGames(query);

    const container =
        $("#searchGrid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    results.forEach((game) => {

        container.appendChild(
            createGameCard(game)
        );
    });

    if ($("#searchMeta")) {

        $("#searchMeta").textContent =
            `${results.length} ${
                results.length === 1
                    ? "game"
                    : "games"
            } found`;
    }
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showView(viewName) {

    $$(".view").forEach((view) => {

        view.classList.add("hidden");
    });

    const target =
        $(`#${viewName}View`);

    if (target) {

        target.classList.remove("hidden");
    }

    $$(".nav").forEach((button) => {

        button.classList.toggle(
            "active",
            button.dataset.nav === viewName
        );
    });

    if ($("#pageTitle")) {

        const titles = {

            home: "Home",
            games: "Games",
            search: "Search",
            settings: "Settings"
        };

        $("#pageTitle").textContent =
            titles[viewName] ||
            viewName;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* =========================================================
   OPEN GAME
   ========================================================= */

function openGame(game) {

    if (!game) {
        return;
    }

    currentGame =
        game;

    if ($("#playerTitle")) {

        $("#playerTitle").textContent =
            game.name;
    }

    const frame =
        $("#gameFrame");

    if (frame) {

        frame.src =
            game.file;
    }

    const modal =
        $("#gameModal");

    if (modal) {

        modal.classList.remove(
            "hidden"
        );
    }

    document.body.style.overflow =
        "hidden";
}

/* =========================================================
   CLOSE GAME
   ========================================================= */

function closeGame() {

    const frame =
        $("#gameFrame");

    if (frame) {

        frame.src =
            "about:blank";
    }

    const modal =
        $("#gameModal");

    if (modal) {

        modal.classList.add(
            "hidden"
        );
    }

    document.body.style.overflow =
        "";

    currentGame =
        null;
}

/* =========================================================
   RELOAD GAME
   ========================================================= */

function reloadGame() {

    const frame =
        $("#gameFrame");

    if (!frame) {
        return;
    }

    const currentSrc =
        frame.src;

    frame.src =
        "about:blank";

    setTimeout(() => {

        frame.src =
            currentSrc;

    }, 30);
}

/* =========================================================
   FULLSCREEN
   ========================================================= */

function fullscreenGame() {

    const frame =
        $("#gameFrame");

    if (!frame) {
        return;
    }

    if (
        frame.requestFullscreen
    ) {

        frame.requestFullscreen();

    } else if (
        frame.webkitRequestFullscreen
    ) {

        frame.webkitRequestFullscreen();
    }
}

/* =========================================================
   RANDOM GAME
   ========================================================= */

function randomGame() {

    if (games.length === 0) {

        showToast(
            "No games available"
        );

        return;
    }

    const game =
        games[
            Math.floor(
                Math.random() *
                games.length
            )
        ];

    openGame(game);
}

/* =========================================================
   GAME EDITOR
   ========================================================= */

function openGameEditor(game = null) {

    currentGame =
        game;

    if ($("#editorTitle")) {

        $("#editorTitle").textContent =
            game
                ? "Edit game"
                : "Add a game";
    }

    if ($("#gameNameInput")) {

        $("#gameNameInput").value =
            game?.name || "";
    }

    if ($("#gameIconInput")) {

        $("#gameIconInput").value =
            game?.icon || "🎮";
    }

    if ($("#gamePathInput")) {

        $("#gamePathInput").value =
            game?.file || "";
    }

    if ($("#deleteGameBtn")) {

        $("#deleteGameBtn").style.display =
            game
                ? "block"
                : "none";
    }

    if ($("#gameEditor")) {

        $("#gameEditor")
            .classList
            .remove("hidden");
    }
}

/* =========================================================
   CLOSE EDITOR
   ========================================================= */

function closeGameEditor() {

    if ($("#gameEditor")) {

        $("#gameEditor")
            .classList
            .add("hidden");
    }

    currentGame =
        null;
}

/* =========================================================
   SAVE GAME
   ========================================================= */

function saveGame() {

    const name =
        $("#gameNameInput")
            ?.value
            .trim();

    const file =
        $("#gamePathInput")
            ?.value
            .trim();

    const icon =
        $("#gameIconInput")
            ?.value
            .trim() ||
        "🎮";

    if (!name) {

        showToast(
            "Enter a game name"
        );

        return;
    }

    if (!file) {

        showToast(
            "Enter the game file path"
        );

        return;
    }

    if (currentGame) {

        currentGame.name =
            name;

        currentGame.icon =
            icon;

        currentGame.file =
            file;

        showToast(
            "Game updated"
        );

    } else {

        games.unshift({

            id:
                "game-" +
                Date.now(),

            name:
                name,

            icon:
                icon,

            file:
                file,

            image:
                "",

            description:
                "Play now",

            added:
                Date.now()
        });

        showToast(
            "Game added"
        );
    }

    saveData();

    renderAll();

    closeGameEditor();
}

/* =========================================================
   DELETE GAME
   ========================================================= */

function deleteCurrentGame() {

    if (!currentGame) {
        return;
    }

    games =
        games.filter(
            (game) =>
                game.id !==
                currentGame.id
        );

    saveData();

    renderAll();

    closeGameEditor();

    showToast(
        "Game deleted"
    );
}

/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

function setupNavigation() {

    $$(".nav").forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                showView(
                    button.dataset.nav
                );
            }
        );
    });

    if ($("#topSearch")) {

        $("#topSearch").onclick =
            () => showView("search");
    }

    if ($("#topSettings")) {

        $("#topSettings").onclick =
            () => showView("settings");
    }

    if ($("#topRandom")) {

        $("#topRandom").onclick =
            randomGame;
    }

    if ($("#topTheme")) {

        $("#topTheme").onclick =
            () => {

                settings.darkMode =
                    !settings.darkMode;

                saveData();

                applySettings();

                showToast(
                    settings.darkMode
                        ? "Dark mode"
                        : "Light mode"
                );
            };
    }

    if ($("#browseBtn")) {

        $("#browseBtn").onclick =
            () => showView("games");
    }

    if ($("#recentAll")) {

        $("#recentAll").onclick =
            () => showView("games");
    }
}

/* =========================================================
   HOME SEARCH
   ========================================================= */

if ($("#heroSearch")) {

    $("#heroSearch").addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Enter"
            ) {
                return;
            }

            const query =
                event.target.value;

            showView("search");

            if ($("#searchPageInput")) {

                $("#searchPageInput")
                    .value =
                    query;
            }

            renderSearch(query);
        }
    );
}

/* =========================================================
   GAMES SEARCH
   ========================================================= */

if ($("#gamesSearch")) {

    $("#gamesSearch").addEventListener(
        "input",
        (event) => {

            const results =
                searchGames(
                    event.target.value
                );

            renderGames(results);
        }
    );
}

/* =========================================================
   SEARCH PAGE INPUT
   ========================================================= */

if ($("#searchPageInput")) {

    $("#searchPageInput").addEventListener(
        "input",
        (event) => {

            renderSearch(
                event.target.value
            );
        }
    );
}

/* =========================================================
   PLAYER CONTROLS
   ========================================================= */

if ($("#playerBack")) {

    $("#playerBack").onclick =
        closeGame;
}

if ($("#playerReload")) {

    $("#playerReload").onclick =
        reloadGame;
}

if ($("#playerFullscreen")) {

    $("#playerFullscreen").onclick =
        fullscreenGame;
}

if ($("#playerDownload")) {

    $("#playerDownload").onclick =
        () => {

            if (!currentGame) {
                return;
            }

            const gameFile =
                currentGame.file;

            if (!gameFile) {
                return;
            }

            const link =
                document.createElement("a");

            link.href =
                gameFile;

            link.download =
                currentGame.name
                    .replace(
                        /[^a-z0-9]+/gi,
                        "-"
                    )
                    .toLowerCase()
                + ".html";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();
        };
}

/* =========================================================
   EDITOR CONTROLS
   ========================================================= */

if ($("#editorClose")) {

    $("#editorClose").onclick =
        closeGameEditor;
}

if ($("#editorCancel")) {

    $("#editorCancel").onclick =
        closeGameEditor;
}

if ($("#saveGameBtn")) {

    $("#saveGameBtn").onclick =
        saveGame;
}

if ($("#deleteGameBtn")) {

    $("#deleteGameBtn").onclick =
        deleteCurrentGame;
}

if ($("#addGameBtn")) {

    $("#addGameBtn").onclick =
        () => openGameEditor();
}

if ($("#addGameSettings")) {

    $("#addGameSettings").onclick =
        () => openGameEditor();
}

/* =========================================================
   SETTINGS
   ========================================================= */

if ($("#setTabName")) {

    $("#setTabName").addEventListener(
        "input",
        (event) => {

            settings.tabName =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#setSiteName")) {

    $("#setSiteName").addEventListener(
        "input",
        (event) => {

            settings.siteName =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#setHomeTitle")) {

    $("#setHomeTitle").addEventListener(
        "input",
        (event) => {

            settings.homeTitle =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#setHomeSub")) {

    $("#setHomeSub").addEventListener(
        "input",
        (event) => {

            settings.homeSubtitle =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#setGamesTitle")) {

    $("#setGamesTitle").addEventListener(
        "input",
        (event) => {

            settings.gamesTitle =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#setRecentTitle")) {

    $("#setRecentTitle").addEventListener(
        "input",
        (event) => {

            settings.recentTitle =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#setAccent")) {

    $("#setAccent").addEventListener(
        "input",
        (event) => {

            settings.accent =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#setCardSize")) {

    $("#setCardSize").addEventListener(
        "change",
        (event) => {

            settings.cardSize =
                event.target.value;

            saveData();

            applySettings();
        }
    );
}

if ($("#darkToggle")) {

    $("#darkToggle").onclick =
        () => {

            settings.darkMode =
                !settings.darkMode;

            saveData();

            applySettings();
        };
}

/* =========================================================
   BACKGROUND UPLOAD
   ========================================================= */

if ($("#bgUpload")) {

    $("#bgUpload").addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            const reader =
                new FileReader();

            reader.onload =
                () => {

                    settings.background =
                        reader.result;

                    saveData();

                    applySettings();

                    showToast(
                        "Background saved"
                    );
                };

            reader.readAsDataURL(file);
        }
    );
}

/* =========================================================
   CLEAR BACKGROUND
   ========================================================= */

if ($("#clearBg")) {

    $("#clearBg").onclick =
        () => {

            settings.background =
                "";

            saveData();

            applySettings();

            showToast(
                "Background cleared"
            );
        };
}

/* =========================================================
   EDIT MODE
   ========================================================= */

if ($("#editModeBtn")) {

    $("#editModeBtn").onclick =
        () => {

            editMode =
                !editMode;

            document.body.classList.toggle(
                "edit-mode",
                editMode
            );

            showToast(
                editMode
                    ? "Edit mode enabled"
                    : "Edit mode disabled"
            );
        };
}

/* =========================================================
   LOCAL GAME FILE
   ========================================================= */

if ($("#localGame")) {

    $("#localGame").addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            const url =
                URL.createObjectURL(file);

            const localGame = {

                id:
                    "local-" +
                    Date.now(),

                name:
                    file.name.replace(
                        /\.html?$/i,
                        ""
                    ),

                icon:
                    "🎮",

                image:
                    "",

                file:
                    url,

                description:
                    "Local game",

                added:
                    Date.now()
            };

            games.unshift(
                localGame
            );

            renderAll();

            showToast(
                "Local game added"
            );
        }
    );
}

/* =========================================================
   ADMINME
   ========================================================= */

let adminText = "";

document.addEventListener(
    "keydown",
    (event) => {

        const active =
            document.activeElement;

        const typing =
            active &&
            (
                active.tagName === "INPUT" ||
                active.tagName === "TEXTAREA"
            );

        if (!typing) {

            adminText +=
                event.key.toLowerCase();

            adminText =
                adminText.slice(-7);

            if (
                adminText === "adminme"
            ) {

                editMode =
                    !editMode;

                document.body.classList.toggle(
                    "edit-mode",
                    editMode
                );

                showToast(
                    editMode
                        ? "Edit mode enabled"
                        : "Edit mode disabled"
                );

                adminText = "";
            }
        }

        if (
            event.key === "Escape"
        ) {

            closeGame();

            closeGameEditor();
        }
    }
);

/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const clock =
        $("#dateTime");

    if (!clock) {
        return;
    }

    const now =
        new Date();

    const date =
        now.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    const time =
        now.toLocaleTimeString(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    clock.textContent =
        `${date} — ${time}`;
}

/* =========================================================
   START APP
   ========================================================= */

/*
    Make absolutely sure the saved game list
    is empty before the website renders.
*/

games = [];

localStorage.setItem(
    "applebottom_games",
    JSON.stringify([])
);

setupNavigation();

applySettings();

renderAll();

updateClock();

setInterval(
    updateClock,
    1000
);
