/* @flow */

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

var smartLegend = JSON.parse($.cookie("smartLegend"));

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
            legend: { noColumns: 1, show: true, placement: 'outsideGrid', container: $(target + "-legend .holder") }
        });

        $(target).mouseleave(function() {
            var e = jQuery.Event('mousemove');
            e.pageX = 1;
            e.pageY = 1;
            $(target + ' canvas').trigger(e);
        });
    }

    $(target).append('<div class="ct">' + value + '</div>')

    function position(dynamic) {

        if(!smartLegend) {
            $(target + "-legend .holder").addClass('size-md');
            dynamic = false;
        }

        if(dynamic) {
            if(!$(target + "-legend .holder").hasClass('trigered') && !$(target + "-legend .holder").hasClass('shown')) {
                $(target + "-legend table tr:odd").hide();
            }
            $(target + "-legend").addClass('dynamic');
            $(target + "-legend table").mouseenter(function() {
                    $(target + "-legend .holder").addClass('shown');
                    $(target + "-legend table tr:odd").show();
            }).mouseleave(function() {
                if(!$(target + "-legend .holder").hasClass('trigered')) {
                    $(target + "-legend .holder").removeClass('shown');
                    $(target + "-legend table tr:odd").hide();
                }
            });
        }

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
        position(dynamic);
        if(dynamic) {
            if(!$(target + "-legend .holder").hasClass('trigered')) {
                $(target + "-legend table tr:odd").hide();
            }
        }
    })

    position(dynamic);

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
    $(target).removePrefixedClasses('bg-');
    $(target).addClass('bg-' + color)
    $(target + ' .stats-number').html(percent + '%');
    $(target + ' .progress-bar').attr('style', 'width:' + percent + '%');
    $('.flot-y1-axis').css('color','#fff');
}

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
            legend: { show: true, placement: 'outsideGrid', container: $(el + "-legend .holder") }
    });
}

var source = new EventSource('/stream');

source.addEventListener('test_channel', updateChart, false);
source.addEventListener('channelB', updateChart, false);

function updateChart(e) {

    clearTimeout(timeSet);
    updateCharts();
    //handleReloadPanel('#index-1');
    // /handleReloadPanel('#index-2');
    //handleReloadPanel('#index-3');
    //handleReloadPanel('#index-4');
    //handleReloadPanel('#index-5');
    //handleReloadPanel('#index-6');

}

