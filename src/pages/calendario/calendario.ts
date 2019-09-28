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
import { AttendantsPage } from '../attendants/attendants';

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
 public reservations: any = [];

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
 ]
 public selected: any = 0;
 public freeze: any = false;

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

    this.selected = this.cualHoy();

    this.alertCtrl.create({
      title: 'Welcome to your calendar!',
      message: 'Wanna know how many spots are left in your classes? Click in any of them to see!',
      buttons: ['Ok']
    }).present();
  }

  confirmFreeze(){
    if(this.freeze){

      this.alertCtrl.create({
        title: 'Warning!',
        subTitle: 'Are you sure you want to freeze this day',
        message: 'This will erase all the reservations',
        buttons: [
          {
          text: 'Freeze',
          handler: ()=>{
            this.freeze = true;
          }},
          {
          text: 'Cancel',
          handler: ()=>{
            this.freeze = false;
          }},
        ]
      }).present();
    }
  }

  cualHoy(){
    let hoy = moment().format('dddd');
    if(hoy == 'Monday') return 0;
    if(hoy == 'Tuesday') return 1;
    if(hoy == 'Wednesday') return 2;
    if(hoy == 'Thursday') return 3;
    if(hoy == 'Friday') return 4;
    if(hoy == 'Saturday') return 5;
    if(hoy == 'Sunday') return 6;
  }

  getClass(element){
    return element == this.selected ? 'day' : 'day no';
  }

  changeSelected(element){
    this.selected = element;
    this.freeze = false;
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

  
  markStartEvent(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    
    let ayuda = moment(inicio).toDate();
    ayuda.setHours(t);
    ayuda.setMinutes(m);

    /*
    if(this.isDespues(ayuda)) ayuda = (moment(ayuda).add(7, 'days')).toDate();
    ayuda = moment(ayuda).toDate();
    */
   
    return ayuda;
  }

  markEndEvent(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    let ayuda:any;
    try{
      ayuda = moment(inicio).toDate();
    }
    catch{
      ayuda = moment(inicio).toDate();
    }
    
    ayuda.setHours(t+2);
    ayuda.setMinutes(m);
    if(this.isDespues(ayuda)) ayuda = (moment(ayuda).add(7, 'days')).toDate();
    //ayuda = moment(ayuda).toDate();


    return ayuda;
  }

  markStart(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    
    let ayuda:any;
    try{
      ayuda = moment(inicio, 'dddd').toDate();
    }
    catch{
      //2019-09-15
      ayuda = moment(inicio,'yyyy-mm-dd').toDate();
    }

    ayuda.setHours(t);
    ayuda.setMinutes(m);

    if(this.isDespues(ayuda)) ayuda = (moment(ayuda).add(7, 'days')).toDate();
    ayuda = moment(ayuda).toDate();

    return ayuda;
  }

  markEnd(inicio, tiempo){
    let t = parseInt(tiempo.slice(0,2));
    let m = parseInt(tiempo.slice(3));
    let ayuda:any;
    try{
      ayuda = moment(inicio, 'dddd').toDate();
    }
    catch{
      ayuda = moment(inicio).toDate();
    }
    
    ayuda.setHours(t+2);
    ayuda.setMinutes(m);
    if(this.isDespues(ayuda)) ayuda = (moment(ayuda).add(7, 'days')).toDate();
    //ayuda = moment(ayuda).toDate();


    return ayuda;
  }

  checkExist(clave){
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
    let inscritos:any=0;
    for(let key in a){
      if(a[key].index == clave){

        let fechaInicio = this.markStartEvent(a[key].day, a[key].time);
        

         let nomads = [];
         if(a[key].nomads != null){
          var keys = Object.keys(a[key].nomads);
          for (var i = 0; i < keys.length; i++) {
            var key_2 = keys[i];
            nomads.push(a[key].nomads[key_2]);
            inscritos++;
          }
          let reservation = [{
            nomads:nomads
          }];
          
          
         }
             
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
          'startTime': fechaInicio,
          'endTime': this.markEndEvent(a[key].day, a[key].time),
          'allDay': false,
          'time': a[key].time,
          'nomads': (a[key].nomads != undefined ? nomads : []),
          'creator':  a[key].creator,
          'index':  a[key].index,
          // 'media': a[key].media,
          'isEvent': true,
          'clave': llave,
          'clave_nomada': this.getClave(a[key].nomads),
          'reviewed': (review != undefined ? review : false),
          'review':( a[key].review ? a[key].review : 5),
          'reviews': (a[key].reviews ? a[key].reviews : []),
          'spaces_available': a[key].spaces_available ? a[key].spaces_available : 0,
          'reservations': inscritos
        }

        
        return aux2;
      }
    }
    return aux;
  }

  openAttendants(event){
    
    if(event.isEvent == true){
      
      this.navCtrl.push(AttendantsPage, {'Reservations': [event]});
    }
    else{
      this.navCtrl.push(AttendantsPage, {'Reservations': this.reservations});
    }
    
  }

  isSameDay(dia, rsv){

    let aux = moment(dia).format('YYYY-MM-DD');
    this.reservations = [];
    

    let dia2 = this.cualHoy();
    
    let suma = (this.selected-dia2 >= 0 ? this.selected-dia2 : (7-dia2+this.selected));
    let hoy = moment().add(suma, 'days').format("YYYY-MM-DD");
    



      this.reservations = [];
      for(let key in rsv){
        if(rsv[key].date == hoy.toString()){
          this.reservations[this.reservations.length] = rsv[key];
        }
      }
      


    return hoy == moment(dia).format("YYYY-MM-DD")
  }

  getRsv(element){
    
    if(this.reservations != []){
      let count = 0;
       for(let key in this.reservations){
         for(let lla in this.reservations[0].nomads){
           count++;
         }
       }
      return count;
      // return Object.keys(this.reservations[0].nomads).length;
    }
    else{
      return 0;
    }
  }

  isMine(clave){
    let a = this.users$.Activities_created;
    
    for(let key in a){
      if(a[key].index == clave) return true;
    }
    return false;
  }

  checkExistA(){
    let b = this.response$;
    for(let key in b){
      if(this.isMine(b[key].index)){
        if(b[key].schedule){
          for(let lla in b[key].schedule){
            let n = '';
            if(b[key].nomads){
              //n = b[key].nomads.filter( a => this.hacerCosa(a.date, this.markStart(b[key].schedule[lla].day, b[key].schedule[lla].start_time)));
              let spaces = Object.keys(n).length;
            }
            
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
              'time': b[key].schedule[lla].start_time,
              'nomads': (b[key].nomads != undefined ? b[key].nomads : []),
              'creator':  b[key].creator,
              'index':  b[key].index,
              'media': b[key].media,
              'isEvent': false,
              'clave_nomada': this.getClave(b[key].nomads),
              'review':( b[key].review ? b[key].review : 5),
              'reviews': (b[key].reviews ? b[key].reviews : []),
              'spaces_available': b[key].schedule[lla].spaces_available,
              'space': (b[key].schedule[lla].space ? b[key].schedule[lla].space : 10),
              'reservations': []
          });
          }
        }
      }
    }
    this.getAssistants();
    this.activities_all = this.activities_all.filter(a=>a.startTime != 'Invalid Date');
  }

  getAssistants(){
    let reservations = [];
    let a = this.activities_all;
    for(let key in a){
      if(!a[key].isEvent && a[key].nomads){
        for(let key2 in a[key].nomads){
          if(!this.isDespues(a[key].nomads[key2].date)){
            for(let lla in a[key].schedule){
              if(a[key].schedule[lla].day == a[key].nomads[key2].day && a[key].schedule[lla].start_time == a[key].nomads[key2].time){
                if(reservations[a[key].nomads[key2].date.toString()] = []){
                    reservations[a[key].nomads[key2].date.toString()] = {'date': a[key].nomads[key2].date, 'day': a[key].nomads[key2].day, 'nomads': []};
                }
                reservations[a[key].nomads[key2].date.toString()].nomads.push({'index': a[key].nomads[key2].index});
                a[key].reservations = reservations;
              }
            }
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

   confirmFull(evento){
     this.alertCtrl.create({
       title: 'Are you sure you mark this class as full?',
       message: 'This means you will not take more reservations on nomu for this weeks class',
       buttons: [
         {
           text: 'Cancel',
           handler: () => {

           }
         },
         {
           text: 'Mark full',
           handler: () => {
             //this.goAhead(evento);
           }
         }
       ]
     }).present();
   }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');


    let alert = this.alertCtrl.create({
      title: '' + event.title_complete,
      message: 'From: ' + start + '<br>To: ' + end,
      buttons: [
        {
          text: 'Full class',
          handler: () => {
           this.confirmFull(event)
          }
        },
        {
          text: 'View Assistants',
          handler: () => {
            this.openAttendants(event);
          }
        },
        {
          text: 'View Details',
          handler: () => {
            this.seeDetails(event);
          }
        }
      ]
    })
    alert.present();

  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

}
