import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'
import { webServisIslemCalistir } from '../../../ISLEM'
import { ToastrService } from 'ngx-toastr'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormControl } from '@angular/forms'
import Swal from 'sweetalert2/dist/sweetalert2'
import { Title } from '@angular/platform-browser'
import { BreadcrumpService } from 'src/app/core/services/breadcrump.service'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-componentTanimlari',
  templateUrl: './componentTanimlari.html'
})

export class componentTanimlariComponent implements OnInit {
  constructor(
    public islem: webServisIslemCalistir,
    private modalService: NgbModal,
    public modalConfig: NgbModalConfig,
    private toastr: ToastrService,
    private hc: HttpClient,
    private titleService: Title,
    private bs: BreadcrumpService
  ) {
    modalConfig.backdrop = 'static'
    modalConfig.keyboard = false
    modalConfig.size = 'sm'
  }

  @ViewChild('modalComponentTanimlari') modalComponentTanimlari: ElementRef
  @ViewChild('modalMetodTanimlari') modalMetodTanimlari: ElementRef

  async ngOnInit() {
    this.getPublicIP().subscribe((res: any) => {
      const kullaniciIp = res.ip;

      const izinliIpler = [

        "78.189.31.128",
        "185.84.182.240",
        '78.189.107.82'
      ];

      // if (!izinliIpler.includes(kullaniciIp)) {
      //   window.location.href = "https://basvuru.ilahiyatyildizlariodulleri.com/admin/giris";
      //   return;
      // }

      this.componentListele();
    });

    this.titleService.setTitle("Fleet Assist | Component Tanımları");
    this.bs.change(['Sistem Ayarları', 'Component Tanımları']);
  }


  modalAc(content, size) {
    this.modalConfig.size = size
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
  }
  modalHeader = { title: '' }

  componentTanimlariFormu = new FormGroup({
    islem: new FormControl(''),
    method: new FormControl(''),
    e_component_adi: new FormControl(''),
    e_component_url: new FormControl(''),
    eski_id: new FormControl('')
  })

  metodTanimlariFormu = new FormGroup({
    islem: new FormControl(''),
    method: new FormControl(''),
    e_component_id: new FormControl(''),
    e_metod: new FormControl(''),
    e_islem_adi: new FormControl(''),
    e_islem_url: new FormControl(''),
    e_parametreler: new FormControl(''),
    e_procedure_adi: new FormControl(''),
    e_procedure_islem: new FormControl(''),
    eski_id: new FormControl('')
  })

  componentFilterData = {
    ARAMA: '',
    SS: 1,
    KS: 1000
  }

  metodFilterData = {
    e_component_id: '',
    KS: 1000
  }

  requestData
  responseData
  componentLoader = false
  metodLoader = false

  componentTipFiltre = ""
  componentTipleri

  componentTanimlari
  metodTanimlari
  componentIslemiKaydetBtn = false
  degisiklikleriUygulaBtn = false
  metodIslemiKaydetBtn = false
  componentSilinenKayitBtn = [false]
  metodSilinenKayitBtn = [false]
  secilenComponent = null
  parametreler = []
  yeniParametre = ''

  getPublicIP() {
    return this.hc.get('https://api.ipify.org?format=json');
  }

  async componentListele(): Promise<void> {
    this.componentLoader = true

    this.responseData = await this.islem.WebServisSorguSonucuEWS("GET", "leds/componentIslemleri/componentListele", this.componentFilterData)

    const data = (this.responseData?.DATA as any[]) || []

    this.componentTipleri = [...new Set<string>(
      data
        .map(x => String(x?.e_component_adi ?? ""))
        .filter(x => x.includes(" - "))
        .map(x => x.split(" - ")[0])
    )]

    const list = this.componentTipFiltre ? data.filter(x => (x?.e_component_adi || "").startsWith(this.componentTipFiltre + " - ")) : data

    this.componentTanimlari = list.length ? list : null
    this.componentLoader = false
  }

  async componentEkleButton() {
    this.componentTanimlariFormu.patchValue({
      islem: 'leds/componentIslemleri/componentEkle',
      method: 'POST',
      e_component_adi: '',
      e_component_url: ''
    })
    this.modalHeader.title = "Component Ekleme Formu"
    this.modalAc(this.modalComponentTanimlari, 'md')
  }

  async componentDuzenleButton(secilenKayit) {
    this.componentTanimlariFormu.patchValue({
      islem: 'componentIslemleri/componentDuzenle',
      method: 'PUT',
      e_component_adi: secilenKayit.e_component_adi,
      e_component_url: secilenKayit.e_component_url,
      eski_id: secilenKayit.e_id
    })
    this.modalHeader.title = "Component Düzenleme Formu"
    this.modalAc(this.modalComponentTanimlari, 'md')
  }

