import { Shape, ShapeConfig } from "./Shape";

interface EllipseConfig extends ShapeConfig {
  radiusX: number;
  radiusY: number;
  startAngle: number;
  endAngle: number;
  anticlockwise: boolean;
}

export class Ellipse extends Shape {
  radiusX: number
  radiusY: number
  startAngle?: number
  endAngle?: number
  anticlockwise?: boolean

  constructor(config: EllipseConfig) {
    super(config)
    this.radiusX = config.radiusX
    this.radiusY = config.radiusY
    this.startAngle = config.startAngle ?? 0
    this.endAngle = config.endAngle ?? 2 * Math.PI
    this.anticlockwise = config.anticlockwise ?? false
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, this.startAngle, this.endAngle, this.anticlockwise)
  }
}