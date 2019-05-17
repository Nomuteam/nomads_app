import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { Stripe } from '@ionic-native/stripe';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AyudaPage } from '../ayuda/ayuda';
declare var OpenPay: any;

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
public user_code: any = '';
public friend_balance: any = '';

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

public a_response$: any;
public my_activities: any = [];
public activities: any = [];

public t_response$: any;
public transactions: any = [];

public link_payment: any;

public paypal$: any;

public total: any = 0;
public users_total: any = 0;
public isverified: any = false;
public reported: any = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public stripe: Stripe,
    private http: Http,
    public iab: InAppBrowser,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController) {
    this.user_type = localStorage.getItem('Tipo');

    if(this.user_type == 'nomads'){

          this.alertCtrl.create({
            title: 'Welcome to your wallet!',
            message: 'Enter the amount you wish to buy or select a predefined package to buy NOMS',
            buttons: ['Ok']
          }).present();
    }

  }

  getFriendBalance(){
    if(this.user_code != undefined){
      this.af.object('Users/'+this.user_code).snapshotChanges().subscribe(action => {
      this.friend_balance = action.payload.val().noms;
      });
      this.giveFriend();
    }
  }

  giveFriend(){
      let transaction = {'date': new Date(), 'index': this.generateUUID(), 'amount': Math.ceil(this.noms*.05)/20, 'type': 'noms-referral', 'sender_id': firebase.auth().currentUser.uid, 'receiver_id': this.user_code};
      this.af.list('transactions').update(this.transaction_id, transaction);

      this.af.list('Users/').update(this.user_code, {
        'noms': parseInt(this.friend_balance)+this.noms
      }).then( () => {
        this.alertCtrl.create({
          title: 'Good Friend!',
          subTitle: 'This transaction just gave the friend who gave you his code a 5% noms bonus',
          message: 'Tell him about it!',
          buttons: ['Ok']
        }).present();
      })
  }

  canPay(){
    return this.cash != 0;
  }

  getMenor(){
    return Math.ceil(this.noms/9);
  }

  getMayor(){
    return Math.ceil(this.noms/3.5);
  }

  verifyConfirmation(){
      this.isverified = true;
      if(this.transaction_status == 'completed'){
        this.general_loader.dismiss();

        this.alertCtrl.create({
          title: 'Transaction Succesful!',
          subTitle: 'You paid '+this.cash+' for '+this.noms+' noms',
          message: 'Enjoy your noms!',
          buttons: ['Ok']
        }).present();

        //this.getFriendBalance();

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
        this.general_loader.dismiss();
        this.alertCtrl.create({title: 'Payment Error', message: 'There was an error processing your payment, try again later', buttons: ['Ok']}).present();
      }
  }

  tellUser(){
    this.reported = true;
    this.general_loader.dismiss();
    this.alertCtrl.create({title: 'Payment Error', subTitle:this.response$.errors.description,  message: 'The server responded with the following error: '+this.response$.errors.description, buttons: ['Ok']}).present();
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

  watchConfirmation2(){
    this.af.object('Fundings/'+firebase.auth().currentUser.uid+'/'+this.transaction_id).snapshotChanges().subscribe(action => {
     this.response$ = action.payload.val();
     if(this.response$.charge){
       this.transaction_status = this.response$.charge.status;
        this.transaction_paid = this.response$.charge.paid;
        if(!this.isverified) this.verifyConfirmation();
      }
      if(this.response$.errors){
         if(!this.reported) this.tellUser();
       }
     });
     //setTimeout(() => {this.verifyConfirmation()}, 5000);
  }

  goPay(){
  this.general_loader = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Loading...'
  })
  this.general_loader.present();

  this.transaction_id = this.generateUUID();

    let month = this.payment_data.card_expiry.slice(5);
    let year = this.payment_data.card_expiry.slice(2,4);

  let deviceSessionId = OpenPay.deviceData.setup();

  OpenPay.token.create({
        "card_number": this.payment_data.cardnumber,
        "holder_name":"Juan Perez Ramirez",
        "expiration_year": year,
        "expiration_month": month,
        "cvv2": '123',
        "address":{
           "city":"Querétaro",
           "line3":"Queretaro",
           "postal_code":"76900",
           "line1":"Av 5 de Febrero",
           "line2":"Roble 207",
           "state":"Queretaro",
           "country_code":"MX"
        }
  }, (dato)=>{
     this.af.list('Fundings/'+firebase.auth().currentUser.uid).update(this.transaction_id, {'token': dato.data.id, 'amount': parseInt(this.cash), 'session': deviceSessionId});
     this.watchConfirmation2();
  }, (error)=>console.log(error));

}


  // goPay(cvc){
  //
  //   this.general_loader = this.loadingCtrl.create({
  //     spinner: 'bubbles',
  //     content: 'Processing Payment...'
  //   });
  //   this.general_loader.present();
  //
  //   this.transaction_id = this.generateUUID();
  //
  //   let month = this.payment_data.card_expiry.slice(5);
  //   let year = this.payment_data.card_expiry.slice(0, 4);
  //
  //
  //   let card = {
  //    number: this.payment_data.cardnumber,
  //    expMonth: month,
  //    expYear: year,
  //    cvc: cvc
  //   };
  //
  //
  //   this.stripe.createCardToken(card)
  //      .then(token => {
  //        this.af.list('Payments/'+firebase.auth().currentUser.uid).update(this.transaction_id, {'token': token, 'amount': this.cash});
  //        this.watchConfirmation();
  //      })
  //      .catch(error => {
  //        this.alertCtrl.create({title: 'Payment Error', message: 'There was an error processing your payment, try again later', buttons: ['Ok']}).present();
  //      });
  // }


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
            this.goPay();
          }
        }
      ]
    });
    prompt.present();
  }

  confirmNew(datos){

    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    })
    this.general_loader.present();

    this.transaction_id = this.generateUUID();

    let card = {
     number: datos.card,
     expMonth: datos.month,
     expYear: datos.year.slice(2),
     cvc: datos.cvc
    };

    let deviceSessionId = OpenPay.deviceData.setup();

    OpenPay.token.create({
          "card_number": card.number,
          "holder_name":"Juan Perez Ramirez",
          "expiration_year": card.expYear,
          "expiration_month": card.expMonth,
          "cvv2": card.cvc,
          "address":{
             "city":"Querétaro",
             "line3":"Queretaro",
             "postal_code":"76900",
             "line1":"Av 5 de Febrero",
             "line2":"Roble 207",
             "state":"Queretaro",
             "country_code":"MX"
          }
    }, (dato)=>{
       this.af.list('Fundings/'+firebase.auth().currentUser.uid).update(this.transaction_id, {'token': dato.data.id, 'amount': parseInt(this.cash), 'session': deviceSessionId});
       this.watchConfirmation2();
    }, (error)=>console.log(error));


    // this.general_loader = this.loadingCtrl.create({
    //   spinner: 'bubbles',
    //   content: 'Processing Payment...'
    // });
    // this.general_loader.present();
    //
    // this.transaction_id = this.generateUUID();
    //
    // let card = {
    //  number: datos.card,
    //  expMonth: datos.month,
    //  expYear: datos.year,
    //  cvc: datos.cvc
    // };
    //
    //
    // this.stripe.createCardToken(card)
    //    .then(token => {
    //      this.af.list('Payments/'+firebase.auth().currentUser.uid).update(this.transaction_id, {'token': token, 'amount': this.cash});
    //      this.watchConfirmation();
    //    })
    //    .catch(error => {
    //      console.log(error);
    //      this.alertCtrl.create({title: 'Payment Error', message: JSON.stringify(error), buttons: ['Ok']}).present();
    //      // this.alertCtrl.create({title: 'Payment Error', message: 'There was an error processing your payment, try again later', buttons: ['Ok']}).present();
    //    });
  }

  enterNew(){
    const prompt = this.alertCtrl.create({
    title: 'Insert your card',
    message: 'Please insert the details of your card',
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
          this.confirmNew(data);
          console.log(data);
        }
      }
    ]
  });
  prompt.present();
  }


  selectCard(){
    this.isverified = false;
    this.reported = false;
    const actionSheet = this.actionSheetCtrl.create({
      title: 'How would you like to pay?',
      buttons: [
        {
          text: 'Saved Card *******'+this.payment_data.cardnumber.substring(this.payment_data.cardnumber.length - 4),
          handler: () => {
             this.enterCVC();
          }
        },{
          text: 'New Card',
          handler: () => {
            this.enterNew();
          }
        },
        {
          text: 'Paypal',
          handler: () => {
            this.confirmPaypal();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

   //  let alert = this.alertCtrl.create();
   // alert.setTitle('How would you like to pay?');
   //
   // if(this.payment_data.cardnumber != ''){
   //   alert.addInput({
   //     type: 'radio',
   //     label: 'Saved Card *******'+this.payment_data.cardnumber.substring(this.payment_data.cardnumber.length - 4),
   //     value: 'saved',
   //     checked: true
   //   });
   // }
   //
   // alert.addInput({
   //   type: 'radio',
   //   label: 'New Card',
   //   value: 'new'
   // });
   //
   // alert.addInput({
   //   type: 'radio',
   //   label: 'Paypal',
   //   value: 'paypal'
   // });
   //
   // alert.addButton('Cancel');
   // alert.addButton({
   //   text: 'Ok',
   //   handler: data => {
   //     console.log(data);
   //     if(data == 'saved') this.enterCVC();
   //     else if(data == 'paypal') this.confirmPaypal();
   //     else this.enterNew();
   //   }
   // });
   // alert.present();
  }

  verifyConfirmationPaypal(){
      if(this.transaction_status == 'completed'){
        this.general_loader.dismiss();

        this.alertCtrl.create({
          title: 'Transaction Succesful!',
          subTitle: 'You paid '+this.cash+' for '+this.noms+' noms',
          message: 'Enjoy your noms!',
          buttons: ['Ok']
        }).present();

        //this.getFriendBalance();

        this.af.list('/').update('Accountance', {
          'total': this.total + parseInt(this.cash)
        });

         this.af.list('/').update('Accountance', {
           'nomads': this.users_total + parseInt(this.cash)
         });

        this.af.list('Payments/'+firebase.auth().currentUser.uid).update(this.transaction_id, {'amount': this.cash});

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
        this.general_loader.dismiss();
        this.alertCtrl.create({title: 'Payment Error', message: 'There was an error processing your payment, try again later', buttons: ['Ok']}).present();
      }
  }



  verifyPayment(){
  this.general_loader.dismiss();
  this.general_loader = null;

  this.general_loader = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Verifying Payment...'
  })
  this.general_loader.present();
  this.verifyConfirmationPaypal();
}

  watchLink(){

  this.af.object('Fundings/currentProcess').snapshotChanges().subscribe(action => {
    if(action.payload.val()){
    console.log(action.payload.val());
    let a = action.payload.val();
    for(let key in a){
      this.paypal$ = a[key];

        if(this.paypal$.paid == true) this.transaction_status = 'completed';
        this.verifyPayment();

    }
  }
  else{
    // this.verifyPayment();
  }
  });
}

  paypalDone(){
    this.alertCtrl.create({
      title: 'Was everything ok with the paypal checkout?',
      message: 'We are asking this question so we can verify the payment and add the noms to your balance.',
      // message: 'Se te hará un cargo de  $'+this.quantity+' a la tarjeta que ingresaste',
      buttons: [
        {
          text: 'There was an error',
          handler: () => {
            this.general_loader.dismiss();
            this.navCtrl.pop()
                .then(()=> this.modalCtrl.create(AyudaPage).present());

          }
        },
        {
          text: 'Payment correct',
          handler: () =>{
            this.watchLink();
          }
        }
      ]
    }).present();
  }

  chargePaypal(){
  this.general_loader = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Loading...'
  })
  this.general_loader.present();
  this.af.list('Fundings/currentProcess').remove();
  this.af.list('paypal/current').remove();

  this.transaction_id = this.generateUUID();
  let qty = parseInt(this.cash);
  console.log(qty);

  let data = {
    amount: qty,
    uid: firebase.auth().currentUser.uid,
    t_id: this.transaction_id
  };

    this.http.post('https://us-central1-dev-nomads.cloudfunctions.net/pay/createPayment', data)
    .map(res => res.json())
    .subscribe(data => {
      //data = JSON.stringify(data);
      console.log('Response From Server: ' + data.links[1].href);
      this.link_payment = data.links[1].href;
      const browser = this.iab.create(data.links[1].href, '_blank');
      this.paypalDone();
    });
}

  confirmPaypal(){
    if(this.cash > 0){
      this.alertCtrl.create({
        title: 'Do you want to buy '+this.noms+' noms?',
        subTitle: 'You will be charged '+this.cash+' mxn',
        message: 'A paypal window will popup for you to checkout',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {

            }
          },
          {
            text: 'Proceed',
            handler: () =>{
              this.chargePaypal();
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

  checkExistA(indice){
    let a = this.activities;
    for(let key in a){
      if(a[key].index == indice){
        return true;
      }
    }
    return false;
  }


  getEarned(indice){
    let amount = 0;
    for(let i=0; i<this.transactions.length; i++){
      if(this.transactions[i].activity_id == indice){
        amount+= parseInt(this.transactions[i].amount);
      }
    }
    return amount;
  }

  convertActivities(){
    let a = this.a_response$;
    for(let key in a){
      if(this.checkExistA(a[key].index)){
        this.my_activities.push({
          'index': a[key].index,
          'title': a[key].title,
          'schedule': a[key].schedule,
          'fee': a[key].fee,
          'price': a[key].class_price,
          'total_earned': this.getEarned(a[key].index)
        });
      }
    }
    console.log(this.my_activities);
  }

  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.a_response$ = action.payload.val();
      this.my_activities = [];
      this.convertActivities();
    });
  }

  convertTransactions(){
    let a = this.t_response$;
    for(let key in a){
      this.transactions.push({
        'activity_id': (a[key].activity_id ? a[key].activity_id  : ''),
        'amount': a[key].amount,
        'index': a[key].index,
        'receiver_id': a[key].receiver_id
      });
    }
    this.transactions = this.transactions.filter(cat => cat.receiver_id == firebase.auth().currentUser.uid);
    console.log(this.transactions);
  }

  getTransactions(){
    this.af.object('transactions').snapshotChanges().subscribe(action => {
      this.t_response$ = action.payload.val();
      this.transactions = [];
      this.convertTransactions();
    });
  }

  ionViewDidLoad(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();

    this.af.object('Accountance/').snapshotChanges().subscribe(action => {
     this.total = action.payload.val().total;
     this.total = parseInt(this.total);
     this.users_total = action.payload.val().nomads;
     this.users_total = parseInt(this.users_total);
    });

    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
      this.user_code = this.users$.code;

      if(this.users$.payment){
        this.payment_data.cardnumber = this.users$.payment.cardnumber;
        this.payment_data.card_expiry = this.users$.payment.card_expiry;
        this.payment_data.cardholder = this.users$.payment.cardholder;
        this.payment_data.card_address = this.users$.payment.card_address;
      }

      if(this.users$.Activities_created){
        this.activities = this.users$.Activities_created;
      }

      if(this.general_loader) this.general_loader.dismiss();
    });
    this.getTransactions();
    if(this.activities != []) this.getActivities();
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
