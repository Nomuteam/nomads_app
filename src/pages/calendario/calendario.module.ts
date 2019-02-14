import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarioPage } from './calendario';

@NgModule({
  declarations: [
    CalendarioPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarioPage),
  ],
})
export class CalendarioPageModule {}
