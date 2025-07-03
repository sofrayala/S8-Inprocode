import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpInterface } from '../../../shared/interfaces/sign-up-interface';
import { AuthServiceService } from '../../data-access/auth-service.service';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-auth-sign-up',
  imports: [RouterLink, ReactiveFormsModule, NavBarComponent],
  templateUrl: './auth-sign-up.component.html',
  styleUrl: './auth-sign-up.component.css',
})
export default class AuthSignUpComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthServiceService);

  form = this._formBuilder.group<SignUpInterface>({
    email: this._formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async submit() {
    console.log(this.form.value);
    if (this.form.invalid) return;

    try {
      const authResponse = await this._authService.signUp({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });

      console.log(authResponse);
      if (authResponse.error) throw authResponse.error;
      alert('Please confirm your email');
    } catch (error) {
      console.error(error);
    }
  }
}
