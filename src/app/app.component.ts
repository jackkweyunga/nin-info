
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { tap } from "rxjs/operators";
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  data: Observable<any> = of({});
  signature: string | undefined = "../assets/images/signature_line.png";
  photo: string | undefined = "../assets/images/user_image.png" ;
  loading: boolean = false;
  loaded: Observable<any> = of({});

  pattern_error: boolean = false;

  ninForm: FormGroup = new FormGroup({});

  constructor(
    public http: HttpClient,
    private fb: FormBuilder
  ) { }

  //  loading test data
  async getSampleData() {
    let file: string = "../assets/storage/sample_data.json";
    return this.http.get(file);
  }

  // loading actual data
  async getData(nin: string) {
    let url = environment.api_url + "nida";
    return this.http.post(url, { "id": nin });
  }


  convertDataUrl(dataUrl: any) {
    if (dataUrl) {
      return "data:image/png;base64," + dataUrl
    }
      return
  }

  preprocess(loaded: Observable<any>): Observable<any> {
    return loaded.pipe(
      tap((data: any) => {
        let photo = data["PHOTO"];
        this.photo = this.convertDataUrl(photo)===undefined?this.photo : this.convertDataUrl(photo);
        
        let signature = data["SIGNATURE"];
        this.signature = this.convertDataUrl(signature)===undefined?this.signature : this.convertDataUrl(signature);

        delete data["Lastname"];
        delete data["Firstname"];
        delete data["Surname"];
        delete data["Sex"];

        delete data["PHOTO"];
        delete data["SIGNATURE"];

      })
    );
  }


  async process_data(nin: string) {
    this.loading = true;
    if (nin === "" && environment.showSampleData) {
      this.loaded = await this.getSampleData()
    }

    if (nin !== "") {
      let _loaded = await this.getData(nin)
      _loaded.subscribe((j: any) => {
        this.loaded = of(j["data"])  
      })
    }

    let processed = this.preprocess(this.loaded);
    this.data = processed

    this.loading = false;
  }

  ngOnInit(): void {

    this.ninForm = this.fb.group({
      nin: ["", [Validators.pattern("[0-9]*$")]],
    });

    this.ninForm.valueChanges.subscribe((data) => {
      let nin = data["nin"];

      if (this.ninForm.get('nin')?.hasError('pattern')) {
        this.pattern_error = true;
      }

      if (nin.length == 20) {
        if (this.ninForm.valid) {
          console.log(data["nin"]);
          this.process_data(nin);
        }

      }

    })

    if (environment.showSampleData === true) {
      this.process_data("");
    }

  }

}
