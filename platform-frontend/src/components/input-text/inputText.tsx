import React, { useEffect, useState } from 'react';
import { InputTextProps } from './index';

const InputText: React.FC<InputTextProps> = ({
  id,
  label,
  name,
  placeholder,
  onchange,
  value,
  disabled,
  type = 'text',
  error,
  errorMsg,
}) => {
  const [formattedValue, setFormattedValue] = useState(value);

  useEffect(() => {
    setFormattedValue(value);
  }, [value])

  const formatNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let formattedValue = value;

    if (type === 'number') {
      const numericValue = value.replace(/[^0-9]/g, '');

      formattedValue = formatNumber(numericValue);
    }
    await new Promise<void>((resolve) => {
      setFormattedValue(formattedValue);
      resolve();
    });

    onchange(event);
  };

  return (
    <div className="w-full flex flex-col font-medium gap-2 text-gray-800">
      <label
        htmlFor={id}
        className='font-semibold'
      >
        {label}
      </label>
      <input
        type={type === 'number' ? 'text' : type}
        name={name}
        id={id}
        className={`w-full py-2.5 px-6 border ${error ? 'border-red-500 outline-red-400 placeholder:text-red-500 animate-shake' : 'border-gray-300 outline-gray-400'} rounded-lg placeholder:text-sm placeholder:font-normal `}
        placeholder={placeholder}
        onChange={handleChange}
        value={formattedValue}
        disabled={disabled}
      />
      {error &&
        <div className='text-red-500 text-xs font-semibold text-end -mt-2 animate-shake'>
          {errorMsg}
        </div>
      }
    </div>
  );
};

export default InputText;
