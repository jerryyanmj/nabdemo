/**
 * This script is used for show data for Agents Mapping Loss page
 */

( function ( window, document, $, google ) {

    // Wait time for google visualization loading ( in milliseconds )
    var googleVisualizationWaitTime = 2000;

    // Flag, which indicates, should we use clusterer or manager
    var useClustererFlag = true;

    // Class AgentsMappingLoss definition
    var AgentsMappingLoss = function() {

        // Class instance
        var self = this;

        // Interval ( in milliseconds ) between requests for new agents mapping data
        self.INTERVAL_LIMIT = 900000;

        // Agents mapping latency data
        self.AgentsMappingLossData = [];

        $( document ).ready( 

            function () {

                self.onModuleLoad();

                return;
            }

        );

        return;
    };

    // Google map
    AgentsMappingLoss.prototype.map                 = null;
    AgentsMappingLoss.prototype.mapInitialZoomLevel = 4;

    // Markers cluster
    AgentsMappingLoss.prototype.markersCluster        = null;
    AgentsMappingLoss.prototype.markersClusterOptions = { maxZoom: 7, gridSize: 80 };

    // Markers manager
    AgentsMappingLoss.prototype.markersManager        = null;
    AgentsMappingLoss.prototype.markersManagerOptions = { maxZoom: 7 };

    AgentsMappingLoss.prototype.getMap = function() {

        if( ! this.map )
            throw new Error( 'Map not initialized yet or failed' );

        return this.map;
    };

    // Create marker on the map
    AgentsMappingLoss.prototype.createMarker = function( lattitude, longitude, name, type, imageName, zIndex, markerSize, markerLabelClass, markerLabelContent, markerLabelPointX, markerLabelPointY ) {

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
                    labelContent:   markerLabelContent,
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
    AgentsMappingLoss.prototype.createMap = function( map_canvas, callback ) {

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

    // Clear all agents on map
    AgentsMappingLoss.prototype.clearAgents = function() {

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
        if( self.AgentsMappingLossData.length > 0 ) { 

            for( var i = 0; i < 3; i++ ) {

		        $.each(
		            self.AgentsMappingLossData[ i ][ "markersList" ], 
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
    AgentsMappingLoss.prototype.createLegend = function() {

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
            '       <td id="legend-critical">> 3 Standard Loss</td>' +
            '       <td>' +
            '           <div style="color: yellow; border: 1px solid #000000;"><b>Warning</b></div>' +
            '       </td>' +
            '       <td id="legend-warning">>= 1.5 Standard Loss</td>' +
            '       <td>' +
            '           <div style="color: green; border: 1px solid #000000;"><b>Healthy</b></div>' +
            '       </td>' +
            '       <td id="legend-healthy">< 1.5 Standard Loss</td>' +
            '   </tr>' +
            '</table>';

        container.appendChild( table );

        return container;
    };

    // Clear HTML controls on the map
    AgentsMappingLoss.prototype.createControls = function() {

        var self = this;

        this.getMap().controls[ google.maps.ControlPosition.LEFT_BOTTOM ].push( self.createLegend() );

        return;
    };

    // Create chart for infowindow
    AgentsMappingLoss.prototype.createLineChartForInfowindow = function( chart_div_id, chart_data ) {

        // Setup chart data
        var chartData = google.visualization.arrayToDataTable( chart_data );

        // Setup chart options
        var chartOptions = { 
            title:           'Standard loss for last 24 hours',
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

    // Create agents mapping markers
    AgentsMappingLoss.prototype.createAgentsMappingLossMarkers = function() {

        var self                           = this;
        var createdMarkersForDivisionLevel = [];
        var createdMarkersForZipcodeLevel  = [];
        var createdMarkersForAgentsLevel   = [];
        var markerImageName                = null;

        // Check, what the Google API clusterization mechanism is used - clusterer or manager
        // If clusterization manager mechanism is used, then process divison, zipcode levels 
        if( useClustererFlag == false ) {

	        // Process divisions mapping level
	        $.each(
	
	            self.AgentsMappingLossData[ 0 ][ "markersList" ], 
	
	            function( index, data ) {
	
	                // Determine cluster marker color based on std_loss 
	                markerImageName = 'imgs/cluster_green_marker.png';
	                if( data.std_loss > 1.5 && data.std_loss <= 3.0 )
	                    markerImageName = 'imgs/cluster_yellow_marker.png';
	                else if( data.std_loss > 3.0 )
	                    markerImageName = 'imgs/cluster_red_marker.png';
	
	                // Create the marker
	                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', markerImageName, 0, 0, "marker_label", data.total_agents, 25, 32 );
	
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
	                    "   <tr>" +
	                    "       <td>Average loss</td>" +
	                    "       <td>" + data.avg_loss + "</td>" +
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
	        self.markersManager.addMarkers( createdMarkersForDivisionLevel, self.AgentsMappingLossData[ 0 ][ "zoomRange" ][ 0 ], self.AgentsMappingLossData[ 0 ][ "zoomRange" ][ 1 ] );
	
	        // Process zipcodes mapping level
	        $.each(
	
	            self.AgentsMappingLossData[ 1 ][ "markersList" ], 
	
	            function( index, data ) {
	
	                // Determine cluster marker color based on std_loss 
	                markerImageName = 'imgs/cluster_green_marker.png';
	                if( data.std_loss > 1.5 && data.std_loss <= 3.0 )
	                    markerImageName = 'imgs/cluster_yellow_marker.png';
	                else if( data.std_loss > 3.0 )
	                    markerImageName = 'imgs/cluster_red_marker.png';
	
	                // Create the marker
	                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', markerImageName, 0, 0, "marker_label", data.total_agents, 25, 32 );
	
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
	                    "           <td>Total agents</td>" +
	                    "           <td>" + data.total_agents + "</td>" +
	                    "       </tr>" +
	                    "       <tr>" +
	                    "           <td>Average loss</td>" +
	                    "           <td>" + data.std_loss + "</td>" +
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
	        self.markersManager.addMarkers( createdMarkersForZipcodeLevel, self.AgentsMappingLossData[ 1 ][ "zoomRange" ][ 0 ], self.AgentsMappingLossData[ 1 ][ "zoomRange" ][ 1 ] );

        }

        // Process agents mapping level
        $.each(

            self.AgentsMappingLossData[ 2 ][ "markersList" ], 

            function( index, data ) {

                markerImageName = '/imgs/green_pin.png';
                if( data.on_off == 0 )
                    markerImageName = '/imgs/grey_pin.png';
                else if( data.last_std_loss >= 1.5 && data.last_std_loss <= 3 )
                    markerImageName = '/imgs/yellow_pin.png';
                else if( data.last_std_loss > 3 )
                    markerImageName = '/imgs/red_pin.png';

                // Create the marker
                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', markerImageName, 0, 5 );

                // Fill up infoWindowContent
                var infoWindowContent = $( 
                    "<div style='background-color: #2f4f4f; color: #f8f8ff; width:400px;'>" +
                    "   <table style='width: 95%; font-weight: bold;'>" +
                    "       <tr>" +
                    "           <td>Agent ID</td>" +
                    "           <td>" + data.agent_id + "</td>" +
                    "       </tr>" +
                    "       <tr>" +
                    "           <td>Mac address</td>" +
                    "           <td>" + data.mac_address + "</td>" +
                    "       </tr>" +
                    "       <tr>" +
                    "           <td>IP address</td>" +
                    "           <td>" + data.ip_address + "</td>" +
                    "       </tr>" +
                    "       <tr>" +
                    "           <td>Provider</td>" +
                    "           <td>" + data.provider + "</td>" +
                    "       </tr>" +
                    "   </table>" +
                    "   <div id='chart_div_" + data.agent_id + "'></div>" +
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
                        self.createLineChartForInfowindow( "chart_div_" + data.agent_id, data.std_loss_count );

                        return;
                    }
                );

                // Push marker into the array of markers
                createdMarkersForAgentsLevel.push( data.map_marker );

                return;
            }

        );

        // Check, what the Google API clusterization mechanism is used - clusterer or manager 
        if( useClustererFlag == false ) {

	        // Store the markers for agents level
	        self.markersManager.addMarkers( createdMarkersForAgentsLevel, self.AgentsMappingLossData[ 2 ][ "zoomRange" ][ 0 ], self.AgentsMappingLossData[ 2 ][ "zoomRange" ][ 1 ] );
	
	        // Refresh the map
	        self.markersManager.refresh();

        }
        else {

            // Store the markers for agents level
            self.markersCluster = new MarkerClusterer( this.getMap(), createdMarkersForAgentsLevel, self.markersClusterOptions );

        }

        return;
    };

    // Fire when page loaded
    AgentsMappingLoss.prototype.onModuleLoad = function() {

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

                // Get information about the agents
                self.getAgentsMappingLoss();

                // Set time interval for getting infromation about the agents
                setInterval(

                    function() {

                        // Clear default error container
                        clearDefaultErrorContainer();

                        // Get information about the agents
                        self.getAgentsMappingLoss();

                        return;
                    }, 
                    self.INTERVAL_LIMIT
                );

                return;
            }
        );

        return;
    };

    // Get agents mapping latency data
    AgentsMappingLoss.prototype.getAgentsMappingLoss = function() {

        var self = this;

        self.clearAgents();

        $.ajax({

            url: '/cnep/ajax/get_agents_mapping_loss.json',
            dataType: 'json',

            error:      function ( error ) {

                console.log( error.responseText );
                displayErrorInErrorContainer( '<br>' + error.responseText );

                return;
            },

            success: function( response ) {

                // Save agents mapping latency data
                self.AgentsMappingLossData = response;

                // Create agents mapping markers
                self.createAgentsMappingLossMarkers();

                return;
            }
        
        });

        return;
    };

    // Entry point
    ( function main () {

        var agentsMappingLoss = new AgentsMappingLoss();

        return;
    })();

})( window, document, jQuery, google );
