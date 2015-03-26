
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

var handleDonutChart = function (target, data) {
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
            legend: { show: true, placement: 'outsideGrid', container: $(target + "-legend") }
        });

        $(target).mouseleave(function() {
            var e = jQuery.Event('mousemove');
            e.pageX = 1;
            e.pageY = 1;
            $(target + ' canvas').trigger(e);
        });        
    }

    console.log(target + '-center');
    $(target + '-center').html(data[0].data)

    $(target + '-center').css({
        'position' : 'absolute',
        'left' : '50%',
        'top' : '50%',
        'margin-left' : -$(target + '-center').width()/2,
        'margin-top' : -$(target + '-center').height()/2 + 53
    });

    var previousPoint = null;
    $(target).bind("plothover", function (event, pos, item) {        
        if(item) {
            if (previousPoint !== item.seriesIndex) {
                previousPoint = item.seriesIndex;
                $("#tooltip").remove();
                showTooltip(pos.pageX, pos.pageY, item.series.label + ': ' +item.datapoint[0] + "%");
            }            
        } else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
        event.preventDefault()       
    });

};

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
                            handleDonutChart('#donut-chart-a', dataSetA);
                            handleDonutChart('#donut-chart-b', dataSetB);
                            handleDonutChart('#donut-chart-c', dataSetC);
                            handleDonutChart('#donut-chart-d', dataSetD);
                            handleDonutChart('#donut-chart-e', dataSetE);
                            handleDonutChart('#donut-chart-f', dataSetF);

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

                            drawLineChart('#bar-chart-a', data);
                            drawLineChart('#bar-chart-b', data);
                            drawLineChart('#bar-chart-c', data);

                        });
                    });
                });
            });
        }
    };
}();