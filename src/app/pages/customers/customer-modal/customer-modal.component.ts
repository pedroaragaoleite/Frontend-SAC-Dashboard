import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared/shared.service';

import { Customer } from '../../../core/interfaces/customer';
import { CustomersService } from '../../../core/services/customers/customers.service';



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

  constructor(private cdRef: ChangeDetectorRef, private sharedServices: SharedService, private customerServices: CustomersService, private router: Router, private fb: FormBuilder) { }

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

  customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required, Validators.minLength(3)]],
    postal_code: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^[0-9]{5}(-[0-9]{4})?$')]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9+\-\s]*$'), Validators.minLength(9), Validators.maxLength(15)]],
  });

  closeModal() {
    this.customerForm.reset();
    this.modalChanged.emit();
    this.cdRef.detectChanges();
  }

  onSubmit() {
    this.isSubmitted = true;
    console.log(this.customerForm.valid);

    if (this.customerForm.valid) {
      const customer: Customer = {
        name: this.customerForm.value.name!,
        email: this.customerForm.value.email!,
        address: this.customerForm.value.address!,
        city: this.customerForm.value.city!,
        postal_code: Number(this.customerForm.value.postal_code!),
        phone: Number(this.customerForm.value.phone!)
      }
      const id = this.customerData?.id_customer;

      const request$ = this.mode === 'create' ?
        this.customerServices.addCustomer(customer) : this.customerServices.updateCustomer(customer, id);

      request$.subscribe({
        next: () => {
          this.sharedServices.notifyEventChange();
          this.closeModal();
        }
      })
    }
  }
}
