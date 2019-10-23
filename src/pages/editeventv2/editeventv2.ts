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
 * Generated class for the Editeventv2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editeventv2',
  templateUrl: 'editeventv2.html',
})
export class Editeventv2Page {
  public general_loader: any;
  public type: any;
  public current_index: any = 0;
  public event_data: any = {
   'cancelation_policy': '',
    'title': '',
    'day': '',
    'time': '',
    'location': '',
    'difficulty': '',
    'img': 'https://firebasestorage.googleapis.com/v0/b/dev-nomads.appspot.com/o/nomu%20blanco%20333%20(1).png?alt=media&token=54ee504d-91b8-4eaf-a637-27e59a3de25b',
    'about_event': '',
    'provided': '',
    'about_organizer': '',
    'spaces_available': '',
    'cost': '',
    'type': 'public',
    'media': [],
    'nomads': [],
    'e_type': '',
    'repeats': '',
    'noms': 0,
  }
  public isClan: any = false;
  public GoogleAutocomplete: any = new google.maps.places.AutocompleteService();
  public autocompleteItems: any = [];
 
  public days: any = [
    {
      'day': 'Monday',
      'ab': 'Mon',
      'selected': false,
      'number': 0
    },
    {
      'day': 'Tuesday',
      'ab': 'Tue',
      'selected': false,
      'number': 1
    },
    {
      'day': 'Wednesday',
      'ab': 'Wed',
      'selected': false,
      'number': 2
    },
    {
      'day': 'Thursday',
      'ab': 'Thu',
      'selected': false,
      'number': 3
    },
    {
      'day': 'Friday',
      'ab': 'Fri',
      'selected': false,
      'number': 4
    },
    {
      'day': 'Saturday',
      'ab': 'Sat',
      'selected': false,
      'number': 5
    },
    {
      'day': 'Sunday',
      'ab': 'Sun',
      'selected': false,
      'number': 6
    },
  ]
 
  public e_type: any = '';
 
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
      if(this.event_data.media == null){
        this.event_data.media = [{'url': this.event_data.img}];
      }

      if(this.event_data.media.length == 0){
        this.event_data.media = [{'url': this.event_data.img}];
      }

      console.log('evento seleccionado',this.event_data);
   }
 

   getClass(element){
     return element ? 'day' : 'day no';
   }
 
   changeSelected(indice){
    this.days[indice].selected ? this.days[indice].selected = false : this.days[indice].selected = true;
   }
 
   goOut(){
     this.alertCtrl.create({
       title: 'Warning',
       message: 'Do you want to quit creating this activity?',
       buttons: [{
         text: 'Cancel',
         handler: () => {
 
         }
       },
       {
         text: 'Exit',
         handler: () => {
           this.navCtrl.pop();
         }
       }
      ]
    }).present();
   }
 
   sanitizeThis(image){
     return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
   }
 
   getClassType(tipo){
     return this.event_data.e_type == tipo ? 'type selected' : 'type';
   }
 
   changeTypeE(tipo){
     this.event_data.e_type = tipo;
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
 
   verifyMini(){
     if(parseInt(this.event_data.spaces_available)<2){
       this.alertCtrl.create({
         title: 'We need more spaces available',
         message: 'In order to create this event, you need at least 2 spaces avaible in this event',
         buttons: ['Ok']
       }).present();
     }
   }
 
   canAdvance(){
     if(this.current_index == 0){
       return this.event_data.e_type != '';
     }
     else if(this.current_index == 1){
       return this.event_data.title != '' && this.event_data.location != '' && this.event_data.img != '' && this.event_data.about_event != '' && this.event_data.provided != '' && this.event_data.about_organizer != '' && this.event_data.spaces_available != '' && this.event_data.cost != '';
     }
     else if(this.current_index == 2){
       return this.event_data.day != '' && this.event_data.time != '';
     }
   }
 
   ionViewDidLoad() {
     console.log('ionViewDidLoad NeweventPage');
   }
 
   needsPic(){
     if(this.event_data.media == null){
       return false;
     }
     return this.event_data.media.length > 0;
   }
 
   createEvent(){
     this.general_loader = this.loadingCtrl.create({
       spinner: 'bubbles',
       content: 'Creating...'
     });
     this.general_loader.present();
 
     let indice = this.generateUUID();
     this.event_data.img = this.event_data.media[0].url;
     this.event_data.creator = firebase.auth().currentUser.uid;
     this.event_data.index = indice;
     this.event_data.nomads.push({
       'index': this.event_data.creator,
       'isOwner': true,
       'date': this.event_data.day,
       'day': moment(this.event_data.day).format('dddd'),
       'time': this.event_data.time
     });
     this.af.list('Users/'+firebase.auth().currentUser.uid+'/schedule').push({
       'activity_id': indice,
       'date': this.event_data.day,
       'day': moment(this.event_data.day).format('dddd'),
       'time': this.event_data.time
     });
     this.af.list('Users/'+firebase.auth().currentUser.uid+'/Events').update(indice, {
       'index': indice,
       'isOwner': true
     });
     this.af.list('Events').update(indice, this.event_data)
         .then(() => {
           this.general_loader.dismiss();
           this.alertCtrl.create({
             title: 'Event Created',
             message: 'Your event was created succesfully',
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
      return;
 
      /*
      if(this.event_data.cost){
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
 
      */
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
 