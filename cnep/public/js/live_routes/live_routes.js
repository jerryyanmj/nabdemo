/**
 * This script is used for show data for Live Routes page
 */

( function ( window, document, $, google ) {

    /**
     * Convert value from  grads to  radians
     * @returns {number}
     */
    Number.prototype.toRad = function () {

        return this * Math.PI / 180;
    }

    var Agents = function( mode ) {

        var self = this;

        self.routes = {};
        self.historicalRoutes = [];
        self.mode = mode;
        self.buffer = new Array();
        self.intervalID = 0;
        self.INTERVAL_LIMIT = 10000;

        $( document ).ready( 

            function () {

                self.onModuleLoad();

                return;
            }

        );

        return;
    };

    Agents.prototype.map = null;

    Agents.prototype.routes = null;

    Agents.prototype.oTable = null;

    Agents.prototype.mode = null;

    Agents.prototype.buffer  = null;

    Agents.prototype.get_map = function() {

        if( ! this.map )
            throw new Error( 'Map not initialized yet or failed' );

        return this.map;
    }

    Agents.prototype.get_IP = function( IPs ) {

        var result;

        if( typeof IPs !== 'undefined' && IPs ) {

            result = IPs[ 0 ];

            IPs.forEach(

                function( ip ) {

                    if( result.ProbeCount < ip.ProbeCount )
                        result = ip;

                    return;
                }

            );
        }

        return result;
    }

    Agents.prototype.distance = function( lat1, lon1, lat2, lon2 ) {

        var R = 6371; // km

        // Has a problem with the .toRad() method below.
        var x1 = lat2 - lat1;
        var dLat = x1.toRad();
        var x2 = lon2 - lon1;
        var dLon = x2.toRad();
        var a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) + Math.cos( lat1.toRad() ) * Math.cos( lat2.toRad() ) * Math.sin( dLon / 2 ) * Math.sin( dLon / 2 );
        var c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );

        return R * c;
    }

    /**
     * Calculate and returns color by ratio
     * @param {number}ratio
     * @returns {string}
     */
    Agents.prototype.color = function( ratio, latency_deviations, other ) {

        if( latency_deviations ) {
            if( latency_deviations >= 3 )
                return '#6d0000';
            else if( latency_deviations >= 1.5 )
                return '#fdbb30';
            else
                return 'green';
        } 
        else if( ratio ) {

            if( ratio >= 2 )
                return 'green';
            else if( ratio < 2 && ratio >= .5 )
                return '#fdbb30';
            else
                return '#6d0000';
        } 
        else
            return other;

    }

    /**
     * Returns true if  lookup has Latitude/Longitude and it's not 38, -97
     * @param {LocationObject} lookup
     * @deprecated
     * @returns {boolean}
     */
    Agents.prototype.is_enriched = function( lookup ) {

        // Can't draw hops if we don't know their lat/lng
        // 38,-97 is the center of the USA.. this is Maxmind's best guess
        return lookup !== undefined
            && lookup.sourceLat !== undefined && lookup.sourceLat != '' && lookup.sourceLat != 38
            && lookup.targetLat !== undefined && lookup.targetLat != '' && lookup.targetLat != 38
            && lookup.sourceLon !== undefined && lookup.sourceLon != '' && lookup.sourceLon != -97
            && lookup.targetLon !== undefined && lookup.targetLon != '' && lookup.targetLon != -97;
    }

    /**
     * Some clients have a bug which inflates hopcount. Take the lowest of hopCount and hops.length
     * @param hops
     * @returns {*}
     */
    Agents.prototype.find_last_IP = function( hops ) {

        //debugger;
        for( var i = hops.length - 1; i > 0; i-- ) {

            var ip = this.get_IP( hops[ i ].IPs );

            if( ip !== undefined )
                return ip;

        }

        return;
    }

    /**
     * Returns index in routes array if founded same route or -1
     * @param {RouteObject} a
     */
    Agents.prototype.find_match_route = function( a ) {

        var self = this;
        var key = -1;

        if( ! self.routes )
            return key;

        $.each(
            Object.keys( self.routes ),
            function( r_idx, e ) {

                var route = self.routes[e];

                // Skip undefined routes
                if( typeof route == 'undefined' || ! route.report )
                    return true;

                // Compare source location and target location
                if( route.equal( a ) ) {

                    key = e;

                    return false; // We already found one
                }

                return;
            }
        );

        return key;
    }

    /**
     * Create marker on the map
     * @param {number} lat
     * @param {number} lng
     * @param {string} name
     * @param {string} type circle or pin or img
     * @param {string} img css color or link to image
     * @param [number] zindex, marker z-index
     * @returns {google.maps.Marker}
     */
    Agents.prototype.create_marker = function( lat, lng, name, type, img, zindex ) {

        var marker;

        switch( type ) {

            case 'pin':

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng( lat, lng ),
                    map:      map,
                    title:    name
                });

                break;

            case 'circle':

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng( lat, lng ),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        strokeColor: 'black',
                        strokeOpacity: 1,
                        strokeWeight: 1,
                        fillColor: img,
                        fillOpacity: 1,
                        // map: map,
                        center: new google.maps.LatLng( lat, lng ),
                        scale: 5,
                        // radius: 4000 * ( 19 / map.zoom ),
                        title: name
                    }
                });

                break;

            case 'img':

                marker = new google.maps.Marker({
                    position: new google.maps.LatLng( lat, lng ),
                    icon: img
                });

                break;
        }

        marker.setMap( this.get_map() );

        if( typeof zindex != 'undefined' )
            marker.setZIndex( google.maps.Marker.MAX_ZINDEX + zindex );

        return marker;
    }

    /**
     * Create line between two points
     * @param {number} lat1
     * @param {number} lng1
     * @param {number} lat2
     * @param {number} lng2
     * @param {string}color
     * @param [type] line type can be dashed and solid
     * @returns {google.maps.Polyline}
     */
    Agents.prototype.add_segment = function( lat1, lng1, lat2, lng2, color, type ) {

        var p1   = new google.maps.LatLng( lat1, lng1 );
        var p2   = new google.maps.LatLng( lat2, lng2 );
        var path = null;

        if( type && type =='dashed' ) {

            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 4
            };

            path = new google.maps.Polyline({
                path: [ p1, p2 ],
                strokeColor: color,
                strokeOpacity: 0,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
                strokeWeight: 2,
                zIndex:100
            });

        } 
        else {

            path = new google.maps.Polyline({
                path: [ p1, p2 ],
                strokeColor: color,
                strokeOpacity: 1.0,
                strokeWeight: 2,
                zIndex:100
            });

        }

        path.setMap( this.get_map() );

        return path;
    }

    /**
     * Create map in map_canvas element and calling callback function after map loaded
     * @param {string} map_canvas id of map canvas element on page
     * @param {function} callback
     */
    Agents.prototype.create_map = function( map_canvas, callback ) {

        var myOptions = createGoogleMapOptions( 4 );
	
        this.map = new google.maps.Map( document.getElementById( map_canvas ), myOptions );

        this.create_controls();

        google.maps.event.addListenerOnce(
            this.map, 
            'tilesloaded', 
            function () {

                callback( this );

                return;
            }
        );

        return this.map;
    }

    Agents.prototype.init_socket = function( socket_url ) {

        var self = this;
	
        this.socket = io.connect( socket_url, { 'max reconnection attempts': Infinity, 'reconnection limit': Infinity } );

        this.socket.on(
            'historicalRoutes', 
            function( data ) {

                self.update_historical_routes( data );

                return;
            }
        );

        this.socket.on(
            'routes', 
            function( data ) {

                /* 
                var route = new RouteObject(data);
                var r_idx = self.find_match_route(route);
                if (r_idx != -1)
                    self.clear_route(r_idx);
                */
                self.append_route( data );

                return;
            }
        );

        this.socket.on(
            'live_routes_info', 
            function( data ) {

                var route = new RouteObject( data );
                var r_idx = self.find_match_route( route );

                if( r_idx != -1 )
                    self.clear_route( r_idx );

                self.append_route( route );

                return;
            }
        );

        return;
    }

    Agents.prototype.update_historical_routes = function( routes ) {

        this.historicalRoutes = routes;

        // listHistoricalRoutes();

        return;
    }

    Agents.prototype.update_route = function() {

        // TODO write your code here

        return;
    }

    Agents.prototype.append_route = function( route, routesLegth, routeIndex ) {

        var self = this;

        if( self.mode == 'realtime' && self.isProperRouteSource( route ) ) {

            $.extend( route, self.draw_route( route ) );

            route.table_row         = self.add_info( route.report );
            self.routes[ route.ID ] = route;

        }

        return;
    };

    Agents.prototype.draw_route = function( route ) {

        var self = this;
        var markers = [], polyLines = [];
        var locationInfo = route.report.locationInfo;

        if( typeof locationInfo != 'undefined' && locationInfo.is_enriched() ) {

            markers.push( self.create_marker( locationInfo.sourceLat, locationInfo.sourceLon, route.sourceIP, 'circle', 'blue', 100 ) );
            markers.push( self.create_marker( locationInfo.targetLat, locationInfo.targetLon, route.targetIP, 'circle', 'green' ) );

            polyLines.push( 
                self.add_segment(
                    locationInfo.sourceLat, 
                    locationInfo.sourceLon, 
                    locationInfo.targetLat, 
                    locationInfo.targetLon,
                    self.color(
                        locationInfo.distance / route.report.current.latency, 
                        route.report.current.latency_deviation_score || null
                    )
                )
            );

        }

        return {

            ID: route.report.sourceIP + '|' + route.report.targetIP,
            drawnAt: new Date().getTime(),
            polyLines: polyLines,
            markers: markers

        };

    }

    /**
     * Returns route tag
     * @param {LocationObject} s Source location
     * @param {LocationObject} t Target location
     */
    Agents.prototype.generate_route_tag = function( s, t ) {

        var source_tag = ( s.City == '' ) ? s.Country : s.City + ',' + s.State;
        var target_tag = ( t.City == '' ) ? t.Country : t.City + ',' + t.State;

        if( target_tag == ',' )
            target_tag = 'Unknown';

        return source_tag + '_' + target_tag;
    }

    /**
     * Drawing/redrawing dataTable
     */
    Agents.prototype.draw_table = function() {

        var self = this;

        self.oTable.fnClearTable(false);

        $.each(
            Object.keys( self.routes ), 
            function( idx, e ) {

                var route = self.routes[e];

                if( typeof route != 'undefined' )
                    if( self.isProperRouteSource( route ) /* &&( route.isTargetReached() || self.isDrawingFailureRoutes())*/ )
                        route.table_row = self.add_info(route.report);

                return;
            }
        )

        return;
    }

    Agents.prototype.update_table_record = function ( data, row ) {

        this.oTable.fnUpdate( data, row );

        return;
    }

    Agents.prototype.isDrawingFailureRoutes = function() {

        return $( '#failedRoutes' ).is( ':checked' );
    }

    Agents.prototype.redraw_routes = function() {

        var self = this;

        self.clear_routes();
	
        $.each( 
            Object.keys( self.routes ),
            function( i, e ) {

                var route = self.routes[ e ];

                if( self.isProperRouteSource( route ) ) {

                    self.draw_route( route );

                    return;
                }

                return;
            }
        )

        return;
    }

    /**
     * Add info into route info table. And Returns tag in dataTables
     * @param report
     * @returns {array}
     */
    Agents.prototype.add_info = function ( report ) {

        var self = this;

        if( typeof report == 'undefined' )
            debugger;
	
        var d = .621371 * report.locationInfo.distance;
        var RTT = Math.round( report.current.latency );
        var hopCount = report.hops.length - 1;
        var source = ( report.locationInfo.fromCity == '' || report.locationInfo.fromCity == undefined ) ? 'Unknown' : report.locationInfo.fromCity;
        var target = ( report.locationInfo.toCity == '' || report.locationInfo.toCity == undefined ) ? 'Unknown' : report.locationInfo.toCity;

        if( target == ',' )
            target = 'Unknown';

        var id  = report.sourceIP + '|' + report.targetIP;
        var a = self.oTable.fnAddData({
            0: source,
            1: target,
            2: ( ( ( report.current.latency || 'Unreachable' ) == 'Unreachable') ? 'Unreachable' : report.current.latency + ' ms' )
        })[ 0 ];

        var nTr = self.oTable.fnSettings().aoData[ a ].nTr;
        nTr.id = id;

        $( nTr ).hover(

            function () {

                self.highlight_route( $( this ).attr( 'id' ), true );

                return;
            }, 

            function () {

                self.highlight_route( $( this ).attr( 'id' ), false );

                return;
            }

        );

        $( nTr ).click(

            function () {

                self.show_route_details( $( this ).attr( 'id' ) );

                return;
            }

        );

        return  nTr;
    }

    /**
     * Clear route on map and remove routeObject from routes array
     * @param idx
     */
    Agents.prototype.clear_route = function( idx ) {

        var route = this.routes[ idx ];

        if( typeof route == 'undefined' )
            return;

        $.each(
            route.polyLines, 
            function( i, line ) {

                line.setMap( null );

                return;
            }
        );

        $.each(
            route.markers, 
            function( i, marker ) {

                marker.setMap( null );

                return;
            }
        );

        $( route.table_row ).unbind();
        this.oTable.fnDeleteRow( route.table_row );
        delete route.table_row;
        delete this.routes[ idx ];

        return;
    };

    /**
     * Clear all routes on map and remove routeObject from routes array
     */
    Agents.prototype.clear_routes = function() {

        var self = this;

        $.each(
            Object.keys( self.routes ), 
            function( index, key ) {

                var route = self.routes[ key ];

                $.each(
                    route.polyLines, 
                    function( i, line ) {

                        line.setMap( null );

                        return;
                    }
                );

                $.each(
                    route.markers, 
                    function( i, marker ) {

                        marker.setMap( null );

                        return;
                    }
                );

                $( route.table_row ).unbind();
                self.oTable.fnDeleteRow( route.table_row );
                delete route.table_row;
                delete self.routes[ key ];

                return;
            }
        );

        return;
    };

    Agents.prototype.show_route_details = function( route_id ) {

        var self = this;

        $( '#close-details' ).click(
            function() {

                $( '#details-div' ).hide();

                return;
            }
        );

        $( "#update-source" ).click(
            function() {
                $.ajax( {
                    url: '/cnep/ajax/agent/update',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        source: $( '#source' ).val(),
                        sourceIP: $( '#sourceIP' ).val(),
                        city: $( '#sourceCity' ).val(),
                        state: $( '#sourceState' ).val(),
                        dataSet: $( '#dataSet' ).val()
                    },
                    success: function( r ) {

                        console.log(r);

                        return;
                    }
                });

                return;
            }
        );

        $.each(
            Object.keys( this.routes ), 
            function( i, e ) {

                var route = self.routes[ e ];

                if( typeof route != 'undefined' && route.ID == route_id ) {

                    $( '#route-details-title' ).text( route.report.locationInfo.fromCity + ' - ' + route.report.locationInfo.toCity + ' Route Detail' );
                    $( '#source' ).val( route.report.locationInfo.fromCity );
                    $( '#sourceIP' ).val( route.report.sourceIP );
                    $( '#sourceCity' ).val( route.report.locationInfo.fromCity );
                    $( '#sourceState' ).val( '' );
                    $( '#dataSet' ).val( route.report.DataSet );

                    var t = $( '#route-details' ).dataTable(
                        {
                            bDestroy:           true, 
                            bSort:              false,
                            "info":             true,
                            "searching":        true,
                            "lengthChange":     false,
                            "pagingType":       "simple",
                            "scrollCollapse":   true,
                            "iDisplayLength":   5
                        }
                    );

                    t.fnClearTable();
                    $( '#route-details' ).css( 'width', '100%' );

                    var hopKeysLength = Object.keys( route.report.hops ).length;

                    for( var i = 1; i <= hopKeysLength; i++ ) {

                        var hop = route.report.hops[ 'hop' + i ];

                        if( typeof hop.IP != 'undefined' ) {

                            t.fnAddData( [ i, hop.IP, hop.RTT, hop.loss ], true );
                        }
                    }
                }

                return;
            }
        );

        $( '#details-div' ).show();

        return;
    }

    Agents.prototype.create_legend = function() {

        var self = this;
        var container = document.createElement( 'div' );

        container.innerHTML = "<b>Legend</b>";
        container.style.margin = '1px';
        container.style.padding = '5px';
        container.style.marginBottom = '0px';
        container.style.width = '330px';
        container.style.height = '150px';
        container.style.backgroundColor = "#222222";
        container.style.color = "#ffffff"
        container.index = 1;

        var table = document.createElement( 'table' );
        var row = table.insertRow( -1 );

        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/green_line.png" />';
        row.insertCell( -1 ).innerHTML = 'Improved or On Par';
        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/red_dashed_line.png" />';
        row.insertCell( -1 ).innerHTML = 'Destination Unreachable';
        row = table.insertRow( -1 );
        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/yellow_line.png" />';
        row.insertCell( -1 ).innerHTML = '>=1.5 STDDev Underperforming';
        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/green_dot.png" />';
        row.insertCell( -1 ).innerHTML = 'Target';
        row = table.insertRow( -1 );
        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/red_line.png" />';
        row.insertCell( -1 ).innerHTML = '>=3 STDDev Underperforming';
        row.insertCell( -1 ).innerHTML = '<img src="/cnep/imgs/blue_dot.png" />';
        row.insertCell( -1 ).innerHTML = 'Source';

        container.appendChild( table );

        return container;
    };

    Agents.prototype.create_controls = function() {

        var self = this;
        var container = document.createElement( 'div' );

        container.id = 'info';
        container.innerHTML = "Routes Displayed <br>";
        container.style.margin = '5px';
        container.style.padding = '15px';
        container.style.marginBottom = '30px';
        container.style.width = '300px';
        container.style.height = '400px';
        container.style.backgroundColor = "#222222";
        container.style.color = "#ffffff"
        container.index = 1;

        var table = document.createElement( 'table' );
        table.id = 'infoTable';

        var theader = table.createTHead();
        var row = theader.insertRow( 0 );
        row.insertCell( 0 ).innerHTML = 'RTT';
        row.insertCell( 0 ).innerHTML = 'Target';
        row.insertCell( 0 ).innerHTML = 'Source';

        container.appendChild( table );
        container.appendChild( document.createElement( 'br' ) );
        container.appendChild( document.createElement( 'br' ) );

        var radio1 = document.createElement( 'input' );
        radio1.setAttribute( 'type', 'radio' );
        radio1.setAttribute( 'name', 'group1' );
        radio1.setAttribute( 'checked', 'checked' );
        radio1.setAttribute( 'id', 'allRoutes' );
        radio1.setAttribute( 'value', 'All Routes' );
        radio1.onclick = function () {

            self.redraw_routes();
            self.draw_table();

            return;
        };

        container.appendChild( radio1 );
        container.appendChild( document.createTextNode( 'All Routes' ) );
        container.appendChild( document.createElement( 'br' ) );

        var radio2 = document.createElement( 'input' );
        radio2.setAttribute( 'type', 'radio' );
        radio2.setAttribute( 'name', 'group1' );
        radio2.setAttribute( 'value', 'My IP\'s Routes' );
        radio2.setAttribute( 'id', 'myIP' );
        radio2.onclick = function () {

            self.redraw_routes();
            self.draw_table();

            return;
        };

        container.appendChild( radio2);
        container.appendChild( document.createTextNode( 'My IP\'s Routes' ) );
        container.appendChild( document.createElement( 'br' ) );

        var check = document.createElement( 'input' );
        check.setAttribute( 'type', 'checkbox' );
        check.setAttribute( 'id', 'failedRoutes' );
        check.checked = true;
        check.onclick = function( e ) {

            self.redraw_routes();
            self.draw_table();

            return;
        }

        container.appendChild( check );
        container.appendChild( document.createTextNode( 'Display Failed Routes' ) );

        var details_container = document.createElement( 'div' );
        details_container.style.width = '400px';
        details_container.style.height ='400px';
        details_container.style.backgroundColor = '#222222';
        details_container.id = 'details-div';
        details_container.innerHTML = "<p class='pull-right'><a id='close-details' href='#'>Close[X]</a></p><p id='route-details-title' style='font-weight:bold;'>Route Detail</p><table id='route-details' style='width:100%'><thead><tr>" +
            "<th>Hop #</th><th>IP</th><th>RTT</th><th>Loss</th></tr></table><br><div>" +
            "<input type='hidden' id='source'>" +
            "<input type='hidden' id='sourceState'>" +
            "<input type='hidden' id='sourceCity'>" +
            "<input type='hidden' id='sourceIP'> <label>Agent dataset:</label><input id='dataSet'> <button id='update-source'>Update</button>";
        details_container.style.margin = '20px';
        details_container.style.padding = '15px';
        details_container.style.color = "#ffffff"

        $( details_container ).hide();

        this.get_map().controls[ google.maps.ControlPosition.RIGHT_CENTER ].push( container );
        this.get_map().controls[ google.maps.ControlPosition.LEFT_BOTTOM ].push( self.create_legend() );
        this.get_map().controls[ google.maps.ControlPosition.TOP_LEFT ].push( details_container );

        return;
    };

    /**
     * Fire when page loaded
     */
    Agents.prototype.onModuleLoad = function() {

        var self = this;

        // Clear default error container
        clearDefaultErrorContainer();

        self.create_map(
            'map-canvas', 
            function( map ) {

                self.oTable = $( '#infoTable' ).dataTable(
                    {
                        "info":             true,
                        "searching":        true,
                        "lengthChange":     false,
                        "pagingType":       "simple",
                        "scrollCollapse":   true,
                        "iDisplayLength":   5
                    }
                );
		
                self.get_worst_performing_routes();

                setInterval(

                    function() {

                        // Clear default error container
                        clearDefaultErrorContainer();

                        self.get_worst_performing_routes();

                        return;
                    }, 
                    10000
                );

                return;
            }
        );

        return;
    };

    /**
     * Hightlight route
     * @param {Number}id route id
     * @param {Boolean}on
     */
    Agents.prototype.highlight_route = function( id, on ) {

        var self = this;
        var route;
        var idx;

        $.each(
            Object.keys( this.routes ), 
            function( i, e ) {

                var r = self.routes[ e ];

                if( typeof r != 'undefined' &&  r.ID == id ) {

                    route = r;
                    idx = e;

                    return false; // to stop each
                }

                return;
            }
        );

        if( typeof route == 'undefined' )
            return;

        if( on ) {

            $.each(
                route.polyLines, 
                function( i, e ) {

                    e.originalColor = e.get( 'strokeColor' );
                    e.setOptions( { strokeColor: '#ADDFFF', zIndex: 1000 } );

                    return;
                }
            );

        }
        else {

            $.each(
                route.polyLines, 
                function( i, e ) {

                    e.setOptions({ strokeColor: e.originalColor, zIndex: 100 });

                    return;
                }
            );

        }

        return;
    }

    Agents.prototype.isProperRouteSource = function( route ) {

        if( $( '#myIP' ).is( ':checked' ) )
            return route.report.SourceIP == CLIENT_IP_ADDRESS;
        else
            return true;
    }

    Agents.prototype.set_mode = function( a ) {

        if( a == 'runtime' ) {
        } 
        else if( a == 'historical' ) {

            // Show the historical options
            $( '#origin' ).removeClass( 'hide' );
            $( '#target' ).removeClass( 'hide' );

        } 
        else
            throw new Error( 'Trying to switch to unsupported mode.' );

        return;
    };

    Agents.prototype.get_worst_performing_routes = function() {

        var self = this;
        var routesdata;

        self.clear_routes();

        $.ajax({

            url: '/cnep/ajax/worst-performing-routes.json',
            dataType: 'json',

            error: function( error ) {

                console.log( error.responseText );
                displayErrorInErrorContainer( '<br>' + error.responseText );

                return;
            },

            success: function( response ) {

                routesdata = response;

                $.each(
                    routesdata, 
                    function( index, data ) {

                        var route = new RouteObject( data );
                        var r_idx = self.find_match_route( route );

                        if( r_idx != -1 )
                            self.clear_route( r_idx );

                        self.append_route( route,routesdata.length,index );

                        return;
                    }
                );

                return;
            }
        
        });

        return;
    };

    ( function main () {

        var agent = new Agents( 'realtime' );

        return;
    })();

})( window, document, jQuery, google );
