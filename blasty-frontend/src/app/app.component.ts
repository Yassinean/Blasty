import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./shared/header/header.component";
import {FooterComponent} from "./shared/footer/footer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'blasty';
}
