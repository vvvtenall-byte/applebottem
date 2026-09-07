// ==========================================
// APPLEBOTTOM UBG - SCRIPT
// ==========================================

// ------------------------------
// GAME DATA
// ------------------------------

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


// ------------------------------
// HELPER
// ------------------------------

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}


// ------------------------------
// CREATE GAME CARD
// ------------------------------

function createCard(game) {

    const name = game[0];
    const icon = game[1];

    return `
        <div class="card" data-game="${name}">
            <div class="thumb">
                ${icon}
            </div>

            <div class="name">
                ${name}
            </div>
        </div>
    `;
}


// ------------------------------
// PUT GAMES ON PAGE
// ------------------------------

function loadGames() {

    const allGames = $("#allGames");
    const recent = $("#recent");

    // All games

    if (allGames) {

        allGames.innerHTML = games
            .map(createCard)
            .join("");

    }


    // Recently added

    if (recent) {

        recent.innerHTML = games
            .slice(0, 6)
            .map(createCard)
            .join("");

    }


    // Make cards clickable

    setupGameCards();
}


// ------------------------------
// GAMES PAGE
// ------------------------------

function loadGamesPage() {

    const gamesPage = $("#games");

    if (!gamesPage) return;


    // Look for an existing game container

    let container =
        gamesPage.querySelector("#gamesGrid");


    // If it doesn't exist, create one

    if (!container) {

        container = document.createElement("div");

        container.id = "gamesGrid";

        container.className = "game-grid";

        gamesPage.appendChild(container);

    }


    container.innerHTML =
        games.map(createCard).join("");


    setupGameCards();

}


// ------------------------------
// GAME CARD CLICK
// ------------------------------

function setupGameCards() {

    $$(".card").forEach(card => {

        card.onclick = function() {

            const gameName =
                card.dataset.game;

            const game =
                games.find(g => g[0] === gameName);

            if (!game) return;

            openGame(game);

        };

    });

}


// ------------------------------
// GAME POPUP
// ------------------------------

function openGame(game) {

    // Remove old popup

    const old =
        $("#gamePopup");

    if (old) {
        old.remove();
    }


    const name = game[0];
    const icon = game[1];


    const popup =
        document.createElement("div");

    popup.id = "gamePopup";


    popup.innerHTML = `

        <div class="game-popup">

            <div class="game-popup-header">

                <div class="popup-title">

                    <span class="popup-icon">
                        ${icon}
                    </span>

                    <strong>
                        ${name}
                    </strong>

                </div>


                <button
                    class="popup-close"
                    id="closeGame"
                >
                    ×
                </button>

            </div>


            <div class="game-popup-body">

                <div class="big-game-icon">
                    ${icon}
                </div>

                <h2>
                    ${name}
                </h2>

                <p>
                    This game is ready to be added to APPLEBOTTOM.
                </p>

                <div class="coming-soon">
                    GAME PAGE COMING SOON
                </div>

            </div>

        </div>

    `;


    document.body.appendChild(popup);


    // Close button

    const close =
        $("#closeGame");

    if (close) {

        close.onclick = function() {

            popup.remove();

        };

    }


    // Click outside popup

    popup.onclick = function(event) {

        if (event.target === popup) {

            popup.remove();

        }

    };

}


// ------------------------------
// PAGE NAVIGATION
// ------------------------------

