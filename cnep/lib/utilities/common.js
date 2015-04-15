// This module stores utilities functions, which are used by another modules

var mysqlModule   = require( './mysql' );
var hashFunctions = require( './pass' );
var phantom       = require('phantom');
var config        = require( '../../config' );

// Security check for the application's session
exports.checkSession = function( request, response, nextAction ) {

    if( request.session.user ) {

        nextAction();

    }
    else {

        console.log( request.session );

        request.session.error = 'Access denied!';

        response.redirect( '/cnep/' );

    }

    return;
}

// Security check for the session user's role
exports.checkSessionUserAdminRole = function( request, response, nextAction ) {

    if( request.session.user.role == 'admin' ) {

        nextAction();

    }
    else {

        response.redirect( '/cnep/logout' );

    }

    return;
}

// Redirect to home.html page
exports.index = function( request, response ) {

    response.render( 'home.html' );

    return;
}

// Authenticate application's user
exports.authenticate = function( username, password, fn ) {

    console.log( 'authenticating %s', username );

    mysqlModule.mysqlPool.acquire( 

        function( error, connection ) {

            connection.query( 
                'SELECT                                 ' +
                '   A.*,                                ' +
                '   C.name AS role                      ' +
                'FROM users                             ' +
                '   A LEFT JOIN usergroup               ' +
                '   B on A.uid = B.uid LEFT JOIN groups ' +
                '   C on B.gid = C.gid WHERE login = ?  ', 
                username, 
                function( error, results ) {
        
                    // Query the db for the given username
                    if( ! results || ! results[ 0 ] ) {
        
                        return fn( new Error( 'cannot find user' ) );
        
                    }
        
                    var user = results[ 0 ]
        
                    // apply the same algorithm to the POSTed password, applying
                    // the hash against the pass / salt, if there is a match we
                    // found the user
                    hashFunctions.hash( 
                        password, 
                        user.salt, 
                        function( error, hash ) {
        
                            if( error ) {
            
                                return fn( error );
            
                            }
                            if( hash == user.hash ) {
            
                                return fn( null, user );
            
                            }
            
                            fn( new Error( 'invalid password' ) );
        
                            return;
                        }

                    );
        
                    return;
                }

            );

            mysqlModule.mysqlPool.release( connection );

            return;

        }

    );

    return;
}

exports.s4 = function() {

    return Math.floor( ( 1 + Math.random() ) * 0x10000 ).toString( 16 ).substring( 1 );
}

exports.guid = function() {

    return exports.s4() + exports.s4() + '-' + exports.s4() + '-' + exports.s4() + '-' + exports.s4() + '-' + exports.s4() + exports.s4() + exports.s4();
}

exports.convertTime = function( str ) {

    var ss  = str;
    var pos = str.indexOf( ":" );

    return str.substring( pos - 2, pos ) + ":" + ss.substring( pos + 1, pos + 3 );
}

exports.convertDate = function( str ) {

    var convertedDate = new Date( str );

    return convertedDate.getFullYear() + "-" + exports.addZero( convertedDate.getMonth() + 1 ) + "-" + exports.addZero( convertedDate.getDate() );
}

exports.addZero = function( number ) {

    return( number < 10 ? "0" : "" ) + number;
}

exports.info = function( text ) { 

    console.log( text );

    return;
}

Date.prototype.addHours = function(hours) {

    var date = new Date(this.valueOf());
    date.setHours(date.getHours() + hours);
    return date;
}

exports.getDateArray  = function ( startDate, endDate ) {



    endDate.addHours(24);
    var dateArray = [];
    var currentDate = startDate;

    while( currentDate <= endDate ) {

        dateArray.push( new Date(currentDate).valueOf()/1000 );
        currentDate = currentDate.addHours(1);

    }

    return dateArray;
}


exports.daysFromToday = function ( date ) {

    var today = new Date();
    var daysDiff = Math.floor((today.valueOf() - date.valueOf())/(1000*60*60*24));
    return daysDiff;
}



//Render a page into a PDF file
exports.createPDF = function( request, response, nextAction ) {
    phantom.create('--ignore-ssl-errors=true', '--output-encoding=utf8', function(ph) {


        ph.createPage(function(page) {

            page.set('paperSize', {
                format: 'A4',
                margin: {
                    top: "75px",
                    bottom: "85px"
                }
            });

            page.open ( 'http://' + request.headers.host + '/cnep/login', 'post',
                'username=' + config.webApplication.phantomJSLogin +
                '&password=' + config.webApplication.phantomJSPassword,
                function() {

                    page.open ('http://' + request.headers.host + '/cnep/' + request.query.requested_page + '-pdf?time=' + request.query.selected_date , function(){

                        //console.log('Status: ' + status);
                        page.render('file.pdf', function() {

                            // file is now written to disk
                            response.download('file.pdf' );
                            ph.exit();
                        });
                    });
                });
        });


    }, {session: request.session});
}