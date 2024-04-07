import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DashboardModeService } from '../../../core/services/dashboard/dashboard-mode.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  dashboardMode: "admin" | "supervisor" | "inbound" | "outbond";

  constructor(private router: Router, private authService: AuthService, private dbService: DashboardModeService) {
    this.dashboardMode = this.dbService.getDashboardMode();
   }

  ngOnInit(): void {

  }

  signOut(): void {
    this.authService.logOut()
  }
}