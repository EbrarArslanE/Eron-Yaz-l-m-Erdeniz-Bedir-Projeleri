import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { webServisIslemCalistir } from '../../../ISLEM'
import { ToastrService } from 'ngx-toastr'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormControl } from '@angular/forms'
import Swal from 'sweetalert2/dist/sweetalert2'
import { Title } from '@angular/platform-browser'
import { BreadcrumpService } from 'src/app/core/services/breadcrump.service'
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-kullaniciTanimlari',
  templateUrl: './kullaniciTanimlari.html',
  styleUrls: ['./kullaniciTanimlari.css'],
    animations: [

    // Kart fade in/out
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('200ms ease-in',
          style({ opacity: 0, transform: 'translateY(5px)' })
        )
      ])
    ]),

    // Satırların sırayla gelmesi
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(8px)' }),
          stagger(60, [
            animate('250ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ])
    ])

  ]
})

export class kullaniciTanimlariComponent implements OnInit {
  constructor(
    public islem : webServisIslemCalistir,
    private modalService: NgbModal,
    public modalConfig: NgbModalConfig,
    private toastr: ToastrService,
    private titleService: Title,
    private bs: BreadcrumpService
  ) {
    modalConfig.backdrop = 'static'
    modalConfig.keyboard = false
    modalConfig.size = 'sm'
  }

  @ViewChild('modalKullaniciTanimlari') modalKullaniciTanimlari: ElementRef

  async ngOnInit() {
    this.titleService.setTitle("Fleet Assist | Kullanıcı Tanımları")
    this.bs.change(['Ayarlar & Tanımlar', 'Kullanıcı Tanımları'])
    this.kullaniciListele()

    this.kullaniciTanimlariFormu.controls['e_sifre'].valueChanges.subscribe((val) => {
      this.parolaKontrolEt(val)
    })
  }

  modalAc(content, size) {
    this.modalConfig.size = size
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
  }
  modalHeader = { title: '' }

  kullaniciTanimlariFormu = new FormGroup({
    islem                       : new FormControl(''),
    method                      : new FormControl(''),
    e_kullanici_adi_soyadi      : new FormControl(''),
    e_mail_adresi               : new FormControl(''),
    e_sifre                     : new FormControl(''),
    e_durum                     : new FormControl(''),
    e_eski_sistem_kullanici_id  : new FormControl(''),
    ESKI_ID                     : new FormControl('')
  })

  kullaniciFilterData = {
    ARAMA   : ''
  }

  yetkiSablonlariFilterData = {
    ARAMA : '',
    SS    : 1,
    KS    : 999
  }

  requestData
  responseData
  kullaniciLoader = false

  kullaniciTanimlari
  kullaniciIslemiKaydetBtn = false
  kullaniciSilinenKayitBtn = [false]

  async kullaniciListele(): Promise<void> {
    this.kullaniciLoader = true
    this.responseData = await this.islem.WebServisSorguSonucuEWS("GET", "leds/kullaniciIslemleri/listele", this.kullaniciFilterData)
    if (this.responseData.DATA.length == 0) { this.kullaniciTanimlari = null } else {this.kullaniciTanimlari = this.responseData.DATA}
    this.kullaniciLoader = false
  }

  async kullaniciEkleButton() {
    this.kullaniciTanimlariFormu.patchValue({
      islem                       : 'leds/kullaniciIslemleri/ekle',
      method                      : 'POST',
      e_kullanici_adi_soyadi      : '',
      e_mail_adresi               : '',
      e_sifre                     : '',
      e_eski_sistem_kullanici_id  : '',
      e_durum                     : 'Aktif'
    })
    this.modalHeader.title = "Kullanıcı Ekleme Formu"
    this.modalAc(this.modalKullaniciTanimlari, 'md')
  }

  async kullaniciDuzenleButton(secilenKayit) {
    this.kullaniciTanimlariFormu.patchValue({
      islem                       : 'leds/kullaniciIslemleri/duzenle',
      method                      : 'PUT',
      e_kullanici_adi_soyadi      : secilenKayit.e_kullanici_adi_soyadi,
      e_mail_adresi               : secilenKayit.e_mail_adresi,
      e_sifre                     : secilenKayit.e_sifre,
      e_durum                     : secilenKayit.e_durum,
      e_eski_sistem_kullanici_id  : secilenKayit.e_eski_sistem_kullanici_id, 
      ESKI_ID                     : secilenKayit.e_id
    })
    this.modalHeader.title = "Kullanıcı Düzenleme Formu"
    this.modalAc(this.modalKullaniciTanimlari, 'md')
  }

