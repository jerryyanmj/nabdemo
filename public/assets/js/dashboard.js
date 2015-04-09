/* @flow */

var handleDonutChart = function (target, data, score, dynamic) {
    $.plot(target, data, {
        series: {
            pie: {
               stroke: {
                    width: 2,
                    color: purpleDeep
                },
                innerRadius: 0.6,
                show: true,
                label: {
                    show: false
                }
            }
        },
        grid: {
            hoverable: true
        },
        legend: { noColumns: 1, show: true, placement: 'outsideGrid', container: $(target + "-legend .holder") }
    });

    $(target).append('<div class="ct">' + Math.round(score) + '</div>')
    $(target).resize(function() {
        centerPosition(target, dynamic);
        if(dynamic) {
            if(!$(target + "-legend .holder").hasClass('trigered')) {
                $(target + "-legend table tr:odd").hide();
            }
        }
    })

    enableTooltip(target, '%');
    centerPosition(target, dynamic);
};

var handleLineChart = function (target, value) {
    var percent = (100 - (value * 100)).toFixed(2);
    var color = 'purple';

    if(percent > 50) {color = 'orange'}
    if(percent > 75) {color = 'red'}

    $(target).removePrefixedClasses('bg-');
    $(target).addClass('bg-' + color)
    $(target + ' .stats-number').html('+' + percent + '%');
    $(target + ' .progress-bar').attr('style', 'width:' + percent + '%');

    $(target).parent().removeClass('panel-loading');
    $(target).parent().find('.panel-loader').remove();
}

var handleBarChart = function (el, data) {
    var plot = $.plot(el, data, {
        series: {
            stack: false,
            lines: {show: false, steps: false},
            bars: {show: true, barWidth: 0.4, align: 'center'}
        },
        xaxis: {
            ticks: [3]
        },
        yaxis: {
            min: 0
        },
        grid: {
            borderWidth:0,
            axisMargin:0,
            hoverable: true,
        },
        legend: { show: true, placement: 'outsideGrid', container: $(el + "-legend .holder") }
    });
}

var source = new EventSource('/stream');

source.addEventListener('test_channel', pubsubUpdate, false);
source.addEventListener('channelB', pubsubUpdate, false);

var pubsubUpdate = function (e) {
    console.log(e);
    updateDialogs();
    updateDevices();    
    updateBarCharts();
}

var dats = [];
var filters = [];
var timer = null;

$("#filter-devices input").change(function() {

    filters = [];

    if(!this.checked && this.value == 'All Device Types') {
        $('#filter-devices :checkbox').prop('checked', true);
        $(this).prop('checked', false);
    }

    if(this.checked && this.value == 'All Device Types') {
        $('#filter-devices :checkbox').prop('checked', false);
        $(this).prop('checked', true);
    }

    if(this.checked && this.value != 'All Device Types') {
        $('#filter-devices #all').prop('checked', false);
        $('#filter-devices input[type=checkbox]').each(function () {
            if(!this.checked && this.value !='All Device Types') {
                filters.push(this.value);
            }
        });
    }

    if(!this.checked && this.value != 'All Device Types') {
        if($('#filter-devices :checked').length == 0) {
            $('#filter-devices #all').prop('checked', true);;
        }
        else {
            $('#filter-devices input[type=checkbox]').each(function () {
                if(!this.checked && this.value !='All Device Types') {
                    filters.push(this.value);
                }
            });
        }
    }
});

var notFiltered = function (device, stream, chunks) {
    if(filters.indexOf(device) > -1) return false;
    if(filters.indexOf(stream) > -1) return false;
    if(filters.indexOf(chunks) > -1) return false;
    return true;
}

