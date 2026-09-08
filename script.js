const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* =========================================================
   GAME LIST
   ========================================================= */

const defaultGames = [
    {
        id: "fnaf",
        name: "Five Nights at Freddy's",
        icon: "🎮",
        image: "images/fnaf.png",
        path: "games/fnaf/index.html",
        added: Date.now(),
        desc: "Survive the night."
    }
];

/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

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

/* =========================================================
   LOAD SAVED DATA
   ========================================================= */

let savedConfig;

try {
    savedConfig = JSON.parse(
        localStorage.getItem("applebottom_cfg") || "{}"
    );
} catch {
    savedConfig = {};
}

let cfg = {
    ...defaults,
    ...savedConfig
};

let savedGames;

try {
    savedGames = JSON.parse(
        localStorage.getItem("applebottom_games") || "null"
    );
} catch {
    savedGames = null;
}

/*
   IMPORTANT:

   If the browser already has the old demo games saved in
   localStorage, remove them automatically.

   This makes sure Apple Dodge, Neon Click, Memory Grid,
   and 2048 Mini don't come back.
*/

const oldDemoIds = [
    "apple-dodge",
    "neon-click",
    "memory",
    "2048-original"
];

let games = Array.isArray(savedGames)
    ? savedGames.filter(game => !oldDemoIds.includes(game.id))
    : [...defaultGames];

/*
   If FNaF isn't already saved, add it.
*/

if (!games.some(game => game.id === "fnaf")) {
    games.unshift(defaultGames[0]);
}

let editMode = false;
let currentGame = null;
let localGameUrl = null;

/* =========================================================
   SAVE
   ========================================================= */

function save() {
    localStorage.setItem(
        "applebottom_cfg",
        JSON.stringify(cfg)
    );

    localStorage.setItem(
        "applebottom_games",
        JSON.stringify(games)
    );
}

/* =========================================================
   TOAST
   ========================================================= */

function toast(text) {
    const element = $("#toast");

    if (!element) return;

    element.textContent = text;
    element.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        element.classList.remove("show");
    }, 1800);
}

/* =========================================================
   APPLY SETTINGS
   ========================================================= */

function apply() {

    document.documentElement.style.setProperty(
        "--accent",
        cfg.accent
    );

    document.title =
        cfg.tabName || "APPLEBOTTOM UBG";

    document.body.classList.toggle(
        "light",
        !cfg.dark
    );

    document.body.classList.remove(
        "card-small",
        "card-large"
    );

    if (cfg.cardSize === "small") {
        document.body.classList.add("card-small");
    }

    if (cfg.cardSize === "large") {
        document.body.classList.add("card-large");
    }

    if (cfg.bg) {

        document.body.classList.add("has-bg");

        document.documentElement.style.setProperty(
            "--site-bg",
            `url("${cfg.bg}")`
        );

    } else {

        document.body.classList.remove("has-bg");

        document.documentElement.style.removeProperty(
            "--site-bg"
        );
    }

    /* BRAND */

    if ($("#brandName")) {
        $("#brandName").textContent =
            cfg.siteName;
    }

    if ($("#heroName")) {
        $("#heroName").textContent =
            cfg.homeTitle;
    }

    if ($("#heroSub")) {
        $("#heroSub").textContent =
            cfg.homeSub;
    }

    if ($("#gamesTitle")) {
        $("#gamesTitle").textContent =
            cfg.gamesTitle;
    }

    if ($("#recentTitle")) {
        $("#recentTitle").textContent =
            cfg.recentTitle;
    }

    /* GAME COUNT */

    if ($("#countPill")) {
        $("#countPill").textContent =
            games.length;
    }

    if ($("#gameCountSide")) {
        $("#gameCountSide").textContent =
            games.length;
    }

    /* SETTINGS INPUTS */

    if ($("#setTabName")) {
        $("#setTabName").value =
            cfg.tabName;
    }

    if ($("#setSiteName")) {
        $("#setSiteName").value =
            cfg.siteName;
    }

    if ($("#setHomeTitle")) {
        $("#setHomeTitle").value =
            cfg.homeTitle;
    }

    if ($("#setHomeSub")) {
        $("#setHomeSub").value =
            cfg.homeSub;
    }

    if ($("#setGamesTitle")) {
        $("#setGamesTitle").value =
            cfg.gamesTitle;
    }

    if ($("#setRecentTitle")) {
        $("#setRecentTitle").value =
            cfg.recentTitle;
    }

    if ($("#setAccent")) {
        $("#setAccent").value =
            cfg.accent;
    }

    if ($("#setCardSize")) {
        $("#setCardSize").value =
            cfg.cardSize;
    }

    if ($("#darkToggle")) {
        $("#darkToggle").classList.toggle(
            "on",
            cfg.dark
        );
    }
}

