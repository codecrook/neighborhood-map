var map;
var Bhubaneswar = {lat: 20.2961, lng: 85.8245};

var mapApiKey = 'AIzaSyDEArnN6PcHEu8QNZ7dv8AsqCK9PVPrC1o';
function initMap() {
  map = new google.maps.Map(document.getElementById('map-container'), {
    center: Bhubaneswar,
    zoom: 12,
    mapTypeControl: false
  });

  var DhabaLocationModel = {
    locations: [
      new DhabaLocation('Jungle View', 20.401943, 85.806067, 'ChIJH62rupQOGToRFiMvN5pH5m4'),
      new DhabaLocation('Nakli Dhaba', 20.300328, 85.819313, 'ChIJ70Z_acYJGToRpoKdWV3ryk0'),
      new DhabaLocation('Brother\'s Dahaba', 20.2169217, 85.8518417, 'ChIJO8A4iTOhGToRCB6ms6N6yCM'),
      new DhabaLocation('Yummyies Dhaba', 20.356689, 85.8887489, 'ChIJkaYOyZ8LGToRvDnL9952RUw'),
      new DhabaLocation('Behera Dhaba', 20.2337221, 85.74291549, 'ChIJHVC1QF-oGToROltP04gs5qQ'),
      new DhabaLocation('Jaalazza - The Urban Dhaba', 20.3556818, 85.81583980000005, 'ChIJiSQJAyMJGToRvzMdfjsB-mg'),
      new DhabaLocation('Chilika Dhaba', 20.3493646, 85.82502869999996, 'ChIJ1xMiUhQJGToRVxCaWX41VpQ'),
      new DhabaLocation('Smart Dhaba', 20.3533282, 85.82409759999996, 'ChIJO2bGGT4JGToR07MTsXJoHUQ'),
      new DhabaLocation('YUMMYIES', 20.278748, 85.84481800000003, 'ChIJ__-_PlqnGToR61DqmdPH9YU'),
    ],
  };
}

function googleMapError() {
  window.alert("Problem in Google Map");
}

//Creating the DhabaLocation class that'll store all the info and functions required
var DhabaLocation = function(title, lat, lng, placeID) {

  var self = this;

  this.title = title;
  this.lat = lat;
  this.lng = lng;
  this.placeID = placeID;

  this.getData = function() {
    var rating;
    var reviews = [];
    var address;
    var phone_no;
    //var dhabaImg;

    var placeURL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${self.placeID}&key=${mapApiKey}`;

    // Function to be Debugged latter
    $.ajax({
      url: placeURL,
      dataType: 'jsonp',
      type: "GET",
      crossOrigin: true,
      xhrFields: { withCredentials: true },
      cache: false
    }).done(function(data){
      rating = data.result.rating.toString();
      address = data.result.formatted_address.toString();
      phone_no = data.result.formatted_phone_number.toString();
      $.each(data.result.reviews, function(i, review) {
        reviews.push(`<li>${review.text}</li>`);
      });

      self.content = `<h2>${self.title}</h2>
                      <h3>${rating}</h3>
                      <h3>Phone: ${phone_no}</h3>
                      <p><b>Address:</b> ${address}</p>`
                      + '<ol class="ratings">' +reviews.join(' ')+ '</ol>';
      }).fail(function(){
        self.content = `<h2>${self.title}</h2>
                        <p class = "error-msg">Error with Places API</p>`;
      });
    }();

    this.marker = new google.maps.Marker({
      position: {lat: self.lat, lng: self.lng},
      icon: 'http://www.googlemapsmarkers.com/v1/990000/',
      animation: google.maps.Animation.DROP,
      map: map,
      title: self.title
    });

    this.infowindow = new google.maps.InfoWindow();

    this.openInfowindow = function() {
      map.panTo(self.marker.getPosition());
      self.infowindow.setContent(self.content);
      self.infowindow.open(map,self.marker);
    };
    this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
};

function googleMapError() {
  window.alert("Problem in Google Map");
}
