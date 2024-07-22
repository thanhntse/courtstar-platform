import { useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ConfirmOptions } from './index';
import x from '../../assets/images/x.svg';
import './index.css';
import Button from '../button';
import { useTranslation } from 'react-i18next';

const CustomConfirmDialog = ({ options, onClose, }) => {
  const { t } = useTranslation();
  const notify = {
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#699cec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-triangle-alert">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#f04242" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#42f076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const alertType = document.getElementById('alert-type');
    if (alertType) {
      alertType.classList.add("animate-shake");
      setTimeout(() => {
        alertType.classList.remove("animate-shake")
      }, 500);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      className={`relative w-fit p-5 text-gray-800 rounded-xl shadow-2xl bg-white max-h-screen overflow-y-auto overflow-x-hidden`}>
      <button className='absolute p-2 top-1.5 right-1.5 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out'
        onClick={onClose}
      >
        <img src={x} alt="x" />
      </button>

      <div
        id='alert-type'
        className='w-full flex justify-center items-center mb-2'>
        {notify[options.type]}
      </div>

      <h1 className='text-2xl text-center font-semibold mb-2'>
        {options.title}
      </h1>

      <p className='text-gray-500 text-sm w-4/5 text-center mx-auto mb-2'>
        {options.message}
      </p>

      <div className='flex justify-between items-center gap-2'>
        <Button
          fullWidth
          label={t('confirm')}
          onClick={() => {
            options.onConfirmClick();
            onClose();
          }}
          size='small'
          className='text-white bg-primary-green hover:bg-teal-900'
        />
        <Button
          fullWidth
          label={t('cancel')}
          onClick={onClose}
          size='small'
          className='border border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
        />
      </div>
    </div>
  );
}

const showAlert = (options: ConfirmOptions) => {
  confirmAlert({
    customUI: ({ onClose }) =>
      <CustomConfirmDialog
        options={options}
        onClose={onClose}
      />,
    overlayClassName: "custom-overlay",
  });
};

export default showAlert;
