/**
 * This script is used for show data for Executive Source reports page
 */

( function( document, $ ) {

    var selectedDate = location.search.split('time=')[1];


    function createLineChart(element, data) {


        console.log(data);

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
            backgroundColor: {
                fill: 'transparent'
            },
            interpolateNulls: true,
            vAxis: {
                title: vTitle,
                titleTextStyle: {
                    color: 'black',
                    italic: false,
                    fontSize: '4',
                    bold: true
                },
                baselineColor: 'black',
                textStyle: {
                    fontSize: '10',
                    color: 'black'
                }
            },

            hAxis: {
                title: hTitle,
                titleTextStyle: {
                    color: 'black',
                    italic: false,
                    bold:true
                },
                baselineColor: 'black',
                textStyle: {
                    fontSize: '10',
                    color: 'black'
                }
            },
            axisTitlesPosition: 'none',
            legend: {
                textStyle: {
                    fontSize: '11',
                    color: 'black'
                }
            },
            chartArea: {
                width: 1020,
                left: 30,
                top: 25
            },
            lineWidth: 3,
            pointSize: 7

        };


        var chart = new google.visualization.LineChart(document.getElementById(element));

        chart.draw(dataTable, options);

    }

    // Get Latency Rate by Market report data
    function    get_latency_rate_by_market_report_data() {

        $.ajax(

            {

                url: '/cnep/ajax/latency-rate-by-market-report-data.json?selected_date=' + selectedDate,

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( latency_rate_by_market_report_data ) {

                    //console.log( latency_rate_by_market_report_data );

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

        $.ajax(

            {

                url: '/cnep/ajax/loss-rate-by-market-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/jitter-rate-by-market-report-data.json?selected_date=' + selectedDate,

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

    // Get Avg. Speed By Distance report data
    function    get_avg_speed_by_distance_report_data() {

        $.ajax(

            {

                url: '/cnep/ajax/avg-speed-by-distance-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/bandwidth-download-by-market-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/bandwidth-upload-by-market-report-data.json?selected_date=' + selectedDate,

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



        $.ajax(

            {

                url: '/cnep/ajax/latency-rate-national-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/loss-rate-national-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/jitter-rate-national-report-data.json?selected_date=' + selectedDate,

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


        console.log(data);
        // Draw the chart
        //$.plot($("#market-latency"), data, options);
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
        get_avg_speed_by_distance_report_data();

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


        return;
    }



    // Entry point
    ( function main() {

        $( document ).ready(

            function() {

                //Disable any caching for this page
                $.ajaxSetup(
                    {
                        cache: false
                    }
                );



                get_reports_data();



            }
        );

        return;
    })();

}).call( this, document, jQuery);
