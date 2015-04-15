/**
 * This script is used for show data for view particular user route page
 */

( function () {

    // The upper limit for time ranges
    var TIME_RANGE_UPPER_LIMIT = 120; // 120 hours

    // Array, which stores current cities routes data
    var current_cities_data = null;

    // Map, which stores current cities routes data as in hash
    // Map key: "source_city, source_SA, target_city, target_SA"
    var current_cities_data_hashmap = null;

    // Show information about the particular route
    function    show_route_information( source, time_range, source_data ) {

        var route_details          = null;
        var timerangetable_details = null;
        var lossData               = null;
        var latencyData            = null;

        // Show information about the route only if all the search criterious are filled
        if( source != "0" ) {
        
            $( '#container' ).empty();
            $( '#container' ).append( '<div id="chartData" class="thumbnail"></div>' );

            $.each(

                Object.keys( source_data ), 
                function( i, key ) {

                    // Get the route details
                    var route_details  = source_data[ key ];
                    var keyInformation = route_details['sla_target'];

                    // Rebuild data for charts
                    if( route_details != null ) {

                        latencyData = route_details[ 'latencyData' ];
                        lossData    = route_details[ 'lossData' ];

                        // Clear the data
                        $newdiv = $(
                            '<div class="row">' +
                            '   <h2>' + key + '|' + keyInformation + '</h2>' +
                            '   <div class="col-md-6">' +
                            '       <div class="selected">' +
                            '           <div id="historical-rtt-chart-wrapper' + i + '" style="height:300px;">' +
                            '               <svg/>' +
                            '           </div>' +
                            '       </div>' +
                            '   </div>' +
                            '   <div class="col-md-6">' +
                            '       <div class="selected">' +
                            '           <div id="historical-loss-chart-wrapper' + i + '" style="height:300px;">' +
                            '               <svg/>' +
                            '           </div>' +
                            '       </div>' +
                            '   </div>' +
                            '</div>'
                        );

                        $newdiv.appendTo( '#chartData' );

                        createBarChart( '#historical-rtt-chart-wrapper' + i + ' svg', latencyData, i );
                        createBarChart( '#historical-loss-chart-wrapper' + i + ' svg', lossData, i );

                    }

                    return;
                }

            );

        }

        return;
    }

    // Create data for latency chart
    function    createLatencyData( route_details, time_range ) {

        // Data array for latency chart
        var latencyData = [
            {
                "key"    : "Average Latency" ,
                "bar"    : true,
                "values" : []
            },
            {
                "key"    : "Moving Average Latency" ,
                "values" : []
            }
        ];

        // Keys length of latency chart
        var latencyChartStartHour = TIME_RANGE_UPPER_LIMIT - time_range + 1;

        // Calculate max latency
        var maxLatency = Math.max.apply(
            0,
            $.map(
                route_details, 
                function( item ) {

                    return item.latency_hourly_average;
                }
            )
        );

        // Fill up latencyData
        var minMovingLatency = 0;
        for( var i = latencyChartStartHour; i <=  TIME_RANGE_UPPER_LIMIT; i++ ) {

            var latencyDetails = route_details[ 'hour' + i ];

            if( latencyDetails && latencyDetails != -1 ) {

                var moving = latencyDetails.latency_moving_average;

                latencyData[ 0 ].values.push( 
                    { 
                        x: new Date( latencyDetails.time * 1000 ), 
                        y: parseFloat( latencyDetails.latency_hourly_average < 0 ? maxLatency : latencyDetails.latency_hourly_average ),
                        originalY: parseFloat( latencyDetails.latency_hourly_average ) 
                    }
                );
                for( var j = 0; j < 10; j++ ) {

                    latencyData[ 1 ].values.push(
                        {
                            x: new Date( ( latencyDetails.time * 1000 ) + ( j * 360000 ) ), 
                            y: parseFloat( moving < 0 ? minMovingLatency : moving ),
                            originalY: parseFloat( moving ) 
                        }
                    );

                }

            }

        }

        return latencyData;
    }

    // Create data for loss chart
    function    createLossData( route_details, time_range ) { 

        // Data array for loss chart
        var lossData = [
            {
                "key"    : "Average Loss %" ,
                "bar"    : true,
                "values" : []
            },
            {
                "key"    : "Moving Average Loss %" ,
                "values" : []
            }
        ];

        // Calculate maximum loss
        var maxLoss = Math.max.apply(
            0,
            $.map( 
                route_details, 
                function( item ) {

                    return item.loss_hourly_average;                    
                }
            )
        );

        // Keys length of loss chart
        var lossChartStartHour = TIME_RANGE_UPPER_LIMIT - time_range + 1;

        // Fill up lossData
        var minMovingLoss = 0;
        for( var i = lossChartStartHour; i <= TIME_RANGE_UPPER_LIMIT; i++ ) {

            var lossDetails = route_details[ 'hour' + i ];

            if( lossDetails && lossDetails != -1 ) {

                var moving = lossDetails.loss_moving_average;

                lossData[ 0 ].values.push(
                    { 
                        x: new Date( lossDetails.time * 1000 ), 
                        y: parseFloat( lossDetails.loss_hourly_average < 0 ? maxLoss : lossDetails.loss_hourly_average ),
                        originalY: parseFloat( lossDetails.loss_hourly_average ) 
                    }
                );
                for( var j = 0; j < 10; j++ ) {

                    lossData[ 1 ].values.push( 
                        { 
                            x: new Date( ( lossDetails.time * 1000 ) + ( j * 360000 ) ), 
                            y: parseFloat( moving < 0 ? minMovingLoss: moving ),
                            originalY: parseFloat( moving )
                        }
                    );

                }

            }

        }

        return lossData;
    }

    // Draw the chart for the specified element
    function    createBarChart( element, drawing_data ) {

        // Clear the data
        $( element ).empty();

        // Draw the data
        if( drawing_data != null ) {

            // Draw operation itself
	        return nv.addGraph(
	
	            function() {
	
	                var chart = nv.models.linePlusBarChart()
	                    .margin( { top: 30, right: 60, bottom: 50, left: 70 } )
	                    .x( function( d, i ) { return i; } )
	                    .color( d3.scale.category10().range() );
	
	                chart.xAxis.tickFormat(
	                    function( d ) {

                            var dx = drawing_data[ 1 ].values[ d ] && drawing_data[ 1 ].values[ d ].x || 0;

                            // This check is used only if time range is one hour for the route 
                            if( d < 10 && d != 0 && d != 9 ) {

                                dx = 0;

                            }

	                        return dx ? d3.time.format( '%x' )( new Date( dx ) ) : '';
	                    }
	                ).showMaxMin( true );
	
	                if( element == '#historical-rtt-chart-wrapper svg' ) {
	
	                    // For latency chart, display minimum range of 50ms, else max RTT value + 50ms
	                    minY = drawing_data[ 0 ].values[ 0 ].y;
	                    maxY = drawing_data[ 0 ].values[ 0 ].y;
	
	                    $.each(
	                        drawing_data[ 0 ].values, 
	                        function( index, val ) {
	
	                            if( val.y < minY )
	                                minY = val.y;
	
	                            if( val.y > maxY )
	                                maxY = val.y;
	
	                            return;
	                        }
	                    );
	
	                    chart.lines.forceY( [ 0, Math.max( 50, maxY + 50 ) ] );
	                    chart.bars.forceY( [ 0, Math.max( 50, maxY + 50 ) ] );
	
	                }
	                else {
	
	                    // For loss chart, display 0 to 100 always
	                    chart.lines.forceY( [ 0, 100 ] );
	                    chart.bars.forceY( [ 0,100 ] );
	
	                }
	
	                chart.y1Axis.tickFormat( d3.format( ',f' ) ).showMaxMin( true );
	                chart.y2Axis.tickFormat( d3.format( ',f' ) ).showMaxMin( true );
	
	                chart.tooltipContent(
	
	                    function( key, x, y, e, graph ) {
	            
	                        return '<h4>'+ key.split( '(' )[ 0 ] + '</h4><p>' + 
	                            new Date( e.point.x ).toLocaleString() + ', ' + e.point.originalY.toFixed( 2 );
	                    }
	                );
				
	
	                d3.select( element ).datum( drawing_data ).transition().duration( 500 ).call( chart );

	                d3.selectAll( "rect.nv-bar" ).style(
	                    "fill", 
	                    function( d, i ) {
	
	                        var color = d.originalY < 0 ? "red" : "steelblue";
	
	                        return color;
	                    }
	                );

	                d3.selectAll( "circle.nv-point" ).style(
	                    "fill", 
	                    function( d, i ) {

	                        var color = d.originalY < 0 ? "red" : "orange";

	                        return color;
	                    }
	                );

	                nv.utils.windowResize( chart.update );
	
	                return chart;
	            }
	        );

        }

        return;
    }

    // Create time range table with the data
    function    load_time_range_table( timerangetable_details ) {

        // Empty time range table
        $( '#timerangetable' ).empty();

        // Create the worst losses table header
        $( '#timerangetable' ).append(
        
            '<thead>                      ' +
            '   <tr>                      ' +
            '       <th><b>Type</b></th>  ' +
            '       <th><b>Value</b></th> ' +
            '   </tr>                     ' +
            '</thead>                     '
        
        );

        // Create time range table body
        $( '#timerangetable' ).append( '<tbody>' );

        if( timerangetable_details != null ) {

            $.each(

	            timerangetable_details,
	            function( timerangetable_detail_key, timerangetable_detail_value ) {
	
	                $( '#timerangetable' ).append(

	                    '<tr>' +
	                    '   <td>' + timerangetable_detail_key + '</td>' +
	                    '   <td>' + timerangetable_detail_value + '</td>' +
	                    '</tr>'

	                );
	
	                return;
	            }

            );

        }

        // Close time range table body
        $( '#timerangetable' ).append( '</tbody>' );

        // Initialize time range table
        $( '#timerangetable' ).dataTable({
            "sPaginationType" : "bootstrap",
            "bFilter"         : false,
            "bLengthChange"   : false,
            "bSearchable"     : false,
            "bPaginate"       : false,
            "bInfo"           : false,
            "bSort"           : true,
            "aaSorting"       : [[ 1, "desc" ]],
            "bDestroy"        : true
        });

        return;
    }

    // This function is similar as function get_citys_routes_ajax() in SLA.js module
    // It loads current cities list from city-routes-2.json file
    function    get_sla_sources_ajax() {

        $.ajax(
            {
                url:        '/cnep/ajax/view-route-sources.json',
                dataType:   'json',
                error:      function ( e ) {

                    console.log( "Error: " + e.message );

                    return;
                },
                success: function ( sources_data ) {

                    // Reload new cities routes data
                    load_sources( sources_data.sla_sources );

                    return;
                }
            }
        );

        return;
    }

    // Load city routes
    function    load_sources( sources_data ) {

        // Get unique source cities
        var unique_source_cities = get_unique_elements( sources_data );
        $.each(
            unique_source_cities, 
            function () {

                var source_city = this.split( "|" );

                $( "#source" ).append( $( "<option />" ).val( source_city[ 0 ] ).text( source_city[ 0 ] + " | " + source_city[ 1 ] ) );

                return;
            }
        );

        return;
    }

    // Get the unique elements from the collection
    function    get_unique_elements( not_unique_elements ) {

        var unique_elements = not_unique_elements.filter(

            function( item, i, not_unique_elements ) {

                return i == not_unique_elements.indexOf( item );
            }
        );

        return unique_elements;
    }

    // Function sorts collection of current cities routes
    function    sortCurrentDataRoutesObject( arrayObject ) {

        // Setup Arrays
        var sortedKeys        = null;
        var sortedInnerKeys   = null;
        var sortedObject      = {};
        var sortedInnerObject = {};

        sortedKeys = new Array();

        // Separate keys and sort them
        for( var arrayItem in arrayObject ) {

            if( /(hour)/.test( arrayItem ) == true ) {

                sortedKeys.push( arrayItem );

            }

        }

        // Sort data itself
        sortedKeys.sort(

            function( itemA, itemB ) {

                var hourA;
                var hourB;
                var result = 0;

                if( /(hour)/.test( itemA ) && /(hour)/.test( itemB ) ) {

                    hourA  = itemA.split( "hour" )[ 1 ];
                    hourB  = itemB.split( "hour" )[ 1 ];
                    result = hourA - hourB;

                }

                return result;
            }

        );

        // Reconstruct sorted object based on keys
        for( var arrayItem in sortedKeys ) {

            sortedObject[ sortedKeys[ arrayItem ] ] = arrayObject[ sortedKeys[ arrayItem ] ];

        }

        return sortedObject;
    } 

    // This function is similar as function get_citys_routes_ajax() in SLA.js module
    // It loads current cities list from city-routes-2.json file
    function    get_source_data_ajax(source,timeRange) {

        $.ajax(
            {
                url:        '/cnep/ajax/view-route-source-data/' + source + '/' + timeRange,
                dataType:   'json',
                error:      function ( e ) {

                    console.log( "Error: " + e.message );

                    return;
                },
                success: function ( source_data ) {

                    // Reload new cities routes data
                    show_route_information(  $('#source').val(), $('#time_range').val(), source_data );

                    return;
                }

            }

        );

        return;
    }

	

    // Entry point
    ( function main() {

        $( document ).ready(

            function() {

                // Set function call for time_range change
                $( '#time_range' ).change(

                    function() {

                        // Show routes information
                        get_source_data_ajax( $( '#source' ).val(), $( '#time_range' ).val() );

                        return;
                    }
                );

                // Show routes information
                get_source_data_ajax( $( '#source' ).val(), $( '#time_range' ).val() );

                return;
            }
        );

        return;
    })();

    return;
} ).call( this );
