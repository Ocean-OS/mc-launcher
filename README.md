# Mine.craft Launcher
This is a repository for the source code of the Mine.craft Launcher, an application that is currently in alpha stage. The Mine.craft Launcher can download and run different Mine.craft versions using the vanilla javascript fetch function and FS. 
## This repository is under the Creative Commons License CC-BY-NC-SA. For more information, read LICENSE.txt. 
## Directory
- **main.js** - This is the runner of the application. This is what opens the window and starts the app.
- **index.html** - This is the "container" of the application. This is the window that opens in the app.
- **script.js** - This is the code that runs the app. It downloads the files for the selected game and then runs them. 
- **styles.css** - This is the appearance of the app.
- **mods.js** - This is what controls mods. It checks the mods folder in the application for changes, and when a game is selected, it tells script.js to add the selected mods to the game (if the version matches).
- **icon.ico** - This is the icon for the app. It is formatted for Windows, so you may need to convert the file format if you do not have a compatible device.
- **package.json** - This holds information about the app. 
  
  **WARNING: As this is still in an extremely early alpha stage, many features are nonexistent or unstable. We do not recommend using the launcher at this time.**
  **This is not currently compatible with Mac OS. Compatibility with Linux isn't fully tested.**
## How to run
If you want, you can just go to the latest release and download and extract the compatible zip file. If you either don't have a compatible device, or you just want to package it yourself, here's how: 
- Download all files listed in the Directory section of this doc.
- If you don't have a Windows computer, you will need to convert the ICO file to another format.
- Install electron-packager using your package manager (npm or yarn)
- Run the command `npx electron-packager [insert folder name for directory files] --platform=[insert win32 for windows, darwin for mac, or linux for linux] --icon=[insert folder name for directory files]/[insert icon file name]`.
- This should make a zip file that contains the app. 
