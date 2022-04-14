import { Grid } from './grid.js';
import { GridUi } from './grid-ui.js';
import { InteractiveCanvas } from './interactive-canvas.js';
import { ImageCanvas } from './image-canvas.js';
import { Point } from './point.js';
import { Rectangle } from './rectangle.js';

export class NotationCanvas extends InteractiveCanvas {
  constructor(canvas) {
    super(canvas);
    this._notations = [];
    this.gridui = new GridUi(this.ctx);
  }

  set notations(notations) {
    this._notations = notations;
    this.gridui.grids = notations.map(notation => new Grid(notation.grid));
  }
  
  get notations() { return this._notations; }

  set showGrid(showGrid) {
    this.gridui.showGrid = showGrid;
    this.draw();
  }

  onDraw(ctx) {
    this.gridui.draw(ctx);
  }
  
  zoomToMove(notationIndex, moveIndex) {
    let moveOutlines = Array.from(this.gridui.grids[notationIndex].moveOutlines());
    let rectangle = Rectangle.fromQuadrilaterial(moveOutlines[moveIndex]).expand(0.2);
    this.zoomToOutline(rectangle);
  }
  
  onMousedown(point) {
    var point = this.pointFromEvent(event);
    if (!this.gridui.onMousedown(point)) {
      super.onMousedown(event);
    }
  }

  onMousemove(point) {
    var point = this.pointFromEvent(event);
    this.canvas.style.cursor = this.gridui.getCursor(point);
    if (this.gridui.onMousemove(point)) {
      this.draw();
    };
    super.onMousemove(event);
	}
  
	onMouseup(point) {
    var point = this.pointFromEvent(event);
    this.gridui.onMouseup(point);
    super.onMouseup(event);
	}
}
