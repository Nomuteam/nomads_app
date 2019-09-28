import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { LocatePage } from '../locate/locate';
import * as moment from 'moment';
declare var google;
import { NewactPage } from '../newact/newact';

/**
 * Generated class for the NewstudioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newstudio',
  templateUrl: 'newstudio.html',
})
export class NewstudioPage implements OnInit{
  public current_index: any = 1;
  public general_loader: any;
  public type: any;
  public event_data: any = {
    'title': '',
    'day': '',
    'time': '',
    'location': '',
    'difficulty': '',
    'img': 'https://images.pexels.com/photos/1246953/pexels-photo-1246953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'about_event': '',
    'provided': '',
    'about_organizer': '',
    'spaces_available': '',
    'cost': '0',
    'type': 'public',
    'media': [],
    'nomads': []
  }

  public studio_data: any = {
    'name': '',
    'location': '',
    'description': '',
    'amenities': '',
    'useful_notes': '',
    'membership_cost': '0',
    'logo': '',
    'index': '',
    'schedule': [
      {
       'letter': 'M',
        'text': 'Monday',
        'selected': false
      },
      {
       'letter': 'T',
        'text': 'Tuesday',
        'selected': false
      },
      {
       'letter': 'W',
        'text': 'Wednesday',
        'selected': false
      },
      {
       'letter': 'T',
        'text': 'Thursday',
        'selected': false
      },
      {
       'letter': 'F',
        'text': 'Friday',
        'selected': false
      },
      {
       'letter': 'S',
        'text': 'Saturday',
        'selected': false
      },
      {
       'letter': 'S',
        'text': 'Sunday',
        'selected': false
      },
    ],
    'creator': firebase.auth().currentUser.uid,
    'opening': '',
    'closing': '',
    'activities': []
  };
  public GoogleAutocomplete: any = new google.maps.places.AutocompleteService();
  public autocompleteItems: any = [];

  public classes: any = [
    // {
    //   'start_time': '7:00',
    //   'end_time': '8:00',
    //   'title': 'Hatha Yoga'
    // }
  ];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public sanitizer: DomSanitizer,
    public modalCtrl: ModalController) {
  }

  seeCorrect(){
    if(this.studio_data.location != ''){
      let modal = this.modalCtrl.create(LocatePage, {'Address': this.studio_data.location});
          modal.onDidDismiss( data => {
            if(data && !data.correct) this.studio_data.location = '';
          });
       modal.present();
    }
  }

  select

  getClass2(selected){
    return selected ? 'day-letter selected' : 'day-letter';
  }

  selectSearchResult(item){
    this.studio_data.location = item.description;
    this.autocompleteItems = [];
    this.seeCorrect();
  }

  updateSearchResults(){
  if (this.studio_data.location == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.studio_data.location },
  (predictions, status) => {
    this.autocompleteItems = [];
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
  });
  console.log(this.autocompleteItems);
}

  getClass(indice){
    return (this.current_index >= indice ? 'status-element selectedrose' : 'status-element');
  }

  guardarStudio(){
    this.general_loader = this.loadingCtrl.create({
      content: 'Creating studio...',
      spinner: 'bubbles'
    });
    console.log('studio a guardar', this.studio_data);
    //this.general_loader.present();
    this.af.list('Studios').update(this.studio_data.index, this.studio_data)
        .then(()=>{
          this.general_loader.dismiss();
          this.alertCtrl.create({
            title: 'Studio created!',
            message: 'You will find the details and classes inside the event'
          }).present();
          this.navCtrl.pop();
        });
  }


  canAdvance(){
    if(this.current_index == 1){
      return this.studio_data.name != '' && this.studio_data.location != '' && this.studio_data.description != '' && this.studio_data.amenities != '' && this.studio_data.useful_notes != '';
    }
    else if(this.current_index == 2){
      return this.studio_data.opening != '' && this.studio_data.closing != '' && this.studio_data.schedule.filter(d => d.selected).length > 0;
    }
  }

  saveStudio(){
    this.studio_data.index = this.generateUUID();
    this.current_index = 2;
  }

  addClass(){
    localStorage.setItem('studio-index', this.studio_data.index);
    this.navCtrl.push(NewactPage, {'location': this.studio_data.location});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewstudioPage');
  }

  ionViewWillEnter(){
    console.log(1);
    if(localStorage.getItem('studio-act')){
      let aux = JSON.parse(localStorage.getItem('studio-act'));
      console.log(aux);
      

      let flag = true;
      /*
      this.studio_data.activities.forEach(element => {
        if(element.index != null){
          arrayAux.push(element);
        }
      });
      
      this.studio_data.activities= arrayAux;
      */
      this.studio_data.activities.forEach(element => {
        
        if(element.index == aux.index){
          flag = false;
        }
        
      });
      if(flag && aux.index != null){
        this.classes.push(aux);
        this.studio_data.activities.push({
          'index': aux.index
        });
      }
      
    }
  }

  ngOnInit() {
    console.log(2);
    localStorage.setItem('studio-act', JSON.stringify([]));;
  }

  avisarNoms(){
    console.log('hi');
    if(this.studio_data.membership_cost){
      this.alertCtrl.create({
        title: 'Cost in NOMS',
        subTitle: 'Making the conversion',
        message: 'The cost in noms is: '+(this.studio_data.membership_cost/20)+' noms since 1 NOM = $20 MXN',
        buttons: [
         {
         text: 'Ok',
         handler: () =>{
           this.studio_data.membership_cost = this.studio_data.membership_cost / 20;
         }
         }
          ]
      }).present();
    }
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

         const pictures = firebase.storage().ref('/Activities/');
         pictures.child('pictures').child(this.generateUUID()).putString(image, 'data_url').then(kk=>{
           kk.ref.getDownloadURL().then(url => {
             this.general_loader.dismiss();
             this.studio_data.logo = url;
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

        const pictures = firebase.storage().ref('/Activities/');
        pictures.child('pictures').child(this.generateUUID()).putString(image, 'data_url').then(kk=>{
          kk.ref.getDownloadURL().then(url => {
            this.general_loader.dismiss();
             this.studio_data.logo = url;
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