/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value).replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]
    );
}

/* =========================================================
   GAME CARD
   ========================================================= */

function card(game) {

    const element =
        document.createElement("article");

    element.className = "game-card";

    const thumbnail = game.image
        ? `
            <img
                src="${game.image}"
                alt="${escapeHtml(game.name)}"
                loading="lazy"
                onerror="this.style.display='none'; this.parentElement.classList.add('image-error')"
            >
        `
        : "";

    const fallbackIcon =
        game.icon || "🎮";

    element.innerHTML = `
        <button
            class="card-edit"
            title="Edit game"
            type="button"
        >
            ✎
        </button>

        <div class="thumb">

            ${thumbnail}

            <span class="thumb-fallback">
                ${fallbackIcon}
            </span>

        </div>

        <div class="game-info">

            <div class="game-name">
                ${escapeHtml(game.name)}
            </div>

            <div class="game-desc">
                ${escapeHtml(
                    game.desc || "Play now"
                )}
            </div>

        </div>
    `;

    /* OPEN GAME */

    element.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(".card-edit")
            ) {
                return;
            }

            openGame(game);
        }
    );

    /* EDIT */

    const editButton =
        element.querySelector(".card-edit");

    if (editButton) {

        editButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                openEditor(game);
            }
        );
    }

    return element;
}

/* =========================================================
   RENDER GAMES
   ========================================================= */

function render(list = games) {

    const recentGrid =
        $("#recentGrid");

    if (recentGrid) {

        recentGrid.innerHTML = "";

        games
            .slice()
            .sort(
                (a, b) =>
                    (b.added || 0) -
                    (a.added || 0)
            )
            .slice(0, 6)
            .forEach(game => {

                recentGrid.appendChild(
                    card(game)
                );
            });
    }

    const gamesGrid =
        $("#gamesGrid");

    if (gamesGrid) {

        gamesGrid.innerHTML = "";

        list.forEach(game => {

            gamesGrid.appendChild(
                card(game)
            );
        });
    }

    if ($("#countPill")) {
        $("#countPill").textContent =
            games.length;
    }

    if ($("#gameCountSide")) {
        $("#gameCountSide").textContent =
            games.length;
    }

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
   SEARCH
   ========================================================= */

function renderSearch(query) {

    const term =
        query.trim().toLowerCase();

    const results =
        term
            ? games.filter(game =>
                game.name
                    .toLowerCase()
                    .includes(term)
                ||
                String(game.desc || "")
                    .toLowerCase()
                    .includes(term)
            )
            : games;

    if ($("#searchMeta")) {

        $("#searchMeta").textContent =
            `${results.length} game${
                results.length === 1
                    ? ""
                    : "s"
            } found`;
    }

    if ($("#searchGrid")) {

        $("#searchGrid").innerHTML = "";

        results.forEach(game => {

            $("#searchGrid").appendChild(
                card(game)
            );
        });
    }
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showView(name) {

    $$(".view").forEach(view => {

        view.classList.add("hidden");
    });

    const target =
        $(`#${name}View`);

    if (target) {

        target.classList.remove(
            "hidden"
        );
    }

    $$(".nav").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.nav === name
        );
    });

    if ($("#pageTitle")) {

        $("#pageTitle").textContent =
            name === "home"
                ? "Home"
                : name.charAt(0).toUpperCase()
                    + name.slice(1);
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    if (
        name === "search" &&
        $("#searchPageInput")
    ) {

        setTimeout(() => {

            $("#searchPageInput").focus();

        }, 50);
    }
}

