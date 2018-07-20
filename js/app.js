(function () {
    
    'use strict';
    var map;
    var Bhubaneswar = {lat: 20.2961, lng: 85.8245};
    var openWeatherMapApiKey = '2d3be81cb9645506add717caa301f5d4';

    var infowindow;
    var bounds;
    
    var weatherInfoContent;
    var weatherIcon;


    function initMap() {
        map = new google.maps.Map(document.getElementById('map-container'), {
            center: Bhubaneswar,
            zoom: 11,
            mapTypeControl: false
        });
        
        infowindow = new google.maps.InfoWindow();
        bounds = new google.maps.LatLngBounds();
    }
    
    function googleMapError() {
        window.alert('Problem in Google Map');
    }
    
    initMap();
    
    var placeService = new google.maps.places.PlacesService(map);

    //Creating the DhabaLocation class that'll store all the info and functions required
    var DhabaLocation = function (title, lat, lng, placeID) {
        
        var self = this;
        
        this.title = title;
        this.lat = lat;
        this.lng = lng;
        this.placeID = placeID;
        
        
        this.visible = ko.observable(true);
        //function to get details about a 'dhaba' and weather info of the city
        this.getData = function () {
            var rating;
            var reviews = [];
            var address;
            var phone_no;
            
            //code to get details of a 'dhaba' from Google Places API
            placeService.getDetails({
                placeId: self.placeID
            }, function (result, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    rating = result.rating;
                    address = result.adr_address;
                    
                    if (result.international_phone_number) {
                        phone_no = result.international_phone_number;
                    } else {
                        phone_no = 'Not Found!';
                    }
                    
                    $.each(result.reviews, function (i, review) {
                        reviews.push(`<li> ${review.text} </li>`);
                    });
                    
                    self.content = `<h2>${self.title}</h2>
                                    <div class='info-window'>
                                    <h3>Rating: ${rating} <i class='fas fa-star rating'></i></h3>
                                    <p><i class='fas fa-phone'></i> ${phone_no}</p>
                                    <p><b><i class='fas fa-map-marker-alt'></i></b> ${address}</p>
                                    <h3>Reviews:</h3>`
                                    + '<ol class="review">' +reviews.join(' ')+ '</ol></div>';
                } else {
                    self.content = `<h2>${self.title}</h2>
                                    <p class = 'error-msg'>Error with Places API</p>`;
                }
            });
            
            
            //Code to get Weather info of the city from OpenWeatherMap API
            var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${Bhubaneswar.lat}&lon=${Bhubaneswar.lng}&appid=${openWeatherMapApiKey}&units=metric`;
            
            //get live weather data in every 10 seconds
            setInterval(function(){
                $.ajax({
                    url: weatherURL,
                    dataType: 'json'
                }).done(function(weatherInfo){
                    weatherInfoContent =
                        `<img class="weather-icon" src="http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png">
                         <h3 class="weather-description">${weatherInfo.weather[0].description}</h3>
                         <p class="weather-temp"><i class="fas fa-thermometer-half"></i>  ${weatherInfo.main.temp} &#8451;</p>`;
                    
                    $('.weather-info').html(weatherInfoContent);
                }).fail(function(){
                    weatherInfoContent = `<p class="error-msg'>Error in getting data from OpenWeatherMap</p>`;
                    $('.weather-info').html(weatherInfoContent);
                });
            }, 10000);
            
        }();
        
        //code to make the marker for the given location
        this.marker = new google.maps.Marker({
            position: {lat: self.lat, lng: self.lng},
            icon: createMarkerIcon('990000'),
            animation: google.maps.Animation.DROP,
            title: self.title
        });
        
        //function to show the markers on map according to their vivsibility value
        this.filterMarkers = ko.computed(function() {
            if (self.visible() === true) {
                self.marker.setMap(map);
                bounds.extend(self.marker.position);
                map.fitBounds(bounds);
            } else {
                self.marker.setMap(null);
            }
        });
        
        //function to create the InfoWindow for an individual marker
        this.openInfowindow = function() {
            map.panTo(self.marker.getPosition());
            infowindow.setContent(self.content);
            infowindow.open(map,self.marker);
            
            infowindow.addListener('closeclick', function(){
                infowindow.marker = null;
            });
        };
        
        this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
        
        this.marker.addListener('mouseover', function() {
            this.setIcon(createMarkerIcon('8B008B'));
        });
        
        this.marker.addListener('mouseout', function() {
            this.setIcon(createMarkerIcon('990000'));
        });
        
    };
    
    var DhabaLocationModel = {
        locations: [
            new DhabaLocation('Jungle View', 20.401943, 85.806067, 'ChIJH62rupQOGToRFiMvN5pH5m4'),
            new DhabaLocation('Nakli Dhaba', 20.300328, 85.819313, 'ChIJ70Z_acYJGToRpoKdWV3ryk0'),
            new DhabaLocation('Brother\'s Dhaba', 20.2169217, 85.8518417, 'ChIJO8A4iTOhGToRCB6ms6N6yCM'),
            new DhabaLocation('Yummyies Dhaba', 20.356689, 85.8887489, 'ChIJkaYOyZ8LGToRvDnL9952RUw'),
            new DhabaLocation('Behera Dhaba', 20.2337221, 85.74291549, 'ChIJHVC1QF-oGToROltP04gs5qQ'),
            new DhabaLocation('Jaalazza - The Urban Dhaba', 20.3556818, 85.81583980000005, 'ChIJiSQJAyMJGToRvzMdfjsB-mg'),
            new DhabaLocation('Chilika Dhaba', 20.3493646, 85.82502869999996, 'ChIJ1xMiUhQJGToRVxCaWX41VpQ'),
            new DhabaLocation('Smart Dhaba', 20.3533282, 85.82409759999996, 'ChIJO2bGGT4JGToR07MTsXJoHUQ'),
            new DhabaLocation('YUMMYIES', 20.278748, 85.84481800000003, 'ChIJ__-_PlqnGToR61DqmdPH9YU'),
        ],
        searchQuery: ko.observable('')
    };
    
    //function to search locations
    DhabaLocationModel.search = ko.computed(function() {
        var self = this;
        var search = this.searchQuery().toLowerCase();
        return ko.utils.arrayFilter(self.locations, function(location) {
            var result = location.title.toLowerCase().indexOf(search) >= 0;
            location.visible(result);
            return result;
        });
        
    }, DhabaLocationModel);
    
    ko.applyBindings(DhabaLocationModel);
    
    
    //function to create marker icon using Google Chart API
    function createMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2',
            new google.maps.Size(25, 40),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(25, 40));
        return markerImage;
    }
    
})();