
/* 01. JQuery alterClass function
------------------------------------------------ */

(function ($) {
    $.fn.removePrefixedClasses = function (prefix) {
        var classNames = $(this).attr('class').split(' '),
            className,
            newClassNames = [],
            i;
        //loop class names
        for(i = 0; i < classNames.length; i++) {
            className = classNames[i];
            // if prefix not found at the beggining of class name
            if(className.indexOf(prefix) !== 0) {
                newClassNames.push(className);
                continue;
            }
        }
        // write new list excluding filtered classNames
        $(this).attr('class', newClassNames.join(' '));
    };
}(jQuery));


/* 01. Handle Scrollbar
------------------------------------------------ */
var handleSlimScroll = function() {
    "use strict";
    $('[data-scrollbar=true]').each( function() {
        generateSlimScroll($(this));
    });
};
var generateSlimScroll = function(element) {
    var dataHeight = $(element).attr('data-height');
        dataHeight = (!dataHeight) ? $(element).height() : dataHeight;

    var scrollBarOption = {
        height: dataHeight,
        alwaysVisible: true
    };
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        scrollBarOption.wheelStep = 3;
        scrollBarOption.touchScrollStep = 100;
    }
    $(element).slimScroll(scrollBarOption);
};


/* 02. Handle Sidebar - Menu
------------------------------------------------ */
var handleSidebarMenu = function() {
    "use strict";
    $('.sidebar .nav > .has-sub > a').click(function() {
        var target = $(this).next('.sub-menu');
        var otherMenu = '.sidebar .nav > li.has-sub > .sub-menu';

        if ($('.page-sidebar-minified').length === 0) {
            $(otherMenu).not(target).slideUp(250, function() {
                $(this).closest('li').removeClass('expand');
            });
            $(target).slideToggle(250, function() {
                var targetLi = $(this).closest('li');
                if ($(targetLi).hasClass('expand')) {
                    $(targetLi).removeClass('expand');
                } else {
                    $(targetLi).addClass('expand');
                }
            });
        }
    });
    $('.sidebar .nav > .has-sub .sub-menu li.has-sub > a').click(function() {
        if ($('.page-sidebar-minified').length === 0) {
            var target = $(this).next('.sub-menu');
            $(target).slideToggle(250);
        }
    });
};


/* 03. Handle Sidebar - Mobile View Toggle
------------------------------------------------ */
var handleMobileSidebarToggle = function() {
    var sidebarProgress = false;
    $('.sidebar').on('click touchstart', function(e) {
        if ($(e.target).closest('.sidebar').length !== 0) {
            sidebarProgress = true;
        } else {
            sidebarProgress = false;
            e.stopPropagation();
        }
    });

    $(document).on('click touchstart', function(e) {
        if ($(e.target).closest('.sidebar').length === 0) {
            sidebarProgress = false;
        }
        if (!e.isPropagationStopped() && sidebarProgress !== true) {
            if ($('#page-container').hasClass('page-sidebar-toggled')) {
                sidebarProgress = true;
                $('#page-container').removeClass('page-sidebar-toggled');
            }
            if ($(window).width() < 979) {
                if ($('#page-container').hasClass('page-with-two-sidebar')) {
                    sidebarProgress = true;
                    $('#page-container').removeClass('page-right-sidebar-toggled');
                }
            }
        }
    });

    $('[data-click=right-sidebar-toggled]').click(function(e) {
        e.stopPropagation();
        var targetContainer = '#page-container';
        var targetClass = 'page-right-sidebar-collapsed';
            targetClass = ($(window).width() < 979) ? 'page-right-sidebar-toggled' : targetClass;
        if ($(targetContainer).hasClass(targetClass)) {
            $(targetContainer).removeClass(targetClass);
        } else if (sidebarProgress !== true) {
            $(targetContainer).addClass(targetClass);
        } else {
            sidebarProgress = false;
        }
        if ($(window).width() < 480) {
            $('#page-container').removeClass('page-sidebar-toggled');
        }
    });

    $('[data-click=sidebar-toggled]').click(function(e) {
        e.stopPropagation();
        var sidebarClass = 'page-sidebar-toggled';
        var targetContainer = '#page-container';

        if ($(targetContainer).hasClass(sidebarClass)) {
            $(targetContainer).removeClass(sidebarClass);
        } else if (sidebarProgress !== true) {
            $(targetContainer).addClass(sidebarClass);
        } else {
            sidebarProgress = false;
        }
        if ($(window).width() < 480) {
            $('#page-container').removeClass('page-right-sidebar-toggled');
        }
    });
};


