import { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import SpinnerLoading from '../components/SpinnerLoading';
import Content from './layout/Content';
import { useAuth } from '../context/AuthContext';
import AddCentre from './content/centre/AddCentre';
import Sidebar from './layout/Sidebar';

const MyCentre = () => {

  const { state, dispatch } = useAuth();
  const { role } = state;
  const [centreList, setCentreList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState();
  const [balanceDetail, setBalanceDetail] = useState();
  const [isCentreID, setIsCentreID] = useState();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const load = async () => {
      await axiosInstance.get(`/courtstar/centre/getAllCentresOfManager`, { signal })
        .then(res => {
          setCentreList(res.data.data);
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

    const loadByStaff = async () => {
      await axiosInstance.get(`/courtstar/centre/getCentreOfStaff`, { signal })
        .then(res => {
          setCentreList(res.data.data);
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

    const loadBalanceDetail = async () => {
      setLoading(true);
      await axiosInstance.get(`/courtstar/manager/info`, { signal })
        .then(res => {
          setBalanceDetail(res.data.data);
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

    if (role === 'MANAGER') {
      load();
      loadBalanceDetail();
    }
    else
      loadByStaff();

    return () => {
      controller.abort();
    }

  }, [isCentreID]);

  const handleChooseTabFromSidebar = (tab) => {
    setTab(tab);
  }


  const handleGetCentreID = (value) => {
    setIsCentreID(value)
  }

  //add centre handle
  const [addCentrePopup, setAddCentrePopup] = useState(false);
  const handleAddCentrePopup = () => {
    setAddCentrePopup(true);
  }
  const handleAddCentrePopupClose = () => {
    setAddCentrePopup(false)
  }


  return (
    <div className="">
      <AddCentre
        isOpen={addCentrePopup}
        setIsOpen={handleAddCentrePopupClose}
        dataIdCentre={handleGetCentreID}
      />
      {loading
        ?
        <div className="min-h-screen flex items-center justify-center">
          <SpinnerLoading
            height='80'
            width='80'
            color='#2B5A50'
          />
        </div>
        :
        <div className='bg-gray-100 text-gray-800 flex'>
          <Sidebar
            centreList={centreList}
            onDataTabSubmit={handleChooseTabFromSidebar}
            handleAddCentrePopup={handleAddCentrePopup}
            dataIsCentreId={isCentreID}
          />
          <Content
            balanceDetail={balanceDetail}
            tab={tab}
            handleAddCentrePopup={handleAddCentrePopup}
          />
        </div>
      }
    </div>
  );
}

export default MyCentre;
