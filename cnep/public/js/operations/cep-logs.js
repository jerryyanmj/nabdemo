/**
 * This script is used for show data for CEP logs page
 */

( function () {

    // Logs hashmap
    var cep_log_hashmap = {};

    // raw_mtr_queue key from monit table, Redis storage
    var raw_mtr_queue_key = "raw_mtr_queue";

    var script_run_time_key = "run_time";

    // Lengths, which describe raw_mtr_queue status
    var raw_mtr_queue_upper_border_white_status  = 500;
    var raw_mtr_queue_upper_border_yellow_status = 5000;

    // Lengths, which describe scripts times status
    var script_upper_border_red_status    = 0;
    var script_upper_border_yellow_status = 600;

    // Colors, which are used for CEP logs status displaying
    var cep_logs_status_colors = [ "white", "yellow", "red" ];

    // Collector component statuses
    var collector_component_statuses = [ "Running", "Stopped" ];

    // Collector component status colors
    var collector_component_status_colors = [ "green", "red" ];

    // Collector component no data message
    var collector_component_no_data_message = "No data";

    // How wait between checks the collector component status ( in milliseconds )
    var query_collector_component_status_interval = 60000;

    // Timeout event for quering collector component status and logs
    var timeoutEventID = null;

    // Display agent operations, agent operations table
    function    show_agent_operations_table() {

        $( '#agentOperationsTable' ).dataTable();

        $( '#agentOperationsTable' ).on(
            'click',
            'tr',
            function( e ) {

                $( '#agentOperationsTable' ).find( 'tr.highlight' ).removeClass( 'highlight' );

                $( this ).addClass( 'highlight' );

                return;
            }
        );
    
        return;
    }

    // Display CEP logs, scripts table
    function    show_cep_logs_table() {

        // Empty CEP logs table
        $( '#cepLogsTable' ).empty();

        // Create CEP logs table header
        $( '#cepLogsTable' ).append(
        
            '<thead>                            ' +
            '   <tr>                            ' +
            '       <th><b>Script Name</b></th> ' +
            '       <th><b>Run Time</b></th>    ' +
            '   </tr>                           ' +
            '</thead>                           '
        
        );

        // Create CEP logs table body
        $( '#cepLogsTable' ).append( '<tbody>' );

        if( cep_log_hashmap != null ) {

	        $.each(
	
	            cep_log_hashmap,
	            function( cep_log_hashmap_key, cep_log_hashmap_value ) {
	
	                var script_run_time_value = JSON.parse( cep_log_hashmap_value )[ script_run_time_key ];
	                var script_run_time_color = cep_logs_status_colors[ 2 ];
	
	                if( script_run_time_value > script_upper_border_red_status ) {
	
	                    script_run_time_color = cep_logs_status_colors[ 1 ];
	
	                    if( script_run_time_value > script_upper_border_yellow_status ) {
	
	                        script_run_time_color = cep_logs_status_colors[ 0 ];
	
	                    }
	
	                }
	
	                // Get the 00:00:00 format for script_run_time_value
	                script_run_time_value = formatSecondsToHoursMinutesSeconds( script_run_time_value );
	
	                $( '#cepLogsTable' ).append(
	
	                    '<tr>' +
	                    '   <td>' + cep_log_hashmap_key + '</td>' +
	                    '   <td style="background-color: ' + script_run_time_color + '">' + script_run_time_value + '</td>' +
	                    '</tr>'
	
	                );
	
	                return;
	            }
	
	        );

        }

        // Close CEP logs table body
        $( '#cepLogsTable' ).append( '</tbody>' );

        // Initialize CEP logs table
        $( '#cepLogsTable' ).dataTable(
            {
                "paging":       false,
                "info":         false,
                "searching":    false,
                "destroy":      true
            }
        );

        return;
    }

    // Display CEP logs, raw-mtr-queue table
    function    show_raw_mtr_queue_table() {

        // Empty time raw mtr queue table
        $( '#rawMtrQueueTable' ).empty();

        // Create the raw mtr queue table header
        $( '#rawMtrQueueTable' ).append(
        
            '<thead>                                ' +
            '   <tr>                                ' +
            '       <th><b>Raw MTR Queue</b></th>   ' +
            '   </tr>                               ' +
            '</thead>                               '
        
        );

        // Create raw mtr queue table body
        $( '#rawMtrQueueTable' ).append( '<tbody>' );

        if( cep_log_hashmap != null && cep_log_hashmap[ raw_mtr_queue_key ] != "" && cep_log_hashmap[ raw_mtr_queue_key ] != undefined ) {

            var raw_mtr_queue_value = cep_log_hashmap[ raw_mtr_queue_key ];
            var raw_mtr_queue_color = cep_logs_status_colors[ 0 ];

            if( raw_mtr_queue_value >= raw_mtr_queue_upper_border_white_status ) {

                raw_mtr_queue_color = cep_logs_status_colors[ 1 ];

                if( raw_mtr_queue_value > raw_mtr_queue_upper_border_yellow_status ) {

                    raw_mtr_queue_color = cep_logs_status_colors[ 2 ];

                }

            }

            $( '#rawMtrQueueTable' ).append(

                '<tr>' +
                '   <td style="background-color: ' + raw_mtr_queue_color + '">' + cep_log_hashmap[ raw_mtr_queue_key ] + '</td>' +
                '</tr>'

            );

        }

        // Close raw mtr queue table body
        $( '#rawMtrQueueTable' ).append( '</tbody>' );

        // Initialize raw mtr queue table
        $( '#rawMtrQueueTable' ).dataTable(
            {
                "paging":       false,
                "info":         false,
                "searching":    false,
                "destroy":      true
            }
        );

        return;
    }

    // Display collector logs table
    function    show_collector_logs_table( collector_logs_data ) {

        // Empty collector logs table
        $( '#collectorLogsTable' ).empty();

        // Create collector logs table header
        $( '#collectorLogsTable' ).append(
        
            '<thead>                         ' +
            '   <tr>                         ' +
            '       <th><b>Log file</b></th> ' +
            '   </tr>                        ' +
            '</thead>                        '
        
        );

        // Create collector logs table body
        $( '#collectorLogsTable' ).append( '<tbody>' );

        if( collector_logs_data != null ) {

            $( '#collectorLogsTable' ).append( "<tr><td><textarea id='collectorLogsTableTextArea' rows='10' cols='175' readonly>" + collector_logs_data + "</textarea></td></tr>" );

        }

        // Close collector logs table body
        $( '#collectorLogsTable' ).append( '</tbody>' );

        // Initialize collector logs table
        $( '#collectorLogsTable' ).dataTable(
            {
                "paging":       false,
                "info":         false,
                "searching":    false,
                "destroy":      true
            }
        );

        $( '#collectorLogsTableTextArea' ).scrollTop( $( '#collectorLogsTableTextArea' )[ 0 ].scrollHeight );

        return;
    }

    // Display collector status
    function    show_collector_status( collector_component_status ) {

        // By default, collector component is running
        var collector_component_status_color = collector_component_status_colors[ 0 ];

        // Empty current collector status
        $( '#collectorStatus' ).empty();

        if( collector_component_status == collector_component_statuses[ 1 ] ) {

            collector_component_status_color = collector_component_status_colors[ 1 ];

        }

        // Show current collector status
        $( '#collectorStatus' ).append( "Status: <b><font color='" + collector_component_status_color + "'>" + collector_component_status + "</font></b>" );

        return;
    }

    // Get collector component status
    function    get_collector_status_ajax() {

        $.ajax(
            {
                url:        '/cnep/ajax/collector-status.json',
                dataType:   'json',
                error:      function ( e ) {

                    console.log( "Error: " + e.message );

                    return;
                },
                success: function ( collector_status_data ) {

                    // Display collector component status
                    show_collector_status( collector_status_data );

                    return;
                }
            }
        );

        return;
    }

    // Get collector component logs
    function    get_collector_logs_ajax() {

        $.ajax(
            {
                url:        '/cnep/ajax/collector-logs.json',
                dataType:   'json',
                error:      function ( e ) {

                    console.log( "Error: " + e.message );

                    return;
                },
                success: function ( collector_logs_data ) {

                    // Display collector component logs table
                    show_collector_logs_table( collector_logs_data );

                    return;
                }
            }
        );

        return;
    }

    // Get the CEP logs
    function    get_cep_logs_ajax() {

        $.ajax(
            {
                url:        '/cnep/ajax/cep-logs.json',
                dataType:   'json',
                error:      function ( e ) {

                    console.log( "Error: " + e.message );

                    return;
                },
                success: function ( cep_logs_data ) {

                    cep_log_hashmap = cep_logs_data;

                    // Display CEP logs, raw-mtr-queue table
                    show_raw_mtr_queue_table();

                    // Remove raw_mtr_queue_key from cep_log_hashmap hashmap
                    if( cep_log_hashmap != null )
                        delete cep_log_hashmap[ raw_mtr_queue_key ];

                    // Display CEP logs, scripts table
                    show_cep_logs_table();

                    return;
                }
            }
        );

        return;
    }

    // Format seconds in the format 00:00:00 ( hours:minutes:seconds )
    function    formatSecondsToHoursMinutesSeconds( script_run_time_value ) {

        var formattedValue = "";
        var hours          = Math.floor( script_run_time_value / 3600 );
        var minutes        = Math.floor( ( script_run_time_value - ( hours * 3600 ) ) / 60 );
        var seconds        = ( script_run_time_value - ( hours * 3600 ) ) - ( minutes * 60 );

        if( hours < 10 )
            hours = "0" + hours;

        if( minutes < 10 )
            minutes = "0" + minutes;

        if( seconds < 10 )
            seconds = "0" + seconds;

        formattedValue = hours + ":" + minutes + ":" + seconds;

        return formattedValue;
    }

    // This function checks collector component status periodically and refreshs the operations page accordingly
    function    query_collector_component() {

        // Load collector component status
        get_collector_status_ajax();

        // Load collector component logs
        get_collector_logs_ajax();

        // Clear the previous timeout ID
        if( timeoutEventID != null ) {

            clearTimeout( timeoutEventID );

        }

        // Set the callback again
        timeoutEventID = setTimeout( query_collector_component, query_collector_component_status_interval );

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

                // Load CEP logs
                get_cep_logs_ajax();

                // Load collector component status
                get_collector_status_ajax();

                // Load collector component logs
                get_collector_logs_ajax();

                // Display agent operations logs, operations table
                show_agent_operations_table();

                // Set callback for button 'Refresh'
                $( '#refresh-collector-logs-button' ).on(

                    "click",

                    function() {

                        // Load collector component status
                        get_collector_status_ajax();

                        // Load collector component logs
                        get_collector_logs_ajax();

                        return;
                    }

                );

                // Clear the previous timeout ID
                if( timeoutEventID != null ) {

                    clearTimeout( timeoutEventID );

                }

                // Check the collector component status and logs
                timeoutEventID = setTimeout( query_collector_component, query_collector_component_status_interval );

                return;
            }

        );

        return;
    })();

    return;
} ).call( this );
