import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TermsPage } from '../terms/terms';

/**
 * Generated class for the WalkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-walk',
  templateUrl: 'walk.html',
})
export class WalkPage {
public current_index: any = 1;
public user_type: any = '';
public message: any = 'You are almost there, tell us more about you.';

//First Form
public name: any = '';
public last: any = '';
public birthdate: any = '';
public country: any = '';

//Second Form
public cardholder: any = '';
public cardnumber: any = '';
public expiry: any = '';
public ccv: any = '';
public billing: any = '';

//Third Form
public categories: any = [];
public level: any = '';
public distance: any = '';

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
]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_type = this.navParams.get('User');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalkPage');
  }


  getCategorie(indice){
    if(this.user_type == 'nomads'){
        return ( this.example_cats[indice].selected ? 'likes-element selected' : 'likes-element');
    }
    else{
        return ( this.example_cats[indice].selected ? 'likes-element selectedrose' : 'likes-element');
    }

  }

  addCategorie(indice){
    if(this.example_cats[indice].selected){
      this.example_cats[indice].selected = false;
    }
    else{
      this.example_cats[indice].selected = true;
    }

  }

  getLevel(level){
    if(this.user_type == 'nomads'){
      return ( this.level == level ? 'likes-element selected': 'likes-element');

    }
    else{
      return ( this.level == level ? 'likes-element selectedrose': 'likes-element');

    }
  }

  selectLevel(level){
    this.level = level;
  }

  getClass(indice){
    if(this.user_type == 'nomads'){
      return (this.current_index >= indice ? 'status-element selected' : 'status-element');

    }
    else{
      return (this.current_index >= indice ? 'status-element selectedrose' : 'status-element');
    }
  }

  canAdvance(){
    if(this.current_index == 1){
      return (this.name != '' && this.last != '' && this.birthdate != '' && this.country != '');
    }
    else if(this.current_index == 2){
      return (this.cardholder != '' && this.cardnumber != '' && this.expiry != '' && this.ccv != '' && this.billing != '')
    }
    else{
      return (this.example_cats.filter(value => value.selected === true).length > 0 && this.level != '' && this.distance != '');
    }
  }

  btnClass(type){
    let aux = type+'-btn';
    if(this.user_type == 'nomads'){
      console.log('pp');
      return aux;
    }
    else{
      console.log('kk');
      return aux+' selectedrose';
    }
  }

  next(){
    if(this.current_index == 3){
      this.navCtrl.setRoot(TermsPage);
    }
    else{
      this.current_index++;
      if(this.current_index == 3 && this.user_type == 'nomads'){
        this.message = 'This are the filters we use to give you the best recommedations. Change them anytime'
      }
    }
  }

  back(){
    this.current_index--;
    if(this.message == 'This are the filters we use to give you the best recommedations. Change them anytime'){
      this.message = 'You are almost there, tell us more about you.';
    }
  }

}
