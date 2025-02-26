import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero/hero.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { PricingComponent } from './pricing/pricing.component';
import {FeaturesAppComponent} from "./features-app/features-app.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesAppComponent,
    HowItWorksComponent,
    PricingComponent
  ],
  template: `
    <main class="min-h-screen p-5 m-2">
      <app-hero />
      <app-features />
      <app-how-it-works />
      <app-pricing />
    </main>
  `
})
export class HomeComponent {}
