import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';

/**
 * Generated class for the ClanshPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clansh',
  templateUrl: 'clansh.html',
})
export class ClanshPage {
  public clans_example: any = [
    {
      'title': 'Tec de Mty',
      'category': 'Calisthenics',
      'members': '200',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'category': 'Gym',
      'members': '150',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Tec de Mty',
      'category': 'Swimming',
      'members': '200',
      'status': false,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'category': 'Fit',
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClanshPage');
  }

}
