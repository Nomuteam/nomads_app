import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { WalletPage } from '../wallet/wallet';

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

  @ViewChild('map') mapElement: ElementRef;
   map: any;

  constructor( public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public geolocation: Geolocation) {

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

  populateMap(){
    let geocoder = new google.maps.Geocoder();
    let address = 'Sebastian el Cano 100 Del Valle San Luis Potosi';
    let vm = this;

    for(let i=0; i<this.activities_all.length; i++){


      geocoder.geocode( { 'address' : vm.activities_all[i].location }, function( results, status ) {
         if( status == google.maps.GeocoderStatus.OK ) {
           let marker = new google.maps.Marker({
             map: vm.map,
             animation: google.maps.Animation.DROP,
             position: vm.auxiliar
           });
           let content = "<h4>hola k </h4>";

           let infoWindow = new google.maps.InfoWindow({
             content: content
           });

           google.maps.event.addListener(marker, 'click', () => {
             infoWindow.open(vm.map, marker);
           });
         } else {
            alert( 'Geocode was not successful for the following reason: ' + status );
         }
     });
    }

    this.general_loader.dismiss();

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
        'type':  a[key].type,
        'allDay': false,
        'time': a[key].time,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'media': a[key].media,
        'isEvent': true
      });
  }

    let b = this.response$;
      for(let key in b){
          this.activities_all.push({
            'title': b[key].title.substring(0, 10) + '..',
            'title_complete': b[key].title,
            'location': b[key].location,
            'difficulty':  b[key].difficulty,
            'img':  b[key].img,
            'cost':  b[key].cost,
            'type':  b[key].type,
            'allDay': false,
            'time': b[key].time,
            'creator':  b[key].creator,
            'index':  b[key].index,
            'media': b[key].media,
            'isEvent': false
          });
      }

   console.log(this.activities_all);
   this.populateMap();
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
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true,
          styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
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
        position: this.map.getCenter()
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
        infoWindow.open(this.map, marker);
      });
      this.getActivities();
    }

}
