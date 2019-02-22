import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  public general_loader: any;
  public user_chats: any = [];
  public response$: any;
  public room_chats: any = [];
  public users$: any;

  public Mensajes: any = [];
  public msgu: any;
  public chat_room: any;
  @ViewChild('list') list:any;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer) {
    //setTimeout(() =>  this.Mensajes.push({'Mensaje': 'Welcome! 🏠 <br><br> This is the UI for the Nomads App. <br> Send a message!', 'Sophie': 'Si', 'Foto': 'No'}), 500);
  }

  addMsg(){
    if(this.msgu != ''){
      this.af.list('Chats/'+this.chat_room+'/messages').push({
        'senderId': firebase.auth().currentUser.uid,
        'message': this.msgu
      }).then(() => {
        let a = this.response$.members;
        for(let key in a){
          if(a[key].index != firebase.auth().currentUser.uid){
            this.af.list('Notifications').push({'title': 'New chat message!', 'subtitle': this.getName(firebase.auth().currentUser.uid)+' just sent a message to your chat!', 'index': a[key].index});
          }
        }
        this.msgu = '';
      })

    }
  }

  getName(indice){
    let a = this.users$;
    if(indice == 'admin'){
      return 'Nomads Team';
    }
    for(let key in a){
      if(a[key].index == indice){
           return a[key].first_name;
      }
    }
    return '';
  }

  getEqual(indice){
    return indice == firebase.auth().currentUser.uid;
  }

  convertMensajes(){
    let a = this.response$.messages;
    for(let key in a){
      this.Mensajes.push({
        'senderId': a[key].senderId,
        'message': a[key].message,
        'senderName': this.getName(a[key].senderId),
        'isMe': this.getEqual(a[key].senderId)
      });
    }
    if(this.general_loader) this.general_loader.dismiss();
  }

  ionViewWillLeave(){
    this.af.list('Chats/').update(this.chat_room, {
      'lastMsg': this.Mensajes[this.Mensajes.length - 1].message,
      'lastMsg_index': this.Mensajes[this.Mensajes.length - 1].senderId,
    })
  }

  ionViewDidLoad() {
    // this.list.scrollTop = this.list.scrollHeight;
    // this.list.scrollToBottom(100);
    this.general_loader =  this.loadingCtrl.create({
          spinner: 'bubbles',
           content: 'Loading...'
          });
    this.general_loader.present();
    this.chat_room = this.navParams.get('chat-room');
    this.af.object('Users/').snapshotChanges().subscribe(action => {
       this.users$ = action.payload.val();
    });
    this.af.object('Chats/'+this.chat_room).snapshotChanges().subscribe(action => {
       this.response$ = action.payload.val();
       this.Mensajes = [];
       this.convertMensajes();
    });
  }

}
