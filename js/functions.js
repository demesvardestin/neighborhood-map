// Catch api errors //

function catchErrors(map, infowindow, bounds) {
  if (map == undefined) {
    alert('The map could not be displayed. Make sure that Javascript is enabled in your browser.');
  }
};

// add event listener to select elements //

function addListenerToFilteredElem(infowindow) {
  markers.forEach(function(m) {
    document.getElementsByClassName('list' + m.id.toString())[0].addEventListener('click', function() {
      turnOffMarkers();
      $('.error').hide();
      m.setMap(map);
      toggleBounce(m);
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(m.position);
      populateInfoWindow(m, infowindow);
    });
  });
};

// Clear markers from map //

function turnOffMarkers() {
  markers.forEach(function(m) {
    m.setMap(null);
  });
};

// Open Info Window and add details

function populateInfoWindow(marker, infowindow) {
  // Set variables proper to this function //
  var url, first, address;
  var geocoder = new google.maps.Geocoder;

  // return timeout error after 5 seconds of no response
  var t_o = setTimeout(function() {
    alert('Wikipedia API request timeout');
  }, 5000);
  
  if (infowindow.marker != marker) {

    // Load geocoder to retrieve address by reverse-geocoding//
    geocoder.geocode({'location': marker.position}, function(results, status) {
      address = results[0].formatted_address;
      infowindow.marker = marker;

      // Fill content //
      infowindow.setContent(
        '<div class="marker-info"><div><strong>' +
        marker.title +
        '</strong></div><div><p>' + address +
        '</p></div><div><p>Wikipedia:</p></div></div>'
      );
      infowindow.open(map, marker);
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
      });
    });
  }

  // Wikipedia API call using jsonp //
  $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      data: { action: 'query', list: 'search', srsearch: marker.title, format: 'json' },
      dataType: 'jsonp',
      success: function(resp) {
        first = resp.query.search[0];
        url = 'http://en.wikipedia.org/wiki/' + first.title.split(' ').join('_');
        $('.marker-info').append('<a href=' + url + '><p>'+first.title+'</p></a>');
        clearTimeout(t_o)
      }
  });
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