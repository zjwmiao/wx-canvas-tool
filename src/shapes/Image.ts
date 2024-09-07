import { Rect, RectConfig } from "./Rect"

interface ImgConfig extends RectConfig {
  src: string
  sourceX: number
  sourceY: number
  sourceHeight: number
  sourceWidth: number
}

export class Image extends Rect {
  private displayWidth: number
  private displayHeight: number
  loaded: boolean
  failed: boolean
  img: WechatMiniprogram.Image
  sourceX: number
  sourceY: number
  sourceHeight: number
  sourceWidth: number
  loadPromise: Promise<void>

  constructor(config: ImgConfig, canvas: WechatMiniprogram.Canvas) {
    super(config)
    this.sourceX = config.sourceX
    this.sourceY = config.sourceY
    this.sourceHeight = config.sourceHeight
    this.sourceWidth = config.sourceWidth
    if (config.width && config.height) {
      this.displayWidth = config.width
      this.displayHeight = config.height
    }
    this.loaded = false
    this.failed = false
    this.img = canvas.createImage()
    this.img.src = config.src
    this.loadPromise = new Promise(resolve => {
      try {
        this.img.onload = () => {
          this.displayWidth ??= this.img.width
          this.displayHeight ??= this.img.height
          resolve()
        }
        this.img.onerror = error => {
          this.failed = true
          console.log(`failed to load image, ${config.src}`, error)
          resolve()
        }
      } catch (error) {
        this.failed = true
        console.log(`failed to load image, ${config.src}`, error)
        resolve()
      } finally {
        this.loaded = true
      }
    })
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    if (!this.loaded || this.failed) {
      return
    }
    if (this.width && this.height) {
      if (this.sourceX && this.sourceY && this.sourceHeight && this.sourceWidth) {
        ctx.drawImage(this.img, this.sourceX, this.sourceY, this.sourceHeight, this.sourceWidth, 0, 0, this.width, this.height)
        return
      }
      ctx.drawImage(this.img, 0, 0, this.width, this.height)
      return
    }
    ctx.drawImage(this.img, 0, 0)
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.fillRect(0, 0, this.displayWidth, this.displayHeight) 
  }
}