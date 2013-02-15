var http = require('http'),
    url = require('url'),
    fs = require('fs');

http.createServer(function (req, res) {
    var _url = url.parse(req.url, true),
        body,
        file = 'stuff.json',
        pathname = _url.pathname.replace(/^\//, '').replace(/\.{2,}/g, '');
    if (pathname) {
        pathname = pathname + '.json';
        if (fs.existsSync(pathname)) {
            file = pathname;
        } else {
            pathname = pathname.replace(/\//g, '_');
            if (fs.existsSync(pathname)) {
                file = pathname;
            } else {
                console.log(pathname + ' not found');
            }
        }
    } else {
        console.log(pathname + '.json not found');
    }
    body = fs.readFileSync(file, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    if (_url.query.desiredHttpStatus) {
        res.writeHead(_url.query.desiredHttpStatus);
    } else {
        res.writeHead(200, {"X-Info" : "desiredHttpStatus not found"});
    }
    res.write(body);
    res.end();
}).listen(8888);

