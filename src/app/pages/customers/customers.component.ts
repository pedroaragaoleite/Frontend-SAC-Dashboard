import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { DashboardModeService } from '../../core/services/dashboard/dashboard-mode.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Customer } from '../../core/interfaces/customer';
import { CustomersService } from '../../core/services/customers/customers.service';
import { CustomerModalComponent } from './customer-modal/customer-modal.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SharedService } from '../../core/services/shared/shared.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { ViewCustomerComponent } from './view-customer/view-customer.component';
import { TodoService } from '../../core/services/todo/todo.service';
import { Todo } from '../../core/interfaces/todo';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [FontAwesomeModule, HeaderComponent, SidebarComponent, ReactiveFormsModule, CustomerModalComponent, ViewCustomerComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  // Icons
  faEye = faEye;
  faPenSquare = faPenSquare;

  // data from API
  customers: Customer[] = [];
  tasks: Todo[] = [];

  //Dashboard config
  dashboardMode: "admin" | "supervisor" | "inbound" | "outbond";

  //Search config
  allCustomers: Customer[] = [];
  actionCustomers: Customer[] = [];
  searchControl = new FormControl('');

  // Modal config
  customerModalMode: "create" | "edit" = "create";
  showModal: boolean = false;
  customer: Customer | null = null;

  showCustomer: boolean = false;

  showErrorDel: boolean = false;


  constructor(private http: HttpClient, private todoServices: TodoService, private sharedServices: SharedService, private dbService: DashboardModeService, private customerServices: CustomersService) {
    this.dashboardMode = this.dbService.getDashboardMode();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const searchValue = value;

        if (value === '') {
          this.getCustomers();
        }
        const findCustomers = this.allCustomers.filter(customer => customer.name?.toLowerCase().includes(searchValue!.toLowerCase()));
        this.customers = findCustomers;
      });
  }

  ngOnInit(): void {
    this.sharedServices.eventRefresh$.subscribe(() => {
      this.getCustomers();
    });
    this.getCustomers();
    this.getTasks();
  }

  getCustomers(): void {
    this.customerServices.getCustomers()
      .subscribe({
        next: (res: any) => {
          this.customers = res.data;
          this.allCustomers = [...this.customers];
          console.log(res);

        },
        error: error => {
          console.error("Error getting customers", error)
        }
      })
  }

  getTasks(): void {
    this.todoServices.getTodos()
      .subscribe({
        next: (res: any) => {
          this.tasks = res.data;
        }
      })
  }

  createCustomerModal() {
    this.customerModalMode = "create";
    this.showModal = true;
  }

  editCustomerModal(customer: Customer) {
    this.customerModalMode = "edit";
    this.showModal = true;
    this.customer = customer;
  }

  delCustomer() {
    this.actionCustomers.forEach(customer => {
      const checkUserTasks = this.tasks.filter((task: any) => task.customer_id === customer.id_customer);
      console.log(checkUserTasks);
      if (checkUserTasks.length >= 1) {
        this.showErrorDel = true;
        return;
      }
      this.customerServices.deleteCustomer(customer)
        .subscribe({
          next: () => {
            this.getCustomers();
            this.actionCustomers = [];
          },
          error: error => {
            console.error("Error deleting customer", error);
          }
        })
    })
  }

  closeToast(): void {
    this.showErrorDel = !this.showErrorDel;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }
  toggleModalCustomer() {
    this.showCustomer = !this.showCustomer;
  }

  toggleChecked(customer: Customer, event: any): void {
    // this.checkedUsers[index] = event.target.checked;

    if (event.target.checked) {
      if (!this.actionCustomers.find(c => c.id_customer === customer.id_customer)) {
        this.actionCustomers.push(customer)
      }
    } else {
      this.actionCustomers = this.actionCustomers.filter(c => c.id_customer !== customer.id_customer)
    }
    console.log(this.actionCustomers);

  }

  viewCustomerModal(customer: Customer): void {
    this.showCustomer = true;
    this.customer = customer;
  }


}
