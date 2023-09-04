var gameMods = [];
const path = require('path');
const {shell} = require('electron');
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
                    
                    window.gameModTitles.push(gameMods[modFileGet].title);
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
            modListVer.innerText = window.gameMods[gameModListAdd].version;
            /*document.getElementsByClassName("modsList")[0].appendChild(modListAdd);
            document.getElementsByClassName("modsList")[0].appendChild(modListVer);
            document.getElementsByClassName("modsList")[0].appendChild(modListCheck);*/
            container.appendChild(modListAdd);
            container.appendChild(modListVer);
            container.appendChild(modListCheck);
            document.getElementById(gameModListAdd.toString()).onclick = function(){
                console.log("HI");
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
