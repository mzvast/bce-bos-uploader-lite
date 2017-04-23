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

    // 分块上传时,是否允许断点续传，默认(false)
    bos_multipart_auto_continue: false,

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy5tYXBsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmRvcGFyYWxsZWxsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmVhY2hvZmxpbWl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwuaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmlzYXJyYXlsaWtlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwua2V5aXRlcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwubWFwYXN5bmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5ub29wL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwub25jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLm9ubHlvbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc251bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCJzcmMvYmNlLXNkay1qcy9hdXRoLmpzIiwic3JjL2JjZS1zZGstanMvYmNlX2Jhc2VfY2xpZW50LmpzIiwic3JjL2JjZS1zZGstanMvYm9zX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL2NvbmZpZy5qcyIsInNyYy9iY2Utc2RrLWpzL2hlYWRlcnMuanMiLCJzcmMvYmNlLXNkay1qcy9odHRwX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL21pbWUudHlwZXMuanMiLCJzcmMvYmNlLXNkay1qcy9zdHJpbmdzLmpzIiwic3JjL2NvbmZpZy5qcyIsInNyYy9ldmVudHMuanMiLCJzcmMvbXVsdGlwYXJ0X3Rhc2suanMiLCJzcmMvbmV0d29ya19pbmZvLmpzIiwic3JjL3B1dF9vYmplY3RfdGFzay5qcyIsInNyYy9xdWV1ZS5qcyIsInNyYy9zdHNfdG9rZW5fbWFuYWdlci5qcyIsInNyYy90YXNrLmpzIiwic3JjL3VwbG9hZGVyLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlbmRvci9CdWZmZXIuanMiLCJzcmMvdmVuZG9yL1Byb21pc2UuanMiLCJzcmMvdmVuZG9yL2FzeW5jLmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvY29yZS5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL2htYWMtc2hhMjU2LmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvaG1hYy5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL3NoYTI1Ni5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLmpzIiwic3JjL3ZlbmRvci9ldmVudHMuanMiLCJzcmMvdmVuZG9yL2hlbHBlci5qcyIsInNyYy92ZW5kb3IvcGF0aC5qcyIsInNyYy92ZW5kb3IvcS5qcyIsInNyYy92ZW5kb3IvcXVlcnlzdHJpbmcuanMiLCJzcmMvdmVuZG9yL3VuZGVyc2NvcmUuanMiLCJzcmMvdmVuZG9yL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgYmNlLWJvcy11cGxvYWRlci9pbmRleC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciBCb3NDbGllbnQgPSByZXF1aXJlKDE3KTtcbnZhciBBdXRoID0gcmVxdWlyZSgxNSk7XG5cbnZhciBVcGxvYWRlciA9IHJlcXVpcmUoMzEpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGJvczoge1xuICAgICAgICBVcGxvYWRlcjogVXBsb2FkZXJcbiAgICB9LFxuICAgIHV0aWxzOiB1dGlscyxcbiAgICBzZGs6IHtcbiAgICAgICAgUTogUSxcbiAgICAgICAgQm9zQ2xpZW50OiBCb3NDbGllbnQsXG4gICAgICAgIEF1dGg6IEF1dGhcbiAgICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIG1hcEFzeW5jID0gcmVxdWlyZSg5KTtcbnZhciBkb1BhcmFsbGVsTGltaXQgPSByZXF1aXJlKDMpO1xubW9kdWxlLmV4cG9ydHMgPSBkb1BhcmFsbGVsTGltaXQobWFwQXN5bmMpO1xuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGVhY2hPZkxpbWl0ID0gcmVxdWlyZSg0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkb1BhcmFsbGVsTGltaXQoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBsaW1pdCwgaXRlcmF0b3IsIGNiKSB7XG4gICAgICAgIHJldHVybiBmbihlYWNoT2ZMaW1pdChsaW1pdCksIG9iaiwgaXRlcmF0b3IsIGNiKTtcbiAgICB9O1xufTtcbiIsInZhciBvbmNlID0gcmVxdWlyZSgxMSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoMTApO1xudmFyIG9ubHlPbmNlID0gcmVxdWlyZSgxMik7XG52YXIga2V5SXRlcmF0b3IgPSByZXF1aXJlKDcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVhY2hPZkxpbWl0KGxpbWl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNiKSB7XG4gICAgICAgIGNiID0gb25jZShjYiB8fCBub29wKTtcbiAgICAgICAgb2JqID0gb2JqIHx8IFtdO1xuICAgICAgICB2YXIgbmV4dEtleSA9IGtleUl0ZXJhdG9yKG9iaik7XG4gICAgICAgIGlmIChsaW1pdCA8PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgICAgdmFyIHJ1bm5pbmcgPSAwO1xuICAgICAgICB2YXIgZXJyb3JlZCA9IGZhbHNlO1xuXG4gICAgICAgIChmdW5jdGlvbiByZXBsZW5pc2goKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSAmJiBydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2IobnVsbCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChydW5uaW5nIDwgbGltaXQgJiYgIWVycm9yZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gbmV4dEtleSgpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChydW5uaW5nIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcnVubmluZyArPSAxO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yKG9ialtrZXldLCBrZXksIG9ubHlPbmNlKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICBydW5uaW5nIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxlbmlzaCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoNSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBcnJheUxpa2UoYXJyKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkoYXJyKSB8fCAoXG4gICAgICAgIC8vIGhhcyBhIHBvc2l0aXZlIGludGVnZXIgbGVuZ3RoIHByb3BlcnR5XG4gICAgICAgIHR5cGVvZiBhcnIubGVuZ3RoID09PSAnbnVtYmVyJyAmJlxuICAgICAgICBhcnIubGVuZ3RoID49IDAgJiZcbiAgICAgICAgYXJyLmxlbmd0aCAlIDEgPT09IDBcbiAgICApO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9rZXlzID0gcmVxdWlyZSg4KTtcbnZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoNik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ga2V5SXRlcmF0b3IoY29sbCkge1xuICAgIHZhciBpID0gLTE7XG4gICAgdmFyIGxlbjtcbiAgICB2YXIga2V5cztcbiAgICBpZiAoaXNBcnJheUxpa2UoY29sbCkpIHtcbiAgICAgICAgbGVuID0gY29sbC5sZW5ndGg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBpIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBrZXlzID0gX2tleXMoY29sbCk7XG4gICAgICAgIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIHJldHVybiBpIDwgbGVuID8ga2V5c1tpXSA6IG51bGw7XG4gICAgICAgIH07XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIHZhciBfa2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgIF9rZXlzLnB1c2goayk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9rZXlzO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9uY2UgPSByZXF1aXJlKDExKTtcbnZhciBub29wID0gcmVxdWlyZSgxMCk7XG52YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKDYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hcEFzeW5jKGVhY2hmbiwgYXJyLCBpdGVyYXRvciwgY2IpIHtcbiAgICBjYiA9IG9uY2UoY2IgfHwgbm9vcCk7XG4gICAgYXJyID0gYXJyIHx8IFtdO1xuICAgIHZhciByZXN1bHRzID0gaXNBcnJheUxpa2UoYXJyKSA/IFtdIDoge307XG4gICAgZWFjaGZuKGFyciwgZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgY2IpIHtcbiAgICAgICAgaXRlcmF0b3IodmFsdWUsIGZ1bmN0aW9uIChlcnIsIHYpIHtcbiAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdID0gdjtcbiAgICAgICAgICAgIGNiKGVycik7XG4gICAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY2IoZXJyLCByZXN1bHRzKTtcbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9vcCAoKSB7fTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZm4gPT09IG51bGwpIHJldHVybjtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9ubHlfb25jZShmbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZuID09PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0NhbGxiYWNrIHdhcyBhbHJlYWR5IGNhbGxlZC4nKTtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgZm4gPSBudWxsO1xuICAgIH07XG59O1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjMgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTYgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNiBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE51bWJlcmAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVG8gZXhjbHVkZSBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYW5kIGBOYU5gLCB3aGljaCBhcmUgY2xhc3NpZmllZFxuICogYXMgbnVtYmVycywgdXNlIHRoZSBgXy5pc0Zpbml0ZWAgbWV0aG9kLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTnVtYmVyKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcignMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IG51bWJlclRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOdW1iZXI7XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMiAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZGVybiBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCAyMDEyLTIwMTUgVGhlIERvam8gRm91bmRhdGlvbiA8aHR0cDovL2Rvam9mb3VuZGF0aW9uLm9yZy8+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICogQXZhaWxhYmxlIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqL1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZSBbbGFuZ3VhZ2UgdHlwZV0oaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyN4OCkgb2YgYE9iamVjdGAuXG4gKiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgLy8gQXZvaWQgYSBWOCBKSVQgYnVnIGluIENocm9tZSAxOS0yMC5cbiAgLy8gU2VlIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0yMjkxIGZvciBtb3JlIGRldGFpbHMuXG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYXV0aC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG4vKiBlc2xpbnQgbWF4LXBhcmFtczpbMCwxMF0gKi9cblxudmFyIGhlbHBlciA9IHJlcXVpcmUoNDIpO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgSCA9IHJlcXVpcmUoMTkpO1xudmFyIHN0cmluZ3MgPSByZXF1aXJlKDIyKTtcblxuLyoqXG4gKiBBdXRoXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge3N0cmluZ30gYWsgVGhlIGFjY2VzcyBrZXkuXG4gKiBAcGFyYW0ge3N0cmluZ30gc2sgVGhlIHNlY3VyaXR5IGtleS5cbiAqL1xuZnVuY3Rpb24gQXV0aChhaywgc2spIHtcbiAgICB0aGlzLmFrID0gYWs7XG4gICAgdGhpcy5zayA9IHNrO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIHRoZSBzaWduYXR1cmUgYmFzZWQgb24gaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQXV0aGVudGljYXRpb25NZWNoYW5pc21cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kIFRoZSBodHRwIHJlcXVlc3QgbWV0aG9kLCBzdWNoIGFzIEdFVCwgUE9TVCwgREVMRVRFLCBQVVQsIC4uLlxuICogQHBhcmFtIHtzdHJpbmd9IHJlc291cmNlIFRoZSByZXF1ZXN0IHBhdGguXG4gKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyBUaGUgcXVlcnkgc3RyaW5ncy5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBUaGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKiBAcGFyYW0ge251bWJlcj19IHRpbWVzdGFtcCBTZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wLlxuICogQHBhcmFtIHtudW1iZXI9fSBleHBpcmF0aW9uSW5TZWNvbmRzIFRoZSBzaWduYXR1cmUgdmFsaWRhdGlvbiB0aW1lLlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGhlYWRlcnNUb1NpZ24gVGhlIHJlcXVlc3QgaGVhZGVycyBsaXN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBjYWxjdWFsYXRlIHRoZSBzaWduYXR1cmUuXG4gKlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgc2lnbmF0dXJlLlxuICovXG5BdXRoLnByb3RvdHlwZS5nZW5lcmF0ZUF1dGhvcml6YXRpb24gPSBmdW5jdGlvbiAobWV0aG9kLCByZXNvdXJjZSwgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnMsIHRpbWVzdGFtcCwgZXhwaXJhdGlvbkluU2Vjb25kcywgaGVhZGVyc1RvU2lnbikge1xuXG4gICAgdmFyIG5vdyA9IHRpbWVzdGFtcCA/IG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApIDogbmV3IERhdGUoKTtcbiAgICB2YXIgcmF3U2Vzc2lvbktleSA9IHV0aWwuZm9ybWF0KCdiY2UtYXV0aC12MS8lcy8lcy8lZCcsXG4gICAgICAgIHRoaXMuYWssIGhlbHBlci50b1VUQ1N0cmluZyhub3cpLCBleHBpcmF0aW9uSW5TZWNvbmRzIHx8IDE4MDApO1xuICAgIHZhciBzZXNzaW9uS2V5ID0gdGhpcy5oYXNoKHJhd1Nlc3Npb25LZXksIHRoaXMuc2spO1xuXG4gICAgdmFyIGNhbm9uaWNhbFVyaSA9IHRoaXMudXJpQ2Fub25pY2FsaXphdGlvbihyZXNvdXJjZSk7XG4gICAgdmFyIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gdGhpcy5xdWVyeVN0cmluZ0Nhbm9uaWNhbGl6YXRpb24ocGFyYW1zIHx8IHt9KTtcblxuICAgIHZhciBydiA9IHRoaXMuaGVhZGVyc0Nhbm9uaWNhbGl6YXRpb24oaGVhZGVycyB8fCB7fSwgaGVhZGVyc1RvU2lnbik7XG4gICAgdmFyIGNhbm9uaWNhbEhlYWRlcnMgPSBydlswXTtcbiAgICB2YXIgc2lnbmVkSGVhZGVycyA9IHJ2WzFdO1xuXG4gICAgdmFyIHJhd1NpZ25hdHVyZSA9IHV0aWwuZm9ybWF0KCclc1xcbiVzXFxuJXNcXG4lcycsXG4gICAgICAgIG1ldGhvZCwgY2Fub25pY2FsVXJpLCBjYW5vbmljYWxRdWVyeVN0cmluZywgY2Fub25pY2FsSGVhZGVycyk7XG4gICAgdmFyIHNpZ25hdHVyZSA9IHRoaXMuaGFzaChyYXdTaWduYXR1cmUsIHNlc3Npb25LZXkpO1xuXG4gICAgaWYgKHNpZ25lZEhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXMvJXMvJXMnLCByYXdTZXNzaW9uS2V5LCBzaWduZWRIZWFkZXJzLmpvaW4oJzsnKSwgc2lnbmF0dXJlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzLy8lcycsIHJhd1Nlc3Npb25LZXksIHNpZ25hdHVyZSk7XG59O1xuXG5BdXRoLnByb3RvdHlwZS51cmlDYW5vbmljYWxpemF0aW9uID0gZnVuY3Rpb24gKHVyaSkge1xuICAgIHJldHVybiB1cmk7XG59O1xuXG4vKipcbiAqIENhbm9uaWNhbCB0aGUgcXVlcnkgc3RyaW5ncy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0F1dGhlbnRpY2F0aW9uTWVjaGFuaXNtI+eUn+aIkENhbm9uaWNhbFF1ZXJ5U3RyaW5nXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFRoZSBxdWVyeSBzdHJpbmdzLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5BdXRoLnByb3RvdHlwZS5xdWVyeVN0cmluZ0Nhbm9uaWNhbGl6YXRpb24gPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nID0gW107XG4gICAgdS5lYWNoKHUua2V5cyhwYXJhbXMpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkudG9Mb3dlckNhc2UoKSA9PT0gSC5BVVRIT1JJWkFUSU9OLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcmFtc1trZXldID09IG51bGwgPyAnJyA6IHBhcmFtc1trZXldO1xuICAgICAgICBjYW5vbmljYWxRdWVyeVN0cmluZy5wdXNoKGtleSArICc9JyArIHN0cmluZ3Mubm9ybWFsaXplKHZhbHVlKSk7XG4gICAgfSk7XG5cbiAgICBjYW5vbmljYWxRdWVyeVN0cmluZy5zb3J0KCk7XG5cbiAgICByZXR1cm4gY2Fub25pY2FsUXVlcnlTdHJpbmcuam9pbignJicpO1xufTtcblxuLyoqXG4gKiBDYW5vbmljYWwgdGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICpcbiAqIEBzZWUgaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQXV0aGVudGljYXRpb25NZWNoYW5pc20j55Sf5oiQQ2Fub25pY2FsSGVhZGVyc1xuICogQHBhcmFtIHtPYmplY3R9IGhlYWRlcnMgVGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICogQHBhcmFtIHtBcnJheS48c3RyaW5nPj19IGhlYWRlcnNUb1NpZ24gVGhlIHJlcXVlc3QgaGVhZGVycyBsaXN0IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBjYWxjdWFsYXRlIHRoZSBzaWduYXR1cmUuXG4gKiBAcmV0dXJuIHsqfSBjYW5vbmljYWxIZWFkZXJzIGFuZCBzaWduZWRIZWFkZXJzXG4gKi9cbkF1dGgucHJvdG90eXBlLmhlYWRlcnNDYW5vbmljYWxpemF0aW9uID0gZnVuY3Rpb24gKGhlYWRlcnMsIGhlYWRlcnNUb1NpZ24pIHtcbiAgICBpZiAoIWhlYWRlcnNUb1NpZ24gfHwgIWhlYWRlcnNUb1NpZ24ubGVuZ3RoKSB7XG4gICAgICAgIGhlYWRlcnNUb1NpZ24gPSBbSC5IT1NULCBILkNPTlRFTlRfTUQ1LCBILkNPTlRFTlRfTEVOR1RILCBILkNPTlRFTlRfVFlQRV07XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnNNYXAgPSB7fTtcbiAgICB1LmVhY2goaGVhZGVyc1RvU2lnbiwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaGVhZGVyc01hcFtpdGVtLnRvTG93ZXJDYXNlKCldID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHZhciBjYW5vbmljYWxIZWFkZXJzID0gW107XG4gICAgdS5lYWNoKHUua2V5cyhoZWFkZXJzKSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBoZWFkZXJzW2tleV07XG4gICAgICAgIHZhbHVlID0gdS5pc1N0cmluZyh2YWx1ZSkgPyBzdHJpbmdzLnRyaW0odmFsdWUpIDogdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAoL154XFwtYmNlXFwtLy50ZXN0KGtleSkgfHwgaGVhZGVyc01hcFtrZXldID09PSB0cnVlKSB7XG4gICAgICAgICAgICBjYW5vbmljYWxIZWFkZXJzLnB1c2godXRpbC5mb3JtYXQoJyVzOiVzJyxcbiAgICAgICAgICAgICAgICAvLyBlbmNvZGVVUklDb21wb25lbnQoa2V5KSwgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKSkpO1xuICAgICAgICAgICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGtleSksIHN0cmluZ3Mubm9ybWFsaXplKHZhbHVlKSkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBjYW5vbmljYWxIZWFkZXJzLnNvcnQoKTtcblxuICAgIHZhciBzaWduZWRIZWFkZXJzID0gW107XG4gICAgdS5lYWNoKGNhbm9uaWNhbEhlYWRlcnMsIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHNpZ25lZEhlYWRlcnMucHVzaChpdGVtLnNwbGl0KCc6JylbMF0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFtjYW5vbmljYWxIZWFkZXJzLmpvaW4oJ1xcbicpLCBzaWduZWRIZWFkZXJzXTtcbn07XG5cbkF1dGgucHJvdG90eXBlLmhhc2ggPSBmdW5jdGlvbiAoZGF0YSwga2V5KSB7XG4gICAgdmFyIGNyeXB0byA9IHJlcXVpcmUoNDApO1xuICAgIHZhciBzaGEyNTZIbWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTI1NicsIGtleSk7XG4gICAgc2hhMjU2SG1hYy51cGRhdGUoZGF0YSk7XG4gICAgcmV0dXJuIHNoYTI1NkhtYWMuZGlnZXN0KCdoZXgnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXV0aDtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYmNlX2Jhc2VfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoNDEpLkV2ZW50RW1pdHRlcjtcbnZhciB1dGlsID0gcmVxdWlyZSg0Nyk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBjb25maWcgPSByZXF1aXJlKDE4KTtcbnZhciBBdXRoID0gcmVxdWlyZSgxNSk7XG5cbi8qKlxuICogQmNlQmFzZUNsaWVudFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNsaWVudENvbmZpZyBUaGUgYmNlIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHNlcnZpY2VJZCBUaGUgc2VydmljZSBpZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHJlZ2lvblN1cHBvcnRlZCBUaGUgc2VydmljZSBzdXBwb3J0ZWQgcmVnaW9uIG9yIG5vdC5cbiAqL1xuZnVuY3Rpb24gQmNlQmFzZUNsaWVudChjbGllbnRDb25maWcsIHNlcnZpY2VJZCwgcmVnaW9uU3VwcG9ydGVkKSB7XG4gICAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHUuZXh0ZW5kKHt9LCBjb25maWcuREVGQVVMVF9DT05GSUcsIGNsaWVudENvbmZpZyk7XG4gICAgdGhpcy5zZXJ2aWNlSWQgPSBzZXJ2aWNlSWQ7XG4gICAgdGhpcy5yZWdpb25TdXBwb3J0ZWQgPSAhIXJlZ2lvblN1cHBvcnRlZDtcblxuICAgIHRoaXMuY29uZmlnLmVuZHBvaW50ID0gdGhpcy5fY29tcHV0ZUVuZHBvaW50KCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SHR0cENsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLl9odHRwQWdlbnQgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhCY2VCYXNlQ2xpZW50LCBFdmVudEVtaXR0ZXIpO1xuXG5CY2VCYXNlQ2xpZW50LnByb3RvdHlwZS5fY29tcHV0ZUVuZHBvaW50ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5lbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZW5kcG9pbnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVnaW9uU3VwcG9ydGVkKSB7XG4gICAgICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXM6Ly8lcy4lcy4lcycsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5wcm90b2NvbCxcbiAgICAgICAgICAgIHRoaXMuc2VydmljZUlkLFxuICAgICAgICAgICAgdGhpcy5jb25maWcucmVnaW9uLFxuICAgICAgICAgICAgY29uZmlnLkRFRkFVTFRfU0VSVklDRV9ET01BSU4pO1xuICAgIH1cbiAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzOi8vJXMuJXMnLFxuICAgICAgICB0aGlzLmNvbmZpZy5wcm90b2NvbCxcbiAgICAgICAgdGhpcy5zZXJ2aWNlSWQsXG4gICAgICAgIGNvbmZpZy5ERUZBVUxUX1NFUlZJQ0VfRE9NQUlOKTtcbn07XG5cbkJjZUJhc2VDbGllbnQucHJvdG90eXBlLmNyZWF0ZVNpZ25hdHVyZSA9IGZ1bmN0aW9uIChjcmVkZW50aWFscywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIFEuZmNhbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKGNyZWRlbnRpYWxzLmFrLCBjcmVkZW50aWFscy5zayk7XG4gICAgICAgIHJldHVybiBhdXRoLmdlbmVyYXRlQXV0aG9yaXphdGlvbihodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCY2VCYXNlQ2xpZW50O1xuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9ib3NfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cbi8qIGVzbGludCBtYXgtcGFyYW1zOlswLDEwXSAqL1xuXG52YXIgcGF0aCA9IHJlcXVpcmUoNDMpO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgzMyk7XG52YXIgSCA9IHJlcXVpcmUoMTkpO1xudmFyIHN0cmluZ3MgPSByZXF1aXJlKDIyKTtcbnZhciBIdHRwQ2xpZW50ID0gcmVxdWlyZSgyMCk7XG52YXIgQmNlQmFzZUNsaWVudCA9IHJlcXVpcmUoMTYpO1xudmFyIE1pbWVUeXBlID0gcmVxdWlyZSgyMSk7XG5cbnZhciBNQVhfUFVUX09CSkVDVF9MRU5HVEggPSA1MzY4NzA5MTIwOyAgICAgLy8gNUdcbnZhciBNQVhfVVNFUl9NRVRBREFUQV9TSVpFID0gMjA0ODsgICAgICAgICAgLy8gMiAqIDEwMjRcblxuLyoqXG4gKiBCT1Mgc2VydmljZSBhcGlcbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0JPU19BUEkjQk9TLUFQSeaWh+aho1xuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgYm9zIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICogQGV4dGVuZHMge0JjZUJhc2VDbGllbnR9XG4gKi9cbmZ1bmN0aW9uIEJvc0NsaWVudChjb25maWcpIHtcbiAgICBCY2VCYXNlQ2xpZW50LmNhbGwodGhpcywgY29uZmlnLCAnYm9zJywgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7SHR0cENsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLl9odHRwQWdlbnQgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhCb3NDbGllbnQsIEJjZUJhc2VDbGllbnQpO1xuXG4vLyAtLS0gQiBFIEcgSSBOIC0tLVxuQm9zQ2xpZW50LnByb3RvdHlwZS5kZWxldGVPYmplY3QgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnREVMRVRFJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5wdXRPYmplY3QgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBkYXRhLCBvcHRpb25zKSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigna2V5IHNob3VsZCBub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9KTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQVVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUucHV0T2JqZWN0RnJvbUJsb2IgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBibG9iLCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9CbG9iL3NpemVcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gYmxvYi5zaXplO1xuICAgIC8vIOWvueS6jua1j+iniOWZqOiwg+eUqEFQSeeahOaXtuWAme+8jOm7mOiupOS4jea3u+WKoCBILkNPTlRFTlRfTUQ1IOWtl+aute+8jOWboOS4uuiuoeeul+i1t+adpeavlOi+g+aFolxuICAgIC8vIOiAjOS4lOagueaNriBBUEkg5paH5qGj77yM6L+Z5Liq5a2X5q615LiN5piv5b+F5aGr55qE44CCXG4gICAgb3B0aW9ucyA9IHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMucHV0T2JqZWN0KGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb3B0aW9ucyk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmdldE9iamVjdE1ldGFkYXRhID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0hFQUQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmluaXRpYXRlTXVsdGlwYXJ0VXBsb2FkID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9IG9wdGlvbnNbSC5DT05URU5UX1RZUEVdIHx8IE1pbWVUeXBlLmd1ZXNzKHBhdGguZXh0bmFtZShrZXkpKTtcbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUE9TVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHBhcmFtczoge3VwbG9hZHM6ICcnfSxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5hYm9ydE11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnREVMRVRFJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgcGFyYW1zOiB7dXBsb2FkSWQ6IHVwbG9hZElkfSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBwYXJ0TGlzdCwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCc7XG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyh1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUE9TVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtwYXJ0czogcGFydExpc3R9KSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IHt1cGxvYWRJZDogdXBsb2FkSWR9LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnVwbG9hZFBhcnRGcm9tQmxvYiA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBwYXJ0TnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFydFNpemUsIGJsb2IsIG9wdGlvbnMpIHtcbiAgICBpZiAoYmxvYi5zaXplICE9PSBwYXJ0U2l6ZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHV0aWwuZm9ybWF0KCdJbnZhbGlkIHBhcnRTaXplICVkIGFuZCBkYXRhIGxlbmd0aCAlZCcsXG4gICAgICAgICAgICBwYXJ0U2l6ZSwgYmxvYi5zaXplKSk7XG4gICAgfVxuXG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gcGFydFNpemU7XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnModS5leHRlbmQoaGVhZGVycywgb3B0aW9ucykpO1xuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQVVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBibG9iLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgcGFydE51bWJlcjogcGFydE51bWJlcixcbiAgICAgICAgICAgIHVwbG9hZElkOiB1cGxvYWRJZFxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmxpc3RQYXJ0cyA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIHVwbG9hZElkLCBvcHRpb25zKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSovXG4gICAgaWYgKCF1cGxvYWRJZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1cGxvYWRJZCBzaG91bGQgbm90IGVtcHR5Jyk7XG4gICAgfVxuICAgIC8qZXNsaW50LWVuYWJsZSovXG5cbiAgICB2YXIgYWxsb3dlZFBhcmFtcyA9IFsnbWF4UGFydHMnLCAncGFydE51bWJlck1hcmtlcicsICd1cGxvYWRJZCddO1xuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSwgYWxsb3dlZFBhcmFtcyk7XG4gICAgb3B0aW9ucy5wYXJhbXMudXBsb2FkSWQgPSB1cGxvYWRJZDtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdHRVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwYXJhbXM6IG9wdGlvbnMucGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmxpc3RNdWx0aXBhcnRVcGxvYWRzID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZFBhcmFtcyA9IFsnZGVsaW1pdGVyJywgJ21heFVwbG9hZHMnLCAna2V5TWFya2VyJywgJ3ByZWZpeCcsICd1cGxvYWRzJ107XG5cbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKG9wdGlvbnMgfHwge30sIGFsbG93ZWRQYXJhbXMpO1xuICAgIG9wdGlvbnMucGFyYW1zLnVwbG9hZHMgPSAnJztcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdHRVQnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIHBhcmFtczogb3B0aW9ucy5wYXJhbXMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuYXBwZW5kT2JqZWN0ID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgZGF0YSwgb2Zmc2V0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigna2V5IHNob3VsZCBub3QgYmUgZW1wdHkuJyk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9KTtcbiAgICB2YXIgcGFyYW1zID0ge2FwcGVuZDogJyd9O1xuICAgIGlmICh1LmlzTnVtYmVyKG9mZnNldCkpIHtcbiAgICAgICAgcGFyYW1zLm9mZnNldCA9IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BPU1QnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBkYXRhLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmFwcGVuZE9iamVjdEZyb21CbG9iID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb2Zmc2V0LCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9CbG9iL3NpemVcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gYmxvYi5zaXplO1xuICAgIC8vIOWvueS6jua1j+iniOWZqOiwg+eUqEFQSeeahOaXtuWAme+8jOm7mOiupOS4jea3u+WKoCBILkNPTlRFTlRfTUQ1IOWtl+aute+8jOWboOS4uuiuoeeul+i1t+adpeavlOi+g+aFolxuICAgIC8vIOiAjOS4lOagueaNriBBUEkg5paH5qGj77yM6L+Z5Liq5a2X5q615LiN5piv5b+F5aGr55qE44CCXG4gICAgb3B0aW9ucyA9IHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMuYXBwZW5kT2JqZWN0KGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb2Zmc2V0LCBvcHRpb25zKTtcbn07XG5cbi8vIC0tLSBFIE4gRCAtLS1cblxuQm9zQ2xpZW50LnByb3RvdHlwZS5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCB2YXJBcmdzKSB7XG4gICAgdmFyIGRlZmF1bHRBcmdzID0ge1xuICAgICAgICBidWNrZXROYW1lOiBudWxsLFxuICAgICAgICBrZXk6IG51bGwsXG4gICAgICAgIGJvZHk6IG51bGwsXG4gICAgICAgIGhlYWRlcnM6IHt9LFxuICAgICAgICBwYXJhbXM6IHt9LFxuICAgICAgICBjb25maWc6IHt9LFxuICAgICAgICBvdXRwdXRTdHJlYW06IG51bGxcbiAgICB9O1xuICAgIHZhciBhcmdzID0gdS5leHRlbmQoZGVmYXVsdEFyZ3MsIHZhckFyZ3MpO1xuXG4gICAgdmFyIGNvbmZpZyA9IHUuZXh0ZW5kKHt9LCB0aGlzLmNvbmZpZywgYXJncy5jb25maWcpO1xuICAgIHZhciByZXNvdXJjZSA9IFtcbiAgICAgICAgJy92MScsXG4gICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGFyZ3MuYnVja2V0TmFtZSB8fCAnJyksXG4gICAgICAgIHN0cmluZ3Mubm9ybWFsaXplKGFyZ3Mua2V5IHx8ICcnLCBmYWxzZSlcbiAgICBdLmpvaW4oJy8nKTtcblxuICAgIGlmIChjb25maWcuc2Vzc2lvblRva2VuKSB7XG4gICAgICAgIGFyZ3MuaGVhZGVyc1tILlNFU1NJT05fVE9LRU5dID0gY29uZmlnLnNlc3Npb25Ub2tlbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kSFRUUFJlcXVlc3QoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MsIGNvbmZpZyk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnNlbmRIVFRQUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncywgY29uZmlnKSB7XG4gICAgdmFyIGNsaWVudCA9IHRoaXM7XG4gICAgdmFyIGFnZW50ID0gdGhpcy5faHR0cEFnZW50ID0gbmV3IEh0dHBDbGllbnQoY29uZmlnKTtcblxuICAgIHZhciBodHRwQ29udGV4dCA9IHtcbiAgICAgICAgaHR0cE1ldGhvZDogaHR0cE1ldGhvZCxcbiAgICAgICAgcmVzb3VyY2U6IHJlc291cmNlLFxuICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICBjb25maWc6IGNvbmZpZ1xuICAgIH07XG4gICAgdS5lYWNoKFsncHJvZ3Jlc3MnLCAnZXJyb3InLCAnYWJvcnQnXSwgZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICBhZ2VudC5vbihldmVudE5hbWUsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGNsaWVudC5lbWl0KGV2ZW50TmFtZSwgZXZ0LCBodHRwQ29udGV4dCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIHByb21pc2UgPSB0aGlzLl9odHRwQWdlbnQuc2VuZFJlcXVlc3QoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MuYm9keSxcbiAgICAgICAgYXJncy5oZWFkZXJzLCBhcmdzLnBhcmFtcywgdS5iaW5kKHRoaXMuY3JlYXRlU2lnbmF0dXJlLCB0aGlzKSxcbiAgICAgICAgYXJncy5vdXRwdXRTdHJlYW1cbiAgICApO1xuXG4gICAgcHJvbWlzZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGFnZW50Ll9yZXEgJiYgYWdlbnQuX3JlcS54aHIpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBhZ2VudC5fcmVxLnhocjtcbiAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBwcm9taXNlO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5fY2hlY2tPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMsIGFsbG93ZWRQYXJhbXMpIHtcbiAgICB2YXIgcnYgPSB7fTtcblxuICAgIHJ2LmNvbmZpZyA9IG9wdGlvbnMuY29uZmlnIHx8IHt9O1xuICAgIHJ2LmhlYWRlcnMgPSB0aGlzLl9wcmVwYXJlT2JqZWN0SGVhZGVycyhvcHRpb25zKTtcbiAgICBydi5wYXJhbXMgPSB1LnBpY2sob3B0aW9ucywgYWxsb3dlZFBhcmFtcyB8fCBbXSk7XG5cbiAgICByZXR1cm4gcnY7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLl9wcmVwYXJlT2JqZWN0SGVhZGVycyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGFsbG93ZWRIZWFkZXJzID0ge307XG4gICAgdS5lYWNoKFtcbiAgICAgICAgSC5DT05URU5UX0xFTkdUSCxcbiAgICAgICAgSC5DT05URU5UX0VOQ09ESU5HLFxuICAgICAgICBILkNPTlRFTlRfTUQ1LFxuICAgICAgICBILlhfQkNFX0NPTlRFTlRfU0hBMjU2LFxuICAgICAgICBILkNPTlRFTlRfVFlQRSxcbiAgICAgICAgSC5DT05URU5UX0RJU1BPU0lUSU9OLFxuICAgICAgICBILkVUQUcsXG4gICAgICAgIEguU0VTU0lPTl9UT0tFTixcbiAgICAgICAgSC5DQUNIRV9DT05UUk9MLFxuICAgICAgICBILkVYUElSRVMsXG4gICAgICAgIEguWF9CQ0VfT0JKRUNUX0FDTCxcbiAgICAgICAgSC5YX0JDRV9PQkpFQ1RfR1JBTlRfUkVBRFxuICAgIF0sIGZ1bmN0aW9uIChoZWFkZXIpIHtcbiAgICAgICAgYWxsb3dlZEhlYWRlcnNbaGVhZGVyXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB2YXIgbWV0YVNpemUgPSAwO1xuICAgIHZhciBoZWFkZXJzID0gdS5waWNrKG9wdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmIChhbGxvd2VkSGVhZGVyc1trZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgvXnhcXC1iY2VcXC1tZXRhXFwtLy50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgIG1ldGFTaXplICs9IEJ1ZmZlci5ieXRlTGVuZ3RoKGtleSkgKyBCdWZmZXIuYnl0ZUxlbmd0aCgnJyArIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobWV0YVNpemUgPiBNQVhfVVNFUl9NRVRBREFUQV9TSVpFKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ01ldGFkYXRhIHNpemUgc2hvdWxkIG5vdCBiZSBncmVhdGVyIHRoYW4gJyArIE1BWF9VU0VSX01FVEFEQVRBX1NJWkUgKyAnLicpO1xuICAgIH1cblxuICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KEguQ09OVEVOVF9MRU5HVEgpKSB7XG4gICAgICAgIHZhciBjb250ZW50TGVuZ3RoID0gaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXTtcbiAgICAgICAgaWYgKGNvbnRlbnRMZW5ndGggPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb250ZW50X2xlbmd0aCBzaG91bGQgbm90IGJlIG5lZ2F0aXZlLicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNvbnRlbnRMZW5ndGggPiBNQVhfUFVUX09CSkVDVF9MRU5HVEgpIHsgLy8gNUdcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdCBsZW5ndGggc2hvdWxkIGJlIGxlc3MgdGhhbiAnICsgTUFYX1BVVF9PQkpFQ1RfTEVOR1RIXG4gICAgICAgICAgICAgICAgKyAnLiBVc2UgbXVsdGktcGFydCB1cGxvYWQgaW5zdGVhZC4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KCdFVGFnJykpIHtcbiAgICAgICAgdmFyIGV0YWcgPSBoZWFkZXJzLkVUYWc7XG4gICAgICAgIGlmICghL15cIi8udGVzdChldGFnKSkge1xuICAgICAgICAgICAgaGVhZGVycy5FVGFnID0gdXRpbC5mb3JtYXQoJ1wiJXNcIicsIGV0YWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFoZWFkZXJzLmhhc093blByb3BlcnR5KEguQ09OVEVOVF9UWVBFKSkge1xuICAgICAgICBoZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkZXJzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb3NDbGllbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9jb25maWcuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG5leHBvcnRzLkRFRkFVTFRfU0VSVklDRV9ET01BSU4gPSAnYmFpZHViY2UuY29tJztcblxuZXhwb3J0cy5ERUZBVUxUX0NPTkZJRyA9IHtcbiAgICBwcm90b2NvbDogJ2h0dHAnLFxuICAgIHJlZ2lvbjogJ2JqJ1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvaGVhZGVycy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbmV4cG9ydHMuQ09OVEVOVF9UWVBFID0gJ0NvbnRlbnQtVHlwZSc7XG5leHBvcnRzLkNPTlRFTlRfTEVOR1RIID0gJ0NvbnRlbnQtTGVuZ3RoJztcbmV4cG9ydHMuQ09OVEVOVF9NRDUgPSAnQ29udGVudC1NRDUnO1xuZXhwb3J0cy5DT05URU5UX0VOQ09ESU5HID0gJ0NvbnRlbnQtRW5jb2RpbmcnO1xuZXhwb3J0cy5DT05URU5UX0RJU1BPU0lUSU9OID0gJ0NvbnRlbnQtRGlzcG9zaXRpb24nO1xuZXhwb3J0cy5FVEFHID0gJ0VUYWcnO1xuZXhwb3J0cy5DT05ORUNUSU9OID0gJ0Nvbm5lY3Rpb24nO1xuZXhwb3J0cy5IT1NUID0gJ0hvc3QnO1xuZXhwb3J0cy5VU0VSX0FHRU5UID0gJ1VzZXItQWdlbnQnO1xuZXhwb3J0cy5DQUNIRV9DT05UUk9MID0gJ0NhY2hlLUNvbnRyb2wnO1xuZXhwb3J0cy5FWFBJUkVTID0gJ0V4cGlyZXMnO1xuXG5leHBvcnRzLkFVVEhPUklaQVRJT04gPSAnQXV0aG9yaXphdGlvbic7XG5leHBvcnRzLlhfQkNFX0RBVEUgPSAneC1iY2UtZGF0ZSc7XG5leHBvcnRzLlhfQkNFX0FDTCA9ICd4LWJjZS1hY2wnO1xuZXhwb3J0cy5YX0JDRV9SRVFVRVNUX0lEID0gJ3gtYmNlLXJlcXVlc3QtaWQnO1xuZXhwb3J0cy5YX0JDRV9DT05URU5UX1NIQTI1NiA9ICd4LWJjZS1jb250ZW50LXNoYTI1Nic7XG5leHBvcnRzLlhfQkNFX09CSkVDVF9BQ0wgPSAneC1iY2Utb2JqZWN0LWFjbCc7XG5leHBvcnRzLlhfQkNFX09CSkVDVF9HUkFOVF9SRUFEID0gJ3gtYmNlLW9iamVjdC1ncmFudC1yZWFkJztcblxuZXhwb3J0cy5YX0hUVFBfSEVBREVSUyA9ICdodHRwX2hlYWRlcnMnO1xuZXhwb3J0cy5YX0JPRFkgPSAnYm9keSc7XG5leHBvcnRzLlhfU1RBVFVTX0NPREUgPSAnc3RhdHVzX2NvZGUnO1xuZXhwb3J0cy5YX01FU1NBR0UgPSAnbWVzc2FnZSc7XG5leHBvcnRzLlhfQ09ERSA9ICdjb2RlJztcbmV4cG9ydHMuWF9SRVFVRVNUX0lEID0gJ3JlcXVlc3RfaWQnO1xuXG5leHBvcnRzLlNFU1NJT05fVE9LRU4gPSAneC1iY2Utc2VjdXJpdHktdG9rZW4nO1xuXG5leHBvcnRzLlhfVk9EX01FRElBX1RJVExFID0gJ3gtdm9kLW1lZGlhLXRpdGxlJztcbmV4cG9ydHMuWF9WT0RfTUVESUFfREVTQ1JJUFRJT04gPSAneC12b2QtbWVkaWEtZGVzY3JpcHRpb24nO1xuZXhwb3J0cy5BQ0NFUFRfRU5DT0RJTkcgPSAnYWNjZXB0LWVuY29kaW5nJztcbmV4cG9ydHMuQUNDRVBUID0gJ2FjY2VwdCc7XG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvaHR0cF9jbGllbnQuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuLyogZXNsaW50IG1heC1wYXJhbXM6WzAsMTBdICovXG4vKiBnbG9iYWxzIEFycmF5QnVmZmVyICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKDQxKS5FdmVudEVtaXR0ZXI7XG52YXIgQnVmZmVyID0gcmVxdWlyZSgzMyk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIGhlbHBlciA9IHJlcXVpcmUoNDIpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciB1dGlsID0gcmVxdWlyZSg0Nyk7XG52YXIgSCA9IHJlcXVpcmUoMTkpO1xuXG4vKipcbiAqIFRoZSBIdHRwQ2xpZW50XG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBodHRwIGNsaWVudCBjb25maWd1cmF0aW9uLlxuICovXG5mdW5jdGlvbiBIdHRwQ2xpZW50KGNvbmZpZykge1xuICAgIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG5cbiAgICAvKipcbiAgICAgKiBodHRwKHMpIHJlcXVlc3Qgb2JqZWN0XG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZXEgPSBudWxsO1xufVxudXRpbC5pbmhlcml0cyhIdHRwQ2xpZW50LCBFdmVudEVtaXR0ZXIpO1xuXG4vKipcbiAqIFNlbmQgSHR0cCBSZXF1ZXN0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGh0dHBNZXRob2QgR0VULFBPU1QsUFVULERFTEVURSxIRUFEXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgaHR0cCByZXF1ZXN0IHBhdGguXG4gKiBAcGFyYW0geyhzdHJpbmd8QnVmZmVyfHN0cmVhbS5SZWFkYWJsZSk9fSBib2R5IFRoZSByZXF1ZXN0IGJvZHkuIElmIGBib2R5YCBpcyBhXG4gKiBzdHJlYW0sIGBDb250ZW50LUxlbmd0aGAgbXVzdCBiZSBzZXQgZXhwbGljaXRseS5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gaGVhZGVycyBUaGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKiBAcGFyYW0ge09iamVjdD19IHBhcmFtcyBUaGUgcXVlcnlzdHJpbmdzIGluIHVybC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTpzdHJpbmc9fSBzaWduRnVuY3Rpb24gVGhlIGBBdXRob3JpemF0aW9uYCBzaWduYXR1cmUgZnVuY3Rpb25cbiAqIEBwYXJhbSB7c3RyZWFtLldyaXRhYmxlPX0gb3V0cHV0U3RyZWFtIFRoZSBodHRwIHJlc3BvbnNlIGJvZHkuXG4gKiBAcGFyYW0ge251bWJlcj19IHJldHJ5IFRoZSBtYXhpbXVtIG51bWJlciBvZiBuZXR3b3JrIGNvbm5lY3Rpb24gYXR0ZW1wdHMuXG4gKlxuICogQHJlc29sdmUge3todHRwX2hlYWRlcnM6T2JqZWN0LGJvZHk6T2JqZWN0fX1cbiAqIEByZWplY3Qge09iamVjdH1cbiAqXG4gKiBAcmV0dXJuIHtRLmRlZmVyfVxuICovXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCBwYXRoLCBib2R5LCBoZWFkZXJzLCBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaWduRnVuY3Rpb24sIG91dHB1dFN0cmVhbSkge1xuXG4gICAgdmFyIHJlcXVlc3RVcmwgPSB0aGlzLl9nZXRSZXF1ZXN0VXJsKHBhdGgsIHBhcmFtcyk7XG5cbiAgICB2YXIgZGVmYXVsdEhlYWRlcnMgPSB7fTtcbiAgICBkZWZhdWx0SGVhZGVyc1tILlhfQkNFX0RBVEVdID0gaGVscGVyLnRvVVRDU3RyaW5nKG5ldyBEYXRlKCkpO1xuICAgIGRlZmF1bHRIZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04JztcbiAgICBkZWZhdWx0SGVhZGVyc1tILkhPU1RdID0gL15cXHcrOlxcL1xcLyhbXlxcL10rKS8uZXhlYyh0aGlzLmNvbmZpZy5lbmRwb2ludClbMV07XG5cbiAgICB2YXIgcmVxdWVzdEhlYWRlcnMgPSB1LmV4dGVuZChkZWZhdWx0SGVhZGVycywgaGVhZGVycyk7XG5cbiAgICAvLyBDaGVjayB0aGUgY29udGVudC1sZW5ndGhcbiAgICBpZiAoIXJlcXVlc3RIZWFkZXJzLmhhc093blByb3BlcnR5KEguQ09OVEVOVF9MRU5HVEgpKSB7XG4gICAgICAgIHZhciBjb250ZW50TGVuZ3RoID0gdGhpcy5fZ3Vlc3NDb250ZW50TGVuZ3RoKGJvZHkpO1xuICAgICAgICBpZiAoIShjb250ZW50TGVuZ3RoID09PSAwICYmIC9HRVR8SEVBRC9pLnRlc3QoaHR0cE1ldGhvZCkpKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzmmK8gR0VUIOaIliBIRUFEIOivt+axgu+8jOW5tuS4lCBDb250ZW50LUxlbmd0aCDmmK8gMO+8jOmCo+S5iCBSZXF1ZXN0IEhlYWRlciDph4zpnaLlsLHkuI3opoHlh7rnjrAgQ29udGVudC1MZW5ndGhcbiAgICAgICAgICAgIC8vIOWQpuWImeacrOWcsOiuoeeul+etvuWQjeeahOaXtuWAmeS8muiuoeeul+i/m+WOu++8jOS9huaYr+a1j+iniOWZqOWPkeivt+axgueahOaXtuWAmeS4jeS4gOWumuS8muacie+8jOatpOaXtuWvvOiHtCBTaWduYXR1cmUgTWlzbWF0Y2gg55qE5oOF5Ya1XG4gICAgICAgICAgICByZXF1ZXN0SGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IGNvbnRlbnRMZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGNyZWF0ZVNpZ25hdHVyZSA9IHNpZ25GdW5jdGlvbiB8fCB1Lm5vb3A7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZShjcmVhdGVTaWduYXR1cmUodGhpcy5jb25maWcuY3JlZGVudGlhbHMsIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgcmVxdWVzdEhlYWRlcnMpKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF1dGhvcml6YXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEhlYWRlcnNbSC5BVVRIT1JJWkFUSU9OXSA9IGF1dGhvcml6YXRpb247XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RIZWFkZXJzW0guWF9CQ0VfREFURV0gPSB4YmNlRGF0ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5fZG9SZXF1ZXN0KGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsXG4gICAgICAgICAgICAgICAgICAgIHUub21pdChyZXF1ZXN0SGVhZGVycywgSC5DT05URU5UX0xFTkdUSCwgSC5IT1NUKSxcbiAgICAgICAgICAgICAgICAgICAgYm9keSwgb3V0cHV0U3RyZWFtKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgcmV0dXJuIFEucmVqZWN0KGV4KTtcbiAgICB9XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZG9SZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsIHJlcXVlc3RIZWFkZXJzLCBib2R5LCBvdXRwdXRTdHJlYW0pIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKGh0dHBNZXRob2QsIHJlcXVlc3RVcmwsIHRydWUpO1xuICAgIGZvciAodmFyIGhlYWRlciBpbiByZXF1ZXN0SGVhZGVycykge1xuICAgICAgICBpZiAocmVxdWVzdEhlYWRlcnMuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gcmVxdWVzdEhlYWRlcnNbaGVhZGVyXTtcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgfTtcbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcigneGhyIGFib3J0ZWQnKSk7XG4gICAgfTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzO1xuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gMTIyMykge1xuICAgICAgICAgICAgICAgIC8vIElFIC0gIzE0NTA6IHNvbWV0aW1lcyByZXR1cm5zIDEyMjMgd2hlbiBpdCBzaG91bGQgYmUgMjA0XG4gICAgICAgICAgICAgICAgc3RhdHVzID0gMjA0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29udGVudFR5cGUgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0NvbnRlbnQtVHlwZScpO1xuICAgICAgICAgICAgdmFyIGlzSlNPTiA9IC9hcHBsaWNhdGlvblxcL2pzb24vLnRlc3QoY29udGVudFR5cGUpO1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlQm9keSA9IGlzSlNPTiA/IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkgOiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZUJvZHkpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUJvZHkgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlzU3VjY2VzcyA9IHN0YXR1cyA+PSAyMDAgJiYgc3RhdHVzIDwgMzAwIHx8IHN0YXR1cyA9PT0gMzA0O1xuICAgICAgICAgICAgaWYgKGlzU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHZhciBoZWFkZXJzID0gc2VsZi5fZml4SGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICBodHRwX2hlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHJlc3BvbnNlQm9keVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzX2NvZGU6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzcG9uc2VCb2R5Lm1lc3NhZ2UgfHwgJzxtZXNzYWdlPicsXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IHJlc3BvbnNlQm9keS5jb2RlIHx8ICc8Y29kZT4nLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X2lkOiByZXNwb25zZUJvZHkucmVxdWVzdElkIHx8ICc8cmVxdWVzdF9pZD4nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGlmICh4aHIudXBsb2FkKSB7XG4gICAgICAgIHUuZWFjaChbJ3Byb2dyZXNzJywgJ2Vycm9yJywgJ2Fib3J0J10sIGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgICAgIHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYuZW1pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmVtaXQoZXZlbnROYW1lLCBldnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHhoci5zZW5kKGJvZHkpO1xuXG4gICAgc2VsZi5fcmVxID0ge3hocjogeGhyfTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2d1ZXNzQ29udGVudExlbmd0aCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKGRhdGEgPT0gbnVsbCB8fCBkYXRhID09PSAnJykge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAodS5pc1N0cmluZyhkYXRhKSkge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhIGluc3RhbmNlb2YgQmxvYikge1xuICAgICAgICByZXR1cm4gZGF0YS5zaXplO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgICAgICByZXR1cm4gZGF0YS5ieXRlTGVuZ3RoO1xuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignTm8gQ29udGVudC1MZW5ndGggaXMgc3BlY2lmaWVkLicpO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2ZpeEhlYWRlcnMgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICAgIHZhciBmaXhlZEhlYWRlcnMgPSB7fTtcblxuICAgIGlmIChoZWFkZXJzKSB7XG4gICAgICAgIHUuZWFjaChoZWFkZXJzLnNwbGl0KC9cXHI/XFxuLyksIGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAgICAgICAgICBpZiAoaWR4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBsaW5lLnN1YnN0cmluZygwLCBpZHgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbGluZS5zdWJzdHJpbmcoaWR4ICsgMSkucmVwbGFjZSgvXlxccyt8XFxzKyQvLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2V0YWcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXCIvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaXhlZEhlYWRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZml4ZWRIZWFkZXJzO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuYnVpbGRRdWVyeVN0cmluZyA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgdXJsRW5jb2RlU3RyID0gcmVxdWlyZSg0NSkuc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUGVyY2VudC1lbmNvZGluZ1xuICAgIHJldHVybiB1cmxFbmNvZGVTdHIucmVwbGFjZSgvWygpJyF+LipcXC1fXS9nLCBmdW5jdGlvbiAoY2hhcikge1xuICAgICAgICByZXR1cm4gJyUnICsgY2hhci5jaGFyQ29kZUF0KCkudG9TdHJpbmcoMTYpO1xuICAgIH0pO1xufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2dldFJlcXVlc3RVcmwgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zKSB7XG4gICAgdmFyIHVyaSA9IHBhdGg7XG4gICAgdmFyIHFzID0gdGhpcy5idWlsZFF1ZXJ5U3RyaW5nKHBhcmFtcyk7XG4gICAgaWYgKHFzKSB7XG4gICAgICAgIHVyaSArPSAnPycgKyBxcztcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZW5kcG9pbnQgKyB1cmk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEh0dHBDbGllbnQ7XG5cbiIsIi8qKlxuICogQGZpbGUgc3JjL21pbWUudHlwZXMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG52YXIgbWltZVR5cGVzID0ge1xufTtcblxuZXhwb3J0cy5ndWVzcyA9IGZ1bmN0aW9uIChleHQpIHtcbiAgICBpZiAoIWV4dCB8fCAhZXh0Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gICAgfVxuICAgIGlmIChleHRbMF0gPT09ICcuJykge1xuICAgICAgICBleHQgPSBleHQuc3Vic3RyKDEpO1xuICAgIH1cbiAgICByZXR1cm4gbWltZVR5cGVzW2V4dC50b0xvd2VyQ2FzZSgpXSB8fCAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHN0cmluZ3MuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBrRXNjYXBlZE1hcCA9IHtcbiAgICAnISc6ICclMjEnLFxuICAgICdcXCcnOiAnJTI3JyxcbiAgICAnKCc6ICclMjgnLFxuICAgICcpJzogJyUyOScsXG4gICAgJyonOiAnJTJBJ1xufTtcblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbiAoc3RyaW5nLCBlbmNvZGluZ1NsYXNoKSB7XG4gICAgdmFyIHJlc3VsdCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmcpO1xuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9bISdcXChcXClcXCpdL2csIGZ1bmN0aW9uICgkMSkge1xuICAgICAgICByZXR1cm4ga0VzY2FwZWRNYXBbJDFdO1xuICAgIH0pO1xuXG4gICAgaWYgKGVuY29kaW5nU2xhc2ggPT09IGZhbHNlKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC8lMkYvZ2ksICcvJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydHMudHJpbSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICByZXR1cm4gKHN0cmluZyB8fCAnJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xufTtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBjb25maWcuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cblxudmFyIGtEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBydW50aW1lczogJ2h0bWw1JyxcblxuICAgIC8vIGJvc+acjeWKoeWZqOeahOWcsOWdgO+8jOm7mOiupChodHRwOi8vYmouYmNlYm9zLmNvbSlcbiAgICBib3NfZW5kcG9pbnQ6ICdodHRwOi8vYmouYmNlYm9zLmNvbScsXG5cbiAgICAvLyDpu5jorqTnmoQgYWsg5ZKMIHNrIOmFjee9rlxuICAgIGJvc19hazogbnVsbCxcbiAgICBib3Nfc2s6IG51bGwsXG4gICAgYm9zX2NyZWRlbnRpYWxzOiBudWxsLFxuXG4gICAgLy8g5aaC5p6c5YiH5o2i5YiwIGFwcGVuZGFibGUg5qih5byP77yM5pyA5aSn5Y+q5pSv5oyBIDVHIOeahOaWh+S7tlxuICAgIC8vIOS4jeWGjeaUr+aMgSBNdWx0aXBhcnQg55qE5pa55byP5LiK5Lyg5paH5Lu2XG4gICAgYm9zX2FwcGVuZGFibGU6IGZhbHNlLFxuXG4gICAgLy8g5Li65LqG5aSE55CGIEZsYXNoIOS4jeiDveWPkemAgSBIRUFELCBERUxFVEUg5LmL57G755qE6K+35rGC77yM5Lul5Y+K5peg5rOVXG4gICAgLy8g6I635Y+WIHJlc3BvbnNlIGhlYWRlcnMg55qE6Zeu6aKY77yM6ZyA6KaB5pCe5LiA5LiqIHJlbGF5IOacjeWKoeWZqO+8jOaKiuaVsOaNrlxuICAgIC8vIOagvOW8j+i9rOWMluS4gOS4i1xuICAgIGJvc19yZWxheV9zZXJ2ZXI6ICdodHRwczovL3JlbGF5LmVmZS50ZWNoJyxcblxuICAgIC8vIOaYr+WQpuaUr+aMgeWkmumAie+8jOm7mOiupChmYWxzZSlcbiAgICBtdWx0aV9zZWxlY3Rpb246IGZhbHNlLFxuXG4gICAgLy8g5aSx6LSl5LmL5ZCO6YeN6K+V55qE5qyh5pWwKOWNleS4quaWh+S7tuaIluiAheWIhueJhynvvIzpu5jorqQoMCnvvIzkuI3ph43or5VcbiAgICBtYXhfcmV0cmllczogMCxcblxuICAgIC8vIOWksei0pemHjeivleeahOmXtOmalOaXtumXtO+8jOm7mOiupCAxMDAwbXNcbiAgICByZXRyeV9pbnRlcnZhbDogMTAwMCxcblxuICAgIC8vIOaYr+WQpuiHquWKqOS4iuS8oO+8jOm7mOiupChmYWxzZSlcbiAgICBhdXRvX3N0YXJ0OiBmYWxzZSxcblxuICAgIC8vIOacgOWkp+WPr+S7pemAieaLqeeahOaWh+S7tuWkp+Wwj++8jOm7mOiupCgxMDBNKVxuICAgIG1heF9maWxlX3NpemU6ICcxMDBtYicsXG5cbiAgICAvLyDotoXov4fov5nkuKrmlofku7blpKflsI/kuYvlkI7vvIzlvIDlp4vkvb/nlKjliIbniYfkuIrkvKDvvIzpu5jorqQoMTBNKVxuICAgIGJvc19tdWx0aXBhcnRfbWluX3NpemU6ICcxMG1iJyxcblxuICAgIC8vIOWIhueJh+S4iuS8oOeahOaXtuWAme+8jOW5tuihjOS4iuS8oOeahOS4quaVsO+8jOm7mOiupCgxKVxuICAgIGJvc19tdWx0aXBhcnRfcGFyYWxsZWw6IDEsXG5cbiAgICAvLyDpmJ/liJfkuK3nmoTmlofku7bvvIzlubbooYzkuIrkvKDnmoTkuKrmlbDvvIzpu5jorqQoMylcbiAgICBib3NfdGFza19wYXJhbGxlbDogMyxcblxuICAgIC8vIOiuoeeul+etvuWQjeeahOaXtuWAme+8jOacieS6myBoZWFkZXIg6ZyA6KaB5YmU6Zmk77yM5YeP5bCR5Lyg6L6T55qE5L2T56evXG4gICAgYXV0aF9zdHJpcHBlZF9oZWFkZXJzOiBbJ1VzZXItQWdlbnQnLCAnQ29ubmVjdGlvbiddLFxuXG4gICAgLy8g5YiG54mH5LiK5Lyg55qE5pe25YCZ77yM5q+P5Liq5YiG54mH55qE5aSn5bCP77yM6buY6K6kKDRNKVxuICAgIGNodW5rX3NpemU6ICc0bWInLFxuXG4gICAgLy8g5YiG5Z2X5LiK5Lyg5pe2LOaYr+WQpuWFgeiuuOaWreeCuee7reS8oO+8jOm7mOiupChmYWxzZSlcbiAgICBib3NfbXVsdGlwYXJ0X2F1dG9fY29udGludWU6IGZhbHNlLFxuXG4gICAgLy8g5YiG5byA5LiK5Lyg55qE5pe25YCZ77yMbG9jYWxTdG9yYWdl6YeM6Z2ia2V555qE55Sf5oiQ5pa55byP77yM6buY6K6k5pivIGBkZWZhdWx0YFxuICAgIC8vIOWmguaenOmcgOimgeiHquWumuS5ie+8jOWPr+S7pemAmui/hyBYWFhcbiAgICBib3NfbXVsdGlwYXJ0X2xvY2FsX2tleV9nZW5lcmF0b3I6ICdkZWZhdWx0JyxcblxuICAgIC8vIOaYr+WQpuWFgeiuuOmAieaLqeebruW9lVxuICAgIGRpcl9zZWxlY3Rpb246IGZhbHNlLFxuXG4gICAgLy8g5piv5ZCm6ZyA6KaB5q+P5qyh6YO95Y675pyN5Yqh5Zmo6K6h566X562+5ZCNXG4gICAgZ2V0X25ld191cHRva2VuOiB0cnVlLFxuXG4gICAgLy8g5Zug5Li65L2/55SoIEZvcm0gUG9zdCDnmoTmoLzlvI/vvIzmsqHmnInorr7nva7pop3lpJbnmoQgSGVhZGVy77yM5LuO6ICM5Y+v5Lul5L+d6K+BXG4gICAgLy8g5L2/55SoIEZsYXNoIOS5n+iDveS4iuS8oOWkp+aWh+S7tlxuICAgIC8vIOS9jueJiOacrOa1j+iniOWZqOS4iuS8oOaWh+S7tueahOaXtuWAme+8jOmcgOimgeiuvue9riBwb2xpY3nvvIzpu5jorqTmg4XlhrXkuItcbiAgICAvLyBwb2xpY3nnmoTlhoXlrrnlj6rpnIDopoHljIXlkKsgZXhwaXJhdGlvbiDlkowgY29uZGl0aW9ucyDljbPlj69cbiAgICAvLyBwb2xpY3k6IHtcbiAgICAvLyAgIGV4cGlyYXRpb246ICd4eCcsXG4gICAgLy8gICBjb25kaXRpb25zOiBbXG4gICAgLy8gICAgIHtidWNrZXQ6ICd0aGUtYnVja2V0LW5hbWUnfVxuICAgIC8vICAgXVxuICAgIC8vIH1cbiAgICAvLyBib3NfcG9saWN5OiBudWxsLFxuXG4gICAgLy8g5L2O54mI5pys5rWP6KeI5Zmo5LiK5Lyg5paH5Lu255qE5pe25YCZ77yM6ZyA6KaB6K6+572uIHBvbGljeV9zaWduYXR1cmVcbiAgICAvLyDlpoLmnpzmsqHmnInorr7nva4gYm9zX3BvbGljeV9zaWduYXR1cmUg55qE6K+d77yM5Lya6YCa6L+HIHVwdG9rZW5fdXJsIOadpeivt+axglxuICAgIC8vIOm7mOiupOWPquS8muivt+axguS4gOasoe+8jOWmguaenOWkseaViOS6hu+8jOmcgOimgeaJi+WKqOadpemHjee9riBwb2xpY3lfc2lnbmF0dXJlXG4gICAgLy8gYm9zX3BvbGljeV9zaWduYXR1cmU6IG51bGwsXG5cbiAgICAvLyBKU09OUCDpu5jorqTnmoTotoXml7bml7bpl7QoNTAwMG1zKVxuICAgIHVwdG9rZW5fdmlhX2pzb25wOiB0cnVlLFxuICAgIHVwdG9rZW5fdGltZW91dDogNTAwMCxcbiAgICB1cHRva2VuX2pzb25wX3RpbWVvdXQ6IDUwMDAsICAgIC8vIOS4jeaUr+aMgeS6hu+8jOWQjue7reW7uuiurueUqCB1cHRva2VuX3RpbWVvdXRcblxuICAgIC8vIOaYr+WQpuimgeemgeeUqOe7n+iuoe+8jOm7mOiupOS4jeemgeeUqFxuICAgIC8vIOWmguaenOmcgOimgeemgeeUqO+8jOaKiiB0cmFja2VyX2lkIOiuvue9ruaIkCBudWxsIOWNs+WPr1xuICAgIHRyYWNrZXJfaWQ6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga0RlZmF1bHRPcHRpb25zO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIiksIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIGV2ZW50cy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAga1Bvc3RJbml0OiAnUG9zdEluaXQnLFxuICAgIGtLZXk6ICdLZXknLFxuICAgIGtMaXN0UGFydHM6ICdMaXN0UGFydHMnLFxuICAgIGtPYmplY3RNZXRhczogJ09iamVjdE1ldGFzJyxcbiAgICAvLyBrRmlsZXNSZW1vdmVkICA6ICdGaWxlc1JlbW92ZWQnLFxuICAgIGtGaWxlRmlsdGVyZWQ6ICdGaWxlRmlsdGVyZWQnLFxuICAgIGtGaWxlc0FkZGVkOiAnRmlsZXNBZGRlZCcsXG4gICAga0ZpbGVzRmlsdGVyOiAnRmlsZXNGaWx0ZXInLFxuICAgIGtOZXR3b3JrU3BlZWQ6ICdOZXR3b3JrU3BlZWQnLFxuICAgIGtCZWZvcmVVcGxvYWQ6ICdCZWZvcmVVcGxvYWQnLFxuICAgIC8vIGtVcGxvYWRGaWxlICAgIDogJ1VwbG9hZEZpbGUnLCAgICAgICAvLyA/P1xuICAgIGtVcGxvYWRQcm9ncmVzczogJ1VwbG9hZFByb2dyZXNzJyxcbiAgICBrRmlsZVVwbG9hZGVkOiAnRmlsZVVwbG9hZGVkJyxcbiAgICBrVXBsb2FkUGFydFByb2dyZXNzOiAnVXBsb2FkUGFydFByb2dyZXNzJyxcbiAgICBrQ2h1bmtVcGxvYWRlZDogJ0NodW5rVXBsb2FkZWQnLFxuICAgIGtVcGxvYWRSZXN1bWU6ICdVcGxvYWRSZXN1bWUnLCAvLyDmlq3ngrnnu63kvKBcbiAgICAvLyBrVXBsb2FkUGF1c2U6ICdVcGxvYWRQYXVzZScsICAgLy8g5pqC5YGcXG4gICAga1VwbG9hZFJlc3VtZUVycm9yOiAnVXBsb2FkUmVzdW1lRXJyb3InLCAvLyDlsJ3or5Xmlq3ngrnnu63kvKDlpLHotKVcbiAgICBrVXBsb2FkQ29tcGxldGU6ICdVcGxvYWRDb21wbGV0ZScsXG4gICAga0Vycm9yOiAnRXJyb3InLFxuICAgIGtBYm9ydGVkOiAnQWJvcnRlZCdcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIG11bHRpcGFydF90YXNrLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIGFzeW5jID0gcmVxdWlyZSgzNSk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgyNCk7XG52YXIgVGFzayA9IHJlcXVpcmUoMzApO1xuXG4vKipcbiAqIE11bHRpcGFydFRhc2tcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gTXVsdGlwYXJ0VGFzaygpIHtcbiAgICBUYXNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAvKipcbiAgICAgKiDmibnph4/kuIrkvKDnmoTml7blgJnvvIzkv53lrZjnmoQgeGhyUmVxdWVzdGluZyDlr7nosaFcbiAgICAgKiDlpoLmnpzpnIDopoEgYWJvcnQg55qE5pe25YCZ77yM5LuO6L+Z6YeM5p2l6I635Y+WXG4gICAgICovXG4gICAgdGhpcy54aHJQb29scyA9IFtdO1xufVxudXRpbHMuaW5oZXJpdHMoTXVsdGlwYXJ0VGFzaywgVGFzayk7XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmFib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgZmlsZSA9IHRoaXMub3B0aW9ucy5maWxlO1xuICAgIHZhciBidWNrZXQgPSB0aGlzLm9wdGlvbnMuYnVja2V0O1xuICAgIHZhciBvYmplY3QgPSB0aGlzLm9wdGlvbnMub2JqZWN0O1xuICAgIHZhciBtZXRhcyA9IHRoaXMub3B0aW9ucy5tZXRhcztcbiAgICB2YXIgY2h1bmtTaXplID0gdGhpcy5vcHRpb25zLmNodW5rX3NpemU7XG4gICAgdmFyIG11bHRpcGFydFBhcmFsbGVsID0gdGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfcGFyYWxsZWw7XG5cbiAgICB2YXIgY29udGVudFR5cGUgPSB1dGlscy5ndWVzc0NvbnRlbnRUeXBlKGZpbGUpO1xuICAgIHZhciBvcHRpb25zID0geydDb250ZW50LVR5cGUnOiBjb250ZW50VHlwZX07XG4gICAgdmFyIHVwbG9hZElkID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLl9pbml0aWF0ZU11bHRpcGFydFVwbG9hZChmaWxlLCBjaHVua1NpemUsIGJ1Y2tldCwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHVwbG9hZElkID0gcmVzcG9uc2UuYm9keS51cGxvYWRJZDtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlc3BvbnNlLmJvZHkucGFydHMgfHwgW107XG4gICAgICAgICAgICAvLyDlh4blpIcgdXBsb2FkUGFydHNcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgICAgIHZhciB0YXNrcyA9IHV0aWxzLmdldFRhc2tzKGZpbGUsIHVwbG9hZElkLCBjaHVua1NpemUsIGJ1Y2tldCwgb2JqZWN0KTtcbiAgICAgICAgICAgIHV0aWxzLmZpbHRlclRhc2tzKHRhc2tzLCBwYXJ0cyk7XG5cbiAgICAgICAgICAgIHZhciBsb2FkZWQgPSBwYXJ0cy5sZW5ndGg7XG4gICAgICAgICAgICAvLyDov5nkuKrnlKjmnaXorrDlvZXmlbTkvZMgUGFydHMg55qE5LiK5Lyg6L+b5bqm77yM5LiN5piv5Y2V5LiqIFBhcnQg55qE5LiK5Lyg6L+b5bqmXG4gICAgICAgICAgICAvLyDljZXkuKogUGFydCDnmoTkuIrkvKDov5vluqblj6/ku6Xnm5HlkKwga1VwbG9hZFBhcnRQcm9ncmVzcyDmnaXlvpfliLBcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBsZW5ndGhDb21wdXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxvYWRlZDogbG9hZGVkLFxuICAgICAgICAgICAgICAgIHRvdGFsOiB0YXNrcy5sZW5ndGhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAobG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtmaWxlLCBsb2FkZWQgLyB0YXNrcy5sZW5ndGgsIG51bGxdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXN5bmMubWFwTGltaXQodGFza3MsIG11bHRpcGFydFBhcmFsbGVsLCBzZWxmLl91cGxvYWRQYXJ0KHN0YXRlKSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlcykge1xuICAgICAgICAgICAgdmFyIHBhcnRMaXN0ID0gW107XG4gICAgICAgICAgICB1LmVhY2gocmVzcG9uc2VzLCBmdW5jdGlvbiAocmVzcG9uc2UsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcGFydExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHBhcnROdW1iZXI6IGluZGV4ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgZVRhZzogcmVzcG9uc2UuaHR0cF9oZWFkZXJzLmV0YWdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8g5YWo6YOo5LiK5Lyg57uT5p2f5ZCO5Yig6ZmkbG9jYWxTdG9yYWdlXG4gICAgICAgICAgICBzZWxmLl9nZW5lcmF0ZUxvY2FsS2V5KHtcbiAgICAgICAgICAgICAgICBibG9iOiBmaWxlLFxuICAgICAgICAgICAgICAgIGNodW5rU2l6ZTogY2h1bmtTaXplLFxuICAgICAgICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5yZW1vdmVVcGxvYWRJZChrZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jbGllbnQuY29tcGxldGVNdWx0aXBhcnRVcGxvYWQoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkLCBwYXJ0TGlzdCwgbWV0YXMpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbZmlsZSwgMV0pO1xuXG4gICAgICAgICAgICByZXNwb25zZS5ib2R5LmJ1Y2tldCA9IGJ1Y2tldDtcbiAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkub2JqZWN0ID0gb2JqZWN0O1xuXG4gICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtGaWxlVXBsb2FkZWQsIFtmaWxlLCByZXNwb25zZV0pO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBldmVudFR5cGUgPSBzZWxmLmFib3J0ZWQgPyBldmVudHMua0Fib3J0ZWQgOiBldmVudHMua0Vycm9yO1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50VHlwZSwgW2Vycm9yLCBmaWxlXSk7XG4gICAgICAgIH0pO1xufTtcblxuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5faW5pdGlhdGVNdWx0aXBhcnRVcGxvYWQgPSBmdW5jdGlvbiAoZmlsZSwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCwgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIHVwbG9hZElkO1xuICAgIHZhciBsb2NhbFNhdmVLZXk7XG5cbiAgICBmdW5jdGlvbiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5jbGllbnQuaW5pdGlhdGVNdWx0aXBhcnRVcGxvYWQoYnVja2V0LCBvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLnNldFVwbG9hZElkKGxvY2FsU2F2ZUtleSwgcmVzcG9uc2UuYm9keS51cGxvYWRJZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuYm9keS5wYXJ0cyA9IFtdO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBrZXlPcHRpb25zID0ge1xuICAgICAgICBibG9iOiBmaWxlLFxuICAgICAgICBjaHVua1NpemU6IGNodW5rU2l6ZSxcbiAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgIG9iamVjdDogb2JqZWN0XG4gICAgfTtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X2F1dG9fY29udGludWVcbiAgICAgICAgPyB0aGlzLl9nZW5lcmF0ZUxvY2FsS2V5KGtleU9wdGlvbnMpXG4gICAgICAgIDogUS5yZXNvbHZlKG51bGwpO1xuXG4gICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBsb2NhbFNhdmVLZXkgPSBrZXk7XG4gICAgICAgICAgICBpZiAoIWxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVwbG9hZElkID0gdXRpbHMuZ2V0VXBsb2FkSWQobG9jYWxTYXZlS2V5KTtcbiAgICAgICAgICAgIGlmICghdXBsb2FkSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fbGlzdFBhcnRzKGZpbGUsIGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHVwbG9hZElkICYmIGxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlc3BvbnNlLmJvZHkucGFydHM7XG4gICAgICAgICAgICAgICAgLy8gbGlzdFBhcnRzIOeahOi/lOWbnue7k+aenFxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFJlc3VtZSwgW2ZpbGUsIHBhcnRzLCBudWxsXSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuYm9keS51cGxvYWRJZCA9IHVwbG9hZElkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh1cGxvYWRJZCAmJiBsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzojrflj5blt7LkuIrkvKDliIbniYflpLHotKXvvIzliJnph43mlrDkuIrkvKDjgIJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRSZXN1bWVFcnJvciwgW2ZpbGUsIGVycm9yLCBudWxsXSk7XG4gICAgICAgICAgICAgICAgdXRpbHMucmVtb3ZlVXBsb2FkSWQobG9jYWxTYXZlS2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH0pO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2dlbmVyYXRlTG9jYWxLZXkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBnZW5lcmF0b3IgPSB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9sb2NhbF9rZXlfZ2VuZXJhdG9yO1xuICAgIHJldHVybiB1dGlscy5nZW5lcmF0ZUxvY2FsS2V5KG9wdGlvbnMsIGdlbmVyYXRvcik7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fbGlzdFBhcnRzID0gZnVuY3Rpb24gKGZpbGUsIGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIGxvY2FsUGFydHMgPSBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtMaXN0UGFydHMsIFtmaWxlLCB1cGxvYWRJZF0pO1xuXG4gICAgcmV0dXJuIFEucmVzb2x2ZShsb2NhbFBhcnRzKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocGFydHMpIHtcbiAgICAgICAgICAgIGlmICh1LmlzQXJyYXkocGFydHMpICYmIHBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRzOiBwYXJ0c1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5aaC5p6c6L+U5Zue55qE5LiN5piv5pWw57uE77yM5bCx6LCD55SoIGxpc3RQYXJ0cyDmjqXlj6Pku47mnI3liqHlmajojrflj5bmlbDmja5cbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9saXN0QWxsUGFydHMoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKTtcbiAgICAgICAgfSk7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fbGlzdEFsbFBhcnRzID0gZnVuY3Rpb24gKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCkge1xuICAgIC8vIGlzVHJ1bmNhdGVkID09PSB0cnVlIC8gZmFsc2VcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgdmFyIHBhcnRzID0gW107XG4gICAgdmFyIHBheWxvYWQgPSBudWxsO1xuICAgIHZhciBtYXhQYXJ0cyA9IDEwMDA7ICAgICAgICAgIC8vIOavj+asoeeahOWIhumhtVxuICAgIHZhciBwYXJ0TnVtYmVyTWFya2VyID0gMDsgICAgIC8vIOWIhumalOesplxuXG4gICAgZnVuY3Rpb24gbGlzdFBhcnRzKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1heFBhcnRzOiBtYXhQYXJ0cyxcbiAgICAgICAgICAgIHBhcnROdW1iZXJNYXJrZXI6IHBhcnROdW1iZXJNYXJrZXJcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5jbGllbnQubGlzdFBhcnRzKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCwgb3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZCA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2guYXBwbHkocGFydHMsIHJlc3BvbnNlLmJvZHkucGFydHMpO1xuICAgICAgICAgICAgICAgIHBhcnROdW1iZXJNYXJrZXIgPSByZXNwb25zZS5ib2R5Lm5leHRQYXJ0TnVtYmVyTWFya2VyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmJvZHkuaXNUcnVuY2F0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOe7k+adn+S6hlxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmJvZHkucGFydHMgPSBwYXJ0cztcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmAkuW9kuiwg+eUqFxuICAgICAgICAgICAgICAgICAgICBsaXN0UGFydHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVtcbiAgICAgICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBsaXN0UGFydHMoKTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX3VwbG9hZFBhcnQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIGZ1bmN0aW9uIHVwbG9hZFBhcnRJbm5lcihpdGVtLCBvcHRfbWF4UmV0cmllcykge1xuICAgICAgICBpZiAoaXRlbS5ldGFnKSB7XG4gICAgICAgICAgICBzZWxmLm5ldHdvcmtJbmZvLmxvYWRlZEJ5dGVzICs9IGl0ZW0ucGFydFNpemU7XG5cbiAgICAgICAgICAgIC8vIOi3s+i/h+W3suS4iuS8oOeahHBhcnRcbiAgICAgICAgICAgIHJldHVybiBRLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBldGFnOiBpdGVtLmV0YWdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IHt9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF4UmV0cmllcyA9IG9wdF9tYXhSZXRyaWVzID09IG51bGxcbiAgICAgICAgICAgID8gc2VsZi5vcHRpb25zLm1heF9yZXRyaWVzXG4gICAgICAgICAgICA6IG9wdF9tYXhSZXRyaWVzO1xuICAgICAgICB2YXIgcmV0cnlJbnRlcnZhbCA9IHNlbGYub3B0aW9ucy5yZXRyeV9pbnRlcnZhbDtcblxuICAgICAgICB2YXIgYmxvYiA9IGl0ZW0uZmlsZS5zbGljZShpdGVtLnN0YXJ0LCBpdGVtLnN0b3AgKyAxKTtcbiAgICAgICAgYmxvYi5fcHJldmlvdXNMb2FkZWQgPSAwO1xuXG4gICAgICAgIHZhciB1cGxvYWRQYXJ0WGhyID0gc2VsZi5jbGllbnQudXBsb2FkUGFydEZyb21CbG9iKGl0ZW0uYnVja2V0LCBpdGVtLm9iamVjdCxcbiAgICAgICAgICAgIGl0ZW0udXBsb2FkSWQsIGl0ZW0ucGFydE51bWJlciwgaXRlbS5wYXJ0U2l6ZSwgYmxvYik7XG4gICAgICAgIHZhciB4aHJQb29sSW5kZXggPSBzZWxmLnhoclBvb2xzLnB1c2godXBsb2FkUGFydFhocik7XG5cbiAgICAgICAgcmV0dXJuIHVwbG9hZFBhcnRYaHIudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICArK3N0YXRlLmxvYWRlZDtcbiAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBzdGF0ZS5sb2FkZWQgLyBzdGF0ZS50b3RhbDtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2l0ZW0uZmlsZSwgcHJvZ3Jlc3MsIG51bGxdKTtcblxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZElkOiBpdGVtLnVwbG9hZElkLFxuICAgICAgICAgICAgICAgICAgICBwYXJ0TnVtYmVyOiBpdGVtLnBhcnROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIHBhcnRTaXplOiBpdGVtLnBhcnRTaXplLFxuICAgICAgICAgICAgICAgICAgICBidWNrZXQ6IGl0ZW0uYnVja2V0LFxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGl0ZW0ub2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGl0ZW0uc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiBibG9iLnNpemUsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiByZXNwb25zZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rQ2h1bmtVcGxvYWRlZCwgW2l0ZW0uZmlsZSwgcmVzdWx0XSk7XG5cbiAgICAgICAgICAgICAgICAvLyDkuI3nlKjliKDpmaTvvIzorr7nva7kuLogbnVsbCDlsLHlpb3kuobvvIzlj43mraMgYWJvcnQg55qE5pe25YCZ5Lya5Yik5pat55qEXG4gICAgICAgICAgICAgICAgc2VsZi54aHJQb29sc1t4aHJQb29sSW5kZXggLSAxXSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVtcbiAgICAgICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heFJldHJpZXMgPiAwICYmICFzZWxmLmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6L+Y5pyJ6YeN6K+V55qE5py65LyaXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlscy5kZWxheShyZXRyeUludGVydmFsKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGxvYWRQYXJ0SW5uZXIoaXRlbSwgbWF4UmV0cmllcyAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g5rKh5pyJ5py65Lya6YeN6K+V5LqGIDotKFxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIGZpbGU6IGZpbGUsXG4gICAgICAgIC8vIHVwbG9hZElkOiB1cGxvYWRJZCxcbiAgICAgICAgLy8gYnVja2V0OiBidWNrZXQsXG4gICAgICAgIC8vIG9iamVjdDogb2JqZWN0LFxuICAgICAgICAvLyBwYXJ0TnVtYmVyOiBwYXJ0TnVtYmVyLFxuICAgICAgICAvLyBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgIC8vIHN0YXJ0OiBvZmZzZXQsXG4gICAgICAgIC8vIHN0b3A6IG9mZnNldCArIHBhcnRTaXplIC0gMVxuXG4gICAgICAgIHZhciByZXNvbHZlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciByZWplY3QgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICB1cGxvYWRQYXJ0SW5uZXIoaXRlbSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIOe7iOatouS4iuS8oOS7u+WKoVxuICovXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnhoclBvb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB4aHIgPSB0aGlzLnhoclBvb2xzW2ldO1xuICAgICAgICBpZiAoeGhyICYmIHR5cGVvZiB4aHIuYWJvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpcGFydFRhc2s7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9uZXR3b3JrX2luZm8uanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoMzIpO1xuXG4vKipcbiAqIE5ldHdvcmtJbmZvXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIE5ldHdvcmtJbmZvKCkge1xuICAgIC8qKlxuICAgICAqIOiusOW9leS7jiBzdGFydCDlvIDlp4vlt7Lnu4/kuIrkvKDnmoTlrZfoioLmlbAuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmxvYWRlZEJ5dGVzID0gMDtcblxuICAgIC8qKlxuICAgICAqIOiusOW9lemYn+WIl+S4reaAu+aWh+S7tueahOWkp+WwjywgVXBsb2FkQ29tcGxldGUg5LmL5ZCO5Lya6KKr5riF6Zu2XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnRvdGFsQnl0ZXMgPSAwO1xuXG4gICAgLyoqXG4gICAgICog6K6w5b2V5byA5aeL5LiK5Lyg55qE5pe26Ze0LlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdXRpbHMubm93KCk7XG5cbiAgICB0aGlzLnJlc2V0KCk7XG59XG5cbk5ldHdvcmtJbmZvLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMubG9hZGVkQnl0ZXMsICAgICAgICAgICAgICAgICAgICAgLy8g5bey57uP5LiK5Lyg55qEXG4gICAgICAgIHV0aWxzLm5vdygpIC0gdGhpcy5fc3RhcnRUaW1lLCAgICAgICAgLy8g6Iqx6LS555qE5pe26Ze0XG4gICAgICAgIHRoaXMudG90YWxCeXRlcyAtIHRoaXMubG9hZGVkQnl0ZXMgICAgLy8g5Ymp5L2Z5pyq5LiK5Lyg55qEXG4gICAgXTtcbn07XG5cbk5ldHdvcmtJbmZvLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxvYWRlZEJ5dGVzID0gMDtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1dGlscy5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV0d29ya0luZm87XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHB1dF9vYmplY3RfdGFzay5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcbnZhciBldmVudHMgPSByZXF1aXJlKDI0KTtcbnZhciBUYXNrID0gcmVxdWlyZSgzMCk7XG5cbi8qKlxuICogUHV0T2JqZWN0VGFza1xuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBQdXRPYmplY3RUYXNrKCkge1xuICAgIFRhc2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cbnV0aWxzLmluaGVyaXRzKFB1dE9iamVjdFRhc2ssIFRhc2spO1xuXG5QdXRPYmplY3RUYXNrLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChvcHRfbWF4UmV0cmllcykge1xuICAgIGlmICh0aGlzLmFib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgZmlsZSA9IHRoaXMub3B0aW9ucy5maWxlO1xuICAgIHZhciBidWNrZXQgPSB0aGlzLm9wdGlvbnMuYnVja2V0O1xuICAgIHZhciBvYmplY3QgPSB0aGlzLm9wdGlvbnMub2JqZWN0O1xuICAgIHZhciBtZXRhcyA9IHRoaXMub3B0aW9ucy5tZXRhcztcbiAgICB2YXIgbWF4UmV0cmllcyA9IG9wdF9tYXhSZXRyaWVzID09IG51bGxcbiAgICAgICAgPyB0aGlzLm9wdGlvbnMubWF4X3JldHJpZXNcbiAgICAgICAgOiBvcHRfbWF4UmV0cmllcztcbiAgICB2YXIgcmV0cnlJbnRlcnZhbCA9IHRoaXMub3B0aW9ucy5yZXRyeV9pbnRlcnZhbDtcblxuICAgIHZhciBjb250ZW50VHlwZSA9IHV0aWxzLmd1ZXNzQ29udGVudFR5cGUoZmlsZSk7XG4gICAgdmFyIG9wdGlvbnMgPSB1LmV4dGVuZCh7J0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlfSwgbWV0YXMpO1xuXG4gICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gdGhpcy5jbGllbnQucHV0T2JqZWN0RnJvbUJsb2IoYnVja2V0LCBvYmplY3QsIGZpbGUsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMueGhyUmVxdWVzdGluZy50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2ZpbGUsIDFdKTtcblxuICAgICAgICByZXNwb25zZS5ib2R5LmJ1Y2tldCA9IGJ1Y2tldDtcbiAgICAgICAgcmVzcG9uc2UuYm9keS5vYmplY3QgPSBvYmplY3Q7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rRmlsZVVwbG9hZGVkLCBbZmlsZSwgcmVzcG9uc2VdKTtcbiAgICB9KVtcbiAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gc2VsZi5hYm9ydGVkID8gZXZlbnRzLmtBYm9ydGVkIDogZXZlbnRzLmtFcnJvcjtcbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50VHlwZSwgW2Vycm9yLCBmaWxlXSk7XG5cbiAgICAgICAgaWYgKGVycm9yLnN0YXR1c19jb2RlICYmIGVycm9yLmNvZGUgJiYgZXJyb3IucmVxdWVzdF9pZCkge1xuICAgICAgICAgICAgLy8g5bqU6K+l5piv5q2j5bi455qE6ZSZ6K+vKOavlOWmguetvuWQjeW8guW4uCnvvIzov5nnp43mg4XlhrXlsLHkuI3opoHph43or5XkuoZcbiAgICAgICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlbHNlIGlmIChlcnJvci5zdGF0dXNfY29kZSA9PT0gMCkge1xuICAgICAgICAvLyAgICAvLyDlj6/og73mmK/mlq3nvZHkuobvvIxzYWZhcmkg6Kem5Y+RIG9ubGluZS9vZmZsaW5lIOW7tui/n+avlOi+g+S5hVxuICAgICAgICAvLyAgICAvLyDmiJHku6zmjqjov5/kuIDkuIsgc2VsZi5fdXBsb2FkTmV4dCgpIOeahOaXtuaculxuICAgICAgICAvLyAgICBzZWxmLnBhdXNlKCk7XG4gICAgICAgIC8vICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICBlbHNlIGlmIChtYXhSZXRyaWVzID4gMCAmJiAhc2VsZi5hYm9ydGVkKSB7XG4gICAgICAgICAgICAvLyDov5jmnInmnLrkvJrph43or5VcbiAgICAgICAgICAgIHJldHVybiB1dGlscy5kZWxheShyZXRyeUludGVydmFsKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zdGFydChtYXhSZXRyaWVzIC0gMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOmHjeivlee7k+adn+S6hu+8jOS4jeeuoeS6hu+8jOe7p+e7reS4i+S4gOS4quaWh+S7tueahOS4iuS8oFxuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUHV0T2JqZWN0VGFzaztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL3F1ZXVlLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKipcbiAqIFF1ZXVlXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0geyp9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIFF1ZXVlKGNvbGxlY3Rpb24pIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xufVxuXG5RdWV1ZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmxlbmd0aCA8PSAwO1xufTtcblxuUXVldWUucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5sZW5ndGg7XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLnNoaWZ0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXVlO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHN0c190b2tlbl9tYW5hZ2VyLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG5cbi8qKlxuICogU3RzVG9rZW5NYW5hZ2VyXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucy5cbiAqL1xuZnVuY3Rpb24gU3RzVG9rZW5NYW5hZ2VyKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbn1cblxuU3RzVG9rZW5NYW5hZ2VyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuX2NhY2hlW2J1Y2tldF0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fY2FjaGVbYnVja2V0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gUS5yZXNvbHZlKHRoaXMuX2dldEltcGwuYXBwbHkodGhpcywgYXJndW1lbnRzKSkudGhlbihmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICBzZWxmLl9jYWNoZVtidWNrZXRdID0gcGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfSk7XG59O1xuXG5TdHNUb2tlbk1hbmFnZXIucHJvdG90eXBlLl9nZXRJbXBsID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciB1cHRva2VuX3VybCA9IG9wdGlvbnMudXB0b2tlbl91cmw7XG4gICAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnVwdG9rZW5fdGltZW91dCB8fCBvcHRpb25zLnVwdG9rZW5fanNvbnBfdGltZW91dDtcbiAgICB2YXIgdmlhSnNvbnAgPSBvcHRpb25zLnVwdG9rZW5fdmlhX2pzb25wO1xuXG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdXB0b2tlbl91cmwsXG4gICAgICAgIGpzb25wOiB2aWFKc29ucCA/ICdjYWxsYmFjaycgOiBmYWxzZSxcbiAgICAgICAgZGF0YVR5cGU6IHZpYUpzb25wID8gJ2pzb25wJyA6ICdqc29uJyxcbiAgICAgICAgdGltZW91dDogdGltZW91dCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgc3RzOiBKU09OLnN0cmluZ2lmeSh1dGlscy5nZXREZWZhdWx0QUNMKGJ1Y2tldCkpXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAvLyBwYXlsb2FkLkFjY2Vzc0tleUlkXG4gICAgICAgICAgICAvLyBwYXlsb2FkLlNlY3JldEFjY2Vzc0tleVxuICAgICAgICAgICAgLy8gcGF5bG9hZC5TZXNzaW9uVG9rZW5cbiAgICAgICAgICAgIC8vIHBheWxvYWQuRXhwaXJhdGlvblxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwYXlsb2FkKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ0dldCBzdHMgdG9rZW4gdGltZW91dCAoJyArIHRpbWVvdXQgKyAnbXMpLicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0c1Rva2VuTWFuYWdlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgdGFzay5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuXG4vKipcbiAqIOS4jeWQjOeahOWcuuaZr+S4i++8jOmcgOimgemAmui/h+S4jeWQjOeahFRhc2vmnaXlrozmiJDkuIrkvKDnmoTlt6XkvZxcbiAqXG4gKiBAcGFyYW0ge3Nkay5Cb3NDbGllbnR9IGNsaWVudCBUaGUgYm9zIGNsaWVudC5cbiAqIEBwYXJhbSB7RXZlbnREaXNwYXRjaGVyfSBldmVudERpc3BhdGNoZXIgVGhlIGV2ZW50IGRpc3BhdGNoZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgZXh0cmEgdGFzay1yZWxhdGVkIGFyZ3VtZW50cy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVGFzayhjbGllbnQsIGV2ZW50RGlzcGF0Y2hlciwgb3B0aW9ucykge1xuICAgIC8qKlxuICAgICAqIOWPr+S7peiiqyBhYm9ydCDnmoQgcHJvbWlzZSDlr7nosaFcbiAgICAgKlxuICAgICAqIEB0eXBlIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiDmoIforrDkuIDkuIvmmK/lkKbmmK/kurrkuLrkuK3mlq3kuoZcbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuYWJvcnRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5uZXR3b3JrSW5mbyA9IG51bGw7XG5cbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlciA9IGV2ZW50RGlzcGF0Y2hlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBhYnN0cmFjdE1ldGhvZCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQgbWV0aG9kLicpO1xufVxuXG4vKipcbiAqIOW8gOWni+S4iuS8oOS7u+WKoVxuICovXG5UYXNrLnByb3RvdHlwZS5zdGFydCA9IGFic3RyYWN0TWV0aG9kO1xuXG4vKipcbiAqIOaaguWBnOS4iuS8oFxuICovXG5UYXNrLnByb3RvdHlwZS5wYXVzZSA9IGFic3RyYWN0TWV0aG9kO1xuXG4vKipcbiAqIOaBouWkjeaaguWBnFxuICovXG5UYXNrLnByb3RvdHlwZS5yZXN1bWUgPSBhYnN0cmFjdE1ldGhvZDtcblxuVGFzay5wcm90b3R5cGUuc2V0TmV0d29ya0luZm8gPSBmdW5jdGlvbiAobmV0d29ya0luZm8pIHtcbiAgICB0aGlzLm5ldHdvcmtJbmZvID0gbmV0d29ya0luZm87XG59O1xuXG4vKipcbiAqIOe7iOatouS4iuS8oOS7u+WKoVxuICovXG5UYXNrLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy54aHJSZXF1ZXN0aW5nXG4gICAgICAgICYmIHR5cGVvZiB0aGlzLnhoclJlcXVlc3RpbmcuYWJvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy54aHJSZXF1ZXN0aW5nLmFib3J0KCk7XG4gICAgICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IG51bGw7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSB1cGxvYWRlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcbnZhciBldmVudHMgPSByZXF1aXJlKDI0KTtcbnZhciBrRGVmYXVsdE9wdGlvbnMgPSByZXF1aXJlKDIzKTtcbnZhciBQdXRPYmplY3RUYXNrID0gcmVxdWlyZSgyNyk7XG52YXIgTXVsdGlwYXJ0VGFzayA9IHJlcXVpcmUoMjUpO1xudmFyIFN0c1Rva2VuTWFuYWdlciA9IHJlcXVpcmUoMjkpO1xudmFyIE5ldHdvcmtJbmZvID0gcmVxdWlyZSgyNik7XG5cbnZhciBBdXRoID0gcmVxdWlyZSgxNSk7XG52YXIgQm9zQ2xpZW50ID0gcmVxdWlyZSgxNyk7XG5cbi8qKlxuICogQkNFIEJPUyBVcGxvYWRlclxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBvcHRpb25zIOmFjee9ruWPguaVsFxuICovXG5mdW5jdGlvbiBVcGxvYWRlcihvcHRpb25zKSB7XG4gICAgaWYgKHUuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgLy8g5pSv5oyB566A5L6/55qE5YaZ5rOV77yM5Y+v5Lul5LuOIERPTSDph4zpnaLliIbmnpDnm7jlhbPnmoTphY3nva4uXG4gICAgICAgIG9wdGlvbnMgPSB1LmV4dGVuZCh7XG4gICAgICAgICAgICBicm93c2VfYnV0dG9uOiBvcHRpb25zLFxuICAgICAgICAgICAgYXV0b19zdGFydDogdHJ1ZVxuICAgICAgICB9LCAkKG9wdGlvbnMpLmRhdGEoKSk7XG4gICAgfVxuXG4gICAgdmFyIHJ1bnRpbWVPcHRpb25zID0ge307XG4gICAgdGhpcy5vcHRpb25zID0gdS5leHRlbmQoe30sIGtEZWZhdWx0T3B0aW9ucywgcnVudGltZU9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplID0gdXRpbHMucGFyc2VTaXplKHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplKTtcbiAgICB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZVxuICAgICAgICA9IHV0aWxzLnBhcnNlU2l6ZSh0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZSk7XG4gICAgdGhpcy5vcHRpb25zLmNodW5rX3NpemUgPSB1dGlscy5wYXJzZVNpemUodGhpcy5vcHRpb25zLmNodW5rX3NpemUpO1xuXG4gICAgdmFyIGNyZWRlbnRpYWxzID0gdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscztcbiAgICBpZiAoIWNyZWRlbnRpYWxzICYmIHRoaXMub3B0aW9ucy5ib3NfYWsgJiYgdGhpcy5vcHRpb25zLmJvc19zaykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgYWs6IHRoaXMub3B0aW9ucy5ib3NfYWssXG4gICAgICAgICAgICBzazogdGhpcy5vcHRpb25zLmJvc19za1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb3NDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5jbGllbnQgPSBuZXcgQm9zQ2xpZW50KHtcbiAgICAgICAgZW5kcG9pbnQ6IHV0aWxzLm5vcm1hbGl6ZUVuZHBvaW50KHRoaXMub3B0aW9ucy5ib3NfZW5kcG9pbnQpLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscyxcbiAgICAgICAgc2Vzc2lvblRva2VuOiB0aGlzLm9wdGlvbnMudXB0b2tlblxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog6ZyA6KaB562J5b6F5LiK5Lyg55qE5paH5Lu25YiX6KGo77yM5q+P5qyh5LiK5Lyg55qE5pe25YCZ77yM5LuO6L+Z6YeM6Z2i5Yig6ZmkXG4gICAgICog5oiQ5Yqf5oiW6ICF5aSx6LSl6YO95LiN5Lya5YaN5pS+5Zue5Y675LqGXG4gICAgICogQHBhcmFtIHtBcnJheS48RmlsZT59XG4gICAgICovXG4gICAgdGhpcy5fZmlsZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIOato+WcqOS4iuS8oOeahOaWh+S7tuWIl+ihqC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgRmlsZT59XG4gICAgICovXG4gICAgdGhpcy5fdXBsb2FkaW5nRmlsZXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuiiq+S4reaWreS6hu+8jOavlOWmgiB0aGlzLnN0b3BcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9hYm9ydCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5aSE5LqO5LiK5Lyg55qE6L+H56iL5Lit77yM5Lmf5bCx5piv5q2j5Zyo5aSE55CGIHRoaXMuX2ZpbGVzIOmYn+WIl+eahOWGheWuuS5cbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl93b3JraW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKbmlK/mjIF4aHIyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5feGhyMlN1cHBvcnRlZCA9IHV0aWxzLmlzWGhyMlN1cHBvcnRlZCgpO1xuXG4gICAgdGhpcy5fbmV0d29ya0luZm8gPSBuZXcgTmV0d29ya0luZm8oKTtcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuVXBsb2FkZXIucHJvdG90eXBlLl9nZXRDdXN0b21pemVkU2lnbmF0dXJlID0gZnVuY3Rpb24gKHVwdG9rZW5VcmwpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgdGltZW91dCA9IG9wdGlvbnMudXB0b2tlbl90aW1lb3V0IHx8IG9wdGlvbnMudXB0b2tlbl9qc29ucF90aW1lb3V0O1xuICAgIHZhciB2aWFKc29ucCA9IG9wdGlvbnMudXB0b2tlbl92aWFfanNvbnA7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKF8sIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycykge1xuICAgICAgICBpZiAoL1xcYmVkPShbXFx3XFwuXSspXFxiLy50ZXN0KGxvY2F0aW9uLnNlYXJjaCkpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuSG9zdCA9IFJlZ0V4cC4kMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1LmlzQXJyYXkob3B0aW9ucy5hdXRoX3N0cmlwcGVkX2hlYWRlcnMpKSB7XG4gICAgICAgICAgICBoZWFkZXJzID0gdS5vbWl0KGhlYWRlcnMsIG9wdGlvbnMuYXV0aF9zdHJpcHBlZF9oZWFkZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdXB0b2tlblVybCxcbiAgICAgICAgICAgIGpzb25wOiB2aWFKc29ucCA/ICdjYWxsYmFjaycgOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiB2aWFKc29ucCA/ICdqc29ucCcgOiAnanNvbicsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGh0dHBNZXRob2Q6IGh0dHBNZXRob2QsXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAvLyBkZWxheTogfn4oTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICAgICAgICBxdWVyaWVzOiBKU09OLnN0cmluZ2lmeShwYXJhbXMgfHwge30pLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IEpTT04uc3RyaW5naWZ5KGhlYWRlcnMgfHwge30pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdHZXQgYXV0aG9yaXphdGlvbiB0aW1lb3V0ICgnICsgdGltZW91dCArICdtcykuJykpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQuc3RhdHVzQ29kZSA9PT0gMjAwICYmIHBheWxvYWQuc2lnbmF0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGF5bG9hZC5zaWduYXR1cmUsIHBheWxvYWQueGJjZURhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignY3JlYXRlU2lnbmF0dXJlIGZhaWxlZCwgc3RhdHVzQ29kZSA9ICcgKyBwYXlsb2FkLnN0YXR1c0NvZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiDosIPnlKggdGhpcy5vcHRpb25zLmluaXQg6YeM6Z2i6YWN572u55qE5pa55rOVXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUg5pa55rOV5ZCN56ewXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gYXJncyDosIPnlKjml7blgJnnmoTlj4LmlbAuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSB0aHJvd0Vycm9ycyDlpoLmnpzlj5HnlJ/lvILluLjnmoTml7blgJnvvIzmmK/lkKbpnIDopoHmipvlh7rmnaVcbiAqIEByZXR1cm4geyp9IOS6i+S7tueahOi/lOWbnuWAvC5cbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9pbnZva2UgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgYXJncywgdGhyb3dFcnJvcnMpIHtcbiAgICB2YXIgaW5pdCA9IHRoaXMub3B0aW9ucy5pbml0IHx8IHRoaXMub3B0aW9ucy5Jbml0O1xuICAgIGlmICghaW5pdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1ldGhvZCA9IGluaXRbbWV0aG9kTmFtZV07XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIHZhciB1cCA9IG51bGw7XG4gICAgICAgIGFyZ3MgPSBhcmdzID09IG51bGwgPyBbdXBdIDogW3VwXS5jb25jYXQoYXJncyk7XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgICBpZiAodGhyb3dFcnJvcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBRLnJlamVjdChleCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOWIneWni+WMluaOp+S7ti5cbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciBhY2NlcHQgPSBvcHRpb25zLmFjY2VwdDtcblxuICAgIHZhciBidG5FbGVtZW50ID0gJChvcHRpb25zLmJyb3dzZV9idXR0b24pO1xuICAgIHZhciBub2RlTmFtZSA9IGJ0bkVsZW1lbnQucHJvcCgnbm9kZU5hbWUnKTtcbiAgICBpZiAobm9kZU5hbWUgIT09ICdJTlBVVCcpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRDb250YWluZXIgPSBidG5FbGVtZW50O1xuXG4gICAgICAgIC8vIOWmguaenOacrOi6q+S4jeaYryA8aW5wdXQgdHlwZT1cImZpbGVcIiAvPu+8jOiHquWKqOi/veWKoOS4gOS4quS4iuWOu1xuICAgICAgICAvLyAxLiBvcHRpb25zLmJyb3dzZV9idXR0b24g5ZCO6Z2i6L+95Yqg5LiA5Liq5YWD57SgIDxkaXY+PGlucHV0IHR5cGU9XCJmaWxlXCIgLz48L2Rpdj5cbiAgICAgICAgLy8gMi4gYnRuRWxlbWVudC5wYXJlbnQoKS5jc3MoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgICAgIC8vIDMuIC5iY2UtYm9zLXVwbG9hZGVyLWlucHV0LWNvbnRhaW5lciDnlKjmnaXoh6rlrprkuYnoh6rlt7HnmoTmoLflvI9cbiAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudENvbnRhaW5lci5vdXRlcldpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50Q29udGFpbmVyLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgdmFyIGlucHV0RWxlbWVudENvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJiY2UtYm9zLXVwbG9hZGVyLWlucHV0LWNvbnRhaW5lclwiPjxpbnB1dCB0eXBlPVwiZmlsZVwiIC8+PC9kaXY+Jyk7XG4gICAgICAgIGlucHV0RWxlbWVudENvbnRhaW5lci5jc3Moe1xuICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICd0b3AnOiAwLCAnbGVmdCc6IDAsXG4gICAgICAgICAgICAnd2lkdGgnOiB3aWR0aCwgJ2hlaWdodCc6IGhlaWdodCxcbiAgICAgICAgICAgICdvdmVyZmxvdyc6ICdoaWRkZW4nLFxuICAgICAgICAgICAgLy8g5aaC5p6c5pSv5oyBIHhocjLvvIzmioogaW5wdXRbdHlwZT1maWxlXSDmlL7liLDmjInpkq7nmoTkuIvpnaLvvIzpgJrov4fkuLvliqjosIPnlKggZmlsZS5jbGljaygpIOinpuWPkVxuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pSv5oyBeGhyMiwg5oqKIGlucHV0W3R5cGU9ZmlsZV0g5pS+5Yiw5oyJ6ZKu55qE5LiK6Z2i77yM6YCa6L+H55So5oi35Li75Yqo54K55Ye7IGlucHV0W3R5cGU9ZmlsZV0g6Kem5Y+RXG4gICAgICAgICAgICAnei1pbmRleCc6IHRoaXMuX3hocjJTdXBwb3J0ZWQgPyA5OSA6IDEwMFxuICAgICAgICB9KTtcbiAgICAgICAgaW5wdXRFbGVtZW50Q29udGFpbmVyLmZpbmQoJ2lucHV0JykuY3NzKHtcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAndG9wJzogMCwgJ2xlZnQnOiAwLFxuICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLCAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6ICc5OTlweCcsXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAnei1pbmRleCc6IHRoaXMuX3hocjJTdXBwb3J0ZWQgPyAxMDAgOiA5OVxuICAgICAgICB9KTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5hZnRlcihpbnB1dEVsZW1lbnRDb250YWluZXIpO1xuICAgICAgICBlbGVtZW50Q29udGFpbmVyLnBhcmVudCgpLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcblxuICAgICAgICAvLyDmioogYnJvd3NlX2J1dHRvbiDkv67mlLnkuLrlvZPliY3nlJ/miJDnmoTpgqPkuKrlhYPntKBcbiAgICAgICAgb3B0aW9ucy5icm93c2VfYnV0dG9uID0gaW5wdXRFbGVtZW50Q29udGFpbmVyLmZpbmQoJ2lucHV0Jyk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIGVsZW1lbnRDb250YWluZXIuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuYnJvd3NlX2J1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLl94aHIyU3VwcG9ydGVkXG4gICAgICAgICYmIHR5cGVvZiBtT3hpZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgJiYgdS5pc0Z1bmN0aW9uKG1PeGllLkZpbGVJbnB1dCkpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21veGllY29kZS9tb3hpZS93aWtpL0ZpbGVJbnB1dFxuICAgICAgICAvLyBtT3hpZS5GaWxlSW5wdXQg5Y+q5pSv5oyBXG4gICAgICAgIC8vIFsrXTogYnJvd3NlX2J1dHRvbiwgYWNjZXB0IG11bHRpcGxlLCBkaXJlY3RvcnksIGZpbGVcbiAgICAgICAgLy8gW3hdOiBjb250YWluZXIsIHJlcXVpcmVkX2NhcHNcbiAgICAgICAgdmFyIGZpbGVJbnB1dCA9IG5ldyBtT3hpZS5GaWxlSW5wdXQoe1xuICAgICAgICAgICAgcnVudGltZV9vcmRlcjogJ2ZsYXNoLGh0bWw0JyxcbiAgICAgICAgICAgIGJyb3dzZV9idXR0b246ICQob3B0aW9ucy5icm93c2VfYnV0dG9uKS5nZXQoMCksXG4gICAgICAgICAgICBzd2ZfdXJsOiBvcHRpb25zLmZsYXNoX3N3Zl91cmwsXG4gICAgICAgICAgICBhY2NlcHQ6IHV0aWxzLmV4cGFuZEFjY2VwdFRvQXJyYXkoYWNjZXB0KSxcbiAgICAgICAgICAgIG11bHRpcGxlOiBvcHRpb25zLm11bHRpX3NlbGVjdGlvbixcbiAgICAgICAgICAgIGRpcmVjdG9yeTogb3B0aW9ucy5kaXJfc2VsZWN0aW9uLFxuICAgICAgICAgICAgZmlsZTogJ2ZpbGUnICAgICAgLy8gUG9zdE9iamVjdOaOpeWPo+imgeaxguWbuuWumuaYryAnZmlsZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmlsZUlucHV0Lm9uY2hhbmdlID0gdS5iaW5kKHRoaXMuX29uRmlsZXNBZGRlZCwgdGhpcyk7XG4gICAgICAgIGZpbGVJbnB1dC5vbnJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5faW5pdEV2ZW50cygpO1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rUG9zdEluaXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZpbGVJbnB1dC5pbml0KCk7XG4gICAgfVxuXG4gICAgdmFyIHByb21pc2UgPSBvcHRpb25zLmJvc19jcmVkZW50aWFsc1xuICAgICAgICA/IFEucmVzb2x2ZSgpXG4gICAgICAgIDogc2VsZi5yZWZyZXNoU3RzVG9rZW4oKTtcblxuICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmJvc19jcmVkZW50aWFscykge1xuICAgICAgICAgICAgc2VsZi5jbGllbnQuY3JlYXRlU2lnbmF0dXJlID0gZnVuY3Rpb24gKF8sIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycykge1xuICAgICAgICAgICAgICAgIHZhciBjcmVkZW50aWFscyA9IF8gfHwgdGhpcy5jb25maWcuY3JlZGVudGlhbHM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFEuZmNhbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKGNyZWRlbnRpYWxzLmFrLCBjcmVkZW50aWFscy5zayk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhdXRoLmdlbmVyYXRlQXV0aG9yaXphdGlvbihodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLnVwdG9rZW5fdXJsICYmIG9wdGlvbnMuZ2V0X25ld191cHRva2VuID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyDmnI3liqHnq6/liqjmgIHnrb7lkI3nmoTmlrnlvI9cbiAgICAgICAgICAgIHNlbGYuY2xpZW50LmNyZWF0ZVNpZ25hdHVyZSA9IHNlbGYuX2dldEN1c3RvbWl6ZWRTaWduYXR1cmUob3B0aW9ucy51cHRva2VuX3VybCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICAgICAgLy8g5a+55LqO5LiN5pSv5oyBIHhocjIg55qE5oOF5Ya177yM5Lya5ZyoIG9ucmVhZHkg55qE5pe25YCZ5Y676Kem5Y+R5LqL5Lu2XG4gICAgICAgICAgICBzZWxmLl9pbml0RXZlbnRzKCk7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtQb3N0SW5pdCk7XG4gICAgICAgIH1cbiAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtFcnJvciwgW2Vycm9yXSk7XG4gICAgfSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAodGhpcy5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICB2YXIgYnRuID0gJChvcHRpb25zLmJyb3dzZV9idXR0b24pO1xuICAgICAgICBpZiAoYnRuLmF0dHIoJ211bHRpcGxlJykgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8g5aaC5p6c55So5oi35rKh5pyJ5pi+56S655qE6K6+572u6L+HIG11bHRpcGxl77yM5L2/55SoIG11bHRpX3NlbGVjdGlvbiDnmoTorr7nva5cbiAgICAgICAgICAgIC8vIOWQpuWImeS/neeVmSA8aW5wdXQgbXVsdGlwbGUgLz4g55qE5YaF5a65XG4gICAgICAgICAgICBidG4uYXR0cignbXVsdGlwbGUnLCAhIW9wdGlvbnMubXVsdGlfc2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBidG4ub24oJ2NoYW5nZScsIHUuYmluZCh0aGlzLl9vbkZpbGVzQWRkZWQsIHRoaXMpKTtcblxuICAgICAgICB2YXIgYWNjZXB0ID0gb3B0aW9ucy5hY2NlcHQ7XG4gICAgICAgIGlmIChhY2NlcHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gU2FmYXJpIOWPquaUr+aMgSBtaW1lLXR5cGVcbiAgICAgICAgICAgIC8vIENocm9tZSDmlK/mjIEgbWltZS10eXBlIOWSjCBleHRzXG4gICAgICAgICAgICAvLyBGaXJlZm94IOWPquaUr+aMgSBleHRzXG4gICAgICAgICAgICAvLyBOT1RFOiBleHRzIOW/hemhu+aciSAuIOi/meS4quWJjee8gO+8jOS+i+WmgiAudHh0IOaYr+WQiOazleeahO+8jHR4dCDmmK/kuI3lkIjms5XnmoRcbiAgICAgICAgICAgIHZhciBleHRzID0gdXRpbHMuZXhwYW5kQWNjZXB0KGFjY2VwdCk7XG4gICAgICAgICAgICB2YXIgaXNTYWZhcmkgPSAvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIC9BcHBsZSBDb21wdXRlci8udGVzdChuYXZpZ2F0b3IudmVuZG9yKTtcbiAgICAgICAgICAgIGlmIChpc1NhZmFyaSkge1xuICAgICAgICAgICAgICAgIGV4dHMgPSB1dGlscy5leHRUb01pbWVUeXBlKGV4dHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmF0dHIoJ2FjY2VwdCcsIGV4dHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGlyX3NlbGVjdGlvbikge1xuICAgICAgICAgICAgYnRuLmF0dHIoJ2RpcmVjdG9yeScsIHRydWUpO1xuICAgICAgICAgICAgYnRuLmF0dHIoJ21vemRpcmVjdG9yeScsIHRydWUpO1xuICAgICAgICAgICAgYnRuLmF0dHIoJ3dlYmtpdGRpcmVjdG9yeScsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jbGllbnQub24oJ3Byb2dyZXNzJywgdS5iaW5kKHRoaXMuX29uVXBsb2FkUHJvZ3Jlc3MsIHRoaXMpKTtcbiAgICAvLyBYWFgg5b+F6aG757uR5a6aIGVycm9yIOeahOWkhOeQhuWHveaVsO+8jOWQpuWImeS8miB0aHJvdyBuZXcgRXJyb3JcbiAgICB0aGlzLmNsaWVudC5vbignZXJyb3InLCB1LmJpbmQodGhpcy5fb25FcnJvciwgdGhpcykpO1xuXG4gICAgLy8gJCh3aW5kb3cpLm9uKCdvbmxpbmUnLCB1LmJpbmQodGhpcy5faGFuZGxlT25saW5lU3RhdHVzLCB0aGlzKSk7XG4gICAgLy8gJCh3aW5kb3cpLm9uKCdvZmZsaW5lJywgdS5iaW5kKHRoaXMuX2hhbmRsZU9mZmxpbmVTdGF0dXMsIHRoaXMpKTtcblxuICAgIGlmICghdGhpcy5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICAvLyDlpoLmnpzmtY/op4jlmajkuI3mlK/mjIEgeGhyMu+8jOmCo+S5iOWwseWIh+aNouWIsCBtT3hpZS5YTUxIdHRwUmVxdWVzdFxuICAgICAgICAvLyDkvYbmmK/lm6DkuLogbU94aWUuWE1MSHR0cFJlcXVlc3Qg5peg5rOV5Y+R6YCBIEhFQUQg6K+35rGC77yM5peg5rOV6I635Y+WIFJlc3BvbnNlIEhlYWRlcnPvvIxcbiAgICAgICAgLy8g5Zug5q2kIGdldE9iamVjdE1ldGFkYXRh5a6e6ZmF5LiK5peg5rOV5q2j5bi45bel5L2c77yM5Zug5q2k5oiR5Lus6ZyA6KaB77yaXG4gICAgICAgIC8vIDEuIOiuqSBCT1Mg5paw5aKeIFJFU1QgQVBJ77yM5ZyoIEdFVCDnmoTor7fmsYLnmoTlkIzml7bvvIzmioogeC1iY2UtKiDmlL7liLAgUmVzcG9uc2UgQm9keSDov5Tlm55cbiAgICAgICAgLy8gMi4g5Li05pe25pa55qGI77ya5paw5aKe5LiA5LiqIFJlbGF5IOacjeWKoe+8jOWunueOsOaWueahiCAxXG4gICAgICAgIC8vICAgIEdFVCAvYmouYmNlYm9zLmNvbS92MS9idWNrZXQvb2JqZWN0P2h0dHBNZXRob2Q9SEVBRFxuICAgICAgICAvLyAgICBIb3N0OiByZWxheS5lZmUudGVjaFxuICAgICAgICAvLyAgICBBdXRob3JpemF0aW9uOiB4eHhcbiAgICAgICAgLy8gb3B0aW9ucy5ib3NfcmVsYXlfc2VydmVyXG4gICAgICAgIC8vIG9wdGlvbnMuc3dmX3VybFxuICAgICAgICB0aGlzLmNsaWVudC5zZW5kSFRUUFJlcXVlc3QgPSB1LmJpbmQodXRpbHMuZml4WGhyKHRoaXMub3B0aW9ucywgdHJ1ZSksIHRoaXMuY2xpZW50KTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX2ZpbHRlckZpbGVzID0gZnVuY3Rpb24gKGNhbmRpZGF0ZXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyDlpoLmnpwgbWF4RmlsZVNpemUgPT09IDAg5bCx6K+05piO5LiN6ZmQ5Yi25aSn5bCPXG4gICAgdmFyIG1heEZpbGVTaXplID0gdGhpcy5vcHRpb25zLm1heF9maWxlX3NpemU7XG5cbiAgICB2YXIgZmlsZXMgPSB1LmZpbHRlcihjYW5kaWRhdGVzLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBpZiAobWF4RmlsZVNpemUgPiAwICYmIGZpbGUuc2l6ZSA+IG1heEZpbGVTaXplKSB7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtGaWxlRmlsdGVyZWQsIFtmaWxlXSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIOajgOafpeWQjue8gOS5i+exu+eahFxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShldmVudHMua0ZpbGVzRmlsdGVyLCBbZmlsZXNdKSB8fCBmaWxlcztcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkQWJvcnRIYW5kbGVyKGl0ZW0sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpdGVtLl9hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rQWJvcnRlZCwgW251bGwsIGl0ZW1dKTtcbiAgICB9O1xufVxuXG5VcGxvYWRlci5wcm90b3R5cGUuX29uRmlsZXNBZGRlZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBmaWxlcyA9IGUudGFyZ2V0LmZpbGVzO1xuICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgLy8gSUU3LCBJRTgg5L2O54mI5pys5rWP6KeI5Zmo55qE5aSE55CGXG4gICAgICAgIHZhciBuYW1lID0gZS50YXJnZXQudmFsdWUuc3BsaXQoL1tcXC9cXFxcXS8pLnBvcCgpO1xuICAgICAgICBmaWxlcyA9IFtcbiAgICAgICAgICAgIHtuYW1lOiBuYW1lLCBzaXplOiAwfVxuICAgICAgICBdO1xuICAgIH1cbiAgICBmaWxlcyA9IHRoaXMuX2ZpbHRlckZpbGVzKGZpbGVzKTtcbiAgICBpZiAodS5pc0FycmF5KGZpbGVzKSAmJiBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHRvdGFsQnl0ZXMgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGZpbGVzW2ldO1xuXG4gICAgICAgICAgICAvLyDov5nph4zmmK8gYWJvcnQg55qE6buY6K6k5a6e546w77yM5byA5aeL5LiK5Lyg55qE5pe25YCZ77yM5Lya5pS55oiQ5Y+m5aSW55qE5LiA56eN5a6e546w5pa55byPXG4gICAgICAgICAgICAvLyDpu5jorqTnmoTlrp7njrDmmK/kuLrkuobmlK/mjIHlnKjmsqHmnInlvIDlp4vkuIrkvKDkuYvliY3vvIzkuZ/lj6/ku6Xlj5bmtojkuIrkvKDnmoTpnIDmsYJcbiAgICAgICAgICAgIGl0ZW0uYWJvcnQgPSBidWlsZEFib3J0SGFuZGxlcihpdGVtLCBzZWxmKTtcblxuICAgICAgICAgICAgLy8g5YaF6YOo55qEIHV1aWTvvIzlpJbpg6jkuZ/lj6/ku6Xkvb/nlKjvvIzmr5TlpoIgcmVtb3ZlKGl0ZW0udXVpZCkgLyByZW1vdmUoaXRlbSlcbiAgICAgICAgICAgIGl0ZW0udXVpZCA9IHV0aWxzLnV1aWQoKTtcblxuICAgICAgICAgICAgdG90YWxCeXRlcyArPSBpdGVtLnNpemU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbmV0d29ya0luZm8udG90YWxCeXRlcyArPSB0b3RhbEJ5dGVzO1xuICAgICAgICB0aGlzLl9maWxlcy5wdXNoLmFwcGx5KHRoaXMuX2ZpbGVzLCBmaWxlcyk7XG4gICAgICAgIHRoaXMuX2ludm9rZShldmVudHMua0ZpbGVzQWRkZWQsIFtmaWxlc10pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b19zdGFydCkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl9vbkVycm9yID0gZnVuY3Rpb24gKGUpIHtcbn07XG5cbi8qKlxuICog5aSE55CG5LiK5Lyg6L+b5bqm55qE5Zue5o6J5Ye95pWwLlxuICogMS4g6L+Z6YeM6KaB5Yy65YiG5paH5Lu255qE5LiK5Lyg6L+Y5piv5YiG54mH55qE5LiK5Lyg77yM5YiG54mH55qE5LiK5Lyg5piv6YCa6L+HIHBhcnROdW1iZXIg5ZKMIHVwbG9hZElkIOeahOe7hOWQiOadpeWIpOaWreeahFxuICogMi4gSUU2LDcsOCw55LiL6Z2i77yM5piv5LiN6ZyA6KaB6ICD6JmR55qE77yM5Zug5Li65LiN5Lya6Kem5Y+R6L+Z5Liq5LqL5Lu277yM6ICM5piv55u05o6l5ZyoIF9zZW5kUG9zdFJlcXVlc3Qg6Kem5Y+RIGtVcGxvYWRQcm9ncmVzcyDkuoZcbiAqIDMuIOWFtuWug+aDheWGteS4i++8jOaIkeS7rOWIpOaWreS4gOS4iyBSZXF1ZXN0IEJvZHkg55qE57G75Z6L5piv5ZCm5pivIEJsb2LvvIzku47ogIzpgb/lhY3lr7nkuo7lhbblroPnsbvlnovnmoTor7fmsYLvvIzop6blj5Ega1VwbG9hZFByb2dyZXNzXG4gKiAgICDkvovlpoLvvJpIRUFE77yMR0VU77yMUE9TVChJbml0TXVsdGlwYXJ0KSDnmoTml7blgJnvvIzmmK/msqHlv4XopoHop6blj5Ega1VwbG9hZFByb2dyZXNzIOeahFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlICBQcm9ncmVzcyBFdmVudCDlr7nosaEuXG4gKiBAcGFyYW0ge09iamVjdH0gaHR0cENvbnRleHQgc2VuZEhUVFBSZXF1ZXN0IOeahOWPguaVsFxuICovXG5VcGxvYWRlci5wcm90b3R5cGUuX29uVXBsb2FkUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSwgaHR0cENvbnRleHQpIHtcbiAgICB2YXIgYXJncyA9IGh0dHBDb250ZXh0LmFyZ3M7XG4gICAgdmFyIGZpbGUgPSBhcmdzLmJvZHk7XG5cbiAgICBpZiAoIXV0aWxzLmlzQmxvYihmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHByb2dyZXNzID0gZS5sZW5ndGhDb21wdXRhYmxlXG4gICAgICAgID8gZS5sb2FkZWQgLyBlLnRvdGFsXG4gICAgICAgIDogMDtcblxuICAgIHRoaXMuX25ldHdvcmtJbmZvLmxvYWRlZEJ5dGVzICs9IChlLmxvYWRlZCAtIGZpbGUuX3ByZXZpb3VzTG9hZGVkKTtcbiAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtOZXR3b3JrU3BlZWQsIHRoaXMuX25ldHdvcmtJbmZvLmR1bXAoKSk7XG4gICAgZmlsZS5fcHJldmlvdXNMb2FkZWQgPSBlLmxvYWRlZDtcblxuICAgIHZhciBldmVudFR5cGUgPSBldmVudHMua1VwbG9hZFByb2dyZXNzO1xuICAgIGlmIChhcmdzLnBhcmFtcy5wYXJ0TnVtYmVyICYmIGFyZ3MucGFyYW1zLnVwbG9hZElkKSB7XG4gICAgICAgIC8vIElFNiw3LDgsOeS4i+mdouS4jeS8muaciXBhcnROdW1iZXLlkox1cGxvYWRJZFxuICAgICAgICAvLyDmraTml7bnmoQgZmlsZSDmmK8gc2xpY2Ug55qE57uT5p6c77yM5Y+v6IO95rKh5pyJ6Ieq5a6a5LmJ55qE5bGe5oCnXG4gICAgICAgIC8vIOavlOWmgiBkZW1vIOmHjOmdoueahCBfX2lkLCBfX21lZGlhSWQg5LmL57G755qEXG4gICAgICAgIGV2ZW50VHlwZSA9IGV2ZW50cy5rVXBsb2FkUGFydFByb2dyZXNzO1xuICAgIH1cblxuICAgIHRoaXMuX2ludm9rZShldmVudFR5cGUsIFtmaWxlLCBwcm9ncmVzcywgZV0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICBpdGVtID0gdGhpcy5fdXBsb2FkaW5nRmlsZXNbaXRlbV0gfHwgdS5maW5kKHRoaXMuX2ZpbGVzLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUudXVpZCA9PT0gaXRlbTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0uYWJvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaXRlbS5hYm9ydCgpO1xuICAgIH1cbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fd29ya2luZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ZpbGVzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl93b3JraW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYWJvcnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbmV0d29ya0luZm8ucmVzZXQoKTtcblxuICAgICAgICB2YXIgdGFza1BhcmFsbGVsID0gdGhpcy5vcHRpb25zLmJvc190YXNrX3BhcmFsbGVsO1xuICAgICAgICAvLyDov5nph4zmsqHmnInkvb/nlKggYXN5bmMuZWFjaExpbWl0IOeahOWOn+WboOaYryB0aGlzLl9maWxlcyDlj6/og73kvJrooqvliqjmgIHnmoTkv67mlLlcbiAgICAgICAgdXRpbHMuZWFjaExpbWl0KHRoaXMuX2ZpbGVzLCB0YXNrUGFyYWxsZWwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZmlsZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBmaWxlLl9wcmV2aW91c0xvYWRlZCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5fdXBsb2FkTmV4dChmaWxlKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmdWxmaWxsbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSlbXG4gICAgICAgICAgICAgICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVqZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fdXBsb2FkaW5nRmlsZXNbZmlsZS51dWlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl93b3JraW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZi5fZmlsZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9uZXR3b3JrSW5mby50b3RhbEJ5dGVzID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtVcGxvYWRDb21wbGV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9hYm9ydCA9IHRydWU7XG4gICAgdGhpcy5fd29ya2luZyA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiDliqjmgIHorr7nva4gVXBsb2FkZXIg55qE5p+Q5Lqb5Y+C5pWw77yM5b2T5YmN5Y+q5pSv5oyB5Yqo5oCB55qE5L+u5pS5XG4gKiBib3NfY3JlZGVudGlhbHMsIHVwdG9rZW4sIGJvc19idWNrZXQsIGJvc19lbmRwb2ludFxuICogYm9zX2FrLCBib3Nfc2tcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDnlKjmiLfliqjmgIHorr7nva7nmoTlj4LmlbDvvIjlj6rmlK/mjIHpg6jliIbvvIlcbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzdXBwb3J0ZWRPcHRpb25zID0gdS5waWNrKG9wdGlvbnMsICdib3NfY3JlZGVudGlhbHMnLFxuICAgICAgICAnYm9zX2FrJywgJ2Jvc19zaycsICd1cHRva2VuJywgJ2Jvc19idWNrZXQnLCAnYm9zX2VuZHBvaW50Jyk7XG4gICAgdGhpcy5vcHRpb25zID0gdS5leHRlbmQodGhpcy5vcHRpb25zLCBzdXBwb3J0ZWRPcHRpb25zKTtcblxuICAgIHZhciBjb25maWcgPSB0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5jb25maWc7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSBudWxsO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmJvc19jcmVkZW50aWFscykge1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSBvcHRpb25zLmJvc19jcmVkZW50aWFscztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLmJvc19hayAmJiBvcHRpb25zLmJvc19zaykge1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgYWs6IG9wdGlvbnMuYm9zX2FrLFxuICAgICAgICAgICAgICAgIHNrOiBvcHRpb25zLmJvc19za1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgY29uZmlnLmNyZWRlbnRpYWxzID0gY3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMudXB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLnNlc3Npb25Ub2tlbiA9IG9wdGlvbnMudXB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5ib3NfZW5kcG9pbnQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5lbmRwb2ludCA9IHV0aWxzLm5vcm1hbGl6ZUVuZHBvaW50KG9wdGlvbnMuYm9zX2VuZHBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog5pyJ55qE55So5oi35biM5pyb5Li75Yqo5pu05pawIHN0cyB0b2tlbu+8jOmBv+WFjei/h+acn+eahOmXrumimFxuICpcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5yZWZyZXNoU3RzVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgIHZhciBzdHNNb2RlID0gc2VsZi5feGhyMlN1cHBvcnRlZFxuICAgICAgICAmJiBvcHRpb25zLmJvc19idWNrZXRcbiAgICAgICAgJiYgb3B0aW9ucy51cHRva2VuX3VybFxuICAgICAgICAmJiBvcHRpb25zLmdldF9uZXdfdXB0b2tlbiA9PT0gZmFsc2U7XG4gICAgaWYgKHN0c01vZGUpIHtcbiAgICAgICAgdmFyIHN0bSA9IG5ldyBTdHNUb2tlbk1hbmFnZXIob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBzdG0uZ2V0KG9wdGlvbnMuYm9zX2J1Y2tldCkudGhlbihmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuc2V0T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgYm9zX2FrOiBwYXlsb2FkLkFjY2Vzc0tleUlkLFxuICAgICAgICAgICAgICAgIGJvc19zazogcGF5bG9hZC5TZWNyZXRBY2Nlc3NLZXksXG4gICAgICAgICAgICAgICAgdXB0b2tlbjogcGF5bG9hZC5TZXNzaW9uVG9rZW5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl91cGxvYWROZXh0ID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICBpZiAodGhpcy5fYWJvcnQpIHtcbiAgICAgICAgdGhpcy5fd29ya2luZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgaWYgKGZpbGUuX2Fib3J0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciB0aHJvd0Vycm9ycyA9IHRydWU7XG4gICAgdmFyIHJldHVyblZhbHVlID0gdGhpcy5faW52b2tlKGV2ZW50cy5rQmVmb3JlVXBsb2FkLCBbZmlsZV0sIHRocm93RXJyb3JzKTtcbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIFEucmVzb2x2ZShyZXR1cm5WYWx1ZSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX3VwbG9hZE5leHRJbXBsKGZpbGUpO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0Vycm9yLCBbZXJyb3IsIGZpbGVdKTtcbiAgICAgICAgfSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX3VwbG9hZE5leHRJbXBsID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIG9iamVjdCA9IGZpbGUubmFtZTtcbiAgICB2YXIgdGhyb3dFcnJvcnMgPSB0cnVlO1xuXG4gICAgdmFyIGRlZmF1bHRUYXNrT3B0aW9ucyA9IHUucGljayhvcHRpb25zLFxuICAgICAgICAnZmxhc2hfc3dmX3VybCcsICdtYXhfcmV0cmllcycsICdjaHVua19zaXplJywgJ3JldHJ5X2ludGVydmFsJyxcbiAgICAgICAgJ2Jvc19tdWx0aXBhcnRfcGFyYWxsZWwnLFxuICAgICAgICAnYm9zX211bHRpcGFydF9hdXRvX2NvbnRpbnVlJyxcbiAgICAgICAgJ2Jvc19tdWx0aXBhcnRfbG9jYWxfa2V5X2dlbmVyYXRvcidcbiAgICApO1xuICAgIHJldHVybiBRLmFsbChbXG4gICAgICAgIHRoaXMuX2ludm9rZShldmVudHMua0tleSwgW2ZpbGVdLCB0aHJvd0Vycm9ycyksXG4gICAgICAgIHRoaXMuX2ludm9rZShldmVudHMua09iamVjdE1ldGFzLCBbZmlsZV0pXG4gICAgXSkudGhlbihmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICAgICAgLy8gb3B0aW9ucy5ib3NfYnVja2V0IOWPr+iDveS8muiiqyBrS2V5IOS6i+S7tuWKqOaAgeeahOaUueWPmFxuICAgICAgICB2YXIgYnVja2V0ID0gb3B0aW9ucy5ib3NfYnVja2V0O1xuXG4gICAgICAgIHZhciByZXN1bHQgPSBhcnJheVswXTtcbiAgICAgICAgdmFyIG9iamVjdE1ldGFzID0gYXJyYXlbMV07XG5cbiAgICAgICAgdmFyIG11bHRpcGFydCA9ICdhdXRvJztcbiAgICAgICAgaWYgKHUuaXNTdHJpbmcocmVzdWx0KSkge1xuICAgICAgICAgICAgb2JqZWN0ID0gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHUuaXNPYmplY3QocmVzdWx0KSkge1xuICAgICAgICAgICAgYnVja2V0ID0gcmVzdWx0LmJ1Y2tldCB8fCBidWNrZXQ7XG4gICAgICAgICAgICBvYmplY3QgPSByZXN1bHQua2V5IHx8IG9iamVjdDtcblxuICAgICAgICAgICAgLy8gJ2F1dG8nIC8gJ29mZidcbiAgICAgICAgICAgIG11bHRpcGFydCA9IHJlc3VsdC5tdWx0aXBhcnQgfHwgbXVsdGlwYXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNsaWVudCA9IHNlbGYuY2xpZW50O1xuICAgICAgICB2YXIgZXZlbnREaXNwYXRjaGVyID0gc2VsZjtcbiAgICAgICAgdmFyIHRhc2tPcHRpb25zID0gdS5leHRlbmQoZGVmYXVsdFRhc2tPcHRpb25zLCB7XG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgICAgIG1ldGFzOiBvYmplY3RNZXRhc1xuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgVGFza0NvbnN0cnVjdG9yID0gUHV0T2JqZWN0VGFzaztcbiAgICAgICAgaWYgKG11bHRpcGFydCA9PT0gJ2F1dG8nXG4gICAgICAgICAgICAvLyDlr7nkuo4gbW94aWUuWE1MSHR0cFJlcXVlc3Qg5p2l6K+077yM5peg5rOV6I635Y+WIGdldFJlc3BvbnNlSGVhZGVyKCdFVGFnJylcbiAgICAgICAgICAgIC8vIOWvvOiHtOWcqCBjb21wbGV0ZU11bHRpcGFydFVwbG9hZCDnmoTml7blgJnvvIzml6Dms5XkvKDpgJLmraPnoa7nmoTlj4LmlbBcbiAgICAgICAgICAgIC8vIOWboOatpOmcgOimgeemgeatouS9v+eUqCBtb3hpZS5YTUxIdHRwUmVxdWVzdCDkvb/nlKggTXVsdGlwYXJ0VGFza1xuICAgICAgICAgICAgLy8g6Zmk6Z2e55So6Ieq5bex5pys5Zyw6K6h566X55qEIG1kNSDkvZzkuLogZ2V0UmVzcG9uc2VIZWFkZXIoJ0VUYWcnKSDnmoTku6Pmm7/lgLzvvIzkuI3ov4fov5jmmK/mnInkuIDkupvpl67popjvvJpcbiAgICAgICAgICAgIC8vIDEuIE11bHRpcGFydFRhc2sg6ZyA6KaB5a+55paH5Lu26L+b6KGM5YiG54mH77yM5L2G5piv5L2/55SoIG1veGllLlhNTEh0dHBSZXF1ZXN0IOeahOaXtuWAme+8jOaYjuaYvuacieWNoemhv+eahOmXrumimO+8iOWboOS4uiBGbGFzaCDmiormlbTkuKrmlofku7bpg73or7vlj5bliLDlhoXlrZjkuK3vvIznhLblkI7lho3liIbniYfvvIlcbiAgICAgICAgICAgIC8vICAgIOWvvOiHtOWkhOeQhuWkp+aWh+S7tueahOaXtuWAmeaAp+iDveW+iOW3rlxuICAgICAgICAgICAgLy8gMi4g5pys5Zyw6K6h566XIG1kNSDpnIDopoHpop3lpJblvJXlhaXlupPvvIzlr7zoh7QgYmNlLWJvcy11cGxvYWRlciDnmoTkvZPnp6/lj5jlpKdcbiAgICAgICAgICAgIC8vIOe7vOS4iuaJgOi/sO+8jOWcqOS9v+eUqCBtb3hpZSDnmoTml7blgJnvvIznpoHmraIgTXVsdGlwYXJ0VGFza1xuICAgICAgICAgICAgJiYgc2VsZi5feGhyMlN1cHBvcnRlZFxuICAgICAgICAgICAgJiYgZmlsZS5zaXplID4gb3B0aW9ucy5ib3NfbXVsdGlwYXJ0X21pbl9zaXplKSB7XG4gICAgICAgICAgICBUYXNrQ29uc3RydWN0b3IgPSBNdWx0aXBhcnRUYXNrO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXNrID0gbmV3IFRhc2tDb25zdHJ1Y3RvcihjbGllbnQsIGV2ZW50RGlzcGF0Y2hlciwgdGFza09wdGlvbnMpO1xuXG4gICAgICAgIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF0gPSBmaWxlO1xuXG4gICAgICAgIGZpbGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmaWxlLl9hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0YXNrLmFib3J0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGFzay5zZXROZXR3b3JrSW5mbyhzZWxmLl9uZXR3b3JrSW5mbyk7XG4gICAgICAgIHJldHVybiB0YXNrLnN0YXJ0KCk7XG4gICAgfSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGV2ZW50QXJndW1lbnRzLCB0aHJvd0Vycm9ycykge1xuICAgIGlmIChldmVudE5hbWUgPT09IGV2ZW50cy5rQWJvcnRlZFxuICAgICAgICAmJiBldmVudEFyZ3VtZW50c1xuICAgICAgICAmJiBldmVudEFyZ3VtZW50c1sxXSkge1xuICAgICAgICB2YXIgZmlsZSA9IGV2ZW50QXJndW1lbnRzWzFdO1xuICAgICAgICBpZiAoZmlsZS5zaXplID4gMCkge1xuICAgICAgICAgICAgdmFyIGxvYWRlZFNpemUgPSBmaWxlLl9wcmV2aW91c0xvYWRlZCB8fCAwO1xuICAgICAgICAgICAgdGhpcy5fbmV0d29ya0luZm8udG90YWxCeXRlcyAtPSAoZmlsZS5zaXplIC0gbG9hZGVkU2l6ZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtOZXR3b3JrU3BlZWQsIHRoaXMuX25ldHdvcmtJbmZvLmR1bXAoKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShldmVudE5hbWUsIGV2ZW50QXJndW1lbnRzLCB0aHJvd0Vycm9ycyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSB1dGlscy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHFzTW9kdWxlID0gcmVxdWlyZSg0NSk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBoZWxwZXIgPSByZXF1aXJlKDQyKTtcbnZhciBRdWV1ZSA9IHJlcXVpcmUoMjgpO1xudmFyIE1pbWVUeXBlID0gcmVxdWlyZSgyMSk7XG5cbi8qKlxuICog5oqK5paH5Lu26L+b6KGM5YiH54mH77yM6L+U5Zue5YiH54mH5LmL5ZCO55qE5pWw57uEXG4gKlxuICogQHBhcmFtIHtCbG9ifSBmaWxlIOmcgOimgeWIh+eJh+eahOWkp+aWh+S7ti5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJZCDku47mnI3liqHojrflj5bnmoR1cGxvYWRJZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjaHVua1NpemUg5YiG54mH55qE5aSn5bCPLlxuICogQHBhcmFtIHtzdHJpbmd9IGJ1Y2tldCBCdWNrZXQgTmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmplY3QgT2JqZWN0IE5hbWUuXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuZXhwb3J0cy5nZXRUYXNrcyA9IGZ1bmN0aW9uIChmaWxlLCB1cGxvYWRJZCwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCkge1xuICAgIHZhciBsZWZ0U2l6ZSA9IGZpbGUuc2l6ZTtcbiAgICB2YXIgb2Zmc2V0ID0gMDtcbiAgICB2YXIgcGFydE51bWJlciA9IDE7XG5cbiAgICB2YXIgdGFza3MgPSBbXTtcblxuICAgIHdoaWxlIChsZWZ0U2l6ZSA+IDApIHtcbiAgICAgICAgdmFyIHBhcnRTaXplID0gTWF0aC5taW4obGVmdFNpemUsIGNodW5rU2l6ZSk7XG5cbiAgICAgICAgdGFza3MucHVzaCh7XG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgdXBsb2FkSWQ6IHVwbG9hZElkLFxuICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgICAgIHBhcnROdW1iZXI6IHBhcnROdW1iZXIsXG4gICAgICAgICAgICBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgICAgICBzdGFydDogb2Zmc2V0LFxuICAgICAgICAgICAgc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxlZnRTaXplIC09IHBhcnRTaXplO1xuICAgICAgICBvZmZzZXQgKz0gcGFydFNpemU7XG4gICAgICAgIHBhcnROdW1iZXIgKz0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFza3M7XG59O1xuXG5leHBvcnRzLmdldEFwcGVuZGFibGVUYXNrcyA9IGZ1bmN0aW9uIChmaWxlU2l6ZSwgb2Zmc2V0LCBjaHVua1NpemUpIHtcbiAgICB2YXIgbGVmdFNpemUgPSBmaWxlU2l6ZSAtIG9mZnNldDtcbiAgICB2YXIgdGFza3MgPSBbXTtcblxuICAgIHdoaWxlIChsZWZ0U2l6ZSkge1xuICAgICAgICB2YXIgcGFydFNpemUgPSBNYXRoLm1pbihsZWZ0U2l6ZSwgY2h1bmtTaXplKTtcbiAgICAgICAgdGFza3MucHVzaCh7XG4gICAgICAgICAgICBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgICAgICBzdGFydDogb2Zmc2V0LFxuICAgICAgICAgICAgc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxlZnRTaXplIC09IHBhcnRTaXplO1xuICAgICAgICBvZmZzZXQgKz0gcGFydFNpemU7XG4gICAgfVxuICAgIHJldHVybiB0YXNrcztcbn07XG5cbmV4cG9ydHMucGFyc2VTaXplID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgICBpZiAodHlwZW9mIHNpemUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8vIG1iIE1CIE1iIE1cbiAgICAvLyBrYiBLQiBrYiBrXG4gICAgLy8gMTAwXG4gICAgdmFyIHBhdHRlcm4gPSAvXihbXFxkXFwuXSspKFtta2ddP2I/KSQvaTtcbiAgICB2YXIgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoc2l6ZSk7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgJDEgPSBtYXRjaFsxXTtcbiAgICB2YXIgJDIgPSBtYXRjaFsyXTtcbiAgICBpZiAoL15rL2kudGVzdCgkMikpIHtcbiAgICAgICAgcmV0dXJuICQxICogMTAyNDtcbiAgICB9XG4gICAgZWxzZSBpZiAoL15tL2kudGVzdCgkMikpIHtcbiAgICAgICAgcmV0dXJuICQxICogMTAyNCAqIDEwMjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKC9eZy9pLnRlc3QoJDIpKSB7XG4gICAgICAgIHJldHVybiAkMSAqIDEwMjQgKiAxMDI0ICogMTAyNDtcbiAgICB9XG4gICAgcmV0dXJuICskMTtcbn07XG5cbi8qKlxuICog5Yik5pat5LiA5LiL5rWP6KeI5Zmo5piv5ZCm5pSv5oyBIHhocjIg54m55oCn77yM5aaC5p6c5LiN5pSv5oyB77yM5bCxIGZhbGxiYWNrIOWIsCBQb3N0T2JqZWN0XG4gKiDmnaXkuIrkvKDmlofku7ZcbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnRzLmlzWGhyMlN1cHBvcnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9ibG9iL2Y4MzllMjU3OWRhMmM2MzMxZWFhZDkyMmFlNWNkNjkxYWFjN2FiNjIvZmVhdHVyZS1kZXRlY3RzL25ldHdvcmsveGhyMi5qc1xuICAgIHJldHVybiAnWE1MSHR0cFJlcXVlc3QnIGluIHdpbmRvdyAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbn07XG5cbmV4cG9ydHMuaXNBcHBlbmRhYmxlID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgICByZXR1cm4gaGVhZGVyc1sneC1iY2Utb2JqZWN0LXR5cGUnXSA9PT0gJ0FwcGVuZGFibGUnO1xufTtcblxuZXhwb3J0cy5kZWxheSA9IGZ1bmN0aW9uIChtcykge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIH0sIG1zKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICog6KeE6IyD5YyW55So5oi355qE6L6T5YWlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB3aWxsIGJlIG5vcm1hbGl6ZWRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5ub3JtYWxpemVFbmRwb2ludCA9IGZ1bmN0aW9uIChlbmRwb2ludCkge1xuICAgIHJldHVybiBlbmRwb2ludC5yZXBsYWNlKC8oXFwvKykkLywgJycpO1xufTtcblxuZXhwb3J0cy5nZXREZWZhdWx0QUNMID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFjY2Vzc0NvbnRyb2xMaXN0OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VydmljZTogJ2JjZTpib3MnLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJyonLFxuICAgICAgICAgICAgICAgIGVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogW2J1Y2tldCArICcvKiddLFxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IFsnUkVBRCcsICdXUklURSddXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9O1xufTtcblxuLyoqXG4gKiDnlJ/miJB1dWlkXG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLnV1aWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJhbmRvbSA9IChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMiwgMzIpKS50b1N0cmluZygzNik7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHJldHVybiAndS0nICsgdGltZXN0YW1wICsgJy0nICsgcmFuZG9tO1xufTtcblxuLyoqXG4gKiDnlJ/miJDmnKzlnLAgbG9jYWxTdG9yYWdlIOS4reeahGtlee+8jOadpeWtmOWCqCB1cGxvYWRJZFxuICogbG9jYWxTdG9yYWdlW2tleV0gPSB1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24g5LiA5Lqb5Y+v5Lul55So5p2l6K6h566Xa2V555qE5Y+C5pWwLlxuICogQHBhcmFtIHtzdHJpbmd9IGdlbmVyYXRvciDlhoXnva7nmoTlj6rmnIkgZGVmYXVsdCDlkowgbWQ1XG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnRzLmdlbmVyYXRlTG9jYWxLZXkgPSBmdW5jdGlvbiAob3B0aW9uLCBnZW5lcmF0b3IpIHtcbiAgICBpZiAoZ2VuZXJhdG9yID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZShbXG4gICAgICAgICAgICBvcHRpb24uYmxvYi5uYW1lLCBvcHRpb24uYmxvYi5zaXplLFxuICAgICAgICAgICAgb3B0aW9uLmNodW5rU2l6ZSwgb3B0aW9uLmJ1Y2tldCxcbiAgICAgICAgICAgIG9wdGlvbi5vYmplY3RcbiAgICAgICAgXS5qb2luKCcmJykpO1xuICAgIH1cbiAgICByZXR1cm4gUS5yZXNvbHZlKG51bGwpO1xufTtcblxuZXhwb3J0cy5nZXREZWZhdWx0UG9saWN5ID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIGlmIChidWNrZXQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAvLyDpu5jorqTmmK8gMjTlsI/ml7Yg5LmL5ZCO5Yiw5pyfXG4gICAgdmFyIGV4cGlyYXRpb24gPSBuZXcgRGF0ZShub3cgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICB2YXIgdXRjRGF0ZVRpbWUgPSBoZWxwZXIudG9VVENTdHJpbmcoZXhwaXJhdGlvbik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBleHBpcmF0aW9uOiB1dGNEYXRlVGltZSxcbiAgICAgICAgY29uZGl0aW9uczogW1xuICAgICAgICAgICAge2J1Y2tldDogYnVja2V0fVxuICAgICAgICBdXG4gICAgfTtcbn07XG5cbi8qKlxuICog5qC55o2ua2V56I635Y+WbG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmdldFVwbG9hZElkID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xufTtcblxuXG4vKipcbiAqIOagueaNrmtleeiuvue9rmxvY2FsU3RvcmFnZeS4reeahHVwbG9hZElkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSDpnIDopoHmn6Xor6LnmoRrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJZCDpnIDopoHorr7nva7nmoR1cGxvYWRJZFxuICovXG5leHBvcnRzLnNldFVwbG9hZElkID0gZnVuY3Rpb24gKGtleSwgdXBsb2FkSWQpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHVwbG9hZElkKTtcbn07XG5cbi8qKlxuICog5qC55o2ua2V55Yig6ZmkbG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICovXG5leHBvcnRzLnJlbW92ZVVwbG9hZElkID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG59O1xuXG4vKipcbiAqIOWPluW+l+W3suS4iuS8oOWIhuWdl+eahGV0YWdcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcGFydE51bWJlciDliIbniYfluo/lj7cuXG4gKiBAcGFyYW0ge0FycmF5fSBleGlzdFBhcnRzIOW3suS4iuS8oOWujOaIkOeahOWIhueJh+S/oeaBry5cbiAqIEByZXR1cm4ge3N0cmluZ30g5oyH5a6a5YiG54mH55qEZXRhZ1xuICovXG5mdW5jdGlvbiBnZXRQYXJ0RXRhZyhwYXJ0TnVtYmVyLCBleGlzdFBhcnRzKSB7XG4gICAgdmFyIG1hdGNoUGFydHMgPSB1LmZpbHRlcihleGlzdFBhcnRzIHx8IFtdLCBmdW5jdGlvbiAocGFydCkge1xuICAgICAgICByZXR1cm4gK3BhcnQucGFydE51bWJlciA9PT0gcGFydE51bWJlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gbWF0Y2hQYXJ0cy5sZW5ndGggPyBtYXRjaFBhcnRzWzBdLmVUYWcgOiBudWxsO1xufVxuXG4vKipcbiAqIOWboOS4uiBsaXN0UGFydHMg5Lya6L+U5ZueIHBhcnROdW1iZXIg5ZKMIGV0YWcg55qE5a+55bqU5YWz57O7XG4gKiDmiYDku6UgbGlzdFBhcnRzIOi/lOWbnueahOe7k+aenO+8jOe7mSB0YXNrcyDkuK3lkIjpgILnmoTlhYPntKDorr7nva4gZXRhZyDlsZ7mgKfvvIzkuIrkvKBcbiAqIOeahOaXtuWAmeWwseWPr+S7pei3s+i/h+i/meS6myBwYXJ0XG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gdGFza3Mg5pys5Zyw5YiH5YiG5aW955qE5Lu75YqhLlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gcGFydHMg5pyN5Yqh56uv6L+U5Zue55qE5bey57uP5LiK5Lyg55qEcGFydHMuXG4gKi9cbmV4cG9ydHMuZmlsdGVyVGFza3MgPSBmdW5jdGlvbiAodGFza3MsIHBhcnRzKSB7XG4gICAgdS5lYWNoKHRhc2tzLCBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgcGFydE51bWJlciA9IHRhc2sucGFydE51bWJlcjtcbiAgICAgICAgdmFyIGV0YWcgPSBnZXRQYXJ0RXRhZyhwYXJ0TnVtYmVyLCBwYXJ0cyk7XG4gICAgICAgIGlmIChldGFnKSB7XG4gICAgICAgICAgICB0YXNrLmV0YWcgPSBldGFnO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIOaKiueUqOaIt+i+k+WFpeeahOmFjee9rui9rOWMluaIkCBodG1sNSDlkowgZmxhc2gg5Y+v5Lul5o6l5pS255qE5YaF5a65LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fSBhY2NlcHQg5pSv5oyB5pWw57uE5ZKM5a2X56ym5Liy55qE6YWN572uXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZXhwYW5kQWNjZXB0ID0gZnVuY3Rpb24gKGFjY2VwdCkge1xuICAgIHZhciBleHRzID0gW107XG5cbiAgICBpZiAodS5pc0FycmF5KGFjY2VwdCkpIHtcbiAgICAgICAgLy8gRmxhc2jopoHmsYLnmoTmoLzlvI9cbiAgICAgICAgdS5lYWNoKGFjY2VwdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpdGVtLmV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBleHRzLnB1c2guYXBwbHkoZXh0cywgaXRlbS5leHRlbnNpb25zLnNwbGl0KCcsJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodS5pc1N0cmluZyhhY2NlcHQpKSB7XG4gICAgICAgIGV4dHMgPSBhY2NlcHQuc3BsaXQoJywnKTtcbiAgICB9XG5cbiAgICAvLyDkuLrkuobkv53or4HlhbzlrrnmgKfvvIzmioogbWltZVR5cGVzIOWSjCBleHRzIOmDvei/lOWbnuWbnuWOu1xuICAgIGV4dHMgPSB1Lm1hcChleHRzLCBmdW5jdGlvbiAoZXh0KSB7XG4gICAgICAgIHJldHVybiAvXlxcLi8udGVzdChleHQpID8gZXh0IDogKCcuJyArIGV4dCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZXh0cy5qb2luKCcsJyk7XG59O1xuXG5leHBvcnRzLmV4dFRvTWltZVR5cGUgPSBmdW5jdGlvbiAoZXh0cykge1xuICAgIHZhciBtaW1lVHlwZXMgPSB1Lm1hcChleHRzLnNwbGl0KCcsJyksIGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgaWYgKGV4dC5pbmRleE9mKCcvJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNaW1lVHlwZS5ndWVzcyhleHQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1pbWVUeXBlcy5qb2luKCcsJyk7XG59O1xuXG5leHBvcnRzLmV4cGFuZEFjY2VwdFRvQXJyYXkgPSBmdW5jdGlvbiAoYWNjZXB0KSB7XG4gICAgaWYgKCFhY2NlcHQgfHwgdS5pc0FycmF5KGFjY2VwdCkpIHtcbiAgICAgICAgcmV0dXJuIGFjY2VwdDtcbiAgICB9XG5cbiAgICBpZiAodS5pc1N0cmluZyhhY2NlcHQpKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7dGl0bGU6ICdBbGwgZmlsZXMnLCBleHRlbnNpb25zOiBhY2NlcHR9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xufTtcblxuLyoqXG4gKiDovazljJbkuIDkuIsgYm9zIHVybCDnmoTmoLzlvI9cbiAqIGh0dHA6Ly9iai5iY2Vib3MuY29tL3YxLyR7YnVja2V0fS8ke29iamVjdH0gLT4gaHR0cDovLyR7YnVja2V0fS5iai5iY2Vib3MuY29tL3YxLyR7b2JqZWN0fVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwg6ZyA6KaB6L2s5YyW55qEVVJMLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLnRyYW5zZm9ybVVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICB2YXIgcGF0dGVybiA9IC8oaHR0cHM/OilcXC9cXC8oW15cXC9dKylcXC8oW15cXC9dKylcXC8oW15cXC9dKykvO1xuICAgIHJldHVybiB1cmwucmVwbGFjZShwYXR0ZXJuLCBmdW5jdGlvbiAoXywgcHJvdG9jb2wsIGhvc3QsICQzLCAkNCkge1xuICAgICAgICBpZiAoL152XFxkJC8udGVzdCgkMykpIHtcbiAgICAgICAgICAgIC8vIC92MS8ke2J1Y2tldH0vLi4uXG4gICAgICAgICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgJDQgKyAnLicgKyBob3N0ICsgJy8nICsgJDM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gLyR7YnVja2V0fS8uLi5cbiAgICAgICAgcmV0dXJuIHByb3RvY29sICsgJy8vJyArICQzICsgJy4nICsgaG9zdCArICcvJyArICQ0O1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5pc0Jsb2IgPSBmdW5jdGlvbiAoYm9keSkge1xuICAgIHZhciBibG9iQ3RvciA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIENocm9tZSBCbG9iID09PSAnZnVuY3Rpb24nXG4gICAgICAgIC8vIFNhZmFyaSBCbG9iID09PSAndW5kZWZpbmVkJ1xuICAgICAgICBibG9iQ3RvciA9IEJsb2I7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtT3hpZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdS5pc0Z1bmN0aW9uKG1PeGllLkJsb2IpKSB7XG4gICAgICAgIGJsb2JDdG9yID0gbU94aWUuQmxvYjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keSBpbnN0YW5jZW9mIGJsb2JDdG9yO1xufTtcblxuZXhwb3J0cy5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxuZXhwb3J0cy50b0RITVMgPSBmdW5jdGlvbiAoc2Vjb25kcykge1xuICAgIHZhciBkYXlzID0gMDtcbiAgICB2YXIgaG91cnMgPSAwO1xuICAgIHZhciBtaW51dGVzID0gMDtcblxuICAgIGlmIChzZWNvbmRzID49IDYwKSB7XG4gICAgICAgIG1pbnV0ZXMgPSB+fihzZWNvbmRzIC8gNjApO1xuICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyAtIG1pbnV0ZXMgKiA2MDtcbiAgICB9XG5cbiAgICBpZiAobWludXRlcyA+PSA2MCkge1xuICAgICAgICBob3VycyA9IH5+KG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIG1pbnV0ZXMgPSBtaW51dGVzIC0gaG91cnMgKiA2MDtcbiAgICB9XG5cbiAgICBpZiAoaG91cnMgPj0gMjQpIHtcbiAgICAgICAgZGF5cyA9IH5+KGhvdXJzIC8gMjQpO1xuICAgICAgICBob3VycyA9IGhvdXJzIC0gZGF5cyAqIDI0O1xuICAgIH1cblxuICAgIHJldHVybiB7REQ6IGRheXMsIEhIOiBob3VycywgTU06IG1pbnV0ZXMsIFNTOiBzZWNvbmRzfTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlSG9zdCh1cmwpIHtcbiAgICB2YXIgbWF0Y2ggPSAvXlxcdys6XFwvXFwvKFteXFwvXSspLy5leGVjKHVybCk7XG4gICAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdO1xufVxuXG5leHBvcnRzLmZpeFhociA9IGZ1bmN0aW9uIChvcHRpb25zLCBpc0Jvcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MsIGNvbmZpZykge1xuICAgICAgICB2YXIgY2xpZW50ID0gdGhpcztcbiAgICAgICAgdmFyIGVuZHBvaW50SG9zdCA9IHBhcnNlSG9zdChjb25maWcuZW5kcG9pbnQpO1xuXG4gICAgICAgIC8vIHgtYmNlLWRhdGUg5ZKMIERhdGUg5LqM6YCJ5LiA77yM5piv5b+F6aG755qEXG4gICAgICAgIC8vIOS9huaYryBGbGFzaCDml6Dms5Xorr7nva4gRGF0Ze+8jOWboOatpOW/hemhu+iuvue9riB4LWJjZS1kYXRlXG4gICAgICAgIGFyZ3MuaGVhZGVyc1sneC1iY2UtZGF0ZSddID0gaGVscGVyLnRvVVRDU3RyaW5nKG5ldyBEYXRlKCkpO1xuICAgICAgICBhcmdzLmhlYWRlcnMuaG9zdCA9IGVuZHBvaW50SG9zdDtcblxuICAgICAgICAvLyBGbGFzaCDnmoTnvJPlrZjosozkvLzmr5TovoPljonlrrPvvIzlvLrliLbor7fmsYLmlrDnmoRcbiAgICAgICAgLy8gWFhYIOWlveWDj+acjeWKoeWZqOerr+S4jeS8muaKiiAuc3RhbXAg6L+Z5Liq5Y+C5pWw5Yqg5YWl5Yiw562+5ZCN55qE6K6h566X6YC76L6R6YeM6Z2i5Y67XG4gICAgICAgIGFyZ3MucGFyYW1zWycuc3RhbXAnXSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICAgIC8vIOWPquaciSBQVVQg5omN5Lya6Kem5Y+RIHByb2dyZXNzIOS6i+S7tlxuICAgICAgICB2YXIgb3JpZ2luYWxIdHRwTWV0aG9kID0gaHR0cE1ldGhvZDtcblxuICAgICAgICBpZiAoaHR0cE1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgICAgICAgIC8vIFB1dE9iamVjdCBQdXRQYXJ0cyDpg73lj6/ku6XnlKggUE9TVCDljY/orq7vvIzogIzkuJQgRmxhc2gg5Lmf5Y+q6IO955SoIFBPU1Qg5Y2P6K6uXG4gICAgICAgICAgICBodHRwTWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHhoclVyaTtcbiAgICAgICAgdmFyIHhock1ldGhvZCA9IGh0dHBNZXRob2Q7XG4gICAgICAgIHZhciB4aHJCb2R5ID0gYXJncy5ib2R5O1xuICAgICAgICBpZiAoaHR0cE1ldGhvZCA9PT0gJ0hFQUQnKSB7XG4gICAgICAgICAgICAvLyDlm6DkuLogRmxhc2gg55qEIFVSTFJlcXVlc3Qg5Y+q6IO95Y+R6YCBIEdFVCDlkowgUE9TVCDor7fmsYJcbiAgICAgICAgICAgIC8vIGdldE9iamVjdE1ldGHpnIDopoHnlKhIRUFE6K+35rGC77yM5L2G5pivIEZsYXNoIOaXoOazleWPkei1t+i/meenjeivt+axglxuICAgICAgICAgICAgLy8g5omA6ZyA6ZyA6KaB55SoIHJlbGF5IOS4rei9rOS4gOS4i1xuICAgICAgICAgICAgLy8gWFhYIOWboOS4uiBidWNrZXQg5LiN5Y+v6IO95pivIHByaXZhdGXvvIzlkKbliJkgY3Jvc3Nkb21haW4ueG1sIOaYr+aXoOazleivu+WPlueahFxuICAgICAgICAgICAgLy8g5omA5Lul6L+Z5Liq5o6l5Y+j6K+35rGC55qE5pe25YCZ77yM5Y+v5Lul5LiN6ZyA6KaBIGF1dGhvcml6YXRpb24g5a2X5q61XG4gICAgICAgICAgICB2YXIgcmVsYXlTZXJ2ZXIgPSBleHBvcnRzLm5vcm1hbGl6ZUVuZHBvaW50KG9wdGlvbnMuYm9zX3JlbGF5X3NlcnZlcik7XG4gICAgICAgICAgICB4aHJVcmkgPSByZWxheVNlcnZlciArICcvJyArIGVuZHBvaW50SG9zdCArIHJlc291cmNlO1xuXG4gICAgICAgICAgICBhcmdzLnBhcmFtcy5odHRwTWV0aG9kID0gaHR0cE1ldGhvZDtcblxuICAgICAgICAgICAgeGhyTWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzQm9zID09PSB0cnVlKSB7XG4gICAgICAgICAgICB4aHJVcmkgPSBleHBvcnRzLnRyYW5zZm9ybVVybChjb25maWcuZW5kcG9pbnQgKyByZXNvdXJjZSk7XG4gICAgICAgICAgICByZXNvdXJjZSA9IHhoclVyaS5yZXBsYWNlKC9eXFx3KzpcXC9cXC9bXlxcL10rXFwvLywgJy8nKTtcbiAgICAgICAgICAgIGFyZ3MuaGVhZGVycy5ob3N0ID0gcGFyc2VIb3N0KHhoclVyaSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4aHJVcmkgPSBjb25maWcuZW5kcG9pbnQgKyByZXNvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh4aHJNZXRob2QgPT09ICdQT1NUJyAmJiAheGhyQm9keSkge1xuICAgICAgICAgICAgLy8g5b+F6aG76KaB5pyJIEJPRFkg5omN6IO95pivIFBPU1TvvIzlkKbliJnkvaDorr7nva7kuobkuZ/msqHmnIlcbiAgICAgICAgICAgIC8vIOiAjOS4lOW/hemhu+aYryBQT1NUIOaJjeWPr+S7peiuvue9ruiHquWumuS5ieeahGhlYWRlcu+8jEdFVOS4jeihjFxuICAgICAgICAgICAgeGhyQm9keSA9ICd7XCJGT1JDRV9QT1NUXCI6IHRydWV9JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgICAgICB2YXIgeGhyID0gbmV3IG1PeGllLlhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UgfHwgJ3t9Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIGlmIChodHRwTWV0aG9kID09PSAnSEVBRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfY29kZTogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzcG9uc2UubWVzc2FnZSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogcmVzcG9uc2UuY29kZSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdF9pZDogcmVzcG9uc2UucmVxdWVzdElkIHx8ICcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FKOWIhueJh+S4iuS8oOeahOmAu+i+keWSjHh4eOeahOmAu+i+keS4jeS4gOagtylcbiAgICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsSHR0cE1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUE9TVCwgSEVBRCwgR0VUIOS5i+exu+eahOS4jemcgOimgeinpuWPkSBwcm9ncmVzcyDkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgLy8g5ZCm5YiZ5a+86Ie06aG16Z2i55qE6YC76L6R5re35LmxXG4gICAgICAgICAgICAgICAgICAgIGUubGVuZ3RoQ29tcHV0YWJsZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGh0dHBDb250ZXh0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cE1ldGhvZDogb3JpZ2luYWxIdHRwTWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHJlc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyOiB4aHJcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW1pdCgncHJvZ3Jlc3MnLCBlLCBodHRwQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9taXNlID0gY2xpZW50LmNyZWF0ZVNpZ25hdHVyZShjbGllbnQuY29uZmlnLmNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MucGFyYW1zLCBhcmdzLmhlYWRlcnMpO1xuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIHhiY2VEYXRlKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgICAgIGFyZ3MuaGVhZGVycy5hdXRob3JpemF0aW9uID0gYXV0aG9yaXphdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgYXJncy5oZWFkZXJzWyd4LWJjZS1kYXRlJ10gPSB4YmNlRGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHFzID0gcXNNb2R1bGUuc3RyaW5naWZ5KGFyZ3MucGFyYW1zKTtcbiAgICAgICAgICAgIGlmIChxcykge1xuICAgICAgICAgICAgICAgIHhoclVyaSArPSAnPycgKyBxcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLm9wZW4oeGhyTWV0aG9kLCB4aHJVcmksIHRydWUpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhcmdzLmhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgICAgICAgICB8fCAvKGhvc3R8Y29udGVudFxcLWxlbmd0aCkvaS50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3MuaGVhZGVyc1trZXldO1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIuc2VuZCh4aHJCb2R5LCB7XG4gICAgICAgICAgICAgICAgcnVudGltZV9vcmRlcjogJ2ZsYXNoJyxcbiAgICAgICAgICAgICAgICBzd2ZfdXJsOiBvcHRpb25zLmZsYXNoX3N3Zl91cmxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59O1xuXG5cbmV4cG9ydHMuZWFjaExpbWl0ID0gZnVuY3Rpb24gKHRhc2tzLCB0YXNrUGFyYWxsZWwsIGV4ZWN1dGVyLCBkb25lKSB7XG4gICAgdmFyIHJ1bm5pbmdDb3VudCA9IDA7XG4gICAgdmFyIGFib3J0ZWQgPSBmYWxzZTtcbiAgICB2YXIgZmluID0gZmFsc2U7ICAgICAgLy8gZG9uZSDlj6rog73ooqvosIPnlKjkuIDmrKEuXG4gICAgdmFyIHF1ZXVlID0gbmV3IFF1ZXVlKHRhc2tzKTtcblxuICAgIGZ1bmN0aW9uIGluZmluaXRlTG9vcCgpIHtcbiAgICAgICAgdmFyIHRhc2sgPSBxdWV1ZS5kZXF1ZXVlKCk7XG4gICAgICAgIGlmICghdGFzaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcnVubmluZ0NvdW50Kys7XG4gICAgICAgIGV4ZWN1dGVyKHRhc2ssIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgcnVubmluZ0NvdW50LS07XG5cbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIOS4gOaXpuacieaKpemUme+8jOe7iOatoui/kOihjFxuICAgICAgICAgICAgICAgIGFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZG9uZShlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXF1ZXVlLmlzRW1wdHkoKSAmJiAhYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDpmJ/liJfov5jmnInlhoXlrrlcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChpbmZpbml0ZUxvb3AsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChydW5uaW5nQ291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDpmJ/liJfnqbrkuobvvIzogIzkuJTmsqHmnInov5DooYzkuK3nmoTku7vliqHkuoZcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRhc2tQYXJhbGxlbCA9IE1hdGgubWluKHRhc2tQYXJhbGxlbCwgcXVldWUuc2l6ZSgpKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhc2tQYXJhbGxlbDsgaSsrKSB7XG4gICAgICAgIGluZmluaXRlTG9vcCgpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuaW5oZXJpdHMgPSBmdW5jdGlvbiAoQ2hpbGRDdG9yLCBQYXJlbnRDdG9yKSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoNDcpLmluaGVyaXRzKENoaWxkQ3RvciwgUGFyZW50Q3Rvcik7XG59O1xuXG5leHBvcnRzLmd1ZXNzQ29udGVudFR5cGUgPSBmdW5jdGlvbiAoZmlsZSwgb3B0X2lnbm9yZUNoYXJzZXQpIHtcbiAgICB2YXIgY29udGVudFR5cGUgPSBmaWxlLnR5cGU7XG4gICAgaWYgKCFjb250ZW50VHlwZSkge1xuICAgICAgICB2YXIgb2JqZWN0ID0gZmlsZS5uYW1lO1xuICAgICAgICB2YXIgZXh0ID0gb2JqZWN0LnNwbGl0KC9cXC4vZykucG9wKCk7XG4gICAgICAgIGNvbnRlbnRUeXBlID0gTWltZVR5cGUuZ3Vlc3MoZXh0KTtcbiAgICB9XG5cbiAgICAvLyBGaXJlZm945ZyoUE9TVOeahOaXtuWAme+8jENvbnRlbnQtVHlwZSDkuIDlrprkvJrmnIlDaGFyc2V055qE77yM5Zug5q2kXG4gICAgLy8g6L+Z6YeM5LiN566hMzcyMe+8jOmDveWKoOS4ii5cbiAgICBpZiAoIW9wdF9pZ25vcmVDaGFyc2V0ICYmICEvY2hhcnNldD0vLnRlc3QoY29udGVudFR5cGUpKSB7XG4gICAgICAgIGNvbnRlbnRUeXBlICs9ICc7IGNoYXJzZXQ9VVRGLTgnO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZW50VHlwZTtcbn07XG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9CdWZmZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qKlxuICogQnVmZmVyXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlcigpIHtcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTUxNTg2OS9zdHJpbmctbGVuZ3RoLWluLWJ5dGVzLWluLWphdmFzY3JpcHRcbiAgICB2YXIgbSA9IGVuY29kZVVSSUNvbXBvbmVudChkYXRhKS5tYXRjaCgvJVs4OUFCYWJdL2cpO1xuICAgIHJldHVybiBkYXRhLmxlbmd0aCArIChtID8gbS5sZW5ndGggOiAwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnVmZmVyO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIFByb21pc2UuanNcbiAqIEBhdXRob3IgPz9cbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QpIHtcblxuICAgIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gICAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gICAgdmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG5vb3AoKSB7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgZm9yIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXG4gICAgZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9taXNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZXhlY3V0b3IuXG4gICAgICogQGNsYXNzXG4gICAgICovXG4gICAgZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdGF0ZSA9IDA7XG4gICAgICAgIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG4gICAgICAgIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gICAgICAgIHdoaWxlIChzZWxmLl9zdGF0ZSA9PT0gMykge1xuICAgICAgICAgICAgc2VsZiA9IHNlbGYuX3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuICAgICAgICAgICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5faGFuZGxlZCA9IHRydWU7XG4gICAgICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjYiA9IHNlbGYuX3N0YXRlID09PSAxID8gZGVmZXJyZWQub25GdWxmaWxsZWQgOiBkZWZlcnJlZC5vblJlamVjdGVkO1xuICAgICAgICAgICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgKHNlbGYuX3N0YXRlID09PSAxID8gcmVzb2x2ZSA6IHJlamVjdCkoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJldDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICYmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhlbiA9IG5ld1ZhbHVlLnRoZW47XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9zdGF0ZSA9IDM7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBkb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3Qoc2VsZiwgZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAyO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluYWxlKHNlbGYpIHtcbiAgICAgICAgaWYgKHNlbGYuX3N0YXRlID09PSAyICYmIHNlbGYuX2RlZmVycmVkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuX2hhbmRsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXJcbiAgICAgKlxuICAgICAqIEBjbGFzc1xuICAgICAqIEBwYXJhbSB7Kn0gb25GdWxmaWxsZWQgVGhlIG9uRnVsZmlsbGVkLlxuICAgICAqIEBwYXJhbSB7Kn0gb25SZWplY3RlZCBUaGUgb25SZWplY3RlZC5cbiAgICAgKiBAcGFyYW0geyp9IHByb21pc2UgVGhlIHByb21pc2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSkge1xuICAgICAgICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICAgICAgICB0aGlzLm9uUmVqZWN0ZWQgPSB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICAgICAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRha2UgYSBwb3RlbnRpYWxseSBtaXNiZWhhdmluZyByZXNvbHZlciBmdW5jdGlvbiBhbmQgbWFrZSBzdXJlXG4gICAgICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gICAgICpcbiAgICAgKiBNYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IGFzeW5jaHJvbnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZm4uXG4gICAgICogQHBhcmFtIHsqfSBzZWxmIFRoZSBjb250ZXh0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvUmVzb2x2ZShmbiwgc2VsZikge1xuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZiwgdmFsdWUpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZWplY3Qoc2VsZiwgcmVhc29uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFByb21pc2UucHJvdG90eXBlW1wiY2F0Y2hcIl0gPSBmdW5jdGlvbiAob25SZWplY3RlZCkgeyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkgeyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgdmFyIHByb20gPSBuZXcgKHRoaXMuY29uc3RydWN0b3IpKG5vb3ApO1xuXG4gICAgICAgIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICAgICAgICByZXR1cm4gcHJvbTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5hbGwgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlcyhpLCB2YWwpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZW4gPSB2YWwudGhlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWwsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICByZWplY3QodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhbHVlc1tpXS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBVc2UgcG9seWZpbGwgZm9yIHNldEltbWVkaWF0ZSBmb3IgcGVyZm9ybWFuY2UgZ2FpbnNcbiAgICBQcm9taXNlLl9pbW1lZGlhdGVGbiA9ICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmIGZ1bmN0aW9uIChmbikge1xuICAgICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICAgIH0pIHx8IGZ1bmN0aW9uIChmbikge1xuICAgICAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gICAgfTtcblxuICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3VuaGFuZGxlZFJlamVjdGlvbkZuKGVycikge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBpbW1lZGlhdGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBjYWxsYmFja3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIFByb21pc2UuX3NldEltbWVkaWF0ZUZuID0gZnVuY3Rpb24gX3NldEltbWVkaWF0ZUZuKGZuKSB7XG4gICAgICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuID0gZm47XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiB1bmhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBleGVjdXRlIG9uIHVuaGFuZGxlZCByZWplY3Rpb25cbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIFByb21pc2UuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuKGZuKSB7XG4gICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZm47XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFyb290LlByb21pc2UpIHtcbiAgICAgICAgcm9vdC5Qcm9taXNlID0gUHJvbWlzZTtcbiAgICB9XG5cbn0pKHRoaXMpO1xuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvYXN5bmMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbmV4cG9ydHMubWFwTGltaXQgPSByZXF1aXJlKDIpO1xuIiwiLyoqXG4gKiBAZmlsZSBjb3JlLmpzXG4gKiBAYXV0aG9yID8/P1xuICovXG5cbi8qKlxuICogTG9jYWwgcG9seWZpbCBvZiBPYmplY3QuY3JlYXRlXG4gKi9cbnZhciBjcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRigpIHsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBzdWJ0eXBlO1xuXG4gICAgICAgIEYucHJvdG90eXBlID0gb2JqO1xuXG4gICAgICAgIHN1YnR5cGUgPSBuZXcgRigpO1xuXG4gICAgICAgIEYucHJvdG90eXBlID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gc3VidHlwZTtcbiAgICB9O1xufSgpKTtcblxuLyoqXG4gKiBDcnlwdG9KUyBuYW1lc3BhY2UuXG4gKi9cbnZhciBDID0ge307XG5cbi8qKlxuICogQWxnb3JpdGhtIG5hbWVzcGFjZS5cbiAqL1xudmFyIENfYWxnbyA9IEMuYWxnbyA9IHt9O1xuXG4vKipcbiAqIExpYnJhcnkgbmFtZXNwYWNlLlxuICovXG52YXIgQ19saWIgPSBDLmxpYiA9IHt9O1xuXG4vKipcbiAgKiBCYXNlIG9iamVjdCBmb3IgcHJvdG90eXBhbCBpbmhlcml0YW5jZS5cbiAgKi9cbnZhciBCYXNlID0gQ19saWIuQmFzZSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvdmVycmlkZXMgUHJvcGVydGllcyB0byBjb3B5IGludG8gdGhlIG5ldyBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAgKlxuICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgdmFyIE15VHlwZSA9IENyeXB0b0pTLmxpYi5CYXNlLmV4dGVuZCh7XG4gICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnLFxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICAgICAgbWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgKiAgICAgICAgIH1cbiAgICAgICAgICAqICAgICB9KTtcbiAgICAgICAgICAqL1xuICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uIChvdmVycmlkZXMpIHtcbiAgICAgICAgICAgIC8vIFNwYXduXG4gICAgICAgICAgICB2YXIgc3VidHlwZSA9IGNyZWF0ZSh0aGlzKTtcblxuICAgICAgICAgICAgLy8gQXVnbWVudFxuICAgICAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuICAgICAgICAgICAgICAgIHN1YnR5cGUubWl4SW4ob3ZlcnJpZGVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGRlZmF1bHQgaW5pdGlhbGl6ZXJcbiAgICAgICAgICAgIGlmICghc3VidHlwZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdCcpIHx8IHRoaXMuaW5pdCA9PT0gc3VidHlwZS5pbml0KSB7XG4gICAgICAgICAgICAgICAgc3VidHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLiRzdXBlci5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZXIncyBwcm90b3R5cGUgaXMgdGhlIHN1YnR5cGUgb2JqZWN0XG4gICAgICAgICAgICBzdWJ0eXBlLmluaXQucHJvdG90eXBlID0gc3VidHlwZTtcblxuICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHN1cGVydHlwZVxuICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICAqIEV4dGVuZHMgdGhpcyBvYmplY3QgYW5kIHJ1bnMgdGhlIGluaXQgbWV0aG9kLlxuICAgICAgICAgICogQXJndW1lbnRzIHRvIGNyZWF0ZSgpIHdpbGwgYmUgcGFzc2VkIHRvIGluaXQoKS5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICB2YXIgaW5zdGFuY2UgPSBNeVR5cGUuY3JlYXRlKCk7XG4gICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmV4dGVuZCgpO1xuICAgICAgICAgICAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIG9iamVjdC5cbiAgICAgICAgICAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGFkZCBzb21lIGxvZ2ljIHdoZW4geW91ciBvYmplY3RzIGFyZSBjcmVhdGVkLlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgIHZhciBNeVR5cGUgPSBDcnlwdG9KUy5saWIuQmFzZS5leHRlbmQoe1xuICAgICAgICAgICogICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgKiAgICAgICAgICAgICAvLyAuLi5cbiAgICAgICAgICAqICAgICAgICAgfVxuICAgICAgICAgICogICAgIH0pO1xuICAgICAgICAgICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogQ29waWVzIHByb3BlcnRpZXMgaW50byB0aGlzIG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllcyBUaGUgcHJvcGVydGllcyB0byBtaXggaW4uXG4gICAgICAgICAgKlxuICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgTXlUeXBlLm1peEluKHtcbiAgICAgICAgICAqICAgICAgICAgZmllbGQ6ICd2YWx1ZSdcbiAgICAgICAgICAqICAgICB9KTtcbiAgICAgICAgICAqL1xuICAgICAgICBtaXhJbjogZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElFIHdvbid0IGNvcHkgdG9TdHJpbmcgdXNpbmcgdGhlIGxvb3AgYWJvdmVcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b1N0cmluZyA9IHByb3BlcnRpZXMudG9TdHJpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNsb25lLlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgIHZhciBjbG9uZSA9IGluc3RhbmNlLmNsb25lKCk7XG4gICAgICAgICAgKi9cbiAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluaXQucHJvdG90eXBlLmV4dGVuZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG59KCkpO1xuXG4vKipcbiAgKiBBbiBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG4gICpcbiAgKiBAcHJvcGVydHkge0FycmF5fSB3b3JkcyBUaGUgYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaWdCeXRlcyBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoaXMgd29yZCBhcnJheS5cbiAgKi9cbnZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXkgPSBCYXNlLmV4dGVuZCh7XG5cbiAgICAvKipcbiAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7QXJyYXl9IHdvcmRzIChPcHRpb25hbCkgQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2lnQnl0ZXMgKE9wdGlvbmFsKSBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoZSB3b3Jkcy5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZSgpO1xuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKFsweDAwMDEwMjAzLCAweDA0MDUwNjA3XSk7XG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddLCA2KTtcbiAgICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKHdvcmRzLCBzaWdCeXRlcykge1xuICAgICAgICB3b3JkcyA9IHRoaXMud29yZHMgPSB3b3JkcyB8fCBbXTtcblxuICAgICAgICBpZiAoc2lnQnl0ZXMgIT0gdW5kZWZpbmVkKSB7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSBzaWdCeXRlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSB3b3Jkcy5sZW5ndGggKiA0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyB0aGlzIHdvcmQgYXJyYXkgdG8gYSBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7RW5jb2Rlcn0gZW5jb2RlciAoT3B0aW9uYWwpIFRoZSBlbmNvZGluZyBzdHJhdGVneSB0byB1c2UuIERlZmF1bHQ6IENyeXB0b0pTLmVuYy5IZXhcbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgc3RyaW5naWZpZWQgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkgKyAnJztcbiAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkudG9TdHJpbmcoKTtcbiAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkudG9TdHJpbmcoQ3J5cHRvSlMuZW5jLlV0ZjgpO1xuICAgICAgKi9cbiAgICB0b1N0cmluZzogZnVuY3Rpb24gKGVuY29kZXIpIHtcbiAgICAgICAgcmV0dXJuIChlbmNvZGVyIHx8IEhleCkuc3RyaW5naWZ5KHRoaXMpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb25jYXRlbmF0ZXMgYSB3b3JkIGFycmF5IHRvIHRoaXMgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheSB0byBhcHBlbmQuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhpcyB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgd29yZEFycmF5MS5jb25jYXQod29yZEFycmF5Mik7XG4gICAgICAqL1xuICAgIGNvbmNhdDogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIHRoaXNXb3JkcyA9IHRoaXMud29yZHM7XG4gICAgICAgIHZhciB0aGF0V29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG4gICAgICAgIHZhciB0aGlzU2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuICAgICAgICB2YXIgdGhhdFNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG4gICAgICAgIHRoaXMuY2xhbXAoKTtcblxuXG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIC8vIENvbmNhdFxuICAgICAgICBpZiAodGhpc1NpZ0J5dGVzICUgNCkge1xuICAgICAgICAgICAgLy8gQ29weSBvbmUgYnl0ZSBhdCBhIHRpbWVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0Qnl0ZSA9ICh0aGF0V29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdIHw9IHRoYXRCeXRlIDw8ICgyNCAtICgodGhpc1NpZ0J5dGVzICsgaSkgJSA0KSAqIDgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29weSBvbmUgd29yZCBhdCBhIHRpbWVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkgKz0gNCkge1xuICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdID0gdGhhdFdvcmRzW2kgPj4+IDJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2lnQnl0ZXMgKz0gdGhhdFNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENoYWluYWJsZVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIFJlbW92ZXMgaW5zaWduaWZpY2FudCBiaXRzLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgd29yZEFycmF5LmNsYW1wKCk7XG4gICAgICAqL1xuICAgIGNsYW1wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgd29yZHMgPSB0aGlzLndvcmRzO1xuICAgICAgICB2YXIgc2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENsYW1wXG4gICAgICAgIHdvcmRzW3NpZ0J5dGVzID4+PiAyXSAmPSAweGZmZmZmZmZmIDw8ICgzMiAtIChzaWdCeXRlcyAlIDQpICogOCk7XG4gICAgICAgIHdvcmRzLmxlbmd0aCA9IE1hdGguY2VpbChzaWdCeXRlcyAvIDQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBjbG9uZS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBjbG9uZSA9IHdvcmRBcnJheS5jbG9uZSgpO1xuICAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2xvbmUgPSBCYXNlLmNsb25lLmNhbGwodGhpcyk7XG4gICAgICAgIGNsb25lLndvcmRzID0gdGhpcy53b3Jkcy5zbGljZSgwKTtcblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGEgd29yZCBhcnJheSBmaWxsZWQgd2l0aCByYW5kb20gYnl0ZXMuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuQnl0ZXMgVGhlIG51bWJlciBvZiByYW5kb20gYnl0ZXMgdG8gZ2VuZXJhdGUuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHJhbmRvbSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5yYW5kb20oMTYpO1xuICAgICAgKi9cbiAgICByYW5kb206IGZ1bmN0aW9uIChuQnl0ZXMpIHtcbiAgICAgICAgdmFyIHdvcmRzID0gW107XG5cbiAgICAgICAgdmFyIHIgPSBmdW5jdGlvbiAobV93KSB7XG4gICAgICAgICAgICB2YXIgbV96ID0gMHgzYWRlNjhiMTtcbiAgICAgICAgICAgIHZhciBtYXNrID0gMHhmZmZmZmZmZjtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtX3ogPSAoMHg5MDY5ICogKG1feiAmIDB4RkZGRikgKyAobV96ID4+IDB4MTApKSAmIG1hc2s7XG4gICAgICAgICAgICAgICAgbV93ID0gKDB4NDY1MCAqIChtX3cgJiAweEZGRkYpICsgKG1fdyA+PiAweDEwKSkgJiBtYXNrO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAoKG1feiA8PCAweDEwKSArIG1fdykgJiBtYXNrO1xuICAgICAgICAgICAgICAgIHJlc3VsdCAvPSAweDEwMDAwMDAwMDtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gMC41O1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgKiAoTWF0aC5yYW5kb20oKSA+IC41ID8gMSA6IC0xKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHJjYWNoZTsgaSA8IG5CeXRlczsgaSArPSA0KSB7XG4gICAgICAgICAgICB2YXIgX3IgPSByKChyY2FjaGUgfHwgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDAwMCk7XG5cbiAgICAgICAgICAgIHJjYWNoZSA9IF9yKCkgKiAweDNhZGU2N2I3O1xuICAgICAgICAgICAgd29yZHMucHVzaCgoX3IoKSAqIDB4MTAwMDAwMDAwKSB8IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbkJ5dGVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbn0pO1xuXG4vKipcbiAgKiBFbmNvZGVyIG5hbWVzcGFjZS5cbiAgKi9cbnZhciBDX2VuYyA9IEMuZW5jID0ge307XG5cbi8qKlxuICAqIEhleCBlbmNvZGluZyBzdHJhdGVneS5cbiAgKi9cbnZhciBIZXggPSBDX2VuYy5IZXggPSB7XG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgaGV4IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgaGV4IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGhleFN0cmluZyA9IENyeXB0b0pTLmVuYy5IZXguc3RyaW5naWZ5KHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIHdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuICAgICAgICB2YXIgc2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cbiAgICAgICAgLy8gQ29udmVydFxuICAgICAgICB2YXIgaGV4Q2hhcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWdCeXRlczsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYml0ZSA9ICh3b3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG4gICAgICAgICAgICBoZXhDaGFycy5wdXNoKChiaXRlID4+PiA0KS50b1N0cmluZygxNikpO1xuICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSAmIDB4MGYpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGV4Q2hhcnMuam9pbignJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyBhIGhleCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyIFRoZSBoZXggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMuZW5jLkhleC5wYXJzZShoZXhTdHJpbmcpO1xuICAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24gKGhleFN0cikge1xuICAgICAgICAvLyBTaG9ydGN1dFxuICAgICAgICB2YXIgaGV4U3RyTGVuZ3RoID0gaGV4U3RyLmxlbmd0aDtcblxuICAgICAgICAvLyBDb252ZXJ0XG4gICAgICAgIHZhciB3b3JkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhleFN0ckxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICB3b3Jkc1tpID4+PiAzXSB8PSBwYXJzZUludChoZXhTdHIuc3Vic3RyKGksIDIpLCAxNikgPDwgKDI0IC0gKGkgJSA4KSAqIDQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgaGV4U3RyTGVuZ3RoIC8gMik7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbn07XG5cbi8qKlxuICAqIExhdGluMSBlbmNvZGluZyBzdHJhdGVneS5cbiAgKi9cbnZhciBMYXRpbjEgPSBDX2VuYy5MYXRpbjEgPSB7XG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgTGF0aW4xIHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgTGF0aW4xIHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGxhdGluMVN0cmluZyA9IENyeXB0b0pTLmVuYy5MYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIHdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuICAgICAgICB2YXIgc2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cbiAgICAgICAgLy8gQ29udmVydFxuICAgICAgICB2YXIgbGF0aW4xQ2hhcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWdCeXRlczsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYml0ZSA9ICh3b3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG4gICAgICAgICAgICBsYXRpbjFDaGFycy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYml0ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhdGluMUNoYXJzLmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSBMYXRpbjEgc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGluMVN0ciBUaGUgTGF0aW4xIHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5MYXRpbjEucGFyc2UobGF0aW4xU3RyaW5nKTtcbiAgICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChsYXRpbjFTdHIpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRcbiAgICAgICAgdmFyIGxhdGluMVN0ckxlbmd0aCA9IGxhdGluMVN0ci5sZW5ndGg7XG5cbiAgICAgICAgLy8gQ29udmVydFxuICAgICAgICB2YXIgd29yZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRpbjFTdHJMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgd29yZHNbaSA+Pj4gMl0gfD0gKGxhdGluMVN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZikgPDwgKDI0IC0gKGkgJSA0KSAqIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbGF0aW4xU3RyTGVuZ3RoKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbn07XG5cbi8qKlxuICAqIFVURi04IGVuY29kaW5nIHN0cmF0ZWd5LlxuICAqL1xudmFyIFV0ZjggPSBDX2VuYy5VdGY4ID0ge1xuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIFVURi04IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgVVRGLTggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgdXRmOFN0cmluZyA9IENyeXB0b0pTLmVuYy5VdGY4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKExhdGluMS5zdHJpbmdpZnkod29yZEFycmF5KSkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hbGZvcm1lZCBVVEYtOCBkYXRhJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgVVRGLTggc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IHV0ZjhTdHIgVGhlIFVURi04IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5VdGY4LnBhcnNlKHV0ZjhTdHJpbmcpO1xuICAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24gKHV0ZjhTdHIpIHtcbiAgICAgICAgcmV0dXJuIExhdGluMS5wYXJzZSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQodXRmOFN0cikpKTtcbiAgICB9XG59O1xuXG4vKipcbiAgKiBBYnN0cmFjdCBidWZmZXJlZCBibG9jayBhbGdvcml0aG0gdGVtcGxhdGUuXG4gICpcbiAgKiBUaGUgcHJvcGVydHkgYmxvY2tTaXplIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gYSBjb25jcmV0ZSBzdWJ0eXBlLlxuICAqXG4gICogQHByb3BlcnR5IHtudW1iZXJ9IF9taW5CdWZmZXJTaXplIFRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgc2hvdWxkIGJlIGtlcHQgdW5wcm9jZXNzZWQgaW4gdGhlIGJ1ZmZlci4gRGVmYXVsdDogMFxuICAqL1xudmFyIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBDX2xpYi5CdWZmZXJlZEJsb2NrQWxnb3JpdGhtID0gQmFzZS5leHRlbmQoe1xuXG4gICAgLyoqXG4gICAgICAqIFJlc2V0cyB0aGlzIGJsb2NrIGFsZ29yaXRobSdzIGRhdGEgYnVmZmVyIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5yZXNldCgpO1xuICAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJbml0aWFsIHZhbHVlc1xuICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFdvcmRBcnJheS5pbml0KCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgdGhpcy5fbkRhdGFCeXRlcyA9IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBBZGRzIG5ldyBkYXRhIHRvIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgYnVmZmVyLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYXBwZW5kLiBTdHJpbmdzIGFyZSBjb252ZXJ0ZWQgdG8gYSBXb3JkQXJyYXkgdXNpbmcgVVRGLTguXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQoJ2RhdGEnKTtcbiAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX2FwcGVuZCh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBfYXBwZW5kOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAvLyBDb252ZXJ0IHN0cmluZyB0byBXb3JkQXJyYXksIGVsc2UgYXNzdW1lIFdvcmRBcnJheSBhbHJlYWR5XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEgPSBVdGY4LnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwZW5kXG4gICAgICAgIHRoaXMuX2RhdGEuY29uY2F0KGRhdGEpO1xuICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzICs9IGRhdGEuc2lnQnl0ZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBQcm9jZXNzZXMgYXZhaWxhYmxlIGRhdGEgYmxvY2tzLlxuICAgICAgKlxuICAgICAgKiBUaGlzIG1ldGhvZCBpbnZva2VzIF9kb1Byb2Nlc3NCbG9jayhvZmZzZXQpLCB3aGljaCBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IGEgY29uY3JldGUgc3VidHlwZS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtib29sZWFufSBkb0ZsdXNoIFdoZXRoZXIgYWxsIGJsb2NrcyBhbmQgcGFydGlhbCBibG9ja3Mgc2hvdWxkIGJlIHByb2Nlc3NlZC5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcHJvY2Vzc2VkIGRhdGEuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgcHJvY2Vzc2VkRGF0YSA9IGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX3Byb2Nlc3MoKTtcbiAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcyghISdmbHVzaCcpO1xuICAgICAgKi9cbiAgICBfcHJvY2VzczogZnVuY3Rpb24gKGRvRmx1c2gpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG4gICAgICAgIHZhciBkYXRhU2lnQnl0ZXMgPSBkYXRhLnNpZ0J5dGVzO1xuICAgICAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5ibG9ja1NpemU7XG4gICAgICAgIHZhciBibG9ja1NpemVCeXRlcyA9IGJsb2NrU2l6ZSAqIDQ7XG5cbiAgICAgICAgLy8gQ291bnQgYmxvY2tzIHJlYWR5XG4gICAgICAgIHZhciBuQmxvY2tzUmVhZHkgPSBkYXRhU2lnQnl0ZXMgLyBibG9ja1NpemVCeXRlcztcbiAgICAgICAgaWYgKGRvRmx1c2gpIHtcbiAgICAgICAgICAgIC8vIFJvdW5kIHVwIHRvIGluY2x1ZGUgcGFydGlhbCBibG9ja3NcbiAgICAgICAgICAgIG5CbG9ja3NSZWFkeSA9IE1hdGguY2VpbChuQmxvY2tzUmVhZHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUm91bmQgZG93biB0byBpbmNsdWRlIG9ubHkgZnVsbCBibG9ja3MsXG4gICAgICAgICAgICAvLyBsZXNzIHRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgbXVzdCByZW1haW4gaW4gdGhlIGJ1ZmZlclxuICAgICAgICAgICAgbkJsb2Nrc1JlYWR5ID0gTWF0aC5tYXgoKG5CbG9ja3NSZWFkeSB8IDApIC0gdGhpcy5fbWluQnVmZmVyU2l6ZSwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb3VudCB3b3JkcyByZWFkeVxuICAgICAgICB2YXIgbldvcmRzUmVhZHkgPSBuQmxvY2tzUmVhZHkgKiBibG9ja1NpemU7XG5cbiAgICAgICAgLy8gQ291bnQgYnl0ZXMgcmVhZHlcbiAgICAgICAgdmFyIG5CeXRlc1JlYWR5ID0gTWF0aC5taW4obldvcmRzUmVhZHkgKiA0LCBkYXRhU2lnQnl0ZXMpO1xuXG4gICAgICAgIC8vIFByb2Nlc3MgYmxvY2tzXG4gICAgICAgIGlmIChuV29yZHNSZWFkeSkge1xuICAgICAgICAgICAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgbldvcmRzUmVhZHk7IG9mZnNldCArPSBibG9ja1NpemUpIHtcbiAgICAgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWFsZ29yaXRobSBsb2dpY1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvUHJvY2Vzc0Jsb2NrKGRhdGFXb3Jkcywgb2Zmc2V0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVtb3ZlIHByb2Nlc3NlZCB3b3Jkc1xuICAgICAgICAgICAgdmFyIHByb2Nlc3NlZFdvcmRzID0gZGF0YVdvcmRzLnNwbGljZSgwLCBuV29yZHNSZWFkeSk7XG4gICAgICAgICAgICBkYXRhLnNpZ0J5dGVzIC09IG5CeXRlc1JlYWR5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIHByb2Nlc3NlZCB3b3Jkc1xuICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHByb2Nlc3NlZFdvcmRzLCBuQnl0ZXNSZWFkeSk7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNsb25lLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGNsb25lID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5jbG9uZSgpO1xuICAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2xvbmUgPSBCYXNlLmNsb25lLmNhbGwodGhpcyk7XG4gICAgICAgIGNsb25lLl9kYXRhID0gdGhpcy5fZGF0YS5jbG9uZSgpO1xuXG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9LFxuXG4gICAgX21pbkJ1ZmZlclNpemU6IDBcbn0pO1xuXG4vKipcbiAgKiBBYnN0cmFjdCBoYXNoZXIgdGVtcGxhdGUuXG4gICpcbiAgKiBAcHJvcGVydHkge251bWJlcn0gYmxvY2tTaXplIFRoZSBudW1iZXIgb2YgMzItYml0IHdvcmRzIHRoaXMgaGFzaGVyIG9wZXJhdGVzIG9uLiBEZWZhdWx0OiAxNiAoNTEyIGJpdHMpXG4gICovXG5DX2xpYi5IYXNoZXIgPSBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtLmV4dGVuZCh7XG5cbiAgICAvKipcbiAgICAgICogQ29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgICAgKi9cbiAgICBjZmc6IEJhc2UuZXh0ZW5kKCksXG5cbiAgICAvKipcbiAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIGhhc2hlci5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtPYmplY3R9IGNmZyAoT3B0aW9uYWwpIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgdG8gdXNlIGZvciB0aGlzIGhhc2ggY29tcHV0YXRpb24uXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgaGFzaGVyID0gQ3J5cHRvSlMuYWxnby5TSEEyNTYuY3JlYXRlKCk7XG4gICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uIChjZmcpIHtcbiAgICAgICAgLy8gQXBwbHkgY29uZmlnIGRlZmF1bHRzXG4gICAgICAgIHRoaXMuY2ZnID0gdGhpcy5jZmcuZXh0ZW5kKGNmZyk7XG5cbiAgICAgICAgLy8gU2V0IGluaXRpYWwgdmFsdWVzXG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIFJlc2V0cyB0aGlzIGhhc2hlciB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIGhhc2hlci5yZXNldCgpO1xuICAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZXNldCBkYXRhIGJ1ZmZlclxuICAgICAgICBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtLnJlc2V0LmNhbGwodGhpcyk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcbiAgICAgICAgdGhpcy5fZG9SZXNldCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogVXBkYXRlcyB0aGlzIGhhc2hlciB3aXRoIGEgbWVzc2FnZS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIFRoZSBtZXNzYWdlIHRvIGFwcGVuZC5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7SGFzaGVyfSBUaGlzIGhhc2hlci5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIGhhc2hlci51cGRhdGUoJ21lc3NhZ2UnKTtcbiAgICAgICogICAgIGhhc2hlci51cGRhdGUod29yZEFycmF5KTtcbiAgICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuICAgICAgICAvLyBBcHBlbmRcbiAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgaGFzaFxuICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cbiAgICAgICAgLy8gQ2hhaW5hYmxlXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogRmluYWxpemVzIHRoZSBoYXNoIGNvbXB1dGF0aW9uLlxuICAgICAgKiBOb3RlIHRoYXQgdGhlIGZpbmFsaXplIG9wZXJhdGlvbiBpcyBlZmZlY3RpdmVseSBhIGRlc3RydWN0aXZlLCByZWFkLW9uY2Ugb3BlcmF0aW9uLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgKE9wdGlvbmFsKSBBIGZpbmFsIG1lc3NhZ2UgdXBkYXRlLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGhhc2ggPSBoYXNoZXIuZmluYWxpemUoKTtcbiAgICAgICogICAgIHZhciBoYXNoID0gaGFzaGVyLmZpbmFsaXplKCdtZXNzYWdlJyk7XG4gICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBmaW5hbGl6ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgLy8gRmluYWwgbWVzc2FnZSB1cGRhdGVcbiAgICAgICAgaWYgKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZChtZXNzYWdlVXBkYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtaGFzaGVyIGxvZ2ljXG4gICAgICAgIHZhciBoYXNoID0gdGhpcy5fZG9GaW5hbGl6ZSgpO1xuXG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgIH0sXG5cbiAgICBibG9ja1NpemU6IDUxMiAvIDMyLFxuXG4gICAgLyoqXG4gICAgICAqIENyZWF0ZXMgYSBzaG9ydGN1dCBmdW5jdGlvbiB0byBhIGhhc2hlcidzIG9iamVjdCBpbnRlcmZhY2UuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byBjcmVhdGUgYSBoZWxwZXIgZm9yLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIHNob3J0Y3V0IGZ1bmN0aW9uLlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgU0hBMjU2ID0gQ3J5cHRvSlMubGliLkhhc2hlci5fY3JlYXRlSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcbiAgICAgICovXG4gICAgX2NyZWF0ZUhlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGNmZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBoYXNoZXIuaW5pdChjZmcpLmZpbmFsaXplKG1lc3NhZ2UpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoZXIgdG8gdXNlIGluIHRoaXMgSE1BQyBoZWxwZXIuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgc2hvcnRjdXQgZnVuY3Rpb24uXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBIbWFjU0hBMjU2ID0gQ3J5cHRvSlMubGliLkhhc2hlci5fY3JlYXRlSG1hY0hlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG4gICAgICAqL1xuICAgIF9jcmVhdGVIbWFjSGVscGVyOiBmdW5jdGlvbiAoaGFzaGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENfYWxnby5ITUFDLmluaXQoaGFzaGVyLCBrZXkpLmZpbmFsaXplKG1lc3NhZ2UpOyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDO1xuIiwiLyoqXG4gKiBAZmlsZSBobWFjLXNoYTI1Ni5qc1xuICogQGF1dGhvciA/Pz9cbiAqL1xucmVxdWlyZSgzOSk7XG5yZXF1aXJlKDM4KTtcbnZhciBDcnlwdG9KUyA9IHJlcXVpcmUoMzYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENyeXB0b0pTLkhtYWNTSEEyNTY7XG4iLCIvKipcbiAqIEBmaWxlIGhtYWMuanNcbiAqIEBhdXRob3IgPz8/XG4gKi9cblxudmFyIENyeXB0b0pTID0gcmVxdWlyZSgzNik7XG5cbi8vIFNob3J0Y3V0c1xudmFyIEMgPSBDcnlwdG9KUztcbnZhciBDX2xpYiA9IEMubGliO1xudmFyIEJhc2UgPSBDX2xpYi5CYXNlO1xudmFyIENfZW5jID0gQy5lbmM7XG52YXIgVXRmOCA9IENfZW5jLlV0Zjg7XG52YXIgQ19hbGdvID0gQy5hbGdvO1xuXG4vKipcbiAqIEhNQUMgYWxnb3JpdGhtLlxuICovXG5DX2FsZ28uSE1BQyA9IEJhc2UuZXh0ZW5kKHtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCBITUFDLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaCBhbGdvcml0aG0gdG8gdXNlLlxuICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30ga2V5IFRoZSBzZWNyZXQga2V5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICB2YXIgaG1hY0hhc2hlciA9IENyeXB0b0pTLmFsZ28uSE1BQy5jcmVhdGUoQ3J5cHRvSlMuYWxnby5TSEEyNTYsIGtleSk7XG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKGhhc2hlciwga2V5KSB7XG4gICAgICAgIC8vIEluaXQgaGFzaGVyXG4gICAgICAgIGhhc2hlciA9IHRoaXMuX2hhc2hlciA9IG5ldyBoYXNoZXIuaW5pdCgpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGtleSA9IFV0ZjgucGFyc2Uoa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgaGFzaGVyQmxvY2tTaXplID0gaGFzaGVyLmJsb2NrU2l6ZTtcbiAgICAgICAgdmFyIGhhc2hlckJsb2NrU2l6ZUJ5dGVzID0gaGFzaGVyQmxvY2tTaXplICogNDtcblxuICAgICAgICAvLyBBbGxvdyBhcmJpdHJhcnkgbGVuZ3RoIGtleXNcbiAgICAgICAgaWYgKGtleS5zaWdCeXRlcyA+IGhhc2hlckJsb2NrU2l6ZUJ5dGVzKSB7XG4gICAgICAgICAgICBrZXkgPSBoYXNoZXIuZmluYWxpemUoa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG4gICAgICAgIGtleS5jbGFtcCgpO1xuXG4gICAgICAgIC8vIENsb25lIGtleSBmb3IgaW5uZXIgYW5kIG91dGVyIHBhZHNcbiAgICAgICAgdmFyIG9LZXkgPSB0aGlzLl9vS2V5ID0ga2V5LmNsb25lKCk7XG4gICAgICAgIHZhciBpS2V5ID0gdGhpcy5faUtleSA9IGtleS5jbG9uZSgpO1xuXG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgb0tleVdvcmRzID0gb0tleS53b3JkcztcbiAgICAgICAgdmFyIGlLZXlXb3JkcyA9IGlLZXkud29yZHM7XG5cbiAgICAgICAgLy8gWE9SIGtleXMgd2l0aCBwYWQgY29uc3RhbnRzXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFzaGVyQmxvY2tTaXplOyBpKyspIHtcbiAgICAgICAgICAgIG9LZXlXb3Jkc1tpXSBePSAweDVjNWM1YzVjO1xuICAgICAgICAgICAgaUtleVdvcmRzW2ldIF49IDB4MzYzNjM2MzY7XG4gICAgICAgIH1cbiAgICAgICAgb0tleS5zaWdCeXRlcyA9IGlLZXkuc2lnQnl0ZXMgPSBoYXNoZXJCbG9ja1NpemVCeXRlcztcblxuICAgICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZXNcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhpcyBITUFDIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICBobWFjSGFzaGVyLnJlc2V0KCk7XG4gICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRcbiAgICAgICAgdmFyIGhhc2hlciA9IHRoaXMuX2hhc2hlcjtcblxuICAgICAgICAvLyBSZXNldFxuICAgICAgICBoYXNoZXIucmVzZXQoKTtcbiAgICAgICAgaGFzaGVyLnVwZGF0ZSh0aGlzLl9pS2V5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGlzIEhNQUMgd2l0aCBhIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kLlxuICAgICAqXG4gICAgICogQHJldHVybiB7SE1BQ30gVGhpcyBITUFDIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICBobWFjSGFzaGVyLnVwZGF0ZSgnbWVzc2FnZScpO1xuICAgICAqICAgICBobWFjSGFzaGVyLnVwZGF0ZSh3b3JkQXJyYXkpO1xuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgdGhpcy5faGFzaGVyLnVwZGF0ZShtZXNzYWdlVXBkYXRlKTtcblxuICAgICAgICAvLyBDaGFpbmFibGVcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmFsaXplcyB0aGUgSE1BQyBjb21wdXRhdGlvbi5cbiAgICAgKiBOb3RlIHRoYXQgdGhlIGZpbmFsaXplIG9wZXJhdGlvbiBpcyBlZmZlY3RpdmVseSBhIGRlc3RydWN0aXZlLCByZWFkLW9uY2Ugb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIChPcHRpb25hbCkgQSBmaW5hbCBtZXNzYWdlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIEhNQUMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIHZhciBobWFjID0gaG1hY0hhc2hlci5maW5hbGl6ZSgpO1xuICAgICAqICAgICB2YXIgaG1hYyA9IGhtYWNIYXNoZXIuZmluYWxpemUoJ21lc3NhZ2UnKTtcbiAgICAgKiAgICAgdmFyIGhtYWMgPSBobWFjSGFzaGVyLmZpbmFsaXplKHdvcmRBcnJheSk7XG4gICAgICovXG4gICAgZmluYWxpemU6IGZ1bmN0aW9uIChtZXNzYWdlVXBkYXRlKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0XG4gICAgICAgIHZhciBoYXNoZXIgPSB0aGlzLl9oYXNoZXI7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSBITUFDXG4gICAgICAgIHZhciBpbm5lckhhc2ggPSBoYXNoZXIuZmluYWxpemUobWVzc2FnZVVwZGF0ZSk7XG4gICAgICAgIGhhc2hlci5yZXNldCgpO1xuICAgICAgICB2YXIgaG1hYyA9IGhhc2hlci5maW5hbGl6ZSh0aGlzLl9vS2V5LmNsb25lKCkuY29uY2F0KGlubmVySGFzaCkpO1xuXG4gICAgICAgIHJldHVybiBobWFjO1xuICAgIH1cbn0pO1xuIiwiLyoqXG4gKiBAZmlsZSBzaGEyNTYuanNcbiAqIEBhdXRob3IgPz8/XG4gKi9cbnZhciBDcnlwdG9KUyA9IHJlcXVpcmUoMzYpO1xuXG4gICAgLy8gU2hvcnRjdXRzXG52YXIgQyA9IENyeXB0b0pTO1xudmFyIENfbGliID0gQy5saWI7XG52YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5O1xudmFyIEhhc2hlciA9IENfbGliLkhhc2hlcjtcbnZhciBDX2FsZ28gPSBDLmFsZ287XG5cbi8vIEluaXRpYWxpemF0aW9uIGFuZCByb3VuZCBjb25zdGFudHMgdGFibGVzXG52YXIgSCA9IFtdO1xudmFyIEsgPSBbXTtcblxuLy8gQ29tcHV0ZSBjb25zdGFudHNcbihmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gaXNQcmltZShuKSB7XG4gICAgICAgIHZhciBzcXJ0TiA9IE1hdGguc3FydChuKTtcbiAgICAgICAgZm9yICh2YXIgZmFjdG9yID0gMjsgZmFjdG9yIDw9IHNxcnROOyBmYWN0b3IrKykge1xuICAgICAgICAgICAgaWYgKCEobiAlIGZhY3RvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEZyYWN0aW9uYWxCaXRzKG4pIHtcbiAgICAgICAgcmV0dXJuICgobiAtIChuIHwgMCkpICogMHgxMDAwMDAwMDApIHwgMDtcbiAgICB9XG5cbiAgICB2YXIgbiA9IDI7XG4gICAgdmFyIG5QcmltZSA9IDA7XG4gICAgd2hpbGUgKG5QcmltZSA8IDY0KSB7XG4gICAgICAgIGlmIChpc1ByaW1lKG4pKSB7XG4gICAgICAgICAgICBpZiAoblByaW1lIDwgOCkge1xuICAgICAgICAgICAgICAgIEhbblByaW1lXSA9IGdldEZyYWN0aW9uYWxCaXRzKE1hdGgucG93KG4sIDEgLyAyKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEtbblByaW1lXSA9IGdldEZyYWN0aW9uYWxCaXRzKE1hdGgucG93KG4sIDEgLyAzKSk7XG5cbiAgICAgICAgICAgIG5QcmltZSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgbisrO1xuICAgIH1cbn0oKSk7XG5cbi8vIFJldXNhYmxlIG9iamVjdFxudmFyIFcgPSBbXTtcblxuLyoqXG4gKiBTSEEtMjU2IGhhc2ggYWxnb3JpdGhtLlxuICovXG52YXIgU0hBMjU2ID0gQ19hbGdvLlNIQTI1NiA9IEhhc2hlci5leHRlbmQoe1xuICAgIF9kb1Jlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2hhc2ggPSBuZXcgV29yZEFycmF5LmluaXQoSC5zbGljZSgwKSk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9LFxuXG4gICAgX2RvUHJvY2Vzc0Jsb2NrOiBmdW5jdGlvbiAoTSwgb2Zmc2V0KSB7XG4gICAgICAgIC8vIFNob3J0Y3V0XG4gICAgICAgIHZhciBIID0gdGhpcy5faGFzaC53b3JkcztcblxuICAgICAgICAvLyBXb3JraW5nIHZhcmlhYmxlc1xuICAgICAgICB2YXIgYSA9IEhbMF07XG4gICAgICAgIHZhciBiID0gSFsxXTtcbiAgICAgICAgdmFyIGMgPSBIWzJdO1xuICAgICAgICB2YXIgZCA9IEhbM107XG4gICAgICAgIHZhciBlID0gSFs0XTtcbiAgICAgICAgdmFyIGYgPSBIWzVdO1xuICAgICAgICB2YXIgZyA9IEhbNl07XG4gICAgICAgIHZhciBoID0gSFs3XTtcblxuICAgICAgICAvLyBDb21wdXRhdGlvblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICBXW2ldID0gTVtvZmZzZXQgKyBpXSB8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2FtbWEweCA9IFdbaSAtIDE1XTtcbiAgICAgICAgICAgICAgICB2YXIgZ2FtbWEwID0gKChnYW1tYTB4IDw8IDI1KVxuICAgICAgICAgICAgICAgICAgICB8IChnYW1tYTB4ID4+PiA3KSkgXiAoKGdhbW1hMHggPDwgMTQpXG4gICAgICAgICAgICAgICAgICAgIHwgKGdhbW1hMHggPj4+IDE4KSkgXiAoZ2FtbWEweCA+Pj4gMyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZ2FtbWExeCA9IFdbaSAtIDJdO1xuICAgICAgICAgICAgICAgIHZhciBnYW1tYTEgPSAoKGdhbW1hMXggPDwgMTUpXG4gICAgICAgICAgICAgICAgICAgIHwgKGdhbW1hMXggPj4+IDE3KSkgXiAoKGdhbW1hMXggPDwgMTMpXG4gICAgICAgICAgICAgICAgICAgIHwgKGdhbW1hMXggPj4+IDE5KSkgXiAoZ2FtbWExeCA+Pj4gMTApO1xuXG4gICAgICAgICAgICAgICAgV1tpXSA9IGdhbW1hMCArIFdbaSAtIDddICsgZ2FtbWExICsgV1tpIC0gMTZdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2ggPSAoZSAmIGYpIF4gKH5lICYgZyk7XG4gICAgICAgICAgICB2YXIgbWFqID0gKGEgJiBiKSBeIChhICYgYykgXiAoYiAmIGMpO1xuXG4gICAgICAgICAgICB2YXIgc2lnbWEwID0gKChhIDw8IDMwKSB8IChhID4+PiAyKSkgXiAoKGEgPDwgMTkpIHwgKGEgPj4+IDEzKSkgXiAoKGEgPDwgMTApIHwgKGEgPj4+IDIyKSk7XG4gICAgICAgICAgICB2YXIgc2lnbWExID0gKChlIDw8IDI2KSB8IChlID4+PiA2KSkgXiAoKGUgPDwgMjEpIHwgKGUgPj4+IDExKSkgXiAoKGUgPDwgNykgfCAoZSA+Pj4gMjUpKTtcblxuICAgICAgICAgICAgdmFyIHQxID0gaCArIHNpZ21hMSArIGNoICsgS1tpXSArIFdbaV07XG4gICAgICAgICAgICB2YXIgdDIgPSBzaWdtYTAgKyBtYWo7XG5cbiAgICAgICAgICAgIGggPSBnO1xuICAgICAgICAgICAgZyA9IGY7XG4gICAgICAgICAgICBmID0gZTtcbiAgICAgICAgICAgIGUgPSAoZCArIHQxKSB8IDA7XG4gICAgICAgICAgICBkID0gYztcbiAgICAgICAgICAgIGMgPSBiO1xuICAgICAgICAgICAgYiA9IGE7XG4gICAgICAgICAgICBhID0gKHQxICsgdDIpIHwgMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEludGVybWVkaWF0ZSBoYXNoIHZhbHVlXG4gICAgICAgIEhbMF0gPSAoSFswXSArIGEpIHwgMDtcbiAgICAgICAgSFsxXSA9IChIWzFdICsgYikgfCAwO1xuICAgICAgICBIWzJdID0gKEhbMl0gKyBjKSB8IDA7XG4gICAgICAgIEhbM10gPSAoSFszXSArIGQpIHwgMDtcbiAgICAgICAgSFs0XSA9IChIWzRdICsgZSkgfCAwO1xuICAgICAgICBIWzVdID0gKEhbNV0gKyBmKSB8IDA7XG4gICAgICAgIEhbNl0gPSAoSFs2XSArIGcpIHwgMDtcbiAgICAgICAgSFs3XSA9IChIWzddICsgaCkgfCAwO1xuICAgIH0sXG5cbiAgICBfZG9GaW5hbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuICAgICAgICB2YXIgZGF0YVdvcmRzID0gZGF0YS53b3JkcztcblxuICAgICAgICB2YXIgbkJpdHNUb3RhbCA9IHRoaXMuX25EYXRhQnl0ZXMgKiA4O1xuICAgICAgICB2YXIgbkJpdHNMZWZ0ID0gZGF0YS5zaWdCeXRlcyAqIDg7XG5cbiAgICAgICAgLy8gQWRkIHBhZGRpbmdcbiAgICAgICAgZGF0YVdvcmRzW25CaXRzTGVmdCA+Pj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBuQml0c0xlZnQgJSAzMik7XG4gICAgICAgIGRhdGFXb3Jkc1soKChuQml0c0xlZnQgKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gTWF0aC5mbG9vcihuQml0c1RvdGFsIC8gMHgxMDAwMDAwMDApO1xuICAgICAgICBkYXRhV29yZHNbKCgobkJpdHNMZWZ0ICsgNjQpID4+PiA5KSA8PCA0KSArIDE1XSA9IG5CaXRzVG90YWw7XG4gICAgICAgIGRhdGEuc2lnQnl0ZXMgPSBkYXRhV29yZHMubGVuZ3RoICogNDtcblxuICAgICAgICAvLyBIYXNoIGZpbmFsIGJsb2Nrc1xuICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGZpbmFsIGNvbXB1dGVkIGhhc2hcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgfSxcblxuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbG9uZSA9IEhhc2hlci5jbG9uZS5jYWxsKHRoaXMpO1xuICAgICAgICBjbG9uZS5faGFzaCA9IHRoaXMuX2hhc2guY2xvbmUoKTtcblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxufSk7XG5cbi8qKlxuICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIGhhc2hlcidzIG9iamVjdCBpbnRlcmZhY2UuXG4gKlxuICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGhhc2guXG4gKlxuICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgaGFzaC5cbiAqXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgdmFyIGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYoJ21lc3NhZ2UnKTtcbiAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTI1Nih3b3JkQXJyYXkpO1xuICovXG5DLlNIQTI1NiA9IEhhc2hlci5fY3JlYXRlSGVscGVyKFNIQTI1Nik7XG5cbi8qKlxuICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuICpcbiAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG4gKlxuICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cbiAqXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgdmFyIGhtYWMgPSBDcnlwdG9KUy5IbWFjU0hBMjU2KG1lc3NhZ2UsIGtleSk7XG4gKi9cbkMuSG1hY1NIQTI1NiA9IEhhc2hlci5fY3JlYXRlSG1hY0hlbHBlcihTSEEyNTYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENyeXB0b0pTLlNIQTI1NjtcbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL2NyeXB0by5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIEhtYWNTSEEyNTYgPSByZXF1aXJlKDM3KTtcbnZhciBIZXggPSByZXF1aXJlKDM2KS5lbmMuSGV4O1xuXG5leHBvcnRzLmNyZWF0ZUhtYWMgPSBmdW5jdGlvbiAodHlwZSwga2V5KSB7XG4gICAgaWYgKHR5cGUgPT09ICdzaGEyNTYnKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgIHZhciBzaGEyNTZIbWFjID0ge1xuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSG1hY1NIQTI1NihkYXRhLCBrZXkpLnRvU3RyaW5nKEhleCk7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpZ2VzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNoYTI1NkhtYWM7XG4gICAgfVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL2V2ZW50cy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyoqXG4gKiBFdmVudEVtaXR0ZXJcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIHRoaXMuX19ldmVudHMgPSB7fTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgdmFyX2FyZ3MpIHtcbiAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV07XG4gICAgaWYgKCFoYW5kbGVycykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGhhbmRsZXJzW2ldO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIC8vIElHTk9SRVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICBpZiAoIXRoaXMuX19ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV0gPSBbbGlzdGVuZXJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fX2V2ZW50c1tldmVudE5hbWVdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9oZWxwZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbmZ1bmN0aW9uIHBhZChudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyIDwgMTApIHtcbiAgICAgICAgcmV0dXJuICcwJyArIG51bWJlcjtcbiAgICB9XG4gICAgcmV0dXJuIG51bWJlcjtcbn1cblxuZXhwb3J0cy50b0lTT1N0cmluZyA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgaWYgKGRhdGUudG9JU09TdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDRnVsbFllYXIoKVxuICAgICAgICArICctJyArIHBhZChkYXRlLmdldFVUQ01vbnRoKCkgKyAxKVxuICAgICAgICArICctJyArIHBhZChkYXRlLmdldFVUQ0RhdGUoKSlcbiAgICAgICAgKyAnVCcgKyBwYWQoZGF0ZS5nZXRVVENIb3VycygpKVxuICAgICAgICArICc6JyArIHBhZChkYXRlLmdldFVUQ01pbnV0ZXMoKSlcbiAgICAgICAgKyAnOicgKyBwYWQoZGF0ZS5nZXRVVENTZWNvbmRzKCkpXG4gICAgICAgICsgJy4nICsgKGRhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCkgLyAxMDAwKS50b0ZpeGVkKDMpLnNsaWNlKDIsIDUpXG4gICAgICAgICsgJ1onO1xufTtcblxuZXhwb3J0cy50b1VUQ1N0cmluZyA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgdmFyIGlzb1N0cmluZyA9IGV4cG9ydHMudG9JU09TdHJpbmcoZGF0ZSk7XG4gICAgcmV0dXJuIGlzb1N0cmluZy5yZXBsYWNlKC9cXC5cXGQrWiQvLCAnWicpO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvcGF0aC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHUgPSByZXF1aXJlKDQ2KTtcblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPSAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcblxuZnVuY3Rpb24gc3BsaXRQYXRoKGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufVxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAgIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gICAgdmFyIHVwID0gMDtcblxuICAgIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuXG4gICAgICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgICAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVwKSB7XG4gICAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB1cC0tO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICAgIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgICAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgICAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH07XG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZSh1LmZpbHRlcihwYXRocywgZnVuY3Rpb24gKHAsIGluZGV4KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfSkuam9pbignLycpKTtcbn07XG5cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB2YXIgaXNBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gICAgdmFyIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgICBwYXRoID0gbm9ybWFsaXplQXJyYXkodS5maWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbiAocCkge1xuICAgICAgICByZXR1cm4gISFwO1xuICAgIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gICAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgICAgIHBhdGggPSAnLic7XG4gICAgfVxuICAgIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICAgICAgcGF0aCArPSAnLyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHNyYy92ZW5kb3IvcS5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cbnZhciBQcm9taXNlID0gcmVxdWlyZSgzNCk7XG5cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlLmFwcGx5KFByb21pc2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLnJlamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QuYXBwbHkoUHJvbWlzZSwgYXJndW1lbnRzKTtcbn07XG5cbmV4cG9ydHMuYWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbC5hcHBseShQcm9taXNlLCBhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5mY2FsbCA9IGZ1bmN0aW9uIChmbikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZm4oKSk7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXgpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuZGVmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlZmVycmVkID0ge307XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzb2x2ZS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZWplY3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgc3JjL3ZlbmRvci9xdWVyeXN0cmluZy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHUgPSByZXF1aXJlKDQ2KTtcblxuZnVuY3Rpb24gc3RyaW5naWZ5UHJpbWl0aXZlKHYpIHtcbiAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodikpIHtcbiAgICAgICAgcmV0dXJuICcnICsgdjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xufVxuXG5leHBvcnRzLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgICBzZXAgPSBzZXAgfHwgJyYnO1xuICAgIGVxID0gZXEgfHwgJz0nO1xuXG4gICAgdmFyIGVuY29kZSA9IGVuY29kZVVSSUNvbXBvbmVudDsgLy8gUXVlcnlTdHJpbmcuZXNjYXBlO1xuICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmVuY29kZVVSSUNvbXBvbmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbmNvZGUgPSBvcHRpb25zLmVuY29kZVVSSUNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAob2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBrZXlzID0gdS5rZXlzKG9iaik7XG4gICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGZsYXN0ID0gbGVuIC0gMTtcbiAgICAgICAgdmFyIGZpZWxkcyA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG4gICAgICAgICAgICB2YXIgdiA9IG9ialtrXTtcbiAgICAgICAgICAgIHZhciBrcyA9IGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG5cbiAgICAgICAgICAgIGlmICh1LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmxlbiA9IHYubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciB2bGFzdCA9IHZsZW4gLSAxO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmxlbjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBrcyArIGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUodltqXSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA8IHZsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZsZW4gJiYgaSA8IGZsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBzZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IGtzICsgZW5jb2RlKHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBmbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn07XG4iLCIvKipcbiAqIGFnIC0tbm8tZmlsZW5hbWUgLW8gJ1xcYih1XFwuLio/KVxcKCcgLiAgfCBzb3J0IHwgdW5pcSAtY1xuICpcbiAqIEBmaWxlIHZlbmRvci91bmRlcnNjb3JlLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoNSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoMTApO1xudmFyIGlzTnVtYmVyID0gcmVxdWlyZSgxMyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKDE0KTtcblxudmFyIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBzdHJpbmdUYWc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoc291cmNlLCB2YXJfYXJncykge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAoaXRlbSAmJiBpc09iamVjdChpdGVtKSkge1xuICAgICAgICAgICAgdmFyIG9LZXlzID0ga2V5cyhpdGVtKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb0tleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gb0tleXNbal07XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlbVtrZXldO1xuICAgICAgICAgICAgICAgIHNvdXJjZVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc291cmNlO1xufVxuXG5mdW5jdGlvbiBtYXAoYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBmb3JlYWNoKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZmluZChhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldO1xuICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSwgaSwgYXJyYXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbHRlcihhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWUsIGksIGFycmF5KSkge1xuICAgICAgICAgICAgcmVzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIG9taXQob2JqZWN0LCB2YXJfYXJncykge1xuICAgIHZhciBhcmdzID0gaXNBcnJheSh2YXJfYXJncylcbiAgICAgICAgPyB2YXJfYXJnc1xuICAgICAgICA6IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIHZhciBvS2V5cyA9IGtleXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBvS2V5c1tpXTtcbiAgICAgICAgaWYgKGFyZ3MuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHBpY2sob2JqZWN0LCB2YXJfYXJncywgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIHZhciBpO1xuICAgIHZhciBrZXk7XG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24odmFyX2FyZ3MpKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHZhcl9hcmdzO1xuICAgICAgICB2YXIgb0tleXMgPSBrZXlzKG9iamVjdCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAga2V5ID0gb0tleXNbaV07XG4gICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBhcmdzID0gaXNBcnJheSh2YXJfYXJncylcbiAgICAgICAgICAgID8gdmFyX2FyZ3NcbiAgICAgICAgICAgIDogW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBrZXkgPSBhcmdzW2ldO1xuICAgICAgICAgICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGJpbmQoZm4sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGhhc0RvbnRFbnVtQnVnID0gISh7dG9TdHJpbmc6IG51bGx9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbnZhciBkb250RW51bXMgPSBbJ3RvU3RyaW5nJywgJ3RvTG9jYWxlU3RyaW5nJywgJ3ZhbHVlT2YnLCAnaGFzT3duUHJvcGVydHknLFxuICAgICdpc1Byb3RvdHlwZU9mJywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2NvbnN0cnVjdG9yJ107XG5cbmZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBwcm9wO1xuICAgIHZhciBpO1xuXG4gICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwcm9wKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZG9udEVudW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGRvbnRFbnVtc1tpXSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChkb250RW51bXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0cy5iaW5kID0gYmluZDtcbmV4cG9ydHMuZWFjaCA9IGZvcmVhY2g7XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMuZmlsdGVyID0gZmlsdGVyO1xuZXhwb3J0cy5maW5kID0gZmluZDtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuZXhwb3J0cy5tYXAgPSBtYXA7XG5leHBvcnRzLm9taXQgPSBvbWl0O1xuZXhwb3J0cy5waWNrID0gcGljaztcbmV4cG9ydHMua2V5cyA9IGtleXM7XG5leHBvcnRzLm5vb3AgPSBub29wO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci91dGlsLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgdSA9IHJlcXVpcmUoNDYpO1xuXG5leHBvcnRzLmluaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgdmFyIHN1YkNsYXNzUHJvdG8gPSBzdWJDbGFzcy5wcm90b3R5cGU7XG4gICAgdmFyIEYgPSBuZXcgRnVuY3Rpb24oKTtcbiAgICBGLnByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IG5ldyBGKCk7XG4gICAgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7XG4gICAgdS5leHRlbmQoc3ViQ2xhc3MucHJvdG90eXBlLCBzdWJDbGFzc1Byb3RvKTtcbn07XG5cbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgYXJnTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgIGlmIChhcmdMZW4gPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGY7XG4gICAgfVxuXG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIHZhciBhID0gMTtcbiAgICB2YXIgbGFzdFBvcyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmLmxlbmd0aDspIHtcbiAgICAgICAgaWYgKGYuY2hhckNvZGVBdChpKSA9PT0gMzcgLyoqICclJyAqLyAmJiBpICsgMSA8IGYubGVuZ3RoKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGYuY2hhckNvZGVBdChpICsgMSkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEwMDogLy8gJ2QnXG4gICAgICAgICAgICAgICAgICAgIGlmIChhID49IGFyZ0xlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IE51bWJlcihhcmd1bWVudHNbYSsrXSk7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RQb3MgPSBpID0gaSArIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgMTE1OiAvLyAncydcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPj0gYXJnTGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gU3RyaW5nKGFyZ3VtZW50c1thKytdKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBvcyA9IGkgPSBpICsgMjtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSAzNzogLy8gJyUnXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJyUnO1xuICAgICAgICAgICAgICAgICAgICBsYXN0UG9zID0gaSA9IGkgKyAyO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICsraTtcbiAgICB9XG5cbiAgICBpZiAobGFzdFBvcyA9PT0gMCkge1xuICAgICAgICBzdHIgPSBmO1xuICAgIH1cbiAgICBlbHNlIGlmIChsYXN0UG9zIDwgZi5sZW5ndGgpIHtcbiAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbn07XG4iXX0=
