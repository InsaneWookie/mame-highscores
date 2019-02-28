import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { forkJoin, Observable, of } from "rxjs";

@Component({
  selector: 'app-game-upload',
  templateUrl: './game-upload.component.html',
  styleUrls: ['./game-upload.component.scss']
})
export class GameUploadComponent implements OnInit {

  fileToUpload: File = null;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);

  }

  onSubmit() {
    let fileToUpload = this.fileToUpload;

    //{enctype: 'multipart/form-data'}
    const endpoint = '/api/v1/game/upload';
    const formData: FormData = new FormData();
    formData.append('game', fileToUpload, fileToUpload.name);
    this.http.post(endpoint, formData)
      .pipe(catchError(of))
      .subscribe((game) => {

      });

  }


}
