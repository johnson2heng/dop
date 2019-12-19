class Dop {
    constructor() {
    }

    //创建交互事件类
    $(dom) {
        return new Touch(dom);
    }

    //直接抛出错误
    error(msg) {
        throw new Error(msg);
    }

    //未知
    noop() {
    }

    // 判断是否是个函数
    isFunction(obj) {
        return typeof (obj) === "function";
    }

    //判断是否是一个类数组对象
    isArraylike(obj) {
        var length = obj.length,
            type = this.type(obj);

        if (type === "function" || this.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    //判断指定参数是否是一个窗口。
    isWindow(obj) {
        return obj != null && obj === obj.window;
    }

    //是否是数字类型或者字符串类型数字
    isNumeric(obj) {
        return obj - parseFloat(obj) >= 0;
    }

    //判断是否是一个纯粹的对象
    isPlainObject(obj) {
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if (this.type(obj) !== "object" || obj.nodeType || this.isWindow(obj)) {
            return false;
        }

        // Support: Firefox <20
        // The try/catch suppresses exceptions thrown when attempting to access
        // the "constructor" property of certain host objects, ie. |window.location|
        // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
        try {
            if (obj.constructor &&
                !this.hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true;
    }

    //判断指定参数是否是一个空对象。
    isEmptyObject(obj) {
        for (let name in obj) {
            return false;
        }
        return true;
    }

    //确定JavaScript内置对象的类型，并返回小写形式的类型名称
    type(obj) {
        if (obj == null) {
            return obj + "";
        }
        // Support: Android < 4.0, iOS < 6 (functionish RegExp)
        return typeof obj === "object" || typeof obj === "function" ?
            {}[toString.call(obj)] || "object" :
            typeof obj;
    }

    // 用于全局性地执行一段JavaScript代码。
    globalEval(code) {
        var script,
            indirect = eval;

        code = this.trim(code);

        if (code) {
            // If the code includes a valid, prologue position
            // strict mode pragma, execute code by injecting a
            // script tag into the document.
            if (code.indexOf("use strict") === 1) {
                script = document.createElement("script");
                script.text = code;
                document.head.appendChild(script).parentNode.removeChild(script);
            }
            else {
                // Otherwise, avoid the DOM node creation, insertion
                // and removal by using an indirect global eval
                indirect(code);
            }
        }
    }

    //判断传入的dom的nodeName是否和name匹配
    nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    }

    // 函数用于遍历指定的对象和数组，并以对象的每个属性(或数组的每个成员)作为上下文来遍历执行指定的函数。
    //object	Object类型指定需要遍历的对象或数组。callback(索引，值)	Function类型指定的用于循环执行的函数。
    each(obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = this.isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }
            else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

            // A special, fast, case for the most common use of each
        }
        else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
            else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    }

    //去除字符串左右两侧的空格
    trim(text) {
        return text == null ? "" : "".trim.call(text);
    }

    // 将一个类数组对象转换为真正的数组对象。
    makeArray(arr, results) {
        var ret = results || [];

        if (arr != null) {
            if (this.isArraylike(Object(arr))) {
                this.merge(ret,
                    typeof arr === "string" ?
                        [arr] : arr
                );
            }
            else {
                this.push.call(ret, arr);
            }
        }

        return ret;
    }

    //在数组中搜索指定的值，并返回其索引值。如果数组中不存在该值，则返回 -1。
    inArray(elem, arr, i) {
        return arr == null ? -1 : this.indexOf.call(arr, elem, i);
    }

    //用于合并两个数组内容到第一个数组。
    merge(first, second) {
        let len = +second.length,
            j = 0,
            i = first.length;

        for (; j < len; j++) {
            first[i++] = second[j];
        }

        first.length = i;

        return first;
    }

    /*作用：grep()使用指定的函数过滤数组中的元素，并返回过滤后的数组。
    语法：grep(array,callback,invert)。
    参数含义：
    array：带过滤数组。
    callback：数组过滤函数，该函数包含两个参数，第一个是当前数组元素的值
    ，第二个是数组元素的下标，即元素索引值。
    invert：布尔型可选项，默认为false，即返回的是过滤函数处理以后为true
    的数组；选项设置为false的时候，返回的是过滤函数处理以后为false的数组
    。*/
    grep(elems, callback, invert) {
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
    }

    // 使用指定函数处理数组中的每个元素(或对象的每个属性)，并将处理结果封装为新的数组返回。
    map(elems, callback, arg) {
        var value,
            i = 0,
            length = elems.length,
            isArray = this.isArraylike(elems),
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
        }
        else {
            for (i in elems) {
                value = callback(elems[i], i, arg);

                if (value != null) {
                    ret.push(value);
                }
            }
        }

        // Flatten any nested arrays
        return this.concat.apply([], ret);
    }

    // 接受一个已有的函数，并返回一个带特定上下文的新的函数。
    proxy(fn, context) {
        var tmp, args, proxy;

        if (typeof context === "string") {
            tmp = fn[context];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if (!this.isFunction(fn)) {
            return undefined;
        }

        // Simulated bind
        args = this.slice.call(arguments, 2);
        proxy = function () {
            return fn.apply(context || this, args.concat(this.slice.call(arguments)));
        };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || this.guid++;

        return proxy;
    }

    //深拷贝浅拷贝的方法
    extend() {
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
        if (typeof target !== "object" && !this.isFunction(target)) {
            target = {};
        }

        // extend this itself if only one argument is passed
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
                    if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = this.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && this.isArray(src) ? src : [];

                        }
                        else {
                            clone = src && this.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = this.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    }

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
            }
            else if (document.body.clientWidth > 767 && document.body.clientHeight > 767) {
                return "pad";
            }
            else if (document.body.clientWidth < 400 || document.body.clientHeight < 400) {
                return "phone";//小于320的minphone 暂时修改成phone
            }
            else {
                return "phone";
            }
        }
        else {
            return "pc";
        }
    }

    //使用js获取get传值
    getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

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
                    }
                    else {
                        settings[i] = {};
                    }
                    this.cloneObj(settings[i], obj[i], true);
                }
                else {
                    settings[i] = obj[i];
                }
            }
        }
        else {
            for (var i in obj) {
                settings[i] = obj[i];
            }
        }
    }

    //判断元素内是否包含另一个元素(元素，是否包含的另一个元素)
    inDom(dom, include) {
        if (include && include.parentNode) {
            if (include.parentNode === dom) {
                return true;
            }
            else if (include.parentNode === document.body) {
                return false;
            }
            else {
                return this.inDom(dom, include.parentNode);
            }
        }
        else {
            return false;
        }
    }

    //判断鼠标的点的位置是否处于一个dom的位置范围内,x,y距离窗口左上角的client位置，dom，判断的dom
    positionInDom(x, y, dom) {
        let box = dom.getBoundingClientRect();
        if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) {
            return true;
        }
        else {
            return false;
        }
    }

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
    }

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
    }

    //鼠标上下滚轮事件(绑定的dom对象，向下滚动触发事件，向上滚动触发事件）
    wheel(dom, fun1, fun2) {
        let that = this;
        //获取传入的arguments的个数
        let argLen = arguments.length;

        const scroll = (e) => {
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
        };

        const wheel = (index, event) => {
            if (index >= 0) {
                //向下滚动
                if (argLen >= 2 && this.isFunction(fun1)) {
                    fun1.call(dom, event);
                }
            }
            else if (index < 0) {
                //向上滚动
                if (argLen >= 3 && this.isFunction(fun2)) {
                    fun2.call(dom, event);
                }
            }
        };

        //添加监听事件
        dom.addEventListener("mousewheel", scroll, false);
        dom.addEventListener("DOMMouseScroll", scroll, false);
    }

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
    }

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
    }

    //监听对象的值的改变的方法（obj对象，key键名，callback回调函数)
    listenObj(obj, key, callback) {
        let old = obj[key];
        Object.defineProperty(obj, key, {
            set: function (val) {
                let oldVal = old;
                old = val;
                callback.call(obj, val, oldVal, this);
            },
            get: function () {
                return old;
            }
        });
    }

    //深度监听所有的数组和对象的方法
    watch(obj, callback) {
        //封装一下回调函数，如果当前对象发生变动，则直接重新监听当前的对象
        let timeout;

        const newCallback = () => {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                watching(obj, newCallback);
                callback.call(obj);
            }, 10);
        };

        const watching = (obj, callback) => {
            //首先判断obj的类型
            if (this.type(obj) === "object" && !this.isDom(obj)) {
                if (this.isArray(obj)) {
                    for (let i = 0, len = obj.length; i < len; i++) {
                        //给每个数组的子项增加监听
                        this.listenObj(obj, i, callback);
                        //如果子项是对象，给子项内的值增加监听
                        if (this.type(obj) === "object") {
                            watching(obj[i], callback);
                        }
                    }
                    //给数组添加监听
                    this.listenArray(obj, callback);
                }
                else {
                    for (let i in obj) {
                        if (this.type(obj) === "object") {
                            watching(obj[i], callback);
                        }
                        //给当前对象添加监听
                        this.listenObj(obj, i, callback);
                    }
                }
            }
        };

        watching(obj, newCallback);
    }

    //计算两个点的角度
    getAngle(px1, py1, px2, py2) {
        //两点的x、y值
        const x = px2 - px1;
        const y = py2 - py1;
        const hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        //斜边长度
        const cos = x / hypotenuse;
        const radian = Math.acos(cos);
        //求出弧度
        let angle = 180 / (Math.PI / radian);
        //用弧度算出角度
        if (y < 0) {
            angle = -angle;
        }
        else if ((y == 0) && (x < 0)) {
            angle = 180;
        }
        return angle;
    }

    //计算两个点之间的距离的方法
    getRange(px1, py1, px2, py2) {
        return Math.sqrt(Math.pow(Math.abs(px1 - px2), 2) + Math.pow(Math.abs(py1 - py2), 2));
    }

    //获取dom对象的transform的相关属性的值
    getTransformStyle(dom) {
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
    }

    //兼容性的设置dom的transform属性
    setTransformStyle(dom, style) {
        const prefix = this.getPrefix();

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
    }

    //获取当前dom的最终style属性
    getFinalStyle(dom, style) {
        return window.getComputedStyle(dom, null)[style];
    }

    //可以消失的内容提示框
    msg(value, position) {
        //创建显示提示信息的dom
        let div = document.createElement("div");
        let prefix = this.getPrefix();
        div.style.cssText = "position:fixed; height:40px; line-height:40px; color:#fff; padding:0 20px; background:rgba(0,0,0,.5);border-radius:5px; " + prefix + "transition: all .5s ease-in-out; pointer-events:none; opacity:0; left:50%; margin:auto; z-index:9999999999999999;";
        //判断设置的位置
        switch (position) {
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
        div.style.marginLeft = -offsetWidth / 2 + "px";

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
    }

    //get请求地址方法
    get(url, callback, error) {
        let time = +new Date();
        let xhr = new XMLHttpRequest();
        if (url.indexOf("?") != -1) {
            xhr.open("GET", url + "&time=" + time, true);
        }
        else {
            xhr.open("GET", url + "?time=" + time, true);
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };
        //超时
        xhr.ontimeout = error;
        xhr.onerror = error;
        xhr.upload.onprogress = function (e) {
        };
        xhr.send();
    }

    //post请求方法
    post(url, data, callback, error) {
        let time = +new Date();
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url + "?time=" + time, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };
        //超时
        xhr.ontimeout = error;
        xhr.onerror = error;
        xhr.upload.onprogress = function (e) {
        };
        xhr.send(this.objToUrl(data).substr(1));
    }

    //将对象转换成url请求的格式
    objToUrl(param, key, encode) {
        if (param == null) return '';
        let paramStr = '';
        let t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        }
        else {
            for (let i in param) {
                let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                paramStr += this.objToUrl(param[i], k, encode);
            }
        }

        return paramStr;
    }

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
    }

    /*
    * 获取设置的cookie的内容
    *
    * @param {string} c_name cookie的键名
    * @return {string} 返回获取到的内容，如果没有返回空字符串
    * */
    getCookie(c_name) {
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(c_name + "=");//获取字符串的起点
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;//获取值的起点
                let c_end = document.cookie.indexOf(";", c_start);//获取结尾处
                if (c_end == -1) c_end = document.cookie.length;//如果是最后一个，结尾就是cookie字符串的结尾
                return decodeURI(document.cookie.substring(c_start, c_end));//截取字符串返回
            }
        }
        return "";
    }

    /*获取当前浏览器语言
    * @return {str} 当前浏览器的语言 cn en jp
    * */
    getLanguage() {
        var nl = navigator.language;
        var lg = (nl === "zh-CN" || nl === "zh-cn") ? "cn" : (nl === "ja") ? "jp" : "en";
        return lg;
    }

    /*获取到唯一标识符*/
    generateUUID() {
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

    //创建dom对象并实现内容事件绑定
    createElement(options) {
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
                        this.$(dom).on(item, options[key][item]);
                    }
                    break;
                default:
                    dom[key] = options[key];
            }
        }

        return dom;
    }
}

