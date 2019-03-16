import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the AllPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all',
  templateUrl: 'all.html',
})
export class AllPage {
public activities_all: any = [];
public type: any = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public sanitizer: DomSanitizer) {
    this.activities_all = this.navParams.get('Acts');
    this.type = this.navParams.get('Tipo');
    console.log(this.activities_all);
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllPage');
  }

  seeDetails(a){
    if(a.isEvent){
      this.navCtrl.push(EventPage, {'Event': a});
    }
    else{
      this.navCtrl.push(ActivityPage, {'Activity': a});
    }
  }

}
