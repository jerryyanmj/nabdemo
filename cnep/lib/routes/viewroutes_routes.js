// This module servers view routes page routes

var commonFunctions     = require( '../utilities/common' );
var viewroutesFunctions = require( '../model/view_routes' );

module.exports = function( mainApplication ) {

	// Route /view-user-route
	mainApplication.get(
	
	    '/view-user-route',
	    function( request, response ) {
	
	        response.render( 'view_routes/viewroute.html' );
	
	        return;
	    }
	
	);

	// Route /view-user-routes
	mainApplication.get(
	
	    '/view-user-routes',
	    function( request, response ) {
	
	        // Save the user public facing IP address
	        request.session.user_source_ip_address = request.param( 'ip_address' );
	
	        // Redirect to the final page route
	        response.redirect( '/view-user-route' );
	
	        return;
	    }
	
	);

	// Route /view-routes
	mainApplication.get(
	
	    '/view-routes', 
	    commonFunctions.checkSession, 
	    function( request, response ) {
	
	        response.render( 'view_routes/viewroutes.html' );
	
	        return;
	    }
	
	);

	// View Route endpoint without authentication. This page route is used for View Route page
	mainApplication.get(
	
	    '/ajax/view-route-source-data/:source/:timeRange', 
	    viewroutesFunctions.sla_source_route_data
	
	);

	// View Routes endpoints with authentication. This page route is used for View Routes page
	mainApplication.get(
	
	    '/ajax/view-routes-source-data/:source/:timeRange', 
	    commonFunctions.checkSession,
	    viewroutesFunctions.sla_source_route_data

	);

	// View Routes endpoints with authentication. This page route is used for View Routes page
	mainApplication.get(

	    '/ajax/view-routes-sources.json', 
	    commonFunctions.checkSession, 
	    viewroutesFunctions.sla_sources

	);

	// View Route endpoint without authentication. This page route is used for View Route page
	mainApplication.get(
	
	    '/ajax/view-route-sources.json', 
	    viewroutesFunctions.sla_sources

	);

    return;
}
