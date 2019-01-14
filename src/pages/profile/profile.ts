import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
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
    public afAuth: AngularFireAuth) {
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  getBirthday(){
    return moment(this.user_data.birthdate).fromNow();
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


}
