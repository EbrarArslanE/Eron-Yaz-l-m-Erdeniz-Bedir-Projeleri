import { Component, OnInit, Inject, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core'
import { DOCUMENT } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'
import { AuthenticationService } from '../../../core/services/auth.service'
import { LocalStoreService } from "../../../core/services/local-store.service"
import { webServisIslemCalistir, urlConfig } from '../../../ISLEM'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { FormGroup, FormControl } from '@angular/forms'
import Swal from 'sweetalert2/dist/sweetalert2'
import { LanguageService } from 'src/app/core/services/language.service'
// import { socketIslem } from 'src/app/SOCKET';
import { BreadcrumpService } from 'src/app/core/services/breadcrump.service'
import { EventService } from 'src/app/core/services/event.service'

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})

export class TopbarComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: any,
    private auth: AuthenticationService,
    public cookiesService: CookieService,
    private store: LocalStoreService,
    private islem : webServisIslemCalistir,
    private modalService: NgbModal,
    public modalConfig: NgbModalConfig,
    private toastr: ToastrService,
    private translate: LanguageService,
    // public socket : socketIslem,
    private bs: BreadcrumpService,
    private eventService: EventService
  ) {
    modalConfig.backdrop = 'static'
    modalConfig.keyboard = false
    modalConfig.size = 'sm'
  }

  @Output() mobileMenuButtonClicked = new EventEmitter()

  @ViewChild('modalSifreGuncelleme') modalSifreGuncelleme: ElementRef

  ngOnInit(): void {
    this.urlConfig = urlConfig
    this.ipAl()
    this.loginOlanKullaniciAdi = this.store.getItem("FLEET_ASSIST_personel_adi")
    this.kullaniciIpAdresi = this.store.getItem("MAVI_BILET_personel_ip_adresi")
    this.bs.getBreadcrumpValue().subscribe(item => this.breadcrump = item)
    this.bs.getBaslikValue().subscribe(item => this.anaBaslik = item)

    this.element = document.documentElement
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    }
  

    // this.socketIslem()
    // window.addEventListener("visibilitychange", (event) => {
    //   if (document.hidden == true){
    //     this.socket.socketAyril()
    //   } else {
    //     this.socketIslem()
    //   }
    // })
  }

  async ngOnDestroy(){
    // this.socket.socketAyril()
  }

  socketIslem(){
    // this.socket.socketBaglan()

    // this.socket.socket.on('bildirim-yeniTicket', (data) => {
    //   this.toastr.success("Yeni ticket var", "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
    //   let cevap: any = {oda: 'bildirim-yeniTicket',  data: data}
    //   this.socket.messageSource.next(cevap)
    // })

    // this.socket.socket.on('bildirim-ticketCevap', (data) => {
    //   this.toastr.success("Cevap var", "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
    //   let cevap: any = {oda: 'bildirim-ticketCevap',  data: data}
    //   this.socket.messageSource.next(cevap)
    // })

    // this.socket.socket.on('bildirim-ticketKapama', (data) => {
    //   this.toastr.success("Ticket Kapama", "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
    //   let cevap: any = {oda: 'bildirim-ticketKapama',  data: data}
    //   this.socket.messageSource.next(cevap)
    // })

    // this.socket.socket.on('chat-konusma-gecmisi', (data) => {
    //   let cevap: any = {oda: 'chat-konusma-gecmisi',  data: data}
    //   this.socket.messageSource.next(cevap)
    // })

    // this.socket.socket.on('gelen-mesaj', (data) => {
    //   let cevap: any = {oda: 'gelen-mesaj',  data: data}
    //   this.socket.messageSource.next(cevap)
    // })
  }

  admin_language = "tr"

  modalAc(content, size) {
    this.modalConfig.size = size
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
  }

  urlConfig
  element: any
  configData: any
  loginOlanKullaniciAdi = ""
  kullaniciIpAdresi = ''
  breadcrump
  anaBaslik
  logoutDegiskeni

  sifreGuncellemeFormu = new FormGroup({
    islem           : new FormControl(''),
    e_eski_sifre    : new FormControl(''),
    e_sifre         : new FormControl(''),
    e_sifre_tekrar  : new FormControl('')
  })
  sifreGuncellemeBtn
  firmaAdi
  logoUzantisi
  MID

  requestData
  responseData

  toggleMobileMenu(event: any) {
    event.preventDefault()
    this.mobileMenuButtonClicked.emit()
  }

  fullscreen() {
    document.body.classList.toggle('fullscreen-enable')
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen()
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen()
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen()
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen()
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen()
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen()
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen()
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen()
      }
    }
  }

  async ipAl(): Promise<void> {
    this.responseData = await this.islem.WebServisSorguSonucuEWSCustom("GET", "h/ip", {})
    this.kullaniciIpAdresi = this.responseData.IP
  }

  async logout() {
    Swal.fire({
      title: "Dikkat",
      text: "Sistemden Çıkış Yapılacak!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Çıkış Yap",
      confirmButtonColor: '#090f3c',
      cancelButtonText: "İptal",
      cancelButtonColor: '#222'
    }).then(async (result) => {
      if (result.isConfirmed) {
        this.logoutDegiskeni = await this.islem.WebServisSorguSonucuEWSCustom("POST", "ledsl/loginIslemleri/logout", {})
        if (Object.keys(this.logoutDegiskeni).length == 0) { this.logoutDegiskeni = null }
        if(this.logoutDegiskeni.S == "T") {
          this.auth.logout()
        } else if(this.logoutDegiskeni.HATA_ACIKLAMASI) {
          this.toastr.error(this.logoutDegiskeni.HATA_ACIKLAMASI, 'İşlem Başarısız', {
            timeOut: 5000,
            closeButton: false,
            progressBar: true
          })
        } else {
          this.toastr.error('Güvenli Çıkış Yapılamadı', 'İşlem Başarısız', {
            timeOut: 5000,
            closeButton: false,
            progressBar: true
          })
        }
      }
    })
  }

  sifreGuncellemeButton() {
    this.sifreGuncellemeFormu.patchValue({
      islem           : 'kullaniciIslemleri/kullaniciSifreDuzenle',
      e_eski_sifre    : '',
      e_sifre         : '',
      e_sifre_tekrar  : '',
    })
    this.modalAc(this.modalSifreGuncelleme, 'md')
  }

	sifreGuncellemeKaydet() {
    if (!this.sifreGuncellemeFormu.invalid) {
      var data = Object.assign({}, this.sifreGuncellemeFormu.value)

			if (data.e_sifre != data.e_sifre_tekrar) {
				this.toastr.error('', 'Lütfen girilen şifrelerin aynı olduğuna emin olun!', { timeOut: 3000, closeButton: true, progressBar: true })
			} else {
				Swal.fire({
					title: 'Şifreniz Güncellenecek!',
					text: "Şifrenizi güncellemek istediğinize emin misiniz ?",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Evet, Güncelle',
					confirmButtonColor: '#090f3c',
					cancelButtonText: 'İptal',
					cancelButtonColor: '#222'
				}).then((result) => {
					if (result.isConfirmed) {
						this.sifreGuncelleme()
					}
				})
			}
    }
  }

  async sifreGuncelleme(): Promise<void> {
    // if (this.sifreGuncellemeFormu.valid) {
    //   this.sifreGuncellemeBtn = true

    //   this.requestData = Object.assign({}, this.sifreGuncellemeFormu.value)
    //   this.responseData = await this.islem.WebServisSorguSonucu("kullaniciKayitlari", this.requestData.islem, this.requestData)

    //   if ((this.responseData[0].S) == "T") {
    //     this.toastr.success(this.responseData[0].MESAJ, 'İşlem Başarılı !', { timeOut: 3000, closeButton: true, progressBar: true })
    //     this.modalService.dismissAll()
    //   } else {
    //     this.toastr.error(this.responseData[0].HATA_ACIKLAMASI, 'İşlem Başarısız !', { timeOut: 3000, closeButton: true, progressBar: true })
    //   }

    //   this.sifreGuncellemeBtn = false
    // }
  }


  setAdminLanguage(secilenDil) {
    location.reload();
    this.translate.setLanguage(secilenDil)
  }

  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}