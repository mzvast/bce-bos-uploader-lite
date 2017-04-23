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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy5tYXBsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmRvcGFyYWxsZWxsaW1pdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmVhY2hvZmxpbWl0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwuaXNhcnJheS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLmlzYXJyYXlsaWtlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwua2V5aXRlcmF0b3IvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwubWFwYXN5bmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYXN5bmMudXRpbC5ub29wL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2FzeW5jLnV0aWwub25jZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hc3luYy51dGlsLm9ubHlvbmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC5pc251bWJlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2guaXNvYmplY3QvaW5kZXguanMiLCJzcmMvYmNlLXNkay1qcy9hdXRoLmpzIiwic3JjL2JjZS1zZGstanMvYmNlX2Jhc2VfY2xpZW50LmpzIiwic3JjL2JjZS1zZGstanMvYm9zX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL2NvbmZpZy5qcyIsInNyYy9iY2Utc2RrLWpzL2hlYWRlcnMuanMiLCJzcmMvYmNlLXNkay1qcy9odHRwX2NsaWVudC5qcyIsInNyYy9iY2Utc2RrLWpzL21pbWUudHlwZXMuanMiLCJzcmMvYmNlLXNkay1qcy9zdHJpbmdzLmpzIiwic3JjL2NvbmZpZy5qcyIsInNyYy9ldmVudHMuanMiLCJzcmMvbXVsdGlwYXJ0X3Rhc2suanMiLCJzcmMvbmV0d29ya19pbmZvLmpzIiwic3JjL3B1dF9vYmplY3RfdGFzay5qcyIsInNyYy9xdWV1ZS5qcyIsInNyYy9zdHNfdG9rZW5fbWFuYWdlci5qcyIsInNyYy90YXNrLmpzIiwic3JjL3VwbG9hZGVyLmpzIiwic3JjL3V0aWxzLmpzIiwic3JjL3ZlbmRvci9CdWZmZXIuanMiLCJzcmMvdmVuZG9yL1Byb21pc2UuanMiLCJzcmMvdmVuZG9yL2FzeW5jLmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvY29yZS5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL2htYWMtc2hhMjU2LmpzIiwic3JjL3ZlbmRvci9jcnlwdG8tanMvaG1hYy5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLWpzL3NoYTI1Ni5qcyIsInNyYy92ZW5kb3IvY3J5cHRvLmpzIiwic3JjL3ZlbmRvci9ldmVudHMuanMiLCJzcmMvdmVuZG9yL2hlbHBlci5qcyIsInNyYy92ZW5kb3IvcGF0aC5qcyIsInNyYy92ZW5kb3IvcS5qcyIsInNyYy92ZW5kb3IvcXVlcnlzdHJpbmcuanMiLCJzcmMvdmVuZG9yL3VuZGVyc2NvcmUuanMiLCJzcmMvdmVuZG9yL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOWxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2x2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25JQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIGJjZS1ib3MtdXBsb2FkZXIvaW5kZXguanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgQm9zQ2xpZW50ID0gcmVxdWlyZSgxNyk7XG52YXIgQXV0aCA9IHJlcXVpcmUoMTUpO1xuXG52YXIgVXBsb2FkZXIgPSByZXF1aXJlKDMxKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBib3M6IHtcbiAgICAgICAgVXBsb2FkZXI6IFVwbG9hZGVyXG4gICAgfSxcbiAgICB1dGlsczogdXRpbHMsXG4gICAgc2RrOiB7XG4gICAgICAgIFE6IFEsXG4gICAgICAgIEJvc0NsaWVudDogQm9zQ2xpZW50LFxuICAgICAgICBBdXRoOiBBdXRoXG4gICAgfVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBtYXBBc3luYyA9IHJlcXVpcmUoOSk7XG52YXIgZG9QYXJhbGxlbExpbWl0ID0gcmVxdWlyZSgzKTtcbm1vZHVsZS5leHBvcnRzID0gZG9QYXJhbGxlbExpbWl0KG1hcEFzeW5jKTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBlYWNoT2ZMaW1pdCA9IHJlcXVpcmUoNCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZG9QYXJhbGxlbExpbWl0KGZuKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgbGltaXQsIGl0ZXJhdG9yLCBjYikge1xuICAgICAgICByZXR1cm4gZm4oZWFjaE9mTGltaXQobGltaXQpLCBvYmosIGl0ZXJhdG9yLCBjYik7XG4gICAgfTtcbn07XG4iLCJ2YXIgb25jZSA9IHJlcXVpcmUoMTEpO1xudmFyIG5vb3AgPSByZXF1aXJlKDEwKTtcbnZhciBvbmx5T25jZSA9IHJlcXVpcmUoMTIpO1xudmFyIGtleUl0ZXJhdG9yID0gcmVxdWlyZSg3KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlYWNoT2ZMaW1pdChsaW1pdCkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjYikge1xuICAgICAgICBjYiA9IG9uY2UoY2IgfHwgbm9vcCk7XG4gICAgICAgIG9iaiA9IG9iaiB8fCBbXTtcbiAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlJdGVyYXRvcihvYmopO1xuICAgICAgICBpZiAobGltaXQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgICAgIHZhciBydW5uaW5nID0gMDtcbiAgICAgICAgdmFyIGVycm9yZWQgPSBmYWxzZTtcblxuICAgICAgICAoZnVuY3Rpb24gcmVwbGVuaXNoKCkge1xuICAgICAgICAgICAgaWYgKGRvbmUgJiYgcnVubmluZyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAocnVubmluZyA8IGxpbWl0ICYmICFlcnJvcmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IG5leHRLZXkoKTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAocnVubmluZyA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJ1bm5pbmcgKz0gMTtcbiAgICAgICAgICAgICAgICBpdGVyYXRvcihvYmpba2V5XSwga2V5LCBvbmx5T25jZShmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcnVubmluZyAtPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXBsZW5pc2goKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXkgPSByZXF1aXJlKDUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQXJyYXlMaWtlKGFycikge1xuICAgIHJldHVybiBpc0FycmF5KGFycikgfHwgKFxuICAgICAgICAvLyBoYXMgYSBwb3NpdGl2ZSBpbnRlZ2VyIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAgICB0eXBlb2YgYXJyLmxlbmd0aCA9PT0gJ251bWJlcicgJiZcbiAgICAgICAgYXJyLmxlbmd0aCA+PSAwICYmXG4gICAgICAgIGFyci5sZW5ndGggJSAxID09PSAwXG4gICAgKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfa2V5cyA9IHJlcXVpcmUoOCk7XG52YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKDYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGtleUl0ZXJhdG9yKGNvbGwpIHtcbiAgICB2YXIgaSA9IC0xO1xuICAgIHZhciBsZW47XG4gICAgdmFyIGtleXM7XG4gICAgaWYgKGlzQXJyYXlMaWtlKGNvbGwpKSB7XG4gICAgICAgIGxlbiA9IGNvbGwubGVuZ3RoO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIHJldHVybiBpIDwgbGVuID8gaSA6IG51bGw7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgICAga2V5cyA9IF9rZXlzKGNvbGwpO1xuICAgICAgICBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICByZXR1cm4gaSA8IGxlbiA/IGtleXNbaV0gOiBudWxsO1xuICAgICAgICB9O1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhvYmopIHtcbiAgICB2YXIgX2tleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGspKSB7XG4gICAgICAgICAgICBfa2V5cy5wdXNoKGspO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfa2V5cztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBvbmNlID0gcmVxdWlyZSgxMSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoMTApO1xudmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSg2KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXBBc3luYyhlYWNoZm4sIGFyciwgaXRlcmF0b3IsIGNiKSB7XG4gICAgY2IgPSBvbmNlKGNiIHx8IG5vb3ApO1xuICAgIGFyciA9IGFyciB8fCBbXTtcbiAgICB2YXIgcmVzdWx0cyA9IGlzQXJyYXlMaWtlKGFycikgPyBbXSA6IHt9O1xuICAgIGVhY2hmbihhcnIsIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIGNiKSB7XG4gICAgICAgIGl0ZXJhdG9yKHZhbHVlLCBmdW5jdGlvbiAoZXJyLCB2KSB7XG4gICAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHY7XG4gICAgICAgICAgICBjYihlcnIpO1xuICAgICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNiKGVyciwgcmVzdWx0cyk7XG4gICAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vb3AgKCkge307XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gb25jZShmbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGZuID09PSBudWxsKSByZXR1cm47XG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBvbmx5X29uY2UoZm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChmbiA9PT0gbnVsbCkgdGhyb3cgbmV3IEVycm9yKCdDYWxsYmFjayB3YXMgYWxyZWFkeSBjYWxsZWQuJyk7XG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGZuID0gbnVsbDtcbiAgICB9O1xufTtcbiIsIi8qKlxuICogbG9kYXNoIDMuMC4zIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE2IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTYgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBOdW1iZXJgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogKipOb3RlOioqIFRvIGV4Y2x1ZGUgYEluZmluaXR5YCwgYC1JbmZpbml0eWAsIGFuZCBgTmFOYCwgd2hpY2ggYXJlIGNsYXNzaWZpZWRcbiAqIGFzIG51bWJlcnMsIHVzZSB0aGUgYF8uaXNGaW5pdGVgIG1ldGhvZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc051bWJlcigzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBudW1iZXJUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTnVtYmVyO1xuIiwiLyoqXG4gKiBsb2Rhc2ggMy4wLjIgKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2Rlcm4gbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgMjAxMi0yMDE1IFRoZSBEb2pvIEZvdW5kYXRpb24gPGh0dHA6Ly9kb2pvZm91bmRhdGlvbi5vcmcvPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCAyMDA5LTIwMTUgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqIEF2YWlsYWJsZSB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKi9cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2F1dGguanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuLyogZXNsaW50IG1heC1wYXJhbXM6WzAsMTBdICovXG5cbnZhciBoZWxwZXIgPSByZXF1aXJlKDQyKTtcbnZhciB1dGlsID0gcmVxdWlyZSg0Nyk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIEggPSByZXF1aXJlKDE5KTtcbnZhciBzdHJpbmdzID0gcmVxdWlyZSgyMik7XG5cbi8qKlxuICogQXV0aFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IGFrIFRoZSBhY2Nlc3Mga2V5LlxuICogQHBhcmFtIHtzdHJpbmd9IHNrIFRoZSBzZWN1cml0eSBrZXkuXG4gKi9cbmZ1bmN0aW9uIEF1dGgoYWssIHNrKSB7XG4gICAgdGhpcy5hayA9IGFrO1xuICAgIHRoaXMuc2sgPSBzaztcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgc2lnbmF0dXJlIGJhc2VkIG9uIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0F1dGhlbnRpY2F0aW9uTWVjaGFuaXNtXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZCBUaGUgaHR0cCByZXF1ZXN0IG1ldGhvZCwgc3VjaCBhcyBHRVQsIFBPU1QsIERFTEVURSwgUFVULCAuLi5cbiAqIEBwYXJhbSB7c3RyaW5nfSByZXNvdXJjZSBUaGUgcmVxdWVzdCBwYXRoLlxuICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgVGhlIHF1ZXJ5IHN0cmluZ3MuXG4gKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgVGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICogQHBhcmFtIHtudW1iZXI9fSB0aW1lc3RhbXAgU2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcC5cbiAqIEBwYXJhbSB7bnVtYmVyPX0gZXhwaXJhdGlvbkluU2Vjb25kcyBUaGUgc2lnbmF0dXJlIHZhbGlkYXRpb24gdGltZS5cbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz49fSBoZWFkZXJzVG9TaWduIFRoZSByZXF1ZXN0IGhlYWRlcnMgbGlzdCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gY2FsY3VhbGF0ZSB0aGUgc2lnbmF0dXJlLlxuICpcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHNpZ25hdHVyZS5cbiAqL1xuQXV0aC5wcm90b3R5cGUuZ2VuZXJhdGVBdXRob3JpemF0aW9uID0gZnVuY3Rpb24gKG1ldGhvZCwgcmVzb3VyY2UsIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzLCB0aW1lc3RhbXAsIGV4cGlyYXRpb25JblNlY29uZHMsIGhlYWRlcnNUb1NpZ24pIHtcblxuICAgIHZhciBub3cgPSB0aW1lc3RhbXAgPyBuZXcgRGF0ZSh0aW1lc3RhbXAgKiAxMDAwKSA6IG5ldyBEYXRlKCk7XG4gICAgdmFyIHJhd1Nlc3Npb25LZXkgPSB1dGlsLmZvcm1hdCgnYmNlLWF1dGgtdjEvJXMvJXMvJWQnLFxuICAgICAgICB0aGlzLmFrLCBoZWxwZXIudG9VVENTdHJpbmcobm93KSwgZXhwaXJhdGlvbkluU2Vjb25kcyB8fCAxODAwKTtcbiAgICB2YXIgc2Vzc2lvbktleSA9IHRoaXMuaGFzaChyYXdTZXNzaW9uS2V5LCB0aGlzLnNrKTtcblxuICAgIHZhciBjYW5vbmljYWxVcmkgPSB0aGlzLnVyaUNhbm9uaWNhbGl6YXRpb24ocmVzb3VyY2UpO1xuICAgIHZhciBjYW5vbmljYWxRdWVyeVN0cmluZyA9IHRoaXMucXVlcnlTdHJpbmdDYW5vbmljYWxpemF0aW9uKHBhcmFtcyB8fCB7fSk7XG5cbiAgICB2YXIgcnYgPSB0aGlzLmhlYWRlcnNDYW5vbmljYWxpemF0aW9uKGhlYWRlcnMgfHwge30sIGhlYWRlcnNUb1NpZ24pO1xuICAgIHZhciBjYW5vbmljYWxIZWFkZXJzID0gcnZbMF07XG4gICAgdmFyIHNpZ25lZEhlYWRlcnMgPSBydlsxXTtcblxuICAgIHZhciByYXdTaWduYXR1cmUgPSB1dGlsLmZvcm1hdCgnJXNcXG4lc1xcbiVzXFxuJXMnLFxuICAgICAgICBtZXRob2QsIGNhbm9uaWNhbFVyaSwgY2Fub25pY2FsUXVlcnlTdHJpbmcsIGNhbm9uaWNhbEhlYWRlcnMpO1xuICAgIHZhciBzaWduYXR1cmUgPSB0aGlzLmhhc2gocmF3U2lnbmF0dXJlLCBzZXNzaW9uS2V5KTtcblxuICAgIGlmIChzaWduZWRIZWFkZXJzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzLyVzLyVzJywgcmF3U2Vzc2lvbktleSwgc2lnbmVkSGVhZGVycy5qb2luKCc7JyksIHNpZ25hdHVyZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHV0aWwuZm9ybWF0KCclcy8vJXMnLCByYXdTZXNzaW9uS2V5LCBzaWduYXR1cmUpO1xufTtcblxuQXV0aC5wcm90b3R5cGUudXJpQ2Fub25pY2FsaXphdGlvbiA9IGZ1bmN0aW9uICh1cmkpIHtcbiAgICByZXR1cm4gdXJpO1xufTtcblxuLyoqXG4gKiBDYW5vbmljYWwgdGhlIHF1ZXJ5IHN0cmluZ3MuXG4gKlxuICogQHNlZSBodHRwOi8vZ29sbHVtLmJhaWR1LmNvbS9BdXRoZW50aWNhdGlvbk1lY2hhbmlzbSPnlJ/miJBDYW5vbmljYWxRdWVyeVN0cmluZ1xuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBUaGUgcXVlcnkgc3RyaW5ncy5cbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuQXV0aC5wcm90b3R5cGUucXVlcnlTdHJpbmdDYW5vbmljYWxpemF0aW9uID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgIHZhciBjYW5vbmljYWxRdWVyeVN0cmluZyA9IFtdO1xuICAgIHUuZWFjaCh1LmtleXMocGFyYW1zKSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoa2V5LnRvTG93ZXJDYXNlKCkgPT09IEguQVVUSE9SSVpBVElPTi50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsdWUgPSBwYXJhbXNba2V5XSA9PSBudWxsID8gJycgOiBwYXJhbXNba2V5XTtcbiAgICAgICAgY2Fub25pY2FsUXVlcnlTdHJpbmcucHVzaChrZXkgKyAnPScgKyBzdHJpbmdzLm5vcm1hbGl6ZSh2YWx1ZSkpO1xuICAgIH0pO1xuXG4gICAgY2Fub25pY2FsUXVlcnlTdHJpbmcuc29ydCgpO1xuXG4gICAgcmV0dXJuIGNhbm9uaWNhbFF1ZXJ5U3RyaW5nLmpvaW4oJyYnKTtcbn07XG5cbi8qKlxuICogQ2Fub25pY2FsIHRoZSBodHRwIHJlcXVlc3QgaGVhZGVycy5cbiAqXG4gKiBAc2VlIGh0dHA6Ly9nb2xsdW0uYmFpZHUuY29tL0F1dGhlbnRpY2F0aW9uTWVjaGFuaXNtI+eUn+aIkENhbm9uaWNhbEhlYWRlcnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBoZWFkZXJzIFRoZSBodHRwIHJlcXVlc3QgaGVhZGVycy5cbiAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz49fSBoZWFkZXJzVG9TaWduIFRoZSByZXF1ZXN0IGhlYWRlcnMgbGlzdCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gY2FsY3VhbGF0ZSB0aGUgc2lnbmF0dXJlLlxuICogQHJldHVybiB7Kn0gY2Fub25pY2FsSGVhZGVycyBhbmQgc2lnbmVkSGVhZGVyc1xuICovXG5BdXRoLnByb3RvdHlwZS5oZWFkZXJzQ2Fub25pY2FsaXphdGlvbiA9IGZ1bmN0aW9uIChoZWFkZXJzLCBoZWFkZXJzVG9TaWduKSB7XG4gICAgaWYgKCFoZWFkZXJzVG9TaWduIHx8ICFoZWFkZXJzVG9TaWduLmxlbmd0aCkge1xuICAgICAgICBoZWFkZXJzVG9TaWduID0gW0guSE9TVCwgSC5DT05URU5UX01ENSwgSC5DT05URU5UX0xFTkdUSCwgSC5DT05URU5UX1RZUEVdO1xuICAgIH1cblxuICAgIHZhciBoZWFkZXJzTWFwID0ge307XG4gICAgdS5lYWNoKGhlYWRlcnNUb1NpZ24sIGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGhlYWRlcnNNYXBbaXRlbS50b0xvd2VyQ2FzZSgpXSA9IHRydWU7XG4gICAgfSk7XG5cbiAgICB2YXIgY2Fub25pY2FsSGVhZGVycyA9IFtdO1xuICAgIHUuZWFjaCh1LmtleXMoaGVhZGVycyksIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gaGVhZGVyc1trZXldO1xuICAgICAgICB2YWx1ZSA9IHUuaXNTdHJpbmcodmFsdWUpID8gc3RyaW5ncy50cmltKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCB2YWx1ZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBrZXkgPSBrZXkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKC9eeFxcLWJjZVxcLS8udGVzdChrZXkpIHx8IGhlYWRlcnNNYXBba2V5XSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY2Fub25pY2FsSGVhZGVycy5wdXNoKHV0aWwuZm9ybWF0KCclczolcycsXG4gICAgICAgICAgICAgICAgLy8gZW5jb2RlVVJJQ29tcG9uZW50KGtleSksIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpKTtcbiAgICAgICAgICAgICAgICBzdHJpbmdzLm5vcm1hbGl6ZShrZXkpLCBzdHJpbmdzLm5vcm1hbGl6ZSh2YWx1ZSkpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2Fub25pY2FsSGVhZGVycy5zb3J0KCk7XG5cbiAgICB2YXIgc2lnbmVkSGVhZGVycyA9IFtdO1xuICAgIHUuZWFjaChjYW5vbmljYWxIZWFkZXJzLCBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBzaWduZWRIZWFkZXJzLnB1c2goaXRlbS5zcGxpdCgnOicpWzBdKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBbY2Fub25pY2FsSGVhZGVycy5qb2luKCdcXG4nKSwgc2lnbmVkSGVhZGVyc107XG59O1xuXG5BdXRoLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKGRhdGEsIGtleSkge1xuICAgIHZhciBjcnlwdG8gPSByZXF1aXJlKDQwKTtcbiAgICB2YXIgc2hhMjU2SG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKCdzaGEyNTYnLCBrZXkpO1xuICAgIHNoYTI1NkhtYWMudXBkYXRlKGRhdGEpO1xuICAgIHJldHVybiBzaGEyNTZIbWFjLmRpZ2VzdCgnaGV4Jyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEF1dGg7XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2JjZV9iYXNlX2NsaWVudC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKDQxKS5FdmVudEVtaXR0ZXI7XG52YXIgdXRpbCA9IHJlcXVpcmUoNDcpO1xudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgY29uZmlnID0gcmVxdWlyZSgxOCk7XG52YXIgQXV0aCA9IHJlcXVpcmUoMTUpO1xuXG4vKipcbiAqIEJjZUJhc2VDbGllbnRcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjbGllbnRDb25maWcgVGhlIGJjZSBjbGllbnQgY29uZmlndXJhdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzZXJ2aWNlSWQgVGhlIHNlcnZpY2UgaWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSByZWdpb25TdXBwb3J0ZWQgVGhlIHNlcnZpY2Ugc3VwcG9ydGVkIHJlZ2lvbiBvciBub3QuXG4gKi9cbmZ1bmN0aW9uIEJjZUJhc2VDbGllbnQoY2xpZW50Q29uZmlnLCBzZXJ2aWNlSWQsIHJlZ2lvblN1cHBvcnRlZCkge1xuICAgIEV2ZW50RW1pdHRlci5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5jb25maWcgPSB1LmV4dGVuZCh7fSwgY29uZmlnLkRFRkFVTFRfQ09ORklHLCBjbGllbnRDb25maWcpO1xuICAgIHRoaXMuc2VydmljZUlkID0gc2VydmljZUlkO1xuICAgIHRoaXMucmVnaW9uU3VwcG9ydGVkID0gISFyZWdpb25TdXBwb3J0ZWQ7XG5cbiAgICB0aGlzLmNvbmZpZy5lbmRwb2ludCA9IHRoaXMuX2NvbXB1dGVFbmRwb2ludCgpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0h0dHBDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5faHR0cEFnZW50ID0gbnVsbDtcbn1cbnV0aWwuaW5oZXJpdHMoQmNlQmFzZUNsaWVudCwgRXZlbnRFbWl0dGVyKTtcblxuQmNlQmFzZUNsaWVudC5wcm90b3R5cGUuX2NvbXB1dGVFbmRwb2ludCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5jb25maWcuZW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLmVuZHBvaW50O1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZ2lvblN1cHBvcnRlZCkge1xuICAgICAgICByZXR1cm4gdXRpbC5mb3JtYXQoJyVzOi8vJXMuJXMuJXMnLFxuICAgICAgICAgICAgdGhpcy5jb25maWcucHJvdG9jb2wsXG4gICAgICAgICAgICB0aGlzLnNlcnZpY2VJZCxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnJlZ2lvbixcbiAgICAgICAgICAgIGNvbmZpZy5ERUZBVUxUX1NFUlZJQ0VfRE9NQUlOKTtcbiAgICB9XG4gICAgcmV0dXJuIHV0aWwuZm9ybWF0KCclczovLyVzLiVzJyxcbiAgICAgICAgdGhpcy5jb25maWcucHJvdG9jb2wsXG4gICAgICAgIHRoaXMuc2VydmljZUlkLFxuICAgICAgICBjb25maWcuREVGQVVMVF9TRVJWSUNFX0RPTUFJTik7XG59O1xuXG5CY2VCYXNlQ2xpZW50LnByb3RvdHlwZS5jcmVhdGVTaWduYXR1cmUgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMsIGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycykge1xuICAgIHJldHVybiBRLmZjYWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGF1dGggPSBuZXcgQXV0aChjcmVkZW50aWFscy5haywgY3JlZGVudGlhbHMuc2spO1xuICAgICAgICByZXR1cm4gYXV0aC5nZW5lcmF0ZUF1dGhvcml6YXRpb24oaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKTtcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmNlQmFzZUNsaWVudDtcblxuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvYm9zX2NsaWVudC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyogZXNsaW50LWVudiBub2RlICovXG4vKiBlc2xpbnQgbWF4LXBhcmFtczpbMCwxMF0gKi9cblxudmFyIHBhdGggPSByZXF1aXJlKDQzKTtcbnZhciB1dGlsID0gcmVxdWlyZSg0Nyk7XG52YXIgdSA9IHJlcXVpcmUoNDYpO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoMzMpO1xudmFyIEggPSByZXF1aXJlKDE5KTtcbnZhciBzdHJpbmdzID0gcmVxdWlyZSgyMik7XG52YXIgSHR0cENsaWVudCA9IHJlcXVpcmUoMjApO1xudmFyIEJjZUJhc2VDbGllbnQgPSByZXF1aXJlKDE2KTtcbnZhciBNaW1lVHlwZSA9IHJlcXVpcmUoMjEpO1xuXG52YXIgTUFYX1BVVF9PQkpFQ1RfTEVOR1RIID0gNTM2ODcwOTEyMDsgICAgIC8vIDVHXG52YXIgTUFYX1VTRVJfTUVUQURBVEFfU0laRSA9IDIwNDg7ICAgICAgICAgIC8vIDIgKiAxMDI0XG5cbi8qKlxuICogQk9TIHNlcnZpY2UgYXBpXG4gKlxuICogQHNlZSBodHRwOi8vZ29sbHVtLmJhaWR1LmNvbS9CT1NfQVBJI0JPUy1BUEnmlofmoaNcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGJvcyBjbGllbnQgY29uZmlndXJhdGlvbi5cbiAqIEBleHRlbmRzIHtCY2VCYXNlQ2xpZW50fVxuICovXG5mdW5jdGlvbiBCb3NDbGllbnQoY29uZmlnKSB7XG4gICAgQmNlQmFzZUNsaWVudC5jYWxsKHRoaXMsIGNvbmZpZywgJ2JvcycsIHRydWUpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0h0dHBDbGllbnR9XG4gICAgICovXG4gICAgdGhpcy5faHR0cEFnZW50ID0gbnVsbDtcbn1cbnV0aWwuaW5oZXJpdHMoQm9zQ2xpZW50LCBCY2VCYXNlQ2xpZW50KTtcblxuLy8gLS0tIEIgRSBHIEkgTiAtLS1cbkJvc0NsaWVudC5wcm90b3R5cGUuZGVsZXRlT2JqZWN0ID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0RFTEVURScsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUucHV0T2JqZWN0ID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgZGF0YSwgb3B0aW9ucykge1xuICAgIGlmICgha2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2tleSBzaG91bGQgbm90IGJlIGVtcHR5LicpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSk7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUFVUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgYm9keTogZGF0YSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLnB1dE9iamVjdEZyb21CbG9iID0gZnVuY3Rpb24gKGJ1Y2tldE5hbWUsIGtleSwgYmxvYiwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0ge307XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQmxvYi9zaXplXG4gICAgaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IGJsb2Iuc2l6ZTtcbiAgICAvLyDlr7nkuo7mtY/op4jlmajosIPnlKhBUEnnmoTml7blgJnvvIzpu5jorqTkuI3mt7vliqAgSC5DT05URU5UX01ENSDlrZfmrrXvvIzlm6DkuLrorqHnrpfotbfmnaXmr5TovoPmhaJcbiAgICAvLyDogIzkuJTmoLnmja4gQVBJIOaWh+aho++8jOi/meS4quWtl+auteS4jeaYr+W/heWhq+eahOOAglxuICAgIG9wdGlvbnMgPSB1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzLnB1dE9iamVjdChidWNrZXROYW1lLCBrZXksIGJsb2IsIG9wdGlvbnMpO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5nZXRPYmplY3RNZXRhZGF0YSA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdIRUFEJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5pbml0aWF0ZU11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSBvcHRpb25zW0guQ09OVEVOVF9UWVBFXSB8fCBNaW1lVHlwZS5ndWVzcyhwYXRoLmV4dG5hbWUoa2V5KSk7XG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BPU1QnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwYXJhbXM6IHt1cGxvYWRzOiAnJ30sXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuYWJvcnRNdWx0aXBhcnRVcGxvYWQgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ0RFTEVURScsIHtcbiAgICAgICAgYnVja2V0TmFtZTogYnVja2V0TmFtZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHBhcmFtczoge3VwbG9hZElkOiB1cGxvYWRJZH0sXG4gICAgICAgIGNvbmZpZzogb3B0aW9ucy5jb25maWdcbiAgICB9KTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuY29tcGxldGVNdWx0aXBhcnRVcGxvYWQgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgcGFydExpc3QsIG9wdGlvbnMpIHtcbiAgICB2YXIgaGVhZGVycyA9IHt9O1xuICAgIGhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnO1xuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnModS5leHRlbmQoaGVhZGVycywgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHRoaXMuc2VuZFJlcXVlc3QoJ1BPU1QnLCB7XG4gICAgICAgIGJ1Y2tldE5hbWU6IGJ1Y2tldE5hbWUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7cGFydHM6IHBhcnRMaXN0fSksXG4gICAgICAgIGhlYWRlcnM6IG9wdGlvbnMuaGVhZGVycyxcbiAgICAgICAgcGFyYW1zOiB7dXBsb2FkSWQ6IHVwbG9hZElkfSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS51cGxvYWRQYXJ0RnJvbUJsb2IgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgcGFydE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRTaXplLCBibG9iLCBvcHRpb25zKSB7XG4gICAgaWYgKGJsb2Iuc2l6ZSAhPT0gcGFydFNpemUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcih1dGlsLmZvcm1hdCgnSW52YWxpZCBwYXJ0U2l6ZSAlZCBhbmQgZGF0YSBsZW5ndGggJWQnLFxuICAgICAgICAgICAgcGFydFNpemUsIGJsb2Iuc2l6ZSkpO1xuICAgIH1cblxuICAgIHZhciBoZWFkZXJzID0ge307XG4gICAgaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IHBhcnRTaXplO1xuICAgIGhlYWRlcnNbSC5DT05URU5UX1RZUEVdID0gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG5cbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKHUuZXh0ZW5kKGhlYWRlcnMsIG9wdGlvbnMpKTtcbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnUFVUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgYm9keTogYmxvYixcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIHBhcnROdW1iZXI6IHBhcnROdW1iZXIsXG4gICAgICAgICAgICB1cGxvYWRJZDogdXBsb2FkSWRcbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5saXN0UGFydHMgPSBmdW5jdGlvbiAoYnVja2V0TmFtZSwga2V5LCB1cGxvYWRJZCwgb3B0aW9ucykge1xuICAgIC8qZXNsaW50LWRpc2FibGUqL1xuICAgIGlmICghdXBsb2FkSWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndXBsb2FkSWQgc2hvdWxkIG5vdCBlbXB0eScpO1xuICAgIH1cbiAgICAvKmVzbGludC1lbmFibGUqL1xuXG4gICAgdmFyIGFsbG93ZWRQYXJhbXMgPSBbJ21heFBhcnRzJywgJ3BhcnROdW1iZXJNYXJrZXInLCAndXBsb2FkSWQnXTtcbiAgICBvcHRpb25zID0gdGhpcy5fY2hlY2tPcHRpb25zKG9wdGlvbnMgfHwge30sIGFsbG93ZWRQYXJhbXMpO1xuICAgIG9wdGlvbnMucGFyYW1zLnVwbG9hZElkID0gdXBsb2FkSWQ7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnR0VUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgcGFyYW1zOiBvcHRpb25zLnBhcmFtcyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5saXN0TXVsdGlwYXJ0VXBsb2FkcyA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIGFsbG93ZWRQYXJhbXMgPSBbJ2RlbGltaXRlcicsICdtYXhVcGxvYWRzJywgJ2tleU1hcmtlcicsICdwcmVmaXgnLCAndXBsb2FkcyddO1xuXG4gICAgb3B0aW9ucyA9IHRoaXMuX2NoZWNrT3B0aW9ucyhvcHRpb25zIHx8IHt9LCBhbGxvd2VkUGFyYW1zKTtcbiAgICBvcHRpb25zLnBhcmFtcy51cGxvYWRzID0gJyc7XG5cbiAgICByZXR1cm4gdGhpcy5zZW5kUmVxdWVzdCgnR0VUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBwYXJhbXM6IG9wdGlvbnMucGFyYW1zLFxuICAgICAgICBjb25maWc6IG9wdGlvbnMuY29uZmlnXG4gICAgfSk7XG59O1xuXG5Cb3NDbGllbnQucHJvdG90eXBlLmFwcGVuZE9iamVjdCA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIGRhdGEsIG9mZnNldCwgb3B0aW9ucykge1xuICAgIGlmICgha2V5KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2tleSBzaG91bGQgbm90IGJlIGVtcHR5LicpO1xuICAgIH1cblxuICAgIG9wdGlvbnMgPSB0aGlzLl9jaGVja09wdGlvbnMob3B0aW9ucyB8fCB7fSk7XG4gICAgdmFyIHBhcmFtcyA9IHthcHBlbmQ6ICcnfTtcbiAgICBpZiAodS5pc051bWJlcihvZmZzZXQpKSB7XG4gICAgICAgIHBhcmFtcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNlbmRSZXF1ZXN0KCdQT1NUJywge1xuICAgICAgICBidWNrZXROYW1lOiBidWNrZXROYW1lLFxuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgYm9keTogZGF0YSxcbiAgICAgICAgaGVhZGVyczogb3B0aW9ucy5oZWFkZXJzLFxuICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgY29uZmlnOiBvcHRpb25zLmNvbmZpZ1xuICAgIH0pO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5hcHBlbmRPYmplY3RGcm9tQmxvYiA9IGZ1bmN0aW9uIChidWNrZXROYW1lLCBrZXksIGJsb2IsIG9mZnNldCwgb3B0aW9ucykge1xuICAgIHZhciBoZWFkZXJzID0ge307XG5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvQmxvYi9zaXplXG4gICAgaGVhZGVyc1tILkNPTlRFTlRfTEVOR1RIXSA9IGJsb2Iuc2l6ZTtcbiAgICAvLyDlr7nkuo7mtY/op4jlmajosIPnlKhBUEnnmoTml7blgJnvvIzpu5jorqTkuI3mt7vliqAgSC5DT05URU5UX01ENSDlrZfmrrXvvIzlm6DkuLrorqHnrpfotbfmnaXmr5TovoPmhaJcbiAgICAvLyDogIzkuJTmoLnmja4gQVBJIOaWh+aho++8jOi/meS4quWtl+auteS4jeaYr+W/heWhq+eahOOAglxuICAgIG9wdGlvbnMgPSB1LmV4dGVuZChoZWFkZXJzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB0aGlzLmFwcGVuZE9iamVjdChidWNrZXROYW1lLCBrZXksIGJsb2IsIG9mZnNldCwgb3B0aW9ucyk7XG59O1xuXG4vLyAtLS0gRSBOIEQgLS0tXG5cbkJvc0NsaWVudC5wcm90b3R5cGUuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgdmFyQXJncykge1xuICAgIHZhciBkZWZhdWx0QXJncyA9IHtcbiAgICAgICAgYnVja2V0TmFtZTogbnVsbCxcbiAgICAgICAga2V5OiBudWxsLFxuICAgICAgICBib2R5OiBudWxsLFxuICAgICAgICBoZWFkZXJzOiB7fSxcbiAgICAgICAgcGFyYW1zOiB7fSxcbiAgICAgICAgY29uZmlnOiB7fSxcbiAgICAgICAgb3V0cHV0U3RyZWFtOiBudWxsXG4gICAgfTtcbiAgICB2YXIgYXJncyA9IHUuZXh0ZW5kKGRlZmF1bHRBcmdzLCB2YXJBcmdzKTtcblxuICAgIHZhciBjb25maWcgPSB1LmV4dGVuZCh7fSwgdGhpcy5jb25maWcsIGFyZ3MuY29uZmlnKTtcbiAgICB2YXIgcmVzb3VyY2UgPSBbXG4gICAgICAgICcvdjEnLFxuICAgICAgICBzdHJpbmdzLm5vcm1hbGl6ZShhcmdzLmJ1Y2tldE5hbWUgfHwgJycpLFxuICAgICAgICBzdHJpbmdzLm5vcm1hbGl6ZShhcmdzLmtleSB8fCAnJywgZmFsc2UpXG4gICAgXS5qb2luKCcvJyk7XG5cbiAgICBpZiAoY29uZmlnLnNlc3Npb25Ub2tlbikge1xuICAgICAgICBhcmdzLmhlYWRlcnNbSC5TRVNTSU9OX1RPS0VOXSA9IGNvbmZpZy5zZXNzaW9uVG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VuZEhUVFBSZXF1ZXN0KGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLCBjb25maWcpO1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5zZW5kSFRUUFJlcXVlc3QgPSBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MsIGNvbmZpZykge1xuICAgIHZhciBjbGllbnQgPSB0aGlzO1xuICAgIHZhciBhZ2VudCA9IHRoaXMuX2h0dHBBZ2VudCA9IG5ldyBIdHRwQ2xpZW50KGNvbmZpZyk7XG5cbiAgICB2YXIgaHR0cENvbnRleHQgPSB7XG4gICAgICAgIGh0dHBNZXRob2Q6IGh0dHBNZXRob2QsXG4gICAgICAgIHJlc291cmNlOiByZXNvdXJjZSxcbiAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgY29uZmlnOiBjb25maWdcbiAgICB9O1xuICAgIHUuZWFjaChbJ3Byb2dyZXNzJywgJ2Vycm9yJywgJ2Fib3J0J10sIGZ1bmN0aW9uIChldmVudE5hbWUpIHtcbiAgICAgICAgYWdlbnQub24oZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBjbGllbnQuZW1pdChldmVudE5hbWUsIGV2dCwgaHR0cENvbnRleHQpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBwcm9taXNlID0gdGhpcy5faHR0cEFnZW50LnNlbmRSZXF1ZXN0KGh0dHBNZXRob2QsIHJlc291cmNlLCBhcmdzLmJvZHksXG4gICAgICAgIGFyZ3MuaGVhZGVycywgYXJncy5wYXJhbXMsIHUuYmluZCh0aGlzLmNyZWF0ZVNpZ25hdHVyZSwgdGhpcyksXG4gICAgICAgIGFyZ3Mub3V0cHV0U3RyZWFtXG4gICAgKTtcblxuICAgIHByb21pc2UuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChhZ2VudC5fcmVxICYmIGFnZW50Ll9yZXEueGhyKSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gYWdlbnQuX3JlcS54aHI7XG4gICAgICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbn07XG5cbkJvc0NsaWVudC5wcm90b3R5cGUuX2NoZWNrT3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zLCBhbGxvd2VkUGFyYW1zKSB7XG4gICAgdmFyIHJ2ID0ge307XG5cbiAgICBydi5jb25maWcgPSBvcHRpb25zLmNvbmZpZyB8fCB7fTtcbiAgICBydi5oZWFkZXJzID0gdGhpcy5fcHJlcGFyZU9iamVjdEhlYWRlcnMob3B0aW9ucyk7XG4gICAgcnYucGFyYW1zID0gdS5waWNrKG9wdGlvbnMsIGFsbG93ZWRQYXJhbXMgfHwgW10pO1xuXG4gICAgcmV0dXJuIHJ2O1xufTtcblxuQm9zQ2xpZW50LnByb3RvdHlwZS5fcHJlcGFyZU9iamVjdEhlYWRlcnMgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBhbGxvd2VkSGVhZGVycyA9IHt9O1xuICAgIHUuZWFjaChbXG4gICAgICAgIEguQ09OVEVOVF9MRU5HVEgsXG4gICAgICAgIEguQ09OVEVOVF9FTkNPRElORyxcbiAgICAgICAgSC5DT05URU5UX01ENSxcbiAgICAgICAgSC5YX0JDRV9DT05URU5UX1NIQTI1NixcbiAgICAgICAgSC5DT05URU5UX1RZUEUsXG4gICAgICAgIEguQ09OVEVOVF9ESVNQT1NJVElPTixcbiAgICAgICAgSC5FVEFHLFxuICAgICAgICBILlNFU1NJT05fVE9LRU4sXG4gICAgICAgIEguQ0FDSEVfQ09OVFJPTCxcbiAgICAgICAgSC5FWFBJUkVTLFxuICAgICAgICBILlhfQkNFX09CSkVDVF9BQ0wsXG4gICAgICAgIEguWF9CQ0VfT0JKRUNUX0dSQU5UX1JFQURcbiAgICBdLCBmdW5jdGlvbiAoaGVhZGVyKSB7XG4gICAgICAgIGFsbG93ZWRIZWFkZXJzW2hlYWRlcl0gPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgdmFyIG1ldGFTaXplID0gMDtcbiAgICB2YXIgaGVhZGVycyA9IHUucGljayhvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoYWxsb3dlZEhlYWRlcnNba2V5XSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoL154XFwtYmNlXFwtbWV0YVxcLS8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICBtZXRhU2l6ZSArPSBCdWZmZXIuYnl0ZUxlbmd0aChrZXkpICsgQnVmZmVyLmJ5dGVMZW5ndGgoJycgKyB2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKG1ldGFTaXplID4gTUFYX1VTRVJfTUVUQURBVEFfU0laRSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdNZXRhZGF0YSBzaXplIHNob3VsZCBub3QgYmUgZ3JlYXRlciB0aGFuICcgKyBNQVhfVVNFUl9NRVRBREFUQV9TSVpFICsgJy4nKTtcbiAgICB9XG5cbiAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShILkNPTlRFTlRfTEVOR1RIKSkge1xuICAgICAgICB2YXIgY29udGVudExlbmd0aCA9IGhlYWRlcnNbSC5DT05URU5UX0xFTkdUSF07XG4gICAgICAgIGlmIChjb250ZW50TGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29udGVudF9sZW5ndGggc2hvdWxkIG5vdCBiZSBuZWdhdGl2ZS4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb250ZW50TGVuZ3RoID4gTUFYX1BVVF9PQkpFQ1RfTEVOR1RIKSB7IC8vIDVHXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QgbGVuZ3RoIHNob3VsZCBiZSBsZXNzIHRoYW4gJyArIE1BWF9QVVRfT0JKRUNUX0xFTkdUSFxuICAgICAgICAgICAgICAgICsgJy4gVXNlIG11bHRpLXBhcnQgdXBsb2FkIGluc3RlYWQuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eSgnRVRhZycpKSB7XG4gICAgICAgIHZhciBldGFnID0gaGVhZGVycy5FVGFnO1xuICAgICAgICBpZiAoIS9eXCIvLnRlc3QoZXRhZykpIHtcbiAgICAgICAgICAgIGhlYWRlcnMuRVRhZyA9IHV0aWwuZm9ybWF0KCdcIiVzXCInLCBldGFnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShILkNPTlRFTlRfVFlQRSkpIHtcbiAgICAgICAgaGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZGVycztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQm9zQ2xpZW50O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvY29uZmlnLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxuZXhwb3J0cy5ERUZBVUxUX1NFUlZJQ0VfRE9NQUlOID0gJ2JhaWR1YmNlLmNvbSc7XG5cbmV4cG9ydHMuREVGQVVMVF9DT05GSUcgPSB7XG4gICAgcHJvdG9jb2w6ICdodHRwJyxcbiAgICByZWdpb246ICdiaidcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2hlYWRlcnMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qIGVzbGludC1lbnYgbm9kZSAqL1xuXG5leHBvcnRzLkNPTlRFTlRfVFlQRSA9ICdDb250ZW50LVR5cGUnO1xuZXhwb3J0cy5DT05URU5UX0xFTkdUSCA9ICdDb250ZW50LUxlbmd0aCc7XG5leHBvcnRzLkNPTlRFTlRfTUQ1ID0gJ0NvbnRlbnQtTUQ1JztcbmV4cG9ydHMuQ09OVEVOVF9FTkNPRElORyA9ICdDb250ZW50LUVuY29kaW5nJztcbmV4cG9ydHMuQ09OVEVOVF9ESVNQT1NJVElPTiA9ICdDb250ZW50LURpc3Bvc2l0aW9uJztcbmV4cG9ydHMuRVRBRyA9ICdFVGFnJztcbmV4cG9ydHMuQ09OTkVDVElPTiA9ICdDb25uZWN0aW9uJztcbmV4cG9ydHMuSE9TVCA9ICdIb3N0JztcbmV4cG9ydHMuVVNFUl9BR0VOVCA9ICdVc2VyLUFnZW50JztcbmV4cG9ydHMuQ0FDSEVfQ09OVFJPTCA9ICdDYWNoZS1Db250cm9sJztcbmV4cG9ydHMuRVhQSVJFUyA9ICdFeHBpcmVzJztcblxuZXhwb3J0cy5BVVRIT1JJWkFUSU9OID0gJ0F1dGhvcml6YXRpb24nO1xuZXhwb3J0cy5YX0JDRV9EQVRFID0gJ3gtYmNlLWRhdGUnO1xuZXhwb3J0cy5YX0JDRV9BQ0wgPSAneC1iY2UtYWNsJztcbmV4cG9ydHMuWF9CQ0VfUkVRVUVTVF9JRCA9ICd4LWJjZS1yZXF1ZXN0LWlkJztcbmV4cG9ydHMuWF9CQ0VfQ09OVEVOVF9TSEEyNTYgPSAneC1iY2UtY29udGVudC1zaGEyNTYnO1xuZXhwb3J0cy5YX0JDRV9PQkpFQ1RfQUNMID0gJ3gtYmNlLW9iamVjdC1hY2wnO1xuZXhwb3J0cy5YX0JDRV9PQkpFQ1RfR1JBTlRfUkVBRCA9ICd4LWJjZS1vYmplY3QtZ3JhbnQtcmVhZCc7XG5cbmV4cG9ydHMuWF9IVFRQX0hFQURFUlMgPSAnaHR0cF9oZWFkZXJzJztcbmV4cG9ydHMuWF9CT0RZID0gJ2JvZHknO1xuZXhwb3J0cy5YX1NUQVRVU19DT0RFID0gJ3N0YXR1c19jb2RlJztcbmV4cG9ydHMuWF9NRVNTQUdFID0gJ21lc3NhZ2UnO1xuZXhwb3J0cy5YX0NPREUgPSAnY29kZSc7XG5leHBvcnRzLlhfUkVRVUVTVF9JRCA9ICdyZXF1ZXN0X2lkJztcblxuZXhwb3J0cy5TRVNTSU9OX1RPS0VOID0gJ3gtYmNlLXNlY3VyaXR5LXRva2VuJztcblxuZXhwb3J0cy5YX1ZPRF9NRURJQV9USVRMRSA9ICd4LXZvZC1tZWRpYS10aXRsZSc7XG5leHBvcnRzLlhfVk9EX01FRElBX0RFU0NSSVBUSU9OID0gJ3gtdm9kLW1lZGlhLWRlc2NyaXB0aW9uJztcbmV4cG9ydHMuQUNDRVBUX0VOQ09ESU5HID0gJ2FjY2VwdC1lbmNvZGluZyc7XG5leHBvcnRzLkFDQ0VQVCA9ICdhY2NlcHQnO1xuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL2h0dHBfY2xpZW50LmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cbi8qIGVzbGludCBtYXgtcGFyYW1zOlswLDEwXSAqL1xuLyogZ2xvYmFscyBBcnJheUJ1ZmZlciAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSg0MSkuRXZlbnRFbWl0dGVyO1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoMzMpO1xudmFyIFEgPSByZXF1aXJlKDQ0KTtcbnZhciBoZWxwZXIgPSByZXF1aXJlKDQyKTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgdXRpbCA9IHJlcXVpcmUoNDcpO1xudmFyIEggPSByZXF1aXJlKDE5KTtcblxuLyoqXG4gKiBUaGUgSHR0cENsaWVudFxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBUaGUgaHR0cCBjbGllbnQgY29uZmlndXJhdGlvbi5cbiAqL1xuZnVuY3Rpb24gSHR0cENsaWVudChjb25maWcpIHtcbiAgICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuXG4gICAgLyoqXG4gICAgICogaHR0cChzKSByZXF1ZXN0IG9iamVjdFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5fcmVxID0gbnVsbDtcbn1cbnV0aWwuaW5oZXJpdHMoSHR0cENsaWVudCwgRXZlbnRFbWl0dGVyKTtcblxuLyoqXG4gKiBTZW5kIEh0dHAgUmVxdWVzdFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodHRwTWV0aG9kIEdFVCxQT1NULFBVVCxERUxFVEUsSEVBRFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIGh0dHAgcmVxdWVzdCBwYXRoLlxuICogQHBhcmFtIHsoc3RyaW5nfEJ1ZmZlcnxzdHJlYW0uUmVhZGFibGUpPX0gYm9keSBUaGUgcmVxdWVzdCBib2R5LiBJZiBgYm9keWAgaXMgYVxuICogc3RyZWFtLCBgQ29udGVudC1MZW5ndGhgIG11c3QgYmUgc2V0IGV4cGxpY2l0bHkuXG4gKiBAcGFyYW0ge09iamVjdD19IGhlYWRlcnMgVGhlIGh0dHAgcmVxdWVzdCBoZWFkZXJzLlxuICogQHBhcmFtIHtPYmplY3Q9fSBwYXJhbXMgVGhlIHF1ZXJ5c3RyaW5ncyBpbiB1cmwuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6c3RyaW5nPX0gc2lnbkZ1bmN0aW9uIFRoZSBgQXV0aG9yaXphdGlvbmAgc2lnbmF0dXJlIGZ1bmN0aW9uXG4gKiBAcGFyYW0ge3N0cmVhbS5Xcml0YWJsZT19IG91dHB1dFN0cmVhbSBUaGUgaHR0cCByZXNwb25zZSBib2R5LlxuICogQHBhcmFtIHtudW1iZXI9fSByZXRyeSBUaGUgbWF4aW11bSBudW1iZXIgb2YgbmV0d29yayBjb25uZWN0aW9uIGF0dGVtcHRzLlxuICpcbiAqIEByZXNvbHZlIHt7aHR0cF9oZWFkZXJzOk9iamVjdCxib2R5Ok9iamVjdH19XG4gKiBAcmVqZWN0IHtPYmplY3R9XG4gKlxuICogQHJldHVybiB7US5kZWZlcn1cbiAqL1xuSHR0cENsaWVudC5wcm90b3R5cGUuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcGF0aCwgYm9keSwgaGVhZGVycywgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2lnbkZ1bmN0aW9uLCBvdXRwdXRTdHJlYW0pIHtcblxuICAgIHZhciByZXF1ZXN0VXJsID0gdGhpcy5fZ2V0UmVxdWVzdFVybChwYXRoLCBwYXJhbXMpO1xuXG4gICAgdmFyIGRlZmF1bHRIZWFkZXJzID0ge307XG4gICAgZGVmYXVsdEhlYWRlcnNbSC5YX0JDRV9EQVRFXSA9IGhlbHBlci50b1VUQ1N0cmluZyhuZXcgRGF0ZSgpKTtcbiAgICBkZWZhdWx0SGVhZGVyc1tILkNPTlRFTlRfVFlQRV0gPSAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCc7XG4gICAgZGVmYXVsdEhlYWRlcnNbSC5IT1NUXSA9IC9eXFx3KzpcXC9cXC8oW15cXC9dKykvLmV4ZWModGhpcy5jb25maWcuZW5kcG9pbnQpWzFdO1xuXG4gICAgdmFyIHJlcXVlc3RIZWFkZXJzID0gdS5leHRlbmQoZGVmYXVsdEhlYWRlcnMsIGhlYWRlcnMpO1xuXG4gICAgLy8gQ2hlY2sgdGhlIGNvbnRlbnQtbGVuZ3RoXG4gICAgaWYgKCFyZXF1ZXN0SGVhZGVycy5oYXNPd25Qcm9wZXJ0eShILkNPTlRFTlRfTEVOR1RIKSkge1xuICAgICAgICB2YXIgY29udGVudExlbmd0aCA9IHRoaXMuX2d1ZXNzQ29udGVudExlbmd0aChib2R5KTtcbiAgICAgICAgaWYgKCEoY29udGVudExlbmd0aCA9PT0gMCAmJiAvR0VUfEhFQUQvaS50ZXN0KGh0dHBNZXRob2QpKSkge1xuICAgICAgICAgICAgLy8g5aaC5p6c5pivIEdFVCDmiJYgSEVBRCDor7fmsYLvvIzlubbkuJQgQ29udGVudC1MZW5ndGgg5pivIDDvvIzpgqPkuYggUmVxdWVzdCBIZWFkZXIg6YeM6Z2i5bCx5LiN6KaB5Ye6546wIENvbnRlbnQtTGVuZ3RoXG4gICAgICAgICAgICAvLyDlkKbliJnmnKzlnLDorqHnrpfnrb7lkI3nmoTml7blgJnkvJrorqHnrpfov5vljrvvvIzkvYbmmK/mtY/op4jlmajlj5Hor7fmsYLnmoTml7blgJnkuI3kuIDlrprkvJrmnInvvIzmraTml7blr7zoh7QgU2lnbmF0dXJlIE1pc21hdGNoIOeahOaDheWGtVxuICAgICAgICAgICAgcmVxdWVzdEhlYWRlcnNbSC5DT05URU5UX0xFTkdUSF0gPSBjb250ZW50TGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjcmVhdGVTaWduYXR1cmUgPSBzaWduRnVuY3Rpb24gfHwgdS5ub29wO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoY3JlYXRlU2lnbmF0dXJlKHRoaXMuY29uZmlnLmNyZWRlbnRpYWxzLCBodHRwTWV0aG9kLCBwYXRoLCBwYXJhbXMsIHJlcXVlc3RIZWFkZXJzKSlcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChhdXRob3JpemF0aW9uLCB4YmNlRGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhdXRob3JpemF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RIZWFkZXJzW0guQVVUSE9SSVpBVElPTl0gPSBhdXRob3JpemF0aW9uO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh4YmNlRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SGVhZGVyc1tILlhfQkNFX0RBVEVdID0geGJjZURhdGU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2RvUmVxdWVzdChodHRwTWV0aG9kLCByZXF1ZXN0VXJsLFxuICAgICAgICAgICAgICAgICAgICB1Lm9taXQocmVxdWVzdEhlYWRlcnMsIEguQ09OVEVOVF9MRU5HVEgsIEguSE9TVCksXG4gICAgICAgICAgICAgICAgICAgIGJvZHksIG91dHB1dFN0cmVhbSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJldHVybiBRLnJlamVjdChleCk7XG4gICAgfVxufTtcblxuSHR0cENsaWVudC5wcm90b3R5cGUuX2RvUmVxdWVzdCA9IGZ1bmN0aW9uIChodHRwTWV0aG9kLCByZXF1ZXN0VXJsLCByZXF1ZXN0SGVhZGVycywgYm9keSwgb3V0cHV0U3RyZWFtKSB7XG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub3BlbihodHRwTWV0aG9kLCByZXF1ZXN0VXJsLCB0cnVlKTtcbiAgICBmb3IgKHZhciBoZWFkZXIgaW4gcmVxdWVzdEhlYWRlcnMpIHtcbiAgICAgICAgaWYgKHJlcXVlc3RIZWFkZXJzLmhhc093blByb3BlcnR5KGhlYWRlcikpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHJlcXVlc3RIZWFkZXJzW2hlYWRlcl07XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgIH07XG4gICAgeGhyLm9uYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ3hociBhYm9ydGVkJykpO1xuICAgIH07XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09IDEyMjMpIHtcbiAgICAgICAgICAgICAgICAvLyBJRSAtICMxNDUwOiBzb21ldGltZXMgcmV0dXJucyAxMjIzIHdoZW4gaXQgc2hvdWxkIGJlIDIwNFxuICAgICAgICAgICAgICAgIHN0YXR1cyA9IDIwNDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbnRlbnRUeXBlID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdDb250ZW50LVR5cGUnKTtcbiAgICAgICAgICAgIHZhciBpc0pTT04gPSAvYXBwbGljYXRpb25cXC9qc29uLy50ZXN0KGNvbnRlbnRUeXBlKTtcbiAgICAgICAgICAgIHZhciByZXNwb25zZUJvZHkgPSBpc0pTT04gPyBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpIDogeGhyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2VCb2R5KSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VCb2R5ID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpc1N1Y2Nlc3MgPSBzdGF0dXMgPj0gMjAwICYmIHN0YXR1cyA8IDMwMCB8fCBzdGF0dXMgPT09IDMwNDtcbiAgICAgICAgICAgIGlmIChpc1N1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB2YXIgaGVhZGVycyA9IHNlbGYuX2ZpeEhlYWRlcnMoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cF9oZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiByZXNwb25zZUJvZHlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1c19jb2RlOiBzdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHJlc3BvbnNlQm9keS5tZXNzYWdlIHx8ICc8bWVzc2FnZT4nLFxuICAgICAgICAgICAgICAgICAgICBjb2RlOiByZXNwb25zZUJvZHkuY29kZSB8fCAnPGNvZGU+JyxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdF9pZDogcmVzcG9uc2VCb2R5LnJlcXVlc3RJZCB8fCAnPHJlcXVlc3RfaWQ+J1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBpZiAoeGhyLnVwbG9hZCkge1xuICAgICAgICB1LmVhY2goWydwcm9ncmVzcycsICdlcnJvcicsICdhYm9ydCddLCBmdW5jdGlvbiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICB4aHIudXBsb2FkLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLmVtaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5lbWl0KGV2ZW50TmFtZSwgZXZ0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB4aHIuc2VuZChib2R5KTtcblxuICAgIHNlbGYuX3JlcSA9IHt4aHI6IHhocn07XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbkh0dHBDbGllbnQucHJvdG90eXBlLl9ndWVzc0NvbnRlbnRMZW5ndGggPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGlmIChkYXRhID09IG51bGwgfHwgZGF0YSA9PT0gJycpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKHUuaXNTdHJpbmcoZGF0YSkpIHtcbiAgICAgICAgcmV0dXJuIEJ1ZmZlci5ieXRlTGVuZ3RoKGRhdGEpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgZGF0YSBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuc2l6ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuYnl0ZUxlbmd0aDtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIENvbnRlbnQtTGVuZ3RoIGlzIHNwZWNpZmllZC4nKTtcbn07XG5cbkh0dHBDbGllbnQucHJvdG90eXBlLl9maXhIZWFkZXJzID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgICB2YXIgZml4ZWRIZWFkZXJzID0ge307XG5cbiAgICBpZiAoaGVhZGVycykge1xuICAgICAgICB1LmVhY2goaGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLCBmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IGxpbmUuaW5kZXhPZignOicpO1xuICAgICAgICAgICAgaWYgKGlkeCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gbGluZS5zdWJzdHJpbmcoMCwgaWR4KS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGxpbmUuc3Vic3RyaW5nKGlkeCArIDEpLnJlcGxhY2UoL15cXHMrfFxccyskLywgJycpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdldGFnJykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1wiL2csICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZml4ZWRIZWFkZXJzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpeGVkSGVhZGVycztcbn07XG5cbkh0dHBDbGllbnQucHJvdG90eXBlLmJ1aWxkUXVlcnlTdHJpbmcgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgdmFyIHVybEVuY29kZVN0ciA9IHJlcXVpcmUoNDUpLnN0cmluZ2lmeShwYXJhbXMpO1xuICAgIC8vIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1BlcmNlbnQtZW5jb2RpbmdcbiAgICByZXR1cm4gdXJsRW5jb2RlU3RyLnJlcGxhY2UoL1soKSchfi4qXFwtX10vZywgZnVuY3Rpb24gKGNoYXIpIHtcbiAgICAgICAgcmV0dXJuICclJyArIGNoYXIuY2hhckNvZGVBdCgpLnRvU3RyaW5nKDE2KTtcbiAgICB9KTtcbn07XG5cbkh0dHBDbGllbnQucHJvdG90eXBlLl9nZXRSZXF1ZXN0VXJsID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtcykge1xuICAgIHZhciB1cmkgPSBwYXRoO1xuICAgIHZhciBxcyA9IHRoaXMuYnVpbGRRdWVyeVN0cmluZyhwYXJhbXMpO1xuICAgIGlmIChxcykge1xuICAgICAgICB1cmkgKz0gJz8nICsgcXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmVuZHBvaW50ICsgdXJpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIdHRwQ2xpZW50O1xuXG4iLCIvKipcbiAqIEBmaWxlIHNyYy9taW1lLnR5cGVzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG4vKiBlc2xpbnQtZW52IG5vZGUgKi9cblxudmFyIG1pbWVUeXBlcyA9IHtcbn07XG5cbmV4cG9ydHMuZ3Vlc3MgPSBmdW5jdGlvbiAoZXh0KSB7XG4gICAgaWYgKCFleHQgfHwgIWV4dC5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICAgIH1cbiAgICBpZiAoZXh0WzBdID09PSAnLicpIHtcbiAgICAgICAgZXh0ID0gZXh0LnN1YnN0cigxKTtcbiAgICB9XG4gICAgcmV0dXJuIG1pbWVUeXBlc1tleHQudG9Mb3dlckNhc2UoKV0gfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG59O1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzdHJpbmdzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIga0VzY2FwZWRNYXAgPSB7XG4gICAgJyEnOiAnJTIxJyxcbiAgICAnXFwnJzogJyUyNycsXG4gICAgJygnOiAnJTI4JyxcbiAgICAnKSc6ICclMjknLFxuICAgICcqJzogJyUyQSdcbn07XG5cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZywgZW5jb2RpbmdTbGFzaCkge1xuICAgIHZhciByZXN1bHQgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKTtcbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvWyEnXFwoXFwpXFwqXS9nLCBmdW5jdGlvbiAoJDEpIHtcbiAgICAgICAgcmV0dXJuIGtFc2NhcGVkTWFwWyQxXTtcbiAgICB9KTtcblxuICAgIGlmIChlbmNvZGluZ1NsYXNoID09PSBmYWxzZSkge1xuICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvJTJGL2dpLCAnLycpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnRzLnRyaW0gPSBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIChzdHJpbmcgfHwgJycpLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbn07XG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgY29uZmlnLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG5cbnZhciBrRGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgcnVudGltZXM6ICdodG1sNScsXG5cbiAgICAvLyBib3PmnI3liqHlmajnmoTlnLDlnYDvvIzpu5jorqQoaHR0cDovL2JqLmJjZWJvcy5jb20pXG4gICAgYm9zX2VuZHBvaW50OiAnaHR0cDovL2JqLmJjZWJvcy5jb20nLFxuXG4gICAgLy8g6buY6K6k55qEIGFrIOWSjCBzayDphY3nva5cbiAgICBib3NfYWs6IG51bGwsXG4gICAgYm9zX3NrOiBudWxsLFxuICAgIGJvc19jcmVkZW50aWFsczogbnVsbCxcblxuICAgIC8vIOWmguaenOWIh+aNouWIsCBhcHBlbmRhYmxlIOaooeW8j++8jOacgOWkp+WPquaUr+aMgSA1RyDnmoTmlofku7ZcbiAgICAvLyDkuI3lho3mlK/mjIEgTXVsdGlwYXJ0IOeahOaWueW8j+S4iuS8oOaWh+S7tlxuICAgIGJvc19hcHBlbmRhYmxlOiBmYWxzZSxcblxuICAgIC8vIOS4uuS6huWkhOeQhiBGbGFzaCDkuI3og73lj5HpgIEgSEVBRCwgREVMRVRFIOS5i+exu+eahOivt+axgu+8jOS7peWPiuaXoOazlVxuICAgIC8vIOiOt+WPliByZXNwb25zZSBoZWFkZXJzIOeahOmXrumimO+8jOmcgOimgeaQnuS4gOS4qiByZWxheSDmnI3liqHlmajvvIzmiormlbDmja5cbiAgICAvLyDmoLzlvI/ovazljJbkuIDkuItcbiAgICBib3NfcmVsYXlfc2VydmVyOiAnaHR0cHM6Ly9yZWxheS5lZmUudGVjaCcsXG5cbiAgICAvLyDmmK/lkKbmlK/mjIHlpJrpgInvvIzpu5jorqQoZmFsc2UpXG4gICAgbXVsdGlfc2VsZWN0aW9uOiBmYWxzZSxcblxuICAgIC8vIOWksei0peS5i+WQjumHjeivleeahOasoeaVsCjljZXkuKrmlofku7bmiJbogIXliIbniYcp77yM6buY6K6kKDAp77yM5LiN6YeN6K+VXG4gICAgbWF4X3JldHJpZXM6IDAsXG5cbiAgICAvLyDlpLHotKXph43or5XnmoTpl7TpmpTml7bpl7TvvIzpu5jorqQgMTAwMG1zXG4gICAgcmV0cnlfaW50ZXJ2YWw6IDEwMDAsXG5cbiAgICAvLyDmmK/lkKboh6rliqjkuIrkvKDvvIzpu5jorqQoZmFsc2UpXG4gICAgYXV0b19zdGFydDogZmFsc2UsXG5cbiAgICAvLyDmnIDlpKflj6/ku6XpgInmi6nnmoTmlofku7blpKflsI/vvIzpu5jorqQoMTAwTSlcbiAgICBtYXhfZmlsZV9zaXplOiAnMTAwbWInLFxuXG4gICAgLy8g6LaF6L+H6L+Z5Liq5paH5Lu25aSn5bCP5LmL5ZCO77yM5byA5aeL5L2/55So5YiG54mH5LiK5Lyg77yM6buY6K6kKDEwTSlcbiAgICBib3NfbXVsdGlwYXJ0X21pbl9zaXplOiAnMTBtYicsXG5cbiAgICAvLyDliIbniYfkuIrkvKDnmoTml7blgJnvvIzlubbooYzkuIrkvKDnmoTkuKrmlbDvvIzpu5jorqQoMSlcbiAgICBib3NfbXVsdGlwYXJ0X3BhcmFsbGVsOiAxLFxuXG4gICAgLy8g6Zif5YiX5Lit55qE5paH5Lu277yM5bm26KGM5LiK5Lyg55qE5Liq5pWw77yM6buY6K6kKDMpXG4gICAgYm9zX3Rhc2tfcGFyYWxsZWw6IDMsXG5cbiAgICAvLyDorqHnrpfnrb7lkI3nmoTml7blgJnvvIzmnInkupsgaGVhZGVyIOmcgOimgeWJlOmZpO+8jOWHj+WwkeS8oOi+k+eahOS9k+enr1xuICAgIGF1dGhfc3RyaXBwZWRfaGVhZGVyczogWydVc2VyLUFnZW50JywgJ0Nvbm5lY3Rpb24nXSxcblxuICAgIC8vIOWIhueJh+S4iuS8oOeahOaXtuWAme+8jOavj+S4quWIhueJh+eahOWkp+Wwj++8jOm7mOiupCg0TSlcbiAgICBjaHVua19zaXplOiAnNG1iJyxcblxuICAgIC8vIOWIhuWdl+S4iuS8oOaXtizmmK/lkKblhYHorrjmlq3ngrnnu63kvKDvvIzpu5jorqQodHJ1ZSlcbiAgICBib3NfbXVsdGlwYXJ0X2F1dG9fY29udGludWU6IHRydWUsXG5cbiAgICAvLyDliIblvIDkuIrkvKDnmoTml7blgJnvvIxsb2NhbFN0b3JhZ2Xph4zpnaJrZXnnmoTnlJ/miJDmlrnlvI/vvIzpu5jorqTmmK8gYGRlZmF1bHRgXG4gICAgLy8g5aaC5p6c6ZyA6KaB6Ieq5a6a5LmJ77yM5Y+v5Lul6YCa6L+HIFhYWFxuICAgIGJvc19tdWx0aXBhcnRfbG9jYWxfa2V5X2dlbmVyYXRvcjogJ2RlZmF1bHQnLFxuXG4gICAgLy8g5piv5ZCm5YWB6K646YCJ5oup55uu5b2VXG4gICAgZGlyX3NlbGVjdGlvbjogZmFsc2UsXG5cbiAgICAvLyDmmK/lkKbpnIDopoHmr4/mrKHpg73ljrvmnI3liqHlmajorqHnrpfnrb7lkI1cbiAgICBnZXRfbmV3X3VwdG9rZW46IHRydWUsXG5cbiAgICAvLyDlm6DkuLrkvb/nlKggRm9ybSBQb3N0IOeahOagvOW8j++8jOayoeacieiuvue9rumineWklueahCBIZWFkZXLvvIzku47ogIzlj6/ku6Xkv53or4FcbiAgICAvLyDkvb/nlKggRmxhc2gg5Lmf6IO95LiK5Lyg5aSn5paH5Lu2XG4gICAgLy8g5L2O54mI5pys5rWP6KeI5Zmo5LiK5Lyg5paH5Lu255qE5pe25YCZ77yM6ZyA6KaB6K6+572uIHBvbGljee+8jOm7mOiupOaDheWGteS4i1xuICAgIC8vIHBvbGljeeeahOWGheWuueWPqumcgOimgeWMheWQqyBleHBpcmF0aW9uIOWSjCBjb25kaXRpb25zIOWNs+WPr1xuICAgIC8vIHBvbGljeToge1xuICAgIC8vICAgZXhwaXJhdGlvbjogJ3h4JyxcbiAgICAvLyAgIGNvbmRpdGlvbnM6IFtcbiAgICAvLyAgICAge2J1Y2tldDogJ3RoZS1idWNrZXQtbmFtZSd9XG4gICAgLy8gICBdXG4gICAgLy8gfVxuICAgIC8vIGJvc19wb2xpY3k6IG51bGwsXG5cbiAgICAvLyDkvY7niYjmnKzmtY/op4jlmajkuIrkvKDmlofku7bnmoTml7blgJnvvIzpnIDopoHorr7nva4gcG9saWN5X3NpZ25hdHVyZVxuICAgIC8vIOWmguaenOayoeacieiuvue9riBib3NfcG9saWN5X3NpZ25hdHVyZSDnmoTor53vvIzkvJrpgJrov4cgdXB0b2tlbl91cmwg5p2l6K+35rGCXG4gICAgLy8g6buY6K6k5Y+q5Lya6K+35rGC5LiA5qyh77yM5aaC5p6c5aSx5pWI5LqG77yM6ZyA6KaB5omL5Yqo5p2l6YeN572uIHBvbGljeV9zaWduYXR1cmVcbiAgICAvLyBib3NfcG9saWN5X3NpZ25hdHVyZTogbnVsbCxcblxuICAgIC8vIEpTT05QIOm7mOiupOeahOi2heaXtuaXtumXtCg1MDAwbXMpXG4gICAgdXB0b2tlbl92aWFfanNvbnA6IHRydWUsXG4gICAgdXB0b2tlbl90aW1lb3V0OiA1MDAwLFxuICAgIHVwdG9rZW5fanNvbnBfdGltZW91dDogNTAwMCwgICAgLy8g5LiN5pSv5oyB5LqG77yM5ZCO57ut5bu66K6u55SoIHVwdG9rZW5fdGltZW91dFxuXG4gICAgLy8g5piv5ZCm6KaB56aB55So57uf6K6h77yM6buY6K6k5LiN56aB55SoXG4gICAgLy8g5aaC5p6c6ZyA6KaB56aB55So77yM5oqKIHRyYWNrZXJfaWQg6K6+572u5oiQIG51bGwg5Y2z5Y+vXG4gICAgdHJhY2tlcl9pZDogbnVsbFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrRGVmYXVsdE9wdGlvbnM7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKSwgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgZXZlbnRzLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBrUG9zdEluaXQ6ICdQb3N0SW5pdCcsXG4gICAga0tleTogJ0tleScsXG4gICAga0xpc3RQYXJ0czogJ0xpc3RQYXJ0cycsXG4gICAga09iamVjdE1ldGFzOiAnT2JqZWN0TWV0YXMnLFxuICAgIC8vIGtGaWxlc1JlbW92ZWQgIDogJ0ZpbGVzUmVtb3ZlZCcsXG4gICAga0ZpbGVGaWx0ZXJlZDogJ0ZpbGVGaWx0ZXJlZCcsXG4gICAga0ZpbGVzQWRkZWQ6ICdGaWxlc0FkZGVkJyxcbiAgICBrRmlsZXNGaWx0ZXI6ICdGaWxlc0ZpbHRlcicsXG4gICAga05ldHdvcmtTcGVlZDogJ05ldHdvcmtTcGVlZCcsXG4gICAga0JlZm9yZVVwbG9hZDogJ0JlZm9yZVVwbG9hZCcsXG4gICAgLy8ga1VwbG9hZEZpbGUgICAgOiAnVXBsb2FkRmlsZScsICAgICAgIC8vID8/XG4gICAga1VwbG9hZFByb2dyZXNzOiAnVXBsb2FkUHJvZ3Jlc3MnLFxuICAgIGtGaWxlVXBsb2FkZWQ6ICdGaWxlVXBsb2FkZWQnLFxuICAgIGtVcGxvYWRQYXJ0UHJvZ3Jlc3M6ICdVcGxvYWRQYXJ0UHJvZ3Jlc3MnLFxuICAgIGtDaHVua1VwbG9hZGVkOiAnQ2h1bmtVcGxvYWRlZCcsXG4gICAga1VwbG9hZFJlc3VtZTogJ1VwbG9hZFJlc3VtZScsIC8vIOaWreeCuee7reS8oFxuICAgIC8vIGtVcGxvYWRQYXVzZTogJ1VwbG9hZFBhdXNlJywgICAvLyDmmoLlgZxcbiAgICBrVXBsb2FkUmVzdW1lRXJyb3I6ICdVcGxvYWRSZXN1bWVFcnJvcicsIC8vIOWwneivleaWreeCuee7reS8oOWksei0pVxuICAgIGtVcGxvYWRDb21wbGV0ZTogJ1VwbG9hZENvbXBsZXRlJyxcbiAgICBrRXJyb3I6ICdFcnJvcicsXG4gICAga0Fib3J0ZWQ6ICdBYm9ydGVkJ1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgbXVsdGlwYXJ0X3Rhc2suanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgYXN5bmMgPSByZXF1aXJlKDM1KTtcbnZhciB1ID0gcmVxdWlyZSg0Nik7XG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcbnZhciBldmVudHMgPSByZXF1aXJlKDI0KTtcbnZhciBUYXNrID0gcmVxdWlyZSgzMCk7XG5cbi8qKlxuICogTXVsdGlwYXJ0VGFza1xuICpcbiAqIEBjbGFzc1xuICovXG5mdW5jdGlvbiBNdWx0aXBhcnRUYXNrKCkge1xuICAgIFRhc2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIC8qKlxuICAgICAqIOaJuemHj+S4iuS8oOeahOaXtuWAme+8jOS/neWtmOeahCB4aHJSZXF1ZXN0aW5nIOWvueixoVxuICAgICAqIOWmguaenOmcgOimgSBhYm9ydCDnmoTml7blgJnvvIzku47ov5nph4zmnaXojrflj5ZcbiAgICAgKi9cbiAgICB0aGlzLnhoclBvb2xzID0gW107XG59XG51dGlscy5pbmhlcml0cyhNdWx0aXBhcnRUYXNrLCBUYXNrKTtcblxuTXVsdGlwYXJ0VGFzay5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuYWJvcnRlZCkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciBmaWxlID0gdGhpcy5vcHRpb25zLmZpbGU7XG4gICAgdmFyIGJ1Y2tldCA9IHRoaXMub3B0aW9ucy5idWNrZXQ7XG4gICAgdmFyIG9iamVjdCA9IHRoaXMub3B0aW9ucy5vYmplY3Q7XG4gICAgdmFyIG1ldGFzID0gdGhpcy5vcHRpb25zLm1ldGFzO1xuICAgIHZhciBjaHVua1NpemUgPSB0aGlzLm9wdGlvbnMuY2h1bmtfc2l6ZTtcbiAgICB2YXIgbXVsdGlwYXJ0UGFyYWxsZWwgPSB0aGlzLm9wdGlvbnMuYm9zX211bHRpcGFydF9wYXJhbGxlbDtcblxuICAgIHZhciBjb250ZW50VHlwZSA9IHV0aWxzLmd1ZXNzQ29udGVudFR5cGUoZmlsZSk7XG4gICAgdmFyIG9wdGlvbnMgPSB7J0NvbnRlbnQtVHlwZSc6IGNvbnRlbnRUeXBlfTtcbiAgICB2YXIgdXBsb2FkSWQgPSBudWxsO1xuXG4gICAgcmV0dXJuIHRoaXMuX2luaXRpYXRlTXVsdGlwYXJ0VXBsb2FkKGZpbGUsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QsIG9wdGlvbnMpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgdXBsb2FkSWQgPSByZXNwb25zZS5ib2R5LnVwbG9hZElkO1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gcmVzcG9uc2UuYm9keS5wYXJ0cyB8fCBbXTtcbiAgICAgICAgICAgIC8vIOWHhuWkhyB1cGxvYWRQYXJ0c1xuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICAgICAgdmFyIHRhc2tzID0gdXRpbHMuZ2V0VGFza3MoZmlsZSwgdXBsb2FkSWQsIGNodW5rU2l6ZSwgYnVja2V0LCBvYmplY3QpO1xuICAgICAgICAgICAgdXRpbHMuZmlsdGVyVGFza3ModGFza3MsIHBhcnRzKTtcblxuICAgICAgICAgICAgdmFyIGxvYWRlZCA9IHBhcnRzLmxlbmd0aDtcbiAgICAgICAgICAgIC8vIOi/meS4queUqOadpeiusOW9leaVtOS9kyBQYXJ0cyDnmoTkuIrkvKDov5vluqbvvIzkuI3mmK/ljZXkuKogUGFydCDnmoTkuIrkvKDov5vluqZcbiAgICAgICAgICAgIC8vIOWNleS4qiBQYXJ0IOeahOS4iuS8oOi/m+W6puWPr+S7peebkeWQrCBrVXBsb2FkUGFydFByb2dyZXNzIOadpeW+l+WIsFxuICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgIGxlbmd0aENvbXB1dGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgbG9hZGVkOiBsb2FkZWQsXG4gICAgICAgICAgICAgICAgdG90YWw6IHRhc2tzLmxlbmd0aFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChsb2FkZWQpIHtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtVcGxvYWRQcm9ncmVzcywgW2ZpbGUsIGxvYWRlZCAvIHRhc2tzLmxlbmd0aCwgbnVsbF0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhc3luYy5tYXBMaW1pdCh0YXNrcywgbXVsdGlwYXJ0UGFyYWxsZWwsIHNlbGYuX3VwbG9hZFBhcnQoc3RhdGUpLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdHMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2VzKSB7XG4gICAgICAgICAgICB2YXIgcGFydExpc3QgPSBbXTtcbiAgICAgICAgICAgIHUuZWFjaChyZXNwb25zZXMsIGZ1bmN0aW9uIChyZXNwb25zZSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBwYXJ0TGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgcGFydE51bWJlcjogaW5kZXggKyAxLFxuICAgICAgICAgICAgICAgICAgICBlVGFnOiByZXNwb25zZS5odHRwX2hlYWRlcnMuZXRhZ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyDlhajpg6jkuIrkvKDnu5PmnZ/lkI7liKDpmaRsb2NhbFN0b3JhZ2VcbiAgICAgICAgICAgIHNlbGYuX2dlbmVyYXRlTG9jYWxLZXkoe1xuICAgICAgICAgICAgICAgIGJsb2I6IGZpbGUsXG4gICAgICAgICAgICAgICAgY2h1bmtTaXplOiBjaHVua1NpemUsXG4gICAgICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgICAgICAgICAgb2JqZWN0OiBvYmplY3RcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgIHV0aWxzLnJlbW92ZVVwbG9hZElkKGtleSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLmNsaWVudC5jb21wbGV0ZU11bHRpcGFydFVwbG9hZChidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQsIHBhcnRMaXN0LCBtZXRhcyk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3MsIFtmaWxlLCAxXSk7XG5cbiAgICAgICAgICAgIHJlc3BvbnNlLmJvZHkuYnVja2V0ID0gYnVja2V0O1xuICAgICAgICAgICAgcmVzcG9uc2UuYm9keS5vYmplY3QgPSBvYmplY3Q7XG5cbiAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0ZpbGVVcGxvYWRlZCwgW2ZpbGUsIHJlc3BvbnNlXSk7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgdmFyIGV2ZW50VHlwZSA9IHNlbGYuYWJvcnRlZCA/IGV2ZW50cy5rQWJvcnRlZCA6IGV2ZW50cy5rRXJyb3I7XG4gICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRUeXBlLCBbZXJyb3IsIGZpbGVdKTtcbiAgICAgICAgfSk7XG59O1xuXG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9pbml0aWF0ZU11bHRpcGFydFVwbG9hZCA9IGZ1bmN0aW9uIChmaWxlLCBjaHVua1NpemUsIGJ1Y2tldCwgb2JqZWN0LCBvcHRpb25zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgdXBsb2FkSWQ7XG4gICAgdmFyIGxvY2FsU2F2ZUtleTtcblxuICAgIGZ1bmN0aW9uIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNsaWVudC5pbml0aWF0ZU11bHRpcGFydFVwbG9hZChidWNrZXQsIG9iamVjdCwgb3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbFNhdmVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuc2V0VXBsb2FkSWQobG9jYWxTYXZlS2V5LCByZXNwb25zZS5ib2R5LnVwbG9hZElkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNwb25zZS5ib2R5LnBhcnRzID0gW107XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIGtleU9wdGlvbnMgPSB7XG4gICAgICAgIGJsb2I6IGZpbGUsXG4gICAgICAgIGNodW5rU2l6ZTogY2h1bmtTaXplLFxuICAgICAgICBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgb2JqZWN0OiBvYmplY3RcbiAgICB9O1xuICAgIHZhciBwcm9taXNlID0gdGhpcy5vcHRpb25zLmJvc19tdWx0aXBhcnRfYXV0b19jb250aW51ZVxuICAgICAgICA/IHRoaXMuX2dlbmVyYXRlTG9jYWxLZXkoa2V5T3B0aW9ucylcbiAgICAgICAgOiBRLnJlc29sdmUobnVsbCk7XG5cbiAgICByZXR1cm4gcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGxvY2FsU2F2ZUtleSA9IGtleTtcbiAgICAgICAgICAgIGlmICghbG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGluaXROZXdNdWx0aXBhcnRVcGxvYWQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdXBsb2FkSWQgPSB1dGlscy5nZXRVcGxvYWRJZChsb2NhbFNhdmVLZXkpO1xuICAgICAgICAgICAgaWYgKCF1cGxvYWRJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9saXN0UGFydHMoZmlsZSwgYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAodXBsb2FkSWQgJiYgbG9jYWxTYXZlS2V5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnRzID0gcmVzcG9uc2UuYm9keS5wYXJ0cztcbiAgICAgICAgICAgICAgICAvLyBsaXN0UGFydHMg55qE6L+U5Zue57uT5p6cXG4gICAgICAgICAgICAgICAgZGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KGV2ZW50cy5rVXBsb2FkUmVzdW1lLCBbZmlsZSwgcGFydHMsIG51bGxdKTtcbiAgICAgICAgICAgICAgICByZXNwb25zZS5ib2R5LnVwbG9hZElkID0gdXBsb2FkSWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgICAgIH0pW1xuICAgICAgICBcImNhdGNoXCJdKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKHVwbG9hZElkICYmIGxvY2FsU2F2ZUtleSkge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOiOt+WPluW3suS4iuS8oOWIhueJh+Wksei0pe+8jOWImemHjeaWsOS4iuS8oOOAglxuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFJlc3VtZUVycm9yLCBbZmlsZSwgZXJyb3IsIG51bGxdKTtcbiAgICAgICAgICAgICAgICB1dGlscy5yZW1vdmVVcGxvYWRJZChsb2NhbFNhdmVLZXkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBpbml0TmV3TXVsdGlwYXJ0VXBsb2FkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfSk7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fZ2VuZXJhdGVMb2NhbEtleSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIGdlbmVyYXRvciA9IHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X2xvY2FsX2tleV9nZW5lcmF0b3I7XG4gICAgcmV0dXJuIHV0aWxzLmdlbmVyYXRlTG9jYWxLZXkob3B0aW9ucywgZ2VuZXJhdG9yKTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9saXN0UGFydHMgPSBmdW5jdGlvbiAoZmlsZSwgYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5ldmVudERpc3BhdGNoZXI7XG5cbiAgICB2YXIgbG9jYWxQYXJ0cyA9IGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua0xpc3RQYXJ0cywgW2ZpbGUsIHVwbG9hZElkXSk7XG5cbiAgICByZXR1cm4gUS5yZXNvbHZlKGxvY2FsUGFydHMpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChwYXJ0cykge1xuICAgICAgICAgICAgaWYgKHUuaXNBcnJheShwYXJ0cykgJiYgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgaHR0cF9oZWFkZXJzOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydHM6IHBhcnRzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyDlpoLmnpzov5Tlm57nmoTkuI3mmK/mlbDnu4TvvIzlsLHosIPnlKggbGlzdFBhcnRzIOaOpeWPo+S7juacjeWKoeWZqOiOt+WPluaVsOaNrlxuICAgICAgICAgICAgcmV0dXJuIHNlbGYuX2xpc3RBbGxQYXJ0cyhidWNrZXQsIG9iamVjdCwgdXBsb2FkSWQpO1xuICAgICAgICB9KTtcbn07XG5cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLl9saXN0QWxsUGFydHMgPSBmdW5jdGlvbiAoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkKSB7XG4gICAgLy8gaXNUcnVuY2F0ZWQgPT09IHRydWUgLyBmYWxzZVxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICB2YXIgcGFydHMgPSBbXTtcbiAgICB2YXIgcGF5bG9hZCA9IG51bGw7XG4gICAgdmFyIG1heFBhcnRzID0gMTAwMDsgICAgICAgICAgLy8g5q+P5qyh55qE5YiG6aG1XG4gICAgdmFyIHBhcnROdW1iZXJNYXJrZXIgPSAwOyAgICAgLy8g5YiG6ZqU56ymXG5cbiAgICBmdW5jdGlvbiBsaXN0UGFydHMoKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWF4UGFydHM6IG1heFBhcnRzLFxuICAgICAgICAgICAgcGFydE51bWJlck1hcmtlcjogcGFydE51bWJlck1hcmtlclxuICAgICAgICB9O1xuICAgICAgICBzZWxmLmNsaWVudC5saXN0UGFydHMoYnVja2V0LCBvYmplY3QsIHVwbG9hZElkLCBvcHRpb25zKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcGFydHMucHVzaC5hcHBseShwYXJ0cywgcmVzcG9uc2UuYm9keS5wYXJ0cyk7XG4gICAgICAgICAgICAgICAgcGFydE51bWJlck1hcmtlciA9IHJlc3BvbnNlLmJvZHkubmV4dFBhcnROdW1iZXJNYXJrZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UuYm9keS5pc1RydW5jYXRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g57uT5p2f5LqGXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQuYm9keS5wYXJ0cyA9IHBhcnRzO1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6YCS5b2S6LCD55SoXG4gICAgICAgICAgICAgICAgICAgIGxpc3RQYXJ0cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pW1xuICAgICAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIGxpc3RQYXJ0cygpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5NdWx0aXBhcnRUYXNrLnByb3RvdHlwZS5fdXBsb2FkUGFydCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuZXZlbnREaXNwYXRjaGVyO1xuXG4gICAgZnVuY3Rpb24gdXBsb2FkUGFydElubmVyKGl0ZW0sIG9wdF9tYXhSZXRyaWVzKSB7XG4gICAgICAgIGlmIChpdGVtLmV0YWcpIHtcbiAgICAgICAgICAgIHNlbGYubmV0d29ya0luZm8ubG9hZGVkQnl0ZXMgKz0gaXRlbS5wYXJ0U2l6ZTtcblxuICAgICAgICAgICAgLy8g6Lez6L+H5bey5LiK5Lyg55qEcGFydFxuICAgICAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgaHR0cF9oZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgIGV0YWc6IGl0ZW0uZXRhZ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYm9keToge31cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtYXhSZXRyaWVzID0gb3B0X21heFJldHJpZXMgPT0gbnVsbFxuICAgICAgICAgICAgPyBzZWxmLm9wdGlvbnMubWF4X3JldHJpZXNcbiAgICAgICAgICAgIDogb3B0X21heFJldHJpZXM7XG4gICAgICAgIHZhciByZXRyeUludGVydmFsID0gc2VsZi5vcHRpb25zLnJldHJ5X2ludGVydmFsO1xuXG4gICAgICAgIHZhciBibG9iID0gaXRlbS5maWxlLnNsaWNlKGl0ZW0uc3RhcnQsIGl0ZW0uc3RvcCArIDEpO1xuICAgICAgICBibG9iLl9wcmV2aW91c0xvYWRlZCA9IDA7XG5cbiAgICAgICAgdmFyIHVwbG9hZFBhcnRYaHIgPSBzZWxmLmNsaWVudC51cGxvYWRQYXJ0RnJvbUJsb2IoaXRlbS5idWNrZXQsIGl0ZW0ub2JqZWN0LFxuICAgICAgICAgICAgaXRlbS51cGxvYWRJZCwgaXRlbS5wYXJ0TnVtYmVyLCBpdGVtLnBhcnRTaXplLCBibG9iKTtcbiAgICAgICAgdmFyIHhoclBvb2xJbmRleCA9IHNlbGYueGhyUG9vbHMucHVzaCh1cGxvYWRQYXJ0WGhyKTtcblxuICAgICAgICByZXR1cm4gdXBsb2FkUGFydFhoci50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICsrc3RhdGUubG9hZGVkO1xuICAgICAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IHN0YXRlLmxvYWRlZCAvIHN0YXRlLnRvdGFsO1xuICAgICAgICAgICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbaXRlbS5maWxlLCBwcm9ncmVzcywgbnVsbF0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdXBsb2FkSWQ6IGl0ZW0udXBsb2FkSWQsXG4gICAgICAgICAgICAgICAgICAgIHBhcnROdW1iZXI6IGl0ZW0ucGFydE51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgcGFydFNpemU6IGl0ZW0ucGFydFNpemUsXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldDogaXRlbS5idWNrZXQsXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdDogaXRlbS5vYmplY3QsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogaXRlbS5zdGFydCxcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IGJsb2Iuc2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2U6IHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtDaHVua1VwbG9hZGVkLCBbaXRlbS5maWxlLCByZXN1bHRdKTtcblxuICAgICAgICAgICAgICAgIC8vIOS4jeeUqOWIoOmZpO+8jOiuvue9ruS4uiBudWxsIOWwseWlveS6hu+8jOWPjeatoyBhYm9ydCDnmoTml7blgJnkvJrliKTmlq3nmoRcbiAgICAgICAgICAgICAgICBzZWxmLnhoclBvb2xzW3hoclBvb2xJbmRleCAtIDFdID0gbnVsbDtcblxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgICAgIH0pW1xuICAgICAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF4UmV0cmllcyA+IDAgJiYgIXNlbGYuYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDov5jmnInph43or5XnmoTmnLrkvJpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHV0aWxzLmRlbGF5KHJldHJ5SW50ZXJ2YWwpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVwbG9hZFBhcnRJbm5lcihpdGVtLCBtYXhSZXRyaWVzIC0gMSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyDmsqHmnInmnLrkvJrph43or5XkuoYgOi0oXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbSwgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gZmlsZTogZmlsZSxcbiAgICAgICAgLy8gdXBsb2FkSWQ6IHVwbG9hZElkLFxuICAgICAgICAvLyBidWNrZXQ6IGJ1Y2tldCxcbiAgICAgICAgLy8gb2JqZWN0OiBvYmplY3QsXG4gICAgICAgIC8vIHBhcnROdW1iZXI6IHBhcnROdW1iZXIsXG4gICAgICAgIC8vIHBhcnRTaXplOiBwYXJ0U2l6ZSxcbiAgICAgICAgLy8gc3RhcnQ6IG9mZnNldCxcbiAgICAgICAgLy8gc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG5cbiAgICAgICAgdmFyIHJlc29sdmUgPSBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJlamVjdCA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHVwbG9hZFBhcnRJbm5lcihpdGVtKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfTtcbn07XG5cbi8qKlxuICog57uI5q2i5LiK5Lyg5Lu75YqhXG4gKi9cbk11bHRpcGFydFRhc2sucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYWJvcnRlZCA9IHRydWU7XG4gICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gbnVsbDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMueGhyUG9vbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHhociA9IHRoaXMueGhyUG9vbHNbaV07XG4gICAgICAgIGlmICh4aHIgJiYgdHlwZW9mIHhoci5hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTXVsdGlwYXJ0VGFzaztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3JjL25ldHdvcmtfaW5mby5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHV0aWxzID0gcmVxdWlyZSgzMik7XG5cbi8qKlxuICogTmV0d29ya0luZm9cbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gTmV0d29ya0luZm8oKSB7XG4gICAgLyoqXG4gICAgICog6K6w5b2V5LuOIHN0YXJ0IOW8gOWni+W3sue7j+S4iuS8oOeahOWtl+iKguaVsC5cbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubG9hZGVkQnl0ZXMgPSAwO1xuXG4gICAgLyoqXG4gICAgICog6K6w5b2V6Zif5YiX5Lit5oC75paH5Lu255qE5aSn5bCPLCBVcGxvYWRDb21wbGV0ZSDkuYvlkI7kvJrooqvmuIXpm7ZcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMudG90YWxCeXRlcyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiDorrDlvZXlvIDlp4vkuIrkvKDnmoTml7bpl7QuXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl9zdGFydFRpbWUgPSB1dGlscy5ub3coKTtcblxuICAgIHRoaXMucmVzZXQoKTtcbn1cblxuTmV0d29ya0luZm8ucHJvdG90eXBlLmR1bXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgdGhpcy5sb2FkZWRCeXRlcywgICAgICAgICAgICAgICAgICAgICAvLyDlt7Lnu4/kuIrkvKDnmoRcbiAgICAgICAgdXRpbHMubm93KCkgLSB0aGlzLl9zdGFydFRpbWUsICAgICAgICAvLyDoirHotLnnmoTml7bpl7RcbiAgICAgICAgdGhpcy50b3RhbEJ5dGVzIC0gdGhpcy5sb2FkZWRCeXRlcyAgICAvLyDliankvZnmnKrkuIrkvKDnmoRcbiAgICBdO1xufTtcblxuTmV0d29ya0luZm8ucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubG9hZGVkQnl0ZXMgPSAwO1xuICAgIHRoaXMuX3N0YXJ0VGltZSA9IHV0aWxzLm5vdygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZXR3b3JrSW5mbztcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgcHV0X29iamVjdF90YXNrLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzIpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoMjQpO1xudmFyIFRhc2sgPSByZXF1aXJlKDMwKTtcblxuLyoqXG4gKiBQdXRPYmplY3RUYXNrXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIFB1dE9iamVjdFRhc2soKSB7XG4gICAgVGFzay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxudXRpbHMuaW5oZXJpdHMoUHV0T2JqZWN0VGFzaywgVGFzayk7XG5cblB1dE9iamVjdFRhc2sucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKG9wdF9tYXhSZXRyaWVzKSB7XG4gICAgaWYgKHRoaXMuYWJvcnRlZCkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLmV2ZW50RGlzcGF0Y2hlcjtcblxuICAgIHZhciBmaWxlID0gdGhpcy5vcHRpb25zLmZpbGU7XG4gICAgdmFyIGJ1Y2tldCA9IHRoaXMub3B0aW9ucy5idWNrZXQ7XG4gICAgdmFyIG9iamVjdCA9IHRoaXMub3B0aW9ucy5vYmplY3Q7XG4gICAgdmFyIG1ldGFzID0gdGhpcy5vcHRpb25zLm1ldGFzO1xuICAgIHZhciBtYXhSZXRyaWVzID0gb3B0X21heFJldHJpZXMgPT0gbnVsbFxuICAgICAgICA/IHRoaXMub3B0aW9ucy5tYXhfcmV0cmllc1xuICAgICAgICA6IG9wdF9tYXhSZXRyaWVzO1xuICAgIHZhciByZXRyeUludGVydmFsID0gdGhpcy5vcHRpb25zLnJldHJ5X2ludGVydmFsO1xuXG4gICAgdmFyIGNvbnRlbnRUeXBlID0gdXRpbHMuZ3Vlc3NDb250ZW50VHlwZShmaWxlKTtcbiAgICB2YXIgb3B0aW9ucyA9IHUuZXh0ZW5kKHsnQ29udGVudC1UeXBlJzogY29udGVudFR5cGV9LCBtZXRhcyk7XG5cbiAgICB0aGlzLnhoclJlcXVlc3RpbmcgPSB0aGlzLmNsaWVudC5wdXRPYmplY3RGcm9tQmxvYihidWNrZXQsIG9iamVjdCwgZmlsZSwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0aW5nLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGRpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChldmVudHMua1VwbG9hZFByb2dyZXNzLCBbZmlsZSwgMV0pO1xuXG4gICAgICAgIHJlc3BvbnNlLmJvZHkuYnVja2V0ID0gYnVja2V0O1xuICAgICAgICByZXNwb25zZS5ib2R5Lm9iamVjdCA9IG9iamVjdDtcblxuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRzLmtGaWxlVXBsb2FkZWQsIFtmaWxlLCByZXNwb25zZV0pO1xuICAgIH0pW1xuICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHZhciBldmVudFR5cGUgPSBzZWxmLmFib3J0ZWQgPyBldmVudHMua0Fib3J0ZWQgOiBldmVudHMua0Vycm9yO1xuICAgICAgICBkaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoZXZlbnRUeXBlLCBbZXJyb3IsIGZpbGVdKTtcblxuICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzX2NvZGUgJiYgZXJyb3IuY29kZSAmJiBlcnJvci5yZXF1ZXN0X2lkKSB7XG4gICAgICAgICAgICAvLyDlupTor6XmmK/mraPluLjnmoTplJnor68o5q+U5aaC562+5ZCN5byC5bi4Ke+8jOi/meenjeaDheWGteWwseS4jeimgemHjeivleS6hlxuICAgICAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVsc2UgaWYgKGVycm9yLnN0YXR1c19jb2RlID09PSAwKSB7XG4gICAgICAgIC8vICAgIC8vIOWPr+iDveaYr+aWree9keS6hu+8jHNhZmFyaSDop6blj5Egb25saW5lL29mZmxpbmUg5bu26L+f5q+U6L6D5LmFXG4gICAgICAgIC8vICAgIC8vIOaIkeS7rOaOqOi/n+S4gOS4iyBzZWxmLl91cGxvYWROZXh0KCkg55qE5pe25py6XG4gICAgICAgIC8vICAgIHNlbGYucGF1c2UoKTtcbiAgICAgICAgLy8gICAgcmV0dXJuO1xuICAgICAgICAvLyB9XG4gICAgICAgIGVsc2UgaWYgKG1heFJldHJpZXMgPiAwICYmICFzZWxmLmFib3J0ZWQpIHtcbiAgICAgICAgICAgIC8vIOi/mOacieacuuS8mumHjeivlVxuICAgICAgICAgICAgcmV0dXJuIHV0aWxzLmRlbGF5KHJldHJ5SW50ZXJ2YWwpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnN0YXJ0KG1heFJldHJpZXMgLSAxKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g6YeN6K+V57uT5p2f5LqG77yM5LiN566h5LqG77yM57un57ut5LiL5LiA5Liq5paH5Lu255qE5LiK5LygXG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9KTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQdXRPYmplY3RUYXNrO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSBzcmMvcXVldWUuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qKlxuICogUXVldWVcbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7Kn0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbi5cbiAqL1xuZnVuY3Rpb24gUXVldWUoY29sbGVjdGlvbikge1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG59XG5cblF1ZXVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24ubGVuZ3RoIDw9IDA7XG59O1xuXG5RdWV1ZS5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmxlbmd0aDtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5kZXF1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uc2hpZnQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUXVldWU7XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0IEJhaWR1LmNvbSwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoXG4gKiB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvblxuICogYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGVcbiAqIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICogQGZpbGUgc3RzX3Rva2VuX21hbmFnZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbnZhciBRID0gcmVxdWlyZSg0NCk7XG52YXIgdXRpbHMgPSByZXF1aXJlKDMyKTtcblxuLyoqXG4gKiBTdHNUb2tlbk1hbmFnZXJcbiAqXG4gKiBAY2xhc3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvcHRpb25zLlxuICovXG5mdW5jdGlvbiBTdHNUb2tlbk1hbmFnZXIob3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xufVxuXG5TdHNUb2tlbk1hbmFnZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChidWNrZXQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBpZiAoc2VsZi5fY2FjaGVbYnVja2V0XSAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9jYWNoZVtidWNrZXRdO1xuICAgIH1cblxuICAgIHJldHVybiBRLnJlc29sdmUodGhpcy5fZ2V0SW1wbC5hcHBseSh0aGlzLCBhcmd1bWVudHMpKS50aGVuKGZ1bmN0aW9uIChwYXlsb2FkKSB7XG4gICAgICAgIHNlbGYuX2NhY2hlW2J1Y2tldF0gPSBwYXlsb2FkO1xuICAgICAgICByZXR1cm4gcGF5bG9hZDtcbiAgICB9KTtcbn07XG5cblN0c1Rva2VuTWFuYWdlci5wcm90b3R5cGUuX2dldEltcGwgPSBmdW5jdGlvbiAoYnVja2V0KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIHVwdG9rZW5fdXJsID0gb3B0aW9ucy51cHRva2VuX3VybDtcbiAgICB2YXIgdGltZW91dCA9IG9wdGlvbnMudXB0b2tlbl90aW1lb3V0IHx8IG9wdGlvbnMudXB0b2tlbl9qc29ucF90aW1lb3V0O1xuICAgIHZhciB2aWFKc29ucCA9IG9wdGlvbnMudXB0b2tlbl92aWFfanNvbnA7XG5cbiAgICB2YXIgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB1cHRva2VuX3VybCxcbiAgICAgICAganNvbnA6IHZpYUpzb25wID8gJ2NhbGxiYWNrJyA6IGZhbHNlLFxuICAgICAgICBkYXRhVHlwZTogdmlhSnNvbnAgPyAnanNvbnAnIDogJ2pzb24nLFxuICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBzdHM6IEpTT04uc3RyaW5naWZ5KHV0aWxzLmdldERlZmF1bHRBQ0woYnVja2V0KSlcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgICAgIC8vIHBheWxvYWQuQWNjZXNzS2V5SWRcbiAgICAgICAgICAgIC8vIHBheWxvYWQuU2VjcmV0QWNjZXNzS2V5XG4gICAgICAgICAgICAvLyBwYXlsb2FkLlNlc3Npb25Ub2tlblxuICAgICAgICAgICAgLy8gcGF5bG9hZC5FeHBpcmF0aW9uXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KG5ldyBFcnJvcignR2V0IHN0cyB0b2tlbiB0aW1lb3V0ICgnICsgdGltZW91dCArICdtcykuJykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RzVG9rZW5NYW5hZ2VyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSB0YXNrLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG5cbi8qKlxuICog5LiN5ZCM55qE5Zy65pmv5LiL77yM6ZyA6KaB6YCa6L+H5LiN5ZCM55qEVGFza+adpeWujOaIkOS4iuS8oOeahOW3peS9nFxuICpcbiAqIEBwYXJhbSB7c2RrLkJvc0NsaWVudH0gY2xpZW50IFRoZSBib3MgY2xpZW50LlxuICogQHBhcmFtIHtFdmVudERpc3BhdGNoZXJ9IGV2ZW50RGlzcGF0Y2hlciBUaGUgZXZlbnQgZGlzcGF0Y2hlci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBleHRyYSB0YXNrLXJlbGF0ZWQgYXJndW1lbnRzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBUYXNrKGNsaWVudCwgZXZlbnREaXNwYXRjaGVyLCBvcHRpb25zKSB7XG4gICAgLyoqXG4gICAgICog5Y+v5Lul6KKrIGFib3J0IOeahCBwcm9taXNlIOWvueixoVxuICAgICAqXG4gICAgICogQHR5cGUge1Byb21pc2V9XG4gICAgICovXG4gICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIOagh+iusOS4gOS4i+aYr+WQpuaYr+S6uuS4uuS4reaWreS6hlxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5hYm9ydGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLm5ldHdvcmtJbmZvID0gbnVsbDtcblxuICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyID0gZXZlbnREaXNwYXRjaGVyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGFic3RyYWN0TWV0aG9kKCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndW5pbXBsZW1lbnRlZCBtZXRob2QuJyk7XG59XG5cbi8qKlxuICog5byA5aeL5LiK5Lyg5Lu75YqhXG4gKi9cblRhc2sucHJvdG90eXBlLnN0YXJ0ID0gYWJzdHJhY3RNZXRob2Q7XG5cbi8qKlxuICog5pqC5YGc5LiK5LygXG4gKi9cblRhc2sucHJvdG90eXBlLnBhdXNlID0gYWJzdHJhY3RNZXRob2Q7XG5cbi8qKlxuICog5oGi5aSN5pqC5YGcXG4gKi9cblRhc2sucHJvdG90eXBlLnJlc3VtZSA9IGFic3RyYWN0TWV0aG9kO1xuXG5UYXNrLnByb3RvdHlwZS5zZXROZXR3b3JrSW5mbyA9IGZ1bmN0aW9uIChuZXR3b3JrSW5mbykge1xuICAgIHRoaXMubmV0d29ya0luZm8gPSBuZXR3b3JrSW5mbztcbn07XG5cbi8qKlxuICog57uI5q2i5LiK5Lyg5Lu75YqhXG4gKi9cblRhc2sucHJvdG90eXBlLmFib3J0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnhoclJlcXVlc3RpbmdcbiAgICAgICAgJiYgdHlwZW9mIHRoaXMueGhyUmVxdWVzdGluZy5hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLmFib3J0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnhoclJlcXVlc3RpbmcuYWJvcnQoKTtcbiAgICAgICAgdGhpcy54aHJSZXF1ZXN0aW5nID0gbnVsbDtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRhc2s7XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCBCYWlkdS5jb20sIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZFxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aFxuICogdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb25cbiAqIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlXG4gKiBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBmaWxlIHVwbG9hZGVyLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciB1dGlscyA9IHJlcXVpcmUoMzIpO1xudmFyIGV2ZW50cyA9IHJlcXVpcmUoMjQpO1xudmFyIGtEZWZhdWx0T3B0aW9ucyA9IHJlcXVpcmUoMjMpO1xudmFyIFB1dE9iamVjdFRhc2sgPSByZXF1aXJlKDI3KTtcbnZhciBNdWx0aXBhcnRUYXNrID0gcmVxdWlyZSgyNSk7XG52YXIgU3RzVG9rZW5NYW5hZ2VyID0gcmVxdWlyZSgyOSk7XG52YXIgTmV0d29ya0luZm8gPSByZXF1aXJlKDI2KTtcblxudmFyIEF1dGggPSByZXF1aXJlKDE1KTtcbnZhciBCb3NDbGllbnQgPSByZXF1aXJlKDE3KTtcblxuLyoqXG4gKiBCQ0UgQk9TIFVwbG9hZGVyXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdHxzdHJpbmd9IG9wdGlvbnMg6YWN572u5Y+C5pWwXG4gKi9cbmZ1bmN0aW9uIFVwbG9hZGVyKG9wdGlvbnMpIHtcbiAgICBpZiAodS5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICAvLyDmlK/mjIHnroDkvr/nmoTlhpnms5XvvIzlj6/ku6Xku44gRE9NIOmHjOmdouWIhuaekOebuOWFs+eahOmFjee9ri5cbiAgICAgICAgb3B0aW9ucyA9IHUuZXh0ZW5kKHtcbiAgICAgICAgICAgIGJyb3dzZV9idXR0b246IG9wdGlvbnMsXG4gICAgICAgICAgICBhdXRvX3N0YXJ0OiB0cnVlXG4gICAgICAgIH0sICQob3B0aW9ucykuZGF0YSgpKTtcbiAgICB9XG5cbiAgICB2YXIgcnVudGltZU9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLm9wdGlvbnMgPSB1LmV4dGVuZCh7fSwga0RlZmF1bHRPcHRpb25zLCBydW50aW1lT3B0aW9ucywgb3B0aW9ucyk7XG4gICAgdGhpcy5vcHRpb25zLm1heF9maWxlX3NpemUgPSB1dGlscy5wYXJzZVNpemUodGhpcy5vcHRpb25zLm1heF9maWxlX3NpemUpO1xuICAgIHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X21pbl9zaXplXG4gICAgICAgID0gdXRpbHMucGFyc2VTaXplKHRoaXMub3B0aW9ucy5ib3NfbXVsdGlwYXJ0X21pbl9zaXplKTtcbiAgICB0aGlzLm9wdGlvbnMuY2h1bmtfc2l6ZSA9IHV0aWxzLnBhcnNlU2l6ZSh0aGlzLm9wdGlvbnMuY2h1bmtfc2l6ZSk7XG5cbiAgICB2YXIgY3JlZGVudGlhbHMgPSB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzO1xuICAgIGlmICghY3JlZGVudGlhbHMgJiYgdGhpcy5vcHRpb25zLmJvc19hayAmJiB0aGlzLm9wdGlvbnMuYm9zX3NrKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5ib3NfY3JlZGVudGlhbHMgPSB7XG4gICAgICAgICAgICBhazogdGhpcy5vcHRpb25zLmJvc19hayxcbiAgICAgICAgICAgIHNrOiB0aGlzLm9wdGlvbnMuYm9zX3NrXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Jvc0NsaWVudH1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudCA9IG5ldyBCb3NDbGllbnQoe1xuICAgICAgICBlbmRwb2ludDogdXRpbHMubm9ybWFsaXplRW5kcG9pbnQodGhpcy5vcHRpb25zLmJvc19lbmRwb2ludCksXG4gICAgICAgIGNyZWRlbnRpYWxzOiB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzLFxuICAgICAgICBzZXNzaW9uVG9rZW46IHRoaXMub3B0aW9ucy51cHRva2VuXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDpnIDopoHnrYnlvoXkuIrkvKDnmoTmlofku7bliJfooajvvIzmr4/mrKHkuIrkvKDnmoTml7blgJnvvIzku47ov5nph4zpnaLliKDpmaRcbiAgICAgKiDmiJDlip/miJbogIXlpLHotKXpg73kuI3kvJrlho3mlL7lm57ljrvkuoZcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxGaWxlPn1cbiAgICAgKi9cbiAgICB0aGlzLl9maWxlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICog5q2j5Zyo5LiK5Lyg55qE5paH5Lu25YiX6KGoLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdC48c3RyaW5nLCBGaWxlPn1cbiAgICAgKi9cbiAgICB0aGlzLl91cGxvYWRpbmdGaWxlcyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICog5piv5ZCm6KKr5Lit5pat5LqG77yM5q+U5aaCIHRoaXMuc3RvcFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX2Fib3J0ID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiDmmK/lkKblpITkuo7kuIrkvKDnmoTov4fnqIvkuK3vvIzkuZ/lsLHmmK/mraPlnKjlpITnkIYgdGhpcy5fZmlsZXMg6Zif5YiX55qE5YaF5a65LlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX3dvcmtpbmcgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuaUr+aMgXhocjJcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl94aHIyU3VwcG9ydGVkID0gdXRpbHMuaXNYaHIyU3VwcG9ydGVkKCk7XG5cbiAgICB0aGlzLl9uZXR3b3JrSW5mbyA9IG5ldyBOZXR3b3JrSW5mbygpO1xuXG4gICAgdGhpcy5faW5pdCgpO1xufVxuXG5VcGxvYWRlci5wcm90b3R5cGUuX2dldEN1c3RvbWl6ZWRTaWduYXR1cmUgPSBmdW5jdGlvbiAodXB0b2tlblVybCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciB0aW1lb3V0ID0gb3B0aW9ucy51cHRva2VuX3RpbWVvdXQgfHwgb3B0aW9ucy51cHRva2VuX2pzb25wX3RpbWVvdXQ7XG4gICAgdmFyIHZpYUpzb25wID0gb3B0aW9ucy51cHRva2VuX3ZpYV9qc29ucDtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoXywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKSB7XG4gICAgICAgIGlmICgvXFxiZWQ9KFtcXHdcXC5dKylcXGIvLnRlc3QobG9jYXRpb24uc2VhcmNoKSkge1xuICAgICAgICAgICAgaGVhZGVycy5Ib3N0ID0gUmVnRXhwLiQxO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHUuaXNBcnJheShvcHRpb25zLmF1dGhfc3RyaXBwZWRfaGVhZGVycykpIHtcbiAgICAgICAgICAgIGhlYWRlcnMgPSB1Lm9taXQoaGVhZGVycywgb3B0aW9ucy5hdXRoX3N0cmlwcGVkX2hlYWRlcnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB1cHRva2VuVXJsLFxuICAgICAgICAgICAganNvbnA6IHZpYUpzb25wID8gJ2NhbGxiYWNrJyA6IGZhbHNlLFxuICAgICAgICAgICAgZGF0YVR5cGU6IHZpYUpzb25wID8gJ2pzb25wJyA6ICdqc29uJyxcbiAgICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgaHR0cE1ldGhvZDogaHR0cE1ldGhvZCxcbiAgICAgICAgICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICAgICAgICAgIC8vIGRlbGF5OiB+fihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgICAgICAgICAgICAgIHF1ZXJpZXM6IEpTT04uc3RyaW5naWZ5KHBhcmFtcyB8fCB7fSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogSlNPTi5zdHJpbmdpZnkoaGVhZGVycyB8fCB7fSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChuZXcgRXJyb3IoJ0dldCBhdXRob3JpemF0aW9uIHRpbWVvdXQgKCcgKyB0aW1lb3V0ICsgJ21zKS4nKSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZC5zdGF0dXNDb2RlID09PSAyMDAgJiYgcGF5bG9hZC5zaWduYXR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwYXlsb2FkLnNpZ25hdHVyZSwgcGF5bG9hZC54YmNlRGF0ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKCdjcmVhdGVTaWduYXR1cmUgZmFpbGVkLCBzdGF0dXNDb2RlID0gJyArIHBheWxvYWQuc3RhdHVzQ29kZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59O1xuXG4vKipcbiAqIOiwg+eUqCB0aGlzLm9wdGlvbnMuaW5pdCDph4zpnaLphY3nva7nmoTmlrnms5VcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSDmlrnms5XlkI3np7BcbiAqIEBwYXJhbSB7QXJyYXkuPCo+fSBhcmdzIOiwg+eUqOaXtuWAmeeahOWPguaVsC5cbiAqIEBwYXJhbSB7Ym9vbGVhbj19IHRocm93RXJyb3JzIOWmguaenOWPkeeUn+W8guW4uOeahOaXtuWAme+8jOaYr+WQpumcgOimgeaKm+WHuuadpVxuICogQHJldHVybiB7Kn0g5LqL5Lu255qE6L+U5Zue5YC8LlxuICovXG5VcGxvYWRlci5wcm90b3R5cGUuX2ludm9rZSA9IGZ1bmN0aW9uIChtZXRob2ROYW1lLCBhcmdzLCB0aHJvd0Vycm9ycykge1xuICAgIHZhciBpbml0ID0gdGhpcy5vcHRpb25zLmluaXQgfHwgdGhpcy5vcHRpb25zLkluaXQ7XG4gICAgaWYgKCFpbml0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbWV0aG9kID0gaW5pdFttZXRob2ROYW1lXTtcbiAgICBpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgdmFyIHVwID0gbnVsbDtcbiAgICAgICAgYXJncyA9IGFyZ3MgPT0gbnVsbCA/IFt1cF0gOiBbdXBdLmNvbmNhdChhcmdzKTtcbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgIGlmICh0aHJvd0Vycm9ycyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIFEucmVqZWN0KGV4KTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICog5Yid5aeL5YyW5o6n5Lu2LlxuICovXG5VcGxvYWRlci5wcm90b3R5cGUuX2luaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgdmFyIGFjY2VwdCA9IG9wdGlvbnMuYWNjZXB0O1xuXG4gICAgdmFyIGJ0bkVsZW1lbnQgPSAkKG9wdGlvbnMuYnJvd3NlX2J1dHRvbik7XG4gICAgdmFyIG5vZGVOYW1lID0gYnRuRWxlbWVudC5wcm9wKCdub2RlTmFtZScpO1xuICAgIGlmIChub2RlTmFtZSAhPT0gJ0lOUFVUJykge1xuICAgICAgICB2YXIgZWxlbWVudENvbnRhaW5lciA9IGJ0bkVsZW1lbnQ7XG5cbiAgICAgICAgLy8g5aaC5p6c5pys6Lqr5LiN5pivIDxpbnB1dCB0eXBlPVwiZmlsZVwiIC8+77yM6Ieq5Yqo6L+95Yqg5LiA5Liq5LiK5Y67XG4gICAgICAgIC8vIDEuIG9wdGlvbnMuYnJvd3NlX2J1dHRvbiDlkI7pnaLov73liqDkuIDkuKrlhYPntKAgPGRpdj48aW5wdXQgdHlwZT1cImZpbGVcIiAvPjwvZGl2PlxuICAgICAgICAvLyAyLiBidG5FbGVtZW50LnBhcmVudCgpLmNzcygncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICAgICAgLy8gMy4gLmJjZS1ib3MtdXBsb2FkZXItaW5wdXQtY29udGFpbmVyIOeUqOadpeiHquWumuS5ieiHquW3seeahOagt+W8j1xuICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50Q29udGFpbmVyLm91dGVyV2lkdGgoKTtcbiAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnRDb250YWluZXIub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICB2YXIgaW5wdXRFbGVtZW50Q29udGFpbmVyID0gJCgnPGRpdiBjbGFzcz1cImJjZS1ib3MtdXBsb2FkZXItaW5wdXQtY29udGFpbmVyXCI+PGlucHV0IHR5cGU9XCJmaWxlXCIgLz48L2Rpdj4nKTtcbiAgICAgICAgaW5wdXRFbGVtZW50Q29udGFpbmVyLmNzcyh7XG4gICAgICAgICAgICAncG9zaXRpb24nOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgJ3RvcCc6IDAsICdsZWZ0JzogMCxcbiAgICAgICAgICAgICd3aWR0aCc6IHdpZHRoLCAnaGVpZ2h0JzogaGVpZ2h0LFxuICAgICAgICAgICAgJ292ZXJmbG93JzogJ2hpZGRlbicsXG4gICAgICAgICAgICAvLyDlpoLmnpzmlK/mjIEgeGhyMu+8jOaKiiBpbnB1dFt0eXBlPWZpbGVdIOaUvuWIsOaMiemSrueahOS4i+mdou+8jOmAmui/h+S4u+WKqOiwg+eUqCBmaWxlLmNsaWNrKCkg6Kem5Y+RXG4gICAgICAgICAgICAvLyDlpoLmnpzkuI3mlK/mjIF4aHIyLCDmioogaW5wdXRbdHlwZT1maWxlXSDmlL7liLDmjInpkq7nmoTkuIrpnaLvvIzpgJrov4fnlKjmiLfkuLvliqjngrnlh7sgaW5wdXRbdHlwZT1maWxlXSDop6blj5FcbiAgICAgICAgICAgICd6LWluZGV4JzogdGhpcy5feGhyMlN1cHBvcnRlZCA/IDk5IDogMTAwXG4gICAgICAgIH0pO1xuICAgICAgICBpbnB1dEVsZW1lbnRDb250YWluZXIuZmluZCgnaW5wdXQnKS5jc3Moe1xuICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICd0b3AnOiAwLCAnbGVmdCc6IDAsXG4gICAgICAgICAgICAnd2lkdGgnOiAnMTAwJScsICdoZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAnZm9udC1zaXplJzogJzk5OXB4JyxcbiAgICAgICAgICAgICdvcGFjaXR5JzogMFxuICAgICAgICB9KTtcbiAgICAgICAgZWxlbWVudENvbnRhaW5lci5jc3Moe1xuICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICd6LWluZGV4JzogdGhpcy5feGhyMlN1cHBvcnRlZCA/IDEwMCA6IDk5XG4gICAgICAgIH0pO1xuICAgICAgICBlbGVtZW50Q29udGFpbmVyLmFmdGVyKGlucHV0RWxlbWVudENvbnRhaW5lcik7XG4gICAgICAgIGVsZW1lbnRDb250YWluZXIucGFyZW50KCkuY3NzKCdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuXG4gICAgICAgIC8vIOaKiiBicm93c2VfYnV0dG9uIOS/ruaUueS4uuW9k+WJjeeUn+aIkOeahOmCo+S4quWFg+e0oFxuICAgICAgICBvcHRpb25zLmJyb3dzZV9idXR0b24gPSBpbnB1dEVsZW1lbnRDb250YWluZXIuZmluZCgnaW5wdXQnKTtcblxuICAgICAgICBpZiAodGhpcy5feGhyMlN1cHBvcnRlZCkge1xuICAgICAgICAgICAgZWxlbWVudENvbnRhaW5lci5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5icm93c2VfYnV0dG9uLmNsaWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMuX3hocjJTdXBwb3J0ZWRcbiAgICAgICAgJiYgdHlwZW9mIG1PeGllICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAmJiB1LmlzRnVuY3Rpb24obU94aWUuRmlsZUlucHV0KSkge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW94aWVjb2RlL21veGllL3dpa2kvRmlsZUlucHV0XG4gICAgICAgIC8vIG1PeGllLkZpbGVJbnB1dCDlj6rmlK/mjIFcbiAgICAgICAgLy8gWytdOiBicm93c2VfYnV0dG9uLCBhY2NlcHQgbXVsdGlwbGUsIGRpcmVjdG9yeSwgZmlsZVxuICAgICAgICAvLyBbeF06IGNvbnRhaW5lciwgcmVxdWlyZWRfY2Fwc1xuICAgICAgICB2YXIgZmlsZUlucHV0ID0gbmV3IG1PeGllLkZpbGVJbnB1dCh7XG4gICAgICAgICAgICBydW50aW1lX29yZGVyOiAnZmxhc2gsaHRtbDQnLFxuICAgICAgICAgICAgYnJvd3NlX2J1dHRvbjogJChvcHRpb25zLmJyb3dzZV9idXR0b24pLmdldCgwKSxcbiAgICAgICAgICAgIHN3Zl91cmw6IG9wdGlvbnMuZmxhc2hfc3dmX3VybCxcbiAgICAgICAgICAgIGFjY2VwdDogdXRpbHMuZXhwYW5kQWNjZXB0VG9BcnJheShhY2NlcHQpLFxuICAgICAgICAgICAgbXVsdGlwbGU6IG9wdGlvbnMubXVsdGlfc2VsZWN0aW9uLFxuICAgICAgICAgICAgZGlyZWN0b3J5OiBvcHRpb25zLmRpcl9zZWxlY3Rpb24sXG4gICAgICAgICAgICBmaWxlOiAnZmlsZScgICAgICAvLyBQb3N0T2JqZWN05o6l5Y+j6KaB5rGC5Zu65a6a5pivICdmaWxlJ1xuICAgICAgICB9KTtcblxuICAgICAgICBmaWxlSW5wdXQub25jaGFuZ2UgPSB1LmJpbmQodGhpcy5fb25GaWxlc0FkZGVkLCB0aGlzKTtcbiAgICAgICAgZmlsZUlucHV0Lm9ucmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLl9pbml0RXZlbnRzKCk7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtQb3N0SW5pdCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgZmlsZUlucHV0LmluaXQoKTtcbiAgICB9XG5cbiAgICB2YXIgcHJvbWlzZSA9IG9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzXG4gICAgICAgID8gUS5yZXNvbHZlKClcbiAgICAgICAgOiBzZWxmLnJlZnJlc2hTdHNUb2tlbigpO1xuXG4gICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICBzZWxmLmNsaWVudC5jcmVhdGVTaWduYXR1cmUgPSBmdW5jdGlvbiAoXywgaHR0cE1ldGhvZCwgcGF0aCwgcGFyYW1zLCBoZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNyZWRlbnRpYWxzID0gXyB8fCB0aGlzLmNvbmZpZy5jcmVkZW50aWFscztcbiAgICAgICAgICAgICAgICByZXR1cm4gUS5mY2FsbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdXRoID0gbmV3IEF1dGgoY3JlZGVudGlhbHMuYWssIGNyZWRlbnRpYWxzLnNrKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF1dGguZ2VuZXJhdGVBdXRob3JpemF0aW9uKGh0dHBNZXRob2QsIHBhdGgsIHBhcmFtcywgaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMudXB0b2tlbl91cmwgJiYgb3B0aW9ucy5nZXRfbmV3X3VwdG9rZW4gPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIOacjeWKoeerr+WKqOaAgeetvuWQjeeahOaWueW8j1xuICAgICAgICAgICAgc2VsZi5jbGllbnQuY3JlYXRlU2lnbmF0dXJlID0gc2VsZi5fZ2V0Q3VzdG9taXplZFNpZ25hdHVyZShvcHRpb25zLnVwdG9rZW5fdXJsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWxmLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAvLyDlr7nkuo7kuI3mlK/mjIEgeGhyMiDnmoTmg4XlhrXvvIzkvJrlnKggb25yZWFkeSDnmoTml7blgJnljrvop6blj5Hkuovku7ZcbiAgICAgICAgICAgIHNlbGYuX2luaXRFdmVudHMoKTtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua1Bvc3RJbml0KTtcbiAgICAgICAgfVxuICAgIH0pW1wiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0Vycm9yLCBbZXJyb3JdKTtcbiAgICB9KTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5faW5pdEV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmICh0aGlzLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgIHZhciBidG4gPSAkKG9wdGlvbnMuYnJvd3NlX2J1dHRvbik7XG4gICAgICAgIGlmIChidG4uYXR0cignbXVsdGlwbGUnKSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpznlKjmiLfmsqHmnInmmL7npLrnmoTorr7nva7ov4cgbXVsdGlwbGXvvIzkvb/nlKggbXVsdGlfc2VsZWN0aW9uIOeahOiuvue9rlxuICAgICAgICAgICAgLy8g5ZCm5YiZ5L+d55WZIDxpbnB1dCBtdWx0aXBsZSAvPiDnmoTlhoXlrrlcbiAgICAgICAgICAgIGJ0bi5hdHRyKCdtdWx0aXBsZScsICEhb3B0aW9ucy5tdWx0aV9zZWxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGJ0bi5vbignY2hhbmdlJywgdS5iaW5kKHRoaXMuX29uRmlsZXNBZGRlZCwgdGhpcykpO1xuXG4gICAgICAgIHZhciBhY2NlcHQgPSBvcHRpb25zLmFjY2VwdDtcbiAgICAgICAgaWYgKGFjY2VwdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAvLyBTYWZhcmkg5Y+q5pSv5oyBIG1pbWUtdHlwZVxuICAgICAgICAgICAgLy8gQ2hyb21lIOaUr+aMgSBtaW1lLXR5cGUg5ZKMIGV4dHNcbiAgICAgICAgICAgIC8vIEZpcmVmb3gg5Y+q5pSv5oyBIGV4dHNcbiAgICAgICAgICAgIC8vIE5PVEU6IGV4dHMg5b+F6aG75pyJIC4g6L+Z5Liq5YmN57yA77yM5L6L5aaCIC50eHQg5piv5ZCI5rOV55qE77yMdHh0IOaYr+S4jeWQiOazleeahFxuICAgICAgICAgICAgdmFyIGV4dHMgPSB1dGlscy5leHBhbmRBY2NlcHQoYWNjZXB0KTtcbiAgICAgICAgICAgIHZhciBpc1NhZmFyaSA9IC9TYWZhcmkvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0FwcGxlIENvbXB1dGVyLy50ZXN0KG5hdmlnYXRvci52ZW5kb3IpO1xuICAgICAgICAgICAgaWYgKGlzU2FmYXJpKSB7XG4gICAgICAgICAgICAgICAgZXh0cyA9IHV0aWxzLmV4dFRvTWltZVR5cGUoZXh0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBidG4uYXR0cignYWNjZXB0JywgZXh0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5kaXJfc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBidG4uYXR0cignZGlyZWN0b3J5JywgdHJ1ZSk7XG4gICAgICAgICAgICBidG4uYXR0cignbW96ZGlyZWN0b3J5JywgdHJ1ZSk7XG4gICAgICAgICAgICBidG4uYXR0cignd2Via2l0ZGlyZWN0b3J5JywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsaWVudC5vbigncHJvZ3Jlc3MnLCB1LmJpbmQodGhpcy5fb25VcGxvYWRQcm9ncmVzcywgdGhpcykpO1xuICAgIC8vIFhYWCDlv4Xpobvnu5HlrpogZXJyb3Ig55qE5aSE55CG5Ye95pWw77yM5ZCm5YiZ5LyaIHRocm93IG5ldyBFcnJvclxuICAgIHRoaXMuY2xpZW50Lm9uKCdlcnJvcicsIHUuYmluZCh0aGlzLl9vbkVycm9yLCB0aGlzKSk7XG5cbiAgICAvLyAkKHdpbmRvdykub24oJ29ubGluZScsIHUuYmluZCh0aGlzLl9oYW5kbGVPbmxpbmVTdGF0dXMsIHRoaXMpKTtcbiAgICAvLyAkKHdpbmRvdykub24oJ29mZmxpbmUnLCB1LmJpbmQodGhpcy5faGFuZGxlT2ZmbGluZVN0YXR1cywgdGhpcykpO1xuXG4gICAgaWYgKCF0aGlzLl94aHIyU3VwcG9ydGVkKSB7XG4gICAgICAgIC8vIOWmguaenOa1j+iniOWZqOS4jeaUr+aMgSB4aHIy77yM6YKj5LmI5bCx5YiH5o2i5YiwIG1PeGllLlhNTEh0dHBSZXF1ZXN0XG4gICAgICAgIC8vIOS9huaYr+WboOS4uiBtT3hpZS5YTUxIdHRwUmVxdWVzdCDml6Dms5Xlj5HpgIEgSEVBRCDor7fmsYLvvIzml6Dms5Xojrflj5YgUmVzcG9uc2UgSGVhZGVyc++8jFxuICAgICAgICAvLyDlm6DmraQgZ2V0T2JqZWN0TWV0YWRhdGHlrp7pmYXkuIrml6Dms5XmraPluLjlt6XkvZzvvIzlm6DmraTmiJHku6zpnIDopoHvvJpcbiAgICAgICAgLy8gMS4g6K6pIEJPUyDmlrDlop4gUkVTVCBBUEnvvIzlnKggR0VUIOeahOivt+axgueahOWQjOaXtu+8jOaKiiB4LWJjZS0qIOaUvuWIsCBSZXNwb25zZSBCb2R5IOi/lOWbnlxuICAgICAgICAvLyAyLiDkuLTml7bmlrnmoYjvvJrmlrDlop7kuIDkuKogUmVsYXkg5pyN5Yqh77yM5a6e546w5pa55qGIIDFcbiAgICAgICAgLy8gICAgR0VUIC9iai5iY2Vib3MuY29tL3YxL2J1Y2tldC9vYmplY3Q/aHR0cE1ldGhvZD1IRUFEXG4gICAgICAgIC8vICAgIEhvc3Q6IHJlbGF5LmVmZS50ZWNoXG4gICAgICAgIC8vICAgIEF1dGhvcml6YXRpb246IHh4eFxuICAgICAgICAvLyBvcHRpb25zLmJvc19yZWxheV9zZXJ2ZXJcbiAgICAgICAgLy8gb3B0aW9ucy5zd2ZfdXJsXG4gICAgICAgIHRoaXMuY2xpZW50LnNlbmRIVFRQUmVxdWVzdCA9IHUuYmluZCh1dGlscy5maXhYaHIodGhpcy5vcHRpb25zLCB0cnVlKSwgdGhpcy5jbGllbnQpO1xuICAgIH1cbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fZmlsdGVyRmlsZXMgPSBmdW5jdGlvbiAoY2FuZGlkYXRlcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIC8vIOWmguaenCBtYXhGaWxlU2l6ZSA9PT0gMCDlsLHor7TmmI7kuI3pmZDliLblpKflsI9cbiAgICB2YXIgbWF4RmlsZVNpemUgPSB0aGlzLm9wdGlvbnMubWF4X2ZpbGVfc2l6ZTtcblxuICAgIHZhciBmaWxlcyA9IHUuZmlsdGVyKGNhbmRpZGF0ZXMsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgIGlmIChtYXhGaWxlU2l6ZSA+IDAgJiYgZmlsZS5zaXplID4gbWF4RmlsZVNpemUpIHtcbiAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua0ZpbGVGaWx0ZXJlZCwgW2ZpbGVdKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE9cbiAgICAgICAgLy8g5qOA5p+l5ZCO57yA5LmL57G755qEXG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcy5faW52b2tlKGV2ZW50cy5rRmlsZXNGaWx0ZXIsIFtmaWxlc10pIHx8IGZpbGVzO1xufTtcblxuZnVuY3Rpb24gYnVpbGRBYm9ydEhhbmRsZXIoaXRlbSwgc2VsZikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0ZW0uX2Fib3J0ZWQgPSB0cnVlO1xuICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtBYm9ydGVkLCBbbnVsbCwgaXRlbV0pO1xuICAgIH07XG59XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fb25GaWxlc0FkZGVkID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZpbGVzID0gZS50YXJnZXQuZmlsZXM7XG4gICAgaWYgKCFmaWxlcykge1xuICAgICAgICAvLyBJRTcsIElFOCDkvY7niYjmnKzmtY/op4jlmajnmoTlpITnkIZcbiAgICAgICAgdmFyIG5hbWUgPSBlLnRhcmdldC52YWx1ZS5zcGxpdCgvW1xcL1xcXFxdLykucG9wKCk7XG4gICAgICAgIGZpbGVzID0gW1xuICAgICAgICAgICAge25hbWU6IG5hbWUsIHNpemU6IDB9XG4gICAgICAgIF07XG4gICAgfVxuICAgIGZpbGVzID0gdGhpcy5fZmlsdGVyRmlsZXMoZmlsZXMpO1xuICAgIGlmICh1LmlzQXJyYXkoZmlsZXMpICYmIGZpbGVzLmxlbmd0aCkge1xuICAgICAgICB2YXIgdG90YWxCeXRlcyA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gZmlsZXNbaV07XG5cbiAgICAgICAgICAgIC8vIOi/memHjOaYryBhYm9ydCDnmoTpu5jorqTlrp7njrDvvIzlvIDlp4vkuIrkvKDnmoTml7blgJnvvIzkvJrmlLnmiJDlj6blpJbnmoTkuIDnp43lrp7njrDmlrnlvI9cbiAgICAgICAgICAgIC8vIOm7mOiupOeahOWunueOsOaYr+S4uuS6huaUr+aMgeWcqOayoeacieW8gOWni+S4iuS8oOS5i+WJje+8jOS5n+WPr+S7peWPlua2iOS4iuS8oOeahOmcgOaxglxuICAgICAgICAgICAgaXRlbS5hYm9ydCA9IGJ1aWxkQWJvcnRIYW5kbGVyKGl0ZW0sIHNlbGYpO1xuXG4gICAgICAgICAgICAvLyDlhoXpg6jnmoQgdXVpZO+8jOWklumDqOS5n+WPr+S7peS9v+eUqO+8jOavlOWmgiByZW1vdmUoaXRlbS51dWlkKSAvIHJlbW92ZShpdGVtKVxuICAgICAgICAgICAgaXRlbS51dWlkID0gdXRpbHMudXVpZCgpO1xuXG4gICAgICAgICAgICB0b3RhbEJ5dGVzICs9IGl0ZW0uc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9uZXR3b3JrSW5mby50b3RhbEJ5dGVzICs9IHRvdGFsQnl0ZXM7XG4gICAgICAgIHRoaXMuX2ZpbGVzLnB1c2guYXBwbHkodGhpcy5fZmlsZXMsIGZpbGVzKTtcbiAgICAgICAgdGhpcy5faW52b2tlKGV2ZW50cy5rRmlsZXNBZGRlZCwgW2ZpbGVzXSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvX3N0YXJ0KSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuX29uRXJyb3IgPSBmdW5jdGlvbiAoZSkge1xufTtcblxuLyoqXG4gKiDlpITnkIbkuIrkvKDov5vluqbnmoTlm57mjonlh73mlbAuXG4gKiAxLiDov5nph4zopoHljLrliIbmlofku7bnmoTkuIrkvKDov5jmmK/liIbniYfnmoTkuIrkvKDvvIzliIbniYfnmoTkuIrkvKDmmK/pgJrov4cgcGFydE51bWJlciDlkowgdXBsb2FkSWQg55qE57uE5ZCI5p2l5Yik5pat55qEXG4gKiAyLiBJRTYsNyw4LDnkuIvpnaLvvIzmmK/kuI3pnIDopoHogIPomZHnmoTvvIzlm6DkuLrkuI3kvJrop6blj5Hov5nkuKrkuovku7bvvIzogIzmmK/nm7TmjqXlnKggX3NlbmRQb3N0UmVxdWVzdCDop6blj5Ega1VwbG9hZFByb2dyZXNzIOS6hlxuICogMy4g5YW25a6D5oOF5Ya15LiL77yM5oiR5Lus5Yik5pat5LiA5LiLIFJlcXVlc3QgQm9keSDnmoTnsbvlnovmmK/lkKbmmK8gQmxvYu+8jOS7juiAjOmBv+WFjeWvueS6juWFtuWug+exu+Wei+eahOivt+axgu+8jOinpuWPkSBrVXBsb2FkUHJvZ3Jlc3NcbiAqICAgIOS+i+Wmgu+8mkhFQUTvvIxHRVTvvIxQT1NUKEluaXRNdWx0aXBhcnQpIOeahOaXtuWAme+8jOaYr+ayoeW/heimgeinpuWPkSBrVXBsb2FkUHJvZ3Jlc3Mg55qEXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGUgIFByb2dyZXNzIEV2ZW50IOWvueixoS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBodHRwQ29udGV4dCBzZW5kSFRUUFJlcXVlc3Qg55qE5Y+C5pWwXG4gKi9cblVwbG9hZGVyLnByb3RvdHlwZS5fb25VcGxvYWRQcm9ncmVzcyA9IGZ1bmN0aW9uIChlLCBodHRwQ29udGV4dCkge1xuICAgIHZhciBhcmdzID0gaHR0cENvbnRleHQuYXJncztcbiAgICB2YXIgZmlsZSA9IGFyZ3MuYm9keTtcblxuICAgIGlmICghdXRpbHMuaXNCbG9iKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgcHJvZ3Jlc3MgPSBlLmxlbmd0aENvbXB1dGFibGVcbiAgICAgICAgPyBlLmxvYWRlZCAvIGUudG90YWxcbiAgICAgICAgOiAwO1xuXG4gICAgdGhpcy5fbmV0d29ya0luZm8ubG9hZGVkQnl0ZXMgKz0gKGUubG9hZGVkIC0gZmlsZS5fcHJldmlvdXNMb2FkZWQpO1xuICAgIHRoaXMuX2ludm9rZShldmVudHMua05ldHdvcmtTcGVlZCwgdGhpcy5fbmV0d29ya0luZm8uZHVtcCgpKTtcbiAgICBmaWxlLl9wcmV2aW91c0xvYWRlZCA9IGUubG9hZGVkO1xuXG4gICAgdmFyIGV2ZW50VHlwZSA9IGV2ZW50cy5rVXBsb2FkUHJvZ3Jlc3M7XG4gICAgaWYgKGFyZ3MucGFyYW1zLnBhcnROdW1iZXIgJiYgYXJncy5wYXJhbXMudXBsb2FkSWQpIHtcbiAgICAgICAgLy8gSUU2LDcsOCw55LiL6Z2i5LiN5Lya5pyJcGFydE51bWJlcuWSjHVwbG9hZElkXG4gICAgICAgIC8vIOatpOaXtueahCBmaWxlIOaYryBzbGljZSDnmoTnu5PmnpzvvIzlj6/og73msqHmnInoh6rlrprkuYnnmoTlsZ7mgKdcbiAgICAgICAgLy8g5q+U5aaCIGRlbW8g6YeM6Z2i55qEIF9faWQsIF9fbWVkaWFJZCDkuYvnsbvnmoRcbiAgICAgICAgZXZlbnRUeXBlID0gZXZlbnRzLmtVcGxvYWRQYXJ0UHJvZ3Jlc3M7XG4gICAgfVxuXG4gICAgdGhpcy5faW52b2tlKGV2ZW50VHlwZSwgW2ZpbGUsIHByb2dyZXNzLCBlXSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGl0ZW0gPSB0aGlzLl91cGxvYWRpbmdGaWxlc1tpdGVtXSB8fCB1LmZpbmQodGhpcy5fZmlsZXMsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmlsZS51dWlkID09PSBpdGVtO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoaXRlbSAmJiB0eXBlb2YgaXRlbS5hYm9ydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpdGVtLmFib3J0KCk7XG4gICAgfVxufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmICh0aGlzLl93b3JraW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX3dvcmtpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLl9hYm9ydCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9uZXR3b3JrSW5mby5yZXNldCgpO1xuXG4gICAgICAgIHZhciB0YXNrUGFyYWxsZWwgPSB0aGlzLm9wdGlvbnMuYm9zX3Rhc2tfcGFyYWxsZWw7XG4gICAgICAgIC8vIOi/memHjOayoeacieS9v+eUqCBhc3luYy5lYWNoTGltaXQg55qE5Y6f5Zug5pivIHRoaXMuX2ZpbGVzIOWPr+iDveS8muiiq+WKqOaAgeeahOS/ruaUuVxuICAgICAgICB1dGlscy5lYWNoTGltaXQodGhpcy5fZmlsZXMsIHRhc2tQYXJhbGxlbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChmaWxlLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGZpbGUuX3ByZXZpb3VzTG9hZGVkID0gMDtcbiAgICAgICAgICAgICAgICBzZWxmLl91cGxvYWROZXh0KGZpbGUpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZ1bGZpbGxtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc2VsZi5fdXBsb2FkaW5nRmlsZXNbZmlsZS51dWlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KVtcbiAgICAgICAgICAgICAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZWplY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzZWxmLl91cGxvYWRpbmdGaWxlc1tmaWxlLnV1aWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHNlbGYuX3dvcmtpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZWxmLl9maWxlcy5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYuX25ldHdvcmtJbmZvLnRvdGFsQnl0ZXMgPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYuX2ludm9rZShldmVudHMua1VwbG9hZENvbXBsZXRlKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX2Fib3J0ID0gdHJ1ZTtcbiAgICB0aGlzLl93b3JraW5nID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIOWKqOaAgeiuvue9riBVcGxvYWRlciDnmoTmn5Dkupvlj4LmlbDvvIzlvZPliY3lj6rmlK/mjIHliqjmgIHnmoTkv67mlLlcbiAqIGJvc19jcmVkZW50aWFscywgdXB0b2tlbiwgYm9zX2J1Y2tldCwgYm9zX2VuZHBvaW50XG4gKiBib3NfYWssIGJvc19za1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIOeUqOaIt+WKqOaAgeiuvue9rueahOWPguaVsO+8iOWPquaUr+aMgemDqOWIhu+8iVxuICovXG5VcGxvYWRlci5wcm90b3R5cGUuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgdmFyIHN1cHBvcnRlZE9wdGlvbnMgPSB1LnBpY2sob3B0aW9ucywgJ2Jvc19jcmVkZW50aWFscycsXG4gICAgICAgICdib3NfYWsnLCAnYm9zX3NrJywgJ3VwdG9rZW4nLCAnYm9zX2J1Y2tldCcsICdib3NfZW5kcG9pbnQnKTtcbiAgICB0aGlzLm9wdGlvbnMgPSB1LmV4dGVuZCh0aGlzLm9wdGlvbnMsIHN1cHBvcnRlZE9wdGlvbnMpO1xuXG4gICAgdmFyIGNvbmZpZyA9IHRoaXMuY2xpZW50ICYmIHRoaXMuY2xpZW50LmNvbmZpZztcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICAgIHZhciBjcmVkZW50aWFscyA9IG51bGw7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICBjcmVkZW50aWFscyA9IG9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMuYm9zX2FrICYmIG9wdGlvbnMuYm9zX3NrKSB7XG4gICAgICAgICAgICBjcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgICAgICBhazogb3B0aW9ucy5ib3NfYWssXG4gICAgICAgICAgICAgICAgc2s6IG9wdGlvbnMuYm9zX3NrXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuYm9zX2NyZWRlbnRpYWxzID0gY3JlZGVudGlhbHM7XG4gICAgICAgICAgICBjb25maWcuY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscztcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy51cHRva2VuKSB7XG4gICAgICAgICAgICBjb25maWcuc2Vzc2lvblRva2VuID0gb3B0aW9ucy51cHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmJvc19lbmRwb2ludCkge1xuICAgICAgICAgICAgY29uZmlnLmVuZHBvaW50ID0gdXRpbHMubm9ybWFsaXplRW5kcG9pbnQob3B0aW9ucy5ib3NfZW5kcG9pbnQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiDmnInnmoTnlKjmiLfluIzmnJvkuLvliqjmm7TmlrAgc3RzIHRva2Vu77yM6YG/5YWN6L+H5pyf55qE6Zeu6aKYXG4gKlxuICogQHJldHVybiB7UHJvbWlzZX1cbiAqL1xuVXBsb2FkZXIucHJvdG90eXBlLnJlZnJlc2hTdHNUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIG9wdGlvbnMgPSBzZWxmLm9wdGlvbnM7XG4gICAgdmFyIHN0c01vZGUgPSBzZWxmLl94aHIyU3VwcG9ydGVkXG4gICAgICAgICYmIG9wdGlvbnMudXB0b2tlbl91cmxcbiAgICAgICAgJiYgb3B0aW9ucy5nZXRfbmV3X3VwdG9rZW4gPT09IGZhbHNlO1xuICAgIGlmIChzdHNNb2RlKSB7XG4gICAgICAgIHZhciBzdG0gPSBuZXcgU3RzVG9rZW5NYW5hZ2VyKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gc3RtLmdldChvcHRpb25zLmJvc19idWNrZXQpLnRoZW4oZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnNldE9wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGJvc19hazogcGF5bG9hZC5BY2Nlc3NLZXlJZCxcbiAgICAgICAgICAgICAgICBib3Nfc2s6IHBheWxvYWQuU2VjcmV0QWNjZXNzS2V5LFxuICAgICAgICAgICAgICAgIHVwdG9rZW46IHBheWxvYWQuU2Vzc2lvblRva2VuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBRLnJlc29sdmUoKTtcbn07XG5cblVwbG9hZGVyLnByb3RvdHlwZS5fdXBsb2FkTmV4dCA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgaWYgKHRoaXMuX2Fib3J0KSB7XG4gICAgICAgIHRoaXMuX3dvcmtpbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZSgpO1xuICAgIH1cblxuICAgIGlmIChmaWxlLl9hYm9ydGVkID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBRLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICB2YXIgdGhyb3dFcnJvcnMgPSB0cnVlO1xuICAgIHZhciByZXR1cm5WYWx1ZSA9IHRoaXMuX2ludm9rZShldmVudHMua0JlZm9yZVVwbG9hZCwgW2ZpbGVdLCB0aHJvd0Vycm9ycyk7XG4gICAgaWYgKHJldHVyblZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBRLnJlc29sdmUocmV0dXJuVmFsdWUpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl91cGxvYWROZXh0SW1wbChmaWxlKTtcbiAgICAgICAgfSlbXG4gICAgICAgIFwiY2F0Y2hcIl0oZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBzZWxmLl9pbnZva2UoZXZlbnRzLmtFcnJvciwgW2Vycm9yLCBmaWxlXSk7XG4gICAgICAgIH0pO1xufTtcblxuVXBsb2FkZXIucHJvdG90eXBlLl91cGxvYWROZXh0SW1wbCA9IGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIHZhciBvYmplY3QgPSBmaWxlLm5hbWU7XG4gICAgdmFyIHRocm93RXJyb3JzID0gdHJ1ZTtcblxuICAgIHZhciBkZWZhdWx0VGFza09wdGlvbnMgPSB1LnBpY2sob3B0aW9ucyxcbiAgICAgICAgJ2ZsYXNoX3N3Zl91cmwnLCAnbWF4X3JldHJpZXMnLCAnY2h1bmtfc2l6ZScsICdyZXRyeV9pbnRlcnZhbCcsXG4gICAgICAgICdib3NfbXVsdGlwYXJ0X3BhcmFsbGVsJyxcbiAgICAgICAgJ2Jvc19tdWx0aXBhcnRfYXV0b19jb250aW51ZScsXG4gICAgICAgICdib3NfbXVsdGlwYXJ0X2xvY2FsX2tleV9nZW5lcmF0b3InXG4gICAgKTtcbiAgICByZXR1cm4gUS5hbGwoW1xuICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtLZXksIFtmaWxlXSwgdGhyb3dFcnJvcnMpLFxuICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtPYmplY3RNZXRhcywgW2ZpbGVdKVxuICAgIF0pLnRoZW4oZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAgIC8vIG9wdGlvbnMuYm9zX2J1Y2tldCDlj6/og73kvJrooqsga0tleSDkuovku7bliqjmgIHnmoTmlLnlj5hcbiAgICAgICAgdmFyIGJ1Y2tldCA9IG9wdGlvbnMuYm9zX2J1Y2tldDtcblxuICAgICAgICB2YXIgcmVzdWx0ID0gYXJyYXlbMF07XG4gICAgICAgIHZhciBvYmplY3RNZXRhcyA9IGFycmF5WzFdO1xuXG4gICAgICAgIHZhciBtdWx0aXBhcnQgPSAnYXV0byc7XG4gICAgICAgIGlmICh1LmlzU3RyaW5nKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIG9iamVjdCA9IHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh1LmlzT2JqZWN0KHJlc3VsdCkpIHtcbiAgICAgICAgICAgIGJ1Y2tldCA9IHJlc3VsdC5idWNrZXQgfHwgYnVja2V0O1xuICAgICAgICAgICAgb2JqZWN0ID0gcmVzdWx0LmtleSB8fCBvYmplY3Q7XG5cbiAgICAgICAgICAgIC8vICdhdXRvJyAvICdvZmYnXG4gICAgICAgICAgICBtdWx0aXBhcnQgPSByZXN1bHQubXVsdGlwYXJ0IHx8IG11bHRpcGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjbGllbnQgPSBzZWxmLmNsaWVudDtcbiAgICAgICAgdmFyIGV2ZW50RGlzcGF0Y2hlciA9IHNlbGY7XG4gICAgICAgIHZhciB0YXNrT3B0aW9ucyA9IHUuZXh0ZW5kKGRlZmF1bHRUYXNrT3B0aW9ucywge1xuICAgICAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICAgICAgb2JqZWN0OiBvYmplY3QsXG4gICAgICAgICAgICBtZXRhczogb2JqZWN0TWV0YXNcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIFRhc2tDb25zdHJ1Y3RvciA9IFB1dE9iamVjdFRhc2s7XG4gICAgICAgIGlmIChtdWx0aXBhcnQgPT09ICdhdXRvJ1xuICAgICAgICAgICAgJiYgc2VsZi5feGhyMlN1cHBvcnRlZFxuICAgICAgICAgICAgJiYgZmlsZS5zaXplID4gb3B0aW9ucy5ib3NfbXVsdGlwYXJ0X21pbl9zaXplKSB7XG4gICAgICAgICAgICBUYXNrQ29uc3RydWN0b3IgPSBNdWx0aXBhcnRUYXNrO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXNrID0gbmV3IFRhc2tDb25zdHJ1Y3RvcihjbGllbnQsIGV2ZW50RGlzcGF0Y2hlciwgdGFza09wdGlvbnMpO1xuXG4gICAgICAgIHNlbGYuX3VwbG9hZGluZ0ZpbGVzW2ZpbGUudXVpZF0gPSBmaWxlO1xuXG4gICAgICAgIGZpbGUuYWJvcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmaWxlLl9hYm9ydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB0YXNrLmFib3J0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGFzay5zZXROZXR3b3JrSW5mbyhzZWxmLl9uZXR3b3JrSW5mbyk7XG4gICAgICAgIHJldHVybiB0YXNrLnN0YXJ0KCk7XG4gICAgfSk7XG59O1xuXG5VcGxvYWRlci5wcm90b3R5cGUuZGlzcGF0Y2hFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGV2ZW50QXJndW1lbnRzLCB0aHJvd0Vycm9ycykge1xuICAgIGlmIChldmVudE5hbWUgPT09IGV2ZW50cy5rQWJvcnRlZFxuICAgICAgICAmJiBldmVudEFyZ3VtZW50c1xuICAgICAgICAmJiBldmVudEFyZ3VtZW50c1sxXSkge1xuICAgICAgICB2YXIgZmlsZSA9IGV2ZW50QXJndW1lbnRzWzFdO1xuICAgICAgICBpZiAoZmlsZS5zaXplID4gMCkge1xuICAgICAgICAgICAgdmFyIGxvYWRlZFNpemUgPSBmaWxlLl9wcmV2aW91c0xvYWRlZCB8fCAwO1xuICAgICAgICAgICAgdGhpcy5fbmV0d29ya0luZm8udG90YWxCeXRlcyAtPSAoZmlsZS5zaXplIC0gbG9hZGVkU2l6ZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnZva2UoZXZlbnRzLmtOZXR3b3JrU3BlZWQsIHRoaXMuX25ldHdvcmtJbmZvLmR1bXAoKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2ludm9rZShldmVudE5hbWUsIGV2ZW50QXJndW1lbnRzLCB0aHJvd0Vycm9ycyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVwbG9hZGVyO1xuIiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQgQmFpZHUuY29tLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWRcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGhcbiAqIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uXG4gKiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZVxuICogc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAZmlsZSB1dGlscy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHFzTW9kdWxlID0gcmVxdWlyZSg0NSk7XG52YXIgUSA9IHJlcXVpcmUoNDQpO1xudmFyIHUgPSByZXF1aXJlKDQ2KTtcbnZhciBoZWxwZXIgPSByZXF1aXJlKDQyKTtcbnZhciBRdWV1ZSA9IHJlcXVpcmUoMjgpO1xudmFyIE1pbWVUeXBlID0gcmVxdWlyZSgyMSk7XG5cbi8qKlxuICog5oqK5paH5Lu26L+b6KGM5YiH54mH77yM6L+U5Zue5YiH54mH5LmL5ZCO55qE5pWw57uEXG4gKlxuICogQHBhcmFtIHtCbG9ifSBmaWxlIOmcgOimgeWIh+eJh+eahOWkp+aWh+S7ti5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJZCDku47mnI3liqHojrflj5bnmoR1cGxvYWRJZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjaHVua1NpemUg5YiG54mH55qE5aSn5bCPLlxuICogQHBhcmFtIHtzdHJpbmd9IGJ1Y2tldCBCdWNrZXQgTmFtZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvYmplY3QgT2JqZWN0IE5hbWUuXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuZXhwb3J0cy5nZXRUYXNrcyA9IGZ1bmN0aW9uIChmaWxlLCB1cGxvYWRJZCwgY2h1bmtTaXplLCBidWNrZXQsIG9iamVjdCkge1xuICAgIHZhciBsZWZ0U2l6ZSA9IGZpbGUuc2l6ZTtcbiAgICB2YXIgb2Zmc2V0ID0gMDtcbiAgICB2YXIgcGFydE51bWJlciA9IDE7XG5cbiAgICB2YXIgdGFza3MgPSBbXTtcblxuICAgIHdoaWxlIChsZWZ0U2l6ZSA+IDApIHtcbiAgICAgICAgdmFyIHBhcnRTaXplID0gTWF0aC5taW4obGVmdFNpemUsIGNodW5rU2l6ZSk7XG5cbiAgICAgICAgdGFza3MucHVzaCh7XG4gICAgICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICAgICAgdXBsb2FkSWQ6IHVwbG9hZElkLFxuICAgICAgICAgICAgYnVja2V0OiBidWNrZXQsXG4gICAgICAgICAgICBvYmplY3Q6IG9iamVjdCxcbiAgICAgICAgICAgIHBhcnROdW1iZXI6IHBhcnROdW1iZXIsXG4gICAgICAgICAgICBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgICAgICBzdGFydDogb2Zmc2V0LFxuICAgICAgICAgICAgc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxlZnRTaXplIC09IHBhcnRTaXplO1xuICAgICAgICBvZmZzZXQgKz0gcGFydFNpemU7XG4gICAgICAgIHBhcnROdW1iZXIgKz0gMTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFza3M7XG59O1xuXG5leHBvcnRzLmdldEFwcGVuZGFibGVUYXNrcyA9IGZ1bmN0aW9uIChmaWxlU2l6ZSwgb2Zmc2V0LCBjaHVua1NpemUpIHtcbiAgICB2YXIgbGVmdFNpemUgPSBmaWxlU2l6ZSAtIG9mZnNldDtcbiAgICB2YXIgdGFza3MgPSBbXTtcblxuICAgIHdoaWxlIChsZWZ0U2l6ZSkge1xuICAgICAgICB2YXIgcGFydFNpemUgPSBNYXRoLm1pbihsZWZ0U2l6ZSwgY2h1bmtTaXplKTtcbiAgICAgICAgdGFza3MucHVzaCh7XG4gICAgICAgICAgICBwYXJ0U2l6ZTogcGFydFNpemUsXG4gICAgICAgICAgICBzdGFydDogb2Zmc2V0LFxuICAgICAgICAgICAgc3RvcDogb2Zmc2V0ICsgcGFydFNpemUgLSAxXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxlZnRTaXplIC09IHBhcnRTaXplO1xuICAgICAgICBvZmZzZXQgKz0gcGFydFNpemU7XG4gICAgfVxuICAgIHJldHVybiB0YXNrcztcbn07XG5cbmV4cG9ydHMucGFyc2VTaXplID0gZnVuY3Rpb24gKHNpemUpIHtcbiAgICBpZiAodHlwZW9mIHNpemUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgIC8vIG1iIE1CIE1iIE1cbiAgICAvLyBrYiBLQiBrYiBrXG4gICAgLy8gMTAwXG4gICAgdmFyIHBhdHRlcm4gPSAvXihbXFxkXFwuXSspKFtta2ddP2I/KSQvaTtcbiAgICB2YXIgbWF0Y2ggPSBwYXR0ZXJuLmV4ZWMoc2l6ZSk7XG4gICAgaWYgKCFtYXRjaCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgJDEgPSBtYXRjaFsxXTtcbiAgICB2YXIgJDIgPSBtYXRjaFsyXTtcbiAgICBpZiAoL15rL2kudGVzdCgkMikpIHtcbiAgICAgICAgcmV0dXJuICQxICogMTAyNDtcbiAgICB9XG4gICAgZWxzZSBpZiAoL15tL2kudGVzdCgkMikpIHtcbiAgICAgICAgcmV0dXJuICQxICogMTAyNCAqIDEwMjQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKC9eZy9pLnRlc3QoJDIpKSB7XG4gICAgICAgIHJldHVybiAkMSAqIDEwMjQgKiAxMDI0ICogMTAyNDtcbiAgICB9XG4gICAgcmV0dXJuICskMTtcbn07XG5cbi8qKlxuICog5Yik5pat5LiA5LiL5rWP6KeI5Zmo5piv5ZCm5pSv5oyBIHhocjIg54m55oCn77yM5aaC5p6c5LiN5pSv5oyB77yM5bCxIGZhbGxiYWNrIOWIsCBQb3N0T2JqZWN0XG4gKiDmnaXkuIrkvKDmlofku7ZcbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnRzLmlzWGhyMlN1cHBvcnRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vTW9kZXJuaXpyL01vZGVybml6ci9ibG9iL2Y4MzllMjU3OWRhMmM2MzMxZWFhZDkyMmFlNWNkNjkxYWFjN2FiNjIvZmVhdHVyZS1kZXRlY3RzL25ldHdvcmsveGhyMi5qc1xuICAgIHJldHVybiAnWE1MSHR0cFJlcXVlc3QnIGluIHdpbmRvdyAmJiAnd2l0aENyZWRlbnRpYWxzJyBpbiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbn07XG5cbmV4cG9ydHMuaXNBcHBlbmRhYmxlID0gZnVuY3Rpb24gKGhlYWRlcnMpIHtcbiAgICByZXR1cm4gaGVhZGVyc1sneC1iY2Utb2JqZWN0LXR5cGUnXSA9PT0gJ0FwcGVuZGFibGUnO1xufTtcblxuZXhwb3J0cy5kZWxheSA9IGZ1bmN0aW9uIChtcykge1xuICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIH0sIG1zKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICog6KeE6IyD5YyW55So5oi355qE6L6T5YWlXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IFRoZSBlbmRwb2ludCB3aWxsIGJlIG5vcm1hbGl6ZWRcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5ub3JtYWxpemVFbmRwb2ludCA9IGZ1bmN0aW9uIChlbmRwb2ludCkge1xuICAgIHJldHVybiBlbmRwb2ludC5yZXBsYWNlKC8oXFwvKykkLywgJycpO1xufTtcblxuZXhwb3J0cy5nZXREZWZhdWx0QUNMID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGFjY2Vzc0NvbnRyb2xMaXN0OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc2VydmljZTogJ2JjZTpib3MnLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJyonLFxuICAgICAgICAgICAgICAgIGVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICByZXNvdXJjZTogW2J1Y2tldCArICcvKiddLFxuICAgICAgICAgICAgICAgIHBlcm1pc3Npb246IFsnUkVBRCcsICdXUklURSddXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9O1xufTtcblxuLyoqXG4gKiDnlJ/miJB1dWlkXG4gKlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLnV1aWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJhbmRvbSA9IChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMiwgMzIpKS50b1N0cmluZygzNik7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHJldHVybiAndS0nICsgdGltZXN0YW1wICsgJy0nICsgcmFuZG9tO1xufTtcblxuLyoqXG4gKiDnlJ/miJDmnKzlnLAgbG9jYWxTdG9yYWdlIOS4reeahGtlee+8jOadpeWtmOWCqCB1cGxvYWRJZFxuICogbG9jYWxTdG9yYWdlW2tleV0gPSB1cGxvYWRJZFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb24g5LiA5Lqb5Y+v5Lul55So5p2l6K6h566Xa2V555qE5Y+C5pWwLlxuICogQHBhcmFtIHtzdHJpbmd9IGdlbmVyYXRvciDlhoXnva7nmoTlj6rmnIkgZGVmYXVsdCDlkowgbWQ1XG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5leHBvcnRzLmdlbmVyYXRlTG9jYWxLZXkgPSBmdW5jdGlvbiAob3B0aW9uLCBnZW5lcmF0b3IpIHtcbiAgICBpZiAoZ2VuZXJhdG9yID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgcmV0dXJuIFEucmVzb2x2ZShbXG4gICAgICAgICAgICBvcHRpb24uYmxvYi5uYW1lLCBvcHRpb24uYmxvYi5zaXplLFxuICAgICAgICAgICAgb3B0aW9uLmNodW5rU2l6ZSwgb3B0aW9uLmJ1Y2tldCxcbiAgICAgICAgICAgIG9wdGlvbi5vYmplY3RcbiAgICAgICAgXS5qb2luKCcmJykpO1xuICAgIH1cbiAgICByZXR1cm4gUS5yZXNvbHZlKG51bGwpO1xufTtcblxuZXhwb3J0cy5nZXREZWZhdWx0UG9saWN5ID0gZnVuY3Rpb24gKGJ1Y2tldCkge1xuICAgIGlmIChidWNrZXQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAvLyDpu5jorqTmmK8gMjTlsI/ml7Yg5LmL5ZCO5Yiw5pyfXG4gICAgdmFyIGV4cGlyYXRpb24gPSBuZXcgRGF0ZShub3cgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICB2YXIgdXRjRGF0ZVRpbWUgPSBoZWxwZXIudG9VVENTdHJpbmcoZXhwaXJhdGlvbik7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBleHBpcmF0aW9uOiB1dGNEYXRlVGltZSxcbiAgICAgICAgY29uZGl0aW9uczogW1xuICAgICAgICAgICAge2J1Y2tldDogYnVja2V0fVxuICAgICAgICBdXG4gICAgfTtcbn07XG5cbi8qKlxuICog5qC55o2ua2V56I635Y+WbG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLmdldFVwbG9hZElkID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xufTtcblxuXG4vKipcbiAqIOagueaNrmtleeiuvue9rmxvY2FsU3RvcmFnZeS4reeahHVwbG9hZElkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSDpnIDopoHmn6Xor6LnmoRrZXlcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cGxvYWRJZCDpnIDopoHorr7nva7nmoR1cGxvYWRJZFxuICovXG5leHBvcnRzLnNldFVwbG9hZElkID0gZnVuY3Rpb24gKGtleSwgdXBsb2FkSWQpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHVwbG9hZElkKTtcbn07XG5cbi8qKlxuICog5qC55o2ua2V55Yig6ZmkbG9jYWxTdG9yYWdl5Lit55qEdXBsb2FkSWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IOmcgOimgeafpeivoueahGtleVxuICovXG5leHBvcnRzLnJlbW92ZVVwbG9hZElkID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG59O1xuXG4vKipcbiAqIOWPluW+l+W3suS4iuS8oOWIhuWdl+eahGV0YWdcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcGFydE51bWJlciDliIbniYfluo/lj7cuXG4gKiBAcGFyYW0ge0FycmF5fSBleGlzdFBhcnRzIOW3suS4iuS8oOWujOaIkOeahOWIhueJh+S/oeaBry5cbiAqIEByZXR1cm4ge3N0cmluZ30g5oyH5a6a5YiG54mH55qEZXRhZ1xuICovXG5mdW5jdGlvbiBnZXRQYXJ0RXRhZyhwYXJ0TnVtYmVyLCBleGlzdFBhcnRzKSB7XG4gICAgdmFyIG1hdGNoUGFydHMgPSB1LmZpbHRlcihleGlzdFBhcnRzIHx8IFtdLCBmdW5jdGlvbiAocGFydCkge1xuICAgICAgICByZXR1cm4gK3BhcnQucGFydE51bWJlciA9PT0gcGFydE51bWJlcjtcbiAgICB9KTtcbiAgICByZXR1cm4gbWF0Y2hQYXJ0cy5sZW5ndGggPyBtYXRjaFBhcnRzWzBdLmVUYWcgOiBudWxsO1xufVxuXG4vKipcbiAqIOWboOS4uiBsaXN0UGFydHMg5Lya6L+U5ZueIHBhcnROdW1iZXIg5ZKMIGV0YWcg55qE5a+55bqU5YWz57O7XG4gKiDmiYDku6UgbGlzdFBhcnRzIOi/lOWbnueahOe7k+aenO+8jOe7mSB0YXNrcyDkuK3lkIjpgILnmoTlhYPntKDorr7nva4gZXRhZyDlsZ7mgKfvvIzkuIrkvKBcbiAqIOeahOaXtuWAmeWwseWPr+S7pei3s+i/h+i/meS6myBwYXJ0XG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gdGFza3Mg5pys5Zyw5YiH5YiG5aW955qE5Lu75YqhLlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pn0gcGFydHMg5pyN5Yqh56uv6L+U5Zue55qE5bey57uP5LiK5Lyg55qEcGFydHMuXG4gKi9cbmV4cG9ydHMuZmlsdGVyVGFza3MgPSBmdW5jdGlvbiAodGFza3MsIHBhcnRzKSB7XG4gICAgdS5lYWNoKHRhc2tzLCBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB2YXIgcGFydE51bWJlciA9IHRhc2sucGFydE51bWJlcjtcbiAgICAgICAgdmFyIGV0YWcgPSBnZXRQYXJ0RXRhZyhwYXJ0TnVtYmVyLCBwYXJ0cyk7XG4gICAgICAgIGlmIChldGFnKSB7XG4gICAgICAgICAgICB0YXNrLmV0YWcgPSBldGFnO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIOaKiueUqOaIt+i+k+WFpeeahOmFjee9rui9rOWMluaIkCBodG1sNSDlkowgZmxhc2gg5Y+v5Lul5o6l5pS255qE5YaF5a65LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfEFycmF5fSBhY2NlcHQg5pSv5oyB5pWw57uE5ZKM5a2X56ym5Liy55qE6YWN572uXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZXhwYW5kQWNjZXB0ID0gZnVuY3Rpb24gKGFjY2VwdCkge1xuICAgIHZhciBleHRzID0gW107XG5cbiAgICBpZiAodS5pc0FycmF5KGFjY2VwdCkpIHtcbiAgICAgICAgLy8gRmxhc2jopoHmsYLnmoTmoLzlvI9cbiAgICAgICAgdS5lYWNoKGFjY2VwdCwgZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpdGVtLmV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBleHRzLnB1c2guYXBwbHkoZXh0cywgaXRlbS5leHRlbnNpb25zLnNwbGl0KCcsJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodS5pc1N0cmluZyhhY2NlcHQpKSB7XG4gICAgICAgIGV4dHMgPSBhY2NlcHQuc3BsaXQoJywnKTtcbiAgICB9XG5cbiAgICAvLyDkuLrkuobkv53or4HlhbzlrrnmgKfvvIzmioogbWltZVR5cGVzIOWSjCBleHRzIOmDvei/lOWbnuWbnuWOu1xuICAgIGV4dHMgPSB1Lm1hcChleHRzLCBmdW5jdGlvbiAoZXh0KSB7XG4gICAgICAgIHJldHVybiAvXlxcLi8udGVzdChleHQpID8gZXh0IDogKCcuJyArIGV4dCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZXh0cy5qb2luKCcsJyk7XG59O1xuXG5leHBvcnRzLmV4dFRvTWltZVR5cGUgPSBmdW5jdGlvbiAoZXh0cykge1xuICAgIHZhciBtaW1lVHlwZXMgPSB1Lm1hcChleHRzLnNwbGl0KCcsJyksIGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgaWYgKGV4dC5pbmRleE9mKCcvJykgIT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNaW1lVHlwZS5ndWVzcyhleHQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1pbWVUeXBlcy5qb2luKCcsJyk7XG59O1xuXG5leHBvcnRzLmV4cGFuZEFjY2VwdFRvQXJyYXkgPSBmdW5jdGlvbiAoYWNjZXB0KSB7XG4gICAgaWYgKCFhY2NlcHQgfHwgdS5pc0FycmF5KGFjY2VwdCkpIHtcbiAgICAgICAgcmV0dXJuIGFjY2VwdDtcbiAgICB9XG5cbiAgICBpZiAodS5pc1N0cmluZyhhY2NlcHQpKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB7dGl0bGU6ICdBbGwgZmlsZXMnLCBleHRlbnNpb25zOiBhY2NlcHR9XG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xufTtcblxuLyoqXG4gKiDovazljJbkuIDkuIsgYm9zIHVybCDnmoTmoLzlvI9cbiAqIGh0dHA6Ly9iai5iY2Vib3MuY29tL3YxLyR7YnVja2V0fS8ke29iamVjdH0gLT4gaHR0cDovLyR7YnVja2V0fS5iai5iY2Vib3MuY29tL3YxLyR7b2JqZWN0fVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwg6ZyA6KaB6L2s5YyW55qEVVJMLlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnRzLnRyYW5zZm9ybVVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICB2YXIgcGF0dGVybiA9IC8oaHR0cHM/OilcXC9cXC8oW15cXC9dKylcXC8oW15cXC9dKylcXC8oW15cXC9dKykvO1xuICAgIHJldHVybiB1cmwucmVwbGFjZShwYXR0ZXJuLCBmdW5jdGlvbiAoXywgcHJvdG9jb2wsIGhvc3QsICQzLCAkNCkge1xuICAgICAgICBpZiAoL152XFxkJC8udGVzdCgkMykpIHtcbiAgICAgICAgICAgIC8vIC92MS8ke2J1Y2tldH0vLi4uXG4gICAgICAgICAgICByZXR1cm4gcHJvdG9jb2wgKyAnLy8nICsgJDQgKyAnLicgKyBob3N0ICsgJy8nICsgJDM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gLyR7YnVja2V0fS8uLi5cbiAgICAgICAgcmV0dXJuIHByb3RvY29sICsgJy8vJyArICQzICsgJy4nICsgaG9zdCArICcvJyArICQ0O1xuICAgIH0pO1xufTtcblxuZXhwb3J0cy5pc0Jsb2IgPSBmdW5jdGlvbiAoYm9keSkge1xuICAgIHZhciBibG9iQ3RvciA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIEJsb2IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIENocm9tZSBCbG9iID09PSAnZnVuY3Rpb24nXG4gICAgICAgIC8vIFNhZmFyaSBCbG9iID09PSAndW5kZWZpbmVkJ1xuICAgICAgICBibG9iQ3RvciA9IEJsb2I7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBtT3hpZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdS5pc0Z1bmN0aW9uKG1PeGllLkJsb2IpKSB7XG4gICAgICAgIGJsb2JDdG9yID0gbU94aWUuQmxvYjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYm9keSBpbnN0YW5jZW9mIGJsb2JDdG9yO1xufTtcblxuZXhwb3J0cy5ub3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xufTtcblxuZXhwb3J0cy50b0RITVMgPSBmdW5jdGlvbiAoc2Vjb25kcykge1xuICAgIHZhciBkYXlzID0gMDtcbiAgICB2YXIgaG91cnMgPSAwO1xuICAgIHZhciBtaW51dGVzID0gMDtcblxuICAgIGlmIChzZWNvbmRzID49IDYwKSB7XG4gICAgICAgIG1pbnV0ZXMgPSB+fihzZWNvbmRzIC8gNjApO1xuICAgICAgICBzZWNvbmRzID0gc2Vjb25kcyAtIG1pbnV0ZXMgKiA2MDtcbiAgICB9XG5cbiAgICBpZiAobWludXRlcyA+PSA2MCkge1xuICAgICAgICBob3VycyA9IH5+KG1pbnV0ZXMgLyA2MCk7XG4gICAgICAgIG1pbnV0ZXMgPSBtaW51dGVzIC0gaG91cnMgKiA2MDtcbiAgICB9XG5cbiAgICBpZiAoaG91cnMgPj0gMjQpIHtcbiAgICAgICAgZGF5cyA9IH5+KGhvdXJzIC8gMjQpO1xuICAgICAgICBob3VycyA9IGhvdXJzIC0gZGF5cyAqIDI0O1xuICAgIH1cblxuICAgIHJldHVybiB7REQ6IGRheXMsIEhIOiBob3VycywgTU06IG1pbnV0ZXMsIFNTOiBzZWNvbmRzfTtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlSG9zdCh1cmwpIHtcbiAgICB2YXIgbWF0Y2ggPSAvXlxcdys6XFwvXFwvKFteXFwvXSspLy5leGVjKHVybCk7XG4gICAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdO1xufVxuXG5leHBvcnRzLmZpeFhociA9IGZ1bmN0aW9uIChvcHRpb25zLCBpc0Jvcykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MsIGNvbmZpZykge1xuICAgICAgICB2YXIgY2xpZW50ID0gdGhpcztcbiAgICAgICAgdmFyIGVuZHBvaW50SG9zdCA9IHBhcnNlSG9zdChjb25maWcuZW5kcG9pbnQpO1xuXG4gICAgICAgIC8vIHgtYmNlLWRhdGUg5ZKMIERhdGUg5LqM6YCJ5LiA77yM5piv5b+F6aG755qEXG4gICAgICAgIC8vIOS9huaYryBGbGFzaCDml6Dms5Xorr7nva4gRGF0Ze+8jOWboOatpOW/hemhu+iuvue9riB4LWJjZS1kYXRlXG4gICAgICAgIGFyZ3MuaGVhZGVyc1sneC1iY2UtZGF0ZSddID0gaGVscGVyLnRvVVRDU3RyaW5nKG5ldyBEYXRlKCkpO1xuICAgICAgICBhcmdzLmhlYWRlcnMuaG9zdCA9IGVuZHBvaW50SG9zdDtcblxuICAgICAgICAvLyBGbGFzaCDnmoTnvJPlrZjosozkvLzmr5TovoPljonlrrPvvIzlvLrliLbor7fmsYLmlrDnmoRcbiAgICAgICAgLy8gWFhYIOWlveWDj+acjeWKoeWZqOerr+S4jeS8muaKiiAuc3RhbXAg6L+Z5Liq5Y+C5pWw5Yqg5YWl5Yiw562+5ZCN55qE6K6h566X6YC76L6R6YeM6Z2i5Y67XG4gICAgICAgIGFyZ3MucGFyYW1zWycuc3RhbXAnXSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgICAgIC8vIOWPquaciSBQVVQg5omN5Lya6Kem5Y+RIHByb2dyZXNzIOS6i+S7tlxuICAgICAgICB2YXIgb3JpZ2luYWxIdHRwTWV0aG9kID0gaHR0cE1ldGhvZDtcblxuICAgICAgICBpZiAoaHR0cE1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgICAgICAgIC8vIFB1dE9iamVjdCBQdXRQYXJ0cyDpg73lj6/ku6XnlKggUE9TVCDljY/orq7vvIzogIzkuJQgRmxhc2gg5Lmf5Y+q6IO955SoIFBPU1Qg5Y2P6K6uXG4gICAgICAgICAgICBodHRwTWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHhoclVyaTtcbiAgICAgICAgdmFyIHhock1ldGhvZCA9IGh0dHBNZXRob2Q7XG4gICAgICAgIHZhciB4aHJCb2R5ID0gYXJncy5ib2R5O1xuICAgICAgICBpZiAoaHR0cE1ldGhvZCA9PT0gJ0hFQUQnKSB7XG4gICAgICAgICAgICAvLyDlm6DkuLogRmxhc2gg55qEIFVSTFJlcXVlc3Qg5Y+q6IO95Y+R6YCBIEdFVCDlkowgUE9TVCDor7fmsYJcbiAgICAgICAgICAgIC8vIGdldE9iamVjdE1ldGHpnIDopoHnlKhIRUFE6K+35rGC77yM5L2G5pivIEZsYXNoIOaXoOazleWPkei1t+i/meenjeivt+axglxuICAgICAgICAgICAgLy8g5omA6ZyA6ZyA6KaB55SoIHJlbGF5IOS4rei9rOS4gOS4i1xuICAgICAgICAgICAgLy8gWFhYIOWboOS4uiBidWNrZXQg5LiN5Y+v6IO95pivIHByaXZhdGXvvIzlkKbliJkgY3Jvc3Nkb21haW4ueG1sIOaYr+aXoOazleivu+WPlueahFxuICAgICAgICAgICAgLy8g5omA5Lul6L+Z5Liq5o6l5Y+j6K+35rGC55qE5pe25YCZ77yM5Y+v5Lul5LiN6ZyA6KaBIGF1dGhvcml6YXRpb24g5a2X5q61XG4gICAgICAgICAgICB2YXIgcmVsYXlTZXJ2ZXIgPSBleHBvcnRzLm5vcm1hbGl6ZUVuZHBvaW50KG9wdGlvbnMuYm9zX3JlbGF5X3NlcnZlcik7XG4gICAgICAgICAgICB4aHJVcmkgPSByZWxheVNlcnZlciArICcvJyArIGVuZHBvaW50SG9zdCArIHJlc291cmNlO1xuXG4gICAgICAgICAgICBhcmdzLnBhcmFtcy5odHRwTWV0aG9kID0gaHR0cE1ldGhvZDtcblxuICAgICAgICAgICAgeGhyTWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzQm9zID09PSB0cnVlKSB7XG4gICAgICAgICAgICB4aHJVcmkgPSBleHBvcnRzLnRyYW5zZm9ybVVybChjb25maWcuZW5kcG9pbnQgKyByZXNvdXJjZSk7XG4gICAgICAgICAgICByZXNvdXJjZSA9IHhoclVyaS5yZXBsYWNlKC9eXFx3KzpcXC9cXC9bXlxcL10rXFwvLywgJy8nKTtcbiAgICAgICAgICAgIGFyZ3MuaGVhZGVycy5ob3N0ID0gcGFyc2VIb3N0KHhoclVyaSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4aHJVcmkgPSBjb25maWcuZW5kcG9pbnQgKyByZXNvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh4aHJNZXRob2QgPT09ICdQT1NUJyAmJiAheGhyQm9keSkge1xuICAgICAgICAgICAgLy8g5b+F6aG76KaB5pyJIEJPRFkg5omN6IO95pivIFBPU1TvvIzlkKbliJnkvaDorr7nva7kuobkuZ/msqHmnIlcbiAgICAgICAgICAgIC8vIOiAjOS4lOW/hemhu+aYryBQT1NUIOaJjeWPr+S7peiuvue9ruiHquWumuS5ieeahGhlYWRlcu+8jEdFVOS4jeihjFxuICAgICAgICAgICAgeGhyQm9keSA9ICd7XCJGT1JDRV9QT1NUXCI6IHRydWV9JztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgICAgICB2YXIgeGhyID0gbmV3IG1PeGllLlhNTEh0dHBSZXF1ZXN0KCk7XG5cbiAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZXNwb25zZSA9IG51bGw7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UgfHwgJ3t9Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSAyMDAgJiYgeGhyLnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIGlmIChodHRwTWV0aG9kID09PSAnSEVBRCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBfaGVhZGVyczoge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBib2R5OiByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZWplY3Qoe1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNfY29kZTogeGhyLnN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogcmVzcG9uc2UubWVzc2FnZSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgY29kZTogcmVzcG9uc2UuY29kZSB8fCAnJyxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdF9pZDogcmVzcG9uc2UucmVxdWVzdElkIHx8ICcnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHhoci51cGxvYWQpIHtcbiAgICAgICAgICAgIC8vIEZJWE1FKOWIhueJh+S4iuS8oOeahOmAu+i+keWSjHh4eOeahOmAu+i+keS4jeS4gOagtylcbiAgICAgICAgICAgIHhoci51cGxvYWQub25wcm9ncmVzcyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9yaWdpbmFsSHR0cE1ldGhvZCA9PT0gJ1BVVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUE9TVCwgSEVBRCwgR0VUIOS5i+exu+eahOS4jemcgOimgeinpuWPkSBwcm9ncmVzcyDkuovku7ZcbiAgICAgICAgICAgICAgICAgICAgLy8g5ZCm5YiZ5a+86Ie06aG16Z2i55qE6YC76L6R5re35LmxXG4gICAgICAgICAgICAgICAgICAgIGUubGVuZ3RoQ29tcHV0YWJsZSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGh0dHBDb250ZXh0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cE1ldGhvZDogb3JpZ2luYWxIdHRwTWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2U6IHJlc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyOiB4aHJcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW1pdCgncHJvZ3Jlc3MnLCBlLCBodHRwQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9taXNlID0gY2xpZW50LmNyZWF0ZVNpZ25hdHVyZShjbGllbnQuY29uZmlnLmNyZWRlbnRpYWxzLFxuICAgICAgICAgICAgaHR0cE1ldGhvZCwgcmVzb3VyY2UsIGFyZ3MucGFyYW1zLCBhcmdzLmhlYWRlcnMpO1xuICAgICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKGF1dGhvcml6YXRpb24sIHhiY2VEYXRlKSB7XG4gICAgICAgICAgICBpZiAoYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgICAgIGFyZ3MuaGVhZGVycy5hdXRob3JpemF0aW9uID0gYXV0aG9yaXphdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHhiY2VEYXRlKSB7XG4gICAgICAgICAgICAgICAgYXJncy5oZWFkZXJzWyd4LWJjZS1kYXRlJ10gPSB4YmNlRGF0ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHFzID0gcXNNb2R1bGUuc3RyaW5naWZ5KGFyZ3MucGFyYW1zKTtcbiAgICAgICAgICAgIGlmIChxcykge1xuICAgICAgICAgICAgICAgIHhoclVyaSArPSAnPycgKyBxcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLm9wZW4oeGhyTWV0aG9kLCB4aHJVcmksIHRydWUpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXJncy5oZWFkZXJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhcmdzLmhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICAgICAgICAgICAgICB8fCAvKGhvc3R8Y29udGVudFxcLWxlbmd0aCkvaS50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3MuaGVhZGVyc1trZXldO1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4aHIuc2VuZCh4aHJCb2R5LCB7XG4gICAgICAgICAgICAgICAgcnVudGltZV9vcmRlcjogJ2ZsYXNoJyxcbiAgICAgICAgICAgICAgICBzd2ZfdXJsOiBvcHRpb25zLmZsYXNoX3N3Zl91cmxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVtcbiAgICAgICAgXCJjYXRjaFwiXShmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH07XG59O1xuXG5cbmV4cG9ydHMuZWFjaExpbWl0ID0gZnVuY3Rpb24gKHRhc2tzLCB0YXNrUGFyYWxsZWwsIGV4ZWN1dGVyLCBkb25lKSB7XG4gICAgdmFyIHJ1bm5pbmdDb3VudCA9IDA7XG4gICAgdmFyIGFib3J0ZWQgPSBmYWxzZTtcbiAgICB2YXIgZmluID0gZmFsc2U7ICAgICAgLy8gZG9uZSDlj6rog73ooqvosIPnlKjkuIDmrKEuXG4gICAgdmFyIHF1ZXVlID0gbmV3IFF1ZXVlKHRhc2tzKTtcblxuICAgIGZ1bmN0aW9uIGluZmluaXRlTG9vcCgpIHtcbiAgICAgICAgdmFyIHRhc2sgPSBxdWV1ZS5kZXF1ZXVlKCk7XG4gICAgICAgIGlmICghdGFzaykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcnVubmluZ0NvdW50Kys7XG4gICAgICAgIGV4ZWN1dGVyKHRhc2ssIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgcnVubmluZ0NvdW50LS07XG5cbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIOS4gOaXpuacieaKpemUme+8jOe7iOatoui/kOihjFxuICAgICAgICAgICAgICAgIGFib3J0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgZG9uZShlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIXF1ZXVlLmlzRW1wdHkoKSAmJiAhYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDpmJ/liJfov5jmnInlhoXlrrlcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChpbmZpbml0ZUxvb3AsIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChydW5uaW5nQ291bnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDpmJ/liJfnqbrkuobvvIzogIzkuJTmsqHmnInov5DooYzkuK3nmoTku7vliqHkuoZcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRhc2tQYXJhbGxlbCA9IE1hdGgubWluKHRhc2tQYXJhbGxlbCwgcXVldWUuc2l6ZSgpKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhc2tQYXJhbGxlbDsgaSsrKSB7XG4gICAgICAgIGluZmluaXRlTG9vcCgpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuaW5oZXJpdHMgPSBmdW5jdGlvbiAoQ2hpbGRDdG9yLCBQYXJlbnRDdG9yKSB7XG4gICAgcmV0dXJuIHJlcXVpcmUoNDcpLmluaGVyaXRzKENoaWxkQ3RvciwgUGFyZW50Q3Rvcik7XG59O1xuXG5leHBvcnRzLmd1ZXNzQ29udGVudFR5cGUgPSBmdW5jdGlvbiAoZmlsZSwgb3B0X2lnbm9yZUNoYXJzZXQpIHtcbiAgICB2YXIgY29udGVudFR5cGUgPSBmaWxlLnR5cGU7XG4gICAgaWYgKCFjb250ZW50VHlwZSkge1xuICAgICAgICB2YXIgb2JqZWN0ID0gZmlsZS5uYW1lO1xuICAgICAgICB2YXIgZXh0ID0gb2JqZWN0LnNwbGl0KC9cXC4vZykucG9wKCk7XG4gICAgICAgIGNvbnRlbnRUeXBlID0gTWltZVR5cGUuZ3Vlc3MoZXh0KTtcbiAgICB9XG5cbiAgICAvLyBGaXJlZm945ZyoUE9TVOeahOaXtuWAme+8jENvbnRlbnQtVHlwZSDkuIDlrprkvJrmnIlDaGFyc2V055qE77yM5Zug5q2kXG4gICAgLy8g6L+Z6YeM5LiN566hMzcyMe+8jOmDveWKoOS4ii5cbiAgICBpZiAoIW9wdF9pZ25vcmVDaGFyc2V0ICYmICEvY2hhcnNldD0vLnRlc3QoY29udGVudFR5cGUpKSB7XG4gICAgICAgIGNvbnRlbnRUeXBlICs9ICc7IGNoYXJzZXQ9VVRGLTgnO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZW50VHlwZTtcbn07XG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9CdWZmZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbi8qKlxuICogQnVmZmVyXG4gKlxuICogQGNsYXNzXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlcigpIHtcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTUxNTg2OS9zdHJpbmctbGVuZ3RoLWluLWJ5dGVzLWluLWphdmFzY3JpcHRcbiAgICB2YXIgbSA9IGVuY29kZVVSSUNvbXBvbmVudChkYXRhKS5tYXRjaCgvJVs4OUFCYWJdL2cpO1xuICAgIHJldHVybiBkYXRhLmxlbmd0aCArIChtID8gbS5sZW5ndGggOiAwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQnVmZmVyO1xuXG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIFByb21pc2UuanNcbiAqIEBhdXRob3IgPz9cbiAqL1xuXG4oZnVuY3Rpb24gKHJvb3QpIHtcblxuICAgIC8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4gICAgLy8gb3RoZXIgY29kZSBtb2RpZnlpbmcgc2V0VGltZW91dCAobGlrZSBzaW5vbi51c2VGYWtlVGltZXJzKCkpXG4gICAgdmFyIHNldFRpbWVvdXRGdW5jID0gc2V0VGltZW91dDtcblxuICAgIGZ1bmN0aW9uIG5vb3AoKSB7XG4gICAgfVxuXG4gICAgLy8gUG9seWZpbGwgZm9yIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXG4gICAgZnVuY3Rpb24gYmluZChmbiwgdGhpc0FyZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZm4uYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9taXNlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZXhlY3V0b3IuXG4gICAgICogQGNsYXNzXG4gICAgICovXG4gICAgZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm9taXNlcyBtdXN0IGJlIGNvbnN0cnVjdGVkIHZpYSBuZXcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zdGF0ZSA9IDA7XG4gICAgICAgIHRoaXMuX2hhbmRsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2RlZmVycmVkcyA9IFtdO1xuXG4gICAgICAgIGRvUmVzb2x2ZShmbiwgdGhpcyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlKHNlbGYsIGRlZmVycmVkKSB7XG4gICAgICAgIHdoaWxlIChzZWxmLl9zdGF0ZSA9PT0gMykge1xuICAgICAgICAgICAgc2VsZiA9IHNlbGYuX3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuICAgICAgICAgICAgc2VsZi5fZGVmZXJyZWRzLnB1c2goZGVmZXJyZWQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5faGFuZGxlZCA9IHRydWU7XG4gICAgICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjYiA9IHNlbGYuX3N0YXRlID09PSAxID8gZGVmZXJyZWQub25GdWxmaWxsZWQgOiBkZWZlcnJlZC5vblJlamVjdGVkO1xuICAgICAgICAgICAgaWYgKGNiID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgKHNlbGYuX3N0YXRlID09PSAxID8gcmVzb2x2ZSA6IHJlamVjdCkoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJldDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gY2Ioc2VsZi5fdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZGVmZXJyZWQucHJvbWlzZSwgZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVzb2x2ZShkZWZlcnJlZC5wcm9taXNlLCByZXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBQcm9taXNlIFJlc29sdXRpb24gUHJvY2VkdXJlOiBodHRwczovL2dpdGh1Yi5jb20vcHJvbWlzZXMtYXBsdXMvcHJvbWlzZXMtc3BlYyN0aGUtcHJvbWlzZS1yZXNvbHV0aW9uLXByb2NlZHVyZVxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSBzZWxmKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBwcm9taXNlIGNhbm5vdCBiZSByZXNvbHZlZCB3aXRoIGl0c2VsZi4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICYmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhlbiA9IG5ld1ZhbHVlLnRoZW47XG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLl9zdGF0ZSA9IDM7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsZShzZWxmKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBkb1Jlc29sdmUoYmluZCh0aGVuLCBuZXdWYWx1ZSksIHNlbGYpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLl9zdGF0ZSA9IDE7XG4gICAgICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZWplY3Qoc2VsZiwgZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWplY3Qoc2VsZiwgbmV3VmFsdWUpIHtcbiAgICAgICAgc2VsZi5fc3RhdGUgPSAyO1xuICAgICAgICBzZWxmLl92YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBmaW5hbGUoc2VsZik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluYWxlKHNlbGYpIHtcbiAgICAgICAgaWYgKHNlbGYuX3N0YXRlID09PSAyICYmIHNlbGYuX2RlZmVycmVkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuX2hhbmRsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4oc2VsZi5fdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBoYW5kbGUoc2VsZiwgc2VsZi5fZGVmZXJyZWRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLl9kZWZlcnJlZHMgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXJcbiAgICAgKlxuICAgICAqIEBjbGFzc1xuICAgICAqIEBwYXJhbSB7Kn0gb25GdWxmaWxsZWQgVGhlIG9uRnVsZmlsbGVkLlxuICAgICAqIEBwYXJhbSB7Kn0gb25SZWplY3RlZCBUaGUgb25SZWplY3RlZC5cbiAgICAgKiBAcGFyYW0geyp9IHByb21pc2UgVGhlIHByb21pc2UuXG4gICAgICovXG4gICAgZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSkge1xuICAgICAgICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICAgICAgICB0aGlzLm9uUmVqZWN0ZWQgPSB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICAgICAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRha2UgYSBwb3RlbnRpYWxseSBtaXNiZWhhdmluZyByZXNvbHZlciBmdW5jdGlvbiBhbmQgbWFrZSBzdXJlXG4gICAgICogb25GdWxmaWxsZWQgYW5kIG9uUmVqZWN0ZWQgYXJlIG9ubHkgY2FsbGVkIG9uY2UuXG4gICAgICpcbiAgICAgKiBNYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IGFzeW5jaHJvbnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZm4uXG4gICAgICogQHBhcmFtIHsqfSBzZWxmIFRoZSBjb250ZXh0LlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGRvUmVzb2x2ZShmbiwgc2VsZikge1xuICAgICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoc2VsZiwgdmFsdWUpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICAgICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZWplY3Qoc2VsZiwgcmVhc29uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgICAgICAgcmVqZWN0KHNlbGYsIGV4KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIFByb21pc2UucHJvdG90eXBlW1wiY2F0Y2hcIl0gPSBmdW5jdGlvbiAob25SZWplY3RlZCkgeyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgcmV0dXJuIHRoaXMudGhlbihudWxsLCBvblJlamVjdGVkKTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkgeyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgdmFyIHByb20gPSBuZXcgKHRoaXMuY29uc3RydWN0b3IpKG5vb3ApO1xuXG4gICAgICAgIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICAgICAgICByZXR1cm4gcHJvbTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5hbGwgPSBmdW5jdGlvbiAoYXJyKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJyKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gYXJncy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlcyhpLCB2YWwpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsICYmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoZW4gPSB2YWwudGhlbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW4uY2FsbCh2YWwsIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzKGksIHZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGV4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHJlcyhpLCBhcmdzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFByb21pc2UucmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFByb21pc2UucmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICByZWplY3QodmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZhbHVlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgIHZhbHVlc1tpXS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBVc2UgcG9seWZpbGwgZm9yIHNldEltbWVkaWF0ZSBmb3IgcGVyZm9ybWFuY2UgZ2FpbnNcbiAgICBQcm9taXNlLl9pbW1lZGlhdGVGbiA9ICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nICYmIGZ1bmN0aW9uIChmbikge1xuICAgICAgICBzZXRJbW1lZGlhdGUoZm4pO1xuICAgIH0pIHx8IGZ1bmN0aW9uIChmbikge1xuICAgICAgICBzZXRUaW1lb3V0RnVuYyhmbiwgMCk7XG4gICAgfTtcblxuICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3VuaGFuZGxlZFJlamVjdGlvbkZuKGVycikge1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBpbW1lZGlhdGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBjYWxsYmFja3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEZ1bmN0aW9uIHRvIGV4ZWN1dGVcbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIFByb21pc2UuX3NldEltbWVkaWF0ZUZuID0gZnVuY3Rpb24gX3NldEltbWVkaWF0ZUZuKGZuKSB7XG4gICAgICAgIFByb21pc2UuX2ltbWVkaWF0ZUZuID0gZm47XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBvbiB1bmhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiB0byBleGVjdXRlIG9uIHVuaGFuZGxlZCByZWplY3Rpb25cbiAgICAgKiBAZGVwcmVjYXRlZFxuICAgICAqL1xuICAgIFByb21pc2UuX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuID0gZnVuY3Rpb24gX3NldFVuaGFuZGxlZFJlamVjdGlvbkZuKGZuKSB7XG4gICAgICAgIFByb21pc2UuX3VuaGFuZGxlZFJlamVjdGlvbkZuID0gZm47XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFyb290LlByb21pc2UpIHtcbiAgICAgICAgcm9vdC5Qcm9taXNlID0gUHJvbWlzZTtcbiAgICB9XG5cbn0pKHRoaXMpO1xuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvYXN5bmMuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbmV4cG9ydHMubWFwTGltaXQgPSByZXF1aXJlKDIpO1xuIiwiLyoqXG4gKiBAZmlsZSBjb3JlLmpzXG4gKiBAYXV0aG9yID8/P1xuICovXG5cbi8qKlxuICogTG9jYWwgcG9seWZpbCBvZiBPYmplY3QuY3JlYXRlXG4gKi9cbnZhciBjcmVhdGUgPSBPYmplY3QuY3JlYXRlIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRigpIHsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBzdWJ0eXBlO1xuXG4gICAgICAgIEYucHJvdG90eXBlID0gb2JqO1xuXG4gICAgICAgIHN1YnR5cGUgPSBuZXcgRigpO1xuXG4gICAgICAgIEYucHJvdG90eXBlID0gbnVsbDtcblxuICAgICAgICByZXR1cm4gc3VidHlwZTtcbiAgICB9O1xufSgpKTtcblxuLyoqXG4gKiBDcnlwdG9KUyBuYW1lc3BhY2UuXG4gKi9cbnZhciBDID0ge307XG5cbi8qKlxuICogQWxnb3JpdGhtIG5hbWVzcGFjZS5cbiAqL1xudmFyIENfYWxnbyA9IEMuYWxnbyA9IHt9O1xuXG4vKipcbiAqIExpYnJhcnkgbmFtZXNwYWNlLlxuICovXG52YXIgQ19saWIgPSBDLmxpYiA9IHt9O1xuXG4vKipcbiAgKiBCYXNlIG9iamVjdCBmb3IgcHJvdG90eXBhbCBpbmhlcml0YW5jZS5cbiAgKi9cbnZhciBCYXNlID0gQ19saWIuQmFzZSA9IChmdW5jdGlvbiAoKSB7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoaXMgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvdmVycmlkZXMgUHJvcGVydGllcyB0byBjb3B5IGludG8gdGhlIG5ldyBvYmplY3QuXG4gICAgICAgICAgKlxuICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICAgKlxuICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgdmFyIE15VHlwZSA9IENyeXB0b0pTLmxpYi5CYXNlLmV4dGVuZCh7XG4gICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnLFxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICAgICAgbWV0aG9kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgKiAgICAgICAgIH1cbiAgICAgICAgICAqICAgICB9KTtcbiAgICAgICAgICAqL1xuICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uIChvdmVycmlkZXMpIHtcbiAgICAgICAgICAgIC8vIFNwYXduXG4gICAgICAgICAgICB2YXIgc3VidHlwZSA9IGNyZWF0ZSh0aGlzKTtcblxuICAgICAgICAgICAgLy8gQXVnbWVudFxuICAgICAgICAgICAgaWYgKG92ZXJyaWRlcykge1xuICAgICAgICAgICAgICAgIHN1YnR5cGUubWl4SW4ob3ZlcnJpZGVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGRlZmF1bHQgaW5pdGlhbGl6ZXJcbiAgICAgICAgICAgIGlmICghc3VidHlwZS5oYXNPd25Qcm9wZXJ0eSgnaW5pdCcpIHx8IHRoaXMuaW5pdCA9PT0gc3VidHlwZS5pbml0KSB7XG4gICAgICAgICAgICAgICAgc3VidHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLiRzdXBlci5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZXIncyBwcm90b3R5cGUgaXMgdGhlIHN1YnR5cGUgb2JqZWN0XG4gICAgICAgICAgICBzdWJ0eXBlLmluaXQucHJvdG90eXBlID0gc3VidHlwZTtcblxuICAgICAgICAgICAgLy8gUmVmZXJlbmNlIHN1cGVydHlwZVxuICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIgPSB0aGlzO1xuXG4gICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICAqIEV4dGVuZHMgdGhpcyBvYmplY3QgYW5kIHJ1bnMgdGhlIGluaXQgbWV0aG9kLlxuICAgICAgICAgICogQXJndW1lbnRzIHRvIGNyZWF0ZSgpIHdpbGwgYmUgcGFzc2VkIHRvIGluaXQoKS5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgICpcbiAgICAgICAgICAqICAgICB2YXIgaW5zdGFuY2UgPSBNeVR5cGUuY3JlYXRlKCk7XG4gICAgICAgICAgKi9cbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmV4dGVuZCgpO1xuICAgICAgICAgICAgaW5zdGFuY2UuaW5pdC5hcHBseShpbnN0YW5jZSwgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIG9iamVjdC5cbiAgICAgICAgICAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGFkZCBzb21lIGxvZ2ljIHdoZW4geW91ciBvYmplY3RzIGFyZSBjcmVhdGVkLlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgIHZhciBNeVR5cGUgPSBDcnlwdG9KUy5saWIuQmFzZS5leHRlbmQoe1xuICAgICAgICAgICogICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgKiAgICAgICAgICAgICAvLyAuLi5cbiAgICAgICAgICAqICAgICAgICAgfVxuICAgICAgICAgICogICAgIH0pO1xuICAgICAgICAgICovXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHt9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgICogQ29waWVzIHByb3BlcnRpZXMgaW50byB0aGlzIG9iamVjdC5cbiAgICAgICAgICAqXG4gICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllcyBUaGUgcHJvcGVydGllcyB0byBtaXggaW4uXG4gICAgICAgICAgKlxuICAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICAqXG4gICAgICAgICAgKiAgICAgTXlUeXBlLm1peEluKHtcbiAgICAgICAgICAqICAgICAgICAgZmllbGQ6ICd2YWx1ZSdcbiAgICAgICAgICAqICAgICB9KTtcbiAgICAgICAgICAqL1xuICAgICAgICBtaXhJbjogZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElFIHdvbid0IGNvcHkgdG9TdHJpbmcgdXNpbmcgdGhlIGxvb3AgYWJvdmVcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b1N0cmluZyA9IHByb3BlcnRpZXMudG9TdHJpbmc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNsb25lLlxuICAgICAgICAgICpcbiAgICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAgKlxuICAgICAgICAgICogICAgIHZhciBjbG9uZSA9IGluc3RhbmNlLmNsb25lKCk7XG4gICAgICAgICAgKi9cbiAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmluaXQucHJvdG90eXBlLmV4dGVuZCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH07XG59KCkpO1xuXG4vKipcbiAgKiBBbiBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG4gICpcbiAgKiBAcHJvcGVydHkge0FycmF5fSB3b3JkcyBUaGUgYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaWdCeXRlcyBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoaXMgd29yZCBhcnJheS5cbiAgKi9cbnZhciBXb3JkQXJyYXkgPSBDX2xpYi5Xb3JkQXJyYXkgPSBCYXNlLmV4dGVuZCh7XG5cbiAgICAvKipcbiAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIHdvcmQgYXJyYXkuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7QXJyYXl9IHdvcmRzIChPcHRpb25hbCkgQW4gYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2lnQnl0ZXMgKE9wdGlvbmFsKSBUaGUgbnVtYmVyIG9mIHNpZ25pZmljYW50IGJ5dGVzIGluIHRoZSB3b3Jkcy5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZSgpO1xuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKFsweDAwMDEwMjAzLCAweDA0MDUwNjA3XSk7XG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddLCA2KTtcbiAgICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKHdvcmRzLCBzaWdCeXRlcykge1xuICAgICAgICB3b3JkcyA9IHRoaXMud29yZHMgPSB3b3JkcyB8fCBbXTtcblxuICAgICAgICBpZiAoc2lnQnl0ZXMgIT0gdW5kZWZpbmVkKSB7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSBzaWdCeXRlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2lnQnl0ZXMgPSB3b3Jkcy5sZW5ndGggKiA0O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyB0aGlzIHdvcmQgYXJyYXkgdG8gYSBzdHJpbmcuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7RW5jb2Rlcn0gZW5jb2RlciAoT3B0aW9uYWwpIFRoZSBlbmNvZGluZyBzdHJhdGVneSB0byB1c2UuIERlZmF1bHQ6IENyeXB0b0pTLmVuYy5IZXhcbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgc3RyaW5naWZpZWQgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkgKyAnJztcbiAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkudG9TdHJpbmcoKTtcbiAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkudG9TdHJpbmcoQ3J5cHRvSlMuZW5jLlV0ZjgpO1xuICAgICAgKi9cbiAgICB0b1N0cmluZzogZnVuY3Rpb24gKGVuY29kZXIpIHtcbiAgICAgICAgcmV0dXJuIChlbmNvZGVyIHx8IEhleCkuc3RyaW5naWZ5KHRoaXMpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb25jYXRlbmF0ZXMgYSB3b3JkIGFycmF5IHRvIHRoaXMgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheSB0byBhcHBlbmQuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhpcyB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgd29yZEFycmF5MS5jb25jYXQod29yZEFycmF5Mik7XG4gICAgICAqL1xuICAgIGNvbmNhdDogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIHRoaXNXb3JkcyA9IHRoaXMud29yZHM7XG4gICAgICAgIHZhciB0aGF0V29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG4gICAgICAgIHZhciB0aGlzU2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuICAgICAgICB2YXIgdGhhdFNpZ0J5dGVzID0gd29yZEFycmF5LnNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG4gICAgICAgIHRoaXMuY2xhbXAoKTtcblxuXG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIC8vIENvbmNhdFxuICAgICAgICBpZiAodGhpc1NpZ0J5dGVzICUgNCkge1xuICAgICAgICAgICAgLy8gQ29weSBvbmUgYnl0ZSBhdCBhIHRpbWVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB0aGF0Qnl0ZSA9ICh0aGF0V29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdIHw9IHRoYXRCeXRlIDw8ICgyNCAtICgodGhpc1NpZ0J5dGVzICsgaSkgJSA0KSAqIDgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29weSBvbmUgd29yZCBhdCBhIHRpbWVcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkgKz0gNCkge1xuICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdID0gdGhhdFdvcmRzW2kgPj4+IDJdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2lnQnl0ZXMgKz0gdGhhdFNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENoYWluYWJsZVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIFJlbW92ZXMgaW5zaWduaWZpY2FudCBiaXRzLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgd29yZEFycmF5LmNsYW1wKCk7XG4gICAgICAqL1xuICAgIGNsYW1wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgd29yZHMgPSB0aGlzLndvcmRzO1xuICAgICAgICB2YXIgc2lnQnl0ZXMgPSB0aGlzLnNpZ0J5dGVzO1xuXG4gICAgICAgIC8vIENsYW1wXG4gICAgICAgIHdvcmRzW3NpZ0J5dGVzID4+PiAyXSAmPSAweGZmZmZmZmZmIDw8ICgzMiAtIChzaWdCeXRlcyAlIDQpICogOCk7XG4gICAgICAgIHdvcmRzLmxlbmd0aCA9IE1hdGguY2VpbChzaWdCeXRlcyAvIDQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBjbG9uZS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBjbG9uZSA9IHdvcmRBcnJheS5jbG9uZSgpO1xuICAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2xvbmUgPSBCYXNlLmNsb25lLmNhbGwodGhpcyk7XG4gICAgICAgIGNsb25lLndvcmRzID0gdGhpcy53b3Jkcy5zbGljZSgwKTtcblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGEgd29yZCBhcnJheSBmaWxsZWQgd2l0aCByYW5kb20gYnl0ZXMuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuQnl0ZXMgVGhlIG51bWJlciBvZiByYW5kb20gYnl0ZXMgdG8gZ2VuZXJhdGUuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHJhbmRvbSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5yYW5kb20oMTYpO1xuICAgICAgKi9cbiAgICByYW5kb206IGZ1bmN0aW9uIChuQnl0ZXMpIHtcbiAgICAgICAgdmFyIHdvcmRzID0gW107XG5cbiAgICAgICAgdmFyIHIgPSBmdW5jdGlvbiAobV93KSB7XG4gICAgICAgICAgICB2YXIgbV96ID0gMHgzYWRlNjhiMTtcbiAgICAgICAgICAgIHZhciBtYXNrID0gMHhmZmZmZmZmZjtcblxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtX3ogPSAoMHg5MDY5ICogKG1feiAmIDB4RkZGRikgKyAobV96ID4+IDB4MTApKSAmIG1hc2s7XG4gICAgICAgICAgICAgICAgbV93ID0gKDB4NDY1MCAqIChtX3cgJiAweEZGRkYpICsgKG1fdyA+PiAweDEwKSkgJiBtYXNrO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSAoKG1feiA8PCAweDEwKSArIG1fdykgJiBtYXNrO1xuICAgICAgICAgICAgICAgIHJlc3VsdCAvPSAweDEwMDAwMDAwMDtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gMC41O1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgKiAoTWF0aC5yYW5kb20oKSA+IC41ID8gMSA6IC0xKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHJjYWNoZTsgaSA8IG5CeXRlczsgaSArPSA0KSB7XG4gICAgICAgICAgICB2YXIgX3IgPSByKChyY2FjaGUgfHwgTWF0aC5yYW5kb20oKSkgKiAweDEwMDAwMDAwMCk7XG5cbiAgICAgICAgICAgIHJjYWNoZSA9IF9yKCkgKiAweDNhZGU2N2I3O1xuICAgICAgICAgICAgd29yZHMucHVzaCgoX3IoKSAqIDB4MTAwMDAwMDAwKSB8IDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbkJ5dGVzKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbn0pO1xuXG4vKipcbiAgKiBFbmNvZGVyIG5hbWVzcGFjZS5cbiAgKi9cbnZhciBDX2VuYyA9IEMuZW5jID0ge307XG5cbi8qKlxuICAqIEhleCBlbmNvZGluZyBzdHJhdGVneS5cbiAgKi9cbnZhciBIZXggPSBDX2VuYy5IZXggPSB7XG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgaGV4IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgaGV4IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGhleFN0cmluZyA9IENyeXB0b0pTLmVuYy5IZXguc3RyaW5naWZ5KHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIHdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuICAgICAgICB2YXIgc2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cbiAgICAgICAgLy8gQ29udmVydFxuICAgICAgICB2YXIgaGV4Q2hhcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWdCeXRlczsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYml0ZSA9ICh3b3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG4gICAgICAgICAgICBoZXhDaGFycy5wdXNoKChiaXRlID4+PiA0KS50b1N0cmluZygxNikpO1xuICAgICAgICAgICAgaGV4Q2hhcnMucHVzaCgoYml0ZSAmIDB4MGYpLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaGV4Q2hhcnMuam9pbignJyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDb252ZXJ0cyBhIGhleCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gaGV4U3RyIFRoZSBoZXggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSB3b3JkIGFycmF5LlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMuZW5jLkhleC5wYXJzZShoZXhTdHJpbmcpO1xuICAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24gKGhleFN0cikge1xuICAgICAgICAvLyBTaG9ydGN1dFxuICAgICAgICB2YXIgaGV4U3RyTGVuZ3RoID0gaGV4U3RyLmxlbmd0aDtcblxuICAgICAgICAvLyBDb252ZXJ0XG4gICAgICAgIHZhciB3b3JkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGhleFN0ckxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgICAgICB3b3Jkc1tpID4+PiAzXSB8PSBwYXJzZUludChoZXhTdHIuc3Vic3RyKGksIDIpLCAxNikgPDwgKDI0IC0gKGkgJSA4KSAqIDQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgaGV4U3RyTGVuZ3RoIC8gMik7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbn07XG5cbi8qKlxuICAqIExhdGluMSBlbmNvZGluZyBzdHJhdGVneS5cbiAgKi9cbnZhciBMYXRpbjEgPSBDX2VuYy5MYXRpbjEgPSB7XG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgTGF0aW4xIHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgTGF0aW4xIHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGxhdGluMVN0cmluZyA9IENyeXB0b0pTLmVuYy5MYXRpbjEuc3RyaW5naWZ5KHdvcmRBcnJheSk7XG4gICAgICAqL1xuICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIHdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuICAgICAgICB2YXIgc2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cbiAgICAgICAgLy8gQ29udmVydFxuICAgICAgICB2YXIgbGF0aW4xQ2hhcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWdCeXRlczsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYml0ZSA9ICh3b3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG4gICAgICAgICAgICBsYXRpbjFDaGFycy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYml0ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxhdGluMUNoYXJzLmpvaW4oJycpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ29udmVydHMgYSBMYXRpbjEgc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGluMVN0ciBUaGUgTGF0aW4xIHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5MYXRpbjEucGFyc2UobGF0aW4xU3RyaW5nKTtcbiAgICAgICovXG4gICAgcGFyc2U6IGZ1bmN0aW9uIChsYXRpbjFTdHIpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRcbiAgICAgICAgdmFyIGxhdGluMVN0ckxlbmd0aCA9IGxhdGluMVN0ci5sZW5ndGg7XG5cbiAgICAgICAgLy8gQ29udmVydFxuICAgICAgICB2YXIgd29yZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRpbjFTdHJMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgd29yZHNbaSA+Pj4gMl0gfD0gKGxhdGluMVN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZikgPDwgKDI0IC0gKGkgJSA0KSAqIDgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbGF0aW4xU3RyTGVuZ3RoKTsgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbn07XG5cbi8qKlxuICAqIFVURi04IGVuY29kaW5nIHN0cmF0ZWd5LlxuICAqL1xudmFyIFV0ZjggPSBDX2VuYy5VdGY4ID0ge1xuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIFVURi04IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgVVRGLTggc3RyaW5nLlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgdXRmOFN0cmluZyA9IENyeXB0b0pTLmVuYy5VdGY4LnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKExhdGluMS5zdHJpbmdpZnkod29yZEFycmF5KSkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hbGZvcm1lZCBVVEYtOCBkYXRhJyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIENvbnZlcnRzIGEgVVRGLTggc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IHV0ZjhTdHIgVGhlIFVURi04IHN0cmluZy5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgd29yZCBhcnJheS5cbiAgICAgICpcbiAgICAgICogQHN0YXRpY1xuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmVuYy5VdGY4LnBhcnNlKHV0ZjhTdHJpbmcpO1xuICAgICAgKi9cbiAgICBwYXJzZTogZnVuY3Rpb24gKHV0ZjhTdHIpIHtcbiAgICAgICAgcmV0dXJuIExhdGluMS5wYXJzZSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQodXRmOFN0cikpKTtcbiAgICB9XG59O1xuXG4vKipcbiAgKiBBYnN0cmFjdCBidWZmZXJlZCBibG9jayBhbGdvcml0aG0gdGVtcGxhdGUuXG4gICpcbiAgKiBUaGUgcHJvcGVydHkgYmxvY2tTaXplIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gYSBjb25jcmV0ZSBzdWJ0eXBlLlxuICAqXG4gICogQHByb3BlcnR5IHtudW1iZXJ9IF9taW5CdWZmZXJTaXplIFRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgc2hvdWxkIGJlIGtlcHQgdW5wcm9jZXNzZWQgaW4gdGhlIGJ1ZmZlci4gRGVmYXVsdDogMFxuICAqL1xudmFyIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBDX2xpYi5CdWZmZXJlZEJsb2NrQWxnb3JpdGhtID0gQmFzZS5leHRlbmQoe1xuXG4gICAgLyoqXG4gICAgICAqIFJlc2V0cyB0aGlzIGJsb2NrIGFsZ29yaXRobSdzIGRhdGEgYnVmZmVyIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5yZXNldCgpO1xuICAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBJbml0aWFsIHZhbHVlc1xuICAgICAgICB0aGlzLl9kYXRhID0gbmV3IFdvcmRBcnJheS5pbml0KCk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgdGhpcy5fbkRhdGFCeXRlcyA9IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBBZGRzIG5ldyBkYXRhIHRvIHRoaXMgYmxvY2sgYWxnb3JpdGhtJ3MgYnVmZmVyLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYXBwZW5kLiBTdHJpbmdzIGFyZSBjb252ZXJ0ZWQgdG8gYSBXb3JkQXJyYXkgdXNpbmcgVVRGLTguXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLl9hcHBlbmQoJ2RhdGEnKTtcbiAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX2FwcGVuZCh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBfYXBwZW5kOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAvLyBDb252ZXJ0IHN0cmluZyB0byBXb3JkQXJyYXksIGVsc2UgYXNzdW1lIFdvcmRBcnJheSBhbHJlYWR5XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGRhdGEgPSBVdGY4LnBhcnNlKGRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwZW5kXG4gICAgICAgIHRoaXMuX2RhdGEuY29uY2F0KGRhdGEpO1xuICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzICs9IGRhdGEuc2lnQnl0ZXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBQcm9jZXNzZXMgYXZhaWxhYmxlIGRhdGEgYmxvY2tzLlxuICAgICAgKlxuICAgICAgKiBUaGlzIG1ldGhvZCBpbnZva2VzIF9kb1Byb2Nlc3NCbG9jayhvZmZzZXQpLCB3aGljaCBtdXN0IGJlIGltcGxlbWVudGVkIGJ5IGEgY29uY3JldGUgc3VidHlwZS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtib29sZWFufSBkb0ZsdXNoIFdoZXRoZXIgYWxsIGJsb2NrcyBhbmQgcGFydGlhbCBibG9ja3Mgc2hvdWxkIGJlIHByb2Nlc3NlZC5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcHJvY2Vzc2VkIGRhdGEuXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgcHJvY2Vzc2VkRGF0YSA9IGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX3Byb2Nlc3MoKTtcbiAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcyghISdmbHVzaCcpO1xuICAgICAgKi9cbiAgICBfcHJvY2VzczogZnVuY3Rpb24gKGRvRmx1c2gpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRzXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcbiAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG4gICAgICAgIHZhciBkYXRhU2lnQnl0ZXMgPSBkYXRhLnNpZ0J5dGVzO1xuICAgICAgICB2YXIgYmxvY2tTaXplID0gdGhpcy5ibG9ja1NpemU7XG4gICAgICAgIHZhciBibG9ja1NpemVCeXRlcyA9IGJsb2NrU2l6ZSAqIDQ7XG5cbiAgICAgICAgLy8gQ291bnQgYmxvY2tzIHJlYWR5XG4gICAgICAgIHZhciBuQmxvY2tzUmVhZHkgPSBkYXRhU2lnQnl0ZXMgLyBibG9ja1NpemVCeXRlcztcbiAgICAgICAgaWYgKGRvRmx1c2gpIHtcbiAgICAgICAgICAgIC8vIFJvdW5kIHVwIHRvIGluY2x1ZGUgcGFydGlhbCBibG9ja3NcbiAgICAgICAgICAgIG5CbG9ja3NSZWFkeSA9IE1hdGguY2VpbChuQmxvY2tzUmVhZHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUm91bmQgZG93biB0byBpbmNsdWRlIG9ubHkgZnVsbCBibG9ja3MsXG4gICAgICAgICAgICAvLyBsZXNzIHRoZSBudW1iZXIgb2YgYmxvY2tzIHRoYXQgbXVzdCByZW1haW4gaW4gdGhlIGJ1ZmZlclxuICAgICAgICAgICAgbkJsb2Nrc1JlYWR5ID0gTWF0aC5tYXgoKG5CbG9ja3NSZWFkeSB8IDApIC0gdGhpcy5fbWluQnVmZmVyU2l6ZSwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDb3VudCB3b3JkcyByZWFkeVxuICAgICAgICB2YXIgbldvcmRzUmVhZHkgPSBuQmxvY2tzUmVhZHkgKiBibG9ja1NpemU7XG5cbiAgICAgICAgLy8gQ291bnQgYnl0ZXMgcmVhZHlcbiAgICAgICAgdmFyIG5CeXRlc1JlYWR5ID0gTWF0aC5taW4obldvcmRzUmVhZHkgKiA0LCBkYXRhU2lnQnl0ZXMpO1xuXG4gICAgICAgIC8vIFByb2Nlc3MgYmxvY2tzXG4gICAgICAgIGlmIChuV29yZHNSZWFkeSkge1xuICAgICAgICAgICAgZm9yICh2YXIgb2Zmc2V0ID0gMDsgb2Zmc2V0IDwgbldvcmRzUmVhZHk7IG9mZnNldCArPSBibG9ja1NpemUpIHtcbiAgICAgICAgICAgICAgICAvLyBQZXJmb3JtIGNvbmNyZXRlLWFsZ29yaXRobSBsb2dpY1xuICAgICAgICAgICAgICAgIHRoaXMuX2RvUHJvY2Vzc0Jsb2NrKGRhdGFXb3Jkcywgb2Zmc2V0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVtb3ZlIHByb2Nlc3NlZCB3b3Jkc1xuICAgICAgICAgICAgdmFyIHByb2Nlc3NlZFdvcmRzID0gZGF0YVdvcmRzLnNwbGljZSgwLCBuV29yZHNSZWFkeSk7XG4gICAgICAgICAgICBkYXRhLnNpZ0J5dGVzIC09IG5CeXRlc1JlYWR5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIHByb2Nlc3NlZCB3b3Jkc1xuICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHByb2Nlc3NlZFdvcmRzLCBuQnl0ZXNSZWFkeSk7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyBvYmplY3QuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNsb25lLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGNsb25lID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5jbG9uZSgpO1xuICAgICAgKi9cbiAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2xvbmUgPSBCYXNlLmNsb25lLmNhbGwodGhpcyk7XG4gICAgICAgIGNsb25lLl9kYXRhID0gdGhpcy5fZGF0YS5jbG9uZSgpO1xuXG4gICAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9LFxuXG4gICAgX21pbkJ1ZmZlclNpemU6IDBcbn0pO1xuXG4vKipcbiAgKiBBYnN0cmFjdCBoYXNoZXIgdGVtcGxhdGUuXG4gICpcbiAgKiBAcHJvcGVydHkge251bWJlcn0gYmxvY2tTaXplIFRoZSBudW1iZXIgb2YgMzItYml0IHdvcmRzIHRoaXMgaGFzaGVyIG9wZXJhdGVzIG9uLiBEZWZhdWx0OiAxNiAoNTEyIGJpdHMpXG4gICovXG5DX2xpYi5IYXNoZXIgPSBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtLmV4dGVuZCh7XG5cbiAgICAvKipcbiAgICAgICogQ29uZmlndXJhdGlvbiBvcHRpb25zLlxuICAgICAgKi9cbiAgICBjZmc6IEJhc2UuZXh0ZW5kKCksXG5cbiAgICAvKipcbiAgICAgICogSW5pdGlhbGl6ZXMgYSBuZXdseSBjcmVhdGVkIGhhc2hlci5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtPYmplY3R9IGNmZyAoT3B0aW9uYWwpIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgdG8gdXNlIGZvciB0aGlzIGhhc2ggY29tcHV0YXRpb24uXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgaGFzaGVyID0gQ3J5cHRvSlMuYWxnby5TSEEyNTYuY3JlYXRlKCk7XG4gICAgICAqL1xuICAgIGluaXQ6IGZ1bmN0aW9uIChjZmcpIHtcbiAgICAgICAgLy8gQXBwbHkgY29uZmlnIGRlZmF1bHRzXG4gICAgICAgIHRoaXMuY2ZnID0gdGhpcy5jZmcuZXh0ZW5kKGNmZyk7XG5cbiAgICAgICAgLy8gU2V0IGluaXRpYWwgdmFsdWVzXG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICAqIFJlc2V0cyB0aGlzIGhhc2hlciB0byBpdHMgaW5pdGlhbCBzdGF0ZS5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIGhhc2hlci5yZXNldCgpO1xuICAgICAgKi9cbiAgICByZXNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZXNldCBkYXRhIGJ1ZmZlclxuICAgICAgICBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtLnJlc2V0LmNhbGwodGhpcyk7XG5cbiAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcbiAgICAgICAgdGhpcy5fZG9SZXNldCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogVXBkYXRlcyB0aGlzIGhhc2hlciB3aXRoIGEgbWVzc2FnZS5cbiAgICAgICpcbiAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIFRoZSBtZXNzYWdlIHRvIGFwcGVuZC5cbiAgICAgICpcbiAgICAgICogQHJldHVybiB7SGFzaGVyfSBUaGlzIGhhc2hlci5cbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIGhhc2hlci51cGRhdGUoJ21lc3NhZ2UnKTtcbiAgICAgICogICAgIGhhc2hlci51cGRhdGUod29yZEFycmF5KTtcbiAgICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAobWVzc2FnZVVwZGF0ZSkge1xuICAgICAgICAvLyBBcHBlbmRcbiAgICAgICAgdGhpcy5fYXBwZW5kKG1lc3NhZ2VVcGRhdGUpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgaGFzaFxuICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cbiAgICAgICAgLy8gQ2hhaW5hYmxlXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgICogRmluYWxpemVzIHRoZSBoYXNoIGNvbXB1dGF0aW9uLlxuICAgICAgKiBOb3RlIHRoYXQgdGhlIGZpbmFsaXplIG9wZXJhdGlvbiBpcyBlZmZlY3RpdmVseSBhIGRlc3RydWN0aXZlLCByZWFkLW9uY2Ugb3BlcmF0aW9uLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgKE9wdGlvbmFsKSBBIGZpbmFsIG1lc3NhZ2UgdXBkYXRlLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuICAgICAgKlxuICAgICAgKiBAZXhhbXBsZVxuICAgICAgKlxuICAgICAgKiAgICAgdmFyIGhhc2ggPSBoYXNoZXIuZmluYWxpemUoKTtcbiAgICAgICogICAgIHZhciBoYXNoID0gaGFzaGVyLmZpbmFsaXplKCdtZXNzYWdlJyk7XG4gICAgICAqICAgICB2YXIgaGFzaCA9IGhhc2hlci5maW5hbGl6ZSh3b3JkQXJyYXkpO1xuICAgICAgKi9cbiAgICBmaW5hbGl6ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgLy8gRmluYWwgbWVzc2FnZSB1cGRhdGVcbiAgICAgICAgaWYgKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2FwcGVuZChtZXNzYWdlVXBkYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtaGFzaGVyIGxvZ2ljXG4gICAgICAgIHZhciBoYXNoID0gdGhpcy5fZG9GaW5hbGl6ZSgpO1xuXG4gICAgICAgIHJldHVybiBoYXNoO1xuICAgIH0sXG5cbiAgICBibG9ja1NpemU6IDUxMiAvIDMyLFxuXG4gICAgLyoqXG4gICAgICAqIENyZWF0ZXMgYSBzaG9ydGN1dCBmdW5jdGlvbiB0byBhIGhhc2hlcidzIG9iamVjdCBpbnRlcmZhY2UuXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byBjcmVhdGUgYSBoZWxwZXIgZm9yLlxuICAgICAgKlxuICAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIHNob3J0Y3V0IGZ1bmN0aW9uLlxuICAgICAgKlxuICAgICAgKiBAc3RhdGljXG4gICAgICAqXG4gICAgICAqIEBleGFtcGxlXG4gICAgICAqXG4gICAgICAqICAgICB2YXIgU0hBMjU2ID0gQ3J5cHRvSlMubGliLkhhc2hlci5fY3JlYXRlSGVscGVyKENyeXB0b0pTLmFsZ28uU0hBMjU2KTtcbiAgICAgICovXG4gICAgX2NyZWF0ZUhlbHBlcjogZnVuY3Rpb24gKGhhc2hlcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1lc3NhZ2UsIGNmZykge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBoYXNoZXIuaW5pdChjZmcpLmZpbmFsaXplKG1lc3NhZ2UpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAgKiBDcmVhdGVzIGEgc2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoZXIgdG8gdXNlIGluIHRoaXMgSE1BQyBoZWxwZXIuXG4gICAgICAqXG4gICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgc2hvcnRjdXQgZnVuY3Rpb24uXG4gICAgICAqXG4gICAgICAqIEBzdGF0aWNcbiAgICAgICpcbiAgICAgICogQGV4YW1wbGVcbiAgICAgICpcbiAgICAgICogICAgIHZhciBIbWFjU0hBMjU2ID0gQ3J5cHRvSlMubGliLkhhc2hlci5fY3JlYXRlSG1hY0hlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG4gICAgICAqL1xuICAgIF9jcmVhdGVIbWFjSGVscGVyOiBmdW5jdGlvbiAoaGFzaGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobWVzc2FnZSwga2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IENfYWxnby5ITUFDLmluaXQoaGFzaGVyLCBrZXkpLmZpbmFsaXplKG1lc3NhZ2UpOyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgfTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDO1xuIiwiLyoqXG4gKiBAZmlsZSBobWFjLXNoYTI1Ni5qc1xuICogQGF1dGhvciA/Pz9cbiAqL1xucmVxdWlyZSgzOSk7XG5yZXF1aXJlKDM4KTtcbnZhciBDcnlwdG9KUyA9IHJlcXVpcmUoMzYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENyeXB0b0pTLkhtYWNTSEEyNTY7XG4iLCIvKipcbiAqIEBmaWxlIGhtYWMuanNcbiAqIEBhdXRob3IgPz8/XG4gKi9cblxudmFyIENyeXB0b0pTID0gcmVxdWlyZSgzNik7XG5cbi8vIFNob3J0Y3V0c1xudmFyIEMgPSBDcnlwdG9KUztcbnZhciBDX2xpYiA9IEMubGliO1xudmFyIEJhc2UgPSBDX2xpYi5CYXNlO1xudmFyIENfZW5jID0gQy5lbmM7XG52YXIgVXRmOCA9IENfZW5jLlV0Zjg7XG52YXIgQ19hbGdvID0gQy5hbGdvO1xuXG4vKipcbiAqIEhNQUMgYWxnb3JpdGhtLlxuICovXG5DX2FsZ28uSE1BQyA9IEJhc2UuZXh0ZW5kKHtcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCBITUFDLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtIYXNoZXJ9IGhhc2hlciBUaGUgaGFzaCBhbGdvcml0aG0gdG8gdXNlLlxuICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30ga2V5IFRoZSBzZWNyZXQga2V5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICB2YXIgaG1hY0hhc2hlciA9IENyeXB0b0pTLmFsZ28uSE1BQy5jcmVhdGUoQ3J5cHRvSlMuYWxnby5TSEEyNTYsIGtleSk7XG4gICAgICovXG4gICAgaW5pdDogZnVuY3Rpb24gKGhhc2hlciwga2V5KSB7XG4gICAgICAgIC8vIEluaXQgaGFzaGVyXG4gICAgICAgIGhhc2hlciA9IHRoaXMuX2hhc2hlciA9IG5ldyBoYXNoZXIuaW5pdCgpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cbiAgICAgICAgLy8gQ29udmVydCBzdHJpbmcgdG8gV29yZEFycmF5LCBlbHNlIGFzc3VtZSBXb3JkQXJyYXkgYWxyZWFkeVxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGtleSA9IFV0ZjgucGFyc2Uoa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgaGFzaGVyQmxvY2tTaXplID0gaGFzaGVyLmJsb2NrU2l6ZTtcbiAgICAgICAgdmFyIGhhc2hlckJsb2NrU2l6ZUJ5dGVzID0gaGFzaGVyQmxvY2tTaXplICogNDtcblxuICAgICAgICAvLyBBbGxvdyBhcmJpdHJhcnkgbGVuZ3RoIGtleXNcbiAgICAgICAgaWYgKGtleS5zaWdCeXRlcyA+IGhhc2hlckJsb2NrU2l6ZUJ5dGVzKSB7XG4gICAgICAgICAgICBrZXkgPSBoYXNoZXIuZmluYWxpemUoa2V5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsYW1wIGV4Y2VzcyBiaXRzXG4gICAgICAgIGtleS5jbGFtcCgpO1xuXG4gICAgICAgIC8vIENsb25lIGtleSBmb3IgaW5uZXIgYW5kIG91dGVyIHBhZHNcbiAgICAgICAgdmFyIG9LZXkgPSB0aGlzLl9vS2V5ID0ga2V5LmNsb25lKCk7XG4gICAgICAgIHZhciBpS2V5ID0gdGhpcy5faUtleSA9IGtleS5jbG9uZSgpO1xuXG4gICAgICAgIC8vIFNob3J0Y3V0c1xuICAgICAgICB2YXIgb0tleVdvcmRzID0gb0tleS53b3JkcztcbiAgICAgICAgdmFyIGlLZXlXb3JkcyA9IGlLZXkud29yZHM7XG5cbiAgICAgICAgLy8gWE9SIGtleXMgd2l0aCBwYWQgY29uc3RhbnRzXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGFzaGVyQmxvY2tTaXplOyBpKyspIHtcbiAgICAgICAgICAgIG9LZXlXb3Jkc1tpXSBePSAweDVjNWM1YzVjO1xuICAgICAgICAgICAgaUtleVdvcmRzW2ldIF49IDB4MzYzNjM2MzY7XG4gICAgICAgIH1cbiAgICAgICAgb0tleS5zaWdCeXRlcyA9IGlLZXkuc2lnQnl0ZXMgPSBoYXNoZXJCbG9ja1NpemVCeXRlcztcblxuICAgICAgICAvLyBTZXQgaW5pdGlhbCB2YWx1ZXNcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhpcyBITUFDIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICBobWFjSGFzaGVyLnJlc2V0KCk7XG4gICAgICovXG4gICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU2hvcnRjdXRcbiAgICAgICAgdmFyIGhhc2hlciA9IHRoaXMuX2hhc2hlcjtcblxuICAgICAgICAvLyBSZXNldFxuICAgICAgICBoYXNoZXIucmVzZXQoKTtcbiAgICAgICAgaGFzaGVyLnVwZGF0ZSh0aGlzLl9pS2V5KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGlzIEhNQUMgd2l0aCBhIG1lc3NhZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgVGhlIG1lc3NhZ2UgdG8gYXBwZW5kLlxuICAgICAqXG4gICAgICogQHJldHVybiB7SE1BQ30gVGhpcyBITUFDIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICBobWFjSGFzaGVyLnVwZGF0ZSgnbWVzc2FnZScpO1xuICAgICAqICAgICBobWFjSGFzaGVyLnVwZGF0ZSh3b3JkQXJyYXkpO1xuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcbiAgICAgICAgdGhpcy5faGFzaGVyLnVwZGF0ZShtZXNzYWdlVXBkYXRlKTtcblxuICAgICAgICAvLyBDaGFpbmFibGVcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEZpbmFsaXplcyB0aGUgSE1BQyBjb21wdXRhdGlvbi5cbiAgICAgKiBOb3RlIHRoYXQgdGhlIGZpbmFsaXplIG9wZXJhdGlvbiBpcyBlZmZlY3RpdmVseSBhIGRlc3RydWN0aXZlLCByZWFkLW9uY2Ugb3BlcmF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIChPcHRpb25hbCkgQSBmaW5hbCBtZXNzYWdlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIEhNQUMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIHZhciBobWFjID0gaG1hY0hhc2hlci5maW5hbGl6ZSgpO1xuICAgICAqICAgICB2YXIgaG1hYyA9IGhtYWNIYXNoZXIuZmluYWxpemUoJ21lc3NhZ2UnKTtcbiAgICAgKiAgICAgdmFyIGhtYWMgPSBobWFjSGFzaGVyLmZpbmFsaXplKHdvcmRBcnJheSk7XG4gICAgICovXG4gICAgZmluYWxpemU6IGZ1bmN0aW9uIChtZXNzYWdlVXBkYXRlKSB7XG4gICAgICAgIC8vIFNob3J0Y3V0XG4gICAgICAgIHZhciBoYXNoZXIgPSB0aGlzLl9oYXNoZXI7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSBITUFDXG4gICAgICAgIHZhciBpbm5lckhhc2ggPSBoYXNoZXIuZmluYWxpemUobWVzc2FnZVVwZGF0ZSk7XG4gICAgICAgIGhhc2hlci5yZXNldCgpO1xuICAgICAgICB2YXIgaG1hYyA9IGhhc2hlci5maW5hbGl6ZSh0aGlzLl9vS2V5LmNsb25lKCkuY29uY2F0KGlubmVySGFzaCkpO1xuXG4gICAgICAgIHJldHVybiBobWFjO1xuICAgIH1cbn0pO1xuIiwiLyoqXG4gKiBAZmlsZSBzaGEyNTYuanNcbiAqIEBhdXRob3IgPz8/XG4gKi9cbnZhciBDcnlwdG9KUyA9IHJlcXVpcmUoMzYpO1xuXG4gICAgLy8gU2hvcnRjdXRzXG52YXIgQyA9IENyeXB0b0pTO1xudmFyIENfbGliID0gQy5saWI7XG52YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5O1xudmFyIEhhc2hlciA9IENfbGliLkhhc2hlcjtcbnZhciBDX2FsZ28gPSBDLmFsZ287XG5cbi8vIEluaXRpYWxpemF0aW9uIGFuZCByb3VuZCBjb25zdGFudHMgdGFibGVzXG52YXIgSCA9IFtdO1xudmFyIEsgPSBbXTtcblxuLy8gQ29tcHV0ZSBjb25zdGFudHNcbihmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gaXNQcmltZShuKSB7XG4gICAgICAgIHZhciBzcXJ0TiA9IE1hdGguc3FydChuKTtcbiAgICAgICAgZm9yICh2YXIgZmFjdG9yID0gMjsgZmFjdG9yIDw9IHNxcnROOyBmYWN0b3IrKykge1xuICAgICAgICAgICAgaWYgKCEobiAlIGZhY3RvcikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEZyYWN0aW9uYWxCaXRzKG4pIHtcbiAgICAgICAgcmV0dXJuICgobiAtIChuIHwgMCkpICogMHgxMDAwMDAwMDApIHwgMDtcbiAgICB9XG5cbiAgICB2YXIgbiA9IDI7XG4gICAgdmFyIG5QcmltZSA9IDA7XG4gICAgd2hpbGUgKG5QcmltZSA8IDY0KSB7XG4gICAgICAgIGlmIChpc1ByaW1lKG4pKSB7XG4gICAgICAgICAgICBpZiAoblByaW1lIDwgOCkge1xuICAgICAgICAgICAgICAgIEhbblByaW1lXSA9IGdldEZyYWN0aW9uYWxCaXRzKE1hdGgucG93KG4sIDEgLyAyKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIEtbblByaW1lXSA9IGdldEZyYWN0aW9uYWxCaXRzKE1hdGgucG93KG4sIDEgLyAzKSk7XG5cbiAgICAgICAgICAgIG5QcmltZSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgbisrO1xuICAgIH1cbn0oKSk7XG5cbi8vIFJldXNhYmxlIG9iamVjdFxudmFyIFcgPSBbXTtcblxuLyoqXG4gKiBTSEEtMjU2IGhhc2ggYWxnb3JpdGhtLlxuICovXG52YXIgU0hBMjU2ID0gQ19hbGdvLlNIQTI1NiA9IEhhc2hlci5leHRlbmQoe1xuICAgIF9kb1Jlc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2hhc2ggPSBuZXcgV29yZEFycmF5LmluaXQoSC5zbGljZSgwKSk7ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9LFxuXG4gICAgX2RvUHJvY2Vzc0Jsb2NrOiBmdW5jdGlvbiAoTSwgb2Zmc2V0KSB7XG4gICAgICAgIC8vIFNob3J0Y3V0XG4gICAgICAgIHZhciBIID0gdGhpcy5faGFzaC53b3JkcztcblxuICAgICAgICAvLyBXb3JraW5nIHZhcmlhYmxlc1xuICAgICAgICB2YXIgYSA9IEhbMF07XG4gICAgICAgIHZhciBiID0gSFsxXTtcbiAgICAgICAgdmFyIGMgPSBIWzJdO1xuICAgICAgICB2YXIgZCA9IEhbM107XG4gICAgICAgIHZhciBlID0gSFs0XTtcbiAgICAgICAgdmFyIGYgPSBIWzVdO1xuICAgICAgICB2YXIgZyA9IEhbNl07XG4gICAgICAgIHZhciBoID0gSFs3XTtcblxuICAgICAgICAvLyBDb21wdXRhdGlvblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICBXW2ldID0gTVtvZmZzZXQgKyBpXSB8IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgZ2FtbWEweCA9IFdbaSAtIDE1XTtcbiAgICAgICAgICAgICAgICB2YXIgZ2FtbWEwID0gKChnYW1tYTB4IDw8IDI1KVxuICAgICAgICAgICAgICAgICAgICB8IChnYW1tYTB4ID4+PiA3KSkgXiAoKGdhbW1hMHggPDwgMTQpXG4gICAgICAgICAgICAgICAgICAgIHwgKGdhbW1hMHggPj4+IDE4KSkgXiAoZ2FtbWEweCA+Pj4gMyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgZ2FtbWExeCA9IFdbaSAtIDJdO1xuICAgICAgICAgICAgICAgIHZhciBnYW1tYTEgPSAoKGdhbW1hMXggPDwgMTUpXG4gICAgICAgICAgICAgICAgICAgIHwgKGdhbW1hMXggPj4+IDE3KSkgXiAoKGdhbW1hMXggPDwgMTMpXG4gICAgICAgICAgICAgICAgICAgIHwgKGdhbW1hMXggPj4+IDE5KSkgXiAoZ2FtbWExeCA+Pj4gMTApO1xuXG4gICAgICAgICAgICAgICAgV1tpXSA9IGdhbW1hMCArIFdbaSAtIDddICsgZ2FtbWExICsgV1tpIC0gMTZdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY2ggPSAoZSAmIGYpIF4gKH5lICYgZyk7XG4gICAgICAgICAgICB2YXIgbWFqID0gKGEgJiBiKSBeIChhICYgYykgXiAoYiAmIGMpO1xuXG4gICAgICAgICAgICB2YXIgc2lnbWEwID0gKChhIDw8IDMwKSB8IChhID4+PiAyKSkgXiAoKGEgPDwgMTkpIHwgKGEgPj4+IDEzKSkgXiAoKGEgPDwgMTApIHwgKGEgPj4+IDIyKSk7XG4gICAgICAgICAgICB2YXIgc2lnbWExID0gKChlIDw8IDI2KSB8IChlID4+PiA2KSkgXiAoKGUgPDwgMjEpIHwgKGUgPj4+IDExKSkgXiAoKGUgPDwgNykgfCAoZSA+Pj4gMjUpKTtcblxuICAgICAgICAgICAgdmFyIHQxID0gaCArIHNpZ21hMSArIGNoICsgS1tpXSArIFdbaV07XG4gICAgICAgICAgICB2YXIgdDIgPSBzaWdtYTAgKyBtYWo7XG5cbiAgICAgICAgICAgIGggPSBnO1xuICAgICAgICAgICAgZyA9IGY7XG4gICAgICAgICAgICBmID0gZTtcbiAgICAgICAgICAgIGUgPSAoZCArIHQxKSB8IDA7XG4gICAgICAgICAgICBkID0gYztcbiAgICAgICAgICAgIGMgPSBiO1xuICAgICAgICAgICAgYiA9IGE7XG4gICAgICAgICAgICBhID0gKHQxICsgdDIpIHwgMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEludGVybWVkaWF0ZSBoYXNoIHZhbHVlXG4gICAgICAgIEhbMF0gPSAoSFswXSArIGEpIHwgMDtcbiAgICAgICAgSFsxXSA9IChIWzFdICsgYikgfCAwO1xuICAgICAgICBIWzJdID0gKEhbMl0gKyBjKSB8IDA7XG4gICAgICAgIEhbM10gPSAoSFszXSArIGQpIHwgMDtcbiAgICAgICAgSFs0XSA9IChIWzRdICsgZSkgfCAwO1xuICAgICAgICBIWzVdID0gKEhbNV0gKyBmKSB8IDA7XG4gICAgICAgIEhbNl0gPSAoSFs2XSArIGcpIHwgMDtcbiAgICAgICAgSFs3XSA9IChIWzddICsgaCkgfCAwO1xuICAgIH0sXG5cbiAgICBfZG9GaW5hbGl6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBTaG9ydGN1dHNcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLl9kYXRhO1xuICAgICAgICB2YXIgZGF0YVdvcmRzID0gZGF0YS53b3JkcztcblxuICAgICAgICB2YXIgbkJpdHNUb3RhbCA9IHRoaXMuX25EYXRhQnl0ZXMgKiA4O1xuICAgICAgICB2YXIgbkJpdHNMZWZ0ID0gZGF0YS5zaWdCeXRlcyAqIDg7XG5cbiAgICAgICAgLy8gQWRkIHBhZGRpbmdcbiAgICAgICAgZGF0YVdvcmRzW25CaXRzTGVmdCA+Pj4gNV0gfD0gMHg4MCA8PCAoMjQgLSBuQml0c0xlZnQgJSAzMik7XG4gICAgICAgIGRhdGFXb3Jkc1soKChuQml0c0xlZnQgKyA2NCkgPj4+IDkpIDw8IDQpICsgMTRdID0gTWF0aC5mbG9vcihuQml0c1RvdGFsIC8gMHgxMDAwMDAwMDApO1xuICAgICAgICBkYXRhV29yZHNbKCgobkJpdHNMZWZ0ICsgNjQpID4+PiA5KSA8PCA0KSArIDE1XSA9IG5CaXRzVG90YWw7XG4gICAgICAgIGRhdGEuc2lnQnl0ZXMgPSBkYXRhV29yZHMubGVuZ3RoICogNDtcblxuICAgICAgICAvLyBIYXNoIGZpbmFsIGJsb2Nrc1xuICAgICAgICB0aGlzLl9wcm9jZXNzKCk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGZpbmFsIGNvbXB1dGVkIGhhc2hcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hhc2g7XG4gICAgfSxcblxuICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjbG9uZSA9IEhhc2hlci5jbG9uZS5jYWxsKHRoaXMpO1xuICAgICAgICBjbG9uZS5faGFzaCA9IHRoaXMuX2hhc2guY2xvbmUoKTtcblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxufSk7XG5cbi8qKlxuICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIGhhc2hlcidzIG9iamVjdCBpbnRlcmZhY2UuXG4gKlxuICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGhhc2guXG4gKlxuICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgaGFzaC5cbiAqXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgdmFyIGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYoJ21lc3NhZ2UnKTtcbiAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLlNIQTI1Nih3b3JkQXJyYXkpO1xuICovXG5DLlNIQTI1NiA9IEhhc2hlci5fY3JlYXRlSGVscGVyKFNIQTI1Nik7XG5cbi8qKlxuICogU2hvcnRjdXQgZnVuY3Rpb24gdG8gdGhlIEhNQUMncyBvYmplY3QgaW50ZXJmYWNlLlxuICpcbiAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gbWVzc2FnZSBUaGUgbWVzc2FnZSB0byBoYXNoLlxuICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBrZXkgVGhlIHNlY3JldCBrZXkuXG4gKlxuICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgSE1BQy5cbiAqXG4gKiBAc3RhdGljXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgdmFyIGhtYWMgPSBDcnlwdG9KUy5IbWFjU0hBMjU2KG1lc3NhZ2UsIGtleSk7XG4gKi9cbkMuSG1hY1NIQTI1NiA9IEhhc2hlci5fY3JlYXRlSG1hY0hlbHBlcihTSEEyNTYpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENyeXB0b0pTLlNIQTI1NjtcbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL2NyeXB0by5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIEhtYWNTSEEyNTYgPSByZXF1aXJlKDM3KTtcbnZhciBIZXggPSByZXF1aXJlKDM2KS5lbmMuSGV4O1xuXG5leHBvcnRzLmNyZWF0ZUhtYWMgPSBmdW5jdGlvbiAodHlwZSwga2V5KSB7XG4gICAgaWYgKHR5cGUgPT09ICdzaGEyNTYnKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xuXG4gICAgICAgIHZhciBzaGEyNTZIbWFjID0ge1xuICAgICAgICAgICAgdXBkYXRlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gSG1hY1NIQTI1NihkYXRhLCBrZXkpLnRvU3RyaW5nKEhleCk7XG4gICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRpZ2VzdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNoYTI1NkhtYWM7XG4gICAgfVxufTtcblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgdmVuZG9yL2V2ZW50cy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxuLyoqXG4gKiBFdmVudEVtaXR0ZXJcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIHRoaXMuX19ldmVudHMgPSB7fTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgdmFyX2FyZ3MpIHtcbiAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV07XG4gICAgaWYgKCFoYW5kbGVycykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYW5kbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGhhbmRsZXJzW2ldO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgIC8vIElHTk9SRVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICBpZiAoIXRoaXMuX19ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgICB0aGlzLl9fZXZlbnRzW2V2ZW50TmFtZV0gPSBbbGlzdGVuZXJdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5fX2V2ZW50c1tldmVudE5hbWVdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG4iLCIvKipcbiAqIEBmaWxlIHZlbmRvci9oZWxwZXIuanNcbiAqIEBhdXRob3IgbGVlaWdodFxuICovXG5cbmZ1bmN0aW9uIHBhZChudW1iZXIpIHtcbiAgICBpZiAobnVtYmVyIDwgMTApIHtcbiAgICAgICAgcmV0dXJuICcwJyArIG51bWJlcjtcbiAgICB9XG4gICAgcmV0dXJuIG51bWJlcjtcbn1cblxuZXhwb3J0cy50b0lTT1N0cmluZyA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgaWYgKGRhdGUudG9JU09TdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGRhdGUudG9JU09TdHJpbmcoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUuZ2V0VVRDRnVsbFllYXIoKVxuICAgICAgICArICctJyArIHBhZChkYXRlLmdldFVUQ01vbnRoKCkgKyAxKVxuICAgICAgICArICctJyArIHBhZChkYXRlLmdldFVUQ0RhdGUoKSlcbiAgICAgICAgKyAnVCcgKyBwYWQoZGF0ZS5nZXRVVENIb3VycygpKVxuICAgICAgICArICc6JyArIHBhZChkYXRlLmdldFVUQ01pbnV0ZXMoKSlcbiAgICAgICAgKyAnOicgKyBwYWQoZGF0ZS5nZXRVVENTZWNvbmRzKCkpXG4gICAgICAgICsgJy4nICsgKGRhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCkgLyAxMDAwKS50b0ZpeGVkKDMpLnNsaWNlKDIsIDUpXG4gICAgICAgICsgJ1onO1xufTtcblxuZXhwb3J0cy50b1VUQ1N0cmluZyA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgdmFyIGlzb1N0cmluZyA9IGV4cG9ydHMudG9JU09TdHJpbmcoZGF0ZSk7XG4gICAgcmV0dXJuIGlzb1N0cmluZy5yZXBsYWNlKC9cXC5cXGQrWiQvLCAnWicpO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvcGF0aC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHUgPSByZXF1aXJlKDQ2KTtcblxuLy8gU3BsaXQgYSBmaWxlbmFtZSBpbnRvIFtyb290LCBkaXIsIGJhc2VuYW1lLCBleHRdLCB1bml4IHZlcnNpb25cbi8vICdyb290JyBpcyBqdXN0IGEgc2xhc2gsIG9yIG5vdGhpbmcuXG52YXIgc3BsaXRQYXRoUmUgPSAvXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLztcblxuZnVuY3Rpb24gc3BsaXRQYXRoKGZpbGVuYW1lKSB7XG4gICAgcmV0dXJuIHNwbGl0UGF0aFJlLmV4ZWMoZmlsZW5hbWUpLnNsaWNlKDEpO1xufVxuXG4vLyByZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggYXJyYXkgd2l0aCBkaXJlY3RvcnkgbmFtZXMgdGhlcmVcbi8vIG11c3QgYmUgbm8gc2xhc2hlcywgZW1wdHkgZWxlbWVudHMsIG9yIGRldmljZSBuYW1lcyAoYzpcXCkgaW4gdGhlIGFycmF5XG4vLyAoc28gYWxzbyBubyBsZWFkaW5nIGFuZCB0cmFpbGluZyBzbGFzaGVzIC0gaXQgZG9lcyBub3QgZGlzdGluZ3Vpc2hcbi8vIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBwYXRocylcbmZ1bmN0aW9uIG5vcm1hbGl6ZUFycmF5KHBhcnRzLCBhbGxvd0Fib3ZlUm9vdCkge1xuICAgIC8vIGlmIHRoZSBwYXRoIHRyaWVzIHRvIGdvIGFib3ZlIHRoZSByb290LCBgdXBgIGVuZHMgdXAgPiAwXG4gICAgdmFyIHVwID0gMDtcblxuICAgIGZvciAodmFyIGkgPSBwYXJ0cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICB2YXIgbGFzdCA9IHBhcnRzW2ldO1xuXG4gICAgICAgIGlmIChsYXN0ID09PSAnLicpIHtcbiAgICAgICAgICAgIHBhcnRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChsYXN0ID09PSAnLi4nKSB7XG4gICAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB1cCsrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVwKSB7XG4gICAgICAgICAgICBwYXJ0cy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICB1cC0tO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIHBhdGggaXMgYWxsb3dlZCB0byBnbyBhYm92ZSB0aGUgcm9vdCwgcmVzdG9yZSBsZWFkaW5nIC4uc1xuICAgIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgICAgICBmb3IgKDsgdXAtLTsgdXApIHtcbiAgICAgICAgICAgIHBhcnRzLnVuc2hpZnQoJy4uJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcGFydHM7XG59XG5cbi8vIFN0cmluZy5wcm90b3R5cGUuc3Vic3RyIC0gbmVnYXRpdmUgaW5kZXggZG9uJ3Qgd29yayBpbiBJRThcbnZhciBzdWJzdHIgPSAnYWInLnN1YnN0cigtMSkgPT09ICdiJ1xuICAgID8gZnVuY3Rpb24gKHN0ciwgc3RhcnQsIGxlbikge1xuICAgICAgICByZXR1cm4gc3RyLnN1YnN0cihzdGFydCwgbGVuKTtcbiAgICB9XG4gICAgOiBmdW5jdGlvbiAoc3RyLCBzdGFydCwgbGVuKSB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gc3RyLmxlbmd0aCArIHN0YXJ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHIuc3Vic3RyKHN0YXJ0LCBsZW4pO1xuICAgIH07XG5cbmV4cG9ydHMuZXh0bmFtZSA9IGZ1bmN0aW9uIChwYXRoKSB7XG4gICAgcmV0dXJuIHNwbGl0UGF0aChwYXRoKVszXTtcbn07XG5cbmV4cG9ydHMuam9pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGF0aHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgIHJldHVybiBleHBvcnRzLm5vcm1hbGl6ZSh1LmZpbHRlcihwYXRocywgZnVuY3Rpb24gKHAsIGluZGV4KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfSkuam9pbignLycpKTtcbn07XG5cbmV4cG9ydHMubm9ybWFsaXplID0gZnVuY3Rpb24gKHBhdGgpIHtcbiAgICB2YXIgaXNBYnNvbHV0ZSA9IHBhdGguY2hhckF0KDApID09PSAnLyc7XG4gICAgdmFyIHRyYWlsaW5nU2xhc2ggPSBzdWJzdHIocGF0aCwgLTEpID09PSAnLyc7XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgICBwYXRoID0gbm9ybWFsaXplQXJyYXkodS5maWx0ZXIocGF0aC5zcGxpdCgnLycpLCBmdW5jdGlvbiAocCkge1xuICAgICAgICByZXR1cm4gISFwO1xuICAgIH0pLCAhaXNBYnNvbHV0ZSkuam9pbignLycpO1xuXG4gICAgaWYgKCFwYXRoICYmICFpc0Fic29sdXRlKSB7XG4gICAgICAgIHBhdGggPSAnLic7XG4gICAgfVxuICAgIGlmIChwYXRoICYmIHRyYWlsaW5nU2xhc2gpIHtcbiAgICAgICAgcGF0aCArPSAnLyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIChpc0Fic29sdXRlID8gJy8nIDogJycpICsgcGF0aDtcbn07XG5cblxuXG5cblxuXG5cblxuXG4iLCIvKipcbiAqIEBmaWxlIHNyYy92ZW5kb3IvcS5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cbnZhciBQcm9taXNlID0gcmVxdWlyZSgzNCk7XG5cbmV4cG9ydHMucmVzb2x2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlLmFwcGx5KFByb21pc2UsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLnJlamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QuYXBwbHkoUHJvbWlzZSwgYXJndW1lbnRzKTtcbn07XG5cbmV4cG9ydHMuYWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbC5hcHBseShQcm9taXNlLCBhcmd1bWVudHMpO1xufTtcblxuZXhwb3J0cy5mY2FsbCA9IGZ1bmN0aW9uIChmbikge1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZm4oKSk7XG4gICAgfVxuICAgIGNhdGNoIChleCkge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXgpO1xuICAgIH1cbn07XG5cbmV4cG9ydHMuZGVmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGRlZmVycmVkID0ge307XG5cbiAgICBkZWZlcnJlZC5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzb2x2ZS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZWplY3QuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbiIsIi8qKlxuICogQGZpbGUgc3JjL3ZlbmRvci9xdWVyeXN0cmluZy5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHUgPSByZXF1aXJlKDQ2KTtcblxuZnVuY3Rpb24gc3RyaW5naWZ5UHJpbWl0aXZlKHYpIHtcbiAgICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB2O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodikpIHtcbiAgICAgICAgcmV0dXJuICcnICsgdjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgICByZXR1cm4gdiA/ICd0cnVlJyA6ICdmYWxzZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuICcnO1xufVxuXG5leHBvcnRzLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmosIHNlcCwgZXEsIG9wdGlvbnMpIHtcbiAgICBzZXAgPSBzZXAgfHwgJyYnO1xuICAgIGVxID0gZXEgfHwgJz0nO1xuXG4gICAgdmFyIGVuY29kZSA9IGVuY29kZVVSSUNvbXBvbmVudDsgLy8gUXVlcnlTdHJpbmcuZXNjYXBlO1xuICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmVuY29kZVVSSUNvbXBvbmVudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbmNvZGUgPSBvcHRpb25zLmVuY29kZVVSSUNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBpZiAob2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHZhciBrZXlzID0gdS5rZXlzKG9iaik7XG4gICAgICAgIHZhciBsZW4gPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGZsYXN0ID0gbGVuIC0gMTtcbiAgICAgICAgdmFyIGZpZWxkcyA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICB2YXIgayA9IGtleXNbaV07XG4gICAgICAgICAgICB2YXIgdiA9IG9ialtrXTtcbiAgICAgICAgICAgIHZhciBrcyA9IGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUoaykpICsgZXE7XG5cbiAgICAgICAgICAgIGlmICh1LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgICAgICB2YXIgdmxlbiA9IHYubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciB2bGFzdCA9IHZsZW4gLSAxO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmxlbjsgKytqKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBrcyArIGVuY29kZShzdHJpbmdpZnlQcmltaXRpdmUodltqXSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaiA8IHZsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHZsZW4gJiYgaSA8IGZsYXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyArPSBzZXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmllbGRzICs9IGtzICsgZW5jb2RlKHN0cmluZ2lmeVByaW1pdGl2ZSh2KSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPCBmbGFzdCkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHMgKz0gc2VwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIHJldHVybiAnJztcbn07XG4iLCIvKipcbiAqIGFnIC0tbm8tZmlsZW5hbWUgLW8gJ1xcYih1XFwuLio/KVxcKCcgLiAgfCBzb3J0IHwgdW5pcSAtY1xuICpcbiAqIEBmaWxlIHZlbmRvci91bmRlcnNjb3JlLmpzXG4gKiBAYXV0aG9yIGxlZWlnaHRcbiAqL1xuXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoNSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoMTApO1xudmFyIGlzTnVtYmVyID0gcmVxdWlyZSgxMyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKDE0KTtcblxudmFyIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBzdHJpbmdUYWc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoc291cmNlLCB2YXJfYXJncykge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAoaXRlbSAmJiBpc09iamVjdChpdGVtKSkge1xuICAgICAgICAgICAgdmFyIG9LZXlzID0ga2V5cyhpdGVtKTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgb0tleXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gb0tleXNbal07XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gaXRlbVtrZXldO1xuICAgICAgICAgICAgICAgIHNvdXJjZVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc291cmNlO1xufVxuXG5mdW5jdGlvbiBtYXAoYXJyYXksIGNhbGxiYWNrLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBmb3JlYWNoKGFycmF5LCBjYWxsYmFjaywgY29udGV4dCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbChjb250ZXh0LCBhcnJheVtpXSwgaSwgYXJyYXkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZmluZChhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldO1xuICAgICAgICBpZiAoY2FsbGJhY2suY2FsbChjb250ZXh0LCB2YWx1ZSwgaSwgYXJyYXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbHRlcihhcnJheSwgY2FsbGJhY2ssIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWUsIGksIGFycmF5KSkge1xuICAgICAgICAgICAgcmVzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIG9taXQob2JqZWN0LCB2YXJfYXJncykge1xuICAgIHZhciBhcmdzID0gaXNBcnJheSh2YXJfYXJncylcbiAgICAgICAgPyB2YXJfYXJnc1xuICAgICAgICA6IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIHZhciBvS2V5cyA9IGtleXMob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9LZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBvS2V5c1tpXTtcbiAgICAgICAgaWYgKGFyZ3MuaW5kZXhPZihrZXkpID09PSAtMSkge1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHBpY2sob2JqZWN0LCB2YXJfYXJncywgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgIHZhciBpO1xuICAgIHZhciBrZXk7XG4gICAgdmFyIHZhbHVlO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24odmFyX2FyZ3MpKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHZhcl9hcmdzO1xuICAgICAgICB2YXIgb0tleXMgPSBrZXlzKG9iamVjdCk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBvS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAga2V5ID0gb0tleXNbaV07XG4gICAgICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgb2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBhcmdzID0gaXNBcnJheSh2YXJfYXJncylcbiAgICAgICAgICAgID8gdmFyX2FyZ3NcbiAgICAgICAgICAgIDogW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBrZXkgPSBhcmdzW2ldO1xuICAgICAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBiaW5kKGZuLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfTtcbn1cblxudmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBoYXNEb250RW51bUJ1ZyA9ICEoe3RvU3RyaW5nOiBudWxsfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG52YXIgZG9udEVudW1zID0gWyd0b1N0cmluZycsICd0b0xvY2FsZVN0cmluZycsICd2YWx1ZU9mJywgJ2hhc093blByb3BlcnR5JyxcbiAgICAnaXNQcm90b3R5cGVPZicsICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdjb25zdHJ1Y3RvciddO1xuXG5mdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgcHJvcDtcbiAgICB2YXIgaTtcblxuICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzRG9udEVudW1CdWcpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRvbnRFbnVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBkb250RW51bXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZG9udEVudW1zW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydHMuYmluZCA9IGJpbmQ7XG5leHBvcnRzLmVhY2ggPSBmb3JlYWNoO1xuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG5leHBvcnRzLmZpbHRlciA9IGZpbHRlcjtcbmV4cG9ydHMuZmluZCA9IGZpbmQ7XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcbmV4cG9ydHMubWFwID0gbWFwO1xuZXhwb3J0cy5vbWl0ID0gb21pdDtcbmV4cG9ydHMucGljayA9IHBpY2s7XG5leHBvcnRzLmtleXMgPSBrZXlzO1xuZXhwb3J0cy5ub29wID0gbm9vcDtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIiwiLyoqXG4gKiBAZmlsZSB2ZW5kb3IvdXRpbC5qc1xuICogQGF1dGhvciBsZWVpZ2h0XG4gKi9cblxudmFyIHUgPSByZXF1aXJlKDQ2KTtcblxuZXhwb3J0cy5pbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICAgIHZhciBzdWJDbGFzc1Byb3RvID0gc3ViQ2xhc3MucHJvdG90eXBlO1xuICAgIHZhciBGID0gbmV3IEZ1bmN0aW9uKCk7XG4gICAgRi5wcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcbiAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBuZXcgRigpO1xuICAgIHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzO1xuICAgIHUuZXh0ZW5kKHN1YkNsYXNzLnByb3RvdHlwZSwgc3ViQ2xhc3NQcm90byk7XG59O1xuXG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uIChmKSB7XG4gICAgdmFyIGFyZ0xlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICBpZiAoYXJnTGVuID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIHZhciBzdHIgPSAnJztcbiAgICB2YXIgYSA9IDE7XG4gICAgdmFyIGxhc3RQb3MgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZi5sZW5ndGg7KSB7XG4gICAgICAgIGlmIChmLmNoYXJDb2RlQXQoaSkgPT09IDM3IC8qKiAnJScgKi8gJiYgaSArIDEgPCBmLmxlbmd0aCkge1xuICAgICAgICAgICAgc3dpdGNoIChmLmNoYXJDb2RlQXQoaSArIDEpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAxMDA6IC8vICdkJ1xuICAgICAgICAgICAgICAgICAgICBpZiAoYSA+PSBhcmdMZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zLCBpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHN0ciArPSBOdW1iZXIoYXJndW1lbnRzW2ErK10pO1xuICAgICAgICAgICAgICAgICAgICBsYXN0UG9zID0gaSA9IGkgKyAyO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDExNTogLy8gJ3MnXG4gICAgICAgICAgICAgICAgICAgIGlmIChhID49IGFyZ0xlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9IFN0cmluZyhhcmd1bWVudHNbYSsrXSk7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RQb3MgPSBpID0gaSArIDI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgMzc6IC8vICclJ1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MsIGkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc3RyICs9ICclJztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBvcyA9IGkgPSBpICsgMjtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICArK2k7XG4gICAgfVxuXG4gICAgaWYgKGxhc3RQb3MgPT09IDApIHtcbiAgICAgICAgc3RyID0gZjtcbiAgICB9XG4gICAgZWxzZSBpZiAobGFzdFBvcyA8IGYubGVuZ3RoKSB7XG4gICAgICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MpO1xuICAgIH1cblxuICAgIHJldHVybiBzdHI7XG59O1xuIl19
