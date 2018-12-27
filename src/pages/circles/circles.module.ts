import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CirclesPage } from './circles';

@NgModule({
  declarations: [
    CirclesPage,
  ],
  imports: [
    IonicPageModule.forChild(CirclesPage),
  ],
})
export class CirclesPageModule {}
