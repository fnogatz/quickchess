// TODO: Make immutable
export class Point {
  constructor(x, y) {
    if (Array.isArray(x)) {
      this.x = x[0];
      this.y = x[1];
    } else {
      this.x = x;
      this.y = y;
    }
  }
  
  add(cx, cy) {
    return new Point(this.x + cx, this.y + cy);
  }
}
