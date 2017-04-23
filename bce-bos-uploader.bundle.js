(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.baidubce = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file bce-bos-uploader/index.js
 * @author leeight
 */

var Q = require(44);
var BosClient = require(18);
var Auth = require(16);

var Uploader = require(33);
var utils = require(34);

module.exports = {
    bos: {
        Uploader: Uploader
    },
    utils: utils,
    sdk: {
        Q: Q,
        BosClient: BosClient,
        Auth: Auth
    }
};










},{"16":16,"18":18,"33":33,"34":34,"44":44}],2:[function(require,module,exports){
'use strict';
var mapAsync = require(9);
var doParallelLimit = require(3);
module.exports = doParallelLimit(mapAsync);



},{"3":3,"9":9}],3:[function(require,module,exports){
'use strict';

var eachOfLimit = require(4);

module.exports = function doParallelLimit(fn) {
    return function(obj, limit, iterator, cb) {
        return fn(eachOfLimit(limit), obj, iterator, cb);
    };
};

},{"4":4}],4:[function(require,module,exports){
var once = require(11);
var noop = require(10);
var onlyOnce = require(12);
var keyIterator = require(7);

module.exports = function eachOfLimit(limit) {
    return function(obj, iterator, cb) {
        cb = once(cb || noop);
        obj = obj || [];
        var nextKey = keyIterator(obj);
        if (limit <= 0) {
            return cb(null);
        }
        var done = false;
        var running = 0;
        var errored = false;

        (function replenish() {
            if (done && running <= 0) {
                return cb(null);
            }

            while (running < limit && !errored) {
                var key = nextKey();
                if (key === null) {
                    done = true;
                    if (running <= 0) {
                        cb(null);
                    }
                    return;
                }
                running += 1;
                iterator(obj[key], key, onlyOnce(function(err) {
                    running -= 1;
                    if (err) {
                        cb(err);
                        errored = true;
                    } else {
                        replenish();
                    }
                }));
            }
        })();
    };
};

},{"10":10,"11":11,"12":12,"7":7}],5:[function(require,module,exports){
'use strict';

module.exports = Array.isArray || function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

},{}],6:[function(require,module,exports){
'use strict';

var isArray = require(5);

module.exports = function isArrayLike(arr) {
    return isArray(arr) || (
        // has a positive integer length property
        typeof arr.length === 'number' &&
        arr.length >= 0 &&
        arr.length % 1 === 0
    );
};

},{"5":5}],7:[function(require,module,exports){
'use strict';

var _keys = require(8);
var isArrayLike = require(6);

module.exports = function keyIterator(coll) {
    var i = -1;
    var len;
    var keys;
    if (isArrayLike(coll)) {
        len = coll.length;
        return function next() {
            i++;
            return i < len ? i : null;
        };
    } else {
        keys = _keys(coll);
        len = keys.length;
        return function next() {
            i++;
            return i < len ? keys[i] : null;
        };
    }
};

},{"6":6,"8":8}],8:[function(require,module,exports){
'use strict';

module.exports = Object.keys || function keys(obj) {
    var _keys = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            _keys.push(k);
        }
    }
    return _keys;
};

},{}],9:[function(require,module,exports){
'use strict';

var once = require(11);
var noop = require(10);
var isArrayLike = require(6);

module.exports = function mapAsync(eachfn, arr, iterator, cb) {
    cb = once(cb || noop);
    arr = arr || [];
    var results = isArrayLike(arr) ? [] : {};
    eachfn(arr, function (value, index, cb) {
        iterator(value, function (err, v) {
            results[index] = v;
            cb(err);
        });
    }, function (err) {
        cb(err, results);
    });
};

},{"10":10,"11":11,"6":6}],10:[function(require,module,exports){
'use strict';

module.exports = function noop () {};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function once(fn) {
    return function() {
        if (fn === null) return;
        fn.apply(this, arguments);
        fn = null;
    };
};

},{}],12:[function(require,module,exports){
'use strict';

module.exports = function only_once(fn) {
    return function() {
        if (fn === null) throw new Error('Callback was already called.');
        fn.apply(this, arguments);
        fn = null;
    };
};

},{}],13:[function(require,module,exports){
/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
 * as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && objectToString.call(value) == numberTag);
}

module.exports = isNumber;

},{}],14:[function(require,module,exports){
/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],15:[function(require,module,exports){
/**
 * lodash 4.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @type Function
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{}],16:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/auth.js
 * @author leeight
 */

/* eslint-env node */
/* eslint max-params:[0,10] */

var util = require(47);
var u = require(46);
var H = require(20);
var strings = require(23);

/**
 * Auth
 *
 * @constructor
 * @param {string} ak The access key.
 * @param {string} sk The security key.
 */
function Auth(ak, sk) {
    this.ak = ak;
    this.sk = sk;
}

/**
 * Generate the signature based on http://gollum.baidu.com/AuthenticationMechanism
 *
 * @param {string} method The http request method, such as GET, POST, DELETE, PUT, ...
 * @param {string} resource The request path.
 * @param {Object=} params The query strings.
 * @param {Object=} headers The http request headers.
 * @param {number=} timestamp Set the current timestamp.
 * @param {number=} expirationInSeconds The signature validation time.
 * @param {Array.<string>=} headersToSign The request headers list which will be used to calcualate the signature.
 *
 * @return {string} The signature.
 */
Auth.prototype.generateAuthorization = function (method, resource, params,
                                                 headers, timestamp, expirationInSeconds, headersToSign) {

    var now = timestamp ? new Date(timestamp * 1000) : new Date();
    var rawSessionKey = util.format('bce-auth-v1/%s/%s/%d',
        this.ak, now.toISOString().replace(/\.\d+Z$/, 'Z'), expirationInSeconds || 1800);
    var sessionKey = this.hash(rawSessionKey, this.sk);

    var canonicalUri = this.uriCanonicalization(resource);
    var canonicalQueryString = this.queryStringCanonicalization(params || {});

    var rv = this.headersCanonicalization(headers || {}, headersToSign);
    var canonicalHeaders = rv[0];
    var signedHeaders = rv[1];

    var rawSignature = util.format('%s\n%s\n%s\n%s',
        method, canonicalUri, canonicalQueryString, canonicalHeaders);
    var signature = this.hash(rawSignature, sessionKey);

    if (signedHeaders.length) {
        return util.format('%s/%s/%s', rawSessionKey, signedHeaders.join(';'), signature);
    }

    return util.format('%s//%s', rawSessionKey, signature);
};

Auth.prototype.uriCanonicalization = function (uri) {
    return uri;
};

/**
 * Canonical the query strings.
 *
 * @see http://gollum.baidu.com/AuthenticationMechanism#生成CanonicalQueryString
 * @param {Object} params The query strings.
 * @return {string}
 */
Auth.prototype.queryStringCanonicalization = function (params) {
    var canonicalQueryString = [];
    Object.keys(params).forEach(function (key) {
        if (key.toLowerCase() === H.AUTHORIZATION.toLowerCase()) {
            return;
        }

        var value = params[key] == null ? '' : params[key];
        canonicalQueryString.push(key + '=' + strings.normalize(value));
    });

    canonicalQueryString.sort();

    return canonicalQueryString.join('&');
};

/**
 * Canonical the http request headers.
 *
 * @see http://gollum.baidu.com/AuthenticationMechanism#生成CanonicalHeaders
 * @param {Object} headers The http request headers.
 * @param {Array.<string>=} headersToSign The request headers list which will be used to calcualate the signature.
 * @return {*} canonicalHeaders and signedHeaders
 */
Auth.prototype.headersCanonicalization = function (headers, headersToSign) {
    if (!headersToSign || !headersToSign.length) {
        headersToSign = [H.HOST, H.CONTENT_MD5, H.CONTENT_LENGTH, H.CONTENT_TYPE];
    }

    var headersMap = {};
    headersToSign.forEach(function (item) {
        headersMap[item.toLowerCase()] = true;
    });

    var canonicalHeaders = [];
    Object.keys(headers).forEach(function (key) {
        var value = headers[key];
        value = u.isString(value) ? strings.trim(value) : value;
        if (value == null || value === '') {
            return;
        }
        key = key.toLowerCase();
        if (/^x\-bce\-/.test(key) || headersMap[key] === true) {
            canonicalHeaders.push(util.format('%s:%s',
                // encodeURIComponent(key), encodeURIComponent(value)));
                strings.normalize(key), strings.normalize(value)));
        }
    });

    canonicalHeaders.sort();

    var signedHeaders = [];
    canonicalHeaders.forEach(function (item) {
        signedHeaders.push(item.split(':')[0]);
    });

    return [canonicalHeaders.join('\n'), signedHeaders];
};

Auth.prototype.hash = function (data, key) {
    var crypto = require(41);
    var sha256Hmac = crypto.createHmac('sha256', key);
    sha256Hmac.update(data);
    return sha256Hmac.digest('hex');
};

module.exports = Auth;


},{"20":20,"23":23,"41":41,"46":46,"47":47}],17:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/bce_base_client.js
 * @author leeight
 */

/* eslint-env node */

var EventEmitter = require(42).EventEmitter;
var util = require(47);
var Q = require(44);
var u = require(46);
var config = require(19);
var Auth = require(16);

/**
 * BceBaseClient
 *
 * @constructor
 * @param {Object} clientConfig The bce client configuration.
 * @param {string} serviceId The service id.
 * @param {boolean=} regionSupported The service supported region or not.
 */
function BceBaseClient(clientConfig, serviceId, regionSupported) {
    EventEmitter.call(this);

    this.config = u.extend({}, config.DEFAULT_CONFIG, clientConfig);
    this.serviceId = serviceId;
    this.regionSupported = !!regionSupported;

    this.config.endpoint = this._computeEndpoint();

    /**
     * @type {HttpClient}
     */
    this._httpAgent = null;
}
util.inherits(BceBaseClient, EventEmitter);

BceBaseClient.prototype._computeEndpoint = function () {
    if (this.config.endpoint) {
        return this.config.endpoint;
    }

    if (this.regionSupported) {
        return util.format('%s://%s.%s.%s',
            this.config.protocol,
            this.serviceId,
            this.config.region,
            config.DEFAULT_SERVICE_DOMAIN);
    }
    return util.format('%s://%s.%s',
        this.config.protocol,
        this.serviceId,
        config.DEFAULT_SERVICE_DOMAIN);
};

BceBaseClient.prototype.createSignature = function (credentials, httpMethod, path, params, headers) {
    return Q.fcall(function () {
        var auth = new Auth(credentials.ak, credentials.sk);
        return auth.generateAuthorization(httpMethod, path, params, headers);
    });
};

module.exports = BceBaseClient;


},{"16":16,"19":19,"42":42,"44":44,"46":46,"47":47}],18:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/bos_client.js
 * @author leeight
 */

/* eslint-env node */
/* eslint max-params:[0,10] */

var path = require(43);
var util = require(47);
var u = require(46);
var Buffer = require(35);
var H = require(20);
var strings = require(23);
var HttpClient = require(21);
var BceBaseClient = require(17);
var MimeType = require(22);

var MAX_PUT_OBJECT_LENGTH = 5368709120;     // 5G
var MAX_USER_METADATA_SIZE = 2048;          // 2 * 1024

/**
 * BOS service api
 *
 * @see http://gollum.baidu.com/BOS_API#BOS-API文档
 *
 * @constructor
 * @param {Object} config The bos client configuration.
 * @extends {BceBaseClient}
 */
function BosClient(config) {
    BceBaseClient.call(this, config, 'bos', true);

    /**
     * @type {HttpClient}
     */
    this._httpAgent = null;
}
util.inherits(BosClient, BceBaseClient);

// --- B E G I N ---
BosClient.prototype.deleteObject = function (bucketName, key, options) {
    options = options || {};

    return this.sendRequest('DELETE', {
        bucketName: bucketName,
        key: key,
        config: options.config
    });
};

BosClient.prototype.putObject = function (bucketName, key, data, options) {
    if (!key) {
        throw new TypeError('key should not be empty.');
    }

    options = this._checkOptions(options || {});

    return this.sendRequest('PUT', {
        bucketName: bucketName,
        key: key,
        body: data,
        headers: options.headers,
        config: options.config
    });
};

BosClient.prototype.putObjectFromBlob = function (bucketName, key, blob, options) {
    var headers = {};

    // https://developer.mozilla.org/en-US/docs/Web/API/Blob/size
    headers[H.CONTENT_LENGTH] = blob.size;
    // 对于浏览器调用API的时候，默认不添加 H.CONTENT_MD5 字段，因为计算起来比较慢
    // 而且根据 API 文档，这个字段不是必填的。
    options = u.extend(headers, options);

    return this.putObject(bucketName, key, blob, options);
};

BosClient.prototype.getObjectMetadata = function (bucketName, key, options) {
    options = options || {};

    return this.sendRequest('HEAD', {
        bucketName: bucketName,
        key: key,
        config: options.config
    });
};

BosClient.prototype.initiateMultipartUpload = function (bucketName, key, options) {
    options = options || {};

    var headers = {};
    headers[H.CONTENT_TYPE] = options[H.CONTENT_TYPE] || MimeType.guess(path.extname(key));
    return this.sendRequest('POST', {
        bucketName: bucketName,
        key: key,
        params: {uploads: ''},
        headers: headers,
        config: options.config
    });
};

BosClient.prototype.abortMultipartUpload = function (bucketName, key, uploadId, options) {
    options = options || {};

    return this.sendRequest('DELETE', {
        bucketName: bucketName,
        key: key,
        params: {uploadId: uploadId},
        config: options.config
    });
};

BosClient.prototype.completeMultipartUpload = function (bucketName, key, uploadId, partList, options) {
    var headers = {};
    headers[H.CONTENT_TYPE] = 'application/json; charset=UTF-8';
    options = this._checkOptions(u.extend(headers, options));

    return this.sendRequest('POST', {
        bucketName: bucketName,
        key: key,
        body: JSON.stringify({parts: partList}),
        headers: options.headers,
        params: {uploadId: uploadId},
        config: options.config
    });
};

BosClient.prototype.uploadPartFromBlob = function (bucketName, key, uploadId, partNumber,
                                                   partSize, blob, options) {
    if (blob.size !== partSize) {
        throw new TypeError(util.format('Invalid partSize %d and data length %d',
            partSize, blob.size));
    }

    var headers = {};
    headers[H.CONTENT_LENGTH] = partSize;
    headers[H.CONTENT_TYPE] = 'application/octet-stream';

    options = this._checkOptions(u.extend(headers, options));
    return this.sendRequest('PUT', {
        bucketName: bucketName,
        key: key,
        body: blob,
        headers: options.headers,
        params: {
            partNumber: partNumber,
            uploadId: uploadId
        },
        config: options.config
    });
};

BosClient.prototype.listParts = function (bucketName, key, uploadId, options) {
    /*eslint-disable*/
    if (!uploadId) {
        throw new TypeError('uploadId should not empty');
    }
    /*eslint-enable*/

    var allowedParams = ['maxParts', 'partNumberMarker', 'uploadId'];
    options = this._checkOptions(options || {}, allowedParams);
    options.params.uploadId = uploadId;

    return this.sendRequest('GET', {
        bucketName: bucketName,
        key: key,
        params: options.params,
        config: options.config
    });
};

BosClient.prototype.listMultipartUploads = function (bucketName, options) {
    var allowedParams = ['delimiter', 'maxUploads', 'keyMarker', 'prefix', 'uploads'];

    options = this._checkOptions(options || {}, allowedParams);
    options.params.uploads = '';

    return this.sendRequest('GET', {
        bucketName: bucketName,
        params: options.params,
        config: options.config
    });
};

BosClient.prototype.appendObject = function (bucketName, key, data, offset, options) {
    if (!key) {
        throw new TypeError('key should not be empty.');
    }

    options = this._checkOptions(options || {});
    var params = {append: ''};
    if (u.isNumber(offset)) {
        params.offset = offset;
    }
    return this.sendRequest('POST', {
        bucketName: bucketName,
        key: key,
        body: data,
        headers: options.headers,
        params: params,
        config: options.config
    });
};

BosClient.prototype.appendObjectFromBlob = function (bucketName, key, blob, offset, options) {
    var headers = {};

    // https://developer.mozilla.org/en-US/docs/Web/API/Blob/size
    headers[H.CONTENT_LENGTH] = blob.size;
    // 对于浏览器调用API的时候，默认不添加 H.CONTENT_MD5 字段，因为计算起来比较慢
    // 而且根据 API 文档，这个字段不是必填的。
    options = u.extend(headers, options);

    return this.appendObject(bucketName, key, blob, offset, options);
};

// --- E N D ---

BosClient.prototype.sendRequest = function (httpMethod, varArgs) {
    var defaultArgs = {
        bucketName: null,
        key: null,
        body: null,
        headers: {},
        params: {},
        config: {},
        outputStream: null
    };
    var args = u.extend(defaultArgs, varArgs);

    var config = u.extend({}, this.config, args.config);
    var resource = path.normalize(path.join(
        '/v1',
        strings.normalize(args.bucketName || ''),
        strings.normalize(args.key || '', false)
    )).replace(/\\/g, '/');

    if (config.sessionToken) {
        args.headers[H.SESSION_TOKEN] = config.sessionToken;
    }

    return this.sendHTTPRequest(httpMethod, resource, args, config);
};

BosClient.prototype.sendHTTPRequest = function (httpMethod, resource, args, config) {
    var client = this;
    var agent = this._httpAgent = new HttpClient(config);

    var httpContext = {
        httpMethod: httpMethod,
        resource: resource,
        args: args,
        config: config
    };
    u.each(['progress', 'error', 'abort'], function (eventName) {
        agent.on(eventName, function (evt) {
            client.emit(eventName, evt, httpContext);
        });
    });

    var promise = this._httpAgent.sendRequest(httpMethod, resource, args.body,
        args.headers, args.params, u.bind(this.createSignature, this),
        args.outputStream
    );

    promise.abort = function () {
        if (agent._req && agent._req.xhr) {
            var xhr = agent._req.xhr;
            xhr.abort();
        }
    };

    return promise;
};

BosClient.prototype._checkOptions = function (options, allowedParams) {
    var rv = {};

    rv.config = options.config || {};
    rv.headers = this._prepareObjectHeaders(options);
    rv.params = u.pick(options, allowedParams || []);

    return rv;
};

BosClient.prototype._prepareObjectHeaders = function (options) {
    var allowedHeaders = [
        H.CONTENT_LENGTH,
        H.CONTENT_ENCODING,
        H.CONTENT_MD5,
        H.X_BCE_CONTENT_SHA256,
        H.CONTENT_TYPE,
        H.CONTENT_DISPOSITION,
        H.ETAG,
        H.SESSION_TOKEN,
        H.CACHE_CONTROL,
        H.EXPIRES,
        H.X_BCE_OBJECT_ACL,
        H.X_BCE_OBJECT_GRANT_READ
    ];
    var metaSize = 0;
    var headers = u.pick(options, function (value, key) {
        if (allowedHeaders.indexOf(key) !== -1) {
            return true;
        }
        else if (/^x\-bce\-meta\-/.test(key)) {
            metaSize += Buffer.byteLength(key) + Buffer.byteLength('' + value);
            return true;
        }
    });

    if (metaSize > MAX_USER_METADATA_SIZE) {
        throw new TypeError('Metadata size should not be greater than ' + MAX_USER_METADATA_SIZE + '.');
    }

    if (headers.hasOwnProperty(H.CONTENT_LENGTH)) {
        var contentLength = headers[H.CONTENT_LENGTH];
        if (contentLength < 0) {
            throw new TypeError('content_length should not be negative.');
        }
        else if (contentLength > MAX_PUT_OBJECT_LENGTH) { // 5G
            throw new TypeError('Object length should be less than ' + MAX_PUT_OBJECT_LENGTH
                + '. Use multi-part upload instead.');
        }
    }

    if (headers.hasOwnProperty('ETag')) {
        var etag = headers.ETag;
        if (!/^"/.test(etag)) {
            headers.ETag = util.format('"%s"', etag);
        }
    }

    if (!headers.hasOwnProperty(H.CONTENT_TYPE)) {
        headers[H.CONTENT_TYPE] = 'application/octet-stream';
    }

    return headers;
};

module.exports = BosClient;

},{"17":17,"20":20,"21":21,"22":22,"23":23,"35":35,"43":43,"46":46,"47":47}],19:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/config.js
 * @author leeight
 */

/* eslint-env node */

exports.DEFAULT_SERVICE_DOMAIN = 'baidubce.com';

exports.DEFAULT_CONFIG = {
    protocol: 'http',
    region: 'bj'
};











},{}],20:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/headers.js
 * @author leeight
 */

/* eslint-env node */

exports.CONTENT_TYPE = 'Content-Type';
exports.CONTENT_LENGTH = 'Content-Length';
exports.CONTENT_MD5 = 'Content-MD5';
exports.CONTENT_ENCODING = 'Content-Encoding';
exports.CONTENT_DISPOSITION = 'Content-Disposition';
exports.ETAG = 'ETag';
exports.CONNECTION = 'Connection';
exports.HOST = 'Host';
exports.USER_AGENT = 'User-Agent';
exports.CACHE_CONTROL = 'Cache-Control';
exports.EXPIRES = 'Expires';

exports.AUTHORIZATION = 'Authorization';
exports.X_BCE_DATE = 'x-bce-date';
exports.X_BCE_ACL = 'x-bce-acl';
exports.X_BCE_REQUEST_ID = 'x-bce-request-id';
exports.X_BCE_CONTENT_SHA256 = 'x-bce-content-sha256';
exports.X_BCE_OBJECT_ACL = 'x-bce-object-acl';
exports.X_BCE_OBJECT_GRANT_READ = 'x-bce-object-grant-read';

exports.X_HTTP_HEADERS = 'http_headers';
exports.X_BODY = 'body';
exports.X_STATUS_CODE = 'status_code';
exports.X_MESSAGE = 'message';
exports.X_CODE = 'code';
exports.X_REQUEST_ID = 'request_id';

exports.SESSION_TOKEN = 'x-bce-security-token';

exports.X_VOD_MEDIA_TITLE = 'x-vod-media-title';
exports.X_VOD_MEDIA_DESCRIPTION = 'x-vod-media-description';
exports.ACCEPT_ENCODING = 'accept-encoding';
exports.ACCEPT = 'accept';












},{}],21:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/http_client.js
 * @author leeight
 */

/* eslint-env node */
/* eslint max-params:[0,10] */
/* globals ArrayBuffer */

var EventEmitter = require(42).EventEmitter;
var Buffer = require(35);
var Q = require(44);
var u = require(46);
var util = require(47);
var H = require(20);

/**
 * The HttpClient
 *
 * @constructor
 * @param {Object} config The http client configuration.
 */
function HttpClient(config) {
    EventEmitter.call(this);

    this.config = config;

    /**
     * http(s) request object
     * @type {Object}
     */
    this._req = null;
}
util.inherits(HttpClient, EventEmitter);

/**
 * Send Http Request
 *
 * @param {string} httpMethod GET,POST,PUT,DELETE,HEAD
 * @param {string} path The http request path.
 * @param {(string|Buffer|stream.Readable)=} body The request body. If `body` is a
 * stream, `Content-Length` must be set explicitly.
 * @param {Object=} headers The http request headers.
 * @param {Object=} params The querystrings in url.
 * @param {function():string=} signFunction The `Authorization` signature function
 * @param {stream.Writable=} outputStream The http response body.
 * @param {number=} retry The maximum number of network connection attempts.
 *
 * @resolve {{http_headers:Object,body:Object}}
 * @reject {Object}
 *
 * @return {Q.defer}
 */
HttpClient.prototype.sendRequest = function (httpMethod, path, body, headers, params,
                                             signFunction, outputStream) {

    var requestUrl = this._getRequestUrl(path, params);

    var defaultHeaders = {};
    defaultHeaders[H.X_BCE_DATE] = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    defaultHeaders[H.CONTENT_TYPE] = 'application/json; charset=UTF-8';
    defaultHeaders[H.HOST] = /^\w+:\/\/([^\/]+)/.exec(this.config.endpoint)[1];

    var requestHeaders = u.extend(defaultHeaders, headers);

    // Check the content-length
    if (!requestHeaders.hasOwnProperty(H.CONTENT_LENGTH)) {
        var contentLength = this._guessContentLength(body);
        if (!(contentLength === 0 && /GET|HEAD/i.test(httpMethod))) {
            // 如果是 GET 或 HEAD 请求，并且 Content-Length 是 0，那么 Request Header 里面就不要出现 Content-Length
            // 否则本地计算签名的时候会计算进去，但是浏览器发请求的时候不一定会有，此时导致 Signature Mismatch 的情况
            requestHeaders[H.CONTENT_LENGTH] = contentLength;
        }
    }

    var self = this;
    var createSignature = signFunction || u.noop;
    try {
        return Q.resolve(createSignature(this.config.credentials, httpMethod, path, params, requestHeaders))
            .then(function (authorization, xbceDate) {
                if (authorization) {
                    requestHeaders[H.AUTHORIZATION] = authorization;
                }

                if (xbceDate) {
                    requestHeaders[H.X_BCE_DATE] = xbceDate;
                }

                return self._doRequest(httpMethod, requestUrl,
                    u.omit(requestHeaders, H.CONTENT_LENGTH, H.HOST),
                    body, outputStream);
            });
    }
    catch (ex) {
        return Q.reject(ex);
    }
};

HttpClient.prototype._doRequest = function (httpMethod, requestUrl, requestHeaders, body, outputStream) {
    var deferred = Q.defer();

    var self = this;
    var xhr = new XMLHttpRequest();
    xhr.open(httpMethod, requestUrl, true);
    for (var header in requestHeaders) {
        if (requestHeaders.hasOwnProperty(header)) {
            var value = requestHeaders[header];
            xhr.setRequestHeader(header, value);
        }
    }
    xhr.onerror = function (error) {
        deferred.reject(error);
    };
    xhr.onabort = function () {
        deferred.reject(new Error('xhr aborted'));
    };
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var status = xhr.status;
            if (status === 1223) {
                // IE - #1450: sometimes returns 1223 when it should be 204
                status = 204;
            }

            var contentType = xhr.getResponseHeader('Content-Type');
            var isJSON = /application\/json/.test(contentType);
            var responseBody = isJSON ? JSON.parse(xhr.responseText) : xhr.responseText;

            var isSuccess = status >= 200 && status < 300 || status === 304;
            if (isSuccess) {
                var headers = self._fixHeaders(xhr.getAllResponseHeaders());
                deferred.resolve({
                    http_headers: headers,
                    body: responseBody
                });
            }
            else {
                deferred.reject({
                    status_code: status,
                    message: responseBody.message || '<message>',
                    code: responseBody.code || '<code>',
                    request_id: responseBody.requestId || '<request_id>'
                });
            }
        }
    };
    if (xhr.upload) {
        u.each(['progress', 'error', 'abort'], function (eventName) {
            xhr.upload.addEventListener(eventName, function (evt) {
                if (typeof self.emit === 'function') {
                    self.emit(eventName, evt);
                }
            }, false);
        });
    }
    xhr.send(body);

    self._req = {xhr: xhr};

    return deferred.promise;
};

HttpClient.prototype._guessContentLength = function (data) {
    if (data == null || data === '') {
        return 0;
    }
    else if (u.isString(data)) {
        return Buffer.byteLength(data);
    }
    else if (typeof Blob !== 'undefined' && data instanceof Blob) {
        return data.size;
    }
    else if (typeof ArrayBuffer !== 'undefined' && data instanceof ArrayBuffer) {
        return data.byteLength;
    }

    throw new Error('No Content-Length is specified.');
};

HttpClient.prototype._fixHeaders = function (headers) {
    var fixedHeaders = {};

    if (headers) {
        u.each(headers.split(/\r?\n/), function (line) {
            var idx = line.indexOf(':');
            if (idx !== -1) {
                var key = line.substring(0, idx).toLowerCase();
                var value = line.substring(idx + 1).replace(/^\s+|\s+$/, '');
                if (key === 'etag') {
                    value = value.replace(/"/g, '');
                }
                fixedHeaders[key] = value;
            }
        });
    }

    return fixedHeaders;
};

HttpClient.prototype.buildQueryString = function (params) {
    var urlEncodeStr = require(45).stringify(params);
    // https://en.wikipedia.org/wiki/Percent-encoding
    return urlEncodeStr.replace(/[()'!~.*\-_]/g, function (char) {
        return '%' + char.charCodeAt().toString(16);
    });
};

HttpClient.prototype._getRequestUrl = function (path, params) {
    var uri = path;
    var qs = this.buildQueryString(params);
    if (qs) {
        uri += '?' + qs;
    }

    return this.config.endpoint + uri;
};

module.exports = HttpClient;


},{"20":20,"35":35,"42":42,"44":44,"45":45,"46":46,"47":47}],22:[function(require,module,exports){
/**
 * @file src/mime.types.js
 * @author leeight
 */

/* eslint-env node */

var mimeTypes = {
};

exports.guess = function (ext) {
    if (!ext || !ext.length) {
        return 'application/octet-stream';
    }
    if (ext[0] === '.') {
        ext = ext.substr(1);
    }
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
};

},{}],23:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file strings.js
 * @author leeight
 */

var kEscapedMap = {
    '!': '%21',
    '\'': '%27',
    '(': '%28',
    ')': '%29',
    '*': '%2A'
};

exports.normalize = function (string, encodingSlash) {
    var result = encodeURIComponent(string);
    result = result.replace(/[!'\(\)\*]/g, function ($1) {
        return kEscapedMap[$1];
    });

    if (encodingSlash === false) {
        result = result.replace(/%2F/gi, '/');
    }

    return result;
};

exports.trim = function (string) {
    return (string || '').replace(/^\s+|\s+$/g, '');
};


},{}],24:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file config.js
 * @author leeight
 */


var kDefaultOptions = {
    runtimes: 'html5',

    // bos服务器的地址，默认(http://bos.bj.baidubce.com)
    bos_endpoint: 'http://bos.bj.baidubce.com',

    // 默认的 ak 和 sk 配置
    bos_credentials: null,

    // 如果切换到 appendable 模式，最大只支持 5G 的文件
    // 不再支持 Multipart 的方式上传文件
    bos_appendable: false,

    // 为了处理 Flash 不能发送 HEAD, DELETE 之类的请求，以及无法
    // 获取 response headers 的问题，需要搞一个 relay 服务器，把数据
    // 格式转化一下
    bos_relay_server: 'https://relay.efe.tech',

    // 是否支持多选，默认(false)
    multi_selection: false,

    // 失败之后重试的次数(单个文件或者分片)，默认(0)，不重试
    max_retries: 0,

    // 失败重试的间隔时间，默认 1000ms
    retry_interval: 1000,

    // 是否自动上传，默认(false)
    auto_start: false,

    // 最大可以选择的文件大小，默认(100M)
    max_file_size: '100mb',

    // 超过这个文件大小之后，开始使用分片上传，默认(10M)
    bos_multipart_min_size: '10mb',

    // 分片上传的时候，并行上传的个数，默认(1)
    bos_multipart_parallel: 1,

    // 队列中的文件，并行上传的个数，默认(3)
    bos_task_parallel: 3,

    // 计算签名的时候，有些 header 需要剔除，减少传输的体积
    auth_stripped_headers: ['User-Agent', 'Connection'],

    // 分片上传的时候，每个分片的大小，默认(4M)
    chunk_size: '4mb',

    // 分块上传时,是否允许断点续传，默认(true)
    bos_multipart_auto_continue: true,

    // 分开上传的时候，localStorage里面key的生成方式，默认是 `default`
    // 如果需要自定义，可以通过 XXX
    bos_multipart_local_key_generator: 'default',

    // 是否允许选择目录
    dir_selection: false,

    // 是否需要每次都去服务器计算签名
    get_new_uptoken: true,

    // 因为使用 Form Post 的格式，没有设置额外的 Header，从而可以保证
    // 使用 Flash 也能上传大文件
    // 低版本浏览器上传文件的时候，需要设置 policy，默认情况下
    // policy的内容只需要包含 expiration 和 conditions 即可
    // policy: {
    //   expiration: 'xx',
    //   conditions: [
    //     {bucket: 'the-bucket-name'}
    //   ]
    // }
    // bos_policy: null,

    // 低版本浏览器上传文件的时候，需要设置 policy_signature
    // 如果没有设置 bos_policy_signature 的话，会通过 uptoken_url 来请求
    // 默认只会请求一次，如果失效了，需要手动来重置 policy_signature
    // bos_policy_signature: null,

    // JSONP 默认的超时时间(5000ms)
    uptoken_via_jsonp: true,
    uptoken_timeout: 5000,
    uptoken_jsonp_timeout: 5000,    // 不支持了，后续建议用 uptoken_timeout

    // 是否要禁用统计，默认不禁用
    // 如果需要禁用，把 tracker_id 设置成 null 即可
    tracker_id: '2e0bc8c5e7ceb25796ba4962e7b57387'
};

module.exports = kDefaultOptions;











},{}],25:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"), you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file events.js
 * @author leeight
 */

module.exports = {
    kPostInit: 'PostInit',
    kKey: 'Key',
    kListParts: 'ListParts',
    kObjectMetas: 'ObjectMetas',
    // kFilesRemoved  : 'FilesRemoved',
    kFileFiltered: 'FileFiltered',
    kFilesAdded: 'FilesAdded',
    kFilesFilter: 'FilesFilter',
    kNetworkSpeed: 'NetworkSpeed',
    kBeforeUpload: 'BeforeUpload',
    // kUploadFile    : 'UploadFile',       // ??
    kUploadProgress: 'UploadProgress',
    kFileUploaded: 'FileUploaded',
    kUploadPartProgress: 'UploadPartProgress',
    kChunkUploaded: 'ChunkUploaded',
    kUploadResume: 'UploadResume', // 断点续传
    // kUploadPause: 'UploadPause',   // 暂停
    kUploadResumeError: 'UploadResumeError', // 尝试断点续传失败
    kUploadComplete: 'UploadComplete',
    kError: 'Error',
    kAborted: 'Aborted'
};

},{}],26:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file multipart_task.js
 * @author leeight
 */

var Q = require(44);
var async = require(36);
var u = require(46);
var utils = require(34);
var events = require(25);
var Task = require(31);

/**
 * MultipartTask
 *
 * @class
 */
function MultipartTask() {
    Task.apply(this, arguments);

    /**
     * 批量上传的时候，保存的 xhrRequesting 对象
     * 如果需要 abort 的时候，从这里来获取
     */
    this.xhrPools = [];
}
utils.inherits(MultipartTask, Task);

MultipartTask.prototype.start = function () {
    if (this.aborted) {
        return Q.resolve();
    }

    var self = this;

    var dispatcher = this.eventDispatcher;

    var file = this.options.file;
    var bucket = this.options.bucket;
    var object = this.options.object;
    var metas = this.options.metas;
    var chunkSize = this.options.chunk_size;
    var multipartParallel = this.options.bos_multipart_parallel;

    var contentType = utils.guessContentType(file);
    var options = {'Content-Type': contentType};
    var uploadId = null;

    return this._initiateMultipartUpload(file, chunkSize, bucket, object, options)
        .then(function (response) {
            uploadId = response.body.uploadId;
            var parts = response.body.parts || [];
            // 准备 uploadParts
            var deferred = Q.defer();
            var tasks = utils.getTasks(file, uploadId, chunkSize, bucket, object);
            utils.filterTasks(tasks, parts);

            var loaded = parts.length;
            // 这个用来记录整体 Parts 的上传进度，不是单个 Part 的上传进度
            // 单个 Part 的上传进度可以监听 kUploadPartProgress 来得到
            var state = {
                lengthComputable: true,
                loaded: loaded,
                total: tasks.length
            };
            if (loaded) {
                dispatcher.dispatchEvent(events.kUploadProgress, [file, loaded / tasks.length, null]);
            }

            async.mapLimit(tasks, multipartParallel, self._uploadPart(state),
                function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    }
                    else {
                        deferred.resolve(results);
                    }
                });

            return deferred.promise;
        })
        .then(function (responses) {
            var partList = [];
            u.each(responses, function (response, index) {
                partList.push({
                    partNumber: index + 1,
                    eTag: response.http_headers.etag
                });
            });
            // 全部上传结束后删除localStorage
            self._generateLocalKey({
                blob: file,
                chunkSize: chunkSize,
                bucket: bucket,
                object: object
            }).then(function (key) {
                utils.removeUploadId(key);
            });
            return self.client.completeMultipartUpload(bucket, object, uploadId, partList, metas);
        })
        .then(function (response) {
            dispatcher.dispatchEvent(events.kUploadProgress, [file, 1]);

            response.body.bucket = bucket;
            response.body.object = object;

            dispatcher.dispatchEvent(events.kFileUploaded, [file, response]);
        })[
        "catch"](function (error) {
            var eventType = self.aborted ? events.kAborted : events.kError;
            dispatcher.dispatchEvent(eventType, [error, file]);
        });
};


MultipartTask.prototype._initiateMultipartUpload = function (file, chunkSize, bucket, object, options) {
    var self = this;
    var dispatcher = this.eventDispatcher;

    var uploadId;
    var localSaveKey;

    function initNewMultipartUpload() {
        return self.client.initiateMultipartUpload(bucket, object, options)
            .then(function (response) {
                if (localSaveKey) {
                    utils.setUploadId(localSaveKey, response.body.uploadId);
                }

                response.body.parts = [];
                return response;
            });
    }

    var keyOptions = {
        blob: file,
        chunkSize: chunkSize,
        bucket: bucket,
        object: object
    };
    var promise = this.options.bos_multipart_auto_continue
        ? this._generateLocalKey(keyOptions)
        : Q.resolve(null);

    return promise.then(function (key) {
            localSaveKey = key;
            if (!localSaveKey) {
                return initNewMultipartUpload();
            }

            uploadId = utils.getUploadId(localSaveKey);
            if (!uploadId) {
                return initNewMultipartUpload();
            }

            return self._listParts(file, bucket, object, uploadId);
        })
        .then(function (response) {
            if (uploadId && localSaveKey) {
                var parts = response.body.parts;
                // listParts 的返回结果
                dispatcher.dispatchEvent(events.kUploadResume, [file, parts, null]);
                response.body.uploadId = uploadId;
            }
            return response;
        })[
        "catch"](function (error) {
            if (uploadId && localSaveKey) {
                // 如果获取已上传分片失败，则重新上传。
                dispatcher.dispatchEvent(events.kUploadResumeError, [file, error, null]);
                utils.removeUploadId(localSaveKey);
                return initNewMultipartUpload();
            }
            throw error;
        });
};

MultipartTask.prototype._generateLocalKey = function (options) {
    var generator = this.options.bos_multipart_local_key_generator;
    return utils.generateLocalKey(options, generator);
};

