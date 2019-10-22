function Dop() {
    let my = this;

    //增加专用的交互事件
    let touch_fun = {
        tap: function (fun, preventDefault) {
            return this.each(this, function (index, dom) {
                if (my.browserRedirect() === "pc") {

                    new my.AddComputerFun().init({dom: dom, fun: fun, event: "tap", preventDefault: preventDefault});//pc事件
                }
                else {
                    new my.AddTouchFun().init({dom: dom, fun: fun, event: "tap", preventDefault: preventDefault});//移动端事件
                }
            });
        },
        swipe: function (fun, preventDefault) {
            return this.each(this, function (index, dom) {
                if (my.browserRedirect() === "pc") {
                    new my.AddComputerFun().init({dom: dom, fun: fun, event: "swipe", preventDefault: preventDefault});//pc事件
                }
                else {
                    new my.AddTouchFun().init({dom: dom, fun: fun, event: "swipe", preventDefault: preventDefault});//移动端事件
                }
            });
        },
        on: function (event, fun, fun2, preventDefault) {
            //fun2 兼容鼠标滚动事件第二个事件
            return this.each(this, function (index, dom) {
                //判断当前第三个值的类型
                if (typeof(fun2) === "function") {
                    if (my.browserRedirect() === "pc") {
                        new my.AddComputerFun().init({dom: dom, fun: fun, event: event, fun2: fun2, preventDefault: preventDefault});//pc事件
                    }
                    else {
                        new my.AddTouchFun().init({dom: dom, fun: fun, event: event, fun2: fun2, preventDefault: preventDefault});//移动端事件
                    }
                }
                else {
                    if (my.browserRedirect() === "pc") {
                        new my.AddComputerFun().init({dom: dom, fun: fun, event: event, preventDefault: fun2});//pc事件
                    }
                    else {
                        new my.AddTouchFun().init({dom: dom, fun: fun, event: event, preventDefault: fun2});//移动端事件
                    }
                }
            });
        },
        all: function (event, fun, fun2, preventDefault) {
            //给dom绑定pc事件和移动端事件
            return this.each(this, function (index, dom) {
                if (typeof(fun2) === "function") {
                    new my.AddComputerFun().init({dom: dom, fun: fun, event: event, fun2: fun2, preventDefault: preventDefault}); //pc事件
                    new my.AddTouchFun().init({dom: dom, fun: fun, event: event, fun2: fun2, preventDefault: preventDefault}); //移动端事件
                }
                else {
                    new my.AddComputerFun().init({dom: dom, fun: fun, event: event, preventDefault: fun2}); //pc事件
                    new my.AddTouchFun().init({dom: dom, fun: fun, event: event, preventDefault: fun2}); //移动端事件
                }
            });
        },
        remove: function (event, fun, preventDefault) {
            //解绑相关的事件
            return this.each(this, function (index, dom) {
                my.removeFun(dom, event, fun, preventDefault)
            });
        }
    };

    this.extendJQ = function () {
        var that = this;
        var jQuery = function () {

        };
        var arr = [];
        var slice = arr.slice;
        var concat = arr.concat;
        var push = arr.push;
        var indexOf = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var trim = "".trim;

        function isArraylike(obj) {
            var length = obj.length,
                type = jQuery.type(obj);

            if (type === "function" || jQuery.isWindow(obj)) {
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        }

        jQuery.fn = jQuery.prototype = {};

        jQuery.extend = jQuery.fn.extend = function () {
            var options, name, src, copy, copyIsArray, clone,
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
            if (typeof target !== "object" && !jQuery.isFunction(target)) {
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

            error: function (msg) {
                throw new Error(msg);
            },

            noop: function () {
            },

            // 判断是否是个函数
            isFunction: function (obj) {
                return typeof(obj) === "function";
            },

            //判断是否是数组
            isArray: Array.isArray,

            //判断指定参数是否是一个窗口。
            isWindow: function (obj) {
                return obj != null && obj === obj.window;
            },

            //是否是数字类型或者字符串类型数字
            isNumeric: function (obj) {
                return obj - parseFloat(obj) >= 0;
            },

            //判断是否是一个纯粹的对象
            isPlainObject: function (obj) {
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
                    if (obj.constructor &&
                        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
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
            isEmptyObject: function (obj) {
                var name;
                for (name in obj) {
                    return false;
                }
                return true;
            },

            //确定JavaScript内置对象的类型，并返回小写形式的类型名称
            type: function (obj) {
                if (obj == null) {
                    return obj + "";
                }
                // Support: Android < 4.0, iOS < 6 (functionish RegExp)
                return typeof obj === "object" || typeof obj === "function" ?
                    class2type[toString.call(obj)] || "object" :
                    typeof obj;
            },

            // 用于全局性地执行一段JavaScript代码。
            globalEval: function (code) {
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
            nodeName: function (elem, name) {
                return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
            },

            // 函数用于遍历指定的对象和数组，并以对象的每个属性(或数组的每个成员)作为上下文来遍历执行指定的函数。
            //object	Object类型指定需要遍历的对象或数组。callback(索引，值)	Function类型指定的用于循环执行的函数。
            each: function (obj, callback, args) {
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
            trim: function (text) {
                return text == null ? "" : trim.call(text);
            },

            // 将一个类数组对象转换为真正的数组对象。
            makeArray: function (arr, results) {
                var ret = results || [];

                if (arr != null) {
                    if (isArraylike(Object(arr))) {
                        jQuery.merge(ret,
                            typeof arr === "string" ?
                                [arr] : arr
                        );
                    } else {
                        push.call(ret, arr);
                    }
                }

                return ret;
            },

            //在数组中搜索指定的值，并返回其索引值。如果数组中不存在该值，则返回 -1。
            inArray: function (elem, arr, i) {
                return arr == null ? -1 : indexOf.call(arr, elem, i);
            },

            //用于合并两个数组内容到第一个数组。
            merge: function (first, second) {
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
            grep: function (elems, callback, invert) {
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
            map: function (elems, callback, arg) {
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
            proxy: function (fn, context) {
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
                proxy = function () {
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
        let that = this;
        //默认的配置选项
        that.settings = {
            tapDurationThreshold: 250,//触屏大于这个时间不当作tap
            scrollSupressionThreshold: 20,//触发touchmove的敏感度
            swipeDurationThreshold: 750,//大于这个时间不当作swipe
            horizontalDistanceThreshold: 40,//swipe的触发垂直方向move必须小于这个距离
            verticalDistanceThreshold: 75,//swipe的触发水平方向move必须大于这个距离
            tapHoldDurationThreshold: 750,//长按触发事件需要长按这个事件才可触发
            doubleTapInterval: 250//双击事件触发中间的间隔必须小于这个时间
        };

        that.init = function (obj) {
            //时间存储
            that.date = {};
            //所有的可以触发的事件数组
            that.arr = ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap', 'down', 'move', 'up'];
            //存储手指接触移动端的接触点的相关信息
            that.touch = {};

            //将传入的dom和回调函数存到对象当中
            that.dom = obj.dom;
            that.callback = obj.fun;

            let arr = obj.event.split(",");
            for (let i = 0; i < arr.length; i++) {
                //监听事件
                if (that.arr.indexOf(arr[i]) != -1) {
                    that[arr[i]](obj.preventDefault);
                }
            }

        };

        //点击事件
        that.tap = function (bool) {
            let currentTarget;
            let touchend = function (event) {
                let e = event || window.event;
                that.tap.end = e.changedTouches;
                that.tap.endTime = Number(new Date());
                if (
                    (that.tap.endTime - that.tap.startTime <= that.settings.tapDurationThreshold) &&
                    (that.tap.start.length === 1) &&
                    (that.tap.end.length === 1) &&
                    (that.getRange(that.tap.start[0].clientX, that.tap.start[0].clientY, that.tap.end[0].clientX, that.tap.end[0].clientY) < that.settings.scrollSupressionThreshold)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.tap.startTime = Number(new Date());
                that.tap.start = [];
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.tap.start.push(obj);
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.touchTap = touchstart;
        };

        //和双击不冲突的单击事件
        that.singleTap = function (bool) {
            let currentTarget;
            that.singleTap.timeOut = null;//预防与双击冲突的延迟器
            that.singleTap.type = false;//是否双击的标记
            let touchend = function (event) {
                var e = event || window.event;
                that.singleTap.end = e.changedTouches;
                that.singleTap.endTime = Number(new Date());
                if (
                    (that.singleTap.endTime - that.singleTap.startTime <= that.settings.tapDurationThreshold) &&
                    (that.singleTap.start.length === 1) &&
                    (that.singleTap.end.length === 1) &&
                    (that.getRange(that.singleTap.start[0].clientX, that.singleTap.start[0].clientY, that.singleTap.end[0].clientX, that.singleTap.end[0].clientY) < that.settings.scrollSupressionThreshold)
                ) {
                    if (that.singleTap.type) return;
                    that.singleTap.timeOut = setTimeout(function () {
                        that.callback.call(that.dom, currentTarget);
                    }, that.settings.doubleTapInterval);
                }

                document.removeEventListener("touchend", touchend);
            };

            //设置手指触发事件
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.singleTap.startTime = Number(new Date());
                that.singleTap.start = [];

                currentTarget = e;

                //双击清除singleTap事件
                if (that.singleTap.startTime - that.singleTap.endTime < that.settings.doubleTapInterval) {
                    clearTimeout(that.singleTap.timeOut);
                    that.singleTap.type = true;
                }
                else {
                    that.singleTap.type = false;
                }
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.singleTap.start.push(obj);
                }

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.singleTouchTap = touchstart;
        };

        //双击事件
        that.doubleTap = function (bool) {
            let currentTarget;
            that.doubleTap.prevTime = 0;//定义一个记录上一次点击后鼠标抬起的时的时间变量
            let touchend = function (event) {
                let e = event || window.event;
                that.doubleTap.end = e.changedTouches;
                that.doubleTap.endTime = Number(new Date());
                if (
                    (that.doubleTap.endTime - that.doubleTap.startTime <= that.settings.tapDurationThreshold) &&
                    (that.doubleTap.start.length === 1) &&
                    (that.doubleTap.end.length === 1) &&
                    (that.getRange(that.doubleTap.start[0].clientX, that.doubleTap.start[0].clientY, that.doubleTap.end[0].clientX, that.doubleTap.end[0].clientY) < that.settings.scrollSupressionThreshold)
                ) {
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
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.doubleTap.startTime = Number(new Date());
                that.doubleTap.start = [];
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.doubleTap.start.push(obj);
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.doubleTouchTap = touchstart;
        };

        //长按事件
        that.longTap = function (bool) {
            let currentTarget;
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.longTap.startTime = Number(new Date());
                that.longTap.start = my.jquery.extend(true, {}, e.targetTouches[0]);
                that.longTap.move = null;

                currentTarget = e;

                //设置定时器，确定长按触发的事件
                that.longTap.timeOut = setTimeout(function () {
                    if (!that.longTap.move ||
                        that.getRange(that.longTap.start.clientX, that.longTap.start.clientY, that.longTap.move.clientX, that.longTap.move.clientY) < that.settings.scrollSupressionThreshold) {
                        mouseUp();
                        that.callback.call(that.dom, currentTarget);
                    }
                    else {
                        mouseUp();
                    }
                }, that.settings.tapHoldDurationThreshold);

                document.addEventListener("touchmove", mouseMove);
                document.addEventListener("touchend", mouseUp);
            };

            let mouseMove = function (event) {
                let e = event || window.event;
                that.longTap.move = my.jquery.extend(true, {}, e.targetTouches[0]);
            };

            let mouseUp = function () {
                clearTimeout(that.longTap.timeOut);
                document.removeEventListener("touchmove", mouseMove);
                document.removeEventListener("touchend", mouseUp);
            };

            that.dom.addEventListener("touchstart", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.longTouchTap = mouseDown;
        };

        //滑动事件
        that.swipe = function (bool) {
            let currentTarget;
            let touchend = function (event) {
                let e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.touch.start.length === 1) &&
                    (that.touch.end.length === 1) &&
                    that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.horizontalDistanceThreshold
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };

            //设置手指触发事件
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.touch.start.push(obj);
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.touchSwipe = touchstart;
        };

        //向左滑动事件
        that.swipeLeft = function (bool) {
            let currentTarget;
            let touchend = function (event) {
                let e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.touch.start.length === 1) &&
                    (that.touch.end.length === 1) &&
                    (that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.verticalDistanceThreshold) &&
                    (that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) >= 315 ||
                        that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) <= 45)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.touch.start.push(obj);
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.touchSwipeLeft = touchstart;
        };

        //向右滑动事件
        that.swipeRight = function (bool) {
            let currentTarget;
            let touchend = function (event) {
                let e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.touch.start.length === 1) &&
                    (that.touch.end.length === 1) &&
                    (that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.verticalDistanceThreshold) &&
                    (that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) >= 135 &&
                        that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) <= 225)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.touch.start.push(obj);
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.touchSwipeRight = touchstart;
        };

        //向上滑动事件
        that.swipeUp = function (bool) {
            let currentTarget;
            let touchend = function (event) {
                let e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.touch.start.length === 1) &&
                    (that.touch.end.length === 1) &&
                    (that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.horizontalDistanceThreshold) &&
                    (that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > 45 &&
                        that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) < 135)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.touch.start.push(obj);
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.touchSwipeUp = touchstart;
        };

        //向下滑动事件
        that.swipeDown = function (bool) {
            let currentTarget;
            let touchend = function (event) {
                let e = event || window.event;
                that.touch.end = e.changedTouches;
                that.date.end = Number(new Date());
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.touch.start.length === 1) &&
                    (that.touch.end.length === 1) &&
                    (that.getRange(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > that.settings.horizontalDistanceThreshold) &&
                    (that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) > 225 &&
                        that.getAngle(that.touch.start[0].clientX, that.touch.start[0].clientY, that.touch.end[0].clientX, that.touch.end[0].clientY) < 315)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("touchend", touchend);
            };
            //设置手指触发事件
            let touchstart = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = [];
                let len = e.targetTouches.length;
                for (let i = 0; i < len; i++) {
                    let obj = my.jquery.extend(true, {}, e.targetTouches[i]);
                    that.touch.start.push(obj);
                }

                currentTarget = e;

                document.addEventListener("touchend", touchend);
            };

            that.dom.addEventListener("touchstart", touchstart);

            //将事件绑定到dom身上，供后面清除
            that.dom.touchSwipeDown = touchstart;
        };

        //按下事件
        that.down = function (bool) {
            that.dom.addEventListener("touchstart", that.callback, bool);
        };

        //移动事件
        that.move = function (bool) {
            that.dom.addEventListener("touchmove", that.callback, bool);
        };

        //抬起事件
        that.up = function (bool) {
            that.dom.addEventListener("touchend", that.callback, bool);
        };

        //计算滑动的角度
        that.getAngle = function (px1, py1, px2, py2) {
            //两点的x、y值
            let x = px2 - px1;
            let y = py2 - py1;
            let hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            //斜边长度
            let cos = x / hypotenuse;
            let radian = Math.acos(cos);
            //求出弧度
            let angle = 180 / (Math.PI / radian);
            //用弧度算出角度
            if (y < 0) {
                angle = -angle;
            } else if ((y == 0) && (x < 0)) {
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
        let that = this;
        //默认的配置选项
        that.settings = {
            tapDurationThreshold: 250,//触屏大于这个时间不当作tap
            scrollSupressionThreshold: 5,//触发touchmove的敏感度
            swipeDurationThreshold: 750,//大于这个时间不当作swipe
            horizontalDistanceThreshold: 40,//swipe的触发垂直方向move必须大于这个距离
            verticalDistanceThreshold: 75,//swipe的触发水平方向move必须大于这个距离
            tapHoldDurationThreshold: 750,//长按触发事件需要长按这个事件才可触发
            doubleTapInterval: 250//双击事件触发中间的间隔必须小于这个时间
        };

        that.init = function (obj) {
            that.dom = obj.dom;
            that.callback = obj.fun;
            //callback2兼容滚动事件上下两个方法的兼容
            that.callback2 = obj.fun2;

            //时间存储
            that.date = {};
            //所有的可以触发的事件数组
            that.arr = ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap', "wheel", 'down', 'move', 'up'];
            //存储手指接触移动端的接触点的相关信息
            that.touch = {};

            let arr = obj.event.split(",");
            for (let i = 0; i < arr.length; i++) {
                //监听事件
                if (that.arr.indexOf(arr[i]) != -1) {
                    that[arr[i]](obj.preventDefault);
                }
            }
        };

        //点击事件
        that.tap = function (bool) {

            let currentTarget;

            //手指抬起事件
            let mouseUp = function (event) {
                let e = event || window.event;
                that.touch.end = e;
                that.date.end = +new Date();
                if (
                    that.date.end - that.date.start <= that.settings.tapDurationThreshold &&
                    that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) < that.settings.scrollSupressionThreshold &&
                    e.button === 0
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };


            //设置手指按下事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = Number(new Date());
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = event;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.mouseTap = mouseDown;
        };

        //和双击不冲突的单击事件
        that.singleTap = function (bool) {
            let currentTarget;
            that.singleTap.timeOut = null;//预防与双击冲突的延迟器
            that.singleTap.type = false;//是否双击的标记

            let mouseUp = function (event) {
                let e = event || window.event;
                that.singleTap.end = e;
                that.singleTap.endTime = +new Date();
                if (
                    that.singleTap.endTime - that.singleTap.startTime <= that.settings.tapDurationThreshold &&
                    that.getRange(that.singleTap.start.clientX, that.singleTap.start.clientY, that.singleTap.end.clientX, that.singleTap.end.clientY) < that.settings.scrollSupressionThreshold
                ) {
                    if (that.singleTap.type) return;
                    that.singleTap.timeOut = setTimeout(function () {
                        that.callback.call(that.dom, currentTarget);
                    }, that.settings.doubleTapInterval);
                }

                document.removeEventListener("mouseup", mouseUp);
            };

            //设置手指触发事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.singleTap.startTime = +new Date();
                that.singleTap.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                //双击清除singleTap事件
                if (that.singleTap.startTime - that.singleTap.endTime < that.settings.doubleTapInterval) {
                    clearTimeout(that.singleTap.timeOut);
                    that.singleTap.type = true;
                }
                else {
                    that.singleTap.type = false;
                }

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.singleMouseTap = mouseDown;
        };

        //双击事件
        that.doubleTap = function (bool) {
            let currentTarget;
            that.doubleTap.prevTime = 0;//定义一个记录上一次点击后鼠标抬起的时的时间变量

            let mouseUp = function (event) {
                let e = event || window.event;
                that.doubleTap.end = my.jquery.extend(true, {}, e);
                that.doubleTap.endTime = +new Date();
                if (
                    (that.doubleTap.endTime - that.doubleTap.startTime <= that.settings.tapDurationThreshold) &&
                    that.getRange(that.doubleTap.start.clientX, that.doubleTap.start.clientY, that.doubleTap.end.clientX, that.doubleTap.end.clientY) < that.settings.scrollSupressionThreshold
                ) {
                    if (that.doubleTap.prevTime != 0 && that.doubleTap.endTime - that.doubleTap.prevTime < that.settings.doubleTapInterval) {
                        that.callback.call(that.dom, currentTarget);
                    }
                    else {
                        that.doubleTap.prevTime = that.doubleTap.endTime;
                    }
                }
                else {
                    that.doubleTap.prevTime = 0;
                }

                document.removeEventListener("mouseup", mouseUp);
            };

            //设置手指触发事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.doubleTap.startTime = +new Date();
                that.doubleTap.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.doubleMouseTap = mouseDown;
        };

        //长按事件
        that.longTap = function (bool) {
            let currentTarget;
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.longTap.startTime = +new Date();
                that.longTap.start = my.jquery.extend(true, {}, e);
                that.longTap.move = null;

                currentTarget = e;

                //设置定时器，确定长按触发的事件
                that.longTap.timeOut = setTimeout(function () {
                    if (!that.longTap.move ||
                        that.getRange(that.longTap.start.clientX, that.longTap.start.clientY, that.longTap.move.clientX, that.longTap.move.clientY) < that.settings.scrollSupressionThreshold) {
                        mouseUp();
                        that.callback.call(that.dom, currentTarget);
                    }
                    else {
                        mouseUp();
                    }
                }, that.settings.tapHoldDurationThreshold);

                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            };

            let mouseMove = function (event) {
                var e = event || window.event;
                that.longTap.move = my.jquery.extend(true, {}, e);
            };

            let mouseUp = function () {
                clearTimeout(that.longTap.timeOut);
                document.removeEventListener("mousemove", mouseMove);
                document.removeEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.longMouseTap = mouseDown;
        };

        //滑动事件
        that.swipe = function (bool) {
            let currentTarget;

            let mouseUp = function (event) {
                let e = event || window.event;
                that.swipe.end = e;
                that.date.end = +new Date();
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    that.getRange(that.swipe.start.clientX, that.swipe.start.clientY, that.swipe.end.clientX, that.swipe.end.clientY) > that.settings.horizontalDistanceThreshold
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };

            //设置手指触发事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = +new Date();
                that.swipe.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.mouseSwipe = mouseDown;
        };

        //向左滑动事件
        that.swipeLeft = function (bool) {
            let currentTarget;
            let mouseUp = function (event) {
                let e = event || window.event;
                that.touch.end = e;
                that.date.end = Number(new Date());
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.verticalDistanceThreshold) &&
                    (that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) >= 135 ||
                        that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) <= -135)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };

            //设置手指触发事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = +new Date();
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.mouseSwipeLeft = mouseDown;
        };

        //向右滑动事件
        that.swipeRight = function (bool) {
            let currentTarget;
            let mouseUp = function (event) {
                let e = event || window.event;
                that.touch.end = e;
                that.date.end = +new Date();
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.verticalDistanceThreshold) &&
                    (that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) >= -45 &&
                        that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) <= 45)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };

            //设置手指触发事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = +new Date();
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.mouseSwipeRight = mouseDown;
        };

        //向上滑动事件
        that.swipeUp = function (bool) {
            let currentTarget;

            let mouseUp = function (event) {
                let e = event || window.event;
                that.touch.end = e;
                that.date.end = +new Date();
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.horizontalDistanceThreshold) &&
                    (that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > -135 &&
                        that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) < -45)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };

            //设置手指触发事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = +new Date();
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.mouseSwipeUp = mouseDown;
        };

        //向下滑动事件
        that.swipeDown = function (bool) {
            let currentTarget;
            let mouseUp = function (event) {
                let e = event || window.event;
                that.touch.end = e;
                that.date.end = +new Date();
                if (
                    (that.date.end - that.date.start <= that.settings.swipeDurationThreshold) &&
                    (that.getRange(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > that.settings.horizontalDistanceThreshold) &&
                    (that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) > 45 &&
                        that.getAngle(that.touch.start.clientX, that.touch.start.clientY, that.touch.end.clientX, that.touch.end.clientY) < 135)
                ) {
                    that.callback.call(that.dom, currentTarget);
                }

                document.removeEventListener("mouseup", mouseUp);
            };
            //设置手指触发事件
            let mouseDown = function (event) {
                let e = event || window.event;
                bool && e.preventDefault();
                that.date.start = +new Date();
                that.touch.start = my.jquery.extend(true, {}, e);

                currentTarget = e;

                document.addEventListener("mouseup", mouseUp);
            };

            that.dom.addEventListener("mousedown", mouseDown);

            //将事件绑定到dom身上，供后面清除
            that.dom.mouseSwipeDown = mouseDown;
        };

        //鼠标滚轮事件
        that.wheel = function (bool) {
            let dom = that.dom;
            let fun1 = that.callback;
            let fun2 = that.callback2;

            function scroll(event) {
                let e = event || window.event;
                bool && e.preventDefault();
                if (e.wheelDelta) {
                    //除了firfox浏览器，别的浏览器的处理
                    wheel(-e.wheelDelta / 120, e);
                }
                else if (e.detail) {
                    //firefox浏览器的测试
                    if (e.detail === -3) {
                        wheel(-1, e);
                    }
                    else if (e.detail === 3) {
                        wheel(1, e);
                    }
                    else {
                        console.log("鼠标滚轮事件改了？", e.wheelDelta);
                    }
                }

                function wheel(index, event) {
                    if (index >= 0) {
                        //向下滚动
                        if (my.jquery.isFunction(fun1)) {
                            fun1.call(dom, event);
                        }
                    }
                    else if (index < 0) {
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

            //将事件绑定到dom身上，供后面清除
            that.dom.mouseScroll = scroll;
        };

        //按下事件
        that.down = function (bool) {
            that.dom.addEventListener("mousedown", that.callback, bool);
        };

        //移动事件
        that.move = function (bool) {
            that.dom.addEventListener("mousemove", that.callback, bool);
        };

        //抬起事件
        that.up = function (bool) {
            that.dom.addEventListener("mouseup", that.callback, bool);
        };

        //计算滑动的角度
        that.getAngle = function (px1, py1, px2, py2) {
            //两点的x、y值
            let x = px2 - px1;
            let y = py2 - py1;
            let hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            //斜边长度
            let cos = x / hypotenuse;
            let radian = Math.acos(cos);
            //求出弧度
            let angle = 180 / (Math.PI / radian);
            //用弧度算出角度
            if (y < 0) {
                angle = -angle;
            } else if ((y == 0) && (x < 0)) {
                angle = 180;
            }
            return angle;
        };

        //计算两点之间的距离
        that.getRange = function (px1, py1, px2, py2) {
            return Math.sqrt(Math.pow(Math.abs(px1 - px2), 2) + Math.pow(Math.abs(py1 - py2), 2));
        };
    };

    //删除掉相关的方法的函数
    this.removeFun = function (dom, event, fun, prevent) {
        //dom：dom对象，event：事件，fun：清除函数，prevent：是否阻止冒泡

        //首先判断当前浏览器类型
        if (my.browserRedirect() !== "pc") {
            //判断是否含有function
            if(fun && event != "move" && event != "up" && event != "wheel"){
                dom.removeEventListener("touchstart",fun,prevent);
                return;
            }
            //移动端 如果没有则清除当前dom上绑定的函数
            switch (event) {
                case "tap":
                    dom.removeEventListener("touchstart", dom.touchTap, prevent);
                    break;
                case "singleTap":
                    dom.removeEventListener("touchstart", dom.singleTouchTap, prevent);
                    break;
                case "doubleTap":
                    dom.removeEventListener("touchstart", dom.doubleTouchTap, prevent);
                    break;
                case "longTap":
                    dom.removeEventListener("touchstart", dom.longTouchTap, prevent);
                    break;
                case "swipe":
                    dom.removeEventListener("touchstart", dom.touchSwipe, prevent);
                    break;
                case "swipeLeft":
                    dom.removeEventListener("touchstart", dom.touchSwipeLeft, prevent);
                    break;
                case "swipeRight":
                    dom.removeEventListener("touchstart", dom.touchSwipeRight, prevent);
                    break;
                case "swipeUp":
                    dom.removeEventListener("touchstart", dom.touchSwipeUp, prevent);
                    break;
                case "swipeDown":
                    dom.removeEventListener("touchstart", dom.touchSwipeDown, prevent);
                    break;
                case "down":
                    dom.removeEventListener("touchstart", fun, prevent);
                    break;
                case "move":
                    dom.removeEventListener("touchmove", fun, prevent);
                    break;
                case "up":
                    dom.removeEventListener("touchend", fun, prevent);
                    break;
                case "wheel":
                    dom.removeEventListener("mousewheel", dom.mouseScroll, prevent);
                    dom.removeEventListener("DOMMouseScroll", dom.mouseScroll, prevent);
                    break;
                default:
                    dom.removeEventListener(event,fun,prevent);
            }
        }
        else {
            //判断是否含有function
            if(fun && event != "move" && event != "up" && event != "wheel"){
                dom.removeEventListener("mousedown",fun,prevent);
                return;
            }
            //pc端
            switch (event) {
                case "tap":
                    dom.removeEventListener("mousedown", dom.mouseTap, prevent);
                    break;
                case "singleTap":
                    dom.removeEventListener("mousedown", dom.singleMouseTap, prevent);
                    break;
                case "doubleTap":
                    dom.removeEventListener("mousedown", dom.doubleMouseTap, prevent);
                    break;
                case "longTap":
                    dom.removeEventListener("mousedown", dom.longMouseTap, prevent);
                    break;
                case "swipe":
                    dom.removeEventListener("mousedown", dom.mouseSwipe, prevent);
                    break;
                case "swipeLeft":
                    dom.removeEventListener("mousedown", dom.mouseSwipeLeft, prevent);
                    break;
                case "swipeRight":
                    dom.removeEventListener("mousedown", dom.mouseSwipeRight, prevent);
                    break;
                case "swipeUp":
                    dom.removeEventListener("mousedown", dom.mouseSwipeUp, prevent);
                    break;
                case "swipeDown":
                    dom.removeEventListener("mousedown", dom.mouseSwipeDown, prevent);
                    break;
                case "wheel":
                    dom.removeEventListener("mousewheel", dom.mouseScroll, prevent);
                    dom.removeEventListener("DOMMouseScroll", dom.mouseScroll, prevent);
                    break;
                case "down":
                    dom.removeEventListener("mousedown", fun, prevent);
                    break;
                case "move":
                    dom.removeEventListener("mousemove", fun, prevent);
                    break;
                case "up":
                    dom.removeEventListener("mouseup", fun, prevent);
                    break;
                default:
                    dom.removeEventListener(event,fun,prevent);
            }
        }
    };

    //生成类似于jq的类数组对象
    this.touch = this.$ = function (dom) {
        let touch_obj = {};
        if (my.isDom(dom)) {
            [].push.call(touch_obj, dom);
        }
        else if (my.jquery.isArray(dom)) {
            [].push.apply(touch_obj, dom);
        }
        else if (dom.length > 0) {
            [].push.apply(touch_obj, dom);
        }
        else{
            [].push.call(touch_obj, dom);
        }

        this.jquery.extend(true, touch_obj, this.jquery, touch_fun);

        return touch_obj;
    }
};

Dop.prototype = {
    constructor: Dop,
    //判断是什么媒体设备的浏览器
    browserRedirect() {
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
                return "phone";//小于320的minphone 暂时修改成phone
            } else {
                return "phone";
            }
        } else {
            return "pc";
        }
    },
    //使用js获取get传值
    getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    //深拷贝和浅拷贝(设置,对象，深/浅)
    cloneObj(settings, obj, boolean) {
        var bool = boolean || false;
        if (typeof obj != "object") {
            return;
        }
        //首先判断是深拷贝还是浅拷贝 true 深   false 浅
        if (bool) {
            for (var i in obj) {
                if (typeof obj[i] == "object" && !(obj[i] instanceof HTMLElement)) {
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
    inDom(dom, include) {
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
    //判断鼠标的点的位置是否处于一个dom的位置范围内,x,y距离窗口左上角的client位置，dom，判断的dom
    positionInDom(x,y,dom){
        let box = dom.getBoundingClientRect();
        if(x >= box.left && x <= box.right && y >= box.top && y <= box.bottom){
            return true;
        }
        else{
            return false;
        }
    },
    //获取浏览器的兼容性前缀
    getPrefix() {
        let temp = document.body;
        let aPrefix = ["webkit", "Moz", "o", "ms"];
        for (let i in aPrefix) {
            let props = aPrefix[i] + "Transition";
            if (temp.style[props] !== undefined) {
                return "-" + aPrefix[i].toLowerCase() + "-";
            }
        }
        return false;
    },
    //判断是否是一个dom对象
    isDom(dom) {
        var is_Dom = (typeof HTMLElement === 'object') ?
            function (obj) {
                return obj instanceof HTMLElement;
            } :
            function (obj) {
                return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
            };
        return is_Dom(dom);
    },
    //鼠标上下滚轮事件(绑定的dom对象，向下滚动触发事件，向上滚动触发事件）
    wheel(dom, fun1, fun2) {
        let that = this;
        //获取传入的arguments的个数
        let argLen = arguments.length;

        function scroll(event) {
            let e = event || window.event;
            if (e.wheelDelta) {
                //除了firfox浏览器，别的浏览器的处理
                wheel(-e.wheelDelta / 120, e);
            }
            else if (e.detail) {
                //firefox浏览器的测试
                if (e.detail === -3) {
                    wheel(-1, e);
                }
                else if (e.detail === 3) {
                    wheel(1, e);
                }
                else {
                    console.log("鼠标滚轮事件改了？", e.wheelDelta);
                }
            }

            function wheel(index, event) {
                if (index >= 0) {
                    //向下滚动
                    if (argLen >= 2 && that.jquery.isFunction(fun1)) {
                        fun1.call(dom, event);
                    }
                }
                else if (index < 0) {
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

        //将绑定的事件添加到dom上面
        dom.mouseScroll = scroll;
    },
    //给img对象添加悬停效果
    addImageHover(img, normal, hover) {
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
    },
    //监听数组变化方法，(arr数组,callback回调函数)
    listenArray(arr, callback) {
        // 获取Array原型
        const arrayProto = Array.prototype;
        const arrayMethods = Object.create(arrayProto);
        let newArrProto = [];

        [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse'
        ].forEach(method => {
            // 原生Array的原型方法
            let original = arrayMethods[method];

            // 将push，pop等方法重新封装并定义在对象newArrProto的属性上
            // 这里需要注意的是封装好的方法是定义在newArrProto的属性上而不是其原型属性
            // newArrProto.__proto__ 没有改变
            newArrProto[method] = function () {
                //console.log('监听到数组的变化啦！');

                callback.call(arr);

                // 调用对应的原生方法并返回结果（新数组长度）
                return original.apply(this, arguments);
            }
        });

        arr.__proto__ = newArrProto;
    },
    //监听对象的值的改变的方法（obj对象，key键名，callback回调函数)
    listenObj(obj, key, callback) {
        var old = obj[key];
        Object.defineProperty(obj, key, {
            set: function (val) {
                var oldVal = old;
                old = val;
                callback.call(obj, val, oldVal, this);
            },
            get: function () {
                return old;
            }
        });
    },
    //深度监听所有的数组和对象的方法
    watch(obj, callback) {
        //封装一下回调函数，如果当前对象发生变动，则直接重新监听当前的对象
        let timeout = null;

        function newCallback() {
            let that = this;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                watching(that, newCallback);
                callback.call(that);
            }, 10);
        }

        var watching = function (obj, callback) {
            let that = this;
            //首先判断obj的类型
            if (that.type(obj) === "object" && !that.isDom(obj)) {
                if (that.isArray(obj)) {
                    for (let i = 0, len = obj.length; i < len; i++) {
                        //给每个数组的子项增加监听
                        that.listenObj(obj, i, callback);
                        //如果子项是对象，给子项内的值增加监听
                        if (that.type(obj) === "object") {
                            watching(obj[i], callback);
                        }
                    }
                    //给数组添加监听
                    that.listenArray(obj, callback);
                }
                else {
                    for (let i in obj) {
                        if (that.type(obj) === "object") {
                            watching(obj[i], callback);
                        }
                        //给当前对象添加监听
                        that.listenObj(obj, i, callback);
                    }
                }
            }
        }.bind(this);

        watching(obj, newCallback);
    },
    //计算两个点之间的距离的方法
    getRange(px1, py1, px2, py2) {
        return Math.sqrt(Math.pow(Math.abs(px1 - px2), 2) + Math.pow(Math.abs(py1 - py2), 2));
    },
    //获取dom对象的transform的相关属性的值
    getTransformStyle(dom) {
        let that = this;
        //获取实际的dom的transform属性
        let style = dom.style.cssText;
        //从里面获取相关属性
        let translate = style.match(/translate\((\S*)px,\s(\S*)px\)/);
        let scale = style.match(/scale\((\S*),\s(\S*)\)/);
        let rotate = style.match(/rotate\((\S*)deg\)/);
        let skew = style.match(/skew\((\S*)deg,\s(\S*)deg\)/);

        //声明一个返回的对象
        let obj = {};

        if (translate) {
            obj.translate = {
                translateX: translate[1],
                translateY: translate[2]
            }
        }

        if (scale) {
            obj.scale = {
                scaleX: scale[1],
                scaleY: scale[2]
            }
        }

        if (rotate) {
            obj.rotate = rotate[1];
        }

        if (skew) {
            obj.skew = {
                skewX: skew[1],
                skewY: skew[2]
            }
        }

        return obj;
    },
    //兼容性的设置dom的transform属性
    setTransformStyle(dom, style) {
        let that = this;
        let prefix = that.getPrefix();

        switch (prefix) {
            case "-webkit-":
                dom.style.webkitTransform = style;
                break;
            case "-Moz-":
                dom.style.MozTransform = style;
                break;
            case "-o-":
                dom.style.OTransform = style;
                break;
            case "-ms-":
                dom.style.msTransform = style;
                break;
            default:
                dom.style.transform = style;
                break;
        }
    },
    //获取当前dom的最终style属性
    getFinalStyle(dom,style){
        return window.getComputedStyle(dom, null)[style];
    },
    //可以消失的内容提示框
    msg(value, position){
        //创建显示提示信息的dom
        let div = document.createElement("div");
        let prefix = this.getPrefix();
        div.style.cssText = "position:fixed; height:40px; line-height:40px; color:#fff; padding:0 20px; background:rgba(0,0,0,.5);border-radius:5px; "+prefix+"transition: all .5s ease-in-out; pointer-events:none; opacity:0; left:50%; margin:auto; z-index:9999999999999999;";
        //判断设置的位置
        switch (position){
            case "top":
                div.style.top = "200px";
                break;
            case "center":
                div.style.top = 0;
                div.style.bottom = 0;
                break;
            case "bottom":
                div.style.bottom = "200px";
                break;
            default:
                div.style.bottom = "200px";
                break;
        }
        div.innerText = value;
        document.body.appendChild(div);
        //设置div居中
        let offsetWidth = div.offsetWidth;
        div.style.marginLeft = -offsetWidth/2+"px";

        //dom加载进入设置显示的延迟
        setTimeout(function () {
            div.style.opacity = 1;
        });

        //设置三秒后隐藏
        setTimeout(function () {
            div.style.opacity = 0;
            //过零点五秒清除掉div
            setTimeout(function () {
                div.parentNode.removeChild(div);
            }, 500);
        }, 3000);
    },
    //get请求方法
    get(url,callback, error){
        let time = +new Date();
        let xhr = new XMLHttpRequest();
        if(url.indexOf("?") != -1){
            xhr.open("GET", url+"&time=" + time, true);
        }
        else{
            xhr.open("GET", url+"?time=" + time, true);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };
        //超时
        xhr.ontimeout = error;
        xhr.onerror = error;
        xhr.upload.onprogress = function(e) { };
        xhr.send();
    },
    //post请求方法
    post(url, data, callback, error){
        let time = +new Date();
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url+"?time=" + time, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };
        //超时
        xhr.ontimeout = error;
        xhr.onerror = error;
        xhr.upload.onprogress = function(e) { };
        xhr.send(this.objToUrl(data).substr(1));
    },
    //将对象转换成url请求的格式
    objToUrl(param, key, encode) {
        if(param==null) return '';
        let paramStr = '';
        let t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
        }
        else {
            for (let i in param) {
                let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.objToUrl(param[i], k, encode);
            }
        }

        return paramStr;
    },
    //设置cookie的方法
    /**
     * 设置cookie.
     *
     * @param {string} c_name cookie的键名.
     * @param {number} value 需要添加到cookie的内容.
     * @param {number} expiredays 可以省略，设置当前的时间.
     * @return {null} .
     */
    setCookie(c_name, value, expiredays) {
        let exdate = new Date();
        exdate.setTime(Number(exdate) + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },
    /*
    * 获取设置的cookie的内容
    *
    * @param {string} c_name cookie的键名
    * @return {string} 返回获取到的内容，如果没有返回空字符串
    * */
    getCookie(c_name) {
        if(document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");//获取字符串的起点
            if(c_start != -1) {
                c_start = c_start + c_name.length + 1;//获取值的起点
                let c_end = document.cookie.indexOf(";", c_start);//获取结尾处
                if(c_end == -1) c_end = document.cookie.length;//如果是最后一个，结尾就是cookie字符串的结尾
                return decodeURI(document.cookie.substring(c_start, c_end));//截取字符串返回
            }
        }
        return "";
    },
    /*获取当前浏览器语言
    * @return {str} 当前浏览器的语言 cn en jp
    * */
    getLanguage: function () {
        var nl = navigator.language;
        var lg = (nl === "zh-CN" || nl === "zh-cn") ? "cn" : (nl === "ja") ? "jp" : "en";
        return lg;
    },
    /*获取到唯一标识符*/
    generateUUID: function () {
        var lut = [];
        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }

        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        var uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];

        // .toUpperCase() here flattens concatenated strings to save heap memory space.
        return uuid.toUpperCase();

    }
};

//创建dom对象
Dop.prototype.createElement = function (options) {
    const dom = document.createElement(options.tagName || 'div');
    for (let key in options) {
        switch (key) {
            case 'tagName':
                //无法覆盖tagName
                break;
            case 'parentNode':
                options[key].appendChild(dom);
                break;
            case 'style':
                for (let key in options['style']) {
                    dom.style[key] = options['style'][key];
                }
                break;
            case 'on':
                for (let item in options[key]) {
                    Dop.getInstance().$(dom).on(item, options[key][item]);
                }
                break;
            default:
                dom[key] = options[key];
        }
    }

    return dom;
};

window.Dop = Dop;
"object"===typeof module&&(module.exports=Dop);