/* 04. Handle Sidebar - Minify / Expand
------------------------------------------------ */
var handleSidebarMinify = function() {
    $('[data-click=sidebar-minify]').click(function(e) {
        e.preventDefault();
        var sidebarClass = 'page-sidebar-minified';
        var targetContainer = '#page-container';
        if ($(targetContainer).hasClass(sidebarClass)) {
            $(targetContainer).removeClass(sidebarClass);
            if ($(targetContainer).hasClass('page-sidebar-fixed')) {
                generateSlimScroll($('#sidebar [data-scrollbar="true"]'));
            }
        } else {
            $(targetContainer).addClass(sidebarClass);
            if ($(targetContainer).hasClass('page-sidebar-fixed')) {
                $('#sidebar [data-scrollbar="true"]').slimScroll({destroy: true});
                $('#sidebar [data-scrollbar="true"]').removeAttr('style');
            }
            // firefox bugfix
            $('#sidebar [data-scrollbar=true]').trigger('mouseover');
        }
        $(window).trigger('resize');
    });
};


/* 05. Handle Page Load - Fade in
------------------------------------------------ */
var handlePageContentView = function() {
    "use strict";
    $.when($('#page-loader').addClass('hide')).done(function() {
        $('#page-container').addClass('in');
    });
};

var handleReloadPanel = function(id, loop) {
    var target = $(id).closest('.panel');
    if (!$(target).hasClass('panel-loading')) {
        var targetBody = $(target).find('.panel-body');
        var spinnerHtml = '<div class="panel-loader"><span class="spinner-small"></span></div>';
        $(target).addClass('panel-loading');
        $(targetBody).prepend(spinnerHtml);
        if(!loop) {
            setTimeout(function() {
                $(target).removeClass('panel-loading');
                $(target).find('.panel-loader').remove();
            }, 2000);
        }
    }
}


