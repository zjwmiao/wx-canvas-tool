import { Line, LineConfig } from "./Line"
import { Matrix } from "../Matrix"

interface ArrowConfig extends LineConfig {
  /** 绘制线段尾部箭头，默认true */
  tail?: boolean
  /** 线段尾部箭头宽度，默认10 */
  arrowWidth?: number
  /** 线段尾部箭头高度，默认20 */
  arrowHeight?: number
  /** 绘制线段尾部箭头，默认false */
  head?: boolean
  /** 线段头部箭头宽度，默认10 */
  headArrowWidth?: number
  /** 线段头部箭头高度，默认20 */
  headArrowHeight?: number
}

export class ArrowLine extends Line {
  private _arrowWidth: number
  private _arrowHeight: number
  private halfArrowWidth: number
  private _headArrowWidth: number
  private _headArrowHeight: number
  private halfHeadArrowWidth: number
  private tailTransformMat: Matrix
  private headTransformMat: Matrix
  tail: boolean
  head: boolean

  constructor(config: ArrowConfig) {
    super(config)
    this.tail = config.tail ?? true
    this.head = config.head ?? false
    const points = this.points

    this._arrowWidth = config.arrowWidth ?? 10
    this._arrowHeight = config.arrowHeight ?? 20
    this.halfArrowWidth = this._arrowWidth / 2

    this._headArrowWidth = config.headArrowWidth ?? 10
    this._headArrowHeight = config.headArrowHeight ?? 20
    this.halfHeadArrowWidth = this._headArrowWidth / 2
    if (this.tail) {
      const len = points.length
      const endPointerRotateAngle = Math.atan2(points[len - 1] - points[len - 3], points[len - 2] - points[len - 4])
      this.tailTransformMat = new Matrix().translate(points[len - 2], points[len - 1])
        .rotateRadians(endPointerRotateAngle)
    }
    if (this.head) {
      const headPointerRotateAngle = Math.atan2(points[1] - points[3], points[0] - points[2])
      this.headTransformMat = new Matrix().translate(points[0], points[1])
        .rotateRadians(headPointerRotateAngle)
    }
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    super.draw(ctx)
    if (this.color) ctx.fillStyle = this.color
    if (this.head) {
      ctx.save()
      this.headTransformMat.applyToCtx(ctx)
      this.drawTriangle(ctx, this.halfHeadArrowWidth, this._headArrowHeight)
      ctx.restore()
    }
    if (this.tail) {
      this.tailTransformMat.applyToCtx(ctx)
      this.drawTriangle(ctx, this.halfArrowWidth, this._arrowHeight)
    }
  }

  /**
   * @param points 在线段尾部追加点，延长线段
   */
  append(points: number[]): void {
    super.append(points)
    const _points = this.points, len = _points.length
    const endPointerRotateAngle = Math.atan2(_points[len - 1] - _points[len - 3], _points[len - 2] - _points[len - 4])
    this.tailTransformMat.reset().translate(_points[len - 2], _points[len - 1])
      .rotateRadians(endPointerRotateAngle)
  }

  set arrowWidth(value: number) {
    this._arrowWidth = value
    this.halfArrowWidth = value / 2
  }

  set arrowHeigth(value: number) {
    this._arrowHeight = value
  }

  set headArrowWidth(value: number) {
    this._headArrowWidth = value
    this.halfHeadArrowWidth = value / 2
  }

  set headArrowHeight(value: number) {
    this._headArrowHeight = value
  }

  get arrowWidth() {
    return this._arrowWidth
  }

  get arrowHeight() {
    return this._arrowHeight
  }

  get headArrowWidth() {
    return this._headArrowWidth
  }

  get headArrowHeight() {
    return this._headArrowHeight
  }

  private drawTriangle(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, halfArrowWidth: number, arrowHeight: number) {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(- arrowHeight, - halfArrowWidth)
    ctx.lineTo(- arrowHeight, halfArrowWidth)
    ctx.closePath()
    ctx.fill()
  }
}