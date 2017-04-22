/**
 * @file vendor/path.js
 * @author leeight
 */

var u = require('./underscore');

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

function splitPath(filename) {
    return splitPathRe.exec(filename).slice(1);
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;

    for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];

        if (last === '.') {
            parts.splice(i, 1);
        }
        else if (last === '..') {
            parts.splice(i, 1);
            up++;
        }
        else if (up) {
            parts.splice(i, 1);
            up--;
        }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
        for (; up--; up) {
            parts.unshift('..');
        }
    }

    return parts;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) {
        return str.substr(start, len);
    }
    : function (str, start, len) {
        if (start < 0) {
            start = str.length + start;
        }
        return str.substr(start, len);
    };

exports.extname = function (path) {
    return splitPath(path)[3];
};

exports.join = function () {
    var paths = Array.prototype.slice.call(arguments, 0);
    return exports.normalize(u.filter(paths, function (p, index) {
        if (typeof p !== 'string') {
            throw new TypeError('Arguments to path.join must be strings');
        }
        return p;
    }).join('/'));
};

exports.normalize = function (path) {
    var isAbsolute = path.charAt(0) === '/';
    var trailingSlash = substr(path, -1) === '/';

    // Normalize the path
    path = normalizeArray(u.filter(path.split('/'), function (p) {
        return !!p;
    }), !isAbsolute).join('/');

    if (!path && !isAbsolute) {
        path = '.';
    }
    if (path && trailingSlash) {
        path += '/';
    }

    return (isAbsolute ? '/' : '') + path;
};









