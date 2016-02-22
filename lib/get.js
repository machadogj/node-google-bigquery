var request = require('request');

var get = function ( options ) {

    var getToken = require('./getToken')(options.iss, options.key);

    return function ( url, nextPageToken, cb ) {
        if (typeof nextPageToken === 'function') {
            cb = nextPageToken;
            delete nextPageToken;
        }

        getToken(function ( err, token ) {
            if (err) { return cb(err); }
            console.log('requesting to: ' + url);

            var getParams = {
                url: 'https://www.googleapis.com/bigquery/v2' + url,
                qs: {
                    access_token: token
                }
            }
            if (nextPageToken) {
                getParams.qs.pageToken = nextPageToken;
            }

            request.get(getParams , function ( err, res, body ) {
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