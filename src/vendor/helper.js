/**
 * @file vendor/helper.js
 * @author leeight
 */

function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

exports.toISOString = function (date) {
    if (date.toISOString) {
        return date.toISOString();
    }
    return date.getUTCFullYear()
        + '-' + pad(date.getUTCMonth() + 1)
        + '-' + pad(date.getUTCDate())
        + 'T' + pad(date.getUTCHours())
        + ':' + pad(date.getUTCMinutes())
        + ':' + pad(date.getUTCSeconds())
        + '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
        + 'Z';
};

exports.toUTCString = function (date) {
    var isoString = exports.toISOString(date);
    return isoString.replace(/\.\d+Z$/, 'Z');
};










