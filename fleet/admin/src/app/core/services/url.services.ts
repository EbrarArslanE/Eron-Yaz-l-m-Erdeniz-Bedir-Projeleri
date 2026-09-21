import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private defaultUrl = 'https://test.eronsoftware.com:5870/eronDsh/musteri/'

  constructor() {}

  getUrl(ISLEM_URL: string): string {

    let localData: any = localStorage.getItem('eron_MAVI_BILET_islem_listesi')
    if (!localData) {
      return this.defaultUrl
    }

    try {
      localData = JSON.parse(localData)
    } catch (error) {
      console.error('LocalStorage verisi JSON formatında değil:', error)
      return this.defaultUrl
    }

    const ISLEM_LISTESI = localData?.LISTE
    const URL_LISTESI = localData?.ORTAM_BILGILER

    if (!ISLEM_LISTESI || !URL_LISTESI) {
      return this.defaultUrl
    }

    const islemParts = ISLEM_URL.split('/')
    if (islemParts.length < 2) {
      console.warn('Geçersiz ISLEM_URL formatı:', ISLEM_URL)
      return this.defaultUrl
    }

    const [componentName, islemName] = islemParts
    for (const islem of ISLEM_LISTESI) {
      if (islem.e_modul_adi === 'musteri' && islem.e_component_adi === componentName && islem.e_islem_adi === islemName ) {
        return islem.e_calisma_ortami === 'sandbox'
          ? `${URL_LISTESI.sandbox.url}:${URL_LISTESI.sandbox.port}/eronDsh/musteri/`
          : `${URL_LISTESI.test.url}:${URL_LISTESI.test.port}/musteri/`
      }
    }

    return `${URL_LISTESI.test.url}:${URL_LISTESI.test.port}/musteri/`
  }
}
