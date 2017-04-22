/**
 * @file vendor/crypto.js
 * @author leeight
 */

var HmacSHA256 = require('./crypto-js/hmac-sha256');
var Hex = require('./crypto-js/core').enc.Hex;

exports.createHmac = function (type, key) {
    if (type === 'sha256') {
        var result = null;

        var sha256Hmac = {
            update: function (data) {
                /* eslint-disable */
                result = HmacSHA256(data, key).toString(Hex);
                /* eslint-enable */
            },
            digest: function () {
                return result;
            }
        };

        return sha256Hmac;
    }
};









