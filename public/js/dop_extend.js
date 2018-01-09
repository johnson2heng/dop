//扩展Dop类

//添加图片设计扩展
Dop.prototype.DivImageView = function (obj) {
    let that = this;
    let my = new Dop();
    let dop = my;
    let prefix = dop.getPrefix();
    let settings = {
        mouseDown: {
            x: 0,
            y: 0,
            time: null//存储鼠标按下时的时间
        },//鼠标按下数据存储
        mouseMove: {
            x: 0,
            y: 0
        },//鼠标移动数据存储
        mouseUp: {time: null},//鼠标抬起数据存储
        loadImg: "button/load.gif",//图片加载中动态图
        divStyle: "padding:0; position:absolute; left:0; top:0; right:0; bottom:0; margin:auto; overflow:hidden; max-width:100%; max-height:100%; cursor:move; ",//生成的图片div的样式
        imgStyle: "position:absolute; left:0; top:0; right:0; bottom:0; margin:auto; display:block;",//生成的img的样式
        maxScale: 2,//实际图片的最大放大比例，默认为1
        maximum: 1.5,//手指可以放大到的最大极限
        minScale: 0.8,//最小缩放比例
        scrollScale: 1.1,//每次缩放的比例
        picIndex: 0,//当前显示的第几张图片，默认第一张
        img: null,//当前操作的img,鼠标抬起时清空
        picTransition: "all .3s",//图片过渡效果设置
        picWrapTransition: "all .3s",//ul列表的过渡样式
        canMovePercent: "50%",//移动图片出现空白的百分比以后就会切换页面
        updateTimeOut: 100,//每次鼠标离开屏幕后，处理界面的延迟
        delay:0,//显示之前会有多长时间的动画
        timeOut: null//鼠标屏幕离开的延时器对象存储
    };
    that.settings = my.jquery.extend(true, {}, settings, obj);

    //media 媒体类型 phone,pc,pad   picWrap 需要填充的标签div   arr 图片数据数组
    that.init = function (media, picWrap, obj) {
        that.arr = obj;
        that.picWrap = picWrap;
        that.media = media || my.browserRedirect();

        function createDom() {
            that.picWrapWidth = that.picWrap.parentNode.offsetWidth;////图片外框宽度
            that.picWrapHeight = that.picWrap.parentNode.offsetHeight;//图片外框高度
            setTimeout(function () {
                that.picWrapLeft = that.picWrap.parentNode.getBoundingClientRect().left;//图片外框的距离左侧距离
                that.picWrapTop = that.picWrap.parentNode.getBoundingClientRect().top;//图片外框距离顶部距离
            },that.settings.delay*1000);
            that.prefix = my.getPrefix();

            picWrap.style.overflow = "hidden";
            picWrap.style.cssText += that.prefix + "user-select:none;";
            let position = window.getComputedStyle(picWrap,null)["position"];
            if (position !== "absolute" && position !== "relative" && position !== "fixed") {
                picWrap.style.position = "relative";
            }

            //生成需要显示的图片的div
            let picDiv = document.createElement("div");
            picDiv.style.cssText = that.settings.divStyle;
            picWrap.appendChild(picDiv);

            dop.setTransformStyle(picDiv,"translate(0px, 0px) scale(1,1)");

            //生成图片放入到div内
            let picImage = document.createElement("img");
            picImage.style.cssText = that.settings.imgStyle;
            picImage.src = that.settings.loadImg;
            picDiv.appendChild(picImage);

            that.settings.img = picDiv;

            //加载地图，并将地图上的内容放置到地图上面
            let bufferImg = new Image();
            bufferImg.src = obj.src;
            bufferImg.onload = function () {
                picImage.src = obj.src;
                //获取图片的真实高度和宽度
                let width = bufferImg.naturalWidth;
                let height = bufferImg.naturalHeight;

                //根据不同的情况设置div大小
                if (width < that.picWrapWidth && height < that.picWrapHeight) {
                    picDiv.style.width = width + "px";
                    picDiv.style.height = height + "px";
                }
                else {
                    if (width / height > that.picWrapWidth / that.picWrapHeight) {
                        picDiv.style.width = "100%";
                        picDiv.style.height = that.picWrapWidth * height / width + "px";
                        picImage.style.width = "100%";
                        picImage.style.height = "100%";
                    } else {
                        picDiv.style.height = "100%";
                        picDiv.style.width = that.picWrapHeight * width / height + "px";
                        picImage.style.width = "100%";
                        picImage.style.height = "100%";
                    }
                }

                //计算出最大可放大比例
                let maxScale = width / that.picWrapWidth < 1 ? 1 : width / that.picWrapWidth;
                that.maxScale = maxScale * that.settings.maximum * that.settings.maxScale;

                //初始化增加额外的内容调用
                that.initMore(picDiv, obj);


                //给移动端和pc端绑定事件
                if (that.media === "pc") {
                    //平面地图鼠标移动事件
                    picDiv.addEventListener("mousedown", that.mouseDown);
                    //平面地图鼠标滑轮放大缩小事件和移动端两指放大缩小
                    picDiv.addEventListener("mousewheel", that.scrollFun, false);
                    picDiv.addEventListener("DOMMouseScroll", that.scrollFun, false);//给火狐添加放大缩小事件
                }
                else if (that.media === "phone" || that.media === "pad") {
                    picDiv.addEventListener("touchstart", that.mouseDown);
                }
            };
        }

        createDom();

        //图片外框变动触发的事件
        window.addEventListener("resize", function () {
            that.picWrap.innerHTML = null;
            //重新设置高度和宽度
            createDom();
        });

    };

    that.initMore = function () {

    };

    //鼠标滚轮缩放事件
    that.scrollFun = function (event) {
        let img = this;
        that.settings.img = img;

        let e = event || window.event;

        //获取当前img对象的偏移量
        let style = dop.getTransformStyle(img);
        let offsetX = style.translate.translateX;
        let offsetY = style.translate.translateY;
        let scaleX = style.scale.scaleX;

        let imgWidth = img.offsetWidth;//图片实际宽度
        let imgHeight = img.offsetHeight;//图片实际高度
        let picWrapWidth = that.picWrapWidth;//图片外框宽度
        let picWrapHeight = that.picWrapHeight;//图片外框高度
        let picWrapLeft = that.picWrapLeft;//图片外框的距离左侧距离
        let picWrapTop = that.picWrapTop;//图片外框距离顶部距离

        //获取鼠标当前位置在图片的位置
        let mouseLeft = (imgWidth / 2 * scaleX - offsetX - picWrapWidth / 2) + (e.clientX - picWrapLeft);
        let mouseTop = (imgHeight * scaleX / 2 - offsetY - picWrapHeight / 2) + (e.clientY - picWrapTop);

        let percentLeft = mouseLeft / (imgWidth * scaleX);
        let percentTop = mouseTop / (imgHeight * scaleX);

        //PC端地图放大缩小处理
        function wheel(index, event) {
            let e = event || window.event;
            //获取图片的当前大小
            let scale = dop.getTransformStyle(img).scale.scaleX;

            //图片缩放
            let offsetX, offsetY;
            if (index < 0) {
                scale = scale * Math.pow(that.settings.scrollScale, -index);
            }
            else if (index > 0) {
                scale = scale / Math.pow(that.settings.scrollScale, index);
            }

            //设置禁止无限缩放
            if (scale < that.settings.minScale) {
                scale = that.settings.minScale;
            }
            else if (scale > that.maxScale) {
                scale = that.maxScale;
            }

            //缩放以后更新图片的鼠标焦点
            offsetX = imgWidth / 2 * scale - (percentLeft * imgWidth * scale - (e.clientX - picWrapLeft)) - picWrapWidth / 2;

            offsetY = imgHeight * scale / 2 - (percentTop * imgHeight * scale - (e.clientY - picWrapTop)) - picWrapHeight / 2;


            //放大变小问题
            dop.setTransformStyle(img, "translate(" + offsetX + "px, " + offsetY + "px) " + "scale(" + scale + "," + scale + ") ");

            //触发回调
            that.scaleCallback(that.settings.img);

            //更新图片位置
            that.updatePicPoistion(percentLeft, percentTop, e);

        }

        if (e.wheelDelta) {
            //除了firfox浏览器，别的浏览器的处理
            wheel(-e.wheelDelta / 120, e);
        }
        else if (e.detail) {
            //firefox浏览器的测试
            if (e.detail === -3) {
                wheel(-1, e);
            } else if (e.detail === 3) {
                wheel(1, e);
            } else {
                console.log("鼠标滚轮事件改了？", e.wheelDelta);
            }
        }
    };

    //鼠标按下事件
    that.mouseDown = function (event) {
        event.preventDefault();
        let e = event || window.event;
        that.settings.mouseDown.e = e;
        that.settings.img.style.cssText += prefix+"transition:none";
        that.settings.mouseDown.time = Number(new Date());
        let img = that.settings.img;

        if (that.media === "pc") {
            that.settings.mouseDown.x = e.clientX;
            that.settings.mouseDown.y = e.clientY;
        } else if (that.media === "phone" || that.media === "pad") {
            that.settings.mouseDown.x = e.targetTouches[0].clientX;
            that.settings.mouseDown.y = e.targetTouches[0].clientY;
        }

        //获取当前img对象的偏移量
        that.settings.mouseDown.translate = img.style.cssText.match(/translate\((\S*)px,\s(\S*)px\)/);
        that.settings.mouseDown.scale = img.style.cssText.match(/scale\((\S*),\s(\S*)\)/);
        that.settings.mouseDown.offsetX = parseFloat(that.settings.mouseDown.translate[1]);
        that.settings.mouseDown.offsetY = parseFloat(that.settings.mouseDown.translate[2]);
        that.settings.mouseDown.scaleX = parseFloat(that.settings.mouseDown.scale[1]);

        //添加移动事件
        if (that.media === "pc") {
            document.addEventListener("mousemove", that.mouseMove);
            document.addEventListener("mouseup", that.mouseUp);
        }
        else if (that.media === "phone" || that.media === "pad") {
            if (e.targetTouches.length === 1) {
                document.addEventListener("touchmove", that.mouseMove);
                document.addEventListener("touchend", that.mouseUp);
            }
            else if (e.targetTouches.length >= 2) {
                //清除一个手指头的事件
                document.removeEventListener("touchmove", that.mouseMove);
                document.removeEventListener("touchend", that.mouseUp);

                var scaleX = that.settings.mouseDown.scaleX;
                var offsetX = that.settings.mouseDown.offsetX;
                var offsetY = that.settings.mouseDown.offsetY;
                var picWrapWidth = that.picWrapWidth;
                var picWrapHeight = that.picWrapHeight;
                var picWrapLeft = that.picWrapLeft;
                var picWrapTop = that.picWrapTop;

                //生成原始位置信息
                that.settings.twoTouch = {
                    clientX: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                    clientY: (event.touches[0].clientY + event.touches[1].clientY) / 2,
                    distance: Math.sqrt(Math.pow(Math.abs(event.touches[0].clientX - event.touches[1].clientX), 2) + Math.pow(Math.abs(event.touches[0].clientY - event.touches[1].clientY), 2)),
                    scale: that.settings.mouseDown.scaleX
                };

                //获取鼠标当前位置在图片的位置
                that.settings.twoTouch.mouseLeft = (that.settings.img.offsetWidth / 2 * scaleX - offsetX - picWrapWidth / 2) + (that.settings.twoTouch.clientX - picWrapLeft);
                that.settings.twoTouch.mouseTop = (that.settings.img.offsetHeight * scaleX / 2 - offsetY - picWrapHeight / 2) + (that.settings.twoTouch.clientY - picWrapTop);
                //当前手指中心点的百分比
                that.settings.twoTouch.percentLeft = that.settings.twoTouch.mouseLeft / (that.settings.img.offsetWidth * scaleX);
                that.settings.twoTouch.percentTop = that.settings.twoTouch.mouseTop / (that.settings.img.offsetHeight * scaleX);

                //添加两指移动事件
                document.addEventListener("touchmove", that.twoTouch);
                document.addEventListener("touchend", that.twoTouchEnd);
            }
        }

    };

    //鼠标移动事件
    that.mouseMove = function (event) {
        let img = that.settings.img;
        let e = event || window.event;
        if (that.media === 'pc') {
            e.preventDefault();
            that.settings.mouseMove.x = e.clientX;
            that.settings.mouseMove.y = e.clientY;
        } else if (that.media === "phone" || that.media === "pad") {
            that.settings.mouseMove.x = e.targetTouches[0].clientX;
            that.settings.mouseMove.y = e.targetTouches[0].clientY;
        }

        //计算出移动的距离
        let moveX = that.settings.mouseMove.x - that.settings.mouseDown.x;
        let moveY = that.settings.mouseMove.y - that.settings.mouseDown.y;

        //修改图片的位置
        img.style.cssText += that.prefix+"transition:none; "+that.prefix+"transform:translate(" + (moveX + that.settings.mouseDown.offsetX) + "px," + (moveY + that.settings.mouseDown.offsetY) + "px) " + "scale(" + that.settings.mouseDown.scaleX + "," + that.settings.mouseDown.scaleX + ");";
    };

    //两指移动事件
    that.twoTouch = function (eve) {
        let event = eve || window.event;
        if (event.targetTouches.length === 1) return;
        let e = that.settings.twoTouch;

        let picWrapWidth = that.picWrapWidth;
        let picWrapHeight = that.picWrapHeight;
        let picWrapLeft = that.picWrapLeft;
        let picWrapTop = that.picWrapTop;
        let imgWidth = that.settings.img.offsetWidth;
        let imgHeight = that.settings.img.offsetHeight;

        //获取移动后的两个手指的位置
        let data = {
            clientX: (event.touches[0].clientX + event.touches[1].clientX) / 2,
            clientY: (event.touches[0].clientY + event.touches[1].clientY) / 2,
            distance: Math.sqrt(Math.pow(Math.abs(event.touches[0].clientX - event.touches[1].clientX), 2) + Math.pow(Math.abs(event.touches[0].clientY - event.touches[1].clientY), 2))
        };
        //修改中心点处于图片的位置
        let mouseLeft = data.clientX - e.clientX;
        let mouseTop = data.clientY - e.clientY;

        //设置属性
        let scale = e.scale * data.distance / e.distance;

        //设置禁止无限缩放
        if (scale < that.settings.minScale) {
            scale = that.settings.minScale;
        }
        else if (scale > that.maxScale) {
            scale = that.maxScale;
        }

        //缩放以后更新图片的鼠标焦点
        let offsetX = imgWidth / 2 * scale - (e.percentLeft * imgWidth * scale - (e.clientX - picWrapLeft)) - picWrapWidth / 2 + mouseLeft;
        let offsetY = imgHeight * scale / 2 - (e.percentTop * imgHeight * scale - (e.clientY - picWrapTop)) - picWrapHeight / 2 + mouseTop;

        that.settings.img.style.cssText += prefix+"transform:translate(" + offsetX + "px, " + offsetY + "px) " + "scale(" + scale + "," + scale + ") ";

        //触发回调
        that.scaleCallback(that.settings.img);
    };

    //鼠标抬起事件
    that.mouseUp = function () {
        //鼠标抬起时清除所有与之不相关的事件
        document.removeEventListener("mousemove", that.mouseMove);
        document.removeEventListener("mouseup", that.mouseUp);
        document.removeEventListener("touchmove", that.mouseMove);
        document.removeEventListener("touchend", that.mouseUp);
        document.removeEventListener("touchmove", that.twoTouch);

        //鼠标抬起处理问题，在为pc或者只是移动图片的情况下
        if (that.media === "pc" || that.settings.mouseDown.e.touches.length === 1) {
            that.settings.mouseUp.time = Number(new Date());
            that.updatePicPoistion();
        }
    };

    //两个手指抬起处理清除事件
    that.twoTouchEnd = function () {
        //清除事件
        document.removeEventListener("touchmove", that.mouseMove);
        document.removeEventListener("touchend", that.twoTouchEnd);
        document.removeEventListener("touchmove", that.twoTouch);
        //手指抬起处理图片的位置
        that.settings.mouseUp.time = Number(new Date());
        that.updatePicPoistion();
    };

    //操作完成后进行图片的位置处理
    that.updatePicPoistion = function (percentLeft, percentTop, e) {

        //移动完处理问题
        that.settings.img.style.cssText += prefix+"transition:" + that.settings.picTransition;
        //that.ul.style.transition = that.settings.picWrapTransition;
        let translate = that.settings.img.style.cssText.match(/translate\((\S*)px,\s(\S*)px\)/);
        let scale = parseInt(that.settings.img.style.cssText.match(/scale\((\S*),\s(\S*)\)/)[1] * 10000) / 10000;
        let offsetX = parseFloat(translate[1]);
        let offsetY = parseFloat(translate[2]);

        //更新图片的位置
        function updatePosition(scale) {
            let picWrap = that.picWrap;
            let img = that.settings.img;

            //先判断图片宽度不超过盒子的宽度的情况
            if (picWrap.offsetWidth >= img.offsetWidth * scale) {
                //如果图片左侧超过了盒子范围，矫正
                offsetX = 0;
            }
            else {
                //图片宽度超过盒子宽度的情况下，尽量保证页面显示最多面积的图片
                if (img.offsetWidth * scale / 2 + offsetX < picWrap.offsetWidth / 2) {
                    //移动后图片右侧出现空白面积
                    offsetX = (picWrap.offsetWidth - img.offsetWidth * scale) / 2;
                }
                else if (offsetX + picWrap.offsetWidth / 2 > img.offsetWidth * scale / 2) {
                    //移动后图片左侧出现空白面积
                    offsetX = (img.offsetWidth * scale - picWrap.offsetWidth) / 2;
                }
            }

            //判断图片高度不超过盒子的高度下的问题
            if (picWrap.offsetHeight >= img.offsetHeight * scale) {
                //如果图片上部超过了盒子范围，矫正offset.offsetY = 0;
                offsetY = 0;
            }
            else {
                //图片高度超过盒子高度的情况下，尽量保证页面显示最多面积的图片
                if (img.offsetHeight * scale / 2 + offsetY < picWrap.offsetHeight / 2) {
                    offsetY = (picWrap.offsetHeight - img.offsetHeight * scale) / 2;
                }
                else if (offsetY + picWrap.offsetHeight / 2 > img.offsetHeight * scale / 2) {
                    offsetY = (img.offsetHeight * scale - picWrap.offsetHeight) / 2;
                }
            }

            return {offsetX: offsetX, offsetY: offsetY};
        }

        //更新放大比例
        //显示地图的缩放率保证在一以上
        timeOutScale(scale);

        //延迟缩放
        function timeOutScale(scale) {
            let img = that.settings.img;
            let imgWidth = img.offsetWidth;
            let imgHeight = img.offsetHeight;
            let picWrapLeft = that.picWrapLeft;
            let picWrapTop = that.picWrapTop;
            let picWrapWidth = that.picWrapWidth;
            let picWrapHeight = that.picWrapHeight;
            //清除原来设置好的延时器
            clearTimeout(that.settings.timeOut);
            //更新位置
            let offset = updatePosition(scale);
            let offsetX = offset.offsetX;
            let offsetY = offset.offsetY;
            //更新图片的位置
            img.style.cssText += that.prefix+"transform:translate(" + offsetX + "px," + offsetY + "px) scale(" + scale + "," + scale + ") ";
            let twoTouch = that.settings.twoTouch;
            let maxScale = (that.maxScale * 10000) / 10000 / that.settings.maximum;//图片能够显示的最大放大尺度

            //计算出延迟后修改的内容
            if (scale <= 1) {
                scale = 1;
            }
            else if (scale > maxScale) {

                scale = maxScale;
                offset = updatePosition(scale);
                offsetX = offset.offsetX;
                offsetY = offset.offsetY;

                //如果是放大，定位也需要回退
                //缩放以后更新图片的鼠标焦点
                if (that.media === "pc") {
                    offsetX = imgWidth / 2 * scale - (percentLeft * imgWidth * scale - (e.clientX - picWrapLeft)) - picWrapWidth / 2;
                    offsetY = imgHeight * scale / 2 - (percentTop * imgHeight * scale - (e.clientY - picWrapTop)) - picWrapHeight / 2;
                }
                else if (that.media === "phone" || that.media === "pad") {
                    offsetX = imgWidth / 2 * scale - (twoTouch.percentLeft * imgWidth * scale - (twoTouch.clientX - picWrapLeft)) - picWrapWidth / 2;
                    offsetY = imgHeight * scale / 2 - (twoTouch.percentTop * imgHeight * scale - (twoTouch.clientY - picWrapTop)) - picWrapHeight / 2;
                }
            }

            //重新设置延时器
            that.settings.timeOut = setTimeout(function () {
                img.style.cssText += that.prefix+"transform:translate(" + offsetX + "px," + offsetY + "px) scale(" + scale + "," + scale + ") ";
                that.touchendCallback(that.settings.img);
            }, that.settings.updateTimeOut);
        }
    };

    //切换下一张图片的方法
    that.changePic = function (val) {
        var picIndex = that.settings.picIndex;
        var arr = that.arr;
        //判断是向左还是向右移动图片
        if (val === "left") {
            picIndex--;
            if (picIndex < 0) {
                picIndex = 0;
                //return;
            }
        } else if (val === "right") {
            picIndex++;
            if (picIndex >= arr.length) {
                picIndex = arr.length - 1;
                //return;
            }
        }

        that.settings.picIndex = picIndex;
        //console.log(picIndex,picWrap.offsetWidth);
        //移动列表
        that.ul.style.left = -picIndex * that.picWrap.offsetWidth + "px";
        for (var i = 0; i < that.ul.childNodes.length; i++) {
            that.ul.childNodes[i].childNodes[0].style.cssText += prefix+"transform:translate(0px, 0px) scale(1, 1)";
        }
    };

    //图片缩放时调用的方法，更新相关内容
    that.scaleCallback = function (scale) {
        //console.log(scale);
    };

    //图片缩放完成后的回调方法
    that.touchendCallback = function (offsetY, offsetX, scale) {
        //console.log(offsetY, offsetX, scale);
    }
};

