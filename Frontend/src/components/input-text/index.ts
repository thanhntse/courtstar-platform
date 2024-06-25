import InputText from './inputText';

export interface InputTextProps {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  disabled?: boolean;
  type?: 'text' | 'number';
}

export default InputText;
