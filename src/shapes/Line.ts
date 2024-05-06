import { Shape, ShapeConfig } from "./Shape"

interface LineConfig extends ShapeConfig {
  points: number[]
}

export class Line extends Shape {
  points: number[]

  constructor(config: LineConfig) {
    super(config)
    const points = config.points
    if (points.length < 2 || points.length % 2 !== 0) {
      throw new Error('点的个数需为2的倍数')
    }
    this.x = points[0]
    this.y = points[1]
    for (let i = 0; i < points.length; i += 2) {
      points[i] -= this.x
      points[i + 1] -= this.y
    }
    this.points = points
    this.stroke = true
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.moveTo(this.points[0], this.points[1])
    const len = this.points.length
    for (let i = 2; i < len; i += 2) {
      ctx.lineTo(this.points[i], this.points[i + 1])
    }
  }

  append(points: number[]) {
    if (points.length < 2 || points.length % 2 !== 0) {
      console.warn('点的个数需为2的倍数')
      return
    }
    for (let i = 0; i < points.length; i += 2) {
      points[i] -= this.x
      points[i + 1] -= this.y
    }
    this.points = this.points.concat(points)
  }
}