MultipartTask.prototype._listParts = function (file, bucket, object, uploadId) {
    var self = this;
    var dispatcher = this.eventDispatcher;

    var localParts = dispatcher.dispatchEvent(events.kListParts, [file, uploadId]);

    return Q.resolve(localParts)
        .then(function (parts) {
            if (u.isArray(parts) && parts.length) {
                return {
                    http_headers: {},
                    body: {
                        parts: parts
                    }
                };
            }

            // 如果返回的不是数组，就调用 listParts 接口从服务器获取数据
            return self._listAllParts(bucket, object, uploadId);
        });
};

MultipartTask.prototype._listAllParts = function (bucket, object, uploadId) {
    // isTruncated === true / false
    var self = this;
    var deferred = Q.defer();

    var parts = [];
    var payload = null;
    var maxParts = 1000;          // 每次的分页
    var partNumberMarker = 0;     // 分隔符

    function listParts() {
        var options = {
            maxParts: maxParts,
            partNumberMarker: partNumberMarker
        };
        self.client.listParts(bucket, object, uploadId, options)
            .then(function (response) {
                if (payload == null) {
                    payload = response;
                }

                parts.push.apply(parts, response.body.parts);
                partNumberMarker = response.body.nextPartNumberMarker;

                if (response.body.isTruncated === false) {
                    // 结束了
                    payload.body.parts = parts;
                    deferred.resolve(payload);
                }
                else {
                    // 递归调用
                    listParts();
                }
            })[
            "catch"](function (error) {
                deferred.reject(error);
            });
    }
    listParts();

    return deferred.promise;
};

MultipartTask.prototype._uploadPart = function (state) {
    var self = this;
    var dispatcher = this.eventDispatcher;

    function uploadPartInner(item, opt_maxRetries) {
        if (item.etag) {
            self.networkInfo.loadedBytes += item.partSize;

            // 跳过已上传的part
            return Q.resolve({
                http_headers: {
                    etag: item.etag
                },
                body: {}
            });
        }
        var maxRetries = opt_maxRetries == null
            ? self.options.max_retries
            : opt_maxRetries;
        var retryInterval = self.options.retry_interval;

        var blob = item.file.slice(item.start, item.stop + 1);
        blob._previousLoaded = 0;

        var uploadPartXhr = self.client.uploadPartFromBlob(item.bucket, item.object,
            item.uploadId, item.partNumber, item.partSize, blob);
        var xhrPoolIndex = self.xhrPools.push(uploadPartXhr);

        return uploadPartXhr.then(function (response) {
                ++state.loaded;
                var progress = state.loaded / state.total;
                dispatcher.dispatchEvent(events.kUploadProgress, [item.file, progress, null]);

                var result = {
                    uploadId: item.uploadId,
                    partNumber: item.partNumber,
                    partSize: item.partSize,
                    bucket: item.bucket,
                    object: item.object,
                    offset: item.start,
                    total: blob.size,
                    response: response
                };
                dispatcher.dispatchEvent(events.kChunkUploaded, [item.file, result]);

                // 不用删除，设置为 null 就好了，反正 abort 的时候会判断的
                self.xhrPools[xhrPoolIndex - 1] = null;

                return response;
            })[
            "catch"](function (error) {
                if (maxRetries > 0 && !self.aborted) {
                    // 还有重试的机会
                    return utils.delay(retryInterval).then(function () {
                        return uploadPartInner(item, maxRetries - 1);
                    });
                }
                // 没有机会重试了 :-(
                throw error;
            });

    }

    return function (item, callback) {
        // file: file,
        // uploadId: uploadId,
        // bucket: bucket,
        // object: object,
        // partNumber: partNumber,
        // partSize: partSize,
        // start: offset,
        // stop: offset + partSize - 1

        var resolve = function (response) {
            callback(null, response);
        };
        var reject = function (error) {
            callback(error);
        };

        uploadPartInner(item).then(resolve, reject);
    };
};

/**
 * 终止上传任务
 */
MultipartTask.prototype.abort = function () {
    this.aborted = true;
    this.xhrRequesting = null;
    for (var i = 0; i < this.xhrPools.length; i++) {
        var xhr = this.xhrPools[i];
        if (xhr && typeof xhr.abort === 'function') {
            xhr.abort();
        }
    }
};


module.exports = MultipartTask;

},{"25":25,"31":31,"34":34,"36":36,"44":44,"46":46}],27:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/network_info.js
 * @author leeight
 */

var utils = require(34);

/**
 * NetworkInfo
 *
 * @class
 */
function NetworkInfo() {
    /**
     * 记录从 start 开始已经上传的字节数.
     * @type {number}
     */
    this.loadedBytes = 0;

    /**
     * 记录队列中总文件的大小, UploadComplete 之后会被清零
     * @type {number}
     */
    this.totalBytes = 0;

    /**
     * 记录开始上传的时间.
     * @type {number}
     */
    this._startTime = utils.now();

    this.reset();
}

NetworkInfo.prototype.dump = function () {
    return [
        this.loadedBytes,                     // 已经上传的
        utils.now() - this._startTime,        // 花费的时间
        this.totalBytes - this.loadedBytes    // 剩余未上传的
    ];
};

NetworkInfo.prototype.reset = function () {
    this.loadedBytes = 0;
    this._startTime = utils.now();
};

module.exports = NetworkInfo;

},{"34":34}],28:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file put_object_task.js
 * @author leeight
 */

var Q = require(44);
var u = require(46);
var utils = require(34);
var events = require(25);
var Task = require(31);

/**
 * PutObjectTask
 *
 * @class
 */
function PutObjectTask() {
    Task.apply(this, arguments);
}
utils.inherits(PutObjectTask, Task);

PutObjectTask.prototype.start = function (opt_maxRetries) {
    if (this.aborted) {
        return Q.resolve();
    }

    var self = this;

    var dispatcher = this.eventDispatcher;

    var file = this.options.file;
    var bucket = this.options.bucket;
    var object = this.options.object;
    var metas = this.options.metas;
    var maxRetries = opt_maxRetries == null
        ? this.options.max_retries
        : opt_maxRetries;
    var retryInterval = this.options.retry_interval;

    var contentType = utils.guessContentType(file);
    var options = u.extend({'Content-Type': contentType}, metas);

    this.xhrRequesting = this.client.putObjectFromBlob(bucket, object, file, options);

    return this.xhrRequesting.then(function (response) {
        dispatcher.dispatchEvent(events.kUploadProgress, [file, 1]);

        response.body.bucket = bucket;
        response.body.object = object;

        dispatcher.dispatchEvent(events.kFileUploaded, [file, response]);
    })[
    "catch"](function (error) {
        var eventType = self.aborted ? events.kAborted : events.kError;
        dispatcher.dispatchEvent(eventType, [error, file]);

        if (error.status_code && error.code && error.request_id) {
            // 应该是正常的错误(比如签名异常)，这种情况就不要重试了
            return Q.resolve();
        }
        // else if (error.status_code === 0) {
        //    // 可能是断网了，safari 触发 online/offline 延迟比较久
        //    // 我们推迟一下 self._uploadNext() 的时机
        //    self.pause();
        //    return;
        // }
        else if (maxRetries > 0 && !self.aborted) {
            // 还有机会重试
            return utils.delay(retryInterval).then(function () {
                return self.start(maxRetries - 1);
            });
        }

        // 重试结束了，不管了，继续下一个文件的上传
        return Q.resolve();
    });
};


module.exports = PutObjectTask;

},{"25":25,"31":31,"34":34,"44":44,"46":46}],29:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/queue.js
 * @author leeight
 */

/**
 * Queue
 *
 * @class
 * @param {*} collection The collection.
 */
function Queue(collection) {
    this.collection = collection;
}

Queue.prototype.isEmpty = function () {
    return this.collection.length <= 0;
};

Queue.prototype.size = function () {
    return this.collection.length;
};

Queue.prototype.dequeue = function () {
    return this.collection.shift();
};

module.exports = Queue;











},{}],30:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file sts_token_manager.js
 * @author leeight
 */

var Q = require(44);
var utils = require(34);

/**
 * StsTokenManager
 *
 * @class
 * @param {Object} options The options.
 */
function StsTokenManager(options) {
    this.options = options;

    this._cache = {};
}

StsTokenManager.prototype.get = function (bucket) {
    var self = this;

    if (self._cache[bucket] != null) {
        return self._cache[bucket];
    }

    return Q.resolve(this._getImpl.apply(this, arguments)).then(function (payload) {
        self._cache[bucket] = payload;
        return payload;
    });
};

StsTokenManager.prototype._getImpl = function (bucket) {
    var options = this.options;
    var uptoken_url = options.uptoken_url;
    var timeout = options.uptoken_timeout || options.uptoken_jsonp_timeout;
    var viaJsonp = options.uptoken_via_jsonp;

    var deferred = Q.defer();
    $.ajax({
        url: uptoken_url,
        jsonp: viaJsonp ? 'callback' : false,
        dataType: viaJsonp ? 'jsonp' : 'json',
        timeout: timeout,
        data: {
            sts: JSON.stringify(utils.getDefaultACL(bucket))
        },
        success: function (payload) {
            // payload.AccessKeyId
            // payload.SecretAccessKey
            // payload.SessionToken
            // payload.Expiration
            deferred.resolve(payload);
        },
        error: function () {
            deferred.reject(new Error('Get sts token timeout (' + timeout + 'ms).'));
        }
    });

    return deferred.promise;
};

module.exports = StsTokenManager;

},{"34":34,"44":44}],31:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file task.js
 * @author leeight
 */


/**
 * 不同的场景下，需要通过不同的Task来完成上传的工作
 *
 * @param {sdk.BosClient} client The bos client.
 * @param {EventDispatcher} eventDispatcher The event dispatcher.
 * @param {Object} options The extra task-related arguments.
 *
 * @constructor
 */
function Task(client, eventDispatcher, options) {
    /**
     * 可以被 abort 的 promise 对象
     *
     * @type {Promise}
     */
    this.xhrRequesting = null;

    /**
     * 标记一下是否是人为中断了
     *
     * @type {boolean}
     */
    this.aborted = false;

    this.networkInfo = null;

    this.client = client;
    this.eventDispatcher = eventDispatcher;
    this.options = options;
}

function abstractMethod() {
    throw new Error('unimplemented method.');
}

/**
 * 开始上传任务
 */
Task.prototype.start = abstractMethod;

/**
 * 暂停上传
 */
Task.prototype.pause = abstractMethod;

/**
 * 恢复暂停
 */
Task.prototype.resume = abstractMethod;

Task.prototype.setNetworkInfo = function (networkInfo) {
    this.networkInfo = networkInfo;
};

/**
 * 终止上传任务
 */
Task.prototype.abort = function () {
    if (this.xhrRequesting
        && typeof this.xhrRequesting.abort === 'function') {
        this.aborted = true;
        this.xhrRequesting.abort();
        this.xhrRequesting = null;
    }
};

module.exports = Task;

},{}],32:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file src/tracker.js
 * @author leeight
 */


/**
 * 初始化百度统计代码
 *
 * @param {string} siteId 百度统计站点ID.
 */
exports.init = function (siteId) {
    var hm = document.createElement('script');
    hm.src = '//hm.baidu.com/hm.js?' + siteId;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
};











},{}],33:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file uploader.js
 * @author leeight
 */

var Q = require(44);
var u = require(46);
var utils = require(34);
var tracker = require(32);
var events = require(25);
var kDefaultOptions = require(24);
var PutObjectTask = require(28);
var MultipartTask = require(26);
var StsTokenManager = require(30);
var NetworkInfo = require(27);

var Auth = require(16);
var BosClient = require(18);

/**
 * BCE BOS Uploader
 *
 * @constructor
 * @param {Object|string} options 配置参数
 */
function Uploader(options) {
    if (u.isString(options)) {
        // 支持简便的写法，可以从 DOM 里面分析相关的配置.
        options = u.extend({
            browse_button: options,
            auto_start: true
        }, $(options).data());
    }

    var runtimeOptions = {};
    this.options = u.extend({}, kDefaultOptions, runtimeOptions, options);
    this.options.max_file_size = utils.parseSize(this.options.max_file_size);
    this.options.bos_multipart_min_size
        = utils.parseSize(this.options.bos_multipart_min_size);
    this.options.chunk_size = utils.parseSize(this.options.chunk_size);

    var credentials = this.options.bos_credentials;
    if (!credentials && this.options.bos_ak && this.options.bos_sk) {
        this.options.bos_credentials = {
            ak: this.options.bos_ak,
            sk: this.options.bos_sk
        };
    }

    /**
     * @type {BosClient}
     */
    this.client = new BosClient({
        endpoint: utils.normalizeEndpoint(this.options.bos_endpoint),
        credentials: this.options.bos_credentials,
        sessionToken: this.options.uptoken
    });

    /**
     * 需要等待上传的文件列表，每次上传的时候，从这里面删除
     * 成功或者失败都不会再放回去了
     * @param {Array.<File>}
     */
    this._files = [];

    /**
     * 正在上传的文件列表.
     *
     * @type {Object.<string, File>}
     */
    this._uploadingFiles = {};

    /**
     * 是否被中断了，比如 this.stop
     * @type {boolean}
     */
    this._abort = false;

    /**
     * 是否处于上传的过程中，也就是正在处理 this._files 队列的内容.
     * @type {boolean}
     */
    this._working = false;

    /**
     * 是否支持xhr2
     * @type {boolean}
     */
    this._xhr2Supported = utils.isXhr2Supported();

    this._networkInfo = new NetworkInfo();

    this._init();
}

Uploader.prototype._getCustomizedSignature = function (uptokenUrl) {
    var options = this.options;
    var timeout = options.uptoken_timeout || options.uptoken_jsonp_timeout;
    var viaJsonp = options.uptoken_via_jsonp;

    return function (_, httpMethod, path, params, headers) {
        if (/\bed=([\w\.]+)\b/.test(location.search)) {
            headers.Host = RegExp.$1;
        }

        if (u.isArray(options.auth_stripped_headers)) {
            headers = u.omit(headers, options.auth_stripped_headers);
        }

        var deferred = Q.defer();
        $.ajax({
            url: uptokenUrl,
            jsonp: viaJsonp ? 'callback' : false,
            dataType: viaJsonp ? 'jsonp' : 'json',
            timeout: timeout,
            data: {
                httpMethod: httpMethod,
                path: path,
                // delay: ~~(Math.random() * 10),
                queries: JSON.stringify(params || {}),
                headers: JSON.stringify(headers || {})
            },
            error: function () {
                deferred.reject(new Error('Get authorization timeout (' + timeout + 'ms).'));
            },
            success: function (payload) {
                if (payload.statusCode === 200 && payload.signature) {
                    deferred.resolve(payload.signature, payload.xbceDate);
                }
                else {
                    deferred.reject(new Error('createSignature failed, statusCode = ' + payload.statusCode));
                }
            }
        });
        return deferred.promise;
    };
};

/**
 * 调用 this.options.init 里面配置的方法
 *
 * @param {string} methodName 方法名称
 * @param {Array.<*>} args 调用时候的参数.
 * @param {boolean=} throwErrors 如果发生异常的时候，是否需要抛出来
 * @return {*} 事件的返回值.
 */
Uploader.prototype._invoke = function (methodName, args, throwErrors) {
    var init = this.options.init || this.options.Init;
    if (!init) {
        return;
    }

    var method = init[methodName];
    if (typeof method !== 'function') {
        return;
    }

    try {
        var up = null;
        args = args == null ? [up] : [up].concat(args);
        return method.apply(null, args);
    }
    catch (ex) {
        if (throwErrors === true) {
            return Q.reject(ex);
        }
    }
};

/**
 * 初始化控件.
 */
Uploader.prototype._init = function () {
    var options = this.options;
    var accept = options.accept;

    if (options.tracker_id) {
        tracker.init(options.tracker_id);
    }

    var btnElement = $(options.browse_button);
    var nodeName = btnElement.prop('nodeName');
    if (nodeName !== 'INPUT') {
        var elementContainer = btnElement;

        // 如果本身不是 <input type="file" />，自动追加一个上去
        // 1. options.browse_button 后面追加一个元素 <div><input type="file" /></div>
        // 2. btnElement.parent().css('position', 'relative');
        // 3. .bce-bos-uploader-input-container 用来自定义自己的样式
        var width = elementContainer.outerWidth();
        var height = elementContainer.outerHeight();

        var inputElementContainer = $('<div class="bce-bos-uploader-input-container"><input type="file" /></div>');
        inputElementContainer.css({
            'position': 'absolute',
            'top': 0, 'left': 0,
            'width': width, 'height': height,
            'overflow': 'hidden',
            // 如果支持 xhr2，把 input[type=file] 放到按钮的下面，通过主动调用 file.click() 触发
            // 如果不支持xhr2, 把 input[type=file] 放到按钮的上面，通过用户主动点击 input[type=file] 触发
            'z-index': this._xhr2Supported ? 99 : 100
        });
        inputElementContainer.find('input').css({
            'position': 'absolute',
            'top': 0, 'left': 0,
            'width': '100%', 'height': '100%',
            'font-size': '999px',
            'opacity': 0
        });
        elementContainer.css({
            'position': 'relative',
            'z-index': this._xhr2Supported ? 100 : 99
        });
        elementContainer.after(inputElementContainer);
        elementContainer.parent().css('position', 'relative');

        // 把 browse_button 修改为当前生成的那个元素
        options.browse_button = inputElementContainer.find('input');

        if (this._xhr2Supported) {
            elementContainer.click(function () {
                options.browse_button.click();
            });
        }
    }

    var self = this;
    if (!this._xhr2Supported
        && typeof mOxie !== 'undefined'
        && u.isFunction(mOxie.FileInput)) {
        // https://github.com/moxiecode/moxie/wiki/FileInput
        // mOxie.FileInput 只支持
        // [+]: browse_button, accept multiple, directory, file
        // [x]: container, required_caps
        var fileInput = new mOxie.FileInput({
            runtime_order: 'flash,html4',
            browse_button: $(options.browse_button).get(0),
            swf_url: options.flash_swf_url,
            accept: utils.expandAcceptToArray(accept),
            multiple: options.multi_selection,
            directory: options.dir_selection,
            file: 'file'      // PostObject接口要求固定是 'file'
        });

        fileInput.onchange = u.bind(this._onFilesAdded, this);
        fileInput.onready = function () {
            self._initEvents();
            self._invoke(events.kPostInit);
        };

        fileInput.init();
    }

    var promise = options.bos_credentials
        ? Q.resolve()
        : self.refreshStsToken();

    promise.then(function () {
        if (options.bos_credentials) {
            self.client.createSignature = function (_, httpMethod, path, params, headers) {
                var credentials = _ || this.config.credentials;
                return Q.fcall(function () {
                    var auth = new Auth(credentials.ak, credentials.sk);
                    return auth.generateAuthorization(httpMethod, path, params, headers);
                });
            };
        }
        else if (options.uptoken_url && options.get_new_uptoken === true) {
            // 服务端动态签名的方式
            self.client.createSignature = self._getCustomizedSignature(options.uptoken_url);
        }

        if (self._xhr2Supported) {
            // 对于不支持 xhr2 的情况，会在 onready 的时候去触发事件
            self._initEvents();
            self._invoke(events.kPostInit);
        }
    })["catch"](function (error) {
        self._invoke(events.kError, [error]);
    });
};

Uploader.prototype._initEvents = function () {
    var options = this.options;

    if (this._xhr2Supported) {
        var btn = $(options.browse_button);
        if (btn.attr('multiple') == null) {
            // 如果用户没有显示的设置过 multiple，使用 multi_selection 的设置
            // 否则保留 <input multiple /> 的内容
            btn.attr('multiple', !!options.multi_selection);
        }
        btn.on('change', u.bind(this._onFilesAdded, this));

        var accept = options.accept;
        if (accept != null) {
            // Safari 只支持 mime-type
            // Chrome 支持 mime-type 和 exts
            // Firefox 只支持 exts
            // NOTE: exts 必须有 . 这个前缀，例如 .txt 是合法的，txt 是不合法的
            var exts = utils.expandAccept(accept);
            var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
            if (isSafari) {
                exts = utils.extToMimeType(exts);
            }
            btn.attr('accept', exts);
        }

        if (options.dir_selection) {
            btn.attr('directory', true);
            btn.attr('mozdirectory', true);
            btn.attr('webkitdirectory', true);
        }
    }

    this.client.on('progress', u.bind(this._onUploadProgress, this));
    // XXX 必须绑定 error 的处理函数，否则会 throw new Error
    this.client.on('error', u.bind(this._onError, this));

    // $(window).on('online', u.bind(this._handleOnlineStatus, this));
    // $(window).on('offline', u.bind(this._handleOfflineStatus, this));

    if (!this._xhr2Supported) {
        // 如果浏览器不支持 xhr2，那么就切换到 mOxie.XMLHttpRequest
        // 但是因为 mOxie.XMLHttpRequest 无法发送 HEAD 请求，无法获取 Response Headers，
        // 因此 getObjectMetadata实际上无法正常工作，因此我们需要：
        // 1. 让 BOS 新增 REST API，在 GET 的请求的同时，把 x-bce-* 放到 Response Body 返回
        // 2. 临时方案：新增一个 Relay 服务，实现方案 1
        //    GET /bj.bcebos.com/v1/bucket/object?httpMethod=HEAD
        //    Host: relay.efe.tech
        //    Authorization: xxx
        // options.bos_relay_server
        // options.swf_url
        this.client.sendHTTPRequest = u.bind(utils.fixXhr(this.options, true), this.client);
    }
};

Uploader.prototype._filterFiles = function (candidates) {
    var self = this;

    // 如果 maxFileSize === 0 就说明不限制大小
    var maxFileSize = this.options.max_file_size;

    var files = u.filter(candidates, function (file) {
        if (maxFileSize > 0 && file.size > maxFileSize) {
            self._invoke(events.kFileFiltered, [file]);
            return false;
        }

        // TODO
        // 检查后缀之类的

        return true;
    });

    return this._invoke(events.kFilesFilter, [files]) || files;
};

function buildAbortHandler(item, self) {
    return function () {
        item._aborted = true;
        self._invoke(events.kAborted, [null, item]);
    };
}

Uploader.prototype._onFilesAdded = function (e) {
    var self = this;
    var files = e.target.files;
    if (!files) {
        // IE7, IE8 低版本浏览器的处理
        var name = e.target.value.split(/[\/\\]/).pop();
        files = [
            {name: name, size: 0}
        ];
    }
    files = this._filterFiles(files);
    if (u.isArray(files) && files.length) {
        var totalBytes = 0;
        for (var i = 0; i < files.length; i++) {
            var item = files[i];

            // 这里是 abort 的默认实现，开始上传的时候，会改成另外的一种实现方式
            // 默认的实现是为了支持在没有开始上传之前，也可以取消上传的需求
            item.abort = buildAbortHandler(item, self);

            // 内部的 uuid，外部也可以使用，比如 remove(item.uuid) / remove(item)
            item.uuid = utils.uuid();

            totalBytes += item.size;
        }
        this._networkInfo.totalBytes += totalBytes;
        this._files.push.apply(this._files, files);
        this._invoke(events.kFilesAdded, [files]);
    }

    if (this.options.auto_start) {
        this.start();
    }
};

Uploader.prototype._onError = function (e) {
};

/**
 * 处理上传进度的回掉函数.
 * 1. 这里要区分文件的上传还是分片的上传，分片的上传是通过 partNumber 和 uploadId 的组合来判断的
 * 2. IE6,7,8,9下面，是不需要考虑的，因为不会触发这个事件，而是直接在 _sendPostRequest 触发 kUploadProgress 了
 * 3. 其它情况下，我们判断一下 Request Body 的类型是否是 Blob，从而避免对于其它类型的请求，触发 kUploadProgress
 *    例如：HEAD，GET，POST(InitMultipart) 的时候，是没必要触发 kUploadProgress 的
 *
 * @param {Object} e  Progress Event 对象.
 * @param {Object} httpContext sendHTTPRequest 的参数
 */
Uploader.prototype._onUploadProgress = function (e, httpContext) {
    var args = httpContext.args;
    var file = args.body;

    if (!utils.isBlob(file)) {
        return;
    }

    var progress = e.lengthComputable
        ? e.loaded / e.total
        : 0;

    this._networkInfo.loadedBytes += (e.loaded - file._previousLoaded);
    this._invoke(events.kNetworkSpeed, this._networkInfo.dump());
    file._previousLoaded = e.loaded;

    var eventType = events.kUploadProgress;
    if (args.params.partNumber && args.params.uploadId) {
        // IE6,7,8,9下面不会有partNumber和uploadId
        // 此时的 file 是 slice 的结果，可能没有自定义的属性
        // 比如 demo 里面的 __id, __mediaId 之类的
        eventType = events.kUploadPartProgress;
    }

    this._invoke(eventType, [file, progress, e]);
};

Uploader.prototype.remove = function (item) {
    if (typeof item === 'string') {
        item = this._uploadingFiles[item] || u.find(this._files, function (file) {
            return file.uuid === item;
        });
    }

    if (item && typeof item.abort === 'function') {
        item.abort();
    }
};

Uploader.prototype.start = function () {
    var self = this;

    if (this._working) {
        return;
    }

    if (this._files.length) {
        this._working = true;
        this._abort = false;
        this._networkInfo.reset();

        var taskParallel = this.options.bos_task_parallel;
        utils.eachLimit(this._files, taskParallel,
            function (file, callback) {
                file._previousLoaded = 0;
                self._uploadNext(file)
                    .then(function () {
                        // fulfillment
                        delete self._uploadingFiles[file.uuid];
                        callback(null, file);
                    })[
                    "catch"](function () {
                        // rejection
                        delete self._uploadingFiles[file.uuid];
                        callback(null, file);
                    });
            },
            function (error) {
                self._working = false;
                self._files.length = 0;
                self._networkInfo.totalBytes = 0;
                self._invoke(events.kUploadComplete);
            });
    }
};

Uploader.prototype.stop = function () {
    this._abort = true;
    this._working = false;
};

/**
 * 动态设置 Uploader 的某些参数，当前只支持动态的修改
 * bos_credentials, uptoken, bos_bucket, bos_endpoint
 * bos_ak, bos_sk
 *
 * @param {Object} options 用户动态设置的参数（只支持部分）
 */
Uploader.prototype.setOptions = function (options) {
    var supportedOptions = u.pick(options, 'bos_credentials',
        'bos_ak', 'bos_sk', 'uptoken', 'bos_bucket', 'bos_endpoint');
    this.options = u.extend(this.options, supportedOptions);

    var config = this.client && this.client.config;
    if (config) {
        var credentials = null;

        if (options.bos_credentials) {
            credentials = options.bos_credentials;
        }
        else if (options.bos_ak && options.bos_sk) {
            credentials = {
                ak: options.bos_ak,
                sk: options.bos_sk
            };
        }

        if (credentials) {
            this.options.bos_credentials = credentials;
            config.credentials = credentials;
        }
        if (options.uptoken) {
            config.sessionToken = options.uptoken;
        }
        if (options.bos_endpoint) {
            config.endpoint = utils.normalizeEndpoint(options.bos_endpoint);
        }
    }
};

/**
 * 有的用户希望主动更新 sts token，避免过期的问题
 *
 * @return {Promise}
 */
Uploader.prototype.refreshStsToken = function () {
    var self = this;
    var options = self.options;
    var stsMode = self._xhr2Supported
        && options.uptoken_url
        && options.get_new_uptoken === false;
    if (stsMode) {
        var stm = new StsTokenManager(options);
        return stm.get(options.bos_bucket).then(function (payload) {
            return self.setOptions({
                bos_ak: payload.AccessKeyId,
                bos_sk: payload.SecretAccessKey,
                uptoken: payload.SessionToken
            });
        });
    }
    return Q.resolve();
};

Uploader.prototype._uploadNext = function (file) {
    if (this._abort) {
        this._working = false;
        return Q.resolve();
    }

    if (file._aborted === true) {
        return Q.resolve();
    }

    var throwErrors = true;
    var returnValue = this._invoke(events.kBeforeUpload, [file], throwErrors);
    if (returnValue === false) {
        return Q.resolve();
    }

    var self = this;
    return Q.resolve(returnValue)
        .then(function () {
            return self._uploadNextImpl(file);
        })[
        "catch"](function (error) {
            self._invoke(events.kError, [error, file]);
        });
};

Uploader.prototype._uploadNextImpl = function (file) {
    var self = this;
    var options = this.options;
    var object = file.name;
    var throwErrors = true;

    var defaultTaskOptions = u.pick(options,
        'flash_swf_url', 'max_retries', 'chunk_size', 'retry_interval',
        'bos_multipart_parallel',
        'bos_multipart_auto_continue',
        'bos_multipart_local_key_generator'
    );
    return Q.all([
        this._invoke(events.kKey, [file], throwErrors),
        this._invoke(events.kObjectMetas, [file])
    ]).then(function (array) {
        // options.bos_bucket 可能会被 kKey 事件动态的改变
        var bucket = options.bos_bucket;

        var result = array[0];
        var objectMetas = array[1];

        var multipart = 'auto';
        if (u.isString(result)) {
            object = result;
        }
        else if (u.isObject(result)) {
            bucket = result.bucket || bucket;
            object = result.key || object;

            // 'auto' / 'off'
            multipart = result.multipart || multipart;
        }

        var client = self.client;
        var eventDispatcher = self;
        var taskOptions = u.extend(defaultTaskOptions, {
            file: file,
            bucket: bucket,
            object: object,
            metas: objectMetas
        });

        var task = null;
        if (multipart === 'auto' && file.size > options.bos_multipart_min_size) {
            task = new MultipartTask(client, eventDispatcher, taskOptions);
        }
        else {
            task = new PutObjectTask(client, eventDispatcher, taskOptions);
        }

        self._uploadingFiles[file.uuid] = file;

        file.abort = function () {
            file._aborted = true;
            return task.abort();
        };

        task.setNetworkInfo(self._networkInfo);
        return task.start();
    });
};

Uploader.prototype.dispatchEvent = function (eventName, eventArguments, throwErrors) {
    if (eventName === events.kAborted
        && eventArguments
        && eventArguments[1]) {
        var file = eventArguments[1];
        if (file.size > 0) {
            var loadedSize = file._previousLoaded || 0;
            this._networkInfo.totalBytes -= (file.size - loadedSize);
            this._invoke(events.kNetworkSpeed, this._networkInfo.dump());
        }
    }
    return this._invoke(eventName, eventArguments, throwErrors);
};

