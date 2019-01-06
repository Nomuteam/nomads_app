import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
public example_chats: any = [
  {
    'name': 'Mónica',
    'class': 'Indoor Training',
    'message': 'Hey! I got a message for you'
  },
  {
    'name': 'Imanol',
    'class': 'Calisthenics',
    'message': 'When are you coming?'
  },
  {
    'name': 'Osmar',
    'class': 'MMA',
    'message': 'Can i fight you next monday?'
  },
]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