/* 06. Handle Panel - Remove / Reload / Collapse / Expand
------------------------------------------------ */
var handlePanelAction = function() {
    "use strict";

    // remove
    $('[data-click=panel-remove]').hover(function() {
        $(this).tooltip({
            title: 'Show / Hide',
            placement: 'bottom',
            trigger: 'hover',
            container: 'body'
        });
        $(this).tooltip('show');
    });
    $('[data-click=panel-remove]').click(function(e) {
        e.preventDefault();
        $(this).closest('.panel').find('.panel-body').slideToggle();
        //$(this).tooltip('destroy');
        //$(this).closest('.panel').remove();
    });

    // collapse
    $('[data-click=panel-collapse]').hover(function() {
        $(this).tooltip({
            title: 'Alter Legend',
            placement: 'bottom',
            trigger: 'hover',
            container: 'body'
        });
        $(this).tooltip('show');
    });
    $('[data-click=panel-collapse]').click(function(e) {
        e.preventDefault();
        if($(this).closest('.panel').find('.dynamic').length == 0) {
            $(this).closest('.panel').find('.holder').toggle("slide",{direction: "up"})
        }
        else {
            if($(this).closest('.panel').find('.lg table tr:odd').css('display') == 'table-row') {
                $(this).closest('.panel').find('.holder').hide("slide",{direction: "up"}, function() {
                    $(this).closest('.panel').find('.lg table tr:odd').hide();
                    $(this).closest('.panel').find('.holder').removeClass('trigered');
                });
            }
            else {
                if($(this).closest('.panel').find('.holder').css('display') == 'block') {
                    $(this).closest('.panel').find('.lg table tr:odd').show();
                    $(this).closest('.panel').find('.lg .holder').addClass('trigered');
                }
                else {
                    $(this).closest('.panel').find('.holder').show("slide",{direction: "up"})
                }
            }
        }
    });

    // reload
    $('[data-click=panel-reload]').hover(function() {
        $(this).tooltip({
            title: 'Reload',
            placement: 'bottom',
            trigger: 'hover',
            container: 'body'
        });
        $(this).tooltip('show');
    });
    $('[data-click=panel-reload]').click(function(e) {
        e.preventDefault();
        handleReloadPanel(this);
    });

    // expand
    $('[data-click=panel-expand]').hover(function() {
        $(this).tooltip({
            title: 'Expand / Compress',
            placement: 'bottom',
            trigger: 'hover',
            container: 'body'
        });
        $(this).tooltip('show');
    });
    $('[data-click=panel-expand]').click(function(e) {
        e.preventDefault();
        var target = $(this).closest('.panel');
        var targetBody = $(target).find('.panel-body');
        var targetTop = 40;
        if ($(targetBody).length !== 0) {
            var targetOffsetTop = $(target).offset().top;
            var targetBodyOffsetTop = $(targetBody).offset().top;
            targetTop = targetBodyOffsetTop - targetOffsetTop;
        }

        if ($('body').hasClass('panel-expand') && $(target).hasClass('panel-expand')) {
            $('body, .panel').removeClass('panel-expand');
            $('.panel').removeAttr('style');
            $(targetBody).removeAttr('style');
        } else {
            $('body').addClass('panel-expand');
            $(this).closest('.panel').addClass('panel-expand');

            if ($(targetBody).length !== 0 && targetTop != 40) {
                var finalHeight = 40;
                $(target).find(' > *').each(function() {
                    var targetClass = $(this).attr('class');

                    if (targetClass != 'panel-heading' && targetClass != 'panel-body') {
                        finalHeight += $(this).height() + 30;
                    }
                });
                if (finalHeight != 40) {
                    $(targetBody).css('top', finalHeight + 'px');
                }
            }
        }
        $(window).trigger('resize');
    });
};


/* 07. Handle Panel - Draggable
------------------------------------------------ */
var handleDraggablePanel = function() {
    "use strict";
    var target = $('.panel').parent('[class*=col]');
    var targetHandle = '.panel-heading';
    var connectedTarget = '.row > [class*=col]';

    $(target).sortable({
        handle: targetHandle,
        connectWith: connectedTarget,
        stop: function(event, ui) {
            ui.item.find('.panel-title').append('<i class="fa fa-refresh fa-spin m-l-5" data-id="title-spinner"></i>');
            handleSavePanelPosition(ui.item);
        }
    });
};


/* 08. Handle Tooltip & Popover Activation
------------------------------------------------ */
var handelTooltipPopoverActivation = function() {
    "use strict";
    $('[data-toggle=tooltip]').tooltip();
    $('[data-toggle=popover]').popover();
};


/* 09. Handle Scroll to Top Button Activation
------------------------------------------------ */
var handleScrollToTopButton = function() {
    "use strict";
    $(document).scroll( function() {
        var totalScroll = $(document).scrollTop();

        if (totalScroll >= 200) {
            $('[data-click=scroll-top]').addClass('in');
        } else {
            $('[data-click=scroll-top]').removeClass('in');
        }
    });

    $('[data-click=scroll-top]').click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 500);
    });
};


