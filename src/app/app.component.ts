import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { SplashPage } from '../pages/splash/splash';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { RecoveryPage } from '../pages/recovery/recovery';
import { RegisterPage } from '../pages/register/register';
import { CirclesPage } from '../pages/circles/circles';
import { WalkPage } from '../pages/walk/walk';
import { TermsPage } from '../pages/terms/terms';
import { BrowsePage } from '../pages/browse/browse';
import { FilteredPage } from '../pages/filtered/filtered';
import { FiltersPage } from '../pages/filters/filters';
import { ClanfPage } from '../pages/clanf/clanf';
import { ClanshPage } from '../pages/clansh/clansh';
import { ChatsPage } from '../pages/chats/chats';
import { WalletPage } from '../pages/wallet/wallet';
import { MyeventsPage } from '../pages/myevents/myevents';
import { NotificationsPage } from '../pages/notifications/notifications';
import { FriendsPage } from '../pages/friends/friends';
import { HistoryPage } from '../pages/history/history';
import { MynomadsPage } from '../pages/mynomads/mynomads';
import { NewactPage } from '../pages/newact/newact';
import { ActivityPage } from '../pages/activity/activity';
import { ClanPage } from '../pages/clan/clan';
import { NewclanPage } from '../pages/newclan/newclan';
import { MembersPage } from '../pages/members/members';
import { BookPage } from '../pages/book/book';
import { NeweventPage } from '../pages/newevent/newevent';
import { LocatePage } from '../pages/locate/locate';
import { EventPage } from '../pages/event/event';
import { ChatPage } from '../pages/chat/chat';

import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController, keyboard: Keyboard) {
    platform.ready().then(() => {

      localStorage.setItem('Tipo', 'nomads');
      if (localStorage.getItem('Accepted') == 'caca'){
        this.rootPage = TabsPage;
      }
      //keyboard.disableScroll(true);
      statusBar.styleDefault();
      let splash = modalCtrl.create(SplashPage);
      splash.present();
      //splashScreen.hide();
    });
  }
}