//原生的一些方法引用
Dop.prototype.isReady = true;
Dop.prototype.slice = [].slice;
Dop.prototype.concat = [].concat;
Dop.prototype.push = [].push;
Dop.prototype.indexOf = [].indexOf;
Dop.prototype.toString = {}.toString;
Dop.prototype.hasOwn = {}.hasOwnProperty;
Dop.prototype.isArray = Array.isArray;
Dop.prototype.guid = 1;
Dop.prototype.now = Date.now;

//交互类，用于实现各种交互事件的绑定
class Touch extends Dop {

    constructor(dom) {
        super();

        const domArr = [];
        if (this.isDom(dom)) {
            //如果是dom，直接创建
            domArr.push(dom);
        }
        else if (typeof dom === 'string') {
            const arr = document.querySelectorAll(dom);
            domArr.push(...arr);
        }
        else if (this.isArray(dom)) {
            //如果是数组，则放到数组内
            domArr.push(...dom);
        }
        else if (this.isArraylike(dom)) {
            //如果是类数组类型，放到数组
            for(let i=0; i<dom.length; i++){
                domArr.push(dom[i]);
            }
        }
        else {
            //其它作为单个dom处理
            domArr.push(dom);
        }

        this.domArr = domArr; //设置好dom数组

        //保存当前绑定的事件列表, 方便后面删除
        this.touches = {
            tap: {},
            singleTap: {},
            doubleTap: {},
            longTap: {},
            swipe: {},
            swipeLeft: {},
            swipeRight: {},
            swipeUp: {},
            swipeDown: {},
            wheel: {},
            down: {},
            move: {},
            up: {},
        }


        //默认的配置选项
        this.settings = {
            tapDurationThreshold: 250,//触屏大于这个时间不当作tap
            scrollSupressionThreshold: 20,//触发touchmove的敏感度
            swipeDurationThreshold: 750,//大于这个时间不当作swipe
            horizontalDistanceThreshold: 40,//swipe的触发垂直方向move必须大于这个距离
            verticalDistanceThreshold: 75,//swipe的触发水平方向move必须大于这个距离
            tapHoldDurationThreshold: 750,//长按触发事件需要长按这个事件才可触发
            doubleTapInterval: 250//双击事件触发中间的间隔必须小于这个时间
        };
    }

