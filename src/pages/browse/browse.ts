import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FilteredPage } from '../filtered/filtered';
import { FiltersPage } from '../filters/filters';

/**
 * Generated class for the BrowsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {
public activitites_example: any = [
  {
    'title': 'Yoga',
    'number': 15
  },
  {
    'title': 'Box',
    'number': 15
  },
  {
    'title': 'Spinning',
    'number': 15
  },
  {
    'title': 'Pilates',
    'number': 15
  },
  {
    'title': 'Soccer',
    'number': 15
  },
  {
    'title': 'Cardio',
    'number': 15
  },
  {
    'title': 'Surfing',
    'number': 15
  },
  {
    'title': 'HIIT',
    'number': 15
  },
  {
    'title': 'Hiking',
    'number': 15
  },
  {
    'title': 'Meditation',
    'number': 15
  },
]
public activities_types: any =[
  {
    'title': 'Class',
    'selected': true
  },
  {
    'title': 'Studio',
    'selected': false
  },
  {
    'title': 'Instructor',
    'selected': false
  },
  {
    'title': 'Experience',
    'selected': false
  },
  {
    'title': 'Gym',
    'selected': false
  },
  {
    'title': 'Group',
    'selected': false
  },
]

public segment: any = 'activities';
public event_type: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BrowsePage');
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  openFiltered(tipo){
    this.navCtrl.push(FilteredPage, {'Tipo': tipo});
  }

  changeType(tipo){
    this.event_type = tipo;
  }

  getType(tipo){
    return this.event_type == tipo ? 'event-type rose' : 'event-type';
  }

  changeSegment(tipo){
    this.segment = tipo;
  }

  getSegment(tipo){
    return this.segment == tipo ? 'segment-element selected' : 'segment-element';
  }

  getClass(selected){
    return selected ? 'act-type selected' : 'act-type';
  }

  change(indice){
    //console.log(this.activities_types[index]);
    this.activities_types[indice].selected ? this.activities_types[indice].selected = false : this.activities_types[indice].selected = true;
  }

}
