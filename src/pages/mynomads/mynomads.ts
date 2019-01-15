import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';

/**
 * Generated class for the MynomadsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mynomads',
  templateUrl: 'mynomads.html',
})
export class MynomadsPage {
public general_loader: any;

public response$: any;
public my_activities: any = [];

public a_response$: any;
public activities: any = [];

public users$: any;
public my_nomads: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {}


    checkExistA(indice){
      let a = this.activities;
      for(let key in a){
        if(a[key].index == indice){
          return true;
        }
      }
      return false;
    }

    isMine(horario){
      console.log(horario);
      if(horario){
        let a = horario;
        for(let key in a){
          if(this.checkExistA(a[key].activity_id)){
            return true;
          }
        }
      }
      return false;
    }


    convertNomads(){
      let a = this.response$;
      for(let key in a){
        if(this.isMine(a[key].schedule)){
          this.my_nomads.push({
            'first_name': a[key].first_name,
            'last_name': a[key].last_name,
            'index': a[key].index,
            'img': a[key].img,
            'birthdate': a[key].birthdate
          });
        }
      }
      console.log(this.my_nomads);
    }


    getNomads(){
      this.af.object('Users/').snapshotChanges().subscribe(action => {
        this.response$ = action.payload.val();
        this.my_nomads = [];
        this.convertNomads();
      });
    }

    ionViewDidLoad(){
      this.general_loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Loading...'
      });
      this.general_loader.present();

      this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
        this.users$ = action.payload.val();

        if(this.users$.Activities_created){
          this.activities = this.users$.Activities_created;
        }

        if(this.general_loader) this.general_loader.dismiss();
      });
      this.getNomads();
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
