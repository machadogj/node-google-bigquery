var getProjects = function ( options ) {

    var get = require('./get')(options);

    return function (cb) {

        var url = '/projects';
        get(url, cb);
    };
};

module.exports = getProjects;