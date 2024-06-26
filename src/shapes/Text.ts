import { Rect, RectConfig } from "./Rect"
import { Shape, ShapeConfig } from "./Shape";

type Baseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom"
type Align = "left" | "right" | "center" | "start" | "end"
interface TextConfig extends ShapeConfig {
  text: string;
  /** 基线 */
  baseline: Baseline;
  /** 对齐 */
  align: Align;
  /** 最大宽度 */
  maxWidth: number;
  /** 超出最大宽度后替换的字符 */
  overflow: string;
  /** 字体 */
  font: string;
  /** 颜色 */
  color: string;
  /** 描边宽度 */
  strokeWidth: number;
}

export class Text extends Shape {
  private _text: string
  private _baseline: Baseline
  private _align: Align
  private _maxWidth: number
  private _overflow: string
  private _font: string
  private needCalc: boolean = true
  private displayText: string
  strokeWidth: number;
  color: string
  width: number
  height: number
  actualWidth: number
  left: number
  top: number

  constructor(config: TextConfig) {
    super(config)
    this._text = config.text
    this._baseline = config.baseline
    this._align = config.align
    this._maxWidth = config.maxWidth
    this._overflow = config.overflow ?? ''
    this._font = config.font
    this.displayText = config.text
    this.color = config.color
    this.strokeWidth = config.strokeWidth
  }

  set baseline(val: Baseline) {
    this._baseline = val
    this.needCalc = true
  }

  get baseline() {
    return this._baseline
  }

  set align(val: Align) {
    this._align = val
    this.needCalc = true
  }

  get align() {
    return this._align
  }

  set maxWidth(val: number) {
    this._maxWidth = val
    this.needCalc = true
  }

  get maxWidth() {
    return this._maxWidth
  }

  set overflow(val: string) {
    this._overflow = val
    this.needCalc = true
  }

  get overfow() {
    return this._overflow
  }

  set text(val: string) {
    this.displayText = this._text = val
    this.needCalc = true
  }

  get text() {
    return this._text
  }

  set font(val: string) {
    this._font = val
    this.needCalc = true
  }

  get font() {
    return this._font
  }

  calc(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    const {
      width,
      actualBoundingBoxRight,
      actualBoundingBoxLeft,
      fontBoundingBoxAscent,
      fontBoundingBoxDescent
    } = ctx.measureText(this._text)
    this.width = width
    this.actualWidth = actualBoundingBoxRight + actualBoundingBoxLeft
    this.height = fontBoundingBoxAscent + fontBoundingBoxDescent
    this.left = this.x - actualBoundingBoxLeft
    this.top = this.y - fontBoundingBoxAscent
    if (this._maxWidth > 0) {
      if (this.actualWidth > this._maxWidth) {
        let minLen = 0, maxLen = this._text.length
        let res: string
        while (minLen <= maxLen) {
          const mid = Math.floor((minLen + maxLen) / 2)
          const substring = this._text.substring(0, mid) + this._overflow
          const currentWidth = ctx.measureText(substring).width
          if (currentWidth <= this._maxWidth) {
            res = substring
            minLen = mid + 1
          } else if (currentWidth > this._maxWidth) {
            maxLen = mid - 1
          }
        }
        this.displayText = res
      }
    }
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    if (this._align) ctx.textAlign = this._align
    if (this._baseline) ctx.textBaseline = this._baseline
    if (this._font) ctx.font = this._font
    if (this.needCalc) {
      this.calc(ctx)
      this.needCalc = false
    }
    if (this.fill) {
      if (this.color) ctx.fillStyle = this.color
      ctx.fillText(this.displayText, 0, 0)
    }
    if (this.stroke) {
      if (this.color) ctx.strokeStyle = this.color
      if (this.strokeWidth) ctx.lineWidth = this.strokeWidth
      ctx.strokeText(this.displayText, 0, 0)
    }
  }

  drawHit(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.fillRect(0, 0, this.actualWidth, this.height)
  }
}