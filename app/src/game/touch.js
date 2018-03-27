
import Point from './model/point';
class Touch {

    // 回调首页
    callbackIndex;

    socket;

    touchId = 0;

    isStarted = false;

    /* 鼠标坐标转换为canvas坐标 */
    windowToCanvas (x, y) {
        var bbox = this.canvas.getBoundingClientRect();
        return {
            x: x - bbox.left * (this.canvas.width / bbox.width),
            y: y - bbox.top * (this.canvas.height / bbox.height)
        };
    }

    // line:[{x:0,y:0,id:1,color:'',border:''},{}]

    constructor(canvas, callback) {
        this.canvas = canvas;
        this.callbackIndex = callback;
        this.canvas.addEventListener('touchstart', (event) => {
            this.handleStart(event);
        })

        this.canvas.addEventListener('touchmove', event => {
            this.handleMove(event);
        })
        this.canvas.addEventListener('touchend', evnet => {
            this.handleEnd(event);
        })

        this.canvas.addEventListener('mousedown', (event) => {
            this.handleStart(event, true);
        });

        this.canvas.addEventListener('mousemove', (event) => {
            this.handleMove(event, true);
        });

        this.canvas.addEventListener('mouseup', evnet => {
            this.handleEnd(event, true);
        })
    }

    line;

    handleStart (e, isPC) {
        var x, y;

        if (isPC) {
            x = e.pageX;
            y = e.pageY;
            this.isStarted = true;
        } else if (e.targetTouches.length === 1) {
            // 如果这个元素的位置内只有一个手指的话
            e.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = e.targetTouches[0];
            // 把元素放在手指所在的位置
            x = touch.pageX;
            y = touch.pageY;
            this.touchId++;

            console.log('@@##touchstart screen:' + touch.screenX + ' ' + touch.screenY);
            console.log('@@##touchstart client:' + touch.clientX + ' ' + touch.clientY);
            console.log('@@##touchstart page:' + touch.pageX + ' ' + touch.pageY);
        }

        // 逻辑不应该放在这里
        // this.line = new Line(this.touchId);
        let point = new Point(
            this.touchId,
            'draw',
            'start',
            parseInt(x),
            parseInt(y)
        );
        // this.line.addPoint(point);

        // this.callbackIndex && this.callbackIndex(this.line);
        this.callbackIndex && this.callbackIndex(point)

        // console.log("@@##move !!"+e.pageX+" "+e.pageY);
        // socket.emit('draw', {
        //     type: 'start',
        //     x: parseInt(x),
        //     y: parseInt(y)
        // });
    }

    handleMove (e, isPC) {
        var x, y;
        if (isPC) {
            x = e.pageX;
            y = e.pageY;
            if (!this.isStarted) {
                return;
            }
        } else if (e.targetTouches.length === 1) {
            e.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = e.targetTouches[0];
            // 把元素放在手指所在的位置
            x = touch.pageX;
            y = touch.pageY;
        }

        let point = new Point(
            this.touchId,
            'draw',
            'move',
            parseInt(x),
            parseInt(y)
        );
        this.callbackIndex && this.callbackIndex(point);

        // console.log("@@##move !!"+e.pageX+" "+e.pageY);
        // socket.emit('draw', {
        //     type: 'move',
        //     x: parseInt(x),
        //     y: parseInt(y)
        // });
    }

    handleEnd (e, isPC) {
        var x, y;

        if (isPC) {
            x = e.pageX;
            y = e.pageY;
            if (this.isStarted) {
                this.isStarted = false;
            }
        } else if (e.targetTouches.length === 1) {
            e.preventDefault(); // 阻止浏览器默认事件，重要
            var touch = e.targetTouches[0];
            // 把元素放在手指所在的位置
            x = touch.pageX;
            y = touch.pageY;
        }
        console.log('@@##end !!' + x + ' ' + y);
        let point = new Point(
            this.touchId,
            'draw',
            'end',
            parseInt(x),
            parseInt(y)
        );

        this.callbackIndex && this.callbackIndex(point);

        // socket.emit('draw', {
        //     type: 'end',
        //     x: parseInt(x),
        //     y: parseInt(y)
        // });
    }

    sendMessage (eventName, data) {
        this.socket.emit(eventName, JSON.stringify(data), result => {
            console.log('@@##sendMessage@');
        })
    }
}

export default Touch;
