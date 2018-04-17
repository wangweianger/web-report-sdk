## 健全完整的性能、错误、资源上报数据

### performance-report 是比较完整和健全的数据上报插件，它可以帮你完成以下功能：
>  * 当前页面URL  (data.page)
>  * 上一页面URL （data.preUrl）
>  * 当前浏览器版本信息 （data.appVersion）
>  * 页面性能数据信息   （data.performance），例如：页面加载时间，白屏时间，dns解析时间等
>  * 当前页面错误信息  （data.errorList） 包含（js,css,img,ajax,fetch 等错误信息）
>  * 当前页面所有资源性能数据 （data.resoruceList）,例如ajax,css,img等资源加载性能数据

### 使用方式
>  * 1、下载 dist/performance-report.min.js 到本地
>  * 2、使用script标签引入到html的头部（备注：放到所有js资源之前）
>  * 3、使用performance函数进行数据的监听上报

```html
<html>
<head>
	<meta charset="UTF-8">
	<title>performance test</title>
	<!-- 放到所有资源之前 防止抓取不到error信息 -->
	<script src="../dist/performance-report.min.js"></script>
	<script>
		//开始上报数据
		Performance({
		    domain:'http://some.com/api', //更改成你自己的上报地址域名
		})
	</script>
</head>
```

### 参数说明
```js
Performance({
    domain:'http://some.com/api', 
    outtime:500,
    isPage:true,
    isResource:true,
    isError:true,
},(data)=>{
	fetch('http://some.com/api',{type:'POST',body:JSON.stringify(result)}).then((data)=>{})
})
```

* 同时传入 domain和传入的function ，function优先级更高；
* domain		：上报api接口
* outtime	：上报延迟时间，保证异步数据的加载 （默认：1000ms）
* isPage		：是否上报页面性能数据        （默认：true）
* isResource	：是否上报页面资源性能数据 （默认：true）
* isError	：是否上报页面错误信息数据    （默认：true）
* fn			：自定义上报函数，上报方式可以用ajax可以用fetch  (非必填：默认使用fetch)

## 错误处理：
* 插件会处理所有的error信息并完成上报
* 错误处理分为4种类型
* 1.图片资源，js资源文本资源等资源错误信息 n='resource'
* 2.js报错，代码中的js报错  n='js'
* 3.ajax请求错误  		n='ajax'
* 4.fetch请求错误			n='fetch'

## AJAX处理：
* AJAX分为 XMLHttpRequest 和 Fetch的处理
* AJAX兼容老板般与新版本 例如：jq的1.x版本与2.x版本以上需要做兼容处理
* 拦截所有fetch请求信息，遇到错误时收集并上报

## 所有资源信息处理：
* 上报所有资源信息 资源类型以type来区分 type类型有
* script：js脚本资源
* img：图片资源
* fetchrequest：fetch请求资源
* xmlhttprequest：ajax请求资源
* other ：其他

## 运行方式
```js
git clone https://github.com/wangweianger/web-performance-report.git
npm install
//开发
npm run dev
//打包
npm run build

http://localhost:8080/test/ 页面测试

```


返回参数说明

| 参数名 | 描述 | 说明 |
| --- | --- | --- |
| appVerfion | 当前浏览器信息 |  |
| page | 当前页面 |  |
| preUrl | 上一页面 |  |
| errorList | 错误资源列表信息 |  |
| errorList->t | 资源时间 |  |
| errorList->n | 资源类型 | resource，js，ajax，fetch,other  |
| errorList->msg | 错误信息 |  |
| errorList->method | 资源请求方式 | GET，POST |
| errorList->data->resourceUrl | 请求资源路径 |  |
| errorList->data->col | js错误行 |  |
| errorList->data->line | js错误列 |  |
| errorList->data->status | ajax错误状态 |  |
| errorList->data->text | ajax错误信息 |  |
| performance | 页面资源性能数据(单位均为毫秒) |  |
| performance->dnst | DNS解析时间 |  |
| performance->tcpt | TCP建立时间 |  |
| performance->wit | 白屏时间 |  |
| performance->domt | dom渲染完成时间 |  |
| performance->lodt | 页面onload时间 |  |
| performance->radt | 页面准备时间  |  |
| performance->rdit | 页面重定向时间 |  |
| performance->uodt | unload时间 |  |
| performance->reqt | request请求耗时 |  |
| performance->andt | 页面解析dom耗时 |  |
| resoruceList | 页面资源性能数据 |  |
| resoruceList->decodedBodySize | 资源返回数据大小 |  |
| resoruceList->duration | 资源耗时 |  |
| resoruceList->method | 请求方式 | GET,POST |
| resoruceList->name | 请求资源路径 |  |
| resoruceList->nextHopProtocol | http协议版本 |  |
| resoruceList->type | 请求资源类型 | script，img，fetchrequest，xmlhttprequest，other |









