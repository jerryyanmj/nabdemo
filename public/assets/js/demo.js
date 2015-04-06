
var updateDevices = function() {

    $("#interactive-chart2").empty();

    var tt = new Date().getTime();

    var datos = []
    if(notFiltered('Browser')) {
        datos.push({data:[
            [tt, 60],
            [tt - 300000, 60],
            [tt - 600000, 60],
            [tt - 900000, 55],
            [tt - 1200000, 50],
            [tt - 1500000, 50],
            [tt - 1800000, 52],
            [tt - 2100000, 49],
            [tt - 2400000, 58],
            [tt - 2700000, 58],
            [tt - 3000000, 63],
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
            [tt - 300000, 115],
            [tt - 600000, 115],
            [tt - 900000, 122],
            [tt - 1200000, 135],
            [tt - 1500000, 135],
            [tt - 1800000, 138],
            [tt - 2100000, 140],
            [tt - 2400000, 145],
            [tt - 2700000, 142],
            [tt - 3000000, 130],
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
            [tt - 300000, 95],
            [tt - 600000, 105],
            [tt - 900000, 122],
            [tt - 1200000, 105],
            [tt - 1500000, 115],
            [tt - 1800000, 108],
            [tt - 2100000, 100],
            [tt - 2400000, 105],
            [tt - 2700000, 92],
            [tt - 3000000, 50],
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
            [tt - 300000, 55],
            [tt - 600000, 65],
            [tt - 900000, 72],
            [tt - 1200000, 85],
            [tt - 1500000, 85],
            [tt - 1800000, 98],
            [tt - 2100000, 100],
            [tt - 2400000, 105],
            [tt - 2700000, 92],
            [tt - 3000000, 70],
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


var updateBarCharts = function() {

    var d1 = [];
    d1.push([1, getRandom(30,50)]);
    var d2 = [];
    d2.push([1, getRandom(100,150)]);
    var d3 = [];
    d3.push([1, getRandom(140,160)]);
    var d4 = [];
    d4.push([1, getRandom(180,190)]);

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

    handleBarChart('#bar-chart-a', data);
    handleBarChart('#bar-chart-b', data);
    handleBarChart('#bar-chart-c', data);

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
        options.lineColor = redLight;
        options.highlightLineColor = redLight;
        options.highlightSpotColor = redLight;

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
