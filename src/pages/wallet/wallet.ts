import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
public user_type: any='';
public example_packages: any = [
  {
    'noms': 100,
    'bookings_avg': 10,
    'price': '120.00',
    'selected': false
  },
  {
    'noms': 150,
    'bookings_avg': 12,
    'price': '150.00',
    'selected': false
  },
  {
    'noms': 200,
    'bookings_avg': 14,
    'price': '180.00',
    'selected': false
  },
  {
    'noms': 250,
    'bookings_avg': 16,
    'price': '200.00',
    'selected': false
  },
];
public selected: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user_type = localStorage.getItem('Tipo');
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  selectP(indice){
    this.selected = indice;
  }

  isSelected(indice){
    return ( this.selected == indice ? 'slide-card selected' : 'slide-card');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
  }

}
