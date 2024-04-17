import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DashboardModeService } from '../../../core/services/dashboard/dashboard-mode.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { initFlowbite } from 'flowbite';
import { SharedService } from '../../../core/services/shared/shared.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  dashboardMode: "Admin" | "Supervisor" | "Inbound" | "Outbound";

  faInbox = faInbox;
  data: any;
  name: any;

  constructor(private sharedServices: SharedService, private router: Router, private authService: AuthService, private dbService: DashboardModeService) {
    this.dashboardMode = this.dbService.getDashboardMode();
    this.data = JSON.parse(localStorage.getItem('user') || 'null');
    this.name = this.data.user.name;
  }

  ngOnInit(): void {
    initFlowbite();
  }

  signOut(): void {
    this.authService.logOut();
  }
}