/* 10. Handle Theme & Page Structure Configuration
------------------------------------------------ */
var handleThemePageStructureControl = function() {
    // COOKIE - Theme File Setting
    if ($.cookie && $.cookie('theme')) {
        if ($('.theme-list').length !== 0) {
            $('.theme-list [data-theme]').closest('li').removeClass('active');
            $('.theme-list [data-theme="'+ $.cookie('theme') +'"]').closest('li').addClass('active');
        }
        var cssFileSrc = 'assets/css/theme/' + $.cookie('theme') + '.css';
        $('#theme').attr('href', cssFileSrc);
    }

    // COOKIE - Sidebar Styling Setting
    if ($.cookie && $.cookie('sidebar-styling')) {
        if ($('.sidebar').length !== 0 && $.cookie('sidebar-styling') == 'grid') {
            $('.sidebar').addClass('sidebar-grid');
            $('[name=sidebar-styling] option[value="2"]').prop('selected', true);
        }
    }

    // COOKIE - Header Setting
    if ($.cookie && $.cookie('header-styling')) {
        if ($('.header').length !== 0 && $.cookie('header-styling') == 'navbar-inverse') {
            $('.header').addClass('navbar-inverse');
            $('[name=header-styling] option[value="2"]').prop('selected', true);
        }
    }

    // COOKIE - Gradient Setting
    if ($.cookie && $.cookie('content-gradient')) {
        if ($('#page-container').length !== 0 && $.cookie('content-gradient') == 'enabled') {
            $('#page-container').addClass('gradient-enabled');
            $('[name=content-gradient] option[value="2"]').prop('selected', true);
        }
    }

    // COOKIE - Content Styling Setting
    if ($.cookie && $.cookie('content-styling')) {
        if ($('body').length !== 0 && $.cookie('content-styling') == 'black') {
            $('body').addClass('flat-black');
            $('[name=content-styling] option[value="2"]').prop('selected', true);
        }
    }

    // THEME - theme selection
    $('.theme-list [data-theme]').live('click', function() {
        var cssFileSrc = 'assets/css/theme/' + $(this).attr('data-theme') + '.css';
        $('#theme').attr('href', cssFileSrc);
        $('.theme-list [data-theme]').not(this).closest('li').removeClass('active');
        $(this).closest('li').addClass('active');
        $.cookie('theme', $(this).attr('data-theme'));
    });

    // HEADER - inverse or default
    $('.theme-panel [name=header-styling]').live('change', function() {
        var targetClassAdd = ($(this).val() == 1) ? 'navbar-default' : 'navbar-inverse';
        var targetClassRemove = ($(this).val() == 1) ? 'navbar-inverse' : 'navbar-default';
        $('#header').removeClass(targetClassRemove).addClass(targetClassAdd);
        $.cookie('header-styling',targetClassAdd);
    });

    // SIDEBAR - grid or default
    $('.theme-panel [name=sidebar-styling]').live('change', function() {
        if ($(this).val() == 2) {
            $('#sidebar').addClass('sidebar-grid');
            $.cookie('sidebar-styling', 'grid');
        } else {
            $('#sidebar').removeClass('sidebar-grid');
            $.cookie('sidebar-styling', 'default');
        }
    });

    // CONTENT - gradient enabled or disabled
    $('.theme-panel [name=content-gradient]').live('change', function() {
        if ($(this).val() == 2) {
            $('#page-container').addClass('gradient-enabled');
            $.cookie('content-gradient', 'enabled');
        } else {
            $('#page-container').removeClass('gradient-enabled');
            $.cookie('content-gradient', 'disabled');
        }
    });

    // CONTENT - default or black
    $('.theme-panel [name=content-styling]').live('change', function() {
        if ($(this).val() == 2) {
            $('body').addClass('flat-black');
            $.cookie('content-styling', 'black');
        } else {
            $('body').removeClass('flat-black');
            $.cookie('content-styling', 'default');
        }
    });

    // SIDEBAR - fixed or default
    $('.theme-panel [name=sidebar-fixed]').live('change', function() {
        if ($(this).val() == 1) {
            if ($('.theme-panel [name=header-fixed]').val() == 2) {
                alert('Default Header with Fixed Sidebar option is not supported. Proceed with Fixed Header with Fixed Sidebar.');
                $('.theme-panel [name=header-fixed] option[value="1"]').prop('selected', true);
                $('#header').addClass('navbar-fixed-top');
                $('#page-container').addClass('page-header-fixed');
            }
            $('#page-container').addClass('page-sidebar-fixed');
            if (!$('#page-container').hasClass('page-sidebar-minified')) {
                generateSlimScroll($('.sidebar [data-scrollbar="true"]'));
            }
        } else {
            $('#page-container').removeClass('page-sidebar-fixed');
            if ($('.sidebar .slimScrollDiv').length !== 0) {
                if ($(window).width() <= 979) {
                    $('.sidebar').each(function() {
                        if (!($('#page-container').hasClass('page-with-two-sidebar') && $(this).hasClass('sidebar-right'))) {
                            $(this).find('.slimScrollBar').remove();
                            $(this).find('.slimScrollRail').remove();
                            $(this).find('[data-scrollbar="true"]').removeAttr('style');
                            var targetElement = $(this).find('[data-scrollbar="true"]').parent();
                            var targetHtml = $(targetElement).html();
                            $(targetElement).replaceWith(targetHtml);
                        }
                    });
                } else if ($(window).width() > 979) {
                    $('.sidebar [data-scrollbar="true"]').slimScroll({destroy: true});
                    $('.sidebar [data-scrollbar="true"]').removeAttr('style');
                }
            }
            if ($('#page-container .sidebar-bg').length === 0) {
                $('#page-container').append('<div class="sidebar-bg"></div>');
            }
        }
    });

    // HEADER - fixed or default
    $('.theme-panel [name=header-fixed]').live('change', function() {
        if ($(this).val() == 1) {
            $('#header').addClass('navbar-fixed-top');
            $('#page-container').addClass('page-header-fixed');
            $.cookie('header-fixed', true);
        } else {
            if ($('.theme-panel [name=sidebar-fixed]').val() == 1) {
                alert('Default Header with Fixed Sidebar option is not supported. Proceed with Default Header with Default Sidebar.');
                $('.theme-panel [name=sidebar-fixed] option[value="2"]').prop('selected', true);
                $('#page-container').removeClass('page-sidebar-fixed');
                if ($('#page-container .sidebar-bg').length === 0) {
                    $('#page-container').append('<div class="sidebar-bg"></div>');
                }
            }
            $('#header').removeClass('navbar-fixed-top');
            $('#page-container').removeClass('page-header-fixed');
            $.cookie('header-fixed', false);
        }
    });
};


