import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { ChatPage } from '../chat/chat';

/**
 * Generated class for the ChatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
public segment: any = 'instructors';
public user_type: any = '';
public example_chats: any = [
  {
    'name': 'Chat UI',
    'class': 'App Testing',
    'message': 'Hey! Try me out!'
  },
]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_type = localStorage.getItem('Tipo');
  }


  openChat(){
    this.navCtrl.push(ChatPage);
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  changeSegment(tipo){
    this.segment = tipo;
  }

  getSegment(tipo){
    return this.segment == tipo ? 'segment-element selected' : 'segment-element';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatsPage');
  }

}
