import { Transformable } from "./Transformable"

export interface ShapeConfig {
  zIndex?: number;
  x?: number;
  y?: number;
  stroke?: boolean;
  fill?: boolean;
  style?: any;
  onClick?: () => void;
  draggable?: boolean;
  rotation?: number;
  translation?: { x: number, y: number };
  [key: string]: any;
}

export abstract class Shape extends Transformable {
  zIndex: number
  x: number
  y: number
  stroke: boolean
  fill: boolean
  style: any
  hash: string
  onTap: () => void
  draggable: boolean

  constructor(config: ShapeConfig) {
    super()
    this.zIndex = config.zIndex ?? 0
    this.x = config.x
    this.y = config.y
    this.stroke = config.stroke
    this.fill = config.fill
    this.style = config.style
    this.hash = null
    this.onTap = config.onClick
    this.draggable = config.draggable
    if (config.rotation) this.rotate(config.rotation)
    if (config.translation) this.translate(config.translation.x, config.translation.y)
  }

  abstract draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    this.draw(ctx)
  }

  drawFunc(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    const mat = this.matrix
    ctx.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5])
    if (this.style) Object.assign(ctx, this.style)
    ctx.beginPath()
    this.draw(ctx)
    if (this.fill) ctx.fill()
    if (this.stroke) ctx.stroke()
    ctx.restore()
  }

  drawOnOffscreen(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    const mat = this.matrix
    ctx.transform(mat[0], mat[1], mat[2], mat[3], mat[4], mat[5])
    ctx.fillStyle = this.hash
    ctx.strokeStyle = this.hash
    ctx.beginPath()
    this.drawHit(ctx)
    if (this.fill) ctx.fill()
    if (this.stroke) ctx.stroke()
    ctx.restore()
  }
}