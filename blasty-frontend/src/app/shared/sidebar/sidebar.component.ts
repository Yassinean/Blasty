import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: [`
    .sidebar-container {
      @apply h-screen sticky top-0;
    }
  `]
})
export class SidebarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  
  isSidebarCollapsed = false;
  isMobileOpen = false;

  user:User = JSON.parse(localStorage.getItem('user') || '{}');
  
  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );
  
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  
  openMobileSidebar() {
    this.isMobileOpen = true;
  }
  
  closeMobileSidebar() {
    this.isMobileOpen = false;
  }
}