    on(event, fun, fun2, preventDefault) {
        this[event](fun, fun2, preventDefault);
    }

    remove(event, fun, bool = true) {

        this.domArr.forEach((dom, index) => {
            switch (event) {
                case "tap":
                case "singleTap":
                case "doubleTap":
                case "longTap":
                case "swipe":
                case "swipeLeft":
                case "swipeRight":
                case "swipeUp":
                case "swipeDown":
                    if (fun) {
                        dom.removeEventListener(this.getDownKey(), this.touches[event][fun], bool);
                    }
                    else {
                        for (let fun in this.touches[event]) {
                            dom.removeEventListener(this.getDownKey(), this.touches[event][fun], bool);
                        }
                    }
                    break;
                case "wheel":
                    if (fun) {
                        dom.removeEventListener("mousewheel", this.touches[event][fun], bool);
                        dom.removeEventListener("DOMMouseScroll", this.touches[event][fun], bool);
                    }
                    else {
                        for (let fun in this.touches[event]) {
                            dom.removeEventListener("mousewheel", this.touches[event][fun], bool);
                            dom.removeEventListener("DOMMouseScroll", this.touches[event][fun], bool);
                        }
                    }
                    break;
                case "down":
                    if (fun) {
                        dom.removeEventListener(this.getDownKey(), this.touches[event][fun], bool);
                    }
                    else {
                        for (let fun in this.touches[event]) {
                            if (this.touches[event][fun].removeAll) {
                                dom.removeEventListener(this.getDownKey(), this.touches[event][fun], bool);
                            }
                        }
                    }
                    break;
                case "move":
                    if (fun) {
                        dom.removeEventListener(this.getMoveKey(), this.touches[event][fun], bool);
                    }
                    else {
                        for (let fun in this.touches[event]) {
                            if (this.touches[event][fun].removeAll) {
                                dom.removeEventListener(this.getMoveKey(), this.touches[event][fun], bool);
                            }
                        }
                    }
                    break;
                case "up":
                    if (fun) {
                        dom.removeEventListener(this.getUpKey(), this.touches[event][fun], bool);
                    }
                    else {
                        for (let fun in this.touches[event]) {
                            if (this.touches[event][fun].removeAll) {
                                dom.removeEventListener(this.getUpKey(), this.touches[event][fun], bool);
                            }
                        }
                    }
                    break;
                default:
                    console.warn('取消没有绑定的事件');
            }
        });
    }

