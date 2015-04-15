/**
 * This script is used for show data for SLA page
 */

( function () {

    // Define consts variables
    var RED_ALERT_COLOR    = "red";
    var YELLOW_ALERT_COLOR = "yellow";

    // simple popup definition
    var simplePopup = null; 

    // Metrics table
    var metricsTable = null;

    // Entry point
    ( function main() {

        $( document ).ready(


            function() {

                simplePopup = document.createElement( 'div' );

                $( simplePopup ).css(
                    {
                        color: 'black',
                        display: 'none', 
                        backgroundColor: '#FFFFFF', 
                        width: '300px', 
                        height: '160px', 
                        border: '1px solid #000000'
                    }
                );

                document.body.appendChild( simplePopup );

                return;
            }
        );

        return;
    })();

    /**
     * Will keep city routes data in memory.
     * Note: city_routes_data will be removed soon. Please do not use it
     * @type {Array}
     */
    var city_routes_data = [];

    /**
     * Will keep granular routes data in memory.
     * Note: granular_routes_data will be removed soon. Please do not use it
     * @type {Array}
     */
    var granular_routes_data = [];

    /**
     * Trim string.
     * This function copied from some internet page
     * witch did not provide any copyright information
     * if someone find it illegal please replace it
     * other trim function. I'm using this function because
     * it's working very well and faster then other.
     *
     * If you find this function illegal please change code to:
     *<code>
     *  return str.replace(/^\s+|\s+$/g, '');
     *</code>
     * This code provided by Mozzila,
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
     *
     * @param {string} str
     * @returns {string}
     */
    function trim( str ) {

        return str.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
    }

    function get_citys_routes_ajax() {

        $.ajax(
            {
                url         : '/cnep/ajax/sla-routes.json',
                dataType    : 'json',
                error: function( error ) {

                    console.log( error.responseText );
                    displayErrorInErrorContainer( error.responseText );

                    return;
                },
                success: function( data ) { 

                    city_routes_data = data;

                    city_routes( data );
//
//                    createTable( data );

                    return;
                }
            }
        );

        return;
    }

    function get_granular_routes_ajax( cityName, stateName, callback ) {

        $.ajax(
            {
                url         : '/cnep/ajax/granular-routes.json',
                data        : { cityName: cityName, stateName: stateName },
                type        : 'GET',
                dataType    : 'json',
                error: function( error ) {

                    console.log( error.responseText );
                    displayErrorInErrorContainer( error.responseText );

                    return;
                },
                success: function( data ) {

                    callback( data.data );

                    return;
                }
            }
        );

        return;
    }

    /**
     * Returns filtered data after time frame filter
     * @param {array} charData
     * @returns {array}
     */
    function time_filter( chartData ) {

        // will content true data
        var result = [];

        //do desc sort
        chartData.sort(
            function( a, b ) {

                return b.dateHour.getTime() - a.dateHour.getTime();
            }
        );

        switch( $( "#time-range" ).val() ) {

            case '1h':

                result = chartData.slice( 0, 1 );

                break;

            case '12h':

                result = chartData.slice( 0, 12 );

                break;

            case '24h':

                result = chartData.slice( 0, 24 );

                break

            case '5d':

                result = chartData.slice( 0, 120 );

                break;

        }

        return result;
    }

    /**
     * Returns color for value
     * or "" if value does not need to be alerted
     * using constants RED_ALERT_COLOR and YELLOW_ALERT_COLOR
     * @param {number} value
     * @param {string} metric
     */
    function pickup_color( value, metric, metric_type ) {

        if( metric == 'latency' ) {

            if( metric_type == 'Latency Critical Count' )

                return RED_ALERT_COLOR;

            else if( metric_type == 'Latency Warning Count' )

                return YELLOW_ALERT_COLOR;

            else

                return "";

        } 
        else if( metric == 'loss' ) {

            if( metric_type == 'Loss Critical Count' )

                return RED_ALERT_COLOR;

            else if( metric_type == 'Loss Warning Count' )

                return YELLOW_ALERT_COLOR;

            else

                return "";
        } 
        else if( metric == 'sla' ) {

            if( value > 10 )

                return RED_ALERT_COLOR;

            else if( value > 0 )

                return YELLOW_ALERT_COLOR;

            else

                return "";

        } 
        else if( metric == 'availability' ) {

            if( metric_type == 'Availability Critical Count' )

                return RED_ALERT_COLOR;

            else if( metric_type == 'Availability Warning Count' )

                return YELLOW_ALERT_COLOR;

            else

                return "";

        }

        return "#ffffff"
    }

    function update_legend( metric, title ) {
	
        if( metric == 'latency' ) {
		
            $( "#legend-critical" ).html( " > 3 stddev " + title );
            $( "#legend-warning" ).html( " >= 1.5 stddev " + title );
            $( "#legend-healthy" ).html( " < 1.5 stddev " + title );

        } 
        else if( metric == 'loss' ) {

            $( "#legend-critical" ).html( " > 5% " + title );
            $( "#legend-warning" ).html( " > 0% " + title );
            $( "#legend-healthy" ).html( " 0% " + title );

        } 
        else if( metric == 'sla' ) {

            $( "#legend-critical" ).html( " > 10 " + title );
            $( "#legend-warning" ).html( " > 0 " + title );
            $( "#legend-healthy" ).html( " <=0 " + title );

        } 
        else if( metric == 'availability' ) {

            $( "#legend-critical" ).html( " < 95% " + title );
            $( "#legend-warning" ).html( " < 100% " + title );
            $( "#legend-healthy" ).html( " 100% " + title );

        }

        return;
    }

    /**
     * Returns filtered and calculated metric value.
     * Calculating average value.
     * @param {array} chartData
     * @param {string} metric
     * @returns {number|string}
     */
    function calculate_metric( chartData, metric ) {

        var metrics = {
            loss: 0,
            latency: 0,
            availability: 0,
            sla_violations: 0
        }
        var lng = 0;

        //convert date string to Date
        var convertedChartData = [];
        $.each(
            chartData, 
            function( idx, e ) {

                var tmp = e.dateHour.split( '-' );
                var c   = $.extend( {}, e );

                c.dateHour = new Date( tmp[ 0 ], tmp[ 1 ] - 1, tmp[ 2 ], tmp[ 3 ] );

                convertedChartData.push( c );

                return;
            }
        );

        // apply time frame filter
        convertedChartData = time_filter( convertedChartData );

        $.each(
            convertedChartData, 
            function( idx, e ) {

                metrics.loss           += e.avgLoss || 0;
                metrics.latency        += e.avgLatency || 0;
                metrics.sla_violations += e.SLAViolations || 0;
                metrics.availability   += e.avgAvailability ||0;

                lng++;

                return;
            }
        );

        metrics.loss         = metrics.loss / lng;
        metrics.latency      = metrics.latency / lng;
        metrics.availability = metrics.availability / lng;

        var val = metrics[ metric ];

        return( val == undefined || val == -1 ) ? 'Unreachable' : Math.round( val );
    }

    /**
     * Processing city routes data and drawing table
     * @param {Array} data
     */
    var destination = undefined;
    var init        = undefined;

    function    city_routes( data ) {

        $( "#back-to-city-lvl" ).hide();
        $( "#metric" ).unbind( 'change' );
        $( "#time-range" ).unbind( 'change' );
        $( "#source" ).unbind( 'change' );
        $( "#destination" ).unbind( 'change' );

        $( "#metric" ).change(

            function () {

                city_routes( city_routes_data );

                update_legend( $( '#metric' ).val(), $( '#metric option:selected' ).text() );

                return;
            }

        );

        $( "#time-range" ).change(

            function () {

                city_routes( city_routes_data );

                return;
            }

        );

        $( "#source" ).change(

            function () {

                city_routes( city_routes_data );

                return;
            }

        );

        var converted_data  = {}
        var sources         = [];
        var cities          = [];
        var timeRange       = $( '#time-range' ).val();

        var timeRangeVal;

        if( timeRange == '1h' )

            timeRangeVal = 'last_1_hour';

        else if( timeRange == '12h' )

            timeRangeVal = 'last_12_hours';

        else if( timeRange == '24h' )

            timeRangeVal = 'last_24_hours';

        else if( timeRange == '5d' )

            timeRangeVal = 'last_5_days';

        var metric = $( '#metric' ).val();

        $.each(

            data.sources, 

            function( sindex, source ) {
				
                if( sources.indexOf( source ) == -1 )
                    sources.push( source );

                return;
            }

        );

        $.each(

            data.targets, 

            function( tindex,target ) {

                if( cities.indexOf( target ) == -1 )
                    cities.push( target );

                return;
            }

        );

        sources = $.map(

            sources, 

            function( a ) {

                if( ! a ) 
                    return { sTitle: a, "bVisible": true, "sWidth": "15%" };

                return { sTitle: a, "bVisible": true };
            }

        );
	update_legend($('#metric').val(), $('#metric option:selected').text());

        cities.sort();

        if( ! init ) {

            var i = 0;

            for( var key in sources ) {

                var val = sources[ key ].sTitle;

                if( val ) {

                    i = i + 1;

                    if( i > 1 )

                        $( "#source" ).append( $( "<option />" ).val( val ).text( val ) );

                    else

                        $( "#source" ).append( $( "<option />" ).val( val ).text( val ).prop( "selected", true ) );

                }

            }
	
        }

        if( ! init ) {

            for( var key in cities ) {

                if( cities[ key ] ) {

                    $( "#destination" ).append( $( "<option />" ).val( cities[ key ] ).text( cities[ key ] ) );

                }

            }

        }

        $.each(

            data.sources, 

            function (sindex,source) {

                var selectedVal=$( "#source option:selected" ).val();

                if(selectedVal==source){

                    $.each(
                        data.targets, 
                        function(tindex,target){

                            if ($('#destination').val()== 'All' || $('#destination').val()==target) {

                                if(metric=='loss' || metric=='latency' || metric=='availability'){

                                    if(data.slaRoutes[sindex+'|'+tindex]===undefined){

                                        converted_data[source+':'+target]=[target,'N/A','N/A','N/A'];

                                    }
                                    else{

                                        converted_data[source+':'+target]=[target,data.slaRoutes[sindex+'|'+tindex][timeRangeVal][metric+'CriticalCount'],data.slaRoutes[sindex+'|'+tindex][timeRangeVal][metric+'WarningCount'],data.slaRoutes[sindex+'|'+tindex][timeRangeVal][metric+'HealthyCount']];

                                    }

                                }
                                else{

                                    if(data.slaRoutes[sindex+'|'+tindex]===undefined){

                                        converted_data[source+':'+target]=[target,'N/A'];

                                    }
                                    else{

                                        converted_data[source+':'+target]=[target,data.slaRoutes[sindex+'|'+tindex][timeRangeVal][metric+'Count']];

                                    }

                                }

                            }

                        }

                    );

                }

            }

        );

        var metricValue      = $( '#metric' ).val();
        var topHeaderColumns = [''];

        if( metricValue == 'latency' ) {

            topHeaderColumns.push( 'Latency Critical Count' );
            topHeaderColumns.push( 'Latency Warning Count' );
            topHeaderColumns.push( 'Latency Healthy Count' );

        }
        else if( metricValue == 'loss' ) {

            topHeaderColumns.push( 'Loss Critical Count' );
            topHeaderColumns.push( 'Loss Warning Count' );
            topHeaderColumns.push( 'Loss Healthy Count' );

        }
        else if( metricValue == 'availability' ) {

            topHeaderColumns.push( 'Availability Critical Count' );
            topHeaderColumns.push( 'Availability Warning Count' );
            topHeaderColumns.push( 'Availability Healthy Count' );

        }
        else if( metricValue == 'sla' ) {

            topHeaderColumns.push( 'Sla Count' );

        }

        topHeaderColumns = $.map(

            topHeaderColumns, 

            function( topHeaderColumn ) {

                if( ! topHeaderColumn ) 
                    return { sTitle: topHeaderColumn, "bVisible": true, "sWidth": "25%" };

                return { sTitle: topHeaderColumn, "bVisible": true };

            }

        );

        // Destroy the metrics table
        if( metricsTable != null ) {

            metricsTable.fnDestroy();

        }

        // Remove all the DOM elements of metrics table
        $( '#metricsTable' ).empty();

        // Reinitialize the metrics table
        metricsTable = $( '#metricsTable' ).dataTable({

            aoColumns: topHeaderColumns,
            "bProcessing": true,
            "bDestroy": true,
            fnRowCallback: function (row, data, displayIndex) {

                // this is kind hacky code
                // but as said to just make it work
                // I will leave it like this for now
                var target = data[0];
                var source = $( "#source option:selected" ).val();

                $.each(
                    topHeaderColumns, 
                    function (i, e) {

                        if (i == 0) 
                            return true;

                        if(data[i]!='N/A') {

                            $("td:eq(" + i + ")", row).css(
                                {
                                    backgroundColor: pickup_color(new Number(data[i]), $("#metric").val(),e.sTitle)
                                }
                            );

                        }

                        $("td:eq(" + i + ")", row).attr(
                            {
                                'data-source': source, 
                                "data-target": target 
                            }
                        );

                        $("td:eq(" + i + ")", row).mouseover(
                            function (e) {

                                var keys=[];	

                                if(i==1){

                                    keys.push('latencyCriticalCount');
                                    keys.push('lossCriticalCount');
                                    keys.push('availabilityCriticalCount');
                                    keys.push('slaCount');

                                }
                                else if(i==2){

                                    keys.push('latencyWarningCount');
                                    keys.push('lossWarningCount');
                                    keys.push('availabilityWarningCount');
                                    keys.push('slaCount');

                                }
                                else if(i==3){

                                    keys.push('latencyHealthyCount');
                                    keys.push('lossHealthyCount');
                                    keys.push('availabilityHealthyCount');
                                    keys.push('slaCount');

                                }

                                var source = $(this).attr('data-source');
                                var target = $(this).attr('data-target');
                                var found=false;

                                $.each(
                                    city_routes_data.slaRoutes, 
                                    function (index, e) {

                                        var keyIndex=source.split('|')[0].trim()+'|'+target.split('|')[0].trim();

                                        if (keyIndex==index) {

                                            var html = "<div style='background-color: #2f4f4f; color: #f8f8ff'>Source-<b>" + source + '</b><br>Target-<b>' +target+ '</b><br>' + $("#metric option:selected").text()+ ' - ' + $("#time-range option:selected").text() + '</div>';

                                            var timeRange=$('#time-range').val();
                                            var timeRangeVal;

                                            if(timeRange=='1h')
                                                timeRangeVal='last_1_hour';
                                            else if (timeRange=='12h')
                                                timeRangeVal='last_12_hours';
                                            else if (timeRange=='24h')
                                                timeRangeVal='last_24_hours';
                                            else if (timeRange=='5d')	
                                                timeRangeVal='last_5_days';

                                            html += '<table style="width: 100%;"><tr><td>Latency</td><td>' + city_routes_data.slaRoutes[index][timeRangeVal][keys[0]] +
                                                    '</td></tr><tr><td>Loss</td><td>' + city_routes_data.slaRoutes[index][timeRangeVal][keys[1]] +
                                                    '</td></tr><tr><td>Availability</td><td>' + city_routes_data.slaRoutes[index][timeRangeVal][keys[2]] +
                                                    '</td></tr><tr><td>SLA Violations</td><td>' + city_routes_data.slaRoutes[index][timeRangeVal][keys[3]] +
                                                    '</td></tr></table>';

                                            $(simplePopup).html(html);

                                            found=true;

                                            return false;
                                        }

                                        return;
                                    }
                                );

                                if(!found){

                                    var html = "<div style='background-color: #2f4f4f; color: #f8f8ff'>Source-<b>" + source + '</b><br>Target-<b>' +target+ '</b><br>' + $("#metric option:selected").text()+ ' - ' + $("#time-range option:selected").text() + '</div>';

                                    var timeRange=$('#time-range').val();
                                    var timeRangeVal;

                                    if(timeRange=='1h')
                                        timeRangeVal='last_1_hour';
                                    else if (timeRange=='12h')
                                        timeRangeVal='last_12_hours';
                                    else if (timeRange=='24h')
                                        timeRangeVal='last_24_hours';
                                    else if (timeRange=='5d')	
                                        timeRangeVal='last_5_days';

                                    html += '<table style="width: 100%;"><tr><td>Latency</td><td>' + 'N/A'+
                                            '</td></tr><tr><td>Loss</td><td>' + 'N/A' +
                                            '</td></tr><tr><td>Availability</td><td>' + 'N/A' +
                                            '</td></tr><tr><td>SLA Violations</td><td>' + 'N/A' +
                                            '</td></tr></table>';
                                
                                    $(simplePopup).html(html);

                                }

                                $(simplePopup).css(
                                    {
                                        position: "absolute", 
                                        left: e.pageX, 
                                        top: e.pageY, 
                                        display: 'block', 
                                        zIndex: 1000
                                    }
                                );

                                return;
                            }).mouseout(
                                function () {

                                    $(simplePopup).css(
                                        {
                                            display: 'none'
                                        }
                                    );

                                    return;
                                }
                            );

                            return;
                        }
                    );

                    $("td:eq(0)", row).html(
                        "<p style='color:#222222;' class='target'><b>" + data[0] + "</b></p>"
                    );

                    $("td:eq(0)", row).children(".target").click(
                        function () {

                            var target = $(this).attr('href').replace('#', '');

                            granular_routes(target);

                            return;
                        }

                    );

                    return row;
                }
        });

        $.each(
            Object.keys(converted_data), 
            function (i, key) {

                var row = converted_data[key];

                if (!destination || destination.indexOf(key.split(':')[1])>-1) {

                    metricsTable.fnAddData( row );

                }
            }
        );

        $("#destination").change(
            function () {

                destination = $('#destination').val();

                if (destination == 'All') {
                    destination = undefined;
                }

                city_routes(city_routes_data);
            }
        );

        init = true;

        return;
    }

    /**
     * Process granular routes information  and displaying it table
     * filtering data by  target also
     * @param {string} target
     */
    function granular_routes(target) {

        $('#back-to-city-lvl').show();

        var a = target;

        $('#metric').unbind('change');
        $("#time-range").unbind('change');
        $("#source").unbind('change');
        $('#metric').change(

            function () {

                update_legend($('#metric').val(), $('#metric option:selected').text());
                granular_routes(a);

            }

        );

        $("#time-range").change(

            function () {

                granular_routes(a);

            }
        );

        var source_filter = function(t) {

            var selection = $("#source option:selected").text();
            var count = 0;

            for (var key in topHeaders) {

                t.fnSetColumnVis(count, true)

                count++;

            }

            if (selection != 'All') {

                count = 0;

                for (var key in topHeaders) {

                    var obj = topHeaders[key];

                    if (topHeaders[key].sTitle && topHeaders[key].sTitle != selection) {

                        t.fnSetColumnVis(count, false)

                    }

                    count++;

                }

            }
		 


            return;
        }

        var target = target.split(',');
        var topHeaders = [''];

        target[1] = trim(target[1]);

        get_granular_routes_ajax(
            target[0], 
            target[1], 
            function(data){

                if (typeof data == 'undefined' || !data.length){

                    console.log('Error: granular_routes_data is empty');

                    return false;
                }

                //filter by target
                var converted_data = {};

                $.each(
                    data, 
                    function(i,e){

                        var source = e.SourceCity + ', ' + e.SourceState;

                        if (topHeaders.indexOf(source) == -1)
                            topHeaders.push(source);

                        if (typeof converted_data[e.TargetIP] =='undefined')
                            converted_data[e.TargetIP] = {0: e.TargetIP}

                        converted_data[e.TargetIP][topHeaders.indexOf(source)] = calculate_metric(e.ChartData, $('#metric').val());

                        return;
                    }
                );

                topHeaders = $.map(
                    topHeaders, 
                    function (a) {

                        return {sTitle: a};
                    }
                );

                var t = $('#metricsTable').dataTable(
                    {
                        aoColumns: topHeaders,
                        "bProcessing": true,
                        "bDestroy": true,
                        "fnRowCallback": function (row, data_, displayIndex) {

                            var target = data_[0];

                            $.each(
                                topHeaders, 
                                function (i, e) {

                                    if (i == 0) 
                                        return true;

                                    $("td:eq(" + i + ")", row).css(
                                        {
                                            backgroundColor: pickup_color(new Number(data_[i]), $("#metric").val())
                                        }
                                    );

                                    $("td:eq(" + i + ")", row).attr(
                                        {
                                            'data-source': e.sTitle, 
                                            "data-target": target 
                                        }
                                    );

                                    $("td:eq(" + i + ")", row).mouseover(
                                        function (e) {

                                            var source = $(this).attr('data-source').split(',');
                                            var target = $(this).attr('data-target');

                                            source[1] = trim(source[1]);

                                            $.each(
                                                data, 
                                                function (i, e) {

                                                    if (source[0] == e.SourceCity && source[1] == e.SourceState && target == e.TargetIP ) {

                                                        var html = "<div style='background-color: #2f4f4f; color: #f8f8ff'><b>" + e.SourceCity + ', ' + 
                                                                    e.SourceState + ' - ' + e.TargetCity + ', ' + e.TargetState + '</b>'+ '<br>' +
                                                                    $("#metric option:selected").text()+ ' - ' + $("#time-range option:selected").text()+
                                                                    '</div>';
                                                        html += '<table style="width: 100%;"><tr><td>Loss</td><td>' + calculate_metric(e.ChartData, 'loss') +
                                                                '</td></tr><tr><td>Latency</td><td>' + calculate_metric(e.ChartData, 'latency') +
                                                                '</td></tr><tr><td>Availability</td><td>' + calculate_metric(e.ChartData, 'availability') +
                                                                '</td></tr><tr><td>SLA Violations</td><td>' + calculate_metric(e.ChartData, 'sla') +
                                                                '</td></tr></table>';

                                                        $(simplePopup).html(html);
                                                    }

                                                    return;
                                                }
                                            );

                                            $(simplePopup).css(
                                                {
                                                    position: "absolute", 
                                                    left: e.pageX, 
                                                    top: e.pageY, 
                                                    display: 'block', 
                                                    zIndex: 1000
                                                }
                                            );

                                            return;
                                        }).mouseout(

                                            function () {

                                                $(simplePopup).css({display: 'none'});

                                            }
                                        );

                                        return;
                                    });

                                $("td:eq(0)", row).html("<b>" + data_[0] + "</b>");

                                return row;
                            }

                        });

                        $("#source").change(
                            function () {
                                source_filter(t);
                            }
                        );

                        source_filter(t);
                        t.fnClearTable();
                        $.each(
                            Object.keys(converted_data), 
                            function (i, key) {
                                t.fnAddData(converted_data[key]);
                            }
                        );
                    }
                );
            }

            $('#back-to-city-lvl').click(
                function() {
                    city_routes(city_routes_data);
                }
            );

           // update_legend($('#metric').val(), $('#metric option:selected').text());

            $('#back-to-city-lvl').hide();
            get_citys_routes_ajax();

            return;

    function createTable( data ) {

            var columnCount = 3;
            var columns = [
                'Latency Critical Count',
                'Latency Warning Count',
                'Latency Healthy Count'
            ];

            //Clear the table
            $('#tableContainer').empty();
            var columnLabels = '<th></th>';
        for(var i=0; i < columnCount; i++) {
            columnLabels += '<th>' + columns[i] + '</th>';
        }

            //Create table structure
            $('#tableContainer').append(
                    '<table id="slaTable" class="table table-striped table-bordered" style="background-color: white; color: black;">                ' +
                    '   <thead>                                     ' +
                    '       <tr>                                    ' +
                        columnLabels +
                    '       </tr>                                   ' +
                    '   </thead>                                    ' +
                    '   <tbody>                                     ' +
                    '   </tbody>                                    ' +
                    '</table>                                       '
            );


//            //Insert data in the table
//            for(var i = 0; i < 25; i++ ) {
//
//                $('#slaTable > tbody:last').append(
//                        '<tr>' +
//                        '   <td>' + data[i]["router_ip"]                + '</td>' +
//                        '   <td>' + data[i]["avg_number_of_hops"]       + '</td>' +
//                        '   <td>' + data[i]["avg_rtt"]                  + '</td>' +
//                        '   <td>' + data[i]["avg_rtt_negative"]         + '</td>' +
//                        '   <td>' + data[i]["router_market"]            + '</td>' +
//                        '   <td>' + data[i]["avg_jitter"]               + '</td>' +
//                        '   <td>' + data[i]["avg_loss"]                 + '</td>' +
//                        '</tr>'
//                );
//            }


    }

    function get_sources_ajax() {

        // Clear default error container
        clearDefaultErrorContainer();

        $.ajax(
            {
                url         : '/cnep/ajax/sla-sources.json',
                dataType    : 'json',
                error: function( error ) {

                    console.log( error.responseText );
                    displayErrorInErrorContainer( error.responseText );

                    return;
                },
                success: function( data ) {

                    city_routes_data = data;

                    city_routes( data );
//
//                    createTable( data );

                    return;
                }
            }
        );

        return;
    }


}).call(this);
