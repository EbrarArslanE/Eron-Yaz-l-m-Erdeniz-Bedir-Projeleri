import { Injectable } from "@angular/core"
import { LocalStoreService } from "./local-store.service"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { delay } from "rxjs/operators"

@Injectable({
  providedIn: "root"
})

export class AuthenticationService {
  authenticated = false

  constructor (
    private store: LocalStoreService,
    private router: Router
  ) {
    this.checkAuth()
  }

  checkAuth() {
    if (this.store.getItem("FLEET_ASSIST_token") == "") {
      this.authenticated = false
    } else {
      this.authenticated = true
    }
  }

  getuser() {
    return of ({})
  }

  login(credentials) {
    this.authenticated = true
    this.store.setItem("FLEET_ASSIST_token", credentials.UTOKEN)
    this.store.setItem("FLEET_ASSIST_personel_adi", credentials.e_kullanici_adi_soyadi)
    this.store.setItem("FLEET_ASSIST_kullanici_id", credentials.PID)

    return of({}).pipe(delay(1500))
  }

  logout() {
    this.authenticated = false
    this.store.setItem("FLEET_ASSIST_token", "")
    this.store.setItem("FLEET_ASSIST_personel_adi", "")
    this.store.setItem("FLEET_ASSIST_kullanici_id", "")
    this.router.navigateByUrl("/giris")
  }
}