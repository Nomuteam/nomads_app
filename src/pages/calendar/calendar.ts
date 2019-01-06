import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { FiltersPage } from '../filters/filters';

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  public eventSource = [];
  public viewTitle: string;
  public selectedDay = new Date();

  public calendar = {
   mode: 'month',
   currentDate: new Date()
 };
 public type: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.type = localStorage.getItem('Tipo');
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

}
