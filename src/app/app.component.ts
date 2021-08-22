
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Nidjs } from "nidjs";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  _data: BehaviorSubject<any> = new BehaviorSubject<any>({})
  data = this._data.asObservable();
  signature: string | undefined = "../assets/images/signature_line.png";
  photo: string | undefined = "../assets/images/user_image.png";

  _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  loading: Observable<boolean> = this._loading.asObservable()


  _errorLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  errorLoading: Observable<any> = this._errorLoading.asObservable();

  pattern_error: boolean = false;

  ninForm: FormGroup = new FormGroup({});
  wrong_input: boolean = false;

  constructor(
    public http: HttpClient,
    private fb: FormBuilder
  ) { }

  //  loading test data
  getSampleData() {
    let file: string = "../assets/storage/sample_data.json";
    return this.http.get(file);
  }

  convertDataUrl(dataUrl: any) {
    if (dataUrl) {
      return "data:image/png;base64," + dataUrl
    }
    return
  }

  preprocess(data: any) {

    if (data) {
      let photo = data["PHOTO"];
      this.photo = this.convertDataUrl(photo) === undefined ? this.photo : this.convertDataUrl(photo);

      let signature = data["SIGNATURE"];
      this.signature = this.convertDataUrl(signature) === undefined ? this.signature : this.convertDataUrl(signature);

      delete data["LastName"];
      delete data["FirstName"];
      delete data["SurName"];
      delete data["Sex"];

      delete data["PHOTO"];
      delete data["SIGNATURE"];
    }

    return data
  }

  ngOnInit() {

    this.loading.subscribe(l => console.log(l));

    this.ninForm = this.fb.group({
      nin: ["", [Validators.pattern("[0-9]*$")]],
    });

    this.ninForm.valueChanges.subscribe((data) => {

      this._data.next({});

      this.signature = "../assets/images/signature_line.png";
      this.photo = "../assets/images/user_image.png";

      let nin = data["nin"];

      if (this.ninForm.get('nin')?.hasError('pattern')) {
        this.pattern_error = true;
      }

      if (nin.length == 20) {
        if (this.ninForm.valid) {
          // console.log(data["nin"]);

          const nida = new Nidjs()
          this._loading.next(true);
          from(nida.loadDetails(nin)).subscribe((dt: any) => {
            console.log(dt);

            if (dt === undefined) {
              this.wrong_input = true;
              this.data = of({})
              this.signature = "../assets/images/signature_line.png";
              this.photo = "../assets/images/user_image.png";
            } else {
              data = this.preprocess(dt);
              this._data.next(data);
            }
            this._loading.next(false);
          }, err => {
            console.log(err.Error);
            this._errorLoading.next(true)
          });
        };

      }

    });

  }
}
