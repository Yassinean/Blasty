import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-parking-page',
  template: `
    <h2>Gestion des Parkings</h2>
    <a routerLink="/parkings">Liste des parkings</a>
    <a routerLink="/parkings-details">details-parking</a>
    <a routerLink="/parkings">Liste des parkings</a>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class ParkingPageComponent {}
