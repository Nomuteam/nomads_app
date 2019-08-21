import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { NewactPage } from '../newact/newact';
import { NeweventPage } from '../newevent/newevent';
import { NewstudioPage } from '../newstudio/newstudio';

/**
 * Generated class for the TypesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-types',
  templateUrl: 'types.html',
})
export class TypesPage {
public selected: any = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController) {
  }

  getClass(cual){
    return this.selected == cual ? 'service-type selected' : 'service-type';
  }

  selectThis(cual){
    this.selected = cual;
  }

  next(){
    if(this.selected == '1'){
      this.navCtrl.push(NewactPage);
    }
    else if(this.selected == '2'){
      this.navCtrl.push(NewstudioPage);
    }
    else if(this.selected == '3'){
      this.navCtrl.push(NeweventPage);
    }
    else{
      this.alertCtrl.create({
        title: 'Available soon',
        message: 'We will be launching the health section in just a few weeks.',
        buttons: ['Ok']
      }).present();
    }
  }

  back(){
    this.navCtrl.pop();
  }

  canAdvance(){
    return this.selected != '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TypesPage');
  }

}
