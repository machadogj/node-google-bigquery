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
        load: function ( job, data, projId, cb ) {

            var body = [{
                    'content-type': 'application/json',
                    'body': JSON.stringify(job)
                }, {//content-type will not work on this one.
                    'Content-Type': 'application/octet-stream',
                    'body': data
                }];

            multipart('/projects/' + projId + '/jobs', body, cb);

        },
        query: function ( options, cb ) {
            var projId = options.projId,
                query = options.query,
                maxTimeout = options.maxTimeout || 1000,
                jobName = "tempjob" + new Date().getTime(),
                url = '/projects/' + projId + '/jobs',
                job = {
                    id: jobName,
                    jobReference: {
                        projectId: projId,
                        jobId: jobName
                    },
                    configuration: {
                        query: {
                            "query": query
                        }
                    }
                };

            post( url, job, function ( err, result ) {
                
                if ( err ) {
                    cb(err);
                    return;
                }
                
                url = '/projects/' + projId + '/queries/' + jobName + '?maxTimeout=' + maxTimeout;
                
                get( url, function ( err, results ) {

                    if ( err ) {
                        cb(err);
                        return;
                    }

                    var list = [];
                    for( var rowIndex in results.rows ) {
                        var item = {};
                        for( var fieldIndex in results.schema.fields ) {
                            item[results.schema.fields[fieldIndex].name] = results.rows[rowIndex].f[fieldIndex].v;
                        }
                        list.push(item);
                    }

                    cb(null, list);

                });
            });
        }
    };
};

module.exports = Jobs;