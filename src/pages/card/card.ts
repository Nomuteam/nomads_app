import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
/**
 * Generated class for the AyudaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})
export class CardPage {
public general_loader: any;

public case: any = '';
public detalles: any = '';

public name: any;

public card: any = {
  'number': '',
  'month': '',
  'year': '',
  'cvc': ''
};

  constructor(public navCtrl: NavController,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();

    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.name = action.payload.val().name;
      if(this.general_loader) this.general_loader.dismiss();
    });
  }

  goBack(){
    this.viewCtrl.dismiss(this.card);
  }

  cardDigits(){
    return this.card.number.length <= 16;
  }

  monthDigits(){
    return this.card.month.length <= 2;
  }

  yearDigits(){
    return this.card.year.length <= 4;
  }

  cvcDigits(){
    return this.card.cvc.length <= 3;
  }

  validateCVC(){
    if(!this.cvcDigits() ){
      this.alertCtrl.create({
        title: 'Ups',
        message: 'It seems you entered an invalid card cvc. Try again',
        buttons: ['Ok']
      }).present();
      this.card.cvc = '';
    }
  }

  validateYear(){
    if(!this.yearDigits() ){
      this.alertCtrl.create({
        title: 'Ups',
        message: 'It seems you entered an invalid card expiry year. Try again',
        buttons: ['Ok']
      }).present();
      this.card.year = '';
    }
  }

  validateMonth(){
    if(!this.monthDigits() || parseInt(this.card.month) > 12 ){
      this.alertCtrl.create({
        title: 'Ups',
        message: 'It seems you entered an invalid card expiry month. Try again',
        buttons: ['Ok']
      }).present();
      this.card.month = '';
    }
  }

  validateNumber(){
    if(!this.cardDigits()){
      this.alertCtrl.create({
        title: 'Ups',
        message: 'It seems you entered an invalid card number. Try again',
        buttons: ['Ok']
      }).present();
      this.card.number = '';
    }
  }


  sendMsg(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Sending...'
    });
    this.general_loader.present();

    let ayuda = {'title': this.case, 'detalles': this.detalles, 'index': firebase.auth().currentUser.uid, 'name': this.name, 'date': new Date(), 'status': 'requested'};
    this.af.list('Help').push(ayuda)
    .then(() =>{
      this.general_loader.dismiss();
      this.alertCtrl.create({
        title: 'Help request sent!',
        subTitle: 'We will be in touch soon',
        message: 'As soon as possible, a nomads support team representant will be in touch with you',
        buttons: ['Ok']
      }).present();
      this.af.list('Notifications').push({'title': '¡Nueva solicitud de ayuda!', 'subtitle': this.name+' está reportando: '+this.case, 'index': 'wBUiQ1REArVr3OTpv8rEEN6xk4r1'});
      this.af.list('Notifications').push({'title': '¡Nueva solicitud de ayuda!', 'subtitle': this.name+' está reportando: '+this.case, 'index': 'xJV4WEYbsuMwHEy0mAfTiDHevAl2'});
      this.af.list('Notifications').push({'title': '¡Nueva solicitud de ayuda!', 'subtitle': this.name+' está reportando: '+this.case, 'index': 'HyZVVtZQ9qh8URORBBkI478ZPvy2'});
      this.goBack();
    })
  }

  selectCase(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Caso de Ayuda');

    alert.addInput({
      type: 'radio',
      label: 'App performance issue',
      value: 'App performance issue'
    });

    alert.addInput({
      type: 'radio',
      label: 'Payment issue',
      value: 'Payment issue'
    });

    alert.addInput({
      type: 'radio',
      label: 'Another problem',
      value: 'Another problem',
      checked: true
    });


  alert.addButton('Cancel');
  alert.addButton({
    text: 'Ok',
    handler: data => {
      this.case = data;
    }
  });
  alert.present();
  }

  canAdvance(){
    return this.card.number != '' && this.card.month != '' && this.card.year != '' && this.card.cvc != '';
  }

}
