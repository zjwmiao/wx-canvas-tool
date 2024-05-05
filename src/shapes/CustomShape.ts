import { Shape, ShapeConfig } from "./Shape"

export class CustomShape extends Shape {
  config: any
  private _draw: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, config: ShapeConfig) => void
  private _hit: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, config: ShapeConfig) => void

  constructor(
    config: ShapeConfig,
    draw: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, config: ShapeConfig) => void,
    hitDetectionFunc: (ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, config: ShapeConfig) => void
  ) {
    super(config)
    this.config = config
    this._draw = draw
    this._hit = hitDetectionFunc
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void {
    this._draw(ctx, this.config)
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void {
    (this._hit ?? this._draw)(ctx, this.config)
  }
}