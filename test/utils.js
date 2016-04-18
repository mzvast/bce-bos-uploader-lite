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
 * @file test/utils.js
 * @author leeight
 */

var expect = require('expect.js');

var utils = require('../src/utils');

describe('utils', function () {
    it('getAppendableTasks', function () {
        var fileSize = 100;
        var offset = 96;
        var chunkSize = 3;

        var tasks = utils.getAppendableTasks(fileSize, offset, chunkSize);
        expect(tasks).to.eql([
            {
                partSize: 3,
                start: 96,
                stop: 98
            },
            {
                partSize: 1,
                start: 99,
                stop: 99
            }
        ]);
    });
});











/* vim: set ts=4 sw=4 sts=4 tw=120: */
