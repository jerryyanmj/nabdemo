/**
 * This script is used for show data for report 'Network Latency' page
 */

( function ( window, document, $ ) {

    function generateFakeData() {

        // var sources = amount-2;
        // var targets = amount;

        var fakeData = {

            "uniqueSources": [{"source_division": "San Francisco"},{"source_division": "Denver"},{"source_division": "Seattle"},{"source_division": "Chicago"},{"source_division": "New York"},{"source_division": "Boston"},{"source_division": "Florida"},{"source_division":  "Houston"}],
            "uniqueTargets": [{"target_division": "San Francisco"},{"target_division": "Denver"},{"target_division": "Seattle"},{"target_division": "Chicago"},{"target_division": "New York"},{"target_division": "Boston"},{"target_division": "Florida"},{"target_division":  "Houston"}],
            "heatMapData":   []

        };

        for(var i=0; i < fakeData.uniqueSources.length; i++) {

            for(var j=0; j < fakeData.uniqueTargets.length; j++) {

                fakeData["heatMapData"].push({
                    "source_division": fakeData.uniqueSources[i].source_division,
                    "target_division": fakeData.uniqueTargets[j].target_division,
                    "avg_latency": Math.floor((Math.random() * 100) + 1)
                });
            }

        }
        console.log(fakeData);
        return fakeData;

    }


    Array.prototype.inArray = function(comparer) {
        for(var i=0; i < this.length; i++) {
            if(comparer(this[i])) return true;
        }
        return false;
    };
    Array.prototype.pushIfNotExist = function(element, comparer) {
        if (!this.inArray(comparer)) {
            this.push(element);
        }
    };

    // Class ReportNetworkLatency instance
    var reportNetworkLatency = null;

    // Class ReportNetworkLatency definition
    var ReportNetworkLatency = function() {

        // Class instance
        var self = this;

        // Get report network latency data
        self.getReportNetworkLatency();

        // Set time interval for getting infromation about the report network latency
        setInterval(

            function() {

                self.getReportNetworkLatency();

                return;
            }, 
            self.pageRefreshInterval

        );

        return;
    };

    // How wait between page refreshing ( in milliseconds )
    ReportNetworkLatency.prototype.pageRefreshInterval = 3600000;

    // Get report network latency data
    ReportNetworkLatency.prototype.getReportNetworkLatency = function() {

        var self = this;
        console.log("....");
        self.createHeatMap( generateFakeData() );

        // $.ajax(
        //     {

	       //      url:       '/cnep/ajax/report_network_latency.json',
	       //      dataType:  'json',
	
	       //      error: function( error ) {
	
	       //          console.log( "Error: " + error.message );
	
	       //          return;
	       //      },
	
	       //      success: function( networkLatencyData ) {
        //             console.log( networkLatencyData );

	       //          // Refresh network latency data
	       //          self.createHeatMap( networkLatencyData );

	       //          return;
	       //      }
        
        //     }
        // );

        return;
    };

    ReportNetworkLatency.prototype.createHeatMap = function ( data ) {
        var margin = { top: 50, right: 120, bottom: 100, left: 120 },
            width = 860 - margin.left - margin.right,
            height = 900 - margin.top - margin.bottom,
            buckets = 9,
            colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
            sources = [],
            targets = [];

        for(var i=0; i< data.uniqueSources.length; i++) {
            sources.push(data.uniqueSources[i].source_division);
        }

        for(var i=0; i< data.uniqueTargets.length; i++) {
            targets.push(data.uniqueTargets[i].target_division);
        }

        for(var i=0; i < data.heatMapData.length; i++ ) {

            if(data.heatMapData[i]["source_division"] === "" || data.heatMapData[i]["source_division"] === "") {
                data.heatMapData.splice(i, 1);
            }
        }
        if(sources.length >= targets.length) {
            var gridSize = Math.floor(width / (sources.length-1));
        } else {
            var gridSize = Math.floor(width / (targets.length-1));
        }

        var legendElementWidth = Math.floor(width / buckets);
        console.log(data.uniqueSources);

        console.log(data.uniqueTargets);
        console.log(data.heatMapData);



        var colorScale = d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data.heatMapData, function (d) { return d.avg_latency; })])
            .range(colors);

        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var sourceLabels = svg.selectAll(".sourceLabel")
            .data(sources)
            .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

        var targetLabels = svg.selectAll(".targetLabel")
            .data(targets)
            .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

        var heatMap = svg.selectAll(".heat")
            .data(data.heatMapData)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(" + gridSize + "," + gridSize + ")"; });

        heatMap.append("rect")
            .attr("x", function(d) { return (targets.indexOf(d.target_division)) * gridSize - gridSize; })
            .attr("y", function(d) { return (sources.indexOf(d.source_division)) * gridSize - gridSize; })
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .style("fill", colors[0]);

        heatMap.transition().duration(1000)
            .select("rect")
            .style("fill", function(d) { return colorScale(d.avg_latency); });

        heatMap.append("text")
            .attr("x", function(d) { return (targets.indexOf(d.target_division) * gridSize) - gridSize/2; })
            .attr("y", function(d) { return (sources.indexOf(d.source_division) * gridSize) - gridSize/2+5; })
            .attr("text-anchor", "middle")
            .text(function (d) { return d.avg_latency; })
            .style("font-size", "15pt")
            .style("font-weight", "bold");



        heatMap.append("title").text(function(d) { return d.avg_latency; });

        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) { return d; })
            .enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 4)
            .style("fill", function(d, i) { return colors[i]; });

        legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height - 10);

    }


    // Refresh network latency data
    ReportNetworkLatency.prototype.refreshReportNetworkLatencyData = function( networkLatencyData ) {

        var networkLatencyTableHeaderContent = "";
        var networkLatencyTableBodyContent   = "";
        var networkLatencyTableCellContent   = "";
        var networkLatencyTableCellColor     = "";

        // Empty network latency table
        $( '#networkLatencyTable' ).empty();

        if( networkLatencyData != null && networkLatencyData[ "uniqueTargetsData" ] != null && networkLatencyData[ "uniqueTargetsData" ].length > 0 ) { 

            networkLatencyTableHeaderContent += "<th style='text-align: center; min-width: 200px;'>Sources | Targets</th>";

            // Generate network latency table header content
	        for( var i = 0; i < networkLatencyData[ "uniqueTargetsData" ].length; i++ ) {

                networkLatencyTableHeaderContent += "<th style='text-align: center'>" + networkLatencyData[ "uniqueTargetsData" ][ i ][ "target_division" ] + "</th>";

	        }

            // Create network latency table header
            $( '#networkLatencyTable' ).append(
                '<thead>' +
                '   <tr>' +
                networkLatencyTableHeaderContent +
                '   </tr>' +
                '</thead>'
            );

            // Generate network latency table body content
            var networkLatencyDataHashKey = null;
            for( var i = 0; i < networkLatencyData[ "uniqueSourcesData" ].length; i++ ) {

                // Display the source start
                networkLatencyTableBodyContent += "<tr>";
                networkLatencyTableBodyContent += "<td style='min-width: 200px;'>" + networkLatencyData[ "uniqueSourcesData" ][ i ][ "source_division" ] + "</td>";

                // Display the targets for the current source
                for( var j = 0; j < networkLatencyData[ "uniqueTargetsData" ].length; j++ ) {

                    // Generate networkLatencyDataHashKey
                    networkLatencyDataHashKey = networkLatencyData[ "uniqueSourcesData" ][ i ][ "source_division" ] + "," + networkLatencyData[ "uniqueTargetsData" ][ j ][ "target_division" ]; 

                    // Check, if this key exists
                    if( networkLatencyData[ "reportData" ][ networkLatencyDataHashKey ] != null ) {

                        // Determine the color
                        if( networkLatencyData[ "reportData" ][ networkLatencyDataHashKey ][ "avg_latency_p_changes" ] == 0 )
                            networkLatencyTableCellColor = "yellow";
                        else if( networkLatencyData[ "reportData" ][ networkLatencyDataHashKey ][ "avg_latency_p_changes" ] > 0 )
                            networkLatencyTableCellColor = "red";
                        else if( networkLatencyData[ "reportData" ][ networkLatencyDataHashKey ][ "avg_latency_p_changes" ] < 0 )
                            networkLatencyTableCellColor = "green";

                        networkLatencyTableBodyContent += "<td style='background-color: " + networkLatencyTableCellColor + ";'>" + networkLatencyData[ "reportData" ][ networkLatencyDataHashKey ][ "latency" ] + "</td>";

                        // Delete this key from the hash
                        delete networkLatencyData[ "reportData" ][ networkLatencyDataHashKey ];

                    }
                    // Key is not exists
                    else {

                        networkLatencyTableBodyContent += "<td>-</td>";

                    }

                }

                // Display the source end
                networkLatencyTableBodyContent += "</tr>";

            }

            // Create network latency table body
            $( '#networkLatencyTable' ).append( '<tbody>' );
            $( '#networkLatencyTable' ).append( networkLatencyTableBodyContent );
            $( '#networkLatencyTable' ).append( '</tbody>' );

        }
        else {

            // Create empty table with no data

            // Create network latency table empty header
            $( '#networkLatencyTable' ).append(
                '<thead>                                            ' +
                '   <tr>                                            ' +
                '       <th style="text-align: center">No data</th> ' +
                '   </tr>                                           ' +
                '</thead>                                           '
            );

            // Create network latency table empty body
            $( '#networkLatencyTable' ).append( '<tbody>' );
            $( '#networkLatencyTable' ).append( '</tbody>' );

        }

        // Initialize network latency table
        $( '#networkLatencyTable' ).dataTable(
            {
                "paging":           true,
                "pagingType":       "simple_numbers",
                "lengthChange":     true,
                "info":             true,
                "searching":        true,
                "destroy":          true
            }
        );

        return;
    };

    // Entry point
    ( function main() {

        $( document ).ready(

            function() {

                // Disable any caching for this page
                $.ajaxSetup(
                    {
                        cache: false
                    }
                );

                //createHeatMap(heatMapData);
                // Initialize report network latency
                reportNetworkLatency = new ReportNetworkLatency();

                return;
            }

        );

        return;
    })();

    return;
} )( window, document, jQuery );
