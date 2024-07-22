import React from 'react';
import { DropdownItemProps } from './index';

const DropdownItem: React.FC<DropdownItemProps> = ({ item, isSelected, onSelect, className }) => {
  return (
    <div
      className={`w-full py-2 px-6 rounded-lg hover:bg-gray-100 transition-all ease-in-out duration-300 cursor-pointer ${className} ${
        isSelected ? 'bg-gray-200' : ''
      }`}
      onClick={() => onSelect(item)}
      role="option"
      aria-selected={isSelected}
    >
      {item.label}
    </div>
  );
};

export default DropdownItem;
