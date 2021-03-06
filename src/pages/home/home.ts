import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { BrowsePage } from '../browse/browse';
import { FiltersPage } from '../filters/filters';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import firebase from 'firebase';
import { ActivityPage } from '../activity/activity';
import { EventPage } from '../event/event';
import { DomSanitizer } from '@angular/platform-browser';
import { Stripe } from '@ionic-native/stripe';
import * as moment from 'moment';
import { WalletPage } from '../wallet/wallet';
import { NeweventPage } from '../newevent/newevent';
import { FilteredPage } from '../filtered/filtered';
declare var google;
import { Geolocation } from '@ionic-native/geolocation';
import { MyeventsPage } from '../myevents/myevents';
import { AllPage } from '../all/all';
import { DayPage } from '../day/day';
import { StudioPage } from '../studio/studio';
import { AllstudiosPage } from '../allstudios/allstudios';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public todayActivities:any[]=[];

  public response$: any;
  public responses$: any;
  public responsec$: any;
  public activities: any = [];
  public activities_d: any = [];
  public favorites: any;
  public general_loader: any;
  public users$: any;
  public noms_balance: any = '';
  public e_response$: any;
  public events: any = [];
  public favoritos: any = [];

  public user_preferences: any = [];

  public filtered_a: any = [];
  public posicion: any = '';

  public done_e: any = false;
  public done_a: any = false;

  public location_loader: any;
  public present_loader: any = true;
  public people$: any;
  public studios: any = [];
  public my_clans: any = [];
  public schedule: any = [];

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public af: AngularFireDatabase,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public sanitizer: DomSanitizer,
  public stripe: Stripe,
  public geolocation: Geolocation ) {

   this.stripe.setPublishableKey('pk_test_tRNrxhMhtRyPzotatGi5Mapm');
    let date = new Date();
    console.log(date);
    date.setHours(9);
    date.setMinutes(8);
    console.log(moment('Monday', 'dddd').fromNow());
    console.log(moment('2019-01-11').add(3, 'days').format('L'));
   // let card = {
   //  number: '5579070085401951',
   //  expMonth: 12,
   //  expYear: 2022,
   //  cvc: '997'
   // };

   let card = {
    number: '4242424242424242',
    expMonth: 12,
    expYear: 2020,
    cvc: '220'
   };

   // this.stripe.createCardToken(card)
   //    .then(token => {
   //      this.af.list('Payments/'+firebase.auth().currentUser.uid).push({'token': token, 'amount': 500});
   //      this.alertCtrl.create({title: 'exito', buttons: ['Ok']}).present();
   //    })
   //    .catch(error => {
   //      this.alertCtrl.create({title: 'error', buttons: ['Ok']}).present();
   //    });

  }

  getClanS(){
    return [];
  }



  openFiltered(tipo){
    this.navCtrl.push(FilteredPage, {'Tipo': tipo});
  }

  openDay(){
    this.navCtrl.push(DayPage, {'Activities': this.activities});
  }

  openAll(tipo){
    if(tipo == 'Best Rated Activities') this.navCtrl.push(AllPage, {'Tipo': tipo, 'Acts': this.getRated()});
    //else if(tipo == "Nearby and Upcoming") this.navCtrl.push(AllPage, {'Tipo': "Today's Activities", 'Acts': this.getUpcoming()});
    else if(tipo == "Nearby and Upcoming") this.navCtrl.push(AllPage, {'Tipo': "Today's Activities", 'Acts': this.todayActivities});
    else if(tipo == 'Suggestions for you') this.navCtrl.push(AllPage, {'Tipo': tipo, 'Acts': this.filtered_a});
    else if(tipo == 'Your Favorites') this.navCtrl.push(AllPage, {'Tipo': tipo, 'Acts': this.favoritos});
    else if(tipo == 'Events') this.navCtrl.push(AllPage, {'Tipo': tipo, 'Acts': this.events});
    else if(tipo == 'Experiences') this.navCtrl.push(AllPage, {'Tipo': tipo, 'Acts': this.getExperiences()});
    else if(tipo == 'Special Offers') this.navCtrl.push(AllPage, {'Tipo': tipo, 'Acts': this.getSpecial()});
    else if(tipo == 'Studios') this.navCtrl.push(AllstudiosPage, {'Tipo': tipo, 'Acts': this.studios});
  }

  getFavorites(){
    let a = this.favorites;
    this.favoritos = [];
    for(let key in a){
      // this.favoritos.push({
      //   'title': 'hi',
      //   'title_complete': 'hi',
      //   'location': 'hi',
      //   'description':  'hi',
      //   'cancelation_policy': 'hi',
      //   'class_price':  'hi',
      //   'fee': 'hi',
      //   'categories':  'hi',
      //   'schedule':  'hi',
      //   'media':  'hi',
      //   'img': 'hi',
      // });
      //console.log(this.activities.filter( act => act.index == a[key].index));
      console.log(a[key]);
      if(a[key].type == 'activity') this.favoritos[this.favoritos.length] = this.activities.filter( act => act.index == a[key].index)[0];
      else this.favoritos[this.favoritos.length] =  this.events.filter( act => act.index == a[key].index)[0];
    }

    console.log('favoritos',this.favoritos);
    this.getFiltersP();
    // return this.favoritos;
  }

  getExperiences(){
    //console.log('todas las actividades',this.activities);
    return this.activities.filter(act => act.distance_number >=0 && act.distance_number <= 20 && act.categories.main_category == 'Experiences');
  }

  getFiltersP(){
    this.af.object('Users/'+firebase.auth().currentUser.uid+'/preferences').snapshotChanges().subscribe(action => {
      this.user_preferences = action.payload.val();
      console.log('preferencias',this.user_preferences);
      this.applyFilters();
    });
  }

  seeDetails(a){
    if(a.isEvent){
      this.navCtrl.push(EventPage, {'Event': a});
    }
    else{
      this.navCtrl.push(ActivityPage, {'Activity': a});
    }
  }

  verifyRaro(cosa){
    console.log(cosa);
  }


  openNew(){
    this.navCtrl.push(NeweventPage);
  }


  sanitizeThis(image){
    return this.sanitizer.bypassSecurityTrustStyle('url('+image+')');
  }

  coordenadas(a, address, tit, fn){
    let geocoder = new google.maps.Geocoder();
    let vm = this;
    geocoder.geocode( { 'address' : address}, function( results, status ) {
       if( status == google.maps.GeocoderStatus.OK ) {
         //console.log(results);
         fn(results[0].formatted_address);
       } else {
          vm.af.list('AppErrors/').push({'type': 'Geocode', 'error': status});
          console.log( 'Geocode was not successful for the following reason: ' + status );
       }
   });
  }

  getDistance(address, fn){
    let geocoder = new google.maps.Geocoder();
    let vm = this;
    let distance = new google.maps.DistanceMatrixService();
    let result = 0;
    let result2 = '';
    console.log('distancia',distance);
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
           
           if(response.rows[0].elements[0].distance.value){
             result = response.rows[0].elements[0].distance.value;
             result2 = response.rows[0].elements[0].distance.text;
             fn(result, result2);
           }
           else{
             location.reload();
           }
           //vm.activities_all[p].distance = response.rows[0].elements[0].distance.value;
           }
     });

  }

  convertEvents(){
    let a = this.e_response$;

    //merol
    console.log('usuarios', this.people$);
    
    for(let key in a){


      this.events.push({
        'title': (a[key].title.length > 100 ? a[key].title.substring(0, 15) + '..' : a[key].title),
        'title_complete': a[key].title,
        'location': a[key].location,
        'difficulty':  a[key].difficulty,
        'img':  a[key].img,
        'e_type':  a[key].e_type,
        'about_event':  a[key].about_event,
        'provided':  a[key].provided,
        'about_organizer':  a[key].about_organizer,
        'spaces_available':  a[key].spaces_available,
        'cost':  a[key].cost/20,
        'type':  a[key].type,
        'day': a[key].day,
        'name': this.getName(a[key].creator),
        'phone': this.getPhone(a[key].creator),
        'distance': '',
        'distance_number': 0,
        'time': a[key].time,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'media': a[key].media,
        'nomads': (a[key].nomads ? a[key].nomads : []),
        'isEvent': true,
        'review':( a[key].review ? a[key].review : 5),
        'reviews': (a[key].reviews ? a[key].reviews : []),
        'special': (a[key].special ? a[key].special : false)
      });
    }

    console.log('eventos',this.events);

    let today  = moment();
    let hoy = moment().format('dddd');
    console.log(hoy);
    // this.events = this.events.filter( event => moment(event.day).format('dddd') == hoy || !moment(event.day).isBefore(today));
    this.events = this.events.filter( event => !moment(event.day).isBefore(today) );
    console.log(this.events)
    console.log(this.events.length);

    if(!this.done_e){
    this.done_e = true;
    let vm = this;
    for(let i=0; i < this.events.length; i++){

    /*
    setTimeout(() => {
      this.coordenadas(this.events[i], this.events[i].location, this.events[i].title_complete,  function(location){
          vm.events[i].location = location;
          let om = vm;
          vm.getDistance(location, function(distance, text){
            console.log(distance+' km');
            vm.events[i].distance = text;
            vm.events[i].distance_number = distance;
          });
      });
    }, (this.events.length*22)*i);
    */
  }
   // this.location_loader.dismiss();
   // this.location_loader = null;
    }

    setTimeout(()=> {
      localStorage.setItem('events', JSON.stringify(this.events));
    }, (this.events.length*22)*this.events.length)

    console.log('1',this.events);

    if(this.general_loader) this.general_loader.dismiss();
    this.getFavorites();
  }

  getReviewsLength(re){
    if(re.length != 0){
      return Object.keys(re).length;
    }
    else{
      return 0;
    }
  }

  convertActivities(){
    let a = this.response$;
    this.location_loader = this.loadingCtrl.create({
     spinner: 'bubbles',
     content: 'Calculating distances...'
   });

   
    for(let key in a){
      
     

      this.activities.push({
        'title': (a[key].title.length > 50 ? a[key].title.substring(0, 20) + '..' : a[key].title),
        'title_complete': a[key].title,
        'location': a[key].location,
        'description':  a[key].description,
        'useful_notes': (a[key].useful_notes ? a[key].useful_notes : ''),
        'cancelation_policy':  a[key].cancelation_policy,
        'class_price':  a[key].class_price,
        'fee':  a[key].fee,
        'categories':  a[key].categories,
        'schedule':  a[key].schedule,
        'media':  a[key].media,
        'nomads': (a[key].nomads ? a[key].nomads : []),
        'img':  a[key].img,
        'creator':  a[key].creator,
        'index':  a[key].index,
        'isEvent': false,
        'review':( a[key].review ? a[key].review : 5),
        'reviews': (a[key].reviews ? a[key].reviews : []),
        'special': (a[key].special ? a[key].special : false),
        'distance': '',
        'distance_number': 0,
        'next_time': '',
        'next_remaining': 0
      });
    }

    //this.activities.shift();

    if(!this.done_a){
      this.done_a = true;
      //this.location_loader.present();
      let vm = this;
      for(let i=0; i < this.activities.length; i++){
       ///this.activities[i] = this.activities[i];
        /*
      setTimeout(()=>{
        this.coordenadas(this.activities[i], this.activities[i].location, this.activities[i].title_complete,  function(location){
            vm.activities[i].location = location;
            let om = vm;
            vm.getDistance(location, function(distance, text){
              //console.log(distance+' km');
              vm.activities[i].distance = text;
              vm.activities[i].distance_number = distance;
            });
        });
      }, (this.activities.length*23)*i);

      */
      }
    }

    setTimeout(()=> {
      this.activities = this.getClosest();
      localStorage.setItem('actividades', JSON.stringify(this.activities));
      if(this.location_loader) this.location_loader.dismiss();
    }, (this.activities.length*23)*this.activities.length)
    
    for(let i=0; i<this.activities.length; i++){
      let h = this.activities[i].schedule;
      let today =  moment().format('dddd');
      let next = 'not today';
      let hours_left = 1000;
      let aux = new Date();
      let remaining;
      let remaining_n;

      for(let key in h){
       if(today == h[key].day){

         aux.setHours(parseInt(h[key].start_time.charAt(0) + h[key].start_time.charAt(1)));
         aux.setMinutes(parseInt(h[key].start_time.charAt(3) + h[key].start_time.charAt(4)));

         remaining = moment(aux).fromNow();

         if(remaining.indexOf('in ')>-1){
           remaining = remaining.slice(3);
           remaining_n = parseInt(remaining.charAt(0)+remaining.charAt(1));
           if(remaining.indexOf('minutes')==-1) remaining_n += 100;

           if(remaining_n < hours_left){
             next = h[key].start_time;
             hours_left = remaining_n;
           }
         }

       }
      }

      // if(next != 'not today'){
      //   console.log('Para la actividad '+this.activities[i].title+' hoy, el horario más cercano es '+next);
      // }
      if(next != 'not today'){
        let aux2 = new Date();
        aux2.setHours(parseInt(next.charAt(0) + next.charAt(1)));
        aux2.setMinutes(parseInt(next.charAt(3) + next.charAt(4)));
        next = moment(aux2).format('LT');
      }


      this.activities[i].next_time = next;
      this.activities[i].next_remaining = hours_left;
    }

   console.log('2',this.activities);

   // this.activities = this.activities.sort(function(a, b){
   //  var keyA = a.distance_number,
   //      keyB = b.distance_number;
   //  // Compare the 2 dates
   //  if(keyA < keyB) return -1;
   //  if(keyA > keyB) return 1;
   //  return 0;
   // });
   this.getUpcoming();
  }


  getCloserTime(){
    //console.log('eventos', this.events);
    return this.events.sort(function(a, b){
     var keyA = a.day,
         keyB = b.day;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
    });
  }


  getClosest(){
    return this.activities.sort(function(a, b){
     var keyA = a.distance_number,
         keyB = b.distance_number;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
    });
  }

  getUpcoming(){
    let aux = this.activities.filter(act => act.next_time != 'not today');
    aux = aux.sort(function(a, b){
     var keyA = a.next_remaining,
         keyB = b.next_remaining;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
    });

    //aux = aux.filter(a => a.distance_number < 20);
    this.todayActivities = aux;
    this.todayActivities.forEach(element => {
      this.getDistance(element.location, (data1, data2)=>{
        element.distancia = data1;
        element.distance = data2;
      })
    });
    //return aux;
  }


  //cycle
  //arte marcial y cultura
  //movement@FOW
  //yoga suave@sutra
  //soul flow@sutra
  //yoga prenatal
  //vinyasa flow@sutra yoga
  //restore@sutra yoga
  //fullbody
  //sound healing
  //sunrise flow@sutra yoga


  getRated(){
   let aux = [];
   //console.log(this.activities);
   aux = this.activities.sort(function(a, b){
    var keyA = a.review,
        keyB = b.review;
    // Compare the 2 dates
    if(keyA > keyB) return -1;
    if(keyA < keyB) return 1;
    return 0;
   });
   aux = this.getClosest();
   //aux = aux.filter(a =>  a.distance_number < 20);
   //console.log(aux);
   return aux;
  }

  getSpecial(){
    return this.activities.filter(act => act.special);
  }

  openActivity(actividad){
    this.navCtrl.push(ActivityPage, {'Activity': actividad});
  }

  testWallet(){
   this.navCtrl.parent.select(4);
   setTimeout(() => {this.navCtrl.parent.getSelected().push(WalletPage)}, 500);
  }

  openEvent(event){
    this.navCtrl.push(EventPage, {'Event': event});
  }

  openStudio(studio){
    this.navCtrl.push(StudioPage, {'Studio': studio});
  }


  convertStudios(){
    let s = this.responses$;
    for(let key in s){


      let distancia1 = '';
      let distancia2 = '';

      console.log('location!',s[key].location);
      this.getDistance(s[key].location, (data1, data2)=>{
        distancia1 = data1;
        distancia2 = data2;

        this.studios.push({
          'amenities': s[key].amenities,
          'closing': s[key].closing,
          'creator': s[key].creator,
          'description': s[key].description,
          'index': s[key].index,
          'location': s[key].location,
          'logo': s[key].logo,
          'phone': this.getPhone(s[key].creator),
          'membership_cost': s[key].membership_cost,
          'title': s[key].name,
          'opening': s[key].opening,
          'schedule': s[key].schedule,
          'useful_notes': s[key].useful_notes,
          'isStudio': true,
          'activities': (s[key].activities ? s[key].activities : []),
          'distancia1':distancia1,
          'distancia2':distancia2
        });
        this.studios = this.sortByKey(this.studios, 'distancia2');
        //this.studios = this.studios.sort((a, b) => a.distancia - b.distancia);
        console.log('Studios!',this.studios);
      })

      
    
  }

  //this.getUpcomingStudios();
}


