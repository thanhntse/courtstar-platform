import React, { useEffect, useState } from 'react';
import InputText from '../components/input-text';
import PopupModal from '../components/PopupModal';
import ResetPassword from './ResetPassword';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import Button from '../components/button';
import { useTranslation } from 'react-i18next';

function ForgotPassword(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  //HANDLE CHECK EMAIL POPUP
  const [checkEmailPopup, setCheckEmailPopup] = useState(false);
  const [otpTimeCount, setOtpTimeCount] = useState('');

  const handleCheckEmailPopup = async (event) => {
    event.preventDefault();
    setLoading(true);
    await axiosInstance.put(`/courtstar/account/regenerate-otp`, email)
      .then((res) => {
        setOtpTimeCount(res.data.data);
        handleClose();
        setCheckEmailPopup(true);
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'email-error'
        });
      })
      .finally(
        () => {
          setLoading(false);
        }
      );

  };
  const handleCheckEmailPopupClose = () => {
    setCheckEmailPopup(false);
  };

  //CLOSE FORGET PASSWORD MODAL
  const handleClose = () => {
    props.setIsOpen(false);
  };

  //form
  const [email, setEmail] = useState('');

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  useEffect(() => {
    if (props.isOpen)
      setEmail('');
  }, [props.isOpen])

  const html = (
    <div className="w-[440px]">
      <div className="text-4xl font-semibold mb-5 text-center">
        {t('forgotPassword')}
      </div>
      <div className="text-gray-400 text-sm mb-5 text-center">
        {t('forgotPasswordNote')}
      </div>
      <form onSubmit={handleCheckEmailPopup}>
        <div className='mb-4'>
          <InputText
            id="emailForget"
            name="emailForget"
            placeholder={t('enterEmail')}
            label="Email"
            value={email}
            onchange={handleInputChange}
          />
        </div>
        <div>
          <Button
            type='submit'
            label={t('sendCode')}
            fullWidth
            fullRounded
            size='medium'
            className='bg-primary-green hover:bg-teal-900 text-white'
            loading={loading}
          />
        </div>
      </form>
    </div>
  );

  return (
    <div>
      <PopupModal
        html={html}
        isOpen={props.isOpen}
        setIsOpen={handleClose}
      />
      <ResetPassword
        isOpen={checkEmailPopup}
        setIsOpen={handleCheckEmailPopupClose}
        email={email}
        otpTime={otpTimeCount}
      />
    </div>
  );
}

export default ForgotPassword;