function page(pageName) {

    // Hide all pages

    $$(".page").forEach(section => {

        section.classList.remove("active");

    });


    // Remove active nav

    $$("nav button").forEach(button => {

        button.classList.remove("active");

    });


    // Find requested page

    let target;

    if (pageName === "home") {

        target = $("#home");

    }

    else if (pageName === "games") {

        target = $("#games");

    }

    else if (pageName === "search") {

        target = $("#searchPage");

    }


    // Show page

    if (target) {

        target.classList.add("active");

    }


    // Activate navigation button

    const button =
        document.querySelector(
            `nav button[data-page="${pageName}"]`
        );


    if (button) {

        button.classList.add("active");

    }


    // Change title

    const title =
        $("#title");


    if (title) {

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


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ------------------------------
// NAVIGATION BUTTONS
// ------------------------------

$$("nav button[data-page]").forEach(button => {

    button.onclick = function() {

        page(button.dataset.page);

    };

});


// ------------------------------
// BROWSE ALL GAMES
// ------------------------------

const browse =
    $("#browse");


if (browse) {

    browse.onclick = function() {

        page("games");

    };

}


// ------------------------------
// HERO SEARCH
// ------------------------------

const heroSearch =
    $("#heroSearch");


if (heroSearch) {

    heroSearch.onclick = function() {

        page("search");

    };

}


// ------------------------------
// SETTINGS
// ------------------------------

const settings =
    $("#settings");


const shade =
    $("#shade");


const closeSettings =
    $("#close");


if (settings && shade) {

    settings.onclick = function() {

        shade.classList.add("open");

    };

}


if (closeSettings && shade) {

    closeSettings.onclick = function() {

        shade.classList.remove("open");

    };

}


// Click outside settings

if (shade) {

    shade.onclick = function(event) {

        if (event.target === shade) {

            shade.classList.remove("open");

        }

    };

}


// ------------------------------
// ESC KEY
// ------------------------------

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            // Close settings

            if (shade) {

                shade.classList.remove("open");

            }


            // Close game popup

            const popup =
                $("#gamePopup");

            if (popup) {

                popup.remove();

            }

        }

    }
);


// ------------------------------
// SEARCH
// ------------------------------

const searchInput =
    $("#searchInput");


const results =
    $("#results");


if (searchInput && results) {

    searchInput.addEventListener(
        "input",
        function() {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            // Empty search

            if (!query) {

                results.innerHTML = `
                    <div class="result">
                        Type a game name to search.
                    </div>
                `;

                return;

            }


            // Search games

            const matches =
                games.filter(game =>
                    game[0]
                        .toLowerCase()
                        .includes(query)
                );


            // No results

            if (matches.length === 0) {

                results.innerHTML = `
                    <div class="result">
                        No games found.
                    </div>
                `;

                return;

            }


            // Results

            results.innerHTML =
                matches.map(game => `

                    <div
                        class="result"
                        data-game="${game[0]}"
                    >

                        <span>
                            ${game[1]}
                        </span>

                        ${game[0]}

                    </div>

                `).join("");


            // Result clicks

            $$(".result[data-game]").forEach(result => {

                result.onclick = function() {

                    const name =
                        result.dataset.game;

                    const game =
                        games.find(
                            g => g[0] === name
                        );

                    if (game) {

                        openGame(game);

                    }

                };

            });

        }
    );

}


// ------------------------------
// ACCENT COLORS
// ------------------------------

$$(".swatches button").forEach(button => {

    button.onclick = function() {

        const color =
            button.dataset.c;


        if (!color) return;


        document.documentElement
            .style
            .setProperty(
                "--accent",
                color
            );


        localStorage.setItem(
            "applebottomAccent",
            color
        );

    };

});


// Load saved accent

const savedAccent =
    localStorage.getItem(
        "applebottomAccent"
    );


if (savedAccent) {

    document.documentElement
        .style
        .setProperty(
            "--accent",
            savedAccent
        );

}


// ------------------------------
// CARD SIZE
// ------------------------------

$$(".sizes button").forEach(button => {

    button.onclick = function() {

        const size =
            button.dataset.s;


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


        $$(".sizes button").forEach(b => {

            b.classList.remove(
                "selected"
            );

        });


        button.classList.add(
            "selected"
        );

    };

});


// ------------------------------
// TAB NAME
// ------------------------------

const tabName =
    $("#tabName");


if (tabName) {

    tabName.oninput = function() {

        document.title =
            tabName.value ||
            "APPLEBOTTOM UBG";

    };

}


// ------------------------------
// DATE + TIME
// ------------------------------

function clock() {

    const date =
        new Date();


    const text =
        date.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        )
        +
        " • "
        +
        date.toLocaleTimeString(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );


    const dateElement =
        $("#date");


    if (dateElement) {

        dateElement.textContent =
            text;

    }

}


clock();


setInterval(
    clock,
    30000
);


// ------------------------------
// START WEBSITE
// ------------------------------

loadGames();

loadGamesPage();

page("home");
