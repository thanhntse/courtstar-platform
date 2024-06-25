import PopupModal from '../components/PopupModal';
import React, { useEffect, useState } from 'react';
import PinCode from '../components/PinCode';
import Password from '../components/password';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import moment from 'moment';
import SpinnerLoading from '../components/SpinnerLoading';
import Button from '../components/button';
import { useTranslation } from 'react-i18next';

function ResetPassword(props) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // State object for email, OTP, and new password fields
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });

  // State to control pin code clearing
  const [clearPin, setClearPin] = useState(false);

  // Set email from props if available
  useEffect(() => {
    if (props.email) {
      setFormData(prevData => ({ ...prevData, email: props.email }));
    }
  }, [props.email]);

  // Function to handle closing the popup
  const handleClose = () => {
    props.setIsOpen();
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    setConfirmLoading(true);
    event.preventDefault();
    await axiosInstance.post(`/courtstar/account/reset-password`, formData)
      .then(() => {
        toast.success('Reset Successfully', {
          toastId: 'reset-password-success'
        });
        handleClose();
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'reset-password-error'
        });
      })
      .finally(() => {
        setConfirmLoading(false);
      })
      ;
  };

  // Function to handle OTP input change
  const handleOtpChange = (value) => {
    setFormData(prevData => ({ ...prevData, otp: value }));
  };

  // Function to handle other form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Reset form and clear pin code when popup is opened
  useEffect(() => {
    if (props.isOpen) {
      setFormData(prevData => ({
        ...prevData,
        otp: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setClearPin(true);
      setTimeout(() => setClearPin(false), 100);
      setResendCodeCount(true);
    }
  }, [props.isOpen]);

  // States and function for handling OTP resend cooldown
  const [resendCodeCount, setResendCodeCount] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(0); // Cooldown time in seconds
  const [otpTime, setOtpTime] = useState('');


  const resendCode = async () => {
    setLoading(true);
    await axiosInstance.put(`/courtstar/account/regenerate-otp`, props.email)
      .then((res) => {
        setOtpTime(res.data.data);
        setResendCodeCount(true);
      }).catch(error => {
        toast.error(error.message, {
          toastId: 'email-error'
        });
      }).finally(
        () => {
          setLoading(false);
        }
      )
  };

  useEffect(() => {
    setOtpTime(props.otpTime);
  }, [props.otpTime]);

  const [currentTime, setCurrentTime] = useState(moment().unix());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().unix());
    }, 1000); // Cập nhật thời gian mỗi giây

    return () => clearInterval(intervalId); // Hủy bỏ interval khi component bị unmount
  }, []);

  // Timer effect to handle cooldown countdown
  useEffect(() => {
    if (otpTime) {
      let timeCount = 60 * 3 - (currentTime - parseInt(otpTime));
      if (timeCount > 0) setCooldownTime(timeCount);
      else setResendCodeCount(false);
    }
  }, [otpTime, currentTime]);

  // Function to format cooldown time in MM:SS format
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // JSX for the popup modal content
  const html = (
    <form onSubmit={handleSubmit}
      className='w-[440px] flex flex-col gap-5'>
      <div className="flex flex-col gap-2">
        <div className="text-4xl font-semibold text-center">
          {t('checkYourEmail')}
        </div>

        <div className="text-gray-400 text-sm text-center">
          <div>
            {t('weSent')}<span className="font-semibold text-black">{formData.email}</span>
          </div>
          <div>
            {t('enterDigit')}
          </div>
        </div>

        <PinCode
          value={formData.otp.trim()}
          onChange={handleOtpChange}
          clear={clearPin}
          onComplete={handleOtpChange}
        />

        <Password
          id="newPassword"
          name="newPassword"
          placeholder={t('enterNewPassword')}
          label={t('newPassword')}
          value={formData.newPassword}
          onchange={handleChange}
          evaluate={true}
        />

        <Password
          id="confirmPassword"
          name="confirmPassword"
          placeholder={t('enterConfirmNewPassword')}
          label={t('confirmNewPassword')}
          value={formData.confirmPassword}
          onchange={handleChange}
          evaluate={false}
        />

        <div className='text-sm text-center justify-center text-gray-400'>
        {t('gotEmailYet')}
          {
            loading
              ?
              <SpinnerLoading
                type='button'
                height='20'
                width='20'
                color='#000'
              />
              :
              <div className={resendCodeCount ? `font-semibold text-red-500` : `font-semibold text-gray-800 cursor-pointer hover:text-primary-green`} onClick={resendCode}>
                {resendCodeCount ? <p>{formatTime(cooldownTime)}</p> : t('resend')}
              </div>}
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <Button
          type='submit'
          label={t('confirm')}
          fullWidth
          fullRounded
          size='medium'
          className='bg-primary-green hover:bg-teal-900 text-white'
          loading={confirmLoading}
        />
      </div>
    </form>
  );

  return (
    <div>
      <PopupModal
        html={html}
        isOpen={props.isOpen}
        setIsOpen={handleClose}
      />
    </div>
  );
}

export default ResetPassword;
