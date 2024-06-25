import React, { useState } from 'react';
import register from '../assets/images/register.jpg';
import InputText from '../components/input-text';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import Password from '../components/password';
import { useTranslation } from 'react-i18next';
import Button from '../components/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PartnerRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  //HANDLE CHECK BOX PRIVACY
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  //HANDLE REGISTER ACTION
  const [formPartnerRegister, setFormPartnerRegister] = useState({
    email: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormPartnerRegister((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    setLoading(true);
    await axiosInstance.post(`/courtstar/account/partner`, formPartnerRegister)
      .then(res => {
        toast.success("Register successfully!", {
          toastId: 'register-success'
        });
        axiosInstance.post(`/courtstar/auth/token`, formPartnerRegister)
          .then(res => {
            const dataObj = res.data;
            localStorage.setItem('token', dataObj.data.token);
            localStorage.setItem('role', dataObj.data.role);
            dispatch({ type: 'LOGIN', payload: { token: dataObj.data.token, role: dataObj.data.role } });
            navigate('/myCentre/balance');
          })
          .catch(error => {
          })
          .finally(
            () => {
            }
          );
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'register-error'
        });
      })
      .finally(
        () => {
          setLoading(false);
        }
      );
  };

  return (
    <div className='font-Inter text-base overflow-x-hidden text-gray-800'>
      <div className='max-h-[800px] overflow-hidden flex items-center'>
        <div className='bg-gray-500 basis-1/2'>
          <img src={register}
            alt="register"
            className='object-contain'
          />
        </div>
        <div className='basis-1/2'>
          <div className='max-w-lg mx-auto py-8 px-4 bg-white'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>{t('partnerRegister')}</h2>
            <div>
              <div className='mb-4 flex gap-5'>
                <InputText
                  id="firstName"
                  name="firstName"
                  placeholder={t('enterFirstName')}
                  label={t('firstName')}
                  value={formPartnerRegister.firstName}
                  onchange={handleChange}
                />
                <InputText
                  id="lastName"
                  name="lastName"
                  placeholder={t('enterLastName')}
                  label={t('lastName')}
                  value={formPartnerRegister.lastName}
                  onchange={handleChange}
                />
              </div>
              <div className='mb-4'>
                <InputText
                  id="email"
                  name="email"
                  placeholder={t('enterEmail')}
                  label="Email*"
                  value={formPartnerRegister.email}
                  onchange={handleChange}
                />
              </div>
              <div className='mb-4'>
                <InputText
                  id="phone"
                  name="phone"
                  placeholder={t('enterPhone')}
                  label={t('phone')}
                  value={formPartnerRegister.phone}
                  onchange={handleChange}
                />
              </div>
              <div className='mb-4'>
                <InputText
                  id="address"
                  name="address"
                  placeholder={t('enterAddress')}
                  label={t('address')}
                  value={formPartnerRegister.address}
                  onchange={handleChange}
                />
              </div>
              <div className='mb-6'>
                <Password
                  id="password"
                  name="password"
                  placeholder={t('enterPassword')}
                  label={t('password')}
                  value={formPartnerRegister.password}
                  onchange={handleChange}
                  evaluate={true}
                />
                <div className='text-gray-500 text-xs py-1 px-0.5'>
                  {t('conditionPassword')}
                </div>
              </div>
              <div className='flex items-center justify-center mb-5'>
                <div className='flex items-center h-5'>
                  <input id="terms"
                    type="checkbox"
                    value="ON"
                    className=''
                    required
                    onChange={handleCheckboxChange}
                  />
                </div>
                <label className="ms-2 text-sm font-medium">{t('agreeToOur')} <a href="#tou" className="underline">{t('termOfUse')}</a> {t('and')} <a
                  href='#pp'
                  className='underline'> {t('privacyPolicy')}</a></label>
              </div>
              <div className='flex items-center justify-center'>
                <div className='w-52'>
                  <Button
                    label={t('signUp')}
                    size='large'
                    fullRounded
                    fullWidth
                    className='bg-primary-green hover:bg-teal-900 text-white'
                    disabled={!isChecked}
                    onClick={handleRegister}
                    loading={loading}
                  />
                </div>
              </div>
              <div className='mt-10 text-sm text-center justify-center flex gap-1.5'>
                <span>{t('alreadyHaveAnAccount')}?</span>
                <a
                  className='font-semibold underline text-sm'
                  href="#login"
                >{t('logIn')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

export default PartnerRegister;
