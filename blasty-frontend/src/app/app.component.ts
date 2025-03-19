import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from "./shared/footer/footer.component";
import { ToastContainerComponent } from "./shared/toast-container/toast-container.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FooterComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'blasty';
}
