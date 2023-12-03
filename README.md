# Mine.craft Launcher
This is a repository for the source code of the Mine.craft Launcher, an application that is currently in alpha stage. The Mine.craft Launcher can download and run different Mine.craft versions using the vanilla javascript fetch function and FS. 
## This repository is under the Creative Commons License CC-BY-NC-SA. For more information, read LICENSE.txt. 
### Not an official Minecraft service. Not affiliated with Mojang or Microsoft.
## Directory
- **main.js** - This is the runner of the application. This is what opens the window and starts the app.
- **index.html** - This is the "container" of the application. This is the window that opens in the app.
- **script.js** - This is the code that runs the app. It downloads the files for the selected game and then runs them. This is also what controls mods. It checks the mods folder in the application for changes, and when a game is selected, it adds the selected mods to the game (if the version matches). This file may be updated whenever the mod system for the game changes, so it can work with any version. This may dramatically change soon when the mod file format changes to JSON. 
- **styles.css** - This is the appearance of the app.
- **icon.ico** - This is the icon for the app. It is formatted for Windows, so you may need to convert the file format if you do not have a compatible device.
- **icon.png** - This is also the icon for the app. It is formatted for other OS, such as Linux. 
- **package.json** - This holds information about the app.
- **config.jinst** - This is currently data for a feature that is in an early alpha stage. This feature will probably be released in early 2024. 
  
  **WARNING: As this is still in an extremely early alpha stage, many features are nonexistent or unstable. I do not recommend using the launcher at this time.**
  **This is not currently compatible with Mac OS. Compatibility with Linux isn't fully tested.**
## How to run
If you want, you can just go to the latest release and download and extract the compatible zip file. If you either don't have a compatible device, or you just want to package it yourself, here's how: 
- Download all files listed in the Directory section of this doc.
- Download the distributions of [Electron 25.0.1](https://github.com/electron/electron/releases/tag/v25.0.1) for your operating system, extract them, and put the folders in a folder called "electron", in the Directory files area.
- If your Internet connection isn't consistent, download [this JS file](https://ocean-os.github.io/mc-assets/versions.js).
- You may need to convert the icon to another file format. 
- Install electron-packager using your package manager (npm or yarn)
- Run the command `npx electron-packager [insert folder name for directory files] --platform=[insert win32 for windows, darwin for mac, or linux for linux] --icon=[insert folder name for directory files]/[insert icon file name]`.
- This should make a zip file or folder that contains the app. 
## Legacy/Support
As software versions get older, many companies or developers tend to remove compatibility for them, whether that means changing a site, removing online files, or changing server code. For as long as possible, any version of the Mine.craft Launcher will work. I will keep any old files, and make sure there is some sort of backwards-compatibility between launcher versions if needed. 
