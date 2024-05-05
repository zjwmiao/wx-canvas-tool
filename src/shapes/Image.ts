import { Rect, RectConfig } from "./Rect"

interface ImgConfig extends RectConfig {
  src: string
}

export class Image extends Rect {
  loaded: boolean
  failed: boolean
  img: WechatMiniprogram.Image
  loadPromise: Promise<void>
  
  constructor(config: ImgConfig, canvas: WechatMiniprogram.Canvas) {
    super(config)
    this.width = config.width
    this.height = config.height
    this.loaded = false
    this.failed = false
    this.img = canvas.createImage()
    this.img.src = config.src
    this.loadPromise = new Promise(resolve => {
      try {
        this.img.onload = resolve
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
    ctx.drawImage(this.img, 0, 0, this.width, this.height)
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.fillRect(0, 0, this.width, this.height)
  }
}