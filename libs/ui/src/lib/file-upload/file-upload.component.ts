import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    ElementRef,
  } from '@angular/core';
  import { FileUploadService } from './file-upload.service';
  
  export interface FileInfo {
    name: string;
    size: number;
    type: string;
  }
  
  @Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class FileUploadComponent {
    selectedFiles?: FileList;
    filenames: Array<FileInfo> = [];
    // filename = '';
    // selectedFiles?: Array<string> | null;
    // selFiles?: FileList | null;
    // formData?: FormData;
    // currentFile?: File;
    // progress = 0;
    // message = '';
  
    constructor(private service: FileUploadService) {}
  
    onFileSelection(event: Event) {
      this.filenames = [];
      const target = event.target as HTMLInputElement;
      this.selectedFiles = target.files as FileList;
      for (const a of Array.from(this.selectedFiles))
        this.filenames.push({ size: a.size, name: a.name, type: a.type });
    }
  
    upload(): void {
      const formData = new FormData();
      if (this.selectedFiles?.length) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append(
            'file',
            this.selectedFiles[i],
            this.selectedFiles[i].name
          );
        }
        this.service.uploadFiles(formData).subscribe((data) => {
          console.log(data);
          this.selectedFiles = undefined;
          this.filenames = [];
        });
      }
    }
  
    strengthen(caseName: string): void {
      if (this.selectedFiles) {
        const file: File | null = this.selectedFiles.item(0);
        if (file)
          this.service.upload(file, caseName).subscribe((data) => {
            console.log(data);
            this.selectedFiles = undefined;
            this.filenames = [];
          });
      }
    }
  
    // upload(): void {
    //   this.formData = new FormData();
  
    //   if (this.selFiles?.length) {
    //     for (let i = 0; i < this.selFiles?.length; i++) {
    //       this.formData.append('files', this.selFiles[i], this.selFiles[i].name);
    //     }
    //   }
    // }
  
    // upload(): void {
    //   this.progress = 0;
  
    //   if (this.selectedFiles) {
    //     const file: File | null = this.selectedFiles.item(0);
  
    //     if (file) {
    //       this.currentFile = file;
  
    //       this.service.upload(this.currentFile).subscribe({
    //         next: (event: any) => {
    //           if (event.type === HttpEventType.UploadProgress) {
    //             this.progress = Math.round((100 * event.loaded) / event.total);
    //             console.log(this.progress);
    //           } else if (event instanceof HttpResponse) {
    //             console.log(event);
    //             // this.message = event.body.message;
    //             this.fileInfos = this.service.getFiles();
    //             console.log(this.fileInfos);
    //           }
    //         },
    //         error: (err: any) => {
    //           console.log(err);
    //           this.progress = 0;
  
    //           if (err.error && err.error.message) {
    //             this.message = err.error.message;
    //           } else {
    //             this.message = 'Could not upload the file!';
    //           }
  
    //           this.currentFile = undefined;
    //         },
    //       });
    //     }
  
    //     this.selectedFiles = undefined;
    //   }
    // }
  }