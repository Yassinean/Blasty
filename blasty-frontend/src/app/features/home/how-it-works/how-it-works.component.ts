import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.component.html'
})
export class HowItWorksComponent {
  steps = [
    {
      title: 'Choisissez votre parking',
      description: 'Sélectionnez le parking qui vous convient en fonction de votre destination'
    },
    {
      title: 'Réservez votre place',
      description: 'Sélectionnez la durée de stationnement et confirmez votre réservation'
    },
    {
      title: 'Garez-vous sereinement',
      description: 'Présentez-vous au parking à l\'heure prévue et profitez de votre place réservée'
    }
  ];
}
