import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { Stripe } from '@ionic-native/stripe';

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
public general_loader: any;
public current_index: any = 1;
public user_type: any = '';
public message: any = 'You are almost there, tell us more about you.';

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
    'name': 'Experience',
    'selected': false
  },
  {
    'name': 'Studios',
    'selected': false
  },
];

public user_data: any = {
   'first_name': '',
   'last_name': '',
   'birthdate': '',
   'country': '',
   'payment':
     {
       'cardholder': ' ',
       'cardnumber': '4242424242424242',
       'card_expiry': '2020-12',
       'card_ccv': '220',
       'card_address': ''
     },
    'preferences': {
      'categories': [],
      'level': '',
      'distance': '',
      'allday': false
    },
    'business': {
      'business_name': '',
      'legal_name': '',
      'phone': '',
      'billing_address': '',
      'rfc': '',
      'bank': '',
      'clabe': ''
    },
    'info_complete': false
  };
  public example_activities: any = [
    {
      'title': 'Yoga',
      'selected': false
    },
    {
      'title': 'Muay Thai',
      'selected': false
    },
    {
      'title': 'Calisthenics',
      'selected': false
    },
    {
      'title': 'HIIT',
      'selected': false
    },
    {
      'title': 'Hiking',
      'selected': false
    },
  ];
  public example_forms: any = [
    {
      'title': 'Aerobic',
      'selected': false
    },
    {
      'title': 'Strength',
      'selected': false
    },
    {
      'title': 'Agility',
      'selected': false
    },
    {
      'title': 'Endurance',
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
public card: any = {
 number: '5579070085401951'
};
public testing_1 = '55790700854019';
public class_type = 'input-field card';

  constructor(  public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public stripe: Stripe) {
    localStorage.setItem('walk_progress', 'incomplete');
    this.user_type = this.navParams.get('User');
    localStorage.setItem('user_type', this.user_type);
    // this.alertCtrl.create({
    //   title: this.user_data.payment.cardholder,
    //   buttons:  ['Ok']
    // }).present();
  }

  getCardC(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Validating...'
    });
    this.general_loader.present();

    this.stripe.validateCVC(this.user_data.payment.card_ccv)
    .then(token => {
      this.general_loader.dismiss();
      this.alertCtrl.create({title: 'Validated CVC', message: 'Looks like you entered a correct CVC', buttons: ['Ok']}).present();
    })
    .catch(error => {
      this.general_loader.dismiss();
      this.alertCtrl.create({title: 'Incorrect CVC', message: 'Looks like you entered an invalid CVC', buttons: ['Ok']}).present();
      this.user_data.payment.card_ccv = '';
    });
  }

  getDateT(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Validating...'
    });
    this.general_loader.present();

    let expMonth = this.user_data.payment.card_expiry.slice(5);
    let expYear = this.user_data.payment.card_expiry.slice(0, 4);

    this.stripe.validateExpiryDate(expMonth, expYear)
    .then(token => {
      this.general_loader.dismiss();
      this.alertCtrl.create({title: 'Validated Expiry Date', message: 'Looks like you entered a correct expiry date', buttons: ['Ok']}).present();
    })
    .catch(error => {
      this.general_loader.dismiss();
      this.alertCtrl.create({title: 'Incorrect Expiry Date', message: 'Looks like you entered an invalid expiry date', buttons: ['Ok']}).present();
      this.user_data.payment.card_expiry = '';
    });
  }

  getCardT(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Validating...'
    });
    this.general_loader.present();

    this.stripe.validateCardNumber(this.user_data.payment.cardnumber)
    .then(token => {
      this.stripe.getCardType(this.user_data.payment.cardnumber)
         .then(token => {
           this.class_type = 'input-field card';
           this.general_loader.dismiss();
           this.class_type += ' '+token.toString().toLowerCase();
         })
         .catch(error => {
           this.general_loader.dismiss();
           this.alertCtrl.create({title: 'Server Error', message: 'We are experiencing some connection issues, try again later', buttons: ['Ok']}).present();
         });
    })
    .catch(error => {
      this.general_loader.dismiss();
      this.alertCtrl.create({title: 'Incorrect Number', message: 'Looks like you entered an invalid card number', buttons: ['Ok']}).present();
      this.user_data.payment.cardnumber = '';
    });

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

  getAct(indice){
    if(this.user_type == 'nomads'){
        return ( this.example_activities[indice].selected ? 'likes-element selected' : 'likes-element');
    }
    else{
        return ( this.example_activities[indice].selected ? 'likes-element selectedrose' : 'likes-element');
    }

  }

  addAct(indice){
    if(this.example_activities[indice].selected){
      this.example_activities[indice].selected = false;
    }
    else{
      this.example_activities[indice].selected = true;
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
      return (this.user_data.first_name != '' && this.user_data.last_name != '' && this.user_data.birthdate != '' && this.user_data.country != '');
    }
    else if(this.current_index == 2){
      return true;
      // return (this.user_data.payment.cardholder != '' && this.user_data.payment.cardnumber != '' && this.user_data.payment.card_expiry != '' && this.user_data.payment.card_ccv != '' && this.user_data.payment.card_address != '')
    }
    else if(this.current_index == 3 && this.user_type == 'nomads'){
      return (this.example_activities.filter(value => value.selected === true).length > 0);
      // return (this.example_activities.filter(value => value.selected === true).length > 0 && this.level != '' && this.user_data.preferences.distance != '');
    }
    else if(this.current_index == 3 && this.user_type == 'allies'){
      return (this.user_data.business.business_name != '' && this.user_data.business.legal_name != '' && this.user_data.business.phone != '' && this.user_data.business.billing_address != '' && this.user_data.business.rfc != '' && this.user_data.business.bank != '' && this.user_data.business.clabe != '')
    }
  }

  btnClass(type){
    let aux = type+'-btn';
    if(this.user_type == 'nomads'){
      return aux;
    }
    else{
      return aux+' selectedrose';
    }
  }

  next(){
    if(this.current_index == 3){
       this.user_data.preferences.categories = this.example_cats; //.filter(cat => cat.selected);
       this.user_data.preferences.types = this.example_activities;
       this.user_data.preferences.forms = this.example_forms;
       this.user_data.preferences.schedule = this.example_schedule;
       this.user_data.preferences.days = this.example_days;

       this.user_data.info_complete = true;
       console.log(this.user_data);
       this.af.list('/Users/').update(firebase.auth().currentUser.uid, this.user_data)
       .then( () => {
         localStorage.setItem('walk_progress', 'complete');
         this.navCtrl.setRoot(TabsPage);
       })
    }
    else{
      this.current_index++;
      if(this.current_index == 3 && this.user_type == 'nomads'){
        this.message = 'These are the filters we use to give you the best recommedations. Change them anytime'
      }
    }
  }

  back(){
    this.current_index--;
    if(this.message == 'These are the filters we use to give you the best recommedations. Change them anytime'){
      this.message = 'You are almost there, tell us more about you.';
    }
  }

}
