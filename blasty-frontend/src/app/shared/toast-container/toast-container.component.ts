import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from '../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css'],
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private toastSubscription: Subscription | undefined;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService
      .getToasts()
      .subscribe((toasts) => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
  }

  removeToast(id: number) {
    this.toastService.removeToast(id);
  }
}
