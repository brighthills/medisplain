import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() { }
}
