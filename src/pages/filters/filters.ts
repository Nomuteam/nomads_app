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
  {
    'day': 'D',
    'selected': false
  },
];
public example_schedule: any = [
  {
    'time': '06:00',
    'selected': false
  },
  {
    'time': '07:00',
    'selected': false
  },
  {
    'time': '08:00',
    'selected': false
  },
  {
    'time': '09:00',
    'selected': false
  },
  {
    'time': '10:00',
    'selected': false
  },
  {
    'time': '11:00',
    'selected': false
  },
  {
    'time': '12:00',
    'selected': false
  },
  {
    'time': '13:00',
    'selected': false
  },
  {
    'time': '14:00',
    'selected': false
  },
  {
    'time': '15:00',
    'selected': false
  },
  {
    'time': '16:00',
    'selected': false
  },
  {
    'time': '17:00',
    'selected': false
  },
  {
    'time': '18:00',
    'selected': false
  },
  {
    'time': '19:00',
    'selected': false
  },
  {
    'time': '20:00',
    'selected': false
  },
  {
    'time': '21:00',
    'selected': false
  },
  {
    'time': '22:00',
    'selected': false
  },
];
public example_price: any = [
  {
    'price': '$',
    'selected': false
  },
  {
    'price': '$$',
    'selected': false
  },
  {
    'price': '$$$',
    'selected': false
  },
];
public example_level: any = [
  {
    'level': 'Beginner',
    'selected': false
  },
  {
    'level': 'Intermediate',
    'selected': false
  },
  {
    'level': 'Expert',
    'selected': false
  },
];
public allday: any = true;
public distance: any = 0;

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

  selectLevel(indice){
    let aux = this.example_level[indice].selected;
    aux ? this.example_level[indice].selected = false : this.example_level[indice].selected = true;
  }

  selectPrice(indice){
    let aux = this.example_price[indice].selected;
    aux ? this.example_price[indice].selected = false : this.example_price[indice].selected = true;
  }

  selectTime(indice){
    let aux = this.example_schedule[indice].selected;
    aux ? this.example_schedule[indice].selected = false : this.example_schedule[indice].selected = true;
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
