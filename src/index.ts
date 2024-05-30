import { Shape } from './shapes/Shape'
import { Image } from './shapes/Image'
import { Circle } from './shapes/Circle'
import { Rect } from './shapes/Rect'
import { Text } from './shapes/Text'
import { Line } from './shapes/Line'
import { Path } from './shapes/Path'
import { Transformable } from './shapes/Transformable'
import { Ellipse } from './shapes/Ellipse'
import { CustomShape } from './shapes/Custom'
import { ArrowLine } from './shapes/ArrowLine'

type Point = {
  x: number
  y: number
}

function *rgbGenerator() {
  for (let r = 0; r <= 255; r++) {
    for (let g = 0; g <= 255; g++) {
      for (let b = 1; b <= 255; b++) {
        yield `rgb(${r},${g},${b})`
      }
    }
  }
}

/**
 * 用SelectorQuery获取节点信息
 * @param pageInstance 页面实例
 * @param id canvas id
 * @returns 节点信息
 */
function getNodeInfo(pageInstance: any, id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      wx.createSelectorQuery()
        .in(pageInstance)
        .select(id.startsWith('#') ? id : `#${id}`)
        .fields({ node: true, size: true, rect: true }, info => {
          resolve(info)
        }).exec()
    } catch (error) {
      reject(error)
    }
  })
}

class Animation {
  private animId: number
  private wrapFunc: () => void
  private executor: (callback: (...args: any[]) => any) => number
  private stopFunc: (id: number) => void

  constructor(func: () => void, executor: (callback: (...args: any[]) => any) => number, stopFunc: (id: number) => void) {
    this.executor = executor
    this.stopFunc = stopFunc
    this.wrapFunc = () => {
      func()
      this.animId = this.executor(this.wrapFunc)
    }
  }

  start() {
    this.animId = this.executor(this.wrapFunc)
  }

  stop() {
    this.stopFunc(this.animId)
  }
}

type GlobalConfig = {
  /**
   * 画布的id
   */
  id: string
  /**
   * 页面实例
   */
  pageInstance: any
  /**
   * 初始化完成后的回调函数
   */
  afterInit?: () => void
  /**
   * 可拖动
   */
  draggable?: boolean
  /**
   * 可缩放
   */
  zoomable?: boolean
  globalStyles?: { [key: string]: string }
}

class CanvasTool extends Transformable {
  initiated = false
  id: string
  draggable: boolean
  zoomable: boolean
  width: number
  height: number
  canvas: WechatMiniprogram.Canvas
  ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D/* RenderingContext */
  shapes: Shape[] = []
  private pageInstance: any
  private prevFingerX: number = null
  private prevFingerY: number = null
  private draggingAnimationId: number = null
  private zoomCenter: Point = null
  private lastDiff: number = null
  private rgb: Generator
  private dpr: number
  private draggingShape: Shape
  private animExecutorFunc: (callback: (...args: any[]) => any) => number
  private animStopFunc: (id: number) => void
  private frame = () => {
    this.update()
    this.draggingAnimationId = null
  }
  private offscreen: WechatMiniprogram.OffscreenCanvas
  private shapeMap = new Map<string, Shape>()
  private offscreenCtx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D
  private imgsLoadPromises: Promise<any>[] = []

