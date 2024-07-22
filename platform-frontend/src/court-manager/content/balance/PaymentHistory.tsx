import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import SpinnerLoading from '../../../components/SpinnerLoading';
import InputText from '../../../components/input-text';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Dropdown, { Item } from '../../../components/dropdown';

interface ChildHandle {
  increment: () => void;
}

const PaymentHistory = forwardRef<ChildHandle>((_, ref) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [histories, setHistories] = useState<any>([]);
  const [filteredHistories, setFilteredHistories] = useState<any>([]);
  const [bankFilter, setBankFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [cardHolderFilter, setCardHolderFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(1);

  const statusOptions: Item[] = [
    { key: 1, label: t('allRequest') },
    { key: 2, label: t("Pending") },
    { key: 3, label: t("Accepted") },
    { key: 4, label: t("Denied") }
  ];

  const dateItems: Item[] = [
    { key: 'all', label: t('allRequest') },
    { key: 'asc', label: t('Ascending') },
    { key: 'dsc', label: t('Descending') }
  ];

  useImperativeHandle(ref, () => ({
    increment() {
      loadHistory();
    }
  }));

  const controller = new AbortController();
  const { signal } = controller;

  const loadHistory = async () => {
    try {
      const res = await axiosInstance.get(`/courtstar/transfer-money/manager/all`, { signal });
      const sortedHistories = res.data.data.sort((a, b) => b.id - a.id);
      setHistories(sortedHistories);
    } catch (err:any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedHistories = histories;

      if (bankFilter) {
        updatedHistories = updatedHistories.filter(history =>
          history.nameBanking.toLowerCase().includes(bankFilter.toLowerCase())
        );
      }

      if (accountFilter) {
        updatedHistories = updatedHistories.filter(history =>
          history.numberBanking.toLowerCase().includes(accountFilter.toLowerCase())
        );
      }

      if (cardHolderFilter) {
        updatedHistories = updatedHistories.filter(history =>
          history.cardHolderName.toLowerCase().includes(cardHolderFilter.toLowerCase())
        );
      }

      if (amountFilter) {
        updatedHistories = updatedHistories.filter(history =>
          history.amount.toString().includes(amountFilter)
        );
      }

      if (dateFilter && dateFilter !== 'all') {
        updatedHistories = updatedHistories.slice().sort((a, b) => {
          if (dateFilter === 'asc') {
            return moment(a.dateCreateWithdrawalOrder).diff(b.dateCreateWithdrawalOrder);
          } else if (dateFilter === 'dsc') {
            return moment(b.dateCreateWithdrawalOrder).diff(a.dateCreateWithdrawalOrder);
          }
          return 0;
        });
      }

      if (statusFilter && statusFilter !== 1) {
        updatedHistories = updatedHistories.filter(history => {
          if (statusFilter === 2) return !history.dateAuthenticate;
          if (statusFilter === 3) return history.status;
          if (statusFilter === 4) return !history.status && history.dateAuthenticate;
          return true;
        });
      }

      setFilteredHistories(updatedHistories);
    };

    applyFilters();
  }, [bankFilter, accountFilter, cardHolderFilter, amountFilter, dateFilter, statusFilter, histories]);

  return (
    loading
      ?
      <div className="h-[300px] flex items-center justify-center">
        <SpinnerLoading
          height='80'
          width='80'
          color='#2B5A50'
        />
      </div>
      :
      <div className="mt-4">
        <div className="bg-white shadow rounded-xl">
          <div className="text-center font-semibold text-white py-1.5 text-2xl bg-primary-green rounded-t-xl">
            {t('withdrawalHistory')}
          </div>
          {histories?.length > 0
            ?
            <div className="px-10 py-4 grid grid-cols-12 gap-2">
              <div className="col-span-2">
                <InputText
                  placeholder={t('enterNameBank')}
                  label={t('bankName')}
                  value={bankFilter}
                  onchange={(e) => setBankFilter(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <InputText
                  placeholder={t('enterAccountNumber')}
                  label={t('accountNumber')}
                  value={accountFilter}
                  onchange={(e) => setAccountFilter(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <InputText
                  placeholder={t('enterCardholderName')}
                  label={t('cardholderName')}
                  value={cardHolderFilter}
                  onchange={(e) => setCardHolderFilter(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <InputText
                  placeholder={t('enterAmount')}
                  label={t('amount')}
                  value={amountFilter}
                  onchange={(e) => setAmountFilter(e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Dropdown
                  placeholder={t('selectDateCreate')}
                  label={t('dateCreate')}
                  items={dateItems}
                  onSelect={(item) => setDateFilter(item?.key ?? 'all')}
                />
              </div>
              <div className="col-span-2">
                <Dropdown
                  label={t('status')}
                  items={statusOptions}
                  onSelect={(item:any) => setStatusFilter(item.key)}
                  placeholder={t('selectStatus')}
                />
              </div>
            </div>
            :
            <div className='flex flex-col items-center justify-center h-[300px] text-3xl text-primary mx-auto'>
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
        </div>
        <div className="mt-2 font-medium">
          {filteredHistories?.map((item: any) => (
            <div
              key={item.id}
              className="bg-white px-10 py-2 grid grid-cols-12 gap-2 mt-2 rounded-lg shadow"
              onClick={() => { }}
            >
              <div className="col-span-2 px-3 flex items-center truncate">
                {item?.nameBanking}
              </div>
              <div className="col-span-2 px-3 flex items-center truncate">
                {item?.numberBanking}
              </div>
              <div className="col-span-2 flex items-center justify-center">
                {item?.cardHolderName}
              </div>
              <div className="col-span-2 flex items-center justify-center">
                {item?.amount.toLocaleString('de-DE')} VND
              </div>
              <div className="col-span-2 flex flex-col justify-center items-center font-semibold">
                {moment(item?.dateCreateWithdrawalOrder).format("yyyy-MM-DD")}
              </div>
              {item?.dateAuthenticate
                ?
                <>
                  {item?.status
                    ?
                    <div className="col-span-2 text-xs mx-auto py-1 px-2 text-white bg-primary-green w-fit font-semibold rounded">
                      {t("Accepted")}
                    </div>
                    :
                    <div className="col-span-2 text-xs mx-auto py-1 px-2 text-white bg-rose-500 w-fit font-semibold rounded">
                      {t("Denied")}
                    </div>
                  }
                </>
                :
                <div className="col-span-2 text-xs mx-auto py-1 px-2 text-white bg-yellow-400 w-fit font-semibold rounded">
                  {t("Pending")}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
  )
});

export default PaymentHistory;