  async componentIslemiKaydet(): Promise<void> {
    if (this.componentTanimlariFormu.valid) {
      this.componentIslemiKaydetBtn = true

      this.requestData = Object.assign({}, this.componentTanimlariFormu.value)
      this.responseData = await this.islem.WebServisSorguSonucuEWS(this.requestData.method, this.requestData.islem, this.requestData)

      if (this.responseData.S == "T") {
        this.toastr.success(this.responseData.MESAJ, "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
        this.componentListele()
        this.modalService.dismissAll()
      } else {
        this.toastr.error(this.responseData.HATA_ACIKLAMASI, "İşlem Başarısız", { timeOut: 3000, closeButton: true, progressBar: true })
      }

      this.componentIslemiKaydetBtn = false
    }
  }

  async componentSilButton(secilenKayit) {
    Swal.fire({
      title: "Component Silinecek",
      text: "Component Sistemden Kalıcı Olarak Silinecek Emin Misiniz ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Evet, Sil",
      confirmButtonColor: '#090f3c',
      cancelButtonText: "İptal",
      cancelButtonColor: '#222'
    }).then((result) => {
      if (result.isConfirmed) {
        this.componentKayitSil(secilenKayit)
      }
    })
  }

  async componentKayitSil(secilenKayit): Promise<void> {
    this.componentSilinenKayitBtn[secilenKayit.e_id] = true
    this.responseData = await this.islem.WebServisSorguSonucuEWS("DELETE", 'leds/componentIslemleri/componentSil', { eski_id: secilenKayit.e_id })

    if ((this.responseData.S) == "T") {
      this.toastr.success(this.responseData.MESAJ, "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
      const i = this.componentTanimlari.indexOf(secilenKayit)
      if (i > -1) {
        this.componentTanimlari.splice(i, 1)
        if (this.componentTanimlari.length == 0) { this.componentTanimlari = null }
      }
    } else {
      this.toastr.error(this.responseData.HATA_ACIKLAMASI, "İşlem Başarısız", { timeOut: 3000, closeButton: true, progressBar: true })
    }
    this.componentSilinenKayitBtn[secilenKayit.e_id] = false
  }

  async metodListele(component): Promise<void> {
    if (this.secilenComponent?.e_id === component.e_id) {
      this.secilenComponent = null
      this.metodTanimlari = null
      return
    }

    this.secilenComponent = component
    this.metodFilterData.e_component_id = component.e_id
    this.metodLoader = true
    this.responseData = await this.islem.WebServisSorguSonucuEWS("GET", "leds/componentIslemleri/metodListele", this.metodFilterData)
    if (this.responseData.DATA.length == 0) { this.metodTanimlari = null } else { this.metodTanimlari = this.responseData.DATA }
    this.metodLoader = false
  }

  async metodEkleButton() {
    if (!this.secilenComponent) {
      this.toastr.error("Önce bir component seçiniz!", "Uyarı", { timeOut: 3000, closeButton: true, progressBar: true })
      return
    }

    this.parametreler = []
    this.yeniParametre = ''
    this.metodTanimlariFormu.patchValue({
      islem: 'leds/componentIslemleri/metodEkle',
      method: 'POST',
      e_component_id: this.secilenComponent.e_id,
      e_metod: '',
      e_islem_adi: '',
      e_islem_url: '',
      e_parametreler: '',
      e_procedure_adi: '',
      e_procedure_islem: ''
    })
    this.modalHeader.title = "Metod Ekleme Formu"
    this.modalAc(this.modalMetodTanimlari, 'lg')
  }

  async metodDuzenleButton(secilenKayit) {
    this.parametreler = Array.isArray(secilenKayit.e_parametreler)
      ? [...secilenKayit.e_parametreler]
      : []
    this.yeniParametre = ''

    this.metodTanimlariFormu.patchValue({
      islem: 'leds/componentIslemleri/metodDuzenle',
      method: 'PUT',
      e_component_id: this.secilenComponent ? this.secilenComponent.e_id : secilenKayit.e_component_id,
      e_metod: secilenKayit.e_metod,
      e_islem_adi: secilenKayit.e_islem_adi,
      e_islem_url: secilenKayit.e_islem_url,
      e_parametreler: secilenKayit.e_parametreler,
      e_procedure_adi: secilenKayit.e_procedure_adi,
      e_procedure_islem: secilenKayit.e_procedure_islem,
      eski_id: secilenKayit.e_id
    })
    this.modalHeader.title = "Metod Düzenleme Formu"
    this.modalAc(this.modalMetodTanimlari, 'lg')
  }

  async metodKopyalaButton(secilenKayit) {
    this.parametreler = Array.isArray(secilenKayit.e_parametreler)
      ? [...secilenKayit.e_parametreler]
      : []
    this.yeniParametre = ''

    this.metodTanimlariFormu.patchValue({
      islem: 'leds/componentIslemleri/metodEkle',
      method: 'POST',
      e_component_id: this.secilenComponent ? this.secilenComponent.e_id : secilenKayit.e_component_id,
      e_metod: secilenKayit.e_metod,
      e_islem_adi: secilenKayit.e_islem_adi,
      e_islem_url: secilenKayit.e_islem_url,
      e_parametreler: secilenKayit.e_parametreler,
      e_procedure_adi: secilenKayit.e_procedure_adi,
      e_procedure_islem: secilenKayit.e_procedure_islem,
      eski_id: ''
    })
    this.modalHeader.title = "Metod Kopyalama Formu"
    this.modalAc(this.modalMetodTanimlari, 'lg')
  }

  async metodIslemiKaydet(): Promise<void> {
    if (this.metodTanimlariFormu.valid) {
      this.metodIslemiKaydetBtn = true

      this.requestData = Object.assign({}, this.metodTanimlariFormu.value)
      this.requestData.e_parametreler = JSON.stringify(this.parametreler)
      this.responseData = await this.islem.WebServisSorguSonucuEWS(this.requestData.method, this.requestData.islem, this.requestData)

      if (this.responseData.S == "T") {
        this.toastr.success(this.responseData.MESAJ, "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
        this.metodListele(this.secilenComponent)
        this.modalService.dismissAll()
      } else {
        this.toastr.error(this.responseData.HATA_ACIKLAMASI, "İşlem Başarısız", { timeOut: 3000, closeButton: true, progressBar: true })
      }

      this.metodIslemiKaydetBtn = false
    }
  }

  async metodSilButton(secilenKayit) {
    Swal.fire({
      title: "Metod Silinecek",
      text: "Metod Sistemden Kalıcı Olarak Silinecek Emin Misiniz ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: "Evet, Sil",
      confirmButtonColor: '#090f3c',
      cancelButtonText: "İptal",
      cancelButtonColor: '#222'
    }).then((result) => {
      if (result.isConfirmed) {
        this.metodKayitSil(secilenKayit)
      }
    })
  }

  async metodKayitSil(secilenKayit): Promise<void> {
    this.metodSilinenKayitBtn[secilenKayit.e_id] = true
    this.responseData = await this.islem.WebServisSorguSonucuEWS("DELETE", 'leds/componentIslemleri/metodSil', { eski_id: secilenKayit.e_id })

    if ((this.responseData.S) == "T") {
      this.toastr.success(this.responseData.MESAJ, "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
      const i = this.metodTanimlari.indexOf(secilenKayit)
      if (i > -1) {
        this.metodTanimlari.splice(i, 1)
        if (this.metodTanimlari.length == 0) { this.metodTanimlari = null }
      }
    } else {
      this.toastr.error(this.responseData.HATA_ACIKLAMASI, "İşlem Başarısız", { timeOut: 3000, closeButton: true, progressBar: true })
    }
    this.metodSilinenKayitBtn[secilenKayit.e_id] = false
  }

  parametreEkle() {
    if (this.yeniParametre.trim()) {
      if (!this.parametreler.includes(this.yeniParametre.trim())) {
        this.parametreler.push(this.yeniParametre.trim())
        this.yeniParametre = ''
      } else {
        this.toastr.error("Bu parametre zaten eklenmiş!", "Uyarı", { timeOut: 3000, closeButton: true, progressBar: true })
      }
    }
  }

  parametreSil(index) {
    this.parametreler.splice(index, 1)
  }

  parametreleriArrayeDonustur(parametreler) {
    return Array.isArray(parametreler) ? parametreler : []
  }

  parametreSurukleBirak(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.parametreler, event.previousIndex, event.currentIndex)
    }
  }

  async degisiklikleriUygula() {
    this.degisiklikleriUygulaBtn = true
    this.responseData = await this.islem.WebServisSorguSonucuEWSCustom("POST", 'ledsj/j/jsonKaydet', {})
    if (this.responseData.S == 'T') {
      this.toastr.success(this.responseData.MESAJ, "İşlem Başarılı!", { timeOut: 3000, closeButton: true, progressBar: true })
      this.componentListele()
    } else {
      this.toastr.error(this.responseData.HATA_ACIKLAMASI, "İşlem Başarısız", { timeOut: 3000, closeButton: true, progressBar: true })
    }
    this.degisiklikleriUygulaBtn = false
  }
}
