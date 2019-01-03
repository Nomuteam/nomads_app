import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CirclesPage } from '../circles/circles';

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
})
export class RegisterPage {
public user_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_type = this.navParams.get('User');
  }

  getClass(){
    return (this.user_type == 'nomads' ? 'container-datos' : 'container-datos ally');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  openCircles(){
    this.navCtrl.push(CirclesPage, {'Color': 'green', 'User': this.user_type});
  }

  openLogin(){
    //this.navCtrl.pop();
    this.navCtrl.push(LoginPage, {'User': this.user_type});
  }

}
