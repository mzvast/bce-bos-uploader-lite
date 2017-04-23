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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy5tYXBsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmRvcGFyYWxsZWxsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmVhY2hvZmxpbWl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwuaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmlzYXJyYXlsaWtlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwua2V5aXRlcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwubWFwYXN5bmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5ub29wL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwub25jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLm9ubHlvbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc251bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCJzcmMvYmNlLXNkay1qcy9hdXRoLmpzIiwic3JjL2JjZS1zZGstanMvYmNlX2Jhc2VfY2xpZW50LmpzIiwic3JjL2JjZS1zZGstanMvYm9zX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL2NvbmZpZy5qcyIsInNyYy9iY2Utc2RrLWpzL2hlYWRlcnMuanMiLCJzcmMvYmNlLXNkay1qcy9odHRwX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL21pbWUudHlwZXMuanMiLCJzcmMvYmNlLXNkay1qcy9zdHJpbmdzLmpzIiwic3JjL2NvbmZpZy5qcyIsInNyYy9ldmVudHMuanMiLCJzcmMvbXVsdGlwYXJ0X3Rhc2suanMiLCJzcmMvbmV0d29ya19pbmZvLmpzIiwic3JjL3B1dF9vYmplY3RfdGFzay5qcyIsInNyYy9xdWV1ZS5qcyIsInNyYy9zdHNfdG9rZW5fbWFuYWdlci5qcyIsInNyYy90YXNrLmpzIiwic3JjL3VwbG9hZGVyLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlbmRvci9CdWZmZXIuanMiLCJzcmMvdmVuZG9yL1Byb21pc2UuanMiLCJzcmMvdmVuZG9yL2FzeW5jLmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvY29yZS5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL2htYWMtc2hhMjU2LmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvaG1hYy5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL3NoYTI1Ni5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLmpzIiwic3JjL3ZlbmRvci9ldmVudHMuanMiLCJzcmMvdmVuZG9yL2hlbHBlci5qcyIsInNyYy92ZW5kb3IvcGF0aC5qcyIsInNyYy92ZW5kb3IvcS5qcyIsInNyYy92ZW5kb3IvcXVlcnlzdHJpbmcuanMiLCJzcmMvdmVuZG9yL3VuZGVyc2NvcmUuanMiLCJzcmMvdmVuZG9yL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwcUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBiY2UtYm9zLXVwbG9hZGVyL2luZGV4LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIEJvc0NsaWVudCA9IHJlcXVpcmUoMTcpO1xudmFyIEF1dGggPSByZXF1aXJlKDE1KTtcblxudmFyIFVwbG9hZGVyID0gcmVxdWlyZSgzMSk7XG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYm9zOiB7XG4gICAgICAgIFVwbG9hZGVyOiBVcGxvYWRlclxuICAgIH0sXG4gICAgdXRpbHM6IHV0aWxzLFxuICAgIHNkazoge1xuICAgICAgICBROiBRLFxuICAgICAgICBCb3NDbGllbnQ6IEJvc0NsaWVudCxcbiAgICAgICAgQXV0aDogQXV0aFxuICAgIH1cbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCIndXNlIHN0cmljdCc7XG52YXIgbWFwQXN5bmMgPSByZXF1aXJlKDkpO1xudmFyIGRvUGFyYWxsZWxMaW1pdCA9IHJlcXVpcmUoMyk7XG5tb2R1bGUuZXhwb3J0cyA9IGRvUGFyYWxsZWxMaW1pdChtYXBBc3luYyk7XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZWFjaE9mTGltaXQgPSByZXF1aXJlKDQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRvUGFyYWxsZWxMaW1pdChmbikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGxpbWl0LCBpdGVyYXRvciwgY2IpIHtcbiAgICAgICAgcmV0dXJuIGZuKGVhY2hPZkxpbWl0KGxpbWl0KSwgb2JqLCBpdGVyYXRvciwgY2IpO1xuICAgIH07XG59O1xuIiwidmFyIG9uY2UgPSByZXF1aXJlKDExKTtcbnZhciBub29wID0gcmVxdWlyZSgxMCk7XG52YXIgb25seU9uY2UgPSByZXF1aXJlKDEyKTtcbnZhciBrZXlJdGVyYXRvciA9IHJlcXVpcmUoNyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZWFjaE9mTGltaXQobGltaXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY2IpIHtcbiAgICAgICAgY2IgPSBvbmNlKGNiIHx8IG5vb3ApO1xuICAgICAgICBvYmogPSBvYmogfHwgW107XG4gICAgICAgIHZhciBuZXh0S2V5ID0ga2V5SXRlcmF0b3Iob2JqKTtcbiAgICAgICAgaWYgKGxpbWl0IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICB2YXIgcnVubmluZyA9IDA7XG4gICAgICAgIHZhciBlcnJvcmVkID0gZmFsc2U7XG5cbiAgICAgICAgKGZ1bmN0aW9uIHJlcGxlbmlzaCgpIHtcbiAgICAgICAgICAgIGlmIChkb25lICYmIHJ1bm5pbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYihudWxsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKHJ1bm5pbmcgPCBsaW1pdCAmJiAhZXJyb3JlZCkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBuZXh0S2V5KCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJ1bm5pbmcgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBydW5uaW5nICs9IDE7XG4gICAgICAgICAgICAgICAgaXRlcmF0b3Iob2JqW2tleV0sIGtleSwgb25seU9uY2UoZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGVuaXNoKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5ID0gcmVxdWlyZSg1KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0FycmF5TGlrZShhcnIpIHtcbiAgICByZXR1cm4gaXNBcnJheShhcnIpIHx8IChcbiAgICAgICAgLy8gaGFzIGEgcG9zaXRpdmUgaW50ZWdlciBsZW5ndGggcHJvcGVydHlcbiAgICAgICAgdHlwZW9mIGFyci5sZW5ndGggPT09ICdudW1iZXInICYmXG4gICAgICAgIGFyci5sZW5ndGggPj0gMCAmJlxuICAgICAgICBhcnIubGVuZ3RoICUgMSA9PT0gMFxuICAgICk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2tleXMgPSByZXF1aXJlKDgpO1xudmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSg2KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBrZXlJdGVyYXRvcihjb2xsKSB7XG4gICAgdmFyIGkgPSAtMTtcbiAgICB2YXIgbGVuO1xuICAgIHZhciBrZXlzO1xuICAgIGlmIChpc0FycmF5TGlrZShjb2xsKSkge1xuICAgICAgICBsZW4gPSBjb2xsLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGkgOiBudWxsO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGtleXMgPSBfa2V5cyhjb2xsKTtcbiAgICAgICAgbGVuID0ga2V5cy5sZW5ndGg7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGkgPCBsZW4gPyBrZXlzW2ldIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgdmFyIF9rZXlzID0gW107XG4gICAgZm9yICh2YXIgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgX2tleXMucHVzaChrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX2tleXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgb25jZSA9IHJlcXVpcmUoMTEpO1xudmFyIG5vb3AgPSByZXF1aXJlKDEwKTtcbnZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoNik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWFwQXN5bmMoZWFjaGZuLCBhcnIsIGl0ZXJhdG9yLCBjYikge1xuICAgIGNiID0gb25jZShjYiB8fCBub29wKTtcbiAgICBhcnIgPSBhcnIgfHwgW107XG4gICAgdmFyIHJlc3VsdHMgPSBpc0FycmF5TGlrZShhcnIpID8gW10gOiB7fTtcbiAgICBlYWNoZm4oYXJyLCBmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBjYikge1xuICAgICAgICBpdGVyYXRvcih2YWx1ZSwgZnVuY3Rpb24gKGVyciwgdikge1xuICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0gPSB2O1xuICAgICAgICAgICAgY2IoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjYihlcnIsIHJlc3VsdHMpO1xuICAgIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub29wICgpIHt9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG9uY2UoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmbiA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25seV9vbmNlKGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoZm4gPT09IG51bGwpIHRocm93IG5ldyBFcnJvcignQ2FsbGJhY2sgd2FzIGFscmVhZHkgY2FsbGVkLicpO1xuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBmbiA9IG51bGw7XG4gICAgfTtcbn07XG4iLCIvKipcbiAqIGxvZGFzaCAzLjAuMyAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNiBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE2IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTnVtYmVyYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqICoqTm90ZToqKiBUbyBleGNsdWRlIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBhbmQgYE5hTmAsIHdoaWNoIGFyZSBjbGFzc2lmaWVkXG4gKiBhcyBudW1iZXJzLCB1c2UgdGhlIGBfLmlzRmluaXRlYCBtZXRob2QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOdW1iZXIoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gbnVtYmVyVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc051bWJlcjtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4yIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kZXJuIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IDIwMTItMjAxNSBUaGUgRG9qbyBGb3VuZGF0aW9uIDxodHRwOi8vZG9qb2ZvdW5kYXRpb24ub3JnLz5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKiBBdmFpbGFibGUgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9hdXRoLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cbi8qIGVzbGludCBtYXgtcGFyYW1zOlswLDEwXSAqL1xuXG52YXIgaGVscGVyID0gcmVxdWlyZSg0Mik7XG52YXIgdXRpbCA9IHJlcXVpcmUoNDcpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBIID0gcmVxdWlyZSgxOSk7XG52YXIgc3RyaW5ncyA9IHJlcXVpcmUoMjIpO1xuXG4vKipcbiAqIEF1dGhcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBhayBUaGUgYWNjZXNzIGtleS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzayBUaGUgc2VjdXJpdHkga2V5LlxuICovXG5mdW5jdGlvbiBBdXRoKGFrLCBzaykge1xuICAgIHRoaXMuYWsgPSBhaztcbiAgICB0aGlzLnNrID0gc2s7XG59XG5cbi8qKlxuICogR2VuZXJhdGUgdGhlIHNpZ25hdHVyZSBiYXNlZCBvbiBodHRwOi8vZ29sbHVtLmJhaWR1LmNvbS9BdXRoZW50aWNhdGlvbk1lY2hhbmlzbVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2QgVGhlIGh0dHAgcmVxdWVzdCBtZXRob2QsIHN1Y2ggYXMgR0VULCBQT1NULCBERUxFVEUsIFBVVCwgLi4uXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVzb3VyY2UgVGhlIHJlcXVlc3QgcGF0aC5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1zIFRoZSBxdWVyeSBzdHJpbmdzLlxuICogQHBhcmFtIHtPYmplY3Q9fSBoZWFkZXJzIFRoZSBodHRwIHJlcXVlc3QgaGVhZGVycy5cbiAqIEBwYXJhbSB7bnVtYmVyPX0gdGltZXN0YW1wIFNldCB0aGUgY3VycmVudCB0aW1lc3RhbXAuXG4gKiBAcGFyYW0ge251bWJlcj19IGV4cGlyYXRpb25JblNlY29uZHMgVGhlIHNpZ25hdHVyZSB2YWxpZGF0aW9uIHRpbWUuXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+PX0gaGVhZGVyc1RvU2lnbiBUaGUgcmVxdWVzdCBoZWFkZXJzIGxpc3Qgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGNhbGN1YWxhdGUgdGhlIHNpZ25hdHVyZS5cbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzaWduYXR1cmUuXG4gKi9cbkF1dGgucHJvdG90eXBlLmdlbmVyYXRlQXV0aG9yaXphdGlvbiA9IGZ1bmN0aW9uIChtZXRob2QsIHJlc291cmNlLCBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycywgdGltZXN0YW1wLCBleHBpcmF0aW9uSW5TZWNvbmRzLCBoZWFkZXJzVG9TaWduKSB7XG5cbiAgICB2YXIgbm93ID0gdGltZXN0YW1wID8gbmV3IERhdGUodGltZXN0YW1wICogMTAwMCkgOiBuZXcgRGF0ZSgpO1xuICAgIHZhciByYXdTZXNzaW9uS2V5ID0gdXRpbC5mb3JtYXQoJ2JjZS1hdXRoLXYxLyVzLyVzLyVkJyxcbiAgICAgICAgdGhpcy5haywgaGVscGVyLnRvVVRDU3RyaW5nKG5vdyksIGV4cGlyYXRpb25JblNlY29uZHMgfHwgMTgwMCk7XG4gICAgdmFyIHNlc3Npb25LZXkgPSB0aGlzLmhhc2gocmF3U2Vzc2lvbktleSwgdGhpcy5zayk7XG5cbiAgICB2YXIgY2Fub25pY2FsVXJpID0gdGhpcy51cmlDYW5vbmljYWxpemF0aW9uKHJlc291cmNlKTtcbiAgICB2YXIgY2Fub25pY2FsUXVlcnlTdHJpbmcgPSB0aGlzLnF1ZXJ5U3RyaW5nQ2Fub25pY2FsaXphdGlvbihwYXJhbXMgfHwge30pO1xuXG4gICAgdmFyIHJ2ID0gdGhpcy5oZWFkZXJzQ2Fub25pY2FsaXphdGlvbihoZWFkZXJzIHx8IHt9LCBoZWFkZXJzVG9TaWduKTtcbiAgICB2YXIgY2Fub25pY2FsSGVhZGVycyA9IHJ2WzBdO1xuICAgIHZhciBzaWduZWRIZWFkZXJzID0gcnZbMV07XG5cbiAgICB2YXIgcmF3U2lnbmF0dXJlID0gdXRpbC5mb3JtYXQoJyVzXFxuJXNcXG4lc1xcbiVzJyxcbiAgICAgICAgbWV0aG9kLCBjYW5vbmljYWxVcmksIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLCBjYW5vbmljYWxIZWFkZXJzKTtcbiAgICB2YXIgc2lnbmF0dXJlID0gdGhpcy5oYXNoKHJhd1NpZ25hdHVyZSwgc2Vzc2lvbktleSk7XG5cbiAgICBpZiAoc2lnbmVkSGVhZGVycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHV0aWwuZm9ybWF0KCclcy8lcy8lcycsIHJhd1Nlc3Npb25LZXksIHNpZ25lZEhlYWRlcnMuam9pbignOycpLCBzaWduYXR1cmUpO1xuICAgIH1cblxuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXMvLyVzJywgcmF3U2Vzc2lvbktleSwgc2lnbmF0dXJlKTtcbn07XG5cbkF1dGgucHJvdG90eXBlLnVyaUNhbm9uaWNhbGl6YXRpb24gPSBmdW5jdGlvbiAodXJpKSB7XG4gICAgcmV0dXJuIHVyaTtcbn07XG5cbi8qKlxuICogQ2Fub25pY2FsIHRoZSBxdWVyeSBzdHJpbmdzLlxuICpcbiAqIEBzZWUgaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQXV0aGVudGljYXRpb25NZWNoYW5pc20j55Sf5oiQQ2Fub25pY2FsUXVlcnlTdHJpbmdcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHF1ZXJ5IHN0cmluZ3MuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbkF1dGgucHJvdG90eXBlLnF1ZXJ5U3RyaW5nQ2Fub25pY2FsaXphdGlvbiA9IGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICB2YXIgY2Fub25pY2FsUXVlcnlTdHJpbmcgPSBbXTtcbiAgICB1LmVhY2godS5rZXlzKHBhcmFtcyksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGtleS50b0xvd2VyQ2FzZSgpID09PSBILkFVVEhPUklaQVRJT04udG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZhbHVlID0gcGFyYW1zW2tleV0gPT0gbnVsbCA/ICcnIDogcGFyYW1zW2tleV07XG4gICAgICAgIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLnB1c2goa2V5ICsgJz0nICsgc3RyaW5ncy5ub3JtYWxpemUodmFsdWUpKTtcbiAgICB9KTtcblxuICAgIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLnNvcnQoKTtcblxuICAgIHJldHVybiBjYW5vbmljYWxRdWVyeVN0cmluZy5qb2luKCcmJyk7XG59O1xuXG4vKipcbiAqIENhbm9uaWNhbCB0aGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKlxuICogQHNlZSBodHRwOi8vZ29sbHVtLmJhaWR1LmNvbS9BdXRoZW50aWNhdGlvbk1lY2hhbmlzbSPnlJ/miJBDYW5vbmljYWxIZWFkZXJzXG4gKiBAcGFyYW0ge09iamVjdH0gaGVhZGVycyBUaGUgaHR0cCByZXF1ZXN0IGhlYWRlcnMuXG4gKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+PX0gaGVhZGVyc1RvU2lnbiBUaGUgcmVxdWVzdCBoZWFkZXJzIGxpc3Qgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGNhbGN1YWxhdGUgdGhlIHNpZ25hdHVyZS5cbiAqIEByZXR1cm4geyp9IGNhbm9uaWNhbEhlYWRlcnMgYW5kIHNpZ25lZEhlYWRlcnNcbiAqL1xuQXV0aC5wcm90b3R5cGUuaGVhZGVyc0Nhbm9uaWNhbGl6YXRpb24gPSBmdW5jdGlvbiAoaGVhZGVycywgaGVhZGVyc1RvU2lnbikge1xuICAgIGlmICghaGVhZGVyc1RvU2lnbiB8fCAhaGVhZGVyc1RvU2lnbi5sZW5ndGgpIHtcbiAgICAgICAgaGVhZGVyc1RvU2lnbiA9IFtILkhPU1QsIEguQ09OVEVOVF9NRDUsIEguQ09OVEVOVF9MRU5HVEgsIEguQ09OVEVOVF9UWVBFXTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZGVyc01hcCA9IHt9O1xuICAgIHUuZWFjaChoZWFkZXJzVG9TaWduLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBoZWFkZXJzTWFwW2l0ZW0udG9Mb3dlckNhc2UoKV0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgdmFyIGNhbm9uaWNhbEhlYWRlcnMgPSBbXTtcbiAgICB1LmVhY2godS5rZXlzKGhlYWRlcnMpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGhlYWRlcnNba2V5XTtcbiAgICAgICAgdmFsdWUgPSB1LmlzU3RyaW5nKHZhbHVlKSA/IHN0cmluZ3MudHJpbSh2YWx1ZSkgOiB2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAga2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmICgvXnhcXC1iY2VcXC0vLnRlc3Qoa2V5KSB8fCBoZWFkZXJzTWFwW2tleV0gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNhbm9uaWNhbEhlYWRlcnMucHVzaCh1dGlsLmZvcm1hdCgnJXM6JXMnLFxuICAgICAgICAgICAgICAgIC8vIGVuY29kZVVSSUNvbXBvbmVudChrZXkpLCBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpKSk7XG4gICAgICAgICAgICAgICAgc3RyaW5ncy5ub3JtYWxpemUoa2V5KSwgc3RyaW5ncy5ub3JtYWxpemUodmFsdWUpKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNhbm9uaWNhbEhlYWRlcnMuc29ydCgpO1xuXG4gICAgdmFyIHNpZ25lZEhlYWRlcnMgPSBbXTtcbiAgICB1LmVhY2goY2Fub25pY2FsSGVhZGVycywgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgc2lnbmVkSGVhZGVycy5wdXNoKGl0ZW0uc3BsaXQoJzonKVswXSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gW2Nhbm9uaWNhbEhlYWRlcnMuam9pbignXFxuJyksIHNpZ25lZEhlYWRlcnNdO1xufTtcblxuQXV0aC5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uIChkYXRhLCBrZXkpIHtcbiAgICB2YXIgY3J5cHRvID0gcmVxdWlyZSg0MCk7XG4gICAgdmFyIHNoYTI1NkhtYWMgPSBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMjU2Jywga2V5KTtcbiAgICBzaGEyNTZIbWFjLnVwZGF0ZShkYXRhKTtcbiAgICByZXR1cm4gc2hhMjU2SG1hYy5kaWdlc3QoJ2hleCcpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdXRoO1xuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9iY2VfYmFzZV9jbGllbnQuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSg0MSkuRXZlbnRFbWl0dGVyO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIGNvbmZpZyA9IHJlcXVpcmUoMTgpO1xudmFyIEF1dGggPSByZXF1aXJlKDE1KTtcblxuLyoqXG4gKiBCY2VCYXNlQ2xpZW50XG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY2xpZW50Q29uZmlnIFRoZSBiY2UgY2xpZW50IGNvbmZpZ3VyYXRpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gc2VydmljZUlkIFRoZSBzZXJ2aWNlIGlkLlxuICogQHBhcmFtIHtib29sZWFuPX0gcmVnaW9uU3VwcG9ydGVkIFRoZSBzZXJ2aWNlIHN1cHBvcnRlZCByZWdpb24gb3Igbm90LlxuICovXG5mdW5jdGlvbiBCY2VCYXNlQ2xpZW50KGNsaWVudENvbmZpZywgc2VydmljZUlkLCByZWdpb25TdXBwb3J0ZWQpIHtcbiAgICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuY29uZmlnID0gdS5leHRlbmQoe30sIGNvbmZpZy5ERUZBVUxUX0NPTkZJRywgY2xpZW50Q29uZmlnKTtcbiAgICB0aGlzLnNlcnZpY2VJZCA9IHNlcnZpY2VJZDtcbiAgICB0aGlzLnJlZ2lvblN1cHBvcnRlZCA9ICEhcmVnaW9uU3VwcG9ydGVkO1xuXG4gICAgdGhpcy5jb25maWcuZW5kcG9pbnQgPSB0aGlzLl9jb21wdXRlRW5kcG9pbnQoKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtIdHRwQ2xpZW50fVxuICAgICAqL1xuICAgIHRoaXMuX2h0dHBBZ2VudCA9IG51bGw7XG59XG51dGlsLmluaGVyaXRzKEJjZUJhc2VDbGllbnQsIEV2ZW50RW1pdHRlcik7XG5cbkJjZUJhc2VDbGllbnQucHJvdG90eXBlLl9jb21wdXRlRW5kcG9pbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLmVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5lbmRwb2ludDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWdpb25TdXBwb3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHV0aWwuZm9ybWF0KCclczovLyVzLiVzLiVzJyxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnByb3RvY29sLFxuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlSWQsXG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5yZWdpb24sXG4gICAgICAgICAgICBjb25maWcuREVGQVVMVF9TRVJWSUNFX0RPTUFJTik7XG4gICAgfVxuICAgIHJldHVybiB1dGlsLmZvcm1hdCgnJXM6Ly8lcy4lcycsXG4gICAgICAgIHRoaXMuY29uZmlnLnByb3RvY29sLFxuICAgICAgICB0aGlzLnNlcnZpY2VJZCxcbiAgICAgICAgY29uZmlnLkRFRkFVTFRfU0VSVklDRV9ET01BSU4pO1xufTtcblxuQmNlQmFzZUNsaWVudC5wcm90b3R5cGUuY3JlYXRlU2lnbmF0dXJlID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzLCBodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpIHtcbiAgICByZXR1cm4gUS5mY2FsbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhdXRoID0gbmV3IEF1dGgoY3JlZGVudGlhbHMuYWssIGNyZWRlbnRpYWxzLnNrKTtcbiAgICAgICAgcmV0dXJuIGF1dGguZ2VuZXJhdGVBdXRob3JpemF0aW9uKGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycyk7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJjZUJhc2VDbGllbnQ7XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2Jvc19jbGllbnQuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuLyogZXNsaW50IG1heC1wYXJhbXM6WzAsMTBdICovXG5cbnZhciBwYXRoID0gcmVxdWlyZSg0Myk7XG52YXIgdXRpbCA9IHJlcXVpcmUoNDcpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBCdWZmZXIgPSByZXF1aXJlKDMzKTtcbnZhciBIID0gcmVxdWlyZSgxOSk7XG52YXIgc3RyaW5ncyA9IHJlcXVpcmUoMjIpO1xudmFyIEh0dHBDbGllbnQgPSByZXF1aXJlKDIwKTtcbnZhciBCY2VCYXNlQ2xpZW50ID0gcmVxdWlyZSgxNik7XG52YXIgTWltZVR5cGUgPSByZXF1aXJlKDIxKTtcblxudmFyIE1BWF9QVVRfT0JKRUNUX0xFTkdUSCA9IDUzNjg3MDkxMjA7ICAgICAvLyA1R1xudmFyIE1BWF9VU0VSX01FVEFEQVRBX1NJWkUgPSAyMDQ4OyAgICAgICAgICAvLyAyICogMTAyNFxuXG4vKipcbiAqIEJPUyBzZXJ2aWNlIGFwaVxuICpcbiAqIEBzZWUgaHR0cDovL2dvbGx1bS5iYWlkdS5jb20vQk9TX0FQSSNCT1MtQVBJ5paH5qGjXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBib3MgY2xpZW50IGNvbmZpZ3VyYXRpb24uXG4gKiBAZXh0ZW5kcyB7QmNlQmFzZUNsaWVudH1cbiAqL1xuZnVuY3Rpb24gQm9zQ2xpZW50KGNvbmZpZykge1xuICAgIEJjZUJhc2VDbGllbnQuY2FsbCh0aGlzLCBjb25maWcsICdib3MnLCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtIdHRwQ2xpZW50fVxuICAgICAqL1xuICAgIHRoaXMuX2h0dHBBZ2VudCA9IG51bGw7XG59XG51dGlsLmluaGVyaXRzKEJvc0NsaWVudCwgQmNlQmFzZUNsaWVudCk7XG5cbi8vIC0tLSBCIEUgRyBJIE4gLS0tXG5Cb3NDbGllbnQucHJvdG90eXBlLmRlbGV0ZU9iamVjdCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdERUxFVEUnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnB1dE9iamVjdCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIGRhdGEsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWtleSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdrZXkgc2hvdWxkIG5vdCBiZSBlbXB0eS4nKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKG9wdGlvbnMgfHwge30pO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BVVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGJvZHk6IGRhdGEsXG4gICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5wdXRPYmplY3RGcm9tQmxvYiA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIGJsb2IsIG9wdGlvbnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IHt9O1xuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Jsb2Ivc2l6ZVxuICAgIGhlYWRlcnNbSC5DT05URU5UX0xFTkdUSF0gPSBibG9iLnNpemU7XG4gICAgLy8g5a+55LqO5rWP6KeI5Zmo6LCD55SoQVBJ55qE5pe25YCZ77yM6buY6K6k5LiN5re75YqgIEguQ09OVEVOVF9NRDUg5a2X5q6177yM5Zug5Li66K6h566X6LW35p2l5q+U6L6D5oWiXG4gICAgLy8g6ICM5LiU5qC55o2uIEFQSSDmlofmoaPvvIzov5nkuKrlrZfmrrXkuI3mmK/lv4XloavnmoTjgIJcbiAgICBvcHRpb25zID0gdS5leHRlbmQoaGVhZGVycywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcy5wdXRPYmplY3QoYnVja2V0TmFtZSwga2V5LCBibG9iLCBvcHRpb25zKTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuZ2V0T2JqZWN0TWV0YWRhdGEgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnSEVBRCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuaW5pdGlhdGVNdWx0aXBhcnRVcGxvYWQgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB2YXIgaGVhZGVycyA9IHt9O1xuICAgIGhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gb3B0aW9uc1tILkNPTlRFTlRfVFlQRV0gfHwgTWltZVR5cGUuZ3Vlc3MocGF0aC5leHRuYW1lKGtleSkpO1xuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQT1NUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgcGFyYW1zOiB7dXBsb2FkczogJyd9LFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmFib3J0TXVsdGlwYXJ0VXBsb2FkID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgdXBsb2FkSWQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdERUxFVEUnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwYXJhbXM6IHt1cGxvYWRJZDogdXBsb2FkSWR9LFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgdXBsb2FkSWQsIHBhcnRMaXN0LCBvcHRpb25zKSB7XG4gICAgdmFyIGhlYWRlcnMgPSB7fTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04JztcbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpKTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQT1NUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe3BhcnRzOiBwYXJ0TGlzdH0pLFxuICAgICAgICBoZWFkZXJzOiBvcHRpb25zLmhlYWRlcnMsXG4gICAgICAgIHBhcmFtczoge3VwbG9hZElkOiB1cGxvYWRJZH0sXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUudXBsb2FkUGFydEZyb21CbG9iID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgdXBsb2FkSWQsIHBhcnROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0U2l6ZSwgYmxvYiwgb3B0aW9ucykge1xuICAgIGlmIChibG9iLnNpemUgIT09IHBhcnRTaXplKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IodXRpbC5mb3JtYXQoJ0ludmFsaWQgcGFydFNpemUgJWQgYW5kIGRhdGEgbGVuZ3RoICVkJyxcbiAgICAgICAgICAgIHBhcnRTaXplLCBibG9iLnNpemUpKTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZGVycyA9IHt9O1xuICAgIGhlYWRlcnNbSC5DT05URU5UX0xFTkdUSF0gPSBwYXJ0U2l6ZTtcbiAgICBoZWFkZXJzW0guQ09OVEVOVF9UWVBFXSA9ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyh1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKSk7XG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BVVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGJvZHk6IGJsb2IsXG4gICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBwYXJ0TnVtYmVyOiBwYXJ0TnVtYmVyLFxuICAgICAgICAgICAgdXBsb2FkSWQ6IHVwbG9hZElkXG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUubGlzdFBhcnRzID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgdXBsb2FkSWQsIG9wdGlvbnMpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlKi9cbiAgICBpZiAoIXVwbG9hZElkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VwbG9hZElkIHNob3VsZCBub3QgZW1wdHknKTtcbiAgICB9XG4gICAgLyplc2xpbnQtZW5hYmxlKi9cblxuICAgIHZhciBhbGxvd2VkUGFyYW1zID0gWydtYXhQYXJ0cycsICdwYXJ0TnVtYmVyTWFya2VyJywgJ3VwbG9hZElkJ107XG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9LCBhbGxvd2VkUGFyYW1zKTtcbiAgICBvcHRpb25zLnBhcmFtcy51cGxvYWRJZCA9IHVwbG9hZElkO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0dFVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHBhcmFtczogb3B0aW9ucy5wYXJhbXMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUubGlzdE11bHRpcGFydFVwbG9hZHMgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBhbGxvd2VkUGFyYW1zID0gWydkZWxpbWl0ZXInLCAnbWF4VXBsb2FkcycsICdrZXlNYXJrZXInLCAncHJlZml4JywgJ3VwbG9hZHMnXTtcblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSwgYWxsb3dlZFBhcmFtcyk7XG4gICAgb3B0aW9ucy5wYXJhbXMudXBsb2FkcyA9ICcnO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0dFVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAgcGFyYW1zOiBvcHRpb25zLnBhcmFtcyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5hcHBlbmRPYmplY3QgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBkYXRhLCBvZmZzZXQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIWtleSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdrZXkgc2hvdWxkIG5vdCBiZSBlbXB0eS4nKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKG9wdGlvbnMgfHwge30pO1xuICAgIHZhciBwYXJhbXMgPSB7YXBwZW5kOiAnJ307XG4gICAgaWYgKHUuaXNOdW1iZXIob2Zmc2V0KSkge1xuICAgICAgICBwYXJhbXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUE9TVCcsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGJvZHk6IGRhdGEsXG4gICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuYXBwZW5kT2JqZWN0RnJvbUJsb2IgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCBibG9iLCBvZmZzZXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IHt9O1xuXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Jsb2Ivc2l6ZVxuICAgIGhlYWRlcnNbSC5DT05URU5UX0xFTkdUSF0gPSBibG9iLnNpemU7XG4gICAgLy8g5a+55LqO5rWP6KeI5Zmo6LCD55SoQVBJ55qE5pe25YCZ77yM6buY6K6k5LiN5re75YqgIEguQ09OVEVOVF9NRDUg5a2X5q6177yM5Zug5Li66K6h566X6LW35p2l5q+U6L6D5oWiXG4gICAgLy8g6ICM5LiU5qC55o2uIEFQSSDmlofmoaPvvIzov5nkuKrlrZfmrrXkuI3mmK/lv4XloavnmoTjgIJcbiAgICBvcHRpb25zID0gdS5leHRlbmQoaGVhZGVycywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcy5hcHBlbmRPYmplY3QoYnVja2V0TmFtZSwga2V5LCBibG9iLCBvZmZzZXQsIG9wdGlvbnMpO1xufTtcblxuLy8gLS0tIEUgTiBEIC0tLVxuXG5Cb3NDbGllbnQucHJvdG90eXBlLnNlbmRSZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHZhckFyZ3MpIHtcbiAgICB2YXIgZGVmYXVsdEFyZ3MgPSB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IG51bGwsXG4gICAgICAgIGtleTogbnVsbCxcbiAgICAgICAgYm9keTogbnVsbCxcbiAgICAgICAgaGVhZGVyczoge30sXG4gICAgICAgIHBhcmFtczoge30sXG4gICAgICAgIGNvbmZpZzoge30sXG4gICAgICAgIG91dHB1dFN0cmVhbTogbnVsbFxuICAgIH07XG4gICAgdmFyIGFyZ3MgPSB1LmV4dGVuZChkZWZhdWx0QXJncywgdmFyQXJncyk7XG5cbiAgICB2YXIgY29uZmlnID0gdS5leHRlbmQoe30sIHRoaXMuY29uZmlnLCBhcmdzLmNvbmZpZyk7XG4gICAgdmFyIHJlc291cmNlID0gW1xuICAgICAgICAnL3YxJyxcbiAgICAgICAgc3RyaW5ncy5ub3JtYWxpemUoYXJncy5idWNrZXROYW1lIHx8ICcnKSxcbiAgICAgICAgc3RyaW5ncy5ub3JtYWxpemUoYXJncy5rZXkgfHwgJycsIGZhbHNlKVxuICAgIF0uam9pbignLycpO1xuXG4gICAgaWYgKGNvbmZpZy5zZXNzaW9uVG9rZW4pIHtcbiAgICAgICAgYXJncy5oZWFkZXJzW0guU0VTU0lPTl9UT0tFTl0gPSBjb25maWcuc2Vzc2lvblRva2VuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlbmRIVFRQUmVxdWVzdChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncywgY29uZmlnKTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuc2VuZEhUVFBSZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLCBjb25maWcpIHtcbiAgICB2YXIgY2xpZW50ID0gdGhpcztcbiAgICB2YXIgYWdlbnQgPSB0aGlzLl9odHRwQWdlbnQgPSBuZXcgSHR0cENsaWVudChjb25maWcpO1xuXG4gICAgdmFyIGh0dHBDb250ZXh0ID0ge1xuICAgICAgICBodHRwTWV0aG9kOiBodHRwTWV0aG9kLFxuICAgICAgICByZXNvdXJjZTogcmVzb3VyY2UsXG4gICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgIGNvbmZpZzogY29uZmlnXG4gICAgfTtcbiAgICB1LmVhY2goWydwcm9ncmVzcycsICdlcnJvcicsICdhYm9ydCddLCBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgICAgIGFnZW50Lm9uKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgY2xpZW50LmVtaXQoZXZlbnROYW1lLCBldnQsIGh0dHBDb250ZXh0KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IHRoaXMuX2h0dHBBZ2VudC5zZW5kUmVxdWVzdChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncy5ib2R5LFxuICAgICAgICBhcmdzLmhlYWRlcnMsIGFyZ3MucGFyYW1zLCB1LmJpbmQodGhpcy5jcmVhdGVTaWduYXR1cmUsIHRoaXMpLFxuICAgICAgICBhcmdzLm91dHB1dFN0cmVhbVxuICAgICk7XG5cbiAgICBwcm9taXNlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoYWdlbnQuX3JlcSAmJiBhZ2VudC5fcmVxLnhocikge1xuICAgICAgICAgICAgdmFyIHhociA9IGFnZW50Ll9yZXEueGhyO1xuICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLl9jaGVja09wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucywgYWxsb3dlZFBhcmFtcykge1xuICAgIHZhciBydiA9IHt9O1xuXG4gICAgcnYuY29uZmlnID0gb3B0aW9ucy5jb25maWcgfHwge307XG4gICAgcnYuaGVhZGVycyA9IHRoaXMuX3ByZXBhcmVPYmplY3RIZWFkZXJzKG9wdGlvbnMpO1xuICAgIHJ2LnBhcmFtcyA9IHUucGljayhvcHRpb25zLCBhbGxvd2VkUGFyYW1zIHx8IFtdKTtcblxuICAgIHJldHVybiBydjtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuX3ByZXBhcmVPYmplY3RIZWFkZXJzID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgYWxsb3dlZEhlYWRlcnMgPSB7fTtcbiAgICB1LmVhY2goW1xuICAgICAgICBILkNPTlRFTlRfTEVOR1RILFxuICAgICAgICBILkNPTlRFTlRfRU5DT0RJTkcsXG4gICAgICAgIEguQ09OVEVOVF9NRDUsXG4gICAgICAgIEguWF9CQ0VfQ09OVEVOVF9TSEEyNTYsXG4gICAgICAgIEguQ09OVEVOVF9UWVBFLFxuICAgICAgICBILkNPTlRFTlRfRElTUE9TSVRJT04sXG4gICAgICAgIEguRVRBRyxcbiAgICAgICAgSC5TRVNTSU9OX1RPS0VOLFxuICAgICAgICBILkNBQ0hFX0NPTlRST0wsXG4gICAgICAgIEguRVhQSVJFUyxcbiAgICAgICAgSC5YX0JDRV9PQkpFQ1RfQUNMLFxuICAgICAgICBILlhfQkNFX09CSkVDVF9HUkFOVF9SRUFEXG4gICAgXSwgZnVuY3Rpb24gKGhlYWRlcikge1xuICAgICAgICBhbGxvd2VkSGVhZGVyc1toZWFkZXJdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHZhciBtZXRhU2l6ZSA9IDA7XG4gICAgdmFyIGhlYWRlcnMgPSB1LnBpY2sob3B0aW9ucywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKGFsbG93ZWRIZWFkZXJzW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKC9eeFxcLWJjZVxcLW1ldGFcXC0vLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgbWV0YVNpemUgKz0gQnVmZmVyLmJ5dGVMZW5ndGgoa2V5KSArIEJ1ZmZlci5ieXRlTGVuZ3RoKCcnICsgdmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChtZXRhU2l6ZSA+IE1BWF9VU0VSX01FVEFEQVRBX1NJWkUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTWV0YWRhdGEgc2l6ZSBzaG91bGQgbm90IGJlIGdyZWF0ZXIgdGhhbiAnICsgTUFYX1VTRVJfTUVUQURBVEFfU0laRSArICcuJyk7XG4gICAgfVxuXG4gICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoSC5DT05URU5UX0xFTkdUSCkpIHtcbiAgICAgICAgdmFyIGNvbnRlbnRMZW5ndGggPSBoZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdO1xuICAgICAgICBpZiAoY29udGVudExlbmd0aCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbnRlbnRfbGVuZ3RoIHNob3VsZCBub3QgYmUgbmVnYXRpdmUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29udGVudExlbmd0aCA+IE1BWF9QVVRfT0JKRUNUX0xFTkdUSCkgeyAvLyA1R1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0IGxlbmd0aCBzaG91bGQgYmUgbGVzcyB0aGFuICcgKyBNQVhfUFVUX09CSkVDVF9MRU5HVEhcbiAgICAgICAgICAgICAgICArICcuIFVzZSBtdWx0aS1wYXJ0IHVwbG9hZCBpbnN0ZWFkLicpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoJ0VUYWcnKSkge1xuICAgICAgICB2YXIgZXRhZyA9IGhlYWRlcnMuRVRhZztcbiAgICAgICAgaWYgKCEvXlwiLy50ZXN0KGV0YWcpKSB7XG4gICAgICAgICAgICBoZWFkZXJzLkVUYWcgPSB1dGlsLmZvcm1hdCgnXCIlc1wiJywgZXRhZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWhlYWRlcnMuaGFzT3duUHJvcGVydHkoSC5DT05URU5UX1RZUEUpKSB7XG4gICAgICAgIGhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlYWRlcnM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJvc0NsaWVudDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2NvbmZpZy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbmV4cG9ydHMuREVGQVVMVF9TRVJWSUNFX0RPTUFJTiA9ICdiYWlkdWJjZS5jb20nO1xuXG5leHBvcnRzLkRFRkFVTFRfQ09ORklHID0ge1xuICAgIHByb3RvY29sOiAnaHR0cCcsXG4gICAgcmVnaW9uOiAnYmonXG59O1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9oZWFkZXJzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxuZXhwb3J0cy5DT05URU5UX1RZUEUgPSAnQ29udGVudC1UeXBlJztcbmV4cG9ydHMuQ09OVEVOVF9MRU5HVEggPSAnQ29udGVudC1MZW5ndGgnO1xuZXhwb3J0cy5DT05URU5UX01ENSA9ICdDb250ZW50LU1ENSc7XG5leHBvcnRzLkNPTlRFTlRfRU5DT0RJTkcgPSAnQ29udGVudC1FbmNvZGluZyc7XG5leHBvcnRzLkNPTlRFTlRfRElTUE9TSVRJT04gPSAnQ29udGVudC1EaXNwb3NpdGlvbic7XG5leHBvcnRzLkVUQUcgPSAnRVRhZyc7XG5leHBvcnRzLkNPTk5FQ1RJT04gPSAnQ29ubmVjdGlvbic7XG5leHBvcnRzLkhPU1QgPSAnSG9zdCc7XG5leHBvcnRzLlVTRVJfQUdFTlQgPSAnVXNlci1BZ2VudCc7XG5leHBvcnRzLkNBQ0hFX0NPTlRST0wgPSAnQ2FjaGUtQ29udHJvbCc7XG5leHBvcnRzLkVYUElSRVMgPSAnRXhwaXJlcyc7XG5cbmV4cG9ydHMuQVVUSE9SSVpBVElPTiA9ICdBdXRob3JpemF0aW9uJztcbmV4cG9ydHMuWF9CQ0VfREFURSA9ICd4LWJjZS1kYXRlJztcbmV4cG9ydHMuWF9CQ0VfQUNMID0gJ3gtYmNlLWFjbCc7XG5leHBvcnRzLlhfQkNFX1JFUVVFU1RfSUQgPSAneC1iY2UtcmVxdWVzdC1pZCc7XG5leHBvcnRzLlhfQkNFX0NPTlRFTlRfU0hBMjU2ID0gJ3gtYmNlLWNvbnRlbnQtc2hhMjU2JztcbmV4cG9ydHMuWF9CQ0VfT0JKRUNUX0FDTCA9ICd4LWJjZS1vYmplY3QtYWNsJztcbmV4cG9ydHMuWF9CQ0VfT0JKRUNUX0dSQU5UX1JFQUQgPSAneC1iY2Utb2JqZWN0LWdyYW50LXJlYWQnO1xuXG5leHBvcnRzLlhfSFRUUF9IRUFERVJTID0gJ2h0dHBfaGVhZGVycyc7XG5leHBvcnRzLlhfQk9EWSA9ICdib2R5JztcbmV4cG9ydHMuWF9TVEFUVVNfQ09ERSA9ICdzdGF0dXNfY29kZSc7XG5leHBvcnRzLlhfTUVTU0FHRSA9ICdtZXNzYWdlJztcbmV4cG9ydHMuWF9DT0RFID0gJ2NvZGUnO1xuZXhwb3J0cy5YX1JFUVVFU1RfSUQgPSAncmVxdWVzdF9pZCc7XG5cbmV4cG9ydHMuU0VTU0lPTl9UT0tFTiA9ICd4LWJjZS1zZWN1cml0eS10b2tlbic7XG5cbmV4cG9ydHMuWF9WT0RfTUVESUFfVElUTEUgPSAneC12b2QtbWVkaWEtdGl0bGUnO1xuZXhwb3J0cy5YX1ZPRF9NRURJQV9ERVNDUklQVElPTiA9ICd4LXZvZC1tZWRpYS1kZXNjcmlwdGlvbic7XG5leHBvcnRzLkFDQ0VQVF9FTkNPRElORyA9ICdhY2NlcHQtZW5jb2RpbmcnO1xuZXhwb3J0cy5BQ0NFUFQgPSAnYWNjZXB0JztcblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9odHRwX2NsaWVudC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG4vKiBlc2xpbnQgbWF4LXBhcmFtczpbMCwxMF0gKi9cbi8qIGdsb2JhbHMgQXJyYXlCdWZmZXIgKi9cblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoNDEpLkV2ZW50RW1pdHRlcjtcbnZhciBCdWZmZXIgPSByZXF1aXJlKDMzKTtcbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgaGVscGVyID0gcmVxdWlyZSg0Mik7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIHV0aWwgPSByZXF1aXJlKDQ3KTtcbnZhciBIID0gcmVxdWlyZSgxOSk7XG5cbi8qKlxuICogVGhlIEh0dHBDbGllbnRcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGh0dHAgY2xpZW50IGNvbmZpZ3VyYXRpb24uXG4gKi9cbmZ1bmN0aW9uIEh0dHBDbGllbnQoY29uZmlnKSB7XG4gICAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcblxuICAgIC8qKlxuICAgICAqIGh0dHAocykgcmVxdWVzdCBvYmplY3RcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX3JlcSA9IG51bGw7XG59XG51dGlsLmluaGVyaXRzKEh0dHBDbGllbnQsIEV2ZW50RW1pdHRlcik7XG5cbi8qKlxuICogU2VuZCBIdHRwIFJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHR0cE1ldGhvZCBHRVQsUE9TVCxQVVQsREVMRVRFLEhFQURcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBodHRwIHJlcXVlc3QgcGF0aC5cbiAqIEBwYXJhbSB7KHN0cmluZ3xCdWZmZXJ8c3RyZWFtLlJlYWRhYmxlKT19IGJvZHkgVGhlIHJlcXVlc3QgYm9keS4gSWYgYGJvZHlgIGlzIGFcbiAqIHN0cmVhbSwgYENvbnRlbnQtTGVuZ3RoYCBtdXN0IGJlIHNldCBleHBsaWNpdGx5LlxuICogQHBhcmFtIHtPYmplY3Q9fSBoZWFkZXJzIFRoZSBodHRwIHJlcXVlc3QgaGVhZGVycy5cbiAqIEBwYXJhbSB7T2JqZWN0PX0gcGFyYW1zIFRoZSBxdWVyeXN0cmluZ3MgaW4gdXJsLlxuICogQHBhcmFtIHtmdW5jdGlvbigpOnN0cmluZz19IHNpZ25GdW5jdGlvbiBUaGUgYEF1dGhvcml6YXRpb25gIHNpZ25hdHVyZSBmdW5jdGlvblxuICogQHBhcmFtIHtzdHJlYW0uV3JpdGFibGU9fSBvdXRwdXRTdHJlYW0gVGhlIGh0dHAgcmVzcG9uc2UgYm9keS5cbiAqIEBwYXJhbSB7bnVtYmVyPX0gcmV0cnkgVGhlIG1heGltdW0gbnVtYmVyIG9mIG5ldHdvcmsgY29ubmVjdGlvbiBhdHRlbXB0cy5cbiAqXG4gKiBAcmVzb2x2ZSB7e2h0dHBfaGVhZGVyczpPYmplY3QsYm9keTpPYmplY3R9fVxuICogQHJlamVjdCB7T2JqZWN0fVxuICpcbiAqIEByZXR1cm4ge1EuZGVmZXJ9XG4gKi9cbkh0dHBDbGllbnQucHJvdG90eXBlLnNlbmRSZXF1ZXN0ID0gZnVuY3Rpb24gKGh0dHBNZXRob2QsIHBhdGgsIGJvZHksIGhlYWRlcnMsIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25GdW5jdGlvbiwgb3V0cHV0U3RyZWFtKSB7XG5cbiAgICB2YXIgcmVxdWVzdFVybCA9IHRoaXMuX2dldFJlcXVlc3RVcmwocGF0aCwgcGFyYW1zKTtcblxuICAgIHZhciBkZWZhdWx0SGVhZGVycyA9IHt9O1xuICAgIGRlZmF1bHRIZWFkZXJzW0guWF9CQ0VfREFURV0gPSBoZWxwZXIudG9VVENTdHJpbmcobmV3IERhdGUoKSk7XG4gICAgZGVmYXVsdEhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnO1xuICAgIGRlZmF1bHRIZWFkZXJzW0guSE9TVF0gPSAvXlxcdys6XFwvXFwvKFteXFwvXSspLy5leGVjKHRoaXMuY29uZmlnLmVuZHBvaW50KVsxXTtcblxuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IHUuZXh0ZW5kKGRlZmF1bHRIZWFkZXJzLCBoZWFkZXJzKTtcblxuICAgIC8vIENoZWNrIHRoZSBjb250ZW50LWxlbmd0aFxuICAgIGlmICghcmVxdWVzdEhlYWRlcnMuaGFzT3duUHJvcGVydHkoSC5DT05URU5UX0xFTkdUSCkpIHtcbiAgICAgICAgdmFyIGNvbnRlbnRMZW5ndGggPSB0aGlzLl9ndWVzc0NvbnRlbnRMZW5ndGgoYm9keSk7XG4gICAgICAgIGlmICghKGNvbnRlbnRMZW5ndGggPT09IDAgJiYgL0dFVHxIRUFEL2kudGVzdChodHRwTWV0aG9kKSkpIHtcbiAgICAgICAgICAgIC8vIOWmguaenOaYryBHRVQg5oiWIEhFQUQg6K+35rGC77yM5bm25LiUIENvbnRlbnQtTGVuZ3RoIOaYryAw77yM6YKj5LmIIFJlcXVlc3QgSGVhZGVyIOmHjOmdouWwseS4jeimgeWHuueOsCBDb250ZW50LUxlbmd0aFxuICAgICAgICAgICAgLy8g5ZCm5YiZ5pys5Zyw6K6h566X562+5ZCN55qE5pe25YCZ5Lya6K6h566X6L+b5Y6777yM5L2G5piv5rWP6KeI5Zmo5Y+R6K+35rGC55qE5pe25YCZ5LiN5LiA5a6a5Lya5pyJ77yM5q2k5pe25a+86Ie0IFNpZ25hdHVyZSBNaXNtYXRjaCDnmoTmg4XlhrVcbiAgICAgICAgICAgIHJlcXVlc3RIZWFkZXJzW0guQ09OVEVOVF9MRU5HVEhdID0gY29udGVudExlbmd0aDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgY3JlYXRlU2lnbmF0dXJlID0gc2lnbkZ1bmN0aW9uIHx8IHUubm9vcDtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKGNyZWF0ZVNpZ25hdHVyZSh0aGlzLmNvbmZpZy5jcmVkZW50aWFscywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCByZXF1ZXN0SGVhZGVycykpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYXV0aG9yaXphdGlvbiwgeGJjZURhdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SGVhZGVyc1tILkFVVEhPUklaQVRJT05dID0gYXV0aG9yaXphdGlvbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoeGJjZURhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEhlYWRlcnNbSC5YX0JDRV9EQVRFXSA9IHhiY2VEYXRlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLl9kb1JlcXVlc3QoaHR0cE1ldGhvZCwgcmVxdWVzdFVybCxcbiAgICAgICAgICAgICAgICAgICAgdS5vbWl0KHJlcXVlc3RIZWFkZXJzLCBILkNPTlRFTlRfTEVOR1RILCBILkhPU1QpLFxuICAgICAgICAgICAgICAgICAgICBib2R5LCBvdXRwdXRTdHJlYW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgICByZXR1cm4gUS5yZWplY3QoZXgpO1xuICAgIH1cbn07XG5cbkh0dHBDbGllbnQucHJvdG90eXBlLl9kb1JlcXVlc3QgPSBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcmVxdWVzdFVybCwgcmVxdWVzdEhlYWRlcnMsIGJvZHksIG91dHB1dFN0cmVhbSkge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oaHR0cE1ldGhvZCwgcmVxdWVzdFVybCwgdHJ1ZSk7XG4gICAgZm9yICh2YXIgaGVhZGVyIGluIHJlcXVlc3RIZWFkZXJzKSB7XG4gICAgICAgIGlmIChyZXF1ZXN0SGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoZWFkZXIpKSB7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSByZXF1ZXN0SGVhZGVyc1toZWFkZXJdO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICB9O1xuICAgIHhoci5vbmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCd4aHIgYWJvcnRlZCcpKTtcbiAgICB9O1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAxMjIzKSB7XG4gICAgICAgICAgICAgICAgLy8gSUUgLSAjMTQ1MDogc29tZXRpbWVzIHJldHVybnMgMTIyMyB3aGVuIGl0IHNob3VsZCBiZSAyMDRcbiAgICAgICAgICAgICAgICBzdGF0dXMgPSAyMDQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb250ZW50VHlwZSA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignQ29udGVudC1UeXBlJyk7XG4gICAgICAgICAgICB2YXIgaXNKU09OID0gL2FwcGxpY2F0aW9uXFwvanNvbi8udGVzdChjb250ZW50VHlwZSk7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2VCb2R5ID0gaXNKU09OID8gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSA6IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlQm9keSkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlQm9keSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXNTdWNjZXNzID0gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDAgfHwgc3RhdHVzID09PSAzMDQ7XG4gICAgICAgICAgICBpZiAoaXNTdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBzZWxmLl9maXhIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogcmVzcG9uc2VCb2R5XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfY29kZTogc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXNwb25zZUJvZHkubWVzc2FnZSB8fCAnPG1lc3NhZ2U+JyxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogcmVzcG9uc2VCb2R5LmNvZGUgfHwgJzxjb2RlPicsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RfaWQ6IHJlc3BvbnNlQm9keS5yZXF1ZXN0SWQgfHwgJzxyZXF1ZXN0X2lkPidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgdS5lYWNoKFsncHJvZ3Jlc3MnLCAnZXJyb3InLCAnYWJvcnQnXSwgZnVuY3Rpb24gKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgeGhyLnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi5lbWl0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZW1pdChldmVudE5hbWUsIGV2dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgeGhyLnNlbmQoYm9keSk7XG5cbiAgICBzZWxmLl9yZXEgPSB7eGhyOiB4aHJ9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZ3Vlc3NDb250ZW50TGVuZ3RoID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PSBudWxsIHx8IGRhdGEgPT09ICcnKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBlbHNlIGlmICh1LmlzU3RyaW5nKGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnICYmIGRhdGEgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnNpemU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBkYXRhLmJ5dGVMZW5ndGg7XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdObyBDb250ZW50LUxlbmd0aCBpcyBzcGVjaWZpZWQuJyk7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZml4SGVhZGVycyA9IGZ1bmN0aW9uIChoZWFkZXJzKSB7XG4gICAgdmFyIGZpeGVkSGVhZGVycyA9IHt9O1xuXG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgICAgdS5lYWNoKGhlYWRlcnMuc3BsaXQoL1xccj9cXG4vKSwgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSBsaW5lLmluZGV4T2YoJzonKTtcbiAgICAgICAgICAgIGlmIChpZHggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IGxpbmUuc3Vic3RyaW5nKDAsIGlkeCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBsaW5lLnN1YnN0cmluZyhpZHggKyAxKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC8sICcnKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnZXRhZycpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cIi9nLCAnJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZpeGVkSGVhZGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmaXhlZEhlYWRlcnM7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5idWlsZFF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciB1cmxFbmNvZGVTdHIgPSByZXF1aXJlKDQ1KS5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICAvLyBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9QZXJjZW50LWVuY29kaW5nXG4gICAgcmV0dXJuIHVybEVuY29kZVN0ci5yZXBsYWNlKC9bKCknIX4uKlxcLV9dL2csIGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgICAgIHJldHVybiAnJScgKyBjaGFyLmNoYXJDb2RlQXQoKS50b1N0cmluZygxNik7XG4gICAgfSk7XG59O1xuXG5IdHRwQ2xpZW50LnByb3RvdHlwZS5fZ2V0UmVxdWVzdFVybCA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMpIHtcbiAgICB2YXIgdXJpID0gcGF0aDtcbiAgICB2YXIgcXMgPSB0aGlzLmJ1aWxkUXVlcnlTdHJpbmcocGFyYW1zKTtcbiAgICBpZiAocXMpIHtcbiAgICAgICAgdXJpICs9ICc/JyArIHFzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5lbmRwb2ludCArIHVyaTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSHR0cENsaWVudDtcblxuIiwiLyoqXG4gKiBAZmlsZSBzcmMvbWltZS50eXBlcy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbnZhciBtaW1lVHlwZXMgPSB7XG59O1xuXG5leHBvcnRzLmd1ZXNzID0gZnVuY3Rpb24gKGV4dCkge1xuICAgIGlmICghZXh0IHx8ICFleHQubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgICB9XG4gICAgaWYgKGV4dFswXSA9PT0gJy4nKSB7XG4gICAgICAgIGV4dCA9IGV4dC5zdWJzdHIoMSk7XG4gICAgfVxuICAgIHJldHVybiBtaW1lVHlwZXNbZXh0LnRvTG93ZXJDYXNlKCldIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3RyaW5ncy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIGtFc2NhcGVkTWFwID0ge1xuICAgICchJzogJyUyMScsXG4gICAgJ1xcJyc6ICclMjcnLFxuICAgICcoJzogJyUyOCcsXG4gICAgJyknOiAnJTI5JyxcbiAgICAnKic6ICclMkEnXG59O1xuXG5leHBvcnRzLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIGVuY29kaW5nU2xhc2gpIHtcbiAgICB2YXIgcmVzdWx0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZyk7XG4gICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoL1shJ1xcKFxcKVxcKl0vZywgZnVuY3Rpb24gKCQxKSB7XG4gICAgICAgIHJldHVybiBrRXNjYXBlZE1hcFskMV07XG4gICAgfSk7XG5cbiAgICBpZiAoZW5jb2RpbmdTbGFzaCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnJlcGxhY2UoLyUyRi9naSwgJy8nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0cy50cmltID0gZnVuY3Rpb24gKHN0cmluZykge1xuICAgIHJldHVybiAoc3RyaW5nIHx8ICcnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59O1xuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIGNvbmZpZy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuXG52YXIga0RlZmF1bHRPcHRpb25zID0ge1xuICAgIHJ1bnRpbWVzOiAnaHRtbDUnLFxuXG4gICAgLy8gYm9z5pyN5Yqh5Zmo55qE5Zyw5Z2A77yM6buY6K6kKGh0dHA6Ly9iai5iY2Vib3MuY29tKVxuICAgIGJvc19lbmRwb2ludDogJ2h0dHA6Ly9iai5iY2Vib3MuY29tJyxcblxuICAgIC8vIOm7mOiupOeahCBhayDlkowgc2sg6YWN572uXG4gICAgYm9zX2FrOiBudWxsLFxuICAgIGJvc19zazogbnVsbCxcbiAgICBib3NfY3JlZGVudGlhbHM6IG51bGwsXG5cbiAgICAvLyDlpoLmnpzliIfmjaLliLAgYXBwZW5kYWJsZSDmqKHlvI/vvIzmnIDlpKflj6rmlK/mjIEgNUcg55qE5paH5Lu2XG4gICAgLy8g5LiN5YaN5pSv5oyBIE11bHRpcGFydCDnmoTmlrnlvI/kuIrkvKDmlofku7ZcbiAgICBib3NfYXBwZW5kYWJsZTogZmFsc2UsXG5cbiAgICAvLyDkuLrkuoblpITnkIYgRmxhc2gg5LiN6IO95Y+R6YCBIEhFQUQsIERFTEVURSDkuYvnsbvnmoTor7fmsYLvvIzku6Xlj4rml6Dms5VcbiAgICAvLyDojrflj5YgcmVzcG9uc2UgaGVhZGVycyDnmoTpl67popjvvIzpnIDopoHmkJ7kuIDkuKogcmVsYXkg5pyN5Yqh5Zmo77yM5oqK5pWw5o2uXG4gICAgLy8g5qC85byP6L2s5YyW5LiA5LiLXG4gICAgYm9zX3JlbGF5X3NlcnZlcjogJ2h0dHBzOi8vcmVsYXkuZWZlLnRlY2gnLFxuXG4gICAgLy8g5piv5ZCm5pSv5oyB5aSa6YCJ77yM6buY6K6kKGZhbHNlKVxuICAgIG11bHRpX3NlbGVjdGlvbjogZmFsc2UsXG5cbiAgICAvLyDlpLHotKXkuYvlkI7ph43or5XnmoTmrKHmlbAo5Y2V5Liq5paH5Lu25oiW6ICF5YiG54mHKe+8jOm7mOiupCgwKe+8jOS4jemHjeivlVxuICAgIG1heF9yZXRyaWVzOiAwLFxuXG4gICAgLy8g5aSx6LSl6YeN6K+V55qE6Ze06ZqU5pe26Ze077yM6buY6K6kIDEwMDBtc1xuICAgIHJldHJ5X2ludGVydmFsOiAxMDAwLFxuXG4gICAgLy8g5piv5ZCm6Ieq5Yqo5LiK5Lyg77yM6buY6K6kKGZhbHNlKVxuICAgIGF1dG9fc3RhcnQ6IGZhbHNlLFxuXG4gICAgLy8g5pyA5aSn5Y+v5Lul6YCJ5oup55qE5paH5Lu25aSn5bCP77yM6buY6K6kKDEwME0pXG4gICAgbWF4X2ZpbGVfc2l6ZTogJzEwMG1iJyxcblxuICAgIC8vIOi2hei/h+i/meS4quaWh+S7tuWkp+Wwj+S5i+WQju+8jOW8gOWni+S9v+eUqOWIhueJh+S4iuS8oO+8jOm7mOiupCgxME0pXG4gICAgYm9zX211bHRpcGFydF9taW5fc2l6ZTogJzEwbWInLFxuXG4gICAgLy8g5YiG54mH5LiK5Lyg55qE5pe25YCZ77yM5bm26KGM5LiK5Lyg55qE5Liq5pWw77yM6buY6K6kKDEpXG4gICAgYm9zX211bHRpcGFydF9wYXJhbGxlbDogMSxcblxuICAgIC8vIOmYn+WIl+S4reeahOaWh+S7tu+8jOW5tuihjOS4iuS8oOeahOS4quaVsO+8jOm7mOiupCgzKVxuICAgIGJvc190YXNrX3BhcmFsbGVsOiAzLFxuXG4gICAgLy8g6K6h566X562+5ZCN55qE5pe25YCZ77yM5pyJ5LqbIGhlYWRlciDpnIDopoHliZTpmaTvvIzlh4/lsJHkvKDovpPnmoTkvZPnp69cbiAgICBhdXRoX3N0cmlwcGVkX2hlYWRlcnM6IFsnVXNlci1BZ2VudCcsICdDb25uZWN0aW9uJ10sXG5cbiAgICAvLyDliIbniYfkuIrkvKDnmoTml7blgJnvvIzmr4/kuKrliIbniYfnmoTlpKflsI/vvIzpu5jorqQoNE0pXG4gICAgY2h1bmtfc2l6ZTogJzRtYicsXG5cbiAgICAvLyDliIblnZfkuIrkvKDml7Ys5piv5ZCm5YWB6K645pat54K557ut5Lyg77yM6buY6K6kKHRydWUpXG4gICAgYm9zX211bHRpcGFydF9hdXRvX2NvbnRpbnVlOiB0cnVlLFxuXG4gICAgLy8g5YiG5byA5LiK5Lyg55qE5pe25YCZ77yMbG9jYWxTdG9yYWdl6YeM6Z2ia2V555qE55Sf5oiQ5pa55byP77yM6buY6K6k5pivIGBkZWZhdWx0YFxuICAgIC8vIOWmguaenOmcgOimgeiHquWumuS5ie+8jOWPr+S7pemAmui/hyBYWFhcbiAgICBib3NfbXVsdGlwYXJ0X2xvY2FsX2tleV9nZW5lcmF0b3I6ICdkZWZhdWx0JyxcblxuICAgIC8vIOaYr+WQpuWFgeiuuOmAieaLqeebruW9lVxuICAgIGRpcl9zZWxlY3Rpb246IGZhbHNlLFxuXG4gICAgLy8g5piv5ZCm6ZyA6KaB5q+P5qyh6YO95Y675pyN5Yqh5Zmo6K6h566X562+5ZCNXG4gICAgZ2V0X25ld191cHRva2VuOiB0cnVlLFxuXG4gICAgLy8g5Zug5Li65L2/55SoIEZvcm0gUG9zdCDnmoTmoLzlvI/vvIzmsqHmnInorr7nva7pop3lpJbnmoQgSGVhZGVy77yM5LuO6ICM5Y+v5Lul5L+d6K+BXG4gICAgLy8g5L2/55SoIEZsYXNoIOS5n+iDveS4iuS8oOWkp+aWh+S7tlxuICAgIC8vIOS9jueJiOacrOa1j+iniOWZqOS4iuS8oOaWh+S7tueahOaXtuWAme+8jOmcgOimgeiuvue9riBwb2xpY3nvvIzpu5jorqTmg4XlhrXkuItcbiAgICAvLyBwb2xpY3nnmoTlhoXlrrnlj6rpnIDopoHljIXlkKsgZXhwaXJhdGlvbiDlkowgY29uZGl0aW9ucyDljbPlj69cbiAgICAvLyBwb2xpY3k6IHtcbiAgICAvLyAgIGV4cGlyYXRpb246ICd4eCcsXG4gICAgLy8gICBjb25kaXRpb25zOiBbXG4gICAgLy8gICAgIHtidWNrZXQ6ICd0aGUtYnVja2V0LW5hbWUnfVxuICAgIC8vICAgXVxuICAgIC8vIH1cbiAgICAvLyBib3NfcG9saWN5OiBudWxsLFxuXG4gICAgLy8g5L2O54mI5pys5rWP6KeI5Zmo5LiK5Lyg5paH5Lu255qE5pe25YCZ77yM6ZyA6KaB6K6+572uIHBvbGljeV9zaWduYXR1cmVcbiAgICAvLyDlpoLmnpzmsqHmnInorr7nva4gYm9zX3BvbGljeV9zaWduYXR1cmUg55qE6K+d77yM5Lya6YCa6L+HIHVwdG9rZW5fdXJsIOadpeivt+axglxuICAgIC8vIOm7mOiupOWPquS8muivt+axguS4gOasoe+8jOWmguaenOWkseaViOS6hu+8jOmcgOimgeaJi+WKqOadpemHjee9riBwb2xpY3lfc2lnbmF0dXJlXG4gICAgLy8gYm9zX3BvbGljeV9zaWduYXR1cmU6IG51bGwsXG5cbiAgICAvLyBKU09OUCDpu5jorqTnmoTotoXml7bml7bpl7QoNTAwMG1zKVxuICAgIHVwdG9rZW5fdmlhX2pzb25wOiB0cnVlLFxuICAgIHVwdG9rZW5fdGltZW91dDogNTAwMCxcbiAgICB1cHRva2VuX2pzb25wX3RpbWVvdXQ6IDUwMDAsICAgIC8vIOS4jeaUr+aMgeS6hu+8jOWQjue7reW7uuiurueUqCB1cHRva2VuX3RpbWVvdXRcblxuICAgIC8vIOaYr+WQpuimgeemgeeUqOe7n+iuoe+8jOm7mOiupOS4jeemgeeUqFxuICAgIC8vIOWmguaenOmcgOimgeemgeeUqO+8jOaKiiB0cmFja2VyX2lkIOiuvue9ruaIkCBudWxsIOWNs+WPr1xuICAgIHRyYWNrZXJfaWQ6IG51bGxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga0RlZmF1bHRPcHRpb25zO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIiksIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIGV2ZW50cy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAga1Bvc3RJbml0OiAnUG9zdEluaXQnLFxuICAgIGtLZXk6ICdLZXknLFxuICAgIGtMaXN0UGFydHM6ICdMaXN0UGFydHMnLFxuICAgIGtPYmplY3RNZXRhczogJ09iamVjdE1ldGFzJyxcbiAgICAvLyBrRmlsZXNSZW1vdmVkICA6ICdGaWxlc1JlbW92ZWQnLFxuICAgIGtGaWxlRmlsdGVyZWQ6ICdGaWxlRmlsdGVyZWQnLFxuICAgIGtGaWxlc0FkZGVkOiAnRmlsZXNBZGRlZCcsXG4gICAga0ZpbGVzRmlsdGVyOiAnRmlsZXNGaWx0ZXInLFxuICAgIGtOZXR3b3JrU3BlZWQ6ICdOZXR3b3JrU3BlZWQnLFxuICAgIGtCZWZvcmVVcGxvYWQ6ICdCZWZvcmVVcGxvYWQnLFxuICAgIC8vIGtVcGxvYWRGaWxlICAgIDogJ1VwbG9hZEZpbGUnLCAgICAgICAvLyA/P1xuICAgIGtVcGxvYWRQcm9ncmVzczogJ1VwbG9hZFByb2dyZXNzJyxcbiAgICBrRmlsZVVwbG9hZGVkOiAnRmlsZVVwbG9hZGVkJyxcbiAgICBrVXBsb2FkUGFydFByb2dyZXNzOiAnVXBsb2FkUGFydFByb2dyZXNzJyxcbiAgICBrQ2h1bmtVcGxvYWRlZDogJ0NodW5rVXBsb2FkZWQnLFxuICAgIGtVcGxvYWRSZXN1bWU6ICdVcGxvYWRSZXN1bWUnLCAvLyDmlq3ngrnnu63kvKBcbiAgICAvLyBrVXBsb2FkUGF1c2U6ICdVcGxvYWRQYXVzZScsICAgLy8g5pqC5YGcXG4gICAga1VwbG9hZFJlc3VtZUVycm9yOiAnVXBsb2FkUmVzdW1lRXJyb3InLCAvLyDlsJ3or5Xmlq3ngrnnu63kvKDlpLHotKVcbiAgICBrVXBsb2FkQ29tcGxldGU6ICdVcGxvYWRDb21wbGV0ZScsXG4gICAga0Vycm9yOiAnRXJyb3InLFxuICAgIGtBYm9ydGVkOiAnQWJvcnRlZCdcbn07XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIG11bHRpcGFydF90YXNrLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIGFzeW5jID0gcmVxdWlyZSgzNSk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG52YXIgZXZlbnRzID0gcmVxdWlyZSgyNCk7XG52YXIgVGFzayA9IHJlcXVpcmUoMzApO1xuXG4vKipcbiAqIE11bHRpcGFydFRhc2tcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gTXVsdGlwYXJ0VGFzaygpIHtcbiAgICBUYXNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICAvKipcbiAgICAgKiDmibnph4/kuIrkvKDnmoTml7blgJnvvIzkv53lrZjnmoQgeGhyUmVxdWVzdGluZyDlr7nosaFcbiAgICAgKiDlpoLmnpzpnIDopoEgYWJvcnQg55qE5pe25YCZ77yM5LuO6L+Z6YeM5p2l6I635Y+WXG4gICAgICovXG4gICAgdGhpcy54aHJQb29scyA9IFtdO1xufVxudXRpbHMuaW5oZXJpdHMoTXVsdGlwYXJ0VGFzaywgVGFzayk7XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmFib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgZmlsZSA9IHRoaXMub3B0aW9ucy5maWxlO1xuICAgIHZhciBidWNrZXQgPSB0aGlzLm9wdGlvbnMuYnVja2V0O1xuICAgIHZhciBvYmplY3QgPSB0aGlzLm9wdGlvbnMub2JqZWN0O1xuICAgIHZhciBtZXRhcyA9IHRoaXMub3B0aW9ucy5tZXRhcztcbiAgICB2YXIgY2h1bmtTaXplID0gdGhpcy5vcHRpb25zLmNodW5rX3NpemU7XG4gICAgdmFyIG11bHRpcGFydFBhcmFsbGVsID0gdGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfcGFyYWxsZWw7XG5cbiAgICB2YXIgY29udGVudFR5cGUgPSB1dGlscy5ndWVzc0NvbnRlbnRUeXBlKGZpbGUpO1xuICAgIHZhciBvcHRpb25zID0geydDb250ZW50LVR5cGUnOiBjb250ZW50VHlwZX07XG4gICAgdmFyIHVwbG9hZElkID0gbnVsbDtcblxuICAgIHJldHVybiB0aGlzLl9pbml0aWF0ZU11bHRpcGFydFVwbG9hZChmaWxlLCBjaHVua1NpemUsIGJ1Y2tldCwgb2JqZWN0LCBvcHRpb25zKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHVwbG9hZElkID0gcmVzcG9uc2UuYm9keS51cGxvYWRJZDtcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlc3BvbnNlLmJvZHkucGFydHMgfHwgW107XG4gICAgICAgICAgICAvLyDlh4blpIcgdXBsb2FkUGFydHNcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgICAgIHZhciB0YXNrcyA9IHV0aWxzLmdldFRhc2tzKGZpbGUsIHVwbG9hZElkLCBjaHVua1NpemUsIGJ1Y2tldCwgb2JqZWN0KTtcbiAgICAgICAgICAgIHV0aWxzLmZpbHRlclRhc2tzKHRhc2tzLCBwYXJ0cyk7XG5cbiAgICAgICAgICAgIHZhciBsb2FkZWQgPSBwYXJ0cy5sZW5ndGg7XG4gICAgICAgICAgICAvLyDov5nkuKrnlKjmnaXorrDlvZXmlbTkvZMgUGFydHMg55qE5LiK5Lyg6L+b5bqm77yM5LiN5piv5Y2V5LiqIFBhcnQg55qE5LiK5Lyg6L+b5bqmXG4gICAgICAgICAgICAvLyDljZXkuKogUGFydCDnmoTkuIrkvKDov5vluqblj6/ku6Xnm5HlkKwga1VwbG9hZFBhcnRQcm9ncmVzcyDmnaXlvpfliLBcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICBsZW5ndGhDb21wdXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxvYWRlZDogbG9hZGVkLFxuICAgICAgICAgICAgICAgIHRvdGFsOiB0YXNrcy5sZW5ndGhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAobG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtmaWxlLCBsb2FkZWQgLyB0YXNrcy5sZW5ndGgsIG51bGxdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXN5bmMubWFwTGltaXQodGFza3MsIG11bHRpcGFydFBhcmFsbGVsLCBzZWxmLl91cGxvYWRQYXJ0KHN0YXRlKSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlcykge1xuICAgICAgICAgICAgdmFyIHBhcnRMaXN0ID0gW107XG4gICAgICAgICAgICB1LmVhY2gocmVzcG9uc2VzLCBmdW5jdGlvbiAocmVzcG9uc2UsIGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcGFydExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHBhcnROdW1iZXI6IGluZGV4ICsgMSxcbiAgICAgICAgICAgICAgICAgICAgZVRhZzogcmVzcG9uc2UuaHR0cF9oZWFkZXJzLmV0YWdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8g5YWo6YOo5LiK5Lyg57uT5p2f5ZCO5Yig6ZmkbG9jYWxTdG9yYWdlXG4gICAgICAgICAgICBzZWxmLl9nZW5lcmF0ZUxvY2FsS2V5KHtcbiAgICAgICAgICAgICAgICBibG9iOiBmaWxlLFxuICAgICAgICAgICAgICAgIGNodW5rU2l6ZTogY2h1bmtTaXplLFxuICAgICAgICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAgICAgICAgIG9iamVjdDogb2JqZWN0XG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICB1dGlscy5yZW1vdmVVcGxvYWRJZChrZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5jbGllbnQuY29tcGxldGVNdWx0aXBhcnRVcGxvYWQoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkLCBwYXJ0TGlzdCwgbWV0YXMpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbZmlsZSwgMV0pO1xuXG4gICAgICAgICAgICByZXNwb25zZS5ib2R5LmJ1Y2tldCA9IGJ1Y2tldDtcbiAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkub2JqZWN0ID0gb2JqZWN0O1xuXG4gICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtGaWxlVXBsb2FkZWQsIFtmaWxlLCByZXNwb25zZV0pO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBldmVudFR5cGUgPSBzZWxmLmFib3J0ZWQgPyBldmVudHMua0Fib3J0ZWQgOiBldmVudHMua0Vycm9yO1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50VHlwZSwgW2Vycm9yLCBmaWxlXSk7XG4gICAgICAgIH0pO1xufTtcblxuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5faW5pdGlhdGVNdWx0aXBhcnRVcGxvYWQgPSBmdW5jdGlvbiAoZmlsZSwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCwgb3B0aW9ucykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIHVwbG9hZElkO1xuICAgIHZhciBsb2NhbFNhdmVLZXk7XG5cbiAgICBmdW5jdGlvbiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCkge1xuICAgICAgICByZXR1cm4gc2VsZi5jbGllbnQuaW5pdGlhdGVNdWx0aXBhcnRVcGxvYWQoYnVja2V0LCBvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWxzLnNldFVwbG9hZElkKGxvY2FsU2F2ZUtleSwgcmVzcG9uc2UuYm9keS51cGxvYWRJZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuYm9keS5wYXJ0cyA9IFtdO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBrZXlPcHRpb25zID0ge1xuICAgICAgICBibG9iOiBmaWxlLFxuICAgICAgICBjaHVua1NpemU6IGNodW5rU2l6ZSxcbiAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgIG9iamVjdDogb2JqZWN0XG4gICAgfTtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X2F1dG9fY29udGludWVcbiAgICAgICAgPyB0aGlzLl9nZW5lcmF0ZUxvY2FsS2V5KGtleU9wdGlvbnMpXG4gICAgICAgIDogUS5yZXNvbHZlKG51bGwpO1xuXG4gICAgcmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBsb2NhbFNhdmVLZXkgPSBrZXk7XG4gICAgICAgICAgICBpZiAoIWxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHVwbG9hZElkID0gdXRpbHMuZ2V0VXBsb2FkSWQobG9jYWxTYXZlS2V5KTtcbiAgICAgICAgICAgIGlmICghdXBsb2FkSWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fbGlzdFBhcnRzKGZpbGUsIGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHVwbG9hZElkICYmIGxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlc3BvbnNlLmJvZHkucGFydHM7XG4gICAgICAgICAgICAgICAgLy8gbGlzdFBhcnRzIOeahOi/lOWbnue7k+aenFxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFJlc3VtZSwgW2ZpbGUsIHBhcnRzLCBudWxsXSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UuYm9keS51cGxvYWRJZCA9IHVwbG9hZElkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh1cGxvYWRJZCAmJiBsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzojrflj5blt7LkuIrkvKDliIbniYflpLHotKXvvIzliJnph43mlrDkuIrkvKDjgIJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRSZXN1bWVFcnJvciwgW2ZpbGUsIGVycm9yLCBudWxsXSk7XG4gICAgICAgICAgICAgICAgdXRpbHMucmVtb3ZlVXBsb2FkSWQobG9jYWxTYXZlS2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5pdE5ld011bHRpcGFydFVwbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH0pO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX2dlbmVyYXRlTG9jYWxLZXkgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBnZW5lcmF0b3IgPSB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9sb2NhbF9rZXlfZ2VuZXJhdG9yO1xuICAgIHJldHVybiB1dGlscy5nZW5lcmF0ZUxvY2FsS2V5KG9wdGlvbnMsIGdlbmVyYXRvcik7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fbGlzdFBhcnRzID0gZnVuY3Rpb24gKGZpbGUsIGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgdmFyIGxvY2FsUGFydHMgPSBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtMaXN0UGFydHMsIFtmaWxlLCB1cGxvYWRJZF0pO1xuXG4gICAgcmV0dXJuIFEucmVzb2x2ZShsb2NhbFBhcnRzKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocGFydHMpIHtcbiAgICAgICAgICAgIGlmICh1LmlzQXJyYXkocGFydHMpICYmIHBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRzOiBwYXJ0c1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g5aaC5p6c6L+U5Zue55qE5LiN5piv5pWw57uE77yM5bCx6LCD55SoIGxpc3RQYXJ0cyDmjqXlj6Pku47mnI3liqHlmajojrflj5bmlbDmja5cbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9saXN0QWxsUGFydHMoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKTtcbiAgICAgICAgfSk7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fbGlzdEFsbFBhcnRzID0gZnVuY3Rpb24gKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCkge1xuICAgIC8vIGlzVHJ1bmNhdGVkID09PSB0cnVlIC8gZmFsc2VcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgdmFyIHBhcnRzID0gW107XG4gICAgdmFyIHBheWxvYWQgPSBudWxsO1xuICAgIHZhciBtYXhQYXJ0cyA9IDEwMDA7ICAgICAgICAgIC8vIOavj+asoeeahOWIhumhtVxuICAgIHZhciBwYXJ0TnVtYmVyTWFya2VyID0gMDsgICAgIC8vIOWIhumalOesplxuXG4gICAgZnVuY3Rpb24gbGlzdFBhcnRzKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1heFBhcnRzOiBtYXhQYXJ0cyxcbiAgICAgICAgICAgIHBhcnROdW1iZXJNYXJrZXI6IHBhcnROdW1iZXJNYXJrZXJcbiAgICAgICAgfTtcbiAgICAgICAgc2VsZi5jbGllbnQubGlzdFBhcnRzKGJ1Y2tldCwgb2JqZWN0LCB1cGxvYWRJZCwgb3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZCA9IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2guYXBwbHkocGFydHMsIHJlc3BvbnNlLmJvZHkucGFydHMpO1xuICAgICAgICAgICAgICAgIHBhcnROdW1iZXJNYXJrZXIgPSByZXNwb25zZS5ib2R5Lm5leHRQYXJ0TnVtYmVyTWFya2VyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmJvZHkuaXNUcnVuY2F0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOe7k+adn+S6hlxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkLmJvZHkucGFydHMgPSBwYXJ0cztcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmAkuW9kuiwg+eUqFxuICAgICAgICAgICAgICAgICAgICBsaXN0UGFydHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVtcbiAgICAgICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICBsaXN0UGFydHMoKTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuX3VwbG9hZFBhcnQgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIGZ1bmN0aW9uIHVwbG9hZFBhcnRJbm5lcihpdGVtLCBvcHRfbWF4UmV0cmllcykge1xuICAgICAgICBpZiAoaXRlbS5ldGFnKSB7XG4gICAgICAgICAgICBzZWxmLm5ldHdvcmtJbmZvLmxvYWRlZEJ5dGVzICs9IGl0ZW0ucGFydFNpemU7XG5cbiAgICAgICAgICAgIC8vIOi3s+i/h+W3suS4iuS8oOeahHBhcnRcbiAgICAgICAgICAgIHJldHVybiBRLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICBldGFnOiBpdGVtLmV0YWdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IHt9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWF4UmV0cmllcyA9IG9wdF9tYXhSZXRyaWVzID09IG51bGxcbiAgICAgICAgICAgID8gc2VsZi5vcHRpb25zLm1heF9yZXRyaWVzXG4gICAgICAgICAgICA6IG9wdF9tYXhSZXRyaWVzO1xuICAgICAgICB2YXIgcmV0cnlJbnRlcnZhbCA9IHNlbGYub3B0aW9ucy5yZXRyeV9pbnRlcnZhbDtcblxuICAgICAgICB2YXIgYmxvYiA9IGl0ZW0uZmlsZS5zbGljZShpdGVtLnN0YXJ0LCBpdGVtLnN0b3AgKyAxKTtcbiAgICAgICAgYmxvYi5fcHJldmlvdXNMb2FkZWQgPSAwO1xuXG4gICAgICAgIHZhciB1cGxvYWRQYXJ0WGhyID0gc2VsZi5jbGllbnQudXBsb2FkUGFydEZyb21CbG9iKGl0ZW0uYnVja2V0LCBpdGVtLm9iamVjdCxcbiAgICAgICAgICAgIGl0ZW0udXBsb2FkSWQsIGl0ZW0ucGFydE51bWJlciwgaXRlbS5wYXJ0U2l6ZSwgYmxvYik7XG4gICAgICAgIHZhciB4aHJQb29sSW5kZXggPSBzZWxmLnhoclBvb2xzLnB1c2godXBsb2FkUGFydFhocik7XG5cbiAgICAgICAgcmV0dXJuIHVwbG9hZFBhcnRYaHIudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICArK3N0YXRlLmxvYWRlZDtcbiAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBzdGF0ZS5sb2FkZWQgLyBzdGF0ZS50b3RhbDtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2l0ZW0uZmlsZSwgcHJvZ3Jlc3MsIG51bGxdKTtcblxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZElkOiBpdGVtLnVwbG9hZElkLFxuICAgICAgICAgICAgICAgICAgICBwYXJ0TnVtYmVyOiBpdGVtLnBhcnROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIHBhcnRTaXplOiBpdGVtLnBhcnRTaXplLFxuICAgICAgICAgICAgICAgICAgICBidWNrZXQ6IGl0ZW0uYnVja2V0LFxuICAgICAgICAgICAgICAgICAgICBvYmplY3Q6IGl0ZW0ub2JqZWN0LFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGl0ZW0uc3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsOiBibG9iLnNpemUsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiByZXNwb25zZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rQ2h1bmtVcGxvYWRlZCwgW2l0ZW0uZmlsZSwgcmVzdWx0XSk7XG5cbiAgICAgICAgICAgICAgICAvLyDkuI3nlKjliKDpmaTvvIzorr7nva7kuLogbnVsbCDlsLHlpb3kuobvvIzlj43mraMgYWJvcnQg55qE5pe25YCZ5Lya5Yik5pat55qEXG4gICAgICAgICAgICAgICAgc2VsZi54aHJQb29sc1t4aHJQb29sSW5kZXggLSAxXSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgICAgICB9KVtcbiAgICAgICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1heFJldHJpZXMgPiAwICYmICFzZWxmLmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6L+Y5pyJ6YeN6K+V55qE5py65LyaXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1dGlscy5kZWxheShyZXRyeUludGVydmFsKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1cGxvYWRQYXJ0SW5uZXIoaXRlbSwgbWF4UmV0cmllcyAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8g5rKh5pyJ5py65Lya6YeN6K+V5LqGIDotKFxuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0sIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIGZpbGU6IGZpbGUsXG4gICAgICAgIC8vIHVwbG9hZElkOiB1cGxvYWRJZCxcbiAgICAgICAgLy8gYnVja2V0OiBidWNrZXQsXG4gICAgICAgIC8vIG9iamVjdDogb2JqZWN0LFxuICAgICAgICAvLyBwYXJ0TnVtYmVyOiBwYXJ0TnVtYmVyLFxuICAgICAgICAvLyBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgIC8vIHN0YXJ0OiBvZmZzZXQsXG4gICAgICAgIC8vIHN0b3A6IG9mZnNldCArIHBhcnRTaXplIC0gMVxuXG4gICAgICAgIHZhciByZXNvbHZlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCByZXNwb25zZSk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciByZWplY3QgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICB1cGxvYWRQYXJ0SW5uZXIoaXRlbSkudGhlbihyZXNvbHZlLCByZWplY3QpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIOe7iOatouS4iuS8oOS7u+WKoVxuICovXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnhoclBvb2xzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB4aHIgPSB0aGlzLnhoclBvb2xzW2ldO1xuICAgICAgICBpZiAoeGhyICYmIHR5cGVvZiB4aHIuYWJvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE11bHRpcGFydFRhc2s7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHNyYy9uZXR3b3JrX2luZm8uanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciB1dGlscyA9IHJlcXVpcmUoMzIpO1xuXG4vKipcbiAqIE5ldHdvcmtJbmZvXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIE5ldHdvcmtJbmZvKCkge1xuICAgIC8qKlxuICAgICAqIOiusOW9leS7jiBzdGFydCDlvIDlp4vlt7Lnu4/kuIrkvKDnmoTlrZfoioLmlbAuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmxvYWRlZEJ5dGVzID0gMDtcblxuICAgIC8qKlxuICAgICAqIOiusOW9lemYn+WIl+S4reaAu+aWh+S7tueahOWkp+WwjywgVXBsb2FkQ29tcGxldGUg5LmL5ZCO5Lya6KKr5riF6Zu2XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnRvdGFsQnl0ZXMgPSAwO1xuXG4gICAgLyoqXG4gICAgICog6K6w5b2V5byA5aeL5LiK5Lyg55qE5pe26Ze0LlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5fc3RhcnRUaW1lID0gdXRpbHMubm93KCk7XG5cbiAgICB0aGlzLnJlc2V0KCk7XG59XG5cbk5ldHdvcmtJbmZvLnByb3RvdHlwZS5kdW1wID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIHRoaXMubG9hZGVkQnl0ZXMsICAgICAgICAgICAgICAgICAgICAgLy8g5bey57uP5LiK5Lyg55qEXG4gICAgICAgIHV0aWxzLm5vdygpIC0gdGhpcy5fc3RhcnRUaW1lLCAgICAgICAgLy8g6Iqx6LS555qE5pe26Ze0XG4gICAgICAgIHRoaXMudG90YWxCeXRlcyAtIHRoaXMubG9hZGVkQnl0ZXMgICAgLy8g5Ymp5L2Z5pyq5LiK5Lyg55qEXG4gICAgXTtcbn07XG5cbk5ldHdvcmtJbmZvLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxvYWRlZEJ5dGVzID0gMDtcbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1dGlscy5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTmV0d29ya0luZm87XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHB1dF9vYmplY3RfdGFzay5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcbnZhciBldmVudHMgPSByZXF1aXJlKDI0KTtcbnZhciBUYXNrID0gcmVxdWlyZSgzMCk7XG5cbi8qKlxuICogUHV0T2JqZWN0VGFza1xuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBQdXRPYmplY3RUYXNrKCkge1xuICAgIFRhc2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn1cbnV0aWxzLmluaGVyaXRzKFB1dE9iamVjdFRhc2ssIFRhc2spO1xuXG5QdXRPYmplY3RUYXNrLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uIChvcHRfbWF4UmV0cmllcykge1xuICAgIGlmICh0aGlzLmFib3J0ZWQpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgZmlsZSA9IHRoaXMub3B0aW9ucy5maWxlO1xuICAgIHZhciBidWNrZXQgPSB0aGlzLm9wdGlvbnMuYnVja2V0O1xuICAgIHZhciBvYmplY3QgPSB0aGlzLm9wdGlvbnMub2JqZWN0O1xuICAgIHZhciBtZXRhcyA9IHRoaXMub3B0aW9ucy5tZXRhcztcbiAgICB2YXIgbWF4UmV0cmllcyA9IG9wdF9tYXhSZXRyaWVzID09IG51bGxcbiAgICAgICAgPyB0aGlzLm9wdGlvbnMubWF4X3JldHJpZXNcbiAgICAgICAgOiBvcHRfbWF4UmV0cmllcztcbiAgICB2YXIgcmV0cnlJbnRlcnZhbCA9IHRoaXMub3B0aW9ucy5yZXRyeV9pbnRlcnZhbDtcblxuICAgIHZhciBjb250ZW50VHlwZSA9IHV0aWxzLmd1ZXNzQ29udGVudFR5cGUoZmlsZSk7XG4gICAgdmFyIG9wdGlvbnMgPSB1LmV4dGVuZCh7J0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlfSwgbWV0YXMpO1xuXG4gICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gdGhpcy5jbGllbnQucHV0T2JqZWN0RnJvbUJsb2IoYnVja2V0LCBvYmplY3QsIGZpbGUsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIHRoaXMueGhyUmVxdWVzdGluZy50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2ZpbGUsIDFdKTtcblxuICAgICAgICByZXNwb25zZS5ib2R5LmJ1Y2tldCA9IGJ1Y2tldDtcbiAgICAgICAgcmVzcG9uc2UuYm9keS5vYmplY3QgPSBvYmplY3Q7XG5cbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rRmlsZVVwbG9hZGVkLCBbZmlsZSwgcmVzcG9uc2VdKTtcbiAgICB9KVtcbiAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gc2VsZi5hYm9ydGVkID8gZXZlbnRzLmtBYm9ydGVkIDogZXZlbnRzLmtFcnJvcjtcbiAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50VHlwZSwgW2Vycm9yLCBmaWxlXSk7XG5cbiAgICAgICAgaWYgKGVycm9yLnN0YXR1c19jb2RlICYmIGVycm9yLmNvZGUgJiYgZXJyb3IucmVxdWVzdF9pZCkge1xuICAgICAgICAgICAgLy8g5bqU6K+l5piv5q2j5bi455qE6ZSZ6K+vKOavlOWmguetvuWQjeW8guW4uCnvvIzov5nnp43mg4XlhrXlsLHkuI3opoHph43or5XkuoZcbiAgICAgICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBlbHNlIGlmIChlcnJvci5zdGF0dXNfY29kZSA9PT0gMCkge1xuICAgICAgICAvLyAgICAvLyDlj6/og73mmK/mlq3nvZHkuobvvIxzYWZhcmkg6Kem5Y+RIG9ubGluZS9vZmZsaW5lIOW7tui/n+avlOi+g+S5hVxuICAgICAgICAvLyAgICAvLyDmiJHku6zmjqjov5/kuIDkuIsgc2VsZi5fdXBsb2FkTmV4dCgpIOeahOaXtuaculxuICAgICAgICAvLyAgICBzZWxmLnBhdXNlKCk7XG4gICAgICAgIC8vICAgIHJldHVybjtcbiAgICAgICAgLy8gfVxuICAgICAgICBlbHNlIGlmIChtYXhSZXRyaWVzID4gMCAmJiAhc2VsZi5hYm9ydGVkKSB7XG4gICAgICAgICAgICAvLyDov5jmnInmnLrkvJrph43or5VcbiAgICAgICAgICAgIHJldHVybiB1dGlscy5kZWxheShyZXRyeUludGVydmFsKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5zdGFydChtYXhSZXRyaWVzIC0gMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOmHjeivlee7k+adn+S6hu+8jOS4jeeuoeS6hu+8jOe7p+e7reS4i+S4gOS4quaWh+S7tueahOS4iuS8oFxuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gUHV0T2JqZWN0VGFzaztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL3F1ZXVlLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKipcbiAqIFF1ZXVlXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0geyp9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIFF1ZXVlKGNvbGxlY3Rpb24pIHtcbiAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xufVxuXG5RdWV1ZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmxlbmd0aCA8PSAwO1xufTtcblxuUXVldWUucHJvdG90eXBlLnNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5sZW5ndGg7XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUuZGVxdWV1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLnNoaWZ0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXVlO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHN0c190b2tlbl9tYW5hZ2VyLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG5cbi8qKlxuICogU3RzVG9rZW5NYW5hZ2VyXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucy5cbiAqL1xuZnVuY3Rpb24gU3RzVG9rZW5NYW5hZ2VyKG9wdGlvbnMpIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbn1cblxuU3RzVG9rZW5NYW5hZ2VyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaWYgKHNlbGYuX2NhY2hlW2J1Y2tldF0gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fY2FjaGVbYnVja2V0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gUS5yZXNvbHZlKHRoaXMuX2dldEltcGwuYXBwbHkodGhpcywgYXJndW1lbnRzKSkudGhlbihmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICBzZWxmLl9jYWNoZVtidWNrZXRdID0gcGF5bG9hZDtcbiAgICAgICAgcmV0dXJuIHBheWxvYWQ7XG4gICAgfSk7XG59O1xuXG5TdHNUb2tlbk1hbmFnZXIucHJvdG90eXBlLl9nZXRJbXBsID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciB1cHRva2VuX3VybCA9IG9wdGlvbnMudXB0b2tlbl91cmw7XG4gICAgdmFyIHRpbWVvdXQgPSBvcHRpb25zLnVwdG9rZW5fdGltZW91dCB8fCBvcHRpb25zLnVwdG9rZW5fanNvbnBfdGltZW91dDtcbiAgICB2YXIgdmlhSnNvbnAgPSBvcHRpb25zLnVwdG9rZW5fdmlhX2pzb25wO1xuXG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdXB0b2tlbl91cmwsXG4gICAgICAgIGpzb25wOiB2aWFKc29ucCA/ICdjYWxsYmFjaycgOiBmYWxzZSxcbiAgICAgICAgZGF0YVR5cGU6IHZpYUpzb25wID8gJ2pzb25wJyA6ICdqc29uJyxcbiAgICAgICAgdGltZW91dDogdGltZW91dCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgc3RzOiBKU09OLnN0cmluZ2lmeSh1dGlscy5nZXREZWZhdWx0QUNMKGJ1Y2tldCkpXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAvLyBwYXlsb2FkLkFjY2Vzc0tleUlkXG4gICAgICAgICAgICAvLyBwYXlsb2FkLlNlY3JldEFjY2Vzc0tleVxuICAgICAgICAgICAgLy8gcGF5bG9hZC5TZXNzaW9uVG9rZW5cbiAgICAgICAgICAgIC8vIHBheWxvYWQuRXhwaXJhdGlvblxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwYXlsb2FkKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ0dldCBzdHMgdG9rZW4gdGltZW91dCAoJyArIHRpbWVvdXQgKyAnbXMpLicpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0c1Rva2VuTWFuYWdlcjtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgdGFzay5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuXG4vKipcbiAqIOS4jeWQjOeahOWcuuaZr+S4i++8jOmcgOimgemAmui/h+S4jeWQjOeahFRhc2vmnaXlrozmiJDkuIrkvKDnmoTlt6XkvZxcbiAqXG4gKiBAcGFyYW0ge3Nkay5Cb3NDbGllbnR9IGNsaWVudCBUaGUgYm9zIGNsaWVudC5cbiAqIEBwYXJhbSB7RXZlbnREaXNwYXRjaGVyfSBldmVudERpc3BhdGNoZXIgVGhlIGV2ZW50IGRpc3BhdGNoZXIuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgZXh0cmEgdGFzay1yZWxhdGVkIGFyZ3VtZW50cy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVGFzayhjbGllbnQsIGV2ZW50RGlzcGF0Y2hlciwgb3B0aW9ucykge1xuICAgIC8qKlxuICAgICAqIOWPr+S7peiiqyBhYm9ydCDnmoQgcHJvbWlzZSDlr7nosaFcbiAgICAgKlxuICAgICAqIEB0eXBlIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiDmoIforrDkuIDkuIvmmK/lkKbmmK/kurrkuLrkuK3mlq3kuoZcbiAgICAgKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuYWJvcnRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5uZXR3b3JrSW5mbyA9IG51bGw7XG5cbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlciA9IGV2ZW50RGlzcGF0Y2hlcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBhYnN0cmFjdE1ldGhvZCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuaW1wbGVtZW50ZWQgbWV0aG9kLicpO1xufVxuXG4vKipcbiAqIOW8gOWni+S4iuS8oOS7u+WKoVxuICovXG5UYXNrLnByb3RvdHlwZS5zdGFydCA9IGFic3RyYWN0TWV0aG9kO1xuXG4vKipcbiAqIOaaguWBnOS4iuS8oFxuICovXG5UYXNrLnByb3RvdHlwZS5wYXVzZSA9IGFic3RyYWN0TWV0aG9kO1xuXG4vKipcbiAqIOaBouWkjeaaguWBnFxuICovXG5UYXNrLnByb3RvdHlwZS5yZXN1bWUgPSBhYnN0cmFjdE1ldGhvZDtcblxuVGFzay5wcm90b3R5cGUuc2V0TmV0d29ya0luZm8gPSBmdW5jdGlvbiAobmV0d29ya0luZm8pIHtcbiAgICB0aGlzLm5ldHdvcmtJbmZvID0gbmV0d29ya0luZm87XG59O1xuXG4vKipcbiAqIOe7iOatouS4iuS8oOS7u+WKoVxuICovXG5UYXNrLnByb3RvdHlwZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy54aHJSZXF1ZXN0aW5nXG4gICAgICAgICYmIHR5cGVvZiB0aGlzLnhoclJlcXVlc3RpbmcuYWJvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy54aHJSZXF1ZXN0aW5nLmFib3J0KCk7XG4gICAgICAgIHRoaXMueGhyUmVxdWVzdGluZyA9IG51bGw7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYXNrO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSB1cGxvYWRlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcbnZhciBldmVudHMgPSByZXF1aXJlKDI0KTtcbnZhciBrRGVmYXVsdE9wdGlvbnMgPSByZXF1aXJlKDIzKTtcbnZhciBQdXRPYmplY3RUYXNrID0gcmVxdWlyZSgyNyk7XG52YXIgTXVsdGlwYXJ0VGFzayA9IHJlcXVpcmUoMjUpO1xudmFyIFN0c1Rva2VuTWFuYWdlciA9IHJlcXVpcmUoMjkpO1xudmFyIE5ldHdvcmtJbmZvID0gcmVxdWlyZSgyNik7XG5cbnZhciBBdXRoID0gcmVxdWlyZSgxNSk7XG52YXIgQm9zQ2xpZW50ID0gcmVxdWlyZSgxNyk7XG5cbi8qKlxuICogQkNFIEJPUyBVcGxvYWRlclxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBvcHRpb25zIOmFjee9ruWPguaVsFxuICovXG5mdW5jdGlvbiBVcGxvYWRlcihvcHRpb25zKSB7XG4gICAgaWYgKHUuaXNTdHJpbmcob3B0aW9ucykpIHtcbiAgICAgICAgLy8g5pSv5oyB566A5L6/55qE5YaZ5rOV77yM5Y+v5Lul5LuOIERPTSDph4zpnaLliIbmnpDnm7jlhbPnmoTphY3nva4uXG4gICAgICAgIG9wdGlvbnMgPSB1LmV4dGVuZCh7XG4gICAgICAgICAgICBicm93c2VfYnV0dG9uOiBvcHRpb25zLFxuICAgICAgICAgICAgYXV0b19zdGFydDogdHJ1ZVxuICAgICAgICB9LCAkKG9wdGlvbnMpLmRhdGEoKSk7XG4gICAgfVxuXG4gICAgdmFyIHJ1bnRpbWVPcHRpb25zID0ge307XG4gICAgdGhpcy5vcHRpb25zID0gdS5leHRlbmQoe30sIGtEZWZhdWx0T3B0aW9ucywgcnVudGltZU9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplID0gdXRpbHMucGFyc2VTaXplKHRoaXMub3B0aW9ucy5tYXhfZmlsZV9zaXplKTtcbiAgICB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZVxuICAgICAgICA9IHV0aWxzLnBhcnNlU2l6ZSh0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9taW5fc2l6ZSk7XG4gICAgdGhpcy5vcHRpb25zLmNodW5rX3NpemUgPSB1dGlscy5wYXJzZVNpemUodGhpcy5vcHRpb25zLmNodW5rX3NpemUpO1xuXG4gICAgdmFyIGNyZWRlbnRpYWxzID0gdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscztcbiAgICBpZiAoIWNyZWRlbnRpYWxzICYmIHRoaXMub3B0aW9ucy5ib3NfYWsgJiYgdGhpcy5vcHRpb25zLmJvc19zaykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzID0ge1xuICAgICAgICAgICAgYWs6IHRoaXMub3B0aW9ucy5ib3NfYWssXG4gICAgICAgICAgICBzazogdGhpcy5vcHRpb25zLmJvc19za1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtCb3NDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5jbGllbnQgPSBuZXcgQm9zQ2xpZW50KHtcbiAgICAgICAgZW5kcG9pbnQ6IHV0aWxzLm5vcm1hbGl6ZUVuZHBvaW50KHRoaXMub3B0aW9ucy5ib3NfZW5kcG9pbnQpLFxuICAgICAgICBjcmVkZW50aWFsczogdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscyxcbiAgICAgICAgc2Vzc2lvblRva2VuOiB0aGlzLm9wdGlvbnMudXB0b2tlblxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog6ZyA6KaB562J5b6F5LiK5Lyg55qE5paH5Lu25YiX6KGo77yM5q+P5qyh5LiK5Lyg55qE5pe25YCZ77yM5LuO6L+Z6YeM6Z2i5Yig6ZmkXG4gICAgICog5oiQ5Yqf5oiW6ICF5aSx6LSl6YO95LiN5Lya5YaN5pS+5Zue5Y675LqGXG4gICAgICogQHBhcmFtIHtBcnJheS48RmlsZT59XG4gICAgICovXG4gICAgdGhpcy5fZmlsZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIOato+WcqOS4iuS8oOeahOaWh+S7tuWIl+ihqC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgRmlsZT59XG4gICAgICovXG4gICAgdGhpcy5fdXBsb2FkaW5nRmlsZXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuiiq+S4reaWreS6hu+8jOavlOWmgiB0aGlzLnN0b3BcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9hYm9ydCA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICog5piv5ZCm5aSE5LqO5LiK5Lyg55qE6L+H56iL5Lit77yM5Lmf5bCx5piv5q2j5Zyo5aSE55CGIHRoaXMuX2ZpbGVzIOmYn+WIl+eahOWGheWuuS5cbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl93b3JraW5nID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKbmlK/mjIF4aHIyXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5feGhyMlN1cHBvcnRlZCA9IHV0aWxzLmlzWGhyMlN1cHBvcnRlZCgpO1xuXG4gICAgdGhpcy5fbmV0d29ya0luZm8gPSBuZXcgTmV0d29ya0luZm8oKTtcblxuICAgIHRoaXMuX2luaXQoKTtcbn1cblxuVXBsb2FkZXIucHJvdG90eXBlLl9nZXRDdXN0b21pemVkU2lnbmF0dXJlID0gZnVuY3Rpb24gKHVwdG9rZW5VcmwpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgdGltZW91dCA9IG9wdGlvbnMudXB0b2tlbl90aW1lb3V0IHx8IG9wdGlvbnMudXB0b2tlbl9qc29ucF90aW1lb3V0O1xuICAgIHZhciB2aWFKc29ucCA9IG9wdGlvbnMudXB0b2tlbl92aWFfanNvbnA7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKF8sIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycykge1xuICAgICAgICBpZiAoL1xcYmVkPShbXFx3XFwuXSspXFxiLy50ZXN0KGxvY2F0aW9uLnNlYXJjaCkpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuSG9zdCA9IFJlZ0V4cC4kMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh1LmlzQXJyYXkob3B0aW9ucy5hdXRoX3N0cmlwcGVkX2hlYWRlcnMpKSB7XG4gICAgICAgICAgICBoZWFkZXJzID0gdS5vbWl0KGhlYWRlcnMsIG9wdGlvbnMuYXV0aF9zdHJpcHBlZF9oZWFkZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogdXB0b2tlblVybCxcbiAgICAgICAgICAgIGpzb25wOiB2aWFKc29ucCA/ICdjYWxsYmFjaycgOiBmYWxzZSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiB2aWFKc29ucCA/ICdqc29ucCcgOiAnanNvbicsXG4gICAgICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGh0dHBNZXRob2Q6IGh0dHBNZXRob2QsXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aCxcbiAgICAgICAgICAgICAgICAvLyBkZWxheTogfn4oTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICAgICAgICBxdWVyaWVzOiBKU09OLnN0cmluZ2lmeShwYXJhbXMgfHwge30pLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IEpTT04uc3RyaW5naWZ5KGhlYWRlcnMgfHwge30pXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdHZXQgYXV0aG9yaXphdGlvbiB0aW1lb3V0ICgnICsgdGltZW91dCArICdtcykuJykpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQuc3RhdHVzQ29kZSA9PT0gMjAwICYmIHBheWxvYWQuc2lnbmF0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocGF5bG9hZC5zaWduYXR1cmUsIHBheWxvYWQueGJjZURhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignY3JlYXRlU2lnbmF0dXJlIGZhaWxlZCwgc3RhdHVzQ29kZSA9ICcgKyBwYXlsb2FkLnN0YXR1c0NvZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufTtcblxuLyoqXG4gKiDosIPnlKggdGhpcy5vcHRpb25zLmluaXQg6YeM6Z2i6YWN572u55qE5pa55rOVXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWUg5pa55rOV5ZCN56ewXG4gKiBAcGFyYW0ge0FycmF5LjwqPn0gYXJncyDosIPnlKjml7blgJnnmoTlj4LmlbAuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSB0aHJvd0Vycm9ycyDlpoLmnpzlj5HnlJ/lvILluLjnmoTml7blgJnvvIzmmK/lkKbpnIDopoHmipvlh7rmnaVcbiAqIEByZXR1cm4geyp9IOS6i+S7tueahOi/lOWbnuWAvC5cbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9pbnZva2UgPSBmdW5jdGlvbiAobWV0aG9kTmFtZSwgYXJncywgdGhyb3dFcnJvcnMpIHtcbiAgICB2YXIgaW5pdCA9IHRoaXMub3B0aW9ucy5pbml0IHx8IHRoaXMub3B0aW9ucy5Jbml0O1xuICAgIGlmICghaW5pdCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1ldGhvZCA9IGluaXRbbWV0aG9kTmFtZV07XG4gICAgaWYgKHR5cGVvZiBtZXRob2QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIHZhciB1cCA9IG51bGw7XG4gICAgICAgIGFyZ3MgPSBhcmdzID09IG51bGwgPyBbdXBdIDogW3VwXS5jb25jYXQoYXJncyk7XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgICBpZiAodGhyb3dFcnJvcnMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBRLnJlamVjdChleCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIOWIneWni+WMluaOp+S7ti5cbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLl9pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciBhY2NlcHQgPSBvcHRpb25zLmFjY2VwdDtcblxuICAgIHZhciBidG5FbGVtZW50ID0gJChvcHRpb25zLmJyb3dzZV9idXR0b24pO1xuICAgIHZhciBub2RlTmFtZSA9IGJ0bkVsZW1lbnQucHJvcCgnbm9kZU5hbWUnKTtcbiAgICBpZiAobm9kZU5hbWUgIT09ICdJTlBVVCcpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRDb250YWluZXIgPSBidG5FbGVtZW50O1xuXG4gICAgICAgIC8vIOWmguaenOacrOi6q+S4jeaYryA8aW5wdXQgdHlwZT1cImZpbGVcIiAvPu+8jOiHquWKqOi/veWKoOS4gOS4quS4iuWOu1xuICAgICAgICAvLyAxLiBvcHRpb25zLmJyb3dzZV9idXR0b24g5ZCO6Z2i6L+95Yqg5LiA5Liq5YWD57SgIDxkaXY+PGlucHV0IHR5cGU9XCJmaWxlXCIgLz48L2Rpdj5cbiAgICAgICAgLy8gMi4gYnRuRWxlbWVudC5wYXJlbnQoKS5jc3MoJ3Bvc2l0aW9uJywgJ3JlbGF0aXZlJyk7XG4gICAgICAgIC8vIDMuIC5iY2UtYm9zLXVwbG9hZGVyLWlucHV0LWNvbnRhaW5lciDnlKjmnaXoh6rlrprkuYnoh6rlt7HnmoTmoLflvI9cbiAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudENvbnRhaW5lci5vdXRlcldpZHRoKCk7XG4gICAgICAgIHZhciBoZWlnaHQgPSBlbGVtZW50Q29udGFpbmVyLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgdmFyIGlucHV0RWxlbWVudENvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XCJiY2UtYm9zLXVwbG9hZGVyLWlucHV0LWNvbnRhaW5lclwiPjxpbnB1dCB0eXBlPVwiZmlsZVwiIC8+PC9kaXY+Jyk7XG4gICAgICAgIGlucHV0RWxlbWVudENvbnRhaW5lci5jc3Moe1xuICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICd0b3AnOiAwLCAnbGVmdCc6IDAsXG4gICAgICAgICAgICAnd2lkdGgnOiB3aWR0aCwgJ2hlaWdodCc6IGhlaWdodCxcbiAgICAgICAgICAgICdvdmVyZmxvdyc6ICdoaWRkZW4nLFxuICAgICAgICAgICAgLy8g5aaC5p6c5pSv5oyBIHhocjLvvIzmioogaW5wdXRbdHlwZT1maWxlXSDmlL7liLDmjInpkq7nmoTkuIvpnaLvvIzpgJrov4fkuLvliqjosIPnlKggZmlsZS5jbGljaygpIOinpuWPkVxuICAgICAgICAgICAgLy8g5aaC5p6c5LiN5pSv5oyBeGhyMiwg5oqKIGlucHV0W3R5cGU9ZmlsZV0g5pS+5Yiw5oyJ6ZKu55qE5LiK6Z2i77yM6YCa6L+H55So5oi35Li75Yqo54K55Ye7IGlucHV0W3R5cGU9ZmlsZV0g6Kem5Y+RXG4gICAgICAgICAgICAnei1pbmRleCc6IHRoaXMuX3hocjJTdXBwb3J0ZWQgPyA5OSA6IDEwMFxuICAgICAgICB9KTtcbiAgICAgICAgaW5wdXRFbGVtZW50Q29udGFpbmVyLmZpbmQoJ2lucHV0JykuY3NzKHtcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAndG9wJzogMCwgJ2xlZnQnOiAwLFxuICAgICAgICAgICAgJ3dpZHRoJzogJzEwMCUnLCAnaGVpZ2h0JzogJzEwMCUnLFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6ICc5OTlweCcsXG4gICAgICAgICAgICAnb3BhY2l0eSc6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIuY3NzKHtcbiAgICAgICAgICAgICdwb3NpdGlvbic6ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAnei1pbmRleCc6IHRoaXMuX3hocjJTdXBwb3J0ZWQgPyAxMDAgOiA5OVxuICAgICAgICB9KTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5hZnRlcihpbnB1dEVsZW1lbnRDb250YWluZXIpO1xuICAgICAgICBlbGVtZW50Q29udGFpbmVyLnBhcmVudCgpLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcblxuICAgICAgICAvLyDmioogYnJvd3NlX2J1dHRvbiDkv67mlLnkuLrlvZPliY3nlJ/miJDnmoTpgqPkuKrlhYPntKBcbiAgICAgICAgb3B0aW9ucy5icm93c2VfYnV0dG9uID0gaW5wdXRFbGVtZW50Q29udGFpbmVyLmZpbmQoJ2lucHV0Jyk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3hocjJTdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIGVsZW1lbnRDb250YWluZXIuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuYnJvd3NlX2J1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLl94aHIyU3VwcG9ydGVkXG4gICAgICAgICYmIHR5cGVvZiBtT3hpZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICAgJiYgdS5pc0Z1bmN0aW9uKG1PeGllLkZpbGVJbnB1dCkpIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21veGllY29kZS9tb3hpZS93aWtpL0ZpbGVJbnB1dFxuICAgICAgICAvLyBtT3hpZS5GaWxlSW5wdXQg5Y+q5pSv5oyBXG4gICAgICAgIC8vIFsrXTogYnJvd3NlX2J1dHRvbiwgYWNjZXB0IG11bHRpcGxlLCBkaXJlY3RvcnksIGZpbGVcbiAgICAgICAgLy8gW3hdOiBjb250YWluZXIsIHJlcXVpcmVkX2NhcHNcbiAgICAgICAgdmFyIGZpbGVJbnB1dCA9IG5ldyBtT3hpZS5GaWxlSW5wdXQoe1xuICAgICAgICAgICAgcnVudGltZV9vcmRlcjogJ2ZsYXNoLGh0bWw0JyxcbiAgICAgICAgICAgIGJyb3dzZV9idXR0b246ICQob3B0aW9ucy5icm93c2VfYnV0dG9uKS5nZXQoMCksXG4gICAgICAgICAgICBzd2ZfdXJsOiBvcHRpb25zLmZsYXNoX3N3Zl91cmwsXG4gICAgICAgICAgICBhY2NlcHQ6IHV0aWxzLmV4cGFuZEFjY2VwdFRvQXJyYXkoYWNjZXB0KSxcbiAgICAgICAgICAgIG11bHRpcGxlOiBvcHRpb25zLm11bHRpX3NlbGVjdGlvbixcbiAgICAgICAgICAgIGRpcmVjdG9yeTogb3B0aW9ucy5kaXJfc2VsZWN0aW9uLFxuICAgICAgICAgICAgZmlsZTogJ2ZpbGUnICAgICAgLy8gUG9zdE9iamVjdOaOpeWPo+imgeaxguWbuuWumuaYryAnZmlsZSdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZmlsZUlucHV0Lm9uY2hhbmdlID0gdS5iaW5kKHRoaXMuX29uRmlsZXNBZGRlZCwgdGhpcyk7XG4gICAgICAgIGZpbGVJbnB1dC5vbnJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5faW5pdEV2ZW50cygpO1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rUG9zdEluaXQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZpbGVJbnB1dC5pbml0KCk7XG4gICAgfVxuXG4gICAgdmFyIHByb21pc2UgPSBvcHRpb25zLmJvc19jcmVkZW50aWFsc1xuICAgICAgICA/IFEucmVzb2x2ZSgpXG4gICAgICAgIDogc2VsZi5yZWZyZXNoU3RzVG9rZW4oKTtcblxuICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmJvc19jcmVkZW50aWFscykge1xuICAgICAgICAgICAgc2VsZi5jbGllbnQuY3JlYXRlU2lnbmF0dXJlID0gZnVuY3Rpb24gKF8sIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycykge1xuICAgICAgICAgICAgICAgIHZhciBjcmVkZW50aWFscyA9IF8gfHwgdGhpcy5jb25maWcuY3JlZGVudGlhbHM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFEuZmNhbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXV0aCA9IG5ldyBBdXRoKGNyZWRlbnRpYWxzLmFrLCBjcmVkZW50aWFscy5zayk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhdXRoLmdlbmVyYXRlQXV0aG9yaXphdGlvbihodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLnVwdG9rZW5fdXJsICYmIG9wdGlvbnMuZ2V0X25ld191cHRva2VuID09PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyDmnI3liqHnq6/liqjmgIHnrb7lkI3nmoTmlrnlvI9cbiAgICAgICAgICAgIHNlbGYuY2xpZW50LmNyZWF0ZVNpZ25hdHVyZSA9IHNlbGYuX2dldEN1c3RvbWl6ZWRTaWduYXR1cmUob3B0aW9ucy51cHRva2VuX3VybCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICAgICAgLy8g5a+55LqO5LiN5pSv5oyBIHhocjIg55qE5oOF5Ya177yM5Lya5ZyoIG9ucmVhZHkg55qE5pe25YCZ5Y676Kem5Y+R5LqL5Lu2XG4gICAgICAgICAgICBzZWxmLl9pbml0RXZlbnRzKCk7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtQb3N0SW5pdCk7XG4gICAgICAgIH1cbiAgICB9KVtcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtFcnJvciwgW2Vycm9yXSk7XG4gICAgfSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX2luaXRFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAodGhpcy5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICB2YXIgYnRuID0gJChvcHRpb25zLmJyb3dzZV9idXR0b24pO1xuICAgICAgICBpZiAoYnRuLmF0dHIoJ211bHRpcGxlJykgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8g5aaC5p6c55So5oi35rKh5pyJ5pi+56S655qE6K6+572u6L+HIG11bHRpcGxl77yM5L2/55SoIG11bHRpX3NlbGVjdGlvbiDnmoTorr7nva5cbiAgICAgICAgICAgIC8vIOWQpuWImeS/neeVmSA8aW5wdXQgbXVsdGlwbGUgLz4g55qE5YaF5a65XG4gICAgICAgICAgICBidG4uYXR0cignbXVsdGlwbGUnLCAhIW9wdGlvbnMubXVsdGlfc2VsZWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBidG4ub24oJ2NoYW5nZScsIHUuYmluZCh0aGlzLl9vbkZpbGVzQWRkZWQsIHRoaXMpKTtcblxuICAgICAgICB2YXIgYWNjZXB0ID0gb3B0aW9ucy5hY2NlcHQ7XG4gICAgICAgIGlmIChhY2NlcHQgIT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gU2FmYXJpIOWPquaUr+aMgSBtaW1lLXR5cGVcbiAgICAgICAgICAgIC8vIENocm9tZSDmlK/mjIEgbWltZS10eXBlIOWSjCBleHRzXG4gICAgICAgICAgICAvLyBGaXJlZm94IOWPquaUr+aMgSBleHRzXG4gICAgICAgICAgICAvLyBOT1RFOiBleHRzIOW/hemhu+aciSAuIOi/meS4quWJjee8gO+8jOS+i+WmgiAudHh0IOaYr+WQiOazleeahO+8jHR4dCDmmK/kuI3lkIjms5XnmoRcbiAgICAgICAgICAgIHZhciBleHRzID0gdXRpbHMuZXhwYW5kQWNjZXB0KGFjY2VwdCk7XG4gICAgICAgICAgICB2YXIgaXNTYWZhcmkgPSAvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIC9BcHBsZSBDb21wdXRlci8udGVzdChuYXZpZ2F0b3IudmVuZG9yKTtcbiAgICAgICAgICAgIGlmIChpc1NhZmFyaSkge1xuICAgICAgICAgICAgICAgIGV4dHMgPSB1dGlscy5leHRUb01pbWVUeXBlKGV4dHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnRuLmF0dHIoJ2FjY2VwdCcsIGV4dHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZGlyX3NlbGVjdGlvbikge1xuICAgICAgICAgICAgYnRuLmF0dHIoJ2RpcmVjdG9yeScsIHRydWUpO1xuICAgICAgICAgICAgYnRuLmF0dHIoJ21vemRpcmVjdG9yeScsIHRydWUpO1xuICAgICAgICAgICAgYnRuLmF0dHIoJ3dlYmtpdGRpcmVjdG9yeScsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jbGllbnQub24oJ3Byb2dyZXNzJywgdS5iaW5kKHRoaXMuX29uVXBsb2FkUHJvZ3Jlc3MsIHRoaXMpKTtcbiAgICAvLyBYWFgg5b+F6aG757uR5a6aIGVycm9yIOeahOWkhOeQhuWHveaVsO+8jOWQpuWImeS8miB0aHJvdyBuZXcgRXJyb3JcbiAgICB0aGlzLmNsaWVudC5vbignZXJyb3InLCB1LmJpbmQodGhpcy5fb25FcnJvciwgdGhpcykpO1xuXG4gICAgLy8gJCh3aW5kb3cpLm9uKCdvbmxpbmUnLCB1LmJpbmQodGhpcy5faGFuZGxlT25saW5lU3RhdHVzLCB0aGlzKSk7XG4gICAgLy8gJCh3aW5kb3cpLm9uKCdvZmZsaW5lJywgdS5iaW5kKHRoaXMuX2hhbmRsZU9mZmxpbmVTdGF0dXMsIHRoaXMpKTtcblxuICAgIGlmICghdGhpcy5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICAvLyDlpoLmnpzmtY/op4jlmajkuI3mlK/mjIEgeGhyMu+8jOmCo+S5iOWwseWIh+aNouWIsCBtT3hpZS5YTUxIdHRwUmVxdWVzdFxuICAgICAgICAvLyDkvYbmmK/lm6DkuLogbU94aWUuWE1MSHR0cFJlcXVlc3Qg5peg5rOV5Y+R6YCBIEhFQUQg6K+35rGC77yM5peg5rOV6I635Y+WIFJlc3BvbnNlIEhlYWRlcnPvvIxcbiAgICAgICAgLy8g5Zug5q2kIGdldE9iamVjdE1ldGFkYXRh5a6e6ZmF5LiK5peg5rOV5q2j5bi45bel5L2c77yM5Zug5q2k5oiR5Lus6ZyA6KaB77yaXG4gICAgICAgIC8vIDEuIOiuqSBCT1Mg5paw5aKeIFJFU1QgQVBJ77yM5ZyoIEdFVCDnmoTor7fmsYLnmoTlkIzml7bvvIzmioogeC1iY2UtKiDmlL7liLAgUmVzcG9uc2UgQm9keSDov5Tlm55cbiAgICAgICAgLy8gMi4g5Li05pe25pa55qGI77ya5paw5aKe5LiA5LiqIFJlbGF5IOacjeWKoe+8jOWunueOsOaWueahiCAxXG4gICAgICAgIC8vICAgIEdFVCAvYmouYmNlYm9zLmNvbS92MS9idWNrZXQvb2JqZWN0P2h0dHBNZXRob2Q9SEVBRFxuICAgICAgICAvLyAgICBIb3N0OiByZWxheS5lZmUudGVjaFxuICAgICAgICAvLyAgICBBdXRob3JpemF0aW9uOiB4eHhcbiAgICAgICAgLy8gb3B0aW9ucy5ib3NfcmVsYXlfc2VydmVyXG4gICAgICAgIC8vIG9wdGlvbnMuc3dmX3VybFxuICAgICAgICB0aGlzLmNsaWVudC5zZW5kSFRUUFJlcXVlc3QgPSB1LmJpbmQodXRpbHMuZml4WGhyKHRoaXMub3B0aW9ucywgdHJ1ZSksIHRoaXMuY2xpZW50KTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX2ZpbHRlckZpbGVzID0gZnVuY3Rpb24gKGNhbmRpZGF0ZXMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyDlpoLmnpwgbWF4RmlsZVNpemUgPT09IDAg5bCx6K+05piO5LiN6ZmQ5Yi25aSn5bCPXG4gICAgdmFyIG1heEZpbGVTaXplID0gdGhpcy5vcHRpb25zLm1heF9maWxlX3NpemU7XG5cbiAgICB2YXIgZmlsZXMgPSB1LmZpbHRlcihjYW5kaWRhdGVzLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICBpZiAobWF4RmlsZVNpemUgPiAwICYmIGZpbGUuc2l6ZSA+IG1heEZpbGVTaXplKSB7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtGaWxlRmlsdGVyZWQsIFtmaWxlXSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIOajgOafpeWQjue8gOS5i+exu+eahFxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShldmVudHMua0ZpbGVzRmlsdGVyLCBbZmlsZXNdKSB8fCBmaWxlcztcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkQWJvcnRIYW5kbGVyKGl0ZW0sIHNlbGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpdGVtLl9hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rQWJvcnRlZCwgW251bGwsIGl0ZW1dKTtcbiAgICB9O1xufVxuXG5VcGxvYWRlci5wcm90b3R5cGUuX29uRmlsZXNBZGRlZCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBmaWxlcyA9IGUudGFyZ2V0LmZpbGVzO1xuICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgLy8gSUU3LCBJRTgg5L2O54mI5pys5rWP6KeI5Zmo55qE5aSE55CGXG4gICAgICAgIHZhciBuYW1lID0gZS50YXJnZXQudmFsdWUuc3BsaXQoL1tcXC9cXFxcXS8pLnBvcCgpO1xuICAgICAgICBmaWxlcyA9IFtcbiAgICAgICAgICAgIHtuYW1lOiBuYW1lLCBzaXplOiAwfVxuICAgICAgICBdO1xuICAgIH1cbiAgICBmaWxlcyA9IHRoaXMuX2ZpbHRlckZpbGVzKGZpbGVzKTtcbiAgICBpZiAodS5pc0FycmF5KGZpbGVzKSAmJiBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHRvdGFsQnl0ZXMgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGZpbGVzW2ldO1xuXG4gICAgICAgICAgICAvLyDov5nph4zmmK8gYWJvcnQg55qE6buY6K6k5a6e546w77yM5byA5aeL5LiK5Lyg55qE5pe25YCZ77yM5Lya5pS55oiQ5Y+m5aSW55qE5LiA56eN5a6e546w5pa55byPXG4gICAgICAgICAgICAvLyDpu5jorqTnmoTlrp7njrDmmK/kuLrkuobmlK/mjIHlnKjmsqHmnInlvIDlp4vkuIrkvKDkuYvliY3vvIzkuZ/lj6/ku6Xlj5bmtojkuIrkvKDnmoTpnIDmsYJcbiAgICAgICAgICAgIGl0ZW0uYWJvcnQgPSBidWlsZEFib3J0SGFuZGxlcihpdGVtLCBzZWxmKTtcblxuICAgICAgICAgICAgLy8g5YaF6YOo55qEIHV1aWTvvIzlpJbpg6jkuZ/lj6/ku6Xkvb/nlKjvvIzmr5TlpoIgcmVtb3ZlKGl0ZW0udXVpZCkgLyByZW1vdmUoaXRlbSlcbiAgICAgICAgICAgIGl0ZW0udXVpZCA9IHV0aWxzLnV1aWQoKTtcblxuICAgICAgICAgICAgdG90YWxCeXRlcyArPSBpdGVtLnNpemU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbmV0d29ya0luZm8udG90YWxCeXRlcyArPSB0b3RhbEJ5dGVzO1xuICAgICAgICB0aGlzLl9maWxlcy5wdXNoLmFwcGx5KHRoaXMuX2ZpbGVzLCBmaWxlcyk7XG4gICAgICAgIHRoaXMuX2ludm9rZShldmVudHMua0ZpbGVzQWRkZWQsIFtmaWxlc10pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b19zdGFydCkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl9vbkVycm9yID0gZnVuY3Rpb24gKGUpIHtcbn07XG5cbi8qKlxuICog5aSE55CG5LiK5Lyg6L+b5bqm55qE5Zue5o6J5Ye95pWwLlxuICogMS4g6L+Z6YeM6KaB5Yy65YiG5paH5Lu255qE5LiK5Lyg6L+Y5piv5YiG54mH55qE5LiK5Lyg77yM5YiG54mH55qE5LiK5Lyg5piv6YCa6L+HIHBhcnROdW1iZXIg5ZKMIHVwbG9hZElkIOeahOe7hOWQiOadpeWIpOaWreeahFxuICogMi4gSUU2LDcsOCw55LiL6Z2i77yM5piv5LiN6ZyA6KaB6ICD6JmR55qE77yM5Zug5Li65LiN5Lya6Kem5Y+R6L+Z5Liq5LqL5Lu277yM6ICM5piv55u05o6l5ZyoIF9zZW5kUG9zdFJlcXVlc3Qg6Kem5Y+RIGtVcGxvYWRQcm9ncmVzcyDkuoZcbiAqIDMuIOWFtuWug+aDheWGteS4i++8jOaIkeS7rOWIpOaWreS4gOS4iyBSZXF1ZXN0IEJvZHkg55qE57G75Z6L5piv5ZCm5pivIEJsb2LvvIzku47ogIzpgb/lhY3lr7nkuo7lhbblroPnsbvlnovnmoTor7fmsYLvvIzop6blj5Ega1VwbG9hZFByb2dyZXNzXG4gKiAgICDkvovlpoLvvJpIRUFE77yMR0VU77yMUE9TVChJbml0TXVsdGlwYXJ0KSDnmoTml7blgJnvvIzmmK/msqHlv4XopoHop6blj5Ega1VwbG9hZFByb2dyZXNzIOeahFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBlICBQcm9ncmVzcyBFdmVudCDlr7nosaEuXG4gKiBAcGFyYW0ge09iamVjdH0gaHR0cENvbnRleHQgc2VuZEhUVFBSZXF1ZXN0IOeahOWPguaVsFxuICovXG5VcGxvYWRlci5wcm90b3R5cGUuX29uVXBsb2FkUHJvZ3Jlc3MgPSBmdW5jdGlvbiAoZSwgaHR0cENvbnRleHQpIHtcbiAgICB2YXIgYXJncyA9IGh0dHBDb250ZXh0LmFyZ3M7XG4gICAgdmFyIGZpbGUgPSBhcmdzLmJvZHk7XG5cbiAgICBpZiAoIXV0aWxzLmlzQmxvYihmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHByb2dyZXNzID0gZS5sZW5ndGhDb21wdXRhYmxlXG4gICAgICAgID8gZS5sb2FkZWQgLyBlLnRvdGFsXG4gICAgICAgIDogMDtcblxuICAgIHRoaXMuX25ldHdvcmtJbmZvLmxvYWRlZEJ5dGVzICs9IChlLmxvYWRlZCAtIGZpbGUuX3ByZXZpb3VzTG9hZGVkKTtcbiAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtOZXR3b3JrU3BlZWQsIHRoaXMuX25ldHdvcmtJbmZvLmR1bXAoKSk7XG4gICAgZmlsZS5fcHJldmlvdXNMb2FkZWQgPSBlLmxvYWRlZDtcblxuICAgIHZhciBldmVudFR5cGUgPSBldmVudHMua1VwbG9hZFByb2dyZXNzO1xuICAgIGlmIChhcmdzLnBhcmFtcy5wYXJ0TnVtYmVyICYmIGFyZ3MucGFyYW1zLnVwbG9hZElkKSB7XG4gICAgICAgIC8vIElFNiw3LDgsOeS4i+mdouS4jeS8muaciXBhcnROdW1iZXLlkox1cGxvYWRJZFxuICAgICAgICAvLyDmraTml7bnmoQgZmlsZSDmmK8gc2xpY2Ug55qE57uT5p6c77yM5Y+v6IO95rKh5pyJ6Ieq5a6a5LmJ55qE5bGe5oCnXG4gICAgICAgIC8vIOavlOWmgiBkZW1vIOmHjOmdoueahCBfX2lkLCBfX21lZGlhSWQg5LmL57G755qEXG4gICAgICAgIGV2ZW50VHlwZSA9IGV2ZW50cy5rVXBsb2FkUGFydFByb2dyZXNzO1xuICAgIH1cblxuICAgIHRoaXMuX2ludm9rZShldmVudFR5cGUsIFtmaWxlLCBwcm9ncmVzcywgZV0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgICBpdGVtID0gdGhpcy5fdXBsb2FkaW5nRmlsZXNbaXRlbV0gfHwgdS5maW5kKHRoaXMuX2ZpbGVzLCBmdW5jdGlvbiAoZmlsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZpbGUudXVpZCA9PT0gaXRlbTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0uYWJvcnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaXRlbS5hYm9ydCgpO1xuICAgIH1cbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5fd29ya2luZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ZpbGVzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl93b3JraW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fYWJvcnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbmV0d29ya0luZm8ucmVzZXQoKTtcblxuICAgICAgICB2YXIgdGFza1BhcmFsbGVsID0gdGhpcy5vcHRpb25zLmJvc190YXNrX3BhcmFsbGVsO1xuICAgICAgICAvLyDov5nph4zmsqHmnInkvb/nlKggYXN5bmMuZWFjaExpbWl0IOeahOWOn+WboOaYryB0aGlzLl9maWxlcyDlj6/og73kvJrooqvliqjmgIHnmoTkv67mlLlcbiAgICAgICAgdXRpbHMuZWFjaExpbWl0KHRoaXMuX2ZpbGVzLCB0YXNrUGFyYWxsZWwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZmlsZSwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBmaWxlLl9wcmV2aW91c0xvYWRlZCA9IDA7XG4gICAgICAgICAgICAgICAgc2VsZi5fdXBsb2FkTmV4dChmaWxlKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmdWxmaWxsbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSlbXG4gICAgICAgICAgICAgICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVqZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fdXBsb2FkaW5nRmlsZXNbZmlsZS51dWlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl93b3JraW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZi5fZmlsZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9uZXR3b3JrSW5mby50b3RhbEJ5dGVzID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtVcGxvYWRDb21wbGV0ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9hYm9ydCA9IHRydWU7XG4gICAgdGhpcy5fd29ya2luZyA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiDliqjmgIHorr7nva4gVXBsb2FkZXIg55qE5p+Q5Lqb5Y+C5pWw77yM5b2T5YmN5Y+q5pSv5oyB5Yqo5oCB55qE5L+u5pS5XG4gKiBib3NfY3JlZGVudGlhbHMsIHVwdG9rZW4sIGJvc19idWNrZXQsIGJvc19lbmRwb2ludFxuICogYm9zX2FrLCBib3Nfc2tcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyDnlKjmiLfliqjmgIHorr7nva7nmoTlj4LmlbDvvIjlj6rmlK/mjIHpg6jliIbvvIlcbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBzdXBwb3J0ZWRPcHRpb25zID0gdS5waWNrKG9wdGlvbnMsICdib3NfY3JlZGVudGlhbHMnLFxuICAgICAgICAnYm9zX2FrJywgJ2Jvc19zaycsICd1cHRva2VuJywgJ2Jvc19idWNrZXQnLCAnYm9zX2VuZHBvaW50Jyk7XG4gICAgdGhpcy5vcHRpb25zID0gdS5leHRlbmQodGhpcy5vcHRpb25zLCBzdXBwb3J0ZWRPcHRpb25zKTtcblxuICAgIHZhciBjb25maWcgPSB0aGlzLmNsaWVudCAmJiB0aGlzLmNsaWVudC5jb25maWc7XG4gICAgaWYgKGNvbmZpZykge1xuICAgICAgICB2YXIgY3JlZGVudGlhbHMgPSBudWxsO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmJvc19jcmVkZW50aWFscykge1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSBvcHRpb25zLmJvc19jcmVkZW50aWFscztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zLmJvc19hayAmJiBvcHRpb25zLmJvc19zaykge1xuICAgICAgICAgICAgY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICAgICAgYWs6IG9wdGlvbnMuYm9zX2FrLFxuICAgICAgICAgICAgICAgIHNrOiBvcHRpb25zLmJvc19za1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmJvc19jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzO1xuICAgICAgICAgICAgY29uZmlnLmNyZWRlbnRpYWxzID0gY3JlZGVudGlhbHM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMudXB0b2tlbikge1xuICAgICAgICAgICAgY29uZmlnLnNlc3Npb25Ub2tlbiA9IG9wdGlvbnMudXB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5ib3NfZW5kcG9pbnQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5lbmRwb2ludCA9IHV0aWxzLm5vcm1hbGl6ZUVuZHBvaW50KG9wdGlvbnMuYm9zX2VuZHBvaW50KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog5pyJ55qE55So5oi35biM5pyb5Li75Yqo5pu05pawIHN0cyB0b2tlbu+8jOmBv+WFjei/h+acn+eahOmXrumimFxuICpcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5yZWZyZXNoU3RzVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gc2VsZi5vcHRpb25zO1xuICAgIHZhciBzdHNNb2RlID0gc2VsZi5feGhyMlN1cHBvcnRlZFxuICAgICAgICAmJiBvcHRpb25zLnVwdG9rZW5fdXJsXG4gICAgICAgICYmIG9wdGlvbnMuZ2V0X25ld191cHRva2VuID09PSBmYWxzZTtcbiAgICBpZiAoc3RzTW9kZSkge1xuICAgICAgICB2YXIgc3RtID0gbmV3IFN0c1Rva2VuTWFuYWdlcihvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHN0bS5nZXQob3B0aW9ucy5ib3NfYnVja2V0KS50aGVuKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgICAgICBib3NfYWs6IHBheWxvYWQuQWNjZXNzS2V5SWQsXG4gICAgICAgICAgICAgICAgYm9zX3NrOiBwYXlsb2FkLlNlY3JldEFjY2Vzc0tleSxcbiAgICAgICAgICAgICAgICB1cHRva2VuOiBwYXlsb2FkLlNlc3Npb25Ub2tlblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX3VwbG9hZE5leHQgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgIGlmICh0aGlzLl9hYm9ydCkge1xuICAgICAgICB0aGlzLl93b3JraW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZS5fYWJvcnRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHRocm93RXJyb3JzID0gdHJ1ZTtcbiAgICB2YXIgcmV0dXJuVmFsdWUgPSB0aGlzLl9pbnZva2UoZXZlbnRzLmtCZWZvcmVVcGxvYWQsIFtmaWxlXSwgdGhyb3dFcnJvcnMpO1xuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gUS5yZXNvbHZlKHJldHVyblZhbHVlKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5fdXBsb2FkTmV4dEltcGwoZmlsZSk7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgc2VsZi5faW52b2tlKGV2ZW50cy5rRXJyb3IsIFtlcnJvciwgZmlsZV0pO1xuICAgICAgICB9KTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fdXBsb2FkTmV4dEltcGwgPSBmdW5jdGlvbiAoZmlsZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICB2YXIgb2JqZWN0ID0gZmlsZS5uYW1lO1xuICAgIHZhciB0aHJvd0Vycm9ycyA9IHRydWU7XG5cbiAgICB2YXIgZGVmYXVsdFRhc2tPcHRpb25zID0gdS5waWNrKG9wdGlvbnMsXG4gICAgICAgICdmbGFzaF9zd2ZfdXJsJywgJ21heF9yZXRyaWVzJywgJ2NodW5rX3NpemUnLCAncmV0cnlfaW50ZXJ2YWwnLFxuICAgICAgICAnYm9zX211bHRpcGFydF9wYXJhbGxlbCcsXG4gICAgICAgICdib3NfbXVsdGlwYXJ0X2F1dG9fY29udGludWUnLFxuICAgICAgICAnYm9zX211bHRpcGFydF9sb2NhbF9rZXlfZ2VuZXJhdG9yJ1xuICAgICk7XG4gICAgcmV0dXJuIFEuYWxsKFtcbiAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rS2V5LCBbZmlsZV0sIHRocm93RXJyb3JzKSxcbiAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rT2JqZWN0TWV0YXMsIFtmaWxlXSlcbiAgICBdKS50aGVuKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICAvLyBvcHRpb25zLmJvc19idWNrZXQg5Y+v6IO95Lya6KKrIGtLZXkg5LqL5Lu25Yqo5oCB55qE5pS55Y+YXG4gICAgICAgIHZhciBidWNrZXQgPSBvcHRpb25zLmJvc19idWNrZXQ7XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IGFycmF5WzBdO1xuICAgICAgICB2YXIgb2JqZWN0TWV0YXMgPSBhcnJheVsxXTtcblxuICAgICAgICB2YXIgbXVsdGlwYXJ0ID0gJ2F1dG8nO1xuICAgICAgICBpZiAodS5pc1N0cmluZyhyZXN1bHQpKSB7XG4gICAgICAgICAgICBvYmplY3QgPSByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodS5pc09iamVjdChyZXN1bHQpKSB7XG4gICAgICAgICAgICBidWNrZXQgPSByZXN1bHQuYnVja2V0IHx8IGJ1Y2tldDtcbiAgICAgICAgICAgIG9iamVjdCA9IHJlc3VsdC5rZXkgfHwgb2JqZWN0O1xuXG4gICAgICAgICAgICAvLyAnYXV0bycgLyAnb2ZmJ1xuICAgICAgICAgICAgbXVsdGlwYXJ0ID0gcmVzdWx0Lm11bHRpcGFydCB8fCBtdWx0aXBhcnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2xpZW50ID0gc2VsZi5jbGllbnQ7XG4gICAgICAgIHZhciBldmVudERpc3BhdGNoZXIgPSBzZWxmO1xuICAgICAgICB2YXIgdGFza09wdGlvbnMgPSB1LmV4dGVuZChkZWZhdWx0VGFza09wdGlvbnMsIHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgICAgIG9iamVjdDogb2JqZWN0LFxuICAgICAgICAgICAgbWV0YXM6IG9iamVjdE1ldGFzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBUYXNrQ29uc3RydWN0b3IgPSBQdXRPYmplY3RUYXNrO1xuICAgICAgICBpZiAobXVsdGlwYXJ0ID09PSAnYXV0bydcbiAgICAgICAgICAgIC8vIOWvueS6jiBtb3hpZS5YTUxIdHRwUmVxdWVzdCDmnaXor7TvvIzml6Dms5Xojrflj5YgZ2V0UmVzcG9uc2VIZWFkZXIoJ0VUYWcnKVxuICAgICAgICAgICAgLy8g5a+86Ie05ZyoIGNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkIOeahOaXtuWAme+8jOaXoOazleS8oOmAkuato+ehrueahOWPguaVsFxuICAgICAgICAgICAgLy8g5Zug5q2k6ZyA6KaB56aB5q2i5L2/55SoIG1veGllLlhNTEh0dHBSZXF1ZXN0IOS9v+eUqCBNdWx0aXBhcnRUYXNrXG4gICAgICAgICAgICAvLyDpmaTpnZ7nlKjoh6rlt7HmnKzlnLDorqHnrpfnmoQgbWQ1IOS9nOS4uiBnZXRSZXNwb25zZUhlYWRlcignRVRhZycpIOeahOS7o+abv+WAvO+8jOS4jei/h+i/mOaYr+acieS4gOS6m+mXrumimO+8mlxuICAgICAgICAgICAgLy8gMS4gTXVsdGlwYXJ0VGFzayDpnIDopoHlr7nmlofku7bov5vooYzliIbniYfvvIzkvYbmmK/kvb/nlKggbW94aWUuWE1MSHR0cFJlcXVlc3Qg55qE5pe25YCZ77yM5piO5pi+5pyJ5Y2h6aG/55qE6Zeu6aKY77yI5Zug5Li6IEZsYXNoIOaKiuaVtOS4quaWh+S7tumDveivu+WPluWIsOWGheWtmOS4re+8jOeEtuWQjuWGjeWIhueJh++8iVxuICAgICAgICAgICAgLy8gICAg5a+86Ie05aSE55CG5aSn5paH5Lu255qE5pe25YCZ5oCn6IO95b6I5beuXG4gICAgICAgICAgICAvLyAyLiDmnKzlnLDorqHnrpcgbWQ1IOmcgOimgemineWkluW8leWFpeW6k++8jOWvvOiHtCBiY2UtYm9zLXVwbG9hZGVyIOeahOS9k+enr+WPmOWkp1xuICAgICAgICAgICAgLy8g57u85LiK5omA6L+w77yM5Zyo5L2/55SoIG1veGllIOeahOaXtuWAme+8jOemgeatoiBNdWx0aXBhcnRUYXNrXG4gICAgICAgICAgICAmJiBzZWxmLl94aHIyU3VwcG9ydGVkXG4gICAgICAgICAgICAmJiBmaWxlLnNpemUgPiBvcHRpb25zLmJvc19tdWx0aXBhcnRfbWluX3NpemUpIHtcbiAgICAgICAgICAgIFRhc2tDb25zdHJ1Y3RvciA9IE11bHRpcGFydFRhc2s7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhc2sgPSBuZXcgVGFza0NvbnN0cnVjdG9yKGNsaWVudCwgZXZlbnREaXNwYXRjaGVyLCB0YXNrT3B0aW9ucyk7XG5cbiAgICAgICAgc2VsZi5fdXBsb2FkaW5nRmlsZXNbZmlsZS51dWlkXSA9IGZpbGU7XG5cbiAgICAgICAgZmlsZS5hYm9ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZpbGUuX2Fib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHRhc2suYWJvcnQoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0YXNrLnNldE5ldHdvcmtJbmZvKHNlbGYuX25ldHdvcmtJbmZvKTtcbiAgICAgICAgcmV0dXJuIHRhc2suc3RhcnQoKTtcbiAgICB9KTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgZXZlbnRBcmd1bWVudHMsIHRocm93RXJyb3JzKSB7XG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gZXZlbnRzLmtBYm9ydGVkXG4gICAgICAgICYmIGV2ZW50QXJndW1lbnRzXG4gICAgICAgICYmIGV2ZW50QXJndW1lbnRzWzFdKSB7XG4gICAgICAgIHZhciBmaWxlID0gZXZlbnRBcmd1bWVudHNbMV07XG4gICAgICAgIGlmIChmaWxlLnNpemUgPiAwKSB7XG4gICAgICAgICAgICB2YXIgbG9hZGVkU2l6ZSA9IGZpbGUuX3ByZXZpb3VzTG9hZGVkIHx8IDA7XG4gICAgICAgICAgICB0aGlzLl9uZXR3b3JrSW5mby50b3RhbEJ5dGVzIC09IChmaWxlLnNpemUgLSBsb2FkZWRTaXplKTtcbiAgICAgICAgICAgIHRoaXMuX2ludm9rZShldmVudHMua05ldHdvcmtTcGVlZCwgdGhpcy5fbmV0d29ya0luZm8uZHVtcCgpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5faW52b2tlKGV2ZW50TmFtZSwgZXZlbnRBcmd1bWVudHMsIHRocm93RXJyb3JzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVXBsb2FkZXI7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHV0aWxzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgcXNNb2R1bGUgPSByZXF1aXJlKDQ1KTtcbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIGhlbHBlciA9IHJlcXVpcmUoNDIpO1xudmFyIFF1ZXVlID0gcmVxdWlyZSgyOCk7XG52YXIgTWltZVR5cGUgPSByZXF1aXJlKDIxKTtcblxuLyoqXG4gKiDmiormlofku7bov5vooYzliIfniYfvvIzov5Tlm57liIfniYfkuYvlkI7nmoTmlbDnu4RcbiAqXG4gKiBAcGFyYW0ge0Jsb2J9IGZpbGUg6ZyA6KaB5YiH54mH55qE5aSn5paH5Lu2LlxuICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElkIOS7juacjeWKoeiOt+WPlueahHVwbG9hZElkLlxuICogQHBhcmFtIHtudW1iZXJ9IGNodW5rU2l6ZSDliIbniYfnmoTlpKflsI8uXG4gKiBAcGFyYW0ge3N0cmluZ30gYnVja2V0IEJ1Y2tldCBOYW1lLlxuICogQHBhcmFtIHtzdHJpbmd9IG9iamVjdCBPYmplY3QgTmFtZS5cbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5leHBvcnRzLmdldFRhc2tzID0gZnVuY3Rpb24gKGZpbGUsIHVwbG9hZElkLCBjaHVua1NpemUsIGJ1Y2tldCwgb2JqZWN0KSB7XG4gICAgdmFyIGxlZnRTaXplID0gZmlsZS5zaXplO1xuICAgIHZhciBvZmZzZXQgPSAwO1xuICAgIHZhciBwYXJ0TnVtYmVyID0gMTtcblxuICAgIHZhciB0YXNrcyA9IFtdO1xuXG4gICAgd2hpbGUgKGxlZnRTaXplID4gMCkge1xuICAgICAgICB2YXIgcGFydFNpemUgPSBNYXRoLm1pbihsZWZ0U2l6ZSwgY2h1bmtTaXplKTtcblxuICAgICAgICB0YXNrcy5wdXNoKHtcbiAgICAgICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgICAgICB1cGxvYWRJZDogdXBsb2FkSWQsXG4gICAgICAgICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgICAgIG9iamVjdDogb2JqZWN0LFxuICAgICAgICAgICAgcGFydE51bWJlcjogcGFydE51bWJlcixcbiAgICAgICAgICAgIHBhcnRTaXplOiBwYXJ0U2l6ZSxcbiAgICAgICAgICAgIHN0YXJ0OiBvZmZzZXQsXG4gICAgICAgICAgICBzdG9wOiBvZmZzZXQgKyBwYXJ0U2l6ZSAtIDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGVmdFNpemUgLT0gcGFydFNpemU7XG4gICAgICAgIG9mZnNldCArPSBwYXJ0U2l6ZTtcbiAgICAgICAgcGFydE51bWJlciArPSAxO1xuICAgIH1cblxuICAgIHJldHVybiB0YXNrcztcbn07XG5cbmV4cG9ydHMuZ2V0QXBwZW5kYWJsZVRhc2tzID0gZnVuY3Rpb24gKGZpbGVTaXplLCBvZmZzZXQsIGNodW5rU2l6ZSkge1xuICAgIHZhciBsZWZ0U2l6ZSA9IGZpbGVTaXplIC0gb2Zmc2V0O1xuICAgIHZhciB0YXNrcyA9IFtdO1xuXG4gICAgd2hpbGUgKGxlZnRTaXplKSB7XG4gICAgICAgIHZhciBwYXJ0U2l6ZSA9IE1hdGgubWluKGxlZnRTaXplLCBjaHVua1NpemUpO1xuICAgICAgICB0YXNrcy5wdXNoKHtcbiAgICAgICAgICAgIHBhcnRTaXplOiBwYXJ0U2l6ZSxcbiAgICAgICAgICAgIHN0YXJ0OiBvZmZzZXQsXG4gICAgICAgICAgICBzdG9wOiBvZmZzZXQgKyBwYXJ0U2l6ZSAtIDFcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGVmdFNpemUgLT0gcGFydFNpemU7XG4gICAgICAgIG9mZnNldCArPSBwYXJ0U2l6ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRhc2tzO1xufTtcblxuZXhwb3J0cy5wYXJzZVNpemUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICAgIGlmICh0eXBlb2Ygc2l6ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgfVxuXG4gICAgLy8gbWIgTUIgTWIgTVxuICAgIC8vIGtiIEtCIGtiIGtcbiAgICAvLyAxMDBcbiAgICB2YXIgcGF0dGVybiA9IC9eKFtcXGRcXC5dKykoW21rZ10/Yj8pJC9pO1xuICAgIHZhciBtYXRjaCA9IHBhdHRlcm4uZXhlYyhzaXplKTtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIHZhciAkMSA9IG1hdGNoWzFdO1xuICAgIHZhciAkMiA9IG1hdGNoWzJdO1xuICAgIGlmICgvXmsvaS50ZXN0KCQyKSkge1xuICAgICAgICByZXR1cm4gJDEgKiAxMDI0O1xuICAgIH1cbiAgICBlbHNlIGlmICgvXm0vaS50ZXN0KCQyKSkge1xuICAgICAgICByZXR1cm4gJDEgKiAxMDI0ICogMTAyNDtcbiAgICB9XG4gICAgZWxzZSBpZiAoL15nL2kudGVzdCgkMikpIHtcbiAgICAgICAgcmV0dXJuICQxICogMTAyNCAqIDEwMjQgKiAxMDI0O1xuICAgIH1cbiAgICByZXR1cm4gKyQxO1xufTtcblxuLyoqXG4gKiDliKTmlq3kuIDkuIvmtY/op4jlmajmmK/lkKbmlK/mjIEgeGhyMiDnibnmgKfvvIzlpoLmnpzkuI3mlK/mjIHvvIzlsLEgZmFsbGJhY2sg5YiwIFBvc3RPYmplY3RcbiAqIOadpeS4iuS8oOaWh+S7tlxuICpcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydHMuaXNYaHIyU3VwcG9ydGVkID0gZnVuY3Rpb24gKCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Nb2Rlcm5penIvTW9kZXJuaXpyL2Jsb2IvZjgzOWUyNTc5ZGEyYzYzMzFlYWFkOTIyYWU1Y2Q2OTFhYWM3YWI2Mi9mZWF0dXJlLWRldGVjdHMvbmV0d29yay94aHIyLmpzXG4gICAgcmV0dXJuICdYTUxIdHRwUmVxdWVzdCcgaW4gd2luZG93ICYmICd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xufTtcblxuZXhwb3J0cy5pc0FwcGVuZGFibGUgPSBmdW5jdGlvbiAoaGVhZGVycykge1xuICAgIHJldHVybiBoZWFkZXJzWyd4LWJjZS1vYmplY3QtdHlwZSddID09PSAnQXBwZW5kYWJsZSc7XG59O1xuXG5leHBvcnRzLmRlbGF5ID0gZnVuY3Rpb24gKG1zKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgfSwgbXMpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLyoqXG4gKiDop4TojIPljJbnlKjmiLfnmoTovpPlhaVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnQgVGhlIGVuZHBvaW50IHdpbGwgYmUgbm9ybWFsaXplZFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLm5vcm1hbGl6ZUVuZHBvaW50ID0gZnVuY3Rpb24gKGVuZHBvaW50KSB7XG4gICAgcmV0dXJuIGVuZHBvaW50LnJlcGxhY2UoLyhcXC8rKSQvLCAnJyk7XG59O1xuXG5leHBvcnRzLmdldERlZmF1bHRBQ0wgPSBmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYWNjZXNzQ29udHJvbExpc3Q6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlOiAnYmNlOmJvcycsXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAnKicsXG4gICAgICAgICAgICAgICAgZWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIHJlc291cmNlOiBbYnVja2V0ICsgJy8qJ10sXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbjogWydSRUFEJywgJ1dSSVRFJ11cbiAgICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgIH07XG59O1xuXG4vKipcbiAqIOeUn+aIkHV1aWRcbiAqXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMudXVpZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmFuZG9tID0gKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygyLCAzMikpLnRvU3RyaW5nKDM2KTtcbiAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuICd1LScgKyB0aW1lc3RhbXAgKyAnLScgKyByYW5kb207XG59O1xuXG4vKipcbiAqIOeUn+aIkOacrOWcsCBsb2NhbFN0b3JhZ2Ug5Lit55qEa2V577yM5p2l5a2Y5YKoIHVwbG9hZElkXG4gKiBsb2NhbFN0b3JhZ2Vba2V5XSA9IHVwbG9hZElkXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbiDkuIDkupvlj6/ku6XnlKjmnaXorqHnrpdrZXnnmoTlj4LmlbAuXG4gKiBAcGFyYW0ge3N0cmluZ30gZ2VuZXJhdG9yIOWGhee9rueahOWPquaciSBkZWZhdWx0IOWSjCBtZDVcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbmV4cG9ydHMuZ2VuZXJhdGVMb2NhbEtleSA9IGZ1bmN0aW9uIChvcHRpb24sIGdlbmVyYXRvcikge1xuICAgIGlmIChnZW5lcmF0b3IgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKFtcbiAgICAgICAgICAgIG9wdGlvbi5ibG9iLm5hbWUsIG9wdGlvbi5ibG9iLnNpemUsXG4gICAgICAgICAgICBvcHRpb24uY2h1bmtTaXplLCBvcHRpb24uYnVja2V0LFxuICAgICAgICAgICAgb3B0aW9uLm9iamVjdFxuICAgICAgICBdLmpvaW4oJyYnKSk7XG4gICAgfVxuICAgIHJldHVybiBRLnJlc29sdmUobnVsbCk7XG59O1xuXG5leHBvcnRzLmdldERlZmF1bHRQb2xpY3kgPSBmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgaWYgKGJ1Y2tldCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIC8vIOm7mOiupOaYryAyNOWwj+aXtiDkuYvlkI7liLDmnJ9cbiAgICB2YXIgZXhwaXJhdGlvbiA9IG5ldyBEYXRlKG5vdyArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgIHZhciB1dGNEYXRlVGltZSA9IGhlbHBlci50b1VUQ1N0cmluZyhleHBpcmF0aW9uKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGV4cGlyYXRpb246IHV0Y0RhdGVUaW1lLFxuICAgICAgICBjb25kaXRpb25zOiBbXG4gICAgICAgICAgICB7YnVja2V0OiBidWNrZXR9XG4gICAgICAgIF1cbiAgICB9O1xufTtcblxuLyoqXG4gKiDmoLnmja5rZXnojrflj5Zsb2NhbFN0b3JhZ2XkuK3nmoR1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkg6ZyA6KaB5p+l6K+i55qEa2V5XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZ2V0VXBsb2FkSWQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG59O1xuXG5cbi8qKlxuICog5qC55o2ua2V56K6+572ubG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICogQHBhcmFtIHtzdHJpbmd9IHVwbG9hZElkIOmcgOimgeiuvue9rueahHVwbG9hZElkXG4gKi9cbmV4cG9ydHMuc2V0VXBsb2FkSWQgPSBmdW5jdGlvbiAoa2V5LCB1cGxvYWRJZCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdXBsb2FkSWQpO1xufTtcblxuLyoqXG4gKiDmoLnmja5rZXnliKDpmaRsb2NhbFN0b3JhZ2XkuK3nmoR1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkg6ZyA6KaB5p+l6K+i55qEa2V5XG4gKi9cbmV4cG9ydHMucmVtb3ZlVXBsb2FkSWQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbn07XG5cbi8qKlxuICog5Y+W5b6X5bey5LiK5Lyg5YiG5Z2X55qEZXRhZ1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBwYXJ0TnVtYmVyIOWIhueJh+W6j+WPty5cbiAqIEBwYXJhbSB7QXJyYXl9IGV4aXN0UGFydHMg5bey5LiK5Lyg5a6M5oiQ55qE5YiG54mH5L+h5oGvLlxuICogQHJldHVybiB7c3RyaW5nfSDmjIflrprliIbniYfnmoRldGFnXG4gKi9cbmZ1bmN0aW9uIGdldFBhcnRFdGFnKHBhcnROdW1iZXIsIGV4aXN0UGFydHMpIHtcbiAgICB2YXIgbWF0Y2hQYXJ0cyA9IHUuZmlsdGVyKGV4aXN0UGFydHMgfHwgW10sIGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgIHJldHVybiArcGFydC5wYXJ0TnVtYmVyID09PSBwYXJ0TnVtYmVyO1xuICAgIH0pO1xuICAgIHJldHVybiBtYXRjaFBhcnRzLmxlbmd0aCA/IG1hdGNoUGFydHNbMF0uZVRhZyA6IG51bGw7XG59XG5cbi8qKlxuICog5Zug5Li6IGxpc3RQYXJ0cyDkvJrov5Tlm54gcGFydE51bWJlciDlkowgZXRhZyDnmoTlr7nlupTlhbPns7tcbiAqIOaJgOS7pSBsaXN0UGFydHMg6L+U5Zue55qE57uT5p6c77yM57uZIHRhc2tzIOS4reWQiOmAgueahOWFg+e0oOiuvue9riBldGFnIOWxnuaAp++8jOS4iuS8oFxuICog55qE5pe25YCZ5bCx5Y+v5Lul6Lez6L+H6L+Z5LqbIHBhcnRcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSB0YXNrcyDmnKzlnLDliIfliIblpb3nmoTku7vliqEuXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+fSBwYXJ0cyDmnI3liqHnq6/ov5Tlm57nmoTlt7Lnu4/kuIrkvKDnmoRwYXJ0cy5cbiAqL1xuZXhwb3J0cy5maWx0ZXJUYXNrcyA9IGZ1bmN0aW9uICh0YXNrcywgcGFydHMpIHtcbiAgICB1LmVhY2godGFza3MsIGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgIHZhciBwYXJ0TnVtYmVyID0gdGFzay5wYXJ0TnVtYmVyO1xuICAgICAgICB2YXIgZXRhZyA9IGdldFBhcnRFdGFnKHBhcnROdW1iZXIsIHBhcnRzKTtcbiAgICAgICAgaWYgKGV0YWcpIHtcbiAgICAgICAgICAgIHRhc2suZXRhZyA9IGV0YWc7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICog5oqK55So5oi36L6T5YWl55qE6YWN572u6L2s5YyW5oiQIGh0bWw1IOWSjCBmbGFzaCDlj6/ku6XmjqXmlLbnmoTlhoXlrrkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8QXJyYXl9IGFjY2VwdCDmlK/mjIHmlbDnu4TlkozlrZfnrKbkuLLnmoTphY3nva5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5leHBhbmRBY2NlcHQgPSBmdW5jdGlvbiAoYWNjZXB0KSB7XG4gICAgdmFyIGV4dHMgPSBbXTtcblxuICAgIGlmICh1LmlzQXJyYXkoYWNjZXB0KSkge1xuICAgICAgICAvLyBGbGFzaOimgeaxgueahOagvOW8j1xuICAgICAgICB1LmVhY2goYWNjZXB0LCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0uZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgICAgIGV4dHMucHVzaC5hcHBseShleHRzLCBpdGVtLmV4dGVuc2lvbnMuc3BsaXQoJywnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh1LmlzU3RyaW5nKGFjY2VwdCkpIHtcbiAgICAgICAgZXh0cyA9IGFjY2VwdC5zcGxpdCgnLCcpO1xuICAgIH1cblxuICAgIC8vIOS4uuS6huS/neivgeWFvOWuueaAp++8jOaKiiBtaW1lVHlwZXMg5ZKMIGV4dHMg6YO96L+U5Zue5Zue5Y67XG4gICAgZXh0cyA9IHUubWFwKGV4dHMsIGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgcmV0dXJuIC9eXFwuLy50ZXN0KGV4dCkgPyBleHQgOiAoJy4nICsgZXh0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBleHRzLmpvaW4oJywnKTtcbn07XG5cbmV4cG9ydHMuZXh0VG9NaW1lVHlwZSA9IGZ1bmN0aW9uIChleHRzKSB7XG4gICAgdmFyIG1pbWVUeXBlcyA9IHUubWFwKGV4dHMuc3BsaXQoJywnKSwgZnVuY3Rpb24gKGV4dCkge1xuICAgICAgICBpZiAoZXh0LmluZGV4T2YoJy8nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBleHQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1pbWVUeXBlLmd1ZXNzKGV4dCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWltZVR5cGVzLmpvaW4oJywnKTtcbn07XG5cbmV4cG9ydHMuZXhwYW5kQWNjZXB0VG9BcnJheSA9IGZ1bmN0aW9uIChhY2NlcHQpIHtcbiAgICBpZiAoIWFjY2VwdCB8fCB1LmlzQXJyYXkoYWNjZXB0KSkge1xuICAgICAgICByZXR1cm4gYWNjZXB0O1xuICAgIH1cblxuICAgIGlmICh1LmlzU3RyaW5nKGFjY2VwdCkpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHt0aXRsZTogJ0FsbCBmaWxlcycsIGV4dGVuc2lvbnM6IGFjY2VwdH1cbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG59O1xuXG4vKipcbiAqIOi9rOWMluS4gOS4iyBib3MgdXJsIOeahOagvOW8j1xuICogaHR0cDovL2JqLmJjZWJvcy5jb20vdjEvJHtidWNrZXR9LyR7b2JqZWN0fSAtPiBodHRwOi8vJHtidWNrZXR9LmJqLmJjZWJvcy5jb20vdjEvJHtvYmplY3R9XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVybCDpnIDopoHovazljJbnmoRVUkwuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMudHJhbnNmb3JtVXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgIHZhciBwYXR0ZXJuID0gLyhodHRwcz86KVxcL1xcLyhbXlxcL10rKVxcLyhbXlxcL10rKVxcLyhbXlxcL10rKS87XG4gICAgcmV0dXJuIHVybC5yZXBsYWNlKHBhdHRlcm4sIGZ1bmN0aW9uIChfLCBwcm90b2NvbCwgaG9zdCwgJDMsICQ0KSB7XG4gICAgICAgIGlmICgvXnZcXGQkLy50ZXN0KCQzKSkge1xuICAgICAgICAgICAgLy8gL3YxLyR7YnVja2V0fS8uLi5cbiAgICAgICAgICAgIHJldHVybiBwcm90b2NvbCArICcvLycgKyAkNCArICcuJyArIGhvc3QgKyAnLycgKyAkMztcbiAgICAgICAgfVxuICAgICAgICAvLyAvJHtidWNrZXR9Ly4uLlxuICAgICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgJDMgKyAnLicgKyBob3N0ICsgJy8nICsgJDQ7XG4gICAgfSk7XG59O1xuXG5leHBvcnRzLmlzQmxvYiA9IGZ1bmN0aW9uIChib2R5KSB7XG4gICAgdmFyIGJsb2JDdG9yID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gQ2hyb21lIEJsb2IgPT09ICdmdW5jdGlvbidcbiAgICAgICAgLy8gU2FmYXJpIEJsb2IgPT09ICd1bmRlZmluZWQnXG4gICAgICAgIGJsb2JDdG9yID0gQmxvYjtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1PeGllICE9PSAndW5kZWZpbmVkJyAmJiB1LmlzRnVuY3Rpb24obU94aWUuQmxvYikpIHtcbiAgICAgICAgYmxvYkN0b3IgPSBtT3hpZS5CbG9iO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBib2R5IGluc3RhbmNlb2YgYmxvYkN0b3I7XG59O1xuXG5leHBvcnRzLm5vdyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG59O1xuXG5leHBvcnRzLnRvREhNUyA9IGZ1bmN0aW9uIChzZWNvbmRzKSB7XG4gICAgdmFyIGRheXMgPSAwO1xuICAgIHZhciBob3VycyA9IDA7XG4gICAgdmFyIG1pbnV0ZXMgPSAwO1xuXG4gICAgaWYgKHNlY29uZHMgPj0gNjApIHtcbiAgICAgICAgbWludXRlcyA9IH5+KHNlY29uZHMgLyA2MCk7XG4gICAgICAgIHNlY29uZHMgPSBzZWNvbmRzIC0gbWludXRlcyAqIDYwO1xuICAgIH1cblxuICAgIGlmIChtaW51dGVzID49IDYwKSB7XG4gICAgICAgIGhvdXJzID0gfn4obWludXRlcyAvIDYwKTtcbiAgICAgICAgbWludXRlcyA9IG1pbnV0ZXMgLSBob3VycyAqIDYwO1xuICAgIH1cblxuICAgIGlmIChob3VycyA+PSAyNCkge1xuICAgICAgICBkYXlzID0gfn4oaG91cnMgLyAyNCk7XG4gICAgICAgIGhvdXJzID0gaG91cnMgLSBkYXlzICogMjQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtERDogZGF5cywgSEg6IGhvdXJzLCBNTTogbWludXRlcywgU1M6IHNlY29uZHN9O1xufTtcblxuZnVuY3Rpb24gcGFyc2VIb3N0KHVybCkge1xuICAgIHZhciBtYXRjaCA9IC9eXFx3KzpcXC9cXC8oW15cXC9dKykvLmV4ZWModXJsKTtcbiAgICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5cbmV4cG9ydHMuZml4WGhyID0gZnVuY3Rpb24gKG9wdGlvbnMsIGlzQm9zKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncywgY29uZmlnKSB7XG4gICAgICAgIHZhciBjbGllbnQgPSB0aGlzO1xuICAgICAgICB2YXIgZW5kcG9pbnRIb3N0ID0gcGFyc2VIb3N0KGNvbmZpZy5lbmRwb2ludCk7XG5cbiAgICAgICAgLy8geC1iY2UtZGF0ZSDlkowgRGF0ZSDkuozpgInkuIDvvIzmmK/lv4XpobvnmoRcbiAgICAgICAgLy8g5L2G5pivIEZsYXNoIOaXoOazleiuvue9riBEYXRl77yM5Zug5q2k5b+F6aG76K6+572uIHgtYmNlLWRhdGVcbiAgICAgICAgYXJncy5oZWFkZXJzWyd4LWJjZS1kYXRlJ10gPSBoZWxwZXIudG9VVENTdHJpbmcobmV3IERhdGUoKSk7XG4gICAgICAgIGFyZ3MuaGVhZGVycy5ob3N0ID0gZW5kcG9pbnRIb3N0O1xuXG4gICAgICAgIC8vIEZsYXNoIOeahOe8k+WtmOiyjOS8vOavlOi+g+WOieWus++8jOW8uuWItuivt+axguaWsOeahFxuICAgICAgICAvLyBYWFgg5aW95YOP5pyN5Yqh5Zmo56uv5LiN5Lya5oqKIC5zdGFtcCDov5nkuKrlj4LmlbDliqDlhaXliLDnrb7lkI3nmoTorqHnrpfpgLvovpHph4zpnaLljrtcbiAgICAgICAgYXJncy5wYXJhbXNbJy5zdGFtcCddID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgLy8g5Y+q5pyJIFBVVCDmiY3kvJrop6blj5EgcHJvZ3Jlc3Mg5LqL5Lu2XG4gICAgICAgIHZhciBvcmlnaW5hbEh0dHBNZXRob2QgPSBodHRwTWV0aG9kO1xuXG4gICAgICAgIGlmIChodHRwTWV0aG9kID09PSAnUFVUJykge1xuICAgICAgICAgICAgLy8gUHV0T2JqZWN0IFB1dFBhcnRzIOmDveWPr+S7peeUqCBQT1NUIOWNj+iuru+8jOiAjOS4lCBGbGFzaCDkuZ/lj6rog73nlKggUE9TVCDljY/orq5cbiAgICAgICAgICAgIGh0dHBNZXRob2QgPSAnUE9TVCc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgeGhyVXJpO1xuICAgICAgICB2YXIgeGhyTWV0aG9kID0gaHR0cE1ldGhvZDtcbiAgICAgICAgdmFyIHhockJvZHkgPSBhcmdzLmJvZHk7XG4gICAgICAgIGlmIChodHRwTWV0aG9kID09PSAnSEVBRCcpIHtcbiAgICAgICAgICAgIC8vIOWboOS4uiBGbGFzaCDnmoQgVVJMUmVxdWVzdCDlj6rog73lj5HpgIEgR0VUIOWSjCBQT1NUIOivt+axglxuICAgICAgICAgICAgLy8gZ2V0T2JqZWN0TWV0YemcgOimgeeUqEhFQUTor7fmsYLvvIzkvYbmmK8gRmxhc2gg5peg5rOV5Y+R6LW36L+Z56eN6K+35rGCXG4gICAgICAgICAgICAvLyDmiYDpnIDpnIDopoHnlKggcmVsYXkg5Lit6L2s5LiA5LiLXG4gICAgICAgICAgICAvLyBYWFgg5Zug5Li6IGJ1Y2tldCDkuI3lj6/og73mmK8gcHJpdmF0Ze+8jOWQpuWImSBjcm9zc2RvbWFpbi54bWwg5piv5peg5rOV6K+75Y+W55qEXG4gICAgICAgICAgICAvLyDmiYDku6Xov5nkuKrmjqXlj6Por7fmsYLnmoTml7blgJnvvIzlj6/ku6XkuI3pnIDopoEgYXV0aG9yaXphdGlvbiDlrZfmrrVcbiAgICAgICAgICAgIHZhciByZWxheVNlcnZlciA9IGV4cG9ydHMubm9ybWFsaXplRW5kcG9pbnQob3B0aW9ucy5ib3NfcmVsYXlfc2VydmVyKTtcbiAgICAgICAgICAgIHhoclVyaSA9IHJlbGF5U2VydmVyICsgJy8nICsgZW5kcG9pbnRIb3N0ICsgcmVzb3VyY2U7XG5cbiAgICAgICAgICAgIGFyZ3MucGFyYW1zLmh0dHBNZXRob2QgPSBodHRwTWV0aG9kO1xuXG4gICAgICAgICAgICB4aHJNZXRob2QgPSAnUE9TVCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNCb3MgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHhoclVyaSA9IGV4cG9ydHMudHJhbnNmb3JtVXJsKGNvbmZpZy5lbmRwb2ludCArIHJlc291cmNlKTtcbiAgICAgICAgICAgIHJlc291cmNlID0geGhyVXJpLnJlcGxhY2UoL15cXHcrOlxcL1xcL1teXFwvXStcXC8vLCAnLycpO1xuICAgICAgICAgICAgYXJncy5oZWFkZXJzLmhvc3QgPSBwYXJzZUhvc3QoeGhyVXJpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHhoclVyaSA9IGNvbmZpZy5lbmRwb2ludCArIHJlc291cmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHhock1ldGhvZCA9PT0gJ1BPU1QnICYmICF4aHJCb2R5KSB7XG4gICAgICAgICAgICAvLyDlv4XpobvopoHmnIkgQk9EWSDmiY3og73mmK8gUE9TVO+8jOWQpuWImeS9oOiuvue9ruS6huS5n+ayoeaciVxuICAgICAgICAgICAgLy8g6ICM5LiU5b+F6aG75pivIFBPU1Qg5omN5Y+v5Lul6K6+572u6Ieq5a6a5LmJ55qEaGVhZGVy77yMR0VU5LiN6KGMXG4gICAgICAgICAgICB4aHJCb2R5ID0gJ3tcIkZPUkNFX1BPU1RcIjogdHJ1ZX0nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgICAgIHZhciB4aHIgPSBuZXcgbU94aWUuWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gbnVsbDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSB8fCAne30nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID49IDIwMCAmJiB4aHIuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKGh0dHBNZXRob2QgPT09ICdIRUFEJykge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cF9oZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c19jb2RlOiB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiByZXNwb25zZS5tZXNzYWdlIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiByZXNwb25zZS5jb2RlIHx8ICcnLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0X2lkOiByZXNwb25zZS5yZXF1ZXN0SWQgfHwgJydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoeGhyLnVwbG9hZCkge1xuICAgICAgICAgICAgLy8gRklYTUUo5YiG54mH5LiK5Lyg55qE6YC76L6R5ZKMeHh455qE6YC76L6R5LiN5LiA5qC3KVxuICAgICAgICAgICAgeGhyLnVwbG9hZC5vbnByb2dyZXNzID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAob3JpZ2luYWxIdHRwTWV0aG9kID09PSAnUFVUJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBQT1NULCBIRUFELCBHRVQg5LmL57G755qE5LiN6ZyA6KaB6Kem5Y+RIHByb2dyZXNzIOS6i+S7tlxuICAgICAgICAgICAgICAgICAgICAvLyDlkKbliJnlr7zoh7TpobXpnaLnmoTpgLvovpHmt7fkubFcbiAgICAgICAgICAgICAgICAgICAgZS5sZW5ndGhDb21wdXRhYmxlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaHR0cENvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwTWV0aG9kOiBvcmlnaW5hbEh0dHBNZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZTogcmVzb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdzOiBhcmdzLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHI6IHhoclxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbWl0KCdwcm9ncmVzcycsIGUsIGh0dHBDb250ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByb21pc2UgPSBjbGllbnQuY3JlYXRlU2lnbmF0dXJlKGNsaWVudC5jb25maWcuY3JlZGVudGlhbHMsXG4gICAgICAgICAgICBodHRwTWV0aG9kLCByZXNvdXJjZSwgYXJncy5wYXJhbXMsIGFyZ3MuaGVhZGVycyk7XG4gICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAoYXV0aG9yaXphdGlvbiwgeGJjZURhdGUpIHtcbiAgICAgICAgICAgIGlmIChhdXRob3JpemF0aW9uKSB7XG4gICAgICAgICAgICAgICAgYXJncy5oZWFkZXJzLmF1dGhvcml6YXRpb24gPSBhdXRob3JpemF0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoeGJjZURhdGUpIHtcbiAgICAgICAgICAgICAgICBhcmdzLmhlYWRlcnNbJ3gtYmNlLWRhdGUnXSA9IHhiY2VEYXRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcXMgPSBxc01vZHVsZS5zdHJpbmdpZnkoYXJncy5wYXJhbXMpO1xuICAgICAgICAgICAgaWYgKHFzKSB7XG4gICAgICAgICAgICAgICAgeGhyVXJpICs9ICc/JyArIHFzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIub3Blbih4aHJNZXRob2QsIHhoclVyaSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBhcmdzLmhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWFyZ3MuaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShrZXkpXG4gICAgICAgICAgICAgICAgICAgIHx8IC8oaG9zdHxjb250ZW50XFwtbGVuZ3RoKS9pLnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJncy5oZWFkZXJzW2tleV07XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhoci5zZW5kKHhockJvZHksIHtcbiAgICAgICAgICAgICAgICBydW50aW1lX29yZGVyOiAnZmxhc2gnLFxuICAgICAgICAgICAgICAgIHN3Zl91cmw6IG9wdGlvbnMuZmxhc2hfc3dmX3VybFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn07XG5cblxuZXhwb3J0cy5lYWNoTGltaXQgPSBmdW5jdGlvbiAodGFza3MsIHRhc2tQYXJhbGxlbCwgZXhlY3V0ZXIsIGRvbmUpIHtcbiAgICB2YXIgcnVubmluZ0NvdW50ID0gMDtcbiAgICB2YXIgYWJvcnRlZCA9IGZhbHNlO1xuICAgIHZhciBmaW4gPSBmYWxzZTsgICAgICAvLyBkb25lIOWPquiDveiiq+iwg+eUqOS4gOasoS5cbiAgICB2YXIgcXVldWUgPSBuZXcgUXVldWUodGFza3MpO1xuXG4gICAgZnVuY3Rpb24gaW5maW5pdGVMb29wKCkge1xuICAgICAgICB2YXIgdGFzayA9IHF1ZXVlLmRlcXVldWUoKTtcbiAgICAgICAgaWYgKCF0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBydW5uaW5nQ291bnQrKztcbiAgICAgICAgZXhlY3V0ZXIodGFzaywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBydW5uaW5nQ291bnQtLTtcblxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8g5LiA5pem5pyJ5oql6ZSZ77yM57uI5q2i6L+Q6KGMXG4gICAgICAgICAgICAgICAgYWJvcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZmluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBkb25lKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghcXVldWUuaXNFbXB0eSgpICYmICFhYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmYn+WIl+i/mOacieWGheWuuVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGluZmluaXRlTG9vcCwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJ1bm5pbmdDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmYn+WIl+epuuS6hu+8jOiAjOS4lOayoeaciei/kOihjOS4reeahOS7u+WKoeS6hlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmluID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGFza1BhcmFsbGVsID0gTWF0aC5taW4odGFza1BhcmFsbGVsLCBxdWV1ZS5zaXplKCkpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFza1BhcmFsbGVsOyBpKyspIHtcbiAgICAgICAgaW5maW5pdGVMb29wKCk7XG4gICAgfVxufTtcblxuZXhwb3J0cy5pbmhlcml0cyA9IGZ1bmN0aW9uIChDaGlsZEN0b3IsIFBhcmVudEN0b3IpIHtcbiAgICByZXR1cm4gcmVxdWlyZSg0NykuaW5oZXJpdHMoQ2hpbGRDdG9yLCBQYXJlbnRDdG9yKTtcbn07XG5cbmV4cG9ydHMuZ3Vlc3NDb250ZW50VHlwZSA9IGZ1bmN0aW9uIChmaWxlLCBvcHRfaWdub3JlQ2hhcnNldCkge1xuICAgIHZhciBjb250ZW50VHlwZSA9IGZpbGUudHlwZTtcbiAgICBpZiAoIWNvbnRlbnRUeXBlKSB7XG4gICAgICAgIHZhciBvYmplY3QgPSBmaWxlLm5hbWU7XG4gICAgICAgIHZhciBleHQgPSBvYmplY3Quc3BsaXQoL1xcLi9nKS5wb3AoKTtcbiAgICAgICAgY29udGVudFR5cGUgPSBNaW1lVHlwZS5ndWVzcyhleHQpO1xuICAgIH1cblxuICAgIC8vIEZpcmVmb3jlnKhQT1NU55qE5pe25YCZ77yMQ29udGVudC1UeXBlIOS4gOWumuS8muaciUNoYXJzZXTnmoTvvIzlm6DmraRcbiAgICAvLyDov5nph4zkuI3nrqEzNzIx77yM6YO95Yqg5LiKLlxuICAgIGlmICghb3B0X2lnbm9yZUNoYXJzZXQgJiYgIS9jaGFyc2V0PS8udGVzdChjb250ZW50VHlwZSkpIHtcbiAgICAgICAgY29udGVudFR5cGUgKz0gJzsgY2hhcnNldD1VVEYtOCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRlbnRUeXBlO1xufTtcbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL0J1ZmZlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyoqXG4gKiBCdWZmZXJcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gQnVmZmVyKCkge1xufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81NTE1ODY5L3N0cmluZy1sZW5ndGgtaW4tYnl0ZXMtaW4tamF2YXNjcmlwdFxuICAgIHZhciBtID0gZW5jb2RlVVJJQ29tcG9uZW50KGRhdGEpLm1hdGNoKC8lWzg5QUJhYl0vZyk7XG4gICAgcmV0dXJuIGRhdGEubGVuZ3RoICsgKG0gPyBtLmxlbmd0aCA6IDApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdWZmZXI7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgUHJvbWlzZS5qc1xuICogQGF1dGhvciA/P1xuICovXG5cbihmdW5jdGlvbiAocm9vdCkge1xuXG4gICAgLy8gU3RvcmUgc2V0VGltZW91dCByZWZlcmVuY2Ugc28gcHJvbWlzZS1wb2x5ZmlsbCB3aWxsIGJlIHVuYWZmZWN0ZWQgYnlcbiAgICAvLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbiAgICB2YXIgc2V0VGltZW91dEZ1bmMgPSBzZXRUaW1lb3V0O1xuXG4gICAgZnVuY3Rpb24gbm9vcCgpIHtcbiAgICB9XG5cbiAgICAvLyBQb2x5ZmlsbCBmb3IgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRcbiAgICBmdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmbi5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb21pc2VcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBleGVjdXRvci5cbiAgICAgKiBAY2xhc3NcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBQcm9taXNlKGZuKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb21pc2VzIG11c3QgYmUgY29uc3RydWN0ZWQgdmlhIG5ldycpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3N0YXRlID0gMDtcbiAgICAgICAgdGhpcy5faGFuZGxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fZGVmZXJyZWRzID0gW107XG5cbiAgICAgICAgZG9SZXNvbHZlKGZuLCB0aGlzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGUoc2VsZiwgZGVmZXJyZWQpIHtcbiAgICAgICAgd2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG4gICAgICAgICAgICBzZWxmID0gc2VsZi5fdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuX3N0YXRlID09PSAwKSB7XG4gICAgICAgICAgICBzZWxmLl9kZWZlcnJlZHMucHVzaChkZWZlcnJlZCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLl9oYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNiID0gc2VsZi5fc3RhdGUgPT09IDEgPyBkZWZlcnJlZC5vbkZ1bGZpbGxlZCA6IGRlZmVycmVkLm9uUmVqZWN0ZWQ7XG4gICAgICAgICAgICBpZiAoY2IgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAoc2VsZi5fc3RhdGUgPT09IDEgPyByZXNvbHZlIDogcmVqZWN0KShkZWZlcnJlZC5wcm9taXNlLCBzZWxmLl92YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmV0O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXQgPSBjYihzZWxmLl92YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHJlamVjdChkZWZlcnJlZC5wcm9taXNlLCBlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc29sdmUoc2VsZiwgbmV3VmFsdWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9wcm9taXNlcy1hcGx1cy9wcm9taXNlcy1zcGVjI3RoZS1wcm9taXNlLXJlc29sdXRpb24tcHJvY2VkdXJlXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT09IHNlbGYpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgJiYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG5ld1ZhbHVlID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgICAgIHZhciB0aGVuID0gbmV3VmFsdWUudGhlbjtcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3N0YXRlID0gMztcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvUmVzb2x2ZShiaW5kKHRoZW4sIG5ld1ZhbHVlKSwgc2VsZik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuX3N0YXRlID0gMTtcbiAgICAgICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChzZWxmLCBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICAgICAgICBzZWxmLl9zdGF0ZSA9IDI7XG4gICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5hbGUoc2VsZikge1xuICAgICAgICBpZiAoc2VsZi5fc3RhdGUgPT09IDIgJiYgc2VsZi5fZGVmZXJyZWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgUHJvbWlzZS5faW1tZWRpYXRlRm4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5faGFuZGxlZCkge1xuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbihzZWxmLl92YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBzZWxmLl9kZWZlcnJlZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZShzZWxmLCBzZWxmLl9kZWZlcnJlZHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHNlbGYuX2RlZmVycmVkcyA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlclxuICAgICAqXG4gICAgICogQGNsYXNzXG4gICAgICogQHBhcmFtIHsqfSBvbkZ1bGZpbGxlZCBUaGUgb25GdWxmaWxsZWQuXG4gICAgICogQHBhcmFtIHsqfSBvblJlamVjdGVkIFRoZSBvblJlamVjdGVkLlxuICAgICAqIEBwYXJhbSB7Kn0gcHJvbWlzZSBUaGUgcHJvbWlzZS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9taXNlKSB7XG4gICAgICAgIHRoaXMub25GdWxmaWxsZWQgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IG51bGw7XG4gICAgICAgIHRoaXMub25SZWplY3RlZCA9IHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nID8gb25SZWplY3RlZCA6IG51bGw7XG4gICAgICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGFrZSBhIHBvdGVudGlhbGx5IG1pc2JlaGF2aW5nIHJlc29sdmVyIGZ1bmN0aW9uIGFuZCBtYWtlIHN1cmVcbiAgICAgKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAgICAgKlxuICAgICAqIE1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgYXN5bmNocm9ueS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmbi5cbiAgICAgKiBAcGFyYW0geyp9IHNlbGYgVGhlIGNvbnRleHQuXG4gICAgICovXG4gICAgZnVuY3Rpb24gZG9SZXNvbHZlKGZuLCBzZWxmKSB7XG4gICAgICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShzZWxmLCB2YWx1ZSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlamVjdChzZWxmLCByZWFzb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICByZWplY3Qoc2VsZiwgZXgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgUHJvbWlzZS5wcm90b3R5cGVbXCJjYXRjaFwiXSA9IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xuICAgIH07XG5cbiAgICBQcm9taXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB2YXIgcHJvbSA9IG5ldyAodGhpcy5jb25zdHJ1Y3Rvcikobm9vcCk7XG5cbiAgICAgICAgaGFuZGxlKHRoaXMsIG5ldyBIYW5kbGVyKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkLCBwcm9tKSk7XG4gICAgICAgIHJldHVybiBwcm9tO1xuICAgIH07XG5cbiAgICBQcm9taXNlLmFsbCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVzKGksIHZhbCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhlbiA9IHZhbC50aGVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlbi5jYWxsKHZhbCwgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIGlmICgtLXJlbWFpbmluZyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5yZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHJlamVjdCh2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBQcm9taXNlLnJhY2UgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmFsdWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzW2ldLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIFVzZSBwb2x5ZmlsbCBmb3Igc2V0SW1tZWRpYXRlIGZvciBwZXJmb3JtYW5jZSBnYWluc1xuICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuID0gKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiYgZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHNldEltbWVkaWF0ZShmbik7XG4gICAgfSkgfHwgZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdQb3NzaWJsZSBVbmhhbmRsZWQgUHJvbWlzZSBSZWplY3Rpb246JywgZXJyKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGltbWVkaWF0ZSBmdW5jdGlvbiB0byBleGVjdXRlIGNhbGxiYWNrc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gRnVuY3Rpb24gdG8gZXhlY3V0ZVxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgUHJvbWlzZS5fc2V0SW1tZWRpYXRlRm4gPSBmdW5jdGlvbiBfc2V0SW1tZWRpYXRlRm4oZm4pIHtcbiAgICAgICAgUHJvbWlzZS5faW1tZWRpYXRlRm4gPSBmbjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBmdW5jdGlvbiB0byBleGVjdXRlIG9uIHVuaGFuZGxlZCByZWplY3Rpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgb24gdW5oYW5kbGVkIHJlamVjdGlvblxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgUHJvbWlzZS5fc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfc2V0VW5oYW5kbGVkUmVqZWN0aW9uRm4oZm4pIHtcbiAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmbjtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXJvb3QuUHJvbWlzZSkge1xuICAgICAgICByb290LlByb21pc2UgPSBQcm9taXNlO1xuICAgIH1cblxufSkodGhpcyk7XG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9hc3luYy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuZXhwb3J0cy5tYXBMaW1pdCA9IHJlcXVpcmUoMik7XG4iLCIvKipcbiAqIEBmaWxlIGNvcmUuanNcbiAqIEBhdXRob3IgPz8/XG4gKi9cblxuLyoqXG4gKiBMb2NhbCBwb2x5ZmlsIG9mIE9iamVjdC5jcmVhdGVcbiAqL1xudmFyIGNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBGKCkgeyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgdmFyIHN1YnR5cGU7XG5cbiAgICAgICAgRi5wcm90b3R5cGUgPSBvYmo7XG5cbiAgICAgICAgc3VidHlwZSA9IG5ldyBGKCk7XG5cbiAgICAgICAgRi5wcm90b3R5cGUgPSBudWxsO1xuXG4gICAgICAgIHJldHVybiBzdWJ0eXBlO1xuICAgIH07XG59KCkpO1xuXG4vKipcbiAqIENyeXB0b0pTIG5hbWVzcGFjZS5cbiAqL1xudmFyIEMgPSB7fTtcblxuLyoqXG4gKiBBbGdvcml0aG0gbmFtZXNwYWNlLlxuICovXG52YXIgQ19hbGdvID0gQy5hbGdvID0ge307XG5cbi8qKlxuICogTGlicmFyeSBuYW1lc3BhY2UuXG4gKi9cbnZhciBDX2xpYiA9IEMubGliID0ge307XG5cbi8qKlxuICAqIEJhc2Ugb2JqZWN0IGZvciBwcm90b3R5cGFsIGluaGVyaXRhbmNlLlxuICAqL1xudmFyIEJhc2UgPSBDX2xpYi5CYXNlID0gKGZ1bmN0aW9uICgpIHtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG92ZXJyaWRlcyBQcm9wZXJ0aWVzIHRvIGNvcHkgaW50byB0aGUgbmV3IG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICB2YXIgTXlUeXBlID0gQ3J5cHRvSlMubGliLkJhc2UuZXh0ZW5kKHtcbiAgICAgICAgICAqICAgICAgICAgZmllbGQ6ICd2YWx1ZScsXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgICAgICBtZXRob2Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAqICAgICAgICAgfVxuICAgICAgICAgICogICAgIH0pO1xuICAgICAgICAgICovXG4gICAgICAgIGV4dGVuZDogZnVuY3Rpb24gKG92ZXJyaWRlcykge1xuICAgICAgICAgICAgLy8gU3Bhd25cbiAgICAgICAgICAgIHZhciBzdWJ0eXBlID0gY3JlYXRlKHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBBdWdtZW50XG4gICAgICAgICAgICBpZiAob3ZlcnJpZGVzKSB7XG4gICAgICAgICAgICAgICAgc3VidHlwZS5taXhJbihvdmVycmlkZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDcmVhdGUgZGVmYXVsdCBpbml0aWFsaXplclxuICAgICAgICAgICAgaWYgKCFzdWJ0eXBlLmhhc093blByb3BlcnR5KCdpbml0JykgfHwgdGhpcy5pbml0ID09PSBzdWJ0eXBlLmluaXQpIHtcbiAgICAgICAgICAgICAgICBzdWJ0eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnR5cGUuJHN1cGVyLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJbml0aWFsaXplcidzIHByb3RvdHlwZSBpcyB0aGUgc3VidHlwZSBvYmplY3RcbiAgICAgICAgICAgIHN1YnR5cGUuaW5pdC5wcm90b3R5cGUgPSBzdWJ0eXBlO1xuXG4gICAgICAgICAgICAvLyBSZWZlcmVuY2Ugc3VwZXJ0eXBlXG4gICAgICAgICAgICBzdWJ0eXBlLiRzdXBlciA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBzdWJ0eXBlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogRXh0ZW5kcyB0aGlzIG9iamVjdCBhbmQgcnVucyB0aGUgaW5pdCBtZXRob2QuXG4gICAgICAgICAgKiBBcmd1bWVudHMgdG8gY3JlYXRlKCkgd2lsbCBiZSBwYXNzZWQgdG8gaW5pdCgpLlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHN0YXRpY1xuICAgICAgICAgICpcbiAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgIHZhciBpbnN0YW5jZSA9IE15VHlwZS5jcmVhdGUoKTtcbiAgICAgICAgICAqL1xuICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZXh0ZW5kKCk7XG4gICAgICAgICAgICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAgKiBJbml0aWFsaXplcyBhIG5ld2x5IGNyZWF0ZWQgb2JqZWN0LlxuICAgICAgICAgICogT3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gYWRkIHNvbWUgbG9naWMgd2hlbiB5b3VyIG9iamVjdHMgYXJlIGNyZWF0ZWQuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgdmFyIE15VHlwZSA9IENyeXB0b0pTLmxpYi5CYXNlLmV4dGVuZCh7XG4gICAgICAgICAgKiAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAqICAgICAgICAgICAgIC8vIC4uLlxuICAgICAgICAgICogICAgICAgICB9XG4gICAgICAgICAgKiAgICAgfSk7XG4gICAgICAgICAgKi9cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge30sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAgKiBDb3BpZXMgcHJvcGVydGllcyBpbnRvIHRoaXMgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9wZXJ0aWVzIFRoZSBwcm9wZXJ0aWVzIHRvIG1peCBpbi5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICBNeVR5cGUubWl4SW4oe1xuICAgICAgICAgICogICAgICAgICBmaWVsZDogJ3ZhbHVlJ1xuICAgICAgICAgICogICAgIH0pO1xuICAgICAgICAgICovXG4gICAgICAgIG1peEluOiBmdW5jdGlvbiAocHJvcGVydGllcykge1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbcHJvcGVydHlOYW1lXSA9IHByb3BlcnRpZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSUUgd29uJ3QgY29weSB0b1N0cmluZyB1c2luZyB0aGUgbG9vcCBhYm92ZVxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvU3RyaW5nID0gcHJvcGVydGllcy50b1N0cmluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY2xvbmUuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgdmFyIGNsb25lID0gaW5zdGFuY2UuY2xvbmUoKTtcbiAgICAgICAgICAqL1xuICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5pdC5wcm90b3R5cGUuZXh0ZW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbn0oKSk7XG5cbi8qKlxuICAqIEFuIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cbiAgKlxuICAqIEBwcm9wZXJ0eSB7QXJyYXl9IHdvcmRzIFRoZSBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG4gICogQHByb3BlcnR5IHtudW1iZXJ9IHNpZ0J5dGVzIFRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgYnl0ZXMgaW4gdGhpcyB3b3JkIGFycmF5LlxuICAqL1xudmFyIFdvcmRBcnJheSA9IENfbGliLldvcmRBcnJheSA9IEJhc2UuZXh0ZW5kKHtcblxuICAgIC8qKlxuICAgICAgKiBJbml0aWFsaXplcyBhIG5ld2x5IGNyZWF0ZWQgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtBcnJheX0gd29yZHMgKE9wdGlvbmFsKSBBbiBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG4gICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaWdCeXRlcyAoT3B0aW9uYWwpIFRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgYnl0ZXMgaW4gdGhlIHdvcmRzLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKCk7XG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddKTtcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShbMHgwMDAxMDIwMywgMHgwNDA1MDYwN10sIDYpO1xuICAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbiAod29yZHMsIHNpZ0J5dGVzKSB7XG4gICAgICAgIHdvcmRzID0gdGhpcy53b3JkcyA9IHdvcmRzIHx8IFtdO1xuXG4gICAgICAgIGlmIChzaWdCeXRlcyAhPSB1bmRlZmluZWQpIHsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICAgICAgdGhpcy5zaWdCeXRlcyA9IHNpZ0J5dGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaWdCeXRlcyA9IHdvcmRzLmxlbmd0aCAqIDQ7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIHRoaXMgd29yZCBhcnJheSB0byBhIHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtFbmNvZGVyfSBlbmNvZGVyIChPcHRpb25hbCkgVGhlIGVuY29kaW5nIHN0cmF0ZWd5IHRvIHVzZS4gRGVmYXVsdDogQ3J5cHRvSlMuZW5jLkhleFxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdHJpbmdpZmllZCB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheSArICcnO1xuICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheS50b1N0cmluZygpO1xuICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheS50b1N0cmluZyhDcnlwdG9KUy5lbmMuVXRmOCk7XG4gICAgICAqL1xuICAgIHRvU3RyaW5nOiBmdW5jdGlvbiAoZW5jb2Rlcikge1xuICAgICAgICByZXR1cm4gKGVuY29kZXIgfHwgSGV4KS5zdHJpbmdpZnkodGhpcyk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENvbmNhdGVuYXRlcyBhIHdvcmQgYXJyYXkgdG8gdGhpcyB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5IHRvIGFwcGVuZC5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGlzIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB3b3JkQXJyYXkxLmNvbmNhdCh3b3JkQXJyYXkyKTtcbiAgICAgICovXG4gICAgY29uY2F0OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgdGhpc1dvcmRzID0gdGhpcy53b3JkcztcbiAgICAgICAgdmFyIHRoYXRXb3JkcyA9IHdvcmRBcnJheS53b3JkcztcbiAgICAgICAgdmFyIHRoaXNTaWdCeXRlcyA9IHRoaXMuc2lnQnl0ZXM7XG4gICAgICAgIHZhciB0aGF0U2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cbiAgICAgICAgLy8gQ2xhbXAgZXhjZXNzIGJpdHNcbiAgICAgICAgdGhpcy5jbGFtcCgpO1xuXG5cbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgLy8gQ29uY2F0XG4gICAgICAgIGlmICh0aGlzU2lnQnl0ZXMgJSA0KSB7XG4gICAgICAgICAgICAvLyBDb3B5IG9uZSBieXRlIGF0IGEgdGltZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoYXRTaWdCeXRlczsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXRCeXRlID0gKHRoYXRXb3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG4gICAgICAgICAgICAgICAgdGhpc1dvcmRzWyh0aGlzU2lnQnl0ZXMgKyBpKSA+Pj4gMl0gfD0gdGhhdEJ5dGUgPDwgKDI0IC0gKCh0aGlzU2lnQnl0ZXMgKyBpKSAlIDQpICogOCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBDb3B5IG9uZSB3b3JkIGF0IGEgdGltZVxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoYXRTaWdCeXRlczsgaSArPSA0KSB7XG4gICAgICAgICAgICAgICAgdGhpc1dvcmRzWyh0aGlzU2lnQnl0ZXMgKyBpKSA+Pj4gMl0gPSB0aGF0V29yZHNbaSA+Pj4gMl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaWdCeXRlcyArPSB0aGF0U2lnQnl0ZXM7XG5cbiAgICAgICAgLy8gQ2hhaW5hYmxlXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogUmVtb3ZlcyBpbnNpZ25pZmljYW50IGJpdHMuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB3b3JkQXJyYXkuY2xhbXAoKTtcbiAgICAgICovXG4gICAgY2xhbXA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciB3b3JkcyA9IHRoaXMud29yZHM7XG4gICAgICAgIHZhciBzaWdCeXRlcyA9IHRoaXMuc2lnQnl0ZXM7XG5cbiAgICAgICAgLy8gQ2xhbXBcbiAgICAgICAgd29yZHNbc2lnQnl0ZXMgPj4+IDJdICY9IDB4ZmZmZmZmZmYgPDwgKDMyIC0gKHNpZ0J5dGVzICUgNCkgKiA4KTtcbiAgICAgICAgd29yZHMubGVuZ3RoID0gTWF0aC5jZWlsKHNpZ0J5dGVzIC8gNCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIGNsb25lLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGNsb25lID0gd29yZEFycmF5LmNsb25lKCk7XG4gICAgICAqL1xuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbG9uZSA9IEJhc2UuY2xvbmUuY2FsbCh0aGlzKTtcbiAgICAgICAgY2xvbmUud29yZHMgPSB0aGlzLndvcmRzLnNsaWNlKDApO1xuXG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENyZWF0ZXMgYSB3b3JkIGFycmF5IGZpbGxlZCB3aXRoIHJhbmRvbSBieXRlcy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtudW1iZXJ9IG5CeXRlcyBUaGUgbnVtYmVyIG9mIHJhbmRvbSBieXRlcyB0byBnZW5lcmF0ZS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcmFuZG9tIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LnJhbmRvbSgxNik7XG4gICAgICAqL1xuICAgIHJhbmRvbTogZnVuY3Rpb24gKG5CeXRlcykge1xuICAgICAgICB2YXIgd29yZHMgPSBbXTtcblxuICAgICAgICB2YXIgciA9IGZ1bmN0aW9uIChtX3cpIHtcbiAgICAgICAgICAgIHZhciBtX3ogPSAweDNhZGU2OGIxO1xuICAgICAgICAgICAgdmFyIG1hc2sgPSAweGZmZmZmZmZmO1xuXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1feiA9ICgweDkwNjkgKiAobV96ICYgMHhGRkZGKSArIChtX3ogPj4gMHgxMCkpICYgbWFzaztcbiAgICAgICAgICAgICAgICBtX3cgPSAoMHg0NjUwICogKG1fdyAmIDB4RkZGRikgKyAobV93ID4+IDB4MTApKSAmIG1hc2s7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICgobV96IDw8IDB4MTApICsgbV93KSAmIG1hc2s7XG4gICAgICAgICAgICAgICAgcmVzdWx0IC89IDB4MTAwMDAwMDAwO1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSAwLjU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCAqIChNYXRoLnJhbmRvbSgpID4gLjUgPyAxIDogLTEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcmNhY2hlOyBpIDwgbkJ5dGVzOyBpICs9IDQpIHtcbiAgICAgICAgICAgIHZhciBfciA9IHIoKHJjYWNoZSB8fCBNYXRoLnJhbmRvbSgpKSAqIDB4MTAwMDAwMDAwKTtcblxuICAgICAgICAgICAgcmNhY2hlID0gX3IoKSAqIDB4M2FkZTY3Yjc7XG4gICAgICAgICAgICB3b3Jkcy5wdXNoKChfcigpICogMHgxMDAwMDAwMDApIHwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBuQnl0ZXMpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxufSk7XG5cbi8qKlxuICAqIEVuY29kZXIgbmFtZXNwYWNlLlxuICAqL1xudmFyIENfZW5jID0gQy5lbmMgPSB7fTtcblxuLyoqXG4gICogSGV4IGVuY29kaW5nIHN0cmF0ZWd5LlxuICAqL1xudmFyIEhleCA9IENfZW5jLkhleCA9IHtcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBoZXggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBoZXggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgaGV4U3RyaW5nID0gQ3J5cHRvSlMuZW5jLkhleC5zdHJpbmdpZnkod29yZEFycmF5KTtcbiAgICAgICovXG4gICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgd29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG4gICAgICAgIHZhciBzaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuICAgICAgICAvLyBDb252ZXJ0XG4gICAgICAgIHZhciBoZXhDaGFycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZ0J5dGVzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBiaXRlID0gKHdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcbiAgICAgICAgICAgIGhleENoYXJzLnB1c2goKGJpdGUgPj4+IDQpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgICAgICBoZXhDaGFycy5wdXNoKChiaXRlICYgMHgwZikudG9TdHJpbmcoMTYpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZXhDaGFycy5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgaGV4IHN0cmluZyB0byBhIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHIgVGhlIGhleCBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuSGV4LnBhcnNlKGhleFN0cmluZyk7XG4gICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbiAoaGV4U3RyKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0XG4gICAgICAgIHZhciBoZXhTdHJMZW5ndGggPSBoZXhTdHIubGVuZ3RoO1xuXG4gICAgICAgIC8vIENvbnZlcnRcbiAgICAgICAgdmFyIHdvcmRzID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGV4U3RyTGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgICAgIHdvcmRzW2kgPj4+IDNdIHw9IHBhcnNlSW50KGhleFN0ci5zdWJzdHIoaSwgMiksIDE2KSA8PCAoMjQgLSAoaSAlIDgpICogNCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBoZXhTdHJMZW5ndGggLyAyKTsgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxufTtcblxuLyoqXG4gICogTGF0aW4xIGVuY29kaW5nIHN0cmF0ZWd5LlxuICAqL1xudmFyIExhdGluMSA9IENfZW5jLkxhdGluMSA9IHtcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBMYXRpbjEgc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBMYXRpbjEgc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgbGF0aW4xU3RyaW5nID0gQ3J5cHRvSlMuZW5jLkxhdGluMS5zdHJpbmdpZnkod29yZEFycmF5KTtcbiAgICAgICovXG4gICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgd29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG4gICAgICAgIHZhciBzaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuICAgICAgICAvLyBDb252ZXJ0XG4gICAgICAgIHZhciBsYXRpbjFDaGFycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZ0J5dGVzOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBiaXRlID0gKHdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcbiAgICAgICAgICAgIGxhdGluMUNoYXJzLnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShiaXRlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGF0aW4xQ2hhcnMuam9pbignJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyBhIExhdGluMSBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0aW4xU3RyIFRoZSBMYXRpbjEgc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMuZW5jLkxhdGluMS5wYXJzZShsYXRpbjFTdHJpbmcpO1xuICAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24gKGxhdGluMVN0cikge1xuICAgICAgICAvLyBTaG9ydGN1dFxuICAgICAgICB2YXIgbGF0aW4xU3RyTGVuZ3RoID0gbGF0aW4xU3RyLmxlbmd0aDtcblxuICAgICAgICAvLyBDb252ZXJ0XG4gICAgICAgIHZhciB3b3JkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhdGluMVN0ckxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB3b3Jkc1tpID4+PiAyXSB8PSAobGF0aW4xU3RyLmNoYXJDb2RlQXQoaSkgJiAweGZmKSA8PCAoMjQgLSAoaSAlIDQpICogOCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBsYXRpbjFTdHJMZW5ndGgpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxufTtcblxuLyoqXG4gICogVVRGLTggZW5jb2Rpbmcgc3RyYXRlZ3kuXG4gICovXG52YXIgVXRmOCA9IENfZW5jLlV0ZjggPSB7XG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgVVRGLTggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBVVEYtOCBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciB1dGY4U3RyaW5nID0gQ3J5cHRvSlMuZW5jLlV0Zjguc3RyaW5naWZ5KHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChlc2NhcGUoTGF0aW4xLnN0cmluZ2lmeSh3b3JkQXJyYXkpKSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWFsZm9ybWVkIFVURi04IGRhdGEnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSBVVEYtOCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXRmOFN0ciBUaGUgVVRGLTggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMuZW5jLlV0ZjgucGFyc2UodXRmOFN0cmluZyk7XG4gICAgICAqL1xuICAgIHBhcnNlOiBmdW5jdGlvbiAodXRmOFN0cikge1xuICAgICAgICByZXR1cm4gTGF0aW4xLnBhcnNlKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudCh1dGY4U3RyKSkpO1xuICAgIH1cbn07XG5cbi8qKlxuICAqIEFic3RyYWN0IGJ1ZmZlcmVkIGJsb2NrIGFsZ29yaXRobSB0ZW1wbGF0ZS5cbiAgKlxuICAqIFRoZSBwcm9wZXJ0eSBibG9ja1NpemUgbXVzdCBiZSBpbXBsZW1lbnRlZCBpbiBhIGNvbmNyZXRlIHN1YnR5cGUuXG4gICpcbiAgKiBAcHJvcGVydHkge251bWJlcn0gX21pbkJ1ZmZlclNpemUgVGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBzaG91bGQgYmUga2VwdCB1bnByb2Nlc3NlZCBpbiB0aGUgYnVmZmVyLiBEZWZhdWx0OiAwXG4gICovXG52YXIgQnVmZmVyZWRCbG9ja0FsZ29yaXRobSA9IENfbGliLkJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBCYXNlLmV4dGVuZCh7XG5cbiAgICAvKipcbiAgICAgICogUmVzZXRzIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgZGF0YSBidWZmZXIgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLnJlc2V0KCk7XG4gICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEluaXRpYWwgdmFsdWVzXG4gICAgICAgIHRoaXMuX2RhdGEgPSBuZXcgV29yZEFycmF5LmluaXQoKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzID0gMDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIEFkZHMgbmV3IGRhdGEgdG8gdGhpcyBibG9jayBhbGdvcml0aG0ncyBidWZmZXIuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBhcHBlbmQuIFN0cmluZ3MgYXJlIGNvbnZlcnRlZCB0byBhIFdvcmRBcnJheSB1c2luZyBVVEYtOC5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX2FwcGVuZCgnZGF0YScpO1xuICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fYXBwZW5kKHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIF9hcHBlbmQ6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIC8vIENvbnZlcnQgc3RyaW5nIHRvIFdvcmRBcnJheSwgZWxzZSBhc3N1bWUgV29yZEFycmF5IGFscmVhZHlcbiAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZGF0YSA9IFV0ZjgucGFyc2UoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcHBlbmRcbiAgICAgICAgdGhpcy5fZGF0YS5jb25jYXQoZGF0YSk7XG4gICAgICAgIHRoaXMuX25EYXRhQnl0ZXMgKz0gZGF0YS5zaWdCeXRlcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIFByb2Nlc3NlcyBhdmFpbGFibGUgZGF0YSBibG9ja3MuXG4gICAgICAqXG4gICAgICAqIFRoaXMgbWV0aG9kIGludm9rZXMgX2RvUHJvY2Vzc0Jsb2NrKG9mZnNldCksIHdoaWNoIG11c3QgYmUgaW1wbGVtZW50ZWQgYnkgYSBjb25jcmV0ZSBzdWJ0eXBlLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRvRmx1c2ggV2hldGhlciBhbGwgYmxvY2tzIGFuZCBwYXJ0aWFsIGJsb2NrcyBzaG91bGQgYmUgcHJvY2Vzc2VkLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBwcm9jZXNzZWQgZGF0YS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcygpO1xuICAgICAgKiAgICAgdmFyIHByb2Nlc3NlZERhdGEgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9wcm9jZXNzKCEhJ2ZsdXNoJyk7XG4gICAgICAqL1xuICAgIF9wcm9jZXNzOiBmdW5jdGlvbiAoZG9GbHVzaCkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuICAgICAgICB2YXIgZGF0YVdvcmRzID0gZGF0YS53b3JkcztcbiAgICAgICAgdmFyIGRhdGFTaWdCeXRlcyA9IGRhdGEuc2lnQnl0ZXM7XG4gICAgICAgIHZhciBibG9ja1NpemUgPSB0aGlzLmJsb2NrU2l6ZTtcbiAgICAgICAgdmFyIGJsb2NrU2l6ZUJ5dGVzID0gYmxvY2tTaXplICogNDtcblxuICAgICAgICAvLyBDb3VudCBibG9ja3MgcmVhZHlcbiAgICAgICAgdmFyIG5CbG9ja3NSZWFkeSA9IGRhdGFTaWdCeXRlcyAvIGJsb2NrU2l6ZUJ5dGVzO1xuICAgICAgICBpZiAoZG9GbHVzaCkge1xuICAgICAgICAgICAgLy8gUm91bmQgdXAgdG8gaW5jbHVkZSBwYXJ0aWFsIGJsb2Nrc1xuICAgICAgICAgICAgbkJsb2Nrc1JlYWR5ID0gTWF0aC5jZWlsKG5CbG9ja3NSZWFkeSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSb3VuZCBkb3duIHRvIGluY2x1ZGUgb25seSBmdWxsIGJsb2NrcyxcbiAgICAgICAgICAgIC8vIGxlc3MgdGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBtdXN0IHJlbWFpbiBpbiB0aGUgYnVmZmVyXG4gICAgICAgICAgICBuQmxvY2tzUmVhZHkgPSBNYXRoLm1heCgobkJsb2Nrc1JlYWR5IHwgMCkgLSB0aGlzLl9taW5CdWZmZXJTaXplLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvdW50IHdvcmRzIHJlYWR5XG4gICAgICAgIHZhciBuV29yZHNSZWFkeSA9IG5CbG9ja3NSZWFkeSAqIGJsb2NrU2l6ZTtcblxuICAgICAgICAvLyBDb3VudCBieXRlcyByZWFkeVxuICAgICAgICB2YXIgbkJ5dGVzUmVhZHkgPSBNYXRoLm1pbihuV29yZHNSZWFkeSAqIDQsIGRhdGFTaWdCeXRlcyk7XG5cbiAgICAgICAgLy8gUHJvY2VzcyBibG9ja3NcbiAgICAgICAgaWYgKG5Xb3Jkc1JlYWR5KSB7XG4gICAgICAgICAgICBmb3IgKHZhciBvZmZzZXQgPSAwOyBvZmZzZXQgPCBuV29yZHNSZWFkeTsgb2Zmc2V0ICs9IGJsb2NrU2l6ZSkge1xuICAgICAgICAgICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtYWxnb3JpdGhtIGxvZ2ljXG4gICAgICAgICAgICAgICAgdGhpcy5fZG9Qcm9jZXNzQmxvY2soZGF0YVdvcmRzLCBvZmZzZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZW1vdmUgcHJvY2Vzc2VkIHdvcmRzXG4gICAgICAgICAgICB2YXIgcHJvY2Vzc2VkV29yZHMgPSBkYXRhV29yZHMuc3BsaWNlKDAsIG5Xb3Jkc1JlYWR5KTtcbiAgICAgICAgICAgIGRhdGEuc2lnQnl0ZXMgLT0gbkJ5dGVzUmVhZHk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gcHJvY2Vzc2VkIHdvcmRzXG4gICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQocHJvY2Vzc2VkV29yZHMsIG5CeXRlc1JlYWR5KTsgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIG9iamVjdC5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY2xvbmUuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgY2xvbmUgPSBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLmNsb25lKCk7XG4gICAgICAqL1xuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbG9uZSA9IEJhc2UuY2xvbmUuY2FsbCh0aGlzKTtcbiAgICAgICAgY2xvbmUuX2RhdGEgPSB0aGlzLl9kYXRhLmNsb25lKCk7XG5cbiAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH0sXG5cbiAgICBfbWluQnVmZmVyU2l6ZTogMFxufSk7XG5cbi8qKlxuICAqIEFic3RyYWN0IGhhc2hlciB0ZW1wbGF0ZS5cbiAgKlxuICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibG9ja1NpemUgVGhlIG51bWJlciBvZiAzMi1iaXQgd29yZHMgdGhpcyBoYXNoZXIgb3BlcmF0ZXMgb24uIERlZmF1bHQ6IDE2ICg1MTIgYml0cylcbiAgKi9cbkNfbGliLkhhc2hlciA9IEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uZXh0ZW5kKHtcblxuICAgIC8qKlxuICAgICAgKiBDb25maWd1cmF0aW9uIG9wdGlvbnMuXG4gICAgICAqL1xuICAgIGNmZzogQmFzZS5leHRlbmQoKSxcblxuICAgIC8qKlxuICAgICAgKiBJbml0aWFsaXplcyBhIG5ld2x5IGNyZWF0ZWQgaGFzaGVyLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge09iamVjdH0gY2ZnIChPcHRpb25hbCkgVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB0byB1c2UgZm9yIHRoaXMgaGFzaCBjb21wdXRhdGlvbi5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBoYXNoZXIgPSBDcnlwdG9KUy5hbGdvLlNIQTI1Ni5jcmVhdGUoKTtcbiAgICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKGNmZykge1xuICAgICAgICAvLyBBcHBseSBjb25maWcgZGVmYXVsdHNcbiAgICAgICAgdGhpcy5jZmcgPSB0aGlzLmNmZy5leHRlbmQoY2ZnKTtcblxuICAgICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZXNcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogUmVzZXRzIHRoaXMgaGFzaGVyIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgaGFzaGVyLnJlc2V0KCk7XG4gICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFJlc2V0IGRhdGEgYnVmZmVyXG4gICAgICAgIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0ucmVzZXQuY2FsbCh0aGlzKTtcblxuICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWhhc2hlciBsb2dpY1xuICAgICAgICB0aGlzLl9kb1Jlc2V0KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBVcGRhdGVzIHRoaXMgaGFzaGVyIHdpdGggYSBtZXNzYWdlLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtIYXNoZXJ9IFRoaXMgaGFzaGVyLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgaGFzaGVyLnVwZGF0ZSgnbWVzc2FnZScpO1xuICAgICAgKiAgICAgaGFzaGVyLnVwZGF0ZSh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIChtZXNzYWdlVXBkYXRlKSB7XG4gICAgICAgIC8vIEFwcGVuZFxuICAgICAgICB0aGlzLl9hcHBlbmQobWVzc2FnZVVwZGF0ZSk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHRoZSBoYXNoXG4gICAgICAgIHRoaXMuX3Byb2Nlc3MoKTtcblxuICAgICAgICAvLyBDaGFpbmFibGVcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBGaW5hbGl6ZXMgdGhlIGhhc2ggY29tcHV0YXRpb24uXG4gICAgICAqIE5vdGUgdGhhdCB0aGUgZmluYWxpemUgb3BlcmF0aW9uIGlzIGVmZmVjdGl2ZWx5IGEgZGVzdHJ1Y3RpdmUsIHJlYWQtb25jZSBvcGVyYXRpb24uXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSAoT3B0aW9uYWwpIEEgZmluYWwgbWVzc2FnZSB1cGRhdGUuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIGhhc2guXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSgpO1xuICAgICAgKiAgICAgdmFyIGhhc2ggPSBoYXNoZXIuZmluYWxpemUoJ21lc3NhZ2UnKTtcbiAgICAgICogICAgIHZhciBoYXNoID0gaGFzaGVyLmZpbmFsaXplKHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIGZpbmFsaXplOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuICAgICAgICAvLyBGaW5hbCBtZXNzYWdlIHVwZGF0ZVxuICAgICAgICBpZiAobWVzc2FnZVVwZGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcbiAgICAgICAgdmFyIGhhc2ggPSB0aGlzLl9kb0ZpbmFsaXplKCk7XG5cbiAgICAgICAgcmV0dXJuIGhhc2g7XG4gICAgfSxcblxuICAgIGJsb2NrU2l6ZTogNTEyIC8gMzIsXG5cbiAgICAvKipcbiAgICAgICogQ3JlYXRlcyBhIHNob3J0Y3V0IGZ1bmN0aW9uIHRvIGEgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaGVyIHRvIGNyZWF0ZSBhIGhlbHBlciBmb3IuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgc2hvcnRjdXQgZnVuY3Rpb24uXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBTSEEyNTYgPSBDcnlwdG9KUy5saWIuSGFzaGVyLl9jcmVhdGVIZWxwZXIoQ3J5cHRvSlMuYWxnby5TSEEyNTYpO1xuICAgICAgKi9cbiAgICBfY3JlYXRlSGVscGVyOiBmdW5jdGlvbiAoaGFzaGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSwgY2ZnKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IGhhc2hlci5pbml0KGNmZykuZmluYWxpemUobWVzc2FnZSk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENyZWF0ZXMgYSBzaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgSE1BQydzIG9iamVjdCBpbnRlcmZhY2UuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byB1c2UgaW4gdGhpcyBITUFDIGhlbHBlci5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBzaG9ydGN1dCBmdW5jdGlvbi5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIEhtYWNTSEEyNTYgPSBDcnlwdG9KUy5saWIuSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcbiAgICAgICovXG4gICAgX2NyZWF0ZUhtYWNIZWxwZXI6IGZ1bmN0aW9uIChoYXNoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlLCBrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ19hbGdvLkhNQUMuaW5pdChoYXNoZXIsIGtleSkuZmluYWxpemUobWVzc2FnZSk7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICB9O1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEM7XG4iLCIvKipcbiAqIEBmaWxlIGhtYWMtc2hhMjU2LmpzXG4gKiBAYXV0aG9yID8/P1xuICovXG5yZXF1aXJlKDM5KTtcbnJlcXVpcmUoMzgpO1xudmFyIENyeXB0b0pTID0gcmVxdWlyZSgzNik7XG5cbm1vZHVsZS5leHBvcnRzID0gQ3J5cHRvSlMuSG1hY1NIQTI1NjtcbiIsIi8qKlxuICogQGZpbGUgaG1hYy5qc1xuICogQGF1dGhvciA/Pz9cbiAqL1xuXG52YXIgQ3J5cHRvSlMgPSByZXF1aXJlKDM2KTtcblxuLy8gU2hvcnRjdXRzXG52YXIgQyA9IENyeXB0b0pTO1xudmFyIENfbGliID0gQy5saWI7XG52YXIgQmFzZSA9IENfbGliLkJhc2U7XG52YXIgQ19lbmMgPSBDLmVuYztcbnZhciBVdGY4ID0gQ19lbmMuVXRmODtcbnZhciBDX2FsZ28gPSBDLmFsZ287XG5cbi8qKlxuICogSE1BQyBhbGdvcml0aG0uXG4gKi9cbkNfYWxnby5ITUFDID0gQmFzZS5leHRlbmQoe1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIEhNQUMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoIGFsZ29yaXRobSB0byB1c2UuXG4gICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIHZhciBobWFjSGFzaGVyID0gQ3J5cHRvSlMuYWxnby5ITUFDLmNyZWF0ZShDcnlwdG9KUy5hbGdvLlNIQTI1Niwga2V5KTtcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbiAoaGFzaGVyLCBrZXkpIHtcbiAgICAgICAgLy8gSW5pdCBoYXNoZXJcbiAgICAgICAgaGFzaGVyID0gdGhpcy5faGFzaGVyID0gbmV3IGhhc2hlci5pbml0KCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcblxuICAgICAgICAvLyBDb252ZXJ0IHN0cmluZyB0byBXb3JkQXJyYXksIGVsc2UgYXNzdW1lIFdvcmRBcnJheSBhbHJlYWR5XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAga2V5ID0gVXRmOC5wYXJzZShrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciBoYXNoZXJCbG9ja1NpemUgPSBoYXNoZXIuYmxvY2tTaXplO1xuICAgICAgICB2YXIgaGFzaGVyQmxvY2tTaXplQnl0ZXMgPSBoYXNoZXJCbG9ja1NpemUgKiA0O1xuXG4gICAgICAgIC8vIEFsbG93IGFyYml0cmFyeSBsZW5ndGgga2V5c1xuICAgICAgICBpZiAoa2V5LnNpZ0J5dGVzID4gaGFzaGVyQmxvY2tTaXplQnl0ZXMpIHtcbiAgICAgICAgICAgIGtleSA9IGhhc2hlci5maW5hbGl6ZShrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xhbXAgZXhjZXNzIGJpdHNcbiAgICAgICAga2V5LmNsYW1wKCk7XG5cbiAgICAgICAgLy8gQ2xvbmUga2V5IGZvciBpbm5lciBhbmQgb3V0ZXIgcGFkc1xuICAgICAgICB2YXIgb0tleSA9IHRoaXMuX29LZXkgPSBrZXkuY2xvbmUoKTtcbiAgICAgICAgdmFyIGlLZXkgPSB0aGlzLl9pS2V5ID0ga2V5LmNsb25lKCk7XG5cbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciBvS2V5V29yZHMgPSBvS2V5LndvcmRzO1xuICAgICAgICB2YXIgaUtleVdvcmRzID0gaUtleS53b3JkcztcblxuICAgICAgICAvLyBYT1Iga2V5cyB3aXRoIHBhZCBjb25zdGFudHNcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXNoZXJCbG9ja1NpemU7IGkrKykge1xuICAgICAgICAgICAgb0tleVdvcmRzW2ldIF49IDB4NWM1YzVjNWM7XG4gICAgICAgICAgICBpS2V5V29yZHNbaV0gXj0gMHgzNjM2MzYzNjtcbiAgICAgICAgfVxuICAgICAgICBvS2V5LnNpZ0J5dGVzID0gaUtleS5zaWdCeXRlcyA9IGhhc2hlckJsb2NrU2l6ZUJ5dGVzO1xuXG4gICAgICAgIC8vIFNldCBpbml0aWFsIHZhbHVlc1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlc2V0cyB0aGlzIEhNQUMgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIGhtYWNIYXNoZXIucmVzZXQoKTtcbiAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTaG9ydGN1dFxuICAgICAgICB2YXIgaGFzaGVyID0gdGhpcy5faGFzaGVyO1xuXG4gICAgICAgIC8vIFJlc2V0XG4gICAgICAgIGhhc2hlci5yZXNldCgpO1xuICAgICAgICBoYXNoZXIudXBkYXRlKHRoaXMuX2lLZXkpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoaXMgSE1BQyB3aXRoIGEgbWVzc2FnZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZVVwZGF0ZSBUaGUgbWVzc2FnZSB0byBhcHBlbmQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtITUFDfSBUaGlzIEhNQUMgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIGhtYWNIYXNoZXIudXBkYXRlKCdtZXNzYWdlJyk7XG4gICAgICogICAgIGhtYWNIYXNoZXIudXBkYXRlKHdvcmRBcnJheSk7XG4gICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuICAgICAgICB0aGlzLl9oYXNoZXIudXBkYXRlKG1lc3NhZ2VVcGRhdGUpO1xuXG4gICAgICAgIC8vIENoYWluYWJsZVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRmluYWxpemVzIHRoZSBITUFDIGNvbXB1dGF0aW9uLlxuICAgICAqIE5vdGUgdGhhdCB0aGUgZmluYWxpemUgb3BlcmF0aW9uIGlzIGVmZmVjdGl2ZWx5IGEgZGVzdHJ1Y3RpdmUsIHJlYWQtb25jZSBvcGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgKE9wdGlvbmFsKSBBIGZpbmFsIG1lc3NhZ2UgdXBkYXRlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgdmFyIGhtYWMgPSBobWFjSGFzaGVyLmZpbmFsaXplKCk7XG4gICAgICogICAgIHZhciBobWFjID0gaG1hY0hhc2hlci5maW5hbGl6ZSgnbWVzc2FnZScpO1xuICAgICAqICAgICB2YXIgaG1hYyA9IGhtYWNIYXNoZXIuZmluYWxpemUod29yZEFycmF5KTtcbiAgICAgKi9cbiAgICBmaW5hbGl6ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRcbiAgICAgICAgdmFyIGhhc2hlciA9IHRoaXMuX2hhc2hlcjtcblxuICAgICAgICAvLyBDb21wdXRlIEhNQUNcbiAgICAgICAgdmFyIGlubmVySGFzaCA9IGhhc2hlci5maW5hbGl6ZShtZXNzYWdlVXBkYXRlKTtcbiAgICAgICAgaGFzaGVyLnJlc2V0KCk7XG4gICAgICAgIHZhciBobWFjID0gaGFzaGVyLmZpbmFsaXplKHRoaXMuX29LZXkuY2xvbmUoKS5jb25jYXQoaW5uZXJIYXNoKSk7XG5cbiAgICAgICAgcmV0dXJuIGhtYWM7XG4gICAgfVxufSk7XG4iLCIvKipcbiAqIEBmaWxlIHNoYTI1Ni5qc1xuICogQGF1dGhvciA/Pz9cbiAqL1xudmFyIENyeXB0b0pTID0gcmVxdWlyZSgzNik7XG5cbiAgICAvLyBTaG9ydGN1dHNcbnZhciBDID0gQ3J5cHRvSlM7XG52YXIgQ19saWIgPSBDLmxpYjtcbnZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXk7XG52YXIgSGFzaGVyID0gQ19saWIuSGFzaGVyO1xudmFyIENfYWxnbyA9IEMuYWxnbztcblxuLy8gSW5pdGlhbGl6YXRpb24gYW5kIHJvdW5kIGNvbnN0YW50cyB0YWJsZXNcbnZhciBIID0gW107XG52YXIgSyA9IFtdO1xuXG4vLyBDb21wdXRlIGNvbnN0YW50c1xuKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBpc1ByaW1lKG4pIHtcbiAgICAgICAgdmFyIHNxcnROID0gTWF0aC5zcXJ0KG4pO1xuICAgICAgICBmb3IgKHZhciBmYWN0b3IgPSAyOyBmYWN0b3IgPD0gc3FydE47IGZhY3RvcisrKSB7XG4gICAgICAgICAgICBpZiAoIShuICUgZmFjdG9yKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RnJhY3Rpb25hbEJpdHMobikge1xuICAgICAgICByZXR1cm4gKChuIC0gKG4gfCAwKSkgKiAweDEwMDAwMDAwMCkgfCAwO1xuICAgIH1cblxuICAgIHZhciBuID0gMjtcbiAgICB2YXIgblByaW1lID0gMDtcbiAgICB3aGlsZSAoblByaW1lIDwgNjQpIHtcbiAgICAgICAgaWYgKGlzUHJpbWUobikpIHtcbiAgICAgICAgICAgIGlmIChuUHJpbWUgPCA4KSB7XG4gICAgICAgICAgICAgICAgSFtuUHJpbWVdID0gZ2V0RnJhY3Rpb25hbEJpdHMoTWF0aC5wb3cobiwgMSAvIDIpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgS1tuUHJpbWVdID0gZ2V0RnJhY3Rpb25hbEJpdHMoTWF0aC5wb3cobiwgMSAvIDMpKTtcblxuICAgICAgICAgICAgblByaW1lKys7XG4gICAgICAgIH1cblxuICAgICAgICBuKys7XG4gICAgfVxufSgpKTtcblxuLy8gUmV1c2FibGUgb2JqZWN0XG52YXIgVyA9IFtdO1xuXG4vKipcbiAqIFNIQS0yNTYgaGFzaCBhbGdvcml0aG0uXG4gKi9cbnZhciBTSEEyNTYgPSBDX2FsZ28uU0hBMjU2ID0gSGFzaGVyLmV4dGVuZCh7XG4gICAgX2RvUmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5faGFzaCA9IG5ldyBXb3JkQXJyYXkuaW5pdChILnNsaWNlKDApKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH0sXG5cbiAgICBfZG9Qcm9jZXNzQmxvY2s6IGZ1bmN0aW9uIChNLCBvZmZzZXQpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRcbiAgICAgICAgdmFyIEggPSB0aGlzLl9oYXNoLndvcmRzO1xuXG4gICAgICAgIC8vIFdvcmtpbmcgdmFyaWFibGVzXG4gICAgICAgIHZhciBhID0gSFswXTtcbiAgICAgICAgdmFyIGIgPSBIWzFdO1xuICAgICAgICB2YXIgYyA9IEhbMl07XG4gICAgICAgIHZhciBkID0gSFszXTtcbiAgICAgICAgdmFyIGUgPSBIWzRdO1xuICAgICAgICB2YXIgZiA9IEhbNV07XG4gICAgICAgIHZhciBnID0gSFs2XTtcbiAgICAgICAgdmFyIGggPSBIWzddO1xuXG4gICAgICAgIC8vIENvbXB1dGF0aW9uXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgPCAxNikge1xuICAgICAgICAgICAgICAgIFdbaV0gPSBNW29mZnNldCArIGldIHwgMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBnYW1tYTB4ID0gV1tpIC0gMTVdO1xuICAgICAgICAgICAgICAgIHZhciBnYW1tYTAgPSAoKGdhbW1hMHggPDwgMjUpXG4gICAgICAgICAgICAgICAgICAgIHwgKGdhbW1hMHggPj4+IDcpKSBeICgoZ2FtbWEweCA8PCAxNClcbiAgICAgICAgICAgICAgICAgICAgfCAoZ2FtbWEweCA+Pj4gMTgpKSBeIChnYW1tYTB4ID4+PiAzKTtcblxuICAgICAgICAgICAgICAgIHZhciBnYW1tYTF4ID0gV1tpIC0gMl07XG4gICAgICAgICAgICAgICAgdmFyIGdhbW1hMSA9ICgoZ2FtbWExeCA8PCAxNSlcbiAgICAgICAgICAgICAgICAgICAgfCAoZ2FtbWExeCA+Pj4gMTcpKSBeICgoZ2FtbWExeCA8PCAxMylcbiAgICAgICAgICAgICAgICAgICAgfCAoZ2FtbWExeCA+Pj4gMTkpKSBeIChnYW1tYTF4ID4+PiAxMCk7XG5cbiAgICAgICAgICAgICAgICBXW2ldID0gZ2FtbWEwICsgV1tpIC0gN10gKyBnYW1tYTEgKyBXW2kgLSAxNl07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjaCA9IChlICYgZikgXiAofmUgJiBnKTtcbiAgICAgICAgICAgIHZhciBtYWogPSAoYSAmIGIpIF4gKGEgJiBjKSBeIChiICYgYyk7XG5cbiAgICAgICAgICAgIHZhciBzaWdtYTAgPSAoKGEgPDwgMzApIHwgKGEgPj4+IDIpKSBeICgoYSA8PCAxOSkgfCAoYSA+Pj4gMTMpKSBeICgoYSA8PCAxMCkgfCAoYSA+Pj4gMjIpKTtcbiAgICAgICAgICAgIHZhciBzaWdtYTEgPSAoKGUgPDwgMjYpIHwgKGUgPj4+IDYpKSBeICgoZSA8PCAyMSkgfCAoZSA+Pj4gMTEpKSBeICgoZSA8PCA3KSB8IChlID4+PiAyNSkpO1xuXG4gICAgICAgICAgICB2YXIgdDEgPSBoICsgc2lnbWExICsgY2ggKyBLW2ldICsgV1tpXTtcbiAgICAgICAgICAgIHZhciB0MiA9IHNpZ21hMCArIG1hajtcblxuICAgICAgICAgICAgaCA9IGc7XG4gICAgICAgICAgICBnID0gZjtcbiAgICAgICAgICAgIGYgPSBlO1xuICAgICAgICAgICAgZSA9IChkICsgdDEpIHwgMDtcbiAgICAgICAgICAgIGQgPSBjO1xuICAgICAgICAgICAgYyA9IGI7XG4gICAgICAgICAgICBiID0gYTtcbiAgICAgICAgICAgIGEgPSAodDEgKyB0MikgfCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW50ZXJtZWRpYXRlIGhhc2ggdmFsdWVcbiAgICAgICAgSFswXSA9IChIWzBdICsgYSkgfCAwO1xuICAgICAgICBIWzFdID0gKEhbMV0gKyBiKSB8IDA7XG4gICAgICAgIEhbMl0gPSAoSFsyXSArIGMpIHwgMDtcbiAgICAgICAgSFszXSA9IChIWzNdICsgZCkgfCAwO1xuICAgICAgICBIWzRdID0gKEhbNF0gKyBlKSB8IDA7XG4gICAgICAgIEhbNV0gPSAoSFs1XSArIGYpIHwgMDtcbiAgICAgICAgSFs2XSA9IChIWzZdICsgZykgfCAwO1xuICAgICAgICBIWzddID0gKEhbN10gKyBoKSB8IDA7XG4gICAgfSxcblxuICAgIF9kb0ZpbmFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG4gICAgICAgIHZhciBkYXRhV29yZHMgPSBkYXRhLndvcmRzO1xuXG4gICAgICAgIHZhciBuQml0c1RvdGFsID0gdGhpcy5fbkRhdGFCeXRlcyAqIDg7XG4gICAgICAgIHZhciBuQml0c0xlZnQgPSBkYXRhLnNpZ0J5dGVzICogODtcblxuICAgICAgICAvLyBBZGQgcGFkZGluZ1xuICAgICAgICBkYXRhV29yZHNbbkJpdHNMZWZ0ID4+PiA1XSB8PSAweDgwIDw8ICgyNCAtIG5CaXRzTGVmdCAlIDMyKTtcbiAgICAgICAgZGF0YVdvcmRzWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNF0gPSBNYXRoLmZsb29yKG5CaXRzVG90YWwgLyAweDEwMDAwMDAwMCk7XG4gICAgICAgIGRhdGFXb3Jkc1soKChuQml0c0xlZnQgKyA2NCkgPj4+IDkpIDw8IDQpICsgMTVdID0gbkJpdHNUb3RhbDtcbiAgICAgICAgZGF0YS5zaWdCeXRlcyA9IGRhdGFXb3Jkcy5sZW5ndGggKiA0O1xuXG4gICAgICAgIC8vIEhhc2ggZmluYWwgYmxvY2tzXG4gICAgICAgIHRoaXMuX3Byb2Nlc3MoKTtcblxuICAgICAgICAvLyBSZXR1cm4gZmluYWwgY29tcHV0ZWQgaGFzaFxuICAgICAgICByZXR1cm4gdGhpcy5faGFzaDtcbiAgICB9LFxuXG4gICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNsb25lID0gSGFzaGVyLmNsb25lLmNhbGwodGhpcyk7XG4gICAgICAgIGNsb25lLl9oYXNoID0gdGhpcy5faGFzaC5jbG9uZSgpO1xuXG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBTaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cbiAqXG4gKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gaGFzaC5cbiAqXG4gKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuICpcbiAqIEBzdGF0aWNcbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTI1NignbWVzc2FnZScpO1xuICogICAgIHZhciBoYXNoID0gQ3J5cHRvSlMuU0hBMjU2KHdvcmRBcnJheSk7XG4gKi9cbkMuU0hBMjU2ID0gSGFzaGVyLl9jcmVhdGVIZWxwZXIoU0hBMjU2KTtcblxuLyoqXG4gKiBTaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgSE1BQydzIG9iamVjdCBpbnRlcmZhY2UuXG4gKlxuICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGhhc2guXG4gKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IGtleSBUaGUgc2VjcmV0IGtleS5cbiAqXG4gKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBITUFDLlxuICpcbiAqIEBzdGF0aWNcbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICB2YXIgaG1hYyA9IENyeXB0b0pTLkhtYWNTSEEyNTYobWVzc2FnZSwga2V5KTtcbiAqL1xuQy5IbWFjU0hBMjU2ID0gSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKFNIQTI1Nik7XG5cbm1vZHVsZS5leHBvcnRzID0gQ3J5cHRvSlMuU0hBMjU2O1xuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvY3J5cHRvLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgSG1hY1NIQTI1NiA9IHJlcXVpcmUoMzcpO1xudmFyIEhleCA9IHJlcXVpcmUoMzYpLmVuYy5IZXg7XG5cbmV4cG9ydHMuY3JlYXRlSG1hYyA9IGZ1bmN0aW9uICh0eXBlLCBrZXkpIHtcbiAgICBpZiAodHlwZSA9PT0gJ3NoYTI1NicpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XG5cbiAgICAgICAgdmFyIHNoYTI1NkhtYWMgPSB7XG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBIbWFjU0hBMjU2KGRhdGEsIGtleSkudG9TdHJpbmcoSGV4KTtcbiAgICAgICAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlICovXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlnZXN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gc2hhMjU2SG1hYztcbiAgICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvZXZlbnRzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKipcbiAqIEV2ZW50RW1pdHRlclxuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gICAgdGhpcy5fX2V2ZW50cyA9IHt9O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnROYW1lLCB2YXJfYXJncykge1xuICAgIHZhciBoYW5kbGVycyA9IHRoaXMuX19ldmVudHNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWhhbmRsZXJzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBoYW5kbGVyID0gaGFuZGxlcnNbaV07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgLy8gSUdOT1JFXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIGlmICghdGhpcy5fX2V2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICAgIHRoaXMuX19ldmVudHNbZXZlbnROYW1lXSA9IFtsaXN0ZW5lcl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChsaXN0ZW5lcik7XG4gICAgfVxufTtcblxuZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL2hlbHBlci5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuZnVuY3Rpb24gcGFkKG51bWJlcikge1xuICAgIGlmIChudW1iZXIgPCAxMCkge1xuICAgICAgICByZXR1cm4gJzAnICsgbnVtYmVyO1xuICAgIH1cbiAgICByZXR1cm4gbnVtYmVyO1xufVxuXG5leHBvcnRzLnRvSVNPU3RyaW5nID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBpZiAoZGF0ZS50b0lTT1N0cmluZykge1xuICAgICAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0ZS5nZXRVVENGdWxsWWVhcigpXG4gICAgICAgICsgJy0nICsgcGFkKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEpXG4gICAgICAgICsgJy0nICsgcGFkKGRhdGUuZ2V0VVRDRGF0ZSgpKVxuICAgICAgICArICdUJyArIHBhZChkYXRlLmdldFVUQ0hvdXJzKCkpXG4gICAgICAgICsgJzonICsgcGFkKGRhdGUuZ2V0VVRDTWludXRlcygpKVxuICAgICAgICArICc6JyArIHBhZChkYXRlLmdldFVUQ1NlY29uZHMoKSlcbiAgICAgICAgKyAnLicgKyAoZGF0ZS5nZXRVVENNaWxsaXNlY29uZHMoKSAvIDEwMDApLnRvRml4ZWQoMykuc2xpY2UoMiwgNSlcbiAgICAgICAgKyAnWic7XG59O1xuXG5leHBvcnRzLnRvVVRDU3RyaW5nID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICB2YXIgaXNvU3RyaW5nID0gZXhwb3J0cy50b0lTT1N0cmluZyhkYXRlKTtcbiAgICByZXR1cm4gaXNvU3RyaW5nLnJlcGxhY2UoL1xcLlxcZCtaJC8sICdaJyk7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9wYXRoLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgdSA9IHJlcXVpcmUoNDYpO1xuXG4vLyBTcGxpdCBhIGZpbGVuYW1lIGludG8gW3Jvb3QsIGRpciwgYmFzZW5hbWUsIGV4dF0sIHVuaXggdmVyc2lvblxuLy8gJ3Jvb3QnIGlzIGp1c3QgYSBzbGFzaCwgb3Igbm90aGluZy5cbnZhciBzcGxpdFBhdGhSZSA9IC9eKFxcLz98KShbXFxzXFxTXSo/KSgoPzpcXC57MSwyfXxbXlxcL10rP3wpKFxcLlteLlxcL10qfCkpKD86W1xcL10qKSQvO1xuXG5mdW5jdGlvbiBzcGxpdFBhdGgoZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gc3BsaXRQYXRoUmUuZXhlYyhmaWxlbmFtZSkuc2xpY2UoMSk7XG59XG5cbi8vIHJlc29sdmVzIC4gYW5kIC4uIGVsZW1lbnRzIGluIGEgcGF0aCBhcnJheSB3aXRoIGRpcmVjdG9yeSBuYW1lcyB0aGVyZVxuLy8gbXVzdCBiZSBubyBzbGFzaGVzLCBlbXB0eSBlbGVtZW50cywgb3IgZGV2aWNlIG5hbWVzIChjOlxcKSBpbiB0aGUgYXJyYXlcbi8vIChzbyBhbHNvIG5vIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHNsYXNoZXMgLSBpdCBkb2VzIG5vdCBkaXN0aW5ndWlzaFxuLy8gcmVsYXRpdmUgYW5kIGFic29sdXRlIHBhdGhzKVxuZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkocGFydHMsIGFsbG93QWJvdmVSb290KSB7XG4gICAgLy8gaWYgdGhlIHBhdGggdHJpZXMgdG8gZ28gYWJvdmUgdGhlIHJvb3QsIGB1cGAgZW5kcyB1cCA+IDBcbiAgICB2YXIgdXAgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IHBhcnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHZhciBsYXN0ID0gcGFydHNbaV07XG5cbiAgICAgICAgaWYgKGxhc3QgPT09ICcuJykge1xuICAgICAgICAgICAgcGFydHMuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGxhc3QgPT09ICcuLicpIHtcbiAgICAgICAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIHVwKys7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodXApIHtcbiAgICAgICAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIHVwLS07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgcGF0aCBpcyBhbGxvd2VkIHRvIGdvIGFib3ZlIHRoZSByb290LCByZXN0b3JlIGxlYWRpbmcgLi5zXG4gICAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgICAgIGZvciAoOyB1cC0tOyB1cCkge1xuICAgICAgICAgICAgcGFydHMudW5zaGlmdCgnLi4nKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJ0cztcbn1cblxuLy8gU3RyaW5nLnByb3RvdHlwZS5zdWJzdHIgLSBuZWdhdGl2ZSBpbmRleCBkb24ndCB3b3JrIGluIElFOFxudmFyIHN1YnN0ciA9ICdhYicuc3Vic3RyKC0xKSA9PT0gJ2InXG4gICAgPyBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH1cbiAgICA6IGZ1bmN0aW9uIChzdHIsIHN0YXJ0LCBsZW4pIHtcbiAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgc3RhcnQgPSBzdHIubGVuZ3RoICsgc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0ci5zdWJzdHIoc3RhcnQsIGxlbik7XG4gICAgfTtcblxuZXhwb3J0cy5leHRuYW1lID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICByZXR1cm4gc3BsaXRQYXRoKHBhdGgpWzNdO1xufTtcblxuZXhwb3J0cy5qb2luID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXRocyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgcmV0dXJuIGV4cG9ydHMubm9ybWFsaXplKHUuZmlsdGVyKHBhdGhzLCBmdW5jdGlvbiAocCwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIHRvIHBhdGguam9pbiBtdXN0IGJlIHN0cmluZ3MnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcDtcbiAgICB9KS5qb2luKCcvJykpO1xufTtcblxuZXhwb3J0cy5ub3JtYWxpemUgPSBmdW5jdGlvbiAocGF0aCkge1xuICAgIHZhciBpc0Fic29sdXRlID0gcGF0aC5jaGFyQXQoMCkgPT09ICcvJztcbiAgICB2YXIgdHJhaWxpbmdTbGFzaCA9IHN1YnN0cihwYXRoLCAtMSkgPT09ICcvJztcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICAgIHBhdGggPSBub3JtYWxpemVBcnJheSh1LmZpbHRlcihwYXRoLnNwbGl0KCcvJyksIGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIHJldHVybiAhIXA7XG4gICAgfSksICFpc0Fic29sdXRlKS5qb2luKCcvJyk7XG5cbiAgICBpZiAoIXBhdGggJiYgIWlzQWJzb2x1dGUpIHtcbiAgICAgICAgcGF0aCA9ICcuJztcbiAgICB9XG4gICAgaWYgKHBhdGggJiYgdHJhaWxpbmdTbGFzaCkge1xuICAgICAgICBwYXRoICs9ICcvJztcbiAgICB9XG5cbiAgICByZXR1cm4gKGlzQWJzb2x1dGUgPyAnLycgOiAnJykgKyBwYXRoO1xufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgc3JjL3ZlbmRvci9xLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xudmFyIFByb21pc2UgPSByZXF1aXJlKDM0KTtcblxuZXhwb3J0cy5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUuYXBwbHkoUHJvbWlzZSwgYXJndW1lbnRzKTtcbn07XG5cbmV4cG9ydHMucmVqZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdC5hcHBseShQcm9taXNlLCBhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsLmFwcGx5KFByb21pc2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLmZjYWxsID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmbigpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChleCk7XG4gICAgfVxufTtcblxuZXhwb3J0cy5kZWZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSB7fTtcblxuICAgIGRlZmVycmVkLnByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXNvbHZlLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlamVjdC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSBzcmMvdmVuZG9yL3F1ZXJ5c3RyaW5nLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgdSA9IHJlcXVpcmUoNDYpO1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlQcmltaXRpdmUodikge1xuICAgIGlmICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHY7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2KSkge1xuICAgICAgICByZXR1cm4gJycgKyB2O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcbiAgICB9XG5cbiAgICByZXR1cm4gJyc7XG59XG5cbmV4cG9ydHMuc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KG9iaiwgc2VwLCBlcSwgb3B0aW9ucykge1xuICAgIHNlcCA9IHNlcCB8fCAnJic7XG4gICAgZXEgPSBlcSB8fCAnPSc7XG5cbiAgICB2YXIgZW5jb2RlID0gZW5jb2RlVVJJQ29tcG9uZW50OyAvLyBRdWVyeVN0cmluZy5lc2NhcGU7XG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuZW5jb2RlVVJJQ29tcG9uZW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGVuY29kZSA9IG9wdGlvbnMuZW5jb2RlVVJJQ29tcG9uZW50O1xuICAgIH1cblxuICAgIGlmIChvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgdmFyIGtleXMgPSB1LmtleXMob2JqKTtcbiAgICAgICAgdmFyIGxlbiA9IGtleXMubGVuZ3RoO1xuICAgICAgICB2YXIgZmxhc3QgPSBsZW4gLSAxO1xuICAgICAgICB2YXIgZmllbGRzID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICAgICAgICAgIHZhciB2ID0gb2JqW2tdO1xuICAgICAgICAgICAgdmFyIGtzID0gZW5jb2RlKHN0cmluZ2lmeVByaW1pdGl2ZShrKSkgKyBlcTtcblxuICAgICAgICAgICAgaWYgKHUuaXNBcnJheSh2KSkge1xuICAgICAgICAgICAgICAgIHZhciB2bGVuID0gdi5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIHZsYXN0ID0gdmxlbiAtIDE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB2bGVuOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IGtzICsgZW5jb2RlKHN0cmluZ2lmeVByaW1pdGl2ZSh2W2pdKSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqIDwgdmxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBzZXA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodmxlbiAmJiBpIDwgZmxhc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzICs9IHNlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWVsZHMgKz0ga3MgKyBlbmNvZGUoc3RyaW5naWZ5UHJpbWl0aXZlKHYpKTtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IGZsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBzZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xufTtcbiIsIi8qKlxuICogYWcgLS1uby1maWxlbmFtZSAtbyAnXFxiKHVcXC4uKj8pXFwoJyAuICB8IHNvcnQgfCB1bmlxIC1jXG4gKlxuICogQGZpbGUgdmVuZG9yL3VuZGVyc2NvcmUuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBpc0FycmF5ID0gcmVxdWlyZSg1KTtcbnZhciBub29wID0gcmVxdWlyZSgxMCk7XG52YXIgaXNOdW1iZXIgPSByZXF1aXJlKDEzKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoMTQpO1xuXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09IHN0cmluZ1RhZztcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGV4dGVuZChzb3VyY2UsIHZhcl9hcmdzKSB7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChpdGVtICYmIGlzT2JqZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICB2YXIgb0tleXMgPSBrZXlzKGl0ZW0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvS2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBvS2V5c1tqXTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBpdGVtW2tleV07XG4gICAgICAgICAgICAgICAgc291cmNlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzb3VyY2U7XG59XG5cbmZ1bmN0aW9uIG1hcChhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHRbaV0gPSBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGZvcmVhY2goYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGFycmF5W2ldLCBpLCBhcnJheSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBmaW5kKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV07XG4gICAgICAgIGlmIChjYWxsYmFjay5jYWxsKGNvbnRleHQsIHZhbHVlLCBpLCBhcnJheSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIHZhciByZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldO1xuICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSwgaSwgYXJyYXkpKSB7XG4gICAgICAgICAgICByZXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gb21pdChvYmplY3QsIHZhcl9hcmdzKSB7XG4gICAgdmFyIGFyZ3MgPSBpc0FycmF5KHZhcl9hcmdzKVxuICAgICAgICA/IHZhcl9hcmdzXG4gICAgICAgIDogW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgdmFyIG9LZXlzID0ga2V5cyhvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb0tleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IG9LZXlzW2ldO1xuICAgICAgICBpZiAoYXJncy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgICAgICByZXN1bHRba2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gcGljayhvYmplY3QsIHZhcl9hcmdzLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgdmFyIGk7XG4gICAgdmFyIGtleTtcbiAgICB2YXIgdmFsdWU7XG5cbiAgICBpZiAoaXNGdW5jdGlvbih2YXJfYXJncykpIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdmFyX2FyZ3M7XG4gICAgICAgIHZhciBvS2V5cyA9IGtleXMob2JqZWN0KTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG9LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBrZXkgPSBvS2V5c1tpXTtcbiAgICAgICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSwga2V5LCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBpc0FycmF5KHZhcl9hcmdzKVxuICAgICAgICAgICAgPyB2YXJfYXJnc1xuICAgICAgICAgICAgOiBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGtleSA9IGFyZ3NbaV07XG4gICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGJpbmQoZm4sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIGhhc0RvbnRFbnVtQnVnID0gISh7dG9TdHJpbmc6IG51bGx9KS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbnZhciBkb250RW51bXMgPSBbJ3RvU3RyaW5nJywgJ3RvTG9jYWxlU3RyaW5nJywgJ3ZhbHVlT2YnLCAnaGFzT3duUHJvcGVydHknLFxuICAgICdpc1Byb3RvdHlwZU9mJywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2NvbnN0cnVjdG9yJ107XG5cbmZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBwcm9wO1xuICAgIHZhciBpO1xuXG4gICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChwcm9wKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZG9udEVudW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGRvbnRFbnVtc1tpXSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChkb250RW51bXNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0cy5iaW5kID0gYmluZDtcbmV4cG9ydHMuZWFjaCA9IGZvcmVhY2g7XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMuZmlsdGVyID0gZmlsdGVyO1xuZXhwb3J0cy5maW5kID0gZmluZDtcbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuZXhwb3J0cy5tYXAgPSBtYXA7XG5leHBvcnRzLm9taXQgPSBvbWl0O1xuZXhwb3J0cy5waWNrID0gcGljaztcbmV4cG9ydHMua2V5cyA9IGtleXM7XG5leHBvcnRzLm5vb3AgPSBub29wO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci91dGlsLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgdSA9IHJlcXVpcmUoNDYpO1xuXG5leHBvcnRzLmluaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gICAgdmFyIHN1YkNsYXNzUHJvdG8gPSBzdWJDbGFzcy5wcm90b3R5cGU7XG4gICAgdmFyIEYgPSBuZXcgRnVuY3Rpb24oKTtcbiAgICBGLnByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xuICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IG5ldyBGKCk7XG4gICAgc3ViQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7XG4gICAgdS5leHRlbmQoc3ViQ2xhc3MucHJvdG90eXBlLCBzdWJDbGFzc1Byb3RvKTtcbn07XG5cbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24gKGYpIHtcbiAgICB2YXIgYXJnTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgIGlmIChhcmdMZW4gPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIGY7XG4gICAgfVxuXG4gICAgdmFyIHN0ciA9ICcnO1xuICAgIHZhciBhID0gMTtcbiAgICB2YXIgbGFzdFBvcyA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmLmxlbmd0aDspIHtcbiAgICAgICAgaWYgKGYuY2hhckNvZGVBdChpKSA9PT0gMzcgLyoqICclJyAqLyAmJiBpICsgMSA8IGYubGVuZ3RoKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGYuY2hhckNvZGVBdChpICsgMSkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDEwMDogLy8gJ2QnXG4gICAgICAgICAgICAgICAgICAgIGlmIChhID49IGFyZ0xlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IE51bWJlcihhcmd1bWVudHNbYSsrXSk7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RQb3MgPSBpID0gaSArIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgMTE1OiAvLyAncydcbiAgICAgICAgICAgICAgICAgICAgaWYgKGEgPj0gYXJnTGVuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gU3RyaW5nKGFyZ3VtZW50c1thKytdKTtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBvcyA9IGkgPSBpICsgMjtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSAzNzogLy8gJyUnXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0UG9zIDwgaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJyUnO1xuICAgICAgICAgICAgICAgICAgICBsYXN0UG9zID0gaSA9IGkgKyAyO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICsraTtcbiAgICB9XG5cbiAgICBpZiAobGFzdFBvcyA9PT0gMCkge1xuICAgICAgICBzdHIgPSBmO1xuICAgIH1cbiAgICBlbHNlIGlmIChsYXN0UG9zIDwgZi5sZW5ndGgpIHtcbiAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cjtcbn07XG4iXX0=
