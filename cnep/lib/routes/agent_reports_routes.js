// This module servers agents reports page routes

var agentReportsFunctions           = require( '../model/agent_reports' );
var agentExcelReportsFunctions      = require( '../model/agent_excel_reports' );
var edgeNodeReportsFunctions        = require( '../model/edge_node_reports' );
var routersReportsFunctions         = require( '../model/routers_reports' );
var executiveSourceReportsFunctions = require( '../model/executive_source_reports' );
var top25ReportsFunctions           = require( '../model/top25_reports' );
var commonFunctions                 = require( '../utilities/common' );

module.exports = function( mainApplication ) {

    // Route /Executive-report-charts-source
    mainApplication.get(

	   '/executive-source-report', 
       commonFunctions.checkSession,
       function( request, response ) {

 	      response.render( 'reports/reportsexecutivesource.html' );

      	  return;
      	}

    );

    // Route /executive-source-pdf
    mainApplication.get(

        '/executive-source-pdf',
        commonFunctions.checkSession,
        function( request, response ) {

            response.render( 'reports/executivesourcepdf.html' );

            return;
        }

    );

    // Route /edge-nodes-pdf
    mainApplication.get(

        '/edge-nodes-pdf',
        commonFunctions.checkSession,
        function( request, response ) {

            response.render( 'reports/edgenodepdf.html' );

            return;
        }

    );

    // Route /routers-pdf
    mainApplication.get(

        '/routers-pdf',
        commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
        function( request, response ) {

            response.render( 'reports/routerspdf.html' );

            return;
        }

    );

    // Route Edge Node Report
    mainApplication.get(

        '/edge-node-report',
        commonFunctions.checkSession,
	    function( request, response ) {

            response.render( 'reports/reportsedgenode.html' );

            return;
        }

    );

    // Route TOP 25 List
    mainApplication.get(

        '/top-25-list',
        commonFunctions.checkSession,
            function( request, response ) {

            response.render( 'reports/reporttop25lists.html' );

            return;
        }

    );

    // Route /agent-routers-report
    mainApplication.get(

        '/routers-summary-report',
        commonFunctions.checkSession,
        commonFunctions.checkSessionUserAdminRole,
            function( request, response ) {

            response.render( 'reports/reportsrouters.html' );

            return;
        }

    );

    // Route /agent-reports-jitter
    mainApplication.get(

	    '/agent-reports-jitter', 
	    commonFunctions.checkSession,
	    agentReportsFunctions.getCurrentAgentsHistoricalJitterReport,
	    agentReportsFunctions.getTopTenWorstSourcesJitterReport,
	    function( request, response ) {

            response.render( 'reports/reportsjitter.html' );

	        return;
	    }
	
	);

    // Route /agent-reports-trend
    mainApplication.get(

        '/agent-reports-trend', 
        commonFunctions.checkSession,
        agentReportsFunctions.getCurrentAgentsHistoricalLatencyReport,
        agentReportsFunctions.getCurrentAgentsHistoricalLossReport,
        function( request, response ) {

            response.render( 'reports/reportstrend.html' );
    
            return;
        }
    
    );

    // Route /agent-reports-distance
    mainApplication.get(

        '/agent-reports-distance', 
        commonFunctions.checkSession,
        agentReportsFunctions.getCurrentAgentsDistanceAndSpeedReport,
        function( request, response ) {

            response.render( 'reports/reportsdistance.html' );
    
            return;
        }
    
    );

    // Route /export-to-excel-jitter
    mainApplication.get(

        '/export-to-excel-jitter', 
        commonFunctions.checkSession,
        agentReportsFunctions.getCurrentAgentsHistoricalJitterReport,
        agentExcelReportsFunctions.generateExcelOutputJitterReport,
        function( request, response ) {

            response.render( 'reports/reportsjitter.html' );

            return;
        }
    
    );

    // Route /agent-reports-disconnected-agents
    mainApplication.get(

        '/agent-reports-disconnected-agents', 
        commonFunctions.checkSession,
        agentReportsFunctions.getDisconnectedAgentsReport,
        function( request, response ) {

            response.render( 'reports/reportsdisconnectedagents.html' );

            return;
        }
    
    );

    // Route /export-to-excel-top-worst-sources
    mainApplication.get(

        '/export-to-excel-top-worst-sources', 
        commonFunctions.checkSession,
        agentReportsFunctions.getTopTenWorstSourcesJitterReport,
        agentExcelReportsFunctions.generateExcelOutputTopTenWorstSourcesJitterReport,
        function( request, response ) {

            response.render( 'reports/reportsjitter.html' );

            return;
        }
    
    );

    // Route /export-to-excel-disconnected-agents
    mainApplication.get(

        '/export-to-excel-disconnected-agents', 
        commonFunctions.checkSession,
        agentReportsFunctions.getDisconnectedAgentsReport,
        agentExcelReportsFunctions.generateExcelOutputDisconnectedAgentsReport,
        function( request, response ) {

            response.render( 'reports/reportsdisconnectedagents.html' );

            return;
        }
    
    );

    // Route /export-to-excel-distance-and-speed-report
    mainApplication.get(

        '/export-to-excel-distance-and-speed-report', 
        commonFunctions.checkSession,
        agentReportsFunctions.getCurrentAgentsDistanceAndSpeedReport,
        agentExcelReportsFunctions.generateExcelOutputDistanceAndSpeedReport,
        function( request, response ) {

            response.render( 'reports/reportsdistance.html' );

            return;
        }
    
    );

    // Route /export-to-excel-historical-latency-report
    mainApplication.get(

        '/export-to-excel-historical-latency-report', 
        commonFunctions.checkSession,
        agentReportsFunctions.getCurrentAgentsHistoricalLatencyReport,
        agentExcelReportsFunctions.generateExcelOutputHistoricalLatencyReport,
        function( request, response ) {

            response.render( 'reports/reportstrend.html' );

            return;
        }
    
    );

    // Route /export-to-excel-historical-loss-report
    mainApplication.get(

        '/export-to-excel-historical-loss-report', 
        commonFunctions.checkSession,
        agentReportsFunctions.getCurrentAgentsHistoricalLossReport,
        agentExcelReportsFunctions.generateExcelOutputHistoricalLossReport,
        function( request, response ) {

            response.render( 'reports/reportstrend.html' );

            return;
        }
    
    );

    // Route /ajax/loss-rate-by-edge-node-report-data.json
    mainApplication.get(

        '/ajax/loss-rate-by-edge-node-report-data.json', 
        commonFunctions.checkSession,

        edgeNodeReportsFunctions.getLossRateByEdgeNodeReport

    );

    // Route /ajax/latency-rate-by-edge-node-report-data.json
    mainApplication.get(

        '/ajax/latency-rate-by-edge-node-report-data.json', 
        commonFunctions.checkSession, 

        edgeNodeReportsFunctions.getLatencyRateByEdgeNodeReport

    );

    // Route /ajax/jitter-rate-by-edge-node-report-data.json
    mainApplication.get(

        '/ajax/jitter-rate-by-edge-node-report-data.json', 
        commonFunctions.checkSession, 

        edgeNodeReportsFunctions.getJitterRateByEdgeNodeReport

    );

    // Route /ajax/latency-rate-by-market-report-data.json
    mainApplication.get(

        '/ajax/latency-rate-by-market-report-data.json', 
        commonFunctions.checkSession, 

        executiveSourceReportsFunctions.getLatencyRateByMarketReport

    );

	
	// Route /ajax/loss-rate-by-market-report-data.json
    mainApplication.get(

        '/ajax/loss-rate-by-market-report-data.json', 
        commonFunctions.checkSession, 

        executiveSourceReportsFunctions.getLossRateByMarketReport

    );
    
    // Route /ajax/jitter-rate-by-market-report-data.json
    mainApplication.get(

        '/ajax/jitter-rate-by-market-report-data.json', 
        commonFunctions.checkSession, 

        executiveSourceReportsFunctions.getJitterRateByMarketReport

    );

    // Route /ajax/avg-speed-by-distance-report-data.json
    mainApplication.get(

        '/ajax/avg-speed-by-distance-report-data.json',
        commonFunctions.checkSession,

        executiveSourceReportsFunctions.getAvgSpeedByDistanceReport

    );

    // Route /ajax/bandwidth-upload-by-market-report-data.json
    mainApplication.get(

        '/ajax/bandwidth-upload-by-market-report-data.json',
        commonFunctions.checkSession,

        executiveSourceReportsFunctions.getBandwidthUploadByMarketReport

    );

    // Route /ajax/bandwidth-download-by-market-report-data.json
    mainApplication.get(

        '/ajax/bandwidth-download-by-market-report-data.json',
        commonFunctions.checkSession,

        executiveSourceReportsFunctions.getBandwidthDownloadByMarketReport

    );


    // Route /ajax/latency-rate-national-report-data.json
    mainApplication.get(

        '/ajax/latency-rate-national-report-data.json',
        commonFunctions.checkSession,

        executiveSourceReportsFunctions.getLatencyRateNationalReport

    );

    // Route /ajax/loss-rate-national-report-data.json
    mainApplication.get(

        '/ajax/loss-rate-national-report-data.json',
        commonFunctions.checkSession,

        executiveSourceReportsFunctions.getLossRateNationalReport

    );

    // Route /ajax/jitter-rate-national-report-data.json
    mainApplication.get(

        '/ajax/jitter-rate-national-report-data.json',
        commonFunctions.checkSession,

        executiveSourceReportsFunctions.getJitterRateNationalReport

    );

    // Route /ajax/routers-latency-rate-by-market-report-data.json
    mainApplication.get(

        '/ajax/routers-latency-rate-by-market-report-data.json',
        commonFunctions.checkSession,

        routersReportsFunctions.getLatencyRateByMarketReport

    );

    // Route /ajax/routers-loss-rate-by-market-report-data.json
    mainApplication.get(

        '/ajax/routers-loss-rate-by-market-report-data.json',
        commonFunctions.checkSession,

        routersReportsFunctions.getLossRateByMarketReport

    );

    // Route /ajax/routers-jitter-rate-by-market-report-data.json
    mainApplication.get(

        '/ajax/routers-jitter-rate-by-market-report-data.json',
        commonFunctions.checkSession,

        routersReportsFunctions.getJitterRateByMarketReport

    );

    // Route /ajax/worse-routes-report-data.json
    mainApplication.get(

        '/ajax/worse-routes-report-data.json',
        commonFunctions.checkSession,

        top25ReportsFunctions.getWorseRoutesReport

    );

    // Route /ajax/worse-cidr-report-data.json
    mainApplication.get(

        '/ajax/worse-cidr-report-data.json',
        commonFunctions.checkSession,

        top25ReportsFunctions.getWorseCidrReport

    );

    // Route /ajax/popular-cidr-report-data.json
    mainApplication.get(

        '/ajax/popular-cidr-report-data.json',
        commonFunctions.checkSession,

        top25ReportsFunctions.getPopularCidrReport

    );


    // Route /ajax/render_pdf
    mainApplication.get(

        '/ajax/render_pdf',
        commonFunctions.checkSession,

        commonFunctions.createPDF

    );

        // Route Network Latency report
    mainApplication.get(

        '/network-latency-report',
        commonFunctions.checkSession,

        function( request, response ) {

            response.render( 'reports/reportnetworklatency.html' );

            return;
        }

    );

    // Route /ajax/report_network_latency.json
    mainApplication.get(

        '/ajax/report_network_latency.json',
        commonFunctions.checkSession,

        agentReportsFunctions.getNetworkLatencyReport

    );

    // Route /ajax/report_network_latency.json
    mainApplication.get(

        '/ajax/providers.json',
        commonFunctions.checkSession,
        agentReportsFunctions.getProviders

    );



    return;
}