  constructor(config: GlobalConfig) {
    super()
    this.pageInstance = config.pageInstance
    this.id = config.id
    this.rgb = rgbGenerator()
    this.draggable = config.draggable ?? false
    this.zoomable = config.zoomable ?? false
    getNodeInfo(this.pageInstance, this.id).then(nodeInfo => {
      const { node, width, height } = nodeInfo
      this.canvas = node
      this.animExecutorFunc = this.canvas.requestAnimationFrame.bind(this.canvas)
      this.animStopFunc = this.canvas.cancelAnimationFrame.bind(this.canvas)
      this.ctx = this.canvas.getContext('2d')
      if (config.globalStyles) Object.assign(this.ctx, config.globalStyles)
      const dpr = wx.getWindowInfo().pixelRatio
      this.canvas.width = width * dpr
      this.canvas.height = height * dpr
      this.width = width
      this.height = height
      this.dpr = dpr
      this.scale(dpr, dpr)
      this.offscreen = wx.createOffscreenCanvas({
        type: '2d',
        width: this.canvas.width,
        height: this.canvas.height
      })
      this.offscreenCtx = this.offscreen.getContext('2d')
      this.offscreenCtx.scale(dpr, dpr)
      this.initiated = true
      if (config.afterInit) config.afterInit()
    }).catch(e => {
      console.log('init failed', e)
    })
  }

  async getBoudingClientRect() {
    const { left, top, right, bottom, width, height } = await getNodeInfo(this.pageInstance, this.id)
    return { left, top, right, bottom, width, height }
  }

