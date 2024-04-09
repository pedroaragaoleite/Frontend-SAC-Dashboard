import { Component, Input, OnInit } from '@angular/core';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { DashboardModeService } from '../../core/services/dashboard/dashboard-mode.service';
import { User } from '../../core/interfaces/user';
import { UsersService } from '../../core/services/users/users.service';
import { UserModalComponent } from './user-modal/user-modal.component';
import { SharedService } from '../../core/services/shared/shared.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { TodoService } from '../../core/services/todo/todo.service';
import { Todo } from '../../core/interfaces/todo';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, UserModalComponent, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  faEye = faEye;
  faPenSquare = faPenSquare;

  dashboardMode: "admin" | "supervisor" | "inbound" | "outbond";
  modalMode: "create" | "edit" = "create";

  showModal: boolean = false;

  showErrorDel: boolean = false;

  users: User[] = [];
  user: User | null = null;
  allUsers: User[] = [];
  actionUsers: User[] = [];
  searchControl = new FormControl('');
  tasks: Todo[] = [];


  constructor(private todoServices: TodoService, private dbService: DashboardModeService, private usersService: UsersService, private sharedServices: SharedService, private authServices: AuthService) {
    this.dashboardMode = this.dbService.getDashboardMode();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const searchValue = value;

        if (value === '') {
          this.getUsers();
        }
        const findUsers = this.allUsers.filter(user => user.username?.toLowerCase().includes(searchValue!.toLowerCase()))
        this.users = findUsers;
      });
  }

  ngOnInit(): void {
    this.sharedServices.eventRefresh$.subscribe(() => {
      this.getUsers();
    })
    this.getUsers();
    this.getTasks();
  }

  getUsers(): void {
    this.usersService.getUsers()
      .subscribe({
        next: (res: any) => {
          this.users = res.data;
          this.allUsers = [...this.users];
          
        }
      })
  }

  getTasks(): void {
    this.todoServices.getTodos()
      .subscribe({
        next: (res: any) => {
          this.tasks = res.data;
        },
        error: error => {
          console.error(error);

        }
      })
  }

  closeToast(): void {
    this.showErrorDel = !this.showErrorDel;
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  createUserModal() {
    this.modalMode = "create";
    this.showModal = true;
  }

  editUserModal(user: User) {
    this.modalMode = "edit";
    this.showModal = true;
    this.user = user;
    console.log(user);
  }

  toggleChecked(user: User, event: any): void {

    if (event.target.checked) {
      if (!this.actionUsers.find(u => u.id_user === user.id_user)) {
        this.actionUsers.push(user);
      }
    } else {
      this.actionUsers = this.actionUsers.filter(u => u.id_user !== user.id_user)
    }
    console.log(this.actionUsers);
  }

  delUser(): void {
    const deletableUsers = this.actionUsers.filter(user => {
      const checkUserTasks = this.tasks.filter((task: any) => task.user_id === user.id_user);

      if (checkUserTasks.length > 0) {
        console.log(`User ${user.id_user} has tasks and can't be deleted.`);
        this.showErrorDel = true;
        return false;;
      }
      return true;
    });

    if (deletableUsers.length === 0) {
      return;
    }

    //Uso de forkJoin para Procesos Paralelos: Si necesitas eliminar varios usuarios y esperar hasta que todos sean eliminados antes de realizar alguna acción (como recargar la lista de usuarios), forkJoin es una buena opción.
    forkJoin(deletableUsers.map(user => this.authServices.deleteUser(user)))
      .subscribe({
        next: () => {
          console.log("User deleted.");
          this.getUsers();
          this.actionUsers = [];
        },
        error: error => {
          console.error("Error making the delete", error)
        }
      })

  }
}
