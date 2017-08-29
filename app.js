var map, dmDate, featureList, cmSearch = [];

//If there are problems updating the website, clear browser cache


//trick to find object
// function dumpObjectToConsole(obj){
//   for(key in obj){
//     console.log(String(key)+": "+String(obj[key]));
//   }
// }

// Use alert([variable]) to check values

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

//URL paramaters
//This makes a URL that can go to a specific date (www.cisa.sc.edu/map/?date=10-25-2016)
//Dates are subtracted from "totalDays"



function getParamsURL(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {return pair[1];}
  }
  return(false);
}

var dateURL = getParamsURL("date"); //////date format must be MM-DD-YYYY///////////////
var latURL = getParamsURL("lat");
var lonURL = getParamsURL("lon");
var zoomURL = getParamsURL("zoom");




//////////////////////SLIDER//////////////////////

var miliseconds_per_day = 1000*60*60*24;  //converts miliseconds to days
// var miliseconds_per_week = 1000*7*24*60*60;

var totalDays = (Math.ceil((new Date()- new Date(2016,09,17))/miliseconds_per_day)); //Gives total days in data reports
//Started October 9th 2016////


//Determines whether or not there is a URL value available then calculates the slider value and the most recent USDM////////
//If there is no date value in the url, then it reverts to the most recent date and USDM/////
//References: https://stackoverflow.com/questions/16719277/checking-if-a-variable-exists-in-javascript

if (dateURL !== undefined && dateURL !== false) {
  sliderDate = new Date(dateURL)
  sliderDays= (Math.floor((new Date()- sliderDate)/miliseconds_per_day))
  sliderNum= ((totalDays-sliderDays)+5)
  withURL(sliderNum);
  remainder = ((sliderNum-1)%7)

  //var d = getSliderDates();
  var lastdayofweek = (totalDays - sliderNum+remainder);

  var end = new Date(); //cast as new date

  ldw = end.setDate(end.getDate()-lastdayofweek);

  var start = new Date(ldw); //cast as new date and takes ldw variable

  tdw = start.setDate(start.getDate()-5); // returns the tuesday of week

  tdw = new Date(tdw);

  date1 = String(tdw.getMonth()+1)+"/"+tdw.getDate()+"/"+String(tdw.getFullYear()).substring(2,4);
  USDM="USDM for "+date1
} else {
  withoutURL();
  USDM="Most Recent USDM"
};

//////////////Lat and Longitude based on URL////////////////
if ((latURL && lonURL) !== undefined && (latURL && lonURL) !== false) {
  var lat = latURL;
  var lon = lonURL;
} else {
  var lat = 39.8282;
  var lon = -98.5795;
};

////////////////////Zoom from URL//////////////////////////
if (zoomURL !== undefined && zoomURL !== false) {
  var zoom = zoomURL;
} else {
  var zoom = 5;
};


////////////Slider date determined by URL/////////////////
function withURL(){
  var slider = document.getElementById('slider');
  noUiSlider.create(slider, {
    start: [sliderNum],
    step: 7,
    range: {
      'min': [  1 ],
      'max': [ totalDays ]
    }
  });
}

function withoutURL(){
  var slider = document.getElementById('slider');

  noUiSlider.create(slider, {
    start: [totalDays],
    step: 7,
    range: {
      'min': [  1 ],
      'max': [ totalDays ]
    }
  });

};


  d = getSliderDates();
  lastdayofweek = (totalDays - sliderstopvalue);

  end = new Date(); //cast as new date
  ldw = end.setDate(end.getDate()-lastdayofweek);

  start = new Date(ldw); //cast as new date and takes ldw variable
  fdw = start.setDate(start.getDate()-6);
  tdw = fdw; // returns the tuesday of week

  fdw = new Date(fdw);    //Have to cast as new date because of javascript
  ldw = new Date(ldw);
  tdw = new Date(tdw);

  newstart = new Date(fdw.setDate(fdw.getDate()));
  startreport = String(newstart.getMonth()+1)+"/"+newstart.getDate()+"/"+String(newstart.getFullYear()).substring(2,4);
  endreport = String(ldw.getMonth()+1)+"/"+ldw.getDate()+"/"+String(ldw.getFullYear()).substring(2,4);
  tuesReport = String(tdw.getMonth()+1)+"/"+tdw.getDate()+"/"+String(tdw.getFullYear()).substring(2,4);

