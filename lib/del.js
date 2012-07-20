var request = require('request');

var del = function ( options ) {

    var getToken = require('./getToken')(options.iss, options.key);

    return function ( url, query, cb ) {

        getToken(function ( err, token ) {
            
            if (err) { return cb(err); }
            console.log('deleting to: ' + url);
            console.log('using token: ' + token);
            var qs = query || {};
            qs.access_token = token;
            request.del({
                url: 'https://www.googleapis.com/bigquery/v2' + url,
                qs: qs
            }, function ( err, res ) {
                
                if ( err || res.statusCode !== 204 ) {
                    console.log(err || res);
                    cb('there was a problem deleting your entity');
                } else {
                    cb(undefined);    
                }
            });
        });
    };
};

module.exports = del;