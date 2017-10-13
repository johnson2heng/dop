/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

window.Dop = function () {
    var my = this;

    this.extendJQ = function () {
        var that = this;
        var jQuery = function jQuery() {};
        var arr = [];
        var slice = arr.slice;
        var concat = arr.concat;
        var push = arr.push;
        var indexOf = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var _trim = "".trim;

        function isArraylike(obj) {
            var length = obj.length,
                type = jQuery.type(obj);

            if (type === "function" || jQuery.isWindow(obj)) {
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
        }

        jQuery.fn = jQuery.prototype = {};

        jQuery.extend = jQuery.fn.extend = function () {
            var options,
                name,
                src,
                copy,
                copyIsArray,
                clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !jQuery.isFunction(target)) {
                target = {};
            }

            // extend jQuery itself if only one argument is passed
            if (i === length) {
                target = this;
                i--;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : [];
                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = jQuery.extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        var jquery_fun = {

            isReady: true,

            error: function error(msg) {
                throw new Error(msg);
            },

            noop: function noop() {},

            // 判断是否是个函数
            isFunction: function isFunction(obj) {
                return typeof obj === "function";
            },

            //判断是否是数组
            isArray: Array.isArray,

            //判断指定参数是否是一个窗口。
            isWindow: function isWindow(obj) {
                return obj != null && obj === obj.window;
            },

            //是否是数字类型或者字符串类型数字
            isNumeric: function isNumeric(obj) {
                return obj - parseFloat(obj) >= 0;
            },

            //判断是否是一个纯粹的对象
            isPlainObject: function isPlainObject(obj) {
                // Not plain objects:
                // - Any object or value whose internal [[Class]] property is not "[object Object]"
                // - DOM nodes
                // - window
                if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                    return false;
                }

                // Support: Firefox <20
                // The try/catch suppresses exceptions thrown when attempting to access
                // the "constructor" property of certain host objects, ie. |window.location|
                // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
                try {
                    if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                        return false;
                    }
                } catch (e) {
                    return false;
                }

                // If the function hasn't returned already, we're confident that
                // |obj| is a plain object, created by {} or constructed with new Object
                return true;
            },

            //判断指定参数是否是一个空对象。
            isEmptyObject: function isEmptyObject(obj) {
                var name;
                for (name in obj) {
                    return false;
                }
                return true;
            },

            //确定JavaScript内置对象的类型，并返回小写形式的类型名称
            type: function type(obj) {
                if (obj == null) {
                    return obj + "";
                }
                // Support: Android < 4.0, iOS < 6 (functionish RegExp)
                return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
            },

            // 用于全局性地执行一段JavaScript代码。
            globalEval: function globalEval(code) {
                var script,
                    indirect = eval;

                code = jQuery.trim(code);

                if (code) {
                    // If the code includes a valid, prologue position
                    // strict mode pragma, execute code by injecting a
                    // script tag into the document.
                    if (code.indexOf("use strict") === 1) {
                        script = document.createElement("script");
                        script.text = code;
                        document.head.appendChild(script).parentNode.removeChild(script);
                    } else {
                        // Otherwise, avoid the DOM node creation, insertion
                        // and removal by using an indirect global eval
                        indirect(code);
                    }
                }
            },

            //判断传入的dom的nodeName是否和name匹配
            nodeName: function nodeName(elem, name) {
                return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
            },

            // 函数用于遍历指定的对象和数组，并以对象的每个属性(或数组的每个成员)作为上下文来遍历执行指定的函数。
            //object	Object类型指定需要遍历的对象或数组。callback(索引，值)	Function类型指定的用于循环执行的函数。
            each: function each(obj, callback, args) {
                var value,
                    i = 0,
                    length = obj.length,
                    isArray = isArraylike(obj);

                if (args) {
                    if (isArray) {
                        for (; i < length; i++) {
                            value = callback.apply(obj[i], args);

                            if (value === false) {
                                break;
                            }
                        }
                    } else {
                        for (i in obj) {
                            value = callback.apply(obj[i], args);

                            if (value === false) {
                                break;
                            }
                        }
                    }

                    // A special, fast, case for the most common use of each
                } else {
                    if (isArray) {
                        for (; i < length; i++) {
                            value = callback.call(obj[i], i, obj[i]);

                            if (value === false) {
                                break;
                            }
                        }
                    } else {
                        for (i in obj) {
                            value = callback.call(obj[i], i, obj[i]);

                            if (value === false) {
                                break;
                            }
                        }
                    }
                }

                return obj;
            },

            //去除字符串两端的空白字符。
            trim: function trim(text) {
                return text == null ? "" : _trim.call(text);
            },

            // 将一个类数组对象转换为真正的数组对象。
            makeArray: function makeArray(arr, results) {
                var ret = results || [];

                if (arr != null) {
                    if (isArraylike(Object(arr))) {
                        jQuery.merge(ret, typeof arr === "string" ? [arr] : arr);
                    } else {
                        push.call(ret, arr);
                    }
                }

                return ret;
            },

            //在数组中搜索指定的值，并返回其索引值。如果数组中不存在该值，则返回 -1。
            inArray: function inArray(elem, arr, i) {
                return arr == null ? -1 : indexOf.call(arr, elem, i);
            },

            //用于合并两个数组内容到第一个数组。
            merge: function merge(first, second) {
                var len = +second.length,
                    j = 0,
                    i = first.length;

                for (; j < len; j++) {
                    first[i++] = second[j];
                }

                first.length = i;

                return first;
            },

            /*作用：grep()使用指定的函数过滤数组中的元素，并返回过滤后的数组。
            语法：grep(array,callback,invert)。
            参数含义：
            array：带过滤数组。
            callback：数组过滤函数，该函数包含两个参数，第一个是当前数组元素的值
            ，第二个是数组元素的下标，即元素索引值。
            invert：布尔型可选项，默认为false，即返回的是过滤函数处理以后为true
            的数组；选项设置为false的时候，返回的是过滤函数处理以后为false的数组
            。*/
            grep: function grep(elems, callback, invert) {
                var callbackInverse,
                    matches = [],
                    i = 0,
                    length = elems.length,
                    callbackExpect = !invert;

                // Go through the array, only saving the items
                // that pass the validator function
                for (; i < length; i++) {
                    callbackInverse = !callback(elems[i], i);
                    if (callbackInverse !== callbackExpect) {
                        matches.push(elems[i]);
                    }
                }

                return matches;
            },

            // 使用指定函数处理数组中的每个元素(或对象的每个属性)，并将处理结果封装为新的数组返回。
            map: function map(elems, callback, arg) {
                var value,
                    i = 0,
                    length = elems.length,
                    isArray = isArraylike(elems),
                    ret = [];

                // Go through the array, translating each of the items to their new values
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback(elems[i], i, arg);

                        if (value != null) {
                            ret.push(value);
                        }
                    }

                    // Go through every key on the object,
                } else {
                    for (i in elems) {
                        value = callback(elems[i], i, arg);

                        if (value != null) {
                            ret.push(value);
                        }
                    }
                }

                // Flatten any nested arrays
                return concat.apply([], ret);
            },

            // A global GUID counter for objects
            guid: 1,

            // 接受一个已有的函数，并返回一个带特定上下文的新的函数。
            proxy: function proxy(fn, context) {
                var tmp, args, proxy;

                if (typeof context === "string") {
                    tmp = fn[context];
                    context = fn;
                    fn = tmp;
                }

                // Quick check to determine if target is callable, in the spec
                // this throws a TypeError, but we will just return undefined.
                if (!jQuery.isFunction(fn)) {
                    return undefined;
                }

                // Simulated bind
                args = slice.call(arguments, 2);
                proxy = function proxy() {
                    return fn.apply(context || this, args.concat(slice.call(arguments)));
                };

                // Set the guid of unique handler to the same of original handler, so it can be removed
                proxy.guid = fn.guid = fn.guid || jQuery.guid++;

                return proxy;
            },

            //输出当前时间
            now: Date.now
        };
        jQuery.extend(jquery_fun);

        //添加到this上面
        for (var i in jQuery) {
            that[i] = jQuery[i];
        }
        return jQuery;
    };

    this.jquery = this.extendJQ();

    //添加移动端的触摸事件
    this.AddTouchFun = function () {
        var that = this;
        //默认的配置选项
        that.settings = {
            tapDurationThreshold: 250, //触屏大于这个时间不当作tap
            scrollSupressionThreshold: 3, //触发touchmove的敏感度
            swipeDurationThreshold: 750, //大于这个时间不当作swipe
            horizontalDistanceThreshold: 30, //swipe的触发垂直方向move必须小于这个距离
            verticalDistanceThreshold: 75, //swipe的触发水平方向move必须大于这个距离
            tapHoldDurationThreshold: 750, //长按触发事件需要长按这个事件才可触发
            doubleTapInterval: 250 //双击事件触发中间的间隔必须小于这个时间
        };

        that.init = function (dom, callback, fun) {
            //时间存储
            that.date = {};
            //所有的可以触发的事件数组
            that.arr = ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'];
            //存储手指接触移动端的接触点的相关信息
            that.touch = {};

            //将传入的dom和回调函数存到对象当中
            that.dom = dom;
            that.callback = callback;

            var arr = fun.split(",");
            for (var i = 0; i < arr.length; i++) {
                //监听事件
                if (that.arr.indexOf(arr[i]) != -1) {
                    that[arr[i]]();
                }
            }
        };

        that.tap = function () {
            var currentTarget;
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.tap.end = e.changedTouches;
                that.tap.endTime = Number(new Date());
                if (that.tap.endTime - that.tap.startTime <= that.settings.tapDurationThreshold && that.tap.start.length === 1 && that.tap.end.length === 1 && that.getRange(that.tap.start[0].clientX, that.tap.start[0].clientY, that.tap.end[0].clientX, that.tap.end[0].clientY) < that.settings.scrollSupressionThreshold) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.tap.startTime = Number(new Date());
                that.tap.start = [];
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.tap.start.push(obj);
                    })();
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        that.singleTap = function () {
            var currentTarget;
            that.singleTap.timeOut = null; //预防与双击冲突的延迟器
            that.singleTap.type = false; //是否双击的标记
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.singleTap.end = e.changedTouches;
                that.singleTap.endTime = Number(new Date());
                if (that.singleTap.endTime - that.singleTap.startTime <= that.settings.tapDurationThreshold && that.singleTap.start.length === 1 && that.singleTap.end.length === 1 && that.getRange(that.singleTap.start[0].clientX, that.singleTap.start[0].clientY, that.singleTap.end[0].clientX, that.singleTap.end[0].clientY) < that.settings.scrollSupressionThreshold) {
                    if (that.singleTap.type) return;
                    that.singleTap.timeOut = setTimeout(function () {
                        that.callback.call(that.dom, currentTarget);
                    }, that.settings.doubleTapInterval);
                }

                document.removeEventListener("touchend", touchend);
            };

            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.singleTap.startTime = Number(new Date());
                that.singleTap.start = [];

                currentTarget = e;

                //双击清除singleTap事件
                if (that.singleTap.startTime - that.singleTap.endTime < that.settings.doubleTapInterval) {
                    clearTimeout(that.singleTap.timeOut);
                    that.singleTap.type = true;
                } else {
                    that.singleTap.type = false;
                }
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.singleTap.start.push(obj);
                    })();
                }

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        that.doubleTap = function () {
            var currentTarget;
            that.doubleTap.prevTime = 0; //定义一个记录上一次点击后鼠标抬起的时的时间变量
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.doubleTap.end = e.changedTouches;
                that.doubleTap.endTime = Number(new Date());
                if (that.doubleTap.endTime - that.doubleTap.startTime <= that.settings.tapDurationThreshold && that.doubleTap.start.length === 1 && that.doubleTap.end.length === 1 && that.getRange(that.doubleTap.start[0].clientX, that.doubleTap.start[0].clientY, that.doubleTap.end[0].clientX, that.doubleTap.end[0].clientY) < that.settings.scrollSupressionThreshold) {
                    if (that.doubleTap.prevTime != 0 && that.doubleTap.startTime - that.doubleTap.prevTime < that.settings.doubleTapInterval) {
                        that.callback.call(that.dom, currentTarget);
                    } else {
                        that.doubleTap.prevTime = that.doubleTap.endTime;
                    }
                } else {
                    that.doubleTap.prevTime = 0;
                }
            };
            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.doubleTap.startTime = Number(new Date());
                that.doubleTap.start = [];
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.doubleTap.start.push(obj);
                    })();
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        that.longTap = function () {
            var currentTarget;
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.longTap.startTime = Number(new Date());
                that.longTap.start = my.jquery.extend(true, {}, e.targetTouches[0]);
                that.longTap.move = null;

                currentTarget = e;

                //设置定时器，确定长按触发的事件
                that.longTap.timeOut = setTimeout(function () {
                    if (!that.longTap.move || Math.sqrt(Math.pow(Math.abs(that.longTap.start.clientX - that.longTap.move.clientX), 2) + Math.pow(Math.abs(that.longTap.start.clientY - that.longTap.move.clientY), 2)) < that.settings.scrollSupressionThreshold) {
                        mouseUp();
                        that.callback.call(that.dom, currentTarget);
                    } else {
                        mouseUp();
                    }
                }, that.settings.tapHoldDurationThreshold);

                document.addEventListener("touchmove", mouseMove);
                document.addEventListener("touchend", mouseUp);
            };

            var mouseMove = function mouseMove(event) {
                var e = event || window.event;
                that.longTap.move = my.jquery.extend(true, {}, e.targetTouches[0]);
            };

            var mouseUp = function mouseUp() {
                clearTimeout(that.longTap.timeOut);
                document.removeEventListener("touchmove", mouseMove);
                document.removeEventListener("touchend", mouseUp);
            };

            that.dom.addEventListener("touchstart", mouseDown);
        };

        that.swipe = function () {
            var currentTarget;
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.touch.start.length === 1 && that.touch.end.length === 1 && Math.sqrt(Math.pow(Math.abs(that.touch.start[0].clientX - that.touch.end[0].clientX), 2) + Math.pow(Math.abs(that.touch.start[0].clientY - that.touch.end[0].clientY), 2)) > that.settings.horizontalDistanceThreshold) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.touch.start.push(obj);
                    })();
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        that.swipeLeft = function () {
            var currentTarget;
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.touch.start.length === 1 && that.touch.end.length === 1 && that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.verticalDistanceThreshold && (that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) >= 315 || that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) <= 45)) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.touch.start.push(obj);
                    })();
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        that.swipeRight = function () {
            var currentTarget;
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.touch.start.length === 1 && that.touch.end.length === 1 && that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.verticalDistanceThreshold && that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) >= 135 && that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) <= 225) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.touch.start.push(obj);
                    })();
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        that.swipeUp = function () {
            var currentTarget;
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.touch.start.length === 1 && that.touch.end.length === 1 && that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.horizontalDistanceThreshold && that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > 45 && that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) < 135) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.touch.start.push(obj);
                    })();
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        that.swipeDown = function () {
            var currentTarget;
            var touchend = function touchend(event) {
                var e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.touch.start.length === 1 && that.touch.end.length === 1 && that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.horizontalDistanceThreshold && that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > 225 && that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) < 315) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            var touchstart = function touchstart(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                var len = e.targetTouches.length;
                for (var i = 0; i < len; i++) {
                    (function () {
                        var obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                        that.touch.start.push(obj);
                    })();
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);
        };

        //计算滑动的角度
        that.getAngle = function (px1, py1, px2, py2) {
            //两点的x、y值
            x = px2 - px1;
            y = py2 - py1;
            hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            //斜边长度
            cos = x / hypotenuse;
            radian = Math.acos(cos);
            //求出弧度
            angle = 180 / (Math.PI / radian);
            //用弧度算出角度
            if (y < 0) {
                angle = -angle;
            } else if (y == 0 && x < 0) {
                angle = 180;
            }
            return angle + 180;
        };

        //计算两点之间的距离
        that.getRange = function (px1, py1, px2, py2) {
            return Math.sqrt(Math.pow(Math.abs(px1 - px2), 2) + Math.pow(Math.abs(py1 - py2), 2));
        };
    };

    //添加pc端设备的鼠标交互事件
    this.AddComputerFun = function () {
        var that = this;
        //默认的配置选项
        that.settings = {
            tapDurationThreshold: 250, //触屏大于这个时间不当作tap
            scrollSupressionThreshold: 10, //触发touchmove的敏感度
            swipeDurationThreshold: 750, //大于这个时间不当作swipe
            horizontalDistanceThreshold: 30, //swipe的触发垂直方向move必须小于这个距离
            verticalDistanceThreshold: 75, //swipe的触发水平方向move必须大于这个距离
            tapHoldDurationThreshold: 750, //长按触发事件需要长按这个事件才可触发
            doubleTapInterval: 250 //双击事件触发中间的间隔必须小于这个时间
        };

        that.init = function (dom, callback, event, callback2) {
            that.dom = dom;
            that.callback = callback;
            //callback2兼容滚动事件上下两个方法的兼容
            that.callback2 = callback2;

            //时间存储
            that.date = {};
            //所有的可以触发的事件数组
            that.arr = ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap', "wheel"];
            //存储手指接触移动端的接触点的相关信息
            that.touch = {};

            var arr = event.split(" ");
            for (var i = 0; i < arr.length; i++) {
                //监听事件
                if (that.arr.indexOf(arr[i]) != -1) {
                    that[arr[i]]();
                }
            }
        };

        that.tap = function () {

            var currentTarget;

            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.touch.end = e;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.tapDurationThreshold && Math.sqrt(Math.pow(Math.abs(that.touch.start.clientX - that.touch.end.clientX), 2) + Math.pow(Math.abs(that.touch.start.clientY - that.touch.end.clientY), 2)) < that.settings.scrollSupressionThreshold && e.button === 0) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = event;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.singleTap = function () {
            var currentTarget;
            that.singleTap.timeOut = null; //预防与双击冲突的延迟器
            that.singleTap.type = false; //是否双击的标记
            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.singleTap.end = e;
                that.singleTap.endTime = Number(new Date());
                if (that.singleTap.endTime - that.singleTap.startTime <= that.settings.tapDurationThreshold && Math.sqrt(Math.pow(Math.abs(that.singleTap.start.clientX - that.singleTap.end.clientX), 2) + Math.pow(Math.abs(that.singleTap.start.clientY - that.singleTap.end.clientY), 2)) < that.settings.scrollSupressionThreshold) {
                    if (that.singleTap.type) return;
                    that.singleTap.timeOut = setTimeout(function () {
                        that.callback.call(that.dom, currentTarget);
                    }, that.settings.doubleTapInterval);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.singleTap.startTime = Number(new Date());
                that.singleTap.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                //双击清除singleTap事件
                if (that.singleTap.startTime - that.singleTap.endTime < that.settings.doubleTapInterval) {
                    clearTimeout(that.singleTap.timeOut);
                    that.singleTap.type = true;
                } else {
                    that.singleTap.type = false;
                }

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.doubleTap = function () {
            var currentTarget;
            that.doubleTap.prevTime = 0; //定义一个记录上一次点击后鼠标抬起的时的时间变量
            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.doubleTap.end = my.jquery.extend(true, {}, e);
                that.doubleTap.endTime = Number(new Date());
                if (that.doubleTap.endTime - that.doubleTap.startTime <= that.settings.tapDurationThreshold && Math.sqrt(Math.pow(Math.abs(that.doubleTap.start.clientX - that.doubleTap.end.clientX), 2) + Math.pow(Math.abs(that.doubleTap.start.clientY - that.doubleTap.end.clientY), 2)) < that.settings.scrollSupressionThreshold) {
                    if (that.doubleTap.prevTime != 0 && that.doubleTap.endTime - that.doubleTap.prevTime < that.settings.doubleTapInterval) {
                        that.callback.call(that.dom, currentTarget);
                    } else {
                        that.doubleTap.prevTime = that.doubleTap.endTime;
                    }
                } else {
                    that.doubleTap.prevTime = 0;
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.doubleTap.startTime = Number(new Date());
                that.doubleTap.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.longTap = function () {
            var currentTarget;
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.longTap.startTime = Number(new Date());
                that.longTap.start = my.jquery.extend(true, {}, e);
                that.longTap.move = null;

                currentTarget = e;

                //设置定时器，确定长按触发的事件
                that.longTap.timeOut = setTimeout(function () {
                    if (!that.longTap.move || Math.sqrt(Math.pow(Math.abs(that.longTap.start.clientX - that.longTap.move.clientX), 2) + Math.pow(Math.abs(that.longTap.start.clientY - that.longTap.move.clientY), 2)) < that.settings.scrollSupressionThreshold) {
                        mouseUp();
                        that.callback.call(that.dom, currentTarget);
                    } else {
                        mouseUp();
                    }
                }, that.settings.tapHoldDurationThreshold);

                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            };

            var mouseMove = function mouseMove(event) {
                var e = event || window.event;
                e.preventDefault();
                that.longTap.move = my.jquery.extend(true, {}, e);
            };

            var mouseUp = function mouseUp() {
                clearTimeout(that.longTap.timeOut);
                document.removeEventListener("mousemove", mouseMove);
                document.removeEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.swipe = function () {
            var currentTarget;
            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.touch.end = e;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.horizontalDistanceThreshold) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.swipeLeft = function () {
            var currentTarget;
            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.touch.end = e;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.verticalDistanceThreshold && (that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) >= 135 || that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) <= -135)) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.swipeRight = function () {
            var currentTarget;
            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.touch.end = e;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.verticalDistanceThreshold && that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) >= -45 && that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) <= 45) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.swipeUp = function () {
            var currentTarget;
            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.touch.end = e;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.horizontalDistanceThreshold && that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > -135 && that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) < -45) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.swipeDown = function () {
            var currentTarget;
            var mouseUp = function mouseUp(event) {
                var e = event || window.event;
                that.touch.end = e;
                that.date.end = Number(new Date());
                if (that.date.end - that.date.start <= that.settings.swipeDurationThreshold && that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.horizontalDistanceThreshold && that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > 45 && that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) < 135) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            var mouseDown = function mouseDown(event) {
                var e = event || window.event;
                e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);
        };

        that.wheel = function () {
            var dom = that.dom;
            var fun1 = that.callback;
            var fun2 = that.callback2;
            function scroll(event) {
                var e = event || window.event;
                if (e.wheelDelta) {
                    //除了firfox浏览器，别的浏览器的处理
                    wheel(-e.wheelDelta / 120, e);
                } else if (e.detail) {
                    //firefox浏览器的测试
                    if (e.detail === -3) {
                        wheel(-1, e);
                    } else if (e.detail === 3) {
                        wheel(1, e);
                    } else {
                        console.log("鼠标滚轮事件改了？", e.wheelDelta);
                    }
                }

                function wheel(index, event) {
                    if (index >= 0) {
                        //向下滚动
                        if (my.jquery.isFunction(fun1)) {
                            fun1.call(dom, event);
                        }
                    } else if (index < 0) {
                        //向上滚动
                        if (my.jquery.isFunction(fun2)) {
                            fun2.call(dom, event);
                        }
                    }
                }
            }

            //添加监听事件
            dom.addEventListener("mousewheel", scroll, false);
            dom.addEventListener("DOMMouseScroll", scroll, false);
        };

        //计算滑动的角度
        that.getAngle = function (px1, py1, px2, py2) {
            //两点的x、y值
            var x = px2 - px1;
            var y = py2 - py1;
            hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            //斜边长度
            cos = x / hypotenuse;
            radian = Math.acos(cos);
            //求出弧度
            angle = 180 / (Math.PI / radian);
            //用弧度算出角度
            if (y < 0) {
                angle = -angle;
            } else if (y == 0 && x < 0) {
                angle = 180;
            }
            return angle;
        };

        //计算两点之间的距离
        that.getRange = function (px1, py1, px2, py2) {
            return Math.sqrt(Math.pow(Math.abs(px1 - px2), 2) + Math.pow(Math.abs(py1 - py2), 2));
        };
    };

    //增加专用的交互事件
    var touch_fun = {
        click: function click(fun) {
            return this.each(this, function (index, dom) {
                if (my.browserRedirect() === "pc") {
                    new my.AddComputerFun().init(dom, fun, "tap");
                } else {
                    new my.AddTouchFun().init(dom, fun, "tap");
                }
            });
        },
        tap: function tap(fun) {
            return this.each(this, function (index, dom) {
                if (my.browserRedirect() === "pc") {
                    new my.AddComputerFun().init(dom, fun, "tap");
                } else {
                    new my.AddTouchFun().init(dom, fun, "tap");
                }
            });
        },
        swipe: function swipe(fun) {
            return this.each(this, function (index, dom) {});
        },
        on: function on(event, fun, fun2) {
            //fun2 兼容鼠标滚动事件第二个事件
            return this.each(this, function (index, dom) {
                if (my.browserRedirect() === "pc") {
                    new my.AddComputerFun().init(dom, fun, event, fun2);
                } else {
                    new my.AddTouchFun().init(dom, fun, event);
                }
            });
        },
        all: function all(event, fun, fun2) {
            //给dom绑定pc事件和移动端事件
            return this.each(this, function (index, dom) {
                new my.AddComputerFun().init(dom, fun, event, fun2); //pc事件
                new my.AddTouchFun().init(dom, fun, event); //移动端事件
            });
        }
    };

    //生成类似于jq的类数组对象
    this.touch = this.$ = function (dom) {
        var touch_obj = new Object();
        if (my.isDom(dom)) {
            [].push.call(touch_obj, dom);
        } else if (my.jquery.isArray(dom)) {
            [].push.apply(touch_obj, dom);
        } else if (dom.length > 0) {
            [].push.apply(touch_obj, dom);
        }

        this.jquery.extend(true, touch_obj, this.jquery, touch_fun);

        return touch_obj;
    };
};

