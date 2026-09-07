// ==========================================
// APPLEBOTTOM UBG
// Main Website Script
// ==========================================


// ==========================================
// GAME LIST
// ==========================================

const games = [

    {
        name: "2048",
        icon: "🔢",
        description: "Combine numbers and reach 2048.",
        url: "https://play2048.co/"
    },

    {
        name: "Snake",
        icon: "🐍",
        description: "Classic snake game.",
        url: "https://playsnake.org/"
    },

    {
        name: "Tetris",
        icon: "🟦",
        description: "Classic block puzzle game.",
        url: "https://tetris.com/play-tetris"
    },

    {
        name: "Chess",
        icon: "♟️",
        description: "Play a classic game of chess.",
        url: "https://www.chess.com/play/computer"
    },

    {
        name: "Cookie Clicker",
        icon: "🍪",
        description: "Click cookies and build your cookie empire.",
        url: "https://orteil.dashnet.org/cookieclicker/"
    },

    {
        name: "Flappy Bird",
        icon: "🐦",
        description: "Fly through the pipes.",
        url: "#"
    },

    {
        name: "Memory",
        icon: "🧠",
        description: "Test your memory.",
        url: "#"
    },

    {
        name: "Minesweeper",
        icon: "💣",
        description: "Clear the board without hitting a mine.",
        url: "#"
    },

    {
        name: "Solitaire",
        icon: "🃏",
        description: "Classic card game.",
        url: "#"
    },

    {
        name: "Word Game",
        icon: "🔤",
        description: "Test your vocabulary.",
        url: "#"
    },

    {
        name: "Color Match",
        icon: "🎨",
        description: "Match the correct colors.",
        url: "#"
    },

    {
        name: "Block Puzzle",
        icon: "🧩",
        description: "Fit the blocks together.",
        url: "#"
    },

    {
        name: "Doodle Jump",
        icon: "⬆️",
        description: "Jump as high as possible.",
        url: "#"
    },

    {
        name: "Space Puzzle",
        icon: "🚀",
        description: "Solve puzzles in space.",
        url: "#"
    },

    {
        name: "Crossword",
        icon: "✏️",
        description: "Solve a crossword puzzle.",
        url: "#"
    },

    {
        name: "Astro",
        icon: "🌌",
        description: "Explore the stars.",
        url: "#"
    },

    {
        name: "Basketball",
        icon: "🏀",
        description: "Practice your shots.",
        url: "#"
    },

    {
        name: "Kart",
        icon: "🏎️",
        description: "Race around the track.",
        url: "#"
    },

    {
        name: "Jetpack",
        icon: "🎒",
        description: "Fly through the level.",
        url: "#"
    },

    {
        name: "Little Alchemy",
        icon: "⚗️",
        description: "Combine elements.",
        url: "#"
    },

    {
        name: "Pac-Man",
        icon: "🟡",
        description: "Classic maze game.",
        url: "#"
    },

    {
        name: "Portal Puzzle",
        icon: "🌀",
        description: "Solve portal puzzles.",
        url: "#"
    },

    {
        name: "Falling Sand",
        icon: "⏳",
        description: "Experiment with falling particles.",
        url: "#"
    },

    {
        name: "Clicker",
        icon: "🖱️",
        description: "Click your way to a high score.",
        url: "#"
    },

    {
        name: "Adventure",
        icon: "🗺️",
        description: "Explore a mysterious world.",
        url: "#"
    },

    {
        name: "Hextris",
        icon: "⬡",
        description: "Match falling blocks.",
        url: "#"
    },

    {
        name: "Zuma",
        icon: "🔴",
        description: "Match the colored pieces.",
        url: "#"
    },

    {
        name: "Fireboy",
        icon: "🔥",
        description: "Solve platforming puzzles.",
        url: "#"
    },

    {
        name: "Ice World",
        icon: "❄️",
        description: "Explore a frozen world.",
        url: "#"
    },

    {
        name: "Castle Puzzle",
        icon: "🏰",
        description: "Solve the castle puzzles.",
        url: "#"
    }

];


