import { Component } from '@angular/core';

import { MapPage } from '../map/map';
// import { ContactPage } from '../contact/contact';
//import {MapPage } from '../map/map';
import {HistoryPage } from '../history/history';
import {SearchPage } from '../search/search';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
    tab1Root: any = MapPage; 
    tab3Root: any = HistoryPage ;  
    tab2Root: any = SearchPage;
  constructor() {

  }
}
