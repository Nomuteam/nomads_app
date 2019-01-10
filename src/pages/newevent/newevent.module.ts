import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NeweventPage } from './newevent';

@NgModule({
  declarations: [
    NeweventPage,
  ],
  imports: [
    IonicPageModule.forChild(NeweventPage),
  ],
})
export class NeweventPageModule {}
