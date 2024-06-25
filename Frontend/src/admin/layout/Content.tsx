import React from 'react'
import Dashboard from '../content/Dashboard';
import AllCentre from '../content/AllCentre';
import AllUser from '../content/all-user/AllUser';
import Withdrawal from '../content/Withdrawal';
import PostCentre from '../content/PostCentre';

type Props = {
  tab: number;
  tabItem: number ;
}

const Content = (props: Props) => {
  return (
    <div className='flex-1'>
      {props.tab === 1 && <Dashboard />}

      {props.tab === 2 && <AllCentre />}

      {props.tab === 3 &&
        <AllUser
          tabItem={props.tabItem}
        />
      }

      {props.tab === 4 && <Withdrawal />}

      {props.tab === 5 && <PostCentre />}
    </div>
  )
}

export default Content
