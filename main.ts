import { app, ipcMain, ipcRenderer, BrowserWindow, screen } from "electron";
import * as path from "path";
import * as url from "url";
import { execFile } from "child_process";

class ElectronMain {
  appTitle = "Electron Angular Quickstart";
  args: any;
  mainWindow: BrowserWindow;
  secondWindow: BrowserWindow;

  constructor() {
    this.initApp();
    this.initAppEvents();
    this.initIpc();
    this.execFile("")
      .then(data => console.log(data))
      .catch(err => console.log("EXEC_FILE_ERROR:", err));
  }

  initApp() {
    this.enableHotReload(this.checkElectronArgs());
    this.disableSecurityWarnings();
  }

  initAppEvents() {
    app.on("ready", () => this.createWindows());
    app.on("window-all-closed", () => this.quitAppOnNonDarwin());
    app.on("activate", () => this.createDefaultWindows());
  }

  initIpc() {
    ipcMain.on("event", (e, data) => this.ipcEventHandler(e, data));
  }

  checkElectronArgs(): boolean {
    this.args = process.argv.slice(1);
    return this.args.some(val => val === "--serve");
  }

  enableHotReload(serve: boolean) {
    if (serve) {
      require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`),
      });
    }
  }

  createWindows() {
    this.createMainWindow();
    this.createSecondWindow(); // Creates second window.
  }

  createMainWindow() {
    this.mainWindow = this.createBrowserWindow();
    this.loadFromFile(this.mainWindow);
    this.enableDevTools(this.mainWindow);
    this.onWindowClosed(this.mainWindow);
  }

  createSecondWindow() {
    const secondDisplay = <any>screen.getAllDisplays()[1];
    if (this.checkSecondDisplay(secondDisplay)) {
      this.secondWindow = this.createBrowserWindow(secondDisplay.bounds.x, secondDisplay.bounds.y);
    }
    this.loadFromFile(this.secondWindow, "/second-window");
    this.enableDevTools(this.secondWindow);
    this.onWindowClosed(this.secondWindow);
  }

  checkSecondDisplay(secondDisplay: any): boolean {
    return secondDisplay && secondDisplay !== undefined && secondDisplay !== null;
  }

  createBrowserWindow(x = 0, y = 0): BrowserWindow {
    return new BrowserWindow({
      title: this.appTitle,
      fullscreen: true,
      minimizable: false,
      maximizable: false,
      autoHideMenuBar: true,
      closable: false,
      x: x,
      y: y,
    });
  }

  loadFromFile(window: BrowserWindow, routePath: string = "/") {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, "/dist/electron-angular/index.html"),
        protocol: "file:",
        slashes: true,
        hash: routePath,
      })
    );
  }

  enableDevTools(window: BrowserWindow) {
    window.webContents.openDevTools();
  }

  onWindowClosed(window: BrowserWindow) {
    window.on("closed", () => {
      this.mainWindow = null;
      this.secondWindow = null;
      app.quit();
      app.exit();
    });
  }

  createDefaultWindows() {
    if (null === this.mainWindow) {
      this.createMainWindow();
    }

    if (this.secondWindow === null) {
      this.createSecondWindow();
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

  execFile(pathUrl?: string) {
    if (pathUrl) {
      return new Promise((resolve, reject) => {
        execFile(pathUrl, (err, data) => {
          if (err) {
            reject(err);
          }

          if (data) {
            resolve(data);
          }
        });
      });
    }
    return Promise.reject("No path provided!");
  }
}

export default new ElectronMain();
