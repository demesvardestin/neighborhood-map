// MODELS AND VIEWMODELS //

// Location model //
var Location = function(data, elem=null) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.loc_id = ko.observable(data.loc_id);
  this.loc_class = ko.observable(data.loc_class);
};

// View //
var AppView = function() {
  var self = this;
  this.location_list = ko.observableArray([]);
  this.location_list_copy = ko.observableArray([]);
  this.empty_list = ko.observableArray([]);
  this.search_list = ko.observableArray([]);
  allLocs.forEach(function(loc) {
    self.location_list.push(new Location(loc));
    self.location_list_copy.push(new Location(loc));
  });

  // Search filter functionality //
  this.doSearch = function(item) {
    while (self.search_list().length > 0) {
      self.search_list().pop();
    };

    var bounds = new google.maps.LatLngBounds();
    var inputvalue = item.input.value;

    // Turn on all markers if input is empty //

    if (!inputvalue) {
      markers.forEach(function(m) {
        m.setMap(map);
        bounds.extend(m.position);
      });
      map.fitBounds(bounds);
      self.location_list(self.location_list_copy());
      return;
    };

    // Iterate thru locations, matching search input against location names //
    allLocs.forEach(function(l) {
      m = markers[l.loc_id];
      m.setMap(null);
      if (l.name.toLowerCase().startsWith(inputvalue) || l.name.toLowerCase().includes(inputvalue)) {
        self.search_list.push(new Location(l));
        m.setMap(map);
        bounds.extend(m.position);
        map.fitBounds(bounds);
      } else {
        error_counter = error_counter + 1;
      }
    });
    self.location_list(self.search_list());

    // Handle error if no location is a match //
    if (error_counter == allLocs.length) {
      error = true;
      alert('Location not found');
      error_counter = 0;
      error = false;
    }
  };

  this.showMarker = function(item) {
    var infodetails = new google.maps.InfoWindow();
    markers.forEach(function(m) {
      m.setMap(null);
      if (item.name() == m.title) {
        m.setMap(map);
        populateInfoWindow(m, infodetails);
      }
    });
  };
};

// Apply Bindings //

ko.applyBindings(new AppView());