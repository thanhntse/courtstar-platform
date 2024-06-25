import React, { useState, useEffect, useRef } from 'react';
import us from '../assets/images/US.svg';
import vn from '../assets/images/VN.svg';
import down from '../assets/images/chevron-down.svg';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  // Không có props được truyền vào trong ví dụ này
}

const LanguageSelector: React.FC<LanguageSelectorProps> = () => {
  const { i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<string>(us); // Kiểu của state lang là string với giá trị ban đầu là us
  const dropdownRef = useRef<HTMLDivElement>(null); // Kiểu của ref là HTMLDivElement

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleChoose = (lang: string) => {
    const currentLang = lang === us ? 'en' : 'vi'; // Kiểm tra lang để thay đổi ngôn ngữ
    i18n.changeLanguage(currentLang);
    localStorage.setItem('lang', currentLang);
    setLang(lang);
    setIsOpen(false); // Đóng dropdown khi đã chọn xong
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const curLang = localStorage.getItem('lang');
    if (curLang) {
      setLang(curLang === 'vi' ? vn : us); // Thiết lập ngôn ngữ từ localStorage
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsOpen(false); // Đóng dropdown khi có sự kiện scroll
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative inline-flex" ref={dropdownRef}>
      <button
        className="py-1 ps-1 pe-3 inline-flex items-center gap-x-2 font-semibold text-white w-28"
        onClick={toggleMenu}
      >
        <img className="w-5 h-auto rounded-full" src={lang} alt="current language" />
        <span className="font-medium truncate max-w-[7.5rem]">{lang === us ? 'US' : 'VI'}</span>
        <img src={down} className={isOpen ? 'rotate-180 w-4' : 'w-4'} alt="chevron-down" />
      </button>

      {isOpen && (
        <div className="z-50 fixed top-14 min-w-40 bg-white shadow-gray-800 shadow-md rounded-lg p-2 mt-2">
          <button
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            onClick={() => handleChoose(us)}
          >
            <img src={us} className="w-4 rounded-full" alt="English (US)" />
            <span>English (US)</span>
          </button>
          <button
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            onClick={() => handleChoose(vn)}
          >
            <img src={vn} alt="Việt Nam (VI)" />
            <span>Việt Nam (VI)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
