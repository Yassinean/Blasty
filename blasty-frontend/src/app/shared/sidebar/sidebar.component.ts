import { Toast } from './../../core/services/toast.service';
import { routes } from './../../app.routes';
import { logout } from './../../store/auth/auth.action';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from '../../core/models/auth.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: [
    `
      .sidebar-container {
        @apply h-screen sticky top-0;
      }
    `,
  ],
})
export class SidebarComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isSidebarCollapsed = false;
  isMobileOpen = false;
  isAdmin = false;
  isClient = false;

  constructor(private authService: AuthService , private router:Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isClient = this.authService.isClient();
  }

  user: User = JSON.parse(localStorage.getItem('user') || '{}');

  isHandset$ = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  openMobileSidebar() {
    this.isMobileOpen = true;
  }

  closeMobileSidebar() {
    this.isMobileOpen = false;
  }

  logout(){
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(["/auth"]);
  }
}