$('#daterange').html("Report Date:   " + startreport + " - " + endreport);

///////////////////////Buttons for moving slider//////////////////
//Reference for buttons(html,Java,CSS): http://jsfiddle.net/IonDen/ujcmje33////////
//Reference for slider: https://refreshless.com/nouislider/events-callbacks///////

$('#slider-left-btn').on('click', function(){
  var oldSliderL = (slider.noUiSlider.get());
  var firstdayL = ((oldSliderL-1)%7)

  if (firstdayL>0) {
    var newSliderL=(oldSliderL-firstdayL)
    slider.noUiSlider.set(newSliderL);
      var d = getDateStrings();
      changeLegend();
      clearHighlight();
      map.removeLayer(cmLayer);    
      reset_cmData();
  } else {
    var newSliderL=(oldSliderL-7)
    slider.noUiSlider.set(newSliderL);
      var d = getDateStrings();
      changeLegend();
      clearHighlight();
      map.removeLayer(cmLayer);    
      reset_cmData();
  }
});

$('#slider-right-btn').on('click', function(){
  var oldSlider = (slider.noUiSlider.get());
  var remainder = ((oldSlider-1)%7)
  oldSliderNum = parseInt(oldSlider)
;  if (totalDays!=oldSlider) {
    var newSlider=(oldSliderNum+7)
    slider.noUiSlider.set(newSlider);
      var d = getDateStrings();
      changeLegend();
      clearHighlight();
      map.removeLayer(cmLayer);    
      reset_cmData();
  } else {
    alert("This is the most recent data from the timeline. Use the left arrow to look at historical data.")};
});

         

//Changes slider date display based on slider postion
function changeLegend() {

  var sliderstopvalue = (slider.noUiSlider.get());
  var lastdayofweek = (totalDays - sliderstopvalue);

  var end = new Date(); //cast as new date
  ldw = end.setDate(end.getDate()-lastdayofweek);

  var start = new Date(ldw); //cast as new date and takes ldw variable
  fdw = start.setDate(start.getDate()-6);
  tdw = fdw; // returns the tuesday of week

  fdw = new Date(fdw);    //Have to cast as new date because of javascript
  ldw = new Date(ldw);
  tdw = new Date(tdw);

  var newstart = new Date(fdw.setDate(fdw.getDate()));
  var startreport = String(newstart.getMonth()+1)+"/"+newstart.getDate()+"/"+String(newstart.getFullYear()).substring(2,4);
  var endreport = String(ldw.getMonth()+1)+"/"+ldw.getDate()+"/"+String(ldw.getFullYear()).substring(2,4);
  var tReport = String(tdw.getFullYear()+tdw.getMonth()+tdw.getDate());

  $('#daterange').html("Report Date:   " + startreport + " - " + endreport);
  
};


slider.noUiSlider.on('set', function(){
  getDate();
  var wmsDates=getWMSdates();
  date=wmsDates[0];
  dateString=wmsDates[1];
  map.removeLayer(groupedOverlays["Reference Layers"][USDM])
  groupedOverlays["Reference Layers"][USDM]=L.tileLayer.wms( "http://ndmc-001.unl.edu:8080/cgi-bin/mapserv.exe",{
    map: "/ms4w/apps/usdm/service/usdm_"+date+"_wms.map",
    layers: "usdm"+dateString,
    styles: "default",
    format: "image/png",
    crs: L.CRS.EPSG900913,
    opacity: .3
  });
  
  L.control.groupedLayers(baseLayers, groupedOverlays);
  map.addLayer(groupedOverlays["Reference Layers"][USDM])
  groupedOverlays["Reference Layers"][USDM].addTo(map);
});


