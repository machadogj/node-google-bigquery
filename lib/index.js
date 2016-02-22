var request = require('request');
var bigquery = function ( options ) {

	if (options.iss === undefined || options.iss === null) {
		throw Error("the iss is required.");
	}

	if (options.key === undefined || options.key === null) {
		throw Error("the key is required");
	}

	var service = {};

	service.datasets = require('./Datasets')(options);
	service.tables = require('./Tables')(options);
	service.jobs = require('./Jobs')(options);
	service.getProjects = require('./getProjects')(options);
	service.tabledata = require('./Tabledata')(options);
	
	return service;
};

module.exports = bigquery;