import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../components/home/home.component";
import { SecondWindowComponent } from "../components/second-window/second-window.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "second-window",
    component: SecondWindowComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