// ==========================================
// ELEMENTS
// ==========================================

const homePage = document.getElementById("home");
const gamesPage = document.getElementById("games");
const searchPage = document.getElementById("searchPage");

const recentContainer = document.getElementById("recent");
const allContainer = document.getElementById("all");
const gamesContainer = document.getElementById("gamesGrid");

const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

const shade = document.getElementById("shade");
const settingsButton = document.getElementById("settingsBtn");
const closeSettings = document.getElementById("closeSettings");

const pageTitle = document.getElementById("pageTitle");


// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageName) {

    // Hide every page

    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.remove("active-page");
    });


    // Remove active state from buttons

    document.querySelectorAll(".nav").forEach(function(button) {
        button.classList.remove("active");
    });


    // Show requested page

    if (pageName === "home") {

        homePage.classList.add("active-page");

        pageTitle.innerHTML =
            'Home <em>252</em>';

    }


    if (pageName === "games") {

        gamesPage.classList.add("active-page");

        pageTitle.innerHTML =
            'Games <em>252</em>';

    }


    if (pageName === "search") {

        searchPage.classList.add("active-page");

        pageTitle.innerHTML =
            'Search <em>252</em>';

        setTimeout(function() {

            if (searchInput) {
                searchInput.focus();
            }

        }, 100);

    }


    // Activate correct sidebar button

    document.querySelectorAll(".nav").forEach(function(button) {

        if (button.dataset.page === pageName) {
            button.classList.add("active");
        }

    });


    // Scroll to top

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ==========================================
// SIDEBAR BUTTONS
// ==========================================

document.querySelectorAll(".nav").forEach(function(button) {

    button.addEventListener("click", function() {

        const page = button.dataset.page;

        showPage(page);

    });

});


// ==========================================
// HERO BUTTONS
// ==========================================

const heroSearch = document.getElementById("heroSearch");

if (heroSearch) {

    heroSearch.addEventListener("click", function() {

        showPage("search");

    });

}


const browseButton = document.getElementById("browse");

if (browseButton) {

    browseButton.addEventListener("click", function() {

        showPage("games");

    });

}


// ==========================================
// SETTINGS
// ==========================================

if (settingsButton) {

    settingsButton.addEventListener("click", function() {

        shade.classList.add("open");

    });

}


if (closeSettings) {

    closeSettings.addEventListener("click", function() {

        shade.classList.remove("open");

    });

}


// Click outside settings drawer

if (shade) {

    shade.addEventListener("click", function(event) {

        if (event.target === shade) {

            shade.classList.remove("open");

        }

    });

}


// ESC closes settings

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        shade.classList.remove("open");

    }

});


// ==========================================
// ACCENT COLORS
// ==========================================

document.querySelectorAll(".swatches button").forEach(function(button) {

    button.addEventListener("click", function() {

        const color = button.dataset.c;

        document.body.style.setProperty(
            "--accent",
            color
        );

        localStorage.setItem(
            "applebottomAccent",
            color
        );

    });

});


// Load saved accent

const savedAccent =
    localStorage.getItem("applebottomAccent");

if (savedAccent) {

    document.body.style.setProperty(
        "--accent",
        savedAccent
    );

}


// ==========================================
// CARD SIZE
// ==========================================

document.querySelectorAll(".sizes button").forEach(function(button) {

    button.addEventListener("click", function() {

        document.body.classList.remove(
            "small",
            "large"
        );

        const size = button.dataset.s;

        if (size === "small") {

            document.body.classList.add("small");

        }

        if (size === "large") {

            document.body.classList.add("large");

        }


        document.querySelectorAll(".sizes button").forEach(function(b) {

            b.classList.remove("selected");

        });

        button.classList.add("selected");

    });

});


// ==========================================
// GAME CARD CREATOR
// ==========================================

function createGameCard(game) {

    const card =
        document.createElement("div");

    card.className = "card";


    card.innerHTML = `

        <div class="thumb">

            ${game.icon}

        </div>

        <div class="name">

            ${game.name}

        </div>

    `;


    card.addEventListener("click", function() {

        openGame(game);

    });


    return card;

}


