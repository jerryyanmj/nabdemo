// This module is used to get the information, related to liveroutes functionality

var redis       = require( 'redis' );
var config      = require( '../../config' );
var mainModule  = require( '../../app' );

var redisClient = redis.createClient( config.redis.port, config.redis.host );
redisClient.on(
    "error", 
    function( error ) {

        console.error( "Cannot connect to the Redis storage in agents module " + error );

        return;
    }
);

var targetsReached = 0;
var targetsMissed = 0;
var origins = {};
var targets = {};
var maxmind;

exports.setup = function( io, redisHost, redisPort, maxmindRef ) {

    console.log( "live_routes module is initialized" );

    maxmind = maxmindRef;

    var queryer = redis.createClient(redisPort, redisHost);
    queryer.on(

        "error", 
        function( err ) {

            console.error( "Cannot connect to the Redis storage in agents module " + err );

            return;
        }
    );

    io.sockets.on(

        'connection', 
        function( socket ) {

            queryer.sscan(
                "routes_by_score", 
                0, 
                function( err, reply ) {

                    // console.log( 'reply on routes_by_score' + reply );

                    reply[ 1 ].forEach(

                        function( entry ) {

                            queryer.hmget(
                                "live_routes_info", 
                                entry, 
                                function( err, reply ) {

                                    if( reply[ 0 ] ) {

                                        // console.log( 'reply on live_routes_info' + reply );

                                        socket.emit( 'live_routes_info', JSON.parse( reply ) );

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

            var pubsub = redis.createClient( redisPort, redisHost );
            pubsub.on(
                'error', 
                function( err ) { 

                    console.error( "Cannot connect to the Redis storage  in agents module " + err ); 

                    return;
                }
            );

            pubsub.on(
                'ready', 
                function( err ) { 

                    console.log( 'Connected to redis' ); 

                    return;
                }
            );

            pubsub.on(
                'subscribe', 
                function( channel, count ) { 

                    console.log( 'Subscribed to ' + channel );

                    return;
                }
            );

            pubsub.subscribe( 'routes_by_score' );	
            pubsub.on(
                'message', 
                function( channel, message ) {

                    // console.log( 'channel is ' + channel );
                    // console.log( JSON.stringify( message ) );

                    if( channel == 'routes_by_score' )
                        targetsReached += 1;
                    else 
                        targetsMissed += 1;

                    // console.log( 'Reached ' + targetsReached + ', missed ' + targetsMissed + ' to date' );

                    io.sockets.emit( channel, JSON.parse( message ) );

                    return;
                }

            );

            return;
        }
    );

    return;
}

function enrich( report ) {

    //Lookup lat/long for the source agent
    var source = maxmind.getLocation( report.IP );

    if( source === null ) 

        console.log( report.IP + ' not found in maxmind db' );

    else {

        report.latitude = source.latitude; report.longitude = source.longitude;
        report.source = source;

    }

    // Lookup lat/long for the target agent
    var target = maxmind.getLocation( report.route.IP );
    if( target === null ) 

        console.log( report.route.ip + ' not found in maxmind db' );

    else {

        report.route.latitude = target.latitude; report.route.longitude = target.longitude;
        report.route.target = target;

        // Iterate over each hop in the route
        for( var i in report.route.hops ) {

            // Iterate over probe responses from each IP for the hop
            for( var j in report.route.hops[ i ].RTTs ) {

                // Lookup lat/long for each IP that responded to probes on this hop
                var hopLoc = maxmind.getLocation( report.route.hops[ i ].RTTs[ j ].IP );

                if( hopLoc === null ) 

                    console.log( report.route.hops[ i ].RTTs[ j ].IP + ' not found in maxmind db' );

                else {

                    report.route.hops[ i ].RTTs[ j ].latitude = hopLoc.latitude;
                    report.route.hops[ i ].RTTs[ j ].longitude = hopLoc.longitude;
                    report.route.hops[ i ].RTTs[ j ].hop = hopLoc;

                }

            }

        }

    }

    return report;
}

// Geocodes route reports for the selected peer
exports.singleRoute = function (request, response) {

    console.log( "Got request for routes for " + request.params.key + " target is " + request.params.target );

    var exists = collector1.exists(request.params.key);

    if (exists) {

        collector1.lrange(
            request.params.key, 
            0, 
            -1, 
            function (err, repl) {

                repl.forEach(

                    function (peer) {

                        var peer = JSON.parse(peer);

                        if(peer.route.peer==request.params.target){

                            var hopsInfo = [];
                            var keyIP = request.params.key.split('|')[1];
                            var lookup = maxmind.getLocation(keyIP) || {};

                            if (lookup === {}) 
                                console.log(keyIP + ' not found in maxmind db');

                            lookup.IP = keyIP;
                            hopsInfo.push(lookup);

                            peer.route.hops.forEach(

                                function (hop) {

                                    if (hop.hasOwnProperty("RTTs")) {

                                        hop.RTTs.forEach(

                                            function (RTT) {

                                                var lookupRTT = maxmind.getLocation(RTT.IP) || {};

                                                if (lookupRTT === {}) 
                                                    console.log(RTT.IP + ' not found in maxmind db');

                                                lookupRTT.IP = RTT.IP;

                                                // Also return the hop details

                                                lookupRTT.RTT = RTT.RTT;

                                                hopsInfo.push(lookupRTT);

                                            }

                                        );

                                    }

                                }

                            );

                            var lookupPeer = maxmind.getLocation(peer.route.IP) || {};

                            if (lookupPeer === {}) 
                                console.log(peer.route.IP + ' not found in maxmind db');

                            lookupPeer.IP = peer.route.IP;
                            lookupPeer.RTT=peer.route.RTT;

                            hopsInfo.push(lookupPeer);

                            response.json(hopsInfo);

                        }

                        return;
                    }

                );

                return;
            }

        );

    } 
    else {

        response.json({});

    }

    return;
}

exports.allRoutes = function(request,response){

    console.log("Got request for routes for " + request.params.key);

    var exists = collector1.exists(request.params.key);

    if(exists){

        collector1.lrange(
            request.params.key, 
            0, 
            -1, 
            function (err, repl) {

                var peers=[];

                repl.forEach(

                    function(rec){

                        var peer=JSON.parse(rec);
                        var lookup = maxmind.getLocation(peer.route.IP) || {};

                        if (lookup === {}) 

                            console.log(keyIP + ' not found in maxmind db');

                        else{

                            lookup.IP=peer.route.IP;
                            lookup.RTT=peer.route.RTT;
                            lookup.peer=peer.route.peer;

                            var found=false;

                            peers.forEach(

                                function(latlng){

                                    if(latlng.latitude==lookup.latitude && latlng.longitude==lookup.longitude){

                                        found=true;

                                        return;

                                    }

                                    return;
                                }

                            );

                            if(!found)

                                peers.push(lookup);

                        }

                        return;
                    }

                );

                response.json(peers);

                return;
            }

        );

    } 
    else {

        response.json([]);

    }

    return;
}

exports.activePeers = function (request, response) {

    console.log("got request for active peers");

    collector1.lrange(
        'active_peers', 
        0, 
        -1, 
        function (err, repl) {

            var clients = [];
            var latlngArray = [];

            repl.forEach(

                function (peer) {

                    var peerIP = peer.split('|')[1];
                    var lookup = maxmind.getLocation(peerIP) || {};

                    if (lookup === {}) 

                        console.log(peerIP + ' not found in maxmind db');

                    else{

                        lookup.IP = peerIP;
                        lookup.clientId=peer;

                        var latlngkey=lookup.latitude+'|'+lookup.longitude;
                        var index=latlngArray.indexOf(latlngkey);

                        if(index<0){

                            clients.push(lookup);

                            latlngArray.push(latlngkey);

                        }

                    }

                    return;
                }

            );

            response.json(clients);

            return;
        }

    );

    return;
}

exports.update_action = function(req, res){

    res.json({status: 'okay'});

    return;
}

exports.worst_performing_routes = function(req, res){

    var routes=[];

    redisClient.sscan(
        "routes_by_score", 
        0, 
        function(err, reply) {

            var routesLength=reply[1].length;

            // console.log('reply on routes_by_score'+routesLength);

            var current=1;

            reply[1].forEach(

                function(entry) {

                    redisClient.hmget(
                        "live_routes_info", 
                        entry, 
                        function(err, reply) {

                            if (reply[0]) {

                                // console.log('reply on live_routes_info'+reply);

                                routes.push(JSON.parse(reply));

                            }

                            current=current+1;

                            // console.log('current is '+current+' routes length is '+routesLength);

                            if(current>routesLength){

                                // console.log(routes);

                                res.json(routes);

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
