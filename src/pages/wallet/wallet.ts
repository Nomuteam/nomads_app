import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { Stripe } from '@ionic-native/stripe';

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
public general_loader: any;
//For the user
public users$: any;
public noms_balance: any = [];

public user_type: any='';
public example_packages: any = [
  {
    'noms': 50,
    'bookings_avg': 10,
    'price': 1000,
    'selected': false
  },
  {
    'noms': 75,
    'bookings_avg': 12,
    'price': 1500,
    'selected': false
  },
  {
    'noms': 100,
    'bookings_avg': 14,
    'price': 2000,
    'selected': false
  },
  {
    'noms': 120,
    'bookings_avg': 16,
    'price': 2400,
    'selected': false
  },
];
public selected: any = 0;
public cash: any = 0;
public noms: any = 0;

public payment_data: any = {
  'card_address': '',
  'card_ccv': '',
  'card_expiry': '',
  'cardholder': '',
  'cardnumber': ''
};

public transaction_id: any;

public response$: any;
public transaction_status: any;
public transaction_paid: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public stripe: Stripe) {
    this.user_type = localStorage.getItem('Tipo');
  }

  verifyConfirmation(){
      if(this.transaction_status == 'succeeded'){
        this.general_loader.dismiss();

        this.alertCtrl.create({
          title: 'Transaction Succesful!',
          subTitle: 'You paid '+this.cash+' for '+this.noms+' noms',
          message: 'Enjoy your noms!',
          buttons: ['Ok']
        }).present();

        let transaction = {'date': new Date(), 'index': this.transaction_id, 'amount': this.cash, 'type': 'noms', 'sender_id': firebase.auth().currentUser.uid};
        this.af.list('transactions').update(this.transaction_id, transaction);

        this.af.list('Users/'+firebase.auth().currentUser.uid+'/transactions').update(this.transaction_id, {
          'index': this.transaction_id
        });

        this.af.list('Users/').update(firebase.auth().currentUser.uid, {
          'noms': this.noms_balance+this.noms
        }).then( () => {
          this.navCtrl.pop();
        })
      }
      else{
        this.alertCtrl.create({title: 'Payment Error', message: 'There was an error processing your payment, try again later', buttons: ['Ok']}).present();
      }
  }

  watchConfirmation(){
    this.af.object('Payments/'+firebase.auth().currentUser.uid+'/'+this.transaction_id).snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      if(this.response$.charge){
        this.transaction_status = this.response$.charge.status;
        this.transaction_paid = this.response$.charge.paid;
      }
    });
    setTimeout(() => {this.verifyConfirmation()}, 5000);
  }


  goPay(cvc){

    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Processing Payment...'
    });
    this.general_loader.present();

    this.transaction_id = this.generateUUID();

    let month = this.payment_data.card_expiry.slice(5);
    let year = this.payment_data.card_expiry.slice(0, 4);


    let card = {
     number: this.payment_data.cardnumber,
     expMonth: month,
     expYear: year,
     cvc: cvc
    };


    this.stripe.createCardToken(card)
       .then(token => {
         this.af.list('Payments/'+firebase.auth().currentUser.uid).update(this.transaction_id, {'token': token, 'amount': this.cash});
         this.watchConfirmation();
       })
       .catch(error => {
         this.alertCtrl.create({title: 'Payment Error', message: 'There was an error processing your payment, try again later', buttons: ['Ok']}).present();
       });
  }


  enterCVC(){
    const prompt = this.alertCtrl.create({
      title: 'Security Gate',
      message: 'For your security, we need you to enter the CVC of your stored card',
      inputs: [
        {
          name: 'cvc',
          placeholder: 'CVC'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Pay',
          handler: data => {
            this.goPay(data.cvc);
          }
        }
      ]
    });
    prompt.present();
  }

  enterNew(){
    const prompt = this.alertCtrl.create({
    title: 'Security Gate',
    message: 'For your security, we need you to enter the CVC of your stored card',
    inputs: [
      {
        name: 'card',
        placeholder: 'Card Number'
      },
      {
        name: 'month',
        placeholder: 'Expiry Month (Number)'
      },
      {
        name: 'year',
        placeholder: 'Expiry Year (Year 4 digits)'
      },
      {
        name: 'cvc',
        placeholder: 'CVC'
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Pay',
        handler: data => {
          console.log(data);
        }
      }
    ]
  });
  prompt.present();
  }


  selectCard(){
    let alert = this.alertCtrl.create();
   alert.setTitle('How would you like to pay?');

   if(this.payment_data.cardnumber != ''){
     alert.addInput({
       type: 'radio',
       label: 'Saved Card *******'+this.payment_data.cardnumber.substring(this.payment_data.cardnumber.length - 4),
       value: 'saved'
     });
   }


   alert.addInput({
     type: 'radio',
     label: 'New Card',
     value: 'new'
   });

   alert.addButton('Cancel');
   alert.addButton({
     text: 'Ok',
     handler: data => {
       console.log(data);
       if(data == 'saved') this.enterCVC();
       else this.enterNew();
     }
   });
   alert.present();
  }

  confirmPay(){
    if(this.cash > 0){
      this.alertCtrl.create({
        title: 'Do you want to buy '+this.noms+' noms?',
        message: 'You will be charged '+this.cash+' to your prefered card',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {

            }
          },
          {
            text: 'Proceed',
            handler: () =>{
              this.selectCard();
            }
          }
        ]
      }).present();
    }
    else{
      this.alertCtrl.create({
        title: 'Enter an amount of cash',
        message: 'In order to buy noms you need to enter the amount of cash you want to pay',
        buttons: ['Ok']
      }).present();
    }
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  selectP(indice){
    this.selected = indice;
    this.cash = this.example_packages[indice].price;
    this.noms = this.cash/20;
  }

  isSelected(indice){
    return ( this.selected == indice ? 'slide-card selected' : 'slide-card');
  }

  ionViewDidLoad(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;

      if(this.users$.payment){
        this.payment_data.cardnumber = this.users$.payment.cardnumber;
        this.payment_data.card_expiry = this.users$.payment.card_expiry;
        this.payment_data.cardholder = this.users$.payment.cardholder;
        this.payment_data.card_address = this.users$.payment.card_address;
      }

      if(this.general_loader) this.general_loader.dismiss();
    });
  }

  private generateUUID(): any {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
     });
    return uuid;
  }

}
