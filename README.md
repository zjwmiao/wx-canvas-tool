# wx-canvas-tool

适用于微信小程序canvas（2d）的**简单**绘制工具库

功能还很简单，后续有时间再慢慢完善

## 实现的功能

- 内置自定义图形

    - Rect 矩形

    - Circle 圆形

    - Line 线

    - ArrowLine 箭头线

    - Image 图片

    - Text 文本

    - Path 路径

    - 自定义图形

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
        draggable: true, // 开启拖拽
        zoomable: true, // 开启缩放
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
  x: 100, // 圆心x
  y: 100, // 圆心y
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
  color: 'green' // 颜色
  dash: [5, 5], // 虚线，会调用CanvasRenderingContext2D的setLineDash()
});

// 实例方法，追加点
line.append([100, 100]);
```

## ArrowLine 带箭头的线

```javascript
import { ArrowLine } from 'wx-canvas-tool'

const arr = new ArrowLine({
  points: [
    20, 20,
    80, 80
  ],
  tail: true, // 是否在线段末端处绘制箭头，默认true
  arrowHeight: 30, // 线段末端箭头等腰三角形高，默认20
  arrowWidth: 10, // 线段末端箭头等腰三角形宽，默认10
  head: true, // 是否在线段开始处绘制箭头
  headArrowWidth: 10 // 线段开始处箭头等腰三角形宽，默认20，仅head为true时生效
  headArrowHeight: 30 // 线段开始处箭头等腰三角形高，默认10，仅head为true时生效
  color: 'red',
})
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

~~目前暂不~~支持传入svg path

传入svg path字符串：

```javascript
import { Path } from 'wx-canvas-tool';

const path = new Path({
  x: 100,
  y: 100,
  path: 'M 5 70 L 140 23 L 250 60 L 300 20', // svg path字符串
  style: { strokeStyle: 'black' },
  stroke: true,
}, tool.canvas /* 跟Image一样，需传Canvas实例 */);
```

使用回调函数自定义路径：

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
}, tool.canvas /* 跟Image一样，需传Canvas实例 */);
```

## 自定义图形

```javascript
import { CustomShape } from 'wx-canvas-tool'

const custom = new CustomShape({
  x: 60,
  y: 60,
  style: { fillStyle: 'green' },
  fill: true,
  onTap: () => console.log('??')
}, ctx => {
  /* 
    绘制函数，如果不传最后一个该函数的话，则该函数内最好不要设置样式，
    样式统一在构造函数第一个参数的style属性中设置，否则会影响点击检测

    该绘制函数内的画布绘画原点及上面传入的x,y属性
    因此，ctx.rect(0, 0, 80, 80)画出来的矩形实际上在画布中左上角的位置是(60, 60)
  */
  ctx.rect(0, 0, 80, 80)
}, ctx => {
  /* 
    绘制点击检测图形，该函数可不传，默认点击检测区域就是按照上一个函数内定义的绘制命令而绘制
    该函数内最好不要设置样式，否则会影响点击检测
  */
  // ...
})
```

## 椭圆

```javascript
import { Ellipse } from 'wx-canvas-tool'

const ellipse = new Ellipse({
  x: 50,
  y: 50,
  radusX: 80, // x轴半径
  radusY: 50, // y轴半径
  style: { fillStyle: 'blue' },
  fill: true,
})
```

# 属性和方法

## CanvasTool

属性

| 属性 | 类型 | 说明 | 默认值 |
| --- | --- | --- | --- |
| id | string | canvas的id | - |
| pageInstance | object | 页面实例 | - |
| draggable | boolean | 是否开启拖拽 | false |
| zoomable | boolean | 是否开启拖拽 | false |
| width | number | canvas宽度，只读属性，设置该属性无意义 | - |
| height | number | canvas高度，只读属性，设置该属性无意义 | - |
| shapes | array | 图形数组 | [] |
| canvas | object | canvas实例，只读属性，设置该属性无意义 | - |
| ctx | object | canvas的context实例，只读属性，设置该属性无意义 | - |

方法

| 方法 | 说明 |
| --- | --- |
| addShape | 添加图形 |
| clear | 清除画布 |
| draw | 清除画布并重新绘制所有图形，与update方法的区别是会等待所有图片加载完成 |
| update | 清除画布并重新绘制所有图形 |
| clearShapes | 清除图形数组 |
| resetTransform | 重置画布变换 |
| translate | 平移变换 |
| scale | 缩放 |
| scaleAt | 以指定点为中心缩放 |
| rotate | 旋转变换 |
| rotateAt | 以指定点为中心旋转 |
| getTranslateX | 获取x轴平移值 |
| getTranslateY | 获取y轴平移值 |
| getScaleX | 获取x轴缩放 |
| getScaleY | 获取y轴缩放 |
| getRotation | 获取旋转角度 |
| calcText | 计算文本高度宽度 |
| onTouchstart | 手指按下时触发 |
| onTouchmove | 手指移动时触发 |
| onTouchend | 手指抬起时触发 |
| onTouchcancel | 手指离开时触发 |
| onTap | 点击时触发 |
