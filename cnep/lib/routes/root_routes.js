// This module servers root page routes

var commonFunctions = require( '../utilities/common' );

module.exports = function( mainApplication ) {

    // Route /
    mainApplication.get(

        '/',
        commonFunctions.checkSession,
        commonFunctions.index

    );

    // Route /index
    mainApplication.get(

        '/index',
        commonFunctions.checkSession,
        commonFunctions.index

    );

    // Route /index.html
    mainApplication.get(
    
        '/index.html',
        commonFunctions.checkSession,
        commonFunctions.index

    );

    // Route /home
    mainApplication.get(

        '/home',
        commonFunctions.checkSession,
        commonFunctions.index

    );

    // Route /login
    mainApplication.get(

        '/login',
        function( request, response ) {

            if( request.session.user != null ) {

                response.redirect( '/cnep/index' );

            }
            else {

                response.render( '/login.html' );

            }

            return;
        }

    );

	

	mainApplication.get(

        '/dashboard-up',
        function( request, response ) {
		 try {
           response.json(true);
		} catch (exeception) {
        response.send(404);
    }
          

            return;
        }

    );


    // Route /logout
    mainApplication.get(

        '/logout',
        commonFunctions.checkSession,
        function( request, response ) {

            // Destroy the session
            request.session.destroy(); 

            response.redirect( '/cnep/' );

            return;
        }

    );

    // Application's user authentication
    mainApplication.post(

        '/login',
        function( request, response ) {

            commonFunctions.authenticate(

                request.body.username, 
                request.body.password, 
                function( generatedError, user ) {
        
                    if( user ) {
        
                        request.session.regenerate(
        
                            function () {
        
                                request.session.user = user;
        
                                response.redirect( '/cnep/executive-dashboard' );
        
                                return;
                            }

                        );
                    }
                    else {

                        response.render( '/login.html', { error: generatedError } );

                    }

                    return;
                }

            );

            return;
        }

    );

    return;
}
