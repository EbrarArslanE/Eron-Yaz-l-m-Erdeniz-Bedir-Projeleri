import { MenuItem } from './menu.model'
import { HttpClient } from '@angular/common/http'

export function menuOlustur(ipAdresi?): MenuItem[] {
  const izinliIPler = ['78.189.31.128', '185.84.182.240', '78.189.107.82']
  const izinliIpMi = ipAdresi ? izinliIPler.includes(ipAdresi) : false

  const menu: MenuItem[] = [
    {
      label: 'Başlangıç',
      isTitle: true
    },
    {
      label: 'Sigorta Stok Kontrolü',
      icon: 'ri-check-double-line',
      link: '/ews/sigortaStokKontrolu'
    },
    {
      label: 'Diğer',
      isTitle: true
    },
    {
      label: 'Ayarlar & Tanımlar',
      icon: 'ri-settings-2-line',
      subItems: [
        {
          label: 'Kullanıcı Tanımları',
          icon: 'ri-user-settings-line',
          link: '/ews/kullaniciTanimlari'
        },
        {
          label: 'Sigorta Şirketleri',
          icon: 'ri-building-4-line',
          link: '/ews/otoAnalizSirketleri'
        },
        {
          label: 'Cari Kart tanımları',
          icon: 'ri-contacts-book-line',
          link: '/ews/cariKartTanimlari'
        }
      ]
    }
  ]

  if (izinliIpMi) {
    menu.push({
      label: 'Sistem Ayarları',
      icon: 'ri-tools-line',
      subItems: [
        {
          label: 'Component Tanımları',
          icon: 'ri-stack-line',
          link: '/ews/componentTanimlari'
        }
      ]
    })
  }

  return menu
}

export const MENU: MenuItem[] = menuOlustur()
