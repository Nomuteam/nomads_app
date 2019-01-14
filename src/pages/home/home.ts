import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BrowsePage } from '../browse/browse';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import { DomSanitizer } from '@angular/platform-browser';
import { Stripe } from '@ionic-native/stripe';
import * as moment from 'moment';
import { WalletPage } from '../wallet/wallet';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public response$: any;
  public activities: any = [];
  public favorites: any = [];
  public general_loader: any;
  public users$: any;
  public noms_balance: any = '';
  public e_response$: any;
  public events: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public stripe: Stripe ) {

   this.stripe.setPublishableKey('pk_test_tRNrxhMhtRyPzotatGi5Mapm');
    let date = new Date();
    console.log(date);
    date.setHours(9);
    date.setMinutes(8);
    console.log(moment('Monday', 'dddd').fromNow());
    console.log(moment('2019-01-11').add(3, 'days').format('L'));
   // let card = {
   //  number: '5579070085401951',
   //  expMonth: 12,
   //  expYear: 2022,
   //  cvc: '997'
   // };

   let card = {
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2020,
    cvc: '220'
   };

   // this.stripe.createCardToken(card)
   //    .then(token => {
   //      this.af.list('Payments/'+firebase.auth().currentUser.uid).push({'token': token, 'amount': 500});
   //      this.alertCtrl.create({title: 'exito', buttons: ['Ok']}).present();
   //    })
   //    .catch(error => {
   //      this.alertCtrl.create({title: 'error', buttons: ['Ok']}).present();
   //    });

  }





  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  convertEvents(){
    let a = this.e_response$;
    for(let key in a){
      this.events.push({
        'title': a[key].title.substring(0, 10) + '..',
        'title_complete': a[key].title,
        'location': a[key].location,
        'difficulty':  a[key].difficulty,
        'img':  a[key].img,
        'about_event':  a[key].about_event,
        'provided':  a[key].provided,
        'about_organizer':  a[key].about_organizer,
        'spaces_available':  a[key].spaces_available,
        'cost':  a[key].cost,
        'type':  a[key].type,
        'day': a[key].day,
        'time': a[key].time,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'media': a[key].media,
        'isEvent': true
      });
    }
    if(this.general_loader) this.general_loader.dismiss();
  }

  convertActivities(){
    let a = this.response$;
    for(let key in a){
      this.activities.push({
        'title': a[key].title.substring(0, 10) + '..',
        'title_complete': a[key].title,
        'location': a[key].location,
        'description':  a[key].description,
        'cancelation_policy':  a[key].cancelation_policy,
        'class_price':  a[key].class_price,
        'fee':  a[key].fee,
        'categories':  a[key].categories,
        'schedule':  a[key].schedule,
        'media':  a[key].media,
        'img':  a[key].img,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'isEvent': false
      });
    }
  }

  openActivity(actividad){
    this.navCtrl.push(ActivityPage, {'Activity': actividad});
  }

  testWallet(){
   this.navCtrl.parent.select(4);
   setTimeout(() => {this.navCtrl.parent.getSelected().push(WalletPage)}, 500);
  }

  openEvent(event){
    this.navCtrl.push(EventPage, {'Event': event});
  }


  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.activities = [];
      this.convertActivities();
    });
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.events = [];
      this.convertEvents();
    });
  }

  ionViewDidLoad() {
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
    });
    this.getActivities();
  }

  openBrowse(){
    this.navCtrl.push(BrowsePage);
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

}
