var map, dmDate, featureList, cmSearch = [];

//trick to find object
// function dumpObjectToConsole(obj){
//   for(key in obj){
//     console.log(String(key)+": "+String(obj[key]));
//   }
// }

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

//////////////////////SLIDER//////////////////////

var miliseconds_per_day = 1000*60*60*24;  //converts miliseconds to days
// var miliseconds_per_week = 1000*7*24*60*60;

var totalDays = (Math.ceil((new Date()- new Date(2013,08,07))/miliseconds_per_day)); //Gives total days in data reports

//2013-09-01
//2013-08-07

var slider = document.getElementById('slider');
noUiSlider.create(slider, {
  start: [ totalDays ],
  step: 7,
  range: {
    'min': [  1 ],
    'max': [ totalDays ]
  }
});

//Patch for date issue and not having full week
//Runs when getJson hits Carto sql API on line 642
$('#daterange').html("Condition Monitoring Reports: Last 7 Days");              

//Changes slider date display based on slider postion
function changeLegend() {

  var sliderstopvalue = (slider.noUiSlider.get());
  var lastdayofweek = (totalDays - sliderstopvalue);

  var end = new Date(); //cast as new date
  ldw = end.setDate(end.getDate()-lastdayofweek);

  var start = new Date(ldw); //cast as new date and takes ldw variable
  fdw = start.setDate(start.getDate()-6);
  tdw = start.setDate(start.get()-4); // returns the tuesday of week

  fdw = new Date(fdw);    //Have to cast as new date because of javascript
  ldw = new Date(ldw);
  tdw = new Date(tdw);

  var newstart = new Date(fdw.setDate(fdw.getDate()+1));
  var startreport = String(newstart.getMonth()+1)+"/"+newstart.getDate()+"/"+String(newstart.getFullYear()).substring(2,4);
  var endreport = String(ldw.getMonth()+1)+"/"+ldw.getDate()+"/"+String(ldw.getFullYear()).substring(2,4);

  $('#daterange').html("Report Date:   " + startreport + " - " + endreport);
};

slider.noUiSlider.on('set', function(){
    getDate();
});

slider.noUiSlider.on('slide', function(){
    var d = getDateStrings();
    $('#daterange').text(d.f + " - "+ d.l);
    
    clearHighlight();
    map.removeLayer(cmLayer);
    reset_cmData();
});

function getISOStrings(){
    var d = getSliderDates();
    var fdwtoISO = new Date(d.f).toISOString();
    var ldwtoISO = new Date(d.l).toISOString();
    
    return {f:fdwtoISO, l:ldwtoISO};
};

function getDateStrings(){
    var d = getSliderDates();
    var fdwtoDate = new Date(d.f).toDateString();
    var ldwtoDate = new Date(d.l).toDateString();
    
    return { f:fdwtoDate, l:ldwtoDate };
}

function getSliderDates() {
    var sliderstopvalue = (slider.noUiSlider.get());
    var lastdayofweek = (totalDays - sliderstopvalue);

    var end = new Date(); //cast as new date
    ldw = end.setDate(end.getDate()-lastdayofweek);

    var start = new Date(ldw); //cast as new date and takes ldw variable
    fdw = start.setDate(start.getDate()-6);

    return {f:fdw, l:ldw};
};


function getDate(){
    var d = getISOStrings();

    $.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM table_6245450067 WHERE reportdate >= '" + d.f + "' and reportdate <= '" + d.l + "'", function (data) {
        cmData.addData(data);
        map.addLayer(cmLayer);
    });
};


/////////////////////////////////////////////////////////////OLD
// function getData(){

//   //Finds first and last day of a specific week based on slider postion
//   var sliderstopvalue = (slider.noUiSlider.get());
//   var lastdayofweek = (totalDays - sliderstopvalue);

//   var end = new Date(); //cast as new date
//   ldw = end.setDate(end.getDate()-lastdayofweek);

//   var start = new Date(ldw); //cast as new date and takes ldw variable
//   fdw = start.setDate(start.getDate()-7);

//   var  fdwtoISO= new Date(fdw).toISOString();
//   var ldwtoISO = new Date(ldw).toISOString();

//   //clear old cm data
//   map.removeLayer(cmLayer);
//   //add new cm data
//   $.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM table_6245450067 WHERE reportdate >= '" + fdwtoISO + "' and reportdate <= '" + ldwtoISO + "'", function (data) {
//   cmData.addData(data);
//   map.addLayer(cmLayer);
// });

//   //Finds date for Drought Monitor WMS based on the slider postion
//   var tuesday = new Date(fdw);
//   tuesday = tuesday.setDate(tuesday.getDate()+3);
//   var tues = new Date(tuesday).toISOString();

//   var date_parts = String(tues.split("T")[0]).split("-");  
//   dmDate = String(date_parts[0]).substr(2, 2)+String(date_parts[1])+String(date_parts[2]);
//   // console.log(dmDate);

// };

// function callDrought(dmDate) {
//   console.log("callDrought dmDate: "+dmDate);
//     map.removeLayer(ndmc_wms);

