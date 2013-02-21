var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    resolver = require('./resolver.js');

http.createServer(function (req, res) {
    var body,
        urlObj = url.parse(req.url, true),
        resolved = resolver.toFile(urlObj, 'stuff.json');
    if (resolved.good) {
        console.log('*hit* ' + resolved.file, urlObj, "\n");
    } else {
        console.log('*un-resolved* ' + url.parse(req.url, true).pathname, urlObj, "\n");
    }
    body = fs.readFileSync(resolved.file, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    if (urlObj.query.desiredHttpStatus) {
        res.writeHead(_url.query.desiredHttpStatus);
    } else {
        res.writeHead(200, {"X-Info" : "desiredHttpStatus not found"});
    }
    res.write(body);
    res.end();
}).listen(8888);