sortByKey(array, key) {
  return array.sort(function(a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
  }

  getActivities(){
    this.af.object('Activities').snapshotChanges().subscribe(action => {
      this.response$ = action.payload.val();
      this.activities = [];
      this.convertActivities();
    });
    this.af.object('Events').snapshotChanges().subscribe(action => {
      this.e_response$ = action.payload.val();
      this.events = [];
      this.convertEvents();
    });
    this.af.object('Studios').snapshotChanges().subscribe(action => {
      this.responses$ = action.payload.val();
      this.studios = [];
      this.convertStudios();
    });
  }

  existsF(arre, cual){
    for(let key in arre){
      if(arre[key].name == cual) return true;
    }
    return false;
  }

  createEvent(){
    this.navCtrl.parent.select(4)
        .then(()=> this.navCtrl.parent.getSelected().push(MyeventsPage));
  }

  existsO(arre, cual){
    //console.log(arre);
    for(let key in arre){
      if(arre[key].title == cual) return true;
    }
    return false;
  }

  existsS(arre, cual){
    console.log(arre);
    for(let key in arre){
      if(this.hasDay(cual, arre[key].day)) return true;
    }
    return false;
  }

  hasDay(agenda, dia){
    let a = agenda;
    for(let key in a){
      if(a.day == dia) return true;
    }
    return false;
  }

  applyFilters(){
    let cats = this.user_preferences.categories.filter(c => c.selected);
    let days = this.user_preferences.days.filter(d => d.selected);
    let forms = this.user_preferences.forms.filter(f=> f.selected);
    let types = this.user_preferences.types.filter(t=> t.selected);
    let aux = [];
    let a = this.activities;

    if(cats.length > 0){
      for(let i=0; i<a.length; i++){
        if(this.existsF(cats, a[i].categories.main_category)){
          aux.push(a[i]);
        }
      }
    }

    if(types.length > 0){
      for(let i=0; i<a.length; i++){
        if(this.existsO(types, a[i].categories.activity_type)){
          aux.push(a[i]);
        }
      }
    }

    if(days.length > 0){
      for(let i=0; i<a.length; i++){
        if(this.existsS(days, a[i].schedule)){
          aux.push(a[i]);
        }
      }
    }

     aux = aux.sort(function(a, b){
     var keyA = a.distance_number,
         keyB = b.distance_number;
     // Compare the 2 dates
     if(keyA < keyB) return -1;
     if(keyA > keyB) return 1;
     return 0;
    });

    aux =  aux.filter(a => a.distance_number>0 && a.distance_number < 20);
    this.filtered_a = aux;
  }

  ionViewWillEnter(){
    if(this.activities != []){
      this.getFavorites();
    }


    this.geolocation.getCurrentPosition().then((position) => {

      this.posicion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    }, (err) => {
      console.log(err);
    });
  }

  isMember(miembros){
    for(let key in miembros){
      if(miembros[key].index == firebase.auth().currentUser.uid){
        return true;
      }
    }
    return false;
  }

  viewSchedule(){
    this.navCtrl.parent.select(1);
  }

  getSchedule(){
    let c = this.my_clans;
    let a;
    for(let lla in c){
      if(c[lla].schedule){
        a = c[lla].schedule;
        for(let key in a){
          this.schedule.push({
            'date': a[key].date,
            'day': a[key].day,
            'index': a[key].index,
            'name': this.getName(a[key].nomad_index),
            'nomad_index': a[key].nomad_index,
            'time': a[key].time,
            'title': a[key].title
          });
        }
      }
    }
    let today  = moment().add(1, 'days');
    this.schedule = this.schedule.filter( event => !moment(event.date).isBefore(today));
    console.log(this.schedule);
  }

  getName(indice){
    let u = this.people$;
    for(let key in u){
      if(u[key].index == indice) return u[key].business.business_name;
    }
    return '';
  }

  getPhone(indice){
    let u = this.people$;
    for(let key in u){
      if(u[key].index == indice) return u[key].phone;
    }
    return '';
  }

  

  convertClans(){
    let a = this.responsec$;
    for(let key in a){
      if(this.isMember(a[key].members)){
        this.my_clans.push({
          'name': (a[key].name.length > 14 ? a[key].name.substring(0, 13) + '..' : a[key].name),
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
    //this.general_loader.dismiss();
    this.getSchedule();
    console.log(this.my_clans);
  }


  getClans(){
    this.af.object('Clans').snapshotChanges().subscribe(action => {
      this.responsec$ = action.payload.val();
      this.my_clans = [];
      this.convertClans();
    });
  }

  ionViewDidLoad() {

    console.log('usuario',firebase.auth().currentUser.uid);

    this.general_loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...'
    });
    this.general_loader.present();
    this.af.object('Users').snapshotChanges().subscribe(action => {
      this.people$ = action.payload.val();
    });
    this.af.object('Users/'+firebase.auth().currentUser.uid).snapshotChanges().subscribe(action => {
      this.users$ = action.payload.val();
      this.noms_balance = this.users$.noms;
      this.favorites = this.users$.favorites;
    });

    this.geolocation.getCurrentPosition().then((position) => {
      this.posicion = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.getActivities();
      this.getClans();
    }, (err) => {
      this.posicion = new google.maps.LatLng(25.638233, -100.3622394);
      this.getActivities();
      this.getClans();
    });

    
  }

  openBrowse(segmento){
    this.navCtrl.push(BrowsePage, {'segment': segmento});
  }

  openFilters(){
    this.navCtrl.push(FiltersPage);
  }

  openSearch(){
    this.navCtrl.push(SearchPage);
  }


  /* 
  async showModalFilter() {
    console.log('mostramos filtros');
    const modal = await this.modalController.create({
      component: FiltrobusquedaPage
    });

    modal.onDidDismiss()
      .then((data) => {
        const filtros = data['data']; // Here's your selected user!
        console.log(filtros);
        //Aplicamos el filtro
        this.buscaSalones(filtros.distancia, filtros.filtros);

      });

    return await modal.present();
  }
  */
}
