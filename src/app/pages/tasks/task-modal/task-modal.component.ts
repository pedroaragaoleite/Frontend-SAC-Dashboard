import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../../../core/interfaces/todo';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../core/interfaces/user';
import { SharedService } from '../../../core/services/shared/shared.service';
import { UsersService } from '../../../core/services/users/users.service';
import { Customer } from '../../../core/interfaces/customer';
import { CustomersService } from '../../../core/services/customers/customers.service';
import { DatePipe } from '@angular/common';
import { TodoService } from '../../../core/services/todo/todo.service';
import { DashboardModeService } from '../../../core/services/dashboard/dashboard-mode.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent implements OnInit {
  @Input() modeDashboard: "admin" | "supervisor" | "inbound" | "outbond";
  @Input() mode: "create" | "edit" = "create";
  @Input() taskData: Todo | null = null;
  @Output() modalChanged: EventEmitter<void> = new EventEmitter();

  // data from api
  users: User[] = [];
  filteredUsers: User[] = [];
  customers: Customer[] = [];
  username: any;
  id: number = 0;

  taskForm: FormGroup;


  constructor(private dbService: DashboardModeService, private datePipe: DatePipe, private cdRef: ChangeDetectorRef, private sharedServices: SharedService, private usersService: UsersService, private fb: FormBuilder, private customerServices: CustomersService, private todoServices: TodoService) {
    this.modeDashboard = this.dbService.getDashboardMode();
    console.log(this.modeDashboard);

    const isDisabled = this.modeDashboard.toLowerCase() === 'inbound' || this.modeDashboard.toLowerCase() === 'outbond';

    this.taskForm = this.fb.group({
      title: [{ value: '', disabled: isDisabled }, [Validators.required]],
      assigned_date: [{ value: '', disabled: isDisabled }, [Validators.required]],
      due_date: [{ value: '', disabled: isDisabled }, [Validators.required]],
      status: ['Status', [Validators.required]],
      priority: [{ value: 'Priority', disabled: isDisabled }, [Validators.required]],
      user_id: [{ value: 'User', disabled: isDisabled }, [Validators.required]],
      customer_id: [{ value: 'Customer', disabled: isDisabled }, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCustomers();


    if (this.mode === 'edit' && this.taskData) {

      this.id = Number(this.taskData.id_todo);

      const assignedDate = this.changeToLocalString(this.taskData.assigned_date as Date);
      const dueDate = this.changeToLocalString(this.taskData.due_date as Date);

      this.taskForm.patchValue({
        title: this.taskData.title,
        assigned_date: assignedDate,
        due_date: dueDate,
        status: this.taskData.status,
        priority: this.taskData.priority,
        user_id: this.taskData.user_id.toString(),
        customer_id: this.taskData.customer_id.toString()
      })
    }

  }

  changeToLocalString(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm') || '';
  }

  getUsers(): void {
    this.usersService.getUsers()
      .subscribe({
        next: (res: any) => {
          this.users = res.data;
          this.filteredUsers = res.data.filter((user: any) => user.role !== 'admin' && user.role !== 'supervisor');
          if (this.mode === 'edit') {
            this.username = res.data.filter((user: any) => user.id_user === this.taskData?.user_id);
            this.username = this.username[0].username;
          }
        }
      })
  }

  getCustomers(): void {
    this.customerServices.getCustomers()
      .subscribe({
        next: (res: any) => {
          this.customers = res.data;
        },
        error: error => {
          console.error("Error getting customers", error)
        }
      })
  }


  onSubmit() {

    if (this.taskForm.valid) {
      const task: Todo = {
        title: this.taskForm.value.title,
        assigned_date: this.taskForm.value.assigned_date as Date,
        due_date: this.taskForm.value.due_date as Date,
        status: this.taskForm.value.status,
        priority: this.taskForm.value.priority,
        user_id: this.taskForm.value.user_id,
        customer_id: this.taskForm.value.customer_id
      }



      const request$ = this.mode === 'create' ?
        this.todoServices.addTodo(task) : this.todoServices.updateTodo(task, this.id);

      request$.subscribe({
        next: () => {
          this.sharedServices.notifyEventChange();
          this.closeModal();
        }
      })
    }
  }


  closeModal() {
    this.taskForm.reset();
    this.modalChanged.emit();
    this.cdRef.detectChanges();
  }
}
