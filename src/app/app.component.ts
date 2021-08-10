import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  data: Observable<any> = new Observable();

  constructor(
    public http: HttpClient
  ) {}

  getSampleData() {
    let file: string = "../assets/storage/sample_data.json";
    return this.http.get(file);
  }

  ngOnInit(): void {
    this.data = this.getSampleData();
  }

}
