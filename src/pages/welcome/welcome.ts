import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { CirclesPage } from '../circles/circles';
import { TabsPage } from '../tabs/tabs';
import { WalkPage } from '../walk/walk';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
  providers: [AngularFireAuth]
})
export class WelcomePage {
public general_loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
     this.af.list('/motivation').update("Heart", {"Text": 'All men are created equal, some work harder in the preseason'});

     this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading..'
    });
    this.general_loader.present();

    //this.afAuth.auth.signOut();

    this.afAuth.authState.subscribe(user => {
      if(user){
            this.general_loader.dismiss();
            let indice = firebase.auth().currentUser.uid;
            let reference =  firebase.database().ref('Users').orderByChild('index').equalTo(indice);
            reference.once('value', snapshot => {
            let aux = snapshot.val()[indice];

              console.log(aux.user_type);
              localStorage.setItem('Tipo', aux.user_type);
              if(!aux.info_complete){
                this.navCtrl.push(CirclesPage, {'Color': 'green', 'User': aux.user_type});
              }
              else{
                this.navCtrl.setRoot(TabsPage);
              }
              });

      }
      else{
        this.general_loader.dismiss();
      }
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  openLogin(){
    this.navCtrl.push(LoginPage, {'User': 'nomads'});
  }

  openRegister(){
    this.navCtrl.push(RegisterPage, {'User': 'nomads'});
  }

  openCircles(){
    this.navCtrl.push(CirclesPage, {'Color': 'purple'});
  }

}
