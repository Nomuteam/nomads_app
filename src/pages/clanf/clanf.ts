import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClanshPage } from '../clansh/clansh';
import { FiltersPage } from '../filters/filters';

/**
 * Generated class for the ClanfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clanf',
  templateUrl: 'clanf.html',
})
export class ClanfPage {
  public clans_example: any = [
    {
      'title': 'Tec de Mty',
      'members': '200',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'members': '150',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Tec de Mty',
      'members': '200',
      'status': false,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'members': '150',
      'status': false,
      'location': 'Monterrey, México'
    }
];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  openView(){
    this.navCtrl.push(ClanshPage);
  }

  getStatus(status){
    return status ? 'Open' : 'Private';
  }

  returnStatus(status){
    return status ? 'act-status' : 'act-status rose';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClanfPage');
  }

}
