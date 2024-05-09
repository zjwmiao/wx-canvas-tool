# wx-canvas-tool

# 目前仅供自用 功能、文档仍在改进完善

适用于微信小程序的canvas绘制工具库

## 实现的功能

- 内置自定义图形

    - Rect 矩形

    - Circle 圆形

    - Line 线

    - Image 图片

    - Text 文本

- 手指拖拽移动画布、图形

- 图形点击事件

- 双指缩放画布

## 示例

### 基本使用(uniapp)

```html
<canvas id="canvas" type="2d" style="width: 100%; height: 100%"></canvas>

<script>
  const { CanvasTool, Rect } = require('wx-canvas-tool');
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
          }));
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
  const { CanvasTool, Rect } = require('wx-canvas-tool');
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
            onTap: () => console.log('tap!!'),
          }));
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
