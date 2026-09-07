// ======================================================
// APPLEBOTTOM UBG
// FULL INTERACTIVE WEBSITE SCRIPT
// ======================================================


// ======================================================
// GAME LIST
// ======================================================

const games = [
    ["Firefox", "🦊"],
    ["Krita", "🎨"],
    ["Impossible Quiz 2", "❓"],
    ["Scary Teacher 3D", "🏫"],
    ["Celeste 64", "🏔️"],
    ["Balatro Modded", "🃏"],
    ["2048", "🔢"],
    ["Adventure", "🗺️"],
    ["Astro", "🚀"],
    ["Basketball", "🏀"],
    ["Block Puzzle", "🧩"],
    ["Chess", "♟️"],
    ["Clicker", "🖱️"],
    ["Cookie Clicker", "🍪"],
    ["Crossword", "✏️"],
    ["Doodle Jump", "⬆️"],
    ["Flappy Bird", "🐦"],
    ["Geometry Dash", "🔷"],
    ["Hextris", "⬡"],
    ["Jetpack", "🎒"],
    ["Kart", "🏎️"],
    ["Little Alchemy", "⚗️"],
    ["Minesweeper", "💣"],
    ["Pac-Man", "🟡"],
    ["Portal Puzzle", "🌀"],
    ["Snake", "🐍"],
    ["Solitaire", "🃏"],
    ["Space Invaders", "👾"],
    ["Tetris", "🟦"],
    ["Wordle", "🟩"],
    ["World Guessr", "🌎"],
    ["Zuma", "🔴"]
];


// ======================================================
// HELPER FUNCTIONS
// ======================================================

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}


// ======================================================
// GET GAME NAME / ICON
// Works with your current [name, icon] format
// ======================================================

function gameName(game) {
    return game[0];
}

function gameIcon(game) {
    return game[1];
}


// ======================================================
// CREATE GAME CARD
// ======================================================

function createCard(game) {

    const name = gameName(game);
    const icon = gameIcon(game);

    return `
        <div
            class="card"
            data-game="${escapeHTML(name)}"
            tabindex="0"
            role="button"
            aria-label="Open ${escapeHTML(name)}"
        >

            <div class="thumb">
                <div class="game-icon">
                    ${icon}
                </div>
            </div>

            <div class="name">
                ${escapeHTML(name)}
            </div>

        </div>
    `;
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================================
// LOAD HOME GAMES
// ======================================================

function loadHomeGames() {

    const allHome = $("#allHome");
    const recent = $("#recent");
    const allGames = $("#allGames");

    if (recent) {

        recent.innerHTML = games
            .slice(0, 6)
            .map(createCard)
            .join("");

    }

    if (allHome) {

        allHome.innerHTML = games
            .map(createCard)
            .join("");

    }

    if (allGames) {

        allGames.innerHTML = games
            .map(createCard)
            .join("");

    }

    setupCards();
}


// ======================================================
// LOAD GAMES PAGE
// ======================================================

function loadGamesPage() {

    const allGames = $("#allGames");

    if (!allGames) return;

    allGames.innerHTML = games
        .map(createCard)
        .join("");

    setupCards();
}


// ======================================================
// MAKE GAME CARDS CLICKABLE
// ======================================================

function setupCards() {

    $$(".card").forEach(card => {

        if (card.dataset.listener === "true") {
            return;
        }

        card.dataset.listener = "true";

        card.addEventListener("click", function () {

            const name = card.dataset.game;

            const game = games.find(
                item => gameName(item) === name
            );

            if (!game) return;

            openGame(game);

        });


        // Keyboard support

        card.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                const name = card.dataset.game;

                const game = games.find(
                    item => gameName(item) === name
                );

                if (game) {
                    openGame(game);
                }

            }

        });

    });

}


// ======================================================
// OPEN GAME
// ======================================================

