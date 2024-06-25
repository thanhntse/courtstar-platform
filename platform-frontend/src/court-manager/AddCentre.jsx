import React, { useEffect, useRef, useState } from "react";
import { imageDb } from '../config/firebaseConfig';
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import InputText from '../components/input-text';
import Dialog from '../components/Dialog';
import Dropdown from '../components/dropdown';
import moment from "moment";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function AddCentre(props) {
  const { t } = useTranslation();
  const [districtSelect, setDistrictSelect] = useState('');
  const [imgUrls, setImgUrls] = useState([]);
  const dropdownRef = useRef();
  const dropdownRef1 = useRef();
  const dropdownRef2 = useRef();
  const [idCentre, setIdCentre] = useState();

  const districts = [
    {
      key: 'thuDucCity',
      label: t('thuDucCity')
    },
    {
      key: 'district1',
      label: t('district1')
    },
    {
      key: 'district3',
      label: t('district3')
    },
    {
      key: 'district4',
      label: t('district4')
    },
    {
      key: 'district5',
      label: t('district5')
    },
    {
      key: 'district6',
      label: t('district6')
    },
    {
      key: 'district7',
      label: t('district7')
    },
    {
      key: 'district8',
      label: t('district8')
    },
    {
      key: 'district10',
      label: t('district10')
    },
    {
      key: 'district11',
      label: t('district11')
    },
    {
      key: 'district12',
      label: t('district12')
    },
    {
      key: 'binhTanDistrict',
      label: t('binhTanDistrict')
    },
    {
      key: 'binhThanhDistrict',
      label: t('binhThanhDistrict')
    },
    {
      key: 'goVapDistrict',
      label: t('goVapDistrict')
    },
    {
      key: 'phuNhuanDistrict',
      label: t('phuNhuanDistrict')
    },
    {
      key: 'tanBinhDistrict',
      label: t('tanBinhDistrict')
    },
    {
      key: 'tanPhuDistrict',
      label: t('tanPhuDistrict')
    },
    {
      key: 'nhaBeProvince',
      label: t('nhaBeProvince')
    },
    {
      key: 'canGioProvince',
      label: t('canGioProvince')
    },
    {
      key: 'cuChiProvince',
      label: t('cuChiProvince')
    },
    {
      key: 'hocMonProvince',
      label: t('hocMonProvince')
    },
    {
      key: 'binhChanhProvince',
      label: t('binhChanhProvince')
    }
  ];


  const handleSelectDistrict = (item) => {
    if (item) {
      setDistrictSelect(item.key);
      // setCentreForm(prevState => {
      //   // List of known districts for comparison
      //   const knownDistricts = districts.map(district => district);
      //   const addressParts = prevState.address.split(',').map(part => part);

      //   // Check if the last part of the address matches any known district
      //   const lastPart = addressParts[addressParts.length - 1].toLowerCase();
      //   const isLastPartDistrict = knownDistricts.includes(lastPart);

      //   // Remove the last part if it's a district
      //   const updatedAddressParts = isLastPartDistrict ? addressParts.slice(0, -1) : addressParts;

      //   const updatedAddress = updatedAddressParts.join(', ');

      //   return {
      //     ...prevState,
      //     address: (updatedAddress ? updatedAddress + ", " : "") + item
      //   };
      // });
      setCentreForm(prevState => ({
        ...prevState,
        district: item.key
      }));
    }
  };

  const handleClose = (value) => {
    props.setIsOpen();
    props.dataIdCentre(value);
  };

  const items = generate24Hours();
  function generate24Hours() {
    let hours = [];
    for (let i = 0; i < 24; i++) {
      let hour = i < 10 ? `0${i}:00` : `${i}:00`;
      hours.push({ key: i, label: hour });
    }
    return hours;
  }

  const [centreForm, setCentreForm] = useState({
    name: '',
    address: '',
    district: '',
    openTime: '',
    closeTime: '',
    pricePerHour: '',
    numberOfCourts: '',
    description: '',
    approveDate: moment().format('yyyy-MM-DD'),
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCentreForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectOpenTime = (item) => {
    if (item)
      setCentreForm(prevState => ({
        ...prevState,
        openTime: item.label
      }));
  };

  const handleSelectCloseTime = (item) => {
    if (item)
      setCentreForm(prevState => ({
        ...prevState,
        closeTime: item.label
      }));
  };

  const handleImageUpload = (selectedImg) => {
    if (selectedImg !== null) {
      const imgRef = ref(imageDb, `files/${v4()}`);
      uploadBytes(imgRef, selectedImg).then(value => {
        getDownloadURL(value.ref).then(url => {
          setImgUrls(prevUrls => [...prevUrls, { url, ref: value.ref }]);
        });
      });
    }
  };

  const handleDeleteImage = (imgRef, url) => {
    deleteObject(imgRef).then(() => {
      setImgUrls(prevUrls => prevUrls.filter(img => img.url !== url));
      setCentreForm(prevState => ({
        ...prevState,
        images: prevState.images.filter(image => image !== url)
      }));
    }).catch(error => {
      console.error("Error deleting image: ", error);
    });
  };

  useEffect(() => {
    setCentreForm(prevState => ({
      ...prevState,
      images: imgUrls.map(img => img.url)
    }));
  }, [imgUrls]);

  const handleImageChange = (e) => {
    if (imgUrls.length < 6) {
      const selectedImg = e.target.files[0];
      handleImageUpload(selectedImg);
    } else {
      toast.error('Only upload a maximum of 6 photos', {
        toastId: 'Upload-photo-error'
      });
    }
  };

  const submit = async () => {
    if (centreForm.images.length === 0) {
      return toast.error('You must upload at least 1 image', {
        toastId: 'upload-img-error'
      });
    }

    await axiosInstance.post(`/courtstar/centre/create`, centreForm)
      .then(res => {
        console.log(res.data);
        toast.success("Create Successfully!", {
          toastId: 'add-centre-success'
        });
        setImgUrls([]);
        handleClose(res.data.data.id);
      })
      .catch(error => {
        console.log(error.message);
        toast.error(error.message, {
          toastId: 'add-centre-error'
        });
      })
      .finally();
  }

  console.log(centreForm?.description);

  const clearForm = () => {
    const deleteImagesPromises = imgUrls.map(img => deleteObject(img.ref));
    Promise.all(deleteImagesPromises)
      .then(() => {
        setImgUrls([]);
        setCentreForm({
          name: '',
          address: '',
          district: '',
          openTime: '',
          closeTime: '',
          pricePerHour: '',
          numberOfCourts: '',
          description: '',
          approveDate: moment().format('yyyy-MM-DD'),
          images: []
        });
        handleClearDropdown();
      })
      .catch(error => {
        console.error("Error deleting images: ", error);
      });
  }

  const handleClearDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.clearFormDropdown();
    }
    if (dropdownRef1.current) {
      dropdownRef1.current.clearFormDropdown();
    }
    if (dropdownRef2.current) {
      dropdownRef2.current.clearFormDropdown();
    }
  };

  const html = (
    <div>
      <div>
        {imgUrls.length > 0 ?
          <img src={imgUrls[0].url} alt="Centre" className='h-64 w-fit mx-auto rounded-xl' />
          :
          <img
            src='https://i0.wp.com/y20india.in/wp-content/plugins/ultimate-post/assets/img/ultp-fallback-img.png?w=840&ssl=1'
            alt="dummy-img"
            className="h-64 w-fit mx-auto rounded-xl"
          />
        }
      </div>
      <div className='flex gap-2 my-2 pt-1.5 border rounded-md bg-white overflow-hidden mx-auto relative'>
        <div
          id='image-scroll-container'
          className='flex gap-2 overflow-x-auto pb-1.5 px-2'
        >
          <div
            className='flex justify-center items-center border rounded-lg cursor-pointer h-16 min-w-24 px-7'
            onClick={() => document.getElementById('image-upload-input').click()}
          >
            <span className='text-4xl font-bold'>+</span>
          </div>
          <input
            id='image-upload-input'
            type="file"
            onChange={handleImageChange}
            className='hidden'
          />
          {imgUrls.map((img, index) => (
            <div key={index} className="image-container relative">
              <img
                src={img.url}
                alt={`Court ${index + 1}`}
                className='min-w-24 max-w-24 h-16 rounded-lg object-cover object-center '
              />
              <svg
                onClick={() => handleDeleteImage(img.ref, img.url)}
                xmlns="http://www.w3.org/2000/svg"
                width="20" height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor" s
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-x absolute right-1 top-1 bg-white rounded-full cursor-pointer hover:scale-110 ease-in-out duration-200">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div className='mx-auto'>
        <div className='mb-4'>
          <InputText
            id="name"
            name="name"
            placeholder={t('enterCentreName')}
            label={t('centreName')}
            value={centreForm.name}
            onchange={handleChange}
          />
        </div>
        <div className='mb-4 flex items-end gap-3'>
          <InputText
            id="address"
            name="address"
            placeholder={t('enterCentreAddress')}
            label={t('centreAddress')}
            value={centreForm.address}
            onchange={handleChange}
          />
          <Dropdown
            ref={dropdownRef}
            items={districts}
            placeholder={t('selectTheDistrict')}
            onSelect={handleSelectDistrict}
          />
        </div>
        <div className='mb-4'>
          <InputText
            id="numberOfCourts"
            name="numberOfCourts"
            placeholder={t('enterNumberOfCourts')}
            label={t('numberOfCourts')}
            value={centreForm.numberOfCourts}
            onchange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <InputText
            id="pricePerHour"
            name="pricePerHour"
            type="number"
            placeholder={t('enterPricePerHour')}
            label={t('pricePerHour')}
            value={centreForm.pricePerHour}
            onchange={handleChange}
          />
        </div>
      </div>
      <div className='flex gap-4 mb-3'>
        <div className='basis-1/2'>
          <div className='w-full flex flex-col gap-2 text-gray-800 font-semibold mb-2'>
            {t('openTimes')}:
          </div>
          <div className='flex gap-4 items-center'>
            <Dropdown
              ref={dropdownRef1}
              placeholder={t('selectOpenTime')}
              items={items}
              onSelect={handleSelectOpenTime}
              dir='up'
            />
          </div>
        </div>
        <div className='basis-1/2'>
          <div className='w-full flex flex-col gap-2 text-gray-800 font-semibold mb-2'>
            {t('closeTime')}:
          </div>
          <div className='flex gap-4 items-center'>
            <Dropdown
              ref={dropdownRef2}
              placeholder={t('selectCloseTime')}
              items={items}
              onSelect={handleSelectCloseTime}
              dir='up'
            />
          </div>
        </div>
      </div>
      <div>
        <div className="w-full flex flex-col gap-2 text-gray-800 font-semibold mb-2">Description:</div>
        <CKEditor
          editor={ClassicEditor}
          data={centreForm?.description}
          onChange={(event, editor) => {
            const data = editor.getData();
            setCentreForm(prevState => ({
              ...prevState,
              description: data
            }))
          }}
        />
      </div>
      {/* <div className="bg-white mt-4 mx-auto">
        <div className='mb-4'>
          thanh ngu
        </div>
      </div> */}
    </div>
  );

  return (
    <div>
      <Dialog
        html={html}
        isOpen={props.isOpen}
        submit={submit}
        setIsOpen={handleClose}
        title={t('centreInformation')}
        clearForm={clearForm}
      />
    </div>
  );
}

export default AddCentre;
