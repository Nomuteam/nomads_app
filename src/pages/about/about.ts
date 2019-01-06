import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ClanfPage } from '../clanf/clanf';
import { FiltersPage } from '../filters/filters';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public clans_example: any = [
    {
      'title': 'Tec de Mty',
      'members': '200'
    },
    {
      'title': 'Nomads',
      'members': '150'
    }
];

  constructor(public navCtrl: NavController) {

  }

  openFind(){
    this.navCtrl.push(ClanfPage);
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

}
