// This module is used to get the information, related to agent operations functionality

var mysqlModule = require( '../utilities/mysql' );
var config      = require( '../../config' );

// Get data for agents operations
exports.getCurrentAgentsOperations = function( request, response, nextAction ) {

    // Initialize last agentOperations
    request.session.agentOperations = null;

    //Initialize the current date
    var date = new Date();
    request.session.agentOperationsDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {
			
			//get the agentsOperations data
			mysqlConnection.query(
				'SELECT                                                           ' +
				'   operations.ip              AS ip,                             ' +
				'   operations.agent_id        AS agent_id,                       ' + 
				'      SUM(CASE                                                   ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     1 AND         ' +
				'             HOUR(operations.partition_date) >=    0             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour0,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     2 AND         ' +
				'             HOUR(operations.partition_date) >=    1             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour1,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     3 AND         ' +
				'             HOUR(operations.partition_date) >=    2             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour2,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     4 AND         ' +
				'             HOUR(operations.partition_date) >=    3             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour3,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     5 AND         ' +
				'             HOUR(operations.partition_date) >=    4             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour4,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     6 AND         ' +
				'             HOUR(operations.partition_date) >=    5             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour5,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     7 AND         ' +
				'             HOUR(operations.partition_date) >=    6             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour6,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     8 AND         ' +
				'             HOUR(operations.partition_date) >=    7             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour7,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     9 AND         ' +
				'             HOUR(operations.partition_date) >=    8             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour8,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     10 AND        ' +
				'             HOUR(operations.partition_date) >=    9             ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour9,                                                ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     11 AND        ' +
				'             HOUR(operations.partition_date) >=    10            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour10,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     12 AND        ' +
				'             HOUR(operations.partition_date) >=    11            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour11,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     13  AND       ' +
				'             HOUR(operations.partition_date) >=    12            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour12,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     14  AND       ' +
				'             HOUR(operations.partition_date) >=    13            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour13,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     15 AND        ' +
				'             HOUR(operations.partition_date) >=    14            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour14,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     16  AND       ' +
				'             HOUR(operations.partition_date) >=    15            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour15,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     17 AND        ' +
				'             HOUR(operations.partition_date) >=    16            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour16,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     18  AND       ' +
				'             HOUR(operations.partition_date) >=    17            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour17,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     19   AND      ' +
				'             HOUR(operations.partition_date) >=    18            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour18,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     20   AND      ' +
				'             HOUR(operations.partition_date) >=    19            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour19,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     21  AND       ' +
				'             HOUR(operations.partition_date) >=    20            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour20,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     22 AND        ' +
				'             HOUR(operations.partition_date) >=    21            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour21,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) <     23 AND        ' +
				'             HOUR(operations.partition_date) >=    22            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour22,                                               ' +
				'      SUM( CASE                                                  ' +
			    '         WHEN(                                                   ' +
				'             HOUR(operations.partition_date) >=    23            ' + 
				'         ) THEN operations.count ELSE NULL END                   ' + 
				'      ) AS hour23                                                ' +
			    'FROM                                                             ' +
			    '    operations                                                   ' +
			    'WHERE                                                            ' +
                '   operations.partition_date >= curdate() - INTERVAL 1 DAY       ' +
                'GROUP BY                                                         ' +
                '    operations.agent_id                                          ',
                function( error, agentOperationsData ) {

					request.session.agentOperations = agentOperationsData;

                    mysqlModule.mysqlReportsPool.release( mysqlConnection );

					nextAction();

					return;
				}

			);

			return;
		}

	);

	return;
}	    

