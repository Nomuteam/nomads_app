import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
public general_loader: any;
public event_data: any = [];

//For the user
public users$: any;
public noms_balance: any = [];
public nomad_schedule: any = [];
public name: any = '';

//For the activity_owner
public owners$: any;
public ally_balance: any = [];

//For the activities
public response$: any;
public nomads_joined: any = [];

public favorites: any = [];



@ViewChild('map') mapElement: ElementRef;
 map: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public sanitizer: DomSanitizer,
    public modalCtrl: ModalController) {
      this.event_data = this.navParams.get('Event');
      console.log(this.event_data);
  }

  isOwner(){
    return this.event_data.creator == firebase.auth().currentUser.uid;
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  formatDate(){
    return moment(this.event_data.day).format('LL');
  }

  showConfirm() {
   const confirm = this.alertCtrl.create({
     title: 'Join this event?',
     message: 'You will be charged '+this.event_data.cost+' noms from your balance',
     buttons: [
       {
         text: 'Cancel',
         handler: () => {

         }
       },
       {
         text: 'Proceed',
         handler: () => {
           this.goJoin();
         }
       }
     ]
   });
   confirm.present();
 }

  goJoin(){
    if(!this.isBusy()){
      if(!this.isAlready()){
        this.general_loader = null;
        this.general_loader =  this.loadingCtrl.create({
              spinner: 'bubbles',
               content: 'Loading...'
              });
        this.general_loader.present();

        let new_noms_nomad = parseInt(this.noms_balance) - parseInt(this.event_data.cost);
        let new_noms_ally = parseInt(this.ally_balance) + parseInt(this.event_data.cost);

        console.log(new_noms_nomad);
        console.log(new_noms_ally);

        //Decrease the noms balance in the user db
        this.af.list('Users').update(firebase.auth().currentUser.uid, {'noms': new_noms_nomad});

        //Increase the noms balance in the ally db
        this.af.list('Users').update(this.event_data.creator, {'noms': new_noms_ally});

        //Update user schedule with recently added item
        let schedule_item = {'activity_id': this.event_data.index, 'day': moment(this.event_data.day).format('dddd'), 'time': this.event_data.time, 'date': this.event_data.day};
        this.af.list('Users/'+firebase.auth().currentUser.uid+'/schedule').push(schedule_item);

        //Update activities attendants with recently joined user
        let attendant = {'index': firebase.auth().currentUser.uid, 'day': moment(this.event_data.day).format('dddd'), 'time': this.event_data.time, 'date': this.event_data.day};
        this.af.list('Events/'+this.event_data.index+'/nomads').push(attendant);

        //Create a chat room with the owner of this activity
        let chat_index = this.generateUUID();
        let chat_members = [{'index': this.event_data.creator},{'index': firebase.auth().currentUser.uid}];
        let chat_expires = moment(this.event_data.day).add(1, 'days').format('YYYY-MM-DD');
        let messages = [{'senderId': 'admin', 'message': 'Welcome to your chat. Ask any question you need about this event!'}];
        let chat_room = {'index': chat_index, 'createdAt': new Date(), 'type': 'other', 'members': chat_members, 'expireDay': chat_expires, 'messages': messages, 'lastMsg': 'Welcome to your chat. Ask any question you need about this event!', 'lastMsg_index': 'admin', 'clanName': '', 'activity_name': this.event_data.title};
        this.af.list('Chats/').update(chat_index, chat_room);

        //Update this chat room index in both the user and the owner object
        let chat_ref = {'index': chat_index};
        this.af.list('Users/'+this.event_data.creator+'/Chats').update(chat_index, chat_ref);
        this.af.list('Users/'+firebase.auth().currentUser.uid+'/Chats').update(chat_index, chat_ref);


        // //Save a description of the transaction
        let t_id = this.generateUUID();
        let sender_data = {'index': firebase.auth().currentUser.uid, 'amount': this.event_data.cost, 'pre_balance': this.noms_balance, 'after_balance': parseInt(this.noms_balance) - parseInt(this.event_data.cost)};
        let receiver_data = {'index': this.event_data.creator, 'amount': this.event_data.cost, 'pre_balance': this.ally_balance, 'after_balance': parseInt(this.ally_balance) + parseInt(this.event_data.cost)};
        let transaction = {'date': new Date(), 'index': t_id, 'amount': this.event_data.cost, 'type': 'activity', 'sender_id': firebase.auth().currentUser.uid, 'receiver_id': this.event_data.creator, 'sender': sender_data, 'receiver': receiver_data};
        this.af.list('transactions').update(t_id, transaction);
        //
        // //Save transaction id in ally db
        let t_reference = {'index': t_id};
        this.af.list('Users/'+firebase.auth().currentUser.uid+'/transactions').update(t_id, t_reference);
        this.af.list('Users/'+this.event_data.creator+'/transactions').update(t_id, t_reference)
            .then(()=>{
              this.af.list('Notifications').push({'title': 'Someone joined your event!', 'subtitle': this.name+' just joined your event '+this.event_data.title_complete, 'index': this.event_data.creator});
              this.alertCtrl.create({
                title: 'You are all set!',
                subTitle: 'Some details..',
                message: 'You can find a chat room in your profile between you and this NeweventPage creator in case of questions. It will expire after the event',
                buttons: ['Ok']
              }).present();
              this.general_loader.dismiss();
              this.navCtrl.parent.select(3);
            });

      }
      else{
        this.alertCtrl.create({
          title: 'Already joined',
          message: 'You already joined this activity in the same exact time and day',
          buttons: ['Ok']
        }).present();
      }
    }
    else{
      this.alertCtrl.create({
        title: 'Tight Schedule',
        message: 'You already have an activity or event in your schedule for the same exact time and day',
        buttons: ['Ok']
      }).present();
    }
  }

  canJoin(){
    if(parseInt(this.event_data.cost) == 0 || parseInt(this.noms_balance) > parseInt(this.event_data.cost)){
      this.showConfirm();
    }
    else{
      this.alertCtrl.create({
        title: 'Not enough Noms',
        message: 'You need to buy more noms to join this event.',
        buttons: ['Ok']
      }).present();
    }
  }

  changeFav(){
    if(this.isFavorite()){
      this.af.list('Users/'+firebase.auth().currentUser.uid+'/favorites/'+this.event_data.index).remove()
          .then(() => {
            this.alertCtrl.create({
              title: 'Removed from Favorites!',
              message: 'This event is no longer one of your favorites',
              buttons: ['Ok']
            }).present();
          })
    }
    else{
      this.af.list('Users/'+firebase.auth().currentUser.uid+'/favorites').update(this.event_data.index, {
        'index': this.event_data.index,
        'type': 'event'
      }).then(() => {
        this.alertCtrl.create({
          title: 'Added to Favorites!',
          message: 'This event is now one of your favorites',
          buttons: ['Ok']
        }).present();
      })
    }
  }

  isFavorite(){
    if(this.favorites != undefined){
      for(let key in this.favorites){
        if(this.favorites[key].index == this.event_data.index){
          return true;
        }
      }
    }
    return false;
  }

  ionViewDidLoad(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.af.object('Users/'+this.event_data.creator).snapshotChanges().subscribe(action => {
      this.owners$ = action.payload.val();

      this.ally_balance = this.owners$.noms;
    });
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
      this.nomad_schedule = [];
      this.name = this.users$.first_name;
      this.favorites = this.users$.favorites;
      this.convertSchedule();
    });
    this.af.object('Events/'+this.event_data.index+'/nomads').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();

      this.nomads_joined = [];
      this.convertNomads();
    });
    this.loadMap();
  }

  convertSchedule(){
    let a = this.users$.schedule;
    for(let key in a){
        this.nomad_schedule.push({
          'activity_id': a[key].activity_id,
          'day': a[key].day,
          'time': a[key].time,
          'date': a[key].date
        });
    }
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

  isAlready(){
    let aux = this.nomads_joined.filter(a => a.date == this.event_data.day && a.time == this.event_data.time);
    return aux.length > 0;
  }

  isBusy(){
    let aux = this.nomad_schedule.filter(a => a.date == this.event_data.day && a.time == this.event_data.time);
    return aux.length > 0;
  }

  loadMap(){

    let geocoder = new google.maps.Geocoder();
    let address = 'Sebastian el Cano 100 Del Valle San Luis Potosi';
    let vm = this;

    geocoder.geocode( { 'address' : this.event_data.location }, function( results, status ) {
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

private generateUUID(): any {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
  var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
   });
  return uuid;
}

}
