import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserTie, faUsers, faSuitcase, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons';
import { DashboardModeService } from '../../core/services/dashboard/dashboard-mode.service';
import { Project } from '../../core/interfaces/project';
import { Customer } from '../../core/interfaces/customer';
import { User } from '../../core/interfaces/user';
import { UsersService } from '../../core/services/users/users.service';
import { CustomersService } from '../../core/services/customers/customers.service';
import { ProjectsService } from '../../core/services/projects/projects.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType } from 'chart.js/auto';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FontAwesomeModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboardMode: 'admin' | 'supervisor' | 'inbound' | 'outbond';
  faUserTie = faUserTie;
  faUsers = faUsers;
  faSuitcase = faSuitcase;
  faArrowTrendUp = faArrowTrendUp;
  faArrowTrendDown = faArrowTrendDown;

  users: User[] = [];
  projects: Project[] = [];
  customers: Customer[] = [];


  // Charts
  public chart!: Chart;
  public chartProjects!: Chart;
  public chartMonthProjects!: Chart;
  monthsNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  rolesUserData: any;
  userRoles: any;
  projectTypes: any;
  projectData: any;
  startDateProject: any;
  startDataProject: any;


  constructor(private dbService: DashboardModeService, private userService: UsersService, private customerService: CustomersService, private projectService: ProjectsService) {
    this.dashboardMode = this.dbService.getDashboardMode();
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .subscribe({
        next: (res: any) => {
          this.users = res.data;
          this.getTypeUsers(this.users)
        }
      })

    this.customerService.getCustomers()
      .subscribe({
        next: (res: any) => {
          this.customers = res.data;

        }
      })

    this.projectService.getProjects()
      .subscribe({
        next: (res: any) => {
          this.projects = res.data;
          console.log(this.projects);

          this.getStatusProjects(this.projects)
        }
      })
  }

  generateColors(count: number, alpha: number) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const red = (i * 50) % 255;
      const green = (i * 100) % 255;
      const blue = (i * 150) % 255;
      colors.push(`rgb(${red}, ${green}, ${blue}, ${alpha})`);
    }
    return colors;
  }

  getTypeUsers(users: any): void {
    const typeUsers: { [key: string]: number } = {};

    users.forEach((user: any) => {
      if (!typeUsers[user.role]) {
        typeUsers[user.role] = 1;
      }
      typeUsers[user.role]++;
    })

    this.userRoles = Object.keys(typeUsers);
    this.rolesUserData = Object.values(typeUsers);
    this.renderChart();
  }

  getMonths(dateString: string): number {
    const date = new Date(dateString);
    // console.log(dateString);

    const month = date.getMonth() + 1;
    // console.log(month);
    return month
  }

  getStatusProjects(projects: any): void {
    const statusProjects: { [key: string]: number } = {};
    const createdProject: { [key: string]: number } = {};


    projects.forEach((project: any) => {
      if (!statusProjects[project.status]) {
        statusProjects[project.status] = 1;
      }
      statusProjects[project.status]++;

      let month: any = this.getMonths(project.start_date)
      // console.log(month);

      if (!createdProject[month]) {
        createdProject[month] = 0;
      }
      createdProject[month]++
    });

    this.startDateProject = Object.keys(createdProject)
    this.startDataProject = Object.values(createdProject)

    this.projectTypes = Object.keys(statusProjects);
    this.projectData = Object.values(statusProjects);

    this.renderChartProjects();
    this.renderChartMonthProjects();
  }

  renderChartMonthProjects() {
    const color = this.generateColors(this.startDateProject.length, 1);

    new Chart('chartMonthProjects', {
      type: 'bar',
      data: {
        labels: this.monthsNames,
        datasets: [{
          label: 'Projects per Month',
          data: this.startDataProject,
          backgroundColor: color
        }]
      },
      options: {
        responsive: true, // Make the chart responsive
        maintainAspectRatio: false, // Allow custom aspect ratio
        // More options...
      }
    })
  }

  renderChartProjects() {
    const color = this.generateColors(this.projectTypes.length, 0.9);

    new Chart('chartProjects', {
      type: 'bar',
      data: {
        labels: this.projectTypes,
        datasets: [{
          label: 'Projects',
          data: this.projectData,
          backgroundColor: color
        }]
      }
    })
  }

  renderChart() {
    // const color = this.generateColors(this.users.length, 0.9);
    // console.log(this.users);

    new Chart('chart', {
      type: 'doughnut',
      data: {
        labels: this.userRoles,
        datasets: [{
          label: 'Users',
          data: this.rolesUserData,
          backgroundColor: [
            'rgb(132, 225, 188)',
            'rgb(243, 128, 128)',
            'rgb(250, 202, 21)',
            'rgb(229,231,235'
          ]
        }]
      }
    })
  }


}
