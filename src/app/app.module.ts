import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

//Generated Pages
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
import { CalendarPage } from '../pages/calendar/calendar';
import { ProfilePage } from '../pages/profile/profile';
import { ChatsPage } from '../pages/chats/chats';
import { WalletPage } from '../pages/wallet/wallet';
import { MyeventsPage } from '../pages/myevents/myevents';
import { NotificationsPage } from '../pages/notifications/notifications';
import { FriendsPage } from '../pages/friends/friends';
import { HistoryPage } from '../pages/history/history';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SplashPage,
    WelcomePage,
    LoginPage,
    RecoveryPage,
    RegisterPage,
    CirclesPage,
    WalkPage,
    TermsPage,
    BrowsePage,
    FilteredPage,
    FiltersPage,
    ClanfPage,
    ClanshPage,
    CalendarPage,
    ProfilePage,
    ChatsPage,
    WalletPage,
    MyeventsPage,
    NotificationsPage,
    FriendsPage,
    HistoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      scrollPadding: false,
        scrollAssist: false,
        autoFocusAssist: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SplashPage,
    WelcomePage,
    LoginPage,
    RecoveryPage,
    RegisterPage,
    CirclesPage,
    WalkPage,
    TermsPage,
    BrowsePage,
    FilteredPage,
    FiltersPage,
    ClanfPage,
    ClanshPage,
    CalendarPage,
    ProfilePage,
    ChatsPage,
    WalletPage,
    MyeventsPage,
    NotificationsPage,
    FriendsPage,
    HistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
