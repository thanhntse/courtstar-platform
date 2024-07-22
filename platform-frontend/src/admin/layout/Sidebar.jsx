import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Sidebar = (props) => {

  const { t } = useTranslation();
  const [selectTab, setSelectTab] = useState(1);
  const [selectTabItem, setSelectTabItem] = useState();

  useEffect(() => {
    props.onDataTabSubmit(selectTab);
    if (selectTab === 3) {
      setSelectTabItem(1);
      props.onDataTabItemSubmit(1);
    }
  }, [selectTab])

  const handleSubmit = (value) => {
    setSelectTab(value);
  };

  const handleSelectTabItem = (value) => {
    setSelectTabItem(value);
    props.onDataTabItemSubmit(value);
  }

  return (
    <div className="bg-white w-1/6 flex flex-col gap-2 px-3 py-3 min-h-screen">

      <div
        className={
          selectTab === 1
            ? "flex gap-2 font-semibold text-lg items-center py-1 bg-primary-green px-2 text-white cursor-pointer rounded-md ease-in-out duration-200"
            : 'flex gap-2 font-semibold text-lg items-center py-1 hover:bg-primary-green hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200'
        }
        onClick={() => handleSubmit(1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-square-activity"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M17 12h-2l-2 5-2-10-2 5H7" />
        </svg>
        <div>
          {t('dashboard')}
        </div>
      </div>

      <div
        className={
          selectTab === 2
            ?
            "flex gap-2 font-semibold text-lg items-center py-1 bg-primary-green px-2 text-white cursor-pointer rounded-md ease-in-out duration-200"
            :
            "flex gap-2 font-semibold text-lg items-center py-1 hover:bg-primary-green hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200"
        }
        onClick={() => handleSubmit(2)}
      >
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
        {t('allCenTre')}
      </div>

      <div className="">
        <div
          className={
            selectTab === 3
              ?
              "flex gap-2 font-semibold text-lg items-center py-1 bg-primary-green px-2 text-white rounded-md"
              :
              "flex gap-2 font-semibold text-lg items-center py-1 hover:bg-primary-green hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200"
          }
          onClick={() => handleSubmit(3)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-square-user"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
          </svg>
          {t('allUser')}
        </div>

        {selectTab === 3 &&
          <div className="ml-4 mt-1 flex flex-col gap-0.5 animate-fade-in-down transition-all ease-in-out duration-200">
            <div className=
              {
                (selectTabItem === 1)
                  ? "flex gap-2 font-medium items-center py-1 bg-black px-2 text-white cursor-pointer rounded-md ease-in-out duration-200"
                  : "flex gap-2 font-medium items-center py-1 hover:bg-black hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200"
              }
              onClick={() => handleSelectTabItem(1)}
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
              {t('centreManager')}
            </div>
            <div className=
              {
                (selectTabItem === 2)
                  ? "flex gap-2 font-medium items-center py-1 bg-black px-2 text-white cursor-pointer rounded-md ease-in-out duration-200"
                  : "flex gap-2 font-medium items-center py-1 hover:bg-black hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200"
              }
              onClick={() => handleSelectTabItem(2)}
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
              {t('manageStaff')}
            </div>
            <div className=
              {
                (selectTabItem === 3)
                  ? "flex gap-2 font-medium items-center py-1 bg-black px-2 text-white cursor-pointer rounded-md ease-in-out duration-200"
                  : "flex gap-2 font-medium items-center py-1 hover:bg-black hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200"
              }
              onClick={() => handleSelectTabItem(3)}
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
              {t('customer')}
            </div>
          </div>
        }

      </div>

      <div
        className={
          selectTab === 4
            ?
            "flex gap-2 font-semibold text-lg items-center py-1 bg-primary-green px-2 text-white cursor-pointer rounded-md ease-in-out duration-200"
            :
            "flex gap-2 font-semibold text-lg items-center py-1 hover:bg-primary-green hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200"
        }
        onClick={() => handleSubmit(4)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-hand-coins"
        >
          <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
          <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
          <path d="m2 16 6 6" />
          <circle cx="16" cy="9" r="2.9" />
          <circle cx="6" cy="5" r="3" />
        </svg>
        {t('withdrawalRequest')}
      </div>

      <div
        className={
          selectTab === 5
            ?
            "flex gap-2 font-semibold text-lg items-center py-1 bg-primary-green px-2 text-white cursor-pointer rounded-md ease-in-out duration-200"
            :
            "flex gap-2 font-semibold text-lg items-center py-1 hover:bg-primary-green hover:px-2 hover:text-white cursor-pointer rounded-md ease-in-out duration-200"
        }
        onClick={() => handleSubmit(5)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-clipboard-list"
        >
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M12 11h4" />
          <path d="M12 16h4" />
          <path d="M8 11h.01" />
          <path d="M8 16h.01" />
        </svg>
        {t('postCentreRequest')}
      </div>

    </div>
  );
}

export default Sidebar;
