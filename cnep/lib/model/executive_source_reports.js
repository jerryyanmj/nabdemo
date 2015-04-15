// This module is used to get the information, related to agent reports functionality

var mysqlModule     = require( '../utilities/mysql' );
var config          = require( '../../config' );
var commonFunctions = require('../utilities/common');

// Get data for latency rate vs. 5 day avg. report
exports.getLatencyRateNationalReport = function( request, response, nextAction ) {

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



    // Latency rate vs. 5 day avg. reports data
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
                    '   UNIX_TIMESTAMP(collector_time)*1000           AS      collector_time,                     ' +
                    '   avg_latency                                   AS      avg_latency,                        ' +
                    '   five_day_avg_latency                          AS      five_day_avg_latency                ' +
                    'FROM                                                                                         ' +
                    '   loss_latency_national_hour_v2                                                                ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"',
                function( error, data ) {


                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    column = {
                        "id": "",
                        "label": "5 day Avg",
                        "pattern": "",
                        "type": "number"
                    };

                    reportData["cols"].push(column);

                    column = {
                        "id": "",
                        "label": "Latency Rate",
                        "pattern": "",
                        "type": "number"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {

                            /* If there are a lot of values pulled, it might send some bad data
                             that can mess up the chart, so the values need to be checked for safety
                             */
                            if(data[i]["collector_time"] != undefined && data[i]["collector_time"].valueOf() > 100000) {
                                var row = {

                                    "c": [
                                        {
                                            "v": 'Date(' + data[i]["collector_time"] + ')',
                                            "f": null
                                        },
                                        {
                                            "v": data[i]["five_day_avg_latency"],
                                            "f": null
                                        },
                                        {
                                            "v": data[i]["avg_latency"],
                                            "f": null
                                        }]
                                }

                                reportData["rows"].push(row);
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

// Get data for loss rate vs. 5 day avg. report
exports.getLossRateNationalReport = function( request, response, nextAction ) {


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


    // Loss rate vs. 5 day avg. reports data
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
                    '   UNIX_TIMESTAMP(collector_time)*1000              AS      collector_time,                  ' +
                    '   avg_loss                                         AS      avg_loss,                        ' +
                    '   five_avg_loss                                    AS      five_day_avg_loss                ' +
                    'FROM                                                                                         ' +
                    '   loss_latency_national_hour_v2                                                                ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"',
                function( error, data ) {


                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    column = {
                        "id": "",
                        "label": "5 day Avg",
                        "pattern": "",
                        "type": "number"
                    };

                    reportData["cols"].push(column);

                    column = {
                        "id": "",
                        "label": "Loss Rate",
                        "pattern": "",
                        "type": "number"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {

                            /* If there are a lot of values pulled, it might send some bad data
                             that can mess up the chart, so the values need to be checked for safety
                             */
                            if(data[i]["collector_time"] != undefined && data[i]["collector_time"].valueOf() > 100000) {
                                var row = {

                                    "c": [
                                        {
                                            "v": 'Date(' + data[i]["collector_time"] + ')',
                                            "f": null
                                        },
                                        {
                                            "v": data[i]["five_day_avg_loss"],
                                            "f": null
                                        },
                                        {
                                            "v": data[i]["avg_loss"],
                                            "f": null
                                        }]
                                }

                                reportData["rows"].push(row);
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

// Get data for jitter rate vs. 5 day avg. report
exports.getJitterRateNationalReport = function( request, response, nextAction ) {


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
                    '   UNIX_TIMESTAMP(collector_time)*1000           AS      collector_time,                     ' +
                    '   avg_jitter                                    AS      avg_jitter,                         ' +
                    '   five_day_avg_jitter                           AS      five_day_avg_jitter                 ' +
                    'FROM                                                                                         ' +
                    '   jitter_national_hour_v2                                                                      ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"',
                function( error, data ) {


                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    column = {
                        "id": "",
                        "label": "5 day Avg",
                        "pattern": "",
                        "type": "number"
                    };

                    reportData["cols"].push(column);

                    column = {
                        "id": "",
                        "label": "Jitter Rate",
                        "pattern": "",
                        "type": "number"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {

                            /* If there are a lot of values pulled, it might send some bad data
                             that can mess up the chart, so the values need to be checked for safety
                             */
                            if(data[i]["collector_time"] != undefined && data[i]["collector_time"].valueOf() > 100000) {
                                var row = {

                                    "c": [
                                        {
                                            "v": 'Date(' + data[i]["collector_time"] + ')',
                                            "f": null
                                        },
                                        {
                                            "v": data[i]["five_day_avg_jitter"],
                                            "f": null
                                        },
                                        {
                                            "v": data[i]["avg_jitter"],
                                            "f": null
                                        }]
                                }

                                reportData["rows"].push(row);
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

// Get data for jitter rate by market report
exports.getJitterRateByMarketReport = function( request, response, nextAction ) {

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
            // Get jitter rate  data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   source_market                                                    AS      source_market,   ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_jitter SEPARATOR ",")                           AS      avg_jitter       ' +
                    'FROM                                                                                         ' +
                    '   jitter_market_hour_v2                                                                        ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   source_market                                                                             ',
                function( error, data ) {

                    //makes the first data column that contains date values
                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);



                    if(data != undefined) {

                        //makes the rest of the columns that hold values for each of the source markets
                        for( var i = 0 ; i < data.length ; i++ ) {


                            var avgJitter = data[i].avg_jitter.toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["source_market"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(avgJitter.length != undefined) {

                                //makes the rows that sort out the data for each of the source markets
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

                                            if (v == i && avgJitter[j] >= 0) {
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

// Get data for latency rate by market report
exports.getLatencyRateByMarketReport = function( request, response, nextAction ) {

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


    // Latency rate by market reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get latency rate by market data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   source_market                                                    AS      source_market,   ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_latency SEPARATOR ",")                          AS      avg_latency      ' +
                    'FROM                                                                                         ' +
                    '   loss_latency_market_hour                                                           ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   source_market                                                                             ',
                function( error, data ) {

                    //makes the first data column that contains date values
                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        //makes the rest of the columns that hold values for each of the source markets
                        for( var i = 0 ; i < data.length ; i++ ) {

                            var avgLatency = data[i].avg_latency.toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["source_market"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(avgLatency.length != undefined) {

                                //makes the rows that sort out the data for each of the source markets
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

                                            if (v == i && avgLatency[j] >= 0) {
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

// Get data for loss rate by market report
exports.getLossRateByMarketReport = function( request, response, nextAction ) {

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


    // Loss rate by market reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get loss rate by market data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   source_market                                                    AS      source_market,   ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_loss SEPARATOR ",")                             AS      avg_loss         ' +
                    'FROM                                                                                         ' +
                    '   loss_latency_market_hour                                                           ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   source_market                                                                             ',
                function( error, data ) {

                    //makes the first data column that contains date values
                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        //makes the rest of the columns that hold values for each of the source markets
                        for( var i = 0 ; i < data.length ; i++ ) {


                            var avgLoss = data[i].avg_loss.toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["source_market"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(avgLoss.length != undefined) {

                                //makes the rows that sort out the data for each of the source markets
                                for(var j = 0 ; j < avgLoss.length ; j++) {

                                        /* If there are a lot of values pulled, it might send some bad data
                                        that can mess up the chart, so the values need to be checked for safety
                                         */
                                    if(collectorTime[j] != undefined && collectorTime[j].valueOf() > 100000) {
                                        var row = {
                                            "c": []
                                        };
                                        row["c"].push({
                                            "v": 'Date(' + collectorTime[j] + ')',
                                            "f": null
                                        });

                                        for (var v = 0; v < data.length; v++) {

                                            if (v == i && avgLoss[j] >= 0) {
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

// Get data for bandwidth upload by market report
exports.getBandwidthUploadByMarketReport = function( request, response, nextAction ) {

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

    // Bandwidth by market reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };
    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get bandwidth by market data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   source_market                                                    AS      source_market,   ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_upload SEPARATOR ",")                           AS      avg_upload       ' +
                    'FROM                                                                                         ' +
                    '   speedtest_market_daily_v2                                                                    ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   source_market                                                                             ',
                function( error, data ) {

                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {

                            var upload = data[i]["avg_upload"].toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["source_market"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(upload.length != undefined) {

                                for(var j = 0 ; j < upload.length ; j++) {


                                    var row = {
                                        "c": []
                                    }
                                    row["c"].push({
                                        "v": 'Date(' + collectorTime[j] + ')',
                                        "f": null
                                    })

                                    for(var v = 0; v < data.length; v++) {

                                        if( v == i ) {
                                            row["c"].push({
                                                "v": upload[j],
                                                "f": null
                                            })
                                        }
                                        else {
                                            row["c"]. push({
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

// Get data for bandwidth download by market report
exports.getBandwidthDownloadByMarketReport = function( request, response, nextAction ) {

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

    // Bandwidth by market reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get bandwidth by market data
            mysqlConnection.query(
                    'SELECT                                                                                       ' +
                    '   source_market                                                    AS      source_market,   ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,  ' +
                    '   GROUP_CONCAT(avg_download SEPARATOR ",")                         AS      avg_download     ' +
                    'FROM                                                                                         ' +
                    '   speedtest_market_daily_v2                                                                    ' +
                    'WHERE                                                                                        ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                     ' +
                    '   source_market                                                                             ',
                function( error, data ) {

                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {

                            var download = data[i]["avg_download"].toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["source_market"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(download.length != undefined) {

                                for(var j = 0 ; j < download.length ; j++) {


                                    var row = {
                                        "c": []
                                    }
                                    row["c"].push({
                                        "v": 'Date(' + collectorTime[j] + ')',
                                        "f": null
                                    })

                                    for(var v = 0; v < data.length; v++) {

                                        if( v == i ) {
                                            row["c"].push({
                                                "v": download[j],
                                                "f": null
                                            })
                                        }
                                        else {
                                            row["c"]. push({
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

// Get data for avg. speed by distance report
exports.getAvgSpeedByDistanceReport = function( request, response, nextAction ) {

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


    // Avg. speed by distance reports data
    var reportData =
    {
        "cols": [],
        "rows": []
    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {
            // Get avg speed by distance data
            mysqlConnection.query(
                    'SELECT                                                                                                 ' +
                    '   bucket_distance_km                                               AS      bucket_distance_km,        ' +
                    '   GROUP_CONCAT(UNIX_TIMESTAMP(collector_time)*1000 SEPARATOR ",")  AS      collector_time,            ' +
                    '   GROUP_CONCAT(avg_speed_km_per_millisec SEPARATOR ",")            AS      avg_speed_km_per_millisec  ' +
                    'FROM                                                                                                   ' +
                    '   buckets_distance_speed_hour                                                                         ' +
                    'WHERE                                                                                                  ' +
                    '   DATE( partition_date ) >= DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(startDate)) + ' DAY ) ) AND     ' +
                    '   DATE( partition_date ) <  DATE( DATE_SUB( now(), INTERVAL ' + (commonFunctions.daysFromToday(endDate))   + ' DAY ) ) AND     ' +
                    '   provider = "' + provider + '"' +
                    'GROUP BY                                                                                               ' +
                    '   bucket_distance_km                                                                                  ',
                function( error, data ) {

                    var column = {
                        "id": "",
                        "label": "Collector Time",
                        "pattern": "",
                        "type": "datetime"
                    };

                    reportData["cols"].push(column);

                    if(data != undefined) {

                        for( var i = 0 ; i < data.length ; i++ ) {

                            var avgSpeed = data[i]["avg_speed_km_per_millisec"].toString().split(',');
                            var collectorTime = data[i].collector_time.toString().split(',');

                            column = {
                                "id": "",
                                "label": data[i]["bucket_distance_km"],
                                "pattern": "",
                                "type": "number"
                            };
                            reportData["cols"].push(column);

                            if(avgSpeed.length != undefined) {

                                for(var j = 0 ; j < avgSpeed.length ; j++) {


                                    var row = {
                                        "c": []
                                    }
                                    row["c"].push({
                                        "v": 'Date(' + collectorTime[j] + ')',
                                        "f": null
                                    })

                                    for(var v = 0; v < data.length; v++) {

                                        if( v == i ) {
                                            row["c"].push({
                                                "v": avgSpeed[j],
                                                "f": null
                                            })
                                        }
                                        else {
                                            row["c"]. push({
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

