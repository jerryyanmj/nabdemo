// This module servers live routes page routes

var commonFunctions    = require( '../utilities/common' );
var liverouteFunctions = require( '../model/live_routes.js' );

module.exports = function( mainApplication ) {

	// Route /live-routes
	mainApplication.get(
	
	    '/live-routes',
	    commonFunctions.checkSession,
	    function( request, response ) {
	
	        response.render( 'live_routes/liveroutes.html', { client_ip_address: request.connection.remoteAddress || '' } );
	
	        return;
	    }
	
	);

	// Live Routes endpoints and init
	mainApplication.get(
	
	    '/ajax/agent/update', 
	    commonFunctions.checkSession, 
	    liverouteFunctions.update_action
	
	);
	
	// Live Routes endpoints and init 
	mainApplication.get(
	
	    '/ajax/worst-performing-routes.json',
	    commonFunctions.checkSession,
	    liverouteFunctions.worst_performing_routes
	
	);

    return;
}
