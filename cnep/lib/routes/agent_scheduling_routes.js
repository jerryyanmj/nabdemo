// This module servers agents scheduling page routes

var agentSchedulingFunctions = require( '../model/agent_scheduling' );
var commonFunctions          = require( '../utilities/common' );
var logsFunctions            = require( '../utilities/logs' );
var mysqlModule              = require( '../utilities/mysql' );

module.exports = function( mainApplication ) {

    // Route /agent-scheduling
	mainApplication.get(
	
	    '/agent-scheduling',
	    commonFunctions.checkSession,
	    commonFunctions.checkSessionUserAdminRole, 
	    function( request, response ) {
	
	        request.session.agents = null;
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                mysqlConnection.query(
	                    'SELECT A.*,                            ' +
	                    '   C.name AS class                     ' +
	                    'FROM agents A                          ' +
	                    '   LEFT JOIN agentclass                ' +
	                    '   B on A.aid = B.aid LEFT JOIN class  ' +
	                    '   C on B.cid = C.cid',
	                    function ( error, results ) {
	        
	                        request.session.agents = results;
	        
	                        response.render( 'operations/agentslist.html' );
	        
	                        return;
	                    }
	        
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }
	
	);

    // Route /agent-groups-scheduling
	mainApplication.get(
	
	    '/agent-groups-scheduling',
	    commonFunctions.checkSession,
	    commonFunctions.checkSessionUserAdminRole, 
	    function( request, response ) {
	
	        // Initialize agents groups
	        request.session.agentsgroups = null;
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                mysqlConnection.query(
	                    'SELECT     ' +
	                    '   cid,    ' +
	                    '   name    ' +
	                    'FROM       ' +
	                    '   class   ',
	                    function ( error, results ) {
	        
	                        request.session.agentsgroups = results;
	        
	                        response.render( 'operations/agentgroupslist.html' );
	        
	                        return;
	                    }
	        
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }
	
	);

    // Route /add-new-agent
	mainApplication.get(
	
	    '/add-new-agent',
	    commonFunctions.checkSession, 
	    commonFunctions.checkSessionUserAdminRole,
	    agentSchedulingFunctions.createAgent,
	    agentSchedulingFunctions.getAgentsGroups,
	    function( request, response ) {
	
	        response.render( 'operations/agent.html' );
	
	        return;
	    }
	
	);

    // Route /agent/edit
	mainApplication.get(
	
	    '/agent/edit/:aid', 
	    commonFunctions.checkSession, 
	    commonFunctions.checkSessionUserAdminRole,
	    agentSchedulingFunctions.getAgent,
	    agentSchedulingFunctions.getAgentsGroups,
	    function( request, response ) {
	
	        response.render( 'operations/agent.html' );
	
	        return;
	    }
	
	);

    // Route /add-new-agent-group
	mainApplication.get(
	
	    '/add-new-agent-group',
	    commonFunctions.checkSession, 
	    commonFunctions.checkSessionUserAdminRole,
	    agentSchedulingFunctions.createAgentGroup,
	    function( request, response ) {
	
	        response.render( 'operations/agentgroup.html' );
	
	        return;
	    }
	
	);

    // Route /agent 
	mainApplication.get(
	
	    '/agent/:aid', 
	    commonFunctions.checkSession, 
	    commonFunctions.checkSessionUserAdminRole,
	    agentSchedulingFunctions.getAgentCommands, 
	    function( request, response ) {
	
	        // If previous actions have been performed successfully
	        if( request.session.error == null ) {
	
	            request.session.aid = request.param( 'aid' );
	    
	            mysqlModule.mysqlPool.acquire( 
	    
	                function( error, mysqlConnection ) {
	
	                    mysqlConnection.query(
	                        'SELECT cid FROM agentclass WHERE aid = ?', 
	                        request.param( 'aid' ),
	                        function ( error, results ) {
	            
	                            request.session.cid = 1;
	            
	                            if( results[ 0 ] ) {
	            
	                                request.session.cid = results[ 0 ].cid;
	            
	                            }
	            
	                            response.render( 'operations/commands.html' );
	            
	                            return;
	                        }
	            
	                    );
	    
	                    mysqlModule.mysqlPool.release( mysqlConnection );
	    
	                    return;
	                }
	    
	            );
	
	        }
	        else {
	
	            response.redirect( '/agent-scheduling' );
	
	        }
	
	        return;
	    }
	
	);

	// Route /commands/edit
	mainApplication.get(
	
	    '/commands/edit/:mid', 
	    commonFunctions.checkSession, 
	    commonFunctions.checkSessionUserAdminRole,
	    agentSchedulingFunctions.getCommand, 
	    function( request, response ) {
	
	        response.render( 'operations/command.html' );
	
	        return;
	    }
	);

	// Route /agentgroup/edit
	mainApplication.get(
	
	    '/agentgroup/edit/:cid', 
	    commonFunctions.checkSession, 
	    commonFunctions.checkSessionUserAdminRole,
	    agentSchedulingFunctions.getAgentGroup, 
	    function( request, response ) {
	
	        response.render( 'operations/agentgroup.html' );
	
	        return;
	    }
	);

	// Route /agentgroup
	mainApplication.get(
	
	    '/agentgroup/:cid', 
	    commonFunctions.checkSession,
	    commonFunctions.checkSessionUserAdminRole,
	    agentSchedulingFunctions.getAgentGroup,
	    agentSchedulingFunctions.getAgentsforGroup,
	    function( request, response ) {
	
	        response.render( 'operations/groupagentslist.html' );
	
	        return;
	    }
	
	);

    // Route 'Add new command for the agent's group'
	mainApplication.post(
	
	    '/agentgroup/add_command', 
	    commonFunctions.checkSession,
	    commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                // Get all the agents, who is linked with the specified group
	                mysqlConnection.query(
	                    'SELECT                             ' +
	                    '   agentclass.aid AS aid,          ' +
	                    '   agents.unknown AS unknown_flag  ' +
	                    'FROM                               ' +
	                    '   agentclass,                     ' +
	                    '   agents                          ' +
	                    'WHERE                              ' +
	                    '   agents.aid = agentclass.aid AND ' +
	                    '   agentclass.cid = ?              ',
	                    request.body.cid, 
	                    function( error1, result1 ) { 
	        
	                        var command = {
	                            text: request.body.command
	                        };
	        
	                        // Add new command
	                        mysqlConnection.query(
	                            'INSERT INTO commands SET ?',
	                            command,
	                            function( error2, result2 ) {
	        
	                                var runningCommand;
	        
	                                // Insert the command into the running commands
	                                for( var i = 0; i < result1.length; i++ ) {
	        
	                                    // Insert the command only if agent is not unknown
	                                    if( result1[ i ].unknown_flag != 1 ) {
	        
	                                        runningCommand = {
	                                            aid:        result1[ i ].aid,
	                                            cid:        request.body.cid,
	                                            mid:        result2.insertId,
	                                            repeat:     request.body.quantity,
	                                            priority:   request.body.priority,
	                                            frequency:  request.body.frequency,
	                                            start:      request.body.datestart + ' ' + request.body.timestart,
	                                            end:        request.body.dateend + ' ' + request.body.timeend
	                                        };
	            
	                                        mysqlConnection.query(
	                                            'INSERT INTO RUN SET ?',
	                                            runningCommand,
	                                            function( error3, result3 ) {
	            
	                                                return;
	                                            }
	                                        );
	        
	                                    }
	        
	                                }
	        
	                                // Redirect to the target page
	                                response.redirect( '/agentgroup/' + request.body.cid );
	        
	                                return;
	                            }
	                        );
	        
	                        return;
	                    }
	        
	                );            
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }

	);

	// Route 'Delete agent's group and all the related commands'
	mainApplication.get(
	
	    '/agentgroup/delete/:cid', 
	    commonFunctions.checkSession, 
	    commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                // Set all the agents of this group as unknown
	                mysqlConnection.query(
	        
	                    'UPDATE                             ' +
	                    '   agents,                         ' +
	                    '   agentclass,                     ' +
	                    '   class                           ' +
	                    'SET agents.unknown = 1             ' +
	                    'WHERE                              ' +
	                    '   agents.aid = agentclass.aid AND ' +
	                    '   agentclass.cid = class.cid AND  ' +
	                    '   class.cid = ?                   ',
	                    request.param( 'cid' ),
	                    function( error, results1 ) {
	        
	                        // Clean running commands for this agent group
	                        mysqlConnection.query(
	                
	                            'DELETE FROM RUN WHERE RUN.cid = ?', 
	                            request.param( 'cid' ), 
	                            function( error, results2 ) {
	                
	                                // Clean agent classes for this agent group
	                                mysqlConnection.query(
	                        
	                                    'DELETE FROM agentclass WHERE agentclass.cid = ?', 
	                                    request.param( 'cid' ), 
	                                    function( error, results3 ) {
	                
	                                        // Clean class for this agent group
	                                        mysqlConnection.query(
	                                    
	                                            'DELETE FROM class WHERE class.cid = ?', 
	                                            request.param( 'cid' ), 
	                                            function( error, results4 ) {
	                
	                                                response.redirect( '/agent-groups-scheduling' );
	                
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
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }
	
	);

	// Route 'Update agent's group'
	mainApplication.post(
	
	    '/agentgroup/update',
	    commonFunctions.checkSession,
	    commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        var post;
	        var group;
	    
	        post = {
	            name: request.body.name
	        };
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                mysqlConnection.query(
	                    'UPDATE class       ' +
	                    '   SET ?           ' +
	                    '   WHERE cid = ?   ', 
	                    [ post, request.body.cid ], 
	                    function( error, result ) {
	
	                        if( error != null ) {
	
	                            request.session.error = "Error: " + error.message;
	
	                            response.render( 'operations/agentgroup.html' );
	                        }
	                        else {
	
	                            response.redirect( '/agent-groups-scheduling' );
	
	                        }
	
	                        return;
	                    }
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }

	);

	// Route 'Create new agent's group'
	mainApplication.post(
	
	    '/agentgroup/create',
	    commonFunctions.checkSession,
	    commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        var post  = {
	            name: request.body.name
	        };
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                mysqlConnection.query(
	                    'INSERT INTO class SET ?', 
	                    post,
	                    function( error, result ) {
	
	                        if( error != null ) {
	
	                            request.session.error = "Error: " + error.message;
	
	                            response.render( 'operations/agentgroup.html' );
	
	                        }
	                        else {
	
	                            response.redirect( '/agent-groups-scheduling' );
	
	                        }
	
	                        return;
	                    }
	
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }
	
	);

	// Route 'Update the specified command'
	mainApplication.post(
	
	    '/commands/update',
	    commonFunctions.checkSession,
	    commonFunctions.checkSessionUserAdminRole, 
	    function( request, response ) { 
	
	        var command;
	        var post;
	        var unknown_agent_flag;
	    
	        command = {
	            text: request.body.command
	        }
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                // Get the agent's status
	                mysqlConnection.query(
	                    'SELECT         ' +
	                    '   unknown     ' +
	                    'FROM           ' +
	                    '   agents      ' +
	                    'WHERE          ' +
	                    '   aid = ?     ', 
	                    request.body.aid, 
	                    function( error, result ) {
	            
	                        unknown_agent_flag = result[ 0 ].unknown;
	            
	                        post = {
	                            mid:       request.body.mid,
	                            aid:       ( unknown_agent_flag == 1 ? '' : request.body.aid ), 
	                            cid:       request.body.cid,
	                            repeat:    request.body.quantity,
	                            frequency: request.body.frequency,
	                            priority:  request.body.priority,
	                            start:     request.body.datestart + ' ' + request.body.timestart,
	                            end:       request.body.dateend + ' ' + request.body.timeend
	                        };
	        
	                        mysqlConnection.query(
	                            'UPDATE commands    ' +
	                            '   SET ?           ' +
	                            '   WHERE mid = ?   ', 
	                            [ command, request.body.mid ], 
	                            function( error, result ) {
	                
	                                mysqlConnection.query(
	                                    'UPDATE RUN ' +
	                                    '   SET ? ' +
	                                    '   WHERE mid = ?', 
	                                    [ post, request.body.mid ], 
	                                    function( error, results ) {
	                
	                                        response.redirect( '/agent/' + request.body.aid );
	        
	                                        return;
	                                    }
	        
	                                );
	        
	                                return;
	                            }
	        
	                        );
	        
	                        return;
	                    }
	        
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }
	
	);

	// Route 'Update the specified agent'
	mainApplication.post(
	
	    '/agent/update', 
	    commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        var post;
	        var group;
	    
	        post = {
	            aid:          request.body.aid,
	            mac_address:  request.body.mac_address,
	            hostname:     request.body.hostname,
	            address:      request.body.address,
	            model:        request.body.model,
	            serialnumber: request.body.serialnumber,
	            os:           request.body.os,
	            ssh:          request.body.ssh,
	            city:         request.body.city,
	            state:        request.body.state,
	            unknown:      request.body.unknown
	        };
	
	        if( post.aid == '' ) {
	
	            request.session.error = "Error: Agent identifier cannot be empty";
	
	            response.render( 'operations/agent.html' );

	        }
	        else {
	
	            mysqlModule.mysqlPool.acquire( 
	    
	                function( error, mysqlConnection ) {
	    
	                    mysqlConnection.query(
	                        'UPDATE agents      ' +
	                        '   SET ?           ' +
	                        '   WHERE aid = ?   ', 
	                        [ post, request.session.agent.aid ], 
	                        function( error, result ) {
	
	                            if( error == null ) {
	            
	                                // If it is an unknown agent, delete all the records from commands, RUN table, associated with this agent, as known one
	                                if( post.unknown == 1 ) {
	                
	                                    mysqlConnection.query(
	                                        'DELETE FROM commands                                                   ' +
	                                        '   WHERE commands.mid IN ( SELECT RUN.mid FROM RUN WHERE RUN.aid = ? ) ', 
	                                        post.aid, 
	                                        function( error, result ) {}
	                                    );
	                
	                                    mysqlConnection.query( 
	                                        'DELETE FROM RUN ' +
	                                        '   WHERE aid = ?', 
	                                        post.aid, 
	                                        function( error, result ) {}
	                                    );
	                
	                                }
	                
	                                group = {
	                                    cid: request.body.class
	                                };
	                
	                                mysqlConnection.query(
	                                    'DELETE FROM agentclass ' +
	                                    '   WHERE aid = ?       ', 
	                                    request.body.aid, 
	                                    function( error, results ) {
	                
	                                        group = {
	                                            aid: post.aid,
	                                            cid: request.body.class
	                                        };
	                
	                                        mysqlConnection.query(
	                                            'INSERT INTO agentclass SET ?', 
	                                            group, 
	                                            function( error, results ) {
	                
	                                                response.redirect( '/agent-scheduling' );
	                
	                                                return;
	                                            }
	    
	                                        );
	                
	                                        return;
	                                    }
	    
	                                );
	
	                            }
	                            else {
	
	                                request.session.error = "Error: " + error.message;
	
	                                response.render( 'operations/agent.html' );
	
	                            }
	
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
	
	);

	// Route 'Create the new agent'
	mainApplication.post(
	
	    '/agent/create',
	    commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        var post  = {
	            aid:          commonFunctions.guid(),
	            mac_address:  request.body.mac_address,
	            hostname:     request.body.hostname,
	            address:      request.body.address,
	            model:        request.body.model,
	            serialnumber: request.body.serialnumber,
	            os:           request.body.os,
	            ssh:          request.body.ssh,
	            city:         request.body.city,
	            state:        request.body.state,
	            unknown:      request.body.unknown
	        };
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                mysqlConnection.query(
	                    'INSERT INTO agents SET ?', 
	                    post,
	                    function( error, result ) { 
	        
	                        // If agent is known, add information about agent's class
	                        if( request.body.unknown != 1 ) {
	        
	                            var group = {
	                                aid: post.aid,
	                                cid: request.body.class
	                            };
	            
	                            mysqlConnection.query(
	                                'INSERT INTO agentclass SET ?', 
	                                group, 
	                                function( error, results ) {
	            
	                                    return;
	                                }
	                            );
	        
	                        }
	        
	                        response.redirect( '/agent-scheduling' );
	        
	                        return;
	                    }
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }
	
	);

	// Route 'Create the new command'
	mainApplication.post(
	
	    '/commands/create',
	    commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        var command;
	        var post;
	        var unknown_agent_Listflag;
	    
	        // Get the command text
	        command = {
	            text: request.body.command
	        }
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                // Get the agent's status
	                mysqlConnection.query(
	                    'SELECT         ' +
	                    '   unknown     ' +
	                    'FROM           ' +
	                    '   agents      ' +
	                    'WHERE aid = ?  ', 
	                    request.body.aid,
	                    function( error, result ) {
	        
	                        unknown_agent_flag = result[ 0 ].unknown;
	        
	                        return;
	                    }
	                );
	        
	                // Insert new command
	                mysqlConnection.query(
	                    'INSERT INTO commands SET ?', 
	                    command, 
	                    function( error, result ) {
	            
	                        post = {
	                            mid:       result.insertId,
	                            aid:       ( unknown_agent_flag == 1 ? '' : request.body.aid ),
	                            cid:       request.body.cid,
	                            repeat:    request.body.quantity,
	                            frequency: request.body.frequency,
	                            priority:  request.body.priority,
	                            start:     request.body.datestart + ' ' + request.body.timestart,
	                            end:       request.body.dateend + ' ' + request.body.timeend
	                        };
	            
	                        mysqlConnection.query(
	                            'INSERT INTO RUN SET ?',
	                            post,
	                            function( error, results ) {
	                
	                                response.redirect( '/agent/' + request.body.aid );
	        
	                                return;     
	                            }
	                        );
	        
	                        return;
	                    }
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }

	);

	// Delete the specified command
	mainApplication.get(
	
	    '/commands/delete/:mid', 
	    commonFunctions.checkSession, 
        commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                mysqlConnection.query(
	        
	                    'DELETE FROM RUN WHERE mid = ?', 
	                    request.param( 'mid' ), 
	                    function( error, results ) {}
	        
	                );
	        
	                mysqlConnection.query(
	        
	                    'DELETE FROM commands WHERE mid = ?', 
	                    request.param( 'mid' ), 
	                    function( error, results ) {
	        
	                        response.redirect( '/agent/' + request.session.aid );
	        
	                        return;
	                    }
	        
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }

	);

	// Delete the specified agent
	mainApplication.get(
	
	    '/agent/delete/:aid', 
	    commonFunctions.checkSession, 
        commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                // Clean created commands for this user
	                mysqlConnection.query(
	
	                    'DELETE FROM commands WHERE commands.mid IN ( SELECT RUN.mid FROM RUN WHERE RUN.aid = ? )', 
	                    request.param( 'aid' ), 
	                    function( error, results ) {
	                    }
	
	                );
	        
	                // Clean running commands for this user
	                mysqlConnection.query(
	
	                    'DELETE FROM RUN WHERE RUN.aid = ?', 
	                    request.param( 'aid' ), 
	                    function( error, results ) {
	                    }
	        
	                );
	        
	                // Clean user
	                mysqlConnection.query( 
	
	                    'DELETE FROM agents WHERE aid = ?', 
	                    request.param( 'aid' ), 
	                    function( error, results ) {
	                    } 
	        
	                );
	            
	                // Clean user-group-relation
	                mysqlConnection.query( 
	
	                    'DELETE FROM agentclass WHERE aid = ?', 
	                    request.param( 'aid' ), 
	                    function ( error, results ) {
	            
	                        response.redirect( '/agent-scheduling' );
	        
	                        return;
	                    }
	                );
	
	                mysqlModule.mysqlPool.release( mysqlConnection );
	
	                return;
	            }
	
	        );
	
	        return;
	    }

	);

    return;
}
