import { useEffect, useState } from 'react'
import axiosInstance from '../../config/axiosConfig';
import XCarousel from '../../components/carousel';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Dialog from '../../components/Dialog';
import { toast } from 'react-toastify';
import SpinnerLoading from '../../components/SpinnerLoading';
import showAlert from '../../components/alert';
import PopupModal from '../../components/PopupModal';
import InputText from '../../components/input-text';
import Button from '../../components/button';

const PostCentre = () => {
  const controller = new AbortController();
  const { signal } = controller;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [listCentrePending, setListCentrePending] = useState<any>();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [centreDetail, setCentreDetail] = useState<any>();
  const [description, setDescription] = useState('');
  const [loadingDel, setLoadingDel] = useState(false);


  const load = async () => {
    await axiosInstance.get(`/courtstar/centre/centre/pending`, { signal })
      .then(res => {
        setListCentrePending(res.data.data)
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(
        () => {
          setLoading(false);
        }
      );
  }

  useEffect(() => {
    load();
  }, [])

  const openCentreDetail = async (id) => {
    let centreClone = listCentrePending.filter(
      (centre) => centre.id === id
    );
    setCentreDetail(centreClone[0]);
    setIsOpenModal(true)
  }

  const approveRequest = async (id) => {
    await axiosInstance.post(`/courtstar/admin/centre/approve/${id}`, { signal })
      .then(res => {
        // setListCentrePending(res.data.data)
        toast.success('Approve successfully', {
          toastId: 'approve-success'
        });
        if (res.data.data) {
          load();
          setIsOpenModal(false);
        }
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'approve-unsuccess'
        });
      })
      .finally(
      // () => {
      //   setLoading(false);
      // }
    );
  }

  const denyRequest = async (id) => {
    setLoadingDel(true);
    await axiosInstance.post(`/courtstar/admin/centre/deny/${id}`, { description })
      .then(res => {
        // setListCentrePending(res.data.data)
        toast.success('Deny successfully', {
          toastId: 'deny-success'
        });
        if (res.data.data) {
          load();
          setOpenDesc(false)
          setIsOpenModal(false);
        }
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'deny-unsuccess'
        });
      })
      .finally(
        () => {
          setLoadingDel(false);
        }
      );
  }

  const centreInfor = (
    <>
      {centreDetail &&
        <div
          className="w-[calc(80vw)]"
        >

          <div className="flex justify-between gap-4">
            <div className="">
              <XCarousel images={centreDetail?.images} />
            </div>

            <div className="flex-1 w-[410px] flex flex-col gap-3">


              <div className="flex flex-col gap-3">
                <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-lg font-semibold">
                      {t('information')}
                    </div>
                    <div className="px-2">
                      <div>
                        <span className='font-semibold'>{t('address')}: </span>
                        {centreDetail.address}
                      </div>

                      <div>
                        <span className='font-semibold'>{t('openTime')}: </span>
                        {moment(centreDetail.openTime, 'HH:mm:ss').format('HH:mm')} - {moment(centreDetail.closeTime, 'HH:mm:ss').format('HH:mm')}
                      </div>

                      <div>
                        <span className='font-semibold'>{t('price')}: </span>
                        <span className='font-semibold text-rose-600'>
                          {centreDetail?.pricePerHour?.toLocaleString('de-DE')} VND/h
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                {centreDetail?.description &&
                  <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow">
                    <span className='font-semibold'>{t('description')}: </span>
                    <div dangerouslySetInnerHTML={{ __html: centreDetail.description }}>
                    </div>
                  </div>
                }

                <div className="bg-white h-fit w-full px-4 py-2 rounded-md shadow flex flex-col gap-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <div>
                      <span className='font-semibold'>{t('numberOfCourts')}: </span>
                      {centreDetail.numberOfCourts}
                    </div>
                  </div>
                  <div className="mx-auto">
                    <div className="grid grid-cols-2 gap-x-20">
                      {centreDetail?.courts?.map((court) => (
                        <div
                          key={court.id}
                          className="flex items-center gap-1"
                        >
                          <div className="">
                            {court.courtNo}.
                          </div>
                          <div className="flex justify-between gap-1 w-full items-center">
                            <div className="flex gap-1 ">
                              <div className='font-semibold'>{t('status')}:</div>
                              <div className={court.status ? 'font-semibold text-primary-green' : 'font-semibold text-red-500'}>
                                {court.status ? 'Active' : 'Close'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      }
    </>
  );

  const formDesc = (
    <div className="">
      <InputText
        id='description'
        name='description'
        value={description}
        onchange={(e) => setDescription(e.target.value)}
        placeholder={t('enterReasonForDenied')}
      />
      <Button
        className='bg-primary-green mx-auto mt-3 w-full py-0.5 text-white hover:bg-teal-900'
        label={t('confirm')}
        onClick={() => denyRequest(centreDetail?.id)}
        loading={loadingDel}
      />
    </div>
  )

  const [openDesc, setOpenDesc] = useState(false);

  return (
    <>
      <Dialog
        isOpen={isOpenModal}
        setIsOpen={() => {
          setIsOpenModal(false);
        }}
        html={centreInfor}
        title={centreDetail?.name}
        submit={() => {
          showAlert({
            title: t('areYouSure') + "?",
            message: t('youAllowThisCentreOpenInTheSystem') + "!",
            type: 'success',
            onConfirmClick: () => approveRequest(centreDetail?.id)
          });
        }}
        submitDeny={() => setOpenDesc(true)}
        centreInfo
      />

      <PopupModal
        isOpen={openDesc}
        setIsOpen={() => setOpenDesc(false)}
        html={formDesc}
        centreInfo
        title={t('reasonForDenial')}
      />

      <div
        className="py-6 w-full"
      >
        <div className="text-3xl font-bold">
        {t('postCentre')}
        </div>

        {loading
          ?
          <div className="h-[500px] flex items-center justify-center">
            <SpinnerLoading
              height='80'
              width='80'
              color='#2B5A50'
            />
          </div>
          :
          <>
            {
              listCentrePending.length
                ?
                <div className="mt-2">
                  {listCentrePending?.map((centre) => (
                    <div
                      key={centre.id}
                      className="grid grid-cols-3 py-3 px-10 mt-1 bg-white rounded-lg shadow-sm ease-in-out duration-300 font-medium hover:bg-teal-50 hover:px-8 cursor-pointer"
                      onClick={() => openCentreDetail(centre.id)}
                    >
                      <div className="self-center font-semibold">
                        {centre.name}
                      </div>
                      <div className="self-center">
                        {centre.managerEmail}
                      </div>
                      <div className="w-fit justify-self-end">
                        <div className="mx-auto text-white text-xs font-semibold px-2 py-1 bg-yellow-400 rounded-md">
                          {t('Pending')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div >
                :
                <div className='flex flex-col items-center justify-center h-[500px] text-3xl text-primary mx-auto'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="250" height="250"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-search-x"
                  >
                    <path d="m13.5 8.5-5 5" />
                    <path d="m8.5 8.5 5 5" />
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  No request found.
                </div>

            }
          </>
        }

      </div>
    </>
  )
}

export default PostCentre
