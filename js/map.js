// Global variables map, all_locs(all locations), markers and error counter //

var map, error, _reversed;
var error_counter = 0;
var all_locs = [
  {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}, loc_id: 0, loc_class: 'list0'},
  {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}, loc_id: 1, loc_class: 'list1'},
  {name: 'Union Square', location: {lat: 40.7347062, lng: -73.9895759}, loc_id: 2, loc_class: 'list2'},
  {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}, loc_id: 3, loc_class: 'list3'},
  {name: 'TriBeCa Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}, loc_id: 4, loc_class: 'list4'},
  {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}, loc_id: 5, loc_class: 'list5'}
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
  catchErrors(map, largeInfowindow, bounds);
};