import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { ChatsPage } from '../chats/chats';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

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

public friends: any = [];
// public clans$: any;
public amigos: any = [];
public people$: any;

public clans$: any;
public chats_index: any = [];



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
    public socialSharing: SocialSharing,
    public launchNavigator: LaunchNavigator) {
      this.event_data = this.navParams.get('Event');
      console.log(this.event_data);
  }

  goNavigate(){
    this.launchNavigator.navigate(this.event_data.location);
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

 spacesA(){
  return parseInt(this.event_data.spaces_available) > 0;
}

confirmShare(){
  const confirm = this.alertCtrl.create({
    title: 'Share to your clans?',
    message: 'Do you want to share that you joined this event with the clans you are a member?',
    buttons: [
      {
        text: 'Cancel',
        handler: () => {

        }
      },
      {
        text: 'Share!',
        handler: () => {
          this.sharetoClans();
        }
      }
    ]
  });
  confirm.present();
}

// openChat(){
//   this.navCtrl.parent.select(4)
//       .then(()=> {
//         this.navCtrl.parent.getSelected().push(ChatsPage, {'Segmento': 'clans'});
//       });
// }

amiMember(clave){
  let m = this.users$.Clans;
  for(let key in m){
    if(m[key].index == clave) return true;
  }
  return false;
}

addClanSchedule(){
  let c = this.clans$;
  let s;
  for(let key in c){
    if(this.amiMember(c[key].index)){
      s = {'name': this.users$.first_name, 'nomad_index': firebase.auth().currentUser.uid,'title': this.event_data.title, 'index': this.event_data.index, 'day': this.event_data.day, 'time': this.event_data.time, 'date': this.event_data.day};
      this.af.list('Clans/'+c[key].index+'/schedule').push(s);
    }
  }
}

sharetoClans(){
  this.addClanSchedule();
  let c = this.chats_index;
  for(let key in c){
    this.af.list('Chats/'+c[key].index+'/messages').push({
      'senderId': firebase.auth().currentUser.uid,
      'message': 'Hey Everybody! I just joined '+this.event_data.title_complete+'. Join Me!'
    }).then(() => {
      let a = c[key].members;
      for(let key in a){
        if(a[key].index != firebase.auth().currentUser.uid){
          this.af.list('Notifications').push({'title': 'New chat message!', 'subtitle': this.users$.first_name+' just sent a message to your chat!', 'index': a[key].index});
        }
      }
    })
  }
  this.alertCtrl.create({title: 'Succesfully Shared!', subTitle: 'Your clan friends should be joining soon!', buttons: ['Ok']}).present();
  // this.returnTo();
}

  goJoin(){
    if(this.spacesA()){
      if(!this.isBusy()){
        if(!this.isAlready()){
          this.general_loader = null;
          this.general_loader =  this.loadingCtrl.create({
                spinner: 'bubbles',
                 content: 'Loading...'
                });
          this.general_loader.present();

          let new_noms_nomad = parseFloat(this.noms_balance) - parseInt(this.event_data.cost);
          let new_noms_ally = parseFloat(this.ally_balance) + parseInt(this.event_data.cost);

          let t_id = this.generateUUID();
          console.log(new_noms_nomad);
          console.log(new_noms_ally);

          //Decrease the noms balance in the user db
          this.af.list('Users').update(firebase.auth().currentUser.uid, {'noms': new_noms_nomad});

          //Increase the noms balance in the ally db
          this.af.list('Users').update(this.event_data.creator, {'noms': new_noms_ally});

          //Update user schedule with recently added item
          let schedule_item = {'activity_id': this.event_data.index, 'day': moment(this.event_data.day).format('dddd'), 'time': this.event_data.time, 'date': this.event_data.day, 't_id': t_id};
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
          let chat_ref = {'index': chat_index, 'activity_index': this.event_data.index};
          this.af.list('Users/'+this.event_data.creator+'/Chats').update(chat_index, chat_ref);
          this.af.list('Users/'+firebase.auth().currentUser.uid+'/Chats').update(chat_index, chat_ref);

          //Update spaces available for this schedule
          this.af.list('Events/').update(this.event_data.index, {
            'spaces_available': parseInt(this.event_data.spaces_available) - 1
          })


          // //Save a description of the transaction

          let sender_data = {'index': firebase.auth().currentUser.uid, 'amount': this.event_data.cost, 'pre_balance': this.noms_balance, 'after_balance': parseFloat(this.noms_balance) - parseInt(this.event_data.cost)};
          let receiver_data = {'index': this.event_data.creator, 'amount': this.event_data.cost, 'pre_balance': this.ally_balance, 'after_balance': parseFloat(this.ally_balance) + parseInt(this.event_data.cost)};
          let transaction = {'date': new Date(), 'index': t_id, 'amount': this.event_data.cost, 'type': 'activity', 'sender_id': firebase.auth().currentUser.uid, 'receiver_id': this.event_data.creator, 'sender': sender_data, 'receiver': receiver_data, 'activity_id': this.event_data.index};
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
                  message: 'You can find a chat room in your profile between you and this event creator in case of questions. It will expire after the event',
                  buttons: [
                    {
                    text: 'Ok',
                    handler: () =>{

                    }
                  },
                  {
                  text: 'Share',
                  handler: () =>{
                    this.shareGeneral();
                  }
                },
                ]
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
    else{
      this.alertCtrl.create({
        title: 'No spaces available!',
        message: 'There are no spaces available for this event, try another one!',
        buttons: ['Ok']
      }).present();
    }

  }

  canJoin(){
    if(parseInt(this.event_data.cost) == 0 || parseInt(this.noms_balance)+1 > parseInt(this.event_data.cost)){
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

  getClans(){
    this.af.object('Clans').snapshotChanges().subscribe(action => {
      this.clans$ = action.payload.val();
      this.getFriends();
      this.getMines();
    });
  }

  inClan(clave){
    let f = this.users$.Clans;
    for(let key in f){
      if(f[key].index == clave) return true;
    }
    return false;
  }

  getMines(){
    let c = this.clans$;
    for(let key in c){
      if(this.inClan(c[key].index)){
        this.chats_index.push({'index': c[key].chat, 'members': c[key].members});
      }
    }
    console.log(this.chats_index);
  }

  shareGeneral(){
    this.socialSharing.share('Hey Everybody! I just joined the event '+this.event_data.title_complete+'. Join Me on nōmu!', 'Nomads!')
        .then((entries) =>{
          console.log('success ', +JSON.stringify(entries));
        })
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

  makeAmigo(amigo){
        this.amigos.push({
          'index': amigo.index,
          'name': this.getName(amigo.index),
          'initial': this.getName(amigo.index).charAt(0),
          'img': this.getImg(amigo.index)
        });
  }

  getImg(clave){
    let p = this.people$;
    for(let key in p){
      if(p[key].index == clave) return p[key].img;
    }
    return '';
  }

  getName(clave){
    let p = this.people$;
    for(let key in p){
      if(p[key].index == clave) return p[key].first_name + ' ' + p[key].last_name;
    }
    return '';
  }

  getFriends(){
    this.amigos = [];
    let c = this.clans$;
    for(let key in c){
      if(this.inClan(c[key].index)) this.makeFriends(c[key].members);
    }

    let a = this.event_data.nomads;
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
      this.getClans();
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
