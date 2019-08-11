import { Component, OnInit } from '@angular/core';
// import { passwordsMatch } from "../user-profile/user-profile.component";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";

export const passwordsMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const repeatNewPassword = control.get('repeatNewPassword');
  return (newPassword.value !== repeatNewPassword.value) ? {'passwordsMatch':  true} : null
};

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    newPassword: new FormControl(''),
    repeatNewPassword: new FormControl(''),
  }, { validators: passwordsMatch});

  isSaving = false;

  constructor(private readonly authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
  }


  onChangePasswordSubmit(){
    // console.warn(this.changePasswordForm.value);
    this.isSaving=true;
    const resetToken = this.route.snapshot.paramMap.get('key');
    this.authService.resetPassword(resetToken, this.newPassword.value, this.repeatNewPassword.value)
  }

  get newPassword(){
    return this.resetPasswordForm.get('newPassword');
  }

  get repeatNewPassword(){
    return this.resetPasswordForm.get('repeatNewPassword');
  }


}
