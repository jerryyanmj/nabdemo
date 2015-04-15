

var mysqlModule = require( '../utilities/mysql' );
var config      = require( '../../config' );
var commonFunctions = require('../utilities/common');



// Get data for worse routes report
exports.getWorseRoutesReport = function( request, response, nextAction ) {
    var reportsData = [];
    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get worse routes data
            mysqlConnection.query(

                'SELECT                                                                                             ' +
                '   start_ip                                     AS      start_ip,                          ' +
                '   target_ip                                    AS      target_ip,                         ' +
                '   avg_number_of_hops                           AS      avg_number_of_hops,                ' +
                '   avg_rtt                                      AS      avg_rtt,                           ' +
                '   avg_jitter                                   AS      avg_jitter,                        ' +
                '   avg_loss                                     AS      avg_loss,                          ' +
                '   UNIX_TIMESTAMP(collector_time)*1000          AS      collector_time                     ' +
                'FROM                                                                                       ' +
                '   top_25_worse_routes                                                                     ' +
                'WHERE                                                                                      ' +
                '   partition_date >= DATE_SUB(NOW(),INTERVAL 8 HOUR)                                       ',
                function( error, data ) {

                    console.log(data.length);
                    for(var i=0; i < data.length ; i++) {

                        reportsData.push(data[i]);
                    }
                    // Send the data
                    response.json( reportsData );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for worse cidr report
exports.getWorseCidrReport = function( request, response, nextAction ) {
    var reportsData = [];
    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get worse cidr data
            mysqlConnection.query(

                'SELECT                                                                                     ' +
                '   cidr                                         AS      cidr,                              ' +
                '   ip_count                                     AS      ip_count,                          ' +
                '   amount_of_pings                              AS      amount_of_pings,                   ' +
                '   avg_rtt                                      AS      avg_rtt,                           ' +
                '   max_rtt                                      AS      max_rtt,                           ' +
                '   min_rtt                                      AS      min_rtt,                           ' +
                '   avg_loss                                     AS      avg_loss,                          ' +
                '   max_loss                                     AS      max_loss,                          ' +
                '   min_loss                                     AS      min_loss,                          ' +
                '   avg_jitter                                   AS      avg_jitter,                        ' +
                '   max_jitter                                   AS      max_jitter,                        ' +
                '   min_jitter                                   AS      min_jitter,                        ' +
                '   UNIX_TIMESTAMP(collector_time)*1000          AS      collector_time                     ' +
                'FROM                                                                                       ' +
                '   top_25_worse_cidr                                                                       ' +
                'WHERE                                                                                      ' +
                '   partition_date >= DATE_SUB(NOW(),INTERVAL 8 HOUR)                                      '
                ,
                function( error, data ) {
                    console.log('Error: ' + error);

                    console.log(data.length);
                    for(var i=0; i < data.length ; i++) {

                        reportsData.push(data[i]);
                    }
                    // Send the data
                    response.json( reportsData );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for popular cidr report
exports.getPopularCidrReport = function( request, response, nextAction ) {
    var reportsData = [];
    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get popular cidr data
            mysqlConnection.query(

                'SELECT                                                                                     ' +
                '   cidr                                         AS      cidr,                              ' +
                '   ip_count                                     AS      ip_count,                          ' +
                '   amount_of_pings                              AS      amount_of_pings,                   ' +
                '   avg_rtt                                      AS      avg_rtt,                           ' +
                '   max_rtt                                      AS      max_rtt,                           ' +
                '   min_rtt                                      AS      min_rtt,                           ' +
                '   avg_loss                                     AS      avg_loss,                          ' +
                '   max_loss                                     AS      max_loss,                          ' +
                '   min_loss                                     AS      min_loss,                          ' +
                '   avg_jitter                                   AS      avg_jitter,                        ' +
                '   max_jitter                                   AS      max_jitter,                        ' +
                '   min_jitter                                   AS      min_jitter,                        ' +
                '   UNIX_TIMESTAMP(collector_time)*1000          AS      collector_time                     ' +
                'FROM                                                                                       ' +
                '   top_25_popular_cidr                                                                     ' +
                'WHERE                                                                                      ' +
                '   partition_date >= DATE_SUB(NOW(),INTERVAL 8 HOUR)                                       '
                ,
                function( error, data ) {
                    console.log('Error: ' + error);

                    console.log(data.length);
                    for(var i=0; i < data.length ; i++) {

                        reportsData.push(data[i]);
                    }
                    // Send the data
                    response.json( reportsData );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}
