import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import * as moment from 'moment';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser'
import { WalletPage } from '../wallet/wallet';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import { ReviewsPage } from '../reviews/reviews';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendario',
  templateUrl: 'calendario.html',
})
export class CalendarioPage {
  public general_loader: any;
  public eventSource = [];
  public viewTitle: string;
  public selectedDay = new Date();
  public isToday: any;

  //For the user
  public users$: any;
  public noms_balance: any = [];
  public nomad_schedule: any = [];

  public response$: any;
  public e_response$: any;
  public activities_all = [];

  public calendar = {
   mode: 'month',
   currentDate: new Date()
 };
 public type: any;

 public past_events: any = [];
 public show_pop: any;



  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public modalCtrl: ModalController) {
    this.type = localStorage.getItem('Tipo');
    let time = new Date();
    let time2 = time.setHours(time.getHours()+2);

    this.activities_all.push({
      'title_complete': 'Today',
      'activity_id': '',
      'startTime': time,
      'endTime': time,
      'allDay': false
    });

    this.alertCtrl.create({
      title: 'Welcome to your calendar!',
      message: 'Wanna know how many spots are left in your classes? Click in any of them to see!',
      buttons: ['Ok']
    }).present();
  }

  giveReview(evento){
    let modal = this.modalCtrl.create(ReviewsPage, {'Activity': evento});
    modal.present();
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  testWallet(){
   this.navCtrl.parent.select(4);
   setTimeout(() => {this.navCtrl.parent.getSelected().push(WalletPage)}, 500);
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

    if(this.isDespues(ayuda)) ayuda = (moment(ayuda).add(7, 'days')).toDate();
    //ayuda = moment(ayuda).toDate();

    return ayuda;
  }

  markEnd(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    let ayuda = moment(inicio, 'dddd').toDate();
    ayuda.setHours(t+2);
    ayuda.setMinutes(m);

    if(this.isDespues(ayuda)) ayuda = (moment(ayuda).add(7, 'days')).toDate();
    //ayuda = moment(ayuda).toDate();


    return ayuda;
  }

  checkExist(clave){
     console.log(this.nomad_schedule.length);
    for(let i=0; i<this.nomad_schedule.length; i++){
      if(this.nomad_schedule[i].activity_id == clave){
        return true;
      }
    }
    return false;
  }

  checkExistE(clave, llave, review){
    let a = this.e_response$;
    let aux;
    for(let key in a){
      if(a[key].index == clave){
        let aux2 = {
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
          'startTime': this.markStart(a[key].day, a[key].time),
          'endTime': this.markEnd(a[key].day, a[key].time),
          'allDay': false,
          'time': a[key].time,
          'nomads': (a[key].nomads != undefined ? a[key].nomads : []),
          'creator':  a[key].creator,
          'index':  a[key].index,
          // 'media': a[key].media,
          'isEvent': true,
          'clave': llave,
          'clave_nomada': this.getClave(a[key].nomads),
          'reviewed': (review != undefined ? review : false),
          'review':( a[key].review ? a[key].review : 5),
          'reviews': (a[key].reviews ? a[key].reviews : [])
        }
        return aux2;
      }
    }
    return aux;
  }

  isMine(clave){
    let a = this.users$.Activities_created;
    console.log(a);
    for(let key in a){
      if(a[key].index == clave) return true;
    }
    return false;
  }

  checkExistA(){
    let b = this.response$;
    console.log(b);
    for(let key in b){
      if(this.isMine(b[key].index)){
        if(b[key].schedule){
          for(let lla in b[key].schedule){
            this.activities_all.push({
              'title': b[key].title.substring(0, 10) + '..',
              'title_complete': b[key].title,
              'location': b[key].location,
              'description':  b[key].description,
              'useful_notes': (b[key].useful_notes ? b[key].useful_notes : ''),
              'class_price': b[key].class_price,
              'cancelation_policy':  b[key].cancelation_policy,
              'categories':  b[key].categories,
              'schedule':  b[key].schedule,
              'img':  b[key].img,
              'cost':  b[key].cost,
              'type':  b[key].type,
              'startTime': this.markStart(b[key].schedule[lla].day, b[key].schedule[lla].start_time),
              'endTime': this.markEnd(b[key].schedule[lla].day, b[key].schedule[lla].start_time),
              'allDay': '',
              'time': b[key].time,
              'nomads': (b[key].nomads != undefined ? b[key].nomads : []),
              'creator':  b[key].creator,
              'index':  b[key].index,
              // 'media': b[key].media,
              'isEvent': false,
              'clave_nomada': this.getClave(b[key].nomads),
              'review':( b[key].review ? b[key].review : 5),
              'reviews': (b[key].reviews ? b[key].reviews : []),
              'spaces_available': b[key].schedule[lla].spaces_available
          });
          }
        }
      }
    }
  }

  getClave(nomadas){
    for(let key in nomadas){
      if(nomadas[key].index == firebase.auth().currentUser.uid){
        return key;
      }
    }
    return '';
  }

  convertActivities(){

    for(let i=0; i<this.nomad_schedule.length; i++){
      if(this.checkExistE(this.nomad_schedule[i].activity_id, this.nomad_schedule[i].key, this.nomad_schedule[i].reviewed) != undefined){

        this.activities_all.push(this.checkExistE(this.nomad_schedule[i].activity_id, this.nomad_schedule[i].key, this.nomad_schedule[i].reviewed));
      }
    }

    this.checkExistA();

   console.log(this.activities_all);
   console.log(this.past_events);
  }

  getEvents(){
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.activities_all = [];
      this.convertActivities();
    });
  }

  seeDetails(a){
    if(a.isEvent){
      this.navCtrl.push(EventPage, {'Event': a});
    }
    else{
      this.navCtrl.push(ActivityPage, {'Activity': a});
    }
  }

  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.getEvents();
    });
  }

  ionViewDidLoad() {
    this.show_pop = true;
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();

    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();

      this.noms_balance = this.users$.noms;
      this.nomad_schedule = [];
      this.convertSchedule();
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
          'date': a[key].date,
          'key': key,
          'reviewed': a[key].reviewed
        });
    }
    console.log(this.nomad_schedule);
    this.getActivities();
    if(this.general_loader) this.general_loader.dismiss();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onCurrentDateChanged(event:Date) {
       var today = new Date();
       today.setHours(0, 0, 0, 0);
       event.setHours(0, 0, 0, 0);
       this.isToday = today.getTime() === event.getTime();
   }

   markDone(){
     this.general_loader.dismiss();

     this.alertCtrl.create({
       title: 'Removed succesfully!',
       message: 'The event or activity was removed succesfully from your schedule!',
       buttons: ['Ok']
     }).present();
   }

   getBack(evento){
     if(evento.isEvent){
       this.af.list('Users/').update(firebase.auth().currentUser.uid, {
         'noms': parseInt(this.noms_balance) + parseInt(evento.cost)
       }).then(()=>{
         this.goAhead(evento);
       });
     }
     else{
       this.af.list('Users/').update(firebase.auth().currentUser.uid, {
         'noms': parseInt(this.noms_balance) + parseInt(evento.class_price)
       }).then(()=>{
         this.goAhead(evento);
       });
     }
   }

   goAhead(evento){
     this.general_loader = this.loadingCtrl.create({
       spinner: 'bubbles',
       content: 'Removing..'
     });
     this.general_loader.present();

    //Quitarlo del schedule de la persona
    this.af.list('Users/'+firebase.auth().currentUser.uid+'/schedule/'+evento.clave).remove();
    if(evento.isEvent) this.af.list('Events/'+evento.index+'/nomads/'+evento.clave_nomada).remove().then(()=>{this.markDone()});
    else this.af.list('Activities/'+evento.index+'/nomads/'+evento.clave_nomada).remove().then(()=>{this.markDone()});
   }

   confirmCancelation(evento){
     if(evento.cancelation_policy){
       let d = new Date();
       let dif = moment(evento.startTime).fromNow();

       //dif = (dif.indexOf('hours') || dif.indexOf('hour'));
       let dif2 = (dif.indexOf('days') || dif.indexOf('day'));

      if(dif2 > -1){
        this.alertCtrl.create({
          title: 'Are you sure you want to remove '+evento.title_complete+' from your schedule?',
          buttons: [
            {
              text: 'Cancel',
              handler: () => {

              }
            },
            {
              text: 'Remove',
              handler: () => {
                this.getBack(evento);
              }
            }
          ]
        }).present();
      }
      else{
        this.alertCtrl.create({
          title: 'Are you sure you want to remove '+evento.title_complete+' from your schedule?',
          message: 'By doing this you wont get a refund of your noms',
          buttons: [
            {
              text: 'Cancel',
              handler: () => {

              }
            },
            {
              text: 'Remove',
              handler: () => {
                this.goAhead(evento);
              }
            }
          ]
        }).present();
      }
     }
     else{
       this.alertCtrl.create({
         title: 'Are you sure you want to remove '+evento.title_complete+' from your schedule?',
         message: 'By doing this you wont get a refund of your noms',
         buttons: [
           {
             text: 'Cancel',
             handler: () => {

             }
           },
           {
             text: 'Remove',
             handler: () => {
               this.goAhead(evento);
             }
           }
         ]
       }).present();
     }
   }

   hacerCosa(fecha, fecha2){
     let b = moment(fecha);
     return b.diff(fecha2, 'days') == 0;
   }

  onEventSelected(event) {
    console.log(event);
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    let n = event.nomads.filter( a => this.hacerCosa(a.date, event.startTime));
    let spaces = Object.keys(n).length;

    let alert = this.alertCtrl.create({
      title: '' + event.title_complete,
      subTitle: spaces + '/'+ event.spaces_available + ' spaces taken',
      message: 'From: ' + start + '<br>To: ' + end,
      buttons: [
        {
          text: 'View Details',
          handler: () => {
            this.seeDetails(event);
          }
        }]
    })
    alert.present();

  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

}
