import { Shape, ShapeConfig } from "./Shape"

export class CustomShape<C extends ShapeConfig> extends Shape {
  config: C
  private _drawFunc: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) => void
  private _hitDetectFunc: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) => void

  constructor(
    config: C,
    drawFunc: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) => void,
    hitDetectFunc?: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) => void
  ) {
    super(config)
    this.config = config
    this._drawFunc = drawFunc
    this._hitDetectFunc = hitDetectFunc
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    this._drawFunc(ctx)
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void {
    (this._hitDetectFunc ?? this._drawFunc)(ctx)
    if (this.fill) ctx.fill()
    if (this.stroke) ctx.stroke()
  }
}