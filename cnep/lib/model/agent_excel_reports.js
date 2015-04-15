// This module is used to get the information, related to agent Excel reports functionality

var config      = require( '../../config' );
var excelExport = require( 'excel4node' );

// Reports names
var excelReportNames = {

    'JitterReportName':             'Jitter Report',
    'topTenWorstSourcesReportName': 'Top Ten Worst Sources Report',
    'disconnectedAgentsReportName': 'Disconnected Agents Report',
    'distanceAndSpeedReportName':   'Distance and Speed Report',
    'historicalLatencyReportName':  'Historical Latency Report',
    'historicalLossReportName':     'Historical Loss Report'

};

// Reports Excel names
var excelFilesReportNames = {

    'jitterReportExcelFileName':             'JitterReport.xlsx',
    'topTenWorstSourcesReportExcelFileName': 'TopTenWorstSourcesReport.xlsx',
    'disconnectedAgentsReportExcelFileName': 'DisconnectedAgentsReport.xlsx',
    'distanceAndSpeedReportExcelFileName':   'DistanceAndSpeedReport.xlsx',
    'historicalLatencyReportExcelFileName':  'HistoricalLatencyReport.xlsx',
    'historicalLossReportExcelFileName':     'HistoricalLossReport.xlsx'

};

// Alignment
var alignment = {

    'center':   'center'

};

// Color
var color = {

    'white':    'FFFFFF',
    'red':      'FF0000',
    'green':    '00CC00'

};

// Fill pattern
var fillPattern = {

    'solid':    'solid'

};

// Table border style
var tableBorderStyle = {

    'thin':     'thin'

};

