import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faCalendarXmark } from '@fortawesome/free-solid-svg-icons';
import { ProjectsService } from '../../core/services/projects/projects.service';
import { Brand, Project } from '../../core/interfaces/project';
import { DatePipe, NgStyle } from '@angular/common';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { DashboardModeService } from '../../core/services/dashboard/dashboard-mode.service';
import { SharedService } from '../../core/services/shared/shared.service';
import { User } from '../../core/interfaces/user';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FontAwesomeModule, DatePipe, NgStyle, ProjectModalComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {

  //Icons
  faCalendar = faCalendar;
  faCalendarXmark = faCalendarXmark;

  //Card menu dropdown
  isVisible: { [key: number]: boolean } = {};

  projects: Project[] = [];
  project: Project | null = null;
  loggedUserProjects: Project[] = [];
  brands: any[] = [];

  dates: Date[] = [];

  dashboardMode: "Admin" | "Supervisor" | "Inbound" | "Outbond";
  modalMode: "create" | "edit" = "create";
  showModal: boolean = false;

  currentUser: any | null;

  constructor(private datePipe: DatePipe, private projectServices: ProjectsService, private dbService: DashboardModeService, private sharedServices: SharedService) {
    this.dashboardMode = this.dbService.getDashboardMode();

  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user') || 'null');

    this.sharedServices.eventRefresh$.subscribe(() => {
      this.getProjects();
    })
    this.getProjects();

    let date: Date = new Date();
    let transformedDate: string = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm') || '';

  }

  toggleMenu(index: number, event: MouseEvent): void {
    event.preventDefault();
    if (this.isVisible[index]) {
      this.isVisible[index] = false;
    } else {
      this.isVisible[index] = true;
    }
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  getColor(data: string): string {
    if (data === 'active') {
      return '#84E1BC';
    } else if (data === 'inactive') {
      return '#FACA15';
    }
    return 'rgb(243 128 128)';
  }

  getProjects(): void {
    this.projectServices.getProjects()
      .subscribe({
        next: (res: any) => {
          this.projects = res.data;
          console.log(this.projects);
          if (this.dashboardMode === 'Admin' || this.dashboardMode === 'Supervisor') {
            this.loggedUserProjects = res.data;
          } else {
            this.loggedUserProjects = res.data.filter((project: any) => project.user_id === this.currentUser!.user!.id_user);
          }
        },
        error: error => {
          console.error("Error fetching projects", error);

        }
      })
  }

  deleteProject(project: Project): void {
    this.projectServices.deleteProject(project)
      .subscribe({
        next: () => {
          this.getProjects();
        },
        error: error => {
          console.error("Error deleting project");
        }
      })
  }

  editProjectModal(project: any) {
    this.modalMode = "edit"
    this.showModal = true;
    this.project = project;
    // console.log(this.project);

  }

  createProjectModal() {
    this.modalMode = "create";
    this.showModal = true;
  }

}
