import { Matrix } from "../Matrix"

export abstract class Transformable {
  matrix: Matrix = new Matrix()

  /**
   * @param x 水平方向平移
   * @param y 垂直方向平移
   */
  translate(x: number, y: number) {
    this.matrix.translate(x, y)
  }

  /**
   * 获取水平方向平移
   * @returns number
   */
  getTranslateX() {
    return this.matrix.getTranslateX()
  }

  /**
   * 获取垂直方向平移
   * @returns number
   */
  getTranslateY() {
    return this.matrix.getTranslateY()
  }

  /**
   * 旋转
   * @param degree 角度
   */
  rotate(degree: number): void {
    this.matrix.rotateDegrees(degree)
  }

  /**
   * 围绕指定点旋转
   * @param degree 角度
   * @param pivotX 围绕点x坐标
   * @param pivotY 围绕点y坐标
   */
  rotateAt(degree: number, pivotX: number, pivotY: number): void {
    this.matrix.translate(pivotX, pivotY).rotateDegrees(degree).translate(-pivotX, -pivotY)
  }

  /**
   * 获取当前旋转角度/弧度
   * @param degree 为true时返回角度值，不传或为false时返回弧度值
   * @returns number
   */
  getRotation(degree = false) {
    return this.matrix.getRotation(degree)
  }

  /**
   * 叠加缩放
   * @param x 水平缩放
   * @param y 垂直缩放
   */
  scale(x: number, y: number) {
    this.matrix.scale(x, y)
  }

  /**
   * 围绕指定点缩放
   * @param scaleX 水平缩放
   * @param scaleY 垂直缩放
   * @param pivotX 围绕点x坐标
   * @param pivotY 围绕点y坐标
   */
  scaleAt(scaleX: number, scaleY: number, pivotX: number, pivotY: number) {
    this.matrix.translate(pivotX, pivotY).scale(scaleX, scaleY).translate(-pivotX, -pivotY)
  }

  getScaleX() {
    return this.matrix.getScaleX()
  }

  getScaleY() {
    return this.matrix.getScaleY()
  }

  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.matrix.setTransform(a, b, c, d, e, f)
  }

  /**
   * 重置变换
   */
  resetTransform(): void {
    this.matrix.reset()
  }
}