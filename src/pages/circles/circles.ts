import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { WalkPage } from '../walk/walk';

/**
 * Generated class for the CirclesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-circles',
  templateUrl: 'circles.html',
})
export class CirclesPage {
public circles_color: any;
public user_type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.circles_color =  this.navParams.get('Color');
    this.user_type = this.navParams.get('User');
  }

  getClass(number){
    let aux = 'div' + number;
    return ( this.circles_color != 'purple' && this.user_type == 'nomads' ? aux+' green' : aux);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CirclesPage');
    if(this.circles_color == 'purple'){
      setTimeout(()=>{
        this.openLogin();
      }, 4000);
    }
    else{
      setTimeout(()=>{
        this.openWalk();
      }, 4000);
    }
  }

  openWalk(){
    this.navCtrl.setRoot(WalkPage, {'User': this.user_type});
  }

  openLogin(){
    this.navCtrl.setRoot(LoginPage, {'User': 'allies'});
  }

}
