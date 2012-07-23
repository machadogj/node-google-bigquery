var request = require('request');

var post = function ( options ) {

    var getToken = require('./getToken')(options.iss, options.key);

    return function ( url, data, cb ) {

        console.log('getting token');

        getToken(function ( err, token ) {
            
            if (err) { return cb(err); }

            console.log('doing the multipart post');
            request.post({
                url: 'https://www.googleapis.com/upload/bigquery/v2' + url,
                qs: {
                    access_token: token
                },
                multipart: data
            }, function ( err, res, body ) {
                console.log('received response');
                if ( err || res.statusCode !== 200 ) {
                    console.log(err || res);
                    cb('there was a problem executing your query');
                } else {
                    cb(undefined,body);
                }
            });
        });
    };
};

module.exports = post;