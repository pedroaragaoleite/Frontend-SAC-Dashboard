import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared/shared.service';
import { emailValidator, phoneValidator, postalCodeValidator, selectValidator, userValidation } from '../../../validators/customValidator';
import { Customer } from '../../../core/interfaces/customer';
import { CustomersService } from '../../../core/services/customers/customers.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-customer-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './customer-modal.component.html',
  styleUrl: './customer-modal.component.scss'
})
export class CustomerModalComponent implements OnInit {
  @Input() mode: "create" | "edit" = "create";
  @Input() customerData: Customer | null = null;
  @Output() modalChanged: EventEmitter<void> = new EventEmitter();

  isSubmitted: boolean = false;
  validEmail: boolean = false;

  private emailChange?: Subscription;

  constructor(private cdRef: ChangeDetectorRef, private sharedServices: SharedService, private customerServices: CustomersService, private router: Router, private fb: FormBuilder) {
    this.emailChange = this.customerForm.get('email')?.valueChanges.subscribe((value) => {
      this.validEmail = true;
    })

  }

  ngOnInit(): void {
    if (this.mode === "edit" && this.customerData) {
      console.log(this.customerData);
      this.customerForm.patchValue({
        name: this.customerData.name,
        email: this.customerData.email,
        address: this.customerData.address,
        city: this.customerData.city,
        postal_code: this.customerData.postal_code.toString(),
        phone: this.customerData.phone.toString()
      })

    }
  }

  ngOnDestroy() {
    this.emailChange?.unsubscribe();
  }

  customerForm = this.fb.group({
    name: ['', [Validators.minLength(3), userValidation()]],
    email: ['', [Validators.email, emailValidator()]],
    address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    city: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    postal_code: ['', [postalCodeValidator()]],
    phone: ['', [phoneValidator()]],
  });

  closeModal() {
    this.customerForm.reset();
    this.modalChanged.emit();
    this.cdRef.detectChanges();
  }

  onSubmit() {
    this.isSubmitted = true;

    if (!this.customerForm.valid) {
      return console.log("Customer form not valid");
    }

    if (this.customerForm.valid) {
      const customer: Customer = {
        name: this.customerForm.value.name!,
        email: this.customerForm.value.email!,
        address: this.customerForm.value.address!,
        city: this.customerForm.value.city!,
        postal_code: this.customerForm.value.postal_code!,
        phone: Number(this.customerForm.value.phone!)
      }
      const id = this.customerData?.id_customer;

      const request$ = this.mode === 'create' ?
        this.customerServices.addCustomer(customer) : this.customerServices.updateCustomer(customer, id);

      request$.subscribe({
        next: () => {
          this.sharedServices.notifyEventChange();
          this.closeModal();
        },
        error: error => {
          console.log("Customer already registered");
        }
      })
    }
  }
}
