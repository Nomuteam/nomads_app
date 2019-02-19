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
declare var google;
import { Geolocation } from '@ionic-native/geolocation';

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

  public user_preferences: any = [];

  public filtered_a: any = [];
  public posicion: any = '';

  public done_e: any = false;
  public done_a: any = false;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public stripe: Stripe,
  public geolocation: Geolocation ) {

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
    this.getFiltersP();
    // return this.favoritos;
  }

  getFiltersP(){
    this.af.object('Users/'+firebase.auth().currentUser.uid+'/preferences').snapshotChanges().subscribe(action => {
      this.user_preferences = action.payload.val();
      console.log(this.user_preferences);
      this.applyFilters();
    });
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

  coordenadas(a, address, tit, fn){
    let geocoder = new google.maps.Geocoder();
    let vm = this;
    geocoder.geocode( { 'address' : address}, function( results, status ) {
       if( status == google.maps.GeocoderStatus.OK ) {
         console.log(results);
         fn(results[0].formatted_address);
       } else {
          this.af.list('AppErrors/').push({'type': 'Geocode', 'error': status});
          // alert( 'Geocode was not successful for the following reason: ' + status );
       }
   });
  }

  getDistance(address, fn){
    let geocoder = new google.maps.Geocoder();
    let vm = this;
    let distance = new google.maps.DistanceMatrixService();
    let result = 0;
    let result2 = '';

    return distance.getDistanceMatrix({
         origins: [this.posicion],
         destinations: [address],
         travelMode: google.maps.TravelMode.DRIVING
         },
     function (response, status) {
         // check status from google service call
         if (status !== google.maps.DistanceMatrixStatus.OK) {
             console.log('Error:', status);
         } else {
           console.log(response);
           result = response.rows[0].elements[0].distance.value;
           result2 = response.rows[0].elements[0].distance.text;
           fn(result, result2);
           //vm.activities_all[p].distance = response.rows[0].elements[0].distance.value;
           }
     });

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
        'distance': '',
        'distance_number': 0,
        'time': a[key].time,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'media': a[key].media,
        'nomads': (a[key].nomads ? a[key].nomads : []),
        'isEvent': true,
        'review':( a[key].review ? a[key].review : 5),
        'reviews': (a[key].reviews ? a[key].reviews : []),
        'special': (a[key].special ? a[key].special : false)
      });
    }

    let today  = moment();
    this.events = this.events.filter( event => !moment(event.day).isBefore(today));
    console.log(this.events.length);

    if(!this.done_e){
    this.done_e = true;
    let vm = this;
    for(let i=0; i < this.events.length; i++){

    this.coordenadas(this.events[i], this.events[i].location, this.events[i].title_complete,  function(location){
        vm.events[i].location = location;
        let om = vm;
        vm.getDistance(location, function(distance, text){
          console.log(distance+' km');
          vm.events[i].distance = text;
          vm.events[i].distance_number = distance;
        });
    });
  }

    }

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
        'nomads': (a[key].nomads ? a[key].nomads : []),
        'img':  a[key].img,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'isEvent': false,
        'review':( a[key].review ? a[key].review : 5),
        'reviews': (a[key].reviews ? a[key].reviews : []),
        'special': (a[key].special ? a[key].special : false),
        'distance': '',
        'distance_number': 0
      });
    }


   if(!this.done_a){
     this.done_a = true;
     let vm = this;
     for(let i=0; i < this.activities.length; i++){

     this.coordenadas(this.activities[i], this.activities[i].location, this.activities[i].title_complete,  function(location){
         vm.activities[i].location = location;
         let om = vm;
         vm.getDistance(location, function(distance, text){
           console.log(distance+' km');
           vm.activities[i].distance = text;
           vm.activities[i].distance_number = distance;
         });
     });
     }
   }

   // this.activities = this.activities.sort(function(a, b){
   //  var keyA = a.distance_number,
   //      keyB = b.distance_number;
   //  // Compare the 2 dates
   //  if(keyA < keyB) return -1;
   //  if(keyA > keyB) return 1;
   //  return 0;
   // });
  }

  getClosest(){
    return this.activities.sort(function(a, b){
     var keyA = a.distance_number,
         keyB = b.distance_number;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
    });
  }

  getRated(){
   let aux = [];
   aux = this.activities.sort(function(a, b){
    var keyA = a.review,
        keyB = b.review;
    // Compare the 2 dates
    if(keyA > keyB) return -1;
    if(keyA < keyB) return 1;
    return 0;
   });
   aux = this.getClosest();
   //console.log(aux);
   return aux;
  }

  getSpecial(){
    return this.activities.filter(act => act.special);
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

  existsF(arre, cual){
    for(let key in arre){
      if(arre[key].name == cual) return true;
    }
    return false;
  }

  existsO(arre, cual){
    console.log(arre);
    for(let key in arre){
      if(arre[key].title == cual) return true;
    }
    return false;
  }

  applyFilters(){
    let cats = this.user_preferences.categories.filter(c => c.selected);
    let days = this.user_preferences.days.filter(d => d.selected);
    let forms = this.user_preferences.forms.filter(f=> f.selected);
    let types = this.user_preferences.types.filter(t=> t.selected);
    let aux = [];
    let a = this.activities;

    if(cats.length > 0){
      for(let i=0; i<a.length; i++){
        if(this.existsF(cats, a[i].categories.main_category)){
          aux.push(a[i]);
        }
      }
    }

    if(types.length > 0){
      for(let i=0; i<a.length; i++){
        if(this.existsO(types, a[i].categories.activity_type)){
          aux.push(a[i]);
        }
      }
    }

     aux = aux.sort(function(a, b){
     var keyA = a.distance_number,
         keyB = b.distance_number;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
    });

    this.filtered_a = aux;
  }

  ionViewWillEnter(){
    if(this.activities != []){
      this.getFavorites();
    }


    this.geolocation.getCurrentPosition().then((position) => {

      this.posicion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    }, (err) => {
      console.log(err);
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
