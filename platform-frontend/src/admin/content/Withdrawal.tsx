import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import SpinnerLoading from "../../components/SpinnerLoading";
import Button from "../../components/button";
import moment from "moment";
import { toast } from "react-toastify";
import Dropdown, { Item } from "../../components/dropdown";  // Ensure Item is imported correctly
import InputText from "../../components/input-text";
import PopupModal from "../../components/PopupModal";
import showAlert from "../../components/alert";
import { useTranslation } from 'react-i18next';

const Withdrawal = () => {
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState<any>();
  const [requestDetail, setRequestDetail] = useState<any>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { t } = useTranslation();
  const amountItems: Item[] = [
    { key: 'all', label: t('allRequest') },
    { key: 'asc', label: t('Ascending') },
    { key: 'dsc', label: t('Descending') }
  ];
  const dateItems: Item[] = [
    { key: 'all', label: t('allRequest') },
    { key: 'asc', label: t('Ascending') },
    { key: 'dsc', label: t('Descending') }
  ];
  const statusItems: Item[] = [
    { key: 'all', label: t('allRequest') },
    { key: 'acp', label: t('Accepted') },
    { key: 'den', label: t('Denied') },
    { key: 'pen', label: t('Pending') }
  ];

  const [filteredRequest, setFilteredRequest] = useState<any>();
  const [emailFilter, setEmailFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDesc, setOpenDesc] = useState(false);
  const [description, setDescription] = useState('');


  useEffect(() => {
    const applyFilters = () => {
      let updatedRequest = requestList;

      // Filter by email
      if (emailFilter) {
        updatedRequest = updatedRequest.filter(request =>
          request.managerEmail.toLowerCase().includes(emailFilter.toLowerCase())
        );
      }

      // Filter by status
      if (statusFilter && statusFilter !== 'all') {
        updatedRequest = updatedRequest.filter(request => {
          if (statusFilter === 'acp') {
            return request.status === true;
          } else if (statusFilter === 'den') {
            return request.status === false && request.dateAuthenticate;
          } else if (statusFilter === 'pen') {
            return !request.dateAuthenticate;
          }
          return true;
        });
      }

      // Sort by amount
      if (amountFilter && amountFilter !== 'all') {
        updatedRequest = updatedRequest.slice().sort((a, b) => {
          if (amountFilter === 'asc') {
            return a.amount - b.amount;
          } else if (amountFilter === 'dsc') {
            return b.amount - a.amount;
          }
          return 0;
        });
      }

      // Sort by date
      if (dateFilter && dateFilter !== 'all') {
        updatedRequest = updatedRequest.slice().sort((a, b) => {
          if (dateFilter === 'asc') {
            return moment(a.dateCreateWithdrawalOrder).diff(b.dateCreateWithdrawalOrder);
          } else if (dateFilter === 'dsc') {
            return moment(b.dateCreateWithdrawalOrder).diff(a.dateCreateWithdrawalOrder);
          }
          return 0;
        });
      }
      setFilteredRequest(updatedRequest);
    };

    applyFilters();
  }, [emailFilter, amountFilter, dateFilter, statusFilter, requestList]);

  const load = async () => {
    try {
      const res = await axiosInstance.get(`/courtstar/transfer-money/all`);
      const sortedData = res.data.data
        .map((item) => ({ ...item, loading: false }))
        .sort((a, b) => b.id - a.id);
      setRequestList(sortedData);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRequestDetail = (request) => {
    setRequestDetail(request);
    setIsOpenModal(true);
  };

  const requestInfo = (
    <div className="text-black w-96">
      <div className="">
        <span className="font-semibold">Email:</span> {requestDetail?.managerEmail}
      </div>
      <div className="">
        <span className="font-semibold">{t('createdDate')}:</span> {moment(requestDetail?.dateCreateWithdrawalOrder).format('yyyy-MM-DD')}
      </div>
      <div className="">
        {requestDetail?.dateAuthenticate &&
          <>
            <span className="font-semibold">{t('responseDate')}:</span> {moment(requestDetail?.dateAuthenticate).format('yyyy-MM-DD')}
          </>
        }
      </div>

      <div className="">
        <span className="font-semibold">{t('bankName')}:</span> {requestDetail?.nameBanking}
      </div>

      <div className="">
        <span className="font-semibold">{t('cardholderName')}:</span> {requestDetail?.cardHolderName}
      </div>

      <div className="">
        <span className="font-semibold">{t('accountNumber')}:</span> {requestDetail?.numberBanking}
      </div>

      {!requestDetail?.dateAuthenticate
        ?
        <>
          {!requestDetail?.loading
            ?
            <div className="mt-2 flex gap-1 w-full">
              <Button
                className="text-center text-white bg-primary-green font-semibold w-full py-1 border-primary-green border-2 rounded hover:bg-teal-900 hover:text-white"
                icon={<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20"
                  viewBox="0 0 24 24" fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>}
                label={t('accept')}
                onClick={() => {
                  showAlert({
                    title: t('areYouSure') + "?",
                    message: t('youAllowThisWithdrawalRequest') + "!",
                    type: 'success',
                    onConfirmClick: () => handleAcceptRequest(requestDetail)
                  });
                }}
              />
              <Button
                className="text-center text-red-500 font-semibold w-full py-1 border-red-500 border-2 rounded hover:bg-red-500 hover:text-white"
                icon={<svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>}
                label={t('deny')}
                onClick={() => setOpenDesc(true)}
              />
            </div>
            :
            <div className="mx-auto mt-2">
              <SpinnerLoading
                width="24"
                height="24"
                color="#2b5a50"
              />
            </div>
          }
        </>
        :
        <>
          {requestDetail?.status
            ?
            <div className="text-center py-1 mt-2 text-white bg-primary-green font-semibold rounded">
              {t('Accepted')}
            </div>
            :
            <div className="text-center py-1 mt-2 text-white bg-rose-500 font-semibold rounded">
              {t('Denied')}
            </div>
          }
        </>
      }
    </div>
  );

  const handleAcceptRequest = async (request) => {
    setRequestDetail((prev) => ({
      ...prev,
      loading: true
    }));
    try {
      const res = await axiosInstance.post(`/courtstar/transfer-money/authenticate-withdrawal-order/${request.id}`);
      toast.success('Accepted withdrawal!', {
        toastId: 'accept-withdrawal-success'
      });
      if (res.data.data) {
        load();
        setIsOpenModal(false);
      }
    } catch (error: any) {
      toast.error(error.message, {
        toastId: 'accept-withdrawal-unsuccess'
      });
    }
  };

  const handleDenyRequest = async (request) => {
    setOpenDesc(false);
    setRequestDetail((prev) => ({
      ...prev,
      loading: true
    }));
    try {
      const res = await axiosInstance.post(`/courtstar/transfer-money/authenticate-deny-withdrawal-order/${request.id}`, { description });
      toast.success('Denied withdrawal!', {
        toastId: 'deny-withdrawal-success'
      });
      if (res.data.data) {
        load();
        setIsOpenModal(false);
        setDescription('');
      }
    } catch (error: any) {
      toast.error(error.message, {
        toastId: 'deny-withdrawal-unsuccess'
      });
      setDescription('');
      setRequestDetail((prev) => ({
        ...prev,
        loading: false
      }));
    }
  };

  useEffect(() => {
    load();
  }, []);

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
        onClick={() => handleDenyRequest(requestDetail)}
      />
    </div>
  )

  return (
    <div className="py-6 w-full">
      <PopupModal
        isOpen={isOpenModal}
        setIsOpen={() => {
          setIsOpenModal(false);
          setRequestDetail(null);
        }}
        html={requestInfo}
        title={t('requestDetail')}
        centreInfo
      />
      <PopupModal
        isOpen={openDesc}
        setIsOpen={() => setOpenDesc(false)}
        html={formDesc}
        centreInfo
        title={t('reasonForDenial')}
      />
      <div className="text-3xl font-bold mb-4">
        {t('withdrawalRequest')}
      </div>
      {loading ? (
        <div className="h-[500px] flex items-center justify-center">
          <SpinnerLoading height='80' width='80' color='#2B5A50' />
        </div>
      ) : (
        <>
          <div className="px-10 bg-white py-4 grid grid-cols-4 gap-x-1 rounded-xl shadow">
            <div className="">
              <InputText
                placeholder={t('enterManagerEmail')}
                label={t('managerEmail')}
                value={emailFilter}
                onchange={(e) => setEmailFilter(e.target.value)}
              />
            </div>
            <div className="">
              <div className="font-semibold mb-2">{t('amount')}</div>
              <Dropdown
                placeholder={t('selectAmount')}
                items={amountItems}
                onSelect={(item) => setAmountFilter(item?.key ?? 'all')}
                buttonClassName='!px-3'
              />
            </div>
            <div className="">
              <div className="font-semibold mb-2">{t('dateCreate')}</div>
              <Dropdown
                placeholder={t('selectDateCreate')}
                items={dateItems}
                onSelect={(item) => setDateFilter(item?.key ?? 'all')}
                buttonClassName='!px-3'
              />
            </div>
            <div className="">
              <div className="font-semibold mb-2">{t('status')}</div>
              <Dropdown
                placeholder={t('selectStatus')}
                items={statusItems}
                onSelect={(item) => setStatusFilter(item?.key ?? 'all')}
                buttonClassName='!px-3'
              />
            </div>
          </div>
          {filteredRequest && filteredRequest.length > 0 ? (
            filteredRequest.map((request) => (
              <div
                key={request.id}
                className={`grid grid-cols-4 py-3 px-10 mt-2 rounded-lg shadow ease-in-out duration-300 font-medium
                        ${!request.dateAuthenticate ? 'bg-white' : 'bg-slate-50'}
                        hover:px-8 cursor-pointer`}
                onClick={() => handleOpenRequestDetail(request)}
              >
                <div className="self-center font-semibold ml-5 truncate">
                  {request.managerEmail}
                </div>
                <div className="self-center text-center truncate">
                  {request.amount.toLocaleString('de-DE')} VND
                </div>
                <div className="self-center text-center truncate">
                  {moment(request.dateCreateWithdrawalOrder).format('yyyy-MM-DD')}
                </div>
                {request.status ?
                  <div className="text-xs mx-auto py-1 px-2 text-white bg-primary-green w-fit font-semibold rounded">
                    {t('Accepted')}
                  </div>
                  : !request.dateAuthenticate ?
                    <div className="text-xs mx-auto py-1 px-2 text-white bg-yellow-400 w-fit font-semibold rounded">
                      {t('Pending')}
                    </div>
                    :
                    <div className="text-xs mx-auto py-1 px-2 text-white bg-rose-500 w-fit font-semibold rounded">
                      {t('Denied')}
                    </div>
                }
              </div>
            ))
          ) : (
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
          )}
        </>
      )}
    </div>
  );
};

export default Withdrawal;