var dataSets = [];
var timeSet = null;
dataSets['Failed Stream'] = [];
var updateCharts = function() {

    $.getJSON('/collection/video_failed_streams', function(data) {
        var dataSet, mainValue, compareValue = 0;
        $.each(data, function( key, value ) {
            dataSet = [
            { label: "0 Failed Streams",  data: value['none'], color: purpleDark},
            { label: "1 Failed Stream",  data: value['0_1'], color: orangeLight},
            { label: "> 1 Failed Streams",  data: value['1_plus'], color: red}];
            dataSets['Failed Stream'].push(dataSet);
            mainValue = value['score'];
            compareValue = value['none']/value['all_buckets'];
        });
        handleLineChart('#index-1', compareValue)
        handleDonutChart('#donut-chart-a', dataSet, mainValue)
    });

    $.getJSON('/collection/video_startup', function(data) {
        var dataSet, mainValue, compareValue = 0;
        $.each(data, function( key, value ) {
            dataSet = [
            { label: "0.00 - 0.25 Seconds",  data: value['0_25'], color: purpleDark},
            { label: "0.25 - 0.50 Seconds",  data: value['25_5'], color: purpleLight},
            { label: "0.50 - 0.75 Seconds",  data: value['5_75'], color: orangeLight},
            { label: "0.75 - 1.00 Seconds",  data: value['75_10'], color: '#c2610b'},
            { label: "1.00 - 1.25 Seconds",  data: value['10_125'], color: red},
            { label: "> 1.25 Seconds",  data: value['125_plus'], color: '#a53838'}];
            mainValue = value['score'];
            compareValue = value['0_25']/value['all_buckets'];
        });
        handleLineChart('#index-2', compareValue)
        handleDonutChart('#donut-chart-b', dataSet, mainValue, true)
    });

    $.getJSON('/collection/video_average_bitrate', function(data) {
        var dataSet, mainValue, compareValue = 0;
        $.each(data, function( key, value ) {
            dataSet = [
            { label: "3.4 Mbps",  data: value['24_34'], color: purpleDark},
            { label: "2.4 Mbps",  data: value['14_24'], color: purpleLight},
            { label: "1.4 Mbps",  data: value['09_14'], color: orangeLight},
            { label: "0.9 Mbps",  data: value['06_09'], color: red},
            { label: "0.6 Mbps",  data: value['0_06'], color: '#a53838'}];
            mainValue = value['score'];
            compareValue = (1 - value['0_06']/value['all_buckets']);
        });
        handleLineChart('#index-3', compareValue)
        handleDonutChart('#donut-chart-c', dataSet, mainValue, true)
    });

    $.getJSON('/collection/video_buffering_events', function(data) {
        var dataSet, mainValue, compareValue = 0;
        $.each(data, function( key, value ) {
            dataSet = [
            { label: "0 Events",  data: value['none'], color: purpleDark},
            { label: "0.05 Events",  data: value['0_005'], color: purpleLight},
            { label: "0.05 - 0.1 Events",  data: value['005_01'], color: orangeLight},
            { label: "0.1 - 0.2 Events",  data: value['01_02'], color: '#c2610b'},
            { label: "0.2 - 0.4 Events",  data: value['02_04'], color: red},
            { label: "> 0.4 Events",  data: value['04_plus'], color: '#a53838'}];
            mainValue = value['score'];
            compareValue = value['none']/value['all_buckets'];
        });
        handleLineChart('#index-5', compareValue)
        handleDonutChart('#donut-chart-d', dataSet, mainValue, true)
    });

    $.getJSON('/collection/video_buffering_duration', function(data) {
        var dataSet, mainValue, compareValue = 0;
        $.each(data, function( key, value ) {
            dataSet = [
            { label: "0.0% Duration",  data: value['none'], color: purpleDark},
            { label: "0.0% - 0.5% Duration",  data: value['0_05'], color: purpleLight},
            { label: "0.5% - 1.0% Duration",  data: value['05_1'] || 5, color: orangeLight},
            { label: "1.0% - 1.5% Duration",  data: value['1_15'], color: '#c2610b'},
            { label: "1.5% - 3.0% Duration",  data: value['15_3'], color: red},
            { label: "> 3% Duration",  data: value['3_plus'], color: '#a53838'}];
            mainValue = value['score'];
            compareValue = value['none']/value['all_buckets'];
        });
        handleLineChart('#index-4', compareValue)
        handleDonutChart('#donut-chart-e', dataSet, mainValue, true)
    });

    $.getJSON('/collection/video_bitrate_downshifts', function(data) {
        var dataSet, mainValue, compareValue = 0;
        $.each(data, function( key, value ) {
            dataSet = [
            { label: "0.0% Downshifts", data: value['none'], color: purpleDark},
            { label: "0.0% - 0.1% Downshifts",  data: value['0_01'], color: purpleLight},
            { label: "0.1% - 0.5% Downshifts",  data: value['01_05'] || 5, color: orangeLight},
            { label: "0.5% - 1.0% Downshifts",  data: value['05_1'], color: '#c2610b'},
            { label: "1.0% - 2.0% Downshifts",  data: value['1_2'], color: red},
            { label: "> 2% Downshifts",  data: value['2_plus'], color: '#a53838'}];
            mainValue = value['score'];
            compareValue = value['none']/value['all_buckets'];
        });
        handleLineChart('#index-6', compareValue)
        handleDonutChart('#donut-chart-f', dataSet, mainValue, true);

        if (!$.cookie("firstTime") && $(window).width()>768) {
            introJs().setOption('showBullets', false).start();
            $.cookie("firstTime", true, { expires: 90 });
        }

    });

    timeSet = setTimeout(updateCharts, 10000);

}


