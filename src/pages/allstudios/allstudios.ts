import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import { DomSanitizer } from '@angular/platform-browser';
import { StudioPage } from '../studio/studio';

/**
 * Generated class for the AllstudiosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-allstudios',
  templateUrl: 'allstudios.html',
})
export class AllstudiosPage {
  public activities_all: any = [];
  public type: any = '';
  
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public sanitizer: DomSanitizer) {
      this.activities_all = this.navParams.get('Acts');
      this.type = this.navParams.get('Tipo');
      console.log(this.activities_all);
    }
  
    sanitizeThis(image){
      return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
    }
  
    openStudio(studio){
      this.navCtrl.push(StudioPage, {'Studio': studio});
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad AllPage');
    }
  
    getClass(){
      let aux = 'category-title';
      if(this.type == 'Best Rated Activities') aux+= ' best';
      else if(this.type == "Today's Activities") aux+= ' blue';
      else if(this.type == 'Suggestions for you') aux+= ' sug';
      else if(this.type == 'Your Favorites') aux+= ' fav';
      else if(this.type == 'Events') aux+= ' events';
      else if(this.type == 'Experiences') aux+= ' rose';
      else if(this.type == 'Special Offers') aux+= ' green';
      return aux;
    }
  
    seeDetails(a){
      if(a.isEvent){
        this.navCtrl.push(EventPage, {'Event': a});
      }
      else{
        this.navCtrl.push(ActivityPage, {'Activity': a});
      }
    }
  
  }
  