import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { EMPTY, Subscription, catchError, map, of, switchMap } from 'rxjs';
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
  validEmail: boolean = true;
  roles: any[] = [];

  successCreateUser: boolean = false;


  registerForm: FormGroup;

  private emailChange?: Subscription;

  constructor(private validationService: FormValidationsService, private cdRef: ChangeDetectorRef, private sharedServices: SharedService, private usersService: UsersService, private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.minLength(3), userValidation()]],
      email: ['', [Validators.required, Validators.email, emailValidator()]],
      role: ['Choose a role', [Validators.required, selectValidator()]]
    });

    this.emailChange = this.registerForm.get('email')?.valueChanges.subscribe((value) => {
      this.validEmail = true;
    })

  }

  ngOnInit(): void {
    this.formBasedOnMode();
    this.getRoles();
  }

  ngOnDestroy() {
    this.emailChange?.unsubscribe();
  }

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

  closeToast(): void {
    this.successCreateUser = !this.successCreateUser;
  }

  closeModal() {
    this.registerForm.reset();
    this.modalChanged.emit();
    this.cdRef.detectChanges();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      const user = this.registerForm.value;
      this.validEmail = true;
      const id = this.userData?.id_user;
      const request$ = this.mode === 'create' ?
        this.authService.registerUser(user) : this.authService.updateUser(user, id)


      request$?.subscribe({
        next: () => {
          this.sharedServices.notifyEventChange();
          this.successCreateUser = true;
          setInterval(() => {
            this.closeModal();
          }, 1000)  
          
        },
        error: (error: any) => {
          console.error("Error processing the request", error);
          this.validEmail = false;
        }
      });

    }


  }
}

