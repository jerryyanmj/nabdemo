
( function( document, $ ) {


    var tables = ['worse-routes', 'worse-cidr', 'popular-cidr'];
    var details = {
        'worse-routes': {
            title: 'Top 25 Worse Routes',
            description: 'Shows the list of the top 25 worse performing routes.',
            columns: [
                {
                    title: 'Start IP',
                    value: 'start_ip'
                },
                {
                    title: 'Target IP',
                    value: 'target_ip'
                },
                {
                    title: 'Avg Number of Hops',
                    value: 'avg_number_of_hops'
                },
                {
                    title: 'Avg RTT',
                    value: 'avg_rtt'
                },
                {
                    title: 'Avg Jitter',
                    value: 'avg_jitter'
                },
                {
                    title: 'Avg Loss',
                    value: 'avg_loss'
                }
            ]
        },
        'worse-cidr': {
            title: 'Top 25 Worse CIDRS',
            description: 'Shows the list of the top 25 worse cidr.',
            columns: [
                {
                    title: 'CIDR',
                    value: 'cidr'
                },
                {
                    title: 'IP Count',
                    value: 'ip_count'
                },
                {
                    title: 'Amount of Pings',
                    value: 'amount_of_pings'
                },
                {
                    title: 'Avg RTT',
                    value: 'avg_rtt'
                },
                {
                    title: 'Max RTT',
                    value: 'max_rtt'
                },
                {
                    title: 'Min RTT',
                    value: 'min_rtt'
                },
                {
                    title: 'Avg Loss',
                    value: 'avg_loss'
                },
                {
                    title: 'Max Loss',
                    value: 'max_loss'
                },
                {
                    title: 'Min Loss',
                    value: 'min_loss'
                },
                {
                    title: 'Avg Jitter',
                    value: 'avg_jitter'
                },
                {
                    title: 'Max Jitter',
                    value: 'max_jitter'
                },
                {
                    title: 'Min Jitter',
                    value: 'min_jitter'
                },
            ]
        },
        'popular-cidr': {
            title: 'Top 25 Popular CIDRS',
            description: 'Shows the list of the top 25 popular cidr.',
            columns: [
                {
                    title: 'CIDR',
                    value: 'cidr'
                },
                {
                    title: 'IP Count',
                    value: 'ip_count'
                },
                {
                    title: 'Amount of Pings',
                    value: 'amount_of_pings'
                },
                {
                    title: 'Avg RTT',
                    value: 'avg_rtt'
                },
                {
                    title: 'Max RTT',
                    value: 'max_rtt'
                },
                {
                    title: 'Min RTT',
                    value: 'min_rtt'
                },
                {
                    title: 'Avg Loss',
                    value: 'avg_loss'
                },
                {
                    title: 'Max Loss',
                    value: 'max_loss'
                },
                {
                    title: 'Min Loss',
                    value: 'min_loss'
                },
                {
                    title: 'Avg Jitter',
                    value: 'avg_jitter'
                },
                {
                    title: 'Max Jitter',
                    value: 'max_jitter'
                },
                {
                    title: 'Min Jitter',
                    value: 'min_jitter'
                },
            ]
        }
    };
    var currentTable = 0;

    function    nextTable() {


        currentTable += 1;
        if(currentTable == tables.length) {currentTable = 0;}

        console.log('tables.length: ' + tables.length);
        console.log('tables[currentTable]: ' + tables[currentTable]);
        console.log('currentTable: ' + currentTable);
        get_table_data(tables[currentTable]);

    }

    function    prevTable() {
        currentTable -= 1;
        if(currentTable < 0) {currentTable = tables.length;}

        get_table_data(tables[currentTable]);

    }

    // Create the Top 25 table
    function    createTable( data, key ) {
        console.log('create table for ' + key);
        //Clear the table
        $('#headerContainer').empty();
        $('#tableContainer').empty();

        //sort the data so that the most recent data is on top of the list
        data.sort(function(a,b) {

            return (b["collector_time"] > a["collector_time"]) ? 1 : ((b["collector_time"] < a["collector_time"]) ? -1 : 0);
        });
        var collectorTime = new Date(data[0]["collector_time"]);

        $('#headerContainer').append(
            '<span class="desc-button" style="float:left; padding-top:7px;"><i id="desc-button" class="glyphicon glyphicon-question-sign"></i></span>        ' +
            '<h4 style="float:left; padding-left: 10px; " > ' + details[key].title + ' </h4>' +
            '<h4 style="float:right; padding-right: 25px;">' + collectorTime.getHours() + ':00:00 </h4>'
        );

        var columnsTitles = '';
        for( var i=0; i < details[key].columns.length; i++ ) {
            columnsTitles += '<th>' + details[key].columns[i].title + '</th>';
        }


        //Create table structure
        $('#tableContainer').append(

            '<div class="toggleDiv"  id="table-desc" style="display: none; text-align: left;">' +
             details[key].description +
            '</div>                                                         ' +
            '<table id="top25table" class="table table-striped table-bordered table-condensed table-hover" style="background-color: white; color: black;">                ' +
            '   <thead>                                     ' +
            '       <tr>                                    ' +
             columnsTitles +
            '       </tr>                                   ' +
            '   </thead>                                    ' +
            '   <tbody>                                     ' +
            '   </tbody>                                    ' +
            '</table>                                       '
        );

        var tableRowsData = '';
        var tableRowsCount = 25;
        if(data.length < 25) tableRowsCount = data.length;
        for(var i = 0; i < tableRowsCount; i++ ) {
            tableRowsData += '<tr>';
            for( var j=0; j < details[key].columns.length; j++ ) {
                tableRowsData += '<td>' + data[i][details[key].columns[j].value] + '</td>'
            }
            tableRowsData += '</tr>';
        }

        //Insert data in the table
        $('#top25table > tbody:last').append( tableRowsData );


        $('.desc-button').click(function() {
            $('#table-desc').slideToggle(600);
        });

    }

    function    get_table_data(key) {
        console.log('/cnep/ajax/' + key + '-report-data.json');
        $.ajax(

            {

                url: '/cnep/ajax/' + key + '-report-data.json',

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( report_data ) {


                    display_table_data( report_data, key );

                    report_data = null;

                    return;
                }

            }

        );

        return;
    }

    function    display_table_data( data, key ) {

        // Draw the chart itself
        createTable( data , key );

        return;
    }


    // Get Worst CIDR report data
    function    get_worse_cidr_data() {

        $.ajax(

            {

                url: '/cnep/ajax/worse-cidr-report-data.json',

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( worse_cidr_report_data ) {


                    display_worse_cidr_report_data( worse_cidr_report_data );

                    worse_cidr_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Display Worst CIDR report data
    function    display_worse_cidr_report_data( data ) {

        // Draw the chart itself
        createTable( data , 'worse_cidr');

        return;
    }

    // Get Popular CIDR report data
    function    get_popular_cidr_data() {

        $.ajax(

            {

                url: '/cnep/ajax/popular-cidr-report-data.json',

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( popular_cidr_report_data ) {


                    display_popular_cidr_report_data( popular_cidr_report_data );

                    popular_cidr_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Display Popular CIDR report data
    function    display_popular_cidr_report_data( data ) {

        // Draw the chart itself
        createTable( data , 'popular_cidr');

        return;
    }

// Get Worst Routers report data
    function    get_worse_routes_data() {

        $.ajax(

            {

                url: '/cnep/ajax/worse-routes-report-data.json',

                dataType: 'json',

                error: function( errorObject ) {

                    console.log( errorObject );

                    return;
                },

                success: function( worse_routes_report_data ) {


                    display_worse_routes_report_data( worse_routes_report_data );

                    worse_routes_report_data = null;

                    return;
                }

            }

        );

        return;
    }

    // Display Worst Routers report data
    function    display_worse_routes_report_data( data ) {

        // Draw the chart itself
        createTable( data , 'worse_routes');

        return;
    }





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

                nextTable();

                $('.left-button').click(function () {

                    prevTable();
                    //if(currentTable == 'worse-routes') {
                    //    get_worse_cidr_data();
                    //    currentTable = 'worse-cidr';
                    //}
                    //else if( currentTable == 'worse-cidr' ) {
                    //    get_worse_routes_data();
                    //    currentTable = 'worse-routes';
                    //}
                });

                $('.right-button').click(function () {


                    nextTable();
                    //if(currentTable == 'worse-routes') {
                    //    get_worse_cidr_data();
                    //    currentTable = 'worse-cidr';
                    //}
                    //else if( currentTable == 'worse-cidr' ) {
                    //    get_worse_routes_data();
                    //    currentTable = 'worse-routes';
                    //}
                });



                return;
            }
        );

        return;
    })();

}).call( this, document, jQuery );
