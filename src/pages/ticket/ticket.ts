import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TicketPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {
public act: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.act = this.navParams.get('Details');
    console.log(this.act);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

}
