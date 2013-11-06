var Tabledata = function ( options ) {

	var post = require('./post')(options),
		get  = require('./get')(options),
		qs = require('querystring');

	return {
		list: function( projId, datasetId, tableId, options, cb ) {
			var url = '/projects/' + projId + '/datasets/' + datasetId + '/tables/' + tableId + '/data?' + qs.stringify(options);
			get( url, cb );
		},
		insertAll: function ( rows, projId, datasetId, tableId, cb ) {
			var url = '/projects/' + projId + '/datasets/' + datasetId + '/tables/' + tableId + '/insertAll';
			var data = {
				kind: 'bigquery#tableDataInsertAllRequest',
				rows: rows
			};
			post(url, data, cb);
		}
	};
};

module.exports = Tabledata;