/* =========================================================
   OPEN GAME
   ========================================================= */

function openGame(game) {

    if (!game) return;

    currentGame = game;

    if ($("#playerTitle")) {

        $("#playerTitle").textContent =
            game.name;
    }

    if ($("#gameFrame")) {

        $("#gameFrame").src =
            game.path || "about:blank";
    }

    if ($("#gameModal")) {

        $("#gameModal")
            .classList
            .remove("hidden");
    }

    document.body.style.overflow =
        "hidden";
}

/* =========================================================
   CLOSE GAME
   ========================================================= */

function closeGame() {

    if ($("#gameModal")) {

        $("#gameModal")
            .classList
            .add("hidden");
    }

    if ($("#gameFrame")) {

        $("#gameFrame").src =
            "about:blank";
    }

    document.body.style.overflow = "";

    currentGame = null;
}

/* =========================================================
   GAME EDITOR
   ========================================================= */

function openEditor(game = null) {

    currentGame = game;

    if ($("#editorTitle")) {

        $("#editorTitle").textContent =
            game
                ? "Edit game"
                : "Add game";
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
            game?.path || "";
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

function closeEditor() {

    if ($("#gameEditor")) {

        $("#gameEditor")
            .classList
            .add("hidden");
    }
}

/* =========================================================
   SAVE GAME FROM EDITOR
   ========================================================= */

function saveEditor() {

    const name =
        $("#gameNameInput")
            ?.value
            .trim();

    const path =
        $("#gamePathInput")
            ?.value
            .trim();

    const icon =
        $("#gameIconInput")
            ?.value
            .trim() || "🎮";

    if (!name) {

        toast(
            "Enter a game name"
        );

        return;
    }

    if (currentGame) {

        Object.assign(
            currentGame,
            {
                name,
                path:
                    path ||
                    currentGame.path,
                icon,
                desc:
                    currentGame.desc ||
                    "Play now"
            }
        );

        toast(
            "Game updated"
        );

    } else {

        games.unshift({
            id:
                crypto.randomUUID
                ? crypto.randomUUID()
                : "game-" +
                  Date.now(),

            name,

            icon,

            path:
                path ||
                "about:blank",

            added:
                Date.now(),

            desc:
                "Play now"
        });

        toast(
            "Game added"
        );
    }

    save();
    apply();
    render();

    closeEditor();
}

/* =========================================================
   DELETE GAME
   ========================================================= */

if ($("#deleteGameBtn")) {

    $("#deleteGameBtn").onclick =
        () => {

            if (!currentGame) {
                return;
            }

            games =
                games.filter(
                    game =>
                        game.id !==
                        currentGame.id
                );

            save();
            apply();
            render();
            closeEditor();

            toast(
                "Game deleted"
            );
        };
}

/* =========================================================
   NAVIGATION BUTTONS
   ========================================================= */

function bindNav() {

    $$(".nav").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showView(
                    button.dataset.nav
                );
            }
        );
    });

    /* TOP SEARCH */

    if ($("#topSearch")) {

        $("#topSearch").onclick =
            () => showView("search");
    }

    /* SETTINGS */

    if ($("#topSettings")) {

        $("#topSettings").onclick =
            () => showView("settings");
    }

    /* BROWSE */

    if ($("#browseBtn")) {

        $("#browseBtn").onclick =
            () => showView("games");
    }

    if ($("#recentAll")) {

        $("#recentAll").onclick =
            () => showView("games");
    }

    /* ADD GAME */

    if ($("#addGameBtn")) {

        $("#addGameBtn").onclick =
            () => openEditor();
    }

    if ($("#addGameSettings")) {

        $("#addGameSettings").onclick =
            () => openEditor();
    }

    /* RANDOM GAME */

    if ($("#topRandom")) {

        $("#topRandom").onclick =
            () => {

                if (!games.length) {

                    toast(
                        "No games available"
                    );

                    return;
                }

                const random =
                    games[
                        Math.floor(
                            Math.random() *
                            games.length
                        )
                    ];

                openGame(random);
            };
    }

    /* THEME */

    if ($("#topTheme")) {

        $("#topTheme").onclick =
            () => {

                cfg.dark =
                    !cfg.dark;

                save();
                apply();

                toast(
                    cfg.dark
                        ? "Dark mode"
                        : "Light mode"
                );
            };
    }
}

