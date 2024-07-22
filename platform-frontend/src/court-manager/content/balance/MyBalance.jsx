import { useEffect, useRef, useState } from 'react'
import Counter from '../../../components/Counter';
import Button from '../../../components/button';
import { useTranslation } from 'react-i18next';
import SpinnerLoading from '../../../components/SpinnerLoading';
import PaymentHistory from './PaymentHistory';
import PopupModal from '../../../components/PopupModal';
import InputText from '../../../components/input-text';
import axiosInstance from '../../../config/axiosConfig';
import { toast } from 'react-toastify';

export default function MyBalance(props) {

  const { t } = useTranslation();
  const [balanceDetail, setBalanceDetail] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formWithdraw, setFormWithdraw] = useState({
    nameBanking: '',
    numberBanking: '',
    amount: '',
    cardHolderName: ''
  })

  const childRef = useRef();

  useEffect(() => {
    if (props.balanceDetail) {
      setBalanceDetail(props.balanceDetail);
    }
  }, [props.balanceDetail])

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormWithdraw((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  const handleWithdraw = async () => {
    setLoading(true);
    if (!formWithdraw.amount || formWithdraw.amount === "0") {
      toast.error('Create request withdrawal error!', {
        toastId: 'create-request-withdrawal-error'
      });
      setLoading(false);
    }
    else
    await axiosInstance.post(`/courtstar/transfer-money/create-withdrawal/${balanceDetail.id}`, formWithdraw)
      .then(res => {
        if (res.data.data) {
          toast.success('Create request withdrawal success!', {
            toastId: 'create-request-withdrawal-success'
          })
          setOpenModal(false);
          setFormWithdraw({
            nameBanking: '',
            numberBanking: '',
            amount: '',
            cardHolderName: ''
          });
          childRef.current.increment();
        }
      })
      .catch(error => {
        console.log(error.message);
        toast.error('Create request withdrawal error!', {
          toastId: 'create-request-withdrawal-error'
        });
      })
      .finally(
        () => {
          setLoading(false);
        }
      );
  }

  const htmlModal = (
    <div className="flex flex-col gap-3 w-[440px]">
      <InputText
        id='nameBanking'
        name='nameBanking'
        label="Bank's name"
        value={formWithdraw.nameBanking}
        placeholder="Enter your bank's name"
        onchange={handleInputChange}
      />

      <InputText
        // type='number'
        id='numberBanking'
        name='numberBanking'
        label="Bank account number"
        value={formWithdraw.numberBanking}
        placeholder="Enter your bank account number"
        onchange={handleInputChange}
      />

      <InputText
        id='cardHolderName'
        name='cardHolderName'
        label="Holder name"
        value={formWithdraw.cardHolderName.toUpperCase()}
        placeholder="Enter your bank account holder name"
        onchange={handleInputChange}
      />

      <InputText
        type='number'
        id='amount'
        name='amount'
        label="Amount"
        value={formWithdraw.amount}
        placeholder="Enter amount of money"
        onchange={handleInputChange}
      />

      <Button
        label={t('confirm')}
        fullWidth
        fullRounded
        size='medium'
        className='bg-primary-green hover:bg-teal-900 text-white'
        onClick={handleWithdraw}
        loading={loading}
      />
    </div>
  )

  return (

    !balanceDetail ?

      <div className="h-[500px] flex items-center justify-center">
        <SpinnerLoading
          height='80'
          width='80'
          color='#2B5A50'
        />
      </div>

      :

      <div className='w-full my-6 rounded-lg'>
        <PopupModal
          isOpen={openModal}
          html={htmlModal}
          setIsOpen={() => {
            setOpenModal(false);
            setFormWithdraw({
              nameBanking: '',
              numberBanking: '',
              amount: '',
              cardHolderName: ''
            });
          }}
          centreInfo
          title={'Your Information'}
        />
        <div className='w-full h-[20rem] rounded-lg relative flex justify-between shadow-lg'>
          <div className='absolute w-full h-full overflow-hidden rounded-lg'>
            <img
              src="/images/bg-balance.svg"
              alt="bg-balance"
              className='object-cover object-center w-full h-full'
            />
          </div>
          <div className='z-10 px-20 w-full flex flex-col gap-10 justify-center'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-2xl font-semibold mb-2'>{t('myBalance')}</div>
                <div className='text-5xl flex gap-2 font-bold'>
                  <Counter
                    endNumber={balanceDetail?.currentBalance}
                    duration={1000}
                  />
                  <span className='text-base'>VND</span>
                </div>
              </div>
              <div>
                <Button
                  label={t('withdraw')}
                  size='large'
                  className='bg-slate-200 hover:bg-primary-green hover:text-white font-semibold text-primary-green'
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>
                  }
                  onClick={() => setOpenModal(true)}
                />
              </div>
            </div>

            <div className='flex gap-10'>

              <div className='py-3 px-5 w-full shadow-md rounded-lg bg-white font-semibold'>
                <div className='flex justify-between items-center mb-2'>
                  <div>{t('todayIncome')}</div>
                  {
                    balanceDetail?.percent.income >= 0
                      ?
                      <div className='text-xs text-teal-600'>
                        <Counter
                          endNumber={balanceDetail?.percent.income}
                          duration={1000}
                          postfix='%'
                          prefix='+'
                        />
                      </div>
                      :
                      <div className='text-xs text-red-600'>
                        <Counter
                          endNumber={balanceDetail?.percent.income}
                          duration={1000}
                          postfix='%'
                        />
                      </div>
                  }
                </div>
                <div className='text-lg flex gap-0.5 font-bold'>
                  <Counter
                    endNumber={balanceDetail?.todayIncome}
                    duration={1000}
                  />
                  <span className='text-[7px]'>VND</span>
                </div>
              </div>

              <div className='py-3 px-5 w-full shadow-md rounded-lg bg-white font-semibold'>
                <div className='flex justify-between items-center mb-2'>
                  <div>{t('todayBookings')}</div>
                  {
                    balanceDetail?.percent.booking >= 0
                      ?
                      <div className='text-xs text-teal-600'>
                        <Counter
                          endNumber={balanceDetail?.percent.booking}
                          duration={1000}
                          postfix='%'
                          prefix='+'
                        />
                      </div>
                      :
                      <div className='text-xs text-red-600'>
                        <Counter
                          endNumber={balanceDetail?.percent.booking}
                          duration={1000}
                          postfix='%'
                        />
                      </div>
                  }
                </div>
                <div className='text-lg flex gap-0.5 font-bold'>
                  <Counter
                    endNumber={balanceDetail?.todayBookings}
                    duration={1000}
                  />
                </div>
              </div>

              <div className='py-3 px-5 w-full shadow-md rounded-lg bg-white font-semibold'>
                {t('pending')}
                <div className='text-lg flex gap-0.5 font-bold mt-2'>
                  <Counter
                    endNumber={balanceDetail?.pending}
                    duration={1000}
                  />
                  <span className='text-[7px]'>VND</span>
                </div>
              </div>

              <div className='py-3 px-5 w-full shadow-md rounded-lg bg-white font-semibold'>
                {t('weekRevenue')}
                <div className='text-lg flex gap-0.5 font-bold mt-2'>
                  <Counter
                    endNumber={balanceDetail?.weekRevenue}
                    duration={1000}
                  />
                  <span className='text-[7px]'>VND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <PaymentHistory
            ref={childRef}
          />
        </div>
      </div>
  )
}
