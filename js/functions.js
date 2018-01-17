// Catch api errors //

function catchErrors(map, infowindow, bounds) {
  if (map == undefined) {
    alert('The map could not be displayed. Make sure that Javascript is enabled in your browser.');
  }
}


// Open Info Window and add details

function populateInfoWindow(marker, infowindow, off=null) {
  // Set variables proper to this function //
  var url, first, address;
  var geocoder = new google.maps.Geocoder;

  if (off === true) {
    infowindow.marker = marker;
    infowindow.setMarker = null;
    return;
  }

  // return timeout error after 5 seconds of no response
  var t_o = setTimeout(function() {
    alert('Wikipedia API request timeout');
  }, 5000);
  
  if (infowindow.marker != marker) {
    
    // Load geocoder to retrieve address by reverse-geocoding//
    geocoder.geocode({'location': marker.position}, function(results, status) {
      address = results[0].formatted_address;
      infowindow.marker = marker;

      // Make Wikipedia API call & fill content //
      $.ajax({
          url: 'http://en.wikipedia.org/w/api.php',
          data: { action: 'query', list: 'search', srsearch: marker.title, format: 'json' },
          dataType: 'jsonp',
          success: function(resp) {
            first = resp.query.search[0];
            url = 'http://en.wikipedia.org/wiki/' + first.title.split(' ').join('_');
            infowindow.setContent(
              '<div class="marker-info"><div><strong>' +
              marker.title +
              '</strong></div><div><p>' + address +
              '</p></div><div><p>Wikipedia:</p></div></div>' +
              '<div>'+'<a href=' + url + '><p>'+first.title+'</p></a>'+'</div>'
            );
            clearTimeout(t_o);
          }
      });
      infowindow.open(map, marker);
      infowindow.addListener('closeclick',function(){
        infowindow.setMarker = null;
        marker.setAnimation(null);
      });
    });
  }
}

// Toggle Bounce //

function toggleBounce(m) {
  markers.forEach(function(mark) {
    mark.setAnimation(null);
    if (m === mark) {
      if (m.getAnimation() !== null) {
        m.setAnimation(null);
      } else {
        m.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
  });
}