import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import Content from './layout/Content';

const Admin = () => {
  const [tab, setTab] = useState();
  const [tabItem, setTabItem] = useState();

  const handleChooseTabFormSideBar = (value) => {
    setTab(value);
  };

  const handleChooseTabItemFormSideBar = (value) => {
    setTabItem(value);
  }

  return (
    <div className='bg-gray-100 text-gray-800 flex'>

      <Sidebar
        onDataTabSubmit={handleChooseTabFormSideBar}
        onDataTabItemSubmit={handleChooseTabItemFormSideBar}
      />

      <Content
        tab={tab}
        tabItem={tabItem}
      />

    </div>
  );
}

export default Admin;
