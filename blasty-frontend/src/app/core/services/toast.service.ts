import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  timeout?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastIdCounter = 0;
  private toasts: Toast[] = [];
  private toastSubject = new Subject<Toast[]>();

  constructor() {}

  getToasts() {
    return this.toastSubject.asObservable();
  }

  showToast(
    type: 'success' | 'error' | 'info',
    message: string,
    duration: number = 5000
  ): void {
    const id = ++this.toastIdCounter;
    const toast: Toast = { id, type, message };

    this.toasts.push(toast);
    this.toastSubject.next(this.toasts);

    toast.timeout = setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: number): void {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      clearTimeout(this.toasts[index].timeout);
      this.toasts.splice(index, 1);
      this.toastSubject.next(this.toasts);
    }
  }
}
