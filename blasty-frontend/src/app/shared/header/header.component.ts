import { Component, HostListener, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          height: '0',
          opacity: 0,
          overflow: 'hidden',
        })
      ),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  @Input() isAdminDashboard: boolean = false;
  
  isMobileMenuOpen = false;
  isScrolled = false;
  isAuthenticated = false;
  isUserMenuOpen = false;
  isDarkMode = false;
  userRole: string = 'CLIENT'; // Default role

  constructor() {}

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated = !!localStorage.getItem('authToken');
    
    // Get user role from localStorage or your auth service
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        this.userRole = parsedInfo.role || 'user';
      } catch (e) {
        console.error('Error parsing user info', e);
      }
    }
    
    // Check dark mode preference
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
  
  toggleMobileSidebar() {
    // This would need to communicate with the sidebar component
    // You could use a service to handle this communication
    const sidebarElement = document.querySelector('app-sidebar') as any;
    if (sidebarElement && sidebarElement.openMobileSidebar) {
      sidebarElement.openMobileSidebar();
    }
  }

  logout() {
    // Remove token from localStorage and update authentication state
    // localStorage.removeItem('authToken');
    // localStorage.removeItem('userInfo');
    localStorage.clear()
    this.isAuthenticated = false;
    
    // Redirect to login page
    window.location.href = '/auth';
  }
}