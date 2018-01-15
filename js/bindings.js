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
  this.sorted_list = ko.observableArray([]);
  this.alphabetized = ko.observableArray([]);
  this.location_list = ko.observableArray([]);
  this.search_list = ko.observableArray([]);
  all_locs.forEach(function(loc) {
    self.location_list.push(new Location(loc))
  });
  $('.alphabetize').hide();
  if (this.alphabetized().length > 0) {
    $('.alphabetical-list').hide();
  };

  // Search filter functionality //
  this.doSearch = function(formElement) {

    // Clear/hide alphabetized array and filter //
    self.alphabetized([]);
    $('.alphabetize').hide();
    var inputvalue = document.getElementById('input').value.toLowerCase();

    // Handle error if invalid search or no input //
    if (inputvalue.length == 0) {
      alert('You search is invalid. Please enter a valid search.');
      return;
    };

    // Iterate thru locations, matching search input against location names //
    all_locs.forEach(function(l) {
      m = markers[l.loc_id];
      m.setMap(null);
      $('.'+l.loc_class).hide();
      if (l.name.toLowerCase().startsWith(inputvalue) || l.name.toLowerCase().includes(inputvalue)) {
        error = false;
        self.search_list.push(new Location(l));
        $('.'+l.loc_class).show();
        m.setMap(map);
        var infodetails = new google.maps.InfoWindow();
        toggleBounce(m);
        populateInfoWindow(m, infodetails);
        $('#search-loc-list').show();
      } else {
        error_counter = error_counter + 1;
      };
    });

    // Handle error if no location is a match //
    if (error_counter == all_locs.length) {
      error = true;
      $('#search-loc-list').hide();
      alert('Location not found');
      error_counter = 0;
      error = false;
    };
  };

  // Alphabetize filter //
  this.alphabetical = function() {
    self.search_list([]);
    $('.alphabetize').show()
    $('#search-loc-list').hide();
    if (_reversed == true) {
      this.alphabetized(this.alphabetized().reverse());
      _reversed = false;
      $('.alphabetical-list').hide();
      $('.reverse').show();
    } else {

      // Sort location hash alphabetically. Not ideal method, but works //
      $('.alphabetical-list').hide();

      // New observable array created //
      for (i=0;i<all_locs.length;i++) {
        self.sorted_list.push([all_locs[i].name.slice(0,4), all_locs[i].loc_id]);
      };

      // Sorted //
      var list = this.sorted_list().map(function(s) {
        return s[0]
      }).sort();

      // Nested loop to iterate thru sorted array, matching components w/ location names //
      for(i=0;i<list.length;i++) {
        for (x=0;x<all_locs.length;x++) {
          var ll = all_locs[x];

          // If location is a match, push to alphabetized array //
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

  // Reverse alphabetical filter //
  this.reversed = function() {
    self.search_list([]);
    $('.alphabetize').show();
    $('#search-loc-list').hide();
    this.alphabetized(this.alphabetized().reverse());
    _reversed = true;
    $('.alphabetical-list').show();
    $('.reverse').hide();
  };
  this.firstAlphabetized = ko.observable(this.alphabetized()[0]);
};

// Apply Bindings //

ko.applyBindings(new AppView());