var updatePanels = function() {

    $.getJSON('/collection/video_failed_streams', function(data) {
        var scoreSum = itemCount = percentSum = 0;
        var dataSet = [
        { label: "0 Failed Streams",  data: 0, color: purpleDark},
        { label: "1 Failed Stream",  data: 0, color: orangeLight},
        { label: "> 1 Failed Streams",  data: 0, color: redLight}];

        $.each(data, function( key, value ) {
            if(notFiltered(value['device_type'], value['stream_type'], value['chunk_type']))
            {
                dataSet[0].data = dataSet[0].data + value['none'];
                dataSet[1].data = dataSet[1].data + value['0_1'];
                dataSet[2].data = dataSet[2].data + value['1_plus'];

                scoreSum = scoreSum + value['score'];
                percentSum = percentSum + value['none']/value['all_buckets'];
                itemCount = itemCount + 1;
            }
        });
        handleLineChart('#index-1', percentSum/itemCount);
        handleDonutChart('#donut-chart-a', dataSet, scoreSum/itemCount);
    });

    $.getJSON('/collection/video_startup', function(data) {
        var scoreSum = itemCount = percentSum = 0;
        var dataSet = [
        { label: "0.00 - 0.25 Seconds",  data: 0, color: purpleDark},
        { label: "0.25 - 0.50 Seconds",  data: 0, color: purpleLight},
        { label: "0.50 - 0.75 Seconds",  data: 0, color: orangeLight},
        { label: "0.75 - 1.00 Seconds",  data: 0, color: orangeDark},
        { label: "1.00 - 1.25 Seconds",  data: 0, color: redLight},
        { label: "> 1.25 Seconds",       data: 0, color: redDark}];

        $.each(data, function( key, value ) {
            if(notFiltered(value['device_type'], value['stream_type'], value['chunk_type']))
            {
                dataSet[0].data = dataSet[0].data + value['0_25'];
                dataSet[1].data = dataSet[1].data + value['25_5'];
                dataSet[2].data = dataSet[2].data + value['25_5'];
                dataSet[3].data = dataSet[3].data + value['75_10'];
                dataSet[4].data = dataSet[4].data + value['10_125'];
                dataSet[5].data = dataSet[5].data + value['125_plus'];

                scoreSum = scoreSum + value['score'];
                percentSum = percentSum + value['0_25']/value['all_buckets'];
                itemCount = itemCount + 1;
            }
        });
        handleLineChart('#index-2', percentSum/itemCount);
        handleDonutChart('#donut-chart-b', dataSet, scoreSum/itemCount);
    });

    $.getJSON('/collection/video_average_bitrate', function(data) {
        var scoreSum = itemCount = percentSum = 0;
        var dataSet = [
        { label: "3.4 Mbps",  data: 0, color: purpleDark},
        { label: "2.4 Mbps",  data: 0, color: purpleLight},
        { label: "1.4 Mbps",  data: 0, color: orangeLight},
        { label: "0.9 Mbps",  data: 0, color: redLight},
        { label: "0.6 Mbps",  data: 0, color: redDark}];

        $.each(data, function( key, value ) {
            if(notFiltered(value['device_type'], value['stream_type'], value['chunk_type']))
            {
                dataSet[0].data = dataSet[0].data + value['24_34'];
                dataSet[1].data = dataSet[1].data + value['14_24'];
                dataSet[2].data = dataSet[2].data + value['09_14'];
                dataSet[3].data = dataSet[3].data + value['06_09'];
                dataSet[4].data = dataSet[4].data + value['0_06'];

                scoreSum = scoreSum + value['score'];
                percentSum = percentSum + value['24_34']/value['all_buckets'];
                itemCount = itemCount + 1;
            }            

        });
        handleLineChart('#index-3', percentSum/itemCount);
        handleDonutChart('#donut-chart-c', dataSet, scoreSum/itemCount);
    });

    $.getJSON('/collection/video_buffering_duration', function(data) {
        var scoreSum = itemCount = percentSum = 0;
        var dataSet = [
        { label: "0.0% Duration",         data: 0, color: purpleDark},
        { label: "0.0% - 0.5% Duration",  data: 0, color: purpleLight},
        { label: "0.5% - 1.0% Duration",  data: 0, color: orangeLight},
        { label: "1.0% - 1.5% Duration",  data: 0, color: orangeDark},
        { label: "1.5% - 3.0% Duration",  data: 0, color: redLight},
        { label: "> 3% Duration",         data: 0, color: redDark}];

        $.each(data, function( key, value ) {
            if(notFiltered(value['device_type'], value['stream_type'], value['chunk_type'])) 
            {
                dataSet[0].data = dataSet[0].data + value['none'];
                dataSet[1].data = dataSet[1].data + value['0_05'];
                dataSet[2].data = dataSet[2].data + value['05_1'];
                dataSet[3].data = dataSet[3].data + value['1_15'];
                dataSet[4].data = dataSet[4].data + value['15_3'];
                dataSet[5].data = dataSet[5].data + value['3_plus'];

                scoreSum = scoreSum + value['score'];
                percentSum = percentSum + value['none']/value['all_buckets'];
                itemCount = itemCount + 1;
            }
        });
        handleLineChart('#index-4', percentSum/itemCount);
        handleDonutChart('#donut-chart-d', dataSet, scoreSum/itemCount);
    });

    $.getJSON('/collection/video_buffering_events', function(data) {
        var scoreSum = itemCount = percentSum = 0;
        var dataSet = [
        { label: "0 Events", data: 0, color: purpleDark},
        { label: "0.05 Events", data: 0, color: purpleLight},
        { label: "0.05 - 0.1 Events", data: 0, color: orangeLight},
        { label: "0.1 - 0.2 Events", data: 0, color: orangeDark},
        { label: "0.2 - 0.4 Events", data: 0, color: redLight},
        { label: "> 0.4 Events",  data: 0, color: redDark}];

        $.each(data, function( key, value ) {
            if(notFiltered(value['device_type'], value['stream_type'], value['chunk_type'])) 
            {
                dataSet[0].data = dataSet[0].data + value['none'];
                dataSet[1].data = dataSet[1].data + value['0_005'];
                dataSet[2].data = dataSet[2].data + value['005_01'];
                dataSet[3].data = dataSet[3].data + value['01_02'];
                dataSet[4].data = dataSet[4].data + value['02_04'];
                dataSet[5].data = dataSet[5].data + value['04_plus'];

                scoreSum = scoreSum + value['score'];
                percentSum = percentSum + value['none']/value['all_buckets'];
                itemCount = itemCount + 1;
            }  
        });
        handleLineChart('#index-5', percentSum/itemCount);
        handleDonutChart('#donut-chart-e', dataSet, scoreSum/itemCount);
    });

    $.getJSON('/collection/video_bitrate_downshifts', function(data) {
        var scoreSum = itemCount = percentSum = 0;
        var dataSet = [
        { label: "0.0% Downshifts",         data: 0, color: purpleDark},
        { label: "0.0% - 0.1% Downshifts",  data: 0, color: purpleLight},
        { label: "0.1% - 0.5% Downshifts",  data: 0, color: orangeLight},
        { label: "0.5% - 1.0% Downshifts",  data: 0, color: orangeDark},
        { label: "1.0% - 2.0% Downshifts",  data: 0, color: redLight},
        { label: "> 2% Downshifts",         data: 0, color: redDark}];

        $.each(data, function( key, value ) {
            if(notFiltered(value['device_type'], value['stream_type'], value['chunk_type'])) 
            {
                dataSet[0].data = dataSet[0].data + value['none'];
                dataSet[1].data = dataSet[1].data + value['0_01'];
                dataSet[2].data = dataSet[2].data + value['01_05'];
                dataSet[3].data = dataSet[3].data + value['05_1'];
                dataSet[4].data = dataSet[4].data + value['1_2'];
                dataSet[5].data = dataSet[5].data + value['2_plus'];

                scoreSum = scoreSum + value['score'];
                percentSum = percentSum + value['none']/value['all_buckets'];
                itemCount = itemCount + 1;
            }              
        });
        handleLineChart('#index-6', percentSum/itemCount);
        handleDonutChart('#donut-chart-f', dataSet, scoreSum/itemCount);

        if (!$.cookie("firstTime") && $(window).width()>768) {
            introJs().setOption('showBullets', false).start();
            $.cookie("firstTime", true, { expires: 90 });
        }
    });

    timer = setTimeout(updatePanels, 20000);
}

