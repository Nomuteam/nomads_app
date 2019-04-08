import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { NeweventPage } from '../newevent/newevent';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase'
import { DomSanitizer } from '@angular/platform-browser';
import { EventPage } from '../event/event';
import { EditeventPage } from '../editevent/editevent';

/**
 * Generated class for the MyeventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myevents',
  templateUrl: 'myevents.html',
})
export class MyeventsPage {
public general_loader: any;
public type: any;
public response$: any;
public events: any = [];
public users$: any;
public noms_balance: any = '';
public example_events: any = [
  {
    'title': 'Camping en Arteaga',
    'members': 10,
    'occupancy': 20
  },
  {
    'title': 'Camping en SLP',
    'members': 20,
    'occupancy': 31
  },
  {
    'title': 'Camping en Queretaro',
    'members': 11,
    'occupancy': 50
  },
]
  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {
     this.type = localStorage.getItem('Tipo');
  }

  confirmEdit(act){
    this.alertCtrl.create({
      title: 'What would you like to do?',
      message:  'You can edit this event or see how its displayed to others',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
           this.navCtrl.push(EditeventPage, {'Event': act});
          }
        },
        {
          text: 'View',
          handler: () => {
            this.openEvent(act);
          }
        }
      ]
    }).present();
  }

  openNew(){
    this.navCtrl.push(NeweventPage);
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  convertEvents(){
    let a = this.response$;
    for(let key in a){
      if(a[key].creator == firebase.auth().currentUser.uid){
        this.events.push({
          'title': a[key].title,
          'title_complete': a[key].title,
          'location': a[key].location,
          'difficulty':  a[key].difficulty,
          'img':  a[key].img,
          'about_event':  a[key].about_event,
          'provided':  a[key].provided,
          'about_organizer':  a[key].about_organizer,
          'spaces_available':  a[key].spaces_available,
          'cost':  a[key].cost,
          'type':  a[key].type,
          'day': a[key].day,
          'time': a[key].time,
          'creator':  a[key].creator,
          'index':  a[key].index,
          'media': a[key].media,
          'isEvent': true,
          'nomads': a[key].nomads,
          'review':( a[key].review ? a[key].review : 5),
          'reviews': (a[key].reviews ? a[key].reviews : []),
          'special': (a[key].special ? a[key].special : false)
        });
      }
    }
    if(this.general_loader) this.general_loader.dismiss();
  }

  getEvents(){
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
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
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
    });
    this.getEvents();
  }

  openEvent(event){
    this.navCtrl.push(EventPage, {'Event': event});
  }

}
