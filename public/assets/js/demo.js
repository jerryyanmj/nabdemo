
var updateDevices = function() {

    $("#interactive-chart2").empty();

    var tt = new Date().getTime();

    var datos = []
    if(notFiltered('Browser')) {
        datos.push({data:[
            [tt, 60],
            [tt - 300000, getRandom(60,70)],
            [tt - 600000, getRandom(30,50)],
            [tt - 900000, getRandom(30,50)],
            [tt - 1200000, getRandom(30,50)],
            [tt - 1500000, getRandom(40,50)],
            [tt - 1800000, getRandom(45,50)],
            [tt - 2100000, getRandom(49,50)],
            [tt - 2400000, getRandom(23,50)],
            [tt - 2700000, getRandom(23,40)],
            [tt - 3000000, getRandom(60,70)],
            [tt - 3300000, 67]
        ],
            lines:{show: true},
            label:"Browser",
            color: orange,
            points: { show: true, radius: 3, fillColor: '#fff' },
            shadowSize: 0
        });
    }

    if(notFiltered('iOS Phone')) {
        datos.push({data:[
            [tt, 115],
            [tt - 300000, getRandom(115,120)],
            [tt - 600000, getRandom(130,140)],
            [tt - 900000, getRandom(145,150)],
            [tt - 1200000, getRandom(150,160)],
            [tt - 1500000, getRandom(120,135)],
            [tt - 1800000, getRandom(115,150)],
            [tt - 2100000, getRandom(115,140)],
            [tt - 2400000, getRandom(150,160)],
            [tt - 2700000, getRandom(155,160)],
            [tt - 3000000, getRandom(115,130)],
            [tt - 3300000, 123]
        ],
            lines:{show: true},
            label:"iOS Phone",
            color: purpleLight,
            points: { show: true, radius: 3, fillColor: '#fff' },
            shadowSize: 0
        });
    }

    if(notFiltered('iOS Tablet')) {
        datos.push({data:[
            [tt, 85],
            [tt - 300000, getRandom(90,95)],
            [tt - 600000, getRandom(90,95)],
            [tt - 900000, getRandom(100,120)],
            [tt - 1200000, getRandom(120,130)],
            [tt - 1500000, getRandom(100,150)],
            [tt - 1800000, getRandom(107,108)],
            [tt - 2100000, getRandom(90,95)],
            [tt - 2400000, getRandom(90,105)],
            [tt - 2700000, getRandom(120,195)],
            [tt - 3000000, getRandom(90,150)],
            [tt - 3300000, 83]
        ],
            lines:{show: true},
            label:"iOS Tablet",
            color: purpleDark,
            points: { show: true, radius: 3, fillColor: '#fff' },
            shadowSize: 0
        });
    }

    if(notFiltered('Android Phone')) {
        datos.push({data:[
            [tt, 65],
            [tt - 300000, getRandom(55,55)],
            [tt - 600000, getRandom(55,65)],
            [tt - 900000, getRandom(70,72)],
            [tt - 1200000, getRandom(70,85)],
            [tt - 1500000, getRandom(70,95)],
            [tt - 1800000, getRandom(90,98)],
            [tt - 2100000, getRandom(100,105)],
            [tt - 2400000, getRandom(90,105)],
            [tt - 2700000, getRandom(90,92)],
            [tt - 3000000, getRandom(50,70)],
            [tt - 3300000, 73]
        ],
            lines:{show: true},
            label:"Android Phone",
            color: green,
            points: { show: true, radius: 3, fillColor: '#fff' },
            shadowSize: 0
        });
    }

    if(notFiltered('Android Tablet')) {
        datos.push({data:[
            [tt, 15],
            [tt - 300000, 25],
            [tt - 600000, 35],
            [tt - 900000, 32],
            [tt - 1200000, 25],
            [tt - 1500000, 15],
            [tt - 1800000, 48],
            [tt - 2100000, 20],
            [tt - 2400000, 25],
            [tt - 2700000, 32],
            [tt - 3000000, 40],
            [tt - 3300000, 23]
        ],
            lines:{show: true},
            label:"Android Tablet",
            color: greenDark,
            points: { show: true, radius: 3, fillColor: '#fff' },
            shadowSize: 0
        });
    }

    if(notFiltered('Android STB')) {
        datos.push({data:[
            [tt, 15],
            [tt - 300000, 25],
            [tt - 600000, 35],
            [tt - 900000, 32],
            [tt - 1200000, 25],
            [tt - 1500000, 15],
            [tt - 1800000, 48],
            [tt - 2100000, 20],
            [tt - 2400000, 25],
            [tt - 2700000, 32],
            [tt - 3000000, 40],
            [tt - 3300000, 23]
        ],
            lines:{show: true},
            label:"Android STB",
            color: greenLight,
            points: { show: true, radius: 3, fillColor: '#fff' },
            shadowSize: 0
        });
    }

    if(notFiltered('Roku')) {
        datos.push({data:[
            [tt, 17],
            [tt - 300000, 27],
            [tt - 600000, 37],
            [tt - 900000, 37],
            [tt - 1200000, 27],
            [tt - 1500000, 17],
            [tt - 1800000, 37],
            [tt - 2100000, 27],
            [tt - 2400000, 27],
            [tt - 2700000, 37],
            [tt - 3000000, 37],
            [tt - 3300000, 27]
        ],
            lines:{show: true},
            label:"Roku",
            color: redLight,
            points: { show: true, radius: 3, fillColor: '#fff' },
            shadowSize: 0
        });
    }

    $.plot($("#interactive-chart2"), datos, {
        yaxis: {label:"cm"},
        xaxis: {mode:"time"},
        grid: {
            hoverable: true,
            clickable: true
        }
    });

    enableTooltip('#interactive-chart2');
}


