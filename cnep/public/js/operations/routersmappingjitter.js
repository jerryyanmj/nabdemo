/**
 * This script is used for show data for Routers Mapping Jitter page
 */

( function ( window, document, $, google ) {

    // Wait time for google visualization loading ( in milliseconds )
    var googleVisualizationWaitTime = 2000;

    // Flag, which indicates, should we use clusterer or manager
    var useClustererFlag = true;

    // Class RoutersMappingJitter definition
    var RoutersMappingJitter = function() {

        // Class instance
        var self = this;

        // Interval ( in milliseconds ) between requests for new routers mapping data
        self.INTERVAL_LIMIT = 60000; // 900000;

        // Routers mapping latency data
        self.RoutersMappingJitterData = [];

        $( document ).ready( 

            function () {

                self.onModuleLoad();

                return;
            }

        );

        return;
    };

    // Google map
    RoutersMappingJitter.prototype.map                 = null;
    RoutersMappingJitter.prototype.mapInitialZoomLevel = 4;

    // Markers cluster
    RoutersMappingJitter.prototype.markersCluster        = null;
    RoutersMappingJitter.prototype.markersClusterOptions = { maxZoom: 7, gridSize: 80 };

    // Markers manager
    RoutersMappingJitter.prototype.markersManager        = null;
    RoutersMappingJitter.prototype.markersManagerOptions = { maxZoom: 7 };

    RoutersMappingJitter.prototype.getMap = function() {

        if( ! this.map )
            throw new Error( 'Map not initialized yet or failed' );

        return this.map;
    };

    // Create marker on the map
    RoutersMappingJitter.prototype.createMarker = function( lattitude, longitude, name, type, imageName, zIndex, markerSize, markerLabelClass, markerLabelContent, markerLabelPointX, markerLabelPointY ) {

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

                marker = new MarkerWithLabel({

                    position:       new google.maps.LatLng( lattitude, longitude ),
                    icon:           imageName,
                    labelAnchor:    new google.maps.Point( markerLabelPointX, markerLabelPointY ),
                    labelClass:     markerLabelClass, 
                    labelContent:   "" + markerLabelContent,
                    labelStyle:     { opacity: 1 },
                    labelVisible:   true

                });

                break;
        }

        if( typeof zIndex != 'undefined' )
            marker.setZIndex( google.maps.Marker.MAX_ZINDEX + zIndex );

        return marker;
    };

    // Create map in map_canvas element and calling callback function after map loaded
    RoutersMappingJitter.prototype.createMap = function( map_canvas, callback ) {

        var self = this;

        var mapOptions = createGoogleMapOptions( this.mapInitialZoomLevel );

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

    // Clear all routers on map
    RoutersMappingJitter.prototype.clearRouters = function() {

        var self = this;

        // Clear cluster
        if( self.markersCluster != null ) {

	        self.markersCluster.clearMarkers();
	
        }

        // Clear manager
        if( self.markersManager != null ) {

            self.markersManager.clearMarkers();

        }

        // Destroy the markers ( divisions, zipcodes, routers levels )
        if( self.RoutersMappingJitterData.length > 0 ) { 

            for( var i = 0; i < 3; i++ ) {

		        $.each(
		            self.RoutersMappingJitterData[ i ][ "markersList" ], 
		            function( index, data ) {

                        // If data.map_marker is initialized
                        if( data.map_marker != 1 && data.map_marker != undefined ) {

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
    RoutersMappingJitter.prototype.createLegend = function() {

        var self      = this;
        var container = document.createElement( 'div' );

        container.innerHTML             = "<b>Legend</b>";
        container.style.margin          = '5px';
        container.style.padding         = '5px';
        container.style.width           = '350px';
        container.style.height          = '100px';
        container.style.backgroundColor = "#222222";
        container.style.color           = "#ffffff"
        container.index                 = 1;

        var table = null;
        var row   = null;

        // Create legend table
        table = document.createElement( 'table' );
        row   = table.insertRow( -1 );
        row.insertCell( -1 ).innerHTML = '' + 
            '<table style="background-color: grey; width:95%; margin: 5px; padding: 5px; color: #f8f8ff;">' +
            '   <tr>' +
            '       <td>' +
            '           <div style="color: red; border: 1px solid #000000;"><b>Critical</b></div>' +
            '       </td>' +
            '       <td id="legend-critical">> 3 Standard Jitter</td>' +
            '       <td>' +
            '           <div style="color: yellow; border: 1px solid #000000;"><b>Warning</b></div>' +
            '       </td>' +
            '       <td id="legend-warning">>= 1.5 Standard Jitter</td>' +
            '       <td>' +
            '           <div style="color: green; border: 1px solid #000000;"><b>Healthy</b></div>' +
            '       </td>' +
            '       <td id="legend-healthy">< 1.5 Standard Jitter</td>' +
            '   </tr>' +
            '</table>';

        container.appendChild( table );

        return container;
    };

    // Clear HTML controls on the map
    RoutersMappingJitter.prototype.createControls = function() {

        var self = this;

        this.getMap().controls[ google.maps.ControlPosition.LEFT_BOTTOM ].push( self.createLegend() );

        return;
    };

    // Create chart for infowindow
    RoutersMappingJitter.prototype.createLineChartForInfowindow = function( chart_div_id, chart_data ) {

        // Setup chart data
        var chartData = google.visualization.arrayToDataTable( chart_data );

        // Setup chart options
        var chartOptions = { 
            title:           'Standard jitter for last 24 hours',
            legend:          { position: 'bottom' },
            hAxis:           { viewWindowMode: 'maximized' },
            chartArea:       { width: '80%', height: '60%', backgroundColor: 'black' },
            backgroundColor: { fill: 'transparent', stroke: '#2f4f4f', strokeWidth: 3 }
        };

        // Create chart itself
        var chart = new google.visualization.LineChart( document.getElementById( chart_div_id ) );

        // Draw chart
        chart.draw( chartData, chartOptions );      

        return;
    };

    // Create routers mapping markers
    RoutersMappingJitter.prototype.createRoutersMappingJitterMarkers = function() {

        var self                           = this;
        var createdMarkersForDivisionLevel = [];
        var createdMarkersForZipcodeLevel  = [];
        var createdMarkersForRoutersLevel  = [];
        var markerImageName                = null;

        // Check, what the Google API clusterization mechanism is used - clusterer or manager
        // If clusterization manager mechanism is used, then process divison, zipcode levels 
        if( useClustererFlag == false ) {

	        // Process divisions mapping level
	        $.each(
	
	            self.RoutersMappingJitterData[ 0 ][ "markersList" ], 
	
	            function( index, data ) {
	
	                // Determine cluster marker color based on std_jitter 
	                markerImageName = 'imgs/cluster_green_marker.png';
	                if( data.std_jitter > 1.5 && data.std_jitter <= 3.0 )
	                    markerImageName = 'imgs/cluster_yellow_marker.png';
	                else if( data.std_jitter > 3.0 )
	                    markerImageName = 'imgs/cluster_red_marker.png';
	
	                // Create the marker
	                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', markerImageName, 0, 0, "marker_label", data.total_routers, 25, 32 );
	
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
	                    "       <td>Total routers</td>" +
	                    "       <td>" + data.total_routers + "</td>" +
	                    "   </tr>" +
	                    "   <tr>" +
	                    "       <td>Average jitter</td>" +
	                    "       <td>" + data.avg_jitter + "</td>" +
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
	        self.markersManager.addMarkers( createdMarkersForDivisionLevel, self.RoutersMappingJitterData[ 0 ][ "zoomRange" ][ 0 ], self.RoutersMappingJitterData[ 0 ][ "zoomRange" ][ 1 ] );
	
	        // Process zipcodes mapping level
	        $.each(
	
	            self.RoutersMappingJitterData[ 1 ][ "markersList" ], 
	
	            function( index, data ) {
	
	                // Determine cluster marker color based on std_jitter 
	                markerImageName = 'imgs/cluster_green_marker.png';
	                if( data.std_jitter > 1.5 && data.std_jitter <= 3.0 )
	                    markerImageName = 'imgs/cluster_yellow_marker.png';
	                else if( data.std_jitter > 3.0 )
	                    markerImageName = 'imgs/cluster_red_marker.png';
	
	                // Create the marker
	                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', markerImageName, 0, 0, "marker_label", data.total_routers, 25, 32 );
	
	                // Fill up infoWindowContent
	                var infoWindowContent = $( 
	                    "<div style='background-color: #2f4f4f; color: #f8f8ff; width:350px;'>" +
	                    "   <table style='width: 95%; font-weight: bold;'>" +
	                    "       <tr>" +
	                    "           <td>Zipcode ID</td>" +
	                    "           <td>" + data.zipcode_id + "</td>" +
	                    "       </tr>" +
	                    "       <tr>" +
	                    "           <td>City</td>" +
	                    "           <td>" + data.city + "</td>" +
	                    "       </tr>" +
	                    "       <tr>" +
	                    "           <td>State</td>" +
	                    "           <td>" + data.state + "</td>" +
	                    "       </tr>" +
	                    "       <tr>" +
	                    "           <td>Total routers</td>" +
	                    "           <td>" + data.total_routers + "</td>" +
	                    "       </tr>" +
	                    "       <tr>" +
	                    "           <td>Average jitter</td>" +
	                    "           <td>" + data.avg_jitter + "</td>" +
	                    "       </tr>" +
	                    "   </table>" +
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
	        self.markersManager.addMarkers( createdMarkersForZipcodeLevel, self.RoutersMappingJitterData[ 1 ][ "zoomRange" ][ 0 ], self.RoutersMappingJitterData[ 1 ][ "zoomRange" ][ 1 ] );

        }

        // Process routers mapping level
        $.each(

            self.RoutersMappingJitterData[ 2 ][ "markersList" ], 

            function( index, data ) {

                markerImageName = '/imgs/green_pin.png';
                if( data.on_off == 0 )
                    markerImageName = '/imgs/grey_pin.png';
                else if( data.last_std_jitter >= 1.5 && data.last_std_jitter <= 3 )
                    markerImageName = '/imgs/yellow_pin.png';
                else if( data.last_std_jitter > 3 )
                    markerImageName = '/imgs/red_pin.png';

                // Create the marker
                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', markerImageName, 0, 5 );

                // Fill up infoWindowContent
                var infoWindowContent = $( 
                    "<div style='background-color: #2f4f4f; color: #f8f8ff; width:400px;'>" +
                    "   <table style='width: 95%; font-weight: bold;'>" +
                    "       <tr>" +
                    "           <td>CIDR</td>" +
                    "           <td>" + data.cidr + "</td>" +
                    "       </tr>" +
                    "           <td>Market</td>" +
                    "           <td>" + data.router_market + "</td>" +
                    "       </tr>" +
                    "       <tr>" +
                    "           <td>IP type</td>" +
                    "           <td>" + data.ip_type + "</td>" +
                    "       </tr>" +
                    "   </table>" +
                    "   <div id='chart_div_" + data.cidr + "'></div>" +
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

                        // Open infowindow itself
                        infoWindow.open( this.getMap(), data.map_marker ); 

                        // Create and draw chart for the opened infowindow
                        self.createLineChartForInfowindow( "chart_div_" + data.cidr, data.std_jitter_count );

                        return;
                    }
                );

                // Push marker into the array of markers
                createdMarkersForRoutersLevel.push( data.map_marker );

                return;
            }

        );

        // Check, what the Google API clusterization mechanism is used - clusterer or manager 
        if( useClustererFlag == false ) {

	        // Store the markers for routers level
	        self.markersManager.addMarkers( createdMarkersForRoutersLevel, self.RoutersMappingJitterData[ 2 ][ "zoomRange" ][ 0 ], self.RoutersMappingJitterData[ 2 ][ "zoomRange" ][ 1 ] );
	
	        // Refresh the map
	        self.markersManager.refresh();

        }
        else {

            // Store the markers for agents level
            self.markersCluster = new MarkerClusterer( this.getMap(), createdMarkersForRoutersLevel, self.markersClusterOptions );

        }

        return;
    };

    // Fire when page loaded
    RoutersMappingJitter.prototype.onModuleLoad = function() {

        var self = this;

        self.createMap(
            'map-canvas', 
            function( map ) {

                // Wait, until google load visualization module
                setTimeout(
                    function() {

                        google.load( 'visualization', '1', { 'callback': '', 'packages': [ 'corechart' ] } );

                        return;
                    },
                    googleVisualizationWaitTime
                );

                // Clear default error container
                clearDefaultErrorContainer();

                // Get information about the routers
                self.getRoutersMappingJitter();

                // Set time interval for getting infromation about the routers
                setInterval(

                    function() {

                        // Clear default error container
                        clearDefaultErrorContainer();

                        // Get information about the routers
                        self.getRoutersMappingJitter();

                        return;
                    }, 
                    self.INTERVAL_LIMIT
                );

                return;
            }
        );

        return;
    };

    // Get routers mapping latency data
    RoutersMappingJitter.prototype.getRoutersMappingJitter = function() {

        var self = this;

        self.clearRouters();

        $.ajax({

            url: '/cnep/ajax/get_routers_mapping_jitter.json',
            dataType: 'json',

            error: function( error ) {

                console.log( error.responseText );
                displayErrorInErrorContainer( '<br>' + error.responseText );

                return;
            },

            success: function( response ) {

                // Save routers mapping jitter data
                self.RoutersMappingJitterData = response;

                // Create routers mapping markers
                self.createRoutersMappingJitterMarkers();

                return;
            }
        
        });

        return;
    };

    // Entry point
    ( function main () {

        var routersMappingJitter = new RoutersMappingJitter();

        return;
    })();

})( window, document, jQuery, google );
