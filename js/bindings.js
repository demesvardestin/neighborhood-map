// Models & ViewModel //

var Location = function(data, elem=null) {
  this.name = ko.observable(data.name);
  this.location = ko.observable(data.location);
  this.loc_id = ko.observable(data.loc_id);
  this.loc_class = ko.observable(data.loc_class);
};

var Error = function(err) {
  this.name = ko.observable(err.name);
  this.err_class = ko.observable(err.err_class);
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
    self.alphabetized([]);
    $('.alphabetize').hide();
    var inputvalue = document.getElementById('input').value.toLowerCase();
    all_locs.forEach(function(l) {
      m = markers[l.loc_id];
      m.setMap(null);
      $('.'+l.loc_class).hide();
      if (l.name.toLowerCase().startsWith(inputvalue)) {
        error = false;
        $('#error').hide();
        self.search_list.push(new Location(l));
        $('.'+l.loc_class).show();
        m.setMap(map);
        var largeInfowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();
        toggleBounce(m);
        populateInfoWindow(m, largeInfowindow);
        $('#search-loc-list').show();
        bounds.extend(m.position);
      } else {
        error_counter = error_counter + 1;
      };
    });
    if (error_counter == all_locs.length) {
      error = true;
      $('#error').show();
      $('#search-loc-list').hide();
      error_counter = 0;
    };
  };
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