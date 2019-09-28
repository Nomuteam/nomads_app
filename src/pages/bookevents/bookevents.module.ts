import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookEventsPage } from './bookevents';

@NgModule({
  declarations: [
    BookEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(BookEventsPage),
  ],
})
export class BookEventsPageModule {}