/* 11. Handle Theme Panel Expand
------------------------------------------------ */
var handleThemePanelExpand = function() {
    $('[data-click="theme-panel-expand"]').live('click', function() {
        var targetContainer = '.theme-panel';
        var targetClass = 'active';
        if ($(targetContainer).hasClass(targetClass)) {
            $(targetContainer).removeClass(targetClass);
        } else {
            $(targetContainer).addClass(targetClass);
        }
    });
};


/* 12. Handle After Page Load Add Class Function
------------------------------------------------ */
var handleAfterPageLoadAddClass = function() {
    if ($('[data-pageload-addclass]').length !== 0) {
        $(window).load(function() {
            $('[data-pageload-addclass]').each(function() {
                var targetClass = $(this).attr('data-pageload-addclass');
                $(this).addClass(targetClass);
            });
        });
    }
};


/* 13. Handle Save Panel Position Function
------------------------------------------------ */
var handleSavePanelPosition = function(element) {
    "use strict";
    if ($('.ui-sortable').length !== 0) {
        var newValue = [];
        var index = 0;
        $.when($('.ui-sortable').each(function() {
            var panelSortableElement = $(this).find('[data-sortable-id]');
            if (panelSortableElement.length !== 0) {
                var columnValue = [];
                $(panelSortableElement).each(function() {
                    var targetSortId = $(this).attr('data-sortable-id');
                    columnValue.push({id: targetSortId});
                });
                newValue.push(columnValue);
            } else {
                newValue.push([]);
            }
            index++;
        })).done(function() {
            var targetPage = window.location.href;
                targetPage = targetPage.split('?');
                targetPage = targetPage[0];
            localStorage.setItem(targetPage, JSON.stringify(newValue));
            $(element).find('[data-id="title-spinner"]').delay(500).fadeOut(500, function() {
                $(this).remove();
            });
        });
    }
};


