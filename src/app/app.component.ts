import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
declare var Map: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  public database: SQLite;
  constructor(platform: Platform) {
    platform.ready().then(() => {
      localStorage.removeItem("latitude");
      localStorage.removeItem("longitude");
      this.database = new SQLite();
      this.database.openDatabase({ name: "esrimapdb", location: "default" }).then(() => {
        this.database.executeSql("CREATE TABLE IF NOT EXISTS SearchHistory (id INTEGER PRIMARY KEY, personname TEXT, lat TEXT, lon TEXT,iconUrl Text)", {}).then((data) => {
          console.log("TABLE CREATED: ", data);
        }, (error) => {
          console.error("Unable to execute sql", error);
        })
      }, (error) => {
        console.log("ERROR: ", error);
      });
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
