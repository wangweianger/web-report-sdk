'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Performance({
    domain: 'http://some.com/api',
    outtime: 500,
    isPage: true,
    isResource: true,
    isError: true
});

// web msgs report function
function Performance(option, fn) {
    try {

        // report date
        var reportData = function reportData() {
            setTimeout(function () {
                if (opt.isPage) perforPage();
                if (opt.isResource) perforResource();
                var result = {
                    page: conf.page,
                    preUrl: conf.preUrl,
                    appVersion: conf.appVersion,
                    errorList: conf.errorList,
                    performance: conf.performance,
                    resourceList: conf.resourceList
                };
                fn && fn(result);
                if (!fn && window.fetch) {
                    fetch(opt.domain, {
                        method: 'POST',
                        type: 'report-data',
                        body: JSON.stringify(result)
                    });
                }
            }, opt.outtime);
        };

        //比较onload与ajax时间长度


        var getLargeTime = function getLargeTime() {
            if (conf.haveAjax && conf.haveFetch && loadTime && ajaxTime && fetchTime) {
                console.log('loadTime:' + loadTime + ',ajaxTime:' + ajaxTime + ',fetchTime:' + fetchTime);
                reportData();
            } else if (conf.haveAjax && !conf.haveFetch && loadTime && ajaxTime) {
                console.log('loadTime:' + loadTime + ',ajaxTime:' + ajaxTime);
                reportData();
            } else if (!conf.haveAjax && conf.haveFetch && loadTime && fetchTime) {
                console.log('loadTime:' + loadTime + ',fetchTime:' + fetchTime);
                reportData();
            } else if (!conf.haveAjax && !conf.haveFetch && loadTime) {
                console.log('loadTime:' + loadTime);
                reportData();
            }
        };

        // 统计页面性能


        var perforPage = function perforPage() {
            if (!window.performance) return;
            var timing = performance.timing;
            conf.performance = {
                // DNS解析时间
                dnst: timing.domainLookupEnd - timing.domainLookupStart || 0,
                //TCP建立时间
                tcpt: timing.connectEnd - timing.connectStart || 0,
                // 白屏时间  
                wit: timing.responseStart - timing.navigationStart || 0,
                //dom渲染完成时间
                domt: timing.domContentLoadedEventEnd - timing.navigationStart || 0,
                //页面onload时间
                lodt: timing.loadEventEnd - timing.navigationStart || 0,
                // 页面准备时间 
                radt: timing.fetchStart - timing.navigationStart || 0,
                // 页面重定向时间
                rdit: timing.redirectEnd - timing.redirectStart || 0,
                // unload时间
                uodt: timing.unloadEventEnd - timing.unloadEventStart || 0,
                //request请求耗时
                reqt: timing.responseEnd - timing.requestStart || 0,
                //页面解析dom耗时
                andt: timing.domComplete - timing.domInteractive || 0,
                // 上一页面
                pre: conf.preUrl
            };
        };

        // 统计页面资源性能


        var perforResource = function perforResource() {
            if (!window.performance && !window.performance.getEntries) return false;
            var resource = performance.getEntriesByType('resource');

            var resourceList = [];
            if (!resource && !resource.length) return resourceList;

            resource.forEach(function (item) {
                var json = {
                    name: item.name,
                    method: 'GET',
                    type: item.initiatorType,
                    duration: item.duration.toFixed(2) || 0,
                    decodedBodySize: item.decodedBodySize || 0,
                    nextHopProtocol: item.nextHopProtocol
                };
                if (conf.ajaxMsg && conf.ajaxMsg.length) {
                    for (var i = 0, len = conf.ajaxMsg.length; i < len; i++) {
                        if (conf.ajaxMsg[i].url === item.name) {
                            json.method = conf.ajaxMsg[i].method || 'GET';
                            json.type = conf.ajaxMsg[i].type || json.type;
                        }
                    }
                }
                resourceList.push(json);
            });
            conf.resourceList = resourceList;
        };

        // ajax重写


        var _Ajax = function _Ajax(funs) {
            window._ahrealxhr = window._ahrealxhr || XMLHttpRequest;
            XMLHttpRequest = function XMLHttpRequest() {
                this.xhr = new window._ahrealxhr();
                for (var attr in this.xhr) {
                    var type = "";
                    try {
                        type = _typeof(this.xhr[attr]);
                    } catch (e) {}
                    if (type === "function") {
                        this[attr] = hookfun(attr);
                    } else {
                        Object.defineProperty(this, attr, {
                            get: getFactory(attr),
                            set: setFactory(attr)
                        });
                    }
                }
            };
            function getFactory(attr) {
                return function () {
                    return this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
                };
            }
            function setFactory(attr) {
                return function (f) {
                    var xhr = this.xhr;
                    var that = this;
                    if (attr.indexOf("on") != 0) {
                        this[attr + "_"] = f;
                        return;
                    }
                    if (funs[attr]) {
                        xhr[attr] = function () {
                            funs[attr](that) || f.apply(xhr, arguments);
                        };
                    } else {
                        xhr[attr] = f;
                    }
                };
            }
            function hookfun(fun) {
                return function () {
                    var args = [].slice.call(arguments);
                    if (funs[fun] && funs[fun].call(this, args, this.xhr)) {
                        return;
                    }
                    return this.xhr[fun].apply(this.xhr, args);
                };
            }
            return window._ahrealxhr;
        };

        // 拦截fetch请求


        var _fetch = function _fetch() {
            if (!window.fetch) return;
            var _fetch = fetch;
            window.fetch = function () {
                var _arg = arguments;
                var result = fetArg(_arg);
                if (result.type !== 'report-data') {
                    clearPerformance();
                    conf.ajaxMsg.push(result);
                    conf.fetLength = conf.fetLength + 1;
                    conf.haveFetch = true;
                }
                return _fetch.apply(this, arguments).then(function (res) {
                    if (result.type === 'report-data') return;
                    getFetchTime('success');
                    return res;
                }).catch(function (err) {
                    if (result.type === 'report-data') return;
                    getFetchTime('error');
                    //error
                    var defaults = Object.assign({}, errordefo);
                    defaults.t = new Date().getTime();
                    defaults.n = 'fetch';
                    defaults.msg = 'fetch请求错误';
                    defaults.method = result.method;
                    defaults.data = {
                        resourceUrl: result.url,
                        text: err.stack || err,
                        status: 0
                    };
                    conf.errorList.push(defaults);
                    return err;
                });
            };
        };

        // fetch arguments


        var fetArg = function fetArg(arg) {
            var result = { method: 'GET', type: 'fetchrequest' };
            var args = Array.prototype.slice.apply(arg);

            if (!args || !args.length) return result;
            try {
                if (args.length === 1) {
                    if (typeof args[0] === 'string') {
                        result.url = args[0];
                    } else if (_typeof(args[0]) === 'object') {
                        result.url = args[0].url;
                        result.method = args[0].method;
                    }
                } else {
                    result.url = args[0];
                    result.method = args[1].method;
                    result.type = args[1].type;
                }
            } catch (err) {}
            return result;
        };

        // 拦截js error信息


        var _error = function _error() {
            // img,script,css,jsonp
            window.addEventListener('error', function (e) {
                var defaults = Object.assign({}, errordefo);
                defaults.n = 'resource';
                defaults.t = new Date().getTime();
                defaults.msg = e.target.localName + ' is load error';
                defaults.method = 'GET';
                defaults.data = {
                    target: e.target.localName,
                    type: e.type,
                    resourceUrl: e.target.currentSrc
                };
                if (e.target != window) conf.errorList.push(defaults);
            }, true);
            // js
            window.onerror = function (msg, _url, line, col, error) {
                var defaults = Object.assign({}, errordefo);
                setTimeout(function () {
                    col = col || window.event && window.event.errorCharacter || 0;
                    defaults.msg = error && error.stack ? error.stack.toString() : msg;
                    defaults.method = 'GET';
                    defaults.data = {
                        resourceUrl: _url,
                        line: line,
                        col: col
                    };
                    defaults.t = new Date().getTime();
                    conf.errorList.push(defaults);
                }, 0);
            };
        };

        // ajax统一上报入口


        var ajaxResponse = function ajaxResponse(xhr, type) {
            var defaults = Object.assign({}, errordefo);
            defaults.t = new Date().getTime();
            defaults.n = 'ajax';
            defaults.msg = xhr.statusText || 'ajax请求错误';
            defaults.method = xhr.method;
            defaults.data = {
                resourceUrl: xhr.responseURL,
                text: xhr.statusText,
                status: xhr.status
            };
            conf.errorList.push(defaults);
        };

        // fetch get time


        var getFetchTime = function getFetchTime(type) {
            conf.fetchNum += 1;
            if (conf.fetLength === conf.fetchNum) {
                if (type == 'success') {
                    console.log('走了 fetch success 方法');
                } else {
                    console.log('走了 fetch error 方法');
                }
                conf.fetchNum = conf.fetLength = 0;
                fetchTime = new Date().getTime() - beginTime;
                getLargeTime();
            }
        };

        // ajax get time


        var getAjaxTime = function getAjaxTime(type) {
            conf.loadNum += 1;
            if (conf.loadNum === conf.ajaxLength) {
                if (type == 'load') {
                    console.log('走了AJAX onload 方法');
                } else if (type == 'readychange') {
                    console.log('走了AJAX onreadystatechange 方法');
                } else {
                    console.log('走了 error 方法');
                }
                conf.ajaxLength = conf.loadNum = 0;
                ajaxTime = new Date().getTime() - beginTime;
                getLargeTime();
            }
        };

        var clearPerformance = function clearPerformance(type) {
            if (!window.performance && !window.performance.clearResourceTimings) return;
            if (conf.haveAjax && conf.haveFetch && conf.ajaxLength == 0 && conf.fetLength == 0) {
                performance.clearResourceTimings();
            } else if (!conf.haveAjax && conf.haveFetch && conf.fetLength == 0) {
                performance.clearResourceTimings();
            } else if (conf.haveAjax && !conf.haveFetch && conf.ajaxLength == 0) {
                performance.clearResourceTimings();
            }
        };

        var opt = {
            // 上报地址
            domain: 'http://localhost/api',
            // 脚本延迟上报时间
            outtime: 1000,
            // ajax请求时需要过滤的url信息
            filterUrl: ['http://localhost:35729/livereload.js?snipver=1', 'http://localhost:8000/sockjs-node/info'],
            // 是否上报页面性能数据
            isPage: true,
            // 是否上报页面资源数据
            isResource: true,
            // 是否上报错误信息
            isError: true
        };
        opt = Object.assign(opt, option);
        var conf = {
            //资源列表 
            resourceList: [],
            // 页面性能列表
            performance: {},
            // 错误列表
            errorList: [],
            // 页面fetch数量
            fetchNum: 0,
            // ajax onload数量
            loadNum: 0,
            // 页面ajax数量
            ajaxLength: 0,
            // 页面fetch总数量
            fetLength: 0,
            // 页面ajax信息
            ajaxMsg: [],
            // ajax成功执行函数
            goingType: '',
            // 是否有ajax
            haveAjax: false,
            // 是否有fetch
            haveFetch: false,
            // 来自域名
            preUrl: document.referrer && document.referrer !== location.href ? document.referrer : '',
            // 浏览器信息
            appVersion: navigator.appVersion,
            // 当前页面
            page: location.href
            // error default
        };var errordefo = {
            t: '', //发送数据时的时间戳
            n: 'js', //模块名,
            msg: '', //错误的具体信息,
            data: {}
        };

        var beginTime = new Date().getTime();
        var loadTime = 0;
        var ajaxTime = 0;
        var fetchTime = 0;

        // error上报
        if (opt.isError) _error();

        // 绑定onload事件
        addEventListener("load", function () {
            loadTime = new Date().getTime() - beginTime;
            getLargeTime();
        }, false);

        // 执行fetch重写
        if (opt.isResource || opt.isError) _fetch();

        //  拦截ajax
        if (opt.isResource || opt.isError) _Ajax({
            onreadystatechange: function onreadystatechange(xhr) {
                if (xhr.readyState === 4) {
                    setTimeout(function () {
                        if (conf.goingType === 'load') return;
                        conf.goingType = 'readychange';

                        getAjaxTime('readychange');

                        if (xhr.status < 200 || xhr.status > 300) {
                            xhr.method = xhr.args.method;
                            ajaxResponse(xhr);
                        }
                    }, 600);
                }
            },
            onerror: function onerror(xhr) {
                getAjaxTime('error');
                if (xhr.args && xhr.args.length) {
                    xhr.method = xhr.args.method;
                    xhr.responseURL = xhr.args.url;
                    xhr.statusText = 'ajax请求路径有误';
                }
                ajaxResponse(xhr);
            },
            onload: function onload(xhr) {
                if (xhr.readyState === 4) {
                    if (conf.goingType === 'readychange') return;
                    conf.goingType = 'load';
                    getAjaxTime('load');
                    if (xhr.status < 200 || xhr.status > 300) {
                        xhr.method = xhr.args.method;
                        ajaxResponse(xhr);
                    }
                }
            },
            open: function open(arg, xhr) {
                if (opt.filterUrl && opt.filterUrl.length) {
                    var begin = false;
                    opt.filterUrl.forEach(function (item) {
                        if (arg[1].indexOf(item) != -1) begin = true;
                    });
                    if (begin) return;
                }

                var result = { url: arg[1], method: arg[0] || 'GET', type: 'xmlhttprequest' };
                this.args = result;

                clearPerformance();
                conf.ajaxMsg.push(result);
                conf.ajaxLength = conf.ajaxLength + 1;
                conf.haveAjax = true;
            }
        });
    } catch (err) {}
}