
var updateDevices = function() {

    $("#interactive-chart2").empty();

    var datos = []
    if(notFiltered('Browser')) {
        datos.push({data:[
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
            [1262905200000, 85],
            [1262818800000, 95],
            [1262732400000, 105],
            [1262646000000, 122],
            [1262559600000, 105],
            [1262473200000, 115],
            [1262386800000, 108],
            [1262300400000, 100],
            [1262214000000, 105],
            [1262127600000, 92],
            [1262041200000, 50],
            [1261954800000, 83]
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
            [1262905200000, 65],
            [1262818800000, 55],
            [1262732400000, 65],
            [1262646000000, 72],
            [1262559600000, 85],
            [1262473200000, 85],
            [1262386800000, 98],
            [1262300400000, 100],
            [1262214000000, 105],
            [1262127600000, 92],
            [1262041200000, 70],
            [1261954800000, 73]
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
            [1262905200000, 15],
            [1262818800000, 25],
            [1262732400000, 35],
            [1262646000000, 32],
            [1262559600000, 25],
            [1262473200000, 15],
            [1262386800000, 48],
            [1262300400000, 20],
            [1262214000000, 25],
            [1262127600000, 32],
            [1262041200000, 40],
            [1261954800000, 23]
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
            [1262905200000, 15],
            [1262818800000, 25],
            [1262732400000, 35],
            [1262646000000, 32],
            [1262559600000, 25],
            [1262473200000, 15],
            [1262386800000, 48],
            [1262300400000, 20],
            [1262214000000, 25],
            [1262127600000, 32],
            [1262041200000, 40],
            [1261954800000, 23]
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
            [1262905200000, 17],
            [1262818800000, 27],
            [1262732400000, 37],
            [1262646000000, 37],
            [1262559600000, 27],
            [1262473200000, 17],
            [1262386800000, 37],
            [1262300400000, 27],
            [1262214000000, 27],
            [1262127600000, 37],
            [1262041200000, 37],
            [1261954800000, 27]
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
