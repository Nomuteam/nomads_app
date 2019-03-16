import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllPage } from './all';

@NgModule({
  declarations: [
    AllPage,
  ],
  imports: [
    IonicPageModule.forChild(AllPage),
  ],
})
export class AllPageModule {}
