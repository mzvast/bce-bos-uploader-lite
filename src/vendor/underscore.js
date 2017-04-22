/**
 * ag --no-filename -o '\b(u\..*?)\(' .  | sort | uniq -c
 *
 * @file vendor/underscore.js
 * @author leeight
 */

function noop() {
}

function map(array, callback, context) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        result[i] = callback.call(context, array[i], i, array);
    }
    return result;
}

exports.bind = require('lodash.bind');
exports.each = require('lodash.foreach');
exports.extend = require('lodash.assign');
exports.filter = require('lodash.filter');
exports.find = require('lodash.find');
exports.isArray = require('isarray');
exports.isFunction = require('lodash.isfunction');
exports.isNumber = require('lodash.isnumber');
exports.isObject = require('lodash.isobject');
exports.isString = require('lodash.isstring');
exports.map = map;
exports.omit = require('lodash.omit');
exports.pick = require('lodash.pick');
exports.reduce = require('lodash.reduce');
exports.some = require('lodash.some');
exports.uniq = require('lodash.uniq');
exports.keys = require('lodash.keys');
exports.noop = noop;