    //点击事件
    tap(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        //手指抬起事件
        const mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.end = +new Date();
            //取消抬起事件绑定
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    return;
                }
            }

            if (
                date.end - date.start <= this.settings.tapDurationThreshold &&
                this.getEventRange(touch.start, touch.end) < this.settings.scrollSupressionThreshold
            ) {
                callback.call(e.target, currentTarget);
            }
        };

        //设置手指按下事件
        const mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.start = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.tap[callback] = mouseDown;
    }

    //和双击不冲突的单击事件
    singleTap(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};

        const isPc = this.browserRedirect() === 'pc';

        let timeOut;//预防与双击冲突的延迟器
        let type = false;//是否双击的标记

        const mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.endTime = +new Date();
            //取消抬起事件绑定
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    return;
                }
            }

            if (
                date.endTime - date.startTime <= this.settings.tapDurationThreshold &&
                this.getEventRange(touch.start, touch.end) < this.settings.scrollSupressionThreshold
            ) {
                if (type) return;
                timeOut = setTimeout(function () {
                    callback.call(e.target, currentTarget);
                }, this.settings.doubleTapInterval);
            }
        };

        //设置手指触发事件
        const mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.startTime = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            //双击清除singleTap事件
            if (date.startTime - date.endTime < this.settings.doubleTapInterval) {
                clearTimeout(timeOut);
                type = true;
            }
            else {
                type = false;
            }

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.singleTap[callback] = mouseDown;
    }

    //双击事件
    doubleTap(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        date.prevTime = 0;//定义一个记录上一次点击后鼠标抬起的时的时间变量

        const mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.endTime = +new Date();
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    date.prevTime = 0;
                    return;
                }
            }

            if (
                (date.endTime - date.startTime <= this.settings.tapDurationThreshold) &&
                this.getEventRange(touch.start, touch.end) < this.settings.scrollSupressionThreshold
            ) {
                if (date.prevTime !== 0 && date.endTime - date.prevTime < this.settings.doubleTapInterval) {
                    callback.call(e.target, currentTarget);
                }
                else {
                    date.prevTime = date.endTime;
                }
            }
            else {
                date.prevTime = 0;
            }
        };

        //设置手指触发事件
        const mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.startTime = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.doubleTap[callback] = mouseDown;
    }

    //长按事件
    longTap(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        let timeOut; //延迟器

        const mouseMove = (e) => {
            touch.move = isPc ? e : e.changedTouches;
        };

        const mouseUp = (e) => {
            clearTimeout(timeOut);
            document.removeEventListener(this.getMoveKey(), mouseMove, bool);
            document.removeEventListener(this.getUpKey(), mouseUp, bool);
        };

        const mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.startTime = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            //设置定时器，确定长按触发的事件
            timeOut = setTimeout(() => {
                mouseUp();
                //判断是否是移动端
                if (!isPc) {
                    if (touch.start.length > 1 || (touch.move && touch.move.length > 1)) {
                        return;
                    }
                }
                if (!touch.move ||
                    this.getEventRange(touch.start, touch.move) < this.settings.scrollSupressionThreshold
                ) {
                    callback.call(e.target, currentTarget);
                }
            }, this.settings.tapHoldDurationThreshold);

            document.addEventListener(this.getMoveKey(), mouseMove, bool);
            document.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.longTap[callback] = mouseDown;
    }

    //滑动事件
    swipe(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        let mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.end = +new Date();
            //取消抬起事件绑定
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    return;
                }
            }

            if (
                (date.end - date.start <= this.settings.swipeDurationThreshold) &&
                this.getEventRange(touch.start, touch.end) > this.settings.horizontalDistanceThreshold
            ) {
                callback.call(e.target, currentTarget);
            }
        };

        //设置手指触发事件
        let mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.start = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.swipe[callback] = mouseDown;
    }

    //向左滑动事件
    swipeLeft(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        let mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.end = +new Date();
            //取消抬起事件绑定
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    return;
                }
            }

            if (
                (date.end - date.start <= this.settings.swipeDurationThreshold) &&
                this.getEventRange(touch.start, touch.end) > this.settings.verticalDistanceThreshold &&
                (this.getEventAngle(touch.start, touch.end) >= 135 || this.getEventAngle(touch.start, touch.end) <= -135)
            ) {
                callback.call(e.target, currentTarget);
            }
        };

        //设置手指触发事件
        let mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.start = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.swipeLeft[callback] = mouseDown;
    }

    //向右滑动事件
    swipeRight(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        let mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.end = +new Date();
            //取消抬起事件绑定
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    return;
                }
            }

            if (
                (date.end - date.start <= this.settings.swipeDurationThreshold) &&
                this.getEventRange(touch.start, touch.end) > this.settings.verticalDistanceThreshold &&
                (this.getEventAngle(touch.start, touch.end) >= -45 && this.getEventAngle(touch.start, touch.end) <= 45)
            ) {
                callback.call(e.target, currentTarget);
            }
        };

        //设置手指触发事件
        let mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.start = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.swipeRight[callback] = mouseDown;
    }

    //向上滑动事件
    swipeUp(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        let mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.end = +new Date();
            //取消抬起事件绑定
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    return;
                }
            }

            if (
                (date.end - date.start <= this.settings.swipeDurationThreshold) &&
                this.getEventRange(touch.start, touch.end) > this.settings.verticalDistanceThreshold &&
                (this.getEventAngle(touch.start, touch.end) > -135 && this.getEventAngle(touch.start, touch.end) < -45)
            ) {
                callback.call(e.target, currentTarget);
            }
        };

        //设置手指触发事件
        let mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.start = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.swipeUp[callback] = mouseDown;
    }

    //向下滑动事件
    swipeDown(callback, bool = true) {
        let currentTarget;
        const date = {};
        const touch = {};
        const isPc = this.browserRedirect() === 'pc';

        let mouseUp = (e) => {
            e.preventDefault();
            touch.end = isPc ? e : e.changedTouches;
            date.end = +new Date();
            //取消抬起事件绑定
            e.target.removeEventListener(this.getUpKey(), mouseUp, bool);

            //判断是否是移动端
            if (!isPc) {
                if (touch.start.length > 1 || touch.end.length > 1) {
                    return;
                }
            }

            if (
                (date.end - date.start <= this.settings.swipeDurationThreshold) &&
                this.getEventRange(touch.start, touch.end) > this.settings.verticalDistanceThreshold &&
                (this.getEventAngle(touch.start, touch.end) > 45 && this.getEventAngle(touch.start, touch.end) < 135)
            ) {
                callback.call(e.target, currentTarget);
            }
        };

        //设置手指触发事件
        let mouseDown = (e) => {
            e.preventDefault();
            if (e.button !== 0 && isPc) return;
            date.start = +new Date();
            touch.start = isPc ? e : e.touches;
            currentTarget = e;

            e.target.addEventListener(this.getUpKey(), mouseUp, bool);
        };

        this.down(mouseDown, bool, false);

        //将事件绑定到dom身上，供后面清除
        this.touches.swipeDown[callback] = mouseDown;
    }

    //鼠标滚轮事件
    wheel(callback, callback2, bool = true) {
        //触发滚动事件
        const wheel = (index, event) => {
            if (index >= 0) {
                //向下滚动
                if (this.isFunction(callback)) {
                    callback.call(event.target, event);
                }
            }
            else if (index < 0) {
                //向上滚动
                if (this.isFunction(callback2)) {
                    callback2.call(event.target, event);
                }
            }
        };

        const scroll = (e) => {
            e.preventDefault();
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
        };

        this.domArr.forEach((dom, index) => {
            //添加监听事件
            dom.addEventListener("mousewheel", scroll, bool);
            dom.addEventListener("DOMMouseScroll", scroll, bool);
        });

        //将事件绑定到touches身上，供后面清除
        this.touches.wheel[callback] = scroll;
    }

    //按下事件 callback 事件触发回调  bool 是否在捕获阶段执行，默认true   removeAll  是否在调用删除当前全部事件中清除当前事件 默认true
    down(callback, bool = true, removeAll = true) {
        this.domArr.forEach((dom, index) => {
            dom.addEventListener(this.getDownKey(), callback, bool);
        });

        callback.removeAll = removeAll;

        //将事件绑定到touches身上，供后面清除
        this.touches.down[callback] = callback;
    }

    //移动事件 callback 事件触发回调  bool 是否在捕获阶段执行，默认true   removeAll  是否在调用删除当前全部事件中清除当前事件 默认true
    move(callback, bool = true, removeAll = true) {
        this.domArr.forEach((dom, index) => {
            dom.addEventListener(this.getMoveKey(), callback, bool);
        });

        callback.removeAll = removeAll;

        //将事件绑定到touches身上，供后面清除
        this.touches.move[callback] = callback;
    }

    //抬起事件 callback 事件触发回调  bool 是否在捕获阶段执行，默认true   removeAll  是否在调用删除当前全部事件中清除当前事件 默认true
    up(callback, bool = true, removeAll = true) {
        this.domArr.forEach((dom, index) => {
            dom.addEventListener(this.getUpKey(), callback, bool);
        });

        callback.removeAll = removeAll;

        //将事件绑定到touches身上，供后面清除
        this.touches.up[callback] = callback;
    }

    //获取移动端或者pc端鼠标按下的原生dom绑定事件
    getDownKey() {
        if (this.browserRedirect() === 'pc') {
            return 'mousedown';
        }
        else {
            return 'touchstart';
        }
    }

    //获取移动端或者pc端鼠标移动的原生dom绑定事件
    getMoveKey() {
        if (this.browserRedirect() === 'pc') {
            return 'mousemove';
        }
        else {
            return 'touchmove';
        }
    }

    //获取移动端或者pc端鼠标按下的原生dom绑定事件
    getUpKey() {
        if (this.browserRedirect() === 'pc') {
            return 'mouseup';
        }
        else {
            return 'touchend';
        }
    }

    //获取两个event之间的距离
    getEventRange(event1, event2) {
        if (this.browserRedirect() === 'pc') {
            return this.getRange(event1.clientX, event1.clientY, event2.clientX, event2.clientY);
        }
        else {
            return this.getRange(event1[0].clientX, event1[0].clientY, event2[0].clientX, event2[0].clientY);
        }
    }

    //获得两个event之间的角度
    getEventAngle(event1, event2) {
        if (this.browserRedirect() === 'pc') {
            return this.getAngle(event1.clientX, event1.clientY, event2.clientX, event2.clientY);
        }
        else {
            return this.getAngle(event1[0].clientX, event1[0].clientY, event2[0].clientX, event2[0].clientY);
        }
    }
}


window.Dop = Dop;
"object" === typeof module && (module.exports = Dop);
