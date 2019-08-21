import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

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
import { ProfallyPage } from '../pages/profally/profally';
import { MyactivitiesPage } from '../pages/myactivities/myactivities';
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
import { DetailsPage } from '../pages/details/details';
import { AyudaPage } from '../pages/ayuda/ayuda';
import { ReviewsPage } from '../pages/reviews/reviews';
import { TicketPage } from '../pages/ticket/ticket';
import { EditactPage } from '../pages/editact/editact';
import { EditeventPage } from '../pages/editevent/editevent';
import { CalendarioPage } from '../pages/calendario/calendario';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { ReservationsPage } from '../pages/reservations/reservations';
import { AllPage } from '../pages/all/all';
import { CardPage } from '../pages/card/card';
import { DayPage } from '../pages/day/day';
import { TypesPage } from '../pages/types/types';
import { NewstudioPage } from '../pages/newstudio/newstudio';
import { StudioPage } from '../pages/studio/studio';
import { EditstudioPage } from '../pages/editstudio/editstudio';
import { AttendantsPage } from '../pages/attendants/attendants';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

import { NgCalendarModule  } from 'ionic2-calendar';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { Stripe } from '@ionic-native/stripe';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './firebase.credentials';

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
    HistoryPage,
    ProfallyPage,
    MyactivitiesPage,
    MynomadsPage,
    NewactPage,
    ActivityPage,
    ClanPage,
    NewclanPage,
    MembersPage,
    BookPage,
    NeweventPage,
    LocatePage,
    EventPage,
    ChatPage,
    DetailsPage,
    AyudaPage,
    ReviewsPage,
    TicketPage,
    EditactPage,
    EditeventPage,
    CalendarioPage,
    TutorialPage,
    ReservationsPage,
    AllPage,
    CardPage,
    DayPage,
    TypesPage,
    NewstudioPage,
    StudioPage,
    EditstudioPage,
    AttendantsPage
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      scrollPadding: true,
      scrollAssist: true,
      autoFocusAssist: true
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule
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
    HistoryPage,
    ProfallyPage,
    MyactivitiesPage,
    MynomadsPage,
    NewactPage,
    ActivityPage,
    ClanPage,
    NewclanPage,
    MembersPage,
    BookPage,
    NeweventPage,
    LocatePage,
    EventPage,
    ChatPage,
    DetailsPage,
    AyudaPage,
    ReviewsPage,
    TicketPage,
    EditactPage,
    EditeventPage,
    CalendarioPage,
    TutorialPage,
    ReservationsPage,
    AllPage,
    CardPage,
    DayPage,
    TypesPage,
    NewstudioPage,
    StudioPage,
    EditstudioPage,
    AttendantsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    LaunchNavigator,
    Camera,
    Stripe,
    InAppBrowser,
    SocialSharing,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
