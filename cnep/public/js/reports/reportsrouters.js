/**
 * Created by janis on 10/29/14.
 */
/**
 * This script is used for show data for Executive Source reports page
 */

( function( document, $ ) {

    var get_reports_data_interval = 600000; //10 minutes
    var timeoutEventID = null;
    var latencyDate          = '',
        lossDate             = '',
        jitterDate           = '',
        pdfDate              = '',
        latencyProvider      = 'Time Warner Cable',
        lossProvider         = 'Time Warner Cable',
        jitterProvider       = 'Time Warner Cable';


    function createLineChart(element, data) {


        var dataTable = new google.visualization.DataTable(data);

        dataTable.sort(0);
        var vTitle = '';
        var hTitle = '';

        if(element == 'market-latency') {
            vTitle = 'Avg Latency';
            hTitle = 'Collector Time';
        }

        if(element == 'market-loss') {
            vTitle = 'Avg Loss';
            hTitle = 'Collector Time';
        }

        if(element == 'market-jitter') {
            vTitle = 'Avg Jitter';
            hTitle = 'Collector Time';
        }


        var options = {
	height: 520,
            crosshair: {
                trigger: 'both'
            },
            backgroundColor: {
                fill: 'transparent'
            },
            interpolateNulls: true,
            tooltip: {
                textStyle: {color: 'black'}
            },
            vAxis: {
                title: vTitle,
                titleTextStyle: {
                    color: 'white',
                    italic: false,
                    fontSize: '4',
                    bold: true
                },
                baselineColor: 'white',
                gridlines: {
                    color: 'transparent'
                },
                textStyle: {
                    fontSize: '10',
                    color: 'white'
                }
            },

            hAxis: {
                title: hTitle,
                titleTextStyle: {
                    color: 'white',
                    italic: false,
                    bold:true
                },
                baselineColor: 'white',
                gridlines: {
                    color: 'transparent'
                },
                textStyle: {
                    fontSize: '10',
                    color: 'white'
                }
            },
            axisTitlesPosition: 'none',
            legend: {
                textStyle: {
                    fontSize: '11',
                    color: 'white'
                }
            },
            chartArea: {
                height: 290,
                width: 1030,
                left: 30,
                top: 10
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

    // Get Latency Rate by Market report data
    function    get_latency_rate_by_market_report_data() {
        $('#market-latency').empty();
        $('#market-latency').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/routers-latency-rate-by-market-report-data.json?selected_date=' + latencyDate,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( latency_rate_by_market_report_data ) {

                    display_latency_rate_by_market_report_data( latency_rate_by_market_report_data );

                    latency_rate_by_market_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Loss Rate by Market report data
    function    get_loss_rate_by_market_report_data() {
        $('#market-loss').empty();
        $('#market-loss').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/routers-loss-rate-by-market-report-data.json?selected_date=' + lossDate,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( loss_rate_by_market_report_data ) {

                    display_loss_rate_by_market_report_data( loss_rate_by_market_report_data );

                    loss_rate_by_market_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Jitter Rate by Market report data
    function    get_jitter_rate_by_market_report_data() {
        $('#market-jitter').empty();
        $('#market-jitter').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/routers-jitter-rate-by-market-report-data.json?selected_date=' + jitterDate,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( jitter_rate_by_market_report_data ) {

                    display_jitter_rate_by_market_report_data( jitter_rate_by_market_report_data );

                    jitter_rate_by_market_report_data = null;

                    return;
                }

            }

        );

        return;
    }



    // Display Latency Rate by Market report data
    function    display_latency_rate_by_market_report_data( data ) {

        // Draw the chart itself
        createLineChart('market-latency', data);

        return;
    }

    // Display Loss Rate by Market report data
    function    display_loss_rate_by_market_report_data( data ) {

        // Draw the chart itself
        createLineChart('market-loss', data);

        return;
    }

    // Display Jitter Rate by Market report data
    function    display_jitter_rate_by_market_report_data( data ) {

        // Draw the chart itself
        createLineChart('market-jitter', data);

        return;
    }




    // Get reports data
    function    get_reports_data() {


        // Get Latency Rate by market report data
        get_latency_rate_by_market_report_data();

        // Get Loss Rate by market report data
        get_loss_rate_by_market_report_data();

        // Get Jitter Rate by market report data
        get_jitter_rate_by_market_report_data();



        // Clear the previous timeout ID
        if( timeoutEventID != null ) {

            clearTimeout( timeoutEventID );

        }

        // Set the callback again
        timeoutEventID = setTimeout( get_reports_data, get_reports_data_interval );

        return;
    }


    //Create chart filters
    function    filter() {


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
            get_latency_rate_by_market_report_data();
        });
        $('#latency-datepicker-end').datepicker().on('changeDate', function(ev) {
            latencyDate = document.getElementById("latency-date-start").value + ',' + document.getElementById("latency-date-end").value;
            $('#latency-datepicker-end').datepicker('hide');
            get_latency_rate_by_market_report_data();
        });

        $('#loss-datepicker-start').datepicker().on('changeDate', function(ev) {
            lossDate = document.getElementById("loss-date-start").value + ',' + document.getElementById("loss-date-end").value;
            $('#loss-datepicker-start').datepicker('hide');
            get_loss_rate_by_market_report_data();
        });
        $('#loss-datepicker-end').datepicker().on('changeDate', function(ev) {
            lossDate = document.getElementById("loss-date-start").value + ',' + document.getElementById("loss-date-end").value;
            $('#loss-datepicker-end').datepicker('hide');
            get_loss_rate_by_market_report_data();
        });

        $('#jitter-datepicker-start').datepicker().on('changeDate', function(ev) {
            jitterDate = document.getElementById("jitter-date-start").value + ',' + document.getElementById("jitter-date-end").value;
            $('#jitter-datepicker-start').datepicker('hide');
            get_jitter_rate_by_market_report_data();
        });
        $('#jitter-datepicker-end').datepicker().on('changeDate', function(ev) {
            jitterDate = document.getElementById("jitter-date-start").value + ',' + document.getElementById("jitter-date-end").value;
            $('#jitter-datepicker-end').datepicker('hide');
            get_jitter_rate_by_market_report_data();
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

        $('#download-pdf').click(function () {
            $('#pdf-div').slideToggle(600);
        });

        $('#download-pdf-button').click(function () {
            window.location.assign('/cnep/ajax/render_pdf?requested_page=routers&selected_date=' + pdfDate);
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

                // Set new time for the reports data
                timeoutEventID = setTimeout( get_reports_data, get_reports_data_interval );

                return;
            }
        );

        return;
    })();

}).call( this, document, jQuery );
