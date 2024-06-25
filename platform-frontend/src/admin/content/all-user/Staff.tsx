import React, { useEffect, useState } from 'react'
import Dropdown from "../../../components/dropdown";
import InputText from "../../../components/input-text";
import axiosInstance from '../../../config/axiosConfig';
import SpinnerLoading from '../../../components/SpinnerLoading';
import { toast } from 'react-toastify';
import Pagination from '../../../components/pagination';

type Props = {}

const Staff = (props: Props) => {

  const controller = new AbortController();
  const { signal } = controller;
  const [listStaff, setListStaff] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const load = async () => {
    await axiosInstance.get(`/courtstar/staff`, { signal })
      .then(res => {
        setListStaff(res.data.data.map(item => {
          return { ...item, loading: false };
        }));
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(
        () => {
          setLoading(false);
        }
      );
  }

  useEffect(() => {
    load();
  }, [])

  console.log(listStaff);

  const deleteManager = async (id, index) => {
    setListStaff(prevListCourt => {
      // Create a copy of the previous state array
      const updatedListCourt = [...prevListCourt];

      // Update the specific element's loading property
      updatedListCourt[index] = { ...updatedListCourt[index], loading: true };

      return updatedListCourt;
    });
    await axiosInstance.post(`/courtstar/account/${id}`, { signal })
      .then(res => {
        console.log(res.data);
        toast.success("Delete Successfully!", {
          toastId: 'delete-manager-success'
        });
        load();
      })
      .catch(error => {
        console.log(error.message);
        toast.error(error.message, {
          toastId: 'delete-manager-error'
        });
      })
      .finally(
        () => {
          setLoadingDelete(false);
        }
      );
  }
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastStaff = currentPage * itemsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;
  const currentListStaff = listStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  return (
    <div className="py-5 px-7">
      <div className="flex justify-between">
        <div className="text-3xl font-bold">
          Staffs
        </div>
      </div>

      <div className="bg-white rounded-xl mt-5">
        <div className="px-6 pt-6 grid grid-cols-12 gap-2">
          <div className="col-span-4 ">
            <InputText
              id="name"
              name="name"
              placeholder="Enter the user's name"
              label="Name"
              value=''
              onchange={() => { }}
            />
          </div>
          <div className="col-span-4 ">
            <InputText
              id="email"
              name="email"
              placeholder="Enter the user's email"
              label="Email"
              value=''
              onchange={() => { }}
            />
          </div>
          <div className="col-span-3 ">
            <InputText
              id="phone"
              name="phone"
              placeholder="Enter the user's phone number"
              label="Phone number"
              value=''
              onchange={() => { }}
            />
          </div>
          <div className="col-span-1 ">

          </div>
        </div>
        {loading
          ?
          <SpinnerLoading
            height='80'
            width='80'
            color='#2B5A50'
          />
          :
          <div className="divide-y-2 font-medium">
            {currentListStaff?.map((manager, index) => (
              <div
                key={manager.account.id}
              >
                <div
                  className="px-6 py-3 grid grid-cols-12 gap-2 "
                >
                  <div className="col-span-4 content-center truncate ml-4">
                    {manager.account.firstName} {manager.account.lastName}
                  </div>
                  <div className="col-span-4 content-center truncate ml-4">
                    {manager.account.email}
                  </div>
                  <div className="col-span-3 content-center ml-4">
                    {manager.account.phone}
                  </div>
                  <div className="col-span-1 content-center justify-self-center">
                    {manager.loading
                      ?
                      <SpinnerLoading
                        height='30'
                        width='30'
                        color='#2B5A50'
                      />
                      :
                      <>
                        {
                          manager.account.deleted
                            ?
                            <div
                              className='p-1.5 rounded-full text-red-500'
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
                                className="lucide lucide-trash-2"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                                <line x1="2" y1="2" x2="22" y2="22" />
                              </svg>
                            </div>
                            :
                            <div
                              className="p-1.5 rounded-full hover:bg-red-600 hover:text-white cursor-pointer ease-in-out duration-300"
                              onClick={() => deleteManager(manager.account.id, index)}
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
                                className="lucide lucide-trash-2"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </div>
                        }
                      </>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>
                  { listStaff.length > itemsPerPage
                    &&
                    <Pagination
                      totalItems={listStaff.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                      }

    </div>
  )
}

export default Staff
