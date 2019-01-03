import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FilteredPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filtered',
  templateUrl: 'filtered.html',
})
export class FilteredPage {
public activitites_example: any = [
  {
    'title': 'Relaxing Hike',
    'distance': '15 km',
    'cost': 15
  },
  {
    'title': 'Yoga in the Park',
    'distance': '22 km',
    'cost': 10
  },
  {
    'title': 'Kickboxing',
    'distance': '25 km',
    'cost': 18
  },
  {
    'title': 'Swimming Lesson',
    'distance': '31 km',
    'cost': 14
  },
];
public type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
   this.type = this.navParams.get('Tipo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilteredPage');
  }

}
