import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { WalletPage } from '../wallet/wallet';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import * as moment from 'moment';
import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
public general_loader: any;

//For the user
public users$: any;
public noms_balance: any = [];
public nomad_schedule: any = [];

public response$: any;
public e_response$: any;
public activities_all: any = [];

public auxiliar: any;
public class_slides: any= false;

public done_g: any = false;
public user_preferences: any = [];
public filtered_a: any = [];

  @ViewChild('map') mapElement: ElementRef;
   map: any;

  constructor( public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public sanitizer: DomSanitizer,
    public modalCtrl: ModalController) {

  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  testWallet(){
   this.navCtrl.parent.select(4);
   setTimeout(() => {this.navCtrl.parent.getSelected().push(WalletPage)}, 500);
  }


  getCoordinates(direccion){



 }

 seeDetails(a){
   if(a.isEvent){
     this.navCtrl.push(EventPage, {'Event': a});
   }
   else{
     this.navCtrl.push(ActivityPage, {'Activity': a});
   }
 }

 changePosition(){


   if(this.class_slides){
     this.class_slides = false;
   }
   else{
     this.class_slides = true;
   }
 }

 getFiltersP(){
   this.af.object('Users/'+firebase.auth().currentUser.uid+'/preferences').snapshotChanges().subscribe(action => {
     this.user_preferences = action.payload.val();
     console.log(this.user_preferences);
     this.applyFilters();
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
   let a = this.activities_all;

   if(cats.length > 0){
     for(let i=0; i<a.length; i++){
       if(!a[i].isEvent && this.existsF(cats, a[i].categories.main_category)){
         aux.push(a[i]);
       }
     }
   }

   if(types.length > 0){
     for(let i=0; i<a.length; i++){
       if(!a[i].isEvent && this.existsO(types, a[i].categories.activity_type) && !a[i].isEvent){
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
   console.log(this.filtered_a);
 }

 coordenadas(a, address, tit, fn){
   let geocoder = new google.maps.Geocoder();
   let vm = this;
   geocoder.geocode( { 'address' : address}, function( results, status ) {
      if( status == google.maps.GeocoderStatus.OK ) {
        console.log(results);
        fn(results[0].formatted_address);
        let marker = new google.maps.Marker({
          map: vm.map,
          animation: google.maps.Animation.DROP,
          position: results[0].geometry.location,
          icon: 'https://firebasestorage.googleapis.com/v0/b/dev-nomads.appspot.com/o/mapa_icon.png?alt=media&token=5b6660bb-5110-4a2f-9b4c-f6ad84acacdf'
        });

        let modal = vm.modalCtrl.create(DetailsPage, {'Details': a});
        let content = "<h4>"+tit+"</h4>";

        let infoWindow = new google.maps.InfoWindow({
          content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
          //infoWindow.open(vm.map, marker);
          modal.present();
        });
      } else {
         vm.af.list('AppErrors/').push({'type': 'Geocode', 'error': status});
         // alert( 'Geocode was not successful for the following reason: ' + status );
      }
  });
 }

 getSorted(){
   return this.activities_all.sort(function(a, b){
    var keyA = a.distance_number,
        keyB = b.distance_number;
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
   });
 }

  populateMap(){
    this.done_g = true;
    let vm = this;
    for(let i=0; i<this.activities_all.length; i++){

    this.coordenadas(this.activities_all[i], this.activities_all[i].location, this.activities_all[i].title_complete,  function(location){
        vm.activities_all[i].location = location;
        let om = vm;
        vm.getDistance(location, function(distance, text){
          console.log(distance+' km');
          vm.activities_all[i].distance = text;
          vm.activities_all[i].distance_number = distance;
        });
    });

    }


    console.log(this.activities_all);
    this.general_loader.dismiss();
    setTimeout(() => {this.class_slides = true}, 100);
  }


  getDistance(address, fn){
    let geocoder = new google.maps.Geocoder();
    let vm = this;
    let distance = new google.maps.DistanceMatrixService();
    let result = 0;
    let result2 = '';

    return distance.getDistanceMatrix({
         origins: [vm.map.getCenter()],
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
    let a = this.e_response$;

    for(let key in a){
      this.activities_all.push({
        'title': a[key].title.substring(0, 10) + '..',
        'title_complete': a[key].title,
        'location': a[key].location,
        'difficulty':  a[key].difficulty,
        'img':  a[key].img,
        'cost':  a[key].cost,
        'about_event':  a[key].about_event,
        'provided':  a[key].provided,
        'about_organizer':  a[key].about_organizer,
        'type':  a[key].type,
        'allDay': false,
        'time': a[key].time,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'media': a[key].media,
        'isEvent': true,
        'distance': 0,
        'distance_number': '',
        'day': a[key].day,
        'review':( a[key].review ? a[key].review : 5),
        'reviews': (a[key].reviews ? a[key].reviews : []),
        'nomads': (a[key].nomads ? a[key].nomads : [])
      });
  }

  let today  = moment();
  this.activities_all = this.activities_all.filter( event => !moment(event.day).isBefore(today));

    let b = this.response$;
      for(let key in b){
          this.activities_all.push({
            'title': b[key].title.substring(0, 10) + '..',
            'title_complete': b[key].title,
            'location': b[key].location,
            'description':  b[key].description,
            'cancelation_policy':  b[key].cancelation_policy,
            'categories':  b[key].categories,
            'schedule':  b[key].schedule,
            'img':  b[key].img,
            'class_price':  b[key].class_price,
            'type':  b[key].type,
            'allDay': false,
            'creator':  b[key].creator,
            'index':  b[key].index,
            'media': b[key].media,
            'isEvent': false,
            'distance': 0,
            'distance_number': '',
            'review':( b[key].review ? b[key].review : 5),
            'reviews': (b[key].reviews ? b[key].reviews : []),
            'nomads': (b[key].nomads ? b[key].nomads : []),
            'next_time': '',
            'next_remaining': 0,
            'next_spaces': 0
          });
      }

      for(let i=0; i<this.activities_all.length; i++){
        if(!this.activities_all[i].isEvent){
          let h = this.activities_all[i].schedule;
          let today =  moment().format('dddd');
          let next = 'not today';
          let hours_left = 1000;
          let aux = new Date();
          let remaining;
          let remaining_n;
          let spaces;

          for(let key in h){
           if(today == h[key].day){

             aux.setHours(parseInt(h[key].start_time.charAt(0) + h[key].start_time.charAt(1)));
             aux.setMinutes(parseInt(h[key].start_time.charAt(3) + h[key].start_time.charAt(4)));

             remaining = moment(aux).fromNow();

             if(remaining.indexOf('in ')>-1){
               remaining = remaining.slice(3);
               remaining_n = parseInt(remaining.charAt(0)+remaining.charAt(1));
               if(remaining.indexOf('minutes')==-1) remaining_n += 100;

               if(remaining_n < hours_left){
                 next = h[key].start_time;
                 hours_left = remaining_n;
                 spaces = h[key].spaces_available;
               }
             }

           }
          }
          if(next != 'not today'){
            let aux2 = new Date();
            aux2.setHours(parseInt(next.charAt(0) + next.charAt(1))-1);
            aux2.setMinutes(parseInt(next.charAt(3) + next.charAt(4)));
            next = moment(aux2).format('LT');
          }


          this.activities_all[i].next_time = next;
          this.activities_all[i].next_remaining = hours_left;
          this.activities_all[i].next_spaces = spaces;
        }
      }

   this.getFiltersP();
   console.log(this.activities_all);
   if(!this.done_g) this.populateMap();
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


  ionViewDidLoad(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
    });
    this.loadMap();
  }


    loadMap(){

      this.geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker();
      }, (err) => {
        console.log(err);
      });

    }

    addMarker(){
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter(),
        icon: 'https://firebasestorage.googleapis.com/v0/b/dev-nomads.appspot.com/o/isotipo_nomu.png?alt=media&token=ebb66981-09d6-4dd9-bcd3-8915e4b16581'
      });

      let content = "<h4>Here you are!</h4>";
      //let content = context.toDataUrl()
      this.addInfoWindow(marker, content);
   }

   addInfoWindow(marker, content){

      let infoWindow = new google.maps.InfoWindow({
        content: content
      });

      google.maps.event.addListener(marker, 'click', () => {
        //infoWindow.open(this.map, marker);
      });
      this.getActivities();
    }

}
