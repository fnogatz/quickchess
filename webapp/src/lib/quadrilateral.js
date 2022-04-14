import { Line } from './line.js';
import { Point } from './point.js';

export class Quadrilateral {
  constructor(points) {
    this.points = points;
  }

  path(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (var i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
  }

  containsPoint(ctx, point) {
    this.path(ctx);
    return ctx.isPointInPath(point.x, point.y);
  }

  stroke(ctx) {
    this.path(ctx);
    ctx.stroke();
  }

  get topLeft() { return this.points[0]; }
  get topRight() { return this.points[1]; }
  get bottomRight() { return this.points[2]; }
  get bottomLeft() { return this.points[3]; }

  get leftBorder() { return new Line(this.topLeft, this.bottomLeft); }
  get rightBorder() { return new Line(this.topRight, this.bottomRight); }
  get topBorder() { return new Line(this.topLeft, this.topRight); }
  get bottomBorder() { return new Line(this.bottomLeft, this.bottomRight); }
  
}
