var Jobs = function ( options ) {

    var post = require('./post')(options),
        del  = require('./del')(options),
        get  = require('./get')(options),
        multipart = require('./multipart')(options);

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
        },
        load: function ( job, data, projId, cb) {

            var body = [{
                'content-type': 'application/json',
                'body': JSON.stringify(job)
            }, {//content-type will not work on this one.
                'Content-Type': 'application/octet-stream',
                'body': data
            }];

            console.log('about to make the multipart');

            multipart('/projects/' + projId + '/jobs', body, cb);

        }
    };
};

module.exports = Jobs;