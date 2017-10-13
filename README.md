# dop
Dynamic of package，里面封装了一些个人常用的方法，全兼容的dom操作事件，监听对象变化自动更新的方法

# dop.prototype.touch() 兼容全端的交互事件，案例文件touch.html
-----------------------
>兼容：兼容ie9+和移动端大部分版本，由于没有时间测试，希望大家使用完后给点意见。
>使用：
>首先实例化方法的对象，并且赋值变量
```
var myExtend = new MyNeedExtend();
```
>然后使用myExtend.touch()方法获取到绑定交互对象。
```
var dom = myExtend.touch(document.getElementById("div"));//通过获取到相关dom的对象
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
