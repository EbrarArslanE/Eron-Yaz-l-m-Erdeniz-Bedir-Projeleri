import { Injectable } from "@angular/core"
import { LocalStoreService } from './core/services/local-store.service'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthenticationService } from "./core/services/auth.service"
import { ToastrService } from 'ngx-toastr'
import { UrlService } from "./core/services/url.services"

@Injectable({
	providedIn: "root"
})

export class webServisIslemCalistir {
	constructor(
		private hC: HttpClient,
		private store: LocalStoreService,
		private auth: AuthenticationService,
		private toastr: ToastrService,
		private urlService: UrlService
	) { }

	WebServisSorguSonucuEWSCustom(METHOD, ISLEM_URL, BODY): Promise < object > {
		return new Promise < object > (resolve => {

			if (location.origin == "http://localhost:9750") {
				var URL = "https://v2.fleetassist.com.tr/gapi/"
			} else {
				var URL = "https://v2.fleetassist.com.tr/api/"
			}

			var UTOKEN = ""

			try { UTOKEN = this.store.getItem("FLEET_ASSIST_token") } catch (e) { UTOKEN = "eron" }

			var httpOptions = {
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					"Accept": "*/*",
					"utoken": UTOKEN == "" ? "eron" : UTOKEN
				})
			}
			
			var replaceBODY = ""
			var resolveBODY
			replaceBODY = JSON.stringify(BODY).replace(/'/g, "__T__") // --> veritabanı karakter çakuışmasını gidermek için tırnak replace edildi
			BODY = JSON.parse(replaceBODY)

			if (METHOD == "GET") {
				this.hC.get((URL + ISLEM_URL + '?' + new URLSearchParams(BODY).toString()), httpOptions).subscribe(
					data => {
						setTimeout(async () => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999") ||
											(data['HATA_KODU'] == "991") ||
											(data['HATA_KODU'] == "993")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "POST") {
				this.hC.post((URL + ISLEM_URL), BODY, httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "PUT") {
				this.hC.put((URL + ISLEM_URL), BODY, httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "DELETE") {
				this.hC.delete((URL + ISLEM_URL + '?' + new URLSearchParams(BODY).toString()), httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			}
		})
	}

	WebServisSorguSonucuEWS(METHOD, ISLEM_URL, BODY): Promise < object > {
		return new Promise < object > (resolve => {

			if (location.origin == "http://localhost:9750") {
				var URL = "https://v2.fleetassist.com.tr/gapi/"
			} else {
				var URL = "https://v2.fleetassist.com.tr/api/"
			}
			
			var UTOKEN = ""

			try { UTOKEN = this.store.getItem("FLEET_ASSIST_token") } catch (e) { UTOKEN = "eron" }

			var httpOptions = {
				headers: new HttpHeaders({
					"Content-Type": "application/json",
					"Accept": "*/*",
					"utoken": UTOKEN == "" ? "eron" : UTOKEN
				})
			}
			
			var replaceBODY = ""
			var resolveBODY
			replaceBODY = JSON.stringify(BODY).replace(/'/g, "__T__") // --> veritabanı karakter çakuışmasını gidermek için tırnak replace edildi
			BODY = JSON.parse(replaceBODY)

			if (METHOD == "GET") {
				this.hC.get((URL + ISLEM_URL + '?' + new URLSearchParams(BODY).toString()), httpOptions).subscribe(
					data => {
						setTimeout(async () => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999") ||
											(data['HATA_KODU'] == "991") ||
											(data['HATA_KODU'] == "993")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "POST") {
				this.hC.post((URL + ISLEM_URL), BODY, httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "PUT") {
				this.hC.put((URL + ISLEM_URL), BODY, httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			} else if (METHOD == "DELETE") {
				this.hC.delete((URL + ISLEM_URL + '?' + new URLSearchParams(BODY).toString()), httpOptions).subscribe(
					data => {
						setTimeout(() => {
							// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
								if (data['S']) {
									if (
										(data['S'] == "H") &&
										(
											//(data[0].HATA_KODU == "800") || --> internet gittiğinde gelen hata, ara bir form ile ekranı karartabiliriz, yeniden dene tuşu koyabiliriz
											//(data[0].HATA_KODU == "803") ||
											(data['HATA_KODU'] == "999")
										)
									) { this.auth.logout() }
									// --> OTURUM SÜRESİ DOLDU İSE SAYFAYI LOGİN SAYFASINA ATIYORUZ
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "2006")) {
										this.toastr.error('Proje İşlem Hatası !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
									else if ((data['S'] == "H") && (data['HATA_KODU'] == "997")) {
										this.toastr.error('İstek Sayısı Aşıldı !!!', 'Hata !!!', {
											timeOut: 5000,
											closeButton: false,
											progressBar: true
										})
									}
								}
							replaceBODY = JSON.stringify(data).replace(/__T__/g, "'") // --> veritabanı karakter sorununu gidermek için __T__ replace edildi
							resolveBODY = JSON.parse(replaceBODY)
							resolve(resolveBODY)
						}, 1)
					}, error => {
						setTimeout(() => {
							if ((error.ok == false) && (error.status == 0)) {
								this.toastr.error('Sorgu Sonucu Gelmiyor, Lütfen internete bağlı olduğunuzdan emin olun', 'Bağlantı Hatası', {
									timeOut: 5000,
									closeButton: false,
									progressBar: true
								})
								resolve({ "BAGLANTI_HATASI": "0" })
								// this.auth.logout()
							} else { resolve(error) }
						}, 1)
					}
				)
			}
		})
	}


	WebServisBlobSorgu(ISLEM_URL: string, BODY: any): Promise<Blob> {
		return new Promise<Blob>((resolve, reject) => {

			if (location.origin == "http://localhost:9750") {
			var URL = "https://v2.fleetassist.com.tr/gapi/"
			} else {
			var URL = "https://v2.fleetassist.com.tr/api/"
			}

			var UTOKEN = ""
			try { UTOKEN = this.store.getItem("FLEET_ASSIST_token") } catch (e) { UTOKEN = "eron" }

			var httpOptions = {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				"Accept": "*/*",
				"utoken": UTOKEN == "" ? "eron" : UTOKEN
			}),
			responseType: 'blob' as 'json'
			}

			this.hC.post((URL + ISLEM_URL), BODY, httpOptions).subscribe(
			(data: any) => { resolve(data) },
			error => { reject(error) }
			)
		})
	}

	replace(input, from, to) {
		if(input === undefined) {return}
		var regex = new RegExp(from, 'g')
		return input.replace(regex, to)
	}
}



export let urlConfig = {
	SRC_URL : location.origin == "http://localhost:9750" ? 'https://v2.fleetassist.com.tr/uploads' : 'https://v2.fleetassist.com.tr/uploads/',
	PORT_URL : location.origin == "http://localhost:9750" ? 'https://test.eronsoftware.com:9750/' : 'https://basvuru.ilahiyatyildizlariodulleri.com:5890/',
	MAIN_URL : location.origin == "http://localhost:9750" ? 'https://test.eronsoftware.com:9750/' : 'https://basvuru.ilahiyatyildizlariodulleri.com/'
}