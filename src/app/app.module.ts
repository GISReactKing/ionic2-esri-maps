import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { MapPage } from '../pages/map/map';
import {HistoryPage } from '../pages/history/history';
import {SearchPage } from '../pages/search/search';

@NgModule({
  declarations: [
    MyApp,   
      MapPage,
      HistoryPage,
      SearchPage,
    TabsPage
     
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,  
      MapPage,
      SearchPage,
      HistoryPage,     
      TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
