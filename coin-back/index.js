var express = require('express'),
	request = require('request'),
	bodyParser = require('body-parser'),
	app = express();

var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({
	limit: myLimit
}));

app.all('*', function (req, res, next) {

	// Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
	res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

	if (req.method === 'OPTIONS') {
		// CORS Preflight
		res.send();
	} else {
		var targetURL = req.header('Target-URL'); // Target-URL ie. https://example.com or http://example.com
		if (!targetURL) {
			res.send(500, {
				error: 'There is no Target-Endpoint header in the request'
			});
			return;
		}
	
		delete req.headers['origin'];
		delete req.headers['referer'];
		delete req.headers['target-url'];

		let headers = []

		headers['api-key'] = req.headers['api-key']
		headers['api-secret'] = req.headers['api-secret']
		headers['api-signature'] = req.headers['api-signature']
		headers['api-expires'] = req.headers['api-expires']

		request({
				url: targetURL,
				method: req.method,
				json: req.body,
				headers
			}, //, headers: req.headers
			function (error, response, body) {
				if (error) {
					console.error('error: ' + error)
				}
			}).pipe(res);
	}
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
	console.log('Proxy server listening on port ' + app.get('port'));
});