import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pricing.component.html'
})
export class PricingComponent {
  plans = [
    {
      name: 'Handicap',
      price: '1.5MAD',
      features: [
        'Place Handicap',
        'Réservation simple',
        'Paiement sécurisé'
      ],
      recommended: false
    },
    {
      name: 'Standard',
      price: '5MAD',
      features: [
        'Place Standard',
        'Proche des entrées',
        'Borne de recharge',
        'Service voiturier'
      ],
      recommended: true
    },
    {
      name: 'VIP',
      price: '10MAD',
      features: [
        'Place réservée',
        'Accès prioritaire',
        'Service de lavage',
        'Support 24/7'
      ],
      recommended: false
    }
  ];
}
