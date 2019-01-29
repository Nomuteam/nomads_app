import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CirclesPage } from '../circles/circles';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { TermsPage } from '../terms/terms';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [AngularFireAuth]
})
export class RegisterPage {
public user_type: any;
public general_loader: any;

public mail: any='';
public pw: any='';
public phone: any='';
public code: any='';
public accepted: any=false;

constructor(
  public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public afAuth: AngularFireAuth,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController) {
    this.user_type = this.navParams.get('User');
  }

  openTerms(){
    this.navCtrl.push(TermsPage);
  }

  getClass(){
    return (this.user_type == 'nomads' ? 'container-datos' : 'container-datos ally');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  //Método para registrar un usuario con FIREBASE
  registerMail(){
    if(this.mail != '' && this.pw != '' && this.phone != ''){
        if(this.mail.indexOf('@')!=-1){
          if(this.accepted){
            this.general_loader = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Registering...'
            });
            this.general_loader.present();
            // this.mail = this.mail.toLowerCase();
            // this.mail = this.mail.replace(/\s+/g,'');
            let credentials = {
              email: this.mail,
              password: this.pw
             };
             this.signUp(credentials)
                  .then(() => this.saveData(), error => this.handleError(error.message));
          }
          else{
            let alert = this.alertCtrl.create({
              title: 'Terms and Conditions',
              message: 'Please accept terms and conditions to proceed',
              buttons: ['Ok']
            });
            alert.present();
          }
        }
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

    signUp(credentials) {
      return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    }

    saveData(){
      let indice = firebase.auth().currentUser.uid;
      this.af.list('/Users').update(indice, {
        'index': indice,
        'email': this.mail,
        'phone': this.phone,
        'code': this.code,
        'user_type': this.user_type,
        'created_at': new Date(),
        'info_complete': false,
        'noms': 0
      }).then( () => {
        this.general_loader.dismiss();
        //this.openCircles();
      })
    }

    handleError(msj){
      this.general_loader.dismiss();
      let alert = this.alertCtrl.create({
        title: msj,
        buttons:  ['Ok']
      });
      alert.present();
    }

  openCircles(){
    localStorage.setItem('Tipo', this.user_type);
    this.navCtrl.push(CirclesPage, {'Color': 'green', 'User': this.user_type});
  }

  openLogin(){
    //this.navCtrl.pop();
    this.navCtrl.push(LoginPage, {'User': this.user_type});
  }

}
