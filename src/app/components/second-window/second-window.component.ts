import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-second-window",
  templateUrl: "./second-window.component.html",
  styleUrls: ["./second-window.component.scss"]
})
export class SecondWindowComponent implements OnInit {
  title = "Second Window";
  constructor() {}

  ngOnInit() {}
}
