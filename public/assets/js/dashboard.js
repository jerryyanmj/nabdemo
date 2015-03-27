
var blue		= '#348fe2',
    blueLight	= '#5da5e8',
    blueDark	= '#1993E4',
    aqua		= '#49b6d6',
    aquaLight	= '#6dc5de',
    aquaDark	= '#3a92ab',
    green		= '#00acac',
    greenLight	= '#33bdbd',
    greenDark	= '#008a8a',
    orange		= '#f59c1a',
    orangeLight	= '#f7b048',
    orangeDark	= '#c47d15',
    dark		= '#2d353c',
    grey		= '#b6c2c9',
    purple		= '#727cb6',
    purpleLight	= '#8e96c5',
    purpleDark	= '#5b6392',
    red         = '#ff5b57';

function showTooltip(x, y, contents) {
    $('<div id="tooltip" class="flot-tooltip">' + contents + '</div>').css( {
        top: y + 5,
        left: x + 5
    }).appendTo("body").fadeIn(500);
}   

var handleDonutChart = function (target, data, value, dynamic) {
    "use strict"; 

    if ($(target).length !== 0) {
        $.plot(target, data, {
            series: {
                pie: {
                   stroke: {
                        width: 2,
                        color: '#2d353c'
                    },                    
                    innerRadius: 0.6,
                    show: true,
                    label: {
                        show: false
                    }
                }
            },
            grid: {
                backgroundColor: { colors: [ "#000", "#eee" ] },
                hoverable: true,
                clickable: true
            },       
            legend: { noColumns: 1, show: true, placement: 'outsideGrid', container: $(target + "-legend") }
        });

        $(target).mouseleave(function() {
            var e = jQuery.Event('mousemove');
            e.pageX = 1;
            e.pageY = 1;
            $(target + ' canvas').trigger(e);
        });        
    }

    if(dynamic) {
        $(target + "-legend table tr:odd").hide();
        $(target + "-legend").addClass('dynamic');
        $(target + "-legend table").mouseenter(function() {
            $(target + "-legend table tr:odd").show();
        }).mouseleave(function() {
            $(target + "-legend table tr:odd").hide();
        });
    }

    $(target).append('<div class="ct">' + value + '</div>')

    function position() {
        $(target + ' .ct').css({
            'position' : 'absolute',
            'left' : '50%',
            'top' : '50%',
            'width': '100%',
            'text-align': 'center',
            'margin-left' : -$(target).width()/2,
            'margin-top' : -$(target).height()/2 + 53
        });
    }

    $(target).resize(function() {
        position();
        if(dynamic) {
            $(target + "-legend table tr:odd").hide();
        }
    })

    position();

    var previousPoint = null;
    $(target).bind("plothover", function (event, pos, item) {        
        if(item) {
            if (previousPoint !== item.seriesIndex) {
                previousPoint = item.seriesIndex;
                $("#tooltip").remove();
                showTooltip(pos.pageX, pos.pageY, item.series.label + ': ' + Math.round(item.datapoint[0]) + "%");
            }            
        } else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
        event.preventDefault()       
    });

};

function handleLineChart(target, value) {
    var percent = (100 - (value * 100)).toFixed(2);
    var color = 'purple';
    if(percent>50) {color = 'orange'}
    if(percent>75) {color = 'red'}
    $(target).addClass('bg-' + color)
    $(target + ' .stats-number').html(percent + '%');
    $(target + ' .progress-bar').attr('style', 'width:' + percent + '%');
}

var mainValue = 0;
var compareValue = 0;

var dataSetA = [
    { label: "0 Failed Streams",  data: 90, color: purpleDark},
    { label: "1 Failed Stream",  data: 5, color: orangeLight},
    { label: "> 1 Failed Streams",  data: 5, color: red}]

var dataSetB = [
    { label: "0-2 Seconds",  data: 70, color: purpleDark},
    { label: "2-5 Seconds",  data: 25, color: orangeLight},
    { label: ">5 Seconds",  data: 5, color: red}]

var dataSetC = [
    { label: "1-2 Mbps",  data: 25, color: red},
    { label: "2-3 Mbps",  data: 25, color: orangeLight},
    { label: ">3 Mbps",  data: 50, color: purpleDark}]