var updateBarCharts = function( totalSec) {

var data = [];
var ranges = [[[330,350],[400,450],[440,460],[480,490]],
             [[totalSec - 4000,totalSec - 6000],[totalSec - 3000,totalSec - 1000],[totalSec,totalSec],[totalSec + 4000,totalSec + 5000]], 
             [[60,66],[66,71],[73,80],[82,90]]];
for(var x=0; x<3; x++) {

    var d1 = [];
    d1.push([1,getRandom(ranges[x][0][0],ranges[x][0][1])]);
    var d2 = [];
    d2.push([1,getRandom(ranges[x][1][0],ranges[x][1][1])]);
    var d3 = [];
    d3.push([1,getRandom(ranges[x][2][0],ranges[x][2][1])]);
    var d4 = [];
    d4.push([1,getRandom(ranges[x][3][0],ranges[x][3][1])]);

    var assignValue = function( chart, value ) {
        if(chart === 0 || chart === 1) {return value.toFixed(0)}
            else {return value.toFixed(2)}
    }

    //announce a dataset
    data[x] = [

    {
        label: "Maximum (" + assignValue(x, d4[0][1]) + ")",
        stack: true,
        data: d4,
        color: purpleDark
    },
    {
        label: "Average (" + assignValue(x, d2[0][1]) + ")",
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
        label: "Minimum (" + assignValue(x, d1[0][1]) + ")",
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
        label: "Current (" + assignValue(x, d3[0][1]) + ")",
        stack: true,
        data: d3,
        color: "green"},
    ];
}

    handleBarChart('#bar-chart-a', data[0]);
    handleBarChart('#bar-chart-b', data[1]);
    handleBarChart('#bar-chart-c', data[2]);

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
        var value = [];
        var val = [];
        options.type = 'line';
        options.height = '23px';
        options.lineColor = redLight;
        options.highlightLineColor = redLight;
        options.highlightSpotColor = redLight;

        for(var x=0; x<6; x++) {
            value[x] = [getRandom(40,80).toFixed(2),
                        getRandom(20,60).toFixed(2),
                        getRandom(30,55).toFixed(2),
                        getRandom(30,55).toFixed(2),
                        getRandom(30,60).toFixed(2),
                        getRandom(10,40).toFixed(2),
                        getRandom(20,45).toFixed(2),
                        getRandom(30,55).toFixed(2),
                        getRandom(30,70).toFixed(2),
                        getRandom(55,80).toFixed(2),
                        getRandom(100,70).toFixed(2),
                        getRandom(30,55).toFixed(2)];
            val[x] = getRandom(10,15).toFixed(2);
        }

        var countWidth = $('#sparkline-unique-visitor').width();
        if (countWidth >= 200) {
            options.width = '200px';
        } else {
            options.width = '100%';
        }

        $('#sparkline-unique-visitor').sparkline(value[0], options);
        options.lineColor = orange;
        options.highlightLineColor = orange;
        options.highlightSpotColor = orange;
        $('#sparkline-bounce-rate').sparkline(value[1], options);
        options.lineColor = purple;
        options.highlightLineColor = purple;
        options.highlightSpotColor = purple;
        $('#sparkline-total-page-views').sparkline(value[2], options);
        options.lineColor = purple;
        options.highlightLineColor = purple;
        options.highlightSpotColor = purple;
        $('#sparkline-avg-time-on-site').sparkline(value[3], options);
        options.lineColor = orange;
        options.highlightLineColor = orange;
        options.highlightSpotColor = orange;
        $('#sparkline-new-visits').sparkline(value[4], options);
        options.lineColor = purple;
        options.highlightLineColor = purple;
        options.highlightSpotColor = purple;
        $('#sparkline-return-visitors').sparkline(value[5], options);


        $('#val1').html(val[0] + '% ' + '<span class="text-success"><i class="fa fa-arrow-up"></i></span>');
        $('#val2').html(val[1] + '% ' + '<span class="text-success"><i class="fa fa-arrow-up"></i></span>');
        $('#val3').html(val[2] + '% ' + '<span class="text-success"><i class="fa fa-arrow-up"></i></span>');
        $('#val4').html(val[3] + '% ' + '<span class="text-danger"><i class="fa fa-arrow-down"></i></span>');
        $('#val5').html(val[4] + '% ' + '<span class="text-danger"><i class="fa fa-arrow-down"></i></span>');
        $('#val6').html(val[5] + '% ' + '<span class="text-success"><i class="fa fa-arrow-up"></i></span>');
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
