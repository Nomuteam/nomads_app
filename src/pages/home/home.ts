import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BrowsePage } from '../browse/browse';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  openBrowse(){
    this.navCtrl.push(BrowsePage);
  }

}
