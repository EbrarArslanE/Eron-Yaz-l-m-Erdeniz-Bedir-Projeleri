import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { menuOlustur } from './menu';
import { MenuItem } from './menu.model';
import { LocalStoreService } from 'src/app/core/services/local-store.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { webServisIslemCalistir } from 'src/app/ISLEM';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-horizontalnavbar',
  templateUrl: './horizontalnavbar.component.html',
  styleUrls: ['./horizontalnavbar.component.scss']
})
export class HorizontalnavbarComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router, 
    private eventService: EventService, 
    private store: LocalStoreService,
    private auth: AuthenticationService,
    private islem : webServisIslemCalistir,
    private toastr: ToastrService
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activateMenu();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };

    this.loginOlanKullaniciAdi = this.store.getItem("FLEET_ASSIST_personel_adi")
    this.kullaniciIpAdresi = this.store.getItem("MAVI_BILET_personel_ip_adresi")

    await this.ipAl()
    this.initialize()
  }

  configData
  menuItems = []

  responseData
  loginOlanKullaniciAdi
  kullaniciIpAdresi
  logoutDegiskeni
  
  onMenuClick(event: any) {
    const nextEl = event.target.nextSibling;
    const parent = event.target.parentNode;
    if (nextEl.id !== 'navmenu') {
    } else if (nextEl && !nextEl.classList.contains('show')) {
      const parentEl = event.target.parentNode;
      if (parentEl) { parentEl.classList.remove('show'); }
      nextEl.classList.toggle('show');
    }
    return false;
  }

  ngAfterViewInit() {
    this.activateMenu();
  }

  _removeAllClass(className) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  toggleMenubar() {
    const element = document.getElementById('topnav-menu-content');
    element.classList.toggle('show');
  }

  private activateMenu() {

    const resetParent = (el: any) => {
      const parent = el.parentElement;
      if (parent) {
        parent.classList.remove('active');
        const parent2 = parent.parentElement;
        this._removeAllClass('mm-active');
        this._removeAllClass('mm-show');
        if (parent2) {
          parent2.classList.remove('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.remove('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove('active');
              }
            }
          }
        }
      }
    };

    const links = document.getElementsByClassName('side-nav-link-ref');
    let matchingMenuItem = null;
    for (let i = 0; i < links.length; i++) {
      resetParent(links[i]);
    }
    const topNavLinks = document.querySelectorAll('.topnav-menu .nav-link');
    topNavLinks.forEach((link) => link.classList.remove('active'));
    for (let i = 0; i < links.length; i++) {
      if (location.pathname === links[i]['pathname']) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      const parent = matchingMenuItem.parentElement;
      if (parent) {
        parent.classList.add('active');
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.add('active');
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add('active');
            const parent4 = parent3.parentElement;
            if (parent4) {
              parent4.classList.add('active');
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.add('active');
              }
            }
          }
        }
      }
      const navItem = matchingMenuItem.closest('li.nav-item');
      if (navItem) {
        const navLink = navItem.querySelector('.nav-link');
        if (navLink) {
          navLink.classList.add('active');
        }
      }
    }
  }

  topbarLight() {
    document.body.setAttribute('data-topbar', 'light');
    document.body.removeAttribute('data-layout-size');
  }

  boxedWidth() {
    document.body.setAttribute('data-layout-size', 'boxed');
    document.body.setAttribute('data-topbar', 'dark');
  }

  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }

  initialize(): void {
    this.menuItems = menuOlustur(this.kullaniciIpAdresi);
  }

  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
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

  async ipAl(): Promise<void> {
    this.responseData = await this.islem.WebServisSorguSonucuEWSCustom("GET", "h/ip", {})
    this.kullaniciIpAdresi = this.responseData.IP
  }
}
