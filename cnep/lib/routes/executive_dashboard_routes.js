// This module servers executive dashboard page routes

var commonFunctions             = require( '../utilities/common' );
var executiveDashboardFunctions = require( '../model/executive_dashboard' );

module.exports = function( mainApplication ) {

	// Route /ajax/executive/cityRoutes
	mainApplication.get(
	
	    '/ajax/executive/cityRoute/:route', 
	    commonFunctions.checkSession, 
	    executiveDashboardFunctions.cityRoute
	
	);

	// Route /ajax/executive/cityRoutes
	mainApplication.get(
	
	    '/ajax/executive/cityRoutes', 
	    commonFunctions.checkSession, 
	    executiveDashboardFunctions.cityRoutes
	
	);

	// Route /ajax/city-routes.json
	mainApplication.get(
	
	    '/ajax/city-routes.json', 
	    commonFunctions.checkSession, 
	    executiveDashboardFunctions.city_routes
	
	);

	// Route /ajax/city-routes-sla.json
	// This route page is used for retrieve the information from sla_sources, sla_targets collections
	mainApplication.get(
	
	    '/ajax/city-routes-sla.json', 
	    commonFunctions.checkSession, 
	    executiveDashboardFunctions.sla_city_routes
	
	);

	// Route /executive-dashboard
	mainApplication.get(
	
	    '/executive-dashboard', 
	    commonFunctions.checkSession, 
	    function( request, response ) {
	
	        response.render( 'executive_dashboard/executive.html' );
	
	        return;
	    }
	
	);

    return;
}
