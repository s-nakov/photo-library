import { ToastService } from '../../core/notifications/toast.service';

export interface ToastServiceMock {
  service: Pick<ToastService, 'success' | 'error'>;
  successMessages: string[];
  errorMessages: string[];
}

export const createToastServiceMock = (): ToastServiceMock => {
  const successMessages: string[] = [];
  const errorMessages: string[] = [];

  const service = {
    success: (message: string) => {
      successMessages.push(message);
    },
    error: (message: string) => {
      errorMessages.push(message);
    }
  };

  return {
    service,
    successMessages,
    errorMessages
  };
};
