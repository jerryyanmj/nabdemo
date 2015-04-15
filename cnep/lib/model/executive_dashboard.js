// This module is used to get the information, related to executive dashboard functionality

var config      = require( '../../config' );
var mainModule  = require( '../../app' );
var redis       = require( 'redis' );
var redisClient = redis.createClient( config.redis.port, config.redis.host );

redisClient.on(

    "error", 

    function( error ) {

        console.error( "Cannot connect to the Redis storage in executive_dashboard module " + error );

        return;
    }

);

exports.setup = function() {

    console.log( "executive dashboard module is initialized" );

    return;
}

exports.city_routes = function( request, response ) {

    var a       = {};
    var loss    = [];
    var latency = [];
    var score   = [];
    var exec    = false;

    a.loss5 = [];

    redisClient.sscan(
        "routes_by_loss", 
        0, 
        function( err, reply ) {

            reply[ 1 ].forEach(
                function( entry ) {

                    redisClient.hmget(
                        "exec_route_info", 
                        entry, 
                        function( err, reply ) {

                            if( reply[ 0 ] ) {

                                var obj = eval ( "(" + reply[ 0 ] + ")" );

                                loss.push( obj );

                                a.loss5 = loss;

                            }

                            return;
                        }
                    );

                    return;
                }
            );

            redisClient.sscan(
                "routes_by_latency", 
                0, 
                function( err, reply ) {

                    reply[ 1 ].forEach(

                        function( entry ) {

                            redisClient.hmget(
                                "exec_route_info", 
                                entry, 
                                function( err, reply ) {

                                    if( reply[ 0 ] ) {

                                        var obj = eval( "(" + reply[ 0 ] + ")" );

                                        latency.push( obj );

                                        a.latency5 = latency;
                                    }

                                    return;
                                }
                            );

                            return;
                        }
                    );

			         
                     var processedKeys=[];

                    // exec_route_info
                    redisClient.smembers(
                        "routes_by_score", function( err, routes_by_score_members ) {

                            routes_by_score_members.forEach(

                                function( entry ) {

                                    processedKeys.push(entry);

                                    redisClient.hmget(
                                        "exec_route_info", 
                                        entry, 
                                        function( err, exec_route_info_result ) {

                                            if( exec_route_info_result[ 0 ] ) {

                                                var obj = eval( "(" + exec_route_info_result[ 0 ] + ")" );

                                                redisClient.hmget(
                                                    "exec_historical_metric_charts", 
                                                    entry, 
                                                    function( err, exec_historical_metric_charts_results ) {

                                                        if( exec_historical_metric_charts_results != "" ) {

                                                            obj.latencyChart = eval( "(" +exec_historical_metric_charts_results + ")" );
                                                            obj.lossChart    = eval( "(" +exec_historical_metric_charts_results + ")" );

                                                            score.push( obj ); 

                                                            console.log('score length is '+score.length);

                                                            if( score.length >= routes_by_score_members.length && ! exec ) {

                                                                exec     = true; 
                                                                a.routes = score;
                                                                a.score5 = score;
                                                                a.targetNotReached= {};

                                                                console.log('in score length > 3 ---'+score.length);
                                    
                                                                redisClient.hgetall("sla_sources",function( err, sources ) {

                                                                    redisClient.hgetall("sla_targets",function( err, targets ) {

                                                                        redisClient.hgetall("target_not_reached",function( err, routes ) {

                                                                            for( var sid in sources ) {

                                                                                for( var tid in targets ) {

                                                                                    for( var rid in routes ) {

                                                                                        if( rid == ( sid + '|' + tid ) ) {

                                                                                            a.targetNotReached[ sources[sid] + '|' + targets[tid] ] = eval( "(" + routes[ rid ] + ")" );

                                                                                        }

                                                                                    }

                                                                                }

                                                                            }

                                                                            response.json( a );

                                                                            return; 
                                                                        });

                                                                        return; 
                                                                    });

                                                                    return;
                                                                });

                                                            }

                                                        }

                                                        return;
                                                    }
                                                );
                                            }

                                            return;
                                        }
                                    );

                                    return;
                                }
                            );

                        return;
                    });

                    

                    return;
                }
            );

            return;
        }
    );

    return;
}

// Get the information about city routes, by using sla_sources, sla_targets collections from Redis storage
exports.sla_city_routes = function( request, response ) {

    var sla_sources    = [];
    var sla_targets    = [];
    var sla_routes     = [];
    var sla_route_info = {};
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

            // Get sla destination addresses
            redisClient.hgetall(
    
                "sla_targets",
                function( error, sla_targets_results ) {

                    var sla_targets_result_key = null;
                    for( sla_targets_result_key in sla_targets_results ) {

                        sla_targets.push( sla_targets_result_key + "|" + sla_targets_results[ sla_targets_result_key ] );

                    }

                    sla_result.sla_targets = sla_targets;

                    // Get the length of exec_historical_metric_charts data
                    redisClient.hlen(

                        "exec_historical_metric_charts",
                        function( error, exec_historical_metric_charts_length ) {

                            // Get exec_historical_metric_charts data for all the routes
                            redisClient.hgetall(

                                "exec_historical_metric_charts",
                                function( error, exec_historical_metric_charts_results ) {

                                    var sla_route_result_key = null;

                                    // Initialize routes array
                                    sla_result.routes = [];

                                    // Display the sla result without routes
                                    if( exec_historical_metric_charts_results == null ) {

                                        console.warn( "exports.sla_city_routes(): exec_historical_metric_charts_results is empty" );

                                        response.json( sla_result );

                                    }
                                    // Display the sla result with routes
                                    else {

	                                    for( sla_route_result_key in exec_historical_metric_charts_results ) {

                                           console.log( "exports.sla_city_routes(): found sla_route_result_key = " + sla_route_result_key );

	                                       // Get route key, latency chart, loss chart
	                                       sla_route_info.routeKey     = sla_route_result_key;
	                                       sla_route_info.latencyChart = eval( "(" + exec_historical_metric_charts_results[ sla_route_result_key ] + ")" );
	                                       sla_route_info.lossChart    = eval( "(" + exec_historical_metric_charts_results[ sla_route_result_key ] + ")" );
	
 	                                       console.log( "exports.sla_city_routes(): found sla_route_info.latencyChart = " + exec_historical_metric_charts_results[ sla_route_result_key ] );
	
	                                       // Add information about the route into the routes array
	                                       sla_result.routes.push( sla_route_info );
	
	                                       // Display the sla result
	                                       if( sla_result.routes.length >= exec_historical_metric_charts_length && ! exec ) {
	
	                                           exec                     = true;
		                                       sla_result.routes_length = sla_result.routes.length;
	
	                                           response.json( sla_result );

                                            }

	                                    }

                                    }

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

    );

    return;
}

exports.cityRoutes = function( req, res ) {

    redisClient.hgetall(

        'cityRoutes', 
        function( err, reply ) {

            res.json( reply );

            return;
        }

    );

    return;
}

exports.cityRoute = function( req, res ) {

    redisClient.lrange(

        req.params.route, 

        0, 

        -1, 

        function( error, reply ) {

            res.json( reply );

            return;
        }
    );

    return;
}
