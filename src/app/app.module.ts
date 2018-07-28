import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./modules/app-routing.module";

import { ElectronService } from "./services/electron.service";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SecondWindowComponent } from "./components/second-window/second-window.component";

@NgModule({
  declarations: [AppComponent, HomeComponent, SecondWindowComponent],
  imports: [AppRoutingModule, HttpClientModule, BrowserModule, BrowserAnimationsModule],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule {}
