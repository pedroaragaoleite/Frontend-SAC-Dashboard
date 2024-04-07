import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faCalendarXmark } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from '../../core/services/users/users.service';
import { User } from '../../core/interfaces/user';
import { ProjectsService } from '../../core/services/projects/projects.service';
import { Project } from '../../core/interfaces/project';
import { TodoService } from '../../core/services/todo/todo.service';
import { Todo } from '../../core/interfaces/todo';
import { DatePipe, NgStyle } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterLink, FontAwesomeModule, DatePipe, NgStyle],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  // Icons
  faCalendar = faCalendar;
  faCalendarXmark = faCalendarXmark;

  data: any;
  id: any;

  userProfile: any;

  projects: Project[] = [];
  tasks: Todo[] = [];

  constructor(private datePipe: DatePipe, private authService: AuthService, private userServices: UsersService, private projectServices: ProjectsService, private tasksServices: TodoService) {
    this.data = JSON.parse(localStorage.getItem('user') || 'null');
    this.id = this.data.user.id;

  }

  ngOnInit(): void {
    this.getUser();
    this.getProject();
    this.getTasks();
  }

  getUser(): void {
    this.userServices.getUser(this.id)
      .subscribe({
        next: (res: any) => {
          this.userProfile = res.data;
          console.log(this.userProfile);

        },
        error: error => {
          console.error(error);
        }
      })
  }

  getProject(): void {
    this.projectServices.getProjectByUser(this.id)
      .subscribe({
        next: (res: any) => {
          this.projects = res.data.filter((project: any) => project.status === 'active');
          console.log(this.projects);

        },
        error: error => {
          console.error(error);

        }
      })
  }

  getTasks(): void {
    this.tasksServices.getTodoByUser(this.id)
      .subscribe({
        next: (res: any) => {
          this.tasks = res.data;
        },
        error: error => {
          console.error(error);
        }
      })
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

}
