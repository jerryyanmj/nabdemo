/**
 * This script is used for show data for Live Routes page classes
 */

(function (window, document, $) {
    /**
     * Content geo location information,
     * and sometimes something more... Logic part of what I could not get... Well...
     * @class LocationObject
     * @property {number} Latitude
     * @property {number} Longitude
     * @property {string} City
     * @property {string} Country
     * @property {string} State
     * @constructor
     */
    function LocationObject() {

    }

    /**
     * Returns true if Location is enriched.
     * (latlog present and no equal (38; -97) point)
     * @returns {boolean}
     */
    LocationObject.prototype.is_enriched = function () {
        return typeof this.sourceLat!== 'undefined' && this.sourceLat!= '' && this.sourceLat!= 38
            && typeof this.sourceLon!== 'undefined' && this.sourceLon!= '' && this.sourceLon!= -97
		&&  typeof this.targetLat!== 'undefined' && this.targetLat!= '' && this.targetLat!= 38
            && typeof this.targetLon!== 'undefined' && this.targetLon!= '' && this.targetLon!= -97;
    }

    /**
     * Compare two LocationObject's and returns true if they match or false else
     * @param {LocationObject} b other LocationObject
     * @returns {boolean}
     */
    LocationObject.prototype.equal = function (b) {
        return this.fromCity== b.fromCity&& this.toCity== b.toCity
    }


	 /**
     * Content geo location information,
     * and sometimes something more... Logic part of what I could not get... Well...
     * @class LocationObject
     * @property {number} Latitude
     * @property {number} Longitude
     * @property {string} City
     * @property {string} Country
     * @property {string} State
     * @constructor
     */
    function HistoricalObject() {

    }

   
    /**
     * Compare two LocationObject's and returns true if they match or false else
     * @param {LocationObject} b other LocationObject
     * @returns {boolean}
     */
    HistoricalObject.prototype.equal = function (b) {
        return this.loss== b.loss && this.latency== b.latency
    }
	

    /**
     *  export to global namespace
     * @type {Function}
     */
    window.HistoricalObject= HistoricalObject;

	 /**
     * Content geo location information,
     * and sometimes something more... Logic part of what I could not get... Well...
     * @class LocationObject
     * @property {number} Latitude
     * @property {number} Longitude
     * @property {string} City
     * @property {string} Country
     * @property {string} State
     * @constructor
     */
    function CurrentObject() {

    }

   
    /**
     * Compare two LocationObject's and returns true if they match or false else
     * @param {LocationObject} b other LocationObject
     * @returns {boolean}
     */
    CurrentObject.prototype.equal = function (b) {
        return this.loss== b.loss && this.latency== b.latency && this.loss_deviation_score== b.loss_deviation_score && this.latency_deviation_score== b.latency_deviation_score

    }
	

    /**
     *  export to global namespace
     * @type {Function}
     */
    window.CurrentObject= CurrentObject;


    /**
     * Content method working with ip information.
     * @class IPObject
     * @property {string} IP
     * @property {LocationObject} Location
     * @property {number} ProbeCount
     * @property {number} RTT
     */


    /**
     * Content infromation and methods working with hop data
     * @property {array} IPs  array content IPObjects
     * @see IPObject
     * @constructor
     */
    function HopObject() {

    }


    

    /**
     * export to global namespace
     * @type {Function}
     */
    window.HopObject = HopObject;

    /**
     * Content methods working with Route data
     * @class RouteObject
     * @property {LocationObject} SourceLocation
     * @property {LocationObject} TargetLocation
     * @property {array} Hops array content HopObjects
     * @property {RouteReport} report
     * @see HopObject
     * @constructor
     */

    function RouteObject(report) {
	
	

        $.extend(report.locationInfo, new LocationObject());
        $.extend(report.historical, new HistoricalObject());
	 $.extend(report.current, new CurrentObject()); 	
	report.hops= $.each(report.hops, function (key,e) {
		e.key=key; 
		

            return $.extend(e, new HopObject());
        });

        
	this.report = report;

    }

    /**
     * Compare two RoutesObjects and return true
     * @param {RouteObject} b other route object
     * @returns {boolean}
     */
    RouteObject.prototype.equal = function (b) {
        if (typeof b == 'undefined')
            throw new Error('Unable to compare with  undefined object');
        return this.report.locationInfo.equal(b.report.locationInfo)
            && this.report.historical.equal(b.report.historical)
    }

    
    /**
     * Export RouteObject to global namespace
     * @type {Function}
     */
    window.RouteObject = RouteObject;

    /**
     * The RoutesLayout provides client side rendering of network map.
     * @param {google.maps.Map} map
     * @constructor
     */
    function RoutesLayout(map) {
        this.map_ = map;
        this.tragets_ = new Array();
        this.setMap(map);


    }

    RoutesLayout.prototype = new google.maps.OverlayView();

    RoutesLayout.prototype.onAdd = function () {
        //Nothing here
    }

    RoutesLayout.prototype.onRemove = function () {
        //Todo add code here
    }


    RoutesLayout.prototype.draw = function (){
        //TODO add code here
        
    }

    RoutesLayout.prototype.convertLatLngToDivPixels = function(latlng){
        return this.getProjection().fromLatLngToDivPixel(latlng);
    }

    /**
     *
     * @param type
     * @param lat
     * @param lng
     * @returns {number}
     */
    RoutesLayout.prototype.pushTarget = function(type, lat, lng){
        this.tragets_.push({type: type, lat: lat, lng: lng});
        return this.tragets_.length - 1;
    }

    window.RoutesLayout = RoutesLayout;

    function CustomMarker (options){

        this.rl = options.rl;
        this.map = options.map;
        this.icon = options.icon;
        this.text = options.text;
        this.location = new google.maps.LatLng(options.lat, options.lng);
        this.width = options.width;
        this.height = options.height;
        this.div = document.createElement('div');
    }

    CustomMarker.prototype.getLocation = function(){
        return {lat: this.location.lat(), lng:this.location.lng()};
    }

    CustomMarker.prototype.draw = function(){
        var pos = this.rl.convertLatLngToDivPixels(this.location);
        this.div.style.backgroundImage = this.icon;
        this.div.style.left = pos.x - this.width/2 + 'px';
        this.div.style.top = pos.y - this.height/2 + 'px';
    }

})(window, document, jQuery);