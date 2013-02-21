
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

resolver.addTransformer(function (pathname, query) {
    if (query.paymentAuthorizationStatus != 'AUTHORIZED') {
        if (pathname.match(/^ecom\/transaction\/[\da-f-]+\/offer\/[\da-f-]+\/paymentAuthorization\/[\da-f-]+/i)) {
            return 'ecom/payAuth.json';
        } else if (pathname.match(/^ecom\/transaction\/[\da-f-]+\/offer\/[\da-f-]+\/paymentAuthorization\.json/i)) {
            return 'ecom/payAuths.json';
        }
    }
    return false;
});

resolver.addTransformer(function (pathname) {
    if (pathname.match(/^ecom\/transaction\/[\da-f-]+\/offer\/[\da-f-]+\/?\.json$/i)) {
        return 'ecom/offer.json';
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
        toTry = transformers[i](pathname, urlObj.query);
        if (toTry && fs.existsSync(toTry)) {
            response.file = toTry;
            response.good = true;
            return response;
        }
    }
    return response;
};

