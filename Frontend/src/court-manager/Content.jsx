import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import SpinnerLoading from '../components/SpinnerLoading';
import StaffInfo from './StaffInfo';
import CheckIn from './CheckIn';
import CentreInfo from './CentreInfo';
import MyBalance from './MyBalance';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const Content = (props) => {

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [centreDetail, setCentreDetail] = useState({});
  const [imgList, setImgList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [checkIn, setCheckIn] = useState([]);
  const handleAddCentrePopup = props.handleAddCentrePopup;
  const [isCentreID, setIsCentreID] = useState();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setLoading(true);
    if (id >= 0) {
      const load = async () => {
        setImgList([]);
        setCentreDetail({});
        await axiosInstance.get(`/courtstar/centre/getCentre/${id}`, { signal })
          .then(res => {
            setCentreDetail(res.data.data);
            setImgList(res.data.data.images);
            setStaffList(res.data.data.centreStaffs);
            axiosInstance.get(`/courtstar/feedback/${id}`)
              .then(res => {
                setFeedbackList(res.data.data);
                console.log(res.data.data);
              })
              .catch(error => {
                console.log(error.message);
              })
              .finally(() => {
                setLoading(false);
              })
          })
          .catch(error => {
            console.log(error.message);
          })
          .finally(
            () => {
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
          );
      }
      load();
      const loadCheckIn = async () => {
        setLoading(true);
        await axiosInstance.get(`/courtstar/booking/${id}`, { signal })
          .then(res => {
            setCheckIn(res.data.data);
          })
          .catch(error => {
            console.log(error.message);
          })
          .finally(
            () => {
              setTimeout(() => {
                setLoading(false);
              }, 1000);
            }
          );
      }
      loadCheckIn();
    }

    return () => {
      controller.abort();
    }
  }, [id, isCentreID])

  const handleGetCentreID = (value) => {
    setIsCentreID(value)
  }

  return (
    <div className="flex-1 flex justify-center max-w-screen-1440 px-14 mx-auto">

      {
        id === "balance"
          ?
          <>
            <MyBalance
              balanceDetail={props.balanceDetail}
              handleAddCentrePopup={handleAddCentrePopup}
            />
          </>
          :
          <>
            {loading
              ?
              <div className="h-[500px] flex items-center justify-center">
                < SpinnerLoading
                  height='80'
                  width='80'
                  color='#2B5A50'
                />
              </div>
              :

              <>
                {props.tab === 0 &&
                  (
                    <CentreInfo
                      centreDetail={centreDetail}
                      imgList={imgList}
                      apiFeedbacks={feedbackList}
                      isCentreID={handleGetCentreID}
                    />
                  )
                }

                {
                  props.tab === 1 &&
                  (
                    <div className="">
                      <StaffInfo
                        staffList={staffList}
                      />
                    </div>
                  )
                }

                {
                  props.tab === 2 &&
                  (
                    <div className="">
                      <CheckIn
                        apiCheckin={checkIn}
                        centreDetail={centreDetail}
                      />
                    </div>
                  )
                }
              </>}
          </>}
    </div >
  );
}

export default Content;
