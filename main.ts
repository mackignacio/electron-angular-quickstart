import { app, ipcMain, ipcRenderer, BrowserWindow, screen } from "electron";
import * as path from "path";
import * as url from "url";

class ElectronMain {
  appTitle = "Electron Angular Quickstart";
  args: any;
  serve: boolean;
  mainWindow: BrowserWindow;

  constructor() {
    this.initApp();
    this.initAppEvents();
    this.initIpc();
  }
  
  initApp(){
    this.checkElectronArgs();
    this.disableSecurityWarnings();
  }
  
  initAppEvents() {
    app.on("ready", () => this.createMainWindow());
    app.on("window-all-closed", () => this.quitAppOnNonDarwin());
    app.on("activate", () => this.createDefaultWindow());
  }
  
  initIpc() {
    ipcMain.on("event", (e, data) => this.ipcEventHandler(e, data));
  }
  
  checkElectronArgs() {
    this.args = process.argv.slice(1);
    this.serve = this.args.some(val => val === "--serve");
    this.enableHotReload();
  }
  
  enableHotReload() {
    if (this.serve) {
      require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`)
      });
    }
  }

  createMainWindow() {
    this.mainWindow = this.createBrowserWindow();
    this.loadFromFile(this.mainWindow);
    this.openWindowDevTools(this.mainWindow);
    this.onWindowClosed(this.mainWindow);
  }

  createBrowserWindow(): BrowserWindow {
    return new BrowserWindow({
     title: this.appTitle,
      fullscreen: true,
      minimizable: false,
      maximizable: false,
      autoHideMenuBar: true,
      alwaysOnTop: true,
      closable: false
    });
  }

  loadFromFile(electronWindow: BrowserWindow) {
    electronWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "/dist/electron-angular/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }
  
  openWindowDevTools(electronWindow: BrowserWindow) {
    electronWindow.webContents.openDevTools();
  }
  
  onWindowClosed(electronWindow: BrowserWindow) {
    electronWindow.on("closed", () => app.quit());
  }
  
  
  createDefaultWindow() {
    if (null === this.mainWindow) {
      this.createMainWindow();
    }
  }
  
  quitAppOnNonDarwin() {
    if (process.platform !== "darwin") {
      app.quit();
    }
  }
  
  ipcEventHandler(e: any, data: any) {
    console.log("[EVENT]:", "recieved from main process");
  }
  
  disableSecurityWarnings() {
    process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
  }
  
}

export default new ElectronMain();