var handleDashboardSparkline = function() {
	"use strict";
    var options = {
        height: '50px',
        width: '100%',
        fillColor: 'transparent',
        lineWidth: 2,
        spotRadius: '4',
        highlightLineColor: blue,
        highlightSpotColor: blue,
        spotColor: false,
        minSpotColor: false,
        maxSpotColor: false
    };
    function renderDashboardSparkline() {
        var value = [50,30,45,40,50,20,35,40,50,70,90,40];
        options.type = 'line';
        options.height = '23px';
        options.lineColor = red;
        options.highlightLineColor = red;
        options.highlightSpotColor = red;

        var countWidth = $('#sparkline-unique-visitor').width();
        if (countWidth >= 200) {
            options.width = '200px';
        } else {
            options.width = '100%';
        }

        $('#sparkline-unique-visitor').sparkline(value, options);
        options.lineColor = orange;
        options.highlightLineColor = orange;
        options.highlightSpotColor = orange;
        $('#sparkline-bounce-rate').sparkline(value, options);
        options.lineColor = purple;
        options.highlightLineColor = purple;
        options.highlightSpotColor = purple;
        $('#sparkline-total-page-views').sparkline(value, options);
        options.lineColor = purple;
        options.highlightLineColor = purple;
        options.highlightSpotColor = purple;
        $('#sparkline-avg-time-on-site').sparkline(value, options);
        options.lineColor = orange;
        options.highlightLineColor = orange;
        options.highlightSpotColor = orange;
        $('#sparkline-new-visits').sparkline(value, options);
        options.lineColor = purple;
        options.highlightLineColor = purple;
        options.highlightSpotColor = purple;
        $('#sparkline-return-visitors').sparkline(value, options);
    }

    renderDashboardSparkline();

    $(window).on('resize', function() {
        $('#sparkline-unique-visitor').empty();
        $('#sparkline-bounce-rate').empty();
        $('#sparkline-total-page-views').empty();
        $('#sparkline-avg-time-on-site').empty();
        $('#sparkline-new-visits').empty();
        $('#sparkline-return-visitors').empty();
        renderDashboardSparkline();
    });
};



