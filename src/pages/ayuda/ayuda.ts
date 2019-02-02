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
  selector: 'page-ayuda',
  templateUrl: 'ayuda.html',
})
export class AyudaPage {
public general_loader: any;

public case: any = '';
public detalles: any = '';

public name: any;

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
    this.viewCtrl.dismiss();
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
    return this.case != '' && this.detalles != '';
  }

}
