import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { LocatePage } from '../locate/locate';
import * as moment from 'moment';
declare var google;

/**
 * Generated class for the NeweventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editevent',
  templateUrl: 'editevent.html',
})
export class EditeventPage {
 public general_loader: any;
 public type: any;
 public current_index: any = 1;
 public event_data: any;
 public isClan: any = false;
 public GoogleAutocomplete: any = new google.maps.places.AutocompleteService();
 public autocompleteItems: any = [];

  constructor( public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public sanitizer: DomSanitizer,
    public modalCtrl: ModalController) {
     this.type = localStorage.getItem('Tipo');
     if(this.navParams.get('Clan')) this.isClan = true;

     this.event_data = this.navParams.get('Event');
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  selectSearchResult(item){
    this.event_data.location = item.description;
    this.autocompleteItems = [];
    this.seeCorrect();
  }

  updateSearchResults(){
  if (this.event_data.location == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.event_data.location },
	(predictions, status) => {
    this.autocompleteItems = [];
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
  });
  console.log(this.autocompleteItems);
}

  changeType(tipo){
    this.event_data.type = tipo;
  }

  seeCorrect(){
    if(this.event_data.location != ''){
      let modal = this.modalCtrl.create(LocatePage, {'Address': this.event_data.location});
          modal.onDidDismiss( data => {
            if(data && !data.correct) this.event_data.location = '';
          });
       modal.present();
    }
  }

  getType(tipo){
    return (this.event_data.type == tipo ? 'type-element selected' : 'type-element');
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  canAdvance(){
    return this.event_data.title != '' && this.event_data.day != '' && this.event_data.time != '' && this.event_data.location != '' && this.event_data.difficulty != '' && this.event_data.img != '' && this.event_data.about_event != '' && this.event_data.provided != '' && this.event_data.about_organizer != '' && this.event_data.spaces_available != '' && this.event_data.cost != '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NeweventPage');
  }

  createEvent(){
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Creating...'
    });
    this.general_loader.present();

    let indice = this.event_data.index;
    this.event_data.creator = firebase.auth().currentUser.uid;

    this.af.list('Users/'+firebase.auth().currentUser.uid+'/Events').update(indice, {
      'index': indice,
      'isOwner': true
    });
    this.af.list('Events').update(indice, this.event_data)
        .then(() => {
          this.general_loader.dismiss();
          this.alertCtrl.create({
            title: 'Event Updated',
            message: 'Your event was updated succesfully',
            buttons: ['Ok']
          }).present();
          this.navCtrl.pop();
        })
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

   avisarNoms(){
     console.log('hi');
     this.alertCtrl.create({
       title: 'Cost in NOMS',
       subTitle: 'Making the conversion',
       message: 'The cost in noms is: '+(this.event_data.cost/20)+' noms since 1 NOM = $20 MXN',
       buttons: [
        {
        text: 'Ok',
        handler: () =>{
          this.event_data.cost = this.event_data.cost / 20;
        }
        }
         ]
     }).present();
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

         const pictures = firebase.storage().ref('/Events/');
         pictures.child('pictures').child(this.generateUUID()).putString(image, 'data_url').then(kk=>{
           kk.ref.getDownloadURL().then(url => {
             vm.general_loader.dismiss();
             if(vm.current_index == 1)  vm.event_data.img = url;
             else vm.event_data.media.push({'url': url});
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

        const pictures = firebase.storage().ref('/Events/');
        pictures.child('pictures').child(this.generateUUID()).putString(image, 'data_url').then(kk=>{
          kk.ref.getDownloadURL().then(url => {
            vm.general_loader.dismiss();
            if(vm.current_index == 1)  vm.event_data.img = url;
            else vm.event_data.media.push({'url': url});
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


}
