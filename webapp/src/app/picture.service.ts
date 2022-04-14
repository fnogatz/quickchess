import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';

export interface Picture { filename: string; }
// TODO: Add upload progress so that it can be displayed in UI
export interface PictureWithId extends Picture { id: string; }

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  constructor(
    private readonly storage: AngularFireStorage,
    private readonly db: AngularFirestore
  ) { }

  getPictureUrl(pictureId: string): Observable<string | null> {
    return this.getStorageRef(pictureId).getDownloadURL();
  }

  // TODO: figure out correct return type
  downloadPicture(pictureId: string): Observable<any> {
    return this.getPictureUrl(pictureId).pipe(
      map(url => {
        var img = new Image();
        // NOTE: This requires server-side configuration, see https://stackoverflow.com/a/37765371.
        img.crossOrigin = "anonymous";
        img.src = url;
        return img;
      })
    );
  }

  getPictures(tournamentId: string): Observable<PictureWithId[]> {
    return this.getPictureCollection(tournamentId).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Picture;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  uploadPicture(tournamentId: string, file: File) {
    console.log('uploadPicture()', file.name);
    this.createPicture(tournamentId, file.name).then(pictureId => {
      console.log('Starting file upload for', file.name);
      const fileRef = this.getStorageRef(pictureId);
      const task = fileRef.put(file, {contentType: 'image/jpeg'});

      // Observe upload progress.
      task.percentageChanges().subscribe(percentage => {
        console.log("Upload progress", pictureId, percentage);
      });  
    });
  }

  /** Sets the hasGame property on a picture document. */
  setHasGame(tournamentId: string, pictureId: string, hasGame: boolean) {
    const ref = this.db.doc<Picture>('tournaments/' + tournamentId + '/pictures/' + pictureId);
    ref.update({hasGame: hasGame} as Partial<Picture>);
  }

  private createPicture(tournamentId: string, filename: string): Promise<string> {
    const collection = this.getPictureCollection(tournamentId);
    return collection.add({filename: filename}).then(ref => ref.id);
  }
  
  private getPictureCollection(tournamentId: string): AngularFirestoreCollection<Picture> {
    return this.db.collection<Picture>('tournaments/' + tournamentId + '/pictures');
  }
  
  private getStorageRef(pictureId) {
    return this.storage.ref('notations/original/' + pictureId + '.jpg');
  }
}
