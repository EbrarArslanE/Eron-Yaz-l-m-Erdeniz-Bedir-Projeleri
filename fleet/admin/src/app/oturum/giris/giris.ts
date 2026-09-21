import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/auth.service';
import { webServisIslemCalistir, urlConfig } from '../../ISLEM';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { LocalStoreService } from "../../core/services/local-store.service";
import { LanguageService } from 'src/app/core/services/language.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-giris',
  templateUrl: './giris.html'
})
export class girisComponent implements OnInit {
  constructor(
    public authenticationService: AuthenticationService,
    private islem: webServisIslemCalistir,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public modalConfig: NgbModalConfig,
    private titleService: Title,
    private store: LocalStoreService,
    private http: HttpClient,
    private translate: LanguageService
  ) { }

  // @ViewChild('modalDogrulama') modalDogrulama: ElementRef;

  ngOnInit() {
    this.translate.setLanguage('tr')
    this.admin_language = 'tr'

    this.urlConfig = urlConfig
    this.titleService.setTitle("Fleet Assist | Parça Tedarik Yönetim Sistemi V2.1001.1")

    document.body.removeAttribute('data-layout')
    document.body.classList.add('auth-body-bg')

		if (this.store.getItem("FLEET_ASSIST_kullanici_adi")) {
			this.girisFormu.patchValue({
				e_mail_adresi   : this.store.getItem("FLEET_ASSIST_kullanici_adi"),
				e_beni_hatirla  : true,
			})
		}

    // this.projeServisBilgisiAl()

  }

  modalAc(content, size) {
    this.modalConfig.size = size;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

  modalHeader = { title: '' };
  admin_language;
  urlConfig;
  requestData;
  responseData;
  // dogrulamaTuru: 'sms' | 'email' | null = null;

  // dogrulamaFormu = new FormGroup({
  //   kod: new FormControl('', [Validators.required, Validators.minLength(6)])
  // });

  girisFormu = new FormGroup({
    e_mail_adresi   : new FormControl(''),
    e_sifre         : new FormControl(''),
    // e_dogrulama_turu  : new FormControl('sms'),
    e_beni_hatirla  : new FormControl(true),
  });

  girisYapBtn = false;
  dogrulamaBtn = false;
  
  async girisYap() {
    if (!this.girisFormu.invalid) {
      this.girisYapBtn = true;
      this.requestData = Object.assign({}, this.girisFormu.value);
      // this.dogrulamaTuru = this.requestData.e_dogrulama_turu;
      this.responseData = await this.islem.WebServisSorguSonucuEWSCustom("POST", "ledsl/loginIslemleri/login", this.requestData);

      if (this.responseData.BAGLANTI_HATASI) {
        this.girisYapBtn = false;
        this.toastr.error('Bağlantı hatası oluştu.', 'Hata!', { timeOut: 3000, closeButton: true, progressBar: true });
        return null;
      }
      if (this.responseData.S === "T") {
        // this.modalAc(this.modalDogrulama, 'md');
        this.authenticationService.login(this.responseData)
        this.store.setItem("FLEET_ASSIST_personel_adi", this.responseData.e_kullanici_adi_soyadi)
        this.store.setItem("FLEET_ASSIST_token", this.responseData.UTOKEN)
        if (this.requestData.e_beni_hatirla) {
          this.store.setItem("FLEET_ASSIST_kullanici_adi", this.requestData.e_mail_adresi);
        } else {
          this.store.setItem("FLEET_ASSIST_kullanici_adi", "");
        }
        window.location.href = './ews/sigortaStokKontrolu';
      } else {
        this.toastr.error(this.responseData.HATA_ACIKLAMASI, 'Giriş Başarısız!', { timeOut: 3000, closeButton: true, progressBar: true });
        this.authenticationService.logout();
        this.requestData.e_sifre = "";
        this.girisYapBtn = false;
      }
    } else {
      this.girisYapBtn = false;
    }
  }

  

  setAdminLanguage() {
    this.translate.setLanguage(this.admin_language);
  }

}