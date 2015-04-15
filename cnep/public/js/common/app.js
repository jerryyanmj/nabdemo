// The functions below are used for common purposes

// Return Google Map type
function    createGoogleMapOptions( zoomLevel ) {

    var mapOptions = 
    {
        zoom:       zoomLevel,
        center:     new google.maps.LatLng( 38,-94 ),
        mapTypeId:  google.maps.MapTypeId.ROADMAP,
        styles:     
        [
            {
                "featureType": "landscape",
                "stylers": 
                [
                    { "hue": "#F1FF00" },
                    { "saturation": -27.4 },
                    { "lightness": 9.4 },
                    { "gamma": 1 }
                ]
            },
            {
                "featureType": "road.highway",
                "stylers": 
                [
                    { "hue": "#0099FF" },
                    { "saturation": -20 },
                    { "lightness": 36.4 },
                    { "gamma": 1 }
                ]
            },
            {
                "featureType": "road.arterial",
                "stylers": 
                [
                    { "hue": "#00FF4F" },
                    { "saturation": 0 },
                    { "lightness": 0 },
                    { "gamma": 1 }
                ]
            },
            {
                "featureType": "road.local",
                "stylers": 
                [
                    { "hue": "#FFB300" },
                    { "saturation": -38 },
                    { "lightness": 11.2 },
                    { "gamma": 1 }
                ]
            },
            {
                "featureType": "water",
                "stylers": 
                [
                    { "hue": "#00B6FF" },
                    { "saturation": 4.2 },
                    { "lightness": -63.4 },
                    { "gamma": 1 }
                ]
            },
            {
                "featureType": "poi",
                "stylers": 
                [
                    { "hue": "#9FFF00" },
                    { "saturation": 0 },
                    { "lightness": 0 },
                    { "gamma": 1 }
                ]
            }
        ]
    };

    return mapOptions;
}

// Display error ( which is returned by Ajax call ) in the default error container
function    displayErrorInErrorContainer( errorData ) {

    // Add new error
    $( '#errorAjaxContainer' ).append( errorData );
    $( '#errorAjaxContainer' ).append( '<br>' );

    // Display the new content
    $( '#errorAjaxContainer' ).show();

    return;
}

// Clear default error container
function    clearDefaultErrorContainer() {

    // Clear the previous errors
    $( '#errorAjaxContainer' ).empty();

    // Hide the default error container
    $( '#errorAjaxContainer' ).hide();

    return;
}
