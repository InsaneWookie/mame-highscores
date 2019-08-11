import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  sendingRequest: boolean;
  requestSent: boolean;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    // this.loginForm.markAsTouched({onlySelf: true});
    // if(this.loginForm.invalid){
    //   return;
    // }
    //
    this.sendingRequest = true;
    this.requestSent = false;
    this.http.post('/api/v1/auth/request_password_reset', this.forgotPasswordForm.value).subscribe((res: any) => {

      this.requestSent = true;
      if(res.success){

      }

    }, () => { this.sendingRequest = false; });
  }

  get username(){
    return this.forgotPasswordForm.get('username');
  }

}
