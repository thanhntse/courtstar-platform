import React from 'react';
import { ColorRing } from 'react-loader-spinner';

interface SpinnerLoadingProps {
  type?: 'page' | 'button';
  height?: string;
  width?: string;
  color: string;
}

const SpinnerLoading: React.FC<SpinnerLoadingProps> = (props) => {
  return (
    <div className={`${props.type === 'page' ? 'h-screen w-screen' : ''} flex items-center justify-center`}>
      <ColorRing
        visible={true}
        height={props.height}
        width={props.width}
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={[props.color, props.color, props.color, props.color, props.color]}
      />
    </div>
  );
};

export default SpinnerLoading;
