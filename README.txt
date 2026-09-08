APPLEBOTTOM — fixed GitHub Pages build

UPLOAD THESE FILES TO YOUR REPOSITORY:
- index.html
- styles.css
- script.js
- games.json
- apple-logo.png

Keep your existing game HTML/PNG files in the repository.

IMPORTANT:
The site cannot automatically list every file in a GitHub Pages folder. The public game list is controlled by games.json.

games.json format:
{
  "games": [
    {
      "id": "my-game",
      "name": "My Game",
      "description": "A short description.",
      "image": "MyGame.png",
      "file": "MyGame.html",
      "icon": "🎮",
      "added": 1
    }
  ]
}

Paths are relative to the website root. For example, if the repository has:
MyGame.html
MyGame.png
then use:
"file": "MyGame.html"
"image": "MyGame.png"

The + Add a game editor creates a local browser-only entry. It does NOT change GitHub files, because a static GitHub Pages site cannot write back to the repository.

Only host game files you have permission to publish.
