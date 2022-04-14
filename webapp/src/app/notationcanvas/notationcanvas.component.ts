import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';

import { NotationCanvas } from '../../lib/notation-canvas.js';
import { Notation } from '../notation.service';
import { PictureService, PictureWithId } from '../picture.service';

/*

[picture: PictureWithId]
[(grids)]
[currentMove]
*/

@Component({
  selector: 'notationcanvas',
  templateUrl: './notationcanvas.component.html',
  styleUrls: ['./notationcanvas.component.css']
})
export class NotationcanvasComponent implements OnInit {
  @ViewChild('canvas') canvasElement: ElementRef;

  private _picture: PictureWithId;
  private _notations: Notation[];
  private canvas: NotationCanvas;

  constructor(private pictureService: PictureService) {
    this._notations = [];
  }

  ngOnInit() {
    this.canvas = new NotationCanvas(this.canvasElement.nativeElement);
    this.canvas.notations = this._notations;
    this.canvas.showGrid = true;
  }

  /** Note: the notation objects will be changed in-place! */
  @Input()
  set notations(notations: Notation[]) {
    this._notations = notations;
    if (this.canvas) {
      this.canvas.notations = this._notations;
    }
  }
 
  get notations(): Notation[] { return this._notations; }

  @Input()
  set picture(picture: PictureWithId) {
    // TODO: Add loading indicator.
    this._picture = picture;
    this.pictureService.downloadPicture(picture.id).subscribe(img => {
      img.onload = () => {
        // TODO: Reconsider this auto-rotation logic once we allow two notations on one picture.
        if (this._notations.length && typeof this._notations[0].pictureRotation == 'number') {
          this.canvas.rotation = this._notations[0].pictureRotation;
        } else {
          this.canvas.rotation = img.width > img.height ? 90 : 0;
        }
        this.canvas.image = img;
      }
    });
  }
 
  get picture(): PictureWithId { return this._picture; }

  @Input()
  set showGrid(showGrid: boolean) {
    this.canvas.showGrid = showGrid;
  }

  toBlob(callback) {
    this.canvasElement.nativeElement.toBlob(callback);
  }

  @Input()
  set rotation(rotation: number) {
    this.canvas.rotation = rotation;
    this.canvas.onResize();
    this.canvas.draw();
  }
  
  get rotation(): number { return this.canvas.rotation; }
  
  zoomToMove(moveIndex) {
    // TODO: use correct notation index.
    this.canvas.zoomToMove(0, moveIndex);
  }

  @HostListener('window:resize')
  onResize() {
    this.canvas.onResize();
    this.canvas.draw();
  }

  @HostListener('wheel', ['$event'])
  onWheel(event) {
    this.canvas.onWheel(event);
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    this.canvas.onMousedown(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMousemove(event) {
    this.canvas.onMousemove(event);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseup(event) {
    this.canvas.onMouseup(event);
  }
}
