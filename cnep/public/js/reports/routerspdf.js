/**
 * Created by janis on 10/29/14.
 */
/**
 * This script is used for show data for Executive Source reports page
 */

( function( document, $ ) {

    var selectedDate = location.search.split('time=')[1];



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

                url: '/cnep/ajax/routers-latency-rate-by-market-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/routers-loss-rate-by-market-report-data.json?selected_date=' + selectedDate,

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

                url: '/cnep/ajax/routers-jitter-rate-by-market-report-data.json?selected_date=' + selectedDate,

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

                get_reports_data();

                return;
            }
        );

        return;
    })();

}).call( this, document, jQuery );
