/**
 * This script is used for show data for Distance and Speed reports page
 */

( function () {

    // Display agents distance and speed report table
    function    show_agents_distance_and_speed_report_table() {

        $( '#agentDistanceAndSpeedReportTable' ).dataTable();

        $( '#agentDistanceAndSpeedReportTable' ).on(
            'click',
            'tr',
            function( e ) {

                $( '#agentDistanceAndSpeedReportTable' ).find( 'tr.highlight' ).removeClass( 'highlight' );

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

                // Display agents distance and speed report table
                show_agents_distance_and_speed_report_table();

                return;
            }

        );

        return;
    })();

    return;
} ).call( this );
