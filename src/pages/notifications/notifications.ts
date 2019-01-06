import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
public example_notifs: any = [
  {
    'sender': 'Team Nomads',
    'relation': 'owner',
    'message': 'Black Friday sale is here! Check the promos. Active from now until next sunday.',
    'isAdmin': true
  },
  {
    'sender': 'Mónica',
    'relation': 'Indoor Training',
    'message': 'Guys, the studio will be open 1hr before class if you want to arrive early or if you need to change. See you there!!',
    'isAdmin': false
  },
  {
    'sender': 'Osmar',
    'relation': 'clan',
    'message': 'I just joined a Relaxing Hike class! Join Me!',
    'isAdmin': false
  }
]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }



  isAdmin(admin, type){
    console.log(admin);
    if(type == 'general'){
      return ( admin ? 'notif-container purple' : 'notif-container');
    }
    else{
      return ( admin ? type + ' inverted' : type);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

}
