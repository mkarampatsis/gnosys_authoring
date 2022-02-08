import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileUploadResponse {
  Data: FileUploadResponseData[];
  ErrorMessage: string;
}

export interface FileUploadResponseData {
  Id: number;
  Status: string;
  FileName: string;
  ErrorMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = '/api';
  constructor(private http: HttpClient) {}

  upload(file: File, name: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('name', name);

    // const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/optimize/strengthen`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  uploadFiles(files: FormData): Observable<FileUploadResponse> {
    return this.http.post<FileUploadResponse>(
      this.baseUrl + '/upload/multiple',
      files
    );
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}