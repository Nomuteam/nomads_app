import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendantsPage } from './attendants';

@NgModule({
  declarations: [
    AttendantsPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendantsPage),
  ],
})
export class AttendantsPageModule {}