slider.noUiSlider.on('slide', function(){
    var d = getDateStrings();
    $('#daterange').text(d.f + " - "+ d.l);
    clearHighlight();
    map.removeLayer(cmLayer);    
    reset_cmData();
});

tempDates=getWMSdates();
date1=tempDates[0];
dateString1=tempDates[1];


function getISOStrings(){
    d = getSliderDates();
    fdwtoISO = new Date(d.f).toISOString();
    ldwtoISO = new Date(d.l).toISOString();
    
    return {f:fdwtoISO, l:ldwtoISO};
};

function getDateStrings(){
    d = getSliderDates();
    fdwtoDate = new Date(d.f).toDateString();
    ldwtoDate = new Date(d.l).toDateString();

    return { f:fdwtoDate, l:ldwtoDate };
}

function getSliderDates() {
    sliderstopvalue = (slider.noUiSlider.get());
    lastdayofweek = (totalDays - sliderstopvalue);

    end = new Date(); //cast as new date
    ldw = end.setDate(end.getDate()-lastdayofweek);

    start = new Date(ldw); //cast as new date and takes ldw variable
    fdw = start.setDate(start.getDate()-6);

    return {f:fdw, l:ldw};
};


function getDate(){
    var d = getISOStrings();
    $.getJSON("https://cocorahs.carto.com:443/api/v2/sql/?format=GeoJSON&q=SELECT * FROM public.table_1abk8awn0essfy5dnbf7lq WHERE reportdate >= '" + d.f + "' and reportdate <= '" + d.l + "'", function (data) {
        cmData.addData(data);
        map.addLayer(cmLayer);
    });
};

function dateToJulianNumber(d) {
  // convert a Gregorian Date to a Julian number. 
  //    S.Boisseau / BubblingApp.com / 2014
  var x = Math.floor((14 - d.getMonth())/12);
  var y = d.getFullYear() + 4800 - x;
  var z = d.getMonth() - 3 + 12 * x;

  var JD = d.getDate() + Math.floor(((153 * z) + 2)/5) + (365 * y) + Math.floor(y/4) + Math.floor(y/400) - Math.floor(y/100) - 32045;
  return JD;
}   

function julianIntToDate(JD) {
   
  //taken from Stackoverflow https://stackoverflow.com/questions/26370688/convert-a-julian-date-to-regular-date-in-javascript/26371251
  //math checks out, validated by hand
  //Javascript starts months at 0
   var y = 4716;
   var v = 3;
   var j = 1401;
   var u =  5;
   var m =  2;
   var s =  153;
   var n = 12;
   var w =  2;
   var r =  4;
   var B =  274277;
   var p =  1461;
   var C =  -38;
   var f = JD + j + Math.floor((Math.floor((4 * JD + B) / 146097) * 3) / 4) + C;
   var e = r * f + v;
   var g = Math.floor((e % p) / r);
   var h = u * g + w;
   var D = Math.floor((h % s) / u) + 1;
   var M = ((Math.floor(h / s) + m) % n) + 1;
   var Y = Math.floor(e / p) - y + Math.floor((n + m - M) / n) ;
   return new Date(Y,M-1,D);

}



function getWMSdates() {
  var sliderstopvalue = (slider.noUiSlider.get());
  var lastdayofweek = (totalDays - sliderstopvalue);
  var today = new Date();

  today.setMonth(today.getMonth()+1)

  today=dateToJulianNumber(today)
  ldw = (today-lastdayofweek);
  delta=today-(ldw-4)

//The Julian date is from the last day of the week Saturday so 4 must be subtracted to get Tuesday
  var tdw1 = julianIntToDate(ldw-6)

  tdw=tdw1.getFullYear().toString()+pad((tdw1.getMonth()+1).toString(),2)+pad(tdw1.getDate().toString(),2)


  if (delta >= 7) {
    return [tdw,tdw];

    //return["current","_current"]
  } else {
    return ["current","_current"];
  }
};

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


 slider.noUiSlider.on('slide', function(){
   changeLegend();
 });


