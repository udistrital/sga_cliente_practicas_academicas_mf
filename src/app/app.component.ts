import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { fromEvent } from "rxjs";
import { getCookie } from "src/app/utils/cookie";

@Component({
  selector: "sga-practicas-academicas-mf",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "sga-cliente-practicas-academicas-mf";
  whatLang$ = fromEvent(window, "lang");

  ngOnInit(): void {
    this.validateLang();
  }

  constructor(private translate: TranslateService) {}

  validateLang() {
    let lang = getCookie("lang") || "es";
    this.whatLang$.subscribe((x: any) => {
      lang = x["detail"]["answer"];
      this.translate.setDefaultLang(lang);
    });
    this.translate.setDefaultLang(getCookie("lang") || "es");
  }
}
