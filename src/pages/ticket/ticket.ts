import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public launchNavigator: LaunchNavigator) {
    this.act = this.navParams.get('Details');
    console.log(this.act);
  }

  goNavigate(){
    this.launchNavigator.navigate(this.act.location);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketPage');
  }

}
