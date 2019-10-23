import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { LocatePage } from '../locate/locate';
import { Content } from 'ionic-angular';
declare var google;

/**
 * Generated class for the NewactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editact',
  templateUrl: 'editact.html',
})
export class EditactPage {
  @ViewChild(Content) content: Content;
  public current_index: any = 1;
  public user_type: any = '';
  public isAdding: any = false;
  public general_loader: any;

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
      'name': 'Adventures',
      'selected': false
    },
    {
      'name': 'Studios',
      'selected': false
    },
    {
      'name': 'Academy',
      'selected': false
    },
  ];
  public example_activities: any = [
    {
      'title': 'Yoga'
    },
    {
      'title': 'Muay Thai'
    },
    {
      'title': 'Calisthenics'
    },
    {
      'title': 'HIIT'
    },
    {
      'title': 'Hiking'
    },
    {
      'title': 'Gym'
    },
    {
      'title': 'Spinning'
    },
    {
      'title': 'Box'
    },
    {
      'title': 'Rock Climbing'
    },
    {
      'title': 'Pilates'
    },
    {
      'title': 'Capoeira'
    },
    {
      'title': 'Movement'
    },
    {
      'title': 'Functional Training'
    },
    {
      'title': 'Cardio'
    },
    {
      'title': 'Movement'
    },
    {
      'title': 'Martial Arts'
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
    {
      'title': 'Flexibility',
      'selected': false
    },
    {
      'title': 'Resistance',
      'selected': false
    },
    {
      'title': 'Relaxation',
      'selected': false
    },
    {
      'title': 'Recovery',
      'selected': false
    },
  ];
  public example_days: any = [
    {
      'day': 'L',
      'title': 'Monday',
      'selected': false,
      'order': 1
    },
    {
      'day': 'M',
      'title': 'Tuesday',
      'selected': false,
      'order': 2
    },
    {
      'day': 'M',
      'title': 'Wednesday',
      'selected': false,
      'order': 3
    },
    {
      'day': 'J',
      'title': 'Thursday',
      'selected': false,
      'order': 4
    },
    {
      'day': 'V',
      'title': 'Friday',
      'selected': false,
      'order': 5
    },
    {
      'day': 'S',
      'title': 'Saturday',
      'selected': false,
      'order': 6
    },
    {
      'day': 'D',
      'title': 'Sunday',
      'selected': false,
      'order': 7
    },
  ];

  public activity_data: any;

  public schedule: any = {
     'start_time': '',
     'duration': '',
     'spaces_available': '',
     'gender': 'Both',
     'level': 'All',
     'min_age': '',
     'max_age': ''
   }

   public GoogleAutocomplete: any = new google.maps.places.AutocompleteService();
   public autocompleteItems: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public sanitizer: DomSanitizer,
    public modalCtrl: ModalController) {
    this.activity_data = this.navParams.get('Act');
  }

  addButtonClick(){
    this.isAdding = true;
    this.content.scrollToTop();
  }

  confirmRF(indice){
    this.alertCtrl.create({
      title: 'Do you want to remove this picture?',
      message:  'It will no longer be available.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //this.openActivity(act);
          }
        },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => {
            if(this.activity_data.media.length > 0) this.confirmRemoveP(indice);
            else this.alertCtrl.create({title: 'Only picture', message: 'You cant delete this picture since it is the only one', buttons: ['Ok']}).present();
          }
        },
      ]
    }).present();
  }

  confirmRemoveP(indice){
    this.activity_data.media.splice(indice, 1);
  }

  selectSearchResult(item){
    this.activity_data.location = item.description;
    this.autocompleteItems = [];
    this.seeCorrect();
  }

  updateSearchResults(){
  if (this.activity_data.location == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.activity_data.location },
  (predictions, status) => {
    this.autocompleteItems = [];
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
  });
  console.log(this.autocompleteItems);
}

  seeCorrect(){
    if(this.activity_data.location != ''){
      let modal = this.modalCtrl.create(LocatePage, {'Address': this.activity_data.location});
          modal.onDidDismiss( data => {
            if(data && !data.correct) this.activity_data.location = '';
          });
       modal.present();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewactPage');
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  eraseSchedule(indice){
    this.activity_data.schedule.splice(indice, 1);
  }

  changeLevel(){
    if(this.schedule.level == 'Beginner'){
      this.schedule.level = 'Intermediate';
    }
    else if(this.schedule.level == 'Intermediate'){
      this.schedule.level = 'Expert';
    }
    else if(this.schedule.level == 'Expert'){
      this.schedule.level = 'All';
    }
    else if(this.schedule.level == 'All'){
      this.schedule.level = 'Beginner';
    }
  }

  withMagic(){
    let aux = this.example_days.filter(cat => cat.selected);
    let a = this.schedule;
    let verify_switch = true;
    this.isAdding = false;

    for(let i=0; i<aux.length; i++){
      if(this.activity_data.schedule.filter( dia => aux[i].title == dia.day && dia.start_time == a.start_time).length > 0) verify_switch = false;
    }

    if(verify_switch){
      for(let i=0; i<aux.length; i++){
        this.activity_data.schedule.push({
         'day': aux[i].title,
         'start_time': a.start_time,
         'duration': a.duration,
         'spaces_available': a.spaces_available,
         //'space': a.space,
         'gender': a.gender,
         'level': a.level,
         'min_age': a.min_age,
         'max_age': a.max_age,
         'order': aux[i].order
        });
      }

      this.activity_data.schedule = this.activity_data.schedule.sort(function(a, b){
        var keyA = a.order,
            keyB = b.order;
         // Compare the 2 dates
         if(keyA < keyB) return -1;
         if(keyA > keyB) return 1;
         return 0;
      });

    }
    else{
      this.alertCtrl.create({
        title: 'Existing Schedule',
        buttons: ['Ok']
      }).present();
    }

  }

  changeGender(){
    if(this.schedule.gender == 'Female'){
      this.schedule.gender = 'Male';
    }
    else if(this.schedule.gender == 'Male'){
      this.schedule.gender = 'Both';
    }
    else if(this.schedule.gender == 'Both'){
      this.schedule.gender = 'Female';
    }
  }

  addForm(indice){
    if(!this.example_forms[indice].selected){
        this.example_forms[indice].selected = true;
        this.activity_data.categories.workout_form = this.example_forms[indice].title;
    }
    else{
        this.example_forms[indice].selected = false;
        if(this.example_forms.filter(f=>f.selected).length == 0){
            this.activity_data.categories.workout_form = '';
        }
    }
  }

  isForm(forma){
    for(let key in this.activity_data.categories.workout_form){
      if(this.activity_data.categories.workout_form[key].title == forma) return true;
    }
    return false;
  }

  getForm(indice){
      if(this.isForm(this.example_forms[indice].title)) this.example_forms[indice].selected = true;
      return ( this.example_forms[indice].selected ? 'likes-element selectedrose' : 'likes-element');
  }

  getActivity(titulo){
      return ( this.activity_data.categories.activity_type == titulo ? 'likes-element selectedrose' : 'likes-element');
  }

  addActivity(titulo){
    this.activity_data.categories.activity_type = titulo
  }

  getCategorie(titulo){
    return ( this.activity_data.categories.main_category == titulo ? 'likes-element selectedrose' : 'likes-element');
  }

  addCategorie(titulo){
    this.activity_data.categories.main_category = titulo
  }

  selectDay(indice){
    let aux = this.example_days[indice].selected;
    aux ? this.example_days[indice].selected = false : this.example_days[indice].selected = true;
  }

  getSelected(selected){
    return ( selected ? 'likes-element selectedrose' : 'likes-element purple');
  }

  getClass(indice){
    return (this.current_index >= indice ? 'status-element selectedrose' : 'status-element');
  }

  canAdvance(){
    if(this.current_index == 2){
      return (this.activity_data.title != '' && this.activity_data.location != '' && this.activity_data.description != '' && this.activity_data.cancelation_policy != '' && this.activity_data.class_price != '');
    }
    else if(this.current_index == 1){
      return ( this.activity_data.categories.activity_type  != '' && this.activity_data.categories.workout_form  != '')
    }
    else if(this.current_index == 3){
      return (this.activity_data.schedule.length > 0);
    }
    return true;
  }

  doMagic(){
    if(this.activity_data.media.length == 0){
      this.activity_data.media.push({
        'url': 'https://images.pexels.com/photos/685534/pexels-photo-685534.jpeg?cs=srgb&dl=athletes-endurance-energy-685534.jpg&fm=jpg'
      });
    }
    this.activity_data.img = this.activity_data.media[0].url;

    let indice = this.activity_data.index;
    this.activity_data.categories.workout_form = this.example_forms.filter(form => form.selected);
    this.activity_data.creator = firebase.auth().currentUser.uid;

    console.log(this.activity_data);
    
    this.af.list('Activities').update(indice, this.activity_data)
      .then( () =>{
        this.general_loader.dismiss();
        this.alertCtrl.create({
          title: 'Activity Updated',
          message: 'Your activity was updated succesfully',
          buttons: ['Ok']
        }).present();
        this.navCtrl.pop();
      })
      
  }

  next(){
    if(this.current_index == 4){
      this.general_loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Updating...'
      });
      //this.general_loader.present();
      this.doMagic();
    }
    else{
      this.current_index++;
    }
  }

  back(){
    if(this.current_index == 1){
      this.navCtrl.pop();
    }
    this.current_index--;
    //console.log(this.current_index);
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
             this.activity_data.media.push({
               'url': url
             });
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
            this.activity_data.media.push({
              'url': url
            });
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
