const R = Math.PI / 180

export class Matrix {
  private _a: number = 1 // 0
  private _b: number = 0 // 1
  private _c: number = 0 // 2
  private _d: number = 1 // 3
  e: number = 0 // 4
  f: number = 0 // 5

  get a() {
    return this._a
  }

  set a(val: number) {
    this._a = val
    this._scaleCache.scaleX = null
  }

  get c() {
    return this._c
  }

  set c(val: number) {
    this._c = val
    this._scaleCache.scaleX = null
  }

  get b() {
    return this._b
  }

  set b(val: number) {
    this._b = val
    this._scaleCache.scaleY = null
  }

  get d() {
    return this._d
  }

  set d(val: number) {
    this._d = val
    this._scaleCache.scaleY = null
  }

  static translate(out: Matrix, original: Matrix, x: number, y: number) {
    out.a = original.a
    out.b = original.b
    out.c = original.c
    out.d = original.d
    out.e = original.a * x + original.c * y + original.e
    out.f = original.b * x + original.d * y + original.f
  }

  static scale(out: Matrix, original: Matrix, x: number, y: number) {
    out.a = original.a * x
    out.b = original.b * x
    out.c = original.c * y
    out.d = original.d * y
    out.e = original.e
    out.f = original.f
  }

  static rotate(out: Matrix, original: Matrix, angle: number) {
    const r = angle * R
    const cos = Math.cos(r), sin = Math.sin(r)
    const a = original.a, b = original.b, c = original.c, d = original.d
    out.a = a * cos + c * sin
    out.b = b * cos + d * sin
    out.c = a * -sin + c * cos
    out.d = b * -sin + d * cos
    out.e = original.e
    out.f = original.f
  }

  static multiply(out: Matrix, left: Matrix, right: Matrix) {
    out.a = left.a * right.a + left.c * right.b
    out.b = left.b * right.a + left.d * right.b
    out.c = left.a * right.c + left.c * right.d
    out.d = left.b * right.c + left.d * right.d
    out.e = left.a * right.e + left.c * right.f + left.e
    out.f = left.b * right.e + left.d * right.f + left.f
  }

  constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number) {
    if (arguments.length === 6) this.setTransform(a, b, c, d, e, f)
  }

  translate(x: number, y: number) {
    this.e = this.a * x + this.c * y + this.e
    this.f = this.b * x + this.d * y + this.f
    return this
  }

  scale(x: number, y: number) {
    this.a *= x
    this.b *= x
    this.c *= y
    this.d *= y
    return this
  }

  rotateDegrees(degree: number) {
    return this.rotateRadians(degree * R)
  }

  rotateRadians(radians: number) {
    const cos = Math.cos(radians), sin = Math.sin(radians)
    const a = this.a, b = this.b, c = this.c, d = this.d
    this.a = a * cos + c * sin
    this.b = b * cos + d * sin
    this.c = a * -sin + c * cos
    this.d = b * -sin + d * cos
    return this
  }

  getTranslateX() {
    return this.e
  }

  getTranslateY() {
    return this.f
  }

  private _scaleCache = {
    scaleX: null as number | null,
    scaleY: null as number | null,
  }

  getScaleX() {
    return (this._scaleCache.scaleX ??= Math.sign(this.a) * Math.sqrt(Math.pow(this.a, 2) + Math.pow(this.c, 2)))
  }

  getScaleY() {
    return (this._scaleCache.scaleY ??= Math.sign(this.d) * Math.sqrt(Math.pow(this.b, 2) + Math.pow(this.d, 2)))
  }

  getRotation(degree = false) {
    if (this.a !== 0) {
      return degree ? Math.atan2(- this.c, this.a) / R : Math.atan2(- this.c, this.a)
    } else if (this.d !== 0) {
      return degree ? Math.atan2(this.b, this.d) / R : Math.atan2(this.b, this.d)
    }
  }

  /**
   * ctx.setTransform(a, b, c, d, e, f)
   * @param ctx CanvasRenderingContext2D
   */
  setToCtx(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.setTransform(this.a, this.b, this.c, this.d, this.e, this.f)
  }

  /**
   * ctx.transform(a, b, c, d, e, f)
   * @param ctx CanvasRenderingContext2D
   */
  applyToCtx(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    ctx.transform(this.a, this.b, this.c, this.d, this.e, this.f)
  }

  /**
   * 当前矩阵在左，点乘m
   * @param m Matrix
   * @returns this
   */
  multiply(m: Matrix) {
    const a = this.a,
          b = this.b,
          c = this.c,
          d = this.d,
          e = this.e,
          f = this.f
    this.a = a * m.a + c * m.b
    this.b = b * m.a + d * m.b
    this.c = a * m.c + c * m.d
    this.d = b * m.c + d * m.d
    this.e = a * m.e + c * m.f + e
    this.f = b * m.e + d * m.f + f
    return this
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.e = e
    this.f = f
    return this
  }

  /**
   * 重置为单位阵
   * @returns this
   */
  reset() {
    return this.setTransform(1, 0, 0, 1, 0, 0)
  }

  /**
   * 求逆矩阵
   * @returns 新Matrix实例
   */
  invert() {
    const a = this.a,
          b = this.b,
          c = this.c,
          d = this.d,
          e = this.e,
          f = this.f
    let det = a * d - b * c
    if (det === 0) return
    det = 1.0 / det
    return new Matrix(
      d * det, -b * det,
      -c * det, a * det,
      (c * f - d * e) * det, (b * e - a * f) * det
    )
  }
}