import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingSpinnerComponent {
  isLoading$ = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService) {}
}
