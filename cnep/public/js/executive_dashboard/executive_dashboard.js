/**
 * This script is used for show data for executive dashboard page
 */

( function( document, $ ) {

    var routes                      = [];
    var loss5                       = [];
    var latency5                    = [];
    var score5                      = [];
    var target                      = [];
    var socket;
    var active_routes               = [];
    var INTERVAL_LIMIT              = 10000;
    var intervalID;
    var wandering_index             = 0;
    var historical_routes           = [];
    var buildTable                  = false;
    var carouselFirstRunCompleted   = false;
    var chart                       = null;
    var timeoutEventID              = null;

    function createBarChart( element, data ) {

        // Clear out existing data
        $( element ).empty();

        return nv.addGraph(

            function() {

                chart = null;
                chart = nv.models.linePlusBarChart()
                    .margin( { top: 30, right: 60, bottom: 50, left: 70 } )
                    .x( function( d, i ) { return i; } )
                    .color( [ "steelblue", "white", "orange", "red" ] );

                chart.xAxis.tickFormat(
                    function( d ) {

                        var dx = data[ 0 ].values[ d ] && data[ 0 ].values[ d ].x || 0;

                        return dx ? d3.time.format( '%x' )( new Date( dx ) ) : '';
                    }
                ).showMaxMin( true );

                if( element == '#historical-rtt-chart-wrapper svg' ) {

                    // For latency chart, display minimum range of 50ms, else max RTT value + 50ms
                    minY = data[ 0 ].values[ 0 ].y;
                    maxY = data[ 0 ].values[ 0 ].y;

                    $.each(
                        data[ 0 ].values, 
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
                            new Date( e.point.x ).toLocaleString() + ', ' +e.point.originalY.toFixed( 2 );
                    }
                );

                d3.select( element ).select( ".nvd3" ).remove();
                d3.select( element ).select( "svg" ).selectAll( "*" ).remove();
                d3.select( element ).select( "svg" ).remove();
                d3.select( element ).datum( data ).transition().duration( 500 ).call( chart );

                d3.selectAll("rect.nv-bar").style(
                    "fill", 
                    function( d, i ) {

                        var color = d.originalY < 0 ? "red" : "steelblue";

                        return color;
                    }
                );

                d3.selectAll("circle.nv-point").style(
		            "fill", 
		            function( d, i ) {

		                var color = d.originalY < 0 ? "red" : "white";

		                return color;
		            }
		        );

                nv.utils.windowResize( chart.update );

                return chart;
            }
        );

        return;
    }

    function    append_routes( a ) {

        loss5    = a.loss5;
        latency5 = a.latency5;
        score5   = a.score5;
	    target   = a.targetNotReached;	
        routes   = routes.concat( a.routes );

        if( active_routes.length == 0 ) {        

            select();

            if( ! buildTable ) {

                buildTable = true;

	            $( '#losstable' ).dataTable({
                    "sorting"   : true,
                    "aaSorting" : [[ 2, "desc" ]],
                    "destroy"   : true,
                    "info"      : false,
                    "paging"    : false,
                    "searching" : false
	            });

	            $( '#latencytable' ).dataTable({
                    "sorting"   : true,
                    "aaSorting" : [[ 2, "desc" ]],
                    "destroy"   : true,
                    "info"      : false,
                    "paging"    : false,
                    "searching" : false
	            });

                $( '#targettable' ).dataTable({
                    "sDom"           : '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
                    "sorting"        : true,
                    "aaSorting"      : [[ 2, "desc" ]],
                    "destroy"        : true,
                    "paging"         : true,
                    "pagingType"     : "simple_numbers",
                    "pageLength"     : 10,
                    "lengthChange"   : false,
                    "info"           : false,
                    "searching"      : false
                });

	            $( '#scoretable' ).dataTable({
                    "sorting"   : true,
                    "aaSorting" : [[ 2, "desc" ]],
                    "destroy"   : true,
                    "info"      : false,
                    "paging"    : false,
                    "searching" : false
	            });

            }

            __next();            
        }

        return;
    }

    function    update_charts( data ) {

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

        data.latencyChart = sortDataRoutesObject( data.latencyChart );
        data.lossChart    = sortDataRoutesObject( data.lossChart );

        var latencyChartKeysLength = Object.keys( data.latencyChart ).length;
        var lossChartKeysLength    = Object.keys( data.lossChart ).length;

        var maxLatency = Math.max.apply(
            0,
            $.map(
                data.latencyChart, 
                function( item ) {

                    return item.latency_hourly_average;
                }
            )
        );

        var minMovingLatency = 0;
        for( var i = 1; i <= latencyChartKeysLength; i++ ) {

            var a = data.latencyChart[ 'hour' + i ];

            if( a && a != -1 ) {

                var moving = a.latency_moving_average;

                latencyData[ 0 ].values.push( 
                    { 
                        x: new Date( a.time * 1000 ), 
                        y: parseFloat( a.latency_hourly_average < 0 ? maxLatency : a.latency_hourly_average ),
                        originalY: parseFloat( a.latency_hourly_average ) 
                    }
                );
                latencyData[ 1 ].values.push(
                    {
                        x: new Date( a.time * 1000 ), 
                        y: parseFloat( moving < 0 ? minMovingLatency : moving ),
                        originalY: parseFloat( moving ) 
                    }
                );

            }

        }

        var maxLoss = Math.max.apply(
            0,
            $.map( 
                data.lossChart, 
                function( item ) {

                    return item.loss_hourly_average;                    
                }
            )
        );

		var minMovingLoss = 0;
        for( var i = 1; i <= lossChartKeysLength; i++ ) {

            var a = data.lossChart[ 'hour' + i ];

            if( a && a != -1 ) {

                var moving = a.loss_moving_average;

                lossData[ 0 ].values.push(
                    { 
                        x: new Date( a.time * 1000 ), 
                        y: parseFloat( a.loss_hourly_average < 0 ? maxLoss : a.loss_hourly_average ),
                        originalY: parseFloat( a.loss_hourly_average ) 
                    }
                );
                lossData[ 1 ].values.push( 
                    { 
                        x: new Date( a.time * 1000 ), 
                        y: parseFloat( moving < 0 ? minMovingLoss: moving ),
                        originalY: parseFloat( moving )
                    }
                );

            }

        }

        createBarChart( '#historical-loss-chart-wrapper svg', lossData );
        createBarChart( '#historical-rtt-chart-wrapper svg', latencyData );

        lossData    = null;
        latencyData = null;

        return;
    }

    function select() {

        active_routes = routes.splice( 0, 3 );
        score5        = score5.splice( 0, 5 );

        // Empty table for worst losses
        $( '#losstable' ).empty();

        // Create the worst losses table header
        $( '#losstable' ).append(

            '<thead>                            ' +
            '   <tr>                            ' +
            '       <th><b>SOURCE</b></th>      ' +
            '       <th><b>TARGET</b></th>      ' +
            '       <th><b>VALUE (%)</b></th>   ' +
            '   </tr>                           ' +
            '</thead>                           '

        );

        // Create the worst losses table body
        $( '#losstable' ).append( '<tbody>' );

        $.each(

            loss5,
            function( idx, a ) {

                $( '#losstable' ).append(

                    '<tr id="' + ( idx + 1 ) + '">' +
                    '   <td>' + a.source_city + ', ' + a.source_SA + '</td>' +
                    '   <td>' + a.target_city + ', ' + a.target_SA +  '</td>' +
                    '   <td>' + parseFloat( a.loss ).toFixed( 2 ) + '</td>' +
                    '</tr>'

                );

                return;
            }

        );

        // Close the worst losses table body
        $( '#losstable' ).append( '</tbody>' );

        // Initialize the worst losses table attributes
        $( '#losstable' ).dataTable({
            "sorting"   : true,
            "aaSorting" : [[ 2, "desc" ]],
            "destroy"   : true,
            "info"      : false,
            "paging"    : false,
            "searching" : false
        });

        // Empty table for worst latencies
        $( '#latencytable' ).empty();

        // Create the worst latencies table header
        $( '#latencytable' ).append(

            '<thead>                            ' +
            '   <tr>                            ' +
            '       <th><b>SOURCE</b></th>      ' +
            '       <th><b>TARGET</b></th>      ' +
            '       <th><b>VALUE (MS)</b></th>   ' +
            '   </tr>                           ' +
            '</thead>                           '

        );

        // Create the worst latencies table body
        $( '#latencytable' ).append( '<tbody>' );

        $.each(

            latency5,
            function( idx, a ) {

                $( '#latencytable' ).append( 

                    '<tr id="' + ( idx + 1 ) + '">' +
                    '   <td>' + a.source_city + ', ' + a.source_SA +  '</td>' +
                    '   <td>' + a.target_city + ', ' + a.target_SA + '</td>' +
                    '   <td>' + parseFloat( a.latency ).toFixed( 2 ) + '</td>' +
                    '</tr>'
                );

                return;
            }
        );

        // Close the worst latencies table body
        $( '#latencytable' ).append( '</tbody>' );

        // Initialize the worst latencies table attributes
        $( '#latencytable' ).dataTable({
            "sorting"   : true,
            "aaSorting" : [[ 2, "desc" ]],
            "destroy"   : true,
            "info"      : false,
            "paging"    : false,
            "searching" : false
        });

        // Empty table for target not reached
        $( '#targettable' ).empty();

        // Create the target not reached table header
        $( '#targettable' ).append(

            '<thead>                            ' +
            '   <tr>                            ' +
            '       <th><b>SOURCE</b></th>      ' +
            '       <th><b>TARGET</b></th>      ' +
            '       <th><b>NO OF TIMES</b></th>   ' +
            '   </tr>                           ' +
            '</thead>                           '

        );

        // Create the target not reached table body
        $( '#targettable' ).append( '<tbody>' );

        $.each(

            target,
            function( idx, a ) {

		      var values = idx.split( "|" );

                $( '#targettable' ).append(

                    '<tr id="' + ( idx + 1 ) + '">' +
			        '   <td>' + values[0] +  '</td>' +
                    '   <td>' + values[1] +  '</td>' +
                    '   <td>' + a + '</td>' +
                    '</tr>'

                );

                return;
            }

        );

        // Close the target not reached table body
        $( '#targettable' ).append( '</tbody>' );

        // Initialize the target not reached table attributes
        $( '#targettable' ).dataTable({
            "sDom"           : '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
            "sorting"        : true,
            "aaSorting"      : [[ 2, "desc" ]],
            "destroy"        : true,
            "paging"         : true,
            "pagingType"     : "simple_numbers",
            "pageLength"     : 10,
            "lengthChange"   : false,
            "info"           : false,
            "searching"      : false
        });

        $.each( 

            score5,
            function( idx, a ) {

                a.element = $( '#score' + ( idx + 1 ) ).get( 0 ); 

                $( a.element ).html(
                    '<td>' + a.source_city + ', ' + a.source_SA +  '</td>' +
                    '<td>' + a.target_city + ', ' + a.target_SA + '</td>' +
                    '<td>' + idx + '</td>'
                );

                return;
            }

        );

        $.each(

            active_routes,
            function( idx, a ) {

                if( typeof a == 'undefined' ) {

                    return true;
                }

                a.element = $( '#route' + ( idx + 1 ) ).get( 0 );

                $( a.element ).html(
                    '<tr>' +
                    '   <td>' +
                    '       <div class="row">' +
                    '           <div class="col-md-12">' +
                    '               <p class="text-center">' + a.source_city + ', ' + a.source_SA + '</p>' +
                    '           </div>' +
                    '       </div>' +
                    '   </td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td>' +
                    '       <div class="row">' +
                    '           <div class="col-md-12">' +
                    '               <p class="text-center">' + a.target_city + ', ' + a.target_SA +'</p>' +
                    '           </div>' +
                    '       </div>' +
                    '   </td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td>' +
                    '       <div class="row">' +
                    '           <div class="col-md-8">' +
                    '               <p class="text-center">' + 'RTT ' + parseFloat( a.latency ).toFixed( 2 ) + ' ms' + '</p>' +
                    '           </div>' +
                    '           <div class="col-md-2">' +
                    '               <img src="/cnep/imgs/' + 
                                        ( a.latency_trend == "good" ? 'green_triangle_down.png' : 'red_triangle_up.png' ) + 
                                    '">' + 
                    '           </div>' +
                    '       </div>' +
                    '   </td>' +
                    '</tr>' +
                    '<tr>' +
                    '   <td>' +
                    '       <div class="row">' +
                    '           <div class="col-md-8">' +
                    '               <p class="text-center">' + 'Loss ' + parseFloat( a.loss ).toFixed( 2 ) + '%' + '</p>' +
                    '           </div>' +
                    '           <div class="col-md-2">' +
                    '               <img src="/cnep/imgs/'+ 
                                        ( a.loss_trend == "good" ? 'green_triangle_down.png' : 'red_triangle_up.png' ) +
                                    '">' + 
                    '           </div>' +
                    '       </div>' +
                    '   </td>' +
                    '</tr>'
                );

                return;
            }
        );

        if( routes.length < 3 ) {

            get_citys_routes_ajax();

        }

        return;
    }

    function __next() {

        if( wandering_index == active_routes.length ) {

            console.log( 'Shifting to next 6 routes' );

            historical_routes = active_routes.concat( historical_routes );

            select();

            wandering_index = 0;
        }

        console.log( 'Moving to ' + ( wandering_index + 1 ) );

        show( active_routes[ wandering_index++ ] );

        return;
    }

    function show( a ) {

        $( '.routes' ).removeClass( 'selected' );

        if( a ) {

            $( a.element ).addClass( 'selected' );

            update_charts( a );

        }

        a = null;

        return;
    }

    function resetInterval() {

        if( routes ) {

            // Need next six routes
            if( active_routes.length == 0 ) {

                select();

            }

            if( carouselFirstRunCompleted == false ) {

                carouselFirstRunCompleted = true;

            }
            else {

                __next();

            }

        }

        // Clear the previous timeout ID
        if( timeoutEventID != null ) {

            clearTimeout( timeoutEventID );

        }

        // Set the new timeout ID
        timeoutEventID = setTimeout( resetInterval, INTERVAL_LIMIT );

        return;
    }

    // Function sorts collection of worst five routes
    function    sortDataRoutesObject( arrayObject ) {

        // Setup Arrays
        var sortedKeys        = null;
        var sortedInnerKeys   = null;
        var sortedObject      = {};
        var sortedInnerObject = {};

        sortedKeys = new Array();

        // Separate keys and sort them
        for( var arrayItem in arrayObject ) {

            if( /(day)/.test( arrayItem ) == true ) {

                sortedInnerKeys   = new Array();
                sortedInnerObject = {};

                // Separate inner keys and sort them
                for( var arrayInnerItem in arrayObject[ arrayItem ] ) {

                    sortedInnerKeys.push( arrayInnerItem );

                }

                // Sort data itself
                sortedInnerKeys.sort(

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

                // Reconstruct sorted inner object based on inner keys
		        for( var arrayInnerItem in sortedInnerKeys ) {

                    sortedInnerObject[ sortedInnerKeys[ arrayInnerItem ] ] = arrayObject[ arrayItem ][ sortedInnerKeys[ arrayInnerItem ] ];

		        }

                arrayObject[ arrayItem ] = sortedInnerObject;

            }

            sortedKeys.push( arrayItem );

        }

        // Sort data itself
        sortedKeys.sort();

        // Reconstruct sorted object based on keys
        for( var arrayItem in sortedKeys ) {

            sortedObject[ sortedKeys[ arrayItem ] ] = arrayObject[ sortedKeys[ arrayItem ] ];

        }

        return sortedObject;
    } 

    function    get_citys_routes_ajax() {

        $.ajax({

            url: '/cnep/ajax/city-routes.json',

            dataType: 'json',

            error: function( error ) {

                console.log( error.responseText );
                displayErrorInErrorContainer( error.responseText );

                return;
            },

            success: function( data ) {

                append_routes( data );

                data = null;

                return;
            }
        });

        return;
    }

    /**
     * Entry point
     */
    (function main() {

        $( document ).ready(

            function() {

                // Disable any caching for this page
                $.ajaxSetup(
                    {
                        cache: false
                    }
                );

                // Clear default error container
                clearDefaultErrorContainer();

                $( "#carousel" ).carousel();

                $( '.route-table' ).click( 

                    function() {

		                var obj = this;

		                $.each(
		                    active_routes, 
		                    function( i, e ) {
		
		                        if( $( e.element ).attr( 'id' ) == $( obj ).attr( 'id' ) ) {
		
		                            resetInterval();
		
		                            console.log( 'User selected ' + ( i + 1 ) );

		                            wandering_index = i + 1;
		
		                            show( e );

		                            return false;
		                        }

                                return;
		                    }
		                );

                        obj = null;

                        return;
                    }
                );

                $( '#fast-forward' ).click(

                    function() {

                        historical_routes = active_routes.concat( historical_routes );

                        select();

                        wandering_index = 0;

                        __next();

                        // Clear the previous timeout ID
                        if( timeoutEventID != null ) {

                            clearTimeout( timeoutEventID );

                        }

                        // Set the new timeout ID
                        timeoutEventID = setTimeout( resetInterval, INTERVAL_LIMIT );

                        return;
                    }

                );

                $( '#fast-backward' ).click(

                    function() {

                        if( historical_routes ) {

                            routes = historical_routes.splice( 0, 6 ).concat( active_routes ).concat( routes );

                            select();

                            wandering_index = 0;

                            __next();

                            // Clear the previous timeout ID
                            if( timeoutEventID != null ) {

                                clearTimeout( timeoutEventID );

                            }

                            // Set the new timeout ID
                            timeoutEventID = setTimeout( resetInterval, INTERVAL_LIMIT );

                        }

                        return;
                    }

                );

                get_citys_routes_ajax();

                return;
            }
        );

        resetInterval();

        return;
    })();

    return;
}).call( this, document, jQuery );
