import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import * as moment from 'moment';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser'

/**
 * Generated class for the AttendantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendants',
  templateUrl: 'attendants.html',
})
export class AttendantsPage {
public reservations: any = [];
public general_loader: any;
public response$: any;
public actual_members: any = [];
public members: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public modalCtrl: ModalController) {
    this.reservations = this.navParams.get('Reservations');
    //console.log(this.reservations[0].nomads);
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  isMember(indice){
    let r = this.reservations[0].nomads
    for(let key in r){
      if(r[key].index == indice){
        return true;
      }
    }
    return false;
  }

  convertMembers(){
    let a = this.response$;
    for(let key in a){
      if(this.isMember(a[key].index)){
        this.actual_members.push({
          'first_name': a[key].first_name,
          'last_name': a[key].last_name,
          'index': a[key].index,
          'img': a[key].img
        });
      }
    }
    console.log(this.actual_members);
    this.general_loader.dismiss();
  }

  getUsers(){
    this.af.object('Users').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.actual_members = [];
      this.convertMembers();
    });
  }

  ionViewDidLoad() {
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.getUsers();
  }

}
