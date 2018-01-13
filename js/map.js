// Global variables map, all_locs(all locations), markers and error counter //

var map, error, _reversed;
var error_counter = 0;
var all_locs = [
  {name: 'Queens College, City University of New York', location: {lat: 40.7380, lng: -73.8172}, loc_id: 0, loc_class: 'list0'},
  {name: 'The City College of New York', location: {lat: 40.8200, lng: -73.9493}, loc_id: 1, loc_class: 'list1'},
  {name: 'Brooklyn College', location: {lat: 40.6314, lng: -73.9544}, loc_id: 2, loc_class: 'list2'},
  {name: 'Staten Island College', location: {lat: 40.6018, lng: -74.1485}, loc_id: 3, loc_class: 'list3'},
  {name: 'Baruch College', location: {lat: 40.7402, lng: -73.9834}, loc_id: 4, loc_class: 'list4'},
  {name: 'Hunter College', location: {lat: 40.7685, lng: -73.9646}, loc_id: 5, loc_class: 'list5'}
];
var markers = [];

// Initialize map using gmaps API //

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });
  var locations = all_locs;
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < all_locs.length; i++) {
    var position = locations[i].location;
    var name = locations[i].name;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: name,
      animation: google.maps.Animation.DROP,
      id: i
    });
    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
  markers.forEach(function(m) {
    document.getElementById(m.id.toString()).addEventListener('click', function() {
      turnOffMarkers();
      $('.error').hide();
      m.setMap(map);
      toggleBounce(m);
      populateInfoWindow(m, largeInfowindow);
    });
  });
  // catchErrors(map, largeInfowindow, bounds);
};