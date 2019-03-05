import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FilteredPage } from '../filtered/filtered';
import { FiltersPage } from '../filters/filters';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import * as moment from 'moment';

/**
 * Generated class for the BrowsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {
public activitites_example: any = [
  {
    'title': 'Events',
    'number': 15
  },
  {
    'title': 'Yoga',
    'number': 15
  },
  {
    'title': 'Box',
    'number': 15
  },
  {
    'title': 'Spinning',
    'number': 15
  },
  {
    'title': 'Pilates',
    'number': 15
  },
  {
    'title': 'Soccer',
    'number': 15
  },
  {
    'title': 'Cardio',
    'number': 15
  },
  {
    'title': 'Surfing',
    'number': 15
  },
  {
    'title': 'HIIT',
    'number': 15
  },
  {
    'title': 'Hiking',
    'number': 15
  },
  {
    'title': 'Meditation',
    'number': 15
  },
]
public activities_types: any =[
  {
    'title': 'Class',
    'selected': false
  },
  {
    'title': 'Studio',
    'selected': false
  },
  {
    'title': 'Instructor',
    'selected': false
  },
  {
    'title': 'Experience',
    'selected': false
  },
  {
    'title': 'Gym',
    'selected': false
  },
  {
    'title': 'Group',
    'selected': false
  },
]

public segment: any = 'activities';
public event_type: any = '';

public e_response$: any;
public events: any = [];
public response$: any;
public activities: any = [];
public categorias: any = [];
public general_loader: any;
public experiences: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {
    this.segment = this.navParams.get('segment');
  }

  getNumberExperiences(){

  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  convertEvents(){
    let a = this.e_response$;
    //let today  = moment();
    // let len = Object.keys(a).filter(b =>  !moment(b.day).isBefore(today)).length;
    //this.events.push({'type': 'All Events', 'number': 1, 'main': 'all'});
    if(this.general_loader) this.general_loader.dismiss();
    let today  = moment();
    for(let key in a){
      if(!moment(a[key].day).isBefore(today)) this.events.push(a[key]);
    }
    //
    // let today  = moment();
    // this.events = this.events.filter( event => !moment(event.day).isBefore(today));
    // if(this.general_loader) this.general_loader.dismiss();

    // console.log(this.activities);
    // console.log(this.events);
  }

  getEventsN(){
    return this.events.length;
  }


  alreadyExists(elemento){
    for(let i=0; i<this.activities.length; i++){
      if(this.activities[i].type == elemento.activity_type){
        this.activities[i].number+=1;
        return {'type': 'cacaca'};
      }
    }
    return {'type': elemento.activity_type, 'number': 1, 'main': elemento.main_category};
  }

  alreadyMain(categoria){
    for(let i=0; i<this.categorias.length; i++){
      if(this.categorias[i].type == categoria){
        this.categorias[i].number+=1;
        return {'type': 'cacaca'};
      }
    }
    return {'type': categoria, 'number': 1, 'selected': false};
  }

  convertActivities(){
    let a = this.response$;
    this.activities.push({'type': 'All Activities', 'number': Object.keys(a).length, 'main': 'all'});
    for(let key in a){
      this.activities.push(this.alreadyExists(a[key].categories));
      this.categorias.push(this.alreadyMain(a[key].categories.main_category));
      if(a[key].categories.main_category == 'Experiences') this.experiences.push(a[key]);
      // this.activities.push({
      //   'type': a[key].categories.activity_type,
      //   'number': 0
      // });
    }
    this.activities = this.activities.filter(act => act.type != 'cacaca');
    this.categorias = this.categorias.filter(act => act.type != 'cacaca');
    console.log(this.activities);
    console.log(this.categorias);
  }


  getExperiences(){
    //return ['hi', 'k'];
    return this.experiences;
  }

  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.activities = [];
      this.categorias = [];
      this.convertActivities();
    });
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.events = [];
      this.convertEvents();
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

  openFiltered(tipo){
    this.navCtrl.push(FilteredPage, {'Tipo': tipo});
  }

  changeType(tipo){
    this.event_type = tipo;
  }

  getType(tipo){
    return this.event_type == tipo ? 'event-type rose' : 'event-type';
  }

  changeSegment(tipo){
    this.segment = tipo;
  }

  getSegment(tipo){
    return this.segment == tipo ? 'segment-element selected' : 'segment-element';
  }

  getClass(selected){
    return selected ? 'act-type selected' : 'act-type';
  }

  isSelected(titulo){
    let aux = this.categorias.filter( cat => cat.selected);
    if(aux.length == 0) return true;
    for(let i=0; i<aux.length; i++){
      if(aux[i].type == titulo){
        return true;
      }
    }
    return false;
  }

  getRealA(){
    return this.activities.filter( act => act.main == 'all' || this.isSelected(act.main));
  }

  change(indice){
    this.categorias[indice].selected ? this.categorias[indice].selected = false : this.categorias[indice].selected = true;
  }

}
