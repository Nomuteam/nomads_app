import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

/**
 * Generated class for the BookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {
public general_loader: any;
public section: any = '1';
public selected_day: any = '';
public selected_time: any = '';

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

public activity_data: any;
public schedule: any = [];
public selected_key: any = '';

public c_available: any = '';


  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public viewCtrl: ViewController) {
    this.activity_data = this.navParams.get('Activity');
    this.activity_data.schedule.map(x => this.schedule.filter(a => a.day == x.day).length > 0 ? null : this.schedule.push(x));
    console.log(this.schedule);
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  ionViewDidLoad() {
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();
    this.af.object('Users/'+this.activity_data.creator).snapshotChanges().subscribe(action => {
      this.owners$ = action.payload.val();

      this.ally_balance = this.owners$.noms;
    });
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();

      this.noms_balance = this.users$.noms;
      this.name = this.users$.name;
      this.nomad_schedule = [];
      this.convertSchedule();
    });
    this.af.object('Activities/'+this.activity_data.index+'/nomads').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();

      this.nomads_joined = [];
      this.convertNomads();
      if(this.general_loader) this.general_loader.dismiss();
    });
    console.log(this.noms_balance);
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

  returnTo(){
     this.viewCtrl.dismiss();
  }

  openSchedule(){
    let data = { 'go': true };
    this.viewCtrl.dismiss(data);
  }

  canAdvance(){
    return this.selected_day != '' && this.selected_time != '';
  }

  getDay(){
    return this.selected_day != '' ? this.selected_day : 'Select Day';
  }

  getTime(){
    return this.selected_time != '' ? this.selected_time : 'Select Time';
  }

  getIndexDay(){
    let a = this.activity_data.schedule;
    for(let key in this.activity_data.schedule){
      if(this.activity_data.schedule[key].day == this.selected_day){
        return key;
      }
    }
  }

  isAlready(){
    let aux = this.nomads_joined.filter(a => a.date == this.getReal() && a.time == this.selected_time);
    return aux.length > 0;
  }

  isBusy(){
    let aux = this.nomad_schedule.filter(a => a.date == this.getReal() && a.time == this.selected_time);
    return aux.length > 0;
  }

  showConfirm() {
   const confirm = this.alertCtrl.create({
     title: 'Join this activity?',
     message: 'You will be charged '+this.activity_data.class_price+' noms from your balance',
     buttons: [
       {
         text: 'Cancel',
         handler: () => {

         }
       },
       {
         text: 'Proceed',
         handler: () => {
           this.payNow();
         }
       }
     ]
   });
   confirm.present();
 }

 getReal(){
   let good = '';
   let aux = moment(new Date()).format('YYYY-MM-DD');
   if(this.selected_day == moment(new Date()).format('dddd')){
     let date = new Date();
     date.setHours(parseInt(this.selected_time.slice(0, 2)));
     date.setMinutes(parseInt(this.selected_time.slice(3)));
     if(moment(date).fromNow().charAt(0) == 'i'){
       good = aux;
     }
     else{
       good = moment(aux).add(7, 'days').format('YYYY-MM-DD');
     }
   }
   else{
     let faltan = moment(this.selected_day, 'dddd').fromNow();
     if(faltan.indexOf('hours') > -1 || faltan.indexOf('hour') > -1){
       good = moment(aux).add(1, 'days').format('YYYY-MM-DD');
     }
     else{
       let ai = 5 - parseInt(moment(this.selected_day, 'dddd').format('d'));
       good = moment(aux, 'YYYY-MM-DD').add(ai, 'days').format('YYYY-MM-DD');
     }
   }

   return good;
 }

 spacesA(){

   let a = this.activity_data.schedule;

   for(let key in a){
     if(a[key].day == this.selected_day && a[key].start_time == this.selected_time) this.selected_key = key;
   }

   let aux = this.activity_data.schedule.filter(dia => dia.day == this.selected_day);

   for(let key in aux){
     if(aux[key].start_time == this.selected_time){
       if(parseInt(aux[key].spaces_available) > 0){
         this.c_available = parseInt(aux[key].spaces_available);
         return true;
       }
     }
   }

   return false;
 }

  payNow(){

   if(this.spacesA() && this.selected_key != '' && this.c_available != ''){
     if(!this.isBusy()){
       if(!this.isAlready()){
         this.general_loader = null;
         this.general_loader =  this.loadingCtrl.create({
               spinner: 'bubbles',
                content: 'Loading...'
               });
         this.general_loader.present();

         let new_noms_nomad = parseInt(this.noms_balance) - parseInt(this.activity_data.class_price);
         let new_noms_ally = parseInt(this.ally_balance) + parseInt(this.activity_data.class_price);

         console.log(new_noms_nomad);
         console.log(new_noms_ally);

         //Decrease the noms balance in the user db
         this.af.list('Users').update(firebase.auth().currentUser.uid, {'noms': new_noms_nomad});

         //Increase the noms balance in the ally db
         this.af.list('Users').update(this.activity_data.creator, {'noms': new_noms_ally});

         let date = this.getReal();
         //Update user schedule with recently added item
         let schedule_item = {'activity_id': this.activity_data.index, 'day': this.selected_day, 'time': this.selected_time, 'date': date};
         this.af.list('Users/'+firebase.auth().currentUser.uid+'/schedule').push(schedule_item);

         //Create a chat room with the owner of this activity
         let chat_index = this.generateUUID();
         let chat_members = [{'index': this.activity_data.creator},{'index': firebase.auth().currentUser.uid}];
         let chat_expires = moment(date).add(1, 'days').format('YYYY-MM-DD');
         let messages = [{'senderId': 'admin', 'message': 'Welcome to your chat. Ask any question you need about this activity!'}];
         let chat_room = {'index': chat_index, 'createdAt': new Date(), 'type': 'other', 'members': chat_members, 'expireDay': chat_expires, 'messages': messages, 'lastMsg': 'Welcome to your chat. Ask any question you need about this activity!', 'lastMsg_index': 'admin', 'clanName': '', 'activity_name': this.activity_data.title};
         this.af.list('Chats/').update(chat_index, chat_room);

         //Update this chat room index in both the user and the owner object
         let chat_ref = {'index': chat_index};
         this.af.list('Users/'+this.activity_data.creator+'/Chats').update(chat_index, chat_ref);
         this.af.list('Users/'+firebase.auth().currentUser.uid+'/Chats').update(chat_index, chat_ref);

         //Update spaces available for this schedule
         this.af.list('Activities/'+this.activity_data.index+'/schedule').update(this.selected_key, {
           'spaces_available': this.c_available - 1
         })


         //Update activities attendants with recently joined user
         let attendant = {'index': firebase.auth().currentUser.uid, 'day': this.selected_day, 'time': this.selected_time, 'date': date};
         this.af.list('Activities/'+this.activity_data.index+'/nomads').push(attendant);
         //this.af.list('Activities/'+this.activity_data.index+'/schedule/').update(this.getIndexDay(), attendant);
         //
         // //Save a description of the transaction
         let t_id = this.generateUUID();
         let sender_data = {'index': firebase.auth().currentUser.uid, 'amount': this.activity_data.class_price, 'pre_balance': this.noms_balance, 'after_balance': parseInt(this.noms_balance) - parseInt(this.activity_data.class_price)};
         let receiver_data = {'index': this.activity_data.creator, 'amount': this.activity_data.class_price, 'pre_balance': this.ally_balance, 'after_balance': parseInt(this.ally_balance) + parseInt(this.activity_data.class_price)};
         let transaction = {'date': new Date(), 'index': t_id, 'amount': this.activity_data.class_price, 'type': 'activity', 'sender_id': firebase.auth().currentUser.uid, 'receiver_id': this.activity_data.creator, 'sender': sender_data, 'receiver': receiver_data, 'activity_id': this.activity_data.index};
         this.af.list('transactions').update(t_id, transaction);
         //
         // //Save transaction id in ally db
         let t_reference = {'index': t_id};
         this.af.list('Users/'+firebase.auth().currentUser.uid+'/transactions').update(t_id, t_reference);
         this.af.list('Users/'+this.activity_data.creator+'/transactions').update(t_id, t_reference)
             .then(()=>{
               this.af.list('Notifications').push({'title': 'Someone joined your activity!', 'subtitle': this.name+' just joined your activity '+this.activity_data.title_complete, 'index': this.activity_data.creator});
               this.alertCtrl.create({
                 title: 'In case of questions...',
                 subTitle: 'We just created a chat',
                 message: 'You can find a chat room in your profile between you and this activity creator in case of questions. It will expire after the class',
                 buttons: ['Ok']
               }).present();
               this.section = '2';
             });
         this.general_loader.dismiss();
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
       message: 'There are no spaces available for the selected day and time, try another one!',
       buttons: ['Ok']
     }).present();
   }
  }

  selectTime(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Time');

    let aux = this.activity_data.schedule.filter(dia => dia.day == this.selected_day);
    console.log(aux);

    for(let key in aux){
      alert.addInput({
        type: 'radio',
        label: aux[key].start_time,
        value: aux[key].start_time
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);
        this.selected_time = data;
      }
    });
    alert.present();
  }

  selectDay(){
    this.selected_time = '';
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Day');

    for(let key in this.schedule){
      alert.addInput({
        type: 'radio',
        label: this.schedule[key].day,
        value: this.schedule[key].day
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.selected_day = data;
      }
    });
    alert.present();
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
