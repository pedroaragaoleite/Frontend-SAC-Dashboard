import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  faInbox = faInbox;
  data: any;
  name: any;

  constructor(private authService: AuthService) {
    this.data = JSON.parse(localStorage.getItem('user') || 'null');
    this.name = this.data.user.name;

  }

  ngOnInit(): void {
    initFlowbite();
  }

  signOut(): void {
    this.authService.logOut()
  }
}
