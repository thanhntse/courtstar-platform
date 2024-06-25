import Password from "./password";

export interface PasswordStrengthProps {
  password: string;
  evaluate: boolean;
}

export interface PasswordProps {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  onchange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  evaluate?: boolean;
}

export default Password;
