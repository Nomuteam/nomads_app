import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController, ActionSheetController } from 'ionic-angular';
import * as moment from 'moment';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser'
import { WalletPage } from '../wallet/wallet';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import { ReviewsPage } from '../reviews/reviews';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
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

  public segment: any = 'upcoming';

  public calendar = {
   mode: 'month',
   currentDate: new Date()
 };
 public type: any;

 public past_events: any = [];
 public show_pop: any;
 public balance_creator: any;
 public week_days : any = [
   {
     'day': 'Monday'
   },
   {
     'day': 'Tuesday'
   },
   {
     'day': 'Wednesday'
   },
   {
     'day': 'Thursday'
   },
   {
     'day': 'Friday'
   },
   {
     'day': 'Saturday'
   },
   {
     'day': 'Sunday'
   }
 ];



  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public modalCtrl: ModalController,
  public actionSheetCtrl: ActionSheetController,
  public launchNavigator: LaunchNavigator,
  public socialSharing: SocialSharing) {
    this.type = localStorage.getItem('Tipo');
    let time = new Date();
    let time2 = time.setHours(time.getHours()+2);

    this.activities_all.push({
      'title_complete': 'Today',
      'activity_id': '',
      'startTime': time,
      'endTime': time,
      'allDay': false
    })
  }

  giveReview(evento){
    let modal = this.modalCtrl.create(ReviewsPage, {'Activity': evento});
    modal.present();
  }

  goNavigate(direc){
    this.launchNavigator.navigate(direc);
  }

  shareGeneral(act){
    this.socialSharing.share('Hey Everybody! I joined '+act.title_complete+'. Join Me on nōmu!', 'Nomads!')
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
      text: 'Get Directions',
      handler: () => {
        this.goNavigate(e.location)
      }
    },
    {
      text: 'View Service Card',
      handler: () => {
       this.seeDetails(e);
      }
    },
    {
      text: 'Cancel Reservation',
      handler: () => {
       this.confirmCancelation(e);
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

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  testWallet(){
   this.navCtrl.parent.select(4);
   setTimeout(() => {this.navCtrl.parent.getSelected().push(WalletPage)}, 500);
  }

  markStart(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    let ayuda = moment(inicio).toDate();

    ayuda.setHours(t);
    ayuda.setMinutes(m);

    return ayuda;
  }

  markEnd(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    let ayuda = moment(inicio).toDate();

    ayuda.setHours(t+2);
    ayuda.setMinutes(m);

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

  checkExistE(clave, llave, review, t_id){
    let a = this.e_response$;
    let aux;
    for(let key in a){
      if(a[key].index == clave){
        let aux2 = {
          'title': a[key].title,
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
          'nomads': (a[key].nomads != undefined ? a[key].nomads : ''),
          'creator':  a[key].creator,
          'index':  a[key].index,
          // 'media': a[key].media,
          'isEvent': true,
          'clave': llave,
          'clave_nomada': this.getClave(a[key].nomads),
          'reviewed': (review != undefined ? review : false),
          'review':( a[key].review ? a[key].review : 5),
          'reviews': (a[key].reviews ? a[key].reviews : []),
          'eventColor': '#2edbac',
          'actual_day': '',
          'day_number': 0,
          't_id': t_id
        }
        return aux2;
      }
    }
    return aux;
  }

  checkExistA(clave, llave, review, t_id){
    let b = this.response$;
    let aux;
    for(let key in b){
      if(b[key].index == clave){
        let aux2 = {
          'title': b[key].title,
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
          'startTime': '',
          'endTime': '',
          'allDay': '',
          'time': b[key].time,
          'nomads': b[key].nomads,
          'creator':  b[key].creator,
          'index':  b[key].index,
          // 'media': b[key].media,
          'isEvent': false,
          'clave': llave,
          'clave_nomada': this.getClave(b[key].nomads),
          'reviewed': (review != undefined ? review : false),
          'review':( b[key].review ? b[key].review : 5),
          'reviews': (b[key].reviews ? b[key].reviews : []),
          'eventColor': '#2edbac',
          'actual_day': '',
          'day_number': 0,
          't_id': t_id
        }
        return aux2;
      }
    }
    return aux;
  }

  getClave(nomadas){
    for(let key in nomadas){
      if(nomadas[key].index == firebase.auth().currentUser.uid){
        return key;
      }
    }
    return '';
  }


  formatoNew(dia){
    console.log(dia);
    return moment(dia).format('LL');
  }

  hayDia(dia){
    return this.activities_all.filter(act => act.actual_day==dia).length > 0;
  }

  convertActivities(){

    for(let i=0; i<this.nomad_schedule.length; i++){
      if(this.checkExistE(this.nomad_schedule[i].activity_id, this.nomad_schedule[i].key, this.nomad_schedule[i].reviewed, this.nomad_schedule[i].t_id) != undefined){
        this.activities_all.push(this.checkExistE(this.nomad_schedule[i].activity_id, this.nomad_schedule[i].key, this.nomad_schedule[i].reviewed, this.nomad_schedule[i].t_id));
      }
      else if(this.checkExistA(this.nomad_schedule[i].activity_id, this.nomad_schedule[i].key, this.nomad_schedule[i].reviewed, this.nomad_schedule[i].t_id) != undefined){
        let ayuda = this.checkExistA(this.nomad_schedule[i].activity_id, this.nomad_schedule[i].key, this.nomad_schedule[i].reviewed, this.nomad_schedule[i].t_id);
        ayuda.startTime = this.markStart(this.nomad_schedule[i].date, this.nomad_schedule[i].time);
        ayuda.endTime = this.markEnd(this.nomad_schedule[i].date, this.nomad_schedule[i].time);
        ayuda.allDay = false;
        ayuda.time = moment(ayuda.startTime).format('LT');
        console.log(ayuda);
        this.activities_all.push(ayuda);
      }
    }
    // let start = moment(event.startTime).format('LLLL');
    // let end = moment(event.endTime).format('LLLL');
   let today  = moment();
   let dia;
   for(let key in this.activities_all){
     dia = moment(this.activities_all[key].startTime).format('dddd');
     this.activities_all[key].actual_day = dia;
     this.activities_all[key].day_number = this.getNumberDay(dia)
   }

   if(this.show_pop){
     this.past_events = this.activities_all.filter( event => moment(moment(event.startTime).format('LLLL')).isBefore(today)&&!event.reviewed);
     if(this.past_events.length > 0){
       this.changeSegment('history');
       this.alertCtrl.create({title: 'Review your activities and events', message: 'It seems like you have past events and activities waiting for review. <br> Click on them and select the review option!', buttons: ['Ok']}).present();
     }

     this.show_pop = false;
   }
   this.activities_all = this.activities_all.filter( event => !moment(moment(event.startTime).format('LLLL')).isBefore(today));
   this.activities_all = this.orderByDay(this.activities_all);

   this.activities_all = this.orderByDate(this.activities_all);
   this.past_events = this.orderByDate(this.past_events);
   console.log(this.activities_all);
   console.log(this.past_events);
  }

  getNumberDay(d){
    if(d=='Monday') return 1;
    else if(d=='Tuesday') return 2;
    else if(d=='Wednesday') return 3;
    else if(d=='Thursday') return 4;
    else if(d=='Friday') return 5;
    else if(d=='Saturday') return 6;
    else if(d=='Sunday') return 7;
  }

  getEvents(){
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.activities_all = [];
      this.convertActivities();
    });
  }

  orderByDate(aux){
    return aux.sort(function(a, b){
     var keyA = a.startTime,
         keyB = b.startTime;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
    });
  }

  orderByDay(aux){
    return aux.sort(function(a, b){
     var keyA = a.day_number,
         keyB = b.day_number;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
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
          't_id': (a[key].t_id ? a[key].t_id : ''),
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
       title: 'Succesfully removed!',
       message: 'The event or activity was removed succesfully from your schedule!',
       buttons: ['Ok']
     }).present();
   }

   doMath(evento){
     if(evento.isEvent){
       this.af.list('Users/').update(evento.creator, {
         'noms': parseFloat(this.balance_creator) - parseInt(evento.cost)*.7
       });
       this.af.list('Users/').update(firebase.auth().currentUser.uid, {
         'noms': parseFloat(this.noms_balance) + parseInt(evento.cost)
       }).then(()=>{
         this.goAhead(evento);
       });
     }
     else{
       this.af.list('Users/').update(evento.creator, {
         'noms': parseFloat(this.balance_creator) - parseInt(evento.class_price)*.7
       })
       this.af.list('Users/').update(firebase.auth().currentUser.uid, {
         'noms': parseFloat(this.noms_balance) + parseInt(evento.class_price)
       }).then(()=>{
         this.goAhead(evento);
       });
     }
     if(evento.t_id != ''){
       this.af.list('Users/'+evento.creator+'/transactions/'+evento.t_id).remove();
       this.af.list('transactions/'+evento.t_id).remove();
     }

   }

   getBack(evento){
     this.doMath(evento);
   }

   changeSegment(tipo){
     this.segment = tipo;
   }

   getSegment(tipo){
     return this.segment == tipo ? 'segment-element selected' : 'segment-element';
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
     this.af.object('Users/'+evento.creator).snapshotChanges().subscribe(action => {
       this.balance_creator = action.payload.val().noms;
     });
     if(evento.cancelation_policy){
       let d = new Date();
       let dif = moment(evento.startTime).fromNow();

       //dif = (dif.indexOf('hours') || dif.indexOf('hour'));
       //let dif2 = (dif.indexOf('days') || dif.indexOf('day'));
       let dif2 =  dif.split(' ')[2] == 'hour';

       console.log(dif2);

      if(!dif2){
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
                console.log(parseInt(this.balance_creator));
                console.log(parseInt(evento.class_price));
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

  onEventSelected(event) {
    console.log(event);
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let today  = moment();
    //this.events = this.events.filter( event => !moment(event.day).isBefore(today));
    if(!moment(start).isBefore(today)){
    let alert = this.alertCtrl.create({
      title: '' + event.title_complete,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: [
        {
          text: 'View Details',
          handler: () => {
            this.seeDetails(event);
          }
        },
        {
          text: 'Remove',
          handler: () =>{
            this.confirmCancelation(event);
          }
        }]
    })
    alert.present();
  }
  else if(!event.reviewed || event.reviewed == undefined){
    let alert = this.alertCtrl.create({
      title: '' + event.title_complete,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: [
        {
          text: 'View Details',
          handler: () => {
            this.seeDetails(event);
          }
        },
        {
          text: 'Write a review',
          handler: () =>{
            this.giveReview(event);
          }
        }]
    })
    alert.present();
  }
  else{
    let alert = this.alertCtrl.create({
      title: '' + event.title_complete,
      subTitle: 'From: ' + start + '<br>To: ' + end,
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
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

}
