import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className='font-Inter text-base overflow-x-hidden text-gray-800'>
            <div className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-gray-100">
                <div className="max-w-screen-1440 mx-auto mx-4 py-8 px-12 w-full flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h1 className='text-3xl font-bold py-8'>{t('privacyPolicy')}</h1>
                    </div>
                    <table className='w-fit mx-4 py-8 px-12 flex flex-col gap-3 bg-slate-200'>
                        <thead>
                            <tr className="table-header text-left">
                                <th>{t('quickView')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><a href="#personal">1. {t('personalDataWeCollect')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#provided">2. {t('thirdPartyPersonalDataProvided')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#purpose">3. {t('purposeForDataProcessing')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#sharing">4. {t('sharingPersonalData')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#international">5. {t('internationalDataTransfer')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#storage">6. {t('dataStorageAndProcessingTime')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#rights">7. {t('rightsAndObligationsOfCustomers')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#protection">8. {t('dataProtection')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#cookies">9. {t('cookies')}</a></td>
                            </tr>
                            <tr>
                                <td><a href="#updating">10. {t('updatingDataProtectionPolicy')}</a></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center">
                        <div className='text-3xl font-semibold py-5'>
                            <h2 className='text-2xl font-semibold py-5'>{t('thankYouForVisiting')}</h2>
                            <h3 className='text-xl font-semibold py-6'>{t('overview')}</h3>
                            <h4 className='text-base font-normal'>
                                <p className='pb-4'>{t('overviewText1')}</p>
                                <p className='pb-4'>{t('overviewText2')}</p>
                                <p className='pb-4'>{t('overviewText3')}</p>
                            </h4>
                            <p id='personal' className='text-xl font-semibold py-6'>1. {t('personalDataWeCollect')}</p>
                            <p className='text-base font-normal'>{t('dataCollectionIntro')}</p>
                            <p className='font-semibold text-lg py-6'>1.1 {t('personalData')}</p>
                            <p className='text-base font-normal py-6'>{t('personalDataDetails')}</p>
                            <p className='font-semibold text-lg py-6'>1.2 {t('personalDataCollectedAutomatically')}</p>
                            <p className='text-base font-normal py-6'>{t('automaticDataCollectionIntro')}</p>
                            <p className='text-lg font-semibold py-6'>1.2.1 {t('contactInformation')}</p>
                            <p className='text-base font-normal py-6'>{t('contactInformationDetails')}</p>
                            <p className='text-lg font-semibold py-6'>1.2.2 {t('financialInformation')}</p>
                            <p className='text-base font-normal py-6'>{t('financialInformationDetails')}</p>
                            <p className='text-lg font-semibold py-6'>1.2.3 {t('transactionInformation')}</p>
                            <p className='text-base font-normal py-6'>{t('transactionInformationDetails')}</p>
                            <p className='text-lg font-semibold py-6'>1.2.4 {t('behavioralInformation')}</p>
                            <p className='text-base font-normal py-6'>{t('behavioralInformationDetails')}</p>
                            <p className='text-lg font-semibold py-6'>1.2.5 {t('profileInformation')}</p>
                            <p className='text-base font-normal py-6'>{t('profileInformationDetails')}</p>
                            <p className='text-lg font-semibold py-6'>1.2.6 {t('marketingAndCommunicationInformation')}</p>
                            <p className='text-base font-normal py-6'>{t('marketingAndCommunicationDetails')}</p>
                            <p id='provided' className='text-lg font-semibold py-6'>2. {t('thirdPartyPersonalDataProvided')}</p>
                            <p className='text-base font-normal py-6'>{t('thirdPartyPersonalDataIntro')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('thirdPartyPersonalDataItem1')}</li>
                                <li>{t('thirdPartyPersonalDataItem2')}</li>
                                <li>{t('thirdPartyPersonalDataItem3')}</li>
                                <li>{t('thirdPartyPersonalDataItem4')}</li>
                                <li>{t('thirdPartyPersonalDataItem5')}</li>
                            </ul>
                            <p id='purpose' className='text-lg font-semibold py-6'>3. {t('purposeForData')}</p>
                            <p className='text-base font-normal py-6'>{t('scopePermitted')}</p>
                            <p className='font-semibold text-lg py-6'>3.1 {t('regisAuthen')}</p>
                            <p className='text-base font-normal py-6'>{t('processData')}</p>
                            <p className='font-semibold text-lg py-6'>3.2 {t('relationManagement')}</p>
                            <p className='text-base font-normal py-6'>{t('processYour')}</p>
                            <p className='font-semibold text-lg py-6'>3.3 {t('dataAnalysis')}</p>
                            <p className='text-base font-normal py-6'>{t('dataPurpose')}</p>
                            <p className='font-semibold text-lg py-6'>3.4 {t('improveProduct')}</p>
                            <p className='text-base font-normal py-6'>{t('dataServe')}</p>
                            <p className='font-semibold text-lg py-6'>3.5 {t('meetFunction')}</p>
                            <p className='text-base font-normal py-6'>{t('weMay')}</p>
                            <p className='font-semibold text-lg py-6'>3.6 {t('informationTech')}</p>
                            <p className='text-base font-normal py-6'>{t('toPerform')}</p>
                            <p className='font-semibold text-lg py-6'>3.7 {t('protectCommon')}</p>
                            <p className='text-base font-normal py-6'>{t('thirdParties')}</p>
                            <p className='font-semibold text-lg py-6'>3.8 {t('complianceLegal')}</p>
                            <p className='text-base font-normal py-6'>{t('complyLegal')}</p>
                            <p id='sharing' className='text-lg font-semibold py-6'>4. {t('personalShare')}</p>
                            <p className='text-base font-normal py-6'>{t('mayDisclose')}</p>
                            <p className='font-semibold text-lg py-6'>4.1 {t('websiteSocial')} </p>
                            <p className='text-base font-normal py-6'>{t('provideYou')}</p>
                            <p className='font-semibold text-lg py-6'>4.2 {t('uponRequest')}</p>
                            <p className='text-base font-normal py-6'>{t('toProtecting')}</p>
                            <p id='international' className='text-lg font-semibold py-6'>5. {t('dataTransfer')}</p>
                            <p className='text-base font-normal py-6'>{t('beTransfer')}</p>
                            <p className='text-base font-normal py-6'>{t('legalBasis')}</p>
                            <p id='storage' className='text-lg font-semibold py-6'>6. {t('dataStorage')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('storeProcess')}</li>
                                <li>{t('ceaseStoring')}</li>
                                <li>{t('regulationsAbove')}</li>
                            </ul>
                            <p id='rights' className='text-lg font-semibold py-6'>7. {t('rightsAnd')}</p>
                            <p className='font-semibold text-lg py-6'>7.1. {t('knowRight')}</p>
                            <p className='text-base font-normal py-6'>{t('rightTo')}</p>
                            <p className='font-semibold text-lg py-6'>7.2. {t('toConsent')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('haveRight')}</li>
                                <li>{t('toWithdraw')}</li>
                            </ul>
                            <p className='font-semibold text-lg py-6'>7.3. {t('toAccess')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('toView')}</li>
                                <li>{t('notResponsible')}</li>
                            </ul>
                            <p className='font-semibold text-lg py-6'>7.4. {t('deleteData')}</p>
                            <p className='text-base font-normal py-6'>{t('toRequest')}</p>
                            <p className='font-semibold text-lg py-6'>7.5. {t('toRestrict')}</p>
                            <p className='text-base font-normal py-6'>{t('toLimit')}</p>
                            <p className='font-semibold text-lg py-6'>7.6. {t('toProvided')}</p>
                            <p className='text-base font-normal py-6'>{t('mayRequest')}</p>
                            <p className='font-semibold text-lg py-6'>7.7. {t('toObject')}</p>
                            <p className='text-base font-normal py-6'>{t('toData')}</p>
                            <p className='font-semibold text-lg py-6'>7.8. {t('toComplain')}</p>
                            <p className='text-base font-normal py-6'>{t('toSubmit')}</p>
                            <p className='font-semibold text-lg py-6'>7.9. {t('toRequests')}</p>
                            <p className='text-base font-normal py-6'>{t('requestCompensation')}</p>
                            <p className='font-semibold text-lg py-6'>7.10. {t('toSelf')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('asRegulated')}</li>
                                <li>{t('tryTo')}</li>
                                <li>{t('mayExercise')}</li>
                                <li>{t('ownPrivacy')}</li>
                            </ul>
                            <p className='font-semibold text-lg py-6'>7.11 {t('ofCustomers')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('provideFull')}</li>
                                <li>{t('respectProtect')}</li>
                                <li>{t('otherLegal')}</li>
                            </ul>
                            <p className='font-semibold text-lg py-6'>7.12. {t('notesOn')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('ifYou')}</li>
                                <li>{t('ofYours')}</li>
                            </ul>
                            <p id='protection' className='text-lg font-semibold py-6 pb-6'>8. {t('dataProtections')}</p>
                            <p className='text-base font-normal py-6 pb-4'>{t('weHave')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('byLaw')}</li>
                                <li>{t('rulesOn')}</li>
                                <li>{t('conductSecurity')}</li>
                                <li>{t('weAlso')}</li>
                                <li>{t('theEvent')}</li>
                            </ul>
                            <p id='cookies' className='text-lg font-semibold py-6'>9. {t('forCookies')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('cookieIs')}</li>
                                <li>{t('toHelp')}</li>
                                <li>{t('acceptDecline')}</li>
                            </ul>
                            <p id='updating' className='text-lg font-semibold py-6'>10. {t('updatingThe')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('mayModify')}</li>
                                <li>{t('agreeThat')}</li>
                            </ul>
                            <p className='text-lg font-semibold py-6'>{t('forConsent')}</p>
                            <ul className='font-normal text-base' style={{ paddingLeft: '50px', listStyleType: 'disc' }}>
                                <li>{t('pleaseRead')}</li>
                                <li>{t('notAgree')}</li>
                            </ul>
                        </div>


                    </div>






                </div>
            </div>

        </div>
    );
}

export default PrivacyPolicy;