/* 14. Handle Draggable Panel Local Storage Function
------------------------------------------------ */
var handleLocalStorage = function() {
    "use strict";
    if (typeof(Storage) !== 'undefined') {
        var targetPage = window.location.href;
            targetPage = targetPage.split('?');
            targetPage = targetPage[0];
        var panelPositionData = localStorage.getItem(targetPage);


        if ($.cookie("smartLegend") == null) {
            $.cookie("smartLegend", false, { expires: 90 });
        }

        if(!JSON.parse($.cookie("smartLegend"))) {
            $("#smart-legend-switch").removeAttr('checked');
        }

        $('#saveSettings').click(function() {
            var val = $('#smart-legend-switch').is(":checked");
            $.cookie("smartLegend", val, { expires: 90 })
            window.location.reload();
        });


        if (panelPositionData) {
            panelPositionData = JSON.parse(panelPositionData);
            var i = 0;
            $('.panel').parent('[class*="col-"]').each(function() {
                var storageData = panelPositionData[i];
                if(!panelPositionData[i]) {
                    window.localStorage.clear();
                    window.location.reload();
                }
                var targetColumn = $(this);
                $.each(storageData, function(index, data) {
                    var targetId = '[data-sortable-id="'+ data.id +'"]';
                    if ($(targetId).length !== 0) {
                        var targetHtml = $(targetId).clone();
                        $(targetId).remove();
                        $(targetColumn).append(targetHtml);
                    }
                });
                i++;
            });
        }
    } else {
        alert('Your browser is not supported with the local storage');
    }
};


/* 15. Handle Reset Local Storage
------------------------------------------------ */
var handleResetLocalStorage = function() {
    "use strict";
    $('[data-click=reset-local-storage]').live('click', function(e) {
        e.preventDefault();

        var targetModalHtml = ''+
        '<div class="modal fade" data-modal-id="reset-local-storage-confirmation">'+
        '    <div class="modal-dialog">'+
        '        <div class="modal-content">'+
        '            <div class="modal-header">'+
        '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
        '                <h4 class="modal-title"><i class="fa fa-refresh m-r-5"></i> Reset Local Storage Confirmation</h4>'+
        '            </div>'+
        '            <div class="modal-body">'+
        '                <div class="alert alert-info m-b-0">Would you like to RESET all your saved widgets and clear Local Storage?</div>'+
        '            </div>'+
        '            <div class="modal-footer">'+
        '                <a href="javascript:;" class="btn btn-sm btn-white" data-dismiss="modal"><i class="fa fa-close"></i> No</a>'+
        '                <a href="javascript:;" class="btn btn-sm btn-inverse" data-click="confirm-reset-local-storage"><i class="fa fa-check"></i> Yes</a>'+
        '            </div>'+
        '        </div>'+
        '    </div>'+
        '</div>';

        $('body').append(targetModalHtml);
        $('[data-modal-id="reset-local-storage-confirmation"]').modal('show');
    });
    $('[data-modal-id="reset-local-storage-confirmation"]').live('hidden.bs.modal', function() {
        $('[data-modal-id="reset-local-storage-confirmation"]').remove();
    });
    $('[data-click=confirm-reset-local-storage]').live('click', function(e) {
        e.preventDefault();
        var localStorageName = window.location.href;
            localStorageName = localStorageName.split('?');
            localStorageName = localStorageName[0];
        localStorage.removeItem(localStorageName);
        window.location.href = document.URL;
        location.reload();
    });
};


/* 16. Handle Ajax Page Load
------------------------------------------------ */
var default_content = '<div class="p-t-40 p-b-40 text-center f-s-20 content"><i class="fa fa-warning fa-lg text-muted m-r-5"></i> <span class="f-w-600 text-inverse">Error 404! Page not found.</span></div>';

var handleLoadPage = function(hash) {
    var Pace = Pace || null;
    if(Pace) {
        Pace.restart();
    }
    var targetUrl = hash.replace('#','');
    $('.jvectormap-label, .jvector-label, .AutoFill_border ,#gritter-notice-wrapper, .ui-autocomplete, .colorpicker, .FixedHeader_Header, .FixedHeader_Cloned .lightboxOverlay, .lightbox').remove();
    $.ajax({
        type: 'GET',
        url: targetUrl,	//with the page number as a parameter
        dataType: 'html',	//expect html to be returned
        success: function(data) {
            $('#ajax-content').html(data);
            $('html, body').animate({
                scrollTop: $("body").offset().top
            }, 250);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#ajax-content').html(default_content);
        }
    });
};