//     ndmc_wms = L.tileLayer.wms( "http://torka.unl.edu:8080/cgi-bin/mapserv.exe",{
//       map: "/ms4w/apps/dm/service/usdm"+dmDate+"_wms.map",
//       layers: "usdm"+dmDate,
//       styles: "default",
//       format: "image/png",
//       crs: L.CRS.EPSG900913,
//       opacity: .3
//     });
//     ndmc_wms.addTo(map);
//     //layerControl.addOverlay(ndmc_wms);
//   };

// slider.noUiSlider.on('slide', function(){
//   changeLegend();
// });

// slider.noUiSlider.on('set', function(){
//   getData();
//   callDrought(dmDate);
// });

//////////////////////NDMC WMS LAYER/////////////////////////////////
// var ndmc_wms = L.tileLayer.wms( "http://torka.unl.edu:8080/cgi-bin/mapserv.exe", {
//   map: "/ms4w/apps/dm/service/usdm160816_wms.map",
//   layers: "usdm160816",
//   styles: "default",
//   format: "image/png",
//   crs: L.CRS.EPSG900913,
//   opacity: .3
// })

// var dmDate = "160913"; //Hard coded date that needs to be set changing release date

// var ndmc_wms = L.tileLayer.wms( "http://torka.unl.edu:8080/cgi-bin/mapserv.exe",{
//   map: "/ms4w/apps/dm/service/usdm"+dmDate+"_wms.map",
//   layers: "usdm"+dmDate,
//   styles: "default",
//   format: "image/png",
//   crs: L.CRS.EPSG900913,
//   opacity: .3
// });


var ndmc_wms = L.tileLayer.wms( "http://ndmc-001.unl.edu:8080/cgi-bin/mapserv.exe",{
  map: "/ms4w/apps/usdm/service/usdm_current_wms.map",
  layers: "usdm_current",
  styles: "default",
  format: "image/png",
  crs: L.CRS.EPSG900913,
  opacity: .3
});

// function callDrought(dmDate) {
//   console.log("callDrought dmDate: "+dmDate);
//     map.removeLayer(ndmc_wms);

//     ndmc_wms = L.tileLayer.wms( "http://torka.unl.edu:8080/cgi-bin/mapserv.exe",{
//       map: "/ms4w/apps/dm/service/usdm"+dmDate+"_wms.map",
//       layers: "usdm"+dmDate,
//       styles: "default",
//       format: "image/png",
//       crs: L.CRS.EPSG900913,
//       opacity: .3
//     });
//     ndmc_wms.addTo(map);
//     //layerControl.addOverlay(ndmc_wms);
//   };

// slider.noUiSlider.on('slide', function(){
//   changeLegend();
// });

// slider.noUiSlider.on('set', function(){
//   getData();
//   callDrought(dmDate);
// });

// map.addLayer(ndmc_wms);

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

//////////////////////NDMC WMS LAYER/////////////////////////////////
// var ndmc_wms = L.tileLayer.wms( "http://torka.unl.edu:8080/cgi-bin/mapserv.exe", {
//   map: "/ms4w/apps/dm/service/usdm160816_wms.map",
//   layers: "usdm160816",
//   styles: "default",
//   format: "image/png",
//   crs: L.CRS.EPSG900913,
//   opacity: .3
// })

// map.addLayer(ndmc_wms);


//////////////////////BASEMAP LAYERS/////////////////////////////////
var cartoLight = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
  maxZoom: 14,
  minZoom: 3,
  attribution: '&copy; <a href="https://github.com/bmcbride/bootleaf">Bootleaf</a>, &copy; <a href="http://www.cocorahs.org/">CoCoRaHS</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
});
var usgsImagery = L.layerGroup([L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 14,
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
  fillColor: "#00FFFF",
  fillOpacity: 0.35,
  radius: 17
};

//layers.js was located here
/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 8
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

$.getJSON("https://cisa.cartodb.com/api/v2/sql/?format=GeoJSON&q=SELECT * FROM table_6245450067 WHERE reportdate >= (now() - interval '1 week')", function (data) {
  cmData.addData(data);
  map.addLayer(cmLayer);
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

map = L.map("map", {
  zoom: 8,
  //layers determines what gets added when map is intialized
  layers: [cartoLight, state, markerClusters, highlight],
  zoomControl: false,
  attributionControl: false
});

///////////////////////////////////////LAYER CONTROL/////////////////////////
/* Layer control listeners that allow for a single markerClusters layer */
map.on("overlayadd", function(e) {
  if (e.layer === cmLayer) {
    markerClusters.addLayer(cmData);
    syncSidebar();
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
map.on("click", function(e) {
  highlight.clearLayers();
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

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

var baseLayers = {
  "Street Map": cartoLight,
  "Aerial Imagery": usgsImagery
};

var groupedOverlays = {
  "CM Reports": {
    "Weekly Reports": cmLayer
    //"<img src='assets/img/cm-point.png' width='18' height='18'>&nbsp;Weekly"
  },
  "Reference Layers": {
    "NC & SC Counties": cnty,
    //"U.S. Drought Monitor": ndmc_wms,
    "Current USDM": ndmc_wms,
    "NOAA Climate Div.": climadiv,
    "Weather Forecast Off.": wfo,
    "Ecological Regions": eco,
    "HUC-6 Water Basins": huc
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);


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
  map.fitBounds(state.getBounds());
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
