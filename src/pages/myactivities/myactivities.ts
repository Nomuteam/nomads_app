import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { NewactPage } from '../newact/newact';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { ActivityPage } from '../activity/activity';
import { EditactPage } from '../editact/editact';
import * as moment from 'moment';

/**
 * Generated class for the MyactivitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myactivities',
  templateUrl: 'myactivities.html',
})
export class MyactivitiesPage {
public response$: any;
public activities: any = [];
public general_loader: any;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController) {
  }

  confirmEdit(act){
    this.alertCtrl.create({
      title: 'What would you like to do?',
      message:  'You can view, edit or remove this activity.',
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
           this.navCtrl.push(EditactPage, {'Act': act});
          }
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
           if(!this.checkNomdas(act)) this.confirmRemove(act);
           else this.alertCtrl.create({title: 'There are nomads signed', message: 'You cant delete this activity now', buttons: ['Ok']}).present();
          }
        },
      ]
    }).present();
  }

  confirmRemove(act){
    this.alertCtrl.create({
      title: 'Are you sure you want to delete this activity?',
      message:  'It will no longer be available.',
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
           this.af.list('Activities/'+act.index).remove();
          }
        },
      ]
    }).present();
  }

  checkNomdas(act){
    console.log(act.nomads);
    let n = act.nomads;
    let today  = moment();
    for(let key in n){
      if(moment(n.date).isBefore(today)) return true;
    }
    return false;
  }



  convertActivities(){
    let a = this.response$;
    for(let key in a){
      this.activities.push({
        'title': a[key].title,
        'title_complete': a[key].title,
        'location': a[key].location,
        'description':  a[key].description,
        'useful_notes': (a[key].useful_notes ? a[key].useful_notes : ''),
        'cancelation_policy':  a[key].cancelation_policy,
        'class_price':  a[key].class_price,
        'fee':  a[key].fee,
        'categories':  a[key].categories,
        'schedule':  a[key].schedule,
        'media':  a[key].media,
        'nomads': (a[key].nomads ? a[key].nomads : []),
        'img':  a[key].img,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'isEvent': false,
        'review': (a[key].review ? a[key].review : 5),
        'reviews': (a[key].reviews ? a[key].reviews : [])
      });
    }
    this.activities = this.activities.filter( a => a.creator == firebase.auth().currentUser.uid);
    this.general_loader.dismiss();
    console.log(this.activities);
  }

  openActivity(actividad){
    this.navCtrl.push(ActivityPage, {'Activity': actividad});
  }


  getActivities(){
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

  openNew(){
    this.navCtrl.push(NewactPage);
  }

}
