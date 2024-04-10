import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faFolderOpen, faTag, faEye, faPenSquare } from '@fortawesome/free-solid-svg-icons';
import { TodoService } from '../../core/services/todo/todo.service';
import { Todo } from '../../core/interfaces/todo';
import { DatePipe, NgStyle } from '@angular/common';
import { User } from '../../core/interfaces/user';
import { UsersService } from '../../core/services/users/users.service';
import { DashboardModeService } from '../../core/services/dashboard/dashboard-mode.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin, map, tap } from 'rxjs';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { SharedService } from '../../core/services/shared/shared.service';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FontAwesomeModule, DatePipe, NgStyle, ReactiveFormsModule, TaskModalComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  // Icons
  faEnvelope = faEnvelope;
  faFolderOpen = faFolderOpen;
  faTag = faTag;
  faEye = faEye;
  faPenSquare = faPenSquare;

  //Dashboard config
  dashboardMode: "admin" | "supervisor" | "inbound" | "outbond";
  //Search config
  allTasks: Todo[] = [];
  actionTasks: Todo[] = [];
  searchControl = new FormControl('');


  // Select config
  selectControl = new FormControl('Status');
  filterTasks: Todo[] = [];

  // modal config
  showModal: boolean = false;
  taskModalMode: "create" | "edit" = "create";
  task: Todo | null = null;

  tasks: Todo[] = [];
  importantTasks: Todo[] = [];
  newTasks: Todo[] = [];
  selectTasks: Todo[] = [];

  loggedUserTasks: Todo[] = [];




  constructor(private cdRef: ChangeDetectorRef, private sharedServices: SharedService, private dbService: DashboardModeService, private todoService: TodoService, private userServices: UsersService) {
    this.dashboardMode = this.dbService.getDashboardMode();

    console.log(this.dashboardMode);

    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const searchValue = value;
        console.log(searchValue);


        if (value === '') {
          this.getTasks();
        }

        const findTasks = this.allTasks.filter(task => task.title?.toLowerCase().includes(searchValue!.toLowerCase()));
        this.filterTasks = findTasks;

      });
  }

  ngOnInit(): void {
    this.sharedServices.eventRefresh$.subscribe(() => {
      this.getTasks();
    })
    this.getTasks();
    this.selectStatus();
  }

  selectStatus() {
    this.selectControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value === 'Status') {
          this.getTasks();
        } else {
          this.filterTasks = this.tasks.filter(task => task.status?.toLowerCase().includes(value!.toLowerCase()));
        }

      })
  }

  getTasks() {
    this.todoService.getTodos()
      .pipe(
        map((res: any) => ({
          tasks: res.data,

          filterTasks: res.data,
          allTasks: res.data,
          importantTasks: res.data.filter((task: any) => task.priority === 'high'),
          newTasks: res.data.filter((task: any) => task.status === 'new'),
          loggedUsersTasks: res.data.filter((task: any) => task.users[0].username === this.dashboardMode)
        }))
      )
      .subscribe(({ tasks, filterTasks, importantTasks, newTasks, allTasks, loggedUsersTasks }) => {
        this.tasks = tasks;
        console.log(this.tasks);

        this.filterTasks = filterTasks;
        this.allTasks = allTasks;
        this.importantTasks = importantTasks;
        this.newTasks = newTasks;
        this.loggedUserTasks = loggedUsersTasks;

        console.log(this.loggedUserTasks);


      });
  }

  getColor(data: string): string {
    if (data === 'low' || data === 'completed') {
      return '#60af7d';
    } else if (data === 'medium' || data === 'pending') {
      return '#eab900';
    } else if (data === 'in progress') {
      return '#4c75cf'
    }
    return 'rgb(243 128 128)';
  }

  getBgColor(data: string): string {
    if (data === 'low') {
      return 'rgba(134,239,172, .4)';
    } else if (data === 'medium') {
      return 'rgba(250,202,21, .2)';
    }
    return 'rgba(239,68,68,.2)';
  }



  toggleModal() {
    this.showModal = !this.showModal;
  }

  editTaskModal(task: Todo) {
    this.taskModalMode = 'edit';
    this.showModal = true;
    this.task = task;
  }


  createTaskModal() {
    this.taskModalMode = "create";
    this.showModal = true;
  }

  viewTaskModal(task: Todo) {
    console.log(task);
  }

  toggleChecked(task: Todo, event: any): void {

    if (event.target.checked) {
      if (!this.selectTasks.find(t => t.id_todo === task.id_todo)) {
        this.selectTasks.push(task);
        console.log(this.selectTasks);

      }
    } else {
      this.selectTasks = this.selectTasks.filter(t => t.id_todo !== task.id_todo)
    }
    console.log(this.selectTasks);

  }

  deleteTask(): void {

    forkJoin(this.selectTasks.map((task: any) => this.todoService.deleteTodo(task)))
      .subscribe({
        next: () => {
          console.log('Task deleted');
          this.getTasks();
          this.selectTasks = [];
        },
        error: error => {
          console.error("Error making the delete", error);

        }
      })
  }
}

