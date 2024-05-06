import { Shape, ShapeConfig } from "./Shape"

interface PathConfig extends ShapeConfig {
  pathFunc: (path: WechatMiniprogram.Path2D) => void
}

export class Path extends Shape {
  path: WechatMiniprogram.Path2D

  constructor(config: PathConfig, canvas: WechatMiniprogram.Canvas) {
    super(config)
    this.path = canvas.createPath2D()
    config.pathFunc(this.path)
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    if (this.fill) {
      ctx.fill(this.path)
    }
    if (this.stroke) {
      ctx.stroke(this.path)
    }
  }

  /* drawFunc(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.beginPath()
    if (this.style) {
      ctx.save()
      Object.assign(ctx, this.style)
    }
    this.draw(ctx)
    ctx.restore()
  }

  drawOnOffscreen(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.save()
    ctx.fillStyle = this.hash
    ctx.strokeStyle = this.hash
    ctx.beginPath()
    this.drawHit(ctx)
    ctx.restore()
  } */
}