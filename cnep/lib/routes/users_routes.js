// This module servers users page routes

var usersFunctions  = require( '../model/users' );
var commonFunctions = require( '../utilities/common' );
var authFunctions   = require( '../utilities/pass' );
var mysqlModule     = require( '../utilities/mysql' );

module.exports = function( mainApplication ) {

    // Route /users
    mainApplication.get(

        '/users',
        commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
        usersFunctions.users,
        function( request, response ) {

            response.render( 'users/users.html' );

            return;
        }

    );

    // Route /edit
    mainApplication.get(

        '/edit/:uid', 
        commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole, 
        usersFunctions.getUser, 
        function( request, response ) {

            response.render( 'users/user.html' );

            return;
        }
    );

    // Route 'Change password for application's user'
    mainApplication.post(

        '/password',
        commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
        function( request, response ) {

            authFunctions.hash( 
                request.body.password, 
                function( error, salt, hash ) {

                    var post  = {
                        hash: hash,
                        salt: salt
                    };

                    mysqlModule.mysqlPool.acquire( 

                        function( error, mysqlConnection ) {

                            mysqlConnection.query(
                                'UPDATE users       ' +
                                '   SET ?           ' +
                                '   WHERE uid = ?   ', 
                                [ post, request.body.uid ],
                                function( error, result ) {

                                    response.redirect( '/users' );
                            
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

    );

    // Route 'Update application's user'
    mainApplication.post(

        '/update',
        commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
        function( request, response ) {

            var post  = {
                email:       request.body.email,
                firstname:   request.body.name,
                lastname:    request.body.surname
            };

            mysqlModule.mysqlPool.acquire( 

                function( error, mysqlConnection ) {

                    mysqlConnection.query(
                        'UPDATE users   ' +
                        '  SET ?        ' +
                        '  WHERE uid = ?', 
                        [ post, request.body.uid ],
                        function( error, result ) {

                            if( error == null ) {

                                var group = {
                                  gid: request.body.role
                                };
                
                                mysqlConnection.query(
                                    'UPDATE usergroup   ' +
                                    '   SET ?           ' +
                                    '   WHERE uid = ?   ', 
                                    [ group, request.body.uid ], 
                                    function( error, results ) {

                                        if( error != null ) {

                                            request.session.error = "Error: " + error.message;

                                            response.render( 'users/user.html' );

                                        }
                                        else {

                                           response.redirect( '/users' );

                                        }

                                        return;
                                    }

                                );

                            }
                            else {

                                request.session.error = "Error: " + error.message;

                                response.render( 'users/user.html' );
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

    // Route 'Delete the application's user'
	mainApplication.get(
	
	    '/delete/:uid', 
	    commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole, 
	    function( request, response ) {
	
	        mysqlModule.mysqlPool.acquire( 
	
	            function( error, mysqlConnection ) {
	
	                // Clean-user
	                mysqlConnection.query(
	                    'DELETE FROM users WHERE uid = ?', 
	                    request.param( 'uid' ), 
	                    function( error, results ) {}
	                );
	        
	                // Clean-user-group-relation
	                mysqlConnection.query(
	                    'DELETE FROM usergroup WHERE uid = ?', 
	                    request.param( 'uid' ),
	                    function( error, results ) {
	        
	                        response.redirect( '/users' );
	        
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

	// Route 'Create application's user'
	mainApplication.post(
	
	    '/create',
	    commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
	    function( request, response ) {
	
	        if( request.body.username == '' || request.body.password == '' ) {
	
	            request.session.error = "Error: username or password cannot be empty";
	
	            response.redirect( '/users' );
	
	        }
	        else {
	
	            authFunctions.hash(
	                request.body.password, 
	                function( error, salt, hash ) {
	    
	                    var post  = {
	                        login:      request.body.username,
	                        hash:       hash,
	                        salt:       salt,
	                        email:      request.body.email,
	                        firstname:  request.body.name,
	                        lastname:   request.body.surname
	                    };
	    
	                    mysqlModule.mysqlPool.acquire( 
	    
	                        function( error, mysqlConnection ) {
	    
	                            mysqlConnection.query(
	                                'INSERT INTO users SET ?', 
	                                post, 
	                                function( error, result ) {
	    
	                                    if( ! error ) {
	    
	                                        var group = {
	                                            uid: result.insertId,
	                                            gid: request.body.role
	                                        };
	                
	                                        mysqlConnection.query(
	                                            'INSERT INTO usergroup SET ?', 
	                                            group, 
	                                            function( error, results ) {
	    
	                                                if( error != null ) {
	    
	                                                    request.session.error = "Error: " + error.message;
	    
	                                                }   
	    
	                                                response.redirect( '/users' );
	                
	                                                return;
	                                            }
	                                        );
	    
	                                    }
	                                    else {
	    
	                                        request.session.error = "Error: " + error.message;
	    
	                                        response.redirect( '/users' );
	    
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
	
	        }
	
	        return;
	    }
	
	);

    return;
}
