// This module is used to get the information, related to users functionality

var mysqlModule = require( '../utilities/mysql' );
var config      = require( '../../config' );

// Get the list of application's users
exports.users = function( request, response, nextAction ) {

    request.session.users = null;

    if( request.session.user.role == 'admin' ) {

        mysqlModule.mysqlPool.acquire( 

            function( error, mysqlConnection ) {

                mysqlConnection.query(
                    'SELECT                                 ' +
                    '   A.*,                                ' +
                    '   C.name AS role                      ' +
                    'FROM users                             ' +
                    '   A LEFT JOIN usergroup               ' +
                    '   B on A.uid = B.uid LEFT JOIN groups ' +
                    '   C on B.gid = C.gid                  ',
                    function( error, results ) {

                        request.session.users = results;

                        nextAction();

                        return;
                    }

                );

                mysqlModule.mysqlPool.release( mysqlConnection );

                return;
            }

        );

    }

    return;
}

// Get application's user
exports.getUser = function( request, response, nextAction ) {

    if( request.session.user.role == 'admin' ) {

        mysqlModule.mysqlPool.acquire( 

            function( error, mysqlConnection ) {
    
                mysqlConnection.query(
                    'SELECT                                 ' +
                    '   A.*,                                ' +
                    '   C.name AS role                      ' + 
                    'FROM users                             ' +
                    '   A LEFT JOIN usergroup               ' +
                    '   B on A.uid = B.uid LEFT JOIN groups ' +
                    '   C on B.gid = C.gid WHERE A.uid = ?',
                    request.param( 'uid' ), 
                    function( error, results ) {
        
                        request.session.edit = results[ 0 ];
        
                        nextAction();
        
                        return;
                    }

                );

                mysqlModule.mysqlPool.release( mysqlConnection );

                return;
            }

        );

    }

    return;
}
