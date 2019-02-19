import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import * as moment from 'moment';
import { TicketPage } from '../ticket/ticket';

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

public a_response$: any;
public e_response$: any;


  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public modalCtrl: ModalController) {}

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  getName(id){
    let a = this.a_response$;
    let e = this.e_response$;
    let name = '';

    for(let key in a){
      if(a[key].index == id){
        name = a[key].title;
      }
    }

    for(let key in e){
      if(e[key].index == id){
        name = e[key].title;
      }
    }

    return name;

  }

  openModal(bc){
    let modal = this.modalCtrl.create(TicketPage, {'Details': bc});
    modal.present();
  }

  convertT(){
    let a = this.response$;
    let usuario = firebase.auth().currentUser.uid;
    let start = '';
    let cool;
    let nice;

    for(let key in a){
      if(a[key].sender_id == usuario || a[key].receiver_id == usuario){

      start = moment(a[key].date).format('LL');
      cool = new Date(a[key].date);
      cool = cool.setHours(cool.getHours());
      nice = new Date(cool);
      nice = nice.setMinutes(nice.getMinutes());
      cool = false;


        this.transactions.push({
          'activity_id': a[key].activity_id,
          'activity_name': this.getName(a[key].activity_id),
          'amount': a[key].amount,
          'date': start,
          'index': a[key].index,
          'receiver': a[key].receiver,
          'receiver_id': a[key].receiver_id,
          'sender': a[key].sender,
          'sender_id': a[key].sender_id,
          'type': a[key].type,
          'start': nice,
          'time': (a[key].time ? a[key].time : '')
        });
      }
    }

    this.transactions = this.transactions.sort(function(a, b){
    var keyA = new Date(a.start),
        keyB = new Date(b.start);
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
     return 0;
    });

    this.transactions = this.transactions.reverse();

    console.log(this.transactions);
    if(this.general_loader) this.general_loader.dismiss();
  }

  getNoms(qt){
    return Math.ceil(qt/20);
  }

  getTitle(tit2){
    let aux = '';
    let tit = tit2.type;
    if(tit == 'noms-referral'){
      aux = 'Received noms from referred friend!';
    }
    else if(tit == 'activity'){
      aux = 'Reserved a spot at '+tit2.activity_name;
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

    this.af.object('Activities/').snapshotChanges().subscribe(action => {
      this.a_response$ = action.payload.val();
    });

    this.af.object('Events/').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
    });

    this.af.object('transactions/').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.transactions = [];
      this.convertT();
    });
  }

}
