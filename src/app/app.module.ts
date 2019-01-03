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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
    TermsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {mode: 'ios'})
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
    TermsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
