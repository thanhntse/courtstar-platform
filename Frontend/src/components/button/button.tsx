import { useRef, MouseEvent } from 'react';
import SpinnerLoading from '../../components/SpinnerLoading';
import {ButtonProps} from './index';
import './button.css';

const Button = (props: ButtonProps): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (buttonRef.current) {
          const button = buttonRef.current;
          const ripple = document.createElement('span');
          const rect = button.getBoundingClientRect();
          const diameter = Math.max(rect.width, rect.height);
          const radius = diameter / 2;

          ripple.style.width = ripple.style.height = `${diameter}px`;
          ripple.style.left = `${event.clientX - rect.left - radius}px`;
          ripple.style.top = `${event.clientY - rect.top - radius}px`;
          ripple.classList.add('ripple');

          const prevRipple = button.querySelector('.ripple');
          if (prevRipple) {
              button.removeChild(prevRipple);
          }

          button.appendChild(ripple);
          setTimeout(() => {
              button.removeChild(ripple);
          }, 500);

          if(props.onClick) props.onClick();
      }
  };

  const btnClass =  (props.fullWidth ? ' !w-full ' : ' ') +
                    (props.fullRounded ? ' !rounded-full ' : ' ') +
                    (props.size === 'small' ? ' !py-1 !px-3 '
                      : props.size === 'medium' ? ' py-2.5 px-6 '
                      : props.size === 'large' ? ' !py-3 !px-8 '
                      : props.size === 'mini' ? ' !py-1 !px-2 ' : '');

  return (
    <button
      ref={buttonRef}
      className={btnClass + props.className + ' relative overflow-hidden flex gap-3 items-center justify-center font-medium disabled:bg-opacity-80 disabled:pointer-events-none rounded-md transition-colors duration-300 ease-in-out '}
      type={props.type}
      disabled={props.loading || props.disabled}
      onClick={handleClick}
    >
      {props.loading ? (
        <SpinnerLoading
          type='button'
          height={props.loadingHeight ? props.loadingHeight : '24'}
          width={props.loadingWidth ? props.loadingWidth : '24'}
          color={props.loadingColor ? props.loadingColor : '#fff'}
        />
      ) : (
        <>
          {props.icon && (
            <div className={`${props.iconClass} w-5`}>
              {props.icon}
            </div>
          )}
          {props.label}
        </>
      )}
    </button>
  );
};

export default Button;
