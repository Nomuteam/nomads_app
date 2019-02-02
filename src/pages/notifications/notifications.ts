import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';

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
public general_loader: any;
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
];
//For the user
public users$: any;
public noms_balance: any = [];

//For the Notifications
public response$: any;
public notifications: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController) {
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }



  isAdmin(admin, type){
    if(type == 'general'){
      return ( admin ? 'notif-container purple' : 'notif-container');
    }
    else{
      return ( admin ? type + ' inverted' : type);
    }
  }

  convertN(){
    let a = this.response$;
    for(let key in a){
     this.notifications.push({
       'title': a[key].title,
       'subtitle': a[key].subtitle,
       'isAdmin': a[key].isAdmin
     });
    }

    console.log(this.notifications);
    if(this.general_loader) this.general_loader.dismiss();
  }

  ionViewDidLoad() {
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();

    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();

      this.noms_balance = this.users$.noms;
      //if(this.general_loader) this.general_loader.dismiss();
    });

    this.af.object('Notifications/').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.notifications = [];
      this.convertN();
    });
  }

}
