// Web application main module

// Import components
var express             = require( 'express' ),
    app                 = new express(),
    server              = require( 'http' ).createServer( app ),
    methodOverride      = require( 'method-override' ),
    io                  = require( 'socket.io' ).listen( server, { log: false } ),
    maxmind             = require( 'maxmind' ),
    path                = require( 'path' ),
    domain              = require( 'domain' ),
    log4js              = require( 'log4js' ),
    bodyParser          = require( 'body-parser' ),
    cookieParser        = require( 'cookie-parser' ),
    expressSession      = require( 'express-session' ),
    errorHandler        = require( 'errorhandler' ),
    httpStatus          = require( 'http-status' ),
    liveRoutes          = require( './lib/model/live_routes' ),
    executiveDashboard  = require( './lib/model/executive_dashboard' ),
    SLA                 = require( './lib/model/SLA' ),
    logs                = require( './lib/utilities/logs' ),
    commonFunctions     = require( './lib/utilities/common' ),
    config              = require( './config' );

// Setup WEB server port
app.set( 'port', process.env.PORT || config.webApplication.port );

// Initialize WEB server static components
app.use( express.static( __dirname + '/public' ) );
app.use( express.static( __dirname + '/bower_components' ) );
app.set( 'views', __dirname + '/public' );
app.engine( 'html', require( 'ejs' ).renderFile );

// Initialize WEB server body parser component
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

// Initialize WEB server cookie parser component
app.use( cookieParser( "OIFNDFJDHIFHjf4uyfu4y78y4gfjhbjeuyHGHFGUYgr3ubhfoi;djiofuioedsfj3" ) );

// Initialize WEB server session component
app.use(

    expressSession(
        {
            cookie:
            { 
                path     : '/', 
                httpOnly : true, 
                maxAge   : 60000 * 60 * 24 // Maximum session timeout - 24 hours 
            }, 
            secret:            'cnep',
            saveUninitialized: true,
            resave:            true 
        }
    )

);

// Configure separate request
app.use( 

    function( request, response, nextAction ) {

        // Create request domain object to handle all the exceptions inside the separate request
        var requestDomain = domain.create();

        requestDomain.add( request );
        requestDomain.add( response );

        // Error handler
        requestDomain.on(

            'error',
            function( error ) {

                // Display the error in console log
                console.error( "Caught exception: " + error.stack );

                // Close the domain after the request is finished
                response.on(

                    'close',
                    function () {

                        requestDomain.exit();

                        return;
                    }

                );

                // Write back a response with error
                try {

                    response.writeHead( httpStatus.INTERNAL_SERVER_ERROR, {'Content-Type': 'text/plain' } );
                    response.end( request.url + ": " + error.message );

                }
                catch( error ) {}

                // Close the domain
                requestDomain.exit();

                return;
            }

        );

        // The flow without errors
        requestDomain.enter();

        response.locals.session = request.session;

        nextAction();

        requestDomain.exit();

        return;
    }

);

// Avoids DEPTH_ZERO_SELF_SIGNED_CERT error for self-signed certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Initialize logging functionality
var logger = function( request, response, nextAction ) {

    console.info( request.url );

    // Passing the request to the next handler in the stack.
    nextAction(); 

    return;
}

// Configure everything together
// Add custom logger to the stack.
app.use( logger ); 

// Add standard error handler
app.use( errorHandler() );

// Configure log4js functionality
log4js.configure( config.webApplication.loggingConfigurationFile );

// Configure pages routes handlers
var root_routes                = require( './lib/routes/root_routes' )( app );
var executive_dashboard_routes = require( './lib/routes/executive_dashboard_routes' )( app );
var liveroutes_routes          = require( './lib/routes/liveroutes_routes' )( app );
var sla_routes                 = require( './lib/routes/sla_routes' )( app );
var viewroutes_routes          = require( './lib/routes/viewroutes_routes' )( app );
var contribute_routes          = require( './lib/routes/contribute_routes' )( app );
var agent_scheduling_routes    = require( './lib/routes/agent_scheduling_routes' )( app );
var agent_operations_routes    = require( './lib/routes/agent_operations_routes' )( app );
var agent_reports_routes       = require( './lib/routes/agent_reports_routes' )( app );
var users_routes               = require( './lib/routes/users_routes' )( app );

// Initialize modules
maxmind.init( './data/GeoIPCity.dat' );
executiveDashboard.setup();
liveRoutes.setup( io, config.redis.host, config.redis.port, maxmind );
SLA.setup();
logs.setup();

// Create server domain object to handle all the exceptions for server running process
var serverDomain = domain.create();

// Start the WEB server
serverDomain.run(

    function() {

        server.listen(

            app.get( 'port' ),

            function () {

                console.info( "Listening on port " + app.get( 'port' ) );

                return;
            }
        );

        return;
    }

);