var Dashboard = function () {
	"use strict";
    return {
        //main function
        init: function () {

            $.getScript('assets/plugins/sparkline/jquery.sparkline.js').done(function() {
                handleDashboardSparkline();
            });

            $.getScript('assets/plugins/flot/jquery.flot.min.js').done(function() {
                $.getScript('assets/plugins/flot/jquery.flot.time.min.js').done(function() {
                    $.getScript('assets/plugins/flot/jquery.flot.resize.min.js').done(function() {
                        $.getScript('assets/plugins/flot/jquery.flot.pie.min.js').done(function() {

                            updateCharts();

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
                                color: purpleDark
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




                        if ($('#interactive-chart').length !== 0) {

                                var data1 = [
                                    [1, 40], [2, 50], [3, 60], [4, 60], [5, 60], [6, 65], [7, 75], [8, 90], [9, 100], [10, 105],
                                    [11, 110], [12, 110], [13, 120], [14, 130], [15, 135],[16, 125], [17, 112], [18, 103], [19, 95], [20, 50]
                                ];
                                var data2 = [
                                    [1, 10],  [2, 6], [3, 10], [4, 12], [5, 18], [6, 20], [7, 25], [8, 23], [9, 24], [10, 25],
                                    [11, 18], [12, 30], [13, 25], [14, 25], [15, 30], [16, 27], [17, 20], [18, 18], [19, 31], [20, 23]
                                ];
                                var data3 = [
                                    [1, 20],  [2, 22], [3, 10], [4, 12], [5, 18], [6, 22], [7, 35], [8, 40], [9, 40], [10, 25],
                                    [11, 18], [12, 30], [13, 25], [14, 25], [15, 30], [16, 67], [17, 70], [18, 88], [19, 51], [20, 83]
                                ];
                                var data4 = [
                                    [1, 90],  [2, 122], [3, 100], [4, 120], [5, 180], [6, 122], [7, 135], [8, 140], [9, 120], [10, 125],
                                    [11, 118], [12, 90], [13, 85], [14, 75], [15, 80], [16, 67], [17, 40], [18, 28], [19, 11], [20, 1]
                                ];
                                var data5 = [
                                    [1, 190],  [2, 182], [3, 130], [4, 160], [5, 180], [6, 172], [7, 135], [8, 140], [9, 190], [10, 175],
                                    [11, 188], [12, 190], [13, 185], [14, 175], [15, 180], [16, 167], [17, 140], [18, 128], [19, 111], [20, 111]
                                ];
                                var data6 = [
                                    [1, 190],  [2, 182], [3, 130], [4, 160], [5, 180], [6, 172], [7, 135], [8, 140], [9, 190], [10, 175],
                                    [11, 188], [12, 190], [13, 185], [14, 175], [15, 180], [16, 167], [17, 140], [18, 128], [19, 111], [20, 111]
                                ];
                                var xLabel = [
                                    [1,''],[2,''],[3,'12:00'],[4,''],[5,''],[6,'16:00'],[7,''],[8,''],[9,'20:00'],[10,''],
                                    [11,''],[12,'00:00'],[13,''],[14,''],[15,'04:00'],[16,''],[17,''],[18,'08:00'],[19,''],[20,'']
                                ];


                                $.plot($("#interactive-chart2"), [
                                        {
                                            data: data1,
                                            label: "Browser",
                                            color: red,
                                            lines: { show: true, fill:false, lineWidth: 2 },
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        }, {
                                            data: data2,
                                            label: 'iOS Phone',
                                            color: purpleLight,
                                            lines: { show: true, fill:false, lineWidth: 2 },
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        }, {
                                            data: data3,
                                            label: 'iOS Tablet',
                                            color: purpleDark,
                                            lines: { show: true, fill:false, lineWidth: 2 },
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        }, {
                                            data: data4,
                                            label: 'Android',
                                            color: green,
                                            lines: { show: true, fill:false, lineWidth: 2 },
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        }
                                    ],
                                    {
                                        xaxis: {  ticks:xLabel, tickDecimals: 0, tickColor: '#ddd' },
                                        yaxis: {  ticks: 10, tickColor: '#ddd', min: 0, max: 200 },
                                        grid: {
                                            hoverable: true,
                                            clickable: true,
                                            tickColor: "#ddd",
                                            borderWidth: 1,
                                            backgroundColor: '#fff',
                                            borderColor: '#ddd'
                                        },
                                        legend: {
                                            labelBoxBorderColor: '#ddd',
                                            margin: 10,
                                            noColumns: 1,
                                            show: true
                                        }
                                    }
                                );


                                var dats = []
                                dats['Failed Streams'] = [
                                        {
                                            data: data1,
                                            label: "0 Failed Streams",
                                            color: purpleDark,
                                            lines: { show: true, fill:false, lineWidth: 2 },
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        }, {
                                            data: data2,
                                            label: '1 Failed Stream',
                                            color: orange,
                                            lines: { show: true, fill:false, lineWidth: 2 },
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        }, {
                                            data: data3,
                                            label: '> 1 Failed Streams',
                                            color: red,
                                            lines: { show: true, fill:false, lineWidth: 2 },
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        }
                                    ]

                                    dats['Startup Time'] = [
                                            {
                                                data: data1,
                                                label: "0.00 - 0.25 Seconds",
                                                color: purpleDark,
                                                lines: { show: true, fill:false, lineWidth: 2 },
                                                points: { show: true, radius: 3, fillColor: '#fff' },
                                                shadowSize: 0
                                            }, {
                                                data: data2,
                                                label: '0.25 - 0.50 Seconds',
                                                color: purpleLight,
                                                lines: { show: true, fill:false, lineWidth: 2 },
                                                points: { show: true, radius: 3, fillColor: '#fff' },
                                                shadowSize: 0
                                            }, {
                                                data: data3,
                                                label: '0.50 - 0.75 Seconds',
                                                color: red,
                                                lines: { show: true, fill:false, lineWidth: 2 },
                                                points: { show: true, radius: 3, fillColor: '#fff' },
                                                shadowSize: 0
                                            }, {
                                                data: data4,
                                                label: '0.75 - 1.00 Seconds',
                                                color: orange,
                                                lines: { show: true, fill:false, lineWidth: 2 },
                                                points: { show: true, radius: 3, fillColor: '#fff' },
                                                shadowSize: 0
                                            }
                                            , {
                                                data: data5,
                                                label: '1.00 - 1.25 Seconds',
                                                color: orangeDark,
                                                lines: { show: true, fill:false, lineWidth: 2 },
                                                points: { show: true, radius: 3, fillColor: '#fff' },
                                                shadowSize: 0
                                            }
                                            , {
                                                data: data1,
                                                label: '> 1.25 Seconds',
                                                color: green,
                                                lines: { show: true, fill:false, lineWidth: 2 },
                                                points: { show: true, radius: 3, fillColor: '#fff' },
                                                shadowSize: 0
                                            }
                                        ]


                                    $('.apply-filters').click(function(){
                                        clearTimeout(timeSet);
                                        timeSet = setTimeout(updateCharts, 1000);
                                        handleReloadPanel('#index-1');
                                        handleReloadPanel('#index-2');
                                        handleReloadPanel('#index-3');
                                        handleReloadPanel('#index-4');
                                        handleReloadPanel('#index-5');
                                        handleReloadPanel('#index-6');
                                    });

                                    $('.modal-d').click(function(){
                                        $('#mod-name').html(this.id)

                                        console.log(dats[this.id])
                                        $.plot($("#interactive-chart"), dats[this.id],
                                            {
                                                xaxis: {  ticks:xLabel, tickDecimals: 0, tickColor: '#ddd' },
                                                yaxis: {  ticks: 10, tickColor: '#ddd', min: 0, max: 200 },
                                                grid: {
                                                    hoverable: true,
                                                    clickable: true,
                                                    tickColor: "#ddd",
                                                    borderWidth: 1,
                                                    backgroundColor: '#fff',
                                                    borderColor: '#ddd'
                                                },
                                                legend: {
                                                    labelBoxBorderColor: '#ddd',
                                                    margin: 10,
                                                    noColumns: 1,
                                                    show: true
                                                }
                                            }
                                        );

                                    });

                                    var d1 = [
                                        [1262905200000, 115],
                                        [1262818800000, 115],
                                        [1262732400000, 115],
                                        [1262646000000, 122],
                                        [1262559600000, 135],
                                        [1262473200000, 135],
                                        [1262386800000, 138],
                                        [1262300400000, 140],
                                        [1262214000000, 145],
                                        [1262127600000, 142],
                                        [1262041200000, 130],
                                        [1261954800000, 123]
                                    ]

                                        var d2 = [
                                            [1262905200000, 60],
                                            [1262818800000, 60],
                                            [1262732400000, 60],
                                            [1262646000000, 55],
                                            [1262559600000, 50],
                                            [1262473200000, 50],
                                            [1262386800000, 52],
                                            [1262300400000, 49],
                                            [1262214000000, 58],
                                            [1262127600000, 58],
                                            [1262041200000, 63],
                                            [1261954800000, 67]
                                        ]

                                        var dats = []
                                        dats.push({
                                            data:d1,
                                            lines:{show: true},
                                            label:"Mountain",
                                            color: orange,
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        });

                                        dats.push({
                                            data:d2,
                                            lines:{show: true},
                                            label:"Valley",
                                            color: purpleLight,
                                            points: { show: true, radius: 3, fillColor: '#fff' },
                                            shadowSize: 0
                                        });

                                        $.plot($("#interactive-chart2"), dats, {yaxis: {label:"cm"}, xaxis: {mode:"time"}});

                                var previousPoint = null;
                                $("#interactive-chart").bind("plothover", function (event, pos, item) {
                                    $("#x").text(pos.x.toFixed(2));
                                    $("#y").text(pos.y.toFixed(2));
                                    if (item) {
                                        if (previousPoint !== item.dataIndex) {
                                            previousPoint = item.dataIndex;
                                            $("#tooltip").remove();
                                            var y = item.datapoint[1].toFixed(2);

                                            var content = item.series.label + " " + y;
                                            showTooltip(item.pageX, item.pageY, content);
                                        }
                                    } else {
                                        $("#tooltip").remove();
                                        previousPoint = null;
                                    }
                                    event.preventDefault();
                                });
                            }
                        });
                    });
                });
            });
        }
    };
}();