var updateDialogs = function() {

    $.getJSON('/aggregated/video_failed_streams', function(data) {

        dats['Failed Streams'] = [];
        var holders = [[],[],[]];
        var buckets = ['none_bucket', '0_1_bucket', '1_plus_bucket']
        var namings = ['0 Failed Streams', '1 Failed Stream', '> 1 Failed Streams']

        $.each(data, function( key, value ) {
             for (var i = 0; i < buckets.length; i++) {
                holders[i].push([value['start_datetime_ts'] * 1000, value[buckets[i]]])
            }
        });

        for (var i = 0; i < buckets.length; i++) {
            dats['Failed Streams'].push({
                data: holders[i],
                label: namings[i],
                color: colorArray3[i],
            })
        }

        $('#Failed-Streams').attr('href', '#modal-dialog-trend');
        $('#Failed-Streams').html('<font color="#fff">View Details <i class="fa fa-arrow-circle-o-right"></i></font>');
    });

    $.getJSON('/aggregated/video_startup', function(data) {

        dats['Startup Time'] = [];
        var holders = [[],[],[],[],[],[]];
        var buckets = ['0_25_bucket', '25_5_bucket', '5_75_bucket', '75_10_bucket', '10_125_bucket', '125_plus']
        var namings = ['0.00-0.25 Seconds', '0.25-0.50 Seconds', '0.50-0.75 Seconds', '0.75-1.00 Seconds', '1.00-1.25 Seconds', '>1.25 Seconds']

        $.each(data, function( key, value ) {
             for (var i = 0; i < buckets.length; i++) {
                holders[i].push([value['start_datetime_ts'] * 1000, value[buckets[i]]])
            }
        });

        for (var i = 0; i < buckets.length; i++) {
            dats['Startup Time'].push({
                data: holders[i],
                label: namings[i],
                color: colorArray6[i],
            })
        }

        $('#Startup-Time').attr('href', '#modal-dialog-trend');
        $('#Startup-Time').html('<font color="#fff">View Details <i class="fa fa-arrow-circle-o-right"></i></font>');
    });

    $.getJSON('/aggregated/video_average_bitrate', function(data) {

        dats['Average Bitrate'] = [];
        var holders = [[],[],[],[],[]];
        var buckets = ['24_34', '14_24', '09_14', '06_09', '0_06']
        var namings = ['3.4 Mbps', '2.4 Mbps', '1.4 Mbps', '0.9 Mbps', '0.6 Mbps']

        $.each(data, function( key, value ) {
             for (var i = 0; i < buckets.length; i++) {
                holders[i].push([value['start_datetime_ts'] * 1000, value[buckets[i]]])
            }
        });

        for (var i = 0; i < buckets.length; i++) {
            dats['Average Bitrate'].push({
                idx:i,
                data: holders[i],
                label: namings[i],
                color: colorArray5[i],
            })
        }

        $('#Average-Bitrate').attr('href', '#modal-dialog-trend');
        $('#Average-Bitrate').html('<font color="#fff">View Details <i class="fa fa-arrow-circle-o-right"></i></font>');
    });

    $.getJSON('/aggregated/video_buffering_duration', function(data) {

        dats['Buffering Time'] = [];
        var holders = [[],[],[],[],[],[]];
        var buckets = ['none', '0_05', '05_1', '1_15', '15_3', '3_plus'];
        var namings = ['0.0% Duration', '0.0%-0.5% Duration', '0.5%-1.0% Duration', '1.0%-1.5% Duration', '1.5%-3.0% Duration', '>3% Duration'];

        $.each(data, function( key, value ) {
             for (var i = 0; i < buckets.length; i++) {
                holders[i].push([value['start_datetime_ts'] * 1000, value[buckets[i]]])
            }
        });

        for (var i = 0; i < buckets.length; i++) {
            dats['Buffering Time'].push({
                idx:i,
                data: holders[i],
                label: namings[i],
                color: colorArray6[i],
            })
        }

        $('#Buffering-Time').attr('href', '#modal-dialog-trend');
        $('#Buffering-Time').html('<font color="#fff">View Details <i class="fa fa-arrow-circle-o-right"></i></font>');
    });


    $.getJSON('/aggregated/video_buffering_events', function(data) {

        dats['Buffering Events'] = [];
        var holders = [[],[],[],[],[],[]];
        var buckets = ['none', '0_005', '005_01', '01_02', '02_04', '04_plus'];
        var namings = ['0 Events', '0.05 Events', '0.05-0.1 Events', '0.1-0.2 Events', '0.2-0.4 Events', '>0.4 Events'];

        $.each(data, function( key, value ) {
             for (var i = 0; i < buckets.length; i++) {
                holders[i].push([value['start_datetime_ts'] * 1000, value[buckets[i]]])
            }
        });

        for (var i = 0; i < buckets.length; i++) {
            dats['Buffering Events'].push({
                idx:i,
                data: holders[i],
                label: namings[i],
                color: colorArray6[i],
            })
        }

        $('#Buffering-Events').attr('href', '#modal-dialog-trend');
        $('#Buffering-Events').html('<font color="#fff">View Details <i class="fa fa-arrow-circle-o-right"></i></font>');
    });


    $.getJSON('/aggregated/video_bitrate_downshifts', function(data) {

        dats['Downshifts'] = [];
        var holders = [[],[],[],[],[],[]];
        var buckets = ['none', '0_01', '01_05', '05_1', '1_2', '2_plus'];
        var namings = ['0.0% Shifts', '0.0%-0.1% Shifts', '0.1%-0.5% Shifts', '0.5%-1.0% Shifts', '1.0%-2.0% Shifts', '> 2% Shifts'];

        $.each(data, function( key, value ) {
             for (var i = 0; i < buckets.length; i++) {
                holders[i].push([value['start_datetime_ts'] * 1000, value[buckets[i]]])
            }
        });

        for (var i = 0; i < buckets.length; i++) {
            dats['Downshifts'].push({
                idx:i,
                data: holders[i],
                label: namings[i],
                color: colorArray6[i],
            })
        }

        $('#Downshifts').attr('href', '#modal-dialog-trend');
        $('#Downshifts').html('<font color="#fff">View Details <i class="fa fa-arrow-circle-o-right"></i></font>');
    });

}

