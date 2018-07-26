import { Injectable } from "@angular/core";
import { ipcRenderer, webFrame, remote } from "electron";
import * as childProcess from "child_process";
import * as fs from "fs";
@Injectable({
  providedIn: "root"
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  isElectron: any;

  constructor() {
    this.checkElectron();
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = (<any>window).require("electron").ipcRenderer;
      this.webFrame = (<any>window).require("electron").webFrame;
      this.remote = (<any>window).require("electron").remote;
      this.childProcess = (<any>window).require("electron").childProcess;
      this.fs = (<any>window).require("electron").fs;
    }
  }

  private checkElectron() {
    this.isElectron = window && (<any>window).process && (<any>window).process.type;
  }
}
