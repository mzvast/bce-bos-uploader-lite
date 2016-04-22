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
    it('parseSize', function () {
        expect(utils.parseSize(1024)).to.eql(1024);
        expect(utils.parseSize('1024b')).to.eql(1024);
        expect(utils.parseSize('1024')).to.eql(1024);
        expect(utils.parseSize('1024k')).to.eql(1024 * 1024);
        expect(utils.parseSize('1024m')).to.eql(1024 * 1024 * 1024);
        expect(utils.parseSize('1g')).to.eql(1024 * 1024 * 1024);
        expect(utils.parseSize('1024B')).to.eql(1024);
        expect(utils.parseSize('1024Kb')).to.eql(1024 * 1024);
        expect(utils.parseSize('1024Mb')).to.eql(1024 * 1024 * 1024);
        expect(utils.parseSize('1Gb')).to.eql(1024 * 1024 * 1024);
    });

    it('transformUrl', function () {
        expect(utils.transformUrl('http://bj.bcebos.com/v1/${bucket}/${object}'))
            .to.eql('http://${bucket}.bj.bcebos.com/v1/${object}');
        expect(utils.transformUrl('https://bj.bcebos.com/v1/${bucket}/${object}?uploads='))
            .to.eql('https://${bucket}.bj.bcebos.com/v1/${object}?uploads=');

        expect(utils.transformUrl('http://gz.bcebos.com/v1/${bucket}/${ogzect}'))
            .to.eql('http://${bucket}.gz.bcebos.com/v1/${ogzect}');
        expect(utils.transformUrl('https://gz.bcebos.com/v1/${bucket}/${ogzect}?uploads='))
            .to.eql('https://${bucket}.gz.bcebos.com/v1/${ogzect}?uploads=');

        expect(utils.transformUrl('http://hk.bcebos.com/v1/${bucket}/${ohkect}'))
            .to.eql('http://${bucket}.hk.bcebos.com/v1/${ohkect}');
        expect(utils.transformUrl('https://hk.bcebos.com/v1/${bucket}/${ohkect}?uploads='))
            .to.eql('https://${bucket}.hk.bcebos.com/v1/${ohkect}?uploads=');

        expect(utils.transformUrl('http://bj.bcebos.com/v2/${bucket}/${object}'))
            .to.eql('http://${bucket}.bj.bcebos.com/v2/${object}');
        expect(utils.transformUrl('https://bj.bcebos.com/v2/${bucket}/${object}?uploads='))
            .to.eql('https://${bucket}.bj.bcebos.com/v2/${object}?uploads=');

        expect(utils.transformUrl('http://bj.bcebos.com/${bucket}/${object}'))
            .to.eql('http://${bucket}.bj.bcebos.com/${object}');
        expect(utils.transformUrl('https://bj.bcebos.com/${bucket}/${object}?uploads='))
            .to.eql('https://${bucket}.bj.bcebos.com/${object}?uploads=');

        expect(utils.transformUrl('http://bos.bj.baidubce.com/v1/${bucket}/${object}'))
            .to.eql('http://${bucket}.bos.bj.baidubce.com/v1/${object}');
        expect(utils.transformUrl('https://bos.bj.baidubce.com/v1/${bucket}/${object}?uploads='))
            .to.eql('https://${bucket}.bos.bj.baidubce.com/v1/${object}?uploads=');

        expect(utils.transformUrl('http://bos.bj.baidubce.com/v2/${bucket}/${object}'))
            .to.eql('http://${bucket}.bos.bj.baidubce.com/v2/${object}');
        expect(utils.transformUrl('https://bos.bj.baidubce.com/v2/${bucket}/${object}?uploads='))
            .to.eql('https://${bucket}.bos.bj.baidubce.com/v2/${object}?uploads=');

        expect(utils.transformUrl('http://bos.bj.baidubce.com/${bucket}/${object}'))
            .to.eql('http://${bucket}.bos.bj.baidubce.com/${object}');
        expect(utils.transformUrl('https://bos.bj.baidubce.com/${bucket}/${object}?uploads='))
            .to.eql('https://${bucket}.bos.bj.baidubce.com/${object}?uploads=');
    });

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
