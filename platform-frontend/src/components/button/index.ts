import Button from "./button";

export interface ButtonProps {
  type?: "submit" | "reset" | "button";
  label?: string;
  size?: 'small' | 'medium' | 'large' | 'mini';
  fullWidth?: boolean;
  fullRounded?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconClass?: string;
  loading?: boolean;
  loadingColor?: string;
  disabled?: boolean;
  onClick?: () => void;
  loadingHeight?: string;
  loadingWidth?: string;
}

export default Button;
