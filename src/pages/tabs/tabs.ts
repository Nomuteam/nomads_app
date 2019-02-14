import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CalendarPage } from '../calendar/calendar';
import { ProfilePage } from '../profile/profile';
import { ProfallyPage } from '../profally/profally';
import { MyactivitiesPage } from '../myactivities/myactivities';
import { CalendarioPage } from '../calendario/calendario';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = CalendarPage;
  tab5Root = ProfilePage;
  tab6Root = ProfallyPage;
  tab7Root = MyactivitiesPage;
  tab8Root = CalendarioPage;

  public type: any;
  public selected: any;

  constructor() {
    this.type = localStorage.getItem('Tipo');
    ( this.type == 'allies' ? this.selected = '2' : this.selected = '2');
  }
}
