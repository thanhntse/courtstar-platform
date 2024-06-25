import React, { useEffect, useState } from 'react';
import x from '../assets/images/x.svg';
import Button from './button';
import { useTranslation } from 'react-i18next';

const Dialog = (props) => {
  /**
   * ALL PROPS:
   * isOpen: boolean
   * title: string
   * html: html
   * setIsOpen: () => {}
   * submit: () => {}
   */

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDeny] = useState(false);

  const handleClose = () => {
    props.setIsOpen();
    props.clearForm();
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await props.submit();
    } catch {
      console.log("some bug");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitDeny = async () => {
    setLoadingDeny(true);
    try {
      await props.submitDeny();
    } catch {
      console.log("some bug");
    } finally {
      setLoadingDeny(false);
    }
  }

  if (props.clearForm)
    useEffect(() => {
      if (props.isOpen) {
        props.clearForm();
      }
    }, [props.isOpen])

  useEffect(() => {
    if (props.isOpen) {
      // Disable scrolling on the body
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when the dialog is closed
      document.body.style.overflow = 'unset';
    }
  }, [props.isOpen]);

  return (
    <div className={props.isOpen === false ? 'hidden' : ''}>
      <div className='text-gray-800'>
        <div className='fixed z-40 top-0 left-0 h-screen w-screen bg-gray-900 opacity-40'>
        </div>

        <div className='fixed z-50 top-0 left-0 h-screen w-screen flex justify-center items-center'>
          <div className='relative animate-fade-in-down w-fit pt-3.5 px-5 rounded-xl shadow-2xl bg-white h-screen flex flex-col justify-between'>

            <h2 className="text-3xl px-5 font-bold mb-3.5 text-center">{props.title}</h2>

            <div className={`flex-1 ${props.centreInfo ? '' : 'w-[48rem]'} bg-white mx-auto h-auto overflow-y-auto overflow-x-hidden px-2 mb-3`}>
              {props.html}
            </div>

            <div className="bg-gray-200 rounded-b-xl pb-5 px-5 pt-3 -mx-5 font-semibold flex gap-6">
              <Button
                label={t('upload')}
                fullWidth
                size='medium'
                className='bg-primary-green hover:bg-teal-900 text-white'
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5" /></svg>
                }
                loading={loading}
                onClick={handleSubmit}
              />
              {!(props.centreInfo)
                ?
                <Button
                  label={t('discard')}
                  fullWidth
                  size='medium'
                  className='text-red-600 border-2 border-red-600 hover:bg-red-600 bg-white hover:text-white '
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                  }
                  onClick={handleClose}
                />
                :
                <Button
                  label={t('deny')}
                  fullWidth
                  size='medium'
                  className='text-red-600 border-2 border-red-600 hover:bg-red-600 bg-white hover:text-white'
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  }
                  loading={loadingDelete}
                  onClick={handleSubmitDeny}
                />
              }

            </div>

            <button className='absolute p-2 top-3 right-3 hover:bg-gray-200 rounded-full transition-all duration-300 ease-in-out'
              onClick={handleClose}
            >
              <img src={x}
                alt="x" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
