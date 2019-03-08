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

  form: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.form = {gamename: '', api_key: ''}
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  onSubmit() {
    let fileToUpload = this.fileToUpload;

    //{enctype: 'multipart/form-data'}
    const endpoint = `/api/v1/game/upload/${this.form.api_key}`;
    const formData: FormData = new FormData();
    formData.append('game', fileToUpload, fileToUpload.name);
    // formData.set('api_key', this.form.api_key);
    this.http.post(endpoint, formData)
      .pipe(catchError(of))
      .subscribe((game) => {

      });

  }


}
