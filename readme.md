Access Google BigQuery using a service account from node.js



# Usage
For the sake of simplicity, the entities returned by Google's webservice are being used, so you can refer to Google's site https://developers.google.com/bigquery/docs/reference/v2/ for further documentation.
For the entire usage of the API you can go see the test\tests.js file, here are some samples:

```js

var bigquery = require('google-bigquery'),
	client = bigquery({
		"iss": '1234567890@developer.gserviceaccount.com',
		"key": fs.readFileSync('mypemfile.pem', 'utf8')
	});


	client.getProjects(function (err, projs) {
		console.log(projs);
		console.log(projs.projects); //list of projects.
	});

	client.tables.create({... your table resource ...}, function (err, table){
		console.log(table);
		console.log(table.tableReference.tableId); //table's id.
	});

```

# Tests
In order to execute the tests, first set up an environment variable 'GOOGLE_ISS' with the ISS taken from your Google API Service Account (notice that you have to register your Google API account for BigQuery first), something like this: "abcdefghij@developer.gserviceaccount.com".
You also have to get a .pem with your private key to sign the token requests. To get this .pem file, create a service account in Google API's console, and download the .p12 file. In linux you can convert the .p12 file with openssl using the following command (notice the -nodes):

openssl -in yourp12file.p12 -out file.pem -nodes

Copy your .pem file to the 'test' folder, and then run the tests using mocha or npm test.

Notice: these tests are going to be hitting your bigquery account directly, so I recommend setting a tests project, and setting the mocha timeout to 10 seconds (mocha --timeout 10000 test/tests.js).

# TODO
* Better API for querying tables (right now you do it through jobs create and query methods)
* Review the token expiration/refresh logic.

# License

The MIT License : http://opensource.org/licenses/MIT

Copyright (c) 2011-2012 Gustavo Machado. http://machadogj.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.