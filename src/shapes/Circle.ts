import { Shape, ShapeConfig } from "./Shape"

interface CircleConfig extends ShapeConfig {
  radius: number
}

export class Circle extends Shape {
  radius: number

  constructor(config: CircleConfig) {
    super(config)
    this.radius = config.radius
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
  }
}