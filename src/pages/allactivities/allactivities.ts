import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NewactPage } from '../newact/newact';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { ActivityPage } from '../activity/activity';
import { EditactPage } from '../editact/editact';
import * as moment from 'moment';
import { TypesPage } from '../types/types';
import { StudioPage } from '../studio/studio';
import { EditeventPage } from '../editevent/editevent';
import { EventPage } from '../event/event';
import { EditstudioPage } from '../editstudio/editstudio';
import { AttendantsPage } from '../attendants/attendants';
import { Editeventv2Page } from '../editeventv2/editeventv2';
import { CloneeventPage } from '../cloneevent/cloneevent';
/**
 * Generated class for the AllactivitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-allactivities',
  templateUrl: 'allactivities.html',
})
export class AllactivitiesPage {
  public response$: any;
  public responseS$: any;
  public responseE$: any;

  public activities: any = [];
  public studios: any = [];
  public events: any = [];

  public general_loader: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController ) {
  }

  openTypes() {
    this.navCtrl.push(TypesPage);
  }

  getTipo(ess, studio, tipo) {
    return tipo ? 'Event' : ess ? 'Studio' : studio != '' ? 'Studio activity' : 'Singular activity';
  }

  addStudio(acti) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Add activity to studio');

    for (let key in this.studios) {
      alert.addInput({
        type: 'radio',
        label: this.studios[key].title,
        value: this.studios[key].index,
        checked: false
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Add',
      handler: data => {
        console.log(data);
        this.af.list('Activities').update(acti.index, {
          'studio': data
        });
        this.af.list('Studios/' + data + '/activities').update(acti.index, {
          'index': acti.index
        });
      }
    });
    alert.present();
  }

  confirmEdit(act) {
    if (!act.isEvent) {
      if (!act.isStudio) {
        this.alertCtrl.create({
          title: 'What would you like to do?',
          message: 'You can view, edit or remove this activity.',
          buttons: [
            {
              text: 'View',
              handler: () => {
                this.openActivity(act);
              }
            },
            {
              text: 'Edit',
              handler: () => {
                this.navCtrl.push(EditactPage, { 'Act': act });
              }
            },
            {
              text: 'Add to Studio',
              handler: () => {
                this.addStudio(act);
                //this.navCtrl.push(EditactPage, {'Act': act});
              }
            },
            {
              text: 'Remove',
              role: 'destructive',
              handler: () => {
                if (!this.checkNomdas(act)) this.confirmRemove(act);
                else this.alertCtrl.create({ title: 'There are nomads signed', message: 'You cant delete this activity now', buttons: ['Ok'] }).present();
              }
            },
          ]
        }).present();
      }
      else {
        this.alertCtrl.create({
          title: 'What would you like to do?',
          message: 'You can view, edit or remove this studio.',
          buttons: [
            {
              text: 'View',
              handler: () => {
                this.navCtrl.push(StudioPage, { 'Studio': act });
                //this.openActivity(act);
              }
            },
            {
              text: 'Edit',
              handler: () => {
                this.navCtrl.push(EditstudioPage, { 'Studio': act });
                //this.navCtrl.push(EditactPage, {'Act': act});
              }
            },
            {
              text: 'Remove',
              role: 'destructive',
              handler: () => {
                if (!this.checkNomdas(act)) this.confirmRemove(act);
                else this.alertCtrl.create({ title: 'There are nomads signed', message: 'You cant delete this activity now', buttons: ['Ok'] }).present();
              }
            },
          ]
        }).present();
      }
    }
    else if (act.isEvent) {
      this.alertCtrl.create({
        title: 'What would you like to do?',
        message: 'You can view, edit or remove this event.',
        buttons: [
          {
            text: 'View Service Details',
            handler: () => {
              this.navCtrl.push(EventPage, { 'Event': act });
            }
          },
          {
            text: 'View Assistants',
            handler: () => {
              //this.navCtrl.push(EventPage, {'Event': act});
              let nomads = [];
              console.log(act);
              var keys = Object.keys(act.nomads);
              for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                nomads.push(act.nomads[key]);
              }
              let reservation = [{
                nomads:nomads
              }]
              
              this.navCtrl.push(AttendantsPage, {'Reservations': reservation});
            }
          },
          {
            text: 'Clone',
            handler: () => {
              //this.navCtrl.push(EditeventPage, { 'Event': act });
              this.navCtrl.push(CloneeventPage, { 'Event': act });
            }
          },
          {
            text: 'Edit',
            handler: () => {
              //this.navCtrl.push(EditeventPage, { 'Event': act });
              this.navCtrl.push(Editeventv2Page, { 'Event': act });
            }
          },
          {
            text: 'Remove',
            role: 'destructive',
            handler: () => {
              if (!this.checkNomdas(act)) this.confirmRemove(act);
              else this.alertCtrl.create({ title: 'There are nomads signed', message: 'You cant delete this activity now', buttons: ['Ok'] }).present();
            }
          },
        ]
      }).present();
    }
  }

  DeleteActivity(act, type) {
    this.af.list(type + '/' + act.index).remove();
  }
  confirmRemove(act) {
    this.alertCtrl.create({
      title: 'Are you sure you want to delete this activity?',
      message: 'It will no longer be available.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            this.openActivity(act);
          }
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            console.log('actividad a borrar', act.index);
            this.af.list('Events/' + act.index).remove();
            this.af.list('Studios/' + act.index).remove();
            this.af.list('Activities/' + act.index).remove();
            this.getActivities();
          }
        },
      ]
    }).present();
  }

  checkNomdas(act) {
    console.log(act.nomads);
    let n = act.nomads;
    let today = moment();
    for (let key in n) {
      if (moment(n.date).isBefore(today)) return true;
    }
    return false;
  }



  convertActivities() {
    let a = this.response$;
    for (let key in a) {
      this.activities.push({
        'title': a[key].title,
        'title_complete': a[key].title,
        'location': a[key].location,
        'description': a[key].description,
        'useful_notes': (a[key].useful_notes ? a[key].useful_notes : ''),
        'cancelation_policy': a[key].cancelation_policy,
        'class_price': a[key].class_price,
        'fee': a[key].fee,
        'categories': a[key].categories,
        'schedule': a[key].schedule,
        'media': a[key].media,
        'nomads': (a[key].nomads ? a[key].nomads : []),
        'img': a[key].img,
        'creator': a[key].creator,
        'index': a[key].index,
        'isEvent': false,
        'review': (a[key].review ? a[key].review : 5),
        'reviews': (a[key].reviews ? a[key].reviews : []),
        'studio': (a[key].studio ? a[key].studio : '')
      });
    }
    this.getStudios();
    this.activities = this.activities.filter(a => a.creator == firebase.auth().currentUser.uid);
    console.log(this.activities);
  }

  openActivity(actividad) {
    this.navCtrl.push(ActivityPage, { 'Activity': actividad });
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

  convertEvents() {
    let a = this.responseE$;
    for (let key in a) {
      if (a[key].creator == firebase.auth().currentUser.uid) {
        this.activities.push({
          'title': a[key].title.substring(0, 10) + '..',
          'title_complete': a[key].title,
          'location': a[key].location,
          'difficulty': a[key].difficulty,
          'img': a[key].img,
          'cost': a[key].cost,
          'about_event': a[key].about_event,
          'e_type': a[key].e_type,
          'day': a[key].day,
          'cancelation_policy': a[key].cancelation_policy ? a[key].cancelation_policy : 0,
          'end_time': a[key].end_time ? a[key].end_time : '',
          'provided': a[key].provided,
          'about_organizer': a[key].about_organizer,
          'type': a[key].type,
          'allDay': false,
          'time': a[key].time,
          'nomads': (a[key].nomads != undefined ? a[key].nomads : []),
          'creator': a[key].creator,
          'index': a[key].index,
          // 'media': a[key].media,
          'isEvent': true,
          'review': (a[key].review ? a[key].review : 5),
          'reviews': (a[key].reviews ? a[key].reviews : []),
          'spaces_available': a[key].spaces_available ? a[key].spaces_available : 0
        })
      }
    }
    this.activities = this.getUnique(this.activities, 'index');
    this.general_loader.dismiss();
  }

  getEvents() {
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.responseE$ = action.payload.val();
      this.events = [];
      this.convertEvents();
    });
  }

  convertStudios() {
    let s = this.responseS$;
    for (let key in s) {
      if (s[key].creator == firebase.auth().currentUser.uid) {
        this.activities.push({
          'amenities': s[key].amenities,
          'closing': s[key].closing,
          'creator': s[key].creator,
          'description': s[key].description,
          'index': s[key].index,
          'location': s[key].location,
          'logo': s[key].logo,
          'membership_cost': s[key].membership_cost,
          'title': s[key].name,
          'opening': s[key].opening,
          'schedule': s[key].schedule,
          'useful_notes': s[key].useful_notes,
          'isStudio': true,
          'activities': (s[key].activities ? s[key].activities : [])
        });
        this.studios.push({
          'title': s[key].name,
          'index': s[key].index
        });
      }
    }

    this.getEvents();
    console.log(this.activities);
  }

  getStudios() {
    this.af.object('Studios').snapshotChanges().subscribe(action => {
      this.responseS$ = action.payload.val();
      this.studios = [];
      this.convertStudios();
    });
  }


  getActivities() {
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.activities = [];
      this.convertActivities();
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

  openNew() {
    this.navCtrl.push(NewactPage);
  }

}
