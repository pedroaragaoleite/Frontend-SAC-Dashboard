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

  dashboardMode: "Admin" | "Supervisor" | "Inbound" | "Outbound";
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

  getColor(start_date: Date, end_date: Date) {       
    const dateNow = new Date();
    
    let startDateString = this.datePipe.transform(start_date, 'yyyy-MM-ddTHH:mm')
    let endDateString = this.datePipe.transform(end_date, 'yyyy-MM-ddTHH:mm')
    let currentDateString = this.datePipe.transform(dateNow, 'yyyy-MM-ddTHH:mm');
    
    
    let startDate = startDateString ? new Date(startDateString) : null;
    let endDate = endDateString ? new Date(endDateString) : null;
    let currentDate = currentDateString ? new Date(currentDateString) : null;  
    
    if(endDate && currentDate) {
      const months = (endDate.getFullYear() - currentDate.getFullYear()) * 12 + (endDate.getMonth() - currentDate.getMonth())
      if (endDate! > currentDate!) {
        if(months < 3 )
        return '#84E1BC';
      } 
      if (months >= 3) {
        return '#FACA15';
      }      
    }
    return '#F38080';    
  }

  projectSortDate(data: any): void {
    this.projects = data.sort((a:any, b: any) => {
      const dateA: any = new Date(a.start_date)
      const dateB: any = new Date(b.start_date)

      return dateB - dateA
    });
  }

  getProjects(): void {
    this.projectServices.getProjects()
      .subscribe({
        next: (res: any) => {
            this.projectSortDate(res.data);         
          
          if (this.dashboardMode === 'Admin' || this.dashboardMode === 'Supervisor') {
            this.loggedUserProjects = this.projects;
          } else {
            this.loggedUserProjects = this.projects.filter((project: any) => project.user_id === this.currentUser!.user!.id_user);
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
