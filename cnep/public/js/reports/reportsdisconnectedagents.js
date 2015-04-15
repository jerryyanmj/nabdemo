/**
 * This script is used for show data for Disconnected Agents reports page
 */

( function () {

    // Display disconnected agents report table
    function    show_disconnected_agents_report_table() {

        $( '#disconnectedAgentsReportTable' ).dataTable();

        $( '#disconnectedAgentsReportTable' ).on(
            'click',
            'tr',
            function( e ) {

                $( '#disconnectedAgentsReportTable' ).find( 'tr.highlight' ).removeClass( 'highlight' );

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

                // Display disconnected agents report table
                show_disconnected_agents_report_table();

                return;
            }

        );

        return;
    })();

    return;
} ).call( this );
