import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ClanshPage } from '../clansh/clansh';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the ClanfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clanf',
  templateUrl: 'clanf.html',
})
export class ClanfPage {
  public search: any='';
  public general_loader: any;
  public response$: any;
  public my_clans: any = [];
  public clans_example: any = [
    {
      'title': 'Tec de Mty',
      'members': '200',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'members': '150',
      'status': true,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Tec de Mty',
      'members': '200',
      'status': false,
      'location': 'Monterrey, México'
    },
    {
      'title': 'Nomads',
      'members': '150',
      'status': false,
      'location': 'Monterrey, México'
    }
];
public users$: any;
public noms_balance: any = '';

  constructor(public navCtrl: NavController,
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

  openView(slide){
    this.navCtrl.push(ClanshPage, {'Slide': slide});
  }

  getStatus(status){
    return status == 'public' ? 'Open' : 'Private';
  }

  returnStatus(status){
    return status ? 'act-status' : 'act-status rose';
  }

  isMember(miembros){
    for(let key in miembros){
      if(miembros[key].index == firebase.auth().currentUser.uid){
        return true;
      }
    }
    return false;
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
          'index':  a[key].index
        });
      }
    }
    console.log(this.my_clans);
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
    });
    this.getClans();
  }

  getTextM(miembros){
    let aux = 0;
    for(let key in miembros){
      aux++;
      //console.log('where you from nigga');
    }
    return (aux > 1 ? aux+' nomads' : aux+' nomad');
  }

}
