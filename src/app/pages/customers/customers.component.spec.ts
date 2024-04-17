import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';

import { CustomersComponent } from './customers.component';
import { CustomersService } from '../../core/services/customers/customers.service'; // Replace path if necessary
import { Customer } from '../../core/interfaces/customer'; // Replace path if necessary
import { of, throwError } from 'rxjs';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let customerService: CustomersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CustomersComponent],
      providers: [CustomersService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomersService);
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should get customers on init', (done) => {
    const mockCustomers: Customer[] = [
      { id_customer: 1, name: 'John Doe', email: 'john.doe@example.com', address: "calle barcelona", city: "barcelona", postal_code: "83000", phone: 666666666 },
      { id_customer: 2, name: 'Jane Doe', email: 'jane.doe@example.com', address: "calle barcelona", city: "barcelona", postal_code: "83000", phone: 666666666 },
    ];

    spyOn(customerService, 'getCustomers').and.returnValue(of(mockCustomers));

    component.getCustomers();

    expect(component.customers).toEqual(mockCustomers);

    setTimeout(() => {
      done();  // Signal test completion
    }, 1000);
  });

  it('should handle error on getCustomers', () => {
    const errorResponse = new Error('Error getting customers');

    spyOn(customerService, 'getCustomers').and.returnValue(throwError(errorResponse));

    component.getCustomers();

    expect(console.error).toHaveBeenCalledWith('Error getting customers', errorResponse);
  });
});
