var jwt = require('jwt-sign'),
    request = require('request');

var tokens = {};

var getToken = function ( iss, key ) {

    if (!tokens[iss]) {
        tokens[iss] = { key: key, token: {} };
    }

    get = function ( cb ) {

        //check whether we should get a new token.
        if (!tokens[iss].token.expiration || tokens[iss].token.expiration < getSecondsToDate()) {

            console.log('requesting new token');
            //console.log(iss);
            //console.log(key);

            var payload = getPayload(iss);
            var token = jwt.sign(payload, key);

            request.post({
                url:"https://accounts.google.com/o/oauth2/token",
                method: 'POST',
                form: {
                    'grant_type': 'assertion',
                    'assertion_type': 'http://oauth.net/grant_type/jwt/1.0/bearer',
                    'assertion': token
                }
            }, function (error, res, body) {
                
                if ( error ) {
                    cb('there was a connection problem trying to request the token.');
                } else if (res.statusCode !== 200) {
                    console.log(res);
                    cb('there was a problem requesting the access token.');
                }
                
                body = JSON.parse(body);
                tokens[iss].token.access_token = body.access_token;
                tokens[iss].token.expiration = getSecondsToDate() + body.expires_in - 10; //little correction.
                
                console.log(tokens[iss].token.access_token);
                cb(undefined, tokens[iss].token.access_token);
            });
            
        } else {
            console.log('returning old token');
            cb(undefined, tokens[iss].token.access_token);
        }
    };

    return get;
};

module.exports = getToken;

/* private functions */
function getSecondsToDate(){
    return new Date().getTime() / 1000;
}

function getPayload(iss) {
    return {
        "iss": iss,
        "scope": 'https://www.googleapis.com/auth/bigquery',
        "aud":"https://accounts.google.com/o/oauth2/token",
        "exp": ~~(getSecondsToDate() + (30 * 60)), //1 hour
        "iat": ~~(getSecondsToDate() - 60)
    };
}
