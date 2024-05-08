import { mat2d } from "gl-matrix"

const DEG = Math.PI / 180

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

export abstract class Shape {
  zIndex: number
  x: number
  y: number
  stroke: boolean
  fill: boolean
  style: any
  hash: string
  onTap: () => void
  draggable: boolean
  protected transformation = mat2d.create()

  constructor(config: ShapeConfig) {
    this.zIndex = config.zIndex ?? 0
    this.x = config.x
    this.y = config.y
    this.stroke = config.stroke
    this.fill = config.fill
    this.style = config.style
    this.hash = null
    this.onTap = config.onClick
    this.draggable = config.draggable
    if (config.rotation) mat2d.rotate(this.transformation, this.transformation, config.rotation * DEG)
    if (config.translation) {
      this.transformation[4] += config.translation.x
      this.transformation[5] += config.translation.y
    }
  }

  rotate(deg: number) {
    mat2d.rotate(this.transformation, this.transformation, deg * DEG)
  }

  translate(xOffset: number, yOffset: number) {
    this.transformation[4] += xOffset
    this.transformation[5] += yOffset
  }

  setTranslation(xOffset: number, yOffset: number) {
    this.transformation[4] += xOffset
    this.transformation[5] += yOffset
  }

  scale(x: number, y: number) {
    this.transformation[0] *= x
    this.transformation[3] *= y
  }

  setScale(x: number, y: number) {
    this.transformation[0] = x
    this.transformation[3] = y
  }

  abstract draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D): void

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    this.draw(ctx)
  }

  drawFunc(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    const tr = this.transformation
    ctx.transform(tr[0], tr[1], tr[2], tr[3], 0, 0)
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
    const tr = this.transformation
    ctx.transform(tr[0], tr[1], tr[2], tr[3], 0, 0)
    ctx.fillStyle = this.hash
    ctx.strokeStyle = this.hash
    ctx.beginPath()
    this.drawHit(ctx)
    if (this.fill) ctx.fill()
    if (this.stroke) ctx.stroke()
    ctx.restore()
  }
}