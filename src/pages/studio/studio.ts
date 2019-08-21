import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ActivityPage } from '../activity/activity';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the StudioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-studio',
  templateUrl: 'studio.html',
})
export class StudioPage {

  public general_loader: any;
  public studio_data: any = [];
  public segment: any = 'classes';

  public response$: any;
  public activities: any = [];
  public days: any = [
    {
      'day': 'Monday',
      'ab': 'Mon',
      'selected': true,
      'number': 0
    },
    {
      'day': 'Tuesday',
      'ab': 'Tue',
      'selected': false,
      'number': 1
    },
    {
      'day': 'Wednesday',
      'ab': 'Wed',
      'selected': false,
      'number': 2
    },
    {
      'day': 'Thursday',
      'ab': 'Thu',
      'selected': false,
      'number': 3
    },
    {
      'day': 'Friday',
      'ab': 'Fri',
      'selected': false,
      'number': 4
    },
    {
      'day': 'Saturday',
      'ab': 'Sat',
      'selected': false,
      'number': 5
    },
    {
      'day': 'Sunday',
      'ab': 'Sun',
      'selected': false,
      'number': 6
    },
  ];
  public selected: any = 0;

  @ViewChild('map') mapElement: ElementRef;
   map: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public sanitizer: DomSanitizer,
    public modalCtrl: ModalController,
    public launchNavigator: LaunchNavigator,
    public actionSheetCtrl: ActionSheetController,
    public socialSharing: SocialSharing) {
      this.studio_data = this.navParams.get('Studio');
      if(this.studio_data.logo == '') this.studio_data.logo = 'https://firebasestorage.googleapis.com/v0/b/dev-nomads.appspot.com/o/nomu%20blanco%20333%20(1).png?alt=media&token=54ee504d-91b8-4eaf-a637-27e59a3de25b';
      console.log(this.studio_data);
  }

  getClass(element){
    return element == this.selected ? 'day' : 'day no';
  }

  changeSelected(element){
    this.selected = element;
  }

  isSameDay(dia){
    let hoy = moment().add(this.selected-1, 'days').format("MMM Do YY");
    return hoy == moment(dia).format("MMM Do YY")
  }

  goNavigate(){
    this.launchNavigator.navigate(this.studio_data.location);
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  existsA(indice){
    for(let key in this.studio_data.activities){
      if(this.studio_data.activities[key].index == indice) return true;
    }
    return false;
  }

  convertActivities(){
    let a = this.response$;
    for(let key in a){
      if(this.existsA(a[key].index)){
        if(a[key].schedule){
          for(let lla in a[key].schedule){
            let n = '';
            if(a[key].nomads){
              console.log(a[key].nomads);
              //n = b[key].nomads.filter( a => this.hacerCosa(a.date, this.markStart(b[key].schedule[lla].day, b[key].schedule[lla].start_time)));
              let spaces = Object.keys(n).length;
            }
            this.activities.push({
              'title': a[key].title,
              'title_complete': a[key].title,
              'location': a[key].location,
              'description':  a[key].description,
              'useful_notes': (a[key].useful_notes ? a[key].useful_notes : ''),
              'cancelation_policy':  a[key].cancelation_policy,
              'class_price':  a[key].class_price,
              'fee':  a[key].fee,
              'categories':  a[key].categories,
              'startTime': this.markStart(a[key].schedule[lla].day, a[key].schedule[lla].start_time),
              'schedule':  a[key].schedule,
              'media':  a[key].media,
              'nomads': (a[key].nomads ? a[key].nomads : []),
              'img':  a[key].img,
              'creator':  a[key].creator,
              'index':  a[key].index,
              'isEvent': false,
              'review': (a[key].review ? a[key].review : 5),
              'reviews': (a[key].reviews ? a[key].reviews : []),
              'studio': (a[key].studio ? a[key].studio : '')
            });

          }
        }

      }
        }

    if(this.general_loader) this.general_loader.dismiss();
    console.log(this.activities);
  }

  isDespues(fecha){
    let today  = moment();
    return moment(fecha).isBefore(today);
  }

  markStart(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    let ayuda = moment(inicio, 'dddd').toDate();
    ayuda.setHours(t);
    ayuda.setMinutes(m);

    //if(this.isDespues(ayuda)) ayuda = (moment(ayuda).add(7, 'days')).toDate();
    //ayuda = moment(ayuda).toDate();

    return ayuda;
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
    //this.loadMap();
  }

  loadMap(){


        let geocoder = new google.maps.Geocoder();
        let address = 'Sebastian el Cano 100 Del Valle San Luis Potosi';
        let vm = this;

        geocoder.geocode( { 'address' : this.studio_data.location }, function( results, status ) {
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

  onEventSelected(event) {
    console.log(event);
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');


    let alert = this.alertCtrl.create({
      title: '' + event.title_complete,
      message: 'From: ' + start + '<br>To: ' + end,
      buttons: [
        {
          text: 'Full class',
          handler: () => {
            //this.seeDetails(event);
          }
        },
        {
          text: 'View Details',
          handler: () => {
            this.seeDetails(event);
          }
        },
        {
          text: 'View Assistants',
          handler: () => {
            //this.seeDetails(event);
          }
        }
      ]
    })
    alert.present();

  }

  shareGeneral(act){
    this.socialSharing.share('Hey Everybody! Check out this activity '+act.title_complete+'. Join Me on nōmu! http://onelink.to/gztekd', 'Nomads!')
        .then((entries) =>{
          console.log('success ', +JSON.stringify(entries));
        })
  }

  presentActionSheet(e){
    const actionSheet = this.actionSheetCtrl.create({
  title: 'Choose an Option',
  buttons: [
    {
      text: 'Share',
      handler: () => {
        this.shareGeneral(e);
      }
    },
    {
      text: 'View Service Card',
      handler: () => {
       this.seeDetails(e);
      }
    },{
      text: 'Back',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }
  ]
});
actionSheet.present();
}

  seeDetails(a){
      this.navCtrl.push(ActivityPage, {'Activity': a});
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