////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

function syncSidebar() {

  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  cmData.eachLayer(function (layer) {
    if (map.hasLayer(cmLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append(
          "<tr class='feature-row' id='" + L.stamp(layer) + "' lat ='" + layer.getLatLng().lat + "' lng='" + layer.getLatLng().lng + "'>" +
                    "<td class='feature-name'><strong><img width='20' height='20' src='"+set_PointIcon(layer.feature)+"'>&nbsp;" + 
                    layer.feature.properties.stationname + "</strong><br>" +
                    "<span class = 'text-muted pull-left'>" + layer.feature.properties.reportdate + "</span><br><br>" +
                    layer.feature.properties.description + "<br>" + "<br>" +
                    layer.feature.properties.stationnumber + " -- " +layer.feature.properties.categories + "</td>" +
                    // "<td style='vertical-align: middle;'><i class='fa fa-chevron-right pull-right'></i></td>" +
                    "</tr>");
      }
    }
  });

  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////


//////////////////////BASEMAP LAYERS/////////////////////////////////

// var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
//   maxZoom: 14,
//   minZoom: 3,
//   attribution: '&copy; <a href="https://github.com/bmcbride/bootleaf">Bootleaf</a>, &copy; <a href="http://www.cocorahs.org/">CoCoRaHS</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
// });
var arcBase = L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 14,
  minZoom: 3,
  attribution: 'Esri, HERE, Garmin, Intermap, INCREMENT P, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, © OpenStreetMap contributors, GIS User Community'
});
var usgsImagery = L.layerGroup([L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 14,
  minZoom: 3,
}), L.tileLayer.wms("http://raster.nationalmap.gov/arcgis/services/Orthoimagery/USGS_EROS_Ortho_SCALE/ImageServer/WMSServer?", {
  minZoom: 10,
  maxZoom: 14,
  layers: "0",
  format: 'image/jpeg',
  transparent: true,
  attribution: "Aerial Imagery courtesy USGS"
})]);

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

/* Overlay Layers */
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fill: true,
  fillColor: "#8F14ED",
  fillOpacity: 0.35,
  radius: 17
};

//layers.js was located here//


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 1
});


//////////////////////////////////CM DATA LAYER////////////////////////////////////
/* Empty layer placeholder to add to layer control for listening when to add/remove theaters to markerClusters layer */
var cmLayer = L.geoJson(null);
var cmData = L.geoJson(null);

function set_PointIcon(feature) {
  var category = feature.properties.scalebar;

  switch (category) {
    case 'Severely Dry': return "assets/img/d3.png";
    case 'Moderately Dry': return "assets/img/d2.png";
    case 'Mildly Dry': return "assets/img/d1.png";
    case 'Near Normal': return "assets/img/nn.png";
    case 'Mildly Wet': return "assets/img/w1.png";
    case 'Moderately Wet': return "assets/img/w2.png";
    case 'Severely Wet': return "assets/img/w3.png";
    case 'NA': return "assets/img/cm.png";
    default: return "assets/img/cm.png";    
  }
};

function reset_cmData() {
    cmData = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: set_PointIcon(feature),
        iconSize: [25, 25],
        iconAnchor: [11, 20],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.stationnumber,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Station Number</th><td>" + feature.properties.stationnumber + "</td></tr>" + "<tr><th>Report</th><td>" + feature.properties.description + "</td></tr>" + "<tr><th>Condition</th><td>" + feature.properties.scalebar + "</td></tr>" + "<tr><th>Date</th><td>" + feature.properties.reportdate + "</td></tr>" + "<table>";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.stationname);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="14" height="1" src="'+set_PointIcon(feature)+'"></td><td class="feature-name">' + layer.feature.properties.stationname + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      cmSearch.push({
        Station: layer.feature.properties.stationnumber,
        Report: layer.feature.properties.stationname,
        source: "Theaters",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});
};
reset_cmData();


