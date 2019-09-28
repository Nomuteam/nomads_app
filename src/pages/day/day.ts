import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { FilteredPage } from '../filtered/filtered';

/**
 * Generated class for the DayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-day',
  templateUrl: 'day.html',
})
export class DayPage {
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
  public selectedDayString: any = '';
  public selectedDay = new Date();
  public tiempo: any = '';
  public agregados:any[]=[];

  public times: any = [
    {
      'time': '06:00'
    },
    {
      'time': '07:00'
    },
    {
      'time': '08:00'
    },
    {
      'time': '09:00'
    },
    {
      'time': '10:00'
    },
    {
      'time': '11:00'
    },
    {
      'time': '12:00'
    },
    {
      'time': '13:00'
    },
    {
      'time': '14:00'
    },
    {
      'time': '15:00'
    },
    {
      'time': '16:00'
    },
    {
      'time': '17:00'
    },
    {
      'time': '18:00'
    },
    {
      'time': '19:00'
    },
    {
      'time': '20:00'
    },
    {
      'time': '21:00'
    },
    {
      'time': '22:00'
    },
  ];
  public activities: any = [];
  public filtered: any = [];
  public tfiltered: any = [];


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selected = this.cualHoy();
    this.activities = this.navParams.get('Activities');
    console.log(this.activities);
  }

  getClass(element){
    return element == this.selected ? 'day' : 'day no';
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

  filterByTime(){
    this.agregados = [];
    console.log('filtro');
    this.tfiltered = [];
    let aux = [];
    let a = this.filtered;
    let t = this.times.filter(t=>t.selected);
    //console.log('actividades filtradas', a);
    let filtro = [];
    for(let key in a){
      let s = a[key].schedule;
      for(let lla in s){
        let timeNumber = Number(this.tiempo.replace(':',''));
        let timeNumerEnd = timeNumber + 100;
        
        if(s[lla].day == moment().add(this.selected-1, 'days').format('dddd') && 
        Number(s[lla].start_time.replace(':','')) >= timeNumber &&
        Number(s[lla].start_time.replace(':','')) < timeNumerEnd &&
        this.agregados.indexOf(a[key]) == -1){
          a[key].fechaProxima = s[lla].start_time
          this.agregados.push(a[key]);
          this.tfiltered[this.tfiltered.length] = a[key];
          //this.tfiltered[this.tfiltered.length].fechaProxima = s[lla].start_time;
          //console.log(a[key].title);
        }
      }
        // filtro = a[key].schedule.filter(s => s.startTime == t[t.length-1].time );
        // if(filtro.length > 0) this.tfiltered[this.tfiltered.length] = a[key];

      // for(let key in t){
      //   filtro = a[key].schedule.filter(s => s.startTime == this.tiempo );
      //   if(a[key].schedule.filter(s =>{
      //     console.log(s.startTime);
      //     s.startTime == this.tiempo;
      //   }).length > 0){
      //     this.tfiltered[this.tfiltered.length] = a[key];
      //   }
      // }
   }
    //this.tfiltered = this.getUnique(this.tfiltered, 'index');
    
    console.log(this.tfiltered);
  }

  getUnique(arr, comp) {

  const unique = arr
       .map(e => e[comp])

     // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter(e => arr[e]).map(e => arr[e]);

   return unique;
}

goFiltered(){
  let t = this.times.filter(t=>t.selected);
  
  if(t.length > 0){
    this.navCtrl.push(FilteredPage, {'Activities': this.tfiltered});
  }
  else{
    this.navCtrl.push(FilteredPage, {'Activities': this.filtered});
  }
}


  filterByDay(){
    this.filtered = [];
    let aux = [];
    let a = this.activities;
    console.log('dia',this.selectedDayString);
    //console.log(moment().add(this.selected, 'days').format('dddd'));
    this.activities.forEach(element => {
      //console.log()
    });

    console.log('Actividades',this.activities);
    for(let key in a){
      if(a[key].schedule.filter(s => s.day == this.selectedDayString).length > 0){
        this.filtered[this.filtered.length] = a[key];
      }
    }
    console.log(this.filtered);
  }

  getClassT(selected){
    return this.tiempo == this.times[selected].time ? 'time yes' : 'time';
  }

  changeSelected(element, day){
    console.log(element, day);
    this.selected = element;
    this.selectedDayString = day;
    this.filterByDay();
  }

  changeTime(indice){
    this.tiempo = this.times[indice].time;
    this.times[indice].selected ? this.times[indice].selected = false : this.times[indice].selected = true;
    this.filterByTime();
  }

  ionViewDidLoad() {
    let diaActual = this.cualHoy();
    this.days.forEach(element => {
      if(element.number == diaActual){
        this.changeSelected(element.number, element.day);
      }
    });
  }

}
