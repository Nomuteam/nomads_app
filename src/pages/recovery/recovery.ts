import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import firebase from 'firebase';
/**
 * Generated class for the RecoveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recovery',
  templateUrl: 'recovery.html',
})
export class RecoveryPage {
public user_type: any;
public general_loader: any;
public mail: any='';

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.user_type = this.navParams.get('User');
  }

  //Metodo cuando se le olvide la contraseña al usuario
  pwForgot(){

  this.general_loader = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Sending Email...'
  });
  this.general_loader.present();
  let vm = this;
  let auth = firebase.auth();
         //Firebase.auth().useDeviceLanguage();
         auth.sendPasswordResetEmail(this.mail).then(function() {
            vm.general_loader.dismiss();
           // Email sent.
           vm.alertCtrl.create({
           title: 'Email Sent',
           message: 'We just sent a recovery email to your inbox  (Dont fortget to check the Spam folder!)',
           buttons: ['Ok']
         }).present();
         vm.navCtrl.pop();
         }).catch(function(error) {
           // An error happened.
           vm.alertCtrl.create({
           title: error,
           buttons: ['Ok']
         }).present();
           console.log(error);
           //AQUI HAY QUE DECIRLE AL USUARIO QUE ESTA HACIENDO MAL
         });
  }

  isCorrect(){
    return this.mail != '' && this.mail.indexOf('@') > -1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPage');
  }

  openLogin(){
    this.navCtrl.push(LoginPage, {'User': this.user_type});
  }

}
