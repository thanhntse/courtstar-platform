import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = (props) => {
  const { t } = useTranslation();
  const { state, dispatch } = useAuth();
  const { role } = state;
  const navigate = useNavigate();
  const [centreIsSelected, setCentreIsSelected] = useState(
    role === "STAFF" ? props.centreList.id : "balance"
  );
  const [tab, setTab] = useState();

  if (role && !(role === 'STAFF')) {
    useEffect(() => {
      const url = window.location.href;
      const id = url.split('/myCentre/')[1];
      if (id === "balance") setCentreIsSelected(id);
      else setCentreIsSelected(parseInt(id));
      handleSelectTab(0);
    }, []);
  } else {
    useEffect(() => {
      navigate(`/myCentre/${props.centreList.id}`);
      setCentreIsSelected(parseInt(props.centreList.id));
      handleSelectTab(0);
    }, []);
  }

  useEffect(() => {
    if (props.dataIsCentreId) {
      setCentreIsSelected(props.dataIsCentreId)
      handleDropdown(props.dataIsCentreId)
    }
  }, [props.dataIsCentreId])

  const handleDropdown = (centreId) => {
    navigate(`/myCentre/${centreId}`)
    setCentreIsSelected(centreId);
    handleSelectTab(0);
  }

  const handleSelectTab = (value) => {
    setTab(value);
    props.onDataTabSubmit(value);
  }

  console.log(typeof (props.centreList));

  return (
    <div className="bg-white w-1/6 flex flex-col gap-3 px-5 py-3 min-h-screen">


      {role !== "STAFF" &&
        <div className="">
          <div
            onClick={() => handleDropdown("balance")}
            className=
            {
              centreIsSelected === "balance"
                ? "flex gap-2 items-center py-1 font-bold text-lg px-3 rounded-md bg-primary-green text-white cursor-pointer scale-105 ease-in-out duration-300"
                : "flex gap-2 items-center py-1 font-bold text-lg cursor-pointer hover:px-3 rounded-md hover:bg-primary-green hover:text-white hover:scale-105 ease-in-out duration-300"
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
            {t('myBalance')}
          </div>
        </div>
      }
      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 font-bold text-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-layout-dashboard">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            {t('myCentre')}
          </div>
          {!(role === 'STAFF') &&
            <button
              className="flex gap-2 p-1 w-fit rounded-md text-primary-green hover:bg-primary-green hover:text-white
            ease-in-out duration-300 cursor-pointer"
              onClick={props.handleAddCentrePopup}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18" height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-plus"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>}
        </div>
        <div className="flex flex-col gap-1 mt-1">
          {!(role === 'STAFF')
            ?
            <>
              {props.centreList.map((centre) => (
                <div
                  key={centre.id}
                  className=""
                >
                  <div
                    className=
                    {
                      centreIsSelected === centre.id
                        ?
                        'bg-primary-green text-lg text-white pl-3 py-1 rounded-md ease-in-out duration-300 font-semibold cursor-pointer'
                        :
                        'py-1 rounded-md hover:bg-primary-green text-lg hover:text-white truncate hover:pl-1.5 ease-in-out duration-300 font-semibold cursor-pointer'
                    }
                    onClick={() => handleDropdown(centre.id)}
                  >
                    {centre.name}
                  </div>

                  {centreIsSelected === centre.id && (
                    <div className="flex flex-col gap-1 pl-5 mt-1 animate-fade-in-down transition-all ease-in-out duration-300">
                      <div
                        onClick={() => handleSelectTab(1)}
                        className=
                        {tab === 1
                          ? 'flex gap-2 items-center cursor-pointer rounded-md pl-3 py-1 bg-gray-800 text-white'
                          : 'flex gap-2 items-center cursor-pointer rounded-md hover:pl-3 py-1 hover:bg-gray-800 hover:text-white ease-in-out duration-300'
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18" height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-user"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {t('centreStaff')}
                      </div>
                      <div
                        onClick={() => handleSelectTab(2)}
                        className=
                        {tab === 2
                          ? 'flex gap-2 items-center cursor-pointer py-1 rounded-md px-3 bg-gray-800 text-white'
                          : 'flex gap-2 items-center cursor-pointer py-1 rounded-md hover:px-3 hover:bg-gray-800 hover:text-white ease-in-out duration-300'
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20" height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          class="lucide lucide-ticket-check"
                        >
                          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        Check in
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </>
            :
            <div
              className=""
            >
              <div
                className=
                {
                  centreIsSelected === props.centreList.id
                    ?
                    'bg-primary-green text-white pl-3 py-1.5 rounded-md ease-in-out duration-300 font-semibold cursor-pointer'
                    :
                    'py-1.5 rounded-md hover:bg-primary-green hover:text-white truncate hover:pl-1.5 ease-in-out duration-300 font-semibold cursor-pointer'
                }
                onClick={() => handleDropdown(props.centreList.id)}
              >
                {props.centreList.name}
              </div>

              {centreIsSelected === props.centreList.id && (
                <div className="flex flex-col gap-1 pl-5 mt-1 animate-fade-in-down transition-all ease-in-out duration-300">
                  {!(role === 'STAFF') &&
                    <div
                      onClick={() => handleSelectTab(1)}
                      className=
                      {tab === 1
                        ? 'cursor-pointer rounded-md pl-3 bg-gray-800 text-white'
                        : 'cursor-pointer rounded-md hover:pl-3 hover:bg-gray-800 hover:text-white ease-in-out duration-300'
                      }
                    >
                      {t('centreStaff')}
                    </div>
                  }

                  <div
                    onClick={() => handleSelectTab(2)}
                    className=
                    {tab === 2
                      ? 'flex gap-2 cursor-pointer rounded-md px-3 bg-gray-800 text-white'
                      : 'flex gap-2 cursor-pointer rounded-md hover:px-3 hover:bg-gray-800 hover:text-white ease-in-out duration-300'
                    }
                  >

                    Check in
                  </div>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