// ==========================================
// DISPLAY GAMES
// ==========================================

function displayGames() {

    recentContainer.innerHTML = "";

    allContainer.innerHTML = "";

    gamesContainer.innerHTML = "";


    // First 6 = recently added

    games.slice(0, 6).forEach(function(game) {

        recentContainer.appendChild(
            createGameCard(game)
        );

    });


    // Everything

    games.forEach(function(game) {

        allContainer.appendChild(
            createGameCard(game)
        );

    });


    // Games page

    games.forEach(function(game) {

        gamesContainer.appendChild(
            createGameCard(game)
        );

    });

}


displayGames();


// ==========================================
// GAME POPUP
// ==========================================

function openGame(game) {

    // Remove old popup

    const oldPopup =
        document.getElementById("gamePopup");

    if (oldPopup) {
        oldPopup.remove();
    }


    const popup =
        document.createElement("div");

    popup.id = "gamePopup";


    popup.innerHTML = `

        <div class="game-popup">

            <div class="game-popup-header">

                <div>

                    <span class="popup-icon">
                        ${game.icon}
                    </span>

                    <strong>
                        ${game.name}
                    </strong>

                </div>

                <button id="closeGame">
                    ×
                </button>

            </div>


            <div class="game-popup-body">

                <div class="big-game-icon">
                    ${game.icon}
                </div>

                <h2>
                    ${game.name}
                </h2>

                <p>
                    ${game.description}
                </p>

                ${
                    game.url !== "#"
                    ?
                    `<button id="playGame" class="play-button">
                        PLAY GAME →
                    </button>`
                    :
                    `<div class="coming-soon">
                        GAME COMING SOON
                    </div>`
                }

            </div>

        </div>

    `;


    document.body.appendChild(popup);


    // Close button

    document
        .getElementById("closeGame")
        .addEventListener("click", function() {

            popup.remove();

        });


    // Play button

    const playButton =
        document.getElementById("playGame");

    if (playButton) {

        playButton.addEventListener("click", function() {

            window.open(
                game.url,
                "_blank"
            );

        });

    }


    // Click dark background

    popup.addEventListener("click", function(event) {

        if (event.target === popup) {

            popup.remove();

        }

    });

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const search =
            searchInput.value
                .trim()
                .toLowerCase();


        resultsContainer.innerHTML = "";


        // Nothing typed

        if (search === "") {

            resultsContainer.innerHTML = `

                <div class="result">

                    Type a game name to search.

                </div>

            `;

            return;

        }


        // Find matching games

        const matches =
            games.filter(function(game) {

                return game.name
                    .toLowerCase()
                    .includes(search);

            });


        // Nothing found

        if (matches.length === 0) {

            resultsContainer.innerHTML = `

                <div class="result">

                    No games found.

                </div>

            `;

            return;

        }


        // Display results

        matches.forEach(function(game) {

            const result =
                document.createElement("div");

            result.className = "result";

            result.style.cursor = "pointer";


            result.innerHTML = `

                <b>
                    ${game.icon}
                </b>

                ${game.name}

            `;


            result.addEventListener("click", function() {

                openGame(game);

            });


            resultsContainer.appendChild(result);

        });

    });

}


// ==========================================
// SETTINGS TAB NAME
// ==========================================

const tabName =
    document.getElementById("tabName");


if (tabName) {

    tabName.addEventListener("input", function() {

        document.title =
            tabName.value || "APPLEBOTTOM UBG";

    });

}


// ==========================================
// DATE + TIME
// ==========================================

function updateClock() {

    const now = new Date();


    const dateText =
        now.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    const timeText =
        now.toLocaleTimeString(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    if (document.getElementById("date")) {

        document.getElementById("date").textContent =
            dateText + " • " + timeText;

    }


    if (document.getElementById("clock")) {

        document.getElementById("clock").textContent =
            dateText + " — " + timeText;

    }

}


updateClock();


setInterval(
    updateClock,
    30000
);


// ==========================================
// START ON HOME
// ==========================================

showPage("home");
