import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { CustomersService } from './customers.service';
import { Customer } from '../../interfaces/customer';

describe('CustomersService', () => {
  let service: CustomersService;
  let httpMock: HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomersService]
    });
    service = TestBed.inject(CustomersService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable of User on getUsers success', (done) => {
    const mockCustomers: Customer[] = [
      { id_customer: 1, name: 'John Doe', email: 'john.doe@example.com', address: "Calle Barcelona n36",
        city: "Barcelona", postal_code: 43580, phone: 666666666}
    ]
    
    service.getCustomers().subscribe(customers => {
      expect(customers).toEqual(mockCustomers);
      done();
    });
  
    const req = httpMock.expectOne(`http://localhost:3000/api/customers`); // Adjust this URL to match your getUsers() endpoint
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });  
});
