/**
 * This script is used for show data for Agents Mapping page
 */

( function ( window, document, $, google ) {

    // Class Agents definition
    var Agents = function() {

        // Class instance
        var self = this;

        // Interval ( in milliseconds ) between requests for new agents mapping data
        self.INTERVAL_LIMIT = 60000;

        // Agents mapping data
        self.agentsMappingData = [];

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

    // Markers manager
    Agents.prototype.markersManager        = null;
    Agents.prototype.markersManagerOptions = { maxZoom: 7 };

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
                    },
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

        // Create markers manager
        self.markersManager = new MarkerManager( this.map );

        // Google map zoom changed event listener, which is used by markersManager instance
        google.maps.event.addListener(
            self.map, 
            'zoom_changed', 
            function() {

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

        // Clear manager
        if( self.markersManager != null ) {

            self.markersManager.clearMarkers();

        }

        // Destroy the markers ( divisions, zipcodes, agents levels )
        if( self.agentsMappingData.length > 0 ) { 

            for( var i = 0; i < 3; i++ ) {

		        $.each(
		            self.agentsMappingData[ i ][ "markersList" ], 
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
        container.style.height          = '50px';
        container.style.backgroundColor = "#222222";
        container.style.color           = "#ffffff"
        container.index                 = 1;

        var table = document.createElement( 'table' );
        var row   = table.insertRow( -1 );

        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/blue_dot.png" />';
        row.insertCell( -1 ).innerHTML = 'Agent mapping';

        container.appendChild( table );

        return container;
    };

    // Clear HTML controls on the map
    Agents.prototype.createControls = function() {

        var self = this;

        this.getMap().controls[ google.maps.ControlPosition.LEFT_BOTTOM ].push( self.createLegend() );

        return;
    };

    // Create agents mapping markers
    Agents.prototype.createAgentsMappingMarkers = function() {

        var self                           = this;
        var createdMarkersForDivisionLevel = [];
        var createdMarkersForZipcodeLevel  = [];
        var createdMarkersForAgentsLevel   = [];

        // Process divisions mapping level
        $.each(

            self.agentsMappingData[ 0 ][ "markersList" ], 

            function( index, data ) {

                // Create the marker
                // data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'circle', 'blue', 0, 15 );
                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', 'imgs/TWC_Logo_marker.png', 0, 0 );

                // Fill up infoWindowContent
                var infoWindowContent = $( 
                    "<div style='background-color: #2f4f4f; color: #f8f8ff; width:350px;'>" +
                    "<table style='width: 95%; font-weight: bold;'>" +
                    "   <tr>" +
                    "       <td>Division ID</td>" +
                    "       <td>" + data.division_id + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>Division Name</td>" +
                    "       <td>" + data.division_name + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>Total agents</td>" +
                    "       <td>" + data.total_agents + "</td>" +
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
                createdMarkersForDivisionLevel.push( data.map_marker );

                return;
            }

        );

        // Store the markers for division level
        self.markersManager.addMarkers( createdMarkersForDivisionLevel, self.agentsMappingData[ 0 ][ "zoomRange" ][ 0 ], self.agentsMappingData[ 0 ][ "zoomRange" ][ 1 ] );

        // Process zipcodes mapping level
        $.each(

            self.agentsMappingData[ 1 ][ "markersList" ], 

            function( index, data ) {

                // Create the marker
                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'circle', 'blue', 0, 10 );

                // Fill up infoWindowContent
                var infoWindowContent = $( 
                    "<div style='background-color: #2f4f4f; color: #f8f8ff; width:350px;'>" +
                    "<table style='width: 95%; font-weight: bold;'>" +
                    "   <tr>" +
                    "       <td>Zipcode ID</td>" +
                    "       <td>" + data.zipcode_id + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>City</td>" +
                    "       <td>" + data.city + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>State</td>" +
                    "       <td>" + data.state + "</td>" +
                    "   </tr>" +
                    "   <tr>" +
                    "       <td>Total agents</td>" +
                    "       <td>" + data.total_agents + "</td>" +
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
                createdMarkersForZipcodeLevel.push( data.map_marker );

                return;
            }

        );

        // Store the markers for zipcode level
        self.markersManager.addMarkers( createdMarkersForZipcodeLevel, self.agentsMappingData[ 1 ][ "zoomRange" ][ 0 ], self.agentsMappingData[ 1 ][ "zoomRange" ][ 1 ] );

        // Process agents mapping level
        $.each(

            self.agentsMappingData[ 2 ][ "markersList" ], 

            function( index, data ) {

                // Create the marker
                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'circle', 'blue', 0, 5 );

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
        self.markersManager.addMarkers( createdMarkersForAgentsLevel, self.agentsMappingData[ 2 ][ "zoomRange" ][ 0 ], self.agentsMappingData[ 2 ][ "zoomRange" ][ 1 ] );

        // Refresh the map
        self.markersManager.refresh();

        return;
    };

    // Fire when page loaded
    Agents.prototype.onModuleLoad = function() {

        var self = this;

        self.createMap(
            'map-canvas', 
            function( map ) {

                // Get information about the agents
                self.getAgentsMapping();

                // Set time interval for getting infromation about the agents
                setInterval(

                    function() {

                        self.getAgentsMapping();

                        return;
                    }, 
                    self.INTERVAL_LIMIT
                );

                return;
            }
        );

        return;
    };

    // Get agents mapping data
    Agents.prototype.getAgentsMapping = function() {

        var self = this;

        self.clearAgents();

        $.ajax({

            url: '/cnep/ajax/get_agents_mapping.json',
            dataType: 'json',

            error: function( error ) {

                console.log( error );

                return;
            },

            success: function( response ) {

                // Save agents mapping data
                self.agentsMappingData = response;

                // Create agents mapping markers
                self.createAgentsMappingMarkers();

                return;
            }
        
        });

        return;
    };

    // Entry point
    ( function main () {

        var agentsMapping = new Agents();

        return;
    })();

})( window, document, jQuery, google );