/* 17. Handle Ajax Page Load Url
------------------------------------------------ */
var handleCheckPageLoadUrl = function(page, hash) {
    hash = (hash) ? hash : '#ajax/' + page + ".html";

    if (hash === '') {
        $('#ajax-content').html(default_content);
    } else {
        $('.sidebar [href="'+hash+'"][data-toggle=ajax]').trigger('click');
        handleLoadPage(hash);
    }
};


/* 18. Handle Ajax Sidebar Toggle Content
------------------------------------------------ */
var handleSidebarAjaxClick = function() {

    var url = window.location;
    // Will only work if string in href matches with location
    $('ul.nav a[href="'+ url +'"]').parent().addClass('active');

    // Will also work for relative and absolute hrefs
    $('ul.nav a').filter(function() {
        return this.href == url;
    }).parent().addClass('active');

    $('.sidebar [data-toggle=ajax]').click(function() {
        var targetLi = $(this).closest('li');
        var targetParentLi = $(this).parents();
        $('.sidebar li').not(targetLi).not(targetParentLi).removeClass('active');
        $(targetLi).addClass('active');
        $(targetParentLi).addClass('active');
    });
};


/* 19. Handle Url Hash Change
------------------------------------------------ */
var handleHashChange = function() {
    $(window).hashchange(function() {
        handleLoadPage(window.location.hash);
    });
};


/* 20. Handle Pace Page Loading Plugins
------------------------------------------------ */
var handlePaceLoadingPlugins = function() {
    var Pace = Pace || null;
    if(Pace) {
        Pace.on('hide', function(){
            $('.pace').addClass('hide');
        });
    }
};


/* 21. Handle IE Full Height Page Compatibility
------------------------------------------------ */
var handleIEFullHeightContent = function() {
    var userAgent = window.navigator.userAgent;
    var msie = userAgent.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        $('.vertical-box-row [data-scrollbar="true"][data-height="100%"]').each(function() {
            var targetRow = $(this).closest('.vertical-box-row');
            var targetHeight = $(targetRow).height();
            $(targetRow).find('.vertical-box-cell').height(targetHeight);
        });
    }
};


