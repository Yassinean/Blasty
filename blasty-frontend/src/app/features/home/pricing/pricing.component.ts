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
      name: 'Standard',
      price: '2€',
      features: [
        'Place standard',
        'Réservation simple',
        'Paiement sécurisé'
      ],
      recommended: false
    },
    {
      name: 'Premium',
      price: '3€',
      features: [
        'Place premium',
        'Proche des entrées',
        'Borne de recharge',
        'Service voiturier'
      ],
      recommended: true
    },
    {
      name: 'Business',
      price: '4€',
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
