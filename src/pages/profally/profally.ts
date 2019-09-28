import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController, ModalController  } from 'ionic-angular';
import { ChatsPage } from '../chats/chats';
import { WalletPage } from '../wallet/wallet';
import { MyeventsPage } from '../myevents/myevents';
import { FriendsPage } from '../friends/friends';
import { NotificationsPage } from '../notifications/notifications';
import { HistoryPage } from '../history/history';
import { MynomadsPage } from '../mynomads/mynomads';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import * as moment from 'moment';
import { WelcomePage } from '../welcome/welcome';
import { AyudaPage } from '../ayuda/ayuda';
import { ReservationsPage } from '../reservations/reservations';
import { AllactivitiesPage } from '../allactivities/allactivities';

/**
 * Generated class for the ProfallyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profally',
  templateUrl: 'profally.html',
  providers: [AngularFireAuth]
})
export class ProfallyPage {
public alumno$: any;
public user_data: any=[];
public general_loader: any;


  constructor(
       public navCtrl: NavController,
       public navParams: NavParams,
       public af: AngularFireDatabase,
       public loadingCtrl: LoadingController,
       public alertCtrl: AlertController,
       public afAuth: AngularFireAuth,
       public appCtrl: App,
       public actionSheetCtrl: ActionSheetController,
       public modalCtrl: ModalController) {
  }

  openAyuda(){
  let modal = this.modalCtrl.create(AyudaPage);
  modal.present();
  }

  openReservations(){
    this.navCtrl.push(ReservationsPage);
  }


  bankInfo(){
    const prompt = this.alertCtrl.create({
    title: 'Bank Info',
    message: 'This is the bank account where you will receive your earnings.',
    inputs: [
      {
        name: 'clabe',
        placeholder: 'CLABE',
        value: this.user_data.clabe
      },
      {
        name: 'rfc',
        placeholder: 'RFC',
        value: this.user_data.rfc
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Update',
        handler: data => {
          this.af.list('Users/'+firebase.auth().currentUser.uid).update('business', {
            'clabe': data.clabe,
            'rfc': data.rfc
          }).then(()=>{
            this.alertCtrl.create({
              title: 'Bank Info Updated!',
              message: 'Your info was succesfully updated',
              buttons: ['Ok']
            }).present();
          })
        }
      }
    ]
  });
  prompt.present();
  }

  presentActionSheet(){
    const actionSheet = this.actionSheetCtrl.create({
  title: 'Choose an Option',
  buttons: [
    {
      text: 'Help Center',
      handler: () => {
        this.openAyuda();
      }
    },
    {
      text: 'Edit Bank Info',
      handler: () => {
        this.bankInfo();
      }
    },
    {
      text: 'Logout',
      handler: () => {
        this.logOut();
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
  }

  getBirthday(){
    return moment(this.user_data.birthdate).fromNow();
  }

  ionViewDidLoad() {
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.alumno$ = action.payload.val();

      this.user_data.first_name = this.alumno$.first_name;
      this.user_data.last_name = this.alumno$.last_name;
      this.user_data.email = this.alumno$.email;
      this.user_data.phone = this.alumno$.phone;
      this.user_data.business_name = this.alumno$.business.business_name;
      this.user_data.legal_name = this.alumno$.business.legal_name;

      this.user_data.clabe = this.alumno$.business.clabe;
      this.user_data.rfc = this.alumno$.business.rfc;

      if(this.general_loader) this.general_loader.dismiss();
    });
    console.log(this.user_data);
  }

  openPage(pagina){
    if(pagina == 'c'){
      this.navCtrl.push(ChatsPage);
    }
    else if(pagina == 'w'){
      this.navCtrl.push(WalletPage);
    }
    else if(pagina == 'e'){
      //this.navCtrl.push(MyeventsPage);
      this.navCtrl.push(AllactivitiesPage);
    }
    else if(pagina == 'cl'){
      this.navCtrl.push(MynomadsPage);
    }
    else if(pagina == 'f'){
      this.navCtrl.push(FriendsPage);
    }
    else if(pagina == 'n'){
      this.navCtrl.push(NotificationsPage);
    }
    else if(pagina == 'h'){
      this.navCtrl.push(HistoryPage);
    }
  }

  logOut(){
    this.afAuth.auth.signOut();
    this.appCtrl.getRootNav().setRoot(WelcomePage);
  }

}
