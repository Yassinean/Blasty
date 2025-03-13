import { Injectable } from "@angular/core"
import { Subject } from "rxjs"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: number
  title: string
  message: string
  type: ToastType
  autoClose: boolean
  timeout?: number
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toasts: Toast[] = []
  private toastCounter = 0
  private toastsSubject = new Subject<Toast[]>()

  toasts$ = this.toastsSubject.asObservable()

  constructor() {}

  private show(title:string, message: string, type: ToastType, autoClose = true, timeout = 5000): Toast {
    const id = ++this.toastCounter
    const toast: Toast = { id, title , message, type, autoClose, timeout }

    this.toasts.push(toast)
    this.toastsSubject.next([...this.toasts])

    if (autoClose) {
      setTimeout(() => this.remove(id), timeout)
    }

    return toast
  }

  showSuccess(title:string,message: string): Toast {
    return this.show(title,message, "success")
  }

  showError(title: string, message: string): Toast {
    return this.show(title, message, "error")
  }

  showWarning(title: string, message: string): Toast {
    return this.show(title, message, "warning")
  }

  showInfo(title: string, message: string): Toast {
    return this.show(title, message, "info")
  }

  remove(id: number): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id)
    this.toastsSubject.next([...this.toasts])
  }

  clear(): void {
    this.toasts = []
    this.toastsSubject.next([])
  }
}

