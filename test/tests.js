var assert = require('assert'),
    bigquery = require('../lib'),
    fs = require('fs'),
    pem = fs.readFileSync(__dirname + '/file.pem', 'utf8'),
    client = bigquery({
        "iss": process.env['GOOGLE_ISS'],
        "key": pem
    });

describe('google bigquery client', function (){

    it('should throw error if iss is not defined', function (){
        var throwed = false;
        
        try { bigquery({"key":"foo"}); }
        catch(err) { throwed = true; }
        
        assert.ok(throwed);
    });

    it('should throw error if key is not defined', function () {
        var throwed = false;
        
        try { bigquery({"iss":"foo"}); }
        catch(err) { throwed = true; }
        
        assert.ok(throwed);
    });

    describe('projects', function (){

        it('should query for projects', function ( done ) {
            client.getProjects(function (err, projs) {
                assert.equal(undefined, err);
                assert.ok(projs);
                assert.ok(projs.projects.length > 0);
                done();
            });
        });

    });

    describe('datasets', function () {

        it('should create a dataset', function ( done ){
            var name = "test" + ~~(Math.random() * 100000);
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.datasets.create(name, projId, function (err, dataset) {
                    assert.equal(undefined, err);
                    assert.ok(dataset);
                    assert.equal(name, dataset.friendlyName);
                    //try to clean up the mess but don't blow the test.
                    client.datasets.delete(dataset.datasetReference.datasetId, projId, true, function (err) {});
                    done();
                });
            });
        });

        it('should delete a dataset', function ( done ){ 
            var name = "test" + ~~(Math.random() * 100000);
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.datasets.create(name, projId, function (err, dataset) {
                    client.datasets.delete(dataset.datasetReference.datasetId, projId, true, function (err) {
                        assert.equal(undefined, err);
                        done();
                    });
                });
            });
        });

        it('should query for datasets', function ( done ) {
            client.getProjects(function (err, projs) {
                client.datasets.getAll(projs.projects[0].id, function (err, datasets) {
                    assert.equal(undefined, err);
                    assert.ok(datasets);
                    assert.ok(datasets.datasets.length > 0);
                    done();
                });
            });
        });

        it('should get a dataset', function ( done ) {
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.datasets.getAll(projId, function (err, datasets) {
                    //get the first.
                    var first = datasets.datasets[0].datasetReference.datasetId;
                    client.datasets.get(first, projId, function (err, dataset) {
                        assert.equal(undefined, err);
                        assert.ok(dataset);
                        assert.equal(first, dataset.datasetReference.datasetId);
                        done();
                    });
                });
            });
        });

    });

    describe('tables', function () {

        it('should create a table', function ( done ){ 
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.datasets.getAll(projId, function (err, datasets) {
                    //get the first.
                    var first = datasets.datasets[0].datasetReference.datasetId,
                        name = "tesTable" + ~~(Math.random() * 100000),
                        table = {
                            friendlyName: name,
                            tableReference: {
                                projectId: projId,
                                datasetId: first,
                                tableId: name
                            },
                            schema: {
                                fields: [
                                    { name: 'col1', type: 'STRING' }
                                ]
                            }
                        };
                    
                    client.tables.create(table, function (err, result) {
                        assert.equal(undefined, err);
                        assert.ok(result);
                        assert.equal(name, result.tableReference.tableId);
                        done();
                        //clean up table without blowing up the test
                        client.tables.delete(name, first, projId, function (){});
                    });
                });
            });
        });

        it('it should delete a table', function ( done ) { 
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.datasets.getAll(projId, function (err, datasets) {
                    //get the first.
                    var first = datasets.datasets[0].datasetReference.datasetId,
                        name = "tesTable" + ~~(Math.random() * 100000),
                        table = {
                            friendlyName: name,
                            tableReference: {
                                projectId: projId,
                                datasetId: first,
                                tableId: name
                            },
                            schema: {
                                fields: [
                                    { name: 'col1', type: 'STRING' }
                                ]
                            }
                        };
                    
                    client.tables.create(table, function (err, result) {
                        client.tables.delete(name, first, projId, function (err) {
                            assert.equal(undefined, err);
                            done();
                        });
                    });
                });
            });
        });

        it('it should list all tables', function ( done ) { 
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.datasets.getAll(projId, function (err, datasets) {
                    //get the first.
                    var first = datasets.datasets[0].datasetReference.datasetId;
                    console.log(first);
                    client.tables.getAll(first, projId, function (err, tables) {
                        assert.equal(undefined, err);
                        assert.ok(tables.tables.length > 0);
                        done();
                    });
                });
            });
        });

        it('it should get a table', function ( done ) {
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.datasets.getAll(projId, function (err, datasets) {
                    //get the first.
                    var first = datasets.datasets[0].datasetReference.datasetId;
                    console.log(first);
                    client.tables.getAll(first, projId, function (err, tables) {
                        var tableId = tables.tables[0].tableReference.tableId;
                        client.tables.get(tableId, first, projId, function ( err, table ) {
                            assert.equal(undefined, err);
                            assert.ok(table);
                            assert.equal(tableId, table.tableReference.tableId);
                            done();
                        });
                    });
                });
            });
        });

    });

    describe('jobs', function () {

        it('should create a job', function ( done ){
            var name = "testTable" + ~~(Math.random() * 100000),
                destinationTable = "destTable" + ~~(Math.random() * 100000),
                jobName = "testJob" + ~~(Math.random() * 100000);
            client.getProjects(function (err, projs) {

                var projId = projs.projects[0].id;
                client.datasets.getAll(projId, function (err, datasets) {
                    //get the first.
                    var first = datasets.datasets[0].datasetReference.datasetId,
                        table = {
                            friendlyName: name,
                            tableReference: {
                                projectId: projId,
                                datasetId: first,
                                tableId: name
                            },
                            schema: {
                                fields: [
                                    { name: 'col1', type: 'STRING' }
                                ]
                            }
                        };

                    client.tables.create(table, function (err, result) {
                        
                        var job = {
                            id: jobName,
                            jobReference: {
                                projectId: projId,
                                jobId: jobName
                            },
                            configuration: {
                                copy: {
                                    sourceTable:{
                                        projectId: projId,
                                        datasetId: first,
                                        tableId: name
                                    },
                                    destinationTable: {
                                        projectId: projId,
                                        datasetId: first,
                                        tableId: destinationTable
                                    },
                                    createDisposition: 'CREATE_IF_NEEDED',
                                    writeDisposition: 'WRITE_TRUNCATE'
                                }
                            }
                        };
                        client.jobs.create(job, function (err, entity) {
                            assert.equal(undefined, err);
                            assert.ok(entity);
                            done();
                        });
                    });
                });
            });
        });

        it('should query for jobs', function ( done ) {
            client.getProjects(function (err, projs) {
                client.jobs.getAll(projs.projects[0].id, function (err, jobs) {
                    assert.equal(undefined, err);
                    assert.ok(jobs);
                    assert.ok(jobs.jobs.length > 0);
                    done();
                });
            });
        });

        it('should get a job', function ( done ) {
            client.getProjects(function (err, projs) {
                var projId = projs.projects[0].id;
                client.jobs.getAll(projId, function (err, jobs) {
                    //get the first.
                    var first = jobs.jobs[0].jobReference.jobId;
                    client.jobs.get(first, projId, function (err, entity) {
                        assert.equal(undefined, err);
                        assert.ok(entity);
                        assert.equal(first, entity.jobReference.jobId);
                        done();
                    });
                });
            });
        });

        it('should load data to a table', function ( done ) {
            var destinationTable = "destTable" + ~~(Math.random() * 100000),
                jobName = "testJob" + ~~(Math.random() * 100000);
            client.getProjects(function (err, projs) {

                var projId = projs.projects[0].id;
                client.datasets.getAll(projId, function (err, datasets) {
                    //get the first.
                    var first = datasets.datasets[0].datasetReference.datasetId,
                        job = {
                            id: jobName,
                            jobReference: {
                                projectId: projId,
                                jobId: jobName
                            },
                            configuration: {
                                load: {
                                    schema: {
                                        fields: [
                                            { name: 'col1', type: 'STRING' },
                                            { name: 'col2', type: 'INTEGER' },
                                            { name: 'col3', type: 'FLOAT' },
                                            { name: 'col4', type: 'BOOLEAN' }
                                        ]
                                    },
                                    destinationTable: {
                                        projectId: projId,
                                        datasetId: first,
                                        tableId: destinationTable
                                    },
                                    createDisposition: 'CREATE_IF_NEEDED',
                                    writeDisposition: 'WRITE_TRUNCATE',
                                    skipLeadingRows: 0,
                                    encoding: 'UTF-8'
                                }
                            }
                        };
                
                    console.log('trying to upload to: ' + destinationTable);

                    var data =  '"Shooting Star",15,325.5,true\r\n' +
                                '"Magic Muffin",12,411.5,true\r\n' +
                                '"Blaze",16,312.2,false\r\n' +
                                '"Old Red",22,388.2,false';

                    client.jobs.load(job, data, projId, function (err, entity) {
                        assert.equal(undefined, err);
                        console.log(entity);
                        assert.ok(entity);
                        done();
                    });
                });
            });
        });

        it('can create query job', function ( done ) {
            /*
                projectId: 'tellagostudios.com:kidozen',
                datasetId: 'devaudit',
                tableId: 'bulkdata'
            */
            var jobName = "testJob" + new Date().getTime();
            var job = {
                id: jobName,
                jobReference: {
                    projectId: 'YOUR-PROJECT-ID',
                    jobId: jobName
                },
                configuration: {
                    query: {
                        "query": "SELECT tenantId, serviceName, STRFTIME_UTC_USEC(NOW(), '%H:%M') AS ts, count(*) as count FROM [devaudit.bulkdata] " +
                                 "WHERE startedOn * 1000 > UTC_USEC_TO_MONTH(1344970355790 * 1000) " +
                                 "GROUP BY tenantId, serviceName, ts " +
                                 "LIMIT 1000 "
                    }
                }
            };

            client.jobs.create(job, function (err, entity) {
                assert.equal(undefined, err);
                assert.ok(entity);
                console.log( err || entity );
                console.log( JSON.stringify(entity));
                done();
            });
        });

        it('can execute query', function  ( done ) {
            var projectId = 'YOUR-PROJECT-ID',
                //COMPLETE YOUR QUERY HERE.
                query = "SELECT col1 FROM [dataset1.table1] " +
                        "LIMIT 1000 ",
                options = {
                    projId: projectId,
                    query: query
                };

            client.jobs.query(options, function ( err, result ){
                assert.equal( undefined, err );
                assert.ok( result );

                console.log( err || result );
                done();
            });
        });
    });

	describe('tabledata', function() {

		var projId = null;
		var datasetId = null;

		before(function( done ) {
			client.getProjects(function (err, projs) {
				projId = projs.projects[0].id;
				client.datasets.getAll(projId, function (err, datasets) {
					//get the first.
					datasetId = datasets.datasets[0].datasetReference.datasetId;

					done();
				});
			});
		});

		it('should insert data into a table', function( done ) {
			var tableId = "tesTable" + ~~(Math.random() * 100000);
			var	table = {
				friendlyName: tableId,
				tableReference: {
					projectId: projId,
					datasetId: datasetId,
					tableId: tableId
				},
				schema: {
					fields: [
						{ name: 'col1', type: 'STRING' }
					]
				}
			};
			var rows = [{
				json: {
					col1: 'test1'
				}
			}, {
				json: {
					col1: 'test2'
				}
			}];

			client.tables.create(table, function () {
				client.tabledata.insertAll(rows, projId, datasetId, tableId, function (err, result) {
					assert.equal(undefined, err);
					assert.ok(result);
					assert.equal('bigquery#tableDataInsertAllResponse', result.kind);

					//cleanup
					client.tables.delete(tableId, datasetId, projId, function (){});
					done();
				});
			});
		});

		it('should list data of a table', function( done ) {
			client.tables.getAll(datasetId, projId, function (err, tables) {
				var tableId = tables.tables[0].tableReference.tableId;

				client.tabledata.list(projId, datasetId, tableId, {}, function (err, results) {
					assert.equal(undefined, err);
					assert.ok(results);
					assert.equal('bigquery#tableDataList', results.kind);

					done();
				});
			});
		});

		it('should list only one of a table', function( done ) {
			client.tables.getAll(datasetId, projId, function (err, tables) {
				var tableId = tables.tables[0].tableReference.tableId;

				client.tabledata.list(projId, datasetId, tableId, {maxResults: 2}, function (err, results) {
					assert.equal(undefined, err);
					assert.ok(results);
					assert.equal(2, results.rows.length);

					done();
				});
			});
		});

	});
});
