// This module servers agents operations page routes

var agentOperationsFunctions = require( '../model/agent_operations' );
var commonFunctions          = require( '../utilities/common' );
var logsFunctions            = require( '../utilities/logs' );
var mysqlModule              = require( '../utilities/mysql' );

module.exports = function( mainApplication ) {

    // Route /ajax/collector-logs.json
    // This route page is used for retrieve the collector component logs
    mainApplication.get(

        '/ajax/collector-logs.json',
        commonFunctions.checkSession,

        logsFunctions.get_collector_logs

    );

	// Route /ajax/collector-status.json
	// This rute page is used for retrieve the collector component status
	mainApplication.get(
	
	    '/ajax/collector-status.json',
	    commonFunctions.checkSession,
	    logsFunctions.get_collector_status
	
	);

    // Route /ajax/cep-logs.json
	// This route page is used for retrieve the CEP logs
	mainApplication.get(

	    '/ajax/cep-logs.json', 
	    commonFunctions.checkSession,
	    logsFunctions.get_cep_logs

	);

    // Route /agents-mapping
    mainApplication.get(
    
        '/agents-mapping',
        commonFunctions.checkSession,
        function( request, response ) {
    
            response.render( 'operations/agentsmapping.html', { client_ip_address: request.connection.remoteAddress || '' } );
    
            return;
        }
    
    );

    // Get information about agents mapping 
    mainApplication.get(

        '/ajax/get_agents_mapping.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getAgentsMapping

    );

    // Route /agents-availability
    mainApplication.get(
    
        '/agents-availability',
        commonFunctions.checkSession,
        function( request, response ) {

            response.render( 'operations/agentsavailability.html', { client_ip_address: request.connection.remoteAddress || '' } );

            return;
        }
    
    );

    // Get information about agents availability 
    mainApplication.get(

        '/ajax/get_agents_availability.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getAgentsAvailability

    );

    // Route /agent-operations stats
    mainApplication.get(

        '/agent-operations', 
        commonFunctions.checkSession,

        function( request, response ) {

            response.render( 'operations/agent_operations.html' ); 

            return;
        }

    );

    // Get information about agents gauges data 
    mainApplication.get(

        '/ajax/agent-gauges-logs.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getAgentGaugesLogs

    );

    // Route /agents-mapping-latency
    mainApplication.get(
    
        '/agents-mapping-latency',
        commonFunctions.checkSession,
        function( request, response ) {
    
            response.render( 'operations/agentsmappinglatency.html' );
    
            return;
        }
    
    );

    // Get information about agents mapping latency 
    mainApplication.get(

        '/ajax/get_agents_mapping_latency.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getAgentsMappingLatency

    );

    // Route /agents-mapping-loss
    mainApplication.get(

        '/agents-mapping-loss',
        commonFunctions.checkSession,
        function( request, response ) {
    
            response.render( 'operations/agentsmappingloss.html' );
    
            return;
        }
    
    );

    // Get information about agents mapping loss 
    mainApplication.get(

        '/ajax/get_agents_mapping_loss.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getAgentsMappingLoss

    );

    // Route /routers-mapping-loss
    mainApplication.get(
    
        '/routers-mapping-loss',
        commonFunctions.checkSession,
        function( request, response ) {
    
            response.render( 'operations/routersmappingloss.html' );
    
            return;
        }
    
    );

    // Get information about routers mapping loss 
    mainApplication.get(

        '/ajax/get_routers_mapping_loss.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getRoutersMappingLoss

    );

    // Route /routers-mapping-jitter
    mainApplication.get(
    
        '/routers-mapping-jitter',
        commonFunctions.checkSession,
        function( request, response ) {
    
            response.render( 'operations/routersmappingjitter.html' );
    
            return;
        }
    
    );

    // Get information about routers mapping jitter 
    mainApplication.get(

        '/ajax/get_routers_mapping_jitter.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getRoutersMappingJitter

    );

    // Route /routers-mapping-latency
    mainApplication.get(
    
        '/routers-mapping-latency',
        commonFunctions.checkSession,
        function( request, response ) {
    
            response.render( 'operations/routersmappinglatency.html' );
    
            return;
        }
    
    );

    // Get information about routers mapping latency 
    mainApplication.get(

        '/ajax/get_routers_mapping_latency.json',
        commonFunctions.checkSession,
        agentOperationsFunctions.getRoutersMappingLatency

    );

    return;
}
