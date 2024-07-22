import React, { useState } from 'react';
import eye from '../../assets/images/eye.svg';
import eyeoff from '../../assets/images/hide-eye.svg';
import { PasswordStrengthProps, PasswordProps } from './index'

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, evaluate }) => {
  const calculateScore = (password: string | undefined) => {
    let score = 0;
    if (!password) return score;

    if (password.length >= 8) score += 1;

    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharacters.test(password)) score += 1;

    const uppercaseCharacters = /[A-Z]/;
    if (uppercaseCharacters.test(password)) score += 1;

    const lowercaseCharacters = /[a-z]/;
    if (lowercaseCharacters.test(password)) score += 1;

    const numbers = /[0-9]/;
    if (numbers.test(password)) score += 1;

    return score;
  };

  const score = calculateScore(password);
  const scoreParseBg: { [key: number]: string } = {
    1: 'w-1/4 bg-red-600',
    2: 'w-2/4 bg-orange-500',
    3: 'w-3/4 bg-yellow-400',
    4: 'bg-green-500',
    5: 'bg-green-500',
    6: 'bg-green-500',
  }

  return (
    evaluate && <div className="relative px-1 w-full -mt-1">
      <div className={`h-1 rounded-full transition-all ease-in-out duration-300 ${scoreParseBg[score]}`} />
      <div className={`absolute pl-1.5 py-1 -top-10 right-2 bg-white z-10 font-normal text-gray-500 text-sm`}>
        {
          score >= 4 ? 'Very Strong' :
            score >= 3 ? 'Strong' :
              score >= 2 ? 'Average' :
                score >= 1 ? 'Weak' : ''
        }
      </div>
    </div>
  );
};

const Password: React.FC<PasswordProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full flex flex-col font-medium gap-2 text-gray-800">
      <div className='flex justify-between items-center'>
        <label
          htmlFor={props.id}
          className='font-semibold'
        >
          {props.label}
        </label>
        <div className='px-1.5'
          onClick={toggleShowPassword}
        >
          {
            showPassword
              ?
              (<img src={eyeoff} alt="eye-off" />)
              :
              (<img src={eye} alt="eye" />)
          }
        </div>
      </div>
      <input
        type={showPassword ? "text" : "password"}
        name={props.name}
        id={props.id}
        className={`w-full py-2.5 px-6 border rounded-lg placeholder:text-sm placeholder:font-normal  ${props.error ? 'border-red-500 animate-shake outline-red-400 placeholder:text-red-500' : 'border-gray-300 outline-gray-400'}`}
        placeholder={props.placeholder}
        onChange={props.onchange}
        value={props.value}
      />
      {props.error
        ?
        <div className='text-red-500 text-xs font-semibold text-end -mt-2 animate-shake'>
          {props.errorMsg}
        </div>
        :
        <PasswordStrength password={props.value} evaluate={props.evaluate} />
      }
    </div>
  );
};

export default Password;
