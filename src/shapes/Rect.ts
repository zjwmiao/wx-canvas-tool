import { Shape, ShapeConfig } from "./Shape"

export interface RectConfig extends ShapeConfig {
  width: number;
  height: number;
}

export class Rect extends Shape {
  width: number
  height: number
  
  constructor(config: RectConfig) {
    super(config)
    this.width = config.width
    this.height = config.height
  }
  
  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.rect(this.transformation[4], this.transformation[5], this.width, this.height)
  }
}