import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>
      
      <!-- Main Content -->
      <div class="flex flex-col flex-1 overflow-hidden">
        <app-header></app-header>
        
        <main class="flex-1 overflow-y-auto p-4 md:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class DashboardComponentClient {}