function openGame(game) {

    closeGame();

    const name = gameName(game);
    const icon = gameIcon(game);

    const popup = document.createElement("div");

    popup.id = "gamePopup";

    popup.innerHTML = `

        <div class="game-popup">

            <div class="game-popup-header">

                <div class="popup-title">

                    <span class="popup-game-icon">
                        ${icon}
                    </span>

                    <span>
                        ${escapeHTML(name)}
                    </span>

                </div>


                <button
                    class="popup-close"
                    id="closeGame"
                    aria-label="Close game"
                >
                    ×
                </button>

            </div>


            <div class="game-popup-body">

                <div class="game-placeholder">

                    <div class="placeholder-icon">
                        ${icon}
                    </div>

                    <h2>
                        ${escapeHTML(name)}
                    </h2>

                    <p>
                        This game is ready to be added to APPLEBOTTOM.
                    </p>

                    <div class="placeholder-status">
                        GAME PAGE
                    </div>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(popup);

    document.body.style.overflow = "hidden";


    const closeButton = $("#closeGame");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeGame
        );

    }


    popup.addEventListener("click", function (event) {

        if (event.target === popup) {
            closeGame();
        }

    });

}


// ======================================================
// CLOSE GAME
// ======================================================

function closeGame() {

    const popup = $("#gamePopup");

    if (popup) {
        popup.remove();
    }

    document.body.style.overflow = "";

}


// ======================================================
// ESC KEY
// ======================================================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeGame();
        closeSettings();

    }

});


// ======================================================
// PAGE NAVIGATION
// ======================================================

function showPage(pageName) {

    const pages = $$(".page");

    pages.forEach(page => {

        page.classList.remove("active");

        page.style.display = "";

    });


    let target = null;


    if (pageName === "home") {

        target =
            $("#home") ||
            $(".home");

    }


    if (pageName === "games") {

        target =
            $("#games") ||
            $(".games");

    }


    if (pageName === "search") {

        target =
            $("#searchPage") ||
            $("#search") ||
            $(".search-page");

    }


    if (pageName === "settings") {

        openSettings();

        return;

    }


    if (target) {

        target.classList.add("active");

    }


    updateNavigation(pageName);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================================
// UPDATE NAVIGATION BUTTONS
// ======================================================

function updateNavigation(pageName) {

    $$("nav button").forEach(button => {

        button.classList.remove("active");

        const buttonPage =
            button.dataset.page;

        const text =
            button.textContent
                .trim()
                .toLowerCase();


        if (
            buttonPage === pageName ||
            text.includes(pageName)
        ) {

            button.classList.add("active");

        }

    });


    const title = $("#title");

    if (!title) return;


    if (pageName === "home") {

        title.innerHTML =
            `Home <i>252</i>`;

    }

    else if (pageName === "games") {

        title.innerHTML =
            `Games <i>252</i>`;

    }

    else if (pageName === "search") {

        title.innerHTML =
            `Search <i>252</i>`;

    }

}


// ======================================================
// NAVIGATION BUTTONS
// ======================================================

$$("nav button").forEach(button => {

    button.addEventListener("click", function () {

        let pageName =
            button.dataset.page;


        if (!pageName) {

            const text =
                button.textContent
                    .trim()
                    .toLowerCase();


            if (text.includes("home")) {
                pageName = "home";
            }

            else if (text.includes("games")) {
                pageName = "games";
            }

            else if (text.includes("search")) {
                pageName = "search";
            }

            else if (text.includes("settings")) {
                pageName = "settings";
            }

        }


        if (pageName) {

            showPage(pageName);

        }

    });

});


// ======================================================
// BROWSE ALL GAMES
// ======================================================

const browseButtons = [
    "#browse",
    "#browseAll",
    ".browse-all"
];


browseButtons.forEach(selector => {

    $$(selector).forEach(button => {

        button.addEventListener("click", function () {

            showPage("games");

        });

    });

});


// ======================================================
// HERO SEARCH
// ======================================================

const heroSearch = $("#heroSearch");

if (heroSearch) {

    heroSearch.addEventListener("click", function () {

        showPage("search");

        setTimeout(() => {

            const input =
                $("#searchInput");

            if (input) {
                input.focus();
            }

        }, 100);

    });

}


// ======================================================
// SEARCH SYSTEM
// ======================================================

const searchInput = $("#searchInput");

const results =
    $("#results");


function searchGames(query) {

    const text =
        query
            .trim()
            .toLowerCase();


    if (!results) return;


    if (!text) {

        results.innerHTML = `
            <div class="search-message">
                Search for a game above.
            </div>
        `;

        return;

    }


    const matches =
        games.filter(game =>
            gameName(game)
                .toLowerCase()
                .includes(text)
        );


    if (matches.length === 0) {

        results.innerHTML = `
            <div class="search-message">
                No games found.
            </div>
        `;

        return;

    }


    results.innerHTML =
        matches.map(game => `

            <div
                class="search-result"
                data-game="${escapeHTML(gameName(game))}"
                tabindex="0"
            >

                <span class="search-result-icon">
                    ${gameIcon(game)}
                </span>

                <span>
                    ${escapeHTML(gameName(game))}
                </span>

            </div>

        `).join("");


    $$(".search-result").forEach(result => {

        result.addEventListener("click", function () {

            const name =
                result.dataset.game;

            const game =
                games.find(
                    item => gameName(item) === name
                );

            if (game) {
                openGame(game);
            }

        });

    });

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            searchGames(
                searchInput.value
            );

        }
    );

}


// ======================================================
// SETTINGS PANEL
// ======================================================

function openSettings() {

    const shade = $("#shade");

    if (shade) {

        shade.classList.add("open");

        shade.style.display = "flex";

    }

}


function closeSettings() {

    const shade = $("#shade");

    if (shade) {

        shade.classList.remove("open");

        shade.style.display = "";

    }

}


const settingsButton = $("#settings");

if (settingsButton) {

    settingsButton.addEventListener(
        "click",
        openSettings
    );

}


const closeSettingsButton = $("#close");

if (closeSettingsButton) {

    closeSettingsButton.addEventListener(
        "click",
        closeSettings
    );

}


const shade = $("#shade");

if (shade) {

    shade.addEventListener(
        "click",
        function (event) {

            if (event.target === shade) {
                closeSettings();
            }

        }
    );

}


// ======================================================
// ACCENT COLOR SETTINGS
// ======================================================

function setAccent(color) {

    if (!color) return;

    document.documentElement
        .style
        .setProperty("--accent", color);


    localStorage.setItem(
        "applebottomAccent",
        color
    );

}


$$(".swatches button").forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const color =
                button.dataset.c ||
                button.dataset.color;


            if (color) {

                setAccent(color);

            }

        }
    );

});


// Load saved accent

const savedAccent =
    localStorage.getItem(
        "applebottomAccent"
    );


if (savedAccent) {

    setAccent(savedAccent);

}


// ======================================================
// CARD SIZE SETTINGS
// ======================================================

function setCardSize(size) {

    document.body.classList.remove(
        "small",
        "large"
    );


    if (size === "small") {

        document.body.classList.add(
            "small"
        );

    }


    if (size === "large") {

        document.body.classList.add(
            "large"
        );

    }


    localStorage.setItem(
        "applebottomCardSize",
        size
    );

}


$$(".sizes button").forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const size =
                button.dataset.s ||
                button.dataset.size;


            if (size) {

                setCardSize(size);

            }


            $$(".sizes button").forEach(
                b => b.classList.remove("selected")
            );


            button.classList.add("selected");

        }
    );

});


// Load saved size

const savedSize =
    localStorage.getItem(
        "applebottomCardSize"
    );


if (savedSize) {

    setCardSize(savedSize);

}


// ======================================================
// TAB NAME
// ======================================================

const tabName = $("#tabName");


if (tabName) {

    const savedTabName =
        localStorage.getItem(
            "applebottomTabName"
        );


    if (savedTabName) {

        tabName.value =
            savedTabName;

        document.title =
            savedTabName;

    }


    tabName.addEventListener(
        "input",
        function () {

            const value =
                tabName.value.trim();


            const finalName =
                value ||
                "APPLEBOTTOM UBG";


            document.title =
                finalName;


            localStorage.setItem(
                "applebottomTabName",
                finalName
            );

        }
    );

}


// ======================================================
// CLOCK
// ======================================================

function updateClock() {

    const dateElement = $("#date");

    if (!dateElement) return;


    const now = new Date();


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


    dateElement.textContent =
        `${date} • ${time}`;

}


updateClock();


setInterval(
    updateClock,
    30000
);


// ======================================================
// TOP-RIGHT BUTTONS
// ======================================================

// Makes icon buttons work even if they don't have IDs.

$$("header button, .top-buttons button, .header-buttons button")
.forEach(button => {

    if (
        button.id === "settings" ||
        button.dataset.page
    ) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const label =
                (
                    button.getAttribute("aria-label") ||
                    button.title ||
                    button.textContent
                )
                .toLowerCase();


            // Settings

            if (label.includes("setting")) {

                openSettings();

                return;

            }


            // Home

            if (label.includes("home")) {

                showPage("home");

                return;

            }


            // Games

            if (label.includes("game")) {

                showPage("games");

                return;

            }


            // Search

            if (label.includes("search")) {

                showPage("search");

                return;

            }

        }
    );

});


// ======================================================
// MOBILE SIDEBAR
// ======================================================

const menuButton =
    $("#menu") ||
    $("#menuButton") ||
    $(".menu-button");


const sidebar =
    $("aside") ||
    $(".sidebar");


if (menuButton && sidebar) {

    menuButton.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle("open");

        }
    );

}


// ======================================================
// CLOSE MOBILE SIDEBAR AFTER NAVIGATION
// ======================================================

$$("nav button").forEach(button => {

    button.addEventListener(
        "click",
        function () {

            if (sidebar) {

                sidebar.classList.remove(
                    "open"
                );

            }

        }
    );

});


// ======================================================
// FIX COMMON BUTTONS
// ======================================================

// Any element with data-page automatically works.

$$("[data-page]").forEach(element => {

    element.addEventListener(
        "click",
        function () {

            const pageName =
                element.dataset.page;

            if (pageName) {

                showPage(pageName);

            }

        }
    );

});


// ======================================================
// INITIALIZE EVERYTHING
// ======================================================

function initializeApp() {

    loadHomeGames();

    loadGamesPage();

    // Start on Home

    showPage("home");


    // Search placeholder

    if (results && !results.innerHTML.trim()) {

        results.innerHTML = `
            <div class="search-message">
                Search for a game above.
            </div>
        `;

    }

}


// Wait until the HTML is loaded

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}
