import { Shape, ShapeConfig } from "./Shape"

const R = Math.PI / 180

interface CircleConfig extends ShapeConfig {
  /** 半径 */
  radius: number
  /** 起始角度，以角度为单位，默认0 */
  startAngle?: number
  /** 终止角度，以角度为单位，默认360 */
  endAngle?: number
  /** 是否逆时针 */
  anticlockwise?: boolean
}

export class Circle extends Shape {
  radius: number
  startAngle: number
  endAngle: number
  anticlockwise: boolean

  constructor(config: CircleConfig) {
    super(config)
    this.radius = config.radius
    this.startAngle = typeof config.startAngle === "number" ? config.startAngle * R : 0
    this.endAngle = typeof config.endAngle === "number" ? config.endAngle * R : Math.PI * 2
    this.anticlockwise = config.anticlockwise ?? false
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.arc(0, 0, this.radius, this.startAngle, this.endAngle, this.anticlockwise)
  }
}