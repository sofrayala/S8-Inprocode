import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../data-access/auth-service.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LogInInterface } from '../../../shared/interfaces/log-in-interface';
import { NavBarComponent } from '../../../components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-auth-log-in',
  imports: [ReactiveFormsModule, RouterLink, RouterModule, NavBarComponent],
  templateUrl: './auth-log-in.component.html',
  styleUrl: './auth-log-in.component.css',
})
export default class AuthLogInComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthServiceService);
  private _router = inject(Router);

  form = this._formBuilder.group<LogInInterface>({
    email: this._formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async submit() {
    if (this.form.invalid) return;
    try {
      await this._authService.logIn({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      this._router.navigateByUrl('/note-list');
      console.log('Logged in!');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }
}
