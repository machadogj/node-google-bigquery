var Tables = function ( options ) {

    var post = require('./post')(options),
        del  = require('./del')(options),
        get  = require('./get')(options);

    return {
        create: function ( table, cb ) {
            var projId = table.tableReference.projectId,
                id = table.tableReference.datasetId,
                url = '/projects/' + projId + '/datasets/' + id + '/tables';
            post(url, table, cb);
        },
        "delete": function ( id, datasetId, projId, cb ) {
            var url = '/projects/' + projId + '/datasets/' + datasetId + '/tables/' + id;
            del(url, undefined, cb);
        },
        get: function ( id, datasetId, projId, cb ) {
            var url = '/projects/' + projId + '/datasets/' + datasetId + '/tables/' + id;
            get(url, cb);
        },
        getAll: function ( datasetId, projId, cb ) {
            var url = '/projects/' + projId + '/datasets/' + datasetId + '/tables';
            get(url, cb);
        }
    };
};

module.exports = Tables;