import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import { BookPage } from '../book/book';
import * as moment from 'moment';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';


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
public favorites: any = [];

public friends: any = [];
public clans$: any;
public amigos: any = [];
public people$: any;

public time_helper: any = [
  {
    'title': 'Monday',
    'times': []
  },
  {
    'title': 'Thursday',
    'times': []
  },
  {
    'title': 'Wednesday',
    'times': []
  },
  {
    'title': 'Tuesday',
    'times': []
  },
  {
    'title': 'Friday',
    'times': []
  },
  {
    'title': 'Saturday',
    'times': []
  },
  {
    'title': 'Sunday',
    'times': []
  },
];

    @ViewChild('map') mapElement: ElementRef;
     map: any;

  constructor( public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public sanitizer: DomSanitizer,
    public modalCtrl: ModalController,
    public launchNavigator: LaunchNavigator) {
    this.activity_data = this.navParams.get('Activity');
    this.formatSchedule();
    console.log(this.activity_data)
  }

  goNavigate(){
    this.launchNavigator.navigate(this.activity_data.location);
  }

  isOwner(){
    return this.activity_data.creator == firebase.auth().currentUser.uid;
  }

  fillHelper(){
    let a = this.temp_schedule;

    for(let key in a){
      if(a[key].day == 'Monday') this.time_helper[0].times.push({'start_time': a[key].start_time, 'duration': a[key].duration});
      else if(a[key].day == 'Tuesday') this.time_helper[1].times.push({'start_time': a[key].start_time, 'duration': a[key].duration});
      else if(a[key].day == 'Wednesday') this.time_helper[2].times.push({'start_time': a[key].start_time, 'duration': a[key].duration});
      else if(a[key].day == 'Thursday') this.time_helper[3].times.push({'start_time': a[key].start_time, 'duration': a[key].duration});
      else if(a[key].day == 'Friday') this.time_helper[4].times.push({'start_time': a[key].start_time, 'duration': a[key].duration});
      else if(a[key].day == 'Saturday') this.time_helper[5].times.push({'start_time': a[key].start_time, 'duration': a[key].duration});
      else if(a[key].day == 'Sunday') this.time_helper[6].times.push({'start_time': a[key].start_time, 'duration': a[key].duration});
    }

    console.log(this.time_helper);
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

    this.fillHelper();
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

  openBook(dia, tiempo){
    if(this.activity_data.creator != firebase.auth().currentUser.uid){
      if(parseInt(this.activity_data.class_price) == 0 || parseInt(this.noms_balance) > parseInt(this.activity_data.class_price)){
        let modal = this.modalCtrl.create(BookPage, {'Activity': this.activity_data, 'Day': dia, 'Time': tiempo});
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

  changeFav(){
    if(this.isFavorite()){
      this.af.list('Users/'+firebase.auth().currentUser.uid+'/favorites/'+this.activity_data.index).remove()
          .then(() => {
            this.alertCtrl.create({
              title: 'Removed from Favorites!',
              message: 'This activity is no longer one of your favorites',
              buttons: ['Ok']
            }).present();
          })
    }
    else{
      this.af.list('Users/'+firebase.auth().currentUser.uid+'/favorites').update(this.activity_data.index, {
        'index': this.activity_data.index,
        'type': 'activity'
      }).then(() => {
        this.alertCtrl.create({
          title: 'Added to Favorites!',
          message: 'This activity is now one of your favorites',
          buttons: ['Ok']
        }).present();
      })
    }
  }

  isFavorite(){
    if(this.favorites != undefined){
      for(let key in this.favorites){
        if(this.favorites[key].index == this.activity_data.index){
          return true;
        }
      }
    }
    return false;
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  getClans(){
    this.af.object('Clans').snapshotChanges().subscribe(action => {
      this.clans$ = action.payload.val();
      this.getFriends();
    });
  }

  inClan(clave){
    let f = this.users$.Clans;
    for(let key in f){
      if(f[key].index == clave) return true;
    }
    return false;
  }

  makeFriends(ami){
    for(let key in ami){
      this.friends.push({
        'index': ami[key].index
      });
    }
  }

  isFriend(clave){
    let f = this.friends;
    for(let key in f){
      if(f[key].index == clave && clave != firebase.auth().currentUser.uid) return true;
    }
    return false;
  }

  isDespues(fecha){
    let today  = moment();
    return moment(fecha).isBefore(today);
  }

  checkExistAC(clave){
    let a = this.amigos;
    for(let key in a){
      if(a[key].index == clave.index && !this.isDespues(clave.date)) {
        a[key].schedule.push({
          'day': clave.day,
          'date': clave.date,
          'time': clave.time
        })
        return true;
      }
    }
    return false;
  }

  makeAmigo(amigo){
    if(!this.checkExistAC(amigo)){
      if(!this.isDespues(amigo.date)){
        this.amigos.push({
          'index': amigo.index,
          'name': this.getName(amigo.index),
          'initial': this.getName(amigo.index).charAt(0),
          'img': this.getImg(amigo.index),
          'schedule': [{'day': amigo.day, 'date': amigo.date, 'time': amigo.time}]
        });
      }
    }
  }

  getImg(clave){
    let p = this.people$;
    for(let key in p){
      if(p[key].index == clave) return '';
    }
    return '';
  }

  seeDetails(amigo){
    let horas = '<br><br>';
    for(let key in amigo.schedule){
      horas+= '<li>' + amigo.schedule[key].time + ' next <b>' + amigo.schedule[key].day+'</b>';
      horas+= '<br>'
    }
    this.alertCtrl.create({
      'title': 'Friend Going!',
      'subTitle': amigo.name+' is going to this activity!',
      'message': 'He signed up for: '+horas,
      'buttons': ['Ok']
    }).present();
  }

  getName(clave){
    let p = this.people$;
    for(let key in p){
      if(p[key].index == clave) return p[key].first_name + ' ' + p[key].last_name;
    }
    return '';
  }

  getFriends(){
    let c = this.clans$;
    for(let key in c){
      if(this.inClan(c[key].index)) this.makeFriends(c[key].members);
    }

    let a = this.activity_data.nomads;
    for(let key in a){
      if(this.isFriend(a[key].index)) this.makeAmigo(a[key]);
    }

    console.log(this.amigos);
  }

  ionViewDidLoad(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.af.object('Users').snapshotChanges().subscribe(action => {
      this.people$ = action.payload.val();
    });
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
      this.favorites = this.users$.favorites;
      this.getClans();
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
