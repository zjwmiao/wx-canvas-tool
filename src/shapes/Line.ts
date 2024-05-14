import { Shape, ShapeConfig } from "./Shape"

export interface LineConfig {
  points: number[];
  color?: string;
}

export class Line extends Shape {
  points: number[]
  color: string

  constructor(config: LineConfig) {
    super(config)
    const points = config.points
    this.color = config.color
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
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    if (this.color) ctx.strokeStyle = this.color
    ctx.moveTo(this.points[0], this.points[1])
    const len = this.points.length
    for (let i = 2; i < len; i += 2) {
      ctx.lineTo(this.points[i], this.points[i + 1])
    }
    ctx.stroke()
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void {
    this.draw(ctx)
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