Dop.prototype = {
    constructor: Dop,
    //判断是什么媒体设备的浏览器
    browserRedirect: function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        //调用方法，首先判断是移动端还是PC端，然后根据浏览器的分辨率判断是pad还是phone还是minphone
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            if (bIsIpad) {
                return "pad";
            } else if (document.body.clientWidth > 767 && document.body.clientHeight > 767) {
                return "pad";
            } else if (document.body.clientWidth < 400 || document.body.clientHeight < 400) {
                return "phone"; //小于320的minphone 暂时修改成phone
            } else {
                return "phone";
            }
        } else {
            return "pc";
        }
    },
    //深拷贝和浅拷贝(设置,对象，深/浅)
    cloneObj: function cloneObj(settings, obj, boolean) {
        var bool = boolean || false;
        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) != "object") {
            return;
        }
        //首先判断是深拷贝还是浅拷贝 true 深   false 浅
        if (bool) {
            for (var i in obj) {
                if (_typeof(obj[i]) == "object" && !(obj[i] instanceof HTMLElement)) {
                    if (obj[i] instanceof Array) {
                        settings[i] = [];
                    } else {
                        settings[i] = {};
                    }
                    this.cloneObj(settings[i], obj[i], true);
                } else {
                    settings[i] = obj[i];
                }
            }
        } else {
            for (var i in obj) {
                settings[i] = obj[i];
            }
        }
    },
    //判断元素内是否包含另一个元素(元素，是否包含的另一个元素)
    inDom: function inDom(dom, include) {
        if (include && include.parentNode) {
            if (include.parentNode === dom) {
                return true;
            } else if (include.parentNode === document.body) {
                return false;
            } else {
                return this.inDom(dom, include.parentNode);
            }
        } else {
            return false;
        }
    },
    //获取浏览器的兼容性前缀
    getPrefix: function getPrefix() {
        var temp = document.body;
        var aPrefix = ["webkit", "Moz", "o", "ms"],
            props = "";
        for (var i in aPrefix) {
            props = aPrefix[i] + "Transition";
            if (temp.style[props] !== undefined) {
                return "-" + aPrefix[i].toLowerCase() + "-";
            }
        }
        return false;
    },
    //判断是否是一个dom对象
    isDom: function isDom(dom) {
        var is_Dom = (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === 'object' ? function (obj) {
            return obj instanceof HTMLElement;
        } : function (obj) {
            return obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        };
        return is_Dom(dom);
    },
    //鼠标上下滚轮事件(绑定的dom对象，向下滚动触发事件，向上滚动触发事件）
    wheel: function wheel(dom, fun1, fun2) {
        var that = this;
        //获取传入的arguments的个数
        var argLen = arguments.length;
        function scroll(event) {
            var e = event || window.event;
            if (e.wheelDelta) {
                //除了firfox浏览器，别的浏览器的处理
                wheel(-e.wheelDelta / 120, e);
            } else if (e.detail) {
                //firefox浏览器的测试
                if (e.detail === -3) {
                    wheel(-1, e);
                } else if (e.detail === 3) {
                    wheel(1, e);
                } else {
                    console.log("鼠标滚轮事件改了？", e.wheelDelta);
                }
            }

            function wheel(index, event) {
                if (index >= 0) {
                    //向下滚动
                    if (argLen >= 2 && that.jquery.isFunction(fun1)) {
                        fun1.call(dom, event);
                    }
                } else if (index < 0) {
                    //向上滚动
                    if (argLen >= 3 && that.jquery.isFunction(fun2)) {
                        fun2.call(dom, event);
                    }
                }
            }
        }

        //添加监听事件
        dom.addEventListener("mousewheel", scroll, false);
        dom.addEventListener("DOMMouseScroll", scroll, false);
    },
    //给img对象添加悬停效果
    addImageHover: function addImageHover(img, normal, hover) {
        var imgNormal = new Image();
        var imgHover = new Image();
        imgNormal.src = normal;
        imgHover.src = hover;
        img.addEventListener("mouseenter", function () {
            img.src = imgHover.src;
        });
        img.addEventListener("mouseleave", function () {
            img.src = imgNormal.src;
        });
    }
};

/***/ })
/******/ ]);