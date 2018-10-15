## performance-report页面性能、资源、错误、ajax，fetch请求上报插件

### performance-report只做页面性能数据的采集和上报，是比较完整和健全的数据上报插件，它可以帮你完成以下功能：
>  * 当前页面URL (data.page)
>  * 上一页面URL （data.preUrl）
>  * 当前浏览器版本信息 （data.appVersion）
>  * 页面性能数据信息 （data.performance），例如：页面加载时间，白屏时间，dns解析时间等
>  * 当前页面错误信息 （data.errorList） 包含（js,css,img,ajax,fetch 等错误信息）
>  * 当前页面所有资源性能数据 （data.resoruceList）,例如ajax,css,img等资源加载性能数据
>  * 不用担心阻塞页面，压缩资源大小6kb,上报方式为异步上报

### 完整的前端性能监控系统
https://github.com/wangweianger/egg-mongoose-performance-system

### npm地址：
https://www.npmjs.com/package/performance-report

## html页面直接引用：
>  * 1、下载 dist/performance-report.min.js 到本地
>  * 2、使用script标签引入到html的头部（备注：放到所有js资源之前）
>  * 3、使用performance函数进行数据的监听上报

```html
<html>
<head>
  <meta charset="UTF-8">
  <title>performance test</title>
  <script src="../dist/performance-report.min.js"></script>
  <script>
    Performance({
        domain:'http://some.com/api', //Your API address
    })
  </script>
</head>
```

### webpack 使用
```js
npm install performance-report --save-dev
```
```js
//New performance.js file
//The contents are as follows

import Performance from 'performance-report'
Performance({ 
  domain:'http://some.com/api' 
})
```
```js
//Change webpack configuration

entry: {
    //add performance entry
    'performance':path.resolve(__dirname, '../src/performance.js'),
},

//change htmlWebpackPlugin config like this
//Attention to dependence
new htmlWebpackPlugin({
    ...
    chunks: ['performance','vendors','main'],
    chunksSortMode: 'manual',
}),

```

### Options
```js
Performance({
    domain:'http://some.com/api', 
    outtime:500,
    isPage:true,
    isAjax:true,
    isResource:true,
    isError:true,
    add:{
      appId:'123456'
    },
    filterUrl:['http://localhost:35729/livereload.js?snipver=1']
},(data)=>{
  fetch('http://some.com/api',{
    type:'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    type:'report-data',
    body:JSON.stringify(data)
  }).then((data)=>{})
})
```

* 同时传入 domain和传入的function ，function优先级更高
* domain  ：上报api接口
* outtime ：上报延迟时间，保证异步数据的加载 （默认：300ms）
* isPage  ：是否上报页面性能数据 （默认：true）
* isResource  ：是否上报页面资源性能数据 （默认：true）
* isError ：是否上报页面错误信息数据 （默认：true）
* isAjax ：是否上报ajax信息
* add ：附带参数
* filterUrl ：不需要上报的ajax请求 （例如开发模式下的livereload链接）
* filterUrl ：A request that does not need to be reported
* fn  ：自定义上报函数，上报方式可以用ajax可以用fetch (非必填：默认使用fetch)

### 对外方法：
一：addError  ：此方法向插件中自定义上报错误信息，vue,react，try{}catch 的报错信息均可采用此方法上报
案例：
```js
let message = 'js add error'
let col = 20
let line = 20
let resourceUrl = 'http://www.xxx.com/01.js'

Performance.addError({
      msg:message,
      col:col,
      line:line,
      resourceUrl:resourceUrl
})
```
二：addData  ：上报时自定义的数据
案例：
```js
Performance.addData((data)=>{
  data.name = 'wangwei'
  data.some = {
    name:'wangwie',
    age:20
  }
})

```

## USE Vue
If you use the Vue framework, you can do it like this.
* 1、Introduce Performance
* 2、Copy the following code
```js
import Performance from 'performance-report'

Vue.config.errorHandler = function (err, vm, info) {
    let { message, stack } = err;

    // Processing error
    let resourceUrl,col,line;
    let errs = stack.match(/\(.+?\)/)
    if(errs&&errs.length) errs = errs[0]
    errs=errs.replace(/\w.+js/g,$1=>{resourceUrl=$1;return '';})
    errs=errs.split(':')
    if(errs&&errs.length>1)line=parseInt(errs[1]||0);col=parseInt(errs[2]||0)

    // Fixed parameters
    // Call the Performance.addError method
    Performance.addError({
      msg:message,
      col:col,
      line:line,
      resourceUrl:resourceUrl
    })
}
```

## USE React
If you use the React framework, you can do it like this.
* 1、Introduce Performance
* 2、Error Handling in React 16.
If you don't know Error Handling.Go to the official website to understand
https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
react16之后提供Error Handling处理报错机制，父组件新增componentDidCatch钩子函数，父组件只能监听子组件的异常信息
```js
//Top reference
import Performance from 'performance-report'

//Parent component listens for subcomponent error information
componentDidCatch(error, info) {
    let {message,stack} = error  

    // Processing error
    let resourceUrl,col,line;
    let errs = stack.match(/\(.+?\)/)
    if(errs&&errs.length) errs = errs[0]
    errs=errs.replace(/\w.+js/g,$1=>{resourceUrl=$1;return '';})
    errs=errs.split(':')
    if(errs&&errs.length>1)line=parseInt(errs[1]||0);col=parseInt(errs[2]||0)

    // Fixed parameters
    // Call the Performance.addError method
    Performance.addError({
      msg:message,
      col:col,
      line:line,
      resourceUrl:resourceUrl
    })
}
```


