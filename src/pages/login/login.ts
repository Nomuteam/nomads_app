import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RecoveryPage } from '../recovery/recovery';
import { RegisterPage } from '../register/register';
import { CirclesPage } from '../circles/circles';
import { SplashPage } from '../splash/splash';
import { TabsPage } from '../tabs/tabs';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AngularFireAuth]
})
export class LoginPage {
public user_type: any;
public general_loader: any;

public mail: any = '';
public pw: any = '';
public pw_type = 'password';
public pw_text = 'View';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {
    this.user_type = this.navParams.get('User');
  }

  getText(){
    return this.pw_type == 'password' ? 'View' : 'Hide';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  //Login con email usando FIREBASE
  loginMail(){
  let vm = this;
    if(this.mail != '' && this.pw != ''){
      if(this.mail.indexOf('@')!=-1){
        this.general_loader = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Signing In...'
        });
        this.general_loader.present();

        let credentials = {
          email: this.mail,
          password: this.pw
        };


        this.signInWithEmail(credentials).then(() => this.findUser(), error => this.handleError(error.message));}

      else{
        let alert = this.alertCtrl.create({
          title: 'Invalid Email',
          message: 'Please type in a valid email',
          buttons: ['Ok']
        });
        alert.present();
      }
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Incomplete Fields',
        message: 'Please fill in all the fields',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

  signInWithEmail(credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }

  findTest(){
    console.log('logged in');
  }

  findUser(){
    let indice = firebase.auth().currentUser.uid;
    let reference =  firebase.database().ref('Users').orderByChild('index').equalTo(indice);
    this.general_loader.dismiss();

    reference.once('value', snapshot => {
      let aux = snapshot.val()[indice];

      console.log(aux.user_type);
      localStorage.setItem('Tipo', aux.user_type);
      // if(!aux.info_complete){
      //   this.navCtrl.push(CirclesPage, {'Color': 'green', 'User': aux.user_type});
      // }
      // else{
      //   this.navCtrl.setRoot(TabsPage);
      // }
      });
    }



  handleError(msj){
    this.general_loader.dismiss();
    let alert = this.alertCtrl.create({
      title: msj,
      buttons:  ['Ok']
    });
    alert.present();
  }

  openRegister(){
    this.navCtrl.push(RegisterPage, {'User': this.user_type});
  }

  openRecovery(){
    this.navCtrl.push(RecoveryPage, {'User': this.user_type});
  }


  openCircles(){
    this.navCtrl.push(CirclesPage, {'Color': 'rosa'});
  }

  openNomads(){
    this.navCtrl.setRoot(WelcomePage);
  }


}
