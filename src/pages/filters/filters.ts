import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';

/**
 * Generated class for the FiltersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {
public general_loader: any;
public segment: any = 'daytime';
public noms_balance: any = '';
public example_cats: any = [
  // {
  //   'name': 'Classes',
  //   'selected': false
  // },
  // {
  //   'name': 'Gym',
  //   'selected': false
  // },
  // {
  //   'name': 'Instructors',
  //   'selected': false
  // },
  // {
  //   'name': 'Adventures',
  //   'selected': false
  // },
  // {
  //   'name': 'Studios',
  //   'selected': false
  // },
  // {
  //   'name': 'Superhumans',
  //   'selected': false
  // },
];
public example_activities: any = [
  // {
  //   'title': 'Yoga',
  //   'selected': false
  // },
  // {
  //   'title': 'Muay Thai',
  //   'selected': false
  // },
  // {
  //   'title': 'Calisthenics',
  //   'selected': false
  // },
  // {
  //   'title': 'HIIT',
  //   'selected': false
  // },
  // {
  //   'title': 'Hiking',
  //   'selected': false
  // },
];
public example_forms: any = [
  // {
  //   'title': 'Aerobic',
  //   'selected': false
  // },
  // {
  //   'title': 'Strength',
  //   'selected': false
  // },
  // {
  //   'title': 'Agility',
  //   'selected': false
  // },
  // {
  //   'title': 'Endurance',
  //   'selected': false
  // },
];
public example_days: any = [
  // {
  //   'day': 'L',
  //   'selected': false
  // },
  // {
  //   'day': 'M',
  //   'selected': false
  // },
  // {
  //   'day': 'M',
  //   'selected': false
  // },
  // {
  //   'day': 'J',
  //   'selected': false
  // },
  // {
  //   'day': 'V',
  //   'selected': false
  // },
  // {
  //   'day': 'S',
  //   'selected': false
  // },
  // {
  //   'day': 'D',
  //   'selected': false
  // },
];
public example_schedule: any = [
  // {
  //   'time': '06:00',
  //   'selected': false
  // },
  // {
  //   'time': '07:00',
  //   'selected': false
  // },
  // {
  //   'time': '08:00',
  //   'selected': false
  // },
  // {
  //   'time': '09:00',
  //   'selected': false
  // },
  // {
  //   'time': '10:00',
  //   'selected': false
  // },
  // {
  //   'time': '11:00',
  //   'selected': false
  // },
  // {
  //   'time': '12:00',
  //   'selected': false
  // },
  // {
  //   'time': '13:00',
  //   'selected': false
  // },
  // {
  //   'time': '14:00',
  //   'selected': false
  // },
  // {
  //   'time': '15:00',
  //   'selected': false
  // },
  // {
  //   'time': '16:00',
  //   'selected': false
  // },
  // {
  //   'time': '17:00',
  //   'selected': false
  // },
  // {
  //   'time': '18:00',
  //   'selected': false
  // },
  // {
  //   'time': '19:00',
  //   'selected': false
  // },
  // {
  //   'time': '20:00',
  //   'selected': false
  // },
  // {
  //   'time': '21:00',
  //   'selected': false
  // },
  // {
  //   'time': '22:00',
  //   'selected': false
  // },
];
public example_price: any = [
  {
    'price': '$'
  },
  {
    'price': '$$'
  },
  {
    'price': '$$$'
  },
];
public example_level: any = [
  {
    'level': 'Beginner'
  },
  {
    'level': 'Intermediate'
  },
  {
    'level': 'Expert'
  },
];
public allday: any;
public distance: any = 0;

public response$: any;
public user_preferences: any = [];

  constructor(  public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();
    this.af.object('Users/'+firebase.auth().currentUser.uid+'/preferences').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.noms_balance = this.response$.noms;
      this.user_preferences = this.response$;
      if(this.user_preferences.allday == undefined) this.allday = false;
      this.markSelected();
      if(this.general_loader) this.general_loader.dismiss();
    });
    console.log(this.user_preferences);

  }

  ionViewDidLeave(){
    this.user_preferences.forms = this.example_forms;
    this.user_preferences.types = this.example_activities;
    this.user_preferences.categories = this.example_cats;
    this.user_preferences.allday = this.allday;
    this.user_preferences.schedule = this.example_schedule;
    this.user_preferences.days = this.example_days;
    this.user_preferences.allday = this.allday;

    this.af.list('Users/'+firebase.auth().currentUser.uid).update('preferences', this.user_preferences);
  }

  markSelected(){
  let a = this.response$;

  console.log(a);

  this.allday = a.allday;

  if(a.categories){
    for(let key in a.categories){
      this.example_cats.push({
        'name': a.categories[key].name,
        'selected': a.categories[key].selected
      })
    }
  }

  if(a.types){
    for(let key in a.types){
      this.example_activities.push({
        'title': a.types[key].title,
        'selected': a.types[key].selected
      })
    }
  }

  if(a.forms){
    for(let key in a.forms){
      this.example_forms.push({
        'title': a.forms[key].title,
        'selected': a.forms[key].selected
      })
    }
  }

  if(a.days){
    for(let key in a.days){
      this.example_days.push({
        'day': a.days[key].day,
        'selected': a.days[key].selected
      })
    }
  }

  if(a.schedule){
    for(let key in a.schedule){
      this.example_schedule.push({
        'time': a.schedule[key].time,
        'selected': a.schedule[key].selected
      })
    }
  }


  console.log(this.example_cats);

  }

  changeSegment(tipo){
    this.segment = tipo;
  }

  getSegment(tipo){
    return this.segment == tipo ? 'segment-element selected' : 'segment-element';
  }

  selectLevel(indice){
    let aux = this.example_level[indice].selected;
    aux ? this.example_level[indice].selected = false : this.example_level[indice].selected = true;
  }

  selectPrice(indice){
    let aux = this.example_price[indice].selected;
    aux ? this.example_price[indice].selected = false : this.example_price[indice].selected = true;
  }

  selectTime(indice){
    let aux = this.example_schedule[indice].selected;
    aux ? this.example_schedule[indice].selected = false : this.example_schedule[indice].selected = true;
  }

  selectDay(indice){
    let aux = this.example_days[indice].selected;
    aux ? this.example_days[indice].selected = false : this.example_days[indice].selected = true;
  }

  addActivity(indice){
    if(this.example_activities[indice].selected){
      this.example_activities[indice].selected = false;
    }
    else{
      this.example_activities[indice].selected = true;
    }
  }

  addForm(indice){
    if(this.example_forms[indice].selected){
      this.example_forms[indice].selected = false;
    }
    else{
      this.example_forms[indice].selected = true;
    }
  }

  addCategorie(indice){
    if(this.example_cats[indice].selected){
      this.example_cats[indice].selected = false;
    }
    else{
      this.example_cats[indice].selected = true;
    }

  }

  isPrice(cual){
    return this.user_preferences.cost == cual ? 'likes-element selected' : 'likes-element';
  }

  isLevel(cual){
    return this.user_preferences.level == cual ? 'likes-element selected' : 'likes-element';
  }

  getSelected(selected){
    return ( selected ? 'likes-element selected' : 'likes-element');
  }

}
