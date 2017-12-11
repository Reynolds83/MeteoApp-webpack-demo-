import $ from 'jquery';
import Modernizr from 'modernizr';
import loadGoogleMapsAPI from 'load-google-maps-api';

export default class {

    constructor(widget) {
        this.widget = widget;
        this.lat;
        this.lng;
        this.address;
        this.position;
        this.degrees;
        this.icon;
        this.condition;
        this.day;
        this.humidity;
        this.wind;
    }

    init() {
        this.testGeolocation();
    }

    /**
     * Tests geolocation support
     */
    testGeolocation() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;



                loadGoogleMapsAPI({key:"AIzaSyAz_BPo9hv9Omuba9B7Kmo7ow81hWOGAUY"}).then((googleMaps) => {
                    this.initMap();
                }).catch((err) => {
                    console.error(err)
                })

            });
        } else {
            console.log('Geolocation not available');
        }
    }


    /**
     * Initializes Google Map
     */
    initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: {lat: this.lat, lng: this.lng}
        });
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;

        this.geocodeLatLng(geocoder, map, infowindow);
    }

    /**
     * Creates Google Map
     */
    geocodeLatLng(geocoder, map, infowindow) {
        var latlng = {lat: this.lat, lng: this.lng};
        geocoder.geocode({'location': latlng}, (results, status) => {
            if (status === 'OK') {
                if (results[4]) {
                    this.address = results[0].formatted_address;
                    var pos = results[4].formatted_address;
                    this.position = pos.substring(0, pos.indexOf(','));
                    map.setZoom(11);
                    var marker = new google.maps.Marker({
                        position: latlng,
                        map: map
                    });                            
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);

                    this.getWeatherInfo();
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }


    /**
     * Renders the front of the card
     */
    renderFront() {
        this.widget.find('.front .position').html(this.position);
        this.widget.find('.front .degrees').html(this.degrees);
        this.widget.find('.front .humidity').html(this.humidity);
        this.widget.find('.front .wind').html(this.wind);
        this.widget.find('.front .icon').addClass('code'+this.icon);
        this.widget.find('.front .condition').html(this.condition);
        var that = this;

        this.widget.find('div.days ul li').filter(function(){
            return $(this).attr('data-day') === that.day;
        }).addClass('active');
    }

    /**
     * Renders the back of the card
     */
    renderBack() {
        this.widget.find('.back p').html(this.address);
    }

    /**
     * Removes preloader icon
     */
    removePreloader() {
        $('.preloader').fadeOut(200, function() {
            $(this).remove();
            $('.container').addClass('active');
        })
    }

    /**
     * Disables turning behavior when user clicks on the map
     */
    mapSafeClick() {
        this.widget.find('#map').click(function(e){
            e.stopPropagation();
        });
    }

    /**
     * Adds click support on touch devices
     */
    addClickSupport() {
        if($('html').hasClass('touchevents')) {
            this.widget.find('.container').click((e) => {
                this.widget.find('.card').toggleClass('flipped');
            });
            this.mapSafeClick();
        }
    }

    /**
     * Gets weather info
     */
    getWeatherInfo() {                
        var queryCondition = "select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + this.position + "') and u='c'";
        var queryWindAtmosphere = "select wind, atmosphere from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + this.position + "') and u='f'";
        $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + queryCondition + "&format=json", (data) => {
            this.degrees = data.query.results.channel.item.condition.temp + '&#176';
            this.icon = data.query.results.channel.item.condition.code;
            this.condition = data.query.results.channel.item.condition.text;
            var date = data.query.results.channel.item.condition.date;
            this.day = date.substring(0, date.indexOf(','));

            $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + queryWindAtmosphere + "&format=json", (data) => {
                this.humidity = data.query.results.channel.atmosphere.humidity + '%';
                this.wind = 'F at ' + data.query.results.channel.wind.speed + ' mph';
                this.renderFront();
                this.renderBack();
                this.removePreloader();
                this.addClickSupport();                        
            });
        });                

    }
};