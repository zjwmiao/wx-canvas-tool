import { Shape, ShapeConfig } from "./Shape"

interface PathConfig extends ShapeConfig {
  /**
   * @param path Path2D对象
   */
  pathFunc?: (path: WechatMiniprogram.Path2D) => void,
  /**
   * svg路径字符串
   */
  path?: string
}

const R = Math.PI / 180

const douPI = 2 * Math.PI

const pow2 = (n: number) => Math.pow(n, 2)

const regex = /\s{0,},{1}\s{0,}|\s+|(?<=[a-zA-Z]).*?(?=-{0,1}\d)|(?<=\d)(?=-)|(?<=\d)(?=[a-zA-Z]{1})/

/**
 * 
 * @param x1 起点x坐标
 * @param y1 起点y坐标
 * @param rx x轴半径
 * @param ry y轴半径
 * @param r 旋转角度
 * @param fa 大弧/小弧
 * @param fs 逆时针/顺时针
 * @param x2 终点x坐标
 * @param y2 终点y坐标
 * @returns 
 */
function svgArcToCanvasArc(x1: number, y1: number, rx: number, ry: number, r: number, fa: number, fs: number, x2: number, y2: number) {
  if (rx === 0 || ry === 0) throw new Error('rx = 0 or ry = 0')
  rx = Math.abs(rx)
  ry = Math.abs(ry)
  const radian = r * R, 
        cos = Math.cos(radian),
        sin = Math.sin(radian)
  let a = (x1 - x2) / 2, b = (y1 - y2) / 2
  const x1_ = cos * a + sin * b, y1_ = cos * b - sin * a
  const p = pow2(x1_) / pow2(rx) + pow2(y1_) / pow2(ry)
  if (p > 1) {
    const p_sq = Math.sqrt(p)
    rx *= p_sq
    ry *= p_sq
  }
  const rxry = rx * ry,
        rxy1_ = rx * y1_,
        ryx1_ = ry * x1_,
        rxryP2 = pow2(rxry),
        rxy1_P2 = pow2(rxy1_),
        ryx1_P2 = pow2(ryx1_)
  const sq = Math.sqrt(Math.abs((rxryP2 - rxy1_P2 - ryx1_P2) / (rxy1_P2 + ryx1_P2)))
  const cx_ = sq * rxy1_ / ry * (fa === fs ? - 1 : 1),
        cy_ = - sq * ryx1_ / rx * (fa === fs ? - 1 : 1),
        cx = cos * cx_ - sin * cx_ + (x1 + x2) / 2,
        cy = sin * cx_ + cos * cy_ + (y1 + y2) / 2
  function getAngle(ux: number, uy: number, vx: number, vy: number) {
    const mod = Math.sqrt((pow2(ux) + pow2(uy)) * (pow2(vx) + pow2(vy)))
    const sign = Math.sign(ux * vy - uy * vx)
    return sign * Math.acos((ux * vx + uy * vy) / mod)
  }
  a = (x1_ - cx_) / rx
  b = (y1_ - cy_) / ry
  let theta1 = getAngle(1.0, 0, a, b),
      thetaDelta = getAngle(a, b, (- x1_ - cx_) / rx, (- y1_ - cy_) / ry) % douPI
  if (fs === 0 && thetaDelta > 0) thetaDelta -= douPI
  else if (fs === 1 && thetaDelta < 0) thetaDelta += douPI
  return [
    cx,
    cy,
    rx,
    ry,
    r,
    theta1, // startAngle
    theta1 + thetaDelta, // endEngle
    fs <= 0 // anticlockwise
  ]
}

