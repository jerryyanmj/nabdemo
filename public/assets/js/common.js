
var blue        = '#348fe2',
    blueLight   = '#5da5e8',
    blueDark    = '#1993E4',
    aqua        = '#49b6d6',
    aquaLight   = '#6dc5de',
    aquaDark    = '#3a92ab',
    green       = '#00acac',
    greenLight  = '#33bdbd',
    greenDark   = '#008a8a',
    orange      = '#f59c1a',
    orangeLight = '#f7b048',
    orangeDark  = '#c2610b',
    dark        = '#2d353c',
    grey        = '#b6c2c9',
    white       = '#ffffff',
    purple      = '#727cb6',
    purpleLight = '#8e96c5',
    purpleDark  = '#5b6392',
    purpleDeep  = '#2d353c',
    redLight    = '#ff5b57';
    redDark     = '#a53838';

var colorArray6 = [purpleDark, purpleLight, orangeLight, orangeDark, redLight, redDark];
var colorArray5 = [purpleDark, purpleLight, orangeLight, redLight, redDark];
var colorArray3 = [purpleDark, orangeLight, redLight];

var smartLegend = JSON.parse($.cookie("smartLegend"));

var showTooltip = function (x, y, contents) {
    $('<div id="tooltip" class="flot-tooltip">' + contents + '</div>').css( {
        top: y + 5,
        left: x + 5
    }).appendTo("body").fadeIn(500);
}

var centerPosition = function (target, dynamic) {
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

var enableTooltip = function (target, metric) {
    var previousPoint = null;
    $(target).bind("plothover", function (event, pos, item) {
        pos.x = pos.x || pos.pageX;
        pos.y = pos.y || pos.pageY;
        $("#x").text(pos.x.toFixed(2));
        $("#y").text(pos.y.toFixed(2));
        if (item) {
            if (previousPoint !== item.dataIndex || item.seriesIndex) {
                previousPoint = item.dataIndex || item.seriesIndex;
                $("#tooltip").remove();
                var m = metric || '';
                var y = Math.round(item.datapoint[1]);
                if(isNaN(y)) {y = Math.round(item.datapoint[0])}
                var content = item.series.label + ": " + y + m;
                showTooltip(item.pageX || pos.pageX, item.pageY || pos.pageY, content);
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
        event.preventDefault();
    });

    $(target).mouseleave(function() {
        var e = jQuery.Event('mousemove');
        e.pageX = 1;
        e.pageY = 1;
        $(target + ' canvas').trigger(e);
    });
}

var removeItem = function (item, arr) {
    var index = arr.indexOf(item);
    if (index >= 0) {
        arr.splice(index, 1);
    }
}

var plot = null;
var togglePlot = function(label) {

    var data = plot.getData();
    var seriesIdx = 0;

    for (var i = 0; i < data.length; i++) {  
        if(data[i].label == label) {
            seriesIdx = i;
        }
    }

    data[seriesIdx].lines.show = !data[seriesIdx].lines.show;
    data[seriesIdx].points.show = !data[seriesIdx].points.show;

    plot.setData(data);
    plot.draw();
}

var getRandom = function (min, max) {
    return Math.random() * (max - min) + min;
}
