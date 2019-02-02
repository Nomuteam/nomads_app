import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Slides } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the ClanshPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clansh',
  templateUrl: 'clansh.html',
})
export class ClanshPage {

  @ViewChild(Slides) slides: Slides;

  public search: any='';
  public general_loader: any;
  public response$: any;
  public my_clans: any = [];
  public users$: any;
  public noms_balance: any = '';
  public name: any = '';
  public clans_example: any = [
    {
      'title': 'Tec de Mty',
      'category': 'Calisthenics',
      'members': '200',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'category': 'Gym',
      'members': '150',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Tec de Mty',
      'category': 'Swimming',
      'members': '200',
      'status': false,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'category': 'Fit',
      'members': '150',
      'status': false,
      'location': 'Monterrey, México'
    }
];
  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  isMember(miembros){
    for(let key in miembros){
      if(miembros[key].index == firebase.auth().currentUser.uid){
        return true;
      }
    }
    return false;
  }

  ionViewDidEnter(){
    this.slides.slideTo(this.navParams.get('Slide'), 500);
  }

  convertClans(){
    let a = this.response$;
    for(let key in a){
      if(!this.isMember(a[key].members)){
        this.my_clans.push({
          'name': a[key].name.substring(0, 10) + '..',
          'name_complete': a[key].name,
          'location': a[key].location,
          'description':  a[key].description,
          'owner':  a[key].owner,
          'rules':  a[key].rules,
          'type':  a[key].type,
          'secret_code':  a[key].secret_code,
          'members':  a[key].members,
          'img':  a[key].img,
          'index':  a[key].index,
          'chat': (a[key].chat != undefined ? a[key].chat : '')
        });
      }
    }
    this.general_loader.dismiss();
  }

  getFiltered(){
    return this.my_clans.filter(cat => cat.name_complete.toLowerCase().indexOf(this.search.toLowerCase())>-1);
  }


  getClans(){
    this.af.object('Clans').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.my_clans = [];
      this.convertClans();
    });
  }

  ionViewDidLoad() {
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
      this.name = this.users$.first_name;
    });
    this.getClans();
  }

  getTextM(miembros){
    return (miembros != '1' ? miembros.length+' nomads' : miembros.length+' nomads');
  }

  canJoin(indice, tipo, code, chat, nombre){
    if(tipo == 'public'){
      this.joinClan(indice, chat, nombre);
    }
    else{
      const prompt = this.alertCtrl.create({
       title: 'Code required to join this clan',
       message: "This clan privacy is not public, enter the code to join the clan",
       inputs: [
         {
           name: 'codigo',
           placeholder: 'Secret Code'
         },
       ],
       buttons: [
         {
           text: 'Cancel',
           handler: data => {
             console.log('Cancel clicked');
           }
         },
         {
           text: 'Validate',
           handler: data => {
             if(data.codigo == code){
               this.joinClan(indice, chat, nombre);
             }
             else{
               this.alertCtrl.create({
                 title: 'Incorrect Code',
                 message: 'The code you entered was incorrect, try again',
                 buttons: ['Ok']
               }).present();
             }
           }
         }
       ]
     });
     prompt.present();
    }
  }

  joinClan(indice, chat, nombre){
      this.general_loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Joining Clan...'
      });

      //Update chat members
      this.af.list('Chats/'+chat+'/members').push({'index': firebase.auth().currentUser.uid});

      //Update this chat room index in the user
      let chat_ref = {'index': chat};
      this.af.list('Users/'+firebase.auth().currentUser.uid+'/Chats').update(chat, chat_ref);

      this.af.list('Users/'+firebase.auth().currentUser.uid+'/Clans').update(indice, {
        'index': indice,
        'isOwner': true
      });
      this.af.list('Clans/'+indice+'/members').update(firebase.auth().currentUser.uid, {
        'index': firebase.auth().currentUser.uid,
        'isOwner': false
      })
       .then(() =>{
         let a = this.response$.members;
         for(let key in a){
           if(a[key].index != firebase.auth().currentUser.uid){
             this.af.list('Notifications').push({'title': 'New clan member!', 'subtitle': this.name+' just joined the clan '+nombre, 'index': a[key].index});
           }
         }
         this.general_loader.dismiss();
         this.alertCtrl.create({
           title: 'Clan Joined!',
           message: 'Go and join your clan in their activities',
           buttons: ['Ok']
         }).present();
         this.navCtrl.pop();
       });

  }

}
