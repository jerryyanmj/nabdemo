/**
 * This script is used for show data for Edge Node reports page
 */

var latencyDate          = '',
    lossDate             = '',
    jitterDate           = '',
    pdfDate              = '',
    latencyProvider      = 'default',
    lossProvider         = 'default',
    jitterProvider       = 'default';

( function( document, $ ) {

    // How wait between checks the Edge Node reports data ( in milliseconds )
    var get_reports_data_interval = 600000; // Page is refreshed every hour ( 3600000 )

    // Timeout event for getting Edge Node reports data
    var timeoutEventID = null;


    function   createLineChart(element, data) {


        var dataTable = new google.visualization.DataTable(data);
        var formatter = new google.visualization.DateFormat({pattern: "%HH:%mm"});

        dataTable.sort(0);

        var vTitle = '';
        var hTitle = '';

        if(element == 'edge-node-latency') {
            vTitle = 'Avg Latency';
            hTitle = 'Collector Time';
        }

        if(element == 'edge-node-loss') {
            vTitle = 'Avg Loss';
            hTitle = 'Collector Time';
        }

        if(element == 'edge-node-jitter') {
            vTitle = 'Avg Jitter';
            hTitle = 'Collector Time';
        }



        var options = {

            height: 520,

            crosshair: {
                trigger: 'both'
            },

            backgroundColor: { fill: 'transparent' },
            interpolateNulls: true,
            tooltip: {
                textStyle: {color: 'black'}
            },
            vAxis: {
                title: vTitle,
                titleTextStyle: {
                    color: 'white',
                    italic: false,
                    bold: true
                },
                baselineColor: 'white',
                gridlines: {
                    color: 'transparent'
                },
                textStyle: {
                    color: 'white',
                    fontSize: '10'
                }
            },

            hAxis: {
                title: hTitle,
                titleTextStyle: {
                    color: 'white',
                    italic: false,
                    bold: true
                },
                baselineColor: 'white',
                gridlines: {
                    color: 'transparent'
                },
                textStyle: {
                    color: 'white',
                    fontSize: '10'

                }
            },
		axisTitlesPosition: 'none',
            legend: {
                textStyle: {
                    color: 'white',
		    fontSize: '9'
                }
            },

                chartArea: {
                        height: 250,
                        width: 1010,
                        left: 30,
                top: 25
                },

                lineWidth: 3,
                pointSize: 7
        };



        if(data["rows"].length > 0) {
            var chart = new google.visualization.LineChart(document.getElementById(element));
            chart.draw(dataTable, options);
        }
        else {
            $('#' + element).empty();
            $('#' + element).append('<h1 align="center" style="padding-top: 100px">No data available</h1>');
        }

    }

    // Get Loss Rate by Edge Node report data
    function    get_loss_rate_by_edge_node_report_data() {
        $('#edge-node-loss').empty();
        $('#edge-node-loss').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/loss-rate-by-edge-node-report-data.json?selected_date=' + lossDate + '&provider=' + lossProvider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( loss_rate_by_edge_node_report_data ) {

                    display_loss_rate_by_edge_node_report_data( loss_rate_by_edge_node_report_data );

                    loss_rate_by_edge_node_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Latency Rate by Edge Node report data
    function    get_latency_rate_by_edge_node_report_data() {
        $('#edge-node-latency').empty();
        $('#edge-node-latency').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/latency-rate-by-edge-node-report-data.json?selected_date=' + latencyDate + '&provider=' + latencyProvider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( latency_rate_by_edge_node_report_data ) {

                    display_latency_rate_by_edge_node_report_data( latency_rate_by_edge_node_report_data );

                    latency_rate_by_edge_node_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Jitter Rate by Edge Node report data
    function    get_jitter_rate_by_edge_node_report_data() {
        $('#edge-node-jitter').empty();
        $('#edge-node-jitter').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/jitter-rate-by-edge-node-report-data.json?selected_date=' + jitterDate + '&provider=' + jitterProvider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( jitter_rate_by_edge_node_report_data ) {

                    display_jitter_rate_by_edge_node_report_data( jitter_rate_by_edge_node_report_data );

                    jitter_rate_by_edge_node_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Display Loss Rate by Edge Node report data
    function    display_loss_rate_by_edge_node_report_data( data ) {

        // Draw the chart itself
        createLineChart( 'edge-node-loss', data );

        return;
    }

    // Display Latency Rate by Edge Node report data
    function    display_latency_rate_by_edge_node_report_data( data ) {

        // Draw the chart itself
        createLineChart( 'edge-node-latency', data );

        return;
    }

    // Display Jitter Rate by Edge Node report data
    function    display_jitter_rate_by_edge_node_report_data( data ) {

        // Draw the chart itself
        createLineChart( 'edge-node-jitter', data );

        return;
    }

    // Get Edge Node reports data
    function    get_reports_data() {

        // Get Loss Rate by Edge Node report data
        get_loss_rate_by_edge_node_report_data();

        // Get Latency Rate by Edge Node report data
        get_latency_rate_by_edge_node_report_data();

        // Get Jatency Rate by Edge Node report data
        get_jitter_rate_by_edge_node_report_data();

        // Clear the previous timeout ID
        if( timeoutEventID != null ) {

            clearTimeout( timeoutEventID );

        }

        // Set the callback again
        timeoutEventID = setTimeout( get_reports_data, get_reports_data_interval );

        return;
    }


    function get_providers() {

        $.ajax(

            {

                url: '/cnep/ajax/providers.json',

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( providers_data ) {

                    display_providers( providers_data );

                    providers_data = null;

                    return;
                }

            }

        );

    }

    function    display_providers( data ) {

        for(var i=0; i < data.length; i++ ) {

            if(data[i].provider !== 'default') {
                $("#latency-provider").append("<option>" + data[i].provider + "</option>");
                $("#loss-provider").append("<option>" + data[i].provider + "</option>");
                $("#jitter-provider").append("<option>" + data[i].provider + "</option>");
            }
        }


    }

    function    filter() {

        get_providers();

        var today = new Date();
        document.getElementById("latency-date-start").value = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("latency-date-end").value   = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("loss-date-start").value    = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("loss-date-end").value      = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("jitter-date-start").value  = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("jitter-date-end").value    = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("pdf-date-start").value     = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("pdf-date-end").value       = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();


        latencyDate = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        lossDate    = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        jitterDate  = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        pdfDate     = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        today.setDate(today.getDate()+1);
        latencyDate += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        lossDate    += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        jitterDate  += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        pdfDate     += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();


        //Create new chart whenever the date filter is changed
        $('#latency-datepicker-start').datepicker().on('changeDate', function(ev) {
            latencyDate = document.getElementById("latency-date-start").value + ',' + document.getElementById("latency-date-end").value;
            $('#latency-datepicker-start').datepicker('hide');
            get_latency_rate_by_edge_node_report_data();
        });
        $('#latency-datepicker-end').datepicker().on('changeDate', function(ev) {
            latencyDate = document.getElementById("latency-date-start").value + ',' + document.getElementById("latency-date-end").value;
            $('#latency-datepicker-end').datepicker('hide');
            get_latency_rate_by_edge_node_report_data();
        });

        $('#loss-datepicker-start').datepicker().on('changeDate', function(ev) {
            lossDate = document.getElementById("loss-date-start").value + ',' + document.getElementById("loss-date-end").value;
            $('#loss-datepicker-start').datepicker('hide');
            get_loss_rate_by_edge_node_report_data();
        });
        $('#loss-datepicker-end').datepicker().on('changeDate', function(ev) {
            lossDate = document.getElementById("loss-date-start").value + ',' + document.getElementById("loss-date-end").value;
            $('#loss-datepicker-end').datepicker('hide');
            get_loss_rate_by_edge_node_report_data();
        });

        $('#jitter-datepicker-start').datepicker().on('changeDate', function(ev) {
            jitterDate = document.getElementById("jitter-date-start").value + ',' + document.getElementById("jitter-date-end").value;
            $('#jitter-datepicker-start').datepicker('hide');
            get_jitter_rate_by_edge_node_report_data();
        });
        $('#jitter-datepicker-end').datepicker().on('changeDate', function(ev) {
            jitterDate = document.getElementById("jitter-date-start").value + ',' + document.getElementById("jitter-date-end").value;
            $('#jitter-datepicker-end').datepicker('hide');
            get_jitter_rate_by_edge_node_report_data();
        });

        $('#pdf-datepicker-start').datepicker().on('changeDate', function(ev) {
            pdfDate = document.getElementById("pdf-date-start").value + ',' + document.getElementById("pdf-date-end").value;
            $('#pdf-datepicker-start').datepicker('hide');
        });
        $('#pdf-datepicker-end').datepicker().on('changeDate', function(ev) {
            pdfDate = document.getElementById("pdf-date-start").value + ',' + document.getElementById("pdf-date-end").value;
            $('#pdf-datepicker-end').datepicker('hide');
        });

        $('.latency-button').click(function() {
            if ($('#latency-desc').is(':visible')) {
                $('#latency-desc').slideToggle(600);
            }
            $('#latency-div').slideToggle(600);
        });

        $('.latency-desc-button').click(function() {
            if ($('#latency-div').is(':visible')) {
                $('#latency-div').slideToggle(600);
            }
            $('#latency-desc').slideToggle(600);

        });

        $('.loss-button').click(function() {
            if ($('#loss-desc').is(':visible')) {
                $('#loss-desc').slideToggle(600);
            }
            $('#loss-div').slideToggle(600);
        });

        $('.loss-desc-button').click(function() {
            if ($('#loss-div').is(':visible')) {
                $('#loss-div').slideToggle(600);
            }
            $('#loss-desc').slideToggle(600);

        });

        $('.jitter-button').click(function() {
            if ($('#jitter-desc').is(':visible')) {
                $('#jitter-desc').slideToggle(600);
            }
            $('#jitter-div').slideToggle(600);
        });

        $('.jitter-desc-button').click(function() {
            if ($('#jitter-div').is(':visible')) {
                $('#jitter-div').slideToggle(600);
            }
            $('#jitter-desc').slideToggle(600);

        });


        $("#latency-provider").change(function () {
            latencyProvider = $("#latency-provider option:selected").text();
            get_latency_rate_by_edge_node_report_data();
        });

        $("#loss-provider").change(function () {
            lossProvider = $("#loss-provider option:selected").text();
            get_loss_rate_by_edge_node_report_data();
        });

        $("#jitter-provider").change(function () {
            jitterProvider = $("#jitter-provider option:selected").text();
            get_jitter_rate_by_edge_node_report_data();
        });

        $('#download-pdf').click(function () {
            $('#pdf-div').slideToggle(600);
        });

        $('#download-pdf-button').click(function () {
            window.location.assign('/cnep/ajax/render_pdf?requested_page=edge-nodes&selected_date=' + pdfDate);
        });

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


                filter();

                $.ajax({
                    url: '//www.google.com/jsapi',
                    dataType: 'script',

                    success: function() {
                        google.load('visualization', '1', {
                            'packages': ['corechart'],
                            'callback': get_reports_data()
                        });
                    }
                });

                // Clear the previous timeout ID
                if( timeoutEventID != null ) {

                    clearTimeout( timeoutEventID );

                }

                // Set new time for the edge nodes reports data
                timeoutEventID = setTimeout( get_reports_data, get_reports_data_interval );

                return;
            }
        );

        return;
    })();

}).call( this, document, jQuery );
