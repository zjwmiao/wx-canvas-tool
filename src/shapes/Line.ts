import { Shape, ShapeConfig } from "./Shape"

interface LineConfig extends ShapeConfig {
  points: number[]
}

export class Line extends Shape {
  points: number[]

  constructor(config: LineConfig) {
    super(config)
    this.points = config.points
    this.stroke = true
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.moveTo(this.points[0], this.points[1])
    const len = this.points.length
    for (let i = 2; i < len; i += 2) {
      ctx.lineTo(this.points[i], this.points[i + 1])
    }
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.moveTo(this.points[0], this.points[1])
    const len = this.points.length
    for (let i = 2; i < len; i += 2) {
      ctx.lineTo(this.points[i], this.points[i + 1])
    }
    ctx.stroke()
  }
}