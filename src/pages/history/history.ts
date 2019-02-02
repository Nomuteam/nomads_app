import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';

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
  ];
public general_loader: any;

//For the transactions
public response$: any;
public transactions: any = [];


  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController) {}

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  convertT(){
    let a = this.response$;
    let usuario = firebase.auth().currentUser.uid;

    for(let key in a){
      if(a[key].sender_id == usuario || a[key].receiver_id == usuario){
        this.transactions.push({
          'activity_id': a[key].activity_id,
          'amount': a[key].amount,
          'date': a[key].date,
          'index': a[key].index,
          'receiver': a[key].receiver,
          'receiver_id': a[key].receiver_id,
          'sender': a[key].sender,
          'sender_id': a[key].sender_id,
          'type': a[key].type
        });
      }
    }

    console.log(this.transactions);
    if(this.general_loader) this.general_loader.dismiss();
  }

  getNoms(qt){
    return Math.ceil(qt/20);
  }

  getTitle(tit){
    let aux = '';
    if(tit == 'noms-referral'){
      aux = 'Received noms from referred friend!';
    }
    else if(tit == 'activity'){
      aux = 'Reserved an Activity or Event';
    }
    else if(tit == 'noms'){
      aux = 'Bought Noms';
    }
    return aux;
  }

  ionViewDidLoad() {
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();

    this.af.object('transactions/').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.transactions = [];
      this.convertT();
    });
  }

}
