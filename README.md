# Dop
Dynamic of package，里面封装了一些个人常用的方法，全兼容的dom操作事件，监听对象变化自动更新的方法

# Dop.prototype.touch() 兼容全端的交互事件，案例文件touch.html
-----------------------
>兼容：兼容ie9+和移动端大部分版本，由于没有时间测试，希望大家使用完后给点意见。
>使用：
>首先实例化方法的对象，并且赋值变量
```
    var myExtend = new Dop();
```
>然后使用myExtend.touch()方法获取到绑定交互对象。
```
    var dom = myExtend.$(document.getElementById("div"));//通过获取到相关dom的对象
```
touch()函数内可以传入的值，dom对象，一个数组dom对象，jq对象。
>绑定事件，使用on方法绑定事件
```
    dom.on("tap",function () {
        console.log("tap");
    });
```
>支持的方法：tap（点击事件），singleTap（一次点击事件，如果触发双击，此事件不会触发），doubleTap（双击事件），swipe（滑动事件），longTap（长按事件），swipeLeft（左划事件），swipeRight（右划事件），swipeUp（上划事件），swipeDown（下划事件），wheel（鼠标滚动事件，pc端）
>pc端的滚动事件可以传入两个function，第一个为往下滚动，第二个为往上滚动。

# 封装的其它方法
---------------------------------
这些方法都是引用的jq的，因为经常用，而且不能因为这些方法引入jq，所以就封装到了自己的方法内

- Dop.prototype.isFunction() // 判断是否是个函数
- Dop.prototype.isArray() //判断是否是数组
- Dop.prototype.isWindow() //判断指定参数是否是一个窗口。
- Dop.prototype.isNumeric() //是否是数字类型或者字符串类型数字
- Dop.prototype.isPlainObject() //判断是否是一个纯粹的对象
- Dop.prototype.isEmptyObject() //判断指定参数是否是一个空对象。
- Dop.prototype.type() //确定JavaScript内置对象的类型，并返回小写形式的类型名称
- Dop.prototype.globalEval() // 用于全局性地执行一段JavaScript代码。
- Dop.prototype.nodeName() //判断传入的dom的nodeName是否和name匹配
- Dop.prototype.each() // 函数用于遍历指定的对象和数组，并以对象的每个属性(或数组的每个成员)作为上下文来遍历执行指定的函数。
- Dop.prototype.trim() //去除字符串两端的空白字符。
- Dop.prototype.makeArray() // 将一个类数组对象转换为真正的数组对象。
- Dop.prototype.inArray() //在数组中搜索指定的值，并返回其索引值。如果数组中不存在该值，则返回 -1。
- Dop.prototype.merge() //用于合并两个数组内容到第一个数组。
- Dop.prototype.grep() //使用指定的函数过滤数组中的元素，并返回过滤后的数组。
- Dop.prototype.map() // 使用指定函数处理数组中的每个元素(或对象的每个属性)，并将处理结果封装为新的数组返回。
- Dop.prototype.proxy() // 接受一个已有的函数，并返回一个带特定上下文的新的函数。
- Dop.prototype.now() //输出当前时间

> 个人新增

- Dop.prototype.browserRedirect() //判断是什么设备的类型 返回pc pad phone
- Dop.prototype.inDom() //判断元素内是否包含另一个元素(元素，是否包含的另一个元素)
- Dop.prototype.getPrefix() //获取浏览器的兼容性前缀
- Dop.prototype.isDom() //判断是否是一个dom对象
- Dop.prototype.wheel() //鼠标上下滚轮事件(绑定的dom对象，向下滚动触发事件，向上滚动触发事件）
- Dop.prototype.addImageHover() //给img对象添加悬停效果
- Dop.prototype.getTransformStyle(dom) //获取dom对象的transform的相关属性的值
- Dop.prototype.setTransformStyle(dom,style) //兼容性的设置dom的transform属性
- Dop.prototype.getRange(px1, py1, px2, py2) //计算两个点之间的距离的方法

# 特殊更新
> 更新了现在比较流行的双向绑定，这三个函数实现了对对象的监听方法，方法兼容性待测试。

- Dop.prototype.listenArray() //监听数组变化方法，(arr数组,callback回调函数)
- Dop.prototype.listenObj() //监听对象的值的改变的方法（obj对象，key键名，callback回调函数)
- Dop.prototype.watch() //深度监听所有的数组和对象的方法

### 20180109 更新
> 增加取消默认状态，代码案例
```
    let dop = new Dop();//首先实例化对象，获取到对象
    let dom = dop.$(document.getElementById("div"));//通过获取到相关dom的对象
    //阻止拖拽的默认
    dom.on("swipe",function () {
        console.log("swipe");
    },true); 
    
    //阻止滚动事件的默认
    dom.on("wheel",function () {
        console.log("向下滚动");
    },function () {
        console.log("向上滚动");
    },true);
```

> 增加Dop的图片显示插件，一个是仿微信图片查看，另一个是单个图片增加额外元素。
文件地址`./public/js/dop_extend.js`,使用方式，在dop文件引入下方直接引入即可。

### 20180122 更新
> 增加down，move，up事件，增加取消绑定的remove事件

- down，move，up事件
```
    var myExtend = new Dop();
    var dom = myExtend.$(document.getElementById("div"));//通过获取到相关dom的对象
    dom.on("down",function () {
        console.log("绑定移动端的手指按下和pc端的鼠标按下事件");
    });
    dom.on("down",function () {
        console.log("绑定移动端的手指移动和pc端的鼠标移动事件");
    });
    dom.on("down",function () {
        console.log("绑定移动端的手指抬起和pc端的鼠标抬起事件");
    });
```
- remove事件
> 第一种方式正常绑定
```
    dom.on("tap",function(){
        dom.remove("tap"); //直接清除绑定在dom上的单个函数
    });
```
> 第二种down，move，up解绑方式
```
    var fun = function(){alert(111)};
    //绑定
    dom.on("move",fun);
    //解除绑定
    dom.remove("move",fun);
```
- Dop.prototype.getFinalStyle(dom,style) //获取当前dom的最终style属性


