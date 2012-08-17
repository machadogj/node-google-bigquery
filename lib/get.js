var request = require('request');

var get = function ( options ) {

    var getToken = require('./getToken')(options.iss, options.key);

    return function ( url, cb ) {

        getToken(function ( err, token ) {
            
            if (err) { return cb(err); }
            console.log('requesting to: ' + url);

            request.get({
                url: 'https://www.googleapis.com/bigquery/v2' + url,
                qs: {
                    access_token: token
                }
            }, function ( err, res, body ) {
                
                if ( err || res.statusCode !== 200 ) {
                    //console.log(err || res);
                    cb('there was a problem executing your query');
                } else {
                    cb(undefined,JSON.parse(body));
                }
            });
        });
    };
};

module.exports = get;