  async kullaniciIslemiKaydet(): Promise<void> {
    if (this.kullaniciTanimlariFormu.valid && this.parolaBarKontrol == "success") {
      this.kullaniciIslemiKaydetBtn = true

      this.requestData = Object.assign({}, this.kullaniciTanimlariFormu.value)
      this.responseData = await this.islem.WebServisSorguSonucuEWS(this.requestData.method, this.requestData.islem, this.requestData)

      if (this.responseData.S == "T") {
        this.toastr.success(this.responseData.MESAJ, "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
        this.kullaniciListele()
        this.modalService.dismissAll()
      } else {
        this.toastr.error(this.responseData.HATA_ACIKLAMASI, "İşlem Başarısız", { timeOut: 3000, closeButton: true, progressBar: true })
      }

      this.kullaniciIslemiKaydetBtn = false
    }
  }

  async kullaniciSilButton(secilenKayit) {
    Swal.fire({
      title               : "Kullanıcı Silinecek",
      text                : "Kullanıcı Sistemden Kalıcı Olarak Silinecek Emin Misiniz ?",
      icon                : 'warning',
      showCancelButton    : true,
      confirmButtonText   : "Evet, Sil",
      confirmButtonColor  : '#090f3c',
      cancelButtonText    : "İptal",
      cancelButtonColor   : '#222'
    }).then((result) => {
      if (result.isConfirmed) {
        this.kullaniciKayitSil(secilenKayit)
      }
    })
  }

  async kullaniciKayitSil(secilenKayit): Promise<void> {
    this.kullaniciSilinenKayitBtn[secilenKayit.e_id] = true
    this.responseData = await this.islem.WebServisSorguSonucuEWS("DELETE",  'leds/kullaniciIslemleri/sil', { ESKI_ID: secilenKayit.e_id })

    if ((this.responseData.S) == "T") {
      this.toastr.success(this.responseData.MESAJ, "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
      const i = this.kullaniciTanimlari.indexOf(secilenKayit)
      if (i > -1) {
        this.kullaniciTanimlari.splice(i, 1)
        if (this.kullaniciTanimlari.length == 0) { this.kullaniciTanimlari = null }
      }
    } else {
      this.toastr.error(this.responseData.HATA_ACIKLAMASI, "İşlem Başarısız", { timeOut: 3000, closeButton: true, progressBar: true })
    }
    this.kullaniciSilinenKayitBtn[secilenKayit.e_id] = false
  }

  parolaKontrol = 0
  parolaBarKontrol = ""
  buyukKucukHarfKontrol = false
  sayiKontrol = false
  ozelKarakterKontrol = false
  uzunlukKontrol = false

  parolaKontrolEt(val){
    this.parolaKontrol = 0

    if (val.match(/([a,b,c,ç,d,e,f,g,ğ,h,i,ı,j,k,l,m,n,o,ö,p,r,s,ş,t,u,ü,v,y,z].*[A,B,C,Ç,D,E,F,G,Ğ,H,İ,I,J,K,L,M,N,O,Ö,P,R,S,Ş,T,U,Ü,V,Y,Z])|([A,B,C,Ç,D,E,F,G,Ğ,H,İ,I,J,K,L,M,N,O,Ö,P,R,S,Ş,T,U,Ü,V,Y,Z].*[a,b,c,ç,d,e,f,g,ğ,h,i,ı,j,k,l,m,n,o,ö,p,r,s,ş,t,u,ü,v,y,z])/)) {
      this.parolaKontrol += 1;
      this.buyukKucukHarfKontrol = true
    } else {
      this.buyukKucukHarfKontrol = false
    }

    if (val.match(/([0-9])/)) {
      this.parolaKontrol += 1;
      this.sayiKontrol = true
    } else {
      this.sayiKontrol = false
    }

    if (val.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      this.parolaKontrol += 1;
      this.ozelKarakterKontrol = true
    } else {
      this.ozelKarakterKontrol = false
    }

    if (val.length > 7) {
      this.parolaKontrol += 1;
      this.uzunlukKontrol = true
    } else {
      this.uzunlukKontrol = false
    }

    if (this.parolaKontrol < 2) {
      this.parolaBarKontrol = "danger"
    } else if (this.parolaKontrol == 3) {
      this.parolaBarKontrol = "warning"
    } else if (this.parolaKontrol == 4) {
      this.parolaBarKontrol = "success"
    }
  }
}