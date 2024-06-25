import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutUs = () => {
    const { t } = useTranslation();

    return (
        <div className='font-Inter text-base overflow-x-hidden text-gray-800'>
            <div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-100">
                <div className="max-w-screen-1440 1440:mx-auto mx-4 py-8 px-12 w-full flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h1 className='text-3xl font-bold font py-8'>{t('aboutUs')}</h1>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className='text-3xl font-semibold py-5'>
                            <p className='text-2xl font-semibold py-5 text-center'> {t('COURTSTAR - A healthy body leads to a healthy mind')}</p>
                            <p className='text-xl font-semibold py-6'> 1. {t('History and Development')}</p>
                            <div className='text-base font-normal'>
                                <p>{t('foundedIn2024')}</p>
                                <p>{t('dynamicTeam')}</p>
                                <p>{t('manyCourts')}</p>
                                <p>{t('enthusiasticStaff')}</p>
                            </div>
                            <p className='text-xl font-semibold py-6'>2. {t('Mission and Vision')}</p>
                            <p className='text-lg font-semibold'>{t('Vision')}</p>
                            <p className='font-normal text-base py-6'>{t('visionDescription')}</p>
                            <p className='text-lg font-semibold py-6'>{t('Mission')}</p>
                            <p className='font-normal text-base py-6'>{t('missionDescription')}</p>
                            <p className='text-xl font-semibold py-6'>3. {t('CourtStar Commitments')}</p>
                            <p className='text-lg font-semibold py-6'>{t('Commitment to the Guest')}</p>
                            <ul className='font-normal text-base' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('guestCommitments', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            <p className='text-lg font-semibold py-6'>{t('Commitment to the Partner')}</p>
                            <ul className='font-normal text-base' style={{paddingLeft: '50px', listStyleType: 'disc' }}>
                                {t('partnerCommitments', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
