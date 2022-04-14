import { CornerHandle } from './corner-handle.js';
import { Grid } from './grid.js';
import { RowHandle } from './row-handle.js';
import { Quadrilateral } from './quadrilateral.js';

// TODO: Move UI related classes into a subdirectory.
export class GridUi {
  constructor(ctx) {
    this.ctx = ctx;
    this._grids = [];
    this._showGrid = false;
    this.cornerHandles = [];
    this.rowHandles = [];
  }

  set grids(grids) {
    this._grids = grids;
    this.cornerHandles = [];
    this.rowHandles = [];
    for (let grid of grids) {
      this.cornerHandles.push(new CornerHandle(grid, 'topLeft'));
      this.cornerHandles.push(new CornerHandle(grid, 'topRight'));
      this.cornerHandles.push(new CornerHandle(grid, 'bottomRight'));
      this.cornerHandles.push(new CornerHandle(grid, 'bottomLeft'));
      for (let i = 0; i <= grid.rowCount; i++) {
        this.rowHandles.push(new RowHandle(grid, i));
      }
    }
  }
  
  get grids() { return this._grids; }

  set showGrid(showGrid) {
    this._showGrid = showGrid;
  }
  
  draw(ctx) {
    if (!this._showGrid) return;

    // Spacing used for user interaction as well as placer UI.
    this._paddingX = 4 * ctx.lineWidth;
    this._paddingY = 3 * ctx.lineWidth;

    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'white';
    for (let grid of this._grids) {
      for (let moveOutline of grid.moveOutlines()) {
        moveOutline.stroke(ctx);
      }
    }
    for (let handle of this.cornerHandles) {
      handle.getHandleZone(this._paddingX, this._paddingY).path(ctx);
      ctx.stroke();
      ctx.fill();
    }
    ctx.restore()
  }

  onMousedown(point) {
    for (let handle of this._handles()) {
      if (handle.getHandleZone(this._paddingX, this._paddingY).containsPoint(this.ctx, point)) {
        this._activeHandle = handle;
        return true;
      }
    }
    return false;
  }

  onMousemove(point) {
    if (this._activeHandle && point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1) {
      return this._activeHandle.onDragging(point);
    }
	}
  
	onMouseup(point) {
    this._activeHandle = null;
	}

  getCursor(point) {
    for (let handle of this._handles()) {
      if (handle.getHandleZone(this._paddingX, this._paddingY).containsPoint(this.ctx, point)) {
        return handle.cursor;
      }
    }
    return null;
  }

  * _handles() {
    yield* this.cornerHandles;
    yield* this.rowHandles;
  }
}
