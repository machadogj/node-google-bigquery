var Jobs = function ( options ) {

    var post = require('./post')(options),
        del  = require('./del')(options),
        get  = require('./get')(options);

    return {
        create: function ( job, cb ) {
            var projId = job.jobReference.projectId,
                id = job.jobReference.datasetId,
                url = '/projects/' + projId + '/jobs';
            post(url, job, cb);
        },
        get: function ( id, projId, cb ) {
            var url = '/projects/' + projId + '/jobs/' + id;
            get(url, cb);
        },
        getAll: function ( projId, cb ) {
            var url = '/projects/' + projId + '/jobs';
            get(url, cb);
        }
    };
};

module.exports = Jobs;