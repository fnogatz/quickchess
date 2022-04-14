import { Line } from './line.js';
import { Point } from './point.js';
import { Quadrilateral } from './quadrilateral.js';

export class Grid {
  constructor(config) {
    this.config = config;
  }

  get outline() {
    return new Quadrilateral([
      new Point(this.config.outline.topLeft),
      new Point(this.config.outline.topRight),
      new Point(this.config.outline.bottomRight),
      new Point(this.config.outline.bottomLeft)]);
  }
  
  get columnCount() {
    return this.config.columns;
  }

  get rowCount() {
    return this.config.rows;
  }

  get positionedRows() {
    var positionedRows = Object.assign({0: 0.0}, this.config.positionedRows);
    positionedRows[this.rowCount] = 1.0;
    return positionedRows;
  }

  setRowPosition(index, position) {
    // Ensure that object exists in config.
    this.config.positionedRows = this.positionedRows;
    // Validate new row postion.
    let min = 0.0, max = 1.0;
    let padding = 1.0 / this.rowCount / 4;
    for (let i = 1; i < index; i++) {
      min = Math.max(min, (this.config.positionedRows[i] || 0.0) + padding * (index - i));
    }
    for (let i = index + 1; i < this.rowCount; i++) {
      max = Math.min(max, (this.config.positionedRows[i] || 1.0) + padding * (index - i));
    }
    this.config.positionedRows[index] = Math.max(min, Math.min(max, position));
  }

  setCornerPosition(index, position) {
    if (isNaN(position.x) || isNaN(position.y)) return;
    let x = Math.max(0, Math.min(1, position.x));
    let y = Math.max(0, Math.min(1, position.y));
    let outline = this.outline;
    if (index.indexOf("top") != -1) {
      y = Math.min(y, Math.min(outline.bottomLeft.y, outline.bottomRight.y));
    }
    if (index.indexOf("Right") != -1) {
      x = Math.max(x, Math.max(outline.topLeft.x, outline.bottomLeft.x));
    }
    if (index.indexOf("bottom") != -1) {
      y = Math.max(y, Math.max(outline.topLeft.y, outline.topRight.y));
    }
    if (index.indexOf("Left") != -1) {
      x = Math.min(x, Math.min(outline.topRight.x, outline.bottomRight.x));
    }
    this.config.outline[index] = [x, y];
  }

  * moveOutlines() {
    for (var columnStart = 0; columnStart < 1; columnStart += 0.35) {
      yield* this._moveOutlinesForColumn(columnStart);
    }
  }

  * _moveOutlinesForColumn(columnStart) {
    var rowLines = this.rowLines();
    var upperLine = rowLines.next();
    var lowerLine = rowLines.next();
    while (!lowerLine.done) {
      yield new Quadrilateral([
        upperLine.value.pointOnLine(columnStart),
        upperLine.value.pointOnLine(columnStart + 0.15),
        lowerLine.value.pointOnLine(columnStart + 0.15),
        lowerLine.value.pointOnLine(columnStart)
      ]);
      yield new Quadrilateral([
        upperLine.value.pointOnLine(columnStart + 0.15),
        upperLine.value.pointOnLine(columnStart + 0.30),
        lowerLine.value.pointOnLine(columnStart + 0.30),
        lowerLine.value.pointOnLine(columnStart + 0.15),
      ]);
      upperLine = lowerLine;
      lowerLine = rowLines.next();
    }
  }

  * rowLines() {
    var leftBorder = new Line(this.outline.topLeft, this.outline.bottomLeft);
    var rightBorder = new Line(this.outline.topRight, this.outline.bottomRight);
    for (let position of this.rowPositions()) {
      yield new Line(
        leftBorder.pointOnLine(position),
        rightBorder.pointOnLine(position)
      );
    }
  }

  * rowPositions() {
    yield 0.0;
    var positionedRows = this.positionedRows;
    var lastRow = 0, lastPosition = 0.0;
    for (var i = 1; i <= this.rowCount; i++) {
      if (positionedRows[i]) {
        var height = (positionedRows[i] - lastPosition) / (i - lastRow);
        for (; lastRow < i; lastRow++) {
          yield lastPosition += height;
        }
      }
    }
  }  
}
