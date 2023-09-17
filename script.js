const fs = require('fs');
const {ipcRenderer} = require('electron');
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
    var response = await fetch('https://ocean-os.github.io/mc-launcher/version.txt');
    var data = await response.text();
    if(!fs.existsSync(path.join(__dirname, "version.txt")) || fs.readFileSync(path.join(__dirname, "version.txt"), "utf8") !== data){
        if(confirm("There is an update available: v" + data + "\n Would you like to install it?")){
        fs.writeFileSync(path.join(__dirname, "version.txt"), data);
        var res = await fetch("https://ocean-os.github.io/mc-launcher/dir.js");
        var updateFiles = await res.text();
        updateFiles = eval(updateFiles);
        var updateDownload = 0;
        while(updateDownload < updateFiles.length){
            var res = await fetch("https://ocean-os.github.io/mc-launcher/" + updateFiles[updateDownload].replace("./", ""));
            var fileSave = await res.text();
            fs.writeFileSync(path.join(__dirname, updateFiles[updateDownload].replace("./", "")), fileSave);
            ipcRenderer.send('loadStatus', updateDownload/updateFiles.length);
            updateDownload++;
            if(updateDownload == updateFiles.length){
                ipcRenderer.send("loadStatus", 0-1);
                alert("To run the updated version, the launcher will refresh. ");
                window.location.reload();
            }
        }
        
        }
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
    var response = await fetch('https://ocean-os.github.io/mc-assets/versions.js');
    var data = await response.text();
    fs.writeFileSync(path.join(__dirname,"versions.js"), data);
    window.versionList = eval(fs.readFileSync(path.join(__dirname, "/versions.js"), "utf8").split(" = ")[1]);
    loadVersions();
}
if(navigator.onLine){
    checkUpdates();
    getVersions();
}else{
    window.versionList = eval(fs.readFileSync(__dirname + "/versions.js", "utf8").split(" = ")[1]);
    loadVersions();
}
async function play(select){
    if(gettingGame !== true && !!document.getElementById("fileDownloadStatus") === false){
    var gettingGame = true;
    var selection = select;
    window.selection = selection;
    window.versionFolderSelect = window.versionFolders[window.versionNames.indexOf(selection.name)];
    if(navigator.onLine){
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
                fs.unlink(fileModDelete, (err) => { if (err) { console.error(err) } else { console.log('File deleted') } })
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
            var filePath = window.versionFiles[window.versionNames.indexOf(selection.name)][fileDownload]
            try{
            var response = await fetch(url + "/" + filePath);
            if(filePath.split(".")[1] == "mp3"){
                var reader = new FileReader();
                reader.onload = function() {
                    var dataSave = this.result;
                    var data = new Uint8Array(dataSave);
                    fs.writeFileSync(filename + filePath.replace(/%20/g, " "), data);
                };
                var arrayBuffer = await response.arrayBuffer();
                var blob = new Blob([arrayBuffer], {type: 'audio/mpeg'});
                reader.readAsArrayBuffer(blob);
            }else{
                var data = await response.text();
                fs.writeFileSync(filename + filePath.replace(/%20/g, " "), data);
            }
            }catch(err){
                var response = await fetch(url + "/" + filePath);
                if(filePath.split(".")[1] == "mp3"){
                    var reader = new FileReader();
                    reader.onload = function() {
                        var dataSave = this.result;
                        var data = new Uint8Array(dataSave);
                        fs.writeFileSync(filename + filePath.replace(/%20/g, " "), data);
                    };
                    var arrayBuffer = await response.arrayBuffer();
                    var blob = new Blob([arrayBuffer], {type: 'audio/mpeg'});
                    reader.readAsArrayBuffer(blob);
                }else if(filePath.split(".")[1] == "ico"){
                    var reader = new FileReader();
                    reader.onload = function() {
                        var dataSave = this.result;
                        var data = new Uint8Array(dataSave);
                        fs.writeFileSync(filename + filePath.replace(/%20/g, " "), data);
                    };
                    var arrayBuffer = await response.arrayBuffer();
                    var blob = new Blob([arrayBuffer], {type: 'image/x-icon'});
                    reader.readAsArrayBuffer(blob);
                }else{
                    var data = await response.text();
                    fs.writeFileSync(filename + filePath.replace(/%20/g, " "), data);
                }
            }
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
            }else{
        const { spawn } = require('child_process');
        const child = spawn(path.join(__dirname, window.electronPath), [path.join(__dirname, window.versionFolders[window.versionNames.indexOf(selection.name)], "main.js")]);
        }
        }
        document.body.style.cursor = "default";
        }
        }
        getFiles();
        getFiles();
        getFiles();
        getFiles();
    }else if((fs.existsSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)]))){
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
        }
        }
    gettingGame = false;
    }
}