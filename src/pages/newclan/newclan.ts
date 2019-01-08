import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the NewclanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newclan',
  templateUrl: 'newclan.html',
})
export class NewclanPage {
public general_loader: any;
public clan_data: any = {
  'name': '',
  'description': '',
  'rules': '',
  'location': '',
  'img': 'https://images.pexels.com/photos/1246953/pexels-photo-1246953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'type': 'public',
  'secret_code': '',
  'members': []
};

  constructor(  public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera) {
  }

  changeType(tipo){
    this.clan_data.type = tipo;
  }

  getType(tipo){
    return (this.clan_data.type == tipo ? 'type-element selected' : 'type-element');
  }

  isSecret(tipo){
    return (tipo == 'secret' || tipo == 'private' ? this.clan_data.secret_code != '' : true);
  }

  canCreate(){
    return (this.clan_data.name != '' && this.clan_data.description != '' && this.clan_data.rules != '' && this.clan_data.location != '' && this.isSecret(this.clan_data.type))
  }

  createClan(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Creating...'
    });
    this.general_loader.present();
    let indice = this.generateUUID();
    this.clan_data.owner = firebase.auth().currentUser.uid;
    this.clan_data.created_at = new Date();
    this.clan_data.members.push({
      'index': this.clan_data.owner,
      'isOwner': true
    });
    this.clan_data.index = indice;
    this.af.list('Users/'+firebase.auth().currentUser.uid+'/Clans').update(indice, {
      'index': indice,
      'isOwner': true
    });
    this.af.list('Clans').update(indice, this.clan_data)
     .then(() =>{
       this.general_loader.dismiss();
       this.navCtrl.pop();
     });
  }

  presentOptions() {
     let actionSheet = this.actionSheetCtrl.create({
       title: 'What would you like?',
       buttons: [
         {
           text: 'Take a picture',
           handler: () => {
             this.tomarFoto();
           }
         },{
           text: 'Select a picture',
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
  tomarFoto(){
    let vm = this;
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

         const pictures = firebase.storage().ref('/Clans/');
         pictures.child('pictures').child('main').putString(image, 'data_url').then(kk=>{
           kk.ref.getDownloadURL().then(url => {
             vm.general_loader.dismiss();
             vm.clan_data.img = url;
           })
         });
       });
   }
  escogerFoto(){
    let vm = this;
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

        const pictures = firebase.storage().ref('/Clans/');
        pictures.child('pictures').child('main').putString(image, 'data_url').then(kk=>{
          kk.ref.getDownloadURL().then(url => {
            vm.general_loader.dismiss();
            vm.clan_data.img = url;
            //this.fotos[this.fotos.length] = url;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewclanPage');
  }

}
