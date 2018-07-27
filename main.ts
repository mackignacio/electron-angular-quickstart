import { app, ipcMain, ipcRenderer, BrowserWindow, screen } from "electron";
import * as path from "path";
import * as url from "url";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

class ElectronMain {
  appTitle = "Electron Angular Quickstart";
  args: any;
  serve: boolean;
  mainWindow: BrowserWindow;

  constructor() {
    this.checkElectronArgs();
    this.initApp();
    this.initIpc();
  }

  checkElectronArgs() {
    this.args = process.argv.slice(1);
    this.serve = this.args.some(val => val === "--serve");
    if (this.serve) {
      require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`)
      });
    }
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      title: this.appTitle,
      fullscreen: true,
      minimizable: false,
      maximizable: false,
      autoHideMenuBar: true,
      alwaysOnTop: true,
      closable: false
    });
    this.mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "/dist/electron-angular/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
    this.mainWindow.webContents.openDevTools();
    this.mainWindow.on("closed", () => {
      app.quit();
    });
  }

  initApp() {
    app.on("ready", this.createMainWindow);

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      if (this.mainWindow === null) {
        this.createMainWindow();
      }
    });
  }
  initIpc() {}
}

export default new ElectronMain();
