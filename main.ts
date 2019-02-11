import { app, ipcMain, ipcRenderer, BrowserWindow, screen } from "electron";
import * as path from "path";
import * as url from "url";
import { execFile } from "child_process";

class ElectronWindow {
  public window;
  title = "Electron Angular";
  path = "/dist/electron-angular/index.html";
  constructor(private model: IWindowModel) {
    if (this.checkSecondDisplay(model.display)) {
      this.window = this.createBrowserWindow(model.display.bounds.x, model.display.bounds.y);
      this.loadFromFile(model.URL);
    }

    if (model.isDev) {
      this.window.webContents.openDevTools();
    } else {
      const consoler = process.env.ELECTRON_CONSOLE;
      if (typeof consoler !== "undefined") {
        if (JSON.parse(consoler)) {
          this.window.webContents.openDevTools();
        }
      }
    }

    this.window.on("closed", model.onClosed);
  }

  private checkSecondDisplay(secondDisplay: any): boolean {
    return secondDisplay && secondDisplay !== undefined && secondDisplay !== null;
  }

  private createBrowserWindow(x: number = 0, y: number = 0): BrowserWindow {
    return new BrowserWindow({
      title: this.title,
      fullscreen: true,
      minimizable: false,
      maximizable: false,
      autoHideMenuBar: true,
      alwaysOnTop: !this.model.isDev,
      closable: false,
      show: true,
      x: x,
      y: y,
    });
  }

  private loadFromFile(routePath: string) {
    this.window.loadURL(
      url.format({
        pathname: path.join(__dirname, this.path),
        protocol: "file:",
        slashes: true,
        hash: routePath,
      })
    );
  }
}

class ElectronMain {
  appTitle = "Electron Angular Quickstart";
  args: any;
  mainWindow: BrowserWindow;
  secondWindow: BrowserWindow;
  dev: any;

  constructor() {
    this.dev = process.env.ELECTRON === "development";
    this.initIpc();
    this.initApp();
    this.initAppEvents();
    /*  this.execFile("")
      .then(data => console.log(data))
      .catch(err => console.log("EXEC_FILE_ERROR:", err)); */
  }

  initApp() {
    this.checkElectronArgs();
    this.disableSecurityWarnings();
  }

  initAppEvents() {
    app.on("ready", () => this.createWindows());
    app.on("window-all-closed", () => this.quitAppOnNonDarwin());
    app.on("activate", () => this.createDefaultWindows());
  }

  initIpc() {
    this.setIpcMainMonitor();
  }

  setIpcMainMonitor() {
    ipcMain.on("get-version", (e: any) => e.sender.send("version", process.env.npm_package_version));
  }

  checkElectronArgs() {
    console.log(process.argv);

    this.args = process.argv.slice(1);
    this.enableHotReload(this.args.some(val => val === "--serve"));
  }

  enableHotReload(serve: boolean) {
    if (serve) {
      require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`),
      });
    }
  }

  createWindows() {
    const displays = <any>screen.getAllDisplays();
    if (displays[1] !== undefined) {
      this.secondMonitor(displays[0]);
      this.mainMonitor(displays[1]);
    } else {
      this.mainMonitor(displays[0]);
    }
  }

  mainMonitor(display: any) {
    this.mainWindow = new ElectronWindow(this.getDisplayModel(display)).window;
  }

  secondMonitor(display: any) {
    this.secondWindow = new ElectronWindow(this.getDisplayModel(display, "/second-window")).window;
  }

  getDisplayModel(display: number, URL: string = "/") {
    return {
      display,
      isDev: this.dev,
      onClosed: this.onWindowClosed,
      URL,
    };
  }

  onWindowClosed(window: BrowserWindow) {
    this.mainWindow = null;
    this.secondWindow = null;
    app.quit();
    app.exit();
  }

  createDefaultWindows() {
    const displays = <any>screen.getAllDisplays();
    if (this.mainWindow === null) {
      if (displays[1] !== undefined) {
        this.mainMonitor(displays[1]);
        if (this.secondWindow === null) {
          this.secondMonitor(displays[0]);
        }
      } else {
        this.mainMonitor(displays[0]);
      }
    }
  }

  quitAppOnNonDarwin() {
    if (process.platform !== "darwin") {
      app.quit();
    }
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

interface IWindowModel {
  display: any;
  isDev: boolean;
  URL: string;
  onClosed: Function;
}

export default new ElectronMain();
