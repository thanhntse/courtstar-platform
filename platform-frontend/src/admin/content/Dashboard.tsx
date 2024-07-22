import Counter from "../../components/Counter";
import Chart from 'react-apexcharts';
import moment from 'moment';
import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import SpinnerLoading from "../../components/SpinnerLoading";
import { useTranslation } from "react-i18next";
import Button from "../../components/button";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const latestDay = Array.from({ length: 10 }, (_, index) =>
  moment().subtract(9 - index, 'days').format("YYYY-MM-DD")
);

const getArrays = (Obj, isMoney) => {
  let arrays: any[] = [];
  latestDay.forEach(e => {
    if (Obj[e]) {
      if (isMoney) arrays.push(Obj[e] * 0.05 / 1000);
      else arrays.push(Obj[e]);
    } else {
      arrays.push(0);
    }
  });
  return arrays;
}

const getRateArrays = (Obj) => {
  let arrays: any[] = [];
  for (let index = 0; index < latestDay.length; index++) {
    if (index === 0) {
      arrays.push(0);
      continue;
    }
    const e1 = latestDay[index];
    const e2 = latestDay[index - 1];
    if (Obj[e1] && Obj[e2]) {
      arrays.push((Obj[e1] - Obj[e2]) / Obj[e2]);
    } else if (Obj[e2]) {
      arrays.push(-1);
    }
    else {
      arrays.push(0);
    }
  }
  return arrays;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const controller = new AbortController();
  const { signal } = controller;
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(
    {
      customers: [],
      managers: [],
      centres: [],
      revenues: [],
      rate: [],
    }
  );

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

  useEffect(() => {
    if (data)
      setChartData(
        ((prev) => ({
          ...prev,
          customers: getArrays(data.customers, false),
          managers: getArrays(data.managers, false),
          centres: getArrays(data.centres, false),
          revenues: getArrays(data.revenues, true),
          rates: getRateArrays(data.revenues)
        }))
      )
  }, [data])

  const revenueSeries = [
    {
      name: t('revenue'),
      color: '#2B5A50',
      data: chartData.revenues,
      type: "bar",
    },
    {
      name: t('profitGrowth'),
      color: '#dc2626',
      data: chartData.rates,
      type: "line",
    },
  ];

  const revenueOptions: ApexCharts.ApexOptions = {
    chart: {
      fontFamily: 'Inter',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      width: [0, 2],
      curve: ['smooth', 'straight'],
    },
    tooltip: {
      x: {
        show: true,
        formatter: function (val) {
          return moment().subtract(10 - val, 'days').format('MMM DD, YYYY');
        }
      },
      y: [
        {
          title: {
            formatter: function (val) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return val + "K" + " VND"
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return Math.round(val * 100) + "%"
          }
        },
      ]
    },
    xaxis: {
      categories: Array.from({ length: 10 }, (_, index) =>
        moment().subtract(9 - index, 'days').format('MMM DD')
      )
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          if (Number.isInteger(val)) {
            return val.toString();
          } else {
            return '';
          }
        }
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '30%'
      }
    },
  };

  const overviewSeries = [
    {
      name: t('registeredCustomer'),
      color: '#2563eb',
      data: chartData.customers,
      type: "line"
    },
    {
      name: t('registeredPartner'),
      color: '#9563eb',
      data: chartData.managers,
      type: "line"
    },
    {
      name: t('approvedCentre'),
      color: '#9ca3af',
      data: chartData.centres,
      type: "line"
    },
  ];

  const overviewOptions: ApexCharts.ApexOptions = {
    chart: {
      fontFamily: 'Inter',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    stroke: {
      width: [3, 3, 3],
      curve: ['smooth', 'smooth', 'smooth'],
      dashArray: [0, 0, 0]
    },
    tooltip: {
      x: {
        show: true,
        formatter: function (val) {
          return moment().subtract(10 - val, 'days').format('MMM DD, YYYY');
        }
      },
      y: [
        {
          title: {
            formatter: function (val) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return val + ""
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return val + ""
          }
        },
        {
          title: {
            formatter: function (val) {
              return val + ":"
            }
          },
          formatter: function (val) {
            return val + ""
          }
        }
      ]
    },
    xaxis: {
      categories: Array.from({ length: 10 }, (_, index) =>
        moment().subtract(9 - index, 'days').format('MMM DD')
      )
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          if (Number.isInteger(val)) {
            return val.toString();
          } else {
            return '';
          }
        }
      }
    }
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const exportToPDF = async () => {
    setExportLoading(true);
    if (contentRef.current) {
      await html2canvas(contentRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`dashboard-export-${moment().format('yyyyMMDDHHmmss')}.pdf`);
      });
    }
    setExportLoading(false);
  };

  return (
    <div className="py-6 w-full flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="text-3xl font-bold">
          {t('dashboard')}
        </div>
        <Button
          label={t('export')}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
          }
          size="medium"
          className="bg-primary-green text-white hover:bg-teal-900 w-32"
          onClick={exportToPDF}
          loading={exportLoading}
        />
      </div>
      {loading
        ?
        <div className="h-[500px] flex items-center justify-center">
          <SpinnerLoading
            height='80'
            width='80'
            color='#2B5A50'
          />
        </div>
        :
        <div ref={contentRef}
          className="w-full flex flex-col gap-5"
        >
          <div className='w-full rounded-lg relative flex justify-between shadow-lg bg-white'>
            <div className='w-full flex flex-col gap-5 justify-center'>
              <div className="text-center font-semibold text-white py-1.5 text-2xl bg-primary-green rounded-t-lg">
                {t('overviewThisWeek')}
              </div>
              <div className='flex gap-10 px-20 pb-4'>

                <div className='py-3 px-5 w-full shadow-md rounded-lg bg-slate-50 font-semibold'>
                  <div className='flex justify-between items-center mb-2'>
                    <div>{t('revenue')}</div>
                  </div>
                  <div className='text-lg flex gap-0.5 font-bold'>
                    <Counter
                      endNumber={data?.weekRevenue * 0.05}
                      duration={1000}
                    />
                    <span className='text-[7px]'>VND</span>
                  </div>
                </div>

                <div className='py-3 px-5 w-full shadow-md rounded-lg bg-slate-50 font-semibold'>
                  <div className='flex justify-between items-center mb-2'>
                    <div>{t('approvedCentre')}</div>
                  </div>
                  <div className='text-lg flex gap-0.5 font-bold'>
                    <Counter
                      endNumber={data?.weekCentre}
                      duration={1000}
                    />
                  </div>
                </div>

                <div className='py-3 px-5 w-full shadow-md rounded-lg bg-slate-50 font-semibold'>
                  {t('registeredPartner')}
                  <div className='text-lg flex gap-0.5 font-bold mt-2'>
                    <Counter
                      endNumber={data?.weekManager}
                      duration={1000}
                    />
                  </div>
                </div>

                <div className='py-3 px-5 w-full shadow-md rounded-lg bg-slate-50 font-semibold'>
                  {t('registeredCustomer')}
                  <div className='text-lg flex gap-0.5 font-bold mt-2'>
                    <Counter
                      endNumber={data?.weekCustomer}
                      duration={1000}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg flex flex-col gap-5">
            <div className="text-center font-semibold text-white py-1.5 text-2xl bg-primary-green rounded-t-lg">
              {t('revenueGrowthChart')}
            </div>
            <div className="flex flex-col gap-5 w-full py-2 px-5">
              <Chart
                height="350"
                width="100%"
                options={revenueOptions}
                series={revenueSeries}
              />
            </div>

          </div>
          <div className="bg-white rounded-lg flex flex-col gap-5">
            <div className="text-center font-semibold text-white py-1.5 text-2xl bg-primary-green rounded-t-lg">
              {t('accountAndCentreRegistrationChart')}
            </div>
            <div className="flex flex-col gap-5 w-full py-2 px-5">
              <Chart
                height="350"
                width="100%"
                options={overviewOptions}
                series={overviewSeries}
              />
            </div>

          </div>
        </div>
      }
    </div>
  );
}

export default Dashboard;
