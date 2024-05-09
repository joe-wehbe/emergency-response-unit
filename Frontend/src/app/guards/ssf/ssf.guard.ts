import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class SsfGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.userService.isSSF()) {
      return true;
    } else {
      this.router.navigate(['/tabs/report-emergency']);
      return false;
    }
  }
}
