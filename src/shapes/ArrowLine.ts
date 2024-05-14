import { mat2d } from "gl-matrix"
import { Line, LineConfig } from "./Line"

interface ArrowConfig extends LineConfig {
  arrowWidth?: number
  arrowHeight?: number
}

export class ArrowLine extends Line {
  private endRotateAngle: number
  private _arrowWidth: number
  private _arrowHeight: number
  private halfArrowWidth: number
  private endX: number
  private endY: number

  constructor(config: ArrowConfig) {
    super(config)
    const points = config.points
    const len = points.length
    this.endX = points[len - 2]
    this.endY = points[len - 1]
    this.endRotateAngle = Math.atan2(points[len - 1] - points[len - 3], points[len - 2] - points[len - 4])
    this._arrowWidth = 10
    this._arrowHeight = 20
    this.halfArrowWidth = this._arrowHeight / 2
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    if (this.color) ctx.fillStyle = this.color
    super.draw(ctx)
    ctx.translate(this.endX, this.endY)
    ctx.rotate(this.endRotateAngle)
    ctx.translate(- this._arrowHeight, 0)
    this.drawTriangle(ctx)
  }

  set arrowWidth(value: number) {
    this._arrowWidth = value
    this.halfArrowWidth = this._arrowHeight / 2
  }

  set arrowHeigth(value: number) {
    this._arrowHeight = value
    this.halfArrowWidth = this._arrowHeight / 2
  }

  get arrowWidth() {
    return this._arrowWidth
  }

  get arrowHeight() {
    return this._arrowHeight
  }

  private drawTriangle(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.moveTo(0, this.halfArrowWidth)
    ctx.lineTo(this._arrowHeight, 0)
    ctx.lineTo(0, - this.halfArrowWidth)
    ctx.closePath()
    ctx.fill()
  }
}