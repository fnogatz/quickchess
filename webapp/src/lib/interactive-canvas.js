import { Grid } from './grid.js';
import { ImageCanvas } from './image-canvas.js';
import { Point } from './point.js';
import Scroller from '@gulewei/scroller/src/scroller.js';

/**
 * Canvas for displaying an image that can handle user interactions like
 * zooming and paning.
 */
export class InteractiveCanvas extends ImageCanvas {
  constructor(canvas) {
    super(canvas);
    this.scroller = new Scroller((left, top, zoom) => {
      this.translateX = -left;
      this.translateY = -top;
      this.zoom = zoom;
      this.checkMinZoom();
      this.draw();
    }, {
      animating: false,
      bouncing: false,
      minZoom: 0,
      maxZoom: 10,
      zooming: true
    });
  }

  set image(image) { 
    super.image = image;
    this.scroller.zoomTo(this.minZoom);
  }

  onResize() {
    super.onResize();
    if (!(this.canvas instanceof OffscreenCanvas)) {
      var rect = this.canvas.getBoundingClientRect();
      this.scroller.setPosition(rect.left + this.canvas.clientLeft, rect.top + this.canvas.clientTop);
    }
    this.scroller.setDimensions(this.canvas.width, this.canvas.height, this.imageWidth, this.imageHeight);
    this.checkMinZoom();
  }
  
  checkMinZoom() {
    if (this.zoom < this.minZoom) {
      this.scroller.zoomTo(this.minZoom);
    }
  }

  onWheel(e) {
    // Prevent scroll event from bubbling up.
    e.preventDefault();  
		this.scroller.doMouseZoom(e.deltaY, e.timeStamp, e.pageX, e.pageY);
  }

  onMousedown(e) {
		this.scroller.doTouchStart([{
			pageX: e.pageX,
			pageY: e.pageY
		}], e.timeStamp);
    this.mousedown = true;
  }

  onMousemove(e) {
		if (!this.mousedown) {
			return;
		}
		this.scroller.doTouchMove([{
			pageX: e.pageX,
			pageY: e.pageY
		}], e.timeStamp);
	}
  
	onMouseup(e) {
		if (!this.mousedown) {
			return;
		}
		this.scroller.doTouchEnd(e.timeStamp);
		this.mousedown = false;
	}
  
  zoomToOutline(outline) {
    // Reset zoom factor. TODO: figure out why this is needed.
    this.scroller.scrollTo(0, 0, false, this.minZoom);

    let zoomX = this.canvas.width / (this.imageWidth * outline.width);
    let zoomY = this.canvas.height / (this.imageHeight * outline.height);
    let posX = outline.topLeft.x * this.imageWidth;
    let posY = outline.topLeft.y * this.imageHeight;
    if (zoomX < zoomY) {
      let padding = (this.canvas.height / zoomX - this.imageHeight * outline.height) / 2;
      this.scroller.scrollTo(posX, posY - padding, false, zoomX);
    } else {
      let padding = (this.canvas.width / zoomY - this.imageWidth * outline.width) / 2;
      this.scroller.scrollTo(posX - padding, posY, false, zoomY);
    }
  }
}
