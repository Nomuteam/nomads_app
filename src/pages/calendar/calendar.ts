import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser'

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
  public activities_all: any = [];

  public calendar = {
   mode: 'month',
   currentDate: new Date()
 };
 public type: any;



  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {
    this.type = localStorage.getItem('Tipo');
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
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

  convertActivities(){
    let a = this.e_response$;

    for(let key in a){
    if(this.checkExist(a[key].index)){
      this.activities_all.push({
        'title': a[key].title.substring(0, 10) + '..',
        'title_complete': a[key].title,
        'location': a[key].location,
        'difficulty':  a[key].difficulty,
        'img':  a[key].img,
        'cost':  a[key].cost,
        'type':  a[key].type,
        'startTime': this.markStart(a[key].day, a[key].time),
        'endTime': this.markEnd(a[key].day, a[key].time),
        'allDay': false,
        'time': a[key].time,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'media': a[key].media,
        'isEvent': true
      });
    }
  }

    let b = this.response$;
      for(let key in b){
        if(this.checkExist(b[key].index)){
          this.activities_all.push({
            'title': b[key].title.substring(0, 10) + '..',
            'title_complete': b[key].title,
            'location': b[key].location,
            'difficulty':  b[key].difficulty,
            'img':  b[key].img,
            'cost':  b[key].cost,
            'type':  b[key].type,
            'startTime': this.markStart(this.nomad_schedule[0].date, this.nomad_schedule[0].time),
            'endTime': this.markEnd(this.nomad_schedule[0].date, this.nomad_schedule[0].time),
            'allDay': false,
            'time': b[key].time,
            'creator':  b[key].creator,
            'index':  b[key].index,
            'media': b[key].media,
            'isEvent': false
          });
        }
      }

   console.log(this.activities_all);
  }

  getEvents(){
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.activities_all = [];
      this.convertActivities();
    });
  }

  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.getEvents();
    });
  }

  ionViewDidLoad() {
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
          'date': a[key].date
        });
    }
    console.log(this.nomad_schedule);
    console.log(this.nomad_schedule[0].activity_id);
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

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

}
