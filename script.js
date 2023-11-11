const path = require('path');
const {shell, ipcRenderer} = require('electron');
const fs = require('fs');
function check(){
    if(window.filesDownloaded == window.versionFiles[window.versionNames.indexOf(window.selection.name)].length){
        try{
            clearInterval(interval);
            interval = "";
        }catch(err){
            return;
        }
    }
}
async function getFile(url, filename) {
  const response = await fetch(url);
  const data = await response.text();
  fs.writeFileSync(filename, data);
}
async function checkUpdates(){
    try{
    var response = await fetch('https://ocean-os.github.io/mc-launcher/version.txt');
    var data = await response.text();
    var versionData = data;
    if(!fs.existsSync(path.join(__dirname, "version.txt")) || fs.readFileSync(path.join(__dirname, "version.txt"), "utf8") !== data){
        if(confirm("There is an update available: v" + data + "\n Would you like to install it?")){
        var res = await fetch("https://ocean-os.github.io/mc-launcher/dir.js");
        var updateFiles = await res.text();
        updateFiles = eval(updateFiles);
        var priorityFiles = [];
        var nonPriorityFiles = [];
        for(var priority = 0; priority < updateFiles.length; priority++){
            if(!fs.existsSync(path.join(__dirname, updateFiles[priority].replace("./", "")))){
                priorityFiles.push(updateFiles[priority].replace("./", ""));
            }else{
                nonPriorityFiles.push(updateFiles[priority].replace("./", ""));
            }
        }
        var priorityFormats = [];
        var minorPriorityFormats = [];
        for(var priorityFormat = 0; priorityFormat < priorityFiles.length; priorityFormat++){
            if((priorityFiles[priorityFormat].split(".")[priorityFiles[priorityFormat].split(".").length-1] == "js" || priorityFiles[priorityFormat].split(".")[priorityFiles[priorityFormat.split(".").length-1]] == "html")){
                priorityFormats.push(priorityFiles[priorityFormat]);
            }else{
                minorPriorityFormats.push(priorityFiles[priorityFormat]);
            }
        }
        var priorityFileList = priorityFormats.concat(minorPriorityFormats);
        var sortedFileList = priorityFileList.concat(nonPriorityFiles);
        var priorityListCorrect = true;
        if(updateFiles.length !== sortedFileList.length){
            updateFiles = updateFiles;
            priorityListCorrect = false;
        }else{
        for(var priorityCheck = 0; priorityCheck < updateFiles.length; priorityCheck++){
            if(!sortedFileList.includes(updateFiles[priorityCheck])){
                updateFiles = updateFiles;
                priorityListCorrect = false;
            }
        }
        }
        if(priorityListCorrect === true){
            updateFiles = sortedFileList;
        }
        var updateDownload = 0;
        while(updateDownload < updateFiles.length){
            var res = await fetch("https://ocean-os.github.io/mc-launcher/" + updateFiles[updateDownload].replace("./", ""));
            var fileSave = Buffer.from(await res.arrayBuffer());
            ipcRenderer.send('writeFile',{path: path.join(__dirname, updateFiles[updateDownload].replace("./", "")),data:fileSave});
            ipcRenderer.send('loadStatus', updateDownload/updateFiles.length);
            updateDownload++;
            if(updateDownload === updateFiles.length){
                fs.writeFileSync(path.join(__dirname, "version.txt"), versionData);
                ipcRenderer.send("loadStatus", 0-1);
                alert("To run the updated version, the launcher will refresh. ");
                ipcRenderer.send('updated');
            }
        };
        }
        }
    }catch(err){
        console.log("Failed to fetch updates, error message " + err);
    }
}
function loadVersions(){
    var versionNames = [];
    var versionUrls = [];
    var versionFolders = [];
    var versionFiles = [];
    var versionChangelogs = [];
    for(var versionAdd = window.versionList.length-1; versionAdd > -1; versionAdd--){
        versionChangelogs.push(window.versionList[versionAdd].changelog);
        versionNames.push(window.versionList[versionAdd].version);
        versionFolders.push(window.versionList[versionAdd].folder);
        versionFiles.push(window.versionList[versionAdd].files);
        versionUrls.push(window.versionList[versionAdd].url);
        var versionAddElement = document.createElement("option");
        versionAddElement.name = window.versionList[versionAdd].version; 
        versionAddElement.value = window.versionList[versionAdd].version;
        if(fs.existsSync(path.join(__dirname, window.versionList[versionAdd].folder))){
            var versionSaved = true;
        }else{
            var versionSaved = false;
        }
        if(!navigator.onLine && !versionSaved){
            versionAddElement.disabled = true;
        }
        versionAddElement.innerText = window.versionList[versionAdd].version;
        versionAddElement.id = window.versionList[versionAdd].url;
        document.getElementById("versionSelect").appendChild(versionAddElement);
    }
    window.versionUrls = versionUrls;
    window.versionFiles = versionFiles;
    window.versionFolders = versionFolders;
    window.versionNames = versionNames;
    window.versionChangelogs = versionChangelogs;
    document.getElementById("changelog").innerHTML = "<h3>Changelog for Mine.craft " +      window.versionNames[0] + "</h3><p>" + window.versionList[window.versionList.length-1].changelog + "</p>";
}
async function getVersions() {
    try{
    var response = await fetch('https://ocean-os.github.io/mc-assets/versions.js');
    var data = await response.text();
    fs.writeFileSync(path.join(__dirname,"versions.js"), data);
    window.versionList = eval(fs.readFileSync(path.join(__dirname, "/versions.js"), "utf8").split(" = ")[1]);
    }catch(err){
        console.log("Failed to fetch versions, error message " + err);
    }
    loadVersions();
}
window.addEventListener('DOMContentLoaded', () => {
    window.gameOpen = false;
    ipcRenderer.send('loadStatus', 0-1);
if(navigator.onLine){
    checkUpdates();
    getVersions();
}else{
    window.versionList = eval(fs.readFileSync(__dirname + "/versions.js", "utf8").split(" = ")[1]);
    loadVersions();
}
});
async function play(select){
    if(gettingGame !== true && !!document.getElementById("fileDownloadStatus") === false){
    var gettingGame = true;
    var selection = select;
    window.selection = selection;
    window.versionFolderSelect = window.versionFolders[window.versionNames.indexOf(selection.name)];
    if(navigator.onLine){
        window.hasEnoughSpace = true;
if(window.hasEnoughSpace == true){
        var progressBar = document.createElement("progress");
        progressBar.id = "fileDownloadStatus";
        progressBar.max = "100";
        progressBar.value = "0";
        progressBar.style = "border-radius:0px;border:none;"
        document.getElementsByClassName("loadingBar")[0].appendChild(progressBar);
        if (!fs.existsSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)])){
            fs.mkdirSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)]);
        }
    if (!fs.existsSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/mods")){
        fs.mkdirSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/mods");
        var justCreated = true;
    }
        fs.readdir(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/mods", (err, files) => {
            if (err) throw err;
            for (var file of files) {
                var fileModDelete = __dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/mods/" + file;
                fs.unlink(fileModDelete, (err) => { if (err) { console.error(err) } else { } })
            }
        });
        var modsToAdd = [];
        for(var modAdd = 0; modAdd < window.gameModList.length; modAdd++){
            if(window.gameModList[modAdd].version = window.versionNames[window.versionNames.indexOf(selection.name)] && window.gameModList[modAdd].activated === true){
                fs.writeFileSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/mods/" + window.gameModNames[modAdd], fs.readFileSync(window.gameModPaths[modAdd], "utf8"));
            }
        }
        async function getFiles(){
            var url = window.versionUrls[window.versionNames.indexOf(selection.name)];
            var filename = __dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/";
            window.filesDownloaded = 0;
        for(var fileDownload = 0; fileDownload < window.versionFiles[window.versionNames.indexOf(selection.name)].length; fileDownload++){
            if(window.hasEnoughSpace){
            var filePath = window.versionFiles[window.versionNames.indexOf(selection.name)][fileDownload]
            try{
                var res = await fetch(url + "/" + filePath);
                var data = await res.arrayBuffer();
                fs.writeFileSync(filename + filePath.replace(/%20/g, " "), Buffer.from(data));
            }catch(err){
                if (err.code === 'ENOSPC') {
                    alert("Sorry, you have no more space available on your device. This game requires around 120 MB to download and run.");
                    window.hasEnoughSpace = false;
                }else{
                    var res = await fetch(url + "/" + filePath);
                    var data = await res.arrayBuffer();
                    fs.writeFileSync(filename + filePath.replace(/%20/g, " "), Buffer.from(data));
                }
            }}
            window.filesDownloaded+=0.25;
            document.getElementById("fileDownloadStatus").value = 100*(window.filesDownloaded/window.versionFiles[window.versionNames.indexOf(selection.name)].length);
            ipcRenderer.send('loadStatus', document.getElementById("fileDownloadStatus").value/100);
            document.body.style.cursor = "progress";
        }
        if(interval !== ""){
            var interval = setInterval(check, 10);
        }
        if(100*(window.filesDownloaded/window.versionFiles[window.versionNames.indexOf(selection.name)].length) == 100){
            try{
                ipcRenderer.send('loadStatus', 0-1);
            }catch(err){}
        var progressRemove = document.getElementById("fileDownloadStatus");
        progressRemove.remove();
        if(window.hasEnoughSpace){
        const os = require('os');
        const path = require('path');
        const osType = os.type();
        let appFileType = undefined;
        switch (osType) {
        case 'Windows_NT':
            appFileType = '.exe';
            break;
        case 'Linux':
            appFileType = '';
            break;
        default:
            appFileType = undefined;
        }
        window.electronPath = path.join("electron", "electron-v25.0.1-" + process.platform + "-" + os.arch, "electron" + appFileType);
        if(appFileType == undefined){alert("Sorry, this version has not been made compatible for your Operating System. It is currently compatible for Debian variations of Linux, and Windows 10 and above.")}else{
            if(process.execPath.split('\\')[process.execPath.split('\\').length-1] == "electron.exe"){
                const { spawn } = require('child_process');
                const child = spawn(process.execPath, [path.join(__dirname, window.versionFolders[window.versionNames.indexOf(selection.name)], "main.js")]);
                child.stderr.setEncoding('utf8');
                window.gameOpen = true;
                child.stderr.on('data', (data) => {
                    window.gameOpen = false;
                    sendError(data, selection);
                });
                child.on('exit', (code) => {
                    window.gameOpen = false;
                    sendError(code, selection);
                });
            }else{
        const { spawn } = require('child_process');
        const child = spawn(path.join(__dirname, window.electronPath), [path.join(__dirname, window.versionFolders[window.versionNames.indexOf(selection.name)], "main.js")]);
        child.stderr.setEncoding('utf8');
        window.gameOpen = true;
        child.stderr.on('data', (data) => {
            window.gameOpen = false;
            sendError(data, selection);
        });
        child.on('exit', (code) => {
            window.gameOpen = false;
            sendError(code, selection);
        });
        }
        }}
        document.body.style.cursor = "default";
        }
        }
        getFiles();
        getFiles();
        getFiles();
        getFiles();
    }else{alert("Sorry, you do not have enough free storage space to download and run the game (120MB).");}}else if((fs.existsSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)]))){
        const os = require('os');
        const path = require('path');
        const osType = os.type();
        let appFileType = undefined;
        switch (osType) {
        case 'Windows_NT':
            appFileType = '.exe';
            break;
        case 'Linux':
            appFileType = '';
            break;
        default:
            appFileType = undefined;
        }
        window.electronPath = path.join("electron", "electron-v25.0.1-" + process.platform + "-" + os.arch, "electron" + appFileType);
        if(appFileType == undefined){alert("Sorry, this version has not been made compatible for your Operating System. It is currently compatible for Debian variations of Linux, and Windows 10 and above.")}else{
        const { spawn } = require('child_process');
        const child = spawn(path.join(__dirname, window.electronPath), [path.join(__dirname, window.versionFolders[window.versionNames.indexOf(selection.name)], "main.js")]);
        child.stderr.setEncoding('utf8');
        window.gameOpen = true;
        child.stderr.on('data', (data) => {
            window.gameOpen = false;
            sendError(data, selection);
        });
        child.on('exit', (code) => {
            window.gameOpen = false;
            sendError(code, selection);
        });
        }
        }
    gettingGame = false;
    }
}
async function sendError(code, selection){
    if(navigator.onLine && code.code !== 0 && code !== 0){
                console.log("Unknown error found, attempting to send error to server...");
                window.version = document.getElementsByClassName("launcherVersion")[0].innerHTML.split("&nbsp;")[0];
                var errorData = {
                    version: window.version,
                    errorCode: code,
                    gameFiles: fs.readdirSync(path.join(__dirname, window.versionFolders[window.versionNames.indexOf(selection.name)])),
                    launcherFiles: fs.readdirSync(__dirname)
                };
                var errorSend = await fetch("https://errors.mc-launcher.repl.co/?errorcode=" + code + "&version=" + encodeURI(window.version) + "&gamefiles=" + encodeURI(errorData.gameFiles) + "&launcherfiles=" + encodeURI(errorData.launcherFiles));
                var errorSendResponse = await errorSend.text();
                if(errorSendResponse == 'Error data successfully saved'){
                    console.log('Error data successfully logged');
                }else{
                    console.err('Error data log attempt was unsuccessful.');
                }
            }
}
//mods.js
var gameMods = [];
if (!fs.existsSync(__dirname + '\\mods')){
    fs.mkdirSync(__dirname + '\\mods');
    var justCreated = true;
}
function openMods(){
    shell.openPath(path.join(__dirname, "mods"));
}
function getModFiles() {
    var justCreated;
    if (!fs.existsSync(__dirname + '\\mods')){
        fs.mkdirSync(__dirname + '\\mods');
        var justCreated = true;
    }
    if(justCreated !== true){
        var modFileDir = fs.readdirSync(__dirname + '\\mods');
        window.gameModFiles = [];
        window.gameModNames = [];
        window.gameModPaths = [];
        window.gameModTitles = [];
        for(var modFileGet = 0; modFileGet < modFileDir.length; modFileGet++){
            if(path.extname(__dirname + '\\mods\\' + modFileDir[modFileGet]) == ".js"){
                if(!window.gameModFiles.includes(fs.readFileSync(__dirname + '\\mods\\' + modFileDir[modFileGet], "utf8"))){
                    window.gameModPaths.push(__dirname + '\\mods\\' + modFileDir[modFileGet]);
                    window.gameModNames.push(modFileDir[modFileGet]);
                    window.gameModFiles.push(fs.readFileSync(__dirname + '\\mods\\' + modFileDir[modFileGet], "utf8"));
                    eval(fs.readFileSync(__dirname + '\\mods\\' + modFileDir[modFileGet], "utf8"));
                    if(!window.gameMods[window.gameMods.length-1].title){
                        window.gameMods[window.gameMods.length-1].title = window.gameMods.name;
                    }

                    window.gameModTitles.push(window.gameMods[modFileGet].title);
                }
            }
        }
    }
    window.gameMods = gameMods;
}
function displayMods(){
    if(window.gameMods.length > 0){
        document.getElementsByClassName("modsList")[0].hidden = false;
        window.gameModList = [];
        for(var gameModListAdd = 0; gameModListAdd < window.gameMods.length; gameModListAdd++){
            window.gameModList.push({
                name: window.gameMods[gameModListAdd].title,
                version: window.gameMods[gameModListAdd].version,
                activated: true,
                id: gameModListAdd,
            });
            var container = document.createElement("label");
            container.id = "mod" + gameModListAdd.toString();
            document.getElementsByClassName("modsList")[0].appendChild(container);
            var modListAdd = document.createElement("dt");
            var modListVer = document.createElement("dd");
            var modListCheck = document.createElement("input");
            modListCheck.type = "checkbox";
            modListCheck.id = gameModListAdd.toString();
            modListCheck.checked = true;
            modListAdd.innerText = window.gameMods[gameModListAdd].title;
            if(modListAdd.innerText == "undefined"){
                modListAdd.innerText = window.gameMods[gameModListAdd].name;
            }
            modListVer.innerText = window.gameMods[gameModListAdd].version;
            /*document.getElementsByClassName("modsList")[0].appendChild(modListAdd);
            document.getElementsByClassName("modsList")[0].appendChild(modListVer);
            document.getElementsByClassName("modsList")[0].appendChild(modListCheck);*/
            container.appendChild(modListAdd);
            container.appendChild(modListVer);
            container.appendChild(modListCheck);
            document.getElementById(gameModListAdd.toString()).onclick = function(){
                var id = this.id;
                var checked = this.checked;
                window.gameModList[id*1].activated = checked;
            }
            document.getElementsByClassName("modsList")[0].innerHTML = document.getElementsByClassName("modsList")[0].innerHTML + "<br><br>";
        };
        for(var gameModListAdd = 0; gameModListAdd < window.gameModList.length; gameModListAdd++){
            document.getElementById(gameModListAdd.toString()).checked = true;
            document.getElementById(gameModListAdd.toString()).onclick = function(){
                var id = this.id;
                var checked = this.checked;
                window.gameModList[id*1].activated = checked;
            }
        }
    }else{
        document.getElementsByClassName("modsList")[0].hidden = true;
    }
}
window.onload = function(){
    var gameMods = [];
    window.gameModList = [];
    document.getElementsByClassName("modsList")[0].innerHTML = "<h2>Mods</h2>"
    window.gameMods = [];
    window.gameModFiles = [];
    getModFiles();
    displayMods();
};
fs.watch(__dirname + "\\mods",{recursive: true}, (eventType, filename) => {
    var gameMods = [];
    window.gameModList = [];
    document.getElementsByClassName("modsList")[0].innerHTML = "<h2>Mods</h2>"
    window.gameMods = [];
    window.gameModFiles = [];
    getModFiles();
    displayMods();
});
