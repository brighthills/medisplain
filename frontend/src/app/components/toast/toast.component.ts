import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastType } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  message: string | null = null;
  type: ToastType = 'success';

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.message$.subscribe((toast) => {
      if (toast) {
        this.message = toast.message;
        this.type = toast.type;
      } else {
        this.message = null;
      }
    });
  }
}
