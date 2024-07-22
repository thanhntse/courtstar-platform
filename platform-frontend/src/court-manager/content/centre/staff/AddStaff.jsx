import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import axiosInstance from '../../../../config/axiosConfig';
import InputText from '../../../../components/input-text';
import Password from '../../../../components/password';
import Dialog from '../../../../components/Dialog';

function AddStaff({ isOpen, setIsOpen, id, loadStaffInfo }) {
  const { t } = useTranslation();

  const [addStaff, setAddStaff] = useState({
    centreId: id,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddStaff(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddStaff = async () => {
    try {
      const res = await axiosInstance.post(`/courtstar/account/staff`, addStaff);
      toast.success(t('addStaffSuccess'), {
        toastId: 'add-staff-success'
      });
      handleClose();
      loadStaffInfo();
    } catch (error) {
      toast.error(t('addStaffError', { error: error.message }), {
        toastId: 'add-staff-error'
      });
    }
  };

  const handleClose = () => {
    setIsOpen();
    clearForm();
  };

  const clearForm = () => {
    setAddStaff({
      centreId: id,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    });
  };

  useEffect(() => {
    if (isOpen) {
      clearForm();
    }
  }, [isOpen]);

  const formContent = (
    <div>
      <div className='mb-4 flex gap-5'>
        <InputText
          id="firstName"
          name="firstName"
          placeholder={t('enterFirstName')}
          label={t('firstName')}
          value={addStaff.firstName}
          onchange={handleChange}
        />
        <InputText
          id="lastName"
          name="lastName"
          placeholder={t('enterLastName')}
          label={t('lastName')}
          value={addStaff.lastName}
          onchange={handleChange}
        />
      </div>
      <div className="mb-4">
        <InputText
          id="email"
          name="email"
          placeholder={t('enterStaffEmail')}
          label="Email"
          value={addStaff.email}
          onchange={handleChange}
        />
      </div>
      <div className="mb-4">
        <InputText
          id="phone"
          name="phone"
          placeholder={t('enterStaffPhone')}
          label={t('phone')}
          value={addStaff.phone}
          onchange={handleChange}
        />
      </div>
      <div className="mb-4">
        <Password
          id="password"
          name="password"
          placeholder={t('enterStaffPassword')}
          label={t('password')}
          value={addStaff.password}
          onchange={handleChange}
          evaluate={true}
        />
      </div>
    </div>
  );

  return (
    <Dialog
      html={formContent}
      isOpen={isOpen}
      setIsOpen={handleClose}
      title={t('staffInformation')}
      submit={handleAddStaff}
      clearForm={clearForm}
    />
  );
}

export default AddStaff;
