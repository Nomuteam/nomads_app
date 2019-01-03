import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { CirclesPage } from '../circles/circles';

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
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
