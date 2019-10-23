import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import * as moment from 'moment';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser'
/**
 * Generated class for the Attendants2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attendants2',
  templateUrl: 'attendants2.html',
})
export class Attendants2Page {

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
    console.log(this.reservations);
    this.reservations.forEach(element => {
      console.log(element);
    });

    this.af.object('Users').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      console.log('usuarios', this.response$);
      this.reservations.forEach(element => {
        for(let key in this.response$){
          if(key == element.index){
            this.actual_members.push({
              'first_name': this.response$[key].first_name,
              'last_name': this.response$[key].last_name,
              'index': this.response$[key].index,
              'img': this.response$[key].img
            });
          }
        }
      });

      console.log('asistentes', this.actual_members);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Attendants2Page');
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }
}
