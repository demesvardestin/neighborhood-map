// Catch api errors //

function catchErrors(map, infowindow, bounds) {
  if (map == undefined) {
    alert('The map could not be displayed. Make sure that Javascript is enabled in your browser.');
  };
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