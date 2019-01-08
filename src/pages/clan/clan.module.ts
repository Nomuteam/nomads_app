import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClanPage } from './clan';

@NgModule({
  declarations: [
    ClanPage,
  ],
  imports: [
    IonicPageModule.forChild(ClanPage),
  ],
})
export class ClanPageModule {}
