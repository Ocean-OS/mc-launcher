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
async function getVersions() {
    var response = await fetch('https://ocean-os.github.io/mc-assets/versions.js');
    var data = await response.text();
    fs.writeFileSync(__dirname + "/versions.js", data);
    window.versionList = eval(data.split(" = ")[1]);
    var versionNames = [];
    var versionUrls = [];
    var versionFolders = [];
    var versionFiles = [];
    for(var versionAdd = window.versionList.length-1; versionAdd > -1; versionAdd--){
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
}
if(navigator.onLine){
    getVersions();
}else{
    window.versionList = eval(fs.readFileSync(__dirname + "/versions.js", "utf8").split(" = ")[1]);
    var versionNames = [];
    var versionUrls = [];
    var versionFolders = [];
    var versionFiles = [];
    for(var versionAdd = window.versionList.length-1; versionAdd > -1; versionAdd--){
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
}
async function play(select){
    var selection = select;
    window.selection = selection;
    window.versionFolderSelect = window.versionFolders[window.versionNames.indexOf(selection.name)];
    if(navigator.onLine){
        var progressBar = document.createElement("progress");
        progressBar.id = "fileDownloadStatus";
        progressBar.max = "100";
        progressBar.value = "0";
        progressBar.style = "border-radius:0px;border:none;"
        document.body.appendChild(progressBar);
        if (!fs.existsSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)])){
            fs.mkdirSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)]);
        }
        async function getFiles(){
            window.filesDownloaded = 0;
        for(var fileDownload = 0; fileDownload < window.versionFiles[window.versionNames.indexOf(selection.name)].length; fileDownload++){
            var url = window.versionUrls[window.versionNames.indexOf(selection.name)];
            var filename = __dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/";
            var filePath = window.versionFiles[window.versionNames.indexOf(selection.name)][fileDownload]
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
            window.filesDownloaded++;
            document.getElementById("fileDownloadStatus").value = Math.round(100*(window.filesDownloaded/window.versionFiles[window.versionNames.indexOf(selection.name)].length));
        }
        if(interval !== ""){
            var interval = setInterval(check, 10);
        }
        var progressRemove = document.getElementById("fileDownloadStatus");
        progressRemove.remove();
        const { spawn } = require('child_process');
        const child = spawn(process.execPath, [__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/main.js"]);
        }
        getFiles();
    }else if((fs.existsSync(__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)]))){
        const { spawn } = require('child_process');
        const child = spawn(process.execPath, [__dirname + "/" + window.versionFolders[window.versionNames.indexOf(selection.name)] + "/main.js"]);
    }
}