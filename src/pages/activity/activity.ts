import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import { BookPage } from '../book/book';

/**
 * Generated class for the ActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {
public general_loader: any;
public activity_data: any =[];
public users$: any;
public noms_balance: any;

//For the activities
public response$: any;
public nomads_joined: any = [];

public temp_schedule: any = [];

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
    this.activity_data = this.navParams.get('Activity');
    this.formatSchedule();
    console.log(this.activity_data)
  }

  isOwner(){
    return this.activity_data.creator == firebase.auth().currentUser.uid;
  }

  formatSchedule(){
   let a = this.activity_data.schedule;

   for(let key in a){
     if(a[key].day == 'Monday') a[key].order = 1;
     else if(a[key].day == 'Tuesday') a[key].order = 2;
      else if(a[key].day == 'Wednesday') a[key].order = 3;
       else if(a[key].day == 'Thursday') a[key].order = 4;
        else if(a[key].day == 'Friday') a[key].order = 5;
         else if(a[key].day == 'Saturday') a[key].order = 6;
          else if(a[key].day == 'Sunday') a[key].order = 7;
   }

    this.temp_schedule = this.activity_data.schedule.sort(function(a, b){
      var keyA = a.order,
          keyB = b.order;
       // Compare the 2 dates
       if(keyA < keyB) return -1;
       if(keyA > keyB) return 1;
       return 0;
    });

    console.log(this.temp_schedule);
  }

  confirmEdit(){
    console.log('clicked k');
    this.alertCtrl.create({
      title: 'Do you want to edit this activity?',
      message:  'You can edit the info, schedule and location',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {

          }
        },
        {
          text: 'Edit',
          handler: () => {

          }
        }
      ]
    }).present();
  }

  openBook(){
    if(this.activity_data.creator != firebase.auth().currentUser.uid){
      if(parseInt(this.activity_data.class_price) == 0 || parseInt(this.noms_balance) > parseInt(this.activity_data.class_price)){
        let modal = this.modalCtrl.create(BookPage, {'Activity': this.activity_data});
            modal.onDidDismiss( data => {
              if(data && data.go) this.navCtrl.parent.select(3);
            });
         modal.present();
      }
      else{
        this.alertCtrl.create({
          title: 'Not enough Noms',
          message: 'You need to buy more noms to join this activity.',
          buttons: ['Ok']
        }).present();
      }
    }
    else{
      this.alertCtrl.create({
        title: 'Cant join',
        message: 'It seems like you created this activity, you cant join as an attendant!',
        buttons: ['Ok']
      }).present();
    }

  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
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
    this.af.object('Activities/'+this.activity_data.index+'/nomads').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();

      this.nomads_joined = [];
      this.convertNomads();
    });

    this.loadMap();
  }

  convertNomads(){
    let a = this.response$;
    for(let key in a){
      if(a[key].index == firebase.auth().currentUser.uid){
        this.nomads_joined.push({
          'index': a[key].index,
          'day': a[key].day,
          'time': a[key].time,
          'date': a[key].date
        });
      }
    }
  }

  getEnd(inicio, dura){
    let aux = parseInt(inicio.slice(0, 2)) + dura;
    aux = aux.toString();
    aux = aux.length < 2 ? '0'+aux : aux;
    return aux + inicio.slice(2);
  }

  loadMap(){


        let geocoder = new google.maps.Geocoder();
        let address = 'Sebastian el Cano 100 Del Valle San Luis Potosi';
        let vm = this;

        geocoder.geocode( { 'address' : this.activity_data.location }, function( results, status ) {
           if( status == google.maps.GeocoderStatus.OK ) {

             let mapOptions = {
               center: results[0].geometry.location,
               zoom: 15,
               mapTypeId: google.maps.MapTypeId.ROADMAP,
               disableDefaultUI: true
             }

             vm.map = new google.maps.Map(vm.mapElement.nativeElement, mapOptions);
             vm.addMarker();

           } else {
             vm.general_loader.dismiss();
              //alert( 'Geocode was not successful for the following reason: ' + status );
           }
       } );


  }

  isAlready(){
    let aux = this.nomads_joined.filter(a => a.date == this.activity_data.day && a.time == this.activity_data.time);
    return aux.length > 0;
  }

  addMarker(){

let marker = new google.maps.Marker({
  map: this.map,
  animation: google.maps.Animation.DROP,
  position: this.map.getCenter()
});

let content = "<h4>This is the location!</h4>";
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
this.general_loader.dismiss();
}

}
