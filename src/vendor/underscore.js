/**
 * ag --no-filename -o '\b(u\..*?)\(' .  | sort | uniq -c
 *
 * @file vendor/underscore.js
 * @author leeight
 */

/**
   9 u.bind(
   7 u.each(
  26 u.extend(
   2 u.filter(
   1 u.find(
   7 u.has(
   5 u.isArray(
   4 u.isFunction(
   1 u.isNumber(
   1 u.isObject(
   8 u.isString(
   5 u.map(
   2 u.omit(
   5 u.pick(
   1 u.reduce(
   1 u.some(
   1 u.uniq(
*/

function noop() {
}

exports.bind = require('lodash.bind');
exports.each = require('lodash.foreach');
exports.extend = require('lodash.assign');
exports.filter = require('lodash.filter');
exports.find = require('lodash.find');
exports.has = require('lodash.has');
exports.isArray = require('isarray');
exports.isFunction = require('lodash.isfunction');
exports.isNumber = require('lodash.isnumber');
exports.isObject = require('lodash.isobject');
exports.isString = require('lodash.isstring');
exports.map = require('lodash.map');
exports.omit = require('lodash.omit');
exports.pick = require('lodash.pick');
exports.reduce = require('lodash.reduce');
exports.some = require('lodash.some');
exports.uniq = require('lodash.uniq');
exports.keys = require('lodash.keys');
exports.noop = noop;













