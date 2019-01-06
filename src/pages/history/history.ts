import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  public example_events: any = [
    {
      'title': 'Camping en Arteaga',
      'members': 10,
      'occupancy': 20
    },
    {
      'title': 'Camping en SLP',
      'members': 20,
      'occupancy': 31
    },
    {
      'title': 'Camping en Queretaro',
      'members': 11,
      'occupancy': 50
    },
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }

}
