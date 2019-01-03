import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FiltersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html',
})
export class FiltersPage {
public segment: any = 'daytime';
public example_cats: any = [
  {
    'name': 'Classes',
    'selected': false
  },
  {
    'name': 'Gym',
    'selected': false
  },
  {
    'name': 'Instructors',
    'selected': false
  },
  {
    'name': 'Adventures',
    'selected': false
  },
  {
    'name': 'Studios',
    'selected': false
  },
  {
    'name': 'Superhumans',
    'selected': false
  },
];
public example_days: any = [
  {
    'day': 'D',
    'selected': false
  },
  {
    'day': 'L',
    'selected': false
  },
  {
    'day': 'M',
    'selected': false
  },
  {
    'day': 'M',
    'selected': false
  },
  {
    'day': 'J',
    'selected': false
  },
  {
    'day': 'V',
    'selected': false
  },
  {
    'day': 'S',
    'selected': false
  },
]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltersPage');
  }

  changeSegment(tipo){
    this.segment = tipo;
  }

  getSegment(tipo){
    return this.segment == tipo ? 'segment-element selected' : 'segment-element';
  }

  selectDay(indice){
    let aux = this.example_days[indice].selected;
    aux ? this.example_days[indice].selected = false : this.example_days[indice].selected = true;
  }

  addCategorie(indice){
    if(this.example_cats[indice].selected){
      this.example_cats[indice].selected = false;
    }
    else{
      this.example_cats[indice].selected = true;
    }

  }

  getSelected(selected){
    return ( selected ? 'likes-element selected' : 'likes-element');
  }

}