/* 22. Handle Unlimited Nav Tabs
------------------------------------------------ */
var handleUnlimitedTabsRender = function() {

    // function handle tab overflow scroll width
    function handleTabOverflowScrollWidth(obj, animationSpeed) {
        var marginLeft = parseInt($(obj).css('margin-left'));
        var viewWidth = $(obj).width();
        var prevWidth = $(obj).find('li.active').width();
        var speed = (animationSpeed > -1) ? animationSpeed : 150;
        var fullWidth = 0;

        $(obj).find('li.active').prevAll().each(function() {
            prevWidth += $(this).width();
        });

        $(obj).find('li').each(function() {
            fullWidth += $(this).width();
        });

        if (prevWidth >= viewWidth) {
            var finalScrollWidth = prevWidth - viewWidth;
            if (fullWidth != prevWidth) {
                finalScrollWidth += 40;
            }
            $(obj).find('.nav.nav-tabs').animate({ marginLeft: '-' + finalScrollWidth + 'px'}, speed);
        }

        if (prevWidth != fullWidth && fullWidth >= viewWidth) {
            $(obj).addClass('overflow-right');
        } else {
            $(obj).removeClass('overflow-right');
        }

        if (prevWidth >= viewWidth && fullWidth >= viewWidth) {
            $(obj).addClass('overflow-left');
        } else {
            $(obj).removeClass('overflow-left');
        }
    }

    // function handle tab button action - next / prev
    function handleTabButtonAction(element, direction) {
        var obj = $(element).closest('.tab-overflow');
        var marginLeft = parseInt($(obj).find('.nav.nav-tabs').css('margin-left'));
        var containerWidth = $(obj).width();
        var totalWidth = 0;
        var finalScrollWidth = 0;

        $(obj).find('li').each(function() {
            if (!$(this).hasClass('next-button') && !$(this).hasClass('prev-button')) {
                totalWidth += $(this).width();
            }
        });

        switch (direction) {
            case 'next':
                var widthLeft = totalWidth + marginLeft - containerWidth;
                if (widthLeft <= containerWidth) {
                    finalScrollWidth = widthLeft - marginLeft;
                    setTimeout(function() {
                        $(obj).removeClass('overflow-right');
                    }, 150);
                } else {
                    finalScrollWidth = containerWidth - marginLeft - 80;
                }

                if (finalScrollWidth != 0) {
                    $(obj).find('.nav.nav-tabs').animate({ marginLeft: '-' + finalScrollWidth + 'px'}, 150, function() {
                        $(obj).addClass('overflow-left');
                    });
                }
                break;
            case 'prev':
                var widthLeft = -marginLeft;

                if (widthLeft <= containerWidth) {
                    $(obj).removeClass('overflow-left');
                    finalScrollWidth = 0;
                } else {
                    finalScrollWidth = widthLeft - containerWidth + 80;
                }
                $(obj).find('.nav.nav-tabs').animate({ marginLeft: '-' + finalScrollWidth + 'px'}, 150, function() {
                    $(obj).addClass('overflow-right');
                });
                break;
        }
    }

    // handle page load active tab focus
    function handlePageLoadTabFocus() {
        $('.tab-overflow').each(function() {
            var targetWidth = $(this).width();
            var targetInnerWidth = 0;
            var targetTab = $(this);
            var scrollWidth = targetWidth;

            $(targetTab).find('li').each(function() {
                var targetLi = $(this);
                targetInnerWidth += $(targetLi).width();

                if ($(targetLi).hasClass('active') && targetInnerWidth > targetWidth) {
                    scrollWidth -= targetInnerWidth;
                }
            });

            handleTabOverflowScrollWidth(this, 0);
        });
    }

    // handle tab next button click action
    $('[data-click="next-tab"]').live('click', function(e) {
        e.preventDefault();
        handleTabButtonAction(this,'next');
    });

    // handle tab prev button click action
    $('[data-click="prev-tab"]').live('click', function(e) {
        e.preventDefault();
        handleTabButtonAction(this,'prev');

    });

    // handle unlimited tabs responsive setting
    $(window).resize(function() {
        $('.tab-overflow .nav.nav-tabs').removeAttr('style');
        handlePageLoadTabFocus();
    });

    handlePageLoadTabFocus();
};


/* Application Controller
------------------------------------------------ */
var App = function () {
	"use strict";
	return {
		//main function
		init: function (page) {

		    // draggable panel & local storage
			handleDraggablePanel();
			handleLocalStorage();
			handleResetLocalStorage();

			// slimscroll
			handleSlimScroll();

			// panel
			handlePanelAction();

			// tooltip
			handelTooltipPopoverActivation();

			// page load
			handlePageContentView();
			handleAfterPageLoadAddClass();
			handlePaceLoadingPlugins();

			// scroll to top
			handleScrollToTopButton();

            // sidebar
            handleSidebarMenu();
            handleMobileSidebarToggle();
            handleSidebarMinify();

            // theme configuration
            handleThemePageStructureControl();
            handleThemePanelExpand();

            // ajax
            handleSidebarAjaxClick();

            if(page) {
                handleCheckPageLoadUrl(page, window.location.hash);
                handleHashChange();
            }

			// IE Compatibility
			handleIEFullHeightContent();

			// unlimited nav tabs
			handleUnlimitedTabsRender();

			// ajax cache setup
			$.ajaxSetup({
                cache: true
            });
		},
		setPageTitle: function(pageTitle) {
		    document.title = pageTitle;
		},
		restartGlobalFunction: function() {
			handleDraggablePanel();
			handleLocalStorage();
			handleSlimScroll();
			handlePanelAction();
			handelTooltipPopoverActivation();
			handleAfterPageLoadAddClass();
			handleUnlimitedTabsRender();
		}
    };
}();
