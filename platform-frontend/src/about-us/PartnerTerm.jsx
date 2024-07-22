import React from 'react';
import { useTranslation } from 'react-i18next';



const PartnerTerm = () => {
    const {t} = useTranslation();

    return (
        <div className='font-Inter text-base overflow-x-hidden text-gray-800'>
            <div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-100">
                <div className="max-w-screen-1440 1440:mx-auto mx-4 py-8 px-12 w-full flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h1 className='text-3xl font-bold font py-8'>{t('Partners')}</h1>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className='text-3xl font-semibold py-5'>
                            <p className='text-xl font-semibold py-6'> 1. {t('basicTerm')}</p>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('basicTermsPartner', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-xl font-semibold py-6'>2. {t('condition')}</p>
                            <p className='text-lg font-semibold'>2.1 {t('uploadCourt')} </p>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('uploadCondition', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-lg font-semibold font py-6'>2.2 {t('partnerSharing')} </p>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('moneySharing', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-lg font-semibold font py-6'>2.3 {t('withdrawalPolicy')} </p>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('withdrawPolicy', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-lg font-semibold font py-6'>3. {t('prohibitedActivity')} </p>
                            <ul className='font-normal text-base py-4' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('prohibitedActPartner', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-xl font-semibold py-6'> {t('copyRight')} </p>
                            <div className='text-base font-normal'>
                                <p> {t('allCopyright')} </p>                              
                            </div>
                        </div>


                    </div>






                </div>
            </div>

        </div>
    );
}

export default PartnerTerm;
