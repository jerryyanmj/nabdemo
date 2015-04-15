// This module is used to get the information, related to agent reports functionality

var mysqlModule = require( '../utilities/mysql' );
var config      = require( '../../config' );

// Get data for agents historical latency report
exports.getCurrentAgentsHistoricalLatencyReport = function( request, response, nextAction ) {

    // Initialize last seven days, latencyReport
    request.session.lastSevenDates = null;
    request.session.latencyReport  = null;

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            mysqlConnection.query(

                'SELECT                                                             ' +
                '    DATE_FORMAT( curdate() - INTERVAL 1 day, "%Y-%m-%d" ) AS day7, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 2 day, "%Y-%m-%d" ) AS day6, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 3 day, "%Y-%m-%d" ) AS day5, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 4 day, "%Y-%m-%d" ) AS day4, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 5 day, "%Y-%m-%d" ) AS day3, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 6 day, "%Y-%m-%d" ) AS day2, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 7 day, "%Y-%m-%d" ) AS day1  ',
                function( error, lastSevenDates ) {

                    // Put the last seven days into the session
                    request.session.lastSevenDates = lastSevenDates;

                    // Get the latency data
                    mysqlConnection.query(

                        'SELECT                                                                                    ' +
                        '    latency_improvements_trend.route AS route,                                            ' + 
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 0 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 1 DAY        ' + 
                        '       ) THEN latency_improvements_trend.latency_improvements_trend ELSE NULL END         ' + 
                        '    ) AS day7,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 1 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 2 DAY        ' + 
                        '       ) THEN latency_improvements_trend.latency_improvements_trend ELSE NULL END         ' + 
                        '    ) AS day6,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 2 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 3 DAY        ' + 
                        '       ) THEN latency_improvements_trend.latency_improvements_trend ELSE NULL END         ' + 
                        '    ) AS day5,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 3 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 4 DAY        ' + 
                        '       ) THEN latency_improvements_trend.latency_improvements_trend ELSE NULL END         ' + 
                        '    ) AS day4,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 4 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 5 DAY        ' + 
                        '       ) THEN latency_improvements_trend.latency_improvements_trend ELSE NULL END         ' + 
                        '    ) AS day3,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 5 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 6 DAY        ' + 
                        '       ) THEN latency_improvements_trend.latency_improvements_trend ELSE NULL END         ' + 
                        '    ) AS day2,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 6 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 7 DAY        ' +
                        '       ) THEN latency_improvements_trend.latency_improvements_trend ELSE NULL END         ' + 
                        '    ) AS day1                                                                             ' +
                        '    FROM                                                                                  ' +
                        '        latency_improvements_trend                                                        ' + 
                        '    GROUP BY                                                                              ' + 
                        '        latency_improvements_trend.route                                                  ',
                        function( error, latencyReportData ) {

                            // Store the data
                            request.session.latencyReport = latencyReportData;

                            // Call next action
                            nextAction();

                            return;
                        }

                    );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for agents historical jitter report
exports.getCurrentAgentsHistoricalJitterReport = function( request, response, nextAction ) {

    // Initialize last seven days, jitterReport
    request.session.lastSevenDates = null;
    request.session.jitterReport   = null;

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            mysqlConnection.query(

                'SELECT                                                             ' +
                '    DATE_FORMAT( curdate() - INTERVAL 1 day, "%Y-%m-%d" ) AS day7, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 2 day, "%Y-%m-%d" ) AS day6, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 3 day, "%Y-%m-%d" ) AS day5, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 4 day, "%Y-%m-%d" ) AS day4, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 5 day, "%Y-%m-%d" ) AS day3, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 6 day, "%Y-%m-%d" ) AS day2, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 7 day, "%Y-%m-%d" ) AS day1  ',
                function( error, lastSevenDates ) {
        
                    // Put the last seven days into the session
                    request.session.lastSevenDates = lastSevenDates;

                    // Get the jitter data
                    mysqlConnection.query(

                        'SELECT                                                                     ' +
                        '    jitter_rate.route AS route,                                            ' + 
                        '    SUM( CASE                                                              ' +
                        '       WHEN(                                                               ' +
                        '           jitter_rate.partition_date < curdate() - INTERVAL 0 DAY AND     ' +
                        '           jitter_rate.partition_date >= curdate() - INTERVAL 1 DAY        ' + 
                        '       ) THEN jitter_rate.jitter_rate ELSE NULL END                        ' + 
                        '    ) AS day7,                                                             ' +
                        '    SUM( CASE                                                              ' +
                        '       WHEN(                                                               ' +
                        '           jitter_rate.partition_date < curdate() - INTERVAL 1 DAY AND     ' +
                        '           jitter_rate.partition_date >= curdate() - INTERVAL 2 DAY        ' + 
                        '       ) THEN jitter_rate.jitter_rate ELSE NULL END                        ' + 
                        '    ) AS day6,                                                             ' +
                        '    SUM( CASE                                                              ' +
                        '       WHEN(                                                               ' +
                        '           jitter_rate.partition_date < curdate() - INTERVAL 2 DAY AND     ' +
                        '           jitter_rate.partition_date >= curdate() - INTERVAL 3 DAY        ' + 
                        '       ) THEN jitter_rate.jitter_rate ELSE NULL END                        ' + 
                        '    ) AS day5,                                                             ' +
                        '    SUM( CASE                                                              ' +
                        '       WHEN(                                                               ' +
                        '           jitter_rate.partition_date < curdate() - INTERVAL 3 DAY AND     ' +
                        '           jitter_rate.partition_date >= curdate() - INTERVAL 4 DAY        ' + 
                        '       ) THEN jitter_rate.jitter_rate ELSE NULL END                        ' + 
                        '    ) AS day4,                                                             ' +
                        '    SUM( CASE                                                              ' +
                        '       WHEN(                                                               ' +
                        '           jitter_rate.partition_date < curdate() - INTERVAL 4 DAY AND     ' +
                        '           jitter_rate.partition_date >= curdate() - INTERVAL 5 DAY        ' + 
                        '       ) THEN jitter_rate.jitter_rate ELSE NULL END                        ' + 
                        '    ) AS day3,                                                             ' +
                        '    SUM( CASE                                                              ' +
                        '       WHEN(                                                               ' +
                        '           jitter_rate.partition_date < curdate() - INTERVAL 5 DAY AND     ' +
                        '           jitter_rate.partition_date >= curdate() - INTERVAL 6 DAY        ' + 
                        '       ) THEN jitter_rate.jitter_rate ELSE NULL END                        ' + 
                        '    ) AS day2,                                                             ' +
                        '    SUM( CASE                                                              ' +
                        '       WHEN(                                                               ' +
                        '           jitter_rate.partition_date < curdate() - INTERVAL 6 DAY AND     ' +
                        '           jitter_rate.partition_date >= curdate() - INTERVAL 7 DAY        ' +
                        '       ) THEN jitter_rate.jitter_rate ELSE NULL END                        ' + 
                        '    ) AS day1                                                              ' +
                        '    FROM                                                                   ' +
                        '        jitter_rate                                                        ' + 
                        '    GROUP BY                                                               ' + 
                        '        jitter_rate.route                                                  ',
                        function( error, jitterReportData ) {

                            // Store the data
                            request.session.jitterReport = jitterReportData;

                            // Call next action
                            nextAction();

                            return;
                        }

                    );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;

}

// Get data for agents historical loss report
exports.getCurrentAgentsHistoricalLossReport = function( request, response, nextAction ) {

    // Initialize last seven days, lossReport
    request.session.lastSevenDates = null;
    request.session.lossReport     = null;

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            mysqlConnection.query(

                'SELECT                                                             ' +
                '    DATE_FORMAT( curdate() - INTERVAL 1 day, "%Y-%m-%d" ) AS day7, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 2 day, "%Y-%m-%d" ) AS day6, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 3 day, "%Y-%m-%d" ) AS day5, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 4 day, "%Y-%m-%d" ) AS day4, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 5 day, "%Y-%m-%d" ) AS day3, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 6 day, "%Y-%m-%d" ) AS day2, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 7 day, "%Y-%m-%d" ) AS day1  ',
                function( error, lastSevenDates ) {
        
                    // Put the last seven days into the session
                    request.session.lastSevenDates = lastSevenDates;

                    // Get the latency data
                    mysqlConnection.query(

                        'SELECT                                                                                    ' +
                        '    latency_improvements_trend.route AS route,                                            ' + 
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 0 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 1 DAY        ' + 
                        '       ) THEN latency_improvements_trend.loss_improvements_trend ELSE NULL END            ' + 
                        '    ) AS day7,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 1 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 2 DAY        ' + 
                        '       ) THEN latency_improvements_trend.loss_improvements_trend ELSE NULL END            ' + 
                        '    ) AS day6,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 2 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 3 DAY        ' + 
                        '       ) THEN latency_improvements_trend.loss_improvements_trend ELSE NULL END            ' + 
                        '    ) AS day5,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 3 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 4 DAY        ' + 
                        '       ) THEN latency_improvements_trend.loss_improvements_trend ELSE NULL END            ' + 
                        '    ) AS day4,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 4 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 5 DAY        ' + 
                        '       ) THEN latency_improvements_trend.loss_improvements_trend ELSE NULL END            ' + 
                        '    ) AS day3,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 5 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 6 DAY        ' + 
                        '       ) THEN latency_improvements_trend.loss_improvements_trend ELSE NULL END            ' + 
                        '    ) AS day2,                                                                            ' +
                        '    SUM( CASE                                                                             ' +
                        '       WHEN(                                                                              ' +
                        '           latency_improvements_trend.partition_date < curdate() - INTERVAL 6 DAY AND     ' +
                        '           latency_improvements_trend.partition_date >= curdate() - INTERVAL 7 DAY        ' +
                        '       ) THEN latency_improvements_trend.loss_improvements_trend ELSE NULL END            ' + 
                        '    ) AS day1                                                                             ' +
                        '    FROM                                                                                  ' +
                        '        latency_improvements_trend                                                        ' + 
                        '    GROUP BY                                                                              ' + 
                        '        latency_improvements_trend.route                                                  ',
                        function( error, lossReportData ) {

                            // Store the data
                            request.session.lossReport = lossReportData;

                            // Call next action
                            nextAction();

                            return;
                        }

                    );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for agents distance and speed report
exports.getCurrentAgentsDistanceAndSpeedReport = function( request, response, nextAction ) {

    // Initialize last distanceAndSpeedReport
    request.session.distanceAndSpeedReport = null;

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the distance and speed data
            mysqlConnection.query(

                'SELECT                                                             ' +
                '   route                   AS route,                               ' +
                '   source                  AS source,                              ' +
                '   target                  AS target,                              ' +
                '   average_latency         AS average_latency,                     ' +
                '   std_dev_latency         AS std_dev_latency,                     ' +
                '   distance_km             AS distance_km,                         ' +
                '   speed_km_per_millisec   AS speed_km_per_millisec                ' +
                'FROM                                                               ' +
                '   distance_report                                                 ' +
                'WHERE                                                              ' +
                '   distance_report.partition_date < curdate() - INTERVAL 0 DAY AND ' +
                '   distance_report.partition_date >= curdate() - INTERVAL 1 DAY    ',
                function( error, distanceAndSpeedReportData ) {

                    // Store the data
                    request.session.distanceAndSpeedReport = distanceAndSpeedReportData;

                    // Call next action
                    nextAction();

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for disconnected agents report
exports.getDisconnectedAgentsReport = function( request, response, nextAction ) {

    // Initialize last disconnectedAgentsReport
    request.session.disconnectedAgentsReport = null;

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the distance and speed data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '   agent_id    AS agent_id,                                            ' +
                '   agent_ip    AS agent_ip                                             ' +
                'FROM                                                                   ' +
                '   disconnected_agents                                                 ' +
                'WHERE                                                                  ' +
                '   disconnected_agents.partition_date < curdate() - INTERVAL 0 DAY AND ' +
                '   disconnected_agents.partition_date >= curdate() - INTERVAL 1 DAY    ',
                function( error, disconnectedAgentsReportData ) {

                    // Store the data
                    request.session.disconnectedAgentsReport = disconnectedAgentsReportData;

                    // Call next action
                    nextAction();

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;
}

// Get data for top 10 worst sources jitter report
exports.getTopTenWorstSourcesJitterReport = function( request, response, nextAction ) {

    // Initialize last seven days, topTenWorstSourcesJitterReport
    request.session.lastSevenDates                 = null;
    request.session.topTenWorstSourcesJitterReport = null;

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            mysqlConnection.query(

                'SELECT                                                             ' +
                '    DATE_FORMAT( curdate() - INTERVAL 1 day, "%Y-%m-%d" ) AS day7, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 2 day, "%Y-%m-%d" ) AS day6, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 3 day, "%Y-%m-%d" ) AS day5, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 4 day, "%Y-%m-%d" ) AS day4, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 5 day, "%Y-%m-%d" ) AS day3, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 6 day, "%Y-%m-%d" ) AS day2, ' +
                '    DATE_FORMAT( curdate() - INTERVAL 7 day, "%Y-%m-%d" ) AS day1  ',
                function( error, lastSevenDates ) {
        
                    // Put the last seven days into the session
                    request.session.lastSevenDates = lastSevenDates;

                    // Get the jitter data
                    mysqlConnection.query(

                        'SELECT                                                                         ' +
                        '    top_worst_sources.source_ip AS source_ip,                                  ' + 
                        '    SUM( CASE                                                                  ' +
                        '       WHEN(                                                                   ' +
                        '           top_worst_sources.partition_date < curdate() - INTERVAL 0 DAY AND   ' +
                        '           top_worst_sources.partition_date >= curdate() - INTERVAL 1 DAY      ' + 
                        '       ) THEN top_worst_sources.avg_jitter_rate ELSE NULL END                  ' + 
                        '    ) AS day7,                                                                 ' +
                        '    SUM( CASE                                                                  ' +
                        '       WHEN(                                                                   ' +
                        '           top_worst_sources.partition_date < curdate() - INTERVAL 1 DAY AND   ' +
                        '           top_worst_sources.partition_date >= curdate() - INTERVAL 2 DAY      ' + 
                        '       ) THEN top_worst_sources.avg_jitter_rate ELSE NULL END                  ' + 
                        '    ) AS day6,                                                                 ' +
                        '    SUM( CASE                                                                  ' +
                        '       WHEN(                                                                   ' +
                        '           top_worst_sources.partition_date < curdate() - INTERVAL 2 DAY AND   ' +
                        '           top_worst_sources.partition_date >= curdate() - INTERVAL 3 DAY      ' + 
                        '       ) THEN top_worst_sources.avg_jitter_rate ELSE NULL END                  ' + 
                        '    ) AS day5,                                                                 ' +
                        '    SUM( CASE                                                                  ' +
                        '       WHEN(                                                                   ' +
                        '           top_worst_sources.partition_date < curdate() - INTERVAL 3 DAY AND   ' +
                        '           top_worst_sources.partition_date >= curdate() - INTERVAL 4 DAY      ' + 
                        '       ) THEN top_worst_sources.avg_jitter_rate ELSE NULL END                  ' + 
                        '    ) AS day4,                                                                 ' +
                        '    SUM( CASE                                                                  ' +
                        '       WHEN(                                                                   ' +
                        '           top_worst_sources.partition_date < curdate() - INTERVAL 4 DAY AND   ' +
                        '           top_worst_sources.partition_date >= curdate() - INTERVAL 5 DAY      ' + 
                        '       ) THEN top_worst_sources.avg_jitter_rate ELSE NULL END                  ' + 
                        '    ) AS day3,                                                                 ' +
                        '    SUM( CASE                                                                  ' +
                        '       WHEN(                                                                   ' +
                        '           top_worst_sources.partition_date < curdate() - INTERVAL 5 DAY AND   ' +
                        '           top_worst_sources.partition_date >= curdate() - INTERVAL 6 DAY      ' + 
                        '       ) THEN top_worst_sources.avg_jitter_rate ELSE NULL END                  ' + 
                        '    ) AS day2,                                                                 ' +
                        '    SUM( CASE                                                                  ' +
                        '       WHEN(                                                                   ' +
                        '           top_worst_sources.partition_date < curdate() - INTERVAL 6 DAY AND   ' +
                        '           top_worst_sources.partition_date >= curdate() - INTERVAL 7 DAY      ' +
                        '       ) THEN top_worst_sources.avg_jitter_rate ELSE NULL END                  ' + 
                        '    ) AS day1                                                                  ' +
                        '    FROM                                                                       ' +
                        '        top_worst_sources                                                      ' + 
                        '    GROUP BY                                                                   ' + 
                        '        top_worst_sources.source_ip                                            ',
                        function( error, topTenWorstSourcesJitterReportData ) {

                            // Store the data
                            request.session.topTenWorstSourcesJitterReport = topTenWorstSourcesJitterReportData;

                            // Call next action
                            nextAction();

                            return;
                        }

                    );

                    return;
                }

            );

            mysqlModule.mysqlReportsPool.release( mysqlConnection );

            return;
        }

    );

    return;

}

// Get data surveillance report
exports.getSurveillanceReport = function( request, response ) {

    // Surveillance data
    var surveillanceReportData = {
        "operationsData":   [],
        "nationalData":     {},
        "marketsData":      [],
        "edgeNodesData":    []
    };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the client_stats gauges data
            mysqlConnection.query(

                'SELECT                                                                     ' +
                '   client_stats.unique_live_count      AS unique_live_count,               ' +
                '   client_stats.unique_command_count   AS unique_command_count,            ' +
                '   client_stats.unique_route_count     AS unique_route_count               ' +
                'FROM                                                                       ' +
                '   client_stats                                                            ' +
                'WHERE                                                                      ' +
                '   client_stats.collector_time >= DATE_SUB( NOW(), INTERVAL 6 HOUR ) AND   ' +
                '   client_stats.partition_date >= DATE_SUB( NOW(), INTERVAL 6 HOUR )       ',
                function( error, clientStatsGaugesData ) {

                    // Initialize client_stats gauge
                    var clientStatsGauges = [
                        {
                            "label":        "# of live PIs",
                            "maximumValue": 250,
                            "minimumValue": 0,
                            "actualValue":  0
                        },
                        {
                            "label":        "# of commands",
                            "maximumValue": 5000,
                            "minimumValue": 0,
                            "actualValue":  0
                        },
                        {
                            "label":        "# of different routes",
                            "maximumValue": 600,
                            "minimumValue": 0,
                            "actualValue":  0
                        }
                    ];

                    if( clientStatsGaugesData.length > 0 ) {

                        clientStatsGauges[ 0 ][ "actualValue" ] = clientStatsGaugesData[ 0 ][ "unique_live_count" ];
                        clientStatsGauges[ 1 ][ "actualValue" ] = clientStatsGaugesData[ 0 ][ "unique_command_count" ];
                        clientStatsGauges[ 2 ][ "actualValue" ] = clientStatsGaugesData[ 0 ][ "unique_route_count" ];

                        // Get the client_stats gauges historical data
                        mysqlConnection.query(
            
                            'SELECT                                                                      ' +
                            '   client_stats.unique_live_count      AS historical_unique_live_count,     ' +
                            '   client_stats.unique_command_count   AS historical_unique_command_count,  ' +
                            '   client_stats.unique_route_count     AS historical_unique_route_count     ' +
                            'FROM                                                                        ' +
                            '   client_stats                                                             ' +
                            'WHERE                                                                       ' +
                            '   client_stats.collector_time < DATE_SUB( NOW(), INTERVAL 6 HOUR ) AND     ' +
                            '   client_stats.partition_date < DATE_SUB( NOW(), INTERVAL 6 HOUR ) AND     ' +
                            '   client_stats.collector_time >= DATE_SUB( NOW(), INTERVAL 7 HOUR ) AND    ' +
                            '   client_stats.partition_date >= DATE_SUB( NOW(), INTERVAL 7 HOUR )        ',
                            function( error, clientStatsGaugesHistoricalData ) {

                                if( clientStatsGaugesHistoricalData.length > 0 ) {

                                    clientStatsGauges[ 0 ][ "historicalValue" ] = clientStatsGaugesHistoricalData[ 0 ][ "historical_unique_live_count" ];
                                    clientStatsGauges[ 1 ][ "historicalValue" ] = clientStatsGaugesHistoricalData[ 0 ][ "historical_unique_command_count" ];
                                    clientStatsGauges[ 2 ][ "historicalValue" ] = clientStatsGaugesHistoricalData[ 0 ][ "historical_unique_route_count" ];

                                }

                                // Save the data
                                surveillanceReportData[ "operationsData" ].push.apply( surveillanceReportData[ "operationsData" ], clientStatsGauges );

                                return;
                            }

                        );

                    }
                    else {

                        // Save the empty data
                        surveillanceReportData[ "operationsData" ].push.apply( surveillanceReportData[ "operationsData" ], clientStatsGauges );

                    }

                    // Get the national surveillance data
		            mysqlConnection.query(
		                'SELECT                                                                                 ' +
		                '   national_surveillance.latency                       AS latency,                     ' +
		                '   national_surveillance.loss                          AS loss,                        ' +
		                '   national_surveillance.jitter                        AS jitter,                      ' +
		                '   national_surveillance.avg_latency                   AS avg_latency,                 ' +
		                '   national_surveillance.avg_loss                      AS avg_loss,                    ' +
		                '   national_surveillance.avg_jitter                    AS avg_jitter,                  ' +
		                '   national_surveillance.std_latency                   AS std_latency,                 ' +
		                '   national_surveillance.std_loss                      AS std_loss,                    ' +
		                '   national_surveillance.std_jitter                    AS std_jitter,                  ' +
		                '   national_surveillance.percent_latency_difference    AS percent_latency_difference,  ' +
		                '   national_surveillance.percent_loss_difference       AS percent_loss_difference,     ' +
		                '   national_surveillance.percent_jitter_difference     AS percent_jitter_difference    ' +
		                'FROM                                                                                   ' +
		                '   national_surveillance                                                               ' +
		                'WHERE                                                                                  ' +
		                '   national_surveillance.collector_time >= DATE_SUB( NOW(), INTERVAL 5 HOUR ) AND      ' +
		                '   national_surveillance.partition_date >= DATE_SUB( NOW(), INTERVAL 5 HOUR )          ',
		                function( error, surveillanceNationalData ) {
		
		                    // Save the data
		                    if( surveillanceNationalData.length > 0 ) {
		
		                        surveillanceReportData[ "nationalData" ] = surveillanceNationalData[ 0 ];
		
		                    }
		
		                    return;
		                }
		
		            );

                    // Get the markets surveillance data
		            mysqlConnection.query(

                        'SELECT                                                                             ' +
                        '   market_surveillance.market                      AS market,                      ' +
                        '   market_surveillance.latency                     AS latency,                     ' +
                        '   market_surveillance.loss                        AS loss,                        ' +
                        '   market_surveillance.jitter                      AS jitter,                      ' +
                        '   market_surveillance.avg_latency                 AS avg_latency,                 ' +
                        '   market_surveillance.avg_loss                    AS avg_loss,                    ' +
                        '   market_surveillance.avg_jitter                  AS avg_jitter,                  ' +
                        '   market_surveillance.std_latency                 AS std_latency,                 ' +
                        '   market_surveillance.std_loss                    AS std_loss,                    ' +
                        '   market_surveillance.std_jitter                  AS std_jitter,                  ' +
                        '   market_surveillance.percent_latency_difference  AS percent_latency_difference,  ' +
                        '   market_surveillance.percent_loss_difference     AS percent_loss_difference,     ' +
                        '   market_surveillance.percent_jitter_difference   AS percent_jitter_difference    ' +
                        'FROM                                                                               ' +
                        '   market_surveillance                                                             ' +
                        'WHERE                                                                              ' +
                        '   market_surveillance.collector_time >= DATE_SUB( NOW(), INTERVAL 5 HOUR ) AND    ' +
                        '   market_surveillance.partition_date >= DATE_SUB( NOW(), INTERVAL 5 HOUR )        ',
                        function( error, surveillanceMarketsData ) {
        
                            // Save the data
                            if( surveillanceMarketsData.length > 0 ) {
        
                                surveillanceReportData[ "marketsData" ].push.apply( surveillanceReportData[ "marketsData" ], surveillanceMarketsData );
        
                            }

                            return;
                        }

		            );

                    // Get the edge nodes surveillance data
		            mysqlConnection.query(

                        'SELECT                                                                                 ' +
                        '   edge_node_surveillance.edge_node                    AS edge_node,                   ' +
                        '   edge_node_surveillance.latency                      AS latency,                     ' +
                        '   edge_node_surveillance.loss                         AS loss,                        ' +
                        '   edge_node_surveillance.jitter                       AS jitter,                      ' +
                        '   edge_node_surveillance.avg_latency                  AS avg_latency,                 ' +
                        '   edge_node_surveillance.avg_loss                     AS avg_loss,                    ' +
                        '   edge_node_surveillance.avg_jitter                   AS avg_jitter,                  ' +
                        '   edge_node_surveillance.std_latency                  AS std_latency,                 ' +
                        '   edge_node_surveillance.std_loss                     AS std_loss,                    ' +
                        '   edge_node_surveillance.std_jitter                   AS std_jitter,                  ' +
                        '   edge_node_surveillance.percent_latency_difference   AS percent_latency_difference,  ' +
                        '   edge_node_surveillance.percent_loss_difference      AS percent_loss_difference,     ' +
                        '   edge_node_surveillance.percent_jitter_difference    AS percent_jitter_difference    ' +
                        'FROM                                                                                   ' +
                        '   edge_node_surveillance                                                              ' +
                        'WHERE                                                                                  ' +
                        '   edge_node_surveillance.collector_time >= DATE_SUB( NOW(), INTERVAL 5 HOUR ) AND     ' +
                        '   edge_node_surveillance.partition_date >= DATE_SUB( NOW(), INTERVAL 5 HOUR )         ',
                        function( error, surveillanceEdgeNodesData ) {
        
                            // Save the data
                            if( surveillanceEdgeNodesData.length > 0 ) {
        
                                surveillanceReportData[ "edgeNodesData" ].push.apply( surveillanceReportData[ "edgeNodesData" ], surveillanceEdgeNodesData );
        
                            }

                            mysqlModule.mysqlReportsPool.release( mysqlConnection );

                            // Send the data
                            response.json( surveillanceReportData );
        
                            return;
                        }

		            );

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get data for network latency report
exports.getNetworkLatencyReport = function( request, response ) {

    var networkLatencyReportData = {

        "uniqueSources": [],
        "uniqueTargets": [],
        "heatMapData":       []

    };

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {

            // Get all the unique sources from network_latency_chart table
            mysqlConnection.query(

                'SELECT DISTINCT                                                                   ' +
                '   network_latency_chart.source_division   AS source_division                     ' +
                'FROM                                                                              ' +
                '   network_latency_chart                                                          ' +
                'WHERE                                                                             ' +
                '   network_latency_chart.collector_time >= DATE_SUB( NOW(), INTERVAL 1 HOUR ) AND ' +
                '   network_latency_chart.partition_date >= DATE_SUB( NOW(), INTERVAL 1 HOUR )     ',
                function( error, uniqueSourcesData ) {

                    // Save the data
                    if( uniqueSourcesData.length > 0 ) {

                        networkLatencyReportData[ "uniqueSources" ].push.apply( networkLatencyReportData[ "uniqueSources" ], uniqueSourcesData );

                    }

                    return;
                }


            );
			// Get all the unique targets from network_latency_chart table
			mysqlConnection.query(

                'SELECT DISTINCT                                                                   ' +
				'   network_latency_chart.target_division   AS target_division                     ' +
				'FROM                                                                              ' +
				'   network_latency_chart                                                          ' +
				'WHERE                                                                             ' +
				'   network_latency_chart.collector_time >= DATE_SUB( NOW(), INTERVAL 1 HOUR ) AND ' +
				'   network_latency_chart.partition_date >= DATE_SUB( NOW(), INTERVAL 1 HOUR )     ',
				function( error, uniqueTargetsData ) {

                    // Save the data
				    if( uniqueTargetsData.length > 0 ) {

                        networkLatencyReportData[ "uniqueTargets" ].push.apply( networkLatencyReportData[ "uniqueTargets" ], uniqueTargetsData );

                    }

                    return;
                }

            );

            // Get all the data from network_latency_chart table for the specified time period
            mysqlConnection.query(

                'SELECT                                                                             ' +
			    '   network_latency_chart.source_division       AS source_division,                 ' +
			    '   network_latency_chart.target_division       AS target_division,                 ' +
			    '   network_latency_chart.avg_latency           AS avg_latency                     ' +
			    'FROM                                                                               ' +
			    '   network_latency_chart                                                           ' +
			    'WHERE                                                                              ' +
			    '   network_latency_chart.collector_time >= DATE_SUB( NOW(), INTERVAL 1 HOUR ) AND  ' +
			    '   network_latency_chart.partition_date >= DATE_SUB( NOW(), INTERVAL 1 HOUR )      ',
				function( error, networkLatencyData ) {

                    // Save the data
                    if( networkLatencyData.length > 0 ) {

                        // Save the data for heat map
                        networkLatencyReportData[ "heatMapData"].push.apply( networkLatencyReportData[ "heatMapData" ], networkLatencyData )



                    }

                    mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    // Send the data
                    response.json( networkLatencyReportData );

                    return;
                }

            );

            return;
        }

    );

}

// Get list of data providers
exports.getProviders = function( request, response ) {

    var providers = [];

    mysqlModule.mysqlReportsPool.acquire(

        function( error, mysqlConnection ) {

            // Get all the unique sources from network_latency_chart table
            mysqlConnection.query(

                'SELECT DISTINCT                                                                   ' +
                '   provider   AS provider                    ' +
                'FROM                                                                              ' +
                '   loss_latency_national_hour_v2                                                          ',
                function( error, providersData ) {

                    console.log(providersData);

                    // Send the data
                    if( providersData.length > 0 ) {

                        for(var i=0; i<providersData.length; i++) {

                            if(providersData[i].provider !== 'NULL') {

                                providers.push(providersData[i]);
                            }
                        }

                    }
                    // Send the data
                    response.json( providers );
                    return;
                }


            );


            return;
        }

    );

}