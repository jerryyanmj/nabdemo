/**
 * This script is used for show data for Edge Node reports page
 */

var selectedDate = location.search.split('time=')[1];


( function( document, $ ) {


    function   createLineChart(element, data) {


        var dataTable = new google.visualization.DataTable(data);

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

    // Get Loss Rate by Edge Node report data
    function    get_loss_rate_by_edge_node_report_data() {

        $.ajax(

            {

                url: '/cnep/ajax/loss-rate-by-edge-node-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/latency-rate-by-edge-node-report-data.json?selected_date=' + selectedDate,

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

        $.ajax(

            {

                url: '/cnep/ajax/jitter-rate-by-edge-node-report-data.json?selected_date=' + selectedDate,

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
