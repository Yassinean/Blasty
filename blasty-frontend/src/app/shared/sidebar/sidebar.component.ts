import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div 
      class="sidebar-container transition-all duration-300 ease-in-out"
      [class.w-64]="!isSidebarCollapsed"
      [class.w-16]="isSidebarCollapsed"
      [class.hidden]="(isHandset$ | async) && !isMobileOpen"
      [class.absolute]="isHandset$ | async"
      [class.z-40]="isHandset$ | async"
      [class.h-full]="isHandset$ | async"
    >
      <!-- Sidebar -->
      <aside class="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg">
        <!-- Logo -->
        <div class="flex items-center justify-between p-4 border-b">
          <a routerLink="/admin/dashboard" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span *ngIf="!isSidebarCollapsed" class="ml-2 text-xl font-semibold text-gray-800 dark:text-white">ParkSys</span>
          </a>
          <button 
            (click)="toggleSidebar()" 
            class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            [class.hidden]="isHandset$ | async"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path *ngIf="isSidebarCollapsed" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              <path *ngIf="!isSidebarCollapsed" d="M11 5l-7 7 7 7M19 5l-7 7 7 7" />
            </svg>
          </button>
          <button 
            *ngIf="isHandset$ | async" 
            (click)="closeMobileSidebar()" 
            class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4">
          <ul class="space-y-2 px-3">
            <!-- Dashboard -->
            <li>
              <a 
                routerLink="/admin/dashboard" 
                routerLinkActive="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200" 
                [routerLinkActiveOptions]="{exact: true}"
                class="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                <span *ngIf="!isSidebarCollapsed" class="ml-3">Dashboard</span>
              </a>
            </li>
            
            <!-- Statistics -->
            <li>
              <a 
                routerLink="/admin/dashboard/statistics" 
                routerLinkActive="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                class="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3v18h18" />
                  <path d="M18 9l-5 5-4-4-5 5" />
                </svg>
                <span *ngIf="!isSidebarCollapsed" class="ml-3">Statistiques</span>
              </a>
            </li>
            
            <!-- Parking Management -->
            <li>
              <a 
                routerLink="/admin/dashboard/parking-management" 
                routerLinkActive="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                class="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  <path d="M12 4v16" />
                  <path d="M8 8h.01" />
                  <path d="M16 8h.01" />
                  <path d="M8 12h.01" />
                  <path d="M16 12h.01" />
                  <path d="M8 16h.01" />
                  <path d="M16 16h.01" />
                </svg>
                <span *ngIf="!isSidebarCollapsed" class="ml-3">Gestion des Parkings</span>
              </a>
            </li>
            
            <!-- Place Management -->
            <li>
              <a 
                routerLink="/admin/dashboard/place-management" 
                routerLinkActive="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200"
                class="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 9h16" />
                  <path d="M4 15h16" />
                  <path d="M10 3v18" />
                  <path d="M14 3v18" />
                </svg>
                <span *ngIf="!isSidebarCollapsed" class="ml-3">Gestion des Places</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <!-- User Profile -->
        <div class="p-4 border-t">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <span>A</span>
            </div>
            <div *ngIf="!isSidebarCollapsed" class="ml-3">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">admin@parksys.com</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
    
    <!-- Overlay for mobile -->
    <div 
      *ngIf="(isHandset$ | async) && isMobileOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30"
      (click)="closeMobileSidebar()"
    ></div>
  `,
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