import { Shape, ShapeConfig } from "./Shape"

interface LineConfig extends ShapeConfig {
  points: number[]
}

export class Line extends Shape {
  points: number[]

  constructor(config: LineConfig) {
    super(config)
    if (config.points.length < 2 || config.points.length % 2 !== 0) {
      throw new Error('点的个数需为2的倍数')
    }
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

  append(points: number[]) {
    if (points.length < 2 || points.length % 2 !== 0) {
      console.warn('append failed')
      return
    }
    this.points = this.points.concat(points)
  }
}