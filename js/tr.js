function newMap(data) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: data.location.lat, lng: data.location.lng},
    zoom: 13
  });
  var marker = new google.maps.Marker({
    map: map,
    position: data.location,
    title: data.name,
    animation: google.maps.Animation.DROP,
    id: data.loc_id
  });
  marker.populateInfoWindow(this, largeInfowindow);
  bounds.extend(marker.position);
  map.fitBounds(bounds);
};
// doc_id = document.getElementsByClassName("listing").id;
// location = all_locations[doc_id];
document.getElementsByClassName("listing").addListener('click', newMap(location));
function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
  locations = [
    {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}, loc_id: 0},
    {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}, loc_id: 1},
    {name: 'Union Square', location: {lat: 40.7347062, lng: -73.9895759}, loc_id: 2},
    {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}, loc_id: 3},
    {name: 'TriBeCa Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}, loc_id: 4},
    {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}, loc_id: 5}
  ];
  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  // The following group uses the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
    var position = locations[i].location;
    var name = locations[i].name;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: name,
      animation: google.maps.Animation.DROP,
      id: i
    });
    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);

}
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
};

// KNOCKOUT JS RELATED SCRIPT//

function doDisplay(loc) {
  return loc;
};
var Location = function(data, elem=null) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.loc_id = ko.observable(data.loc_id);
  // if (elem) {
  //   newMap(this.name(), this.location(), this.loc_id());
  // };
};
var AppView = function() {
  var all_locs = [
    {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}, loc_id: 0},
    {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}, loc_id: 1},
    {name: 'Union Square', location: {lat: 40.7347062, lng: -73.9895759}, loc_id: 2},
    {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}, loc_id: 3},
    {name: 'TriBeCa Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}, loc_id: 4},
    {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}, loc_id: 5}
  ];
  var self = this;
  this.location_list = ko.observableArray([]);
  all_locs.forEach(function(loc) {
    self.location_list.push(new Location(loc))
  });
  this.currentLoc = ko.observable(this.location_list()[0]);
  this.findMarker = function (elem) {
    markers.forEach(function(m) {
      m.setMap(null);
    });
    newMap(elem);
  };
  // document.getElementById('3').addEventListener('click', set_map(3));
};


ko.applyBindings(new AppView());
