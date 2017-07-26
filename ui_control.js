$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  //This will zoom to the location and open the pop up
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);


// $("#full-extent-btn").click(function() {
//   map.fitBounds(state.getBounds());
//   $(".navbar-collapse.in").collapse("hide");
//   return false;
// });

////Legend Controls////

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn2").click(function() {
  $("#legendModal_2").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

/////////////

//////////////////////Reports button//////////////////////////
//Depending on the zoom the map initilizes at, the sidebar will be open or closed//



onload = $("#sidebar").hide();


$("#list-btn").click(function(){
  $("#sidebar").toggle(600,"linear",function(){
    if ($('#sidebar').is(':hidden')){
      bigSlider();
    } if ($('#sidebar').is(':visible')){
      smallSlider();
    };
  });
});

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
}

///////////////Chevron next to "Reports of interest"//////////////////
$("#sidebar-hide-btn").click(function() {
  $("#sidebar").toggle("slow","linear",function(){
    if ($('#sidebar').is(':hidden')){
      bigSlider();
    } if ($('#sidebar').is(':visible')){
      smallSlider();
    };
  });
});



/////////////////////////////////////////

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

$("#sidebar-toggle-btn").click(function() {
  animateSidebar();
  alterSliderWidth();
  return false;
});

/////////////////Function to change sidebar////////////////////
function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function() {
    map.invalidateSize();
  });
}

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 12);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}