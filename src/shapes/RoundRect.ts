import { Rect, RectConfig } from "./Rect"

interface RoundRectConfig extends RectConfig {
  borderRadius: number | number[]
}

export class RoundRect extends Rect {
  borderRadius: number | number[]

  constructor(config: RoundRectConfig) {
    super(config)
    this.borderRadius = [0, 0, 0, 0]
    if (typeof config.borderRadius === 'number') {
      this.borderRadius.fill(config.borderRadius)
    } else if (Array.isArray(config.borderRadius) && config.borderRadius.length === 4) {
      this.borderRadius = config.borderRadius
    }
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    let {
      width,
      height,
      borderRadius: br
    } = this
    ctx.moveTo(0 + br[0], 0)
    ctx.lineTo(width - br[1], 0)
    ctx.arcTo(width, 0, width, 0 + br[1], br[1])
    ctx.lineTo(width, height - br[2])
    ctx.arcTo(width, height, width - br[2], height, br[2])
    ctx.lineTo(0 + br[3], height)
    ctx.arcTo(0, height, 0, height - br[3], br[3])
    ctx.lineTo(0, 0 + br[0])
    ctx.arcTo(0, 0, 0 + br[0], 0, br[0])
    ctx.closePath()
  }
}