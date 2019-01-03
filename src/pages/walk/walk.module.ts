import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalkPage } from './walk';

@NgModule({
  declarations: [
    WalkPage,
  ],
  imports: [
    IonicPageModule.forChild(WalkPage),
  ],
})
export class WalkPageModule {}
