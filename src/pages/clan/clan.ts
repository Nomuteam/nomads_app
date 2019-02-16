import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FiltersPage } from '../filters/filters';
import { DomSanitizer } from '@angular/platform-browser';
import { MembersPage } from '../members/members';
import { NeweventPage } from '../newevent/newevent';
import { ChatsPage } from '../chats/chats';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the ClanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-clan',
  templateUrl: 'clan.html',
})
export class ClanPage {
public type: any='';
public clan: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer, public socialSharing: SocialSharing) {
    this.type = localStorage.getItem('Tipo');
    this.clan = this.navParams.get('Clan');
  }

  shareGeneral(){
    this.socialSharing.share('Hey! I am member of the clan '+this.clan.name_complete+' with '+Object.keys(this.clan.members).length+' members. Join my clan on nōmu!', 'Nomads!')
        .then((entries) =>{
          console.log('success ', +JSON.stringify(entries));
        })
  }

  openChat(){
    this.navCtrl.parent.select(4)
        .then(()=> this.navCtrl.parent.getSelected().push(ChatsPage, {'Segmento': 'clans'}));
  }

  openNew(){
    this.navCtrl.push(NeweventPage, {'Clan': true});
  }

  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  openMembers(){
    this.navCtrl.push(MembersPage, {'Members': this.clan.members});
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClanPage');
  }

}
