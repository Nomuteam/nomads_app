import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RecoveryPage } from '../recovery/recovery';
import { RegisterPage } from '../register/register';
import { CirclesPage } from '../circles/circles';
import { SplashPage } from '../splash/splash';

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
})
export class LoginPage {
public user_type: any;
public email: any;
public password: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_type = this.navParams.get('User');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  openRegister(){
    this.navCtrl.push(RegisterPage, {'User': this.user_type});
  }

  openRecovery(){
    this.navCtrl.push(RecoveryPage);
  }


  openCircles(){
    this.navCtrl.push(CirclesPage, {'Color': 'rosa'});
  }

  openNomads(){
    this.navCtrl.setRoot(LoginPage, {'User': 'nomads'});
  }


}
