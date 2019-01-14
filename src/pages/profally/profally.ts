import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ChatsPage } from '../chats/chats';
import { WalletPage } from '../wallet/wallet';
import { MyeventsPage } from '../myevents/myevents';
import { FriendsPage } from '../friends/friends';
import { NotificationsPage } from '../notifications/notifications';
import { HistoryPage } from '../history/history';
import { MynomadsPage } from '../mynomads/mynomads';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import * as moment from 'moment';
import { WelcomePage } from '../welcome/welcome';

/**
 * Generated class for the ProfallyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profally',
  templateUrl: 'profally.html',
  providers: [AngularFireAuth]
})
export class ProfallyPage {
public alumno$: any;
public user_data: any=[];
public general_loader: any;

  constructor(
       public navCtrl: NavController,
       public navParams: NavParams,
       public af: AngularFireDatabase,
       public loadingCtrl: LoadingController,
       public alertCtrl: AlertController,
       public afAuth: AngularFireAuth,
       public appCtrl: App) {
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

      this.user_data.first_name = this.alumno$.first_name;
      this.user_data.last_name = this.alumno$.last_name;
      this.user_data.email = this.alumno$.email;
      this.user_data.phone = this.alumno$.phone;
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
      this.navCtrl.push(MynomadsPage);
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
