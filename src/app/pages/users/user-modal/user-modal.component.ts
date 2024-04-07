import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../core/interfaces/user';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UsersService } from '../../../core/services/users/users.service';
import { map } from 'rxjs';
import { SharedService } from '../../../core/services/shared/shared.service';

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
  roles: any[] = [];

  registerForm: FormGroup;

  constructor(private cdRef: ChangeDetectorRef, private sharedServices: SharedService, private usersService: UsersService, private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.min(3)]],
      email: ['', [Validators.email]],
      role: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.formBasedOnMode();
    this.getRoles();
  }

  formBasedOnMode() {
    if (this.mode === 'edit' && this.userData) {
      this.registerForm.patchValue({
        username: this.userData.username,
        email: this.userData.email,
        role: this.userData.role
      });
    } else if (this.mode === 'create') {
      this.registerForm.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(8)]));
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
      let request$;

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
        error: error => console.error("Error processing the request", error)
      });
    }
  }
}

