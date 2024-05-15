import { mat2d, vec2 } from "gl-matrix"

const DEG = Math.PI / 180

export abstract class Transformable {
  matrix: mat2d = mat2d.create()
  protected vec2 = vec2.create()

  translate(x: number, y: number) {
    mat2d.translate(this.matrix, this.matrix, vec2.set(this.vec2, x, y))
  }

  getTranslateX() {
    return this.matrix[4]
  }

  getTranslateY() {
    return this.matrix[5]
  }

  rotate(angle: number): void {
    mat2d.rotate(this.matrix, this.matrix, angle * DEG)
  }

  getRotation(degree = false) {
    const a = this.matrix[0],
          b = this.matrix[1],
          c = this.matrix[2],
          d = this.matrix[3]
    if (a !== 0) {
      return degree ? Math.atan2(- c, a) / DEG : Math.atan2(- c, a)
    } else if (d !== 0) {
      return degree ? Math.atan2(b, d) / DEG : Math.atan2(b, d)
    }
  }

  scale(x: number, y: number) {
    mat2d.scale(this.matrix, this.matrix, vec2.set(this.vec2, x, y))
  }

  getScaleX() {
    const a = this.matrix[0], c = this.matrix[2]
    return Math.sign(a) * Math.sqrt(Math.pow(a, 2) + Math.pow(c, 2))
  }

  getScaleY() {
    const b = this.matrix[1], d = this.matrix[3]
    return Math.sign(d) * Math.sqrt(Math.pow(b, 2) + Math.pow(d, 2))
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    mat2d.set(this.matrix, a, b, c, d, e, f)
  }

  resetTransform(): void {
    mat2d.identity(this.matrix)
  }
}