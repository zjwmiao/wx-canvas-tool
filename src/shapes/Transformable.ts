import { mat2d, vec2 } from "gl-matrix"

const DEG = Math.PI / 180

export abstract class Transformable {
  matrix: mat2d = mat2d.create()
  protected vec2 = vec2.create()

  translate(x: number, y: number) {
    mat2d.translate(this.matrix, this.matrix, vec2.set(this.vec2, x, y))
  }

  setTranslate(x: number, y: number) {
    this.matrix[4] = x
    this.matrix[5] = y
  }

  getTranslate() {
    return {
      x: this.matrix[4],
      y: this.matrix[5],
    }
  }

  rotate(angle: number): void {
    mat2d.rotate(this.matrix, this.matrix, angle * DEG)
  }

  setScale(x: number, y: number): void {
    this.matrix[0] = x
    this.matrix[3] = y
  }

  scale(x: number, y: number) {
    mat2d.scale(this.matrix, this.matrix, vec2.set(this.vec2, x, y))
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    mat2d.set(this.matrix, a, b, c, d, e, f)
  }

  resetTransform(): void {
    mat2d.identity(this.matrix)
  }
}