// Generate Excel output for agents jitter report
exports.generateExcelOutputJitterReport = function( request, response, nextAction ) {

    var workBook  = new excelExport.WorkBook();
    var workSheet = workBook.WorkSheet( excelReportNames.JitterReportName );

    var jitterTableBorderStyle = {
        top:{
            style:  tableBorderStyle.thin
        },
        bottom:{
            style:  tableBorderStyle.thin
        },
        left:{
            style:  tableBorderStyle.thin
        },
        right:{
            style:  tableBorderStyle.thin
        }
    };

    // Setup jitter table header
    var jitterTableHeaderStyle = workBook.Style();
	jitterTableHeaderStyle.Font.Bold();
	jitterTableHeaderStyle.Font.Size(12 );
	jitterTableHeaderStyle.Font.Alignment.Horizontal( alignment.center );
	jitterTableHeaderStyle.Font.WrapText( false );
	jitterTableHeaderStyle.Border( jitterTableBorderStyle );

    // Setup jitter table body
    var jitterTableBodyStyle = workBook.Style();
    jitterTableBodyStyle.Font.Alignment.Horizontal( alignment.center );
    jitterTableBodyStyle.Font.WrapText( false );
    jitterTableBodyStyle.Border( jitterTableBorderStyle );

    // Fill up jitter table header
    workSheet.Cell( 1, 1 ).Style( jitterTableHeaderStyle );
    workSheet.Cell( 1, 2 ).Style( jitterTableHeaderStyle );
    workSheet.Cell( 1, 3 ).Style( jitterTableHeaderStyle );
    workSheet.Cell( 1, 4 ).Style( jitterTableHeaderStyle );
    workSheet.Cell( 1, 5 ).Style( jitterTableHeaderStyle );
    workSheet.Cell( 1, 6 ).Style( jitterTableHeaderStyle );
    workSheet.Cell( 1, 7 ).Style( jitterTableHeaderStyle );
    workSheet.Cell( 1, 8 ).Style( jitterTableHeaderStyle );

    workSheet.Column( 1 ).Width( 30 );
    workSheet.Column( 2 ).Width( 15 );
    workSheet.Column( 3 ).Width( 15 );
    workSheet.Column( 4 ).Width( 15 );
    workSheet.Column( 5 ).Width( 15 );
    workSheet.Column( 6 ).Width( 15 );
    workSheet.Column( 7 ).Width( 15 );
    workSheet.Column( 8 ).Width( 15 );

    workSheet.Cell( 1, 1 ).String( "Route" );
    workSheet.Cell( 1, 2 ).String( request.session.lastSevenDates[ 0 ].day1 );
    workSheet.Cell( 1, 3 ).String( request.session.lastSevenDates[ 0 ].day2 );
    workSheet.Cell( 1, 4 ).String( request.session.lastSevenDates[ 0 ].day3 );
    workSheet.Cell( 1, 5 ).String( request.session.lastSevenDates[ 0 ].day4 );
    workSheet.Cell( 1, 6 ).String( request.session.lastSevenDates[ 0 ].day5 );
    workSheet.Cell( 1, 7 ).String( request.session.lastSevenDates[ 0 ].day6 );
    workSheet.Cell( 1, 8 ).String( request.session.lastSevenDates[ 0 ].day7 );

    var jitterTableWhiteCellStyle = workBook.Style();
    jitterTableWhiteCellStyle.Font.Alignment.Horizontal( alignment.center );
    jitterTableWhiteCellStyle.Font.WrapText( false );
    jitterTableWhiteCellStyle.Fill.Pattern( fillPattern.solid );
    jitterTableWhiteCellStyle.Fill.Color( color.white );
    jitterTableWhiteCellStyle.Border( jitterTableBorderStyle );

    var jitterTableGreenCellStyle = workBook.Style();
    jitterTableGreenCellStyle.Font.Alignment.Horizontal( alignment.center );
    jitterTableGreenCellStyle.Font.WrapText( false );
    jitterTableGreenCellStyle.Fill.Pattern( fillPattern.solid );
    jitterTableGreenCellStyle.Fill.Color( color.green );
    jitterTableGreenCellStyle.Border( jitterTableBorderStyle );

    var jitterTableRedCellStyle = workBook.Style();
    jitterTableRedCellStyle.Font.Alignment.Horizontal( alignment.center );
    jitterTableRedCellStyle.Font.WrapText( false );
    jitterTableRedCellStyle.Fill.Pattern( fillPattern.solid );
    jitterTableRedCellStyle.Fill.Color( color.red );
    jitterTableRedCellStyle.Border( jitterTableBorderStyle );

    // Fill up jitter table body
    for( var i = 0; i < request.session.jitterReport.length; i++ ) {

        workSheet.Cell( i + 2, 1 ).Style( jitterTableWhiteCellStyle );
        workSheet.Cell( i + 2, 1 ).String( request.session.jitterReport[ i ].route );

        workSheet.Cell( i + 2, 2 ).Style( jitterTableWhiteCellStyle );
        if( request.session.jitterReport[ i ].day1 == null ) {
            workSheet.Cell( i + 2, 2 ).String( '-' );
        }
        else {

            if( request.session.jitterReport[ i ].day1 > 0 ) {
                if( request.session.jitterReport[ i ].day1 < 0.5 ) {
                    workSheet.Cell( i + 2, 2 ).Style( jitterTableGreenCellStyle );
                }
                else {
                    workSheet.Cell( i + 2, 2 ).Style( jitterTableRedCellStyle );
                }
            }
            else if( request.session.jitterReport[ i ].day1 < 0 ) {
                workSheet.Cell( i + 2, 2 ).Style( jitterTableGreenCellStyle );
            }

            workSheet.Cell( i + 2, 2 ).Number( request.session.jitterReport[ i ].day1 );
        }

        workSheet.Cell( i + 2, 3 ).Style( jitterTableWhiteCellStyle );
        if( request.session.jitterReport[ i ].day2 == null ) {
            workSheet.Cell( i + 2, 3 ).String( '-' );
        }
        else {

            if( request.session.jitterReport[ i ].day2 > 0 ) {
                if( request.session.jitterReport[ i ].day2 < 0.5 ) {
                    workSheet.Cell( i + 2, 3 ).Style( jitterTableGreenCellStyle );
                }
                else {
                    workSheet.Cell( i + 2, 3 ).Style( jitterTableRedCellStyle );
                }
            }
            else if( request.session.jitterReport[ i ].day2 < 0 ) {
                workSheet.Cell( i + 2, 3 ).Style( jitterTableGreenCellStyle );
            }

            workSheet.Cell( i + 2, 3 ).Number( request.session.jitterReport[ i ].day2 );
        }

        workSheet.Cell( i + 2, 4 ).Style( jitterTableWhiteCellStyle );
        if( request.session.jitterReport[ i ].day3 == null ) {
            workSheet.Cell( i + 2, 4 ).String( '-' );
        }
        else {

            if( request.session.jitterReport[ i ].day3 > 0 ) {
                if( request.session.jitterReport[ i ].day3 < 0.5 ) {
                    workSheet.Cell( i + 2, 4 ).Style( jitterTableGreenCellStyle );
                }
                else {
                    workSheet.Cell( i + 2, 4 ).Style( jitterTableRedCellStyle );
                }
            }
            else if( request.session.jitterReport[ i ].day3 < 0 ) {
                workSheet.Cell( i + 2, 4 ).Style( jitterTableGreenCellStyle );
            }

            workSheet.Cell( i + 2, 4 ).Number( request.session.jitterReport[ i ].day3 );
        }

        workSheet.Cell( i + 2, 5 ).Style( jitterTableWhiteCellStyle );
        if( request.session.jitterReport[ i ].day4 == null ) {
            workSheet.Cell( i + 2, 5 ).String( '-' );
        }
        else {

            if( request.session.jitterReport[ i ].day4 > 0 ) {
                if( request.session.jitterReport[ i ].day4 < 0.5 ) {
                    workSheet.Cell( i + 2, 5 ).Style( jitterTableGreenCellStyle );
                }
                else {
                    workSheet.Cell( i + 2, 5 ).Style( jitterTableRedCellStyle );
                }
            }
            else if( request.session.jitterReport[ i ].day4 < 0 ) {
                workSheet.Cell( i + 2, 5 ).Style( jitterTableGreenCellStyle );
            }

            workSheet.Cell( i + 2, 5 ).Number( request.session.jitterReport[ i ].day4 );
        }

        workSheet.Cell( i + 2, 6 ).Style( jitterTableWhiteCellStyle );
        if( request.session.jitterReport[ i ].day5 == null ) {
            workSheet.Cell( i + 2, 5 ).String( '-' );
        }
        else {

            if( request.session.jitterReport[ i ].day5 > 0 ) {
                if( request.session.jitterReport[ i ].day5 < 0.5 ) {
                    workSheet.Cell( i + 2, 6 ).Style( jitterTableGreenCellStyle );
                }
                else {
                    workSheet.Cell( i + 2, 6 ).Style( jitterTableRedCellStyle );
                }
            }
            else if( request.session.jitterReport[ i ].day5 < 0 ) {
                workSheet.Cell( i + 2, 6 ).Style( jitterTableGreenCellStyle );
            }

            workSheet.Cell( i + 2, 6 ).Number( request.session.jitterReport[ i ].day5 );
        }

        workSheet.Cell( i + 2, 7 ).Style( jitterTableWhiteCellStyle );
        if( request.session.jitterReport[ i ].day6 == null ) {
            workSheet.Cell( i + 2, 7 ).String( '-' );
        }
        else {

            if( request.session.jitterReport[ i ].day6 > 0 ) {
                if( request.session.jitterReport[ i ].day6 < 0.5 ) {
                    workSheet.Cell( i + 2, 7 ).Style( jitterTableGreenCellStyle );
                }
                else {
                    workSheet.Cell( i + 2, 7 ).Style( jitterTableRedCellStyle );
                }
            }
            else if( request.session.jitterReport[ i ].day6 < 0 ) {
                workSheet.Cell( i + 2, 7 ).Style( jitterTableGreenCellStyle );
            }

            workSheet.Cell( i + 2, 7 ).Number( request.session.jitterReport[ i ].day6 );
        }

        workSheet.Cell( i + 2, 8 ).Style( jitterTableWhiteCellStyle );
        if( request.session.jitterReport[ i ].day7 == null ) {
            workSheet.Cell( i + 2, 8 ).String( '-' );
        }
        else {

            if( request.session.jitterReport[ i ].day7 > 0 ) {
                if( request.session.jitterReport[ i ].day7 < 0.5 ) {
                    workSheet.Cell( i + 2, 8 ).Style( jitterTableGreenCellStyle );
                }
                else {
                    workSheet.Cell( i + 2, 8 ).Style( jitterTableRedCellStyle );
                }
            }
            else if( request.session.jitterReport[ i ].day7 < 0 ) {
                workSheet.Cell( i + 2, 8 ).Style( jitterTableGreenCellStyle );
            }

            workSheet.Cell( i + 2, 8 ).Number( request.session.jitterReport[ i ].day7 );
        }

    }

    // Show the result
    workBook.write( excelFilesReportNames.jitterReportExcelFileName, response );

    return;
}

