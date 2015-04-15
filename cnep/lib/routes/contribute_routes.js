// This module servers contribute page routes

var commonFunctions = require( '../utilities/common' );

module.exports = function( mainApplication ) {

    // Route /contribute
    mainApplication.get(

        '/contribute',
        commonFunctions.checkSession,
        function( request, response ) {

            response.render( 'contribute/contribute.html' );

            return;
        }

    );

    return;
}
