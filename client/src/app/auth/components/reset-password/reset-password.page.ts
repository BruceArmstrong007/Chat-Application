import { NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ValidationService } from 'src/shared/services/validation.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, NgIf]
})
export class ResetPasswordPage implements OnInit {
  private readonly passwordValidator = inject(ValidationService);
  private readonly fb : FormBuilder = inject(FormBuilder);
  resetPasswordForm: FormGroup;
  constructor() {
    this.resetPasswordForm = this.fb.group({
      username: ['',Validators.compose([Validators.required,Validators.maxLength(25)])],
      password: ['',Validators.compose([Validators.required])],
      confirmPassword: ['',Validators.compose([Validators.required])]
    },{
      validators : (control: FormControl<any>) => this.passwordValidator.MatchValidator(control,"password",'confirmPassword')
    })
   }

  ngOnInit() {
  }

  resetPassword(){
    if(this.resetPasswordForm.invalid){
      return;
    }
    console.log(this.resetPasswordForm.value);
  }

  get f(){
    return this.resetPasswordForm.controls;
  }

}
