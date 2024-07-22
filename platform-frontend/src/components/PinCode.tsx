import React, { useEffect, useRef } from 'react';
import PinInput from 'react-pin-input';

interface PinCodeProps {
  clear: boolean;
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
}

const PinCode: React.FC<PinCodeProps> = (props) => {
  const pinRef = useRef<any>(null); // Sử dụng useRef với kiểu any do PinInput không cung cấp kiểu tham chiếu chính xác

  useEffect(() => {
    if (props.clear && pinRef.current) {
      pinRef.current.clear();
    }
  }, [props.clear]);

  return (
    <PinInput
      ref={pinRef}
      length={6}
      initialValue={props.value}
      onChange={(value) => props.onChange(value)}
      type="numeric"
      inputMode="numeric"
      style={{
        padding: '18px',
        display: 'flex',
        justifyContent: 'space-evenly',
        gap: '5px'
      }}
      inputStyle={{
        borderColor: '#e5e7eb',
        borderWidth: '2px',
        borderRadius: '6px',
      }}
      inputFocusStyle={{ borderColor: '#6b7280' }}
      onComplete={props.onComplete}
      autoSelect={true}
      regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
    />
  );
};

export default PinCode;