var dataSetD = [
    { label: "0 Events",  data: 75, color: purpleDark},
    { label: "1-3 Events",  data: 25, color: orangeLight},
    { label: "> 3 Events",  data: 0, color: red}]

var dataSetE = [
    { label: "0% Duration",  data: 60, color: purpleDark},
    { label: "> 0% - <5% Duration",  data: 30, color: orangeLight},
    { label: "> 5% Duration",  data: 10, color: red}]

var dataSetF = [
    { label: "0 Events",  data: 80, color: purpleDark},
    { label: "1-3 Events",  data: 19, color: orangeLight},
    { label: "> 3 Events",  data: 1, color: red}]

var drawLineChart = function(el,data) {
    var plot = $.plot(el, data,{
            series: {
                stack: false,
                lines: {show: false, steps: false},
                bars: {show: true, barWidth: 0.4, align: 'center'}
            },
            xaxis: {
                ticks: [3]
            },
            yaxis: {
                //max: 199,
                min: 0,
            },
            grid: {
                color: '#aaa',
                borderWidth:0,
                axisMargin:0,
                hoverable: true,
                autoHighlight: false
            },
            legend: { show: true, placement: 'outsideGrid', container: $(el + "-legend") }
    });
}


var Dashboard = function () {
	"use strict";
    return {
        //main function
        init: function () {
            
            $.getScript('assets/plugins/flot/jquery.flot.min.js').done(function() {
                $.getScript('assets/plugins/flot/jquery.flot.time.min.js').done(function() {
                    $.getScript('assets/plugins/flot/jquery.flot.resize.min.js').done(function() {
                        $.getScript('assets/plugins/flot/jquery.flot.pie.min.js').done(function() {

                            $.getJSON('/collection/video_failed_streams', function(data) {
                                $.each(data, function( key, value ) {
                                    dataSetA = [
                                    { label: "0 Failed Streams",  data: value['none'], color: purpleDark},
                                    { label: "1 Failed Stream",  data: value['0_1'], color: orangeLight},
                                    { label: "> 1 Failed Streams",  data: value['1_plus'], color: red}];
                                    mainValue = value['score'];
                                    compareValue = value['none']/value['all_buckets'];
                                });
                                handleLineChart('#index-6', compareValue)
                                handleDonutChart('#donut-chart-a', dataSetA, mainValue)
                            });

                            $.getJSON('/collection/video_startup', function(data) {
                                $.each(data, function( key, value ) {
                                    dataSetB = [
                                    { label: "0.00 - 0.25 Seconds",  data: value['0_25'], color: purpleDark},
                                    { label: "0.25 - 0.50 Seconds",  data: value['25_5'], color: purpleLight},
                                    { label: "0.50 - 0.75 Seconds",  data: value['5_75'], color: orangeLight},
                                    { label: "0.75 - 1.00 Seconds",  data: value['75_10'], color: '#c2610b'},
                                    { label: "1.00 - 1.25 Seconds",  data: value['10_125'], color: red},
                                    { label: "> 1.25 Seconds",  data: value['125_plus'], color: '#a53838'}];
                                    mainValue = value['score'];
                                    compareValue = value['0_25']/value['all_buckets'];
                                });
                                handleLineChart('#index-4', compareValue)
                                handleDonutChart('#donut-chart-b', dataSetB, mainValue, true)
                            });

                            $.getJSON('/collection/video_average_bitrate', function(data) {
                                $.each(data, function( key, value ) {
                                    dataSetC = [
                                    { label: "3.4 Mbps",  data: value['24_34'], color: purpleDark},
                                    { label: "2.4 Mbps",  data: value['14_24'], color: purpleLight},
                                    { label: "1.4 Mbps",  data: value['09_14'], color: orangeLight},
                                    { label: "0.9 Mbps",  data: value['06_09'], color: red},
                                    { label: "0.6 Mbps",  data: value['0_06'], color: '#a53838'}];
                                    mainValue = value['score'];
                                    compareValue = (1 - value['0_06']/value['all_buckets']);
                                });
                                handleLineChart('#index-3', compareValue)
                                handleDonutChart('#donut-chart-c', dataSetC, mainValue, true)
                            });

                            $.getJSON('/collection/video_buffering_events', function(data) {
                                $.each(data, function( key, value ) {
                                    dataSetD = [
                                    { label: "0 Events",  data: value['none'], color: purpleDark},
                                    { label: "0.05 Events",  data: value['0_005'], color: purpleLight},
                                    { label: "0.05 - 0.1 Events",  data: value['005_01'], color: orangeLight},
                                    { label: "0.1 - 0.2 Events",  data: value['01_02'], color: '#c2610b'},
                                    { label: "0.2 - 0.4 Events",  data: value['02_04'], color: red},
                                    { label: "> 0.4 Events",  data: value['04_plus'], color: '#a53838'}];
                                    mainValue = value['score'];
                                    compareValue = value['none']/value['all_buckets'];
                                });
                                handleLineChart('#index-1', compareValue)
                                handleDonutChart('#donut-chart-d', dataSetD, mainValue, true)
                            });

                            $.getJSON('/collection/video_buffering_duration', function(data) {
                                $.each(data, function( key, value ) {
                                    dataSetE = [
                                    { label: "0.0% Duration",  data: value['none'], color: purpleDark},
                                    { label: "0.0% - 0.5% Duration",  data: value['0_05'], color: purpleLight},
                                    { label: "0.5% - 1.0% Duration",  data: value['05_1'] || 5, color: orangeLight},
                                    { label: "1.0% - 1.5% Duration",  data: value['1_15'], color: '#c2610b'},
                                    { label: "1.5% - 3.0% Duration",  data: value['15_3'], color: red},
                                    { label: "> 3% Duration",  data: value['3_plus'], color: '#a53838'}];
                                    mainValue = value['score'];
                                    compareValue = value['none']/value['all_buckets'];
                                });
                                handleLineChart('#index-5', compareValue)
                                handleDonutChart('#donut-chart-e', dataSetE, mainValue, true)
                            });

                            $.getJSON('/collection/video_bitrate_downshifts', function(data) {
                                $.each(data, function( key, value ) {
                                    dataSetF = [
                                    { label: "0.0% Downshifts", data: value['none'], color: purpleDark},
                                    { label: "0.0% - 0.1% Downshifts",  data: value['0_01'], color: purpleLight},
                                    { label: "0.1% - 0.5% Downshifts",  data: value['01_05'] || 5, color: orangeLight},
                                    { label: "0.5% - 1.0% Downshifts",  data: value['05_1'], color: '#c2610b'},
                                    { label: "1.0% - 2.0% Downshifts",  data: value['1_2'], color: red},
                                    { label: "> 2% Downshifts",  data: value['2_plus'], color: '#a53838'}];
                                    mainValue = value['score'];
                                    compareValue = value['none']/value['all_buckets'];
                                });
                                handleLineChart('#index-2', compareValue)
                                handleDonutChart('#donut-chart-f', dataSetF, mainValue, true);

                                if (!$.cookie("firstTime")) {
                                    introJs().setOption('showBullets', false).start();
                                    $.cookie("firstTime", true);
                                }

                            });

                            var d1 = [];
                            d1.push([1, 28]);
                            var d2 = [];
                            d2.push([1, 83]);
                            var d3 = [];
                            d3.push([1, 150]);
                            var d4 = [];
                            d4.push([1, 195]);

                            //announce a dataset
                            var data = [

                            {
                                label: "Maximum",
                                stack: true,
                                data: d4,
                                color: "#1d61f2"
                            },
                            {
                                label: "Average",    
                                stack: true,
                                data: d2,
                                bars: {
                                    show: true,
                                    fill: false,
                                    lineWidth: 2,
                                    order: 1,
                                    fillColor:  "yellow"
                                },       
                                color: "yellow"},
                            {
                                label: "Minimum",
                                stack: true,
                                data: d1,
                                bars: {
                                    show: true,
                                    fill: false,
                                    lineWidth: 2,
                                    order: 1,
                                    fillColor:  "#f21d1d"
                                },       
                                color: "#f21d1d"},
                            {
                                label: "Current",
                                stack: true,
                                data: d3,
                                color: "green"},    
                            ];

                            drawLineChart('#bar-chart-a', data, 67);
                            drawLineChart('#bar-chart-b', data, 88);
                            drawLineChart('#bar-chart-c', data, 56);

                        });
                    });
                });
            });
        }
    };
}();