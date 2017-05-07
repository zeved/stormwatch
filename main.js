const {app, BrowserWindow, Menu, Tray} = require("electron")
const path = require("path")
const url = require("url")

let tray = null
let mainWindow

function spawnWindow() {
    mainWindow = new BrowserWindow({width: 1080, height: 720});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.setMenu(null);

    // mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", () => {
    spawnWindow();
    tray = new Tray("assets/img/app-icon.png");
    tray.setToolTip("Stormwatch");
});
