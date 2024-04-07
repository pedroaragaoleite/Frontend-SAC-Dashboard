import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardModeService {
  
  user: any;

  getDashboardMode(): "admin" | "supervisor" | "inbound" | "outbond" {
    const user = localStorage.getItem('user');
    if(user) {
      const userInfo = JSON.parse(user);
      return userInfo.user.role;
    }
    return "supervisor"
  }

  constructor() { }
}
