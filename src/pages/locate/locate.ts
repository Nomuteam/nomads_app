import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController, AlertController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the LocatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-locate',
  templateUrl: 'locate.html',
})
export class LocatePage {
  public general_loader: any;
  @ViewChild('map') mapElement: ElementRef;
   map: any;
   public address: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public geolocation: Geolocation, public viewCtrl: ViewController, public alertCtrl: AlertController) {
    this.address = this.navParams.get('Address');
  }

  goBack(){
    let data = { 'correct': false };
    this.viewCtrl.dismiss(data);
  }

  confirmB(){
    let data = { 'correct': true };
    this.viewCtrl.dismiss(data);
  }

  ionViewDidLoad(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.loadMap();
  }

  loadMap(){

    let geocoder = new google.maps.Geocoder();
    let address = 'Sebastian el Cano 100 Del Valle San Luis Potosi';
    let vm = this;

    geocoder.geocode( { 'address' : this.address }, function( results, status ) {
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
         vm.alertCtrl.create({
           title: 'Address not found',
           message: 'Enter a valid address to locate you',
           buttons: ['Ok']
         }).present();
         vm.goBack();
          //alert( 'Geocode was not successful for the following reason: ' + status );
       }
   } );

  }

  addMarker(){

let marker = new google.maps.Marker({
  map: this.map,
  draggable: true,
  animation: google.maps.Animation.DROP,
  position: this.map.getCenter()
});

let content = "<h4>Location provided</h4>";
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
