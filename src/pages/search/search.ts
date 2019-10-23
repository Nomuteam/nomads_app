import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DomSanitizer } from '@angular/platform-browser';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import { StudioPage } from '../studio/studio';
import moment from 'moment';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchInput: any = '';
  public response$: any;
  public e_response$: any;
  public responses$: any;
  public activities: any = [];
  public actividadesFiltradas: any = [];
  public studiosFiltrados: any = [];
  public eventosFiltrados: any = [];

  public totalActividades: any;
  public totalEventos: any;
  public totalStudios: any;

  public events: any = [];
  public studios: any = [];
  public people$: any;
  public posicion: any = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFireDatabase,
    public sanitizer: DomSanitizer,
    public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    this.geolocation.getCurrentPosition().then((position) => {

      this.posicion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    }, (err) => {
      console.log(err);
    });

    this.af.object('Users').snapshotChanges().subscribe(action => {
      this.people$ = action.payload.val();
    });
    this.getActivities();
  }

  getReviewsLength(re) {
    if (re.length != 0) {
      return Object.keys(re).length;
    }
    else {
      return 0;
    }
  }

  getName(indice) {
    let u = this.people$;
    for (let key in u) {
      if (u[key].index == indice) return u[key].business.business_name;
    }
    return '';
  }

  filtraActividades() {
    //filtramos las actividades por nombre
    console.log('studios', this.studios);
    this.activities = this.activities.sort((a, b) => Number(a.distancia) - Number(b.distancia));
    this.actividadesFiltradas = 
    this.activities
    .filter(x => 
      x.title.toLowerCase().includes(this.searchInput.toLowerCase()) ||
      x.creador.toLowerCase().includes(this.searchInput.toLowerCase()) || 
      x.main_act.toLowerCase().includes(this.searchInput.toLowerCase())
    )
    //.filter(x => x.creador.toLowerCase().includes(this.searchInput.toLowerCase()))
    //.filter(x => x.main_act.toLowerCase().includes(this.searchInput.toLowerCase()))
    ;
    this.totalActividades = this.actividadesFiltradas.length;

    this.events = this.events.sort((a, b) => Number(a.distancia) - Number(b.distancia));
    this.eventosFiltrados = this.events.filter(x => x.title.toLowerCase().includes(this.searchInput.toLowerCase()));
    this.totalEventos = this.eventosFiltrados.length;

    this.studiosFiltrados = this.studios.filter(x => x.title.toLowerCase().includes(this.searchInput.toLowerCase()));
    this.totalStudios = this.studiosFiltrados.length;
  }

  getActivities() {
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.activities = [];
      let a = this.response$;
      for (let key in a) {

        this.activities.push({
          'title': (a[key].title.length > 50 ? a[key].title.substring(0, 20) + '..' : a[key].title),
          'title_complete': a[key].title,
          'location': a[key].location,
          'description': a[key].description,
          'useful_notes': (a[key].useful_notes ? a[key].useful_notes : ''),
          'cancelation_policy': a[key].cancelation_policy,
          'class_price': a[key].class_price,
          'fee': a[key].fee,
          'categories': a[key].categories,
          'schedule': a[key].schedule,
          'media': a[key].media,
          'nomads': (a[key].nomads ? a[key].nomads : []),
          'img': a[key].img,
          'creator': a[key].creator,
          'index': a[key].index,
          'isEvent': false,
          'review': (a[key].review ? a[key].review : 5),
          'reviews': (a[key].reviews ? a[key].reviews : []),
          'special': (a[key].special ? a[key].special : false),
          'distance': '',
          'distance_number': 0,
          'next_time': '',
          'next_remaining': 0,
          'creador': this.getName(a[key].creator),
          'main_act': a[key].categories.activity_type,
        });
      }

      this.activities.forEach(element => {
        try {
          this.getDistance(element.location, (data1, data2) => {
            element.distancia = data1;
            element.distance = data2;
          })
        }
        catch (e) {

        }

      });

      this.actividadesFiltradas = this.activities;
      //this.activities = this.response$;
      console.log('actividades', this.activities);
      //this.convertActivities();
    });


    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.events = [];
      //this.events = this.e_response$;
      let a = this.e_response$;
      for (let key in a) {
        this.events.push({
          'title': a[key].title.substring(0, 10) + '..',
          'title_complete': a[key].title,
          'location': a[key].location,
          'difficulty': a[key].difficulty,
          'img': a[key].img,
          'cost': a[key].cost,
          'about_event': a[key].about_event,
          'provided': a[key].provided,
          'about_organizer': a[key].about_organizer,
          'type': a[key].type,
          'allDay': false,
          'time': a[key].time,
          'creator': a[key].creator,
          'index': a[key].index,
          'media': a[key].media,
          'isEvent': true,
          'distance': 0,
          'distance_number': '',
          'day': a[key].day,
          'review': (a[key].review ? a[key].review : 5),
          'reviews': (a[key].reviews ? a[key].reviews : []),
          'nomads': (a[key].nomads ? a[key].nomads : [])
        });
      }

      this.events.forEach(element => {
        try{
          this.getDistance(element.location, (data1, data2)=>{
            element.distancia = data1;
            element.distance = data2;
            console.log(element)
          })
        }
        catch(e){
          console.log('Error',e)
        }
        
      });

      let today = moment();
      let hoy = moment().format('dddd');
      console.log(hoy);
      // this.events = this.events.filter( event => moment(event.day).format('dddd') == hoy || !moment(event.day).isBefore(today));
      //this.events = this.events.filter(event => !moment(event.day).isBefore(today));
      console.log('eventos!', this.events);
      //this.convertEvents();
    });
    this.af.object('Studios').snapshotChanges().subscribe(action => {
      this.responses$ = action.payload.val();
      this.studios = [];
      //this.studios = this.responses$;
      let s = this.responses$;
      for (let key in s) {
        this.studios.push({
          'amenities': s[key].amenities,
          'closing': s[key].closing,
          'creator': s[key].creator,
          'description': s[key].description,
          'index': s[key].index,
          'location': s[key].location,
          'logo': s[key].logo,
          'membership_cost': s[key].membership_cost,
          'title': s[key].name,
          'opening': s[key].opening,
          'schedule': s[key].schedule,
          'useful_notes': s[key].useful_notes,
          'isStudio': true,
          'activities': (s[key].activities ? s[key].activities : [])
        });
      }

      this.studios.forEach(element => {
        try{
          this.getDistance(element.location, (data1, data2)=>{
            element.distancia = data1;
            element.distance = data2;
            console.log(element)
          })
        }
        catch(e){
          console.log('Error',e)
        }
        
      });

      console.log('studios!', this.studios);
      //this.convertStudios();
    });
  }


  getDistance(address, fn) {
    let geocoder = new google.maps.Geocoder();
    let vm = this;
    let distance = new google.maps.DistanceMatrixService();
    let result = 0;
    let result2 = '';
    console.log('distancia', distance);
    return distance.getDistanceMatrix({
      origins: [this.posicion],
      destinations: [address],
      travelMode: google.maps.TravelMode.DRIVING
    },
      function (response, status) {
        // check status from google service call
        if (status !== google.maps.DistanceMatrixStatus.OK) {
          console.log('Error:', status);
        } else {
          try{
            if (response.rows[0].elements[0].distance.value) {
              result = response.rows[0].elements[0].distance.value;
              result2 = response.rows[0].elements[0].distance.text;
              fn(result, result2);
            }
            else {
              location.reload();
            }
          }
          catch(e){
            //location.reload();
          }
          
          //vm.activities_all[p].distance = response.rows[0].elements[0].distance.value;
        }
      });

  }

  sanitizeThis(image) {
    return this.sanitizer.bypassSecurityTrustStyle('url(' + image + ')');
  }

  openActivity(actividad) {
    this.navCtrl.push(ActivityPage, { 'Activity': actividad });
  }
  openEvent(event) {
    this.navCtrl.push(EventPage, { 'Event': event });
  }

  openStudio(studio) {
    this.navCtrl.push(StudioPage, { 'Studio': studio });
  }
}
