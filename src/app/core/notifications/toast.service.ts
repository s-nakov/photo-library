import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

type ToastType = 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, action = 'OK') {
    this.open(message, action, 'success');
  }

  error(message: string, action = 'Dismiss') {
    this.open(message, action, 'error');
  }

  private open(message: string, action: string, type: ToastType) {
    const config: MatSnackBarConfig = {
      duration: type === 'error' ? 5000 : 2500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast', `toast--${type}`],
    };

    this.snackBar.open(message, action, config);
  }
}
