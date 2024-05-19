import { Shape } from "./Shape"

export interface LineConfig {
  points: number[];
  /** 虚线设置，同CanvasRenderingContext2D.setLineDash */
  dash?: number[];
  /** 颜色 */
  color?: string;
  /** 线宽 */
  width?: number;
}

export class Line extends Shape {
  points: number[]
  color: string
  dash: number[]
  width: number

  constructor(config: LineConfig) {
    super(config)
    const points = [...config.points]
    this.color = config.color
    this.dash = config.dash
    this.width = config.width || 1
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
    if (this.dash) ctx.setLineDash(this.dash)
    if (this.width) ctx.lineWidth = this.width
    ctx.moveTo(this.points[0], this.points[1])
    const len = this.points.length
    for (let i = 2; i < len; i += 2) {
      ctx.lineTo(this.points[i], this.points[i + 1])
    }
    ctx.stroke()
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    this.draw(ctx)
  }

  /**
   * @param points 在线段尾部追加点，延长线段
   */
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