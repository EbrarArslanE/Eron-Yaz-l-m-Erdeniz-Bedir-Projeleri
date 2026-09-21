import { Component, OnInit } from '@angular/core';
// import { socketIslem } from 'src/app/SOCKET';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  private messageSubscription: Subscription;
  constructor(
    // public socket : socketIslem,
  ) { }

  ngOnInit(): void {
    // this.messageSubscription = this.socket.currentMessage.subscribe((message: any) => {
    //   if (message) {
    //     if (message.oda == "chat-konusma-gecmisi") {
    //       if (message.data != '[]'){
    //         this.YONETIM_KULLANICI_LISTESI[this.aktifKonusmaPenceresiIndex].MESAJLAR = message.data
    //       }
    //     }

    //     if (message.oda == "gelen-mesaj") {
    //       this.okunmamisMesajKid = message.data.SON_MESAJ.AKID

    //       for (let index = 0; index < this.YONETIM_KULLANICI_LISTESI.length; index++) {
    //         if (this.YONETIM_KULLANICI_LISTESI[index].e_id == message.data.SON_MESAJ.AKID){
    //           this.YONETIM_KULLANICI_LISTESI[index].MESAJLAR = message.data.YAZISMA
    //         }
    //       }
    //       this.scrollToBottom()
    //     }
    //   }
    // })
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {this.messageSubscription.unsubscribe()}
    // this.socket.stopListening()
  }

  PERSONEL_ADI = localStorage.getItem("FLEET_ASSIST_personel_adi").replace(/"/g ,'')
  kisiListesi = false
  mesajKutusu = false

  aktifKonusmaPenceresiIndex = null
  mesaj = ""
  okunmamisMesajKid

  YONETIM_KULLANICI_LISTESI = [
    {
      e_id: 4551,
      e_kullanici_adi: "Eron Sigorta",
      e_personel_adi: "Eron Sigorta",
      MESAJLAR: []
    }
  ]

  // mesajGonder(){
  //   if (this.mesaj == "") return false
  //   this.socket.chatBaslat({
  //     "MPID"  : parseInt(localStorage.getItem("FLEET_ASSIST_kullanici_id")),
  //     "AKID"  : this.YONETIM_KULLANICI_LISTESI[this.aktifKonusmaPenceresiIndex].e_id,
  //     "MESAJ" : this.mesaj
  //   })
  //   this.YONETIM_KULLANICI_LISTESI[this.aktifKonusmaPenceresiIndex].MESAJLAR.push({
  //     "TARIH": new Date(),
  //     "R": this.YONETIM_KULLANICI_LISTESI[this.aktifKonusmaPenceresiIndex].e_id,
  //     "H": parseInt(localStorage.getItem("FLEET_ASSIST_kullanici_id")),
  //     "MESAJ": this.mesaj
  //   })
  //   this.scrollToBottom()
  //   this.mesaj = ""
  // }

  konusmaAc(secilenKayit, index){
    // this.socket.chatKonusmaGecmisiAl({
    //   "MPID": parseInt(localStorage.getItem("FLEET_ASSIST_kullanici_id")),
    //   "AKID": secilenKayit.e_id
    // })
  }
  //   this.mesajKutusu = true
  //   this.aktifKonusmaPenceresiIndex = index

  //   if (this.okunmamisMesajKid == secilenKayit.e_id){
  //     this.okunmamisMesajKid = null
  //   }

  //   this.scrollToBottom()
  // }

  // inputFocus(){
  //   if (this.YONETIM_KULLANICI_LISTESI[this.aktifKonusmaPenceresiIndex].e_id == this.okunmamisMesajKid)
  //   this.okunmamisMesajKid = null
  // }

  // scrollToBottom(){
  //   if (this.aktifKonusmaPenceresiIndex != null){
  //     setTimeout(() => {
  //       let divElement = document.getElementById('chat-page');
  //       divElement.scrollTop = divElement.scrollHeight;
  //       document.getElementById("mesajInput").focus()
  //     }, 200);
  //   }
  // }
}
