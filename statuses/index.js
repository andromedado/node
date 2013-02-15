var http = require('http'),
	url = require('url'),
	fs = require('fs');

http.createServer(function (req, res) {
	var _url = url.parse(req.url, true), body;
	if (_url.query.desiredResponseType == 'json') {
		body = fs.readFileSync('index.json', 'utf8');
		res.setHeader('Content-Type', 'application/json');
	} else {
		body = fs.readFileSync('index.html', 'utf8');
	}
	if (_url.query.desiredHttpStatus) {
		res.writeHead(_url.query.desiredHttpStatus);
	} else {
		res.writeHead(200, {"X-Info" : "desiredHttpStatus not found"});
	}
	res.write(body);
	res.end();
}).listen(8888);

