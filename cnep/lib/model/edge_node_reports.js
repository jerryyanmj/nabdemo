// This module is used to get the information, related to Edge Node reports functionality

var mysqlModule     = require( '../utilities/mysql' );
var config          = require( '../../config' );
var commonFunctions = require( '../utilities/common' );

// Get data for latency rate by edge node report
exports.getLatencyRateByEdgeNodeReport = function( request, response, nextAction ) {

    var str = request.query.selected_date;
    var provider = request.query.provider;
    var start = str.split(',')[0];
    var end = str.split(',')[1];

    //Make date objects out of input values
    var startDate = new Date(start.split('-')[2],start.split('-')[0] -1, start.split('-')[1],  0, 0, 0, 0);
    var endDate = new Date(end.split('-')[2], end.split('-')[0] -1, end.split('-')[1], 0, 0, 0, 0);

    //Make it so start date always comes before end date
    if(startDate > endDate) {
        var temp = startDate;
        startDate = endDate;
        endDate = temp;
    }


    // Jitter rate vs. 5 day avg. reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get jitter rate by market data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   edge_node                                                        AS      edge_node,       ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_latency SEPARATOR ",")                          AS      avg_latency      ' +
                    'FROM                                                                                         ' +
                    '   loss_latency_edge_nodes_hour                                                        ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   edge_node                                                                                 ',
                function( error, data ) {

                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);



                    if(data.length != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {


                            var avgLatency = data[i].avg_latency.toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["edge_node"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(avgLatency.length != undefined) {

                                for(var j = 0 ; j < avgLatency.length ; j++) {

                                    /* If there are a lot of values pulled, it might send some bad data
                                     that can mess up the chart, so the values need to be checked for safety
                                     */
                                    if(collectorTime[j] != undefined && collectorTime[j].valueOf() > 100000) {
                                        var row = {
                                            "c": []
                                        }
                                        row["c"].push({
                                            "v": 'Date(' + collectorTime[j] + ')',
                                            "f": null
                                        })

                                        for (var v = 0; v < data.length; v++) {

                                            if (v == i) {
                                                row["c"].push({
                                                    "v": avgLatency[j],
                                                    "f": null
                                                })
                                            }
                                            else {
                                                row["c"].push({
                                                    "v": null,
                                                    "f": null
                                                });
                                            }
                                        }
                                        reportData["rows"].push(row);
                                    }
                                }
                            }




                        }
                    }

                    // Send the data
                    response.json( reportData );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for jitter rate by edge node report
exports.getJitterRateByEdgeNodeReport = function( request, response, nextAction ) {

    var str = request.query.selected_date;
    var provider = request.query.provider;
    var start = str.split(',')[0];
    var end = str.split(',')[1];

    //Make date objects out of input values
    var startDate = new Date(start.split('-')[2],start.split('-')[0] -1, start.split('-')[1],  0, 0, 0, 0);
    var endDate = new Date(end.split('-')[2], end.split('-')[0] -1, end.split('-')[1], 0, 0, 0, 0);

    //Make it so start date always comes before end date
    if(startDate > endDate) {
        var temp = startDate;
        startDate = endDate;
        endDate = temp;
    }


    // Jitter rate vs. 5 day avg. reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get jitter rate by market data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   edge_node                                                        AS      edge_node,       ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_jitter SEPARATOR ",")                           AS      avg_jitter       ' +
                    'FROM                                                                                         ' +
                    '   jitter_edge_nodes_hour_v2                                                                    ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   edge_node                                                                                 ',
                function( error, data ) {

                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);



                    if(data.length != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {


                            var avgJitter = data[i].avg_jitter.toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["edge_node"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(avgJitter.length != undefined) {

                                for(var j = 0 ; j < avgJitter.length ; j++) {

                                    /* If there are a lot of values pulled, it might send some bad data
                                     that can mess up the chart, so the values need to be checked for safety
                                     */
                                    if(collectorTime[j] != undefined && collectorTime[j].valueOf() > 100000) {
                                        var row = {
                                            "c": []
                                        }
                                        row["c"].push({
                                            "v": 'Date(' + collectorTime[j] + ')',
                                            "f": null
                                        })

                                        for (var v = 0; v < data.length; v++) {

                                            if (v == i) {
                                                row["c"].push({
                                                    "v": avgJitter[j],
                                                    "f": null
                                                })
                                            }
                                            else {
                                                row["c"].push({
                                                    "v": null,
                                                    "f": null
                                                });
                                            }
                                        }
                                        reportData["rows"].push(row);
                                    }
                                }
                            }




                        }
                    }

                    // Send the data
                    response.json( reportData );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for loss rate by edge node report
exports.getLossRateByEdgeNodeReport = function( request, response, nextAction ) {

    var str = request.query.selected_date;
    var provider = request.query.provider;
    var start = str.split(',')[0];
    var end = str.split(',')[1];

    //Make date objects out of input values
    var startDate = new Date(start.split('-')[2],start.split('-')[0] -1, start.split('-')[1],  0, 0, 0, 0);
    var endDate = new Date(end.split('-')[2], end.split('-')[0] -1, end.split('-')[1], 0, 0, 0, 0);

    //Make it so start date always comes before end date
    if(startDate > endDate) {
        var temp = startDate;
        startDate = endDate;
        endDate = temp;
    }


    // Jitter rate vs. 5 day avg. reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get jitter rate by market data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   edge_node                                                        AS      edge_node,       ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_loss SEPARATOR ",")                             AS      avg_loss         ' +
                    'FROM                                                                                         ' +
                    '   loss_latency_edge_nodes_hour                                                        ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   edge_node                                                                                 ',
                function( error, data ) {

                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);



                    if(data.length != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {


                            var avgLoss = data[i].avg_loss.toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["edge_node"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(avgLoss.length != undefined) {

                                for(var j = 0 ; j < avgLoss.length ; j++) {

                                    /* If there are a lot of values pulled, it might send some bad data
                                     that can mess up the chart, so the values need to be checked for safety
                                     */
                                    if(collectorTime[j] != undefined && collectorTime[j].valueOf() > 100000) {
                                        var row = {
                                            "c": []
                                        }
                                        row["c"].push({
                                            "v": 'Date(' + collectorTime[j] + ')',
                                            "f": null
                                        })

                                        for (var v = 0; v < data.length; v++) {

                                            if (v == i) {
                                                row["c"].push({
                                                    "v": avgLoss[j],
                                                    "f": null
                                                })
                                            }
                                            else {
                                                row["c"].push({
                                                    "v": null,
                                                    "f": null
                                                });
                                            }
                                        }
                                        reportData["rows"].push(row);
                                    }
                                }
                            }




                        }
                    }

                    // Send the data
                    response.json( reportData );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}
