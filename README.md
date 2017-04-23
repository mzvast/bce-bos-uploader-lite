### Baidu Cloud Engine BOS Uploader (Lite)

bce-bos-uploader-lite 是 [bce-bos-uploader](https://github.com/leeight/bce-bos-uploader) 的精简版，裁剪了不太常用的功能组件，保留了核心的上传功能，当前版本 `*.min.js` 文件大小在 gzip 前后的情况是 47k / 16k。

DEMO地址：<https://leeight.github.io/bce-bos-uploader-lite/>

### 支持的浏览器

IE8+, Firefox, Chrome, Safari, Opera

### 如何使用

注意：下面要介绍部分内容可能需要科学上网才可以访问，所以请自备梯子。

#### 初始化 bucket

主要是完成 bucket cors 的配置，可以参考 [文档手工完成设置](https://cloud.baidu.com/doc/BOS/BestPractise.html#.7B.0B.56.71.A6.B0.9A.33.4D.A1.4E.F2.A8.19.1D.A0)，或者借助 [bce-sdk-js-usage](https://github.com/leeight/bce-sdk-js-usage) 自动初始化。

NOTE: 这里推荐使用 [bce-sdk-js-usage](https://github.com/leeight/bce-sdk-js-usage) 来初始化操作，因为它包含了一些服务端所需的代码，后续签名计算的逻辑需要借助它来完成。

执行 `npm run prepare` 之后，如果顺利的话，应该可以看到类似如下的输出：

```
Generated backend/php/Config.php
Generated backend/java/src/main/java/com/baidu/inf/bce/Config.java
Add cors config to bos://<your bucket>
Set public-read to bos://<your bucket>
crossdomain.xml to bos://<your bucket>/crossdomain.xml
```

#### 准备一个最简单的页面

请参考这个示例页面 <http://output.jsbin.com/nawaket>。  
如果你的 bucket 不是 bj region，那么请在 `bos_endpoint` 地方填写实际的地址。

|*region*|*endpoint*|
|-----|-----|
|bj|https://bj.bcebos.com|
|gz|https://gz.bcebos.com|
|su|https://su.bcebos.com|
|hk|https://hk.bcebos.com|

如果上面的操作一切顺利的话，此时就可以在这个页面实现文件直传的工作。

#### 关于 uptoken_url

实际应用中，`bos_ak` 和 `bos_sk` 是不应该暴露出来的，所以我们支持了 `uptoken_url` 这个参数来在服务器动态的计算签名。只需要在初始化的时候，设置这个参数即可：

```javascript
var uploader = new baidubce.bos.Uploader({
  browse_button: '#file',
  multi_selection: true,
  uptoken_url: 'http://localhost:8801/ack', // <-- 新增的参数
  ...
```

然后按照 [bce-sdk-js-usage](https://github.com/leeight/bce-sdk-js-usage) 的 README 里面的介绍，启动一个服务，比如 `cd backend/nodejs && node main.js`

完整的例子请参考：<http://output.jsbin.com/jadici>

#### 关于 get_new_uptoken

在上面一个例子中，每次上传文件的时候，都会请求 `uptoken_url` 来计算签名。不过因为 BOS 已经支持了 [临时访问授权](https://cloud.baidu.com/doc/BOS/API/15.5CSTS.E7.AE.80.E4.BB.8B.html) 的机制，所以在初始化的时候，通过设置 `get_new_uptoken: false`，可以让 Uploader 自动从 `uptoken_url` 获取一个临时的 ak, sk, sessionToken，之后文件上传的时候就可以在浏览器端计算签名了，从而可以减少对 `uptoken_url` 的访问。

```javascript
var uploader = new baidubce.bos.Uploader({
  browse_button: '#file',
  multi_selection: true,
  uptoken_url: 'http://localhost:8801/ack',
  get_new_uptoken: false,       // <-- 新增的参数
  ...
```

完整的例子请参考：<http://output.jsbin.com/jadici>


### 支持的配置参数

|*名称*|*是否必填*|*默认值*|*说明*|
|-----|---------|-------|-----|
|bos_bucket|Y|无|需要上传到的Bucket|
|uptoken_url|Y|无|用来进行服务端签名的URL，需要支持JSONP|
|browse_button|Y|无|需要初始化的`<input type="file"/>`|
|bos_endpoint|N|http://bos.bj.baidubce.com|BOS服务器的地址|
|bos_ak|N|无|如果没有设置`uptoken_url`的话，必须有`ak`和`sk`这个配置才可以工作|
|bos_sk|N|无|如果没有设置`uptoken_url`的话，必须有`ak`和`sk`这个配置才可以工作|
|bos_appendable|N|false|是否采用Append的方式上传文件**不支持IE低版本**|
|bos_task_parallel|N|3|队列中文件并行上传的个数|
|uptoken|N|无|sts token的内容|
|get_new_uptoken|N|true|如果设置为false，会自动获取到Sts Token，上传的过程中可以减少一些请求|
|auth_stripped_headers|N|['User-Agent', 'Connection']|如果计算签名的时候，需要剔除一些headers，可以配置这个参数|
|multi_selection|N|false|是否可以选择多个文件|
|dir_selection|N|false|是否允许选择目录(有些浏览器开启了这个选型之后，只能选择目录，无法选择文件)|
|max_retries|N|0|如果上传文件失败之后，支持的重试次数。默认不重试|
|auto_start|N|false|选择文件之后，是否自动上传|
|max_file_size|N|100M|可以选择的最大文件，超过这个值之后，会被忽略掉|
|bos_multipart_min_size|N|10M|超过这个值之后，采用分片上传的策略。如果想让所有的文件都采用分片上传，把这个值设置为0即可|
|chunk_size|N|4M|分片上传的时候，每个分片的大小（如果没有切换到分片上传的策略，这个值没意义）|
|bos_multipart_auto_continue|N|true|是否开启断点续传，如果设置成false，则UploadResume和UploadResumeError事件不会生效|
|bos_multipart_local_key_generator|N|defaults|计算localStorage里面key的策略，可选值有`defaults`和`md5`|
|accept|-|-|可以支持选择的文件类型|
|flash_swf_url|-|-|mOxie Flash文件的地址|

### 支持的事件

在初始化 uploader 的时候，可以通过设置 init 来传递一些 回掉函数，然后 uploader 在合适的时机，会调用这些回掉函数，然后传递必要的参数。例如：

```js
var uploader = new baidubce.bos.Uploader({
  init: {
    PostInit: function () {
      // uploader 初始化完毕之后，调用这个函数
    },
    Key: function (_, file) {
      // 如果需要重命名 BOS 存储的文件名称，这个函数
      // 返回新的文件名即可
      // 如果这里需要执行异步的操作，可以返回 Promise 对象
      // 如果需要自定义bucket和object，可以返回{bucket: string, key: string}
      // 例如：
      // return new Promise(function (resolve, reject) {
      //   setTimeout(function () {
      //     resolve(file.name);
      //   }, 2000);
      // });
    },
    FilesAdded: function (_, files) {
      // 当文件被加入到队列里面，调用这个函数
    },
    FilesFilter: function (_, files) {
      // 如果需要对加入到队列里面的文件，进行过滤，可以在
      // 这个函数里面实现自己的逻辑
      // 返回值需要是一个数组，里面保留需要添加到队列的文件
    },
    BeforeUpload: function (_, file) {
      // 当某个文件开始上传的时候，调用这个函数
      // 如果想组织这个文件的上传，请返回 false
    },
    UploadProgress: function (_, file, progress, event) {
      // 文件的上传进度
    },
    NetworkSpeed: function (_, bytes, time, pendings) {
      var speed = bytes / time;             // 上传速度
      var leftTime = pendings / (speed);    // 剩余时间
      console.log(speed, leftTime);
    },
    FileUploaded: function (_, file, info) {
      // 文件上传成功之后，调用这个函数
      var url = [bos_endpoint, info.body.bucket, info.body.object].join('/');
      console.log(url);
    },
    UploadPartProgress: function (_, file, progress, event) {
      // 分片上传的时候，单个分片的上传进度
    },
    ChunkUploaded: function (_, file, result) {
      // 分片上传的时候，单个分片上传结束
    },
    Error: function (_, error, file) {
      // 如果上传的过程中出错了，调用这个函数
    },
    UploadComplete: function () {
      // 队列里面的文件上传结束了，调用这个函数
    },
    UploadResume: function (_, file, partList, event) {
      // 断点续传生效时，调用这个函数，partList表示上次中断时，已上传完成的分块列表
    },
    UploadResumeError: function (_, file, error, event) {
      // 尝试进行断点续传失败时，调用这个函数
    }
  }
});
```

> 需要注意的时候，所以回掉函数里面的一个参数，暂时都是 null，因此上面的例子中用 _ 代替，后续可能会升级


### 对外提供的接口

#### start()

当 auto_start 设置为 false 的时候，需要手工调用 `start` 来开启上传的工作。

#### stop()

调用 stop 之后，会终止对文件队列的处理。需要注意的是，不是立即停止上传，而是等到当前的文件处理结束（成功/失败）之后，才会停下来。

### remove(file)

删除队列中的一个文件，如果文件正在上传，那么就会中断上传。

### setOptions(options)

动态的设置 bce-bos-uploader-lite 的参数，目前只支持设置如下几个参数：

1. `bos_credentials`, `bos_ak`, `bos_sk`
2. `uptoken`
3. `bos_bucket`
4. `bos_endpoint`

--