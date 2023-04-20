import { Component } from '@angular/core';
import { NavController, NavParams,Platform,LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { SQLite} from 'ionic-native';
import 'rxjs/Rx';
/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
public database: SQLite;
loading : any;
 ListItems =  {"id":"", "name":"", "lat":"", "long":"","iconUrl":""}
    items=[];
    constructor(public http: Http, public  navController: NavController, private platform: Platform, public loadingCtrl: LoadingController ) {
    this.initializeItems();        
    this.database = new SQLite();
            this.database.openDatabase({name: "esrimapdb", location: "default"}).then(() => { 
            }, (error) => {
                console.log("ERROR: ", error);
            });
    }   
      

    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }
     initializeItems() {
       
          this.http.get('assets/json/Location.json').map((res) => res.json()).subscribe(data => {
       
            this.items=[];
           for(var i=0;i<data.length;i++){  
            this.ListItems =  {"id":"","name":"", "lat":"", "long":"","iconUrl":""}
            this.ListItems.id = data[i].id;
            this.ListItems.name = data[i].name;
            this.ListItems.lat = data[i].lat;
            this.ListItems.long = data[i].long;
            this.ListItems.iconUrl = data[i].iconUrl;

            this.items.push(this.ListItems);
           }
      }); 
   }


    getItems(ev) {
   
        this.http.get('assets/json/Location.json').map((res) => res.json()).subscribe(data => {
       
            this.items=[];
           for(var i=0;i<data.length;i++){
                this.ListItems =  {"id":"","name":"", "lat":"", "long":"","iconUrl":""}
            this.ListItems.id = data[i].id;
            this.ListItems.name = data[i].name;
            this.ListItems.lat = data[i].lat;
            this.ListItems.long = data[i].long;
            this.ListItems.iconUrl = data[i].iconUrl;
            
            this.items.push(this.ListItems);
           }

        var val = ev.target.value;
       if (val && val.trim() != '') {
         var data1= this.items;
            for(var j=0;j < data1.length;j++){
          
            var name= data1[j].name;
           this.items  = this.items.filter((item) => {
               return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
           })
        }
      } 
      }); 
   
    }

    CallFun(item)
   {
      var me = this;
        me.loadingCtrl.create({
      content: "Please wait...",

      dismissOnPageChange: true

    });
 this.database.executeSql('INSERT INTO SearchHistory (id,personname,lat,lon,iconUrl) VALUES (?,?,?,?,?)', [item.id, item.name, item.lat, item.long,item.iconUrl]);

//    this.database.executeSql("INSERT INTO SearchHistory (personname,lat,lon) VALUES ('"+item.name +"','"+item.lat +"','"+item.long +"')", []).then((data) => {
//             alert("INSERTED: " + JSON.stringify(data));
//         }, (error) => {
//            alert("ERROR: " + JSON.stringify(error.err));
//         });
localStorage.setItem("latitude",item.lat);
localStorage.setItem("longitude",item.long);
localStorage.setItem("esri_icon",item.iconUrl);
document.getElementById('btn_hidden').click();   
this.navController.parent.select(0);

   }

   
}