//添加仿微信图片查看扩展
Dop.prototype.ImageView = function (obj) {
    let my = new Dop();
    let dop = my;
    let that = this;
    let prefix = my.getPrefix();
    let settings = {
        mouseDown: {
            x: 0,
            y: 0,
            time: null//存储鼠标按下时的时间
        },//鼠标按下数据存储
        mouseMove: {
            x: 0,
            y: 0
        },//鼠标移动数据存储
        mouseUp: {time: null},//鼠标抬起数据存储
        loadImg: "button/load.gif",//图片加载中动态图
        ulStyle: "height:100%; padding:0; margin:0; position:absolute; left:0; overflow:hidden;",//生成的ul的样式
        liStyle: "height:100%; padding:0; margin:0; float:left; position:relative; list-style-type:none; overflow:hidden;",//生成的li的样式
        imgStyle: "position:absolute; left:0; top:0; right:0; bottom:0; margin:auto; cursor:move; display:block; "+prefix+"transform:translate(0px, 0px) scale(1,1); max-width:100%; max-height:100%;",//生成的img的样式
        maxScale: 2,//实际图片的最大放大比例，默认为1
        maximum: 1.5,//手指可以放大到的最大极限
        minScale: 0.8,//最小缩放比例
        scrollScale: 1.1,//每次缩放的比例
        picIndex: 0,//当前显示的第几张图片，默认第一张
        img: null,//当前操作的img,鼠标抬起时清空
        picTransition: "all 1.3s",//图片过渡效果设置
        picWrapTransition: "all 1.3s",//ul列表的过渡样式
        canMovePercent: "50%",//移动图片出现空白的百分比以后就会切换页面
        updateTimeOut: 100,//每次鼠标离开屏幕后，处理界面的延迟
        timeOut: null,//鼠标屏幕离开的延时器对象存储
        delay:0,//显示之前会有多长时间的动画
        changeBtn: {//pc端左右切换按钮样式
            leftBtn: {//向左切换按钮
                src: "button/left.png",
                style: "position:absolute; top:50%; "+prefix+"transform:translateY(-50%); width:50px; height:100px; cursor:pointer; z-index:1; left:0;"
            },
            rightBtn: {//向右切换按钮
                src: "button/right.png",
                style: "position:absolute; top:50%; "+prefix+"transform:translateY(-50%); width:50px; height:100px; cursor:pointer; z-index:1; right:0;"
            },
            changePic: "max-width:100%; max-height:100%; position:absolute; top:0; right:0; bottom:0; left:0; margin:auto; display:block;"
        }
    };
    that.settings = my.jquery.extend(true, {}, settings, obj);

    //media 媒体类型 phone,pc,pad   picWrap 需要填充的标签div   arr 图片数据数组
    that.init = function (media, picWrap, arr) {
        that.arr = arr;
        that.picWrap = picWrap;
        that.media = media || my.browserRedirect();
        function createDom() {
            that.picWrapWidth = that.picWrap.offsetWidth;////图片外框宽度
            that.picWrapHeight = that.picWrap.offsetHeight;//图片外框高度
            setTimeout(function () {
                that.picWrapLeft = that.picWrap.getBoundingClientRect().left;//图片外框的距离左侧距离
                that.picWrapTop = that.picWrap.getBoundingClientRect().top;//图片外框距离顶部距离
            },that.settings.delay*1000);
            that.prefix = my.getPrefix();

            picWrap.style.overflow = "hidden";
            picWrap.style.cssText += that.prefix + "user-select:none;";
            let position = window.getComputedStyle(picWrap,null)["position"];
            if (position !== "absolute" && position !== "relative" && position !== "fixed") {
                picWrap.style.position = "relative";
            }

            //pc端添加左右切换按钮
            if (that.media === "pc" && that.arr.length > 1) {
                //向左切换图片按钮
                let left = document.createElement("div");
                let leftImg = document.createElement("img");
                leftImg.src = that.settings.changeBtn.leftBtn.src;
                //添加悬停效果
                my.addImageHover(leftImg,that.settings.changeBtn.leftBtn.src,that.settings.changeBtn.leftBtn.hover || that.settings.changeBtn.leftBtn.src);
                left.onclick = function () {
                    that.changePic("left");
                };

                //向右切换图片按钮
                let right = document.createElement("div");
                let rightImg = document.createElement("img");
                rightImg.src = that.settings.changeBtn.rightBtn.src;
                //添加悬停效果
                my.addImageHover(rightImg,that.settings.changeBtn.rightBtn.src,that.settings.changeBtn.rightBtn.hover || that.settings.changeBtn.rightBtn.src);
                right.onclick = function () {
                    that.changePic("right");
                };

                //给左右切换按钮添加样式
                left.style.cssText = that.settings.changeBtn.leftBtn.style;
                right.style.cssText = that.settings.changeBtn.rightBtn.style;
                leftImg.style.cssText = rightImg.style.cssText = that.settings.changeBtn.changePic;

                //将元素添加到dom树
                left.appendChild(leftImg);
                picWrap.appendChild(left);
                right.appendChild(rightImg);
                picWrap.appendChild(right);
            }

            var len = arr.length;
            //创建ul
            that.ul = document.createElement("ul");
            that.ul.style.cssText = that.settings.ulStyle+ prefix + "transition:" + that.settings.picWrapTransition;
            that.ul.style.width = len * that.picWrapWidth + "px";
            picWrap.appendChild(that.ul);

            //创建li
            for (var i = 0; i < len; i++) {
                (function (i) {
                    var li = document.createElement("li");
                    li.style.cssText = that.settings.liStyle;
                    li.style.width = that.picWrapWidth + "px";
                    that.ul.appendChild(li);

                    //创建img
                    var img = document.createElement("img");
                    img.style.cssText = that.settings.imgStyle;
                    img.src = that.settings.loadImg;
                    li.appendChild(img);

                    //js动态加载图片
                    var bufferImg = new Image();
                    bufferImg.src = arr[i].src;
                    bufferImg.onload = function () {
                        img.src = arr[i].src;
                        //将图片的实际大小存储到对象当中
                        arr[i].width = img.naturalWidth;
                        arr[i].height = img.naturalHeight;

                        arr[i].scale = arr[i].width / img.width;
                        //设置图片大小
                        if (img.naturalWidth / img.naturalHeight > that.picWrapWidth / that.picWrapHeight) {
                            img.style.width = "100%";
                        } else {
                            img.style.height = "100%";
                        }

                        if (arr[i].scale < 1) {
                            arr[i].scale = 1;
                        }

                        //给移动端和pc端绑定事件
                        if (that.media === "pc") {
                            //平面地图鼠标移动事件
                            img.addEventListener("mousedown", that.mouseDown);
                            //平面地图鼠标滑轮放大缩小事件和移动端两指放大缩小
                            img.addEventListener("mousewheel", that.scrollFun, false);
                            img.addEventListener("DOMMouseScroll", that.scrollFun, false);//给火狐添加放大缩小事件
                        } else if (that.media === "phone" || that.media === "pad") {
                            img.addEventListener("touchstart", that.mouseDown);
                        }
                    };
                })(i);
            }

            //移动列表
            var picIndex = that.settings.picIndex;
            that.ul.style.left = -picIndex * that.picWrap.offsetWidth + "px";
            for (var i = 0; i < that.ul.childNodes.length; i++) {
                that.ul.childNodes[i].childNodes[0].style.cssText  += prefix+"transform:translate(0px, 0px) scale(1, 1)";
            }
        }

        createDom();

        //图片外框变动触发的事件
        window.addEventListener("resize", function () {
            that.picWrap.innerHTML = null;
            //重新设置高度和宽度
            createDom();
        });

    };

    //鼠标滚轮缩放事件
    that.scrollFun = function (event) {
        let img = this;
        that.settings.img = img;

        let e = event || window.event;

        //获取当前img对象的偏移量
        let translate = img.style.cssText.match(/translate\((\S*)px,\s(\S*)px\)/);
        let scale = img.style.cssText.match(/scale\((\S*),\s(\S*)\)/);
        let offsetX = parseFloat(translate[1]);
        let offsetY = parseFloat(translate[2]);
        let scaleX = parseFloat(scale[1]);

        let imgWidth = img.offsetWidth;//图片实际宽度
        let imgHeight = img.offsetHeight;//图片实际高度
        let picWrapWidth = that.picWrap.offsetWidth;//图片外框宽度
        let picWrapHeight = that.picWrap.offsetHeight;//图片外框高度
        let picWrapLeft = that.picWrap.offsetLeft;//图片外框的距离左侧距离
        let picWrapTop = that.picWrap.offsetTop;//图片外框距离顶部距离

        //获取鼠标当前位置在图片的位置
        let mouseLeft = (imgWidth / 2 * scaleX - offsetX - picWrapWidth / 2) + (e.clientX - picWrapLeft);
        let mouseTop = (imgHeight * scaleX / 2 - offsetY - picWrapHeight / 2) + (e.clientY - picWrapTop);

        let percentLeft = mouseLeft / (imgWidth * scaleX);
        let percentTop = mouseTop / (imgHeight * scaleX);

        //PC端地图放大缩小处理
        function wheel(index, event) {
            let e = event || window.event;
            //获取图片的当前大小
            let translate = img.style.cssText.match(/translate\((\S*)px,\s(\S*)px\)/);
            let scale = img.style.cssText.match(/scale\((\S*),\s(\S*)\)/)[1];

            //图片缩放
            let offsetX, offsetY;
            if (index < 0) {
                scale = scale * Math.pow(that.settings.scrollScale, -index);
            }
            else if (index > 0) {
                scale = scale / Math.pow(that.settings.scrollScale, index);
            }

            //设置禁止无限缩放
            let maxScale = that.arr[that.settings.picIndex].scale * that.settings.maximum * that.settings.maxScale;
            if (scale < that.settings.minScale) {
                scale = that.settings.minScale;
            }
            else if (scale > maxScale) {
                scale = maxScale;
            }

            //缩放以后更新图片的鼠标焦点
            offsetX = imgWidth / 2 * scale - (percentLeft * imgWidth * scale - (e.clientX - picWrapLeft)) - picWrapWidth / 2;

            offsetY = imgHeight * scale / 2 - (percentTop * imgHeight * scale - (e.clientY - picWrapTop)) - picWrapHeight / 2;


            //放大变小问题
            img.style.cssText += prefix+"transform:translate(" + offsetX + "px, " + offsetY + "px) " + "scale(" + scale + "," + scale + ") ";

            //触发回调
            that.scaleCallback(scale);

            //更新图片位置
            that.updatePicPosition(percentLeft, percentTop, e);

        }

        if (e.wheelDelta) {
            //除了firfox浏览器，别的浏览器的处理
            wheel(-e.wheelDelta / 120, e);
        }
        else if (e.detail) {
            //firefox浏览器的测试
            if (e.detail === -3) {
                wheel(-1, e);
            } else if (e.detail === 3) {
                wheel(1, e);
            } else {
                console.log("鼠标滚轮事件改了？", e.wheelDelta);
            }
        }
    };

    //鼠标按下事件
    that.mouseDown = function (event) {
        event.preventDefault();
        let e = event || window.event;
        let img = this;
        that.settings.img = img;
        that.settings.mouseDown.e = e;
        that.settings.img.style.cssText += prefix + "transition:none";
        that.settings.mouseDown.time = Number(new Date());

        if (that.media === "pc") {
            that.settings.mouseDown.x = e.clientX;
            that.settings.mouseDown.y = e.clientY;
        }
        else if (that.media === "phone" || that.media === "pad") {
            that.settings.mouseDown.x = e.targetTouches[0].clientX;
            that.settings.mouseDown.y = e.targetTouches[0].clientY;
        }

        //获取当前img对象的偏移量
        that.settings.mouseDown.translate = img.style.cssText.match(/translate\((\S*)px,\s(\S*)px\)/);
        that.settings.mouseDown.scale = img.style.cssText.match(/scale\((\S*),\s(\S*)\)/);
        that.settings.mouseDown.offsetX = parseFloat(that.settings.mouseDown.translate[1]);
        that.settings.mouseDown.offsetY = parseFloat(that.settings.mouseDown.translate[2]);
        that.settings.mouseDown.scaleX = parseFloat(that.settings.mouseDown.scale[1]);

        //添加移动事件
        if (that.media === "pc") {
            document.addEventListener("mousemove", that.mouseMove);
            document.addEventListener("mouseup", that.mouseUp);
        }
        else if (that.media === "phone" || that.media === "pad") {
            if (e.targetTouches.length === 1) {
                document.addEventListener("touchmove", that.mouseMove);
                document.addEventListener("touchend", that.mouseUp);
            }
            else if (e.targetTouches.length >= 2) {
                //清除一个手指头的事件
                document.removeEventListener("touchmove", that.mouseMove);
                document.removeEventListener("touchend", that.mouseUp);

                var scaleX = that.settings.mouseDown.scaleX;
                var offsetX = that.settings.mouseDown.offsetX;
                var offsetY = that.settings.mouseDown.offsetY;
                var picWrapWidth = that.picWrapWidth;
                var picWrapHeight = that.picWrapHeight;
                var picWrapLeft = that.picWrapLeft;
                var picWrapTop = that.picWrapTop;

                //生成原始位置信息
                that.settings.twoTouch = {
                    clientX: (event.touches[0].clientX + event.touches[1].clientX) / 2,
                    clientY: (event.touches[0].clientY + event.touches[1].clientY) / 2,
                    distance: Math.sqrt(Math.pow(Math.abs(event.touches[0].clientX - event.touches[1].clientX), 2) + Math.pow(Math.abs(event.touches[0].clientY - event.touches[1].clientY), 2)),
                    scale: that.settings.mouseDown.scaleX
                };

                //获取鼠标当前位置在图片的位置
                that.settings.twoTouch.mouseLeft = (that.settings.img.offsetWidth / 2 * scaleX - offsetX - picWrapWidth / 2) + (that.settings.twoTouch.clientX - picWrapLeft);
                that.settings.twoTouch.mouseTop = (that.settings.img.offsetHeight * scaleX / 2 - offsetY - picWrapHeight / 2) + (that.settings.twoTouch.clientY - picWrapTop);
                //当前手指中心点的百分比
                that.settings.twoTouch.percentLeft = that.settings.twoTouch.mouseLeft / (that.settings.img.offsetWidth * scaleX);
                that.settings.twoTouch.percentTop = that.settings.twoTouch.mouseTop / (that.settings.img.offsetHeight * scaleX);

                //添加两指移动事件
                document.addEventListener("touchmove", that.twoTouch);
                document.addEventListener("touchend", that.twoTouchEnd);
            }
        }

    };

    //鼠标移动事件
    that.mouseMove = function (event) {
        let img = that.settings.img;
        let e = event || window.event;
        if (that.media === 'pc') {
            e.preventDefault();
            that.settings.mouseMove.x = e.clientX;
            that.settings.mouseMove.y = e.clientY;
        }
        else if (that.media === "phone" || that.media === "pad") {
            that.settings.mouseMove.x = e.targetTouches[0].clientX;
            that.settings.mouseMove.y = e.targetTouches[0].clientY;
        }

        //计算出移动的距离
        let moveX = that.settings.mouseMove.x - that.settings.mouseDown.x;
        let moveY = that.settings.mouseMove.y - that.settings.mouseDown.y;

        //移动图片时，处理是移动整个盒子，还是图片
        let changePicWrap = function (scale) {
            that.ul.style.cssText += prefix+"transition:none";
            let percentX;
            let changeOffsetX = moveX + that.settings.mouseDown.offsetX;

            if (that.picWrap.offsetWidth >= img.offsetWidth * scale) {
                //如果没有放大，直接移动的是图片列表外部的框体
                percentX = moveX;
                //设置只修改y轴
                img.style.cssText += prefix+"transform:translate(" + that.settings.mouseDown.offsetX + "px," + (moveY + that.settings.mouseDown.offsetY) + "px) " + "scale(" + scale + "," + scale + ")";
            }
            else {
                //图片宽度超过盒子宽度的情况下，尽量保证页面显示最多面积的图片
                if (img.offsetWidth * scale / 2 + changeOffsetX < that.picWrap.offsetWidth / 2) {
                    //移动后图片右侧出现空白面积
                    percentX = img.offsetWidth * scale / 2 + changeOffsetX - that.picWrap.offsetWidth / 2;
                }
                else if (changeOffsetX + that.picWrap.offsetWidth / 2 > img.offsetWidth * scale / 2) {
                    //移动后图片左侧出现空白面积
                    percentX = that.picWrap.offsetWidth / 2 + changeOffsetX - img.offsetWidth * scale / 2;
                }
                else {
                    img.style.cssText += prefix+"transform:translate(" + (changeOffsetX) + "px," + (moveY + that.settings.mouseDown.offsetY) + "px) " + "scale(" + scale + "," + scale + ")";
                    percentX = 0;
                }
            }

            that.ul.style.left = -that.settings.picIndex * that.picWrapWidth + percentX + "px";

        };

        changePicWrap(that.settings.mouseDown.scaleX);
    };

    //两指移动事件
    that.twoTouch = function (eve) {
        let event = eve || window.event;
        if (event.targetTouches.length === 1) return;
        let e = that.settings.twoTouch;

        let picWrapWidth = that.picWrapWidth;
        let picWrapHeight = that.picWrapHeight;
        let picWrapLeft = that.picWrapLeft;
        let picWrapTop = that.picWrapTop;
        let imgWidth = that.settings.img.offsetWidth;
        let imgHeight = that.settings.img.offsetHeight;

        //获取移动后的两个手指的位置
        let data = {
            clientX: (event.touches[0].clientX + event.touches[1].clientX) / 2,
            clientY: (event.touches[0].clientY + event.touches[1].clientY) / 2,
            distance: Math.sqrt(Math.pow(Math.abs(event.touches[0].clientX - event.touches[1].clientX), 2) + Math.pow(Math.abs(event.touches[0].clientY - event.touches[1].clientY), 2))
        };
        //修改中心点处于图片的位置
        let mouseLeft = data.clientX - e.clientX;
        let mouseTop = data.clientY - e.clientY;

        //设置属性
        let scale = e.scale * data.distance / e.distance;

        //设置禁止无限缩放
        let maxScale = that.arr[that.settings.picIndex].scale * that.settings.maximum * that.settings.maxScale;
        if (scale < that.settings.minScale) {
            scale = that.settings.minScale;
        }
        else if (scale > maxScale) {
            scale = maxScale;
        }

        //缩放以后更新图片的鼠标焦点
        let offsetX = imgWidth / 2 * scale - (e.percentLeft * imgWidth * scale - (e.clientX - picWrapLeft)) - picWrapWidth / 2 + mouseLeft;
        let offsetY = imgHeight * scale / 2 - (e.percentTop * imgHeight * scale - (e.clientY - picWrapTop)) - picWrapHeight / 2 + mouseTop;

        that.settings.img.style.cssText += prefix + "transform:translate(" + offsetX + "px, " + offsetY + "px) " + "scale(" + scale + "," + scale + ") ";

        //触发回调
        that.scaleCallback(scale);
    };

    //鼠标抬起事件
    that.mouseUp = function () {
        //鼠标抬起时清除所有与之不相关的事件
        document.removeEventListener("mousemove", that.mouseMove);
        document.removeEventListener("mouseup", that.mouseUp);
        document.removeEventListener("touchmove", that.mouseMove);
        document.removeEventListener("touchend", that.mouseUp);
        document.removeEventListener("touchmove", that.twoTouch);

        //鼠标抬起处理问题，在为pc或者只是移动图片的情况下
        if (that.media === "pc" || that.settings.mouseDown.e.touches.length === 1) {
            that.settings.mouseUp.time = Number(new Date());
            that.updatePicPosition();
        }
    };

    //两个手指抬起处理清除事件
    that.twoTouchEnd = function () {
        //清除事件
        document.removeEventListener("touchmove", that.mouseMove);
        document.removeEventListener("touchend", that.twoTouchEnd);
        document.removeEventListener("touchmove", that.twoTouch);
        //手指抬起处理图片的位置
        that.settings.mouseUp.time = Number(new Date());
        that.updatePicPosition();
    };

    //操作完成后进行图片的位置处理
    that.updatePicPosition = function (percentLeft, percentTop, e) {

        //移动完处理问题
        that.settings.img.style.cssText += prefix + "transition:" + that.settings.picTransition;
        that.ul.style.cssText += prefix + "transition:"+ that.settings.picWrapTransition;
        let translate = that.settings.img.style.cssText.match(/translate\((\S*)px,\s(\S*)px\)/);
        let scale = parseInt(that.settings.img.style.cssText.match(/scale\((\S*),\s(\S*)\)/)[1] * 10000) / 10000;
        let offsetX = parseFloat(translate[1]);
        let offsetY = parseFloat(translate[2]);

        //处理是否切换页面
        let percentX = parseFloat(that.ul.style.left) + that.settings.picIndex * that.picWrapWidth;
        if (Math.abs(percentX) >= that.picWrapWidth * parseFloat(that.settings.canMovePercent) / 100 ||
            (that.settings.mouseUp.time - that.settings.mouseDown.time <= 250) && (Math.abs(percentX) >= that.picWrapWidth * 0.1)
        ) {
            if (percentX < 0) {
                //向右切换图片
                that.changePic("right");
            }
            else {
                //向左切换图片
                that.changePic("left");
            }
        }
        else {
            setTimeout(function () {
                that.ul.style.left = -that.settings.picIndex * that.picWrapWidth + "px";
            }, 0);
        }

        //更新图片的位置
        function updatePosition(scale) {
            let picWrap = that.picWrap;
            let img = that.settings.img;

            //先判断图片宽度不超过盒子的宽度的情况
            if (picWrap.offsetWidth >= img.offsetWidth * scale) {
                //如果图片左侧超过了盒子范围，矫正
                offsetX = 0;
            }
            else {
                //图片宽度超过盒子宽度的情况下，尽量保证页面显示最多面积的图片
                if (img.offsetWidth * scale / 2 + offsetX < picWrap.offsetWidth / 2) {
                    //移动后图片右侧出现空白面积
                    offsetX = (picWrap.offsetWidth - img.offsetWidth * scale) / 2;
                }
                else if (offsetX + picWrap.offsetWidth / 2 > img.offsetWidth * scale / 2) {
                    //移动后图片左侧出现空白面积
                    offsetX = (img.offsetWidth * scale - picWrap.offsetWidth) / 2;
                }
            }

            //判断图片高度不超过盒子的高度下的问题
            if (picWrap.offsetHeight >= img.offsetHeight * scale) {
                //如果图片上部超过了盒子范围，矫正offset.offsetY = 0;
                offsetY = 0;
            }
            else {
                //图片高度超过盒子高度的情况下，尽量保证页面显示最多面积的图片
                if (img.offsetHeight * scale / 2 + offsetY < picWrap.offsetHeight / 2) {
                    offsetY = (picWrap.offsetHeight - img.offsetHeight * scale) / 2;
                }
                else if (offsetY + picWrap.offsetHeight / 2 > img.offsetHeight * scale / 2) {
                    offsetY = (img.offsetHeight * scale - picWrap.offsetHeight) / 2;
                }
            }

            return {offsetX: offsetX, offsetY: offsetY};
        }

        //更新放大比例
        //显示地图的缩放率保证在一以上
        timeOutScale(scale);

        //延迟缩放
        function timeOutScale(scale) {
            let img = that.settings.img;
            let imgWidth = img.offsetWidth;
            let imgHeight = img.offsetHeight;
            let picWrapLeft = that.picWrapLeft;
            let picWrapTop = that.picWrapTop;
            let picWrapWidth = that.picWrapWidth;
            let picWrapHeight = that.picWrapHeight;

            //更新位置
            let offset = updatePosition(scale);
            let offsetX = offset.offsetX;
            let offsetY = offset.offsetY;
            //更新图片的位置
            img.style.cssText += prefix+"transform:translate(" + offsetX + "px," + offsetY + "px) scale(" + scale + "," + scale + ") ";
            let twoTouch = that.settings.twoTouch;
            let maxScale = parseInt(that.arr[that.settings.picIndex].scale * that.settings.maxScale * 10000) / 10000;

            //计算出延迟后修改的内容
            if (scale < 1) {
                scale = 1;
            }
            else if (scale > maxScale) {

                scale = maxScale;
                offset = updatePosition(scale);
                offsetX = offset.offsetX;
                offsetY = offset.offsetY;

                //如果是放大，定位也需要回退
                //缩放以后更新图片的鼠标焦点
                if (that.media === "pc") {
                    offsetX = imgWidth / 2 * scale - (percentLeft * imgWidth * scale - (e.clientX - picWrapLeft)) - picWrapWidth / 2;
                    offsetY = imgHeight * scale / 2 - (percentTop * imgHeight * scale - (e.clientY - picWrapTop)) - picWrapHeight / 2;
                }
                else if (that.media === "phone" || that.media === "pad") {
                    offsetX = imgWidth / 2 * scale - (twoTouch.percentLeft * imgWidth * scale - (twoTouch.clientX - picWrapLeft)) - picWrapWidth / 2;
                    offsetY = imgHeight * scale / 2 - (twoTouch.percentTop * imgHeight * scale - (twoTouch.clientY - picWrapTop)) - picWrapHeight / 2;
                }
            }

            clearTimeout(that.settings.timeOut);
            that.settings.timeOut = setTimeout(function () {
                img.style.cssText += prefix+"transform:translate(" + offsetX + "px," + offsetY + "px) scale(" + scale + "," + scale + ") ";
                that.touchendCallback(offsetY, offsetX, scale);
            }, that.settings.updateTimeOut);
        }
    };

    //切换下一张图片的方法
    that.changePic = function (val) {
        let picIndex = that.settings.picIndex;
        let arr = that.arr;
        //判断是向左还是向右移动图片
        if (val === "left") {
            if (picIndex <= 0) {
                picIndex = 0;
                changeList(true);
            }
            else {
                picIndex--;
                changeList(false);
            }
        }
        else if (val === "right") {
            picIndex++;
            if (picIndex >= arr.length) {
                picIndex = arr.length - 1;
                changeList(true);
            }
            else {
                changeList(false);
            }
        }

        //判断
        function changeList(bool) {
            //移动列表
            that.settings.picIndex = picIndex;

            //判断是否在结尾处，如果在结尾，实现弹一下的效果 是（true） 不是 （false）
            //that.changePic.canBcak  延迟器，延迟一下触发时间
            if (bool && that.media === "pc") {
                clearTimeout(that.changePic.canBack);
                if (picIndex == 0) {
                    that.ul.style.left = "300px";
                }
                else {
                    that.ul.style.left = -300 - picIndex * that.picWrap.offsetWidth + "px";
                }

                that.changePic.canBack = setTimeout(function () {
                    if (!that.changePic.canBack) return;
                    that.ul.style.left = -picIndex * that.picWrap.offsetWidth + "px";
                }, 300)
            }
            else {
                clearTimeout(that.changePic.canBack);
                that.ul.style.left = -picIndex * that.picWrap.offsetWidth + "px";
                for (var i = 0; i < that.ul.childNodes.length; i++) {
                    that.ul.childNodes[i].childNodes[0].style.cssText += prefix+"transform:translate(0px, 0px) scale(1, 1)";
                }
            }
        }

    };

    //图片缩放时调用的方法，更新相关内容
    that.scaleCallback = function (scale) {
        //console.log(scale);
    };

    //图片操作完成后的回调方法
    that.touchendCallback = function (offsetY, offsetX, scale) {
        //console.log(offsetY, offsetX, scale);
    }
};