/* =========================================================
   HOME SEARCH
   ========================================================= */

if ($("#heroSearch")) {

    $("#heroSearch")
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) {
                    return;
                }

                showView("search");

                if (
                    $("#searchPageInput")
                ) {

                    $("#searchPageInput")
                        .value =
                        event.target.value;

                    renderSearch(
                        event.target.value
                    );
                }
            }
        );
}

/* =========================================================
   GAMES SEARCH
   ========================================================= */

if ($("#gamesSearch")) {

    $("#gamesSearch")
        .addEventListener(
            "input",
            event => {

                const query =
                    event.target.value
                        .toLowerCase();

                const list =
                    games.filter(game =>
                        game.name
                            .toLowerCase()
                            .includes(query)
                        ||
                        String(
                            game.desc || ""
                        )
                            .toLowerCase()
                            .includes(query)
                    );

                render(list);
            }
        );
}

/* =========================================================
   SEARCH PAGE INPUT
   ========================================================= */

if ($("#searchPageInput")) {

    $("#searchPageInput")
        .addEventListener(
            "input",
            event => {

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
        () => {

            if (!$("#gameFrame")) {
                return;
            }

            const frame =
                $("#gameFrame");

            frame.src =
                frame.src;
        };
}

if ($("#playerFullscreen")) {

    $("#playerFullscreen").onclick =
        () => {

            const frame =
                $("#gameFrame");

            if (!frame) return;

            if (
                frame.requestFullscreen
            ) {

                frame.requestFullscreen();
            }
        };
}

if ($("#playerDownload")) {

    $("#playerDownload").onclick =
        () => {

            if (!currentGame) {
                return;
            }

            const link =
                document.createElement("a");

            link.href =
                currentGame.path;

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
        closeEditor;
}

if ($("#editorCancel")) {

    $("#editorCancel").onclick =
        closeEditor;
}

if ($("#saveGameBtn")) {

    $("#saveGameBtn").onclick =
        saveEditor;
}

/* =========================================================
   SETTINGS
   ========================================================= */

if ($("#setTabName")) {

    $("#setTabName").oninput =
        event => {

            cfg.tabName =
                event.target.value;

            save();
            apply();
        };
}

if ($("#setSiteName")) {

    $("#setSiteName").oninput =
        event => {

            cfg.siteName =
                event.target.value;

            save();
            apply();
        };
}

if ($("#setHomeTitle")) {

    $("#setHomeTitle").oninput =
        event => {

            cfg.homeTitle =
                event.target.value;

            save();
            apply();
        };
}

if ($("#setHomeSub")) {

    $("#setHomeSub").oninput =
        event => {

            cfg.homeSub =
                event.target.value;

            save();
            apply();
        };
}

if ($("#setGamesTitle")) {

    $("#setGamesTitle").oninput =
        event => {

            cfg.gamesTitle =
                event.target.value;

            save();
            apply();
        };
}

if ($("#setRecentTitle")) {

    $("#setRecentTitle").oninput =
        event => {

            cfg.recentTitle =
                event.target.value;

            save();
            apply();
        };
}

if ($("#setAccent")) {

    $("#setAccent").oninput =
        event => {

            cfg.accent =
                event.target.value;

            save();
            apply();
        };
}

if ($("#setCardSize")) {

    $("#setCardSize").onchange =
        event => {

            cfg.cardSize =
                event.target.value;

            save();
            apply();
        };
}

if ($("#darkToggle")) {

    $("#darkToggle").onclick =
        () => {

            cfg.dark =
                !cfg.dark;

            save();
            apply();
        };
}

/* =========================================================
   BACKGROUND UPLOAD
   ========================================================= */

if ($("#bgUpload")) {

    $("#bgUpload").onchange =
        event => {

            const file =
                event.target.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload =
                () => {

                    cfg.bg =
                        reader.result;

                    save();
                    apply();

                    toast(
                        "Background saved"
                    );
                };

            reader.readAsDataURL(file);
        };
}

/* =========================================================
   CLEAR BACKGROUND
   ========================================================= */

if ($("#clearBg")) {

    $("#clearBg").onclick =
        () => {

            cfg.bg = "";

            save();
            apply();

            toast(
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

            toast(
                editMode
                    ? "Edit mode on"
                    : "Edit mode off"
            );
        };
}

/* =========================================================
   EXPORT SETTINGS
   ========================================================= */

if ($("#exportBtn")) {

    $("#exportBtn").onclick =
        () => {

            const data = {

                config: cfg,

                games: games
            };

            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );

            const url =
                URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "applebottom-settings.json";

            document.body.appendChild(
                link
            );

            link.click();

            link.remove();

            URL.revokeObjectURL(url);
        };
}

/* =========================================================
   RESET
   ========================================================= */

if ($("#resetBtn")) {

    $("#resetBtn").onclick =
        () => {

            if (
                confirm(
                    "Reset APPLEBOTTOM settings and games?"
                )
            ) {

                localStorage.removeItem(
                    "applebottom_cfg"
                );

                localStorage.removeItem(
                    "applebottom_games"
                );

                location.reload();
            }
        };
}

/* =========================================================
   LOCAL GAME FILE
   ========================================================= */

if ($("#localGame")) {

    $("#localGame").onchange =
        event => {

            const file =
                event.target.files[0];

            if (!file) return;

            const url =
                URL.createObjectURL(
                    file
                );

            localGameUrl = url;

            const game = {

                id:
                    "local-" +
                    Date.now(),

                name:
                    file.name
                        .replace(
                            /\.html?$/i,
                            ""
                        ),

                icon: "📄",

                path: url,

                added:
                    Date.now(),

                desc:
                    "Local game"
            };

            games.unshift(game);

            /*
                NOTE:
                Blob URLs don't survive a page
                refresh. This is intended for
                temporary local games.
            */

            render();
            apply();

            toast(
                "Local game added"
            );
        };
}

/* =========================================================
   GAME FILE INPUT
   ========================================================= */

if ($("#gameFileInput")) {

    $("#gameFileInput").onchange =
        event => {

            const file =
                event.target.files[0];

            if (!file) return;

            const url =
                URL.createObjectURL(
                    file
                );

            $("#gamePathInput").value =
                url;
        };
}

/* =========================================================
   ADMINME KEYWORD
   ========================================================= */

let typed = "";

document.addEventListener(
    "keydown",
    event => {

        /* ESCAPE */

        if (
            event.key ===
            "Escape"
        ) {

            if (
                $("#gameModal") &&
                !$("#gameModal")
                    .classList
                    .contains("hidden")
            ) {

                closeGame();
            }

            if (
                $("#gameEditor") &&
                !$("#gameEditor")
                    .classList
                    .contains("hidden")
            ) {

                closeEditor();
            }
        }

        /* ADMINME */

        const tag =
            document.activeElement?.tagName;

        if (
            tag !== "INPUT" &&
            tag !== "TEXTAREA"
        ) {

            typed =
                (
                    typed +
                    event.key.toLowerCase()
                ).slice(-7);

            if (
                typed ===
                "adminme"
            ) {

                editMode =
                    !editMode;

                document.body.classList.toggle(
                    "edit-mode",
                    editMode
                );

                toast(
                    editMode
                        ? "Edit mode unlocked"
                        : "Edit mode locked"
                );

                typed = "";
            }
        }
    }
);

/* =========================================================
   CLOCK
   ========================================================= */

function clock() {

    if (!$("#dateTime")) {
        return;
    }

    const date =
        new Date();

    $("#dateTime")
        .textContent =
        date.toLocaleString(
            undefined,
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        )
        +
        " — "
        +
        date.toLocaleTimeString(
            undefined,
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    setTimeout(
        clock,
        1000
    );
}

/* =========================================================
   START APP
   ========================================================= */

bindNav();

apply();

render();

clock();

/*
   SAVE THE CLEAN GAME LIST

   This permanently removes the old demo
   games from this browser's saved data.
*/

save();
