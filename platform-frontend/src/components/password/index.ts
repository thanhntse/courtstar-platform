import Password from "./password";

export interface PasswordStrengthProps {
  password: string | undefined;
  evaluate: boolean | undefined;
}

export interface PasswordProps {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  onchange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  evaluate?: boolean;
  error?: boolean;
  errorMsg?: string;
}

export default Password;
