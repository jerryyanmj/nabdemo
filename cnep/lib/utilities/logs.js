// This module is used to get the information, related to logging functionality
// - CEP logs
// - Collector component logs

var mainModule  = require( '../../app' );
var config      = require( '../../config' );
var redis       = require( 'redis' );
var https       = require( 'https' );
var redisClient = null;

// Initialization phase
exports.setup = function() {

    console.log( "logs module is initialized" );

    redisClient = redis.createClient( config.redis.port, config.redis.host );

    redisClient.on(

        "error", 

        function( error ) {

            console.error( "Cannot connect to the Redis storage in logs module " + error );

            return;
        }

    );

    return;
}

// Get CEP logs from Redis storage
exports.get_cep_logs = function( request, response ) {

    redisClient.hgetall(

        'monit', 
        function( error, results ) {

            response.json( results );

            return;
        }

    );

    return;
}

// Get collector logs from file system storage
exports.get_collector_logs = function( request, response ) {

    var collectorLastLoggingRecordsData = "";
    var exec                            = false;
    var j                               = 0;

    redisClient.llen( 

        "collectorLastLoggingRecords",
        function( error, collectorLastLoggingRecordsLength ) {

            if( collectorLastLoggingRecordsLength > 0 ) {

	            for( var i = collectorLastLoggingRecordsLength - 1; i >= 0; i-- ) {
	
		            redisClient.lindex( 
		
		                "collectorLastLoggingRecords",
		                i,
		                function( error, collectorLastLoggingRecord ) {
	
		                    collectorLastLoggingRecordsData += collectorLastLoggingRecord + "\n";
		                    j++;
	
	                        if( j == collectorLastLoggingRecordsLength ) {
	
	                            response.json( collectorLastLoggingRecordsData );
	
	                        }
	
		                    return;
		                }
		
		            );
	
	            }

            }
            else {

                response.json( collectorLastLoggingRecordsData );

            }

            return;
        }

    );

    return;
}

// Get collector status
exports.get_collector_status = function( request, response ) {

    var collectorComponentStatuses = [ 'Running', 'Stopped' ];
    var data_output                = null;

    https.get(

        config.collectorComponent.url + config.collectorComponent.checkStatusCommand,

        function( httpsResponse ) {

            httpsResponse.on(

                'data', 

                function( chunk_data ) {

                    data_output += chunk_data;

                    return;
                }

            );

            // The whole response has been received, collector component is running
            httpsResponse.on(

                'end', 

                function() {

                    response.json( collectorComponentStatuses[ 0 ] );

                    return;
                }

            );

            return;
        }

    ).on(

        'error', 

        // The error has been received, collector component is not running
        function( error ) {

            console.error( "Cannot check collector component status: " + error.message );

            response.json( collectorComponentStatuses[ 1 ] );

            return;
        }

    );

    return;
}
