import { Grid } from './grid.js';
import { Quadrilateral } from './quadrilateral.js';

/** Handle for moving the corners of a grid. */
export class CornerHandle {
  constructor(grid, index) {
    this.grid = grid;
    this.index = index;
  }

  get cursor() { return 'grab'; }
  get cornerPoint() {
    return this.grid.outline[this.index];
  }

  getHandleZone(paddingX, paddingY) {
    var cornerPoint = this.cornerPoint;
    return new Quadrilateral([
      cornerPoint.add(-paddingX, -paddingY),
      cornerPoint.add(paddingX, -paddingY),
      cornerPoint.add(paddingX, paddingY),
      cornerPoint.add(-paddingX, paddingY)
    ])    
  }

  onDragging(target) {
    this.grid.setCornerPosition(this.index, target);
    return true;
  }
}
