
exports.login = function ( email, password, fn) {
	if(email == "admin@accenture.com" && password == "demoversion") {
        return fn( null, email)
    
    } else {
    	return fn( new Error(' Invalid email/password!') );
    }
}

// Security check for the application's session
exports.checkSession = function( req, res, fn ) {
    if( req.session.email ) {    	
        fn();
    }
    else {
        req.session.error = 'Access denied!';
		res.redirect( '/login' );
	}
}