function PathParser(path: WechatMiniprogram.Path2D) {
  this.x = 0
  this.y = 0
  this.cpx_c = 0
  this.cpy_c = 0
  this.cpx_q = 0
  this.cpy_q = 0
  this.path = path
  this.lastCommand = null

  this.m = function(index: number, arr: string[]) {
    const x = Number(arr[++index]), y = Number(arr[++index])
    if (Number.isNaN(x) || Number.isNaN(y)) throw new Error('illegal arguments')
    this.x = x
    this.y = y
    this.lastCommand = 'm'
    this.path.moveTo(this.x, this.y)
    return ++index
  }

  this.l = function(index: number, arr: string[]) {
    const x = Number(arr[++index]), y = Number(arr[++index])
    if (Number.isNaN(x) || Number.isNaN(y)) throw new Error('illegal arguments')
    this.x = x
    this.y = y
    this.lastCommand = 'l'
    this.path.lineTo(this.x, this.y)
    return ++index
  }

  this.h = function(index: number, arr: string[]) {
    const x = Number(arr[++index])
    if (Number.isNaN(x)) throw new Error('illegal arguments')
    this.x = x
    this.lastCommand = 'h'
    this.path.lineTo(this.x, this.y)
    return ++index
  }

  this.v = function(index: number, arr: string[]) {
    const y = Number(arr[++index])
    if (Number.isNaN(y)) throw new Error('illegal arguments')
    this.y += y
    this.lastCommand = 'v'
    this.path.lineTo(this.x, this.y)
    return ++index
  }

  this.z = function(index) {
    this.lastCommand = 'z'
    this.path.closePath()
    return ++index
  }

  this.c = function(index: number, arr: string[]) {
    const x1 = Number(arr[++index]),
          y1 = Number(arr[++index]),
          x2 = Number(arr[++index]),
          y2 = Number(arr[++index]),
          x = Number(arr[++index]),
          y = Number(arr[++index])
    if (Number.isNaN(x1) ||
        Number.isNaN(y1) ||
        Number.isNaN(x2) ||
        Number.isNaN(y2) ||
        Number.isNaN(x) ||
        Number.isNaN(y)) throw new Error('illegal arguments')
    this.x = x
    this.y = y
    this.cpx_c = x2
    this.cpy_c = y2
    this.lastCommand = 'c'
    this.path.bezierCurveTo(x1, y1, x2, y2, x, y)
    return ++index
  }

  this.q = function(index: number, arr: string[]) {
    const cpx = Number(arr[++index]),
          cpy = Number(arr[++index]),
          x = Number(arr[++index]),
          y = Number(arr[++index])
    if (Number.isNaN(x) ||
        Number.isNaN(y) ||
        Number.isNaN(x) ||
        Number.isNaN(y)) throw new Error('illegal arguments')
    this.x = x
    this.y = y
    this.cpx_q = cpx
    this.cpy_q = cpy
    this.lastCommand = 'q'
    this.path.quadraticCurveTo(cpx, cpy, x, y)
    return ++index
  }

  this.s = function(index: number, arr: string[]) {
    let cpx1,
        cpy1,
        cpx2 = Number(arr[++index]),
        cpy2 = Number(arr[++index]),
        x = Number(arr[++index]),
        y = Number(arr[++index])
    if (Number.isNaN(cpx2) || Number.isNaN(cpy2)) throw new Error('illegal arguments')
    if (this.lastCommand === 'c' || this.lastCommand === 's') {
      cpx1 = this.x * 2 - this.cpx_c
      cpy1 = this.y * 2 - this.cpy_c
    } else {
      cpx1 = this.x
      cpy1 = this.y
    }
    this.x = x
    this.y = y
    this.cpx_c = cpx2
    this.cpy_c = cpy2
    this.path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y)
    return ++index
  }

  this.t = function(index: number, arr: string[]) {
    let x = Number(arr[++index]), y = Number(arr[++index])
    if (Number.isNaN(x) || Number.isNaN(y)) throw new Error('illegal arguments')
    let cpx, cpy
    if (this.lastCommand === 'q' || this.lastCommand === 't') {
      cpx = this.x * 2 - this.cpx_q
      cpy = this.y * 2 - this.cpy_q
    } else {
      cpx = x
      cpy = y
    }
    this.x = x
    this.y = y
    this.cpx_q = cpx
    this.cpy_q = cpy
    this.path.quadraticCurveTo(cpx, cpy, x, y)
  }

  this.a = function(index: number, arr: string[]) {
    const rx = Number(arr[++index]),
          ry = Number(arr[++index]),
          r = Number(arr[++index]),
          fa = Number(arr[++index]),
          fs = Number(arr[++index]),
          x2 = Number(arr[++index]),
          y2 = Number(arr[++index])
    this.path.ellipse(...svgArcToCanvasArc(this.x, this.y, rx, ry, r, fa, fs, x2, y2))
    this.x = x2
    this.y = y2
    return ++index
  }

  this.M = this.m.bind(this)
  this.L = this.l.bind(this)
  this.H = this.h.bind(this)
  this.V = this.v.bind(this)
  this.Z = this.z.bind(this)
  this.C = this.c.bind(this)
  this.Q = this.q.bind(this)
  this.S = this.s.bind(this)
  this.T = this.t.bind(this)
  this.A = this.a.bind(this)
}

export class Path extends Shape {
  path: WechatMiniprogram.Path2D

  constructor(config: PathConfig, canvas: WechatMiniprogram.Canvas) {
    super(config)
    this.path = canvas.createPath2D()
    if (config.path) {
      const split = config.path.split(regex)
      const parser = new PathParser(this.path)
      for (let i = 0; i < split.length; ) {
        if (split[i] in parser)
          i = parser[split[i]](i, split)
        else throw new Error('Illegal paths command')
      }
    }
    if (config.pathFunc)
      config.pathFunc(this.path)
  }

  draw(ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D) {
    if (this.fill) {
      ctx.fill(this.path)
    }
    if (this.stroke) {
      ctx.stroke(this.path)
    }
  }
}