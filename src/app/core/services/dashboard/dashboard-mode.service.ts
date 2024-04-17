import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardModeService {

  user: any;

  getDashboardMode(): "Admin" | "Supervisor" | "Inbound" | "Outbound" {
    const user = localStorage.getItem('user');
    if (user) {
      // console.log(user);

      const userInfo = JSON.parse(user);
      return userInfo.user.role;
    }
    return "Supervisor"
  }

  constructor() { }
}
