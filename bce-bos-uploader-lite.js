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
var BosClient = require(17);
var Auth = require(15);

var Uploader = require(31);
var utils = require(32);

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










},{"15":15,"17":17,"31":31,"32":32,"44":44}],2:[function(require,module,exports){
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

var helper = require(42);
var util = require(47);
var u = require(46);
var H = require(19);
var strings = require(22);

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
        this.ak, helper.toUTCString(now), expirationInSeconds || 1800);
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
    u.each(u.keys(params), function (key) {
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
    u.each(headersToSign, function (item) {
        headersMap[item.toLowerCase()] = true;
    });

    var canonicalHeaders = [];
    u.each(u.keys(headers), function (key) {
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
    u.each(canonicalHeaders, function (item) {
        signedHeaders.push(item.split(':')[0]);
    });

    return [canonicalHeaders.join('\n'), signedHeaders];
};

Auth.prototype.hash = function (data, key) {
    var crypto = require(40);
    var sha256Hmac = crypto.createHmac('sha256', key);
    sha256Hmac.update(data);
    return sha256Hmac.digest('hex');
};

module.exports = Auth;


},{"19":19,"22":22,"40":40,"42":42,"46":46,"47":47}],16:[function(require,module,exports){
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

var EventEmitter = require(41).EventEmitter;
var util = require(47);
var Q = require(44);
var u = require(46);
var config = require(18);
var Auth = require(15);

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


},{"15":15,"18":18,"41":41,"44":44,"46":46,"47":47}],17:[function(require,module,exports){
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
var Buffer = require(33);
var H = require(19);
var strings = require(22);
var HttpClient = require(20);
var BceBaseClient = require(16);
var MimeType = require(21);

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
    var resource = [
        '/v1',
        strings.normalize(args.bucketName || ''),
        strings.normalize(args.key || '', false)
    ].join('/');

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
    var allowedHeaders = {};
    u.each([
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
    ], function (header) {
        allowedHeaders[header] = true;
    });

    var metaSize = 0;
    var headers = u.pick(options, function (value, key) {
        if (allowedHeaders[key]) {
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

},{"16":16,"19":19,"20":20,"21":21,"22":22,"33":33,"43":43,"46":46,"47":47}],18:[function(require,module,exports){
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











},{}],19:[function(require,module,exports){
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
 * @file src/http_client.js
 * @author leeight
 */

/* eslint-env node */
/* eslint max-params:[0,10] */
/* globals ArrayBuffer */

var EventEmitter = require(41).EventEmitter;
var Buffer = require(33);
var Q = require(44);
var helper = require(42);
var u = require(46);
var util = require(47);
var H = require(19);

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
    defaultHeaders[H.X_BCE_DATE] = helper.toUTCString(new Date());
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
            if (!responseBody) {
                responseBody = {};
            }

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


},{"19":19,"33":33,"41":41,"42":42,"44":44,"45":45,"46":46,"47":47}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
 * @file config.js
 * @author leeight
 */


var kDefaultOptions = {
    runtimes: 'html5',

    // bos服务器的地址，默认(http://bj.bcebos.com)
    bos_endpoint: 'http://bj.bcebos.com',

    // 默认的 ak 和 sk 配置
    bos_ak: null,
    bos_sk: null,
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
    tracker_id: null
};

module.exports = kDefaultOptions;











},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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
var async = require(35);
var u = require(46);
var utils = require(32);
var events = require(24);
var Task = require(30);

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

},{"24":24,"30":30,"32":32,"35":35,"44":44,"46":46}],26:[function(require,module,exports){
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

var utils = require(32);

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

},{"32":32}],27:[function(require,module,exports){
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
var utils = require(32);
var events = require(24);
var Task = require(30);

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

},{"24":24,"30":30,"32":32,"44":44,"46":46}],28:[function(require,module,exports){
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











},{}],29:[function(require,module,exports){
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
var utils = require(32);

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

},{"32":32,"44":44}],30:[function(require,module,exports){
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

},{}],31:[function(require,module,exports){
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
var utils = require(32);
var events = require(24);
var kDefaultOptions = require(23);
var PutObjectTask = require(27);
var MultipartTask = require(25);
var StsTokenManager = require(29);
var NetworkInfo = require(26);

var Auth = require(15);
var BosClient = require(17);

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
        // 这里没有使用 async.eachLimit 的原因是 this._files 可能会被动态的修改
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
        && options.bos_bucket
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

        var TaskConstructor = PutObjectTask;
        if (multipart === 'auto'
            // 对于 moxie.XMLHttpRequest 来说，无法获取 getResponseHeader('ETag')
            // 导致在 completeMultipartUpload 的时候，无法传递正确的参数
            // 因此需要禁止使用 moxie.XMLHttpRequest 使用 MultipartTask
            // 除非用自己本地计算的 md5 作为 getResponseHeader('ETag') 的代替值，不过还是有一些问题：
            // 1. MultipartTask 需要对文件进行分片，但是使用 moxie.XMLHttpRequest 的时候，明显有卡顿的问题（因为 Flash 把整个文件都读取到内存中，然后再分片）
            //    导致处理大文件的时候性能很差
            // 2. 本地计算 md5 需要额外引入库，导致 bce-bos-uploader 的体积变大
            // 综上所述，在使用 moxie 的时候，禁止 MultipartTask
            && self._xhr2Supported
            && file.size > options.bos_multipart_min_size) {
            TaskConstructor = MultipartTask;
        }
        var task = new TaskConstructor(client, eventDispatcher, taskOptions);

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

},{"15":15,"17":17,"23":23,"24":24,"25":25,"26":26,"27":27,"29":29,"32":32,"44":44,"46":46}],32:[function(require,module,exports){
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
var helper = require(42);
var Queue = require(28);
var MimeType = require(21);

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
    var utcDateTime = helper.toUTCString(expiration);

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
        args.headers['x-bce-date'] = helper.toUTCString(new Date());
        args.headers.host = endpointHost;

        // Flash 的缓存貌似比较厉害，强制请求新的
        // XXX 好像服务器端不会把 .stamp 这个参数加入到签名的计算逻辑里面去
        args.params['.stamp'] = new Date().getTime();

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
            resource = xhrUri.replace(/^\w+:\/\/[^\/]+\//, '/');
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
                    || /(host|content\-length)/i.test(key)) {
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
    return require(47).inherits(ChildCtor, ParentCtor);
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

},{"21":21,"28":28,"42":42,"44":44,"45":45,"46":46,"47":47}],33:[function(require,module,exports){
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











},{}],34:[function(require,module,exports){
/**
 * @file Promise.js
 * @author ??
 */

(function (root) {

    // Store setTimeout reference so promise-polyfill will be unaffected by
    // other code modifying setTimeout (like sinon.useFakeTimers())
    var setTimeoutFunc = setTimeout;

    function noop() {
    }

    // Polyfill for Function.prototype.bind
    function bind(fn, thisArg) {
        return function () {
            fn.apply(thisArg, arguments);
        };
    }

    /**
     * Promise
     *
     * @param {Function} fn The executor.
     * @class
     */
    function Promise(fn) {
        if (typeof this !== 'object') {
            throw new TypeError('Promises must be constructed via new');
        }

        if (typeof fn !== 'function') {
            throw new TypeError('not a function');
        }

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
            }
            catch (e) {
                reject(deferred.promise, e);
                return;
            }
            resolve(deferred.promise, ret);
        });
    }

    function resolve(self, newValue) {
        try {
            // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
            if (newValue === self) {
                throw new TypeError('A promise cannot be resolved with itself.');
            }

            if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                var then = newValue.then;
                if (newValue instanceof Promise) {
                    self._state = 3;
                    self._value = newValue;
                    finale(self);
                    return;
                }
                else if (typeof then === 'function') {
                    doResolve(bind(then, newValue), self);
                    return;
                }
            }

            self._state = 1;
            self._value = newValue;
            finale(self);
        }
        catch (e) {
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
            Promise._immediateFn(function () {
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

    /**
     * Handler
     *
     * @class
     * @param {*} onFulfilled The onFulfilled.
     * @param {*} onRejected The onRejected.
     * @param {*} promise The promise.
     */
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
     *
     * @param {Function} fn The fn.
     * @param {*} self The context.
     */
    function doResolve(fn, self) {
        var done = false;
        try {
            fn(function (value) {
                if (done) {
                    return;
                }

                done = true;
                resolve(self, value);
            }, function (reason) {
                if (done) {
                    return;
                }

                done = true;
                reject(self, reason);
            });
        }
        catch (ex) {
            if (done) {
                return;
            }

            done = true;
            reject(self, ex);
        }
    }

    Promise.prototype["catch"] = function (onRejected) {   // eslint-disable-line
        return this.then(null, onRejected);
    };

    Promise.prototype.then = function (onFulfilled, onRejected) {   // eslint-disable-line
        var prom = new (this.constructor)(noop);

        handle(this, new Handler(onFulfilled, onRejected, prom));
        return prom;
    };

    Promise.all = function (arr) {
        var args = Array.prototype.slice.call(arr);

        return new Promise(function (resolve, reject) {
            if (args.length === 0) {
                return resolve([]);
            }

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

                }
                catch (ex) {
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
    Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) {
        setImmediate(fn);
    }) || function (fn) {
        setTimeoutFunc(fn, 0);
    };

    Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
        if (typeof console !== 'undefined' && console) {
            console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
        }

    };

    /**
     * Set the immediate function to execute callbacks
     *
     * @param {Function} fn Function to execute
     * @deprecated
     */
    Promise._setImmediateFn = function _setImmediateFn(fn) {
        Promise._immediateFn = fn;
    };

    /**
     * Change the function to execute on unhandled rejection
     *
     * @param {Function} fn Function to execute on unhandled rejection
     * @deprecated
     */
    Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
        Promise._unhandledRejectionFn = fn;
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Promise;
    }
    else if (!root.Promise) {
        root.Promise = Promise;
    }

})(this);

},{}],35:[function(require,module,exports){
/**
 * @file vendor/async.js
 * @author leeight
 */

exports.mapLimit = require(2);

},{"2":2}],36:[function(require,module,exports){
/**
 * @file core.js
 * @author ???
 */

/**
 * Local polyfil of Object.create
 */
var create = Object.create || (function () {
    function F() {    // eslint-disable-line
    }

    return function (obj) {
        var subtype;

        F.prototype = obj;

        subtype = new F();

        F.prototype = null;

        return subtype;
    };
}());

/**
 * CryptoJS namespace.
 */
var C = {};

/**
 * Algorithm namespace.
 */
var C_algo = C.algo = {};

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
        init: function () {},

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

        if (sigBytes != undefined) {    // eslint-disable-line
            this.sigBytes = sigBytes;
        }
        else {
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
        return (encoder || Hex).stringify(this);    // eslint-disable-line
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


        var i;

        // Concat
        if (thisSigBytes % 4) {
            // Copy one byte at a time
            for (i = 0; i < thatSigBytes; i++) {
                var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
            }
        }
        else {
            // Copy one word at a time
            for (i = 0; i < thatSigBytes; i += 4) {
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

        var r = function (m_w) {
            var m_z = 0x3ade68b1;
            var mask = 0xffffffff;

            return function () {
                m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
                m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
                var result = ((m_z << 0x10) + m_w) & mask;
                result /= 0x100000000;
                result += 0.5;
                return result * (Math.random() > .5 ? 1 : -1);
            };
        };

        for (var i = 0, rcache; i < nBytes; i += 4) {
            var _r = r((rcache || Math.random()) * 0x100000000);

            rcache = _r() * 0x3ade67b7;
            words.push((_r() * 0x100000000) | 0);
        }

        return new WordArray.init(words, nBytes); // eslint-disable-line
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

        return new WordArray.init(words, hexStrLength / 2);   // eslint-disable-line
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

        return new WordArray.init(words, latin1StrLength);    // eslint-disable-line
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
        }
        catch (e) {
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
        this._data = new WordArray.init();    // eslint-disable-line
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
        if (typeof data === 'string') {
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
        }
        else {
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
        return new WordArray.init(processedWords, nBytesReady);   // eslint-disable-line
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
C_lib.Hasher = BufferedBlockAlgorithm.extend({

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

    blockSize: 512 / 32,

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
            return new hasher.init(cfg).finalize(message);    // eslint-disable-line
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
            return new C_algo.HMAC.init(hasher, key).finalize(message);   // eslint-disable-line
        };
    }
});

module.exports = C;

},{}],37:[function(require,module,exports){
/**
 * @file hmac-sha256.js
 * @author ???
 */
require(39);
require(38);
var CryptoJS = require(36);

module.exports = CryptoJS.HmacSHA256;

},{"36":36,"38":38,"39":39}],38:[function(require,module,exports){
/**
 * @file hmac.js
 * @author ???
 */

var CryptoJS = require(36);

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
C_algo.HMAC = Base.extend({

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
        hasher = this._hasher = new hasher.init();    // eslint-disable-line

        // Convert string to WordArray, else assume WordArray already
        if (typeof key === 'string') {
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

},{"36":36}],39:[function(require,module,exports){
/**
 * @file sha256.js
 * @author ???
 */
var CryptoJS = require(36);

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
        this._hash = new WordArray.init(H.slice(0));    // eslint-disable-line
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
            }
            else {
                var gamma0x = W[i - 15];
                var gamma0 = ((gamma0x << 25)
                    | (gamma0x >>> 7)) ^ ((gamma0x << 14)
                    | (gamma0x >>> 18)) ^ (gamma0x >>> 3);

                var gamma1x = W[i - 2];
                var gamma1 = ((gamma1x << 15)
                    | (gamma1x >>> 17)) ^ ((gamma1x << 13)
                    | (gamma1x >>> 19)) ^ (gamma1x >>> 10);

                W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
            }

            var ch = (e & f) ^ (~e & g);
            var maj = (a & b) ^ (a & c) ^ (b & c);

            var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
            var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25));

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

module.exports = CryptoJS.SHA256;

},{"36":36}],40:[function(require,module,exports){
/**
 * @file vendor/crypto.js
 * @author leeight
 */

var HmacSHA256 = require(37);
var Hex = require(36).enc.Hex;

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










},{"36":36,"37":37}],41:[function(require,module,exports){
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


},{}],42:[function(require,module,exports){
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
var Promise = require(34);

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











},{"34":34}],45:[function(require,module,exports){
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

var stringTag = '[object String]';
var objectProto = Object.prototype;
var objectToString = objectProto.toString;

function isString(value) {
    return typeof value === 'string' || objectToString.call(value) === stringTag;
}

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
            if (object.hasOwnProperty(key)) {
                result[key] = object[key];
            }
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














},{"10":10,"13":13,"14":14,"5":5}],47:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy5tYXBsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmRvcGFyYWxsZWxsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmVhY2hvZmxpbWl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwuaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmlzYXJyYXlsaWtlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwua2V5aXRlcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwubWFwYXN5bmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5ub29wL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwub25jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLm9ubHlvbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc251bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCJzcmMvYmNlLXNkay1qcy9hdXRoLmpzIiwic3JjL2JjZS1zZGstanMvYmNlX2Jhc2VfY2xpZW50LmpzIiwic3JjL2JjZS1zZGstanMvYm9zX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL2NvbmZpZy5qcyIsInNyYy9iY2Utc2RrLWpzL2hlYWRlcnMuanMiLCJzcmMvYmNlLXNkay1qcy9odHRwX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL21pbWUudHlwZXMuanMiLCJzcmMvYmNlLXNkay1qcy9zdHJpbmdzLmpzIiwic3JjL2NvbmZpZy5qcyIsInNyYy9ldmVudHMuanMiLCJzcmMvbXVsdGlwYXJ0X3Rhc2suanMiLCJzcmMvbmV0d29ya19pbmZvLmpzIiwic3JjL3B1dF9vYmplY3RfdGFzay5qcyIsInNyYy9xdWV1ZS5qcyIsInNyYy9zdHNfdG9rZW5fbWFuYWdlci5qcyIsInNyYy90YXNrLmpzIiwic3JjL3VwbG9hZGVyLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlbmRvci9CdWZmZXIuanMiLCJzcmMvdmVuZG9yL1Byb21pc2UuanMiLCJzcmMvdmVuZG9yL2FzeW5jLmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvY29yZS5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL2htYWMtc2hhMjU2LmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvaG1hYy5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL3NoYTI1Ni5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLmpzIiwic3JjL3ZlbmRvci9ldmVudHMuanMiLCJzcmMvdmVuZG9yL2hlbHBlci5qcyIsInNyYy92ZW5kb3IvcGF0aC5qcyIsInNyYy92ZW5kb3IvcS5qcyIsInNyYy92ZW5kb3IvcXVlcnlzdHJpbmcuanMiLCJzcmMvdmVuZG9yL3VuZGVyc2NvcmUuanMiLCJzcmMvdmVuZG9yL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgYmNlLWJvcy11cGxvYWRlci9pbmRleC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciBCb3NDbGllbnQgPSByZXF1aXJlKDE3KTtcbnZhciBBdXRoID0gcmVxdWlyZSgxNSk7XG5cbnZhciBVcGxvYWRlciA9IHJlcXVpcmUoMzEpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGJvczoge1xuICAgICAgICBVcGxvYWRlcjogVXBsb2FkZXJcbiAgICB9LFxuICAgIHV0aWxzOiB1dGlscyxcbiAgICBzZGs6IHtcbiAgICAgICAgUTogUSxcbiAgICAgICAgQm9zQ2xpZW50OiBCb3NDbGllbnQsXG4gICAgICAgIEF1dGg6IEF1dGhcbiAgICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIG1hcEFzeW5jID0gcmVxdWlyZSg5KTtcbnZhciBkb1BhcmFsbGVsTGltaXQgPSByZXF1aXJlKDMpO1xubW9kdWxlLmV4cG9ydHMgPSBkb1BhcmFsbGVsTGltaXQobWFwQXN5bmMpO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVhY2hPZkxpbWl0ID0gcmVxdWlyZSg0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkb1BhcmFsbGVsTGltaXQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBsaW1pdCwgaXRlcmF0b3IsIGNiKSB7XG4gICAgICAgIHJldHVybiBmbihlYWNoT2ZMaW1pdChsaW1pdCksIG9iaiwgaXRlcmF0b3IsIGNiKTtcbiAgICB9O1xufTtcbiIsInZhciBvbmNlID0gcmVxdWlyZSgxMSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoMTApO1xudmFyIG9ubHlPbmNlID0gcmVxdWlyZSgxMik7XG52YXIga2V5SXRlcmF0b3IgPSByZXF1aXJlKDcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVhY2hPZkxpbWl0KGxpbWl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNiKSB7XG4gICAgICAgIGNiID0gb25jZShjYiB8fCBub29wKTtcbiAgICAgICAgb2JqID0gb2JqIHx8IFtdO1xuICAgICAgICB2YXIgbmV4dEtleSA9IGtleUl0ZXJhdG9yKG9iaik7XG4gICAgICAgIGlmIChsaW1pdCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIHJ1bm5pbmcgPSAwO1xuICAgICAgICB2YXIgZXJyb3JlZCA9IGZhbHNlO1xuXG4gICAgICAgIChmdW5jdGlvbiByZXBsZW5pc2goKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSAmJiBydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChydW5uaW5nIDwgbGltaXQgJiYgIWVycm9yZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gbmV4dEtleSgpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcnVubmluZyArPSAxO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yKG9ialtrZXldLCBrZXksIG9ubHlPbmNlKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxlbmlzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoNSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcnJheUxpa2UoYXJyKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkoYXJyKSB8fCAoXG4gICAgICAgIC8vIGhhcyBhIHBvc2l0aXZlIGludGVnZXIgbGVuZ3RoIHByb3BlcnR5XG4gICAgICAgIHR5cGVvZiBhcnIubGVuZ3RoID09PSAnbnVtYmVyJyAmJlxuICAgICAgICBhcnIubGVuZ3RoID49IDAgJiZcbiAgICAgICAgYXJyLmxlbmd0aCAlIDEgPT09IDBcbiAgICApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9rZXlzID0gcmVxdWlyZSg4KTtcbnZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoNik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5SXRlcmF0b3IoY29sbCkge1xuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGxlbjtcbiAgICB2YXIga2V5cztcbiAgICBpZiAoaXNBcnJheUxpa2UoY29sbCkpIHtcbiAgICAgICAgbGVuID0gY29sbC5sZW5ndGg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBpIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXlzID0gX2tleXMoY29sbCk7XG4gICAgICAgIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIHJldHVybiBpIDwgbGVuID8ga2V5c1tpXSA6IG51bGw7XG4gICAgICAgIH07XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIHZhciBfa2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIF9rZXlzLnB1c2goayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9rZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9uY2UgPSByZXF1aXJlKDExKTtcbnZhciBub29wID0gcmVxdWlyZSgxMCk7XG52YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKDYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcEFzeW5jKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2IpIHtcbiAgICBjYiA9IG9uY2UoY2IgfHwgbm9vcCk7XG4gICAgYXJyID0gYXJyIHx8IFtdO1xuICAgIHZhciByZXN1bHRzID0gaXNBcnJheUxpa2UoYXJyKSA/IFtdIDoge307XG4gICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgY2IpIHtcbiAgICAgICAgaXRlcmF0b3IodmFsdWUsIGZ1bmN0aW9uIChlcnIsIHYpIHtcbiAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdjtcbiAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2IoZXJyLCByZXN1bHRzKTtcbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9vcCAoKSB7fTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZm4gPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9ubHlfb25jZShmbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZuID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxiYWNrIHdhcyBhbHJlYWR5IGNhbGxlZC4nKTtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgIH07XG59O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTYgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE51bWJlcmAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVG8gZXhjbHVkZSBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYW5kIGBOYU5gLCB3aGljaCBhcmUgY2xhc3NpZmllZFxuICogYXMgbnVtYmVycywgdXNlIHRoZSBgXy5pc0Zpbml0ZWAgbWV0aG9kLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTnVtYmVyKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcignMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IG51bWJlclRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOdW1iZXI7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYXV0aC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG4vKiBlc2xpbnQgbWF4LXBhcmFtczpbMCwxMF0gKi9cblxudmFyIGhlbHBlciA9IHJlcXVpcmUoNDIpO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgSCA9IHJlcXVpcmUoMTkpO1xudmFyIHN0cmluZ3MgPSByZXF1aXJlKDIyKTtcblxuLyoqXG4gKiBBdXRoXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge3N0cmluZ30gYWsgVGhlIGFjY2VzcyBrZXkuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2sgVGhlIHNlY3VyaXR5IGtleS5cbiAqL1xuZnVuY3Rpb24gQXV0aChhaywgc2spIHtcbiAgICB0aGlzLmFrID0gYWs7XG4gICAgdGhpcy5zayA9IHNrO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBzaWduYXR1cmUgYmFzZWQgb24gaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQXV0aGVudGljYXRpb25NZWNoYW5pc21cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIFRoZSBodHRwIHJlcXVlc3QgbWV0aG9kLCBzdWNoIGFzIEdFVCwgUE9TVCwgREVMRVRFLCBQVVQsIC4uLlxuICogQHBhcmFtIHtzdHJpbmd9IHJlc291cmNlIFRoZSByZXF1ZXN0IHBhdGguXG4gKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyBUaGUgcXVlcnkgc3RyaW5ncy5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBUaGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKiBAcGFyYW0ge251bWJlcj19IHRpbWVzdGFtcCBTZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wLlxuICogQHBhcmFtIHtudW1iZXI9fSBleHBpcmF0aW9uSW5TZWNvbmRzIFRoZSBzaWduYXR1cmUgdmFsaWRhdGlvbiB0aW1lLlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGhlYWRlcnNUb1NpZ24gVGhlIHJlcXVlc3QgaGVhZGVycyBsaXN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBjYWxjdWFsYXRlIHRoZSBzaWduYXR1cmUuXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgc2lnbmF0dXJlLlxuICovXG5BdXRoLnByb3RvdHlwZS5nZW5lcmF0ZUF1dGhvcml6YXRpb24gPSBmdW5jdGlvbiAobWV0aG9kLCByZXNvdXJjZSwgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnMsIHRpbWVzdGFtcCwgZXhwaXJhdGlvbkluU2Vjb25kcywgaGVhZGVyc1RvU2lnbikge1xuXG4gICAgdmFyIG5vdyA9IHRpbWVzdGFtcCA/IG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApIDogbmV3IERhdGUoKTtcbiAgICB2YXIgcmF3U2Vzc2lvbktleSA9IHV0aWwuZm9ybWF0KCdiY2UtYXV0aC12MS8lcy8lcy8lZCcsXG4gICAgICAgIHRoaXMuYWssIGhlbHBlci50b1VUQ1N0cmluZyhub3cpLCBleHBpcmF0aW9uSW5TZWNvbmRzIHx8IDE4MDApO1xuICAgIHZhciBzZXNzaW9uS2V5ID0gdGhpcy5oYXNoKHJhd1Nlc3Npb25LZXksIHRoaXMuc2spO1xuXG4gICAgdmFyIGNhbm9uaWNhbFVyaSA9IHRoaXMudXJpQ2Fub25pY2FsaXphdGlvbihyZXNvdXJjZSk7XG4gICAgdmFyIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gdGhpcy5xdWVyeVN0cmluZ0Nhbm9uaWNhbGl6YXRpb24ocGFyYW1zIHx8IHt9KTtcblxuICAgIHZhciBydiA9IHRoaXMuaGVhZGVyc0Nhbm9uaWNhbGl6YXRpb24oaGVhZGVycyB8fCB7fSwgaGVhZGVyc1RvU2lnbik7XG4gICAgdmFyIGNhbm9uaWNhbEhlYWRlcnMgPSBydlswXTtcbiAgICB2YXIgc2lnbmVkSGVhZGVycyA9IHJ2WzFdO1xuXG4gICAgdmFyIHJhd1NpZ25hdHVyZSA9IHV0aWwuZm9ybWF0KCclc1xcbiVzXFxuJXNcXG4lcycsXG4gICAgICAgIG1ldGhvZCwgY2Fub25pY2FsVXJpLCBjYW5vbmljYWxRdWVyeVN0cmluZywgY2Fub25pY2FsSGVhZGVycyk7XG4gICAgdmFyIHNpZ25hdHVyZSA9IHRoaXMuaGFzaChyYXdTaWduYXR1cmUsIHNlc3Npb25LZXkpO1xuXG4gICAgaWYgKHNpZ25lZEhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXMvJXMvJXMnLCByYXdTZXNzaW9uS2V5LCBzaWduZWRIZWFkZXJzLmpvaW4oJzsnKSwgc2lnbmF0dXJlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzLy8lcycsIHJhd1Nlc3Npb25LZXksIHNpZ25hdHVyZSk7XG59O1xuXG5BdXRoLnByb3RvdHlwZS51cmlDYW5vbmljYWxpemF0aW9uID0gZnVuY3Rpb24gKHVyaSkge1xuICAgIHJldHVybiB1cmk7XG59O1xuXG4vKipcbiAqIENhbm9uaWNhbCB0aGUgcXVlcnkgc3RyaW5ncy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0F1dGhlbnRpY2F0aW9uTWVjaGFuaXNtI+eUn+aIkENhbm9uaWNhbFF1ZXJ5U3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFRoZSBxdWVyeSBzdHJpbmdzLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5BdXRoLnByb3RvdHlwZS5xdWVyeVN0cmluZ0Nhbm9uaWNhbGl6YXRpb24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gW107XG4gICAgdS5lYWNoKHUua2V5cyhwYXJhbXMpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkudG9Mb3dlckNhc2UoKSA9PT0gSC5BVVRIT1JJWkFUSU9OLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtc1trZXldID09IG51bGwgPyAnJyA6IHBhcmFtc1trZXldO1xuICAgICAgICBjYW5vbmljYWxRdWVyeVN0cmluZy5wdXNoKGtleSArICc9JyArIHN0cmluZ3Mubm9ybWFsaXplKHZhbHVlKSk7XG4gICAgfSk7XG5cbiAgICBjYW5vbmljYWxRdWVyeVN0cmluZy5zb3J0KCk7XG5cbiAgICByZXR1cm4gY2Fub25pY2FsUXVlcnlTdHJpbmcuam9pbignJicpO1xufTtcblxuLyoqXG4gKiBDYW5vbmljYWwgdGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICpcbiAqIEBzZWUgaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQXV0aGVudGljYXRpb25NZWNoYW5pc20j55Sf5oiQQ2Fub25pY2FsSGVhZGVyc1xuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnMgVGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGhlYWRlcnNUb1NpZ24gVGhlIHJlcXVlc3QgaGVhZGVycyBsaXN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBjYWxjdWFsYXRlIHRoZSBzaWduYXR1cmUuXG4gKiBAcmV0dXJuIHsqfSBjYW5vbmljYWxIZWFkZXJzIGFuZCBzaWduZWRIZWFkZXJzXG4gKi9cbkF1dGgucHJvdG90eXBlLmhlYWRlcnNDYW5vbmljYWxpemF0aW9uID0gZnVuY3Rpb24gKGhlYWRlcnMsIGhlYWRlcnNUb1NpZ24pIHtcbiAgICBpZiAoIWhlYWRlcnNUb1NpZ24gfHwgIWhlYWRlcnNUb1NpZ24ubGVuZ3RoKSB7XG4gICAgICAgIGhlYWRlcnNUb1NpZ24gPSBbSC5IT1NULCBILkNPTlRFTlRfTUQ1LCBILkNPTlRFTlRfTEVOR1RILCBILkNPTlRFTlRfVFlQRV07XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnNNYXAgPSB7fTtcbiAgICB1LmVhY2goaGVhZGVyc1RvU2lnbiwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaGVhZGVyc01hcFtpdGVtLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHZhciBjYW5vbmljYWxIZWFkZXJzID0gW107XG4gICAgdS5lYWNoKHUua2V5cyhoZWFkZXJzKSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBoZWFkZXJzW2tleV07XG4gICAgICAgIHZhbHVlID0gdS5pc1N0cmluZyh2YWx1ZSkgPyBzdHJpbmdzLnRyaW0odmFsdWUpIDogdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoL154XFwtYmNlXFwtLy50ZXN0KGtleSkgfHwgaGVhZGVyc01hcFtrZXldID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjYW5vbmljYWxIZWFkZXJzLnB1c2godXRpbC5mb3JtYXQoJyVzOiVzJyxcbiAgICAgICAgICAgICAgICAvLyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSwgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSkpO1xuICAgICAgICAgICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGtleSksIHN0cmluZ3Mubm9ybWFsaXplKHZhbHVlKSkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjYW5vbmljYWxIZWFkZXJzLnNvcnQoKTtcblxuICAgIHZhciBzaWduZWRIZWFkZXJzID0gW107XG4gICAgdS5lYWNoKGNhbm9uaWNhbEhlYWRlcnMsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHNpZ25lZEhlYWRlcnMucHVzaChpdGVtLnNwbGl0KCc6JylbMF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFtjYW5vbmljYWxIZWFkZXJzLmpvaW4oJ1xcbicpLCBzaWduZWRIZWFkZXJzXTtcbn07XG5cbkF1dGgucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbiAoZGF0YSwga2V5KSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoNDApO1xuICAgIHZhciBzaGEyNTZIbWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTI1NicsIGtleSk7XG4gICAgc2hhMjU2SG1hYy51cGRhdGUoZGF0YSk7XG4gICAgcmV0dXJuIHNoYTI1NkhtYWMuZGlnZXN0KCdoZXgnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aDtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYmNlX2Jhc2VfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoNDEpLkV2ZW50RW1pdHRlcjtcbnZhciB1dGlsID0gcmVxdWlyZSg0Nyk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBjb25maWcgPSByZXF1aXJlKDE4KTtcbnZhciBBdXRoID0gcmVxdWlyZSgxNSk7XG5cbi8qKlxuICogQmNlQmFzZUNsaWVudFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNsaWVudENvbmZpZyBUaGUgYmNlIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VJZCBUaGUgc2VydmljZSBpZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlZ2lvblN1cHBvcnRlZCBUaGUgc2VydmljZSBzdXBwb3J0ZWQgcmVnaW9uIG9yIG5vdC5cbiAqL1xuZnVuY3Rpb24gQmNlQmFzZUNsaWVudChjbGllbnRDb25maWcsIHNlcnZpY2VJZCwgcmVnaW9uU3VwcG9ydGVkKSB7XG4gICAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHUuZXh0ZW5kKHt9LCBjb25maWcuREVGQVVMVF9DT05GSUcsIGNsaWVudENvbmZpZyk7XG4gICAgdGhpcy5zZXJ2aWNlSWQgPSBzZXJ2aWNlSWQ7XG4gICAgdGhpcy5yZWdpb25TdXBwb3J0ZWQgPSAhIXJlZ2lvblN1cHBvcnRlZDtcblxuICAgIHRoaXMuY29uZmlnLmVuZHBvaW50ID0gdGhpcy5fY29tcHV0ZUVuZHBvaW50KCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SHR0cENsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLl9odHRwQWdlbnQgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhCY2VCYXNlQ2xpZW50LCBFdmVudEVtaXR0ZXIpO1xuXG5CY2VCYXNlQ2xpZW50LnByb3RvdHlwZS5fY29tcHV0ZUVuZHBvaW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5lbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZW5kcG9pbnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVnaW9uU3VwcG9ydGVkKSB7XG4gICAgICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXM6Ly8lcy4lcy4lcycsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm90b2NvbCxcbiAgICAgICAgICAgIHRoaXMuc2VydmljZUlkLFxuICAgICAgICAgICAgdGhpcy5jb25maWcucmVnaW9uLFxuICAgICAgICAgICAgY29uZmlnLkRFRkFVTFRfU0VSVklDRV9ET01BSU4pO1xuICAgIH1cbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzOi8vJXMuJXMnLFxuICAgICAgICB0aGlzLmNvbmZpZy5wcm90b2NvbCxcbiAgICAgICAgdGhpcy5zZXJ2aWNlSWQsXG4gICAgICAgIGNvbmZpZy5ERUZBVUxUX1NFUlZJQ0VfRE9NQUlOKTtcbn07XG5cbkJjZUJhc2VDbGllbnQucHJvdG90eXBlLmNyZWF0ZVNpZ25hdHVyZSA9IGZ1bmN0aW9uIChjcmVkZW50aWFscywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIFEuZmNhbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKGNyZWRlbnRpYWxzLmFrLCBjcmVkZW50aWFscy5zayk7XG4gICAgICAgIHJldHVybiBhdXRoLmdlbmVyYXRlQXV0aG9yaXphdGlvbihodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCY2VCYXNlQ2xpZW50O1xuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9ib3NfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cbi8qIGVzbGludCBtYXgtcGFyYW1zOlswLDEwXSAqL1xuXG52YXIgcGF0aCA9IHJlcXVpcmUoNDMpO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgzMyk7XG52YXIgSCA9IHJlcXVpcmUoMTkpO1xudmFyIHN0cmluZ3MgPSByZXF1aXJlKDIyKTtcbnZhciBIdHRwQ2xpZW50ID0gcmVxdWlyZSgyMCk7XG52YXIgQmNlQmFzZUNsaWVudCA9IHJlcXVpcmUoMTYpO1xudmFyIE1pbWVUeXBlID0gcmVxdWlyZSgyMSk7XG5cbnZhciBNQVhfUFVUX09CSkVDVF9MRU5HVEggPSA1MzY4NzA5MTIwOyAgICAgLy8gNUdcbnZhciBNQVhfVVNFUl9NRVRBREFUQV9TSVpFID0gMjA0ODsgICAgICAgICAgLy8gMiAqIDEwMjRcblxuLyoqXG4gKiBCT1Mgc2VydmljZSBhcGlcbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0JPU19BUEkjQk9TLUFQSeaWh+aho1xuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgYm9zIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICogQGV4dGVuZHMge0JjZUJhc2VDbGllbnR9XG4gKi9cbmZ1bmN0aW9uIEJvc0NsaWVudChjb25maWcpIHtcbiAgICBCY2VCYXNlQ2xpZW50LmNhbGwodGhpcywgY29uZmlnLCAnYm9zJywgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SHR0cENsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLl9odHRwQWdlbnQgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhCb3NDbGllbnQsIEJjZUJhc2VDbGllbnQpO1xuXG4vLyAtLS0gQiBFIEcgSSBOIC0tLVxuQm9zQ2xpZW50LnByb3RvdHlwZS5kZWxldGVPYmplY3QgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnREVMRVRFJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5wdXRPYmplY3QgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBkYXRhLCBvcHRpb25zKSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigna2V5IHNob3VsZCBub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQVVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUucHV0T2JqZWN0RnJvbUJsb2IgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBibG9iLCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9CbG9iL3NpemVcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gYmxvYi5zaXplO1xuICAgIC8vIOWvueS6jua1j+iniOWZqOiwg+eUqEFQSeeahOaXtuWAme+8jOm7mOiupOS4jea3u+WKoCBILkNPTlRFTlRfTUQ1IOWtl+aute+8jOWboOS4uuiuoeeul+i1t+adpeavlOi+g+aFolxuICAgIC8vIOiAjOS4lOagueaNriBBUEkg5paH5qGj77yM6L+Z5Liq5a2X5q615LiN5piv5b+F5aGr55qE44CCXG4gICAgb3B0aW9ucyA9IHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMucHV0T2JqZWN0KGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb3B0aW9ucyk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmdldE9iamVjdE1ldGFkYXRhID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0hFQUQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmluaXRpYXRlTXVsdGlwYXJ0VXBsb2FkID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9IG9wdGlvbnNbSC5DT05URU5UX1RZUEVdIHx8IE1pbWVUeXBlLmd1ZXNzKHBhdGguZXh0bmFtZShrZXkpKTtcbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUE9TVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHBhcmFtczoge3VwbG9hZHM6ICcnfSxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5hYm9ydE11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnREVMRVRFJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgcGFyYW1zOiB7dXBsb2FkSWQ6IHVwbG9hZElkfSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBwYXJ0TGlzdCwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCc7XG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyh1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUE9TVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtwYXJ0czogcGFydExpc3R9KSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IHt1cGxvYWRJZDogdXBsb2FkSWR9LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnVwbG9hZFBhcnRGcm9tQmxvYiA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBwYXJ0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydFNpemUsIGJsb2IsIG9wdGlvbnMpIHtcbiAgICBpZiAoYmxvYi5zaXplICE9PSBwYXJ0U2l6ZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHV0aWwuZm9ybWF0KCdJbnZhbGlkIHBhcnRTaXplICVkIGFuZCBkYXRhIGxlbmd0aCAlZCcsXG4gICAgICAgICAgICBwYXJ0U2l6ZSwgYmxvYi5zaXplKSk7XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gcGFydFNpemU7XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnModS5leHRlbmQoaGVhZGVycywgb3B0aW9ucykpO1xuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQVVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBibG9iLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgcGFydE51bWJlcjogcGFydE51bWJlcixcbiAgICAgICAgICAgIHVwbG9hZElkOiB1cGxvYWRJZFxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmxpc3RQYXJ0cyA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBvcHRpb25zKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSovXG4gICAgaWYgKCF1cGxvYWRJZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1cGxvYWRJZCBzaG91bGQgbm90IGVtcHR5Jyk7XG4gICAgfVxuICAgIC8qZXNsaW50LWVuYWJsZSovXG5cbiAgICB2YXIgYWxsb3dlZFBhcmFtcyA9IFsnbWF4UGFydHMnLCAncGFydE51bWJlck1hcmtlcicsICd1cGxvYWRJZCddO1xuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSwgYWxsb3dlZFBhcmFtcyk7XG4gICAgb3B0aW9ucy5wYXJhbXMudXBsb2FkSWQgPSB1cGxvYWRJZDtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdHRVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwYXJhbXM6IG9wdGlvbnMucGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmxpc3RNdWx0aXBhcnRVcGxvYWRzID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZFBhcmFtcyA9IFsnZGVsaW1pdGVyJywgJ21heFVwbG9hZHMnLCAna2V5TWFya2VyJywgJ3ByZWZpeCcsICd1cGxvYWRzJ107XG5cbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKG9wdGlvbnMgfHwge30sIGFsbG93ZWRQYXJhbXMpO1xuICAgIG9wdGlvbnMucGFyYW1zLnVwbG9hZHMgPSAnJztcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdHRVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIHBhcmFtczogb3B0aW9ucy5wYXJhbXMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuYXBwZW5kT2JqZWN0ID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgZGF0YSwgb2Zmc2V0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigna2V5IHNob3VsZCBub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9KTtcbiAgICB2YXIgcGFyYW1zID0ge2FwcGVuZDogJyd9O1xuICAgIGlmICh1LmlzTnVtYmVyKG9mZnNldCkpIHtcbiAgICAgICAgcGFyYW1zLm9mZnNldCA9IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BPU1QnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmFwcGVuZE9iamVjdEZyb21CbG9iID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb2Zmc2V0LCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9CbG9iL3NpemVcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gYmxvYi5zaXplO1xuICAgIC8vIOWvueS6jua1j+iniOWZqOiwg+eUqEFQSeeahOaXtuWAme+8jOm7mOiupOS4jea3u+WKoCBILkNPTlRFTlRfTUQ1IOWtl+aute+8jOWboOS4uuiuoeeul+i1t+adpeavlOi+g+aFolxuICAgIC8vIOiAjOS4lOagueaNriBBUEkg5paH5qGj77yM6L+Z5Liq5a2X5q615LiN5piv5b+F5aGr55qE44CCXG4gICAgb3B0aW9ucyA9IHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kT2JqZWN0KGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb2Zmc2V0LCBvcHRpb25zKTtcbn07XG5cbi8vIC0tLSBFIE4gRCAtLS1cblxuQm9zQ2xpZW50LnByb3RvdHlwZS5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCB2YXJBcmdzKSB7XG4gICAgdmFyIGRlZmF1bHRBcmdzID0ge1xuICAgICAgICBidWNrZXROYW1lOiBudWxsLFxuICAgICAgICBrZXk6IG51bGwsXG4gICAgICAgIGJvZHk6IG51bGwsXG4gICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICBwYXJhbXM6IHt9LFxuICAgICAgICBjb25maWc6IHt9LFxuICAgICAgICBvdXRwdXRTdHJlYW06IG51bGxcbiAgICB9O1xuICAgIHZhciBhcmdzID0gdS5leHRlbmQoZGVmYXVsdEFyZ3MsIHZhckFyZ3MpO1xuXG4gICAgdmFyIGNvbmZpZyA9IHUuZXh0ZW5kKHt9LCB0aGlzLmNvbmZpZywgYXJncy5jb25maWcpO1xuICAgIHZhciByZXNvdXJjZSA9IFtcbiAgICAgICAgJy92MScsXG4gICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGFyZ3MuYnVja2V0TmFtZSB8fCAnJyksXG4gICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGFyZ3Mua2V5IHx8ICcnLCBmYWxzZSlcbiAgICBdLmpvaW4oJy8nKTtcblxuICAgIGlmIChjb25maWcuc2Vzc2lvblRva2VuKSB7XG4gICAgICAgIGFyZ3MuaGVhZGVyc1tILlNFU1NJT05fVE9LRU5dID0gY29uZmlnLnNlc3Npb25Ub2tlbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kSFRUUFJlcXVlc3QoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MsIGNvbmZpZyk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnNlbmRIVFRQUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncywgY29uZmlnKSB7XG4gICAgdmFyIGNsaWVudCA9IHRoaXM7XG4gICAgdmFyIGFnZW50ID0gdGhpcy5faHR0cEFnZW50ID0gbmV3IEh0dHBDbGllbnQoY29uZmlnKTtcblxuICAgIHZhciBodHRwQ29udGV4dCA9IHtcbiAgICAgICAgaHR0cE1ldGhvZDogaHR0cE1ldGhvZCxcbiAgICAgICAgcmVzb3VyY2U6IHJlc291cmNlLFxuICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgIH07XG4gICAgdS5lYWNoKFsncHJvZ3Jlc3MnLCAnZXJyb3InLCAnYWJvcnQnXSwgZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICBhZ2VudC5vbihldmVudE5hbWUsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGNsaWVudC5lbWl0KGV2ZW50TmFtZSwgZXZ0LCBodHRwQ29udGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIHByb21pc2UgPSB0aGlzLl9odHRwQWdlbnQuc2VuZFJlcXVlc3QoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MuYm9keSxcbiAgICAgICAgYXJncy5oZWFkZXJzLCBhcmdzLnBhcmFtcywgdS5iaW5kKHRoaXMuY3JlYXRlU2lnbmF0dXJlLCB0aGlzKSxcbiAgICAgICAgYXJncy5vdXRwdXRTdHJlYW1cbiAgICApO1xuXG4gICAgcHJvbWlzZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGFnZW50Ll9yZXEgJiYgYWdlbnQuX3JlcS54aHIpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBhZ2VudC5fcmVxLnhocjtcbiAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBwcm9taXNlO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5fY2hlY2tPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMsIGFsbG93ZWRQYXJhbXMpIHtcbiAgICB2YXIgcnYgPSB7fTtcblxuICAgIHJ2LmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnIHx8IHt9O1xuICAgIHJ2LmhlYWRlcnMgPSB0aGlzLl9wcmVwYXJlT2JqZWN0SGVhZGVycyhvcHRpb25zKTtcbiAgICBydi5wYXJhbXMgPSB1LnBpY2sob3B0aW9ucywgYWxsb3dlZFBhcmFtcyB8fCBbXSk7XG5cbiAgICByZXR1cm4gcnY7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLl9wcmVwYXJlT2JqZWN0SGVhZGVycyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGFsbG93ZWRIZWFkZXJzID0ge307XG4gICAgdS5lYWNoKFtcbiAgICAgICAgSC5DT05URU5UX0xFTkdUSCxcbiAgICAgICAgSC5DT05URU5UX0VOQ09ESU5HLFxuICAgICAgICBILkNPTlRFTlRfTUQ1LFxuICAgICAgICBILlhfQkNFX0NPTlRFTlRfU0hBMjU2LFxuICAgICAgICBILkNPTlRFTlRfVFlQRSxcbiAgICAgICAgSC5DT05URU5UX0RJU1BPU0lUSU9OLFxuICAgICAgICBILkVUQUcsXG4gICAgICAgIEguU0VTU0lPTl9UT0tFTixcbiAgICAgICAgSC5DQUNIRV9DT05UUk9MLFxuICAgICAgICBILkVYUElSRVMsXG4gICAgICAgIEguWF9CQ0VfT0JKRUNUX0FDTCxcbiAgICAgICAgSC5YX0JDRV9PQkpFQ1RfR1JBTlRfUkVBRFxuICAgIF0sIGZ1bmN0aW9uIChoZWFkZXIpIHtcbiAgICAgICAgYWxsb3dlZEhlYWRlcnNbaGVhZGVyXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB2YXIgbWV0YVNpemUgPSAwO1xuICAgIHZhciBoZWFkZXJzID0gdS5waWNrKG9wdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChhbGxvd2VkSGVhZGVyc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvXnhcXC1iY2VcXC1tZXRhXFwtLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgIG1ldGFTaXplICs9IEJ1ZmZlci5ieXRlTGVuZ3RoKGtleSkgKyBCdWZmZXIuYnl0ZUxlbmd0aCgnJyArIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobWV0YVNpemUgPiBNQVhfVVNFUl9NRVRBREFUQV9TSVpFKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01ldGFkYXRhIHNpemUgc2hvdWxkIG5vdCBiZSBncmVhdGVyIHRoYW4gJyArIE1BWF9VU0VSX01FVEFEQVRBX1NJWkUgKyAnLicpO1xuICAgIH1cblxuICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KEguQ09OVEVOVF9MRU5HVEgpKSB7XG4gICAgICAgIHZhciBjb250ZW50TGVuZ3RoID0gaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXTtcbiAgICAgICAgaWYgKGNvbnRlbnRMZW5ndGggPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZW50X2xlbmd0aCBzaG91bGQgbm90IGJlIG5lZ2F0aXZlLicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbnRlbnRMZW5ndGggPiBNQVhfUFVUX09CSkVDVF9MRU5HVEgpIHsgLy8gNUdcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBsZW5ndGggc2hvdWxkIGJlIGxlc3MgdGhhbiAnICsgTUFYX1BVVF9PQkpFQ1RfTEVOR1RIXG4gICAgICAgICAgICAgICAgKyAnLiBVc2UgbXVsdGktcGFydCB1cGxvYWQgaW5zdGVhZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KCdFVGFnJykpIHtcbiAgICAgICAgdmFyIGV0YWcgPSBoZWFkZXJzLkVUYWc7XG4gICAgICAgIGlmICghL15cIi8udGVzdChldGFnKSkge1xuICAgICAgICAgICAgaGVhZGVycy5FVGFnID0gdXRpbC5mb3JtYXQoJ1wiJXNcIicsIGV0YWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFoZWFkZXJzLmhhc093blByb3BlcnR5KEguQ09OVEVOVF9UWVBFKSkge1xuICAgICAgICBoZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb3NDbGllbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9jb25maWcuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG5leHBvcnRzLkRFRkFVTFRfU0VSVklDRV9ET01BSU4gPSAnYmFpZHViY2UuY29tJztcblxuZXhwb3J0cy5ERUZBVUxUX0NPTkZJRyA9IHtcbiAgICBwcm90b2NvbDogJ2h0dHAnLFxuICAgIHJlZ2lvbjogJ2JqJ1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvaGVhZGVycy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbmV4cG9ydHMuQ09OVEVOVF9UWVBFID0gJ0NvbnRlbnQtVHlwZSc7XG5leHBvcnRzLkNPTlRFTlRfTEVOR1RIID0gJ0NvbnRlbnQtTGVuZ3RoJztcbmV4cG9ydHMuQ09OVEVOVF9NRDUgPSAnQ29udGVudC1NRDUnO1xuZXhwb3J0cy5DT05URU5UX0VOQ09ESU5HID0gJ0NvbnRlbnQtRW5jb2RpbmcnO1xuZXhwb3J0cy5DT05URU5UX0RJU1BPU0lUSU9OID0gJ0NvbnRlbnQtRGlzcG9zaXRpb24nO1xuZXhwb3J0cy5FVEFHID0gJ0VUYWcnO1xuZXhwb3J0cy5DT05ORUNUSU9OID0gJ0Nvbm5lY3Rpb24nO1xuZXhwb3J0cy5IT1NUID0gJ0hvc3QnO1xuZXhwb3J0cy5VU0VSX0FHRU5UID0gJ1VzZXItQWdlbnQnO1xuZXhwb3J0cy5DQUNIRV9DT05UUk9MID0gJ0NhY2hlLUNvbnRyb2wnO1xuZXhwb3J0cy5FWFBJUkVTID0gJ0V4cGlyZXMnO1xuXG5leHBvcnRzLkFVVEhPUklaQVRJT04gPSAnQXV0aG9yaXphdGlvbic7XG5leHBvcnRzLlhfQkNFX0RBVEUgPSAneC1iY2UtZGF0ZSc7XG5leHBvcnRzLlhfQkNFX0FDTCA9ICd4LWJjZS1hY2wnO1xuZXhwb3J0cy5YX0JDRV9SRVFVRVNUX0lEID0gJ3gtYmNlLXJlcXVlc3QtaWQnO1xuZXhwb3J0cy5YX0JDRV9DT05URU5UX1NIQTI1NiA9ICd4LWJjZS1jb250ZW50LXNoYTI1Nic7XG5leHBvcnRzLlhfQkNFX09CSkVDVF9BQ0wgPSAneC1iY2Utb2JqZWN0LWFjbCc7XG5leHBvcnRzLlhfQkNFX09CSkVDVF9HUkFOVF9SRUFEID0gJ3gtYmNlLW9iamVjdC1ncmFudC1yZWFkJztcblxuZXhwb3J0cy5YX0hUVFBfSEVBREVSUyA9ICdodHRwX2hlYWRlcnMnO1xuZXhwb3J0cy5YX0JPRFkgPSAnYm9keSc7XG5leHBvcnRzLlhfU1RBVFVTX0NPREUgPSAnc3RhdHVzX2NvZGUnO1xuZXhwb3J0cy5YX01FU1NBR0UgPSAnbWVzc2FnZSc7XG5leHBvcnRzLlhfQ09ERSA9ICdjb2RlJztcbmV4cG9ydHMuWF9SRVFVRVNUX0lEID0gJ3JlcXVlc3RfaWQnO1xuXG5leHBvcnRzLlNFU1NJT05fVE9LRU4gPSAneC1iY2Utc2VjdXJpdHktdG9rZW4nO1xuXG5leHBvcnRzLlhfVk9EX01FRElBX1RJVExFID0gJ3gtdm9kLW1lZGlhLXRpdGxlJztcbmV4cG9ydHMuWF9WT0RfTUVESUFfREVTQ1JJUFRJT04gPSAneC12b2QtbWVkaWEtZGVzY3JpcHRpb24nO1xuZXhwb3J0cy5BQ0NFUFRfRU5DT0RJTkcgPSAnYWNjZXB0LWVuY29kaW5nJztcbmV4cG9ydHMuQUNDRVBUID0gJ2FjY2VwdCc7XG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvaHR0cF9jbGllbnQuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuLyogZXNsaW50IG1heC1wYXJhbXM6WzAsMTBdICovXG4vKiBnbG9iYWxzIEFycmF5QnVmZmVyICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKDQxKS5FdmVudEVtaXR0ZXI7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgzMyk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIGhlbHBlciA9IHJlcXVpcmUoNDIpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciB1dGlsID0gcmVxdWlyZSg0Nyk7XG52YXIgSCA9IHJlcXVpcmUoMTkpO1xuXG4vKipcbiAqIFRoZSBIdHRwQ2xpZW50XG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBodHRwIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICovXG5mdW5jdGlvbiBIdHRwQ2xpZW50KGNvbmZpZykge1xuICAgIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAvKipcbiAgICAgKiBodHRwKHMpIHJlcXVlc3Qgb2JqZWN0XG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZXEgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhIdHRwQ2xpZW50LCBFdmVudEVtaXR0ZXIpO1xuXG4vKipcbiAqIFNlbmQgSHR0cCBSZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGh0dHBNZXRob2QgR0VULFBPU1QsUFVULERFTEVURSxIRUFEXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgaHR0cCByZXF1ZXN0IHBhdGguXG4gKiBAcGFyYW0geyhzdHJpbmd8QnVmZmVyfHN0cmVhbS5SZWFkYWJsZSk9fSBib2R5IFRoZSByZXF1ZXN0IGJvZHkuIElmIGBib2R5YCBpcyBhXG4gKiBzdHJlYW0sIGBDb250ZW50LUxlbmd0aGAgbXVzdCBiZSBzZXQgZXhwbGljaXRseS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBUaGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyBUaGUgcXVlcnlzdHJpbmdzIGluIHVybC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTpzdHJpbmc9fSBzaWduRnVuY3Rpb24gVGhlIGBBdXRob3JpemF0aW9uYCBzaWduYXR1cmUgZnVuY3Rpb25cbiAqIEBwYXJhbSB7c3RyZWFtLldyaXRhYmxlPX0gb3V0cHV0U3RyZWFtIFRoZSBodHRwIHJlc3BvbnNlIGJvZHkuXG4gKiBAcGFyYW0ge251bWJlcj19IHJldHJ5IFRoZSBtYXhpbXVtIG51bWJlciBvZiBuZXR3b3JrIGNvbm5lY3Rpb24gYXR0ZW1wdHMuXG4gKlxuICogQHJlc29sdmUge3todHRwX2hlYWRlcnM6T2JqZWN0LGJvZHk6T2JqZWN0fX1cbiAqIEByZWplY3Qge09iamVjdH1cbiAqXG4gKiBAcmV0dXJuIHtRLmRlZmVyfVxuICovXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCBwYXRoLCBib2R5LCBoZWFkZXJzLCBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWduRnVuY3Rpb24sIG91dHB1dFN0cmVhbSkge1xuXG4gICAgdmFyIHJlcXVlc3RVcmwgPSB0aGlzLl9nZXRSZXF1ZXN0VXJsKHBhdGgsIHBhcmFtcyk7XG5cbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMgPSB7fTtcbiAgICBkZWZhdWx0SGVhZGVyc1tILlhfQkNFX0RBVEVdID0gaGVscGVyLnRvVVRDU3RyaW5nKG5ldyBEYXRlKCkpO1xuICAgIGRlZmF1bHRIZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04JztcbiAgICBkZWZhdWx0SGVhZGVyc1tILkhPU1RdID0gL15cXHcrOlxcL1xcLyhbXlxcL10rKS8uZXhlYyh0aGlzLmNvbmZpZy5lbmRwb2ludClbMV07XG5cbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSB1LmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG5cbiAgICAvLyBDaGVjayB0aGUgY29udGVudC1sZW5ndGhcbiAgICBpZiAoIXJlcXVlc3RIZWFkZXJzLmhhc093blByb3BlcnR5KEguQ09OVEVOVF9MRU5HVEgpKSB7XG4gICAgICAgIHZhciBjb250ZW50TGVuZ3RoID0gdGhpcy5fZ3Vlc3NDb250ZW50TGVuZ3RoKGJvZHkpO1xuICAgICAgICBpZiAoIShjb250ZW50TGVuZ3RoID09PSAwICYmIC9HRVR8SEVBRC9pLnRlc3QoaHR0cE1ldGhvZCkpKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzmmK8gR0VUIOaIliBIRUFEIOivt+axgu+8jOW5tuS4lCBDb250ZW50LUxlbmd0aCDmmK8gMO+8jOmCo+S5iCBSZXF1ZXN0IEhlYWRlciDph4zpnaLlsLHkuI3opoHlh7rnjrAgQ29udGVudC1MZW5ndGhcbiAgICAgICAgICAgIC8vIOWQpuWImeacrOWcsOiuoeeul+etvuWQjeeahOaXtuWAmeS8muiuoeeul+i/m+WOu++8jOS9huaYr+a1j+iniOWZqOWPkeivt+axgueahOaXtuWAmeS4jeS4gOWumuS8muacie+8jOatpOaXtuWvvOiHtCBTaWduYXR1cmUgTWlzbWF0Y2gg55qE5oOF5Ya1XG4gICAgICAgICAgICByZXF1ZXN0SGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IGNvbnRlbnRMZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNyZWF0ZVNpZ25hdHVyZSA9IHNpZ25GdW5jdGlvbiB8fCB1Lm5vb3A7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZShjcmVhdGVTaWduYXR1cmUodGhpcy5jb25maWcuY3JlZGVudGlhbHMsIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgcmVxdWVzdEhlYWRlcnMpKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF1dGhvcml6YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEhlYWRlcnNbSC5BVVRIT1JJWkFUSU9OXSA9IGF1dGhvcml6YXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RIZWFkZXJzW0guWF9CQ0VfREFURV0gPSB4YmNlRGF0ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZG9SZXF1ZXN0KGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsXG4gICAgICAgICAgICAgICAgICAgIHUub21pdChyZXF1ZXN0SGVhZGVycywgSC5DT05URU5UX0xFTkdUSCwgSC5IT1NUKSxcbiAgICAgICAgICAgICAgICAgICAgYm9keSwgb3V0cHV0U3RyZWFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmV0dXJuIFEucmVqZWN0KGV4KTtcbiAgICB9XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsIHJlcXVlc3RIZWFkZXJzLCBib2R5LCBvdXRwdXRTdHJlYW0pIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsIHRydWUpO1xuICAgIGZvciAodmFyIGhlYWRlciBpbiByZXF1ZXN0SGVhZGVycykge1xuICAgICAgICBpZiAocmVxdWVzdEhlYWRlcnMuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcmVxdWVzdEhlYWRlcnNbaGVhZGVyXTtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgfTtcbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcigneGhyIGFib3J0ZWQnKSk7XG4gICAgfTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgICAgICAgICAgICAgIC8vIElFIC0gIzE0NTA6IHNvbWV0aW1lcyByZXR1cm5zIDEyMjMgd2hlbiBpdCBzaG91bGQgYmUgMjA0XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gMjA0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICAgICAgdmFyIGlzSlNPTiA9IC9hcHBsaWNhdGlvblxcL2pzb24vLnRlc3QoY29udGVudFR5cGUpO1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlQm9keSA9IGlzSlNPTiA/IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgOiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZUJvZHkpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUJvZHkgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlzU3VjY2VzcyA9IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgICAgICAgICAgaWYgKGlzU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0gc2VsZi5fZml4SGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHJlc3BvbnNlQm9keVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzX2NvZGU6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzcG9uc2VCb2R5Lm1lc3NhZ2UgfHwgJzxtZXNzYWdlPicsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IHJlc3BvbnNlQm9keS5jb2RlIHx8ICc8Y29kZT4nLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X2lkOiByZXNwb25zZUJvZHkucmVxdWVzdElkIHx8ICc8cmVxdWVzdF9pZD4nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGlmICh4aHIudXBsb2FkKSB7XG4gICAgICAgIHUuZWFjaChbJ3Byb2dyZXNzJywgJ2Vycm9yJywgJ2Fib3J0J10sIGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYuZW1pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVtaXQoZXZlbnROYW1lLCBldnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHhoci5zZW5kKGJvZHkpO1xuXG4gICAgc2VsZi5fcmVxID0ge3hocjogeGhyfTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2d1ZXNzQ29udGVudExlbmd0aCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSAnJykge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAodS5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhIGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICByZXR1cm4gZGF0YS5zaXplO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gZGF0YS5ieXRlTGVuZ3RoO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignTm8gQ29udGVudC1MZW5ndGggaXMgc3BlY2lmaWVkLicpO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2ZpeEhlYWRlcnMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICAgIHZhciBmaXhlZEhlYWRlcnMgPSB7fTtcblxuICAgIGlmIChoZWFkZXJzKSB7XG4gICAgICAgIHUuZWFjaChoZWFkZXJzLnNwbGl0KC9cXHI/XFxuLyksIGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBpZHgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbGluZS5zdWJzdHJpbmcoaWR4ICsgMSkucmVwbGFjZSgvXlxccyt8XFxzKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2V0YWcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXCIvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaXhlZEhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZml4ZWRIZWFkZXJzO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuYnVpbGRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgdXJsRW5jb2RlU3RyID0gcmVxdWlyZSg0NSkuc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUGVyY2VudC1lbmNvZGluZ1xuICAgIHJldHVybiB1cmxFbmNvZGVTdHIucmVwbGFjZSgvWygpJyF+LipcXC1fXS9nLCBmdW5jdGlvbiAoY2hhcikge1xuICAgICAgICByZXR1cm4gJyUnICsgY2hhci5jaGFyQ29kZUF0KCkudG9TdHJpbmcoMTYpO1xuICAgIH0pO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2dldFJlcXVlc3RVcmwgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zKSB7XG4gICAgdmFyIHVyaSA9IHBhdGg7XG4gICAgdmFyIHFzID0gdGhpcy5idWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcyk7XG4gICAgaWYgKHFzKSB7XG4gICAgICAgIHVyaSArPSAnPycgKyBxcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZW5kcG9pbnQgKyB1cmk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0dHBDbGllbnQ7XG5cbiIsIi8qKlxuICogQGZpbGUgc3JjL21pbWUudHlwZXMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG52YXIgbWltZVR5cGVzID0ge1xufTtcblxuZXhwb3J0cy5ndWVzcyA9IGZ1bmN0aW9uIChleHQpIHtcbiAgICBpZiAoIWV4dCB8fCAhZXh0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gICAgfVxuICAgIGlmIChleHRbMF0gPT09ICcuJykge1xuICAgICAgICBleHQgPSBleHQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICByZXR1cm4gbWltZVR5cGVzW2V4dC50b0xvd2VyQ2FzZSgpXSB8fCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHN0cmluZ3MuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBrRXNjYXBlZE1hcCA9IHtcbiAgICAnISc6ICclMjEnLFxuICAgICdcXCcnOiAnJTI3JyxcbiAgICAnKCc6ICclMjgnLFxuICAgICcpJzogJyUyOScsXG4gICAgJyonOiAnJTJBJ1xufTtcblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbiAoc3RyaW5nLCBlbmNvZGluZ1NsYXNoKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmcpO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9bISdcXChcXClcXCpdL2csIGZ1bmN0aW9uICgkMSkge1xuICAgICAgICByZXR1cm4ga0VzY2FwZWRNYXBbJDFdO1xuICAgIH0pO1xuXG4gICAgaWYgKGVuY29kaW5nU2xhc2ggPT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8lMkYvZ2ksICcvJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydHMudHJpbSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gKHN0cmluZyB8fCAnJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xufTtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBjb25maWcuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cblxudmFyIGtEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBydW50aW1lczogJ2h0bWw1JyxcblxuICAgIC8vIGJvc+acjeWKoeWZqOeahOWcsOWdgO+8jOm7mOiupChodHRwOi8vYmouYmNlYm9zLmNvbSlcbiAgICBib3NfZW5kcG9pbnQ6ICdodHRwOi8vYmouYmNlYm9zLmNvbScsXG5cbiAgICAvLyDpu5jorqTnmoQgYWsg5ZKMIHNrIOmFjee9rlxuICAgIGJvc19hazogbnVsbCxcbiAgICBib3Nfc2s6IG51bGwsXG4gICAgYm9zX2NyZWRlbnRpYWxzOiBudWxsLFxuXG4gICAgLy8g5aaC5p6c5YiH5o2i5YiwIGFwcGVuZGFibGUg5qih5byP77yM5pyA5aSn5Y+q5pSv5oyBIDVHIOeahOaWh+S7tlxuICAgIC8vIOS4jeWGjeaUr+aMgSBNdWx0aXBhcnQg55qE5pa55byP5LiK5Lyg5paH5Lu2XG4gICAgYm9zX2FwcGVuZGFibGU6IGZhbHNlLFxuXG4gICAgLy8g5Li65LqG5aSE55CGIEZsYXNoIOS4jeiDveWPkemAgSBIRUFELCBERUxFVEUg5LmL57G755qE6K+35rGC77yM5Lul5Y+K5peg5rOVXG4gICAgLy8g6I635Y+WIHJlc3BvbnNlIGhlYWRlcnMg55qE6Zeu6aKY77yM6ZyA6KaB5pCe5LiA5LiqIHJlbGF5IOacjeWKoeWZqO+8jOaKiuaVsOaNrlxuICAgIC8vIOagvOW8j+i9rOWMluS4gOS4i1xuICAgIGJvc19yZWxheV9zZXJ2ZXI6ICdodHRwczovL3JlbGF5LmVmZS50ZWNoJyxcblxuICAgIC8vIOaYr+WQpuaUr+aMgeWkmumAie+8jOm7mOiupChmYWxzZSlcbiAgICBtdWx0aV9zZWxlY3Rpb246IGZhbHNlLFxuXG4gICAgLy8g5aSx6LSl5LmL5ZCO6YeN6K+V55qE5qyh5pWwKOWNleS4quaWh+S7tuaIluiAheWIhueJhynvvIzpu5jorqQoMCnvvIzkuI3ph43or5VcbiAgICBtYXhfcmV0cmllczogMCxcblxuICAgIC8vIOWksei0pemHjeivleeahOmXtOmalOaXtumXtO+8jOm7mOiupCAxMDAwbXNcbiAgICByZXRyeV9pbnRlcnZhbDogMTAwMCxcblxuICAgIC8vIOaYr+WQpuiHquWKqOS4iuS8oO+8jOm7mOiupChmYWxzZSlcbiAgICBhdXRvX3N0YXJ0OiBmYWxzZSxcblxuICAgIC8vIOacgOWkp+WPr+S7pemAieaLqeeahOaWh+S7tuWkp+Wwj++8jOm7mOiupCgxMDBNKVxuICAgIG1heF9maWxlX3NpemU6ICcxMDBtYicsXG5cbiAgICAvLyDotoXov4fov5nkuKrmlofku7blpKflsI/kuYvlkI7vvIzlvIDlp4vkvb/nlKjliIbniYfkuIrkvKDvvIzpu5jorqQoMTBNKVxuICAgIGJvc19tdWx0aXBhcnRfbWluX3NpemU6ICcxMG1iJyxcblxuICAgIC8vIOWIhueJh+S4iuS8oOeahOaXtuWAme+8jOW5tuihjOS4iuS8oOeahOS4quaVsO+8jOm7mOiupCgxKVxuICAgIGJvc19tdWx0aXBhcnRfcGFyYWxsZWw6IDEsXG5cbiAgICAvLyDpmJ/liJfkuK3nmoTmlofku7bvvIzlubbooYzkuIrkvKDnmoTkuKrmlbDvvIzpu5jorqQoMylcbiAgICBib3NfdGFza19wYXJhbGxlbDogMyxcblxuICAgIC8vIOiuoeeul+etvuWQjeeahOaXtuWAme+8jOacieS6myBoZWFkZXIg6ZyA6KaB5YmU6Zmk77yM5YeP5bCR5Lyg6L6T55qE5L2T56evXG4gICAgYXV0aF9zdHJpcHBlZF9oZWFkZXJzOiBbJ1VzZXItQWdlbnQnLCAnQ29ubmVjdGlvbiddLFxuXG4gICAgLy8g5YiG54mH5LiK5Lyg55qE5pe25YCZ77yM5q+P5Liq5YiG54mH55qE5aSn5bCP77yM6buY6K6kKDRNKVxuICAgIGNodW5rX3NpemU6ICc0bWInLFxuXG4gICAgLy8g5YiG5Z2X5LiK5Lyg5pe2LOaYr+WQpuWFgeiuuOaWreeCuee7reS8oO+8jOm7mOiupCh0cnVlKVxuICAgIGJvc19tdWx0aXBhcnRfYXV0b19jb250aW51ZTogdHJ1ZSxcblxuICAgIC8vIOWIhuW8gOS4iuS8oOeahOaXtuWAme+8jGxvY2FsU3RvcmFnZemHjOmdomtleeeahOeUn+aIkOaWueW8j++8jOm7mOiupOaYryBgZGVmYXVsdGBcbiAgICAvLyDlpoLmnpzpnIDopoHoh6rlrprkuYnvvIzlj6/ku6XpgJrov4cgWFhYXG4gICAgYm9zX211bHRpcGFydF9sb2NhbF9rZXlfZ2VuZXJhdG9yOiAnZGVmYXVsdCcsXG5cbiAgICAvLyDmmK/lkKblhYHorrjpgInmi6nnm67lvZVcbiAgICBkaXJfc2VsZWN0aW9uOiBmYWxzZSxcblxuICAgIC8vIOaYr+WQpumcgOimgeavj+asoemDveWOu+acjeWKoeWZqOiuoeeul+etvuWQjVxuICAgIGdldF9uZXdfdXB0b2tlbjogdHJ1ZSxcblxuICAgIC8vIOWboOS4uuS9v+eUqCBGb3JtIFBvc3Qg55qE5qC85byP77yM5rKh5pyJ6K6+572u6aKd5aSW55qEIEhlYWRlcu+8jOS7juiAjOWPr+S7peS/neivgVxuICAgIC8vIOS9v+eUqCBGbGFzaCDkuZ/og73kuIrkvKDlpKfmlofku7ZcbiAgICAvLyDkvY7niYjmnKzmtY/op4jlmajkuIrkvKDmlofku7bnmoTml7blgJnvvIzpnIDopoHorr7nva4gcG9saWN577yM6buY6K6k5oOF5Ya15LiLXG4gICAgLy8gcG9saWN555qE5YaF5a655Y+q6ZyA6KaB5YyF5ZCrIGV4cGlyYXRpb24g5ZKMIGNvbmRpdGlvbnMg5Y2z5Y+vXG4gICAgLy8gcG9saWN5OiB7XG4gICAgLy8gICBleHBpcmF0aW9uOiAneHgnLFxuICAgIC8vICAgY29uZGl0aW9uczogW1xuICAgIC8vICAgICB7YnVja2V0OiAndGhlLWJ1Y2tldC1uYW1lJ31cbiAgICAvLyAgIF1cbiAgICAvLyB9XG4gICAgLy8gYm9zX3BvbGljeTogbnVsbCxcblxuICAgIC8vIOS9jueJiOacrOa1j+iniOWZqOS4iuS8oOaWh+S7tueahOaXtuWAme+8jOmcgOimgeiuvue9riBwb2xpY3lfc2lnbmF0dXJlXG4gICAgLy8g5aaC5p6c5rKh5pyJ6K6+572uIGJvc19wb2xpY3lfc2lnbmF0dXJlIOeahOivne+8jOS8mumAmui/hyB1cHRva2VuX3VybCDmnaXor7fmsYJcbiAgICAvLyDpu5jorqTlj6rkvJror7fmsYLkuIDmrKHvvIzlpoLmnpzlpLHmlYjkuobvvIzpnIDopoHmiYvliqjmnaXph43nva4gcG9saWN5X3NpZ25hdHVyZVxuICAgIC8vIGJvc19wb2xpY3lfc2lnbmF0dXJlOiBudWxsLFxuXG4gICAgLy8gSlNPTlAg6buY6K6k55qE6LaF5pe25pe26Ze0KDUwMDBtcylcbiAgICB1cHRva2VuX3ZpYV9qc29ucDogdHJ1ZSxcbiAgICB1cHRva2VuX3RpbWVvdXQ6IDUwMDAsXG4gICAgdXB0b2tlbl9qc29ucF90aW1lb3V0OiA1MDAwLCAgICAvLyDkuI3mlK/mjIHkuobvvIzlkI7nu63lu7rorq7nlKggdXB0b2tlbl90aW1lb3V0XG5cbiAgICAvLyDmmK/lkKbopoHnpoHnlKjnu5/orqHvvIzpu5jorqTkuI3npoHnlKhcbiAgICAvLyDlpoLmnpzpnIDopoHnpoHnlKjvvIzmioogdHJhY2tlcl9pZCDorr7nva7miJAgbnVsbCDljbPlj69cbiAgICB0cmFja2VyX2lkOiBudWxsXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtEZWZhdWx0T3B0aW9ucztcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpLCB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBldmVudHMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGtQb3N0SW5pdDogJ1Bvc3RJbml0JyxcbiAgICBrS2V5OiAnS2V5JyxcbiAgICBrTGlzdFBhcnRzOiAnTGlzdFBhcnRzJyxcbiAgICBrT2JqZWN0TWV0YXM6ICdPYmplY3RNZXRhcycsXG4gICAgLy8ga0ZpbGVzUmVtb3ZlZCAgOiAnRmlsZXNSZW1vdmVkJyxcbiAgICBrRmlsZUZpbHRlcmVkOiAnRmlsZUZpbHRlcmVkJyxcbiAgICBrRmlsZXNBZGRlZDogJ0ZpbGVzQWRkZWQnLFxuICAgIGtGaWxlc0ZpbHRlcjogJ0ZpbGVzRmlsdGVyJyxcbiAgICBrTmV0d29ya1NwZWVkOiAnTmV0d29ya1NwZWVkJyxcbiAgICBrQmVmb3JlVXBsb2FkOiAnQmVmb3JlVXBsb2FkJyxcbiAgICAvLyBrVXBsb2FkRmlsZSAgICA6ICdVcGxvYWRGaWxlJywgICAgICAgLy8gPz9cbiAgICBrVXBsb2FkUHJvZ3Jlc3M6ICdVcGxvYWRQcm9ncmVzcycsXG4gICAga0ZpbGVVcGxvYWRlZDogJ0ZpbGVVcGxvYWRlZCcsXG4gICAga1VwbG9hZFBhcnRQcm9ncmVzczogJ1VwbG9hZFBhcnRQcm9ncmVzcycsXG4gICAga0NodW5rVXBsb2FkZWQ6ICdDaHVua1VwbG9hZGVkJyxcbiAgICBrVXBsb2FkUmVzdW1lOiAnVXBsb2FkUmVzdW1lJywgLy8g5pat54K557ut5LygXG4gICAgLy8ga1VwbG9hZFBhdXNlOiAnVXBsb2FkUGF1c2UnLCAgIC8vIOaaguWBnFxuICAgIGtVcGxvYWRSZXN1bWVFcnJvcjogJ1VwbG9hZFJlc3VtZUVycm9yJywgLy8g5bCd6K+V5pat54K557ut5Lyg5aSx6LSlXG4gICAga1VwbG9hZENvbXBsZXRlOiAnVXBsb2FkQ29tcGxldGUnLFxuICAgIGtFcnJvcjogJ0Vycm9yJyxcbiAgICBrQWJvcnRlZDogJ0Fib3J0ZWQnXG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBtdWx0aXBhcnRfdGFzay5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciBhc3luYyA9IHJlcXVpcmUoMzUpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzIpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoMjQpO1xudmFyIFRhc2sgPSByZXF1aXJlKDMwKTtcblxuLyoqXG4gKiBNdWx0aXBhcnRUYXNrXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIE11bHRpcGFydFRhc2soKSB7XG4gICAgVGFzay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLyoqXG4gICAgICog5om56YeP5LiK5Lyg55qE5pe25YCZ77yM5L+d5a2Y55qEIHhoclJlcXVlc3Rpbmcg5a+56LGhXG4gICAgICog5aaC5p6c6ZyA6KaBIGFib3J0IOeahOaXtuWAme+8jOS7jui/memHjOadpeiOt+WPllxuICAgICAqL1xuICAgIHRoaXMueGhyUG9vbHMgPSBbXTtcbn1cbnV0aWxzLmluaGVyaXRzKE11bHRpcGFydFRhc2ssIFRhc2spO1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIGZpbGUgPSB0aGlzLm9wdGlvbnMuZmlsZTtcbiAgICB2YXIgYnVja2V0ID0gdGhpcy5vcHRpb25zLmJ1Y2tldDtcbiAgICB2YXIgb2JqZWN0ID0gdGhpcy5vcHRpb25zLm9iamVjdDtcbiAgICB2YXIgbWV0YXMgPSB0aGlzLm9wdGlvbnMubWV0YXM7XG4gICAgdmFyIGNodW5rU2l6ZSA9IHRoaXMub3B0aW9ucy5jaHVua19zaXplO1xuICAgIHZhciBtdWx0aXBhcnRQYXJhbGxlbCA9IHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X3BhcmFsbGVsO1xuXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdXRpbHMuZ3Vlc3NDb250ZW50VHlwZShmaWxlKTtcbiAgICB2YXIgb3B0aW9ucyA9IHsnQ29udGVudC1UeXBlJzogY29udGVudFR5cGV9O1xuICAgIHZhciB1cGxvYWRJZCA9IG51bGw7XG5cbiAgICByZXR1cm4gdGhpcy5faW5pdGlhdGVNdWx0aXBhcnRVcGxvYWQoZmlsZSwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB1cGxvYWRJZCA9IHJlc3BvbnNlLmJvZHkudXBsb2FkSWQ7XG4gICAgICAgICAgICB2YXIgcGFydHMgPSByZXNwb25zZS5ib2R5LnBhcnRzIHx8IFtdO1xuICAgICAgICAgICAgLy8g5YeG5aSHIHVwbG9hZFBhcnRzXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgICAgICB2YXIgdGFza3MgPSB1dGlscy5nZXRUYXNrcyhmaWxlLCB1cGxvYWRJZCwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCk7XG4gICAgICAgICAgICB1dGlscy5maWx0ZXJUYXNrcyh0YXNrcywgcGFydHMpO1xuXG4gICAgICAgICAgICB2YXIgbG9hZGVkID0gcGFydHMubGVuZ3RoO1xuICAgICAgICAgICAgLy8g6L+Z5Liq55So5p2l6K6w5b2V5pW05L2TIFBhcnRzIOeahOS4iuS8oOi/m+W6pu+8jOS4jeaYr+WNleS4qiBQYXJ0IOeahOS4iuS8oOi/m+W6plxuICAgICAgICAgICAgLy8g5Y2V5LiqIFBhcnQg55qE5LiK5Lyg6L+b5bqm5Y+v5Lul55uR5ZCsIGtVcGxvYWRQYXJ0UHJvZ3Jlc3Mg5p2l5b6X5YiwXG4gICAgICAgICAgICB2YXIgc3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoQ29tcHV0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsb2FkZWQ6IGxvYWRlZCxcbiAgICAgICAgICAgICAgICB0b3RhbDogdGFza3MubGVuZ3RoXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKGxvYWRlZCkge1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbZmlsZSwgbG9hZGVkIC8gdGFza3MubGVuZ3RoLCBudWxsXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFzeW5jLm1hcExpbWl0KHRhc2tzLCBtdWx0aXBhcnRQYXJhbGxlbCwgc2VsZi5fdXBsb2FkUGFydChzdGF0ZSksXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVyciwgcmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZXMpIHtcbiAgICAgICAgICAgIHZhciBwYXJ0TGlzdCA9IFtdO1xuICAgICAgICAgICAgdS5lYWNoKHJlc3BvbnNlcywgZnVuY3Rpb24gKHJlc3BvbnNlLCBpbmRleCkge1xuICAgICAgICAgICAgICAgIHBhcnRMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBwYXJ0TnVtYmVyOiBpbmRleCArIDEsXG4gICAgICAgICAgICAgICAgICAgIGVUYWc6IHJlc3BvbnNlLmh0dHBfaGVhZGVycy5ldGFnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIOWFqOmDqOS4iuS8oOe7k+adn+WQjuWIoOmZpGxvY2FsU3RvcmFnZVxuICAgICAgICAgICAgc2VsZi5fZ2VuZXJhdGVMb2NhbEtleSh7XG4gICAgICAgICAgICAgICAgYmxvYjogZmlsZSxcbiAgICAgICAgICAgICAgICBjaHVua1NpemU6IGNodW5rU2l6ZSxcbiAgICAgICAgICAgICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgICAgICAgICBvYmplY3Q6IG9iamVjdFxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgdXRpbHMucmVtb3ZlVXBsb2FkSWQoa2V5KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCwgcGFydExpc3QsIG1ldGFzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2ZpbGUsIDFdKTtcblxuICAgICAgICAgICAgcmVzcG9uc2UuYm9keS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgICAgICByZXNwb25zZS5ib2R5Lm9iamVjdCA9IG9iamVjdDtcblxuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rRmlsZVVwbG9hZGVkLCBbZmlsZSwgcmVzcG9uc2VdKTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZXZlbnRUeXBlID0gc2VsZi5hYm9ydGVkID8gZXZlbnRzLmtBYm9ydGVkIDogZXZlbnRzLmtFcnJvcjtcbiAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudFR5cGUsIFtlcnJvciwgZmlsZV0pO1xuICAgICAgICB9KTtcbn07XG5cblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2luaXRpYXRlTXVsdGlwYXJ0VXBsb2FkID0gZnVuY3Rpb24gKGZpbGUsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciB1cGxvYWRJZDtcbiAgICB2YXIgbG9jYWxTYXZlS2V5O1xuXG4gICAgZnVuY3Rpb24gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2xpZW50LmluaXRpYXRlTXVsdGlwYXJ0VXBsb2FkKGJ1Y2tldCwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5zZXRVcGxvYWRJZChsb2NhbFNhdmVLZXksIHJlc3BvbnNlLmJvZHkudXBsb2FkSWQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkucGFydHMgPSBbXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIga2V5T3B0aW9ucyA9IHtcbiAgICAgICAgYmxvYjogZmlsZSxcbiAgICAgICAgY2h1bmtTaXplOiBjaHVua1NpemUsXG4gICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICBvYmplY3Q6IG9iamVjdFxuICAgIH07XG4gICAgdmFyIHByb21pc2UgPSB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9hdXRvX2NvbnRpbnVlXG4gICAgICAgID8gdGhpcy5fZ2VuZXJhdGVMb2NhbEtleShrZXlPcHRpb25zKVxuICAgICAgICA6IFEucmVzb2x2ZShudWxsKTtcblxuICAgIHJldHVybiBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgbG9jYWxTYXZlS2V5ID0ga2V5O1xuICAgICAgICAgICAgaWYgKCFsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB1cGxvYWRJZCA9IHV0aWxzLmdldFVwbG9hZElkKGxvY2FsU2F2ZUtleSk7XG4gICAgICAgICAgICBpZiAoIXVwbG9hZElkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2xpc3RQYXJ0cyhmaWxlLCBidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmICh1cGxvYWRJZCAmJiBsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSByZXNwb25zZS5ib2R5LnBhcnRzO1xuICAgICAgICAgICAgICAgIC8vIGxpc3RQYXJ0cyDnmoTov5Tlm57nu5PmnpxcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRSZXN1bWUsIFtmaWxlLCBwYXJ0cywgbnVsbF0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkudXBsb2FkSWQgPSB1cGxvYWRJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAodXBsb2FkSWQgJiYgbG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c6I635Y+W5bey5LiK5Lyg5YiG54mH5aSx6LSl77yM5YiZ6YeN5paw5LiK5Lyg44CCXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUmVzdW1lRXJyb3IsIFtmaWxlLCBlcnJvciwgbnVsbF0pO1xuICAgICAgICAgICAgICAgIHV0aWxzLnJlbW92ZVVwbG9hZElkKGxvY2FsU2F2ZUtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9KTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9nZW5lcmF0ZUxvY2FsS2V5ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgZ2VuZXJhdG9yID0gdGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfbG9jYWxfa2V5X2dlbmVyYXRvcjtcbiAgICByZXR1cm4gdXRpbHMuZ2VuZXJhdGVMb2NhbEtleShvcHRpb25zLCBnZW5lcmF0b3IpO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2xpc3RQYXJ0cyA9IGZ1bmN0aW9uIChmaWxlLCBidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciBsb2NhbFBhcnRzID0gZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rTGlzdFBhcnRzLCBbZmlsZSwgdXBsb2FkSWRdKTtcblxuICAgIHJldHVybiBRLnJlc29sdmUobG9jYWxQYXJ0cylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHBhcnRzKSB7XG4gICAgICAgICAgICBpZiAodS5pc0FycmF5KHBhcnRzKSAmJiBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IHt9LFxuICAgICAgICAgICAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0czogcGFydHNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOWmguaenOi/lOWbnueahOS4jeaYr+aVsOe7hO+8jOWwseiwg+eUqCBsaXN0UGFydHMg5o6l5Y+j5LuO5pyN5Yqh5Zmo6I635Y+W5pWw5o2uXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fbGlzdEFsbFBhcnRzKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCk7XG4gICAgICAgIH0pO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2xpc3RBbGxQYXJ0cyA9IGZ1bmN0aW9uIChidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpIHtcbiAgICAvLyBpc1RydW5jYXRlZCA9PT0gdHJ1ZSAvIGZhbHNlXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgIHZhciBwYXJ0cyA9IFtdO1xuICAgIHZhciBwYXlsb2FkID0gbnVsbDtcbiAgICB2YXIgbWF4UGFydHMgPSAxMDAwOyAgICAgICAgICAvLyDmr4/mrKHnmoTliIbpobVcbiAgICB2YXIgcGFydE51bWJlck1hcmtlciA9IDA7ICAgICAvLyDliIbpmpTnrKZcblxuICAgIGZ1bmN0aW9uIGxpc3RQYXJ0cygpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBtYXhQYXJ0czogbWF4UGFydHMsXG4gICAgICAgICAgICBwYXJ0TnVtYmVyTWFya2VyOiBwYXJ0TnVtYmVyTWFya2VyXG4gICAgICAgIH07XG4gICAgICAgIHNlbGYuY2xpZW50Lmxpc3RQYXJ0cyhidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoLmFwcGx5KHBhcnRzLCByZXNwb25zZS5ib2R5LnBhcnRzKTtcbiAgICAgICAgICAgICAgICBwYXJ0TnVtYmVyTWFya2VyID0gcmVzcG9uc2UuYm9keS5uZXh0UGFydE51bWJlck1hcmtlcjtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5ib2R5LmlzVHJ1bmNhdGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyDnu5PmnZ/kuoZcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZC5ib2R5LnBhcnRzID0gcGFydHM7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyDpgJLlvZLosIPnlKhcbiAgICAgICAgICAgICAgICAgICAgbGlzdFBhcnRzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlbXG4gICAgICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgbGlzdFBhcnRzKCk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl91cGxvYWRQYXJ0ID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICBmdW5jdGlvbiB1cGxvYWRQYXJ0SW5uZXIoaXRlbSwgb3B0X21heFJldHJpZXMpIHtcbiAgICAgICAgaWYgKGl0ZW0uZXRhZykge1xuICAgICAgICAgICAgc2VsZi5uZXR3b3JrSW5mby5sb2FkZWRCeXRlcyArPSBpdGVtLnBhcnRTaXplO1xuXG4gICAgICAgICAgICAvLyDot7Pov4flt7LkuIrkvKDnmoRwYXJ0XG4gICAgICAgICAgICByZXR1cm4gUS5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZXRhZzogaXRlbS5ldGFnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiB7fVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1heFJldHJpZXMgPSBvcHRfbWF4UmV0cmllcyA9PSBudWxsXG4gICAgICAgICAgICA/IHNlbGYub3B0aW9ucy5tYXhfcmV0cmllc1xuICAgICAgICAgICAgOiBvcHRfbWF4UmV0cmllcztcbiAgICAgICAgdmFyIHJldHJ5SW50ZXJ2YWwgPSBzZWxmLm9wdGlvbnMucmV0cnlfaW50ZXJ2YWw7XG5cbiAgICAgICAgdmFyIGJsb2IgPSBpdGVtLmZpbGUuc2xpY2UoaXRlbS5zdGFydCwgaXRlbS5zdG9wICsgMSk7XG4gICAgICAgIGJsb2IuX3ByZXZpb3VzTG9hZGVkID0gMDtcblxuICAgICAgICB2YXIgdXBsb2FkUGFydFhociA9IHNlbGYuY2xpZW50LnVwbG9hZFBhcnRGcm9tQmxvYihpdGVtLmJ1Y2tldCwgaXRlbS5vYmplY3QsXG4gICAgICAgICAgICBpdGVtLnVwbG9hZElkLCBpdGVtLnBhcnROdW1iZXIsIGl0ZW0ucGFydFNpemUsIGJsb2IpO1xuICAgICAgICB2YXIgeGhyUG9vbEluZGV4ID0gc2VsZi54aHJQb29scy5wdXNoKHVwbG9hZFBhcnRYaHIpO1xuXG4gICAgICAgIHJldHVybiB1cGxvYWRQYXJ0WGhyLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgKytzdGF0ZS5sb2FkZWQ7XG4gICAgICAgICAgICAgICAgdmFyIHByb2dyZXNzID0gc3RhdGUubG9hZGVkIC8gc3RhdGUudG90YWw7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtpdGVtLmZpbGUsIHByb2dyZXNzLCBudWxsXSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICAgICAgICAgICAgICB1cGxvYWRJZDogaXRlbS51cGxvYWRJZCxcbiAgICAgICAgICAgICAgICAgICAgcGFydE51bWJlcjogaXRlbS5wYXJ0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICBwYXJ0U2l6ZTogaXRlbS5wYXJ0U2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgYnVja2V0OiBpdGVtLmJ1Y2tldCxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0OiBpdGVtLm9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiBpdGVtLnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICB0b3RhbDogYmxvYi5zaXplLFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0NodW5rVXBsb2FkZWQsIFtpdGVtLmZpbGUsIHJlc3VsdF0pO1xuXG4gICAgICAgICAgICAgICAgLy8g5LiN55So5Yig6Zmk77yM6K6+572u5Li6IG51bGwg5bCx5aW95LqG77yM5Y+N5q2jIGFib3J0IOeahOaXtuWAmeS8muWIpOaWreeahFxuICAgICAgICAgICAgICAgIHNlbGYueGhyUG9vbHNbeGhyUG9vbEluZGV4IC0gMV0gPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSlbXG4gICAgICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChtYXhSZXRyaWVzID4gMCAmJiAhc2VsZi5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOi/mOaciemHjeivleeahOacuuS8mlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXRpbHMuZGVsYXkocmV0cnlJbnRlcnZhbCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXBsb2FkUGFydElubmVyKGl0ZW0sIG1heFJldHJpZXMgLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIOayoeacieacuuS8mumHjeivleS6hiA6LShcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBmaWxlOiBmaWxlLFxuICAgICAgICAvLyB1cGxvYWRJZDogdXBsb2FkSWQsXG4gICAgICAgIC8vIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAvLyBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgLy8gcGFydE51bWJlcjogcGFydE51bWJlcixcbiAgICAgICAgLy8gcGFydFNpemU6IHBhcnRTaXplLFxuICAgICAgICAvLyBzdGFydDogb2Zmc2V0LFxuICAgICAgICAvLyBzdG9wOiBvZmZzZXQgKyBwYXJ0U2l6ZSAtIDFcblxuICAgICAgICB2YXIgcmVzb2x2ZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVqZWN0ID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgdXBsb2FkUGFydElubmVyKGl0ZW0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiDnu4jmraLkuIrkvKDku7vliqFcbiAqL1xuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSBudWxsO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy54aHJQb29scy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgeGhyID0gdGhpcy54aHJQb29sc1tpXTtcbiAgICAgICAgaWYgKHhociAmJiB0eXBlb2YgeGhyLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aXBhcnRUYXNrO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvbmV0d29ya19pbmZvLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcblxuLyoqXG4gKiBOZXR3b3JrSW5mb1xuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBOZXR3b3JrSW5mbygpIHtcbiAgICAvKipcbiAgICAgKiDorrDlvZXku44gc3RhcnQg5byA5aeL5bey57uP5LiK5Lyg55qE5a2X6IqC5pWwLlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sb2FkZWRCeXRlcyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiDorrDlvZXpmJ/liJfkuK3mgLvmlofku7bnmoTlpKflsI8sIFVwbG9hZENvbXBsZXRlIOS5i+WQjuS8muiiq+a4hembtlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy50b3RhbEJ5dGVzID0gMDtcblxuICAgIC8qKlxuICAgICAqIOiusOW9leW8gOWni+S4iuS8oOeahOaXtumXtC5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHV0aWxzLm5vdygpO1xuXG4gICAgdGhpcy5yZXNldCgpO1xufVxuXG5OZXR3b3JrSW5mby5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICB0aGlzLmxvYWRlZEJ5dGVzLCAgICAgICAgICAgICAgICAgICAgIC8vIOW3sue7j+S4iuS8oOeahFxuICAgICAgICB1dGlscy5ub3coKSAtIHRoaXMuX3N0YXJ0VGltZSwgICAgICAgIC8vIOiKsei0ueeahOaXtumXtFxuICAgICAgICB0aGlzLnRvdGFsQnl0ZXMgLSB0aGlzLmxvYWRlZEJ5dGVzICAgIC8vIOWJqeS9meacquS4iuS8oOeahFxuICAgIF07XG59O1xuXG5OZXR3b3JrSW5mby5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5sb2FkZWRCeXRlcyA9IDA7XG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdXRpbHMubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5ldHdvcmtJbmZvO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBwdXRfb2JqZWN0X3Rhc2suanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgyNCk7XG52YXIgVGFzayA9IHJlcXVpcmUoMzApO1xuXG4vKipcbiAqIFB1dE9iamVjdFRhc2tcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gUHV0T2JqZWN0VGFzaygpIHtcbiAgICBUYXNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG51dGlscy5pbmhlcml0cyhQdXRPYmplY3RUYXNrLCBUYXNrKTtcblxuUHV0T2JqZWN0VGFzay5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAob3B0X21heFJldHJpZXMpIHtcbiAgICBpZiAodGhpcy5hYm9ydGVkKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIGZpbGUgPSB0aGlzLm9wdGlvbnMuZmlsZTtcbiAgICB2YXIgYnVja2V0ID0gdGhpcy5vcHRpb25zLmJ1Y2tldDtcbiAgICB2YXIgb2JqZWN0ID0gdGhpcy5vcHRpb25zLm9iamVjdDtcbiAgICB2YXIgbWV0YXMgPSB0aGlzLm9wdGlvbnMubWV0YXM7XG4gICAgdmFyIG1heFJldHJpZXMgPSBvcHRfbWF4UmV0cmllcyA9PSBudWxsXG4gICAgICAgID8gdGhpcy5vcHRpb25zLm1heF9yZXRyaWVzXG4gICAgICAgIDogb3B0X21heFJldHJpZXM7XG4gICAgdmFyIHJldHJ5SW50ZXJ2YWwgPSB0aGlzLm9wdGlvbnMucmV0cnlfaW50ZXJ2YWw7XG5cbiAgICB2YXIgY29udGVudFR5cGUgPSB1dGlscy5ndWVzc0NvbnRlbnRUeXBlKGZpbGUpO1xuICAgIHZhciBvcHRpb25zID0gdS5leHRlbmQoeydDb250ZW50LVR5cGUnOiBjb250ZW50VHlwZX0sIG1ldGFzKTtcblxuICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IHRoaXMuY2xpZW50LnB1dE9iamVjdEZyb21CbG9iKGJ1Y2tldCwgb2JqZWN0LCBmaWxlLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzLnhoclJlcXVlc3RpbmcudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtmaWxlLCAxXSk7XG5cbiAgICAgICAgcmVzcG9uc2UuYm9keS5idWNrZXQgPSBidWNrZXQ7XG4gICAgICAgIHJlc3BvbnNlLmJvZHkub2JqZWN0ID0gb2JqZWN0O1xuXG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0ZpbGVVcGxvYWRlZCwgW2ZpbGUsIHJlc3BvbnNlXSk7XG4gICAgfSlbXG4gICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IHNlbGYuYWJvcnRlZCA/IGV2ZW50cy5rQWJvcnRlZCA6IGV2ZW50cy5rRXJyb3I7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudFR5cGUsIFtlcnJvciwgZmlsZV0pO1xuXG4gICAgICAgIGlmIChlcnJvci5zdGF0dXNfY29kZSAmJiBlcnJvci5jb2RlICYmIGVycm9yLnJlcXVlc3RfaWQpIHtcbiAgICAgICAgICAgIC8vIOW6lOivpeaYr+ato+W4uOeahOmUmeivryjmr5TlpoLnrb7lkI3lvILluLgp77yM6L+Z56eN5oOF5Ya15bCx5LiN6KaB6YeN6K+V5LqGXG4gICAgICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZWxzZSBpZiAoZXJyb3Iuc3RhdHVzX2NvZGUgPT09IDApIHtcbiAgICAgICAgLy8gICAgLy8g5Y+v6IO95piv5pat572R5LqG77yMc2FmYXJpIOinpuWPkSBvbmxpbmUvb2ZmbGluZSDlu7bov5/mr5TovoPkuYVcbiAgICAgICAgLy8gICAgLy8g5oiR5Lus5o6o6L+f5LiA5LiLIHNlbGYuX3VwbG9hZE5leHQoKSDnmoTml7bmnLpcbiAgICAgICAgLy8gICAgc2VsZi5wYXVzZSgpO1xuICAgICAgICAvLyAgICByZXR1cm47XG4gICAgICAgIC8vIH1cbiAgICAgICAgZWxzZSBpZiAobWF4UmV0cmllcyA+IDAgJiYgIXNlbGYuYWJvcnRlZCkge1xuICAgICAgICAgICAgLy8g6L+Y5pyJ5py65Lya6YeN6K+VXG4gICAgICAgICAgICByZXR1cm4gdXRpbHMuZGVsYXkocmV0cnlJbnRlcnZhbCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuc3RhcnQobWF4UmV0cmllcyAtIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyDph43or5Xnu5PmnZ/kuobvvIzkuI3nrqHkuobvvIznu6fnu63kuIvkuIDkuKrmlofku7bnmoTkuIrkvKBcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH0pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFB1dE9iamVjdFRhc2s7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9xdWV1ZS5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyoqXG4gKiBRdWV1ZVxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHsqfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uLlxuICovXG5mdW5jdGlvbiBRdWV1ZShjb2xsZWN0aW9uKSB7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbn1cblxuUXVldWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5sZW5ndGggPD0gMDtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5zaXplID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoO1xufTtcblxuUXVldWUucHJvdG90eXBlLmRlcXVldWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5zaGlmdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBRdWV1ZTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzdHNfdG9rZW5fbWFuYWdlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzIpO1xuXG4vKipcbiAqIFN0c1Rva2VuTWFuYWdlclxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIFN0c1Rva2VuTWFuYWdlcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG59XG5cblN0c1Rva2VuTWFuYWdlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChzZWxmLl9jYWNoZVtidWNrZXRdICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2NhY2hlW2J1Y2tldF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFEucmVzb2x2ZSh0aGlzLl9nZXRJbXBsLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpLnRoZW4oZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgc2VsZi5fY2FjaGVbYnVja2V0XSA9IHBheWxvYWQ7XG4gICAgICAgIHJldHVybiBwYXlsb2FkO1xuICAgIH0pO1xufTtcblxuU3RzVG9rZW5NYW5hZ2VyLnByb3RvdHlwZS5fZ2V0SW1wbCA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgdXB0b2tlbl91cmwgPSBvcHRpb25zLnVwdG9rZW5fdXJsO1xuICAgIHZhciB0aW1lb3V0ID0gb3B0aW9ucy51cHRva2VuX3RpbWVvdXQgfHwgb3B0aW9ucy51cHRva2VuX2pzb25wX3RpbWVvdXQ7XG4gICAgdmFyIHZpYUpzb25wID0gb3B0aW9ucy51cHRva2VuX3ZpYV9qc29ucDtcblxuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHVwdG9rZW5fdXJsLFxuICAgICAgICBqc29ucDogdmlhSnNvbnAgPyAnY2FsbGJhY2snIDogZmFsc2UsXG4gICAgICAgIGRhdGFUeXBlOiB2aWFKc29ucCA/ICdqc29ucCcgOiAnanNvbicsXG4gICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHN0czogSlNPTi5zdHJpbmdpZnkodXRpbHMuZ2V0RGVmYXVsdEFDTChidWNrZXQpKVxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICAgICAgLy8gcGF5bG9hZC5BY2Nlc3NLZXlJZFxuICAgICAgICAgICAgLy8gcGF5bG9hZC5TZWNyZXRBY2Nlc3NLZXlcbiAgICAgICAgICAgIC8vIHBheWxvYWQuU2Vzc2lvblRva2VuXG4gICAgICAgICAgICAvLyBwYXlsb2FkLkV4cGlyYXRpb25cbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdHZXQgc3RzIHRva2VuIHRpbWVvdXQgKCcgKyB0aW1lb3V0ICsgJ21zKS4nKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdHNUb2tlbk1hbmFnZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHRhc2suanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cblxuLyoqXG4gKiDkuI3lkIznmoTlnLrmma/kuIvvvIzpnIDopoHpgJrov4fkuI3lkIznmoRUYXNr5p2l5a6M5oiQ5LiK5Lyg55qE5bel5L2cXG4gKlxuICogQHBhcmFtIHtzZGsuQm9zQ2xpZW50fSBjbGllbnQgVGhlIGJvcyBjbGllbnQuXG4gKiBAcGFyYW0ge0V2ZW50RGlzcGF0Y2hlcn0gZXZlbnREaXNwYXRjaGVyIFRoZSBldmVudCBkaXNwYXRjaGVyLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIGV4dHJhIHRhc2stcmVsYXRlZCBhcmd1bWVudHMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFRhc2soY2xpZW50LCBldmVudERpc3BhdGNoZXIsIG9wdGlvbnMpIHtcbiAgICAvKipcbiAgICAgKiDlj6/ku6XooqsgYWJvcnQg55qEIHByb21pc2Ug5a+56LGhXG4gICAgICpcbiAgICAgKiBAdHlwZSB7UHJvbWlzZX1cbiAgICAgKi9cbiAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICog5qCH6K6w5LiA5LiL5piv5ZCm5piv5Lq65Li65Lit5pat5LqGXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLmFib3J0ZWQgPSBmYWxzZTtcblxuICAgIHRoaXMubmV0d29ya0luZm8gPSBudWxsO1xuXG4gICAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIgPSBldmVudERpc3BhdGNoZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gYWJzdHJhY3RNZXRob2QoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmltcGxlbWVudGVkIG1ldGhvZC4nKTtcbn1cblxuLyoqXG4gKiDlvIDlp4vkuIrkvKDku7vliqFcbiAqL1xuVGFzay5wcm90b3R5cGUuc3RhcnQgPSBhYnN0cmFjdE1ldGhvZDtcblxuLyoqXG4gKiDmmoLlgZzkuIrkvKBcbiAqL1xuVGFzay5wcm90b3R5cGUucGF1c2UgPSBhYnN0cmFjdE1ldGhvZDtcblxuLyoqXG4gKiDmgaLlpI3mmoLlgZxcbiAqL1xuVGFzay5wcm90b3R5cGUucmVzdW1lID0gYWJzdHJhY3RNZXRob2Q7XG5cblRhc2sucHJvdG90eXBlLnNldE5ldHdvcmtJbmZvID0gZnVuY3Rpb24gKG5ldHdvcmtJbmZvKSB7XG4gICAgdGhpcy5uZXR3b3JrSW5mbyA9IG5ldHdvcmtJbmZvO1xufTtcblxuLyoqXG4gKiDnu4jmraLkuIrkvKDku7vliqFcbiAqL1xuVGFzay5wcm90b3R5cGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMueGhyUmVxdWVzdGluZ1xuICAgICAgICAmJiB0eXBlb2YgdGhpcy54aHJSZXF1ZXN0aW5nLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMueGhyUmVxdWVzdGluZy5hYm9ydCgpO1xuICAgICAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSBudWxsO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGFzaztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgdXBsb2FkZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgyNCk7XG52YXIga0RlZmF1bHRPcHRpb25zID0gcmVxdWlyZSgyMyk7XG52YXIgUHV0T2JqZWN0VGFzayA9IHJlcXVpcmUoMjcpO1xudmFyIE11bHRpcGFydFRhc2sgPSByZXF1aXJlKDI1KTtcbnZhciBTdHNUb2tlbk1hbmFnZXIgPSByZXF1aXJlKDI5KTtcbnZhciBOZXR3b3JrSW5mbyA9IHJlcXVpcmUoMjYpO1xuXG52YXIgQXV0aCA9IHJlcXVpcmUoMTUpO1xudmFyIEJvc0NsaWVudCA9IHJlcXVpcmUoMTcpO1xuXG4vKipcbiAqIEJDRSBCT1MgVXBsb2FkZXJcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fHN0cmluZ30gb3B0aW9ucyDphY3nva7lj4LmlbBcbiAqL1xuZnVuY3Rpb24gVXBsb2FkZXIob3B0aW9ucykge1xuICAgIGlmICh1LmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICAgIC8vIOaUr+aMgeeugOS+v+eahOWGmeazle+8jOWPr+S7peS7jiBET00g6YeM6Z2i5YiG5p6Q55u45YWz55qE6YWN572uLlxuICAgICAgICBvcHRpb25zID0gdS5leHRlbmQoe1xuICAgICAgICAgICAgYnJvd3NlX2J1dHRvbjogb3B0aW9ucyxcbiAgICAgICAgICAgIGF1dG9fc3RhcnQ6IHRydWVcbiAgICAgICAgfSwgJChvcHRpb25zKS5kYXRhKCkpO1xuICAgIH1cblxuICAgIHZhciBydW50aW1lT3B0aW9ucyA9IHt9O1xuICAgIHRoaXMub3B0aW9ucyA9IHUuZXh0ZW5kKHt9LCBrRGVmYXVsdE9wdGlvbnMsIHJ1bnRpbWVPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLm9wdGlvbnMubWF4X2ZpbGVfc2l6ZSA9IHV0aWxzLnBhcnNlU2l6ZSh0aGlzLm9wdGlvbnMubWF4X2ZpbGVfc2l6ZSk7XG4gICAgdGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfbWluX3NpemVcbiAgICAgICAgPSB1dGlscy5wYXJzZVNpemUodGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfbWluX3NpemUpO1xuICAgIHRoaXMub3B0aW9ucy5jaHVua19zaXplID0gdXRpbHMucGFyc2VTaXplKHRoaXMub3B0aW9ucy5jaHVua19zaXplKTtcblxuICAgIHZhciBjcmVkZW50aWFscyA9IHRoaXMub3B0aW9ucy5ib3NfY3JlZGVudGlhbHM7XG4gICAgaWYgKCFjcmVkZW50aWFscyAmJiB0aGlzLm9wdGlvbnMuYm9zX2FrICYmIHRoaXMub3B0aW9ucy5ib3Nfc2spIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgIGFrOiB0aGlzLm9wdGlvbnMuYm9zX2FrLFxuICAgICAgICAgICAgc2s6IHRoaXMub3B0aW9ucy5ib3Nfc2tcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Qm9zQ2xpZW50fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50ID0gbmV3IEJvc0NsaWVudCh7XG4gICAgICAgIGVuZHBvaW50OiB1dGlscy5ub3JtYWxpemVFbmRwb2ludCh0aGlzLm9wdGlvbnMuYm9zX2VuZHBvaW50KSxcbiAgICAgICAgY3JlZGVudGlhbHM6IHRoaXMub3B0aW9ucy5ib3NfY3JlZGVudGlhbHMsXG4gICAgICAgIHNlc3Npb25Ub2tlbjogdGhpcy5vcHRpb25zLnVwdG9rZW5cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOmcgOimgeetieW+heS4iuS8oOeahOaWh+S7tuWIl+ihqO+8jOavj+asoeS4iuS8oOeahOaXtuWAme+8jOS7jui/memHjOmdouWIoOmZpFxuICAgICAqIOaIkOWKn+aIluiAheWksei0pemDveS4jeS8muWGjeaUvuWbnuWOu+S6hlxuICAgICAqIEBwYXJhbSB7QXJyYXkuPEZpbGU+fVxuICAgICAqL1xuICAgIHRoaXMuX2ZpbGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiDmraPlnKjkuIrkvKDnmoTmlofku7bliJfooaguXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIEZpbGU+fVxuICAgICAqL1xuICAgIHRoaXMuX3VwbG9hZGluZ0ZpbGVzID0ge307XG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKbooqvkuK3mlq3kuobvvIzmr5TlpoIgdGhpcy5zdG9wXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5fYWJvcnQgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuWkhOS6juS4iuS8oOeahOi/h+eoi+S4re+8jOS5n+WwseaYr+ato+WcqOWkhOeQhiB0aGlzLl9maWxlcyDpmJ/liJfnmoTlhoXlrrkuXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5fd29ya2luZyA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5pSv5oyBeGhyMlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX3hocjJTdXBwb3J0ZWQgPSB1dGlscy5pc1hocjJTdXBwb3J0ZWQoKTtcblxuICAgIHRoaXMuX25ldHdvcmtJbmZvID0gbmV3IE5ldHdvcmtJbmZvKCk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG59XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fZ2V0Q3VzdG9taXplZFNpZ25hdHVyZSA9IGZ1bmN0aW9uICh1cHRva2VuVXJsKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnVwdG9rZW5fdGltZW91dCB8fCBvcHRpb25zLnVwdG9rZW5fanNvbnBfdGltZW91dDtcbiAgICB2YXIgdmlhSnNvbnAgPSBvcHRpb25zLnVwdG9rZW5fdmlhX2pzb25wO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChfLCBodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKC9cXGJlZD0oW1xcd1xcLl0rKVxcYi8udGVzdChsb2NhdGlvbi5zZWFyY2gpKSB7XG4gICAgICAgICAgICBoZWFkZXJzLkhvc3QgPSBSZWdFeHAuJDE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodS5pc0FycmF5KG9wdGlvbnMuYXV0aF9zdHJpcHBlZF9oZWFkZXJzKSkge1xuICAgICAgICAgICAgaGVhZGVycyA9IHUub21pdChoZWFkZXJzLCBvcHRpb25zLmF1dGhfc3RyaXBwZWRfaGVhZGVycyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IHVwdG9rZW5VcmwsXG4gICAgICAgICAgICBqc29ucDogdmlhSnNvbnAgPyAnY2FsbGJhY2snIDogZmFsc2UsXG4gICAgICAgICAgICBkYXRhVHlwZTogdmlhSnNvbnAgPyAnanNvbnAnIDogJ2pzb24nLFxuICAgICAgICAgICAgdGltZW91dDogdGltZW91dCxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBodHRwTWV0aG9kOiBodHRwTWV0aG9kLFxuICAgICAgICAgICAgICAgIHBhdGg6IHBhdGgsXG4gICAgICAgICAgICAgICAgLy8gZGVsYXk6IH5+KE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgICAgICAgICAgICAgcXVlcmllczogSlNPTi5zdHJpbmdpZnkocGFyYW1zIHx8IHt9KSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBKU09OLnN0cmluZ2lmeShoZWFkZXJzIHx8IHt9KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignR2V0IGF1dGhvcml6YXRpb24gdGltZW91dCAoJyArIHRpbWVvdXQgKyAnbXMpLicpKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkLnN0YXR1c0NvZGUgPT09IDIwMCAmJiBwYXlsb2FkLnNpZ25hdHVyZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBheWxvYWQuc2lnbmF0dXJlLCBwYXlsb2FkLnhiY2VEYXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ2NyZWF0ZVNpZ25hdHVyZSBmYWlsZWQsIHN0YXR1c0NvZGUgPSAnICsgcGF5bG9hZC5zdGF0dXNDb2RlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn07XG5cbi8qKlxuICog6LCD55SoIHRoaXMub3B0aW9ucy5pbml0IOmHjOmdoumFjee9rueahOaWueazlVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lIOaWueazleWQjeensFxuICogQHBhcmFtIHtBcnJheS48Kj59IGFyZ3Mg6LCD55So5pe25YCZ55qE5Y+C5pWwLlxuICogQHBhcmFtIHtib29sZWFuPX0gdGhyb3dFcnJvcnMg5aaC5p6c5Y+R55Sf5byC5bi455qE5pe25YCZ77yM5piv5ZCm6ZyA6KaB5oqb5Ye65p2lXG4gKiBAcmV0dXJuIHsqfSDkuovku7bnmoTov5Tlm57lgLwuXG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5faW52b2tlID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGFyZ3MsIHRocm93RXJyb3JzKSB7XG4gICAgdmFyIGluaXQgPSB0aGlzLm9wdGlvbnMuaW5pdCB8fCB0aGlzLm9wdGlvbnMuSW5pdDtcbiAgICBpZiAoIWluaXQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtZXRob2QgPSBpbml0W21ldGhvZE5hbWVdO1xuICAgIGlmICh0eXBlb2YgbWV0aG9kICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICB2YXIgdXAgPSBudWxsO1xuICAgICAgICBhcmdzID0gYXJncyA9PSBudWxsID8gW3VwXSA6IFt1cF0uY29uY2F0KGFyZ3MpO1xuICAgICAgICByZXR1cm4gbWV0aG9kLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH1cbiAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgaWYgKHRocm93RXJyb3JzID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gUS5yZWplY3QoZXgpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiDliJ3lp4vljJbmjqfku7YuXG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5faW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgYWNjZXB0ID0gb3B0aW9ucy5hY2NlcHQ7XG5cbiAgICB2YXIgYnRuRWxlbWVudCA9ICQob3B0aW9ucy5icm93c2VfYnV0dG9uKTtcbiAgICB2YXIgbm9kZU5hbWUgPSBidG5FbGVtZW50LnByb3AoJ25vZGVOYW1lJyk7XG4gICAgaWYgKG5vZGVOYW1lICE9PSAnSU5QVVQnKSB7XG4gICAgICAgIHZhciBlbGVtZW50Q29udGFpbmVyID0gYnRuRWxlbWVudDtcblxuICAgICAgICAvLyDlpoLmnpzmnKzouqvkuI3mmK8gPGlucHV0IHR5cGU9XCJmaWxlXCIgLz7vvIzoh6rliqjov73liqDkuIDkuKrkuIrljrtcbiAgICAgICAgLy8gMS4gb3B0aW9ucy5icm93c2VfYnV0dG9uIOWQjumdoui/veWKoOS4gOS4quWFg+e0oCA8ZGl2PjxpbnB1dCB0eXBlPVwiZmlsZVwiIC8+PC9kaXY+XG4gICAgICAgIC8vIDIuIGJ0bkVsZW1lbnQucGFyZW50KCkuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgICAgICAvLyAzLiAuYmNlLWJvcy11cGxvYWRlci1pbnB1dC1jb250YWluZXIg55So5p2l6Ieq5a6a5LmJ6Ieq5bex55qE5qC35byPXG4gICAgICAgIHZhciB3aWR0aCA9IGVsZW1lbnRDb250YWluZXIub3V0ZXJXaWR0aCgpO1xuICAgICAgICB2YXIgaGVpZ2h0ID0gZWxlbWVudENvbnRhaW5lci5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgIHZhciBpbnB1dEVsZW1lbnRDb250YWluZXIgPSAkKCc8ZGl2IGNsYXNzPVwiYmNlLWJvcy11cGxvYWRlci1pbnB1dC1jb250YWluZXJcIj48aW5wdXQgdHlwZT1cImZpbGVcIiAvPjwvZGl2PicpO1xuICAgICAgICBpbnB1dEVsZW1lbnRDb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAndG9wJzogMCwgJ2xlZnQnOiAwLFxuICAgICAgICAgICAgJ3dpZHRoJzogd2lkdGgsICdoZWlnaHQnOiBoZWlnaHQsXG4gICAgICAgICAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJyxcbiAgICAgICAgICAgIC8vIOWmguaenOaUr+aMgSB4aHIy77yM5oqKIGlucHV0W3R5cGU9ZmlsZV0g5pS+5Yiw5oyJ6ZKu55qE5LiL6Z2i77yM6YCa6L+H5Li75Yqo6LCD55SoIGZpbGUuY2xpY2soKSDop6blj5FcbiAgICAgICAgICAgIC8vIOWmguaenOS4jeaUr+aMgXhocjIsIOaKiiBpbnB1dFt0eXBlPWZpbGVdIOaUvuWIsOaMiemSrueahOS4iumdou+8jOmAmui/h+eUqOaIt+S4u+WKqOeCueWHuyBpbnB1dFt0eXBlPWZpbGVdIOinpuWPkVxuICAgICAgICAgICAgJ3otaW5kZXgnOiB0aGlzLl94aHIyU3VwcG9ydGVkID8gOTkgOiAxMDBcbiAgICAgICAgfSk7XG4gICAgICAgIGlucHV0RWxlbWVudENvbnRhaW5lci5maW5kKCdpbnB1dCcpLmNzcyh7XG4gICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgJ3RvcCc6IDAsICdsZWZ0JzogMCxcbiAgICAgICAgICAgICd3aWR0aCc6ICcxMDAlJywgJ2hlaWdodCc6ICcxMDAlJyxcbiAgICAgICAgICAgICdmb250LXNpemUnOiAnOTk5cHgnLFxuICAgICAgICAgICAgJ29wYWNpdHknOiAwXG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtZW50Q29udGFpbmVyLmNzcyh7XG4gICAgICAgICAgICAncG9zaXRpb24nOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgJ3otaW5kZXgnOiB0aGlzLl94aHIyU3VwcG9ydGVkID8gMTAwIDogOTlcbiAgICAgICAgfSk7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuYWZ0ZXIoaW5wdXRFbGVtZW50Q29udGFpbmVyKTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5wYXJlbnQoKS5jc3MoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG5cbiAgICAgICAgLy8g5oqKIGJyb3dzZV9idXR0b24g5L+u5pS55Li65b2T5YmN55Sf5oiQ55qE6YKj5Liq5YWD57SgXG4gICAgICAgIG9wdGlvbnMuYnJvd3NlX2J1dHRvbiA9IGlucHV0RWxlbWVudENvbnRhaW5lci5maW5kKCdpbnB1dCcpO1xuXG4gICAgICAgIGlmICh0aGlzLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICBlbGVtZW50Q29udGFpbmVyLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmJyb3dzZV9idXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy5feGhyMlN1cHBvcnRlZFxuICAgICAgICAmJiB0eXBlb2YgbU94aWUgIT09ICd1bmRlZmluZWQnXG4gICAgICAgICYmIHUuaXNGdW5jdGlvbihtT3hpZS5GaWxlSW5wdXQpKSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3hpZWNvZGUvbW94aWUvd2lraS9GaWxlSW5wdXRcbiAgICAgICAgLy8gbU94aWUuRmlsZUlucHV0IOWPquaUr+aMgVxuICAgICAgICAvLyBbK106IGJyb3dzZV9idXR0b24sIGFjY2VwdCBtdWx0aXBsZSwgZGlyZWN0b3J5LCBmaWxlXG4gICAgICAgIC8vIFt4XTogY29udGFpbmVyLCByZXF1aXJlZF9jYXBzXG4gICAgICAgIHZhciBmaWxlSW5wdXQgPSBuZXcgbU94aWUuRmlsZUlucHV0KHtcbiAgICAgICAgICAgIHJ1bnRpbWVfb3JkZXI6ICdmbGFzaCxodG1sNCcsXG4gICAgICAgICAgICBicm93c2VfYnV0dG9uOiAkKG9wdGlvbnMuYnJvd3NlX2J1dHRvbikuZ2V0KDApLFxuICAgICAgICAgICAgc3dmX3VybDogb3B0aW9ucy5mbGFzaF9zd2ZfdXJsLFxuICAgICAgICAgICAgYWNjZXB0OiB1dGlscy5leHBhbmRBY2NlcHRUb0FycmF5KGFjY2VwdCksXG4gICAgICAgICAgICBtdWx0aXBsZTogb3B0aW9ucy5tdWx0aV9zZWxlY3Rpb24sXG4gICAgICAgICAgICBkaXJlY3Rvcnk6IG9wdGlvbnMuZGlyX3NlbGVjdGlvbixcbiAgICAgICAgICAgIGZpbGU6ICdmaWxlJyAgICAgIC8vIFBvc3RPYmplY3TmjqXlj6PopoHmsYLlm7rlrprmmK8gJ2ZpbGUnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGZpbGVJbnB1dC5vbmNoYW5nZSA9IHUuYmluZCh0aGlzLl9vbkZpbGVzQWRkZWQsIHRoaXMpO1xuICAgICAgICBmaWxlSW5wdXQub25yZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuX2luaXRFdmVudHMoKTtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua1Bvc3RJbml0KTtcbiAgICAgICAgfTtcblxuICAgICAgICBmaWxlSW5wdXQuaW5pdCgpO1xuICAgIH1cblxuICAgIHZhciBwcm9taXNlID0gb3B0aW9ucy5ib3NfY3JlZGVudGlhbHNcbiAgICAgICAgPyBRLnJlc29sdmUoKVxuICAgICAgICA6IHNlbGYucmVmcmVzaFN0c1Rva2VuKCk7XG5cbiAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAob3B0aW9ucy5ib3NfY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHNlbGYuY2xpZW50LmNyZWF0ZVNpZ25hdHVyZSA9IGZ1bmN0aW9uIChfLCBodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSBfIHx8IHRoaXMuY29uZmlnLmNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgICAgIHJldHVybiBRLmZjYWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF1dGggPSBuZXcgQXV0aChjcmVkZW50aWFscy5haywgY3JlZGVudGlhbHMuc2spO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXV0aC5nZW5lcmF0ZUF1dGhvcml6YXRpb24oaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy51cHRva2VuX3VybCAmJiBvcHRpb25zLmdldF9uZXdfdXB0b2tlbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8g5pyN5Yqh56uv5Yqo5oCB562+5ZCN55qE5pa55byPXG4gICAgICAgICAgICBzZWxmLmNsaWVudC5jcmVhdGVTaWduYXR1cmUgPSBzZWxmLl9nZXRDdXN0b21pemVkU2lnbmF0dXJlKG9wdGlvbnMudXB0b2tlbl91cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlbGYuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIC8vIOWvueS6juS4jeaUr+aMgSB4aHIyIOeahOaDheWGte+8jOS8muWcqCBvbnJlYWR5IOeahOaXtuWAmeWOu+inpuWPkeS6i+S7tlxuICAgICAgICAgICAgc2VsZi5faW5pdEV2ZW50cygpO1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rUG9zdEluaXQpO1xuICAgICAgICB9XG4gICAgfSlbXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rRXJyb3IsIFtlcnJvcl0pO1xuICAgIH0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl9pbml0RXZlbnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKHRoaXMuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgdmFyIGJ0biA9ICQob3B0aW9ucy5icm93c2VfYnV0dG9uKTtcbiAgICAgICAgaWYgKGJ0bi5hdHRyKCdtdWx0aXBsZScpID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIOWmguaenOeUqOaIt+ayoeacieaYvuekuueahOiuvue9rui/hyBtdWx0aXBsZe+8jOS9v+eUqCBtdWx0aV9zZWxlY3Rpb24g55qE6K6+572uXG4gICAgICAgICAgICAvLyDlkKbliJnkv53nlZkgPGlucHV0IG11bHRpcGxlIC8+IOeahOWGheWuuVxuICAgICAgICAgICAgYnRuLmF0dHIoJ211bHRpcGxlJywgISFvcHRpb25zLm11bHRpX3NlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgYnRuLm9uKCdjaGFuZ2UnLCB1LmJpbmQodGhpcy5fb25GaWxlc0FkZGVkLCB0aGlzKSk7XG5cbiAgICAgICAgdmFyIGFjY2VwdCA9IG9wdGlvbnMuYWNjZXB0O1xuICAgICAgICBpZiAoYWNjZXB0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFNhZmFyaSDlj6rmlK/mjIEgbWltZS10eXBlXG4gICAgICAgICAgICAvLyBDaHJvbWUg5pSv5oyBIG1pbWUtdHlwZSDlkowgZXh0c1xuICAgICAgICAgICAgLy8gRmlyZWZveCDlj6rmlK/mjIEgZXh0c1xuICAgICAgICAgICAgLy8gTk9URTogZXh0cyDlv4XpobvmnIkgLiDov5nkuKrliY3nvIDvvIzkvovlpoIgLnR4dCDmmK/lkIjms5XnmoTvvIx0eHQg5piv5LiN5ZCI5rOV55qEXG4gICAgICAgICAgICB2YXIgZXh0cyA9IHV0aWxzLmV4cGFuZEFjY2VwdChhY2NlcHQpO1xuICAgICAgICAgICAgdmFyIGlzU2FmYXJpID0gL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQXBwbGUgQ29tcHV0ZXIvLnRlc3QobmF2aWdhdG9yLnZlbmRvcik7XG4gICAgICAgICAgICBpZiAoaXNTYWZhcmkpIHtcbiAgICAgICAgICAgICAgICBleHRzID0gdXRpbHMuZXh0VG9NaW1lVHlwZShleHRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ0bi5hdHRyKCdhY2NlcHQnLCBleHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLmRpcl9zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGJ0bi5hdHRyKCdkaXJlY3RvcnknLCB0cnVlKTtcbiAgICAgICAgICAgIGJ0bi5hdHRyKCdtb3pkaXJlY3RvcnknLCB0cnVlKTtcbiAgICAgICAgICAgIGJ0bi5hdHRyKCd3ZWJraXRkaXJlY3RvcnknLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2xpZW50Lm9uKCdwcm9ncmVzcycsIHUuYmluZCh0aGlzLl9vblVwbG9hZFByb2dyZXNzLCB0aGlzKSk7XG4gICAgLy8gWFhYIOW/hemhu+e7keWumiBlcnJvciDnmoTlpITnkIblh73mlbDvvIzlkKbliJnkvJogdGhyb3cgbmV3IEVycm9yXG4gICAgdGhpcy5jbGllbnQub24oJ2Vycm9yJywgdS5iaW5kKHRoaXMuX29uRXJyb3IsIHRoaXMpKTtcblxuICAgIC8vICQod2luZG93KS5vbignb25saW5lJywgdS5iaW5kKHRoaXMuX2hhbmRsZU9ubGluZVN0YXR1cywgdGhpcykpO1xuICAgIC8vICQod2luZG93KS5vbignb2ZmbGluZScsIHUuYmluZCh0aGlzLl9oYW5kbGVPZmZsaW5lU3RhdHVzLCB0aGlzKSk7XG5cbiAgICBpZiAoIXRoaXMuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgLy8g5aaC5p6c5rWP6KeI5Zmo5LiN5pSv5oyBIHhocjLvvIzpgqPkuYjlsLHliIfmjaLliLAgbU94aWUuWE1MSHR0cFJlcXVlc3RcbiAgICAgICAgLy8g5L2G5piv5Zug5Li6IG1PeGllLlhNTEh0dHBSZXF1ZXN0IOaXoOazleWPkemAgSBIRUFEIOivt+axgu+8jOaXoOazleiOt+WPliBSZXNwb25zZSBIZWFkZXJz77yMXG4gICAgICAgIC8vIOWboOatpCBnZXRPYmplY3RNZXRhZGF0YeWunumZheS4iuaXoOazleato+W4uOW3peS9nO+8jOWboOatpOaIkeS7rOmcgOimge+8mlxuICAgICAgICAvLyAxLiDorqkgQk9TIOaWsOWiniBSRVNUIEFQSe+8jOWcqCBHRVQg55qE6K+35rGC55qE5ZCM5pe277yM5oqKIHgtYmNlLSog5pS+5YiwIFJlc3BvbnNlIEJvZHkg6L+U5ZueXG4gICAgICAgIC8vIDIuIOS4tOaXtuaWueahiO+8muaWsOWinuS4gOS4qiBSZWxheSDmnI3liqHvvIzlrp7njrDmlrnmoYggMVxuICAgICAgICAvLyAgICBHRVQgL2JqLmJjZWJvcy5jb20vdjEvYnVja2V0L29iamVjdD9odHRwTWV0aG9kPUhFQURcbiAgICAgICAgLy8gICAgSG9zdDogcmVsYXkuZWZlLnRlY2hcbiAgICAgICAgLy8gICAgQXV0aG9yaXphdGlvbjogeHh4XG4gICAgICAgIC8vIG9wdGlvbnMuYm9zX3JlbGF5X3NlcnZlclxuICAgICAgICAvLyBvcHRpb25zLnN3Zl91cmxcbiAgICAgICAgdGhpcy5jbGllbnQuc2VuZEhUVFBSZXF1ZXN0ID0gdS5iaW5kKHV0aWxzLmZpeFhocih0aGlzLm9wdGlvbnMsIHRydWUpLCB0aGlzLmNsaWVudCk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl9maWx0ZXJGaWxlcyA9IGZ1bmN0aW9uIChjYW5kaWRhdGVzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8g5aaC5p6cIG1heEZpbGVTaXplID09PSAwIOWwseivtOaYjuS4jemZkOWItuWkp+Wwj1xuICAgIHZhciBtYXhGaWxlU2l6ZSA9IHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplO1xuXG4gICAgdmFyIGZpbGVzID0gdS5maWx0ZXIoY2FuZGlkYXRlcywgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgaWYgKG1heEZpbGVTaXplID4gMCAmJiBmaWxlLnNpemUgPiBtYXhGaWxlU2l6ZSkge1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rRmlsZUZpbHRlcmVkLCBbZmlsZV0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyDmo4Dmn6XlkI7nvIDkuYvnsbvnmoRcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzLl9pbnZva2UoZXZlbnRzLmtGaWxlc0ZpbHRlciwgW2ZpbGVzXSkgfHwgZmlsZXM7XG59O1xuXG5mdW5jdGlvbiBidWlsZEFib3J0SGFuZGxlcihpdGVtLCBzZWxmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXRlbS5fYWJvcnRlZCA9IHRydWU7XG4gICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0Fib3J0ZWQsIFtudWxsLCBpdGVtXSk7XG4gICAgfTtcbn1cblxuVXBsb2FkZXIucHJvdG90eXBlLl9vbkZpbGVzQWRkZWQgPSBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZmlsZXMgPSBlLnRhcmdldC5maWxlcztcbiAgICBpZiAoIWZpbGVzKSB7XG4gICAgICAgIC8vIElFNywgSUU4IOS9jueJiOacrOa1j+iniOWZqOeahOWkhOeQhlxuICAgICAgICB2YXIgbmFtZSA9IGUudGFyZ2V0LnZhbHVlLnNwbGl0KC9bXFwvXFxcXF0vKS5wb3AoKTtcbiAgICAgICAgZmlsZXMgPSBbXG4gICAgICAgICAgICB7bmFtZTogbmFtZSwgc2l6ZTogMH1cbiAgICAgICAgXTtcbiAgICB9XG4gICAgZmlsZXMgPSB0aGlzLl9maWx0ZXJGaWxlcyhmaWxlcyk7XG4gICAgaWYgKHUuaXNBcnJheShmaWxlcykgJiYgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB0b3RhbEJ5dGVzID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBmaWxlc1tpXTtcblxuICAgICAgICAgICAgLy8g6L+Z6YeM5pivIGFib3J0IOeahOm7mOiupOWunueOsO+8jOW8gOWni+S4iuS8oOeahOaXtuWAme+8jOS8muaUueaIkOWPpuWklueahOS4gOenjeWunueOsOaWueW8j1xuICAgICAgICAgICAgLy8g6buY6K6k55qE5a6e546w5piv5Li65LqG5pSv5oyB5Zyo5rKh5pyJ5byA5aeL5LiK5Lyg5LmL5YmN77yM5Lmf5Y+v5Lul5Y+W5raI5LiK5Lyg55qE6ZyA5rGCXG4gICAgICAgICAgICBpdGVtLmFib3J0ID0gYnVpbGRBYm9ydEhhbmRsZXIoaXRlbSwgc2VsZik7XG5cbiAgICAgICAgICAgIC8vIOWGhemDqOeahCB1dWlk77yM5aSW6YOo5Lmf5Y+v5Lul5L2/55So77yM5q+U5aaCIHJlbW92ZShpdGVtLnV1aWQpIC8gcmVtb3ZlKGl0ZW0pXG4gICAgICAgICAgICBpdGVtLnV1aWQgPSB1dGlscy51dWlkKCk7XG5cbiAgICAgICAgICAgIHRvdGFsQnl0ZXMgKz0gaXRlbS5zaXplO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX25ldHdvcmtJbmZvLnRvdGFsQnl0ZXMgKz0gdG90YWxCeXRlcztcbiAgICAgICAgdGhpcy5fZmlsZXMucHVzaC5hcHBseSh0aGlzLl9maWxlcywgZmlsZXMpO1xuICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtGaWxlc0FkZGVkLCBbZmlsZXNdKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9fc3RhcnQpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgIH1cbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fb25FcnJvciA9IGZ1bmN0aW9uIChlKSB7XG59O1xuXG4vKipcbiAqIOWkhOeQhuS4iuS8oOi/m+W6pueahOWbnuaOieWHveaVsC5cbiAqIDEuIOi/memHjOimgeWMuuWIhuaWh+S7tueahOS4iuS8oOi/mOaYr+WIhueJh+eahOS4iuS8oO+8jOWIhueJh+eahOS4iuS8oOaYr+mAmui/hyBwYXJ0TnVtYmVyIOWSjCB1cGxvYWRJZCDnmoTnu4TlkIjmnaXliKTmlq3nmoRcbiAqIDIuIElFNiw3LDgsOeS4i+mdou+8jOaYr+S4jemcgOimgeiAg+iZkeeahO+8jOWboOS4uuS4jeS8muinpuWPkei/meS4quS6i+S7tu+8jOiAjOaYr+ebtOaOpeWcqCBfc2VuZFBvc3RSZXF1ZXN0IOinpuWPkSBrVXBsb2FkUHJvZ3Jlc3Mg5LqGXG4gKiAzLiDlhbblroPmg4XlhrXkuIvvvIzmiJHku6zliKTmlq3kuIDkuIsgUmVxdWVzdCBCb2R5IOeahOexu+Wei+aYr+WQpuaYryBCbG9i77yM5LuO6ICM6YG/5YWN5a+55LqO5YW25a6D57G75Z6L55qE6K+35rGC77yM6Kem5Y+RIGtVcGxvYWRQcm9ncmVzc1xuICogICAg5L6L5aaC77yaSEVBRO+8jEdFVO+8jFBPU1QoSW5pdE11bHRpcGFydCkg55qE5pe25YCZ77yM5piv5rKh5b+F6KaB6Kem5Y+RIGtVcGxvYWRQcm9ncmVzcyDnmoRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZSAgUHJvZ3Jlc3MgRXZlbnQg5a+56LGhLlxuICogQHBhcmFtIHtPYmplY3R9IGh0dHBDb250ZXh0IHNlbmRIVFRQUmVxdWVzdCDnmoTlj4LmlbBcbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9vblVwbG9hZFByb2dyZXNzID0gZnVuY3Rpb24gKGUsIGh0dHBDb250ZXh0KSB7XG4gICAgdmFyIGFyZ3MgPSBodHRwQ29udGV4dC5hcmdzO1xuICAgIHZhciBmaWxlID0gYXJncy5ib2R5O1xuXG4gICAgaWYgKCF1dGlscy5pc0Jsb2IoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBwcm9ncmVzcyA9IGUubGVuZ3RoQ29tcHV0YWJsZVxuICAgICAgICA/IGUubG9hZGVkIC8gZS50b3RhbFxuICAgICAgICA6IDA7XG5cbiAgICB0aGlzLl9uZXR3b3JrSW5mby5sb2FkZWRCeXRlcyArPSAoZS5sb2FkZWQgLSBmaWxlLl9wcmV2aW91c0xvYWRlZCk7XG4gICAgdGhpcy5faW52b2tlKGV2ZW50cy5rTmV0d29ya1NwZWVkLCB0aGlzLl9uZXR3b3JrSW5mby5kdW1wKCkpO1xuICAgIGZpbGUuX3ByZXZpb3VzTG9hZGVkID0gZS5sb2FkZWQ7XG5cbiAgICB2YXIgZXZlbnRUeXBlID0gZXZlbnRzLmtVcGxvYWRQcm9ncmVzcztcbiAgICBpZiAoYXJncy5wYXJhbXMucGFydE51bWJlciAmJiBhcmdzLnBhcmFtcy51cGxvYWRJZCkge1xuICAgICAgICAvLyBJRTYsNyw4LDnkuIvpnaLkuI3kvJrmnIlwYXJ0TnVtYmVy5ZKMdXBsb2FkSWRcbiAgICAgICAgLy8g5q2k5pe255qEIGZpbGUg5pivIHNsaWNlIOeahOe7k+aenO+8jOWPr+iDveayoeacieiHquWumuS5ieeahOWxnuaAp1xuICAgICAgICAvLyDmr5TlpoIgZGVtbyDph4zpnaLnmoQgX19pZCwgX19tZWRpYUlkIOS5i+exu+eahFxuICAgICAgICBldmVudFR5cGUgPSBldmVudHMua1VwbG9hZFBhcnRQcm9ncmVzcztcbiAgICB9XG5cbiAgICB0aGlzLl9pbnZva2UoZXZlbnRUeXBlLCBbZmlsZSwgcHJvZ3Jlc3MsIGVdKTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaXRlbSA9IHRoaXMuX3VwbG9hZGluZ0ZpbGVzW2l0ZW1dIHx8IHUuZmluZCh0aGlzLl9maWxlcywgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBmaWxlLnV1aWQgPT09IGl0ZW07XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpdGVtICYmIHR5cGVvZiBpdGVtLmFib3J0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGl0ZW0uYWJvcnQoKTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuX3dvcmtpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9maWxlcy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fd29ya2luZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX2Fib3J0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX25ldHdvcmtJbmZvLnJlc2V0KCk7XG5cbiAgICAgICAgdmFyIHRhc2tQYXJhbGxlbCA9IHRoaXMub3B0aW9ucy5ib3NfdGFza19wYXJhbGxlbDtcbiAgICAgICAgLy8g6L+Z6YeM5rKh5pyJ5L2/55SoIGFzeW5jLmVhY2hMaW1pdCDnmoTljp/lm6DmmK8gdGhpcy5fZmlsZXMg5Y+v6IO95Lya6KKr5Yqo5oCB55qE5L+u5pS5XG4gICAgICAgIHV0aWxzLmVhY2hMaW1pdCh0aGlzLl9maWxlcywgdGFza1BhcmFsbGVsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGZpbGUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgZmlsZS5fcHJldmlvdXNMb2FkZWQgPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYuX3VwbG9hZE5leHQoZmlsZSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnVsZmlsbG1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl91cGxvYWRpbmdGaWxlc1tmaWxlLnV1aWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pW1xuICAgICAgICAgICAgICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlamVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fd29ya2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ZpbGVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5fbmV0d29ya0luZm8udG90YWxCeXRlcyA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rVXBsb2FkQ29tcGxldGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fYWJvcnQgPSB0cnVlO1xuICAgIHRoaXMuX3dvcmtpbmcgPSBmYWxzZTtcbn07XG5cbi8qKlxuICog5Yqo5oCB6K6+572uIFVwbG9hZGVyIOeahOafkOS6m+WPguaVsO+8jOW9k+WJjeWPquaUr+aMgeWKqOaAgeeahOS/ruaUuVxuICogYm9zX2NyZWRlbnRpYWxzLCB1cHRva2VuLCBib3NfYnVja2V0LCBib3NfZW5kcG9pbnRcbiAqIGJvc19haywgYm9zX3NrXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMg55So5oi35Yqo5oCB6K6+572u55qE5Y+C5pWw77yI5Y+q5pSv5oyB6YOo5YiG77yJXG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5zZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgc3VwcG9ydGVkT3B0aW9ucyA9IHUucGljayhvcHRpb25zLCAnYm9zX2NyZWRlbnRpYWxzJyxcbiAgICAgICAgJ2Jvc19haycsICdib3Nfc2snLCAndXB0b2tlbicsICdib3NfYnVja2V0JywgJ2Jvc19lbmRwb2ludCcpO1xuICAgIHRoaXMub3B0aW9ucyA9IHUuZXh0ZW5kKHRoaXMub3B0aW9ucywgc3VwcG9ydGVkT3B0aW9ucyk7XG5cbiAgICB2YXIgY29uZmlnID0gdGhpcy5jbGllbnQgJiYgdGhpcy5jbGllbnQuY29uZmlnO1xuICAgIGlmIChjb25maWcpIHtcbiAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0gbnVsbDtcblxuICAgICAgICBpZiAob3B0aW9ucy5ib3NfY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0gb3B0aW9ucy5ib3NfY3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3B0aW9ucy5ib3NfYWsgJiYgb3B0aW9ucy5ib3Nfc2spIHtcbiAgICAgICAgICAgIGNyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgICAgIGFrOiBvcHRpb25zLmJvc19hayxcbiAgICAgICAgICAgICAgICBzazogb3B0aW9ucy5ib3Nfc2tcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5ib3NfY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscztcbiAgICAgICAgICAgIGNvbmZpZy5jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnVwdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbmZpZy5zZXNzaW9uVG9rZW4gPSBvcHRpb25zLnVwdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuYm9zX2VuZHBvaW50KSB7XG4gICAgICAgICAgICBjb25maWcuZW5kcG9pbnQgPSB1dGlscy5ub3JtYWxpemVFbmRwb2ludChvcHRpb25zLmJvc19lbmRwb2ludCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOacieeahOeUqOaIt+W4jOacm+S4u+WKqOabtOaWsCBzdHMgdG9rZW7vvIzpgb/lhY3ov4fmnJ/nmoTpl67pophcbiAqXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5VcGxvYWRlci5wcm90b3R5cGUucmVmcmVzaFN0c1Rva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHNlbGYub3B0aW9ucztcbiAgICB2YXIgc3RzTW9kZSA9IHNlbGYuX3hocjJTdXBwb3J0ZWRcbiAgICAgICAgJiYgb3B0aW9ucy5ib3NfYnVja2V0XG4gICAgICAgICYmIG9wdGlvbnMudXB0b2tlbl91cmxcbiAgICAgICAgJiYgb3B0aW9ucy5nZXRfbmV3X3VwdG9rZW4gPT09IGZhbHNlO1xuICAgIGlmIChzdHNNb2RlKSB7XG4gICAgICAgIHZhciBzdG0gPSBuZXcgU3RzVG9rZW5NYW5hZ2VyKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc3RtLmdldChvcHRpb25zLmJvc19idWNrZXQpLnRoZW4oZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGJvc19hazogcGF5bG9hZC5BY2Nlc3NLZXlJZCxcbiAgICAgICAgICAgICAgICBib3Nfc2s6IHBheWxvYWQuU2VjcmV0QWNjZXNzS2V5LFxuICAgICAgICAgICAgICAgIHVwdG9rZW46IHBheWxvYWQuU2Vzc2lvblRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBRLnJlc29sdmUoKTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fdXBsb2FkTmV4dCA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgaWYgKHRoaXMuX2Fib3J0KSB7XG4gICAgICAgIHRoaXMuX3dvcmtpbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGlmIChmaWxlLl9hYm9ydGVkID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgdGhyb3dFcnJvcnMgPSB0cnVlO1xuICAgIHZhciByZXR1cm5WYWx1ZSA9IHRoaXMuX2ludm9rZShldmVudHMua0JlZm9yZVVwbG9hZCwgW2ZpbGVdLCB0aHJvd0Vycm9ycyk7XG4gICAgaWYgKHJldHVyblZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBRLnJlc29sdmUocmV0dXJuVmFsdWUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWROZXh0SW1wbChmaWxlKTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtFcnJvciwgW2Vycm9yLCBmaWxlXSk7XG4gICAgICAgIH0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl91cGxvYWROZXh0SW1wbCA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciBvYmplY3QgPSBmaWxlLm5hbWU7XG4gICAgdmFyIHRocm93RXJyb3JzID0gdHJ1ZTtcblxuICAgIHZhciBkZWZhdWx0VGFza09wdGlvbnMgPSB1LnBpY2sob3B0aW9ucyxcbiAgICAgICAgJ2ZsYXNoX3N3Zl91cmwnLCAnbWF4X3JldHJpZXMnLCAnY2h1bmtfc2l6ZScsICdyZXRyeV9pbnRlcnZhbCcsXG4gICAgICAgICdib3NfbXVsdGlwYXJ0X3BhcmFsbGVsJyxcbiAgICAgICAgJ2Jvc19tdWx0aXBhcnRfYXV0b19jb250aW51ZScsXG4gICAgICAgICdib3NfbXVsdGlwYXJ0X2xvY2FsX2tleV9nZW5lcmF0b3InXG4gICAgKTtcbiAgICByZXR1cm4gUS5hbGwoW1xuICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtLZXksIFtmaWxlXSwgdGhyb3dFcnJvcnMpLFxuICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtPYmplY3RNZXRhcywgW2ZpbGVdKVxuICAgIF0pLnRoZW4oZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAgIC8vIG9wdGlvbnMuYm9zX2J1Y2tldCDlj6/og73kvJrooqsga0tleSDkuovku7bliqjmgIHnmoTmlLnlj5hcbiAgICAgICAgdmFyIGJ1Y2tldCA9IG9wdGlvbnMuYm9zX2J1Y2tldDtcblxuICAgICAgICB2YXIgcmVzdWx0ID0gYXJyYXlbMF07XG4gICAgICAgIHZhciBvYmplY3RNZXRhcyA9IGFycmF5WzFdO1xuXG4gICAgICAgIHZhciBtdWx0aXBhcnQgPSAnYXV0byc7XG4gICAgICAgIGlmICh1LmlzU3RyaW5nKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIG9iamVjdCA9IHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1LmlzT2JqZWN0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgIGJ1Y2tldCA9IHJlc3VsdC5idWNrZXQgfHwgYnVja2V0O1xuICAgICAgICAgICAgb2JqZWN0ID0gcmVzdWx0LmtleSB8fCBvYmplY3Q7XG5cbiAgICAgICAgICAgIC8vICdhdXRvJyAvICdvZmYnXG4gICAgICAgICAgICBtdWx0aXBhcnQgPSByZXN1bHQubXVsdGlwYXJ0IHx8IG11bHRpcGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjbGllbnQgPSBzZWxmLmNsaWVudDtcbiAgICAgICAgdmFyIGV2ZW50RGlzcGF0Y2hlciA9IHNlbGY7XG4gICAgICAgIHZhciB0YXNrT3B0aW9ucyA9IHUuZXh0ZW5kKGRlZmF1bHRUYXNrT3B0aW9ucywge1xuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgICBtZXRhczogb2JqZWN0TWV0YXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIFRhc2tDb25zdHJ1Y3RvciA9IFB1dE9iamVjdFRhc2s7XG4gICAgICAgIGlmIChtdWx0aXBhcnQgPT09ICdhdXRvJ1xuICAgICAgICAgICAgLy8g5a+55LqOIG1veGllLlhNTEh0dHBSZXF1ZXN0IOadpeivtO+8jOaXoOazleiOt+WPliBnZXRSZXNwb25zZUhlYWRlcignRVRhZycpXG4gICAgICAgICAgICAvLyDlr7zoh7TlnKggY29tcGxldGVNdWx0aXBhcnRVcGxvYWQg55qE5pe25YCZ77yM5peg5rOV5Lyg6YCS5q2j56Gu55qE5Y+C5pWwXG4gICAgICAgICAgICAvLyDlm6DmraTpnIDopoHnpoHmraLkvb/nlKggbW94aWUuWE1MSHR0cFJlcXVlc3Qg5L2/55SoIE11bHRpcGFydFRhc2tcbiAgICAgICAgICAgIC8vIOmZpOmdnueUqOiHquW3seacrOWcsOiuoeeul+eahCBtZDUg5L2c5Li6IGdldFJlc3BvbnNlSGVhZGVyKCdFVGFnJykg55qE5Luj5pu/5YC877yM5LiN6L+H6L+Y5piv5pyJ5LiA5Lqb6Zeu6aKY77yaXG4gICAgICAgICAgICAvLyAxLiBNdWx0aXBhcnRUYXNrIOmcgOimgeWvueaWh+S7tui/m+ihjOWIhueJh++8jOS9huaYr+S9v+eUqCBtb3hpZS5YTUxIdHRwUmVxdWVzdCDnmoTml7blgJnvvIzmmI7mmL7mnInljaHpob/nmoTpl67popjvvIjlm6DkuLogRmxhc2gg5oqK5pW05Liq5paH5Lu26YO96K+75Y+W5Yiw5YaF5a2Y5Lit77yM54S25ZCO5YaN5YiG54mH77yJXG4gICAgICAgICAgICAvLyAgICDlr7zoh7TlpITnkIblpKfmlofku7bnmoTml7blgJnmgKfog73lvojlt65cbiAgICAgICAgICAgIC8vIDIuIOacrOWcsOiuoeeulyBtZDUg6ZyA6KaB6aKd5aSW5byV5YWl5bqT77yM5a+86Ie0IGJjZS1ib3MtdXBsb2FkZXIg55qE5L2T56ev5Y+Y5aSnXG4gICAgICAgICAgICAvLyDnu7zkuIrmiYDov7DvvIzlnKjkvb/nlKggbW94aWUg55qE5pe25YCZ77yM56aB5q2iIE11bHRpcGFydFRhc2tcbiAgICAgICAgICAgICYmIHNlbGYuX3hocjJTdXBwb3J0ZWRcbiAgICAgICAgICAgICYmIGZpbGUuc2l6ZSA+IG9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZSkge1xuICAgICAgICAgICAgVGFza0NvbnN0cnVjdG9yID0gTXVsdGlwYXJ0VGFzaztcbiAgICAgICAgfVxuICAgICAgICB2YXIgdGFzayA9IG5ldyBUYXNrQ29uc3RydWN0b3IoY2xpZW50LCBldmVudERpc3BhdGNoZXIsIHRhc2tPcHRpb25zKTtcblxuICAgICAgICBzZWxmLl91cGxvYWRpbmdGaWxlc1tmaWxlLnV1aWRdID0gZmlsZTtcblxuICAgICAgICBmaWxlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZmlsZS5fYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdGFzay5hYm9ydCgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRhc2suc2V0TmV0d29ya0luZm8oc2VsZi5fbmV0d29ya0luZm8pO1xuICAgICAgICByZXR1cm4gdGFzay5zdGFydCgpO1xuICAgIH0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBldmVudEFyZ3VtZW50cywgdGhyb3dFcnJvcnMpIHtcbiAgICBpZiAoZXZlbnROYW1lID09PSBldmVudHMua0Fib3J0ZWRcbiAgICAgICAgJiYgZXZlbnRBcmd1bWVudHNcbiAgICAgICAgJiYgZXZlbnRBcmd1bWVudHNbMV0pIHtcbiAgICAgICAgdmFyIGZpbGUgPSBldmVudEFyZ3VtZW50c1sxXTtcbiAgICAgICAgaWYgKGZpbGUuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIHZhciBsb2FkZWRTaXplID0gZmlsZS5fcHJldmlvdXNMb2FkZWQgfHwgMDtcbiAgICAgICAgICAgIHRoaXMuX25ldHdvcmtJbmZvLnRvdGFsQnl0ZXMgLT0gKGZpbGUuc2l6ZSAtIGxvYWRlZFNpemUpO1xuICAgICAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rTmV0d29ya1NwZWVkLCB0aGlzLl9uZXR3b3JrSW5mby5kdW1wKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pbnZva2UoZXZlbnROYW1lLCBldmVudEFyZ3VtZW50cywgdGhyb3dFcnJvcnMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBVcGxvYWRlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgdXRpbHMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBxc01vZHVsZSA9IHJlcXVpcmUoNDUpO1xudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgaGVscGVyID0gcmVxdWlyZSg0Mik7XG52YXIgUXVldWUgPSByZXF1aXJlKDI4KTtcbnZhciBNaW1lVHlwZSA9IHJlcXVpcmUoMjEpO1xuXG4vKipcbiAqIOaKiuaWh+S7tui/m+ihjOWIh+eJh++8jOi/lOWbnuWIh+eJh+S5i+WQjueahOaVsOe7hFxuICpcbiAqIEBwYXJhbSB7QmxvYn0gZmlsZSDpnIDopoHliIfniYfnmoTlpKfmlofku7YuXG4gKiBAcGFyYW0ge3N0cmluZ30gdXBsb2FkSWQg5LuO5pyN5Yqh6I635Y+W55qEdXBsb2FkSWQuXG4gKiBAcGFyYW0ge251bWJlcn0gY2h1bmtTaXplIOWIhueJh+eahOWkp+Wwjy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBidWNrZXQgQnVja2V0IE5hbWUuXG4gKiBAcGFyYW0ge3N0cmluZ30gb2JqZWN0IE9iamVjdCBOYW1lLlxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbmV4cG9ydHMuZ2V0VGFza3MgPSBmdW5jdGlvbiAoZmlsZSwgdXBsb2FkSWQsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QpIHtcbiAgICB2YXIgbGVmdFNpemUgPSBmaWxlLnNpemU7XG4gICAgdmFyIG9mZnNldCA9IDA7XG4gICAgdmFyIHBhcnROdW1iZXIgPSAxO1xuXG4gICAgdmFyIHRhc2tzID0gW107XG5cbiAgICB3aGlsZSAobGVmdFNpemUgPiAwKSB7XG4gICAgICAgIHZhciBwYXJ0U2l6ZSA9IE1hdGgubWluKGxlZnRTaXplLCBjaHVua1NpemUpO1xuXG4gICAgICAgIHRhc2tzLnB1c2goe1xuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIHVwbG9hZElkOiB1cGxvYWRJZCxcbiAgICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgICBwYXJ0TnVtYmVyOiBwYXJ0TnVtYmVyLFxuICAgICAgICAgICAgcGFydFNpemU6IHBhcnRTaXplLFxuICAgICAgICAgICAgc3RhcnQ6IG9mZnNldCxcbiAgICAgICAgICAgIHN0b3A6IG9mZnNldCArIHBhcnRTaXplIC0gMVxuICAgICAgICB9KTtcblxuICAgICAgICBsZWZ0U2l6ZSAtPSBwYXJ0U2l6ZTtcbiAgICAgICAgb2Zmc2V0ICs9IHBhcnRTaXplO1xuICAgICAgICBwYXJ0TnVtYmVyICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRhc2tzO1xufTtcblxuZXhwb3J0cy5nZXRBcHBlbmRhYmxlVGFza3MgPSBmdW5jdGlvbiAoZmlsZVNpemUsIG9mZnNldCwgY2h1bmtTaXplKSB7XG4gICAgdmFyIGxlZnRTaXplID0gZmlsZVNpemUgLSBvZmZzZXQ7XG4gICAgdmFyIHRhc2tzID0gW107XG5cbiAgICB3aGlsZSAobGVmdFNpemUpIHtcbiAgICAgICAgdmFyIHBhcnRTaXplID0gTWF0aC5taW4obGVmdFNpemUsIGNodW5rU2l6ZSk7XG4gICAgICAgIHRhc2tzLnB1c2goe1xuICAgICAgICAgICAgcGFydFNpemU6IHBhcnRTaXplLFxuICAgICAgICAgICAgc3RhcnQ6IG9mZnNldCxcbiAgICAgICAgICAgIHN0b3A6IG9mZnNldCArIHBhcnRTaXplIC0gMVxuICAgICAgICB9KTtcblxuICAgICAgICBsZWZ0U2l6ZSAtPSBwYXJ0U2l6ZTtcbiAgICAgICAgb2Zmc2V0ICs9IHBhcnRTaXplO1xuICAgIH1cbiAgICByZXR1cm4gdGFza3M7XG59O1xuXG5leHBvcnRzLnBhcnNlU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gICAgaWYgKHR5cGVvZiBzaXplID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICAvLyBtYiBNQiBNYiBNXG4gICAgLy8ga2IgS0Iga2Iga1xuICAgIC8vIDEwMFxuICAgIHZhciBwYXR0ZXJuID0gL14oW1xcZFxcLl0rKShbbWtnXT9iPykkL2k7XG4gICAgdmFyIG1hdGNoID0gcGF0dGVybi5leGVjKHNpemUpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgdmFyICQxID0gbWF0Y2hbMV07XG4gICAgdmFyICQyID0gbWF0Y2hbMl07XG4gICAgaWYgKC9eay9pLnRlc3QoJDIpKSB7XG4gICAgICAgIHJldHVybiAkMSAqIDEwMjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKC9ebS9pLnRlc3QoJDIpKSB7XG4gICAgICAgIHJldHVybiAkMSAqIDEwMjQgKiAxMDI0O1xuICAgIH1cbiAgICBlbHNlIGlmICgvXmcvaS50ZXN0KCQyKSkge1xuICAgICAgICByZXR1cm4gJDEgKiAxMDI0ICogMTAyNCAqIDEwMjQ7XG4gICAgfVxuICAgIHJldHVybiArJDE7XG59O1xuXG4vKipcbiAqIOWIpOaWreS4gOS4i+a1j+iniOWZqOaYr+WQpuaUr+aMgSB4aHIyIOeJueaAp++8jOWmguaenOS4jeaUr+aMge+8jOWwsSBmYWxsYmFjayDliLAgUG9zdE9iamVjdFxuICog5p2l5LiK5Lyg5paH5Lu2XG4gKlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0cy5pc1hocjJTdXBwb3J0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01vZGVybml6ci9Nb2Rlcm5penIvYmxvYi9mODM5ZTI1NzlkYTJjNjMzMWVhYWQ5MjJhZTVjZDY5MWFhYzdhYjYyL2ZlYXR1cmUtZGV0ZWN0cy9uZXR3b3JrL3hocjIuanNcbiAgICByZXR1cm4gJ1hNTEh0dHBSZXF1ZXN0JyBpbiB3aW5kb3cgJiYgJ3dpdGhDcmVkZW50aWFscycgaW4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG59O1xuXG5leHBvcnRzLmlzQXBwZW5kYWJsZSA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGhlYWRlcnNbJ3gtYmNlLW9iamVjdC10eXBlJ10gPT09ICdBcHBlbmRhYmxlJztcbn07XG5cbmV4cG9ydHMuZGVsYXkgPSBmdW5jdGlvbiAobXMpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9LCBtcyk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIOinhOiMg+WMlueUqOaIt+eahOi+k+WFpVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCBUaGUgZW5kcG9pbnQgd2lsbCBiZSBub3JtYWxpemVkXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMubm9ybWFsaXplRW5kcG9pbnQgPSBmdW5jdGlvbiAoZW5kcG9pbnQpIHtcbiAgICByZXR1cm4gZW5kcG9pbnQucmVwbGFjZSgvKFxcLyspJC8sICcnKTtcbn07XG5cbmV4cG9ydHMuZ2V0RGVmYXVsdEFDTCA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhY2Nlc3NDb250cm9sTGlzdDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlcnZpY2U6ICdiY2U6Ym9zJyxcbiAgICAgICAgICAgICAgICByZWdpb246ICcqJyxcbiAgICAgICAgICAgICAgICBlZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgcmVzb3VyY2U6IFtidWNrZXQgKyAnLyonXSxcbiAgICAgICAgICAgICAgICBwZXJtaXNzaW9uOiBbJ1JFQUQnLCAnV1JJVEUnXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfTtcbn07XG5cbi8qKlxuICog55Sf5oiQdXVpZFxuICpcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy51dWlkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByYW5kb20gPSAoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDIsIDMyKSkudG9TdHJpbmcoMzYpO1xuICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gJ3UtJyArIHRpbWVzdGFtcCArICctJyArIHJhbmRvbTtcbn07XG5cbi8qKlxuICog55Sf5oiQ5pys5ZywIGxvY2FsU3RvcmFnZSDkuK3nmoRrZXnvvIzmnaXlrZjlgqggdXBsb2FkSWRcbiAqIGxvY2FsU3RvcmFnZVtrZXldID0gdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uIOS4gOS6m+WPr+S7peeUqOadpeiuoeeul2tleeeahOWPguaVsC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBnZW5lcmF0b3Ig5YaF572u55qE5Y+q5pyJIGRlZmF1bHQg5ZKMIG1kNVxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuZXhwb3J0cy5nZW5lcmF0ZUxvY2FsS2V5ID0gZnVuY3Rpb24gKG9wdGlvbiwgZ2VuZXJhdG9yKSB7XG4gICAgaWYgKGdlbmVyYXRvciA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoW1xuICAgICAgICAgICAgb3B0aW9uLmJsb2IubmFtZSwgb3B0aW9uLmJsb2Iuc2l6ZSxcbiAgICAgICAgICAgIG9wdGlvbi5jaHVua1NpemUsIG9wdGlvbi5idWNrZXQsXG4gICAgICAgICAgICBvcHRpb24ub2JqZWN0XG4gICAgICAgIF0uam9pbignJicpKTtcbiAgICB9XG4gICAgcmV0dXJuIFEucmVzb2x2ZShudWxsKTtcbn07XG5cbmV4cG9ydHMuZ2V0RGVmYXVsdFBvbGljeSA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICBpZiAoYnVja2V0ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgLy8g6buY6K6k5pivIDI05bCP5pe2IOS5i+WQjuWIsOacn1xuICAgIHZhciBleHBpcmF0aW9uID0gbmV3IERhdGUobm93ICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgdmFyIHV0Y0RhdGVUaW1lID0gaGVscGVyLnRvVVRDU3RyaW5nKGV4cGlyYXRpb24pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXhwaXJhdGlvbjogdXRjRGF0ZVRpbWUsXG4gICAgICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgICAgICAgIHtidWNrZXQ6IGJ1Y2tldH1cbiAgICAgICAgXVxuICAgIH07XG59O1xuXG4vKipcbiAqIOagueaNrmtleeiOt+WPlmxvY2FsU3RvcmFnZeS4reeahHVwbG9hZElkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSDpnIDopoHmn6Xor6LnmoRrZXlcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5nZXRVcGxvYWRJZCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbn07XG5cblxuLyoqXG4gKiDmoLnmja5rZXnorr7nva5sb2NhbFN0b3JhZ2XkuK3nmoR1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkg6ZyA6KaB5p+l6K+i55qEa2V5XG4gKiBAcGFyYW0ge3N0cmluZ30gdXBsb2FkSWQg6ZyA6KaB6K6+572u55qEdXBsb2FkSWRcbiAqL1xuZXhwb3J0cy5zZXRVcGxvYWRJZCA9IGZ1bmN0aW9uIChrZXksIHVwbG9hZElkKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB1cGxvYWRJZCk7XG59O1xuXG4vKipcbiAqIOagueaNrmtleeWIoOmZpGxvY2FsU3RvcmFnZeS4reeahHVwbG9hZElkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSDpnIDopoHmn6Xor6LnmoRrZXlcbiAqL1xuZXhwb3J0cy5yZW1vdmVVcGxvYWRJZCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xufTtcblxuLyoqXG4gKiDlj5blvpflt7LkuIrkvKDliIblnZfnmoRldGFnXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHBhcnROdW1iZXIg5YiG54mH5bqP5Y+3LlxuICogQHBhcmFtIHtBcnJheX0gZXhpc3RQYXJ0cyDlt7LkuIrkvKDlrozmiJDnmoTliIbniYfkv6Hmga8uXG4gKiBAcmV0dXJuIHtzdHJpbmd9IOaMh+WumuWIhueJh+eahGV0YWdcbiAqL1xuZnVuY3Rpb24gZ2V0UGFydEV0YWcocGFydE51bWJlciwgZXhpc3RQYXJ0cykge1xuICAgIHZhciBtYXRjaFBhcnRzID0gdS5maWx0ZXIoZXhpc3RQYXJ0cyB8fCBbXSwgZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgcmV0dXJuICtwYXJ0LnBhcnROdW1iZXIgPT09IHBhcnROdW1iZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuIG1hdGNoUGFydHMubGVuZ3RoID8gbWF0Y2hQYXJ0c1swXS5lVGFnIDogbnVsbDtcbn1cblxuLyoqXG4gKiDlm6DkuLogbGlzdFBhcnRzIOS8mui/lOWbniBwYXJ0TnVtYmVyIOWSjCBldGFnIOeahOWvueW6lOWFs+ezu1xuICog5omA5LulIGxpc3RQYXJ0cyDov5Tlm57nmoTnu5PmnpzvvIznu5kgdGFza3Mg5Lit5ZCI6YCC55qE5YWD57Sg6K6+572uIGV0YWcg5bGe5oCn77yM5LiK5LygXG4gKiDnmoTml7blgJnlsLHlj6/ku6Xot7Pov4fov5nkupsgcGFydFxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IHRhc2tzIOacrOWcsOWIh+WIhuWlveeahOS7u+WKoS5cbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD59IHBhcnRzIOacjeWKoeerr+i/lOWbnueahOW3sue7j+S4iuS8oOeahHBhcnRzLlxuICovXG5leHBvcnRzLmZpbHRlclRhc2tzID0gZnVuY3Rpb24gKHRhc2tzLCBwYXJ0cykge1xuICAgIHUuZWFjaCh0YXNrcywgZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgdmFyIHBhcnROdW1iZXIgPSB0YXNrLnBhcnROdW1iZXI7XG4gICAgICAgIHZhciBldGFnID0gZ2V0UGFydEV0YWcocGFydE51bWJlciwgcGFydHMpO1xuICAgICAgICBpZiAoZXRhZykge1xuICAgICAgICAgICAgdGFzay5ldGFnID0gZXRhZztcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuLyoqXG4gKiDmiornlKjmiLfovpPlhaXnmoTphY3nva7ovazljJbmiJAgaHRtbDUg5ZKMIGZsYXNoIOWPr+S7peaOpeaUtueahOWGheWuuS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xBcnJheX0gYWNjZXB0IOaUr+aMgeaVsOe7hOWSjOWtl+espuS4sueahOmFjee9rlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmV4cGFuZEFjY2VwdCA9IGZ1bmN0aW9uIChhY2NlcHQpIHtcbiAgICB2YXIgZXh0cyA9IFtdO1xuXG4gICAgaWYgKHUuaXNBcnJheShhY2NlcHQpKSB7XG4gICAgICAgIC8vIEZsYXNo6KaB5rGC55qE5qC85byPXG4gICAgICAgIHUuZWFjaChhY2NlcHQsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5leHRlbnNpb25zKSB7XG4gICAgICAgICAgICAgICAgZXh0cy5wdXNoLmFwcGx5KGV4dHMsIGl0ZW0uZXh0ZW5zaW9ucy5zcGxpdCgnLCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHUuaXNTdHJpbmcoYWNjZXB0KSkge1xuICAgICAgICBleHRzID0gYWNjZXB0LnNwbGl0KCcsJyk7XG4gICAgfVxuXG4gICAgLy8g5Li65LqG5L+d6K+B5YW85a655oCn77yM5oqKIG1pbWVUeXBlcyDlkowgZXh0cyDpg73ov5Tlm57lm57ljrtcbiAgICBleHRzID0gdS5tYXAoZXh0cywgZnVuY3Rpb24gKGV4dCkge1xuICAgICAgICByZXR1cm4gL15cXC4vLnRlc3QoZXh0KSA/IGV4dCA6ICgnLicgKyBleHQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGV4dHMuam9pbignLCcpO1xufTtcblxuZXhwb3J0cy5leHRUb01pbWVUeXBlID0gZnVuY3Rpb24gKGV4dHMpIHtcbiAgICB2YXIgbWltZVR5cGVzID0gdS5tYXAoZXh0cy5zcGxpdCgnLCcpLCBmdW5jdGlvbiAoZXh0KSB7XG4gICAgICAgIGlmIChleHQuaW5kZXhPZignLycpICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGV4dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWltZVR5cGUuZ3Vlc3MoZXh0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBtaW1lVHlwZXMuam9pbignLCcpO1xufTtcblxuZXhwb3J0cy5leHBhbmRBY2NlcHRUb0FycmF5ID0gZnVuY3Rpb24gKGFjY2VwdCkge1xuICAgIGlmICghYWNjZXB0IHx8IHUuaXNBcnJheShhY2NlcHQpKSB7XG4gICAgICAgIHJldHVybiBhY2NlcHQ7XG4gICAgfVxuXG4gICAgaWYgKHUuaXNTdHJpbmcoYWNjZXB0KSkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAge3RpdGxlOiAnQWxsIGZpbGVzJywgZXh0ZW5zaW9uczogYWNjZXB0fVxuICAgICAgICBdO1xuICAgIH1cblxuICAgIHJldHVybiBbXTtcbn07XG5cbi8qKlxuICog6L2s5YyW5LiA5LiLIGJvcyB1cmwg55qE5qC85byPXG4gKiBodHRwOi8vYmouYmNlYm9zLmNvbS92MS8ke2J1Y2tldH0vJHtvYmplY3R9IC0+IGh0dHA6Ly8ke2J1Y2tldH0uYmouYmNlYm9zLmNvbS92MS8ke29iamVjdH1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIOmcgOimgei9rOWMlueahFVSTC5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy50cmFuc2Zvcm1VcmwgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgdmFyIHBhdHRlcm4gPSAvKGh0dHBzPzopXFwvXFwvKFteXFwvXSspXFwvKFteXFwvXSspXFwvKFteXFwvXSspLztcbiAgICByZXR1cm4gdXJsLnJlcGxhY2UocGF0dGVybiwgZnVuY3Rpb24gKF8sIHByb3RvY29sLCBob3N0LCAkMywgJDQpIHtcbiAgICAgICAgaWYgKC9edlxcZCQvLnRlc3QoJDMpKSB7XG4gICAgICAgICAgICAvLyAvdjEvJHtidWNrZXR9Ly4uLlxuICAgICAgICAgICAgcmV0dXJuIHByb3RvY29sICsgJy8vJyArICQ0ICsgJy4nICsgaG9zdCArICcvJyArICQzO1xuICAgICAgICB9XG4gICAgICAgIC8vIC8ke2J1Y2tldH0vLi4uXG4gICAgICAgIHJldHVybiBwcm90b2NvbCArICcvLycgKyAkMyArICcuJyArIGhvc3QgKyAnLycgKyAkNDtcbiAgICB9KTtcbn07XG5cbmV4cG9ydHMuaXNCbG9iID0gZnVuY3Rpb24gKGJvZHkpIHtcbiAgICB2YXIgYmxvYkN0b3IgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyBDaHJvbWUgQmxvYiA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAvLyBTYWZhcmkgQmxvYiA9PT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgYmxvYkN0b3IgPSBCbG9iO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbU94aWUgIT09ICd1bmRlZmluZWQnICYmIHUuaXNGdW5jdGlvbihtT3hpZS5CbG9iKSkge1xuICAgICAgICBibG9iQ3RvciA9IG1PeGllLkJsb2I7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvZHkgaW5zdGFuY2VvZiBibG9iQ3Rvcjtcbn07XG5cbmV4cG9ydHMubm93ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG5cbmV4cG9ydHMudG9ESE1TID0gZnVuY3Rpb24gKHNlY29uZHMpIHtcbiAgICB2YXIgZGF5cyA9IDA7XG4gICAgdmFyIGhvdXJzID0gMDtcbiAgICB2YXIgbWludXRlcyA9IDA7XG5cbiAgICBpZiAoc2Vjb25kcyA+PSA2MCkge1xuICAgICAgICBtaW51dGVzID0gfn4oc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgc2Vjb25kcyA9IHNlY29uZHMgLSBtaW51dGVzICogNjA7XG4gICAgfVxuXG4gICAgaWYgKG1pbnV0ZXMgPj0gNjApIHtcbiAgICAgICAgaG91cnMgPSB+fihtaW51dGVzIC8gNjApO1xuICAgICAgICBtaW51dGVzID0gbWludXRlcyAtIGhvdXJzICogNjA7XG4gICAgfVxuXG4gICAgaWYgKGhvdXJzID49IDI0KSB7XG4gICAgICAgIGRheXMgPSB+fihob3VycyAvIDI0KTtcbiAgICAgICAgaG91cnMgPSBob3VycyAtIGRheXMgKiAyNDtcbiAgICB9XG5cbiAgICByZXR1cm4ge0REOiBkYXlzLCBISDogaG91cnMsIE1NOiBtaW51dGVzLCBTUzogc2Vjb25kc307XG59O1xuXG5mdW5jdGlvbiBwYXJzZUhvc3QodXJsKSB7XG4gICAgdmFyIG1hdGNoID0gL15cXHcrOlxcL1xcLyhbXlxcL10rKS8uZXhlYyh1cmwpO1xuICAgIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXTtcbn1cblxuZXhwb3J0cy5maXhYaHIgPSBmdW5jdGlvbiAob3B0aW9ucywgaXNCb3MpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLCBjb25maWcpIHtcbiAgICAgICAgdmFyIGNsaWVudCA9IHRoaXM7XG4gICAgICAgIHZhciBlbmRwb2ludEhvc3QgPSBwYXJzZUhvc3QoY29uZmlnLmVuZHBvaW50KTtcblxuICAgICAgICAvLyB4LWJjZS1kYXRlIOWSjCBEYXRlIOS6jOmAieS4gO+8jOaYr+W/hemhu+eahFxuICAgICAgICAvLyDkvYbmmK8gRmxhc2gg5peg5rOV6K6+572uIERhdGXvvIzlm6DmraTlv4Xpobvorr7nva4geC1iY2UtZGF0ZVxuICAgICAgICBhcmdzLmhlYWRlcnNbJ3gtYmNlLWRhdGUnXSA9IGhlbHBlci50b1VUQ1N0cmluZyhuZXcgRGF0ZSgpKTtcbiAgICAgICAgYXJncy5oZWFkZXJzLmhvc3QgPSBlbmRwb2ludEhvc3Q7XG5cbiAgICAgICAgLy8gRmxhc2gg55qE57yT5a2Y6LKM5Ly85q+U6L6D5Y6J5a6z77yM5by65Yi26K+35rGC5paw55qEXG4gICAgICAgIC8vIFhYWCDlpb3lg4/mnI3liqHlmajnq6/kuI3kvJrmioogLnN0YW1wIOi/meS4quWPguaVsOWKoOWFpeWIsOetvuWQjeeahOiuoeeul+mAu+i+kemHjOmdouWOu1xuICAgICAgICBhcmdzLnBhcmFtc1snLnN0YW1wJ10gPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICAvLyDlj6rmnIkgUFVUIOaJjeS8muinpuWPkSBwcm9ncmVzcyDkuovku7ZcbiAgICAgICAgdmFyIG9yaWdpbmFsSHR0cE1ldGhvZCA9IGh0dHBNZXRob2Q7XG5cbiAgICAgICAgaWYgKGh0dHBNZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICAgICAgICAvLyBQdXRPYmplY3QgUHV0UGFydHMg6YO95Y+v5Lul55SoIFBPU1Qg5Y2P6K6u77yM6ICM5LiUIEZsYXNoIOS5n+WPquiDveeUqCBQT1NUIOWNj+iurlxuICAgICAgICAgICAgaHR0cE1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB4aHJVcmk7XG4gICAgICAgIHZhciB4aHJNZXRob2QgPSBodHRwTWV0aG9kO1xuICAgICAgICB2YXIgeGhyQm9keSA9IGFyZ3MuYm9keTtcbiAgICAgICAgaWYgKGh0dHBNZXRob2QgPT09ICdIRUFEJykge1xuICAgICAgICAgICAgLy8g5Zug5Li6IEZsYXNoIOeahCBVUkxSZXF1ZXN0IOWPquiDveWPkemAgSBHRVQg5ZKMIFBPU1Qg6K+35rGCXG4gICAgICAgICAgICAvLyBnZXRPYmplY3RNZXRh6ZyA6KaB55SoSEVBROivt+axgu+8jOS9huaYryBGbGFzaCDml6Dms5Xlj5Hotbfov5nnp43or7fmsYJcbiAgICAgICAgICAgIC8vIOaJgOmcgOmcgOimgeeUqCByZWxheSDkuK3ovazkuIDkuItcbiAgICAgICAgICAgIC8vIFhYWCDlm6DkuLogYnVja2V0IOS4jeWPr+iDveaYryBwcml2YXRl77yM5ZCm5YiZIGNyb3NzZG9tYWluLnhtbCDmmK/ml6Dms5Xor7vlj5bnmoRcbiAgICAgICAgICAgIC8vIOaJgOS7pei/meS4quaOpeWPo+ivt+axgueahOaXtuWAme+8jOWPr+S7peS4jemcgOimgSBhdXRob3JpemF0aW9uIOWtl+autVxuICAgICAgICAgICAgdmFyIHJlbGF5U2VydmVyID0gZXhwb3J0cy5ub3JtYWxpemVFbmRwb2ludChvcHRpb25zLmJvc19yZWxheV9zZXJ2ZXIpO1xuICAgICAgICAgICAgeGhyVXJpID0gcmVsYXlTZXJ2ZXIgKyAnLycgKyBlbmRwb2ludEhvc3QgKyByZXNvdXJjZTtcblxuICAgICAgICAgICAgYXJncy5wYXJhbXMuaHR0cE1ldGhvZCA9IGh0dHBNZXRob2Q7XG5cbiAgICAgICAgICAgIHhock1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc0JvcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgeGhyVXJpID0gZXhwb3J0cy50cmFuc2Zvcm1VcmwoY29uZmlnLmVuZHBvaW50ICsgcmVzb3VyY2UpO1xuICAgICAgICAgICAgcmVzb3VyY2UgPSB4aHJVcmkucmVwbGFjZSgvXlxcdys6XFwvXFwvW15cXC9dK1xcLy8sICcvJyk7XG4gICAgICAgICAgICBhcmdzLmhlYWRlcnMuaG9zdCA9IHBhcnNlSG9zdCh4aHJVcmkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeGhyVXJpID0gY29uZmlnLmVuZHBvaW50ICsgcmVzb3VyY2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoeGhyTWV0aG9kID09PSAnUE9TVCcgJiYgIXhockJvZHkpIHtcbiAgICAgICAgICAgIC8vIOW/hemhu+imgeaciSBCT0RZIOaJjeiDveaYryBQT1NU77yM5ZCm5YiZ5L2g6K6+572u5LqG5Lmf5rKh5pyJXG4gICAgICAgICAgICAvLyDogIzkuJTlv4XpobvmmK8gUE9TVCDmiY3lj6/ku6Xorr7nva7oh6rlrprkuYnnmoRoZWFkZXLvvIxHRVTkuI3ooYxcbiAgICAgICAgICAgIHhockJvZHkgPSAne1wiRk9SQ0VfUE9TVFwiOiB0cnVlfSc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICAgICAgdmFyIHhociA9IG5ldyBtT3hpZS5YTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlIHx8ICd7fScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICBpZiAoaHR0cE1ldGhvZCA9PT0gJ0hFQUQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogcmVzcG9uc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzX2NvZGU6IHhoci5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlc3BvbnNlLm1lc3NhZ2UgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IHJlc3BvbnNlLmNvZGUgfHwgJycsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RfaWQ6IHJlc3BvbnNlLnJlcXVlc3RJZCB8fCAnJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh4aHIudXBsb2FkKSB7XG4gICAgICAgICAgICAvLyBGSVhNRSjliIbniYfkuIrkvKDnmoTpgLvovpHlkox4eHjnmoTpgLvovpHkuI3kuIDmoLcpXG4gICAgICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbEh0dHBNZXRob2QgPT09ICdQVVQnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBPU1QsIEhFQUQsIEdFVCDkuYvnsbvnmoTkuI3pnIDopoHop6blj5EgcHJvZ3Jlc3Mg5LqL5Lu2XG4gICAgICAgICAgICAgICAgICAgIC8vIOWQpuWImeWvvOiHtOmhtemdoueahOmAu+i+kea3t+S5sVxuICAgICAgICAgICAgICAgICAgICBlLmxlbmd0aENvbXB1dGFibGUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBodHRwQ29udGV4dCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBNZXRob2Q6IG9yaWdpbmFsSHR0cE1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlOiByZXNvdXJjZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHhocjogeGhyXG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVtaXQoJ3Byb2dyZXNzJywgZSwgaHR0cENvbnRleHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHJvbWlzZSA9IGNsaWVudC5jcmVhdGVTaWduYXR1cmUoY2xpZW50LmNvbmZpZy5jcmVkZW50aWFscyxcbiAgICAgICAgICAgIGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLnBhcmFtcywgYXJncy5oZWFkZXJzKTtcbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChhdXRob3JpemF0aW9uLCB4YmNlRGF0ZSkge1xuICAgICAgICAgICAgaWYgKGF1dGhvcml6YXRpb24pIHtcbiAgICAgICAgICAgICAgICBhcmdzLmhlYWRlcnMuYXV0aG9yaXphdGlvbiA9IGF1dGhvcml6YXRpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4YmNlRGF0ZSkge1xuICAgICAgICAgICAgICAgIGFyZ3MuaGVhZGVyc1sneC1iY2UtZGF0ZSddID0geGJjZURhdGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBxcyA9IHFzTW9kdWxlLnN0cmluZ2lmeShhcmdzLnBhcmFtcyk7XG4gICAgICAgICAgICBpZiAocXMpIHtcbiAgICAgICAgICAgICAgICB4aHJVcmkgKz0gJz8nICsgcXM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhoci5vcGVuKHhock1ldGhvZCwgeGhyVXJpLCB0cnVlKTtcblxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGFyZ3MuaGVhZGVycykge1xuICAgICAgICAgICAgICAgIGlmICghYXJncy5oZWFkZXJzLmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgICAgICAgICAgICAgfHwgLyhob3N0fGNvbnRlbnRcXC1sZW5ndGgpL2kudGVzdChrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcmdzLmhlYWRlcnNba2V5XTtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLnNlbmQoeGhyQm9keSwge1xuICAgICAgICAgICAgICAgIHJ1bnRpbWVfb3JkZXI6ICdmbGFzaCcsXG4gICAgICAgICAgICAgICAgc3dmX3VybDogb3B0aW9ucy5mbGFzaF9zd2ZfdXJsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufTtcblxuXG5leHBvcnRzLmVhY2hMaW1pdCA9IGZ1bmN0aW9uICh0YXNrcywgdGFza1BhcmFsbGVsLCBleGVjdXRlciwgZG9uZSkge1xuICAgIHZhciBydW5uaW5nQ291bnQgPSAwO1xuICAgIHZhciBhYm9ydGVkID0gZmFsc2U7XG4gICAgdmFyIGZpbiA9IGZhbHNlOyAgICAgIC8vIGRvbmUg5Y+q6IO96KKr6LCD55So5LiA5qyhLlxuICAgIHZhciBxdWV1ZSA9IG5ldyBRdWV1ZSh0YXNrcyk7XG5cbiAgICBmdW5jdGlvbiBpbmZpbml0ZUxvb3AoKSB7XG4gICAgICAgIHZhciB0YXNrID0gcXVldWUuZGVxdWV1ZSgpO1xuICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJ1bm5pbmdDb3VudCsrO1xuICAgICAgICBleGVjdXRlcih0YXNrLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJ1bm5pbmdDb3VudC0tO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAvLyDkuIDml6bmnInmiqXplJnvvIznu4jmraLov5DooYxcbiAgICAgICAgICAgICAgICBhYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGRvbmUoZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFxdWV1ZS5pc0VtcHR5KCkgJiYgIWFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6Zif5YiX6L+Y5pyJ5YaF5a65XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoaW5maW5pdGVMb29wLCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocnVubmluZ0NvdW50IDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6Zif5YiX56m65LqG77yM6ICM5LiU5rKh5pyJ6L+Q6KGM5Lit55qE5Lu75Yqh5LqGXG4gICAgICAgICAgICAgICAgICAgIGlmICghZmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0YXNrUGFyYWxsZWwgPSBNYXRoLm1pbih0YXNrUGFyYWxsZWwsIHF1ZXVlLnNpemUoKSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXNrUGFyYWxsZWw7IGkrKykge1xuICAgICAgICBpbmZpbml0ZUxvb3AoKTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmluaGVyaXRzID0gZnVuY3Rpb24gKENoaWxkQ3RvciwgUGFyZW50Q3Rvcikge1xuICAgIHJldHVybiByZXF1aXJlKDQ3KS5pbmhlcml0cyhDaGlsZEN0b3IsIFBhcmVudEN0b3IpO1xufTtcblxuZXhwb3J0cy5ndWVzc0NvbnRlbnRUeXBlID0gZnVuY3Rpb24gKGZpbGUsIG9wdF9pZ25vcmVDaGFyc2V0KSB7XG4gICAgdmFyIGNvbnRlbnRUeXBlID0gZmlsZS50eXBlO1xuICAgIGlmICghY29udGVudFR5cGUpIHtcbiAgICAgICAgdmFyIG9iamVjdCA9IGZpbGUubmFtZTtcbiAgICAgICAgdmFyIGV4dCA9IG9iamVjdC5zcGxpdCgvXFwuL2cpLnBvcCgpO1xuICAgICAgICBjb250ZW50VHlwZSA9IE1pbWVUeXBlLmd1ZXNzKGV4dCk7XG4gICAgfVxuXG4gICAgLy8gRmlyZWZveOWcqFBPU1TnmoTml7blgJnvvIxDb250ZW50LVR5cGUg5LiA5a6a5Lya5pyJQ2hhcnNldOeahO+8jOWboOatpFxuICAgIC8vIOi/memHjOS4jeeuoTM3MjHvvIzpg73liqDkuIouXG4gICAgaWYgKCFvcHRfaWdub3JlQ2hhcnNldCAmJiAhL2NoYXJzZXQ9Ly50ZXN0KGNvbnRlbnRUeXBlKSkge1xuICAgICAgICBjb250ZW50VHlwZSArPSAnOyBjaGFyc2V0PVVURi04JztcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudFR5cGU7XG59O1xuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvQnVmZmVyLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKipcbiAqIEJ1ZmZlclxuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBCdWZmZXIoKSB7XG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU1MTU4Njkvc3RyaW5nLWxlbmd0aC1pbi1ieXRlcy1pbi1qYXZhc2NyaXB0XG4gICAgdmFyIG0gPSBlbmNvZGVVUklDb21wb25lbnQoZGF0YSkubWF0Y2goLyVbODlBQmFiXS9nKTtcbiAgICByZXR1cm4gZGF0YS5sZW5ndGggKyAobSA/IG0ubGVuZ3RoIDogMCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1ZmZlcjtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSBQcm9taXNlLmpzXG4gKiBAYXV0aG9yID8/XG4gKi9cblxuKGZ1bmN0aW9uIChyb290KSB7XG5cbiAgICAvLyBTdG9yZSBzZXRUaW1lb3V0IHJlZmVyZW5jZSBzbyBwcm9taXNlLXBvbHlmaWxsIHdpbGwgYmUgdW5hZmZlY3RlZCBieVxuICAgIC8vIG90aGVyIGNvZGUgbW9kaWZ5aW5nIHNldFRpbWVvdXQgKGxpa2Ugc2lub24udXNlRmFrZVRpbWVycygpKVxuICAgIHZhciBzZXRUaW1lb3V0RnVuYyA9IHNldFRpbWVvdXQ7XG5cbiAgICBmdW5jdGlvbiBub29wKCkge1xuICAgIH1cblxuICAgIC8vIFBvbHlmaWxsIGZvciBGdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuICAgIGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZuLmFwcGx5KHRoaXNBcmcsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGV4ZWN1dG9yLlxuICAgICAqIEBjbGFzc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIFByb21pc2UoZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc3RhdGUgPSAwO1xuICAgICAgICB0aGlzLl9oYW5kbGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9kZWZlcnJlZHMgPSBbXTtcblxuICAgICAgICBkb1Jlc29sdmUoZm4sIHRoaXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhhbmRsZShzZWxmLCBkZWZlcnJlZCkge1xuICAgICAgICB3aGlsZSAoc2VsZi5fc3RhdGUgPT09IDMpIHtcbiAgICAgICAgICAgIHNlbGYgPSBzZWxmLl92YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZi5fc3RhdGUgPT09IDApIHtcbiAgICAgICAgICAgIHNlbGYuX2RlZmVycmVkcy5wdXNoKGRlZmVycmVkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuX2hhbmRsZWQgPSB0cnVlO1xuICAgICAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2IgPSBzZWxmLl9zdGF0ZSA9PT0gMSA/IGRlZmVycmVkLm9uRnVsZmlsbGVkIDogZGVmZXJyZWQub25SZWplY3RlZDtcbiAgICAgICAgICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIChzZWxmLl9zdGF0ZSA9PT0gMSA/IHJlc29sdmUgOiByZWplY3QpKGRlZmVycmVkLnByb21pc2UsIHNlbGYuX3ZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZXQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldCA9IGNiKHNlbGYuX3ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIGUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlc29sdmUoZGVmZXJyZWQucHJvbWlzZSwgcmV0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZShzZWxmLCBuZXdWYWx1ZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gUHJvbWlzZSBSZXNvbHV0aW9uIFByb2NlZHVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Byb21pc2VzLWFwbHVzL3Byb21pc2VzLXNwZWMjdGhlLXByb21pc2UtcmVzb2x1dGlvbi1wcm9jZWR1cmVcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gc2VsZikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgcHJvbWlzZSBjYW5ub3QgYmUgcmVzb2x2ZWQgd2l0aCBpdHNlbGYuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAmJiAodHlwZW9mIG5ld1ZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoZW4gPSBuZXdWYWx1ZS50aGVuO1xuICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fc3RhdGUgPSAzO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9SZXNvbHZlKGJpbmQodGhlbiwgbmV3VmFsdWUpLCBzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5fc3RhdGUgPSAxO1xuICAgICAgICAgICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KHNlbGYsIGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVqZWN0KHNlbGYsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHNlbGYuX3N0YXRlID0gMjtcbiAgICAgICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmFsZShzZWxmKSB7XG4gICAgICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMiAmJiBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLl9oYW5kbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuKHNlbGYuX3ZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHNlbGYuX2RlZmVycmVkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaGFuZGxlKHNlbGYsIHNlbGYuX2RlZmVycmVkc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZi5fZGVmZXJyZWRzID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVyXG4gICAgICpcbiAgICAgKiBAY2xhc3NcbiAgICAgKiBAcGFyYW0geyp9IG9uRnVsZmlsbGVkIFRoZSBvbkZ1bGZpbGxlZC5cbiAgICAgKiBAcGFyYW0geyp9IG9uUmVqZWN0ZWQgVGhlIG9uUmVqZWN0ZWQuXG4gICAgICogQHBhcmFtIHsqfSBwcm9taXNlIFRoZSBwcm9taXNlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb21pc2UpIHtcbiAgICAgICAgdGhpcy5vbkZ1bGZpbGxlZCA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogbnVsbDtcbiAgICAgICAgdGhpcy5vblJlamVjdGVkID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicgPyBvblJlamVjdGVkIDogbnVsbDtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUYWtlIGEgcG90ZW50aWFsbHkgbWlzYmVoYXZpbmcgcmVzb2x2ZXIgZnVuY3Rpb24gYW5kIG1ha2Ugc3VyZVxuICAgICAqIG9uRnVsZmlsbGVkIGFuZCBvblJlamVjdGVkIGFyZSBvbmx5IGNhbGxlZCBvbmNlLlxuICAgICAqXG4gICAgICogTWFrZXMgbm8gZ3VhcmFudGVlcyBhYm91dCBhc3luY2hyb255LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZuLlxuICAgICAqIEBwYXJhbSB7Kn0gc2VsZiBUaGUgY29udGV4dC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBkb1Jlc29sdmUoZm4sIHNlbGYpIHtcbiAgICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHNlbGYsIHZhbHVlKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHNlbGYsIHJlYXNvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHJlamVjdChzZWxmLCBleCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBQcm9taXNlLnByb3RvdHlwZVtcImNhdGNoXCJdID0gZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHsgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gICAgfTtcblxuICAgIFByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHsgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIHZhciBwcm9tID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yKShub29wKTtcblxuICAgICAgICBoYW5kbGUodGhpcywgbmV3IEhhbmRsZXIob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIHByb20pKTtcbiAgICAgICAgcmV0dXJuIHByb207XG4gICAgfTtcblxuICAgIFByb21pc2UuYWxsID0gZnVuY3Rpb24gKGFycikge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFycik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IGFyZ3MubGVuZ3RoO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiByZXMoaSwgdmFsKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbCAmJiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGVuID0gdmFsLnRoZW47XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGVuLmNhbGwodmFsLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyhpLCB2YWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJlamVjdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKC0tcmVtYWluaW5nID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXMoaSwgYXJnc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBQcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuY29uc3RydWN0b3IgPT09IFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBQcm9taXNlLnJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgcmVqZWN0KHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFByb21pc2UucmFjZSA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB2YWx1ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNbaV0udGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG4gICAgUHJvbWlzZS5faW1tZWRpYXRlRm4gPSAodHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICB9KSB8fCBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgc2V0VGltZW91dEZ1bmMoZm4sIDApO1xuICAgIH07XG5cbiAgICBQcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF91bmhhbmRsZWRSZWplY3Rpb25GbihlcnIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1Bvc3NpYmxlIFVuaGFuZGxlZCBQcm9taXNlIFJlamVjdGlvbjonLCBlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgaW1tZWRpYXRlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgY2FsbGJhY2tzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBleGVjdXRlXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBQcm9taXNlLl9zZXRJbW1lZGlhdGVGbiA9IGZ1bmN0aW9uIF9zZXRJbW1lZGlhdGVGbihmbikge1xuICAgICAgICBQcm9taXNlLl9pbW1lZGlhdGVGbiA9IGZuO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gdW5oYW5kbGVkIHJlamVjdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiB1bmhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBQcm9taXNlLl9zZXRVbmhhbmRsZWRSZWplY3Rpb25GbiA9IGZ1bmN0aW9uIF9zZXRVbmhhbmRsZWRSZWplY3Rpb25Gbihmbikge1xuICAgICAgICBQcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbiA9IGZuO1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuICAgIH1cbiAgICBlbHNlIGlmICghcm9vdC5Qcm9taXNlKSB7XG4gICAgICAgIHJvb3QuUHJvbWlzZSA9IFByb21pc2U7XG4gICAgfVxuXG59KSh0aGlzKTtcbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL2FzeW5jLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG5leHBvcnRzLm1hcExpbWl0ID0gcmVxdWlyZSgyKTtcbiIsIi8qKlxuICogQGZpbGUgY29yZS5qc1xuICogQGF1dGhvciA/Pz9cbiAqL1xuXG4vKipcbiAqIExvY2FsIHBvbHlmaWwgb2YgT2JqZWN0LmNyZWF0ZVxuICovXG52YXIgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEYoKSB7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICB2YXIgc3VidHlwZTtcblxuICAgICAgICBGLnByb3RvdHlwZSA9IG9iajtcblxuICAgICAgICBzdWJ0eXBlID0gbmV3IEYoKTtcblxuICAgICAgICBGLnByb3RvdHlwZSA9IG51bGw7XG5cbiAgICAgICAgcmV0dXJuIHN1YnR5cGU7XG4gICAgfTtcbn0oKSk7XG5cbi8qKlxuICogQ3J5cHRvSlMgbmFtZXNwYWNlLlxuICovXG52YXIgQyA9IHt9O1xuXG4vKipcbiAqIEFsZ29yaXRobSBuYW1lc3BhY2UuXG4gKi9cbnZhciBDX2FsZ28gPSBDLmFsZ28gPSB7fTtcblxuLyoqXG4gKiBMaWJyYXJ5IG5hbWVzcGFjZS5cbiAqL1xudmFyIENfbGliID0gQy5saWIgPSB7fTtcblxuLyoqXG4gICogQmFzZSBvYmplY3QgZm9yIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UuXG4gICovXG52YXIgQmFzZSA9IENfbGliLkJhc2UgPSAoZnVuY3Rpb24gKCkge1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICAvKipcbiAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGlzIG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3ZlcnJpZGVzIFByb3BlcnRpZXMgdG8gY29weSBpbnRvIHRoZSBuZXcgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgICpcbiAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgIHZhciBNeVR5cGUgPSBDcnlwdG9KUy5saWIuQmFzZS5leHRlbmQoe1xuICAgICAgICAgICogICAgICAgICBmaWVsZDogJ3ZhbHVlJyxcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgICAgIG1ldGhvZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICogICAgICAgICB9XG4gICAgICAgICAgKiAgICAgfSk7XG4gICAgICAgICAgKi9cbiAgICAgICAgZXh0ZW5kOiBmdW5jdGlvbiAob3ZlcnJpZGVzKSB7XG4gICAgICAgICAgICAvLyBTcGF3blxuICAgICAgICAgICAgdmFyIHN1YnR5cGUgPSBjcmVhdGUodGhpcyk7XG5cbiAgICAgICAgICAgIC8vIEF1Z21lbnRcbiAgICAgICAgICAgIGlmIChvdmVycmlkZXMpIHtcbiAgICAgICAgICAgICAgICBzdWJ0eXBlLm1peEluKG92ZXJyaWRlcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBkZWZhdWx0IGluaXRpYWxpemVyXG4gICAgICAgICAgICBpZiAoIXN1YnR5cGUuaGFzT3duUHJvcGVydHkoJ2luaXQnKSB8fCB0aGlzLmluaXQgPT09IHN1YnR5cGUuaW5pdCkge1xuICAgICAgICAgICAgICAgIHN1YnR5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEluaXRpYWxpemVyJ3MgcHJvdG90eXBlIGlzIHRoZSBzdWJ0eXBlIG9iamVjdFxuICAgICAgICAgICAgc3VidHlwZS5pbml0LnByb3RvdHlwZSA9IHN1YnR5cGU7XG5cbiAgICAgICAgICAgIC8vIFJlZmVyZW5jZSBzdXBlcnR5cGVcbiAgICAgICAgICAgIHN1YnR5cGUuJHN1cGVyID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIHN1YnR5cGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAgKiBFeHRlbmRzIHRoaXMgb2JqZWN0IGFuZCBydW5zIHRoZSBpbml0IG1ldGhvZC5cbiAgICAgICAgICAqIEFyZ3VtZW50cyB0byBjcmVhdGUoKSB3aWxsIGJlIHBhc3NlZCB0byBpbml0KCkuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAgKlxuICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgdmFyIGluc3RhbmNlID0gTXlUeXBlLmNyZWF0ZSgpO1xuICAgICAgICAgICovXG4gICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcy5leHRlbmQoKTtcbiAgICAgICAgICAgIGluc3RhbmNlLmluaXQuYXBwbHkoaW5zdGFuY2UsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCBvYmplY3QuXG4gICAgICAgICAgKiBPdmVycmlkZSB0aGlzIG1ldGhvZCB0byBhZGQgc29tZSBsb2dpYyB3aGVuIHlvdXIgb2JqZWN0cyBhcmUgY3JlYXRlZC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcbiAgICAgICAgICAqICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICogICAgICAgICAgICAgLy8gLi4uXG4gICAgICAgICAgKiAgICAgICAgIH1cbiAgICAgICAgICAqICAgICB9KTtcbiAgICAgICAgICAqL1xuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7fSxcblxuICAgICAgICAvKipcbiAgICAgICAgICAqIENvcGllcyBwcm9wZXJ0aWVzIGludG8gdGhpcyBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BlcnRpZXMgVGhlIHByb3BlcnRpZXMgdG8gbWl4IGluLlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgIE15VHlwZS5taXhJbih7XG4gICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnXG4gICAgICAgICAgKiAgICAgfSk7XG4gICAgICAgICAgKi9cbiAgICAgICAgbWl4SW46IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gcHJvcGVydGllcykge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1twcm9wZXJ0eU5hbWVdID0gcHJvcGVydGllc1twcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJRSB3b24ndCBjb3B5IHRvU3RyaW5nIHVzaW5nIHRoZSBsb29wIGFib3ZlXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eSgndG9TdHJpbmcnKSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9TdHJpbmcgPSBwcm9wZXJ0aWVzLnRvU3RyaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICB2YXIgY2xvbmUgPSBpbnN0YW5jZS5jbG9uZSgpO1xuICAgICAgICAgICovXG4gICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbml0LnByb3RvdHlwZS5leHRlbmQodGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufSgpKTtcblxuLyoqXG4gICogQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuICAqXG4gICogQHByb3BlcnR5IHtBcnJheX0gd29yZHMgVGhlIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cbiAgKiBAcHJvcGVydHkge251bWJlcn0gc2lnQnl0ZXMgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGlzIHdvcmQgYXJyYXkuXG4gICovXG52YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5ID0gQmFzZS5leHRlbmQoe1xuXG4gICAgLyoqXG4gICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge0FycmF5fSB3b3JkcyAoT3B0aW9uYWwpIEFuIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cbiAgICAgICogQHBhcmFtIHtudW1iZXJ9IHNpZ0J5dGVzIChPcHRpb25hbCkgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGUgd29yZHMuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoKTtcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShbMHgwMDAxMDIwMywgMHgwNDA1MDYwN10pO1xuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKFsweDAwMDEwMjAzLCAweDA0MDUwNjA3XSwgNik7XG4gICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uICh3b3Jkcywgc2lnQnl0ZXMpIHtcbiAgICAgICAgd29yZHMgPSB0aGlzLndvcmRzID0gd29yZHMgfHwgW107XG5cbiAgICAgICAgaWYgKHNpZ0J5dGVzICE9IHVuZGVmaW5lZCkgeyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgICAgICB0aGlzLnNpZ0J5dGVzID0gc2lnQnl0ZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNpZ0J5dGVzID0gd29yZHMubGVuZ3RoICogNDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgdGhpcyB3b3JkIGFycmF5IHRvIGEgc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge0VuY29kZXJ9IGVuY29kZXIgKE9wdGlvbmFsKSBUaGUgZW5jb2Rpbmcgc3RyYXRlZ3kgdG8gdXNlLiBEZWZhdWx0OiBDcnlwdG9KUy5lbmMuSGV4XG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHN0cmluZ2lmaWVkIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5ICsgJyc7XG4gICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5LnRvU3RyaW5nKCk7XG4gICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5LnRvU3RyaW5nKENyeXB0b0pTLmVuYy5VdGY4KTtcbiAgICAgICovXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uIChlbmNvZGVyKSB7XG4gICAgICAgIHJldHVybiAoZW5jb2RlciB8fCBIZXgpLnN0cmluZ2lmeSh0aGlzKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ29uY2F0ZW5hdGVzIGEgd29yZCBhcnJheSB0byB0aGlzIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkgdG8gYXBwZW5kLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoaXMgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHdvcmRBcnJheTEuY29uY2F0KHdvcmRBcnJheTIpO1xuICAgICAgKi9cbiAgICBjb25jYXQ6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciB0aGlzV29yZHMgPSB0aGlzLndvcmRzO1xuICAgICAgICB2YXIgdGhhdFdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuICAgICAgICB2YXIgdGhpc1NpZ0J5dGVzID0gdGhpcy5zaWdCeXRlcztcbiAgICAgICAgdmFyIHRoYXRTaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuICAgICAgICAvLyBDbGFtcCBleGNlc3MgYml0c1xuICAgICAgICB0aGlzLmNsYW1wKCk7XG5cblxuICAgICAgICB2YXIgaTtcblxuICAgICAgICAvLyBDb25jYXRcbiAgICAgICAgaWYgKHRoaXNTaWdCeXRlcyAlIDQpIHtcbiAgICAgICAgICAgIC8vIENvcHkgb25lIGJ5dGUgYXQgYSB0aW1lXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhhdFNpZ0J5dGVzOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdEJ5dGUgPSAodGhhdFdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcbiAgICAgICAgICAgICAgICB0aGlzV29yZHNbKHRoaXNTaWdCeXRlcyArIGkpID4+PiAyXSB8PSB0aGF0Qnl0ZSA8PCAoMjQgLSAoKHRoaXNTaWdCeXRlcyArIGkpICUgNCkgKiA4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIENvcHkgb25lIHdvcmQgYXQgYSB0aW1lXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhhdFNpZ0J5dGVzOyBpICs9IDQpIHtcbiAgICAgICAgICAgICAgICB0aGlzV29yZHNbKHRoaXNTaWdCeXRlcyArIGkpID4+PiAyXSA9IHRoYXRXb3Jkc1tpID4+PiAyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNpZ0J5dGVzICs9IHRoYXRTaWdCeXRlcztcblxuICAgICAgICAvLyBDaGFpbmFibGVcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBSZW1vdmVzIGluc2lnbmlmaWNhbnQgYml0cy5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHdvcmRBcnJheS5jbGFtcCgpO1xuICAgICAgKi9cbiAgICBjbGFtcDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIHdvcmRzID0gdGhpcy53b3JkcztcbiAgICAgICAgdmFyIHNpZ0J5dGVzID0gdGhpcy5zaWdCeXRlcztcblxuICAgICAgICAvLyBDbGFtcFxuICAgICAgICB3b3Jkc1tzaWdCeXRlcyA+Pj4gMl0gJj0gMHhmZmZmZmZmZiA8PCAoMzIgLSAoc2lnQnl0ZXMgJSA0KSAqIDgpO1xuICAgICAgICB3b3Jkcy5sZW5ndGggPSBNYXRoLmNlaWwoc2lnQnl0ZXMgLyA0KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgY2xvbmUuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgY2xvbmUgPSB3b3JkQXJyYXkuY2xvbmUoKTtcbiAgICAgICovXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuICAgICAgICBjbG9uZS53b3JkcyA9IHRoaXMud29yZHMuc2xpY2UoMCk7XG5cbiAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ3JlYXRlcyBhIHdvcmQgYXJyYXkgZmlsbGVkIHdpdGggcmFuZG9tIGJ5dGVzLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge251bWJlcn0gbkJ5dGVzIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIHRvIGdlbmVyYXRlLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSByYW5kb20gd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkucmFuZG9tKDE2KTtcbiAgICAgICovXG4gICAgcmFuZG9tOiBmdW5jdGlvbiAobkJ5dGVzKSB7XG4gICAgICAgIHZhciB3b3JkcyA9IFtdO1xuXG4gICAgICAgIHZhciByID0gZnVuY3Rpb24gKG1fdykge1xuICAgICAgICAgICAgdmFyIG1feiA9IDB4M2FkZTY4YjE7XG4gICAgICAgICAgICB2YXIgbWFzayA9IDB4ZmZmZmZmZmY7XG5cbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbV96ID0gKDB4OTA2OSAqIChtX3ogJiAweEZGRkYpICsgKG1feiA+PiAweDEwKSkgJiBtYXNrO1xuICAgICAgICAgICAgICAgIG1fdyA9ICgweDQ2NTAgKiAobV93ICYgMHhGRkZGKSArIChtX3cgPj4gMHgxMCkpICYgbWFzaztcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gKChtX3ogPDwgMHgxMCkgKyBtX3cpICYgbWFzaztcbiAgICAgICAgICAgICAgICByZXN1bHQgLz0gMHgxMDAwMDAwMDA7XG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IDAuNTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ICogKE1hdGgucmFuZG9tKCkgPiAuNSA/IDEgOiAtMSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCByY2FjaGU7IGkgPCBuQnl0ZXM7IGkgKz0gNCkge1xuICAgICAgICAgICAgdmFyIF9yID0gcigocmNhY2hlIHx8IE1hdGgucmFuZG9tKCkpICogMHgxMDAwMDAwMDApO1xuXG4gICAgICAgICAgICByY2FjaGUgPSBfcigpICogMHgzYWRlNjdiNztcbiAgICAgICAgICAgIHdvcmRzLnB1c2goKF9yKCkgKiAweDEwMDAwMDAwMCkgfCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIG5CeXRlcyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG59KTtcblxuLyoqXG4gICogRW5jb2RlciBuYW1lc3BhY2UuXG4gICovXG52YXIgQ19lbmMgPSBDLmVuYyA9IHt9O1xuXG4vKipcbiAgKiBIZXggZW5jb2Rpbmcgc3RyYXRlZ3kuXG4gICovXG52YXIgSGV4ID0gQ19lbmMuSGV4ID0ge1xuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIGhleCBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGhleCBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBoZXhTdHJpbmcgPSBDcnlwdG9KUy5lbmMuSGV4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciB3b3JkcyA9IHdvcmRBcnJheS53b3JkcztcbiAgICAgICAgdmFyIHNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENvbnZlcnRcbiAgICAgICAgdmFyIGhleENoYXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lnQnl0ZXM7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJpdGUgPSAod29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSA+Pj4gNCkudG9TdHJpbmcoMTYpKTtcbiAgICAgICAgICAgIGhleENoYXJzLnB1c2goKGJpdGUgJiAweDBmKS50b1N0cmluZygxNikpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGhleENoYXJzLmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSBoZXggc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGhleFN0ciBUaGUgaGV4IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5IZXgucGFyc2UoaGV4U3RyaW5nKTtcbiAgICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChoZXhTdHIpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRcbiAgICAgICAgdmFyIGhleFN0ckxlbmd0aCA9IGhleFN0ci5sZW5ndGg7XG5cbiAgICAgICAgLy8gQ29udmVydFxuICAgICAgICB2YXIgd29yZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoZXhTdHJMZW5ndGg7IGkgKz0gMikge1xuICAgICAgICAgICAgd29yZHNbaSA+Pj4gM10gfD0gcGFyc2VJbnQoaGV4U3RyLnN1YnN0cihpLCAyKSwgMTYpIDw8ICgyNCAtIChpICUgOCkgKiA0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIGhleFN0ckxlbmd0aCAvIDIpOyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG59O1xuXG4vKipcbiAgKiBMYXRpbjEgZW5jb2Rpbmcgc3RyYXRlZ3kuXG4gICovXG52YXIgTGF0aW4xID0gQ19lbmMuTGF0aW4xID0ge1xuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIExhdGluMSBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIExhdGluMSBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBsYXRpbjFTdHJpbmcgPSBDcnlwdG9KUy5lbmMuTGF0aW4xLnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciB3b3JkcyA9IHdvcmRBcnJheS53b3JkcztcbiAgICAgICAgdmFyIHNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENvbnZlcnRcbiAgICAgICAgdmFyIGxhdGluMUNoYXJzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2lnQnl0ZXM7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJpdGUgPSAod29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuICAgICAgICAgICAgbGF0aW4xQ2hhcnMucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGJpdGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsYXRpbjFDaGFycy5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgTGF0aW4xIHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYXRpbjFTdHIgVGhlIExhdGluMSBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuTGF0aW4xLnBhcnNlKGxhdGluMVN0cmluZyk7XG4gICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbiAobGF0aW4xU3RyKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0XG4gICAgICAgIHZhciBsYXRpbjFTdHJMZW5ndGggPSBsYXRpbjFTdHIubGVuZ3RoO1xuXG4gICAgICAgIC8vIENvbnZlcnRcbiAgICAgICAgdmFyIHdvcmRzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF0aW4xU3RyTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHdvcmRzW2kgPj4+IDJdIHw9IChsYXRpbjFTdHIuY2hhckNvZGVBdChpKSAmIDB4ZmYpIDw8ICgyNCAtIChpICUgNCkgKiA4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIGxhdGluMVN0ckxlbmd0aCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG59O1xuXG4vKipcbiAgKiBVVEYtOCBlbmNvZGluZyBzdHJhdGVneS5cbiAgKi9cbnZhciBVdGY4ID0gQ19lbmMuVXRmOCA9IHtcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBVVEYtOCBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7V29yZEFycmF5fSB3b3JkQXJyYXkgVGhlIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIFVURi04IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHV0ZjhTdHJpbmcgPSBDcnlwdG9KUy5lbmMuVXRmOC5zdHJpbmdpZnkod29yZEFycmF5KTtcbiAgICAgICovXG4gICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShMYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSkpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNYWxmb3JtZWQgVVRGLTggZGF0YScpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyBhIFVURi04IHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1dGY4U3RyIFRoZSBVVEYtOCBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuVXRmOC5wYXJzZSh1dGY4U3RyaW5nKTtcbiAgICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uICh1dGY4U3RyKSB7XG4gICAgICAgIHJldHVybiBMYXRpbjEucGFyc2UodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KHV0ZjhTdHIpKSk7XG4gICAgfVxufTtcblxuLyoqXG4gICogQWJzdHJhY3QgYnVmZmVyZWQgYmxvY2sgYWxnb3JpdGhtIHRlbXBsYXRlLlxuICAqXG4gICogVGhlIHByb3BlcnR5IGJsb2NrU2l6ZSBtdXN0IGJlIGltcGxlbWVudGVkIGluIGEgY29uY3JldGUgc3VidHlwZS5cbiAgKlxuICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBfbWluQnVmZmVyU2l6ZSBUaGUgbnVtYmVyIG9mIGJsb2NrcyB0aGF0IHNob3VsZCBiZSBrZXB0IHVucHJvY2Vzc2VkIGluIHRoZSBidWZmZXIuIERlZmF1bHQ6IDBcbiAgKi9cbnZhciBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtID0gQ19saWIuQnVmZmVyZWRCbG9ja0FsZ29yaXRobSA9IEJhc2UuZXh0ZW5kKHtcblxuICAgIC8qKlxuICAgICAgKiBSZXNldHMgdGhpcyBibG9jayBhbGdvcml0aG0ncyBkYXRhIGJ1ZmZlciB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQoKTtcbiAgICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gSW5pdGlhbCB2YWx1ZXNcbiAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBXb3JkQXJyYXkuaW5pdCgpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIHRoaXMuX25EYXRhQnl0ZXMgPSAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQWRkcyBuZXcgZGF0YSB0byB0aGlzIGJsb2NrIGFsZ29yaXRobSdzIGJ1ZmZlci5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBkYXRhIFRoZSBkYXRhIHRvIGFwcGVuZC4gU3RyaW5ncyBhcmUgY29udmVydGVkIHRvIGEgV29yZEFycmF5IHVzaW5nIFVURi04LlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fYXBwZW5kKCdkYXRhJyk7XG4gICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQod29yZEFycmF5KTtcbiAgICAgICovXG4gICAgX2FwcGVuZDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBkYXRhID0gVXRmOC5wYXJzZShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFwcGVuZFxuICAgICAgICB0aGlzLl9kYXRhLmNvbmNhdChkYXRhKTtcbiAgICAgICAgdGhpcy5fbkRhdGFCeXRlcyArPSBkYXRhLnNpZ0J5dGVzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogUHJvY2Vzc2VzIGF2YWlsYWJsZSBkYXRhIGJsb2Nrcy5cbiAgICAgICpcbiAgICAgICogVGhpcyBtZXRob2QgaW52b2tlcyBfZG9Qcm9jZXNzQmxvY2sob2Zmc2V0KSwgd2hpY2ggbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBhIGNvbmNyZXRlIHN1YnR5cGUuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZG9GbHVzaCBXaGV0aGVyIGFsbCBibG9ja3MgYW5kIHBhcnRpYWwgYmxvY2tzIHNob3VsZCBiZSBwcm9jZXNzZWQuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHByb2Nlc3NlZCBkYXRhLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHByb2Nlc3NlZERhdGEgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9wcm9jZXNzKCk7XG4gICAgICAqICAgICB2YXIgcHJvY2Vzc2VkRGF0YSA9IGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX3Byb2Nlc3MoISEnZmx1c2gnKTtcbiAgICAgICovXG4gICAgX3Byb2Nlc3M6IGZ1bmN0aW9uIChkb0ZsdXNoKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBkYXRhV29yZHMgPSBkYXRhLndvcmRzO1xuICAgICAgICB2YXIgZGF0YVNpZ0J5dGVzID0gZGF0YS5zaWdCeXRlcztcbiAgICAgICAgdmFyIGJsb2NrU2l6ZSA9IHRoaXMuYmxvY2tTaXplO1xuICAgICAgICB2YXIgYmxvY2tTaXplQnl0ZXMgPSBibG9ja1NpemUgKiA0O1xuXG4gICAgICAgIC8vIENvdW50IGJsb2NrcyByZWFkeVxuICAgICAgICB2YXIgbkJsb2Nrc1JlYWR5ID0gZGF0YVNpZ0J5dGVzIC8gYmxvY2tTaXplQnl0ZXM7XG4gICAgICAgIGlmIChkb0ZsdXNoKSB7XG4gICAgICAgICAgICAvLyBSb3VuZCB1cCB0byBpbmNsdWRlIHBhcnRpYWwgYmxvY2tzXG4gICAgICAgICAgICBuQmxvY2tzUmVhZHkgPSBNYXRoLmNlaWwobkJsb2Nrc1JlYWR5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJvdW5kIGRvd24gdG8gaW5jbHVkZSBvbmx5IGZ1bGwgYmxvY2tzLFxuICAgICAgICAgICAgLy8gbGVzcyB0aGUgbnVtYmVyIG9mIGJsb2NrcyB0aGF0IG11c3QgcmVtYWluIGluIHRoZSBidWZmZXJcbiAgICAgICAgICAgIG5CbG9ja3NSZWFkeSA9IE1hdGgubWF4KChuQmxvY2tzUmVhZHkgfCAwKSAtIHRoaXMuX21pbkJ1ZmZlclNpemUsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ291bnQgd29yZHMgcmVhZHlcbiAgICAgICAgdmFyIG5Xb3Jkc1JlYWR5ID0gbkJsb2Nrc1JlYWR5ICogYmxvY2tTaXplO1xuXG4gICAgICAgIC8vIENvdW50IGJ5dGVzIHJlYWR5XG4gICAgICAgIHZhciBuQnl0ZXNSZWFkeSA9IE1hdGgubWluKG5Xb3Jkc1JlYWR5ICogNCwgZGF0YVNpZ0J5dGVzKTtcblxuICAgICAgICAvLyBQcm9jZXNzIGJsb2Nrc1xuICAgICAgICBpZiAobldvcmRzUmVhZHkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IG5Xb3Jkc1JlYWR5OyBvZmZzZXQgKz0gYmxvY2tTaXplKSB7XG4gICAgICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1hbGdvcml0aG0gbG9naWNcbiAgICAgICAgICAgICAgICB0aGlzLl9kb1Byb2Nlc3NCbG9jayhkYXRhV29yZHMsIG9mZnNldCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSBwcm9jZXNzZWQgd29yZHNcbiAgICAgICAgICAgIHZhciBwcm9jZXNzZWRXb3JkcyA9IGRhdGFXb3Jkcy5zcGxpY2UoMCwgbldvcmRzUmVhZHkpO1xuICAgICAgICAgICAgZGF0YS5zaWdCeXRlcyAtPSBuQnl0ZXNSZWFkeTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBwcm9jZXNzZWQgd29yZHNcbiAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdChwcm9jZXNzZWRXb3JkcywgbkJ5dGVzUmVhZHkpOyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBjbG9uZS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBjbG9uZSA9IGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uY2xvbmUoKTtcbiAgICAgICovXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNsb25lID0gQmFzZS5jbG9uZS5jYWxsKHRoaXMpO1xuICAgICAgICBjbG9uZS5fZGF0YSA9IHRoaXMuX2RhdGEuY2xvbmUoKTtcblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfSxcblxuICAgIF9taW5CdWZmZXJTaXplOiAwXG59KTtcblxuLyoqXG4gICogQWJzdHJhY3QgaGFzaGVyIHRlbXBsYXRlLlxuICAqXG4gICogQHByb3BlcnR5IHtudW1iZXJ9IGJsb2NrU2l6ZSBUaGUgbnVtYmVyIG9mIDMyLWJpdCB3b3JkcyB0aGlzIGhhc2hlciBvcGVyYXRlcyBvbi4gRGVmYXVsdDogMTYgKDUxMiBiaXRzKVxuICAqL1xuQ19saWIuSGFzaGVyID0gQnVmZmVyZWRCbG9ja0FsZ29yaXRobS5leHRlbmQoe1xuXG4gICAgLyoqXG4gICAgICAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICAgICovXG4gICAgY2ZnOiBCYXNlLmV4dGVuZCgpLFxuXG4gICAgLyoqXG4gICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCBoYXNoZXIuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjZmcgKE9wdGlvbmFsKSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIHVzZSBmb3IgdGhpcyBoYXNoIGNvbXB1dGF0aW9uLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGhhc2hlciA9IENyeXB0b0pTLmFsZ28uU0hBMjU2LmNyZWF0ZSgpO1xuICAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbiAoY2ZnKSB7XG4gICAgICAgIC8vIEFwcGx5IGNvbmZpZyBkZWZhdWx0c1xuICAgICAgICB0aGlzLmNmZyA9IHRoaXMuY2ZnLmV4dGVuZChjZmcpO1xuXG4gICAgICAgIC8vIFNldCBpbml0aWFsIHZhbHVlc1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBSZXNldHMgdGhpcyBoYXNoZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICBoYXNoZXIucmVzZXQoKTtcbiAgICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUmVzZXQgZGF0YSBidWZmZXJcbiAgICAgICAgQnVmZmVyZWRCbG9ja0FsZ29yaXRobS5yZXNldC5jYWxsKHRoaXMpO1xuXG4gICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtaGFzaGVyIGxvZ2ljXG4gICAgICAgIHRoaXMuX2RvUmVzZXQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIFVwZGF0ZXMgdGhpcyBoYXNoZXIgd2l0aCBhIG1lc3NhZ2UuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSBUaGUgbWVzc2FnZSB0byBhcHBlbmQuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge0hhc2hlcn0gVGhpcyBoYXNoZXIuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICBoYXNoZXIudXBkYXRlKCdtZXNzYWdlJyk7XG4gICAgICAqICAgICBoYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgLy8gQXBwZW5kXG4gICAgICAgIHRoaXMuX2FwcGVuZChtZXNzYWdlVXBkYXRlKTtcblxuICAgICAgICAvLyBVcGRhdGUgdGhlIGhhc2hcbiAgICAgICAgdGhpcy5fcHJvY2VzcygpO1xuXG4gICAgICAgIC8vIENoYWluYWJsZVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIEZpbmFsaXplcyB0aGUgaGFzaCBjb21wdXRhdGlvbi5cbiAgICAgICogTm90ZSB0aGF0IHRoZSBmaW5hbGl6ZSBvcGVyYXRpb24gaXMgZWZmZWN0aXZlbHkgYSBkZXN0cnVjdGl2ZSwgcmVhZC1vbmNlIG9wZXJhdGlvbi5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIChPcHRpb25hbCkgQSBmaW5hbCBtZXNzYWdlIHVwZGF0ZS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgaGFzaC5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBoYXNoID0gaGFzaGVyLmZpbmFsaXplKCk7XG4gICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuICAgICAgKiAgICAgdmFyIGhhc2ggPSBoYXNoZXIuZmluYWxpemUod29yZEFycmF5KTtcbiAgICAgICovXG4gICAgZmluYWxpemU6IGZ1bmN0aW9uIChtZXNzYWdlVXBkYXRlKSB7XG4gICAgICAgIC8vIEZpbmFsIG1lc3NhZ2UgdXBkYXRlXG4gICAgICAgIGlmIChtZXNzYWdlVXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9hcHBlbmQobWVzc2FnZVVwZGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWhhc2hlciBsb2dpY1xuICAgICAgICB2YXIgaGFzaCA9IHRoaXMuX2RvRmluYWxpemUoKTtcblxuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICB9LFxuXG4gICAgYmxvY2tTaXplOiA1MTIgLyAzMixcblxuICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gYSBoYXNoZXIncyBvYmplY3QgaW50ZXJmYWNlLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoZXIgdG8gY3JlYXRlIGEgaGVscGVyIGZvci5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIFNIQTI1NiA9IENyeXB0b0pTLmxpYi5IYXNoZXIuX2NyZWF0ZUhlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG4gICAgICAqL1xuICAgIF9jcmVhdGVIZWxwZXI6IGZ1bmN0aW9uIChoYXNoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlLCBjZmcpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgaGFzaGVyLmluaXQoY2ZnKS5maW5hbGl6ZShtZXNzYWdlKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ3JlYXRlcyBhIHNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBITUFDJ3Mgb2JqZWN0IGludGVyZmFjZS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaGVyIHRvIHVzZSBpbiB0aGlzIEhNQUMgaGVscGVyLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIHNob3J0Y3V0IGZ1bmN0aW9uLlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgSG1hY1NIQTI1NiA9IENyeXB0b0pTLmxpYi5IYXNoZXIuX2NyZWF0ZUhtYWNIZWxwZXIoQ3J5cHRvSlMuYWxnby5TSEEyNTYpO1xuICAgICAgKi9cbiAgICBfY3JlYXRlSG1hY0hlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDX2FsZ28uSE1BQy5pbml0KGhhc2hlciwga2V5KS5maW5hbGl6ZShtZXNzYWdlKTsgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH07XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQztcbiIsIi8qKlxuICogQGZpbGUgaG1hYy1zaGEyNTYuanNcbiAqIEBhdXRob3IgPz8/XG4gKi9cbnJlcXVpcmUoMzkpO1xucmVxdWlyZSgzOCk7XG52YXIgQ3J5cHRvSlMgPSByZXF1aXJlKDM2KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDcnlwdG9KUy5IbWFjU0hBMjU2O1xuIiwiLyoqXG4gKiBAZmlsZSBobWFjLmpzXG4gKiBAYXV0aG9yID8/P1xuICovXG5cbnZhciBDcnlwdG9KUyA9IHJlcXVpcmUoMzYpO1xuXG4vLyBTaG9ydGN1dHNcbnZhciBDID0gQ3J5cHRvSlM7XG52YXIgQ19saWIgPSBDLmxpYjtcbnZhciBCYXNlID0gQ19saWIuQmFzZTtcbnZhciBDX2VuYyA9IEMuZW5jO1xudmFyIFV0ZjggPSBDX2VuYy5VdGY4O1xudmFyIENfYWxnbyA9IEMuYWxnbztcblxuLyoqXG4gKiBITUFDIGFsZ29yaXRobS5cbiAqL1xuQ19hbGdvLkhNQUMgPSBCYXNlLmV4dGVuZCh7XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBhIG5ld2x5IGNyZWF0ZWQgSE1BQy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2ggYWxnb3JpdGhtIHRvIHVzZS5cbiAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IGtleSBUaGUgc2VjcmV0IGtleS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgdmFyIGhtYWNIYXNoZXIgPSBDcnlwdG9KUy5hbGdvLkhNQUMuY3JlYXRlKENyeXB0b0pTLmFsZ28uU0hBMjU2LCBrZXkpO1xuICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uIChoYXNoZXIsIGtleSkge1xuICAgICAgICAvLyBJbml0IGhhc2hlclxuICAgICAgICBoYXNoZXIgPSB0aGlzLl9oYXNoZXIgPSBuZXcgaGFzaGVyLmluaXQoKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuXG4gICAgICAgIC8vIENvbnZlcnQgc3RyaW5nIHRvIFdvcmRBcnJheSwgZWxzZSBhc3N1bWUgV29yZEFycmF5IGFscmVhZHlcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBrZXkgPSBVdGY4LnBhcnNlKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIGhhc2hlckJsb2NrU2l6ZSA9IGhhc2hlci5ibG9ja1NpemU7XG4gICAgICAgIHZhciBoYXNoZXJCbG9ja1NpemVCeXRlcyA9IGhhc2hlckJsb2NrU2l6ZSAqIDQ7XG5cbiAgICAgICAgLy8gQWxsb3cgYXJiaXRyYXJ5IGxlbmd0aCBrZXlzXG4gICAgICAgIGlmIChrZXkuc2lnQnl0ZXMgPiBoYXNoZXJCbG9ja1NpemVCeXRlcykge1xuICAgICAgICAgICAga2V5ID0gaGFzaGVyLmZpbmFsaXplKGtleSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGFtcCBleGNlc3MgYml0c1xuICAgICAgICBrZXkuY2xhbXAoKTtcblxuICAgICAgICAvLyBDbG9uZSBrZXkgZm9yIGlubmVyIGFuZCBvdXRlciBwYWRzXG4gICAgICAgIHZhciBvS2V5ID0gdGhpcy5fb0tleSA9IGtleS5jbG9uZSgpO1xuICAgICAgICB2YXIgaUtleSA9IHRoaXMuX2lLZXkgPSBrZXkuY2xvbmUoKTtcblxuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIG9LZXlXb3JkcyA9IG9LZXkud29yZHM7XG4gICAgICAgIHZhciBpS2V5V29yZHMgPSBpS2V5LndvcmRzO1xuXG4gICAgICAgIC8vIFhPUiBrZXlzIHdpdGggcGFkIGNvbnN0YW50c1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhc2hlckJsb2NrU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgICBvS2V5V29yZHNbaV0gXj0gMHg1YzVjNWM1YztcbiAgICAgICAgICAgIGlLZXlXb3Jkc1tpXSBePSAweDM2MzYzNjM2O1xuICAgICAgICB9XG4gICAgICAgIG9LZXkuc2lnQnl0ZXMgPSBpS2V5LnNpZ0J5dGVzID0gaGFzaGVyQmxvY2tTaXplQnl0ZXM7XG5cbiAgICAgICAgLy8gU2V0IGluaXRpYWwgdmFsdWVzXG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoaXMgSE1BQyB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgaG1hY0hhc2hlci5yZXNldCgpO1xuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0XG4gICAgICAgIHZhciBoYXNoZXIgPSB0aGlzLl9oYXNoZXI7XG5cbiAgICAgICAgLy8gUmVzZXRcbiAgICAgICAgaGFzaGVyLnJlc2V0KCk7XG4gICAgICAgIGhhc2hlci51cGRhdGUodGhpcy5faUtleSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhpcyBITUFDIHdpdGggYSBtZXNzYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIFRoZSBtZXNzYWdlIHRvIGFwcGVuZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0hNQUN9IFRoaXMgSE1BQyBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgaG1hY0hhc2hlci51cGRhdGUoJ21lc3NhZ2UnKTtcbiAgICAgKiAgICAgaG1hY0hhc2hlci51cGRhdGUod29yZEFycmF5KTtcbiAgICAgKi9cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChtZXNzYWdlVXBkYXRlKSB7XG4gICAgICAgIHRoaXMuX2hhc2hlci51cGRhdGUobWVzc2FnZVVwZGF0ZSk7XG5cbiAgICAgICAgLy8gQ2hhaW5hYmxlXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGaW5hbGl6ZXMgdGhlIEhNQUMgY29tcHV0YXRpb24uXG4gICAgICogTm90ZSB0aGF0IHRoZSBmaW5hbGl6ZSBvcGVyYXRpb24gaXMgZWZmZWN0aXZlbHkgYSBkZXN0cnVjdGl2ZSwgcmVhZC1vbmNlIG9wZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSAoT3B0aW9uYWwpIEEgZmluYWwgbWVzc2FnZSB1cGRhdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBITUFDLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICB2YXIgaG1hYyA9IGhtYWNIYXNoZXIuZmluYWxpemUoKTtcbiAgICAgKiAgICAgdmFyIGhtYWMgPSBobWFjSGFzaGVyLmZpbmFsaXplKCdtZXNzYWdlJyk7XG4gICAgICogICAgIHZhciBobWFjID0gaG1hY0hhc2hlci5maW5hbGl6ZSh3b3JkQXJyYXkpO1xuICAgICAqL1xuICAgIGZpbmFsaXplOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuICAgICAgICAvLyBTaG9ydGN1dFxuICAgICAgICB2YXIgaGFzaGVyID0gdGhpcy5faGFzaGVyO1xuXG4gICAgICAgIC8vIENvbXB1dGUgSE1BQ1xuICAgICAgICB2YXIgaW5uZXJIYXNoID0gaGFzaGVyLmZpbmFsaXplKG1lc3NhZ2VVcGRhdGUpO1xuICAgICAgICBoYXNoZXIucmVzZXQoKTtcbiAgICAgICAgdmFyIGhtYWMgPSBoYXNoZXIuZmluYWxpemUodGhpcy5fb0tleS5jbG9uZSgpLmNvbmNhdChpbm5lckhhc2gpKTtcblxuICAgICAgICByZXR1cm4gaG1hYztcbiAgICB9XG59KTtcbiIsIi8qKlxuICogQGZpbGUgc2hhMjU2LmpzXG4gKiBAYXV0aG9yID8/P1xuICovXG52YXIgQ3J5cHRvSlMgPSByZXF1aXJlKDM2KTtcblxuICAgIC8vIFNob3J0Y3V0c1xudmFyIEMgPSBDcnlwdG9KUztcbnZhciBDX2xpYiA9IEMubGliO1xudmFyIFdvcmRBcnJheSA9IENfbGliLldvcmRBcnJheTtcbnZhciBIYXNoZXIgPSBDX2xpYi5IYXNoZXI7XG52YXIgQ19hbGdvID0gQy5hbGdvO1xuXG4vLyBJbml0aWFsaXphdGlvbiBhbmQgcm91bmQgY29uc3RhbnRzIHRhYmxlc1xudmFyIEggPSBbXTtcbnZhciBLID0gW107XG5cbi8vIENvbXB1dGUgY29uc3RhbnRzXG4oZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGlzUHJpbWUobikge1xuICAgICAgICB2YXIgc3FydE4gPSBNYXRoLnNxcnQobik7XG4gICAgICAgIGZvciAodmFyIGZhY3RvciA9IDI7IGZhY3RvciA8PSBzcXJ0TjsgZmFjdG9yKyspIHtcbiAgICAgICAgICAgIGlmICghKG4gJSBmYWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGcmFjdGlvbmFsQml0cyhuKSB7XG4gICAgICAgIHJldHVybiAoKG4gLSAobiB8IDApKSAqIDB4MTAwMDAwMDAwKSB8IDA7XG4gICAgfVxuXG4gICAgdmFyIG4gPSAyO1xuICAgIHZhciBuUHJpbWUgPSAwO1xuICAgIHdoaWxlIChuUHJpbWUgPCA2NCkge1xuICAgICAgICBpZiAoaXNQcmltZShuKSkge1xuICAgICAgICAgICAgaWYgKG5QcmltZSA8IDgpIHtcbiAgICAgICAgICAgICAgICBIW25QcmltZV0gPSBnZXRGcmFjdGlvbmFsQml0cyhNYXRoLnBvdyhuLCAxIC8gMikpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBLW25QcmltZV0gPSBnZXRGcmFjdGlvbmFsQml0cyhNYXRoLnBvdyhuLCAxIC8gMykpO1xuXG4gICAgICAgICAgICBuUHJpbWUrKztcbiAgICAgICAgfVxuXG4gICAgICAgIG4rKztcbiAgICB9XG59KCkpO1xuXG4vLyBSZXVzYWJsZSBvYmplY3RcbnZhciBXID0gW107XG5cbi8qKlxuICogU0hBLTI1NiBoYXNoIGFsZ29yaXRobS5cbiAqL1xudmFyIFNIQTI1NiA9IENfYWxnby5TSEEyNTYgPSBIYXNoZXIuZXh0ZW5kKHtcbiAgICBfZG9SZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9oYXNoID0gbmV3IFdvcmRBcnJheS5pbml0KEguc2xpY2UoMCkpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfSxcblxuICAgIF9kb1Byb2Nlc3NCbG9jazogZnVuY3Rpb24gKE0sIG9mZnNldCkge1xuICAgICAgICAvLyBTaG9ydGN1dFxuICAgICAgICB2YXIgSCA9IHRoaXMuX2hhc2gud29yZHM7XG5cbiAgICAgICAgLy8gV29ya2luZyB2YXJpYWJsZXNcbiAgICAgICAgdmFyIGEgPSBIWzBdO1xuICAgICAgICB2YXIgYiA9IEhbMV07XG4gICAgICAgIHZhciBjID0gSFsyXTtcbiAgICAgICAgdmFyIGQgPSBIWzNdO1xuICAgICAgICB2YXIgZSA9IEhbNF07XG4gICAgICAgIHZhciBmID0gSFs1XTtcbiAgICAgICAgdmFyIGcgPSBIWzZdO1xuICAgICAgICB2YXIgaCA9IEhbN107XG5cbiAgICAgICAgLy8gQ29tcHV0YXRpb25cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgV1tpXSA9IE1bb2Zmc2V0ICsgaV0gfCAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGdhbW1hMHggPSBXW2kgLSAxNV07XG4gICAgICAgICAgICAgICAgdmFyIGdhbW1hMCA9ICgoZ2FtbWEweCA8PCAyNSlcbiAgICAgICAgICAgICAgICAgICAgfCAoZ2FtbWEweCA+Pj4gNykpIF4gKChnYW1tYTB4IDw8IDE0KVxuICAgICAgICAgICAgICAgICAgICB8IChnYW1tYTB4ID4+PiAxOCkpIF4gKGdhbW1hMHggPj4+IDMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGdhbW1hMXggPSBXW2kgLSAyXTtcbiAgICAgICAgICAgICAgICB2YXIgZ2FtbWExID0gKChnYW1tYTF4IDw8IDE1KVxuICAgICAgICAgICAgICAgICAgICB8IChnYW1tYTF4ID4+PiAxNykpIF4gKChnYW1tYTF4IDw8IDEzKVxuICAgICAgICAgICAgICAgICAgICB8IChnYW1tYTF4ID4+PiAxOSkpIF4gKGdhbW1hMXggPj4+IDEwKTtcblxuICAgICAgICAgICAgICAgIFdbaV0gPSBnYW1tYTAgKyBXW2kgLSA3XSArIGdhbW1hMSArIFdbaSAtIDE2XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNoID0gKGUgJiBmKSBeICh+ZSAmIGcpO1xuICAgICAgICAgICAgdmFyIG1haiA9IChhICYgYikgXiAoYSAmIGMpIF4gKGIgJiBjKTtcblxuICAgICAgICAgICAgdmFyIHNpZ21hMCA9ICgoYSA8PCAzMCkgfCAoYSA+Pj4gMikpIF4gKChhIDw8IDE5KSB8IChhID4+PiAxMykpIF4gKChhIDw8IDEwKSB8IChhID4+PiAyMikpO1xuICAgICAgICAgICAgdmFyIHNpZ21hMSA9ICgoZSA8PCAyNikgfCAoZSA+Pj4gNikpIF4gKChlIDw8IDIxKSB8IChlID4+PiAxMSkpIF4gKChlIDw8IDcpIHwgKGUgPj4+IDI1KSk7XG5cbiAgICAgICAgICAgIHZhciB0MSA9IGggKyBzaWdtYTEgKyBjaCArIEtbaV0gKyBXW2ldO1xuICAgICAgICAgICAgdmFyIHQyID0gc2lnbWEwICsgbWFqO1xuXG4gICAgICAgICAgICBoID0gZztcbiAgICAgICAgICAgIGcgPSBmO1xuICAgICAgICAgICAgZiA9IGU7XG4gICAgICAgICAgICBlID0gKGQgKyB0MSkgfCAwO1xuICAgICAgICAgICAgZCA9IGM7XG4gICAgICAgICAgICBjID0gYjtcbiAgICAgICAgICAgIGIgPSBhO1xuICAgICAgICAgICAgYSA9ICh0MSArIHQyKSB8IDA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnRlcm1lZGlhdGUgaGFzaCB2YWx1ZVxuICAgICAgICBIWzBdID0gKEhbMF0gKyBhKSB8IDA7XG4gICAgICAgIEhbMV0gPSAoSFsxXSArIGIpIHwgMDtcbiAgICAgICAgSFsyXSA9IChIWzJdICsgYykgfCAwO1xuICAgICAgICBIWzNdID0gKEhbM10gKyBkKSB8IDA7XG4gICAgICAgIEhbNF0gPSAoSFs0XSArIGUpIHwgMDtcbiAgICAgICAgSFs1XSA9IChIWzVdICsgZikgfCAwO1xuICAgICAgICBIWzZdID0gKEhbNl0gKyBnKSB8IDA7XG4gICAgICAgIEhbN10gPSAoSFs3XSArIGgpIHwgMDtcbiAgICB9LFxuXG4gICAgX2RvRmluYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG5cbiAgICAgICAgdmFyIG5CaXRzVG90YWwgPSB0aGlzLl9uRGF0YUJ5dGVzICogODtcbiAgICAgICAgdmFyIG5CaXRzTGVmdCA9IGRhdGEuc2lnQnl0ZXMgKiA4O1xuXG4gICAgICAgIC8vIEFkZCBwYWRkaW5nXG4gICAgICAgIGRhdGFXb3Jkc1tuQml0c0xlZnQgPj4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbkJpdHNMZWZ0ICUgMzIpO1xuICAgICAgICBkYXRhV29yZHNbKCgobkJpdHNMZWZ0ICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IE1hdGguZmxvb3IobkJpdHNUb3RhbCAvIDB4MTAwMDAwMDAwKTtcbiAgICAgICAgZGF0YVdvcmRzWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNV0gPSBuQml0c1RvdGFsO1xuICAgICAgICBkYXRhLnNpZ0J5dGVzID0gZGF0YVdvcmRzLmxlbmd0aCAqIDQ7XG5cbiAgICAgICAgLy8gSGFzaCBmaW5hbCBibG9ja3NcbiAgICAgICAgdGhpcy5fcHJvY2VzcygpO1xuXG4gICAgICAgIC8vIFJldHVybiBmaW5hbCBjb21wdXRlZCBoYXNoXG4gICAgICAgIHJldHVybiB0aGlzLl9oYXNoO1xuICAgIH0sXG5cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2xvbmUgPSBIYXNoZXIuY2xvbmUuY2FsbCh0aGlzKTtcbiAgICAgICAgY2xvbmUuX2hhc2ggPSB0aGlzLl9oYXNoLmNsb25lKCk7XG5cbiAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBoYXNoZXIncyBvYmplY3QgaW50ZXJmYWNlLlxuICpcbiAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuICpcbiAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIGhhc2guXG4gKlxuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKlxuICogICAgIHZhciBoYXNoID0gQ3J5cHRvSlMuU0hBMjU2KCdtZXNzYWdlJyk7XG4gKiAgICAgdmFyIGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYod29yZEFycmF5KTtcbiAqL1xuQy5TSEEyNTYgPSBIYXNoZXIuX2NyZWF0ZUhlbHBlcihTSEEyNTYpO1xuXG4vKipcbiAqIFNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBITUFDJ3Mgb2JqZWN0IGludGVyZmFjZS5cbiAqXG4gKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gaGFzaC5cbiAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30ga2V5IFRoZSBzZWNyZXQga2V5LlxuICpcbiAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIEhNQUMuXG4gKlxuICogQHN0YXRpY1xuICpcbiAqIEBleGFtcGxlXG4gKlxuICogICAgIHZhciBobWFjID0gQ3J5cHRvSlMuSG1hY1NIQTI1NihtZXNzYWdlLCBrZXkpO1xuICovXG5DLkhtYWNTSEEyNTYgPSBIYXNoZXIuX2NyZWF0ZUhtYWNIZWxwZXIoU0hBMjU2KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDcnlwdG9KUy5TSEEyNTY7XG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9jcnlwdG8uanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBIbWFjU0hBMjU2ID0gcmVxdWlyZSgzNyk7XG52YXIgSGV4ID0gcmVxdWlyZSgzNikuZW5jLkhleDtcblxuZXhwb3J0cy5jcmVhdGVIbWFjID0gZnVuY3Rpb24gKHR5cGUsIGtleSkge1xuICAgIGlmICh0eXBlID09PSAnc2hhMjU2Jykge1xuICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcblxuICAgICAgICB2YXIgc2hhMjU2SG1hYyA9IHtcbiAgICAgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IEhtYWNTSEEyNTYoZGF0YSwga2V5KS50b1N0cmluZyhIZXgpO1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkaWdlc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBzaGEyNTZIbWFjO1xuICAgIH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9ldmVudHMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qKlxuICogRXZlbnRFbWl0dGVyXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgICB0aGlzLl9fZXZlbnRzID0ge307XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHZhcl9hcmdzKSB7XG4gICAgdmFyIGhhbmRsZXJzID0gdGhpcy5fX2V2ZW50c1tldmVudE5hbWVdO1xuICAgIGlmICghaGFuZGxlcnMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFuZGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBoYW5kbGVyc1tpXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAvLyBJR05PUkVcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgaWYgKCF0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgdGhpcy5fX2V2ZW50c1tldmVudE5hbWVdID0gW2xpc3RlbmVyXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuX19ldmVudHNbZXZlbnROYW1lXS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG59O1xuXG5leHBvcnRzLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvaGVscGVyLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG5mdW5jdGlvbiBwYWQobnVtYmVyKSB7XG4gICAgaWYgKG51bWJlciA8IDEwKSB7XG4gICAgICAgIHJldHVybiAnMCcgKyBudW1iZXI7XG4gICAgfVxuICAgIHJldHVybiBudW1iZXI7XG59XG5cbmV4cG9ydHMudG9JU09TdHJpbmcgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIGlmIChkYXRlLnRvSVNPU3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBkYXRlLnRvSVNPU3RyaW5nKCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRlLmdldFVUQ0Z1bGxZZWFyKClcbiAgICAgICAgKyAnLScgKyBwYWQoZGF0ZS5nZXRVVENNb250aCgpICsgMSlcbiAgICAgICAgKyAnLScgKyBwYWQoZGF0ZS5nZXRVVENEYXRlKCkpXG4gICAgICAgICsgJ1QnICsgcGFkKGRhdGUuZ2V0VVRDSG91cnMoKSlcbiAgICAgICAgKyAnOicgKyBwYWQoZGF0ZS5nZXRVVENNaW51dGVzKCkpXG4gICAgICAgICsgJzonICsgcGFkKGRhdGUuZ2V0VVRDU2Vjb25kcygpKVxuICAgICAgICArICcuJyArIChkYXRlLmdldFVUQ01pbGxpc2Vjb25kcygpIC8gMTAwMCkudG9GaXhlZCgzKS5zbGljZSgyLCA1KVxuICAgICAgICArICdaJztcbn07XG5cbmV4cG9ydHMudG9VVENTdHJpbmcgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgIHZhciBpc29TdHJpbmcgPSBleHBvcnRzLnRvSVNPU3RyaW5nKGRhdGUpO1xuICAgIHJldHVybiBpc29TdHJpbmcucmVwbGFjZSgvXFwuXFxkK1okLywgJ1onKTtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL3BhdGguanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1ID0gcmVxdWlyZSg0Nik7XG5cbi8vIFNwbGl0IGEgZmlsZW5hbWUgaW50byBbcm9vdCwgZGlyLCBiYXNlbmFtZSwgZXh0XSwgdW5peCB2ZXJzaW9uXG4vLyAncm9vdCcgaXMganVzdCBhIHNsYXNoLCBvciBub3RoaW5nLlxudmFyIHNwbGl0UGF0aFJlID0gL14oXFwvP3wpKFtcXHNcXFNdKj8pKCg/OlxcLnsxLDJ9fFteXFwvXSs/fCkoXFwuW14uXFwvXSp8KSkoPzpbXFwvXSopJC87XG5cbmZ1bmN0aW9uIHNwbGl0UGF0aChmaWxlbmFtZSkge1xuICAgIHJldHVybiBzcGxpdFBhdGhSZS5leGVjKGZpbGVuYW1lKS5zbGljZSgxKTtcbn1cblxuLy8gcmVzb2x2ZXMgLiBhbmQgLi4gZWxlbWVudHMgaW4gYSBwYXRoIGFycmF5IHdpdGggZGlyZWN0b3J5IG5hbWVzIHRoZXJlXG4vLyBtdXN0IGJlIG5vIHNsYXNoZXMsIGVtcHR5IGVsZW1lbnRzLCBvciBkZXZpY2UgbmFtZXMgKGM6XFwpIGluIHRoZSBhcnJheVxuLy8gKHNvIGFsc28gbm8gbGVhZGluZyBhbmQgdHJhaWxpbmcgc2xhc2hlcyAtIGl0IGRvZXMgbm90IGRpc3Rpbmd1aXNoXG4vLyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgcGF0aHMpXG5mdW5jdGlvbiBub3JtYWxpemVBcnJheShwYXJ0cywgYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAvLyBpZiB0aGUgcGF0aCB0cmllcyB0byBnbyBhYm92ZSB0aGUgcm9vdCwgYHVwYCBlbmRzIHVwID4gMFxuICAgIHZhciB1cCA9IDA7XG5cbiAgICBmb3IgKHZhciBpID0gcGFydHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgdmFyIGxhc3QgPSBwYXJ0c1tpXTtcblxuICAgICAgICBpZiAobGFzdCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobGFzdCA9PT0gJy4uJykge1xuICAgICAgICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgdXArKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1cCkge1xuICAgICAgICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgdXAtLTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGlmIHRoZSBwYXRoIGlzIGFsbG93ZWQgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIHJlc3RvcmUgbGVhZGluZyAuLnNcbiAgICBpZiAoYWxsb3dBYm92ZVJvb3QpIHtcbiAgICAgICAgZm9yICg7IHVwLS07IHVwKSB7XG4gICAgICAgICAgICBwYXJ0cy51bnNoaWZ0KCcuLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhcnRzO1xufVxuXG4vLyBTdHJpbmcucHJvdG90eXBlLnN1YnN0ciAtIG5lZ2F0aXZlIGluZGV4IGRvbid0IHdvcmsgaW4gSUU4XG52YXIgc3Vic3RyID0gJ2FiJy5zdWJzdHIoLTEpID09PSAnYidcbiAgICA/IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfVxuICAgIDogZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICBzdGFydCA9IHN0ci5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9O1xuXG5leHBvcnRzLmV4dG5hbWUgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgIHJldHVybiBzcGxpdFBhdGgocGF0aClbM107XG59O1xuXG5leHBvcnRzLmpvaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhdGhzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICByZXR1cm4gZXhwb3J0cy5ub3JtYWxpemUodS5maWx0ZXIocGF0aHMsIGZ1bmN0aW9uIChwLCBpbmRleCkge1xuICAgICAgICBpZiAodHlwZW9mIHAgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudHMgdG8gcGF0aC5qb2luIG11c3QgYmUgc3RyaW5ncycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwO1xuICAgIH0pLmpvaW4oJy8nKSk7XG59O1xuXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgdmFyIGlzQWJzb2x1dGUgPSBwYXRoLmNoYXJBdCgwKSA9PT0gJy8nO1xuICAgIHZhciB0cmFpbGluZ1NsYXNoID0gc3Vic3RyKHBhdGgsIC0xKSA9PT0gJy8nO1xuXG4gICAgLy8gTm9ybWFsaXplIHRoZSBwYXRoXG4gICAgcGF0aCA9IG5vcm1hbGl6ZUFycmF5KHUuZmlsdGVyKHBhdGguc3BsaXQoJy8nKSwgZnVuY3Rpb24gKHApIHtcbiAgICAgICAgcmV0dXJuICEhcDtcbiAgICB9KSwgIWlzQWJzb2x1dGUpLmpvaW4oJy8nKTtcblxuICAgIGlmICghcGF0aCAmJiAhaXNBYnNvbHV0ZSkge1xuICAgICAgICBwYXRoID0gJy4nO1xuICAgIH1cbiAgICBpZiAocGF0aCAmJiB0cmFpbGluZ1NsYXNoKSB7XG4gICAgICAgIHBhdGggKz0gJy8nO1xuICAgIH1cblxuICAgIHJldHVybiAoaXNBYnNvbHV0ZSA/ICcvJyA6ICcnKSArIHBhdGg7XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSBzcmMvdmVuZG9yL3EuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoMzQpO1xuXG5leHBvcnRzLnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZS5hcHBseShQcm9taXNlLCBhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5yZWplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0LmFwcGx5KFByb21pc2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLmFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwuYXBwbHkoUHJvbWlzZSwgYXJndW1lbnRzKTtcbn07XG5cbmV4cG9ydHMuZmNhbGwgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZuKCkpO1xuICAgIH1cbiAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGV4KTtcbiAgICB9XG59O1xuXG5leHBvcnRzLmRlZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWZlcnJlZCA9IHt9O1xuXG4gICAgZGVmZXJyZWQucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc29sdmUuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVqZWN0LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQ7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHNyYy92ZW5kb3IvcXVlcnlzdHJpbmcuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1ID0gcmVxdWlyZSg0Nik7XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVByaW1pdGl2ZSh2KSB7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHYpKSB7XG4gICAgICAgIHJldHVybiAnJyArIHY7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgcmV0dXJuIHYgPyAndHJ1ZScgOiAnZmFsc2UnO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn1cblxuZXhwb3J0cy5zdHJpbmdpZnkgPSBmdW5jdGlvbiBzdHJpbmdpZnkob2JqLCBzZXAsIGVxLCBvcHRpb25zKSB7XG4gICAgc2VwID0gc2VwIHx8ICcmJztcbiAgICBlcSA9IGVxIHx8ICc9JztcblxuICAgIHZhciBlbmNvZGUgPSBlbmNvZGVVUklDb21wb25lbnQ7IC8vIFF1ZXJ5U3RyaW5nLmVzY2FwZTtcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5lbmNvZGVVUklDb21wb25lbnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW5jb2RlID0gb3B0aW9ucy5lbmNvZGVVUklDb21wb25lbnQ7XG4gICAgfVxuXG4gICAgaWYgKG9iaiAhPT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2YXIga2V5cyA9IHUua2V5cyhvYmopO1xuICAgICAgICB2YXIgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIHZhciBmbGFzdCA9IGxlbiAtIDE7XG4gICAgICAgIHZhciBmaWVsZHMgPSAnJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICAgICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgICAgICAgICAgdmFyIHYgPSBvYmpba107XG4gICAgICAgICAgICB2YXIga3MgPSBlbmNvZGUoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuXG4gICAgICAgICAgICBpZiAodS5pc0FycmF5KHYpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZsZW4gPSB2Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgdmxhc3QgPSB2bGVuIC0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHZsZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0ga3MgKyBlbmNvZGUoc3RyaW5naWZ5UHJpbWl0aXZlKHZbal0pKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGogPCB2bGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHNlcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh2bGVuICYmIGkgPCBmbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZpZWxkcyArPSBrcyArIGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICAgICAgICAgIGlmIChpIDwgZmxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHNlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG59O1xuIiwiLyoqXG4gKiBhZyAtLW5vLWZpbGVuYW1lIC1vICdcXGIodVxcLi4qPylcXCgnIC4gIHwgc29ydCB8IHVuaXEgLWNcbiAqXG4gKiBAZmlsZSB2ZW5kb3IvdW5kZXJzY29yZS5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKDUpO1xudmFyIG5vb3AgPSByZXF1aXJlKDEwKTtcbnZhciBpc051bWJlciA9IHJlcXVpcmUoMTMpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgxNCk7XG5cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gc3RyaW5nVGFnO1xufVxuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gZXh0ZW5kKHNvdXJjZSwgdmFyX2FyZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaWYgKGl0ZW0gJiYgaXNPYmplY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIHZhciBvS2V5cyA9IGtleXMoaXRlbSk7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG9LZXlzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IG9LZXlzW2pdO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgICAgICBzb3VyY2Vba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNvdXJjZTtcbn1cblxuZnVuY3Rpb24gbWFwKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdFtpXSA9IGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZm9yZWFjaChhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgYXJyYXlbaV0sIGksIGFycmF5KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbmQoYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWUsIGksIGFycmF5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXIoYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV07XG4gICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlLCBpLCBhcnJheSkpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBvbWl0KG9iamVjdCwgdmFyX2FyZ3MpIHtcbiAgICB2YXIgYXJncyA9IGlzQXJyYXkodmFyX2FyZ3MpXG4gICAgICAgID8gdmFyX2FyZ3NcbiAgICAgICAgOiBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICB2YXIgb0tleXMgPSBrZXlzKG9iamVjdCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0gb0tleXNbaV07XG4gICAgICAgIGlmIChhcmdzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBwaWNrKG9iamVjdCwgdmFyX2FyZ3MsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICB2YXIgaTtcbiAgICB2YXIga2V5O1xuICAgIHZhciB2YWx1ZTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHZhcl9hcmdzKSkge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB2YXJfYXJncztcbiAgICAgICAgdmFyIG9LZXlzID0ga2V5cyhvYmplY3QpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgb0tleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGtleSA9IG9LZXlzW2ldO1xuICAgICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgYXJncyA9IGlzQXJyYXkodmFyX2FyZ3MpXG4gICAgICAgICAgICA/IHZhcl9hcmdzXG4gICAgICAgICAgICA6IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAga2V5ID0gYXJnc1tpXTtcbiAgICAgICAgICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBiaW5kKGZuLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfTtcbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBoYXNEb250RW51bUJ1ZyA9ICEoe3RvU3RyaW5nOiBudWxsfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG52YXIgZG9udEVudW1zID0gWyd0b1N0cmluZycsICd0b0xvY2FsZVN0cmluZycsICd2YWx1ZU9mJywgJ2hhc093blByb3BlcnR5JyxcbiAgICAnaXNQcm90b3R5cGVPZicsICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdjb25zdHJ1Y3RvciddO1xuXG5mdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgcHJvcDtcbiAgICB2YXIgaTtcblxuICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzRG9udEVudW1CdWcpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRvbnRFbnVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBkb250RW51bXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZG9udEVudW1zW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydHMuYmluZCA9IGJpbmQ7XG5leHBvcnRzLmVhY2ggPSBmb3JlYWNoO1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG5leHBvcnRzLmZpbHRlciA9IGZpbHRlcjtcbmV4cG9ydHMuZmluZCA9IGZpbmQ7XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbmV4cG9ydHMubWFwID0gbWFwO1xuZXhwb3J0cy5vbWl0ID0gb21pdDtcbmV4cG9ydHMucGljayA9IHBpY2s7XG5leHBvcnRzLmtleXMgPSBrZXlzO1xuZXhwb3J0cy5ub29wID0gbm9vcDtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvdXRpbC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHUgPSByZXF1aXJlKDQ2KTtcblxuZXhwb3J0cy5pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICAgIHZhciBzdWJDbGFzc1Byb3RvID0gc3ViQ2xhc3MucHJvdG90eXBlO1xuICAgIHZhciBGID0gbmV3IEZ1bmN0aW9uKCk7XG4gICAgRi5wcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBuZXcgRigpO1xuICAgIHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzO1xuICAgIHUuZXh0ZW5kKHN1YkNsYXNzLnByb3RvdHlwZSwgc3ViQ2xhc3NQcm90byk7XG59O1xuXG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgdmFyIGFyZ0xlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICBpZiAoYXJnTGVuID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIHZhciBzdHIgPSAnJztcbiAgICB2YXIgYSA9IDE7XG4gICAgdmFyIGxhc3RQb3MgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZi5sZW5ndGg7KSB7XG4gICAgICAgIGlmIChmLmNoYXJDb2RlQXQoaSkgPT09IDM3IC8qKiAnJScgKi8gJiYgaSArIDEgPCBmLmxlbmd0aCkge1xuICAgICAgICAgICAgc3dpdGNoIChmLmNoYXJDb2RlQXQoaSArIDEpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMDA6IC8vICdkJ1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA+PSBhcmdMZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBOdW1iZXIoYXJndW1lbnRzW2ErK10pO1xuICAgICAgICAgICAgICAgICAgICBsYXN0UG9zID0gaSA9IGkgKyAyO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDExNTogLy8gJ3MnXG4gICAgICAgICAgICAgICAgICAgIGlmIChhID49IGFyZ0xlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IFN0cmluZyhhcmd1bWVudHNbYSsrXSk7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RQb3MgPSBpID0gaSArIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgMzc6IC8vICclJ1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9ICclJztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBvcyA9IGkgPSBpICsgMjtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICArK2k7XG4gICAgfVxuXG4gICAgaWYgKGxhc3RQb3MgPT09IDApIHtcbiAgICAgICAgc3RyID0gZjtcbiAgICB9XG4gICAgZWxzZSBpZiAobGFzdFBvcyA8IGYubGVuZ3RoKSB7XG4gICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG59O1xuIl19
