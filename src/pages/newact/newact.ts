import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';

/**
 * Generated class for the NewactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newact',
  templateUrl: 'newact.html',
})
export class NewactPage {
  public current_index: any = 1;
  public user_type: any = '';
  public isAdding: any = false;
  public general_loader: any;

  public example_cats: any = [
    {
      'name': 'Classes',
      'selected': false
    },
    {
      'name': 'Gym',
      'selected': false
    },
    {
      'name': 'Instructors',
      'selected': false
    },
    {
      'name': 'Adventures',
      'selected': false
    },
    {
      'name': 'Studios',
      'selected': false
    },
    {
      'name': 'Superhumans',
      'selected': false
    },
  ];
  public example_activities: any = [
    {
      'title': 'Yoga'
    },
    {
      'title': 'Muay Thai'
    },
    {
      'title': 'Calisthenics'
    },
    {
      'title': 'HIIT'
    },
    {
      'title': 'Hiking'
    },
  ];
  public example_forms: any = [
    {
      'title': 'Aerobic'
    },
    {
      'title': 'Strength'
    },
    {
      'title': 'Agility'
    },
    {
      'title': 'Endurance'
    },
  ];
  public example_days: any = [
    {
      'day': 'L',
      'title': 'Monday',
      'selected': false
    },
    {
      'day': 'M',
      'title': 'Tuesday',
      'selected': false
    },
    {
      'day': 'M',
      'title': 'Wednesday',
      'selected': false
    },
    {
      'day': 'J',
      'title': 'Thursday',
      'selected': false
    },
    {
      'day': 'V',
      'title': 'Friday',
      'selected': false
    },
    {
      'day': 'S',
      'title': 'Saturday',
      'selected': false
    },
    {
      'day': 'D',
      'title': 'Sunday',
      'selected': false
    },
  ];

  public activity_data: any = {
     'title': '',
     'location': '',
     'description': '',
     'cancelation_policy': '',
     'class_price': '',
     'fee': '',
     'categories': {
       'main_category': '',
       'activity_type': '',
       'workout_form': '',
     },
     'schedule': [],
     'media': []
   };

   public schedule: any = {
     'start_time': '06:00',
     'duration': '',
     'spaces_available': '',
     'gender': 'Female',
     'level': 'Beginner',
     'min_age': '',
     'max_age': ''
   }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewactPage');
  }

  eraseSchedule(indice){
    this.activity_data.schedule.splice(indice, 1);
  }

  changeLevel(){
    if(this.schedule.level == 'Beginner'){
      this.schedule.level = 'Intermediate';
    }
    else if(this.schedule.level == 'Intermediate'){
      this.schedule.level = 'Expert';
    }
    else if(this.schedule.level == 'Expert'){
      this.schedule.level = 'All';
    }
    else if(this.schedule.level == 'All'){
      this.schedule.level = 'Beginner';
    }
  }

  withMagic(){
    let aux = this.example_days.filter(cat => cat.selected);
    let a = this.schedule;

    for(let i=0; i<aux.length; i++){
      this.activity_data.schedule.push({
       'day': aux[i].title,
       'start_time': a.start_time,
       'duration': a.duration,
       'spaces_available': a.spaces_available,
       'gender': a.gender,
       'level': a.level,
       'min_age': a.min_age,
       'max_age': a.max_age
      });
    }
    this.isAdding = false;
  }

  changeGender(){
    if(this.schedule.gender == 'Female'){
      this.schedule.gender = 'Male';
    }
    else if(this.schedule.gender == 'Male'){
      this.schedule.gender = 'Both';
    }
    else if(this.schedule.gender == 'Both'){
      this.schedule.gender = 'Female';
    }
  }

  addForm(titulo){
    this.activity_data.categories.workout_form = titulo;
  }

  getForm(titulo){
      return ( this.activity_data.categories.workout_form == titulo ? 'likes-element selectedrose' : 'likes-element');
  }

  getActivity(titulo){
      return ( this.activity_data.categories.activity_type == titulo ? 'likes-element selectedrose' : 'likes-element');
  }

  addActivity(titulo){
    this.activity_data.categories.activity_type = titulo
  }

  getCategorie(titulo){
    return ( this.activity_data.categories.main_category == titulo ? 'likes-element selectedrose' : 'likes-element');
  }

  addCategorie(titulo){
    this.activity_data.categories.main_category = titulo
  }

  selectDay(indice){
    let aux = this.example_days[indice].selected;
    aux ? this.example_days[indice].selected = false : this.example_days[indice].selected = true;
  }

  getSelected(selected){
    return ( selected ? 'likes-element selectedrose' : 'likes-element purple');
  }

  getClass(indice){
    return (this.current_index >= indice ? 'status-element selectedrose' : 'status-element');
  }

  canAdvance(){
    if(this.current_index == 1){
      return (this.activity_data.title != '' && this.activity_data.location != '' && this.activity_data.description != '' && this.activity_data.cancelation_policy != '' && this.activity_data.class_price != '');
    }
    else if(this.current_index == 2){
      return (this.activity_data.categories.main_category != '' && this.activity_data.categories.activity_type  != '' && this.activity_data.categories.workout_form  != '')
    }
    else if(this.current_index == 3){
      return (this.activity_data.schedule.length > 0);
    }
    return true;
  }

  doMagic(){
    if(this.activity_data.media.length == 0){
      this.activity_data.media.push({
        'url': 'https://images.pexels.com/photos/685534/pexels-photo-685534.jpeg?cs=srgb&dl=athletes-endurance-energy-685534.jpg&fm=jpg'
      });
    }
    this.activity_data.img = this.activity_data.media[0].url;

    let indice = this.generateUUID();
    this.activity_data.index = indice;
    this.activity_data.creator = firebase.auth().currentUser.uid;
    this.af.list('Users/'+this.activity_data.creator+'/Activities_created').update(indice, {
      'index': indice,
      'created_at': new Date()
    });
    this.af.list('Activities').update(indice, this.activity_data)
      .then( () =>{
        this.general_loader.dismiss();
        this.alertCtrl.create({
          title: 'Activity Created',
          message: 'Your activity was created succesfully',
          buttons: ['Ok']
        }).present();
        this.navCtrl.pop();
      })
  }

  next(){
    if(this.current_index == 4){
      this.general_loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Creating...'
      });
      this.general_loader.present();
      this.doMagic();
    }
    else{
      this.current_index++;
    }
  }

  back(){
    this.current_index--;
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
