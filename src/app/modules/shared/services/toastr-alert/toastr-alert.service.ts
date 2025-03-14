import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrAlertService {
  private toastr = inject(ToastrService)

  constructor() { }

  showError(title: string, message: string) {
    this.toastr.error(message, title, {
      timeOut: 1000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }

  showSucces(title: string, message: string) {
    this.toastr.success(message, title, {
      timeOut: 1000,
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    });
  }
  
}
