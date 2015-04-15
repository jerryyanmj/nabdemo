/**
 * This script is used for show data for agent operations page
 */

( function ( window, document, $, google ) {

    // Collector component statuses
    var collector_component_statuses = [ "Running", "Stopped" ];

    // Collector component status images
    var collector_component_status_images = [ "/cnep/imgs/green_triangle_down.png", "/cnep/imgs/red_triangle_up.png" ];

    // Logs hashmap
    var cep_log_hashmap = {};

    // raw_mtr_queue key from monit table, Redis storage
    var raw_mtr_queue_key = "raw_mtr_queue";

    var script_run_time_key = "run_time";

    // Lengths, which describe raw_mtr_queue status
    var raw_mtr_queue_upper_border_white_status  = 500;
    var raw_mtr_queue_upper_border_yellow_status = 5000;

    // Lengths, which describe scripts times status
    var script_upper_border_red_status    = 0;
    var script_upper_border_yellow_status = 600;

    // Colors, which are used for CEP logs status displaying
    var cep_logs_status_colors = [ "black", "yellow", "red" ];

    // How wait between page refreshing ( in milliseconds )
    var page_refresh_interval = 60000;

    // Timeout event for page refresh event
    var timeoutEventID = null;

    // Wait time for google visualization loading ( in milliseconds )
    var googleVisualizationWaitTime = 2000;

    // Class AgentsAvailability instance
    var agentsAvailability = null;

    // Class AgentsAvailability definition
    var AgentsAvailability = function() {

        // Class instance
        var self = this;

        // Object for # of total PIs shipped
        var operationsGauge1Gauge = null;

        // Object for # of live PIs gauge
        var operationsGauge2Gauge = null;

        // Object for # commands gauge
        var operationsGauge3Gauge = null; 

        // Object for # of different routers gauge
        var operationsGauge4Gauge = null;

        // Interval ( in milliseconds ) between requests for new agents availability data
        self.INTERVAL_LIMIT = 60000;

        // Agents availability data
        self.agentsAvailabilityData = [];

        $( document ).ready(

            function() {

                self.onModuleLoad();

                return;
            }

        );

        return;
    };

    // Google map
    AgentsAvailability.prototype.map = null;

    AgentsAvailability.prototype.getMap = function() {

        if( ! this.map )
            throw new Error( 'Map not initialized yet or failed' );

        return this.map;
    };

    // Create marker on the map
    AgentsAvailability.prototype.createMarker = function( lattitude, longitude, name, type, imageName, zIndex, markerSize ) {

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
                    map:      self.getMap(),
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
                    icon:       imageName,
                    map:        self.getMap(),
                });

                break;
        }

        if( typeof zIndex != 'undefined' )
            marker.setZIndex( google.maps.Marker.MAX_ZINDEX + zIndex );

        return marker;
    };

    // Create map in map_canvas element and calling callback function after map loaded
    AgentsAvailability.prototype.createMap = function( map_canvas, callback ) {

        var self = this;

        var mapOptions = createGoogleMapOptions( 5 );
    
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
    AgentsAvailability.prototype.clearAgents = function() {

        var self = this;

        // Destroy the markers ( agents levels )
        if( self.agentsAvailabilityData.length > 0 ) { 

            for( var i = 0; i < 1; i++ ) {

                $.each(
                    self.agentsAvailabilityData[ i ][ "markersList" ], 
                    function( index, data ) {

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
    AgentsAvailability.prototype.createLegend = function() {

        var self      = this;
        var container = document.createElement( 'div' );

        container.innerHTML             = "<b>Legend</b>";
        container.style.margin          = '1px';
        container.style.padding         = '5px';
        container.style.marginBottom    = '0px';
        container.style.width           = '330px';
        container.style.height          = '100px';
        container.style.backgroundColor = "#222222";
        container.style.color           = "#ffffff"
        container.index                 = 1;

        var table = document.createElement( 'table' );
        var row   = table.insertRow( -1 );

        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/green_pin.png" />';
        row.insertCell( -1 ).innerHTML = 'Active agent';

        row = table.insertRow( -1 );
        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/red_pin.png" />';
        row.insertCell( -1 ).innerHTML = 'Inactive agent';

        container.appendChild( table );

        return container;
    };

    // Clear HTML controls on the map
    AgentsAvailability.prototype.createControls = function() {

        var self = this;

        this.getMap().controls[ google.maps.ControlPosition.LEFT_BOTTOM ].push( self.createLegend() );

        return;
    };

    // Create chart for infowindow
    AgentsAvailability.prototype.createLineChartForInfowindow = function( chart_div_id, chart_data ) {

        // Setup chart data
        var chartData = google.visualization.arrayToDataTable( chart_data );

        // Setup chart options
        var chartOptions = { 
            title:           'Total commands executed for last 24 hours',
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

    // Create agents availability markers
    AgentsAvailability.prototype.createAgentsAvailabilityMarkers = function() {

        var self            = this;
        var markerImageName = null;
        
        // Process agents availability level
        $.each(

            self.agentsAvailabilityData[ 0 ][ "markersList" ], 

            function( index, data ) {

                // Create the marker
                markerImageName = '/imgs/green_pin.png';
                if( data.on_off == 0 )
                    markerImageName = '/imgs/red_pin.png';

                data.map_marker = self.createMarker( data.lattitude, data.longitude, '', 'img', markerImageName, 0, 5 );

                // Fill up infoWindowContent
                var infoWindowContent = $( 
                    "<div style='background-color: #2f4f4f; color: white; width:400px;'>" +
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
                    "       <tr>" +
                    "           <td>Shipped date</td>" +
                    "           <td>" + data.shipped_date + "</td>" +
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
                        self.createLineChartForInfowindow( "chart_div_" + data.agent_id, data.commands_count );

                        return;
                    }
                );

                return;
            }

        );

        return;
    };

    // Fire when page loaded
    AgentsAvailability.prototype.onModuleLoad = function() {

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

                // Get information about the agents
                self.getAgentsAvailability();

                // Get the agent gauges data
                get_agent_gauges_data();

                // Set time interval for getting infromation about the agents
                setInterval(

                    function() {

                        // Clear default error container
                        clearDefaultErrorContainer();

                        // Get information about the agents
                        self.getAgentsAvailability();

                        // Get the agent gauges data
                        get_agent_gauges_data();

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
    AgentsAvailability.prototype.getAgentsAvailability = function() {

        var self = this;

        self.clearAgents();

        $.ajax({

            url: '/cnep/ajax/get_agents_availability.json',
            dataType: 'json',

            error: function( error ) {

                console.log( error.responseText );
                displayErrorInErrorContainer( error.responseText );

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

    // Get gauges logs
    function    get_gauges_ajax() {

        $.ajax(
            {
                url:        '/cnep/ajax/agent-gauges-logs.json',
                dataType:   'json',
                error:      function ( error ) {

                    console.log( error.responseText );
                    displayErrorInErrorContainer( error.responseText );

                    return;
                },
                success: function ( gauges_data ) {

                    // Display gauges logs
                    show_gauges_logs( gauges_data );

                    return;
                }
            }
        );

        return;
    }

    // Get collector component status
    function    get_collector_status_ajax() {

        $.ajax(
            {
                url:        '/cnep/ajax/collector-status.json',
                dataType:   'json',
                error:      function ( error ) {

                    console.log( error.responseText );
                    displayErrorInErrorContainer( error.responseText );

                    return;
                },
                success: function ( collector_status_data ) {

                    // Display collector component status
                    show_collector_status( collector_status_data );

                    return;
                }
            }
        );

        return;
    }

    // Get the CEP logs
    function    get_cep_logs_ajax() {

        $.ajax(
            {
                url:        '/cnep/ajax/cep-logs.json',
                dataType:   'json',
                error:      function ( error ) {

                    console.log( error.responseText );
                    displayErrorInErrorContainer( error.responseText );

                    return;
                },
                success: function ( cep_logs_data ) {

                    cep_log_hashmap = cep_logs_data;

                    // Display CEP logs, raw-mtr-queue table
                    show_raw_mtr_queue_table();

                    // Remove raw_mtr_queue_key from cep_log_hashmap hashmap
                    if( cep_log_hashmap != null )
                        delete cep_log_hashmap[ raw_mtr_queue_key ];

                    // Display CEP logs, scripts table
                    show_cep_logs_table();

                    return;
                }
            }
        );

        return;
    }

    // Display gauges logs
    function    show_gauges_logs( gauges_data ) {

        var gauges              = [];
        var gaugeStatusBoxImage = null;

        for( var i = 0; i < gauges_data.length; i++ ) {

            // Refresh target div with a new values
            if( agentsAvailability[ "operationsGauge" + ( i + 1 ) + "Gauge" ] == null ) {

	            // Destroy target div's DOM childs
	            $( '#operationsGauge' + ( i + 1 ) ).empty();
	
	            // Create new gauge object
	            agentsAvailability[ "operationsGauge" + ( i + 1 ) + "Gauge" ] = new JustGage(
	                {
	                    id:             "operationsGauge" + ( i + 1 ),
	                    value:          gauges_data[ i ][ "actualValue" ],
	                    min:            gauges_data[ i ][ "minimumValue" ],
	                    max:            gauges_data[ i ][ "maximumValue" ],
	                    title:          gauges_data[ i ][ "label" ],
	                    valueFontColor: 'white'
	                }
	            );

            }
            else {

                // Update the existing gauge object
                agentsAvailability[ "operationsGauge" + ( i + 1 ) + "Gauge" ].refresh( gauges_data[ i ][ "actualValue" ] );

            }

        }

        // Display gauge '# of live PIs' related status box
        gaugeStatusBoxImage = "/cnep/imgs/red_status_button.png";
        if( gauges_data[ 1 ][ "historicalValue" ] <= gauges_data[ 1 ][ "actualValue" ] )
            gaugeStatusBoxImage = "/cnep/imgs/green_status_button.png";

        $( '#gauge2Box' ).empty();
        $( '#gauge2Box' ).append( "<img src='" + gaugeStatusBoxImage + "'width='25px' height='25px'>" );

        // Display gauge '# of commands' related status box
        gaugeStatusBoxImage = "/cnep/imgs/red_status_button.png";
        if( gauges_data[ 2 ][ "historicalValue" ] >= gauges_data[ 2 ][ "actualValue" ] )
            gaugeStatusBoxImage = "/cnep/imgs/green_status_button.png";

        $( '#gauge3Box' ).empty();
        $( '#gauge3Box' ).append( "<img src='" + gaugeStatusBoxImage + "'width='25px' height='25px'>" );

        // Display gauge '# of different routes' related status box
        gaugeStatusBoxImage = "/cnep/imgs/red_status_button.png";
        if( gauges_data[ 3 ][ "historicalValue" ] >= gauges_data[ 3 ][ "actualValue" ] )
            gaugeStatusBoxImage = "/cnep/imgs/green_status_button.png";

        $( '#gauge4Box' ).empty();
        $( '#gauge4Box' ).append( "<img src='" + gaugeStatusBoxImage + "'width='25px' height='25px'>" );

        return;
    }

    // Display collector status
    function    show_collector_status( collector_component_status ) {

        // By default, collector component is running
        var collector_component_status_image = collector_component_status_images[ 0 ];

        // Empty current collector status
        $( '#collectorStatus' ).empty();

        if( collector_component_status == collector_component_statuses[ 1 ] ) {

            collector_component_status_image = collector_component_status_images[ 1 ];

        }

        // Show current collector status
        $( '#collectorStatus' ).append( "Running collector <img src=" + collector_component_status_image + ">" );

        return;
    }

    // Display CEP logs, scripts table
    function    show_cep_logs_table() {

        // Empty CEP logs table
        $( '#cepLogsTable' ).empty();

        // Create CEP logs table header
        $( '#cepLogsTable' ).append(
        
            '<thead>                                                                                    ' +
            '   <tr>                                                                                    ' +
            '       <th style="border: solid 1px; background-color:#151515;"><b>Script Name</b></th>    ' +
            '       <th style="border: solid 1px; background-color:#151515;"><b>Up Time</b></th>        ' +
            '   </tr>                                                                                   ' +
            '</thead>                                                                                   '
        
        );

        // Create CEP logs table body
        $( '#cepLogsTable' ).append( '<tbody>' );

        if( cep_log_hashmap != null ) {

            $.each(
    
                cep_log_hashmap,
                function( cep_log_hashmap_key, cep_log_hashmap_value ) {
    
                    var script_run_time_value = JSON.parse( cep_log_hashmap_value )[ script_run_time_key ];
                    var script_run_time_color = cep_logs_status_colors[ 2 ];

                    if( script_run_time_value > script_upper_border_red_status ) {
    
                        script_run_time_color = cep_logs_status_colors[ 1 ];
    
                        if( script_run_time_value > script_upper_border_yellow_status ) {
    
                            script_run_time_color = cep_logs_status_colors[ 0 ];
    
                        }
    
                    }
    
                    // Get the 00:00:00 format for script_run_time_value
                    script_run_time_value = formatSecondsToHoursMinutesSeconds( script_run_time_value );
    
                    $( '#cepLogsTable' ).append(

                        '<tr>' +
                        '   <td>' + cep_log_hashmap_key + '</td>' +
                        '   <td>' + script_run_time_value + '</td>' +
                        '</tr>'
    
                    );
    
                    return;
                }
    
            );

        }

        // Close CEP logs table body
        $( '#cepLogsTable' ).append( '</tbody>' );

        // Initialize CEP logs table
        $( '#cepLogsTable' ).dataTable(
            {
                "sDom":             '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
                "paging":           true,
                "pagingType":       "simple_numbers",
                "pageLength":       3,
                "lengthChange":     false,
                "info":             false,
                "searching":        false,
                "destroy":          true
            }
        );

        return;
    }

    // Display CEP logs, raw-mtr-queue table
    function    show_raw_mtr_queue_table() {

        // Empty time raw mtr queue table
        $( '#rawMtrQueueTable' ).empty();

        // Create the raw mtr queue table header
        $( '#rawMtrQueueTable' ).append(
        
            '<thead>                                ' +
            '   <tr>                                ' +
            '       <th style="width:150px; border: solid 1px;"><b>Raw MTR Queue</b></th>   ' +
            '   </tr>                               ' +
            '</thead>                               '
        
        );

        // Create raw mtr queue table body
        $( '#rawMtrQueueTable' ).append( '<tbody>' );

        if( cep_log_hashmap != null && cep_log_hashmap[ raw_mtr_queue_key ] != "" && cep_log_hashmap[ raw_mtr_queue_key ] != undefined ) {

            var raw_mtr_queue_value = cep_log_hashmap[ raw_mtr_queue_key ];
            var raw_mtr_queue_color = cep_logs_status_colors[ 0 ];

            if( raw_mtr_queue_value >= raw_mtr_queue_upper_border_white_status ) {

                raw_mtr_queue_color = cep_logs_status_colors[ 1 ];

                if( raw_mtr_queue_value > raw_mtr_queue_upper_border_yellow_status ) {

                    raw_mtr_queue_color = cep_logs_status_colors[ 2 ];

                }

            }

            $( '#rawMtrQueueTable' ).append(

                '<tr>' +
                '   <td>' + cep_log_hashmap[ raw_mtr_queue_key ] + '</td>' +
                '</tr>'

            );

        }

        // Close raw mtr queue table body
        $( '#rawMtrQueueTable' ).append( '</tbody>' );

        // Initialize raw mtr queue table
        $( '#rawMtrQueueTable' ).dataTable(
            {
                "paging":       false,
                "info":         false,
                "searching":    false,
                "destroy":      true
            }
        );

        return;
    }

    // Format seconds in the format 00:00:00 ( hours:minutes:seconds )
    function    formatSecondsToHoursMinutesSeconds( script_run_time_value ) {

        var formattedValue = "";
        var hours          = Math.floor( script_run_time_value / 3600 );
        var minutes        = Math.floor( ( script_run_time_value - ( hours * 3600 ) ) / 60 );
        var seconds        = ( script_run_time_value - ( hours * 3600 ) ) - ( minutes * 60 );

        if( hours < 10 )
            hours = "0" + hours;

        if( minutes < 10 )
            minutes = "0" + minutes;

        if( seconds < 10 )
            seconds = "0" + seconds;

        formattedValue = hours + ":" + minutes + ":" + seconds;

        return formattedValue;
    }

    // Get the agent gauges data
    function    get_agent_gauges_data() {

        // Get gauges logs
        get_gauges_ajax();

        // Get collector component status
        get_collector_status_ajax();

        // Get the CEP logs
        get_cep_logs_ajax();

        // Clear the previous timeout ID
        if( timeoutEventID != null ) {

            clearTimeout( timeoutEventID );

        }

        // Set the callback again
        timeoutEventID = setTimeout( get_agent_gauges_data, page_refresh_interval );

        return;
    }

    // Entry point
    ( function main() {

        $( document ).ready(

            function() {

                // Disable any caching for this page
                $.ajaxSetup(
                    {
                        cache: false
                    }
                );

                // Initialize agents availability map
                agentsAvailability = new AgentsAvailability();

                return;
            }

        );

        return;
    })();

    return;
} )( window, document, jQuery, google );
