// This module stores utilities functions for communication with MySQL storage

var mysql             = require( 'mysql' );
var mysqlConnection   = require( 'mysql' ).Connection;
var genericPoolModule = require( 'generic-pool' );
var config            = require( '../../config' );

// Create pool with MySQL storage
exports.mysqlPool = genericPoolModule.Pool(

    {

        name     : 'mysql',
        create   : function( callback ) {
    
            var mysqlConnection = mysql.createConnection(

                {

                    host     : config.mysql.host,
                    port     : config.mysql.port,
                    user     : config.mysql.user,
                    password : config.mysql.password,
                    database : config.mysql.database,
                    debug    : false

                }

            );

            mysqlConnection.on(

                "error",
                function( error ) {

                    console.error( "Cannot connect to the MySQL storage in mysql module " + error );

                    return;
                }

            );

            mysqlConnection.connect();
    
            callback( null, mysqlConnection );

            return;
        },
        
        destroy  : function( mysqlConnection ) {

            mysqlConnection.end();

            return;
        },

        max                : config.mysql.maximumOpenConnections, 
        min                : 5,
        idleTimeoutMillis  : 60000 * 60, // 1 hour, How long connection should be active before the release
        log                : false 

    }

); 

// Create pool for Reports functionality with MySQL storage
exports.mysqlReportsPool = genericPoolModule.Pool(

    {

        name     : 'mysql',
        create   : function( callback ) {
    
            var mysqlConnection = mysql.createConnection(

                {

                    host     : config.mysql.reportsHost,
                    port     : config.mysql.reportsPort,
                    user     : config.mysql.reportsUser,
                    password : config.mysql.reportsPassword,
                    database : config.mysql.reportsDatabase,
                    debug    : false

                }

            );

            mysqlConnection.on(

                "error",
                function( error ) {

                    console.error( "Cannot connect to the MySQL storage in mysql module " + error );

                    return;
                }

            );

            mysqlConnection.connect();
    
            callback( null, mysqlConnection );

            return;
        },
        
        destroy  : function( mysqlConnection ) {

            mysqlConnection.end();

            return;
        },

        max                : config.mysql.reportsMaximumOpenConnections, 
        min                : 5,
        idleTimeoutMillis  : 60000 * 60, // 1 hour, How long connection should be active before the release
        log                : false 

    }

);
