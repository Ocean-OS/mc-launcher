# Mine.craft Launcher
This is a repository for the source code of the Mine.craft Launcher, an application that is currently in alpha stage. The Mine.craft Launcher can download and run different Mine.craft versions using the vanilla javascript fetch function and FS. 
## This repository is under the Creative Commons License CC-BY-NC-SA. For more information, read LICENSE.txt. 
## Directory
- **main.js** - This is the runner of the application. This is what opens the window and starts the app.
- **index.html** - This is the "container" of the application. This is the window that opens in the app.
- **script.js** - This is the code that runs the app. It downloads the files for the selected game and then runs them. 
- **styles.css** - This is the appearance of the app.
- **mods.js** - This is what controls mods. It checks the mods folder in the application for changes, and when a game is selected, it tells script.js to add the selected mods to the game (if the version matches).
  
  **WARNING: As this is still in an extremely early alpha stage, many features are nonexistent or unstable. We do not recommend using the launcher at this time.** 
