/**
 * This script is used for show data for Latency, Loss reports page
 */

( function () {

    // Display agents historical latency report table
    function    show_agents_historical_latency_report_table() {

        $( '#agentHistoricalLatencyReportTable' ).dataTable();

        $( '#agentHistoricalLatencyReportTable' ).on(
            'click',
            'tr',
            function( e ) {

                $( '#agentHistoricalLatencyReportTable' ).find( 'tr.highlight' ).removeClass( 'highlight' );

                $( this ).addClass( 'highlight' );

                return;
            }
        );
    
        return;
    }

    // Display agents historical loss report table
    function    show_agents_historical_loss_report_table() {

        $( '#agentHistoricalLossReportTable' ).dataTable();

        $( '#agentHistoricalLossReportTable' ).on(
            'click',
            'tr',
            function( e ) {

                $( '#agentHistoricalLossReportTable' ).find( 'tr.highlight' ).removeClass( 'highlight' );

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

                // Display agents historical latency report table
                show_agents_historical_latency_report_table();

                // Display agents historical loss report table
                show_agents_historical_loss_report_table();

                return;
            }

        );

        return;
    })();

    return;
} ).call( this );
