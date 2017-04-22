/**
 * @file src/vendor/querystring.js
 * @author leeight
 */

var u = require('./underscore');

function stringifyPrimitive(v) {
    if (typeof v === 'string') {
        return v;
    }

    if (typeof v === 'number' && isFinite(v)) {
        return '' + v;
    }

    if (typeof v === 'boolean') {
        return v ? 'true' : 'false';
    }

    return '';
}

exports.stringify = function stringify(obj, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';

    var encode = encodeURIComponent; // QueryString.escape;
    if (options && typeof options.encodeURIComponent === 'function') {
        encode = options.encodeURIComponent;
    }

    if (obj !== null && typeof obj === 'object') {
        var keys = u.keys(obj);
        var len = keys.length;
        var flast = len - 1;
        var fields = '';
        for (var i = 0; i < len; ++i) {
            var k = keys[i];
            var v = obj[k];
            var ks = encode(stringifyPrimitive(k)) + eq;

            if (u.isArray(v)) {
                var vlen = v.length;
                var vlast = vlen - 1;
                for (var j = 0; j < vlen; ++j) {
                    fields += ks + encode(stringifyPrimitive(v[j]));
                    if (j < vlast) {
                        fields += sep;
                    }

                }
                if (vlen && i < flast) {
                    fields += sep;
                }
            }
            else {
                fields += ks + encode(stringifyPrimitive(v));
                if (i < flast) {
                    fields += sep;
                }
            }
        }
        return fields;
    }

    return '';
};
