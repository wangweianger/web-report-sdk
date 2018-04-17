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
完整的调用方式为：
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

>  * 同时传入 domain和传入的function ，function优先级更高；
>  * domain		：上报api接口
>  * outtime	：上报延迟时间，保证异步数据的加载 （默认：1000ms）
>  * isPage		：是否上报页面性能数据        （默认：true）
>  * isResource	：是否上报页面资源性能数据 （默认：true）
>  * isError	：是否上报页面错误信息数据    （默认：true）
>  * fn			：自定义上报函数，上报方式可以用ajax可以用fetch  (非必填：默认使用fetch)

## 功能说明
### 错误处理
* 插件会处理所有的error信息并完成上报
* 错误处理分为4种类型
* 1.图片资源，js资源文本资源等资源错误信息 n='resource'
* 2.js报错，代码中的js报错  n='js'
* 3.ajax请求错误  		n='ajax'
* 4.fetch请求错误			n='fetch'
** 代码案例 **
```js
[
    {
      "t": 1523945465422, 
      "n": "js", 
      "msg": "ReferenceError: wangwei is not defined at http://localhost:8080/test/:59:15", 
      "data": {
        "resourceUrl": "http://localhost:8080/test/", 
        "line": 59, 
        "col": 15
      }, 
      "method": "GET"
    }, 
  ]
```

















