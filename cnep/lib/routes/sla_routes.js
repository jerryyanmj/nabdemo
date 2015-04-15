// This module servers sla page routes

var commonFunctions = require( '../utilities/common' );
var slaFunctions    = require( '../model/SLA' );

module.exports = function( mainApplication ) {

    // Route /ajax/sla-routes.json
    mainApplication.get(

        '/ajax/sla-routes.json',
        commonFunctions.checkSession,
        slaFunctions.sla_routes

    );

    // Route /ajax/sla-sources.json
    mainApplication.get(

        '/ajax/sla-sources.json',
        commonFunctions.checkSession,
        slaFunctions.sla_sources

    );

    // Route /ajax/sla-targets.json
    mainApplication.get(

        '/ajax/sla-targets.json',
        commonFunctions.checkSession,
        slaFunctions.sla_targets

    );

    // Route /ajax/sla-table-data.json
    mainApplication.get(

        '/ajax/sla-table-data.json',
        commonFunctions.checkSession,
        slaFunctions.sla_table_data

    );

	// Route 'SLA endpoints and init'
	mainApplication.get(
	
	    '/ajax/city-routes-request', 
	    commonFunctions.checkSession,  
	    function( request, response, nextAction ) {
	
	        response.json( { 'id' : 1 } );
	
	        return;
	    }

	);

	// Route /SLA-monitoring
	mainApplication.get(
	
	    '/SLA-monitoring',
	    commonFunctions.checkSession,
	    function( request, response ) {
	
	        response.render( 'sla_monitoring/sla.html' );
	
	        return;
	    }
	
	);

    return;
}
