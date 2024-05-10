# wx-canvas-tool

适用于微信小程序canvas（2d）的**简单**绘制工具库

功能还很简单，后续有时间再慢慢完善

## 实现的功能

- 内置自定义图形

    - Rect 矩形

    - Circle 圆形

    - Line 线

    - Image 图片

    - Text 文本

    - Path 路径

    - ~~自定义图形~~

- 手指拖拽移动画布、图形

- 图形点击事件

- 双指缩放画布

- 画布及图形均支持旋转（scale）、平移（translate）、缩放（scale）变换

## 示例(uniapp写法)

### 基本使用

```html
<canvas id="canvas" type="2d" style="width: 100%; height: 100%"></canvas>

<script>
  import { CanvasTool, Rect } from 'wx-canvas-tool';
  let tool;

  export default {
    data() {
      return {
        canvasReady: false,
      }
    },
    onReady() {
      tool = new CanvasTool({
        id: 'canvas', // canvas的id
        pageInstance: this, // 页面实例
        afterInit: () => this.canvasReady = true // 初始化成功回调
      });
    },
    watch: {
      canvasReady(val) {
        if (val) {
          tool.addShape(new Rect({
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            style: {
              fillStyle: 'blue',
              strokeStyle: 'black',
            },
            fill: true,
            stroke: true,
          }));
          // 首次需调用draw才会实际绘制所有图形，此外draw方法也可以清除画布再重新绘制所有图形
          tool.draw();
        }
      }
    }
  }
</script>
```

## 开启拖拽/缩放

```html
<canvas 
  id="canvas" 
  type="2d" 
  @touchstart="onTouchstart"
  @touchmove="onTouchmove"
  @touchend="onTouchend"
  @touchcanel="onTouchcancel"
  style="width: 100%; height: 100%">
</canvas>

<script>
  import { CanvasTool, Rect } from 'wx-canvas-tool';
  let tool;

  export default {
    data() {
      return {
        canvasReady: false,
      }
    },
    onReady() {
      tool = new CanvasTool({
        id: 'canvas',
        pageInstance: this,
        draggable: true,
        zoomable: true,
        afterInit: () => this.canvasReady = true
      });
    },
    watch: {
      canvasReady(val) {
        if (val) {
          tool.addShape(new Rect({
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            style: {
              fillStyle: 'blue',
              strokeStyle: 'black',
            },
            fill: true,
            stroke: true,
          }));
          tool.draw();
        }
      }
    },
    methods: {
      // 若要使触摸生效，需要将触摸事件都与实例绑定
      onTouchstart(e) {
        tool.onTouchstart(e);
      },
      onTouchmove(e) {
        tool.onTouchmove(e);
      },
      onTouchend() {
        tool.onTouchend();
      },
      onTouchcancel() {
        tool.onTouchcancel();
      },
    }
  }
</script>
```

# 图形点击事件

```html
<canvas 
  id="canvas" 
  type="2d" 
  @tap="onTap"
  style="width: 100%; height: 100%">
</canvas>

<script>
  import { CanvasTool, Rect } from 'wx-canvas-tool';
  let tool;

  export default {
    data() {
      return {
        canvasReady: false,
      }
    },
    onReady() {
      tool = new CanvasTool({
        id: 'canvas',
        pageInstance: this,
        afterInit: () => this.canvasReady = true
      });
    },
    watch: {
      canvasReady(val) {
        if (val) {
          tool.addShape(new Rect({
            x: 100,
            y: 100,
            width: 100,
            height: 100,
            style: {
              fillStyle: 'blue',
              strokeStyle: 'black',
            },
            fill: true,
            stroke: true,
            // 目前只支持tap（点击）事件
            onTap: () => console.log('rect clicked'),
          }));
          tool.draw();
        }
      }
    },
    methods: {
      // 若要使点击事件生效，需要将点击事件与实例绑定
      onTap(e) {
        tool.onTap(e);
      }
    }
  }
</script>
```

# 图形

## Rect 矩形

```javascript
import { Rect } from 'wx-canvas-tool';

const rect = new Rect({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  style: { // style属性可以传所有html5 CanvasRenderingContext2D的style属性
    fillStyle: 'blue',
    strokeStyle: 'black',
  },
  fill: true, // 描边
  stroke: true, // 填充
  borderRadius: 20, // 圆角，也可以传数组[20, 20, 20, 20]
  rotation: 45, // 旋转角度，其他所有图形也都支持构造时传入
  translation: { // 平移，其他所有图形也都支持构造时传入
    x: 10,
    y: 10,
  },
});
```

## Circle 圆形

```javascript
import { Circle } from 'wx-canvas-tool';

const circle = new Circle({
  x: 100,
  y: 100,
  radius: 50, // 半径
  style: {
    fillStyle: 'blue',
    strokeStyle: 'black',
  },
  fill: true, // 描边
  stroke: true, // 填充
  translation: { // 平移
    x: 10,
    y: 10,
  },
});
```

## Line 线

```javascript
import { Line } from 'wx-canvas-tool';

const line = new Line({
  points: [
    5, 70, // x, y
    140, 23, // x, y
    250, 60,
    300, 20
    // ...
  ],
  style: {
    strokeStyle: 'black',
    lineWidth: 2,
  }
});

// 实例方法，追加点
line.append([100, 100]);
```

## Image 图片

```javascript
import { CanvasTool, Image } from 'wx-canvas-tool';

export default {
  data() {
    return {
      canvasReady: false,
    }
  },
  onReady() {
    tool = new CanvasTool({
      id: 'canvas',
      pageInstance: this,
      afterInit: () => this.canvasReady = true
    });
  },
  watch: {
    canvasReady(val) {
      if (val) {
        tool.addShape(new Image({
          src: 'https://example.com/image.png',
          x: 100, // 同drawImage(image, dx, dy)的dx
          y: 100, // 同drawImage(image, dx, dy)的dy
          width: 100, // 同drawImage(image, dx, dy, dWidth, dHeight)的dWidth
          height: 100, // 同drawImage(image, dx, dy, dWidth, dHeight)的dHeight
          sourceX: 0, // 同drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)的sx
          sourceY: 0, // 同drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)的sy
          sourceWidth: 100, // 同drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)的sWidth
          sourceHeight: 100, // 同drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)的sHeight
        }, tool.canvas /* 需传Canvas实例 */));
        // draw()方法会等待所有add进去的图片加载完成才开始绘制图形
        tool.draw();
      }
    }
  }
}
```

## Text 文本

```javascript
import { Text } from 'wx-canvas-tool';

const text = new Text({
  x: 100,
  y: 100,
  text: 'Hello World',
  baseline: 'top', // 基线位置，同CanvasRenderingContext2D的textBaseline属性
  align: 'center', // 对齐方式，同CanvasRenderingContext2D的textAlign属性
  font: '20px Arial', // 字体
  color: 'green' // 颜色
  strokeWidth: 2, // 描边线宽度
  maxWdith: 200, // 最大宽度
  overflow: '...', // 自定义超出maxWdith部分替换的字符
  fill: true, // 调用fillText绘制文本
  /* stroke: true, // 调用strokeText绘制文本 */
});
```

## Path 路径

目前暂不支持传入svg path

```javascript
import { Path } from 'wx-canvas-tool';

const path = new Path({
  x: 100,
  y: 100,
  pathFunc: path => {
    path.moveTo(5, 70);
    path.lineTo(140, 23);
    // ...
  },
  style: {
    strokeStyle: 'black',
  },
  stroke: true,
})
```