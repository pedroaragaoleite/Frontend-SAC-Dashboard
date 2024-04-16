import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { map } from 'rxjs';
import { SharedService } from '../../../core/services/shared/shared.service';
import { emailValidator, passwordValidator, selectValidator, userValidation } from '../../../validators/customValidator';
import { FormValidationsService } from '../../../core/services/formValidations/form-validations.service';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {
  @Input() mode: "create" | "edit" = "create";
  @Input() userData: User | null = null;
  @Output() modalChanged: EventEmitter<void> = new EventEmitter();
  isSubmitted: boolean = false;
  isInvalid: boolean = false;
  validEmail: boolean = false;
  roles: any[] = [];

  registerForm: FormGroup;

  usernameValidationErrors: string[] = [];
  emailValidationErrors: string[] = [];
  passwordValidationErrors: string[] = [];
  selectValidationErrors: string[] = [];

  constructor(private validationService: FormValidationsService, private cdRef: ChangeDetectorRef, private sharedServices: SharedService, private usersService: UsersService, private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.minLength(3), userValidation()]],
      email: ['', [Validators.required, Validators.email, emailValidator()]],
      role: ['Choose a role', [Validators.required, selectValidator()]]
    });



  }

  ngOnInit(): void {
    this.formBasedOnMode();
    this.getRoles();

    // this.formControl();


  }

  // checkEmail(email: string): void {
  //   this.authService.checkEmail(user, email)
  //     .subscribe({
  //       next: (res => {
  //         if (res) {
  //           this.validEmail = false;
  //           console.log(res);

  //         }
  //       }),
  //       error: error => {
  //         console.error(error);
  //       }
  //     })
  // }

  formBasedOnMode() {
    if (this.mode === 'edit' && this.userData) {
      this.registerForm.patchValue({
        username: this.userData.username,
        email: this.userData.email,
        role: this.userData.role
      });
    } else if (this.mode === 'create') {
      this.registerForm.addControl('password', this.fb.control('', [Validators.minLength(8), passwordValidator()]));
    }


  }

  getRoles(): any {
    this.usersService.getRoles()
      .pipe(
        map(response => response.roles.map((role: any) => role.role_name))
      )
      .subscribe({
        next: (roles => {
          this.roles = roles;
        }),
        error: error => {
          console.error('Error pushing the roles', error)
        }
      })
  }

  // formControl():void {
  //   this.registerForm.controls['username'].statusChanges.subscribe(() => {
  //     this.usernameValidationErrors = this.validationService.getUsernameMessages(this.registerForm.controls['username']);     
  //   })

  //   this.registerForm.controls['email'].statusChanges.subscribe(() => {
  //     this.emailValidationErrors = this.validationService.getEmailMessages(this.registerForm.controls['email'])
  //   });

  //   this.registerForm.controls['password'].statusChanges.subscribe(() => {
  //     this.passwordValidationErrors = this.validationService.getPasswordMessages(this.registerForm.controls['password']);
  //   });

  //   this.registerForm.controls['role'].statusChanges.subscribe(() => {
  //     this.selectValidationErrors = this.validationService.getSelectMessages(this.registerForm.controls['role']);      
  //   });
  // }


  closeModal() {
    this.registerForm.reset();
    this.modalChanged.emit();
    this.cdRef.detectChanges();
    // console.log(this.modalChanged);
  }

  onSubmit(): void {
    this.isSubmitted = true;


    if (this.registerForm.valid) {
      let user = this.registerForm.value;
      let request$: any;

      this.authService.checkEmail(user.email as string)
        .subscribe(emailChecked => {

          if (!emailChecked) {
            this.validEmail = true;

            if (this.mode === 'create') {
              request$ = this.authService.registerUser(user);
            } else if (this.mode === 'edit') {
              const id = this.userData?.id_user;

              if (!user.password) delete user.password;
              request$ = this.authService.updateUser(user, id);
            }
            request$?.subscribe({
              next: () => {
                this.sharedServices.notifyEventChange();
                this.closeModal();
              },
              error: (error: any) => console.error("Error processing the request", error)
            });
          }
        })




    }
  }
}

