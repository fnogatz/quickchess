import { Point } from './point.js';

/**
 * Canvas for displaying an image.
 */
export class ImageCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this._image = null;
    this.zoom = 1;
    this.minZoom = 0;
    this.translateX = 0;
    this.translateY = 0;
    this._rotation = null;
  }

  set image(image) {
    this._image = image;
    this.onResize();
  }
  
  get image() { return this._image; }

  get imageWidth() {
    return (this._rotation == 90 || this._rotation == 270) ? this._image.height : this._image.width;
  }

  get imageHeight() {
    return (this._rotation == 90 || this._rotation == 270) ? this._image.width : this._image.height;
  }

  onResize() {
    if (!(this.canvas instanceof OffscreenCanvas)) {
      this.canvas.width = this.canvas.getBoundingClientRect().width;
      this.canvas.height = this.canvas.getBoundingClientRect().height;
    }
    this.minZoom = Math.min(this.canvas.height / this.imageHeight, this.canvas.width / this.imageWidth);
  }

  draw() {
    if (!this._image) {
      return;
    }

    // Add padding in order to center image if fully zoomed.
    this._paddingLeft = Math.max((this.canvas.width - this.imageWidth * this.zoom) / 2, 0);
    this._paddingTop = Math.max((this.canvas.height - this.imageHeight * this.zoom) / 2, 0);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.translateX + this._paddingLeft, this.translateY + this._paddingTop);
    this.ctx.scale(this.zoom, this.zoom);

    // Rotate the image if needed.
    this.ctx.save();
    if (this.rotation) {
      if (this.rotation == 90 || this.rotation == 180) {
        this.ctx.translate(this.imageWidth, 0);
      }
      if (this.rotation == 180 || this.rotation == 270) {
        this.ctx.translate(0, this.imageHeight);
      }
      this.ctx.rotate(this.rotation * Math.PI / 180);
    }
    this.ctx.drawImage(this._image, 0, 0);
    this.ctx.restore();

    // Prepare for user draw (in coordinates [0, 1]).
    this.ctx.scale(this.imageWidth, this.imageHeight);
    this.ctx.lineWidth = 1 / this.zoom / this.imageWidth;
    this.onDraw(this.ctx);
    this.ctx.restore();
  }

  onDraw() {
    // Should be implemented by subclasses.
  }
  
  pointFromEvent(event) {
    if (!this._image) {
      return new Point(0, 0);
    }
    var rect = this.canvas.getBoundingClientRect();
    var canvasX = event.pageX - rect.left - this.canvas.clientLeft;
    var canvasY = event.pageY - rect.top - this.canvas.clientTop;
    return new Point(
      (canvasX - this.translateX - this._paddingLeft) / this.zoom / this.imageWidth,
      (canvasY - this.translateY - this._paddingTop) / this.zoom / this.imageHeight
    );
  }

  set rotation(rotation) {
    this._rotation = rotation % 360;
  }
  
  get rotation() { return this._rotation; }
}
