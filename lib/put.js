var request = require('request');

var put = function ( options ) {

    var getToken = require('./getToken')(options.iss, options.key);

    return function ( url, data, cb ) {

        getToken(function ( err, token ) {
            
            if (err) { return cb(err); }

            request.put({
                url: 'https://www.googleapis.com/bigquery/v2' + url,
                qs: {
                    access_token: token
                },
                json: data
            }, function ( err, res, body ) {
                if ( err || res.statusCode !== 200 ) {
                    //console.log(err || res);
                    cb(err);
                } else {
                    cb(undefined,body);
                }
            });
        });
    };
};

module.exports = put;