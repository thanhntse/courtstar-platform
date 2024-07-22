import React from 'react';
import { useTranslation } from 'react-i18next';



const CustomerTerm = () => {
    const { t } = useTranslation();

    return (
        <div className='font-Inter text-base overflow-x-hidden text-gray-800'>
            <div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-100">
                <div className="max-w-screen-1440 1440:mx-auto mx-4 py-8 px-12 w-full flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h1 className='text-3xl font-bold font py-8'> {t('Customer')} </h1>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className='text-3xl font-semibold py-5'>
                            <p className='text-xl font-semibold py-6'> 1. {t('basicTerm')}</p>
                            <div className='text-base font-normal'>
                                <p>- {t('beLiable')} </p>                              
                            </div>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('basicTerms', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-xl font-semibold py-6'>2. {t('condition')}</p>
                            <ul className='font-normal text-base' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('generalConditions', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-xl font-semibold py-6'>3. {t('prohibitedActivity')}</p>
                            <div className='text-base font-normal'>
                                <p>- {t('useThe')} </p>                              
                            </div>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('prohibitedActivities', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-xl font-semibold py-6'>4. {t('refunderPolicy')} </p>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('refundPolicy', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-xl font-semibold py-6'>{t('copyRight')}</p>
                            <div className='text-base font-normal'>
                                <p>{t('allCopyright')}</p>                              
                            </div>
                        </div>


                    </div>






                </div>
            </div>

        </div>
    );
}

export default CustomerTerm;
