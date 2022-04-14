import { Point } from './point.js';
import { Quadrilateral } from './quadrilateral.js';

export class Rectangle extends Quadrilateral {
  constructor(topLeft, bottomRight) {
    super([
      topLeft,
      new Point(bottomRight.x, topLeft.y),
      bottomRight,
      new Point(topLeft.x, bottomRight.y)
    ]);
  }

  get width() {
    return this.topRight.x - this.topLeft.x;
  }

  get height() {
    return this.bottomLeft.y - this.topLeft.y;
  }
  
  /** Expand the rectangle in each direction. 0.1 means by 10%. */
  expand(factor) {
    return new Rectangle(
      new Point(this.topLeft.x - this.width * factor, this.topLeft.y - this.height * factor),
      new Point(this.bottomRight.x + this.width * factor, this.bottomRight.y + this.height * factor)
    );
  }

  /** Returns the smallest rectangle parallel to the canvas boundary that fully contains this Quadrilateral. */
  static fromQuadrilaterial(quadrilateral) {
    let minX = Math.min(quadrilateral.topLeft.x, quadrilateral.bottomLeft.x);
    let maxX = Math.max(quadrilateral.topRight.x, quadrilateral.bottomRight.x);
    let minY = Math.min(quadrilateral.topLeft.y, quadrilateral.topRight.y);
    let maxY = Math.min(quadrilateral.bottomLeft.y, quadrilateral.bottomRight.y);
    return new Rectangle(
      new Point(minX, minY),
      new Point(maxX, maxY),
    );
  }
}