////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////






map = L.map("map", {
  zoom: [zoom],
  minZoom: 3,
  maxZoom: 14,
  center: [lat, lon],
  //layers determines what gets added when map is intialized
  layers: [arcBase, markerClusters, highlight, ndmc_wms],
  zoomControl: false,
  attributionControl: false
});

////////////////////////////////////LAYER CONTROL/////////////////////////




/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === cmLayer) {
    markerClusters.addLayer(cmData);
    syncSidebar();
    groupedOverlays["Reference Layers"][USDM].addTo(map);
  }
});

map.on("overlayremove", function(e) {
  if (e.layer === cmLayer) {
    markerClusters.removeLayer(cmData);
    syncSidebar();
  }
});

/* Filter sidebar feature list to only show features in current map bounds */
map.on("moveend", function (e) {
  syncSidebar();
});

/* Clear feature highlight when map is clicked */
map.on("click", function (e) {
  highlight.clearLayers();
});

///////////Changing slider size functions/////////////
function smallSlider() {
  $("#slider").animate({
    left: "345px"
  }, 600, function() {
    map.invalidateSize();
  });
}

function bigSlider() {
  $("#slider").animate({
    left: "75px"
  }, 600, function() {
    map.invalidateSize();
  });
};


////////////////Changes the interface based on zoom level////////////////////////

onload = loadZoom();
function loadZoom() {
  if (map.getZoom() > 7) {
    $("#sidebar").show(600);
    smallSlider();
  } else{
    $("#sidebar").hide();
  }
};


// Opens the reports sidebar if zoom goes above 7//
map.on("zoomend", function (e) {
  if (map.getZoom() > 7) {
    $("#sidebar").show(600);
    smallSlider();
  };
});

/* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'><a href='http://cisa.sc.edu/'>CISA</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

/////////////////////////////Zoom Control that creates a home button//////////////////////////////////////
//home button from http://fortawesome.github.io/Font-Awesome/icon/home///
//https://gis.stackexchange.com/questions/127286/home-button-leaflet-map//

//Map Center when clicking on home button in zoom control//
var latBtn = 39.8282;
var lngBtn = -98.5795;
var zoomBtn = 5;


// custom zoom bar control that includes a Zoom Home function
L.Control.zoomHome = L.Control.extend({
    options: {
        position: 'topright',
        zoomInText: '+',
        zoomInTitle: 'Zoom in',
        zoomOutText: '-',
        zoomOutTitle: 'Zoom out',
        zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
        zoomHomeTitle: 'Zoom home'
    },

    onAdd: function (map) {
        var controlName = 'gin-control-zoom',
            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
            options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
        controlName + '-in', container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
        controlName + '-home', container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
        controlName + '-out', container, this._zoomOut);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

        return container;
    },

    onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    },

    _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1); 
    },

    _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    _zoomHome: function (e) {
        map.setView([latBtn, lngBtn], zoom);
    },

    _createButton: function (html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this)
            .on(link, 'click', this._refocusOnMap, this);

        return link;
    },

    _updateDisabled: function () {
        var map = this._map,
            className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
});
// add the new control to the map
var zoomHome = new L.Control.zoomHome({
  position: "bottomright"
}).addTo(map);


//////////Layer control (box on top left of screen)//////////////////////
/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": arcBase,
  "Aerial Imagery": usgsImagery
};

var groupedOverlays = {
  "CM Reports": {
    "Weekly Reports": cmLayer
    //"<img src='assets/img/cm-point.png' width='18' height='18'>&nbsp;Weekly"
  },
  "Reference Layers": {
    //"US Counties": cnty,
    // "U.S. Drought Monitor": ndmc_wms,
    // "NOAA Climate Div.": climadiv,
    // "Weather Forecast Off.": wfo,
    //"Ecological Regions": ecoRegionsEPA,
    //"USGS Water Basins": wbd
  }
};


getDate();
wmsDates=getWMSdates();
date1=wmsDates[0];
dateString1=wmsDates[1];
groupedOverlays["Reference Layers"][USDM]=L.tileLayer.wms( "http://ndmc-001.unl.edu:8080/cgi-bin/mapserv.exe",{
    map: "/ms4w/apps/usdm/service/usdm_"+date1+"_wms.map",
    layers: "usdm"+dateString1,
    styles: "default",
    format: "image/png",
    crs: L.CRS.EPSG900913,
    opacity: .3
  });
var ndmc_wms=groupedOverlays["Reference Layers"][USDM]


var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {collapsed: isCollapsed}).addTo(map);

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////

////////////////////////////////////GEO SEARCH/////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/* Highlight search box text on click */
$("#searchbox").click(function () {
  $(this).select();
});

