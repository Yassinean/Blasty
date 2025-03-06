import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ParkingManagementComponent } from './parking-management/parking-management.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PlaceManagementComponent } from './place-management/place-management.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {}
