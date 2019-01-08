import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser'

/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
public general_loader: any;
public response$: any;
public members: any = [];
public actual_members: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {
    this.members = this.navParams.get('Members');
    console.log(this.members);
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  isMember(indice){
    for(let key in this.members){
      if(this.members[key].index == indice){
        return true;
      }
    }
    return false;
  }

  convertMembers(){
    let a = this.response$;
    for(let key in a){
      if(this.isMember(a[key].index)){
        this.actual_members.push({
          'first_name': a[key].first_name,
          'last_name': a[key].last_name,
          'index': a[key].index
        });
      }
    }
    console.log(this.actual_members);
    this.general_loader.dismiss();
  }

  getUsers(){
    this.af.object('Users').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.actual_members = [];
      this.convertMembers();
    });
  }

  ionViewDidLoad() {
    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.getUsers();
  }

}
