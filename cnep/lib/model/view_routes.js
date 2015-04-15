// This module is used to get the information, related to view routes functionality

var redis  = require( 'redis' );
var fs     = require( 'fs' );
var config = require( '../../config' );

var redisClient = redis.createClient( config.redis.port, config.redis.host );

redisClient.on(

    "error", 

    function( error ) {

        console.error( "Cannot connect to the Redis storage in viewroutes module " + error );

        return;
    }

);

var city_routes_cache    = null;
var city_routes_filename = '';
var storage_path         = '';

// Get the information about city routes, by using sla_sources, sla_targets collections from Redis storage
exports.sla_sources = function( request, response ) {

    var sla_sources    = [];
    var sla_result     = {};
    var error          = null;
    var exec           = false;

    // Get sla source addresses
    redisClient.hgetall(

        "sla_sources",
        function( error, sla_sources_results ) {

            var sla_sources_result_key = null;
            for( sla_sources_result_key in sla_sources_results ) {

                sla_sources.push( sla_sources_result_key + "|" + sla_sources_results[ sla_sources_result_key ] );

            }

            sla_result.sla_sources = sla_sources;
		
            response.json( sla_result );

            return;
        }
    );	

    return;
}

// Get the information about city routes, by using sla_sources, sla_targets collections from Redis storage
exports.sla_source_route_data = function( request, response ) {

    var sla_result     = {};   
    var error          = null;
    var exec           = false;

	var sourceIP  = request.params.source.split( '|' )[ 0 ];
	var targetIP  = null;
	var timeRange = request.params.timeRange;

    redisClient.hgetall(
        "sla_targets",
        function( error, sla_target_results ) {

            console.log('sla_target_results is '+JSON.stringify(sla_target_results));

            // Get the length of exec_historical_metric_charts data
            redisClient.hlen(

                "exec_historical_metric_charts",
                function( error, metric_length ) {

                    var i = 0;
                    var keys=[];

                    // Get exec_historical_metric_charts data for all the routes
                    redisClient.hgetall(

                        "exec_historical_metric_charts",
                        function( error, exec_historical_metric_charts_results ) {

                            Object.keys( exec_historical_metric_charts_results ).forEach(

                                function( sla_route_result_key ) {

                                    keys.push(sla_route_result_key);

                                    if( sla_route_result_key.split( "|" )[ 0 ] == sourceIP ) {

                                        var hourData        = JSON.parse( exec_historical_metric_charts_results[ sla_route_result_key ] );
                                        var hourDataLength  = Object.keys( hourData ).length;
                                        var hourDataPartial = {};
                                        var targetDetails={};

                                        targetIP = sla_route_result_key.split( "|" )[ 1 ];

                                        // Get the sla_target for the specified sla_source
                                        targetDetails['sla_target'] = sla_target_results[targetIP] === undefined ? 'Unknown Location' : sla_target_results[targetIP];

                                        console.log('target ip is '+targetIP+' location details is '+targetDetails['sla_target']);

                                        // Data array for loss chart
                                        var lossData = [
                                            {
		                                        "key"    : "Average Loss %" ,
		                                        "bar"    : true,
		                                        "values" : []
		                                    },
		                                    {
		                                        "key"    : "Moving Average Loss %" ,
		                                        "values" : []
		                                    }
		                                ];

                                        // Data array for latency chart
    	                                var latencyData = [
		                                    {
		                                        "key"    : "Average Latency" ,
		                                        "bar"    : true,
		                                        "values" : []
		                                    },
		                                    {
		                                        "key"    : "Moving Average Latency" ,
		                                        "values" : []
		                                    }
		                                ];
                                
		                                // Calculate maximum loss
		                                var maxLoss = 0;
		                                var maxLatency = 0;
		
		                                Object.keys(hourData).forEach(

                                            function(key) {

                                                var val = hourData[key];

                                                if(maxLoss<val.loss_hourly_average)
                                                    maxLoss=val.loss_hourly_average;

                                                if(maxLatency<val.latency_hourly_average)
                                                    maxLatency=val.latency_hourly_average;

                                                return; 
                                            }

                                        );

                                        console.log('max data '+maxLoss+' '+maxLatency);
                                    
                                        // Keys length of loss chart
                                        var chartStartHour = hourDataLength - timeRange + 1;

                                        // Fill up lossData
                                        var minMovingLoss = 0;
                                        var minMovingLatency = 0;

		                                for( var i = chartStartHour; i <= hourDataLength; i++ ) {
			
		                                    var hourDetails = hourData[ 'hour' + i ];
			
		                                    if( hourDetails && hourDetails != -1 ) {
		
		                                        var movingLoss = hourDetails.loss_moving_average;
		                                        var movingLatency = hourDetails.latency_moving_average;
			
		                                        lossData[ 0 ].values.push(
		                                            { 
		                                                x: new Date( hourDetails.time * 1000 ), 
		                                                y: parseFloat( hourDetails.loss_hourly_average < 0 ? maxLoss : hourDetails.loss_hourly_average ),
		                                                originalY: parseFloat( hourDetails.loss_hourly_average ) 
		                                            }
		                                        );
			
		                                        latencyData[ 0 ].values.push( 
		                                            { 
		                                                x: new Date( hourDetails.time * 1000 ), 
		                                                y: parseFloat( hourDetails.latency_hourly_average < 0 ? maxLatency : hourDetails.latency_hourly_average ),
		                                                originalY: parseFloat( hourDetails.latency_hourly_average ) 
		                                            }
		                                        );
			
	                                            lossData[ 1 ].values.push( 
	                                                { 
	                                                    x: new Date( ( hourDetails.time * 1000 )  ), 
	                                                    y: parseFloat( movingLoss < 0 ? minMovingLoss: movingLoss ),
	                                                    originalY: parseFloat( movingLoss )
	                                                }
	                                            );
			
	                                             latencyData[ 1 ].values.push(
	                                                {
	                                                    x: new Date( ( hourDetails.time * 1000 ) ), 
	                                                    y: parseFloat( movingLatency < 0 ? minMovingLatency : movingLatency ),
	                                                    originalY: parseFloat( movingLatency ) 
	                                                }
	                                            );
			
		                                    }
			
		                                }   

                                        targetDetails['lossData'] = lossData;
                                        targetDetails['latencyData'] = latencyData;
                                        sla_result[ targetIP ] = targetDetails; 

                                    }

                                    if( keys.length >= metric_length ) {
				
                                        console.log('reached metric_length '+metric_length);

                                        response.json( sla_result );

    		                        }
			                        else {

			                            console.log('keys reached '+keys.length+' metric_length is '+Object.keys( exec_historical_metric_charts_results ).length);

			                        }    

                                    return 1;

                                }

                            );

                            return;
                        }

                    );

                    return;
                }

            );

            return;
        }
        
    );

    return;
}