  /**
   * 清除画布并绘制所有图形
   */
  update() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.matrix.setToCtx(this.ctx)
    this.ctx.beginPath()
    for (const shape of this.shapes) {
      shape.drawFunc(this.ctx, this.matrix)
    }
  }

  /**
   * 绘制所有图形，会先清空画布，与update()的区别是会等待所有图片加载完成
   */
  async draw() {
    if (this.imgsLoadPromises.length) {
      await Promise.all(this.imgsLoadPromises)
      this.imgsLoadPromises = []
    }
    this.shapes.sort((a, b) => b.zIndex - a.zIndex)
    this.update()
  }

  addShape(shape: Shape) {
    shape.hash = this.rgb.next().value
    this.shapeMap.set(shape.hash, shape)
    this.shapes.push(shape)
    if (shape instanceof Image) {
      this.imgsLoadPromises.push(shape.loadPromise)
    }
  }

  /**
   * 清空内部图形实例队列，这个方法不会清空画布
   */
  clearShapes() {
    this.shapes = []
    this.shapeMap.clear()
    this.rgb = rgbGenerator()
  }

  resetTransform(): void {
    this.matrix.reset().scale(this.dpr, this.dpr)
  }

  /**
   * 计算文本高度宽度
   * @param text 文本，可以传入Text实例或者字符串
   * @param font 字体，如'12px sans-serif'，若第一个参数传入Text实例且font未指定，则使用其font属性
   * @returns 
   */
  calcText(text: string | Text, font?: string) {
    this.ctx.save()
    let _text: string
    if (text instanceof Text) {
      _text = text.text
      font ??= text.font
    }
    if (typeof text === 'string') {
      _text = text
    }
    this.ctx.font = font
    const {
      width,
      actualBoundingBoxAscent,
      actualBoundingBoxDescent,
      actualBoundingBoxLeft,
      actualBoundingBoxRight,
    } = this.ctx.measureText(_text)
    this.ctx.restore()
    return {
      width,
      actualWidth: actualBoundingBoxLeft + actualBoundingBoxRight,
      height: actualBoundingBoxAscent + actualBoundingBoxDescent
    }
  }

  onTouchmove(event: WechatMiniprogram.TouchEvent) {
    const touches = event.touches
    if (touches.length === 1) {
      const mX = touches[0].clientX
      const mY = touches[0].clientY
      if (this.prevFingerX === null || this.prevFingerY === null) {
        this.prevFingerX = mX
        this.prevFingerY = mY
        return
      }
      const xOffset = (mX - this.prevFingerX) * this.dpr / this.getScaleX(),
            yOffset = (mY - this.prevFingerY) * this.dpr / this.getScaleY()
      if (this.draggingShape) {
        this.draggingShape.x += xOffset
        this.draggingShape.y += yOffset
      } else if (this.draggable) {
        this.translate(xOffset, yOffset)
      }
      this.prevFingerX = mX
      this.prevFingerY = mY
      if (this.draggingAnimationId) this.animStopFunc(this.draggingAnimationId)
      this.draggingAnimationId = this.animExecutorFunc(this.frame)
    } else if (touches.length === 2) {
      if (!this.zoomCenter) return
      const diff = Math.abs(touches[0].clientX - touches[1].clientX) + Math.abs(touches[0].clientY - touches[1].clientY)
      if (!this.lastDiff) {
        this.lastDiff = diff
        return
      }
      const step = diff / this.lastDiff
      this.scaleAt(step, step, this.zoomCenter.x, this.zoomCenter.y)
      this.lastDiff = diff
      if (this.draggingAnimationId) this.animStopFunc(this.draggingAnimationId)
      this.draggingAnimationId = this.animExecutorFunc(this.frame)
    }
  }

  /**
   * 开始一个动画
   * @param frame 帧回调
   * @returns 简单封装的动画实例
   */
  anim(frame: () => void) {
    return new Animation(
      () => {
        frame()
        this.update()
      },
      this.animExecutorFunc,
      this.animStopFunc
    )
  }

  async onTouchstart(event: WechatMiniprogram.TouchEvent) {
    this.drawOffscreen()
    const touches = event.touches
    if (touches.length === 1) {
      const shape = await this.getTouchPointShape(touches[0].clientX, touches[0].clientY)
      if (shape && shape.draggable) {
        this.draggingShape = shape
      }
    } else if (touches.length === 2 && this.zoomable) {
      this.zoomCenter = await this.getPositionOnCanvasCoordinate((touches[0].clientX + touches[1].clientX) / 2, (touches[0].clientY + touches[1].clientY) / 2)
    }
  }

  onTouchend() {
    this.prevFingerX = null
    this.prevFingerY = null
    this.lastDiff = null
    this.zoomCenter = null
    this.draggingShape = null
  }

  onTouchcancel() {
    this.prevFingerX = null
    this.prevFingerY = null
    this.lastDiff = null
    this.zoomCenter = null
    this.draggingShape = null
  }

  async onTap(event: WechatMiniprogram.TouchEvent) {
    this.drawOffscreen()
    const touch = event.touches[0]
    const shape = await this.getTouchPointShape(touch.clientX, touch.clientY)
    if (shape && shape.onTap) shape.onTap()
  }

  /**
   * 用页面上的位置坐标求出画布坐标系上的对应的坐标
   * @param x X坐标
   * @param y Y坐标
   * @returns 手指触摸的位置对应的画布坐标系上的坐标
   */
  async getPositionOnCanvasCoordinate(x: number, y: number) {
    const { left, top } = await this.getBoudingClientRect()
    x = (x - left) * this.dpr
    y = (y - top) * this.dpr
    const inverted = this.matrix.invert()
    return {
      x: x * inverted.a + y * inverted.c + inverted.e,
      y: x * inverted.b + y * inverted.d + inverted.f
    }
  }

  /**
   * 手指触摸位置的图形
   * @param x touch的X坐标
   * @param y touch的Y坐标
   * @returns 
   */
  private async getTouchPointShape(x: number, y: number) {
    const { left, top } = await this.getBoudingClientRect()
    x = (x - left) * this.dpr
    y = (y - top) * this.dpr
    const [r, g, b] = this.offscreenCtx.getImageData(x, y, 1, 1).data
    const hash = `rgb(${r},${g},${b})`
    return this.shapeMap.get(hash)
  }

  private drawOffscreen() {
    this.offscreenCtx.setTransform(1, 0, 0, 1, 0, 0)
    this.offscreenCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.matrix.setToCtx(this.offscreenCtx)
    this.offscreenCtx.beginPath()
    for (const shape of this.shapes) {
      shape.drawOnOffscreen(this.offscreenCtx, this.matrix)
    }
  }
}

export {
  CanvasTool,
  Point,
  Image,
  Circle,
  Rect,
  Text,
  Line,
  Path,
  Ellipse,
  CustomShape,
  ArrowLine,
}