// Get information about agents mapping
exports.getAgentsMapping = function( request, response ) {

    // Agents mapping data
    var agentsMappingData = [];

    // Google map zoom levels ranges
    var mapZoomLevelRanges = { 
        "divisionRange": [ 0, 5 ],
        "zipcodesRange": [ 6, 7 ],
        "agentsRange":   [ 8, 19 ]
    };

    // Initialize agents mapping data
    // Division level
    agentsMappingData[ 0 ] = { "zoomRange": mapZoomLevelRanges[ "divisionRange" ], "markersList": [] };

    // Zipcodes level
    agentsMappingData[ 1 ] = { "zoomRange": mapZoomLevelRanges[ "zipcodesRange" ], "markersList": [] };

    // Agents level
    agentsMappingData[ 2 ] = { "zoomRange": mapZoomLevelRanges[ "agentsRange" ], "markersList": [] };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the divisions mapping data
            mysqlConnection.query(

				'SELECT                                                                 ' +
				'    table1.division_id     AS division_id,                             ' +
				'    table1.division_name   AS division_name,                           ' +
				'    table1.lattitude       AS lattitude,                               ' +
				'    table1.longitude       AS longitude,                               ' +
				'    table1.updated_on      AS updated_on,                              ' +
				'    1                      AS map_marker,                              ' +
				'    (SELECT COUNT(*)                                                   ' +
				'     FROM                                                              ' +
				'       agent_mapping_agents table2                                     ' +
				'     WHERE                                                             ' +
				'          (table2.division_id = table1.division_id)) AS total_agents   ' +
				'FROM                                                                   ' +
				'    agent_mapping_divisions table1,                                    ' +
				'    agent_mapping_divisions table2                                     ' +
				'WHERE                                                                  ' +
				'    table1.division_id = table2.division_id                            ',
                function( error, agentsMappingDivisionsData ) {

                    if( agentsMappingDivisionsData.length > 0 )
                        agentsMappingData[ 0 ][ "markersList" ].push.apply( agentsMappingData[ 0 ][ "markersList" ], agentsMappingDivisionsData );

                    return;
                }

            );

            // Get the zipcodes mapping data
            mysqlConnection.query(

                'SELECT                                                             ' +
                '   table1.division_id AS division_id,                              ' +
                '   table1.zipcode_id  AS zipcode_id,                               ' +
                '   table1.city        AS city,                                     ' +
                '   table1.state       AS state,                                    ' +
                '   table1.lattitude   AS lattitude,                                ' +
                '   table1.longitude   AS longitude,                                ' +
                '   table1.updated_on  AS updated_on,                               ' +
                '   1                  AS map_marker,                               ' +
                '    (SELECT COUNT(*)                                               ' +
                '     FROM                                                          ' +
                '       agent_mapping_agents table2                                 ' +
                '     WHERE                                                         ' +
                '          (table2.zipcode_id = table1.zipcode_id)) AS total_agents ' +
                'FROM                                                               ' +
                '    agent_mapping_zipcodes table1,                                 ' +
                '    agent_mapping_zipcodes table2                                  ' +
                'WHERE                                                              ' +
                '    table1.zipcode_id = table2.zipcode_id                          ',
                function( error, agentsMappingZipcodesData ) {

                    if( agentsMappingZipcodesData.length > 0 )
                        agentsMappingData[ 1 ][ "markersList" ].push.apply( agentsMappingData[ 1 ][ "markersList" ], agentsMappingZipcodesData );

                    return;
                }

            );

            // Get the agents mapping data
            mysqlConnection.query(

                'SELECT                         ' +
                '   agent_id    AS agent_id,    ' +
                '   zipcode_id  AS zipcode_id,  ' +
                '   division_id AS division_id, ' +
                '   mac_address AS mac_address, ' +
                '   ip_address  AS ip_address,  ' +
                '   lattitude   AS lattitude,   ' +
                '   longitude   AS longitude,   ' +
                '   provider    AS provider,    ' +
                '   updated_on  AS updated_on,  ' +
                '   1           AS map_marker   ' +
                'FROM                           ' +
                '   agent_mapping_agents        ',
                function( error, agentsMappingAgentsData ) {

                    if( agentsMappingAgentsData.length > 0 ) {

                        // Save the data 
                        agentsMappingData[ 2 ][ "markersList" ].push.apply( agentsMappingData[ 2 ][ "markersList" ], agentsMappingAgentsData );

                    }

                    // Send the data
                    response.json( agentsMappingData );

                    mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get information about agents availability
exports.getAgentsAvailability = function( request, response ) {

    // Agents availability data
    var agentsAvailabilityData = [];

    // Google map zoom levels ranges
    var mapZoomLevelRanges = { 
        "agentsRange":   [ 0, 19 ]
    };

    // Initialize agents availability data
    // Agents level
    agentsAvailabilityData[ 0 ] = { "zoomRange": mapZoomLevelRanges[ "agentsRange" ], "markersList": [] };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the divisions mapping data
            mysqlConnection.query(

                'SELECT                                                                                     ' +
                '   agent_availability.agent_id                                         AS agent_id,        ' +
                '   agent_availability.on_off                                           AS on_off,          ' +
                '   DATE_FORMAT( agent_availability.shipped_date, "%Y-%m-%d %H-%i" )    AS shipped_date,    ' +
                '   agent_mapping_agents.lattitude                                      AS lattitude,       ' +
                '   agent_mapping_agents.longitude                                      AS longitude,       ' +
                '   agent_mapping_agents.mac_address                                    AS mac_address,     ' +
                '   agent_mapping_agents.ip_address                                     AS ip_address,      ' +
                '   agent_mapping_agents.provider                                       AS provider,        ' +
                '   agent_availability.partition_date                                   AS partition_date,  ' +
                '   1                                                                   AS commands_count   ' +
                'FROM                                                                                       ' +
                '   agent_availability,                                                                     ' +
                '   agent_mapping_agents                                                                    ' +
                'WHERE                                                                                      ' +
                '   agent_availability.agent_id = agent_mapping_agents.agent_id AND                         ' +
                '   agent_availability.partition_date > DATE_ADD( NOW(), INTERVAL -5 HOUR )                 ',
                function( error, agentsAvailabilityAgentsData ) {

                    if( agentsAvailabilityAgentsData.length > 0 ) {

                        // Get the number of operations for each the agent
                        for( var i = 0; i < agentsAvailabilityAgentsData.length; i++ ) {

                            // Process the data
                            getAgentCommandsCount( 

                                mysqlConnection, 
                                agentsAvailabilityAgentsData[ i ],
                                function( agentsAvailabilityAgentData ) {

                                    agentsAvailabilityData[ 0 ][ "markersList" ].push( agentsAvailabilityAgentData );

                                    // Send the data
                                    if( agentsAvailabilityData[ 0 ][ "markersList" ].length == agentsAvailabilityAgentsData.length ) { 

                                        response.json( agentsAvailabilityData );

                                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                                    }

                                    return;
                                }

                            );

                        }

                    }
                    else {

                        // Send the data without any information
                        response.json( agentsAvailabilityData );

                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    }

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get count of commands for each agent
function    getAgentCommandsCount( mysqlConnection, agentsAvailabilityAgentData, nextAction ) {

    // Initialize the data
    agentsAvailabilityAgentData[ "commands_count" ] = [];

    // Get the agent hourly data
    mysqlConnection.query(

        'SELECT                                                                                     ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  1 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 0                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "00:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  2 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 1                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "01:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  3 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 2                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "02:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  4 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 3                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "03:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  5 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 4                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "04:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  6 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 5                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "05:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  7 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 6                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "06:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  8 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 7                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "07:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  9 AND                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 8                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "08:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  10 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 9                                    ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "09:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  11 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 10                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "10:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  12 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 11                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "11:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  13 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 12                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "12:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  14 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 13                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "13:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  15 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 14                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "14:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  16 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 15                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "15:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  17 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 16                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "16:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  18 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 17                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "17:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  19 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 18                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "18:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  20 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 19                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "19:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  21 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 20                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "20:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  22 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 21                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "21:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) <  23 AND                               ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 22                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "22:00",                                                                           ' +
        '   SUM( CASE                                                                               ' +
        '      WHEN(                                                                                ' +
        '         HOUR( agent_count_hourly.partition_date ) >= 23                                   ' +
        '      ) THEN agent_count_hourly.agent_count ELSE NULL END                                  ' + 
        '   ) AS "23:00"                                                                            ' + 
        'FROM                                                                                       ' +
        '   agent_count_hourly,                                                                     ' +
        '   agent_mapping_agents                                                                    ' +
        'WHERE                                                                                      ' +
        '   agent_mapping_agents.agent_id = agent_count_hourly.agent_id                      AND    ' + 
        '   agent_count_hourly.agent_id = ?                                                  AND    ' +
        '   agent_count_hourly.partition_date >= DATE_SUB( curdate(), INTERVAL 24 DAY_HOUR ) AND    ' + 
        '   agent_count_hourly.partition_date <  DATE_SUB( curdate(), INTERVAL 0 DAY_HOUR )  AND    ' +
        '   agent_count_hourly.collector_time >= DATE_SUB( curdate(), INTERVAL 24 DAY_HOUR ) AND    ' + 
        '   agent_count_hourly.collector_time <  DATE_SUB( curdate(), INTERVAL 0 DAY_HOUR )         ' + 
        'GROUP BY                                                                                   ' +
        '   agent_count_hourly.agent_id                                                             ',
        agentsAvailabilityAgentData[ "agent_id" ],
        function( error, agentsAvailabilityCountData ) {

            // Setup header
            agentsAvailabilityAgentData[ "commands_count" ].push( [ 'Time', 'Commands' ] );

            if( agentsAvailabilityCountData && agentsAvailabilityCountData.length > 0 ) {

                for( var timeRange in agentsAvailabilityCountData[ 0 ] ) {

                    if( agentsAvailabilityCountData[ 0 ][ timeRange ] == null )
                        agentsAvailabilityAgentData[ "commands_count" ].push( [ timeRange, 0 ] );
                    else
                         agentsAvailabilityAgentData[ "commands_count" ].push( [ timeRange, agentsAvailabilityCountData[ 0 ][ timeRange ] ] );

                }

            }
            else {
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '00:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '01:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '02:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '03:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '04:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '05:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '06:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '07:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '08:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '09:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '10:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '11:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '12:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '13:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '14:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '15:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '16:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '17:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '18:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '19:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '20:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '21:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '22:00', 0 ] );
                agentsAvailabilityAgentData[ "commands_count" ].push( [ '23:00', 0 ] );
            }

            // Call next action
            nextAction( agentsAvailabilityAgentData );

            return;
        }

    );

    return;
}

// Get information about agents gauges data
exports.getAgentGaugesLogs = function( request, response ) {

    // Agents gauges data
    var agentsGaugesData = [];

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the delivered_pis gauges data
            mysqlConnection.query(

                'SELECT                             ' +
                '   delivered_pis.count AS count    ' +
                'FROM                               ' +
                '   delivered_pis                   ',
                function( error, deliveredPISGaugesData ) {

                    // Initialize delivered_pis gauge
                    var deliveredPISGauge = {
                        "label":        "# of total PIs shipped",
                        "maximumValue": 250,
                        "minimumValue": 0,
                        "actualValue":  0
                    };

                    if( deliveredPISGaugesData.length > 0 )
                        deliveredPISGauge[ "actualValue" ] = deliveredPISGaugesData[ 0 ][ "count" ]; 

                    // Save the data
                    agentsGaugesData.push( deliveredPISGauge );

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
                                        agentsGaugesData.push.apply( agentsGaugesData, clientStatsGauges );

                                        // Send the data
                                        response.json( agentsGaugesData );

                                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                                        return;
                                    }

                                );

                            }
                            else {

                                // Save the empty data
                                agentsGaugesData.push.apply( agentsGaugesData, clientStatsGauges );

                                // Send the data without client_stats gauges information
                                response.json( agentsGaugesData );

                                mysqlModule.mysqlReportsPool.release( mysqlConnection );

                            }

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

// Get information about agents mapping latency
exports.getAgentsMappingLatency = function( request, response ) {

    // Agents mapping latency data
    var agentsMappingLatencyData = [];

    // Google map zoom levels ranges
    var mapZoomLevelRanges = { 
        "divisionRange": [ 0, 5 ],
        "zipcodesRange": [ 6, 7 ],
        "agentsRange":   [ 8, 19 ]
    };

    // Initialize agents mapping latency data
    // Division level
    agentsMappingLatencyData[ 0 ] = { "zoomRange": mapZoomLevelRanges[ "divisionRange" ], "markersList": [] };

    // Zipcodes level
    agentsMappingLatencyData[ 1 ] = { "zoomRange": mapZoomLevelRanges[ "zipcodesRange" ], "markersList": [] };

    // Agents level
    agentsMappingLatencyData[ 2 ] = { "zoomRange": mapZoomLevelRanges[ "agentsRange" ], "markersList": [] };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the divisions mapping latency data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '    table1.division_id     AS division_id,                             ' +
                '    table1.division_name   AS division_name,                           ' +
                '    table1.lattitude       AS lattitude,                               ' +
                '    table1.longitude       AS longitude,                               ' +
                '    table1.updated_on      AS updated_on,                              ' +
                '    table3.std_latency     AS std_latency,                             ' +
                '    table3.avg_latency     AS avg_latency,                             ' +
                '    1                      AS map_marker,                              ' +
                '    (SELECT COUNT(*)                                                   ' +
                '     FROM                                                              ' +
                '       agent_mapping_agents table2                                     ' +
                '     WHERE                                                             ' +
                '          (table2.division_id = table1.division_id)) AS total_agents   ' +
                'FROM                                                                   ' +
                '    agent_mapping_divisions        table1,                             ' +
                '    agent_mapping_divisions        table2,                             ' +
                '    client_market_source_metrics   table3                              ' +
                'WHERE                                                                  ' +
                '    table1.division_id = table2.division_id                     AND    ' +
                '    table2.division_id = table3.division_id                     AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, agentsMappingDivisionsLatencyData ) {

                    if( agentsMappingDivisionsLatencyData.length > 0 )
                        agentsMappingLatencyData[ 0 ][ "markersList" ].push.apply( agentsMappingLatencyData[ 0 ][ "markersList" ], agentsMappingDivisionsLatencyData );

                    return;
                }

            );

            // Get the zipcodes mapping latency data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '   table1.division_id AS division_id,                                  ' +
                '   table1.zipcode_id  AS zipcode_id,                                   ' +
                '   table1.city        AS city,                                         ' +
                '   table1.state       AS state,                                        ' +
                '   table1.lattitude   AS lattitude,                                    ' +
                '   table1.longitude   AS longitude,                                    ' +
                '   table1.updated_on  AS updated_on,                                   ' +
                '   table3.std_latency AS std_latency,                                  ' +
                '   table3.avg_latency AS avg_latency,                                  ' + 
                '   1                  AS map_marker,                                   ' +
                '    (SELECT COUNT(*)                                                   ' +
                '     FROM                                                              ' +
                '       agent_mapping_agents table2                                     ' +
                '     WHERE                                                             ' +
                '          (table2.zipcode_id = table1.zipcode_id)) AS total_agents     ' +
                'FROM                                                                   ' +
                '    agent_mapping_zipcodes         table1,                             ' +
                '    agent_mapping_zipcodes         table2,                             ' +
                '    client_zipcode_source_metrics  table3                              ' +
                'WHERE                                                                  ' +
                '    table1.zipcode_id = table2.zipcode_id                       AND    ' +
                '    table2.zipcode_id = table3.zipcode_id                       AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, agentsMappingZipcodesLatencyData ) {

                    if( agentsMappingZipcodesLatencyData.length > 0 )
                        agentsMappingLatencyData[ 1 ][ "markersList" ].push.apply( agentsMappingLatencyData[ 1 ][ "markersList" ], agentsMappingZipcodesLatencyData );

                    return;
                }

            );

            // Get the agents mapping latency data
            mysqlConnection.query(

                'SELECT                                 ' +
                '   agent_id    AS agent_id,            ' +
                '   zipcode_id  AS zipcode_id,          ' +
                '   division_id AS division_id,         ' +
                '   mac_address AS mac_address,         ' +
                '   ip_address  AS ip_address,          ' +
                '   lattitude   AS lattitude,           ' +
                '   longitude   AS longitude,           ' +
                '   provider    AS provider,            ' +
                '   updated_on  AS updated_on,          ' +
                '   1           AS map_marker,          ' +
                '   2           AS std_latency_count    ' +
                'FROM                                   ' +
                '   agent_mapping_agents                ',
                function( error, agentsMappingAgentsLatencyData ) {

                    if( agentsMappingAgentsLatencyData.length > 0 ) {

                        var agentsCounter = 0;

                        // Get the last 24 hours backward from the last hour
                        getLast24HoursBackwardFromTheLastHour(

                            mysqlConnection,
                            agentsMappingAgentsLatencyData,
                            function( agentsMappingAgentsLatencyData, selectedHoursRange ) {

		                        // Get the number of std latencies for the last 24 hours for each the agent
		                        for( var i = 0; i < agentsMappingAgentsLatencyData.length; i++ ) {
		
		                            // Process the data
		                            getAgentStdLatencyCount( 
		
		                                mysqlConnection, 
		                                agentsMappingAgentsLatencyData[ i ],
		                                selectedHoursRange,
		                                function( agentsMappingAgentLatencyData ) {
		
		                                    if( agentsMappingAgentLatencyData != null )
		                                        agentsMappingLatencyData[ 2 ][ "markersList" ].push( agentsMappingAgentLatencyData );
		
		                                    agentsCounter += 1;
		
		                                    // Send the data
		                                    if( agentsCounter == agentsMappingAgentsLatencyData.length ) { 
		
		                                        response.json( agentsMappingLatencyData );
		
		                                        mysqlModule.mysqlReportsPool.release( mysqlConnection );
		
		                                    }
		
		                                    return;
		                                }
		
		                            );
		
		                        }

                                return;
                            }

                        );

                    }
                    else {

                        // Send the data without any information for agents level
                        response.json( agentsMappingLatencyData );

                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    }

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get count of std latency for each agent
function    getAgentStdLatencyCount( mysqlConnection, agentsMappingAgentLatencyData, selectedHoursRange, nextAction ) {

    // Initialize the data
    agentsMappingAgentLatencyData[ "std_latency_count" ] = [];
    agentsMappingAgentLatencyData[ "on_off" ]            = 0;
    agentsMappingAgentLatencyData[ "last_std_latency" ]  = 0;

    // Get the agent std latency data
    mysqlConnection.query(

        'SELECT                                                                                         ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 23 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "23 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 22 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 23 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "22 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 21 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 22 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "21 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 20 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 21 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "20 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 19 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 20 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "19 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 18 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 19 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "18 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 17 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 18 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "17 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 16 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 17 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "16 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 15 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 16 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "15 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 14 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 15 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "14 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 13 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 14 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "13 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 12 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 13 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "12 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 11 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 12 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "11 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 10 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 11 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "10 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 09 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 10 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "9 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 08 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 09 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "8 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 07 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 08 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "7 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 06 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 07 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "6 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 05 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 06 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "5 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 04 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 05 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "4 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 03 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 04 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "3 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 02 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 03 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "2 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 01 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 02 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "1 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 00 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 01 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "0 hour"                                                                               ' +
        'FROM                                                                                           ' +
        '   client_source_metrics,                                                                      ' +
        '   agent_mapping_agents                                                                        ' +
        'WHERE                                                                                          ' +
        '   agent_mapping_agents.agent_id = client_source_metrics.agent_id                  AND         ' + 
        '   client_source_metrics.agent_id = ?                                              AND         ' +
        '   client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND         ' +
        '   client_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   client_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )              ' + 
        'GROUP BY                                                                                       ' +
        '   client_source_metrics.agent_id                                                              ',
        agentsMappingAgentLatencyData[ "agent_id" ],
        function( error, agentsMappingLatencyCountData ) {

            if( agentsMappingLatencyCountData && agentsMappingLatencyCountData.length > 0 ) {

                // Setup header
                agentsMappingAgentLatencyData[ "std_latency_count" ].push( [ 'Time', 'Standard Latency' ] );

                // Fill the data
                var selectedHours = selectedHoursRange.toString().split( ',' );
                for( var i = selectedHours.length - 1; i >= 0; i-- ) {

                    if( agentsMappingLatencyCountData[ 0 ][ i + ' hour' ] == null )
                        agentsMappingAgentLatencyData[ "std_latency_count" ].push( [ selectedHours[ i ], 0 ] );
                    else
                        agentsMappingAgentLatencyData[ "std_latency_count" ].push( [ selectedHours[ i ], agentsMappingLatencyCountData[ 0 ][ i + ' hour' ] ] );

                } 

                // Get the last on/off status
                mysqlConnection.query(
                    'SELECT                                                                                     ' +
                    '   client_source_metrics.on_off        AS last_on_off,                                     ' +
                    '   client_source_metrics.std_latency   AS last_std_latency                                 ' +
                    'FROM                                                                                       ' +
                    '   client_source_metrics,                                                                  ' +
                    '   agent_mapping_agents                                                                    ' +
                    'WHERE                                                                                      ' +
                    '   agent_mapping_agents.agent_id = client_source_metrics.agent_id                  AND     ' + 
                    '   client_source_metrics.agent_id = ?                                              AND     ' +
                    '   client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND     ' + 
                    '   client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND     ' +
                    '   client_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND     ' + 
                    '   client_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )          ' + 
                    'ORDER BY                                                                                   ' +
                    '   client_source_metrics.collector_time DESC                                               ' +
                    'LIMIT 1                                                                                    ',
                    agentsMappingAgentLatencyData[ "agent_id" ],
                    function( error, agentsMappingLatencyLastOnOffData ) {

                        if( agentsMappingLatencyLastOnOffData.length > 0 ) {

                            agentsMappingAgentLatencyData[ "on_off" ]           = agentsMappingLatencyLastOnOffData[ 0 ][ "last_on_off" ];
                            agentsMappingAgentLatencyData[ "last_std_latency" ] = agentsMappingLatencyLastOnOffData[ 0 ][ "last_std_latency" ];

                        }

                        // Call next action
                        nextAction( agentsMappingAgentLatencyData );

                        return;
                    }

                );

            }
            else {

                // No data for this agent for the specified time range
                agentsMappingAgentLatencyData = null;

                // Call next action
                nextAction( agentsMappingAgentLatencyData );

            }

            return;
        }

    );

    return;
}

// Get information about agents mapping loss
exports.getAgentsMappingLoss = function( request, response ) {

    // Agents mapping loss data
    var agentsMappingLossData = [];

    // Google map zoom levels ranges
    var mapZoomLevelRanges = { 
        "divisionRange": [ 0, 8 ],
        "zipcodesRange": [ 9, 11 ],
        "agentsRange":   [ 12, 19 ]
    };

    // Initialize agents mapping loss data
    // Division level
    agentsMappingLossData[ 0 ] = { "zoomRange": mapZoomLevelRanges[ "divisionRange" ], "markersList": [] };

    // Zipcodes level
    agentsMappingLossData[ 1 ] = { "zoomRange": mapZoomLevelRanges[ "zipcodesRange" ], "markersList": [] };

    // Agents level
    agentsMappingLossData[ 2 ] = { "zoomRange": mapZoomLevelRanges[ "agentsRange" ], "markersList": [] };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the divisions mapping loss data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '    table1.division_id     AS division_id,                             ' +
                '    table1.division_name   AS division_name,                           ' +
                '    table1.lattitude       AS lattitude,                               ' +
                '    table1.longitude       AS longitude,                               ' +
                '    table1.updated_on      AS updated_on,                              ' +
                '    table3.std_loss        AS std_loss,                                ' +
                '    table3.avg_loss        AS avg_loss,                                ' +
                '    1                      AS map_marker,                              ' +
                '    (SELECT COUNT(*)                                                   ' +
                '     FROM                                                              ' +
                '       agent_mapping_agents table2                                     ' +
                '     WHERE                                                             ' +
                '          (table2.division_id = table1.division_id)) AS total_agents   ' +
                'FROM                                                                   ' +
                '    agent_mapping_divisions        table1,                             ' +
                '    agent_mapping_divisions        table2,                             ' +
                '    client_market_source_metrics   table3                              ' +
                'WHERE                                                                  ' +
                '    table1.division_id = table2.division_id                     AND    ' +
                '    table2.division_id = table3.division_id                     AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, agentsMappingDivisionsLossData ) {

                    if( agentsMappingDivisionsLossData.length > 0 )
                        agentsMappingLossData[ 0 ][ "markersList" ].push.apply( agentsMappingLossData[ 0 ][ "markersList" ], agentsMappingDivisionsLossData );

                    return;
                }

            );

            // Get the zipcodes mapping loss data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '   table1.division_id AS division_id,                                  ' +
                '   table1.zipcode_id  AS zipcode_id,                                   ' +
                '   table1.city        AS city,                                         ' +
                '   table1.state       AS state,                                        ' +
                '   table1.lattitude   AS lattitude,                                    ' +
                '   table1.longitude   AS longitude,                                    ' +
                '   table1.updated_on  AS updated_on,                                   ' +
                '   table3.std_loss    AS std_loss,                                     ' +
                '   table3.avg_loss    AS avg_loss,                                     ' + 
                '   1                  AS map_marker,                                   ' +
                '    (SELECT COUNT(*)                                                   ' +
                '     FROM                                                              ' +
                '       agent_mapping_agents table2                                     ' +
                '     WHERE                                                             ' +
                '          (table2.zipcode_id = table1.zipcode_id)) AS total_agents     ' +
                'FROM                                                                   ' +
                '    agent_mapping_zipcodes         table1,                             ' +
                '    agent_mapping_zipcodes         table2,                             ' +
                '    client_zipcode_source_metrics  table3                              ' +
                'WHERE                                                                  ' +
                '    table1.zipcode_id = table2.zipcode_id                       AND    ' +
                '    table2.zipcode_id = table3.zipcode_id                       AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, agentsMappingZipcodesLossData ) {

                    if( agentsMappingZipcodesLossData.length > 0 )
                        agentsMappingLossData[ 1 ][ "markersList" ].push.apply( agentsMappingLossData[ 1 ][ "markersList" ], agentsMappingZipcodesLossData );

                    return;
                }

            );

            // Get the agents mapping loss data
            mysqlConnection.query(

                'SELECT                             ' +
                '   agent_id    AS agent_id,        ' +
                '   zipcode_id  AS zipcode_id,      ' +
                '   division_id AS division_id,     ' +
                '   mac_address AS mac_address,     ' +
                '   ip_address  AS ip_address,      ' +
                '   lattitude   AS lattitude,       ' +
                '   longitude   AS longitude,       ' +
                '   provider    AS provider,        ' +
                '   updated_on  AS updated_on,      ' +
                '   1           AS map_marker,      ' +
                '   2           AS std_loss_count   ' +
                'FROM                               ' +
                '   agent_mapping_agents            ',
                function( error, agentsMappingAgentsLossData ) {

                    if( agentsMappingAgentsLossData.length > 0 ) {

                        var agentsCounter = 0;

                        // Get the last 24 hours backward from the last hour
                        getLast24HoursBackwardFromTheLastHour(

                            mysqlConnection,
                            agentsMappingAgentsLossData,
                            function( agentsMappingAgentsLossData, selectedHoursRange ) {

		                        // Get the number of std losses for the last 24 hours for each the agent
		                        for( var i = 0; i < agentsMappingAgentsLossData.length; i++ ) {
		
		                            // Process the data
		                            getAgentStdLossCount( 
		
		                                mysqlConnection, 
		                                agentsMappingAgentsLossData[ i ],
		                                selectedHoursRange,
		                                function( agentsMappingAgentLossData ) {
		
		                                    if( agentsMappingAgentLossData != null )
		                                        agentsMappingLossData[ 2 ][ "markersList" ].push( agentsMappingAgentLossData );
		
		                                    agentsCounter += 1;
		
		                                    // Send the data
		                                    if( agentsCounter == agentsMappingAgentsLossData.length ) { 
		
		                                        response.json( agentsMappingLossData );
		
		                                        mysqlModule.mysqlReportsPool.release( mysqlConnection );
		
		                                    }
		
		                                    return;
		                                }
		
		                            );
		
		                        }

                                return;
                            }

                        );

                    }
                    else {

                        // Send the data without any information about agents
                        response.json( agentsMappingLossData );

                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    }

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get count of std loss for each agent
function    getAgentStdLossCount( mysqlConnection, agentsMappingAgentLossData, selectedHoursRange, nextAction ) {

    // Initialize the data
    agentsMappingAgentLossData[ "std_loss_count" ] = [];
    agentsMappingAgentLossData[ "on_off" ]         = 0;
    agentsMappingAgentLossData[ "last_std_loss" ]  = 0;

    // Get the agent std loss data
    mysqlConnection.query(

        'SELECT                                                                                         ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 23 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "23 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 22 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 23 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "22 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 21 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 22 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "21 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 20 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 21 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "20 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 19 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 20 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "19 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 18 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 19 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "18 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 17 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 18 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "17 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 16 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 17 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "16 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 15 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 16 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "15 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 14 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 15 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "14 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 13 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 14 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "13 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 12 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 13 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "12 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 11 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 12 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "11 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 10 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 11 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "10 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 09 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 10 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "9 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 08 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 09 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "8 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 07 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 08 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "7 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 06 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 07 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "6 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 05 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 06 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "5 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 04 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 05 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "4 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 03 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 04 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "3 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 02 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 03 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "2 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 01 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 02 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "1 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 00 DAY_HOUR ) AND   ' +
        '         client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 01 DAY_HOUR )       ' +
        '      ) THEN client_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "0 hour"                                                                               ' +
        'FROM                                                                                           ' +
        '   client_source_metrics,                                                                      ' +
        '   agent_mapping_agents                                                                        ' +
        'WHERE                                                                                          ' +
        '   agent_mapping_agents.agent_id = client_source_metrics.agent_id                  AND         ' + 
        '   client_source_metrics.agent_id = ?                                              AND         ' +
        '   client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND         ' +
        '   client_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   client_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )              ' + 
        'GROUP BY                                                                                       ' +
        '   client_source_metrics.agent_id                                                              ',
        agentsMappingAgentLossData[ "agent_id" ],
        function( error, agentsMappingLossCountData ) {

            if( agentsMappingLossCountData && agentsMappingLossCountData.length > 0 ) {

                // Setup header
                agentsMappingAgentLossData[ "std_loss_count" ].push( [ 'Time', 'Standard Loss' ] );

                // Fill the data
                var selectedHours = selectedHoursRange.toString().split( ',' );
                for( var i = selectedHours.length - 1; i >= 0; i-- ) {

                    if( agentsMappingLossCountData[ 0 ][ i + ' hour' ] == null )
                        agentsMappingAgentLossData[ "std_loss_count" ].push( [ selectedHours[ i ], 0 ] );
                    else
                        agentsMappingAgentLossData[ "std_loss_count" ].push( [ selectedHours[ i ], agentsMappingLossCountData[ 0 ][ i + ' hour' ] ] );

                }

                // Get the last on/off status
                mysqlConnection.query(
                    'SELECT                                                                                 ' +
                    '   client_source_metrics.on_off    AS last_on_off,                                     ' +
                    '   client_source_metrics.std_loss  AS last_std_loss                                    ' +
                    'FROM                                                                                   ' +
                    '   client_source_metrics,                                                              ' +
                    '   agent_mapping_agents                                                                ' +
                    'WHERE                                                                                  ' +
                    '   agent_mapping_agents.agent_id = client_source_metrics.agent_id                  AND ' + 
                    '   client_source_metrics.agent_id = ?                                              AND ' +
                    '   client_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND ' + 
                    '   client_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND ' +
                    '   client_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND ' + 
                    '   client_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )      ' + 
                    'ORDER BY                                                                               ' +
                    '   client_source_metrics.collector_time DESC                                           ' +
                    'LIMIT 1                                                                                ',
                    agentsMappingAgentLossData[ "agent_id" ],
                    function( error, agentsMappingLossLastOnOffData ) {

                        if( agentsMappingLossLastOnOffData.length > 0 ) { 

                            agentsMappingAgentLossData[ "on_off" ]        = agentsMappingLossLastOnOffData[ 0 ][ "last_on_off" ];
                            agentsMappingAgentLossData[ "last_std_loss" ] = agentsMappingLossLastOnOffData[ 0 ][ "last_std_loss" ];

                        }

                        // Call next action
                        nextAction( agentsMappingAgentLossData );

                        return;
                    }

                );

            }
            else {

                // No data for this agent for the specified time range
                agentsMappingAgentLossData = null;

                // Call next action
                nextAction( agentsMappingAgentLossData );

            }

            return;
        }

    );

    return;
}

// Get information about routers mapping loss
exports.getRoutersMappingLoss = function( request, response ) {

    // Routers mapping loss data
    var routersMappingLossData = [];

    // Google map zoom levels ranges
    var mapZoomLevelRanges = { 
        "divisionRange": [ 0, 8 ],
        "zipcodesRange": [ 9, 11 ],
        "routersRange":  [ 12, 19 ]
    };

    // Initialize routers mapping loss data
    // Division level
    routersMappingLossData[ 0 ] = { "zoomRange": mapZoomLevelRanges[ "divisionRange" ], "markersList": [] };

    // Zipcodes level
    routersMappingLossData[ 1 ] = { "zoomRange": mapZoomLevelRanges[ "zipcodesRange" ], "markersList": [] };

    // Agents level
    routersMappingLossData[ 2 ] = { "zoomRange": mapZoomLevelRanges[ "routersRange" ], "markersList": [] };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {
		
            // Get the divisions mapping loss data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '    table1.division_id     AS division_id,                             ' +
                '    table1.division_name   AS division_name,                           ' +
                '    table1.lattitude       AS lattitude,                               ' +
                '    table1.longitude       AS longitude,                               ' +
                '    table1.updated_on      AS updated_on,                              ' +
                '    table3.std_loss        AS std_loss,                                ' +
                '    table3.avg_loss        AS avg_loss,                                ' +
                '    1                      AS map_marker,                              ' +
                '    (SELECT COUNT(DISTINCT table2.cidr)                                ' +
                '     FROM                                                              ' +
                '       routers_mapping table2                                          ' +
                '     WHERE                                                             ' +
                '          (table2.division_id = table1.division_id)) AS total_routers  ' +
                'FROM                                                                   ' +
                '    agent_mapping_divisions        table1,                             ' +
                '    agent_mapping_divisions        table2,                             ' +
                '    router_market_source_metrics   table3                              ' +
                'WHERE                                                                  ' +
                '    table1.division_id = table2.division_id                     AND    ' +
                '    table2.division_id = table3.division_id                     AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, routersMappingDivisionsLossData ) {

                    if( routersMappingDivisionsLossData.length > 0 )
                        routersMappingLossData[ 0 ][ "markersList" ].push.apply( routersMappingLossData[ 0 ][ "markersList" ], routersMappingDivisionsLossData );

                    return;
                }

            );
		
            // Get the zipcodes mapping loss data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '   table1.division_id AS division_id,                                  ' +
                '   table1.zipcode_id  AS zipcode_id,                                   ' +
                '   table1.city        AS city,                                         ' +
                '   table1.state       AS state,                                        ' +
                '   table1.lattitude   AS lattitude,                                    ' +
                '   table1.longitude   AS longitude,                                    ' +
                '   table1.updated_on  AS updated_on,                                   ' +
                '   table3.std_loss    AS std_loss,                                     ' +
                '   table3.avg_loss    AS avg_loss,                                     ' + 
                '   1                  AS map_marker,                                   ' +
                '   (SELECT COUNT(DISTINCT table2.cidr)                                 ' +
                '    FROM                                                               ' +
                '       routers_mapping table2                                          ' +
                '    WHERE                                                              ' +
                '       (table2.zipcode_id = table1.zipcode_id)) AS total_routers       ' +
                'FROM                                                                   ' +
                '    agent_mapping_zipcodes         table1,                             ' +
                '    agent_mapping_zipcodes         table2,                             ' +
                '    router_zipcode_source_metrics  table3                              ' +
                'WHERE                                                                  ' +
                '    table1.zipcode_id = table2.zipcode_id                       AND    ' +
                '    table2.zipcode_id = table3.zipcode_id                       AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, routersMappingZipcodesLossData ) {

                    if( routersMappingZipcodesLossData.length > 0 )
                        routersMappingLossData[ 1 ][ "markersList" ].push.apply( routersMappingLossData[ 1 ][ "markersList" ], routersMappingZipcodesLossData );

                    return;
                }

            );
		
            // Get the routers mapping loss data
            mysqlConnection.query(

                'SELECT                                 ' +
                '   cidr            AS cidr,            ' +
                '   zipcode_id      AS zipcode_id,      ' +
                '   division_id     AS division_id,     ' +
                '   router_market   AS router_market,   ' +
                '   ip_type         AS ip_type,         ' +
                '   lattitude       AS lattitude,       ' +
                '   longitude       AS longitude,       ' +
                '   1               AS map_marker,      ' +
                '   2               AS std_loss_count   ' +
                'FROM                                   ' +
                '   routers_mapping                     ' +
                'GROUP BY                               ' +
                '   routers_mapping.cidr                ',
                function( error, routersMappingRoutersLossData ) {

                    if( routersMappingRoutersLossData.length > 0 ) {

                        var routersCounter = 0;

                        // Get the last 24 hours backward from the last hour
                        getLast24HoursBackwardFromTheLastHour(

                            mysqlConnection,
                            routersMappingRoutersLossData,
                            function( routersMappingRoutersLossData, selectedHoursRange ) {

		                        // Get the number of std losses for the last 24 hours for each router
		                        for( var i = 0; i < routersMappingRoutersLossData.length; i++ ) {
		
		                            // Process the data
		                            getRouterStdLossCount( 
		
		                                mysqlConnection, 
		                                routersMappingRoutersLossData[ i ],
		                                selectedHoursRange,
		                                function( routersMappingRouterLossData ) {
		
		                                    if( routersMappingRouterLossData != null )
		                                        routersMappingLossData[ 2 ][ "markersList" ].push( routersMappingRouterLossData );
		
		                                    routersCounter += 1;
		
		                                    // Send the data
		                                    if( routersCounter == routersMappingRoutersLossData.length ) { 

		                                        response.json( routersMappingLossData );

		                                        mysqlModule.mysqlReportsPool.release( mysqlConnection );
		
		                                    }
		
		                                    return;
		                                }
		
		                            );
		
		                        }

                                return;
                            }

                        );

                    }
                    else {

                        // Send the data without any information about routers
                        response.json( routersMappingLossData );

                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    }

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get count of std loss for each router
function    getRouterStdLossCount( mysqlConnection, routersMappingRouterLossData, selectedHoursRange, nextAction ) {

    // Initialize the data
    routersMappingRouterLossData[ "std_loss_count" ] = [];
    routersMappingRouterLossData[ "on_off" ]         = 0;
    routersMappingRouterLossData[ "last_std_loss" ]  = 0;

    // Get the router std loss data
    mysqlConnection.query(

        'SELECT                                                                                         ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 23 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "23 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 22 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 23 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "22 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 21 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 22 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "21 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 20 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 21 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "20 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 19 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 20 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "19 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 18 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 19 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "18 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 17 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 18 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "17 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 16 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 17 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "16 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 15 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 16 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "15 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 14 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 15 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "14 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 13 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 14 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "13 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 12 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 13 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "12 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 11 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 12 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "11 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 10 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 11 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "10 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 09 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 10 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "9 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 08 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 09 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "8 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 07 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 08 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "7 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 06 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 07 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "6 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 05 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 06 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "5 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 04 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 05 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "4 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 03 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 04 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "3 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 02 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 03 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "2 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 01 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 02 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "1 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 00 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 01 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_loss ELSE NULL END                                      ' + 
        '   ) AS "0 hour"                                                                               ' +
        'FROM                                                                                           ' +
        '   router_source_metrics,                                                                      ' +
        '   routers_mapping                                                                             ' +
        'WHERE                                                                                          ' +
        '   router_source_metrics.cidr = routers_mapping.cidr                               AND         ' + 
        '   router_source_metrics.cidr = ?                                                  AND         ' +
        '   router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND         ' +
        '   router_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   router_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )              ' + 
        'GROUP BY                                                                                       ' +
        '   router_source_metrics.cidr                                                                  ',
        routersMappingRouterLossData[ "cidr" ],
        function( error, routersMappingLossCountData ) {

            if( routersMappingLossCountData.length > 0 ) {

                // Setup header
                routersMappingRouterLossData[ "std_loss_count" ].push( [ 'Time', 'Standard Loss' ] );

                // Fill the data
                var selectedHours = selectedHoursRange.toString().split( ',' );
                for( var i = selectedHours.length - 1; i >= 0; i-- ) {

                    if( routersMappingLossCountData[ 0 ][ i + ' hour' ] == null )
                        routersMappingRouterLossData[ "std_loss_count" ].push( [ selectedHours[ i ], 0 ] );
                    else
                        routersMappingRouterLossData[ "std_loss_count" ].push( [ selectedHours[ i ], routersMappingLossCountData[ 0 ][ i + ' hour' ] ] );

                }

                // Get the last on/off status, std_loss
                mysqlConnection.query(
                    'SELECT                                                                                     ' +
                    '   router_source_metrics.on_off    AS last_on_off,                                         ' +
                    '   router_source_metrics.std_loss  AS last_std_loss                                        ' +
                    'FROM                                                                                       ' +
                    '   router_source_metrics,                                                                  ' +
                    '   routers_mapping                                                                         ' +
                    'WHERE                                                                                      ' +
                    '   router_source_metrics.cidr = routers_mapping.cidr                               AND     ' + 
                    '   router_source_metrics.cidr = ?                                                  AND     ' +
                    '   router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND     ' + 
                    '   router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND     ' +
                    '   router_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND     ' + 
                    '   router_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )          ' + 
                    'ORDER BY                                                                                   ' +
                    '   router_source_metrics.collector_time DESC                                               ' +
                    'LIMIT 1                                                                                    ',
                    routersMappingRouterLossData[ "cidr" ],
                    function( error, routersMappingLossLastOnOffData ) {

                        if( routersMappingLossLastOnOffData.length > 0 ) {

                            routersMappingRouterLossData[ "on_off" ]        = routersMappingLossLastOnOffData[ 0 ][ "last_on_off" ];
                            routersMappingRouterLossData[ "last_std_loss" ] = routersMappingLossLastOnOffData[ 0 ][ "last_std_loss" ];

                        }

                        // Call next action
                        nextAction( routersMappingRouterLossData );

                        return;
                    }

                );

            }
            else {

                // No data for this router for the specified time range
                routersMappingRouterLossData = null;

                // Call next action
                nextAction( routersMappingRouterLossData );

            }

            return;
        }

    );

    return;
}

// Get information about routers mapping jitter
exports.getRoutersMappingJitter = function( request, response ) {

    // Routers mapping jitter data
    var routersMappingJitterData = [];

    // Google map zoom levels ranges
    var mapZoomLevelRanges = { 
        "divisionRange": [ 0, 8 ],
        "zipcodesRange": [ 9, 11 ],
        "routersRange":  [ 12, 19 ]
    };

    // Initialize routers mapping jitter data
    // Division level
    routersMappingJitterData[ 0 ] = { "zoomRange": mapZoomLevelRanges[ "divisionRange" ], "markersList": [] };

    // Zipcodes level
    routersMappingJitterData[ 1 ] = { "zoomRange": mapZoomLevelRanges[ "zipcodesRange" ], "markersList": [] };

    // Agents level
    routersMappingJitterData[ 2 ] = { "zoomRange": mapZoomLevelRanges[ "routersRange" ], "markersList": [] };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the divisions mapping jitter data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '    table1.division_id     AS division_id,                             ' +
                '    table1.division_name   AS division_name,                           ' +
                '    table1.lattitude       AS lattitude,                               ' +
                '    table1.longitude       AS longitude,                               ' +
                '    table1.updated_on      AS updated_on,                              ' +
                '    table3.std_jitter      AS std_jitter,                              ' +
                '    table3.avg_jitter      AS avg_jitter,                              ' +
                '    1                      AS map_marker,                              ' +
                '    (SELECT COUNT(DISTINCT table2.cidr)                                ' +
                '     FROM                                                              ' +
                '       routers_mapping table2                                          ' +
                '     WHERE                                                             ' +
                '          (table2.division_id = table1.division_id)) AS total_routers  ' +
                'FROM                                                                   ' +
                '    agent_mapping_divisions        table1,                             ' +
                '    agent_mapping_divisions        table2,                             ' +
                '    router_market_source_metrics   table3                              ' +
                'WHERE                                                                  ' +
                '    table1.division_id = table2.division_id                     AND    ' +
                '    table2.division_id = table3.division_id                     AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -9 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -9 HOUR )        ',
                function( error, routersMappingDivisionsJitterData ) {

                    if( routersMappingDivisionsJitterData.length > 0 )
                        routersMappingJitterData[ 0 ][ "markersList" ].push.apply( routersMappingJitterData[ 0 ][ "markersList" ], routersMappingDivisionsJitterData );

                    return;
                }

            );

            // Get the zipcodes mapping jitter data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '   table1.division_id AS division_id,                                  ' +
                '   table1.zipcode_id  AS zipcode_id,                                   ' +
                '   table1.city        AS city,                                         ' +
                '   table1.state       AS state,                                        ' +
                '   table1.lattitude   AS lattitude,                                    ' +
                '   table1.longitude   AS longitude,                                    ' +
                '   table1.updated_on  AS updated_on,                                   ' +
                '   table3.std_jitter  AS std_jitter,                                   ' +
                '   table3.avg_jitter  AS avg_jitter,                                   ' + 
                '   1                  AS map_marker,                                   ' +
                '   (SELECT COUNT(DISTINCT table2.cidr)                                 ' +
                '    FROM                                                               ' +
                '       routers_mapping table2                                          ' +
                '    WHERE                                                              ' +
                '       (table2.zipcode_id = table1.zipcode_id)) AS total_routers       ' +
                'FROM                                                                   ' +
                '    agent_mapping_zipcodes         table1,                             ' +
                '    agent_mapping_zipcodes         table2,                             ' +
                '    router_zipcode_source_metrics  table3                              ' +
                'WHERE                                                                  ' +
                '    table1.zipcode_id = table2.zipcode_id                       AND    ' +
                '    table2.zipcode_id = table3.zipcode_id                       AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, routersMappingZipcodesJitterData ) {

                    if( routersMappingZipcodesJitterData.length > 0 )
                        routersMappingJitterData[ 1 ][ "markersList" ].push.apply( routersMappingJitterData[ 1 ][ "markersList" ], routersMappingZipcodesJitterData );

                    return;
                }

            );

            // Get the routers mapping jitter data
            mysqlConnection.query(

                'SELECT                                 ' +
                '   cidr            AS cidr,            ' +
                '   zipcode_id      AS zipcode_id,      ' +
                '   division_id     AS division_id,     ' +
                '   router_market   AS router_market,   ' +
                '   ip_type         AS ip_type,         ' +
                '   cidr            AS cidr,            ' +
                '   lattitude       AS lattitude,       ' +
                '   longitude       AS longitude,       ' +
                '   1               AS map_marker,      ' +
                '   2               AS std_jitter_count ' +
                'FROM                                   ' +
                '   routers_mapping                     ' +
                'GROUP BY                               ' +
                '   routers_mapping.cidr                ',
                function( error, routersMappingRoutersJitterData ) {

                    if( routersMappingRoutersJitterData.length > 0 ) {

                        var routersCounter = 0;

                        // Get the last 24 hours backward from the last hour
                        getLast24HoursBackwardFromTheLastHour(

                            mysqlConnection,
                            routersMappingRoutersJitterData,
                            function( routersMappingRoutersJitterData, selectedHoursRange ) {

		                        // Get the number of std jitters for the last 24 hours for each router
		                        for( var i = 0; i < routersMappingRoutersJitterData.length; i++ ) {
		
		                            // Process the data
		                            getRouterStdJitterCount( 
		
		                                mysqlConnection, 
		                                routersMappingRoutersJitterData[ i ],
		                                selectedHoursRange,
		                                function( routersMappingRouterJitterData ) {
		
		                                    if( routersMappingRouterJitterData != null )
		                                        routersMappingJitterData[ 2 ][ "markersList" ].push( routersMappingRouterJitterData );
		
		                                    routersCounter += 1;
		
		                                    // Send the data
		                                    if( routersCounter == routersMappingRoutersJitterData.length ) { 
		
		                                        response.json( routersMappingJitterData );
		
		                                        mysqlModule.mysqlReportsPool.release( mysqlConnection );
		
		                                    }
		
		                                    return;
		                                }
		
		                            );
		
		                        }

                                return;
                            }

                        );

                    }
                    else {

                        // Send the data without any information about routers
                        response.json( routersMappingJitterData );

                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    }

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get count of std jitter for each router
function    getRouterStdJitterCount( mysqlConnection, routersMappingRouterJitterData, selectedHoursRange, nextAction ) {

    // Initialize the data
    routersMappingRouterJitterData[ "std_jitter_count" ] = [];
    routersMappingRouterJitterData[ "on_off" ]           = 0;
    routersMappingRouterJitterData[ "last_std_jitter" ]  = 0;

    // Get the router std jitter data
    mysqlConnection.query(

        'SELECT                                                                                         ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 23 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "23 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 22 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 23 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "22 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 21 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 22 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "21 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 20 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 21 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "20 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 19 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 20 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "19 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 18 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 19 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "18 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 17 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 18 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "17 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 16 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 17 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "16 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 15 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 16 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "15 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 14 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 15 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "14 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 13 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 14 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "13 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 12 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 13 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "12 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 11 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 12 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "11 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 10 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 11 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "10 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 09 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 10 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "9 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 08 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 09 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "8 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 07 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 08 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "7 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 06 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 07 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "6 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 05 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 06 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "5 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 04 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 05 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "4 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 03 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 04 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "3 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 02 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 03 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "2 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 01 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 02 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "1 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 00 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 01 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_jitter ELSE NULL END                                    ' + 
        '   ) AS "0 hour"                                                                               ' +
        'FROM                                                                                           ' +
        '   router_source_metrics,                                                                      ' +
        '   routers_mapping                                                                             ' +
        'WHERE                                                                                          ' +
        '   router_source_metrics.cidr = routers_mapping.cidr                               AND         ' + 
        '   router_source_metrics.cidr = ?                                                  AND         ' +
        '   router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND         ' +
        '   router_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   router_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )              ' + 
        'GROUP BY                                                                                       ' +
        '   router_source_metrics.cidr                                                                  ',
        routersMappingRouterJitterData[ "cidr" ],
        function( error, routersMappingJitterCountData ) {

            if( routersMappingJitterCountData.length > 0 ) {

                // Setup header
                routersMappingRouterJitterData[ "std_jitter_count" ].push( [ 'Time', 'Standard Jitter' ] );

                // Fill the data
                var selectedHours = selectedHoursRange.toString().split( ',' );
                for( var i = selectedHours.length - 1; i >= 0; i-- ) {

                    if( routersMappingJitterCountData[ 0 ][ i + ' hour' ] == null )
                        routersMappingRouterJitterData[ "std_jitter_count" ].push( [ selectedHours[ i ], 0 ] );
                    else
                        routersMappingRouterJitterData[ "std_jitter_count" ].push( [ selectedHours[ i ], routersMappingJitterCountData[ 0 ][ i + ' hour' ] ] );

                }

                // Get the last on/off status
                mysqlConnection.query(

                    'SELECT                                                                                 ' +
                    '   router_source_metrics.on_off        AS last_on_off,                                 ' +
                    '   router_source_metrics.std_jitter    AS last_std_jitter                              ' +
                    'FROM                                                                                   ' +
                    '   router_source_metrics,                                                              ' +
                    '   routers_mapping                                                                     ' +
                    'WHERE                                                                                  ' +
                    '   router_source_metrics.cidr = routers_mapping.cidr                               AND ' + 
                    '   router_source_metrics.cidr = ?                                                  AND ' +
                    '   router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND ' + 
                    '   router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND ' +
                    '   router_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND ' + 
                    '   router_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )      ' + 
                    'ORDER BY                                                                               ' +
                    '   router_source_metrics.collector_time DESC                                           ' +
                    'LIMIT 1                                                                                ',
                    routersMappingRouterJitterData[ "cidr" ],
                    function( error, routersMappingJitterLastOnOffData ) {

                        if( routersMappingJitterLastOnOffData.length > 0 ) {

                            routersMappingRouterJitterData[ "on_off" ]          = routersMappingJitterLastOnOffData[ 0 ][ "last_on_off" ];
                            routersMappingRouterJitterData[ "last_std_jitter" ] = routersMappingJitterLastOnOffData[ 0 ][ "last_std_jitter" ];

                        }

                        // Call next action
                        nextAction( routersMappingRouterJitterData );

                        return;
                    }

                );

            }
            else {

                // No data for this router for the specified time range
                routersMappingRouterJitterData = null;

                // Call next action
                nextAction( routersMappingRouterJitterData );

            }

            return;
        }

    );

    return;
}

// Get information about routers mapping latency
exports.getRoutersMappingLatency = function( request, response ) {

    // Routers mapping latency data
    var routersMappingLatencyData = [];

    // Google map zoom levels ranges
    var mapZoomLevelRanges = { 
        "divisionRange": [ 0, 8 ],
        "zipcodesRange": [ 9, 11 ],
        "routersRange":  [ 12, 19 ]
    };

    // Initialize routers mapping latency data
    // Division level
    routersMappingLatencyData[ 0 ] = { "zoomRange": mapZoomLevelRanges[ "divisionRange" ], "markersList": [] };

    // Zipcodes level
    routersMappingLatencyData[ 1 ] = { "zoomRange": mapZoomLevelRanges[ "zipcodesRange" ], "markersList": [] };

    // Agents level
    routersMappingLatencyData[ 2 ] = { "zoomRange": mapZoomLevelRanges[ "routersRange" ], "markersList": [] };

    mysqlModule.mysqlReportsPool.acquire( 

        function( error, mysqlConnection ) {

            // Get the divisions mapping latency data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '    table1.division_id     AS division_id,                             ' +
                '    table1.division_name   AS division_name,                           ' +
                '    table1.lattitude       AS lattitude,                               ' +
                '    table1.longitude       AS longitude,                               ' +
                '    table1.updated_on      AS updated_on,                              ' +
                '    table3.std_latency     AS std_latency,                             ' +
                '    table3.avg_latency     AS avg_latency,                             ' +
                '    1                      AS map_marker,                              ' +
                '    (SELECT COUNT(DISTINCT table2.cidr)                                ' +
                '     FROM                                                              ' +
                '       routers_mapping table2                                          ' +
                '     WHERE                                                             ' +
                '          (table2.division_id = table1.division_id)) AS total_routers  ' +
                'FROM                                                                   ' +
                '    agent_mapping_divisions        table1,                             ' +
                '    agent_mapping_divisions        table2,                             ' +
                '    router_market_source_metrics   table3                              ' +
                'WHERE                                                                  ' +
                '    table1.division_id = table2.division_id                     AND    ' +
                '    table2.division_id = table3.division_id                     AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -9 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -9 HOUR )        ',
                function( error, routersMappingDivisionsLatencyData ) {

                    if( routersMappingDivisionsLatencyData.length > 0 )
                        routersMappingLatencyData[ 0 ][ "markersList" ].push.apply( routersMappingLatencyData[ 0 ][ "markersList" ], routersMappingDivisionsLatencyData );

                    return;
                }

            );

            // Get the zipcodes mapping latency data
            mysqlConnection.query(

                'SELECT                                                                 ' +
                '   table1.division_id AS division_id,                                  ' +
                '   table1.zipcode_id  AS zipcode_id,                                   ' +
                '   table1.city        AS city,                                         ' +
                '   table1.state       AS state,                                        ' +
                '   table1.lattitude   AS lattitude,                                    ' +
                '   table1.longitude   AS longitude,                                    ' +
                '   table1.updated_on  AS updated_on,                                   ' +
                '   table3.std_latency AS std_latency,                                  ' +
                '   table3.avg_latency AS avg_latency,                                  ' + 
                '   1                  AS map_marker,                                   ' +
                '   (SELECT COUNT(DISTINCT table2.cidr)                                 ' +
                '    FROM                                                               ' +
                '       routers_mapping table2                                          ' +
                '    WHERE                                                              ' +
                '       (table2.zipcode_id = table1.zipcode_id)) AS total_routers       ' +
                'FROM                                                                   ' +
                '    agent_mapping_zipcodes         table1,                             ' +
                '    agent_mapping_zipcodes         table2,                             ' +
                '    router_zipcode_source_metrics  table3                              ' +
                'WHERE                                                                  ' +
                '    table1.zipcode_id = table2.zipcode_id                       AND    ' +
                '    table2.zipcode_id = table3.zipcode_id                       AND    ' +
                '    table3.partition_date > DATE_ADD( NOW(), INTERVAL -4 HOUR ) AND    ' +
                '    table3.collector_time > DATE_ADD( NOW(), INTERVAL -4 HOUR )        ',
                function( error, routersMappingZipcodesLatencyData ) {

                    if( routersMappingZipcodesLatencyData.length > 0 )
                        routersMappingLatencyData[ 1 ][ "markersList" ].push.apply( routersMappingLatencyData[ 1 ][ "markersList" ], routersMappingZipcodesLatencyData );

                    return;
                }

            );

            // Get the routers mapping latency data
            mysqlConnection.query(

                'SELECT                                     ' +
                '   cidr            AS cidr,                ' +
                '   zipcode_id      AS zipcode_id,          ' +
                '   division_id     AS division_id,         ' +
                '   router_market   AS router_market,       ' +
                '   ip_type         AS ip_type,             ' +
                '   lattitude       AS lattitude,           ' +
                '   longitude       AS longitude,           ' +
                '   1               AS map_marker,          ' +
                '   2               AS std_latency_count    ' +
                'FROM                                       ' +
                '   routers_mapping                         ' +
                'GROUP BY                                   ' +
                '   routers_mapping.cidr                    ',
                function( error, routersMappingRoutersLatencyData ) {

                    if( routersMappingRoutersLatencyData.length > 0 ) {

                        var routersCounter = 0;

                        // Get the last 24 hours backward from the last hour
                        getLast24HoursBackwardFromTheLastHour(

                            mysqlConnection,
                            routersMappingRoutersLatencyData,
                            function( routersMappingRoutersLatencyData, selectedHoursRange ) {

                                // Get the number of std latencies for the last 24 hours for each router
		                        for( var i = 0; i < routersMappingRoutersLatencyData.length; i++ ) {

		                            // Process the data
		                            getRouterStdLatencyCount( 

		                                mysqlConnection, 
		                                routersMappingRoutersLatencyData[ i ],
		                                selectedHoursRange,
		                                function( routersMappingRouterLatencyData ) {

		                                    if( routersMappingRouterLatencyData != null )
		                                        routersMappingLatencyData[ 2 ][ "markersList" ].push( routersMappingRouterLatencyData );

		                                    routersCounter += 1;

		                                    // Send the data
		                                    if( routersCounter == routersMappingRoutersLatencyData.length ) { 

		                                        response.json( routersMappingLatencyData );

		                                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

		                                    }

		                                    return;
		                                }

		                            );

		                        }

                                return;
                            }

                        );

                    }
                    else {

                        // Send the data without any information about routers
                        response.json( routersMappingLatencyData );

                        mysqlModule.mysqlReportsPool.release( mysqlConnection );

                    }

                    return;
                }

            );

            return;
        }

    );

    return;
}

// Get count of std latency for each router
function    getRouterStdLatencyCount( mysqlConnection, routersMappingRouterLatencyData, selectedHoursRange, nextAction ) {

    // Initialize the data
    routersMappingRouterLatencyData[ "std_latency_count" ] = [];
    routersMappingRouterLatencyData[ "on_off" ]            = 0;
    routersMappingRouterLatencyData[ "last_std_latency" ]  = 0;

    // Get the router std latency data
    mysqlConnection.query(

        'SELECT                                                                                         ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 23 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "23 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 22 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 23 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "22 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 21 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 22 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "21 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 20 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 21 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "20 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 19 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 20 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "19 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 18 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 19 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "18 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 17 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 18 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "17 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 16 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 17 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "16 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 15 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 16 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "15 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 14 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 15 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "14 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 13 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 14 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "13 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 12 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 13 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "12 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 11 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 12 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "11 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 10 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 11 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "10 hour",                                                                             ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 09 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 10 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "9 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 08 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 09 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "8 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 07 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 08 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "7 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 06 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 07 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "6 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 05 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 06 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "5 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 04 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 05 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "4 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 03 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 04 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "3 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 02 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 03 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "2 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 01 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 02 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' + 
        '   ) AS "1 hour",                                                                              ' +
        '   SUM( CASE                                                                                   ' +
        '      WHEN(                                                                                    ' +
        '         router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 00 DAY_HOUR ) AND   ' +
        '         router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 01 DAY_HOUR )       ' +
        '      ) THEN router_source_metrics.avg_latency ELSE NULL END                                   ' +
        '   ) AS "0 hour"                                                                               ' +
        'FROM                                                                                           ' +
        '   router_source_metrics,                                                                      ' +
        '   routers_mapping                                                                             ' +
        'WHERE                                                                                          ' +
        '   router_source_metrics.cidr = routers_mapping.cidr                               AND         ' + 
        '   router_source_metrics.cidr = ?                                                  AND         ' +
        '   router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND         ' +
        '   router_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND         ' + 
        '   router_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )              ' + 
        'GROUP BY                                                                                       ' +
        '   router_source_metrics.cidr                                                                  ',
        routersMappingRouterLatencyData[ "cidr" ],
        function( error, routersMappingLatencyCountData ) {

            // if( routersMappingLatencyCountData && routersMappingLatencyCountData.length > 0 ) {
            if( routersMappingLatencyCountData.length > 0 ) {

                // Setup header
                routersMappingRouterLatencyData[ "std_latency_count" ].push( [ 'Time', 'Standard Latency' ] );

                // Fill the data
                var selectedHours = selectedHoursRange.toString().split( ',' );
                for( var i = selectedHours.length - 1; i >= 0; i-- ) {

                    if( routersMappingLatencyCountData[ 0 ][ i + ' hour' ] == null )
                        routersMappingRouterLatencyData[ "std_latency_count" ].push( [ selectedHours[ i ], 0 ] );
                    else
                        routersMappingRouterLatencyData[ "std_latency_count" ].push( [ selectedHours[ i ], routersMappingLatencyCountData[ 0 ][ i + ' hour' ] ] );

                }

                // Get the last on/off status, std_latency value
                mysqlConnection.query(
                    'SELECT                                                                                 ' +
                    '   router_source_metrics.on_off        AS last_on_off,                                 ' +
                    '   router_source_metrics.std_latency   AS last_std_latency                             ' +
                    'FROM                                                                                   ' +
                    '   router_source_metrics,                                                              ' +
                    '   routers_mapping                                                                     ' +
                    'WHERE                                                                                  ' +
                    '   router_source_metrics.cidr = routers_mapping.cidr                               AND ' + 
                    '   router_source_metrics.cidr = ?                                                  AND ' +
                    '   router_source_metrics.partition_date >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND ' + 
                    '   router_source_metrics.partition_date <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )  AND ' +
                    '   router_source_metrics.collector_time >= DATE_SUB( now(), INTERVAL 24 DAY_HOUR ) AND ' + 
                    '   router_source_metrics.collector_time <  DATE_SUB( now(), INTERVAL 0 DAY_HOUR )      ' + 
                    'ORDER BY                                                                               ' +
                    '   router_source_metrics.collector_time DESC                                           ' +
                    'LIMIT 1                                                                                ',
                    routersMappingRouterLatencyData[ "cidr" ],
                    function( error, routersMappingLatencyLastOnOffData ) {

                        if( routersMappingLatencyLastOnOffData.length > 0 ) {

                            routersMappingRouterLatencyData[ "on_off" ]           = routersMappingLatencyLastOnOffData[ 0 ][ "last_on_off" ];
                            routersMappingRouterLatencyData[ "last_std_latency" ] = routersMappingLatencyLastOnOffData[ 0 ][ "last_std_latency" ];

                        }

                        // Call next action
                        nextAction( routersMappingRouterLatencyData );

                        return;
                    }

                );

            }
            else {

                // No data for this router for the specified time range
                routersMappingRouterLatencyData = null;

                // Call next action
                nextAction( routersMappingRouterLatencyData );

            }

            return;
        }

    );

    return;
}

// Get the last 24 hours backward from the last hour
function getLast24HoursBackwardFromTheLastHour( mysqlConnection, dataContainer, nextAction ) {

    var selectedHoursRange = "";

    mysqlConnection.query(

        'SELECT                                                                                 ' +
        '   CONCAT_WS(                                                                          ' + 
        '       ",",                                                                            ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  0 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  1 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  2 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  3 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  4 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  5 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  6 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  7 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  8 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL  9 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 10 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 11 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 12 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 13 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 14 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 15 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 16 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 17 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 18 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 19 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 20 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 21 DAY_HOUR ) ), ":00" ),  ' +
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 22 DAY_HOUR ) ), ":00" ),  ' + 
        '       CONCAT( EXTRACT( HOUR FROM DATE_SUB( NOW(), INTERVAL 23 DAY_HOUR ) ), ":00" )   ' +
        '   ) AS selected_hours                                                                 ',
        function( error, selectedHours ) {

            if( selectedHours.length > 0 ) {

                // Fill the data
                selectedHoursRange = selectedHours[ 0 ][ "selected_hours" ];

            }

            // Call next action
            nextAction( dataContainer, selectedHoursRange );

            return;
        }

    );

    return;
}
