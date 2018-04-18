## Sound and complete performance, error and resource reporting data.

### performance-report It can help you complete the following functions：
>  * Current page URL  
>  * The last page URL 
>  * Current browser version information 
>  * Page performance data information   
>  * Current page error information  
>  * Current page all resource performance data .for example:ajax,css,img
>  * Don't worry about blocking pages.The size of the compressed resource is less than 6KB.Async Report.

### Complete front end performance monitoring system
https://github.com/wangweianger/web-performance-monitoring-system

## Browser usage

### Use
>  * 1、download dist/performance-report.min.js 
>  * 2、The use of the script tag to the head of the HTML
>  * 3、Using performance function to monitor and report data

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


### Webpack usage
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
    isResource:true,
    isError:true,
    filterUrl:['http://localhost:35729/livereload.js?snipver=1']
},(data)=>{
  fetch('http://some.com/api',{type:'POST',body:JSON.stringify(result)}).then((data)=>{})
})
```

* At the same time, domain and function parameters are introduced, and function has higher priority.
* domain    ：Report API interface
* outtime ：Reporting delay time to ensure asynchronous data loading （default：1000ms）
* isPage    ：Whether to report page performance data        （default：true）
* isResource  ：Whether to report page resource performance data （default：true）
* isError ：Whether or not to report page error data    （default：true）
* filterUrl ：A request that does not need to be reported
* fn      ：Custom reporting function

## USE Vue
If you use the Vue framework, you can do it like this.
* 1、Introduce Performance
* 2、Copy the following code
```
import Performance from './performance-report'
Vue.config.errorHandler = function (err, vm, info) {
    let { message, name,  stack } = err;

    // Processing error
    let resourceUrl,col,line;
    let errs = stack.match(/\(.+?\)/)
    if(errs&&errs.length) errs = errs[0]
    errs=errs.replace(/http.+js/g,$1=>{resourceUrl=$1;return '';})
    errs=errs.split(':')
    if(errs&&errs.length>2)line=parseInt(errs[1]);col=parseInt(errs[2])

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
git clone https://github.com/wangweianger/web-performance-report.git
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
| ->data->col | js error line |  |
| ->data->line | js error col |  |
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
  "page": "http://localhost:8080/test/", 
  "preUrl": "", 
  "appVersion": "5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36", 
  "errorList": [
    {
      "t": 1524017149094, 
      "n": "js", 
      "msg": "ReferenceError: wangwei is not defined
    at http://localhost:8080/test/:64:15", 
      "data": {
        "resourceUrl": "http://localhost:8080/test/", 
        "line": 64, 
        "col": 15
      }, 
      "method": "GET"
    }, 
    {
      "t": 1524017149102, 
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
      "t": 1524017149151, 
      "n": "fetch", 
      "msg": "fetch请求错误", 
      "data": {
        "resourceUrl": "http://mock-api.seosiwei.com/guest/order/api/order/getOrde", 
        "text": "TypeError: Failed to fetch", 
        "status": 0
      }, 
      "method": "POST"
    }, 
    {
      "t": 1524017149154, 
      "n": "ajax", 
      "msg": "ajax请求路径有误", 
      "data": {
        "resourceUrl": "http://mock-api.seosiwei.com/guest/home/api/shop/getHomeInitInf", 
        "text": "ajax请求路径有误", 
        "status": 0
      }, 
      "method": "GET"
    }
  ], 
  "performance": {
    "dnst": 0, 
    "tcpt": 2, 
    "wit": 304, 
    "domt": 445, 
    "lodt": 677, 
    "radt": 7, 
    "rdit": 0, 
    "uodt": 0, 
    "reqt": 294, 
    "andt": 223
  }, 
  "resourceList": [
    {
      "name": "http://localhost:8080/dist/performance-report.js", 
      "method": "GET", 
      "type": "script", 
      "duration": "81.70", 
      "decodedBodySize": 17589, 
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
      "duration": "138.60", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "http/1.1"
    }, 
    {
      "name": "http://mock-api.seosiwei.com/guest/home/api/shop/getHomeInitInfo", 
      "method": "GET", 
      "type": "fetchrequest", 
      "duration": "55.80", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "http/1.1"
    }, 
    {
      "name": "http://mock-api.seosiwei.com/guest/order/api/order/getOrder", 
      "method": "POST", 
      "type": "xmlhttprequest", 
      "duration": "43.40", 
      "decodedBodySize": 0, 
      "nextHopProtocol": "http/1.1"
    }
  ]
}
```







