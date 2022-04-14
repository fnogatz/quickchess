import { Grid } from './grid.js';
import { Quadrilateral } from './quadrilateral.js';

/** Handle for rows of a grid. */
export class RowHandle {
  constructor(grid, index) {
    this.grid = grid;
    this.index = index;
  }

  get cursor() { return 'ns-resize'; }

  get rowLine() {
    return this._getRowLines()[this.index];
  }

  getHandleZone(paddingX, paddingY) {
    var rowLine = this.rowLine;
    return new Quadrilateral([
      rowLine.a.add(0, -paddingY),
      rowLine.b.add(0, -paddingY),
      rowLine.b.add(0, paddingY),
      rowLine.a.add(0, paddingY)
    ])    
  }

  onDragging(target) {
    let left = this.grid.outline.leftBorder;
    let right = this.grid.outline.rightBorder;
    let position = left.projectPoint(target, right);
    if (isNaN(position)) return false;
    if (this.index <= 0) {
      this.grid.setCornerPosition('topLeft', left.pointOnLine(position));
      this.grid.setCornerPosition('topRight', right.pointOnLine(position));
    } else if (this.index >= this.grid.rowCount) {
      this.grid.setCornerPosition('bottomLeft', left.pointOnLine(position));
      this.grid.setCornerPosition('bottomRight', right.pointOnLine(position));
    } else {
      this.grid.setRowPosition(this.index, position);
    }
    return true;
  }
  
  _getRowLines() {
    // TODO: Check whether this call is bad for the frame rate.
    return Array.from(this.grid.rowLines());
  }
}
