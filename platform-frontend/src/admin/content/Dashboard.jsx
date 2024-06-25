import Counter from "../../components/Counter";
import Chart from 'react-apexcharts';
import moment from 'moment';
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import SpinnerLoading from "../../components/SpinnerLoading";

const Dashboard = () => {

  const controller = new AbortController();
  const { signal } = controller;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const load = async () => {
    await axiosInstance.get(`/courtstar/admin/platform`, { signal })
      .then(res => {
        setData(res.data.data)
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

  console.log(data);

  const revenueData = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 20 + 40)
  );
  const centreData = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 5 + 15)
  );
  const userData = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 17 + 25)
  );

  const overviewSeries = [
    {
      name: 'Revenue',
      color: '#2B5A50',
      data: revenueData,
    },
    {
      name: 'User Registration',
      color: '#2563eb',
      data: userData,
    },
    {
      name: 'Centre Registration',
      color: '#9ca3af',
      data: centreData,
    },
  ];

  const overviewOptions = {
    chart: {
      type: "line",
      fontFamily: 'Inter'
    },
    stroke: {
      width: [2.5, 2, 2],
      curve: ['straight', 'smooth', 'smooth'],
      dashArray: [0, 0, 5]
    },
    tooltip: {
      x: {
        show: true,
        formatter: function (val) {
          return moment().subtract(11 - val, 'months').format('MMM YYYY');
        }
      },
      y: [
        {
          title: {
            formatter: function (val, a) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return "$" + val + "M"
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return val + "K"
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return val + "K"
          }
        }
      ]
    },
    xaxis: {
      categories: Array.from({ length: 12 }, (_, index) =>
        moment().subtract(11 - index, 'months').format('MMM YYYY')
      )
    }
  };


  return (
    <div className="py-5 px-7 flex flex-col gap-5">
      <div className="text-3xl font-semibold">
        Dashboard
      </div>
      <div className="bg-white rounded-2xl py-3 px-5 flex flex-col gap-5">

        {loading
          ?
          <SpinnerLoading
            height='80'
            width='80'
            color='#2B5A50'
          />
          :
          <>
            <div className="flex justify-between items-center font-semibold">
              <div className="text-lg">
                Overview
              </div>
              <button className="flex gap-2 items-center text-gray-500 py-2 px-4 border rounded-md hover:bg-primary-green hover:text-white transition-all ease-in-out duration-300">
                <svg
                  width="14" height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.25 8.75V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.91671 4.66667L7.00004 1.75L4.08337 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 1.75V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Export
              </button>
            </div>

            <div className="flex gap-2.5 justify-between text-gray-500">
              <div className="p-4 border rounded-xl text-2xl font-semibold w-full">
                <div className="text-sm font-medium mb-1">
                  Total Revenue
                </div>
                <Counter
                  endNumber={data?.totalRevenue}
                  duration={1000}
                  prefix="$ "
                />
              </div>
              <div className="p-4 border rounded-xl text-2xl font-semibold w-full">
                <div className="text-sm font-medium mb-1">
                  Total Centre
                </div>
                <Counter
                  endNumber={data?.totalCentre}
                  duration={0}
                />
              </div>
              <div className="p-4 border rounded-xl text-2xl font-semibold w-full">
                <div className="text-sm font-medium mb-1">
                  Total User
                </div>
                <Counter
                  endNumber={data?.totalUser}
                  duration={0}
                />
              </div>
            </div>

            <div>
              <Chart
                height="350"
                width="100%"
                options={overviewOptions}
                series={overviewSeries}
              />
            </div>
          </>
        }
      </div>
    </div>
  );
}

export default Dashboard;
