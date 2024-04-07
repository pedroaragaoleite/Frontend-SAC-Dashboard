import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isSubmitted: boolean = false;
  isInvalid: boolean = false;



  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  ngOnInit(): void {

  }

  onSubmit(): void {
    console.log(this.loginForm.value);
    this.isSubmitted = true;
    console.log(this.loginForm.valid);


    if (this.loginForm.valid) {
      const user: User = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!,
      }

      this.authService.login(user)
        .subscribe({
          next: res => {
            if(res) {
              this.router.navigate(['/dashboard']);
            }
          },
          error: error => {
            console.error('Login invalid: ', error);
          }
        })
    }

  }

}
