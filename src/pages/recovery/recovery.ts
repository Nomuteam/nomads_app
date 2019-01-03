import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_type = this.navParams.get('User');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecoveryPage');
  }

  openLogin(){
    this.navCtrl.push(LoginPage, {'User': this.user_type});
  }

}