## Runing
```js
git clone https://github.com/wangweianger/performance-report.git
npm install

//Development
npm run dev

//product
npm run build

//test page
http://localhost:8080/test/ 

```


## Return parameter description

| parameter name | describe | explain |
| --- | --- | --- |
| appVerfion | Current browser information |  |
| page | now page |  |
| preUrl | previous page |  |
|  |  |  |
| errorList | err list |  |
| ->t | now time |  |
| ->n | resource type | resource，js，ajax，fetch,other  |
| ->msg | error msg |  |
| ->method | resource request method | GET，POST |
| ->data->resourceUrl | Request resource path |  |
| ->data->col | js error col |  |
| ->data->line | js error line |  |
| ->data->status | ajax error state |  |
| ->data->text | ajax error msg |  |
|  |  |  |
| performance | page resource performance data |  |
| ->dnst | DNS parsing time |  |
| ->tcpt | TCP set up time |  |
| ->wit | White screen time |  |
| ->domt | DOM rendering completion time |  |
| ->lodt | Page onload time |  |
| ->radt | Page preparation time  |  |
| ->rdit | Page redirection time |  |
| ->uodt | unload time |  |
| ->reqt | request time consuming |  |
| ->andt | Page parsing DOM time consuming |  |
|  |  |  |
| resoruceList | Page resource performance data |  |
| ->decodedBodySize | body size |  |
| ->duration | Time consuming |  |
| ->method | Request method | GET,POST |
| ->name | Request resource path |  |
| ->nextHopProtocol | HTTP protocol version |  |
| ->type | Request resource type | script，img，fetchrequest，xmlhttprequest，other |

### A complete report of the report looks like this.
```js
{
  "time": 1524136760783, 
  "page": "http://localhost:8080/test/", 
  "preUrl": "", 
  "appId":"123456",
  "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36", 
  "errorList": [
    {
      "t": 1524136759597, 
      "n": "resource", 
      "msg": "img is load error", 
      "data": {
        "target": "img", 
        "type": "error", 
        "resourceUrl": "http://img1.imgtn.bd95510/"
      }, 
      "method": "GET"
    }, 
    {
      "t": 1524136759720, 
      "n": "js", 
      "msg": "ReferenceError: wangwei is not defined at http://localhost:8080/test/:73:15", 
      "data": {
        "resourceUrl": "http://localhost:8080/test/", 
        "line": 73, 
        "col": 15
      }, 
      "method": "GET"
    }, 
    {
      "t": 1524136759764, 
      "n": "fetch", 
      "msg": "fetch request error", 
      "data": {
        "resourceUrl": "http://mock-api.seosiwei.com/guest/order/api/order/getOrde", 
        "text": "TypeError: Failed to fetch", 
        "status": 0
      }, 
      "method": "POST"
    }, 
    {
      "t": 1524136759780, 
      "n": "ajax", 
      "msg": "ajax request error", 
      "data": {
        "resourceUrl": "http://mock-api.seosiwei.com/guest/home/api/shop/getHomeInitInf", 
        "text": "ajax request error", 
        "status": 0
      }, 
      "method": "GET"
    }
  ], 
  "performance": {
    "dnst": 0, 
    "tcpt": 0, 
    "wit": 542, 
    "domt": 693, 
    "lodt": 872, 
    "radt": 4, 
    "rdit": 0, 
    "uodt": 0, 
    "reqt": 540, 
    "andt": 168
  }, 
  "resourceList": [
    {
      "name": "http://localhost:8080/dist/performance-report.js", 
      "method": "GET", 
      "type": "script", 
      "duration": "73.70", 
      "decodedBodySize": 18666, 
      "nextHopProtocol": "http/1.1"
    }, 
    {
      "name": "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js", 
      "method": "GET", 
      "type": "script", 
      "duration": "0.00", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "h2"
    }, 
    {
      "name": "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=295864288,1887240069&fm=27&gp=0.jpg", 
      "method": "GET", 
      "type": "img", 
      "duration": "0.00", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "http/1.1"
    }, 
    {
      "name": "http://localhost:35729/livereload.js?snipver=1", 
      "method": "GET", 
      "type": "script", 
      "duration": "149.00", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "http/1.1"
    }, 
    {
      "name": "http://mock-api.seosiwei.com/guest/home/api/shop/getHomeInitInfo", 
      "method": "GET", 
      "type": "fetchrequest", 
      "duration": "48.80", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "http/1.1"
    }, 
    {
      "name": "http://mock-api.seosiwei.com/guest/order/api/order/getOrder", 
      "method": "POST", 
      "type": "xmlhttprequest", 
      "duration": "40.20", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "http/1.1"
    }
  ], 
  "addData": {
    "name": "wangwei", 
    "some": {
      "name": "wangwie", 
      "age": 20
    }
  }
}
```







