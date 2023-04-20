import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { SQLite} from 'ionic-native';
/*
  Generated class for the History page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
public database: SQLite;
  loading : any;
 public peopleHistory: Array<Object>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController ) {
    this.database = new SQLite();
            this.database.openDatabase({name: "esrimapdb", location: "default"}).then(() => {
            }, (error) => {
                console.log("ERROR: ", error);
            });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
  }
  ionViewDidEnter() {
   this.refresh();
 }
  public refresh() {
  var me = this;
  me.loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    me.loading.present().then(() => {
    });
        this.database.executeSql("SELECT * FROM SearchHistory", []).then((data) => {
            this.peopleHistory = [];
              me.loading.dismiss();
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.peopleHistory.push({personname: data.rows.item(i).personname, lat: data.rows.item(i).lat,lon: data.rows.item(i).lon,iconUrl :data.rows.item(i).iconUrl});
                }
            }
        }, (error) => {
            me.loading.dismiss();
           console.log("ERROR: " + JSON.stringify(error));
        });
    }
  loadMap(item)
 {
 localStorage.setItem("latitude",item.lat);
 localStorage.setItem("longitude",item.lon);
localStorage.setItem("esri_icon",item.iconUrl);
 document.getElementById('load_map').click();   
  this.navCtrl.parent.select(0);
 }
}
