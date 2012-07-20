var Datasets = function ( options ) {

    var post = require('./post')(options),
        del  = require('./del')(options),
        get  = require('./get')(options);


    return {
        create: function ( name, projId, cb ) {
            var url = '/projects/' + projId + '/datasets',
                data = {
                    datasetReference: {
                        projectId: projId,
                        datasetId: name
                    },
                    friendlyName: name
                };

            post(url, data, cb);
        },
        "delete": function ( id, projId, deleteContents, cb ) {

            var url = '/projects/' + projId + '/datasets/' +id,
                query = { deleteContents: !!deleteContents };
            del(url, query, cb);
        },
        get: function (id, projId, cb) {
            var url = '/projects/' + projId + '/datasets/' + id;
            get(url, cb);
        },
        getAll: function (projId, cb) {
            var url = '/projects/' + projId + '/datasets';
            get(url, cb);
        }
    };
};

module.exports = Datasets;