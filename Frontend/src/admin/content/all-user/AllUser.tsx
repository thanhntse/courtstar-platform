import React from 'react'
import Manager from './Manager';
import Staff from './Staff';
import Customer from './Customer';

type Props = {
  tabItem: number;
}

const AllUser = (props: Props) => {
  return (
    <>
      {props.tabItem === 1 && <Manager />}
      {props.tabItem === 2 && <Staff />}
      {props.tabItem === 3 && <Customer />}
    </>
  )
}

export default AllUser
