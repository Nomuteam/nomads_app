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
import { NeweventPage } from '../newevent/newevent';
import { FilteredPage } from '../filtered/filtered';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public response$: any;
  public activities: any = [];
  public favorites: any;
  public general_loader: any;
  public users$: any;
  public noms_balance: any = '';
  public e_response$: any;
  public events: any = [];
  public favoritos: any = [];

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


  openFiltered(tipo){
    this.navCtrl.push(FilteredPage, {'Tipo': tipo});
  }

  getFavorites(){
    let a = this.favorites;
    this.favoritos = [];
    for(let key in a){
      // this.favoritos.push({
      //   'title': 'hi',
      //   'title_complete': 'hi',
      //   'location': 'hi',
      //   'description':  'hi',
      //   'cancelation_policy': 'hi',
      //   'class_price':  'hi',
      //   'fee': 'hi',
      //   'categories':  'hi',
      //   'schedule':  'hi',
      //   'media':  'hi',
      //   'img': 'hi',
      // });
      //console.log(this.activities.filter( act => act.index == a[key].index));
      console.log(a[key]);
      if(a[key].type == 'activity') this.favoritos[this.favoritos.length] = this.activities.filter( act => act.index == a[key].index)[0];
      else this.favoritos[this.favoritos.length] =  this.events.filter( act => act.index == a[key].index)[0];
    }

    console.log(this.favoritos);
    // return this.favoritos;
  }

  seeDetails(a){
    if(a.isEvent){
      this.navCtrl.push(EventPage, {'Event': a});
    }
    else{
      this.navCtrl.push(ActivityPage, {'Activity': a});
    }
  }

  verifyRaro(cosa){
    console.log(cosa);
  }


  openNew(){
    this.navCtrl.push(NeweventPage);
  }


  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  convertEvents(){
    let a = this.e_response$;
    for(let key in a){
      this.events.push({
        'title': (a[key].title.length > 15 ? a[key].title.substring(0, 15) + '..' : a[key].title),
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

    let today  = moment();
    this.events = this.events.filter( event => !moment(event.day).isBefore(today));
    if(this.general_loader) this.general_loader.dismiss();
    this.getFavorites();
  }

  convertActivities(){
    let a = this.response$;
    for(let key in a){
      this.activities.push({
        'title': (a[key].title.length > 15 ? a[key].title.substring(0, 15) + '..' : a[key].title),
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

  ionViewWillEnter(){
    this.getFavorites();
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
      this.favorites = this.users$.favorites;
    });
    this.getActivities();
  }

  openBrowse(segmento){
    this.navCtrl.push(BrowsePage, {'segment': segmento});
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

}