// Generate Excel output for top ten worst sources jitter report
exports.generateExcelOutputTopTenWorstSourcesJitterReport = function( request, response, nextAction ) {

    var workBook  = new excelExport.WorkBook();
    var workSheet = workBook.WorkSheet( excelReportNames.topTenWorstSourcesReportName );

    var topTenWorstSourcesJitterTableBorderStyle = {
        top:{
            style:  tableBorderStyle.thin
        },
        bottom:{
            style:  tableBorderStyle.thin
        },
        left:{
            style:  tableBorderStyle.thin
        },
        right:{
            style:  tableBorderStyle.thin
        }
    };

    // Setup top ten worst sources jitter table header
    var topTenWorstSourcesJitterTableHeaderStyle = workBook.Style();
    topTenWorstSourcesJitterTableHeaderStyle.Font.Bold();
    topTenWorstSourcesJitterTableHeaderStyle.Font.Size(12 );
    topTenWorstSourcesJitterTableHeaderStyle.Font.Alignment.Horizontal( alignment.center );
    topTenWorstSourcesJitterTableHeaderStyle.Font.WrapText( false );
    topTenWorstSourcesJitterTableHeaderStyle.Border( topTenWorstSourcesJitterTableBorderStyle );

    // Setup top ten worst sources jitter table body
    var topTenWorstSourcesJitterTableBodyStyle = workBook.Style();
    topTenWorstSourcesJitterTableBodyStyle.Font.Alignment.Horizontal( alignment.center );
    topTenWorstSourcesJitterTableBodyStyle.Font.WrapText( false );
    topTenWorstSourcesJitterTableBodyStyle.Border( topTenWorstSourcesJitterTableBorderStyle );

    // Fill up top ten worst sources jitter table header
    workSheet.Cell( 1, 1 ).Style( topTenWorstSourcesJitterTableHeaderStyle );
    workSheet.Cell( 1, 2 ).Style( topTenWorstSourcesJitterTableHeaderStyle );
    workSheet.Cell( 1, 3 ).Style( topTenWorstSourcesJitterTableHeaderStyle );
    workSheet.Cell( 1, 4 ).Style( topTenWorstSourcesJitterTableHeaderStyle );
    workSheet.Cell( 1, 5 ).Style( topTenWorstSourcesJitterTableHeaderStyle );
    workSheet.Cell( 1, 6 ).Style( topTenWorstSourcesJitterTableHeaderStyle );
    workSheet.Cell( 1, 7 ).Style( topTenWorstSourcesJitterTableHeaderStyle );
    workSheet.Cell( 1, 8 ).Style( topTenWorstSourcesJitterTableHeaderStyle );

    workSheet.Column( 1 ).Width( 30 );
    workSheet.Column( 2 ).Width( 15 );
    workSheet.Column( 3 ).Width( 15 );
    workSheet.Column( 4 ).Width( 15 );
    workSheet.Column( 5 ).Width( 15 );
    workSheet.Column( 6 ).Width( 15 );
    workSheet.Column( 7 ).Width( 15 );
    workSheet.Column( 8 ).Width( 15 );

    workSheet.Cell( 1, 1 ).String( "Source" );
    workSheet.Cell( 1, 2 ).String( request.session.lastSevenDates[ 0 ].day1 );
    workSheet.Cell( 1, 3 ).String( request.session.lastSevenDates[ 0 ].day2 );
    workSheet.Cell( 1, 4 ).String( request.session.lastSevenDates[ 0 ].day3 );
    workSheet.Cell( 1, 5 ).String( request.session.lastSevenDates[ 0 ].day4 );
    workSheet.Cell( 1, 6 ).String( request.session.lastSevenDates[ 0 ].day5 );
    workSheet.Cell( 1, 7 ).String( request.session.lastSevenDates[ 0 ].day6 );
    workSheet.Cell( 1, 8 ).String( request.session.lastSevenDates[ 0 ].day7 );

    var topTenWorstSourcesJitterTableWhiteCellStyle = workBook.Style();
    topTenWorstSourcesJitterTableWhiteCellStyle.Font.Alignment.Horizontal( alignment.center );
    topTenWorstSourcesJitterTableWhiteCellStyle.Font.WrapText( false );
    topTenWorstSourcesJitterTableWhiteCellStyle.Fill.Pattern( fillPattern.solid );
    topTenWorstSourcesJitterTableWhiteCellStyle.Fill.Color( color.white );
    topTenWorstSourcesJitterTableWhiteCellStyle.Border( topTenWorstSourcesJitterTableBorderStyle );

    var topTenWorstSourcesJitterTableGreenCellStyle = workBook.Style();
    topTenWorstSourcesJitterTableGreenCellStyle.Font.Alignment.Horizontal( alignment.center );
    topTenWorstSourcesJitterTableGreenCellStyle.Font.WrapText( false );
    topTenWorstSourcesJitterTableGreenCellStyle.Fill.Pattern( fillPattern.solid );
    topTenWorstSourcesJitterTableGreenCellStyle.Fill.Color( color.green );
    topTenWorstSourcesJitterTableGreenCellStyle.Border( topTenWorstSourcesJitterTableBorderStyle );

    var topTenWorstSourcesJitterTableRedCellStyle = workBook.Style();
    topTenWorstSourcesJitterTableRedCellStyle.Font.Alignment.Horizontal( alignment.center );
    topTenWorstSourcesJitterTableRedCellStyle.Font.WrapText( false );
    topTenWorstSourcesJitterTableRedCellStyle.Fill.Pattern( fillPattern.solid );
    topTenWorstSourcesJitterTableRedCellStyle.Fill.Color( color.red );
    topTenWorstSourcesJitterTableRedCellStyle.Border( topTenWorstSourcesJitterTableBorderStyle );

    // Fill up jitter table body
    for( var i = 0; i < request.session.topTenWorstSourcesJitterReport.length; i++ ) {

        workSheet.Cell( i + 2, 1 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        workSheet.Cell( i + 2, 1 ).String( request.session.topTenWorstSourcesJitterReport[ i ].source_ip );

        workSheet.Cell( i + 2, 2 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        if( request.session.topTenWorstSourcesJitterReport[ i ].day1 == null )
            workSheet.Cell( i + 2, 2 ).String( '-' );
        else {

            if( request.session.topTenWorstSourcesJitterReport[ i ].day1 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day1 < 0.5 )
                workSheet.Cell( i + 2, 2 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
            else if( request.session.topTenWorstSourcesJitterReport[ i ].day1 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day1 >= 0.5 )
                workSheet.Cell( i + 2, 2 ).Style( topTenWorstSourcesJitterTableRedCellStyle );
            else if( request.session.topTenWorstSourcesJitterReport[ i ].day1 < 0 )
                workSheet.Cell( i + 2, 2 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );

            workSheet.Cell( i + 2, 2 ).Number( request.session.topTenWorstSourcesJitterReport[ i ].day1 );

        }

        workSheet.Cell( i + 2, 3 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        if( request.session.topTenWorstSourcesJitterReport[ i ].day2 == null )
            workSheet.Cell( i + 2, 3 ).String( '-' );
        else {

            if( request.session.topTenWorstSourcesJitterReport[ i ].day2 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day2 < 0.5 )
                workSheet.Cell( i + 2, 3 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
            else if( request.session.topTenWorstSourcesJitterReport[ i ].day2 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day2 >= 0.5 )
                workSheet.Cell( i + 2, 3 ).Style( topTenWorstSourcesJitterTableRedCellStyle );
            else if( request.session.topTenWorstSourcesJitterReport[ i ].day2 < 0 )
                workSheet.Cell( i + 2, 3 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );

            workSheet.Cell( i + 2, 3 ).Number( request.session.topTenWorstSourcesJitterReport[ i ].day2 );

        }

        workSheet.Cell( i + 2, 4 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        if( request.session.topTenWorstSourcesJitterReport[ i ].day3 == null )
            workSheet.Cell( i + 2, 4 ).String( '-' );
        else {

	        if( request.session.topTenWorstSourcesJitterReport[ i ].day3 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day3 < 0.5 )
	            workSheet.Cell( i + 2, 4 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day3 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day3 >= 0.5 )
	            workSheet.Cell( i + 2, 4 ).Style( topTenWorstSourcesJitterTableRedCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day3 < 0 )
	            workSheet.Cell( i + 2, 4 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	
	        workSheet.Cell( i + 2, 4 ).Number( request.session.topTenWorstSourcesJitterReport[ i ].day3 );

        }

        workSheet.Cell( i + 2, 5 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        if( request.session.topTenWorstSourcesJitterReport[ i ].day4 == null )
            workSheet.Cell( i + 2, 5 ).String( '-' );
        else {

	        if( request.session.topTenWorstSourcesJitterReport[ i ].day4 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day4 < 0.5 )
	            workSheet.Cell( i + 2, 5 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day4 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day4 >= 0.5 )
	            workSheet.Cell( i + 2, 5 ).Style( topTenWorstSourcesJitterTableRedCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day4 < 0 )
	            workSheet.Cell( i + 2, 5 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	
	        workSheet.Cell( i + 2, 5 ).Number( request.session.topTenWorstSourcesJitterReport[ i ].day4 );

        }

        workSheet.Cell( i + 2, 6 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        if( request.session.topTenWorstSourcesJitterReport[ i ].day5 == null )
            workSheet.Cell( i + 2, 6 ).String( '-' );
        else {

	        if( request.session.topTenWorstSourcesJitterReport[ i ].day5 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day5 < 0.5 )
	            workSheet.Cell( i + 2, 6 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day5 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day5 >= 0.5 )
	            workSheet.Cell( i + 2, 6 ).Style( topTenWorstSourcesJitterTableRedCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day5 < 0 )
	            workSheet.Cell( i + 2, 6 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	
	        workSheet.Cell( i + 2, 6 ).Number( request.session.topTenWorstSourcesJitterReport[ i ].day5 );

        }

        workSheet.Cell( i + 2, 7 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        if( request.session.topTenWorstSourcesJitterReport[ i ].day6 == null )
            workSheet.Cell( i + 2, 7 ).String( '-' );
        else {

	        if( request.session.topTenWorstSourcesJitterReport[ i ].day6 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day6 < 0.5 )
	            workSheet.Cell( i + 2, 7 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day6 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day6 >= 0.5 )
	            workSheet.Cell( i + 2, 7 ).Style( topTenWorstSourcesJitterTableRedCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day6 < 0 )
	            workSheet.Cell( i + 2, 7 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	
	        workSheet.Cell( i + 2, 7 ).Number( request.session.topTenWorstSourcesJitterReport[ i ].day6 );

        }

        workSheet.Cell( i + 2, 8 ).Style( topTenWorstSourcesJitterTableWhiteCellStyle );
        if( request.session.topTenWorstSourcesJitterReport[ i ].day7 == null )
            workSheet.Cell( i + 2, 8 ).String( '-' );
        else {

	        if( request.session.topTenWorstSourcesJitterReport[ i ].day7 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day7 < 0.5 )
	            workSheet.Cell( i + 2, 8 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day7 > 0  && request.session.topTenWorstSourcesJitterReport[ i ].day7 >= 0.5 )
	            workSheet.Cell( i + 2, 8 ).Style( topTenWorstSourcesJitterTableRedCellStyle );
	        else if( request.session.topTenWorstSourcesJitterReport[ i ].day7 < 0 )
	            workSheet.Cell( i + 2, 8 ).Style( topTenWorstSourcesJitterTableGreenCellStyle );
	
	        workSheet.Cell( i + 2, 8 ).Number( request.session.topTenWorstSourcesJitterReport[ i ].day7 );

        }

    }

    // Show the result
    workBook.write( excelFilesReportNames.topTenWorstSourcesReportExcelFileName, response );

    return;
}

// Generate Excel output for disconnected agents report
exports.generateExcelOutputDisconnectedAgentsReport = function( request, response, nextAction ) {

    var workBook  = new excelExport.WorkBook();
    var workSheet = workBook.WorkSheet( excelReportNames.disconnectedAgentsReportName );

    var disconnectedAgentsTableBorderStyle = {
        top:{
            style:  tableBorderStyle.thin
        },
        bottom:{
            style:  tableBorderStyle.thin
        },
        left:{
            style:  tableBorderStyle.thin
        },
        right:{
            style:  tableBorderStyle.thin
        }
    };

    // Setup disconnected agents table header
    var disconnectedAgentsTableHeaderStyle = workBook.Style();
    disconnectedAgentsTableHeaderStyle.Font.Bold();
    disconnectedAgentsTableHeaderStyle.Font.Size(12 );
    disconnectedAgentsTableHeaderStyle.Font.Alignment.Horizontal( alignment.center );
    disconnectedAgentsTableHeaderStyle.Font.WrapText( false );
    disconnectedAgentsTableHeaderStyle.Border( disconnectedAgentsTableBorderStyle );

    // Setup disconnected agents table body
    var disconnectedAgentsTableBodyStyle = workBook.Style();
    disconnectedAgentsTableBodyStyle.Font.Alignment.Horizontal( alignment.center );
    disconnectedAgentsTableBodyStyle.Font.WrapText( false );
    disconnectedAgentsTableBodyStyle.Border( disconnectedAgentsTableBorderStyle );

    // Fill up disconnected agents table header
    workSheet.Cell( 1, 1 ).Style( disconnectedAgentsTableHeaderStyle );
    workSheet.Cell( 1, 2 ).Style( disconnectedAgentsTableHeaderStyle );

    workSheet.Column( 1 ).Width( 40 );
    workSheet.Column( 2 ).Width( 20 );

    workSheet.Cell( 1, 1 ).String( "Agent ID" );
    workSheet.Cell( 1, 2 ).String( "Agent IP" );

    var disconnectedAgentsTableWhiteCellStyle = workBook.Style();
    disconnectedAgentsTableWhiteCellStyle.Font.Alignment.Horizontal( alignment.center );
    disconnectedAgentsTableWhiteCellStyle.Font.WrapText( false );
    disconnectedAgentsTableWhiteCellStyle.Fill.Pattern( fillPattern.solid );
    disconnectedAgentsTableWhiteCellStyle.Fill.Color( color.white );
    disconnectedAgentsTableWhiteCellStyle.Border( disconnectedAgentsTableBorderStyle );

    // Fill up disconnected agents table body
    for( var i = 0; i < request.session.disconnectedAgentsReport.length; i++ ) {

        workSheet.Cell( i + 2, 1 ).Style( disconnectedAgentsTableWhiteCellStyle );
        workSheet.Cell( i + 2, 1 ).String( request.session.disconnectedAgentsReport[ i ].agent_id );

        workSheet.Cell( i + 2, 2 ).Style( disconnectedAgentsTableWhiteCellStyle );
        workSheet.Cell( i + 2, 2 ).String( request.session.disconnectedAgentsReport[ i ].agent_ip );

    }

    // Show the result
    workBook.write( excelFilesReportNames.disconnectedAgentsReportExcelFileName, response );

    return;
}

// Generate Excel output for distance and speed report
exports.generateExcelOutputDistanceAndSpeedReport = function( request, response, nextAction ) {

    var workBook  = new excelExport.WorkBook();
    var workSheet = workBook.WorkSheet( excelReportNames.distanceAndSpeedReportName );

    var distanceAndSpeedTableBorderStyle = {
        top:{
            style:  tableBorderStyle.thin
        },
        bottom:{
            style:  tableBorderStyle.thin
        },
        left:{
            style:  tableBorderStyle.thin
        },
        right:{
            style:  tableBorderStyle.thin
        }
    };

    // Setup distance and speed table header
    var distanceAndSpeedTableHeaderStyle = workBook.Style();
    distanceAndSpeedTableHeaderStyle.Font.Bold();
    distanceAndSpeedTableHeaderStyle.Font.Size(12 );
    distanceAndSpeedTableHeaderStyle.Font.Alignment.Horizontal( alignment.center );
    distanceAndSpeedTableHeaderStyle.Font.WrapText( false );
    distanceAndSpeedTableHeaderStyle.Border( distanceAndSpeedTableBorderStyle );

    // Setup distance and speed table body
    var distanceAndSpeedTableBodyStyle = workBook.Style();
    distanceAndSpeedTableBodyStyle.Font.Alignment.Horizontal( alignment.center );
    distanceAndSpeedTableBodyStyle.Font.WrapText( false );
    distanceAndSpeedTableBodyStyle.Border( distanceAndSpeedTableBorderStyle );

    // Fill up distance and speed table header
    workSheet.Cell( 1, 1 ).Style( distanceAndSpeedTableHeaderStyle );
    workSheet.Cell( 1, 2 ).Style( distanceAndSpeedTableHeaderStyle );
    workSheet.Cell( 1, 3 ).Style( distanceAndSpeedTableHeaderStyle );
    workSheet.Cell( 1, 4 ).Style( distanceAndSpeedTableHeaderStyle );
    workSheet.Cell( 1, 5 ).Style( distanceAndSpeedTableHeaderStyle );
    workSheet.Cell( 1, 6 ).Style( distanceAndSpeedTableHeaderStyle );
    workSheet.Cell( 1, 7 ).Style( distanceAndSpeedTableHeaderStyle );

    workSheet.Column( 1 ).Width( 30 );
    workSheet.Column( 2 ).Width( 20 );
    workSheet.Column( 3 ).Width( 20 );
    workSheet.Column( 4 ).Width( 15 );
    workSheet.Column( 5 ).Width( 15 );
    workSheet.Column( 6 ).Width( 15 );
    workSheet.Column( 7 ).Width( 15 );

    workSheet.Cell( 1, 1 ).String( "Route" );
    workSheet.Cell( 1, 2 ).String( "Source" );
    workSheet.Cell( 1, 3 ).String( "Target" );
    workSheet.Cell( 1, 4 ).String( "Average Latency" );
    workSheet.Cell( 1, 5 ).String( "Std Dev Latency" );
    workSheet.Cell( 1, 6 ).String( "Distance (km)" );
    workSheet.Cell( 1, 7 ).String( "Speed (km/ms)" );

    var distanceAndSpeedTableWhiteCellStyle = workBook.Style();
    distanceAndSpeedTableWhiteCellStyle.Font.Alignment.Horizontal( alignment.center );
    distanceAndSpeedTableWhiteCellStyle.Font.WrapText( false );
    distanceAndSpeedTableWhiteCellStyle.Fill.Pattern( fillPattern.solid );
    distanceAndSpeedTableWhiteCellStyle.Fill.Color( color.white );
    distanceAndSpeedTableWhiteCellStyle.Border( distanceAndSpeedTableBorderStyle );

    // Fill up distance and speed table body
    for( var i = 0; i < request.session.distanceAndSpeedReport.length; i++ ) {

        workSheet.Cell( i + 2, 1 ).Style( distanceAndSpeedTableWhiteCellStyle );
        workSheet.Cell( i + 2, 1 ).String( request.session.distanceAndSpeedReport[ i ].route );

        workSheet.Cell( i + 2, 2 ).Style( distanceAndSpeedTableWhiteCellStyle );
        workSheet.Cell( i + 2, 2 ).String( request.session.distanceAndSpeedReport[ i ].source );

        workSheet.Cell( i + 2, 3 ).Style( distanceAndSpeedTableWhiteCellStyle );
        workSheet.Cell( i + 2, 3 ).String( request.session.distanceAndSpeedReport[ i ].target );

        workSheet.Cell( i + 2, 4 ).Style( distanceAndSpeedTableWhiteCellStyle );
        workSheet.Cell( i + 2, 4 ).Number( request.session.distanceAndSpeedReport[ i ].average_latency );

        workSheet.Cell( i + 2, 5 ).Style( distanceAndSpeedTableWhiteCellStyle );
        workSheet.Cell( i + 2, 5 ).Number( request.session.distanceAndSpeedReport[ i ].std_dev_latency );

        workSheet.Cell( i + 2, 6 ).Style( distanceAndSpeedTableWhiteCellStyle );
        workSheet.Cell( i + 2, 6 ).Number( request.session.distanceAndSpeedReport[ i ].distance_km );

        workSheet.Cell( i + 2, 7 ).Style( distanceAndSpeedTableWhiteCellStyle );
        workSheet.Cell( i + 2, 7 ).Number( request.session.distanceAndSpeedReport[ i ].speed_km_per_millisec );

    }

    // Show the result
    workBook.write( excelFilesReportNames.distanceAndSpeedReportExcelFileName, response );

    return;
}

// Generate Excel output for historical latency report
exports.generateExcelOutputHistoricalLatencyReport = function( request, response, nextAction ) {

    var workBook  = new excelExport.WorkBook();
    var workSheet = workBook.WorkSheet( excelReportNames.historicalLatencyReportName );

    var historicalLatencyTableBorderStyle = {
        top:{
            style:  tableBorderStyle.thin
        },
        bottom:{
            style:  tableBorderStyle.thin
        },
        left:{
            style:  tableBorderStyle.thin
        },
        right:{
            style:  tableBorderStyle.thin
        }
    };

    // Setup historical latency table header
    var historicalLatencyTableHeaderStyle = workBook.Style();
    historicalLatencyTableHeaderStyle.Font.Bold();
    historicalLatencyTableHeaderStyle.Font.Size(12 );
    historicalLatencyTableHeaderStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLatencyTableHeaderStyle.Font.WrapText( false );
    historicalLatencyTableHeaderStyle.Border( historicalLatencyTableBorderStyle );

    // Setup historical latency table body
    var historicalLatencyTableBodyStyle = workBook.Style();
    historicalLatencyTableBodyStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLatencyTableBodyStyle.Font.WrapText( false );
    historicalLatencyTableBodyStyle.Border( historicalLatencyTableBorderStyle );

    // Fill up historical latency table header
    workSheet.Cell( 1, 1 ).Style( historicalLatencyTableHeaderStyle );
    workSheet.Cell( 1, 2 ).Style( historicalLatencyTableHeaderStyle );
    workSheet.Cell( 1, 3 ).Style( historicalLatencyTableHeaderStyle );
    workSheet.Cell( 1, 4 ).Style( historicalLatencyTableHeaderStyle );
    workSheet.Cell( 1, 5 ).Style( historicalLatencyTableHeaderStyle );
    workSheet.Cell( 1, 6 ).Style( historicalLatencyTableHeaderStyle );
    workSheet.Cell( 1, 7 ).Style( historicalLatencyTableHeaderStyle );
    workSheet.Cell( 1, 8 ).Style( historicalLatencyTableHeaderStyle );

    workSheet.Column( 1 ).Width( 30 );
    workSheet.Column( 2 ).Width( 15 );
    workSheet.Column( 3 ).Width( 15 );
    workSheet.Column( 4 ).Width( 15 );
    workSheet.Column( 5 ).Width( 15 );
    workSheet.Column( 6 ).Width( 15 );
    workSheet.Column( 7 ).Width( 15 );
    workSheet.Column( 8 ).Width( 15 );

    workSheet.Cell( 1, 1 ).String( "Route" );
    workSheet.Cell( 1, 2 ).String( request.session.lastSevenDates[ 0 ].day1 );
    workSheet.Cell( 1, 3 ).String( request.session.lastSevenDates[ 0 ].day2 );
    workSheet.Cell( 1, 4 ).String( request.session.lastSevenDates[ 0 ].day3 );
    workSheet.Cell( 1, 5 ).String( request.session.lastSevenDates[ 0 ].day4 );
    workSheet.Cell( 1, 6 ).String( request.session.lastSevenDates[ 0 ].day5 );
    workSheet.Cell( 1, 7 ).String( request.session.lastSevenDates[ 0 ].day6 );
    workSheet.Cell( 1, 8 ).String( request.session.lastSevenDates[ 0 ].day7 );

    var historicalLatencyTableWhiteCellStyle = workBook.Style();
    historicalLatencyTableWhiteCellStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLatencyTableWhiteCellStyle.Font.WrapText( false );
    historicalLatencyTableWhiteCellStyle.Fill.Pattern( fillPattern.solid );
    historicalLatencyTableWhiteCellStyle.Fill.Color( color.white );
    historicalLatencyTableWhiteCellStyle.Border( historicalLatencyTableBorderStyle );

    var historicalLatencyTableGreenCellStyle = workBook.Style();
    historicalLatencyTableGreenCellStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLatencyTableGreenCellStyle.Font.WrapText( false );
    historicalLatencyTableGreenCellStyle.Fill.Pattern( fillPattern.solid );
    historicalLatencyTableGreenCellStyle.Fill.Color( color.green );
    historicalLatencyTableGreenCellStyle.Border( historicalLatencyTableBorderStyle );

    var historicalLatencyTableRedCellStyle = workBook.Style();
    historicalLatencyTableRedCellStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLatencyTableRedCellStyle.Font.WrapText( false );
    historicalLatencyTableRedCellStyle.Fill.Pattern( fillPattern.solid );
    historicalLatencyTableRedCellStyle.Fill.Color( color.red );
    historicalLatencyTableRedCellStyle.Border( historicalLatencyTableBorderStyle );

    // Fill up historical latency table body
    for( var i = 0; i < request.session.latencyReport.length; i++ ) {

        workSheet.Cell( i + 2, 1 ).Style( historicalLatencyTableWhiteCellStyle );
        workSheet.Cell( i + 2, 1 ).String( request.session.latencyReport[ i ].route );

        workSheet.Cell( i + 2, 2 ).Style( historicalLatencyTableWhiteCellStyle );
        if( request.session.latencyReport[ i ].day1 == null ) {
            workSheet.Cell( i + 2, 2 ).String( '-' );
        }
        else {

            if( request.session.latencyReport[ i ].day1 < 0 )
                workSheet.Cell( i + 2, 2 ).Style( historicalLatencyTableRedCellStyle );
            else if( request.session.latencyReport[ i ].day1 > 0 )
                workSheet.Cell( i + 2, 2 ).Style( historicalLatencyTableGreenCellStyle );

            workSheet.Cell( i + 2, 2 ).Number( request.session.latencyReport[ i ].day1 );

        }

        workSheet.Cell( i + 2, 3 ).Style( historicalLatencyTableWhiteCellStyle );
        if( request.session.latencyReport[ i ].day2 == null ) {
            workSheet.Cell( i + 2, 3 ).String( '-' );
        }
        else {

            if( request.session.latencyReport[ i ].day2 < 0 )
                workSheet.Cell( i + 2, 3 ).Style( historicalLatencyTableRedCellStyle );
            else if( request.session.latencyReport[ i ].day2 > 0 )
                workSheet.Cell( i + 2, 3 ).Style( historicalLatencyTableGreenCellStyle );

            workSheet.Cell( i + 2, 3 ).Number( request.session.latencyReport[ i ].day2 );

        }

        workSheet.Cell( i + 2, 4 ).Style( historicalLatencyTableWhiteCellStyle );
        if( request.session.latencyReport[ i ].day3 == null ) {
            workSheet.Cell( i + 2, 4 ).String( '-' );
        }
        else {

            if( request.session.latencyReport[ i ].day3 < 0 )
                workSheet.Cell( i + 2, 4 ).Style( historicalLatencyTableRedCellStyle );
            else if( request.session.latencyReport[ i ].day3 > 0 )
                workSheet.Cell( i + 2, 4 ).Style( historicalLatencyTableGreenCellStyle );

            workSheet.Cell( i + 2, 4 ).Number( request.session.latencyReport[ i ].day3 );

        }

        workSheet.Cell( i + 2, 5 ).Style( historicalLatencyTableWhiteCellStyle );
        if( request.session.latencyReport[ i ].day4 == null ) {
            workSheet.Cell( i + 2, 5 ).String( '-' );
        }
        else {

            if( request.session.latencyReport[ i ].day4 < 0 )
                workSheet.Cell( i + 2, 5 ).Style( historicalLatencyTableRedCellStyle );
            else if( request.session.latencyReport[ i ].day4 > 0 )
                workSheet.Cell( i + 2, 5 ).Style( historicalLatencyTableGreenCellStyle );

            workSheet.Cell( i + 2, 5 ).Number( request.session.latencyReport[ i ].day4 );

        }

        workSheet.Cell( i + 2, 6 ).Style( historicalLatencyTableWhiteCellStyle );
        if( request.session.latencyReport[ i ].day5 == null ) {
            workSheet.Cell( i + 2, 6 ).String( '-' );
        }
        else {

            if( request.session.latencyReport[ i ].day5 < 0 )
                workSheet.Cell( i + 2, 6 ).Style( historicalLatencyTableRedCellStyle );
            else if( request.session.latencyReport[ i ].day5 > 0 )
                workSheet.Cell( i + 2, 6 ).Style( historicalLatencyTableGreenCellStyle );

            workSheet.Cell( i + 2, 6 ).Number( request.session.latencyReport[ i ].day5 );

        }

        workSheet.Cell( i + 2, 7 ).Style( historicalLatencyTableWhiteCellStyle );
        if( request.session.latencyReport[ i ].day6 == null ) {
            workSheet.Cell( i + 2, 7 ).String( '-' );
        }
        else {

            if( request.session.latencyReport[ i ].day6 < 0 )
                workSheet.Cell( i + 2, 7 ).Style( historicalLatencyTableRedCellStyle );
            else if( request.session.latencyReport[ i ].day6 > 0 )
                workSheet.Cell( i + 2, 7 ).Style( historicalLatencyTableGreenCellStyle );

            workSheet.Cell( i + 2, 7 ).Number( request.session.latencyReport[ i ].day6 );

        }

        workSheet.Cell( i + 2, 8 ).Style( historicalLatencyTableWhiteCellStyle );
        if( request.session.latencyReport[ i ].day7 == null ) {
            workSheet.Cell( i + 2, 8 ).String( '-' );
        }
        else {

            if( request.session.latencyReport[ i ].day7 < 0 )
                workSheet.Cell( i + 2, 8 ).Style( historicalLatencyTableRedCellStyle );
            else if( request.session.latencyReport[ i ].day7 > 0 )
                workSheet.Cell( i + 2, 8 ).Style( historicalLatencyTableGreenCellStyle );

            workSheet.Cell( i + 2, 8 ).Number( request.session.latencyReport[ i ].day7 );

        }

    }

    // Show the result
    workBook.write( excelFilesReportNames.historicalLatencyReportExcelFileName, response );

    return;
}

// Generate Excel output for historical loss report
exports.generateExcelOutputHistoricalLossReport = function( request, response, nextAction ) {

    var workBook  = new excelExport.WorkBook();
    var workSheet = workBook.WorkSheet( excelReportNames.historicalLossReportName );

    var historicalLossTableBorderStyle = {
        top:{
            style:  tableBorderStyle.thin
        },
        bottom:{
            style:  tableBorderStyle.thin
        },
        left:{
            style:  tableBorderStyle.thin
        },
        right:{
            style:  tableBorderStyle.thin
        }
    };

    // Setup historical loss table header
    var historicalLossTableHeaderStyle = workBook.Style();
    historicalLossTableHeaderStyle.Font.Bold();
    historicalLossTableHeaderStyle.Font.Size(12 );
    historicalLossTableHeaderStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLossTableHeaderStyle.Font.WrapText( false );
    historicalLossTableHeaderStyle.Border( historicalLossTableBorderStyle );

    // Setup historical loss table body
    var historicalLossTableBodyStyle = workBook.Style();
    historicalLossTableBodyStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLossTableBodyStyle.Font.WrapText( false );
    historicalLossTableBodyStyle.Border( historicalLossTableBorderStyle );

    // Fill up historical loss table header
    workSheet.Cell( 1, 1 ).Style( historicalLossTableHeaderStyle );
    workSheet.Cell( 1, 2 ).Style( historicalLossTableHeaderStyle );
    workSheet.Cell( 1, 3 ).Style( historicalLossTableHeaderStyle );
    workSheet.Cell( 1, 4 ).Style( historicalLossTableHeaderStyle );
    workSheet.Cell( 1, 5 ).Style( historicalLossTableHeaderStyle );
    workSheet.Cell( 1, 6 ).Style( historicalLossTableHeaderStyle );
    workSheet.Cell( 1, 7 ).Style( historicalLossTableHeaderStyle );
    workSheet.Cell( 1, 8 ).Style( historicalLossTableHeaderStyle );

    workSheet.Column( 1 ).Width( 30 );
    workSheet.Column( 2 ).Width( 15 );
    workSheet.Column( 3 ).Width( 15 );
    workSheet.Column( 4 ).Width( 15 );
    workSheet.Column( 5 ).Width( 15 );
    workSheet.Column( 6 ).Width( 15 );
    workSheet.Column( 7 ).Width( 15 );
    workSheet.Column( 8 ).Width( 15 );

    workSheet.Cell( 1, 1 ).String( "Route" );
    workSheet.Cell( 1, 2 ).String( request.session.lastSevenDates[ 0 ].day1 );
    workSheet.Cell( 1, 3 ).String( request.session.lastSevenDates[ 0 ].day2 );
    workSheet.Cell( 1, 4 ).String( request.session.lastSevenDates[ 0 ].day3 );
    workSheet.Cell( 1, 5 ).String( request.session.lastSevenDates[ 0 ].day4 );
    workSheet.Cell( 1, 6 ).String( request.session.lastSevenDates[ 0 ].day5 );
    workSheet.Cell( 1, 7 ).String( request.session.lastSevenDates[ 0 ].day6 );
    workSheet.Cell( 1, 8 ).String( request.session.lastSevenDates[ 0 ].day7 );

    var historicalLossTableWhiteCellStyle = workBook.Style();
    historicalLossTableWhiteCellStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLossTableWhiteCellStyle.Font.WrapText( false );
    historicalLossTableWhiteCellStyle.Fill.Pattern( fillPattern.solid );
    historicalLossTableWhiteCellStyle.Fill.Color( color.white );
    historicalLossTableWhiteCellStyle.Border( historicalLossTableBorderStyle );

    var historicalLossTableGreenCellStyle = workBook.Style();
    historicalLossTableGreenCellStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLossTableGreenCellStyle.Font.WrapText( false );
    historicalLossTableGreenCellStyle.Fill.Pattern( fillPattern.solid );
    historicalLossTableGreenCellStyle.Fill.Color( color.green );
    historicalLossTableGreenCellStyle.Border( historicalLossTableBorderStyle );

    var historicalLossTableRedCellStyle = workBook.Style();
    historicalLossTableRedCellStyle.Font.Alignment.Horizontal( alignment.center );
    historicalLossTableRedCellStyle.Font.WrapText( false );
    historicalLossTableRedCellStyle.Fill.Pattern( fillPattern.solid );
    historicalLossTableRedCellStyle.Fill.Color( color.red );
    historicalLossTableRedCellStyle.Border( historicalLossTableBorderStyle );

    // Fill up historical loss table body
    for( var i = 0; i < request.session.lossReport.length; i++ ) {

        workSheet.Cell( i + 2, 1 ).Style( historicalLossTableWhiteCellStyle );
        workSheet.Cell( i + 2, 1 ).String( request.session.lossReport[ i ].route );

        workSheet.Cell( i + 2, 2 ).Style( historicalLossTableWhiteCellStyle );
        if( request.session.lossReport[ i ].day1 == null ) {
            workSheet.Cell( i + 2, 2 ).String( '-' );
        }
        else {

            if( request.session.lossReport[ i ].day1 < 0 )
                workSheet.Cell( i + 2, 2 ).Style( historicalLossTableRedCellStyle );
            else if( request.session.lossReport[ i ].day1 > 0 )
                workSheet.Cell( i + 2, 2 ).Style( historicalLossTableGreenCellStyle );

            workSheet.Cell( i + 2, 2 ).Number( request.session.lossReport[ i ].day1 );

        }

        workSheet.Cell( i + 2, 3 ).Style( historicalLossTableWhiteCellStyle );
        if( request.session.lossReport[ i ].day2 == null ) {
            workSheet.Cell( i + 2, 3 ).String( '-' );
        }
        else {

            if( request.session.lossReport[ i ].day2 < 0 )
                workSheet.Cell( i + 2, 3 ).Style( historicalLossTableRedCellStyle );
            else if( request.session.lossReport[ i ].day2 > 0 )
                workSheet.Cell( i + 2, 3 ).Style( historicalLossTableGreenCellStyle );

            workSheet.Cell( i + 2, 3 ).Number( request.session.lossReport[ i ].day2 );

        }

        workSheet.Cell( i + 2, 4 ).Style( historicalLossTableWhiteCellStyle );
        if( request.session.lossReport[ i ].day3 == null ) {
            workSheet.Cell( i + 2, 4 ).String( '-' );
        }
        else {

            if( request.session.lossReport[ i ].day3 < 0 )
                workSheet.Cell( i + 2, 4 ).Style( historicalLossTableRedCellStyle );
            else if( request.session.lossReport[ i ].day3 > 0 )
                workSheet.Cell( i + 2, 4 ).Style( historicalLossTableGreenCellStyle );

            workSheet.Cell( i + 2, 4 ).Number( request.session.lossReport[ i ].day3 );

        }

        workSheet.Cell( i + 2, 5 ).Style( historicalLossTableWhiteCellStyle );
        if( request.session.lossReport[ i ].day4 == null ) {
            workSheet.Cell( i + 2, 5 ).String( '-' );
        }
        else {

            if( request.session.lossReport[ i ].day4 < 0 )
                workSheet.Cell( i + 2, 5 ).Style( historicalLossTableRedCellStyle );
            else if( request.session.lossReport[ i ].day4 > 0 )
                workSheet.Cell( i + 2, 5 ).Style( historicalLossTableGreenCellStyle );

            workSheet.Cell( i + 2, 5 ).Number( request.session.lossReport[ i ].day4 );

        }

        workSheet.Cell( i + 2, 6 ).Style( historicalLossTableWhiteCellStyle );
        if( request.session.lossReport[ i ].day5 == null ) {
            workSheet.Cell( i + 2, 6 ).String( '-' );
        }
        else {

            if( request.session.lossReport[ i ].day5 < 0 )
                workSheet.Cell( i + 2, 6 ).Style( historicalLossTableRedCellStyle );
            else if( request.session.lossReport[ i ].day5 > 0 )
                workSheet.Cell( i + 2, 6 ).Style( historicalLossTableGreenCellStyle );

            workSheet.Cell( i + 2, 6 ).Number( request.session.lossReport[ i ].day5 );

        }

        workSheet.Cell( i + 2, 7 ).Style( historicalLossTableWhiteCellStyle );
        if( request.session.lossReport[ i ].day6 == null ) {
            workSheet.Cell( i + 2, 7 ).String( '-' );
        }
        else {

            if( request.session.lossReport[ i ].day6 < 0 )
                workSheet.Cell( i + 2, 7 ).Style( historicalLossTableRedCellStyle );
            else if( request.session.lossReport[ i ].day6 > 0 )
                workSheet.Cell( i + 2, 7 ).Style( historicalLossTableGreenCellStyle );

            workSheet.Cell( i + 2, 7 ).Number( request.session.lossReport[ i ].day6 );

        }

        workSheet.Cell( i + 2, 8 ).Style( historicalLossTableWhiteCellStyle );
        if( request.session.lossReport[ i ].day7 == null ) {
            workSheet.Cell( i + 2, 8 ).String( '-' );
        }
        else {

            if( request.session.lossReport[ i ].day7 < 0 )
                workSheet.Cell( i + 2, 8 ).Style( historicalLossTableRedCellStyle );
            else if( request.session.lossReport[ i ].day7 > 0 )
                workSheet.Cell( i + 2, 8 ).Style( historicalLossTableGreenCellStyle );

            workSheet.Cell( i + 2, 8 ).Number( request.session.lossReport[ i ].day7 );

        }

    }

    // Show the result
    workBook.write( excelFilesReportNames.historicalLossReportExcelFileName, response );

    return;
}
