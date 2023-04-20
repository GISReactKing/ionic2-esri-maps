
var LoadMap = $(function () {
    var map;
    var graphic;
    var currLocation;
    var watchId;
    var gsvc;
    require([
        "esri/map", "esri/geometry/Point",
        "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
        "esri/graphic", "esri/Color", "dojo/domReady!"
    ], function (
        Map, Point,
        SimpleMarkerSymbol, SimpleLineSymbol,
        Graphic, Color
    ) {
            map = new Map("map", {
                basemap: "streets",
                center: [-85.957, 17.140],
                zoom: 2
            });
            function orientationChanged() {
                if (map) {
                    map.reposition();
                    map.resize();
                }
            }

            function initFunc(map) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
                    watchId = navigator.geolocation.watchPosition(showLocation, locationError);
                } else {
                    alert("Browser doesn't support Geolocation. Visit http://caniuse.com to see browser support for the Geolocation API.");
                }
            }

            function locationError(error) {
                //error occurred so stop watchPosition  oceans
                if (navigator.geolocation) {
                    navigator.geolocation.clearWatch(watchId);
                }
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("Location not provided");
                        break;

                    case error.POSITION_UNAVAILABLE:
                        alert("Current location not available");
                        break;

                    case error.TIMEOUT:
                        alert("Timeout");
                        break;

                    default:
                        alert("unknown error");
                        break;
                }
            }

            function zoomToLocation(location) {
                var pt = new Point(location.coords.longitude, location.coords.latitude);
                addGraphic(pt);
                map.centerAndZoom(pt, 12);
            }

            function showLocation(location) {
                //zoom to the users location and add a graphic
                var pt = new Point(location.coords.longitude, location.coords.latitude);
                if (!graphic) {
                    addGraphic(pt);
                } else { // move the graphic if it already exists
                    graphic.setGeometry(pt);
                }
                map.centerAt(pt);
            }

            function addGraphic(pt) {
                var symbol = new SimpleMarkerSymbol(
                    SimpleMarkerSymbol.STYLE_CIRCLE,
                    12,
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([210, 105, 30, 0.5]),
                        8
                    ),
                    new Color([210, 105, 30, 0.9])
                );
                graphic = new Graphic(pt, symbol);
                map.graphics.add(graphic);
            }
        });

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    showPosition(position);
                    // success!
                },
                function () {
                    $('#loading-indicator').hide();
                    // failed to get a GPS location before timeout!
                    alert('failed to get a GPS location before timeout!');
                }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 });
        } else {
            // no support for geolocation
            $('#loading-indicator').hide();
        }
    }

    function showPosition(position) {
          localStorage.setItem("latitude",position.coords.latitude);
          localStorage.setItem("longitude",position.coords.longitude);
          setPosition(position.coords.latitude, position.coords.longitude, true);
          ShowCoordinates();

    }

    function ShowCoordinates() {
        require([
            "esri/map", "esri/graphic", "esri/symbols/SimpleMarkerSymbol",
            "esri/tasks/GeometryService", "esri/tasks/ProjectParameters",
            "esri/SpatialReference", "esri/InfoTemplate", "dojo/dom", "dojo/on",
            "dojo/domReady!"
        ], function (
            Map, Graphic, SimpleMarkerSymbol,
            GeometryService, ProjectParameters,
            SpatialReference, InfoTemplate, dom, on
        ) {

                gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
                map.on("click", projectToWebMercator);

                function projectToWebMercator(evt) {
                    map.graphics.clear();

                    var point = evt.mapPoint;
                    var symbol = new SimpleMarkerSymbol().setStyle("diamond");
                    var graphic = new Graphic(point, symbol);
                    var outSR = new SpatialReference(102100);

                    map.graphics.add(graphic);

                    gsvc.project([point], outSR, function (projectedPoints) {
                        pt = projectedPoints[0];
                        graphic.setInfoTemplate(new InfoTemplate("Coordinates",
                            "<span>X:</span>" + pt.x.toFixed() + "<br>" +
                            "<span>Y:</span>" + pt.y.toFixed() + "<br>" +
                            "<input type='button' value='Convert back to LatLong' id='convert'>" +
                            "<div id='latlong'></div>"));
                        projectToLatLong();

                        map.infoWindow.setTitle(graphic.getTitle());
                        map.infoWindow.setContent(graphic.getContent());
                        map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
                        on.once(dom.byId("convert"), "click", projectToLatLong);
                    });
                }

                function projectToLatLong() {
                    var outSR = new SpatialReference(4326);
                    var params = new ProjectParameters();
                    params.geometries = [pt.normalize()];
                    params.outSR = outSR;

                    gsvc.project(params, function (projectedPoints) {
                          localStorage.setItem("latitude", pt.y.toFixed(3));
                          localStorage.setItem("longitude",pt.x.toFixed(3));
                        pt = projectedPoints[0];
                        dom.byId("latlong").innerHTML = "<span>Latitude: </span> " +
                            pt.y.toFixed(3) + "<br><span>Longitude:</span>" + pt.x.toFixed(3);
                        document.getElementById("lbl_loc").innerText = "Latitude=" + pt.y.toFixed(3) + " " + "Logitude=" + pt.x.toFixed(3);
                    });
                }
            });
    }

    LoadMap.getCurrentLocation = function () {
        $('#loading-indicator').show();
        getLocation();
    };

    LoadMap.loadLocationData = function () {
     
        var lat = localStorage.getItem("latitude");
        var lon = localStorage.getItem("longitude");
        setPosition(lat, lon, false);

    }

    function setPosition(lat, lon, setLocation) {
        require([
            "esri/map", "esri/geometry/Point",
            "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureFillSymbol", "esri/symbols/CartographicLineSymbol", 
            "esri/graphic", "esri/Color", "dojo/domReady!"
        ], function (
            Map, Point,
            SimpleMarkerSymbol, SimpleLineSymbol,
              PictureFillSymbol, CartographicLineSymbol, 
            Graphic, Color
        ) {

                var pt = new Point(lon, lat);
                showLocation();
                function addGraphic(pt){
                  var icon = localStorage.getItem("esri_icon");                    
                  var symbol =  new esri.symbol.PictureMarkerSymbol({
                        "url":icon,

                        "height":20,

                        "width":20,

                        "type":"esriPMS"

                        });
              graphic = new Graphic(pt, symbol);
                    map.graphics.add(graphic);
                }
           /*     function addGraphic(pt) {
                    var symbol = new SimpleMarkerSymbol(
                        SimpleMarkerSymbol.STYLE_CIRCLE,
                        12,
                        new SimpleLineSymbol(
                            SimpleLineSymbol.STYLE_SOLID,
                            new Color([210, 105, 30, 0.5]),
                            8
                        ),
                        new Color([210, 105, 30, 0.9])
                    );
                    graphic = new Graphic(pt, symbol);
                    map.graphics.add(graphic);
                }
                */
                function showLocation() {
                    if (setLocation) {                       
                        document.getElementById("lbl_loc").innerText = "Latitude=" + lat.toFixed(3) + " " + "Logitude=" + lon.toFixed(3);
                        $('#loading-indicator').hide();
                    }
                    //zoom to the users location and add a graphic
                    var pt = new Point(lon, lat);

                     addGraphic(pt);
                    //map.centerAt(pt);
                    map.centerAndZoom(pt, 16);
                }
            })
    }

});