$('.apply-filters').click(function() {

    removeItem('SS', filters)
    removeItem('HLS', filters)
    removeItem('VOD', filters)
    removeItem('Live', filters)

    if($('#video-types').find(":selected").val() != "") {
        filters.push('VOD')
        filters.push('Live')
        removeItem($('#video-types').find(":selected").val(), filters)
    }

    if($('#stream-types').find(":selected").val() != "") {
        filters.push('SS')
        filters.push('HLS')
        removeItem($('#stream-types').find(":selected").val(), filters)
    }

    //console.log(filters);

    clearTimeout(timer);
    timer = setTimeout(updatePanels, 500);

    updateDevices();

    handleReloadPanel('#index-1', true);
    handleReloadPanel('#index-2', true);
    handleReloadPanel('#index-3', true);
    handleReloadPanel('#index-4', true);
    handleReloadPanel('#index-5', true);
    handleReloadPanel('#index-6', true);
});

var Dashboard = function () {
	"use strict";
    return {

        //----script loadings

        init: function () {

            $.getScript('assets/plugins/sparkline/jquery.sparkline.js').done(function() {
                handleDashboardSparkline();
            });

            $.getScript('assets/plugins/flot/jquery.flot.min.js').done(function() {
                $.getScript('assets/plugins/flot/jquery.flot.time.min.js').done(function() {
                    $.getScript('assets/plugins/flot/jquery.flot.resize.js').done(function() {
                        $.getScript('assets/plugins/flot/jquery.flot.pie.min.js').done(function() {

                            updatePanels();
                            updateDialogs();
                            updateDevices();
                            updateBarCharts();

                            $('.modal-d').click(function() {
                                var name = this.id.replace('-', ' ');
                                $('#mod-name').html(name)
                                $("#interactive-chart").attr('style', 'width:700px; height:330px; float:right');
                                plot = $.plot($("#interactive-chart"), dats[name], {                                
                                    xaxis: {  mode:"time" },
                                    yaxis: {  ticks: 10, tickColor: '#ddd' },
                                    grid: {
                                        hoverable: true,
                                        clickable: true,
                                        tickColor: "#ddd",
                                        borderWidth: 1,
                                        backgroundColor: '#fff',
                                        borderColor: '#ddd'
                                    },   
                                    series: {
                                        lines: { show: true, fill:false, lineWidth: 2 },
                                        points: { show: true, radius: 2, fillColor: white },
                                    },
                                    legend: {
                                        placement: 'outsideGrid', 
                                        container: $('#modal-legend'),
                                        labelBoxBorderColor: '#ddd',
                                        noColumns: dats[name].length,
                                        show: true,
                                        labelFormatter: function(label, series) {
                                            return '<a class="simpleLink" href="javascript:togglePlot(\''+label+'\');">'+label+'</a>';
                                        }                                        
                                    }                                    
                                });
                                enableTooltip('#interactive-chart', '%');
                            });
                        });
                    });
                });
            });

        //---script loaded

        }
    }
}();
