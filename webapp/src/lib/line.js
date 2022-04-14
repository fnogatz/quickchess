import { Point } from './point.js';

// TODO: Rename to Ray
export class Line {
  constructor(pointA, pointB) {
    this.a = pointA;
    this.b = pointB;
  }

  // pointOnLine(0.0) == point A
  // pointOnLine(0.5) == mid-point
  // pointOnLine(1.0) == point B
  // etc.
  pointOnLine(distance) {
    var cx = (this.b.x - this.a.x) * distance;
    var cy = (this.b.y - this.a.y) * distance;
    return new Point(this.a.x + cx, this.a.y + cy);
  }

  /**
   * Returns x, so that the given point is on the line between
   * this.pointOnLine(x) and oppositeLine.pointOnLine(x).
   * If oppositeLine is parallel to this line, then this
   * method is a simple orthogonal projection.
   */
  projectPoint(point, oppositeLine) {
    var t = point.x, u = point.y;
    var a = this.a.x, b = this.b.x, c = oppositeLine.a.x, d = oppositeLine.b.x;
    var e = this.a.y, f = this.b.y, g = oppositeLine.a.y, h = oppositeLine.b.y;
    // Don't ask.
    return (Math.sqrt(
        Math.pow(2*a*g - a*h - a*u - b*g + b*u - 2*c*e + c*f + c*u + d*e - d*u + e*t - f*t - g*t + h*t, 2)
        - 4* (-a*g + a*u + c*e - c*u - e*t + g*t)*(-a*g + a*h + b*g - b*h + c*e - c*f - d*e + d*f))
      - 2*a*g + a*h + a*u + b*g - b*u + 2*c*e - c*f - c*u - d*e + d*u - e*t + f*t + g*t - h*t)
      / (2*(-a*g + a*h + b*g - b*h + c*e - c*f - d*e + d*f));
  }
}
