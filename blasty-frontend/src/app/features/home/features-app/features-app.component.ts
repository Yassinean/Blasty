import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./features-app.component.html'
})
export class FeaturesAppComponent {
  features = [
    {
      icon: 'clock',
      title: 'Réservation rapide',
      description: 'Réservez votre place en quelques secondes, 24h/24 et 7j/7'
    },
    {
      icon: 'map-pin',
      title: 'Localisation facile',
      description: 'Trouvez rapidement les parkings disponibles près de vous'
    },
    {
      icon: 'credit-card',
      title: 'Paiement sécurisé',
      description: 'Transactions sécurisées et multiples options de paiement'
    },
    {
      icon: 'shield',
      title: 'Place garantie',
      description: 'Votre place est réservée et garantie à votre arrivée'
    }
  ];
}
