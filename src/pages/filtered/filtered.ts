import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import * as moment from 'moment';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';

/**
 * Generated class for the FilteredPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filtered',
  templateUrl: 'filtered.html',
})
export class FilteredPage {
public activitites_example: any = [
  {
    'title': 'Relaxing Hike',
    'distance': '15 km',
    'cost': 15
  },
  {
    'title': 'Yoga in the Park',
    'distance': '22 km',
    'cost': 10
  },
  {
    'title': 'Kickboxing',
    'distance': '25 km',
    'cost': 18
  },
  {
    'title': 'Swimming Lesson',
    'distance': '31 km',
    'cost': 14
  },
];
public type: any;

public general_loader: any;
public response$: any;
public e_response$: any;

public activities_all: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {
   this.type = this.navParams.get('Tipo');
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  seeDetails(a){
    if(a.isEvent){
      this.navCtrl.push(EventPage, {'Event': a});
    }
    else{
      this.navCtrl.push(ActivityPage, {'Activity': a});
    }
  }

  convertActivities(){
    let a = this.e_response$;

    for(let key in a){
      this.activities_all.push({
        'title': a[key].title.substring(0, 10) + '..',
        'title_complete': a[key].title,
        'location': a[key].location,
        'difficulty':  a[key].difficulty,
        'img':  a[key].img,
        'cost':  a[key].cost,
        'tipo': 'Evento',
        'about_event':  a[key].about_event,
        'provided':  a[key].provided,
        'about_organizer':  a[key].about_organizer,
        'type':  a[key].type,
        'allDay': false,
        'time': a[key].time,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'media': a[key].media,
        'isEvent': true,
        'distance': 0,
        'day': a[key].day
      });
  }

  let today  = moment();
  this.activities_all = this.activities_all.filter( event => !moment(event.day).isBefore(today));

    let b = this.response$;
      for(let key in b){
          this.activities_all.push({
            'title': b[key].title.substring(0, 10) + '..',
            'title_complete': b[key].title,
            'location': b[key].location,
            'description':  b[key].description,
            'cancelation_policy':  b[key].cancelation_policy,
            'categories':  b[key].categories,
            'tipo': b[key].categories.activity_type,
            'schedule':  b[key].schedule,
            'img':  b[key].img,
            'cost':  b[key].class_price,
            'class_price': b[key].class_price,
            'type':  b[key].type,
            'allDay': false,
            'creator':  b[key].creator,
            'index':  b[key].index,
            'media': b[key].media,
            'isEvent': false,
            'distance': 0
          });
      }

   if(this.type == 'All Events') this.activities_all = this.activities_all.filter( act => act.isEvent);
   else if (this.type == 'All Activities') this.activities_all = this.activities_all.filter( act => !act.isEvent);
   else this.activities_all = this.activities_all.filter( act => !act.isEvent && act.tipo == this.type);

   console.log(this.activities_all);
   if(this.general_loader) this.general_loader.dismiss();
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
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.getActivities();
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

}
