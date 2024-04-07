import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../interfaces/customer';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true,
};

const url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer> {
    return this.http.get<Customer>(`${url}/customers`, httpOptions);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${url}/customers/register`, customer, httpOptions);
  }

  updateCustomer(customer: Customer, id: any): Observable<Customer> {
    console.log(customer, id);

    return this.http.put<Customer>(`${url}/customers/${id}`, customer, httpOptions)
  }

  deleteCustomer(customer: any): Observable<any> {
    const id = customer.id_customer;
    return this.http.delete<any>(`${url}/customers/delete/${id}`, httpOptions);
  }
}
