/**
 * This script is used for show data for Jitter reports page
 */

( function () {

    // Display agents historical jitter report table
    function    show_agents_historical_jitter_report_table() {

        $( '#agentHistoricalJitterReportTable' ).dataTable();

        $( '#agentHistoricalJitterReportTable' ).on(
            'click',
            'tr',
            function( e ) {

                $( '#agentHistoricalJitterReportTable' ).find( 'tr.highlight' ).removeClass( 'highlight' );

                $( this ).addClass( 'highlight' );

                return;
            }
        );
    
        return;
    }

    // Display agents top 10 worst sources jitter report table
    function    show_top_ten_worst_sources_jitter_report_table() {

        $( '#agentTopTenWorstSourcesJitterReportTable' ).dataTable();

        $( '#agentTopTenWorstSourcesJitterReportTable' ).on(
            'click',
            'tr',
            function( e ) {

                $( '#agentTopTenWorstSourcesJitterReportTable' ).find( 'tr.highlight' ).removeClass( 'highlight' );

                $( this ).addClass( 'highlight' );

                return;
            }
        );
    
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

                // Display agents historical jitter report table
                show_agents_historical_jitter_report_table();

                // Display agents top 10 worst sources jitter report table
                show_top_ten_worst_sources_jitter_report_table();

                return;
            }

        );

        return;
    })();

    return;
} ).call( this );
