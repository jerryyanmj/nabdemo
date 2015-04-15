// This module is used to get the information, related to agent scheduling functionality

var fs              = require( 'fs' );
var mysqlModule     = require( '../utilities/mysql' );
var commonFunctions = require( '../utilities/common' );
var config          = require( '../../config' );

// Generate new empty agent
exports.createAgent = function( request, response, nextAction ) {

    var empty = {
        'aid'           : 'New',
        'hostname'      : '',
        'address'       : '',
        'mac_address'   : '',
        'ssh'           : '',
        'os'            : '',
        'city'          : '',
        'state'         : '',
        'class'         : '',
        'unknown'       : '',
        'model'         : '',
        'serialnumber'  : ''
    }

    request.session.agent = empty;

    nextAction();

    return;
}

// Get all the agents groups
exports.getAgentsGroups = function( request, reponse, nextAction ) {

    // Initialize agents groups
    request.session.agentsgroups = null;

    mysqlModule.mysqlPool.acquire( 

        function( error, mysqlConnection ) {

            mysqlConnection.query(
                'SELECT             ' +
                '   cid AS cid,     ' +
                '   name AS name    ' + 
                'FROM               ' +
                '   class           ',
                function( error, results ) {
        
                    // Put the results into the session
                    request.session.agentsgroups = results;
        
                    // Call next action
                    nextAction();
        
                    return;
                }
        
            );

            mysqlModule.mysqlPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get the specified agent
exports.getAgent = function( request, response, nextAction ) {

    if( request.session.user.role == 'admin' ) {

        mysqlModule.mysqlPool.acquire( 

            function( error, mysqlConnection ) {
    
                mysqlConnection.query(
                    'SELECT                                 ' +
                    '   A.*,                                ' +
                    '   C.name AS class                     ' +
                    'FROM agents                            ' +
                    '   A LEFT JOIN agentclass              ' +
                    '   B on A.aid = B.aid LEFT JOIN class  ' +
                    '   C on B.cid = C.cid WHERE A.aid = ?', 
                    request.param( 'aid' ), 
                    function( error, results ) {
        
                        request.session.agent = results[ 0 ];
        
                        nextAction();
        
                        return;
                    }
        
                );
    
                mysqlModule.mysqlPool.release( mysqlConnection );
    
                return;
            }

        );

    }

    return;
}

// Generate new empty agent's group
exports.createAgentGroup = function( request, response, nextAction ) {

    var emptyGroup = {
        'cid'  : 'New',
        'name' : ''
    }

    request.session.agentgroup = emptyGroup;

    nextAction();

    return;
}

// Get the list of commands for the specified agent
exports.getAgentCommands = function( request, response, nextAction ) {

    var queryString;

    // Get current time
    var currentTime = new Date().getTime();

    if( request.session.user.role == 'admin' ) {

        mysqlModule.mysqlPool.acquire( 

            function( error, mysqlConnection ) {

                // Get the agent's status
                mysqlConnection.query(
        
                    'SELECT unknown FROM agents WHERE aid = ?', 
                    request.param( 'aid' ), 
                    function( error, result ) {

                        if( error == null && result != '' ) {

                            unknown_agent_flag = result[ 0 ].unknown;
                    
                            // Set current agent unknown flag
                            request.session.agentIsUnknownFlag = unknown_agent_flag;
                    
                            if( unknown_agent_flag == 1 ) {
                    
                                queryString = 
                                "SELECT                     " +
                                "    *                      " +
                                "FROM                       " +
                                "   RUN A                   " +
                                "LEFT JOIN commands B ON    " +
                                "   A.mid = B.mid           " +
                                "WHERE A.aid LIKE ''        " +
                                "ORDER BY A.end DESC        ";
                                mysqlConnection.query( 
                                    queryString, 
                                    function( error, results ) {
                
                                        for( var i = 0; i < results.length; i++ ) {
                
                                            // Set the command as expired by default
                                            results[ i ].is_expired = true;
                
                                            // Check, if the command is not expired
                                            if( results[ i ].end && results[ i ].end.getTime() > currentTime ) { 
                
                                                results[ i ].is_expired = false;
                
                                            }
                
                                        }
                
                                        request.session.commands = results;
                    
                                        nextAction();
                
                                        return;
                                    }
                                );
                    
                            }
                            else {
                    
                                queryString = "SELECT * FROM RUN A LEFT JOIN commands B on A.mid = B.mid WHERE A.aid = ?";
                
                                mysqlConnection.query(
                                    queryString, 
                                    request.param( 'aid' ), 
                                    function( error, results ) {
                    
                                        for( var i = 0; i < results.length; i++ ) {
                        
                                            // Set the command as expired by default
                                            results[ i ].is_expired = true;
                        
                                            // Check, if the command is not expired
                                            if( results[ i ].end && results[ i ].end.getTime() > currentTime ) { 
                        
                                                results[ i ].is_expired = false;
                        
                                            }
                        
                                        }
    
                                        request.session.commands = results;
    
                                        nextAction();
    
                                        return;
                                    }
                                );
                    
                            }

                        }
                        else {

                            if( error != null ) {

                                request.session.error = "Error: " + error.message;

                            }
                            else if( result == '' ) {

                                request.session.error = "Error: Unknown data";

                            }

                            nextAction();
                        }

                        return;
                    }
        
                );

                mysqlModule.mysqlPool.release( mysqlConnection );

                return;
            }

        );

    }

    return
}

// Get the particular command for the specified agent
exports.getCommand = function( request, response, next ) {

    if( request.session.user.role == 'admin' ) {

        mysqlModule.mysqlPool.acquire( 

            function( error, mysqlConnection ) {

                mysqlConnection.query(
                    'SELECT * FROM RUN A LEFT JOIN commands B on A.mid = B.mid WHERE B.mid = ?', 
                    request.param( 'mid' ), 
                    function ( error, results ) {
        
                        if( results[ 0 ] && results[ 0 ].start && results[ 0 ].end ) {
            
                            results[ 0 ].startTime = commonFunctions.convertTime( results[ 0 ].start.toString() );
                            results[ 0 ].endTime   = commonFunctions.convertTime( results[ 0 ].end.toString() );
                            results[ 0 ].end       = commonFunctions.convertDate( results[ 0 ].end );
                            results[ 0 ].start     = commonFunctions.convertDate( results[ 0 ].start );
            
                        }
            
                        request.session.command = results[ 0 ];
            
                        next();
        
                        return;
                    }
                );

                mysqlModule.mysqlPool.release( mysqlConnection );

                return;
            }

        );

    }

    return;
}

// Get the specified agent group
exports.getAgentGroup = function( request, reponse, nextAction ) {

    mysqlModule.mysqlPool.acquire( 

        function( error, mysqlConnection ) {

            mysqlConnection.query(
                'SELECT             ' +
                '   cid AS cid,     ' +
                '   name AS name    ' + 
                'FROM               ' +
                '   class           ' +
                'WHERE              ' +
                '   cid = ?         ',
                request.param( 'cid' ), 
                function( error, results ) {
        
                    // Put the results into the session
                    request.session.agentgroup = results[ 0 ];
        
                    // Call next action
                    nextAction();
        
                    return;
                }

            );

            mysqlModule.mysqlPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get list of agents, who belong to the specified group
exports.getAgentsforGroup = function( request, response, nextAction ) {

    mysqlModule.mysqlPool.acquire( 

        function( error, mysqlConnection ) {

            mysqlConnection.query(
                'SELECT                               ' +
                '   agents.aid,                       ' +
                '   agents.hostname,                  ' +
                '   agents.address,                   ' +
                '   agents.model,                     ' +
                '   agents.serialnumber,              ' +
                '   agents.os,                        ' +
                '   agents.ssh,                       ' +
                '   agents.city,                      ' +
                '   agents.state,                     ' +
                '   agents.mac_address,               ' +
                '   agents.unknown,                   ' +
                '   agents.dataset,                   ' +
                '   class.name                        ' +
                'FROM                                 ' +
                '   agents,                           ' +
                '   class,                            ' +
                '   agentclass                        ' +
                'WHERE                                ' +
                '   agents.aid = agentclass.aid AND   ' +
                '   agentclass.cid = class.cid AND    ' +
                '   class.cid = ?                     ',
                request.param( 'cid' ), 
                function( error, results ) {
        
                    // Put the results into the session
                    request.session.groupagents = results;
        
                    // Call next action
                    nextAction();
        
                    return;
                }
        
            );

            mysqlModule.mysqlPool.release( mysqlConnection );

            return;
        }

    );

    return;
}
