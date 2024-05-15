import { mat2d, vec2 } from "gl-matrix";
import { Transformable } from "./Transformable"

export interface ShapeConfig {
  zIndex?: number;
  x?: number;
  y?: number;
  stroke?: boolean;
  fill?: boolean;
  style?: any;
  onTap?: () => void;
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
  private innerTransform: mat2d = mat2d.create()

  constructor(config: ShapeConfig) {
    super()
    this.zIndex = config.zIndex ?? 0
    this.x = config.x
    this.y = config.y
    this.stroke = config.stroke
    this.fill = config.fill
    this.style = config.style
    this.onTap = config.onTap
    this.draggable = config.draggable
    if (config.rotation) this.rotate(config.rotation)
    if (config.translation) this.translate(config.translation.x, config.translation.y)
  }

  abstract draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    this.draw(ctx)
    ctx.fill()
  }

  drawFunc(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, globalTransform: mat2d) {
    ctx.save()
    mat2d.translate(this.innerTransform, globalTransform, vec2.set(this.vec2, this.x, this.y))
    mat2d.multiply(this.innerTransform, this.innerTransform, this.matrix)
    this.applyCurrentTransform(ctx)
    if (this.style) Object.assign(ctx, this.style)
    ctx.beginPath()
    this.draw(ctx)
    if (this.fill) ctx.fill()
    if (this.stroke) ctx.stroke()
    ctx.restore()
  }

  drawOnOffscreen(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D, globalTransform: mat2d) {
    ctx.save()
    mat2d.translate(this.innerTransform, globalTransform, vec2.set(this.vec2, this.x, this.y))
    mat2d.multiply(this.innerTransform, this.innerTransform, this.matrix)
    this.applyCurrentTransform(ctx)
    ctx.fillStyle = this.hash
    ctx.strokeStyle = this.hash
    ctx.beginPath()
    this.drawHit(ctx)
    ctx.restore()
  }
  
  applyCurrentTransform(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    const tr = this.innerTransform
    ctx.setTransform(tr[0], tr[1], tr[2], tr[3], tr[4], tr[5])
  }
}