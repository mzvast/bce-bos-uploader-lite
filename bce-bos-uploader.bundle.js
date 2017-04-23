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

var Q = require(45);
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










},{"16":16,"18":18,"33":33,"34":34,"45":45}],2:[function(require,module,exports){
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

var util = require(48);
var u = require(47);
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
    var crypto = require(42);
    var sha256Hmac = crypto.createHmac('sha256', key);
    sha256Hmac.update(data);
    return sha256Hmac.digest('hex');
};

module.exports = Auth;


},{"20":20,"23":23,"42":42,"47":47,"48":48}],17:[function(require,module,exports){
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

var EventEmitter = require(43).EventEmitter;
var util = require(48);
var Q = require(45);
var u = require(47);
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


},{"16":16,"19":19,"43":43,"45":45,"47":47,"48":48}],18:[function(require,module,exports){
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

var path = require(44);
var util = require(48);
var u = require(47);
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

},{"17":17,"20":20,"21":21,"22":22,"23":23,"35":35,"44":44,"47":47,"48":48}],19:[function(require,module,exports){
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

var EventEmitter = require(43).EventEmitter;
var Buffer = require(35);
var Q = require(45);
var u = require(47);
var util = require(48);
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
    var urlEncodeStr = require(46).stringify(params);
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


},{"20":20,"35":35,"43":43,"45":45,"46":46,"47":47,"48":48}],22:[function(require,module,exports){
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

var Q = require(45);
var async = require(37);
var u = require(47);
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

},{"25":25,"31":31,"34":34,"37":37,"45":45,"47":47}],27:[function(require,module,exports){
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

var Q = require(45);
var u = require(47);
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

},{"25":25,"31":31,"34":34,"45":45,"47":47}],29:[function(require,module,exports){
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

var Q = require(45);
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

},{"34":34,"45":45}],31:[function(require,module,exports){
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

var Q = require(45);
var u = require(47);
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

},{"16":16,"18":18,"24":24,"25":25,"26":26,"27":27,"28":28,"30":30,"32":32,"34":34,"45":45,"47":47}],34:[function(require,module,exports){
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

var qsModule = require(46);
var Q = require(45);
var u = require(47);
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

},{"22":22,"29":29,"45":45,"46":46,"47":47}],35:[function(require,module,exports){
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
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],37:[function(require,module,exports){
/**
 * @file vendor/async.js
 * @author leeight
 */

exports.mapLimit = require(2);

},{"2":2}],38:[function(require,module,exports){
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
},{}],39:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require(38), require(41), require(40));
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
},{"38":38,"40":40,"41":41}],40:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require(38));
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
},{"38":38}],41:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require(38));
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
},{"38":38}],42:[function(require,module,exports){
/**
 * @file vendor/crypto.js
 * @author leeight
 */

var HmacSHA256 = require(39);
var Hex = require(38).enc.Hex;

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










},{"38":38,"39":39}],43:[function(require,module,exports){
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


},{}],44:[function(require,module,exports){
/**
 * @file vendor/path.js
 * @author leeight
 */

var u = require(47);

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










},{"47":47}],45:[function(require,module,exports){
/**
 * @file src/vendor/q.js
 * @author leeight
 */
var Promise = require(36);

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











},{"36":36}],46:[function(require,module,exports){
/**
 * @file src/vendor/querystring.js
 * @author leeight
 */

var u = require(47);

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

},{"47":47}],47:[function(require,module,exports){
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














},{"10":10,"13":13,"14":14,"15":15,"5":5}],48:[function(require,module,exports){
/**
 * @file vendor/util.js
 * @author leeight
 */

var u = require(47);

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

},{"47":47}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy5tYXBsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmRvcGFyYWxsZWxsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmVhY2hvZmxpbWl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwuaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmlzYXJyYXlsaWtlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwua2V5aXRlcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwubWFwYXN5bmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5ub29wL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwub25jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLm9ubHlvbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc251bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzc3RyaW5nL2luZGV4LmpzIiwic3JjL2JjZS1zZGstanMvYXV0aC5qcyIsInNyYy9iY2Utc2RrLWpzL2JjZV9iYXNlX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL2Jvc19jbGllbnQuanMiLCJzcmMvYmNlLXNkay1qcy9jb25maWcuanMiLCJzcmMvYmNlLXNkay1qcy9oZWFkZXJzLmpzIiwic3JjL2JjZS1zZGstanMvaHR0cF9jbGllbnQuanMiLCJzcmMvYmNlLXNkay1qcy9taW1lLnR5cGVzLmpzIiwic3JjL2JjZS1zZGstanMvc3RyaW5ncy5qcyIsInNyYy9jb25maWcuanMiLCJzcmMvZXZlbnRzLmpzIiwic3JjL211bHRpcGFydF90YXNrLmpzIiwic3JjL25ldHdvcmtfaW5mby5qcyIsInNyYy9wdXRfb2JqZWN0X3Rhc2suanMiLCJzcmMvcXVldWUuanMiLCJzcmMvc3RzX3Rva2VuX21hbmFnZXIuanMiLCJzcmMvdGFzay5qcyIsInNyYy90cmFja2VyLmpzIiwic3JjL3VwbG9hZGVyLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlbmRvci9CdWZmZXIuanMiLCJzcmMvdmVuZG9yL1Byb21pc2UuanMiLCJzcmMvdmVuZG9yL2FzeW5jLmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvY29yZS5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL2htYWMtc2hhMjU2LmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvaG1hYy5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL3NoYTI1Ni5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLmpzIiwic3JjL3ZlbmRvci9ldmVudHMuanMiLCJzcmMvdmVuZG9yL3BhdGguanMiLCJzcmMvdmVuZG9yL3EuanMiLCJzcmMvdmVuZG9yL3F1ZXJ5c3RyaW5nLmpzIiwic3JjL3ZlbmRvci91bmRlcnNjb3JlLmpzIiwic3JjL3ZlbmRvci91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdnZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgYmNlLWJvcy11cGxvYWRlci9pbmRleC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ1KTtcbnZhciBCb3NDbGllbnQgPSByZXF1aXJlKDE4KTtcbnZhciBBdXRoID0gcmVxdWlyZSgxNik7XG5cbnZhciBVcGxvYWRlciA9IHJlcXVpcmUoMzMpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzNCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGJvczoge1xuICAgICAgICBVcGxvYWRlcjogVXBsb2FkZXJcbiAgICB9LFxuICAgIHV0aWxzOiB1dGlscyxcbiAgICBzZGs6IHtcbiAgICAgICAgUTogUSxcbiAgICAgICAgQm9zQ2xpZW50OiBCb3NDbGllbnQsXG4gICAgICAgIEF1dGg6IEF1dGhcbiAgICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIG1hcEFzeW5jID0gcmVxdWlyZSg5KTtcbnZhciBkb1BhcmFsbGVsTGltaXQgPSByZXF1aXJlKDMpO1xubW9kdWxlLmV4cG9ydHMgPSBkb1BhcmFsbGVsTGltaXQobWFwQXN5bmMpO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVhY2hPZkxpbWl0ID0gcmVxdWlyZSg0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkb1BhcmFsbGVsTGltaXQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBsaW1pdCwgaXRlcmF0b3IsIGNiKSB7XG4gICAgICAgIHJldHVybiBmbihlYWNoT2ZMaW1pdChsaW1pdCksIG9iaiwgaXRlcmF0b3IsIGNiKTtcbiAgICB9O1xufTtcbiIsInZhciBvbmNlID0gcmVxdWlyZSgxMSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoMTApO1xudmFyIG9ubHlPbmNlID0gcmVxdWlyZSgxMik7XG52YXIga2V5SXRlcmF0b3IgPSByZXF1aXJlKDcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVhY2hPZkxpbWl0KGxpbWl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNiKSB7XG4gICAgICAgIGNiID0gb25jZShjYiB8fCBub29wKTtcbiAgICAgICAgb2JqID0gb2JqIHx8IFtdO1xuICAgICAgICB2YXIgbmV4dEtleSA9IGtleUl0ZXJhdG9yKG9iaik7XG4gICAgICAgIGlmIChsaW1pdCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIHJ1bm5pbmcgPSAwO1xuICAgICAgICB2YXIgZXJyb3JlZCA9IGZhbHNlO1xuXG4gICAgICAgIChmdW5jdGlvbiByZXBsZW5pc2goKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSAmJiBydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChydW5uaW5nIDwgbGltaXQgJiYgIWVycm9yZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gbmV4dEtleSgpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcnVubmluZyArPSAxO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yKG9ialtrZXldLCBrZXksIG9ubHlPbmNlKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxlbmlzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoNSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcnJheUxpa2UoYXJyKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkoYXJyKSB8fCAoXG4gICAgICAgIC8vIGhhcyBhIHBvc2l0aXZlIGludGVnZXIgbGVuZ3RoIHByb3BlcnR5XG4gICAgICAgIHR5cGVvZiBhcnIubGVuZ3RoID09PSAnbnVtYmVyJyAmJlxuICAgICAgICBhcnIubGVuZ3RoID49IDAgJiZcbiAgICAgICAgYXJyLmxlbmd0aCAlIDEgPT09IDBcbiAgICApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9rZXlzID0gcmVxdWlyZSg4KTtcbnZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoNik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5SXRlcmF0b3IoY29sbCkge1xuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGxlbjtcbiAgICB2YXIga2V5cztcbiAgICBpZiAoaXNBcnJheUxpa2UoY29sbCkpIHtcbiAgICAgICAgbGVuID0gY29sbC5sZW5ndGg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBpIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXlzID0gX2tleXMoY29sbCk7XG4gICAgICAgIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIHJldHVybiBpIDwgbGVuID8ga2V5c1tpXSA6IG51bGw7XG4gICAgICAgIH07XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIHZhciBfa2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIF9rZXlzLnB1c2goayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9rZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9uY2UgPSByZXF1aXJlKDExKTtcbnZhciBub29wID0gcmVxdWlyZSgxMCk7XG52YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKDYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcEFzeW5jKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2IpIHtcbiAgICBjYiA9IG9uY2UoY2IgfHwgbm9vcCk7XG4gICAgYXJyID0gYXJyIHx8IFtdO1xuICAgIHZhciByZXN1bHRzID0gaXNBcnJheUxpa2UoYXJyKSA/IFtdIDoge307XG4gICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgY2IpIHtcbiAgICAgICAgaXRlcmF0b3IodmFsdWUsIGZ1bmN0aW9uIChlcnIsIHYpIHtcbiAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdjtcbiAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2IoZXJyLCByZXN1bHRzKTtcbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9vcCAoKSB7fTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZm4gPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9ubHlfb25jZShmbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZuID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxiYWNrIHdhcyBhbHJlYWR5IGNhbGxlZC4nKTtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgIH07XG59O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTYgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE51bWJlcmAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVG8gZXhjbHVkZSBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYW5kIGBOYU5gLCB3aGljaCBhcmUgY2xhc3NpZmllZFxuICogYXMgbnVtYmVycywgdXNlIHRoZSBgXy5pc0Zpbml0ZWAgbWV0aG9kLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTnVtYmVyKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcignMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IG51bWJlclRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOdW1iZXI7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBsb2Rhc2ggNC4wLjEgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTYgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHR5cGUgRnVuY3Rpb25cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN0cmluZ2AgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N0cmluZygnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N0cmluZygxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHxcbiAgICAoIWlzQXJyYXkodmFsdWUpICYmIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3RyaW5nVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmluZztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2F1dGguanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuLyogZXNsaW50IG1heC1wYXJhbXM6WzAsMTBdICovXG5cbnZhciB1dGlsID0gcmVxdWlyZSg0OCk7XG52YXIgdSA9IHJlcXVpcmUoNDcpO1xudmFyIEggPSByZXF1aXJlKDIwKTtcbnZhciBzdHJpbmdzID0gcmVxdWlyZSgyMyk7XG5cbi8qKlxuICogQXV0aFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IGFrIFRoZSBhY2Nlc3Mga2V5LlxuICogQHBhcmFtIHtzdHJpbmd9IHNrIFRoZSBzZWN1cml0eSBrZXkuXG4gKi9cbmZ1bmN0aW9uIEF1dGgoYWssIHNrKSB7XG4gICAgdGhpcy5hayA9IGFrO1xuICAgIHRoaXMuc2sgPSBzaztcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgc2lnbmF0dXJlIGJhc2VkIG9uIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0F1dGhlbnRpY2F0aW9uTWVjaGFuaXNtXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBUaGUgaHR0cCByZXF1ZXN0IG1ldGhvZCwgc3VjaCBhcyBHRVQsIFBPU1QsIERFTEVURSwgUFVULCAuLi5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZXNvdXJjZSBUaGUgcmVxdWVzdCBwYXRoLlxuICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgVGhlIHF1ZXJ5IHN0cmluZ3MuXG4gKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgVGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICogQHBhcmFtIHtudW1iZXI9fSB0aW1lc3RhbXAgU2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcC5cbiAqIEBwYXJhbSB7bnVtYmVyPX0gZXhwaXJhdGlvbkluU2Vjb25kcyBUaGUgc2lnbmF0dXJlIHZhbGlkYXRpb24gdGltZS5cbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz49fSBoZWFkZXJzVG9TaWduIFRoZSByZXF1ZXN0IGhlYWRlcnMgbGlzdCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gY2FsY3VhbGF0ZSB0aGUgc2lnbmF0dXJlLlxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHNpZ25hdHVyZS5cbiAqL1xuQXV0aC5wcm90b3R5cGUuZ2VuZXJhdGVBdXRob3JpemF0aW9uID0gZnVuY3Rpb24gKG1ldGhvZCwgcmVzb3VyY2UsIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLCB0aW1lc3RhbXAsIGV4cGlyYXRpb25JblNlY29uZHMsIGhlYWRlcnNUb1NpZ24pIHtcblxuICAgIHZhciBub3cgPSB0aW1lc3RhbXAgPyBuZXcgRGF0ZSh0aW1lc3RhbXAgKiAxMDAwKSA6IG5ldyBEYXRlKCk7XG4gICAgdmFyIHJhd1Nlc3Npb25LZXkgPSB1dGlsLmZvcm1hdCgnYmNlLWF1dGgtdjEvJXMvJXMvJWQnLFxuICAgICAgICB0aGlzLmFrLCBub3cudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9cXC5cXGQrWiQvLCAnWicpLCBleHBpcmF0aW9uSW5TZWNvbmRzIHx8IDE4MDApO1xuICAgIHZhciBzZXNzaW9uS2V5ID0gdGhpcy5oYXNoKHJhd1Nlc3Npb25LZXksIHRoaXMuc2spO1xuXG4gICAgdmFyIGNhbm9uaWNhbFVyaSA9IHRoaXMudXJpQ2Fub25pY2FsaXphdGlvbihyZXNvdXJjZSk7XG4gICAgdmFyIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gdGhpcy5xdWVyeVN0cmluZ0Nhbm9uaWNhbGl6YXRpb24ocGFyYW1zIHx8IHt9KTtcblxuICAgIHZhciBydiA9IHRoaXMuaGVhZGVyc0Nhbm9uaWNhbGl6YXRpb24oaGVhZGVycyB8fCB7fSwgaGVhZGVyc1RvU2lnbik7XG4gICAgdmFyIGNhbm9uaWNhbEhlYWRlcnMgPSBydlswXTtcbiAgICB2YXIgc2lnbmVkSGVhZGVycyA9IHJ2WzFdO1xuXG4gICAgdmFyIHJhd1NpZ25hdHVyZSA9IHV0aWwuZm9ybWF0KCclc1xcbiVzXFxuJXNcXG4lcycsXG4gICAgICAgIG1ldGhvZCwgY2Fub25pY2FsVXJpLCBjYW5vbmljYWxRdWVyeVN0cmluZywgY2Fub25pY2FsSGVhZGVycyk7XG4gICAgdmFyIHNpZ25hdHVyZSA9IHRoaXMuaGFzaChyYXdTaWduYXR1cmUsIHNlc3Npb25LZXkpO1xuXG4gICAgaWYgKHNpZ25lZEhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXMvJXMvJXMnLCByYXdTZXNzaW9uS2V5LCBzaWduZWRIZWFkZXJzLmpvaW4oJzsnKSwgc2lnbmF0dXJlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzLy8lcycsIHJhd1Nlc3Npb25LZXksIHNpZ25hdHVyZSk7XG59O1xuXG5BdXRoLnByb3RvdHlwZS51cmlDYW5vbmljYWxpemF0aW9uID0gZnVuY3Rpb24gKHVyaSkge1xuICAgIHJldHVybiB1cmk7XG59O1xuXG4vKipcbiAqIENhbm9uaWNhbCB0aGUgcXVlcnkgc3RyaW5ncy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0F1dGhlbnRpY2F0aW9uTWVjaGFuaXNtI+eUn+aIkENhbm9uaWNhbFF1ZXJ5U3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFRoZSBxdWVyeSBzdHJpbmdzLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5BdXRoLnByb3RvdHlwZS5xdWVyeVN0cmluZ0Nhbm9uaWNhbGl6YXRpb24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gW107XG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSBILkFVVEhPUklaQVRJT04udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1zW2tleV0gPT0gbnVsbCA/ICcnIDogcGFyYW1zW2tleV07XG4gICAgICAgIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLnB1c2goa2V5ICsgJz0nICsgc3RyaW5ncy5ub3JtYWxpemUodmFsdWUpKTtcbiAgICB9KTtcblxuICAgIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLnNvcnQoKTtcblxuICAgIHJldHVybiBjYW5vbmljYWxRdWVyeVN0cmluZy5qb2luKCcmJyk7XG59O1xuXG4vKipcbiAqIENhbm9uaWNhbCB0aGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKlxuICogQHNlZSBodHRwOi8vZ29sbHVtLmJhaWR1LmNvbS9BdXRoZW50aWNhdGlvbk1lY2hhbmlzbSPnlJ/miJBDYW5vbmljYWxIZWFkZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVycyBUaGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+PX0gaGVhZGVyc1RvU2lnbiBUaGUgcmVxdWVzdCBoZWFkZXJzIGxpc3Qgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGNhbGN1YWxhdGUgdGhlIHNpZ25hdHVyZS5cbiAqIEByZXR1cm4geyp9IGNhbm9uaWNhbEhlYWRlcnMgYW5kIHNpZ25lZEhlYWRlcnNcbiAqL1xuQXV0aC5wcm90b3R5cGUuaGVhZGVyc0Nhbm9uaWNhbGl6YXRpb24gPSBmdW5jdGlvbiAoaGVhZGVycywgaGVhZGVyc1RvU2lnbikge1xuICAgIGlmICghaGVhZGVyc1RvU2lnbiB8fCAhaGVhZGVyc1RvU2lnbi5sZW5ndGgpIHtcbiAgICAgICAgaGVhZGVyc1RvU2lnbiA9IFtILkhPU1QsIEguQ09OVEVOVF9NRDUsIEguQ09OVEVOVF9MRU5HVEgsIEguQ09OVEVOVF9UWVBFXTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZGVyc01hcCA9IHt9O1xuICAgIGhlYWRlcnNUb1NpZ24uZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBoZWFkZXJzTWFwW2l0ZW0udG9Mb3dlckNhc2UoKV0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgdmFyIGNhbm9uaWNhbEhlYWRlcnMgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaGVhZGVyc1trZXldO1xuICAgICAgICB2YWx1ZSA9IHUuaXNTdHJpbmcodmFsdWUpID8gc3RyaW5ncy50cmltKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKC9eeFxcLWJjZVxcLS8udGVzdChrZXkpIHx8IGhlYWRlcnNNYXBba2V5XSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY2Fub25pY2FsSGVhZGVycy5wdXNoKHV0aWwuZm9ybWF0KCclczolcycsXG4gICAgICAgICAgICAgICAgLy8gZW5jb2RlVVJJQ29tcG9uZW50KGtleSksIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpKTtcbiAgICAgICAgICAgICAgICBzdHJpbmdzLm5vcm1hbGl6ZShrZXkpLCBzdHJpbmdzLm5vcm1hbGl6ZSh2YWx1ZSkpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2Fub25pY2FsSGVhZGVycy5zb3J0KCk7XG5cbiAgICB2YXIgc2lnbmVkSGVhZGVycyA9IFtdO1xuICAgIGNhbm9uaWNhbEhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBzaWduZWRIZWFkZXJzLnB1c2goaXRlbS5zcGxpdCgnOicpWzBdKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBbY2Fub25pY2FsSGVhZGVycy5qb2luKCdcXG4nKSwgc2lnbmVkSGVhZGVyc107XG59O1xuXG5BdXRoLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKGRhdGEsIGtleSkge1xuICAgIHZhciBjcnlwdG8gPSByZXF1aXJlKDQyKTtcbiAgICB2YXIgc2hhMjU2SG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKCdzaGEyNTYnLCBrZXkpO1xuICAgIHNoYTI1NkhtYWMudXBkYXRlKGRhdGEpO1xuICAgIHJldHVybiBzaGEyNTZIbWFjLmRpZ2VzdCgnaGV4Jyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGg7XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2JjZV9iYXNlX2NsaWVudC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKDQzKS5FdmVudEVtaXR0ZXI7XG52YXIgdXRpbCA9IHJlcXVpcmUoNDgpO1xudmFyIFEgPSByZXF1aXJlKDQ1KTtcbnZhciB1ID0gcmVxdWlyZSg0Nyk7XG52YXIgY29uZmlnID0gcmVxdWlyZSgxOSk7XG52YXIgQXV0aCA9IHJlcXVpcmUoMTYpO1xuXG4vKipcbiAqIEJjZUJhc2VDbGllbnRcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjbGllbnRDb25maWcgVGhlIGJjZSBjbGllbnQgY29uZmlndXJhdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXJ2aWNlSWQgVGhlIHNlcnZpY2UgaWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSByZWdpb25TdXBwb3J0ZWQgVGhlIHNlcnZpY2Ugc3VwcG9ydGVkIHJlZ2lvbiBvciBub3QuXG4gKi9cbmZ1bmN0aW9uIEJjZUJhc2VDbGllbnQoY2xpZW50Q29uZmlnLCBzZXJ2aWNlSWQsIHJlZ2lvblN1cHBvcnRlZCkge1xuICAgIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5jb25maWcgPSB1LmV4dGVuZCh7fSwgY29uZmlnLkRFRkFVTFRfQ09ORklHLCBjbGllbnRDb25maWcpO1xuICAgIHRoaXMuc2VydmljZUlkID0gc2VydmljZUlkO1xuICAgIHRoaXMucmVnaW9uU3VwcG9ydGVkID0gISFyZWdpb25TdXBwb3J0ZWQ7XG5cbiAgICB0aGlzLmNvbmZpZy5lbmRwb2ludCA9IHRoaXMuX2NvbXB1dGVFbmRwb2ludCgpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0h0dHBDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5faHR0cEFnZW50ID0gbnVsbDtcbn1cbnV0aWwuaW5oZXJpdHMoQmNlQmFzZUNsaWVudCwgRXZlbnRFbWl0dGVyKTtcblxuQmNlQmFzZUNsaWVudC5wcm90b3R5cGUuX2NvbXB1dGVFbmRwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5jb25maWcuZW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmVuZHBvaW50O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZ2lvblN1cHBvcnRlZCkge1xuICAgICAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzOi8vJXMuJXMuJXMnLFxuICAgICAgICAgICAgdGhpcy5jb25maWcucHJvdG9jb2wsXG4gICAgICAgICAgICB0aGlzLnNlcnZpY2VJZCxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnJlZ2lvbixcbiAgICAgICAgICAgIGNvbmZpZy5ERUZBVUxUX1NFUlZJQ0VfRE9NQUlOKTtcbiAgICB9XG4gICAgcmV0dXJuIHV0aWwuZm9ybWF0KCclczovLyVzLiVzJyxcbiAgICAgICAgdGhpcy5jb25maWcucHJvdG9jb2wsXG4gICAgICAgIHRoaXMuc2VydmljZUlkLFxuICAgICAgICBjb25maWcuREVGQVVMVF9TRVJWSUNFX0RPTUFJTik7XG59O1xuXG5CY2VCYXNlQ2xpZW50LnByb3RvdHlwZS5jcmVhdGVTaWduYXR1cmUgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMsIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycykge1xuICAgIHJldHVybiBRLmZjYWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGF1dGggPSBuZXcgQXV0aChjcmVkZW50aWFscy5haywgY3JlZGVudGlhbHMuc2spO1xuICAgICAgICByZXR1cm4gYXV0aC5nZW5lcmF0ZUF1dGhvcml6YXRpb24oaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmNlQmFzZUNsaWVudDtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYm9zX2NsaWVudC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG4vKiBlc2xpbnQgbWF4LXBhcmFtczpbMCwxMF0gKi9cblxudmFyIHBhdGggPSByZXF1aXJlKDQ0KTtcbnZhciB1dGlsID0gcmVxdWlyZSg0OCk7XG52YXIgdSA9IHJlcXVpcmUoNDcpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoMzUpO1xudmFyIEggPSByZXF1aXJlKDIwKTtcbnZhciBzdHJpbmdzID0gcmVxdWlyZSgyMyk7XG52YXIgSHR0cENsaWVudCA9IHJlcXVpcmUoMjEpO1xudmFyIEJjZUJhc2VDbGllbnQgPSByZXF1aXJlKDE3KTtcbnZhciBNaW1lVHlwZSA9IHJlcXVpcmUoMjIpO1xuXG52YXIgTUFYX1BVVF9PQkpFQ1RfTEVOR1RIID0gNTM2ODcwOTEyMDsgICAgIC8vIDVHXG52YXIgTUFYX1VTRVJfTUVUQURBVEFfU0laRSA9IDIwNDg7ICAgICAgICAgIC8vIDIgKiAxMDI0XG5cbi8qKlxuICogQk9TIHNlcnZpY2UgYXBpXG4gKlxuICogQHNlZSBodHRwOi8vZ29sbHVtLmJhaWR1LmNvbS9CT1NfQVBJI0JPUy1BUEnmlofmoaNcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGJvcyBjbGllbnQgY29uZmlndXJhdGlvbi5cbiAqIEBleHRlbmRzIHtCY2VCYXNlQ2xpZW50fVxuICovXG5mdW5jdGlvbiBCb3NDbGllbnQoY29uZmlnKSB7XG4gICAgQmNlQmFzZUNsaWVudC5jYWxsKHRoaXMsIGNvbmZpZywgJ2JvcycsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0h0dHBDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5faHR0cEFnZW50ID0gbnVsbDtcbn1cbnV0aWwuaW5oZXJpdHMoQm9zQ2xpZW50LCBCY2VCYXNlQ2xpZW50KTtcblxuLy8gLS0tIEIgRSBHIEkgTiAtLS1cbkJvc0NsaWVudC5wcm90b3R5cGUuZGVsZXRlT2JqZWN0ID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0RFTEVURScsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUucHV0T2JqZWN0ID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgZGF0YSwgb3B0aW9ucykge1xuICAgIGlmICgha2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2tleSBzaG91bGQgbm90IGJlIGVtcHR5LicpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUFVUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgYm9keTogZGF0YSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnB1dE9iamVjdEZyb21CbG9iID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0ge307XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQmxvYi9zaXplXG4gICAgaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IGJsb2Iuc2l6ZTtcbiAgICAvLyDlr7nkuo7mtY/op4jlmajosIPnlKhBUEnnmoTml7blgJnvvIzpu5jorqTkuI3mt7vliqAgSC5DT05URU5UX01ENSDlrZfmrrXvvIzlm6DkuLrorqHnrpfotbfmnaXmr5TovoPmhaJcbiAgICAvLyDogIzkuJTmoLnmja4gQVBJIOaWh+aho++8jOi/meS4quWtl+auteS4jeaYr+W/heWhq+eahOOAglxuICAgIG9wdGlvbnMgPSB1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzLnB1dE9iamVjdChidWNrZXROYW1lLCBrZXksIGJsb2IsIG9wdGlvbnMpO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5nZXRPYmplY3RNZXRhZGF0YSA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdIRUFEJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5pbml0aWF0ZU11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSBvcHRpb25zW0guQ09OVEVOVF9UWVBFXSB8fCBNaW1lVHlwZS5ndWVzcyhwYXRoLmV4dG5hbWUoa2V5KSk7XG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BPU1QnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwYXJhbXM6IHt1cGxvYWRzOiAnJ30sXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuYWJvcnRNdWx0aXBhcnRVcGxvYWQgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0RFTEVURScsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHBhcmFtczoge3VwbG9hZElkOiB1cGxvYWRJZH0sXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuY29tcGxldGVNdWx0aXBhcnRVcGxvYWQgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgcGFydExpc3QsIG9wdGlvbnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IHt9O1xuICAgIGhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnO1xuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnModS5leHRlbmQoaGVhZGVycywgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BPU1QnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7cGFydHM6IHBhcnRMaXN0fSksXG4gICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgcGFyYW1zOiB7dXBsb2FkSWQ6IHVwbG9hZElkfSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS51cGxvYWRQYXJ0RnJvbUJsb2IgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgcGFydE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRTaXplLCBibG9iLCBvcHRpb25zKSB7XG4gICAgaWYgKGJsb2Iuc2l6ZSAhPT0gcGFydFNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcih1dGlsLmZvcm1hdCgnSW52YWxpZCBwYXJ0U2l6ZSAlZCBhbmQgZGF0YSBsZW5ndGggJWQnLFxuICAgICAgICAgICAgcGFydFNpemUsIGJsb2Iuc2l6ZSkpO1xuICAgIH1cblxuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IHBhcnRTaXplO1xuICAgIGhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG5cbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpKTtcbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUFVUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgYm9keTogYmxvYixcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIHBhcnROdW1iZXI6IHBhcnROdW1iZXIsXG4gICAgICAgICAgICB1cGxvYWRJZDogdXBsb2FkSWRcbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5saXN0UGFydHMgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgb3B0aW9ucykge1xuICAgIC8qZXNsaW50LWRpc2FibGUqL1xuICAgIGlmICghdXBsb2FkSWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndXBsb2FkSWQgc2hvdWxkIG5vdCBlbXB0eScpO1xuICAgIH1cbiAgICAvKmVzbGludC1lbmFibGUqL1xuXG4gICAgdmFyIGFsbG93ZWRQYXJhbXMgPSBbJ21heFBhcnRzJywgJ3BhcnROdW1iZXJNYXJrZXInLCAndXBsb2FkSWQnXTtcbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKG9wdGlvbnMgfHwge30sIGFsbG93ZWRQYXJhbXMpO1xuICAgIG9wdGlvbnMucGFyYW1zLnVwbG9hZElkID0gdXBsb2FkSWQ7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnR0VUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgcGFyYW1zOiBvcHRpb25zLnBhcmFtcyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5saXN0TXVsdGlwYXJ0VXBsb2FkcyA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIGFsbG93ZWRQYXJhbXMgPSBbJ2RlbGltaXRlcicsICdtYXhVcGxvYWRzJywgJ2tleU1hcmtlcicsICdwcmVmaXgnLCAndXBsb2FkcyddO1xuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9LCBhbGxvd2VkUGFyYW1zKTtcbiAgICBvcHRpb25zLnBhcmFtcy51cGxvYWRzID0gJyc7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnR0VUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBwYXJhbXM6IG9wdGlvbnMucGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmFwcGVuZE9iamVjdCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIGRhdGEsIG9mZnNldCwgb3B0aW9ucykge1xuICAgIGlmICgha2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2tleSBzaG91bGQgbm90IGJlIGVtcHR5LicpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSk7XG4gICAgdmFyIHBhcmFtcyA9IHthcHBlbmQ6ICcnfTtcbiAgICBpZiAodS5pc051bWJlcihvZmZzZXQpKSB7XG4gICAgICAgIHBhcmFtcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQT1NUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgYm9keTogZGF0YSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5hcHBlbmRPYmplY3RGcm9tQmxvYiA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIGJsb2IsIG9mZnNldCwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0ge307XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQmxvYi9zaXplXG4gICAgaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IGJsb2Iuc2l6ZTtcbiAgICAvLyDlr7nkuo7mtY/op4jlmajosIPnlKhBUEnnmoTml7blgJnvvIzpu5jorqTkuI3mt7vliqAgSC5DT05URU5UX01ENSDlrZfmrrXvvIzlm6DkuLrorqHnrpfotbfmnaXmr5TovoPmhaJcbiAgICAvLyDogIzkuJTmoLnmja4gQVBJIOaWh+aho++8jOi/meS4quWtl+auteS4jeaYr+W/heWhq+eahOOAglxuICAgIG9wdGlvbnMgPSB1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZE9iamVjdChidWNrZXROYW1lLCBrZXksIGJsb2IsIG9mZnNldCwgb3B0aW9ucyk7XG59O1xuXG4vLyAtLS0gRSBOIEQgLS0tXG5cbkJvc0NsaWVudC5wcm90b3R5cGUuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgdmFyQXJncykge1xuICAgIHZhciBkZWZhdWx0QXJncyA9IHtcbiAgICAgICAgYnVja2V0TmFtZTogbnVsbCxcbiAgICAgICAga2V5OiBudWxsLFxuICAgICAgICBib2R5OiBudWxsLFxuICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgcGFyYW1zOiB7fSxcbiAgICAgICAgY29uZmlnOiB7fSxcbiAgICAgICAgb3V0cHV0U3RyZWFtOiBudWxsXG4gICAgfTtcbiAgICB2YXIgYXJncyA9IHUuZXh0ZW5kKGRlZmF1bHRBcmdzLCB2YXJBcmdzKTtcblxuICAgIHZhciBjb25maWcgPSB1LmV4dGVuZCh7fSwgdGhpcy5jb25maWcsIGFyZ3MuY29uZmlnKTtcbiAgICB2YXIgcmVzb3VyY2UgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oXG4gICAgICAgICcvdjEnLFxuICAgICAgICBzdHJpbmdzLm5vcm1hbGl6ZShhcmdzLmJ1Y2tldE5hbWUgfHwgJycpLFxuICAgICAgICBzdHJpbmdzLm5vcm1hbGl6ZShhcmdzLmtleSB8fCAnJywgZmFsc2UpXG4gICAgKSkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgaWYgKGNvbmZpZy5zZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgYXJncy5oZWFkZXJzW0guU0VTU0lPTl9UT0tFTl0gPSBjb25maWcuc2Vzc2lvblRva2VuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbmRIVFRQUmVxdWVzdChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncywgY29uZmlnKTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuc2VuZEhUVFBSZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLCBjb25maWcpIHtcbiAgICB2YXIgY2xpZW50ID0gdGhpcztcbiAgICB2YXIgYWdlbnQgPSB0aGlzLl9odHRwQWdlbnQgPSBuZXcgSHR0cENsaWVudChjb25maWcpO1xuXG4gICAgdmFyIGh0dHBDb250ZXh0ID0ge1xuICAgICAgICBodHRwTWV0aG9kOiBodHRwTWV0aG9kLFxuICAgICAgICByZXNvdXJjZTogcmVzb3VyY2UsXG4gICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgfTtcbiAgICB1LmVhY2goWydwcm9ncmVzcycsICdlcnJvcicsICdhYm9ydCddLCBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgICAgIGFnZW50Lm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgY2xpZW50LmVtaXQoZXZlbnROYW1lLCBldnQsIGh0dHBDb250ZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IHRoaXMuX2h0dHBBZ2VudC5zZW5kUmVxdWVzdChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncy5ib2R5LFxuICAgICAgICBhcmdzLmhlYWRlcnMsIGFyZ3MucGFyYW1zLCB1LmJpbmQodGhpcy5jcmVhdGVTaWduYXR1cmUsIHRoaXMpLFxuICAgICAgICBhcmdzLm91dHB1dFN0cmVhbVxuICAgICk7XG5cbiAgICBwcm9taXNlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoYWdlbnQuX3JlcSAmJiBhZ2VudC5fcmVxLnhocikge1xuICAgICAgICAgICAgdmFyIHhociA9IGFnZW50Ll9yZXEueGhyO1xuICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLl9jaGVja09wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucywgYWxsb3dlZFBhcmFtcykge1xuICAgIHZhciBydiA9IHt9O1xuXG4gICAgcnYuY29uZmlnID0gb3B0aW9ucy5jb25maWcgfHwge307XG4gICAgcnYuaGVhZGVycyA9IHRoaXMuX3ByZXBhcmVPYmplY3RIZWFkZXJzKG9wdGlvbnMpO1xuICAgIHJ2LnBhcmFtcyA9IHUucGljayhvcHRpb25zLCBhbGxvd2VkUGFyYW1zIHx8IFtdKTtcblxuICAgIHJldHVybiBydjtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuX3ByZXBhcmVPYmplY3RIZWFkZXJzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZEhlYWRlcnMgPSBbXG4gICAgICAgIEguQ09OVEVOVF9MRU5HVEgsXG4gICAgICAgIEguQ09OVEVOVF9FTkNPRElORyxcbiAgICAgICAgSC5DT05URU5UX01ENSxcbiAgICAgICAgSC5YX0JDRV9DT05URU5UX1NIQTI1NixcbiAgICAgICAgSC5DT05URU5UX1RZUEUsXG4gICAgICAgIEguQ09OVEVOVF9ESVNQT1NJVElPTixcbiAgICAgICAgSC5FVEFHLFxuICAgICAgICBILlNFU1NJT05fVE9LRU4sXG4gICAgICAgIEguQ0FDSEVfQ09OVFJPTCxcbiAgICAgICAgSC5FWFBJUkVTLFxuICAgICAgICBILlhfQkNFX09CSkVDVF9BQ0wsXG4gICAgICAgIEguWF9CQ0VfT0JKRUNUX0dSQU5UX1JFQURcbiAgICBdO1xuICAgIHZhciBtZXRhU2l6ZSA9IDA7XG4gICAgdmFyIGhlYWRlcnMgPSB1LnBpY2sob3B0aW9ucywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKGFsbG93ZWRIZWFkZXJzLmluZGV4T2Yoa2V5KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKC9eeFxcLWJjZVxcLW1ldGFcXC0vLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgbWV0YVNpemUgKz0gQnVmZmVyLmJ5dGVMZW5ndGgoa2V5KSArIEJ1ZmZlci5ieXRlTGVuZ3RoKCcnICsgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChtZXRhU2l6ZSA+IE1BWF9VU0VSX01FVEFEQVRBX1NJWkUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTWV0YWRhdGEgc2l6ZSBzaG91bGQgbm90IGJlIGdyZWF0ZXIgdGhhbiAnICsgTUFYX1VTRVJfTUVUQURBVEFfU0laRSArICcuJyk7XG4gICAgfVxuXG4gICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoSC5DT05URU5UX0xFTkdUSCkpIHtcbiAgICAgICAgdmFyIGNvbnRlbnRMZW5ndGggPSBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdO1xuICAgICAgICBpZiAoY29udGVudExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRlbnRfbGVuZ3RoIHNob3VsZCBub3QgYmUgbmVnYXRpdmUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29udGVudExlbmd0aCA+IE1BWF9QVVRfT0JKRUNUX0xFTkdUSCkgeyAvLyA1R1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IGxlbmd0aCBzaG91bGQgYmUgbGVzcyB0aGFuICcgKyBNQVhfUFVUX09CSkVDVF9MRU5HVEhcbiAgICAgICAgICAgICAgICArICcuIFVzZSBtdWx0aS1wYXJ0IHVwbG9hZCBpbnN0ZWFkLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoJ0VUYWcnKSkge1xuICAgICAgICB2YXIgZXRhZyA9IGhlYWRlcnMuRVRhZztcbiAgICAgICAgaWYgKCEvXlwiLy50ZXN0KGV0YWcpKSB7XG4gICAgICAgICAgICBoZWFkZXJzLkVUYWcgPSB1dGlsLmZvcm1hdCgnXCIlc1wiJywgZXRhZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWhlYWRlcnMuaGFzT3duUHJvcGVydHkoSC5DT05URU5UX1RZUEUpKSB7XG4gICAgICAgIGhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlYWRlcnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJvc0NsaWVudDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2NvbmZpZy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbmV4cG9ydHMuREVGQVVMVF9TRVJWSUNFX0RPTUFJTiA9ICdiYWlkdWJjZS5jb20nO1xuXG5leHBvcnRzLkRFRkFVTFRfQ09ORklHID0ge1xuICAgIHByb3RvY29sOiAnaHR0cCcsXG4gICAgcmVnaW9uOiAnYmonXG59O1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9oZWFkZXJzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxuZXhwb3J0cy5DT05URU5UX1RZUEUgPSAnQ29udGVudC1UeXBlJztcbmV4cG9ydHMuQ09OVEVOVF9MRU5HVEggPSAnQ29udGVudC1MZW5ndGgnO1xuZXhwb3J0cy5DT05URU5UX01ENSA9ICdDb250ZW50LU1ENSc7XG5leHBvcnRzLkNPTlRFTlRfRU5DT0RJTkcgPSAnQ29udGVudC1FbmNvZGluZyc7XG5leHBvcnRzLkNPTlRFTlRfRElTUE9TSVRJT04gPSAnQ29udGVudC1EaXNwb3NpdGlvbic7XG5leHBvcnRzLkVUQUcgPSAnRVRhZyc7XG5leHBvcnRzLkNPTk5FQ1RJT04gPSAnQ29ubmVjdGlvbic7XG5leHBvcnRzLkhPU1QgPSAnSG9zdCc7XG5leHBvcnRzLlVTRVJfQUdFTlQgPSAnVXNlci1BZ2VudCc7XG5leHBvcnRzLkNBQ0hFX0NPTlRST0wgPSAnQ2FjaGUtQ29udHJvbCc7XG5leHBvcnRzLkVYUElSRVMgPSAnRXhwaXJlcyc7XG5cbmV4cG9ydHMuQVVUSE9SSVpBVElPTiA9ICdBdXRob3JpemF0aW9uJztcbmV4cG9ydHMuWF9CQ0VfREFURSA9ICd4LWJjZS1kYXRlJztcbmV4cG9ydHMuWF9CQ0VfQUNMID0gJ3gtYmNlLWFjbCc7XG5leHBvcnRzLlhfQkNFX1JFUVVFU1RfSUQgPSAneC1iY2UtcmVxdWVzdC1pZCc7XG5leHBvcnRzLlhfQkNFX0NPTlRFTlRfU0hBMjU2ID0gJ3gtYmNlLWNvbnRlbnQtc2hhMjU2JztcbmV4cG9ydHMuWF9CQ0VfT0JKRUNUX0FDTCA9ICd4LWJjZS1vYmplY3QtYWNsJztcbmV4cG9ydHMuWF9CQ0VfT0JKRUNUX0dSQU5UX1JFQUQgPSAneC1iY2Utb2JqZWN0LWdyYW50LXJlYWQnO1xuXG5leHBvcnRzLlhfSFRUUF9IRUFERVJTID0gJ2h0dHBfaGVhZGVycyc7XG5leHBvcnRzLlhfQk9EWSA9ICdib2R5JztcbmV4cG9ydHMuWF9TVEFUVVNfQ09ERSA9ICdzdGF0dXNfY29kZSc7XG5leHBvcnRzLlhfTUVTU0FHRSA9ICdtZXNzYWdlJztcbmV4cG9ydHMuWF9DT0RFID0gJ2NvZGUnO1xuZXhwb3J0cy5YX1JFUVVFU1RfSUQgPSAncmVxdWVzdF9pZCc7XG5cbmV4cG9ydHMuU0VTU0lPTl9UT0tFTiA9ICd4LWJjZS1zZWN1cml0eS10b2tlbic7XG5cbmV4cG9ydHMuWF9WT0RfTUVESUFfVElUTEUgPSAneC12b2QtbWVkaWEtdGl0bGUnO1xuZXhwb3J0cy5YX1ZPRF9NRURJQV9ERVNDUklQVElPTiA9ICd4LXZvZC1tZWRpYS1kZXNjcmlwdGlvbic7XG5leHBvcnRzLkFDQ0VQVF9FTkNPRElORyA9ICdhY2NlcHQtZW5jb2RpbmcnO1xuZXhwb3J0cy5BQ0NFUFQgPSAnYWNjZXB0JztcblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9odHRwX2NsaWVudC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG4vKiBlc2xpbnQgbWF4LXBhcmFtczpbMCwxMF0gKi9cbi8qIGdsb2JhbHMgQXJyYXlCdWZmZXIgKi9cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoNDMpLkV2ZW50RW1pdHRlcjtcbnZhciBCdWZmZXIgPSByZXF1aXJlKDM1KTtcbnZhciBRID0gcmVxdWlyZSg0NSk7XG52YXIgdSA9IHJlcXVpcmUoNDcpO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ4KTtcbnZhciBIID0gcmVxdWlyZSgyMCk7XG5cbi8qKlxuICogVGhlIEh0dHBDbGllbnRcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGh0dHAgY2xpZW50IGNvbmZpZ3VyYXRpb24uXG4gKi9cbmZ1bmN0aW9uIEh0dHBDbGllbnQoY29uZmlnKSB7XG4gICAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIC8qKlxuICAgICAqIGh0dHAocykgcmVxdWVzdCBvYmplY3RcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX3JlcSA9IG51bGw7XG59XG51dGlsLmluaGVyaXRzKEh0dHBDbGllbnQsIEV2ZW50RW1pdHRlcik7XG5cbi8qKlxuICogU2VuZCBIdHRwIFJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHR0cE1ldGhvZCBHRVQsUE9TVCxQVVQsREVMRVRFLEhFQURcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBodHRwIHJlcXVlc3QgcGF0aC5cbiAqIEBwYXJhbSB7KHN0cmluZ3xCdWZmZXJ8c3RyZWFtLlJlYWRhYmxlKT19IGJvZHkgVGhlIHJlcXVlc3QgYm9keS4gSWYgYGJvZHlgIGlzIGFcbiAqIHN0cmVhbSwgYENvbnRlbnQtTGVuZ3RoYCBtdXN0IGJlIHNldCBleHBsaWNpdGx5LlxuICogQHBhcmFtIHtPYmplY3Q9fSBoZWFkZXJzIFRoZSBodHRwIHJlcXVlc3QgaGVhZGVycy5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1zIFRoZSBxdWVyeXN0cmluZ3MgaW4gdXJsLlxuICogQHBhcmFtIHtmdW5jdGlvbigpOnN0cmluZz19IHNpZ25GdW5jdGlvbiBUaGUgYEF1dGhvcml6YXRpb25gIHNpZ25hdHVyZSBmdW5jdGlvblxuICogQHBhcmFtIHtzdHJlYW0uV3JpdGFibGU9fSBvdXRwdXRTdHJlYW0gVGhlIGh0dHAgcmVzcG9uc2UgYm9keS5cbiAqIEBwYXJhbSB7bnVtYmVyPX0gcmV0cnkgVGhlIG1heGltdW0gbnVtYmVyIG9mIG5ldHdvcmsgY29ubmVjdGlvbiBhdHRlbXB0cy5cbiAqXG4gKiBAcmVzb2x2ZSB7e2h0dHBfaGVhZGVyczpPYmplY3QsYm9keTpPYmplY3R9fVxuICogQHJlamVjdCB7T2JqZWN0fVxuICpcbiAqIEByZXR1cm4ge1EuZGVmZXJ9XG4gKi9cbkh0dHBDbGllbnQucHJvdG90eXBlLnNlbmRSZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHBhdGgsIGJvZHksIGhlYWRlcnMsIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25GdW5jdGlvbiwgb3V0cHV0U3RyZWFtKSB7XG5cbiAgICB2YXIgcmVxdWVzdFVybCA9IHRoaXMuX2dldFJlcXVlc3RVcmwocGF0aCwgcGFyYW1zKTtcblxuICAgIHZhciBkZWZhdWx0SGVhZGVycyA9IHt9O1xuICAgIGRlZmF1bHRIZWFkZXJzW0guWF9CQ0VfREFURV0gPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvXFwuXFxkK1okLywgJ1onKTtcbiAgICBkZWZhdWx0SGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCc7XG4gICAgZGVmYXVsdEhlYWRlcnNbSC5IT1NUXSA9IC9eXFx3KzpcXC9cXC8oW15cXC9dKykvLmV4ZWModGhpcy5jb25maWcuZW5kcG9pbnQpWzFdO1xuXG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gdS5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuXG4gICAgLy8gQ2hlY2sgdGhlIGNvbnRlbnQtbGVuZ3RoXG4gICAgaWYgKCFyZXF1ZXN0SGVhZGVycy5oYXNPd25Qcm9wZXJ0eShILkNPTlRFTlRfTEVOR1RIKSkge1xuICAgICAgICB2YXIgY29udGVudExlbmd0aCA9IHRoaXMuX2d1ZXNzQ29udGVudExlbmd0aChib2R5KTtcbiAgICAgICAgaWYgKCEoY29udGVudExlbmd0aCA9PT0gMCAmJiAvR0VUfEhFQUQvaS50ZXN0KGh0dHBNZXRob2QpKSkge1xuICAgICAgICAgICAgLy8g5aaC5p6c5pivIEdFVCDmiJYgSEVBRCDor7fmsYLvvIzlubbkuJQgQ29udGVudC1MZW5ndGgg5pivIDDvvIzpgqPkuYggUmVxdWVzdCBIZWFkZXIg6YeM6Z2i5bCx5LiN6KaB5Ye6546wIENvbnRlbnQtTGVuZ3RoXG4gICAgICAgICAgICAvLyDlkKbliJnmnKzlnLDorqHnrpfnrb7lkI3nmoTml7blgJnkvJrorqHnrpfov5vljrvvvIzkvYbmmK/mtY/op4jlmajlj5Hor7fmsYLnmoTml7blgJnkuI3kuIDlrprkvJrmnInvvIzmraTml7blr7zoh7QgU2lnbmF0dXJlIE1pc21hdGNoIOeahOaDheWGtVxuICAgICAgICAgICAgcmVxdWVzdEhlYWRlcnNbSC5DT05URU5UX0xFTkdUSF0gPSBjb250ZW50TGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjcmVhdGVTaWduYXR1cmUgPSBzaWduRnVuY3Rpb24gfHwgdS5ub29wO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoY3JlYXRlU2lnbmF0dXJlKHRoaXMuY29uZmlnLmNyZWRlbnRpYWxzLCBodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIHJlcXVlc3RIZWFkZXJzKSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChhdXRob3JpemF0aW9uLCB4YmNlRGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhdXRob3JpemF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RIZWFkZXJzW0guQVVUSE9SSVpBVElPTl0gPSBhdXRob3JpemF0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh4YmNlRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SGVhZGVyc1tILlhfQkNFX0RBVEVdID0geGJjZURhdGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RvUmVxdWVzdChodHRwTWV0aG9kLCByZXF1ZXN0VXJsLFxuICAgICAgICAgICAgICAgICAgICB1Lm9taXQocmVxdWVzdEhlYWRlcnMsIEguQ09OVEVOVF9MRU5HVEgsIEguSE9TVCksXG4gICAgICAgICAgICAgICAgICAgIGJvZHksIG91dHB1dFN0cmVhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJldHVybiBRLnJlamVjdChleCk7XG4gICAgfVxufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2RvUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCByZXF1ZXN0VXJsLCByZXF1ZXN0SGVhZGVycywgYm9keSwgb3V0cHV0U3RyZWFtKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub3BlbihodHRwTWV0aG9kLCByZXF1ZXN0VXJsLCB0cnVlKTtcbiAgICBmb3IgKHZhciBoZWFkZXIgaW4gcmVxdWVzdEhlYWRlcnMpIHtcbiAgICAgICAgaWYgKHJlcXVlc3RIZWFkZXJzLmhhc093blByb3BlcnR5KGhlYWRlcikpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJlcXVlc3RIZWFkZXJzW2hlYWRlcl07XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgIH07XG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ3hociBhYm9ydGVkJykpO1xuICAgIH07XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IDEyMjMpIHtcbiAgICAgICAgICAgICAgICAvLyBJRSAtICMxNDUwOiBzb21ldGltZXMgcmV0dXJucyAxMjIzIHdoZW4gaXQgc2hvdWxkIGJlIDIwNFxuICAgICAgICAgICAgICAgIHN0YXR1cyA9IDIwNDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgICAgIHZhciBpc0pTT04gPSAvYXBwbGljYXRpb25cXC9qc29uLy50ZXN0KGNvbnRlbnRUeXBlKTtcbiAgICAgICAgICAgIHZhciByZXNwb25zZUJvZHkgPSBpc0pTT04gPyBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpIDogeGhyLnJlc3BvbnNlVGV4dDtcblxuICAgICAgICAgICAgdmFyIGlzU3VjY2VzcyA9IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgICAgICAgICAgaWYgKGlzU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0gc2VsZi5fZml4SGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHJlc3BvbnNlQm9keVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzX2NvZGU6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzcG9uc2VCb2R5Lm1lc3NhZ2UgfHwgJzxtZXNzYWdlPicsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IHJlc3BvbnNlQm9keS5jb2RlIHx8ICc8Y29kZT4nLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X2lkOiByZXNwb25zZUJvZHkucmVxdWVzdElkIHx8ICc8cmVxdWVzdF9pZD4nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGlmICh4aHIudXBsb2FkKSB7XG4gICAgICAgIHUuZWFjaChbJ3Byb2dyZXNzJywgJ2Vycm9yJywgJ2Fib3J0J10sIGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYuZW1pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVtaXQoZXZlbnROYW1lLCBldnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHhoci5zZW5kKGJvZHkpO1xuXG4gICAgc2VsZi5fcmVxID0ge3hocjogeGhyfTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2d1ZXNzQ29udGVudExlbmd0aCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSAnJykge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAodS5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhIGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICByZXR1cm4gZGF0YS5zaXplO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gZGF0YS5ieXRlTGVuZ3RoO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignTm8gQ29udGVudC1MZW5ndGggaXMgc3BlY2lmaWVkLicpO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2ZpeEhlYWRlcnMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICAgIHZhciBmaXhlZEhlYWRlcnMgPSB7fTtcblxuICAgIGlmIChoZWFkZXJzKSB7XG4gICAgICAgIHUuZWFjaChoZWFkZXJzLnNwbGl0KC9cXHI/XFxuLyksIGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBpZHgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbGluZS5zdWJzdHJpbmcoaWR4ICsgMSkucmVwbGFjZSgvXlxccyt8XFxzKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2V0YWcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXCIvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaXhlZEhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZml4ZWRIZWFkZXJzO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuYnVpbGRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgdXJsRW5jb2RlU3RyID0gcmVxdWlyZSg0Nikuc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUGVyY2VudC1lbmNvZGluZ1xuICAgIHJldHVybiB1cmxFbmNvZGVTdHIucmVwbGFjZSgvWygpJyF+LipcXC1fXS9nLCBmdW5jdGlvbiAoY2hhcikge1xuICAgICAgICByZXR1cm4gJyUnICsgY2hhci5jaGFyQ29kZUF0KCkudG9TdHJpbmcoMTYpO1xuICAgIH0pO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2dldFJlcXVlc3RVcmwgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zKSB7XG4gICAgdmFyIHVyaSA9IHBhdGg7XG4gICAgdmFyIHFzID0gdGhpcy5idWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcyk7XG4gICAgaWYgKHFzKSB7XG4gICAgICAgIHVyaSArPSAnPycgKyBxcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZW5kcG9pbnQgKyB1cmk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0dHBDbGllbnQ7XG5cbiIsIi8qKlxuICogQGZpbGUgc3JjL21pbWUudHlwZXMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG52YXIgbWltZVR5cGVzID0ge1xufTtcblxuZXhwb3J0cy5ndWVzcyA9IGZ1bmN0aW9uIChleHQpIHtcbiAgICBpZiAoIWV4dCB8fCAhZXh0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gICAgfVxuICAgIGlmIChleHRbMF0gPT09ICcuJykge1xuICAgICAgICBleHQgPSBleHQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICByZXR1cm4gbWltZVR5cGVzW2V4dC50b0xvd2VyQ2FzZSgpXSB8fCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHN0cmluZ3MuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBrRXNjYXBlZE1hcCA9IHtcbiAgICAnISc6ICclMjEnLFxuICAgICdcXCcnOiAnJTI3JyxcbiAgICAnKCc6ICclMjgnLFxuICAgICcpJzogJyUyOScsXG4gICAgJyonOiAnJTJBJ1xufTtcblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbiAoc3RyaW5nLCBlbmNvZGluZ1NsYXNoKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmcpO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9bISdcXChcXClcXCpdL2csIGZ1bmN0aW9uICgkMSkge1xuICAgICAgICByZXR1cm4ga0VzY2FwZWRNYXBbJDFdO1xuICAgIH0pO1xuXG4gICAgaWYgKGVuY29kaW5nU2xhc2ggPT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8lMkYvZ2ksICcvJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydHMudHJpbSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gKHN0cmluZyB8fCAnJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xufTtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBjb25maWcuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cblxudmFyIGtEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBydW50aW1lczogJ2h0bWw1JyxcblxuICAgIC8vIGJvc+acjeWKoeWZqOeahOWcsOWdgO+8jOm7mOiupChodHRwOi8vYm9zLmJqLmJhaWR1YmNlLmNvbSlcbiAgICBib3NfZW5kcG9pbnQ6ICdodHRwOi8vYm9zLmJqLmJhaWR1YmNlLmNvbScsXG5cbiAgICAvLyDpu5jorqTnmoQgYWsg5ZKMIHNrIOmFjee9rlxuICAgIGJvc19jcmVkZW50aWFsczogbnVsbCxcblxuICAgIC8vIOWmguaenOWIh+aNouWIsCBhcHBlbmRhYmxlIOaooeW8j++8jOacgOWkp+WPquaUr+aMgSA1RyDnmoTmlofku7ZcbiAgICAvLyDkuI3lho3mlK/mjIEgTXVsdGlwYXJ0IOeahOaWueW8j+S4iuS8oOaWh+S7tlxuICAgIGJvc19hcHBlbmRhYmxlOiBmYWxzZSxcblxuICAgIC8vIOS4uuS6huWkhOeQhiBGbGFzaCDkuI3og73lj5HpgIEgSEVBRCwgREVMRVRFIOS5i+exu+eahOivt+axgu+8jOS7peWPiuaXoOazlVxuICAgIC8vIOiOt+WPliByZXNwb25zZSBoZWFkZXJzIOeahOmXrumimO+8jOmcgOimgeaQnuS4gOS4qiByZWxheSDmnI3liqHlmajvvIzmiormlbDmja5cbiAgICAvLyDmoLzlvI/ovazljJbkuIDkuItcbiAgICBib3NfcmVsYXlfc2VydmVyOiAnaHR0cHM6Ly9yZWxheS5lZmUudGVjaCcsXG5cbiAgICAvLyDmmK/lkKbmlK/mjIHlpJrpgInvvIzpu5jorqQoZmFsc2UpXG4gICAgbXVsdGlfc2VsZWN0aW9uOiBmYWxzZSxcblxuICAgIC8vIOWksei0peS5i+WQjumHjeivleeahOasoeaVsCjljZXkuKrmlofku7bmiJbogIXliIbniYcp77yM6buY6K6kKDAp77yM5LiN6YeN6K+VXG4gICAgbWF4X3JldHJpZXM6IDAsXG5cbiAgICAvLyDlpLHotKXph43or5XnmoTpl7TpmpTml7bpl7TvvIzpu5jorqQgMTAwMG1zXG4gICAgcmV0cnlfaW50ZXJ2YWw6IDEwMDAsXG5cbiAgICAvLyDmmK/lkKboh6rliqjkuIrkvKDvvIzpu5jorqQoZmFsc2UpXG4gICAgYXV0b19zdGFydDogZmFsc2UsXG5cbiAgICAvLyDmnIDlpKflj6/ku6XpgInmi6nnmoTmlofku7blpKflsI/vvIzpu5jorqQoMTAwTSlcbiAgICBtYXhfZmlsZV9zaXplOiAnMTAwbWInLFxuXG4gICAgLy8g6LaF6L+H6L+Z5Liq5paH5Lu25aSn5bCP5LmL5ZCO77yM5byA5aeL5L2/55So5YiG54mH5LiK5Lyg77yM6buY6K6kKDEwTSlcbiAgICBib3NfbXVsdGlwYXJ0X21pbl9zaXplOiAnMTBtYicsXG5cbiAgICAvLyDliIbniYfkuIrkvKDnmoTml7blgJnvvIzlubbooYzkuIrkvKDnmoTkuKrmlbDvvIzpu5jorqQoMSlcbiAgICBib3NfbXVsdGlwYXJ0X3BhcmFsbGVsOiAxLFxuXG4gICAgLy8g6Zif5YiX5Lit55qE5paH5Lu277yM5bm26KGM5LiK5Lyg55qE5Liq5pWw77yM6buY6K6kKDMpXG4gICAgYm9zX3Rhc2tfcGFyYWxsZWw6IDMsXG5cbiAgICAvLyDorqHnrpfnrb7lkI3nmoTml7blgJnvvIzmnInkupsgaGVhZGVyIOmcgOimgeWJlOmZpO+8jOWHj+WwkeS8oOi+k+eahOS9k+enr1xuICAgIGF1dGhfc3RyaXBwZWRfaGVhZGVyczogWydVc2VyLUFnZW50JywgJ0Nvbm5lY3Rpb24nXSxcblxuICAgIC8vIOWIhueJh+S4iuS8oOeahOaXtuWAme+8jOavj+S4quWIhueJh+eahOWkp+Wwj++8jOm7mOiupCg0TSlcbiAgICBjaHVua19zaXplOiAnNG1iJyxcblxuICAgIC8vIOWIhuWdl+S4iuS8oOaXtizmmK/lkKblhYHorrjmlq3ngrnnu63kvKDvvIzpu5jorqQodHJ1ZSlcbiAgICBib3NfbXVsdGlwYXJ0X2F1dG9fY29udGludWU6IHRydWUsXG5cbiAgICAvLyDliIblvIDkuIrkvKDnmoTml7blgJnvvIxsb2NhbFN0b3JhZ2Xph4zpnaJrZXnnmoTnlJ/miJDmlrnlvI/vvIzpu5jorqTmmK8gYGRlZmF1bHRgXG4gICAgLy8g5aaC5p6c6ZyA6KaB6Ieq5a6a5LmJ77yM5Y+v5Lul6YCa6L+HIFhYWFxuICAgIGJvc19tdWx0aXBhcnRfbG9jYWxfa2V5X2dlbmVyYXRvcjogJ2RlZmF1bHQnLFxuXG4gICAgLy8g5piv5ZCm5YWB6K646YCJ5oup55uu5b2VXG4gICAgZGlyX3NlbGVjdGlvbjogZmFsc2UsXG5cbiAgICAvLyDmmK/lkKbpnIDopoHmr4/mrKHpg73ljrvmnI3liqHlmajorqHnrpfnrb7lkI1cbiAgICBnZXRfbmV3X3VwdG9rZW46IHRydWUsXG5cbiAgICAvLyDlm6DkuLrkvb/nlKggRm9ybSBQb3N0IOeahOagvOW8j++8jOayoeacieiuvue9rumineWklueahCBIZWFkZXLvvIzku47ogIzlj6/ku6Xkv53or4FcbiAgICAvLyDkvb/nlKggRmxhc2gg5Lmf6IO95LiK5Lyg5aSn5paH5Lu2XG4gICAgLy8g5L2O54mI5pys5rWP6KeI5Zmo5LiK5Lyg5paH5Lu255qE5pe25YCZ77yM6ZyA6KaB6K6+572uIHBvbGljee+8jOm7mOiupOaDheWGteS4i1xuICAgIC8vIHBvbGljeeeahOWGheWuueWPqumcgOimgeWMheWQqyBleHBpcmF0aW9uIOWSjCBjb25kaXRpb25zIOWNs+WPr1xuICAgIC8vIHBvbGljeToge1xuICAgIC8vICAgZXhwaXJhdGlvbjogJ3h4JyxcbiAgICAvLyAgIGNvbmRpdGlvbnM6IFtcbiAgICAvLyAgICAge2J1Y2tldDogJ3RoZS1idWNrZXQtbmFtZSd9XG4gICAgLy8gICBdXG4gICAgLy8gfVxuICAgIC8vIGJvc19wb2xpY3k6IG51bGwsXG5cbiAgICAvLyDkvY7niYjmnKzmtY/op4jlmajkuIrkvKDmlofku7bnmoTml7blgJnvvIzpnIDopoHorr7nva4gcG9saWN5X3NpZ25hdHVyZVxuICAgIC8vIOWmguaenOayoeacieiuvue9riBib3NfcG9saWN5X3NpZ25hdHVyZSDnmoTor53vvIzkvJrpgJrov4cgdXB0b2tlbl91cmwg5p2l6K+35rGCXG4gICAgLy8g6buY6K6k5Y+q5Lya6K+35rGC5LiA5qyh77yM5aaC5p6c5aSx5pWI5LqG77yM6ZyA6KaB5omL5Yqo5p2l6YeN572uIHBvbGljeV9zaWduYXR1cmVcbiAgICAvLyBib3NfcG9saWN5X3NpZ25hdHVyZTogbnVsbCxcblxuICAgIC8vIEpTT05QIOm7mOiupOeahOi2heaXtuaXtumXtCg1MDAwbXMpXG4gICAgdXB0b2tlbl92aWFfanNvbnA6IHRydWUsXG4gICAgdXB0b2tlbl90aW1lb3V0OiA1MDAwLFxuICAgIHVwdG9rZW5fanNvbnBfdGltZW91dDogNTAwMCwgICAgLy8g5LiN5pSv5oyB5LqG77yM5ZCO57ut5bu66K6u55SoIHVwdG9rZW5fdGltZW91dFxuXG4gICAgLy8g5piv5ZCm6KaB56aB55So57uf6K6h77yM6buY6K6k5LiN56aB55SoXG4gICAgLy8g5aaC5p6c6ZyA6KaB56aB55So77yM5oqKIHRyYWNrZXJfaWQg6K6+572u5oiQIG51bGwg5Y2z5Y+vXG4gICAgdHJhY2tlcl9pZDogJzJlMGJjOGM1ZTdjZWIyNTc5NmJhNDk2MmU3YjU3Mzg3J1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrRGVmYXVsdE9wdGlvbnM7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKSwgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgZXZlbnRzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBrUG9zdEluaXQ6ICdQb3N0SW5pdCcsXG4gICAga0tleTogJ0tleScsXG4gICAga0xpc3RQYXJ0czogJ0xpc3RQYXJ0cycsXG4gICAga09iamVjdE1ldGFzOiAnT2JqZWN0TWV0YXMnLFxuICAgIC8vIGtGaWxlc1JlbW92ZWQgIDogJ0ZpbGVzUmVtb3ZlZCcsXG4gICAga0ZpbGVGaWx0ZXJlZDogJ0ZpbGVGaWx0ZXJlZCcsXG4gICAga0ZpbGVzQWRkZWQ6ICdGaWxlc0FkZGVkJyxcbiAgICBrRmlsZXNGaWx0ZXI6ICdGaWxlc0ZpbHRlcicsXG4gICAga05ldHdvcmtTcGVlZDogJ05ldHdvcmtTcGVlZCcsXG4gICAga0JlZm9yZVVwbG9hZDogJ0JlZm9yZVVwbG9hZCcsXG4gICAgLy8ga1VwbG9hZEZpbGUgICAgOiAnVXBsb2FkRmlsZScsICAgICAgIC8vID8/XG4gICAga1VwbG9hZFByb2dyZXNzOiAnVXBsb2FkUHJvZ3Jlc3MnLFxuICAgIGtGaWxlVXBsb2FkZWQ6ICdGaWxlVXBsb2FkZWQnLFxuICAgIGtVcGxvYWRQYXJ0UHJvZ3Jlc3M6ICdVcGxvYWRQYXJ0UHJvZ3Jlc3MnLFxuICAgIGtDaHVua1VwbG9hZGVkOiAnQ2h1bmtVcGxvYWRlZCcsXG4gICAga1VwbG9hZFJlc3VtZTogJ1VwbG9hZFJlc3VtZScsIC8vIOaWreeCuee7reS8oFxuICAgIC8vIGtVcGxvYWRQYXVzZTogJ1VwbG9hZFBhdXNlJywgICAvLyDmmoLlgZxcbiAgICBrVXBsb2FkUmVzdW1lRXJyb3I6ICdVcGxvYWRSZXN1bWVFcnJvcicsIC8vIOWwneivleaWreeCuee7reS8oOWksei0pVxuICAgIGtVcGxvYWRDb21wbGV0ZTogJ1VwbG9hZENvbXBsZXRlJyxcbiAgICBrRXJyb3I6ICdFcnJvcicsXG4gICAga0Fib3J0ZWQ6ICdBYm9ydGVkJ1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgbXVsdGlwYXJ0X3Rhc2suanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NSk7XG52YXIgYXN5bmMgPSByZXF1aXJlKDM3KTtcbnZhciB1ID0gcmVxdWlyZSg0Nyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKDM0KTtcbnZhciBldmVudHMgPSByZXF1aXJlKDI1KTtcbnZhciBUYXNrID0gcmVxdWlyZSgzMSk7XG5cbi8qKlxuICogTXVsdGlwYXJ0VGFza1xuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBNdWx0aXBhcnRUYXNrKCkge1xuICAgIFRhc2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIC8qKlxuICAgICAqIOaJuemHj+S4iuS8oOeahOaXtuWAme+8jOS/neWtmOeahCB4aHJSZXF1ZXN0aW5nIOWvueixoVxuICAgICAqIOWmguaenOmcgOimgSBhYm9ydCDnmoTml7blgJnvvIzku47ov5nph4zmnaXojrflj5ZcbiAgICAgKi9cbiAgICB0aGlzLnhoclBvb2xzID0gW107XG59XG51dGlscy5pbmhlcml0cyhNdWx0aXBhcnRUYXNrLCBUYXNrKTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuYWJvcnRlZCkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciBmaWxlID0gdGhpcy5vcHRpb25zLmZpbGU7XG4gICAgdmFyIGJ1Y2tldCA9IHRoaXMub3B0aW9ucy5idWNrZXQ7XG4gICAgdmFyIG9iamVjdCA9IHRoaXMub3B0aW9ucy5vYmplY3Q7XG4gICAgdmFyIG1ldGFzID0gdGhpcy5vcHRpb25zLm1ldGFzO1xuICAgIHZhciBjaHVua1NpemUgPSB0aGlzLm9wdGlvbnMuY2h1bmtfc2l6ZTtcbiAgICB2YXIgbXVsdGlwYXJ0UGFyYWxsZWwgPSB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9wYXJhbGxlbDtcblxuICAgIHZhciBjb250ZW50VHlwZSA9IHV0aWxzLmd1ZXNzQ29udGVudFR5cGUoZmlsZSk7XG4gICAgdmFyIG9wdGlvbnMgPSB7J0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlfTtcbiAgICB2YXIgdXBsb2FkSWQgPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuX2luaXRpYXRlTXVsdGlwYXJ0VXBsb2FkKGZpbGUsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdXBsb2FkSWQgPSByZXNwb25zZS5ib2R5LnVwbG9hZElkO1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gcmVzcG9uc2UuYm9keS5wYXJ0cyB8fCBbXTtcbiAgICAgICAgICAgIC8vIOWHhuWkhyB1cGxvYWRQYXJ0c1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICAgICAgdmFyIHRhc2tzID0gdXRpbHMuZ2V0VGFza3MoZmlsZSwgdXBsb2FkSWQsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QpO1xuICAgICAgICAgICAgdXRpbHMuZmlsdGVyVGFza3ModGFza3MsIHBhcnRzKTtcblxuICAgICAgICAgICAgdmFyIGxvYWRlZCA9IHBhcnRzLmxlbmd0aDtcbiAgICAgICAgICAgIC8vIOi/meS4queUqOadpeiusOW9leaVtOS9kyBQYXJ0cyDnmoTkuIrkvKDov5vluqbvvIzkuI3mmK/ljZXkuKogUGFydCDnmoTkuIrkvKDov5vluqZcbiAgICAgICAgICAgIC8vIOWNleS4qiBQYXJ0IOeahOS4iuS8oOi/m+W6puWPr+S7peebkeWQrCBrVXBsb2FkUGFydFByb2dyZXNzIOadpeW+l+WIsFxuICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgIGxlbmd0aENvbXB1dGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgbG9hZGVkOiBsb2FkZWQsXG4gICAgICAgICAgICAgICAgdG90YWw6IHRhc2tzLmxlbmd0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChsb2FkZWQpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2ZpbGUsIGxvYWRlZCAvIHRhc2tzLmxlbmd0aCwgbnVsbF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYy5tYXBMaW1pdCh0YXNrcywgbXVsdGlwYXJ0UGFyYWxsZWwsIHNlbGYuX3VwbG9hZFBhcnQoc3RhdGUpLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2VzKSB7XG4gICAgICAgICAgICB2YXIgcGFydExpc3QgPSBbXTtcbiAgICAgICAgICAgIHUuZWFjaChyZXNwb25zZXMsIGZ1bmN0aW9uIChyZXNwb25zZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBwYXJ0TGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcGFydE51bWJlcjogaW5kZXggKyAxLFxuICAgICAgICAgICAgICAgICAgICBlVGFnOiByZXNwb25zZS5odHRwX2hlYWRlcnMuZXRhZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDlhajpg6jkuIrkvKDnu5PmnZ/lkI7liKDpmaRsb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgIHNlbGYuX2dlbmVyYXRlTG9jYWxLZXkoe1xuICAgICAgICAgICAgICAgIGJsb2I6IGZpbGUsXG4gICAgICAgICAgICAgICAgY2h1bmtTaXplOiBjaHVua1NpemUsXG4gICAgICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3RcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgIHV0aWxzLnJlbW92ZVVwbG9hZElkKGtleSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNsaWVudC5jb21wbGV0ZU11bHRpcGFydFVwbG9hZChidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQsIHBhcnRMaXN0LCBtZXRhcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtmaWxlLCAxXSk7XG5cbiAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkuYnVja2V0ID0gYnVja2V0O1xuICAgICAgICAgICAgcmVzcG9uc2UuYm9keS5vYmplY3QgPSBvYmplY3Q7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0ZpbGVVcGxvYWRlZCwgW2ZpbGUsIHJlc3BvbnNlXSk7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgdmFyIGV2ZW50VHlwZSA9IHNlbGYuYWJvcnRlZCA/IGV2ZW50cy5rQWJvcnRlZCA6IGV2ZW50cy5rRXJyb3I7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRUeXBlLCBbZXJyb3IsIGZpbGVdKTtcbiAgICAgICAgfSk7XG59O1xuXG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9pbml0aWF0ZU11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChmaWxlLCBjaHVua1NpemUsIGJ1Y2tldCwgb2JqZWN0LCBvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgdXBsb2FkSWQ7XG4gICAgdmFyIGxvY2FsU2F2ZUtleTtcblxuICAgIGZ1bmN0aW9uIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNsaWVudC5pbml0aWF0ZU11bHRpcGFydFVwbG9hZChidWNrZXQsIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuc2V0VXBsb2FkSWQobG9jYWxTYXZlS2V5LCByZXNwb25zZS5ib2R5LnVwbG9hZElkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNwb25zZS5ib2R5LnBhcnRzID0gW107XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGtleU9wdGlvbnMgPSB7XG4gICAgICAgIGJsb2I6IGZpbGUsXG4gICAgICAgIGNodW5rU2l6ZTogY2h1bmtTaXplLFxuICAgICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgb2JqZWN0OiBvYmplY3RcbiAgICB9O1xuICAgIHZhciBwcm9taXNlID0gdGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfYXV0b19jb250aW51ZVxuICAgICAgICA/IHRoaXMuX2dlbmVyYXRlTG9jYWxLZXkoa2V5T3B0aW9ucylcbiAgICAgICAgOiBRLnJlc29sdmUobnVsbCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGxvY2FsU2F2ZUtleSA9IGtleTtcbiAgICAgICAgICAgIGlmICghbG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXBsb2FkSWQgPSB1dGlscy5nZXRVcGxvYWRJZChsb2NhbFNhdmVLZXkpO1xuICAgICAgICAgICAgaWYgKCF1cGxvYWRJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9saXN0UGFydHMoZmlsZSwgYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAodXBsb2FkSWQgJiYgbG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnRzID0gcmVzcG9uc2UuYm9keS5wYXJ0cztcbiAgICAgICAgICAgICAgICAvLyBsaXN0UGFydHMg55qE6L+U5Zue57uT5p6cXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUmVzdW1lLCBbZmlsZSwgcGFydHMsIG51bGxdKTtcbiAgICAgICAgICAgICAgICByZXNwb25zZS5ib2R5LnVwbG9hZElkID0gdXBsb2FkSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKHVwbG9hZElkICYmIGxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOiOt+WPluW3suS4iuS8oOWIhueJh+Wksei0pe+8jOWImemHjeaWsOS4iuS8oOOAglxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFJlc3VtZUVycm9yLCBbZmlsZSwgZXJyb3IsIG51bGxdKTtcbiAgICAgICAgICAgICAgICB1dGlscy5yZW1vdmVVcGxvYWRJZChsb2NhbFNhdmVLZXkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfSk7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fZ2VuZXJhdGVMb2NhbEtleSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGdlbmVyYXRvciA9IHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X2xvY2FsX2tleV9nZW5lcmF0b3I7XG4gICAgcmV0dXJuIHV0aWxzLmdlbmVyYXRlTG9jYWxLZXkob3B0aW9ucywgZ2VuZXJhdG9yKTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9saXN0UGFydHMgPSBmdW5jdGlvbiAoZmlsZSwgYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgbG9jYWxQYXJ0cyA9IGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0xpc3RQYXJ0cywgW2ZpbGUsIHVwbG9hZElkXSk7XG5cbiAgICByZXR1cm4gUS5yZXNvbHZlKGxvY2FsUGFydHMpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChwYXJ0cykge1xuICAgICAgICAgICAgaWYgKHUuaXNBcnJheShwYXJ0cykgJiYgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cF9oZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydHM6IHBhcnRzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlpoLmnpzov5Tlm57nmoTkuI3mmK/mlbDnu4TvvIzlsLHosIPnlKggbGlzdFBhcnRzIOaOpeWPo+S7juacjeWKoeWZqOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2xpc3RBbGxQYXJ0cyhidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpO1xuICAgICAgICB9KTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9saXN0QWxsUGFydHMgPSBmdW5jdGlvbiAoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKSB7XG4gICAgLy8gaXNUcnVuY2F0ZWQgPT09IHRydWUgLyBmYWxzZVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICB2YXIgcGFydHMgPSBbXTtcbiAgICB2YXIgcGF5bG9hZCA9IG51bGw7XG4gICAgdmFyIG1heFBhcnRzID0gMTAwMDsgICAgICAgICAgLy8g5q+P5qyh55qE5YiG6aG1XG4gICAgdmFyIHBhcnROdW1iZXJNYXJrZXIgPSAwOyAgICAgLy8g5YiG6ZqU56ymXG5cbiAgICBmdW5jdGlvbiBsaXN0UGFydHMoKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWF4UGFydHM6IG1heFBhcnRzLFxuICAgICAgICAgICAgcGFydE51bWJlck1hcmtlcjogcGFydE51bWJlck1hcmtlclxuICAgICAgICB9O1xuICAgICAgICBzZWxmLmNsaWVudC5saXN0UGFydHMoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkLCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGFydHMucHVzaC5hcHBseShwYXJ0cywgcmVzcG9uc2UuYm9keS5wYXJ0cyk7XG4gICAgICAgICAgICAgICAgcGFydE51bWJlck1hcmtlciA9IHJlc3BvbnNlLmJvZHkubmV4dFBhcnROdW1iZXJNYXJrZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuYm9keS5pc1RydW5jYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g57uT5p2f5LqGXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQuYm9keS5wYXJ0cyA9IHBhcnRzO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6YCS5b2S6LCD55SoXG4gICAgICAgICAgICAgICAgICAgIGxpc3RQYXJ0cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pW1xuICAgICAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGxpc3RQYXJ0cygpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fdXBsb2FkUGFydCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgZnVuY3Rpb24gdXBsb2FkUGFydElubmVyKGl0ZW0sIG9wdF9tYXhSZXRyaWVzKSB7XG4gICAgICAgIGlmIChpdGVtLmV0YWcpIHtcbiAgICAgICAgICAgIHNlbGYubmV0d29ya0luZm8ubG9hZGVkQnl0ZXMgKz0gaXRlbS5wYXJ0U2l6ZTtcblxuICAgICAgICAgICAgLy8g6Lez6L+H5bey5LiK5Lyg55qEcGFydFxuICAgICAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgaHR0cF9oZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIGV0YWc6IGl0ZW0uZXRhZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keToge31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXhSZXRyaWVzID0gb3B0X21heFJldHJpZXMgPT0gbnVsbFxuICAgICAgICAgICAgPyBzZWxmLm9wdGlvbnMubWF4X3JldHJpZXNcbiAgICAgICAgICAgIDogb3B0X21heFJldHJpZXM7XG4gICAgICAgIHZhciByZXRyeUludGVydmFsID0gc2VsZi5vcHRpb25zLnJldHJ5X2ludGVydmFsO1xuXG4gICAgICAgIHZhciBibG9iID0gaXRlbS5maWxlLnNsaWNlKGl0ZW0uc3RhcnQsIGl0ZW0uc3RvcCArIDEpO1xuICAgICAgICBibG9iLl9wcmV2aW91c0xvYWRlZCA9IDA7XG5cbiAgICAgICAgdmFyIHVwbG9hZFBhcnRYaHIgPSBzZWxmLmNsaWVudC51cGxvYWRQYXJ0RnJvbUJsb2IoaXRlbS5idWNrZXQsIGl0ZW0ub2JqZWN0LFxuICAgICAgICAgICAgaXRlbS51cGxvYWRJZCwgaXRlbS5wYXJ0TnVtYmVyLCBpdGVtLnBhcnRTaXplLCBibG9iKTtcbiAgICAgICAgdmFyIHhoclBvb2xJbmRleCA9IHNlbGYueGhyUG9vbHMucHVzaCh1cGxvYWRQYXJ0WGhyKTtcblxuICAgICAgICByZXR1cm4gdXBsb2FkUGFydFhoci50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICsrc3RhdGUubG9hZGVkO1xuICAgICAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IHN0YXRlLmxvYWRlZCAvIHN0YXRlLnRvdGFsO1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbaXRlbS5maWxlLCBwcm9ncmVzcywgbnVsbF0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSWQ6IGl0ZW0udXBsb2FkSWQsXG4gICAgICAgICAgICAgICAgICAgIHBhcnROdW1iZXI6IGl0ZW0ucGFydE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgcGFydFNpemU6IGl0ZW0ucGFydFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldDogaXRlbS5idWNrZXQsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogaXRlbS5vYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogaXRlbS5zdGFydCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IGJsb2Iuc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtDaHVua1VwbG9hZGVkLCBbaXRlbS5maWxlLCByZXN1bHRdKTtcblxuICAgICAgICAgICAgICAgIC8vIOS4jeeUqOWIoOmZpO+8jOiuvue9ruS4uiBudWxsIOWwseWlveS6hu+8jOWPjeatoyBhYm9ydCDnmoTml7blgJnkvJrliKTmlq3nmoRcbiAgICAgICAgICAgICAgICBzZWxmLnhoclBvb2xzW3hoclBvb2xJbmRleCAtIDFdID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pW1xuICAgICAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4UmV0cmllcyA+IDAgJiYgIXNlbGYuYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDov5jmnInph43or5XnmoTmnLrkvJpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWxzLmRlbGF5KHJldHJ5SW50ZXJ2YWwpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwbG9hZFBhcnRJbm5lcihpdGVtLCBtYXhSZXRyaWVzIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDmsqHmnInmnLrkvJrph43or5XkuoYgOi0oXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gZmlsZTogZmlsZSxcbiAgICAgICAgLy8gdXBsb2FkSWQ6IHVwbG9hZElkLFxuICAgICAgICAvLyBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgLy8gb2JqZWN0OiBvYmplY3QsXG4gICAgICAgIC8vIHBhcnROdW1iZXI6IHBhcnROdW1iZXIsXG4gICAgICAgIC8vIHBhcnRTaXplOiBwYXJ0U2l6ZSxcbiAgICAgICAgLy8gc3RhcnQ6IG9mZnNldCxcbiAgICAgICAgLy8gc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG5cbiAgICAgICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJlamVjdCA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHVwbG9hZFBhcnRJbm5lcihpdGVtKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICog57uI5q2i5LiK5Lyg5Lu75YqhXG4gKi9cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gbnVsbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMueGhyUG9vbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHhociA9IHRoaXMueGhyUG9vbHNbaV07XG4gICAgICAgIGlmICh4aHIgJiYgdHlwZW9mIHhoci5hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTXVsdGlwYXJ0VGFzaztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL25ldHdvcmtfaW5mby5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgzNCk7XG5cbi8qKlxuICogTmV0d29ya0luZm9cbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gTmV0d29ya0luZm8oKSB7XG4gICAgLyoqXG4gICAgICog6K6w5b2V5LuOIHN0YXJ0IOW8gOWni+W3sue7j+S4iuS8oOeahOWtl+iKguaVsC5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubG9hZGVkQnl0ZXMgPSAwO1xuXG4gICAgLyoqXG4gICAgICog6K6w5b2V6Zif5YiX5Lit5oC75paH5Lu255qE5aSn5bCPLCBVcGxvYWRDb21wbGV0ZSDkuYvlkI7kvJrooqvmuIXpm7ZcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMudG90YWxCeXRlcyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiDorrDlvZXlvIDlp4vkuIrkvKDnmoTml7bpl7QuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1dGlscy5ub3coKTtcblxuICAgIHRoaXMucmVzZXQoKTtcbn1cblxuTmV0d29ya0luZm8ucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGhpcy5sb2FkZWRCeXRlcywgICAgICAgICAgICAgICAgICAgICAvLyDlt7Lnu4/kuIrkvKDnmoRcbiAgICAgICAgdXRpbHMubm93KCkgLSB0aGlzLl9zdGFydFRpbWUsICAgICAgICAvLyDoirHotLnnmoTml7bpl7RcbiAgICAgICAgdGhpcy50b3RhbEJ5dGVzIC0gdGhpcy5sb2FkZWRCeXRlcyAgICAvLyDliankvZnmnKrkuIrkvKDnmoRcbiAgICBdO1xufTtcblxuTmV0d29ya0luZm8ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubG9hZGVkQnl0ZXMgPSAwO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHV0aWxzLm5vdygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrSW5mbztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgcHV0X29iamVjdF90YXNrLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDUpO1xudmFyIHUgPSByZXF1aXJlKDQ3KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzQpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoMjUpO1xudmFyIFRhc2sgPSByZXF1aXJlKDMxKTtcblxuLyoqXG4gKiBQdXRPYmplY3RUYXNrXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIFB1dE9iamVjdFRhc2soKSB7XG4gICAgVGFzay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxudXRpbHMuaW5oZXJpdHMoUHV0T2JqZWN0VGFzaywgVGFzayk7XG5cblB1dE9iamVjdFRhc2sucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKG9wdF9tYXhSZXRyaWVzKSB7XG4gICAgaWYgKHRoaXMuYWJvcnRlZCkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciBmaWxlID0gdGhpcy5vcHRpb25zLmZpbGU7XG4gICAgdmFyIGJ1Y2tldCA9IHRoaXMub3B0aW9ucy5idWNrZXQ7XG4gICAgdmFyIG9iamVjdCA9IHRoaXMub3B0aW9ucy5vYmplY3Q7XG4gICAgdmFyIG1ldGFzID0gdGhpcy5vcHRpb25zLm1ldGFzO1xuICAgIHZhciBtYXhSZXRyaWVzID0gb3B0X21heFJldHJpZXMgPT0gbnVsbFxuICAgICAgICA/IHRoaXMub3B0aW9ucy5tYXhfcmV0cmllc1xuICAgICAgICA6IG9wdF9tYXhSZXRyaWVzO1xuICAgIHZhciByZXRyeUludGVydmFsID0gdGhpcy5vcHRpb25zLnJldHJ5X2ludGVydmFsO1xuXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdXRpbHMuZ3Vlc3NDb250ZW50VHlwZShmaWxlKTtcbiAgICB2YXIgb3B0aW9ucyA9IHUuZXh0ZW5kKHsnQ29udGVudC1UeXBlJzogY29udGVudFR5cGV9LCBtZXRhcyk7XG5cbiAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSB0aGlzLmNsaWVudC5wdXRPYmplY3RGcm9tQmxvYihidWNrZXQsIG9iamVjdCwgZmlsZSwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0aW5nLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbZmlsZSwgMV0pO1xuXG4gICAgICAgIHJlc3BvbnNlLmJvZHkuYnVja2V0ID0gYnVja2V0O1xuICAgICAgICByZXNwb25zZS5ib2R5Lm9iamVjdCA9IG9iamVjdDtcblxuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtGaWxlVXBsb2FkZWQsIFtmaWxlLCByZXNwb25zZV0pO1xuICAgIH0pW1xuICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHZhciBldmVudFR5cGUgPSBzZWxmLmFib3J0ZWQgPyBldmVudHMua0Fib3J0ZWQgOiBldmVudHMua0Vycm9yO1xuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRUeXBlLCBbZXJyb3IsIGZpbGVdKTtcblxuICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzX2NvZGUgJiYgZXJyb3IuY29kZSAmJiBlcnJvci5yZXF1ZXN0X2lkKSB7XG4gICAgICAgICAgICAvLyDlupTor6XmmK/mraPluLjnmoTplJnor68o5q+U5aaC562+5ZCN5byC5bi4Ke+8jOi/meenjeaDheWGteWwseS4jeimgemHjeivleS6hlxuICAgICAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVsc2UgaWYgKGVycm9yLnN0YXR1c19jb2RlID09PSAwKSB7XG4gICAgICAgIC8vICAgIC8vIOWPr+iDveaYr+aWree9keS6hu+8jHNhZmFyaSDop6blj5Egb25saW5lL29mZmxpbmUg5bu26L+f5q+U6L6D5LmFXG4gICAgICAgIC8vICAgIC8vIOaIkeS7rOaOqOi/n+S4gOS4iyBzZWxmLl91cGxvYWROZXh0KCkg55qE5pe25py6XG4gICAgICAgIC8vICAgIHNlbGYucGF1c2UoKTtcbiAgICAgICAgLy8gICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIGVsc2UgaWYgKG1heFJldHJpZXMgPiAwICYmICFzZWxmLmFib3J0ZWQpIHtcbiAgICAgICAgICAgIC8vIOi/mOacieacuuS8mumHjeivlVxuICAgICAgICAgICAgcmV0dXJuIHV0aWxzLmRlbGF5KHJldHJ5SW50ZXJ2YWwpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnN0YXJ0KG1heFJldHJpZXMgLSAxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6YeN6K+V57uT5p2f5LqG77yM5LiN566h5LqG77yM57un57ut5LiL5LiA5Liq5paH5Lu255qE5LiK5LygXG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9KTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQdXRPYmplY3RUYXNrO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvcXVldWUuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qKlxuICogUXVldWVcbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7Kn0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbi5cbiAqL1xuZnVuY3Rpb24gUXVldWUoY29sbGVjdGlvbikge1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG59XG5cblF1ZXVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoIDw9IDA7XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmxlbmd0aDtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5kZXF1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uc2hpZnQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3RzX3Rva2VuX21hbmFnZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NSk7XG52YXIgdXRpbHMgPSByZXF1aXJlKDM0KTtcblxuLyoqXG4gKiBTdHNUb2tlbk1hbmFnZXJcbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zLlxuICovXG5mdW5jdGlvbiBTdHNUb2tlbk1hbmFnZXIob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xufVxuXG5TdHNUb2tlbk1hbmFnZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fY2FjaGVbYnVja2V0XSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9jYWNoZVtidWNrZXRdO1xuICAgIH1cblxuICAgIHJldHVybiBRLnJlc29sdmUodGhpcy5fZ2V0SW1wbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKS50aGVuKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHNlbGYuX2NhY2hlW2J1Y2tldF0gPSBwYXlsb2FkO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9KTtcbn07XG5cblN0c1Rva2VuTWFuYWdlci5wcm90b3R5cGUuX2dldEltcGwgPSBmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIHVwdG9rZW5fdXJsID0gb3B0aW9ucy51cHRva2VuX3VybDtcbiAgICB2YXIgdGltZW91dCA9IG9wdGlvbnMudXB0b2tlbl90aW1lb3V0IHx8IG9wdGlvbnMudXB0b2tlbl9qc29ucF90aW1lb3V0O1xuICAgIHZhciB2aWFKc29ucCA9IG9wdGlvbnMudXB0b2tlbl92aWFfanNvbnA7XG5cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cHRva2VuX3VybCxcbiAgICAgICAganNvbnA6IHZpYUpzb25wID8gJ2NhbGxiYWNrJyA6IGZhbHNlLFxuICAgICAgICBkYXRhVHlwZTogdmlhSnNvbnAgPyAnanNvbnAnIDogJ2pzb24nLFxuICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBzdHM6IEpTT04uc3RyaW5naWZ5KHV0aWxzLmdldERlZmF1bHRBQ0woYnVja2V0KSlcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgICAgIC8vIHBheWxvYWQuQWNjZXNzS2V5SWRcbiAgICAgICAgICAgIC8vIHBheWxvYWQuU2VjcmV0QWNjZXNzS2V5XG4gICAgICAgICAgICAvLyBwYXlsb2FkLlNlc3Npb25Ub2tlblxuICAgICAgICAgICAgLy8gcGF5bG9hZC5FeHBpcmF0aW9uXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignR2V0IHN0cyB0b2tlbiB0aW1lb3V0ICgnICsgdGltZW91dCArICdtcykuJykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RzVG9rZW5NYW5hZ2VyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSB0YXNrLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG5cbi8qKlxuICog5LiN5ZCM55qE5Zy65pmv5LiL77yM6ZyA6KaB6YCa6L+H5LiN5ZCM55qEVGFza+adpeWujOaIkOS4iuS8oOeahOW3peS9nFxuICpcbiAqIEBwYXJhbSB7c2RrLkJvc0NsaWVudH0gY2xpZW50IFRoZSBib3MgY2xpZW50LlxuICogQHBhcmFtIHtFdmVudERpc3BhdGNoZXJ9IGV2ZW50RGlzcGF0Y2hlciBUaGUgZXZlbnQgZGlzcGF0Y2hlci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBleHRyYSB0YXNrLXJlbGF0ZWQgYXJndW1lbnRzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUYXNrKGNsaWVudCwgZXZlbnREaXNwYXRjaGVyLCBvcHRpb25zKSB7XG4gICAgLyoqXG4gICAgICog5Y+v5Lul6KKrIGFib3J0IOeahCBwcm9taXNlIOWvueixoVxuICAgICAqXG4gICAgICogQHR5cGUge1Byb21pc2V9XG4gICAgICovXG4gICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIOagh+iusOS4gOS4i+aYr+WQpuaYr+S6uuS4uuS4reaWreS6hlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5hYm9ydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLm5ldHdvcmtJbmZvID0gbnVsbDtcblxuICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyID0gZXZlbnREaXNwYXRjaGVyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGFic3RyYWN0TWV0aG9kKCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndW5pbXBsZW1lbnRlZCBtZXRob2QuJyk7XG59XG5cbi8qKlxuICog5byA5aeL5LiK5Lyg5Lu75YqhXG4gKi9cblRhc2sucHJvdG90eXBlLnN0YXJ0ID0gYWJzdHJhY3RNZXRob2Q7XG5cbi8qKlxuICog5pqC5YGc5LiK5LygXG4gKi9cblRhc2sucHJvdG90eXBlLnBhdXNlID0gYWJzdHJhY3RNZXRob2Q7XG5cbi8qKlxuICog5oGi5aSN5pqC5YGcXG4gKi9cblRhc2sucHJvdG90eXBlLnJlc3VtZSA9IGFic3RyYWN0TWV0aG9kO1xuXG5UYXNrLnByb3RvdHlwZS5zZXROZXR3b3JrSW5mbyA9IGZ1bmN0aW9uIChuZXR3b3JrSW5mbykge1xuICAgIHRoaXMubmV0d29ya0luZm8gPSBuZXR3b3JrSW5mbztcbn07XG5cbi8qKlxuICog57uI5q2i5LiK5Lyg5Lu75YqhXG4gKi9cblRhc2sucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnhoclJlcXVlc3RpbmdcbiAgICAgICAgJiYgdHlwZW9mIHRoaXMueGhyUmVxdWVzdGluZy5hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnhoclJlcXVlc3RpbmcuYWJvcnQoKTtcbiAgICAgICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gbnVsbDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2s7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSAnTGljZW5zZScpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiAnQVMgSVMnIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL3RyYWNrZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cblxuLyoqXG4gKiDliJ3lp4vljJbnmb7luqbnu5/orqHku6PnoIFcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc2l0ZUlkIOeZvuW6pue7n+iuoeermeeCuUlELlxuICovXG5leHBvcnRzLmluaXQgPSBmdW5jdGlvbiAoc2l0ZUlkKSB7XG4gICAgdmFyIGhtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgaG0uc3JjID0gJy8vaG0uYmFpZHUuY29tL2htLmpzPycgKyBzaXRlSWQ7XG4gICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShobSwgcyk7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHVwbG9hZGVyLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDUpO1xudmFyIHUgPSByZXF1aXJlKDQ3KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzQpO1xudmFyIHRyYWNrZXIgPSByZXF1aXJlKDMyKTtcbnZhciBldmVudHMgPSByZXF1aXJlKDI1KTtcbnZhciBrRGVmYXVsdE9wdGlvbnMgPSByZXF1aXJlKDI0KTtcbnZhciBQdXRPYmplY3RUYXNrID0gcmVxdWlyZSgyOCk7XG52YXIgTXVsdGlwYXJ0VGFzayA9IHJlcXVpcmUoMjYpO1xudmFyIFN0c1Rva2VuTWFuYWdlciA9IHJlcXVpcmUoMzApO1xudmFyIE5ldHdvcmtJbmZvID0gcmVxdWlyZSgyNyk7XG5cbnZhciBBdXRoID0gcmVxdWlyZSgxNik7XG52YXIgQm9zQ2xpZW50ID0gcmVxdWlyZSgxOCk7XG5cbi8qKlxuICogQkNFIEJPUyBVcGxvYWRlclxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBvcHRpb25zIOmFjee9ruWPguaVsFxuICovXG5mdW5jdGlvbiBVcGxvYWRlcihvcHRpb25zKSB7XG4gICAgaWYgKHUuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgLy8g5pSv5oyB566A5L6/55qE5YaZ5rOV77yM5Y+v5Lul5LuOIERPTSDph4zpnaLliIbmnpDnm7jlhbPnmoTphY3nva4uXG4gICAgICAgIG9wdGlvbnMgPSB1LmV4dGVuZCh7XG4gICAgICAgICAgICBicm93c2VfYnV0dG9uOiBvcHRpb25zLFxuICAgICAgICAgICAgYXV0b19zdGFydDogdHJ1ZVxuICAgICAgICB9LCAkKG9wdGlvbnMpLmRhdGEoKSk7XG4gICAgfVxuXG4gICAgdmFyIHJ1bnRpbWVPcHRpb25zID0ge307XG4gICAgdGhpcy5vcHRpb25zID0gdS5leHRlbmQoe30sIGtEZWZhdWx0T3B0aW9ucywgcnVudGltZU9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplID0gdXRpbHMucGFyc2VTaXplKHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplKTtcbiAgICB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZVxuICAgICAgICA9IHV0aWxzLnBhcnNlU2l6ZSh0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZSk7XG4gICAgdGhpcy5vcHRpb25zLmNodW5rX3NpemUgPSB1dGlscy5wYXJzZVNpemUodGhpcy5vcHRpb25zLmNodW5rX3NpemUpO1xuXG4gICAgdmFyIGNyZWRlbnRpYWxzID0gdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscztcbiAgICBpZiAoIWNyZWRlbnRpYWxzICYmIHRoaXMub3B0aW9ucy5ib3NfYWsgJiYgdGhpcy5vcHRpb25zLmJvc19zaykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgYWs6IHRoaXMub3B0aW9ucy5ib3NfYWssXG4gICAgICAgICAgICBzazogdGhpcy5vcHRpb25zLmJvc19za1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb3NDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5jbGllbnQgPSBuZXcgQm9zQ2xpZW50KHtcbiAgICAgICAgZW5kcG9pbnQ6IHV0aWxzLm5vcm1hbGl6ZUVuZHBvaW50KHRoaXMub3B0aW9ucy5ib3NfZW5kcG9pbnQpLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscyxcbiAgICAgICAgc2Vzc2lvblRva2VuOiB0aGlzLm9wdGlvbnMudXB0b2tlblxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog6ZyA6KaB562J5b6F5LiK5Lyg55qE5paH5Lu25YiX6KGo77yM5q+P5qyh5LiK5Lyg55qE5pe25YCZ77yM5LuO6L+Z6YeM6Z2i5Yig6ZmkXG4gICAgICog5oiQ5Yqf5oiW6ICF5aSx6LSl6YO95LiN5Lya5YaN5pS+5Zue5Y675LqGXG4gICAgICogQHBhcmFtIHtBcnJheS48RmlsZT59XG4gICAgICovXG4gICAgdGhpcy5fZmlsZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIOato+WcqOS4iuS8oOeahOaWh+S7tuWIl+ihqC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgRmlsZT59XG4gICAgICovXG4gICAgdGhpcy5fdXBsb2FkaW5nRmlsZXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuiiq+S4reaWreS6hu+8jOavlOWmgiB0aGlzLnN0b3BcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9hYm9ydCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5aSE5LqO5LiK5Lyg55qE6L+H56iL5Lit77yM5Lmf5bCx5piv5q2j5Zyo5aSE55CGIHRoaXMuX2ZpbGVzIOmYn+WIl+eahOWGheWuuS5cbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl93b3JraW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKbmlK/mjIF4aHIyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5feGhyMlN1cHBvcnRlZCA9IHV0aWxzLmlzWGhyMlN1cHBvcnRlZCgpO1xuXG4gICAgdGhpcy5fbmV0d29ya0luZm8gPSBuZXcgTmV0d29ya0luZm8oKTtcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuVXBsb2FkZXIucHJvdG90eXBlLl9nZXRDdXN0b21pemVkU2lnbmF0dXJlID0gZnVuY3Rpb24gKHVwdG9rZW5VcmwpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgdGltZW91dCA9IG9wdGlvbnMudXB0b2tlbl90aW1lb3V0IHx8IG9wdGlvbnMudXB0b2tlbl9qc29ucF90aW1lb3V0O1xuICAgIHZhciB2aWFKc29ucCA9IG9wdGlvbnMudXB0b2tlbl92aWFfanNvbnA7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKF8sIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycykge1xuICAgICAgICBpZiAoL1xcYmVkPShbXFx3XFwuXSspXFxiLy50ZXN0KGxvY2F0aW9uLnNlYXJjaCkpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuSG9zdCA9IFJlZ0V4cC4kMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1LmlzQXJyYXkob3B0aW9ucy5hdXRoX3N0cmlwcGVkX2hlYWRlcnMpKSB7XG4gICAgICAgICAgICBoZWFkZXJzID0gdS5vbWl0KGhlYWRlcnMsIG9wdGlvbnMuYXV0aF9zdHJpcHBlZF9oZWFkZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdXB0b2tlblVybCxcbiAgICAgICAgICAgIGpzb25wOiB2aWFKc29ucCA/ICdjYWxsYmFjaycgOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiB2aWFKc29ucCA/ICdqc29ucCcgOiAnanNvbicsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGh0dHBNZXRob2Q6IGh0dHBNZXRob2QsXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAvLyBkZWxheTogfn4oTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICAgICAgICBxdWVyaWVzOiBKU09OLnN0cmluZ2lmeShwYXJhbXMgfHwge30pLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IEpTT04uc3RyaW5naWZ5KGhlYWRlcnMgfHwge30pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdHZXQgYXV0aG9yaXphdGlvbiB0aW1lb3V0ICgnICsgdGltZW91dCArICdtcykuJykpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQuc3RhdHVzQ29kZSA9PT0gMjAwICYmIHBheWxvYWQuc2lnbmF0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGF5bG9hZC5zaWduYXR1cmUsIHBheWxvYWQueGJjZURhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignY3JlYXRlU2lnbmF0dXJlIGZhaWxlZCwgc3RhdHVzQ29kZSA9ICcgKyBwYXlsb2FkLnN0YXR1c0NvZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiDosIPnlKggdGhpcy5vcHRpb25zLmluaXQg6YeM6Z2i6YWN572u55qE5pa55rOVXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUg5pa55rOV5ZCN56ewXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gYXJncyDosIPnlKjml7blgJnnmoTlj4LmlbAuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSB0aHJvd0Vycm9ycyDlpoLmnpzlj5HnlJ/lvILluLjnmoTml7blgJnvvIzmmK/lkKbpnIDopoHmipvlh7rmnaVcbiAqIEByZXR1cm4geyp9IOS6i+S7tueahOi/lOWbnuWAvC5cbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9pbnZva2UgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgYXJncywgdGhyb3dFcnJvcnMpIHtcbiAgICB2YXIgaW5pdCA9IHRoaXMub3B0aW9ucy5pbml0IHx8IHRoaXMub3B0aW9ucy5Jbml0O1xuICAgIGlmICghaW5pdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1ldGhvZCA9IGluaXRbbWV0aG9kTmFtZV07XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIHZhciB1cCA9IG51bGw7XG4gICAgICAgIGFyZ3MgPSBhcmdzID09IG51bGwgPyBbdXBdIDogW3VwXS5jb25jYXQoYXJncyk7XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgICBpZiAodGhyb3dFcnJvcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBRLnJlamVjdChleCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOWIneWni+WMluaOp+S7ti5cbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciBhY2NlcHQgPSBvcHRpb25zLmFjY2VwdDtcblxuICAgIGlmIChvcHRpb25zLnRyYWNrZXJfaWQpIHtcbiAgICAgICAgdHJhY2tlci5pbml0KG9wdGlvbnMudHJhY2tlcl9pZCk7XG4gICAgfVxuXG4gICAgdmFyIGJ0bkVsZW1lbnQgPSAkKG9wdGlvbnMuYnJvd3NlX2J1dHRvbik7XG4gICAgdmFyIG5vZGVOYW1lID0gYnRuRWxlbWVudC5wcm9wKCdub2RlTmFtZScpO1xuICAgIGlmIChub2RlTmFtZSAhPT0gJ0lOUFVUJykge1xuICAgICAgICB2YXIgZWxlbWVudENvbnRhaW5lciA9IGJ0bkVsZW1lbnQ7XG5cbiAgICAgICAgLy8g5aaC5p6c5pys6Lqr5LiN5pivIDxpbnB1dCB0eXBlPVwiZmlsZVwiIC8+77yM6Ieq5Yqo6L+95Yqg5LiA5Liq5LiK5Y67XG4gICAgICAgIC8vIDEuIG9wdGlvbnMuYnJvd3NlX2J1dHRvbiDlkI7pnaLov73liqDkuIDkuKrlhYPntKAgPGRpdj48aW5wdXQgdHlwZT1cImZpbGVcIiAvPjwvZGl2PlxuICAgICAgICAvLyAyLiBidG5FbGVtZW50LnBhcmVudCgpLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgICAgLy8gMy4gLmJjZS1ib3MtdXBsb2FkZXItaW5wdXQtY29udGFpbmVyIOeUqOadpeiHquWumuS5ieiHquW3seeahOagt+W8j1xuICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50Q29udGFpbmVyLm91dGVyV2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnRDb250YWluZXIub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICB2YXIgaW5wdXRFbGVtZW50Q29udGFpbmVyID0gJCgnPGRpdiBjbGFzcz1cImJjZS1ib3MtdXBsb2FkZXItaW5wdXQtY29udGFpbmVyXCI+PGlucHV0IHR5cGU9XCJmaWxlXCIgLz48L2Rpdj4nKTtcbiAgICAgICAgaW5wdXRFbGVtZW50Q29udGFpbmVyLmNzcyh7XG4gICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgJ3RvcCc6IDAsICdsZWZ0JzogMCxcbiAgICAgICAgICAgICd3aWR0aCc6IHdpZHRoLCAnaGVpZ2h0JzogaGVpZ2h0LFxuICAgICAgICAgICAgJ292ZXJmbG93JzogJ2hpZGRlbicsXG4gICAgICAgICAgICAvLyDlpoLmnpzmlK/mjIEgeGhyMu+8jOaKiiBpbnB1dFt0eXBlPWZpbGVdIOaUvuWIsOaMiemSrueahOS4i+mdou+8jOmAmui/h+S4u+WKqOiwg+eUqCBmaWxlLmNsaWNrKCkg6Kem5Y+RXG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3mlK/mjIF4aHIyLCDmioogaW5wdXRbdHlwZT1maWxlXSDmlL7liLDmjInpkq7nmoTkuIrpnaLvvIzpgJrov4fnlKjmiLfkuLvliqjngrnlh7sgaW5wdXRbdHlwZT1maWxlXSDop6blj5FcbiAgICAgICAgICAgICd6LWluZGV4JzogdGhpcy5feGhyMlN1cHBvcnRlZCA/IDk5IDogMTAwXG4gICAgICAgIH0pO1xuICAgICAgICBpbnB1dEVsZW1lbnRDb250YWluZXIuZmluZCgnaW5wdXQnKS5jc3Moe1xuICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICd0b3AnOiAwLCAnbGVmdCc6IDAsXG4gICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAnZm9udC1zaXplJzogJzk5OXB4JyxcbiAgICAgICAgICAgICdvcGFjaXR5JzogMFxuICAgICAgICB9KTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5jc3Moe1xuICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICd6LWluZGV4JzogdGhpcy5feGhyMlN1cHBvcnRlZCA/IDEwMCA6IDk5XG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtZW50Q29udGFpbmVyLmFmdGVyKGlucHV0RWxlbWVudENvbnRhaW5lcik7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIucGFyZW50KCkuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuXG4gICAgICAgIC8vIOaKiiBicm93c2VfYnV0dG9uIOS/ruaUueS4uuW9k+WJjeeUn+aIkOeahOmCo+S4quWFg+e0oFxuICAgICAgICBvcHRpb25zLmJyb3dzZV9idXR0b24gPSBpbnB1dEVsZW1lbnRDb250YWluZXIuZmluZCgnaW5wdXQnKTtcblxuICAgICAgICBpZiAodGhpcy5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICAgICAgZWxlbWVudENvbnRhaW5lci5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5icm93c2VfYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMuX3hocjJTdXBwb3J0ZWRcbiAgICAgICAgJiYgdHlwZW9mIG1PeGllICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAmJiB1LmlzRnVuY3Rpb24obU94aWUuRmlsZUlucHV0KSkge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW94aWVjb2RlL21veGllL3dpa2kvRmlsZUlucHV0XG4gICAgICAgIC8vIG1PeGllLkZpbGVJbnB1dCDlj6rmlK/mjIFcbiAgICAgICAgLy8gWytdOiBicm93c2VfYnV0dG9uLCBhY2NlcHQgbXVsdGlwbGUsIGRpcmVjdG9yeSwgZmlsZVxuICAgICAgICAvLyBbeF06IGNvbnRhaW5lciwgcmVxdWlyZWRfY2Fwc1xuICAgICAgICB2YXIgZmlsZUlucHV0ID0gbmV3IG1PeGllLkZpbGVJbnB1dCh7XG4gICAgICAgICAgICBydW50aW1lX29yZGVyOiAnZmxhc2gsaHRtbDQnLFxuICAgICAgICAgICAgYnJvd3NlX2J1dHRvbjogJChvcHRpb25zLmJyb3dzZV9idXR0b24pLmdldCgwKSxcbiAgICAgICAgICAgIHN3Zl91cmw6IG9wdGlvbnMuZmxhc2hfc3dmX3VybCxcbiAgICAgICAgICAgIGFjY2VwdDogdXRpbHMuZXhwYW5kQWNjZXB0VG9BcnJheShhY2NlcHQpLFxuICAgICAgICAgICAgbXVsdGlwbGU6IG9wdGlvbnMubXVsdGlfc2VsZWN0aW9uLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBvcHRpb25zLmRpcl9zZWxlY3Rpb24sXG4gICAgICAgICAgICBmaWxlOiAnZmlsZScgICAgICAvLyBQb3N0T2JqZWN05o6l5Y+j6KaB5rGC5Zu65a6a5pivICdmaWxlJ1xuICAgICAgICB9KTtcblxuICAgICAgICBmaWxlSW5wdXQub25jaGFuZ2UgPSB1LmJpbmQodGhpcy5fb25GaWxlc0FkZGVkLCB0aGlzKTtcbiAgICAgICAgZmlsZUlucHV0Lm9ucmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLl9pbml0RXZlbnRzKCk7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtQb3N0SW5pdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZmlsZUlucHV0LmluaXQoKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvbWlzZSA9IG9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzXG4gICAgICAgID8gUS5yZXNvbHZlKClcbiAgICAgICAgOiBzZWxmLnJlZnJlc2hTdHNUb2tlbigpO1xuXG4gICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICBzZWxmLmNsaWVudC5jcmVhdGVTaWduYXR1cmUgPSBmdW5jdGlvbiAoXywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0gXyB8fCB0aGlzLmNvbmZpZy5jcmVkZW50aWFscztcbiAgICAgICAgICAgICAgICByZXR1cm4gUS5mY2FsbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRoID0gbmV3IEF1dGgoY3JlZGVudGlhbHMuYWssIGNyZWRlbnRpYWxzLnNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF1dGguZ2VuZXJhdGVBdXRob3JpemF0aW9uKGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMudXB0b2tlbl91cmwgJiYgb3B0aW9ucy5nZXRfbmV3X3VwdG9rZW4gPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIOacjeWKoeerr+WKqOaAgeetvuWQjeeahOaWueW8j1xuICAgICAgICAgICAgc2VsZi5jbGllbnQuY3JlYXRlU2lnbmF0dXJlID0gc2VsZi5fZ2V0Q3VzdG9taXplZFNpZ25hdHVyZShvcHRpb25zLnVwdG9rZW5fdXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAvLyDlr7nkuo7kuI3mlK/mjIEgeGhyMiDnmoTmg4XlhrXvvIzkvJrlnKggb25yZWFkeSDnmoTml7blgJnljrvop6blj5Hkuovku7ZcbiAgICAgICAgICAgIHNlbGYuX2luaXRFdmVudHMoKTtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua1Bvc3RJbml0KTtcbiAgICAgICAgfVxuICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0Vycm9yLCBbZXJyb3JdKTtcbiAgICB9KTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmICh0aGlzLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgIHZhciBidG4gPSAkKG9wdGlvbnMuYnJvd3NlX2J1dHRvbik7XG4gICAgICAgIGlmIChidG4uYXR0cignbXVsdGlwbGUnKSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpznlKjmiLfmsqHmnInmmL7npLrnmoTorr7nva7ov4cgbXVsdGlwbGXvvIzkvb/nlKggbXVsdGlfc2VsZWN0aW9uIOeahOiuvue9rlxuICAgICAgICAgICAgLy8g5ZCm5YiZ5L+d55WZIDxpbnB1dCBtdWx0aXBsZSAvPiDnmoTlhoXlrrlcbiAgICAgICAgICAgIGJ0bi5hdHRyKCdtdWx0aXBsZScsICEhb3B0aW9ucy5tdWx0aV9zZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGJ0bi5vbignY2hhbmdlJywgdS5iaW5kKHRoaXMuX29uRmlsZXNBZGRlZCwgdGhpcykpO1xuXG4gICAgICAgIHZhciBhY2NlcHQgPSBvcHRpb25zLmFjY2VwdDtcbiAgICAgICAgaWYgKGFjY2VwdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBTYWZhcmkg5Y+q5pSv5oyBIG1pbWUtdHlwZVxuICAgICAgICAgICAgLy8gQ2hyb21lIOaUr+aMgSBtaW1lLXR5cGUg5ZKMIGV4dHNcbiAgICAgICAgICAgIC8vIEZpcmVmb3gg5Y+q5pSv5oyBIGV4dHNcbiAgICAgICAgICAgIC8vIE5PVEU6IGV4dHMg5b+F6aG75pyJIC4g6L+Z5Liq5YmN57yA77yM5L6L5aaCIC50eHQg5piv5ZCI5rOV55qE77yMdHh0IOaYr+S4jeWQiOazleeahFxuICAgICAgICAgICAgdmFyIGV4dHMgPSB1dGlscy5leHBhbmRBY2NlcHQoYWNjZXB0KTtcbiAgICAgICAgICAgIHZhciBpc1NhZmFyaSA9IC9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FwcGxlIENvbXB1dGVyLy50ZXN0KG5hdmlnYXRvci52ZW5kb3IpO1xuICAgICAgICAgICAgaWYgKGlzU2FmYXJpKSB7XG4gICAgICAgICAgICAgICAgZXh0cyA9IHV0aWxzLmV4dFRvTWltZVR5cGUoZXh0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uYXR0cignYWNjZXB0JywgZXh0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5kaXJfc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBidG4uYXR0cignZGlyZWN0b3J5JywgdHJ1ZSk7XG4gICAgICAgICAgICBidG4uYXR0cignbW96ZGlyZWN0b3J5JywgdHJ1ZSk7XG4gICAgICAgICAgICBidG4uYXR0cignd2Via2l0ZGlyZWN0b3J5JywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsaWVudC5vbigncHJvZ3Jlc3MnLCB1LmJpbmQodGhpcy5fb25VcGxvYWRQcm9ncmVzcywgdGhpcykpO1xuICAgIC8vIFhYWCDlv4Xpobvnu5HlrpogZXJyb3Ig55qE5aSE55CG5Ye95pWw77yM5ZCm5YiZ5LyaIHRocm93IG5ldyBFcnJvclxuICAgIHRoaXMuY2xpZW50Lm9uKCdlcnJvcicsIHUuYmluZCh0aGlzLl9vbkVycm9yLCB0aGlzKSk7XG5cbiAgICAvLyAkKHdpbmRvdykub24oJ29ubGluZScsIHUuYmluZCh0aGlzLl9oYW5kbGVPbmxpbmVTdGF0dXMsIHRoaXMpKTtcbiAgICAvLyAkKHdpbmRvdykub24oJ29mZmxpbmUnLCB1LmJpbmQodGhpcy5faGFuZGxlT2ZmbGluZVN0YXR1cywgdGhpcykpO1xuXG4gICAgaWYgKCF0aGlzLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgIC8vIOWmguaenOa1j+iniOWZqOS4jeaUr+aMgSB4aHIy77yM6YKj5LmI5bCx5YiH5o2i5YiwIG1PeGllLlhNTEh0dHBSZXF1ZXN0XG4gICAgICAgIC8vIOS9huaYr+WboOS4uiBtT3hpZS5YTUxIdHRwUmVxdWVzdCDml6Dms5Xlj5HpgIEgSEVBRCDor7fmsYLvvIzml6Dms5Xojrflj5YgUmVzcG9uc2UgSGVhZGVyc++8jFxuICAgICAgICAvLyDlm6DmraQgZ2V0T2JqZWN0TWV0YWRhdGHlrp7pmYXkuIrml6Dms5XmraPluLjlt6XkvZzvvIzlm6DmraTmiJHku6zpnIDopoHvvJpcbiAgICAgICAgLy8gMS4g6K6pIEJPUyDmlrDlop4gUkVTVCBBUEnvvIzlnKggR0VUIOeahOivt+axgueahOWQjOaXtu+8jOaKiiB4LWJjZS0qIOaUvuWIsCBSZXNwb25zZSBCb2R5IOi/lOWbnlxuICAgICAgICAvLyAyLiDkuLTml7bmlrnmoYjvvJrmlrDlop7kuIDkuKogUmVsYXkg5pyN5Yqh77yM5a6e546w5pa55qGIIDFcbiAgICAgICAgLy8gICAgR0VUIC9iai5iY2Vib3MuY29tL3YxL2J1Y2tldC9vYmplY3Q/aHR0cE1ldGhvZD1IRUFEXG4gICAgICAgIC8vICAgIEhvc3Q6IHJlbGF5LmVmZS50ZWNoXG4gICAgICAgIC8vICAgIEF1dGhvcml6YXRpb246IHh4eFxuICAgICAgICAvLyBvcHRpb25zLmJvc19yZWxheV9zZXJ2ZXJcbiAgICAgICAgLy8gb3B0aW9ucy5zd2ZfdXJsXG4gICAgICAgIHRoaXMuY2xpZW50LnNlbmRIVFRQUmVxdWVzdCA9IHUuYmluZCh1dGlscy5maXhYaHIodGhpcy5vcHRpb25zLCB0cnVlKSwgdGhpcy5jbGllbnQpO1xuICAgIH1cbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fZmlsdGVyRmlsZXMgPSBmdW5jdGlvbiAoY2FuZGlkYXRlcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIOWmguaenCBtYXhGaWxlU2l6ZSA9PT0gMCDlsLHor7TmmI7kuI3pmZDliLblpKflsI9cbiAgICB2YXIgbWF4RmlsZVNpemUgPSB0aGlzLm9wdGlvbnMubWF4X2ZpbGVfc2l6ZTtcblxuICAgIHZhciBmaWxlcyA9IHUuZmlsdGVyKGNhbmRpZGF0ZXMsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGlmIChtYXhGaWxlU2l6ZSA+IDAgJiYgZmlsZS5zaXplID4gbWF4RmlsZVNpemUpIHtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0ZpbGVGaWx0ZXJlZCwgW2ZpbGVdKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8g5qOA5p+l5ZCO57yA5LmL57G755qEXG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5faW52b2tlKGV2ZW50cy5rRmlsZXNGaWx0ZXIsIFtmaWxlc10pIHx8IGZpbGVzO1xufTtcblxuZnVuY3Rpb24gYnVpbGRBYm9ydEhhbmRsZXIoaXRlbSwgc2VsZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0ZW0uX2Fib3J0ZWQgPSB0cnVlO1xuICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtBYm9ydGVkLCBbbnVsbCwgaXRlbV0pO1xuICAgIH07XG59XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fb25GaWxlc0FkZGVkID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZpbGVzID0gZS50YXJnZXQuZmlsZXM7XG4gICAgaWYgKCFmaWxlcykge1xuICAgICAgICAvLyBJRTcsIElFOCDkvY7niYjmnKzmtY/op4jlmajnmoTlpITnkIZcbiAgICAgICAgdmFyIG5hbWUgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCgvW1xcL1xcXFxdLykucG9wKCk7XG4gICAgICAgIGZpbGVzID0gW1xuICAgICAgICAgICAge25hbWU6IG5hbWUsIHNpemU6IDB9XG4gICAgICAgIF07XG4gICAgfVxuICAgIGZpbGVzID0gdGhpcy5fZmlsdGVyRmlsZXMoZmlsZXMpO1xuICAgIGlmICh1LmlzQXJyYXkoZmlsZXMpICYmIGZpbGVzLmxlbmd0aCkge1xuICAgICAgICB2YXIgdG90YWxCeXRlcyA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZmlsZXNbaV07XG5cbiAgICAgICAgICAgIC8vIOi/memHjOaYryBhYm9ydCDnmoTpu5jorqTlrp7njrDvvIzlvIDlp4vkuIrkvKDnmoTml7blgJnvvIzkvJrmlLnmiJDlj6blpJbnmoTkuIDnp43lrp7njrDmlrnlvI9cbiAgICAgICAgICAgIC8vIOm7mOiupOeahOWunueOsOaYr+S4uuS6huaUr+aMgeWcqOayoeacieW8gOWni+S4iuS8oOS5i+WJje+8jOS5n+WPr+S7peWPlua2iOS4iuS8oOeahOmcgOaxglxuICAgICAgICAgICAgaXRlbS5hYm9ydCA9IGJ1aWxkQWJvcnRIYW5kbGVyKGl0ZW0sIHNlbGYpO1xuXG4gICAgICAgICAgICAvLyDlhoXpg6jnmoQgdXVpZO+8jOWklumDqOS5n+WPr+S7peS9v+eUqO+8jOavlOWmgiByZW1vdmUoaXRlbS51dWlkKSAvIHJlbW92ZShpdGVtKVxuICAgICAgICAgICAgaXRlbS51dWlkID0gdXRpbHMudXVpZCgpO1xuXG4gICAgICAgICAgICB0b3RhbEJ5dGVzICs9IGl0ZW0uc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9uZXR3b3JrSW5mby50b3RhbEJ5dGVzICs9IHRvdGFsQnl0ZXM7XG4gICAgICAgIHRoaXMuX2ZpbGVzLnB1c2guYXBwbHkodGhpcy5fZmlsZXMsIGZpbGVzKTtcbiAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rRmlsZXNBZGRlZCwgW2ZpbGVzXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvX3N0YXJ0KSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX29uRXJyb3IgPSBmdW5jdGlvbiAoZSkge1xufTtcblxuLyoqXG4gKiDlpITnkIbkuIrkvKDov5vluqbnmoTlm57mjonlh73mlbAuXG4gKiAxLiDov5nph4zopoHljLrliIbmlofku7bnmoTkuIrkvKDov5jmmK/liIbniYfnmoTkuIrkvKDvvIzliIbniYfnmoTkuIrkvKDmmK/pgJrov4cgcGFydE51bWJlciDlkowgdXBsb2FkSWQg55qE57uE5ZCI5p2l5Yik5pat55qEXG4gKiAyLiBJRTYsNyw4LDnkuIvpnaLvvIzmmK/kuI3pnIDopoHogIPomZHnmoTvvIzlm6DkuLrkuI3kvJrop6blj5Hov5nkuKrkuovku7bvvIzogIzmmK/nm7TmjqXlnKggX3NlbmRQb3N0UmVxdWVzdCDop6blj5Ega1VwbG9hZFByb2dyZXNzIOS6hlxuICogMy4g5YW25a6D5oOF5Ya15LiL77yM5oiR5Lus5Yik5pat5LiA5LiLIFJlcXVlc3QgQm9keSDnmoTnsbvlnovmmK/lkKbmmK8gQmxvYu+8jOS7juiAjOmBv+WFjeWvueS6juWFtuWug+exu+Wei+eahOivt+axgu+8jOinpuWPkSBrVXBsb2FkUHJvZ3Jlc3NcbiAqICAgIOS+i+Wmgu+8mkhFQUTvvIxHRVTvvIxQT1NUKEluaXRNdWx0aXBhcnQpIOeahOaXtuWAme+8jOaYr+ayoeW/heimgeinpuWPkSBrVXBsb2FkUHJvZ3Jlc3Mg55qEXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGUgIFByb2dyZXNzIEV2ZW50IOWvueixoS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBodHRwQ29udGV4dCBzZW5kSFRUUFJlcXVlc3Qg55qE5Y+C5pWwXG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5fb25VcGxvYWRQcm9ncmVzcyA9IGZ1bmN0aW9uIChlLCBodHRwQ29udGV4dCkge1xuICAgIHZhciBhcmdzID0gaHR0cENvbnRleHQuYXJncztcbiAgICB2YXIgZmlsZSA9IGFyZ3MuYm9keTtcblxuICAgIGlmICghdXRpbHMuaXNCbG9iKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcHJvZ3Jlc3MgPSBlLmxlbmd0aENvbXB1dGFibGVcbiAgICAgICAgPyBlLmxvYWRlZCAvIGUudG90YWxcbiAgICAgICAgOiAwO1xuXG4gICAgdGhpcy5fbmV0d29ya0luZm8ubG9hZGVkQnl0ZXMgKz0gKGUubG9hZGVkIC0gZmlsZS5fcHJldmlvdXNMb2FkZWQpO1xuICAgIHRoaXMuX2ludm9rZShldmVudHMua05ldHdvcmtTcGVlZCwgdGhpcy5fbmV0d29ya0luZm8uZHVtcCgpKTtcbiAgICBmaWxlLl9wcmV2aW91c0xvYWRlZCA9IGUubG9hZGVkO1xuXG4gICAgdmFyIGV2ZW50VHlwZSA9IGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3M7XG4gICAgaWYgKGFyZ3MucGFyYW1zLnBhcnROdW1iZXIgJiYgYXJncy5wYXJhbXMudXBsb2FkSWQpIHtcbiAgICAgICAgLy8gSUU2LDcsOCw55LiL6Z2i5LiN5Lya5pyJcGFydE51bWJlcuWSjHVwbG9hZElkXG4gICAgICAgIC8vIOatpOaXtueahCBmaWxlIOaYryBzbGljZSDnmoTnu5PmnpzvvIzlj6/og73msqHmnInoh6rlrprkuYnnmoTlsZ7mgKdcbiAgICAgICAgLy8g5q+U5aaCIGRlbW8g6YeM6Z2i55qEIF9faWQsIF9fbWVkaWFJZCDkuYvnsbvnmoRcbiAgICAgICAgZXZlbnRUeXBlID0gZXZlbnRzLmtVcGxvYWRQYXJ0UHJvZ3Jlc3M7XG4gICAgfVxuXG4gICAgdGhpcy5faW52b2tlKGV2ZW50VHlwZSwgW2ZpbGUsIHByb2dyZXNzLCBlXSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGl0ZW0gPSB0aGlzLl91cGxvYWRpbmdGaWxlc1tpdGVtXSB8fCB1LmZpbmQodGhpcy5fZmlsZXMsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS51dWlkID09PSBpdGVtO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbS5hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpdGVtLmFib3J0KCk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICh0aGlzLl93b3JraW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3dvcmtpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9hYm9ydCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9uZXR3b3JrSW5mby5yZXNldCgpO1xuXG4gICAgICAgIHZhciB0YXNrUGFyYWxsZWwgPSB0aGlzLm9wdGlvbnMuYm9zX3Rhc2tfcGFyYWxsZWw7XG4gICAgICAgIHV0aWxzLmVhY2hMaW1pdCh0aGlzLl9maWxlcywgdGFza1BhcmFsbGVsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGZpbGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgZmlsZS5fcHJldmlvdXNMb2FkZWQgPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYuX3VwbG9hZE5leHQoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnVsZmlsbG1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl91cGxvYWRpbmdGaWxlc1tmaWxlLnV1aWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pW1xuICAgICAgICAgICAgICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlamVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fd29ya2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZpbGVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5fbmV0d29ya0luZm8udG90YWxCeXRlcyA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rVXBsb2FkQ29tcGxldGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fYWJvcnQgPSB0cnVlO1xuICAgIHRoaXMuX3dvcmtpbmcgPSBmYWxzZTtcbn07XG5cbi8qKlxuICog5Yqo5oCB6K6+572uIFVwbG9hZGVyIOeahOafkOS6m+WPguaVsO+8jOW9k+WJjeWPquaUr+aMgeWKqOaAgeeahOS/ruaUuVxuICogYm9zX2NyZWRlbnRpYWxzLCB1cHRva2VuLCBib3NfYnVja2V0LCBib3NfZW5kcG9pbnRcbiAqIGJvc19haywgYm9zX3NrXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg55So5oi35Yqo5oCB6K6+572u55qE5Y+C5pWw77yI5Y+q5pSv5oyB6YOo5YiG77yJXG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc3VwcG9ydGVkT3B0aW9ucyA9IHUucGljayhvcHRpb25zLCAnYm9zX2NyZWRlbnRpYWxzJyxcbiAgICAgICAgJ2Jvc19haycsICdib3Nfc2snLCAndXB0b2tlbicsICdib3NfYnVja2V0JywgJ2Jvc19lbmRwb2ludCcpO1xuICAgIHRoaXMub3B0aW9ucyA9IHUuZXh0ZW5kKHRoaXMub3B0aW9ucywgc3VwcG9ydGVkT3B0aW9ucyk7XG5cbiAgICB2YXIgY29uZmlnID0gdGhpcy5jbGllbnQgJiYgdGhpcy5jbGllbnQuY29uZmlnO1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0gbnVsbDtcblxuICAgICAgICBpZiAob3B0aW9ucy5ib3NfY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0gb3B0aW9ucy5ib3NfY3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5ib3NfYWsgJiYgb3B0aW9ucy5ib3Nfc2spIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIGFrOiBvcHRpb25zLmJvc19hayxcbiAgICAgICAgICAgICAgICBzazogb3B0aW9ucy5ib3Nfc2tcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5ib3NfY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscztcbiAgICAgICAgICAgIGNvbmZpZy5jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnVwdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5zZXNzaW9uVG9rZW4gPSBvcHRpb25zLnVwdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuYm9zX2VuZHBvaW50KSB7XG4gICAgICAgICAgICBjb25maWcuZW5kcG9pbnQgPSB1dGlscy5ub3JtYWxpemVFbmRwb2ludChvcHRpb25zLmJvc19lbmRwb2ludCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOacieeahOeUqOaIt+W4jOacm+S4u+WKqOabtOaWsCBzdHMgdG9rZW7vvIzpgb/lhY3ov4fmnJ/nmoTpl67pophcbiAqXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5VcGxvYWRlci5wcm90b3R5cGUucmVmcmVzaFN0c1Rva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICB2YXIgc3RzTW9kZSA9IHNlbGYuX3hocjJTdXBwb3J0ZWRcbiAgICAgICAgJiYgb3B0aW9ucy51cHRva2VuX3VybFxuICAgICAgICAmJiBvcHRpb25zLmdldF9uZXdfdXB0b2tlbiA9PT0gZmFsc2U7XG4gICAgaWYgKHN0c01vZGUpIHtcbiAgICAgICAgdmFyIHN0bSA9IG5ldyBTdHNUb2tlbk1hbmFnZXIob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBzdG0uZ2V0KG9wdGlvbnMuYm9zX2J1Y2tldCkudGhlbihmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2V0T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgYm9zX2FrOiBwYXlsb2FkLkFjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICAgIGJvc19zazogcGF5bG9hZC5TZWNyZXRBY2Nlc3NLZXksXG4gICAgICAgICAgICAgICAgdXB0b2tlbjogcGF5bG9hZC5TZXNzaW9uVG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl91cGxvYWROZXh0ID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICBpZiAodGhpcy5fYWJvcnQpIHtcbiAgICAgICAgdGhpcy5fd29ya2luZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgaWYgKGZpbGUuX2Fib3J0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciB0aHJvd0Vycm9ycyA9IHRydWU7XG4gICAgdmFyIHJldHVyblZhbHVlID0gdGhpcy5faW52b2tlKGV2ZW50cy5rQmVmb3JlVXBsb2FkLCBbZmlsZV0sIHRocm93RXJyb3JzKTtcbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIFEucmVzb2x2ZShyZXR1cm5WYWx1ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZE5leHRJbXBsKGZpbGUpO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0Vycm9yLCBbZXJyb3IsIGZpbGVdKTtcbiAgICAgICAgfSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX3VwbG9hZE5leHRJbXBsID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIG9iamVjdCA9IGZpbGUubmFtZTtcbiAgICB2YXIgdGhyb3dFcnJvcnMgPSB0cnVlO1xuXG4gICAgdmFyIGRlZmF1bHRUYXNrT3B0aW9ucyA9IHUucGljayhvcHRpb25zLFxuICAgICAgICAnZmxhc2hfc3dmX3VybCcsICdtYXhfcmV0cmllcycsICdjaHVua19zaXplJywgJ3JldHJ5X2ludGVydmFsJyxcbiAgICAgICAgJ2Jvc19tdWx0aXBhcnRfcGFyYWxsZWwnLFxuICAgICAgICAnYm9zX211bHRpcGFydF9hdXRvX2NvbnRpbnVlJyxcbiAgICAgICAgJ2Jvc19tdWx0aXBhcnRfbG9jYWxfa2V5X2dlbmVyYXRvcidcbiAgICApO1xuICAgIHJldHVybiBRLmFsbChbXG4gICAgICAgIHRoaXMuX2ludm9rZShldmVudHMua0tleSwgW2ZpbGVdLCB0aHJvd0Vycm9ycyksXG4gICAgICAgIHRoaXMuX2ludm9rZShldmVudHMua09iamVjdE1ldGFzLCBbZmlsZV0pXG4gICAgXSkudGhlbihmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgICAgLy8gb3B0aW9ucy5ib3NfYnVja2V0IOWPr+iDveS8muiiqyBrS2V5IOS6i+S7tuWKqOaAgeeahOaUueWPmFxuICAgICAgICB2YXIgYnVja2V0ID0gb3B0aW9ucy5ib3NfYnVja2V0O1xuXG4gICAgICAgIHZhciByZXN1bHQgPSBhcnJheVswXTtcbiAgICAgICAgdmFyIG9iamVjdE1ldGFzID0gYXJyYXlbMV07XG5cbiAgICAgICAgdmFyIG11bHRpcGFydCA9ICdhdXRvJztcbiAgICAgICAgaWYgKHUuaXNTdHJpbmcocmVzdWx0KSkge1xuICAgICAgICAgICAgb2JqZWN0ID0gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHUuaXNPYmplY3QocmVzdWx0KSkge1xuICAgICAgICAgICAgYnVja2V0ID0gcmVzdWx0LmJ1Y2tldCB8fCBidWNrZXQ7XG4gICAgICAgICAgICBvYmplY3QgPSByZXN1bHQua2V5IHx8IG9iamVjdDtcblxuICAgICAgICAgICAgLy8gJ2F1dG8nIC8gJ29mZidcbiAgICAgICAgICAgIG11bHRpcGFydCA9IHJlc3VsdC5tdWx0aXBhcnQgfHwgbXVsdGlwYXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNsaWVudCA9IHNlbGYuY2xpZW50O1xuICAgICAgICB2YXIgZXZlbnREaXNwYXRjaGVyID0gc2VsZjtcbiAgICAgICAgdmFyIHRhc2tPcHRpb25zID0gdS5leHRlbmQoZGVmYXVsdFRhc2tPcHRpb25zLCB7XG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgICAgIG1ldGFzOiBvYmplY3RNZXRhc1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgdGFzayA9IG51bGw7XG4gICAgICAgIGlmIChtdWx0aXBhcnQgPT09ICdhdXRvJyAmJiBmaWxlLnNpemUgPiBvcHRpb25zLmJvc19tdWx0aXBhcnRfbWluX3NpemUpIHtcbiAgICAgICAgICAgIHRhc2sgPSBuZXcgTXVsdGlwYXJ0VGFzayhjbGllbnQsIGV2ZW50RGlzcGF0Y2hlciwgdGFza09wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGFzayA9IG5ldyBQdXRPYmplY3RUYXNrKGNsaWVudCwgZXZlbnREaXNwYXRjaGVyLCB0YXNrT3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl91cGxvYWRpbmdGaWxlc1tmaWxlLnV1aWRdID0gZmlsZTtcblxuICAgICAgICBmaWxlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZmlsZS5fYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGFzay5hYm9ydCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRhc2suc2V0TmV0d29ya0luZm8oc2VsZi5fbmV0d29ya0luZm8pO1xuICAgICAgICByZXR1cm4gdGFzay5zdGFydCgpO1xuICAgIH0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBldmVudEFyZ3VtZW50cywgdGhyb3dFcnJvcnMpIHtcbiAgICBpZiAoZXZlbnROYW1lID09PSBldmVudHMua0Fib3J0ZWRcbiAgICAgICAgJiYgZXZlbnRBcmd1bWVudHNcbiAgICAgICAgJiYgZXZlbnRBcmd1bWVudHNbMV0pIHtcbiAgICAgICAgdmFyIGZpbGUgPSBldmVudEFyZ3VtZW50c1sxXTtcbiAgICAgICAgaWYgKGZpbGUuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIHZhciBsb2FkZWRTaXplID0gZmlsZS5fcHJldmlvdXNMb2FkZWQgfHwgMDtcbiAgICAgICAgICAgIHRoaXMuX25ldHdvcmtJbmZvLnRvdGFsQnl0ZXMgLT0gKGZpbGUuc2l6ZSAtIGxvYWRlZFNpemUpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rTmV0d29ya1NwZWVkLCB0aGlzLl9uZXR3b3JrSW5mby5kdW1wKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pbnZva2UoZXZlbnROYW1lLCBldmVudEFyZ3VtZW50cywgdGhyb3dFcnJvcnMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgdXRpbHMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBxc01vZHVsZSA9IHJlcXVpcmUoNDYpO1xudmFyIFEgPSByZXF1aXJlKDQ1KTtcbnZhciB1ID0gcmVxdWlyZSg0Nyk7XG52YXIgUXVldWUgPSByZXF1aXJlKDI5KTtcbnZhciBNaW1lVHlwZSA9IHJlcXVpcmUoMjIpO1xuXG4vKipcbiAqIOaKiuaWh+S7tui/m+ihjOWIh+eJh++8jOi/lOWbnuWIh+eJh+S5i+WQjueahOaVsOe7hFxuICpcbiAqIEBwYXJhbSB7QmxvYn0gZmlsZSDpnIDopoHliIfniYfnmoTlpKfmlofku7YuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXBsb2FkSWQg5LuO5pyN5Yqh6I635Y+W55qEdXBsb2FkSWQuXG4gKiBAcGFyYW0ge251bWJlcn0gY2h1bmtTaXplIOWIhueJh+eahOWkp+Wwjy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBidWNrZXQgQnVja2V0IE5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqZWN0IE9iamVjdCBOYW1lLlxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbmV4cG9ydHMuZ2V0VGFza3MgPSBmdW5jdGlvbiAoZmlsZSwgdXBsb2FkSWQsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QpIHtcbiAgICB2YXIgbGVmdFNpemUgPSBmaWxlLnNpemU7XG4gICAgdmFyIG9mZnNldCA9IDA7XG4gICAgdmFyIHBhcnROdW1iZXIgPSAxO1xuXG4gICAgdmFyIHRhc2tzID0gW107XG5cbiAgICB3aGlsZSAobGVmdFNpemUgPiAwKSB7XG4gICAgICAgIHZhciBwYXJ0U2l6ZSA9IE1hdGgubWluKGxlZnRTaXplLCBjaHVua1NpemUpO1xuXG4gICAgICAgIHRhc2tzLnB1c2goe1xuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIHVwbG9hZElkOiB1cGxvYWRJZCxcbiAgICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgICBwYXJ0TnVtYmVyOiBwYXJ0TnVtYmVyLFxuICAgICAgICAgICAgcGFydFNpemU6IHBhcnRTaXplLFxuICAgICAgICAgICAgc3RhcnQ6IG9mZnNldCxcbiAgICAgICAgICAgIHN0b3A6IG9mZnNldCArIHBhcnRTaXplIC0gMVxuICAgICAgICB9KTtcblxuICAgICAgICBsZWZ0U2l6ZSAtPSBwYXJ0U2l6ZTtcbiAgICAgICAgb2Zmc2V0ICs9IHBhcnRTaXplO1xuICAgICAgICBwYXJ0TnVtYmVyICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhc2tzO1xufTtcblxuZXhwb3J0cy5nZXRBcHBlbmRhYmxlVGFza3MgPSBmdW5jdGlvbiAoZmlsZVNpemUsIG9mZnNldCwgY2h1bmtTaXplKSB7XG4gICAgdmFyIGxlZnRTaXplID0gZmlsZVNpemUgLSBvZmZzZXQ7XG4gICAgdmFyIHRhc2tzID0gW107XG5cbiAgICB3aGlsZSAobGVmdFNpemUpIHtcbiAgICAgICAgdmFyIHBhcnRTaXplID0gTWF0aC5taW4obGVmdFNpemUsIGNodW5rU2l6ZSk7XG4gICAgICAgIHRhc2tzLnB1c2goe1xuICAgICAgICAgICAgcGFydFNpemU6IHBhcnRTaXplLFxuICAgICAgICAgICAgc3RhcnQ6IG9mZnNldCxcbiAgICAgICAgICAgIHN0b3A6IG9mZnNldCArIHBhcnRTaXplIC0gMVxuICAgICAgICB9KTtcblxuICAgICAgICBsZWZ0U2l6ZSAtPSBwYXJ0U2l6ZTtcbiAgICAgICAgb2Zmc2V0ICs9IHBhcnRTaXplO1xuICAgIH1cbiAgICByZXR1cm4gdGFza3M7XG59O1xuXG5leHBvcnRzLnBhcnNlU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gICAgaWYgKHR5cGVvZiBzaXplID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICAvLyBtYiBNQiBNYiBNXG4gICAgLy8ga2IgS0Iga2Iga1xuICAgIC8vIDEwMFxuICAgIHZhciBwYXR0ZXJuID0gL14oW1xcZFxcLl0rKShbbWtnXT9iPykkL2k7XG4gICAgdmFyIG1hdGNoID0gcGF0dGVybi5leGVjKHNpemUpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgdmFyICQxID0gbWF0Y2hbMV07XG4gICAgdmFyICQyID0gbWF0Y2hbMl07XG4gICAgaWYgKC9eay9pLnRlc3QoJDIpKSB7XG4gICAgICAgIHJldHVybiAkMSAqIDEwMjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKC9ebS9pLnRlc3QoJDIpKSB7XG4gICAgICAgIHJldHVybiAkMSAqIDEwMjQgKiAxMDI0O1xuICAgIH1cbiAgICBlbHNlIGlmICgvXmcvaS50ZXN0KCQyKSkge1xuICAgICAgICByZXR1cm4gJDEgKiAxMDI0ICogMTAyNCAqIDEwMjQ7XG4gICAgfVxuICAgIHJldHVybiArJDE7XG59O1xuXG4vKipcbiAqIOWIpOaWreS4gOS4i+a1j+iniOWZqOaYr+WQpuaUr+aMgSB4aHIyIOeJueaAp++8jOWmguaenOS4jeaUr+aMge+8jOWwsSBmYWxsYmFjayDliLAgUG9zdE9iamVjdFxuICog5p2l5LiK5Lyg5paH5Lu2XG4gKlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0cy5pc1hocjJTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvYmxvYi9mODM5ZTI1NzlkYTJjNjMzMWVhYWQ5MjJhZTVjZDY5MWFhYzdhYjYyL2ZlYXR1cmUtZGV0ZWN0cy9uZXR3b3JrL3hocjIuanNcbiAgICByZXR1cm4gJ1hNTEh0dHBSZXF1ZXN0JyBpbiB3aW5kb3cgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG59O1xuXG5leHBvcnRzLmlzQXBwZW5kYWJsZSA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGhlYWRlcnNbJ3gtYmNlLW9iamVjdC10eXBlJ10gPT09ICdBcHBlbmRhYmxlJztcbn07XG5cbmV4cG9ydHMuZGVsYXkgPSBmdW5jdGlvbiAobXMpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9LCBtcyk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIOinhOiMg+WMlueUqOaIt+eahOi+k+WFpVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgd2lsbCBiZSBub3JtYWxpemVkXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMubm9ybWFsaXplRW5kcG9pbnQgPSBmdW5jdGlvbiAoZW5kcG9pbnQpIHtcbiAgICByZXR1cm4gZW5kcG9pbnQucmVwbGFjZSgvKFxcLyspJC8sICcnKTtcbn07XG5cbmV4cG9ydHMuZ2V0RGVmYXVsdEFDTCA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY2Nlc3NDb250cm9sTGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdiY2U6Ym9zJyxcbiAgICAgICAgICAgICAgICByZWdpb246ICcqJyxcbiAgICAgICAgICAgICAgICBlZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgcmVzb3VyY2U6IFtidWNrZXQgKyAnLyonXSxcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uOiBbJ1JFQUQnLCAnV1JJVEUnXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfTtcbn07XG5cbi8qKlxuICog55Sf5oiQdXVpZFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy51dWlkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByYW5kb20gPSAoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDIsIDMyKSkudG9TdHJpbmcoMzYpO1xuICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gJ3UtJyArIHRpbWVzdGFtcCArICctJyArIHJhbmRvbTtcbn07XG5cbi8qKlxuICog55Sf5oiQ5pys5ZywIGxvY2FsU3RvcmFnZSDkuK3nmoRrZXnvvIzmnaXlrZjlgqggdXBsb2FkSWRcbiAqIGxvY2FsU3RvcmFnZVtrZXldID0gdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIOS4gOS6m+WPr+S7peeUqOadpeiuoeeul2tleeeahOWPguaVsC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBnZW5lcmF0b3Ig5YaF572u55qE5Y+q5pyJIGRlZmF1bHQg5ZKMIG1kNVxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0cy5nZW5lcmF0ZUxvY2FsS2V5ID0gZnVuY3Rpb24gKG9wdGlvbiwgZ2VuZXJhdG9yKSB7XG4gICAgaWYgKGdlbmVyYXRvciA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoW1xuICAgICAgICAgICAgb3B0aW9uLmJsb2IubmFtZSwgb3B0aW9uLmJsb2Iuc2l6ZSxcbiAgICAgICAgICAgIG9wdGlvbi5jaHVua1NpemUsIG9wdGlvbi5idWNrZXQsXG4gICAgICAgICAgICBvcHRpb24ub2JqZWN0XG4gICAgICAgIF0uam9pbignJicpKTtcbiAgICB9XG4gICAgcmV0dXJuIFEucmVzb2x2ZShudWxsKTtcbn07XG5cbmV4cG9ydHMuZ2V0RGVmYXVsdFBvbGljeSA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICBpZiAoYnVja2V0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgLy8g6buY6K6k5pivIDI05bCP5pe2IOS5i+WQjuWIsOacn1xuICAgIHZhciBleHBpcmF0aW9uID0gbmV3IERhdGUobm93ICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgdmFyIHV0Y0RhdGVUaW1lID0gZXhwaXJhdGlvbi50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sICdaJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBleHBpcmF0aW9uOiB1dGNEYXRlVGltZSxcbiAgICAgICAgY29uZGl0aW9uczogW1xuICAgICAgICAgICAge2J1Y2tldDogYnVja2V0fVxuICAgICAgICBdXG4gICAgfTtcbn07XG5cbi8qKlxuICog5qC55o2ua2V56I635Y+WbG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmdldFVwbG9hZElkID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xufTtcblxuXG4vKipcbiAqIOagueaNrmtleeiuvue9rmxvY2FsU3RvcmFnZeS4reeahHVwbG9hZElkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSDpnIDopoHmn6Xor6LnmoRrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJZCDpnIDopoHorr7nva7nmoR1cGxvYWRJZFxuICovXG5leHBvcnRzLnNldFVwbG9hZElkID0gZnVuY3Rpb24gKGtleSwgdXBsb2FkSWQpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHVwbG9hZElkKTtcbn07XG5cbi8qKlxuICog5qC55o2ua2V55Yig6ZmkbG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICovXG5leHBvcnRzLnJlbW92ZVVwbG9hZElkID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG59O1xuXG4vKipcbiAqIOWPluW+l+W3suS4iuS8oOWIhuWdl+eahGV0YWdcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcGFydE51bWJlciDliIbniYfluo/lj7cuXG4gKiBAcGFyYW0ge0FycmF5fSBleGlzdFBhcnRzIOW3suS4iuS8oOWujOaIkOeahOWIhueJh+S/oeaBry5cbiAqIEByZXR1cm4ge3N0cmluZ30g5oyH5a6a5YiG54mH55qEZXRhZ1xuICovXG5mdW5jdGlvbiBnZXRQYXJ0RXRhZyhwYXJ0TnVtYmVyLCBleGlzdFBhcnRzKSB7XG4gICAgdmFyIG1hdGNoUGFydHMgPSB1LmZpbHRlcihleGlzdFBhcnRzIHx8IFtdLCBmdW5jdGlvbiAocGFydCkge1xuICAgICAgICByZXR1cm4gK3BhcnQucGFydE51bWJlciA9PT0gcGFydE51bWJlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gbWF0Y2hQYXJ0cy5sZW5ndGggPyBtYXRjaFBhcnRzWzBdLmVUYWcgOiBudWxsO1xufVxuXG4vKipcbiAqIOWboOS4uiBsaXN0UGFydHMg5Lya6L+U5ZueIHBhcnROdW1iZXIg5ZKMIGV0YWcg55qE5a+55bqU5YWz57O7XG4gKiDmiYDku6UgbGlzdFBhcnRzIOi/lOWbnueahOe7k+aenO+8jOe7mSB0YXNrcyDkuK3lkIjpgILnmoTlhYPntKDorr7nva4gZXRhZyDlsZ7mgKfvvIzkuIrkvKBcbiAqIOeahOaXtuWAmeWwseWPr+S7pei3s+i/h+i/meS6myBwYXJ0XG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gdGFza3Mg5pys5Zyw5YiH5YiG5aW955qE5Lu75YqhLlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gcGFydHMg5pyN5Yqh56uv6L+U5Zue55qE5bey57uP5LiK5Lyg55qEcGFydHMuXG4gKi9cbmV4cG9ydHMuZmlsdGVyVGFza3MgPSBmdW5jdGlvbiAodGFza3MsIHBhcnRzKSB7XG4gICAgdS5lYWNoKHRhc2tzLCBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgcGFydE51bWJlciA9IHRhc2sucGFydE51bWJlcjtcbiAgICAgICAgdmFyIGV0YWcgPSBnZXRQYXJ0RXRhZyhwYXJ0TnVtYmVyLCBwYXJ0cyk7XG4gICAgICAgIGlmIChldGFnKSB7XG4gICAgICAgICAgICB0YXNrLmV0YWcgPSBldGFnO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIOaKiueUqOaIt+i+k+WFpeeahOmFjee9rui9rOWMluaIkCBodG1sNSDlkowgZmxhc2gg5Y+v5Lul5o6l5pS255qE5YaF5a65LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fSBhY2NlcHQg5pSv5oyB5pWw57uE5ZKM5a2X56ym5Liy55qE6YWN572uXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZXhwYW5kQWNjZXB0ID0gZnVuY3Rpb24gKGFjY2VwdCkge1xuICAgIHZhciBleHRzID0gW107XG5cbiAgICBpZiAodS5pc0FycmF5KGFjY2VwdCkpIHtcbiAgICAgICAgLy8gRmxhc2jopoHmsYLnmoTmoLzlvI9cbiAgICAgICAgdS5lYWNoKGFjY2VwdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpdGVtLmV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBleHRzLnB1c2guYXBwbHkoZXh0cywgaXRlbS5leHRlbnNpb25zLnNwbGl0KCcsJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodS5pc1N0cmluZyhhY2NlcHQpKSB7XG4gICAgICAgIGV4dHMgPSBhY2NlcHQuc3BsaXQoJywnKTtcbiAgICB9XG5cbiAgICAvLyDkuLrkuobkv53or4HlhbzlrrnmgKfvvIzmioogbWltZVR5cGVzIOWSjCBleHRzIOmDvei/lOWbnuWbnuWOu1xuICAgIGV4dHMgPSB1Lm1hcChleHRzLCBmdW5jdGlvbiAoZXh0KSB7XG4gICAgICAgIHJldHVybiAvXlxcLi8udGVzdChleHQpID8gZXh0IDogKCcuJyArIGV4dCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZXh0cy5qb2luKCcsJyk7XG59O1xuXG5leHBvcnRzLmV4dFRvTWltZVR5cGUgPSBmdW5jdGlvbiAoZXh0cykge1xuICAgIHZhciBtaW1lVHlwZXMgPSB1Lm1hcChleHRzLnNwbGl0KCcsJyksIGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgaWYgKGV4dC5pbmRleE9mKCcvJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNaW1lVHlwZS5ndWVzcyhleHQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1pbWVUeXBlcy5qb2luKCcsJyk7XG59O1xuXG5leHBvcnRzLmV4cGFuZEFjY2VwdFRvQXJyYXkgPSBmdW5jdGlvbiAoYWNjZXB0KSB7XG4gICAgaWYgKCFhY2NlcHQgfHwgdS5pc0FycmF5KGFjY2VwdCkpIHtcbiAgICAgICAgcmV0dXJuIGFjY2VwdDtcbiAgICB9XG5cbiAgICBpZiAodS5pc1N0cmluZyhhY2NlcHQpKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7dGl0bGU6ICdBbGwgZmlsZXMnLCBleHRlbnNpb25zOiBhY2NlcHR9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xufTtcblxuLyoqXG4gKiDovazljJbkuIDkuIsgYm9zIHVybCDnmoTmoLzlvI9cbiAqIGh0dHA6Ly9iai5iY2Vib3MuY29tL3YxLyR7YnVja2V0fS8ke29iamVjdH0gLT4gaHR0cDovLyR7YnVja2V0fS5iai5iY2Vib3MuY29tL3YxLyR7b2JqZWN0fVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwg6ZyA6KaB6L2s5YyW55qEVVJMLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLnRyYW5zZm9ybVVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICB2YXIgcGF0dGVybiA9IC8oaHR0cHM/OilcXC9cXC8oW15cXC9dKylcXC8oW15cXC9dKylcXC8oW15cXC9dKykvO1xuICAgIHJldHVybiB1cmwucmVwbGFjZShwYXR0ZXJuLCBmdW5jdGlvbiAoXywgcHJvdG9jb2wsIGhvc3QsICQzLCAkNCkge1xuICAgICAgICBpZiAoL152XFxkJC8udGVzdCgkMykpIHtcbiAgICAgICAgICAgIC8vIC92MS8ke2J1Y2tldH0vLi4uXG4gICAgICAgICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgJDQgKyAnLicgKyBob3N0ICsgJy8nICsgJDM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gLyR7YnVja2V0fS8uLi5cbiAgICAgICAgcmV0dXJuIHByb3RvY29sICsgJy8vJyArICQzICsgJy4nICsgaG9zdCArICcvJyArICQ0O1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5pc0Jsb2IgPSBmdW5jdGlvbiAoYm9keSkge1xuICAgIHZhciBibG9iQ3RvciA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIENocm9tZSBCbG9iID09PSAnZnVuY3Rpb24nXG4gICAgICAgIC8vIFNhZmFyaSBCbG9iID09PSAndW5kZWZpbmVkJ1xuICAgICAgICBibG9iQ3RvciA9IEJsb2I7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtT3hpZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdS5pc0Z1bmN0aW9uKG1PeGllLkJsb2IpKSB7XG4gICAgICAgIGJsb2JDdG9yID0gbU94aWUuQmxvYjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keSBpbnN0YW5jZW9mIGJsb2JDdG9yO1xufTtcblxuZXhwb3J0cy5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxuZXhwb3J0cy50b0RITVMgPSBmdW5jdGlvbiAoc2Vjb25kcykge1xuICAgIHZhciBkYXlzID0gMDtcbiAgICB2YXIgaG91cnMgPSAwO1xuICAgIHZhciBtaW51dGVzID0gMDtcblxuICAgIGlmIChzZWNvbmRzID49IDYwKSB7XG4gICAgICAgIG1pbnV0ZXMgPSB+fihzZWNvbmRzIC8gNjApO1xuICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyAtIG1pbnV0ZXMgKiA2MDtcbiAgICB9XG5cbiAgICBpZiAobWludXRlcyA+PSA2MCkge1xuICAgICAgICBob3VycyA9IH5+KG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIG1pbnV0ZXMgPSBtaW51dGVzIC0gaG91cnMgKiA2MDtcbiAgICB9XG5cbiAgICBpZiAoaG91cnMgPj0gMjQpIHtcbiAgICAgICAgZGF5cyA9IH5+KGhvdXJzIC8gMjQpO1xuICAgICAgICBob3VycyA9IGhvdXJzIC0gZGF5cyAqIDI0O1xuICAgIH1cblxuICAgIHJldHVybiB7REQ6IGRheXMsIEhIOiBob3VycywgTU06IG1pbnV0ZXMsIFNTOiBzZWNvbmRzfTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlSG9zdCh1cmwpIHtcbiAgICB2YXIgbWF0Y2ggPSAvXlxcdys6XFwvXFwvKFteXFwvXSspLy5leGVjKHVybCk7XG4gICAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdO1xufVxuXG5leHBvcnRzLmZpeFhociA9IGZ1bmN0aW9uIChvcHRpb25zLCBpc0Jvcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MsIGNvbmZpZykge1xuICAgICAgICB2YXIgY2xpZW50ID0gdGhpcztcbiAgICAgICAgdmFyIGVuZHBvaW50SG9zdCA9IHBhcnNlSG9zdChjb25maWcuZW5kcG9pbnQpO1xuXG4gICAgICAgIC8vIHgtYmNlLWRhdGUg5ZKMIERhdGUg5LqM6YCJ5LiA77yM5piv5b+F6aG755qEXG4gICAgICAgIC8vIOS9huaYryBGbGFzaCDml6Dms5Xorr7nva4gRGF0Ze+8jOWboOatpOW/hemhu+iuvue9riB4LWJjZS1kYXRlXG4gICAgICAgIGFyZ3MuaGVhZGVyc1sneC1iY2UtZGF0ZSddID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnJlcGxhY2UoL1xcLlxcZCtaJC8sICdaJyk7XG4gICAgICAgIGFyZ3MuaGVhZGVycy5ob3N0ID0gZW5kcG9pbnRIb3N0O1xuXG4gICAgICAgIC8vIEZsYXNoIOeahOe8k+WtmOiyjOS8vOavlOi+g+WOieWus++8jOW8uuWItuivt+axguaWsOeahFxuICAgICAgICAvLyBYWFgg5aW95YOP5pyN5Yqh5Zmo56uv5LiN5Lya5oqKIC5zdGFtcCDov5nkuKrlj4LmlbDliqDlhaXliLDnrb7lkI3nmoTorqHnrpfpgLvovpHph4zpnaLljrtcbiAgICAgICAgLy8gYXJncy5wYXJhbXNbJy5zdGFtcCddID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgLy8g5Y+q5pyJIFBVVCDmiY3kvJrop6blj5EgcHJvZ3Jlc3Mg5LqL5Lu2XG4gICAgICAgIHZhciBvcmlnaW5hbEh0dHBNZXRob2QgPSBodHRwTWV0aG9kO1xuXG4gICAgICAgIGlmIChodHRwTWV0aG9kID09PSAnUFVUJykge1xuICAgICAgICAgICAgLy8gUHV0T2JqZWN0IFB1dFBhcnRzIOmDveWPr+S7peeUqCBQT1NUIOWNj+iuru+8jOiAjOS4lCBGbGFzaCDkuZ/lj6rog73nlKggUE9TVCDljY/orq5cbiAgICAgICAgICAgIGh0dHBNZXRob2QgPSAnUE9TVCc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgeGhyVXJpO1xuICAgICAgICB2YXIgeGhyTWV0aG9kID0gaHR0cE1ldGhvZDtcbiAgICAgICAgdmFyIHhockJvZHkgPSBhcmdzLmJvZHk7XG4gICAgICAgIGlmIChodHRwTWV0aG9kID09PSAnSEVBRCcpIHtcbiAgICAgICAgICAgIC8vIOWboOS4uiBGbGFzaCDnmoQgVVJMUmVxdWVzdCDlj6rog73lj5HpgIEgR0VUIOWSjCBQT1NUIOivt+axglxuICAgICAgICAgICAgLy8gZ2V0T2JqZWN0TWV0YemcgOimgeeUqEhFQUTor7fmsYLvvIzkvYbmmK8gRmxhc2gg5peg5rOV5Y+R6LW36L+Z56eN6K+35rGCXG4gICAgICAgICAgICAvLyDmiYDpnIDpnIDopoHnlKggcmVsYXkg5Lit6L2s5LiA5LiLXG4gICAgICAgICAgICAvLyBYWFgg5Zug5Li6IGJ1Y2tldCDkuI3lj6/og73mmK8gcHJpdmF0Ze+8jOWQpuWImSBjcm9zc2RvbWFpbi54bWwg5piv5peg5rOV6K+75Y+W55qEXG4gICAgICAgICAgICAvLyDmiYDku6Xov5nkuKrmjqXlj6Por7fmsYLnmoTml7blgJnvvIzlj6/ku6XkuI3pnIDopoEgYXV0aG9yaXphdGlvbiDlrZfmrrVcbiAgICAgICAgICAgIHZhciByZWxheVNlcnZlciA9IGV4cG9ydHMubm9ybWFsaXplRW5kcG9pbnQob3B0aW9ucy5ib3NfcmVsYXlfc2VydmVyKTtcbiAgICAgICAgICAgIHhoclVyaSA9IHJlbGF5U2VydmVyICsgJy8nICsgZW5kcG9pbnRIb3N0ICsgcmVzb3VyY2U7XG5cbiAgICAgICAgICAgIGFyZ3MucGFyYW1zLmh0dHBNZXRob2QgPSBodHRwTWV0aG9kO1xuXG4gICAgICAgICAgICB4aHJNZXRob2QgPSAnUE9TVCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNCb3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHhoclVyaSA9IGV4cG9ydHMudHJhbnNmb3JtVXJsKGNvbmZpZy5lbmRwb2ludCArIHJlc291cmNlKTtcbiAgICAgICAgICAgIGFyZ3MuaGVhZGVycy5ob3N0ID0gcGFyc2VIb3N0KHhoclVyaSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4aHJVcmkgPSBjb25maWcuZW5kcG9pbnQgKyByZXNvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh4aHJNZXRob2QgPT09ICdQT1NUJyAmJiAheGhyQm9keSkge1xuICAgICAgICAgICAgLy8g5b+F6aG76KaB5pyJIEJPRFkg5omN6IO95pivIFBPU1TvvIzlkKbliJnkvaDorr7nva7kuobkuZ/msqHmnIlcbiAgICAgICAgICAgIC8vIOiAjOS4lOW/hemhu+aYryBQT1NUIOaJjeWPr+S7peiuvue9ruiHquWumuS5ieeahGhlYWRlcu+8jEdFVOS4jeihjFxuICAgICAgICAgICAgeGhyQm9keSA9ICd7XCJGT1JDRV9QT1NUXCI6IHRydWV9JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgICAgICB2YXIgeGhyID0gbmV3IG1PeGllLlhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UgfHwgJ3t9Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIGlmIChodHRwTWV0aG9kID09PSAnSEVBRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfY29kZTogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzcG9uc2UubWVzc2FnZSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogcmVzcG9uc2UuY29kZSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdF9pZDogcmVzcG9uc2UucmVxdWVzdElkIHx8ICcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FKOWIhueJh+S4iuS8oOeahOmAu+i+keWSjHh4eOeahOmAu+i+keS4jeS4gOagtylcbiAgICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsSHR0cE1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUE9TVCwgSEVBRCwgR0VUIOS5i+exu+eahOS4jemcgOimgeinpuWPkSBwcm9ncmVzcyDkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgLy8g5ZCm5YiZ5a+86Ie06aG16Z2i55qE6YC76L6R5re35LmxXG4gICAgICAgICAgICAgICAgICAgIGUubGVuZ3RoQ29tcHV0YWJsZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGh0dHBDb250ZXh0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cE1ldGhvZDogb3JpZ2luYWxIdHRwTWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHJlc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyOiB4aHJcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW1pdCgncHJvZ3Jlc3MnLCBlLCBodHRwQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9taXNlID0gY2xpZW50LmNyZWF0ZVNpZ25hdHVyZShjbGllbnQuY29uZmlnLmNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MucGFyYW1zLCBhcmdzLmhlYWRlcnMpO1xuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIHhiY2VEYXRlKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgICAgIGFyZ3MuaGVhZGVycy5hdXRob3JpemF0aW9uID0gYXV0aG9yaXphdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgYXJncy5oZWFkZXJzWyd4LWJjZS1kYXRlJ10gPSB4YmNlRGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHFzID0gcXNNb2R1bGUuc3RyaW5naWZ5KGFyZ3MucGFyYW1zKTtcbiAgICAgICAgICAgIGlmIChxcykge1xuICAgICAgICAgICAgICAgIHhoclVyaSArPSAnPycgKyBxcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLm9wZW4oeGhyTWV0aG9kLCB4aHJVcmksIHRydWUpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhcmdzLmhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgICAgICAgICB8fCBrZXkgPT09ICdob3N0Jykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJncy5oZWFkZXJzW2tleV07XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhoci5zZW5kKHhockJvZHksIHtcbiAgICAgICAgICAgICAgICBydW50aW1lX29yZGVyOiAnZmxhc2gnLFxuICAgICAgICAgICAgICAgIHN3Zl91cmw6IG9wdGlvbnMuZmxhc2hfc3dmX3VybFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn07XG5cblxuZXhwb3J0cy5lYWNoTGltaXQgPSBmdW5jdGlvbiAodGFza3MsIHRhc2tQYXJhbGxlbCwgZXhlY3V0ZXIsIGRvbmUpIHtcbiAgICB2YXIgcnVubmluZ0NvdW50ID0gMDtcbiAgICB2YXIgYWJvcnRlZCA9IGZhbHNlO1xuICAgIHZhciBmaW4gPSBmYWxzZTsgICAgICAvLyBkb25lIOWPquiDveiiq+iwg+eUqOS4gOasoS5cbiAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUodGFza3MpO1xuXG4gICAgZnVuY3Rpb24gaW5maW5pdGVMb29wKCkge1xuICAgICAgICB2YXIgdGFzayA9IHF1ZXVlLmRlcXVldWUoKTtcbiAgICAgICAgaWYgKCF0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBydW5uaW5nQ291bnQrKztcbiAgICAgICAgZXhlY3V0ZXIodGFzaywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBydW5uaW5nQ291bnQtLTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8g5LiA5pem5pyJ5oql6ZSZ77yM57uI5q2i6L+Q6KGMXG4gICAgICAgICAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZmluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkb25lKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghcXVldWUuaXNFbXB0eSgpICYmICFhYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmYn+WIl+i/mOacieWGheWuuVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGluZmluaXRlTG9vcCwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJ1bm5pbmdDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmYn+WIl+epuuS6hu+8jOiAjOS4lOayoeaciei/kOihjOS4reeahOS7u+WKoeS6hlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGFza1BhcmFsbGVsID0gTWF0aC5taW4odGFza1BhcmFsbGVsLCBxdWV1ZS5zaXplKCkpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFza1BhcmFsbGVsOyBpKyspIHtcbiAgICAgICAgaW5maW5pdGVMb29wKCk7XG4gICAgfVxufTtcblxuZXhwb3J0cy5pbmhlcml0cyA9IGZ1bmN0aW9uIChDaGlsZEN0b3IsIFBhcmVudEN0b3IpIHtcbiAgICBDaGlsZEN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQYXJlbnRDdG9yLnByb3RvdHlwZSk7XG4gICAgQ2hpbGRDdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENoaWxkQ3Rvcjtcbn07XG5cbmV4cG9ydHMuZ3Vlc3NDb250ZW50VHlwZSA9IGZ1bmN0aW9uIChmaWxlLCBvcHRfaWdub3JlQ2hhcnNldCkge1xuICAgIHZhciBjb250ZW50VHlwZSA9IGZpbGUudHlwZTtcbiAgICBpZiAoIWNvbnRlbnRUeXBlKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBmaWxlLm5hbWU7XG4gICAgICAgIHZhciBleHQgPSBvYmplY3Quc3BsaXQoL1xcLi9nKS5wb3AoKTtcbiAgICAgICAgY29udGVudFR5cGUgPSBNaW1lVHlwZS5ndWVzcyhleHQpO1xuICAgIH1cblxuICAgIC8vIEZpcmVmb3jlnKhQT1NU55qE5pe25YCZ77yMQ29udGVudC1UeXBlIOS4gOWumuS8muaciUNoYXJzZXTnmoTvvIzlm6DmraRcbiAgICAvLyDov5nph4zkuI3nrqEzNzIx77yM6YO95Yqg5LiKLlxuICAgIGlmICghb3B0X2lnbm9yZUNoYXJzZXQgJiYgIS9jaGFyc2V0PS8udGVzdChjb250ZW50VHlwZSkpIHtcbiAgICAgICAgY29udGVudFR5cGUgKz0gJzsgY2hhcnNldD1VVEYtOCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRlbnRUeXBlO1xufTtcbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL0J1ZmZlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyoqXG4gKiBCdWZmZXJcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gQnVmZmVyKCkge1xufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NTE1ODY5L3N0cmluZy1sZW5ndGgtaW4tYnl0ZXMtaW4tamF2YXNjcmlwdFxuICAgIHZhciBtID0gZW5jb2RlVVJJQ29tcG9uZW50KGRhdGEpLm1hdGNoKC8lWzg5QUJhYl0vZyk7XG4gICAgcmV0dXJuIGRhdGEubGVuZ3RoICsgKG0gPyBtLmxlbmd0aCA6IDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdWZmZXI7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIihmdW5jdGlvbiAocm9vdCkge1xuXG4gIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICB2YXIgc2V0VGltZW91dEZ1bmMgPSBzZXRUaW1lb3V0O1xuXG4gIGZ1bmN0aW9uIG5vb3AoKSB7fVxuXG4gIC8vIFBvbHlmaWxsIGZvciBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuICBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICAgIHRoaXMuX3N0YXRlID0gMDtcbiAgICB0aGlzLl9oYW5kbGVkID0gZmFsc2U7XG4gICAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fZGVmZXJyZWRzID0gW107XG5cbiAgICBkb1Jlc29sdmUoZm4sIHRoaXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gICAgd2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG4gICAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gICAgfVxuICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuICAgICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHZhciByZXQ7XG4gICAgICB0cnkge1xuICAgICAgICByZXQgPSBjYihzZWxmLl92YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAgIHRyeSB7XG4gICAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpO1xuICAgICAgaWYgKG5ld1ZhbHVlICYmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgdmFyIHRoZW4gPSBuZXdWYWx1ZS50aGVuO1xuICAgICAgICBpZiAobmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGRvUmVzb2x2ZShiaW5kKHRoZW4sIG5ld1ZhbHVlKSwgc2VsZik7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgZmluYWxlKHNlbGYpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlamVjdChzZWxmLCBlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgICBzZWxmLl9zdGF0ZSA9IDI7XG4gICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBmaW5hbGUoc2VsZik7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMiAmJiBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgICB9XG4gICAgc2VsZi5fZGVmZXJyZWRzID0gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICAgIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICAgKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAgICpcbiAgICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICAgKi9cbiAgZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB0cnkge1xuICAgICAgZm4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICByZXNvbHZlKHNlbGYsIHZhbHVlKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlamVjdChzZWxmLCByZWFzb24pO1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGlmIChkb25lKSByZXR1cm47XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIHJlamVjdChzZWxmLCBleCk7XG4gICAgfVxuICB9XG5cbiAgUHJvbWlzZS5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbiAob25SZWplY3RlZCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gIH07XG5cbiAgUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgIHZhciBwcm9tID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yKShub29wKTtcblxuICAgIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICAgIHJldHVybiBwcm9tO1xuICB9O1xuXG4gIFByb21pc2UuYWxsID0gZnVuY3Rpb24gKGFycikge1xuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgIHZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuICAgICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWwsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICBQcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWplY3QodmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIFByb21pc2UucmFjZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YWx1ZXNbaV0udGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8vIFVzZSBwb2x5ZmlsbCBmb3Igc2V0SW1tZWRpYXRlIGZvciBwZXJmb3JtYW5jZSBnYWluc1xuICBQcm9taXNlLl9pbW1lZGlhdGVGbiA9ICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmIGZ1bmN0aW9uIChmbikgeyBzZXRJbW1lZGlhdGUoZm4pOyB9KSB8fFxuICAgIGZ1bmN0aW9uIChmbikge1xuICAgICAgc2V0VGltZW91dEZ1bmMoZm4sIDApO1xuICAgIH07XG5cbiAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgaW1tZWRpYXRlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgY2FsbGJhY2tzXG4gICAqIEBwYXJhbSBmbiB7ZnVuY3Rpb259IEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICogQGRlcHJlY2F0ZWRcbiAgICovXG4gIFByb21pc2UuX3NldEltbWVkaWF0ZUZuID0gZnVuY3Rpb24gX3NldEltbWVkaWF0ZUZuKGZuKSB7XG4gICAgUHJvbWlzZS5faW1tZWRpYXRlRm4gPSBmbjtcbiAgfTtcblxuICAvKipcbiAgICogQ2hhbmdlIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlIG9uIHVuaGFuZGxlZCByZWplY3Rpb25cbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiB1bmhhbmRsZWQgcmVqZWN0aW9uXG4gICAqIEBkZXByZWNhdGVkXG4gICAqL1xuICBQcm9taXNlLl9zZXRVbmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF9zZXRVbmhhbmRsZWRSZWplY3Rpb25Gbihmbikge1xuICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZm47XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuICB9IGVsc2UgaWYgKCFyb290LlByb21pc2UpIHtcbiAgICByb290LlByb21pc2UgPSBQcm9taXNlO1xuICB9XG5cbn0pKHRoaXMpO1xuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvYXN5bmMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbmV4cG9ydHMubWFwTGltaXQgPSByZXF1aXJlKDIpO1xuIiwiOyhmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcblx0XHQvLyBDb21tb25KU1xuXHRcdG1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gR2xvYmFsIChicm93c2VyKVxuXHRcdHJvb3QuQ3J5cHRvSlMgPSBmYWN0b3J5KCk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG5cdC8qKlxuXHQgKiBDcnlwdG9KUyBjb3JlIGNvbXBvbmVudHMuXG5cdCAqL1xuXHR2YXIgQ3J5cHRvSlMgPSBDcnlwdG9KUyB8fCAoZnVuY3Rpb24gKE1hdGgsIHVuZGVmaW5lZCkge1xuXHQgICAgLypcblx0ICAgICAqIExvY2FsIHBvbHlmaWwgb2YgT2JqZWN0LmNyZWF0ZVxuXHQgICAgICovXG5cdCAgICB2YXIgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCAoZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIGZ1bmN0aW9uIEYoKSB7fTtcblxuXHQgICAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG5cdCAgICAgICAgICAgIHZhciBzdWJ0eXBlO1xuXG5cdCAgICAgICAgICAgIEYucHJvdG90eXBlID0gb2JqO1xuXG5cdCAgICAgICAgICAgIHN1YnR5cGUgPSBuZXcgRigpO1xuXG5cdCAgICAgICAgICAgIEYucHJvdG90eXBlID0gbnVsbDtcblxuXHQgICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcblx0ICAgICAgICB9O1xuXHQgICAgfSgpKVxuXG5cdCAgICAvKipcblx0ICAgICAqIENyeXB0b0pTIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIEMgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBMaWJyYXJ5IG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfbGliID0gQy5saWIgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBCYXNlIG9iamVjdCBmb3IgcHJvdG90eXBhbCBpbmhlcml0YW5jZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIEJhc2UgPSBDX2xpYi5CYXNlID0gKGZ1bmN0aW9uICgpIHtcblxuXG5cdCAgICAgICAgcmV0dXJuIHtcblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG92ZXJyaWRlcyBQcm9wZXJ0aWVzIHRvIGNvcHkgaW50byB0aGUgbmV3IG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgdmFyIE15VHlwZSA9IENyeXB0b0pTLmxpYi5CYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgZmllbGQ6ICd2YWx1ZScsXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICAgICAgbWV0aG9kOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgfVxuXHQgICAgICAgICAgICAgKiAgICAgfSk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uIChvdmVycmlkZXMpIHtcblx0ICAgICAgICAgICAgICAgIC8vIFNwYXduXG5cdCAgICAgICAgICAgICAgICB2YXIgc3VidHlwZSA9IGNyZWF0ZSh0aGlzKTtcblxuXHQgICAgICAgICAgICAgICAgLy8gQXVnbWVudFxuXHQgICAgICAgICAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuXHQgICAgICAgICAgICAgICAgICAgIHN1YnR5cGUubWl4SW4ob3ZlcnJpZGVzKTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGRlZmF1bHQgaW5pdGlhbGl6ZXJcblx0ICAgICAgICAgICAgICAgIGlmICghc3VidHlwZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdCcpIHx8IHRoaXMuaW5pdCA9PT0gc3VidHlwZS5pbml0KSB7XG5cdCAgICAgICAgICAgICAgICAgICAgc3VidHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLiRzdXBlci5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdCAgICAgICAgICAgICAgICAgICAgfTtcblx0ICAgICAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZXIncyBwcm90b3R5cGUgaXMgdGhlIHN1YnR5cGUgb2JqZWN0XG5cdCAgICAgICAgICAgICAgICBzdWJ0eXBlLmluaXQucHJvdG90eXBlID0gc3VidHlwZTtcblxuXHQgICAgICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHN1cGVydHlwZVxuXHQgICAgICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIgPSB0aGlzO1xuXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogRXh0ZW5kcyB0aGlzIG9iamVjdCBhbmQgcnVucyB0aGUgaW5pdCBtZXRob2QuXG5cdCAgICAgICAgICAgICAqIEFyZ3VtZW50cyB0byBjcmVhdGUoKSB3aWxsIGJlIHBhc3NlZCB0byBpbml0KCkuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBpbnN0YW5jZSA9IE15VHlwZS5jcmVhdGUoKTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5leHRlbmQoKTtcblx0ICAgICAgICAgICAgICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cblx0ICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIG9iamVjdC5cblx0ICAgICAgICAgICAgICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWRkIHNvbWUgbG9naWMgd2hlbiB5b3VyIG9iamVjdHMgYXJlIGNyZWF0ZWQuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcblx0ICAgICAgICAgICAgICogICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgICAgIC8vIC4uLlxuXHQgICAgICAgICAgICAgKiAgICAgICAgIH1cblx0ICAgICAgICAgICAgICogICAgIH0pO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB9LFxuXG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBDb3BpZXMgcHJvcGVydGllcyBpbnRvIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllcyBUaGUgcHJvcGVydGllcyB0byBtaXggaW4uXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICBNeVR5cGUubWl4SW4oe1xuXHQgICAgICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnXG5cdCAgICAgICAgICAgICAqICAgICB9KTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIG1peEluOiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcblx0ICAgICAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIElFIHdvbid0IGNvcHkgdG9TdHJpbmcgdXNpbmcgdGhlIGxvb3AgYWJvdmVcblx0ICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy50b1N0cmluZyA9IHByb3BlcnRpZXMudG9TdHJpbmc7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0sXG5cblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBjbG9uZSA9IGluc3RhbmNlLmNsb25lKCk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdC5wcm90b3R5cGUuZXh0ZW5kKHRoaXMpO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfTtcblx0ICAgIH0oKSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdvcmRzIFRoZSBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG5cdCAgICAgKiBAcHJvcGVydHkge251bWJlcn0gc2lnQnl0ZXMgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgKi9cblx0ICAgIHZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXkgPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSB3b3JkcyAoT3B0aW9uYWwpIEFuIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2lnQnl0ZXMgKE9wdGlvbmFsKSBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoZSB3b3Jkcy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKCk7XG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShbMHgwMDAxMDIwMywgMHgwNDA1MDYwN10pO1xuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddLCA2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBpbml0OiBmdW5jdGlvbiAod29yZHMsIHNpZ0J5dGVzKSB7XG5cdCAgICAgICAgICAgIHdvcmRzID0gdGhpcy53b3JkcyA9IHdvcmRzIHx8IFtdO1xuXG5cdCAgICAgICAgICAgIGlmIChzaWdCeXRlcyAhPSB1bmRlZmluZWQpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSBzaWdCeXRlcztcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSB3b3Jkcy5sZW5ndGggKiA0O1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIHRoaXMgd29yZCBhcnJheSB0byBhIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7RW5jb2Rlcn0gZW5jb2RlciAoT3B0aW9uYWwpIFRoZSBlbmNvZGluZyBzdHJhdGVneSB0byB1c2UuIERlZmF1bHQ6IENyeXB0b0pTLmVuYy5IZXhcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHN0cmluZ2lmaWVkIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkgKyAnJztcblx0ICAgICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheS50b1N0cmluZygpO1xuXHQgICAgICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5LnRvU3RyaW5nKENyeXB0b0pTLmVuYy5VdGY4KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICB0b1N0cmluZzogZnVuY3Rpb24gKGVuY29kZXIpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIChlbmNvZGVyIHx8IEhleCkuc3RyaW5naWZ5KHRoaXMpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25jYXRlbmF0ZXMgYSB3b3JkIGFycmF5IHRvIHRoaXMgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheTEuY29uY2F0KHdvcmRBcnJheTIpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHRoaXNXb3JkcyA9IHRoaXMud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGF0V29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciB0aGlzU2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXHQgICAgICAgICAgICB2YXIgdGhhdFNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG5cdCAgICAgICAgICAgIHRoaXMuY2xhbXAoKTtcblxuXHQgICAgICAgICAgICAvLyBDb25jYXRcblx0ICAgICAgICAgICAgaWYgKHRoaXNTaWdCeXRlcyAlIDQpIHtcblx0ICAgICAgICAgICAgICAgIC8vIENvcHkgb25lIGJ5dGUgYXQgYSB0aW1lXG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoYXRTaWdCeXRlczsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXRCeXRlID0gKHRoYXRXb3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG5cdCAgICAgICAgICAgICAgICAgICAgdGhpc1dvcmRzWyh0aGlzU2lnQnl0ZXMgKyBpKSA+Pj4gMl0gfD0gdGhhdEJ5dGUgPDwgKDI0IC0gKCh0aGlzU2lnQnl0ZXMgKyBpKSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBDb3B5IG9uZSB3b3JkIGF0IGEgdGltZVxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkgKz0gNCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdID0gdGhhdFdvcmRzW2kgPj4+IDJdO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgKz0gdGhhdFNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENoYWluYWJsZVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVtb3ZlcyBpbnNpZ25pZmljYW50IGJpdHMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHdvcmRBcnJheS5jbGFtcCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsYW1wOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB0aGlzLndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgc2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENsYW1wXG5cdCAgICAgICAgICAgIHdvcmRzW3NpZ0J5dGVzID4+PiAyXSAmPSAweGZmZmZmZmZmIDw8ICgzMiAtIChzaWdCeXRlcyAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIHdvcmRzLmxlbmd0aCA9IE1hdGguY2VpbChzaWdCeXRlcyAvIDQpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gd29yZEFycmF5LmNsb25lKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuXHQgICAgICAgICAgICBjbG9uZS53b3JkcyA9IHRoaXMud29yZHMuc2xpY2UoMCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgd29yZCBhcnJheSBmaWxsZWQgd2l0aCByYW5kb20gYnl0ZXMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gbkJ5dGVzIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIHRvIGdlbmVyYXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcmFuZG9tIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LnJhbmRvbSgxNik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcmFuZG9tOiBmdW5jdGlvbiAobkJ5dGVzKSB7XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXG5cdCAgICAgICAgICAgIHZhciByID0gKGZ1bmN0aW9uIChtX3cpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBtX3cgPSBtX3c7XG5cdCAgICAgICAgICAgICAgICB2YXIgbV96ID0gMHgzYWRlNjhiMTtcblx0ICAgICAgICAgICAgICAgIHZhciBtYXNrID0gMHhmZmZmZmZmZjtcblxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBtX3ogPSAoMHg5MDY5ICogKG1feiAmIDB4RkZGRikgKyAobV96ID4+IDB4MTApKSAmIG1hc2s7XG5cdCAgICAgICAgICAgICAgICAgICAgbV93ID0gKDB4NDY1MCAqIChtX3cgJiAweEZGRkYpICsgKG1fdyA+PiAweDEwKSkgJiBtYXNrO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAoKG1feiA8PCAweDEwKSArIG1fdykgJiBtYXNrO1xuXHQgICAgICAgICAgICAgICAgICAgIHJlc3VsdCAvPSAweDEwMDAwMDAwMDtcblx0ICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gMC41O1xuXHQgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgKiAoTWF0aC5yYW5kb20oKSA+IC41ID8gMSA6IC0xKTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfSk7XG5cblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHJjYWNoZTsgaSA8IG5CeXRlczsgaSArPSA0KSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgX3IgPSByKChyY2FjaGUgfHwgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDAwMCk7XG5cblx0ICAgICAgICAgICAgICAgIHJjYWNoZSA9IF9yKCkgKiAweDNhZGU2N2I3O1xuXHQgICAgICAgICAgICAgICAgd29yZHMucHVzaCgoX3IoKSAqIDB4MTAwMDAwMDAwKSB8IDApO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbkJ5dGVzKTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBFbmNvZGVyIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfZW5jID0gQy5lbmMgPSB7fTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBIZXggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBIZXggPSBDX2VuYy5IZXggPSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBoZXggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGV4U3RyaW5nID0gQ3J5cHRvSlMuZW5jLkhleC5zdHJpbmdpZnkod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IHdvcmRBcnJheS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIGhleENoYXJzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lnQnl0ZXM7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgdmFyIGJpdGUgPSAod29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuXHQgICAgICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcblx0ICAgICAgICAgICAgICAgIGhleENoYXJzLnB1c2goKGJpdGUgJiAweDBmKS50b1N0cmluZygxNikpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhleENoYXJzLmpvaW4oJycpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIGhleCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciBUaGUgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuSGV4LnBhcnNlKGhleFN0cmluZyk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIChoZXhTdHIpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIGhleFN0ckxlbmd0aCA9IGhleFN0ci5sZW5ndGg7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydFxuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSBbXTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZXhTdHJMZW5ndGg7IGkgKz0gMikge1xuXHQgICAgICAgICAgICAgICAgd29yZHNbaSA+Pj4gM10gfD0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cihpLCAyKSwgMTYpIDw8ICgyNCAtIChpICUgOCkgKiA0KTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIGhleFN0ckxlbmd0aCAvIDIpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogTGF0aW4xIGVuY29kaW5nIHN0cmF0ZWd5LlxuXHQgICAgICovXG5cdCAgICB2YXIgTGF0aW4xID0gQ19lbmMuTGF0aW4xID0ge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIExhdGluMSBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgTGF0aW4xIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGxhdGluMVN0cmluZyA9IENyeXB0b0pTLmVuYy5MYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBzaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciBsYXRpbjFDaGFycyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZ0J5dGVzOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBiaXRlID0gKHdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcblx0ICAgICAgICAgICAgICAgIGxhdGluMUNoYXJzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShiaXRlKSk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbGF0aW4xQ2hhcnMuam9pbignJyk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgTGF0aW4xIHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0aW4xU3RyIFRoZSBMYXRpbjEgc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5MYXRpbjEucGFyc2UobGF0aW4xU3RyaW5nKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBwYXJzZTogZnVuY3Rpb24gKGxhdGluMVN0cikge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dFxuXHQgICAgICAgICAgICB2YXIgbGF0aW4xU3RyTGVuZ3RoID0gbGF0aW4xU3RyLmxlbmd0aDtcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhdGluMVN0ckxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB3b3Jkc1tpID4+PiAyXSB8PSAobGF0aW4xU3RyLmNoYXJDb2RlQXQoaSkgJiAweGZmKSA8PCAoMjQgLSAoaSAlIDQpICogOCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBsYXRpbjFTdHJMZW5ndGgpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogVVRGLTggZW5jb2Rpbmcgc3RyYXRlZ3kuXG5cdCAgICAgKi9cblx0ICAgIHZhciBVdGY4ID0gQ19lbmMuVXRmOCA9IHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBVVEYtOCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgdXRmOFN0cmluZyA9IENyeXB0b0pTLmVuYy5VdGY4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoTGF0aW4xLnN0cmluZ2lmeSh3b3JkQXJyYXkpKSk7XG5cdCAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblx0ICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWFsZm9ybWVkIFVURi04IGRhdGEnKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIFVURi04IHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXRmOFN0ciBUaGUgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5VdGY4LnBhcnNlKHV0ZjhTdHJpbmcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAodXRmOFN0cikge1xuXHQgICAgICAgICAgICByZXR1cm4gTGF0aW4xLnBhcnNlKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudCh1dGY4U3RyKSkpO1xuXHQgICAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgYnVmZmVyZWQgYmxvY2sgYWxnb3JpdGhtIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIFRoZSBwcm9wZXJ0eSBibG9ja1NpemUgbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBhIGNvbmNyZXRlIHN1YnR5cGUuXG5cdCAgICAgKlxuXHQgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IF9taW5CdWZmZXJTaXplIFRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgc2hvdWxkIGJlIGtlcHQgdW5wcm9jZXNzZWQgaW4gdGhlIGJ1ZmZlci4gRGVmYXVsdDogMFxuXHQgICAgICovXG5cdCAgICB2YXIgQnVmZmVyZWRCbG9ja0FsZ29yaXRobSA9IENfbGliLkJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVzZXRzIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgZGF0YSBidWZmZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBJbml0aWFsIHZhbHVlc1xuXHQgICAgICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFdvcmRBcnJheS5pbml0KCk7XG5cdCAgICAgICAgICAgIHRoaXMuX25EYXRhQnl0ZXMgPSAwO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBBZGRzIG5ldyBkYXRhIHRvIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgYnVmZmVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGFwcGVuZC4gU3RyaW5ncyBhcmUgY29udmVydGVkIHRvIGEgV29yZEFycmF5IHVzaW5nIFVURi04LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQoJ2RhdGEnKTtcblx0ICAgICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fYXBwZW5kKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2FwcGVuZDogZnVuY3Rpb24gKGRhdGEpIHtcblx0ICAgICAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT0gJ3N0cmluZycpIHtcblx0ICAgICAgICAgICAgICAgIGRhdGEgPSBVdGY4LnBhcnNlKGRhdGEpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQXBwZW5kXG5cdCAgICAgICAgICAgIHRoaXMuX2RhdGEuY29uY2F0KGRhdGEpO1xuXHQgICAgICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzICs9IGRhdGEuc2lnQnl0ZXM7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFByb2Nlc3NlcyBhdmFpbGFibGUgZGF0YSBibG9ja3MuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBUaGlzIG1ldGhvZCBpbnZva2VzIF9kb1Byb2Nlc3NCbG9jayhvZmZzZXQpLCB3aGljaCBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IGEgY29uY3JldGUgc3VidHlwZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZG9GbHVzaCBXaGV0aGVyIGFsbCBibG9ja3MgYW5kIHBhcnRpYWwgYmxvY2tzIHNob3VsZCBiZSBwcm9jZXNzZWQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBwcm9jZXNzZWQgZGF0YS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHByb2Nlc3NlZERhdGEgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9wcm9jZXNzKCk7XG5cdCAgICAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcyghISdmbHVzaCcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIF9wcm9jZXNzOiBmdW5jdGlvbiAoZG9GbHVzaCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuXHQgICAgICAgICAgICB2YXIgZGF0YVdvcmRzID0gZGF0YS53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIGRhdGFTaWdCeXRlcyA9IGRhdGEuc2lnQnl0ZXM7XG5cdCAgICAgICAgICAgIHZhciBibG9ja1NpemUgPSB0aGlzLmJsb2NrU2l6ZTtcblx0ICAgICAgICAgICAgdmFyIGJsb2NrU2l6ZUJ5dGVzID0gYmxvY2tTaXplICogNDtcblxuXHQgICAgICAgICAgICAvLyBDb3VudCBibG9ja3MgcmVhZHlcblx0ICAgICAgICAgICAgdmFyIG5CbG9ja3NSZWFkeSA9IGRhdGFTaWdCeXRlcyAvIGJsb2NrU2l6ZUJ5dGVzO1xuXHQgICAgICAgICAgICBpZiAoZG9GbHVzaCkge1xuXHQgICAgICAgICAgICAgICAgLy8gUm91bmQgdXAgdG8gaW5jbHVkZSBwYXJ0aWFsIGJsb2Nrc1xuXHQgICAgICAgICAgICAgICAgbkJsb2Nrc1JlYWR5ID0gTWF0aC5jZWlsKG5CbG9ja3NSZWFkeSk7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICAvLyBSb3VuZCBkb3duIHRvIGluY2x1ZGUgb25seSBmdWxsIGJsb2Nrcyxcblx0ICAgICAgICAgICAgICAgIC8vIGxlc3MgdGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBtdXN0IHJlbWFpbiBpbiB0aGUgYnVmZmVyXG5cdCAgICAgICAgICAgICAgICBuQmxvY2tzUmVhZHkgPSBNYXRoLm1heCgobkJsb2Nrc1JlYWR5IHwgMCkgLSB0aGlzLl9taW5CdWZmZXJTaXplLCAwKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIENvdW50IHdvcmRzIHJlYWR5XG5cdCAgICAgICAgICAgIHZhciBuV29yZHNSZWFkeSA9IG5CbG9ja3NSZWFkeSAqIGJsb2NrU2l6ZTtcblxuXHQgICAgICAgICAgICAvLyBDb3VudCBieXRlcyByZWFkeVxuXHQgICAgICAgICAgICB2YXIgbkJ5dGVzUmVhZHkgPSBNYXRoLm1pbihuV29yZHNSZWFkeSAqIDQsIGRhdGFTaWdCeXRlcyk7XG5cblx0ICAgICAgICAgICAgLy8gUHJvY2VzcyBibG9ja3Ncblx0ICAgICAgICAgICAgaWYgKG5Xb3Jkc1JlYWR5KSB7XG5cdCAgICAgICAgICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBuV29yZHNSZWFkeTsgb2Zmc2V0ICs9IGJsb2NrU2l6ZSkge1xuXHQgICAgICAgICAgICAgICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtYWxnb3JpdGhtIGxvZ2ljXG5cdCAgICAgICAgICAgICAgICAgICAgdGhpcy5fZG9Qcm9jZXNzQmxvY2soZGF0YVdvcmRzLCBvZmZzZXQpO1xuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJvY2Vzc2VkIHdvcmRzXG5cdCAgICAgICAgICAgICAgICB2YXIgcHJvY2Vzc2VkV29yZHMgPSBkYXRhV29yZHMuc3BsaWNlKDAsIG5Xb3Jkc1JlYWR5KTtcblx0ICAgICAgICAgICAgICAgIGRhdGEuc2lnQnl0ZXMgLT0gbkJ5dGVzUmVhZHk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBSZXR1cm4gcHJvY2Vzc2VkIHdvcmRzXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQocHJvY2Vzc2VkV29yZHMsIG5CeXRlc1JlYWR5KTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5jbG9uZSgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBjbG9uZSA9IEJhc2UuY2xvbmUuY2FsbCh0aGlzKTtcblx0ICAgICAgICAgICAgY2xvbmUuX2RhdGEgPSB0aGlzLl9kYXRhLmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBfbWluQnVmZmVyU2l6ZTogMFxuXHQgICAgfSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWJzdHJhY3QgaGFzaGVyIHRlbXBsYXRlLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibG9ja1NpemUgVGhlIG51bWJlciBvZiAzMi1iaXQgd29yZHMgdGhpcyBoYXNoZXIgb3BlcmF0ZXMgb24uIERlZmF1bHQ6IDE2ICg1MTIgYml0cylcblx0ICAgICAqL1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlciA9IEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uZXh0ZW5kKHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMuXG5cdCAgICAgICAgICovXG5cdCAgICAgICAgY2ZnOiBCYXNlLmV4dGVuZCgpLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZmcgKE9wdGlvbmFsKSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHVzZSBmb3IgdGhpcyBoYXNoIGNvbXB1dGF0aW9uLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaGVyID0gQ3J5cHRvSlMuYWxnby5TSEEyNTYuY3JlYXRlKCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgaW5pdDogZnVuY3Rpb24gKGNmZykge1xuXHQgICAgICAgICAgICAvLyBBcHBseSBjb25maWcgZGVmYXVsdHNcblx0ICAgICAgICAgICAgdGhpcy5jZmcgPSB0aGlzLmNmZy5leHRlbmQoY2ZnKTtcblxuXHQgICAgICAgICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZXNcblx0ICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBSZXNldHMgdGhpcyBoYXNoZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhhc2hlci5yZXNldCgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIC8vIFJlc2V0IGRhdGEgYnVmZmVyXG5cdCAgICAgICAgICAgIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQuY2FsbCh0aGlzKTtcblxuXHQgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWhhc2hlciBsb2dpY1xuXHQgICAgICAgICAgICB0aGlzLl9kb1Jlc2V0KCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFVwZGF0ZXMgdGhpcyBoYXNoZXIgd2l0aCBhIG1lc3NhZ2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7SGFzaGVyfSBUaGlzIGhhc2hlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgaGFzaGVyLnVwZGF0ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICBoYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBBcHBlbmRcblx0ICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXG5cdCAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgaGFzaFxuXHQgICAgICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cblx0ICAgICAgICAgICAgLy8gQ2hhaW5hYmxlXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBGaW5hbGl6ZXMgdGhlIGhhc2ggY29tcHV0YXRpb24uXG5cdCAgICAgICAgICogTm90ZSB0aGF0IHRoZSBmaW5hbGl6ZSBvcGVyYXRpb24gaXMgZWZmZWN0aXZlbHkgYSBkZXN0cnVjdGl2ZSwgcmVhZC1vbmNlIG9wZXJhdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSAoT3B0aW9uYWwpIEEgZmluYWwgbWVzc2FnZSB1cGRhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGZpbmFsaXplOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAvLyBGaW5hbCBtZXNzYWdlIHVwZGF0ZVxuXHQgICAgICAgICAgICBpZiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcblx0ICAgICAgICAgICAgdmFyIGhhc2ggPSB0aGlzLl9kb0ZpbmFsaXplKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhhc2g7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIGJsb2NrU2l6ZTogNTEyLzMyLFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIHNob3J0Y3V0IGZ1bmN0aW9uIHRvIGEgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byBjcmVhdGUgYSBoZWxwZXIgZm9yLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIFNIQTI1NiA9IENyeXB0b0pTLmxpYi5IYXNoZXIuX2NyZWF0ZUhlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2NyZWF0ZUhlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGNmZykge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBoYXNoZXIuaW5pdChjZmcpLmZpbmFsaXplKG1lc3NhZ2UpO1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaGVyIHRvIHVzZSBpbiB0aGlzIEhNQUMgaGVscGVyLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIEhtYWNTSEEyNTYgPSBDcnlwdG9KUy5saWIuSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBfY3JlYXRlSG1hY0hlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuXHQgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGtleSkge1xuXHQgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDX2FsZ28uSE1BQy5pbml0KGhhc2hlciwga2V5KS5maW5hbGl6ZShtZXNzYWdlKTtcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBBbGdvcml0aG0gbmFtZXNwYWNlLlxuXHQgICAgICovXG5cdCAgICB2YXIgQ19hbGdvID0gQy5hbGdvID0ge307XG5cblx0ICAgIHJldHVybiBDO1xuXHR9KE1hdGgpKTtcblxuXG5cdHJldHVybiBDcnlwdG9KUztcblxufSkpOyIsIjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnksIHVuZGVmKSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKDM4KSwgcmVxdWlyZSg0MSksIHJlcXVpcmUoNDApKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXCIuL2NvcmVcIiwgXCIuL3NoYTI1NlwiLCBcIi4vaG1hY1wiXSwgZmFjdG9yeSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gR2xvYmFsIChicm93c2VyKVxuXHRcdGZhY3Rvcnkocm9vdC5DcnlwdG9KUyk7XG5cdH1cbn0odGhpcywgZnVuY3Rpb24gKENyeXB0b0pTKSB7XG5cblx0cmV0dXJuIENyeXB0b0pTLkhtYWNTSEEyNTY7XG5cbn0pKTsiLCI7KGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKDM4KSk7XG5cdH1cblx0ZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyBBTURcblx0XHRkZWZpbmUoW1wiLi9jb3JlXCJdLCBmYWN0b3J5KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBHbG9iYWwgKGJyb3dzZXIpXG5cdFx0ZmFjdG9yeShyb290LkNyeXB0b0pTKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbiAoQ3J5cHRvSlMpIHtcblxuXHQoZnVuY3Rpb24gKCkge1xuXHQgICAgLy8gU2hvcnRjdXRzXG5cdCAgICB2YXIgQyA9IENyeXB0b0pTO1xuXHQgICAgdmFyIENfbGliID0gQy5saWI7XG5cdCAgICB2YXIgQmFzZSA9IENfbGliLkJhc2U7XG5cdCAgICB2YXIgQ19lbmMgPSBDLmVuYztcblx0ICAgIHZhciBVdGY4ID0gQ19lbmMuVXRmODtcblx0ICAgIHZhciBDX2FsZ28gPSBDLmFsZ287XG5cblx0ICAgIC8qKlxuXHQgICAgICogSE1BQyBhbGdvcml0aG0uXG5cdCAgICAgKi9cblx0ICAgIHZhciBITUFDID0gQ19hbGdvLkhNQUMgPSBCYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIEhNQUMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoIGFsZ29yaXRobSB0byB1c2UuXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBobWFjSGFzaGVyID0gQ3J5cHRvSlMuYWxnby5ITUFDLmNyZWF0ZShDcnlwdG9KUy5hbGdvLlNIQTI1Niwga2V5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBpbml0OiBmdW5jdGlvbiAoaGFzaGVyLCBrZXkpIHtcblx0ICAgICAgICAgICAgLy8gSW5pdCBoYXNoZXJcblx0ICAgICAgICAgICAgaGFzaGVyID0gdGhpcy5faGFzaGVyID0gbmV3IGhhc2hlci5pbml0KCk7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGtleSA9PSAnc3RyaW5nJykge1xuXHQgICAgICAgICAgICAgICAga2V5ID0gVXRmOC5wYXJzZShrZXkpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBoYXNoZXJCbG9ja1NpemUgPSBoYXNoZXIuYmxvY2tTaXplO1xuXHQgICAgICAgICAgICB2YXIgaGFzaGVyQmxvY2tTaXplQnl0ZXMgPSBoYXNoZXJCbG9ja1NpemUgKiA0O1xuXG5cdCAgICAgICAgICAgIC8vIEFsbG93IGFyYml0cmFyeSBsZW5ndGgga2V5c1xuXHQgICAgICAgICAgICBpZiAoa2V5LnNpZ0J5dGVzID4gaGFzaGVyQmxvY2tTaXplQnl0ZXMpIHtcblx0ICAgICAgICAgICAgICAgIGtleSA9IGhhc2hlci5maW5hbGl6ZShrZXkpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQ2xhbXAgZXhjZXNzIGJpdHNcblx0ICAgICAgICAgICAga2V5LmNsYW1wKCk7XG5cblx0ICAgICAgICAgICAgLy8gQ2xvbmUga2V5IGZvciBpbm5lciBhbmQgb3V0ZXIgcGFkc1xuXHQgICAgICAgICAgICB2YXIgb0tleSA9IHRoaXMuX29LZXkgPSBrZXkuY2xvbmUoKTtcblx0ICAgICAgICAgICAgdmFyIGlLZXkgPSB0aGlzLl9pS2V5ID0ga2V5LmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBvS2V5V29yZHMgPSBvS2V5LndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgaUtleVdvcmRzID0gaUtleS53b3JkcztcblxuXHQgICAgICAgICAgICAvLyBYT1Iga2V5cyB3aXRoIHBhZCBjb25zdGFudHNcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXNoZXJCbG9ja1NpemU7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgb0tleVdvcmRzW2ldIF49IDB4NWM1YzVjNWM7XG5cdCAgICAgICAgICAgICAgICBpS2V5V29yZHNbaV0gXj0gMHgzNjM2MzYzNjtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICBvS2V5LnNpZ0J5dGVzID0gaUtleS5zaWdCeXRlcyA9IGhhc2hlckJsb2NrU2l6ZUJ5dGVzO1xuXG5cdCAgICAgICAgICAgIC8vIFNldCBpbml0aWFsIHZhbHVlc1xuXHQgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFJlc2V0cyB0aGlzIEhNQUMgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhtYWNIYXNoZXIucmVzZXQoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dFxuXHQgICAgICAgICAgICB2YXIgaGFzaGVyID0gdGhpcy5faGFzaGVyO1xuXG5cdCAgICAgICAgICAgIC8vIFJlc2V0XG5cdCAgICAgICAgICAgIGhhc2hlci5yZXNldCgpO1xuXHQgICAgICAgICAgICBoYXNoZXIudXBkYXRlKHRoaXMuX2lLZXkpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBVcGRhdGVzIHRoaXMgSE1BQyB3aXRoIGEgbWVzc2FnZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSBUaGUgbWVzc2FnZSB0byBhcHBlbmQuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtITUFDfSBUaGlzIEhNQUMgaW5zdGFuY2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhtYWNIYXNoZXIudXBkYXRlKCdtZXNzYWdlJyk7XG5cdCAgICAgICAgICogICAgIGhtYWNIYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuXHQgICAgICAgICAgICB0aGlzLl9oYXNoZXIudXBkYXRlKG1lc3NhZ2VVcGRhdGUpO1xuXG5cdCAgICAgICAgICAgIC8vIENoYWluYWJsZVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogRmluYWxpemVzIHRoZSBITUFDIGNvbXB1dGF0aW9uLlxuXHQgICAgICAgICAqIE5vdGUgdGhhdCB0aGUgZmluYWxpemUgb3BlcmF0aW9uIGlzIGVmZmVjdGl2ZWx5IGEgZGVzdHJ1Y3RpdmUsIHJlYWQtb25jZSBvcGVyYXRpb24uXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgKE9wdGlvbmFsKSBBIGZpbmFsIG1lc3NhZ2UgdXBkYXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGhtYWMgPSBobWFjSGFzaGVyLmZpbmFsaXplKCk7XG5cdCAgICAgICAgICogICAgIHZhciBobWFjID0gaG1hY0hhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuXHQgICAgICAgICAqICAgICB2YXIgaG1hYyA9IGhtYWNIYXNoZXIuZmluYWxpemUod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBmaW5hbGl6ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIGhhc2hlciA9IHRoaXMuX2hhc2hlcjtcblxuXHQgICAgICAgICAgICAvLyBDb21wdXRlIEhNQUNcblx0ICAgICAgICAgICAgdmFyIGlubmVySGFzaCA9IGhhc2hlci5maW5hbGl6ZShtZXNzYWdlVXBkYXRlKTtcblx0ICAgICAgICAgICAgaGFzaGVyLnJlc2V0KCk7XG5cdCAgICAgICAgICAgIHZhciBobWFjID0gaGFzaGVyLmZpbmFsaXplKHRoaXMuX29LZXkuY2xvbmUoKS5jb25jYXQoaW5uZXJIYXNoKSk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGhtYWM7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cdH0oKSk7XG5cblxufSkpOyIsIjsoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYgKHR5cGVvZiBleHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG5cdFx0Ly8gQ29tbW9uSlNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoMzgpKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXCIuL2NvcmVcIl0sIGZhY3RvcnkpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIEdsb2JhbCAoYnJvd3Nlcilcblx0XHRmYWN0b3J5KHJvb3QuQ3J5cHRvSlMpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uIChDcnlwdG9KUykge1xuXG5cdChmdW5jdGlvbiAoTWF0aCkge1xuXHQgICAgLy8gU2hvcnRjdXRzXG5cdCAgICB2YXIgQyA9IENyeXB0b0pTO1xuXHQgICAgdmFyIENfbGliID0gQy5saWI7XG5cdCAgICB2YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5O1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlcjtcblx0ICAgIHZhciBDX2FsZ28gPSBDLmFsZ287XG5cblx0ICAgIC8vIEluaXRpYWxpemF0aW9uIGFuZCByb3VuZCBjb25zdGFudHMgdGFibGVzXG5cdCAgICB2YXIgSCA9IFtdO1xuXHQgICAgdmFyIEsgPSBbXTtcblxuXHQgICAgLy8gQ29tcHV0ZSBjb25zdGFudHNcblx0ICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgZnVuY3Rpb24gaXNQcmltZShuKSB7XG5cdCAgICAgICAgICAgIHZhciBzcXJ0TiA9IE1hdGguc3FydChuKTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgZmFjdG9yID0gMjsgZmFjdG9yIDw9IHNxcnROOyBmYWN0b3IrKykge1xuXHQgICAgICAgICAgICAgICAgaWYgKCEobiAlIGZhY3RvcikpIHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cdCAgICAgICAgICAgICAgICB9XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBmdW5jdGlvbiBnZXRGcmFjdGlvbmFsQml0cyhuKSB7XG5cdCAgICAgICAgICAgIHJldHVybiAoKG4gLSAobiB8IDApKSAqIDB4MTAwMDAwMDAwKSB8IDA7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgdmFyIG4gPSAyO1xuXHQgICAgICAgIHZhciBuUHJpbWUgPSAwO1xuXHQgICAgICAgIHdoaWxlIChuUHJpbWUgPCA2NCkge1xuXHQgICAgICAgICAgICBpZiAoaXNQcmltZShuKSkge1xuXHQgICAgICAgICAgICAgICAgaWYgKG5QcmltZSA8IDgpIHtcblx0ICAgICAgICAgICAgICAgICAgICBIW25QcmltZV0gPSBnZXRGcmFjdGlvbmFsQml0cyhNYXRoLnBvdyhuLCAxIC8gMikpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgS1tuUHJpbWVdID0gZ2V0RnJhY3Rpb25hbEJpdHMoTWF0aC5wb3cobiwgMSAvIDMpKTtcblxuXHQgICAgICAgICAgICAgICAgblByaW1lKys7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICBuKys7XG5cdCAgICAgICAgfVxuXHQgICAgfSgpKTtcblxuXHQgICAgLy8gUmV1c2FibGUgb2JqZWN0XG5cdCAgICB2YXIgVyA9IFtdO1xuXG5cdCAgICAvKipcblx0ICAgICAqIFNIQS0yNTYgaGFzaCBhbGdvcml0aG0uXG5cdCAgICAgKi9cblx0ICAgIHZhciBTSEEyNTYgPSBDX2FsZ28uU0hBMjU2ID0gSGFzaGVyLmV4dGVuZCh7XG5cdCAgICAgICAgX2RvUmVzZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdGhpcy5faGFzaCA9IG5ldyBXb3JkQXJyYXkuaW5pdChILnNsaWNlKDApKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX2RvUHJvY2Vzc0Jsb2NrOiBmdW5jdGlvbiAoTSwgb2Zmc2V0KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0XG5cdCAgICAgICAgICAgIHZhciBIID0gdGhpcy5faGFzaC53b3JkcztcblxuXHQgICAgICAgICAgICAvLyBXb3JraW5nIHZhcmlhYmxlc1xuXHQgICAgICAgICAgICB2YXIgYSA9IEhbMF07XG5cdCAgICAgICAgICAgIHZhciBiID0gSFsxXTtcblx0ICAgICAgICAgICAgdmFyIGMgPSBIWzJdO1xuXHQgICAgICAgICAgICB2YXIgZCA9IEhbM107XG5cdCAgICAgICAgICAgIHZhciBlID0gSFs0XTtcblx0ICAgICAgICAgICAgdmFyIGYgPSBIWzVdO1xuXHQgICAgICAgICAgICB2YXIgZyA9IEhbNl07XG5cdCAgICAgICAgICAgIHZhciBoID0gSFs3XTtcblxuXHQgICAgICAgICAgICAvLyBDb21wdXRhdGlvblxuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIGlmIChpIDwgMTYpIHtcblx0ICAgICAgICAgICAgICAgICAgICBXW2ldID0gTVtvZmZzZXQgKyBpXSB8IDA7XG5cdCAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBnYW1tYTB4ID0gV1tpIC0gMTVdO1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciBnYW1tYTAgID0gKChnYW1tYTB4IDw8IDI1KSB8IChnYW1tYTB4ID4+PiA3KSkgIF5cblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoZ2FtbWEweCA8PCAxNCkgfCAoZ2FtbWEweCA+Pj4gMTgpKSBeXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGdhbW1hMHggPj4+IDMpO1xuXG5cdCAgICAgICAgICAgICAgICAgICAgdmFyIGdhbW1hMXggPSBXW2kgLSAyXTtcblx0ICAgICAgICAgICAgICAgICAgICB2YXIgZ2FtbWExICA9ICgoZ2FtbWExeCA8PCAxNSkgfCAoZ2FtbWExeCA+Pj4gMTcpKSBeXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGdhbW1hMXggPDwgMTMpIHwgKGdhbW1hMXggPj4+IDE5KSkgXlxuXHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChnYW1tYTF4ID4+PiAxMCk7XG5cblx0ICAgICAgICAgICAgICAgICAgICBXW2ldID0gZ2FtbWEwICsgV1tpIC0gN10gKyBnYW1tYTEgKyBXW2kgLSAxNl07XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIHZhciBjaCAgPSAoZSAmIGYpIF4gKH5lICYgZyk7XG5cdCAgICAgICAgICAgICAgICB2YXIgbWFqID0gKGEgJiBiKSBeIChhICYgYykgXiAoYiAmIGMpO1xuXG5cdCAgICAgICAgICAgICAgICB2YXIgc2lnbWEwID0gKChhIDw8IDMwKSB8IChhID4+PiAyKSkgXiAoKGEgPDwgMTkpIHwgKGEgPj4+IDEzKSkgXiAoKGEgPDwgMTApIHwgKGEgPj4+IDIyKSk7XG5cdCAgICAgICAgICAgICAgICB2YXIgc2lnbWExID0gKChlIDw8IDI2KSB8IChlID4+PiA2KSkgXiAoKGUgPDwgMjEpIHwgKGUgPj4+IDExKSkgXiAoKGUgPDwgNykgIHwgKGUgPj4+IDI1KSk7XG5cblx0ICAgICAgICAgICAgICAgIHZhciB0MSA9IGggKyBzaWdtYTEgKyBjaCArIEtbaV0gKyBXW2ldO1xuXHQgICAgICAgICAgICAgICAgdmFyIHQyID0gc2lnbWEwICsgbWFqO1xuXG5cdCAgICAgICAgICAgICAgICBoID0gZztcblx0ICAgICAgICAgICAgICAgIGcgPSBmO1xuXHQgICAgICAgICAgICAgICAgZiA9IGU7XG5cdCAgICAgICAgICAgICAgICBlID0gKGQgKyB0MSkgfCAwO1xuXHQgICAgICAgICAgICAgICAgZCA9IGM7XG5cdCAgICAgICAgICAgICAgICBjID0gYjtcblx0ICAgICAgICAgICAgICAgIGIgPSBhO1xuXHQgICAgICAgICAgICAgICAgYSA9ICh0MSArIHQyKSB8IDA7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBJbnRlcm1lZGlhdGUgaGFzaCB2YWx1ZVxuXHQgICAgICAgICAgICBIWzBdID0gKEhbMF0gKyBhKSB8IDA7XG5cdCAgICAgICAgICAgIEhbMV0gPSAoSFsxXSArIGIpIHwgMDtcblx0ICAgICAgICAgICAgSFsyXSA9IChIWzJdICsgYykgfCAwO1xuXHQgICAgICAgICAgICBIWzNdID0gKEhbM10gKyBkKSB8IDA7XG5cdCAgICAgICAgICAgIEhbNF0gPSAoSFs0XSArIGUpIHwgMDtcblx0ICAgICAgICAgICAgSFs1XSA9IChIWzVdICsgZikgfCAwO1xuXHQgICAgICAgICAgICBIWzZdID0gKEhbNl0gKyBnKSB8IDA7XG5cdCAgICAgICAgICAgIEhbN10gPSAoSFs3XSArIGgpIHwgMDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX2RvRmluYWxpemU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcblx0ICAgICAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG5cblx0ICAgICAgICAgICAgdmFyIG5CaXRzVG90YWwgPSB0aGlzLl9uRGF0YUJ5dGVzICogODtcblx0ICAgICAgICAgICAgdmFyIG5CaXRzTGVmdCA9IGRhdGEuc2lnQnl0ZXMgKiA4O1xuXG5cdCAgICAgICAgICAgIC8vIEFkZCBwYWRkaW5nXG5cdCAgICAgICAgICAgIGRhdGFXb3Jkc1tuQml0c0xlZnQgPj4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbkJpdHNMZWZ0ICUgMzIpO1xuXHQgICAgICAgICAgICBkYXRhV29yZHNbKCgobkJpdHNMZWZ0ICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IE1hdGguZmxvb3IobkJpdHNUb3RhbCAvIDB4MTAwMDAwMDAwKTtcblx0ICAgICAgICAgICAgZGF0YVdvcmRzWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNV0gPSBuQml0c1RvdGFsO1xuXHQgICAgICAgICAgICBkYXRhLnNpZ0J5dGVzID0gZGF0YVdvcmRzLmxlbmd0aCAqIDQ7XG5cblx0ICAgICAgICAgICAgLy8gSGFzaCBmaW5hbCBibG9ja3Ncblx0ICAgICAgICAgICAgdGhpcy5fcHJvY2VzcygpO1xuXG5cdCAgICAgICAgICAgIC8vIFJldHVybiBmaW5hbCBjb21wdXRlZCBoYXNoXG5cdCAgICAgICAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB2YXIgY2xvbmUgPSBIYXNoZXIuY2xvbmUuY2FsbCh0aGlzKTtcblx0ICAgICAgICAgICAgY2xvbmUuX2hhc2ggPSB0aGlzLl9oYXNoLmNsb25lKCk7XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGNsb25lO1xuXHQgICAgICAgIH1cblx0ICAgIH0pO1xuXG5cdCAgICAvKipcblx0ICAgICAqIFNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBoYXNoZXIncyBvYmplY3QgaW50ZXJmYWNlLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuXHQgICAgICpcblx0ICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIGhhc2guXG5cdCAgICAgKlxuXHQgICAgICogQHN0YXRpY1xuXHQgICAgICpcblx0ICAgICAqIEBleGFtcGxlXG5cdCAgICAgKlxuXHQgICAgICogICAgIHZhciBoYXNoID0gQ3J5cHRvSlMuU0hBMjU2KCdtZXNzYWdlJyk7XG5cdCAgICAgKiAgICAgdmFyIGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYod29yZEFycmF5KTtcblx0ICAgICAqL1xuXHQgICAgQy5TSEEyNTYgPSBIYXNoZXIuX2NyZWF0ZUhlbHBlcihTSEEyNTYpO1xuXG5cdCAgICAvKipcblx0ICAgICAqIFNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBITUFDJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gaGFzaC5cblx0ICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30ga2V5IFRoZSBzZWNyZXQga2V5LlxuXHQgICAgICpcblx0ICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIEhNQUMuXG5cdCAgICAgKlxuXHQgICAgICogQHN0YXRpY1xuXHQgICAgICpcblx0ICAgICAqIEBleGFtcGxlXG5cdCAgICAgKlxuXHQgICAgICogICAgIHZhciBobWFjID0gQ3J5cHRvSlMuSG1hY1NIQTI1NihtZXNzYWdlLCBrZXkpO1xuXHQgICAgICovXG5cdCAgICBDLkhtYWNTSEEyNTYgPSBIYXNoZXIuX2NyZWF0ZUhtYWNIZWxwZXIoU0hBMjU2KTtcblx0fShNYXRoKSk7XG5cblxuXHRyZXR1cm4gQ3J5cHRvSlMuU0hBMjU2O1xuXG59KSk7IiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvY3J5cHRvLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgSG1hY1NIQTI1NiA9IHJlcXVpcmUoMzkpO1xudmFyIEhleCA9IHJlcXVpcmUoMzgpLmVuYy5IZXg7XG5cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IGZ1bmN0aW9uICh0eXBlLCBrZXkpIHtcbiAgICBpZiAodHlwZSA9PT0gJ3NoYTI1NicpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgdmFyIHNoYTI1NkhtYWMgPSB7XG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBIbWFjU0hBMjU2KGRhdGEsIGtleSkudG9TdHJpbmcoSGV4KTtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlICovXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlnZXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2hhMjU2SG1hYztcbiAgICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvZXZlbnRzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKipcbiAqIEV2ZW50RW1pdHRlclxuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gICAgdGhpcy5fX2V2ZW50cyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCB2YXJfYXJncykge1xuICAgIHZhciBoYW5kbGVycyA9IHRoaXMuX19ldmVudHNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gaGFuZGxlcnNbaV07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgLy8gSUdOT1JFXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIGlmICghdGhpcy5fX2V2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMuX19ldmVudHNbZXZlbnROYW1lXSA9IFtsaXN0ZW5lcl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChsaXN0ZW5lcik7XG4gICAgfVxufTtcblxuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL3BhdGguanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1ID0gcmVxdWlyZSg0Nyk7XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID0gL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG5cbmZ1bmN0aW9uIHNwbGl0UGF0aChmaWxlbmFtZSkge1xuICAgIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn1cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICAgIHZhciB1cCA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcblxuICAgICAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgdXArKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1cCkge1xuICAgICAgICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgdXAtLTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICAgICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9O1xuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUodS5maWx0ZXIocGF0aHMsIGZ1bmN0aW9uIChwLCBpbmRleCkge1xuICAgICAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwO1xuICAgIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgdmFyIGlzQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KHUuZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuICEhcDtcbiAgICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICAgIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgICAgICBwYXRoID0gJy4nO1xuICAgIH1cbiAgICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgICAgIHBhdGggKz0gJy8nO1xuICAgIH1cblxuICAgIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSBzcmMvdmVuZG9yL3EuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoMzYpO1xuXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZS5hcHBseShQcm9taXNlLCBhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5yZWplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0LmFwcGx5KFByb21pc2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLmFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwuYXBwbHkoUHJvbWlzZSwgYXJndW1lbnRzKTtcbn07XG5cbmV4cG9ydHMuZmNhbGwgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZuKCkpO1xuICAgIH1cbiAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGV4KTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmRlZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWZlcnJlZCA9IHt9O1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc29sdmUuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVqZWN0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHNyYy92ZW5kb3IvcXVlcnlzdHJpbmcuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1ID0gcmVxdWlyZSg0Nyk7XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVByaW1pdGl2ZSh2KSB7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHYpKSB7XG4gICAgICAgIHJldHVybiAnJyArIHY7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn1cblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gICAgc2VwID0gc2VwIHx8ICcmJztcbiAgICBlcSA9IGVxIHx8ICc9JztcblxuICAgIHZhciBlbmNvZGUgPSBlbmNvZGVVUklDb21wb25lbnQ7IC8vIFF1ZXJ5U3RyaW5nLmVzY2FwZTtcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5lbmNvZGVVUklDb21wb25lbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW5jb2RlID0gb3B0aW9ucy5lbmNvZGVVUklDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgaWYgKG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIga2V5cyA9IHUua2V5cyhvYmopO1xuICAgICAgICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIHZhciBmbGFzdCA9IGxlbiAtIDE7XG4gICAgICAgIHZhciBmaWVsZHMgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgdmFyIHYgPSBvYmpba107XG4gICAgICAgICAgICB2YXIga3MgPSBlbmNvZGUoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuXG4gICAgICAgICAgICBpZiAodS5pc0FycmF5KHYpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZsZW4gPSB2Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgdmxhc3QgPSB2bGVuIC0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZsZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0ga3MgKyBlbmNvZGUoc3RyaW5naWZ5UHJpbWl0aXZlKHZbal0pKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGogPCB2bGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHNlcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2bGVuICYmIGkgPCBmbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpZWxkcyArPSBrcyArIGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICAgICAgICAgIGlmIChpIDwgZmxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHNlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG59O1xuIiwiLyoqXG4gKiBhZyAtLW5vLWZpbGVuYW1lIC1vICdcXGIodVxcLi4qPylcXCgnIC4gIHwgc29ydCB8IHVuaXEgLWNcbiAqXG4gKiBAZmlsZSB2ZW5kb3IvdW5kZXJzY29yZS5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKDUpO1xudmFyIG5vb3AgPSByZXF1aXJlKDEwKTtcbnZhciBpc051bWJlciA9IHJlcXVpcmUoMTMpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgxNCk7XG52YXIgaXNTdHJpbmcgPSByZXF1aXJlKDE1KTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChzb3VyY2UsIHZhcl9hcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChpdGVtICYmIGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICB2YXIgb0tleXMgPSBrZXlzKGl0ZW0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBvS2V5c1tqXTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgICAgICAgc291cmNlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2U7XG59XG5cbmZ1bmN0aW9uIG1hcChhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHRbaV0gPSBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGZvcmVhY2goYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaW5kKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV07XG4gICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlLCBpLCBhcnJheSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldO1xuICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSwgaSwgYXJyYXkpKSB7XG4gICAgICAgICAgICByZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gb21pdChvYmplY3QsIHZhcl9hcmdzKSB7XG4gICAgdmFyIGFyZ3MgPSBpc0FycmF5KHZhcl9hcmdzKVxuICAgICAgICA/IHZhcl9hcmdzXG4gICAgICAgIDogW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgdmFyIG9LZXlzID0ga2V5cyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb0tleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IG9LZXlzW2ldO1xuICAgICAgICBpZiAoYXJncy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcGljayhvYmplY3QsIHZhcl9hcmdzLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIGtleTtcbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAoaXNGdW5jdGlvbih2YXJfYXJncykpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdmFyX2FyZ3M7XG4gICAgICAgIHZhciBvS2V5cyA9IGtleXMob2JqZWN0KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG9LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBrZXkgPSBvS2V5c1tpXTtcbiAgICAgICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSwga2V5LCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBpc0FycmF5KHZhcl9hcmdzKVxuICAgICAgICAgICAgPyB2YXJfYXJnc1xuICAgICAgICAgICAgOiBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGtleSA9IGFyZ3NbaV07XG4gICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGJpbmQoZm4sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGhhc0RvbnRFbnVtQnVnID0gISh7dG9TdHJpbmc6IG51bGx9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbnZhciBkb250RW51bXMgPSBbJ3RvU3RyaW5nJywgJ3RvTG9jYWxlU3RyaW5nJywgJ3ZhbHVlT2YnLCAnaGFzT3duUHJvcGVydHknLFxuICAgICdpc1Byb3RvdHlwZU9mJywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2NvbnN0cnVjdG9yJ107XG5cbmZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBwcm9wO1xuICAgIHZhciBpO1xuXG4gICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwcm9wKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZG9udEVudW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGRvbnRFbnVtc1tpXSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChkb250RW51bXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0cy5iaW5kID0gYmluZDtcbmV4cG9ydHMuZWFjaCA9IGZvcmVhY2g7XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMuZmlsdGVyID0gZmlsdGVyO1xuZXhwb3J0cy5maW5kID0gZmluZDtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuZXhwb3J0cy5tYXAgPSBtYXA7XG5leHBvcnRzLm9taXQgPSBvbWl0O1xuZXhwb3J0cy5waWNrID0gcGljaztcbmV4cG9ydHMua2V5cyA9IGtleXM7XG5leHBvcnRzLm5vb3AgPSBub29wO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci91dGlsLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgdSA9IHJlcXVpcmUoNDcpO1xuXG5leHBvcnRzLmluaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgdmFyIHN1YkNsYXNzUHJvdG8gPSBzdWJDbGFzcy5wcm90b3R5cGU7XG4gICAgdmFyIEYgPSBuZXcgRnVuY3Rpb24oKTtcbiAgICBGLnByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IG5ldyBGKCk7XG4gICAgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7XG4gICAgdS5leHRlbmQoc3ViQ2xhc3MucHJvdG90eXBlLCBzdWJDbGFzc1Byb3RvKTtcbn07XG5cbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgYXJnTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgIGlmIChhcmdMZW4gPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGY7XG4gICAgfVxuXG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIHZhciBhID0gMTtcbiAgICB2YXIgbGFzdFBvcyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmLmxlbmd0aDspIHtcbiAgICAgICAgaWYgKGYuY2hhckNvZGVBdChpKSA9PT0gMzcgLyoqICclJyAqLyAmJiBpICsgMSA8IGYubGVuZ3RoKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGYuY2hhckNvZGVBdChpICsgMSkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEwMDogLy8gJ2QnXG4gICAgICAgICAgICAgICAgICAgIGlmIChhID49IGFyZ0xlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IE51bWJlcihhcmd1bWVudHNbYSsrXSk7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RQb3MgPSBpID0gaSArIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgMTE1OiAvLyAncydcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPj0gYXJnTGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gU3RyaW5nKGFyZ3VtZW50c1thKytdKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBvcyA9IGkgPSBpICsgMjtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSAzNzogLy8gJyUnXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJyUnO1xuICAgICAgICAgICAgICAgICAgICBsYXN0UG9zID0gaSA9IGkgKyAyO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICsraTtcbiAgICB9XG5cbiAgICBpZiAobGFzdFBvcyA9PT0gMCkge1xuICAgICAgICBzdHIgPSBmO1xuICAgIH1cbiAgICBlbHNlIGlmIChsYXN0UG9zIDwgZi5sZW5ndGgpIHtcbiAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbn07XG4iXX0=
