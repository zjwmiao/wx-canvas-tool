import { Shape, ShapeConfig } from "./Shape"

export interface RectConfig extends ShapeConfig {
  width: number;
  height: number;
  borderRadius?: number | number[];
}

export class Rect extends Shape {
  width: number
  height: number
  private _borderRadius: number[]
  
  constructor(config: RectConfig) {
    super(config)
    this.width = config.width
    this.height = config.height
    const br = config.borderRadius
    if (Array.isArray(br) && br.length === 4) {
      this._borderRadius = br
    } else if (typeof br === 'number') {
      this._borderRadius = [br, br, br, br]
    }
  }

  set borderRadius(br: number | number[]) {
    if (Array.isArray(br) && br.length === 4) {
      this._borderRadius = br
    } else if (typeof br === 'number') {
      this._borderRadius = [br, br, br, br]
    } else {
      this._borderRadius = undefined
    }
  }

  get borderRadius() {
    return [...this._borderRadius]
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    if (!this._borderRadius) 
      ctx.rect(0, 0, this.width, this.height)
    else {
      const {
        width,
        height,
        _borderRadius: br
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
}