/* Prevent hitting enter from refreshing the page */
$("#searchbox").keypress(function (e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

$("#featureModal").on("hidden.bs.modal", function (e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});

/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  sizeLayerControl();
  /* Fit map to boroughs bounds */
  // map.fitBounds(state.getBounds());
  featureList = new List("features", {valueNames: ["feature-name"]});
  featureList.sort("feature-name", {order:"asc"});

  var geonamesBH = new Bloodhound({
    name: "GeoNames",
    datumTokenizer: function (d) {
      return Bloodhound.tokenizers.whitespace(d.name);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: "http://api.geonames.org/searchJSON?username=bootleaf&featureClass=P&maxRows=5&countryCode=US&name_startsWith=%QUERY",
      filter: function (data) {
        return $.map(data.geonames, function (result) {
          return {
            name: result.name + ", " + result.adminCode1,
            lat: result.lat,
            lng: result.lng,
            source: "GeoNames"
          };
        });
      },
      ajax: {
        beforeSend: function (jqXhr, settings) {
          settings.url += "&east=" + map.getBounds().getEast() + "&west=" + map.getBounds().getWest() + "&north=" + map.getBounds().getNorth() + "&south=" + map.getBounds().getSouth();
          $("#searchicon").removeClass("fa-search").addClass("fa-refresh fa-spin");
        },
        complete: function (jqXHR, status) {
          $('#searchicon').removeClass("fa-refresh fa-spin").addClass("fa-search");
        }
      }
    },
    limit: 10
  });
  geonamesBH.initialize();

////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////
////////////////////  

  /* instantiate the typeahead UI */
  $("#searchbox").typeahead({
    minLength: 3,
    highlight: true,
    hint: false
  },  
    {
    name: "GeoNames",
    displayKey: "name",
    source: geonamesBH.ttAdapter(),
    templates: {
      header: "<h4 class='typeahead-header'><img src='assets/img/globe.png' width='25' height='25'>&nbsp;GeoNames</h4>"
    }
  }).on("typeahead:selected", function (obj, datum) {
    if (datum.source === "GeoNames") {
      map.setView([datum.lat, datum.lng], 14);
    }
    if ($(".navbar-collapse").height() > 50) {
      $(".navbar-collapse").collapse("hide");
    }
  }).on("typeahead:opened", function () {
    $(".navbar-collapse.in").css("max-height", $(document).height() - $(".navbar-header").height());
    $(".navbar-collapse.in").css("height", $(document).height() - $(".navbar-header").height());
  }).on("typeahead:closed", function () {
    $(".navbar-collapse.in").css("max-height", "");
    $(".navbar-collapse.in").css("height", "");
  });
  $(".twitter-typeahead").css("position", "static");
  $(".twitter-typeahead").css("display", "block");
});

// Leaflet patch to make layer control scrollable on touch browsers
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
  .disableClickPropagation(container)
  .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

map.invalidateSize();
