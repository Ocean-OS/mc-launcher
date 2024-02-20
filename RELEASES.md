## Mine.craft Launcher Releases
The following document details the process of building releases for the Mine.craft Launcher. 
## Manual Steps
1. Download the files, or use `git clone` to get the source files
2. Download Electron 25.0.1 for the operating system you plan to build the release for
3. Run electron-packager to build the binary
4. Extract and copy the Electron 25.0.1 folder to a folder called electron in /resources/app
## Automation
There are currently projects to automate the building of the launcher, using either GitHub Actions or build scripts. These may be active as early as March of 2024. 
## Testing
Each binary that is compatible is tested a **minimum** of four times, testing all features, and finding any bugs or ways to break the app. This testing sequence includes, but is not limited to: 
1. Running all available Mine.craft versions
2. Testing offline capabilities
3. Running internet tests, such as going offline halfway through an update, having slow internet, etc
4. Running the app through a variety of performance specs, such as low RAM or low processing
5. Running the app with as little files as possible, to test its versatility and error handling
6. Inserting "broken" files such as a corrupted script, game-breaking mod, or broken game engine
### These guidelines were not 100% followed for every update before and including 0.2.6 Alpha, but will now be followed completely.
After testing, any generated configuration or log files will be removed, so the releases work as if they were never run before. 