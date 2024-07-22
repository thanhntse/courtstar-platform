import showAlert from './confirm-alert';

export interface ConfirmOptions {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  onConfirmClick: () => void;
}

export default showAlert;
