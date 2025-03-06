import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { placeReducer } from './app/store/place/place.reducer'; // Adjust path if needed

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    provideStore({
      places: placeReducer, // Register your feature state
    }),
  ],
}).catch(err => console.error(err));
