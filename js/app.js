// Global variables map, all_locs(all locations), markers and error counter //

var map;
var _reversed;
var all_locs = [
  {name: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}, loc_id: 0, loc_class: 'list0'},
  {name: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}, loc_id: 1, loc_class: 'list1'},
  {name: 'Union Square', location: {lat: 40.7347062, lng: -73.9895759}, loc_id: 2, loc_class: 'list2'},
  {name: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}, loc_id: 3, loc_class: 'list3'},
  {name: 'TriBeCa Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}, loc_id: 4, loc_class: 'list4'},
  {name: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}, loc_id: 5, loc_class: 'list5'}
];
var markers = [];
var error;

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

};

function addListenerToFilteredElem(infowindow) {
  markers.forEach(function(m) {
    document.getElementsByClassName('list' + m.id.toString())[0].addEventListener('click', function() {
      turnOffMarkers();
      $('.error').hide();
      m.setMap(map);
      toggleBounce(m);
      populateInfoWindow(m, infowindow);
    });
  });
};

// Clear markers from map //

function turnOffMarkers() {
  if (error_counter > 0) {
    markers.forEach(function(m) {
      m.setMap(null);
    });
  };
};

// Open Info Window and add details

function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
    });
  }
};

// Toggle Bounce //

function toggleBounce(m) {
  markers.forEach(function(mark) {
    mark.setAnimation(null);
    if (m === mark) {
      if (m.getAnimation() !== null) {
        m.setAnimation(null);
      } else {
        m.setAnimation(google.maps.Animation.BOUNCE);
      };
    };
  });
}

// Models & ViewModel//

var Location = function(data, elem=null) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.loc_id = ko.observable(data.loc_id);
  this.loc_class = ko.observable(data.loc_class);
};
var Error = function(e) {
  this.name = ko.observable(e.name);
  this.err_class = ko.observable(e.err_class);
};
var AppView = function() {
  var self = this;
  var e = false;
  var err = {name: 'Location not found', err_class: 'error'}
  this.currentError = ko.observable(new Error(err));
  this.sorted_list = ko.observableArray([]);
  this.alphabetized = ko.observableArray([]);
  this.location_list = ko.observableArray([]);
  this.search_list = ko.observableArray([]);
  all_locs.forEach(function(loc) {
    self.location_list.push(new Location(loc))
  });
  $('#error').hide();
  $('.alphabetize').hide();
  if (this.alphabetized().length > 0) {
    $('.alphabetical-list').hide();
  };
  this.doSearch = function(formElement) {
    $('.location-list').hide();
    var inputvalue = document.getElementById('input').value.toLowerCase();
    all_locs.forEach(function(l) {
      m = markers[l.loc_id];
      m.setMap(null);
      $('.'+l.loc_class).hide();
      if (l.name.toLowerCase().includes(inputvalue)) {
        $('.error').hide();
        self.search_list.push(new Location(l));
        m.setMap(map);
        $('.'+l.loc_class).show();
        var largeInfowindow = new google.maps.InfoWindow();
        toggleBounce(m);
        populateInfoWindow(m, largeInfowindow);
        error = false;
        ('#search-list').show()
      } else {
        error = true;
        // error_counter = error_counter + 1;
        $('#error').show();
      };
    });
    console.log(error);
    if (error == true) {
      $('#error').show();
      $('#search-list').hide();
    };
  };
  this.alphabetical = function() {
    if (_reversed == true) {
      this.alphabetized(this.alphabetized().reverse());
      _reversed = false;
      $('.alphabetical-list').hide();
      $('.reverse').show();
    } else {
      $('.alphabetical-list').hide();
      for (i=0;i<all_locs.length;i++) {
        self.sorted_list.push([all_locs[i].name.slice(0,4), all_locs[i].loc_id]);
      };
      var list = this.sorted_list().map(function(s) {
        return s[0]
      }).sort();
      for(i=0;i<list.length;i++) {
        for (x=0;x<all_locs.length;x++) {
          var ll = all_locs[x];
          if (list[i] === ll.name.slice(0,4)) {
            self.alphabetized.push(new Location(ll));
          };
        };
      };
      var infowindow = new google.maps.InfoWindow();
      addListenerToFilteredElem(infowindow);
      $('.alphabetize').show();
      $('.reverse').show();
    };
  };
  this.reversed = function() {
    this.alphabetized(this.alphabetized().reverse());
    _reversed = true;
    $('.alphabetical-list').show();
    $('.reverse').hide();
  };
  this.firstAlphabetized = ko.observable(this.alphabetized()[0]);
};

// Apply Bindings //

ko.applyBindings(new AppView());
