// src/app/core/components/footer/footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-800 text-white py-4">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2023 Blasty Parking Management. All rights reserved.</p>
      </div>
    </footer>
  `
})
export class FooterComponent { }
