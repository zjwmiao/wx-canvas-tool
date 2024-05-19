import { Shape, ShapeConfig } from "./Shape";

const R = Math.PI / 180

interface EllipseConfig extends ShapeConfig {
  radiusX: number;
  radiusY: number;
  /** 起始角度，以角度为单位，默认0 */
  startAngle?: number
  /** 终止角度，以角度为单位，默认360 */
  endAngle?: number
  /** 是否逆时针 */
  anticlockwise?: boolean
}

export class Ellipse extends Shape {
  radiusX: number
  radiusY: number
  startAngle: number
  endAngle: number
  anticlockwise: boolean

  constructor(config: EllipseConfig) {
    super(config)
    this.radiusX = config.radiusX
    this.radiusY = config.radiusY
    this.startAngle = typeof config.startAngle === "number" ? config.startAngle * R : 0
    this.endAngle = typeof config.endAngle === "number" ? config.endAngle * R : Math.PI * 2
    this.anticlockwise = config.anticlockwise ?? false
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, this.startAngle, this.endAngle, this.anticlockwise)
  }
}