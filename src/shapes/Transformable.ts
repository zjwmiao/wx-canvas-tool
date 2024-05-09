import { mat2d } from "gl-matrix"

const DEG = Math.PI / 180

export abstract class Transformable {
  matrix: mat2d = mat2d.create()

  translate(x?: number, y?: number): void {
    mat2d.translate(this.matrix, this.matrix, [x, y])
  }

  rotate(angle: number): void {
    mat2d.rotate(this.matrix, this.matrix, angle * DEG)
  }

  scale(x: number, y: number): void {
    mat2d.scale(this.matrix, this.matrix, [x, y])
  }

  setTranslate(x: number, y: number): void {
    this.matrix[4] = x
    this.matrix[5] = y
  }

  setScale(x: number, y: number): void {
    this.matrix[0] = x
    this.matrix[3] = y
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    mat2d.set(this.matrix, a, b, c, d, e, f)
  }

  resetTransform(): void {
    mat2d.identity(this.matrix)
  }
}