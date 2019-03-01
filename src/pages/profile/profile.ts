import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { ChatsPage } from '../chats/chats';
import { WalletPage } from '../wallet/wallet';
import { MyeventsPage } from '../myevents/myevents';
import { FriendsPage } from '../friends/friends';
import { NotificationsPage } from '../notifications/notifications';
import { HistoryPage } from '../history/history';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { WelcomePage } from '../welcome/welcome';
import * as moment from 'moment';
import { AyudaPage } from '../ayuda/ayuda';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [AngularFireAuth]

})
export class ProfilePage {
public alumno$: any;
public general_loader: any;
public user_data: any=[];
public users$: any;
public noms_balance: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public afAuth: AngularFireAuth,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public socialSharing: SocialSharing,
    public camera: Camera,
    public sanitizer: DomSanitizer) {
  }

  openAyuda(){
  let modal = this.modalCtrl.create(AyudaPage);
  modal.present();
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  shareGeneral(){
    this.socialSharing.share('Hey! Join me on nōmu and get amazing gifts with my invitation code. Download the app and use my code: '+this.user_data.my_code, 'Nomads!')
        .then((entries) =>{
          console.log('success ', +JSON.stringify(entries));
        })
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

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  getBirthday(){
    let a = moment(this.user_data.birthdate).fromNow();
    a = a.charAt(0) + a.charAt(1) + ' years old';
    return a;
  }

  ionViewDidLoad() {
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.alumno$ = action.payload.val();

      this.user_data.initial = this.alumno$.first_name.charAt(0);
      this.user_data.first_name = this.alumno$.first_name;
      this.user_data.last_name = this.alumno$.last_name;
      this.user_data.country = this.alumno$.country;
      this.user_data.birthdate = this.alumno$.birthdate;
      this.user_data.email = this.alumno$.email;
      this.user_data.phone = this.alumno$.phone;
      this.user_data.my_code = this.alumno$.my_code;
      this.user_data.img = this.alumno$.img;
      this.noms_balance = this.alumno$.noms;
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
      this.navCtrl.push(MyeventsPage);
    }
    else if(pagina == 'cl'){
      this.navCtrl.parent.select(1);
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

  presentOptions() {
 let actionSheet = this.actionSheetCtrl.create({
   title: 'Chose an option for your profile picture',
   buttons: [
     {
       text: 'Take a picture',
       handler: () => {
         this.tomarFoto();
       }
     },{
       text: 'Upload a picture',
       handler: () => {
         this.escogerFoto();
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

uploadFoto(link){
  this.af.list('Users').update(firebase.auth().currentUser.uid, {
    'img': link
  }).then(() => this.general_loader.dismiss());
}

tomarFoto(){
   this.general_loader = this.loadingCtrl.create({
     spinner: 'bubbles',
     content: 'Uploading Picture...'
    });
   const options: CameraOptions={
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true
   }

   this.camera.getPicture(options).then(result => {
     this.general_loader.present();
     const image = `data:image/jpeg;base64,${result}`;

     const pictures = firebase.storage().ref('/Users/');
     pictures.child('pictures').child(this.generateUUID()).putString(image, 'data_url').then(kk=>{
       kk.ref.getDownloadURL().then(url => {
         this.uploadFoto(url);
       })
     });
   });
}
escogerFoto(){
this.general_loader = this.loadingCtrl.create({
  spinner: 'bubbles',
  content: 'Uploading Picture...'
 });

  const options: CameraOptions={
   quality: 50,
   sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
   destinationType: this.camera.DestinationType.DATA_URL,
   encodingType: this.camera.EncodingType.JPEG,
   correctOrientation: true
  }

  this.camera.getPicture(options).then(result => {
    this.general_loader.present();
    const image = `data:image/jpeg;base64,${result}`;

    const pictures = firebase.storage().ref('/Users/');
    pictures.child('pictures').child(this.generateUUID()).putString(image, 'data_url').then(kk=>{
      kk.ref.getDownloadURL().then(url => {
        this.uploadFoto(url);
      })
    });
  });}

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
