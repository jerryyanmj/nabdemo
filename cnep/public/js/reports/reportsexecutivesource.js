/**
 * This script is used for show data for Executive Source reports page
 */

( function( document, $ ) {


    var get_reports_data_interval = 600000; //10 minutes
    var timeoutEventID       = null;
    var latencyDate          = '',
        lossDate             = '',
        jitterDate           = '',
        latency5Date         = '',
        loss5Date            = '',
        jitter5Date          = '',
        distanceDate         = '',
        downloadDate         = '',
        uploadDate           = '',
        pdfDate              = '',
        latencyProvider      = 'default',
        lossProvider         = 'default',
        jitterProvider       = 'default',
        latency5Provider     = 'default',
        loss5Provider        = 'default',
        jitter5Provider      = 'default',
        distanceProvider     = 'default',
        downloadProvider     = 'default',
        uploadProvider       = 'default',
        pdfProvider          = 'default';

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

        if(element == 'national-latency') {
            vTitle = 'Avg Latency';
            hTitle = 'Collector Time';
        }

        if(element == 'national-loss') {
            vTitle = 'Avg Loss';
            hTitle = 'Collector Time';
        }

        if(element == 'national-jitter') {
            vTitle = 'Avg Jitter';
            hTitle = 'Collector Time';
        }

        if(element == 'market-bandwidth') {
            vTitle = 'Bandwidth (Download)';
            hTitle = 'Collector Time';
        }

        if(element == 'distance-speed') {
            vTitle = 'Avg Speed';
            hTitle = 'Distance';
        }


        var options = {

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
	          	height: 280,
       	        	width: 1020,
                 	left: 30,
            	top: 25
      	        },

                lineWidth: 3,
                pointSize: 7

        };

		

        if(data["rows"].length > 0) {
            var chart = new google.visualization.LineChart(document.getElementById(element));
            $('#' + element).empty();
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

                url: '/cnep/ajax/latency-rate-by-market-report-data.json?selected_date=' + latencyDate + '&provider=' + latencyProvider,

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

                url: '/cnep/ajax/loss-rate-by-market-report-data.json?selected_date=' + lossDate + '&provider=' + lossProvider,

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

                url: '/cnep/ajax/jitter-rate-by-market-report-data.json?selected_date=' + jitterDate + '&provider=' + jitterProvider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( jitter_rate_by_market_report_data ) {

                    display_jitter_rate_by_market_report_data( jitter_rate_by_market_report_data);

                    jitter_rate_by_market_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Avg. Speed By Distance report data
    function    get_avg_speed_by_distance_report_data() {

        $.ajax(

            {

                url: '/cnep/ajax/avg-speed-by-distance-report-data.json?selected_date=' + distanceDate + '&provider=' + distanceProvider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( avg_speed_by_distance_report_data ) {

                    display_avg_speed_by_distance_report_data( avg_speed_by_distance_report_data );

                    avg_speed_by_distance_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Bandwidth(Download) by Market report data
    function    get_bandwidth_download_by_market_report_data() {
        $('#market-download').empty();
        $('#market-download').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/bandwidth-download-by-market-report-data.json?selected_date=' + downloadDate + '&provider=' + downloadProvider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( bandwidth_download_by_market_report_data ) {

                    display_bandwidth_download_by_market_report_data( bandwidth_download_by_market_report_data );

                    bandwidth_download_by_market_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Bandwidth(Upload) by Market report data
    function    get_bandwidth_upload_by_market_report_data() {
        $('#market-upload').empty();
        $('#market-upload').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/bandwidth-upload-by-market-report-data.json?selected_date=' + uploadDate + '&provider=' + uploadProvider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( bandwidth_upload_by_market_report_data ) {

                    display_bandwidth_upload_by_market_report_data( bandwidth_upload_by_market_report_data );

                    bandwidth_upload_by_market_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Latency Rate vs 5 day Avg. report data
    function    get_latency_rate_national_report_data() {

        $('#national-latency').empty();
        $('#national-latency').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');


        $.ajax(

            {

                url: '/cnep/ajax/latency-rate-national-report-data.json?selected_date=' + latency5Date + '&provider=' + latency5Provider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( latency_rate_national_report_data ) {

                    display_latency_rate_national_report_data( latency_rate_national_report_data );

                    latency_rate_national_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Loss Rate vs 5 day Avg. report data
    function    get_loss_rate_national_report_data() {
        $('#national-loss').empty();
        $('#national-loss').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/loss-rate-national-report-data.json?selected_date=' + loss5Date + '&provider=' + loss5Provider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( loss_rate_national_report_data ) {

                    display_loss_rate_national_report_data( loss_rate_national_report_data );

                    loss_rate_national_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Get Jitter Rate vs 5 day Avg. report data
    function    get_jitter_rate_national_report_data() {
        $('#national-jitter').empty();
        $('#national-jitter').append('<img style="padding-top: 100px; padding-left: 550px" src="/cnep/imgs/loading.gif">');

        $.ajax(

            {

                url: '/cnep/ajax/jitter-rate-national-report-data.json?selected_date=' + jitter5Date + '&provider=' + jitter5Provider,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( jitter_rate_national_report_data ) {

                    display_jitter_rate_national_report_data( jitter_rate_national_report_data );

                    jitter_rate_national_report_data = null;

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

    // Display Avg. Speed By Distance report data
    function    display_avg_speed_by_distance_report_data( data ) {

        // Draw the chart itself
        createLineChart('distance-speed', data);

        return;
    }

    // Display Bandwidth (Download) by Market report data
    function    display_bandwidth_download_by_market_report_data( data ) {

        // Draw the chart itself
        createLineChart('market-download', data);

        return;
    }

    // Display Bandwidth (Upload) by Market report data
    function    display_bandwidth_upload_by_market_report_data( data ) {

        // Draw the chart itself
        createLineChart('market-upload', data);

        return;
    }

    // Display Latency Rate vs 5 day Avg. report data
    function    display_latency_rate_national_report_data( data ) {

        // Draw the chart itself
        createLineChart('national-latency', data);

        return;
    }

    // Display Loss Rate vs 5 day Avg. report data
    function    display_loss_rate_national_report_data( data ) {

        // Draw the chart itself
        createLineChart('national-loss', data);

        return;
    }

    // Display Jitter Rate vs 5 day Avg. report data
    function    display_jitter_rate_national_report_data( data ) {

        // Draw the chart itself
        createLineChart('national-jitter', data);

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

        // Get Avg. Speed By Distance report data
        //get_avg_speed_by_distance_report_data();

        // Get Bandwidth (Download) by Market report data
        get_bandwidth_download_by_market_report_data();

        // Get Bandwidth (Upload) by Market report data
        get_bandwidth_upload_by_market_report_data();

        // Get Latency Rate vs 5 day Avg. report data
        get_latency_rate_national_report_data();

        // Get Loss Rate vs 5 day Avg. report data
        get_loss_rate_national_report_data();

        // Get Jitter Rate vs 5 day Avg. report data
        get_jitter_rate_national_report_data();

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
        document.getElementById("latency-date-start").value  = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("latency-date-end").value    = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("loss-date-start").value     = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("loss-date-end").value       = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("jitter-date-start").value   = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("jitter-date-end").value     = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("latency5-date-start").value = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("latency5-date-end").value   = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("loss5-date-start").value    = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("loss5-date-end").value      = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("jitter5-date-start").value  = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("jitter5-date-end").value    = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        //document.getElementById("distance-date-start").value = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        //document.getElementById("distance-date-end").value   = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("download-date-end").value   = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("upload-date-end").value     = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("pdf-date-start").value      = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("pdf-date-end").value        = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();


        latencyDate  = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        lossDate     = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        jitterDate   = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        latency5Date = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        loss5Date    = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        jitter5Date  = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        distanceDate = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        pdfDate      = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();


        today.setDate(today.getDate()+1);

        latencyDate  += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        lossDate     += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        jitterDate   += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        latency5Date += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        loss5Date    += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        jitter5Date  += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        distanceDate += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        pdfDate      += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();

        today.setDate(today.getDate()-11);
        downloadDate = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        uploadDate = (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("download-date-start").value = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();
        document.getElementById("upload-date-start").value = (today.getMonth() +1) + '-' + today.getDate() + '-' + today.getFullYear();

        today.setDate(today.getDate()+11);
        downloadDate += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();
        uploadDate += ',' + (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear();



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

        $('#latency5-datepicker-start').datepicker().on('changeDate', function(ev) {
            latency5Date = document.getElementById("latency5-date-start").value + ',' + document.getElementById("latency5-date-end").value;
            $('#latency5-datepicker-start').datepicker('hide');
            get_latency_rate_national_report_data();
        });
        $('#latency5-datepicker-end').datepicker().on('changeDate', function(ev) {
            latency5Date = document.getElementById("latency5-date-start").value + ',' + document.getElementById("latency5-date-end").value;
            $('#latency5-datepicker-end').datepicker('hide');
            get_latency_rate_national_report_data();
        });

        $('#loss5-datepicker-start').datepicker().on('changeDate', function(ev) {
            loss5Date = document.getElementById("loss5-date-start").value + ',' + document.getElementById("loss5-date-end").value;
            $('#loss5-datepicker-start').datepicker('hide');
            get_loss_rate_national_report_data();
        });
        $('#loss5-datepicker-end').datepicker().on('changeDate', function(ev) {
            loss5Date = document.getElementById("loss5-date-start").value + ',' + document.getElementById("loss5-date-end").value;
            $('#loss5-datepicker-end').datepicker('hide');
            get_loss_rate_national_report_data();
        });

        $('#jitter5-datepicker-start').datepicker().on('changeDate', function(ev) {
            jitter5Date = document.getElementById("jitter5-date-start").value + ',' + document.getElementById("jitter5-date-end").value;
            $('#jitter5-datepicker-start').datepicker('hide');
            get_jitter_rate_national_report_data();
        });
        $('#jitter5-datepicker-end').datepicker().on('changeDate', function(ev) {
            jitter5Date = document.getElementById("jitter5-date-start").value + ',' + document.getElementById("jitter5-date-end").value;
            $('#jitter5-datepicker-end').datepicker('hide');
            get_jitter_rate_national_report_data();
        });

        //$('#distance-datepicker-start').datepicker().on('changeDate', function(ev) {
        //    distanceDate = document.getElementById("distance-date-start").value + ',' + document.getElementById("distance-date-end").value;
        //    $('#distance-datepicker-start').datepicker('hide');
        //    get_avg_speed_by_distance_report_data();
        //});
        //$('#distance-datepicker-end').datepicker().on('changeDate', function(ev) {
        //    distanceDate = document.getElementById("distance-date-start").value + ',' + document.getElementById("distance-date-end").value;
        //    $('#distance-datepicker-end').datepicker('hide');
        //    get_avg_speed_by_distance_report_data();
        //});

        $('#download-datepicker-start').datepicker().on('changeDate', function(ev) {
            downloadDate = document.getElementById("download-date-start").value + ',' + document.getElementById("download-date-end").value;
            $('#download-datepicker-start').datepicker('hide');
            get_bandwidth_download_by_market_report_data();
        });
        $('#download-datepicker-end').datepicker().on('changeDate', function(ev) {
            downloadDate = document.getElementById("download-date-start").value + ',' + document.getElementById("download-date-end").value;
            $('#download-datepicker-end').datepicker('hide');
            get_bandwidth_download_by_market_report_data();
        });

        $('#upload-datepicker-start').datepicker().on('changeDate', function(ev) {
            uploadDate = document.getElementById("upload-date-start").value + ',' + document.getElementById("upload-date-end").value;
            $('#upload-datepicker-start').datepicker('hide');
            get_bandwidth_upload_by_market_report_data();
        });
        $('#upload-datepicker-end').datepicker().on('changeDate', function(ev) {
            uploadDate = document.getElementById("upload-date-start").value + ',' + document.getElementById("upload-date-end").value;
            $('#upload-datepicker-end').datepicker('hide');
            get_bandwidth_upload_by_market_report_data();
        });

        $('#pdf-datepicker-start').datepicker().on('changeDate', function(ev) {
            pdfDate = document.getElementById("pdf-date-start").value + ',' + document.getElementById("pdf-date-end").value;
            $('#pdf-datepicker-start').datepicker('hide');
        });
        $('#pdf-datepicker-end').datepicker().on('changeDate', function(ev) {
            pdfDate = document.getElementById("pdf-date-start").value + ',' + document.getElementById("pdf-date-end").value;
            $('#pdf-datepicker-end').datepicker('hide');
        });

        $('.latency5-button').click(function() {
            if ($('#latency5-desc').is(':visible')) {
                $('#latency5-desc').slideToggle(600);
            }
            $('#latency5-div').slideToggle(600);
        });

        $("#latency5-provider").change(function () {
            latency5Provider = $("#latency5-provider option:selected").text();
            get_latency_rate_national_report_data();
        });

        $("#loss5-provider").change(function () {
            loss5Provider = $("#loss5-provider option:selected").text();
            get_loss_rate_national_report_data();
        });

        $("#jitter5-provider").change(function () {
            jitter5Provider = $("#jitter5-provider option:selected").text();
            get_jitter_rate_national_report_data();
        });

        $("#latency-provider").change(function () {
            latencyProvider = $("#latency-provider option:selected").text();
            get_latency_rate_by_market_report_data();
        });

        $("#loss-provider").change(function () {
            lossProvider = $("#loss-provider option:selected").text();
            get_loss_rate_by_market_report_data();
        });

        $("#jitter-provider").change(function () {
            jitterProvider = $("#jitter-provider option:selected").text();
            get_jitter_rate_by_market_report_data();
        });

        $("#download-provider").change(function () {
            downloadProvider = $("#download-provider option:selected").text();
            get_bandwidth_download_by_market_report_data();
        });

        $("#upload-provider").change(function () {
            uploadProvider = $("#upload-provider option:selected").text();
            get_bandwidth_upload_by_market_report_data();
        });

        $('.latency5-desc-button').click(function() {
            if ($('#latency5-div').is(':visible')) {
                $('#latency5-div').slideToggle(600);
            }
            $('#latency5-desc').slideToggle(600);

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

        $('.loss5-button').click(function() {
            if ($('#loss5-desc').is(':visible')) {
                $('#loss5-desc').slideToggle(600);
            }
            $('#loss5-div').slideToggle(600);
        });

        $('.loss5-desc-button').click(function() {
            if ($('#loss5-div').is(':visible')) {
                $('#loss5-div').slideToggle(600);
            }
            $('#loss5-desc').slideToggle(600);

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

        $('.jitter5-button').click(function() {
            if ($('#jitter5-desc').is(':visible')) {
                $('#jitter5-desc').slideToggle(600);
            }
            $('#jitter5-div').slideToggle(600);
        });

        $('.jitter5-desc-button').click(function() {
            if ($('#jitter5-div').is(':visible')) {
                $('#jitter5-div').slideToggle(600);
            }
            $('#jitter5-desc').slideToggle(600);

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

        $('.download-button').click(function() {
            if ($('#download-desc').is(':visible')) {
                $('#download-desc').slideToggle(600);
            }
            $('#download-div').slideToggle(600);
        });

        $('.download-desc-button').click(function() {
            if ($('#download-div').is(':visible')) {
                $('#download-div').slideToggle(600);
            }
            $('#download-desc').slideToggle(600);

        });

        $('.upload-button').click(function() {
            if ($('#upload-desc').is(':visible')) {
                $('#upload-desc').slideToggle(600);
            }
            $('#upload-div').slideToggle(600);
        });

        $('.upload-desc-button').click(function() {
            if ($('#upload-div').is(':visible')) {
                $('#upload-div').slideToggle(600);
            }
            $('#upload-desc').slideToggle(600);

        });

        //$('.distance-button').click(function() {
        //    if ($('#distance-desc').is(':visible')) {
        //        $('#distance-desc').slideToggle(600);
        //    }
        //    $('#distance-div').slideToggle(600);
        //});
        //
        //$('.distance-desc-button').click(function() {
        //    if ($('#distance-div').is(':visible')) {
        //        $('#distance-div').slideToggle(600);
        //    }
        //    $('#distance-desc').slideToggle(600);
        //
        //});


        

		$('#download-pdf').click(function () {
            $('#pdf-div').slideToggle(600);
		});

        $('#download-pdf-button').click(function () {
            window.location.assign('/cnep/ajax/render_pdf?requested_page=executive-source&selected_date=' + pdfDate);
        });




        
        
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
                $("#latency5-provider").append("<option>" + data[i].provider + "</option>");
                $("#loss5-provider").append("<option>" + data[i].provider + "</option>");
                $("#jitter5-provider").append("<option>" + data[i].provider + "</option>");
                $("#latency-provider").append("<option>" + data[i].provider + "</option>");
                $("#loss-provider").append("<option>" + data[i].provider + "</option>");
                $("#jitter-provider").append("<option>" + data[i].provider + "</option>");
                $("#download-provider").append("<option>" + data[i].provider + "</option>");
                $("#upload-provider").append("<option>" + data[i].provider + "</option>");
            }
        }


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


                get_providers();
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
