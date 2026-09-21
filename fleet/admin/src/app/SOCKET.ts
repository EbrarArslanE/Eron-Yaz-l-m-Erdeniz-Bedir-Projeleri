// import { Injectable } from "@angular/core";
// import { BehaviorSubject } from 'rxjs';
// import { io } from "socket.io-client";

// @Injectable({
//   providedIn: "root"
// })
// export class socketIslem {

//   public socket: any;
//   public messageSource = new BehaviorSubject<string>(null);
//   currentMessage = this.messageSource.asObservable();

//   constructor() {}

//   socketBaglan() {
//     this.socket = io("https://anahubdev.anasigorta.com.tr/sc", {
//       'forceNew': true,
//       query: { "baglantiKanali": "merkez", "KID": localStorage.getItem("FLEET_ASSIST_kullanici_id") }
//     })
//   }

//   stopListening() {
//     this.messageSource.next(null);
//   }

//   socketAyril() {
//     if (this.socket) {
//       this.socket.disconnect();
//     }
//   }

//   ticketCevapVer(ID, UNIQ_ID) {
//     if (this.socket) {
//       this.socket.emit('merkezToacente-ticketCevap', {APID: ID, UNIQ_ID: UNIQ_ID});
//     }
//   }

//   ticketKapat(ID) {
//     if (this.socket) {
//       this.socket.emit('merkezToacente-ticketKapama', {APID: ID});
//     }
//   }

//   chatBaslat(data) {
//     if (this.socket) {
//       this.socket.emit('merkezToacente-chat', JSON.stringify(data));
//     }
//   }

//   chatKonusmaGecmisiAl(data) {
//     if (this.socket) {
//       this.socket.emit('chat-konusma-gecmisi', JSON.stringify(data));
//     }
//   }
// }
