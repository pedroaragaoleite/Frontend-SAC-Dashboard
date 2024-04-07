import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { guardsGuard } from './core/guards/guards.guard';
import { UsersComponent } from './pages/users/users.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [guardsGuard] },
    { path: 'users', component: UsersComponent, canActivate: [guardsGuard] },
    { path: 'customers', component: CustomersComponent, canActivate: [guardsGuard] },
    { path: 'projects', component: ProjectsComponent, canActivate: [guardsGuard] },
    { path: 'tasks', component: TasksComponent, canActivate: [guardsGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [guardsGuard] },
    { path: '**', redirectTo: '/login' },
];
