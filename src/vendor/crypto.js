/**
 * @file vendor/crypto.js
 * @author leeight
 */

var CryptoJS = require('crypto-js');

exports.createHmac = function (type, key) {
    if (type === 'sha256') {
        var result = null;

        var sha256Hmac = {
            update: function (data) {
                /* eslint-disable */
                result = CryptoJS.HmacSHA256(data, key).toString(CryptoJS.enc.Hex);
                /* eslint-enable */
            },
            digest: function () {
                return result;
            }
        };

        return sha256Hmac;
    }
};









