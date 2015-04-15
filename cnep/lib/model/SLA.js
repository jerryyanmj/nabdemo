// This module is used to get the information, related to SLA functionality

var config      = require( '../../config' );
var mainModule  = require( '../../app' );
var redis       = require( 'redis' );
var redisClient = redis.createClient( config.redis.port, config.redis.host );

redisClient.on(

    "error", 

    function( error ) {

        console.error( "Cannot connect to the Redis storage in SLA module " + error );

        return;
    }

);

exports.setup = function() {

    console.log( "SLA module is initialized" );

    return;
}

exports.sla_routes = function( req, res ) {

    var sla        = {};
    var sourceData = {};
    var targetData = {};
    var slaRoutes  = {};

    sla.sources   = {};
    sla.targets   = {};
    sla.slaRoutes = {};

    redisClient.hgetall(

        "sla_sources",
        function( err, sources ) {

            redisClient.hgetall(

                "sla_targets",
                function( err, targets ) {

                    redisClient.hgetall(

                        "sla_ui_info",
                        function( err, routes ) {

                            for( var id in sources ) {

                                sourceData[ id ] = id + ' | ' + sources[ id ];

                            }

                            for( var id in targets ) {

                                targetData[ id ] = id + ' | ' + targets[ id ];

                            }

                            for( var sid in sources ) {

                                for( var tid in targets ) {

                                    for( var rid in routes ) {

                                        if( rid == ( sid + '|' + tid ) ) {

                                            slaRoutes[ sid + '|' + tid ] = eval( "(" + routes[ rid ] + ")" );
                                        }

                                    }

                                }

                            }

                            sla.sources   = sourceData;
                            sla.targets   = targetData;
                            sla.slaRoutes = slaRoutes;

                            res.json( sla );

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

exports.sla_sources = function( req, res ) {

    var sla        = {};
    var sourceData = {};
    sla.sources   = {};

    redisClient.hgetall(

        "sla_sources",
        function( err, sources ) {


            for( var id in sources ) {

                sourceData[ id ] = id + ' | ' + sources[ id ];
                console.log(sourceData[ id ]);

            }


            sla.sources   = sourceData;

            res.json( sla );



            return;
        }

    );

    return;
}

exports.sla_targets = function( req, res ) {

    var sla        = {};
    var targetData = {};
    sla.targets   = {};

    redisClient.hgetall(

        "sla_targets",
        function( err, targets ) {


            for( var id in targets ) {

                targetData[ id ] = id + ' | ' + targets[ id ];
                console.log(targetData[ id ]);

            }


            sla.targets   = targetData;

            res.json( sla );



            return;
        }

    );

    return;
}

exports.sla_table_data = function( req, res ) {

    var sla        = {};
    var targetData = {};
    sla.sources   = {};
    sla.s


    redisClient.hgetall(

        "sla_targets",
        function( err, targets ) {


            for( var id in targets ) {

                targetData[ id ] = id + ' | ' + targets[ id ];
                console.log(targetData[ id ]);

            }


            sla.targets   = targetData;

            res.json( sla );



            return;
        }

    );

    return;
}
