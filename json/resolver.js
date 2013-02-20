
var fs = require('fs'),
    resolver,
    transformers = [];

module.exports = resolver = {};

resolver.addTransformer = function (trans) {
    if (typeof trans !== 'function') {
        throw ('Invalid transformer, only functions allowed, not ' + (typeof trans));
    }
    transformers.push(trans);
};

resolver.addTransformer(function (pathname) {
    return pathname;
});

resolver.addTransformer(function (pathname) {
    return pathname.replace(/\//g, '_');
});

resolver.addTransformer(function (pathname) {
    if (pathname.match(/^identity.+user.+addresses/)) {
        return 'addresses.json';
    }
    return false;
});

resolver.toFile = function (urlObj, defaultFile) {
    var response = {good : false, file : defaultFile},
        pathname = urlObj.pathname.replace(/^\//, '').replace(/\.{2,}/g, ''),
        toTry, i, l = transformers.length;
    if (!pathname) return response;
    pathname = pathname + '.json';
    for (i = 0; i < l; i++) {
        toTry = transformers[i](pathname);
        if (toTry && fs.existsSync(toTry)) {
            response.file = toTry;
            response.good = true;
            return response;
        }
    }
    return response;
};

