import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BrowsePage } from '../browse/browse';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { ActivityPage } from '../activity/activity';
import { DomSanitizer } from '@angular/platform-browser';
import { Stripe } from '@ionic-native/stripe';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public response$: any;
  public activities: any = [];
  public favorites: any = [];
  public general_loader: any;
  public events: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public stripe: Stripe ) {

   this.stripe.setPublishableKey('pk_test_tRNrxhMhtRyPzotatGi5Mapm');

   let card = {
    number: '5579070085401951',
    expMonth: 12,
    expYear: 2022,
    cvc: '997'
   };

   // let card = {
   //  number: '4242424242424242',
   //  expMonth: 12,
   //  expYear: 2020,
   //  cvc: '220'
   // };

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
        'index':  a[key].index
      });
    }
    this.general_loader.dismiss();
  }

  openActivity(actividad){
    this.navCtrl.push(ActivityPage, {'Activity': actividad});
  }


  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.activities = [];
      this.convertActivities();
    });
  }

  ionViewDidLoad() {
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.getActivities();
  }

  openBrowse(){
    this.navCtrl.push(BrowsePage);
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

}
