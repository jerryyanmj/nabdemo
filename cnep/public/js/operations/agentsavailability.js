/**
 * This script is used for show data for Agents Availability page
 */

( function ( window, document, $, google ) {

    // Class Agents definition
    var Agents = function() {

        // Class instance
        var self = this;

        // Interval ( in milliseconds ) between requests for new agents mapping data
        self.INTERVAL_LIMIT = 60000;

        // Agents availability data
        self.agentsAvailabilityData = [];

        $( document ).ready( 

            function () {

                self.onModuleLoad();

                return;
            }

        );

        return;
    };

    // Google map
    Agents.prototype.map = null;

    // Markers cluster
    Agents.prototype.markersCluster        = null;
    Agents.prototype.markersClusterOptions = { maxZoom: 7, minimumClusterSize: 3, averageCenter: true };

    Agents.prototype.getMap = function() {

        if( ! this.map )
            throw new Error( 'Map not initialized yet or failed' );

        return this.map;
    };

    // Create marker on the map
    Agents.prototype.createMarker = function( lattitude, longitude, name, type, imageName, zIndex, markerSize ) {

        var self   = this;
        var marker = null;

        switch( type ) {

            case 'pin':

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng( lattitude, longitude ),
                    map:      self.getMap(),
                    title:    name,
                });

                break;

            case 'circle':

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng( lattitude, longitude ),
                    icon: {
                        path:           google.maps.SymbolPath.CIRCLE,
                        strokeColor:    'black',
                        strokeOpacity:  1,
                        strokeWeight:   1,
                        fillColor:      imageName,
                        fillOpacity:    1,
                        center:         new google.maps.LatLng( lattitude, longitude ),
                        scale:          markerSize,
                        title:          name
                    }
                });

                break;

            case 'img':

                marker = new google.maps.Marker({
                    position:   new google.maps.LatLng( lattitude, longitude ),
                    icon:       imageName
                });

                break;
        }

        if( typeof zIndex != 'undefined' )
            marker.setZIndex( google.maps.Marker.MAX_ZINDEX + zIndex );

        return marker;
    };

    // Create map in map_canvas element and calling callback function after map loaded
    Agents.prototype.createMap = function( map_canvas, callback ) {

        var self = this;

        var mapOptions = {
            zoom:       4,
            center:     new google.maps.LatLng( 38,-94 ),
            mapTypeId:  google.maps.MapTypeId.ROADMAP,
            styles:     [
                {
                    "featureType": "landscape", 
                    "stylers": [
                        { "saturation": -100 }, 
                        { "lightness": 65 }, 
                        { "visibility": "on" } 
                    ] 
                }, 
                {
                    "featureType": "poi",
                    "stylers": [
                        { "saturation": -100 },
                        { "lightness": 51 },
                        { "visibility": "simplified" }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "stylers": [
                        { "saturation": -100 },
                        { "visibility": "simplified" }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "stylers": [
                        { "saturation": -100 },
                        { "lightness": 30 },
                        { "visibility": "on" }
                    ]
                },
                {
                    "featureType": "road.local",
                    "stylers": [
                        { "saturation": -100 },
                        { "lightness": 40 },
                        { "visibility": "on" }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        { "saturation": -100 },
                        { "visibility": "simplified" }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "stylers": [
                        { "visibility": "off" }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        { "visibility": "on" },
                        { "lightness": -25 },
                        { "saturation": -100 }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        { "hue": "#ffff00" },
                        { "lightness": -25 },
                        { "saturation": -97 }
                    ]
                }
            ]
        };
	
        this.map = new google.maps.Map( document.getElementById( map_canvas ), mapOptions );

        this.createControls();

        // Google map default listener
        google.maps.event.addListenerOnce(
            this.map, 
            'tilesloaded', 
            function () {

                callback( this );

                return;
            }
        );

        return this.map;
    };

    // Clear all agents on map
    Agents.prototype.clearAgents = function() {

        var self = this;

        // Clear cluster
        if( self.markersCluster != null ) {

	        self.markersCluster.clearMarkers();
	
        }

        // Destroy the markers ( agents levels )
        if( self.agentsAvailabilityData.length > 0 ) { 

            for( var i = 0; i < 1; i++ ) {

		        $.each(
		            self.agentsAvailabilityData[ i ][ "markersList" ], 
		            function( index, data ) {

                        if( data.map_marker != undefined ) {

			                data.map_marker.setMap( null );
	
			                delete data.map_marker;

                        }
		
		                return;
		            }
		        );

            }
	
        }

        return;
    };

    // Create 'Legend' HTML control
    Agents.prototype.createLegend = function() {

        var self      = this;
        var container = document.createElement( 'div' );

        container.innerHTML             = "<b>Legend</b>";
        container.style.margin          = '1px';
        container.style.padding         = '5px';
        container.style.marginBottom    = '0px';
        container.style.width           = '330px';
        container.style.height          = '70px';
        container.style.backgroundColor = "#222222";
        container.style.color           = "#ffffff"
        container.index                 = 1;

        var table = document.createElement( 'table' );
        var row   = table.insertRow( -1 );

        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/blue_dot.png" />';
        row.insertCell( -1 ).innerHTML = 'Active agent';

        row = table.insertRow( -1 );
        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/red_dot.png" />';
        row.insertCell( -1 ).innerHTML = 'Inactive agent';

        container.appendChild( table );

        return container;
    };

    // Clear HTML controls on the map
    Agents.prototype.createControls = function() {

        var self = this;

        this.getMap().controls[ google.maps.ControlPosition.LEFT_BOTTOM ].push( self.createLegend() );

        return;
    };

    // Create agents availability markers
    Agents.prototype.createAgentsAvailabilityMarkers = function() {

        var self                         = this;
        var createdMarkersForAgentsLevel = [];
        var markerColor                  = null;
        
        // Process agents availability level
        $.each(
			
            self.agentsAvailabilityData[ 0 ][ "markersList" ], 

            function( index, data ) {

                // Create the marker
                markerColor = 'blue';
                if( data.on_off == 0)
                    markerColor = 'red';

                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'circle', markerColor, 0, 5 );

                // Fill up infoWindowContent
                var infoWindowContent = $( 
                    "<div style='background-color: #2f4f4f; color: #f8f8ff; width:350px;'>" +
                    "<table style='width: 95%; font-weight: bold;'>" +
                    "   <tr>" +
                    "       <td>Agent ID</td>" +
                    "       <td>" + data.agent_id + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>Mac address</td>" +
                    "       <td>" + data.mac_address + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>IP address</td>" +
                    "       <td>" + data.ip_address + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>Provider</td>" +
                    "       <td>" + data.provider + "</td>" +
                    "   </tr>" +
                    "</table>" +
                    "</div>"
                );

                // Create an infoWindow
                var infoWindow = new google.maps.InfoWindow();

                // Set the content of infoWindow
                infoWindow.setContent( infoWindowContent[ 0 ] );

                // Add click event listener to marker which will open infoWindow          
                google.maps.event.addListener(
                    data.map_marker, 
                    'click', 
                    function() {

                        infoWindow.open( this.getMap(), data.map_marker ); 

                        return;
                    }
                );

                // Push marker into the array of markers
                createdMarkersForAgentsLevel.push( data.map_marker );

                return;
            }

        );

        // Store the markers for agents level
        self.markersCluster = new MarkerClusterer( this.getMap(), createdMarkersForAgentsLevel );

        return;
    };

    // Fire when page loaded
    Agents.prototype.onModuleLoad = function() {

        var self = this;

        self.createMap(
            'map-canvas', 
            function( map ) {

                // Get information about the agents
                self.getAgentsAvailability();

                // Set time interval for getting infromation about the agents
                setInterval(

                    function() {

                        self.getAgentsAvailability();

                        return;
                    }, 
                    self.INTERVAL_LIMIT
                );

                return;
            }
        );

        return;
    };

    // Get agents availability data
    Agents.prototype.getAgentsAvailability = function() {

        var self = this;

        self.clearAgents();

        $.ajax({

            url: '/cnep/ajax/get_agents_availability.json',
            dataType: 'json',

            error: function( error ) {

                console.log( error );

                return;
            },

            success: function( response ) {

                // Save agents availability data
                self.agentsAvailabilityData = response;

                // Create agents availability markers
                self.createAgentsAvailabilityMarkers();

                return;
            }
        
        });

        return;
    };

    // Entry point
    ( function main () {

        var agentsAvailability = new Agents();

        return;
    })();

})( window, document, jQuery, google );
