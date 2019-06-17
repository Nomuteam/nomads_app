import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import * as moment from 'moment';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the FilteredPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filtered',
  templateUrl: 'filtered.html',
})
export class FilteredPage {
public activitites_example: any = [
  {
    'title': 'Relaxing Hike',
    'distance': '15 km',
    'cost': 15
  },
  {
    'title': 'Yoga in the Park',
    'distance': '22 km',
    'cost': 10
  },
  {
    'title': 'Kickboxing',
    'distance': '25 km',
    'cost': 18
  },
  {
    'title': 'Swimming Lesson',
    'distance': '31 km',
    'cost': 14
  },
];
public type: any;

public general_loader: any;
public response$: any;
public e_response$: any;

public activities_all: any = [];
public posicion: any = '';
public done_a: any = false;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public geolocation: Geolocation) {
   this.type = this.navParams.get('Tipo');
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  seeDetails(a){
    if(a.isEvent){
      this.navCtrl.push(EventPage, {'Event': a});
    }
    else{
      this.navCtrl.push(ActivityPage, {'Activity': a});
    }
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

  convertActivities(){
  //   let a = this.e_response$;
  //
  //   for(let key in a){
  //     this.activities_all.push({
  //       'title': a[key].title.substring(0, 10) + '..',
  //       'title_complete': a[key].title,
  //       'location': a[key].location,
  //       'difficulty':  a[key].difficulty,
  //       'img':  a[key].img,
  //       'categories':  (a[key].categories ? a[key].categories : []),
  //       'cost':  a[key].cost,
  //       'tipo': 'Evento',
  //       'about_event':  a[key].about_event,
  //       'provided':  a[key].provided,
  //       'about_organizer':  a[key].about_organizer,
  //       'type':  a[key].type,
  //       'allDay': false,
  //       'time': a[key].time,
  //       'creator':  a[key].creator,
  //       'index':  a[key].index,
  //       'media': a[key].media,
  //       'isEvent': true,
  //       'day': a[key].day,
  //       'nomads': (a[key].nomads ? a[key].nomads : []),
  //       'review': (a[key].review ? a[key].review : 5),
  //       'reviews': (a[key].reviews ? a[key].reviews : []),
  //       'distance': '',
  //       'distance_number': 0
  //     });
  // }
  //
  // let today  = moment();
  // this.activities_all = this.activities_all.filter( event => !moment(event.day).isBefore(today));
  //
  //   let b = this.response$;
  //     for(let key in b){
  //         this.activities_all.push({
  //           'title': b[key].title.substring(0, 10) + '..',
  //           'title_complete': b[key].title,
  //           'location': b[key].location,
  //           'description':  b[key].description,
  //           'cancelation_policy':  b[key].cancelation_policy,
  //           'categories':  b[key].categories,
  //           'tipo': b[key].categories.main_category,
  //           'schedule':  b[key].schedule,
  //           'img':  b[key].img,
  //           'cost':  b[key].class_price,
  //           'class_price': b[key].class_price,
  //           'type':  b[key].type,
  //           'allDay': false,
  //           'creator':  b[key].creator,
  //           'index':  b[key].index,
  //           'media': b[key].media,
  //           'isEvent': false,
  //           'nomads': (b[key].nomads ? b[key].nomads : []),
  //           'review': (b[key].review ? b[key].review : 5),
  //           'reviews': (b[key].reviews ? b[key].reviews : []),
  //           'distance': '',
  //           'distance_number': 0
  //         });
  //     }

  this.activities_all = JSON.parse(localStorage.getItem('actividades'));
  this.activities_all = this.activities_all.concat(JSON.parse(localStorage.getItem('events')));

   if(this.type == 'All Events') this.activities_all = this.activities_all.filter( act => act.isEvent);
   else if (this.type == 'All Activities') this.activities_all = this.activities_all.filter( act => !act.isEvent);
   else this.activities_all = this.activities_all.filter( act => act.tipo == this.type || (act.categories && act.categories.activity_type == this.type ));


   // if(!this.done_a){
   //   this.done_a = true;
   //   let vm = this;
   //   for(let i=0; i < this.activities_all.length; i++){
   //
   //   this.coordenadas(this.activities_all[i], this.activities_all[i].location, this.activities_all[i].title_complete,  function(location){
   //       vm.activities_all[i].location = location;
   //       let om = vm;
   //       vm.getDistance(location, function(distance, text){
   //         console.log(distance+' km');
   //         vm.activities_all[i].distance = text;
   //         vm.activities_all[i].distance_number = distance;
   //       });
   //   });
   //   }
   // }

   console.log(this.activities_all);
   if(this.general_loader) this.general_loader.dismiss();
  }

  getEvents(){
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.activities_all = [];
      this.convertActivities();
    });
  }

  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.getEvents();
    });
  }

  ionViewDidLoad() {
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.getEvents();
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

}
