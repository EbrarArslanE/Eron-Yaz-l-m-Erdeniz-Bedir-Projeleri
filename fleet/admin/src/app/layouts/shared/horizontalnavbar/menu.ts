import { MenuItem } from './menu.model'

export function menuOlustur(ipAdresi?): MenuItem[] {
  const izinliIPler = ['78.189.31.128', '185.84.182.240', '78.189.107.82']
  const izinliIpMi = ipAdresi ? izinliIPler.includes(ipAdresi) : false

  const menu: MenuItem[] = [
    {
      label: 'Oto Analiz Siparişleri',
      icon: 'ri-car-line',
      link: '/ews/turTanimlari'
    },
    {
      label: 'Ayarlar & Tanımlar',
      icon: 'ri-settings-2-line',
      subItems: [
        {
          label: 'Kullanıcı Tanımları',
          icon: 'ri-user-settings-line',
          link: '/ews/kullaniciTanimlari'
        }
      ]
    },
        // {
    //   label: 'Muhasebe',
    //   icon: 'fas fa-cash-register',
    //   subItems: [
    //     {
    //       label: 'Ödeme Tahsilat',
    //       icon: 'fas fa-chart-line',
    //       link: '/ews/odemeTahsilatFisleri'
    //     },
    //     {
    //       label: 'Borç Alacak Kayıtları',
    //       icon: 'fas fa-wallet',
    //       link: '/ews/borcAlacakFisleri'
    //     },
    //     {
    //       label: 'Ön Ödemeli Satışlar',
    //       icon: 'fas fa-money-check-alt',
    //       link: '/ews/onOdemeliSatislar'
    //     },
    //     {
    //       label: 'Toplu Bilet Alımları',
    //       icon: 'fas fa-shopping-cart',
    //       link: '/ews/topluBiletAlimlari'
    //     },
    //     {
    //       label: 'Cari Ekstre',
    //       icon: 'fas fa-file-invoice',
    //       link: '/ews/cariEkstre'
    //     }
    //   ]
    // }
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
