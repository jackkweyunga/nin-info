import { KeyValuePipe } from '@angular/common';
import { KeyValue } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MapType } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  data: Observable<any> = new Observable();
  signature: any
  photo: any

  constructor(
    public http: HttpClient
  ) {}

  getSampleData() {
    let file: string = "../assets/storage/sample_data.json";
    return this.http.get(file);
  }

  convertDataUrl(dataUrl: any) {
    
    return "data:image/png;base64,"+dataUrl
}

  ngOnInit(): void {
    this.data = this.getSampleData().pipe(
      tap((data: any) => {
        this.photo = data["PHOTO"];
        this.photo = this.convertDataUrl(this.photo);
        this.signature = data["SIGNATURE"];
        this.signature = this.convertDataUrl(this.signature);

        delete data["PHOTO"];
        delete data["SIGNATURE"];

      }),
    );
      
  }

}
