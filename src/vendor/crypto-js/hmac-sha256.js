/**
 * @file hmac-sha256.js
 * @author ???
 */
require('./sha256');
require('./hmac');
var CryptoJS = require('./core');

module.exports = CryptoJS.HmacSHA256;