module.exports = Uploader;

},{"16":16,"18":18,"24":24,"25":25,"26":26,"27":27,"28":28,"30":30,"32":32,"34":34,"44":44,"46":46}],34:[function(require,module,exports){
/**
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * @file utils.js
 * @author leeight
 */

var qsModule = require(45);
var Q = require(44);
var u = require(46);
var Queue = require(29);
var MimeType = require(22);

/**
 * 把文件进行切片，返回切片之后的数组
 *
 * @param {Blob} file 需要切片的大文件.
 * @param {string} uploadId 从服务获取的uploadId.
 * @param {number} chunkSize 分片的大小.
 * @param {string} bucket Bucket Name.
 * @param {string} object Object Name.
 * @return {Array.<Object>}
 */
exports.getTasks = function (file, uploadId, chunkSize, bucket, object) {
    var leftSize = file.size;
    var offset = 0;
    var partNumber = 1;

    var tasks = [];

    while (leftSize > 0) {
        var partSize = Math.min(leftSize, chunkSize);

        tasks.push({
            file: file,
            uploadId: uploadId,
            bucket: bucket,
            object: object,
            partNumber: partNumber,
            partSize: partSize,
            start: offset,
            stop: offset + partSize - 1
        });

        leftSize -= partSize;
        offset += partSize;
        partNumber += 1;
    }

    return tasks;
};

exports.getAppendableTasks = function (fileSize, offset, chunkSize) {
    var leftSize = fileSize - offset;
    var tasks = [];

    while (leftSize) {
        var partSize = Math.min(leftSize, chunkSize);
        tasks.push({
            partSize: partSize,
            start: offset,
            stop: offset + partSize - 1
        });

        leftSize -= partSize;
        offset += partSize;
    }
    return tasks;
};

exports.parseSize = function (size) {
    if (typeof size === 'number') {
        return size;
    }

    // mb MB Mb M
    // kb KB kb k
    // 100
    var pattern = /^([\d\.]+)([mkg]?b?)$/i;
    var match = pattern.exec(size);
    if (!match) {
        return 0;
    }

    var $1 = match[1];
    var $2 = match[2];
    if (/^k/i.test($2)) {
        return $1 * 1024;
    }
    else if (/^m/i.test($2)) {
        return $1 * 1024 * 1024;
    }
    else if (/^g/i.test($2)) {
        return $1 * 1024 * 1024 * 1024;
    }
    return +$1;
};

/**
 * 判断一下浏览器是否支持 xhr2 特性，如果不支持，就 fallback 到 PostObject
 * 来上传文件
 *
 * @return {boolean}
 */
exports.isXhr2Supported = function () {
    // https://github.com/Modernizr/Modernizr/blob/f839e2579da2c6331eaad922ae5cd691aac7ab62/feature-detects/network/xhr2.js
    return 'XMLHttpRequest' in window && 'withCredentials' in new XMLHttpRequest();
};

exports.isAppendable = function (headers) {
    return headers['x-bce-object-type'] === 'Appendable';
};

exports.delay = function (ms) {
    var deferred = Q.defer();
    setTimeout(function () {
        deferred.resolve();
    }, ms);
    return deferred.promise;
};

/**
 * 规范化用户的输入
 *
 * @param {string} endpoint The endpoint will be normalized
 * @return {string}
 */
exports.normalizeEndpoint = function (endpoint) {
    return endpoint.replace(/(\/+)$/, '');
};

exports.getDefaultACL = function (bucket) {
    return {
        accessControlList: [
            {
                service: 'bce:bos',
                region: '*',
                effect: 'Allow',
                resource: [bucket + '/*'],
                permission: ['READ', 'WRITE']
            }
        ]
    };
};

/**
 * 生成uuid
 *
 * @return {string}
 */
exports.uuid = function () {
    var random = (Math.random() * Math.pow(2, 32)).toString(36);
    var timestamp = new Date().getTime();
    return 'u-' + timestamp + '-' + random;
};

/**
 * 生成本地 localStorage 中的key，来存储 uploadId
 * localStorage[key] = uploadId
 *
 * @param {Object} option 一些可以用来计算key的参数.
 * @param {string} generator 内置的只有 default 和 md5
 * @return {Promise}
 */
exports.generateLocalKey = function (option, generator) {
    if (generator === 'default') {
        return Q.resolve([
            option.blob.name, option.blob.size,
            option.chunkSize, option.bucket,
            option.object
        ].join('&'));
    }
    return Q.resolve(null);
};

exports.getDefaultPolicy = function (bucket) {
    if (bucket == null) {
        return null;
    }

    var now = new Date().getTime();

    // 默认是 24小时 之后到期
    var expiration = new Date(now + 24 * 60 * 60 * 1000);
    var utcDateTime = expiration.toISOString().replace(/\.\d+Z$/, 'Z');

    return {
        expiration: utcDateTime,
        conditions: [
            {bucket: bucket}
        ]
    };
};

/**
 * 根据key获取localStorage中的uploadId
 *
 * @param {string} key 需要查询的key
 * @return {string}
 */
exports.getUploadId = function (key) {
    return localStorage.getItem(key);
};


/**
 * 根据key设置localStorage中的uploadId
 *
 * @param {string} key 需要查询的key
 * @param {string} uploadId 需要设置的uploadId
 */
exports.setUploadId = function (key, uploadId) {
    localStorage.setItem(key, uploadId);
};

/**
 * 根据key删除localStorage中的uploadId
 *
 * @param {string} key 需要查询的key
 */
exports.removeUploadId = function (key) {
    localStorage.removeItem(key);
};

/**
 * 取得已上传分块的etag
 *
 * @param {number} partNumber 分片序号.
 * @param {Array} existParts 已上传完成的分片信息.
 * @return {string} 指定分片的etag
 */
function getPartEtag(partNumber, existParts) {
    var matchParts = u.filter(existParts || [], function (part) {
        return +part.partNumber === partNumber;
    });
    return matchParts.length ? matchParts[0].eTag : null;
}

/**
 * 因为 listParts 会返回 partNumber 和 etag 的对应关系
 * 所以 listParts 返回的结果，给 tasks 中合适的元素设置 etag 属性，上传
 * 的时候就可以跳过这些 part
 *
 * @param {Array.<Object>} tasks 本地切分好的任务.
 * @param {Array.<Object>} parts 服务端返回的已经上传的parts.
 */
exports.filterTasks = function (tasks, parts) {
    u.each(tasks, function (task) {
        var partNumber = task.partNumber;
        var etag = getPartEtag(partNumber, parts);
        if (etag) {
            task.etag = etag;
        }
    });
};

/**
 * 把用户输入的配置转化成 html5 和 flash 可以接收的内容.
 *
 * @param {string|Array} accept 支持数组和字符串的配置
 * @return {string}
 */
exports.expandAccept = function (accept) {
    var exts = [];

    if (u.isArray(accept)) {
        // Flash要求的格式
        u.each(accept, function (item) {
            if (item.extensions) {
                exts.push.apply(exts, item.extensions.split(','));
            }
        });
    }
    else if (u.isString(accept)) {
        exts = accept.split(',');
    }

    // 为了保证兼容性，把 mimeTypes 和 exts 都返回回去
    exts = u.map(exts, function (ext) {
        return /^\./.test(ext) ? ext : ('.' + ext);
    });

    return exts.join(',');
};

exports.extToMimeType = function (exts) {
    var mimeTypes = u.map(exts.split(','), function (ext) {
        if (ext.indexOf('/') !== -1) {
            return ext;
        }
        return MimeType.guess(ext);
    });

    return mimeTypes.join(',');
};

exports.expandAcceptToArray = function (accept) {
    if (!accept || u.isArray(accept)) {
        return accept;
    }

    if (u.isString(accept)) {
        return [
            {title: 'All files', extensions: accept}
        ];
    }

    return [];
};

/**
 * 转化一下 bos url 的格式
 * http://bj.bcebos.com/v1/${bucket}/${object} -> http://${bucket}.bj.bcebos.com/v1/${object}
 *
 * @param {string} url 需要转化的URL.
 * @return {string}
 */
exports.transformUrl = function (url) {
    var pattern = /(https?:)\/\/([^\/]+)\/([^\/]+)\/([^\/]+)/;
    return url.replace(pattern, function (_, protocol, host, $3, $4) {
        if (/^v\d$/.test($3)) {
            // /v1/${bucket}/...
            return protocol + '//' + $4 + '.' + host + '/' + $3;
        }
        // /${bucket}/...
        return protocol + '//' + $3 + '.' + host + '/' + $4;
    });
};

exports.isBlob = function (body) {
    var blobCtor = null;

    if (typeof Blob !== 'undefined') {
        // Chrome Blob === 'function'
        // Safari Blob === 'undefined'
        blobCtor = Blob;
    }
    else if (typeof mOxie !== 'undefined' && u.isFunction(mOxie.Blob)) {
        blobCtor = mOxie.Blob;
    }
    else {
        return false;
    }

    return body instanceof blobCtor;
};

exports.now = function () {
    return new Date().getTime();
};

exports.toDHMS = function (seconds) {
    var days = 0;
    var hours = 0;
    var minutes = 0;

    if (seconds >= 60) {
        minutes = ~~(seconds / 60);
        seconds = seconds - minutes * 60;
    }

    if (minutes >= 60) {
        hours = ~~(minutes / 60);
        minutes = minutes - hours * 60;
    }

    if (hours >= 24) {
        days = ~~(hours / 24);
        hours = hours - days * 24;
    }

    return {DD: days, HH: hours, MM: minutes, SS: seconds};
};

function parseHost(url) {
    var match = /^\w+:\/\/([^\/]+)/.exec(url);
    return match && match[1];
}

exports.fixXhr = function (options, isBos) {
    return function (httpMethod, resource, args, config) {
        var client = this;
        var endpointHost = parseHost(config.endpoint);

        // x-bce-date 和 Date 二选一，是必须的
        // 但是 Flash 无法设置 Date，因此必须设置 x-bce-date
        args.headers['x-bce-date'] = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
        args.headers.host = endpointHost;

        // Flash 的缓存貌似比较厉害，强制请求新的
        // XXX 好像服务器端不会把 .stamp 这个参数加入到签名的计算逻辑里面去
        // args.params['.stamp'] = new Date().getTime();

        // 只有 PUT 才会触发 progress 事件
        var originalHttpMethod = httpMethod;

        if (httpMethod === 'PUT') {
            // PutObject PutParts 都可以用 POST 协议，而且 Flash 也只能用 POST 协议
            httpMethod = 'POST';
        }

        var xhrUri;
        var xhrMethod = httpMethod;
        var xhrBody = args.body;
        if (httpMethod === 'HEAD') {
            // 因为 Flash 的 URLRequest 只能发送 GET 和 POST 请求
            // getObjectMeta需要用HEAD请求，但是 Flash 无法发起这种请求
            // 所需需要用 relay 中转一下
            // XXX 因为 bucket 不可能是 private，否则 crossdomain.xml 是无法读取的
            // 所以这个接口请求的时候，可以不需要 authorization 字段
            var relayServer = exports.normalizeEndpoint(options.bos_relay_server);
            xhrUri = relayServer + '/' + endpointHost + resource;

            args.params.httpMethod = httpMethod;

            xhrMethod = 'POST';
        }
        else if (isBos === true) {
            xhrUri = exports.transformUrl(config.endpoint + resource);
            args.headers.host = parseHost(xhrUri);
        }
        else {
            xhrUri = config.endpoint + resource;
        }

        if (xhrMethod === 'POST' && !xhrBody) {
            // 必须要有 BODY 才能是 POST，否则你设置了也没有
            // 而且必须是 POST 才可以设置自定义的header，GET不行
            xhrBody = '{"FORCE_POST": true}';
        }

        var deferred = Q.defer();

        var xhr = new mOxie.XMLHttpRequest();

        xhr.onload = function () {
            var response = null;
            try {
                response = JSON.parse(xhr.response || '{}');
            }
            catch (ex) {
                response = {};
            }

            if (xhr.status >= 200 && xhr.status < 300) {
                if (httpMethod === 'HEAD') {
                    deferred.resolve(response);
                }
                else {
                    deferred.resolve({
                        http_headers: {},
                        body: response
                    });
                }
            }
            else {
                deferred.reject({
                    status_code: xhr.status,
                    message: response.message || '',
                    code: response.code || '',
                    request_id: response.requestId || ''
                });
            }
        };

        xhr.onerror = function (error) {
            deferred.reject(error);
        };

        if (xhr.upload) {
            // FIXME(分片上传的逻辑和xxx的逻辑不一样)
            xhr.upload.onprogress = function (e) {
                if (originalHttpMethod === 'PUT') {
                    // POST, HEAD, GET 之类的不需要触发 progress 事件
                    // 否则导致页面的逻辑混乱
                    e.lengthComputable = true;

                    var httpContext = {
                        httpMethod: originalHttpMethod,
                        resource: resource,
                        args: args,
                        config: config,
                        xhr: xhr
                    };

                    client.emit('progress', e, httpContext);
                }
            };
        }

        var promise = client.createSignature(client.config.credentials,
            httpMethod, resource, args.params, args.headers);
        promise.then(function (authorization, xbceDate) {
            if (authorization) {
                args.headers.authorization = authorization;
            }

            if (xbceDate) {
                args.headers['x-bce-date'] = xbceDate;
            }

            var qs = qsModule.stringify(args.params);
            if (qs) {
                xhrUri += '?' + qs;
            }

            xhr.open(xhrMethod, xhrUri, true);

            for (var key in args.headers) {
                if (!args.headers.hasOwnProperty(key)
                    || key === 'host') {
                    continue;
                }
                var value = args.headers[key];
                xhr.setRequestHeader(key, value);
            }

            xhr.send(xhrBody, {
                runtime_order: 'flash',
                swf_url: options.flash_swf_url
            });
        })[
        "catch"](function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };
};


exports.eachLimit = function (tasks, taskParallel, executer, done) {
    var runningCount = 0;
    var aborted = false;
    var fin = false;      // done 只能被调用一次.
    var queue = new Queue(tasks);

    function infiniteLoop() {
        var task = queue.dequeue();
        if (!task) {
            return;
        }

        runningCount++;
        executer(task, function (error) {
            runningCount--;

            if (error) {
                // 一旦有报错，终止运行
                aborted = true;
                fin = true;
                done(error);
            }
            else {
                if (!queue.isEmpty() && !aborted) {
                    // 队列还有内容
                    setTimeout(infiniteLoop, 0);
                }
                else if (runningCount <= 0) {
                    // 队列空了，而且没有运行中的任务了
                    if (!fin) {
                        fin = true;
                        done();
                    }
                }
            }
        });
    }

    taskParallel = Math.min(taskParallel, queue.size());
    for (var i = 0; i < taskParallel; i++) {
        infiniteLoop();
    }
};

exports.inherits = function (ChildCtor, ParentCtor) {
    ChildCtor.prototype = Object.create(ParentCtor.prototype);
    ChildCtor.prototype.constructor = ChildCtor;
};

exports.guessContentType = function (file, opt_ignoreCharset) {
    var contentType = file.type;
    if (!contentType) {
        var object = file.name;
        var ext = object.split(/\./g).pop();
        contentType = MimeType.guess(ext);
    }

    // Firefox在POST的时候，Content-Type 一定会有Charset的，因此
    // 这里不管3721，都加上.
    if (!opt_ignoreCharset && !/charset=/.test(contentType)) {
        contentType += '; charset=UTF-8';
    }

    return contentType;
};

},{"22":22,"29":29,"44":44,"45":45,"46":46}],35:[function(require,module,exports){
/**
 * @file vendor/Buffer.js
 * @author leeight
 */

/**
 * Buffer
 *
 * @class
 */
function Buffer() {
}

Buffer.byteLength = function (data) {
    // http://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript
    var m = encodeURIComponent(data).match(/%[89ABab]/g);
    return data.length + (m ? m.length : 0);
};

module.exports = Buffer;











},{}],36:[function(require,module,exports){
/**
 * @file vendor/async.js
 * @author leeight
 */

exports.mapLimit = require(2);

},{"2":2}],37:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /*
	     * Local polyfil of Object.create
	     */
	    var create = Object.create || (function () {
	        function F() {};

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }())

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));
},{}],38:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require(37), require(40), require(39));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha256", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS.HmacSHA256;

}));
},{"37":37,"39":39,"40":40}],39:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require(37));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


}));
},{"37":37}],40:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require(37));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	return CryptoJS.SHA256;

}));
},{"37":37}],41:[function(require,module,exports){
/**
 * @file vendor/crypto.js
 * @author leeight
 */

var HmacSHA256 = require(38);
var Hex = require(37).enc.Hex;

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










},{"37":37,"38":38}],42:[function(require,module,exports){
/**
 * @file vendor/events.js
 * @author leeight
 */

/**
 * EventEmitter
 *
 * @class
 */
function EventEmitter() {
    this.__events = {};
}

EventEmitter.prototype.emit = function (eventName, var_args) {
    var handlers = this.__events[eventName];
    if (!handlers) {
        return false;
    }

    var args = [].slice.call(arguments, 1);
    for (var i = 0; i < handlers.length; i++) {
        var handler = handlers[i];
        try {
            handler.apply(this, args);
        }
        catch (ex) {
            // IGNORE
        }
    }

    return true;
};

EventEmitter.prototype.on = function (eventName, listener) {
    if (!this.__events[eventName]) {
        this.__events[eventName] = [listener];
    }
    else {
        this.__events[eventName].push(listener);
    }
};

exports.EventEmitter = EventEmitter;


},{}],43:[function(require,module,exports){
/**
 * @file vendor/path.js
 * @author leeight
 */

var u = require(46);

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










},{"46":46}],44:[function(require,module,exports){
/**
 * @file src/vendor/q.js
 * @author leeight
 */

exports.resolve = function () {
    return Promise.resolve.apply(Promise, arguments);
};

exports.reject = function () {
    return Promise.reject.apply(Promise, arguments);
};

exports.all = function () {
    return Promise.all.apply(Promise, arguments);
};

exports.fcall = function (fn) {
    try {
        return Promise.resolve(fn());
    }
    catch (ex) {
        return Promise.reject(ex);
    }
};

exports.defer = function () {
    var deferred = {};

    deferred.promise = new Promise(function (resolve, reject) {
        deferred.resolve = function () {
            resolve.apply(null, arguments);
        };
        deferred.reject = function () {
            reject.apply(null, arguments);
        };
    });

    return deferred;
};











},{}],45:[function(require,module,exports){
/**
 * @file src/vendor/querystring.js
 * @author leeight
 */

var u = require(46);

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

},{"46":46}],46:[function(require,module,exports){
/**
 * ag --no-filename -o '\b(u\..*?)\(' .  | sort | uniq -c
 *
 * @file vendor/underscore.js
 * @author leeight
 */

var isArray = require(5);
var noop = require(10);
var isNumber = require(13);
var isObject = require(14);
var isString = require(15);

function isFunction(value) {
    return typeof value === 'function';
}

function extend(source, var_args) {
    for (var i = 1; i < arguments.length; i++) {
        var item = arguments[i];
        if (item && isObject(item)) {
            var oKeys = keys(item);
            for (var j = 0; j < oKeys.length; j++) {
                var key = oKeys[j];
                var value = item[key];
                source[key] = value;
            }
        }
    }

    return source;
}

function map(array, callback, context) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        result[i] = callback.call(context, array[i], i, array);
    }
    return result;
}

function foreach(array, callback, context) {
    for (var i = 0; i < array.length; i++) {
        callback.call(context, array[i], i, array);
    }
}

function find(array, callback, context) {
    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        if (callback.call(context, value, i, array)) {
            return value;
        }
    }
}

function filter(array, callback, context) {
    var res = [];
    for (var i = 0; i < array.length; i++) {
        var value = array[i];
        if (callback.call(context, value, i, array)) {
            res.push(value);
        }
    }
    return res;
}

function omit(object, var_args) {
    var args = isArray(var_args)
        ? var_args
        : [].slice.call(arguments, 1);

    var result = {};

    var oKeys = keys(object);
    for (var i = 0; i < oKeys.length; i++) {
        var key = oKeys[i];
        if (args.indexOf(key) === -1) {
            result[key] = object[key];
        }
    }

    return result;
}

function pick(object, var_args, context) {
    var result = {};

    var i;
    var key;
    var value;

    if (isFunction(var_args)) {
        var callback = var_args;
        var oKeys = keys(object);
        for (i = 0; i < oKeys.length; i++) {
            key = oKeys[i];
            value = object[key];
            if (callback.call(context, value, key, object)) {
                result[key] = value;
            }
        }
    }
    else {
        var args = isArray(var_args)
            ? var_args
            : [].slice.call(arguments, 1);

        for (i = 0; i < args.length; i++) {
            key = args[i];
            value = object[key];
            result[key] = value;
        }
    }

    return result;
}

function bind(fn, context) {
    return function () {
        return fn.apply(context, [].slice.call(arguments));
    };
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString');
var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty',
    'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];

function keys(obj) {
    var result = [];
    var prop;
    var i;

    for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
        }
    }

    if (hasDontEnumBug) {
        for (i = 0; i < dontEnums.length; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
                result.push(dontEnums[i]);
            }
        }
    }

    return result;
}

