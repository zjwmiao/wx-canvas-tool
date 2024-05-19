import { Transformable } from "./Transformable"
import { Matrix } from "../Matrix";

export interface ShapeConfig {
  // zIndex?: number;
  /**
   * 图形绘制原点的x坐标
   */
  x?: number;
  /**
   * 图形绘制原点的y坐标
   */
  y?: number;
  /**
   * 调用CanvasRenderingContext2D的stroke方法绘制图形的边框
   */
  stroke?: boolean;
  /**
   * 调用CanvasRenderingContext2D的fill方法填充图形的内部
   */
  fill?: boolean;
  /**
   * 设置绘制该图形的CanvasRenderingContext2D样式
   */
  style?: any;
  onTap?: () => void;
  /**
   * 开启拖拽
   */
  draggable?: boolean;
  /**
   * 图形旋转角度，以角度为单位
   */
  rotation?: number;
  /**
   * 图形平移距离
   */
  translation?: { x: number, y: number };
  /**
   * 图形缩放比例
   */
  scale?: { x: number, y: number };
  [key: string]: any;
}

export abstract class Shape extends Transformable {
  // zIndex: number
  x: number
  y: number
  stroke: boolean
  fill: boolean
  style: any
  hash: string
  onTap: () => void
  draggable: boolean
  private innerTransform: Matrix = new Matrix()

  constructor(config: ShapeConfig) {
    super()
    // this.zIndex = config.zIndex ?? 0
    this.x = config.x ?? 0
    this.y = config.y ?? 0
    this.stroke = config.stroke
    this.fill = config.fill
    this.style = config.style
    this.onTap = config.onTap
    this.draggable = config.draggable
    if (config.rotation) this.rotate(config.rotation)
    if (config.translation) this.translate(config.translation.x, config.translation.y)
    if (config.scale) this.scale(config.scale.x, config.scale.y)
  }

  abstract draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    this.draw(ctx)
    ctx.fill()
  }

  /**
   * 由外部调用，绘制图形
   * @param ctx CanvasRenderingContext2D
   * @param globalTransform 画布的全局变换矩阵
   */
  drawFunc(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, globalTransform: Matrix) {
    ctx.save()
    Matrix.translate(this.innerTransform, globalTransform, this.x, this.y)
    this.innerTransform.multiply(this.matrix).setToCtx(ctx)
    if (this.style) Object.assign(ctx, this.style)
    ctx.beginPath()
    this.draw(ctx)
    if (this.fill) ctx.fill()
    if (this.stroke) ctx.stroke()
    ctx.restore()
  }

  /**
   * 由外部调用，绘制图形的hit区域
   * @param ctx CanvasRenderingContext2D
   * @param globalTransform 画布的全局变换矩阵
   */
  drawOnOffscreen(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, globalTransform: Matrix) {
    ctx.save()
    Matrix.translate(this.innerTransform, globalTransform, this.x, this.y)
    this.innerTransform.multiply(this.matrix).setToCtx(ctx)
    ctx.fillStyle = this.hash
    ctx.strokeStyle = this.hash
    ctx.beginPath()
    this.drawHit(ctx)
    ctx.restore()
  }
}