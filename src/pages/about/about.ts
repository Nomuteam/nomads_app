import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { ClanfPage } from '../clanf/clanf';
import { FiltersPage } from '../filters/filters';
import { ClanPage } from '../clan/clan';
import { NewclanPage } from '../newclan/newclan';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import { WalletPage } from '../wallet/wallet';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public general_loader: any;
  public response$: any;
  public my_clans: any = [];
  public users$: any;
  public clans_example: any = [
    {
      'title': 'Tec de Mty',
      'members': '200'
    },
    {
      'title': 'Nomads',
      'members': '150'
    }
];
public noms_balance: any = '';

  constructor(public navCtrl: NavController,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {

  }

  testWallet(){
   this.navCtrl.parent.select(4);
   setTimeout(() => {this.navCtrl.parent.getSelected().push(WalletPage)}, 500);
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
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
      if(this.isMember(a[key].members)){
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
          'members_n': Object.keys(a[key].members).length,
          'img':  a[key].img,
          'index':  a[key].index,
          'schedule': (a[key].schedule ? a[key].schedule : [])
        });
      }
    }
    this.general_loader.dismiss();
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


  openCreate(){
    this.navCtrl.push(NewclanPage);
  }

  openClan(clan){
    this.navCtrl.push(ClanPage, {'Clan': clan});
  }

  openFind(){
    this.navCtrl.push(ClanfPage);
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

}
