import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  public Mensajes: any = [];
  public msgu: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    setTimeout(() =>  this.Mensajes.push({'Mensaje': 'Welcome! 🏠 <br><br> This is the UI for the Nomads App. <br> Send a message!', 'Sophie': 'Si', 'Foto': 'No'}), 500);
  }

  addMsg(){
    if(this.msgu != ''){
      this.Mensajes.push({'Mensaje': this.msgu, 'Sophie': 'No', 'Foto': 'No'});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