exports.bind = bind;
exports.each = foreach;
exports.extend = extend;
exports.filter = filter;
exports.find = find;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.map = map;
exports.omit = omit;
exports.pick = pick;
exports.keys = keys;
exports.noop = noop;














},{"10":10,"13":13,"14":14,"15":15,"5":5}],47:[function(require,module,exports){
/**
 * @file vendor/util.js
 * @author leeight
 */

var u = require(46);

exports.inherits = function (subClass, superClass) {
    var subClassProto = subClass.prototype;
    var F = new Function();
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    u.extend(subClass.prototype, subClassProto);
};

exports.format = function (f) {
    var argLen = arguments.length;

    if (argLen === 1) {
        return f;
    }

    var str = '';
    var a = 1;
    var lastPos = 0;
    for (var i = 0; i < f.length;) {
        if (f.charCodeAt(i) === 37 /** '%' */ && i + 1 < f.length) {
            switch (f.charCodeAt(i + 1)) {
                case 100: // 'd'
                    if (a >= argLen) {
                        break;
                    }

                    if (lastPos < i) {
                        str += f.slice(lastPos, i);
                    }

                    str += Number(arguments[a++]);
                    lastPos = i = i + 2;
                    continue;
                case 115: // 's'
                    if (a >= argLen) {
                        break;
                    }

                    if (lastPos < i) {
                        str += f.slice(lastPos, i);
                    }

                    str += String(arguments[a++]);
                    lastPos = i = i + 2;
                    continue;
                case 37: // '%'
                    if (lastPos < i) {
                        str += f.slice(lastPos, i);
                    }

                    str += '%';
                    lastPos = i = i + 2;
                    continue;
            }
        }

        ++i;
    }

    if (lastPos === 0) {
        str = f;
    }
    else if (lastPos < f.length) {
        str += f.slice(lastPos);
    }

    return str;
};

},{"46":46}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy5tYXBsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmRvcGFyYWxsZWxsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmVhY2hvZmxpbWl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwuaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmlzYXJyYXlsaWtlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwua2V5aXRlcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwubWFwYXN5bmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5ub29wL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwub25jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLm9ubHlvbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc251bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzc3RyaW5nL2luZGV4LmpzIiwic3JjL2JjZS1zZGstanMvYXV0aC5qcyIsInNyYy9iY2Utc2RrLWpzL2JjZV9iYXNlX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL2Jvc19jbGllbnQuanMiLCJzcmMvYmNlLXNkay1qcy9jb25maWcuanMiLCJzcmMvYmNlLXNkay1qcy9oZWFkZXJzLmpzIiwic3JjL2JjZS1zZGstanMvaHR0cF9jbGllbnQuanMiLCJzcmMvYmNlLXNkay1qcy9taW1lLnR5cGVzLmpzIiwic3JjL2JjZS1zZGstanMvc3RyaW5ncy5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvZXZlbnRzLmpzIiwic3JjL211bHRpcGFydF90YXNrLmpzIiwic3JjL25ldHdvcmtfaW5mby5qcyIsInNyYy9wdXRfb2JqZWN0X3Rhc2suanMiLCJzcmMvcXVldWUuanMiLCJzcmMvc3RzX3Rva2VuX21hbmFnZXIuanMiLCJzcmMvdGFzay5qcyIsInNyYy90cmFja2VyLmpzIiwic3JjL3VwbG9hZGVyLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlbmRvci9CdWZmZXIuanMiLCJzcmMvdmVuZG9yL2FzeW5jLmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvY29yZS5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL2htYWMtc2hhMjU2LmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvaG1hYy5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL3NoYTI1Ni5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLmpzIiwic3JjL3ZlbmRvci9ldmVudHMuanMiLCJzcmMvdmVuZG9yL3BhdGguanMiLCJzcmMvdmVuZG9yL3EuanMiLCJzcmMvdmVuZG9yL3F1ZXJ5c3RyaW5nLmpzIiwic3JjL3ZlbmRvci91bmRlcnNjb3JlLmpzIiwic3JjL3ZlbmRvci91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3Z2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBiY2UtYm9zLXVwbG9hZGVyL2luZGV4LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIEJvc0NsaWVudCA9IHJlcXVpcmUoMTgpO1xudmFyIEF1dGggPSByZXF1aXJlKDE2KTtcblxudmFyIFVwbG9hZGVyID0gcmVxdWlyZSgzMyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKDM0KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYm9zOiB7XG4gICAgICAgIFVwbG9hZGVyOiBVcGxvYWRlclxuICAgIH0sXG4gICAgdXRpbHM6IHV0aWxzLFxuICAgIHNkazoge1xuICAgICAgICBROiBRLFxuICAgICAgICBCb3NDbGllbnQ6IEJvc0NsaWVudCxcbiAgICAgICAgQXV0aDogQXV0aFxuICAgIH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCIndXNlIHN0cmljdCc7XG52YXIgbWFwQXN5bmMgPSByZXF1aXJlKDkpO1xudmFyIGRvUGFyYWxsZWxMaW1pdCA9IHJlcXVpcmUoMyk7XG5tb2R1bGUuZXhwb3J0cyA9IGRvUGFyYWxsZWxMaW1pdChtYXBBc3luYyk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZWFjaE9mTGltaXQgPSByZXF1aXJlKDQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRvUGFyYWxsZWxMaW1pdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGxpbWl0LCBpdGVyYXRvciwgY2IpIHtcbiAgICAgICAgcmV0dXJuIGZuKGVhY2hPZkxpbWl0KGxpbWl0KSwgb2JqLCBpdGVyYXRvciwgY2IpO1xuICAgIH07XG59O1xuIiwidmFyIG9uY2UgPSByZXF1aXJlKDExKTtcbnZhciBub29wID0gcmVxdWlyZSgxMCk7XG52YXIgb25seU9uY2UgPSByZXF1aXJlKDEyKTtcbnZhciBrZXlJdGVyYXRvciA9IHJlcXVpcmUoNyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZWFjaE9mTGltaXQobGltaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY2IpIHtcbiAgICAgICAgY2IgPSBvbmNlKGNiIHx8IG5vb3ApO1xuICAgICAgICBvYmogPSBvYmogfHwgW107XG4gICAgICAgIHZhciBuZXh0S2V5ID0ga2V5SXRlcmF0b3Iob2JqKTtcbiAgICAgICAgaWYgKGxpbWl0IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICB2YXIgcnVubmluZyA9IDA7XG4gICAgICAgIHZhciBlcnJvcmVkID0gZmFsc2U7XG5cbiAgICAgICAgKGZ1bmN0aW9uIHJlcGxlbmlzaCgpIHtcbiAgICAgICAgICAgIGlmIChkb25lICYmIHJ1bm5pbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKHJ1bm5pbmcgPCBsaW1pdCAmJiAhZXJyb3JlZCkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBuZXh0S2V5KCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBydW5uaW5nICs9IDE7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3Iob2JqW2tleV0sIGtleSwgb25seU9uY2UoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGVuaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5ID0gcmVxdWlyZSg1KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZShhcnIpIHtcbiAgICByZXR1cm4gaXNBcnJheShhcnIpIHx8IChcbiAgICAgICAgLy8gaGFzIGEgcG9zaXRpdmUgaW50ZWdlciBsZW5ndGggcHJvcGVydHlcbiAgICAgICAgdHlwZW9mIGFyci5sZW5ndGggPT09ICdudW1iZXInICYmXG4gICAgICAgIGFyci5sZW5ndGggPj0gMCAmJlxuICAgICAgICBhcnIubGVuZ3RoICUgMSA9PT0gMFxuICAgICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2tleXMgPSByZXF1aXJlKDgpO1xudmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSg2KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXlJdGVyYXRvcihjb2xsKSB7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB2YXIgbGVuO1xuICAgIHZhciBrZXlzO1xuICAgIGlmIChpc0FycmF5TGlrZShjb2xsKSkge1xuICAgICAgICBsZW4gPSBjb2xsLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGkgOiBudWxsO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGtleXMgPSBfa2V5cyhjb2xsKTtcbiAgICAgICAgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBrZXlzW2ldIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgdmFyIF9rZXlzID0gW107XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgX2tleXMucHVzaChrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX2tleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb25jZSA9IHJlcXVpcmUoMTEpO1xudmFyIG5vb3AgPSByZXF1aXJlKDEwKTtcbnZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoNik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwQXN5bmMoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYikge1xuICAgIGNiID0gb25jZShjYiB8fCBub29wKTtcbiAgICBhcnIgPSBhcnIgfHwgW107XG4gICAgdmFyIHJlc3VsdHMgPSBpc0FycmF5TGlrZShhcnIpID8gW10gOiB7fTtcbiAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBjYikge1xuICAgICAgICBpdGVyYXRvcih2YWx1ZSwgZnVuY3Rpb24gKGVyciwgdikge1xuICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2O1xuICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjYihlcnIsIHJlc3VsdHMpO1xuICAgIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub29wICgpIHt9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmbiA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25seV9vbmNlKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZm4gPT09IG51bGwpIHRocm93IG5ldyBFcnJvcignQ2FsbGJhY2sgd2FzIGFscmVhZHkgY2FsbGVkLicpO1xuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNiBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE2IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTnVtYmVyYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqICoqTm90ZToqKiBUbyBleGNsdWRlIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBhbmQgYE5hTmAsIHdoaWNoIGFyZSBjbGFzc2lmaWVkXG4gKiBhcyBudW1iZXJzLCB1c2UgdGhlIGBfLmlzRmluaXRlYCBtZXRob2QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOdW1iZXIoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gbnVtYmVyVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc051bWJlcjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIGxvZGFzaCA0LjAuMSAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNiBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE2IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAdHlwZSBGdW5jdGlvblxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3RyaW5nYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fFxuICAgICghaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYXV0aC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG4vKiBlc2xpbnQgbWF4LXBhcmFtczpbMCwxMF0gKi9cblxudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgSCA9IHJlcXVpcmUoMjApO1xudmFyIHN0cmluZ3MgPSByZXF1aXJlKDIzKTtcblxuLyoqXG4gKiBBdXRoXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge3N0cmluZ30gYWsgVGhlIGFjY2VzcyBrZXkuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2sgVGhlIHNlY3VyaXR5IGtleS5cbiAqL1xuZnVuY3Rpb24gQXV0aChhaywgc2spIHtcbiAgICB0aGlzLmFrID0gYWs7XG4gICAgdGhpcy5zayA9IHNrO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBzaWduYXR1cmUgYmFzZWQgb24gaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQXV0aGVudGljYXRpb25NZWNoYW5pc21cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIFRoZSBodHRwIHJlcXVlc3QgbWV0aG9kLCBzdWNoIGFzIEdFVCwgUE9TVCwgREVMRVRFLCBQVVQsIC4uLlxuICogQHBhcmFtIHtzdHJpbmd9IHJlc291cmNlIFRoZSByZXF1ZXN0IHBhdGguXG4gKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyBUaGUgcXVlcnkgc3RyaW5ncy5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBUaGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKiBAcGFyYW0ge251bWJlcj19IHRpbWVzdGFtcCBTZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wLlxuICogQHBhcmFtIHtudW1iZXI9fSBleHBpcmF0aW9uSW5TZWNvbmRzIFRoZSBzaWduYXR1cmUgdmFsaWRhdGlvbiB0aW1lLlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGhlYWRlcnNUb1NpZ24gVGhlIHJlcXVlc3QgaGVhZGVycyBsaXN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBjYWxjdWFsYXRlIHRoZSBzaWduYXR1cmUuXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgc2lnbmF0dXJlLlxuICovXG5BdXRoLnByb3RvdHlwZS5nZW5lcmF0ZUF1dGhvcml6YXRpb24gPSBmdW5jdGlvbiAobWV0aG9kLCByZXNvdXJjZSwgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnMsIHRpbWVzdGFtcCwgZXhwaXJhdGlvbkluU2Vjb25kcywgaGVhZGVyc1RvU2lnbikge1xuXG4gICAgdmFyIG5vdyA9IHRpbWVzdGFtcCA/IG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApIDogbmV3IERhdGUoKTtcbiAgICB2YXIgcmF3U2Vzc2lvbktleSA9IHV0aWwuZm9ybWF0KCdiY2UtYXV0aC12MS8lcy8lcy8lZCcsXG4gICAgICAgIHRoaXMuYWssIG5vdy50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sICdaJyksIGV4cGlyYXRpb25JblNlY29uZHMgfHwgMTgwMCk7XG4gICAgdmFyIHNlc3Npb25LZXkgPSB0aGlzLmhhc2gocmF3U2Vzc2lvbktleSwgdGhpcy5zayk7XG5cbiAgICB2YXIgY2Fub25pY2FsVXJpID0gdGhpcy51cmlDYW5vbmljYWxpemF0aW9uKHJlc291cmNlKTtcbiAgICB2YXIgY2Fub25pY2FsUXVlcnlTdHJpbmcgPSB0aGlzLnF1ZXJ5U3RyaW5nQ2Fub25pY2FsaXphdGlvbihwYXJhbXMgfHwge30pO1xuXG4gICAgdmFyIHJ2ID0gdGhpcy5oZWFkZXJzQ2Fub25pY2FsaXphdGlvbihoZWFkZXJzIHx8IHt9LCBoZWFkZXJzVG9TaWduKTtcbiAgICB2YXIgY2Fub25pY2FsSGVhZGVycyA9IHJ2WzBdO1xuICAgIHZhciBzaWduZWRIZWFkZXJzID0gcnZbMV07XG5cbiAgICB2YXIgcmF3U2lnbmF0dXJlID0gdXRpbC5mb3JtYXQoJyVzXFxuJXNcXG4lc1xcbiVzJyxcbiAgICAgICAgbWV0aG9kLCBjYW5vbmljYWxVcmksIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLCBjYW5vbmljYWxIZWFkZXJzKTtcbiAgICB2YXIgc2lnbmF0dXJlID0gdGhpcy5oYXNoKHJhd1NpZ25hdHVyZSwgc2Vzc2lvbktleSk7XG5cbiAgICBpZiAoc2lnbmVkSGVhZGVycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHV0aWwuZm9ybWF0KCclcy8lcy8lcycsIHJhd1Nlc3Npb25LZXksIHNpZ25lZEhlYWRlcnMuam9pbignOycpLCBzaWduYXR1cmUpO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXMvLyVzJywgcmF3U2Vzc2lvbktleSwgc2lnbmF0dXJlKTtcbn07XG5cbkF1dGgucHJvdG90eXBlLnVyaUNhbm9uaWNhbGl6YXRpb24gPSBmdW5jdGlvbiAodXJpKSB7XG4gICAgcmV0dXJuIHVyaTtcbn07XG5cbi8qKlxuICogQ2Fub25pY2FsIHRoZSBxdWVyeSBzdHJpbmdzLlxuICpcbiAqIEBzZWUgaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQXV0aGVudGljYXRpb25NZWNoYW5pc20j55Sf5oiQQ2Fub25pY2FsUXVlcnlTdHJpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHF1ZXJ5IHN0cmluZ3MuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbkF1dGgucHJvdG90eXBlLnF1ZXJ5U3RyaW5nQ2Fub25pY2FsaXphdGlvbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgY2Fub25pY2FsUXVlcnlTdHJpbmcgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhwYXJhbXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoa2V5LnRvTG93ZXJDYXNlKCkgPT09IEguQVVUSE9SSVpBVElPTi50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbXNba2V5XSA9PSBudWxsID8gJycgOiBwYXJhbXNba2V5XTtcbiAgICAgICAgY2Fub25pY2FsUXVlcnlTdHJpbmcucHVzaChrZXkgKyAnPScgKyBzdHJpbmdzLm5vcm1hbGl6ZSh2YWx1ZSkpO1xuICAgIH0pO1xuXG4gICAgY2Fub25pY2FsUXVlcnlTdHJpbmcuc29ydCgpO1xuXG4gICAgcmV0dXJuIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLmpvaW4oJyYnKTtcbn07XG5cbi8qKlxuICogQ2Fub25pY2FsIHRoZSBodHRwIHJlcXVlc3QgaGVhZGVycy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0F1dGhlbnRpY2F0aW9uTWVjaGFuaXNtI+eUn+aIkENhbm9uaWNhbEhlYWRlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzIFRoZSBodHRwIHJlcXVlc3QgaGVhZGVycy5cbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz49fSBoZWFkZXJzVG9TaWduIFRoZSByZXF1ZXN0IGhlYWRlcnMgbGlzdCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gY2FsY3VhbGF0ZSB0aGUgc2lnbmF0dXJlLlxuICogQHJldHVybiB7Kn0gY2Fub25pY2FsSGVhZGVycyBhbmQgc2lnbmVkSGVhZGVyc1xuICovXG5BdXRoLnByb3RvdHlwZS5oZWFkZXJzQ2Fub25pY2FsaXphdGlvbiA9IGZ1bmN0aW9uIChoZWFkZXJzLCBoZWFkZXJzVG9TaWduKSB7XG4gICAgaWYgKCFoZWFkZXJzVG9TaWduIHx8ICFoZWFkZXJzVG9TaWduLmxlbmd0aCkge1xuICAgICAgICBoZWFkZXJzVG9TaWduID0gW0guSE9TVCwgSC5DT05URU5UX01ENSwgSC5DT05URU5UX0xFTkdUSCwgSC5DT05URU5UX1RZUEVdO1xuICAgIH1cblxuICAgIHZhciBoZWFkZXJzTWFwID0ge307XG4gICAgaGVhZGVyc1RvU2lnbi5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGhlYWRlcnNNYXBbaXRlbS50b0xvd2VyQ2FzZSgpXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB2YXIgY2Fub25pY2FsSGVhZGVycyA9IFtdO1xuICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBoZWFkZXJzW2tleV07XG4gICAgICAgIHZhbHVlID0gdS5pc1N0cmluZyh2YWx1ZSkgPyBzdHJpbmdzLnRyaW0odmFsdWUpIDogdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoL154XFwtYmNlXFwtLy50ZXN0KGtleSkgfHwgaGVhZGVyc01hcFtrZXldID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjYW5vbmljYWxIZWFkZXJzLnB1c2godXRpbC5mb3JtYXQoJyVzOiVzJyxcbiAgICAgICAgICAgICAgICAvLyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSwgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSkpO1xuICAgICAgICAgICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGtleSksIHN0cmluZ3Mubm9ybWFsaXplKHZhbHVlKSkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjYW5vbmljYWxIZWFkZXJzLnNvcnQoKTtcblxuICAgIHZhciBzaWduZWRIZWFkZXJzID0gW107XG4gICAgY2Fub25pY2FsSGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHNpZ25lZEhlYWRlcnMucHVzaChpdGVtLnNwbGl0KCc6JylbMF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFtjYW5vbmljYWxIZWFkZXJzLmpvaW4oJ1xcbicpLCBzaWduZWRIZWFkZXJzXTtcbn07XG5cbkF1dGgucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbiAoZGF0YSwga2V5KSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoNDEpO1xuICAgIHZhciBzaGEyNTZIbWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTI1NicsIGtleSk7XG4gICAgc2hhMjU2SG1hYy51cGRhdGUoZGF0YSk7XG4gICAgcmV0dXJuIHNoYTI1NkhtYWMuZGlnZXN0KCdoZXgnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aDtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYmNlX2Jhc2VfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoNDIpLkV2ZW50RW1pdHRlcjtcbnZhciB1dGlsID0gcmVxdWlyZSg0Nyk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBjb25maWcgPSByZXF1aXJlKDE5KTtcbnZhciBBdXRoID0gcmVxdWlyZSgxNik7XG5cbi8qKlxuICogQmNlQmFzZUNsaWVudFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNsaWVudENvbmZpZyBUaGUgYmNlIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VJZCBUaGUgc2VydmljZSBpZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlZ2lvblN1cHBvcnRlZCBUaGUgc2VydmljZSBzdXBwb3J0ZWQgcmVnaW9uIG9yIG5vdC5cbiAqL1xuZnVuY3Rpb24gQmNlQmFzZUNsaWVudChjbGllbnRDb25maWcsIHNlcnZpY2VJZCwgcmVnaW9uU3VwcG9ydGVkKSB7XG4gICAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHUuZXh0ZW5kKHt9LCBjb25maWcuREVGQVVMVF9DT05GSUcsIGNsaWVudENvbmZpZyk7XG4gICAgdGhpcy5zZXJ2aWNlSWQgPSBzZXJ2aWNlSWQ7XG4gICAgdGhpcy5yZWdpb25TdXBwb3J0ZWQgPSAhIXJlZ2lvblN1cHBvcnRlZDtcblxuICAgIHRoaXMuY29uZmlnLmVuZHBvaW50ID0gdGhpcy5fY29tcHV0ZUVuZHBvaW50KCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SHR0cENsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLl9odHRwQWdlbnQgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhCY2VCYXNlQ2xpZW50LCBFdmVudEVtaXR0ZXIpO1xuXG5CY2VCYXNlQ2xpZW50LnByb3RvdHlwZS5fY29tcHV0ZUVuZHBvaW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5lbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZW5kcG9pbnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVnaW9uU3VwcG9ydGVkKSB7XG4gICAgICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXM6Ly8lcy4lcy4lcycsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm90b2NvbCxcbiAgICAgICAgICAgIHRoaXMuc2VydmljZUlkLFxuICAgICAgICAgICAgdGhpcy5jb25maWcucmVnaW9uLFxuICAgICAgICAgICAgY29uZmlnLkRFRkFVTFRfU0VSVklDRV9ET01BSU4pO1xuICAgIH1cbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzOi8vJXMuJXMnLFxuICAgICAgICB0aGlzLmNvbmZpZy5wcm90b2NvbCxcbiAgICAgICAgdGhpcy5zZXJ2aWNlSWQsXG4gICAgICAgIGNvbmZpZy5ERUZBVUxUX1NFUlZJQ0VfRE9NQUlOKTtcbn07XG5cbkJjZUJhc2VDbGllbnQucHJvdG90eXBlLmNyZWF0ZVNpZ25hdHVyZSA9IGZ1bmN0aW9uIChjcmVkZW50aWFscywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIFEuZmNhbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKGNyZWRlbnRpYWxzLmFrLCBjcmVkZW50aWFscy5zayk7XG4gICAgICAgIHJldHVybiBhdXRoLmdlbmVyYXRlQXV0aG9yaXphdGlvbihodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCY2VCYXNlQ2xpZW50O1xuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9ib3NfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cbi8qIGVzbGludCBtYXgtcGFyYW1zOlswLDEwXSAqL1xuXG52YXIgcGF0aCA9IHJlcXVpcmUoNDMpO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgzNSk7XG52YXIgSCA9IHJlcXVpcmUoMjApO1xudmFyIHN0cmluZ3MgPSByZXF1aXJlKDIzKTtcbnZhciBIdHRwQ2xpZW50ID0gcmVxdWlyZSgyMSk7XG52YXIgQmNlQmFzZUNsaWVudCA9IHJlcXVpcmUoMTcpO1xudmFyIE1pbWVUeXBlID0gcmVxdWlyZSgyMik7XG5cbnZhciBNQVhfUFVUX09CSkVDVF9MRU5HVEggPSA1MzY4NzA5MTIwOyAgICAgLy8gNUdcbnZhciBNQVhfVVNFUl9NRVRBREFUQV9TSVpFID0gMjA0ODsgICAgICAgICAgLy8gMiAqIDEwMjRcblxuLyoqXG4gKiBCT1Mgc2VydmljZSBhcGlcbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0JPU19BUEkjQk9TLUFQSeaWh+aho1xuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgYm9zIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICogQGV4dGVuZHMge0JjZUJhc2VDbGllbnR9XG4gKi9cbmZ1bmN0aW9uIEJvc0NsaWVudChjb25maWcpIHtcbiAgICBCY2VCYXNlQ2xpZW50LmNhbGwodGhpcywgY29uZmlnLCAnYm9zJywgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SHR0cENsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLl9odHRwQWdlbnQgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhCb3NDbGllbnQsIEJjZUJhc2VDbGllbnQpO1xuXG4vLyAtLS0gQiBFIEcgSSBOIC0tLVxuQm9zQ2xpZW50LnByb3RvdHlwZS5kZWxldGVPYmplY3QgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnREVMRVRFJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5wdXRPYmplY3QgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBkYXRhLCBvcHRpb25zKSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigna2V5IHNob3VsZCBub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQVVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUucHV0T2JqZWN0RnJvbUJsb2IgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBibG9iLCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9CbG9iL3NpemVcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gYmxvYi5zaXplO1xuICAgIC8vIOWvueS6jua1j+iniOWZqOiwg+eUqEFQSeeahOaXtuWAme+8jOm7mOiupOS4jea3u+WKoCBILkNPTlRFTlRfTUQ1IOWtl+aute+8jOWboOS4uuiuoeeul+i1t+adpeavlOi+g+aFolxuICAgIC8vIOiAjOS4lOagueaNriBBUEkg5paH5qGj77yM6L+Z5Liq5a2X5q615LiN5piv5b+F5aGr55qE44CCXG4gICAgb3B0aW9ucyA9IHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMucHV0T2JqZWN0KGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb3B0aW9ucyk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmdldE9iamVjdE1ldGFkYXRhID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0hFQUQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmluaXRpYXRlTXVsdGlwYXJ0VXBsb2FkID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9IG9wdGlvbnNbSC5DT05URU5UX1RZUEVdIHx8IE1pbWVUeXBlLmd1ZXNzKHBhdGguZXh0bmFtZShrZXkpKTtcbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUE9TVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHBhcmFtczoge3VwbG9hZHM6ICcnfSxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5hYm9ydE11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnREVMRVRFJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgcGFyYW1zOiB7dXBsb2FkSWQ6IHVwbG9hZElkfSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBwYXJ0TGlzdCwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCc7XG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyh1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUE9TVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtwYXJ0czogcGFydExpc3R9KSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IHt1cGxvYWRJZDogdXBsb2FkSWR9LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnVwbG9hZFBhcnRGcm9tQmxvYiA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBwYXJ0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydFNpemUsIGJsb2IsIG9wdGlvbnMpIHtcbiAgICBpZiAoYmxvYi5zaXplICE9PSBwYXJ0U2l6ZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHV0aWwuZm9ybWF0KCdJbnZhbGlkIHBhcnRTaXplICVkIGFuZCBkYXRhIGxlbmd0aCAlZCcsXG4gICAgICAgICAgICBwYXJ0U2l6ZSwgYmxvYi5zaXplKSk7XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gcGFydFNpemU7XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnModS5leHRlbmQoaGVhZGVycywgb3B0aW9ucykpO1xuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQVVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBibG9iLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgcGFydE51bWJlcjogcGFydE51bWJlcixcbiAgICAgICAgICAgIHVwbG9hZElkOiB1cGxvYWRJZFxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmxpc3RQYXJ0cyA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBvcHRpb25zKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSovXG4gICAgaWYgKCF1cGxvYWRJZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1cGxvYWRJZCBzaG91bGQgbm90IGVtcHR5Jyk7XG4gICAgfVxuICAgIC8qZXNsaW50LWVuYWJsZSovXG5cbiAgICB2YXIgYWxsb3dlZFBhcmFtcyA9IFsnbWF4UGFydHMnLCAncGFydE51bWJlck1hcmtlcicsICd1cGxvYWRJZCddO1xuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSwgYWxsb3dlZFBhcmFtcyk7XG4gICAgb3B0aW9ucy5wYXJhbXMudXBsb2FkSWQgPSB1cGxvYWRJZDtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdHRVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwYXJhbXM6IG9wdGlvbnMucGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmxpc3RNdWx0aXBhcnRVcGxvYWRzID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZFBhcmFtcyA9IFsnZGVsaW1pdGVyJywgJ21heFVwbG9hZHMnLCAna2V5TWFya2VyJywgJ3ByZWZpeCcsICd1cGxvYWRzJ107XG5cbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKG9wdGlvbnMgfHwge30sIGFsbG93ZWRQYXJhbXMpO1xuICAgIG9wdGlvbnMucGFyYW1zLnVwbG9hZHMgPSAnJztcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdHRVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIHBhcmFtczogb3B0aW9ucy5wYXJhbXMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuYXBwZW5kT2JqZWN0ID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgZGF0YSwgb2Zmc2V0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigna2V5IHNob3VsZCBub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9KTtcbiAgICB2YXIgcGFyYW1zID0ge2FwcGVuZDogJyd9O1xuICAgIGlmICh1LmlzTnVtYmVyKG9mZnNldCkpIHtcbiAgICAgICAgcGFyYW1zLm9mZnNldCA9IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BPU1QnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmFwcGVuZE9iamVjdEZyb21CbG9iID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb2Zmc2V0LCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9CbG9iL3NpemVcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gYmxvYi5zaXplO1xuICAgIC8vIOWvueS6jua1j+iniOWZqOiwg+eUqEFQSeeahOaXtuWAme+8jOm7mOiupOS4jea3u+WKoCBILkNPTlRFTlRfTUQ1IOWtl+aute+8jOWboOS4uuiuoeeul+i1t+adpeavlOi+g+aFolxuICAgIC8vIOiAjOS4lOagueaNriBBUEkg5paH5qGj77yM6L+Z5Liq5a2X5q615LiN5piv5b+F5aGr55qE44CCXG4gICAgb3B0aW9ucyA9IHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kT2JqZWN0KGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb2Zmc2V0LCBvcHRpb25zKTtcbn07XG5cbi8vIC0tLSBFIE4gRCAtLS1cblxuQm9zQ2xpZW50LnByb3RvdHlwZS5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCB2YXJBcmdzKSB7XG4gICAgdmFyIGRlZmF1bHRBcmdzID0ge1xuICAgICAgICBidWNrZXROYW1lOiBudWxsLFxuICAgICAgICBrZXk6IG51bGwsXG4gICAgICAgIGJvZHk6IG51bGwsXG4gICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICBwYXJhbXM6IHt9LFxuICAgICAgICBjb25maWc6IHt9LFxuICAgICAgICBvdXRwdXRTdHJlYW06IG51bGxcbiAgICB9O1xuICAgIHZhciBhcmdzID0gdS5leHRlbmQoZGVmYXVsdEFyZ3MsIHZhckFyZ3MpO1xuXG4gICAgdmFyIGNvbmZpZyA9IHUuZXh0ZW5kKHt9LCB0aGlzLmNvbmZpZywgYXJncy5jb25maWcpO1xuICAgIHZhciByZXNvdXJjZSA9IHBhdGgubm9ybWFsaXplKHBhdGguam9pbihcbiAgICAgICAgJy92MScsXG4gICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGFyZ3MuYnVja2V0TmFtZSB8fCAnJyksXG4gICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGFyZ3Mua2V5IHx8ICcnLCBmYWxzZSlcbiAgICApKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgICBpZiAoY29uZmlnLnNlc3Npb25Ub2tlbikge1xuICAgICAgICBhcmdzLmhlYWRlcnNbSC5TRVNTSU9OX1RPS0VOXSA9IGNvbmZpZy5zZXNzaW9uVG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEhUVFBSZXF1ZXN0KGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLCBjb25maWcpO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5zZW5kSFRUUFJlcXVlc3QgPSBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MsIGNvbmZpZykge1xuICAgIHZhciBjbGllbnQgPSB0aGlzO1xuICAgIHZhciBhZ2VudCA9IHRoaXMuX2h0dHBBZ2VudCA9IG5ldyBIdHRwQ2xpZW50KGNvbmZpZyk7XG5cbiAgICB2YXIgaHR0cENvbnRleHQgPSB7XG4gICAgICAgIGh0dHBNZXRob2Q6IGh0dHBNZXRob2QsXG4gICAgICAgIHJlc291cmNlOiByZXNvdXJjZSxcbiAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICB9O1xuICAgIHUuZWFjaChbJ3Byb2dyZXNzJywgJ2Vycm9yJywgJ2Fib3J0J10sIGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgYWdlbnQub24oZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBjbGllbnQuZW1pdChldmVudE5hbWUsIGV2dCwgaHR0cENvbnRleHQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBwcm9taXNlID0gdGhpcy5faHR0cEFnZW50LnNlbmRSZXF1ZXN0KGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLmJvZHksXG4gICAgICAgIGFyZ3MuaGVhZGVycywgYXJncy5wYXJhbXMsIHUuYmluZCh0aGlzLmNyZWF0ZVNpZ25hdHVyZSwgdGhpcyksXG4gICAgICAgIGFyZ3Mub3V0cHV0U3RyZWFtXG4gICAgKTtcblxuICAgIHByb21pc2UuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChhZ2VudC5fcmVxICYmIGFnZW50Ll9yZXEueGhyKSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gYWdlbnQuX3JlcS54aHI7XG4gICAgICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuX2NoZWNrT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zLCBhbGxvd2VkUGFyYW1zKSB7XG4gICAgdmFyIHJ2ID0ge307XG5cbiAgICBydi5jb25maWcgPSBvcHRpb25zLmNvbmZpZyB8fCB7fTtcbiAgICBydi5oZWFkZXJzID0gdGhpcy5fcHJlcGFyZU9iamVjdEhlYWRlcnMob3B0aW9ucyk7XG4gICAgcnYucGFyYW1zID0gdS5waWNrKG9wdGlvbnMsIGFsbG93ZWRQYXJhbXMgfHwgW10pO1xuXG4gICAgcmV0dXJuIHJ2O1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5fcHJlcGFyZU9iamVjdEhlYWRlcnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBhbGxvd2VkSGVhZGVycyA9IFtcbiAgICAgICAgSC5DT05URU5UX0xFTkdUSCxcbiAgICAgICAgSC5DT05URU5UX0VOQ09ESU5HLFxuICAgICAgICBILkNPTlRFTlRfTUQ1LFxuICAgICAgICBILlhfQkNFX0NPTlRFTlRfU0hBMjU2LFxuICAgICAgICBILkNPTlRFTlRfVFlQRSxcbiAgICAgICAgSC5DT05URU5UX0RJU1BPU0lUSU9OLFxuICAgICAgICBILkVUQUcsXG4gICAgICAgIEguU0VTU0lPTl9UT0tFTixcbiAgICAgICAgSC5DQUNIRV9DT05UUk9MLFxuICAgICAgICBILkVYUElSRVMsXG4gICAgICAgIEguWF9CQ0VfT0JKRUNUX0FDTCxcbiAgICAgICAgSC5YX0JDRV9PQkpFQ1RfR1JBTlRfUkVBRFxuICAgIF07XG4gICAgdmFyIG1ldGFTaXplID0gMDtcbiAgICB2YXIgaGVhZGVycyA9IHUucGljayhvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoYWxsb3dlZEhlYWRlcnMuaW5kZXhPZihrZXkpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoL154XFwtYmNlXFwtbWV0YVxcLS8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICBtZXRhU2l6ZSArPSBCdWZmZXIuYnl0ZUxlbmd0aChrZXkpICsgQnVmZmVyLmJ5dGVMZW5ndGgoJycgKyB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG1ldGFTaXplID4gTUFYX1VTRVJfTUVUQURBVEFfU0laRSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNZXRhZGF0YSBzaXplIHNob3VsZCBub3QgYmUgZ3JlYXRlciB0aGFuICcgKyBNQVhfVVNFUl9NRVRBREFUQV9TSVpFICsgJy4nKTtcbiAgICB9XG5cbiAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShILkNPTlRFTlRfTEVOR1RIKSkge1xuICAgICAgICB2YXIgY29udGVudExlbmd0aCA9IGhlYWRlcnNbSC5DT05URU5UX0xFTkdUSF07XG4gICAgICAgIGlmIChjb250ZW50TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGVudF9sZW5ndGggc2hvdWxkIG5vdCBiZSBuZWdhdGl2ZS4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb250ZW50TGVuZ3RoID4gTUFYX1BVVF9PQkpFQ1RfTEVOR1RIKSB7IC8vIDVHXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgbGVuZ3RoIHNob3VsZCBiZSBsZXNzIHRoYW4gJyArIE1BWF9QVVRfT0JKRUNUX0xFTkdUSFxuICAgICAgICAgICAgICAgICsgJy4gVXNlIG11bHRpLXBhcnQgdXBsb2FkIGluc3RlYWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eSgnRVRhZycpKSB7XG4gICAgICAgIHZhciBldGFnID0gaGVhZGVycy5FVGFnO1xuICAgICAgICBpZiAoIS9eXCIvLnRlc3QoZXRhZykpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuRVRhZyA9IHV0aWwuZm9ybWF0KCdcIiVzXCInLCBldGFnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShILkNPTlRFTlRfVFlQRSkpIHtcbiAgICAgICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVycztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQm9zQ2xpZW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvY29uZmlnLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxuZXhwb3J0cy5ERUZBVUxUX1NFUlZJQ0VfRE9NQUlOID0gJ2JhaWR1YmNlLmNvbSc7XG5cbmV4cG9ydHMuREVGQVVMVF9DT05GSUcgPSB7XG4gICAgcHJvdG9jb2w6ICdodHRwJyxcbiAgICByZWdpb246ICdiaidcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2hlYWRlcnMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG5leHBvcnRzLkNPTlRFTlRfVFlQRSA9ICdDb250ZW50LVR5cGUnO1xuZXhwb3J0cy5DT05URU5UX0xFTkdUSCA9ICdDb250ZW50LUxlbmd0aCc7XG5leHBvcnRzLkNPTlRFTlRfTUQ1ID0gJ0NvbnRlbnQtTUQ1JztcbmV4cG9ydHMuQ09OVEVOVF9FTkNPRElORyA9ICdDb250ZW50LUVuY29kaW5nJztcbmV4cG9ydHMuQ09OVEVOVF9ESVNQT1NJVElPTiA9ICdDb250ZW50LURpc3Bvc2l0aW9uJztcbmV4cG9ydHMuRVRBRyA9ICdFVGFnJztcbmV4cG9ydHMuQ09OTkVDVElPTiA9ICdDb25uZWN0aW9uJztcbmV4cG9ydHMuSE9TVCA9ICdIb3N0JztcbmV4cG9ydHMuVVNFUl9BR0VOVCA9ICdVc2VyLUFnZW50JztcbmV4cG9ydHMuQ0FDSEVfQ09OVFJPTCA9ICdDYWNoZS1Db250cm9sJztcbmV4cG9ydHMuRVhQSVJFUyA9ICdFeHBpcmVzJztcblxuZXhwb3J0cy5BVVRIT1JJWkFUSU9OID0gJ0F1dGhvcml6YXRpb24nO1xuZXhwb3J0cy5YX0JDRV9EQVRFID0gJ3gtYmNlLWRhdGUnO1xuZXhwb3J0cy5YX0JDRV9BQ0wgPSAneC1iY2UtYWNsJztcbmV4cG9ydHMuWF9CQ0VfUkVRVUVTVF9JRCA9ICd4LWJjZS1yZXF1ZXN0LWlkJztcbmV4cG9ydHMuWF9CQ0VfQ09OVEVOVF9TSEEyNTYgPSAneC1iY2UtY29udGVudC1zaGEyNTYnO1xuZXhwb3J0cy5YX0JDRV9PQkpFQ1RfQUNMID0gJ3gtYmNlLW9iamVjdC1hY2wnO1xuZXhwb3J0cy5YX0JDRV9PQkpFQ1RfR1JBTlRfUkVBRCA9ICd4LWJjZS1vYmplY3QtZ3JhbnQtcmVhZCc7XG5cbmV4cG9ydHMuWF9IVFRQX0hFQURFUlMgPSAnaHR0cF9oZWFkZXJzJztcbmV4cG9ydHMuWF9CT0RZID0gJ2JvZHknO1xuZXhwb3J0cy5YX1NUQVRVU19DT0RFID0gJ3N0YXR1c19jb2RlJztcbmV4cG9ydHMuWF9NRVNTQUdFID0gJ21lc3NhZ2UnO1xuZXhwb3J0cy5YX0NPREUgPSAnY29kZSc7XG5leHBvcnRzLlhfUkVRVUVTVF9JRCA9ICdyZXF1ZXN0X2lkJztcblxuZXhwb3J0cy5TRVNTSU9OX1RPS0VOID0gJ3gtYmNlLXNlY3VyaXR5LXRva2VuJztcblxuZXhwb3J0cy5YX1ZPRF9NRURJQV9USVRMRSA9ICd4LXZvZC1tZWRpYS10aXRsZSc7XG5leHBvcnRzLlhfVk9EX01FRElBX0RFU0NSSVBUSU9OID0gJ3gtdm9kLW1lZGlhLWRlc2NyaXB0aW9uJztcbmV4cG9ydHMuQUNDRVBUX0VOQ09ESU5HID0gJ2FjY2VwdC1lbmNvZGluZyc7XG5leHBvcnRzLkFDQ0VQVCA9ICdhY2NlcHQnO1xuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2h0dHBfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cbi8qIGVzbGludCBtYXgtcGFyYW1zOlswLDEwXSAqL1xuLyogZ2xvYmFscyBBcnJheUJ1ZmZlciAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSg0MikuRXZlbnRFbWl0dGVyO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoMzUpO1xudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgdXRpbCA9IHJlcXVpcmUoNDcpO1xudmFyIEggPSByZXF1aXJlKDIwKTtcblxuLyoqXG4gKiBUaGUgSHR0cENsaWVudFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgaHR0cCBjbGllbnQgY29uZmlndXJhdGlvbi5cbiAqL1xuZnVuY3Rpb24gSHR0cENsaWVudChjb25maWcpIHtcbiAgICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgLyoqXG4gICAgICogaHR0cChzKSByZXF1ZXN0IG9iamVjdFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5fcmVxID0gbnVsbDtcbn1cbnV0aWwuaW5oZXJpdHMoSHR0cENsaWVudCwgRXZlbnRFbWl0dGVyKTtcblxuLyoqXG4gKiBTZW5kIEh0dHAgUmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodHRwTWV0aG9kIEdFVCxQT1NULFBVVCxERUxFVEUsSEVBRFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIGh0dHAgcmVxdWVzdCBwYXRoLlxuICogQHBhcmFtIHsoc3RyaW5nfEJ1ZmZlcnxzdHJlYW0uUmVhZGFibGUpPX0gYm9keSBUaGUgcmVxdWVzdCBib2R5LiBJZiBgYm9keWAgaXMgYVxuICogc3RyZWFtLCBgQ29udGVudC1MZW5ndGhgIG11c3QgYmUgc2V0IGV4cGxpY2l0bHkuXG4gKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgVGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgVGhlIHF1ZXJ5c3RyaW5ncyBpbiB1cmwuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6c3RyaW5nPX0gc2lnbkZ1bmN0aW9uIFRoZSBgQXV0aG9yaXphdGlvbmAgc2lnbmF0dXJlIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge3N0cmVhbS5Xcml0YWJsZT19IG91dHB1dFN0cmVhbSBUaGUgaHR0cCByZXNwb25zZSBib2R5LlxuICogQHBhcmFtIHtudW1iZXI9fSByZXRyeSBUaGUgbWF4aW11bSBudW1iZXIgb2YgbmV0d29yayBjb25uZWN0aW9uIGF0dGVtcHRzLlxuICpcbiAqIEByZXNvbHZlIHt7aHR0cF9oZWFkZXJzOk9iamVjdCxib2R5Ok9iamVjdH19XG4gKiBAcmVqZWN0IHtPYmplY3R9XG4gKlxuICogQHJldHVybiB7US5kZWZlcn1cbiAqL1xuSHR0cENsaWVudC5wcm90b3R5cGUuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcGF0aCwgYm9keSwgaGVhZGVycywgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lnbkZ1bmN0aW9uLCBvdXRwdXRTdHJlYW0pIHtcblxuICAgIHZhciByZXF1ZXN0VXJsID0gdGhpcy5fZ2V0UmVxdWVzdFVybChwYXRoLCBwYXJhbXMpO1xuXG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzID0ge307XG4gICAgZGVmYXVsdEhlYWRlcnNbSC5YX0JDRV9EQVRFXSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC5cXGQrWiQvLCAnWicpO1xuICAgIGRlZmF1bHRIZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04JztcbiAgICBkZWZhdWx0SGVhZGVyc1tILkhPU1RdID0gL15cXHcrOlxcL1xcLyhbXlxcL10rKS8uZXhlYyh0aGlzLmNvbmZpZy5lbmRwb2ludClbMV07XG5cbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSB1LmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG5cbiAgICAvLyBDaGVjayB0aGUgY29udGVudC1sZW5ndGhcbiAgICBpZiAoIXJlcXVlc3RIZWFkZXJzLmhhc093blByb3BlcnR5KEguQ09OVEVOVF9MRU5HVEgpKSB7XG4gICAgICAgIHZhciBjb250ZW50TGVuZ3RoID0gdGhpcy5fZ3Vlc3NDb250ZW50TGVuZ3RoKGJvZHkpO1xuICAgICAgICBpZiAoIShjb250ZW50TGVuZ3RoID09PSAwICYmIC9HRVR8SEVBRC9pLnRlc3QoaHR0cE1ldGhvZCkpKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzmmK8gR0VUIOaIliBIRUFEIOivt+axgu+8jOW5tuS4lCBDb250ZW50LUxlbmd0aCDmmK8gMO+8jOmCo+S5iCBSZXF1ZXN0IEhlYWRlciDph4zpnaLlsLHkuI3opoHlh7rnjrAgQ29udGVudC1MZW5ndGhcbiAgICAgICAgICAgIC8vIOWQpuWImeacrOWcsOiuoeeul+etvuWQjeeahOaXtuWAmeS8muiuoeeul+i/m+WOu++8jOS9huaYr+a1j+iniOWZqOWPkeivt+axgueahOaXtuWAmeS4jeS4gOWumuS8muacie+8jOatpOaXtuWvvOiHtCBTaWduYXR1cmUgTWlzbWF0Y2gg55qE5oOF5Ya1XG4gICAgICAgICAgICByZXF1ZXN0SGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IGNvbnRlbnRMZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNyZWF0ZVNpZ25hdHVyZSA9IHNpZ25GdW5jdGlvbiB8fCB1Lm5vb3A7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZShjcmVhdGVTaWduYXR1cmUodGhpcy5jb25maWcuY3JlZGVudGlhbHMsIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgcmVxdWVzdEhlYWRlcnMpKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF1dGhvcml6YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEhlYWRlcnNbSC5BVVRIT1JJWkFUSU9OXSA9IGF1dGhvcml6YXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RIZWFkZXJzW0guWF9CQ0VfREFURV0gPSB4YmNlRGF0ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZG9SZXF1ZXN0KGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsXG4gICAgICAgICAgICAgICAgICAgIHUub21pdChyZXF1ZXN0SGVhZGVycywgSC5DT05URU5UX0xFTkdUSCwgSC5IT1NUKSxcbiAgICAgICAgICAgICAgICAgICAgYm9keSwgb3V0cHV0U3RyZWFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmV0dXJuIFEucmVqZWN0KGV4KTtcbiAgICB9XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsIHJlcXVlc3RIZWFkZXJzLCBib2R5LCBvdXRwdXRTdHJlYW0pIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsIHRydWUpO1xuICAgIGZvciAodmFyIGhlYWRlciBpbiByZXF1ZXN0SGVhZGVycykge1xuICAgICAgICBpZiAocmVxdWVzdEhlYWRlcnMuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcmVxdWVzdEhlYWRlcnNbaGVhZGVyXTtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgfTtcbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcigneGhyIGFib3J0ZWQnKSk7XG4gICAgfTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgICAgICAgICAgICAgIC8vIElFIC0gIzE0NTA6IHNvbWV0aW1lcyByZXR1cm5zIDEyMjMgd2hlbiBpdCBzaG91bGQgYmUgMjA0XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gMjA0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICAgICAgdmFyIGlzSlNPTiA9IC9hcHBsaWNhdGlvblxcL2pzb24vLnRlc3QoY29udGVudFR5cGUpO1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlQm9keSA9IGlzSlNPTiA/IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgOiB4aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgICAgICB2YXIgaXNTdWNjZXNzID0gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQ7XG4gICAgICAgICAgICBpZiAoaXNTdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBzZWxmLl9maXhIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogcmVzcG9uc2VCb2R5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfY29kZTogc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXNwb25zZUJvZHkubWVzc2FnZSB8fCAnPG1lc3NhZ2U+JyxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogcmVzcG9uc2VCb2R5LmNvZGUgfHwgJzxjb2RlPicsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RfaWQ6IHJlc3BvbnNlQm9keS5yZXF1ZXN0SWQgfHwgJzxyZXF1ZXN0X2lkPidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgdS5lYWNoKFsncHJvZ3Jlc3MnLCAnZXJyb3InLCAnYWJvcnQnXSwgZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi5lbWl0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZW1pdChldmVudE5hbWUsIGV2dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgeGhyLnNlbmQoYm9keSk7XG5cbiAgICBzZWxmLl9yZXEgPSB7eGhyOiB4aHJ9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZ3Vlc3NDb250ZW50TGVuZ3RoID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBlbHNlIGlmICh1LmlzU3RyaW5nKGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIGRhdGEgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnNpemU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmJ5dGVMZW5ndGg7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBDb250ZW50LUxlbmd0aCBpcyBzcGVjaWZpZWQuJyk7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZml4SGVhZGVycyA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gICAgdmFyIGZpeGVkSGVhZGVycyA9IHt9O1xuXG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgICAgdS5lYWNoKGhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKSwgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICAgICAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIGlkeCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBsaW5lLnN1YnN0cmluZyhpZHggKyAxKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC8sICcnKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnZXRhZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpeGVkSGVhZGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmaXhlZEhlYWRlcnM7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5idWlsZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciB1cmxFbmNvZGVTdHIgPSByZXF1aXJlKDQ1KS5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9QZXJjZW50LWVuY29kaW5nXG4gICAgcmV0dXJuIHVybEVuY29kZVN0ci5yZXBsYWNlKC9bKCknIX4uKlxcLV9dL2csIGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgICAgIHJldHVybiAnJScgKyBjaGFyLmNoYXJDb2RlQXQoKS50b1N0cmluZygxNik7XG4gICAgfSk7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZ2V0UmVxdWVzdFVybCA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMpIHtcbiAgICB2YXIgdXJpID0gcGF0aDtcbiAgICB2YXIgcXMgPSB0aGlzLmJ1aWxkUXVlcnlTdHJpbmcocGFyYW1zKTtcbiAgICBpZiAocXMpIHtcbiAgICAgICAgdXJpICs9ICc/JyArIHFzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5lbmRwb2ludCArIHVyaTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSHR0cENsaWVudDtcblxuIiwiLyoqXG4gKiBAZmlsZSBzcmMvbWltZS50eXBlcy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbnZhciBtaW1lVHlwZXMgPSB7XG59O1xuXG5leHBvcnRzLmd1ZXNzID0gZnVuY3Rpb24gKGV4dCkge1xuICAgIGlmICghZXh0IHx8ICFleHQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgICB9XG4gICAgaWYgKGV4dFswXSA9PT0gJy4nKSB7XG4gICAgICAgIGV4dCA9IGV4dC5zdWJzdHIoMSk7XG4gICAgfVxuICAgIHJldHVybiBtaW1lVHlwZXNbZXh0LnRvTG93ZXJDYXNlKCldIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3RyaW5ncy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIGtFc2NhcGVkTWFwID0ge1xuICAgICchJzogJyUyMScsXG4gICAgJ1xcJyc6ICclMjcnLFxuICAgICcoJzogJyUyOCcsXG4gICAgJyknOiAnJTI5JyxcbiAgICAnKic6ICclMkEnXG59O1xuXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIGVuY29kaW5nU2xhc2gpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZyk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1shJ1xcKFxcKVxcKl0vZywgZnVuY3Rpb24gKCQxKSB7XG4gICAgICAgIHJldHVybiBrRXNjYXBlZE1hcFskMV07XG4gICAgfSk7XG5cbiAgICBpZiAoZW5jb2RpbmdTbGFzaCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoLyUyRi9naSwgJy8nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0cy50cmltID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgIHJldHVybiAoc3RyaW5nIHx8ICcnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59O1xuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIGNvbmZpZy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuXG52YXIga0RlZmF1bHRPcHRpb25zID0ge1xuICAgIHJ1bnRpbWVzOiAnaHRtbDUnLFxuXG4gICAgLy8gYm9z5pyN5Yqh5Zmo55qE5Zyw5Z2A77yM6buY6K6kKGh0dHA6Ly9ib3MuYmouYmFpZHViY2UuY29tKVxuICAgIGJvc19lbmRwb2ludDogJ2h0dHA6Ly9ib3MuYmouYmFpZHViY2UuY29tJyxcblxuICAgIC8vIOm7mOiupOeahCBhayDlkowgc2sg6YWN572uXG4gICAgYm9zX2NyZWRlbnRpYWxzOiBudWxsLFxuXG4gICAgLy8g5aaC5p6c5YiH5o2i5YiwIGFwcGVuZGFibGUg5qih5byP77yM5pyA5aSn5Y+q5pSv5oyBIDVHIOeahOaWh+S7tlxuICAgIC8vIOS4jeWGjeaUr+aMgSBNdWx0aXBhcnQg55qE5pa55byP5LiK5Lyg5paH5Lu2XG4gICAgYm9zX2FwcGVuZGFibGU6IGZhbHNlLFxuXG4gICAgLy8g5Li65LqG5aSE55CGIEZsYXNoIOS4jeiDveWPkemAgSBIRUFELCBERUxFVEUg5LmL57G755qE6K+35rGC77yM5Lul5Y+K5peg5rOVXG4gICAgLy8g6I635Y+WIHJlc3BvbnNlIGhlYWRlcnMg55qE6Zeu6aKY77yM6ZyA6KaB5pCe5LiA5LiqIHJlbGF5IOacjeWKoeWZqO+8jOaKiuaVsOaNrlxuICAgIC8vIOagvOW8j+i9rOWMluS4gOS4i1xuICAgIGJvc19yZWxheV9zZXJ2ZXI6ICdodHRwczovL3JlbGF5LmVmZS50ZWNoJyxcblxuICAgIC8vIOaYr+WQpuaUr+aMgeWkmumAie+8jOm7mOiupChmYWxzZSlcbiAgICBtdWx0aV9zZWxlY3Rpb246IGZhbHNlLFxuXG4gICAgLy8g5aSx6LSl5LmL5ZCO6YeN6K+V55qE5qyh5pWwKOWNleS4quaWh+S7tuaIluiAheWIhueJhynvvIzpu5jorqQoMCnvvIzkuI3ph43or5VcbiAgICBtYXhfcmV0cmllczogMCxcblxuICAgIC8vIOWksei0pemHjeivleeahOmXtOmalOaXtumXtO+8jOm7mOiupCAxMDAwbXNcbiAgICByZXRyeV9pbnRlcnZhbDogMTAwMCxcblxuICAgIC8vIOaYr+WQpuiHquWKqOS4iuS8oO+8jOm7mOiupChmYWxzZSlcbiAgICBhdXRvX3N0YXJ0OiBmYWxzZSxcblxuICAgIC8vIOacgOWkp+WPr+S7pemAieaLqeeahOaWh+S7tuWkp+Wwj++8jOm7mOiupCgxMDBNKVxuICAgIG1heF9maWxlX3NpemU6ICcxMDBtYicsXG5cbiAgICAvLyDotoXov4fov5nkuKrmlofku7blpKflsI/kuYvlkI7vvIzlvIDlp4vkvb/nlKjliIbniYfkuIrkvKDvvIzpu5jorqQoMTBNKVxuICAgIGJvc19tdWx0aXBhcnRfbWluX3NpemU6ICcxMG1iJyxcblxuICAgIC8vIOWIhueJh+S4iuS8oOeahOaXtuWAme+8jOW5tuihjOS4iuS8oOeahOS4quaVsO+8jOm7mOiupCgxKVxuICAgIGJvc19tdWx0aXBhcnRfcGFyYWxsZWw6IDEsXG5cbiAgICAvLyDpmJ/liJfkuK3nmoTmlofku7bvvIzlubbooYzkuIrkvKDnmoTkuKrmlbDvvIzpu5jorqQoMylcbiAgICBib3NfdGFza19wYXJhbGxlbDogMyxcblxuICAgIC8vIOiuoeeul+etvuWQjeeahOaXtuWAme+8jOacieS6myBoZWFkZXIg6ZyA6KaB5YmU6Zmk77yM5YeP5bCR5Lyg6L6T55qE5L2T56evXG4gICAgYXV0aF9zdHJpcHBlZF9oZWFkZXJzOiBbJ1VzZXItQWdlbnQnLCAnQ29ubmVjdGlvbiddLFxuXG4gICAgLy8g5YiG54mH5LiK5Lyg55qE5pe25YCZ77yM5q+P5Liq5YiG54mH55qE5aSn5bCP77yM6buY6K6kKDRNKVxuICAgIGNodW5rX3NpemU6ICc0bWInLFxuXG4gICAgLy8g5YiG5Z2X5LiK5Lyg5pe2LOaYr+WQpuWFgeiuuOaWreeCuee7reS8oO+8jOm7mOiupCh0cnVlKVxuICAgIGJvc19tdWx0aXBhcnRfYXV0b19jb250aW51ZTogdHJ1ZSxcblxuICAgIC8vIOWIhuW8gOS4iuS8oOeahOaXtuWAme+8jGxvY2FsU3RvcmFnZemHjOmdomtleeeahOeUn+aIkOaWueW8j++8jOm7mOiupOaYryBgZGVmYXVsdGBcbiAgICAvLyDlpoLmnpzpnIDopoHoh6rlrprkuYnvvIzlj6/ku6XpgJrov4cgWFhYXG4gICAgYm9zX211bHRpcGFydF9sb2NhbF9rZXlfZ2VuZXJhdG9yOiAnZGVmYXVsdCcsXG5cbiAgICAvLyDmmK/lkKblhYHorrjpgInmi6nnm67lvZVcbiAgICBkaXJfc2VsZWN0aW9uOiBmYWxzZSxcblxuICAgIC8vIOaYr+WQpumcgOimgeavj+asoemDveWOu+acjeWKoeWZqOiuoeeul+etvuWQjVxuICAgIGdldF9uZXdfdXB0b2tlbjogdHJ1ZSxcblxuICAgIC8vIOWboOS4uuS9v+eUqCBGb3JtIFBvc3Qg55qE5qC85byP77yM5rKh5pyJ6K6+572u6aKd5aSW55qEIEhlYWRlcu+8jOS7juiAjOWPr+S7peS/neivgVxuICAgIC8vIOS9v+eUqCBGbGFzaCDkuZ/og73kuIrkvKDlpKfmlofku7ZcbiAgICAvLyDkvY7niYjmnKzmtY/op4jlmajkuIrkvKDmlofku7bnmoTml7blgJnvvIzpnIDopoHorr7nva4gcG9saWN577yM6buY6K6k5oOF5Ya15LiLXG4gICAgLy8gcG9saWN555qE5YaF5a655Y+q6ZyA6KaB5YyF5ZCrIGV4cGlyYXRpb24g5ZKMIGNvbmRpdGlvbnMg5Y2z5Y+vXG4gICAgLy8gcG9saWN5OiB7XG4gICAgLy8gICBleHBpcmF0aW9uOiAneHgnLFxuICAgIC8vICAgY29uZGl0aW9uczogW1xuICAgIC8vICAgICB7YnVja2V0OiAndGhlLWJ1Y2tldC1uYW1lJ31cbiAgICAvLyAgIF1cbiAgICAvLyB9XG4gICAgLy8gYm9zX3BvbGljeTogbnVsbCxcblxuICAgIC8vIOS9jueJiOacrOa1j+iniOWZqOS4iuS8oOaWh+S7tueahOaXtuWAme+8jOmcgOimgeiuvue9riBwb2xpY3lfc2lnbmF0dXJlXG4gICAgLy8g5aaC5p6c5rKh5pyJ6K6+572uIGJvc19wb2xpY3lfc2lnbmF0dXJlIOeahOivne+8jOS8mumAmui/hyB1cHRva2VuX3VybCDmnaXor7fmsYJcbiAgICAvLyDpu5jorqTlj6rkvJror7fmsYLkuIDmrKHvvIzlpoLmnpzlpLHmlYjkuobvvIzpnIDopoHmiYvliqjmnaXph43nva4gcG9saWN5X3NpZ25hdHVyZVxuICAgIC8vIGJvc19wb2xpY3lfc2lnbmF0dXJlOiBudWxsLFxuXG4gICAgLy8gSlNPTlAg6buY6K6k55qE6LaF5pe25pe26Ze0KDUwMDBtcylcbiAgICB1cHRva2VuX3ZpYV9qc29ucDogdHJ1ZSxcbiAgICB1cHRva2VuX3RpbWVvdXQ6IDUwMDAsXG4gICAgdXB0b2tlbl9qc29ucF90aW1lb3V0OiA1MDAwLCAgICAvLyDkuI3mlK/mjIHkuobvvIzlkI7nu63lu7rorq7nlKggdXB0b2tlbl90aW1lb3V0XG5cbiAgICAvLyDmmK/lkKbopoHnpoHnlKjnu5/orqHvvIzpu5jorqTkuI3npoHnlKhcbiAgICAvLyDlpoLmnpzpnIDopoHnpoHnlKjvvIzmioogdHJhY2tlcl9pZCDorr7nva7miJAgbnVsbCDljbPlj69cbiAgICB0cmFja2VyX2lkOiAnMmUwYmM4YzVlN2NlYjI1Nzk2YmE0OTYyZTdiNTczODcnXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtEZWZhdWx0T3B0aW9ucztcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLCB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBldmVudHMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGtQb3N0SW5pdDogJ1Bvc3RJbml0JyxcbiAgICBrS2V5OiAnS2V5JyxcbiAgICBrTGlzdFBhcnRzOiAnTGlzdFBhcnRzJyxcbiAgICBrT2JqZWN0TWV0YXM6ICdPYmplY3RNZXRhcycsXG4gICAgLy8ga0ZpbGVzUmVtb3ZlZCAgOiAnRmlsZXNSZW1vdmVkJyxcbiAgICBrRmlsZUZpbHRlcmVkOiAnRmlsZUZpbHRlcmVkJyxcbiAgICBrRmlsZXNBZGRlZDogJ0ZpbGVzQWRkZWQnLFxuICAgIGtGaWxlc0ZpbHRlcjogJ0ZpbGVzRmlsdGVyJyxcbiAgICBrTmV0d29ya1NwZWVkOiAnTmV0d29ya1NwZWVkJyxcbiAgICBrQmVmb3JlVXBsb2FkOiAnQmVmb3JlVXBsb2FkJyxcbiAgICAvLyBrVXBsb2FkRmlsZSAgICA6ICdVcGxvYWRGaWxlJywgICAgICAgLy8gPz9cbiAgICBrVXBsb2FkUHJvZ3Jlc3M6ICdVcGxvYWRQcm9ncmVzcycsXG4gICAga0ZpbGVVcGxvYWRlZDogJ0ZpbGVVcGxvYWRlZCcsXG4gICAga1VwbG9hZFBhcnRQcm9ncmVzczogJ1VwbG9hZFBhcnRQcm9ncmVzcycsXG4gICAga0NodW5rVXBsb2FkZWQ6ICdDaHVua1VwbG9hZGVkJyxcbiAgICBrVXBsb2FkUmVzdW1lOiAnVXBsb2FkUmVzdW1lJywgLy8g5pat54K557ut5LygXG4gICAgLy8ga1VwbG9hZFBhdXNlOiAnVXBsb2FkUGF1c2UnLCAgIC8vIOaaguWBnFxuICAgIGtVcGxvYWRSZXN1bWVFcnJvcjogJ1VwbG9hZFJlc3VtZUVycm9yJywgLy8g5bCd6K+V5pat54K557ut5Lyg5aSx6LSlXG4gICAga1VwbG9hZENvbXBsZXRlOiAnVXBsb2FkQ29tcGxldGUnLFxuICAgIGtFcnJvcjogJ0Vycm9yJyxcbiAgICBrQWJvcnRlZDogJ0Fib3J0ZWQnXG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBtdWx0aXBhcnRfdGFzay5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciBhc3luYyA9IHJlcXVpcmUoMzYpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzQpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoMjUpO1xudmFyIFRhc2sgPSByZXF1aXJlKDMxKTtcblxuLyoqXG4gKiBNdWx0aXBhcnRUYXNrXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIE11bHRpcGFydFRhc2soKSB7XG4gICAgVGFzay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLyoqXG4gICAgICog5om56YeP5LiK5Lyg55qE5pe25YCZ77yM5L+d5a2Y55qEIHhoclJlcXVlc3Rpbmcg5a+56LGhXG4gICAgICog5aaC5p6c6ZyA6KaBIGFib3J0IOeahOaXtuWAme+8jOS7jui/memHjOadpeiOt+WPllxuICAgICAqL1xuICAgIHRoaXMueGhyUG9vbHMgPSBbXTtcbn1cbnV0aWxzLmluaGVyaXRzKE11bHRpcGFydFRhc2ssIFRhc2spO1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIGZpbGUgPSB0aGlzLm9wdGlvbnMuZmlsZTtcbiAgICB2YXIgYnVja2V0ID0gdGhpcy5vcHRpb25zLmJ1Y2tldDtcbiAgICB2YXIgb2JqZWN0ID0gdGhpcy5vcHRpb25zLm9iamVjdDtcbiAgICB2YXIgbWV0YXMgPSB0aGlzLm9wdGlvbnMubWV0YXM7XG4gICAgdmFyIGNodW5rU2l6ZSA9IHRoaXMub3B0aW9ucy5jaHVua19zaXplO1xuICAgIHZhciBtdWx0aXBhcnRQYXJhbGxlbCA9IHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X3BhcmFsbGVsO1xuXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdXRpbHMuZ3Vlc3NDb250ZW50VHlwZShmaWxlKTtcbiAgICB2YXIgb3B0aW9ucyA9IHsnQ29udGVudC1UeXBlJzogY29udGVudFR5cGV9O1xuICAgIHZhciB1cGxvYWRJZCA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5faW5pdGlhdGVNdWx0aXBhcnRVcGxvYWQoZmlsZSwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB1cGxvYWRJZCA9IHJlc3BvbnNlLmJvZHkudXBsb2FkSWQ7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSByZXNwb25zZS5ib2R5LnBhcnRzIHx8IFtdO1xuICAgICAgICAgICAgLy8g5YeG5aSHIHVwbG9hZFBhcnRzXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgICAgICB2YXIgdGFza3MgPSB1dGlscy5nZXRUYXNrcyhmaWxlLCB1cGxvYWRJZCwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCk7XG4gICAgICAgICAgICB1dGlscy5maWx0ZXJUYXNrcyh0YXNrcywgcGFydHMpO1xuXG4gICAgICAgICAgICB2YXIgbG9hZGVkID0gcGFydHMubGVuZ3RoO1xuICAgICAgICAgICAgLy8g6L+Z5Liq55So5p2l6K6w5b2V5pW05L2TIFBhcnRzIOeahOS4iuS8oOi/m+W6pu+8jOS4jeaYr+WNleS4qiBQYXJ0IOeahOS4iuS8oOi/m+W6plxuICAgICAgICAgICAgLy8g5Y2V5LiqIFBhcnQg55qE5LiK5Lyg6L+b5bqm5Y+v5Lul55uR5ZCsIGtVcGxvYWRQYXJ0UHJvZ3Jlc3Mg5p2l5b6X5YiwXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoQ29tcHV0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsb2FkZWQ6IGxvYWRlZCxcbiAgICAgICAgICAgICAgICB0b3RhbDogdGFza3MubGVuZ3RoXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGxvYWRlZCkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbZmlsZSwgbG9hZGVkIC8gdGFza3MubGVuZ3RoLCBudWxsXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzeW5jLm1hcExpbWl0KHRhc2tzLCBtdWx0aXBhcnRQYXJhbGxlbCwgc2VsZi5fdXBsb2FkUGFydChzdGF0ZSksXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZXMpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0TGlzdCA9IFtdO1xuICAgICAgICAgICAgdS5lYWNoKHJlc3BvbnNlcywgZnVuY3Rpb24gKHJlc3BvbnNlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHBhcnRMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwYXJ0TnVtYmVyOiBpbmRleCArIDEsXG4gICAgICAgICAgICAgICAgICAgIGVUYWc6IHJlc3BvbnNlLmh0dHBfaGVhZGVycy5ldGFnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIOWFqOmDqOS4iuS8oOe7k+adn+WQjuWIoOmZpGxvY2FsU3RvcmFnZVxuICAgICAgICAgICAgc2VsZi5fZ2VuZXJhdGVMb2NhbEtleSh7XG4gICAgICAgICAgICAgICAgYmxvYjogZmlsZSxcbiAgICAgICAgICAgICAgICBjaHVua1NpemU6IGNodW5rU2l6ZSxcbiAgICAgICAgICAgICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgICAgICAgICBvYmplY3Q6IG9iamVjdFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgdXRpbHMucmVtb3ZlVXBsb2FkSWQoa2V5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCwgcGFydExpc3QsIG1ldGFzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2ZpbGUsIDFdKTtcblxuICAgICAgICAgICAgcmVzcG9uc2UuYm9keS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICByZXNwb25zZS5ib2R5Lm9iamVjdCA9IG9iamVjdDtcblxuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rRmlsZVVwbG9hZGVkLCBbZmlsZSwgcmVzcG9uc2VdKTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZXZlbnRUeXBlID0gc2VsZi5hYm9ydGVkID8gZXZlbnRzLmtBYm9ydGVkIDogZXZlbnRzLmtFcnJvcjtcbiAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudFR5cGUsIFtlcnJvciwgZmlsZV0pO1xuICAgICAgICB9KTtcbn07XG5cblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2luaXRpYXRlTXVsdGlwYXJ0VXBsb2FkID0gZnVuY3Rpb24gKGZpbGUsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciB1cGxvYWRJZDtcbiAgICB2YXIgbG9jYWxTYXZlS2V5O1xuXG4gICAgZnVuY3Rpb24gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LmluaXRpYXRlTXVsdGlwYXJ0VXBsb2FkKGJ1Y2tldCwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5zZXRVcGxvYWRJZChsb2NhbFNhdmVLZXksIHJlc3BvbnNlLmJvZHkudXBsb2FkSWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkucGFydHMgPSBbXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIga2V5T3B0aW9ucyA9IHtcbiAgICAgICAgYmxvYjogZmlsZSxcbiAgICAgICAgY2h1bmtTaXplOiBjaHVua1NpemUsXG4gICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICBvYmplY3Q6IG9iamVjdFxuICAgIH07XG4gICAgdmFyIHByb21pc2UgPSB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9hdXRvX2NvbnRpbnVlXG4gICAgICAgID8gdGhpcy5fZ2VuZXJhdGVMb2NhbEtleShrZXlPcHRpb25zKVxuICAgICAgICA6IFEucmVzb2x2ZShudWxsKTtcblxuICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgbG9jYWxTYXZlS2V5ID0ga2V5O1xuICAgICAgICAgICAgaWYgKCFsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGxvYWRJZCA9IHV0aWxzLmdldFVwbG9hZElkKGxvY2FsU2F2ZUtleSk7XG4gICAgICAgICAgICBpZiAoIXVwbG9hZElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2xpc3RQYXJ0cyhmaWxlLCBidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmICh1cGxvYWRJZCAmJiBsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSByZXNwb25zZS5ib2R5LnBhcnRzO1xuICAgICAgICAgICAgICAgIC8vIGxpc3RQYXJ0cyDnmoTov5Tlm57nu5PmnpxcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRSZXN1bWUsIFtmaWxlLCBwYXJ0cywgbnVsbF0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkudXBsb2FkSWQgPSB1cGxvYWRJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodXBsb2FkSWQgJiYgbG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c6I635Y+W5bey5LiK5Lyg5YiG54mH5aSx6LSl77yM5YiZ6YeN5paw5LiK5Lyg44CCXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUmVzdW1lRXJyb3IsIFtmaWxlLCBlcnJvciwgbnVsbF0pO1xuICAgICAgICAgICAgICAgIHV0aWxzLnJlbW92ZVVwbG9hZElkKGxvY2FsU2F2ZUtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9KTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9nZW5lcmF0ZUxvY2FsS2V5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgZ2VuZXJhdG9yID0gdGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfbG9jYWxfa2V5X2dlbmVyYXRvcjtcbiAgICByZXR1cm4gdXRpbHMuZ2VuZXJhdGVMb2NhbEtleShvcHRpb25zLCBnZW5lcmF0b3IpO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2xpc3RQYXJ0cyA9IGZ1bmN0aW9uIChmaWxlLCBidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciBsb2NhbFBhcnRzID0gZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rTGlzdFBhcnRzLCBbZmlsZSwgdXBsb2FkSWRdKTtcblxuICAgIHJldHVybiBRLnJlc29sdmUobG9jYWxQYXJ0cylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBhcnRzKSB7XG4gICAgICAgICAgICBpZiAodS5pc0FycmF5KHBhcnRzKSAmJiBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0czogcGFydHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWmguaenOi/lOWbnueahOS4jeaYr+aVsOe7hO+8jOWwseiwg+eUqCBsaXN0UGFydHMg5o6l5Y+j5LuO5pyN5Yqh5Zmo6I635Y+W5pWw5o2uXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fbGlzdEFsbFBhcnRzKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCk7XG4gICAgICAgIH0pO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2xpc3RBbGxQYXJ0cyA9IGZ1bmN0aW9uIChidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpIHtcbiAgICAvLyBpc1RydW5jYXRlZCA9PT0gdHJ1ZSAvIGZhbHNlXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgIHZhciBwYXJ0cyA9IFtdO1xuICAgIHZhciBwYXlsb2FkID0gbnVsbDtcbiAgICB2YXIgbWF4UGFydHMgPSAxMDAwOyAgICAgICAgICAvLyDmr4/mrKHnmoTliIbpobVcbiAgICB2YXIgcGFydE51bWJlck1hcmtlciA9IDA7ICAgICAvLyDliIbpmpTnrKZcblxuICAgIGZ1bmN0aW9uIGxpc3RQYXJ0cygpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtYXhQYXJ0czogbWF4UGFydHMsXG4gICAgICAgICAgICBwYXJ0TnVtYmVyTWFya2VyOiBwYXJ0TnVtYmVyTWFya2VyXG4gICAgICAgIH07XG4gICAgICAgIHNlbGYuY2xpZW50Lmxpc3RQYXJ0cyhidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoLmFwcGx5KHBhcnRzLCByZXNwb25zZS5ib2R5LnBhcnRzKTtcbiAgICAgICAgICAgICAgICBwYXJ0TnVtYmVyTWFya2VyID0gcmVzcG9uc2UuYm9keS5uZXh0UGFydE51bWJlck1hcmtlcjtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5ib2R5LmlzVHJ1bmNhdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDnu5PmnZ/kuoZcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5ib2R5LnBhcnRzID0gcGFydHM7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDpgJLlvZLosIPnlKhcbiAgICAgICAgICAgICAgICAgICAgbGlzdFBhcnRzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlbXG4gICAgICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgbGlzdFBhcnRzKCk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl91cGxvYWRQYXJ0ID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICBmdW5jdGlvbiB1cGxvYWRQYXJ0SW5uZXIoaXRlbSwgb3B0X21heFJldHJpZXMpIHtcbiAgICAgICAgaWYgKGl0ZW0uZXRhZykge1xuICAgICAgICAgICAgc2VsZi5uZXR3b3JrSW5mby5sb2FkZWRCeXRlcyArPSBpdGVtLnBhcnRTaXplO1xuXG4gICAgICAgICAgICAvLyDot7Pov4flt7LkuIrkvKDnmoRwYXJ0XG4gICAgICAgICAgICByZXR1cm4gUS5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZXRhZzogaXRlbS5ldGFnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiB7fVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1heFJldHJpZXMgPSBvcHRfbWF4UmV0cmllcyA9PSBudWxsXG4gICAgICAgICAgICA/IHNlbGYub3B0aW9ucy5tYXhfcmV0cmllc1xuICAgICAgICAgICAgOiBvcHRfbWF4UmV0cmllcztcbiAgICAgICAgdmFyIHJldHJ5SW50ZXJ2YWwgPSBzZWxmLm9wdGlvbnMucmV0cnlfaW50ZXJ2YWw7XG5cbiAgICAgICAgdmFyIGJsb2IgPSBpdGVtLmZpbGUuc2xpY2UoaXRlbS5zdGFydCwgaXRlbS5zdG9wICsgMSk7XG4gICAgICAgIGJsb2IuX3ByZXZpb3VzTG9hZGVkID0gMDtcblxuICAgICAgICB2YXIgdXBsb2FkUGFydFhociA9IHNlbGYuY2xpZW50LnVwbG9hZFBhcnRGcm9tQmxvYihpdGVtLmJ1Y2tldCwgaXRlbS5vYmplY3QsXG4gICAgICAgICAgICBpdGVtLnVwbG9hZElkLCBpdGVtLnBhcnROdW1iZXIsIGl0ZW0ucGFydFNpemUsIGJsb2IpO1xuICAgICAgICB2YXIgeGhyUG9vbEluZGV4ID0gc2VsZi54aHJQb29scy5wdXNoKHVwbG9hZFBhcnRYaHIpO1xuXG4gICAgICAgIHJldHVybiB1cGxvYWRQYXJ0WGhyLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgKytzdGF0ZS5sb2FkZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gc3RhdGUubG9hZGVkIC8gc3RhdGUudG90YWw7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtpdGVtLmZpbGUsIHByb2dyZXNzLCBudWxsXSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJZDogaXRlbS51cGxvYWRJZCxcbiAgICAgICAgICAgICAgICAgICAgcGFydE51bWJlcjogaXRlbS5wYXJ0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBwYXJ0U2l6ZTogaXRlbS5wYXJ0U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgYnVja2V0OiBpdGVtLmJ1Y2tldCxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtLm9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBpdGVtLnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogYmxvYi5zaXplLFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0NodW5rVXBsb2FkZWQsIFtpdGVtLmZpbGUsIHJlc3VsdF0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5LiN55So5Yig6Zmk77yM6K6+572u5Li6IG51bGwg5bCx5aW95LqG77yM5Y+N5q2jIGFib3J0IOeahOaXtuWAmeS8muWIpOaWreeahFxuICAgICAgICAgICAgICAgIHNlbGYueGhyUG9vbHNbeGhyUG9vbEluZGV4IC0gMV0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlbXG4gICAgICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChtYXhSZXRyaWVzID4gMCAmJiAhc2VsZi5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOi/mOaciemHjeivleeahOacuuS8mlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbHMuZGVsYXkocmV0cnlJbnRlcnZhbCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBsb2FkUGFydElubmVyKGl0ZW0sIG1heFJldHJpZXMgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOayoeacieacuuS8mumHjeivleS6hiA6LShcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBmaWxlOiBmaWxlLFxuICAgICAgICAvLyB1cGxvYWRJZDogdXBsb2FkSWQsXG4gICAgICAgIC8vIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAvLyBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgLy8gcGFydE51bWJlcjogcGFydE51bWJlcixcbiAgICAgICAgLy8gcGFydFNpemU6IHBhcnRTaXplLFxuICAgICAgICAvLyBzdGFydDogb2Zmc2V0LFxuICAgICAgICAvLyBzdG9wOiBvZmZzZXQgKyBwYXJ0U2l6ZSAtIDFcblxuICAgICAgICB2YXIgcmVzb2x2ZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVqZWN0ID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdXBsb2FkUGFydElubmVyKGl0ZW0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiDnu4jmraLkuIrkvKDku7vliqFcbiAqL1xuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSBudWxsO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy54aHJQb29scy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgeGhyID0gdGhpcy54aHJQb29sc1tpXTtcbiAgICAgICAgaWYgKHhociAmJiB0eXBlb2YgeGhyLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aXBhcnRUYXNrO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvbmV0d29ya19pbmZvLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKDM0KTtcblxuLyoqXG4gKiBOZXR3b3JrSW5mb1xuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBOZXR3b3JrSW5mbygpIHtcbiAgICAvKipcbiAgICAgKiDorrDlvZXku44gc3RhcnQg5byA5aeL5bey57uP5LiK5Lyg55qE5a2X6IqC5pWwLlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sb2FkZWRCeXRlcyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiDorrDlvZXpmJ/liJfkuK3mgLvmlofku7bnmoTlpKflsI8sIFVwbG9hZENvbXBsZXRlIOS5i+WQjuS8muiiq+a4hembtlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy50b3RhbEJ5dGVzID0gMDtcblxuICAgIC8qKlxuICAgICAqIOiusOW9leW8gOWni+S4iuS8oOeahOaXtumXtC5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHV0aWxzLm5vdygpO1xuXG4gICAgdGhpcy5yZXNldCgpO1xufVxuXG5OZXR3b3JrSW5mby5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmxvYWRlZEJ5dGVzLCAgICAgICAgICAgICAgICAgICAgIC8vIOW3sue7j+S4iuS8oOeahFxuICAgICAgICB1dGlscy5ub3coKSAtIHRoaXMuX3N0YXJ0VGltZSwgICAgICAgIC8vIOiKsei0ueeahOaXtumXtFxuICAgICAgICB0aGlzLnRvdGFsQnl0ZXMgLSB0aGlzLmxvYWRlZEJ5dGVzICAgIC8vIOWJqeS9meacquS4iuS8oOeahFxuICAgIF07XG59O1xuXG5OZXR3b3JrSW5mby5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5sb2FkZWRCeXRlcyA9IDA7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdXRpbHMubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ldHdvcmtJbmZvO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBwdXRfb2JqZWN0X3Rhc2suanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzNCk7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgyNSk7XG52YXIgVGFzayA9IHJlcXVpcmUoMzEpO1xuXG4vKipcbiAqIFB1dE9iamVjdFRhc2tcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gUHV0T2JqZWN0VGFzaygpIHtcbiAgICBUYXNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG51dGlscy5pbmhlcml0cyhQdXRPYmplY3RUYXNrLCBUYXNrKTtcblxuUHV0T2JqZWN0VGFzay5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAob3B0X21heFJldHJpZXMpIHtcbiAgICBpZiAodGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIGZpbGUgPSB0aGlzLm9wdGlvbnMuZmlsZTtcbiAgICB2YXIgYnVja2V0ID0gdGhpcy5vcHRpb25zLmJ1Y2tldDtcbiAgICB2YXIgb2JqZWN0ID0gdGhpcy5vcHRpb25zLm9iamVjdDtcbiAgICB2YXIgbWV0YXMgPSB0aGlzLm9wdGlvbnMubWV0YXM7XG4gICAgdmFyIG1heFJldHJpZXMgPSBvcHRfbWF4UmV0cmllcyA9PSBudWxsXG4gICAgICAgID8gdGhpcy5vcHRpb25zLm1heF9yZXRyaWVzXG4gICAgICAgIDogb3B0X21heFJldHJpZXM7XG4gICAgdmFyIHJldHJ5SW50ZXJ2YWwgPSB0aGlzLm9wdGlvbnMucmV0cnlfaW50ZXJ2YWw7XG5cbiAgICB2YXIgY29udGVudFR5cGUgPSB1dGlscy5ndWVzc0NvbnRlbnRUeXBlKGZpbGUpO1xuICAgIHZhciBvcHRpb25zID0gdS5leHRlbmQoeydDb250ZW50LVR5cGUnOiBjb250ZW50VHlwZX0sIG1ldGFzKTtcblxuICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IHRoaXMuY2xpZW50LnB1dE9iamVjdEZyb21CbG9iKGJ1Y2tldCwgb2JqZWN0LCBmaWxlLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzLnhoclJlcXVlc3RpbmcudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtmaWxlLCAxXSk7XG5cbiAgICAgICAgcmVzcG9uc2UuYm9keS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgIHJlc3BvbnNlLmJvZHkub2JqZWN0ID0gb2JqZWN0O1xuXG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0ZpbGVVcGxvYWRlZCwgW2ZpbGUsIHJlc3BvbnNlXSk7XG4gICAgfSlbXG4gICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IHNlbGYuYWJvcnRlZCA/IGV2ZW50cy5rQWJvcnRlZCA6IGV2ZW50cy5rRXJyb3I7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudFR5cGUsIFtlcnJvciwgZmlsZV0pO1xuXG4gICAgICAgIGlmIChlcnJvci5zdGF0dXNfY29kZSAmJiBlcnJvci5jb2RlICYmIGVycm9yLnJlcXVlc3RfaWQpIHtcbiAgICAgICAgICAgIC8vIOW6lOivpeaYr+ato+W4uOeahOmUmeivryjmr5TlpoLnrb7lkI3lvILluLgp77yM6L+Z56eN5oOF5Ya15bCx5LiN6KaB6YeN6K+V5LqGXG4gICAgICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzX2NvZGUgPT09IDApIHtcbiAgICAgICAgLy8gICAgLy8g5Y+v6IO95piv5pat572R5LqG77yMc2FmYXJpIOinpuWPkSBvbmxpbmUvb2ZmbGluZSDlu7bov5/mr5TovoPkuYVcbiAgICAgICAgLy8gICAgLy8g5oiR5Lus5o6o6L+f5LiA5LiLIHNlbGYuX3VwbG9hZE5leHQoKSDnmoTml7bmnLpcbiAgICAgICAgLy8gICAgc2VsZi5wYXVzZSgpO1xuICAgICAgICAvLyAgICByZXR1cm47XG4gICAgICAgIC8vIH1cbiAgICAgICAgZWxzZSBpZiAobWF4UmV0cmllcyA+IDAgJiYgIXNlbGYuYWJvcnRlZCkge1xuICAgICAgICAgICAgLy8g6L+Y5pyJ5py65Lya6YeN6K+VXG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuZGVsYXkocmV0cnlJbnRlcnZhbCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc3RhcnQobWF4UmV0cmllcyAtIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDph43or5Xnu5PmnZ/kuobvvIzkuI3nrqHkuobvvIznu6fnu63kuIvkuIDkuKrmlofku7bnmoTkuIrkvKBcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH0pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFB1dE9iamVjdFRhc2s7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9xdWV1ZS5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyoqXG4gKiBRdWV1ZVxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHsqfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uLlxuICovXG5mdW5jdGlvbiBRdWV1ZShjb2xsZWN0aW9uKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbn1cblxuUXVldWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5sZW5ndGggPD0gMDtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoO1xufTtcblxuUXVldWUucHJvdG90eXBlLmRlcXVldWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5zaGlmdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWV1ZTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzdHNfdG9rZW5fbWFuYWdlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzQpO1xuXG4vKipcbiAqIFN0c1Rva2VuTWFuYWdlclxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIFN0c1Rva2VuTWFuYWdlcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG59XG5cblN0c1Rva2VuTWFuYWdlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLl9jYWNoZVtidWNrZXRdICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2NhY2hlW2J1Y2tldF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFEucmVzb2x2ZSh0aGlzLl9nZXRJbXBsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpLnRoZW4oZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgc2VsZi5fY2FjaGVbYnVja2V0XSA9IHBheWxvYWQ7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH0pO1xufTtcblxuU3RzVG9rZW5NYW5hZ2VyLnByb3RvdHlwZS5fZ2V0SW1wbCA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgdXB0b2tlbl91cmwgPSBvcHRpb25zLnVwdG9rZW5fdXJsO1xuICAgIHZhciB0aW1lb3V0ID0gb3B0aW9ucy51cHRva2VuX3RpbWVvdXQgfHwgb3B0aW9ucy51cHRva2VuX2pzb25wX3RpbWVvdXQ7XG4gICAgdmFyIHZpYUpzb25wID0gb3B0aW9ucy51cHRva2VuX3ZpYV9qc29ucDtcblxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVwdG9rZW5fdXJsLFxuICAgICAgICBqc29ucDogdmlhSnNvbnAgPyAnY2FsbGJhY2snIDogZmFsc2UsXG4gICAgICAgIGRhdGFUeXBlOiB2aWFKc29ucCA/ICdqc29ucCcgOiAnanNvbicsXG4gICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHN0czogSlNPTi5zdHJpbmdpZnkodXRpbHMuZ2V0RGVmYXVsdEFDTChidWNrZXQpKVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICAgICAgLy8gcGF5bG9hZC5BY2Nlc3NLZXlJZFxuICAgICAgICAgICAgLy8gcGF5bG9hZC5TZWNyZXRBY2Nlc3NLZXlcbiAgICAgICAgICAgIC8vIHBheWxvYWQuU2Vzc2lvblRva2VuXG4gICAgICAgICAgICAvLyBwYXlsb2FkLkV4cGlyYXRpb25cbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdHZXQgc3RzIHRva2VuIHRpbWVvdXQgKCcgKyB0aW1lb3V0ICsgJ21zKS4nKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdHNUb2tlbk1hbmFnZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHRhc2suanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cblxuLyoqXG4gKiDkuI3lkIznmoTlnLrmma/kuIvvvIzpnIDopoHpgJrov4fkuI3lkIznmoRUYXNr5p2l5a6M5oiQ5LiK5Lyg55qE5bel5L2cXG4gKlxuICogQHBhcmFtIHtzZGsuQm9zQ2xpZW50fSBjbGllbnQgVGhlIGJvcyBjbGllbnQuXG4gKiBAcGFyYW0ge0V2ZW50RGlzcGF0Y2hlcn0gZXZlbnREaXNwYXRjaGVyIFRoZSBldmVudCBkaXNwYXRjaGVyLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIGV4dHJhIHRhc2stcmVsYXRlZCBhcmd1bWVudHMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRhc2soY2xpZW50LCBldmVudERpc3BhdGNoZXIsIG9wdGlvbnMpIHtcbiAgICAvKipcbiAgICAgKiDlj6/ku6XooqsgYWJvcnQg55qEIHByb21pc2Ug5a+56LGhXG4gICAgICpcbiAgICAgKiBAdHlwZSB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICog5qCH6K6w5LiA5LiL5piv5ZCm5piv5Lq65Li65Lit5pat5LqGXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMubmV0d29ya0luZm8gPSBudWxsO1xuXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIgPSBldmVudERpc3BhdGNoZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gYWJzdHJhY3RNZXRob2QoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmltcGxlbWVudGVkIG1ldGhvZC4nKTtcbn1cblxuLyoqXG4gKiDlvIDlp4vkuIrkvKDku7vliqFcbiAqL1xuVGFzay5wcm90b3R5cGUuc3RhcnQgPSBhYnN0cmFjdE1ldGhvZDtcblxuLyoqXG4gKiDmmoLlgZzkuIrkvKBcbiAqL1xuVGFzay5wcm90b3R5cGUucGF1c2UgPSBhYnN0cmFjdE1ldGhvZDtcblxuLyoqXG4gKiDmgaLlpI3mmoLlgZxcbiAqL1xuVGFzay5wcm90b3R5cGUucmVzdW1lID0gYWJzdHJhY3RNZXRob2Q7XG5cblRhc2sucHJvdG90eXBlLnNldE5ldHdvcmtJbmZvID0gZnVuY3Rpb24gKG5ldHdvcmtJbmZvKSB7XG4gICAgdGhpcy5uZXR3b3JrSW5mbyA9IG5ldHdvcmtJbmZvO1xufTtcblxuLyoqXG4gKiDnu4jmraLkuIrkvKDku7vliqFcbiAqL1xuVGFzay5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMueGhyUmVxdWVzdGluZ1xuICAgICAgICAmJiB0eXBlb2YgdGhpcy54aHJSZXF1ZXN0aW5nLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMueGhyUmVxdWVzdGluZy5hYm9ydCgpO1xuICAgICAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSBudWxsO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGFzaztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlICdMaWNlbnNlJyk7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuICdBUyBJUycgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvdHJhY2tlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuXG4vKipcbiAqIOWIneWni+WMlueZvuW6pue7n+iuoeS7o+eggVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzaXRlSWQg55m+5bqm57uf6K6h56uZ54K5SUQuXG4gKi9cbmV4cG9ydHMuaW5pdCA9IGZ1bmN0aW9uIChzaXRlSWQpIHtcbiAgICB2YXIgaG0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBobS5zcmMgPSAnLy9obS5iYWlkdS5jb20vaG0uanM/JyArIHNpdGVJZDtcbiAgICB2YXIgcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKVswXTtcbiAgICBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGhtLCBzKTtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgdXBsb2FkZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzNCk7XG52YXIgdHJhY2tlciA9IHJlcXVpcmUoMzIpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoMjUpO1xudmFyIGtEZWZhdWx0T3B0aW9ucyA9IHJlcXVpcmUoMjQpO1xudmFyIFB1dE9iamVjdFRhc2sgPSByZXF1aXJlKDI4KTtcbnZhciBNdWx0aXBhcnRUYXNrID0gcmVxdWlyZSgyNik7XG52YXIgU3RzVG9rZW5NYW5hZ2VyID0gcmVxdWlyZSgzMCk7XG52YXIgTmV0d29ya0luZm8gPSByZXF1aXJlKDI3KTtcblxudmFyIEF1dGggPSByZXF1aXJlKDE2KTtcbnZhciBCb3NDbGllbnQgPSByZXF1aXJlKDE4KTtcblxuLyoqXG4gKiBCQ0UgQk9TIFVwbG9hZGVyXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IG9wdGlvbnMg6YWN572u5Y+C5pWwXG4gKi9cbmZ1bmN0aW9uIFVwbG9hZGVyKG9wdGlvbnMpIHtcbiAgICBpZiAodS5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICAvLyDmlK/mjIHnroDkvr/nmoTlhpnms5XvvIzlj6/ku6Xku44gRE9NIOmHjOmdouWIhuaekOebuOWFs+eahOmFjee9ri5cbiAgICAgICAgb3B0aW9ucyA9IHUuZXh0ZW5kKHtcbiAgICAgICAgICAgIGJyb3dzZV9idXR0b246IG9wdGlvbnMsXG4gICAgICAgICAgICBhdXRvX3N0YXJ0OiB0cnVlXG4gICAgICAgIH0sICQob3B0aW9ucykuZGF0YSgpKTtcbiAgICB9XG5cbiAgICB2YXIgcnVudGltZU9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLm9wdGlvbnMgPSB1LmV4dGVuZCh7fSwga0RlZmF1bHRPcHRpb25zLCBydW50aW1lT3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5vcHRpb25zLm1heF9maWxlX3NpemUgPSB1dGlscy5wYXJzZVNpemUodGhpcy5vcHRpb25zLm1heF9maWxlX3NpemUpO1xuICAgIHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X21pbl9zaXplXG4gICAgICAgID0gdXRpbHMucGFyc2VTaXplKHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X21pbl9zaXplKTtcbiAgICB0aGlzLm9wdGlvbnMuY2h1bmtfc2l6ZSA9IHV0aWxzLnBhcnNlU2l6ZSh0aGlzLm9wdGlvbnMuY2h1bmtfc2l6ZSk7XG5cbiAgICB2YXIgY3JlZGVudGlhbHMgPSB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzO1xuICAgIGlmICghY3JlZGVudGlhbHMgJiYgdGhpcy5vcHRpb25zLmJvc19hayAmJiB0aGlzLm9wdGlvbnMuYm9zX3NrKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3NfY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICBhazogdGhpcy5vcHRpb25zLmJvc19hayxcbiAgICAgICAgICAgIHNrOiB0aGlzLm9wdGlvbnMuYm9zX3NrXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Jvc0NsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudCA9IG5ldyBCb3NDbGllbnQoe1xuICAgICAgICBlbmRwb2ludDogdXRpbHMubm9ybWFsaXplRW5kcG9pbnQodGhpcy5vcHRpb25zLmJvc19lbmRwb2ludCksXG4gICAgICAgIGNyZWRlbnRpYWxzOiB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzLFxuICAgICAgICBzZXNzaW9uVG9rZW46IHRoaXMub3B0aW9ucy51cHRva2VuXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDpnIDopoHnrYnlvoXkuIrkvKDnmoTmlofku7bliJfooajvvIzmr4/mrKHkuIrkvKDnmoTml7blgJnvvIzku47ov5nph4zpnaLliKDpmaRcbiAgICAgKiDmiJDlip/miJbogIXlpLHotKXpg73kuI3kvJrlho3mlL7lm57ljrvkuoZcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxGaWxlPn1cbiAgICAgKi9cbiAgICB0aGlzLl9maWxlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICog5q2j5Zyo5LiK5Lyg55qE5paH5Lu25YiX6KGoLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLCBGaWxlPn1cbiAgICAgKi9cbiAgICB0aGlzLl91cGxvYWRpbmdGaWxlcyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICog5piv5ZCm6KKr5Lit5pat5LqG77yM5q+U5aaCIHRoaXMuc3RvcFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX2Fib3J0ID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKblpITkuo7kuIrkvKDnmoTov4fnqIvkuK3vvIzkuZ/lsLHmmK/mraPlnKjlpITnkIYgdGhpcy5fZmlsZXMg6Zif5YiX55qE5YaF5a65LlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX3dvcmtpbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuaUr+aMgXhocjJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl94aHIyU3VwcG9ydGVkID0gdXRpbHMuaXNYaHIyU3VwcG9ydGVkKCk7XG5cbiAgICB0aGlzLl9uZXR3b3JrSW5mbyA9IG5ldyBOZXR3b3JrSW5mbygpO1xuXG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5VcGxvYWRlci5wcm90b3R5cGUuX2dldEN1c3RvbWl6ZWRTaWduYXR1cmUgPSBmdW5jdGlvbiAodXB0b2tlblVybCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciB0aW1lb3V0ID0gb3B0aW9ucy51cHRva2VuX3RpbWVvdXQgfHwgb3B0aW9ucy51cHRva2VuX2pzb25wX3RpbWVvdXQ7XG4gICAgdmFyIHZpYUpzb25wID0gb3B0aW9ucy51cHRva2VuX3ZpYV9qc29ucDtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoXywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKSB7XG4gICAgICAgIGlmICgvXFxiZWQ9KFtcXHdcXC5dKylcXGIvLnRlc3QobG9jYXRpb24uc2VhcmNoKSkge1xuICAgICAgICAgICAgaGVhZGVycy5Ib3N0ID0gUmVnRXhwLiQxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHUuaXNBcnJheShvcHRpb25zLmF1dGhfc3RyaXBwZWRfaGVhZGVycykpIHtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB1Lm9taXQoaGVhZGVycywgb3B0aW9ucy5hdXRoX3N0cmlwcGVkX2hlYWRlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB1cHRva2VuVXJsLFxuICAgICAgICAgICAganNvbnA6IHZpYUpzb25wID8gJ2NhbGxiYWNrJyA6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YVR5cGU6IHZpYUpzb25wID8gJ2pzb25wJyA6ICdqc29uJyxcbiAgICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgaHR0cE1ldGhvZDogaHR0cE1ldGhvZCxcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgIC8vIGRlbGF5OiB+fihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgICAgICAgICAgICAgIHF1ZXJpZXM6IEpTT04uc3RyaW5naWZ5KHBhcmFtcyB8fCB7fSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogSlNPTi5zdHJpbmdpZnkoaGVhZGVycyB8fCB7fSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ0dldCBhdXRob3JpemF0aW9uIHRpbWVvdXQgKCcgKyB0aW1lb3V0ICsgJ21zKS4nKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZC5zdGF0dXNDb2RlID09PSAyMDAgJiYgcGF5bG9hZC5zaWduYXR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwYXlsb2FkLnNpZ25hdHVyZSwgcGF5bG9hZC54YmNlRGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdjcmVhdGVTaWduYXR1cmUgZmFpbGVkLCBzdGF0dXNDb2RlID0gJyArIHBheWxvYWQuc3RhdHVzQ29kZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIOiwg+eUqCB0aGlzLm9wdGlvbnMuaW5pdCDph4zpnaLphY3nva7nmoTmlrnms5VcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSDmlrnms5XlkI3np7BcbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBhcmdzIOiwg+eUqOaXtuWAmeeahOWPguaVsC5cbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHRocm93RXJyb3JzIOWmguaenOWPkeeUn+W8guW4uOeahOaXtuWAme+8jOaYr+WQpumcgOimgeaKm+WHuuadpVxuICogQHJldHVybiB7Kn0g5LqL5Lu255qE6L+U5Zue5YC8LlxuICovXG5VcGxvYWRlci5wcm90b3R5cGUuX2ludm9rZSA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBhcmdzLCB0aHJvd0Vycm9ycykge1xuICAgIHZhciBpbml0ID0gdGhpcy5vcHRpb25zLmluaXQgfHwgdGhpcy5vcHRpb25zLkluaXQ7XG4gICAgaWYgKCFpbml0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbWV0aG9kID0gaW5pdFttZXRob2ROYW1lXTtcbiAgICBpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHVwID0gbnVsbDtcbiAgICAgICAgYXJncyA9IGFyZ3MgPT0gbnVsbCA/IFt1cF0gOiBbdXBdLmNvbmNhdChhcmdzKTtcbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgIGlmICh0aHJvd0Vycm9ycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KGV4KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog5Yid5aeL5YyW5o6n5Lu2LlxuICovXG5VcGxvYWRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIGFjY2VwdCA9IG9wdGlvbnMuYWNjZXB0O1xuXG4gICAgaWYgKG9wdGlvbnMudHJhY2tlcl9pZCkge1xuICAgICAgICB0cmFja2VyLmluaXQob3B0aW9ucy50cmFja2VyX2lkKTtcbiAgICB9XG5cbiAgICB2YXIgYnRuRWxlbWVudCA9ICQob3B0aW9ucy5icm93c2VfYnV0dG9uKTtcbiAgICB2YXIgbm9kZU5hbWUgPSBidG5FbGVtZW50LnByb3AoJ25vZGVOYW1lJyk7XG4gICAgaWYgKG5vZGVOYW1lICE9PSAnSU5QVVQnKSB7XG4gICAgICAgIHZhciBlbGVtZW50Q29udGFpbmVyID0gYnRuRWxlbWVudDtcblxuICAgICAgICAvLyDlpoLmnpzmnKzouqvkuI3mmK8gPGlucHV0IHR5cGU9XCJmaWxlXCIgLz7vvIzoh6rliqjov73liqDkuIDkuKrkuIrljrtcbiAgICAgICAgLy8gMS4gb3B0aW9ucy5icm93c2VfYnV0dG9uIOWQjumdoui/veWKoOS4gOS4quWFg+e0oCA8ZGl2PjxpbnB1dCB0eXBlPVwiZmlsZVwiIC8+PC9kaXY+XG4gICAgICAgIC8vIDIuIGJ0bkVsZW1lbnQucGFyZW50KCkuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgICAgICAvLyAzLiAuYmNlLWJvcy11cGxvYWRlci1pbnB1dC1jb250YWluZXIg55So5p2l6Ieq5a6a5LmJ6Ieq5bex55qE5qC35byPXG4gICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRDb250YWluZXIub3V0ZXJXaWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudENvbnRhaW5lci5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgIHZhciBpbnB1dEVsZW1lbnRDb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwiYmNlLWJvcy11cGxvYWRlci1pbnB1dC1jb250YWluZXJcIj48aW5wdXQgdHlwZT1cImZpbGVcIiAvPjwvZGl2PicpO1xuICAgICAgICBpbnB1dEVsZW1lbnRDb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAndG9wJzogMCwgJ2xlZnQnOiAwLFxuICAgICAgICAgICAgJ3dpZHRoJzogd2lkdGgsICdoZWlnaHQnOiBoZWlnaHQsXG4gICAgICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJyxcbiAgICAgICAgICAgIC8vIOWmguaenOaUr+aMgSB4aHIy77yM5oqKIGlucHV0W3R5cGU9ZmlsZV0g5pS+5Yiw5oyJ6ZKu55qE5LiL6Z2i77yM6YCa6L+H5Li75Yqo6LCD55SoIGZpbGUuY2xpY2soKSDop6blj5FcbiAgICAgICAgICAgIC8vIOWmguaenOS4jeaUr+aMgXhocjIsIOaKiiBpbnB1dFt0eXBlPWZpbGVdIOaUvuWIsOaMiemSrueahOS4iumdou+8jOmAmui/h+eUqOaIt+S4u+WKqOeCueWHuyBpbnB1dFt0eXBlPWZpbGVdIOinpuWPkVxuICAgICAgICAgICAgJ3otaW5kZXgnOiB0aGlzLl94aHIyU3VwcG9ydGVkID8gOTkgOiAxMDBcbiAgICAgICAgfSk7XG4gICAgICAgIGlucHV0RWxlbWVudENvbnRhaW5lci5maW5kKCdpbnB1dCcpLmNzcyh7XG4gICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgJ3RvcCc6IDAsICdsZWZ0JzogMCxcbiAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJywgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICdmb250LXNpemUnOiAnOTk5cHgnLFxuICAgICAgICAgICAgJ29wYWNpdHknOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtZW50Q29udGFpbmVyLmNzcyh7XG4gICAgICAgICAgICAncG9zaXRpb24nOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgJ3otaW5kZXgnOiB0aGlzLl94aHIyU3VwcG9ydGVkID8gMTAwIDogOTlcbiAgICAgICAgfSk7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuYWZ0ZXIoaW5wdXRFbGVtZW50Q29udGFpbmVyKTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5wYXJlbnQoKS5jc3MoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG5cbiAgICAgICAgLy8g5oqKIGJyb3dzZV9idXR0b24g5L+u5pS55Li65b2T5YmN55Sf5oiQ55qE6YKj5Liq5YWD57SgXG4gICAgICAgIG9wdGlvbnMuYnJvd3NlX2J1dHRvbiA9IGlucHV0RWxlbWVudENvbnRhaW5lci5maW5kKCdpbnB1dCcpO1xuXG4gICAgICAgIGlmICh0aGlzLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICBlbGVtZW50Q29udGFpbmVyLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmJyb3dzZV9idXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy5feGhyMlN1cHBvcnRlZFxuICAgICAgICAmJiB0eXBlb2YgbU94aWUgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICYmIHUuaXNGdW5jdGlvbihtT3hpZS5GaWxlSW5wdXQpKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3hpZWNvZGUvbW94aWUvd2lraS9GaWxlSW5wdXRcbiAgICAgICAgLy8gbU94aWUuRmlsZUlucHV0IOWPquaUr+aMgVxuICAgICAgICAvLyBbK106IGJyb3dzZV9idXR0b24sIGFjY2VwdCBtdWx0aXBsZSwgZGlyZWN0b3J5LCBmaWxlXG4gICAgICAgIC8vIFt4XTogY29udGFpbmVyLCByZXF1aXJlZF9jYXBzXG4gICAgICAgIHZhciBmaWxlSW5wdXQgPSBuZXcgbU94aWUuRmlsZUlucHV0KHtcbiAgICAgICAgICAgIHJ1bnRpbWVfb3JkZXI6ICdmbGFzaCxodG1sNCcsXG4gICAgICAgICAgICBicm93c2VfYnV0dG9uOiAkKG9wdGlvbnMuYnJvd3NlX2J1dHRvbikuZ2V0KDApLFxuICAgICAgICAgICAgc3dmX3VybDogb3B0aW9ucy5mbGFzaF9zd2ZfdXJsLFxuICAgICAgICAgICAgYWNjZXB0OiB1dGlscy5leHBhbmRBY2NlcHRUb0FycmF5KGFjY2VwdCksXG4gICAgICAgICAgICBtdWx0aXBsZTogb3B0aW9ucy5tdWx0aV9zZWxlY3Rpb24sXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IG9wdGlvbnMuZGlyX3NlbGVjdGlvbixcbiAgICAgICAgICAgIGZpbGU6ICdmaWxlJyAgICAgIC8vIFBvc3RPYmplY3TmjqXlj6PopoHmsYLlm7rlrprmmK8gJ2ZpbGUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbGVJbnB1dC5vbmNoYW5nZSA9IHUuYmluZCh0aGlzLl9vbkZpbGVzQWRkZWQsIHRoaXMpO1xuICAgICAgICBmaWxlSW5wdXQub25yZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuX2luaXRFdmVudHMoKTtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua1Bvc3RJbml0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmaWxlSW5wdXQuaW5pdCgpO1xuICAgIH1cblxuICAgIHZhciBwcm9taXNlID0gb3B0aW9ucy5ib3NfY3JlZGVudGlhbHNcbiAgICAgICAgPyBRLnJlc29sdmUoKVxuICAgICAgICA6IHNlbGYucmVmcmVzaFN0c1Rva2VuKCk7XG5cbiAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAob3B0aW9ucy5ib3NfY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHNlbGYuY2xpZW50LmNyZWF0ZVNpZ25hdHVyZSA9IGZ1bmN0aW9uIChfLCBodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSBfIHx8IHRoaXMuY29uZmlnLmNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgICAgIHJldHVybiBRLmZjYWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF1dGggPSBuZXcgQXV0aChjcmVkZW50aWFscy5haywgY3JlZGVudGlhbHMuc2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXV0aC5nZW5lcmF0ZUF1dGhvcml6YXRpb24oaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy51cHRva2VuX3VybCAmJiBvcHRpb25zLmdldF9uZXdfdXB0b2tlbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8g5pyN5Yqh56uv5Yqo5oCB562+5ZCN55qE5pa55byPXG4gICAgICAgICAgICBzZWxmLmNsaWVudC5jcmVhdGVTaWduYXR1cmUgPSBzZWxmLl9nZXRDdXN0b21pemVkU2lnbmF0dXJlKG9wdGlvbnMudXB0b2tlbl91cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIC8vIOWvueS6juS4jeaUr+aMgSB4aHIyIOeahOaDheWGte+8jOS8muWcqCBvbnJlYWR5IOeahOaXtuWAmeWOu+inpuWPkeS6i+S7tlxuICAgICAgICAgICAgc2VsZi5faW5pdEV2ZW50cygpO1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rUG9zdEluaXQpO1xuICAgICAgICB9XG4gICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rRXJyb3IsIFtlcnJvcl0pO1xuICAgIH0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKHRoaXMuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgdmFyIGJ0biA9ICQob3B0aW9ucy5icm93c2VfYnV0dG9uKTtcbiAgICAgICAgaWYgKGJ0bi5hdHRyKCdtdWx0aXBsZScpID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIOWmguaenOeUqOaIt+ayoeacieaYvuekuueahOiuvue9rui/hyBtdWx0aXBsZe+8jOS9v+eUqCBtdWx0aV9zZWxlY3Rpb24g55qE6K6+572uXG4gICAgICAgICAgICAvLyDlkKbliJnkv53nlZkgPGlucHV0IG11bHRpcGxlIC8+IOeahOWGheWuuVxuICAgICAgICAgICAgYnRuLmF0dHIoJ211bHRpcGxlJywgISFvcHRpb25zLm11bHRpX3NlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgYnRuLm9uKCdjaGFuZ2UnLCB1LmJpbmQodGhpcy5fb25GaWxlc0FkZGVkLCB0aGlzKSk7XG5cbiAgICAgICAgdmFyIGFjY2VwdCA9IG9wdGlvbnMuYWNjZXB0O1xuICAgICAgICBpZiAoYWNjZXB0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFNhZmFyaSDlj6rmlK/mjIEgbWltZS10eXBlXG4gICAgICAgICAgICAvLyBDaHJvbWUg5pSv5oyBIG1pbWUtdHlwZSDlkowgZXh0c1xuICAgICAgICAgICAgLy8gRmlyZWZveCDlj6rmlK/mjIEgZXh0c1xuICAgICAgICAgICAgLy8gTk9URTogZXh0cyDlv4XpobvmnIkgLiDov5nkuKrliY3nvIDvvIzkvovlpoIgLnR4dCDmmK/lkIjms5XnmoTvvIx0eHQg5piv5LiN5ZCI5rOV55qEXG4gICAgICAgICAgICB2YXIgZXh0cyA9IHV0aWxzLmV4cGFuZEFjY2VwdChhY2NlcHQpO1xuICAgICAgICAgICAgdmFyIGlzU2FmYXJpID0gL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQXBwbGUgQ29tcHV0ZXIvLnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG4gICAgICAgICAgICBpZiAoaXNTYWZhcmkpIHtcbiAgICAgICAgICAgICAgICBleHRzID0gdXRpbHMuZXh0VG9NaW1lVHlwZShleHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hdHRyKCdhY2NlcHQnLCBleHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmRpcl9zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGJ0bi5hdHRyKCdkaXJlY3RvcnknLCB0cnVlKTtcbiAgICAgICAgICAgIGJ0bi5hdHRyKCdtb3pkaXJlY3RvcnknLCB0cnVlKTtcbiAgICAgICAgICAgIGJ0bi5hdHRyKCd3ZWJraXRkaXJlY3RvcnknLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2xpZW50Lm9uKCdwcm9ncmVzcycsIHUuYmluZCh0aGlzLl9vblVwbG9hZFByb2dyZXNzLCB0aGlzKSk7XG4gICAgLy8gWFhYIOW/hemhu+e7keWumiBlcnJvciDnmoTlpITnkIblh73mlbDvvIzlkKbliJnkvJogdGhyb3cgbmV3IEVycm9yXG4gICAgdGhpcy5jbGllbnQub24oJ2Vycm9yJywgdS5iaW5kKHRoaXMuX29uRXJyb3IsIHRoaXMpKTtcblxuICAgIC8vICQod2luZG93KS5vbignb25saW5lJywgdS5iaW5kKHRoaXMuX2hhbmRsZU9ubGluZVN0YXR1cywgdGhpcykpO1xuICAgIC8vICQod2luZG93KS5vbignb2ZmbGluZScsIHUuYmluZCh0aGlzLl9oYW5kbGVPZmZsaW5lU3RhdHVzLCB0aGlzKSk7XG5cbiAgICBpZiAoIXRoaXMuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgLy8g5aaC5p6c5rWP6KeI5Zmo5LiN5pSv5oyBIHhocjLvvIzpgqPkuYjlsLHliIfmjaLliLAgbU94aWUuWE1MSHR0cFJlcXVlc3RcbiAgICAgICAgLy8g5L2G5piv5Zug5Li6IG1PeGllLlhNTEh0dHBSZXF1ZXN0IOaXoOazleWPkemAgSBIRUFEIOivt+axgu+8jOaXoOazleiOt+WPliBSZXNwb25zZSBIZWFkZXJz77yMXG4gICAgICAgIC8vIOWboOatpCBnZXRPYmplY3RNZXRhZGF0YeWunumZheS4iuaXoOazleato+W4uOW3peS9nO+8jOWboOatpOaIkeS7rOmcgOimge+8mlxuICAgICAgICAvLyAxLiDorqkgQk9TIOaWsOWiniBSRVNUIEFQSe+8jOWcqCBHRVQg55qE6K+35rGC55qE5ZCM5pe277yM5oqKIHgtYmNlLSog5pS+5YiwIFJlc3BvbnNlIEJvZHkg6L+U5ZueXG4gICAgICAgIC8vIDIuIOS4tOaXtuaWueahiO+8muaWsOWinuS4gOS4qiBSZWxheSDmnI3liqHvvIzlrp7njrDmlrnmoYggMVxuICAgICAgICAvLyAgICBHRVQgL2JqLmJjZWJvcy5jb20vdjEvYnVja2V0L29iamVjdD9odHRwTWV0aG9kPUhFQURcbiAgICAgICAgLy8gICAgSG9zdDogcmVsYXkuZWZlLnRlY2hcbiAgICAgICAgLy8gICAgQXV0aG9yaXphdGlvbjogeHh4XG4gICAgICAgIC8vIG9wdGlvbnMuYm9zX3JlbGF5X3NlcnZlclxuICAgICAgICAvLyBvcHRpb25zLnN3Zl91cmxcbiAgICAgICAgdGhpcy5jbGllbnQuc2VuZEhUVFBSZXF1ZXN0ID0gdS5iaW5kKHV0aWxzLmZpeFhocih0aGlzLm9wdGlvbnMsIHRydWUpLCB0aGlzLmNsaWVudCk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl9maWx0ZXJGaWxlcyA9IGZ1bmN0aW9uIChjYW5kaWRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8g5aaC5p6cIG1heEZpbGVTaXplID09PSAwIOWwseivtOaYjuS4jemZkOWItuWkp+Wwj1xuICAgIHZhciBtYXhGaWxlU2l6ZSA9IHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplO1xuXG4gICAgdmFyIGZpbGVzID0gdS5maWx0ZXIoY2FuZGlkYXRlcywgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgaWYgKG1heEZpbGVTaXplID4gMCAmJiBmaWxlLnNpemUgPiBtYXhGaWxlU2l6ZSkge1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rRmlsZUZpbHRlcmVkLCBbZmlsZV0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyDmo4Dmn6XlkI7nvIDkuYvnsbvnmoRcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLl9pbnZva2UoZXZlbnRzLmtGaWxlc0ZpbHRlciwgW2ZpbGVzXSkgfHwgZmlsZXM7XG59O1xuXG5mdW5jdGlvbiBidWlsZEFib3J0SGFuZGxlcihpdGVtLCBzZWxmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXRlbS5fYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0Fib3J0ZWQsIFtudWxsLCBpdGVtXSk7XG4gICAgfTtcbn1cblxuVXBsb2FkZXIucHJvdG90eXBlLl9vbkZpbGVzQWRkZWQgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZmlsZXMgPSBlLnRhcmdldC5maWxlcztcbiAgICBpZiAoIWZpbGVzKSB7XG4gICAgICAgIC8vIElFNywgSUU4IOS9jueJiOacrOa1j+iniOWZqOeahOWkhOeQhlxuICAgICAgICB2YXIgbmFtZSA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KC9bXFwvXFxcXF0vKS5wb3AoKTtcbiAgICAgICAgZmlsZXMgPSBbXG4gICAgICAgICAgICB7bmFtZTogbmFtZSwgc2l6ZTogMH1cbiAgICAgICAgXTtcbiAgICB9XG4gICAgZmlsZXMgPSB0aGlzLl9maWx0ZXJGaWxlcyhmaWxlcyk7XG4gICAgaWYgKHUuaXNBcnJheShmaWxlcykgJiYgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB0b3RhbEJ5dGVzID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBmaWxlc1tpXTtcblxuICAgICAgICAgICAgLy8g6L+Z6YeM5pivIGFib3J0IOeahOm7mOiupOWunueOsO+8jOW8gOWni+S4iuS8oOeahOaXtuWAme+8jOS8muaUueaIkOWPpuWklueahOS4gOenjeWunueOsOaWueW8j1xuICAgICAgICAgICAgLy8g6buY6K6k55qE5a6e546w5piv5Li65LqG5pSv5oyB5Zyo5rKh5pyJ5byA5aeL5LiK5Lyg5LmL5YmN77yM5Lmf5Y+v5Lul5Y+W5raI5LiK5Lyg55qE6ZyA5rGCXG4gICAgICAgICAgICBpdGVtLmFib3J0ID0gYnVpbGRBYm9ydEhhbmRsZXIoaXRlbSwgc2VsZik7XG5cbiAgICAgICAgICAgIC8vIOWGhemDqOeahCB1dWlk77yM5aSW6YOo5Lmf5Y+v5Lul5L2/55So77yM5q+U5aaCIHJlbW92ZShpdGVtLnV1aWQpIC8gcmVtb3ZlKGl0ZW0pXG4gICAgICAgICAgICBpdGVtLnV1aWQgPSB1dGlscy51dWlkKCk7XG5cbiAgICAgICAgICAgIHRvdGFsQnl0ZXMgKz0gaXRlbS5zaXplO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX25ldHdvcmtJbmZvLnRvdGFsQnl0ZXMgKz0gdG90YWxCeXRlcztcbiAgICAgICAgdGhpcy5fZmlsZXMucHVzaC5hcHBseSh0aGlzLl9maWxlcywgZmlsZXMpO1xuICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtGaWxlc0FkZGVkLCBbZmlsZXNdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9fc3RhcnQpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fb25FcnJvciA9IGZ1bmN0aW9uIChlKSB7XG59O1xuXG4vKipcbiAqIOWkhOeQhuS4iuS8oOi/m+W6pueahOWbnuaOieWHveaVsC5cbiAqIDEuIOi/memHjOimgeWMuuWIhuaWh+S7tueahOS4iuS8oOi/mOaYr+WIhueJh+eahOS4iuS8oO+8jOWIhueJh+eahOS4iuS8oOaYr+mAmui/hyBwYXJ0TnVtYmVyIOWSjCB1cGxvYWRJZCDnmoTnu4TlkIjmnaXliKTmlq3nmoRcbiAqIDIuIElFNiw3LDgsOeS4i+mdou+8jOaYr+S4jemcgOimgeiAg+iZkeeahO+8jOWboOS4uuS4jeS8muinpuWPkei/meS4quS6i+S7tu+8jOiAjOaYr+ebtOaOpeWcqCBfc2VuZFBvc3RSZXF1ZXN0IOinpuWPkSBrVXBsb2FkUHJvZ3Jlc3Mg5LqGXG4gKiAzLiDlhbblroPmg4XlhrXkuIvvvIzmiJHku6zliKTmlq3kuIDkuIsgUmVxdWVzdCBCb2R5IOeahOexu+Wei+aYr+WQpuaYryBCbG9i77yM5LuO6ICM6YG/5YWN5a+55LqO5YW25a6D57G75Z6L55qE6K+35rGC77yM6Kem5Y+RIGtVcGxvYWRQcm9ncmVzc1xuICogICAg5L6L5aaC77yaSEVBRO+8jEdFVO+8jFBPU1QoSW5pdE11bHRpcGFydCkg55qE5pe25YCZ77yM5piv5rKh5b+F6KaB6Kem5Y+RIGtVcGxvYWRQcm9ncmVzcyDnmoRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZSAgUHJvZ3Jlc3MgRXZlbnQg5a+56LGhLlxuICogQHBhcmFtIHtPYmplY3R9IGh0dHBDb250ZXh0IHNlbmRIVFRQUmVxdWVzdCDnmoTlj4LmlbBcbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9vblVwbG9hZFByb2dyZXNzID0gZnVuY3Rpb24gKGUsIGh0dHBDb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MgPSBodHRwQ29udGV4dC5hcmdzO1xuICAgIHZhciBmaWxlID0gYXJncy5ib2R5O1xuXG4gICAgaWYgKCF1dGlscy5pc0Jsb2IoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwcm9ncmVzcyA9IGUubGVuZ3RoQ29tcHV0YWJsZVxuICAgICAgICA/IGUubG9hZGVkIC8gZS50b3RhbFxuICAgICAgICA6IDA7XG5cbiAgICB0aGlzLl9uZXR3b3JrSW5mby5sb2FkZWRCeXRlcyArPSAoZS5sb2FkZWQgLSBmaWxlLl9wcmV2aW91c0xvYWRlZCk7XG4gICAgdGhpcy5faW52b2tlKGV2ZW50cy5rTmV0d29ya1NwZWVkLCB0aGlzLl9uZXR3b3JrSW5mby5kdW1wKCkpO1xuICAgIGZpbGUuX3ByZXZpb3VzTG9hZGVkID0gZS5sb2FkZWQ7XG5cbiAgICB2YXIgZXZlbnRUeXBlID0gZXZlbnRzLmtVcGxvYWRQcm9ncmVzcztcbiAgICBpZiAoYXJncy5wYXJhbXMucGFydE51bWJlciAmJiBhcmdzLnBhcmFtcy51cGxvYWRJZCkge1xuICAgICAgICAvLyBJRTYsNyw4LDnkuIvpnaLkuI3kvJrmnIlwYXJ0TnVtYmVy5ZKMdXBsb2FkSWRcbiAgICAgICAgLy8g5q2k5pe255qEIGZpbGUg5pivIHNsaWNlIOeahOe7k+aenO+8jOWPr+iDveayoeacieiHquWumuS5ieeahOWxnuaAp1xuICAgICAgICAvLyDmr5TlpoIgZGVtbyDph4zpnaLnmoQgX19pZCwgX19tZWRpYUlkIOS5i+exu+eahFxuICAgICAgICBldmVudFR5cGUgPSBldmVudHMua1VwbG9hZFBhcnRQcm9ncmVzcztcbiAgICB9XG5cbiAgICB0aGlzLl9pbnZva2UoZXZlbnRUeXBlLCBbZmlsZSwgcHJvZ3Jlc3MsIGVdKTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaXRlbSA9IHRoaXMuX3VwbG9hZGluZ0ZpbGVzW2l0ZW1dIHx8IHUuZmluZCh0aGlzLl9maWxlcywgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlLnV1aWQgPT09IGl0ZW07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGl0ZW0uYWJvcnQoKTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX3dvcmtpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9maWxlcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fd29ya2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Fib3J0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25ldHdvcmtJbmZvLnJlc2V0KCk7XG5cbiAgICAgICAgdmFyIHRhc2tQYXJhbGxlbCA9IHRoaXMub3B0aW9ucy5ib3NfdGFza19wYXJhbGxlbDtcbiAgICAgICAgdXRpbHMuZWFjaExpbWl0KHRoaXMuX2ZpbGVzLCB0YXNrUGFyYWxsZWwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZmlsZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBmaWxlLl9wcmV2aW91c0xvYWRlZCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5fdXBsb2FkTmV4dChmaWxlKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmdWxmaWxsbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSlbXG4gICAgICAgICAgICAgICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVqZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fdXBsb2FkaW5nRmlsZXNbZmlsZS51dWlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl93b3JraW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZi5fZmlsZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9uZXR3b3JrSW5mby50b3RhbEJ5dGVzID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtVcGxvYWRDb21wbGV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9hYm9ydCA9IHRydWU7XG4gICAgdGhpcy5fd29ya2luZyA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiDliqjmgIHorr7nva4gVXBsb2FkZXIg55qE5p+Q5Lqb5Y+C5pWw77yM5b2T5YmN5Y+q5pSv5oyB5Yqo5oCB55qE5L+u5pS5XG4gKiBib3NfY3JlZGVudGlhbHMsIHVwdG9rZW4sIGJvc19idWNrZXQsIGJvc19lbmRwb2ludFxuICogYm9zX2FrLCBib3Nfc2tcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDnlKjmiLfliqjmgIHorr7nva7nmoTlj4LmlbDvvIjlj6rmlK/mjIHpg6jliIbvvIlcbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzdXBwb3J0ZWRPcHRpb25zID0gdS5waWNrKG9wdGlvbnMsICdib3NfY3JlZGVudGlhbHMnLFxuICAgICAgICAnYm9zX2FrJywgJ2Jvc19zaycsICd1cHRva2VuJywgJ2Jvc19idWNrZXQnLCAnYm9zX2VuZHBvaW50Jyk7XG4gICAgdGhpcy5vcHRpb25zID0gdS5leHRlbmQodGhpcy5vcHRpb25zLCBzdXBwb3J0ZWRPcHRpb25zKTtcblxuICAgIHZhciBjb25maWcgPSB0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5jb25maWc7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSBudWxsO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmJvc19jcmVkZW50aWFscykge1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSBvcHRpb25zLmJvc19jcmVkZW50aWFscztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLmJvc19hayAmJiBvcHRpb25zLmJvc19zaykge1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgYWs6IG9wdGlvbnMuYm9zX2FrLFxuICAgICAgICAgICAgICAgIHNrOiBvcHRpb25zLmJvc19za1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgY29uZmlnLmNyZWRlbnRpYWxzID0gY3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMudXB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLnNlc3Npb25Ub2tlbiA9IG9wdGlvbnMudXB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5ib3NfZW5kcG9pbnQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5lbmRwb2ludCA9IHV0aWxzLm5vcm1hbGl6ZUVuZHBvaW50KG9wdGlvbnMuYm9zX2VuZHBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog5pyJ55qE55So5oi35biM5pyb5Li75Yqo5pu05pawIHN0cyB0b2tlbu+8jOmBv+WFjei/h+acn+eahOmXrumimFxuICpcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5yZWZyZXNoU3RzVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgIHZhciBzdHNNb2RlID0gc2VsZi5feGhyMlN1cHBvcnRlZFxuICAgICAgICAmJiBvcHRpb25zLnVwdG9rZW5fdXJsXG4gICAgICAgICYmIG9wdGlvbnMuZ2V0X25ld191cHRva2VuID09PSBmYWxzZTtcbiAgICBpZiAoc3RzTW9kZSkge1xuICAgICAgICB2YXIgc3RtID0gbmV3IFN0c1Rva2VuTWFuYWdlcihvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHN0bS5nZXQob3B0aW9ucy5ib3NfYnVja2V0KS50aGVuKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBib3NfYWs6IHBheWxvYWQuQWNjZXNzS2V5SWQsXG4gICAgICAgICAgICAgICAgYm9zX3NrOiBwYXlsb2FkLlNlY3JldEFjY2Vzc0tleSxcbiAgICAgICAgICAgICAgICB1cHRva2VuOiBwYXlsb2FkLlNlc3Npb25Ub2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX3VwbG9hZE5leHQgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgIGlmICh0aGlzLl9hYm9ydCkge1xuICAgICAgICB0aGlzLl93b3JraW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZS5fYWJvcnRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHRocm93RXJyb3JzID0gdHJ1ZTtcbiAgICB2YXIgcmV0dXJuVmFsdWUgPSB0aGlzLl9pbnZva2UoZXZlbnRzLmtCZWZvcmVVcGxvYWQsIFtmaWxlXSwgdGhyb3dFcnJvcnMpO1xuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gUS5yZXNvbHZlKHJldHVyblZhbHVlKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkTmV4dEltcGwoZmlsZSk7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rRXJyb3IsIFtlcnJvciwgZmlsZV0pO1xuICAgICAgICB9KTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fdXBsb2FkTmV4dEltcGwgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgb2JqZWN0ID0gZmlsZS5uYW1lO1xuICAgIHZhciB0aHJvd0Vycm9ycyA9IHRydWU7XG5cbiAgICB2YXIgZGVmYXVsdFRhc2tPcHRpb25zID0gdS5waWNrKG9wdGlvbnMsXG4gICAgICAgICdmbGFzaF9zd2ZfdXJsJywgJ21heF9yZXRyaWVzJywgJ2NodW5rX3NpemUnLCAncmV0cnlfaW50ZXJ2YWwnLFxuICAgICAgICAnYm9zX211bHRpcGFydF9wYXJhbGxlbCcsXG4gICAgICAgICdib3NfbXVsdGlwYXJ0X2F1dG9fY29udGludWUnLFxuICAgICAgICAnYm9zX211bHRpcGFydF9sb2NhbF9rZXlfZ2VuZXJhdG9yJ1xuICAgICk7XG4gICAgcmV0dXJuIFEuYWxsKFtcbiAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rS2V5LCBbZmlsZV0sIHRocm93RXJyb3JzKSxcbiAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rT2JqZWN0TWV0YXMsIFtmaWxlXSlcbiAgICBdKS50aGVuKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICAvLyBvcHRpb25zLmJvc19idWNrZXQg5Y+v6IO95Lya6KKrIGtLZXkg5LqL5Lu25Yqo5oCB55qE5pS55Y+YXG4gICAgICAgIHZhciBidWNrZXQgPSBvcHRpb25zLmJvc19idWNrZXQ7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IGFycmF5WzBdO1xuICAgICAgICB2YXIgb2JqZWN0TWV0YXMgPSBhcnJheVsxXTtcblxuICAgICAgICB2YXIgbXVsdGlwYXJ0ID0gJ2F1dG8nO1xuICAgICAgICBpZiAodS5pc1N0cmluZyhyZXN1bHQpKSB7XG4gICAgICAgICAgICBvYmplY3QgPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodS5pc09iamVjdChyZXN1bHQpKSB7XG4gICAgICAgICAgICBidWNrZXQgPSByZXN1bHQuYnVja2V0IHx8IGJ1Y2tldDtcbiAgICAgICAgICAgIG9iamVjdCA9IHJlc3VsdC5rZXkgfHwgb2JqZWN0O1xuXG4gICAgICAgICAgICAvLyAnYXV0bycgLyAnb2ZmJ1xuICAgICAgICAgICAgbXVsdGlwYXJ0ID0gcmVzdWx0Lm11bHRpcGFydCB8fCBtdWx0aXBhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2xpZW50ID0gc2VsZi5jbGllbnQ7XG4gICAgICAgIHZhciBldmVudERpc3BhdGNoZXIgPSBzZWxmO1xuICAgICAgICB2YXIgdGFza09wdGlvbnMgPSB1LmV4dGVuZChkZWZhdWx0VGFza09wdGlvbnMsIHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgICAgIG9iamVjdDogb2JqZWN0LFxuICAgICAgICAgICAgbWV0YXM6IG9iamVjdE1ldGFzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciB0YXNrID0gbnVsbDtcbiAgICAgICAgaWYgKG11bHRpcGFydCA9PT0gJ2F1dG8nICYmIGZpbGUuc2l6ZSA+IG9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZSkge1xuICAgICAgICAgICAgdGFzayA9IG5ldyBNdWx0aXBhcnRUYXNrKGNsaWVudCwgZXZlbnREaXNwYXRjaGVyLCB0YXNrT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0YXNrID0gbmV3IFB1dE9iamVjdFRhc2soY2xpZW50LCBldmVudERpc3BhdGNoZXIsIHRhc2tPcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF0gPSBmaWxlO1xuXG4gICAgICAgIGZpbGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmaWxlLl9hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0YXNrLmFib3J0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGFzay5zZXROZXR3b3JrSW5mbyhzZWxmLl9uZXR3b3JrSW5mbyk7XG4gICAgICAgIHJldHVybiB0YXNrLnN0YXJ0KCk7XG4gICAgfSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGV2ZW50QXJndW1lbnRzLCB0aHJvd0Vycm9ycykge1xuICAgIGlmIChldmVudE5hbWUgPT09IGV2ZW50cy5rQWJvcnRlZFxuICAgICAgICAmJiBldmVudEFyZ3VtZW50c1xuICAgICAgICAmJiBldmVudEFyZ3VtZW50c1sxXSkge1xuICAgICAgICB2YXIgZmlsZSA9IGV2ZW50QXJndW1lbnRzWzFdO1xuICAgICAgICBpZiAoZmlsZS5zaXplID4gMCkge1xuICAgICAgICAgICAgdmFyIGxvYWRlZFNpemUgPSBmaWxlLl9wcmV2aW91c0xvYWRlZCB8fCAwO1xuICAgICAgICAgICAgdGhpcy5fbmV0d29ya0luZm8udG90YWxCeXRlcyAtPSAoZmlsZS5zaXplIC0gbG9hZGVkU2l6ZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtOZXR3b3JrU3BlZWQsIHRoaXMuX25ldHdvcmtJbmZvLmR1bXAoKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShldmVudE5hbWUsIGV2ZW50QXJndW1lbnRzLCB0aHJvd0Vycm9ycyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSB1dGlscy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHFzTW9kdWxlID0gcmVxdWlyZSg0NSk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBRdWV1ZSA9IHJlcXVpcmUoMjkpO1xudmFyIE1pbWVUeXBlID0gcmVxdWlyZSgyMik7XG5cbi8qKlxuICog5oqK5paH5Lu26L+b6KGM5YiH54mH77yM6L+U5Zue5YiH54mH5LmL5ZCO55qE5pWw57uEXG4gKlxuICogQHBhcmFtIHtCbG9ifSBmaWxlIOmcgOimgeWIh+eJh+eahOWkp+aWh+S7ti5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJZCDku47mnI3liqHojrflj5bnmoR1cGxvYWRJZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjaHVua1NpemUg5YiG54mH55qE5aSn5bCPLlxuICogQHBhcmFtIHtzdHJpbmd9IGJ1Y2tldCBCdWNrZXQgTmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmplY3QgT2JqZWN0IE5hbWUuXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuZXhwb3J0cy5nZXRUYXNrcyA9IGZ1bmN0aW9uIChmaWxlLCB1cGxvYWRJZCwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCkge1xuICAgIHZhciBsZWZ0U2l6ZSA9IGZpbGUuc2l6ZTtcbiAgICB2YXIgb2Zmc2V0ID0gMDtcbiAgICB2YXIgcGFydE51bWJlciA9IDE7XG5cbiAgICB2YXIgdGFza3MgPSBbXTtcblxuICAgIHdoaWxlIChsZWZ0U2l6ZSA+IDApIHtcbiAgICAgICAgdmFyIHBhcnRTaXplID0gTWF0aC5taW4obGVmdFNpemUsIGNodW5rU2l6ZSk7XG5cbiAgICAgICAgdGFza3MucHVzaCh7XG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgdXBsb2FkSWQ6IHVwbG9hZElkLFxuICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgICAgIHBhcnROdW1iZXI6IHBhcnROdW1iZXIsXG4gICAgICAgICAgICBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgICAgICBzdGFydDogb2Zmc2V0LFxuICAgICAgICAgICAgc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxlZnRTaXplIC09IHBhcnRTaXplO1xuICAgICAgICBvZmZzZXQgKz0gcGFydFNpemU7XG4gICAgICAgIHBhcnROdW1iZXIgKz0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFza3M7XG59O1xuXG5leHBvcnRzLmdldEFwcGVuZGFibGVUYXNrcyA9IGZ1bmN0aW9uIChmaWxlU2l6ZSwgb2Zmc2V0LCBjaHVua1NpemUpIHtcbiAgICB2YXIgbGVmdFNpemUgPSBmaWxlU2l6ZSAtIG9mZnNldDtcbiAgICB2YXIgdGFza3MgPSBbXTtcblxuICAgIHdoaWxlIChsZWZ0U2l6ZSkge1xuICAgICAgICB2YXIgcGFydFNpemUgPSBNYXRoLm1pbihsZWZ0U2l6ZSwgY2h1bmtTaXplKTtcbiAgICAgICAgdGFza3MucHVzaCh7XG4gICAgICAgICAgICBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgICAgICBzdGFydDogb2Zmc2V0LFxuICAgICAgICAgICAgc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxlZnRTaXplIC09IHBhcnRTaXplO1xuICAgICAgICBvZmZzZXQgKz0gcGFydFNpemU7XG4gICAgfVxuICAgIHJldHVybiB0YXNrcztcbn07XG5cbmV4cG9ydHMucGFyc2VTaXplID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgICBpZiAodHlwZW9mIHNpemUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8vIG1iIE1CIE1iIE1cbiAgICAvLyBrYiBLQiBrYiBrXG4gICAgLy8gMTAwXG4gICAgdmFyIHBhdHRlcm4gPSAvXihbXFxkXFwuXSspKFtta2ddP2I/KSQvaTtcbiAgICB2YXIgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoc2l6ZSk7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgJDEgPSBtYXRjaFsxXTtcbiAgICB2YXIgJDIgPSBtYXRjaFsyXTtcbiAgICBpZiAoL15rL2kudGVzdCgkMikpIHtcbiAgICAgICAgcmV0dXJuICQxICogMTAyNDtcbiAgICB9XG4gICAgZWxzZSBpZiAoL15tL2kudGVzdCgkMikpIHtcbiAgICAgICAgcmV0dXJuICQxICogMTAyNCAqIDEwMjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKC9eZy9pLnRlc3QoJDIpKSB7XG4gICAgICAgIHJldHVybiAkMSAqIDEwMjQgKiAxMDI0ICogMTAyNDtcbiAgICB9XG4gICAgcmV0dXJuICskMTtcbn07XG5cbi8qKlxuICog5Yik5pat5LiA5LiL5rWP6KeI5Zmo5piv5ZCm5pSv5oyBIHhocjIg54m55oCn77yM5aaC5p6c5LiN5pSv5oyB77yM5bCxIGZhbGxiYWNrIOWIsCBQb3N0T2JqZWN0XG4gKiDmnaXkuIrkvKDmlofku7ZcbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnRzLmlzWGhyMlN1cHBvcnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9ibG9iL2Y4MzllMjU3OWRhMmM2MzMxZWFhZDkyMmFlNWNkNjkxYWFjN2FiNjIvZmVhdHVyZS1kZXRlY3RzL25ldHdvcmsveGhyMi5qc1xuICAgIHJldHVybiAnWE1MSHR0cFJlcXVlc3QnIGluIHdpbmRvdyAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbn07XG5cbmV4cG9ydHMuaXNBcHBlbmRhYmxlID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgICByZXR1cm4gaGVhZGVyc1sneC1iY2Utb2JqZWN0LXR5cGUnXSA9PT0gJ0FwcGVuZGFibGUnO1xufTtcblxuZXhwb3J0cy5kZWxheSA9IGZ1bmN0aW9uIChtcykge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIH0sIG1zKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICog6KeE6IyD5YyW55So5oi355qE6L6T5YWlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB3aWxsIGJlIG5vcm1hbGl6ZWRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5ub3JtYWxpemVFbmRwb2ludCA9IGZ1bmN0aW9uIChlbmRwb2ludCkge1xuICAgIHJldHVybiBlbmRwb2ludC5yZXBsYWNlKC8oXFwvKykkLywgJycpO1xufTtcblxuZXhwb3J0cy5nZXREZWZhdWx0QUNMID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFjY2Vzc0NvbnRyb2xMaXN0OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VydmljZTogJ2JjZTpib3MnLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJyonLFxuICAgICAgICAgICAgICAgIGVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogW2J1Y2tldCArICcvKiddLFxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IFsnUkVBRCcsICdXUklURSddXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9O1xufTtcblxuLyoqXG4gKiDnlJ/miJB1dWlkXG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLnV1aWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJhbmRvbSA9IChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMiwgMzIpKS50b1N0cmluZygzNik7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHJldHVybiAndS0nICsgdGltZXN0YW1wICsgJy0nICsgcmFuZG9tO1xufTtcblxuLyoqXG4gKiDnlJ/miJDmnKzlnLAgbG9jYWxTdG9yYWdlIOS4reeahGtlee+8jOadpeWtmOWCqCB1cGxvYWRJZFxuICogbG9jYWxTdG9yYWdlW2tleV0gPSB1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24g5LiA5Lqb5Y+v5Lul55So5p2l6K6h566Xa2V555qE5Y+C5pWwLlxuICogQHBhcmFtIHtzdHJpbmd9IGdlbmVyYXRvciDlhoXnva7nmoTlj6rmnIkgZGVmYXVsdCDlkowgbWQ1XG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnRzLmdlbmVyYXRlTG9jYWxLZXkgPSBmdW5jdGlvbiAob3B0aW9uLCBnZW5lcmF0b3IpIHtcbiAgICBpZiAoZ2VuZXJhdG9yID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZShbXG4gICAgICAgICAgICBvcHRpb24uYmxvYi5uYW1lLCBvcHRpb24uYmxvYi5zaXplLFxuICAgICAgICAgICAgb3B0aW9uLmNodW5rU2l6ZSwgb3B0aW9uLmJ1Y2tldCxcbiAgICAgICAgICAgIG9wdGlvbi5vYmplY3RcbiAgICAgICAgXS5qb2luKCcmJykpO1xuICAgIH1cbiAgICByZXR1cm4gUS5yZXNvbHZlKG51bGwpO1xufTtcblxuZXhwb3J0cy5nZXREZWZhdWx0UG9saWN5ID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIGlmIChidWNrZXQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAvLyDpu5jorqTmmK8gMjTlsI/ml7Yg5LmL5ZCO5Yiw5pyfXG4gICAgdmFyIGV4cGlyYXRpb24gPSBuZXcgRGF0ZShub3cgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICB2YXIgdXRjRGF0ZVRpbWUgPSBleHBpcmF0aW9uLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuXFxkK1okLywgJ1onKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGV4cGlyYXRpb246IHV0Y0RhdGVUaW1lLFxuICAgICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgICAgICB7YnVja2V0OiBidWNrZXR9XG4gICAgICAgIF1cbiAgICB9O1xufTtcblxuLyoqXG4gKiDmoLnmja5rZXnojrflj5Zsb2NhbFN0b3JhZ2XkuK3nmoR1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkg6ZyA6KaB5p+l6K+i55qEa2V5XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZ2V0VXBsb2FkSWQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG59O1xuXG5cbi8qKlxuICog5qC55o2ua2V56K6+572ubG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElkIOmcgOimgeiuvue9rueahHVwbG9hZElkXG4gKi9cbmV4cG9ydHMuc2V0VXBsb2FkSWQgPSBmdW5jdGlvbiAoa2V5LCB1cGxvYWRJZCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdXBsb2FkSWQpO1xufTtcblxuLyoqXG4gKiDmoLnmja5rZXnliKDpmaRsb2NhbFN0b3JhZ2XkuK3nmoR1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkg6ZyA6KaB5p+l6K+i55qEa2V5XG4gKi9cbmV4cG9ydHMucmVtb3ZlVXBsb2FkSWQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbn07XG5cbi8qKlxuICog5Y+W5b6X5bey5LiK5Lyg5YiG5Z2X55qEZXRhZ1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJ0TnVtYmVyIOWIhueJh+W6j+WPty5cbiAqIEBwYXJhbSB7QXJyYXl9IGV4aXN0UGFydHMg5bey5LiK5Lyg5a6M5oiQ55qE5YiG54mH5L+h5oGvLlxuICogQHJldHVybiB7c3RyaW5nfSDmjIflrprliIbniYfnmoRldGFnXG4gKi9cbmZ1bmN0aW9uIGdldFBhcnRFdGFnKHBhcnROdW1iZXIsIGV4aXN0UGFydHMpIHtcbiAgICB2YXIgbWF0Y2hQYXJ0cyA9IHUuZmlsdGVyKGV4aXN0UGFydHMgfHwgW10sIGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIHJldHVybiArcGFydC5wYXJ0TnVtYmVyID09PSBwYXJ0TnVtYmVyO1xuICAgIH0pO1xuICAgIHJldHVybiBtYXRjaFBhcnRzLmxlbmd0aCA/IG1hdGNoUGFydHNbMF0uZVRhZyA6IG51bGw7XG59XG5cbi8qKlxuICog5Zug5Li6IGxpc3RQYXJ0cyDkvJrov5Tlm54gcGFydE51bWJlciDlkowgZXRhZyDnmoTlr7nlupTlhbPns7tcbiAqIOaJgOS7pSBsaXN0UGFydHMg6L+U5Zue55qE57uT5p6c77yM57uZIHRhc2tzIOS4reWQiOmAgueahOWFg+e0oOiuvue9riBldGFnIOWxnuaAp++8jOS4iuS8oFxuICog55qE5pe25YCZ5bCx5Y+v5Lul6Lez6L+H6L+Z5LqbIHBhcnRcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB0YXNrcyDmnKzlnLDliIfliIblpb3nmoTku7vliqEuXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBwYXJ0cyDmnI3liqHnq6/ov5Tlm57nmoTlt7Lnu4/kuIrkvKDnmoRwYXJ0cy5cbiAqL1xuZXhwb3J0cy5maWx0ZXJUYXNrcyA9IGZ1bmN0aW9uICh0YXNrcywgcGFydHMpIHtcbiAgICB1LmVhY2godGFza3MsIGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgIHZhciBwYXJ0TnVtYmVyID0gdGFzay5wYXJ0TnVtYmVyO1xuICAgICAgICB2YXIgZXRhZyA9IGdldFBhcnRFdGFnKHBhcnROdW1iZXIsIHBhcnRzKTtcbiAgICAgICAgaWYgKGV0YWcpIHtcbiAgICAgICAgICAgIHRhc2suZXRhZyA9IGV0YWc7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICog5oqK55So5oi36L6T5YWl55qE6YWN572u6L2s5YyW5oiQIGh0bWw1IOWSjCBmbGFzaCDlj6/ku6XmjqXmlLbnmoTlhoXlrrkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8QXJyYXl9IGFjY2VwdCDmlK/mjIHmlbDnu4TlkozlrZfnrKbkuLLnmoTphY3nva5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5leHBhbmRBY2NlcHQgPSBmdW5jdGlvbiAoYWNjZXB0KSB7XG4gICAgdmFyIGV4dHMgPSBbXTtcblxuICAgIGlmICh1LmlzQXJyYXkoYWNjZXB0KSkge1xuICAgICAgICAvLyBGbGFzaOimgeaxgueahOagvOW8j1xuICAgICAgICB1LmVhY2goYWNjZXB0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0uZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgICAgIGV4dHMucHVzaC5hcHBseShleHRzLCBpdGVtLmV4dGVuc2lvbnMuc3BsaXQoJywnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh1LmlzU3RyaW5nKGFjY2VwdCkpIHtcbiAgICAgICAgZXh0cyA9IGFjY2VwdC5zcGxpdCgnLCcpO1xuICAgIH1cblxuICAgIC8vIOS4uuS6huS/neivgeWFvOWuueaAp++8jOaKiiBtaW1lVHlwZXMg5ZKMIGV4dHMg6YO96L+U5Zue5Zue5Y67XG4gICAgZXh0cyA9IHUubWFwKGV4dHMsIGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgcmV0dXJuIC9eXFwuLy50ZXN0KGV4dCkgPyBleHQgOiAoJy4nICsgZXh0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBleHRzLmpvaW4oJywnKTtcbn07XG5cbmV4cG9ydHMuZXh0VG9NaW1lVHlwZSA9IGZ1bmN0aW9uIChleHRzKSB7XG4gICAgdmFyIG1pbWVUeXBlcyA9IHUubWFwKGV4dHMuc3BsaXQoJywnKSwgZnVuY3Rpb24gKGV4dCkge1xuICAgICAgICBpZiAoZXh0LmluZGV4T2YoJy8nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1pbWVUeXBlLmd1ZXNzKGV4dCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWltZVR5cGVzLmpvaW4oJywnKTtcbn07XG5cbmV4cG9ydHMuZXhwYW5kQWNjZXB0VG9BcnJheSA9IGZ1bmN0aW9uIChhY2NlcHQpIHtcbiAgICBpZiAoIWFjY2VwdCB8fCB1LmlzQXJyYXkoYWNjZXB0KSkge1xuICAgICAgICByZXR1cm4gYWNjZXB0O1xuICAgIH1cblxuICAgIGlmICh1LmlzU3RyaW5nKGFjY2VwdCkpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHt0aXRsZTogJ0FsbCBmaWxlcycsIGV4dGVuc2lvbnM6IGFjY2VwdH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG59O1xuXG4vKipcbiAqIOi9rOWMluS4gOS4iyBib3MgdXJsIOeahOagvOW8j1xuICogaHR0cDovL2JqLmJjZWJvcy5jb20vdjEvJHtidWNrZXR9LyR7b2JqZWN0fSAtPiBodHRwOi8vJHtidWNrZXR9LmJqLmJjZWJvcy5jb20vdjEvJHtvYmplY3R9XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCDpnIDopoHovazljJbnmoRVUkwuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMudHJhbnNmb3JtVXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgIHZhciBwYXR0ZXJuID0gLyhodHRwcz86KVxcL1xcLyhbXlxcL10rKVxcLyhbXlxcL10rKVxcLyhbXlxcL10rKS87XG4gICAgcmV0dXJuIHVybC5yZXBsYWNlKHBhdHRlcm4sIGZ1bmN0aW9uIChfLCBwcm90b2NvbCwgaG9zdCwgJDMsICQ0KSB7XG4gICAgICAgIGlmICgvXnZcXGQkLy50ZXN0KCQzKSkge1xuICAgICAgICAgICAgLy8gL3YxLyR7YnVja2V0fS8uLi5cbiAgICAgICAgICAgIHJldHVybiBwcm90b2NvbCArICcvLycgKyAkNCArICcuJyArIGhvc3QgKyAnLycgKyAkMztcbiAgICAgICAgfVxuICAgICAgICAvLyAvJHtidWNrZXR9Ly4uLlxuICAgICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgJDMgKyAnLicgKyBob3N0ICsgJy8nICsgJDQ7XG4gICAgfSk7XG59O1xuXG5leHBvcnRzLmlzQmxvYiA9IGZ1bmN0aW9uIChib2R5KSB7XG4gICAgdmFyIGJsb2JDdG9yID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gQ2hyb21lIEJsb2IgPT09ICdmdW5jdGlvbidcbiAgICAgICAgLy8gU2FmYXJpIEJsb2IgPT09ICd1bmRlZmluZWQnXG4gICAgICAgIGJsb2JDdG9yID0gQmxvYjtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1PeGllICE9PSAndW5kZWZpbmVkJyAmJiB1LmlzRnVuY3Rpb24obU94aWUuQmxvYikpIHtcbiAgICAgICAgYmxvYkN0b3IgPSBtT3hpZS5CbG9iO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBib2R5IGluc3RhbmNlb2YgYmxvYkN0b3I7XG59O1xuXG5leHBvcnRzLm5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59O1xuXG5leHBvcnRzLnRvREhNUyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7XG4gICAgdmFyIGRheXMgPSAwO1xuICAgIHZhciBob3VycyA9IDA7XG4gICAgdmFyIG1pbnV0ZXMgPSAwO1xuXG4gICAgaWYgKHNlY29uZHMgPj0gNjApIHtcbiAgICAgICAgbWludXRlcyA9IH5+KHNlY29uZHMgLyA2MCk7XG4gICAgICAgIHNlY29uZHMgPSBzZWNvbmRzIC0gbWludXRlcyAqIDYwO1xuICAgIH1cblxuICAgIGlmIChtaW51dGVzID49IDYwKSB7XG4gICAgICAgIGhvdXJzID0gfn4obWludXRlcyAvIDYwKTtcbiAgICAgICAgbWludXRlcyA9IG1pbnV0ZXMgLSBob3VycyAqIDYwO1xuICAgIH1cblxuICAgIGlmIChob3VycyA+PSAyNCkge1xuICAgICAgICBkYXlzID0gfn4oaG91cnMgLyAyNCk7XG4gICAgICAgIGhvdXJzID0gaG91cnMgLSBkYXlzICogMjQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtERDogZGF5cywgSEg6IGhvdXJzLCBNTTogbWludXRlcywgU1M6IHNlY29uZHN9O1xufTtcblxuZnVuY3Rpb24gcGFyc2VIb3N0KHVybCkge1xuICAgIHZhciBtYXRjaCA9IC9eXFx3KzpcXC9cXC8oW15cXC9dKykvLmV4ZWModXJsKTtcbiAgICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5cbmV4cG9ydHMuZml4WGhyID0gZnVuY3Rpb24gKG9wdGlvbnMsIGlzQm9zKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncywgY29uZmlnKSB7XG4gICAgICAgIHZhciBjbGllbnQgPSB0aGlzO1xuICAgICAgICB2YXIgZW5kcG9pbnRIb3N0ID0gcGFyc2VIb3N0KGNvbmZpZy5lbmRwb2ludCk7XG5cbiAgICAgICAgLy8geC1iY2UtZGF0ZSDlkowgRGF0ZSDkuozpgInkuIDvvIzmmK/lv4XpobvnmoRcbiAgICAgICAgLy8g5L2G5pivIEZsYXNoIOaXoOazleiuvue9riBEYXRl77yM5Zug5q2k5b+F6aG76K6+572uIHgtYmNlLWRhdGVcbiAgICAgICAgYXJncy5oZWFkZXJzWyd4LWJjZS1kYXRlJ10gPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuXFxkK1okLywgJ1onKTtcbiAgICAgICAgYXJncy5oZWFkZXJzLmhvc3QgPSBlbmRwb2ludEhvc3Q7XG5cbiAgICAgICAgLy8gRmxhc2gg55qE57yT5a2Y6LKM5Ly85q+U6L6D5Y6J5a6z77yM5by65Yi26K+35rGC5paw55qEXG4gICAgICAgIC8vIFhYWCDlpb3lg4/mnI3liqHlmajnq6/kuI3kvJrmioogLnN0YW1wIOi/meS4quWPguaVsOWKoOWFpeWIsOetvuWQjeeahOiuoeeul+mAu+i+kemHjOmdouWOu1xuICAgICAgICAvLyBhcmdzLnBhcmFtc1snLnN0YW1wJ10gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICAvLyDlj6rmnIkgUFVUIOaJjeS8muinpuWPkSBwcm9ncmVzcyDkuovku7ZcbiAgICAgICAgdmFyIG9yaWdpbmFsSHR0cE1ldGhvZCA9IGh0dHBNZXRob2Q7XG5cbiAgICAgICAgaWYgKGh0dHBNZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICAgICAgICAvLyBQdXRPYmplY3QgUHV0UGFydHMg6YO95Y+v5Lul55SoIFBPU1Qg5Y2P6K6u77yM6ICM5LiUIEZsYXNoIOS5n+WPquiDveeUqCBQT1NUIOWNj+iurlxuICAgICAgICAgICAgaHR0cE1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB4aHJVcmk7XG4gICAgICAgIHZhciB4aHJNZXRob2QgPSBodHRwTWV0aG9kO1xuICAgICAgICB2YXIgeGhyQm9keSA9IGFyZ3MuYm9keTtcbiAgICAgICAgaWYgKGh0dHBNZXRob2QgPT09ICdIRUFEJykge1xuICAgICAgICAgICAgLy8g5Zug5Li6IEZsYXNoIOeahCBVUkxSZXF1ZXN0IOWPquiDveWPkemAgSBHRVQg5ZKMIFBPU1Qg6K+35rGCXG4gICAgICAgICAgICAvLyBnZXRPYmplY3RNZXRh6ZyA6KaB55SoSEVBROivt+axgu+8jOS9huaYryBGbGFzaCDml6Dms5Xlj5Hotbfov5nnp43or7fmsYJcbiAgICAgICAgICAgIC8vIOaJgOmcgOmcgOimgeeUqCByZWxheSDkuK3ovazkuIDkuItcbiAgICAgICAgICAgIC8vIFhYWCDlm6DkuLogYnVja2V0IOS4jeWPr+iDveaYryBwcml2YXRl77yM5ZCm5YiZIGNyb3NzZG9tYWluLnhtbCDmmK/ml6Dms5Xor7vlj5bnmoRcbiAgICAgICAgICAgIC8vIOaJgOS7pei/meS4quaOpeWPo+ivt+axgueahOaXtuWAme+8jOWPr+S7peS4jemcgOimgSBhdXRob3JpemF0aW9uIOWtl+autVxuICAgICAgICAgICAgdmFyIHJlbGF5U2VydmVyID0gZXhwb3J0cy5ub3JtYWxpemVFbmRwb2ludChvcHRpb25zLmJvc19yZWxheV9zZXJ2ZXIpO1xuICAgICAgICAgICAgeGhyVXJpID0gcmVsYXlTZXJ2ZXIgKyAnLycgKyBlbmRwb2ludEhvc3QgKyByZXNvdXJjZTtcblxuICAgICAgICAgICAgYXJncy5wYXJhbXMuaHR0cE1ldGhvZCA9IGh0dHBNZXRob2Q7XG5cbiAgICAgICAgICAgIHhock1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc0JvcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgeGhyVXJpID0gZXhwb3J0cy50cmFuc2Zvcm1VcmwoY29uZmlnLmVuZHBvaW50ICsgcmVzb3VyY2UpO1xuICAgICAgICAgICAgYXJncy5oZWFkZXJzLmhvc3QgPSBwYXJzZUhvc3QoeGhyVXJpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHhoclVyaSA9IGNvbmZpZy5lbmRwb2ludCArIHJlc291cmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHhock1ldGhvZCA9PT0gJ1BPU1QnICYmICF4aHJCb2R5KSB7XG4gICAgICAgICAgICAvLyDlv4XpobvopoHmnIkgQk9EWSDmiY3og73mmK8gUE9TVO+8jOWQpuWImeS9oOiuvue9ruS6huS5n+ayoeaciVxuICAgICAgICAgICAgLy8g6ICM5LiU5b+F6aG75pivIFBPU1Qg5omN5Y+v5Lul6K6+572u6Ieq5a6a5LmJ55qEaGVhZGVy77yMR0VU5LiN6KGMXG4gICAgICAgICAgICB4aHJCb2R5ID0gJ3tcIkZPUkNFX1BPU1RcIjogdHJ1ZX0nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgICAgIHZhciB4aHIgPSBuZXcgbU94aWUuWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSB8fCAne30nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGh0dHBNZXRob2QgPT09ICdIRUFEJykge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cF9oZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c19jb2RlOiB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXNwb25zZS5tZXNzYWdlIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiByZXNwb25zZS5jb2RlIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X2lkOiByZXNwb25zZS5yZXF1ZXN0SWQgfHwgJydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoeGhyLnVwbG9hZCkge1xuICAgICAgICAgICAgLy8gRklYTUUo5YiG54mH5LiK5Lyg55qE6YC76L6R5ZKMeHh455qE6YC76L6R5LiN5LiA5qC3KVxuICAgICAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxIdHRwTWV0aG9kID09PSAnUFVUJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBQT1NULCBIRUFELCBHRVQg5LmL57G755qE5LiN6ZyA6KaB6Kem5Y+RIHByb2dyZXNzIOS6i+S7tlxuICAgICAgICAgICAgICAgICAgICAvLyDlkKbliJnlr7zoh7TpobXpnaLnmoTpgLvovpHmt7fkubFcbiAgICAgICAgICAgICAgICAgICAgZS5sZW5ndGhDb21wdXRhYmxlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaHR0cENvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwTWV0aG9kOiBvcmlnaW5hbEh0dHBNZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogcmVzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHI6IHhoclxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbWl0KCdwcm9ncmVzcycsIGUsIGh0dHBDb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSBjbGllbnQuY3JlYXRlU2lnbmF0dXJlKGNsaWVudC5jb25maWcuY3JlZGVudGlhbHMsXG4gICAgICAgICAgICBodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncy5wYXJhbXMsIGFyZ3MuaGVhZGVycyk7XG4gICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAoYXV0aG9yaXphdGlvbiwgeGJjZURhdGUpIHtcbiAgICAgICAgICAgIGlmIChhdXRob3JpemF0aW9uKSB7XG4gICAgICAgICAgICAgICAgYXJncy5oZWFkZXJzLmF1dGhvcml6YXRpb24gPSBhdXRob3JpemF0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoeGJjZURhdGUpIHtcbiAgICAgICAgICAgICAgICBhcmdzLmhlYWRlcnNbJ3gtYmNlLWRhdGUnXSA9IHhiY2VEYXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcXMgPSBxc01vZHVsZS5zdHJpbmdpZnkoYXJncy5wYXJhbXMpO1xuICAgICAgICAgICAgaWYgKHFzKSB7XG4gICAgICAgICAgICAgICAgeGhyVXJpICs9ICc/JyArIHFzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIub3Blbih4aHJNZXRob2QsIHhoclVyaSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFyZ3MuaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICAgICAgICAgIHx8IGtleSA9PT0gJ2hvc3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmhlYWRlcnNba2V5XTtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLnNlbmQoeGhyQm9keSwge1xuICAgICAgICAgICAgICAgIHJ1bnRpbWVfb3JkZXI6ICdmbGFzaCcsXG4gICAgICAgICAgICAgICAgc3dmX3VybDogb3B0aW9ucy5mbGFzaF9zd2ZfdXJsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufTtcblxuXG5leHBvcnRzLmVhY2hMaW1pdCA9IGZ1bmN0aW9uICh0YXNrcywgdGFza1BhcmFsbGVsLCBleGVjdXRlciwgZG9uZSkge1xuICAgIHZhciBydW5uaW5nQ291bnQgPSAwO1xuICAgIHZhciBhYm9ydGVkID0gZmFsc2U7XG4gICAgdmFyIGZpbiA9IGZhbHNlOyAgICAgIC8vIGRvbmUg5Y+q6IO96KKr6LCD55So5LiA5qyhLlxuICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZSh0YXNrcyk7XG5cbiAgICBmdW5jdGlvbiBpbmZpbml0ZUxvb3AoKSB7XG4gICAgICAgIHZhciB0YXNrID0gcXVldWUuZGVxdWV1ZSgpO1xuICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bm5pbmdDb3VudCsrO1xuICAgICAgICBleGVjdXRlcih0YXNrLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJ1bm5pbmdDb3VudC0tO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAvLyDkuIDml6bmnInmiqXplJnvvIznu4jmraLov5DooYxcbiAgICAgICAgICAgICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRvbmUoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFxdWV1ZS5pc0VtcHR5KCkgJiYgIWFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6Zif5YiX6L+Y5pyJ5YaF5a65XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoaW5maW5pdGVMb29wLCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocnVubmluZ0NvdW50IDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6Zif5YiX56m65LqG77yM6ICM5LiU5rKh5pyJ6L+Q6KGM5Lit55qE5Lu75Yqh5LqGXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0YXNrUGFyYWxsZWwgPSBNYXRoLm1pbih0YXNrUGFyYWxsZWwsIHF1ZXVlLnNpemUoKSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXNrUGFyYWxsZWw7IGkrKykge1xuICAgICAgICBpbmZpbml0ZUxvb3AoKTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmluaGVyaXRzID0gZnVuY3Rpb24gKENoaWxkQ3RvciwgUGFyZW50Q3Rvcikge1xuICAgIENoaWxkQ3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBhcmVudEN0b3IucHJvdG90eXBlKTtcbiAgICBDaGlsZEN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQ2hpbGRDdG9yO1xufTtcblxuZXhwb3J0cy5ndWVzc0NvbnRlbnRUeXBlID0gZnVuY3Rpb24gKGZpbGUsIG9wdF9pZ25vcmVDaGFyc2V0KSB7XG4gICAgdmFyIGNvbnRlbnRUeXBlID0gZmlsZS50eXBlO1xuICAgIGlmICghY29udGVudFR5cGUpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IGZpbGUubmFtZTtcbiAgICAgICAgdmFyIGV4dCA9IG9iamVjdC5zcGxpdCgvXFwuL2cpLnBvcCgpO1xuICAgICAgICBjb250ZW50VHlwZSA9IE1pbWVUeXBlLmd1ZXNzKGV4dCk7XG4gICAgfVxuXG4gICAgLy8gRmlyZWZveOWcqFBPU1TnmoTml7blgJnvvIxDb250ZW50LVR5cGUg5LiA5a6a5Lya5pyJQ2hhcnNldOeahO+8jOWboOatpFxuICAgIC8vIOi/memHjOS4jeeuoTM3MjHvvIzpg73liqDkuIouXG4gICAgaWYgKCFvcHRfaWdub3JlQ2hhcnNldCAmJiAhL2NoYXJzZXQ9Ly50ZXN0KGNvbnRlbnRUeXBlKSkge1xuICAgICAgICBjb250ZW50VHlwZSArPSAnOyBjaGFyc2V0PVVURi04JztcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudFR5cGU7XG59O1xuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvQnVmZmVyLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKipcbiAqIEJ1ZmZlclxuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBCdWZmZXIoKSB7XG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU1MTU4Njkvc3RyaW5nLWxlbmd0aC1pbi1ieXRlcy1pbi1qYXZhc2NyaXB0XG4gICAgdmFyIG0gPSBlbmNvZGVVUklDb21wb25lbnQoZGF0YSkubWF0Y2goLyVbODlBQmFiXS9nKTtcbiAgICByZXR1cm4gZGF0YS5sZW5ndGggKyAobSA/IG0ubGVuZ3RoIDogMCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1ZmZlcjtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvYXN5bmMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbmV4cG9ydHMubWFwTGltaXQgPSByZXF1aXJlKDIpO1xuIiwiOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gR2xvYmFsIChicm93c2VyKVxuXHRcdHJvb3QuQ3J5cHRvSlMgPSBmYWN0b3J5KCk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG5cdC8qKlxuXHQgKiBDcnlwdG9KUyBjb3JlIGNvbXBvbmVudHMuXG5cdCAqL1xuXHR2YXIgQ3J5cHRvSlMgPSBDcnlwdG9KUyB8fCAoZnVuY3Rpb24gKE1hdGgsIHVuZGVmaW5lZCkge1xuXHQgICAgLypcblx0ICAgICAqIExvY2FsIHBvbHlmaWwgb2YgT2JqZWN0LmNyZWF0ZVxuXHQgICAgICovXG5cdCAgICB2YXIgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIGZ1bmN0aW9uIEYoKSB7fTtcblxuXHQgICAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG5cdCAgICAgICAgICAgIHZhciBzdWJ0eXBlO1xuXG5cdCAgICAgICAgICAgIEYucHJvdG90eXBlID0gb2JqO1xuXG5cdCAgICAgICAgICAgIHN1YnR5cGUgPSBuZXcgRigpO1xuXG5cdCAgICAgICAgICAgIEYucHJvdG90eXBlID0gbnVsbDtcblxuXHQgICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcblx0ICAgICAgICB9O1xuXHQgICAgfSgpKVxuXG5cdCAgICAvKipcblx0ICAgICAqIENyeXB0b0pTIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIEMgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBMaWJyYXJ5IG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfbGliID0gQy5saWIgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBCYXNlIG9iamVjdCBmb3IgcHJvdG90eXBhbCBpbmhlcml0YW5jZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIEJhc2UgPSBDX2xpYi5CYXNlID0gKGZ1bmN0aW9uICgpIHtcblxuXG5cdCAgICAgICAgcmV0dXJuIHtcblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG92ZXJyaWRlcyBQcm9wZXJ0aWVzIHRvIGNvcHkgaW50byB0aGUgbmV3IG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgdmFyIE15VHlwZSA9IENyeXB0b0pTLmxpYi5CYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgZmllbGQ6ICd2YWx1ZScsXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICAgICAgbWV0aG9kOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgfVxuXHQgICAgICAgICAgICAgKiAgICAgfSk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uIChvdmVycmlkZXMpIHtcblx0ICAgICAgICAgICAgICAgIC8vIFNwYXduXG5cdCAgICAgICAgICAgICAgICB2YXIgc3VidHlwZSA9IGNyZWF0ZSh0aGlzKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gQXVnbWVudFxuXHQgICAgICAgICAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHN1YnR5cGUubWl4SW4ob3ZlcnJpZGVzKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGRlZmF1bHQgaW5pdGlhbGl6ZXJcblx0ICAgICAgICAgICAgICAgIGlmICghc3VidHlwZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdCcpIHx8IHRoaXMuaW5pdCA9PT0gc3VidHlwZS5pbml0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgc3VidHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLiRzdXBlci5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZXIncyBwcm90b3R5cGUgaXMgdGhlIHN1YnR5cGUgb2JqZWN0XG5cdCAgICAgICAgICAgICAgICBzdWJ0eXBlLmluaXQucHJvdG90eXBlID0gc3VidHlwZTtcblxuXHQgICAgICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHN1cGVydHlwZVxuXHQgICAgICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogRXh0ZW5kcyB0aGlzIG9iamVjdCBhbmQgcnVucyB0aGUgaW5pdCBtZXRob2QuXG5cdCAgICAgICAgICAgICAqIEFyZ3VtZW50cyB0byBjcmVhdGUoKSB3aWxsIGJlIHBhc3NlZCB0byBpbml0KCkuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBpbnN0YW5jZSA9IE15VHlwZS5jcmVhdGUoKTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5leHRlbmQoKTtcblx0ICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cblx0ICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIG9iamVjdC5cblx0ICAgICAgICAgICAgICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWRkIHNvbWUgbG9naWMgd2hlbiB5b3VyIG9iamVjdHMgYXJlIGNyZWF0ZWQuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAgICAgICogICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgICAgIC8vIC4uLlxuXHQgICAgICAgICAgICAgKiAgICAgICAgIH1cblx0ICAgICAgICAgICAgICogICAgIH0pO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB9LFxuXG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBDb3BpZXMgcHJvcGVydGllcyBpbnRvIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllcyBUaGUgcHJvcGVydGllcyB0byBtaXggaW4uXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICBNeVR5cGUubWl4SW4oe1xuXHQgICAgICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnXG5cdCAgICAgICAgICAgICAqICAgICB9KTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIG1peEluOiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIElFIHdvbid0IGNvcHkgdG9TdHJpbmcgdXNpbmcgdGhlIGxvb3AgYWJvdmVcblx0ICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b1N0cmluZyA9IHByb3BlcnRpZXMudG9TdHJpbmc7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBjbG9uZSA9IGluc3RhbmNlLmNsb25lKCk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdC5wcm90b3R5cGUuZXh0ZW5kKHRoaXMpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfTtcblx0ICAgIH0oKSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdvcmRzIFRoZSBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG5cdCAgICAgKiBAcHJvcGVydHkge251bWJlcn0gc2lnQnl0ZXMgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgKi9cblx0ICAgIHZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXkgPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSB3b3JkcyAoT3B0aW9uYWwpIEFuIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2lnQnl0ZXMgKE9wdGlvbmFsKSBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoZSB3b3Jkcy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKCk7XG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShbMHgwMDAxMDIwMywgMHgwNDA1MDYwN10pO1xuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddLCA2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBpbml0OiBmdW5jdGlvbiAod29yZHMsIHNpZ0J5dGVzKSB7XG5cdCAgICAgICAgICAgIHdvcmRzID0gdGhpcy53b3JkcyA9IHdvcmRzIHx8IFtdO1xuXG5cdCAgICAgICAgICAgIGlmIChzaWdCeXRlcyAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSBzaWdCeXRlcztcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSB3b3Jkcy5sZW5ndGggKiA0O1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIHRoaXMgd29yZCBhcnJheSB0byBhIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7RW5jb2Rlcn0gZW5jb2RlciAoT3B0aW9uYWwpIFRoZSBlbmNvZGluZyBzdHJhdGVneSB0byB1c2UuIERlZmF1bHQ6IENyeXB0b0pTLmVuYy5IZXhcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHN0cmluZ2lmaWVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkgKyAnJztcblx0ICAgICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheS50b1N0cmluZygpO1xuXHQgICAgICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5LnRvU3RyaW5nKENyeXB0b0pTLmVuYy5VdGY4KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKGVuY29kZXIpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIChlbmNvZGVyIHx8IEhleCkuc3RyaW5naWZ5KHRoaXMpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25jYXRlbmF0ZXMgYSB3b3JkIGFycmF5IHRvIHRoaXMgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheTEuY29uY2F0KHdvcmRBcnJheTIpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHRoaXNXb3JkcyA9IHRoaXMud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGF0V29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGlzU2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXHQgICAgICAgICAgICB2YXIgdGhhdFNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG5cdCAgICAgICAgICAgIHRoaXMuY2xhbXAoKTtcblxuXHQgICAgICAgICAgICAvLyBDb25jYXRcblx0ICAgICAgICAgICAgaWYgKHRoaXNTaWdCeXRlcyAlIDQpIHtcblx0ICAgICAgICAgICAgICAgIC8vIENvcHkgb25lIGJ5dGUgYXQgYSB0aW1lXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoYXRTaWdCeXRlczsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXRCeXRlID0gKHRoYXRXb3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpc1dvcmRzWyh0aGlzU2lnQnl0ZXMgKyBpKSA+Pj4gMl0gfD0gdGhhdEJ5dGUgPDwgKDI0IC0gKCh0aGlzU2lnQnl0ZXMgKyBpKSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBDb3B5IG9uZSB3b3JkIGF0IGEgdGltZVxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkgKz0gNCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdID0gdGhhdFdvcmRzW2kgPj4+IDJdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgKz0gdGhhdFNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENoYWluYWJsZVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVtb3ZlcyBpbnNpZ25pZmljYW50IGJpdHMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheS5jbGFtcCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsYW1wOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB0aGlzLndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgc2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wXG5cdCAgICAgICAgICAgIHdvcmRzW3NpZ0J5dGVzID4+PiAyXSAmPSAweGZmZmZmZmZmIDw8ICgzMiAtIChzaWdCeXRlcyAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIHdvcmRzLmxlbmd0aCA9IE1hdGguY2VpbChzaWdCeXRlcyAvIDQpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gd29yZEFycmF5LmNsb25lKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuXHQgICAgICAgICAgICBjbG9uZS53b3JkcyA9IHRoaXMud29yZHMuc2xpY2UoMCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgd29yZCBhcnJheSBmaWxsZWQgd2l0aCByYW5kb20gYnl0ZXMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbkJ5dGVzIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIHRvIGdlbmVyYXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcmFuZG9tIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LnJhbmRvbSgxNik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcmFuZG9tOiBmdW5jdGlvbiAobkJ5dGVzKSB7XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXG5cdCAgICAgICAgICAgIHZhciByID0gKGZ1bmN0aW9uIChtX3cpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBtX3cgPSBtX3c7XG5cdCAgICAgICAgICAgICAgICB2YXIgbV96ID0gMHgzYWRlNjhiMTtcblx0ICAgICAgICAgICAgICAgIHZhciBtYXNrID0gMHhmZmZmZmZmZjtcblxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBtX3ogPSAoMHg5MDY5ICogKG1feiAmIDB4RkZGRikgKyAobV96ID4+IDB4MTApKSAmIG1hc2s7XG5cdCAgICAgICAgICAgICAgICAgICAgbV93ID0gKDB4NDY1MCAqIChtX3cgJiAweEZGRkYpICsgKG1fdyA+PiAweDEwKSkgJiBtYXNrO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAoKG1feiA8PCAweDEwKSArIG1fdykgJiBtYXNrO1xuXHQgICAgICAgICAgICAgICAgICAgIHJlc3VsdCAvPSAweDEwMDAwMDAwMDtcblx0ICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gMC41O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgKiAoTWF0aC5yYW5kb20oKSA+IC41ID8gMSA6IC0xKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHJjYWNoZTsgaSA8IG5CeXRlczsgaSArPSA0KSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgX3IgPSByKChyY2FjaGUgfHwgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDAwMCk7XG5cblx0ICAgICAgICAgICAgICAgIHJjYWNoZSA9IF9yKCkgKiAweDNhZGU2N2I3O1xuXHQgICAgICAgICAgICAgICAgd29yZHMucHVzaCgoX3IoKSAqIDB4MTAwMDAwMDAwKSB8IDApO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbkJ5dGVzKTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBFbmNvZGVyIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfZW5jID0gQy5lbmMgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBIZXggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBIZXggPSBDX2VuYy5IZXggPSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBoZXggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGV4U3RyaW5nID0gQ3J5cHRvSlMuZW5jLkhleC5zdHJpbmdpZnkod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IHdvcmRBcnJheS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIGhleENoYXJzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lnQnl0ZXM7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgdmFyIGJpdGUgPSAod29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuXHQgICAgICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcblx0ICAgICAgICAgICAgICAgIGhleENoYXJzLnB1c2goKGJpdGUgJiAweDBmKS50b1N0cmluZygxNikpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhleENoYXJzLmpvaW4oJycpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIGhleCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciBUaGUgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuSGV4LnBhcnNlKGhleFN0cmluZyk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIChoZXhTdHIpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIGhleFN0ckxlbmd0aCA9IGhleFN0ci5sZW5ndGg7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydFxuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSBbXTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZXhTdHJMZW5ndGg7IGkgKz0gMikge1xuXHQgICAgICAgICAgICAgICAgd29yZHNbaSA+Pj4gM10gfD0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cihpLCAyKSwgMTYpIDw8ICgyNCAtIChpICUgOCkgKiA0KTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIGhleFN0ckxlbmd0aCAvIDIpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogTGF0aW4xIGVuY29kaW5nIHN0cmF0ZWd5LlxuXHQgICAgICovXG5cdCAgICB2YXIgTGF0aW4xID0gQ19lbmMuTGF0aW4xID0ge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIExhdGluMSBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgTGF0aW4xIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGxhdGluMVN0cmluZyA9IENyeXB0b0pTLmVuYy5MYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBzaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciBsYXRpbjFDaGFycyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZ0J5dGVzOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBiaXRlID0gKHdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcblx0ICAgICAgICAgICAgICAgIGxhdGluMUNoYXJzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShiaXRlKSk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbGF0aW4xQ2hhcnMuam9pbignJyk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgTGF0aW4xIHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0aW4xU3RyIFRoZSBMYXRpbjEgc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5MYXRpbjEucGFyc2UobGF0aW4xU3RyaW5nKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBwYXJzZTogZnVuY3Rpb24gKGxhdGluMVN0cikge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dFxuXHQgICAgICAgICAgICB2YXIgbGF0aW4xU3RyTGVuZ3RoID0gbGF0aW4xU3RyLmxlbmd0aDtcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhdGluMVN0ckxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB3b3Jkc1tpID4+PiAyXSB8PSAobGF0aW4xU3RyLmNoYXJDb2RlQXQoaSkgJiAweGZmKSA8PCAoMjQgLSAoaSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBsYXRpbjFTdHJMZW5ndGgpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogVVRGLTggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBVdGY4ID0gQ19lbmMuVXRmOCA9IHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBVVEYtOCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgdXRmOFN0cmluZyA9IENyeXB0b0pTLmVuYy5VdGY4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoTGF0aW4xLnN0cmluZ2lmeSh3b3JkQXJyYXkpKSk7XG5cdCAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWFsZm9ybWVkIFVURi04IGRhdGEnKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIFVURi04IHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXRmOFN0ciBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5VdGY4LnBhcnNlKHV0ZjhTdHJpbmcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodXRmOFN0cikge1xuXHQgICAgICAgICAgICByZXR1cm4gTGF0aW4xLnBhcnNlKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudCh1dGY4U3RyKSkpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgYnVmZmVyZWQgYmxvY2sgYWxnb3JpdGhtIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIFRoZSBwcm9wZXJ0eSBibG9ja1NpemUgbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBhIGNvbmNyZXRlIHN1YnR5cGUuXG5cdCAgICAgKlxuXHQgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IF9taW5CdWZmZXJTaXplIFRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgc2hvdWxkIGJlIGtlcHQgdW5wcm9jZXNzZWQgaW4gdGhlIGJ1ZmZlci4gRGVmYXVsdDogMFxuXHQgICAgICovXG5cdCAgICB2YXIgQnVmZmVyZWRCbG9ja0FsZ29yaXRobSA9IENfbGliLkJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVzZXRzIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgZGF0YSBidWZmZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBJbml0aWFsIHZhbHVlc1xuXHQgICAgICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFdvcmRBcnJheS5pbml0KCk7XG5cdCAgICAgICAgICAgIHRoaXMuX25EYXRhQnl0ZXMgPSAwO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBBZGRzIG5ldyBkYXRhIHRvIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgYnVmZmVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGFwcGVuZC4gU3RyaW5ncyBhcmUgY29udmVydGVkIHRvIGEgV29yZEFycmF5IHVzaW5nIFVURi04LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQoJ2RhdGEnKTtcblx0ICAgICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fYXBwZW5kKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2FwcGVuZDogZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgICAgIGRhdGEgPSBVdGY4LnBhcnNlKGRhdGEpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQXBwZW5kXG5cdCAgICAgICAgICAgIHRoaXMuX2RhdGEuY29uY2F0KGRhdGEpO1xuXHQgICAgICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzICs9IGRhdGEuc2lnQnl0ZXM7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFByb2Nlc3NlcyBhdmFpbGFibGUgZGF0YSBibG9ja3MuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBUaGlzIG1ldGhvZCBpbnZva2VzIF9kb1Byb2Nlc3NCbG9jayhvZmZzZXQpLCB3aGljaCBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IGEgY29uY3JldGUgc3VidHlwZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZG9GbHVzaCBXaGV0aGVyIGFsbCBibG9ja3MgYW5kIHBhcnRpYWwgYmxvY2tzIHNob3VsZCBiZSBwcm9jZXNzZWQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBwcm9jZXNzZWQgZGF0YS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHByb2Nlc3NlZERhdGEgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9wcm9jZXNzKCk7XG5cdCAgICAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcyghISdmbHVzaCcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIF9wcm9jZXNzOiBmdW5jdGlvbiAoZG9GbHVzaCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuXHQgICAgICAgICAgICB2YXIgZGF0YVdvcmRzID0gZGF0YS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIGRhdGFTaWdCeXRlcyA9IGRhdGEuc2lnQnl0ZXM7XG5cdCAgICAgICAgICAgIHZhciBibG9ja1NpemUgPSB0aGlzLmJsb2NrU2l6ZTtcblx0ICAgICAgICAgICAgdmFyIGJsb2NrU2l6ZUJ5dGVzID0gYmxvY2tTaXplICogNDtcblxuXHQgICAgICAgICAgICAvLyBDb3VudCBibG9ja3MgcmVhZHlcblx0ICAgICAgICAgICAgdmFyIG5CbG9ja3NSZWFkeSA9IGRhdGFTaWdCeXRlcyAvIGJsb2NrU2l6ZUJ5dGVzO1xuXHQgICAgICAgICAgICBpZiAoZG9GbHVzaCkge1xuXHQgICAgICAgICAgICAgICAgLy8gUm91bmQgdXAgdG8gaW5jbHVkZSBwYXJ0aWFsIGJsb2Nrc1xuXHQgICAgICAgICAgICAgICAgbkJsb2Nrc1JlYWR5ID0gTWF0aC5jZWlsKG5CbG9ja3NSZWFkeSk7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBSb3VuZCBkb3duIHRvIGluY2x1ZGUgb25seSBmdWxsIGJsb2Nrcyxcblx0ICAgICAgICAgICAgICAgIC8vIGxlc3MgdGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBtdXN0IHJlbWFpbiBpbiB0aGUgYnVmZmVyXG5cdCAgICAgICAgICAgICAgICBuQmxvY2tzUmVhZHkgPSBNYXRoLm1heCgobkJsb2Nrc1JlYWR5IHwgMCkgLSB0aGlzLl9taW5CdWZmZXJTaXplLCAwKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIENvdW50IHdvcmRzIHJlYWR5XG5cdCAgICAgICAgICAgIHZhciBuV29yZHNSZWFkeSA9IG5CbG9ja3NSZWFkeSAqIGJsb2NrU2l6ZTtcblxuXHQgICAgICAgICAgICAvLyBDb3VudCBieXRlcyByZWFkeVxuXHQgICAgICAgICAgICB2YXIgbkJ5dGVzUmVhZHkgPSBNYXRoLm1pbihuV29yZHNSZWFkeSAqIDQsIGRhdGFTaWdCeXRlcyk7XG5cblx0ICAgICAgICAgICAgLy8gUHJvY2VzcyBibG9ja3Ncblx0ICAgICAgICAgICAgaWYgKG5Xb3Jkc1JlYWR5KSB7XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBuV29yZHNSZWFkeTsgb2Zmc2V0ICs9IGJsb2NrU2l6ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtYWxnb3JpdGhtIGxvZ2ljXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fZG9Qcm9jZXNzQmxvY2soZGF0YVdvcmRzLCBvZmZzZXQpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJvY2Vzc2VkIHdvcmRzXG5cdCAgICAgICAgICAgICAgICB2YXIgcHJvY2Vzc2VkV29yZHMgPSBkYXRhV29yZHMuc3BsaWNlKDAsIG5Xb3Jkc1JlYWR5KTtcblx0ICAgICAgICAgICAgICAgIGRhdGEuc2lnQnl0ZXMgLT0gbkJ5dGVzUmVhZHk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBSZXR1cm4gcHJvY2Vzc2VkIHdvcmRzXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQocHJvY2Vzc2VkV29yZHMsIG5CeXRlc1JlYWR5KTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5jbG9uZSgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBjbG9uZSA9IEJhc2UuY2xvbmUuY2FsbCh0aGlzKTtcblx0ICAgICAgICAgICAgY2xvbmUuX2RhdGEgPSB0aGlzLl9kYXRhLmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfbWluQnVmZmVyU2l6ZTogMFxuXHQgICAgfSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgaGFzaGVyIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibG9ja1NpemUgVGhlIG51bWJlciBvZiAzMi1iaXQgd29yZHMgdGhpcyBoYXNoZXIgb3BlcmF0ZXMgb24uIERlZmF1bHQ6IDE2ICg1MTIgYml0cylcblx0ICAgICAqL1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlciA9IEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uZXh0ZW5kKHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMuXG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2ZnOiBCYXNlLmV4dGVuZCgpLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZmcgKE9wdGlvbmFsKSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHVzZSBmb3IgdGhpcyBoYXNoIGNvbXB1dGF0aW9uLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaGVyID0gQ3J5cHRvSlMuYWxnby5TSEEyNTYuY3JlYXRlKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgaW5pdDogZnVuY3Rpb24gKGNmZykge1xuXHQgICAgICAgICAgICAvLyBBcHBseSBjb25maWcgZGVmYXVsdHNcblx0ICAgICAgICAgICAgdGhpcy5jZmcgPSB0aGlzLmNmZy5leHRlbmQoY2ZnKTtcblxuXHQgICAgICAgICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZXNcblx0ICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBSZXNldHMgdGhpcyBoYXNoZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhhc2hlci5yZXNldCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFJlc2V0IGRhdGEgYnVmZmVyXG5cdCAgICAgICAgICAgIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQuY2FsbCh0aGlzKTtcblxuXHQgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWhhc2hlciBsb2dpY1xuXHQgICAgICAgICAgICB0aGlzLl9kb1Jlc2V0KCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFVwZGF0ZXMgdGhpcyBoYXNoZXIgd2l0aCBhIG1lc3NhZ2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7SGFzaGVyfSBUaGlzIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgaGFzaGVyLnVwZGF0ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICBoYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBBcHBlbmRcblx0ICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXG5cdCAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgaGFzaFxuXHQgICAgICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cblx0ICAgICAgICAgICAgLy8gQ2hhaW5hYmxlXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBGaW5hbGl6ZXMgdGhlIGhhc2ggY29tcHV0YXRpb24uXG5cdCAgICAgICAgICogTm90ZSB0aGF0IHRoZSBmaW5hbGl6ZSBvcGVyYXRpb24gaXMgZWZmZWN0aXZlbHkgYSBkZXN0cnVjdGl2ZSwgcmVhZC1vbmNlIG9wZXJhdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSAoT3B0aW9uYWwpIEEgZmluYWwgbWVzc2FnZSB1cGRhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGZpbmFsaXplOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBGaW5hbCBtZXNzYWdlIHVwZGF0ZVxuXHQgICAgICAgICAgICBpZiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcblx0ICAgICAgICAgICAgdmFyIGhhc2ggPSB0aGlzLl9kb0ZpbmFsaXplKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhhc2g7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIGJsb2NrU2l6ZTogNTEyLzMyLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIHNob3J0Y3V0IGZ1bmN0aW9uIHRvIGEgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byBjcmVhdGUgYSBoZWxwZXIgZm9yLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIFNIQTI1NiA9IENyeXB0b0pTLmxpYi5IYXNoZXIuX2NyZWF0ZUhlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2NyZWF0ZUhlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGNmZykge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBoYXNoZXIuaW5pdChjZmcpLmZpbmFsaXplKG1lc3NhZ2UpO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaGVyIHRvIHVzZSBpbiB0aGlzIEhNQUMgaGVscGVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIEhtYWNTSEEyNTYgPSBDcnlwdG9KUy5saWIuSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBfY3JlYXRlSG1hY0hlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGtleSkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDX2FsZ28uSE1BQy5pbml0KGhhc2hlciwga2V5KS5maW5hbGl6ZShtZXNzYWdlKTtcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBbGdvcml0aG0gbmFtZXNwYWNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQ19hbGdvID0gQy5hbGdvID0ge307XG5cblx0ICAgIHJldHVybiBDO1xuXHR9KE1hdGgpKTtcblxuXG5cdHJldHVybiBDcnlwdG9KUztcblxufSkpOyIsIjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnksIHVuZGVmKSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKDM3KSwgcmVxdWlyZSg0MCksIHJlcXVpcmUoMzkpKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXCIuL2NvcmVcIiwgXCIuL3NoYTI1NlwiLCBcIi4vaG1hY1wiXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gR2xvYmFsIChicm93c2VyKVxuXHRcdGZhY3Rvcnkocm9vdC5DcnlwdG9KUyk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKENyeXB0b0pTKSB7XG5cblx0cmV0dXJuIENyeXB0b0pTLkhtYWNTSEEyNTY7XG5cbn0pKTsiLCI7KGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKDM3KSk7XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW1wiLi9jb3JlXCJdLCBmYWN0b3J5KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBHbG9iYWwgKGJyb3dzZXIpXG5cdFx0ZmFjdG9yeShyb290LkNyeXB0b0pTKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbiAoQ3J5cHRvSlMpIHtcblxuXHQoZnVuY3Rpb24gKCkge1xuXHQgICAgLy8gU2hvcnRjdXRzXG5cdCAgICB2YXIgQyA9IENyeXB0b0pTO1xuXHQgICAgdmFyIENfbGliID0gQy5saWI7XG5cdCAgICB2YXIgQmFzZSA9IENfbGliLkJhc2U7XG5cdCAgICB2YXIgQ19lbmMgPSBDLmVuYztcblx0ICAgIHZhciBVdGY4ID0gQ19lbmMuVXRmODtcblx0ICAgIHZhciBDX2FsZ28gPSBDLmFsZ287XG5cblx0ICAgIC8qKlxuXHQgICAgICogSE1BQyBhbGdvcml0aG0uXG5cdCAgICAgKi9cblx0ICAgIHZhciBITUFDID0gQ19hbGdvLkhNQUMgPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIEhNQUMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoIGFsZ29yaXRobSB0byB1c2UuXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBobWFjSGFzaGVyID0gQ3J5cHRvSlMuYWxnby5ITUFDLmNyZWF0ZShDcnlwdG9KUy5hbGdvLlNIQTI1Niwga2V5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBpbml0OiBmdW5jdGlvbiAoaGFzaGVyLCBrZXkpIHtcblx0ICAgICAgICAgICAgLy8gSW5pdCBoYXNoZXJcblx0ICAgICAgICAgICAgaGFzaGVyID0gdGhpcy5faGFzaGVyID0gbmV3IGhhc2hlci5pbml0KCk7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGtleSA9PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgICAgICAga2V5ID0gVXRmOC5wYXJzZShrZXkpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBoYXNoZXJCbG9ja1NpemUgPSBoYXNoZXIuYmxvY2tTaXplO1xuXHQgICAgICAgICAgICB2YXIgaGFzaGVyQmxvY2tTaXplQnl0ZXMgPSBoYXNoZXJCbG9ja1NpemUgKiA0O1xuXG5cdCAgICAgICAgICAgIC8vIEFsbG93IGFyYml0cmFyeSBsZW5ndGgga2V5c1xuXHQgICAgICAgICAgICBpZiAoa2V5LnNpZ0J5dGVzID4gaGFzaGVyQmxvY2tTaXplQnl0ZXMpIHtcblx0ICAgICAgICAgICAgICAgIGtleSA9IGhhc2hlci5maW5hbGl6ZShrZXkpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQ2xhbXAgZXhjZXNzIGJpdHNcblx0ICAgICAgICAgICAga2V5LmNsYW1wKCk7XG5cblx0ICAgICAgICAgICAgLy8gQ2xvbmUga2V5IGZvciBpbm5lciBhbmQgb3V0ZXIgcGFkc1xuXHQgICAgICAgICAgICB2YXIgb0tleSA9IHRoaXMuX29LZXkgPSBrZXkuY2xvbmUoKTtcblx0ICAgICAgICAgICAgdmFyIGlLZXkgPSB0aGlzLl9pS2V5ID0ga2V5LmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBvS2V5V29yZHMgPSBvS2V5LndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgaUtleVdvcmRzID0gaUtleS53b3JkcztcblxuXHQgICAgICAgICAgICAvLyBYT1Iga2V5cyB3aXRoIHBhZCBjb25zdGFudHNcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXNoZXJCbG9ja1NpemU7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgb0tleVdvcmRzW2ldIF49IDB4NWM1YzVjNWM7XG5cdCAgICAgICAgICAgICAgICBpS2V5V29yZHNbaV0gXj0gMHgzNjM2MzYzNjtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBvS2V5LnNpZ0J5dGVzID0gaUtleS5zaWdCeXRlcyA9IGhhc2hlckJsb2NrU2l6ZUJ5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIFNldCBpbml0aWFsIHZhbHVlc1xuXHQgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFJlc2V0cyB0aGlzIEhNQUMgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhtYWNIYXNoZXIucmVzZXQoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dFxuXHQgICAgICAgICAgICB2YXIgaGFzaGVyID0gdGhpcy5faGFzaGVyO1xuXG5cdCAgICAgICAgICAgIC8vIFJlc2V0XG5cdCAgICAgICAgICAgIGhhc2hlci5yZXNldCgpO1xuXHQgICAgICAgICAgICBoYXNoZXIudXBkYXRlKHRoaXMuX2lLZXkpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBVcGRhdGVzIHRoaXMgSE1BQyB3aXRoIGEgbWVzc2FnZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSBUaGUgbWVzc2FnZSB0byBhcHBlbmQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtITUFDfSBUaGlzIEhNQUMgaW5zdGFuY2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhtYWNIYXNoZXIudXBkYXRlKCdtZXNzYWdlJyk7XG5cdCAgICAgICAgICogICAgIGhtYWNIYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICB0aGlzLl9oYXNoZXIudXBkYXRlKG1lc3NhZ2VVcGRhdGUpO1xuXG5cdCAgICAgICAgICAgIC8vIENoYWluYWJsZVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogRmluYWxpemVzIHRoZSBITUFDIGNvbXB1dGF0aW9uLlxuXHQgICAgICAgICAqIE5vdGUgdGhhdCB0aGUgZmluYWxpemUgb3BlcmF0aW9uIGlzIGVmZmVjdGl2ZWx5IGEgZGVzdHJ1Y3RpdmUsIHJlYWQtb25jZSBvcGVyYXRpb24uXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgKE9wdGlvbmFsKSBBIGZpbmFsIG1lc3NhZ2UgdXBkYXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGhtYWMgPSBobWFjSGFzaGVyLmZpbmFsaXplKCk7XG5cdCAgICAgICAgICogICAgIHZhciBobWFjID0gaG1hY0hhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICB2YXIgaG1hYyA9IGhtYWNIYXNoZXIuZmluYWxpemUod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBmaW5hbGl6ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIGhhc2hlciA9IHRoaXMuX2hhc2hlcjtcblxuXHQgICAgICAgICAgICAvLyBDb21wdXRlIEhNQUNcblx0ICAgICAgICAgICAgdmFyIGlubmVySGFzaCA9IGhhc2hlci5maW5hbGl6ZShtZXNzYWdlVXBkYXRlKTtcblx0ICAgICAgICAgICAgaGFzaGVyLnJlc2V0KCk7XG5cdCAgICAgICAgICAgIHZhciBobWFjID0gaGFzaGVyLmZpbmFsaXplKHRoaXMuX29LZXkuY2xvbmUoKS5jb25jYXQoaW5uZXJIYXNoKSk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhtYWM7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0oKSk7XG5cblxufSkpOyIsIjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG5cdFx0Ly8gQ29tbW9uSlNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoMzcpKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXCIuL2NvcmVcIl0sIGZhY3RvcnkpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIEdsb2JhbCAoYnJvd3Nlcilcblx0XHRmYWN0b3J5KHJvb3QuQ3J5cHRvSlMpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uIChDcnlwdG9KUykge1xuXG5cdChmdW5jdGlvbiAoTWF0aCkge1xuXHQgICAgLy8gU2hvcnRjdXRzXG5cdCAgICB2YXIgQyA9IENyeXB0b0pTO1xuXHQgICAgdmFyIENfbGliID0gQy5saWI7XG5cdCAgICB2YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5O1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlcjtcblx0ICAgIHZhciBDX2FsZ28gPSBDLmFsZ287XG5cblx0ICAgIC8vIEluaXRpYWxpemF0aW9uIGFuZCByb3VuZCBjb25zdGFudHMgdGFibGVzXG5cdCAgICB2YXIgSCA9IFtdO1xuXHQgICAgdmFyIEsgPSBbXTtcblxuXHQgICAgLy8gQ29tcHV0ZSBjb25zdGFudHNcblx0ICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgZnVuY3Rpb24gaXNQcmltZShuKSB7XG5cdCAgICAgICAgICAgIHZhciBzcXJ0TiA9IE1hdGguc3FydChuKTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgZmFjdG9yID0gMjsgZmFjdG9yIDw9IHNxcnROOyBmYWN0b3IrKykge1xuXHQgICAgICAgICAgICAgICAgaWYgKCEobiAlIGZhY3RvcikpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBmdW5jdGlvbiBnZXRGcmFjdGlvbmFsQml0cyhuKSB7XG5cdCAgICAgICAgICAgIHJldHVybiAoKG4gLSAobiB8IDApKSAqIDB4MTAwMDAwMDAwKSB8IDA7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG4gPSAyO1xuXHQgICAgICAgIHZhciBuUHJpbWUgPSAwO1xuXHQgICAgICAgIHdoaWxlIChuUHJpbWUgPCA2NCkge1xuXHQgICAgICAgICAgICBpZiAoaXNQcmltZShuKSkge1xuXHQgICAgICAgICAgICAgICAgaWYgKG5QcmltZSA8IDgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBIW25QcmltZV0gPSBnZXRGcmFjdGlvbmFsQml0cyhNYXRoLnBvdyhuLCAxIC8gMikpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgS1tuUHJpbWVdID0gZ2V0RnJhY3Rpb25hbEJpdHMoTWF0aC5wb3cobiwgMSAvIDMpKTtcblxuXHQgICAgICAgICAgICAgICAgblByaW1lKys7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBuKys7XG5cdCAgICAgICAgfVxuXHQgICAgfSgpKTtcblxuXHQgICAgLy8gUmV1c2FibGUgb2JqZWN0XG5cdCAgICB2YXIgVyA9IFtdO1xuXG5cdCAgICAvKipcblx0ICAgICAqIFNIQS0yNTYgaGFzaCBhbGdvcml0aG0uXG5cdCAgICAgKi9cblx0ICAgIHZhciBTSEEyNTYgPSBDX2FsZ28uU0hBMjU2ID0gSGFzaGVyLmV4dGVuZCh7XG5cdCAgICAgICAgX2RvUmVzZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdGhpcy5faGFzaCA9IG5ldyBXb3JkQXJyYXkuaW5pdChILnNsaWNlKDApKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX2RvUHJvY2Vzc0Jsb2NrOiBmdW5jdGlvbiAoTSwgb2Zmc2V0KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0XG5cdCAgICAgICAgICAgIHZhciBIID0gdGhpcy5faGFzaC53b3JkcztcblxuXHQgICAgICAgICAgICAvLyBXb3JraW5nIHZhcmlhYmxlc1xuXHQgICAgICAgICAgICB2YXIgYSA9IEhbMF07XG5cdCAgICAgICAgICAgIHZhciBiID0gSFsxXTtcblx0ICAgICAgICAgICAgdmFyIGMgPSBIWzJdO1xuXHQgICAgICAgICAgICB2YXIgZCA9IEhbM107XG5cdCAgICAgICAgICAgIHZhciBlID0gSFs0XTtcblx0ICAgICAgICAgICAgdmFyIGYgPSBIWzVdO1xuXHQgICAgICAgICAgICB2YXIgZyA9IEhbNl07XG5cdCAgICAgICAgICAgIHZhciBoID0gSFs3XTtcblxuXHQgICAgICAgICAgICAvLyBDb21wdXRhdGlvblxuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIGlmIChpIDwgMTYpIHtcblx0ICAgICAgICAgICAgICAgICAgICBXW2ldID0gTVtvZmZzZXQgKyBpXSB8IDA7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBnYW1tYTB4ID0gV1tpIC0gMTVdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBnYW1tYTAgID0gKChnYW1tYTB4IDw8IDI1KSB8IChnYW1tYTB4ID4+PiA3KSkgIF5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZ2FtbWEweCA8PCAxNCkgfCAoZ2FtbWEweCA+Pj4gMTgpKSBeXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGdhbW1hMHggPj4+IDMpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGdhbW1hMXggPSBXW2kgLSAyXTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZ2FtbWExICA9ICgoZ2FtbWExeCA8PCAxNSkgfCAoZ2FtbWExeCA+Pj4gMTcpKSBeXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGdhbW1hMXggPDwgMTMpIHwgKGdhbW1hMXggPj4+IDE5KSkgXlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnYW1tYTF4ID4+PiAxMCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBXW2ldID0gZ2FtbWEwICsgV1tpIC0gN10gKyBnYW1tYTEgKyBXW2kgLSAxNl07XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIHZhciBjaCAgPSAoZSAmIGYpIF4gKH5lICYgZyk7XG5cdCAgICAgICAgICAgICAgICB2YXIgbWFqID0gKGEgJiBiKSBeIChhICYgYykgXiAoYiAmIGMpO1xuXG5cdCAgICAgICAgICAgICAgICB2YXIgc2lnbWEwID0gKChhIDw8IDMwKSB8IChhID4+PiAyKSkgXiAoKGEgPDwgMTkpIHwgKGEgPj4+IDEzKSkgXiAoKGEgPDwgMTApIHwgKGEgPj4+IDIyKSk7XG5cdCAgICAgICAgICAgICAgICB2YXIgc2lnbWExID0gKChlIDw8IDI2KSB8IChlID4+PiA2KSkgXiAoKGUgPDwgMjEpIHwgKGUgPj4+IDExKSkgXiAoKGUgPDwgNykgIHwgKGUgPj4+IDI1KSk7XG5cblx0ICAgICAgICAgICAgICAgIHZhciB0MSA9IGggKyBzaWdtYTEgKyBjaCArIEtbaV0gKyBXW2ldO1xuXHQgICAgICAgICAgICAgICAgdmFyIHQyID0gc2lnbWEwICsgbWFqO1xuXG5cdCAgICAgICAgICAgICAgICBoID0gZztcblx0ICAgICAgICAgICAgICAgIGcgPSBmO1xuXHQgICAgICAgICAgICAgICAgZiA9IGU7XG5cdCAgICAgICAgICAgICAgICBlID0gKGQgKyB0MSkgfCAwO1xuXHQgICAgICAgICAgICAgICAgZCA9IGM7XG5cdCAgICAgICAgICAgICAgICBjID0gYjtcblx0ICAgICAgICAgICAgICAgIGIgPSBhO1xuXHQgICAgICAgICAgICAgICAgYSA9ICh0MSArIHQyKSB8IDA7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBJbnRlcm1lZGlhdGUgaGFzaCB2YWx1ZVxuXHQgICAgICAgICAgICBIWzBdID0gKEhbMF0gKyBhKSB8IDA7XG5cdCAgICAgICAgICAgIEhbMV0gPSAoSFsxXSArIGIpIHwgMDtcblx0ICAgICAgICAgICAgSFsyXSA9IChIWzJdICsgYykgfCAwO1xuXHQgICAgICAgICAgICBIWzNdID0gKEhbM10gKyBkKSB8IDA7XG5cdCAgICAgICAgICAgIEhbNF0gPSAoSFs0XSArIGUpIHwgMDtcblx0ICAgICAgICAgICAgSFs1XSA9IChIWzVdICsgZikgfCAwO1xuXHQgICAgICAgICAgICBIWzZdID0gKEhbNl0gKyBnKSB8IDA7XG5cdCAgICAgICAgICAgIEhbN10gPSAoSFs3XSArIGgpIHwgMDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX2RvRmluYWxpemU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcblx0ICAgICAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG5cblx0ICAgICAgICAgICAgdmFyIG5CaXRzVG90YWwgPSB0aGlzLl9uRGF0YUJ5dGVzICogODtcblx0ICAgICAgICAgICAgdmFyIG5CaXRzTGVmdCA9IGRhdGEuc2lnQnl0ZXMgKiA4O1xuXG5cdCAgICAgICAgICAgIC8vIEFkZCBwYWRkaW5nXG5cdCAgICAgICAgICAgIGRhdGFXb3Jkc1tuQml0c0xlZnQgPj4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbkJpdHNMZWZ0ICUgMzIpO1xuXHQgICAgICAgICAgICBkYXRhV29yZHNbKCgobkJpdHNMZWZ0ICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IE1hdGguZmxvb3IobkJpdHNUb3RhbCAvIDB4MTAwMDAwMDAwKTtcblx0ICAgICAgICAgICAgZGF0YVdvcmRzWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNV0gPSBuQml0c1RvdGFsO1xuXHQgICAgICAgICAgICBkYXRhLnNpZ0J5dGVzID0gZGF0YVdvcmRzLmxlbmd0aCAqIDQ7XG5cblx0ICAgICAgICAgICAgLy8gSGFzaCBmaW5hbCBibG9ja3Ncblx0ICAgICAgICAgICAgdGhpcy5fcHJvY2VzcygpO1xuXG5cdCAgICAgICAgICAgIC8vIFJldHVybiBmaW5hbCBjb21wdXRlZCBoYXNoXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB2YXIgY2xvbmUgPSBIYXNoZXIuY2xvbmUuY2FsbCh0aGlzKTtcblx0ICAgICAgICAgICAgY2xvbmUuX2hhc2ggPSB0aGlzLl9oYXNoLmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH1cblx0ICAgIH0pO1xuXG5cdCAgICAvKipcblx0ICAgICAqIFNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBoYXNoZXIncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuXHQgICAgICpcblx0ICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIGhhc2guXG5cdCAgICAgKlxuXHQgICAgICogQHN0YXRpY1xuXHQgICAgICpcblx0ICAgICAqIEBleGFtcGxlXG5cdCAgICAgKlxuXHQgICAgICogICAgIHZhciBoYXNoID0gQ3J5cHRvSlMuU0hBMjU2KCdtZXNzYWdlJyk7XG5cdCAgICAgKiAgICAgdmFyIGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYod29yZEFycmF5KTtcblx0ICAgICAqL1xuXHQgICAgQy5TSEEyNTYgPSBIYXNoZXIuX2NyZWF0ZUhlbHBlcihTSEEyNTYpO1xuXG5cdCAgICAvKipcblx0ICAgICAqIFNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBITUFDJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gaGFzaC5cblx0ICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30ga2V5IFRoZSBzZWNyZXQga2V5LlxuXHQgICAgICpcblx0ICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIEhNQUMuXG5cdCAgICAgKlxuXHQgICAgICogQHN0YXRpY1xuXHQgICAgICpcblx0ICAgICAqIEBleGFtcGxlXG5cdCAgICAgKlxuXHQgICAgICogICAgIHZhciBobWFjID0gQ3J5cHRvSlMuSG1hY1NIQTI1NihtZXNzYWdlLCBrZXkpO1xuXHQgICAgICovXG5cdCAgICBDLkhtYWNTSEEyNTYgPSBIYXNoZXIuX2NyZWF0ZUhtYWNIZWxwZXIoU0hBMjU2KTtcblx0fShNYXRoKSk7XG5cblxuXHRyZXR1cm4gQ3J5cHRvSlMuU0hBMjU2O1xuXG59KSk7IiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvY3J5cHRvLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgSG1hY1NIQTI1NiA9IHJlcXVpcmUoMzgpO1xudmFyIEhleCA9IHJlcXVpcmUoMzcpLmVuYy5IZXg7XG5cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IGZ1bmN0aW9uICh0eXBlLCBrZXkpIHtcbiAgICBpZiAodHlwZSA9PT0gJ3NoYTI1NicpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgdmFyIHNoYTI1NkhtYWMgPSB7XG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBIbWFjU0hBMjU2KGRhdGEsIGtleSkudG9TdHJpbmcoSGV4KTtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlICovXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlnZXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2hhMjU2SG1hYztcbiAgICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvZXZlbnRzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKipcbiAqIEV2ZW50RW1pdHRlclxuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gICAgdGhpcy5fX2V2ZW50cyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCB2YXJfYXJncykge1xuICAgIHZhciBoYW5kbGVycyA9IHRoaXMuX19ldmVudHNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gaGFuZGxlcnNbaV07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgLy8gSUdOT1JFXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIGlmICghdGhpcy5fX2V2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMuX19ldmVudHNbZXZlbnROYW1lXSA9IFtsaXN0ZW5lcl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChsaXN0ZW5lcik7XG4gICAgfVxufTtcblxuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL3BhdGguanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1ID0gcmVxdWlyZSg0Nik7XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID0gL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG5cbmZ1bmN0aW9uIHNwbGl0UGF0aChmaWxlbmFtZSkge1xuICAgIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn1cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICAgIHZhciB1cCA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcblxuICAgICAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgdXArKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1cCkge1xuICAgICAgICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgdXAtLTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICAgICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9O1xuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUodS5maWx0ZXIocGF0aHMsIGZ1bmN0aW9uIChwLCBpbmRleCkge1xuICAgICAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwO1xuICAgIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgdmFyIGlzQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KHUuZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuICEhcDtcbiAgICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICAgIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgICAgICBwYXRoID0gJy4nO1xuICAgIH1cbiAgICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgICAgIHBhdGggKz0gJy8nO1xuICAgIH1cblxuICAgIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSBzcmMvdmVuZG9yL3EuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlLmFwcGx5KFByb21pc2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLnJlamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QuYXBwbHkoUHJvbWlzZSwgYXJndW1lbnRzKTtcbn07XG5cbmV4cG9ydHMuYWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbC5hcHBseShQcm9taXNlLCBhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5mY2FsbCA9IGZ1bmN0aW9uIChmbikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZm4oKSk7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXgpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuZGVmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlZmVycmVkID0ge307XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzb2x2ZS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZWplY3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgc3JjL3ZlbmRvci9xdWVyeXN0cmluZy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHUgPSByZXF1aXJlKDQ2KTtcblxuZnVuY3Rpb24gc3RyaW5naWZ5UHJpbWl0aXZlKHYpIHtcbiAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodikpIHtcbiAgICAgICAgcmV0dXJuICcnICsgdjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xufVxuXG5leHBvcnRzLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgICBzZXAgPSBzZXAgfHwgJyYnO1xuICAgIGVxID0gZXEgfHwgJz0nO1xuXG4gICAgdmFyIGVuY29kZSA9IGVuY29kZVVSSUNvbXBvbmVudDsgLy8gUXVlcnlTdHJpbmcuZXNjYXBlO1xuICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmVuY29kZVVSSUNvbXBvbmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbmNvZGUgPSBvcHRpb25zLmVuY29kZVVSSUNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAob2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBrZXlzID0gdS5rZXlzKG9iaik7XG4gICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGZsYXN0ID0gbGVuIC0gMTtcbiAgICAgICAgdmFyIGZpZWxkcyA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG4gICAgICAgICAgICB2YXIgdiA9IG9ialtrXTtcbiAgICAgICAgICAgIHZhciBrcyA9IGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG5cbiAgICAgICAgICAgIGlmICh1LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmxlbiA9IHYubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciB2bGFzdCA9IHZsZW4gLSAxO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmxlbjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBrcyArIGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUodltqXSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA8IHZsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZsZW4gJiYgaSA8IGZsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBzZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IGtzICsgZW5jb2RlKHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBmbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn07XG4iLCIvKipcbiAqIGFnIC0tbm8tZmlsZW5hbWUgLW8gJ1xcYih1XFwuLio/KVxcKCcgLiAgfCBzb3J0IHwgdW5pcSAtY1xuICpcbiAqIEBmaWxlIHZlbmRvci91bmRlcnNjb3JlLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoNSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoMTApO1xudmFyIGlzTnVtYmVyID0gcmVxdWlyZSgxMyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKDE0KTtcbnZhciBpc1N0cmluZyA9IHJlcXVpcmUoMTUpO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKHNvdXJjZSwgdmFyX2FyZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaWYgKGl0ZW0gJiYgaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIHZhciBvS2V5cyA9IGtleXMoaXRlbSk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9LZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IG9LZXlzW2pdO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgICAgICBzb3VyY2Vba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZTtcbn1cblxuZnVuY3Rpb24gbWFwKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdFtpXSA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZm9yZWFjaChhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbmQoYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWUsIGksIGFycmF5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXIoYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV07XG4gICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlLCBpLCBhcnJheSkpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBvbWl0KG9iamVjdCwgdmFyX2FyZ3MpIHtcbiAgICB2YXIgYXJncyA9IGlzQXJyYXkodmFyX2FyZ3MpXG4gICAgICAgID8gdmFyX2FyZ3NcbiAgICAgICAgOiBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICB2YXIgb0tleXMgPSBrZXlzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gb0tleXNbaV07XG4gICAgICAgIGlmIChhcmdzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwaWNrKG9iamVjdCwgdmFyX2FyZ3MsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICB2YXIgaTtcbiAgICB2YXIga2V5O1xuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHZhcl9hcmdzKSkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB2YXJfYXJncztcbiAgICAgICAgdmFyIG9LZXlzID0ga2V5cyhvYmplY3QpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb0tleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGtleSA9IG9LZXlzW2ldO1xuICAgICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgYXJncyA9IGlzQXJyYXkodmFyX2FyZ3MpXG4gICAgICAgICAgICA/IHZhcl9hcmdzXG4gICAgICAgICAgICA6IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAga2V5ID0gYXJnc1tpXTtcbiAgICAgICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gYmluZChmbiwgY29udGV4dCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgaGFzRG9udEVudW1CdWcgPSAhKHt0b1N0cmluZzogbnVsbH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpO1xudmFyIGRvbnRFbnVtcyA9IFsndG9TdHJpbmcnLCAndG9Mb2NhbGVTdHJpbmcnLCAndmFsdWVPZicsICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgJ2lzUHJvdG90eXBlT2YnLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnY29uc3RydWN0b3InXTtcblxuZnVuY3Rpb24ga2V5cyhvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHByb3A7XG4gICAgdmFyIGk7XG5cbiAgICBmb3IgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHByb3ApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkb250RW51bXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgZG9udEVudW1zW2ldKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRvbnRFbnVtc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnRzLmJpbmQgPSBiaW5kO1xuZXhwb3J0cy5lYWNoID0gZm9yZWFjaDtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuZXhwb3J0cy5maWx0ZXIgPSBmaWx0ZXI7XG5leHBvcnRzLmZpbmQgPSBmaW5kO1xuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5leHBvcnRzLm1hcCA9IG1hcDtcbmV4cG9ydHMub21pdCA9IG9taXQ7XG5leHBvcnRzLnBpY2sgPSBwaWNrO1xuZXhwb3J0cy5rZXlzID0ga2V5cztcbmV4cG9ydHMubm9vcCA9IG5vb3A7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL3V0aWwuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1ID0gcmVxdWlyZSg0Nik7XG5cbmV4cG9ydHMuaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgICB2YXIgc3ViQ2xhc3NQcm90byA9IHN1YkNsYXNzLnByb3RvdHlwZTtcbiAgICB2YXIgRiA9IG5ldyBGdW5jdGlvbigpO1xuICAgIEYucHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XG4gICAgc3ViQ2xhc3MucHJvdG90eXBlID0gbmV3IEYoKTtcbiAgICBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzcztcbiAgICB1LmV4dGVuZChzdWJDbGFzcy5wcm90b3R5cGUsIHN1YkNsYXNzUHJvdG8pO1xufTtcblxuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbiAoZikge1xuICAgIHZhciBhcmdMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gICAgaWYgKGFyZ0xlbiA9PT0gMSkge1xuICAgICAgICByZXR1cm4gZjtcbiAgICB9XG5cbiAgICB2YXIgc3RyID0gJyc7XG4gICAgdmFyIGEgPSAxO1xuICAgIHZhciBsYXN0UG9zID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGYubGVuZ3RoOykge1xuICAgICAgICBpZiAoZi5jaGFyQ29kZUF0KGkpID09PSAzNyAvKiogJyUnICovICYmIGkgKyAxIDwgZi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZi5jaGFyQ29kZUF0KGkgKyAxKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTAwOiAvLyAnZCdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPj0gYXJnTGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gTnVtYmVyKGFyZ3VtZW50c1thKytdKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBvcyA9IGkgPSBpICsgMjtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSAxMTU6IC8vICdzJ1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA+PSBhcmdMZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBTdHJpbmcoYXJndW1lbnRzW2ErK10pO1xuICAgICAgICAgICAgICAgICAgICBsYXN0UG9zID0gaSA9IGkgKyAyO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDM3OiAvLyAnJSdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSAnJSc7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RQb3MgPSBpID0gaSArIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgKytpO1xuICAgIH1cblxuICAgIGlmIChsYXN0UG9zID09PSAwKSB7XG4gICAgICAgIHN0ciA9IGY7XG4gICAgfVxuICAgIGVsc2UgaWYgKGxhc3RQb3MgPCBmLmxlbmd0aCkge1xuICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyO1xufTtcbiJdfQ==
